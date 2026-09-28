// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { spawnCommand } from '@/utilities';
import { spawnedCommands } from '../support/projectCommands';
import { testProject } from '@/actions/testProject';
import { collectConsoleOutput, useTemporaryProject } from '../support/temporaryProject';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Commands are recorded rather than run.
vi.mock('@/utilities', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    spawnCommand: vi.fn(() => Promise.resolve())
}));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

beforeEach(() => {
    vi.mocked(spawnCommand).mockClear().mockResolvedValue();
});

describe('testProject', () => {
    it('runs only the types of test the project has configured', async () => {
        await project.writeFiles({ 'vitest.config.ts': '' });

        await testProject(['unit', 'e2e']);

        expect(spawnedCommands()).toEqual(['vitest run --passWithNoTests']);
        expect(collectConsoleOutput()).toContain('✅ Project tested');
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
