// ── Local Framework
import { logOperationHeader, logOperationSuccess } from '@/utilities';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

export const API_REFERENCE_PATH = 'API_REFERENCE.md';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Lists every export of each import path in API_REFERENCE.md. Runs with the README's sections where the project has that file. */
export async function documentAPIReference(): Promise<void> {
    try {
        logOperationHeader('Document API Reference');

        // TypeScript is an optional peer, so the code that reads the source with it is loaded only when it's needed.
        const { writeAPIReference } = await import('@/utilities/apiReference');
        await writeAPIReference('1️⃣ ', API_REFERENCE_PATH);

        logOperationSuccess('API reference documented');
    } catch (error) {
        console.error('❌  Error documenting API reference', error);
        process.exit(1);
    }
}
