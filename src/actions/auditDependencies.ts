// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── Local Framework
// High or critical advisories in development tools that cannot reach a release or the publish credentials, and have no
// fix yet. Remove an entry once a fix is released. After an entry's 'reviewBy' date the audit warns, so it is checked
// again rather than kept by habit.
import { IGNORED_ADVISORIES } from './auditDependencies_.json';
import { DEVELOPMENT_ONLY_PACKAGE_NAMES, logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, spawnCommand, spawnCommandForOutput } from '@/utilities';

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

        // Users install these packages, so any vulnerability at all fails the audit, and none is ever ignored. A
        // development-only package ships nothing to users, so all its dependencies are checked as dev tools below.
        const packageJSON = await readJSONFile<PackageJson>('package.json');
        if (DEVELOPMENT_ONLY_PACKAGE_NAMES.has(packageJSON.name ?? '')) {
            logStepHeader(`1️⃣  Shipped dependencies NOT checked: ${packageJSON.name ?? ''} is a development-only tool`);
        } else {
            await spawnCommand('1️⃣  Check shipped dependencies for any vulnerability', 'npm', ['audit', '--omit=dev']);
        }

        // Dev tools run during publishing, where they could reach the publish credentials, so high and critical flaws
        // fail. Lesser ones often await an upstream fix, so they pass, as do the ignored advisories.
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

/** Names the high or critical advisories 'npm audit' reports that the CI audit ignores, as npm's own report cannot. */
export async function reportIgnoredAdvisories(label: string): Promise<void> {
    const report = JSON.parse(await spawnCommandForOutput(label, 'npm', ['audit', '--json'])) as AuditReport;
    if (report.error !== undefined) {
        console.warn(`⚠️  Could not check the allow list: ${report.error.summary}`);
        return;
    }

    let ignoredCount = 0;
    for (const advisory of listAdvisories(report)) {
        const ignoredAdvisory = BLOCKING_SEVERITIES.has(advisory.severity) ? findIgnoredAdvisory(advisory) : undefined;
        if (ignoredAdvisory === undefined) continue;
        console.warn(`⚠️  ${ignoredAdvisory.id} ('${advisory.name}') is on the allow list, so the CI audit ignores it: ${ignoredAdvisory.reason}`);
        ignoredCount++;
    }
    if (ignoredCount === 0) console.info('ℹ️  None of the reported advisories are on the allow list');
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Reports each high or critical advisory, as ignored or blocking, and returns the blocking ones. */
function checkAdvisories(advisories: AuditAdvisory[]): AuditAdvisory[] {
    const today = new Date().toISOString().slice(0, 10);
    const blockingAdvisories: AuditAdvisory[] = [];

    for (const advisory of advisories) {
        if (!BLOCKING_SEVERITIES.has(advisory.severity)) continue;

        const ignoredAdvisory = findIgnoredAdvisory(advisory);
        if (ignoredAdvisory === undefined) {
            console.error(`❌  ${advisory.severity} '${advisory.name}': ${advisory.title} (${advisory.url})`);
            blockingAdvisories.push(advisory);
        } else if (ignoredAdvisory.reviewBy < today) {
            console.warn(`⚠️  Ignored ${ignoredAdvisory.id}, but its review date ${ignoredAdvisory.reviewBy} has passed: ${ignoredAdvisory.reason}`);
        } else {
            console.info(`ℹ️  Ignored ${ignoredAdvisory.id}: ${ignoredAdvisory.reason}`);
        }
    }

    return blockingAdvisories;
}

// npm names an advisory only by its URL, which ends in the id.
function findIgnoredAdvisory(advisory: AuditAdvisory): (typeof IGNORED_ADVISORIES)[number] | undefined {
    const id = advisory.url.slice(advisory.url.lastIndexOf('/') + 1);
    return IGNORED_ADVISORIES.find((ignored) => ignored.id === id);
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
