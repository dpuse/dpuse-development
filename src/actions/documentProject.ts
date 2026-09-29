// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared/component/module';

// ── Local Framework
import { documentActions } from '@/actions/documentActions';
import { documentContributingLicense } from '@/actions/documentContributingLicense';
import { documentDependencies } from '@/actions/documentDependencies';
import { documentOpening } from '@/actions/documentOpening';
import { documentQualitySecurity } from '@/actions/documentQualitySecurity';
import { documentUsage } from '@/actions/documentUsage';
import { API_REFERENCE_PATH, documentAPIReference } from '@/actions/documentApiReference';
import { BUNDLE_REPORT_PATH, documentBundleSizes } from '@/actions/documentBundleSizes';
import { getModuleConfig, logStepHeader, readJSONFile, readTextFileOrNull, spawnCommand } from '@/utilities';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Regenerates every generated section of the README, in the order they appear, then the API reference where the project keeps one. */
// 'allowedLicenses' lists the licences dependencies may use, separated by ';'. 'isModuleLevel' breaks bundle sizes
// down by module rather than by package.
export async function documentProject(allowedLicenses = 'MIT', isModuleLevel = false): Promise<void> {
    try {
        const configJSON = await readJSONFile<ModuleConfig>('config.json');
        const isConnector = getModuleConfig(configJSON.id).typeId === 'connector'; // Only connectors have an actions table.

        await documentOpening();
        if (isConnector) await documentActions();
        await documentUsage();
        await documentDependencies(allowedLicenses);

        // Bundle sizes come from the report the last build wrote, so they wait until there is one, as on a fresh clone.
        if ((await readTextFileOrNull(BUNDLE_REPORT_PATH)) === null) {
            logStepHeader(`ℹ️  Bundle sizes NOT documented, as there is no '${BUNDLE_REPORT_PATH}' yet. Build the project first.`);
        } else {
            await documentBundleSizes({ moduleLevel: isModuleLevel });
        }

        await documentQualitySecurity();
        await documentContributingLicense();

        // Only where the project keeps an API reference, so projects opt in by adding the file.
        const hasAPIReference = (await readTextFileOrNull(API_REFERENCE_PATH)) !== null;
        if (hasAPIReference) {
            await documentAPIReference();
        } else {
            logStepHeader(`ℹ️  '${API_REFERENCE_PATH}' NOT required by this project`);
        }

        // Saved as Prettier would format them, so 'npm run format' has nothing left to change. Only the files written here
        // are formatted, so documenting never touches the source.
        await spawnCommand('ℹ️  Format generated files', 'prettier', ['--write', 'README.md', ...(hasAPIReference ? [API_REFERENCE_PATH] : [])]);
    } catch (error) {
        console.error('❌  Error documenting project', error);
        process.exit(1);
    }
}
