// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── Local (Development) Framework
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile, substituteText, writeTextFile } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface GovernanceModuleConfig {
    firstCreatedAt?: number | null;
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const START_MARKER = '<!-- GOVERNANCE_START -->';
const END_MARKER = '<!-- GOVERNANCE_END -->';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentGovernance(): Promise<void> {
    try {
        logOperationHeader('Document Governance');

        logStepHeader("1️⃣  Insert governance content into 'README.md'");

        const [packageJSON, configJSON] = await Promise.all([readJSONFile<PackageJson>('package.json'), readJSONFile<GovernanceModuleConfig>('config.json')]);

        const { owner, repo } = resolveOwnerAndRepo(packageJSON);
        const authorName = resolveAuthorName(packageJSON);
        const copyrightYear = resolveCopyrightYear(configJSON.firstCreatedAt);

        const content = buildGovernanceContent(owner, repo, authorName, copyrightYear);

        const originalContent = await readTextFile('./README.md');
        const updatedContent = substituteText(originalContent, content, START_MARKER, END_MARKER);
        await writeTextFile('README.md', updatedContent);

        logOperationSuccess('Governance documented');
    } catch (error) {
        console.error('❌  Error documenting governance', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

function resolveOwnerAndRepo(packageJSON: PackageJson): { owner: string; repo: string } {
    const repo = packageJSON.repository;
    const url = typeof repo === 'string' ? repo : repo?.url;
    if (url == null || url === '') throw new Error("package.json 'repository' field is required to document governance.");

    const cleanedURL = url.replace(/^git\+/, '').replace(/\.git$/, '');
    const match = /github\.com[/:]([^/]+)\/([^/]+)$/.exec(cleanedURL);
    if (match?.[1] == null || match[2] == null) throw new Error(`Unable to parse GitHub owner/repo from '${url}'.`);

    return { owner: match[1], repo: match[2] };
}

function resolveAuthorName(packageJSON: PackageJson): string {
    const author = packageJSON.author;
    const authorString = typeof author === 'string' ? author : author?.name;
    if (authorString == null || authorString === '') throw new Error("package.json 'author' field is required to document governance.");

    return authorString.replace(/\s*<[^>]*>\s*/, '').trim();
}

function resolveCopyrightYear(firstCreatedAt: number | null | undefined): string {
    const currentYear = new Date().getFullYear();
    if (firstCreatedAt == null) return String(currentYear);

    const startYear = new Date(firstCreatedAt).getFullYear();
    return startYear === currentYear ? String(currentYear) : `${String(startYear)}-present`;
}

function buildGovernanceContent(owner: string, repo: string, authorName: string, copyrightYear: string): string {
    const repoURL = `https://github.com/${owner}/${repo}`;
    const scorecardURI = `github.com/${owner}/${repo}`;

    return `## Security & Quality

### CodeQL

[CodeQL](${repoURL}/security/code-scanning) static analysis runs on every push to \`main\` and on a weekly schedule, scanning TypeScript, JavaScript, Rust, and GitHub Actions workflow files for security vulnerabilities and coding errors.

### SonarCloud

[SonarCloud](https://sonarcloud.io/summary/new_code?id=${owner}_${repo}) performs continuous code quality and security analysis on every push, detecting bugs, code smells, and security vulnerabilities in the TypeScript source.

### Vulnerability Scanning

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
