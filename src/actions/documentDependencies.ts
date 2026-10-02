// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import { init as initLicenseChecker } from 'license-checker-rseidelsohn';
import type { InitOpts } from 'license-checker-rseidelsohn';

// ── Local Framework
import { SHIPPED_PACKAGES_FILE_NAME } from '@/vite';
import type { ShippedPackagesRecord } from '@/vite';
import { clearDirectory, logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFileOrNull, spawnCommandToFile, writeReadmeSection } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface License {
    name: string;
    repository: string;
    licenseTypes: string;
    installedVersion: string;
    latestVersion: string;
    latestPublishedDate: string;
    author: string;
    publishedDate: string;
    licenseFileLink?: string;
}

interface ProductionPackageLicense {
    licenses: string;
    repository?: string;
    publisher?: string;
    email?: string;
    path?: string;
    licenseFile?: string;
}

interface PackageLock {
    packages?: Record<string, PackageLockEntry>;
}

interface PackageLockEntry {
    name?: string;
    version?: string;
    link?: boolean;
    resolved?: string;
    dependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    peerDependenciesMeta?: Record<string, { optional?: boolean }>;
}

interface NpmPackageTree {
    version?: string;
    dependencies?: Record<string, NpmPackageTree>;
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const START_MARKER = '<!-- DEPENDENCY_LICENSES_START -->';
const END_MARKER = '<!-- DEPENDENCY_LICENSES_END -->';
const LICENSES_HEADING = '## Dependency Licenses';
const SHIPPED_PACKAGES_RECORD_PATH = `bundle-analysis-reports/${SHIPPED_PACKAGES_FILE_NAME}`; // Written by the 'recordShippedPackages' build plugin.
const LICENSE_TREE_PATH = 'licenses/licenseTree.json';

const DEPENDENCY_TREE_INTRO =
    "The dependency tree below lists every package in this project — direct and transitive — along with its installed version, release date, and update status. Packages flagged ❗ have a newer version available; ⚠️ indicates a package that hasn't been updated in the last 6 months or longer. Neither flag necessarily indicates a problem: we let new releases stabilise before upgrading, and some packages are mature and stable (have limited or no dependencies), so they require no active development.";

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Identify licenses of the project's production and peer dependencies. Updates the table in the Dependency Licenses
 *  section of this page and summary files licenses.json and licenseTree.json in th licenses directory of this
 *  repository. Also downloads a copy of dependency license to `licenses/downloads'. */
export async function documentDependencies(allowedLicenses = 'MIT'): Promise<void> {
    try {
        logOperationHeader('Document Dependencies');

        const rootPackage = await readJSONFile<{ name?: string; version?: string }>('package.json');

        if (rootPackage.name === '@dpuse/dpuse-development' || rootPackage.name === '@dpuse/eslint-config-dpuse') {
            await skipDependencyDocumentation(rootPackage.name);
            logOperationSuccess('Dependencies documented');
            return;
        }

        await clearDirectory('1️⃣  Clear downloaded licenses', 'licenses/downloads');
        const lockPackages = await readLockPackages();
        const shippedRecord = await readShippedRecord();

        if (shippedRecord === null) {
            // No build record, such as for a project not built with Vite: fall back to the declared dependencies.
            const unshippedPackages = listUnshippedPackages(lockPackages);
            await checkLicenses('2️⃣  Identify production licenses', allowedLicenses, [rootPackage.name ?? '', ...unshippedPackages], true);
            await spawnCommandToFile('3️⃣  Identify transitive dependencies', 'npm', ['ls', '--all', '--json', '--omit=dev'], LICENSE_TREE_PATH);
            await insertDeclaredLicensesIntoReadme('4️⃣ ', allowedLicenses, new Set(unshippedPackages));
        } else {
            const shippedKeys = collectShippedKeys(shippedRecord, lockPackages);
            const installedKeys = listInstalledKeys(lockPackages);
            const notShipped = installedKeys.filter((packageKey) => !shippedKeys.has(packageKey));
            // Not limited to production dependencies: a package listed for development, such as an icon set, still ships
            // when the build bundles it.
            await checkLicenses('2️⃣  Identify shipped licenses', allowedLicenses, [rootPackage.name ?? '', ...notShipped], false);
            warnOfMissingPackages(shippedKeys, new Set(installedKeys));
            await fs.rm(LICENSE_TREE_PATH, { force: true }); // The installed tree describes something else, so is no longer kept.
            await insertShippedLicensesIntoReadme('3️⃣ ', allowedLicenses);
        }

        logOperationSuccess('Dependencies documented');
    } catch (error) {
        console.error('❌  Error documenting dependencies', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

async function skipDependencyDocumentation(name: string): Promise<void> {
    logStepHeader(`1️⃣  Skip: ${name} is a development-only tool and is never part of a production release.`);

    const message = `> [!WARNING]\n> Dependency licenses are not documented here: ${name} is a development-only tool and is never part of a production release.`;

    await writeReadmeSection(`${LICENSES_HEADING}\n\n${message}`, START_MARKER, END_MARKER);
}

async function insertDeclaredLicensesIntoReadme(stepIcon: string, allowedLicenses: string, unshippedPackages: Set<string>): Promise<void> {
    logStepHeader(`${stepIcon} Insert licenses into 'README.md'`);

    const licenseTree = await readJSONFile<NpmPackageTree>(LICENSE_TREE_PATH);
    const licensesByKey = await readLicenses();

    const licensesIntro = buildLicensesIntro(allowedLicenses, false);
    let licensesContent = `${licensesIntro}\n\n|Dependency|Version|License(s)|Document|\n|:-|:-:|:-|:-|\n`;
    for (const license of licensesByKey.values()) {
        licensesContent += formatLicenseRow(license);
    }

    const treeItems: string[] = [];
    if (licenseTree.dependencies != null) {
        walkTreeList(licenseTree.dependencies, licensesByKey, unshippedPackages, treeItems, 0);
    }
    const treeContent = `${DEPENDENCY_TREE_INTRO}\n\n${treeItems.join('\n')}`;

    await writeReadmeSection(`${LICENSES_HEADING}\n\n${licensesContent.trimEnd()}\n\n### Dependency Tree\n\n${treeContent}`, START_MARKER, END_MARKER);
}

