// ── External Dependencies & Registrations
import path from 'node:path';
import type { RcOptions } from 'npm-check-updates';
import { run as runNpmCheckUpdates } from 'npm-check-updates';

// ── Local Framework
import { reportIgnoredAdvisories } from '@/actions/auditDependencies';
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, spawnCommand } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Identifies outdated dependencies using npm outdated and npm-check-updates with option to automatically install
 *  latest versions. */
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
        // No audit summary, as step 4 reports what is left once it has fixed what it can.
        await spawnCommand('3️⃣  Install updated dependencies', 'npm', ['install', '--prefer-online', '--no-strict-allow-scripts', '--no-audit', '--no-fund']);

        // Only upgrades the version ranges in package.json already allow; never '--force', which makes breaking ones. Runs before
        // the pins move in step 5, so a package it upgrades has its pin moved too. npm exits with an error while vulnerabilities
        // it cannot fix remain, such as those waiting on an upstream release, so that is reported without stopping the check.
        await spawnCommand('4️⃣  Fix vulnerabilities where a compatible upgrade exists', 'npm', ['audit', 'fix', '--no-strict-allow-scripts', '--no-fund'], true);
        await reportIgnoredAdvisories('4️⃣  Name the advisories above that the CI audit ignores');

        // Only packages already approved are re-approved, so a newly added install script still waits for review in step 8.
        // Name-only approvals already cover every version, so only pinned ones need moving. Runs before prune, which would
        // otherwise delete a pin to an upgraded version as 'not installed' before it could be moved.
        const pinnedPackageNames = await getPinnedPackageNames();
        if (pinnedPackageNames.length > 0) {
            await spawnCommand('5️⃣  Move install-script pins to installed versions', 'npm', ['install-scripts', 'approve', ...pinnedPackageNames]);
        } else {
            logStepHeader('5️⃣  No pinned install-script approvals to move');
        }

        // Runs before the rebuild in step 7. A rebuild leaves npm's record of 'node_modules' out of date, and prune then misses
        // install scripts that 'npm install' still sees, as with 'fsevents' (npm 12.0.1). Also macOS only, as elsewhere it drops
        // entries for macOS-only packages that are not installed.
        if (process.platform === 'darwin') {
            await spawnCommand('6️⃣  Remove unused install-script entries', 'npm', ['install-scripts', 'prune']);
        } else {
            logStepHeader('6️⃣  Skipped removing unused install-script entries (macOS only)');
        }

        // Not strict, so any install script still awaiting review is reported once, by step 8.
        if (pinnedPackageNames.length > 0) {
            await spawnCommand('7️⃣  Run install scripts skipped in steps 3 and 4', 'npm', ['rebuild', ...pinnedPackageNames, '--no-strict-allow-scripts']);
        }

        // The same check a plain 'npm install' makes, which 'npm install-scripts ls' does not always agree with. Fails listing any
        // install scripts still awaiting review. Step 4 has already reported the audit.
        await spawnCommand('8️⃣  Confirm every install script is reviewed', 'npm', ['install', '--strict-allow-scripts', '--no-audit', '--no-fund']);

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
