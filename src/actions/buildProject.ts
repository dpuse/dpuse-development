// ── Local Framework
import { logOperationHeader, logOperationSuccess, spawnCommand } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Builds the package using Vite. Output to '/dist' directory. Builds bundle analysis reports. */
export async function buildProject(): Promise<void> {
    try {
        logOperationHeader('Build Project');

        await spawnCommand('1️⃣  Bundle project', 'vite', ['build']);

        logOperationSuccess('Project built');
    } catch (error) {
        console.error('❌  Error building project', error);
        process.exit(1);
    }
}
