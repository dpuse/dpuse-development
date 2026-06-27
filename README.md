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

Install as a development dependency:

```bash
cd dpuse-development
npm install --save-dev @dpuse/dpuse-development
```

> See the Data Positioning security documentation for additional initialization requirements.

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

| Name                    | Notes                                                                                                                                                                                                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| auditDependencies       | Audit the project's dependencies for known security vulnerabilities. uses the owasp-dependency-check module to perform the checks. Updates the OWASP badge(s) at the top of this page. Also runs the 'npm outdated`command.                                                                                        |
| buildDirectoryIndex     | Build an index for the specified directory path.                                                                                                                                                                                                                                                                   |
| buildProject            | Builds the package using Vite. Output to '/dist' directory. Wrangler for api. Nuxt for app-nuxt. Builds bundle analysis reports.                                                                                                                                                                                   |
| checkDependencies       | Identifies outdated dependencies using npm `outdated` and `npm-check-updates` with option to automatically install latest versions.                                                                                                                                                                                |
| documentDependencies    | Identify licenses of the project's production and peer dependencies. Updates the table in the **Dependency Licenses** section of this page and summary files licenses.json and licenseTree.json in th licenses directory of this repository. Also downloads a copy of dependency license to `licenses/downloads'.. |
| formatCode              | Uses `prettier` to enforce formatting style rules.                                                                                                                                                                                                                                                                 |
| lintCode                | Uses `eslint` to check the code for potential errors and enforces coding style rules.                                                                                                                                                                                                                              |
| releaseProject          | Bump version, builds config, builds project, synchronise with `GitHub` and publish to `npm` or Cloudflare.                                                                                                                                                                                                         |
| syncProjectWithGitHub   | Synchronise the local repository with the main GitHub repository.                                                                                                                                                                                                                                                  |
| testProject             | ❌ Not implemented.                                                                                                                                                                                                                                                                                                |
| updateDPUseDependencies | Install the latest version of the specified Data Positioning dependencies.                                                                                                                                                                                                                                         |

### Usage

All utilities are designed to be run from `package.json` scripts and assume that the project follows the standard Data Positioning directory structure and that it includes a `config.json` file in the root directory.

```json
{
    ...
    "scripts": {
        "audit": "node -e \"import('@dpuse/dpuse-development').then(m => m.auditDependencies())\"",
        "build": "node -e \"import('@dpuse/dpuse-development').then(m => m.buildProject())\"",
        "check": "node -e \"import('@dpuse/dpuse-development').then(m => m.checkDependencies())\"",
        "document": "node -e \"import('@dpuse/dpuse-development').then(m => m.documentDependencies(['MIT']))\"",
        "format": "node -e \"import('@dpuse/dpuse-development').then(m => m.formatCode())\"",
        "lint": "node -e \"import('@dpuse/dpuse-development').then(m => m.lintCode())\"",
        "release": "node -e \"import('@dpuse/dpuse-development').then(m => m.releaseProject())\"",
        "sync": "node -e \"import('@dpuse/dpuse-development').then(m => m.syncProjectWithGitHub())\"",
        "test": "node -e \"import('@dpuse/dpuse-development').then(m => m.testProject())\"",
        "update": "node -e \"import('@dpuse/dpuse-development').then(m => m.updateDPUseDependencies(['development']))\""
    }
    ...
}
```

## Resources

Common resources (files) used across Data Positioning projects.

| Name                                          | File                                                                 |
| --------------------------------------------- | -------------------------------------------------------------------- |
| ESLint rules \*                               | [eslint.config.ts](eslint.config.ts)                                 |
| Git path attributes                           | [.gitattributes](.gitattributes)                                     |
| Git ignore rules for published repositories   | [resources/.gitignore_PUBLISHED](resources/.gitignore_PUBLISHED)     |
| Git ignore rules for unpublished repositories | [resources/.gitignore_UNPUBLISHED](resources/.gitignore_UNPUBLISHED) |
| LICENSE                                       | [LICENSE](LICENSE)                                                   |
| Markdown lint rules                           | [.markdownlint.json](.markdownlint.json)                             |
| VS Code key bindings                          | [resources/vsCodeKeyBindings.json](resources/vsCodeKeyBindings.json) |

## Dependency Licenses

