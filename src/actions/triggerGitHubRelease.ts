// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── Local Framework
import { logOperationHeader, logOperationSuccess, readJSONFile, spawnCommand } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Create a GitHub release for the current version, which triggers the 'publish.yml' workflow. */
export async function triggerGitHubRelease(): Promise<void> {
    try {
        logOperationHeader('Trigger GitHub Release');

        const packageJSON = await readJSONFile<PackageJson>('package.json');
        const tagName = `v${packageJSON.version ?? 'unknown'}`;

        await spawnCommand('1️⃣  Create GitHub release', 'gh', ['release', 'create', tagName, '--target', 'main', '--generate-notes', '--latest']);

        logOperationSuccess(`GitHub release '${tagName}' created.`);
    } catch (error) {
        console.error('❌  Error triggering GitHub release', error);
        process.exit(1);
    }
}
