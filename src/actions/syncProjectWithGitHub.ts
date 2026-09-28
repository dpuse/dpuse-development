// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared/component/module';

// ── Local Framework
import { buildModuleConfig, bumpPackageVersion, execCommand, getModuleConfig, logOperationHeader, logOperationSuccess, readJSONFile } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Synchronise the local repository with the main GitHub repository. */
export async function syncProjectWithGitHub(): Promise<void> {
    try {
        logOperationHeader('Synchronise Project with GitHub');

        const packageJSON = await readJSONFile<PackageJson>('package.json');
        const configJSON = await readJSONFile<ModuleConfig>('config.json');
        const moduleTypeConfig = getModuleConfig(configJSON.id);

        await bumpPackageVersion('1️⃣ ', packageJSON);

        await buildModuleConfig('2️⃣ ', packageJSON, moduleTypeConfig);

        await execCommand('3️⃣  Stage changes', 'git', ['add', '.']);

        await execCommand('4️⃣  Commit changes', 'git', ['commit', '-m', `v${packageJSON.version ?? 'unknown'}`]);

        await execCommand('5️⃣  Push changes', 'git', ['push', 'origin', 'main:main']);

        logOperationSuccess(`Project version '${packageJSON.version ?? 'unknown'}' synchronised with GitHub.`);
    } catch (error) {
        console.error('❌  Error synchronising project with GitHub', error);
        process.exit(1);
    }
}
