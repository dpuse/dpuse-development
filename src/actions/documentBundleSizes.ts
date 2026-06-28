// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import { promisify } from 'node:util';
import { brotliCompress, gzip } from 'node:zlib';

// ── Local (Development) Framework
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile, substituteText, writeTextFile } from '@/utilities';

// ── Initialisation ───────────────────────────────────────────────────────────────────────────────────────────────────

const gzipAsync = promisify(gzip);
const brotliAsync = promisify(brotliCompress);

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface Sizes {
    rendered: number;
    gzip: number;
    brotli: number;
}

interface NodePart {
    renderedLength: number;
    gzipLength: number;
    brotliLength: number;
}

interface NodeMeta {
    id: string;
    moduleParts: Record<string, string>;
}

interface VisualizerJson {
    nodeParts: Record<string, NodePart>;
    nodeMetas: Record<string, NodeMeta>;
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const BUNDLE_START_MARKER = '<!-- BUNDLE_START -->';
const BUNDLE_END_MARKER = '<!-- BUNDLE_END -->';
const INDENT = '&nbsp;&nbsp;&nbsp;&nbsp;';
const BAR_WIDTH = 20;

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentBundleSizes(options?: { moduleLevel?: boolean }): Promise<void> {
    try {
        logOperationHeader('Document Bundle Sizes');

        logStepHeader('1️⃣  Read bundle analysis report');
        const json = await readJSONFile<VisualizerJson>('./bundle-analysis-reports/rollup-visualiser/index.json');

        logStepHeader(`2️⃣  Insert table into 'README.md'`);
        const distDir = await detectDistDir();
        const bundleTable = await buildBundleTable(json, distDir, options?.moduleLevel ?? false);

        const readme = await readTextFile('./README.md');
        const updated = substituteText(readme, `\n${bundleTable}\n`, BUNDLE_START_MARKER, BUNDLE_END_MARKER);
        await writeTextFile('README.md', updated);

        logOperationSuccess('Bundle sizes documented.');
    } catch (error) {
        console.error('❌  Error documenting bundle sizes.', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

async function detectDistDir(): Promise<string> {
    try {
        await fs.access('./dist/client/assets');
        return './dist/client/assets';
    } catch {
        return './dist';
    }
}

async function buildBundleTable(json: VisualizerJson, distDir: string, moduleLevel: boolean): Promise<string> {
    const chunkGroups = buildChunkGroups(json);
    const bundlerTotal = chunkGroups
        .values()
        .flatMap((g) => g.values().toArray())
        .reduce((sum, g) => sum + g.sizes.rendered, 0);

    const distributionFiles = await readDistributionFileSizes(distDir);
    distributionFiles.sort((a, b) => b[1].rendered - a[1].rendered);

    const lines = ['|Chunk/Module/File|Composition|', '|:------ |:-----------|'];

    const chunkSizes = (sizes: Sizes) =>
        `${formatBytes(sizes.rendered)} · gz ${formatBytes(sizes.gzip)} · br ${formatBytes(sizes.brotli)}`;

    for (const [file, sizes] of distributionFiles) {
        const groups = chunkGroups.get(file) ?? new Map<string, { sizes: Sizes; files: Map<string, Sizes> }>();
        const sortedGroups = [...groups].toSorted((a, b) => b[1].sizes.rendered - a[1].sizes.rendered);

        if (sortedGroups.length === 1) {
            const [groupName, { sizes: groupSizes, files }] = sortedGroups[0];
            const groupPct = bundlerTotal > 0 ? (groupSizes.rendered / bundlerTotal) * 100 : 0;

            if (files.size === 1) {
                const [fileName] = files.keys();
                lines.push(`| ${file} → ${groupName} → ${fileName} | ${chunkSizes(sizes)} · ${bar(groupPct)} |`);
            } else if (moduleLevel) {
                lines.push(`| ${file} → ${groupName} | ${chunkSizes(sizes)} · ${bar(groupPct)} |`);
            } else {
                lines.push(`| ${file} → ${groupName} | ${chunkSizes(sizes)} · ${bar(groupPct)} |`);
                const sortedFiles = [...files].toSorted((a, b) => b[1].rendered - a[1].rendered);
                for (const [fileName, fileSizes] of sortedFiles) {
                    const filePct = bundlerTotal > 0 ? (fileSizes.rendered / bundlerTotal) * 100 : 0;
                    lines.push(`| ${INDENT}${fileName} | ${bar(filePct)} |`);
                }
            }
        } else {
            lines.push(`| ${file} | ${chunkSizes(sizes)} |`);
            for (const [groupName, { sizes: groupSizes, files }] of sortedGroups) {
                const groupPct = bundlerTotal > 0 ? (groupSizes.rendered / bundlerTotal) * 100 : 0;

                if (files.size === 1) {
                    const [fileName] = files.keys();
                    lines.push(`| ${INDENT}${groupName} → ${fileName} | ${bar(groupPct)} |`);
                } else if (moduleLevel) {
                    lines.push(`| ${INDENT}${groupName} | ${bar(groupPct)} |`);
                } else {
                    lines.push(`| ${INDENT}${groupName} | ${bar(groupPct)} |`);
                    const sortedFiles = [...files].toSorted((a, b) => b[1].rendered - a[1].rendered);
                    for (const [fileName, fileSizes] of sortedFiles) {
                        const filePct = bundlerTotal > 0 ? (fileSizes.rendered / bundlerTotal) * 100 : 0;
                        lines.push(`| ${INDENT}${INDENT}${fileName} | ${bar(filePct)} |`);
                    }
                }
            }
        }
    }

    return lines.join('\n');
}

async function readDistributionFileSizes(distDir: string): Promise<[string, Sizes][]> {
    const entries = await fs.readdir(distDir);
    const jsFiles = entries.filter((f) => f.endsWith('.js') && !f.endsWith('.map'));

    return Promise.all(
        jsFiles.map(async (file) => {
            // eslint-disable-next-line security/detect-non-literal-fs-filename -- file comes from fs.readdir, not user input.
            const buffer = await fs.readFile(`${distDir}/${file}`);
            const [gzipped, brotlied] = await Promise.all([gzipAsync(buffer), brotliAsync(buffer)]);
            return [file, { rendered: buffer.length, gzip: gzipped.length, brotli: brotlied.length }] as [string, Sizes];
        })
    );
}

function accumulateChunkPart(
    chunks: Map<string, Map<string, { sizes: Sizes; files: Map<string, Sizes> }>>,
    json: VisualizerJson,
    groupName: string,
    fileName: string,
    chunkName: string,
    partUid: string
): void {
    const part = json.nodeParts[partUid];
    if (!part) return;
    const s = partSizes(part);

    let chunkGroups = chunks.get(chunkName);
    if (chunkGroups === undefined) {
        chunkGroups = new Map();
        chunks.set(chunkName, chunkGroups);
    }

    let group = chunkGroups.get(groupName);
    if (group === undefined) {
        group = { sizes: zero(), files: new Map<string, Sizes>() };
        chunkGroups.set(groupName, group);
    }

    addTo(group.sizes, s);

    let fileSizes = group.files.get(fileName);
    if (fileSizes === undefined) {
        fileSizes = zero();
        group.files.set(fileName, fileSizes);
    }
    addTo(fileSizes, s);
}

function buildChunkGroups(json: VisualizerJson): Map<string, Map<string, { sizes: Sizes; files: Map<string, Sizes> }>> {
    const chunks = new Map<string, Map<string, { sizes: Sizes; files: Map<string, Sizes> }>>();

    for (const meta of Object.values(json.nodeMetas)) {
        const groupName = sourceGroupName(meta.id);
        const fileName = shortModuleName(meta.id);

        for (const [chunkName, partUid] of Object.entries(meta.moduleParts)) {
            const chunkBaseName = chunkName.split('/').at(-1) ?? chunkName;
            accumulateChunkPart(chunks, json, groupName, fileName, chunkBaseName, partUid);
        }
    }

    return chunks;
}

function bar(pct: number): string {
    const count = Math.round((pct / 100) * BAR_WIDTH);
    return `\`${'█'.repeat(count)}${'░'.repeat(BAR_WIDTH - count)}\` ${pct.toFixed(1)}%`;
}

function sourceGroupName(id: string): string {
    const path = id.startsWith('/') ? id.slice(1) : id;
    if (path.startsWith('\u{0}')) return '(runtime)';
    if (path.startsWith('node_modules/')) {
        const rest = path.slice('node_modules/'.length);
        if (rest.startsWith('@')) {
            const parts = rest.split('/');
            return `${String(parts[0])}/${String(parts[1])}`;
        }
        return rest.split('/', 1)[0] ?? rest;
    }
    if (path.startsWith('rust/') || path.startsWith('__vite-plugin-wasm')) return 'wasm';
    return 'src';
}

function shortModuleName(id: string): string {
    const path = id.startsWith('/') ? id.slice(1) : id;
    if (path.startsWith('\u{0}')) return path.slice(1);
    if (path.startsWith('node_modules/')) {
        const rest = path.slice('node_modules/'.length);
        const parts = rest.startsWith('@') ? rest.split('/').slice(2) : rest.split('/').slice(1);
        return parts.join('/') || (rest.split('/').at(-1) ?? rest);
    }
    return path.split('/').at(-1) ?? path;
}

function partSizes(part: NodePart): Sizes {
    return { rendered: part.renderedLength, gzip: part.gzipLength, brotli: part.brotliLength };
}

function zero(): Sizes {
    return { rendered: 0, gzip: 0, brotli: 0 };
}

function addTo(target: Sizes, source: Sizes): void {
    target.rendered += source.rendered;
    target.gzip += source.gzip;
    target.brotli += source.brotli;
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${String(bytes)} B`;
    return `${(bytes / 1024).toFixed(1)} kB`;
}
