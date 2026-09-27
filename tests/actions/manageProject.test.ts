/* eslint-disable security/detect-non-literal-fs-filename -- Tests only name files inside their own temporary folder. */

// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { buildProject, publishProject, releaseProject, syncProjectWithGitHub, testProject } from '@/actions/manageProject';
import { collectConsoleOutput, useTemporaryProject } from '../support/temporaryProject';
import { execCommand, spawnCommand } from '@/utilities';
import { putState, uploadModuleConfigToDO, uploadModuleToR2 } from '@/utilities/cloudflare';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Commands, git and the uploads are recorded rather than run.
vi.mock('@/utilities', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    execCommand: vi.fn(() => Promise.resolve()),
    spawnCommand: vi.fn(() => Promise.resolve())
}));
vi.mock('@/utilities/cloudflare', () => ({
    putState: vi.fn(() => Promise.resolve()),
    uploadModuleConfigToDO: vi.fn(() => Promise.resolve()),
    uploadModuleToR2: vi.fn(() => Promise.resolve())
}));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

const CONNECTOR_SOURCE = 'export default class Connector {\n    listNodes() {}\n    retrieveRecords() {}\n    private helper() {}\n}\n';
const PRESENTER_SOURCE = 'export default class Presenter {\n    list() {}\n    render() {}\n}\n';

async function readFixture(name: string): Promise<string> {
    return await fs.readFile(new URL(`../fixtures/${name}`, import.meta.url), 'utf-8');
}

function spawnedCommands(): string[] {
    return vi.mocked(spawnCommand).mock.calls.map(([, command, arguments_]) => `${command} ${arguments_.join(' ')}`);
}

function executedCommands(): string[] {
    return vi.mocked(execCommand).mock.calls.map(([, command, arguments_]) => `${command} ${arguments_.join(' ')}`);
}

beforeEach(() => {
    vi.mocked(execCommand).mockClear();
    vi.mocked(spawnCommand).mockClear().mockResolvedValue();
    vi.mocked(putState).mockClear();
    vi.mocked(uploadModuleConfigToDO).mockClear();
    vi.mocked(uploadModuleToR2).mockClear();
});

describe('buildProject', () => {
    it('bundles the project with Vite', async () => {
        await buildProject();
        expect(spawnedCommands()).toEqual(['vite build']);
        expect(collectConsoleOutput()).toContain("2️⃣  'API_REFERENCE.md' NOT required by this project");
    });

    it('updates the API reference where the project keeps one', async () => {
        await project.writeFiles({
            'API_REFERENCE.md': 'Out of date',
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-example', exports: { '.': { types: './dist/types/src/index.d.ts' } } }),
            'src/index.ts': 'export function run(): void {}\n'
        });

        await buildProject();

        expect(await project.readFile('API_REFERENCE.md')).toContain('## @dpuse/dpuse-example\n\n### Functions\n\n- `run()`');
    });

    it('exits when the bundle fails', async () => {
        vi.mocked(spawnCommand).mockRejectedValueOnce(new Error('vite failed'));
        await expect(buildProject()).rejects.toThrow('process.exit(1)');
    });
});

describe('testProject', () => {
    it('runs only the types of test the project has configured', async () => {
        await project.writeFiles({ 'vitest.config.ts': '' });

        await testProject(['unit', 'e2e']);

        expect(spawnedCommands()).toEqual(['vitest run --passWithNoTests']);
        expect(collectConsoleOutput()).toContain('✅  Project tested');
    });

    it('runs the unit tests before the end-to-end tests, measuring coverage for the unit tests only', async () => {
        await project.writeFiles({ 'vitest.config.ts': '', 'playwright.config.ts': '' });

        await testProject(['e2e', 'unit'], true);

        expect(spawnedCommands()).toEqual(['vitest run --passWithNoTests --coverage', 'playwright test --pass-with-no-tests']);
    });

    it('warns when no requested type of test is configured', async () => {
        await project.writeFiles({ 'playwright.config.ts': '' });

        await testProject();

        expect(spawnedCommands()).toEqual([]);
        expect(console.warn).toHaveBeenCalledWith('\n⚠️  No tests configured for this project.\n');
    });

    it('exits when the tests fail', async () => {
        await project.writeFiles({ 'vitest.config.ts': '' });
        vi.mocked(spawnCommand).mockRejectedValueOnce(new Error('tests failed'));

        await expect(testProject()).rejects.toThrow('process.exit(1)');
    });
});

