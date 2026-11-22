// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── Local Framework
import {
    COVERAGE_BADGE_PATH,
    FALLOW_BADGE_PATH,
    FALLOW_DIRECTORY,
    FALLOW_REPORT_PATH,
    logOperationHeader,
    logOperationSuccess,
    logStepHeader,
    QUALITY_SECURITY_END_MARKER,
    QUALITY_SECURITY_START_MARKER,
    readGitHubAPI,
    readGitHubCheckAppSlugs,
    readJSONFile,
    readTextFileOrNull,
    resolveOwnerAndRepository,
    RUST_WORKSPACE_PATH,
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
    total: { lines: { pct: number | 'Unknown' } }; // 'Unknown' when there is no code to measure, such as a project with no 'src'.
}

interface FallowHealth {
    health_score: { score: number; grade: string };
}

interface GitHubRepositoryDetails {
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

interface OpenSSFResults {
    bestPracticesProjectId: number | undefined;
    scorecardResult: ScorecardResult | undefined;
}

// On or off, or undefined where GitHub doesn't reveal the setting (some need an admin login to read).
type SettingStatus = boolean | undefined;

interface SecuritySettings {
    codeQLLanguages: string[];
    codeQLQueries: string | undefined; // The query suite CodeQL is told to run; without one, it runs its default suite.
    dependabotAlerts: SettingStatus;
    dependabotSecurityUpdates: SettingStatus;
    dependabotVersionUpdates: boolean;
    lintInCI: boolean;
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

const OPENSSF_REQUEST_TIMEOUT = 10_000; // Without one, a request OpenSSF never answers would hang the release.

const CODEQL_LANGUAGE_NAMES: Record<string, string> = { actions: 'GitHub Actions', 'javascript-typescript': 'JavaScript/TypeScript', rust: 'Rust' };

// Fallow — only run where the module has it installed. The full report is published as its own page, linked from the
// README; the Code Quality row and the badge are both built from the one health run, so they always agree.
const FALLOW_GRADE_COLOURS: Record<string, string> = { A: 'brightgreen', B: 'green', C: 'yellow', D: 'orange', F: 'red' };
const FALLOW_HEALTH_PATH = `${FALLOW_DIRECTORY}/health.json`;

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Regenerates the README's Quality & Security section: testing, code quality, security analysis, dependencies and OpenSSF. */
export async function documentQualitySecurity(): Promise<void> {
    try {
        logOperationHeader('Document Quality & Security');

        const packageJSON = await readJSONFile<PackageJson>('package.json');

        const coveragePercent = await measureTestCoverage(packageJSON);
        const fallowHealth = await measureCodeHealth(packageJSON, coveragePercent === undefined ? [] : ['--coverage', COVERAGE_FINAL_PATH]);

        const { owner, repository } = resolveOwnerAndRepository(packageJSON, 'document quality and security');

        logStepHeader('4️⃣  Read security checks and settings');
        const securitySettings = await readSecuritySettings(owner, repository, packageJSON);

        logStepHeader('5️⃣  Look up OpenSSF Best Practices badge and Scorecard results');
        const openSSFResults = await lookUpOpenSSFResults(owner, repository, packageJSON);

        logStepHeader("6️⃣  Insert quality and security content into 'README.md'");
        const content = buildQualitySecurityContent(owner, repository, { coveragePercent, fallowHealth, securitySettings }, openSSFResults);

        await writeReadmeSection(content, QUALITY_SECURITY_START_MARKER, QUALITY_SECURITY_END_MARKER);

        logOperationSuccess('Quality & security documented');
    } catch (error) {
        console.error('❌  Error documenting quality and security', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// Answers undefined where the coverage provider isn't installed, the Vitest config doesn't write a coverage summary, or
// there is no code to measure.
async function measureTestCoverage(packageJSON: PackageJson): Promise<number | undefined> {
    if (packageJSON.devDependencies?.['@vitest/coverage-v8'] == null) {
        logStepHeader("1️⃣  Test coverage NOT measured, as '@vitest/coverage-v8' is not installed");
        return undefined;
    }

    await spawnCommand('1️⃣  Measure test coverage', 'vitest', ['run', '--passWithNoTests', '--coverage']);
    const summary = await readTextFileOrNull(COVERAGE_SUMMARY_PATH);
    if (summary === null) return undefined;

    const coveragePercent = (JSON.parse(summary) as CoverageSummary).total.lines.pct;
    if (coveragePercent === 'Unknown') return undefined;
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
async function readSecuritySettings(owner: string, repository: string, packageJSON: PackageJson): Promise<SecuritySettings> {
    const [ciWorkflow, dependabotConfig, rustWorkspace] = await Promise.all([
        readTextFileOrNull('.github/workflows/ci.yml'),
        readTextFileOrNull('.github/dependabot.yml'),
        readTextFileOrNull(RUST_WORKSPACE_PATH)
    ]);
    const codeQLWorkflow = (await readTextFileOrNull('.github/workflows/codeql.yml')) ?? ''; // Empty when missing, so CodeQL reads as off.
    const [repositoryDetails, privateVulnerabilityReporting, vulnerabilityAlerts, checkAppSlugs] = await Promise.all([
        readGitHubAPI(`repos/${owner}/${repository}`),
        readGitHubAPI(`repos/${owner}/${repository}/private-vulnerability-reporting`),
        readGitHubAPI(`repos/${owner}/${repository}/vulnerability-alerts`),
        readGitHubCheckAppSlugs(owner, repository)
    ]);

    const securityAndAnalysis = repositoryDetails === undefined ? undefined : (JSON.parse(repositoryDetails) as GitHubRepositoryDetails).security_and_analysis;
    const readSetting = (name: string): SettingStatus => (securityAndAnalysis?.[name] === undefined ? undefined : securityAndAnalysis[name].status === 'enabled');

    // Version updates count as off when every ecosystem is limited to 0 pull requests, the documented way to pause them.
    const ecosystemCount = dependabotConfig?.match(/package-ecosystem:/g)?.length ?? 0;
    const pausedEcosystemCount = dependabotConfig?.match(/open-pull-requests-limit: 0\b/g)?.length ?? 0;

    return {
        codeQLLanguages: codeQLWorkflow
            .matchAll(/- language: ([\w-]+)/g)
            .filter(([, language]) => language !== 'rust' || rustWorkspace !== null) // The workflow lists Rust for every project, but skips its scan where there is none.
            .map(([, language = '']) => CODEQL_LANGUAGE_NAMES[language] ?? language)
            .toArray(),
        codeQLQueries: /queries: ([\w-]+)/.exec(codeQLWorkflow)?.[1],
        dependabotAlerts: vulnerabilityAlerts !== undefined, // Answers '204 No Content' when on and '404' when off.
        dependabotSecurityUpdates: readSetting('dependabot_security_updates'),
        dependabotVersionUpdates: ecosystemCount > pausedEcosystemCount,
        lintInCI: (ciWorkflow ?? '').includes('npm run lint'),
        npmAuditInCI: /npm (?:run )?audit/.test(ciWorkflow ?? ''),
        npmAuditLevel: /npm audit --audit-level=(\w+)/.exec(ciWorkflow ?? '')?.[1],
        privateVulnerabilityReporting: privateVulnerabilityReporting === undefined ? undefined : (JSON.parse(privateVulnerabilityReporting) as { enabled: boolean }).enabled,
        propertyTests: packageJSON.devDependencies?.['fast-check'] != null,
        pushProtection: readSetting('secret_scanning_push_protection'),
        secretScanning: readSetting('secret_scanning'),
        socket: checkAppSlugs.has('socket-security'),
        sonarCloud: checkAppSlugs.has('sonarqubecloud'),
        // The CI workflow runs the tests by calling 'testProject', and a project's own workflow may run 'npm test'.
        // Comment lines are passed over, as the workflow's notes mention 'npm test' without running it.
        testsInCI: /^(?!\s*#).*(?:npm test|testProject\()/m.test(ciWorkflow ?? '')
    };
}

// Answers undefined for a private package, which has no Scorecard workflow and no public repository for OpenSSF to
// assess, so its README has no OpenSSF section.
async function lookUpOpenSSFResults(owner: string, repository: string, packageJSON: PackageJson): Promise<OpenSSFResults | undefined> {
    if (packageJSON.private === true) {
        console.info('ℹ️  OpenSSF is NOT reported for a private project');
        return undefined;
    }

    const [bestPracticesProjectId, scorecardResult] = await Promise.all([
        lookUpBestPracticesProjectId(`https://github.com/${owner}/${repository}`),
        lookUpScorecardResult(`github.com/${owner}/${repository}`)
    ]);
    return { bestPracticesProjectId, scorecardResult };
}

// Found by repository URL, as OpenSSF Scorecard does, so a repository shows its badge as soon as it is registered and nothing
// needs configuring. Failures throw rather than return nothing, so a network blip can't drop the badge from the README.
async function lookUpBestPracticesProjectId(repositoryURL: string): Promise<number | undefined> {
    const response = await fetch(`https://www.bestpractices.dev/projects.json?url=${encodeURIComponent(repositoryURL)}`, { signal: AbortSignal.timeout(OPENSSF_REQUEST_TIMEOUT) });
    if (!response.ok) throw new Error(`OpenSSF Best Practices lookup failed with status ${String(response.status)}.`);

    // The search also matches home page URLs, so keep only the entry registered for this repository.
    const projects = (await response.json()) as BestPracticesProject[];
    return projects.find((project) => project.repo_url === repositoryURL)?.id;
}

// Answers undefined when Scorecard has no results for the repository yet. Other failures throw, as for the badge.
async function lookUpScorecardResult(scorecardURI: string): Promise<ScorecardResult | undefined> {
    const response = await fetch(`https://api.scorecard.dev/projects/${scorecardURI}`, { signal: AbortSignal.timeout(OPENSSF_REQUEST_TIMEOUT) });
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

// On when Dependabot opens either kind of update pull request. Unknown when version updates are off and GitHub does not
// reveal the security updates setting.
function dependencyUpdatesStatus({ dependabotSecurityUpdates, dependabotVersionUpdates }: SecuritySettings): SettingStatus {
    return dependabotVersionUpdates || dependabotSecurityUpdates === true ? true : dependabotSecurityUpdates;
}

// Names the kinds of update pull request Dependabot opens. Where it opens none, dependencies are updated by hand.
function describeDependencyUpdates({ dependabotSecurityUpdates, dependabotVersionUpdates }: SecuritySettings): string {
    if (dependabotVersionUpdates && dependabotSecurityUpdates === true) return 'opens pull requests for new dependency versions and for fixes to vulnerable ones.';
    if (dependabotVersionUpdates) return 'opens pull requests for new dependency versions.';
    if (dependabotSecurityUpdates === true) return 'opens pull requests that update vulnerable dependencies.';
    return 'can open pull requests for new and vulnerable dependency versions. Dependencies are updated by hand with `npm run check` instead.';
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

// Grouped by what each check protects against, and within a group in the order the checks act on a change: before a
// push, on every push, then continuously, and alphabetically within each. Linting is the exception and always leads
// Code Quality. Status is only ever on, off or unknown. What
// it does names and links the product doing the check. The checks' badges are on the README's opening line.
function buildChecksContent(owner: string, repository: string, { coveragePercent, fallowHealth, securitySettings: settings }: ChecksResults): string {
    const repositoryURL = `https://github.com/${owner}/${repository}`;

    const ciNote = (isInCI: boolean): string => (isInCI ? ` Part of the [CI workflow](${repositoryURL}/actions/workflows/ci.yml) on every push and pull request to \`main\`.` : '');

    const testingRows = [
        ['Unit tests', formatStatus(settings.testsInCI), `[Vitest](https://vitest.dev) runs the unit tests.${ciNote(settings.testsInCI)}`],
        [
            'Property-based tests',
            formatStatus(settings.propertyTests),
            `[fast-check](https://fast-check.dev) runs many random inputs per test to find edge cases, alongside the unit tests.${ciNote(settings.propertyTests && settings.testsInCI)}`
        ]
    ];
    if (coveragePercent !== undefined) {
        testingRows.push(['Test coverage', formatStatus(true), "[Vitest's V8 coverage](https://vitest.dev/guide/coverage) measures the share of source lines the unit tests run."]);
    }

    const codeQualityRows = [
        [
            'Linting',
            formatStatus(settings.lintInCI),
            `[ESLint](https://eslint.org) checks the code for errors and style problems, and the [TypeScript](https://www.typescriptlang.org/) compiler type-checks the whole project.${ciNote(settings.lintInCI)}`
        ],
        ['Code analysis', formatStatus(settings.sonarCloud), '[SonarCloud](https://sonarcloud.io) checks every push for bugs, code smells and vulnerabilities.']
    ];
    // Shown only when Fallow is installed.
    if (fallowHealth !== undefined) {
        codeQualityRows.splice(1, 0, [
            'Code health',
            formatStatus(true),
            `[Fallow](https://github.com/fallow-rs/fallow) finds unused code, duplication, complexity and dependency problems. See the [report](./${FALLOW_REPORT_PATH}).`
        ]);
    }

    const hasCodeQL = settings.codeQLLanguages.length > 0;
    const codeQLScope = settings.codeQLQueries === 'security-extended' ? 'using the extended security queries' : 'using the default queries';
    const codeQLLanguages = hasCodeQL ? ` ${settings.codeQLLanguages.join(' and ')}` : '';
    const securityAnalysisRows = [
        [
            'Push protection',
            formatStatus(settings.pushProtection),
            '[GitHub push protection](https://docs.github.com/en/code-security/secret-scanning/push-protection-for-repositories-and-organizations) blocks pushes that contain credentials.'
        ],
        [
            'Static analysis',
            formatStatus(hasCodeQL),
            `[GitHub CodeQL](https://codeql.github.com) scans${codeQLLanguages} for security vulnerabilities, ${codeQLScope}, on every push and pull request to \`main\` and weekly.`
        ],
        [
            'Secret scanning',
            formatStatus(settings.secretScanning),
            '[GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning) detects credentials, such as API keys and tokens, committed to the repository.'
        ]
    ];

    const dependabotLink = '[GitHub Dependabot](https://docs.github.com/en/code-security/dependabot)';
    const dependencyRows = [
        [
            'Vulnerability audit',
            formatStatus(settings.npmAuditInCI),
            settings.npmAuditLevel === undefined
                ? `[npm audit](https://docs.npmjs.com/cli/commands/npm-audit) fails when a shipped dependency has any known vulnerability, or a development dependency has a high or critical one.${ciNote(settings.npmAuditInCI)}`
                : `[npm audit](https://docs.npmjs.com/cli/commands/npm-audit) fails when a dependency has a known vulnerability of ${settings.npmAuditLevel} severity or above.${ciNote(settings.npmAuditInCI)}`
        ],
        [
            'Supply chain risk',
            formatStatus(settings.socket), // Socket's badge service refuses requests from outside a browser, so GitHub couldn't show it.
            '[Socket.dev](https://socket.dev) flags malicious packages, typosquatting and suspicious behaviour that may not yet have a CVE.'
        ],
        ['Security alerts', formatStatus(settings.dependabotAlerts), `${dependabotLink} alerts when a dependency has a known vulnerability, using the GitHub Advisory Database.`],
        ['Dependency updates', formatStatus(dependencyUpdatesStatus(settings)), `${dependabotLink} ${describeDependencyUpdates(settings)}`]
    ];

    return `This section is updated each time \`npm run document\` is run. Settings come from the repository's workflow files and GitHub. Test coverage and the Fallow score are measured at the same time.

${buildTableContent('Testing', testingRows)}${buildTableContent('Code Quality', codeQualityRows)}${buildTableContent('Security Analysis', securityAnalysisRows)}${buildTableContent('Dependencies', dependencyRows)}`;
}

function buildQualitySecurityContent(owner: string, repository: string, checksResults: ChecksResults, openSSFResults: OpenSSFResults | undefined): string {
    const repositoryURL = `https://github.com/${owner}/${repository}`;

    // Without private reporting switched on, the advisory link leads nowhere, so point only at SECURITY.md.
    const reportingText =
        checksResults.securitySettings.privateVulnerabilityReporting === true
            ? `Use [GitHub private vulnerability reporting](${repositoryURL}/security/advisories/new) instead. See [SECURITY.md](./SECURITY.md) for the full disclosure policy, contact details, and expected response times.`
            : 'See [SECURITY.md](./SECURITY.md) for how to report one privately, the full disclosure policy, and expected response times.';

    return `## Quality & Security

${buildChecksContent(owner, repository, checksResults)}${openSSFResults === undefined ? '' : buildOpenSSFContent(owner, repository, openSSFResults)}### Reporting Vulnerabilities

Please do not open public GitHub issues for security vulnerabilities. ${reportingText}`;
}

function buildOpenSSFContent(owner: string, repository: string, { bestPracticesProjectId, scorecardResult }: OpenSSFResults): string {
    const scorecardURI = `github.com/${owner}/${repository}`;
    const bestPracticesURL = `https://www.bestpractices.dev/projects/${String(bestPracticesProjectId)}`;
    // The note points at the Best Practices badge only where the project has one to show.
    const bestPracticesReasonText =
        bestPracticesProjectId === undefined ? 'The project does not have the OpenSSF Best Practices badge yet' : 'The OpenSSF Best Practices badge above is not complete yet';
    const scorecardLimitText =
        scorecardResult !== undefined && isScorecardOnlyPracticeLimited(scorecardResult)
            ? `\n\n> [!NOTE]\n> The Scorecard score is below the maximum for two reasons. ${bestPracticesReasonText}, and some checks need a second reviewer, which a solo-maintained project cannot provide, or a pull-request workflow, which this project does not use.`
            : '';
    const bestPracticesBadge = bestPracticesProjectId === undefined ? '' : `[![OpenSSF Best Practices](${bestPracticesURL}/badge)](${bestPracticesURL})\n`;

    return `### OpenSSF 🚧

${bestPracticesBadge}[![OpenSSF Scorecard](https://api.scorecard.dev/projects/${scorecardURI}/badge)](https://scorecard.dev/viewer/?uri=${scorecardURI})

This project is working towards the [OpenSSF Best Practices](https://www.bestpractices.dev) Passing badge, a self-certification covering security policy, vulnerability reporting, build processes, code quality, and more. Currently the [OpenSSF Scorecard](https://scorecard.dev) provides an independent automated assessment of the project's security practices and is an ongoing area of improvement.${scorecardLimitText}

`;
}
