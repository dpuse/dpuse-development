// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';
import path from 'node:path';
import ts from 'typescript';

// ── Local Framework
import { logStepHeader, readJSONFile, writeTextFile } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface ExportEntry {
    description: string | undefined;
    detail: string; // What follows the name in code, such as a function's parameters or a constant's type.
    kind: ExportKind;
    name: string;
    origin: string;
    topic: string; // The folder the export is declared in, such as 'Component › Module › Connector'.
}

type ExportKind = 'Classes' | 'Constants' | 'Functions' | 'Schemas' | 'Types';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

// An import path whose exports come from at least this many folders is listed by folder, so a package with one entry
// point for everything still reads as topics rather than one long list.
const TOPIC_GROUPING_MINIMUM = 3;

// Declared directly in the source folder, rather than in a topic folder within it.
const GENERAL_TOPIC = 'General';

// In the order each import path's section lists them.
const EXPORT_KINDS: ExportKind[] = ['Functions', 'Classes', 'Constants', 'Schemas', 'Types'];

const API_REFERENCE_INTRO = 'Every export, grouped by import path. This file is updated each time `npm run document` is run, and with each release.';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// Lists the exports of each import path in package.json 'exports', read from the TypeScript source the path's types are
// built from. Paths without types, such as a shared config file, are left out. This module is loaded only when the API
// reference is written, as TypeScript is an optional peer.
export async function writeAPIReference(stepIcon: string, apiReferencePath: string): Promise<void> {
    logStepHeader(`${stepIcon} Write '${apiReferencePath}'`);

    const packageJSON = await readJSONFile<PackageJson>('package.json');
    const entryPoints = resolveEntryPoints(packageJSON);
    if (entryPoints.length === 0) throw new Error("package.json 'exports' must name at least one import path with types to document the API reference.");

    // Absolute paths, as TypeScript keeps the working directory it first saw, so relative ones could resolve against a
    // folder the process has since left.
    const program = ts.createProgram(
        entryPoints.map(({ sourcePath }) => path.resolve(sourcePath)),
        readCompilerOptions()
    );
    const checker = program.getTypeChecker();
    const fieldGroupOwners = mapFieldGroupOwners(program, checker);

    const sections = entryPoints.map(({ importPath, sourcePath }) => {
        const sourceFile = program.getSourceFile(path.resolve(sourcePath));
        if (sourceFile === undefined) throw new Error(`Unable to read '${sourcePath}', the source of '${importPath}'.`);
        return buildSection(importPath, listExports(checker, sourceFile, fieldGroupOwners));
    });

    await writeTextFile(apiReferencePath, `# API Reference\n\n${API_REFERENCE_INTRO}\n\n${sections.join('\n\n')}\n`);
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

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

function listExports(checker: ts.TypeChecker, sourceFile: ts.SourceFile, fieldGroupOwners: Map<ts.ObjectLiteralExpression, string>): ExportEntry[] {
    const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
    const exportedSymbols = moduleSymbol === undefined ? [] : checker.getExportsOfModule(moduleSymbol);

    const entries = exportedSymbols.flatMap((exportedSymbol) => {
        const symbol = resolveAlias(checker, exportedSymbol);
        const entry = describeExport(checker, formatExportName(exportedSymbol, symbol), symbol, fieldGroupOwners);
        return entry === undefined ? [] : [{ ...entry, description: readDescription(checker, symbol), topic: readTopic(symbol) }];
    });
    return entries.toSorted((a, b) => a.name.localeCompare(b.name));
}

// Named from the folders between 'src' and the file declaring the export: 'component/module/connector' reads as
// 'Component › Module › Connector', with camel-case names split into words.
function readTopic(symbol: ts.Symbol): string {
    const fileName = symbol.declarations?.[0]?.getSourceFile().fileName;
    if (fileName === undefined) return GENERAL_TOPIC;

    // TypeScript reports files with symbolic links resolved (on macOS, '/var' is really '/private/var'), so the source
    // folder is resolved the same way before the two are compared.
    const resolvePath = (unresolvedPath: string): string => ts.sys.realpath?.(unresolvedPath) ?? unresolvedPath;
    const folder = path.relative(resolvePath(path.join(process.cwd(), 'src')), resolvePath(path.dirname(fileName)));
    return folder === '' || folder.startsWith('..')
        ? GENERAL_TOPIC
        : folder
              .split(path.sep)
              .map((segment) => segment.replaceAll(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (letter) => letter.toUpperCase()))
              .join(' › ');
}

// Functions include constants holding a function, as with arrow functions. Schemas are the constants named '…Schema'.
function describeExport(
    checker: ts.TypeChecker,
    name: string,
    symbol: ts.Symbol,
    fieldGroupOwners: Map<ts.ObjectLiteralExpression, string>
): Omit<ExportEntry, 'description' | 'topic'> | undefined {
    const isValue = (symbol.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable)) !== 0;
    const [signature] = isValue ? checker.getSignaturesOfType(checker.getTypeOfSymbol(symbol), ts.SignatureKind.Call) : [];
    const isSchema = name.endsWith('Schema');

    if (signature !== undefined && !isSchema) {
        const parameters = signature.parameters.map((parameter) => formatParameter(checker, parameter));
        return { detail: `(${parameters.join(', ')})`, kind: 'Functions', name, origin: '' };
    }
    if ((symbol.flags & ts.SymbolFlags.Class) !== 0) return { detail: '', kind: 'Classes', name, origin: formatOrigin(checker, symbol, fieldGroupOwners) };
    if (isSchema && (symbol.flags & ts.SymbolFlags.Variable) !== 0) return { detail: '', kind: 'Schemas', name, origin: '' };
    if ((symbol.flags & ts.SymbolFlags.Variable) !== 0) return { detail: `: ${formatConstantType(checker, symbol)}`, kind: 'Constants', name, origin: '' };
    const isType = (symbol.flags & (ts.SymbolFlags.Enum | ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias)) !== 0;
    return isType ? { detail: '', kind: 'Types', name, origin: formatOrigin(checker, symbol, fieldGroupOwners) } : undefined;
}

