/* eslint-disable security/detect-non-literal-fs-filename -- Paths come from Cargo's own output and this project's folders, not user input. */

// ── External Dependencies & Registrations
import { setTimeout as delay } from 'node:timers/promises';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import satisfies from 'spdx-satisfies';

// ── Local Framework
import { readJSONFile, readTextFile, readTextFileOrNull, RUST_WORKSPACE_PATH, spawnCommandToFile } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** A crate compiled into the project's WebAssembly, with where to find its licence and its release history. */
export interface RustCrate {
    name: string;
    version: string;
    licenseExpression: string;
    repository: string;
    licenseFiles: { label: string; path: string }[]; // Relative to the 'licenses' folder.
    publishedDate: string;
    latestVersion: string;
    latestPublishedDate: string;
}

/** One line of Cargo's dependency tree. The project's own crates are in it too, so the tree reads from them down. */
export interface RustCrateTreeItem {
    name: string;
    version: string;
    depth: number;
    isOwn: boolean;
}

interface CargoMetadata {
    packages: { name: string; version: string; manifest_path: string }[];
}

interface CratesIOResponse {
    crate?: { max_stable_version?: string | null; max_version?: string };
    versions?: { num: string; created_at: string }[];
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const CARGO_METADATA_PATH = 'licenses/cargoMetadata.json';
const CARGO_TREE_PATH = 'licenses/cargoTree.txt';
const CRATES_IO_REQUEST_INTERVAL = 1000; // crates.io asks automated clients for no more than one request a second.
const CRATES_IO_USER_AGENT = 'dpuse-development (https://github.com/dpuse/dpuse-development)'; // crates.io refuses requests without one.
const LICENSE_FILE_PATTERN = /^(?:copying|licen[cs]e|unlicense)/i;
const WASM_TARGET = 'wasm32-unknown-unknown';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Lists the crates compiled into the project's WebAssembly, checks each licence against those allowed, and copies
 *  each licence file to 'licenses/downloads'. Returns null for a project with no Rust code. Only normal dependencies
 *  built for WebAssembly are followed: development and build dependencies, and macros (which run only while compiling),
 *  put none of their code in the output. */
export async function documentRustCrates(stepLabel: string, allowedLicenses: string): Promise<{ crates: RustCrate[]; treeItems: RustCrateTreeItem[] } | null> {
    if ((await readTextFileOrNull(RUST_WORKSPACE_PATH)) === null) return null;

    const cargoArguments = ['--manifest-path', RUST_WORKSPACE_PATH, '--locked'];
    const treeArguments = ['tree', ...cargoArguments, '--workspace', '--edges', 'normal,no-proc-macro', '--target', WASM_TARGET, '--prefix', 'depth', '--format', '{p}|{l}|{r}'];
    await spawnCommandToFile(stepLabel, 'cargo', treeArguments, CARGO_TREE_PATH);
    await spawnCommandToFile(stepLabel, 'cargo', ['metadata', ...cargoArguments, '--format-version', '1', '--filter-platform', WASM_TARGET], CARGO_METADATA_PATH);
    const treeLines = parseCargoTree(await readTextFile(CARGO_TREE_PATH));
    const metadata = await readJSONFile<CargoMetadata>(CARGO_METADATA_PATH);
    // Both hold paths on this machine, so are not kept.
    await fs.rm(CARGO_TREE_PATH, { force: true });
    await fs.rm(CARGO_METADATA_PATH, { force: true });

    const cratesByKey = new Map<string, RustCrate>();
    for (const line of treeLines) {
        if (line.isOwn || cratesByKey.has(`${line.name}@${line.version}`)) continue;
        cratesByKey.set(`${line.name}@${line.version}`, {
            name: line.name,
            version: line.version,
            licenseExpression: line.licenseExpression,
            repository: line.repository === '' ? `https://crates.io/crates/${line.name}` : line.repository,
            licenseFiles: [],
            publishedDate: '',
            latestVersion: '',
            latestPublishedDate: ''
        });
    }
    const crates = cratesByKey.values().toArray();

    checkCrateLicenses(crates, allowedLicenses);
    for (const crate of crates) crate.licenseFiles = await copyLicenseFiles(crate, metadata);
    await addReleaseDetails(crates);

    return { crates, treeItems: treeLines.map(({ name, version, depth, isOwn }) => ({ name, version, depth, isOwn })) };
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// Each line reads '<depth><name> v<version>[ (<source>)]|<licence>|<repository>', with ' (*)' added where Cargo has
// already listed the crate's dependencies higher up. Crate names never start with a digit, so the depth is the leading
// digits. A crate whose source is a folder, rather than a registry or Git URL, is one of the project's own.
function parseCargoTree(text: string): (RustCrateTreeItem & { licenseExpression: string; repository: string })[] {
    const lines = [];
    for (const line of text.split('\n')) {
        const [crateText = '', licenseExpression = '', linkText = ''] = line.trim().split('|', 3);
        const depthText = /^\d+/.exec(crateText)?.[0];
        if (depthText === undefined) continue;
        const [name = '', versionText = '', ...sourceParts] = crateText.slice(depthText.length).split(' ');
        const source = sourceParts.join(' ').replace(/^\(/, '').replace(/\)$/, '');
        const isOwn = source !== '' && !source.includes('://');
        const link = linkText.replace(/ \(\*\)$/, '');
        lines.push({ name, version: versionText.replace(/^v/, ''), depth: Number(depthText), isOwn, licenseExpression, repository: link });
    }
    return lines;
}

// Cargo's licence field is an SPDX expression, so it is checked as one: 'MIT OR Apache-2.0' needs either, while
// '(MIT OR Apache-2.0) AND Unicode-3.0' also needs 'Unicode-3.0'. The older 'MIT/Apache-2.0' form means 'OR'.
function checkCrateLicenses(crates: RustCrate[], allowedLicenses: string): void {
    const allowedIdentifiers = allowedLicenses.split(';').filter((identifier) => isLicenseIdentifier(identifier));
    const failures = crates.filter((crate) => !isLicenseAllowed(crate.licenseExpression, allowedIdentifiers));
    if (failures.length === 0) return;
    const failureList = failures.map((crate) => `${crate.name}@${crate.version} (${crate.licenseExpression === '' ? 'no licence' : crate.licenseExpression})`).join(', ');
    throw new Error(`Rust crates with licences not allowed: ${failureList}.`);
}

// The allow list can also name licences that are not SPDX identifiers, such as a licence page, which only npm packages use.
function isLicenseIdentifier(identifier: string): boolean {
    try {
        return satisfies(identifier, [identifier]);
    } catch {
        return false;
    }
}

function isLicenseAllowed(licenseExpression: string, allowedIdentifiers: string[]): boolean {
    try {
        return satisfies(licenseExpression.replaceAll('/', ' OR '), allowedIdentifiers);
    } catch {
        return false; // Not a licence expression at all, so it cannot be confirmed as allowed.
    }
}

// The licence files sit beside the crate's own 'Cargo.toml' in Cargo's download cache.
async function copyLicenseFiles(crate: RustCrate, metadata: CargoMetadata): Promise<{ label: string; path: string }[]> {
    const cratePackage = metadata.packages.find((candidate) => candidate.name === crate.name && candidate.version === crate.version);
    if (cratePackage == null) return [];
    const crateDirectory = path.dirname(cratePackage.manifest_path);
    const directoryEntries = await fs.readdir(crateDirectory);
    const fileNames = directoryEntries.filter((fileName) => LICENSE_FILE_PATTERN.test(fileName)).toSorted((a, b) => a.localeCompare(b, 'en'));
    await fs.mkdir('licenses/downloads', { recursive: true });
    const licenseFiles = [];
    for (const fileName of fileNames) {
        const copiedPath = `downloads/${crate.name}@${crate.version}-${fileName}`;
        await fs.copyFile(path.join(crateDirectory, fileName), path.join('licenses', copiedPath));
        licenseFiles.push({ label: fileName, path: copiedPath });
    }
    return licenseFiles;
}

// One request at a time, as crates.io asks. A crate it cannot answer for is shown without dates.
async function addReleaseDetails(crates: RustCrate[]): Promise<void> {
    for (const [index, crate] of crates.entries()) {
        if (index > 0) await delay(CRATES_IO_REQUEST_INTERVAL);
        try {
            const response = await fetch(`https://crates.io/api/v1/crates/${encodeURIComponent(crate.name)}`, { headers: { 'User-Agent': CRATES_IO_USER_AGENT } });
            if (!response.ok) continue;
            const data = (await response.json()) as CratesIOResponse;
            const releaseDates = new Map((data.versions ?? []).map((version) => [version.num, version.created_at]));
            crate.latestVersion = data.crate?.max_stable_version ?? data.crate?.max_version ?? '';
            crate.publishedDate = releaseDates.get(crate.version) ?? '';
            crate.latestPublishedDate = crate.latestVersion === crate.version ? '' : (releaseDates.get(crate.latestVersion) ?? '');
        } catch {
            // Ignore network errors.
        }
    }
}

/* eslint-enable security/detect-non-literal-fs-filename -- End of the Rust crate documentation's file access. */
