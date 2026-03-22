/* eslint-disable unicorn/no-process-exit */

// External Dependencies
import { fileURLToPath, URL } from 'node:url';

// Development Core
import { clearDirectory, execCommand, logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile, substituteText, writeTextFile } from '@/utilities';

// Interfaces/Types
interface License {
    department: string;
    relatedTo: string;
    name: string;
    licensePeriod: string;
    material: string;
    licenseType: string;
    link: string;
    remoteVersion: string;
    installedVersion: string;
    definedVersion: string;
    author: string;
    latestRemoteModified: string;
    requires?: License[];
    dependencyCount?: number;
    licenseFileLink?: string;
}

// Constants ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const START_MARKER = '<!-- DEPENDENCY_LICENSES_START -->';
const END_MARKER = '<!-- DEPENDENCY_LICENSES_END -->';

// Actions ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function documentDependencies(licenses: string[] = [], checkRecursive = true): Promise<void> {
    try {
        logOperationHeader('Document Dependencies');

        const allowedFlags = licenses.flatMap((license) => ['--allowed', `'${license}'`]);

        // Establish licence report configuration file path.This in combination with exports in 'package.json'
        // allows us to share local 'licenses/license-report-config.json' file with other projects.
        // 'licenses/license-report-config.json' is in licenses directory, not top level directory, so it does not confuse GitHub license detection engine.
        const licenseReportConfigPath = fileURLToPath(new URL(import.meta.resolve('@dpuse/dpuse-development/license-report-config')));

        await execCommand(
            "1️⃣  Generate 'licenses.json' file",
            'license-report',
            ['--config', `'${licenseReportConfigPath}'`, '--only=prod,peer', '--output=json'],
            'licenses/licenses.json'
        );

        await execCommand("2️⃣  Check 'licenses.json' file", 'license-report-check', ['--source', 'licenses/licenses.json', '--output=table', ...allowedFlags]);

        if (checkRecursive) {
            await execCommand(
                "3️⃣  Generate 'licenseTree.json' file",
                'license-report-recursive',
                ['--only=prod,peer', '--output=tree', '--recurse', '--department.value=n/a', '--licensePeriod.value=n/a', '--material.value=n/a', '--relatedTo.value=n/a'],
                'licenses/licenseTree.json'
            );

            await execCommand("4️⃣  Check 'licenseTree.json' file", 'license-report-check', ['--source', 'licenses/licenseTree.json', '--output=table', ...allowedFlags]);
        } else {
            logStepHeader("3️⃣  Skip 'licenses/licenseTree.json' file generate");
            logStepHeader("4️⃣  Skip 'licenses/licenseTree.json' file check");
        }

        const githubToken = process.env['GITHUB_TOKEN'];
        if (githubToken == null || githubToken === '' || githubToken.startsWith('op://')) {
            throw new Error('GITHUB_TOKEN is not resolved. Run the script via "npm run document" to use 1Password resolution.');
        }

        await clearDirectory('licenses/downloads');
        await execCommand('5️⃣  Download license files', 'license-downloader', [
            '--source',
            'licenses/licenses.json',
            '--licDir',
            'licenses/downloads',
            '--githubToken.tokenEnvVar',
            'GITHUB_TOKEN',
            '--download'
        ]);

        await insertLicensesIntoReadme('6️⃣', checkRecursive);

        logOperationSuccess('Dependencies documented.');
    } catch (error) {
        console.error('❌ Error documenting dependencies.', error);
        process.exit(1);
    }
}

// Helpers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function insertLicensesIntoReadme(stepIcon: string, checkRecursive: boolean): Promise<void> {
    logStepHeader(`${stepIcon}  Insert licenses into 'README.md'`);

    const productionPackageLicenses = await readJSONFile<License[]>('licenses/licenses.json');
    const productionDownloadLicenses = await readJSONFile<License[]>('licenses/downloads/licenses.ext.json');
    let productionPackageLicenseTree: License[] = [];
    if (checkRecursive) productionPackageLicenseTree = await readJSONFile<License[]>('licenses/licenseTree.json');

    const mergedLicenses = [
        ...((): MapIterator<License> => {
            const byName = new Map<string, License>();

            for (const license of productionPackageLicenses) {
                byName.set(license.name, { ...license });
            }

            for (const license of productionDownloadLicenses) {
                const existing = byName.get(license.name);
                byName.set(license.name, existing ? { ...existing, ...license } : { ...license });
            }

            for (const license of productionPackageLicenseTree) {
                const existing = byName.get(license.name);
                if (existing) byName.set(license.name, { ...existing, dependencyCount: license.requires?.length ?? 0 });
            }

            return byName.values();
        })()
    ];

    let licensesContent = '|Name|Type|Installed|Latest|Latest Released|Deps|Document|\n|:-|:-|:-:|:-:|:-|-:|:-|\n';
    for (const license of mergedLicenses) {
        const installedVersion = license.installedVersion === license.remoteVersion ? license.installedVersion : `${license.installedVersion} ⚠️`;

        const latestUpdate = license.latestRemoteModified ? determineLatestAge(license.latestRemoteModified.split('T')[0]) : 'n/a';

        const dependencyCount = license.dependencyCount != null && license.dependencyCount >= 0 ? license.dependencyCount : 'n/a';

        let licenseLink;
        if (license.licenseFileLink == null || license.licenseFileLink == '') {
            licenseLink = '⚠️ No license file';
        } else {
            const lastPart = license.licenseFileLink.slice(Math.max(0, license.licenseFileLink.lastIndexOf('/') + 1));
            licenseLink = `[${lastPart}](${license.licenseFileLink})`;
        }

        licensesContent += `|${license.name}|${license.licenseType}|${installedVersion}|${license.remoteVersion}|${latestUpdate}|${dependencyCount}|${licenseLink}|\n`;
    }

    // Insert licenses into README.
    const originalContent = await readTextFile('./README.md');
    const newContent = substituteText(originalContent, licensesContent, START_MARKER, END_MARKER);
    await writeTextFile('README.md', newContent);
    console.info("OWASP audit badge(s) inserted into 'README.md'");
    await writeTextFile('README.md', newContent);
}

function determineLatestAge(momentString?: string): string {
    if (momentString == null || momentString === '') return 'n/a';

    const dateString = momentString.split('T')[0];
    if (dateString == null || dateString === '') return 'n/a';

    const input = new Date(dateString);
    const now = new Date();
    let months = (now.getFullYear() - input.getFullYear()) * 12 + (now.getMonth() - input.getMonth());
    if (now.getDate() < input.getDate()) months -= 1;

    if (months === 0) return `this month: ${dateString}`;
    if (months === 1) return `1 month ago: ${dateString}`;
    if (months <= 6) return `${months} months ago: ${dateString}`;
    if (months <= 12) return `${months} months ago: ${dateString} ⚠️`;
    return `${months} months ago: ${dateString}❗`;
}