// The summary of the '/** … */' comment above the item, on one line. Tags such as '@param' are left out, and '//'
// comments, which are notes for maintainers, are never read.
function readDescription(checker: ts.TypeChecker, symbol: ts.Symbol): string | undefined {
    const description = ts.displayPartsToString(symbol.getDocumentationComment(checker)).replaceAll(/\s+/g, ' ').trim();
    return description === '' ? undefined : description;
}

// The type as written, on the declaration or in an 'as' on its value, which keeps the names it was written with. Where
// none is written, the inferred type is widened, so 'MAX_COUNT = 3' reads as 'number' rather than '3'.
function formatConstantType(checker: ts.TypeChecker, symbol: ts.Symbol): string {
    const declaration = symbol.valueDeclaration;
    const variableDeclaration = declaration !== undefined && ts.isVariableDeclaration(declaration) ? declaration : undefined;
    const initializer = variableDeclaration?.initializer;
    const isWrittenAs = initializer !== undefined && ts.isAsExpression(initializer) && !ts.isConstTypeReference(initializer.type); // 'as const' names no type.
    const typeNode = variableDeclaration?.type ?? (isWrittenAs ? initializer.type : undefined);
    return typeNode === undefined ? checker.typeToString(checker.getBaseTypeOfLiteralType(checker.getTypeOfSymbol(symbol)), declaration) : formatTypeNode(typeNode);
}

