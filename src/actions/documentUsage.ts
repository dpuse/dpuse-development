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
> This project is not designed for general use. It is custom built for the DPUse CI/CD process. You are welcome to clone and customise it for your own purposes, but you will need to adapt it to your own project structure and tooling.`;

// How the repository is managed. dpuse-development provides the actions every other repository uses, and runs them on itself.
const DEVELOPMENT_MANAGEMENT_TEXT = 'This repository manages itself using the actions it implements.';
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

        const introduction = buildIntroductionContent(getModuleConfig(configJSON.id), packageJSON.name);
        // A full link, so it still works where the README is shown away from GitHub, such as on npm.
        const packageJSONURL = `${cloneURL.replace(/\.git$/, '')}/blob/main/package.json`;
        const managementText = packageJSON.name === '@dpuse/dpuse-development' ? DEVELOPMENT_MANAGEMENT_TEXT : SHARED_MANAGEMENT_TEXT;
        const management = `${managementText} See the \`scripts\` block in [package.json](${packageJSONURL}) for details.`;
        const content = buildUsageContent(introduction, cloneURL, directoryName, nodeVersion, npmVersion, typescriptVersion, management);

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
    // eslint-disable-next-line security/detect-unsafe-regex -- Linear: each group repeat must start with a literal '.'.
    const match = /\d+(?:\.\d+)*/.exec(range);
    if (match == null) throw new Error(`Unable to parse version from '${range}'.`);
    return match[0];
}

// Worded for how the module reaches people: uploaded to DPUse, installed from npm, or neither.
function buildIntroductionContent(moduleTypeConfig: ModuleTypeConfig, packageName: string | undefined): string {
    const { typeId } = moduleTypeConfig;

    if (UPLOADED_MODULE_TYPE_IDS.has(typeId)) {
        return `This ${typeId} is automatically uploaded to the DPUse Engine cloud once released and becomes instantly available to all new browser app instances, with existing instances notified of the update.

You may view or clone this repository for your own purposes, such as building a new, similar ${typeId}, though there is currently no process to accept third-party ${typeId}s into DPUse at this stage.`;
    }

    if (moduleTypeConfig.publishedTo === 'npm') {
        if (packageName == null || packageName === '') throw new Error("package.json 'name' field is required to document usage.");
        const warning = INTERNAL_NPM_MODULE_TYPE_IDS.has(typeId) ? `${INTERNAL_NPM_WARNING}\n\n` : ''; // Its own paragraph, or the text after it joins the warning.
        return `This [package](https://www.npmjs.com/package/${packageName}) is available on [npm](https://www.npmjs.com/). Install it with:

\`\`\`bash
npm install ${packageName}
\`\`\`

${warning}To work on the source instead, clone this repository.`;
    }

    return `You may view or clone this repository for your own purposes.`;
}

function buildUsageContent(
    introduction: string,
    cloneURL: string,
    directoryName: string,
    nodeVersion: string,
    npmVersion: string,
    typescriptVersion: string,
    management: string
): string {
    return `## Usage

${introduction}

\`\`\`bash
git clone ${cloneURL}
cd ${directoryName}
npm install
\`\`\`

_Requires [Node.js](https://nodejs.org/) ${nodeVersion} or later, [npm](https://www.npmjs.com/) ${npmVersion} or later, and [TypeScript](https://www.typescriptlang.org/) ${typescriptVersion} or later._

${management}`;
}
