// ── External Dependencies & Registrations
import { execFile } from 'node:child_process';
import type { PackageJson } from 'type-fest';
import { promisify } from 'node:util';

// ── Local Framework
import {
    FALLOW_BADGE_PATH,
    FALLOW_DIRECTORY,
    FALLOW_REPORT_PATH,
    logOperationHeader,
    logOperationSuccess,
    logStepHeader,
    migrateGovernanceSection,
    QUALITY_SECURITY_END_MARKER,
    QUALITY_SECURITY_START_MARKER,
    readJSONFile,
    readTextFileOrNull,
    resolveOwnerAndRepo,
    spawnCommand,
    spawnCommandToFile,
    writeJSONFile,
    writeReadmeSection
} from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface BestPracticesProject {
    id: number;
    repo_url: string;
}

interface CoverageSummary {
    total: { lines: { pct: number } };
}

interface FallowHealth {
    health_score: { score: number; grade: string };
}

interface GitHubCheckRuns {
    check_runs: { app: { slug: string } | null }[];
}

interface GitHubRepoDetails {
    security_and_analysis?: Record<string, { status: string } | undefined>;
}

interface ScorecardResult {
    checks: { name: string; score: number }[];
}

// Everything the checks tables report on, gathered before the README is written.
interface ChecksResults {
    coveragePercent: number | undefined;
    fallowHealth: FallowHealth | undefined;
    securitySettings: SecuritySettings;
}

// On or off, or undefined where GitHub doesn't reveal the setting (some need an admin login to read).
type SettingStatus = boolean | undefined;

