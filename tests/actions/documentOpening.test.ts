// ── External Dependencies & Registrations
import { describe, expect, it } from 'vitest';

// ── Local Framework
import { documentActions } from '@/actions/documentActions';
import { documentOpening } from '@/actions/documentOpening';
import { buildReadme, useTemporaryProject } from '../support/temporaryProject';

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

async function writeProject(packageJSON: object, description: unknown = ['First paragraph.', 'Second paragraph.']): Promise<void> {
    await project.writeFiles({
        'config.json': JSON.stringify({ id: 'dpuse-shared', description: { en: description } }),
        'package.json': JSON.stringify({ license: 'Apache-2.0', repository: 'git+https://github.com/dpuse/dpuse-shared.git', ...packageJSON }),
        'README.md': buildReadme('OPENING')
    });
}

describe('documentOpening', () => {
    it('writes the badges, links, About DPUse and the introduction', async () => {
        await writeProject({});

        await documentOpening();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](./LICENSE)');
        expect(readme).toContain('[![DPUse version](https://img.shields.io/github/v/release/dpuse/dpuse-shared?color=f6821f&label=DPUse)]');
        expect(readme).toContain('[Report a Vulnerability](https://github.com/dpuse/dpuse-shared/security/advisories/new)');
        expect(readme).toContain('## About DPUse');
        expect(readme).toContain('## Introduction\n\nFirst paragraph.\n\nSecond paragraph.');
        expect(readme).not.toContain('Fallow code health');
    });

    it('puts the package description under the links, and leaves it out when there is none', async () => {
        await writeProject({ description: 'Common constants, types and utilities.' });
        await documentOpening();
        expect(await project.readFile('README.md')).toContain(
            '[Open an Issue](https://github.com/dpuse/dpuse-shared/issues)\n\nCommon constants, types and utilities.\n\n## About DPUse'
        );

        await writeProject({});
        await documentOpening();
        expect(await project.readFile('README.md')).toContain('[Open an Issue](https://github.com/dpuse/dpuse-shared/issues)\n\n## About DPUse');
    });

    it('shows only the License, Version and CI badges, as check results sit in Quality & Security', async () => {
        await writeProject({ devDependencies: { fallow: '^3.30.0' } });

        await documentOpening();

        const readme = await project.readFile('README.md');
        expect(readme.match(/\[!\[[^\]]+\]/g)).toEqual(['[![License: Apache-2.0]', '[![DPUse version]', '[![CI]']);
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
        await project.writeFiles({ 'config.json': JSON.stringify({ actionNames }), 'README.md': buildReadme('CONNECTOR_ACTIONS') });

        await documentActions();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('Connectors conform to a unified interface contract');
        expect(readme).toContain(description);
        expect(readme).toContain('The table below lists all connector actions');
    });

    it('treats a config without actions as implementing none', async () => {
        await project.writeFiles({ 'config.json': '{}', 'README.md': buildReadme('CONNECTOR_ACTIONS') });

        await documentActions();

        expect(await project.readFile('README.md')).toContain('does not yet implement any read or write actions');
    });

    it('exits when there is no config file', async () => {
        await project.writeFiles({ 'README.md': buildReadme('CONNECTOR_ACTIONS') });

        await expect(documentActions()).rejects.toThrow('process.exit(1)');
    });
});
