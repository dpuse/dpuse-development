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

const project = useTemporaryProject(); // Runs each test in its own folder, with its console output captured.

beforeEach(() => {
    vi.mocked(spawnCommand).mockClear().mockResolvedValue();
});

describe('buildProject', () => {
    it('bundles the project with Vite', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ scripts: { build: 'vite build' } }) });
        await buildProject();
        expect(spawnedCommands()).toEqual(['vite build']);
        expect(collectConsoleOutput()).toContain('✅ Project built');
    });

    it("builds the WebAssembly first where the project has a 'build:wasm' script", async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ scripts: { 'build:wasm': 'wasm-pack build rust/example --target web --release' } }) });
        await buildProject();
        expect(spawnedCommands()).toEqual(['npm run build:wasm', 'vite build']);
    });

    it('exits when the bundle fails', async () => {
        await project.writeFiles({ 'package.json': '{}' });
        vi.mocked(spawnCommand).mockRejectedValueOnce(new Error('vite failed'));
        await expect(buildProject()).rejects.toThrow('process.exit(1)');
    });
});
