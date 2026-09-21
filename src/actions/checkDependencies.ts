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

        // Not strict here, otherwise an upgraded package with a pinned approval fails the install before step 5 can move its pin.
        await spawnCommand('3️⃣  Install updated dependencies', 'npm', ['install', '--prefer-online', '--no-strict-allow-scripts']);

        // Runs before the rebuild in step 6. A rebuild leaves npm's record of 'node_modules' out of date, and prune then misses
        // install scripts that 'npm install' still sees, as with 'fsevents' (npm 12.0.1). Also macOS only, as elsewhere it drops
        // entries for macOS-only packages that are not installed.
        if (process.platform === 'darwin') {
            await spawnCommand('4️⃣  Remove unused install-script entries', 'npm', ['install-scripts', 'prune']);
        } else {
            logStepHeader('4️⃣  Skipped removing unused install-script entries (macOS only)');
        }

        // Only packages already approved are re-approved, so a newly added install script still waits for review in step 7.
        // Name-only approvals already cover every version, so only pinned ones need moving and their skipped scripts running.
        const pinnedPackageNames = await getPinnedPackageNames();
        if (pinnedPackageNames.length > 0) {
            await spawnCommand('5️⃣  Move install-script pins to installed versions', 'npm', ['install-scripts', 'approve', ...pinnedPackageNames]);
            await spawnCommand('6️⃣  Run install scripts skipped in step 3', 'npm', ['rebuild', ...pinnedPackageNames]);
        } else {
            logStepHeader('5️⃣  No pinned install-script approvals to move');
        }

        // The same check a plain 'npm install' makes, which 'npm install-scripts ls' does not always agree with. Fails listing any
        // install scripts still awaiting review.
        await spawnCommand('7️⃣  Confirm every install script is reviewed', 'npm', ['install', '--strict-allow-scripts']);

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
