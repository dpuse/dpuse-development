/* eslint-disable security/detect-non-literal-fs-filename -- All paths come from package.json scripts, not user input. */

// 'ℹ️|⚠️|❌|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|✅|▶️' icon search regex.

// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import type { PackageJson } from 'type-fest';
import path from 'node:path';
import { promisify } from 'node:util';
import { safeParse } from 'valibot';
import type TypeScript from 'typescript';
import type { Dirent, ObjectEncodingOptions, Stats } from 'node:fs';
import { execFile, spawn } from 'node:child_process';

// ── DPUse Framework
import type { ConnectorActionName, ConnectorConfig, ModuleConfig, PresenterActionName, PresenterConfig } from '@dpuse/dpuse-shared';
import { connectorConfigSchema, determineConnectorUsageId, presenterConfigSchema } from '@dpuse/dpuse-shared';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

export interface ModuleTypeConfig {
    idPrefix: string;
    typeId: 'app' | 'api' | 'connector' | 'context' | 'cookbook' | 'development' | 'engine' | 'eslint' | 'github' | 'kb' | 'presenter' | 'resources' | 'shared' | 'tool';
    publishedTo: 'app' | 'api' | 'dpuse' | 'github' | 'kb' | 'npm' | 'sampleData';
    uploadGroupName: 'connectors' | 'contexts' | 'cookbooks' | 'engine' | 'presenters' | 'tools' | undefined;
}

