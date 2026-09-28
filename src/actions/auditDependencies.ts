// ── Local Framework
import { logOperationHeader, logOperationSuccess, spawnCommand } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Audit the project's dependencies for known security vulnerabilities. Also runs the npm outdated command. */
export async function auditDependencies(): Promise<void> {
    try {
        logOperationHeader('Audit Dependencies');

        await spawnCommand("1️⃣  Check using 'npm audit'", 'npm', ['audit']);

        logOperationSuccess('Dependencies audited');
    } catch (error) {
        console.error('❌  Error auditing dependencies', error);
        process.exit(1);
    }
}
