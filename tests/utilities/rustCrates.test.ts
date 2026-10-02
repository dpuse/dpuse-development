/* eslint-disable security/detect-non-literal-fs-filename -- Tests only name files inside their own temporary folder. */

// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { documentRustCrates } from '@/utilities/rustCrates';
import { useTemporaryProject } from '../support/temporaryProject';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Cargo writes the tree and the metadata the crates are read from, so the mock writes fixtures instead, keyed by the
// file each command writes to.
const cargo = vi.hoisted((): { outputs: Record<string, string>; calls: string[][] } => ({ outputs: {}, calls: [] }));
vi.mock('@/utilities', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    spawnCommandToFile: vi.fn(async (_label: string, _command: string, commandArguments: string[], outputPath: string) => {
        cargo.calls.push(commandArguments);
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, cargo.outputs[outputPath] ?? '', 'utf-8');
    })
}));

// crates.io asks for a pause between requests, which the tests do not need to wait for.
vi.mock('node:timers/promises', () => ({ setTimeout: vi.fn().mockResolvedValue(undefined) }));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

// The project's own crate, two crates it uses, one reached through the other, and a repeat Cargo marks with '(*)'.
const CARGO_TREE = [
    '0example-core v0.1.0 (/projects/example/rust/example_core)|MIT|',
    '1csv-core v0.1.13|Unlicense/MIT|https://github.com/BurntSushi/rust-csv',
    '2memchr v2.8.0|Unlicense OR MIT|https://github.com/BurntSushi/memchr',
    '1wasm-bindgen v0.2.114|MIT OR Apache-2.0|',
    '2memchr v2.8.0|Unlicense OR MIT|https://github.com/BurntSushi/memchr (*)'
].join('\n');

// Places each crate in a pretend download cache with the given files, and returns Cargo's metadata pointing at them.
async function writeCrateSources(crates: Record<string, string[]>): Promise<string> {
    const packages = [];
    for (const [crateKey, fileNames] of Object.entries(crates)) {
        const [name = '', version = ''] = crateKey.split('@', 2);
        const crateDirectory = path.resolve('cargo-cache', `${name}-${version}`);
        await fs.mkdir(crateDirectory, { recursive: true });
        for (const fileName of ['Cargo.toml', ...fileNames]) await fs.writeFile(path.join(crateDirectory, fileName), `${crateKey} ${fileName}`, 'utf-8');
        packages.push({ name, version, manifest_path: path.join(crateDirectory, 'Cargo.toml') });
    }
    return JSON.stringify({ packages });
}

async function setUpRustProject(): Promise<void> {
    await project.writeFiles({ 'rust/Cargo.toml': '[workspace]\n' });
    cargo.calls = [];
    cargo.outputs = {
        'licenses/cargoTree.txt': CARGO_TREE,
        'licenses/cargoMetadata.json': await writeCrateSources({
            'csv-core@0.1.13': ['COPYING', 'LICENSE-MIT', 'README.md'],
            'memchr@2.8.0': ['UNLICENSE'],
            'wasm-bindgen@0.2.114': []
        })
    };
    vi.stubGlobal(
        'fetch',
        vi.fn((url: string) => {
            if (!url.endsWith('/csv-core')) return Promise.resolve(new Response('', { status: 404 }));
            const data = {
                crate: { max_stable_version: '0.1.14' },
                versions: [
                    { num: '0.1.14', created_at: '2026-09-01T00:00:00Z' },
                    { num: '0.1.13', created_at: '2025-10-17T00:00:00Z' }
                ]
            };
            return Promise.resolve(Response.json(data));
        })
    );
}

// One crate with the given licence, checked against the given allow list.
async function checkLicence(licenseExpression: string, allowedLicenses: string): Promise<unknown> {
    await setUpRustProject();
    cargo.outputs['licenses/cargoTree.txt'] = `0example v0.1.0 (/projects/example)|MIT|\n1some-crate v1.0.0|${licenseExpression}|`;
    cargo.outputs['licenses/cargoMetadata.json'] = JSON.stringify({ packages: [] });
    return documentRustCrates('Identify', allowedLicenses);
}

