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
}

interface WasmSizes {
    bytes: number; // As embedded, base64 text included.
    binaryBytes: number; // The WebAssembly the text decodes to.
}

type GroupEntry = [string, GroupData];
type DependencyPath = [path: string, name: string];

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

export const BUNDLE_REPORT_PATH = 'bundle-analysis-reports/sonda/index.json'; // Written by Sonda during the Vite build.
const WORKER_REPORT_PATH = 'bundle-analysis-reports/sonda/worker.json'; // Written for an inlined worker, where the project's build adds one.

const BUNDLE_START_MARKER = '<!-- BUNDLE_START -->';
const BUNDLE_END_MARKER = '<!-- BUNDLE_END -->';
const INDENT = '&nbsp;&nbsp;&nbsp;&nbsp;';
const BAR_WIDTH = 20;
const BAR_CHARACTER = '█';
const PART_BAR_CHARACTER = '▒'; // Lighter, so a '↳' row reads as part of the row above. Markdown has no colour that also shows on npm.
const MIN_VISIBLE_PERCENT = 100 / BAR_WIDTH / 2; // Below this a bar rounds to no characters at all.
const SMALL_FILES_MAX_PERCENT = 100 / BAR_WIDTH; // The combined row for small files stays within one bar character.

// GitHub strips CSS from a README, so column widths are steered through the text itself: the composition column has no
// spaces to break at, and a long label is shortened so the column it gives up stays narrow.
const LABEL_MAX_LENGTH = 48;

const BUNDLE_ANALYSIS_INTRO = `This report is updated with each release, from the bundle the release builds, using [Sonda](https://sonda.dev/), which analyses final source maps to reveal the actual effects of tree-shaking and minification rather than relying on pre-build estimates.\n\n_Note: Sonda's Vite reports currently exclude CSS files, since Vite does not generate source maps for CSS._`;

const BAR_NOTE = `Bars show each row's share of its output file.`;
const PART_ROW_NOTE = '↳ rows are part of the row above.'; // Only where the table has such rows, which module level leaves out.

const MORE_NOTE =
    '+ n more = the row also holds n more files from the same package or folder, each no larger than the one named. A package can appear under several output files, each holding different files, never the same file twice.';

const UNTRACED_LABEL = '(bundler output, whitespace & JSON)';
const WORKER_LABEL = '(inlined worker)';
const WORKER_NOTE = `${WORKER_LABEL} = a Web Worker built separately and embedded in its output file as text. Where the build records what it contains, its rows list that; any few bytes over are the escaping needed to embed it.`;
const WASM_LABEL_PREFIX = '(Rust WebAssembly as base64';
const WASM_NOTE = `${WASM_LABEL_PREFIX}…) = the compiled Rust code, embedded as base64 text, about a third larger than the binary it decodes to, which is the size given.`;

