// ── External Dependencies & Registrations
import { run as runNpmCheckUpdates } from 'npm-check-updates';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { checkDependencies } from '@/actions/checkDependencies';
import { formatCode } from '@/actions/formatCode';
import { lintCode } from '@/actions/lintCode';
import { useTemporaryProject } from '../support/temporaryProject';
import { spawnCommand, spawnCommandForOutput } from '@/utilities';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

vi.mock('@/utilities', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    spawnCommand: vi.fn(() => Promise.resolve()),
    spawnCommandForOutput: vi.fn(() => Promise.resolve('{}'))
}));
vi.mock('npm-check-updates', () => ({ run: vi.fn(() => Promise.resolve()) }));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

const originalPlatform = process.platform;

function spawnedCommands(): string[] {
    return vi.mocked(spawnCommand).mock.calls.map(([, command, arguments_]) => `${command} ${arguments_.join(' ')}`);
}

function setPlatform(platform: string): void {
    Object.defineProperty(process, 'platform', { value: platform });
}

beforeEach(() => {
    vi.mocked(spawnCommand).mockClear().mockResolvedValue();
    vi.mocked(spawnCommandForOutput).mockClear().mockResolvedValue('{}');
    vi.mocked(runNpmCheckUpdates).mockClear();
    setPlatform('darwin');
});

afterEach(() => {
    setPlatform(originalPlatform);
});

describe('checkDependencies', () => {
    it('updates dependencies, then moves pinned install-script approvals to the installed versions', async () => {
        await project.writeFiles({
            'package.json': JSON.stringify({ allowScripts: { 'fsevents@2.3.3': true, '@scope/tool@1.0.0': true, esbuild: true, 'blocked@1.0.0': false, 'fsevents@2.3.2': true } }),
            '.ncurc.json': JSON.stringify({ reject: ['typescript'] })
        });

        await checkDependencies();

        expect(runNpmCheckUpdates).toHaveBeenCalledWith(expect.objectContaining({ upgrade: true, install: 'never', reject: ['typescript'] }));
        expect(spawnedCommands()).toEqual([
            'npm outdated',
            'npm install --prefer-online --no-strict-allow-scripts --no-audit --no-fund',
            'npm audit fix --no-strict-allow-scripts --no-fund',
            'npm install-scripts approve fsevents @scope/tool',
            'npm install-scripts prune',
            'npm rebuild fsevents @scope/tool --no-strict-allow-scripts',
            'npm install --strict-allow-scripts --no-audit --no-fund'
        ]);
        expect(spawnCommandForOutput).toHaveBeenCalledWith(expect.any(String), 'npm', ['audit', '--json']);
    });

    it('skips moving pins and rebuilding when nothing is pinned, and pruning away from macOS', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ allowScripts: { esbuild: true } }) });
        setPlatform('linux');

        await checkDependencies();

        expect(spawnedCommands()).toEqual([
            'npm outdated',
            'npm install --prefer-online --no-strict-allow-scripts --no-audit --no-fund',
            'npm audit fix --no-strict-allow-scripts --no-fund',
            'npm install --strict-allow-scripts --no-audit --no-fund'
        ]);
    });

    it('puts back entries prune removes while the lockfile still marks their packages as having install scripts', async () => {
        const lockfile = {
            packages: {
                'node_modules/fsevents': { hasInstallScript: true, version: '2.3.3' },
                'node_modules/vite/node_modules/esbuild': { hasInstallScript: true, version: '0.28.2' },
                'node_modules/unused': { version: '1.0.0' }
            }
        };
        const allowScripts = { 'esbuild@0.28.2': true, 'fsevents@2.3.3': true, 'gone@1.0.0': true, unused: true, workerd: true };
        await project.writeFiles({ 'package-lock.json': JSON.stringify(lockfile), 'package.json': JSON.stringify({ allowScripts, name: 'sample' }) });
        // Stands in for npm 12's prune, which removes 'fsevents' because its installed 'package.json' has no install script.
        vi.mocked(spawnCommand).mockImplementation(async (_label, _command, arguments_) => {
            if (arguments_.join(' ') !== 'install-scripts prune') return;
            await project.writeFiles({ 'package.json': JSON.stringify({ allowScripts: { 'esbuild@0.28.2': true, workerd: true }, name: 'sample' }) });
        });

        await checkDependencies();

        const packageJSON = (await project.readJSON('package.json')) as { allowScripts: Record<string, boolean>; name: string };
        expect(Object.keys(packageJSON.allowScripts)).toEqual(['esbuild@0.28.2', 'fsevents@2.3.3', 'workerd']);
        expect(packageJSON.name).toBe('sample');
    });

    it('leaves package.json alone when prune removes nothing', async () => {
        const packageJSONText = JSON.stringify({ allowScripts: { esbuild: true } });
        await project.writeFiles({ 'package.json': packageJSONText });

        await checkDependencies();

        expect(await project.readFile('package.json')).toBe(packageJSONText);
    });

    it('works without an npm-check-updates config or any approvals', async () => {
        await project.writeFiles({ 'package.json': '{}' });

        await checkDependencies();

        expect(runNpmCheckUpdates).toHaveBeenCalledWith({ interactive: true, upgrade: true, dep: 'dev,prod,peer,optional', install: 'never' });
    });

    it('exits when the npm-check-updates config cannot be read', async () => {
        await project.writeFiles({ 'package.json': '{}', '.ncurc.json': '{ not json' });

        await expect(checkDependencies()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error checking dependencies', expect.any(SyntaxError));
    });
});

describe('single-command actions', () => {
    it.each([['lintCode', lintCode, ['eslint .']]])('%s runs its commands', async (_name, action, commands) => {
        await action();
        expect(spawnedCommands()).toEqual(commands);
    });

    it('formats the root files, and the app, src and tests folders only where they exist', async () => {
        await project.writeFiles({ 'src/index.ts': '' });

        await formatCode();

        expect(spawnedCommands()).toEqual(['prettier --write *.json *.md *.ts src/**']);
    });

    it.each([
        ['formatCode', formatCode],
        ['lintCode', lintCode]
    ])('%s exits when its command fails', async (_name, action) => {
        vi.mocked(spawnCommand).mockRejectedValueOnce(new Error('failed'));
        await expect(action()).rejects.toThrow('process.exit(1)');
    });
});
