/* eslint-disable security/detect-non-literal-fs-filename -- Tests only name files inside their own temporary folder. */

// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { documentQualitySecurity } from '@/actions/documentQualitySecurity';
import { buildReadme, useTemporaryProject } from '../support/temporaryProject';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// GitHub API answers, keyed by endpoint. A missing endpoint answers as GitHub does for a switched-off feature: a 404.
const gitHub = vi.hoisted((): { responses: Record<string, string | Error> } => ({ responses: {} }));
vi.mock('node:child_process', async (importOriginal) => {
    const original = await importOriginal<typeof import('node:child_process')>();
    const execFile = Object.assign(vi.fn(), {
        [Symbol.for('nodejs.util.promisify.custom')]: (_command: string, [, endpoint = '']: string[]) => {
            const response = gitHub.responses[endpoint] ?? Object.assign(new Error('Command failed'), { stderr: 'gh: Not Found (HTTP 404)' });
            return response instanceof Error ? Promise.reject(response) : Promise.resolve({ stdout: response, stderr: '' });
        }
    });
    return { ...original, execFile };
});

// The coverage run and Fallow write the reports the README is built from, so the mocks write fixtures instead.
const reports = vi.hoisted((): { coverageSummary: object | undefined; fallowHealth: object } => ({ coverageSummary: undefined, fallowHealth: {} }));
vi.mock('@/utilities', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    spawnCommand: vi.fn(async () => {
        if (reports.coverageSummary === undefined) return;
        await fs.mkdir('coverage', { recursive: true });
        await fs.writeFile('coverage/coverage-summary.json', JSON.stringify(reports.coverageSummary), 'utf-8');
    }),
    spawnCommandToFile: vi.fn(async (_label: string, _command: string, arguments_: string[], outputPath: string) => {
        await fs.mkdir('code-health-reports/fallow', { recursive: true });
        await fs.writeFile(outputPath, arguments_[0] === 'health' ? JSON.stringify(reports.fallowHealth) : '# Fallow report', 'utf-8');
    })
}));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

const REPO = 'repos/dpuse/dpuse-shared';

const CI_WORKFLOW = 'steps:\n  - run: npm run lint\n  - run: npm test\n  - run: npm run audit\n';
const CODEQL_WORKFLOW = 'matrix:\n  include:\n    - language: actions\n    - language: javascript-typescript\n    - language: swift\nqueries: security-extended\n';
const DEPENDABOT_PAUSED = 'updates:\n  - package-ecosystem: npm\n    open-pull-requests-limit: 0\n';

function stubGitHub(overrides: Record<string, string | Error | undefined> = {}): void {
    const responses: Record<string, string | Error | undefined> = {
        [REPO]: JSON.stringify({
            security_and_analysis: {
                dependabot_security_updates: { status: 'disabled' },
                secret_scanning: { status: 'enabled' },
                secret_scanning_push_protection: { status: 'enabled' }
            }
        }),
        [`${REPO}/private-vulnerability-reporting`]: JSON.stringify({ enabled: true }),
        [`${REPO}/vulnerability-alerts`]: '',
        [`${REPO}/commits/main/check-runs?per_page=100`]: JSON.stringify({
            check_runs: [{ app: { slug: 'socket-security' } }, { app: { slug: 'sonarqubecloud' } }, { app: null }]
        }),
        ...overrides
    };
    gitHub.responses = Object.fromEntries(Object.entries(responses).filter((entry): entry is [string, string | Error] => entry[1] !== undefined));
}

function stubOpenSSF({
    bestPractices = [{ id: 14_952, repo_url: 'https://github.com/dpuse/dpuse-shared' }] as object[],
    scorecard = undefined as object | undefined,
    failing = ''
} = {}): void {
    vi.stubGlobal(
        'fetch',
        vi.fn((url: string) => {
            if (url.startsWith(failing || '-')) return Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) });
            if (url.startsWith('https://www.bestpractices.dev')) return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(bestPractices) });
            return Promise.resolve(
                scorecard === undefined ? { ok: false, status: 404, json: () => Promise.resolve({}) } : { ok: true, status: 200, json: () => Promise.resolve(scorecard) }
            );
        })
    );
}

