# DPUse Development

<!-- OPENING_START -->

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![CI](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml/badge.svg)](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml)
[![CodeQL](https://github.com/dpuse/dpuse-development/actions/workflows/codeql.yml/badge.svg)](https://github.com/dpuse/dpuse-development/security/code-scanning)
![Coverage](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdpuse%2Fdpuse-development%2Fmain%2Fcode-health-reports%2Fvitest%2Fbadge.json)
[![Fallow code health](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdpuse%2Fdpuse-development%2Fmain%2Fcode-health-reports%2Ffallow%2Fbadge.json)](./code-health-reports/fallow/index.md)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dpuse_dpuse-development&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-development)
[![npm version](https://img.shields.io/npm/v/@dpuse/dpuse-development?label=npm)](https://www.npmjs.com/package/@dpuse/dpuse-development)

Actions for managing DPUse projects.

[Report a Vulnerability](https://github.com/dpuse/dpuse-development/security/advisories/new) · [Open an Issue](https://github.com/dpuse/dpuse-development/issues)

## About DPUse

DPUse (Data Positioning & Use) is a browser-based app that helps you prepare your data for use in two main steps: Sourcing and Contextualising. Once your data is contextualised, Presentations and Cookbooks give you two ways to put it to use.

**Sourcing** uses Connectors to link to applications, databases, file stores, and curated datasets. These Connections help you set up tabular Data Views from your sources.

**Contextualising** maps events from your Data Views to detailed Context Models. These models give the DPUse Engine the structure it needs to create clear transactions, facts, or observations.

**Presentations** use ready-made Presenters to show your contextualised data in a meaningful way as soon as it's ready.

**Cookbooks** of Recipes guide you in building Data Apps, and additional Presenters, with your contextualised data using your preferred tools.

## Introduction

The package implements a common set of actions used to manage DPUse repositories. All actions are designed to be run from `package.json` scripts and assume that the project follows the standard DPUse directory structure and that it includes a `config.json` file in the root directory. See [API Reference](https://github.com/dpuse/dpuse-development/blob/main/API_REFERENCE.md).

<!-- OPENING_END -->

<!-- USAGE_START -->

## Usage

This [package](https://www.npmjs.com/package/@dpuse/dpuse-development) is available on [npm](https://www.npmjs.com/). Install it with:

```bash
npm install -D @dpuse/dpuse-development typescript
```

_Requires [Node.js](https://nodejs.org/) 24 or later, [npm](https://www.npmjs.com/) 12 or later, and `typescript` 6.0.3 or later as a peer dependency._

> [!WARNING]
> Built for DPUse projects and their conventions. You are welcome to use or adapt it, but it may change without notice to suit DPUse.

To work on the source instead, clone this repository.

```bash
git clone https://github.com/dpuse/dpuse-development.git
cd dpuse-development
npm install
```

_Working on the source also requires [TypeScript](https://www.typescriptlang.org/) 6.0.3 or a later 6.0 release. Later versions, including TypeScript 7, are not supported yet._

This repository is managed using the actions it implements. See the `scripts` block in [package.json](https://github.com/dpuse/dpuse-development/blob/main/package.json) for details.

### Release Status

DPUse is a new product, and this package is a release candidate: complete and in use across DPUse, but not yet at its first stable release.

The last number of the version increases with every push to GitHub, whether or not that push is released, so the versions of consecutive releases can skip numbers, for example from 1.1.120 to 1.1.124. Until the first stable release, any release may include changes that need updates in the projects that use it, so depend on an exact version to avoid unexpected changes. Once stable, versions will follow [Semantic Versioning](https://semver.org): breaking changes in the first number, new features in the second and fixes in the last.

Every release is listed on the [Releases](https://github.com/dpuse/dpuse-development/releases) page.

<!-- USAGE_END -->

## How It Works

Each DPUse project has the same `scripts` in its `package.json`, and each script calls one action exported by this package. The actions read the project's `package.json` and `config.json` to decide what to do, so every project calls them the same way.

| Script             | Action                  | What it does                                                                                                                                                        |
| :----------------- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run build`    | `buildProject`          | Bundles the project with Vite, first building its WebAssembly where the project has a `build:wasm` script.                                                          |
| `npm run lint`     | `lintCode`              | Runs ESLint, then type-checks the whole project with `tsc`, or `vue-tsc` in a Vue project.                                                                          |
| `npm test`         | `testProject`           | Runs the unit tests with Vitest and, where asked for and set up, the end-to-end tests with Playwright.                                                              |
| `npm run format`   | `formatCode`            | Formats the project with Prettier.                                                                                                                                  |
| `npm run audit`    | `auditDependencies`     | Runs `npm audit`. Fails on any vulnerability in a shipped dependency, and on a high or critical one in a development dependency.                                    |
| `npm run check`    | `checkProject`          | Compares the project's configuration files with the templates this package ships, then walks through updating its dependencies.                                     |
| `npm run document` | `documentProject`       | Rewrites the generated sections of the README, and `API_REFERENCE.md` where the project has one.                                                                    |
| `npm run sync`     | `syncProjectWithGitHub` | Checks that `main` is checked out, increases the version, updates `config.json`, then commits and pushes.                                                           |
| `npm run release`  | `triggerGitHubRelease`  | Runs build, document and sync, then creates a GitHub release. The release starts the publish workflow, which waits for CI to pass before it calls `publishProject`. |

### Module Types

The `id` in `config.json` sets the project's module type by its prefix, such as `dpuse-connector-` or `dpuse-tool-`. The module type decides which templates the project is checked against and where it is published: to npm, to DPUse, or both. The list is `MODULE_TYPE_CONFIGS` in [src/utilities/index.ts](./src/utilities/index.ts).

### Generated README Sections

`npm run document` only rewrites the text between pairs of markers, such as `<!-- USAGE_START -->` and `<!-- USAGE_END -->`. Anything outside the markers, like this section, is written by hand and left alone. The marker pairs are `OPENING`, `SUPPORTED_ACTIONS` (connectors only), `USAGE`, `DEPENDENCY_LICENSES`, `BUNDLE`, `QUALITY_SECURITY` and `CONTRIBUTING_LICENSE`.

### Templates

The package ships the configuration files every project starts from: the GitHub workflows and Dependabot files, the TypeScript, Vite, Vitest and ESLint configurations, and the editor, Git and Markdown settings. They are listed under `files` in [package.json](./package.json). `npm run check` reports any project file that differs from its template. It does not change the file.

Two more entry points are exported: `@dpuse/dpuse-development/prettierrc`, the shared Prettier configuration, and `@dpuse/dpuse-development/vite`, a build plugin that records which packages a build ships so their licences can be documented.

### Ignoring an Advisory

An advisory with no fix yet can be ignored by listing it in an `auditIgnore.json` file at the root of the affected project. A project without the file ignores nothing.

```json
{
    "advisories": [{ "id": "GHSA-xxxx-xxxx-xxxx", "reason": "Why the flaw cannot reach a release", "reviewBy": "2027-01-31" }],
    "shippedAdvisories": []
}
```

- `advisories` is for high or critical advisories in development dependencies.
- `shippedAdvisories` is for advisories in shipped dependencies, and is the only list the check of shipped dependencies reads.
- After its `reviewBy` date an entry still passes, but the audit warns, so it is looked at again. Remove an entry once a fix is released.

### Adapting It

The values specific to DPUse are in a few places: the module types in [src/utilities/index.ts](./src/utilities/index.ts), the Cloudflare bucket names and API address in [src/utilities/cloudflare.ts](./src/utilities/cloudflare.ts), and the README wording in the `document…` actions in [src/actions](./src/actions).

## Prerequisites

The actions run other tools by name and do not install them. A project using this package needs:

- **In its `devDependencies`:** `eslint`, `prettier`, `typescript`, `vite` and `vitest`. Optional, and used only where installed: `@vitest/coverage-v8` and `fallow` for the coverage and code health figures, `sonda` for the bundle analysis, `@playwright/test` for end-to-end tests, and `wrangler` for projects published to Cloudflare.
- **On the machine:** [Git](https://git-scm.com/), and the [GitHub CLI](https://cli.github.com/) (`gh`), signed in. `npm run document` reads the repository's settings through it, and `npm run release` creates the release with it. Projects with Rust code also need `cargo` and `wasm-pack`.
- **macOS or Linux.** Windows is not supported.

In this repository the scripts run the built package from `dist`, so run `npm run build` once after cloning, before any other script.

[resources/vsCodeKeyBindings.json](./resources/vsCodeKeyBindings.json) holds optional VS Code key bindings that run the scripts in the terminal, for example Ctrl+Shift+Alt+L for `npm run lint`. A few are for scripts only some DPUse projects have. Copy the ones you want into your own `keybindings.json`.

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

| Chunk/Module/File                                                     | Composition                                                                                   |
| :-------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| **All 4 files**                                                       | 113.7&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;34.8&nbsp;kB                                              |
| **dist/dpuse-development.es.js**                                      | 69.0&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;22.3&nbsp;kB&nbsp;·&nbsp;60.6%&nbsp;of&nbsp;the&nbsp;build |
| &nbsp;&nbsp;&nbsp;&nbsp;src → documentDependencies.ts + 21 more       | `██████████████████░░`&nbsp;91.4%&nbsp;·&nbsp;63.0&nbsp;kB                                    |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON)           | `██░░░░░░░░░░░░░░░░░░`&nbsp;8.6%&nbsp;·&nbsp;6.0&nbsp;kB                                      |
| **dist/utilities-DaeO1Tb8.js**                                        | 32.9&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;7.9&nbsp;kB&nbsp;·&nbsp;29.0%&nbsp;of&nbsp;the&nbsp;build  |
| &nbsp;&nbsp;&nbsp;&nbsp;@dpuse/dpuse-shared → dist/dpuse-shared.es.js | `█████████░░░░░░░░░░░`&nbsp;45.3%&nbsp;·&nbsp;14.9&nbsp;kB                                    |
| &nbsp;&nbsp;&nbsp;&nbsp;src → index.ts                                | `██████░░░░░░░░░░░░░░`&nbsp;28.1%&nbsp;·&nbsp;9.2&nbsp;kB                                     |
| &nbsp;&nbsp;&nbsp;&nbsp;valibot → dist/index.mjs                      | `███░░░░░░░░░░░░░░░░░`&nbsp;14.5%&nbsp;·&nbsp;4.8&nbsp;kB                                     |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON)           | `██░░░░░░░░░░░░░░░░░░`&nbsp;12.1%&nbsp;·&nbsp;4.0&nbsp;kB                                     |
| **dist/apiReference-BTZpL88c.js**                                     | 8.4&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;3.1&nbsp;kB&nbsp;·&nbsp;7.4%&nbsp;of&nbsp;the&nbsp;build    |
| &nbsp;&nbsp;&nbsp;&nbsp;src → apiReference.ts                         | `███████████████████░`&nbsp;95.3%&nbsp;·&nbsp;8.0&nbsp;kB                                     |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON)           | `█░░░░░░░░░░░░░░░░░░░`&nbsp;4.7%&nbsp;·&nbsp;407&nbsp;B                                       |
| **dist/vite.es.js**                                                   | 3.4&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;1.5&nbsp;kB&nbsp;·&nbsp;3.0%&nbsp;of&nbsp;the&nbsp;build    |
| &nbsp;&nbsp;&nbsp;&nbsp;src → vite.ts                                 | `██████████████████░░`&nbsp;89.3%&nbsp;·&nbsp;3.0&nbsp;kB                                     |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON)           | `██░░░░░░░░░░░░░░░░░░`&nbsp;10.7%&nbsp;·&nbsp;371&nbsp;B                                      |

Bars show each row's share of its output file.

- n more = the row also holds n more files from the same package or folder, each no larger than the one named. A package can appear under several output files, each holding different files, never the same file twice.

(bundler output, whitespace & JSON) = bytes Sonda can't trace to a source file: whitespace (indentation and line breaks), code the bundler generates (region comments, the combined import/export lines, its small runtime helper and wrappers), and imported JSON such as `config.json`, which the bundler doesn't map. The JSON and the generated code are real bytes that ship; the whitespace mostly disappears once compressed.

<!-- BUNDLE_END -->

<!-- QUALITY_SECURITY_START -->

## Quality & Security

This section is updated each time `npm run document` is run. Settings come from the repository's workflow files and GitHub. Test coverage and the Fallow score are measured at the same time.

### Testing

| Check                | Status | What it does                                                                                                                                                                                                                                                 |
| :------------------- | :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit tests           | ✅ On  | [Vitest](https://vitest.dev) runs the unit tests. Part of the [CI workflow](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml) on every push and pull request to `main`.                                                                   |
| Property-based tests | ✅ On  | [fast-check](https://fast-check.dev) runs many random inputs per test to find edge cases, alongside the unit tests. Part of the [CI workflow](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml) on every push and pull request to `main`. |
| Test coverage        | ✅ On  | [Vitest's V8 coverage](https://vitest.dev/guide/coverage) measures the share of source lines the unit tests run.                                                                                                                                             |

### Code Quality

| Check         | Status | What it does                                                                                                                                                                                                                                                                                                       |
| :------------ | :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Linting       | ✅ On  | [ESLint](https://eslint.org) checks the code for errors and style problems, and the [TypeScript](https://www.typescriptlang.org/) compiler type-checks the whole project. Part of the [CI workflow](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml) on every push and pull request to `main`. |
| Code health   | ✅ On  | [Fallow](https://github.com/fallow-rs/fallow) finds unused code, duplication, complexity and dependency problems. See the [report](./code-health-reports/fallow/index.md).                                                                                                                                         |
| Code analysis | ✅ On  | [SonarCloud](https://sonarcloud.io) checks every push for bugs, code smells and vulnerabilities.                                                                                                                                                                                                                   |

### Security Analysis

| Check           | Status | What it does                                                                                                                                                                                                      |
| :-------------- | :----- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Push protection | ✅ On  | [GitHub push protection](https://docs.github.com/en/code-security/secret-scanning/push-protection-for-repositories-and-organizations) blocks pushes that contain credentials.                                     |
| Static analysis | ✅ On  | [GitHub CodeQL](https://codeql.github.com) scans GitHub Actions and JavaScript/TypeScript for security vulnerabilities, using the extended security queries, on every push and pull request to `main` and weekly. |
| Secret scanning | ✅ On  | [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning) detects credentials, such as API keys and tokens, committed to the repository.                                                 |

### Dependencies

| Check               | Status | What it does                                                                                                                                                                                                                                                                                                             |
| :------------------ | :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vulnerability audit | ✅ On  | [npm audit](https://docs.npmjs.com/cli/commands/npm-audit) fails when a shipped dependency has any known vulnerability, or a development dependency has a high or critical one. Part of the [CI workflow](https://github.com/dpuse/dpuse-development/actions/workflows/ci.yml) on every push and pull request to `main`. |
| Supply chain risk   | ✅ On  | [Socket.dev](https://socket.dev) flags malicious packages, typosquatting and suspicious behaviour that may not yet have a CVE.                                                                                                                                                                                           |
| Security alerts     | ✅ On  | [GitHub Dependabot](https://docs.github.com/en/code-security/dependabot) alerts when a dependency has a known vulnerability, using the GitHub Advisory Database.                                                                                                                                                         |
| Dependency updates  | ❌ Off | [GitHub Dependabot](https://docs.github.com/en/code-security/dependabot) can open pull requests for new and vulnerable dependency versions. Dependencies are updated by hand with `npm run check` instead.                                                                                                               |

### OpenSSF 🚧

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/dpuse/dpuse-development/badge)](https://scorecard.dev/viewer/?uri=github.com/dpuse/dpuse-development)

This project is working towards the [OpenSSF Best Practices](https://www.bestpractices.dev) Passing badge, a self-certification covering security policy, vulnerability reporting, build processes, code quality, and more. Currently the [OpenSSF Scorecard](https://scorecard.dev) provides an independent automated assessment of the project's security practices and is an ongoing area of improvement.

> [!NOTE]
> The Scorecard score is below the maximum for two reasons. The project does not have the OpenSSF Best Practices badge yet, and some checks need a second reviewer or a pull-request workflow, which a solo-maintained project cannot provide.

### Reporting Vulnerabilities

Please do not open public GitHub issues for security vulnerabilities. Use [GitHub private vulnerability reporting](https://github.com/dpuse/dpuse-development/security/advisories/new) instead. See [SECURITY.md](./SECURITY.md) for the full disclosure policy, contact details, and expected response times.

<!-- QUALITY_SECURITY_END -->

<!-- CONTRIBUTING_LICENSE_START -->

## Contributing

This repository is maintained solely by its owner and does not, at present, accept external contributions. Its source is published openly under the MIT License — every DPUse project is fully open source except DPUse Engine and DPUse API, which remain closed and proprietary.

For security vulnerabilities, see [Reporting Vulnerabilities](#reporting-vulnerabilities). For bugs, inconsistencies, or other feedback, [open a GitHub issue](https://github.com/dpuse/dpuse-development/issues) — feedback is read, but responses and fixes are at the maintainer's discretion.

## License

This project is licensed under the MIT License, permitting free use, modification, and distribution.

[MIT](./LICENSE) © 2026 Jonathan Terrell

<!-- CONTRIBUTING_LICENSE_END -->
