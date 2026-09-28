/* eslint-disable security/detect-non-literal-fs-filename -- Tests only name files inside their own fixtures folder. */

// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import { vi } from 'vitest';

// ── Local Framework
import { execCommand, spawnCommand } from '@/utilities';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

export const CONNECTOR_SOURCE = 'export default class Connector {\n    listNodes() {}\n    retrieveRecords() {}\n    private helper() {}\n}\n';
export const PRESENTER_SOURCE = 'export default class Presenter {\n    list() {}\n    render() {}\n}\n';

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// The commands a test file's mocked 'execCommand' and 'spawnCommand' were asked to run, as command lines.
export function executedCommands(): string[] {
    return vi.mocked(execCommand).mock.calls.map(([, command, arguments_]) => `${command} ${arguments_.join(' ')}`);
}

export async function readFixture(name: string): Promise<string> {
    return await fs.readFile(new URL(`../fixtures/${name}`, import.meta.url), 'utf-8');
}

export function spawnedCommands(): string[] {
    return vi.mocked(spawnCommand).mock.calls.map(([, command, arguments_]) => `${command} ${arguments_.join(' ')}`);
}

/* eslint-enable security/detect-non-literal-fs-filename -- Tests only name files inside their own fixtures folder. */
