// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';
import { array, type InferOutput, isoDate, optional, pipe, safeParse, strictObject, string } from 'valibot';

// ── Local Framework
import { DEVELOPMENT_ONLY_PACKAGE_NAMES, logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFileOrNull, spawnCommandForOutput } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// A flaw 'npm audit' reports against a package. The other entries in a package's 'via' list are the names of the
// packages the flaw reaches it through.
interface AuditAdvisory {
    name: string;
    severity: string;
    title: string;
    url: string;
}

type IgnoredAdvisory = InferOutput<typeof ignoredAdvisorySchema>;

type IgnoredAdvisoryLists = InferOutput<typeof ignoredAdvisoryListsSchema>;

interface AuditReport {
    error?: { summary: string };
    vulnerabilities?: Record<string, { via: (AuditAdvisory | string)[] }>;
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const BLOCKING_SEVERITIES = new Set(['critical', 'high']);

// ── Ignored Advisories ─ The advisories a project's audit ignores because they have no fix yet, kept in a file in the
// project. An advisory is then ignored only where its reason holds, and adding one needs no release of this package.
// 'advisories' holds high or critical ones in development tools that cannot reach a release or the publish
// credentials. 'shippedAdvisories' holds ones in shipped dependencies whose flawed code never reaches users, and is the
// only list the shipped check reads, so a development entry cannot hide a flaw users would install. Remove an entry
// once a fix is released. After an entry's 'reviewBy' date the audit warns, so it is checked again rather than kept by
// habit.
const IGNORED_ADVISORIES_PATH = 'auditIgnore.json';
const ignoredAdvisorySchema = strictObject({ id: string(), reason: string(), reviewBy: pipe(string(), isoDate()) });
const ignoredAdvisoryListsSchema = strictObject({ advisories: optional(array(ignoredAdvisorySchema), []), shippedAdvisories: optional(array(ignoredAdvisorySchema), []) });

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Audit the project's dependencies for known security vulnerabilities. */
export async function auditDependencies(): Promise<void> {
    try {
        logOperationHeader('Audit Dependencies');

        // Users install these packages, so a vulnerability of any severity fails the audit, unless it is on the shipped
        // allow list. A development-only package ships nothing to users, so all its dependencies are checked as dev
        // tools below.
        const packageJSON = await readJSONFile<PackageJson>('package.json');
        const ignoredAdvisoryLists = await readIgnoredAdvisoryLists();
        if (DEVELOPMENT_ONLY_PACKAGE_NAMES.has(packageJSON.name ?? '')) {
            logStepHeader(`1️⃣  Shipped dependencies NOT checked: ${packageJSON.name ?? ''} is a development-only tool`);
        } else {
            const shippedOutput = await spawnCommandForOutput('1️⃣  Check shipped dependencies for any vulnerability', 'npm', ['audit', '--omit=dev', '--json']);
            const shippedReport = JSON.parse(shippedOutput) as AuditReport;
            if (shippedReport.error !== undefined) throw new Error(shippedReport.error.summary);

            const shippedAdvisories = checkAdvisories(listAdvisories(shippedReport), ignoredAdvisoryLists.shippedAdvisories, true);
            if (shippedAdvisories.length > 0) throw new Error(`${String(shippedAdvisories.length)} vulnerabilities found in shipped dependencies`);
        }

        // Dev tools run during publishing, where they could reach the publish credentials, so high and critical flaws
        // fail. Lesser ones often await an upstream fix, so they pass, as do the ignored advisories.
        const output = await spawnCommandForOutput('2️⃣  Check all dependencies for high or critical vulnerabilities', 'npm', ['audit', '--json']);
        const report = JSON.parse(output) as AuditReport;
        if (report.error !== undefined) throw new Error(report.error.summary);

        const blockingAdvisories = checkAdvisories(listAdvisories(report), listAllIgnoredAdvisories(ignoredAdvisoryLists), false);
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

    const ignoredAdvisories = listAllIgnoredAdvisories(await readIgnoredAdvisoryLists());
    let ignoredCount = 0;
    for (const advisory of listAdvisories(report)) {
        const ignoredAdvisory = BLOCKING_SEVERITIES.has(advisory.severity) ? findIgnoredAdvisory(advisory, ignoredAdvisories) : undefined;
        if (ignoredAdvisory === undefined) continue;
        console.warn(`⚠️  ${ignoredAdvisory.id} ('${advisory.name}') is on the allow list, so the CI audit ignores it: ${ignoredAdvisory.reason}`);
        ignoredCount++;
    }
    if (ignoredCount === 0) console.info('ℹ️  None of the reported advisories are on the allow list');
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// A project with no file ignores nothing. A file that cannot be read as the lists stops the audit, as a mistyped entry
// would otherwise ignore nothing without saying so.
async function readIgnoredAdvisoryLists(): Promise<IgnoredAdvisoryLists> {
    const text = await readTextFileOrNull(IGNORED_ADVISORIES_PATH);
    if (text === null) return { advisories: [], shippedAdvisories: [] };

    const result = safeParse(ignoredAdvisoryListsSchema, JSON.parse(text));
    if (result.success) return result.output;
    const issueTexts = result.issues.map((issue) => `${issue.path?.map((item) => String(item.key)).join('.') ?? 'file'}: ${issue.message}`);
    throw new Error(`'${IGNORED_ADVISORIES_PATH}' is not valid. ${issueTexts.join('; ')}`);
}

function listAllIgnoredAdvisories(lists: IgnoredAdvisoryLists): IgnoredAdvisory[] {
    return [...lists.advisories, ...lists.shippedAdvisories];
}

/** Reports each advisory severe enough to fail the audit, as ignored or blocking, and returns the blocking ones. */
function checkAdvisories(advisories: AuditAdvisory[], ignoredAdvisories: IgnoredAdvisory[], isAnySeverityBlocking: boolean): AuditAdvisory[] {
    const today = new Date().toISOString().slice(0, 10);
    const blockingAdvisories: AuditAdvisory[] = [];

    for (const advisory of advisories) {
        if (!isAnySeverityBlocking && !BLOCKING_SEVERITIES.has(advisory.severity)) continue;

        const ignoredAdvisory = findIgnoredAdvisory(advisory, ignoredAdvisories);
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
function findIgnoredAdvisory(advisory: AuditAdvisory, ignoredAdvisories: IgnoredAdvisory[]): IgnoredAdvisory | undefined {
    const id = advisory.url.slice(advisory.url.lastIndexOf('/') + 1);
    return ignoredAdvisories.find((ignored) => ignored.id === id);
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
