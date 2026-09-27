// ── External Dependencies & Registrations
import { describe, expect, it } from 'vitest';

// ── Local Framework
import { documentAPIReference } from '@/actions/documentApiReference';
import { useTemporaryProject } from '../support/temporaryProject';

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

const TSCONFIG = JSON.stringify({ compilerOptions: { module: 'ESNext', moduleResolution: 'bundler', strict: true, target: 'ESNext', paths: { '@/*': ['./src/*'] } } });

const INDEX_SOURCE = `
export { formatError } from '@/errors';
export function getStatus(id: string, localeId?: string): string { return id + (localeId ?? ''); }
export function listItems(limit = 10): number[] { return [limit]; }
export const buildLabel = (text: string): string => text;
export class Connector { list(): void {} }
export const MAX_COUNT = 3;
export const configSchema = { type: 'object' };
export interface Config { id: string }
export type StatusId = 'alpha' | 'beta';
export enum Colour { Red, Green }
const hidden = 1;
export default hidden;
`;

const ERRORS_SOURCE = `
export class DPUseError extends Error {}
export function formatError(error: unknown): string { return String(error); }
`;

async function writeProject(packageJSON: object): Promise<void> {
    await project.writeFiles({
        'package.json': JSON.stringify({ name: '@dpuse/dpuse-example', ...packageJSON }),
        'tsconfig.json': TSCONFIG,
        'src/index.ts': INDEX_SOURCE,
        'src/errors/index.ts': ERRORS_SOURCE
    });
}

describe('documentAPIReference', () => {
    it('lists every export of each import path, grouped by kind', async () => {
        await writeProject({
            exports: {
                '.': { import: './dist/dpuse-example.es.js', types: './dist/types/src/index.d.ts' },
                './errors': { import: './dist/dpuse-example-errors.es.js', types: './dist/types/src/errors/index.d.ts' },
                './prettierrc': './.prettierrc.json'
            }
        });

        await documentAPIReference();

        expect(await project.readFile('API_REFERENCE.md')).toBe(`# API Reference

Every export, grouped by import path. This file is updated each time the project is built.

## @dpuse/dpuse-example

### Functions

- buildLabel(text)
- formatError(error)
- getStatus(id, localeId?)
- listItems(limit?)

### Classes

- Connector

### Constants

- default (hidden)
- MAX_COUNT

### Schemas

- configSchema

### Types

- Colour
- Config
- StatusId

## @dpuse/dpuse-example/errors

### Functions

- formatError(error)

### Classes

- DPUseError
`);
    });

    it('names a default class by its declared name', async () => {
        await project.writeFiles({
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-connector-example', exports: { '.': { types: './dist/types/src/index.d.ts' } } }),
            'src/index.ts': 'export default class Connector {}\n'
        });

        await documentAPIReference();

        expect(await project.readFile('API_REFERENCE.md')).toContain('### Classes\n\n- default (Connector)');
    });

    it('works without a tsconfig', async () => {
        await project.writeFiles({
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-example', exports: { '.': { types: './dist/types/src/errors/index.d.ts' } } }),
            'src/errors/index.ts': ERRORS_SOURCE
        });

        await documentAPIReference();

        expect(await project.readFile('API_REFERENCE.md')).toContain('## @dpuse/dpuse-example\n\n### Functions\n\n- formatError(error)');
    });

    it.each([
        ['there are no exports', {}, "package.json 'exports' must name at least one import path with types"],
        ['no export has types', { exports: { './prettierrc': './.prettierrc.json' } }, "package.json 'exports' must name at least one import path with types"],
        ['a source file is missing', { exports: { '.': { types: './dist/types/src/missing.d.ts' } } }, "Unable to read 'src/missing.ts', the source of '@dpuse/dpuse-example'."]
    ])('exits when %s', async (_case, packageJSON, message) => {
        await writeProject(packageJSON);

        await expect(documentAPIReference()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error documenting API reference', expect.objectContaining({ message: expect.stringContaining(message) as unknown }));
    });
});
