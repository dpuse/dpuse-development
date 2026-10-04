// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared';

// ── Local Framework
import { getModuleConfig, logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, resolveOwnerAndRepository, writeReadmeSection } from '@/utilities';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const START_MARKER = '<!-- OPENING_START -->';
const END_MARKER = '<!-- OPENING_END -->';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentOpening(): Promise<void> {
    try {
        logOperationHeader('Document Opening');

        logStepHeader("1️⃣  Insert opening content into 'README.md'");

        const packageJSON = await readJSONFile<PackageJson>('package.json');
        const configJSON = await readJSONFile<ModuleConfig>('config.json');

        const { owner, repository } = resolveOwnerAndRepository(packageJSON, 'document opening');
        const license = resolveLicense(packageJSON);
        const introduction = resolveIntroduction(configJSON);
        const moduleTypeConfig = getModuleConfig(configJSON.id);
        const dpuseModuleId = moduleTypeConfig.uploadGroupName === undefined ? undefined : configJSON.id;
        const npmPackageName = moduleTypeConfig.publishedTo === 'npm' ? resolvePackageName(packageJSON) : undefined;

        const content = buildOpeningContent(owner, repository, license, dpuseModuleId, npmPackageName, packageJSON.description, introduction);

        await writeReadmeSection(content, START_MARKER, END_MARKER);

        logOperationSuccess('Opening documented');
    } catch (error) {
        console.error('❌  Error documenting opening', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

function resolveLicense(packageJSON: PackageJson): string {
    const license = packageJSON.license;
    if (license == null || license === '') throw new Error("package.json 'license' field is required to document opening.");
    return license;
}

function resolvePackageName(packageJSON: PackageJson): string {
    const name = packageJSON.name;
    if (name == null || name === '') throw new Error("package.json 'name' field is required to document opening.");
    return name;
}

// 'description.en' holds the introduction as one string, with a blank line between paragraphs. With none, the
// Introduction section is left out.
function resolveIntroduction(configJSON: ModuleConfig): string | undefined {
    const introduction = configJSON.description.en?.trim();
    return introduction === undefined || introduction === '' ? undefined : introduction;
}

// The package description is optional, so a project without one simply has no summary between the badges and the links.
// Only modules uploaded to DPUse get the DPUse version badge, and only projects published to npm get the npm badge. The
// DPUse badge reads the version registered in DPUse, which is only updated once the upload succeeds, so like the npm
// badge it shows what was actually published, and it works for private repositories too.
function buildOpeningContent(
    owner: string,
    repository: string,
    license: string,
    dpuseModuleId: string | undefined,
    npmPackageName: string | undefined,
    description: string | undefined,
    introduction: string | undefined
): string {
    const repositoryURL = `https://github.com/${owner}/${repository}`;
    const badgeLicense = license.replaceAll('-', '--');
    const dpuseConfigURL = encodeURIComponent(`https://api.dpuse.app/configs/${dpuseModuleId ?? ''}`);
    const dpuseBadge =
        dpuseModuleId === undefined
            ? ''
            : `\n[![DPUse version](https://img.shields.io/badge/dynamic/json?url=${dpuseConfigURL}&query=%24.data.version&prefix=v&label=DPUse&color=f6821f)](${repositoryURL}/releases/latest)`;
    const npmBadge =
        npmPackageName === undefined
            ? ''
            : `\n[![npm version](https://img.shields.io/npm/v/${npmPackageName}?color=cb3837&label=npm)](https://www.npmjs.com/package/${npmPackageName})`;
    const summary = description == null || description === '' ? '' : `\n\n${description}`;
    const introductionSection = introduction === undefined ? '' : `\n\n## Introduction\n\n${introduction}`;

    return `[![License: ${license}](https://img.shields.io/badge/License-${badgeLicense}-blue.svg)](./LICENSE)${dpuseBadge}${npmBadge}
[![CI](${repositoryURL}/actions/workflows/ci.yml/badge.svg)](${repositoryURL}/actions/workflows/ci.yml)${summary}

[Report a Vulnerability](${repositoryURL}/security/advisories/new) · [Open an Issue](${repositoryURL}/issues)

## About DPUse

[DPUse](https://www.dpuse.app) (Data Positioning & Use) is an in-browser application that positions your data for use through three core activities: sourcing, contextualising, and publishing.

**Sourcing** uses a library of [Connectors](https://www.dpuse.app/connectors) to establish [Connections](https://www.dpuse.app) to applications, databases, file stores, and curated datasets; these connections are subsequently used to configure structured [Data Views](https://www.dpuse.app) from the underlying sources.

**Contextualising** extracts chronological events from those [Data Views](https://www.dpuse.app) and maps them into comprehensive [Context Models](https://www.dpuse.app). This gives the DPUse Engine the structural framework needed to generate deterministic transactions, facts, or observations.

**Publishing** uses a library of [Presenters](https://www.dpuse.app) to render standard [Presentations](https://www.dpuse.app) immediately using the contextualised data; additionally, [Cookbooks](https://www.dpuse.app) of [Recipes](https://www.dpuse.app) let you build Data Apps using your preferred tools.

In addition, DPUse provides [Tools](https://www.dpuse.app) used by the application, and you can use them to construct connectors and presenters.${introductionSection}`;
}
