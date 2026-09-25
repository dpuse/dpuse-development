// ── External Dependencies & Registrations
import dts from 'vite-plugin-dts';
import Sonda from 'sonda/vite';
import wasm from 'vite-plugin-wasm';
import { defineConfig, type PluginOption } from 'vite';
import { fileURLToPath, URL } from 'node:url';

// ── Data
import config from './config.json';

// ── Initialisation ───────────────────────────────────────────────────────────────────────────────────────────────────

const wasmPlugin = wasm() as PluginOption;

// ── Vite Configuration ───────────────────────────────────────────────────────────────────────────────────────────────

export default defineConfig({
    build: {
        lib: {
            entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
            fileName: (format) => `${config.id}.${format}.js`,
            formats: ['es']
        },
        rollupOptions: {
            plugins: [Sonda({ filename: 'index', format: 'json', brotli: false, gzip: true, open: false, outputDir: './bundle-analysis-reports/sonda' })]
        },
        sourcemap: true,
        target: 'ESNext'
    },
    // Tests sit in the tsconfig so they get type-checked, but their declarations must not reach the published package.
    plugins: [dts({ exclude: ['tests/**'], outDirs: 'dist/types' }), wasmPlugin],
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('./', import.meta.url)),
            '@': fileURLToPath(new URL('src', import.meta.url))
        }
    }
});
