// ── External Dependencies & Registrations
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared/component/module';

// ── Local (Development) Framework
import { getModuleConfig, logOperationHeader, logOperationSuccess, readJSONFile, readTextFile } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function checkConfigFiles(): Promise<void> {
    try {
        logOperationHeader('Check configuration files.');

        const configJSON = await readJSONFile<ModuleConfig>('config.json');
        const moduleTypeConfig = getModuleConfig(configJSON.id);
        const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
        await checkConfigFile(moduleDirectory, '.editorconfig');
        await checkConfigFile(moduleDirectory, '.gitattributes');
        await checkConfigFile(moduleDirectory, '.gitignore', moduleTypeConfig.publishedTo === 'npm' ? '.gitignore_published' : '.gitignore_unpublished');
        await checkConfigFile(moduleDirectory, '.markdownlint.json');
        await checkConfigFile(moduleDirectory, '.ncurc.json');
        await checkConfigFile(moduleDirectory, 'LICENSE');
        await checkConfigFile(moduleDirectory, 'tsconfig.scripts.json');
        await checkConfigFile(moduleDirectory, 'vite.config.ts', moduleTypeConfig.typeId === 'tool' ? 'vite.config.tool.ts' : 'vite.config.default.ts');
        await checkConfigFile(moduleDirectory, 'vitest.config.ts');

        logOperationSuccess('Configuration files checked.');
    } catch (error) {
        console.error('❌  Error checking configuration files.', error);
        process.exit(1);
    }
}

// ── Helpers ─────────────────────────────────────────────────────────────────────────────────────────────────────────────

async function checkConfigFile(moduleDirectory: string, checkFileName: string, templateFileName?: string): Promise<void> {
    const checkFilePath = path.resolve(process.cwd(), checkFileName);

    const templatePath = path.resolve(moduleDirectory, `../${templateFileName ?? checkFileName}`);

    let checkFileContent;
    try {
        checkFileContent = await readTextFile(checkFilePath);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }

    const templateContent = await readTextFile(templatePath);

    if (checkFileContent === templateContent) {
        console.info(`ℹ️  File '${checkFileName.split('_', 1)[0] ?? checkFileName}' is the same`);
        return;
    }

    console.info(`⚠️  File '${checkFileName.split('_', 1)[0] ?? checkFileName}' is NOT the same.`);
}
