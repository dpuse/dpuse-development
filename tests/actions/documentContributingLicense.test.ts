// ── External Dependencies & Registrations
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { documentContributingLicense } from '@/actions/documentContributingLicense';
import { buildReadme, useTemporaryProject } from '../support/temporaryProject';

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

async function writeProject(packageJSON: object = {}, firstCreatedAt: number | null = Date.UTC(2024, 0, 1), readme = buildReadme('CONTRIBUTING_LICENSE')): Promise<void> {
    await project.writeFiles({
        'config.json': JSON.stringify({ id: 'dpuse-shared', firstCreatedAt }),
        'package.json': JSON.stringify({
            author: 'Jonathan Terrell <terrell.jm@gmail.com>',
            repository: { type: 'git', url: 'git+https://github.com/dpuse/dpuse-shared.git' },
            ...packageJSON
        }),
        'README.md': readme
    });
}

describe('documentContributingLicense', () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2026-09-15T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('writes the Contributing and License sections', async () => {
        await writeProject();

        await documentContributingLicense();

        const readme = await project.readFile('README.md');
        expect(readme.match(/^#{2,3} .+$/gm)).toEqual(['## Contributing', '## License']);
        expect(readme).toContain('[open a GitHub issue](https://github.com/dpuse/dpuse-shared/issues)');
        expect(readme).toContain('[MIT](./LICENSE) © 2024-present Jonathan Terrell');
    });

    it('splits an old README section, leaving empty Quality & Security markers before it', async () => {
        await writeProject({}, Date.UTC(2024, 0, 1), buildReadme('GOVERNANCE'));

        await documentContributingLicense();

        const readme = await project.readFile('README.md');
        expect(readme).not.toContain('GOVERNANCE');
        expect(readme).toMatch(/<!-- QUALITY_SECURITY_START -->\n<!-- QUALITY_SECURITY_END -->\n\n<!-- CONTRIBUTING_LICENSE_START -->\n\n## Contributing/);
    });

    it.each([
        ['Jonathan Terrell', Date.UTC(2026, 0, 1), '© 2026 Jonathan Terrell'],
        [{ name: 'Jonathan Terrell  <terrell.jm@gmail.com>  (https://example.com)' }, null, '© 2026 Jonathan Terrell (https://example.com)']
    ])('names the author %j with the right copyright years', async (author, firstCreatedAt, expected) => {
        await writeProject({ author }, firstCreatedAt);

        await documentContributingLicense();

        expect(await project.readFile('README.md')).toContain(`[MIT](./LICENSE) ${expected}`);
    });

    it('exits when the author is missing', async () => {
        await writeProject({ author: '' });

        await expect(documentContributingLicense()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith(
            '❌  Error documenting contributing and license',
            new Error("package.json 'author' field is required to document contributing and license.")
        );
    });
});
