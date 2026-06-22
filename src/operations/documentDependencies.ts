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
    licenseTypes: string;
    installedVersion: string;
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

        await insertLicensesIntoReadme('3️⃣4️⃣');

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
            license.publishedDate = await fetchPublishDate(license.name, license.installedVersion);
        })
    );

    const rows: string[] = [];
    if (licenseTree.dependencies != null) {
        walkTree(licenseTree.dependencies, byKey, rows, '');
    }

    const licensesContent = `|Name|License|Version|Published|Document|\n|:-|:-|:-:|:-|:-|\n${rows.join('')}`;

    const originalContent = await readTextFile('./README.md');
    const newContent = substituteText(originalContent, licensesContent, START_MARKER, END_MARKER);
    await writeTextFile('README.md', newContent);
}

function parseLicenseEntry(key: string, value: ProductionPackageLicense): License {
    const lastAt = key.lastIndexOf('@');
    const name = lastAt > 0 ? key.slice(0, lastAt) : key;
    const installedVersion = lastAt > 0 ? key.slice(lastAt + 1) : '';
    return {
        name,
        licenseTypes: value.licenses,
        installedVersion,
        author: value.publisher ?? '',
        publishedDate: '',
        ...(value.licenseFile != null && { licenseFileLink: value.licenseFile })
    };
}

async function fetchPublishDate(name: string, version: string): Promise<string> {
    try {
        const response = await fetch(`https://registry.npmjs.org/${name.replace('/', '%2F')}`);
        if (response.ok) {
            const data = (await response.json()) as { time?: Record<string, string> };
            const timeMap = new Map(Object.entries(data.time ?? {}));
            return timeMap.get(version) ?? '';
        }
    } catch {
        // Ignore network errors.
    }
    return '';
}

function walkTree(
    deps: Record<string, NpmPackageTree>,
    byKey: Map<string, License>,
    rows: string[],
    prefix: string
): void {
    const lastKey = Object.keys(deps).at(-1);
    for (const [name, node] of Object.entries(deps)) {
        const isLast = name === lastKey;
        const version = node.version ?? '';
        const connector = isLast ? '└── ' : '├── ';
        const childPrefix = isLast ? '&nbsp;&nbsp;&nbsp;&nbsp;' : '│&nbsp;&nbsp;&nbsp;';
        rows.push(formatTreeRow(`${prefix}${connector}${name}`, version, byKey.get(`${name}@${version}`)));
        if (node.dependencies != null) {
            walkTree(node.dependencies, byKey, rows, `${prefix}${childPrefix}`);
        }
    }
}

function formatTreeRow(nameWithPrefix: string, version: string, license: License | undefined): string {
    const licenseType = license?.licenseTypes ?? 'n/a';
    const publishedDate = license?.publishedDate
        ? determineLatestAge(license.publishedDate.split('T', 1)[0])
        : 'n/a';
    let licenseLink;
    if (license?.licenseFileLink == null || license.licenseFileLink === '') {
        licenseLink = '⚠️ No license file';
    } else {
        const lastPart = license.licenseFileLink.slice(Math.max(0, license.licenseFileLink.lastIndexOf('/') + 1));
        licenseLink = `[${lastPart}](${license.licenseFileLink})`;
    }
    return `|${nameWithPrefix}|${licenseType}|${version}|${publishedDate}|${licenseLink}|\n`;
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
