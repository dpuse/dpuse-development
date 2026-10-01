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
        expect(readme).toContain('|Chunk/Module/File|Size|Composition|');
        // Bars are a share of their own output file (main.js traces 1,000 bytes); the heading gives the file's share of
        // the build (1,500 bytes traced across both files).
        expect(readme).toContain('| **main.js** | 2.9 kB · gzip 900 B | 66.7% of the build |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src | 500 B | `██████████░░░░░░░░░░` 50.0% |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ index.ts | 400 B | 80.0% of src |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ helpers.ts | 100 B | 20.0% of src |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;valibot → dist/index.js | 300 B | `██████░░░░░░░░░░░░░░` 30.0% |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;@scope/pkg | 100 B | `██░░░░░░░░░░░░░░░░░░` 10.0% |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ lib/a.js | 50 B | 50.0% of @scope/pkg |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;wasm → parser_bg.wasm | 60 B | `█░░░░░░░░░░░░░░░░░░░` 6.0% |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;(runtime) → commonjsHelpers.js | 20 B | `░░░░░░░░░░░░░░░░░░░░` 2.0% |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | 20 B | `░░░░░░░░░░░░░░░░░░░░` 2.0% |');
        expect(readme).toContain('| **worker.js** | 500 B · gzip 200 B | 33.3% of the build |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src → worker.ts | 500 B | `████████████████████` 100.0% |');
        // An asset with no traced chunks still gets a row, and chunks without a parent file are left out.
        expect(readme).toContain('| **types.d.ts** | 100 B · gzip 0 B |  |');
        expect(readme).not.toContain('orphan');
        // Largest output file first.
        expect(readme.indexOf('| **main.js**')).toBeLessThan(readme.indexOf('| **worker.js**'));
    });

    it('leaves out the per-file rows at module level', async () => {
        await project.writeFiles({ 'bundle-analysis-reports/sonda/index.json': JSON.stringify(SONDA_REPORT), 'README.md': buildReadme('BUNDLE') });

        await documentBundleSizes({ moduleLevel: true });

        const readme = await project.readFile('README.md');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src | 500 B |');
        expect(readme).not.toContain('↳');
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
        expect(readme).toContain('| **main.js** | 200 B · gzip 50 B | 100.0% of the build |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;src | 200 B | `████████████████████` 100.0% |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ a.ts | 150 B | 75.0% of src |');
        expect(readme).toContain('| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ b.ts | 50 B | 25.0% of src |');

        await documentBundleSizes({ moduleLevel: true });
        expect(await project.readFile('README.md')).not.toContain('a.ts');
    });

    it('exits when there is no bundle analysis report', async () => {
        await project.writeFiles({ 'README.md': buildReadme('BUNDLE') });

        await expect(documentBundleSizes()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error documenting bundle sizes', expect.any(Error));
    });
});
