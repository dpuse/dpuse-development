// ── External Dependencies & Registrations
import { dpuseESLintConfig } from '@dpuse/eslint-config-dpuse';
import type { Linter } from 'eslint';

// ── ESLint Configuration ─────────────────────────────────────────────────────────────────────────────────────────────

const config: Linter.Config[] = dpuseESLintConfig({
    files: ['eslint.config.ts', 'src/**/*.ts', 'vite.config.ts', 'vitest.config.ts'],
    importCoreModules: ['cloudflare:workers'],
    tsconfigPath: './tsconfig.json',
    tsconfigRootDir: import.meta.dirname,
    rules: {
        'unicorn/filename-case': ['error', { cases: { camelCase: true, pascalCase: true }, ignore: [/\.schema\.ts$/] }],
        'unicorn/max-nested-calls': ['error', { max: 5 }], // Increased level from default of 3 to 4 for Valibot schema definitions.
        'unicorn/no-process-exit': 'off' // This package is only ever invoked via npm scripts (CLI context), never imported into a long-running process.
    }
});

export default config;
