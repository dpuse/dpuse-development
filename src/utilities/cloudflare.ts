// ── External Dependencies & Registrations
import os from 'node:os';
import type { PackageJson } from 'type-fest';
import path from 'node:path';
import { promises as fs, type ObjectEncodingOptions } from 'node:fs';

// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared';

// ── Local Framework
import { execCommand, getDirectoryEntries, getStatsForPath, readJSONFile, resolveSampleDataContentType, writeJSONFile } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// A file to upload, and the key it is stored under in the bucket.
interface BulkPutFile {
    file: string;
    key: string;
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

// A '.wasm' file must be served as 'application/wasm', or browsers refuse to compile it while it downloads and
// Cloudflare does not compress it.
const MODULE_CONTENT_TYPES: Record<string, string> = { '.css': 'text/css', '.js': 'application/javascript', '.wasm': 'application/wasm' };
const SAMPLE_DATA_BUCKET = 'dpuse-sample-data-eu';

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// TODO: Send a release secret with these config writes once dpuse-api requires one on its '/configs' write routes,
// which are open to anyone (found October 2026).
//
// NOTE: Each project's publish workflow hands Wrangler the GitHub secret 'CLOUDFLARE_PUBLISH_TOKEN'. The secret holds
// one of three Cloudflare tokens, each allowed only what its projects do, so a compromised release in a repo that only
// uploads files cannot replace the live app:
// - 'CLOUDFLARE_PUBLISH_TOKEN_R2_UPLOAD', for projects that only upload files to R2. The organisation secret for the
//   connectors, tools, presenters, cookbooks and dpuse-resources, and a repo secret in dpuse-engine, because a private
//   repo cannot read an organisation secret on GitHub's free plan.
// - 'CLOUDFLARE_PUBLISH_TOKEN_WORKERS_DEPLOY', a repo secret in dpuse-api and dpuse-app, which deploy Workers. A repo
//   secret is used in place of the organisation secret of the same name.
// - 'CLOUDFLARE_PUBLISH_TOKEN_WORKERS_DEPLOY_KV', a repo secret in dpuse-kb, which deploys a Worker and writes to KV.
// dpuse-shared, dpuse-development and eslint-config-dpuse never call Cloudflare, so the organisation secret is not
// shared with them.
export async function putState(): Promise<void> {
    const configJSON = await readJSONFile<ModuleConfig>('config.json');
    const options = {
        body: JSON.stringify(configJSON),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT'
    };
    const response = await fetch(`https://api.dpuse.app/configs/${configJSON.id}`, options);
    if (!response.ok) throw new Error(await response.text());
}

// Uploads a folder of sample data, and the folders inside it, under the same name in the sample data bucket. Files are
// grouped by content type and each group goes up in one Wrangler call, which uploads its files in parallel.
export async function uploadDirectoryToR2(sourceDirectory: string, uploadDirectory: string): Promise<void> {
    const files = await listFilesRecursively(`${sourceDirectory}/${uploadDirectory}`, uploadDirectory);
    const filesByContentType = Map.groupBy(files, ({ key }) => resolveSampleDataContentType(key));
    for (const [contentType, contentTypeFiles] of filesByContentType) await bulkPutToR2(contentTypeFiles, ['--content-type', contentType]);
}

// Uploads the sample data: the 'application' and 'fileStore' folders, then their indexes. The indexes are always
// checked with the server before a cached copy is reused, so a release is seen at once.
export async function uploadSampleDataToR2(sourceDirectory: string): Promise<void> {
    await uploadDirectoryToR2(sourceDirectory, 'application');
    await uploadDirectoryToR2(sourceDirectory, 'fileStore');
    const indexFiles = ['applicationIndex.json', 'fileStoreIndex.json'].map((name) => ({ file: `${sourceDirectory}/${name}`, key: name }));
    await bulkPutToR2(indexFiles, ['--content-type', 'application/json', '--cache-control', 'no-cache']);
}

export async function uploadModuleConfigToDO(configJSON: ModuleConfig): Promise<void> {
    const stateId = configJSON.id;
    const options = {
        body: JSON.stringify(configJSON),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT'
    };
    const response = await fetch(`https://api.dpuse.app/configs/${stateId}`, options);
    if (!response.ok) throw new Error(await response.text());
}

export async function uploadModuleToR2(packageJSON: PackageJson, uploadDirectoryPath: string): Promise<void> {
    const version = `v${packageJSON.version ?? 'unknown'}`;
    async function uploadDirectory(currentDirectory: string, prefix = ''): Promise<void> {
        const entries = await getDirectoryEntries(currentDirectory, { withFileTypes: true } as ObjectEncodingOptions);
        for (const entry of entries) {
            if (entry.isDirectory() || entry.name.endsWith('.map')) continue;
            const fullPath = `${currentDirectory}/${entry.name}`;
            const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
            const r2Path = `${uploadDirectoryPath}_${version}/${relativePath}`.replaceAll('\\', '/');
            const contentType = MODULE_CONTENT_TYPES[path.extname(entry.name)] ?? 'application/octet-stream';
            console.info(`⚙️ Uploading '${relativePath}' → '${r2Path}'...`);
            await execCommand(undefined, 'wrangler', ['r2', 'object', 'put', r2Path, `--file=${fullPath}`, '--content-type', contentType, '--jurisdiction=eu', '--remote']);
        }
    }
    await uploadDirectory('dist');
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// One 'wrangler r2 bulk put' call, which reads the files to upload from a list in a temporary file. Only
// dpuse-resources uploads this way, when its sample data is published.
//
// NOTE: Wrangler marks 'r2 bulk put' as experimental and leaves it out of its list of commands, so it may change. Check
// it when dpuse-resources upgrades Wrangler. As of Wrangler 4.159, the list is a JSON array of '{ key, file }', an
// entry cannot set options of its own, and options such as '--content-type' and '--cache-control' apply to every file
// in the call, which is why files are grouped by content type. The tests pin the arguments this function passes, so
// they catch a change made here but not a change in Wrangler. If the command is withdrawn, fall back to one 'r2 object
// put' per file, as before (slow: one Wrangler process per file), or upload through R2's S3-compatible API.
async function bulkPutToR2(files: BulkPutFile[], options: string[]): Promise<void> {
    if (files.length === 0) return;
    const listFolderPath = await fs.mkdtemp(path.join(os.tmpdir(), 'dpuse-r2-bulk-'));
    const listFilePath = path.join(listFolderPath, 'files.json');
    try {
        await writeJSONFile(listFilePath, files);
        console.info(`⚙️ Uploading ${String(files.length)} files (${options.join(' ')})...`);
        await execCommand(undefined, 'wrangler', ['r2', 'bulk', 'put', SAMPLE_DATA_BUCKET, '--filename', listFilePath, ...options, '--jurisdiction=eu', '--remote']);
    } finally {
        await fs.rm(listFolderPath, { force: true, recursive: true });
    }
}

// Skips hidden files, such as '.DS_Store', which only exist on a developer's machine.
async function listFilesRecursively(sourcePath: string, keyPrefix: string): Promise<BulkPutFile[]> {
    const names = await getDirectoryEntries(sourcePath);
    const files: BulkPutFile[] = [];
    for (const name of names) {
        if (name.startsWith('.')) continue;
        const itemPath = `${sourcePath}/${name}`;
        const key = `${keyPrefix}/${name}`;
        const stats = await getStatsForPath(itemPath);
        if (stats.isDirectory()) files.push(...(await listFilesRecursively(itemPath, key)));
        else files.push({ file: itemPath, key });
    }
    return files;
}
