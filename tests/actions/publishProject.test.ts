// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { publishProject } from '@/actions/publishProject';
import { spawnCommand } from '@/utilities';
import { spawnedCommands } from '../support/projectCommands';
import { collectConsoleOutput, useTemporaryProject } from '../support/temporaryProject';
import { putState, uploadModuleConfigToDO, uploadModuleToR2, uploadSampleDataToR2 } from '@/utilities/cloudflare';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Commands and uploads are recorded rather than run.
vi.mock('@/utilities', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    spawnCommand: vi.fn(() => Promise.resolve())
}));
vi.mock('@/utilities/cloudflare', () => ({
    putState: vi.fn(() => Promise.resolve()),
    uploadModuleConfigToDO: vi.fn(() => Promise.resolve()),
    uploadModuleToR2: vi.fn(() => Promise.resolve()),
    uploadSampleDataToR2: vi.fn(() => Promise.resolve())
}));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

beforeEach(() => {
    vi.mocked(spawnCommand).mockClear().mockResolvedValue();
    vi.mocked(putState).mockClear();
    vi.mocked(uploadModuleConfigToDO).mockClear();
    vi.mocked(uploadModuleToR2).mockClear();
    vi.mocked(uploadSampleDataToR2).mockClear();
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

    it('publishes a module that is not uploaded to npm only', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ version: '1.0.0' }), 'config.json': JSON.stringify({ id: 'dpuse-shared' }) });

        await publishProject();

        expect(spawnedCommands()).toEqual(['npm publish --provenance']);
        expect(collectConsoleOutput()).toContain('2️⃣  Registration NOT required');
        expect(uploadModuleToR2).not.toHaveBeenCalled();
        expect(putState).not.toHaveBeenCalled();
    });

    it('publishes a tool to npm, then uploads it to DPUse', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ version: '1.0.0' }), 'config.json': JSON.stringify({ id: 'dpuse-tool-file-previewer' }) });

        await publishProject();

        expect(spawnedCommands()).toEqual(['npm publish --provenance']);
        expect(uploadModuleToR2).toHaveBeenCalledWith(expect.objectContaining({ version: '1.0.0' }), 'dpuse-engine-eu/tools/file-previewer');
        expect(vi.mocked(spawnCommand).mock.invocationCallOrder[0]).toBeLessThan(vi.mocked(uploadModuleToR2).mock.invocationCallOrder[0] ?? 0);
    });

    it('uploads a connector to DPUse without publishing it to npm', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ version: '1.0.0' }), 'config.json': JSON.stringify({ id: 'dpuse-connector-dropbox' }) });

        await publishProject();

        expect(spawnedCommands()).toEqual([]);
        expect(collectConsoleOutput()).toContain('1️⃣  Publishing to npm NOT required');
        expect(uploadModuleToR2).toHaveBeenCalledWith(expect.objectContaining({ version: '1.0.0' }), 'dpuse-engine-eu/connectors/dropbox');
    });

    it('deploys the knowledge base with its own deploy script', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ version: '1.0.0' }), 'config.json': JSON.stringify({ id: 'dpuse-kb' }) });

        await publishProject();

        expect(spawnedCommands()).toEqual(['npm run deploy']);
        expect(collectConsoleOutput()).toContain('2️⃣  Registration NOT required');
        expect(uploadModuleToR2).not.toHaveBeenCalled();
    });

    it('uploads the sample data to R2, with nothing to publish to npm or register', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ version: '1.0.0' }), 'config.json': JSON.stringify({ id: 'dpuse-resources' }) });

        await publishProject();

        expect(uploadSampleDataToR2).toHaveBeenCalledWith('public');
        expect(spawnedCommands()).toEqual([]);
        expect(collectConsoleOutput()).toContain('3️⃣  Upload sample data');
    });

    it('does not upload a tool whose npm publish fails', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ version: '1.0.0' }), 'config.json': JSON.stringify({ id: 'dpuse-tool-file-previewer' }) });
        vi.mocked(spawnCommand).mockRejectedValueOnce(new Error('npm failed'));

        await expect(publishProject()).rejects.toThrow('process.exit(1)');
        expect(uploadModuleToR2).not.toHaveBeenCalled();
    });

    it('exits when the upload fails', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ version: '1.0.0' }), 'config.json': JSON.stringify({ id: 'dpuse-app' }) });
        vi.mocked(putState).mockRejectedValueOnce(new Error('offline'));

        await expect(publishProject()).rejects.toThrow('process.exit(1)');
    });
});