async function writeProject(packageJSON: object = {}, files: Record<string, string> = {}): Promise<void> {
    await project.writeFiles({
        'config.json': JSON.stringify({ id: 'dpuse-shared' }),
        'package.json': JSON.stringify({
            repository: { type: 'git', url: 'git+https://github.com/dpuse/dpuse-shared.git' },
            devDependencies: { '@vitest/coverage-v8': '^5.0.2', fallow: '^3.30.0', 'fast-check': '^4.10.2' },
            ...packageJSON
        }),
        'README.md': buildReadme('GOVERNANCE'), // The old single section, so every test also runs the migration.
        '.github/workflows/ci.yml': CI_WORKFLOW,
        '.github/workflows/codeql.yml': CODEQL_WORKFLOW,
        '.github/dependabot.yml': DEPENDABOT_PAUSED,
        ...files
    });
}

// The README section between two headings, so a check can't pass on text from another table.
function sectionOf(readme: string, heading: string): string {
    const start = readme.indexOf(`### ${heading}`);
    const end = readme.indexOf('\n#', start + 1);
    return readme.slice(start, end);
}

describe('documentQualitySecurity', () => {
    beforeEach(() => {
        reports.coverageSummary = { total: { lines: { pct: 84.61 } } };
        reports.fallowHealth = { health_score: { score: 89.6, grade: 'A' } };
    });

    it('writes the four check tables in order, then OpenSSF and vulnerability reporting', async () => {
        await writeProject();
        stubGitHub();
        stubOpenSSF();

        await documentQualitySecurity();

        const readme = await project.readFile('README.md');
        const headings = readme.match(/^#{2,3} .+$/gm);
        expect(headings).toEqual([
            '## Quality & Security',
            '### Testing',
            '### Code Quality',
            '### Security Analysis',
            '### Dependencies',
            '### OpenSSF 🚧',
            '### Reporting Vulnerabilities'
        ]);
        expect(readme).toContain('This section is updated each time `npm run document` is run.');
    });

    it('splits an old README section, leaving empty Contributing and License markers after it', async () => {
        await writeProject();
        stubGitHub();
        stubOpenSSF();

        await documentQualitySecurity();

        const readme = await project.readFile('README.md');
        expect(readme).not.toContain('GOVERNANCE');
        expect(readme).toMatch(/Reporting Vulnerabilities[\s\S]*<!-- QUALITY_SECURITY_END -->\n\n<!-- CONTRIBUTING_LICENSE_START -->\n<!-- CONTRIBUTING_LICENSE_END -->/);
    });

    it('shows on or off as the status, and opens what each check does with its badge and product', async () => {
        await writeProject();
        stubGitHub();
        stubOpenSSF();

        await documentQualitySecurity();

        const readme = await project.readFile('README.md');
        const repoURL = 'https://github.com/dpuse/dpuse-shared';
        const coverageBadge = `![Coverage](https://img.shields.io/endpoint?url=${encodeURIComponent('https://raw.githubusercontent.com/dpuse/dpuse-shared/main/code-health-reports/vitest/badge.json')})`;
        const fallowBadge = `![Fallow code health](https://img.shields.io/endpoint?url=${encodeURIComponent('https://raw.githubusercontent.com/dpuse/dpuse-shared/main/code-health-reports/fallow/badge.json')})`;

        const ciNote = ` Part of the [CI workflow](${repoURL}/actions/workflows/ci.yml) on every push to \`main\`.`;
        expect(readme).not.toContain('[![CI]');

        const testing = sectionOf(readme, 'Testing');
        expect(testing).toContain('|Check|Status|What it does|');
        expect(testing).toContain(`|Unit tests|✅ On|[Vitest](https://vitest.dev) runs the unit tests.${ciNote}|`);
        expect(testing).toContain(`alongside the unit tests.${ciNote}|`);
        expect(testing).toContain(`|Test coverage|✅ On|${coverageBadge} [Vitest's V8 coverage](https://vitest.dev/guide/coverage) measures`);

        const codeQuality = sectionOf(readme, 'Code Quality');
        expect(codeQuality).toContain(`|Code health|✅ On|[${fallowBadge}](./code-health-reports/fallow/index.md) [Fallow](https://github.com/fallow-rs/fallow) finds`);
        expect(codeQuality).toContain(
            '|Code analysis|✅ On|[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dpuse_dpuse-shared&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-shared) [SonarCloud](https://sonarcloud.io) checks'
        );
        expect(codeQuality).toContain(`|Linting|✅ On|[ESLint](https://eslint.org) checks the code for errors and style problems.${ciNote}|`);

        const securityAnalysis = sectionOf(readme, 'Security Analysis');
        expect(securityAnalysis).toContain(
            `|Static analysis|✅ On|[![CodeQL](${repoURL}/actions/workflows/codeql.yml/badge.svg)](${repoURL}/security/code-scanning) [CodeQL](https://codeql.github.com) scans GitHub Actions and JavaScript/TypeScript and swift for security vulnerabilities, using the extended security queries,`
        );
        expect(securityAnalysis).toContain('|Secret scanning|✅ On|[GitHub secret scanning]');
        expect(securityAnalysis).toContain('|Push protection|✅ On|[GitHub push protection]');

        const dependencies = sectionOf(readme, 'Dependencies');
        expect(dependencies).toContain(
            `|Vulnerability audit|✅ On|[npm audit](https://docs.npmjs.com/cli/commands/npm-audit) fails when any dependency has a known vulnerability.${ciNote}|`
        );
        expect(dependencies).toContain('|Supply chain risk|✅ On|[Socket](https://socket.dev) flags');
        expect(dependencies).toContain('|Security alerts|✅ On|[Dependabot]');
        expect(dependencies).toContain('opens pull requests that update vulnerable dependencies. These are handled manually.|');
        expect(dependencies).toContain('opens pull requests for new dependency versions. These are handled manually.|');

        expect(readme).toContain('Use [GitHub private vulnerability reporting](https://github.com/dpuse/dpuse-shared/security/advisories/new) instead.');
        expect(readme).toContain('[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/14952/badge)]');
    });

    it('leaves out the badge, and the CI note, of any check that is off', async () => {
        await writeProject();
        await fs.rm('.github/workflows/ci.yml');
        await fs.rm('.github/workflows/codeql.yml');
        stubGitHub({ [`${REPO}/commits/main/check-runs?per_page=100`]: undefined });
        stubOpenSSF();

        await documentQualitySecurity();

        const readme = await project.readFile('README.md');
        expect(readme).not.toContain('Part of the [CI workflow]');
        expect(readme).not.toContain('[![CodeQL]');
        expect(readme).not.toContain('[![Quality Gate Status]');
        expect(readme).toContain('|Code analysis|❌ Off|[SonarCloud](https://sonarcloud.io) checks');
    });

    it('orders each table by when its checks act, then alphabetically', async () => {
        await writeProject();
        stubGitHub();
        stubOpenSSF();

        await documentQualitySecurity();

        const readme = await project.readFile('README.md');
        const checkNames = (heading: string): string[] =>
            sectionOf(readme, heading)
                .matchAll(/^\|([^|]+)\|/gm)
                .map(([, name = '']) => name)
                .drop(2) // The header and divider rows.
                .toArray();
        expect(checkNames('Testing')).toEqual(['Unit tests', 'Property-based tests', 'Test coverage']);
        expect(checkNames('Code Quality')).toEqual(['Code health', 'Code analysis', 'Linting']);
        expect(checkNames('Security Analysis')).toEqual(['Push protection', 'Static analysis', 'Secret scanning']);
        expect(checkNames('Dependencies')).toEqual(['Vulnerability audit', 'Supply chain risk', 'Security alerts', 'Security updates', 'Version updates']);
    });

    it.each([
        [84.61, '84.6%', 'brightgreen'],
        [72, '72.0%', 'yellow'],
        [0.9, '0.9%', 'red']
    ])('writes a coverage badge for %d%%, coloured by how it compares with the target', async (percent, message, color) => {
        await writeProject();
        stubGitHub();
        stubOpenSSF();
        reports.coverageSummary = { total: { lines: { pct: percent } } };

        await documentQualitySecurity();

        expect(await project.readJSON('code-health-reports/vitest/badge.json')).toEqual({ schemaVersion: 1, label: 'coverage', message, color });
    });

    it('writes the Fallow badge file the Code Quality badge reads', async () => {
        await writeProject();
        stubGitHub();
        stubOpenSSF();
        reports.fallowHealth = { health_score: { score: 71.2, grade: 'C' } };

        await documentQualitySecurity();

        expect(await project.readJSON('code-health-reports/fallow/badge.json')).toEqual({ schemaVersion: 1, label: 'fallow', message: 'C (71)', color: 'yellow' });
    });

    it('leaves out the coverage and Fallow rows where they are not installed', async () => {
        await writeProject({ devDependencies: {} });
        stubGitHub();
        stubOpenSSF();

        await documentQualitySecurity();

        const readme = await project.readFile('README.md');
        expect(readme).not.toContain('|Test coverage|');
        expect(readme).not.toContain('|Code health|');
        expect(readme).toContain('|Property-based tests|❌ Off|');
        await expect(fs.access('code-health-reports')).rejects.toThrow();
    });

    it('leaves out the coverage row when the Vitest config writes no summary', async () => {
        await writeProject();
        stubGitHub();
        stubOpenSSF();
        reports.coverageSummary = undefined;

        await documentQualitySecurity();

        expect(await project.readFile('README.md')).not.toContain('|Test coverage|');
    });

    it('reports settings GitHub switches off or does not reveal', async () => {
        await writeProject(
            {},
            { '.github/workflows/ci.yml': 'steps:\n  - run: npm audit --audit-level=high\n', '.github/dependabot.yml': 'updates:\n  - package-ecosystem: npm\n' }
        );
        stubGitHub({
            [REPO]: '{}',
            [`${REPO}/private-vulnerability-reporting`]: undefined,
            [`${REPO}/vulnerability-alerts`]: undefined,
            [`${REPO}/commits/main/check-runs?per_page=100`]: undefined
        });
        stubOpenSSF({ bestPractices: [] });

        await documentQualitySecurity();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('|Unit tests|❌ Off|');
        expect(readme).toContain('|Secret scanning|❔ Unknown|');
        expect(readme).toContain('|Security alerts|❌ Off|');
        expect(readme).toContain('|Security updates|❔ Unknown|');
        expect(readme).toContain('|Version updates|✅ On|[Dependabot](https://docs.github.com/en/code-security/dependabot) opens pull requests for new dependency versions.|');
        expect(readme).toContain('|Code analysis|❌ Off|');
        expect(readme).toContain('|Supply chain risk|❌ Off|');
        expect(readme).toContain(
            '[npm audit](https://docs.npmjs.com/cli/commands/npm-audit) fails when a dependency has a known vulnerability of high severity or above. Part of the [CI workflow]'
        );
        expect(readme).toContain('See [SECURITY.md](./SECURITY.md) for how to report one privately');
        expect(readme).not.toContain('OpenSSF Best Practices](https://www.bestpractices.dev/projects/');
    });

    it('reports CodeQL as off without a workflow, and as using the default queries otherwise', async () => {
        await writeProject();
        await fs.rm('.github/workflows/codeql.yml');
        await fs.rm('.github/workflows/ci.yml');
        await fs.rm('.github/dependabot.yml');
        stubGitHub();
        stubOpenSSF();

        await documentQualitySecurity();
        expect(await project.readFile('README.md')).toContain(
            '|Static analysis|❌ Off|[CodeQL](https://codeql.github.com) scans for security vulnerabilities, using the default queries,'
        );
    });

    it('explains the Scorecard gaps only when every one is down to how a solo project is run', async () => {
        await writeProject();
        stubGitHub();
        const limitedChecks = [
            { name: 'Code-Review', score: 0 },
            { name: 'Branch-Protection', score: 3 },
            { name: 'Signed-Releases', score: -1 },
            { name: 'CII-Best-Practices', score: 2 },
            { name: 'Pinned-Dependencies', score: 10 }
        ];
        stubOpenSSF({ scorecard: { checks: limitedChecks } });

        await documentQualitySecurity();
        expect(await project.readFile('README.md')).toContain('the remaining Scorecard gaps need multi-person review or a pull-request workflow');

        stubOpenSSF({ scorecard: { checks: [...limitedChecks, { name: 'Fuzzing', score: 0 }] } });
        await documentQualitySecurity();
        expect(await project.readFile('README.md')).not.toContain('the remaining Scorecard gaps');
    });

    it.each([
        ['the Best Practices lookup fails', {}, { failing: 'https://www.bestpractices.dev' }],
        ['the Scorecard lookup fails', {}, { failing: 'https://api.scorecard.dev' }]
    ])('exits when %s', async (_case, packageJSON, openSSF) => {
        await writeProject(packageJSON);
        stubGitHub();
        stubOpenSSF(openSSF);

        await expect(documentQualitySecurity()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error documenting quality and security', expect.any(Error));
    });

    it('exits rather than reporting settings as off when GitHub cannot be reached', async () => {
        await writeProject();
        stubGitHub({ [REPO]: Object.assign(new Error('Command failed'), { stderr: 'gh: not logged in' }) });
        stubOpenSSF();

        await expect(documentQualitySecurity()).rejects.toThrow('process.exit(1)');
    });
});

/* eslint-enable security/detect-non-literal-fs-filename -- Tests only name files inside their own temporary folder. */