License data is collected automatically on each release using [license-checker](https://github.com/RSeidelsohn/license-checker-rseidelsohn). The following table lists all production dependencies. These dependencies (including transitive ones) have been checked and confirmed to use Apache-2.0, BSD-3-Clause, CC0-1.0, or MIT — all permissive, commercially-friendly licenses. Developers cloning this repository should independently verify development dependencies; users of the uploaded library are covered by these checks.

<!-- DEPENDENCY_LICENSES_START -->

| Name                                                             | Version | License(s) | Document                                                              |
| ---------------------------------------------------------------- | :-----: | ---------- | --------------------------------------------------------------------- |
| [@dpuse/dpuse-shared](https://github.com/dpuse/dpuse-shared)     | 0.3.689 | MIT        | [LICENSE](licenses/downloads/@dpuse/dpuse-shared@0.3.689-LICENSE.txt) |
| [acorn-typescript](https://github.com/TyrealHu/acorn-typescript) | 1.4.13  | MIT        | [LICENSE](licenses/downloads/acorn-typescript@1.4.13-LICENSE.txt)     |
| [acorn-walk](https://github.com/acornjs/acorn)                   |  8.3.5  | MIT        | [LICENSE](licenses/downloads/acorn-walk@8.3.5-LICENSE.txt)            |
| [acorn](https://github.com/acornjs/acorn)                        | 8.17.0  | MIT        | [LICENSE](licenses/downloads/acorn@8.17.0-LICENSE.txt)                |
| [nanoid](https://github.com/ai/nanoid)                           | 5.1.16  | MIT        | [LICENSE](licenses/downloads/nanoid@5.1.16-LICENSE.txt)               |
| [typescript](https://github.com/microsoft/TypeScript)            |  6.0.3  | Apache-2.0 | [LICENSE](licenses/downloads/typescript@6.0.3-LICENSE.txt)            |
| [valibot](https://github.com/open-circle/valibot)                |  1.4.1  | MIT        | [LICENSE](licenses/downloads/valibot@1.4.1-LICENSE.txt)               |

<!-- DEPENDENCY_LICENSES_END -->

### Dependency Tree

The dependency tree below lists every package in this project — direct and transitive — along with its installed version, release date, and update status. Packages flagged ❗ have a newer version available; ⚠️ indicates a package that hasn't been updated in the last 6 months or longer. Neither flag necessarily indicates a problem: we let new releases stabilise before upgrading, and some packages are simply mature and stable, requiring no active development.

<!-- DEPENDENCY_TREE_START -->

- **[@dpuse/dpuse-shared](https://github.com/dpuse/dpuse-shared)** 0.3.689 — this month: 2026-06-26
- **[acorn-typescript](https://github.com/TyrealHu/acorn-typescript)** 1.4.13 — 29 months ago: 2024-01-03 ⚠️
    - **[acorn](https://github.com/acornjs/acorn)** 8.17.0 — this month: 2026-06-11
- **[acorn-walk](https://github.com/acornjs/acorn)** 8.3.5 — 4 months ago: 2026-02-19
    - **[acorn](https://github.com/acornjs/acorn)** 8.17.0 — this month: 2026-06-11
- **[acorn](https://github.com/acornjs/acorn)** 8.17.0 — this month: 2026-06-11
- **[nanoid](https://github.com/ai/nanoid)** 5.1.16 — this month: 2026-06-24
- **[valibot](https://github.com/open-circle/valibot)** 1.4.1 — 1 month ago: 2026-05-24
    - **[typescript](https://github.com/microsoft/TypeScript)** 6.0.3 — 2 months ago: 2026-04-16
      <!-- DEPENDENCY_TREE_END -->

## Bundle Analysis

The Bundle Analysis Reports provide detailed breakdowns of the bundle's composition and module sizes, helping to identify which modules contribute most to the final build. Two complementary reports are generated automatically on each release:

- **[rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer/tree/master)** — generates a static treemap/sunburst view based on pre-build module estimates, useful for a quick visual scan of overall bundle composition, including CSS assets.
- **[Sonda](https://sonda.dev/)** — analyses final source maps to capture the effects of tree-shaking and minification, rather than relying on pre-build estimates. This gives a more accurate picture of what's actually shipped, traces module-level dependencies, and shows the size of each module after tree-shaking and minification for more precise insight into what's driving bundle size. Note: Sonda's Vite reports currently exclude CSS files, since Vite does not generate source maps for CSS.

[View the rollup-plugin-visualizer Report](https://dpuse.github.io/dpuse-connector-file-store-emulator/bundle-analysis-reports/rollup-visualiser/index.html).

[View the Sonda Report](https://dpuse.github.io/dpuse-connector-file-store-emulator/bundle-analysis-reports/sonda/index.html).

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
