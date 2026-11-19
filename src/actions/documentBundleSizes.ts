// ── External Dependencies & Registrations
import type { Dirent } from 'node:fs';
import { promises as fs } from 'node:fs';
import { gzipSync } from 'node:zlib';

// ── Local Framework
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFileOrNull, writeReadmeSection } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface Sizes {
    uncompressed: number;
    gzip: number;
}

interface SondaResource {
    kind: 'asset' | 'chunk' | 'filesystem' | 'sourcemap';
    name: string;
    uncompressed: number;
    gzip?: number;
    parent?: string | null;
}

interface SondaDependency {
    name: string;
    paths: string[];
}

interface SondaJson {
    resources: SondaResource[];
    dependencies: SondaDependency[];
}

interface GroupData {
    sizes: Sizes;
    files: Map<string, Sizes>;
    parts?: Map<string, GroupData>; // An inlined worker's own groups, shown as '↳' rows beneath it.
}

interface InlinedWorker {
    bytes: number;
    groups: Map<string, GroupData>;
    wasm: WasmSizes; // The WebAssembly embedded in the worker, so it is not counted again for the file that holds the worker.
}

interface WasmSizes {
    bytes: number; // As embedded, base64 text included.
    binaryBytes: number; // The WebAssembly the text decodes to.
}

type GroupEntry = [string, GroupData];
type FileEntry = [name: string, sizes: Sizes];
type DependencyPath = [path: string, name: string];

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

export const BUNDLE_REPORT_PATH = 'bundle-analysis-reports/sonda/index.json'; // Written by Sonda during the Vite build.
const WORKER_REPORT_PATH = 'bundle-analysis-reports/sonda/worker.json'; // Written for an inlined worker, where the project's build adds one.
const OUTPUT_DIRECTORY = 'dist';
// Source maps and type declarations are never loaded by a browser, and the shipped packages record only serves 'npm run document'.
const UNLISTED_FILE_PATTERN = /^\.|\.map$|\.d\.ts$|^shipped-packages\.json$/;

const BUNDLE_START_MARKER = '<!-- BUNDLE_START -->';
const BUNDLE_END_MARKER = '<!-- BUNDLE_END -->';
const INDENT = '&nbsp;&nbsp;&nbsp;&nbsp;';
const BAR_WIDTH = 20;
const BAR_CHARACTER = '█';
const PART_BAR_CHARACTER = '▒'; // Lighter, so a '↳' row reads as part of the row above. Markdown has no colour that also shows on npm.

// GitHub strips CSS from a README, so column widths are steered through the text itself: the composition column has no
// spaces to break at, and a long label is shortened so the column it gives up stays narrow.
const LABEL_MAX_LENGTH = 48;

const BUNDLE_ANALYSIS_INTRO = `This report is updated with each release, from the bundle the release builds, using [Sonda](https://sonda.dev/), which analyses final source maps to reveal the actual effects of tree-shaking and minification rather than relying on pre-build estimates.\n\n_Note: Sonda's Vite reports currently exclude CSS files, since Vite does not generate source maps for CSS._`;

const BAR_NOTE = `Bars show each row's share of its output file.`;
const PART_ROW_NOTE = '↳ rows are part of the row above.'; // Only where the table has such rows, beneath an inlined worker.
const OTHER_FILES_NOTE = 'A file with no rows beneath it is shipped as it is, such as WebAssembly, so it has no breakdown. Source maps and type declarations are left out.';

const MORE_NOTE =
    '+ n more = the row also holds n more files from the same package or folder, each no larger than the one named. A package can appear under several output files, each holding different files, never the same file twice.';

const UNTRACED_LABEL = '(bundler output, whitespace & JSON)';
const WORKER_LABEL = '(inlined worker)';
const WORKER_NOTE = `${WORKER_LABEL} = a Web Worker built separately and embedded in its output file as text. Its rows list what it contains.`;
const WASM_LABEL_PREFIX = '(Rust WebAssembly as base64';
const WASM_NOTE = `${WASM_LABEL_PREFIX}…) = the compiled Rust code, embedded as base64 text, about a third larger than the binary it decodes to, which is the size given.`;

