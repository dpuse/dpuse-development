// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { buildProject } from '@/actions/buildProject';
import { spawnCommand } from '@/utilities';
import { spawnedCommands } from '../support/projectCommands';
import { collectConsoleOutput, useTemporaryProject } from '../support/temporaryProject';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Commands are recorded rather than run.
vi.mock('@/utilities', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    execCommand: vi.fn(() => Promise.resolve()),
    spawnCommand: vi.fn(() => Promise.resolve())
}));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

useTemporaryProject(); // Runs each test in its own folder, with its console output captured.

beforeEach(() => {
    vi.mocked(spawnCommand).mockClear().mockResolvedValue();
});

describe('buildProject', () => {
    it('bundles the project with Vite', async () => {
        await buildProject();
        expect(spawnedCommands()).toEqual(['vite build']);
        expect(collectConsoleOutput()).toContain('✅ Project built');
    });

    it('exits when the bundle fails', async () => {
        vi.mocked(spawnCommand).mockRejectedValueOnce(new Error('vite failed'));
        await expect(buildProject()).rejects.toThrow('process.exit(1)');
    });
});
