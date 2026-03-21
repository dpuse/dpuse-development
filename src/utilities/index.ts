/**
 * Utilities.
 */

/* eslint-disable security/detect-non-literal-fs-filename */

/** Dependencies - Vendor. */
import acornTypeScript from 'acorn-typescript';
import { promises as fs } from 'node:fs';
import { Parser } from 'acorn';
import path from 'node:path';
import { promisify } from 'node:util';
import type { Dirent, ObjectEncodingOptions, Stats } from 'node:fs';
import { exec, spawn } from 'node:child_process';
import type { MethodDefinition, Node } from 'acorn';

/** Interfaces/Types */
export interface ModuleTypeConfig {
    idPrefix: string;
    typeId: 'app' | 'api' | 'connector' | 'context' | 'development' | 'engine' | 'eslint' | 'presenter' | 'resources' | 'shared' | 'tool';
    isPublish: boolean;
    uploadGroupName: 'connectors' | 'contexts' | 'engine' | 'presenters' | 'tools' | undefined;
}

/** Constants */
const MODULE_TYPE_CONFIGS: ModuleTypeConfig[] = [
    { idPrefix: 'dpuse-app', typeId: 'app', isPublish: false, uploadGroupName: undefined },
    { idPrefix: 'dpuse-api', typeId: 'api', isPublish: false, uploadGroupName: undefined },
    { idPrefix: 'dpuse-connector', typeId: 'connector', isPublish: true, uploadGroupName: 'connectors' },
    { idPrefix: 'dpuse-context', typeId: 'context', isPublish: true, uploadGroupName: 'contexts' },
    { idPrefix: 'dpuse-development', typeId: 'development', isPublish: true, uploadGroupName: undefined },
    { idPrefix: 'dpuse-engine', typeId: 'engine', isPublish: false, uploadGroupName: 'engine' },
    { idPrefix: 'dpuse-presenter', typeId: 'presenter', isPublish: true, uploadGroupName: 'presenters' },
    { idPrefix: 'dpuse-resources', typeId: 'resources', isPublish: false, uploadGroupName: undefined },
    { idPrefix: 'dpuse-shared', typeId: 'shared', isPublish: true, uploadGroupName: undefined },
    { idPrefix: 'dpuse-tool', typeId: 'tool', isPublish: true, uploadGroupName: 'tools' },
    { idPrefix: 'eslint-config-dpuse', typeId: 'eslint', isPublish: true, uploadGroupName: undefined }
];

/** Initialisation */
const asyncExec = promisify(exec);

/** Utilities - Clear directory. */
async function clearDirectory(directoryPath: string): Promise<void> {
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

/** Utilities - Extract operations from source. */
function extractOperationsFromSource<T>(source: string): T[] {
    console.log('aaaa1');
    // @ts-expect-error - acorn-typescript runtime mismatch is fine.
    const TSParser = Parser.extend(acornTypeScript());
    const ast = TSParser.parse(source, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        locations: true
    });
    console.log('aaaa2');

    const operations: T[] = [];

    traverseAST(ast, (node) => {
        console.log('bbbb', node);
        if (node.type !== 'MethodDefinition') return;

        console.log('cccc');
        const md = node as MethodDefinition & { accessibility?: string };
        const key = md.key;
        if (key.type !== 'Identifier') return;
        const name = key.name;

        console.log('dddd');
        if (!name) return;
        if (name === 'constructor') return;
        if (md.accessibility === 'private') return;

        console.log('eeee');
        operations.push(name as T);
        console.log('ffff');
    });

    return operations;
    console.log('zzzz');
}

/** TODO Utilities - Execute command. */
async function execCommand(label: string | undefined, command_: string, arguments_: string[] = [], outputFilePath?: string): Promise<void> {
    const command = `${command_} ${arguments_.join(' ')}`;
    if (label !== undefined) logStepHeader(`${label} - exec(${command})`);
    const { stdout, stderr } = await asyncExec(command);
    if (outputFilePath === undefined) {
        if (stdout.trim()) console.log(stdout.trim());
    } else {
        await fs.writeFile(outputFilePath, stdout.trim(), 'utf8');
    }
    if (stderr.trim()) console.error(stderr.trim());
}

