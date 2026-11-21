// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── Local Framework
import {
    CONTRIBUTING_LICENSE_END_MARKER,
    CONTRIBUTING_LICENSE_START_MARKER,
    logOperationHeader,
    logOperationSuccess,
    logStepHeader,
    readJSONFile,
    resolveOwnerAndRepository,
    writeReadmeSection
} from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface LicenseModuleConfig {
    firstCreatedAt?: number | null;
}

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Regenerates the README's Contributing and License sections. */
export async function documentContributingLicense(): Promise<void> {
    try {
        logOperationHeader('Document Contributing & License');

        const [packageJSON, configJSON] = await Promise.all([readJSONFile<PackageJson>('package.json'), readJSONFile<LicenseModuleConfig>('config.json')]);

        const { owner, repository } = resolveOwnerAndRepository(packageJSON, 'document contributing and license');
        const authorName = resolveAuthorName(packageJSON);
        const copyrightYear = resolveCopyrightYear(configJSON.firstCreatedAt);

        logStepHeader("1️⃣  Insert contributing and license content into 'README.md'");

        const content = buildContributingLicenseContent(owner, repository, authorName, copyrightYear, packageJSON.private === true);
        await writeReadmeSection(content, CONTRIBUTING_LICENSE_START_MARKER, CONTRIBUTING_LICENSE_END_MARKER);

        logOperationSuccess('Contributing & license documented');
    } catch (error) {
        console.error('❌  Error documenting contributing and license', error);
        process.exit(1);
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

function resolveAuthorName(packageJSON: PackageJson): string {
    const author = packageJSON.author;
    const authorString = typeof author === 'string' ? author : author?.name;
    if (authorString == null || authorString === '') throw new Error("package.json 'author' field is required to document contributing and license.");

    // Drop the first '<email>' and the spaces around it, keeping one space between what came before and after it, as in
    // npm's 'Name <email> (url)' form. Not a regex, as '\s*<' backtracks on long runs of spaces.
    const emailStart = authorString.indexOf('<');
    const emailEnd = emailStart === -1 ? -1 : authorString.indexOf('>', emailStart);
    return emailEnd === -1 ? authorString.trim() : [authorString.slice(0, emailStart).trim(), authorString.slice(emailEnd + 1).trim()].filter((part) => part !== '').join(' ');
}

function resolveCopyrightYear(firstCreatedAt: number | null | undefined): string {
    const currentYear = new Date().getFullYear();
    if (firstCreatedAt == null) return String(currentYear);

    const startYear = new Date(firstCreatedAt).getFullYear();
    return startYear === currentYear ? String(currentYear) : `${String(startYear)}-present`;
}

// A private repository, such as DPUse Engine or DPUse API, cannot say its source is published, so it says the opposite.
function buildContributingLicenseContent(owner: string, repository: string, authorName: string, copyrightYear: string, isPrivate: boolean): string {
    const repositoryURL = `https://github.com/${owner}/${repository}`;
    const sourceText = isPrivate ? 'Its source is not published' : 'Its source is published openly under the MIT License';

    return `## Contributing

This repository is maintained solely by its owner and does not, at present, accept external contributions into the canonical repo. ${sourceText} — every DPUse project is fully open source except DPUse Engine and DPUse API, which remain closed and proprietary.

For security vulnerabilities, see [Reporting Vulnerabilities](#reporting-vulnerabilities). For bugs, inconsistencies, or other feedback, [open a GitHub issue](${repositoryURL}/issues) — feedback is read, but responses and fixes are at the maintainer's discretion.

## License

This project is licensed under the MIT License, permitting free use, modification, and distribution.

[MIT](./LICENSE) © ${copyrightYear} ${authorName}`;
}
