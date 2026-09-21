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

        // Not strict here, otherwise an upgraded package with a pinned approval fails the install before step 4 can move its pin.
        await spawnCommand('3️⃣  Install updated dependencies', 'npm', ['install', '--prefer-online', '--no-strict-allow-scripts']);

        // Only packages already approved are re-approved, so a newly added install script still waits for review in step 7.
        // Name-only approvals already cover every version, so only pinned ones need moving and their skipped scripts running.
        const pinnedPackageNames = await getPinnedPackageNames();
        if (pinnedPackageNames.length > 0) {
            await spawnCommand('4️⃣  Move install-script pins to installed versions', 'npm', ['install-scripts', 'approve', ...pinnedPackageNames]);
            await spawnCommand('5️⃣  Run install scripts skipped in step 3', 'npm', ['rebuild', ...pinnedPackageNames]);
        } else {
            logStepHeader('4️⃣  No pinned install-script approvals to move');
        }

        // Prune removes entries for packages not installed on this machine, so elsewhere it would drop macOS-only ones such as 'fsevents'.
        if (process.platform === 'darwin') {
            await spawnCommand('6️⃣  Remove unused install-script entries', 'npm', ['install-scripts', 'prune']);
        } else {
            logStepHeader('6️⃣  Skipped removing unused install-script entries (macOS only)');
        }

        await spawnCommand('7️⃣  List install scripts awaiting review', 'npm', ['install-scripts', 'ls']);

        logOperationSuccess('Dependencies checked');
    } catch (error) {
        console.error('❌  Error checking dependencies', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// Keys are 'name', 'name@version' or '@scope/name@version'. An '@' after the first character marks a pin; it and the version
// are dropped so npm matches every installed version.
async function getPinnedPackageNames(): Promise<string[]> {
    const { allowScripts = {} } = await readJSONFile<{ allowScripts?: Record<string, boolean> }>(path.resolve(process.cwd(), 'package.json'));
    const names = Object.entries(allowScripts)
        .filter(([key, isAllowed]) => isAllowed && key.lastIndexOf('@') > 0)
        .map(([key]) => key.slice(0, key.lastIndexOf('@')));
    return [...new Set(names)];
}
