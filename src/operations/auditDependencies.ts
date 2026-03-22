/* eslint-disable unicorn/no-process-exit */

// External Dependencies
import type { PackageJson } from 'type-fest';

// DPUse Framework
import type { ModuleConfig } from '@datapos/datapos-shared/component';
import { getDirectoryEntries, logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile, spawnCommand, substituteText, writeTextFile } from '@/utilities';

// Interfaces/Types
interface DependencyCheckData {
    dependencies: { vulnerabilities?: { severity?: string }[] }[];
}
interface BadgeConfig {
    color: string;
    label: string;
}
interface SeverityCounts {
    critical: number;
    high: number;
    moderate: number;
    low: number;
    unknown: number;
}

// Constants ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SEVERITY_BADGES: Record<keyof SeverityCounts, BadgeConfig> = {
    critical: { color: 'D32F2F', label: 'critical' },
    high: { color: 'EF6C00', label: 'high' },
    moderate: { color: 'FBC02D', label: 'moderate' },
    low: { color: '6D8C31', label: 'low' },
    unknown: { color: '616161', label: 'unknown' }
    // See sample badges in ~/tests/sampleBadges.md, also includes 'info' colouring.
};
const START_MARKER = '<!-- OWASP_BADGES_START -->';
const END_MARKER = '<!-- OWASP_BADGES_END -->';

// Actions ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function auditDependencies(): Promise<void> {
    try {
        logOperationHeader('Audit Dependencies');

        const packageJSON = await readJSONFile<PackageJson>('package.json');

        const owaspBinArguments: string[] = [];
        try {
            const versions: string[] = await getDirectoryEntries('dependency-check-bin');
            const latestVersion = versions.toSorted((a, b) => a.localeCompare(b)).at(-1);
            if (latestVersion != null && latestVersion !== '')
                owaspBinArguments.push('--owasp-bin', `dependency-check-bin/${latestVersion}/dependency-check/bin/dependency-check.sh`);
        } catch {
            /* not yet installed - let the wrapper download it */
        }

        await spawnCommand('1️⃣', 'owasp-dependency-check', [
            ...owaspBinArguments,
            '--out',
            'dependency-check-reports',
            '--project',
            packageJSON.name ?? 'unknown',
            '--enableRetired',
            '--nodePackageSkipDevDependencies',
            '--nvdApiKey',
            process.env['OWASP_NVD_API_KEY'] ?? ''
        ]);

        await insertOWASPDependencyCheckBadgeIntoReadme('2️⃣');

        await spawnCommand("3️⃣  Check using 'npm audit'", 'npm', ['audit']);

        logOperationSuccess('Dependencies audited.');
    } catch (error) {
        console.error('❌ Error auditing dependencies.', error);
        process.exit(1);
    }
}

// Helpers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function insertOWASPDependencyCheckBadgeIntoReadme(stepIcon: string): Promise<void> {
    logStepHeader(`${stepIcon}  Insert OWASP Badge(s) into 'README.md'`);

    const dependencyCheckData = await readJSONFile<DependencyCheckData>('dependency-check-reports/dependency-check-report.json');
    const severityCounts: SeverityCounts = { critical: 0, high: 0, moderate: 0, low: 0, unknown: 0 };
    for (const dependency of dependencyCheckData.dependencies) {
        if (dependency.vulnerabilities == null) continue;
        for (const vulnerability of dependency.vulnerabilities) {
            const severity = vulnerability.severity?.toLowerCase() ?? 'unknown';
            if (severity in severityCounts) {
                severityCounts[severity as keyof SeverityCounts]++;
            } else {
                severityCounts.unknown++;
            }
        }
    }

    // Generate shield badges for each severity
    const badges = await buildOWASPBadges(severityCounts);

    // Insert badges into README
    const originalContent = await readTextFile('./README.md');
    const newContent = substituteText(originalContent, badges.join(' '), START_MARKER, END_MARKER);
    await writeTextFile('README.md', newContent);
    console.info("OWASP audit badge(s) inserted into 'README.md'");
}

async function buildOWASPBadges(severityCounts: SeverityCounts): Promise<string[]> {
    const configJSON = await readJSONFile<ModuleConfig>('config.json');
    const badges: string[] = [];
    const totalVulnerabilities = Object.values(severityCounts).reduce<number>((sum, count: number) => sum + count, 0);
    if (totalVulnerabilities === 0) {
        console.info('No vulnerabilities found.');
        const badgeUrl = 'https://img.shields.io/badge/OWASP-passed-4CAF50';
        badges.push(`[![OWASP](${badgeUrl})](https://dpuse.github.io/${configJSON.id}/dependency-check-reports/dependency-check-report.html)`);
    } else {
        for (const [severity, count] of Object.entries(severityCounts) as [string, number][]) {
            const config = SEVERITY_BADGES[severity as keyof SeverityCounts];
            console.warn(`⚠️  ${count} ${config.label} vulnerability(ies) found.`);
            if (count === 0) continue;
            const badgeUrl = `https://img.shields.io/badge/OWASP-${count}%20${config.label}-${config.color}`;
            badges.push(`[![OWASP](${badgeUrl})](https://dpuse.github.io/${configJSON.id}/dependency-check-reports/dependency-check-report.html)`);
        }
    }
    return badges;
}
