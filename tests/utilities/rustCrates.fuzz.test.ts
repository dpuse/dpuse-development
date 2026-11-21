// ── External Dependencies & Registrations
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

// ── Local Framework
import { isLicenseAllowed } from '@/utilities/rustCrates';

// ── Constants ────────────────────────────────────────────────────────────────────────────────────────────────────────

const LICENSE_IDENTIFIERS = ['0BSD', 'Apache-2.0', 'BSD-3-Clause', 'GPL-3.0-only', 'ISC', 'MIT', 'MPL-2.0', 'Unicode-3.0', 'Unlicense', 'Zlib'];

const licenseArbitrary = fc.constantFrom(...LICENSE_IDENTIFIERS);
const allowedArbitrary = fc.uniqueArray(licenseArbitrary, { minLength: 1 });

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// Property-based tests: fast-check generates many random licences and allow lists per property.
describe('isLicenseAllowed (property-based)', () => {
    it('allows a single licence only when the list names it', () => {
        fc.assert(
            fc.property(licenseArbitrary, allowedArbitrary, (license, allowed) => {
                expect(isLicenseAllowed(license, allowed)).toBe(allowed.includes(license));
            })
        );
    });

    it('allows a choice of two licences when the list names either', () => {
        fc.assert(
            fc.property(licenseArbitrary, licenseArbitrary, allowedArbitrary, (first, second, allowed) => {
                expect(isLicenseAllowed(`${first} OR ${second}`, allowed)).toBe(allowed.includes(first) || allowed.includes(second));
            })
        );
    });

    it('allows two licences that both apply only when the list names both', () => {
        fc.assert(
            fc.property(licenseArbitrary, licenseArbitrary, allowedArbitrary, (first, second, allowed) => {
                expect(isLicenseAllowed(`${first} AND ${second}`, allowed)).toBe(allowed.includes(first) && allowed.includes(second));
            })
        );
    });

    it("reads Cargo's older slash form as a choice", () => {
        fc.assert(
            fc.property(licenseArbitrary, licenseArbitrary, allowedArbitrary, (first, second, allowed) => {
                expect(isLicenseAllowed(`${first}/${second}`, allowed)).toBe(isLicenseAllowed(`${first} OR ${second}`, allowed));
            })
        );
    });

    it('never allows text that is not a licence expression', () => {
        fc.assert(
            fc.property(fc.string(), allowedArbitrary, (text, allowed) => {
                fc.pre(LICENSE_IDENTIFIERS.every((identifier) => !text.includes(identifier)));

                expect(isLicenseAllowed(text, allowed)).toBe(false);
            })
        );
    });
});
