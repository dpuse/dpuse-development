// ── External Dependencies & Registrations
import { existsSync } from 'node:fs';

// ── Local (Development) Framework
import { logOperationHeader, logOperationSuccess, spawnCommand } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function formatCode(): Promise<void> {
    try {
        logOperationHeader('Format Code');

        // eslint-disable-next-line security/detect-non-literal-fs-filename -- specified directories, no user input.
        const optionalGlobs = ['app', 'src'].filter((directory) => existsSync(directory)).map((directory) => `${directory}/**`);
        const formatTargets = ['--write', '*.json', '*.md', '*.ts', ...optionalGlobs];
        await spawnCommand('1️⃣  Format', 'prettier', formatTargets);

        logOperationSuccess('Code formatted.');
    } catch (error) {
        console.error('❌ Error formatting code.', error);
        process.exit(1);
    }
}
