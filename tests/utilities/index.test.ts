// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import { describe, expect, it } from 'vitest';

// ── Local Framework
import {
    clearDirectory,
    execCommand,
    extractOperationsFromSource,
    getModuleConfig,
    readTextFileOrNull,
    resolveOwnerAndRepo,
    spawnCommand,
    spawnCommandToFile,
    writeReadmeSection
} from '@/utilities';
import { collectConsoleOutput, useTemporaryProject } from '../support/temporaryProject';

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

describe('resolveOwnerAndRepo', () => {
    it.each([
        ['git+https://github.com/dpuse/dpuse-shared.git', 'dpuse', 'dpuse-shared'],
        ['https://github.com/dpuse/dpuse-shared', 'dpuse', 'dpuse-shared'],
        ['git@github.com:dpuse/dpuse-shared.git', 'dpuse', 'dpuse-shared']
    ])("reads the owner and repo from '%s'", (url, owner, repo) => {
        expect(resolveOwnerAndRepo({ repository: { type: 'git', url } }, 'test')).toEqual({ owner, repo });
        expect(resolveOwnerAndRepo({ repository: url }, 'test')).toEqual({ owner, repo });
    });

    it('names the purpose when the repository is missing', () => {
        expect(() => resolveOwnerAndRepo({}, 'document opening')).toThrow("package.json 'repository' field is required to document opening.");
        expect(() => resolveOwnerAndRepo({ repository: '' }, 'test')).toThrow('is required to test');
    });

    it('rejects a repository that is not on GitHub', () => {
        expect(() => resolveOwnerAndRepo({ repository: 'https://gitlab.com/dpuse/dpuse-shared' }, 'test')).toThrow(
            "Unable to parse GitHub owner/repo from 'https://gitlab.com/dpuse/dpuse-shared'."
        );
    });
});

describe('getModuleConfig', () => {
    it.each([
        ['dpuse-connector-dropbox', 'connector', 'dpuse'],
        ['dpuse-shared', 'shared', 'npm'],
        ['eslint-config-dpuse', 'eslint', 'npm'],
        ['github', 'github', 'github']
    ])("finds the module type for '%s' by its prefix", (id, typeId, publishedTo) => {
        expect(getModuleConfig(id)).toMatchObject({ typeId, publishedTo });
    });

    it('rejects an identifier with no known prefix', () => {
        expect(() => getModuleConfig('unknown-module')).toThrow("Failed to locate module type configuration for identifier 'unknown-module'.");
    });
});

describe('extractOperationsFromSource', () => {
    it('lists public method names, leaving out the constructor and private methods', () => {
        const source = `
            export default class Connector {
                constructor() {}
                listNodes(): void {}
                async retrieveRecords(options: { limit: number }): Promise<void> { const inner = { nested() {} }; }
                private helper(): void {}
            }
        `;
        expect(extractOperationsFromSource(source)).toEqual(['listNodes', 'retrieveRecords']);
    });

    it('finds methods in every class in the source', () => {
        expect(extractOperationsFromSource('class A { one() {} }\nclass B { two() {} }')).toEqual(['one', 'two']);
    });

    it('lists nothing when there are no classes', () => {
        expect(extractOperationsFromSource('export const value = 1;')).toEqual([]);
    });
});

describe('execCommand', () => {
    it('logs what the command writes to standard output and standard error', async () => {
        await execCommand('1️⃣  Run', 'node', ['-e', "console.log('out'); console.error('err')"]);
        expect(collectConsoleOutput()).toContain('1️⃣  Run - exec(node -e');
        expect(console.log).toHaveBeenCalledWith('out');
        expect(console.error).toHaveBeenCalledWith('err');
    });

    it('writes standard output to a file when one is given', async () => {
        await execCommand(undefined, 'node', ['-e', "console.log('  saved  ')"], 'output.txt');
        expect(await project.readFile('output.txt')).toBe('saved');
        expect(console.log).not.toHaveBeenCalled();
    });

    it('rejects when the command fails', async () => {
        await expect(execCommand(undefined, 'node', ['-e', 'process.exit(3)'])).rejects.toThrow();
    });
});

describe('spawnCommand', () => {
    it('resolves when the command succeeds', async () => {
        await expect(spawnCommand('1️⃣  Run', 'node', ['-e', '0'])).resolves.toBeUndefined();
    });

    it('rejects with the exit code when the command fails', async () => {
        await expect(spawnCommand('1️⃣  Run', 'node', ['-e', 'process.exit(2)'])).rejects.toThrow('node exited with code 2');
    });

    it('resolves despite a failure when errors are ignored', async () => {
        await expect(spawnCommand('1️⃣  Run', 'node', ['-e', 'process.exit(2)'], true)).resolves.toBeUndefined();
    });
});

describe('spawnCommandToFile', () => {
    it('writes standard output to the file, creating its folder', async () => {
        await spawnCommandToFile('1️⃣  Run', 'node', ['-e', "process.stdout.write('report')"], 'reports/nested/output.txt');
        expect(await project.readFile('reports/nested/output.txt')).toBe('report');
    });

    it('rejects with the exit code when the command fails', async () => {
        await expect(spawnCommandToFile('1️⃣  Run', 'node', ['-e', 'process.exit(4)'], 'output.txt')).rejects.toThrow('node exited with code 4');
        expect(await readTextFileOrNull('output.txt')).toBeNull();
    });

    it('still writes the output when errors are ignored', async () => {
        await spawnCommandToFile('1️⃣  Run', 'node', ['-e', "process.stdout.write('partial'); process.exit(1)"], 'output.txt', true);
        expect(await project.readFile('output.txt')).toBe('partial');
    });
});

describe('file helpers', () => {
    it('answers null for a missing file', async () => {
        expect(await readTextFileOrNull('missing.txt')).toBeNull();
    });

    it('rethrows errors other than a missing file', async () => {
        await fs.mkdir('folder');
        await expect(readTextFileOrNull('folder')).rejects.toThrow();
    });

    it('clears everything inside a folder but keeps the folder', async () => {
        await project.writeFiles({ 'licenses/downloads/a.txt': 'a', 'licenses/downloads/nested/b.txt': 'b' });
        await clearDirectory('1️⃣  Clear', 'licenses/downloads');
        expect(await fs.readdir('licenses/downloads')).toEqual([]);
    });

    it('treats a missing folder as already clear', async () => {
        await expect(clearDirectory(undefined, 'missing')).resolves.toBeUndefined();
    });

    it('replaces only the text between the README markers', async () => {
        await project.writeFiles({ 'README.md': 'Before\n<!-- A_START -->\nold\n<!-- A_END -->\nAfter\n' });
        await writeReadmeSection('  new  ', '<!-- A_START -->', '<!-- A_END -->');
        expect(await project.readFile('README.md')).toBe('Before\n<!-- A_START -->\n\nnew\n\n<!-- A_END -->\nAfter\n');
    });

    it('rejects a README without the markers', async () => {
        await project.writeFiles({ 'README.md': 'No markers' });
        await expect(writeReadmeSection('new', '<!-- A_START -->', '<!-- A_END -->')).rejects.toThrow('Markers <!-- A_START -->-<!-- A_END --> not found in content.');
    });
});
