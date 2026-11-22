// ── External Dependencies & Registrations
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { documentContributingLicense } from '@/actions/documentContributingLicense';
import { buildReadme, useTemporaryProject } from '../support/temporaryProject';

// ── State ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

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

    it.each([
        ['an MIT licensed project', { license: 'MIT' }],
        ['an MIT licensed project that is not published to npm', { license: 'MIT', private: true }],
        ['a proprietary project', { license: 'UNLICENSED', private: true }]
    ])('says the Contributing section of %s without its open source status', async (_case, packageJSON) => {
        await writeProject(packageJSON);

        await documentContributingLicense();

        const readme = await project.readFile('README.md');
        expect(readme).toContain('## Contributing\n\nThis repository is maintained solely by its owner and does not, at present, accept external contributions.\n\n');
        expect(readme).not.toContain('open source');
    });

    it('says a project with no licence to grant is proprietary, without naming MIT', async () => {
        await writeProject({ license: 'UNLICENSED', private: true });

        await documentContributingLicense();

        const readme = await project.readFile('README.md');
        expect(readme).toContain(
            '## License\n\nThis project is proprietary. Its source is not published, and no licence is granted to use, modify or distribute it.\n\n© 2024-present Jonathan Terrell'
        );
        expect(readme).not.toContain('MIT License');
        expect(readme).not.toContain('./LICENSE');
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

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

async function writeProject(packageJSON: object = {}, firstCreatedAt: number | null = Date.UTC(2024, 0, 1)): Promise<void> {
    await project.writeFiles({
        'config.json': JSON.stringify({ id: 'dpuse-shared', firstCreatedAt }),
        'package.json': JSON.stringify({
            author: 'Jonathan Terrell <terrell.jm@gmail.com>',
            repository: { type: 'git', url: 'git+https://github.com/dpuse/dpuse-shared.git' },
            ...packageJSON
        }),
        'README.md': buildReadme('CONTRIBUTING_LICENSE')
    });
}
