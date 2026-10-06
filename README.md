# DPUse Development

<!-- OPENING_START -->

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![npm version](https://img.shields.io/npm/v/@dpuse/dpuse-development?color=cb3837&label=npm)](https://www.npmjs.com/package/@dpuse/dpuse-development)
[![CI](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml/badge.svg)](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml)

Actions for managing DPUse projects.

[Report a Vulnerability](https://github.com/dpuse/dpuse-development/security/advisories/new) · [Open an Issue](https://github.com/dpuse/dpuse-development/issues)

## About DPUse

[DPUse](https://www.dpuse.app) (Data Positioning & Use) is an in-browser application that positions your data for use through three core activities: sourcing, contextualising, and publishing.

**Sourcing** uses a library of [Connectors](https://www.dpuse.app/connectors) to establish [Connections](https://www.dpuse.app) to applications, databases, file stores, and curated datasets; these connections are subsequently used to configure structured [Data Views](https://www.dpuse.app) from the underlying sources.

**Contextualising** extracts chronological events from those [Data Views](https://www.dpuse.app) and maps them into comprehensive [Context Models](https://www.dpuse.app). This gives the DPUse Engine the structural framework needed to generate deterministic transactions, facts, or observations.

**Publishing** uses a library of [Presenters](https://www.dpuse.app) to render standard [Presentations](https://www.dpuse.app) immediately using the contextualised data; additionally, [Cookbooks](https://www.dpuse.app) of [Recipes](https://www.dpuse.app) let you build Data Apps using your preferred tools.

In addition, DPUse provides [Tools](https://www.dpuse.app) used by the application, and you can use them to construct connectors and presenters.

## Introduction

The package implements a common set of actions used to manage DPUse repositories. All actions are designed to be run from `package.json` scripts and assume that the project follows the standard DPUse directory structure and that it includes a `config.json` file in the root directory. See [API Reference](https://github.com/dpuse/dpuse-development/blob/main/API_REFERENCE.md).

<!-- OPENING_END -->

<!-- USAGE_START -->

## Usage

This [package](https://www.npmjs.com/package/@dpuse/dpuse-development) is available on [npm](https://www.npmjs.com/). Install it with:

```bash
npm install @dpuse/dpuse-development
```

> [!WARNING]
> This project is not designed for general use. It is custom built for the DPUse CI/CD process. You are welcome to clone and customise it for your own purposes, but you will need to adapt it to your own project structure and tooling.

To work on the source instead, clone this repository.

```bash
git clone https://github.com/dpuse/dpuse-development.git
cd dpuse-development
npm install
```

_Requires [Node.js](https://nodejs.org/) 24 or later, [npm](https://www.npmjs.com/) 12 or later, and [TypeScript](https://www.typescriptlang.org/) 6.0.3 or later._

This repository manages itself using the actions it implements. See the `scripts` block in [package.json](https://github.com/dpuse/dpuse-development/blob/main/package.json) for details.

<!-- USAGE_END -->

## API Reference

See [API_REFERENCE.md](./API_REFERENCE.md) for the complete API reference, including every exported action and type.

<!-- DEPENDENCY_LICENSES_START -->

## Dependency Licenses

> [!WARNING]
> Dependency licenses are not documented here: @dpuse/dpuse-development is a development-only tool and is never part of a production release.

<!-- DEPENDENCY_LICENSES_END -->

<!-- BUNDLE_START -->

## Bundle Analysis

This report is updated with each release, from the bundle the release builds, using [Sonda](https://sonda.dev/), which analyses final source maps to reveal the actual effects of tree-shaking and minification rather than relying on pre-build estimates.

_Note: Sonda's Vite reports currently exclude CSS files, since Vite does not generate source maps for CSS._

| Chunk/Module/File                                                                | Composition                                 |
| :------------------------------------------------------------------------------- | :------------------------------------------ |
| **dist/dpuse-development.es.js**                                                 | 64.0 kB · gzip 20.5 kB · 65.2% of the build |
| &nbsp;&nbsp;&nbsp;&nbsp;src                                                      | `██████████████████░░` 88.1% · 56.4 kB      |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentDependencies.ts        | `▒▒▒▒░░░░░░░░░░░░░░░░` 17.8% · 11.4 kB      |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentQualitySecurity.ts     | `▒▒▒░░░░░░░░░░░░░░░░░` 15.5% · 9.9 kB       |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentBundleSizes.ts         | `▒▒▒░░░░░░░░░░░░░░░░░` 12.9% · 8.2 kB       |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ checkConfigFiles.ts            | `▒░░░░░░░░░░░░░░░░░░░` 5.9% · 3.8 kB        |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ rustCrates.ts                  | `▒░░░░░░░░░░░░░░░░░░░` 5.4% · 3.4 kB        |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ cloudflare.ts                  | `▒░░░░░░░░░░░░░░░░░░░` 4.4% · 2.8 kB        |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentUsage.ts               | `▒░░░░░░░░░░░░░░░░░░░` 4.2% · 2.7 kB        |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ auditDependencies.ts           | `▒░░░░░░░░░░░░░░░░░░░` 3.1% · 2.0 kB        |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ checkDependencies.ts           | `▒░░░░░░░░░░░░░░░░░░░` 2.8% · 1.8 kB        |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentActions.ts             | `▒░░░░░░░░░░░░░░░░░░░` 2.7% · 1.8 kB        |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentOpening.ts             | `▒░░░░░░░░░░░░░░░░░░░` 2.7% · 1.7 kB        |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentContributingLicense.ts | `░░░░░░░░░░░░░░░░░░░░` 1.9% · 1.2 kB        |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ publishProject.ts              | `░░░░░░░░░░░░░░░░░░░░` 1.7% · 1.1 kB        |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ releaseProject.ts              | `░░░░░░░░░░░░░░░░░░░░` 1.5% · 972 B         |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ testProject.ts                 | `░░░░░░░░░░░░░░░░░░░░` 1.2% · 799 B         |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ 8 smaller files                | `▒░░░░░░░░░░░░░░░░░░░` 4.4% · 2.8 kB        |
| &nbsp;&nbsp;&nbsp;&nbsp;(inlined worker)                                         | `░░░░░░░░░░░░░░░░░░░░` 0.0% · 17 B          |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON)                      | `██░░░░░░░░░░░░░░░░░░` 11.9% · 7.6 kB       |
| **dist/utilities-CjhO3pxf.js**                                                   | 23.1 kB · gzip 6.4 kB · 23.6% of the build  |
| &nbsp;&nbsp;&nbsp;&nbsp;@dpuse/dpuse-shared → dist/dpuse-shared.es.js            | `██████████░░░░░░░░░░` 50.8% · 11.8 kB      |
| &nbsp;&nbsp;&nbsp;&nbsp;src → index.ts                                           | `███████░░░░░░░░░░░░░` 35.8% · 8.3 kB       |
| &nbsp;&nbsp;&nbsp;&nbsp;valibot → dist/index.mjs                                 | `░░░░░░░░░░░░░░░░░░░░` 1.7% · 413 B         |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON)                      | `██░░░░░░░░░░░░░░░░░░` 11.6% · 2.7 kB       |
| **dist/apiReference-D4xooSV0.js**                                                | 8.5 kB · gzip 3.1 kB · 8.6% of the build    |
| &nbsp;&nbsp;&nbsp;&nbsp;src → apiReference.ts                                    | `███████████████████░` 95.1% · 8.0 kB       |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON)                      | `█░░░░░░░░░░░░░░░░░░░` 4.9% · 427 B         |
| **dist/vite.es.js**                                                              | 2.5 kB · gzip 1.1 kB · 2.6% of the build    |
| &nbsp;&nbsp;&nbsp;&nbsp;src → vite.ts                                            | `█████████████████░░░` 87.0% · 2.2 kB       |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON)                      | `███░░░░░░░░░░░░░░░░░` 13.0% · 334 B        |

Bars show each row's share of its output file. ↳ rows are part of the row above.

(inlined worker) = a Web Worker built separately and embedded in its output file as text. Where the build records what it contains, its rows list that; any few bytes over are the escaping needed to embed it.

(bundler output, whitespace & JSON) = bytes Sonda can't trace to a source file: whitespace (indentation and line breaks), code the bundler generates (region comments, the combined import/export lines, its small runtime helper and wrappers), and imported JSON such as `config.json`, which the bundler doesn't map. The JSON and the generated code are real bytes that ship; the whitespace mostly disappears once compressed.

<!-- BUNDLE_END -->

<!-- QUALITY_SECURITY_START -->

## Quality & Security

This section is updated each time `npm run document` is run. Settings come from the repository's workflow files and GitHub. Test coverage and the Fallow score are measured at the same time.

### Testing

| Check                | Status | What it does                                                                                                                                                                                                                                                                                                |
| :------------------- | :----- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit tests           | ✅ On  | [Vitest](https://vitest.dev) runs the unit tests. Part of the [CI workflow](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml) on every push and pull request to `main`.                                                                                                                  |
| Property-based tests | ✅ On  | [fast-check](https://fast-check.dev) runs many random inputs per test to find edge cases, alongside the unit tests. Part of the [CI workflow](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml) on every push and pull request to `main`.                                                |
| Test coverage        | ✅ On  | ![Coverage](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdpuse%2Fdpuse-development%2Fmain%2Fcode-health-reports%2Fvitest%2Fbadge.json) [Vitest's V8 coverage](https://vitest.dev/guide/coverage) measures the share of source lines the unit tests run. The target is 80%. |

### Code Quality

| Check         | Status | What it does                                                                                                                                                                                                                                                                                                                                 |
| :------------ | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Code health   | ✅ On  | [![Fallow code health](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdpuse%2Fdpuse-development%2Fmain%2Fcode-health-reports%2Ffallow%2Fbadge.json)](./code-health-reports/fallow/index.md) [Fallow](https://github.com/fallow-rs/fallow) finds unused code, duplication, complexity and dependency problems. |
| Code analysis | ✅ On  | [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dpuse_dpuse-development&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-development) [SonarCloud](https://sonarcloud.io) checks every push for bugs, code smells and vulnerabilities.                                           |
| Linting       | ✅ On  | [ESLint](https://eslint.org) checks the code for errors and style problems. Part of the [CI workflow](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml) on every push and pull request to `main`.                                                                                                                         |

### Security Analysis

| Check           | Status | What it does                                                                                                                                                                                                                                                                                                                                                                 |
| :-------------- | :----- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Push protection | ✅ On  | [GitHub push protection](https://docs.github.com/en/code-security/secret-scanning/push-protection-for-repositories-and-organizations) blocks pushes that contain credentials.                                                                                                                                                                                                |
| Static analysis | ✅ On  | [![CodeQL](https://github.com/dpuse/dpuse-development/actions/workflows/codeql.yml/badge.svg)](https://github.com/dpuse/dpuse-development/security/code-scanning) [CodeQL](https://codeql.github.com) scans GitHub Actions and JavaScript/TypeScript for security vulnerabilities, using the extended security queries, on every push and pull request to `main` and weekly. |
| Secret scanning | ✅ On  | [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning) detects credentials, such as API keys and tokens, committed to the repository.                                                                                                                                                                                                            |

### Dependencies

| Check               | Status | What it does                                                                                                                                                                                                                                                                                                             |
| :------------------ | :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vulnerability audit | ✅ On  | [npm audit](https://docs.npmjs.com/cli/commands/npm-audit) fails when a shipped dependency has any known vulnerability, or a development dependency has a high or critical one. Part of the [CI workflow](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml) on every push and pull request to `main`. |
| Supply chain risk   | ✅ On  | [Socket](https://socket.dev) flags malicious packages, typosquatting and suspicious behaviour that may not yet have a CVE.                                                                                                                                                                                               |
| Security alerts     | ✅ On  | [Dependabot](https://docs.github.com/en/code-security/dependabot) alerts when a dependency has a known vulnerability, using the GitHub Advisory Database.                                                                                                                                                                |
| Security updates    | ❌ Off | [Dependabot](https://docs.github.com/en/code-security/dependabot) opens pull requests that update vulnerable dependencies. These are handled manually.                                                                                                                                                                   |
| Version updates     | ❌ Off | [Dependabot](https://docs.github.com/en/code-security/dependabot) opens pull requests for new dependency versions. These are handled manually.                                                                                                                                                                           |

### OpenSSF 🚧

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/dpuse/dpuse-development/badge)](https://scorecard.dev/viewer/?uri=github.com/dpuse/dpuse-development)

This project is working towards the [OpenSSF Best Practices](https://www.bestpractices.dev) Passing badge, a self-certification covering security policy, vulnerability reporting, build processes, code quality, and more. Currently the [OpenSSF Scorecard](https://scorecard.dev) provides an independent automated assessment of the project's security practices and is an ongoing area of improvement.

> [!NOTE]
> Apart from the Best Practices badge above, the remaining Scorecard gaps need multi-person review or a pull-request workflow, which this solo-maintained project doesn't use.

### Reporting Vulnerabilities

Please do not open public GitHub issues for security vulnerabilities. Use [GitHub private vulnerability reporting](https://github.com/dpuse/dpuse-development/security/advisories/new) instead. See [SECURITY.md](./SECURITY.md) for the full disclosure policy, contact details, and expected response times.

<!-- QUALITY_SECURITY_END -->

<!-- CONTRIBUTING_LICENSE_START -->

## Contributing

This repository is maintained solely by its owner and does not, at present, accept external contributions into the canonical repo. Its source is published openly under the MIT License — every DPUse project is fully open source except DPUse Engine, which remains closed and proprietary.

For security vulnerabilities, see [Reporting Vulnerabilities](#reporting-vulnerabilities). For bugs, inconsistencies, or other feedback, [open a GitHub issue](https://github.com/dpuse/dpuse-development/issues) — feedback is read, but responses and fixes are at the maintainer's discretion.

## License

This project is licensed under the MIT License, permitting free use, modification, and distribution.

[MIT](./LICENSE) © 2026 Jonathan Terrell

<!-- CONTRIBUTING_LICENSE_END -->
