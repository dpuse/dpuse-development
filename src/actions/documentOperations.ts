// ── DPUse Framework
import type { ConnectorActionName } from '@dpuse/dpuse-shared/component/module/connector';
import { getConnectorActionsTable } from '@dpuse/dpuse-shared/component/module/connector';

// ── Local (Development) Framework
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile, substituteText, writeTextFile } from '@/utilities';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const START_MARKER = '<!-- CONNECTOR_OPERATIONS_START -->';
const END_MARKER = '<!-- CONNECTOR_OPERATIONS_END -->';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentOperations(): Promise<void> {
    try {
        logOperationHeader('Document Operations');

        logStepHeader("1️⃣  Insert operations table into 'README.md'");

        const config = await readJSONFile<{ operations?: string[] }>('config.json');
        const table = getConnectorActionsTable((config.operations ?? []) as ConnectorActionName[]);

        const originalContent = await readTextFile('./README.md');
        const updatedContent = substituteText(originalContent, table, START_MARKER, END_MARKER);
        await writeTextFile('README.md', updatedContent);

        logOperationSuccess('Operations documented.');
    } catch (error) {
        console.error('❌  Error documenting operations.', error);
        process.exit(1);
    }
}
