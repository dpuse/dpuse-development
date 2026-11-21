// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { documentOpening } from '@/actions/documentOpening';
import { buildReadme, useTemporaryProject } from '../support/temporaryProject';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// The GitHub Apps that checked the latest commit are given by each test rather than read from GitHub.
const gitHub = vi.hoisted((): { checkAppSlugs: string[] } => ({ checkAppSlugs: [] }));
vi.mock('@/utilities', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    readGitHubCheckAppSlugs: vi.fn(() => Promise.resolve(new Set(gitHub.checkAppSlugs)))
}));

// ── State ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

describe('documentOpening', () => {
    beforeEach(() => {
        gitHub.checkAppSlugs = [];
    });

    it('writes the badges, About DPUse and the introduction', async () => {
        await writeProject({});

        await documentOpening();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](./LICENSE)');
        expect(readme).toContain('## About DPUse\n\nDPUse (Data Positioning & Use) is');
        expect(readme).toContain('**Sourcing** uses Connectors to link to');
        expect(readme).toContain('## Introduction\n\nFirst paragraph.\n\nSecond paragraph.');
    });

    it('leaves out the Introduction when the config has no description', async () => {
        await writeProject({}, '');

        await documentOpening();

        expect(await project.readFile('README.md')).not.toContain('## Introduction');
    });

    it('puts the package description between the badges and the links, and leaves it out when there is none', async () => {
        const npmBadge = '[![npm version](https://img.shields.io/npm/v/@dpuse/dpuse-shared?label=npm)](https://www.npmjs.com/package/@dpuse/dpuse-shared)';
        const links = '[Report a Vulnerability](https://github.com/dpuse/dpuse-shared/security/advisories/new) · [Open an Issue](https://github.com/dpuse/dpuse-shared/issues)';
        await writeProject({ description: 'Common constants, types and utilities.' });
        await documentOpening();
        expect(await project.readFile('README.md')).toContain(`${npmBadge}\n\nCommon constants, types and utilities.\n\n${links}\n\n## About DPUse`);

        await writeProject({});
        await documentOpening();
        expect(await project.readFile('README.md')).toContain(`${npmBadge}\n\n${links}\n\n## About DPUse`);
    });

    it('shows the License, CI and npm badges for an npm package, leaving the other check results to Quality & Security', async () => {
        await writeProject({ devDependencies: { fallow: '^3.30.0' } });

        await documentOpening();

        const readme = await project.readFile('README.md');
        expect(readme.match(/\[!\[[^\]]+\]/g)).toEqual(['[![License: Apache-2.0]', '[![CI]', '[![npm version]']);
        expect(readme).toContain('[![npm version](https://img.shields.io/npm/v/@dpuse/dpuse-shared?label=npm)](https://www.npmjs.com/package/@dpuse/dpuse-shared)');
    });

    it('shows the DPUse version badge, and no npm badge, for a module uploaded to DPUse only', async () => {
        await writeProject({}, undefined, 'dpuse-connector-dropbox');

        await documentOpening();

        const readme = await project.readFile('README.md');
        expect(readme.match(/\[!\[[^\]]+\]/g)).toEqual(['[![License: Apache-2.0]', '[![CI]', '[![DPUse version]']);
        expect(readme).toContain(
            '[![DPUse version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.dpuse.app%2Fconfigs%2Fdpuse-connector-dropbox&query=%24.data.version&prefix=v&label=DPUse&color=blue)]'
        );
    });

    it('colours the DPUse version badge by version, as Shields colours the npm badge', async () => {
        for (const [version, color] of [
            ['0.4.2', 'orange'],
            ['1.2.0-rc.1', 'orange'],
            ['1.2.0', 'blue']
        ]) {
            await writeProject({ version }, undefined, 'dpuse-connector-dropbox');
            await documentOpening();
            expect(await project.readFile('README.md')).toContain(`label=DPUse&color=${String(color)})`);
        }
    });

    it('shows both the DPUse version and npm badges for a tool, which goes to both', async () => {
        await writeProject({}, undefined, 'dpuse-tool-file-previewer');

        await documentOpening();

        const readme = await project.readFile('README.md');
        expect(readme.match(/\[!\[[^\]]+\]/g)).toEqual(['[![License: Apache-2.0]', '[![CI]', '[![DPUse version]', '[![npm version]']);
    });

    it('adds the CodeQL, coverage, Fallow and SonarCloud badges, between CI and the published versions, where the project has each check', async () => {
        await writeProject({});
        await project.writeFiles({
            '.github/workflows/codeql.yml': 'name: CodeQL\n',
            'code-health-reports/vitest/badge.json': '{}',
            'code-health-reports/fallow/badge.json': '{}'
        });
        gitHub.checkAppSlugs = ['socket-security', 'sonarqubecloud'];

        await documentOpening();

        const readme = await project.readFile('README.md');
        const coverageSource = encodeURIComponent('https://raw.githubusercontent.com/dpuse/dpuse-shared/main/code-health-reports/vitest/badge.json');
        expect(readme.match(/!\[[^\]]+\]/g)).toEqual([
            '![License: Apache-2.0]',
            '![CI]',
            '![CodeQL]',
            '![Coverage]',
            '![Fallow code health]',
            '![Quality Gate Status]',
            '![npm version]'
        ]);
        expect(readme).toContain(
            '[![CodeQL](https://github.com/dpuse/dpuse-shared/actions/workflows/codeql.yml/badge.svg)](https://github.com/dpuse/dpuse-shared/security/code-scanning)'
        );
        expect(readme).toContain(`![Coverage](https://img.shields.io/endpoint?url=${coverageSource})`);
        expect(readme).toContain(
            '[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dpuse_dpuse-shared&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-shared)'
        );
    });

    it('leaves out the coverage and Fallow badges of a private repository, whose figures cannot be read from outside', async () => {
        await writeProject({ private: true });
        await project.writeFiles({ 'code-health-reports/vitest/badge.json': '{}', 'code-health-reports/fallow/badge.json': '{}' });

        await documentOpening();

        const readme = await project.readFile('README.md');
        expect(readme).not.toContain('![Coverage]');
        expect(readme).not.toContain('![Fallow code health]');
    });

    it('exits when a project published to npm has no package name', async () => {
        await writeProject({ name: '' });

        await expect(documentOpening()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error documenting opening', new Error("package.json 'name' field is required to document opening."));
    });

    it('labels the licence of a proprietary project as Proprietary', async () => {
        await writeProject({ license: 'UNLICENSED', private: true }, undefined, 'dpuse-engine');

        await documentOpening();

        expect(await project.readFile('README.md')).toContain('[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-blue.svg)](./LICENSE)');
    });

    it('exits when the licence is missing', async () => {
        await writeProject({ license: '' });

        await expect(documentOpening()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error documenting opening', new Error("package.json 'license' field is required to document opening."));
    });
});

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

async function writeProject(packageJSON: object, description: string | undefined = 'First paragraph.\n\nSecond paragraph.', id = 'dpuse-shared'): Promise<void> {
    await project.writeFiles({
        'config.json': JSON.stringify({ id, description: { en: description } }),
        'package.json': JSON.stringify({ license: 'Apache-2.0', name: '@dpuse/dpuse-shared', repository: 'git+https://github.com/dpuse/dpuse-shared.git', ...packageJSON }),
        'README.md': buildReadme('OPENING')
    });
}
