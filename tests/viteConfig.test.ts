// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import { describe, expect, it } from 'vitest';

// ── Local Framework
import { readTextFile } from '@/utilities';
import viteConfig from '~/vite.config';

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Vite swaps a Node built-in it is not told to leave out for an empty browser stand-in, which only fails once the
// built package runs: 'node:os' was missed this way, so 'tmpdir' was not a function in the publish workflow.
describe('vite.config.ts', () => {
    it('leaves every Node built-in the source imports out of the bundle', async () => {
        const fileNames = await fs.readdir('src', { recursive: true });
        const sourceFileNames = fileNames.filter((fileName) => fileName.endsWith('.ts'));
        const sources = await Promise.all(sourceFileNames.map((fileName) => readTextFile(`src/${fileName}`)));
        const importedBuiltIns = new Set(sources.flatMap((source) => Array.from(source.matchAll(/from '(node:[^']+)'/g), ([, name]) => name)));
        // Only the list itself is needed, so a narrow type avoids naming Vite's deprecated 'rollupOptions' type.
        const { build } = viteConfig as { build?: { rollupOptions?: { external?: string[] } } };
        const external = build?.rollupOptions?.external ?? [];

        expect([...importedBuiltIns].filter((name) => name !== undefined && !external.includes(name))).toEqual([]);
    });
});
