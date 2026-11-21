// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import type { PackageJson } from 'type-fest';
import { describe, expect, it } from 'vitest';

// ── Local Framework
import viteConfig from '~/vite.config';
import { readJSONFile, readTextFile } from '@/utilities';

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Vite swaps a Node built-in it is not told to leave out for an empty browser stand-in, which only fails once the
// built package runs: 'node:os' was missed this way, so 'tmpdir' was not a function in the publish workflow.
describe('vite.config.ts', () => {
    it('leaves every Node built-in the source imports out of the bundle', async () => {
        const importedBuiltIns = await listImportedBuiltIns();

        expect(importedBuiltIns.filter((name) => !listExternal().includes(name))).toEqual([]);
    });

    it('lists no Node built-in the source no longer imports', async () => {
        const importedBuiltIns = await listImportedBuiltIns();
        const externalBuiltIns = listExternal().filter((name) => name.startsWith('node:'));

        expect(externalBuiltIns.filter((name) => !importedBuiltIns.includes(name))).toEqual([]);
    });

    // A package left out of the bundle is loaded from 'node_modules' when the built package runs, so it has to be
    // installed with this one.
    it('leaves out of the bundle only packages that are installed with this one', async () => {
        const packageJSON = await readJSONFile<PackageJson>('package.json');
        const installedNames = new Set([...Object.keys(packageJSON.dependencies ?? {}), ...Object.keys(packageJSON.peerDependencies ?? {})]);
        const externalPackages = listExternal().filter((name) => !name.startsWith('node:'));

        expect(externalPackages).not.toEqual([]);
        expect(externalPackages.filter((name) => !installedNames.has(name))).toEqual([]);
    });
});

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// Only the list itself is needed, so a narrow type keeps the test independent of Vite's full config types.
function listExternal(): string[] {
    const { build } = viteConfig as { build?: { rolldownOptions?: { external?: string[] } } };
    return build?.rolldownOptions?.external ?? [];
}

async function listImportedBuiltIns(): Promise<string[]> {
    const fileNames = await fs.readdir('src', { recursive: true });
    const sourceFileNames = fileNames.filter((fileName) => fileName.endsWith('.ts'));
    const sources = await Promise.all(sourceFileNames.map((fileName) => readTextFile(`src/${fileName}`)));
    const names = sources.flatMap((source) => Array.from(source.matchAll(/from '(node:[^']+)'/g), ([, name = '']) => name));
    return [...new Set(names)];
}
