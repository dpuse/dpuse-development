// ── External Dependencies & Registrations
import path from 'node:path';
import type { RcOptions } from 'npm-check-updates';
import { run as runNpmCheckUpdates } from 'npm-check-updates';

// ── Local (Development) Framework
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, spawnCommand } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function checkDependencies(): Promise<void> {
    try {
        logOperationHeader('Check Dependencies');

        await spawnCommand("1️⃣  Check using 'npm outdated'", 'npm', ['outdated'], true);

        logStepHeader("2️⃣  Check using 'npm-check-updates'");
        let rcOptions: RcOptions = {};
        try {
            rcOptions = await readJSONFile<RcOptions>(path.resolve(process.cwd(), '.ncurc.json'));
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
        }
        await runNpmCheckUpdates({ interactive: true, upgrade: true, dep: 'dev,prod,peer,optional', install: 'never', ...rcOptions });

        await spawnCommand('3️⃣  Install updated dependencies', 'npm', ['install', '--prefer-online']);

        logOperationSuccess('Dependencies checked');
    } catch (error) {
        console.error('❌  Error checking dependencies', error);
        process.exit(1);
    }
}
