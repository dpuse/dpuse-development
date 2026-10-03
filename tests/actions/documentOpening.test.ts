// ── External Dependencies & Registrations
import { describe, expect, it } from 'vitest';

// ── Local Framework
import { documentActions } from '@/actions/documentActions';
import { documentOpening } from '@/actions/documentOpening';
import { buildReadme, useTemporaryProject } from '../support/temporaryProject';

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

async function writeProject(packageJSON: object, description: string | undefined = 'First paragraph.\n\nSecond paragraph.', id = 'dpuse-shared'): Promise<void> {
    await project.writeFiles({
        'config.json': JSON.stringify({ id, description: { en: description } }),
        'package.json': JSON.stringify({ license: 'Apache-2.0', name: '@dpuse/dpuse-shared', repository: 'git+https://github.com/dpuse/dpuse-shared.git', ...packageJSON }),
        'README.md': buildReadme('OPENING')
    });
}

describe('documentOpening', () => {
    it('writes the badges, About DPUse and the introduction', async () => {
        await writeProject({});

        await documentOpening();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](./LICENSE)');
        expect(readme).toContain('## About DPUse\n\n[DPUse](https://www.dpuse.app) (Data Positioning & Use) is');
        expect(readme).not.toContain('[DPUse](https://www.dpuse.app) ·');
        expect(readme).toContain('[Connectors](https://www.dpuse.app/connectors)');
        expect(readme).toContain('## Introduction\n\nFirst paragraph.\n\nSecond paragraph.');
        expect(readme).not.toContain('Fallow code health');
    });

    it('leaves out the Introduction when the config has no description', async () => {
        await writeProject({}, '');

        await documentOpening();

        expect(await project.readFile('README.md')).not.toContain('## Introduction');
    });

    it('puts the package description between the badges and the links, and leaves it out when there is none', async () => {
        const ciBadge = '[![CI](https://github.com/dpuse/dpuse-shared/actions/workflows/ci.yml/badge.svg)](https://github.com/dpuse/dpuse-shared/actions/workflows/ci.yml)';
        const links = '[Report a Vulnerability](https://github.com/dpuse/dpuse-shared/security/advisories/new) · [Open an Issue](https://github.com/dpuse/dpuse-shared/issues)';
        await writeProject({ description: 'Common constants, types and utilities.' });
        await documentOpening();
        expect(await project.readFile('README.md')).toContain(`${ciBadge}\n\nCommon constants, types and utilities.\n\n${links}\n\n## About DPUse`);

        await writeProject({});
        await documentOpening();
        expect(await project.readFile('README.md')).toContain(`${ciBadge}\n\n${links}\n\n## About DPUse`);
    });

    it('shows only the License, npm and CI badges for an npm package, as check results sit in Quality & Security', async () => {
        await writeProject({ devDependencies: { fallow: '^3.30.0' } });

        await documentOpening();

        const readme = await project.readFile('README.md');
        expect(readme.match(/\[!\[[^\]]+\]/g)).toEqual(['[![License: Apache-2.0]', '[![npm version]', '[![CI]']);
        expect(readme).toContain('[![npm version](https://img.shields.io/npm/v/@dpuse/dpuse-shared?color=cb3837&label=npm)](https://www.npmjs.com/package/@dpuse/dpuse-shared)');
    });

    it('shows the DPUse version badge, and no npm badge, for a module uploaded to DPUse only', async () => {
        await writeProject({}, undefined, 'dpuse-connector-dropbox');

        await documentOpening();

        const readme = await project.readFile('README.md');
        expect(readme.match(/\[!\[[^\]]+\]/g)).toEqual(['[![License: Apache-2.0]', '[![DPUse version]', '[![CI]']);
        expect(readme).toContain('[![DPUse version](https://img.shields.io/github/v/release/dpuse/dpuse-shared?color=f6821f&label=DPUse)]');
    });

    it('shows both the DPUse version and npm badges for a tool, which goes to both', async () => {
        await writeProject({}, undefined, 'dpuse-tool-file-previewer');

        await documentOpening();

        const readme = await project.readFile('README.md');
        expect(readme.match(/\[!\[[^\]]+\]/g)).toEqual(['[![License: Apache-2.0]', '[![DPUse version]', '[![npm version]', '[![CI]']);
    });

    it('exits when a project published to npm has no package name', async () => {
        await writeProject({ name: '' });

        await expect(documentOpening()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error documenting opening', new Error("package.json 'name' field is required to document opening."));
    });

    it('exits when the licence is missing', async () => {
        await writeProject({ license: '' });

        await expect(documentOpening()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error documenting opening', new Error("package.json 'license' field is required to document opening."));
    });
});

describe('documentActions', () => {
    it.each([
        [['listNodes', 'retrieveRecords'], 'This connector is a Source connector'],
        [['createObject'], 'This connector is a Destination connector'],
        [['retrieveRecords', 'createObject'], 'This connector is a Bidirectional connector'],
        [[], 'This connector does not yet implement any read or write actions']
    ])('describes a connector implementing %j', async (actionNames, description) => {
        await project.writeFiles({ 'config.json': JSON.stringify({ actionNames }), 'README.md': buildReadme('SUPPORTED_ACTIONS') });

        await documentActions();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('<!-- SUPPORTED_ACTIONS_START -->\n\n## Supported Actions\n\nConnectors conform to a unified interface contract');
        expect(readme).toContain(description);
        expect(readme).toContain('The table below lists all connector actions');
    });

    it('treats a config without actions as implementing none', async () => {
        await project.writeFiles({ 'config.json': '{}', 'README.md': buildReadme('SUPPORTED_ACTIONS') });

        await documentActions();

        expect(await project.readFile('README.md')).toContain('does not yet implement any read or write actions');
    });

    it('exits when there is no config file', async () => {
        await project.writeFiles({ 'README.md': buildReadme('SUPPORTED_ACTIONS') });

        await expect(documentActions()).rejects.toThrow('process.exit(1)');
    });
});
