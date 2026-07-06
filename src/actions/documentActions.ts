// ── DPUse Framework
import type { ConnectorActionName, ConnectorUsageId } from '@dpuse/dpuse-shared/component/module/connector';
import { determineConnectorUsageId, getConnectorActionsTable } from '@dpuse/dpuse-shared/component/module/connector';

// ── Local (Development) Framework
import { logOperationHeader, logOperationSuccess, logStepHeader, readJSONFile, readTextFile, substituteText, writeTextFile } from '@/utilities';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const START_MARKER = '<!-- CONNECTOR_ACTIONS_START -->';
const END_MARKER = '<!-- CONNECTOR_ACTIONS_END -->';

const CONNECTOR_ACTIONS_INTRO =
    'Connectors conform to a unified interface contract by implementing a specific subset of standard actions. These standardised actions allow the DPUse application to interact with any underlying data source in the same way, enabling Connectors to be built independently and loaded dynamically at runtime.';

const CONNECTOR_USAGE_DESCRIPTIONS: Record<ConnectorUsageId, string> = {
    source: 'This connector is a Source connector that supports only read actions. Connectors can also function as a Destination (write-only) or Bidirectional (read/write), depending on the actions they support.',
    destination: 'This connector is a Destination connector that supports only write actions. Connectors can also function as a Source (read-only) or Bidirectional (read/write), depending on the actions they support.',
    bidirectional: 'This connector is a Bidirectional connector that supports both read and write actions. Connectors can also function as a Source (read-only) or Destination (write-only), depending on the actions they support.',
    unknown: 'This connector does not yet implement any read or write actions, so its type cannot be determined. Connectors function as a Source (read-only), a Destination (write-only), or Bidirectional (read/write), depending on the actions they support.'
};

const CONNECTOR_ACTIONS_TABLE_LEAD_IN = 'The table below lists all connector actions and highlights those supported by this connector.';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export async function documentActions(): Promise<void> {
    try {
        logOperationHeader('Document Actions');

        logStepHeader("1️⃣  Insert actions description and table into 'README.md'");

        const config = await readJSONFile<{ actionNames?: string[] }>('config.json');
        const actionNames = (config.actionNames ?? []) as ConnectorActionName[];
        const usageId = determineConnectorUsageId(actionNames);
        const table = getConnectorActionsTable(actionNames);

        const block = `${CONNECTOR_ACTIONS_INTRO}\n\n${CONNECTOR_USAGE_DESCRIPTIONS[usageId]} ${CONNECTOR_ACTIONS_TABLE_LEAD_IN}\n\n${table}`;

        const originalContent = await readTextFile('./README.md');
        const updatedContent = substituteText(originalContent, block, START_MARKER, END_MARKER);
        await writeTextFile('README.md', updatedContent);

        logOperationSuccess('Actions documented');
    } catch (error) {
        console.error('❌  Error documenting actions', error);
        process.exit(1);
    }
}
