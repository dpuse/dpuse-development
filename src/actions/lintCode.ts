// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── Local Framework
import { logOperationHeader, logOperationSuccess, readJSONFile, spawnCommand } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Uses eslint to check the code for potential errors and enforces coding style rules, then type-checks the project. */
export async function lintCode(): Promise<void> {
    try {
        logOperationHeader('Lint Code');

        await spawnCommand('1️⃣  Lint', 'eslint', ['.']);

        // ESLint does not report TypeScript's own errors, and an editor only checks the files that are open, so errors in a
        // file nobody opens (often a test) go unseen without this step. A Vue project uses 'vue-tsc', which also checks
        // '.vue' files, with '--build' because its 'tsconfig.json' only lists the project's other tsconfig files.
        const packageJSON = await readJSONFile<PackageJson>('package.json');
        if (packageJSON.devDependencies?.['vue-tsc'] == null) {
            await spawnCommand('2️⃣  Type-check', 'tsc', ['--noEmit', '-p', 'tsconfig.json']);
        } else {
            await spawnCommand('2️⃣  Type-check', 'vue-tsc', ['--build']);
        }

        logOperationSuccess('Code linted and type-checked');
    } catch (error) {
        console.error('❌  Error linting code', error);
        process.exit(1);
    }
}
