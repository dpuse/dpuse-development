// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared';

// ── Local Framework
import { documentProject } from '@/actions/documentProject';
import { registerModule } from '@/actions/publishProject';
import {
    buildModuleConfig,
    bumpPackageVersion,
    execCommand,
    getModuleConfig,
    logOperationHeader,
    logOperationSuccess,
    logStepHeader,
    readJSONFile,
    spawnCommand
} from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Bump version, builds config, builds project, regenerates the README, synchronise with GitHub and publish to npm or Cloudflare. */
export async function releaseProject(allowedLicenses = 'MIT', isModuleLevel = false): Promise<void> {
    try {
        logOperationHeader('Release Project');

        const packageJSON = await readJSONFile<PackageJson>('package.json');
        const configJSON = await readJSONFile<ModuleConfig>('config.json');
        const moduleTypeConfig = getModuleConfig(configJSON.id);

        await bumpPackageVersion('1️⃣ ', packageJSON);

        const builtConfigJSON = await buildModuleConfig('2️⃣ ', packageJSON, moduleTypeConfig);

        await spawnCommand('3️⃣  Bundle project', 'vite', ['build']);

        // After the build, so the bundle sizes are the released bundle's, and before staging, so the README is committed
        // with the release. Its governance step runs the tests, so a failing test stops the release before anything is pushed.
        logStepHeader('4️⃣  Regenerate README');
        await documentProject(allowedLicenses, isModuleLevel);

        await execCommand('5️⃣  Stage changes', 'git', ['add', '.']);

        await execCommand('6️⃣  Commit changes', 'git', ['commit', '-m', `v${packageJSON.version ?? 'unknown'}`]);

        await execCommand('7️⃣  Push changes', 'git', ['push', 'origin', 'main:main']);

        await registerModule('8️⃣ ', packageJSON, builtConfigJSON, moduleTypeConfig);

        // The release triggers the 'publish.yml' workflow, which publishes to npm through trusted publishing, so no token is needed here.
        if (moduleTypeConfig.publishedTo === 'npm') {
            const tagName = `v${packageJSON.version ?? 'unknown'}`;
            await spawnCommand('9️⃣  Create GitHub release', 'gh', ['release', 'create', tagName, '--target', 'main', '--generate-notes', '--latest']);
        } else {
            logStepHeader(`9️⃣  Publishing NOT required for package with type identifier of '${moduleTypeConfig.typeId}'.`);
        }

        logOperationSuccess(`Project version '${packageJSON.version ?? 'unknown'}' released.`);
    } catch (error) {
        console.error('❌  Error releasing project', error);
        process.exit(1);
    }
}
