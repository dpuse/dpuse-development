/* eslint-disable security/detect-non-literal-fs-filename -- Tests only name files inside their own temporary folder. */

// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { documentDependencies } from '@/actions/documentDependencies';
import { buildReadme, useTemporaryProject } from '../support/temporaryProject';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// The licence checker and 'npm ls' write the two files the README is built from, so the mocks write fixtures instead.
const licenseChecker = vi.hoisted((): { licenses: object; error: Error | undefined; options: { excludePackages?: string; production?: boolean } } => ({
    licenses: {},
    error: undefined,
    options: {}
}));
vi.mock('license-checker-rseidelsohn', () => ({
    init: (options: { excludePackages?: string; production?: boolean }, callback: (error: Error | undefined) => void) => {
        licenseChecker.options = options;
        void fs.mkdir('licenses', { recursive: true }).then(async () => {
            await fs.writeFile('licenses/licenses.json', JSON.stringify(licenseChecker.licenses), 'utf-8');
            callback(licenseChecker.error);
        });
    }
}));

const licenseTree = vi.hoisted((): { tree: object } => ({ tree: {} }));
vi.mock('@/utilities', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    spawnCommandToFile: vi.fn(async (_label: string, _command: string, _arguments: string[], outputPath: string) => {
        await fs.writeFile(outputPath, JSON.stringify(licenseTree.tree), 'utf-8');
    })
}));

// Listing Rust crates runs Cargo and is tested on its own; here it returns whatever crates a test sets.
const rustCrates = vi.hoisted((): { result: unknown } => ({ result: null }));
vi.mock('@/utilities/rustCrates', () => ({ documentRustCrates: vi.fn(() => Promise.resolve(rustCrates.result)) }));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

// npm registry answers, keyed by package name.
function stubRegistry(packages: Record<string, 'fail' | 'reject' | { latest: string; time: Record<string, string> }>): void {
    vi.stubGlobal(
        'fetch',
        vi.fn((url: string) => {
            const name = decodeURIComponent(url.replace('https://registry.npmjs.org/', ''));
            const entry = packages[name];
            if (entry === 'reject') return Promise.reject(new Error('network down'));
            const response =
                entry === undefined || entry === 'fail'
                    ? { ok: false, json: () => Promise.resolve({}) }
                    : { ok: true, json: () => Promise.resolve({ 'dist-tags': { latest: entry.latest }, time: entry.time }) };
            return Promise.resolve(response);
        })
    );
}