// One table of exactly what the build ships, each package with its release and whether a newer one is out.
async function insertShippedLicensesIntoReadme(stepIcon: string, allowedLicenses: string): Promise<void> {
    logStepHeader(`${stepIcon} Insert licenses into 'README.md'`);

    const licensesByKey = await readLicenses();
    const sortedLicenses = licensesByKey
        .values()
        .toArray()
        .toSorted((a, b) => a.name.localeCompare(b.name, 'en') || a.installedVersion.localeCompare(b.installedVersion, 'en'));
    let licensesContent = `${buildLicensesIntro(allowedLicenses, true)}\n\n|Dependency|Version|Release|License(s)|Document|\n|:-|:-:|:-|:-|:-|\n`;
    for (const license of sortedLicenses) {
        licensesContent += formatShippedLicenseRow(license);
    }

    await writeReadmeSection(`${LICENSES_HEADING}\n\n${licensesContent.trimEnd()}`, START_MARKER, END_MARKER);
}

async function readLicenses(): Promise<Map<string, License>> {
    const licenses = await readJSONFile<Record<string, ProductionPackageLicense>>('licenses/licenses.json');
    const licensesByKey = new Map<string, License>();
    for (const [key, value] of Object.entries(licenses)) {
        licensesByKey.set(key, parseLicenseEntry(key, value));
    }
    await Promise.all(
        licensesByKey.values().map(async (license) => {
            const data = await fetchNpmData(license.name, license.installedVersion);
            license.latestVersion = data.latestVersion;
            license.latestPublishedDate = data.latestPublishedDate;
            license.publishedDate = data.publishedDate;
        })
    );
    return licensesByKey;
}

