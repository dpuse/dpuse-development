// ── External Dependencies & Registrations
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import Sonda from 'sonda/vite';
import { fileURLToPath, URL } from 'node:url';

// ── Data
import config from './config.json' with { type: 'json' };

// ── Vite Configuration ───────────────────────────────────────────────────────────────────────────────────────────────

export default defineConfig({
    build: {
        // Two entry points: the actions, and the build plugin for Vite configs, which must load without the actions.
        lib: {
            entry: { [config.id]: fileURLToPath(new URL('src/index.ts', import.meta.url)), vite: fileURLToPath(new URL('src/vite.ts', import.meta.url)) },
            fileName: (format, entryName) => `${entryName}.${format}.js`,
            formats: ['es']
        },
        rollupOptions: {
            external: [
                'node:child_process',
                'node:fs',
                'node:path',
                'node:readline',
                'node:url',
                'node:util',
                'node:zlib',
                'license-checker-rseidelsohn',
                'npm-check-updates',
                'typescript'
            ],
            plugins: [Sonda({ filename: 'index', format: 'json', brotli: false, gzip: true, open: false, outputDir: './bundle-analysis-reports/sonda' })]
        },
        sourcemap: 'hidden',
        target: 'ESNext'
    },
    // Tests and config files sit in the tsconfig so they get type-checked, but their declarations must not reach the
    // published package. 'entryRoot' keeps the types under 'dist/types/src', where package.json points. The Node types
    // are named because, with the config files excluded, nothing else pulls them in.
    plugins: [dts({ compilerOptions: { types: ['node'] }, entryRoot: '.', exclude: ['tests/**', '*.config.*'], outDirs: 'dist/types' })],
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('./', import.meta.url)),
            '@': fileURLToPath(new URL('src', import.meta.url))
        }
    }
});
