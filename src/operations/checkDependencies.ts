/* eslint-disable unicorn/no-process-exit */

// Development Core
import { logOperationHeader, logOperationSuccess, spawnCommand } from '@/utilities';

// Actions ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function checkDependencies(): Promise<void> {
    try {
        logOperationHeader('Check Dependencies');

        await spawnCommand("1️⃣  Check using 'npm outdated'", 'npm', ['outdated'], true);

        await spawnCommand("2️⃣  Check using 'npm-check-updates'", 'npm-check-updates', ['-i', '--peer']);

        logOperationSuccess('Dependencies checked.');
    } catch (error) {
        console.error('❌ Error checking dependencies.', error);
        process.exit(1);
    }
}
