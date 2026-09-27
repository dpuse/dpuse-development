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
/**
 * Look up a status,
 * in the given locale.
 * @param id The status to look up.
 */
export function getStatus(id: string, localeId?: string): string { return id + (localeId ?? ''); }
export function listItems(limit = 10): number[] { return [limit]; }
export const buildLabel = (text: string): string => text;
export class Connector { list(): void {} }
/** The most items allowed. */
export const MAX_COUNT = 3;
export const LIMITS = { low: 1 } as Record<string, number>;
export const MODES = ['a', 'b'] as const;
export const configSchema = { type: 'object' };
// A note for maintainers, not a description.
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

// Stand-ins for valibot, as only the way a type is written is read, never the library itself.
const SCHEMA_SOURCE = `
export type InferOutput<T> = T;
export function strictObject<T>(entries: T): T { return entries; }
export function literalUnion<T>(values: T): T { return values; }
`;

const INHERITANCE_SOURCE = `
import { type InferOutput, literalUnion, strictObject } from '@/schema';
export const baseFields = { id: '' };
export type BaseConfig = InferOutput<ReturnType<typeof strictObject<typeof baseFields>>>;
export const componentFields = { ...baseFields, status: '' };
const componentConfigSchema = strictObject({ ...componentFields });
export type ComponentConfig = InferOutput<typeof componentConfigSchema>;
export const moduleFields = { ...componentFields, version: '' };
const moduleConfigSchema = strictObject({ ...moduleFields, typeId: '' });
export type ModuleConfig = InferOutput<typeof moduleConfigSchema>;
const connectorConfigSchema = strictObject({ ...moduleFields, typeId: '', category: '' });
export type ConnectorConfig = InferOutput<typeof connectorConfigSchema>;
export const sharedFields = { label: '' };
const alphaConfigSchema = strictObject({ ...sharedFields, alpha: '' });
export type AlphaConfig = InferOutput<typeof alphaConfigSchema>;
const betaConfigSchema = strictObject({ ...sharedFields, beta: '' });
export type BetaConfig = InferOutput<typeof betaConfigSchema>;
const moduleTypeIdSchema = literalUnion(['connector', 'tool']);
export type ModuleTypeId = InferOutput<typeof moduleTypeIdSchema>;
export interface SettingsConfig extends Omit<BaseConfig, 'id'> { theme: string }
export interface Reportable { report(): void }
class BaseError extends Error {}
export class AppError extends BaseError implements Reportable { report(): void {} }
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
    it('lists every export of each import path, grouped by kind, with the description from its /** */ comment', async () => {
        await writeProject({
            exports: {
                '.': { import: './dist/dpuse-example.es.js', types: './dist/types/src/index.d.ts' },
                './errors': { import: './dist/dpuse-example-errors.es.js', types: './dist/types/src/errors/index.d.ts' },
                './prettierrc': './.prettierrc.json'
            }
        });

        await documentAPIReference();

        expect(await project.readFile('API_REFERENCE.md')).toBe(String.raw`# API Reference

Every export, grouped by import path. This file is updated each time the project is built.

## @dpuse/dpuse-example

### Functions

- **buildLabel**(text: string)
- **formatError**(error: unknown)
- **getStatus**(id: string, localeId?: string)
    > Look up a status, in the given locale.
- **listItems**(limit?: number)

### Classes

- **Connector**

### Constants

- **default (hidden)**: number
- **LIMITS**: Record\<string, number>
- **MAX_COUNT**: number
    > The most items allowed.
- **MODES**: readonly ["a", "b"]

### Schemas

- **configSchema**

### Types

- **Colour**
- **Config**
- **StatusId**

## @dpuse/dpuse-example/errors

### Functions

- **formatError**(error: unknown)

### Classes

- **DPUseError** (extends Error)
`);
    });

    it('names the schema each type is inferred from, and what each class and type inherits from', async () => {
        await project.writeFiles({
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-example', exports: { '.': { types: './dist/types/src/index.d.ts' } } }),
            'tsconfig.json': TSCONFIG,
            'src/schema.ts': SCHEMA_SOURCE,
            'src/index.ts': INHERITANCE_SOURCE
        });

        await documentAPIReference();

        expect(await project.readFile('API_REFERENCE.md')).toContain(String.raw`### Classes

- **AppError** (extends BaseError, implements Reportable)

### Constants

- **baseFields**: { id: string; }
- **componentFields**: { status: string; id: string; }
- **moduleFields**: { version: string; status: string; id: string; }
- **sharedFields**: { label: string; }

### Types

- **AlphaConfig** (inferred from alphaConfigSchema)
- **BaseConfig** (inferred from baseFields)
- **BetaConfig** (inferred from betaConfigSchema)
- **ComponentConfig** (inferred from componentConfigSchema, extends BaseConfig)
- **ConnectorConfig** (inferred from connectorConfigSchema, extends ModuleConfig)
- **ModuleConfig** (inferred from moduleConfigSchema, extends ComponentConfig)
- **ModuleTypeId** (inferred from moduleTypeIdSchema)
- **Reportable**
- **SettingsConfig** (extends Omit\<BaseConfig, 'id'>)`);
    });

    it('names a default class by its declared name', async () => {
        await project.writeFiles({
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-connector-example', exports: { '.': { types: './dist/types/src/index.d.ts' } } }),
            'src/index.ts': 'export default class Connector {}\n'
        });

        await documentAPIReference();

        expect(await project.readFile('API_REFERENCE.md')).toContain('### Classes\n\n- **default (Connector)**');
    });

    it('works without a tsconfig', async () => {
        await project.writeFiles({
            'package.json': JSON.stringify({ name: '@dpuse/dpuse-example', exports: { '.': { types: './dist/types/src/errors/index.d.ts' } } }),
            'src/errors/index.ts': ERRORS_SOURCE
        });

        await documentAPIReference();

        expect(await project.readFile('API_REFERENCE.md')).toContain('## @dpuse/dpuse-example\n\n### Functions\n\n- **formatError**(error: unknown)');
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