async function checkLicenses(stepLabel: string, allowedLicenses: string, excludedKeys: string[], isProductionOnly: boolean): Promise<void> {
    logStepHeader(stepLabel);
    await new Promise<void>((resolve, reject) => {
        const options: InitOpts & { files: string; relativeModulePath: boolean } = {
            start: process.cwd(),
            production: isProductionOnly,
            json: true,
            files: 'licenses/downloads',
            relativeModulePath: true,
            relativeLicensePath: true,
            onlyAllow: allowedLicenses,
            excludePackages: excludedKeys.join(';'),
            out: 'licenses/licenses.json'
        };
        initLicenseChecker(options, (error: Error | undefined) => {
            if (error == null) {
                resolve();
            } else {
                reject(error);
            }
        });
    });
}

async function readLockPackages(): Promise<Record<string, PackageLockEntry>> {
    const lockText = await readTextFileOrNull('package-lock.json');
    return lockText === null ? {} : ((JSON.parse(lockText) as PackageLock).packages ?? {});
}

async function readShippedRecord(): Promise<ShippedPackagesRecord | null> {
    const recordText = await readTextFileOrNull(SHIPPED_PACKAGES_RECORD_PATH);
    return recordText === null ? null : (JSON.parse(recordText) as ShippedPackagesRecord);
}

// The recorded packages, plus each package the build leaves to be installed by name, with whatever that one brings.
function collectShippedKeys(record: ShippedPackagesRecord, lockPackages: Record<string, PackageLockEntry>): Set<string> {
    const shippedKeys = new Set(record.packages);
    for (const externalName of record.external) {
        const lockPath = resolveLockPath(lockPackages, '', externalName);
        if (lockPath === undefined) continue;
        for (const shippedPath of [lockPath, ...findShippedPaths(lockPackages, lockPath)]) {
            const entry = lockPackages[shippedPath];
            if (entry?.version !== undefined) shippedKeys.add(formatPackageKey(shippedPath, entry));
        }
    }
    return shippedKeys;
}

function listInstalledKeys(lockPackages: Record<string, PackageLockEntry>): string[] {
    const installedKeys = new Set<string>();
    for (const [lockPath, entry] of Object.entries(lockPackages)) {
        if (lockPath !== '' && entry.version !== undefined) installedKeys.add(formatPackageKey(lockPath, entry));
    }
    return [...installedKeys];
}

// A recorded package that is not installed means the record is from an older build, so its licence goes unchecked.
function warnOfMissingPackages(shippedKeys: Set<string>, installedKeys: Set<string>): void {
    const missingKeys = [...shippedKeys.difference(installedKeys)];
    if (missingKeys.length > 0) console.warn(`⚠️   Not installed, so not checked; rebuild to refresh the record: ${missingKeys.join(', ')}`);
}

function formatPackageKey(lockPath: string, entry: PackageLockEntry): string {
    const name = entry.name ?? lockPath.slice(lockPath.lastIndexOf('node_modules/') + 'node_modules/'.length);
    return `${name}@${String(entry.version)}`;
}

// Packages installed but never shipped, as 'name@version'. A package ships when the project's own dependencies reach it
// through dependencies, optional dependencies or required peers. Optional peers are not followed: TypeScript as
// valibot's optional peer, or Vite as vue-router's, is installed only because a development tool needs it. The tree is
// walked rather than npm's 'dev' flags trusted, as npm marks some packages under a development-only one as merely
// 'optional', such as lightningcss's platform binary under Vite. The licence checker follows every link, so without
// this it would count such packages as shipped. A package also installed, at the same version, for a shipped reason is kept.
function listUnshippedPackages(lockPackages: Record<string, PackageLockEntry>): string[] {
    const shippedPaths = findShippedPaths(lockPackages, '');
    const shipped = new Set<string>();
    const unshipped = new Set<string>();
    for (const [lockPath, entry] of Object.entries(lockPackages)) {
        if (lockPath === '' || entry.version === undefined) continue;
        const packageKey = formatPackageKey(lockPath, entry);
        if (shippedPaths.has(lockPath)) shipped.add(packageKey);
        else unshipped.add(packageKey);
    }
    return unshipped
        .values()
        .filter((packageKey) => !shipped.has(packageKey))
        .toArray();
}

