/* eslint-disable security/detect-non-literal-fs-filename -- All paths come from package.json scripts, not user input. */

// 'ℹ️|⚠️|❌|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|✅|▶️' icon search regex.

// ── External Dependencies & Registrations
import acornTypeScript from 'acorn-typescript';
import { promises as fs } from 'node:fs';
import { Parser } from 'acorn';
import path from 'node:path';
import { promisify } from 'node:util';
import type { Dirent, ObjectEncodingOptions, Stats } from 'node:fs';
import { execFile, spawn } from 'node:child_process';
import type { MethodDefinition, Node } from 'acorn';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface ModuleTypeConfig {
    idPrefix: string;
    typeId: 'app' | 'api' | 'connector' | 'context' | 'cookbook' | 'development' | 'engine' | 'eslint' | 'kb' | 'presenter' | 'resources' | 'shared' | 'tool';
    publishedTo: 'app' | 'api' | 'dpuse' | 'kb' | 'npm' | 'sampleData';
    uploadGroupName: 'connectors' | 'contexts' | 'cookbooks' | 'engine' | 'presenters' | 'tools' | undefined;
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

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
    { idPrefix: 'eslint-config-dpuse', typeId: 'eslint', publishedTo: 'npm', uploadGroupName: undefined }
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
        await fs.writeFile(outputFilePath, stdout.trim(), 'utf8');
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
                        await fs.writeFile(outputPath, output, 'utf8');
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

// ── Actions - Log ────────────────────────────────────────────────────────────────────────────────────────────────────

export function logOperationHeader(text: string): void {
    const cyan = '\u{1B}[36m';
    const reset = '\u{1B}[0m';
    const line = '────────────────────────────────────────────────────────────────────────────────';
    console.info(`\n${cyan}${line}`);
    console.info(`▶️  ${text}`);
    console.info(`${line}${reset}`);
}

export function logOperationSuccess(message: string): void {
    console.info(`\n✅  ${message}\n`);
}

export function logStepHeader(text: string): void {
    console.info(`\n${text}\n`);
}

// ── Actions - Module ─────────────────────────────────────────────────────────────────────────────────────────────────

export function getModuleConfig(configId: string): ModuleTypeConfig {
    const moduleTypeConfig = MODULE_TYPE_CONFIGS.find((config) => configId.startsWith(config.idPrefix));
    if (!moduleTypeConfig) throw new Error(`Failed to locate module type configuration for identifier '${configId}'.`);
    return moduleTypeConfig;
}

// ── Actions - Path ───────────────────────────────────────────────────────────────────────────────────────────────────

export async function getStatsForPath(path: string): Promise<Stats> {
    return await fs.stat(path);
}

// ── Actions - Source ─────────────────────────────────────────────────────────────────────────────────────────────────

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

// ── Actions - Text ───────────────────────────────────────────────────────────────────────────────────────────────────

export function substituteText(originalText: string, substituteText: string, startMarker: string, endMarker: string): string {
    const startIndex = originalText.indexOf(startMarker);
    const endIndex = originalText.indexOf(endMarker);
    if (startIndex === -1 || endIndex === -1) throw new Error(`Markers ${startMarker}-${endMarker} not found in content.`);
    return `${originalText.slice(0, Math.max(0, startIndex + startMarker.length))}\n${substituteText}\n${originalText.slice(Math.max(0, endIndex))}`;
}

/* eslint-enable security/detect-non-literal-fs-filename -- All paths come from package.json scripts, not user input. */
