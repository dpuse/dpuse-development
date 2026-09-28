// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { publishProject } from '@/actions/publishProject';
import { collectConsoleOutput, useTemporaryProject } from '../support/temporaryProject';
import { putState, uploadModuleConfigToDO, uploadModuleToR2 } from '@/utilities/cloudflare';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// The uploads are recorded rather than run.
vi.mock('@/utilities/cloudflare', () => ({
    putState: vi.fn(() => Promise.resolve()),
    uploadModuleConfigToDO: vi.fn(() => Promise.resolve()),
    uploadModuleToR2: vi.fn(() => Promise.resolve())
}));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

beforeEach(() => {
    vi.mocked(putState).mockClear();
    vi.mocked(uploadModuleConfigToDO).mockClear();
    vi.mocked(uploadModuleToR2).mockClear();
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
