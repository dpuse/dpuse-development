// ── External Dependencies & Registrations
import { fileURLToPath } from 'node:url';
import type { PackageJson } from 'type-fest';
import path from 'node:path';

// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared';

// ── Local Framework
import {
    getModuleConfig,
    logOperationHeader,
    logOperationSuccess,
    logStepHeader,
    ModuleTypeConfig,
    readJSONFile,
    readTextFile,
    readTextFileOrNull,
    RUST_WORKSPACE_PATH
} from '@/utilities';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const PRETTIER_CONFIG_REFERENCE = '@dpuse/dpuse-development/prettierrc';
const TEMPLATE_REPOSITORY_NAME = 'dpuse-development'; // Stands in for each project's own name in the SECURITY.md template.

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function checkConfigFiles(): Promise<void> {
    try {
        logOperationHeader('Check configuration files');

        logStepHeader('1️⃣  Check individual files');
        const configJSON = await readJSONFile<ModuleConfig>('config.json');
        const packageJSON = await readJSONFile<PackageJson>('package.json');
        const isPrivate = packageJSON.private === true; // Private packages have no workflows or security policy.
        const moduleTypeConfig = getModuleConfig(configJSON.id);
        const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
        await checkConfigFile(moduleDirectory, '.editorconfig');
        await checkConfigFile(moduleDirectory, '.gitattributes');
        await checkConfigFile(moduleDirectory, '.gitignore', ['.gitignore_default']);
        await checkConfigFile(moduleDirectory, '.markdownlint.json');
        await checkConfigFile(moduleDirectory, '.ncurc.json');
        await checkESLintConfig(moduleTypeConfig, moduleDirectory);
        await checkConfigFile(moduleDirectory, 'LICENSE');
        await checkTSConfig(moduleTypeConfig, moduleDirectory);
        await checkTSConfigScripts(moduleTypeConfig, moduleDirectory);
        await checkViteConfig(moduleTypeConfig, moduleDirectory);
        await checkVitestConfig(moduleTypeConfig, moduleDirectory);
        checkPrettierConfig(moduleTypeConfig, packageJSON);
        // Projects with Rust code pin their Rust version, and have Dependabot watch Cargo as well.
        const hasRust = (await readTextFileOrNull(RUST_WORKSPACE_PATH)) !== null;
        if (hasRust) await checkConfigFile(moduleDirectory, 'rust-toolchain.toml');
        const dependabotTemplate = `.github/dependabot${isPrivate ? '.private' : ''}${hasRust ? '.rust' : ''}.yml`;
        await checkConfigFile(moduleDirectory, '.github/dependabot.yml', [dependabotTemplate]);
        if (isPrivate) {
            console.info("ℹ️  GitHub workflows and file 'SECURITY.md' are NOT required by this project");
        } else {
            await checkWorkflows(moduleDirectory);
            await checkConfigFile(moduleDirectory, 'SECURITY.md', [], (content) => content.replaceAll(TEMPLATE_REPOSITORY_NAME, () => configJSON.id));
        }

        logOperationSuccess('Configuration files checked');
    } catch (error) {
        console.error('❌  Error checking configuration files', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

async function checkESLintConfig(moduleTypeConfig: ModuleTypeConfig, moduleDirectory: string) {
    if (['github', 'kb'].includes(moduleTypeConfig.typeId)) {
        console.info("ℹ️  File 'eslint.config.js' is NOT required by this project");
    } else if (['app', 'api', 'development', 'eslint'].includes(moduleTypeConfig.typeId)) {
        console.info("⚠️  File 'eslint.config.js' is UNIQUE to this project");
    } else {
        await checkConfigFile(moduleDirectory, 'eslint.config.js', ['eslint.config.default.js']);
    }
}
function checkPrettierConfig(moduleTypeConfig: ModuleTypeConfig, packageJSON: PackageJson) {
    if (moduleTypeConfig.typeId === 'development') {
        console.info("ℹ️  File '.prettierrc.json' is the template"); // Every other project points to this file.
    } else if (moduleTypeConfig.typeId === 'app') {
        console.info("⚠️  File '.prettierrc.json' is UNIQUE to this project");
    } else if (packageJSON['prettier'] === PRETTIER_CONFIG_REFERENCE) {
        console.info(`ℹ️  Prettier configuration is '${PRETTIER_CONFIG_REFERENCE}'`);
    } else {
        console.info(`❌  Prettier configuration is NOT '${PRETTIER_CONFIG_REFERENCE}'`);
    }
}

async function checkTSConfig(moduleTypeConfig: ModuleTypeConfig, moduleDirectory: string) {
    if (['github'].includes(moduleTypeConfig.typeId)) {
        console.info("ℹ️  File 'tsconfig.json' is NOT required by this project");
    } else if (['connector', 'cookbook', 'development', 'engine', 'presenter', 'shared', 'tool'].includes(moduleTypeConfig.typeId)) {
        await checkConfigFile(moduleDirectory, 'tsconfig.json');
    } else {
        console.info("⚠️  File 'tsconfig.json' is UNIQUE to this project");
    }
}

async function checkTSConfigScripts(moduleTypeConfig: ModuleTypeConfig, moduleDirectory: string) {
    if (['github'].includes(moduleTypeConfig.typeId)) {
        console.info("ℹ️  File 'scripts/tsconfig.json' is NOT required by this project");
    } else {
        await checkConfigFile(moduleDirectory, 'scripts/tsconfig.json'); // Type-checks the 'scripts' folder, whose files Node runs directly.
    }
}

async function checkViteConfig(moduleTypeConfig: ModuleTypeConfig, moduleDirectory: string) {
    if (['eslint', 'github', 'kb'].includes(moduleTypeConfig.typeId)) {
        console.info("ℹ️  File 'vite.config.ts' is NOT required by this project");
    } else if (['app', 'api', 'development', 'engine'].includes(moduleTypeConfig.typeId)) {
        console.info("⚠️  File 'vite.config.ts' is UNIQUE to this project");
    } else {
        let viteConfigTemplates: string[];
        switch (moduleTypeConfig.typeId) {
            case 'connector':
                viteConfigTemplates = ['vite.config.default.ts', 'vite.config.wasm.ts'];
                break;
            case 'presenter':
                viteConfigTemplates = ['vite.config.presenter.ts'];
                break;
            case 'tool':
                viteConfigTemplates = ['vite.config.tool.ts'];
                break;
            default:
                viteConfigTemplates = ['vite.config.default.ts'];
        }
        await checkConfigFile(moduleDirectory, 'vite.config.ts', viteConfigTemplates);
    }
}
async function checkWorkflows(moduleDirectory: string) {
    await checkConfigFile(moduleDirectory, '.github/workflows/ci.yml');
    await checkConfigFile(moduleDirectory, '.github/workflows/codeql.yml');
    await checkConfigFile(moduleDirectory, '.github/workflows/publish.yml');
    await checkConfigFile(moduleDirectory, '.github/workflows/scorecard.yml');
}

async function checkVitestConfig(moduleTypeConfig: ModuleTypeConfig, moduleDirectory: string) {
    if (['app', 'api', 'eslint', 'github', 'kb'].includes(moduleTypeConfig.typeId)) {
        console.info("ℹ️  File 'vitest.config.ts' is NOT required by this project");
    } else {
        await checkConfigFile(moduleDirectory, 'vitest.config.ts');
    }
}

async function checkConfigFile(moduleDirectory: string, checkFileName: string, templateFileNames: string[] = [], prepareTemplate = (content: string) => content): Promise<void> {
    const checkFilePath = path.resolve(process.cwd(), checkFileName);
    const templates = templateFileNames.length > 0 ? templateFileNames : [checkFileName];

    let checkFileContent;
    try {
        checkFileContent = await readTextFile(checkFilePath);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
    if (checkFileContent === undefined) {
        console.info(`❌  File '${checkFileName}' is MISSING`);
        return;
    }

    for (const templateFileName of templates) {
        const templatePath = path.resolve(moduleDirectory, `../${templateFileName}`);
        const templateContent = prepareTemplate(await readTextFile(templatePath));
        if (checkFileContent === templateContent) {
            console.info(`ℹ️  File '${checkFileName}' is the same as '${templateFileName}'`);
            return;
        }
    }

    console.info(`❌  File '${checkFileName}' is NOT the same`);
}
