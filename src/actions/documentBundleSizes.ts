import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile, substituteText, writeTextFile } from '@/utilities';

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

const CHUNKS_START_MARKER = '<!-- BUNDLE_CHUNKS_START -->';
const CHUNKS_END_MARKER = '<!-- BUNDLE_CHUNKS_END -->';
const SIZES_START_MARKER = '<!-- BUNDLE_SIZES_START -->';
const SIZES_END_MARKER = '<!-- BUNDLE_SIZES_END -->';
const INDENT = '&nbsp;&nbsp;&nbsp;&nbsp;';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentBundleSizes(): Promise<void> {
    try {
        logOperationHeader('Document Bundle Sizes');

        logStepHeader('1️⃣  Read bundle analysis report');
        const json = await readJSONFile<VisualizerJson>('./bundle-analysis-reports/rollup-visualiser/index.json');

        logStepHeader(`2️⃣  Insert tables into 'README.md'`);
        const chunkTable = buildChunkTable(json);
        const sourceTable = buildSourceTable(json);

        const readme = await readTextFile('./README.md');
        const withChunks = substituteText(readme, `\n${chunkTable}\n`, CHUNKS_START_MARKER, CHUNKS_END_MARKER);
        const withSizes = substituteText(withChunks, `\n${sourceTable}\n`, SIZES_START_MARKER, SIZES_END_MARKER);
        await writeTextFile('README.md', withSizes);

        logOperationSuccess('Bundle sizes documented.');
    } catch (error) {
        console.error('❌  Error documenting bundle sizes.', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

function buildChunkTable(json: VisualizerJson): string {
    // chunk → source group → sizes
    const chunks = new Map<string, { sizes: Sizes; groups: Map<string, Sizes> }>();

    for (const meta of Object.values(json.nodeMetas)) {
        const group = sourceGroupName(meta.id);
        for (const [chunkName, partUid] of Object.entries(meta.moduleParts)) {
            const part = json.nodeParts[partUid];
            if (!part) continue;
            const s = partSizes(part);

            const chunk = chunks.get(chunkName) ?? { sizes: zero(), groups: new Map() };
            addTo(chunk.sizes, s);
            addTo(chunk.groups.get(group) ?? (() => { const g = zero(); chunk.groups.set(group, g); return g; })(), s);
            chunks.set(chunkName, chunk);
        }
    }

    const sorted = [...chunks.entries()].sort((a, b) => b[1].sizes.rendered - a[1].sizes.rendered);
    const total = sorted.reduce((acc, [, v]) => { addTo(acc, v.sizes); return acc; }, zero());

    const lines = [
        '| Module | Rendered | Gzip | Brotli |',
        '| ------ | -------: | ---: | -----: |'
    ];

    for (const [chunkName, { sizes, groups }] of sorted) {
        lines.push(row(`\`${chunkName}\``, sizes));
        const sortedGroups = [...groups.entries()].sort((a, b) => b[1].rendered - a[1].rendered);
        for (const [groupName, groupSizes] of sortedGroups) {
            lines.push(row(`${INDENT}\`${groupName}\``, groupSizes));
        }
    }

    lines.push(row('Total', total, true));
    return lines.join('\n');
}

function buildSourceTable(json: VisualizerJson): string {
    // source group → individual file → sizes
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

    const sorted = [...groups.entries()].sort((a, b) => b[1].sizes.rendered - a[1].sizes.rendered);
    const total = sorted.reduce((acc, [, v]) => { addTo(acc, v.sizes); return acc; }, zero());

    const lines = [
        '| Module | Rendered | Gzip | Brotli |',
        '| ------ | -------: | ---: | -----: |'
    ];

    for (const [groupName, { sizes, files }] of sorted) {
        lines.push(row(`\`${groupName}\``, sizes));
        const sortedFiles = [...files.entries()].sort((a, b) => b[1].rendered - a[1].rendered);
        for (const [fileName, fileSizes] of sortedFiles) {
            lines.push(row(`${INDENT}\`${fileName}\``, fileSizes));
        }
    }

    lines.push(row('Total', total, true));
    return lines.join('\n');
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

function row(name: string, s: Sizes, bold = false): string {
    const fmt = (v: string) => bold ? `**${v}**` : v;
    return `| ${fmt(name)} | ${fmt(formatBytes(s.rendered))} | ${fmt(formatBytes(s.gzip))} | ${fmt(formatBytes(s.brotli))} |`;
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} kB`;
}