// What a type or class comes from: the schema it is inferred from, and what it extends or implements, such as
// ' (extends DPUseError)'. A type inferred from a schema has no 'extends' clause, so its parent is found from the schema
// instead. The parent is named even when it is not exported, as it is still what the type inherits from.
function formatOrigin(checker: ts.TypeChecker, symbol: ts.Symbol, fieldGroupOwners: Map<ts.ObjectLiteralExpression, string>): string {
    const heritageClauses = (symbol.declarations ?? []).flatMap((declaration) =>
        ts.isClassDeclaration(declaration) || ts.isInterfaceDeclaration(declaration) ? [...(declaration.heritageClauses ?? [])] : []
    );
    const clauses = heritageClauses.map((clause) => {
        const keyword = clause.token === ts.SyntaxKind.ExtendsKeyword ? 'extends' : 'implements';
        return `${keyword} ${clause.types.map((type) => formatCode(formatTypeNode(type))).join(', ')}`;
    });

    const typeAlias = symbol.declarations?.find((declaration) => ts.isTypeAliasDeclaration(declaration));
    const schemaName = typeAlias === undefined ? undefined : findSchemaName(typeAlias);
    if (typeAlias !== undefined && schemaName !== undefined) {
        clauses.push(`inferred from ${formatCode(schemaName.getText())}`);
        const fields = findSchemaFields(checker, typeAlias);
        const parents = fields === undefined ? [] : findSchemaParents(checker, fields, typeAlias.name.text, fieldGroupOwners);
        if (parents.length > 0) clauses.push(`extends ${parents.map((parent) => formatCode(parent)).join(', ')}`);
    }
    return clauses.length === 0 ? '' : ` (${clauses.join(', ')})`;
}

// A schema inherits by spreading in a group of fields, as in 'strictObject({ ...moduleConfigCoreFields, … })'. Where
// the type owns the group it spreads, as 'ModuleConfig' owns 'moduleConfigCoreFields', its parent is found in that
// group's own spreads.
function findSchemaParents(checker: ts.TypeChecker, fields: ts.ObjectLiteralExpression, typeName: string, fieldGroupOwners: Map<ts.ObjectLiteralExpression, string>): string[] {
    return fields.properties.flatMap((property) => {
        const group = ts.isSpreadAssignment(property) ? resolveObjectLiteral(checker, property.expression) : undefined;
        if (group === undefined) return [];
        const owner = fieldGroupOwners.get(group);
        if (owner === typeName) return findSchemaParents(checker, group, typeName, fieldGroupOwners);
        return owner === undefined ? [] : [owner];
    });
}

// A field group is not a type, so it is named by the type whose schema adds the fewest fields to it. Where two types
// tie, the group is left unnamed rather than guessed at.
function mapFieldGroupOwners(program: ts.Program, checker: ts.TypeChecker): Map<ts.ObjectLiteralExpression, string> {
    const candidates = new Map<ts.ObjectLiteralExpression, { addedFieldCount: number; typeName: string }[]>();
    const typeAliases = program
        .getSourceFiles()
        .filter((sourceFile) => !sourceFile.isDeclarationFile && !program.isSourceFileFromExternalLibrary(sourceFile))
        .flatMap((sourceFile) => sourceFile.statements.filter((statement) => ts.isTypeAliasDeclaration(statement)));

    for (const typeAlias of typeAliases) {
        for (const { addedFieldCount, group } of listFieldGroups(checker, typeAlias)) {
            candidates.set(group, [...(candidates.get(group) ?? []), { addedFieldCount, typeName: typeAlias.name.text }]);
        }
    }

    const owners = new Map<ts.ObjectLiteralExpression, string>();
    for (const [group, groupCandidates] of candidates) {
        const fewestAdded = Math.min(...groupCandidates.map(({ addedFieldCount }) => addedFieldCount));
        const [owner, ...tied] = groupCandidates.filter(({ addedFieldCount }) => addedFieldCount === fewestAdded);
        if (owner !== undefined && tied.length === 0) owners.set(group, owner.typeName);
    }
    return owners;
}

