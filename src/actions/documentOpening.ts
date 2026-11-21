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

        const content = buildOpeningContent(owner, repository, license, {
            description: packageJSON.description,
            dpuseModuleId,
            introduction,
            npmPackageName,
            version: packageJSON.version
        });

        await writeReadmeSection(content, START_MARKER, END_MARKER);

        logOperationSuccess('Opening documented');
    } catch (error) {
        console.error('❌  Error documenting opening', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// Shields colours the npm badge by version, but a badge reading JSON can only take a fixed colour, so the DPUse badge is
// given the one Shields would pick, as of this release: orange before 1.0 or for a pre-release, blue otherwise.
function resolveVersionColor(version: string | undefined): string {
    if (version === undefined) return 'blue';
    return /^v?0/.test(version) || /alpha|beta|snapshot|dev|pre|rc/i.test(version) ? 'orange' : 'blue';
}

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
    options: {
        description: string | undefined;
        dpuseModuleId: string | undefined;
        introduction: string | undefined;
        npmPackageName: string | undefined;
        version: string | undefined;
    }
): string {
    const { description, dpuseModuleId, introduction, npmPackageName, version } = options;
    const repositoryURL = `https://github.com/${owner}/${repository}`;
    const badgeLicense = license.replaceAll('-', '--');
    const dpuseConfigURL = encodeURIComponent(`https://api.dpuse.app/configs/${dpuseModuleId ?? ''}`);
    const dpuseBadge =
        dpuseModuleId === undefined
            ? ''
            : `\n[![DPUse version](https://img.shields.io/badge/dynamic/json?url=${dpuseConfigURL}&query=%24.data.version&prefix=v&label=DPUse&color=${resolveVersionColor(version)})](${repositoryURL}/releases/latest)`;
    const npmBadge =
        npmPackageName === undefined ? '' : `\n[![npm version](https://img.shields.io/npm/v/${npmPackageName}?label=npm)](https://www.npmjs.com/package/${npmPackageName})`;
    const summary = description == null || description === '' ? '' : `\n\n${description}`;
    const introductionSection = introduction === undefined ? '' : `\n\n## Introduction\n\n${introduction}`;

    return `[![License: ${license}](https://img.shields.io/badge/License-${badgeLicense}-blue.svg)](./LICENSE)${dpuseBadge}${npmBadge}
[![CI](${repositoryURL}/actions/workflows/ci.yml/badge.svg)](${repositoryURL}/actions/workflows/ci.yml)${summary}

[Report a Vulnerability](${repositoryURL}/security/advisories/new) · [Open an Issue](${repositoryURL}/issues)

## About DPUse

DPUse (Data Positioning & Use) is a browser-based app that helps you prepare your data for use in two main steps: Sourcing and Contextualising. Once your data is contextualised, Presentations and Cookbooks give you two ways to put it to use.

**Sourcing** uses Connectors to link to applications, databases, file stores, and curated datasets. These Connections help you set up tabular Data Views from your sources.

**Contextualising** maps events from your Data Views to detailed Context Models. These models give the DPUse Engine the structure it needs to create clear transactions, facts, or observations.

**Presentations** use ready-made Presenters to show your contextualised data in a meaningful way as soon as it's ready.

**Cookbooks** of Recipes guide you in building Data Apps, and additional Presenters, with your contextualised data using your preferred tools.${introductionSection}`;
}