interface OperationConfig {
    id?: string;
    version?: string;
    actionNames?: string[];
    usageId?: string | null;
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

// Fallow — Quality & Security writes these each time it runs; the README's opening badge reads the badge file from the repository.
export const FALLOW_DIRECTORY = 'code-health-reports/fallow';
export const FALLOW_BADGE_PATH = `${FALLOW_DIRECTORY}/badge.json`;
export const FALLOW_REPORT_PATH = `${FALLOW_DIRECTORY}/index.md`;

// README markers — Quality & Security, and Contributing and License, once shared one 'GOVERNANCE' section.
export const CONTRIBUTING_LICENSE_END_MARKER = '<!-- CONTRIBUTING_LICENSE_END -->';
export const CONTRIBUTING_LICENSE_START_MARKER = '<!-- CONTRIBUTING_LICENSE_START -->';
const GOVERNANCE_END_MARKER = '<!-- GOVERNANCE_END -->';
const GOVERNANCE_START_MARKER = '<!-- GOVERNANCE_START -->';
export const QUALITY_SECURITY_END_MARKER = '<!-- QUALITY_SECURITY_END -->';
export const QUALITY_SECURITY_START_MARKER = '<!-- QUALITY_SECURITY_START -->';

// Rust — a project has Rust code when it has this workspace file; its templates and checks then include Rust.
export const RUST_WORKSPACE_PATH = 'rust/Cargo.toml';

const MODULE_TYPE_CONFIGS: ModuleTypeConfig[] = [
    { idPrefix: 'dpuse-app', typeId: 'app', publishedTo: 'app', uploadGroupName: undefined },
    { idPrefix: 'dpuse-api', typeId: 'api', publishedTo: 'api', uploadGroupName: undefined },
    { idPrefix: 'dpuse-connector', typeId: 'connector', publishedTo: 'dpuse', uploadGroupName: 'connectors' },
    { idPrefix: 'dpuse-context', typeId: 'context', publishedTo: 'dpuse', uploadGroupName: 'contexts' },
    { idPrefix: 'dpuse-development', typeId: 'development', publishedTo: 'npm', uploadGroupName: undefined },
    { idPrefix: 'dpuse-engine', typeId: 'engine', publishedTo: 'dpuse', uploadGroupName: 'engine' },
    { idPrefix: 'dpuse-kb', typeId: 'kb', publishedTo: 'kb', uploadGroupName: undefined },
    { idPrefix: 'dpuse-presenter', typeId: 'presenter', publishedTo: 'dpuse', uploadGroupName: 'presenters' },
    { idPrefix: 'dpuse-cookbook', typeId: 'cookbook', publishedTo: 'dpuse', uploadGroupName: 'cookbooks' },
    { idPrefix: 'dpuse-resources', typeId: 'resources', publishedTo: 'sampleData', uploadGroupName: undefined },
    { idPrefix: 'dpuse-shared', typeId: 'shared', publishedTo: 'npm', uploadGroupName: undefined },
    { idPrefix: 'dpuse-tool', typeId: 'tool', publishedTo: 'npm', uploadGroupName: 'tools' },
    { idPrefix: 'eslint-config-dpuse', typeId: 'eslint', publishedTo: 'npm', uploadGroupName: undefined },
    { idPrefix: 'github', typeId: 'github', publishedTo: 'github', uploadGroupName: undefined } // The organisation profile repository ('dpuse/.github').
];

// ── Initialisation ───────────────────────────────────────────────────────────────────────────────────────────────────

const asyncExecFile = promisify(execFile);

// ── Actions - Directory ──────────────────────────────────────────────────────────────────────────────────────────────

export async function clearDirectory(label: string | undefined, directoryPath: string): Promise<void> {
    if (label !== undefined) logStepHeader(`${label} - clear(${directoryPath})`);
    let entries: Dirent[];

    // Get top level entries in directory.
    try {
        entries = await fs.readdir(directoryPath, { withFileTypes: true });
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return; // Treat missing directory as already clear.
        throw error;
    }

    // Remove everything in parallel; Node schedules deletions through libuv’s thread pool (default concurrency 4).
    await Promise.all(
        entries.map(async (entry) => {
            const fullPath = path.join(directoryPath, entry.name);
            try {
                await fs.rm(fullPath, { recursive: true, force: true });
            } catch (error) {
                if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; // Tolerate entries that disappear mid-run.
            }
        })
    );
}

export function getDirectoryEntries(path: string): Promise<string[]>;
export function getDirectoryEntries(path: string, options: ObjectEncodingOptions): Promise<Dirent[]>;
export async function getDirectoryEntries(path: string, options?: ObjectEncodingOptions): Promise<string[] | Dirent[]> {
    return fs.readdir(path, options);
}

// ── Actions - Command ────────────────────────────────────────────────────────────────────────────────────────────────

export async function execCommand(label: string | undefined, command_: string, arguments_: string[], outputFilePath?: string): Promise<void> {
    if (label !== undefined) logStepHeader(`${label} - exec(${command_} ${arguments_.join(' ')})`);
    const { stdout, stderr } = await asyncExecFile(command_, arguments_);
    if (outputFilePath === undefined) {
        if (stdout.trim()) console.log(stdout.trim());
    } else {
        await fs.writeFile(outputFilePath, stdout.trim(), 'utf-8');
    }
    if (stderr.trim()) console.error(stderr.trim());
}

export async function spawnCommand(label: string, command: string, arguments_: string[], isErrorIgnored = false, isShellUsed = false): Promise<void> {
    logStepHeader(`${label} - spawn(${command} ${arguments_.join(' ')})`);
    return new Promise((resolve, reject) => {
        const child = spawn(command, arguments_, { shell: isShellUsed, stdio: 'inherit' });
        child.on('close', (code) => {
            if (code === 0 || isErrorIgnored) {
                resolve();
            } else {
                reject(new Error(`${command} exited with code ${String(code ?? 'unknown')}`));
            }
        });
    });
}

export async function spawnCommandToFile(label: string, command: string, arguments_: string[], outputPath: string, isErrorIgnored = false): Promise<void> {
    logStepHeader(`${label} - spawn(${command} ${arguments_.join(' ')}) > ${outputPath}`);
    return new Promise((resolve, reject) => {
        const child = spawn(command, arguments_, { shell: false, stdio: ['inherit', 'pipe', 'inherit'] });
        let output = '';
        child.stdout.on('data', (chunk) => {
            output += String(chunk);
        });
        child.on('close', (code) => {
            if (code === 0 || isErrorIgnored) {
                void (async () => {
                    try {
                        await fs.mkdir(path.dirname(outputPath), { recursive: true });
                        await fs.writeFile(outputPath, output, 'utf-8');
                        resolve();
                    } catch (error) {
                        reject(error instanceof Error ? error : new Error(String(error)));
                    }
                })();
            } else {
                reject(new Error(`${command} exited with code ${String(code ?? 'unknown')}`));
            }
        });
    });
}

// ── Actions - File ───────────────────────────────────────────────────────────────────────────────────────────────────

// Swaps an old README's single 'GOVERNANCE' section for the two sections that replaced it, so either can then be
// written. A README already split, or without the old section, is left as it is.
export async function migrateGovernanceSection(): Promise<void> {
    const readme = await readTextFile('./README.md');
    const startIndex = readme.indexOf(GOVERNANCE_START_MARKER);
    const endIndex = readme.indexOf(GOVERNANCE_END_MARKER);
    if (startIndex === -1 || endIndex === -1) return;

    const markers = `${QUALITY_SECURITY_START_MARKER}\n${QUALITY_SECURITY_END_MARKER}\n\n${CONTRIBUTING_LICENSE_START_MARKER}\n${CONTRIBUTING_LICENSE_END_MARKER}`;
    await writeTextFile('README.md', `${readme.slice(0, startIndex)}${markers}${readme.slice(endIndex + GOVERNANCE_END_MARKER.length)}`);
}

export async function readJSONFile<T>(path: string): Promise<T> {
    return JSON.parse(await fs.readFile(path, 'utf-8')) as T;
}

export async function readTextFile(path: string): Promise<string> {
    return await fs.readFile(path, 'utf-8');
}

export async function readTextFileOrNull(path: string): Promise<string | null> {
    try {
        return await fs.readFile(path, 'utf-8');
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null; // Treat missing file as no content.
        throw error;
    }
}

// Creates any missing folders on the way, as a badge or report may be the first file written to its folder.
export async function writeJSONFile(filePath: string, data: object): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(data, undefined, 4)}\n`, 'utf-8'); // Ends with a newline, as Prettier and editors expect.
}

// Replaces the text between a pair of markers in 'README.md'.
export async function writeReadmeSection(content: string, startMarker: string, endMarker: string): Promise<void> {
    const originalContent = await readTextFile('./README.md');
    await writeTextFile('README.md', substituteText(originalContent, content, startMarker, endMarker));
}

export async function writeTextFile(path: string, data: string): Promise<void> {
    await fs.writeFile(path, data, 'utf-8');
}

// ── Actions - Log ────────────────────────────────────────────────────────────────────────────────────────────────────

export function logOperationHeader(text: string): void {
    const cyan = '\u{1B}[36m';
    const reset = '\u{1B}[0m';
    console.info(`${cyan}────────────────────────────────────────────────────────────────────────────────`);
    console.info(`▶️  ${text}${reset}`);
}

export function logOperationSuccess(message: string): void {
    console.info(`✅ ${message}`);
}

export function logStepHeader(text: string): void {
    console.info(text);
}

// ── Actions - Module ─────────────────────────────────────────────────────────────────────────────────────────────────

export function getModuleConfig(configId: string): ModuleTypeConfig {
    const moduleTypeConfig = MODULE_TYPE_CONFIGS.find((config) => configId.startsWith(config.idPrefix));
    if (!moduleTypeConfig) throw new Error(`Failed to locate module type configuration for identifier '${configId}'.`);
    return moduleTypeConfig;
}

// ── Actions - Package ────────────────────────────────────────────────────────────────────────────────────────────────

// 'purpose' completes the error message, e.g. 'document opening'.
export function resolveOwnerAndRepo(packageJSON: PackageJson, purpose: string): { owner: string; repo: string } {
    const repo = packageJSON.repository;
    const url = typeof repo === 'string' ? repo : repo?.url;
    if (url == null || url === '') throw new Error(`package.json 'repository' field is required to ${purpose}.`);

    const cleanedURL = url.replace(/^git\+/, '').replace(/\.git$/, '');
    const match = /github\.com[/:]([^/]+)\/([^/]+)$/.exec(cleanedURL);
    if (match?.[1] == null || match[2] == null) throw new Error(`Unable to parse GitHub owner/repo from '${url}'.`);

    return { owner: match[1], repo: match[2] };
}

// ── Actions - Path ───────────────────────────────────────────────────────────────────────────────────────────────────

export async function getStatsForPath(path: string): Promise<Stats> {
    return await fs.stat(path);
}

// ── Actions - Project ────────────────────────────────────────────────────────────────────────────────────────────────

// Connectors and presenters also record the actions their source implements, so their configuration is built from it.
export async function buildModuleConfig(stepIcon: string, packageJSON: PackageJson, moduleTypeConfig: ModuleTypeConfig): Promise<ModuleConfig> {
    switch (moduleTypeConfig.typeId) {
        case 'connector':
            return await buildConnectorProjectConfig(stepIcon, packageJSON);
        // case 'context':
        //     return await buildContextProjectConfig(stepIcon, packageJSON);
        case 'presenter':
            return await buildPresenterProjectConfig(stepIcon, packageJSON);
        default:
            return await buildProjectConfig(stepIcon, packageJSON);
    }
}

export async function bumpPackageVersion(stepIcon: string, packageJSON: PackageJson, path = './'): Promise<void> {
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

// ── Actions - Source ─────────────────────────────────────────────────────────────────────────────────────────────────

// The public methods of every class in the source: the actions a connector or presenter implements. TypeScript is an
// optional peer, loaded only here, so projects that never read their source this way don't need it.
export async function extractOperationsFromSource<T>(source: string): Promise<T[]> {
    const { default: ts } = await import('typescript');
    const sourceFile = ts.createSourceFile('index.ts', source, ts.ScriptTarget.Latest, true); // 'true' links each node to its parent, which the class check reads.
    const operations: T[] = [];
    const visit = (node: TypeScript.Node): void => {
        // A constructor isn't a method declaration, and a method written inside an object literal has no class as parent.
        if (ts.isMethodDeclaration(node) && ts.isClassLike(node.parent) && ts.isIdentifier(node.name)) {
            const isPrivate = node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.PrivateKeyword) ?? false;
            if (!isPrivate) operations.push(node.name.text as T);
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    return operations;
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

async function buildConnectorProjectConfig(stepIcon: string, packageJSON: PackageJson): Promise<ConnectorConfig> {
    logStepHeader(`${stepIcon} Build connector project configuration`);

    const [configJSON, indexCode] = await Promise.all([readJSONFile<ConnectorConfig>('config.json'), readTextFile('src/index.ts')]);

    const response = safeParse(connectorConfigSchema, configJSON);
    if (!response.success) {
        console.error('❌  Configuration is invalid:');
        console.table(response.issues);
        throw new Error('Configuration is invalid');
    }

    const operations = await extractOperationsFromSource<ConnectorActionName>(indexCode);
    const usageId = determineConnectorUsageId(operations);

    return await processOperations<ConnectorConfig>(packageJSON, configJSON, operations, usageId);
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

    const operations = await extractOperationsFromSource<PresenterActionName>(indexCode);
    return await processOperations<PresenterConfig>(packageJSON, configJSON, operations);
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

function substituteText(originalText: string, substituteText: string, startMarker: string, endMarker: string): string {
    const startIndex = originalText.indexOf(startMarker);
    const endIndex = originalText.indexOf(endMarker);
    if (startIndex === -1 || endIndex === -1) throw new Error(`Markers ${startMarker}-${endMarker} not found in content.`);
    const trimmedSubstitute = substituteText.trim();
    return `${originalText.slice(0, Math.max(0, startIndex + startMarker.length))}\n\n${trimmedSubstitute}\n\n${originalText.slice(Math.max(0, endIndex))}`;
}

/* eslint-enable security/detect-non-literal-fs-filename -- All paths come from package.json scripts, not user input. */
