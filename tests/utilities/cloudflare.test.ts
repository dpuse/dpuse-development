// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { collectConsoleOutput, useTemporaryProject } from '../support/temporaryProject';
import { execCommand, readJSONFile, readTextFileOrNull } from '@/utilities';
import { uploadDirectoryToR2, uploadModuleConfigToDO, uploadModuleToR2, uploadSampleDataToR2 } from '@/utilities/cloudflare';

// ── Types ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Each bulk upload's options and the files its list names. The list is read while the call runs, as it is deleted
// afterwards.
interface BulkPut {
    files: { file: string; key: string }[];
    listFilePath: string;
    options: string[];
}

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Wrangler uploads are recorded rather than run.
vi.mock('@/utilities', async (importOriginal) => ({ ...(await importOriginal<object>()), execCommand: vi.fn(() => Promise.resolve()) }));

// ── State ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
    vi.mocked(execCommand).mockClear();
});

describe('uploadModuleToR2', () => {
    it('uploads the built files under the versioned path in one bulk call per content type, skipping source maps and folders', async () => {
        await project.writeFiles({
            'dist/index.es.js': '',
            'dist/chunk.es.js': '',
            'dist/index.es.js.map': '',
            'dist/style.css': '',
            'dist/data.wasm': '',
            'dist/packages.json': '',
            'dist/notes.txt': '',
            'dist/types/index.d.ts': ''
        });
        const bulkPuts = recordBulkPuts('dpuse-engine-eu');

        await uploadModuleToR2({ version: '1.2.3' }, 'dpuse-engine-eu/connectors/example');

        const uploaded = bulkPuts.map(({ files, options }) => [options.join(' '), files.map(({ key }) => key).toSorted((a, b) => a.localeCompare(b))]);
        expect(uploaded.toSorted((a, b) => String(a[0]).localeCompare(String(b[0])))).toEqual([
            ['--content-type application/javascript --jurisdiction=eu --remote --force', ['connectors/example_v1.2.3/chunk.es.js', 'connectors/example_v1.2.3/index.es.js']],
            ['--content-type application/json --jurisdiction=eu --remote --force', ['connectors/example_v1.2.3/packages.json']],
            ['--content-type application/octet-stream --jurisdiction=eu --remote --force', ['connectors/example_v1.2.3/notes.txt']],
            ['--content-type application/wasm --jurisdiction=eu --remote --force', ['connectors/example_v1.2.3/data.wasm']],
            ['--content-type text/css --jurisdiction=eu --remote --force', ['connectors/example_v1.2.3/style.css']]
        ]);
        expect(bulkPuts.flatMap(({ files }) => files)).toContainEqual({ file: 'dist/data.wasm', key: 'connectors/example_v1.2.3/data.wasm' });
        expect(collectConsoleOutput()).toContain("Uploading 'dist/data.wasm' → 'dpuse-engine-eu/connectors/example_v1.2.3/data.wasm'");
        for (const { listFilePath } of bulkPuts) expect(await readTextFileOrNull(listFilePath)).toBeNull();
    });

    it("names the version 'unknown' when there is none", async () => {
        await project.writeFiles({ 'dist/index.es.js': '' });
        const bulkPuts = recordBulkPuts('dpuse-engine-eu');

        await uploadModuleToR2({}, 'dpuse-engine-eu/engine');

        expect(bulkPuts[0]?.files).toEqual([{ file: 'dist/index.es.js', key: 'engine_vunknown/index.es.js' }]);
    });
});

