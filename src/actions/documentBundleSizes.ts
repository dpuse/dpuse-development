// ── Local Framework
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, writeReadmeSection } from '@/utilities';

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

type GroupEntry = [string, GroupData];
type DependencyPath = [path: string, name: string];

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

export const BUNDLE_REPORT_PATH = 'bundle-analysis-reports/sonda/index.json'; // Written by Sonda during the Vite build.

const BUNDLE_START_MARKER = '<!-- BUNDLE_START -->';
const BUNDLE_END_MARKER = '<!-- BUNDLE_END -->';
const INDENT = '&nbsp;&nbsp;&nbsp;&nbsp;';
const BAR_WIDTH = 20;
const BAR_CHARACTER = '█';
const PART_BAR_CHARACTER = '▒'; // Lighter, so a '↳' row reads as part of the row above. Markdown has no colour that also shows on npm.

const BUNDLE_ANALYSIS_INTRO = `This report is updated with each release, from the bundle the release builds, using [Sonda](https://sonda.dev/), which analyses final source maps to reveal the actual effects of tree-shaking and minification rather than relying on pre-build estimates.\n\n_Note: Sonda's Vite reports currently exclude CSS files, since Vite does not generate source maps for CSS._`;

const BAR_NOTE = `Bars show each row's share of its output file.`;
const PART_ROW_NOTE = '↳ rows are part of the row above.'; // Only where the table has such rows, which module level leaves out.

const UNTRACED_LABEL = '(bundler output, whitespace & JSON)';
const UNTRACED_NOTE = `${UNTRACED_LABEL} = bytes Sonda can't trace to a source file: whitespace (indentation and line breaks), code the bundler generates (region comments, the combined import/export lines, its small runtime helper and wrappers), and imported JSON such as \`config.json\`, which the bundler doesn't map. The JSON and the generated code are real bytes that ship; the whitespace mostly disappears once compressed.`;

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentBundleSizes(options?: { moduleLevel?: boolean }): Promise<void> {
    try {
        logOperationHeader('Document Bundle Sizes');

        logStepHeader('1️⃣  Read bundle analysis report');
        const json = await readJSONFile<SondaJson>(BUNDLE_REPORT_PATH);

        logStepHeader(`2️⃣  Insert table into 'README.md'`);
        const bundleTable = buildBundleTable(json, options?.moduleLevel ?? false);
        const rowNote = bundleTable.includes('↳') ? `${BAR_NOTE} ${PART_ROW_NOTE}` : BAR_NOTE;

        await writeReadmeSection(`## Bundle Analysis\n\n${BUNDLE_ANALYSIS_INTRO}\n\n${bundleTable}\n\n${rowNote}\n\n${UNTRACED_NOTE}`, BUNDLE_START_MARKER, BUNDLE_END_MARKER);

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
function buildBundleTable(json: SondaJson, isModuleLevel: boolean): string {
    const assetGroups = buildAssetGroups(json);
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
        lines.push(`| **${file}** | ${chunkSizes(sizes)}${buildShare} |`, ...renderGroupRows(sortedGroups, fileTotal, isModuleLevel));
    }

    return lines.join('\n');
}

// Largest first, except the untraced bytes, which always come last as what is left over once the modules are listed.
function compareGroups(a: GroupEntry, b: GroupEntry): number {
    if ((a[0] === UNTRACED_LABEL) !== (b[0] === UNTRACED_LABEL)) return a[0] === UNTRACED_LABEL ? 1 : -1;
    return b[1].sizes.uncompressed - a[1].sizes.uncompressed;
}

function renderGroupRows(sortedGroups: GroupEntry[], fileTotal: number, isModuleLevel: boolean): string[] {
    const lines: string[] = [];

    for (const [groupName, { sizes: groupSizes, files }] of sortedGroups) {
        if (files.size === 1) {
            const fileName = getSoleFileName(files);
            lines.push(`| ${INDENT}${formatGroupLabel(groupName, fileName)} | ${composition(groupSizes.uncompressed, fileTotal)} |`);
            continue;
        }

        lines.push(`| ${INDENT}${groupName} | ${composition(groupSizes.uncompressed, fileTotal)} |`);
        if (!isModuleLevel) lines.push(...renderFileRows(files, fileTotal));
    }

    return lines;
}

function renderFileRows(files: Map<string, Sizes>, fileTotal: number): string[] {
    const sortedFiles = [...files].toSorted((a, b) => b[1].uncompressed - a[1].uncompressed);
    return sortedFiles.map(([fileName, fileSizes]) => `| ${INDENT}${INDENT}↳ ${fileName} | ${composition(fileSizes.uncompressed, fileTotal, PART_BAR_CHARACTER)} |`);
}

// A bar and percentage of the output file, then the size, so the share and the bytes behind it read together.
function composition(bytes: number, fileTotal: number, barCharacter = BAR_CHARACTER): string {
    return `${bar(fileTotal > 0 ? (bytes / fileTotal) * 100 : 0, barCharacter)} · ${formatBytes(bytes)}`;
}

// A group with no file name, such as the untraced bytes, is shown on its own rather than as 'group → '.
function formatGroupLabel(groupName: string, fileName: string): string {
    return fileName === '' ? groupName : `${groupName} → ${fileName}`;
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
    return { group: path.startsWith('rust/') || path.includes('vite-plugin-wasm') ? 'wasm' : 'src', file: lastPathSegment(path) };
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
