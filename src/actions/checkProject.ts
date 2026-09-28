// ── Local Framework
import { checkConfigFiles } from '@/actions/checkConfigFiles';
import { checkDependencies } from '@/actions/checkDependencies';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Checks the configuration files against the DPUse templates, then lists outdated dependencies. */
export async function checkProject(): Promise<void> {
    await checkConfigFiles();
    await checkDependencies();
}