// Each field group a type's schema is built from, with the number of fields the schema adds to it.
function listFieldGroups(checker: ts.TypeChecker, typeAlias: ts.TypeAliasDeclaration): { addedFieldCount: number; group: ts.ObjectLiteralExpression }[] {
    const fields = findSchemaFields(checker, typeAlias);
    if (fields === undefined) return [];

    // Fields declared under a name of their own, rather than written inside the schema, are a group themselves.
    const ownGroup = ts.isVariableDeclaration(fields.parent) ? [{ addedFieldCount: 0, group: fields }] : [];
    const spreadGroups = fields.properties.flatMap((property) => {
        const group = ts.isSpreadAssignment(property) ? resolveObjectLiteral(checker, property.expression) : undefined;
        return group === undefined ? [] : [{ addedFieldCount: fields.properties.length - 1, group }];
    });
    return [...ownGroup, ...spreadGroups];
}

// The schema a type is inferred from, written either as 'InferOutput<typeof schema>' or, where the schema is built in
// place from a group of fields, as 'InferOutput<ReturnType<typeof strictObject<typeof fields>>>'.
function findSchemaName(typeAlias: ts.TypeAliasDeclaration): ts.EntityName | undefined {
    const [argument] = isTypeReferenceNamed(typeAlias.type, 'InferOutput') ? (typeAlias.type.typeArguments ?? []) : [];
    if (argument === undefined) return undefined;
    if (ts.isTypeQueryNode(argument)) return argument.exprName;

    const [returnTypeArgument] = isTypeReferenceNamed(argument, 'ReturnType') ? (argument.typeArguments ?? []) : [];
    const [fieldsQuery] = returnTypeArgument !== undefined && ts.isTypeQueryNode(returnTypeArgument) ? (returnTypeArgument.typeArguments ?? []) : [];
    return fieldsQuery !== undefined && ts.isTypeQueryNode(fieldsQuery) ? fieldsQuery.exprName : undefined;
}

// The fields of the schema a type is inferred from: those passed to 'strictObject({ … })', or the group of fields itself.
function findSchemaFields(checker: ts.TypeChecker, typeAlias: ts.TypeAliasDeclaration): ts.ObjectLiteralExpression | undefined {
    const schemaName = findSchemaName(typeAlias);
    const schema = schemaName === undefined ? undefined : resolveInitializer(checker, schemaName);
    if (schema === undefined) return undefined;
    if (ts.isObjectLiteralExpression(schema)) return schema;

    const [fields] = ts.isCallExpression(schema) ? schema.arguments : [];
    return fields === undefined ? undefined : resolveObjectLiteral(checker, fields);
}

function isTypeReferenceNamed(node: ts.TypeNode, name: string): node is ts.TypeReferenceNode {
    if (!ts.isTypeReferenceNode(node)) return false;
    const typeName = ts.isQualifiedName(node.typeName) ? node.typeName.right : node.typeName;
    return typeName.text === name;
}

function resolveObjectLiteral(checker: ts.TypeChecker, node: ts.Node): ts.ObjectLiteralExpression | undefined {
    if (ts.isObjectLiteralExpression(node)) return node;
    const initializer = resolveInitializer(checker, node);
    return initializer !== undefined && ts.isObjectLiteralExpression(initializer) ? initializer : undefined;
}

// The value a name was declared with, following imports back to the declaration.
function resolveInitializer(checker: ts.TypeChecker, name: ts.Node): ts.Expression | undefined {
    const symbol = checker.getSymbolAtLocation(name);
    const declaration = symbol === undefined ? undefined : resolveAlias(checker, symbol).valueDeclaration;
    return declaration !== undefined && ts.isVariableDeclaration(declaration) ? declaration.initializer : undefined;
}

function resolveAlias(checker: ts.TypeChecker, symbol: ts.Symbol): ts.Symbol {
    return (symbol.flags & ts.SymbolFlags.Alias) === 0 ? symbol : checker.getAliasedSymbol(symbol);
}

