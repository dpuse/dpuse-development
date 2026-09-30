# API Reference

Every export, grouped by import path. This file is updated each time `npm run document` is run, and with each release.

## @dpuse/dpuse-development

### Functions

- **`auditDependencies`**`()`
    > Audit the project's dependencies for known security vulnerabilities.
- **`buildProject`**`()`
    > Builds the package using Vite. Output to '/dist' directory. Builds bundle analysis reports.
- **`checkProject`**`()`
    > Checks the configuration files against the DPUse templates, then lists outdated dependencies.
- **`documentProject`**`(allowedLicenses?: string, isModuleLevel?: boolean)`
    > Regenerates every generated section of the README, in the order they appear, then the API reference where the project keeps one.
- **`formatCode`**`()`
    > Uses prettier to enforce formatting style rules.
- **`lintCode`**`()`
    > Uses eslint to check the code for potential errors and enforces coding style rules.
- **`publishProject`**`()`
    > Publishes the project to npm, uploads it to DPUse, or both, as its module type requires. Run by the 'publish.yml' workflow.
- **`releaseProject`**`(allowedLicenses?: string, isModuleLevel?: boolean)`
    > Bump version, builds config, builds project, regenerates the README, synchronise with GitHub and publish to npm or Cloudflare.
- **`syncProjectWithGitHub`**`()`
    > Synchronise the local repository with the main GitHub repository.
- **`testProject`**`(testTypeIds?: TestTypeId[])`
    > Runs the requested types of test, skipping any type this project has not configured.
- **`uploadDirectoryToR2`**`(sourceDirectory: string, uploadDirectory: string)`
