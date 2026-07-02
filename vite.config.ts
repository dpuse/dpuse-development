// ── External Dependencies & Registrations
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import Sonda from 'sonda/vite';
import { fileURLToPath, URL } from 'node:url';

// ── Data
import config from './config.json';

// ── Vite Configuration ───────────────────────────────────────────────────────────────────────────────────────────────

export default defineConfig({
    build: {
        lib: {
            entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
            fileName: (format) => `${config.id}.${format}.js`,
            formats: ['es']
        },
        rollupOptions: {
            external: ['node:child_process', 'node:fs', 'node:path', 'node:readline', 'node:url', 'node:util', 'node:zlib', 'license-checker-rseidelsohn', 'npm-check-updates'],
            onwarn(warning, warn) {
                if (warning.code === 'INVALID_ANNOTATION' && warning.id?.includes('acorn-typescript')) return;
                warn(warning);
            },
            plugins: [
                Sonda({ filename: 'index', format: 'html', brotli: true, gzip: false, open: false, outputDir: './bundle-analysis-reports/sonda' }),
                Sonda({ filename: 'index', format: 'json', brotli: true, gzip: false, open: false, outputDir: './bundle-analysis-reports/sonda' })
            ]
        },
        sourcemap: true,
        target: 'ESNext'
    },
    plugins: [dts({ outDirs: 'dist/types' })],
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('./', import.meta.url)),
            '@': fileURLToPath(new URL('src', import.meta.url))
        }
    }
});
