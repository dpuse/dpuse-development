// ── External Dependencies & Registrations
import path from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import type { Plugin, ResolvedConfig } from 'vite';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** What a build ships: the installed packages whose code, styles or assets are in its output, as 'name@version', and the
 *  packages its output still imports by name, which whoever installs it also receives. */
export interface ShippedPackagesRecord {
    packages: string[];
    external: string[];
}

interface ShippedPackagesCollection {
    packages: Set<string>;
    external: Set<string>;
}

interface OutputChunk {
    type: 'chunk';
    modules: Record<string, unknown>;
    moduleIds?: string[];
    imports: string[];
    dynamicImports: string[];
}

interface OutputAsset {
    type: 'asset';
    originalFileNames?: string[];
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

export const SHIPPED_PACKAGES_FILE_NAME = 'shipped-packages.json';
const REPORT_DIRECTORY = 'bundle-analysis-reports';

// ── State ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// A build can run more than once in a process, such as for a web worker, so what each finds is merged per project.
const collectionsByRoot = new Map<string, ShippedPackagesCollection>();

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Records which installed packages a build ships, read from the bundler's own list of what it put in each output file.
 *  Modules loaded at run time by URL are not part of the build, so are not recorded; each reports its own. A bundled
 *  package that publishes its own record, as DPUse packages do, adds the packages bundled inside it. */
export function recordShippedPackages(): Plugin {
    let config: ResolvedConfig | undefined;

    return {
        name: 'dpuse-record-shipped-packages',
        apply: 'build',
        configResolved(resolvedConfig) {
            config = resolvedConfig;
        },
        generateBundle(_options, bundle) {
            if (config === undefined) return;
            const collection = collectionsByRoot.get(config.root) ?? { packages: new Set<string>(), external: new Set<string>() };
            collectionsByRoot.set(config.root, collection);
            const outputFileNames = new Set(Object.keys(bundle));
            for (const output of Object.values(bundle) as (OutputChunk | OutputAsset)[]) {
                if (output.type === 'chunk') collectChunk(collection, output, outputFileNames);
                else collectAsset(collection, output, config.root);
            }
        },
        closeBundle() {
            if (config === undefined) return;
            const collection = collectionsByRoot.get(config.root);
            if (collection !== undefined) writeRecord(collection, [path.resolve(config.root, REPORT_DIRECTORY), path.resolve(config.root, config.build.outDir)]);
        }
    };
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

function collectChunk(collection: ShippedPackagesCollection, chunk: OutputChunk, outputFileNames: Set<string>): void {
    const moduleIds = [...Object.keys(chunk.modules), ...(chunk.moduleIds ?? [])];
    for (const moduleId of moduleIds) addPackage(collection, moduleId);

    // An import of something that is not one of this build's own files is left for the package's user to install.
    const importedNames = [...chunk.imports, ...chunk.dynamicImports].filter((imported) => !outputFileNames.has(imported));
    for (const imported of importedNames) {
        const packageName = extractPackageName(imported);
        if (packageName !== undefined) collection.external.add(packageName);
    }
}

function collectAsset(collection: ShippedPackagesCollection, asset: OutputAsset, root: string): void {
    const originalFileNames = asset.originalFileNames ?? [];
    for (const originalFileName of originalFileNames) addPackage(collection, path.resolve(root, originalFileName));
}

/* eslint-disable security/detect-non-literal-fs-filename -- Paths come from the build's own module list and config, not user input. */

// Adds the package a module or asset belongs to, and anything bundled inside that package according to its own record.
function addPackage(collection: ShippedPackagesCollection, moduleId: string): void {
    const packageDirectory = findPackageDirectory(moduleId);
    if (packageDirectory === undefined) return;
    const packageJSON = JSON.parse(readFileSync(path.join(packageDirectory, 'package.json'), 'utf-8')) as { name?: string; version?: string };
    if (packageJSON.name === undefined || packageJSON.version === undefined) return;
    const packageKey = `${packageJSON.name}@${packageJSON.version}`;
    if (collection.packages.has(packageKey)) return;
    collection.packages.add(packageKey);

    const nestedRecordPath = path.join(packageDirectory, 'dist', SHIPPED_PACKAGES_FILE_NAME);
    if (!existsSync(nestedRecordPath)) return;
    const { packages: nestedPackages = [], external: nestedExternal = [] } = JSON.parse(readFileSync(nestedRecordPath, 'utf-8')) as Partial<ShippedPackagesRecord>;
    for (const nestedKey of nestedPackages) collection.packages.add(nestedKey);
    for (const nestedName of nestedExternal) collection.external.add(nestedName);
}

// The folder of the installed package holding a file: the nearest folder with a named package.json, inside the last
// 'node_modules' on the path. Files outside 'node_modules', such as the project's own source, belong to no package.
function findPackageDirectory(moduleId: string): string | undefined {
    const filePath = moduleId.replace(/^\0/, '').split('?', 1)[0] ?? '';
    const nodeModulesIndex = filePath.lastIndexOf(`${path.sep}node_modules${path.sep}`);
    if (nodeModulesIndex === -1) return undefined;
    let directory = path.dirname(filePath);
    while (directory.length > nodeModulesIndex + 'node_modules'.length + 1) {
        const packageJSONPath = path.join(directory, 'package.json');
        if (existsSync(packageJSONPath) && (JSON.parse(readFileSync(packageJSONPath, 'utf-8')) as { name?: string }).name !== undefined) return directory;
        directory = path.dirname(directory);
    }
    return undefined;
}

// Written beside the other bundle reports, where 'npm run document' reads it, and into the output, so it is published with
// the package and a build that bundles this package can add what is inside it.
function writeRecord(collection: ShippedPackagesCollection, directories: string[]): void {
    const record: ShippedPackagesRecord = { packages: [...collection.packages].toSorted(compareNames), external: [...collection.external].toSorted(compareNames) };
    const content = `${JSON.stringify(record, undefined, 4)}\n`;
    for (const directory of directories) {
        mkdirSync(directory, { recursive: true });
        writeFileSync(path.join(directory, SHIPPED_PACKAGES_FILE_NAME), content, 'utf-8');
    }
}

/* eslint-enable security/detect-non-literal-fs-filename -- End of the build plugin's file access. */

// The package a bare import names, such as 'vue' for 'vue/dist/x.js' or '@scope/pkg' for '@scope/pkg/sub'. Built-in
// modules, relative paths and URLs name no package.
function compareNames(a: string, b: string): number {
    return a.localeCompare(b, 'en');
}

function extractPackageName(specifier: string): string | undefined {
    if (specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('node:') || /^[a-z]+:\/\//i.test(specifier)) return undefined;
    const parts = specifier.split('/', 2);
    return specifier.startsWith('@') ? parts.join('/') : parts[0];
}
