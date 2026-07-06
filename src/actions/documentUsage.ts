// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── Local (Development) Framework
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile, substituteText, writeTextFile } from '@/utilities';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const START_MARKER = '<!-- USAGE_START -->';
const END_MARKER = '<!-- USAGE_END -->';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentUsage(): Promise<void> {
    try {
        logOperationHeader('Document Usage');

        logStepHeader("1️⃣  Insert usage content into 'README.md'");

        const packageJSON = await readJSONFile<PackageJson>('package.json');

        const cloneURL = resolveCloneURL(packageJSON);
        const directoryName = resolveDirectoryName(cloneURL);
        const nodeVersion = resolveEngineVersion(packageJSON.engines?.['node']);
        const npmVersion = resolveEngineVersion(packageJSON.engines?.['npm']);

        const content = buildUsageContent(cloneURL, directoryName, nodeVersion, npmVersion);

        const originalContent = await readTextFile('./README.md');
        const updatedContent = substituteText(originalContent, content, START_MARKER, END_MARKER);
        await writeTextFile('README.md', updatedContent);

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

function resolveEngineVersion(range: string | undefined): string {
    if (range == null) throw new Error("package.json 'engines' field is required to document usage.");
    const match = /\d+(?:\.\d+)*/.exec(range);
    if (match == null) throw new Error(`Unable to parse engine version from '${range}'.`);
    return match[0];
}

function buildUsageContent(cloneURL: string, directoryName: string, nodeVersion: string, npmVersion: string): string {
    return `This connector is automatically uploaded to the DPUse Engine cloud once released and becomes instantly available to all new browser app instances, with existing instances notified of the update.

You may view or clone this repository for your own purposes, such as building a new, similar connector, though there is currently no process to accept third-party connectors into DPUse at this stage. Cloned or forked code is unsupported and isn't guaranteed to remain compatible with the DPUse Engine as it evolves.

\`\`\`bash
git clone ${cloneURL}
cd ${directoryName}
npm install
\`\`\`

_Requires [Node.js](https://nodejs.org/) ${nodeVersion} or later and [npm](https://www.npmjs.com/) ${npmVersion} or later._`;
}
