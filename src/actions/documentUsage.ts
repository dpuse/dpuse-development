// ── External Dependencies & Registrations
import type { ModuleConfig } from '@dpuse/dpuse-shared';
import type { PackageJson } from 'type-fest';

// ── Local Framework
import type { ModuleTypeConfig } from '@/utilities';
import { getModuleConfig, logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, writeReadmeSection } from '@/utilities';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const START_MARKER = '<!-- USAGE_START -->';
const END_MARKER = '<!-- USAGE_END -->';

// Module types the DPUse Engine uploads to the cloud for the browser app to load. The engine itself is also uploaded, but
// isn't something others build their own version of, so it gets the general wording.
const UPLOADED_MODULE_TYPE_IDS = new Set<ModuleTypeConfig['typeId']>(['connector', 'cookbook', 'presenter']);

// Published to npm only so DPUse projects can install them, not for general use, so the npm wording carries a warning.
const INTERNAL_NPM_MODULE_TYPE_IDS = new Set<ModuleTypeConfig['typeId']>(['development', 'eslint']);
const INTERNAL_NPM_WARNING = `> [!WARNING]
> Built for DPUse projects and their conventions. You are welcome to use or adapt it, but it may change without notice to suit DPUse.`;

// How the repository is managed. dpuse-development provides the actions every other repository uses, and is managed with them too.
const DEVELOPMENT_MANAGEMENT_TEXT = 'This repository is managed using the actions it implements.';
const SHARED_MANAGEMENT_TEXT = 'This repository is managed using the common set of actions provided by [@dpuse/dpuse-development](https://github.com/dpuse/dpuse-development).';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentUsage(): Promise<void> {
    try {
        logOperationHeader('Document Usage');

        logStepHeader("1️⃣  Insert usage content into 'README.md'");

        const [packageJSON, configJSON] = await Promise.all([readJSONFile<PackageJson>('package.json'), readJSONFile<ModuleConfig>('config.json')]);

        const cloneURL = resolveCloneURL(packageJSON);
        const directoryName = resolveDirectoryName(cloneURL);
        const nodeVersion = resolveVersion(packageJSON.engines?.node);
        const npmVersion = resolveVersion(packageJSON.engines?.npm);
        const typescriptVersion = resolveVersion(packageJSON.devDependencies?.['typescript']);

        const moduleTypeConfig = getModuleConfig(configJSON.id);
        const introduction = buildIntroductionContent(moduleTypeConfig, packageJSON, nodeVersion, npmVersion);
        const requirements = buildRequirementsContent(moduleTypeConfig, nodeVersion, npmVersion, typescriptVersion);
        // A full link, so it still works where the README is shown away from GitHub, such as on npm.
        const packageJSONURL = `${cloneURL.replace(/\.git$/, '')}/blob/main/package.json`;
        const managementText = packageJSON.name === '@dpuse/dpuse-development' ? DEVELOPMENT_MANAGEMENT_TEXT : SHARED_MANAGEMENT_TEXT;
        const management = `${managementText} See the \`scripts\` block in [package.json](${packageJSONURL}) for details.`;
        const releaseStatus = buildReleaseStatusContent(moduleTypeConfig, cloneURL.replace(/\.git$/, ''));
        const content = buildUsageContent(introduction, cloneURL, directoryName, requirements, `${management}\n\n${releaseStatus}`);

        await writeReadmeSection(content, START_MARKER, END_MARKER);

        logOperationSuccess('Usage documented');
    } catch (error) {
        console.error('❌  Error documenting usage', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

function resolveCloneURL(packageJSON: PackageJson): string {
    const repository = packageJSON.repository;
    const url = typeof repository === 'string' ? repository : repository?.url;
    if (url == null || url === '') throw new Error("package.json 'repository' field is required to document usage.");
    return url.replace(/^git\+/, '');
}

function resolveDirectoryName(cloneURL: string): string {
    const lastSegment = cloneURL.split('/').at(-1) ?? '';
    return lastSegment.replace(/\.git$/, '');
}

function resolveVersion(range: string | undefined): string {
    if (range == null) throw new Error('package.json version range is required to document usage.');
    const match = /\d+(?:\.\d+)*/.exec(range);
    if (match == null) throw new Error(`Unable to parse version from '${range}'.`);
    return match[0];
}

// Worded for how the module reaches people: uploaded to DPUse, installed from npm, or neither.
function buildIntroductionContent(moduleTypeConfig: ModuleTypeConfig, packageJSON: PackageJson, nodeVersion: string, npmVersion: string): string {
    const { typeId } = moduleTypeConfig;

    if (UPLOADED_MODULE_TYPE_IDS.has(typeId)) {
        return `This ${typeId} is automatically uploaded to the DPUse Engine cloud once released and becomes instantly available to all new browser app instances, with existing instances notified of the update.

You may view or clone this repository for your own purposes, such as building a new, similar ${typeId}, though there is currently no process to accept third-party ${typeId}s into DPUse at this stage.`;
    }

    if (moduleTypeConfig.publishedTo === 'npm') {
        const packageName = packageJSON.name;
        if (packageName == null || packageName === '') throw new Error("package.json 'name' field is required to document usage.");
        const isInternal = INTERNAL_NPM_MODULE_TYPE_IDS.has(typeId);
        const warning = isInternal ? `${INTERNAL_NPM_WARNING}\n\n` : ''; // Its own paragraph, or the text after it joins the warning.
        // An internal package is a development tool, so it is installed as a development dependency. Peer dependencies
        // are named in the same command, because npm only warns when they are missing.
        const peerDependencies = Object.entries(packageJSON.peerDependencies ?? {});
        const installArguments = [...(isInternal ? ['-D'] : []), packageName, ...peerDependencies.map(([name]) => name)];
        const peerRequirements = peerDependencies.map(([name, range]) => `\`${name}\` ${resolveVersion(range)} or later`);
        const peerKind = peerRequirements.length === 1 ? 'a peer dependency' : 'peer dependencies';
        const peerText = peerRequirements.length > 0 ? `, and ${peerRequirements.join(', ')} as ${peerKind}` : '';
        return `This [package](https://www.npmjs.com/package/${packageName}) is available on [npm](https://www.npmjs.com/). Install it with:

\`\`\`bash
npm install ${installArguments.join(' ')}
\`\`\`

_Requires [Node.js](https://nodejs.org/) ${nodeVersion} or later, [npm](https://www.npmjs.com/) ${npmVersion} or later${peerText}._

${warning}To work on the source instead, clone this repository.`;
    }

    return `You may view or clone this repository for your own purposes.`;
}

// An npm package states its Node.js and npm versions with its install command, so the line after the clone steps only
// adds what working on the source needs. typescript-eslint, which every DPUse project lints with, supports TypeScript
// up to the end of 6.0.
function buildRequirementsContent(moduleTypeConfig: ModuleTypeConfig, nodeVersion: string, npmVersion: string, typescriptVersion: string): string {
    const [major = '', minor = '0'] = typescriptVersion.split('.', 2);
    const typescript = `[TypeScript](https://www.typescriptlang.org/) ${typescriptVersion} or a later ${major}.${minor} release. Later versions, including TypeScript 7, are not supported yet.`;
    return moduleTypeConfig.publishedTo === 'npm'
        ? `_Working on the source also requires ${typescript}_`
        : `_Requires [Node.js](https://nodejs.org/) ${nodeVersion} or later, [npm](https://www.npmjs.com/) ${npmVersion} or later, and ${typescript}_`;
}

// DPUse is a new product, so every project is a release candidate. Version advice is given only for npm packages,
// because people install them at a version they choose, while the app always loads the latest uploaded module.
function buildReleaseStatusContent(moduleTypeConfig: ModuleTypeConfig, repositoryURL: string): string {
    const { publishedTo, typeId } = moduleTypeConfig;
    const isNPMPackage = publishedTo === 'npm';
    let subject = 'project';
    if (isNPMPackage) subject = 'package';
    else if (UPLOADED_MODULE_TYPE_IDS.has(typeId)) subject = typeId;
    const versioning = isNPMPackage
        ? `

The last number of the version increases with every push to GitHub, whether or not that push is released, so the versions of consecutive releases can skip numbers, for example from 1.1.120 to 1.1.124. Until the first stable release, any release may include changes that need updates in the projects that use it, so depend on an exact version to avoid unexpected changes. Once stable, versions will follow [Semantic Versioning](https://semver.org): breaking changes in the first number, new features in the second and fixes in the last.`
        : '';
    return `### Release Status

DPUse is a new product, and this ${subject} is a release candidate: complete and in use across DPUse, but not yet at its first stable release.${versioning}

Every release is listed on the [Releases](${repositoryURL}/releases) page.`;
}

function buildUsageContent(introduction: string, cloneURL: string, directoryName: string, requirements: string, management: string): string {
    return `## Usage

${introduction}

\`\`\`bash
git clone ${cloneURL}
cd ${directoryName}
npm install
\`\`\`

${requirements}

${management}`;
}
