// ── External Dependencies & Registrations
import { gzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';

// ── Local Framework
import { documentBundleSizes } from '@/actions/documentBundleSizes';
import { buildReadme, useTemporaryProject } from '../support/temporaryProject';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

// Two output files: 'main.js' holds source, a dependency, runtime helpers, wasm and untraced bytes; 'worker.js' holds a
// single source file. Sizes are chosen so the percentages come out round.
const SONDA_REPORT = {
    resources: [
        { kind: 'asset', name: 'main.js', uncompressed: 3000, gzip: 900 },
        { kind: 'asset', name: 'worker.js', uncompressed: 500, gzip: 200 },
        { kind: 'asset', name: 'types.d.ts', uncompressed: 100 },
        { kind: 'chunk', name: 'src/index.ts', uncompressed: 400, gzip: 100, parent: 'main.js' },
        { kind: 'chunk', name: 'src/utilities/helpers.ts', uncompressed: 100, gzip: 30, parent: 'main.js' },
        { kind: 'chunk', name: 'node_modules/valibot/dist/index.js', uncompressed: 300, gzip: 90, parent: 'main.js' },
        { kind: 'chunk', name: 'node_modules/@scope/pkg/lib/a.js', uncompressed: 50, gzip: 10, parent: 'main.js' },
        { kind: 'chunk', name: 'node_modules/@scope/pkg/lib/b.js', uncompressed: 50, gzip: 10, parent: 'main.js' },
        { kind: 'chunk', name: '\u{0}commonjsHelpers.js', uncompressed: 20, gzip: 5, parent: 'main.js' },
        { kind: 'chunk', name: 'rust/parser/pkg/parser_bg.wasm', uncompressed: 60, gzip: 20, parent: 'main.js' },
        { kind: 'chunk', name: '[unassigned]', uncompressed: 20, parent: 'main.js' },
        { kind: 'chunk', name: 'src/worker.ts', uncompressed: 500, gzip: 200, parent: 'worker.js' },
        { kind: 'chunk', name: 'src/orphan.ts', uncompressed: 10, parent: null },
        { kind: 'sourcemap', name: 'main.js.map', uncompressed: 9000 }
    ],
    dependencies: [
        { name: 'valibot', paths: ['node_modules/valibot'] },
        { name: '@scope/pkg', paths: ['node_modules/@scope/pkg'] }
    ]
};

// ── State ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

describe('documentBundleSizes', () => {
    it('breaks each output file down by package, largest first', async () => {
        await project.writeFiles({ 'bundle-analysis-reports/sonda/index.json': JSON.stringify(SONDA_REPORT), 'README.md': buildReadme('BUNDLE') });

        await documentBundleSizes();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('## Bundle Analysis');
        expect(readme).toContain('|Chunk/Module/File|Composition|');
        // A heading gives its file's share of the build (3,600 bytes over the three files). Bars are a share of their own
        // output file (main.js traces 1,000 bytes).
        expect(readme).toContain('| **All 3 files** | 3.5&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;1.1&nbsp;kB |');
        expect(readme).toContain('| **main.js** | 2.9&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;900&nbsp;B&nbsp;·&nbsp;83.3%&nbsp;of&nbsp;the&nbsp;build |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src → index.ts + 1 more | `██████████░░░░░░░░░░`&nbsp;50.0%&nbsp;·&nbsp;500&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;valibot → dist/index.js | `██████░░░░░░░░░░░░░░`&nbsp;30.0%&nbsp;·&nbsp;300&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;@scope/pkg → lib/a.js + 1 more | `██░░░░░░░░░░░░░░░░░░`&nbsp;10.0%&nbsp;·&nbsp;100&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;wasm → …_bg.wasm | `█░░░░░░░░░░░░░░░░░░░`&nbsp;6.0%&nbsp;·&nbsp;60&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;(runtime) → commonjsHelpers.js | `░░░░░░░░░░░░░░░░░░░░`&nbsp;2.0%&nbsp;·&nbsp;20&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `░░░░░░░░░░░░░░░░░░░░`&nbsp;2.0%&nbsp;·&nbsp;20&nbsp;B |');
        expect(readme).toContain('| **worker.js** | 500&nbsp;B&nbsp;·&nbsp;gzip&nbsp;200&nbsp;B&nbsp;·&nbsp;13.9%&nbsp;of&nbsp;the&nbsp;build |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src → worker.ts | `████████████████████`&nbsp;100.0%&nbsp;·&nbsp;500&nbsp;B |');
        // A package's files are counted in its row, never listed beneath it.
        expect(readme).not.toContain('↳');
        expect(readme).not.toContain('helpers.ts');
        expect(readme).toContain("Bars show each row's share of its output file.");
        // The untraced bytes come last in their file, even when another group is no larger.
        expect(readme.indexOf('(runtime) → commonjsHelpers.js')).toBeLessThan(readme.indexOf('| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output'));
        expect(readme.indexOf('| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output')).toBeLessThan(readme.indexOf('| **worker.js**'));
        // An asset with no traced chunks still gets a row, and chunks without a parent file are left out.
        expect(readme).toContain('| **types.d.ts** | 100&nbsp;B&nbsp;·&nbsp;gzip&nbsp;0&nbsp;B&nbsp;·&nbsp;2.8%&nbsp;of&nbsp;the&nbsp;build |');
        expect(readme).not.toContain('orphan');
        // Largest output file first.
        expect(readme.indexOf('| **main.js**')).toBeLessThan(readme.indexOf('| **worker.js**'));
    });

    it('lists a file the build copies into the output folder, with its size and share of the build', async () => {
        // The script is far smaller than the WebAssembly it loads, which the bundler never sees.
        const wasm = 'w'.repeat(9000);
        const report = {
            resources: [
                { kind: 'asset', name: 'dist/main.js', uncompressed: 1000, gzip: 300 },
                { kind: 'chunk', name: 'src/index.ts', uncompressed: 1000, parent: 'dist/main.js' }
            ],
            dependencies: []
        };
        await project.writeFiles({
            'bundle-analysis-reports/sonda/index.json': JSON.stringify(report),
            'dist/main.js': 'x'.repeat(1000),
            'dist/engine/engine.wasm': wasm,
            'dist/main.js.map': '{}',
            'dist/types/index.d.ts': 'export {};',
            'dist/shipped-packages.json': '[]',
            'dist/.DS_Store': '',
            'README.md': buildReadme('BUNDLE')
        });

        await documentBundleSizes();

        const readme = await project.readFile('README.md');
        const wasmGzip = `${String(gzipSync(wasm).byteLength)}&nbsp;B`;
        expect(readme).toContain(`| **All 2 files** | 9.8&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;${String(300 + gzipSync(wasm).byteLength)}&nbsp;B |`);
        expect(readme).toContain(`| **dist/engine/engine.wasm** | 8.8&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;${wasmGzip}&nbsp;·&nbsp;90.0%&nbsp;of&nbsp;the&nbsp;build |`);
        expect(readme).toContain('| **dist/main.js** | 1000&nbsp;B&nbsp;·&nbsp;gzip&nbsp;300&nbsp;B&nbsp;·&nbsp;10.0%&nbsp;of&nbsp;the&nbsp;build |');
        expect(readme.indexOf('| **dist/engine/engine.wasm**')).toBeLessThan(readme.indexOf('| **dist/main.js**'));
        expect(readme).toContain('A file with no rows beneath it is shipped as it is');
        // Source maps, type declarations, the shipped packages record and hidden files are not part of what a browser loads.
        for (const name of ['main.js.map', 'index.d.ts', 'shipped-packages.json', '.DS_Store']) expect(readme).not.toContain(name);
    });

    it('gives a build of one file no total row', async () => {
        const report = {
            resources: [
                { kind: 'asset', name: 'dist/main.js', uncompressed: 200, gzip: 50 },
                { kind: 'chunk', name: 'src/a.ts', uncompressed: 200, parent: 'dist/main.js' }
            ],
            dependencies: []
        };
        await project.writeFiles({ 'bundle-analysis-reports/sonda/index.json': JSON.stringify(report), 'dist/main.js': 'x'.repeat(200), 'README.md': buildReadme('BUNDLE') });

        await documentBundleSizes();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('| **dist/main.js** | 200&nbsp;B&nbsp;·&nbsp;gzip&nbsp;50&nbsp;B&nbsp;·&nbsp;100.0%&nbsp;of&nbsp;the&nbsp;build |');
        expect(readme).not.toContain('**All ');
        expect(readme).not.toContain('A file with no rows beneath it');
    });

    it('shortens WebAssembly file names to the part after the crate name', async () => {
        const report = {
            resources: [
                { kind: 'asset', name: 'core.js', uncompressed: 300 },
                { kind: 'chunk', name: 'rust/my_crate/pkg/my_crate_bg.wasm?url', uncompressed: 200, parent: 'core.js' },
                { kind: 'chunk', name: 'rust/my_crate/pkg/my_crate_bg.js', uncompressed: 100, parent: 'core.js' }
            ],
            dependencies: []
        };
        await project.writeFiles({ 'bundle-analysis-reports/sonda/index.json': JSON.stringify(report), 'README.md': buildReadme('BUNDLE') });

        await documentBundleSizes();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;wasm → …_bg.wasm?url + 1 more |');
        expect(readme).not.toContain('my_crate_bg');
    });

    it('gives an inlined worker a row of its own, with what the worker report says it contains beneath it', async () => {
        // The worker is 100 characters of code plus a 69-character WebAssembly data URL (40 base64 characters, 30 bytes).
        const workerContent = `${'x'.repeat(100)}data:application/wasm;base64,${'AAAA'.repeat(10)}`;
        const mainContent = `var V = "${workerContent}";\nnew Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(V));\n`;
        const mainReport = {
            resources: [
                { kind: 'asset', name: 'main.js', uncompressed: mainContent.length },
                { kind: 'chunk', name: 'src/index.ts', uncompressed: 100, parent: 'main.js' },
                { kind: 'chunk', name: '[unassigned]', uncompressed: 200, parent: 'main.js' }
            ],
            dependencies: []
        };
        // The worker report traces 160 bytes, which leave main.js's untraced bytes.
        const workerReport = {
            resources: [
                { kind: 'asset', name: 'cache/worker.js', uncompressed: 160 },
                { kind: 'chunk', name: 'src/engine.ts', uncompressed: 50, parent: 'cache/worker.js' },
                { kind: 'chunk', name: 'rust/core/pkg/glue.js', uncompressed: 100, parent: 'cache/worker.js' },
                { kind: 'chunk', name: '[unassigned]', uncompressed: 10, parent: 'cache/worker.js' }
            ],
            dependencies: []
        };
        await project.writeFiles({
            'bundle-analysis-reports/sonda/index.json': JSON.stringify(mainReport),
            'bundle-analysis-reports/sonda/worker.json': JSON.stringify(workerReport),
            'main.js': mainContent,
            'cache/worker.js': workerContent,
            'README.md': buildReadme('BUNDLE')
        });

        await documentBundleSizes();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;(inlined worker) | `███████████░░░░░░░░░`&nbsp;53.3%&nbsp;·&nbsp;160&nbsp;B |');
        expect(readme).toContain(
            '| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ (Rust WebAssembly as base64, 30 B binary) | `▒▒▒▒▒░░░░░░░░░░░░░░░`&nbsp;23.0%&nbsp;·&nbsp;69&nbsp;B |'
        );
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ src → engine.ts | `▒▒▒░░░░░░░░░░░░░░░░░`&nbsp;16.7%&nbsp;·&nbsp;50&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ wasm → glue.js | `▒▒░░░░░░░░░░░░░░░░░░`&nbsp;10.3%&nbsp;·&nbsp;31&nbsp;B |');
        expect(readme).toContain(
            '| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ (bundler output, whitespace & JSON) | `▒░░░░░░░░░░░░░░░░░░░`&nbsp;3.3%&nbsp;·&nbsp;10&nbsp;B |'
        );
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src → index.ts | `███████░░░░░░░░░░░░░`&nbsp;33.3%&nbsp;·&nbsp;100&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `███░░░░░░░░░░░░░░░░░`&nbsp;13.3%&nbsp;·&nbsp;40&nbsp;B |');
        // The worker's WebAssembly is counted once, beneath the worker, though main.js holds the same text.
        expect(readme.match(/Rust WebAssembly as base64,/g)).toHaveLength(1);
        expect(readme).toContain("Bars show each row's share of its output file. ↳ rows are part of the row above.");
        expect(readme).toContain('(inlined worker) = a Web Worker built separately');
        expect(readme).toContain('(Rust WebAssembly as base64…) = the compiled Rust code');
    });

    it('shows no inlined worker where the build wrote no worker report, even if the code starts a worker', async () => {
        const content = `var V = "worker code";\nnew Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(V));\n`;
        const report = {
            resources: [
                { kind: 'asset', name: 'main.js', uncompressed: content.length },
                { kind: 'chunk', name: 'src/index.ts', uncompressed: 50, parent: 'main.js' },
                { kind: 'chunk', name: '[unassigned]', uncompressed: 50, parent: 'main.js' }
            ],
            dependencies: []
        };
        await project.writeFiles({ 'bundle-analysis-reports/sonda/index.json': JSON.stringify(report), 'main.js': content, 'README.md': buildReadme('BUNDLE') });

        await documentBundleSizes();

        const readme = await project.readFile('README.md');
        expect(readme).not.toContain('(inlined worker)');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `██████████░░░░░░░░░░`&nbsp;50.0%&nbsp;·&nbsp;50&nbsp;B |');
    });

    it('takes WebAssembly embedded in the main file out of the wasm-bindgen file that embeds it', async () => {
        const content = 'const url = new URL("data:application/wasm;base64,AAAAAAAA");\n'; // A 37-character data URL decoding to 6 bytes.
        const report = {
            resources: [
                { kind: 'asset', name: 'core.js', uncompressed: content.length },
                { kind: 'chunk', name: 'rust/core/pkg/glue.js', uncompressed: 100, parent: 'core.js' }
            ],
            dependencies: []
        };
        await project.writeFiles({ 'bundle-analysis-reports/sonda/index.json': JSON.stringify(report), 'core.js': content, 'README.md': buildReadme('BUNDLE') });

        await documentBundleSizes();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;wasm → glue.js | `█████████████░░░░░░░`&nbsp;63.0%&nbsp;·&nbsp;63&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;(Rust WebAssembly as base64, 6 B binary) | `███████░░░░░░░░░░░░░`&nbsp;37.0%&nbsp;·&nbsp;37&nbsp;B |');
        expect(readme).not.toContain('(inlined worker)');
    });

    it('labels a row of several files by its largest, with a count of the rest', async () => {
        // 'd3' is in both output files, three of its files in one and one in the other.
        const report = {
            resources: [
                { kind: 'asset', name: 'a.js', uncompressed: 400, gzip: 100 },
                { kind: 'asset', name: 'b.js', uncompressed: 200, gzip: 50 },
                { kind: 'chunk', name: 'node_modules/d3/src/x.js', uncompressed: 150, parent: 'a.js' },
                { kind: 'chunk', name: 'node_modules/d3/src/y.js', uncompressed: 50, parent: 'a.js' },
                { kind: 'chunk', name: 'node_modules/d3/src/z.js', uncompressed: 100, parent: 'a.js' },
                { kind: 'chunk', name: 'node_modules/solo/a.js', uncompressed: 100, parent: 'a.js' },
                { kind: 'chunk', name: 'node_modules/d3/src/w.js', uncompressed: 200, parent: 'b.js' }
            ],
            dependencies: [
                { name: 'd3', paths: ['node_modules/d3'] },
                { name: 'solo', paths: ['node_modules/solo'] }
            ]
        };
        await project.writeFiles({ 'bundle-analysis-reports/sonda/index.json': JSON.stringify(report), 'README.md': buildReadme('BUNDLE') });

        await documentBundleSizes();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;d3 → src/x.js + 2 more | `███████████████░░░░░`&nbsp;75.0%&nbsp;·&nbsp;300&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;d3 → src/w.js | `████████████████████`&nbsp;100.0%&nbsp;·&nbsp;200&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;solo → a.js | `█████░░░░░░░░░░░░░░░`&nbsp;25.0%&nbsp;·&nbsp;100&nbsp;B |');
        expect(readme).toContain('+ n more = the row also holds n more files from the same package or folder');
    });

    it('shortens a long path from its start, keeping any group prefix and the full path on hover', async () => {
        const report = {
            resources: [
                { kind: 'asset', name: 'dist/client/assets/ContextDescriptorsPanel-D_ZLlLwF.js', uncompressed: 200, gzip: 50 },
                {
                    kind: 'chunk',
                    name: 'node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js',
                    uncompressed: 100,
                    parent: 'dist/client/assets/ContextDescriptorsPanel-D_ZLlLwF.js'
                },
                { kind: 'chunk', name: 'node_modules/@vue/runtime-core/dist/other.js', uncompressed: 50, parent: 'dist/client/assets/ContextDescriptorsPanel-D_ZLlLwF.js' },
                { kind: 'chunk', name: 'src/short.ts', uncompressed: 50, parent: 'dist/client/assets/ContextDescriptorsPanel-D_ZLlLwF.js' }
            ],
            dependencies: [{ name: '@vue/runtime-core', paths: ['node_modules/@vue/runtime-core'] }]
        };
        await project.writeFiles({ 'bundle-analysis-reports/sonda/index.json': JSON.stringify(report), 'README.md': buildReadme('BUNDLE') });

        await documentBundleSizes();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('| **<abbr title="dist/client/assets/ContextDescriptorsPanel-D_ZLlLwF.js">…ient/assets/ContextDescriptorsPanel-D_ZLlLwF.js</abbr>** |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;@vue/runtime-core → <abbr title="dist/runtime-core.esm-bundler.js">…runtime-core.esm-bundler.js</abbr> + 1 more |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src → short.ts |');
    });

    it('exits when there is no bundle analysis report', async () => {
        await project.writeFiles({ 'README.md': buildReadme('BUNDLE') });

        await expect(documentBundleSizes()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error documenting bundle sizes', expect.any(Error));
    });
});
