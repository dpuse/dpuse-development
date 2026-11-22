// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared';

// ── Local Framework
import { buildModuleConfig, bumpPackageVersion, getModuleTypeConfig, logOperationHeader } from '@/utilities';
import { logOperationSuccess, readJSONFile, spawnCommand, spawnCommandForOutput } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Synchronise the local repository with the main GitHub repository. */
export async function syncProjectWithGitHub(): Promise<void> {
    try {
        logOperationHeader('Synchronise Project with GitHub');

        const packageJSON = await readJSONFile<PackageJson>('package.json');
        const configJSON = await readJSONFile<ModuleConfig>('config.json');
        const moduleTypeConfig = getModuleTypeConfig(configJSON.id);

        // The push below sends 'main', and a release tags what is on 'main'. A commit made on any other branch would
        // be left behind, with the version already bumped, so nothing is changed unless 'main' is checked out. Git
        // names no branch when a commit, rather than a branch, is checked out.
        const branchOutput = await spawnCommandForOutput('1️⃣  Check branch', 'git', ['branch', '--show-current']);
        const branchName = branchOutput.trim();
        if (branchName !== 'main') throw new Error(`Projects are synchronised from 'main', but ${branchName === '' ? 'no branch' : `'${branchName}'`} is checked out.`);

        await bumpPackageVersion('2️⃣ ', packageJSON);

        await buildModuleConfig('3️⃣ ', packageJSON, moduleTypeConfig);

        await spawnCommand('4️⃣  Stage changes', 'git', ['add', '.']);

        await spawnCommand('5️⃣  Commit changes', 'git', ['commit', '-m', `v${packageJSON.version ?? 'unknown'}`]);

        await spawnCommand('6️⃣  Push changes', 'git', ['push', 'origin', 'main:main']);

        logOperationSuccess(`Project version '${packageJSON.version ?? 'unknown'}' synchronised with GitHub.`);
    } catch (error) {
        console.error('❌  Error synchronising project with GitHub', error);
        process.exit(1);
    }
}
