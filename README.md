# DPUse Development

<!-- OPENING_START -->

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![DPUse version](https://img.shields.io/github/v/release/dpuse/dpuse-development?color=f6821f&label=DPUse)](https://github.com/dpuse/dpuse-development/releases/latest)
[![npm version](https://img.shields.io/npm/v/@dpuse/dpuse-development?color=cb3837&label=npm)](https://www.npmjs.com/package/@dpuse/dpuse-development)
[![CI](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml/badge.svg)](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml)

[DPUse](https://www.dpuse.app) · [Report a Vulnerability](https://github.com/dpuse/dpuse-development/security/advisories/new) · [Open an Issue](https://github.com/dpuse/dpuse-development/issues)

Actions for managing DPUse projects.

## About DPUse

DPUse (Data Positioning & Use) is an in-browser application that positions your data for use through three core activities: sourcing, contextualising, and publishing.

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

| Chunk/Module/File                                                                |                   Size | Composition                  |
| :------------------------------------------------------------------------------- | ---------------------: | :--------------------------- |
| **dist/dpuse-development.es.js**                                                 | 45.8 kB · gzip 14.7 kB | 59.8% of the build           |
| &nbsp;&nbsp;&nbsp;&nbsp;src                                                      |                39.7 kB | `█████████████████░░░` 86.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentQualitySecurity.ts     |                 9.9 kB | 24.9% of src                 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentDependencies.ts        |                 6.1 kB | 15.3% of src                 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentBundleSizes.ts         |                 4.2 kB | 10.7% of src                 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ checkConfigFiles.ts            |                 3.7 kB | 9.3% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentUsage.ts               |                 2.7 kB | 6.8% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentActions.ts             |                 1.7 kB | 4.4% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ checkDependencies.ts           |                 1.7 kB | 4.3% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ cloudflare.ts                  |                 1.5 kB | 3.9% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentOpening.ts             |                 1.5 kB | 3.7% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentContributingLicense.ts |                 1.2 kB | 3.1% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ releaseProject.ts              |                  969 B | 2.4% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ publishProject.ts              |                  894 B | 2.2% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ testProject.ts                 |                  799 B | 2.0% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentProject.ts             |                  663 B | 1.6% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ syncProjectWithGitHub.ts       |                  593 B | 1.5% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ auditDependencies.ts           |                  392 B | 1.0% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ buildProject.ts                |                  378 B | 0.9% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ formatCode.ts                  |                  315 B | 0.8% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ documentApiReference.ts        |                  308 B | 0.8% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ lintCode.ts                    |                  185 B | 0.5% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ checkProject.ts                |                   48 B | 0.1% of src                  |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON)                      |                 6.1 kB | `███░░░░░░░░░░░░░░░░░` 13.3% |
| **dist/utilities-Bo8LfncX.js**                                                   |  22.4 kB · gzip 6.2 kB | 29.2% of the build           |
| &nbsp;&nbsp;&nbsp;&nbsp;@dpuse/dpuse-shared → dist/dpuse-shared.es.js            |                11.8 kB | `██████████░░░░░░░░░░` 52.5% |
| &nbsp;&nbsp;&nbsp;&nbsp;src → index.ts                                           |                 7.6 kB | `███████░░░░░░░░░░░░░` 34.0% |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON)                      |                 2.6 kB | `██░░░░░░░░░░░░░░░░░░` 11.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;valibot → dist/index.mjs                                 |                  413 B | `░░░░░░░░░░░░░░░░░░░░` 1.8%  |
| **dist/apiReference-BazeHifT.js**                                                |   8.4 kB · gzip 3.1 kB | 11.0% of the build           |
| &nbsp;&nbsp;&nbsp;&nbsp;src → apiReference.ts                                    |                 8.0 kB | `███████████████████░` 95.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON)                      |                  422 B | `█░░░░░░░░░░░░░░░░░░░` 4.9%  |

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
