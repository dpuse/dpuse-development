// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';
import { safeParse } from 'valibot';

// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared/component/module';
import type { ConnectorActionName, ConnectorConfig } from '@dpuse/dpuse-shared/component/module/connector';
import { connectorConfigSchema, determineConnectorUsageId } from '@dpuse/dpuse-shared/component/module/connector';
import { type ContextActionName, type ContextConfig, contextConfigSchema } from '@dpuse/dpuse-shared/component/module/context';
import { type PresenterActionName, type PresenterConfig, presenterConfigSchema } from '@dpuse/dpuse-shared/component/module/presenter';

// ── Local (Development) Framework
import {
    execCommand,
    extractOperationsFromSource,
    getModuleConfig,
    logOperationHeader,
    logOperationSuccess,
    logStepHeader,
    readJSONFile,
    readTextFile,
    readTextFileOrNull,
    removeFile,
    spawnCommand,
    writeJSONFile,
    writeTextFile
} from '@/utilities';
import { putState, uploadModuleConfigToDO, uploadModuleToR2 } from '@/utilities/cloudflare';
import { documentBundleSizes } from './documentBundleSizes';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface OperationConfig {
    id?: string;
    version?: string;
    actionNames?: string[];
    usageId?: string | null;
}

// ── Actions - Build ──────────────────────────────────────────────────────────────────────────────────────────────────

export async function buildProject(): Promise<void> {
    try {
        logOperationHeader('Build Project');

        await spawnCommand('1️⃣  Bundle project', 'vite', ['build']);

        logOperationSuccess('Project built');
    } catch (error) {
        console.error('❌  Error building project', error);
        process.exit(1);
    }
}

// ── Actions - Publish ────────────────────────────────────────────────────────────────────────────────────────────────

export async function publishProject(): Promise<void> {
    try {
        logOperationHeader('Publish Project');

        const packageJSON = await readJSONFile<PackageJson>('package.json');
        const configJSON = await readJSONFile<ModuleConfig>('config.json');
        const moduleTypeConfig = getModuleConfig(configJSON.id);

        if (moduleTypeConfig.typeId === 'app') {
            logStepHeader('1️⃣  Register module');
            await putState();
        } else if (moduleTypeConfig.typeId === 'engine') {
            logStepHeader('1️⃣  Register module');
            await uploadModuleToR2(packageJSON, `dpuse-engine-eu/${moduleTypeConfig.uploadGroupName ?? 'unknown'}`);
            await uploadModuleConfigToDO(configJSON);
        } else if (moduleTypeConfig.uploadGroupName === undefined) {
            logStepHeader('1️⃣  Publishing NOT required');
        } else {
            logStepHeader('1️⃣  Register module');
            const moduleTypeName = configJSON.id.split('-').slice(2).join('-');
            await uploadModuleToR2(packageJSON, `dpuse-engine-eu/${moduleTypeConfig.uploadGroupName}/${moduleTypeName}`);
            await uploadModuleConfigToDO(configJSON);
        }

        logOperationSuccess(`Project version '${packageJSON.version ?? 'unknown'}' published.`);
    } catch (error) {
        console.error('❌  Error publishing project', error);
        process.exit(1);
    }
}

// ── Actions - Release ────────────────────────────────────────────────────────────────────────────────────────────────