describe('uploadDirectoryToR2', () => {
    it('uploads a folder and the folders inside it in one bulk call per content type, never with a charset', async () => {
        await project.writeFiles({
            'public/fileStore/a.csv': '',
            'public/fileStore/nested/b.csv': '',
            'public/fileStore/notes.txt': '',
            'public/fileStore/chardet/LICENSE': '',
            'public/fileStore/chardet/koi8r': '',
            'public/fileStore/.DS_Store': ''
        });
        const bulkPuts = recordBulkPuts();

        await uploadDirectoryToR2('public', 'fileStore');

        const uploaded = bulkPuts.map(({ files, options }) => [options.join(' '), files.map(({ key }) => key).toSorted((a, b) => a.localeCompare(b))]);
        expect(uploaded.toSorted((a, b) => String(a[0]).localeCompare(String(b[0])))).toEqual([
            ['--content-type application/octet-stream --jurisdiction=eu --remote --force', ['fileStore/chardet/koi8r']],
            ['--content-type text/csv --jurisdiction=eu --remote --force', ['fileStore/a.csv', 'fileStore/nested/b.csv']],
            ['--content-type text/plain --jurisdiction=eu --remote --force', ['fileStore/chardet/LICENSE', 'fileStore/notes.txt']]
        ]);
        expect(bulkPuts.flatMap(({ files }) => files)).toContainEqual({ file: 'public/fileStore/a.csv', key: 'fileStore/a.csv' });
        for (const { listFilePath } of bulkPuts) expect(await readTextFileOrNull(listFilePath)).toBeNull();
    });

    it('runs no upload for a folder with nothing to upload', async () => {
        await project.writeFiles({ 'public/fileStore/.DS_Store': '' });
        const bulkPuts = recordBulkPuts();

        await uploadDirectoryToR2('public', 'fileStore');

        expect(bulkPuts).toEqual([]);
        expect(execCommand).not.toHaveBeenCalled();
    });

    it('rejects when Wrangler fails, and still removes the list of files it wrote', async () => {
        await project.writeFiles({ 'public/fileStore/a.csv': '' });
        let listFilePath = '';
        vi.mocked(execCommand).mockImplementation((_label, _command, arguments_) => {
            listFilePath = arguments_[5] ?? '';
            return Promise.reject(new Error('wrangler exited with code 1'));
        });

        await expect(uploadDirectoryToR2('public', 'fileStore')).rejects.toThrow('wrangler exited with code 1');
        expect(listFilePath).not.toBe('');
        expect(await readTextFileOrNull(listFilePath)).toBeNull();
    });

    it('uploads a file with an extension it has no content type for as raw bytes, with a warning', async () => {
        await project.writeFiles({ 'public/fileStore/a.csv': '', 'public/fileStore/report.pdf': '' });
        const bulkPuts = recordBulkPuts();

        await uploadDirectoryToR2('public', 'fileStore');

        expect(bulkPuts.map(({ files, options }) => [options.join(' '), files.map(({ key }) => key)])).toContainEqual([
            '--content-type application/octet-stream --jurisdiction=eu --remote --force',
            ['fileStore/report.pdf']
        ]);
        expect(collectConsoleOutput()).toContain("No content type for 'fileStore/report.pdf'");
    });
});

describe('uploadSampleDataToR2', () => {
    it('uploads the application and file store folders, then their indexes, which are always checked before reuse', async () => {
        await project.writeFiles({
            'public/application/people.csv': '',
            'public/fileStore/a.csv': '',
            'public/applicationIndex.json': '{}',
            'public/fileStoreIndex.json': '{}'
        });
        const bulkPuts = recordBulkPuts();

        await uploadSampleDataToR2('public');

        expect(bulkPuts.map(({ files }) => files.map(({ key }) => key))).toEqual([
            ['application/people.csv'],
            ['fileStore/a.csv'],
            ['applicationIndex.json', 'fileStoreIndex.json']
        ]);
        expect(bulkPuts.at(-1)?.options).toEqual(['--content-type', 'application/json', '--cache-control', 'no-cache', '--jurisdiction=eu', '--remote', '--force']);
    });
});

describe('configuration uploads', () => {
    it('stores a configuration by its id, as JSON', async () => {
        const fetch = stubFetch(true);

        await uploadModuleConfigToDO({ id: 'dpuse-connector-example' } as Parameters<typeof uploadModuleConfigToDO>[0]);

        const expectedRequest = { body: '{"id":"dpuse-connector-example"}', headers: { 'Content-Type': 'application/json' }, method: 'PUT' };
        expect(fetch).toHaveBeenCalledWith('https://api.dpuse.app/configs/dpuse-connector-example', expectedRequest);
    });

    it('rejects with the server message when the store refuses', async () => {
        stubFetch(false);

        await expect(uploadModuleConfigToDO({ id: 'x' } as Parameters<typeof uploadModuleConfigToDO>[0])).rejects.toThrow('Server error');
    });
});

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

function stubFetch(isOK: boolean): ReturnType<typeof vi.fn> {
    const fetch = vi.fn(() => Promise.resolve({ ok: isOK, text: () => Promise.resolve('Server error') }));
    vi.stubGlobal('fetch', fetch);
    return fetch;
}

function recordBulkPuts(bucket = 'dpuse-sample-data-eu'): BulkPut[] {
    const bulkPuts: BulkPut[] = [];
    vi.mocked(execCommand).mockImplementation(async (_label, _command, arguments_) => {
        expect(arguments_.slice(0, 4)).toEqual(['r2', 'bulk', 'put', bucket]);
        const listFilePath = arguments_[5] ?? '';
        const files = await readJSONFile<BulkPut['files']>(listFilePath);
        bulkPuts.push({ files, listFilePath, options: arguments_.slice(6) });
    });
    return bulkPuts;
}
