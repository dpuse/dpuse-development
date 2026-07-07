// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared/component/module';

// ── Local (Development) Framework
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile, substituteText, writeTextFile } from '@/utilities';

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

        const { owner, repo } = resolveOwnerAndRepo(packageJSON);
        const license = resolveLicense(packageJSON);
        const introduction = resolveIntroduction(configJSON);
        const icon = resolveIcon(configJSON);

        const content = buildOpeningContent(owner, repo, license, introduction, icon);

        const originalContent = await readTextFile('./README.md');
        const updatedContent = substituteText(originalContent, content, START_MARKER, END_MARKER);
        await writeTextFile('README.md', updatedContent);

        logOperationSuccess('Opening documented');
    } catch (error) {
        console.error('❌  Error documenting opening', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

function resolveOwnerAndRepo(packageJSON: PackageJson): { owner: string; repo: string } {
    const repository = packageJSON.repository;
    const url = typeof repository === 'string' ? repository : repository?.url;
    if (url == null || url === '') throw new Error("package.json 'repository' field is required to document opening.");

    const cleanedURL = url.replace(/^git\+/, '').replace(/\.git$/, '');
    const match = /github\.com[/:]([^/]+)\/([^/]+)$/.exec(cleanedURL);
    if (match?.[1] == null || match[2] == null) throw new Error(`Unable to parse GitHub owner/repo from '${url}'.`);

    return { owner: match[1], repo: match[2] };
}

function resolveLicense(packageJSON: PackageJson): string {
    const license = packageJSON.license;
    if (license == null || license === '') throw new Error("package.json 'license' field is required to document opening.");
    return license;
}

function resolveIntroduction(configJSON: ModuleConfig): string {
    const paragraphs = configJSON.description.en;
    if (paragraphs == null || paragraphs.length === 0) throw new Error("config.json 'description.en' field is required to document opening.");
    return paragraphs.join('\n\n');
}

function resolveIcon(configJSON: ModuleConfig): { icon: string; iconDark: string } {
    const { icon, iconDark } = configJSON;
    if (icon == null || iconDark == null) throw new Error("config.json 'icon' and 'iconDark' fields are required to document opening.");
    return { icon, iconDark };
}

function toSVGDataURI(svg: string): string {
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function buildOpeningContent(owner: string, repo: string, license: string, introduction: string, icon: { icon: string; iconDark: string }): string {
    const repoURL = `https://github.com/${owner}/${repo}`;
    const badgeLicense = license.replace(/-/g, '--');

    return `<picture>
    <source media="(prefers-color-scheme: dark)" srcset="${toSVGDataURI(icon.iconDark)}">
    <img src="${toSVGDataURI(icon.icon)}" alt="${repo} icon" width="48" height="48">
</picture>

[![License: ${license}](https://img.shields.io/badge/License-${badgeLicense}-blue.svg)](./LICENSE)
[![DPUse version](https://img.shields.io/github/v/release/${owner}/${repo}?color=f6821f&label=DPUse)](${repoURL}/releases/latest)
[![CI](${repoURL}/actions/workflows/ci.yml/badge.svg)](${repoURL}/actions/workflows/ci.yml)
[![CodeQL](${repoURL}/actions/workflows/codeql.yml/badge.svg)](${repoURL}/actions/workflows/codeql.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=${owner}_${repo}&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=${owner}_${repo})

[Documentation](https://www.dpuse.app) · [Report a Vulnerability](${repoURL}/security/advisories/new) · [Open an Issue](${repoURL}/issues)

## About DPUse

DPUse (Data Positioning & Use) is an in-browser application that positions your data for use through three core activities: sourcing, contextualising, and publishing. **Sourcing** uses a library of [Connectors](https://www.dpuse.app) to establish [Connections](https://www.dpuse.app) to applications, databases, file stores, and curated datasets; these connections are subsequently used to configure structured [Data Views](https://www.dpuse.app) from the underlying sources. **Contextualising** extracts chronological events from those [Data Views](https://www.dpuse.app) and maps them into comprehensive [Context Models](https://www.dpuse.app). This provides the DPUse Engine with the structural framework required to generate deterministic transactions, facts, or observations. **Publishing** employs a library of [Presenters](https://www.dpuse.app) to render standard [Presentations](https://www.dpuse.app) immediately using the contextualised data; additionally, [Cookbooks](https://www.dpuse.app) of [Recipes](https://www.dpuse.app) allow you to build Data Apps using your preferred tools.

## Introduction

${introduction}`;
}
