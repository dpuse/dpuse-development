// ── External Dependencies & Registrations
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { auditDependencies } from '@/actions/auditDependencies';
import { spawnedCommands } from '../support/projectCommands';
import { collectConsoleOutput, useTemporaryProject } from '../support/temporaryProject';
import { spawnCommand, spawnCommandForOutput } from '@/utilities';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

vi.mock('@/utilities', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    spawnCommand: vi.fn(() => Promise.resolve()),
    spawnCommandForOutput: vi.fn(() => Promise.resolve('{}'))
}));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

useTemporaryProject();

// An 'npm audit --json' report holding the given advisories, each reached through a second package as npm reports it.
function auditReport(...advisories: { id: string; name: string; severity: string }[]): string {
    const vulnerabilities: Record<string, { via: unknown[] }> = {};
    for (const { id, name, severity } of advisories) {
        vulnerabilities[name] = { via: [{ name, severity, title: `${name} flaw`, url: `https://github.com/advisories/${id}` }] };
        vulnerabilities[`${name}-parent`] = { via: [name] };
    }
    return JSON.stringify({ auditReportVersion: 2, vulnerabilities });
}

beforeEach(() => {
    vi.mocked(spawnCommand).mockClear().mockResolvedValue();
    vi.mocked(spawnCommandForOutput).mockClear().mockResolvedValue(auditReport());
    vi.useFakeTimers({ now: new Date('2026-10-03T12:00:00Z'), toFake: ['Date'] });
});

afterEach(() => {
    vi.useRealTimers();
});

describe('auditDependencies', () => {
    it('checks shipped dependencies strictly, then every dependency as JSON', async () => {
        await auditDependencies();

        expect(spawnedCommands()).toEqual(['npm audit --omit=dev']);
        expect(spawnCommandForOutput).toHaveBeenCalledWith(expect.any(String), 'npm', ['audit', '--json']);
        expect(collectConsoleOutput()).toContain('Dependencies audited');
    });

    it('passes moderate advisories and ignored high ones, naming the ignored ones', async () => {
        vi.mocked(spawnCommandForOutput).mockResolvedValue(
            auditReport({ id: 'GHSA-moderate', name: 'slow', severity: 'moderate' }, { id: 'GHSA-ch52-4w7c-c8xp', name: 'http-cache-semantics', severity: 'high' })
        );

        await auditDependencies();

        const output = collectConsoleOutput();
        expect(output).toContain('ℹ️  Ignored GHSA-ch52-4w7c-c8xp');
        expect(output).not.toContain('GHSA-moderate');
        expect(output).toContain('Dependencies audited');
    });

    it('fails on a high or critical advisory that is not ignored, naming it', async () => {
        vi.mocked(spawnCommandForOutput).mockResolvedValue(
            auditReport({ id: 'GHSA-new-high', name: 'leaky', severity: 'high' }, { id: 'GHSA-new-critical', name: 'broken', severity: 'critical' })
        );

        await expect(auditDependencies()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith("❌  high 'leaky': leaky flaw (https://github.com/advisories/GHSA-new-high)");
        expect(console.error).toHaveBeenCalledWith("❌  critical 'broken': broken flaw (https://github.com/advisories/GHSA-new-critical)");
        expect(console.error).toHaveBeenCalledWith('❌  Error auditing dependencies', new Error('2 high or critical vulnerabilities found'));
    });

    it('warns, but still passes, when an ignored advisory is past its review date', async () => {
        vi.setSystemTime(new Date('2027-01-01T12:00:00Z'));
        vi.mocked(spawnCommandForOutput).mockResolvedValue(auditReport({ id: 'GHSA-fx2h-pf6j-xcff', name: 'vite', severity: 'high' }));

        await auditDependencies();

        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('⚠️  Ignored GHSA-fx2h-pf6j-xcff, but its review date 2026-12-31 has passed'));
    });

    it('fails when the audit itself reports an error', async () => {
        vi.mocked(spawnCommandForOutput).mockResolvedValue(JSON.stringify({ error: { summary: 'registry unreachable' } }));

        await expect(auditDependencies()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error auditing dependencies', new Error('registry unreachable'));
    });

    it('fails without the full audit when a shipped dependency is vulnerable', async () => {
        vi.mocked(spawnCommand).mockRejectedValueOnce(new Error('npm exited with code 1'));

        await expect(auditDependencies()).rejects.toThrow('process.exit(1)');
        expect(spawnCommandForOutput).not.toHaveBeenCalled();
    });
});
