/* eslint-disable unicorn/no-process-exit */

// Development Core
import { logOperationHeader, logOperationSuccess, spawnCommand } from '@/utilities';

// Actions ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function lintCode(): Promise<void> {
    try {
        logOperationHeader('Lint Code');

        await spawnCommand('1️⃣  Lint', 'eslint', ['.']);

        logOperationSuccess('Code linted.');
    } catch (error) {
        console.error('❌ Error linting code.', error);
        process.exit(1);
    }
}
