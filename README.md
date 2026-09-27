# DPUse Development

<!-- OPENING_START -->

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![DPUse version](https://img.shields.io/github/v/release/dpuse/dpuse-development?color=f6821f&label=DPUse)](https://github.com/dpuse/dpuse-development/releases/latest)
[![CI](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml/badge.svg)](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml)
[![CodeQL](https://github.com/dpuse/dpuse-development/actions/workflows/codeql.yml/badge.svg)](https://github.com/dpuse/dpuse-development/actions/workflows/codeql.yml)
[![Fallow code health](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdpuse%2Fdpuse-development%2Fmain%2Fcode-health-reports%2Ffallow%2Fbadge.json)](./code-health-reports/fallow/index.md)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dpuse_dpuse-development&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-development)

[Documentation](https://www.dpuse.app) · [Report a Vulnerability](https://github.com/dpuse/dpuse-development/security/advisories/new) · [Open an Issue](https://github.com/dpuse/dpuse-development/issues)

## About DPUse

DPUse (Data Positioning & Use) is an in-browser application that positions your data for use through three core activities: sourcing, contextualising, and publishing.

**Sourcing** uses a library of [Connectors](https://www.dpuse.app/connectors) to establish [Connections](https://www.dpuse.app) to applications, databases, file stores, and curated datasets; these connections are subsequently used to configure structured [Data Views](https://www.dpuse.app) from the underlying sources.

**Contextualising** extracts chronological events from those [Data Views](https://www.dpuse.app) and maps them into comprehensive [Context Models](https://www.dpuse.app). This gives the DPUse Engine the structural framework needed to generate deterministic transactions, facts, or observations.

**Publishing** uses a library of [Presenters](https://www.dpuse.app) to render standard [Presentations](https://www.dpuse.app) immediately using the contextualised data; additionally, [Cookbooks](https://www.dpuse.app) of [Recipes](https://www.dpuse.app) let you build Data Apps using your preferred tools.

In addition, DPUse provides [Tools](https://www.dpuse.app) used by the application, and you can use them to construct connectors and presenters.

## Introduction

Actions for managing DPUse projects.

<!-- OPENING_END -->

<!-- USAGE_START -->

## Usage

This package is published to the [public npm registry](https://www.npmjs.com/package/@dpuse/dpuse-development). Install it with:

```bash
npm install @dpuse/dpuse-development
```

> [!WARNING]
> This project is currently published to npm, but is not designed for general use. It is custom built for the DPUse CI/CD process. You are welcome to clone and customise it for your own purposes, but you will need to adapt it to your own project structure and tooling.

To work on the source instead, clone this repository. Cloned or forked code is unsupported and isn't guaranteed to remain compatible with the DPUse Engine as it evolves.

```bash
git clone https://github.com/dpuse/dpuse-development.git
cd dpuse-development
npm install
```

_Requires [Node.js](https://nodejs.org/) 24 or later, [npm](https://www.npmjs.com/) 12 or later, and [TypeScript](https://www.typescriptlang.org/) 6.0.3 or later._

This repository provides these commands to every DPUse project, and uses them itself:

|Command|What it does|
|:-|:-|
|`npm run build`|Builds the project.|
|`npm test`|Runs the tests.|
|`npm run test:coverage`|Runs the unit tests and measures coverage.|
|`npm run lint`|Checks the code with ESLint.|
|`npm run format`|Formats the code with Prettier.|
|`npm run audit`|Checks dependencies for known vulnerabilities with npm audit.|
|`npm run check`|Checks configuration files against the DPUse templates and lists outdated dependencies.|
|`npm run document`|Regenerates the README's generated sections.|
|`npm run documentOpening`|Regenerates the README's opening section.|
|`npm run documentUsage`|Regenerates the README's Usage section.|
|`npm run documentDependencies`|Regenerates the README's dependency licence report.|
|`npm run documentBundleSizes`|Regenerates the README's bundle size report.|
|`npm run documentGovernance`|Regenerates the README's Quality & Security, Contributing and License sections.|
|`npm run sync`|Bumps the version, then commits and pushes to GitHub.|
|`npm run release`|Bumps the version, commits and pushes, and creates a GitHub release.|

<!-- USAGE_END -->

## Architecture

The package implements the following actions:

| Name                  | Notes                                                                                                                                                                                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| auditDependencies     | Audit the project's dependencies for known security vulnerabilities. uses the owasp-dependency-check module to perform the checks. Updates the OWASP badge(s) at the top of this page. Also runs the 'npm outdated`command.                                                                                        |
| checkConfigFiles      |                                                                                                                                                                                                                                                                                                                    |
| checkDependencies     | Identifies outdated dependencies using npm `outdated` and `npm-check-updates` with option to automatically install latest versions.                                                                                                                                                                                |
| documentBundleSizes   |                                                                                                                                                                                                                                                                                                                    |
| documentDependencies  | Identify licenses of the project's production and peer dependencies. Updates the table in the **Dependency Licenses** section of this page and summary files licenses.json and licenseTree.json in th licenses directory of this repository. Also downloads a copy of dependency license to `licenses/downloads'.. |
| documentGovernance    |                                                                                                                                                                                                                                                                                                                    |
| documentActions       |                                                                                                                                                                                                                                                                                                                    |
| documentOpening       |                                                                                                                                                                                                                                                                                                                    |
| documentUsage         |                                                                                                                                                                                                                                                                                                                    |
| formatCode            | Uses `prettier` to enforce formatting style rules.                                                                                                                                                                                                                                                                 |
| lintCode              | Uses `eslint` to check the code for potential errors and enforces coding style rules.                                                                                                                                                                                                                              |
| uploadDirectoryToR2   |                                                                                                                                                                                                                                                                                                                    |
| buildProject          | Builds the package using Vite. Output to '/dist' directory. Wrangler for api. Nuxt for app-nuxt. Builds bundle analysis reports.                                                                                                                                                                                   |
| publishProject        |                                                                                                                                                                                                                                                                                                                    |
| releaseProject        | Bump version, builds config, builds project, synchronise with `GitHub` and publish to `npm` or Cloudflare.                                                                                                                                                                                                         |
| syncProjectWithGitHub | Synchronise the local repository with the main GitHub repository.                                                                                                                                                                                                                                                  |
| testProject           |                                                                                                                                                                                                                                                                                                                    |

All actions are designed to be run from `package.json` scripts and assume that the project follows the standard DPUse directory structure and that it includes a `config.json` file in the root directory.

<!-- DEPENDENCY_LICENSES_START -->

## Dependency Licenses

> [!WARNING]
> Dependency licenses are not documented here: @dpuse/dpuse-development is a development-only tool and is never part of a production release.

<!-- DEPENDENCY_LICENSES_END -->

<!-- BUNDLE_START -->

## Bundle Analysis

This report is updated each time the project is built, using [Sonda](https://sonda.dev/), which analyses final source maps to reveal the actual effects of tree-shaking and minification rather than relying on pre-build estimates.

_Note: Sonda's Vite reports currently exclude CSS files, since Vite does not generate source maps for CSS._

|Chunk/Module/File|Composition|
|:------ |:-----------|
| dist/dpuse-development.es.js | 323.7 kB · gzip 83.3 kB |
| &nbsp;&nbsp;&nbsp;&nbsp;acorn → dist/acorn.mjs | `████████░░░░░░░░░░░░` 40.4% |
| &nbsp;&nbsp;&nbsp;&nbsp;acorn-typescript → lib/index.mjs | `███████░░░░░░░░░░░░░` 35.4% |
| &nbsp;&nbsp;&nbsp;&nbsp;src | `███░░░░░░░░░░░░░░░░░` 13.8% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentGovernance.ts | `█░░░░░░░░░░░░░░░░░░░` 2.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentDependencies.ts | `░░░░░░░░░░░░░░░░░░░░` 1.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;manageProject.ts | `░░░░░░░░░░░░░░░░░░░░` 1.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;index.ts | `░░░░░░░░░░░░░░░░░░░░` 1.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentUsage.ts | `░░░░░░░░░░░░░░░░░░░░` 1.4% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentBundleSizes.ts | `░░░░░░░░░░░░░░░░░░░░` 1.3% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;checkConfigFiles.ts | `░░░░░░░░░░░░░░░░░░░░` 1.2% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentActions.ts | `░░░░░░░░░░░░░░░░░░░░` 0.5% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentOpening.ts | `░░░░░░░░░░░░░░░░░░░░` 0.5% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cloudflare.ts | `░░░░░░░░░░░░░░░░░░░░` 0.5% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;checkDependencies.ts | `░░░░░░░░░░░░░░░░░░░░` 0.5% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;formatCode.ts | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;auditDependencies.ts | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lintCode.ts | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `█░░░░░░░░░░░░░░░░░░░` 6.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;@dpuse/dpuse-shared | `█░░░░░░░░░░░░░░░░░░░` 3.5% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/componentConfig.schema-DT3mO5rS.js | `█░░░░░░░░░░░░░░░░░░░` 2.6% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/dpuse-shared-componentModuleConnector.es.js | `░░░░░░░░░░░░░░░░░░░░` 0.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/moduleConfig.schema-aYmFWSrn.js | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/dpuse-shared-componentModulePresenter.es.js | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;valibot → dist/index.mjs | `░░░░░░░░░░░░░░░░░░░░` 0.1% |

(bundler output, whitespace & JSON) = bytes Sonda can't trace to a source file: whitespace (indentation and line breaks), code the bundler generates (region comments, the combined import/export lines, its small runtime helper and wrappers), and imported JSON such as `config.json`, which the bundler doesn't map. The JSON and the generated code are real bytes that ship; the whitespace mostly disappears once compressed.

<!-- BUNDLE_END -->

<!-- GOVERNANCE_START -->

## Quality & Security

This section is updated each time `npm run document` is run. Settings come from the repository's workflow files and GitHub, and test coverage and the Fallow score are measured at the same time.

### Testing

|Check or setting|Status|What it does|
|:-|:-|:-|
|Unit tests|✅ On|Run in CI on every push to `main`.|
|Property-based tests|✅ fast-check|Fuzz testing: many random inputs per test to find edge cases, run with the unit tests.|
|Test coverage|✅ 99.6% of lines|Share of source lines the unit tests run. The target is 80%.|

### Code Quality

|Check or setting|Status|What it does|
|:-|:-|:-|
|[Fallow](./code-health-reports/fallow/index.md)|✅ A (87)|Unused code, duplication, complexity and dependency hygiene.|
|[SonarCloud](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-development)|✅ On|Code quality and security analysis on every push: bugs, code smells and vulnerabilities.|

### Security Analysis

|Check or setting|Status|What it does|
|:-|:-|:-|
|[CodeQL](https://github.com/dpuse/dpuse-development/security/code-scanning)|✅ GitHub Actions, JavaScript/TypeScript|Static analysis for security vulnerabilities, using the extended security queries, on every push and pull request to `main` and weekly.|
|Secret scanning|✅ On|Detects credentials, such as API keys and tokens, committed to the repository.|
|Push protection|✅ On|Blocks pushes that contain credentials.|

### Dependencies

|Check or setting|Status|What it does|
|:-|:-|:-|
|npm audit|✅ On|Fails CI when any dependency has a known vulnerability.|
|[Socket.dev](https://socket.dev)|✅ On|Flags supply chain risk in dependencies: malicious packages, typosquatting and suspicious behaviour that may not yet have a CVE.|
|Dependabot alerts|✅ On|Alerts when a dependency has a known vulnerability, using the GitHub Advisory Database.|
|Dependabot security updates|❌ Off|Opens pull requests that update vulnerable dependencies.|
|Dependabot version updates|❌ Off|Opens pull requests for new dependency versions.|

### OpenSSF 🚧

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/dpuse/dpuse-development/badge)](https://scorecard.dev/viewer/?uri=github.com/dpuse/dpuse-development)

This project is working towards the [OpenSSF Best Practices](https://www.bestpractices.dev) Passing badge, a self-certification covering security policy, vulnerability reporting, build processes, code quality, and more. Currently the [OpenSSF Scorecard](https://scorecard.dev) provides an independent automated assessment of the project's security practices and is an ongoing area of improvement.

> [!NOTE]
> Apart from the Best Practices badge above, the remaining Scorecard gaps need multi-person review or a pull-request workflow, which this solo-maintained project doesn't use.

### Reporting Vulnerabilities

Please do not open public GitHub issues for security vulnerabilities. Use [GitHub private vulnerability reporting](https://github.com/dpuse/dpuse-development/security/advisories/new) instead. See [SECURITY.md](./SECURITY.md) for the full disclosure policy, contact details, and expected response times.

## Contributing

This repository is maintained solely by its owner and does not, at present, accept external contributions into the canonical repo. Its source is published openly under the MIT License — every DPUse project is fully open source except DPUse Engine, which remains closed and proprietary.

For security vulnerabilities, see [Reporting Vulnerabilities](#reporting-vulnerabilities). For bugs, inconsistencies, or other feedback, [open a GitHub issue](https://github.com/dpuse/dpuse-development/issues) — feedback is read, but responses and fixes are at the maintainer's discretion.

## License

This project is licensed under the MIT License, permitting free use, modification, and distribution.

[MIT](./LICENSE) © 2026 Jonathan Terrell

<!-- GOVERNANCE_END -->