describe('documentDependencies', () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2026-09-15T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('leaves development-only packages out, with a warning in their place', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ name: '@dpuse/dpuse-development' }), 'README.md': buildReadme('DEPENDENCY_LICENSES') });

        await documentDependencies();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('## Dependency Licenses');
        expect(readme).toContain('@dpuse/dpuse-development is a development-only tool and is never part of a production release.');
    });

    it('leaves out packages the project does not ship, such as an optional peer used only in development', async () => {
        await project.writeFiles({
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-shared' }),
            'package-lock.json': JSON.stringify({
                packages: {
                    '': { name: '@dpuse/dpuse-shared', dependencies: { valibot: '^1.5.0' }, devDependencies: { vitest: '^5.0.0', 'shared-both-ways': '^1.0.0' } },
                    'node_modules/valibot': {
                        version: '1.5.0',
                        dependencies: { 'shared-both-ways': '^1.0.0' },
                        peerDependencies: { typescript: '>=5' },
                        peerDependenciesMeta: { typescript: { optional: true } }
                    },
                    'node_modules/typescript': { version: '6.0.3', devOptional: true },
                    'node_modules/vitest': { version: '5.0.2', dev: true },
                    'node_modules/shared-both-ways': { version: '1.0.0', dev: true },
                    'node_modules/valibot/node_modules/shared-both-ways': { version: '1.0.0' }
                }
            }),
            'README.md': buildReadme('DEPENDENCY_LICENSES')
        });
        licenseChecker.licenses = { 'valibot@1.5.0': { licenses: 'MIT' } };
        licenseTree.tree = { dependencies: { valibot: { version: '1.5.0', dependencies: { typescript: { version: '6.0.3' } } } } };
        stubRegistry({});

        await documentDependencies();

        expect(licenseChecker.options.excludePackages).toBe('@dpuse/dpuse-shared;typescript@6.0.3;vitest@5.0.2');
        const readme = await project.readFile('README.md');
        expect(readme).toContain('- **[valibot](https://www.npmjs.com/package/valibot)** 1.5.0');
        expect(readme).not.toContain('typescript');
    });

    it('leaves out a package npm marks only as optional when it is reached only through a development tool', async () => {
        // npm marks lightningcss's platform binary under Vite as 'optional' rather than 'devOptional', although Vite is a
        // development tool reached from the project only through vue-router's optional peer.
        await project.writeFiles({
            'package.json': JSON.stringify({ name: 'dpuse-app' }),
            'package-lock.json': JSON.stringify({
                packages: {
                    '': { name: 'dpuse-app', dependencies: { 'vue-router': '^5.0.0' }, devDependencies: { vite: '^8.0.0' } },
                    'node_modules/vue-router': { version: '5.3.1', peerDependencies: { vite: '^8.0.0' }, peerDependenciesMeta: { vite: { optional: true } } },
                    'node_modules/vite': { version: '8.3.2', devOptional: true, dependencies: { lightningcss: '^1.33.0' } },
                    'node_modules/vite/node_modules/lightningcss': { version: '1.33.0', devOptional: true, optionalDependencies: { 'lightningcss-darwin-arm64': '1.33.0' } },
                    'node_modules/vite/node_modules/lightningcss-darwin-arm64': { version: '1.33.0', optional: true }
                }
            }),
            'README.md': buildReadme('DEPENDENCY_LICENSES')
        });
        licenseChecker.licenses = { 'vue-router@5.3.1': { licenses: 'MIT' } };
        licenseTree.tree = { dependencies: { 'vue-router': { version: '5.3.1' } } };
        stubRegistry({});

        await documentDependencies();

        expect(licenseChecker.options.excludePackages).toBe('dpuse-app;vite@8.3.2;lightningcss@1.33.0;lightningcss-darwin-arm64@1.33.0');
    });

    it('keeps a required peer, which ships with the package that needs it', async () => {
        await project.writeFiles({
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-shared' }),
            'package-lock.json': JSON.stringify({
                packages: {
                    '': { name: '@dpuse/dpuse-shared', dependencies: { plugin: '^1.0.0' } },
                    'node_modules/plugin': { version: '1.0.0', peerDependencies: { host: '^2.0.0' } },
                    'node_modules/host': { version: '2.0.0', peer: true }
                }
            }),
            'README.md': buildReadme('DEPENDENCY_LICENSES')
        });
        licenseChecker.licenses = { 'plugin@1.0.0': { licenses: 'MIT' }, 'host@2.0.0': { licenses: 'MIT' } };
        licenseTree.tree = { dependencies: { plugin: { version: '1.0.0' } } };
        stubRegistry({});

        await documentDependencies();

        expect(licenseChecker.options.excludePackages).toBe('@dpuse/dpuse-shared');
    });

    it('leaves out of the tree optional peers that are not installed, which npm lists with no version', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ name: '@dpuse/dpuse-shared' }), 'README.md': buildReadme('DEPENDENCY_LICENSES') });
        licenseChecker.licenses = { 'valibot@1.5.0': { licenses: 'MIT' } };
        licenseTree.tree = { dependencies: { valibot: { version: '1.5.0', dependencies: { '@opentelemetry/api': {} } } } };
        stubRegistry({});

        await documentDependencies();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('- **[valibot](https://www.npmjs.com/package/valibot)** 1.5.0');
        expect(readme).not.toContain('@opentelemetry/api');
    });

    describe('with a build record', () => {
        // The app ships vue-router and an icon set listed for development; Vite and vue-router's build tools do not ship.
        const lockFile = JSON.stringify({
            packages: {
                '': { name: 'dpuse-app', dependencies: { 'vue-router': '^5.0.0' }, devDependencies: { '@lucide/vue': '^1.0.0', vite: '^8.0.0' } },
                'node_modules/vue-router': { version: '5.3.1', dependencies: { chokidar: '^5.0.0' } },
                'node_modules/chokidar': { version: '5.0.0' },
                'node_modules/@lucide/vue': { version: '1.49.0', dev: true },
                'node_modules/vite': { version: '8.3.2', dev: true }
            }
        });

        it('checks exactly the packages the build recorded, including one listed for development, in one table', async () => {
            await project.writeFiles({
                'package.json': JSON.stringify({ name: 'dpuse-app' }),
                'package-lock.json': lockFile,
                'bundle-analysis-reports/shipped-packages.json': JSON.stringify({ packages: ['@lucide/vue@1.49.0', 'vue-router@5.3.1'], external: [] }),
                'README.md': buildReadme('DEPENDENCY_LICENSES')
            });
            licenseChecker.licenses = { 'vue-router@5.3.1': { licenses: 'MIT' }, '@lucide/vue@1.49.0': { licenses: 'ISC' } };
            licenseTree.tree = {};
            stubRegistry({ 'vue-router': { latest: '5.3.1', time: { '5.3.1': '2026-09-01T00:00:00Z' } } });

            await documentDependencies('ISC;MIT');

            expect(licenseChecker.options.excludePackages).toBe('dpuse-app;chokidar@5.0.0;vite@8.3.2');
            expect(licenseChecker.options.production).toBe(false);
            const readme = await project.readFile('README.md');
            expect(readme).toContain("every package whose code, styles or assets are included in this project's build");
            expect(readme).toContain('|Dependency|Version|License(s)|Document|');
            expect(readme).toContain('|[@lucide/vue](https://www.npmjs.com/package/@lucide/vue)|1.49.0|');
            expect(readme).toContain('|[vue-router](https://www.npmjs.com/package/vue-router)|5.3.1|MIT|');
        });

        it('lists in the tree only what ships, putting what ships beneath a package that does not in its place', async () => {
            await project.writeFiles({
                'package.json': JSON.stringify({ name: 'dpuse-app', dependencies: { vue: '^3.5.0' }, devDependencies: { '@vitejs/plugin-vue': '^6.0.0' } }),
                'package-lock.json': JSON.stringify({
                    packages: {
                        '': { name: 'dpuse-app', dependencies: { vue: '^3.5.0' }, devDependencies: { '@vitejs/plugin-vue': '^6.0.0' } },
                        'node_modules/vue': { version: '3.5.43', dependencies: { '@vue/runtime-dom': '3.5.43', '@vue/compiler-dom': '3.5.43' } },
                        'node_modules/@vue/runtime-dom': { version: '3.5.43', dependencies: { '@vue/shared': '3.5.43' } },
                        'node_modules/@vue/compiler-dom': { version: '3.5.43', dependencies: { '@vue/shared': '3.5.43' } },
                        'node_modules/@vue/shared': { version: '3.5.43' },
                        'node_modules/@vitejs/plugin-vue': { version: '6.0.1', dev: true }
                    }
                }),
                'bundle-analysis-reports/shipped-packages.json': JSON.stringify({ packages: ['@vue/runtime-dom@3.5.43', '@vue/shared@3.5.43'], external: [] }),
                'README.md': buildReadme('DEPENDENCY_LICENSES')
            });
            licenseChecker.licenses = { '@vue/runtime-dom@3.5.43': { licenses: 'MIT' }, '@vue/shared@3.5.43': { licenses: 'MIT' } };
            // npm lists the development tool first; the production dependency is still walked first.
            licenseTree.tree = {
                dependencies: {
                    '@vitejs/plugin-vue': { version: '6.0.1', dependencies: { '@vue/shared': { version: '3.5.43' } } },
                    vue: {
                        version: '3.5.43',
                        dependencies: {
                            '@vue/compiler-dom': { version: '3.5.43', dependencies: { '@vue/shared': { version: '3.5.43' } } },
                            '@vue/runtime-dom': { version: '3.5.43', dependencies: { '@vue/shared': { version: '3.5.43' } } }
                        }
                    }
                }
            };
            stubRegistry({});

            await documentDependencies();

            const readme = await project.readFile('README.md');
            expect(readme).toContain('### Dependency Tree');
            expect(readme).toContain(
                [
                    '- **[@vue/shared](https://www.npmjs.com/package/@vue/shared)** 3.5.43',
                    '- **[@vue/runtime-dom](https://www.npmjs.com/package/@vue/runtime-dom)** 3.5.43',
                    '  - **[@vue/shared](https://www.npmjs.com/package/@vue/shared)** 3.5.43\n'
                ].join('\n')
            );
            expect(readme).not.toContain('- **vue**');
            expect(readme).not.toContain('plugin-vue');
            expect(readme).not.toContain('compiler-dom');
        });

        it('adds the Rust crates compiled into the WebAssembly to the table and the tree, under the project’s own crate', async () => {
            await project.writeFiles({
                'package.json': JSON.stringify({ name: 'dpuse-app' }),
                'package-lock.json': lockFile,
                'bundle-analysis-reports/shipped-packages.json': JSON.stringify({ packages: ['vue-router@5.3.1'], external: [] }),
                'README.md': buildReadme('DEPENDENCY_LICENSES')
            });
            licenseChecker.licenses = { 'vue-router@5.3.1': { licenses: 'MIT' } };
            licenseTree.tree = {};
            rustCrates.result = {
                crates: [
                    {
                        name: 'csv-core',
                        version: '0.1.13',
                        licenseExpression: 'Unlicense/MIT',
                        repository: 'https://github.com/BurntSushi/rust-csv',
                        licenseFiles: [
                            { label: 'LICENSE-MIT', path: 'downloads/csv-core@0.1.13-LICENSE-MIT' },
                            { label: 'UNLICENSE', path: 'downloads/csv-core@0.1.13-UNLICENSE' }
                        ],
                        publishedDate: '2026-09-01T00:00:00Z',
                        latestVersion: '0.1.13',
                        latestPublishedDate: ''
                    }
                ],
                treeItems: [
                    { name: 'example-core', version: '0.1.0', depth: 0, isOwn: true },
                    { name: 'csv-core', version: '0.1.13', depth: 1, isOwn: false }
                ]
            };
            stubRegistry({});

            await documentDependencies('MIT');
            rustCrates.result = null;

            const readme = await project.readFile('README.md');
            expect(readme).toContain('It also lists every Rust crate compiled into its WebAssembly');
            expect(readme).toContain('|Type|Dependency|Version|License(s)|Document|');
            const javaScriptRow = readme.indexOf('|JavaScript|[vue-router](https://www.npmjs.com/package/vue-router)|5.3.1|MIT|');
            const rustRow = readme.indexOf(
                '|Rust|[csv-core](https://github.com/BurntSushi/rust-csv)|0.1.13|Unlicense/MIT|[LICENSE-MIT](licenses/downloads/csv-core@0.1.13-LICENSE-MIT) [UNLICENSE](licenses/downloads/csv-core@0.1.13-UNLICENSE)|'
            );
            expect(javaScriptRow).toBeGreaterThan(-1);
            expect(rustRow).toBeGreaterThan(javaScriptRow); // The JavaScript packages come first, although 'csv-core' sorts before 'vue-router'.
            expect(readme).toContain('#### JavaScript\n\nNone.'); // This test's npm tree is empty.
            expect(readme).toContain(
                "#### Rust\n\n- **example-core** 0.1.0 — this project's Rust code, compiled into its WebAssembly\n  - **[csv-core](https://github.com/BurntSushi/rust-csv)** 0.1.13 — this month: 2026-09-01"
            );
        });

        it('includes a package the build leaves to be installed by name, with what that package brings', async () => {
            await project.writeFiles({
                'package.json': JSON.stringify({ name: 'dpuse-app' }),
                'package-lock.json': lockFile,
                'bundle-analysis-reports/shipped-packages.json': JSON.stringify({ packages: [], external: ['vue-router'] }),
                'README.md': buildReadme('DEPENDENCY_LICENSES')
            });
            stubRegistry({});

            await documentDependencies();

            expect(licenseChecker.options.excludePackages).toBe('dpuse-app;@lucide/vue@1.49.0;vite@8.3.2');
        });

        it('warns of a recorded package that is not installed, as its licence cannot be checked', async () => {
            await project.writeFiles({
                'package.json': JSON.stringify({ name: 'dpuse-app' }),
                'package-lock.json': lockFile,
                'bundle-analysis-reports/shipped-packages.json': JSON.stringify({ packages: ['vue-router@5.3.1', 'gone@1.0.0'], external: [] }),
                'README.md': buildReadme('DEPENDENCY_LICENSES')
            });
            stubRegistry({});

            await documentDependencies();

            expect(console.warn).toHaveBeenCalledWith('⚠️   Not installed, so not checked; rebuild to refresh the record: gone@1.0.0');
        });
    });

    it('says the table comes from declared dependencies when the project has no build record', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ name: '@dpuse/dpuse-shared' }), 'README.md': buildReadme('DEPENDENCY_LICENSES') });
        stubRegistry({});

        await documentDependencies();

        expect(licenseChecker.options.production).toBe(true);
        expect(await project.readFile('README.md')).toContain('This project has no build record, so the list is taken from its declared dependencies.');
    });

    it('lists each production dependency with its licence, and flags outdated and ageing packages in the tree', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ name: '@dpuse/dpuse-shared' }), 'README.md': buildReadme('DEPENDENCY_LICENSES') });
        licenseChecker.licenses = {
            'valibot@1.5.0': { licenses: 'MIT', repository: 'https://github.com/open-circle/valibot', licenseFile: 'downloads/valibot@1.5.0-LICENSE.txt' },
            '@scope/current@2.0.0': { licenses: 'Apache-2.0', licenseFile: 'downloads/@scope/current@2.0.0-LICENSE.txt' },
            'old@1.0.0': { licenses: 'BSD-3-Clause', repository: 'https://github.com/example/old' },
            'lastmonth@1.0.0': { licenses: 'MIT' },
            'unreachable@1.0.0': { licenses: 'MIT' },
            'broken@1.0.0': { licenses: 'MIT' }
        };
        licenseTree.tree = {
            dependencies: {
                valibot: { version: '1.5.0' },
                '@scope/current': { version: '2.0.0', dependencies: { old: { version: '1.0.0' }, untracked: { version: '0.1.0' } } },
                lastmonth: { version: '1.0.0' },
                unreachable: { version: '1.0.0' },
                broken: { version: '1.0.0' }
            }
        };
        stubRegistry({
            valibot: { latest: '1.6.0', time: { '1.5.0': '2026-06-01T00:00:00Z', '1.6.0': '2026-09-02T00:00:00Z' } },
            '@scope/current': { latest: '2.0.0', time: { '2.0.0': '2026-09-01T00:00:00Z' } },
            old: { latest: '1.0.0', time: { '1.0.0': '2025-01-10T00:00:00Z' } },
            lastmonth: { latest: '1.0.0', time: { '1.0.0': '2026-08-10T00:00:00Z' } },
            unreachable: 'reject',
            broken: 'fail'
        });

        await documentDependencies('Apache-2.0;BSD-3-Clause;MIT');

        const readme = await project.readFile('README.md');
        expect(readme).toContain('confirmed to use Apache-2.0, BSD-3-Clause, or MIT');
        expect(readme).toContain('|[valibot](https://github.com/open-circle/valibot)|1.5.0|MIT|[LICENSE](licenses/downloads/valibot@1.5.0-LICENSE.txt)|');
        expect(readme).toContain('|[@scope/current](https://www.npmjs.com/package/@scope/current)|2.0.0|Apache-2.0|');
        expect(readme).toContain('|[old](https://github.com/example/old)|1.0.0|BSD-3-Clause|⚠️  No license file|');

        expect(readme).toContain('- **[valibot](https://github.com/open-circle/valibot)** 1.5.0 — 3 mths ago: 2026-06-01 → latest: 1.6.0 — this month: 2026-09-02 ❗');
        expect(readme).toContain('- **[@scope/current](https://www.npmjs.com/package/@scope/current)** 2.0.0 — this month: 2026-09-01');
        expect(readme).toContain('  - **[old](https://github.com/example/old)** 1.0.0 — 20 mths ago: 2025-01-10 ⚠️');
        expect(readme).toContain('  - **untracked** 0.1.0\n');
        expect(readme).toContain('- **[lastmonth](https://www.npmjs.com/package/lastmonth)** 1.0.0 — 1 mth ago: 2026-08-10');
        // Without registry data there is nothing to add after the version.
        expect(readme).toContain('- **[unreachable](https://www.npmjs.com/package/unreachable)** 1.0.0\n');
        expect(readme).toContain('- **[broken](https://www.npmjs.com/package/broken)** 1.0.0\n');
    });

    it('shows an outdated package without a release date', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ name: '@dpuse/dpuse-shared' }), 'README.md': buildReadme('DEPENDENCY_LICENSES') });
        licenseChecker.licenses = { 'undated@1.0.0': { licenses: 'MIT' } };
        licenseTree.tree = { dependencies: { undated: { version: '1.0.0' } } };
        stubRegistry({ undated: { latest: '2.0.0', time: {} } });

        await documentDependencies('MIT');

        const readme = await project.readFile('README.md');
        expect(readme).toContain('confirmed to use MIT, all of which allow commercial use.');
        expect(readme).toContain('All are used unmodified, so any licence conditions that apply only to modified versions are not triggered.');
        expect(readme).toContain('- **[undated](https://www.npmjs.com/package/undated)** 1.0.0 — → latest: 2.0.0 ❗');
    });

    it('names two allowed licences with "or"', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ name: '@dpuse/dpuse-shared' }), 'README.md': buildReadme('DEPENDENCY_LICENSES') });
        licenseChecker.licenses = {};
        licenseTree.tree = {};
        stubRegistry({});

        await documentDependencies('Apache-2.0;MIT');

        expect(await project.readFile('README.md')).toContain('confirmed to use Apache-2.0 or MIT');
    });

    it('exits when the licence check fails', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ name: '@dpuse/dpuse-shared' }), 'README.md': buildReadme('DEPENDENCY_LICENSES') });
        licenseChecker.error = new Error('GPL found');

        await expect(documentDependencies()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error documenting dependencies', licenseChecker.error);
        licenseChecker.error = undefined;
    });
});

/* eslint-enable security/detect-non-literal-fs-filename -- Tests only name files inside their own temporary folder. */
