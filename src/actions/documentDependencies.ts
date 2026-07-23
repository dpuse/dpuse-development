// ── External
import { init as initLicenseChecker } from 'license-checker-rseidelsohn';
import type { InitOpts } from 'license-checker-rseidelsohn';

// ── Local (Development) Framework
import { clearDirectory, logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile, spawnCommandToFile, substituteText, writeTextFile } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface License {
    name: string;
    repository: string;
    licenseTypes: string;
    installedVersion: string;
    latestVersion: string;
    latestPublishedDate: string;
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

const DEPENDENCY_TREE_INTRO =
    "The dependency tree below lists every package in this project — direct and transitive — along with its installed version, release date, and update status. Packages flagged ❗ have a newer version available; ⚠️ indicates a package that hasn't been updated in the last 6 months or longer. Neither flag necessarily indicates a problem: we let new releases stabilise before upgrading, and some packages are simply mature and stable, requiring no active development.";

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentDependencies(allowedLicenses = 'MIT'): Promise<void> {
    try {
        logOperationHeader('Document Dependencies');

        const rootPackage = await readJSONFile<{ name?: string; version?: string }>('package.json');

        if (rootPackage.name === '@dpuse/dpuse-development' || rootPackage.name === '@dpuse/eslint-config-dpuse') {
            await skipDependencyDocumentation(rootPackage.name);
            logOperationSuccess('Dependencies documented');
            return;
        }

        await clearDirectory('1️⃣  Clear downloaded licenses', 'licenses/downloads');

        logStepHeader('2️⃣  Identify production licenses');
        await new Promise<void>((resolve, reject) => {
            const options: InitOpts & { files: string; relativeModulePath: boolean } = {
                start: process.cwd(),
                production: true,
                json: true,
                files: 'licenses/downloads',
                relativeModulePath: true,
                relativeLicensePath: true,
                onlyAllow: allowedLicenses,
                excludePackages: rootPackage.name ?? '',
                out: 'licenses/licenses.json'
            };
            initLicenseChecker(options, (error: Error | undefined) => {
                if (error == null) {
                    resolve();
                } else {
                    reject(error);
                }
            });
        });

        await spawnCommandToFile('3️⃣  Identify transitive dependencies', 'npm', ['ls', '--all', '--json', '--omit=dev'], 'licenses/licenseTree.json');

        await insertLicensesIntoReadme('4️⃣ ', allowedLicenses);

        logOperationSuccess('Dependencies documented');
    } catch (error) {
        console.error('❌  Error documenting dependencies', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

async function skipDependencyDocumentation(name: string): Promise<void> {
    logStepHeader(`1️⃣  Skip: ${name} is a development-only tool and is never part of a production release.`);

    const message = `> [!WARNING]\n> Dependency licenses are not documented here: ${name} is a development-only tool and is never part of a production release.`;

    const originalContent = await readTextFile('./README.md');
    const withTable = substituteText(originalContent, message, START_MARKER, END_MARKER);
    const withTree = substituteText(withTable, '', TREE_START_MARKER, TREE_END_MARKER);
    await writeTextFile('README.md', withTree);
}

async function insertLicensesIntoReadme(stepIcon: string, allowedLicenses: string): Promise<void> {
    logStepHeader(`${stepIcon} Insert licenses into 'README.md'`);

    const [licenses, licenseTree] = await Promise.all([
        readJSONFile<Record<string, ProductionPackageLicense>>('licenses/licenses.json'),
        readJSONFile<NpmPackageTree>('licenses/licenseTree.json')
    ]);

    const licensesByKey = new Map<string, License>();
    for (const [key, value] of Object.entries(licenses)) {
        licensesByKey.set(key, parseLicenseEntry(key, value));
    }

    await Promise.all(
        licensesByKey.values().map(async (license) => {
            const data = await fetchNpmData(license.name, license.installedVersion);
            license.latestVersion = data.latestVersion;
            license.latestPublishedDate = data.latestPublishedDate;
            license.publishedDate = data.publishedDate;
        })
    );

    const licensesIntro = buildLicensesIntro(allowedLicenses);
    let licensesContent = `${licensesIntro}\n\n|Dependency|Version|License(s)|Document|\n|:-|:-:|:-|:-|\n`;
    for (const license of licensesByKey.values()) {
        licensesContent += formatLicenseRow(license);
    }

    const treeItems: string[] = [];
    if (licenseTree.dependencies != null) {
        walkTreeList(licenseTree.dependencies, licensesByKey, treeItems, 0);
    }
    const treeContent = `${DEPENDENCY_TREE_INTRO}\n\n${treeItems.join('\n')}`;

    const originalContent = await readTextFile('./README.md');
    const withTable = substituteText(originalContent, licensesContent, START_MARKER, END_MARKER);
    const withTree = substituteText(withTable, treeContent, TREE_START_MARKER, TREE_END_MARKER);
    await writeTextFile('README.md', withTree);
}

function buildLicensesIntro(allowedLicenses: string): string {
    const licenseListText = formatLicenseListText(allowedLicenses.split(';'));
    return `License data is collected automatically on each release using [license-checker](https://github.com/RSeidelsohn/license-checker-rseidelsohn). The following table lists all production dependencies. These dependencies (including transitive ones) have been checked and confirmed to use ${licenseListText} — all permissive, commercially-friendly licenses. Users of the uploaded library are covered by these checks; developers cloning this repository should independently verify development dependencies.`;
}

function formatLicenseListText(licenses: string[]): string {
    if (licenses.length === 1) return licenses[0] ?? '';
    if (licenses.length === 2) return `${String(licenses[0])} or ${String(licenses[1])}`;
    return `${licenses.slice(0, -1).join(', ')}, or ${String(licenses.at(-1))}`;
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
        latestPublishedDate: '',
        publishedDate: '',
        ...(value.licenseFile != null && { licenseFileLink: value.licenseFile })
    };
}

async function fetchNpmData(name: string, version: string): Promise<{ latestVersion: string; latestPublishedDate: string; publishedDate: string }> {
    try {
        const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`);
        if (response.ok) {
            const data = (await response.json()) as { 'dist-tags'?: Record<string, string>; time?: Record<string, string> };
            const distributionTags = new Map(Object.entries(data['dist-tags'] ?? {}));
            const timeMap = new Map(Object.entries(data.time ?? {}));
            const latestVersion = distributionTags.get('latest') ?? '';
            const publishedDate = timeMap.get(version) ?? '';
            const latestPublishedDate = latestVersion === version ? '' : (timeMap.get(latestVersion) ?? '');
            return { latestVersion, latestPublishedDate, publishedDate };
        }
    } catch {
        // Ignore network errors.
    }
    return { latestVersion: '', latestPublishedDate: '', publishedDate: '' };
}

function formatLicenseRow(license: License): string {
    const licenseLink = license.licenseFileLink == null || license.licenseFileLink === '' ? '⚠️  No license file' : `[LICENSE](licenses/${license.licenseFileLink})`;
    return `|[${license.name}](${license.repository})|${license.installedVersion}|${license.licenseTypes}|${licenseLink}|\n`;
}

function walkTreeList(dependencies: Record<string, NpmPackageTree>, licensesByKey: Map<string, License>, items: string[], depth: number): void {
    const indent = '  '.repeat(depth);
    for (const [name, node] of Object.entries(dependencies)) {
        const version = node.version ?? '';
        const license = licensesByKey.get(`${name}@${version}`);
        const nameLink = license == null ? name : `[${name}](${license.repository})`;
        const versionDetail = formatVersionDetail(license);
        items.push(`${indent}- **${nameLink}** ${version}${versionDetail}`);
        if (node.dependencies != null) {
            walkTreeList(node.dependencies, licensesByKey, items, depth + 1);
        }
    }
}

function formatVersionDetail(license: License | undefined): string {
    if (license == null) return '';
    const published = license.publishedDate ? determineLatestAge(license.publishedDate.split('T', 1)[0]) : '';
    const isOutdated = license.latestVersion !== '' && license.latestVersion !== license.installedVersion;
    if (!isOutdated) return published === '' ? '' : ` — ${published}`;
    const latestAge = license.latestPublishedDate ? determineLatestAge(license.latestPublishedDate.split('T', 1)[0]) : '';
    const latestClause = latestAge === '' ? `**latest**: ${license.latestVersion} ❗` : `**latest**: ${license.latestVersion} — ${latestAge} ❗`;
    return published === '' ? ` — → ${latestClause}` : ` — ${published} → ${latestClause}`;
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
    if (months === 1) return `**1** month ago: ${dateString}`;
    if (months <= 6) return `**${String(months)}** months ago: ${dateString}`;
    return `**${String(months)}** months ago: ${dateString} ⚠️ `;
}
