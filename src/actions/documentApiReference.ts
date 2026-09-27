// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';
import ts from 'typescript';

// ── Local Framework
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, writeTextFile } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

type ExportKind = 'Classes' | 'Constants' | 'Functions' | 'Schemas' | 'Types';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

export const API_REFERENCE_PATH = 'API_REFERENCE.md';

// In the order each import path's section lists them.
const EXPORT_KINDS: ExportKind[] = ['Functions', 'Classes', 'Constants', 'Schemas', 'Types'];

const API_REFERENCE_INTRO = 'Every export, grouped by import path. This file is updated each time the project is built.';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentAPIReference(): Promise<void> {
    try {
        logOperationHeader('Document API Reference');

        await writeAPIReference('1️⃣ ');

        logOperationSuccess('API reference documented');
    } catch (error) {
        console.error('❌  Error documenting API reference', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// Lists the exports of each import path in package.json 'exports', read from the TypeScript source the path's types are
// built from. Paths without types, such as a shared config file, are left out.
export async function writeAPIReference(stepIcon: string): Promise<void> {
    logStepHeader(`${stepIcon} Write '${API_REFERENCE_PATH}'`);

    const packageJSON = await readJSONFile<PackageJson>('package.json');
    const entryPoints = resolveEntryPoints(packageJSON);
    if (entryPoints.length === 0) throw new Error("package.json 'exports' must name at least one import path with types to document the API reference.");

    const program = ts.createProgram(
        entryPoints.map(({ sourcePath }) => sourcePath),
        readCompilerOptions()
    );
    const checker = program.getTypeChecker();

    const sections = entryPoints.map(({ importPath, sourcePath }) => {
        const sourceFile = program.getSourceFile(sourcePath);
        if (sourceFile === undefined) throw new Error(`Unable to read '${sourcePath}', the source of '${importPath}'.`);
        return buildSection(importPath, groupExports(checker, sourceFile));
    });

    await writeTextFile(API_REFERENCE_PATH, `# API Reference\n\n${API_REFERENCE_INTRO}\n\n${sections.join('\n\n')}\n`);
}

// The types path of each export, such as './dist/types/src/errors/index.d.ts', mirrors its source file
// ('src/errors/index.ts'), so the source is found by stripping the output folder and swapping the extension.
function resolveEntryPoints(packageJSON: PackageJson): { importPath: string; sourcePath: string }[] {
    const packageName = packageJSON.name ?? '';
    const exportsField = packageJSON.exports;
    const exportEntries = exportsField != null && typeof exportsField === 'object' && !Array.isArray(exportsField) ? Object.entries(exportsField) : [];

    return exportEntries.flatMap(([subpath, target]) => {
        const typesPath = target != null && typeof target === 'object' && !Array.isArray(target) ? target['types'] : undefined;
        if (typeof typesPath !== 'string') return [];
        const importPath = subpath === '.' ? packageName : `${packageName}${subpath.slice(1)}`;
        const sourcePath = typesPath.replace(/^\.\/dist\/types\//, '').replace(/\.d\.ts$/, '.ts');
        return [{ importPath, sourcePath }];
    });
}

// Uses the project's own tsconfig, so '@/' and other path aliases resolve as they do in the build.
function readCompilerOptions(): ts.CompilerOptions {
    const configPath = ts.findConfigFile(process.cwd(), (fileName) => ts.sys.fileExists(fileName));
    if (configPath === undefined) return { module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, target: ts.ScriptTarget.ESNext };

    const { config } = ts.readConfigFile(configPath, (fileName) => ts.sys.readFile(fileName)) as { config: unknown };
    return ts.parseJsonConfigFileContent(config, ts.sys, process.cwd()).options;
}

function groupExports(checker: ts.TypeChecker, sourceFile: ts.SourceFile): Map<ExportKind, string[]> {
    const groups = new Map<ExportKind, string[]>(EXPORT_KINDS.map((kind) => [kind, []]));
    const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
    const exportedSymbols = moduleSymbol === undefined ? [] : checker.getExportsOfModule(moduleSymbol);

    for (const exportedSymbol of exportedSymbols) {
        const symbol = (exportedSymbol.flags & ts.SymbolFlags.Alias) === 0 ? exportedSymbol : checker.getAliasedSymbol(exportedSymbol);
        const entry = describeExport(checker, formatExportName(exportedSymbol, symbol), symbol);
        if (entry !== undefined) groups.get(entry.kind)?.push(entry.text);
    }

    for (const names of groups.values()) names.sort((a, b) => a.localeCompare(b));
    return groups;
}

// Functions include constants holding a function, as with arrow functions. Schemas are the constants named '…Schema'.
function describeExport(checker: ts.TypeChecker, name: string, symbol: ts.Symbol): { kind: ExportKind; text: string } | undefined {
    const isValue = (symbol.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable)) !== 0;
    const [signature] = isValue ? checker.getSignaturesOfType(checker.getTypeOfSymbol(symbol), ts.SignatureKind.Call) : [];
    const isSchema = name.endsWith('Schema');

    if (signature !== undefined && !isSchema) {
        const parameters = signature.parameters.map((parameter) => formatParameter(parameter));
        return { kind: 'Functions', text: `${name}(${parameters.join(', ')})` };
    }
    if ((symbol.flags & ts.SymbolFlags.Class) !== 0) return { kind: 'Classes', text: name };
    if ((symbol.flags & ts.SymbolFlags.Variable) !== 0) return { kind: isSchema ? 'Schemas' : 'Constants', text: name };
    const isType = (symbol.flags & (ts.SymbolFlags.Enum | ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias)) !== 0;
    return isType ? { kind: 'Types', text: name } : undefined;
}

// A default export is imported under any name, so the name it has where it is declared is shown alongside.
function formatExportName(exportedSymbol: ts.Symbol, symbol: ts.Symbol): string {
    if (exportedSymbol.name !== 'default') return exportedSymbol.name;
    const declarationName = symbol.declarations?.map((declaration) => ts.getNameOfDeclaration(declaration)?.getText()).find((name) => name !== undefined);
    return declarationName === undefined || declarationName === 'default' ? 'default' : `default (${declarationName})`;
}

// A parameter that can be left out, being optional or having a default, is marked with '?'.
function formatParameter(parameter: ts.Symbol): string {
    const declaration = parameter.valueDeclaration;
    const isOptional = declaration !== undefined && ts.isParameter(declaration) && (declaration.questionToken !== undefined || declaration.initializer !== undefined);
    return `${parameter.name}${isOptional ? '?' : ''}`;
}

function buildSection(importPath: string, groups: Map<ExportKind, string[]>): string {
    const lists = EXPORT_KINDS.flatMap((kind) => {
        const names = groups.get(kind) ?? [];
        const items = names.map((name) => `- ${name}`);
        return names.length === 0 ? [] : [`### ${kind}\n\n${items.join('\n')}`];
    });
    return [`## ${importPath}`, ...lists].join('\n\n');
}
