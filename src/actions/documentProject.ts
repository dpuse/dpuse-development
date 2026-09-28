// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared/component/module';

// ── Local Framework
import { documentActions } from '@/actions/documentActions';
import { documentContributingLicense } from '@/actions/documentContributingLicense';
import { documentDependencies } from '@/actions/documentDependencies';
import { documentOpening } from '@/actions/documentOpening';
import { documentQualitySecurity } from '@/actions/documentQualitySecurity';
import { documentUsage } from '@/actions/documentUsage';
import { BUNDLE_REPORT_PATH, documentBundleSizes } from '@/actions/documentBundleSizes';
import { getModuleConfig, logStepHeader, readJSONFile, readTextFileOrNull } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

export interface DocumentOptions {
    allowedLicenses?: string; // The licences dependencies may use, separated by ';'.
    moduleLevel?: boolean; // Breaks bundle sizes down by module rather than by package.
}

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Regenerates every generated section of the README, in the order they appear. */
export async function documentProject({ allowedLicenses = 'MIT', moduleLevel = false }: DocumentOptions = {}): Promise<void> {
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
            await documentBundleSizes({ moduleLevel });
        }

        await documentQualitySecurity();
        await documentContributingLicense();
    } catch (error) {
        console.error('❌  Error documenting project', error);
        process.exit(1);
    }
}
