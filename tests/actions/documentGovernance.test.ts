/* eslint-disable security/detect-non-literal-fs-filename -- Tests only name files inside their own temporary folder. */

// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { documentGovernance } from '@/actions/documentGovernance';
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

const CI_WORKFLOW = 'steps:\n  - run: npm test\n  - run: npm run audit\n';
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

async function writeProject(packageJSON: object = {}, files: Record<string, string> = {}, firstCreatedAt: number | null = Date.UTC(2024, 0, 1)): Promise<void> {
    await project.writeFiles({
        'config.json': JSON.stringify({ id: 'dpuse-shared', firstCreatedAt }),
        'package.json': JSON.stringify({
            author: 'Jonathan Terrell <terrell.jm@gmail.com>',
            repository: { type: 'git', url: 'git+https://github.com/dpuse/dpuse-shared.git' },
            devDependencies: { '@vitest/coverage-v8': '^5.0.2', fallow: '^3.30.0', 'fast-check': '^4.10.2' },
            ...packageJSON
        }),
        'README.md': buildReadme('GOVERNANCE'),
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

describe('documentGovernance', () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2026-09-15T12:00:00Z'));
        reports.coverageSummary = { total: { lines: { pct: 84.61 } } };
        reports.fallowHealth = { health_score: { score: 89.6, grade: 'A' } };
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('writes the four check tables in order, then OpenSSF and vulnerability reporting', async () => {
        await writeProject();
        stubGitHub();
        stubOpenSSF();

        await documentGovernance();

        const readme = await project.readFile('README.md');
        const headings = readme.match(/^#{2,3} .+$/gm);
        expect(headings).toEqual([
            '## Quality & Security',
            '### Testing',
            '### Code Quality',
            '### Security Analysis',
            '### Dependencies',
            '### OpenSSF 🚧',
            '### Reporting Vulnerabilities',
            '## Contributing',
            '## License'
        ]);
        expect(readme).toContain('This section is updated each time `npm run document` is run.');
    });

    it('reports tests, coverage, Fallow, CodeQL and dependency checks from the workflows and GitHub', async () => {
        await writeProject();
        stubGitHub();
        stubOpenSSF();

        await documentGovernance();

        const readme = await project.readFile('README.md');
        const testing = sectionOf(readme, 'Testing');
        expect(testing).toContain('|Unit tests|✅ On|');
        expect(testing).toContain('|Property-based tests|✅ fast-check|');
        expect(testing).toContain('|Test coverage|✅ 84.6% of lines|Share of source lines the unit tests run. The target is 80%.|');

        const codeQuality = sectionOf(readme, 'Code Quality');
        expect(codeQuality).toContain('|[Fallow](./code-health-reports/fallow/index.md)|✅ A (90)|');
        expect(codeQuality.indexOf('[Fallow]')).toBeLessThan(codeQuality.indexOf('[SonarCloud]'));
        expect(codeQuality).toContain('|[SonarCloud](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-shared)|✅ On|');

        const securityAnalysis = sectionOf(readme, 'Security Analysis');
        expect(securityAnalysis).toContain('|✅ GitHub Actions, JavaScript/TypeScript, swift|Static analysis for security vulnerabilities, using the extended security queries,');
        expect(securityAnalysis).toContain('|Secret scanning|✅ On|');
        expect(securityAnalysis).toContain('|Push protection|✅ On|');

        const dependencies = sectionOf(readme, 'Dependencies');
        expect(dependencies).toContain('|npm audit|✅ On|Fails CI when any dependency has a known vulnerability.|');
        expect(dependencies).toContain('|[Socket.dev](https://socket.dev)|✅ On|');
        expect(dependencies).toContain('|Dependabot alerts|✅ On|');
        expect(dependencies).toContain('|Dependabot security updates|❌ Off|');
        expect(dependencies).toContain('|Dependabot version updates|❌ Off|');

        expect(readme).toContain('Use [GitHub private vulnerability reporting](https://github.com/dpuse/dpuse-shared/security/advisories/new) instead.');
        expect(readme).toContain('[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/14952/badge)]');
        expect(readme).toContain('[MIT](./LICENSE) © 2024-present Jonathan Terrell');
    });

    it('writes the Fallow badge file the opening badge reads', async () => {
        await writeProject();
        stubGitHub();
        stubOpenSSF();
        reports.fallowHealth = { health_score: { score: 71.2, grade: 'C' } };

        await documentGovernance();

        expect(await project.readJSON('code-health-reports/fallow/badge.json')).toEqual({ schemaVersion: 1, label: 'fallow', message: 'C (71)', color: 'yellow' });
    });

    it('flags coverage below the target', async () => {
        await writeProject();
        stubGitHub();
        stubOpenSSF();
        reports.coverageSummary = { total: { lines: { pct: 0.9 } } };

        await documentGovernance();

        expect(await project.readFile('README.md')).toContain('|Test coverage|⚠️ 0.9% of lines|');
    });

    it('leaves out the coverage and Fallow rows where they are not installed', async () => {
        await writeProject({ devDependencies: {} });
        stubGitHub();
        stubOpenSSF();

        await documentGovernance();

        const readme = await project.readFile('README.md');
        expect(readme).not.toContain('Test coverage');
        expect(readme).not.toContain('[Fallow]');
        expect(readme).toContain('|Property-based tests|❌ Off|');
        await expect(fs.access('code-health-reports')).rejects.toThrow();
    });

    it('leaves out the coverage row when the Vitest config writes no summary', async () => {
        await writeProject();
        stubGitHub();
        stubOpenSSF();
        reports.coverageSummary = undefined;

        await documentGovernance();

        expect(await project.readFile('README.md')).not.toContain('Test coverage');
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

        await documentGovernance();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('|Unit tests|❌ Off|');
        expect(readme).toContain('|Secret scanning|❔ Unknown|');
        expect(readme).toContain('|Dependabot alerts|❌ Off|');
        expect(readme).toContain('|Dependabot version updates|✅ On|');
        expect(readme).toContain('|[SonarCloud](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-shared)|❌ Off|');
        expect(readme).toContain('Fails CI when a dependency has a known vulnerability of high severity or above.');
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

        await documentGovernance();
        expect(await project.readFile('README.md')).toContain('|❌ Off|Static analysis for security vulnerabilities, using the default queries,');
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

        await documentGovernance();
        expect(await project.readFile('README.md')).toContain('the remaining Scorecard gaps need multi-person review or a pull-request workflow');

        stubOpenSSF({ scorecard: { checks: [...limitedChecks, { name: 'Fuzzing', score: 0 }] } });
        await documentGovernance();
        expect(await project.readFile('README.md')).not.toContain('the remaining Scorecard gaps');
    });

    it.each([
        ['Jonathan Terrell', Date.UTC(2026, 0, 1), '© 2026 Jonathan Terrell'],
        [{ name: 'Jonathan Terrell  <terrell.jm@gmail.com>  (https://example.com)' }, null, '© 2026 Jonathan Terrell (https://example.com)']
    ])('names the author %j with the right copyright years', async (author, firstCreatedAt, expected) => {
        await writeProject({ author }, {}, firstCreatedAt);
        stubGitHub();
        stubOpenSSF();

        await documentGovernance();

        expect(await project.readFile('README.md')).toContain(`[MIT](./LICENSE) ${expected}`);
    });

    it.each([
        ['the author is missing', { author: '' }, {}],
        ['the Best Practices lookup fails', {}, { failing: 'https://www.bestpractices.dev' }],
        ['the Scorecard lookup fails', {}, { failing: 'https://api.scorecard.dev' }]
    ])('exits when %s', async (_case, packageJSON, openSSF) => {
        await writeProject(packageJSON);
        stubGitHub();
        stubOpenSSF(openSSF);

        await expect(documentGovernance()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error documenting governance', expect.any(Error));
    });

    it('exits rather than reporting settings as off when GitHub cannot be reached', async () => {
        await writeProject();
        stubGitHub({ [REPO]: Object.assign(new Error('Command failed'), { stderr: 'gh: not logged in' }) });
        stubOpenSSF();

        await expect(documentGovernance()).rejects.toThrow('process.exit(1)');
    });
});

/* eslint-enable security/detect-non-literal-fs-filename -- Tests only name files inside their own temporary folder. */
