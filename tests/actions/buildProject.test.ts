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

const project = useTemporaryProject();

beforeEach(() => {
    vi.mocked(spawnCommand).mockClear().mockResolvedValue();
});

describe('buildProject', () => {
    it('bundles the project with Vite', async () => {
        await buildProject();
        expect(spawnedCommands()).toEqual(['vite build']);
        expect(collectConsoleOutput()).toContain("2️⃣  'API_REFERENCE.md' NOT required by this project");
    });

    it('updates the API reference where the project keeps one', async () => {
        await project.writeFiles({
            'API_REFERENCE.md': 'Out of date',
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-example', exports: { '.': { types: './dist/types/src/index.d.ts' } } }),
            'src/index.ts': 'export function run(): void {}\n'
        });

        await buildProject();

        expect(await project.readFile('API_REFERENCE.md')).toContain('## @dpuse/dpuse-example\n\n### Functions\n\n- **`run`**`()`');
    });

    it('exits when the bundle fails', async () => {
        vi.mocked(spawnCommand).mockRejectedValueOnce(new Error('vite failed'));
        await expect(buildProject()).rejects.toThrow('process.exit(1)');
    });
});
