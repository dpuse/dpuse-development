// ── External Dependencies & Registrations
import { execFile } from 'node:child_process';
import type { PackageJson } from 'type-fest';
import { promisify } from 'node:util';

// ── Local (Development) Framework
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFileOrNull, resolveOwnerAndRepo, spawnCommandToFile, writeReadmeSection } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface BestPracticesProject {
    id: number;
    repo_url: string;
}

interface FallowHealth {
    health_score: { score: number; grade: string };
    summary: { functions_above_threshold: number; functions_analyzed: number; average_maintainability: number };
    vital_signs: { dead_file_pct: number; dead_export_pct: number; duplication_pct: number; unused_dep_count: number; circular_dep_count: number; hotspot_count: number };
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

// On or off, or undefined where GitHub doesn't reveal the setting (some need an admin login to read).
type SettingStatus = boolean | undefined;

interface SecuritySettings {
    codeQLLanguages: string[];
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

const CODEQL_LANGUAGE_NAMES: Record<string, string> = { actions: 'GitHub Actions', 'javascript-typescript': 'JavaScript/TypeScript', rust: 'Rust' };

// Fallow — only run where the module has it installed. The full report is published as its own page, linked from the
// README; the README table and badge are both built from the one health run, so they always agree.
const FALLOW_DIRECTORY = 'code-health-reports/fallow';
const FALLOW_GRADE_COLOURS: Record<string, string> = { A: 'brightgreen', B: 'green', C: 'yellow', D: 'orange', F: 'red' };
const FALLOW_HEALTH_PATH = `${FALLOW_DIRECTORY}/health.json`;
const FALLOW_REPORT_PATH = `${FALLOW_DIRECTORY}/index.md`;

// ── Initialisation ───────────────────────────────────────────────────────────────────────────────────────────────────

const asyncExecFile = promisify(execFile);

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentGovernance(): Promise<void> {
    try {
        logOperationHeader('Document Governance');

        const [packageJSON, configJSON] = await Promise.all([readJSONFile<PackageJson>('package.json'), readJSONFile<GovernanceModuleConfig>('config.json')]);

        const fallowHealth = await measureCodeHealth(packageJSON);

        const { owner, repo } = resolveOwnerAndRepo(packageJSON, 'document governance');

        logStepHeader('3️⃣  Read security checks and settings');
        const securitySettings = await readSecuritySettings(owner, repo, packageJSON);

        logStepHeader('4️⃣  Look up OpenSSF Best Practices badge and Scorecard results');
        const [bestPracticesProjectId, scorecardResult] = await Promise.all([
            lookUpBestPracticesProjectId(`https://github.com/${owner}/${repo}`),
            lookUpScorecardResult(`github.com/${owner}/${repo}`)
        ]);

        logStepHeader("5️⃣  Insert governance content into 'README.md'");

        const authorName = resolveAuthorName(packageJSON);
        const copyrightYear = resolveCopyrightYear(configJSON.firstCreatedAt);

        const content = buildGovernanceContent(owner, repo, authorName, copyrightYear, fallowHealth, bestPracticesProjectId, securitySettings, scorecardResult);

        await writeReadmeSection(content, START_MARKER, END_MARKER);

        logOperationSuccess('Governance documented');
    } catch (error) {
        console.error('❌  Error documenting governance', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// Fallow exits non-zero whenever it has findings, so its exit code is ignored: the findings are what gets reported.
async function measureCodeHealth(packageJSON: PackageJson): Promise<FallowHealth | undefined> {
    if (packageJSON.devDependencies?.['fallow'] == null) {
        logStepHeader('1️⃣  Code health NOT measured, as Fallow is not installed');
        logStepHeader('2️⃣  Code health report NOT required');
        return undefined;
    }

    await spawnCommandToFile('1️⃣  Measure code health', 'fallow', ['health', '--report-only', '--format', 'json'], FALLOW_HEALTH_PATH);
    await spawnCommandToFile('2️⃣  Write code health report', 'fallow', ['--format', 'markdown'], FALLOW_REPORT_PATH, true);
    return await readJSONFile<FallowHealth>(FALLOW_HEALTH_PATH);
}

function buildCodeHealthContent(health: FallowHealth): string {
    const { score, grade } = health.health_score;
    const { functions_above_threshold: complexCount, functions_analyzed: functionCount, average_maintainability: maintainability } = health.summary;
    const signs = health.vital_signs;
    const badgeMessage = encodeURIComponent(`${grade} (${String(Math.round(score))})`)
        .replaceAll('-', '--')
        .replaceAll('(', '%28')
        .replaceAll(')', '%29');
    const badgeURL = `https://img.shields.io/badge/fallow-${badgeMessage}-${FALLOW_GRADE_COLOURS[grade] ?? 'lightgrey'}`;

    return `### Code Health

[![Fallow code health](${badgeURL})](./${FALLOW_REPORT_PATH})

[Fallow](https://github.com/fallow-rs/fallow) analyses the TypeScript source on each release for unused code, duplication, complexity, and dependency hygiene. See the [full Fallow report](./${FALLOW_REPORT_PATH}) for every finding.

|Measure|Value|
|:-|-:|
|Health score|${score.toFixed(1)} (${grade})|
|Maintainability (average)|${maintainability.toFixed(1)}|
|Unused files|${signs.dead_file_pct.toFixed(1)}%|
|Unused exports|${signs.dead_export_pct.toFixed(1)}%|
|Duplicated code|${signs.duplication_pct.toFixed(1)}%|
|Functions over the complexity limits|${String(complexCount)} of ${String(functionCount)}|
|Unused dependencies|${String(signs.unused_dep_count)}|
|Circular dependencies|${String(signs.circular_dep_count)}|
|Hotspots (complex and often changed)|${String(signs.hotspot_count)}|

`;
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

    // Drop the first '<email>' and the spaces around it. Not a regex, as '\s*<' backtracks on long runs of spaces.
    const emailStart = authorString.indexOf('<');
    const emailEnd = emailStart === -1 ? -1 : authorString.indexOf('>', emailStart);
    const nameString = emailEnd === -1 ? authorString : authorString.slice(0, emailStart).trimEnd() + authorString.slice(emailEnd + 1).trimStart();

    return nameString.trim();
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

function buildSecurityTableContent(owner: string, repo: string, settings: SecuritySettings): string {
    const repoURL = `https://github.com/${owner}/${repo}`;
    const codeQLStatus = formatStatus(settings.codeQLLanguages.length > 0, settings.codeQLLanguages.join(', '));
    const rows = [
        [
            `[CodeQL](${repoURL}/security/code-scanning)`,
            codeQLStatus,
            'Static analysis for security vulnerabilities and coding errors, on every push and pull request to `main` and weekly.'
        ],
        [
            `[SonarCloud](https://sonarcloud.io/summary/new_code?id=${owner}_${repo})`,
            formatStatus(settings.sonarCloud),
            'Code quality and security analysis on every push: bugs, code smells and vulnerabilities.'
        ],
        ['Unit tests', formatStatus(settings.testsInCI), 'Run in CI on every push to `main`.'],
        ['Property-based tests', formatStatus(settings.propertyTests, 'fast-check'), 'Fuzz testing: many random inputs per test to find edge cases, run with the unit tests.'],
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
        ['Dependabot version updates', formatStatus(settings.dependabotVersionUpdates), 'Opens pull requests for new dependency versions.'],
        ['Secret scanning', formatStatus(settings.secretScanning), 'Detects credentials, such as API keys and tokens, committed to the repository.'],
        ['Push protection', formatStatus(settings.pushProtection), 'Blocks pushes that contain credentials.'],
        [
            'Private vulnerability reporting',
            formatStatus(settings.privateVulnerabilityReporting),
            'Lets anyone report a vulnerability privately. See [Reporting Vulnerabilities](#reporting-vulnerabilities).'
        ]
    ];

    return `### Checks & Settings

Read from the repository each time this README is generated, so the status is current as of the latest release.

|Check or setting|Status|What it does|
|:-|:-|:-|
${rows.map((row) => `|${row.join('|')}|`).join('\n')}

`;
}

function buildGovernanceContent(
    owner: string,
    repo: string,
    authorName: string,
    copyrightYear: string,
    fallowHealth: FallowHealth | undefined,
    bestPracticesProjectId: number | undefined,
    securitySettings: SecuritySettings,
    scorecardResult: ScorecardResult | undefined
): string {
    const repoURL = `https://github.com/${owner}/${repo}`;
    const scorecardURI = `github.com/${owner}/${repo}`;
    const bestPracticesURL = `https://www.bestpractices.dev/projects/${String(bestPracticesProjectId)}`;
    const scorecardLimitText =
        scorecardResult !== undefined && isScorecardOnlyPracticeLimited(scorecardResult)
            ? " Apart from the Best Practices badge above, the remaining Scorecard gaps need multi-person review or a pull-request workflow, which this solo-maintained project doesn't use."
            : '';
    const bestPracticesBadge = bestPracticesProjectId === undefined ? '' : `[![OpenSSF Best Practices](${bestPracticesURL}/badge)](${bestPracticesURL})\n`;

    // Without private reporting switched on, the advisory link leads nowhere, so point only at SECURITY.md.
    const reportingText =
        securitySettings.privateVulnerabilityReporting === true
            ? `Use [GitHub private vulnerability reporting](${repoURL}/security/advisories/new) instead. See [SECURITY.md](./SECURITY.md) for the full disclosure policy, contact details, and expected response times.`
            : 'See [SECURITY.md](./SECURITY.md) for how to report one privately, the full disclosure policy, and expected response times.';

    return `## Security & Quality

${buildSecurityTableContent(owner, repo, securitySettings)}${fallowHealth === undefined ? '' : buildCodeHealthContent(fallowHealth)}### Reporting Vulnerabilities

Please do not open public GitHub issues for security vulnerabilities. ${reportingText}

### OpenSSF 🚧

${bestPracticesBadge}[![OpenSSF Scorecard](https://api.scorecard.dev/projects/${scorecardURI}/badge)](https://scorecard.dev/viewer/?uri=${scorecardURI})

This project is working towards the [OpenSSF Best Practices](https://www.bestpractices.dev) Passing badge, a self-certification covering security policy, vulnerability reporting, build processes, code quality, and more. Currently the [OpenSSF Scorecard](https://scorecard.dev) provides an independent automated assessment of the project's security practices and is an ongoing area of improvement.${scorecardLimitText}

## Contributing

This repository is maintained solely by its owner and does not, at present, accept external contributions into the canonical repo. Its source is published openly under the MIT License — every DPUse project is fully open source except DPUse Engine, which remains closed and proprietary.

For security vulnerabilities, see [Reporting Vulnerabilities](#reporting-vulnerabilities). For bugs, inconsistencies, or other feedback, [open a GitHub issue](${repoURL}/issues) — feedback is read, but responses and fixes are at the maintainer's discretion.

## License

This project is licensed under the MIT License, permitting free use, modification, and distribution.

[MIT](./LICENSE) © ${copyrightYear} ${authorName}`;
}
