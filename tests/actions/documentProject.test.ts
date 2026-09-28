// ── External Dependencies & Registrations
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { documentActions } from '@/actions/documentActions';
import { documentAPIReference } from '@/actions/documentApiReference';
import { documentBundleSizes } from '@/actions/documentBundleSizes';
import { documentContributingLicense } from '@/actions/documentContributingLicense';
import { documentDependencies } from '@/actions/documentDependencies';
import { documentOpening } from '@/actions/documentOpening';
import { documentProject } from '@/actions/documentProject';
import { documentQualitySecurity } from '@/actions/documentQualitySecurity';
import { documentUsage } from '@/actions/documentUsage';
import { useTemporaryProject } from '../support/temporaryProject';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Each section has its own tests, so here they only record that they ran, and in what order.
const calls = vi.hoisted<string[]>(() => []);
vi.mock('@/actions/documentActions', () => ({
    documentActions: vi.fn(() => {
        calls.push('actions');
    })
}));
vi.mock('@/actions/documentApiReference', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    documentAPIReference: vi.fn(() => {
        calls.push('apiReference');
    })
}));
vi.mock('@/actions/documentBundleSizes', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    documentBundleSizes: vi.fn(() => {
        calls.push('bundleSizes');
    })
}));
vi.mock('@/actions/documentDependencies', () => ({
    documentDependencies: vi.fn(() => {
        calls.push('dependencies');
    })
}));
vi.mock('@/actions/documentContributingLicense', () => ({
    documentContributingLicense: vi.fn(() => {
        calls.push('contributingLicense');
    })
}));
vi.mock('@/actions/documentQualitySecurity', () => ({
    documentQualitySecurity: vi.fn(() => {
        calls.push('qualitySecurity');
    })
}));
vi.mock('@/actions/documentOpening', () => ({
    documentOpening: vi.fn(() => {
        calls.push('opening');
    })
}));
vi.mock('@/actions/documentUsage', () => ({
    documentUsage: vi.fn(() => {
        calls.push('usage');
    })
}));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

beforeEach(() => {
    calls.length = 0;
    for (const action of [
        documentActions,
        documentAPIReference,
        documentBundleSizes,
        documentContributingLicense,
        documentDependencies,
        documentOpening,
        documentQualitySecurity,
        documentUsage
    ])
        vi.mocked(action).mockClear();
});

describe('documentProject', () => {
    it('regenerates each section in README order, passing on the allowed licences', async () => {
        await project.writeFiles({ 'config.json': JSON.stringify({ id: 'dpuse-shared' }) });

        await documentProject({ allowedLicenses: 'Apache-2.0;MIT' });

        expect(calls).toEqual(['opening', 'usage', 'dependencies', 'qualitySecurity', 'contributingLicense']);
        expect(documentDependencies).toHaveBeenCalledWith('Apache-2.0;MIT');
        expect(console.info).toHaveBeenCalledWith(expect.stringContaining('Bundle sizes NOT documented'));
    });

    it('documents bundle sizes, between dependencies and quality and security, once a build has written its report', async () => {
        await project.writeFiles({ 'config.json': JSON.stringify({ id: 'dpuse-shared' }), 'bundle-analysis-reports/sonda/index.json': '{}' });

        await documentProject({ moduleLevel: true });

        expect(calls).toEqual(['opening', 'usage', 'dependencies', 'bundleSizes', 'qualitySecurity', 'contributingLicense']);
        expect(documentBundleSizes).toHaveBeenCalledWith({ moduleLevel: true });
    });

    it('regenerates the API reference last, where the project keeps one', async () => {
        await project.writeFiles({ 'config.json': JSON.stringify({ id: 'dpuse-shared' }), 'API_REFERENCE.md': 'Out of date' });

        await documentProject();

        expect(calls).toEqual(['opening', 'usage', 'dependencies', 'qualitySecurity', 'contributingLicense', 'apiReference']);
    });

    it('adds the actions table, after the opening, for a connector', async () => {
        await project.writeFiles({ 'config.json': JSON.stringify({ id: 'dpuse-connector-example' }) });

        await documentProject();

        expect(calls).toEqual(['opening', 'actions', 'usage', 'dependencies', 'qualitySecurity', 'contributingLicense']);
        expect(documentDependencies).toHaveBeenCalledWith('MIT');
    });

    it('exits when the module type cannot be found', async () => {
        await project.writeFiles({ 'config.json': JSON.stringify({ id: 'unknown-module' }) });

        await expect(documentProject()).rejects.toThrow('process.exit(1)');
        expect(calls).toEqual([]);
    });
});
