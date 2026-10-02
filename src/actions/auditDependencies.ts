// ── Local Framework
import { logOperationHeader, logOperationSuccess, spawnCommand } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Audit the project's dependencies for known security vulnerabilities. */
export async function auditDependencies(): Promise<void> {
    try {
        logOperationHeader('Audit Dependencies');

        // Users install these packages, so any vulnerability at all fails the audit.
        await spawnCommand('1️⃣  Check shipped dependencies for any vulnerability', 'npm', ['audit', '--omit=dev']);

        // Dev tools run during publishing, where they could reach the publish credentials, so high and critical flaws
        // fail. Lesser ones often await an upstream fix, so they pass.
        await spawnCommand('2️⃣  Check all dependencies for high or critical vulnerabilities', 'npm', ['audit', '--audit-level=high']);

        logOperationSuccess('Dependencies audited');
    } catch (error) {
        console.error('❌  Error auditing dependencies', error);
        process.exit(1);
    }
}
