// ── External Dependencies & Registrations
import { describe, expect, it } from 'vitest';

// ── Local Framework
import { documentBundleSizes } from '@/actions/documentBundleSizes';
import { buildReadme, useTemporaryProject } from '../support/temporaryProject';

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

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

describe('documentBundleSizes', () => {
    it('breaks each output file down by dependency and file, largest first', async () => {
        await project.writeFiles({ 'bundle-analysis-reports/sonda/index.json': JSON.stringify(SONDA_REPORT), 'README.md': buildReadme('BUNDLE') });

        await documentBundleSizes();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('## Bundle Analysis');
        expect(readme).toContain('|Chunk/Module/File|Composition|');
        // Bars are a share of their own output file (main.js traces 1,000 bytes), '↳' rows on the same scale; the heading
        // gives the file's share of the build (1,500 bytes traced across both files).
        expect(readme).toContain('| **main.js** | 2.9&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;900&nbsp;B&nbsp;·&nbsp;66.7%&nbsp;of&nbsp;the&nbsp;build |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src → index.ts + 1 more | `██████████░░░░░░░░░░`&nbsp;50.0%&nbsp;·&nbsp;500&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ index.ts | `▒▒▒▒▒▒▒▒░░░░░░░░░░░░`&nbsp;40.0%&nbsp;·&nbsp;400&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ helpers.ts | `▒▒░░░░░░░░░░░░░░░░░░`&nbsp;10.0%&nbsp;·&nbsp;100&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;valibot → dist/index.js | `██████░░░░░░░░░░░░░░`&nbsp;30.0%&nbsp;·&nbsp;300&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;@scope/pkg → lib/a.js + 1 more | `██░░░░░░░░░░░░░░░░░░`&nbsp;10.0%&nbsp;·&nbsp;100&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ lib/a.js | `▒░░░░░░░░░░░░░░░░░░░`&nbsp;5.0%&nbsp;·&nbsp;50&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;wasm → …_bg.wasm | `█░░░░░░░░░░░░░░░░░░░`&nbsp;6.0%&nbsp;·&nbsp;60&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;(runtime) → commonjsHelpers.js | `░░░░░░░░░░░░░░░░░░░░`&nbsp;2.0%&nbsp;·&nbsp;20&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `░░░░░░░░░░░░░░░░░░░░`&nbsp;2.0%&nbsp;·&nbsp;20&nbsp;B |');
        expect(readme).toContain('| **worker.js** | 500&nbsp;B&nbsp;·&nbsp;gzip&nbsp;200&nbsp;B&nbsp;·&nbsp;33.3%&nbsp;of&nbsp;the&nbsp;build |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src → worker.ts | `████████████████████`&nbsp;100.0%&nbsp;·&nbsp;500&nbsp;B |');
        expect(readme).toContain("Bars show each row's share of its output file. ↳ rows are part of the row above.");
        // The untraced bytes come last in their file, even when another group is no larger.
        expect(readme.indexOf('(runtime) → commonjsHelpers.js')).toBeLessThan(readme.indexOf('| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output'));
        expect(readme.indexOf('| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output')).toBeLessThan(readme.indexOf('| **worker.js**'));
        // An asset with no traced chunks still gets a row, and chunks without a parent file are left out.
        expect(readme).toContain('| **types.d.ts** | 100&nbsp;B&nbsp;·&nbsp;gzip&nbsp;0&nbsp;B |');
        expect(readme).not.toContain('orphan');
        // Largest output file first.
        expect(readme.indexOf('| **main.js**')).toBeLessThan(readme.indexOf('| **worker.js**'));
    });

    it('leaves out the per-file rows at module level', async () => {
        await project.writeFiles({ 'bundle-analysis-reports/sonda/index.json': JSON.stringify(SONDA_REPORT), 'README.md': buildReadme('BUNDLE') });

        await documentBundleSizes({ moduleLevel: true });

        const readme = await project.readFile('README.md');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src → index.ts + 1 more | `██████████░░░░░░░░░░`&nbsp;50.0%&nbsp;·&nbsp;500&nbsp;B |');
        expect(readme).not.toContain('↳');
        expect(readme).toContain("Bars show each row's share of its output file.");
    });

    it('lists the files under a single group that holds several of them', async () => {
        const report = {
            resources: [
                { kind: 'asset', name: 'main.js', uncompressed: 200, gzip: 50 },
                { kind: 'chunk', name: 'src/a.ts', uncompressed: 150, gzip: 40, parent: 'main.js' },
                { kind: 'chunk', name: 'src/b.ts', uncompressed: 50, gzip: 10, parent: 'main.js' }
            ],
            dependencies: []
        };
        await project.writeFiles({ 'bundle-analysis-reports/sonda/index.json': JSON.stringify(report), 'README.md': buildReadme('BUNDLE') });

        await documentBundleSizes();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('| **main.js** | 200&nbsp;B&nbsp;·&nbsp;gzip&nbsp;50&nbsp;B&nbsp;·&nbsp;100.0%&nbsp;of&nbsp;the&nbsp;build |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src → a.ts + 1 more | `████████████████████`&nbsp;100.0%&nbsp;·&nbsp;200&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ a.ts | `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░`&nbsp;75.0%&nbsp;·&nbsp;150&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ b.ts | `▒▒▒▒▒░░░░░░░░░░░░░░░`&nbsp;25.0%&nbsp;·&nbsp;50&nbsp;B |');

        await documentBundleSizes({ moduleLevel: true });
        expect(await project.readFile('README.md')).not.toContain('b.ts');
    });

    it('combines files too small to show a bar, keeping the combined row within one bar character', async () => {
        // One large file and ten of 1% each: the five smallest fit within 5% and are combined; the other five stay named.
        const smallFiles = Array.from({ length: 10 }, (_, index) => ({ kind: 'chunk', name: `src/small${String(index)}.ts`, uncompressed: 10, parent: 'main.js' }));
        const report = {
            resources: [
                { kind: 'asset', name: 'main.js', uncompressed: 1000, gzip: 300 },
                { kind: 'chunk', name: 'src/large.ts', uncompressed: 900, parent: 'main.js' },
                ...smallFiles
            ],
            dependencies: []
        };
        await project.writeFiles({ 'bundle-analysis-reports/sonda/index.json': JSON.stringify(report), 'README.md': buildReadme('BUNDLE') });

        await documentBundleSizes();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ large.ts | `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░`&nbsp;90.0%&nbsp;·&nbsp;900&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ 5 smaller files | `▒░░░░░░░░░░░░░░░░░░░`&nbsp;5.0%&nbsp;·&nbsp;50&nbsp;B |');
        expect(readme.match(/↳ small\d\.ts/g)).toHaveLength(5);
    });

    it('keeps a lone small file named rather than combining it', async () => {
        const report = {
            resources: [
                { kind: 'asset', name: 'main.js', uncompressed: 1000, gzip: 300 },
                { kind: 'chunk', name: 'src/large.ts', uncompressed: 990, parent: 'main.js' },
                { kind: 'chunk', name: 'src/tiny.ts', uncompressed: 10, parent: 'main.js' }
            ],
            dependencies: []
        };
        await project.writeFiles({ 'bundle-analysis-reports/sonda/index.json': JSON.stringify(report), 'README.md': buildReadme('BUNDLE') });

        await documentBundleSizes();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ tiny.ts | `░░░░░░░░░░░░░░░░░░░░`&nbsp;1.0%&nbsp;·&nbsp;10&nbsp;B |');
        expect(readme).not.toContain('smaller files');
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
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ …_bg.wasm?url |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ …_bg.js |');
        expect(readme).not.toContain('my_crate_bg');
    });

    it('gives an inlined worker and the WebAssembly embedded in it rows of their own, broken down by the worker report', async () => {
        // The worker text is 100 characters of code plus a 69-character WebAssembly data URL (40 base64 characters, 30 bytes).
        const workerText = `${'x'.repeat(100)}data:application/wasm;base64,${'AAAA'.repeat(10)}`;
        const mainContent = `var V = "${workerText}";\nnew Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(V));\n`;
        const mainReport = {
            resources: [
                { kind: 'asset', name: 'main.js', uncompressed: mainContent.length },
                { kind: 'chunk', name: 'src/index.ts', uncompressed: 100, parent: 'main.js' },
                { kind: 'chunk', name: '[unassigned]', uncompressed: 200, parent: 'main.js' }
            ],
            dependencies: []
        };
        // 160 bytes are traced, so the other 9 of the worker's 169 are the escaping added to embed it.
        const workerReport = {
            resources: [
                { kind: 'asset', name: 'worker.js', uncompressed: 160 },
                { kind: 'chunk', name: 'src/engine.ts', uncompressed: 50, parent: 'worker.js' },
                { kind: 'chunk', name: 'rust/core/pkg/glue.js', uncompressed: 100, parent: 'worker.js' },
                { kind: 'chunk', name: '[unassigned]', uncompressed: 10, parent: 'worker.js' }
            ],
            dependencies: []
        };
        await project.writeFiles({
            'bundle-analysis-reports/sonda/index.json': JSON.stringify(mainReport),
            'bundle-analysis-reports/sonda/worker.json': JSON.stringify(workerReport),
            'main.js': mainContent,
            'README.md': buildReadme('BUNDLE')
        });

        await documentBundleSizes();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;(inlined worker) | `███████████░░░░░░░░░`&nbsp;56.3%&nbsp;·&nbsp;169&nbsp;B |');
        expect(readme).toContain(
            '| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ (Rust WebAssembly as base64, 30 B binary) | `▒▒▒▒▒░░░░░░░░░░░░░░░`&nbsp;23.0%&nbsp;·&nbsp;69&nbsp;B |'
        );
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ engine.ts | `▒▒▒░░░░░░░░░░░░░░░░░`&nbsp;16.7%&nbsp;·&nbsp;50&nbsp;B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ wasm → glue.js | `▒▒░░░░░░░░░░░░░░░░░░`&nbsp;10.3%&nbsp;·&nbsp;31&nbsp;B |');
        expect(readme).toContain(
            '| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ (bundler output, whitespace & JSON) | `▒░░░░░░░░░░░░░░░░░░░`&nbsp;6.3%&nbsp;·&nbsp;19&nbsp;B |'
        );
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `██░░░░░░░░░░░░░░░░░░`&nbsp;10.3%&nbsp;·&nbsp;31&nbsp;B |');
        expect(readme).toContain('(inlined worker) = a Web Worker built separately');
        expect(readme).toContain('(Rust WebAssembly as base64…) = the compiled Rust code');
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

        await documentBundleSizes({ moduleLevel: true });

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

        await documentBundleSizes({ moduleLevel: true });

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
