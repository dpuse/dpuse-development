import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { substituteText } from '@/utilities';

// Property-based tests: fast-check generates many random README fragments per property, including empty text, blank
// lines and surrounding whitespace in the substitute.

const START_MARKER = '<!-- SECTION_START -->';
const END_MARKER = '<!-- SECTION_END -->';

const textArbitrary = fc.string().filter((text) => !text.includes(START_MARKER) && !text.includes(END_MARKER));

describe('substituteText (property-based)', () => {
    it('replaces only the text between the markers', () => {
        fc.assert(
            fc.property(textArbitrary, textArbitrary, textArbitrary, textArbitrary, (before, between, after, substitute) => {
                const originalText = `${before}${START_MARKER}${between}${END_MARKER}${after}`;

                expect(substituteText(originalText, substitute, START_MARKER, END_MARKER)).toBe(
                    `${before}${START_MARKER}\n\n${substitute.trim()}\n\n${END_MARKER}${after}`
                );
            })
        );
    });

    it('gives the same result when applied twice', () => {
        fc.assert(
            fc.property(textArbitrary, textArbitrary, textArbitrary, textArbitrary, (before, between, after, substitute) => {
                const once = substituteText(`${before}${START_MARKER}${between}${END_MARKER}${after}`, substitute, START_MARKER, END_MARKER);

                expect(substituteText(once, substitute, START_MARKER, END_MARKER)).toBe(once);
            })
        );
    });

    it('throws when a marker is missing', () => {
        fc.assert(
            fc.property(textArbitrary, textArbitrary, fc.boolean(), (text, substitute, isStartKept) => {
                const originalText = isStartKept ? `${START_MARKER}${text}` : `${text}${END_MARKER}`;

                expect(() => substituteText(originalText, substitute, START_MARKER, END_MARKER)).toThrow();
            })
        );
    });
});
