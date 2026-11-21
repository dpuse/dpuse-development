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
    it('formats the root files, and the app, src and tests folders only where they exist', async () => {
        await project.writeFiles({ 'src/index.ts': '' });

        await formatCode();

        expect(spawnedCommands()).toEqual(['prettier --write *.json *.md *.ts src/**']);
    });

    it('exits when formatting fails', async () => {
        vi.mocked(spawnCommand).mockRejectedValueOnce(new Error('failed'));

        await expect(formatCode()).rejects.toThrow('process.exit(1)');
    });
});