const UNTRACED_NOTE = `${UNTRACED_LABEL} = bytes Sonda can't trace to a source file: whitespace (indentation and line breaks), code the bundler generates (region comments, the combined import/export lines, its small runtime helper and wrappers), and imported JSON such as \`config.json\`, which the bundler doesn't map. The JSON and the generated code are real bytes that ship; the whitespace mostly disappears once compressed.`;

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentBundleSizes(): Promise<void> {
    try {
        logOperationHeader('Document Bundle Sizes');

        logStepHeader('1️⃣  Read bundle analysis report');
        const json = await readJSONFile<SondaJson>(BUNDLE_REPORT_PATH);
        const workerReport = await readTextFileOrNull(WORKER_REPORT_PATH);
        const workerJson = workerReport === null ? undefined : (JSON.parse(workerReport) as SondaJson);
        // The built files, read to find the WebAssembly embedded in them as text, which Sonda cannot trace.
        const assetContents = new Map<string, string | null>();
        for (const resource of [...json.resources, ...(workerJson?.resources ?? [])]) {
            if (resource.kind === 'asset') assetContents.set(resource.name, await readTextFileOrNull(resource.name));
        }
        const otherFiles = await measureOtherFiles(new Set(assetContents.keys()));

        logStepHeader(`2️⃣  Insert table into 'README.md'`);
        const bundleTable = buildBundleTable(json, { assetContents, otherFiles, workerJson });
        const notes = [
            bundleTable.includes('↳') ? `${BAR_NOTE} ${PART_ROW_NOTE}` : BAR_NOTE,
            otherFiles.length > 0 ? OTHER_FILES_NOTE : '',
            / \+ \d+ more \|/.test(bundleTable) ? MORE_NOTE : '',
            bundleTable.includes(WORKER_LABEL) ? WORKER_NOTE : '',
            bundleTable.includes(WASM_LABEL_PREFIX) ? WASM_NOTE : '',
            UNTRACED_NOTE
        ].filter((note) => note !== '');

        await writeReadmeSection(`## Bundle Analysis\n\n${BUNDLE_ANALYSIS_INTRO}\n\n${bundleTable}\n\n${notes.join('\n\n')}`, BUNDLE_START_MARKER, BUNDLE_END_MARKER);

        logOperationSuccess('Bundle sizes documented');
    } catch (error) {
        console.error('❌  Error documenting bundle sizes', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// Sonda only reports the files the bundler writes, so a file the build copies into the output folder, such as a database
// engine's WebAssembly, is measured here. Without these a README would show only the small script that loads it.
async function measureOtherFiles(analysedNames: Set<string>): Promise<FileEntry[]> {
    const files: FileEntry[] = [];
    const entries = await readOutputDirectory();
    for (const entry of entries) {
        const name = `${entry.parentPath}/${entry.name}`;
        if (!entry.isFile() || UNLISTED_FILE_PATTERN.test(entry.name) || analysedNames.has(name)) continue;
        const content = await fs.readFile(name);
        files.push([name, { uncompressed: content.byteLength, gzip: gzipSync(content).byteLength }]);
    }
    return files;
}

async function readOutputDirectory(): Promise<Dirent[]> {
    try {
        return await fs.readdir(OUTPUT_DIRECTORY, { recursive: true, withFileTypes: true });
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []; // No build yet, or a project that builds elsewhere.
        throw error;
    }
}

// Every shipped file has a heading row giving its size and its share of the whole build, largest first. A file the
// bundler wrote is then broken down by package, with bars that add up to 100% of that file. Rows marked '↳' are part of
// the row above; their bars use the same scale, so every bar in a file can be compared with every other.
function buildBundleTable(json: SondaJson, options: { assetContents: Map<string, string | null>; otherFiles: FileEntry[]; workerJson: SondaJson | undefined }): string {
    const { assetContents, otherFiles, workerJson } = options;
    const assetGroups = buildAssetGroups(json);
    const analysedFiles = json.resources.filter((resource) => resource.kind === 'asset').map((asset): FileEntry => [asset.name, resourceSizes(asset)]);
    const files = [...analysedFiles, ...otherFiles].toSorted((a, b) => b[1].uncompressed - a[1].uncompressed);
    const buildSizes = zero();
    for (const [, sizes] of files) addTo(buildSizes, sizes);

    // Embedded text is traced to no source, or to the one that embeds it, so it is given rows of its own: an inlined
    // worker, placed in the first file with enough untraced bytes to hold it, and embedded WebAssembly.
    const worker = workerJson === undefined ? undefined : readInlinedWorker(workerJson, assetContents);
    const workerFile = worker === undefined ? undefined : files.find(([file]) => (assetGroups.get(file)?.get(UNTRACED_LABEL)?.sizes.uncompressed ?? 0) >= worker.bytes)?.[0];
    for (const [file, groups] of assetGroups) {
        const wasm = measureWasm(assetContents.get(file) ?? '');
        if (worker !== undefined && file === workerFile) {
            separateWorker(groups, worker);
            separateWasm(groups, { bytes: wasm.bytes - worker.wasm.bytes, binaryBytes: wasm.binaryBytes - worker.wasm.binaryBytes });
        } else {
            separateWasm(groups, wasm);
        }
    }

    const lines = ['|Chunk/Module/File|Composition|', '|:------ |:-----------|'];
    if (files.length > 1) lines.push(row(`**All ${String(files.length)} files**`, chunkSizes(buildSizes)));

    for (const [file, sizes] of files) {
        const groups = assetGroups.get(file) ?? new Map<string, GroupData>();
        const fileTotal = groups.values().reduce((sum, group) => sum + group.sizes.uncompressed, 0);
        const buildShare = buildSizes.uncompressed > 0 ? ` · ${formatPercent(sizes.uncompressed, buildSizes.uncompressed)} of the build` : '';
        lines.push(row(`**${fitLabel(file)}**`, `${chunkSizes(sizes)}${buildShare}`), ...renderGroupRows(groups, fileTotal));
    }

    return lines.join('\n');
}

// The worker's report says what it contains, and the copy of the worker beside it is read for its embedded WebAssembly.
function readInlinedWorker(workerJson: SondaJson, assetContents: Map<string, string | null>): InlinedWorker | undefined {
    const [file, groups] = buildAssetGroups(workerJson).entries().next().value ?? [];
    if (file === undefined || groups === undefined) return undefined;
    const bytes = groups.values().reduce((sum, group) => sum + group.sizes.uncompressed, 0);
    const wasm = measureWasm(assetContents.get(file) ?? '');
    separateWasm(groups, wasm);
    return { bytes, groups, wasm };
}

function measureWasm(text: string): WasmSizes {
    const sizes = { bytes: 0, binaryBytes: 0 };
    for (const match of text.matchAll(/data:application\/wasm;base64,([A-Za-z\d+/]*={0,2})/g)) {
        const base64 = match[1] ?? '';
        sizes.bytes += match[0].length;
        sizes.binaryBytes += Math.floor((base64.length * 3) / 4) - countBase64Padding(base64);
    }
    return sizes;
}

function countBase64Padding(base64: string): number {
    if (base64.endsWith('==')) return 2;
    return base64.endsWith('=') ? 1 : 0;
}

// The WebAssembly is taken from the wasm-bindgen file that embeds it, or failing that from the untraced bytes.
function separateWasm(groups: Map<string, GroupData>, wasm: WasmSizes): void {
    if (wasm.bytes <= 0) return;
    const source = [groups.get('wasm'), groups.get(UNTRACED_LABEL)]
        .flatMap((group) =>
            group === undefined
                ? []
                : group.files
                      .entries()
                      .map(([fileName, sizes]) => ({ group, fileName, sizes }))
                      .toArray()
        )
        .find(({ sizes }) => sizes.uncompressed >= wasm.bytes);
    if (source === undefined) return;
    subtractBytes(groups, source.group, source.fileName, source.sizes, wasm.bytes);
    const label = `${WASM_LABEL_PREFIX}, ${formatBytes(wasm.binaryBytes)} binary)`;
    groups.set(label, { sizes: { uncompressed: wasm.bytes, gzip: 0 }, files: new Map([['', { uncompressed: wasm.bytes, gzip: 0 }]]) });
}

// The worker is embedded as one string, which Sonda cannot trace, so its bytes are taken out of the untraced ones.
function separateWorker(groups: Map<string, GroupData>, worker: InlinedWorker): void {
    const untraced = groups.get(UNTRACED_LABEL);
    const untracedSizes = untraced?.files.get('');
    if (untraced === undefined || untracedSizes === undefined) return;
    subtractBytes(groups, untraced, '', untracedSizes, worker.bytes);
    const sizes = { uncompressed: worker.bytes, gzip: 0 };
    groups.set(WORKER_LABEL, { sizes, files: new Map([['', { ...sizes }]]), parts: worker.groups });
}

function subtractBytes(groups: Map<string, GroupData>, group: GroupData, fileName: string, sizes: Sizes, bytes: number): void {
    sizes.uncompressed -= bytes;
    group.sizes.uncompressed -= bytes;
    if (sizes.uncompressed <= 0) group.files.delete(fileName);
    if (group.sizes.uncompressed > 0) return;
    for (const [groupName, candidate] of groups) if (candidate === group) groups.delete(groupName);
}

// Largest first, except the untraced bytes, which always come last as what is left over once the modules are listed.
function compareGroups(a: GroupEntry, b: GroupEntry): number {
    if ((a[0] === UNTRACED_LABEL) !== (b[0] === UNTRACED_LABEL)) return a[0] === UNTRACED_LABEL ? 1 : -1;
    return b[1].sizes.uncompressed - a[1].sizes.uncompressed;
}

function renderGroupRows(groups: Map<string, GroupData>, fileTotal: number, isPart = false): string[] {
    const indent = isPart ? `${INDENT}${INDENT}↳ ` : INDENT;
    return [...groups]
        .toSorted(compareGroups)
        .flatMap(([groupName, group]) => [
            row(`${indent}${formatGroupLabel(groupName, group.files)}`, composition(group.sizes.uncompressed, fileTotal, isPart ? PART_BAR_CHARACTER : BAR_CHARACTER)),
            ...(group.parts === undefined ? [] : renderGroupRows(group.parts, fileTotal, true))
        ]);
}

// A bar and percentage of the output file, then the size, so the share and the bytes behind it read together.
function composition(bytes: number, fileTotal: number, barCharacter: string): string {
    return `${bar(fileTotal > 0 ? (bytes / fileTotal) * 100 : 0, barCharacter)} · ${formatBytes(bytes)}`;
}

// A group of several files is labelled by its largest, with a count of the rest, so a package spread over several output
// files reads as different parts of it rather than as a copy in each. The count is left out of any shortening, so it is
// never the part cut. A group with no file name, such as the untraced bytes, is shown on its own rather than as 'group → '.
function formatGroupLabel(groupName: string, files: Map<string, Sizes>): string {
    const [largestFileName] = [...files].toSorted((a, b) => b[1].uncompressed - a[1].uncompressed)[0] ?? [''];
    const label = fitLabel(largestFileName === '' ? groupName : `${groupName} → ${largestFileName}`);
    return files.size > 1 ? `${label} + ${String(files.size - 1)} more` : label;
}

// A 'group → ' prefix is always kept whole. The path after it loses its start, keeping the file name it ends with, and
// shows in full on hover.
function fitLabel(label: string): string {
    const arrowIndex = label.indexOf(' → ');
    const prefix = arrowIndex === -1 ? '' : label.slice(0, arrowIndex + 3);
    const path = label.slice(prefix.length);
    const pathMaxLength = Math.max(LABEL_MAX_LENGTH - prefix.length, 2);
    const isTooLong = path.length > pathMaxLength;
    return isTooLong ? `${prefix}<abbr title="${path.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}">…${path.slice(path.length - (pathMaxLength - 1))}</abbr>` : label;
}

// The composition's spaces are made non-breaking; its bar is the only code span and holds none, so no entity lands
// inside one, where it would show as written.
function row(label: string, composition: string): string {
    return `| ${label} | ${composition.replaceAll(' ', '&nbsp;')} |`;
}

// Builds, per output asset, the size totals grouped by dependency (or 'src'/'wasm'/'(runtime)'), and by file within each group.
function buildAssetGroups(json: SondaJson): Map<string, Map<string, GroupData>> {
    const dependencyPaths = buildDependencyPaths(json.dependencies);
    const assets = new Map<string, Map<string, GroupData>>();

    for (const resource of json.resources) {
        if (resource.kind !== 'chunk' || !resource.parent) continue;
        const { group: groupName, file: fileName } = resolveModule(resource.name, dependencyPaths);
        const sizes = resourceSizes(resource);

        const groups = assets.get(resource.parent) ?? new Map<string, GroupData>();
        assets.set(resource.parent, groups);

        const group = groups.get(groupName) ?? { sizes: zero(), files: new Map<string, Sizes>() };
        groups.set(groupName, group);
        addTo(group.sizes, sizes);

        const fileSizes = group.files.get(fileName) ?? zero();
        group.files.set(fileName, fileSizes);
        addTo(fileSizes, sizes);
    }

    return assets;
}

// Flattens `dependencies[].paths` into `[path, dependencyName]` pairs, longest path first so scoped/nested packages match before their parents.
function buildDependencyPaths(dependencies: SondaDependency[]): DependencyPath[] {
    return dependencies.flatMap((dependency): DependencyPath[] => dependency.paths.map((path) => [path, dependency.name])).toSorted((a, b) => b[0].length - a[0].length);
}

function resolveModule(path: string, dependencyPaths: DependencyPath[]): { group: string; file: string } {
    const match = dependencyPaths.find(([dependencyPath]) => path === dependencyPath || path.startsWith(`${dependencyPath}/`));
    if (match) {
        const [dependencyPath, name] = match;
        return { group: name, file: path.slice(dependencyPath.length + 1) };
    }
    if (path === '[unassigned]') return { group: UNTRACED_LABEL, file: '' }; // Sonda's marker for chunk bytes it can't trace back to a source module.
    if (path.startsWith('\u{0}')) return { group: '(runtime)', file: path.slice(1) };
    return path.startsWith('rust/') ? { group: 'wasm', file: shortenCrateFileName(path) } : { group: 'src', file: lastPathSegment(path) };
}

// wasm-pack names every generated file after the crate, so the shared part is shortened to '…', leaving what differs.
function shortenCrateFileName(path: string): string {
    const crateName = path.split('/', 2)[1] ?? '';
    const fileName = lastPathSegment(path);
    return crateName !== '' && fileName.startsWith(crateName) ? `…${fileName.slice(crateName.length)}` : fileName;
}

function lastPathSegment(path: string): string {
    return path.split('/').at(-1) ?? path;
}

function resourceSizes(resource: SondaResource): Sizes {
    return { uncompressed: resource.uncompressed, gzip: resource.gzip ?? 0 };
}

function chunkSizes(sizes: Sizes): string {
    return `${formatBytes(sizes.uncompressed)} · gzip ${formatBytes(sizes.gzip)}`;
}

function bar(pct: number, barCharacter: string): string {
    const count = Math.round((pct / 100) * BAR_WIDTH);
    return `\`${barCharacter.repeat(count)}${'░'.repeat(BAR_WIDTH - count)}\` ${pct.toFixed(1)}%`;
}

function zero(): Sizes {
    return { uncompressed: 0, gzip: 0 };
}

function addTo(target: Sizes, source: Sizes): void {
    target.uncompressed += source.uncompressed;
    target.gzip += source.gzip;
}

function formatPercent(part: number, whole: number): string {
    return `${((part / whole) * 100).toFixed(1)}%`;
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${String(bytes)} B`;
    return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} kB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
