// ── External Dependencies & Registrations
import { existsSync } from 'node:fs';

// ── Local Framework
import { logOperationHeader, logOperationSuccess, spawnCommand } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Uses prettier to enforce formatting style rules. */
export async function formatCode(): Promise<void> {
    try {
        logOperationHeader('Format Code');

        const optionalGlobs = ['app', 'e2e', 'scripts', 'src', 'tests'].filter((directory) => existsSync(directory)).map((directory) => `${directory}/**`);
        // Prettier fails on a pattern that matches nothing, and not every project has a JavaScript file at its root.
        const formatTargets = ['--write', '--no-error-on-unmatched-pattern', '*.js', '*.json', '*.md', '*.ts', ...optionalGlobs];
        await spawnCommand('1️⃣  Format', 'prettier', formatTargets);

        logOperationSuccess('Code formatted');
    } catch (error) {
        console.error('❌  Error formatting code', error);
        process.exit(1);
    }
}
