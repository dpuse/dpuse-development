// ── Local Framework
// High or critical advisories in development tools that cannot reach a release or the publish credentials, and have no
// fix yet. Remove an entry once a fix is released. After an entry's 'reviewBy' date the audit warns, so it is checked
// again rather than kept by habit.
import { IGNORED_ADVISORIES } from './auditDependencies_.json';
import { logOperationHeader, logOperationSuccess, spawnCommand, spawnCommandForOutput } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// A flaw 'npm audit' reports against a package. The other entries in a package's 'via' list are the names of the
// packages the flaw reaches it through.
interface AuditAdvisory {
    name: string;
    severity: string;
    title: string;
    url: string;
}

interface AuditReport {
    error?: { summary: string };
    vulnerabilities?: Record<string, { via: (AuditAdvisory | string)[] }>;
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const BLOCKING_SEVERITIES = new Set(['critical', 'high']);

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Audit the project's dependencies for known security vulnerabilities. */
export async function auditDependencies(): Promise<void> {
    try {
        logOperationHeader('Audit Dependencies');

        // Users install these packages, so any vulnerability at all fails the audit, and none is ever ignored.
        await spawnCommand('1️⃣  Check shipped dependencies for any vulnerability', 'npm', ['audit', '--omit=dev']);

        // Dev tools run during publishing, where they could reach the publish credentials, so high and critical flaws
        // fail. Lesser ones often await an upstream fix, so they pass, as do the advisories listed above.
        const output = await spawnCommandForOutput('2️⃣  Check all dependencies for high or critical vulnerabilities', 'npm', ['audit', '--json']);
        const report = JSON.parse(output) as AuditReport;
        if (report.error !== undefined) throw new Error(report.error.summary);

        const blockingAdvisories = checkAdvisories(listAdvisories(report));
        if (blockingAdvisories.length > 0) throw new Error(`${String(blockingAdvisories.length)} high or critical vulnerabilities found`);

        logOperationSuccess('Dependencies audited');
    } catch (error) {
        console.error('❌  Error auditing dependencies', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Reports each high or critical advisory, as ignored or blocking, and returns the blocking ones. */
function checkAdvisories(advisories: AuditAdvisory[]): AuditAdvisory[] {
    const today = new Date().toISOString().slice(0, 10);
    const blockingAdvisories: AuditAdvisory[] = [];

    for (const advisory of advisories) {
        if (!BLOCKING_SEVERITIES.has(advisory.severity)) continue;

        const id = advisory.url.slice(advisory.url.lastIndexOf('/') + 1);
        const ignoredAdvisory = IGNORED_ADVISORIES.find((ignored) => ignored.id === id);
        if (ignoredAdvisory === undefined) {
            console.error(`❌  ${advisory.severity} '${advisory.name}': ${advisory.title} (${advisory.url})`);
            blockingAdvisories.push(advisory);
        } else if (ignoredAdvisory.reviewBy < today) {
            console.warn(`⚠️  Ignored ${id}, but its review date ${ignoredAdvisory.reviewBy} has passed: ${ignoredAdvisory.reason}`);
        } else {
            console.info(`ℹ️  Ignored ${id}: ${ignoredAdvisory.reason}`);
        }
    }

    return blockingAdvisories;
}

/** The distinct advisories in an 'npm audit --json' report. */
function listAdvisories(report: AuditReport): AuditAdvisory[] {
    const advisories = new Map<string, AuditAdvisory>();
    const vulnerabilities = Object.values(report.vulnerabilities ?? {});
    for (const vulnerability of vulnerabilities) {
        for (const cause of vulnerability.via) if (typeof cause !== 'string') advisories.set(cause.url, cause);
    }
    return advisories.values().toArray();
}