export async function releaseProject(): Promise<void> {
    try {
        logOperationHeader('Release Project');

        const packageJSON = await readJSONFile<PackageJson>('package.json');
        let configJSON = await readJSONFile<ModuleConfig>('config.json');

        await bumpPackageVersion('1️⃣ ', packageJSON);

        const moduleTypeConfig = getModuleConfig(configJSON.id);

        switch (moduleTypeConfig.typeId) {
            case 'connector':
                configJSON = await buildConnectorProjectConfig('2️⃣ ', packageJSON);
                break;
            case 'context':
                configJSON = await buildContextProjectConfig('2️⃣ ', packageJSON);
                break;
            case 'presenter':
                configJSON = await buildPresenterProjectConfig('2️⃣ ', packageJSON);
                break;
            default:
                configJSON = await buildProjectConfig('2️⃣ ', packageJSON);
        }

        await spawnCommand('3️⃣  Bundle project', 'vite', ['build']);

        await execCommand('4️⃣  Stage changes', 'git', ['add', '.']);

        await execCommand('5️⃣  Commit changes', 'git', ['commit', '-m', `v${packageJSON.version ?? 'unknown'}`]);

        await execCommand('6️⃣  Push changes', 'git', ['push', 'origin', 'main:main']);

        if (moduleTypeConfig.typeId === 'app') {
            logStepHeader('7️⃣  Register module');
            await putState();
        } else if (moduleTypeConfig.typeId === 'engine') {
            logStepHeader('7️⃣  Register module');
            await uploadModuleToR2(packageJSON, `dpuse-engine-eu/${moduleTypeConfig.uploadGroupName ?? 'unknown'}`);
            await uploadModuleConfigToDO(configJSON); // This MUST follow 'uploadModuleToR2', otherwise the app will receive a message a new engine is available and try to access it before it is uploaded to R2.
        } else if (moduleTypeConfig.uploadGroupName === undefined) {
            logStepHeader('7️⃣  Registration NOT required');
        } else {
            logStepHeader('7️⃣  Register module');
            const moduleTypeName = configJSON.id.split('-').slice(2).join('-');
            await uploadModuleToR2(packageJSON, `dpuse-engine-eu/${moduleTypeConfig.uploadGroupName}/${moduleTypeName}`);
            await uploadModuleConfigToDO(configJSON); // This MUST follow 'uploadModuleToR2', otherwise the app will receive a message a new module is available and try to access it before it is uploaded to R2.
        }

        if (moduleTypeConfig.publishedTo === 'npm') {
            const npmrcFileName = '.npmrc';
            try {
                await writeTextFile(npmrcFileName, `registry=https://registry.npmjs.org/\n//registry.npmjs.org/:_authToken=${process.env['NPM_TOKEN'] ?? ''}`);
                await spawnCommand('8️⃣  Publish to npm', 'npm', ['publish', '--access', 'public']);
            } finally {
                await removeFile(npmrcFileName);
            }
        } else {
            logStepHeader(`8️⃣  Publishing NOT required for package with type identifier of '${moduleTypeConfig.typeId}'.`);
        }

        logOperationSuccess(`Project version '${packageJSON.version ?? 'unknown'}' released.`);
    } catch (error) {
        console.error('❌  Error releasing project', error);
        process.exit(1);
    }
}

async function buildProjectConfig(stepIcon: string, packageJSON: PackageJson): Promise<ModuleConfig> {
    logStepHeader(`${stepIcon} Build project configuration`);

    const configJSON = await readJSONFile<ModuleConfig>('config.json');
    if (packageJSON.name != null) configJSON.id = packageJSON.name.replace('@dpuse/', '');
    if (packageJSON.version != null) configJSON.version = packageJSON.version;
    configJSON.icon ??= await readTextFileOrNull('logo.svg');
    configJSON.iconDark ??= await readTextFileOrNull('logoDark.svg');
    await writeJSONFile('config.json', configJSON);

    return configJSON;
}

async function buildConnectorProjectConfig(stepIcon: string, packageJSON: PackageJson): Promise<ConnectorConfig> {
    logStepHeader(`${stepIcon} Build connector project configuration`);

    const [configJSON, indexCode] = await Promise.all([readJSONFile<ConnectorConfig>('config.json'), readTextFile('src/index.ts')]);

    const response = safeParse(connectorConfigSchema, configJSON);
    if (!response.success) {
        console.error('❌  Configuration is invalid:');
        console.table(response.issues);
        throw new Error('Configuration is invalid');
    }

    const operations = extractOperationsFromSource<ConnectorActionName>(indexCode);
    const usageId = determineConnectorUsageId(operations);

    return await processOperations<ConnectorConfig>(packageJSON, configJSON, operations, usageId);
}

async function buildContextProjectConfig(stepIcon: string, packageJSON: PackageJson): Promise<ContextConfig> {
    logStepHeader(`${stepIcon} Build context project configuration`);

    const [configJSON, indexCode] = await Promise.all([readJSONFile<ContextConfig>('config.json'), readTextFile('src/index.ts')]);

    const response = safeParse(contextConfigSchema, configJSON);
    if (!response.success) {
        console.error('❌  Configuration is invalid:');
        console.table(response.issues);
        throw new Error('Configuration is invalid');
    }

    const operations = extractOperationsFromSource<ContextActionName>(indexCode);
    return await processOperations<ContextConfig>(packageJSON, configJSON, operations);
}

