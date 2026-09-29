// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { documentProject } from '@/actions/documentProject';
import { releaseProject } from '@/actions/releaseProject';
import { collectConsoleOutput, useTemporaryProject } from '../support/temporaryProject';
import { CONNECTOR_SOURCE, executedCommands, PRESENTER_SOURCE, readFixture, spawnedCommands } from '../support/projectCommands';
import { execCommand, spawnCommand } from '@/utilities';
import { uploadModuleConfigToDO, uploadModuleToR2 } from '@/utilities/cloudflare';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Commands, git and the uploads are recorded rather than run.
vi.mock('@/utilities', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    execCommand: vi.fn(() => Promise.resolve()),
    spawnCommand: vi.fn(() => Promise.resolve())
}));
// The README has its own tests, so here it is only recorded.
vi.mock('@/actions/documentProject', () => ({ documentProject: vi.fn(() => Promise.resolve()) }));
vi.mock('@/utilities/cloudflare', () => ({
    putState: vi.fn(() => Promise.resolve()),
    uploadModuleConfigToDO: vi.fn(() => Promise.resolve()),
    uploadModuleToR2: vi.fn(() => Promise.resolve())
}));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

beforeEach(() => {
    vi.mocked(documentProject).mockClear();
    vi.mocked(execCommand).mockClear();
    vi.mocked(spawnCommand).mockClear().mockResolvedValue();
    vi.mocked(uploadModuleConfigToDO).mockClear();
    vi.mocked(uploadModuleToR2).mockClear();
});

describe('releaseProject', () => {
    it('builds, pushes and creates a GitHub release for an npm package', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ name: '@dpuse/dpuse-shared', version: '1.2.3' }), 'config.json': JSON.stringify({ id: 'dpuse-shared' }) });

        await releaseProject();

        expect(spawnedCommands()).toEqual(['vite build', 'gh release create v1.2.4 --target main --generate-notes --latest']);
        expect(executedCommands()).toEqual(['git add .', 'git commit -m v1.2.4', 'git push origin main:main']);
        expect(uploadModuleToR2).not.toHaveBeenCalled();
        expect(collectConsoleOutput()).not.toContain('9️⃣  Publishing NOT required');
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
        expect(collectConsoleOutput()).toContain("9️⃣  Publishing NOT required for package with type identifier of 'connector'.");
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

    it('regenerates the README after the build and before staging, with the options it is given', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ name: '@dpuse/dpuse-shared', version: '1.2.3' }), 'config.json': JSON.stringify({ id: 'dpuse-shared' }) });

        await releaseProject('Apache-2.0;MIT', true);

        const documentOrder = vi.mocked(documentProject).mock.invocationCallOrder[0] ?? 0;
        expect(documentProject).toHaveBeenCalledWith('Apache-2.0;MIT', true);
        expect(vi.mocked(spawnCommand).mock.invocationCallOrder[0]).toBeLessThan(documentOrder);
        expect(documentOrder).toBeLessThan(vi.mocked(execCommand).mock.invocationCallOrder[0] ?? 0);
    });

    it('exits when the push fails', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ version: '1.0.0' }), 'config.json': JSON.stringify({ id: 'dpuse-shared' }) });
        vi.mocked(execCommand).mockRejectedValueOnce(new Error('rejected'));

        await expect(releaseProject()).rejects.toThrow('process.exit(1)');
    });
});