describe('syncProjectWithGitHub', () => {
    it('bumps the version, updates the config, then commits and pushes', async () => {
        await project.writeFiles({
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-shared', version: '0.3.9' }),
            'config.json': JSON.stringify({ id: 'dpuse-shared', version: '0.3.9' }),
            'logo.svg': '<svg>light</svg>'
        });

        await syncProjectWithGitHub();

        const packageJSON = await project.readJSON('package.json');
        expect(packageJSON['version']).toBe('0.3.10');
        expect(await project.readJSON('config.json')).toEqual({ id: 'dpuse-shared', version: '0.3.10', icon: '<svg>light</svg>', iconDark: null });
        expect(executedCommands()).toEqual(['git add .', 'git commit -m v0.3.10', 'git push origin main:main']);
    });

    it('starts the version at 0.0.001 when there is none', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ name: '@dpuse/dpuse-shared' }), 'config.json': JSON.stringify({ id: 'dpuse-shared' }) });

        await syncProjectWithGitHub();

        const packageJSON = await project.readJSON('package.json');
        expect(packageJSON['version']).toBe('0.0.001');
        expect(executedCommands()).toContain('git commit -m v0.0.001');
    });

    it('records the actions and usage a connector implements', async () => {
        await project.writeFiles({
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-connector-example', version: '0.0.1' }),
            'config.json': await readFixture('connectorConfig.json'),
            'src/index.ts': CONNECTOR_SOURCE
        });

        await syncProjectWithGitHub();

        const config = await project.readJSON('config.json');
        expect(config).toMatchObject({ id: 'dpuse-connector-example', version: '0.0.2', actionNames: ['listNodes', 'retrieveRecords'], usageId: 'source' });
        expect(collectConsoleOutput()).toContain("ℹ️  Supports 'source' usage.");
    });

    it('warns when a connector implements no actions', async () => {
        await project.writeFiles({
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-connector-example', version: '0.0.1' }),
            'config.json': await readFixture('connectorConfig.json'),
            'src/index.ts': 'export default class Connector {}\n'
        });

        await syncProjectWithGitHub();

        expect(console.warn).toHaveBeenCalledWith('⚠️   Implements no operations');
        expect(console.warn).toHaveBeenCalledWith('⚠️   No usage identified');
    });

    it('records the actions a presenter implements', async () => {
        await project.writeFiles({
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-presenter-example', version: '0.0.1' }),
            'config.json': await readFixture('presenterConfig.json'),
            'src/index.ts': PRESENTER_SOURCE
        });

        await syncProjectWithGitHub();

        const config = await project.readJSON('config.json');
        expect(config).toMatchObject({ version: '0.0.2', actionNames: ['list', 'render'] });
        expect(config).not.toHaveProperty('usageId');
    });

    it.each([
        ['connector', 'dpuse-connector-example'],
        ['presenter', 'dpuse-presenter-example']
    ])('exits when the %s configuration is invalid', async (_type, id) => {
        await project.writeFiles({ 'package.json': JSON.stringify({ version: '0.0.1' }), 'config.json': JSON.stringify({ id }), 'src/index.ts': '' });

        await expect(syncProjectWithGitHub()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Configuration is invalid:');
        expect(executedCommands()).toEqual([]);
    });
});