async function buildPresenterProjectConfig(stepIcon: string, packageJSON: PackageJson): Promise<PresenterConfig> {
    logStepHeader(`${stepIcon} Build presenter project configuration`);

    const [configJSON, indexCode] = await Promise.all([readJSONFile<PresenterConfig>('config.json'), readTextFile('src/index.ts')]);

    const response = safeParse(presenterConfigSchema, configJSON);
    if (!response.success) {
        console.error('❌  Configuration is invalid:');
        console.table(response.issues);
        throw new Error('Configuration is invalid');
    }

    const operations = extractOperationsFromSource<PresenterActionName>(indexCode);
    return await processOperations<PresenterConfig>(packageJSON, configJSON, operations);
}

async function processOperations<T extends OperationConfig>(packageJSON: PackageJson, configJSON: T, operations: string[], usageId?: string): Promise<T> {
    if (operations.length > 0) {
        console.info(`ℹ️  Implements ${String(operations.length)} operations:`);
        console.table(operations);
    } else console.warn('⚠️   Implements no operations');

    if (usageId === 'unknown') console.warn('⚠️   No usage identified');
    else if (usageId) console.info(`ℹ️  Supports '${usageId}' usage.`);

    if (packageJSON.name != null) configJSON.id = packageJSON.name.replace('@dpuse/', '').replace('@dpuse/', '');
    if (packageJSON.version != null) configJSON.version = packageJSON.version;
    configJSON.actionNames = operations;
    if (usageId !== undefined) configJSON.usageId = usageId;

    await writeJSONFile('config.json', configJSON);

    return configJSON;
}

// ── Actions - Sync ───────────────────────────────────────────────────────────────────────────────────────────────────

export async function syncProjectWithGitHub(): Promise<void> {
    try {
        logOperationHeader('Synchronise Project with GitHub');

        const packageJSON = await readJSONFile<PackageJson>('package.json');
        const configJSON = await readJSONFile<ModuleConfig>('config.json');

        await bumpPackageVersion('1️⃣ ', packageJSON);

        const moduleTypeConfig = getModuleConfig(configJSON.id);

        switch (moduleTypeConfig.typeId) {
            case 'connector':
                await buildConnectorProjectConfig('2️⃣ ', packageJSON);
                break;
            case 'context':
                await buildContextProjectConfig('2️⃣ ', packageJSON);
                break;
            case 'presenter':
                await buildPresenterProjectConfig('2️⃣ ', packageJSON);
                break;
            default:
                await buildProjectConfig('2️⃣ ', packageJSON);
        }

        await execCommand('3️⃣  Stage changes', 'git', ['add', '.']);

        await execCommand('4️⃣  Commit changes', 'git', ['commit', '-m', `v${packageJSON.version ?? 'unknown'}`]);

        await execCommand('5️⃣  Push changes', 'git', ['push', 'origin', 'main:main']);

        logOperationSuccess(`Project version '${packageJSON.version ?? 'unknown'}' synchronised with GitHub.`);
    } catch (error) {
        console.error('❌  Error synchronising project with GitHub', error);
        process.exit(1);
    }
}

// ── Actions - Test ───────────────────────────────────────────────────────────────────────────────────────────────────

export function testProject(): void {
    try {
        logOperationHeader('Test Project');

        console.error('\n❌  No tests implemented.\n');
    } catch (error) {
        console.error('❌  Error testing project', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

async function bumpPackageVersion(stepIcon: string, packageJSON: PackageJson, path = './'): Promise<void> {
    logStepHeader(`${stepIcon} Bump project version`);

    if (packageJSON.version == null) {
        packageJSON.version = '0.0.001';
        console.warn(`⚠️  Project version initialised to '${packageJSON.version}'.`);
    } else {
        const oldVersion = packageJSON.version;
        const versionSegments = packageJSON.version.split('.');
        packageJSON.version = `${versionSegments[0] ?? 'unknown'}.${versionSegments[1] ?? 'unknown'}.${String(Number(versionSegments[2]) + 1)}`;
        console.info(`Project version bumped from '${oldVersion}' to '${packageJSON.version}'.`);
    }
    await writeJSONFile(`${path}package.json`, packageJSON);
}
