import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile, substituteText, writeTextFile } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

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
    const chunks = new Map<string, { rendered: number; gzip: number; brotli: number }>();

    for (const meta of Object.values(json.nodeMetas)) {
        for (const [chunkName, partUid] of Object.entries(meta.moduleParts)) {
            const part = json.nodeParts[partUid];
            if (!part) continue;
            const prev = chunks.get(chunkName) ?? { rendered: 0, gzip: 0, brotli: 0 };
            chunks.set(chunkName, {
                rendered: prev.rendered + part.renderedLength,
                gzip: prev.gzip + part.gzipLength,
                brotli: prev.brotli + part.brotliLength
            });
        }
    }

    return buildTable([...chunks.entries()].sort((a, b) => b[1].rendered - a[1].rendered));
}

function buildSourceTable(json: VisualizerJson): string {
    const groups = new Map<string, { rendered: number; gzip: number; brotli: number }>();

    for (const meta of Object.values(json.nodeMetas)) {
        for (const partUid of Object.values(meta.moduleParts)) {
            const part = json.nodeParts[partUid];
            if (!part) continue;
            const name = sourceGroupName(meta.id);
            const prev = groups.get(name) ?? { rendered: 0, gzip: 0, brotli: 0 };
            groups.set(name, {
                rendered: prev.rendered + part.renderedLength,
                gzip: prev.gzip + part.gzipLength,
                brotli: prev.brotli + part.brotliLength
            });
        }
    }

    return buildTable([...groups.entries()].sort((a, b) => b[1].rendered - a[1].rendered));
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

function buildTable(rows: [string, { rendered: number; gzip: number; brotli: number }][]): string {
    const total = rows.reduce(
        (acc, [, v]) => ({ rendered: acc.rendered + v.rendered, gzip: acc.gzip + v.gzip, brotli: acc.brotli + v.brotli }),
        { rendered: 0, gzip: 0, brotli: 0 }
    );

    return [
        '| Module | Rendered | Gzip | Brotli |',
        '| ------ | -------: | ---: | -----: |',
        ...rows.map(([name, s]) => `| \`${name}\` | ${formatBytes(s.rendered)} | ${formatBytes(s.gzip)} | ${formatBytes(s.brotli)} |`),
        `| **Total** | **${formatBytes(total.rendered)}** | **${formatBytes(total.gzip)}** | **${formatBytes(total.brotli)}** |`
    ].join('\n');
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} kB`;
}
