// ── External Dependencies & Registrations
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared/component/module';

// ── Local (Development) Framework
import { getModuleConfig, logOperationHeader, logOperationSuccess, readJSONFile, readTextFile } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function checkConfigFiles(dependencies: string[] = []): Promise<void> {
    try {
        logOperationHeader("Update '@dpuse/dpuse' Dependencies");

        for (const dependency of dependencies) {
            if (dependency !== 'development') continue;

            const configJSON = await readJSONFile<ModuleConfig>('config.json');
            const moduleTypeConfig = getModuleConfig(configJSON.id);

            const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
            await syncConfigFile(moduleDirectory, '../', '.editorconfig');
            await syncConfigFile(moduleDirectory, '../', '.gitattributes');
            await syncConfigFile(moduleDirectory, '../', moduleTypeConfig.isPublished ? '.gitignore_published' : '.gitignore_unpublished', '.gitignore2');
            await syncConfigFile(moduleDirectory, '../', '.markdownlint.json');
            await syncConfigFile(moduleDirectory, '../', 'LICENSE');
        }

        logOperationSuccess("'@dpuse/dpuse' dependencies updated.");
    } catch (error) {
        console.error("❌ Error updating '@dpuse/dpuse' dependencies.", error);
        process.exit(1);
    }
}

// ── Helpers ─────────────────────────────────────────────────────────────────────────────────────────────────────────────

async function syncConfigFile(moduleDirectory: string, templateFilePath: string, fileName: string, destinationFileName?: string): Promise<void> {
    const templatePath = path.resolve(moduleDirectory, `${templateFilePath}${fileName}`);
    const templateContent = await readTextFile(templatePath);

    const destinationPath = path.resolve(process.cwd(), fileName.split('_', 1)[0] ?? fileName);

    let destinationContent;
    try {
        destinationContent = await readTextFile(destinationPath);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }

    if (destinationContent === templateContent) {
        console.info(`ℹ️ File '${fileName.split('_', 1)[0] ?? fileName}' is already up to date.`);
        return;
    }

    console.info(`⚠️ File '${destinationFileName ?? fileName}' is not the same.`);
}
