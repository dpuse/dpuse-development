// ── Local Framework
import { logOperationHeader, logOperationSuccess, spawnCommand } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Audit the project's dependencies for known security vulnerabilities. */
export async function auditDependencies(): Promise<void> {
    try {
        logOperationHeader('Audit Dependencies');

        // Strict for what users install. Dev tools never ship but do run in CI, where the publish tokens are, so they fail
        // only on serious flaws; moderate ones there often wait on upstream fixes and would otherwise block every push.
        await spawnCommand('1️⃣  Check shipped dependencies for any vulnerability', 'npm', ['audit', '--omit=dev']);
        await spawnCommand('2️⃣  Check all dependencies for high or critical vulnerabilities', 'npm', ['audit', '--audit-level=high']);

        logOperationSuccess('Dependencies audited');
    } catch (error) {
        console.error('❌  Error auditing dependencies', error);
        process.exit(1);
    }
}
