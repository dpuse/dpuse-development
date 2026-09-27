import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { useTemporaryProject } from '../support/temporaryProject';
import { writeReadmeSection } from '@/utilities';

// Property-based tests: fast-check generates many random README fragments per property, including empty text, blank
// lines and surrounding whitespace in the substitute. Each run writes a README and replaces its section, as the document
// actions do.

const START_MARKER = '<!-- SECTION_START -->';
const END_MARKER = '<!-- SECTION_END -->';

const project = useTemporaryProject();

const textArbitrary = fc.string().filter((text) => !text.includes(START_MARKER) && !text.includes(END_MARKER));

async function replaceSection(originalText: string, substitute: string): Promise<string> {
    await project.writeFiles({ 'README.md': originalText });
    await writeReadmeSection(substitute, START_MARKER, END_MARKER);
    return await project.readFile('README.md');
}

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
