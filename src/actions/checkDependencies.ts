// ── External Dependencies & Registrations
import { run as runNpmCheckUpdates } from 'npm-check-updates';

// ── Local (Development) Framework
import { logOperationHeader, logOperationSuccess, logStepHeader, spawnCommand } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function checkDependencies(): Promise<void> {
    try {
        logOperationHeader('Check Dependencies');

        await spawnCommand("1️⃣  Check using 'npm outdated'", 'npm', ['outdated'], true);

        logStepHeader("2️⃣  Check using 'npm-check-updates'");
        await runNpmCheckUpdates({ interactive: true, upgrade: true, dep: 'dev,prod,peer,optional', install: 'never' });

        await spawnCommand('3️⃣  Install updated dependencies', 'npm', ['install', '--prefer-online']);

        logOperationSuccess('Dependencies checked.');
    } catch (error) {
        console.error('❌  Error checking dependencies.', error);
        process.exit(1);
    }
}