// The lock file paths reached from a starting entry, the project's own by default, following the links that ship with a package.
function findShippedPaths(packages: Record<string, PackageLockEntry>, startPath: string): Set<string> {
    const shippedPaths = new Set<string>();
    const pendingPaths = [startPath];
    while (pendingPaths.length > 0) {
        const fromPath = pendingPaths.pop() ?? '';
        const entry = packages[fromPath];
        if (entry === undefined) continue;
        for (const name of listShippedDependencyNames(entry)) {
            const lockPath = resolveLockPath(packages, fromPath, name);
            if (lockPath === undefined || shippedPaths.has(lockPath)) continue;
            shippedPaths.add(lockPath);
            pendingPaths.push(lockPath);
        }
    }
    return shippedPaths;
}

function listShippedDependencyNames(entry: PackageLockEntry): string[] {
    const requiredPeerNames = Object.keys(entry.peerDependencies ?? {}).filter((name) => entry.peerDependenciesMeta?.[name]?.optional !== true);
    return [...Object.keys(entry.dependencies ?? {}), ...Object.keys(entry.optionalDependencies ?? {}), ...requiredPeerNames];
}

// Finds a dependency where Node would: in the package's own 'node_modules', then in each enclosing one up to the
// project's. A linked package, such as a workspace, resolves to the folder it links to.
function resolveLockPath(packages: Record<string, PackageLockEntry>, fromPath: string, name: string): string | undefined {
    let basePath = fromPath;
    for (;;) {
        const candidatePath = basePath === '' ? `node_modules/${name}` : `${basePath}/node_modules/${name}`;
        const entry = packages[candidatePath];
        if (entry !== undefined) return entry.link === true && entry.resolved !== undefined ? entry.resolved : candidatePath;
        if (basePath === '') return undefined;
        const parentIndex = basePath.lastIndexOf('/node_modules/');
        basePath = parentIndex === -1 ? '' : basePath.slice(0, parentIndex);
    }
}

function buildLicensesIntro(allowedLicenses: string, isFromBuild: boolean): string {
    const licenseListText = formatLicenseListText(allowedLicenses.split(';'));
    const scope = isFromBuild
        ? "The following table lists every package whose code, styles or assets are included in this project's build, as recorded by the build itself. Modules loaded at run time are not included; each documents its own."
        : 'The following table lists all production dependencies. This project has no build record, so the list is taken from its declared dependencies.';
    return `License data is updated each time \`npm run document\` is run, using [license-checker](https://github.com/RSeidelsohn/license-checker-rseidelsohn). ${scope} These dependencies have been checked and confirmed to use ${licenseListText}, all of which allow commercial use. All are used unmodified, so any licence conditions that apply only to modified versions are not triggered. Developers cloning this repository should independently verify development dependencies.`;
}

function formatLicenseListText(licenses: string[]): string {
    if (licenses.length === 1) return licenses[0] ?? '';
    return licenses.length === 2 ? `${String(licenses[0])} or ${String(licenses[1])}` : `${licenses.slice(0, -1).join(', ')}, or ${String(licenses.at(-1))}`;
}

function parseLicenseEntry(key: string, value: ProductionPackageLicense): License {
    const lastAt = key.lastIndexOf('@');
    const name = lastAt > 0 ? key.slice(0, lastAt) : key;
    const installedVersion = lastAt > 0 ? key.slice(lastAt + 1) : '';
    return {
        name,
        repository: value.repository ?? `https://www.npmjs.com/package/${name}`,
        licenseTypes: value.licenses,
        installedVersion,
        author: value.publisher ?? '',
        latestVersion: '',
        latestPublishedDate: '',
        publishedDate: '',
        ...(value.licenseFile != null && { licenseFileLink: value.licenseFile })
    };
}

