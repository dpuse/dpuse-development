// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared';

// ── Local Framework
import { getModuleConfig, logOperationHeader, logOperationSuccess, logStepHeader, type ModuleTypeConfig, readJSONFile } from '@/utilities';
import { putState, uploadModuleConfigToDO, uploadModuleToR2 } from '@/utilities/cloudflare';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function publishProject(): Promise<void> {
    try {
        logOperationHeader('Publish Project');

        const packageJSON = await readJSONFile<PackageJson>('package.json');
        const configJSON = await readJSONFile<ModuleConfig>('config.json');
        const moduleTypeConfig = getModuleConfig(configJSON.id);

        await registerModule('1️⃣ ', packageJSON, configJSON, moduleTypeConfig);

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
