# API Reference

Every export, grouped by import path. This file is updated each time the project is built.

## @dpuse/dpuse-development

### Functions

- **`auditDependencies`**`()`
    > Audit the project's dependencies for known security vulnerabilities. Also runs the npm outdated command.
- **`buildProject`**`()`
    > Builds the package using Vite. Output to '/dist' directory. Builds bundle analysis reports.
- **`checkConfigFiles`**`()`
- **`checkDependencies`**`()`
    > Identifies outdated dependencies using npm outdated and npm-check-updates with option to automatically install latest versions.
- **`documentActions`**`()`
- **`documentAPIReference`**`()`
    > Lists every export of each import path in API_REFERENCE.md. Runs on each build where the project has that file.
- **`documentBundleSizes`**`(options?: { moduleLevel?: boolean })`
- **`documentContributingLicense`**`()`
    > Regenerates the README's Contributing and License sections.
- **`documentDependencies`**`(allowedLicenses?: string)`
    > Identify licenses of the project's production and peer dependencies. Updates the table in the Dependency Licenses section of this page and summary files licenses.json and licenseTree.json in th licenses directory of this repository. Also downloads a copy of dependency license to `licenses/downloads'.
- **`documentOpening`**`()`
- **`documentProject`**`(__0?: DocumentOptions)`
    > Regenerates every generated section of the README, in the order they appear.
- **`documentQualitySecurity`**`()`
    > Regenerates the README's Quality & Security section: testing, code quality, security analysis, dependencies and OpenSSF.
- **`documentUsage`**`()`
- **`formatCode`**`()`
    > Uses prettier to enforce formatting style rules.
- **`lintCode`**`()`
    > Uses eslint to check the code for potential errors and enforces coding style rules.
- **`publishProject`**`()`
- **`releaseProject`**`(documentOptions?: DocumentOptions)`
    > Bump version, builds config, builds project, regenerates the README, synchronise with GitHub and publish to npm or Cloudflare.
- **`syncProjectWithGitHub`**`()`
    > Synchronise the local repository with the main GitHub repository.
- **`testProject`**`(testTypeIds?: TestTypeId[], isCoverageMeasured?: boolean)`
    > Runs the requested types of test, skipping any type this project has not configured.
- **`uploadDirectoryToR2`**`(sourceDirectory: string, uploadDirectory: string)`