describe('releaseProject', () => {
    it('builds, pushes and creates a GitHub release for an npm package', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ name: '@dpuse/dpuse-shared', version: '1.2.3' }), 'config.json': JSON.stringify({ id: 'dpuse-shared' }) });

        await releaseProject();

        expect(spawnedCommands()).toEqual(['vite build', 'gh release create v1.2.4 --target main --generate-notes --latest']);
        expect(executedCommands()).toEqual(['git add .', 'git commit -m v1.2.4', 'git push origin main:main']);
        expect(uploadModuleToR2).not.toHaveBeenCalled();
        expect(collectConsoleOutput()).not.toContain('8️⃣  Publishing NOT required');
    });

    it('uploads a connector to its folder in the engine bucket, then registers its config', async () => {
        await project.writeFiles({
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-connector-example', version: '0.0.1' }),
            'config.json': await readFixture('connectorConfig.json'),
            'src/index.ts': CONNECTOR_SOURCE
        });

        await releaseProject();

        expect(uploadModuleToR2).toHaveBeenCalledWith(expect.objectContaining({ version: '0.0.2' }), 'dpuse-engine-eu/connectors/example');
        expect(uploadModuleConfigToDO).toHaveBeenCalledWith(expect.objectContaining({ id: 'dpuse-connector-example', actionNames: ['listNodes', 'retrieveRecords'] }));
        expect(vi.mocked(uploadModuleToR2).mock.invocationCallOrder[0]).toBeLessThan(vi.mocked(uploadModuleConfigToDO).mock.invocationCallOrder[0] ?? 0);
        expect(collectConsoleOutput()).toContain("8️⃣  Publishing NOT required for package with type identifier of 'connector'.");
    });

    it('registers a presenter', async () => {
        await project.writeFiles({
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-presenter-example', version: '0.0.1' }),
            'config.json': await readFixture('presenterConfig.json'),
            'src/index.ts': PRESENTER_SOURCE
        });

        await releaseProject();

        expect(uploadModuleToR2).toHaveBeenCalledWith(expect.anything(), 'dpuse-engine-eu/presenters/example');
    });

    it('exits when the push fails', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ version: '1.0.0' }), 'config.json': JSON.stringify({ id: 'dpuse-shared' }) });
        vi.mocked(execCommand).mockRejectedValueOnce(new Error('rejected'));

        await expect(releaseProject()).rejects.toThrow('process.exit(1)');
    });
});

describe('publishProject', () => {
    it('stores the app configuration', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ version: '1.0.0' }), 'config.json': JSON.stringify({ id: 'dpuse-app' }) });

        await publishProject();

        expect(putState).toHaveBeenCalledOnce();
        expect(collectConsoleOutput()).toContain("Project version '1.0.0' published.");
    });

    it('uploads the engine to its own folder', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ version: '2.0.0' }), 'config.json': JSON.stringify({ id: 'dpuse-engine' }) });

        await publishProject();

        expect(uploadModuleToR2).toHaveBeenCalledWith(expect.objectContaining({ version: '2.0.0' }), 'dpuse-engine-eu/engine');
        expect(uploadModuleConfigToDO).toHaveBeenCalledWith({ id: 'dpuse-engine' });
    });

    it('registers nothing for a module that is not uploaded', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ version: '1.0.0' }), 'config.json': JSON.stringify({ id: 'dpuse-shared' }) });

        await publishProject();

        expect(collectConsoleOutput()).toContain('1️⃣  Registration NOT required');
        expect(uploadModuleToR2).not.toHaveBeenCalled();
        expect(putState).not.toHaveBeenCalled();
    });

    it('exits when the upload fails', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ version: '1.0.0' }), 'config.json': JSON.stringify({ id: 'dpuse-app' }) });
        vi.mocked(putState).mockRejectedValueOnce(new Error('offline'));

        await expect(publishProject()).rejects.toThrow('process.exit(1)');
    });
});

/* eslint-enable security/detect-non-literal-fs-filename -- Tests only name files inside their own temporary folder. */
