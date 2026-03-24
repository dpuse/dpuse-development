# DPUse Development

[![npm version](https://img.shields.io/npm/v/@dpuse/dpuse-development.svg)](https://www.npmjs.com/package/@dpuse/dpuse-development)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dpuse_dpuse-development&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-development)
<span><!-- OWASP_BADGES_START -->
[![OWASP](https://img.shields.io/badge/OWASP-passed-4CAF50)](https://dpuse.github.io/dpuse-development/dependency-check-reports/dependency-check-report.html)
<!-- OWASP_BADGES_END --></span>

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

## Bundle Analysis Reports

The Bundle Analysis Report provides a detailed breakdown of the bundle’s composition and module sizes, helping identify which modules contribute most to the final build. It is generated automatically on each release using the `npm` package [rollup-plugin-visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer).

[View the Bundle Analysis Report](https://dpuse.github.io/dpuse-development/bundle-analysis-reports/rollup-visualiser/index.html) created by the **rollup visualiser** plugin.

[View the Bundle Analysis Report](https://dpuse.github.io/dpuse-development/bundle-analysis-reports/sonda/index.html) created by the **sonda** plugin.

## Dependency Check Report

The OWASP Dependency Check Report identifies known vulnerabilities in project dependencies. It is generated automatically on each release using the `npm` package [owasp-dependency-check](https://dependency-check.github.io/DependencyCheck/index.html).

[View the OWASP Dependency Check Report](https://dpuse.github.io/dpuse-development/dependency-check-reports/dependency-check-report.html)

## Dependency Licenses

The following table lists the top-level production and peer dependencies. All of these dependencies—along with their transitive dependencies—have been recursively verified to use one of the following commercially friendly licenses: **BSD-2-Clause**, **CC0-1.0**, or **MIT**. Developers cloning this repository should independently verify all **development** and **optional** dependencies. This project supports development activities only. It is not used in production or distributed in any other form.

We use the `npm` packages [license-report](https://www.npmjs.com/package/license-report), [license-report-check](https://www.npmjs.com/package/license-report-check), [license-report-recursive](https://www.npmjs.com/package/license-report-recursive) and [license-downloader](https://www.npmjs.com/package/license-downloader) to identify all dependency licenses and include copies of them. We do not use any unlicensed dependencies in either production or development.

<!-- DEPENDENCY_LICENSES_START -->
|Name|Type|Installed|Latest|Latest Released|Deps|Document|
|:-|:-|:-:|:-:|:-|-:|:-|
|@dpuse/dpuse-shared|MIT|0.3.594 ⚠️|0.3.595|this month: 2026-03-23|0|[LICENSE](https://raw.githubusercontent.com/dpuse/dpuse-shared/main/LICENSE)|
|acorn|MIT|8.16.0|8.16.0|1 month ago: 2026-02-19|0|⚠️ No license file|
|acorn-typescript|MIT|1.4.13|1.4.13|26 months ago: 2024-01-03❗|1|[LICENSE](https://raw.githubusercontent.com/TyrealHu/acorn-typescript/master/LICENSE)|
|acorn-walk|MIT|8.3.5|8.3.5|1 month ago: 2026-02-19|1|⚠️ No license file|
|nanoid|MIT|5.1.7|5.1.7|this month: 2026-03-15|0|[LICENSE](https://raw.githubusercontent.com/ai/nanoid/main/LICENSE)|
|valibot|MIT|1.3.1|1.3.1|this month: 2026-03-18|1|[LICENSE.md](https://raw.githubusercontent.com/open-circle/valibot/main/LICENSE.md)|

<!-- DEPENDENCY_LICENSES_END -->

Insert link to other document for detailed explanation. Only show messages if issues arise.

1. **Installed** column:

    The ⚠️ symbol indicates that the installed version does not match the latest available version.”.

1. **Latest Release** column:

    The ⚠️ symbol indicates that the dependency has gone **more than 6 months** without an update but **no more than 12 months**.

    The ❗ symbol indicates a dependency that has gone **more than 12 months** without an update.

    If a dependency has no, or only a small number of, transitive dependencies, then it may not require frequent updates. The **Deps** column shows the number of transitive dependencies. Full details for these dependencies can be found in [licenses/licenseTree.json](licenses/licenseTree.json).

1. **Document** column:

    The “⚠️ No license file” message indicates a dependency that does not include a license file.

## License

This project is licensed under the MIT License, permitting free use, modification, and distribution.

[MIT](./LICENSE) © 2026 DPUse Pty Ltd
