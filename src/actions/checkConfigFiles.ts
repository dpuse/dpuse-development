// ── External Dependencies & Registrations
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared/component/module';

// ── Local (Development) Framework
import { getModuleConfig, logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function checkConfigFiles(): Promise<void> {
    try {
        logOperationHeader('Check configuration files');

        logStepHeader('1️⃣  Check individual files');
        const configJSON = await readJSONFile<ModuleConfig>('config.json');
        const moduleTypeConfig = getModuleConfig(configJSON.id);
        const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
        await checkConfigFile(moduleDirectory, '.editorconfig');
        await checkConfigFile(moduleDirectory, '.gitattributes');
        await checkConfigFile(moduleDirectory, '.gitignore', [moduleTypeConfig.publishedTo === 'npm' ? '.gitignore_published' : '.gitignore_unpublished']);
        await checkConfigFile(moduleDirectory, '.markdownlint.json');
        await checkConfigFile(moduleDirectory, '.ncurc.json');
        if (['development'].includes(moduleTypeConfig.typeId)) {
            console.info("ℹ️  File 'eslint.config.js' is UNIQUE to this project");
        } else {
            await checkConfigFile(moduleDirectory, 'eslint.config.js', ['eslint.config.default.js']);
        }
        await checkConfigFile(moduleDirectory, 'LICENSE');
        await checkConfigFile(moduleDirectory, 'tsconfig.scripts.json');
        if (['eslint', 'kb'].includes(moduleTypeConfig.typeId)) {
            console.info("ℹ️  File 'vite.config.ts' is NOT required by this project");
        } else if (['app', 'api', 'development', 'shared'].includes(moduleTypeConfig.typeId)) {
            console.info("ℹ️  File 'vite.config.ts' is UNIQUE to this project");
        } else {
            let viteConfigTemplates: string[];
            if (moduleTypeConfig.typeId === 'connector') viteConfigTemplates = ['vite.config.default.ts', 'vite.config.wasm.ts'];
            else if (moduleTypeConfig.typeId === 'tool') viteConfigTemplates = ['vite.config.tool.ts'];
            else viteConfigTemplates = ['vite.config.default.ts'];
            await checkConfigFile(moduleDirectory, 'vite.config.ts', viteConfigTemplates);
        }
        if (['eslint', 'kb'].includes(moduleTypeConfig.typeId)) {
            console.info("ℹ️  File 'vitest.config.ts' is NOT required by this project");
        } else {
            await checkConfigFile(moduleDirectory, 'vitest.config.ts');
        }

        logOperationSuccess('Configuration files checked');
    } catch (error) {
        console.error('❌  Error checking configuration files', error);
        process.exit(1);
    }
}

// ── Helpers ─────────────────────────────────────────────────────────────────────────────────────────────────────────────

async function checkConfigFile(moduleDirectory: string, checkFileName: string, templateFileNames: string[] = []): Promise<void> {
    const checkFilePath = path.resolve(process.cwd(), checkFileName);
    const templates = templateFileNames.length > 0 ? templateFileNames : [checkFileName];

    let checkFileContent;
    try {
        checkFileContent = await readTextFile(checkFilePath);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }

    for (const templateFileName of templates) {
        const templatePath = path.resolve(moduleDirectory, `../${templateFileName}`);
        const templateContent = await readTextFile(templatePath);
        if (checkFileContent === templateContent) {
            console.info(`ℹ️  File '${checkFileName.split('_', 1)[0] ?? checkFileName}' is the same as '${templateFileName}'`);
            return;
        }
    }

    console.info(`⚠️  File '${checkFileName.split('_', 1)[0] ?? checkFileName}' is NOT the same`);
}
