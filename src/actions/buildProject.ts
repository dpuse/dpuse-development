// ── Local Framework
import { API_REFERENCE_PATH, writeAPIReference } from '@/actions/documentApiReference';
import { logOperationHeader, logOperationSuccess, logStepHeader, readTextFileOrNull, spawnCommand } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Builds the package using Vite. Output to '/dist' directory. Builds bundle analysis reports. */
export async function buildProject(): Promise<void> {
    try {
        logOperationHeader('Build Project');

        await spawnCommand('1️⃣  Bundle project', 'vite', ['build']);

        // Only where the project keeps an API reference, so projects opt in by adding the file.
        if ((await readTextFileOrNull(API_REFERENCE_PATH)) === null) {
            logStepHeader(`2️⃣  '${API_REFERENCE_PATH}' NOT required by this project`);
        } else {
            await writeAPIReference('2️⃣ ');
        }

        logOperationSuccess('Project built');
    } catch (error) {
        console.error('❌  Error building project', error);
        process.exit(1);
    }
}
