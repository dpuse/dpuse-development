// ── Local Framework
import { logOperationHeader, logOperationSuccess, readTextFileOrNull, spawnCommand } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

interface TestTypeConfig {
    id: TestTypeId;
    label: string;
    command: string;
    arguments: string[];
    configFileName: string; // Having this file is how a project says it runs this type of test.
}

export type TestTypeId = 'e2e' | 'unit';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const STEP_ICONS = ['1️⃣ ', '2️⃣ ', '3️⃣ ', '4️⃣ '];

// In the order they run. Unit tests go first so a failure stops the run before the slow browser tests start.
// Both runners are told to pass when they find nothing, so a project that has set up a runner but not yet written
// any tests reports green rather than red, and a real failure stands out.
const TEST_TYPE_CONFIGS: TestTypeConfig[] = [
    { id: 'unit', label: 'Run unit tests', command: 'vitest', arguments: ['run', '--passWithNoTests'], configFileName: 'vitest.config.ts' },
    { id: 'e2e', label: 'Run end-to-end tests', command: 'playwright', arguments: ['test', '--pass-with-no-tests'], configFileName: 'playwright.config.ts' }
];

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Runs the requested types of test, skipping any type this project has not configured. */
export async function testProject(testTypeIds: TestTypeId[] = ['unit']): Promise<void> {
    try {
        logOperationHeader('Test Project');

        let stepNumber = 0;
        for (const testTypeConfig of TEST_TYPE_CONFIGS) {
            if (!testTypeIds.includes(testTypeConfig.id)) continue;

            // Without its configuration file the project does not run this type of test, so pass over it quietly.
            if ((await readTextFileOrNull(testTypeConfig.configFileName)) === null) continue;

            const stepLabel = `${STEP_ICONS[stepNumber] ?? ''} ${testTypeConfig.label}`;
            await spawnCommand(stepLabel, testTypeConfig.command, testTypeConfig.arguments);
            stepNumber += 1;
        }

        if (stepNumber === 0) {
            console.warn('\n⚠️  No tests configured for this project.\n');
            return;
        }

        logOperationSuccess('Project tested');
    } catch (error) {
        console.error('❌  Error testing project', error);
        process.exit(1);
    }
}
