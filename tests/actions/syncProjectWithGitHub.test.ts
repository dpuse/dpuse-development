// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { execCommand } from '@/utilities';
import { syncProjectWithGitHub } from '@/actions/syncProjectWithGitHub';
import { collectConsoleOutput, useTemporaryProject } from '../support/temporaryProject';
import { CONNECTOR_SOURCE, executedCommands, PRESENTER_SOURCE, readFixture } from '../support/projectCommands';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// git commands are recorded rather than run.
vi.mock('@/utilities', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    execCommand: vi.fn(() => Promise.resolve())
}));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

beforeEach(() => {
    vi.mocked(execCommand).mockClear();
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

    it("writes the config's keys as 'id', 'label' and 'description', then the rest alphabetically", async () => {
        await project.writeFiles({
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-shared', version: '0.3.9' }),
            'config.json': JSON.stringify({ version: '0.3.9', typeId: 'shared', description: { en: 'Text.' }, iconDark: null, id: 'dpuse-shared', label: { en: 'Shared' } })
        });

        await syncProjectWithGitHub();

        expect(Object.keys(await project.readJSON('config.json'))).toEqual(['id', 'label', 'description', 'icon', 'iconDark', 'typeId', 'version']);
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
