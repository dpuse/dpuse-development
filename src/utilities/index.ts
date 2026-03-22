/* eslint-disable security/detect-non-literal-fs-filename */

// External Dependencies
import acornTypeScript from 'acorn-typescript';
import { promises as fs } from 'node:fs';
import { Parser } from 'acorn';
import path from 'node:path';
import { promisify } from 'node:util';
import type { Dirent, ObjectEncodingOptions, Stats } from 'node:fs';
import { exec, spawn } from 'node:child_process';
import type { MethodDefinition, Node } from 'acorn';

// Interfaces/Types
export interface ModuleTypeConfig {
    idPrefix: string;
    typeId: 'app' | 'api' | 'connector' | 'context' | 'development' | 'engine' | 'eslint' | 'presenter' | 'resources' | 'shared' | 'tool';
    isPublished: boolean;
    uploadGroupName: 'connectors' | 'contexts' | 'engine' | 'presenters' | 'tools' | undefined;
}

// Constants ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const MODULE_TYPE_CONFIGS: ModuleTypeConfig[] = [
    { idPrefix: 'dpuse-app', typeId: 'app', isPublished: false, uploadGroupName: undefined },
    { idPrefix: 'dpuse-api', typeId: 'api', isPublished: false, uploadGroupName: undefined },
    { idPrefix: 'dpuse-connector', typeId: 'connector', isPublished: true, uploadGroupName: 'connectors' },
    { idPrefix: 'dpuse-context', typeId: 'context', isPublished: true, uploadGroupName: 'contexts' },
    { idPrefix: 'dpuse-development', typeId: 'development', isPublished: true, uploadGroupName: undefined },
    { idPrefix: 'dpuse-engine', typeId: 'engine', isPublished: false, uploadGroupName: 'engine' },
    { idPrefix: 'dpuse-presenter', typeId: 'presenter', isPublished: true, uploadGroupName: 'presenters' },
    { idPrefix: 'dpuse-resources', typeId: 'resources', isPublished: false, uploadGroupName: undefined },
    { idPrefix: 'dpuse-shared', typeId: 'shared', isPublished: true, uploadGroupName: undefined },
    { idPrefix: 'dpuse-tool', typeId: 'tool', isPublished: true, uploadGroupName: 'tools' },
    { idPrefix: 'eslint-config-dpuse', typeId: 'eslint', isPublished: true, uploadGroupName: undefined }
];

// Initialisation ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const asyncExec = promisify(exec);

// Actions - Directory ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function clearDirectory(directoryPath: string): Promise<void> {
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

// Actions - Command ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function execCommand(label: string | undefined, command_: string, arguments_: string[] = [], outputFilePath?: string): Promise<void> {
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

export async function spawnCommand(label: string, command: string, arguments_: string[] = [], ignoreErrors = false, useShell = false): Promise<void> {
    logStepHeader(`${label} - spawn(${command} ${arguments_.join(' ')})`);
    return new Promise((resolve, reject) => {
        const child = spawn(command, arguments_, { shell: useShell, stdio: 'inherit' });
        child.on('close', (code) => {
            if (code === 0 || ignoreErrors) {
                resolve();
            } else {
                reject(new Error(`${command} exited with code ${code}`));
            }
        });
    });
}

// Actions - File ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function readJSONFile<T>(path: string): Promise<T> {
    return JSON.parse(await fs.readFile(path, 'utf8')) as T;
}

export async function readTextFile(path: string): Promise<string> {
    return await fs.readFile(path, 'utf8');
}

export async function removeFile(path: string): Promise<void> {
    try {
        await fs.unlink(path);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; // Ignore missing file errors, rethrow others.
    }
}

export async function writeJSONFile(path: string, data: object): Promise<void> {
    await fs.writeFile(path, JSON.stringify(data, undefined, 4), 'utf8');
}

export async function writeTextFile(path: string, data: string): Promise<void> {
    await fs.writeFile(path, data, 'utf8');
}

// Actions - Log ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function logOperationHeader(text: string): void {
    const cyan = '\u001B[36m';
    const reset = '\u001B[0m';
    const line = '─'.repeat(Math.max(text.length + 60, 60));
    console.info(`\n${cyan}${line}`);
    console.info(`▶️  ${text}`);
    console.info(`${line}${reset}`);
}

export function logOperationSuccess(message: string): void {
    console.info(`\n✅ ${message}\n`);
}

export function logStepHeader(text: string): void {
    console.info(`\n${text}\n`);
}

// Actions - Module ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function getModuleConfig(configId: string): ModuleTypeConfig {
    const moduleTypeConfig = MODULE_TYPE_CONFIGS.find((config) => configId.startsWith(config.idPrefix));
    if (!moduleTypeConfig) throw new Error(`Failed to locate module type configuration for identifier '${configId}'.`);
    return moduleTypeConfig;
}

// Actions - Path ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getStatsForPath(path: string): Promise<Stats> {
    return await fs.stat(path);
}

// Actions - Source ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function extractOperationsFromSource<T>(source: string): T[] {
    // @ts-expect-error - acorn-typescript runtime mismatch is fine.
    const TSParser = Parser.extend(acornTypeScript());
    const ast = TSParser.parse(source, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        locations: true
    });
    const operations: T[] = [];
    traverseAST(ast, (node) => {
        if (node.type !== 'MethodDefinition') return;
        const md = node as MethodDefinition & { accessibility?: string };
        const key = md.key;
        if (key.type !== 'Identifier') return;
        const name = key.name;
        if (!name) return;
        if (name === 'constructor') return;
        if (md.accessibility === 'private') return;
        operations.push(name as T);
    });
    return operations;
}

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

// Actions - Text ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function substituteText(originalText: string, substituteText: string, startMarker: string, endMarker: string): string {
    const startIndex = originalText.indexOf(startMarker);
    const endIndex = originalText.indexOf(endMarker);
    if (startIndex === -1 || endIndex === -1) throw new Error(`Markers ${startMarker}-${endMarker} not found in content.`);
    return `${originalText.slice(0, Math.max(0, startIndex + startMarker.length))}\n${substituteText}\n${originalText.slice(Math.max(0, endIndex))}`;
}
