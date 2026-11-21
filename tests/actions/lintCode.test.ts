// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { lintCode } from '@/actions/lintCode';
import { spawnCommand } from '@/utilities';
import { spawnedCommands } from '../support/projectCommands';
import { collectConsoleOutput, useTemporaryProject } from '../support/temporaryProject';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Commands are recorded rather than run.
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

describe('lintCode', () => {
    it('lints, then type-checks the whole project with tsc', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ devDependencies: { typescript: '^6.0.3' } }) });

        await lintCode();

        expect(spawnedCommands()).toEqual(['eslint .', 'tsc --noEmit -p tsconfig.json']);
        expect(collectConsoleOutput()).toContain('✅ Code linted and type-checked');
    });

    it('type-checks a Vue project with vue-tsc', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ devDependencies: { 'vue-tsc': '^3.0.0' } }) });

        await lintCode();

        expect(spawnedCommands()).toEqual(['eslint .', 'vue-tsc --build']);
    });

    it('exits without type-checking when linting fails', async () => {
        await project.writeFiles({ 'package.json': '{}' });
        vi.mocked(spawnCommand).mockRejectedValueOnce(new Error('lint failed'));

        await expect(lintCode()).rejects.toThrow('process.exit(1)');
        expect(spawnedCommands()).toEqual(['eslint .']);
    });

    it('exits when the type check fails', async () => {
        await project.writeFiles({ 'package.json': '{}' });
        vi.mocked(spawnCommand).mockResolvedValueOnce().mockRejectedValueOnce(new Error('type errors'));

        await expect(lintCode()).rejects.toThrow('process.exit(1)');
    });
});
