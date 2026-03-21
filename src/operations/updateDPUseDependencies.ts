/**
 * Update datapos dependencies utilities.
 */

/* eslint-disable unicorn/no-process-exit */

// Dependencies - Vendor.
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Dependencies - Framework.
import type { ModuleConfig } from '@datapos/datapos-shared/component';
import type { ModuleTypeConfig } from '@/utilities';
import { getModuleConfig, logOperationHeader, logOperationSuccess, readJSONFile, readTextFile, spawnCommand, writeTextFile } from '@/utilities';

// Constants
const STEP_ICONS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

// Operations - Update datapos dependencies.
async function updateDPUseDependencies(dependencies: string[] = []): Promise<void> {
    try {
        logOperationHeader("Update '@dpuse/dpuse' Dependencies");

        for (const [index, dependency] of dependencies.entries()) {
            const stepIcon = STEP_ICONS.at(index) ?? '🔢';
            if (dependency === 'eslint') {
                await spawnCommand(`${stepIcon}  Update '${dependency}'`, 'npm', ['install', '@dpuse/eslint-config-dpuse@latest']);
            } else {
                await spawnCommand(`${stepIcon}  Update '${dependency}'`, 'npm', ['install', `@dpuse/dpuse-${dependency}@latest`]);
                if (dependency === 'development') {
                    const configJSON = await readJSONFile<ModuleConfig>('config.json');
                    const moduleTypeConfig = getModuleConfig(configJSON.id);

                    await syncProjectConfigFiles(moduleTypeConfig);
                }
            }
        }

        logOperationSuccess("'@dpuse/dpuse' dependencies updated.");
    } catch (error) {
        console.error("❌ Error updating '@dpuse/dpuse' dependencies.", error);
        process.exit(1);
    }
}

// Helpers - Synchronise project configuration files.
async function syncProjectConfigFiles(moduleTypeConfig: ModuleTypeConfig): Promise<void> {
    const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
    await syncConfigFile(moduleDirectory, '../', '.editorconfig');
    await syncConfigFile(moduleDirectory, '../', '.gitattributes');
    await (moduleTypeConfig.isPublish
        ? syncConfigFile(moduleDirectory, '../', '.gitignore_published', '.gitignore2')
        : syncConfigFile(moduleDirectory, '../', '.gitignore_unpublished', '.gitignore2'));
    await syncConfigFile(moduleDirectory, '../', '.markdownlint.json');
    await syncConfigFile(moduleDirectory, '../', 'LICENSE');
    await syncConfigFile(moduleDirectory, '../', 'tsconfig.json', 'tsconfig2.json');

    if (moduleTypeConfig.typeId === 'eslint') {
        // TODO
    } else {
        await syncConfigFile(moduleDirectory, '../', 'eslint.config.ts', 'eslint.config2.ts');
        await syncConfigFile(moduleDirectory, '../', 'vite.config.ts', 'vite.config2.ts');
        await syncConfigFile(moduleDirectory, '../', 'vitest.config.ts', 'vitest.config2.ts');
    }
}

async function syncConfigFile(moduleDirectory: string, templateFilePath: string, fileName: string, destinationFileName?: string): Promise<void> {
    const templatePath = path.resolve(moduleDirectory, `${templateFilePath}${fileName}`);
    const templateContent = await readTextFile(templatePath);

    const destinationPath = path.resolve(process.cwd(), fileName.split('_')[0] ?? fileName);
    const destinationWritePath = path.resolve(process.cwd(), destinationFileName ?? fileName);

    let destinationContent;
    try {
        destinationContent = await readTextFile(destinationPath);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }

    if (destinationContent === templateContent) {
        console.info(`ℹ️  File '${fileName.split('_')[0] ?? fileName}' is already up to date.`);
        return;
    }

    await writeTextFile(destinationWritePath, templateContent);
    console.info(`ℹ️  File '${destinationFileName ?? fileName}' synchronised.`);
}

// Exposures
export { updateDPUseDependencies };
