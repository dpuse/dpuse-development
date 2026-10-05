// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { useTemporaryProject } from '../support/temporaryProject';
import { execCommand, readJSONFile, readTextFileOrNull } from '@/utilities';
import { putState, uploadDirectoryToR2, uploadModuleConfigToDO, uploadModuleToR2, uploadSampleDataToR2 } from '@/utilities/cloudflare';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Wrangler uploads are recorded rather than run.
vi.mock('@/utilities', async (importOriginal) => ({ ...(await importOriginal<object>()), execCommand: vi.fn(() => Promise.resolve()) }));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

function uploads(): string[][] {
    return vi.mocked(execCommand).mock.calls.map((call) => call[2]);
}

function compareUploads(a: string[], b: string[]): number {
    return a.join(' ').localeCompare(b.join(' '));
}

function stubFetch(isOK: boolean): ReturnType<typeof vi.fn> {
    const fetch = vi.fn(() => Promise.resolve({ ok: isOK, text: () => Promise.resolve('Server error') }));
    vi.stubGlobal('fetch', fetch);
    return fetch;
}

beforeEach(() => {
    vi.mocked(execCommand).mockClear();
});

describe('uploadModuleToR2', () => {
    it('uploads each built file under the versioned path, with its content type, skipping source maps and folders', async () => {
        await project.writeFiles({ 'dist/index.es.js': '', 'dist/index.es.js.map': '', 'dist/style.css': '', 'dist/data.wasm': '', 'dist/types/index.d.ts': '' });

        await uploadModuleToR2({ version: '1.2.3' }, 'dpuse-engine-eu/connectors/example');

        expect(uploads().toSorted(compareUploads)).toEqual(
            [
                [
                    'r2',
                    'object',
                    'put',
                    'dpuse-engine-eu/connectors/example_v1.2.3/data.wasm',
                    '--file=dist/data.wasm',
                    '--content-type',
                    'application/octet-stream',
                    '--jurisdiction=eu',
                    '--remote'
                ],
                [
                    'r2',
                    'object',
                    'put',
                    'dpuse-engine-eu/connectors/example_v1.2.3/index.es.js',
                    '--file=dist/index.es.js',
                    '--content-type',
                    'application/javascript',
                    '--jurisdiction=eu',
                    '--remote'
                ],
                [
                    'r2',
                    'object',
                    'put',
                    'dpuse-engine-eu/connectors/example_v1.2.3/style.css',
                    '--file=dist/style.css',
                    '--content-type',
                    'text/css',
                    '--jurisdiction=eu',
                    '--remote'
                ]
            ].toSorted(compareUploads)
        );
    });

    it("names the version 'unknown' when there is none", async () => {
        await project.writeFiles({ 'dist/index.es.js': '' });

        await uploadModuleToR2({}, 'dpuse-engine-eu/engine');

        expect(uploads()[0]?.[3]).toBe('dpuse-engine-eu/engine_vunknown/index.es.js');
    });
});

// Each bulk upload's options and the files its list names. The list is read while the call runs, as it is deleted
// afterwards.
interface BulkPut {
    files: { file: string; key: string }[];
    listFilePath: string;
    options: string[];
}

function recordBulkPuts(): BulkPut[] {
    const bulkPuts: BulkPut[] = [];
    vi.mocked(execCommand).mockImplementation(async (_label, _command, arguments_) => {
        expect(arguments_.slice(0, 4)).toEqual(['r2', 'bulk', 'put', 'dpuse-sample-data-eu']);
        const listFilePath = arguments_[5] ?? '';
        const files = await readJSONFile<BulkPut['files']>(listFilePath);
        bulkPuts.push({ files, listFilePath, options: arguments_.slice(6) });
    });
    return bulkPuts;
}

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
            ['--content-type application/octet-stream --jurisdiction=eu --remote', ['fileStore/chardet/koi8r']],
            ['--content-type text/csv --jurisdiction=eu --remote', ['fileStore/a.csv', 'fileStore/nested/b.csv']],
            ['--content-type text/plain --jurisdiction=eu --remote', ['fileStore/chardet/LICENSE', 'fileStore/notes.txt']]
        ]);
        expect(bulkPuts.flatMap(({ files }) => files)).toContainEqual({ file: 'public/fileStore/a.csv', key: 'fileStore/a.csv' });
        for (const { listFilePath } of bulkPuts) expect(await readTextFileOrNull(listFilePath)).toBeNull();
    });

    it('uploads nothing when a file has an extension it has no content type for', async () => {
        await project.writeFiles({ 'public/fileStore/a.csv': '', 'public/fileStore/report.pdf': '' });
        const bulkPuts = recordBulkPuts();

        await expect(uploadDirectoryToR2('public', 'fileStore')).rejects.toThrow("No content type for 'fileStore/report.pdf'.");
        expect(bulkPuts).toEqual([]);
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
        expect(bulkPuts.at(-1)?.options).toEqual(['--content-type', 'application/json', '--cache-control', 'no-cache', '--jurisdiction=eu', '--remote']);
    });
});

describe('configuration uploads', () => {
    it('stores the app configuration by its id', async () => {
        await project.writeFiles({ 'config.json': JSON.stringify({ id: 'dpuse-app' }) });
        const fetch = stubFetch(true);

        await putState();

        expect(fetch).toHaveBeenCalledWith('https://api.dpuse.app/configs/dpuse-app', expect.objectContaining({ method: 'PUT', body: '{"id":"dpuse-app"}' }));
    });

    it('stores a module configuration by its id', async () => {
        const fetch = stubFetch(true);

        await uploadModuleConfigToDO({ id: 'dpuse-connector-example' } as Parameters<typeof uploadModuleConfigToDO>[0]);

        expect(fetch).toHaveBeenCalledWith('https://api.dpuse.app/configs/dpuse-connector-example', expect.objectContaining({ method: 'PUT' }));
    });

    it('rejects with the server message when the store refuses', async () => {
        await project.writeFiles({ 'config.json': JSON.stringify({ id: 'dpuse-app' }) });
        stubFetch(false);

        await expect(putState()).rejects.toThrow('Server error');
        await expect(uploadModuleConfigToDO({ id: 'x' } as Parameters<typeof uploadModuleConfigToDO>[0])).rejects.toThrow('Server error');
    });
});
