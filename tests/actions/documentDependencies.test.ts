/* eslint-disable security/detect-non-literal-fs-filename -- Tests only name files inside their own temporary folder. */

// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { documentDependencies } from '@/actions/documentDependencies';
import { buildReadme, useTemporaryProject } from '../support/temporaryProject';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// The licence checker and 'npm ls' write the two files the README is built from, so the mocks write fixtures instead.
const licenseChecker = vi.hoisted((): { licenses: object; error: Error | undefined } => ({ licenses: {}, error: undefined }));
vi.mock('license-checker-rseidelsohn', () => ({
    init: (_options: unknown, callback: (error: Error | undefined) => void) => {
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

        expect(readme).toContain('- **[valibot](https://github.com/open-circle/valibot)** 1.5.0 — **3 months** ago: 2026-06-01 → **latest**: 1.6.0 — this month: 2026-09-02 ❗');
        expect(readme).toContain('- **[@scope/current](https://www.npmjs.com/package/@scope/current)** 2.0.0 — this month: 2026-09-01');
        expect(readme).toContain('  - **[old](https://github.com/example/old)** 1.0.0 — **20 months** ago: 2025-01-10 ⚠️');
        expect(readme).toContain('  - **untracked** 0.1.0\n');
        expect(readme).toContain('- **[lastmonth](https://www.npmjs.com/package/lastmonth)** 1.0.0 — **1 month** ago: 2026-08-10');
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
        expect(readme).toContain('confirmed to use MIT —');
        expect(readme).toContain('- **[undated](https://www.npmjs.com/package/undated)** 1.0.0 — → **latest**: 2.0.0 ❗');
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
