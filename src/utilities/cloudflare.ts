// ── External Dependencies & Registrations
import os from 'node:os';
import type { PackageJson } from 'type-fest';
import path from 'node:path';
import { promises as fs, type ObjectEncodingOptions } from 'node:fs';

// ── DPUse Framework
import type { ModuleConfig } from '@dpuse/dpuse-shared';

// ── Local Framework
import { execCommand, getDirectoryEntries, getStatsForPath, readJSONFile, writeJSONFile } from '@/utilities';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// A file to upload, and the key it is stored under in the bucket.
interface BulkPutFile {
    file: string;
    key: string;
}

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const SAMPLE_DATA_BUCKET = 'dpuse-sample-data-eu';

// Sample data content types, by file extension. Never with a charset: many sample files are deliberately not UTF-8,
// and a charset would tell browsers how to decode them. A file whose extension is missing here stops the upload, so
// none goes up without a content type.
const SAMPLE_DATA_CONTENT_TYPES: Record<string, string> = {
    bin: 'application/octet-stream',
    csv: 'text/csv',
    json: 'application/json',
    md: 'text/markdown',
    spss: 'application/octet-stream',
    txt: 'text/plain',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xml: 'application/xml'
};

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────

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
            const nonJavaScripContentType = entry.name.endsWith('.css') ? 'text/css' : 'application/octet-stream';
            const contentType = entry.name.endsWith('.js') ? 'application/javascript' : nonJavaScripContentType;
            console.info(`⚙️ Uploading '${relativePath}' → '${r2Path}'...`);
            await execCommand(undefined, 'wrangler', ['r2', 'object', 'put', r2Path, `--file=${fullPath}`, '--content-type', contentType, '--jurisdiction=eu', '--remote']);
        }
    }
    await uploadDirectory('dist');
}

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

// One 'wrangler r2 bulk put' call, which reads the files to upload from a list in a temporary file.
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

// A file without an extension is raw bytes, such as chardet's unit-test files, except a licence, which is text.
function resolveSampleDataContentType(key: string): string {
    const name = key.slice(key.lastIndexOf('/') + 1);
    const dotIndex = name.lastIndexOf('.');
    if (dotIndex === -1) return name === 'LICENSE' ? 'text/plain' : 'application/octet-stream';
    const contentType = SAMPLE_DATA_CONTENT_TYPES[name.slice(dotIndex + 1).toLowerCase()];
    if (contentType === undefined) throw new Error(`No content type for '${key}'. Add its extension to 'SAMPLE_DATA_CONTENT_TYPES'.`);
    return contentType;
}