const UNTRACED_NOTE = `${UNTRACED_LABEL} = bytes Sonda can't trace to a source file: whitespace (indentation and line breaks), code the bundler generates (region comments, the combined import/export lines, its small runtime helper and wrappers), and imported JSON such as \`config.json\`, which the bundler doesn't map. The JSON and the generated code are real bytes that ship; the whitespace mostly disappears once compressed.`;

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentBundleSizes(options?: { moduleLevel?: boolean }): Promise<void> {
    try {
        logOperationHeader('Document Bundle Sizes');

        logStepHeader('1️⃣  Read bundle analysis report');
        const json = await readJSONFile<SondaJson>(BUNDLE_REPORT_PATH);
        const workerReport = await readTextFileOrNull(WORKER_REPORT_PATH);
        const workerJson = workerReport === null ? undefined : (JSON.parse(workerReport) as SondaJson);
        // The built files, read to find what is embedded in them as text, which Sonda cannot trace.
        const assetContents = new Map<string, string | null>();
        for (const resource of json.resources) if (resource.kind === 'asset') assetContents.set(resource.name, await readTextFileOrNull(resource.name));

        logStepHeader(`2️⃣  Insert table into 'README.md'`);
        const bundleTable = buildBundleTable(json, { assetContents, isModuleLevel: options?.moduleLevel ?? false, workerJson });
        const rowNote = bundleTable.includes('↳') ? `${BAR_NOTE} ${PART_ROW_NOTE}` : BAR_NOTE;
        const moreNote = / \+ \d+ more \|/.test(bundleTable) ? MORE_NOTE : '';
        const notes = [rowNote, moreNote, bundleTable.includes(WORKER_LABEL) ? WORKER_NOTE : '', bundleTable.includes(WASM_LABEL_PREFIX) ? WASM_NOTE : '', UNTRACED_NOTE].filter(
            (note) => note !== ''
        );

        await writeReadmeSection(`## Bundle Analysis\n\n${BUNDLE_ANALYSIS_INTRO}\n\n${bundleTable}\n\n${notes.join('\n\n')}`, BUNDLE_START_MARKER, BUNDLE_END_MARKER);

        logOperationSuccess('Bundle sizes documented');
    } catch (error) {
        console.error('❌  Error documenting bundle sizes', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// Each output file is broken down on its own, so its top-level bars add up to 100% of that file, and its heading gives its
// share of the whole build. Rows marked '↳' are part of the row above; their bars use the same scale, so every bar in a
// file can be compared with every other.
function buildBundleTable(json: SondaJson, options: { assetContents: Map<string, string | null>; isModuleLevel: boolean; workerJson: SondaJson | undefined }): string {
    const { assetContents, isModuleLevel, workerJson } = options;
    const assetGroups = buildAssetGroups(json);
    const workerGroups = workerJson === undefined ? undefined : buildAssetGroups(workerJson).values().next().value;
    for (const [file, groups] of assetGroups) {
        const content = assetContents.get(file);
        if (content != null) separateEmbeddedContent(groups, content, workerGroups);
    }
    const buildTotal = assetGroups
        .values()
        .flatMap((groups) => groups.values().toArray())
        .reduce((sum, group) => sum + group.sizes.uncompressed, 0);

    const assets = json.resources
        .filter((resource) => resource.kind === 'asset')
        .map((asset): [string, Sizes] => [asset.name, resourceSizes(asset)])
        .toSorted((a, b) => b[1].uncompressed - a[1].uncompressed);

    const lines = ['|Chunk/Module/File|Composition|', '|:------ |:-----------|'];

    for (const [file, sizes] of assets) {
        const groups = assetGroups.get(file) ?? new Map<string, GroupData>();
        const sortedGroups = [...groups].toSorted(compareGroups);
        const fileTotal = sortedGroups.reduce((sum, [, group]) => sum + group.sizes.uncompressed, 0);

        const buildShare = fileTotal > 0 && buildTotal > 0 ? ` · ${formatPercent(fileTotal, buildTotal)} of the build` : '';
        lines.push(row(`**${fitLabel(file)}**`, `${chunkSizes(sizes)}${buildShare}`), ...renderGroupRows(sortedGroups, fileTotal, isModuleLevel));
    }

    return lines.join('\n');
}

// Embedded text is traced to no source, or to the one that embeds it, so it is measured in the built file and given rows
// of its own: an inlined worker, broken down where its build was recorded, and embedded WebAssembly.
function separateEmbeddedContent(groups: Map<string, GroupData>, content: string, workerGroups: Map<string, GroupData> | undefined): void {
    const workerText = findInlinedWorkerText(content);
    const workerWasm = measureWasm(workerText ?? '');
    const allWasm = measureWasm(content);
    separateWasm(groups, { bytes: allWasm.bytes - workerWasm.bytes, binaryBytes: allWasm.binaryBytes - workerWasm.binaryBytes });
    if (workerText !== undefined) separateWorker(groups, Buffer.byteLength(workerText), workerWasm, workerGroups);
}

// Vite embeds an inlined worker as a string it passes to 'new Worker(… encodeURIComponent(name))'; this finds that string.
function findInlinedWorkerText(content: string): string | undefined {
    if (!content.includes('new Worker(')) return undefined;
    const variableName = /encodeURIComponent\((\w+)\)/.exec(content)?.[1];
    if (variableName === undefined) return undefined;
    // eslint-disable-next-line security/detect-non-literal-regexp -- The name is a JavaScript identifier, matched by '\w+' above.
    const declaration = new RegExp(String.raw`(?:var|let|const)\s+${variableName}\s*=\s*(["'\`])`).exec(content);
    const quote = declaration?.[1];
    if (declaration === null || quote === undefined) return undefined;
    const start = declaration.index + declaration[0].length;
    let end = start;
    while (end < content.length && content[end] !== quote) end += content[end] === '\\' ? 2 : 1;
    return content.slice(start, end);
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

function separateWorker(groups: Map<string, GroupData>, workerBytes: number, workerWasm: WasmSizes, workerGroups: Map<string, GroupData> | undefined): void {
    const untraced = groups.get(UNTRACED_LABEL);
    const untracedSizes = untraced?.files.get('');
    if (untraced === undefined || untracedSizes === undefined || untracedSizes.uncompressed < workerBytes) return;
    subtractBytes(groups, untraced, '', untracedSizes, workerBytes);
    const files = workerGroups === undefined ? new Map([['', { uncompressed: workerBytes, gzip: 0 }]]) : flattenWorkerGroups(workerGroups, workerBytes, workerWasm);
    groups.set(WORKER_LABEL, { sizes: { uncompressed: workerBytes, gzip: 0 }, files });
}

// The worker's own rows: its source files by name, and each dependency, the WebAssembly and its untraced bytes as one.
function flattenWorkerGroups(workerGroups: Map<string, GroupData>, workerBytes: number, workerWasm: WasmSizes): Map<string, Sizes> {
    separateWasm(workerGroups, workerWasm);
    const files = new Map<string, Sizes>();
    for (const [groupName, group] of workerGroups) {
        if (groupName === 'src') {
            for (const [fileName, sizes] of group.files) files.set(fileName, { ...sizes });
        } else {
            const label = group.files.size === 1 ? formatGroupLabel(groupName, getSoleFileName(group.files)) : groupName;
            files.set(label, { ...group.sizes });
        }
    }
    const reportedBytes = files.values().reduce((sum, sizes) => sum + sizes.uncompressed, 0);
    const untraced = files.get(UNTRACED_LABEL) ?? zero();
    untraced.uncompressed += Math.max(0, workerBytes - reportedBytes);
    if (untraced.uncompressed > 0) files.set(UNTRACED_LABEL, untraced);
    return files;
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

// A group of several files is labelled by its largest, with a count of the rest, so a package spread over several output
// files reads as different parts of it rather than as a copy in each.
function renderGroupRows(sortedGroups: GroupEntry[], fileTotal: number, isModuleLevel: boolean): string[] {
    const lines: string[] = [];

    for (const [groupName, { sizes: groupSizes, files }] of sortedGroups) {
        if (files.size === 1) {
            const fileName = getSoleFileName(files);
            lines.push(row(`${INDENT}${fitLabel(formatGroupLabel(groupName, fileName))}`, composition(groupSizes.uncompressed, fileTotal)));
            continue;
        }

        lines.push(row(`${INDENT}${formatSeveralFilesLabel(groupName, files)}`, composition(groupSizes.uncompressed, fileTotal)));
        if (!isModuleLevel) lines.push(...renderFileRows(files, fileTotal));
    }

    return lines;
}

function renderFileRows(files: Map<string, Sizes>, fileTotal: number): string[] {
    const sortedFiles = [...files].toSorted((a, b) => b[1].uncompressed - a[1].uncompressed);
    const smallCount = countSmallFiles(sortedFiles, fileTotal);
    const namedFiles = smallCount > 0 ? sortedFiles.slice(0, -smallCount) : sortedFiles;

    const rows = namedFiles.map(([fileName, fileSizes]) => row(`${INDENT}${INDENT}↳ ${fitLabel(fileName)}`, composition(fileSizes.uncompressed, fileTotal, PART_BAR_CHARACTER)));
    if (smallCount > 0) {
        const smallBytes = sortedFiles.slice(-smallCount).reduce((sum, [, fileSizes]) => sum + fileSizes.uncompressed, 0);
        rows.push(row(`${INDENT}${INDENT}↳ ${String(smallCount)} smaller files`, composition(smallBytes, fileTotal, PART_BAR_CHARACTER)));
    }
    return rows;
}

// Files too small to show any bar are combined into one row, smallest first, stopping before that row would pass one bar
// character, so it never hides much. A lone small file keeps its name, as combining one file would hide it for nothing.
function countSmallFiles(sortedFiles: [string, Sizes][], fileTotal: number): number {
    if (fileTotal <= 0) return 0;
    let count = 0;
    let bytes = 0;
    for (const [, fileSizes] of sortedFiles.toReversed()) {
        const isTooSmallToShow = (fileSizes.uncompressed / fileTotal) * 100 < MIN_VISIBLE_PERCENT;
        const isCombinedRowStillSmall = ((bytes + fileSizes.uncompressed) / fileTotal) * 100 <= SMALL_FILES_MAX_PERCENT;
        if (!isTooSmallToShow || !isCombinedRowStillSmall) break;
        count++;
        bytes += fileSizes.uncompressed;
    }
    return count >= 2 ? count : 0;
}

// A bar and percentage of the output file, then the size, so the share and the bytes behind it read together.
function composition(bytes: number, fileTotal: number, barCharacter = BAR_CHARACTER): string {
    return `${bar(fileTotal > 0 ? (bytes / fileTotal) * 100 : 0, barCharacter)} · ${formatBytes(bytes)}`;
}

// A group with no file name, such as the untraced bytes, is shown on its own rather than as 'group → '.
function formatGroupLabel(groupName: string, fileName: string): string {
    return fileName === '' ? groupName : `${groupName} → ${fileName}`;
}

// The inlined worker's rows are its own breakdown rather than files, so it keeps its plain label. The count is left out of
// any shortening, so it is never the part cut.
function formatSeveralFilesLabel(groupName: string, files: Map<string, Sizes>): string {
    if (groupName === WORKER_LABEL) return groupName;
    const [largestFileName] = [...files].toSorted((a, b) => b[1].uncompressed - a[1].uncompressed)[0] ?? [''];
    return `${fitLabel(formatGroupLabel(groupName, largestFileName))} + ${String(files.size - 1)} more`;
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

function getSoleFileName(files: Map<string, Sizes>): string {
    const [fileName] = files.keys();
    if (fileName === undefined) throw new Error('Expected exactly one file');
    return fileName;
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

function bar(pct: number, barCharacter = BAR_CHARACTER): string {
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
    return bytes < 1024 ? `${String(bytes)} B` : `${(bytes / 1024).toFixed(1)} kB`;
}
