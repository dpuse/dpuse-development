// ── Local (Development) Framework
import {
    clearDirectory,
    execCommand,
    logOperationHeader,
    logOperationSuccess,
    logStepHeader,
    readJSONFile,
    readTextFile,
    spawnCommandToFile,
    substituteText,
    writeTextFile
} from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface License {
    name: string;
    repository: string;
    licenseTypes: string;
    installedVersion: string;
    latestVersion: string;
    author: string;
    publishedDate: string;
    licenseFileLink?: string;
}

interface ProductionPackageLicense {
    licenses: string;
    repository?: string;
    publisher?: string;
    email?: string;
    path?: string;
    licenseFile?: string;
}

interface NpmPackageTree {
    version?: string;
    dependencies?: Record<string, NpmPackageTree>;
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const START_MARKER = '<!-- DEPENDENCY_LICENSES_START -->';
const END_MARKER = '<!-- DEPENDENCY_LICENSES_END -->';
const TREE_START_MARKER = '<!-- DEPENDENCY_TREE_START -->';
const TREE_END_MARKER = '<!-- DEPENDENCY_TREE_END -->';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentDependencies(allowedLicenses = 'MIT'): Promise<void> {
    try {
        logOperationHeader('Document Dependencies');

        await clearDirectory('licenses/downloads');

        await execCommand('1️⃣  Identify production licenses', 'license-checker-rseidelsohn', [
            '--production',
            '--json',
            '--files',
            'licenses/downloads',
            '--relativeModulePath',
            '--relativeLicensePath',
            '--onlyAllow',
            `"${allowedLicenses}"`,
            '--out',
            'licenses/licenses.json'
        ]);

        await spawnCommandToFile('2️⃣  Identify transitive dependencies', 'npm', ['ls', '--all', '--json', '--omit=dev'], 'licenses/licenseTree.json');

        await insertLicensesIntoReadme('3️⃣');

        logOperationSuccess('Dependencies documented.');
    } catch (error) {
        console.error('❌ Error documenting dependencies.', error);
        // eslint-disable-next-line unicorn/no-process-exit -- This only runs from package script.
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

async function insertLicensesIntoReadme(stepIcon: string): Promise<void> {
    logStepHeader(`${stepIcon}  Insert licenses into 'README.md'`);

    const [productionPackageLicenses, licenseTree] = await Promise.all([
        readJSONFile<Record<string, ProductionPackageLicense>>('licenses/licenses.json'),
        readJSONFile<NpmPackageTree>('licenses/licenseTree.json')
    ]);

    const byKey = new Map<string, License>();
    for (const [key, value] of Object.entries(productionPackageLicenses)) {
        byKey.set(key, parseLicenseEntry(key, value));
    }

    await Promise.all(
        byKey.values().map(async (license) => {
            const data = await fetchNpmData(license.name, license.installedVersion);
            license.latestVersion = data.latestVersion;
            license.publishedDate = data.publishedDate;
        })
    );

    let licensesContent = '|Name|License|Installed|Latest|Published|Document|\n|:-|:-|:-:|:-:|:-|:-|\n';
    for (const license of byKey.values()) {
        licensesContent += formatLicenseRow(license);
    }

    const treeItems: string[] = [];
    if (licenseTree.dependencies != null) {
        walkTreeList(licenseTree.dependencies, byKey, treeItems, 0);
    }

    const originalContent = await readTextFile('./README.md');
    const withTable = substituteText(originalContent, licensesContent, START_MARKER, END_MARKER);
    const withTree = substituteText(withTable, treeItems.join('\n'), TREE_START_MARKER, TREE_END_MARKER);
    await writeTextFile('README.md', withTree);
}

function parseLicenseEntry(key: string, value: ProductionPackageLicense): License {
    const lastAt = key.lastIndexOf('@');
    const name = lastAt > 0 ? key.slice(0, lastAt) : key;
    const installedVersion = lastAt > 0 ? key.slice(lastAt + 1) : '';
    return {
        name,
        repository: value.repository ?? `https://www.npmjs.com/package/${name}`,
        licenseTypes: value.licenses,
        installedVersion,
        author: value.publisher ?? '',
        latestVersion: '',
        publishedDate: '',
        ...(value.licenseFile != null && { licenseFileLink: value.licenseFile })
    };
}

async function fetchNpmData(name: string, version: string): Promise<{ latestVersion: string; publishedDate: string }> {
    try {
        const response = await fetch(`https://registry.npmjs.org/${name.replace('/', '%2F')}`);
        if (response.ok) {
            const data = (await response.json()) as { 'dist-tags'?: Record<string, string>; time?: Record<string, string> };
            const distributionTags = new Map(Object.entries(data['dist-tags'] ?? {}));
            const timeMap = new Map(Object.entries(data.time ?? {}));
            const latestVersion = distributionTags.get('latest') ?? '';
            const publishedDate = timeMap.get(version) ?? '';
            return { latestVersion, publishedDate };
        }
    } catch {
        // Ignore network errors.
    }
    return { latestVersion: '', publishedDate: '' };
}

function formatLicenseRow(license: License): string {
    const installed = license.installedVersion === license.latestVersion
        ? license.installedVersion
        : `${license.installedVersion} ⚠️`;
    const publishedDate = license.publishedDate
        ? determineLatestAge(license.publishedDate.split('T', 1)[0])
        : 'n/a';
    let licenseLink;
    if (license.licenseFileLink == null || license.licenseFileLink === '') {
        licenseLink = '⚠️ No license file';
    } else {
        const lastPart = license.licenseFileLink.slice(Math.max(0, license.licenseFileLink.lastIndexOf('/') + 1));
        licenseLink = `[${lastPart}](${license.licenseFileLink})`;
    }
    return `|[${license.name}](${license.repository})|${license.licenseTypes}|${installed}|${license.latestVersion}|${publishedDate}|${licenseLink}|\n`;
}

function walkTreeList(
    deps: Record<string, NpmPackageTree>,
    byKey: Map<string, License>,
    items: string[],
    depth: number
): void {
    const indent = '  '.repeat(depth);
    for (const [name, node] of Object.entries(deps)) {
        const version = node.version ?? '';
        const license = byKey.get(`${name}@${version}`);
        const licenseType = license?.licenseTypes ?? 'n/a';
        let documentLink;
        if (license?.licenseFileLink == null || license.licenseFileLink === '') {
            documentLink = '⚠️ No license file';
        } else {
            const lastPart = license.licenseFileLink.slice(Math.max(0, license.licenseFileLink.lastIndexOf('/') + 1));
            documentLink = `[${lastPart}](${license.licenseFileLink})`;
        }
        const nameLink = license == null ? name : `[${name}](${license.repository})`;
        items.push(`${indent}- **${nameLink}** \`${version}\` ${licenseType} — ${documentLink}`);
        if (node.dependencies != null) {
            walkTreeList(node.dependencies, byKey, items, depth + 1);
        }
    }
}

function determineLatestAge(momentString?: string): string {
    if (momentString == null || momentString === '') return 'n/a';

    const dateString = momentString.split('T', 1)[0];
    if (dateString == null || dateString === '') return 'n/a';

    const input = new Date(dateString);
    const now = new Date();
    let months = (now.getFullYear() - input.getFullYear()) * 12 + (now.getMonth() - input.getMonth());
    if (now.getDate() < input.getDate()) months -= 1;

    if (months === 0) return `this month: ${dateString}`;
    if (months === 1) return `1 month ago: ${dateString}`;
    if (months <= 6) return `${String(months)} months ago: ${dateString}`;
    if (months <= 12) return `${String(months)} months ago: ${dateString} ⚠️`;
    return `${String(months)} months ago: ${dateString}❗`;
}
