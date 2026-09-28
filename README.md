# DPUse Development

<!-- OPENING_START -->

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![DPUse version](https://img.shields.io/github/v/release/dpuse/dpuse-development?color=f6821f&label=DPUse)](https://github.com/dpuse/dpuse-development/releases/latest)
[![CI](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml/badge.svg)](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml)
[![CodeQL](https://github.com/dpuse/dpuse-development/actions/workflows/codeql.yml/badge.svg)](https://github.com/dpuse/dpuse-development/actions/workflows/codeql.yml)
[![Fallow code health](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdpuse%2Fdpuse-development%2Fmain%2Fcode-health-reports%2Ffallow%2Fbadge.json)](./code-health-reports/fallow/index.md)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dpuse_dpuse-development&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-development)

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

This repository uses its own actions to manage itself, and provides them to every other DPUse repository.

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

|Chunk/Module/File|Composition|
|:------ |:-----------|
| dist/dpuse-development.es.js | 331.3 kB · gzip 85.2 kB |
| &nbsp;&nbsp;&nbsp;&nbsp;acorn → dist/acorn.mjs | `████████░░░░░░░░░░░░` 39.5% |
| &nbsp;&nbsp;&nbsp;&nbsp;acorn-typescript → lib/index.mjs | `███████░░░░░░░░░░░░░` 34.6% |
| &nbsp;&nbsp;&nbsp;&nbsp;src | `███░░░░░░░░░░░░░░░░░` 15.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentQualitySecurity.ts | `░░░░░░░░░░░░░░░░░░░░` 2.5% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;index.ts | `░░░░░░░░░░░░░░░░░░░░` 2.4% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentApiReference.ts | `░░░░░░░░░░░░░░░░░░░░` 2.3% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentDependencies.ts | `░░░░░░░░░░░░░░░░░░░░` 1.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentBundleSizes.ts | `░░░░░░░░░░░░░░░░░░░░` 1.3% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;checkConfigFiles.ts | `░░░░░░░░░░░░░░░░░░░░` 1.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentUsage.ts | `░░░░░░░░░░░░░░░░░░░░` 0.8% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentActions.ts | `░░░░░░░░░░░░░░░░░░░░` 0.5% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentOpening.ts | `░░░░░░░░░░░░░░░░░░░░` 0.5% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cloudflare.ts | `░░░░░░░░░░░░░░░░░░░░` 0.5% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;checkDependencies.ts | `░░░░░░░░░░░░░░░░░░░░` 0.5% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentContributingLicense.ts | `░░░░░░░░░░░░░░░░░░░░` 0.4% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;releaseProject.ts | `░░░░░░░░░░░░░░░░░░░░` 0.3% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;testProject.ts | `░░░░░░░░░░░░░░░░░░░░` 0.3% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;publishProject.ts | `░░░░░░░░░░░░░░░░░░░░` 0.2% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentProject.ts | `░░░░░░░░░░░░░░░░░░░░` 0.2% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;syncProjectWithGitHub.ts | `░░░░░░░░░░░░░░░░░░░░` 0.2% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;formatCode.ts | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;auditDependencies.ts | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;buildProject.ts | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lintCode.ts | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;checkProject.ts | `░░░░░░░░░░░░░░░░░░░░` 0.0% |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `█░░░░░░░░░░░░░░░░░░░` 6.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;@dpuse/dpuse-shared | `█░░░░░░░░░░░░░░░░░░░` 3.4% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/componentConfig.schema-DT3mO5rS.js | `█░░░░░░░░░░░░░░░░░░░` 2.6% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/dpuse-shared-componentModuleConnector.es.js | `░░░░░░░░░░░░░░░░░░░░` 0.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/moduleConfig.schema-aYmFWSrn.js | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/dpuse-shared-componentModulePresenter.es.js | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;valibot → dist/index.mjs | `░░░░░░░░░░░░░░░░░░░░` 0.1% |

(bundler output, whitespace & JSON) = bytes Sonda can't trace to a source file: whitespace (indentation and line breaks), code the bundler generates (region comments, the combined import/export lines, its small runtime helper and wrappers), and imported JSON such as `config.json`, which the bundler doesn't map. The JSON and the generated code are real bytes that ship; the whitespace mostly disappears once compressed.

<!-- BUNDLE_END -->

<!-- QUALITY_SECURITY_START -->

## Quality & Security

This section is updated each time `npm run document` is run. Settings come from the repository's workflow files and GitHub, and test coverage and the Fallow score are measured at the same time.

### Testing

|Check or setting|Status|What it does|
|:-|:-|:-|
|Unit tests|✅ On|Run in CI on every push to `main`.|
|Property-based tests|✅ fast-check|Fuzz testing: many random inputs per test to find edge cases, run with the unit tests.|
|Test coverage|✅ 99.7% of lines|Share of source lines the unit tests run. The target is 80%.|

### Code Quality

|Check or setting|Status|What it does|
|:-|:-|:-|
|[Fallow](./code-health-reports/fallow/index.md)|✅ A (85)|Unused code, duplication, complexity and dependency hygiene.|
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

<!-- QUALITY_SECURITY_END -->

<!-- CONTRIBUTING_LICENSE_START -->

## Contributing

This repository is maintained solely by its owner and does not, at present, accept external contributions into the canonical repo. Its source is published openly under the MIT License — every DPUse project is fully open source except DPUse Engine, which remains closed and proprietary.

For security vulnerabilities, see [Reporting Vulnerabilities](#reporting-vulnerabilities). For bugs, inconsistencies, or other feedback, [open a GitHub issue](https://github.com/dpuse/dpuse-development/issues) — feedback is read, but responses and fixes are at the maintainer's discretion.

## License

This project is licensed under the MIT License, permitting free use, modification, and distribution.

[MIT](./LICENSE) © 2026 Jonathan Terrell

<!-- CONTRIBUTING_LICENSE_END -->
