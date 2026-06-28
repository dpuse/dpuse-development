// ── DPUse Framework
import type { ConnectorActionName } from '@dpuse/dpuse-shared/component/module/connector';
import { getConnectorActionsTable } from '@dpuse/dpuse-shared/component/module/connector';

// ── Local (Development) Framework
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile, substituteText, writeTextFile } from '@/utilities';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const START_MARKER = '<!-- CONNECTOR_ACTIONS_START -->';
const END_MARKER = '<!-- CONNECTOR_ACTIONS_END -->';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentActions(): Promise<void> {
    try {
        logOperationHeader('Document Actions');

        logStepHeader("1️⃣  Insert actions table into 'README.md'");

        const config = await readJSONFile<{ actions?: string[] }>('config.json');
        const table = getConnectorActionsTable((config.actions ?? []) as ConnectorActionName[]);

        const originalContent = await readTextFile('./README.md');
        const updatedContent = substituteText(originalContent, table, START_MARKER, END_MARKER);
        await writeTextFile('README.md', updatedContent);

        logOperationSuccess('Actions documented.');
    } catch (error) {
        console.error('❌  Error documenting actions.', error);
        process.exit(1);
    }
}
