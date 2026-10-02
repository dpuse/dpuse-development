// ── External Dependencies & Registrations
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// ── Local Framework
import { recordShippedPackages } from '@/vite';
import type { ShippedPackagesRecord } from '@/vite';
import { useTemporaryProject } from './support/temporaryProject';

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

type Hook = (...hookArguments: unknown[]) => void;

// Runs the plugin's build hooks over one bundle, as Vite would, and returns the record written beside the reports.
async function recordBundle(bundle: Record<string, object>): Promise<ShippedPackagesRecord> {
    const plugin = recordShippedPackages() as unknown as { configResolved: Hook; generateBundle: Hook; closeBundle: Hook };
    const root = process.cwd();
    plugin.configResolved({ root, build: { outDir: 'dist' } });
    plugin.generateBundle({}, bundle);
    plugin.closeBundle();
    return (await project.readJSON('bundle-analysis-reports/shipped-packages.json')) as unknown as ShippedPackagesRecord;
}

function chunk(moduleIds: string[], imports: string[] = []): object {
    return { type: 'chunk', modules: Object.fromEntries(moduleIds.map((moduleId) => [path.resolve(moduleId), {}])), imports, dynamicImports: [] };
}

describe('recordShippedPackages', () => {
    it('records the installed package of each bundled module, but not the project’s own source', async () => {
        await project.writeFiles({
            'node_modules/vue-router/package.json': JSON.stringify({ name: 'vue-router', version: '5.3.1' }),
            'node_modules/vue-router/dist/router.js': '',
            'node_modules/@scope/icons/package.json': JSON.stringify({ name: '@scope/icons', version: '1.0.0' }),
            'node_modules/@scope/icons/dist/esm/icon.js': '',
            'src/index.ts': ''
        });

        const record = await recordBundle({ 'index.js': chunk(['node_modules/vue-router/dist/router.js', 'node_modules/@scope/icons/dist/esm/icon.js', 'src/index.ts']) });

        expect(record).toEqual({ packages: ['@scope/icons@1.0.0', 'vue-router@5.3.1'], external: [] });
    });

    it('records the package an asset comes from, such as a font', async () => {
        await project.writeFiles({
            'node_modules/@fontsource-variable/inter/package.json': JSON.stringify({ name: '@fontsource-variable/inter', version: '5.3.0' }),
            'node_modules/@fontsource-variable/inter/files/inter.woff2': ''
        });

        const record = await recordBundle({ 'inter.woff2': { type: 'asset', originalFileNames: ['node_modules/@fontsource-variable/inter/files/inter.woff2'] } });

        expect(record.packages).toEqual(['@fontsource-variable/inter@5.3.0']);
    });

    it('adds the packages bundled inside a package that publishes its own record', async () => {
        await project.writeFiles({
            'node_modules/@dpuse/dpuse-shared/package.json': JSON.stringify({ name: '@dpuse/dpuse-shared', version: '0.3.865' }),
            'node_modules/@dpuse/dpuse-shared/dist/dpuse-shared.es.js': '',
            'node_modules/@dpuse/dpuse-shared/dist/shipped-packages.json': JSON.stringify({ packages: ['valibot@1.5.0'], external: [] })
        });

        const record = await recordBundle({ 'index.js': chunk(['node_modules/@dpuse/dpuse-shared/dist/dpuse-shared.es.js']) });

        expect(record.packages).toEqual(['@dpuse/dpuse-shared@0.3.865', 'valibot@1.5.0']);
    });

    it('records a package left to be imported by name, but not its own files, built-ins or URLs', async () => {
        const record = await recordBundle({
            'index.js': chunk([], ['chunk-a.js', 'vue/dist/vue.runtime.js', '@scope/pkg/sub', 'node:fs', 'https://engine-eu.dpuse.app/x.js']),
            'chunk-a.js': chunk([])
        });

        expect(record.external).toEqual(['@scope/pkg', 'vue']);
    });

    it('also writes the record into the output, so it is published with the package', async () => {
        await recordBundle({ 'index.js': chunk([]) });

        expect(await project.readJSON('dist/shipped-packages.json')).toEqual({ packages: [], external: [] });
    });
});
