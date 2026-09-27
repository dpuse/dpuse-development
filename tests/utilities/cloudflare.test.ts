// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { execCommand } from '@/utilities';
import { useTemporaryProject } from '../support/temporaryProject';
import { putState, uploadDirectoryToR2, uploadModuleConfigToDO, uploadModuleToR2 } from '@/utilities/cloudflare';

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

describe('uploadDirectoryToR2', () => {
    it('uploads every file in the folder and the folders inside it', async () => {
        await project.writeFiles({ 'public/fileStore/a.csv': '', 'public/fileStore/nested/b.csv': '' });

        await uploadDirectoryToR2('public', 'fileStore');

        expect(
            uploads()
                .map((arguments_) => arguments_[3] ?? '')
                .toSorted((a, b) => a.localeCompare(b))
        ).toEqual(['dpuse-sample-data-eu/fileStore/a.csv', 'dpuse-sample-data-eu/fileStore/nested/b.csv']);
        expect(uploads()[0]).toContain('--file=public/fileStore/a.csv');
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