describe('documentRustCrates', () => {
    it('does nothing for a project with no Rust code', async () => {
        expect(await documentRustCrates('Identify', 'MIT')).toBeNull();
    });

    it('lists the crates compiled into the WebAssembly once each, leaving out macros and the project’s own crate', async () => {
        await setUpRustProject();

        const result = await documentRustCrates('Identify', 'MIT');

        expect(cargo.calls[0]).toEqual(expect.arrayContaining(['tree', '--edges', 'normal,no-proc-macro', '--target', 'wasm32-unknown-unknown']));
        expect(result?.crates.map((crate) => `${crate.name}@${crate.version}`)).toEqual(['csv-core@0.1.13', 'memchr@2.8.0', 'wasm-bindgen@0.2.114']);
        expect(result?.treeItems).toEqual([
            { name: 'example-core', version: '0.1.0', depth: 0, isOwn: true },
            { name: 'csv-core', version: '0.1.13', depth: 1, isOwn: false },
            { name: 'memchr', version: '2.8.0', depth: 2, isOwn: false },
            { name: 'wasm-bindgen', version: '0.2.114', depth: 1, isOwn: false },
            { name: 'memchr', version: '2.8.0', depth: 2, isOwn: false }
        ]);
        await expect(fs.access('licenses/cargoTree.txt')).rejects.toThrow();
        await expect(fs.access('licenses/cargoMetadata.json')).rejects.toThrow();
    });

    it('copies each crate’s licence files and links its repository, or its crates.io page when it names none', async () => {
        await setUpRustProject();

        const result = await documentRustCrates('Identify', 'MIT');

        const [csvCore, memchr, wasmBindgen] = result?.crates ?? [];
        expect(csvCore?.licenseFiles).toEqual([
            { label: 'COPYING', path: 'downloads/csv-core@0.1.13-COPYING' },
            { label: 'LICENSE-MIT', path: 'downloads/csv-core@0.1.13-LICENSE-MIT' }
        ]);
        expect(await project.readFile('licenses/downloads/csv-core@0.1.13-LICENSE-MIT')).toBe('csv-core@0.1.13 LICENSE-MIT');
        expect(memchr?.licenseFiles).toEqual([{ label: 'UNLICENSE', path: 'downloads/memchr@2.8.0-UNLICENSE' }]);
        expect(wasmBindgen?.licenseFiles).toEqual([]);
        expect(csvCore?.repository).toBe('https://github.com/BurntSushi/rust-csv');
        expect(wasmBindgen?.repository).toBe('https://crates.io/crates/wasm-bindgen');
    });

    it('adds release dates and the newest version from crates.io, leaving them out when it cannot answer', async () => {
        await setUpRustProject();

        const result = await documentRustCrates('Identify', 'MIT');

        expect(result?.crates[0]).toEqual(expect.objectContaining({ publishedDate: '2025-10-17T00:00:00Z', latestVersion: '0.1.14', latestPublishedDate: '2026-09-01T00:00:00Z' }));
        expect(result?.crates[1]).toEqual(expect.objectContaining({ publishedDate: '', latestVersion: '' }));
        expect(fetch).toHaveBeenCalledWith('https://crates.io/api/v1/crates/csv-core', {
            headers: { 'User-Agent': expect.stringContaining('dpuse-development') as string },
            signal: expect.any(AbortSignal) as AbortSignal
        });
    });

    describe('licences', () => {
        it.each([
            ['either of two licences', 'MIT OR Apache-2.0', 'MIT'],
            ['the older slash form of either', 'Unlicense/MIT', 'MIT'],
            ['both licences when both are needed', '(MIT OR Apache-2.0) AND Unicode-3.0', 'MIT;Unicode-3.0'],
            ['an allow list that also names a licence page', 'MIT', 'https://example.com/license;MIT']
        ])('accepts %s', async (_label, licenseExpression, allowedLicenses) => {
            await expect(checkLicence(licenseExpression, allowedLicenses)).resolves.not.toBeNull();
        });

        it.each([
            ['only one of two licences that are both needed', '(MIT OR Apache-2.0) AND Unicode-3.0', 'MIT', '(MIT OR Apache-2.0) AND Unicode-3.0'],
            ['a licence not allowed', 'GPL-3.0-only', 'MIT', 'GPL-3.0-only'],
            ['no licence', '', 'MIT', 'no licence']
        ])('rejects %s, naming the crate', async (_label, licenseExpression, allowedLicenses, reported) => {
            await expect(checkLicence(licenseExpression, allowedLicenses)).rejects.toThrow(`Rust crates with licences not allowed: some-crate@1.0.0 (${reported}).`);
        });
    });
});

/* eslint-enable security/detect-non-literal-fs-filename -- Tests only name files inside their own temporary folder. */