interface SecuritySettings {
    codeQLLanguages: string[];
    codeQLQueries: string | undefined; // The query suite CodeQL is told to run; without one, it runs its default suite.
    dependabotAlerts: SettingStatus;
    dependabotSecurityUpdates: SettingStatus;
    dependabotVersionUpdates: boolean;
    npmAuditInCI: boolean;
    npmAuditLevel: string | undefined; // The '--audit-level' CI passes; without one, npm audit fails on any severity.
    privateVulnerabilityReporting: SettingStatus;
    propertyTests: boolean;
    pushProtection: SettingStatus;
    secretScanning: SettingStatus;
    socket: boolean;
    sonarCloud: boolean;
    testsInCI: boolean;
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

// Scorecard checks a solo maintainer pushing straight to 'main' can't raise, with the best score each can reach that way.
const SCORECARD_PRACTICE_LIMITS: Record<string, number> = { 'Branch-Protection': 3, 'Code-Review': 0, Contributors: 0 };
// Left out when deciding whether gaps remain: the Best Practices badge shows its own progress in the same section.
const SCORECARD_IGNORED_CHECKS = new Set(['CII-Best-Practices']);

// Coverage — only measured where the module has the Vitest coverage provider installed. 'coverage-final.json' feeds
// Fallow's per-function scores; the summary holds the totals the Testing table reports.
const COVERAGE_FINAL_PATH = 'coverage/coverage-final.json';
const COVERAGE_SUMMARY_PATH = 'coverage/coverage-summary.json';
const COVERAGE_TARGET_PERCENT = 80;
const COVERAGE_WARNING_PERCENT = 60; // Below the target the badge turns yellow, and below this it turns red.
const COVERAGE_BADGE_PATH = 'code-health-reports/vitest/badge.json'; // Not under a 'coverage' folder, which '.gitignore' leaves out.

const CODEQL_LANGUAGE_NAMES: Record<string, string> = { actions: 'GitHub Actions', 'javascript-typescript': 'JavaScript/TypeScript', rust: 'Rust' };

// Fallow — only run where the module has it installed. The full report is published as its own page, linked from the
// README; the Code Quality row and the badge are both built from the one health run, so they always agree.
const FALLOW_GRADE_COLOURS: Record<string, string> = { A: 'brightgreen', B: 'green', C: 'yellow', D: 'orange', F: 'red' };
const FALLOW_HEALTH_PATH = `${FALLOW_DIRECTORY}/health.json`;

// ── Initialisation ───────────────────────────────────────────────────────────────────────────────────────────────────

const asyncExecFile = promisify(execFile);

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Regenerates the README's Quality & Security section: testing, code quality, security analysis, dependencies and OpenSSF. */
export async function documentQualitySecurity(): Promise<void> {
    try {
        logOperationHeader('Document Quality & Security');

        const packageJSON = await readJSONFile<PackageJson>('package.json');

        const coveragePercent = await measureTestCoverage(packageJSON);
        const fallowHealth = await measureCodeHealth(packageJSON, coveragePercent === undefined ? [] : ['--coverage', COVERAGE_FINAL_PATH]);

        const { owner, repo } = resolveOwnerAndRepo(packageJSON, 'document quality and security');

        logStepHeader('4️⃣  Read security checks and settings');
        const securitySettings = await readSecuritySettings(owner, repo, packageJSON);

        logStepHeader('5️⃣  Look up OpenSSF Best Practices badge and Scorecard results');
        const [bestPracticesProjectId, scorecardResult] = await Promise.all([
            lookUpBestPracticesProjectId(`https://github.com/${owner}/${repo}`),
            lookUpScorecardResult(`github.com/${owner}/${repo}`)
        ]);

        logStepHeader("6️⃣  Insert quality and security content into 'README.md'");
        const content = buildQualitySecurityContent(owner, repo, { coveragePercent, fallowHealth, securitySettings }, bestPracticesProjectId, scorecardResult);

        await migrateGovernanceSection();
        await writeReadmeSection(content, QUALITY_SECURITY_START_MARKER, QUALITY_SECURITY_END_MARKER);

        logOperationSuccess('Quality & security documented');
    } catch (error) {
        console.error('❌  Error documenting quality and security', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// Answers undefined where the coverage provider isn't installed, or the Vitest config doesn't write a coverage summary.
async function measureTestCoverage(packageJSON: PackageJson): Promise<number | undefined> {
    if (packageJSON.devDependencies?.['@vitest/coverage-v8'] == null) {
        logStepHeader("1️⃣  Test coverage NOT measured, as '@vitest/coverage-v8' is not installed");
        return undefined;
    }

    await spawnCommand('1️⃣  Measure test coverage', 'vitest', ['run', '--passWithNoTests', '--coverage']);
    const summary = await readTextFileOrNull(COVERAGE_SUMMARY_PATH);
    if (summary === null) return undefined;

    const coveragePercent = (JSON.parse(summary) as CoverageSummary).total.lines.pct;
    await writeCoverageBadge(coveragePercent);
    return coveragePercent;
}

// Written in the shields.io endpoint format, like the Fallow badge, so the README shows the latest pushed figure.
async function writeCoverageBadge(coveragePercent: number): Promise<void> {
    const colourNames = ['red', 'yellow', 'brightgreen'];
    const level = Number(coveragePercent >= COVERAGE_WARNING_PERCENT) + Number(coveragePercent >= COVERAGE_TARGET_PERCENT);
    await writeJSONFile(COVERAGE_BADGE_PATH, { schemaVersion: 1, label: 'coverage', message: `${coveragePercent.toFixed(1)}%`, color: colourNames[level] });
}

// Fallow exits non-zero whenever it has findings, so its exit code is ignored: the findings are what gets reported.
async function measureCodeHealth(packageJSON: PackageJson, coverageArguments: string[]): Promise<FallowHealth | undefined> {
    if (packageJSON.devDependencies?.['fallow'] == null) {
        logStepHeader('2️⃣  Code health NOT measured, as Fallow is not installed');
        logStepHeader('3️⃣  Code health report NOT required');
        return undefined;
    }

    await spawnCommandToFile('2️⃣  Measure code health', 'fallow', ['health', '--report-only', '--format', 'json', ...coverageArguments], FALLOW_HEALTH_PATH);
    await spawnCommandToFile('3️⃣  Write code health report', 'fallow', ['--format', 'markdown'], FALLOW_REPORT_PATH, true);
    const health = await readJSONFile<FallowHealth>(FALLOW_HEALTH_PATH);
    await writeFallowBadge(health);
    return health;
}

// Written in the shields.io endpoint format, so the Code Quality badge shows the latest pushed grade.
async function writeFallowBadge(health: FallowHealth): Promise<void> {
    const { score, grade } = health.health_score;
    await writeJSONFile(FALLOW_BADGE_PATH, {
        schemaVersion: 1,
        label: 'fallow',
        message: `${grade} (${String(Math.round(score))})`,
        color: FALLOW_GRADE_COLOURS[grade] ?? 'lightgrey'
    });
}

// Read from the repository itself each time, so the README states what is actually switched on rather than what was
// intended. Workflow and Dependabot files are read locally; repository settings come from the GitHub API through 'gh'.
async function readSecuritySettings(owner: string, repo: string, packageJSON: PackageJson): Promise<SecuritySettings> {
    const [ciWorkflow, codeQLWorkflow, dependabotConfig] = await Promise.all([
        readTextFileOrNull('.github/workflows/ci.yml'),
        readTextFileOrNull('.github/workflows/codeql.yml'),
        readTextFileOrNull('.github/dependabot.yml')
    ]);
    const [repoDetails, privateVulnerabilityReporting, vulnerabilityAlerts, checkRuns] = await Promise.all([
        readGitHubAPI(`repos/${owner}/${repo}`),
        readGitHubAPI(`repos/${owner}/${repo}/private-vulnerability-reporting`),
        readGitHubAPI(`repos/${owner}/${repo}/vulnerability-alerts`),
        readGitHubAPI(`repos/${owner}/${repo}/commits/main/check-runs?per_page=100`)
    ]);

    const securityAndAnalysis = repoDetails === undefined ? undefined : (JSON.parse(repoDetails) as GitHubRepoDetails).security_and_analysis;
    const readSetting = (name: string): SettingStatus => (securityAndAnalysis?.[name] === undefined ? undefined : securityAndAnalysis[name].status === 'enabled');
    const checkAppSlugs = new Set((checkRuns === undefined ? [] : (JSON.parse(checkRuns) as GitHubCheckRuns).check_runs).map((checkRun) => checkRun.app?.slug));

    // Version updates count as off when every ecosystem is limited to 0 pull requests, the documented way to pause them.
    const ecosystemCount = dependabotConfig?.match(/package-ecosystem:/g)?.length ?? 0;
    const pausedEcosystemCount = dependabotConfig?.match(/open-pull-requests-limit: 0\b/g)?.length ?? 0;

    return {
        codeQLLanguages: (codeQLWorkflow ?? '')
            .matchAll(/- language: ([\w-]+)/g)
            .map(([, language = '']) => CODEQL_LANGUAGE_NAMES[language] ?? language)
            .toArray(),
        codeQLQueries: /queries: ([\w-]+)/.exec(codeQLWorkflow ?? '')?.[1],
        dependabotAlerts: vulnerabilityAlerts !== undefined, // Answers '204 No Content' when on and '404' when off.
        dependabotSecurityUpdates: readSetting('dependabot_security_updates'),
        dependabotVersionUpdates: ecosystemCount > pausedEcosystemCount,
        npmAuditInCI: /npm (?:run )?audit/.test(ciWorkflow ?? ''),
        npmAuditLevel: /npm audit --audit-level=(\w+)/.exec(ciWorkflow ?? '')?.[1],
        privateVulnerabilityReporting: privateVulnerabilityReporting === undefined ? undefined : (JSON.parse(privateVulnerabilityReporting) as { enabled: boolean }).enabled,
        propertyTests: packageJSON.devDependencies?.['fast-check'] != null,
        pushProtection: readSetting('secret_scanning_push_protection'),
        secretScanning: readSetting('secret_scanning'),
        socket: checkAppSlugs.has('socket-security'),
        sonarCloud: checkAppSlugs.has('sonarqubecloud'),
        testsInCI: ciWorkflow?.includes('npm test') ?? false
    };
}

// Answers undefined for a 404, which is how some endpoints report a switched-off feature. Any other failure throws, so a
// missing login or network blip can't be written into the README as settings being off.
async function readGitHubAPI(endpoint: string): Promise<string | undefined> {
    try {
        const { stdout } = await asyncExecFile('gh', ['api', endpoint]);
        return stdout;
    } catch (error) {
        if (String((error as { stderr?: unknown }).stderr).includes('HTTP 404')) return undefined;
        throw error;
    }
}

// Found by repository URL, as OpenSSF Scorecard does, so a repo shows its badge as soon as it is registered and nothing
// needs configuring. Failures throw rather than return nothing, so a network blip can't drop the badge from the README.
async function lookUpBestPracticesProjectId(repoURL: string): Promise<number | undefined> {
    const response = await fetch(`https://www.bestpractices.dev/projects.json?url=${encodeURIComponent(repoURL)}`);
    if (!response.ok) throw new Error(`OpenSSF Best Practices lookup failed with status ${String(response.status)}.`);

    // The search also matches home page URLs, so keep only the entry registered for this repository.
    const projects = (await response.json()) as BestPracticesProject[];
    return projects.find((project) => project.repo_url === repoURL)?.id;
}

// Answers undefined when Scorecard has no results for the repository yet. Other failures throw, as for the badge.
async function lookUpScorecardResult(scorecardURI: string): Promise<ScorecardResult | undefined> {
    const response = await fetch(`https://api.scorecard.dev/projects/${scorecardURI}`);
    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error(`OpenSSF Scorecard lookup failed with status ${String(response.status)}.`);
    return (await response.json()) as ScorecardResult;
}

// True when every check short of 10 is one the way the project is run caps. A score of -1 means Scorecard couldn't assess
// the check (e.g. Signed-Releases without release assets), so it isn't counted as a gap.
function isScorecardOnlyPracticeLimited(result: ScorecardResult): boolean {
    return result.checks.every(
        ({ name, score }) =>
            score === -1 || score === 10 || SCORECARD_IGNORED_CHECKS.has(name) || (SCORECARD_PRACTICE_LIMITS[name] !== undefined && score >= SCORECARD_PRACTICE_LIMITS[name])
    );
}

// Where Dependabot's pull requests are switched off, dependency updates are made by hand.
function formatManualNote(status: SettingStatus): string {
    return status === false ? ' These are handled manually.' : '';
}

function formatStatus(status: SettingStatus): string {
    if (status === undefined) return '❔ Unknown';
    return status ? '✅ On' : '❌ Off';
}

function buildTableContent(heading: string, rows: string[][]): string {
    if (rows.length === 0) return '';
    return `### ${heading}

|Check|Status|What it does|
|:-|:-|:-|
${rows.map((row) => `|${row.join('|')}|`).join('\n')}

`;
}

// A badge that shields.io draws from a JSON file this action commits, so it shows the latest pushed figure.
function formatEndpointBadge(owner: string, repo: string, label: string, badgePath: string): string {
    const badgeSourceURL = encodeURIComponent(`https://raw.githubusercontent.com/${owner}/${repo}/main/${badgePath}`);
    return `![${label}](https://img.shields.io/endpoint?url=${badgeSourceURL})`;
}

// Grouped by what each check protects against, and within a group in the order the checks act on a change: before a
// push, on every push, then continuously. The Status column shows a check's badge where it has one, and otherwise
// whether it is on; a check that is off shows as off, never as a broken badge. The product doing each check is named
// and linked in what it does.
function buildChecksContent(owner: string, repo: string, { coveragePercent, fallowHealth, securitySettings: settings }: ChecksResults): string {
    const repoURL = `https://github.com/${owner}/${repo}`;

    const testingRows = [
        [
            'Unit tests',
            settings.testsInCI ? `[![CI](${repoURL}/actions/workflows/ci.yml/badge.svg)](${repoURL}/actions/workflows/ci.yml)` : formatStatus(false),
            '[Vitest](https://vitest.dev) runs the unit tests in CI on every push to `main`.'
        ],
        [
            'Property-based tests',
            formatStatus(settings.propertyTests),
            '[fast-check](https://fast-check.dev) runs many random inputs per test to find edge cases, alongside the unit tests.'
        ]
    ];
    if (coveragePercent !== undefined) {
        testingRows.push([
            'Test coverage',
            formatEndpointBadge(owner, repo, 'Coverage', COVERAGE_BADGE_PATH),
            `[Vitest's V8 coverage](https://vitest.dev/guide/coverage) measures the share of source lines the unit tests run. The target is ${String(COVERAGE_TARGET_PERCENT)}%.`
        ]);
    }

    const codeQualityRows = [
        [
            'Code analysis',
            settings.sonarCloud
                ? `[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=${owner}_${repo}&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=${owner}_${repo})`
                : formatStatus(false),
            '[SonarCloud](https://sonarcloud.io) checks every push for bugs, code smells and vulnerabilities.'
        ]
    ];
    if (fallowHealth !== undefined) {
        codeQualityRows.unshift([
            'Code health',
            `[${formatEndpointBadge(owner, repo, 'Fallow code health', FALLOW_BADGE_PATH)}](./${FALLOW_REPORT_PATH})`,
            '[Fallow](https://github.com/fallow-rs/fallow) finds unused code, duplication, complexity and dependency problems.'
        ]);
    }

    const codeQLScope = settings.codeQLQueries === 'security-extended' ? 'using the extended security queries' : 'using the default queries';
    const codeQLLanguages = settings.codeQLLanguages.length === 0 ? '' : ` ${settings.codeQLLanguages.join(' and ')}`;
    const securityAnalysisRows = [
        [
            'Push protection',
            formatStatus(settings.pushProtection),
            '[GitHub push protection](https://docs.github.com/en/code-security/secret-scanning/push-protection-for-repositories-and-organizations) blocks pushes that contain credentials.'
        ],
        [
            'Static analysis',
            settings.codeQLLanguages.length > 0 ? `[![CodeQL](${repoURL}/actions/workflows/codeql.yml/badge.svg)](${repoURL}/security/code-scanning)` : formatStatus(false),
            `[CodeQL](https://codeql.github.com) scans${codeQLLanguages} for security vulnerabilities, ${codeQLScope}, on every push and pull request to \`main\` and weekly.`
        ],
        [
            'Secret scanning',
            formatStatus(settings.secretScanning),
            '[GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning) detects credentials, such as API keys and tokens, committed to the repository.'
        ]
    ];

    const dependabotLink = '[Dependabot](https://docs.github.com/en/code-security/dependabot)';
    const dependencyRows = [
        [
            'Vulnerability audit',
            formatStatus(settings.npmAuditInCI),
            settings.npmAuditLevel === undefined
                ? '[npm audit](https://docs.npmjs.com/cli/commands/npm-audit) fails CI when any dependency has a known vulnerability.'
                : `[npm audit](https://docs.npmjs.com/cli/commands/npm-audit) fails CI when a dependency has a known vulnerability of ${settings.npmAuditLevel} severity or above.`
        ],
        [
            'Supply chain risk',
            formatStatus(settings.socket), // Socket's badge service refuses requests from outside a browser, so GitHub couldn't show it.
            '[Socket](https://socket.dev) flags malicious packages, typosquatting and suspicious behaviour that may not yet have a CVE.'
        ],
        ['Security alerts', formatStatus(settings.dependabotAlerts), `${dependabotLink} alerts when a dependency has a known vulnerability, using the GitHub Advisory Database.`],
        [
            'Security updates',
            formatStatus(settings.dependabotSecurityUpdates),
            `${dependabotLink} opens pull requests that update vulnerable dependencies.${formatManualNote(settings.dependabotSecurityUpdates)}`
        ],
        [
            'Version updates',
            formatStatus(settings.dependabotVersionUpdates),
            `${dependabotLink} opens pull requests for new dependency versions.${formatManualNote(settings.dependabotVersionUpdates)}`
        ]
    ];

    return `This section is updated each time \`npm run document\` is run. Settings come from the repository's workflow files and GitHub. Test coverage and the Fallow score are measured at the same time.

${buildTableContent('Testing', testingRows)}${buildTableContent('Code Quality', codeQualityRows)}${buildTableContent('Security Analysis', securityAnalysisRows)}${buildTableContent('Dependencies', dependencyRows)}`;
}

function buildQualitySecurityContent(
    owner: string,
    repo: string,
    checksResults: ChecksResults,
    bestPracticesProjectId: number | undefined,
    scorecardResult: ScorecardResult | undefined
): string {
    const repoURL = `https://github.com/${owner}/${repo}`;
    const scorecardURI = `github.com/${owner}/${repo}`;
    const bestPracticesURL = `https://www.bestpractices.dev/projects/${String(bestPracticesProjectId)}`;
    const scorecardLimitText =
        scorecardResult !== undefined && isScorecardOnlyPracticeLimited(scorecardResult)
            ? "\n\n> [!NOTE]\n> Apart from the Best Practices badge above, the remaining Scorecard gaps need multi-person review or a pull-request workflow, which this solo-maintained project doesn't use."
            : '';
    const bestPracticesBadge = bestPracticesProjectId === undefined ? '' : `[![OpenSSF Best Practices](${bestPracticesURL}/badge)](${bestPracticesURL})\n`;

    // Without private reporting switched on, the advisory link leads nowhere, so point only at SECURITY.md.
    const reportingText =
        checksResults.securitySettings.privateVulnerabilityReporting === true
            ? `Use [GitHub private vulnerability reporting](${repoURL}/security/advisories/new) instead. See [SECURITY.md](./SECURITY.md) for the full disclosure policy, contact details, and expected response times.`
            : 'See [SECURITY.md](./SECURITY.md) for how to report one privately, the full disclosure policy, and expected response times.';

    return `## Quality & Security

${buildChecksContent(owner, repo, checksResults)}### OpenSSF 🚧

${bestPracticesBadge}[![OpenSSF Scorecard](https://api.scorecard.dev/projects/${scorecardURI}/badge)](https://scorecard.dev/viewer/?uri=${scorecardURI})

This project is working towards the [OpenSSF Best Practices](https://www.bestpractices.dev) Passing badge, a self-certification covering security policy, vulnerability reporting, build processes, code quality, and more. Currently the [OpenSSF Scorecard](https://scorecard.dev) provides an independent automated assessment of the project's security practices and is an ongoing area of improvement.${scorecardLimitText}

### Reporting Vulnerabilities

Please do not open public GitHub issues for security vulnerabilities. ${reportingText}`;
}
