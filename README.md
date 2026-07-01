# DPUse Development

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![npm version](https://img.shields.io/npm/v/@dpuse/dpuse-development.svg)](https://www.npmjs.com/package/@dpuse/dpuse-development)
[![CodeQL](https://github.com/dpuse/dpuse-development/actions/workflows/codeql.yml/badge.svg)](https://github.com/dpuse/dpuse-development/actions/workflows/codeql.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dpuse_dpuse-development&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-development)
[![CI](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml/badge.svg)](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml)

## Introduction

<!-- SUMMARY_START -->

Actions for managing DPUse projects.

<!-- SUMMARY_END -->

## Installation

> [!WARNING]
> This project is currently published to npm, but is not designed for general use. It is custom built for the DPUse CI/CD process. You are welcome to clone and customise it for your own purposes, but you will need to adapt it to your own project structure and tooling.

## DPUse Projects

Entry/top level projects...

| Name   | Description                     |
| ------ | ------------------------------- |
| app    | Frontend or client application. |
| api    | Backend API.                    |
| engine |                                 |
| shared |                                 |

Plugin project groupings...

| Name       | Description                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| connectors | Connections...                                                                                                                  |
| contexts   | Areas,Models... Dimensions, Entities, Secondary Measures... Hierarchies, Levels... Characteristics, Events, Primary Measures... |
| presenters | Presentations...                                                                                                                |
| cookbooks  | Recipes...                                                                                                                      |
| tools      |                                                                                                                                 |

Support projects...

| Name        | Description                               |
| ----------- | ----------------------------------------- |
| development | This package.                             |
| kb          | Knowledge content and deployment scripts. |
| resources   | Sample data and deployment scripts.       |

## Actions

The package implements the following actions:

| Name                  | Notes                                                                                                                                                                                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| auditDependencies     | Audit the project's dependencies for known security vulnerabilities. uses the owasp-dependency-check module to perform the checks. Updates the OWASP badge(s) at the top of this page. Also runs the 'npm outdated`command.                                                                                        |
| buildDirectoryIndex   | Build an index for the specified directory path.                                                                                                                                                                                                                                                                   |
| buildProject          | Builds the package using Vite. Output to '/dist' directory. Wrangler for api. Nuxt for app-nuxt. Builds bundle analysis reports.                                                                                                                                                                                   |
| checkDependencies     | Identifies outdated dependencies using npm `outdated` and `npm-check-updates` with option to automatically install latest versions.                                                                                                                                                                                |
| documentDependencies  | Identify licenses of the project's production and peer dependencies. Updates the table in the **Dependency Licenses** section of this page and summary files licenses.json and licenseTree.json in th licenses directory of this repository. Also downloads a copy of dependency license to `licenses/downloads'.. |
| formatCode            | Uses `prettier` to enforce formatting style rules.                                                                                                                                                                                                                                                                 |
| lintCode              | Uses `eslint` to check the code for potential errors and enforces coding style rules.                                                                                                                                                                                                                              |
| releaseProject        | Bump version, builds config, builds project, synchronise with `GitHub` and publish to `npm` or Cloudflare.                                                                                                                                                                                                         |
| syncProjectWithGitHub | Synchronise the local repository with the main GitHub repository.                                                                                                                                                                                                                                                  |
| testProject           | ❌ Not implemented.                                                                                                                                                                                                                                                                                                |

### Usage

All utilities are designed to be run from `package.json` scripts and assume that the project follows the standard DPUse directory structure and that it includes a `config.json` file in the root directory.

Please see other DPUse repositories for actual usage.

## Dependency Licenses

<!-- DEPENDENCY_LICENSES_START -->
> [!WARNING]
> Dependency licenses are not documented here: @dpuse/dpuse-development is a development-only tool and is never part of a production release
<!-- DEPENDENCY_LICENSES_END -->

### Dependency Tree

<!-- DEPENDENCY_TREE_START -->
> [!WARNING]
> Dependency licenses are not documented here: @dpuse/dpuse-development is a development-only tool and is never part of a production release
<!-- DEPENDENCY_TREE_END -->

## Bundle Analysis

The Bundle Analysis Reports provide detailed breakdowns of the bundle's composition and module sizes, helping to identify which modules contribute most to the final build. Two complementary reports are generated automatically on each release:

- **[rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer/tree/master)** — generates a static treemap/sunburst view based on pre-build module estimates, useful for a quick visual scan of overall bundle composition, including CSS assets.
- **[Sonda](https://sonda.dev/)** — analyses final source maps to capture the effects of tree-shaking and minification, rather than relying on pre-build estimates. This gives a more accurate picture of what's actually shipped, traces module-level dependencies, and shows the size of each module after tree-shaking and minification for more precise insight into what's driving bundle size. Note: Sonda's Vite reports currently exclude CSS files, since Vite does not generate source maps for CSS.

[View the rollup-plugin-visualizer Report](https://dpuse.github.io/dpuse-connector-file-store-emulator/bundle-analysis-reports/rollup-visualiser/index.html).

[View the Sonda Report](https://dpuse.github.io/dpuse-connector-file-store-emulator/bundle-analysis-reports/sonda/index.html).

<!-- BUNDLE_START -->

|Chunk/Module/File|Composition|
|:------ |:-----------|
| dpuse-development.es.js | 299.2 kB · gz 74.6 kB · br 59.6 kB |
| &nbsp;&nbsp;&nbsp;&nbsp;acorn → dist/acorn.mjs | `██████████░░░░░░░░░░` 49.4% |
| &nbsp;&nbsp;&nbsp;&nbsp;acorn-typescript → lib/index.mjs | `███████░░░░░░░░░░░░░` 35.5% |
| &nbsp;&nbsp;&nbsp;&nbsp;src | `██░░░░░░░░░░░░░░░░░░` 10.7% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;manageProject.ts | `█░░░░░░░░░░░░░░░░░░░` 2.8% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentBundleSizes.ts | `░░░░░░░░░░░░░░░░░░░░` 2.0% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentDependencies.ts | `░░░░░░░░░░░░░░░░░░░░` 1.9% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;index.ts | `░░░░░░░░░░░░░░░░░░░░` 1.9% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cloudflare.ts | `░░░░░░░░░░░░░░░░░░░░` 0.8% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;checkConfigFiles.ts | `░░░░░░░░░░░░░░░░░░░░` 0.6% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;checkDependencies.ts | `░░░░░░░░░░░░░░░░░░░░` 0.2% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;documentActions.ts | `░░░░░░░░░░░░░░░░░░░░` 0.2% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;formatCode.ts | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;auditDependencies.ts | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lintCode.ts | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;@dpuse/dpuse-shared | `█░░░░░░░░░░░░░░░░░░░` 4.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/componentConfig.schema-dBVLwQIt.js | `█░░░░░░░░░░░░░░░░░░░` 3.2% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/dpuse-shared-componentModuleConnector.es.js | `░░░░░░░░░░░░░░░░░░░░` 0.6% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/dpuse-shared-componentModuleContext.es.js | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/dpuse-shared-locale.es.js | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/dpuse-shared-componentModulePresenter.es.js | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist/moduleConfig.schema-CUHmgYLu.js | `░░░░░░░░░░░░░░░░░░░░` 0.1% |
| &nbsp;&nbsp;&nbsp;&nbsp;valibot → dist/index.mjs | `░░░░░░░░░░░░░░░░░░░░` 0.2% |
| &nbsp;&nbsp;&nbsp;&nbsp;(runtime) → rolldown/runtime.js | `░░░░░░░░░░░░░░░░░░░░` 0.1% |

<!-- BUNDLE_END -->

## Security & Quality

### CodeQL

[CodeQL](https://github.com/dpuse/dpuse-development/security/code-scanning) static analysis runs on every push to `main` and on a weekly schedule, scanning TypeScript, JavaScript, Rust, and GitHub Actions workflow files for security vulnerabilities and coding errors.

### SonarCloud

[SonarCloud](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse_development) performs continuous code quality and security analysis on every push, detecting bugs, code smells, and security vulnerabilities in the TypeScript source.

### Vulnerability Scanning

Two complementary tools continuously monitor dependencies for known vulnerabilities:

- **[GitHub Dependabot](https://docs.github.com/en/code-security/dependabot)** automatically raises pull requests to update vulnerable dependencies, drawing on the GitHub Advisory Database which combines NVD and npm-specific advisories.
- **npm audit** runs on every push to `main` via the CI workflow, failing the build if any high or critical severity vulnerabilities are detected.

### Supply Chain Security

[Socket.dev](https://socket.dev) monitors all dependencies for supply chain risk — detecting malicious packages, dependency confusion, typosquatting, and suspicious behaviour that may not yet have a CVE.

### Reporting Vulnerabilities

Please do not open public GitHub issues for security vulnerabilities. Use [GitHub private vulnerability reporting](https://github.com/dpuse/dpuse-development/security/advisories/new) instead. See [SECURITY.md](./SECURITY.md) for the full disclosure policy, contact details, and expected response times.

### OpenSSF 🚧

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/dpuse/dpuse-development/badge)](https://scorecard.dev/viewer/?uri=github.com/dpuse/dpuse-development)

This project is working towards the [OpenSSF Best Practices](https://www.bestpractices.dev) Passing badge, a self-certification covering security policy, vulnerability reporting, build processes, code quality, and more. The [OpenSSF Scorecard](https://scorecard.dev/viewer/?uri=github.com/dpuse/dpuse-development) provides an independent automated assessment of the project's security practices and is an ongoing area of improvement.

## Contributing

This repository is maintained solely by its owner and does not accept external contributions. It is part of a larger closed application suite and is published for informational and cloning purposes only.

If you find a security vulnerability, see [Reporting Vulnerabilities](#reporting-vulnerabilities). For bugs, inconsistencies, or other feedback, you are welcome to [open a GitHub issue](https://github.com/dpuse/dpuse-development/issues) — feedback is read, but responses and fixes are at the maintainer's discretion.

## License

This project is licensed under the MIT License, permitting free use, modification, and distribution.

[MIT](./LICENSE) © 2026-present Jonathan Terrell
