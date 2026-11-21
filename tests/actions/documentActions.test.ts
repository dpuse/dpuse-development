// ── External Dependencies & Registrations
import { describe, expect, it } from 'vitest';

// ── Local Framework
import { documentActions } from '@/actions/documentActions';
import { buildReadme, useTemporaryProject } from '../support/temporaryProject';

// ── State ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

describe('documentActions', () => {
    it.each([
        [['listNodes', 'retrieveRecords'], 'This connector is a Source connector'],
        [['createObject'], 'This connector is a Destination connector'],
        [['retrieveRecords', 'createObject'], 'This connector is a Bidirectional connector'],
        [[], 'This connector does not yet implement any read or write actions']
    ])('describes a connector implementing %j', async (actionNames, description) => {
        await project.writeFiles({ 'config.json': JSON.stringify({ actionNames }), 'README.md': buildReadme('SUPPORTED_ACTIONS') });

        await documentActions();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('<!-- SUPPORTED_ACTIONS_START -->\n\n## Supported Actions\n\nConnectors conform to a unified interface contract');
        expect(readme).toContain(description);
        expect(readme).toContain('The table below lists all connector actions');
    });

    it('treats a config without actions as implementing none', async () => {
        await project.writeFiles({ 'config.json': '{}', 'README.md': buildReadme('SUPPORTED_ACTIONS') });

        await documentActions();

        expect(await project.readFile('README.md')).toContain('does not yet implement any read or write actions');
    });

    it('exits when there is no config file', async () => {
        await project.writeFiles({ 'README.md': buildReadme('SUPPORTED_ACTIONS') });

        await expect(documentActions()).rejects.toThrow('process.exit(1)');
    });
});
