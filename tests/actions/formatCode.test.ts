// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { formatCode } from '@/actions/formatCode';
import { spawnCommand } from '@/utilities';
import { spawnedCommands } from '../support/projectCommands';
import { useTemporaryProject } from '../support/temporaryProject';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Prettier is recorded rather than run.
vi.mock('@/utilities', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    spawnCommand: vi.fn(() => Promise.resolve())
}));

// ── State ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
    vi.mocked(spawnCommand).mockClear().mockResolvedValue();
});

describe('formatCode', () => {
    it('formats the root files, and each source folder only where it exists', async () => {
        await project.writeFiles({ 'src/index.ts': '' });

        await formatCode();

        expect(spawnedCommands()).toEqual(['prettier --write --no-error-on-unmatched-pattern *.js *.json *.md *.ts src/**']);
    });

    it('formats the app, end-to-end test, script, source and test folders', async () => {
        await project.writeFiles({ 'app/main.ts': '', 'e2e/home.test.ts': '', 'scripts/build.ts': '', 'src/index.ts': '', 'tests/index.test.ts': '' });

        await formatCode();

        expect(spawnedCommands()).toEqual(['prettier --write --no-error-on-unmatched-pattern *.js *.json *.md *.ts app/** e2e/** scripts/** src/** tests/**']);
    });

    it('exits when formatting fails', async () => {
        vi.mocked(spawnCommand).mockRejectedValueOnce(new Error('failed'));

        await expect(formatCode()).rejects.toThrow('process.exit(1)');
    });
});
