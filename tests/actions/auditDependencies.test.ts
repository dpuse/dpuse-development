// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { spawnedCommands } from '../support/projectCommands';
import { auditDependencies, reportIgnoredAdvisories } from '@/actions/auditDependencies';
import { collectConsoleOutput, useTemporaryProject } from '../support/temporaryProject';
import { spawnCommand, spawnCommandForOutput } from '@/utilities';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

vi.mock('@/utilities', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    spawnCommand: vi.fn(() => Promise.resolve()),
    spawnCommandForOutput: vi.fn(() => Promise.resolve('{}'))
}));

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

// The project's own list of advisories to ignore: one in a development tool, one in a shipped dependency.
const IGNORED_ADVISORY_LISTS = {
    advisories: [{ id: 'GHSA-fx2h-pf6j-xcff', reason: "'vite', used by VitePress, which affects only the local dev server", reviewBy: '2026-12-31' }],
    shippedAdvisories: [{ id: 'GHSA-fc5q-39xc-vjpf', reason: "'picomatch', which runs only while building", reviewBy: '2026-12-31' }]
};

// ── State ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

beforeEach(async () => {
    await project.writeFiles({ 'package.json': JSON.stringify({ name: '@dpuse/dpuse-connector-example' }), 'auditIgnore.json': JSON.stringify(IGNORED_ADVISORY_LISTS) });
    vi.mocked(spawnCommand).mockClear().mockResolvedValue();
    vi.mocked(spawnCommandForOutput).mockClear().mockResolvedValue(auditReport());
    vi.useFakeTimers({ now: new Date('2026-10-03T12:00:00Z'), toFake: ['Date'] });
});

afterEach(() => {
    vi.useRealTimers();
});

