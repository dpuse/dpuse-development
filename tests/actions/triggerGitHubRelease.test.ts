// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { spawnCommand } from '@/utilities';
import { spawnedCommands } from '../support/projectCommands';
import { triggerGitHubRelease } from '@/actions/triggerGitHubRelease';
import { useTemporaryProject } from '../support/temporaryProject';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// 'gh' is recorded rather than run.
vi.mock('@/utilities', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    spawnCommand: vi.fn(() => Promise.resolve())
}));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

beforeEach(() => {
    vi.mocked(spawnCommand).mockClear().mockResolvedValue();
});

describe('triggerGitHubRelease', () => {
    it('creates a release tagged with the current version', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ name: '@dpuse/dpuse-shared', version: '1.2.3' }) });

        await triggerGitHubRelease();

        expect(spawnedCommands()).toEqual(['gh release create v1.2.3 --target main --generate-notes --latest']);
    });

    it('exits when the release cannot be created', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ version: '1.2.3' }) });
        vi.mocked(spawnCommand).mockRejectedValueOnce(new Error('gh exited with code 1'));

        await expect(triggerGitHubRelease()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error triggering GitHub release', expect.any(Error));
    });
});