/** Utilities - Get directory entries. */
function getDirectoryEntries(path: string): Promise<string[]>;
function getDirectoryEntries(path: string, options: ObjectEncodingOptions): Promise<Dirent[]>;
async function getDirectoryEntries(path: string, options?: ObjectEncodingOptions): Promise<string[] | Dirent[]> {
    return fs.readdir(path, options);
}

/** Utilities - Get module type identifier. */
function getModuleConfig(configId: string): ModuleTypeConfig {
    const moduleTypeConfig = MODULE_TYPE_CONFIGS.find((config) => configId.startsWith(config.idPrefix));
    if (!moduleTypeConfig) throw new Error(`Failed to locate module type configuration for identifier '${configId}'.`);
    return moduleTypeConfig;
}

/** Utilities - Get stats for path. */
async function getStatsForPath(path: string): Promise<Stats> {
    return await fs.stat(path);
}

/** Utilities - Log operation header. */
function logOperationHeader(text: string): void {
    const cyan = '\u001B[36m';
    const reset = '\u001B[0m';
    const line = '─'.repeat(Math.max(text.length + 60, 60));
    console.info(`\n${cyan}${line}`);
    console.info(`▶️  ${text}`);
    console.info(`${line}${reset}`);
}

/** Utilities - Log operation success. */
function logOperationSuccess(message: string): void {
    console.info(`\n✅ ${message}\n`);
}

/** Utilities - Log step header. */
function logStepHeader(text: string): void {
    console.info(`\n${text}\n`);
}

/** Utilities - Read JSON file. */
async function readJSONFile<T>(path: string): Promise<T> {
    return JSON.parse(await fs.readFile(path, 'utf8')) as T;
}

// Utilities - Read text file.
async function readTextFile(path: string): Promise<string> {
    return await fs.readFile(path, 'utf8');
}

/** Utilities - Remove file. */
async function removeFile(path: string): Promise<void> {
    try {
        await fs.unlink(path);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; // Ignore missing file errors, rethrow others.
    }
}

/** Utilities - Spawn command. */
async function spawnCommand(label: string, command: string, arguments_: string[] = [], ignoreErrors = false): Promise<void> {
    logStepHeader(`${label} - spawn(${command} ${arguments_.join(' ')})`);
    return new Promise((resolve, reject) => {
        const child = spawn(command, arguments_, { stdio: 'inherit' });
        child.on('close', (code) => {
            if (code === 0 || ignoreErrors) {
                resolve();
            } else {
                reject(new Error(`${command} exited with code ${code}`));
            }
        });
    });
}

/** Utilities - Substitute content. */
function substituteContent(originalContent: string, substituteContent: string, startMarker: string, endMarker: string): string {
    const startIndex = originalContent.indexOf(startMarker);
    const endIndex = originalContent.indexOf(endMarker);
    if (startIndex === -1 || endIndex === -1) throw new Error(`Markers ${startMarker}-${endMarker} not found in content.`);
    return `${originalContent.slice(0, Math.max(0, startIndex + startMarker.length))}\n${substituteContent}\n${originalContent.slice(Math.max(0, endIndex))}`;
}

/** Utilities - Write JSON file. */
async function writeJSONFile(path: string, data: object): Promise<void> {
    await fs.writeFile(path, JSON.stringify(data, undefined, 4), 'utf8');
}

/** Utilities - Write text file. */
async function writeTextFile(path: string, data: string): Promise<void> {
    await fs.writeFile(path, data, 'utf8');
}

/** Helpers - Traverse AST (Abstract Syntax Tree). */
function traverseAST(node: Node, doIt: (node: Node) => void): void {
    doIt(node);
    for (const [key, value_] of Object.entries(node)) {
        if (['loc', 'range', 'start', 'end', 'comments'].includes(key)) continue;
        const value = value_ as Node | undefined;
        if (Array.isArray(value)) {
            for (const child_ of value) {
                const child = child_ as Node | undefined;
                if (child && typeof child.type === 'string') traverseAST(child, doIt);
            }
        } else if (value && typeof value === 'object' && typeof value.type === 'string') {
            traverseAST(value, doIt);
        }
    }
}

/** Exposures */
export {
    clearDirectory,
    execCommand,
    extractOperationsFromSource,
    getDirectoryEntries,
    getModuleConfig,
    getStatsForPath,
    logOperationHeader,
    logOperationSuccess,
    logStepHeader,
    readJSONFile,
    readTextFile,
    removeFile,
    spawnCommand,
    substituteContent,
    writeJSONFile,
    writeTextFile
};
