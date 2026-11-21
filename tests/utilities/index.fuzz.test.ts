// ── External Dependencies & Registrations
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

// ── Local Framework
import { useTemporaryProject } from '../support/temporaryProject';
import { readJSONFile, resolveOwnerAndRepository, writeJSONFile, writeReadmeSection } from '@/utilities';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const START_MARKER = '<!-- SECTION_START -->';
const END_MARKER = '<!-- SECTION_END -->';

// Any text, as a README fragment: empty text, blank lines and surrounding whitespace included.
const textArbitrary = fc.string().filter((text) => !text.includes(START_MARKER) && !text.includes(END_MARKER));

// A GitHub owner or repository name: letters, digits, '-', '_' and '.', never ending in the '.git' a clone URL adds.
const nameArbitrary = fc
    .string({ unit: fc.constantFrom('a', 'b', 'x', 'A', 'B', 'X', '0', '1', '9', '.', '_', '-'), minLength: 1, maxLength: 30 })
    .filter((name) => /^[^._-]/.test(name) && !name.endsWith('.git'));

// ── State ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Property-based tests: fast-check generates many random inputs per property. Each README run writes a README and
// replaces its section, as the document actions do.
describe('writeReadmeSection (property-based)', () => {
    it('replaces only the text between the markers', async () => {
        await fc.assert(
            fc.asyncProperty(textArbitrary, textArbitrary, textArbitrary, textArbitrary, async (before, between, after, substitute) => {
                const originalText = `${before}${START_MARKER}${between}${END_MARKER}${after}`;

                expect(await replaceSection(originalText, substitute)).toBe(`${before}${START_MARKER}\n\n${substitute.trim()}\n\n${END_MARKER}${after}`);
            })
        );
    });

    it('gives the same result when applied twice', async () => {
        await fc.assert(
            fc.asyncProperty(textArbitrary, textArbitrary, textArbitrary, textArbitrary, async (before, between, after, substitute) => {
                const once = await replaceSection(`${before}${START_MARKER}${between}${END_MARKER}${after}`, substitute);

                expect(await replaceSection(once, substitute)).toBe(once);
            })
        );
    });

    it('rejects a README missing a marker', async () => {
        await fc.assert(
            fc.asyncProperty(textArbitrary, textArbitrary, fc.boolean(), async (text, substitute, isStartKept) => {
                const originalText = isStartKept ? `${START_MARKER}${text}` : `${text}${END_MARKER}`;

                await expect(replaceSection(originalText, substitute)).rejects.toThrow();
            })
        );
    });
});

describe('resolveOwnerAndRepository (property-based)', () => {
    it('reads the same owner and repository from every form of a GitHub URL', () => {
        fc.assert(
            fc.property(nameArbitrary, nameArbitrary, (owner, repository) => {
                const urls = [`git+https://github.com/${owner}/${repository}.git`, `https://github.com/${owner}/${repository}`, `git@github.com:${owner}/${repository}.git`];

                for (const url of urls) {
                    expect(resolveOwnerAndRepository({ repository: url }, 'test')).toEqual({ owner, repository });
                    expect(resolveOwnerAndRepository({ repository: { type: 'git', url } }, 'test')).toEqual({ owner, repository });
                }
            })
        );
    });
});

describe('writeJSONFile (property-based)', () => {
    it('writes any JSON object indented by four spaces, ending with a newline, so that it reads back as written', async () => {
        await fc.assert(
            fc.asyncProperty(fc.dictionary(fc.string(), fc.jsonValue()), async (data) => {
                await writeJSONFile('data/config.json', data);

                const text = await project.readFile('data/config.json');
                expect(text).toBe(`${JSON.stringify(data, undefined, 4)}\n`);
                expect(await readJSONFile('data/config.json')).toEqual(JSON.parse(text));
            })
        );
    });
});

// ── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

async function replaceSection(originalText: string, substitute: string): Promise<string> {
    await project.writeFiles({ 'README.md': originalText });
    await writeReadmeSection(substitute, START_MARKER, END_MARKER);
    return await project.readFile('README.md');
}
