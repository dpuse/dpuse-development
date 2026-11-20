// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import { vi } from 'vitest';

// ── Local Framework
import { spawnCommand } from '@/utilities';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

// Which methods count as actions is tested on 'extractOperationsFromSource' itself; these only need some actions to record.
export const CONNECTOR_SOURCE = 'export default class Connector {\n    listNodes() {}\n    retrieveRecords() {}\n}\n';
export const PRESENTER_SOURCE = 'export default class Presenter {\n    list() {}\n    render() {}\n}\n';
export const TOOL_SOURCE = 'export class Tool {\n    parseStream() {}\n    parseText() {}\n}\n';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function readFixture(name: string): Promise<string> {
    return await fs.readFile(new URL(`../fixtures/${name}`, import.meta.url), 'utf-8');
}

// The commands a test file's mocked 'spawnCommand' was asked to run, as command lines.
export function spawnedCommands(): string[] {
    return vi.mocked(spawnCommand).mock.calls.map(([, command, arguments_]) => `${command} ${arguments_.join(' ')}`);
}
