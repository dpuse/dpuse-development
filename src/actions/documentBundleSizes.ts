import { brotliCompress, gzip } from 'node:zlib';
import { promises as fs } from 'node:fs';
import { promisify } from 'node:util';
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile, substituteText, writeTextFile } from '@/utilities';

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

export async function documentBundleSizes(): Promise<void> {
    try {
        logOperationHeader('Document Bundle Sizes');

        logStepHeader('1️⃣  Read bundle analysis report');
        const json = await readJSONFile<VisualizerJson>('./bundle-analysis-reports/rollup-visualiser/index.json');

        logStepHeader(`2️⃣  Insert table into 'README.md'`);
        const bundleTable = await buildBundleTable(json);

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

async function buildBundleTable(json: VisualizerJson): Promise<string> {
    const groups = buildSourceGroups(json);
    const bundlerTotal = [...groups.values()].reduce((sum, g) => sum + g.sizes.rendered, 0);

    const distFiles = await readDistFileSizes();
    distFiles.sort((a, b) => b[1].rendered - a[1].rendered);

    const lines = [
        '| Module | Composition |',
        '| ------ | ----------- |'
    ];

    for (const [file, sizes] of distFiles) {
        lines.push(`| ${file} | ${formatBytes(sizes.rendered)} · gz ${formatBytes(sizes.gzip)} · br ${formatBytes(sizes.brotli)} |`);

        const sortedGroups = [...groups.entries()].sort((a, b) => b[1].sizes.rendered - a[1].sizes.rendered);
        for (const [groupName, { sizes: groupSizes, files }] of sortedGroups) {
            const groupPct = bundlerTotal > 0 ? (groupSizes.rendered / bundlerTotal) * 100 : 0;
            lines.push(`| ${INDENT}${groupName} | ${bar(groupPct)} |`);

            const sortedFiles = [...files.entries()].sort((a, b) => b[1].rendered - a[1].rendered);
            for (const [fileName, fileSizes] of sortedFiles) {
                const filePct = groupSizes.rendered > 0 ? (fileSizes.rendered / groupSizes.rendered) * 100 : 0;
                lines.push(`| ${INDENT}${INDENT}${fileName} | ${bar(filePct, '·')} |`);
            }
        }
    }

    return lines.join('\n');
}

async function readDistFileSizes(): Promise<[string, Sizes][]> {
    const entries = await fs.readdir('./dist');
    const jsFiles = entries.filter((f) => f.endsWith('.js') && !f.endsWith('.map'));

    return Promise.all(
        jsFiles.map(async (file) => {
            const buf = await fs.readFile(`./dist/${file}`);
            const [gzipped, brotlied] = await Promise.all([gzipAsync(buf), brotliAsync(buf)]);
            return [file, { rendered: buf.length, gzip: gzipped.length, brotli: brotlied.length }] as [string, Sizes];
        })
    );
}

function buildSourceGroups(json: VisualizerJson): Map<string, { sizes: Sizes; files: Map<string, Sizes> }> {
    const groups = new Map<string, { sizes: Sizes; files: Map<string, Sizes> }>();

    for (const meta of Object.values(json.nodeMetas)) {
        const groupName = sourceGroupName(meta.id);
        const fileName = shortModuleName(meta.id);
        for (const partUid of Object.values(meta.moduleParts)) {
            const part = json.nodeParts[partUid];
            if (!part) continue;
            const s = partSizes(part);

            const group = groups.get(groupName) ?? { sizes: zero(), files: new Map() };
            addTo(group.sizes, s);
            addTo(group.files.get(fileName) ?? (() => { const f = zero(); group.files.set(fileName, f); return f; })(), s);
            groups.set(groupName, group);
        }
    }

    return groups;
}

function bar(pct: number, empty = '░'): string {
    const count = Math.round((pct / 100) * BAR_WIDTH);
    return `${'█'.repeat(count)}${empty.repeat(BAR_WIDTH - count)} ${pct.toFixed(1)}%`;
}

function sourceGroupName(id: string): string {
    const path = id.startsWith('/') ? id.slice(1) : id;
    if (path.startsWith('\x00')) return '(runtime)';
    if (path.startsWith('node_modules/')) {
        const rest = path.slice('node_modules/'.length);
        if (rest.startsWith('@')) {
            const parts = rest.split('/');
            return `${parts[0]}/${parts[1]}`;
        }
        return rest.split('/')[0] ?? rest;
    }
    if (path.startsWith('rust/') || path.startsWith('__vite-plugin-wasm')) return 'wasm';
    return 'src';
}

function shortModuleName(id: string): string {
    const path = id.startsWith('/') ? id.slice(1) : id;
    if (path.startsWith('\x00')) return path.slice(1);
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
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} kB`;
}
