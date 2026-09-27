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

interface GovernanceModuleConfig {
    firstCreatedAt?: number | null;
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

const START_MARKER = '<!-- GOVERNANCE_START -->';
const END_MARKER = '<!-- GOVERNANCE_END -->';

// Scorecard checks a solo maintainer pushing straight to 'main' can't raise, with the best score each can reach that way.
const SCORECARD_PRACTICE_LIMITS: Record<string, number> = { 'Branch-Protection': 3, 'Code-Review': 0, Contributors: 0 };
// Left out when deciding whether gaps remain: the Best Practices badge shows its own progress in the same section.
const SCORECARD_IGNORED_CHECKS = new Set(['CII-Best-Practices']);

// Coverage — only measured where the module has the Vitest coverage provider installed. 'coverage-final.json' feeds
// Fallow's per-function scores; the summary holds the totals the Testing table reports.
const COVERAGE_FINAL_PATH = 'coverage/coverage-final.json';
const COVERAGE_SUMMARY_PATH = 'coverage/coverage-summary.json';
const COVERAGE_TARGET_PERCENT = 80;

const CODEQL_LANGUAGE_NAMES: Record<string, string> = { actions: 'GitHub Actions', 'javascript-typescript': 'JavaScript/TypeScript', rust: 'Rust' };

// Fallow — only run where the module has it installed. The full report is published as its own page, linked from the
// README; the Code Quality row and the badge are both built from the one health run, so they always agree.
const FALLOW_GRADE_COLOURS: Record<string, string> = { A: 'brightgreen', B: 'green', C: 'yellow', D: 'orange', F: 'red' };
const FALLOW_HEALTH_PATH = `${FALLOW_DIRECTORY}/health.json`;

// ── Initialisation ───────────────────────────────────────────────────────────────────────────────────────────────────

const asyncExecFile = promisify(execFile);

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentGovernance(): Promise<void> {
    try {
        logOperationHeader('Document Governance');

        const [packageJSON, configJSON] = await Promise.all([readJSONFile<PackageJson>('package.json'), readJSONFile<GovernanceModuleConfig>('config.json')]);

        const coveragePercent = await measureTestCoverage(packageJSON);
        const fallowHealth = await measureCodeHealth(packageJSON, coveragePercent === undefined ? [] : ['--coverage', COVERAGE_FINAL_PATH]);

        const { owner, repo } = resolveOwnerAndRepo(packageJSON, 'document governance');

        logStepHeader('4️⃣  Read security checks and settings');
        const securitySettings = await readSecuritySettings(owner, repo, packageJSON);

        logStepHeader('5️⃣  Look up OpenSSF Best Practices badge and Scorecard results');
        const [bestPracticesProjectId, scorecardResult] = await Promise.all([
            lookUpBestPracticesProjectId(`https://github.com/${owner}/${repo}`),
            lookUpScorecardResult(`github.com/${owner}/${repo}`)
        ]);

        logStepHeader("6️⃣  Insert governance content into 'README.md'");

        const authorName = resolveAuthorName(packageJSON);
        const copyrightYear = resolveCopyrightYear(configJSON.firstCreatedAt);

        const content = buildGovernanceContent(
            owner,
            repo,
            authorName,
            copyrightYear,
            { coveragePercent, fallowHealth, securitySettings },
            bestPracticesProjectId,
            scorecardResult
        );

        await writeReadmeSection(content, START_MARKER, END_MARKER);

        logOperationSuccess('Governance documented');
    } catch (error) {
        console.error('❌  Error documenting governance', error);
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
    return summary === null ? undefined : (JSON.parse(summary) as CoverageSummary).total.lines.pct;
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

// Written in the shields.io endpoint format, so the opening badge shows the latest pushed grade without the opening
// section having to be regenerated after this measurement.
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

function resolveAuthorName(packageJSON: PackageJson): string {
    const author = packageJSON.author;
    const authorString = typeof author === 'string' ? author : author?.name;
    if (authorString == null || authorString === '') throw new Error("package.json 'author' field is required to document governance.");

    // Drop the first '<email>' and the spaces around it, keeping one space between what came before and after it, as in
    // npm's 'Name <email> (url)' form. Not a regex, as '\s*<' backtracks on long runs of spaces.
    const emailStart = authorString.indexOf('<');
    const emailEnd = emailStart === -1 ? -1 : authorString.indexOf('>', emailStart);
    return emailEnd === -1 ? authorString.trim() : [authorString.slice(0, emailStart).trim(), authorString.slice(emailEnd + 1).trim()].filter((part) => part !== '').join(' ');
}

function resolveCopyrightYear(firstCreatedAt: number | null | undefined): string {
    const currentYear = new Date().getFullYear();
    if (firstCreatedAt == null) return String(currentYear);

    const startYear = new Date(firstCreatedAt).getFullYear();
    return startYear === currentYear ? String(currentYear) : `${String(startYear)}-present`;
}

function formatStatus(status: SettingStatus, onText = 'On'): string {
    if (status === undefined) return '❔ Unknown';
    return status ? `✅ ${onText}` : '❌ Off';
}

function buildTableContent(heading: string, rows: string[][]): string {
    if (rows.length === 0) return '';
    return `### ${heading}

|Check or setting|Status|What it does|
|:-|:-|:-|
${rows.map((row) => `|${row.join('|')}|`).join('\n')}

`;
}

// Grouped by what each check protects against, not by who provides it. Every table has the same three columns.
function buildChecksContent(owner: string, repo: string, { coveragePercent, fallowHealth, securitySettings: settings }: ChecksResults): string {
    const repoURL = `https://github.com/${owner}/${repo}`;

    const codeQualityRows = [
        [
            `[SonarCloud](https://sonarcloud.io/summary/new_code?id=${owner}_${repo})`,
            formatStatus(settings.sonarCloud),
            'Code quality and security analysis on every push: bugs, code smells and vulnerabilities.'
        ]
    ];
    if (fallowHealth !== undefined) {
        const { score, grade } = fallowHealth.health_score;
        codeQualityRows.unshift([
            `[Fallow](./${FALLOW_REPORT_PATH})`,
            `✅ ${grade} (${String(Math.round(score))})`,
            'Unused code, duplication, complexity and dependency hygiene.'
        ]);
    }

    const codeQLScope = settings.codeQLQueries === 'security-extended' ? 'using the extended security queries' : 'using the default queries';
    const securityAnalysisRows = [
        [
            `[CodeQL](${repoURL}/security/code-scanning)`,
            formatStatus(settings.codeQLLanguages.length > 0, settings.codeQLLanguages.join(', ')),
            `Static analysis for security vulnerabilities, ${codeQLScope}, on every push and pull request to \`main\` and weekly.`
        ],
        ['Secret scanning', formatStatus(settings.secretScanning), 'Detects credentials, such as API keys and tokens, committed to the repository.'],
        ['Push protection', formatStatus(settings.pushProtection), 'Blocks pushes that contain credentials.']
    ];

    const testingRows = [
        ['Unit tests', formatStatus(settings.testsInCI), 'Run in CI on every push to `main`.'],
        ['Property-based tests', formatStatus(settings.propertyTests, 'fast-check'), 'Fuzz testing: many random inputs per test to find edge cases, run with the unit tests.']
    ];
    if (coveragePercent !== undefined) {
        const coverageIcon = coveragePercent >= COVERAGE_TARGET_PERCENT ? '✅' : '⚠️';
        testingRows.push([
            'Test coverage',
            `${coverageIcon} ${coveragePercent.toFixed(1)}% of lines`,
            `Share of source lines the unit tests run. The target is ${String(COVERAGE_TARGET_PERCENT)}%.`
        ]);
    }

    const dependencyRows = [
        [
            'npm audit',
            formatStatus(settings.npmAuditInCI),
            settings.npmAuditLevel === undefined
                ? 'Fails CI when any dependency has a known vulnerability.'
                : `Fails CI when a dependency has a known vulnerability of ${settings.npmAuditLevel} severity or above.`
        ],
        [
            '[Socket.dev](https://socket.dev)',
            formatStatus(settings.socket),
            'Flags supply chain risk in dependencies: malicious packages, typosquatting and suspicious behaviour that may not yet have a CVE.'
        ],
        ['Dependabot alerts', formatStatus(settings.dependabotAlerts), 'Alerts when a dependency has a known vulnerability, using the GitHub Advisory Database.'],
        ['Dependabot security updates', formatStatus(settings.dependabotSecurityUpdates), 'Opens pull requests that update vulnerable dependencies.'],
        ['Dependabot version updates', formatStatus(settings.dependabotVersionUpdates), 'Opens pull requests for new dependency versions.']
    ];

    return `This section is updated each time \`npm run document\` is run. Settings come from the repository's workflow files and GitHub, and test coverage and the Fallow score are measured at the same time.

${buildTableContent('Testing', testingRows)}${buildTableContent('Code Quality', codeQualityRows)}${buildTableContent('Security Analysis', securityAnalysisRows)}${buildTableContent('Dependencies', dependencyRows)}`;
}

function buildGovernanceContent(
    owner: string,
    repo: string,
    authorName: string,
    copyrightYear: string,
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

Please do not open public GitHub issues for security vulnerabilities. ${reportingText}

## Contributing

This repository is maintained solely by its owner and does not, at present, accept external contributions into the canonical repo. Its source is published openly under the MIT License — every DPUse project is fully open source except DPUse Engine, which remains closed and proprietary.

For security vulnerabilities, see [Reporting Vulnerabilities](#reporting-vulnerabilities). For bugs, inconsistencies, or other feedback, [open a GitHub issue](${repoURL}/issues) — feedback is read, but responses and fixes are at the maintainer's discretion.

## License

This project is licensed under the MIT License, permitting free use, modification, and distribution.

[MIT](./LICENSE) © ${copyrightYear} ${authorName}`;
}
