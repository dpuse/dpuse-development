// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── Local (Development) Framework
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, resolveOwnerAndRepo, spawnCommandToFile, writeReadmeSection } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface FallowHealth {
    health_score: { score: number; grade: string };
    summary: { functions_above_threshold: number; functions_analyzed: number; average_maintainability: number };
    vital_signs: { dead_file_pct: number; dead_export_pct: number; duplication_pct: number; unused_dep_count: number; circular_dep_count: number; hotspot_count: number };
}

interface GovernanceModuleConfig {
    firstCreatedAt?: number | null;
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const START_MARKER = '<!-- GOVERNANCE_START -->';
const END_MARKER = '<!-- GOVERNANCE_END -->';

// Fallow — only run where the module has it installed. The full report is published as its own page, linked from the
// README; the README table and badge are both built from the one health run, so they always agree.
const FALLOW_DIRECTORY = 'code-health-reports/fallow';
const FALLOW_GRADE_COLOURS: Record<string, string> = { A: 'brightgreen', B: 'green', C: 'yellow', D: 'orange', F: 'red' };
const FALLOW_HEALTH_PATH = `${FALLOW_DIRECTORY}/health.json`;
const FALLOW_REPORT_PATH = `${FALLOW_DIRECTORY}/index.md`;

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentGovernance(): Promise<void> {
    try {
        logOperationHeader('Document Governance');

        const [packageJSON, configJSON] = await Promise.all([readJSONFile<PackageJson>('package.json'), readJSONFile<GovernanceModuleConfig>('config.json')]);

        const fallowHealth = await measureCodeHealth(packageJSON);

        logStepHeader("3️⃣  Insert governance content into 'README.md'");

        const { owner, repo } = resolveOwnerAndRepo(packageJSON, 'document governance');
        const authorName = resolveAuthorName(packageJSON);
        const copyrightYear = resolveCopyrightYear(configJSON.firstCreatedAt);

        const content = buildGovernanceContent(owner, repo, authorName, copyrightYear, fallowHealth);

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
    const badgeMessage = encodeURIComponent(`${grade} (${String(Math.round(score))})`).replaceAll('-', '--').replaceAll('(', '%28').replaceAll(')', '%29');
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

function buildGovernanceContent(owner: string, repo: string, authorName: string, copyrightYear: string, fallowHealth: FallowHealth | undefined): string {
    const repoURL = `https://github.com/${owner}/${repo}`;
    const scorecardURI = `github.com/${owner}/${repo}`;

    return `## Security & Quality

### CodeQL

[CodeQL](${repoURL}/security/code-scanning) static analysis runs on every push to \`main\` and on a weekly schedule, scanning TypeScript, JavaScript, Rust, and GitHub Actions workflow files for security vulnerabilities and coding errors.

### SonarCloud

[SonarCloud](https://sonarcloud.io/summary/new_code?id=${owner}_${repo}) performs continuous code quality and security analysis on every push, detecting bugs, code smells, and security vulnerabilities in the TypeScript source.

${fallowHealth === undefined ? '' : buildCodeHealthContent(fallowHealth)}### Vulnerability Scanning

Two complementary tools continuously monitor dependencies for known vulnerabilities:

- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) runs on every push to \`main\` via the CI workflow, failing the build if any high or critical severity vulnerabilities are detected.
- [GitHub Dependabot](https://docs.github.com/en/code-security/dependabot) automatically raises pull requests to update vulnerable dependencies, drawing on the GitHub Advisory Database which combines NVD and npm-specific advisories.

### Supply Chain Security

[Socket.dev](https://socket.dev) monitors all dependencies for supply chain risk — detecting malicious packages, dependency confusion, typosquatting, and suspicious behaviour that may not yet have a CVE.

### Reporting Vulnerabilities

Please do not open public GitHub issues for security vulnerabilities. Use [GitHub private vulnerability reporting](${repoURL}/security/advisories/new) instead. See [SECURITY.md](./SECURITY.md) for the full disclosure policy, contact details, and expected response times.

### OpenSSF 🚧

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/${scorecardURI}/badge)](https://scorecard.dev/viewer/?uri=${scorecardURI})

This project is working towards the [OpenSSF Best Practices](https://www.bestpractices.dev) Passing badge, a self-certification covering security policy, vulnerability reporting, build processes, code quality, and more. Currently the [OpenSSF Scorecard](https://scorecard.dev/viewer/?uri=${scorecardURI}) provides an independent automated assessment of the project's security practices and is an ongoing area of improvement.

## Contributing

This repository is maintained solely by its owner and does not, at present, accept external contributions into the canonical repo. Its source is published openly under the MIT License — every DPUse project is fully open source except DPUse Engine, which remains closed and proprietary.

For security vulnerabilities, see [Reporting Vulnerabilities](#reporting-vulnerabilities). For bugs, inconsistencies, or other feedback, [open a GitHub issue](${repoURL}/issues) — feedback is read, but responses and fixes are at the maintainer's discretion.

## License

This project is licensed under the MIT License, permitting free use, modification, and distribution.

[MIT](./LICENSE) © ${copyrightYear}-present ${authorName}`;
}
