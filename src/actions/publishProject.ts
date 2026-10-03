// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared';

// ── Local Framework
import { getModuleConfig, logOperationHeader, logOperationSuccess, logStepHeader, type ModuleTypeConfig, readJSONFile, spawnCommand } from '@/utilities';
import { putState, uploadModuleConfigToDO, uploadModuleToR2 } from '@/utilities/cloudflare';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Publishes the project to npm, uploads it to DPUse, or both, as its module type requires. Run by the 'publish.yml' workflow. */
export async function publishProject(): Promise<void> {
    try {
        logOperationHeader('Publish Project');

        const packageJSON = await readJSONFile<PackageJson>('package.json');
        const configJSON = await readJSONFile<ModuleConfig>('config.json');
        const moduleTypeConfig = getModuleConfig(configJSON.id);

        // Where a module goes is set by its type, so every project calls this the same way. Tools go to both places: npm
        // first, so the app is never told of a version whose npm publish failed.
        if (moduleTypeConfig.publishedTo === 'npm') {
            await spawnCommand('1️⃣  Publish to npm', 'npm', ['publish', '--provenance']);
        } else {
            logStepHeader('1️⃣  Publishing to npm NOT required');
        }

        await registerModule('2️⃣ ', packageJSON, configJSON, moduleTypeConfig);

        // The knowledge base has no module to register. It is published by its own 'deploy' script, which loads the docs into
        // Cloudflare KV and deploys the site.
        if (moduleTypeConfig.publishedTo === 'kb') await spawnCommand('3️⃣  Deploy', 'npm', ['run', 'deploy']);

        logOperationSuccess(`Project version '${packageJSON.version ?? 'unknown'}' published.`);
    } catch (error) {
        console.error('❌  Error publishing project', error);
        process.exit(1);
    }
}

// Also run as the last step of 'releaseProject'.
export async function registerModule(stepIcon: string, packageJSON: PackageJson, configJSON: ModuleConfig, moduleTypeConfig: ModuleTypeConfig): Promise<void> {
    if (moduleTypeConfig.typeId === 'app') {
        logStepHeader(`${stepIcon} Register module`);
        await putState();
    } else if (moduleTypeConfig.typeId === 'engine') {
        logStepHeader(`${stepIcon} Register module`);
        await uploadModuleToR2(packageJSON, `dpuse-engine-eu/${moduleTypeConfig.uploadGroupName ?? 'unknown'}`);
        await uploadModuleConfigToDO(configJSON); // This MUST follow 'uploadModuleToR2', otherwise the app will receive a message a new engine is available and try to access it before it is uploaded to R2.
    } else if (moduleTypeConfig.uploadGroupName === undefined) {
        logStepHeader(`${stepIcon} Registration NOT required`);
    } else {
        logStepHeader(`${stepIcon} Register module`);
        const moduleTypeName = configJSON.id.split('-').slice(2).join('-');
        await uploadModuleToR2(packageJSON, `dpuse-engine-eu/${moduleTypeConfig.uploadGroupName}/${moduleTypeName}`);
        await uploadModuleConfigToDO(configJSON); // This MUST follow 'uploadModuleToR2', otherwise the app will receive a message a new module is available and try to access it before it is uploaded to R2.
    }
}
