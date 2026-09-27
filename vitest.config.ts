// ── External Dependencies & Registrations
import { defineConfig } from 'vitest/config';
import path from 'node:path';

// ── Vitest Configuration ─────────────────────────────────────────────────────────────────────────────────────────────

export default defineConfig({
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './'),
            '@': path.resolve(__dirname, './src')
        }
    },
    test: {
        coverage: {
            // 'json' writes the coverage-final.json that `fallow health --coverage` reads; 'json-summary' writes the totals
            // the README's Testing table reports.
            exclude: ['dist/**', 'scripts/**', 'tests/**'],
            include: ['src/**/*.ts'],
            provider: 'v8',
            reporter: ['text', 'json', 'json-summary'],
            reportsDirectory: './coverage'
        },
        globals: true,
        include: ['tests/**/*.test.ts'],
        environment: 'node'
    }
});
