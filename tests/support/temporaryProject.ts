/* eslint-disable security/detect-non-literal-fs-filename -- Tests only name files inside their own temporary folder. */

// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, vi } from 'vitest';

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// Every action reads and writes files relative to the working directory, so each test runs inside a fresh folder holding
// only the files it needs. Console output is silenced but kept on the spies, so tests can check what was reported, and
// 'process.exit' throws so an action's failure path ends the test instead of the test run.
export function useTemporaryProject(): {
    writeFiles: (files: Record<string, string>) => Promise<void>;
    readFile: (filePath: string) => Promise<string>;
    readJSON: (filePath: string) => Promise<Record<string, unknown>>;
} {
    const originalDirectory = process.cwd();
    let projectDirectory = '';

    beforeEach(async () => {
        projectDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'dpuse-development-test-'));
        process.chdir(projectDirectory);
        vi.spyOn(console, 'info').mockImplementation(vi.fn());
        vi.spyOn(console, 'log').mockImplementation(vi.fn());
        vi.spyOn(console, 'warn').mockImplementation(vi.fn());
        vi.spyOn(console, 'error').mockImplementation(vi.fn());
        vi.spyOn(console, 'table').mockImplementation(vi.fn());
        vi.spyOn(process, 'exit').mockImplementation((code) => {
            throw new Error(`process.exit(${String(code)})`);
        });
    });

    afterEach(async () => {
        process.chdir(originalDirectory);
        await fs.rm(projectDirectory, { recursive: true, force: true });
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    return {
        async writeFiles(files) {
            for (const [filePath, content] of Object.entries(files)) {
                await fs.mkdir(path.dirname(filePath), { recursive: true });
                await fs.writeFile(filePath, content, 'utf-8');
            }
        },
        async readFile(filePath) {
            return await fs.readFile(filePath, 'utf-8');
        },
        async readJSON(filePath) {
            return JSON.parse(await fs.readFile(filePath, 'utf-8')) as Record<string, unknown>;
        }
    };
}

// Everything the console spies were given, one call per line, so a test can look for a message without knowing which
// console method reported it.
export function collectConsoleOutput(): string {
    const methods = [console.info, console.log, console.warn, console.error] as unknown as { mock: { calls: unknown[][] } }[];
    return methods.flatMap((method) => method.mock.calls.map((call) => call.map(String).join(' '))).join('\n');
}

// A README holding the given marker pairs, as each document action expects to find.
export function buildReadme(...markerNames: string[]): string {
    const sections = markerNames.map((name) => `<!-- ${name}_START -->\n<!-- ${name}_END -->`);
    return `# Test Project\n\n${sections.join('\n\n')}\n`;
}

/* eslint-enable security/detect-non-literal-fs-filename -- Tests only name files inside their own temporary folder. */
