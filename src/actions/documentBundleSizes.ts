// ── Local (Development) Framework
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile, substituteText, writeTextFile } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface Sizes {
    uncompressed: number;
    brotli: number;
}

interface SondaResource {
    kind: 'asset' | 'chunk' | 'filesystem' | 'sourcemap';
    name: string;
    uncompressed: number;
    brotli?: number;
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

const BUNDLE_START_MARKER = '<!-- BUNDLE_START -->';
const BUNDLE_END_MARKER = '<!-- BUNDLE_END -->';
const INDENT = '&nbsp;&nbsp;&nbsp;&nbsp;';
const BAR_WIDTH = 20;

const BUNDLE_ANALYSIS_INTRO = `The Bundle Analysis Report is generated automatically on each release using [Sonda](https://sonda.dev/), which analyses final source maps to reveal the actual effects of tree-shaking and minification rather than relying on pre-build estimates.\n\n_Note: Sonda's Vite reports currently exclude CSS files, since Vite does not generate source maps for CSS._`;

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentBundleSizes(options?: { moduleLevel?: boolean }): Promise<void> {
    try {
        logOperationHeader('Document Bundle Sizes');

        logStepHeader('1️⃣  Read bundle analysis report');
        const json = await readJSONFile<SondaJson>('./bundle-analysis-reports/sonda/index.json');

        logStepHeader(`2️⃣  Insert table into 'README.md'`);
        const bundleTable = buildBundleTable(json, options?.moduleLevel ?? false);

        const readme = await readTextFile('./README.md');
        const updated = substituteText(
            readme,
            `\n${BUNDLE_ANALYSIS_INTRO}\n\n${bundleTable}\n\n(unassigned) = bytes Sonda can't trace to a specific source line (whitespace, stray keywords, bundler-injected region markers) — not actual missing/unknown code.`,
            BUNDLE_START_MARKER,
            BUNDLE_END_MARKER
        );
        await writeTextFile('README.md', updated);

        logOperationSuccess('Bundle sizes documented');
    } catch (error) {
        console.error('❌  Error documenting bundle sizes', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

function buildBundleTable(json: SondaJson, isModuleLevel: boolean): string {
    const assetGroups = buildAssetGroups(json);
    const bundlerTotal = assetGroups
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
        const sortedGroups = [...groups].toSorted((a, b) => b[1].sizes.uncompressed - a[1].sizes.uncompressed);

        const sectionLines =
            sortedGroups.length === 1
                ? renderSingleGroupSection(file, sizes, getSoleEntry(sortedGroups), bundlerTotal, isModuleLevel)
                : renderMultiGroupSection(file, sizes, sortedGroups, bundlerTotal, isModuleLevel);

        lines.push(...sectionLines);
    }

    return lines.join('\n');
}

function renderSingleGroupSection(file: string, sizes: Sizes, group: GroupEntry, bundlerTotal: number, isModuleLevel: boolean): string[] {
    const [groupName, { sizes: groupSizes, files }] = group;
    const groupPct = bundlerTotal > 0 ? (groupSizes.uncompressed / bundlerTotal) * 100 : 0;

    if (files.size === 1) {
        const fileName = getSoleFileName(files);
        return [`| ${file} → ${groupName} → ${fileName} | ${chunkSizes(sizes)} · ${bar(groupPct)} |`];
    }

    const lines = [`| ${file} → ${groupName} | ${chunkSizes(sizes)} · ${bar(groupPct)} |`];
    if (!isModuleLevel) lines.push(...renderFileRows(files, INDENT, bundlerTotal));
    return lines;
}

function renderMultiGroupSection(file: string, sizes: Sizes, sortedGroups: GroupEntry[], bundlerTotal: number, isModuleLevel: boolean): string[] {
    const lines = [`| ${file} | ${chunkSizes(sizes)} |`];

    for (const [groupName, { sizes: groupSizes, files }] of sortedGroups) {
        const groupPct = bundlerTotal > 0 ? (groupSizes.uncompressed / bundlerTotal) * 100 : 0;

        if (files.size === 1) {
            const fileName = getSoleFileName(files);
            lines.push(`| ${INDENT}${groupName} → ${fileName} | ${bar(groupPct)} |`);
            continue;
        }

        lines.push(`| ${INDENT}${groupName} | ${bar(groupPct)} |`);
        if (!isModuleLevel) lines.push(...renderFileRows(files, `${INDENT}${INDENT}`, bundlerTotal));
    }

    return lines;
}

function renderFileRows(files: Map<string, Sizes>, indent: string, bundlerTotal: number): string[] {
    const sortedFiles = [...files].toSorted((a, b) => b[1].uncompressed - a[1].uncompressed);
    return sortedFiles.map(([fileName, fileSizes]) => {
        const filePct = bundlerTotal > 0 ? (fileSizes.uncompressed / bundlerTotal) * 100 : 0;
        return `| ${indent}${fileName} | ${bar(filePct)} |`;
    });
}

function getSoleEntry<T>(entries: T[]): T {
    const [entry] = entries;
    if (entry === undefined) throw new Error('Expected exactly one entry');
    return entry;
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
    if (path === '[unassigned]') return { group: '(unassigned)', file: path }; // Sonda's marker for chunk bytes it can't trace back to a source module.
    if (path.startsWith('\u{0}')) return { group: '(runtime)', file: path.slice(1) };
    if (path.startsWith('rust/') || path.includes('vite-plugin-wasm')) return { group: 'wasm', file: lastPathSegment(path) };
    return { group: 'src', file: lastPathSegment(path) };
}

function lastPathSegment(path: string): string {
    return path.split('/').at(-1) ?? path;
}

function resourceSizes(resource: SondaResource): Sizes {
    return { uncompressed: resource.uncompressed, brotli: resource.brotli ?? 0 };
}

function chunkSizes(sizes: Sizes): string {
    return `${formatBytes(sizes.uncompressed)} · brotli ${formatBytes(sizes.brotli)}`;
}

function bar(pct: number): string {
    const count = Math.round((pct / 100) * BAR_WIDTH);
    return `\`${'█'.repeat(count)}${'░'.repeat(BAR_WIDTH - count)}\` ${pct.toFixed(1)}%`;
}

function zero(): Sizes {
    return { uncompressed: 0, brotli: 0 };
}

function addTo(target: Sizes, source: Sizes): void {
    target.uncompressed += source.uncompressed;
    target.brotli += source.brotli;
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${String(bytes)} B`;
    return `${(bytes / 1024).toFixed(1)} kB`;
}
