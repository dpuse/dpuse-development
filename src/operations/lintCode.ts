// Development Core
import { logOperationHeader, logOperationSuccess, spawnCommand } from '@/utilities';

// Actions ─────────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function lintCode(): Promise<void> {
    try {
        logOperationHeader('Lint Code');

        await spawnCommand('1️⃣  Lint', 'eslint', ['.']);

        logOperationSuccess('Code linted.');
    } catch (error) {
        console.error('❌ Error linting code.', error);
        // eslint-disable-next-line unicorn/no-process-exit -- This only runs from package script.
        process.exit(1);
    }
}
