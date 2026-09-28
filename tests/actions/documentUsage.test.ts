// ── External Dependencies & Registrations
import { describe, expect, it } from 'vitest';

// ── Local Framework
import { documentUsage } from '@/actions/documentUsage';
import { buildReadme, useTemporaryProject } from '../support/temporaryProject';

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

const RUN = 'node -e "import(\'@dpuse/dpuse-development\').then(m => m.run())"';

async function writeProject(id: string, packageJSON: object): Promise<void> {
    await project.writeFiles({
        'config.json': JSON.stringify({ id }),
        'package.json': JSON.stringify({
            repository: { type: 'git', url: `git+https://github.com/dpuse/${id}.git` },
            engines: { node: '>=24', npm: '>=12' },
            devDependencies: { typescript: '^6.0.3' },
            ...packageJSON
        }),
        'README.md': buildReadme('USAGE')
    });
}

describe('documentUsage', () => {
    it('describes an uploaded module, with clone steps and required versions', async () => {
        await writeProject('dpuse-connector-dropbox', { name: '@dpuse/dpuse-connector-dropbox' });

        await documentUsage();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('This connector is automatically uploaded to the DPUse Engine cloud');
        expect(readme).toContain('building a new, similar connector, though there is currently no process to accept third-party connectors');
        expect(readme).toContain('git clone https://github.com/dpuse/dpuse-connector-dropbox.git\ncd dpuse-connector-dropbox\nnpm install');
        expect(readme).toContain(
            '_Requires [Node.js](https://nodejs.org/) 24 or later, [npm](https://www.npmjs.com/) 12 or later, and [TypeScript](https://www.typescriptlang.org/) 6.0.3 or later._'
        );
    });

    it('describes an npm package with its install command', async () => {
        await writeProject('dpuse-shared', { name: '@dpuse/dpuse-shared' });

        await documentUsage();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('This [package](https://www.npmjs.com/package/@dpuse/dpuse-shared) is available on [npm](https://www.npmjs.com/).');
        expect(readme).toContain('npm install @dpuse/dpuse-shared');
        expect(readme).not.toContain('[!WARNING]');
    });

    it('warns that internal npm packages are not for general use', async () => {
        await writeProject('eslint-config-dpuse', { name: '@dpuse/eslint-config-dpuse' });

        await documentUsage();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('> [!WARNING]\n> This project is not designed for general use.');
        expect(readme).toContain('your own project structure and tooling.\n\nTo work on the source instead, clone this repository.');
    });

    it('uses the general wording for modules that are neither uploaded nor on npm', async () => {
        await writeProject('dpuse-app', { name: '@dpuse/dpuse-app' });

        await documentUsage();

        expect(await project.readFile('README.md')).toContain('You may view or clone this repository for your own purposes.');
    });

    it('says each repository is managed with the actions dpuse-development provides', async () => {
        await writeProject('dpuse-shared', { name: '@dpuse/dpuse-shared' });
        await documentUsage();
        expect(await project.readFile('README.md')).toContain(
            'This repository is managed using the common set of actions provided by [@dpuse/dpuse-development](https://github.com/dpuse/dpuse-development).'
        );

        await writeProject('dpuse-development', { name: '@dpuse/dpuse-development' });
        await documentUsage();
        expect(await project.readFile('README.md')).toContain('This repository manages itself using the actions it implements.');
    });

    it('does not list the repository commands', async () => {
        await writeProject('dpuse-shared', { name: '@dpuse/dpuse-shared', scripts: { lint: RUN } });

        await documentUsage();

        expect(await project.readFile('README.md')).not.toContain('|Command|What it does|');
    });

    it.each([
        ['repository is missing', { repository: undefined }, "package.json 'repository' field is required to document usage."],
        ['node version is missing', { engines: { npm: '>=12' } }, 'package.json version range is required to document usage.'],
        ['version cannot be read', { engines: { node: 'latest', npm: '>=12' } }, "Unable to parse version from 'latest'."],
        ['npm package has no name', { name: undefined }, "package.json 'name' field is required to document usage."]
    ])('exits when the %s', async (_case, packageJSON, message) => {
        await writeProject('dpuse-shared', packageJSON);

        await expect(documentUsage()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error documenting usage', new Error(message));
    });
});
