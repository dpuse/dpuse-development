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
        expect(readme).toContain('| **main.js** | 2.9 kB · gzip 900 B · 66.7% of the build |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src | `██████████░░░░░░░░░░` 50.0% · 500 B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ index.ts | `▒▒▒▒▒▒▒▒░░░░░░░░░░░░` 40.0% · 400 B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ helpers.ts | `▒▒░░░░░░░░░░░░░░░░░░` 10.0% · 100 B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;valibot → dist/index.js | `██████░░░░░░░░░░░░░░` 30.0% · 300 B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;@scope/pkg | `██░░░░░░░░░░░░░░░░░░` 10.0% · 100 B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ lib/a.js | `▒░░░░░░░░░░░░░░░░░░░` 5.0% · 50 B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;wasm → …_bg.wasm | `█░░░░░░░░░░░░░░░░░░░` 6.0% · 60 B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;(runtime) → commonjsHelpers.js | `░░░░░░░░░░░░░░░░░░░░` 2.0% · 20 B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `░░░░░░░░░░░░░░░░░░░░` 2.0% · 20 B |');
        expect(readme).toContain('| **worker.js** | 500 B · gzip 200 B · 33.3% of the build |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src → worker.ts | `████████████████████` 100.0% · 500 B |');
        expect(readme).toContain("Bars show each row's share of its output file. ↳ rows are part of the row above.");
        // The untraced bytes come last in their file, even when another group is no larger.
        expect(readme.indexOf('(runtime) → commonjsHelpers.js')).toBeLessThan(readme.indexOf('| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output'));
        expect(readme.indexOf('| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output')).toBeLessThan(readme.indexOf('| **worker.js**'));
        // An asset with no traced chunks still gets a row, and chunks without a parent file are left out.
        expect(readme).toContain('| **types.d.ts** | 100 B · gzip 0 B |');
        expect(readme).not.toContain('orphan');
        // Largest output file first.
        expect(readme.indexOf('| **main.js**')).toBeLessThan(readme.indexOf('| **worker.js**'));
    });

    it('leaves out the per-file rows at module level', async () => {
        await project.writeFiles({ 'bundle-analysis-reports/sonda/index.json': JSON.stringify(SONDA_REPORT), 'README.md': buildReadme('BUNDLE') });

        await documentBundleSizes({ moduleLevel: true });

        const readme = await project.readFile('README.md');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src | `██████████░░░░░░░░░░` 50.0% · 500 B |');
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
        expect(readme).toContain('| **main.js** | 200 B · gzip 50 B · 100.0% of the build |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src | `████████████████████` 100.0% · 200 B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ a.ts | `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░` 75.0% · 150 B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ b.ts | `▒▒▒▒▒░░░░░░░░░░░░░░░` 25.0% · 50 B |');

        await documentBundleSizes({ moduleLevel: true });
        expect(await project.readFile('README.md')).not.toContain('a.ts');
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
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ large.ts | `▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░` 90.0% · 900 B |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ 5 smaller files | `▒░░░░░░░░░░░░░░░░░░░` 5.0% · 50 B |');
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
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ tiny.ts | `░░░░░░░░░░░░░░░░░░░░` 1.0% · 10 B |');
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

    it('exits when there is no bundle analysis report', async () => {
        await project.writeFiles({ 'README.md': buildReadme('BUNDLE') });

        await expect(documentBundleSizes()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error documenting bundle sizes', expect.any(Error));
    });
});
