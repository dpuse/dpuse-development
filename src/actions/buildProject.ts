// ── External Dependencies & Registrations
import type { PackageJson } from 'type-fest';

// ── Local Framework
import { logOperationHeader, logOperationSuccess, readJSONFile, spawnCommand } from '@/utilities';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

// A project with Rust code names its WebAssembly build in this script, as the crate and target differ by project.
const WASM_BUILD_SCRIPT_NAME = 'build:wasm';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Builds the package using Vite. Output to '/dist' directory. Builds bundle analysis reports. */
export async function buildProject(): Promise<void> {
    try {
        logOperationHeader('Build Project');

        await bundleProject('1️⃣ ', await readJSONFile<PackageJson>('package.json'));

        logOperationSuccess('Project built');
    } catch (error) {
        console.error('❌  Error building project', error);
        process.exit(1);
    }
}

/** Bundles the project with Vite, first building its WebAssembly where the project has a 'build:wasm' script. */
export async function bundleProject(stepIcon: string, packageJSON: PackageJson): Promise<void> {
    if (packageJSON.scripts?.[WASM_BUILD_SCRIPT_NAME] != null) {
        await spawnCommand(`${stepIcon} Build WebAssembly`, 'npm', ['run', WASM_BUILD_SCRIPT_NAME]);
    }
    await spawnCommand(`${stepIcon} Bundle project`, 'vite', ['build']);
}
