// ── Local (Development) Framework
import { logOperationHeader, logOperationSuccess, spawnCommand } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function auditDependencies(): Promise<void> {
    try {
        logOperationHeader('Audit Dependencies');

        await spawnCommand("1️⃣ Check using 'npm audit'", 'npm', ['audit']);

        logOperationSuccess('Dependencies audited.');
    } catch (error) {
        console.error('❌ Error auditing dependencies.', error);
        process.exit(1);
    }
}