// A default export is imported under any name, so the name it has where it is declared is shown alongside.
function formatExportName(exportedSymbol: ts.Symbol, symbol: ts.Symbol): string {
    if (exportedSymbol.name !== 'default') return exportedSymbol.name;
    const declarationName = symbol.declarations?.map((declaration) => ts.getNameOfDeclaration(declaration)?.getText()).find((name) => name !== undefined);
    return declarationName === undefined || declarationName === 'default' ? 'default' : `default (${declarationName})`;
}

// A parameter that can be left out, being optional or having a default, is marked with '?'. Its type is as written, or
// inferred where none is, as with a default value.
function formatParameter(checker: ts.TypeChecker, parameter: ts.Symbol): string {
    const declaration = parameter.valueDeclaration;
    const parameterDeclaration = declaration !== undefined && ts.isParameter(declaration) ? declaration : undefined;
    const isOptional = parameterDeclaration?.questionToken !== undefined || parameterDeclaration?.initializer !== undefined;
    const typeText = parameterDeclaration?.type === undefined ? checker.typeToString(checker.getTypeOfSymbol(parameter), declaration) : formatTypeNode(parameterDeclaration.type);
    const name = parameterDeclaration === undefined ? parameter.name : formatParameterName(parameterDeclaration.name);
    return `${name}${isOptional ? '?' : ''}: ${typeText}`;
}

// A destructured parameter has no name of its own, so TypeScript calls it '__0'. It is shown by the names it unpacks
// instead, as '{ allowedLicenses, moduleLevel }', leaving out their defaults.
function formatParameterName(name: ts.BindingName): string {
    if (ts.isIdentifier(name)) return name.text;
    const names = name.elements.flatMap((element) =>
        ts.isBindingElement(element) ? [(element.dotDotDotToken === undefined ? '' : '...') + formatParameterName(element.name)] : []
    );
    return ts.isObjectBindingPattern(name) ? `{ ${names.join(', ')} }` : `[${names.join(', ')}]`;
}

// A type written across several lines is shown on one.
function formatTypeNode(typeNode: ts.TypeNode): string {
    return typeNode.getText().replaceAll(/\s+/g, ' ');
}

function buildSection(importPath: string, entries: ExportEntry[]): string {
    const topics = [...new Set(entries.map((entry) => entry.topic))].toSorted(compareTopics);
    if (topics.length < TOPIC_GROUPING_MINIMUM) return [`## ${importPath}`, ...buildKindLists(entries, '###')].join('\n\n');

    const topicSections = topics.map((topic) =>
        [
            `### ${topic}`,
            ...buildKindLists(
                entries.filter((entry) => entry.topic === topic),
                '####'
            )
        ].join('\n\n')
    );
    return [`## ${importPath}`, ...topicSections].join('\n\n');
}

// General comes first, as it holds what the whole package shares; the rest are alphabetical.
function compareTopics(a: string, b: string): number {
    const isEitherGeneral = a === GENERAL_TOPIC || b === GENERAL_TOPIC;
    return isEitherGeneral ? Number(b === GENERAL_TOPIC) - Number(a === GENERAL_TOPIC) : a.localeCompare(b);
}

function buildKindLists(entries: ExportEntry[], headingLevel: string): string[] {
    return EXPORT_KINDS.flatMap((kind) => {
        const items = entries.filter((entry) => entry.kind === kind).map((entry) => formatEntry(entry));
        return items.length === 0 ? [] : [`${headingLevel} ${kind}\n\n${items.join('\n')}`];
    });
}

// The name and what follows it are code, shown on a shaded background, with only the name bold so it stands out from
// its parameters or type. The description is a quote nested in the item, which indents every line of it and shows it
// in lighter text, so the names can be read straight down the left.
function formatEntry({ description, detail, name, origin }: ExportEntry): string {
    const detailCode = detail === '' ? '' : formatCode(detail);
    const firstLine = `- **${formatCode(name)}**${detailCode}${origin}`;
    return description === undefined ? firstLine : `${firstLine}\n    > ${description}`;
}

function formatCode(text: string): string {
    return `\`${text}\``;
}
