// ── External Dependencies & Registrations
import { describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { checkConfigFiles } from '@/actions/checkConfigFiles';
import { checkDependencies } from '@/actions/checkDependencies';
import { checkProject } from '@/actions/checkProject';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Each check has its own tests, so here they only record that they ran, and in what order.
const calls = vi.hoisted<string[]>(() => []);
vi.mock('@/actions/checkConfigFiles', () => ({
    checkConfigFiles: vi.fn(() => {
        calls.push('configFiles');
    })
}));
vi.mock('@/actions/checkDependencies', () => ({
    checkDependencies: vi.fn(() => {
        calls.push('dependencies');
    })
}));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

describe('checkProject', () => {
    it('checks the configuration files, then the dependencies', async () => {
        await checkProject();

        expect(calls).toEqual(['configFiles', 'dependencies']);
        expect(checkConfigFiles).toHaveBeenCalledOnce();
        expect(checkDependencies).toHaveBeenCalledOnce();
    });
});