async function fetchNpmData(name: string, version: string): Promise<{ latestVersion: string; latestPublishedDate: string; publishedDate: string }> {
    try {
        const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`);
        if (response.ok) {
            const data = (await response.json()) as { 'dist-tags'?: Record<string, string>; time?: Record<string, string> };
            const distributionTags = new Map(Object.entries(data['dist-tags'] ?? {}));
            const timeMap = new Map(Object.entries(data.time ?? {}));
            const latestVersion = distributionTags.get('latest') ?? '';
            const publishedDate = timeMap.get(version) ?? '';
            const latestPublishedDate = latestVersion === version ? '' : (timeMap.get(latestVersion) ?? '');
            return { latestVersion, latestPublishedDate, publishedDate };
        }
    } catch {
        // Ignore network errors.
    }
    return { latestVersion: '', latestPublishedDate: '', publishedDate: '' };
}

function formatLicenseRow(license: License): string {
    const licenseLink = license.licenseFileLink == null || license.licenseFileLink === '' ? '⚠️  No license file' : `[LICENSE](licenses/${license.licenseFileLink})`;
    return `|[${license.name}](${license.repository})|${license.installedVersion}|${license.licenseTypes}|${licenseLink}|\n`;
}

function formatShippedLicenseRow(license: License): string {
    const licenseLink = license.licenseFileLink == null || license.licenseFileLink === '' ? '⚠️  No license file' : `[LICENSE](licenses/${license.licenseFileLink})`;
    return `|[${license.name}](${license.repository})|${license.installedVersion}|${formatVersionDetail(license).replace(/^ — /, '')}|${license.licenseTypes}|${licenseLink}|\n`;
}

function walkTreeList(dependencies: Record<string, NpmPackageTree>, licensesByKey: Map<string, License>, unshippedPackages: Set<string>, items: string[], depth: number): void {
    const indent = '  '.repeat(depth);
    for (const [name, node] of Object.entries(dependencies)) {
        // npm lists optional peers that nothing installs, such as '@opentelemetry/api' for '@tanstack/ai', with no version.
        if (node.version === undefined) continue;
        const version = node.version;
        if (unshippedPackages.has(`${name}@${version}`)) continue;
        const license = licensesByKey.get(`${name}@${version}`);
        const nameLink = license == null ? name : `[${name}](${license.repository})`;
        const versionDetail = formatVersionDetail(license);
        items.push(`${indent}- **${nameLink}** ${version}${versionDetail}`);
        if (node.dependencies != null) {
            walkTreeList(node.dependencies, licensesByKey, unshippedPackages, items, depth + 1);
        }
    }
}

function formatVersionDetail(license: License | undefined): string {
    if (license == null) return '';
    const published = license.publishedDate ? determineLatestAge(license.publishedDate.split('T', 1)[0]) : '';
    const isOutdated = license.latestVersion !== '' && license.latestVersion !== license.installedVersion;
    if (!isOutdated) return published === '' ? '' : ` — ${published}`;
    const latestAge = license.latestPublishedDate ? determineLatestAge(license.latestPublishedDate.split('T', 1)[0]) : '';
    const latestClause = latestAge === '' ? `**latest**: ${license.latestVersion} ❗` : `**latest**: ${license.latestVersion} — ${latestAge} ❗`;
    return published === '' ? ` — → ${latestClause}` : ` — ${published} → ${latestClause}`;
}

function determineLatestAge(momentString?: string): string {
    if (momentString == null || momentString === '') return 'n/a';

    const dateString = momentString.split('T', 1)[0];
    if (dateString == null || dateString === '') return 'n/a';

    const input = new Date(dateString);
    const now = new Date();
    let months = (now.getFullYear() - input.getFullYear()) * 12 + (now.getMonth() - input.getMonth());
    if (now.getDate() < input.getDate()) months -= 1;

    if (months === 0) return `this month: ${dateString}`;
    if (months === 1) return `**1 month** ago: ${dateString}`;
    return months <= 6 ? `**${String(months)} months** ago: ${dateString}` : `**${String(months)} months** ago: ${dateString} ⚠️`;
}