describe('auditDependencies', () => {
    it('checks shipped dependencies, then every dependency, as JSON', async () => {
        await auditDependencies();

        expect(spawnedCommands()).toEqual([]);
        expect(spawnCommandForOutput).toHaveBeenNthCalledWith(1, expect.any(String), 'npm', ['audit', '--omit=dev', '--json']);
        expect(spawnCommandForOutput).toHaveBeenNthCalledWith(2, expect.any(String), 'npm', ['audit', '--json']);
        expect(collectConsoleOutput()).toContain('Dependencies audited');
    });

    it('checks only every dependency, with the ignored advisories, for a development-only package', async () => {
        await project.writeFiles({ 'package.json': JSON.stringify({ name: '@dpuse/dpuse-development' }) });
        vi.mocked(spawnCommandForOutput).mockResolvedValue(auditReport({ id: 'GHSA-fx2h-pf6j-xcff', name: 'vite', severity: 'high' }));

        await auditDependencies();

        const output = collectConsoleOutput();
        expect(spawnCommandForOutput).toHaveBeenCalledTimes(1);
        expect(output).toContain('1️⃣  Shipped dependencies NOT checked: @dpuse/dpuse-development is a development-only tool');
        expect(output).toContain('Dependencies audited');
    });

    it('passes moderate advisories and ignored high ones, naming the ignored ones', async () => {
        vi.mocked(spawnCommandForOutput)
            .mockResolvedValueOnce(auditReport())
            .mockResolvedValue(auditReport({ id: 'GHSA-moderate', name: 'slow', severity: 'moderate' }, { id: 'GHSA-fx2h-pf6j-xcff', name: 'vite', severity: 'high' }));

        await auditDependencies();

        const output = collectConsoleOutput();
        expect(output).toContain('ℹ️  Ignored GHSA-fx2h-pf6j-xcff');
        expect(output).not.toContain('GHSA-moderate');
        expect(output).toContain('Dependencies audited');
    });

    it('fails on a high or critical advisory that is not ignored, naming it', async () => {
        vi.mocked(spawnCommandForOutput)
            .mockResolvedValueOnce(auditReport())
            .mockResolvedValue(auditReport({ id: 'GHSA-new-high', name: 'leaky', severity: 'high' }, { id: 'GHSA-new-critical', name: 'broken', severity: 'critical' }));

        await expect(auditDependencies()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith("❌  high 'leaky': leaky flaw (https://github.com/advisories/GHSA-new-high)");
        expect(console.error).toHaveBeenCalledWith("❌  critical 'broken': broken flaw (https://github.com/advisories/GHSA-new-critical)");
        expect(console.error).toHaveBeenCalledWith('❌  Error auditing dependencies', new Error('2 high or critical vulnerabilities found'));
    });

    it('warns, but still passes, when an ignored advisory is past its review date', async () => {
        vi.setSystemTime(new Date('2027-01-01T12:00:00Z'));
        vi.mocked(spawnCommandForOutput)
            .mockResolvedValueOnce(auditReport())
            .mockResolvedValue(auditReport({ id: 'GHSA-fx2h-pf6j-xcff', name: 'vite', severity: 'high' }));

        await auditDependencies();

        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('⚠️  Ignored GHSA-fx2h-pf6j-xcff, but its review date 2026-12-31 has passed'));
    });

    it('ignores nothing in a project that has no list of its own', async () => {
        await fs.rm('auditIgnore.json');
        vi.mocked(spawnCommandForOutput)
            .mockResolvedValueOnce(auditReport())
            .mockResolvedValue(auditReport({ id: 'GHSA-fx2h-pf6j-xcff', name: 'vite', severity: 'high' }));

        await expect(auditDependencies()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error auditing dependencies', new Error('1 high or critical vulnerabilities found'));
    });

    it('reads a list that names only one kind of advisory', async () => {
        await project.writeFiles({ 'auditIgnore.json': JSON.stringify({ advisories: IGNORED_ADVISORY_LISTS.advisories }) });
        vi.mocked(spawnCommandForOutput)
            .mockResolvedValueOnce(auditReport())
            .mockResolvedValue(auditReport({ id: 'GHSA-fx2h-pf6j-xcff', name: 'vite', severity: 'high' }));

        await auditDependencies();

        expect(collectConsoleOutput()).toContain('ℹ️  Ignored GHSA-fx2h-pf6j-xcff');
    });

    it.each([
        ['an entry has no review date', { advisories: [{ id: 'GHSA-fx2h-pf6j-xcff', reason: 'No fix yet' }] }, 'advisories.0.reviewBy'],
        ['a review date is not a date', { advisories: [{ id: 'GHSA-fx2h-pf6j-xcff', reason: 'No fix yet', reviewBy: 'next year' }] }, 'advisories.0.reviewBy'],
        ['a list is misnamed', { ignored: [] }, 'ignored']
    ])('stops, naming what is wrong, when %s in the list', async (_case, lists, issuePath) => {
        await project.writeFiles({ 'auditIgnore.json': JSON.stringify(lists) });

        await expect(auditDependencies()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith(
            '❌  Error auditing dependencies',
            expect.objectContaining({ message: expect.stringContaining(`'auditIgnore.json' is not valid. ${issuePath}: `) as string })
        );
        expect(spawnCommandForOutput).not.toHaveBeenCalled();
    });

    it('fails when the audit itself reports an error', async () => {
        vi.mocked(spawnCommandForOutput).mockResolvedValue(JSON.stringify({ error: { summary: 'registry unreachable' } }));

        await expect(auditDependencies()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error auditing dependencies', new Error('registry unreachable'));
    });

    it.each([
        ['nothing', ''],
        ['text that is not a report', 'npm error code ENOLOCK']
    ])('fails, rather than passing unchecked, when the audit writes %s', async (_case, output) => {
        vi.mocked(spawnCommandForOutput).mockResolvedValue(output);

        await expect(auditDependencies()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error auditing dependencies', expect.any(SyntaxError));
        expect(collectConsoleOutput()).not.toContain('Dependencies audited');
    });

    it('fails without the full audit when a shipped dependency has a vulnerability of any severity', async () => {
        vi.mocked(spawnCommandForOutput).mockResolvedValue(auditReport({ id: 'GHSA-moderate', name: 'slow', severity: 'moderate' }));

        await expect(auditDependencies()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith("❌  moderate 'slow': slow flaw (https://github.com/advisories/GHSA-moderate)");
        expect(console.error).toHaveBeenCalledWith('❌  Error auditing dependencies', new Error('1 vulnerabilities found in shipped dependencies'));
        expect(spawnCommandForOutput).toHaveBeenCalledTimes(1);
    });

    it('passes a shipped advisory on the shipped allow list, in both checks, naming it', async () => {
        vi.mocked(spawnCommandForOutput).mockResolvedValue(auditReport({ id: 'GHSA-fc5q-39xc-vjpf', name: 'picomatch', severity: 'high' }));

        await auditDependencies();

        const output = collectConsoleOutput();
        expect(output.match(/ℹ️ {2}Ignored GHSA-fc5q-39xc-vjpf/gu)).toHaveLength(2);
        expect(output).toContain('Dependencies audited');
    });

    it('fails on a shipped advisory that only the development allow list ignores', async () => {
        vi.mocked(spawnCommandForOutput).mockResolvedValue(auditReport({ id: 'GHSA-fx2h-pf6j-xcff', name: 'vite', severity: 'high' }));

        await expect(auditDependencies()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error auditing dependencies', new Error('1 vulnerabilities found in shipped dependencies'));
    });
});

describe('reportIgnoredAdvisories', () => {
    it('warns about each high or critical advisory on the allow list, with its reason, and nothing else', async () => {
        vi.mocked(spawnCommandForOutput).mockResolvedValue(
            auditReport(
                { id: 'GHSA-fx2h-pf6j-xcff', name: 'vite', severity: 'high' },
                { id: 'GHSA-new-high', name: 'leaky', severity: 'high' },
                { id: 'GHSA-moderate', name: 'slow', severity: 'moderate' }
            )
        );

        await reportIgnoredAdvisories('4️⃣  Name ignored advisories');

        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(
            expect.stringMatching(/^⚠️ {2}GHSA-fx2h-pf6j-xcff \('vite'\) is on the allow list, so the CI audit ignores it: 'vite', used by VitePress/u)
        );
    });

    it('says so when no reported advisory is on the allow list', async () => {
        vi.mocked(spawnCommandForOutput).mockResolvedValue(auditReport({ id: 'GHSA-new-high', name: 'leaky', severity: 'high' }));

        await reportIgnoredAdvisories('4️⃣  Name ignored advisories');

        expect(console.warn).not.toHaveBeenCalled();
        expect(collectConsoleOutput()).toContain('ℹ️  None of the reported advisories are on the allow list');
    });

    it('warns, without failing, when the audit itself reports an error', async () => {
        vi.mocked(spawnCommandForOutput).mockResolvedValue(JSON.stringify({ error: { summary: 'registry unreachable' } }));

        await reportIgnoredAdvisories('4️⃣  Name ignored advisories');

        expect(console.warn).toHaveBeenCalledWith('⚠️  Could not check the allow list: registry unreachable');
    });
});

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// An 'npm audit --json' report holding the given advisories, each reached through a second package as npm reports it.
function auditReport(...advisories: { id: string; name: string; severity: string }[]): string {
    const vulnerabilities: Record<string, { via: unknown[] }> = {};
    for (const { id, name, severity } of advisories) {
        vulnerabilities[name] = { via: [{ name, severity, title: `${name} flaw`, url: `https://github.com/advisories/${id}` }] };
        vulnerabilities[`${name}-parent`] = { via: [name] };
    }
    return JSON.stringify({ auditReportVersion: 2, vulnerabilities });
}
