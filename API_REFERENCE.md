# API Reference

Every export, grouped by import path. This file is updated each time the project is built.

## @dpuse/dpuse-development

### Functions

- **`auditDependencies`**`()`
    > Audit the project's dependencies for known security vulnerabilities. Also runs the npm outdated command.
- **`buildProject`**`()`
    > Build a project.
- **`checkConfigFiles`**`()`
- **`checkDependencies`**`()`
- **`documentActions`**`()`
- **`documentAPIReference`**`()`
- **`documentBundleSizes`**`(options?: { moduleLevel?: boolean })`
- **`documentDependencies`**`(allowedLicenses?: string)`
- **`documentGovernance`**`()`
- **`documentOpening`**`()`
- **`documentUsage`**`()`
- **`formatCode`**`()`
- **`lintCode`**`()`
- **`publishProject`**`()`
- **`releaseProject`**`()`
- **`syncProjectWithGitHub`**`()`
- **`testProject`**`(testTypeIds?: TestTypeId[], isCoverageMeasured?: boolean)`
    > Runs the requested types of test, skipping any type this project has not configured.
- **`uploadDirectoryToR2`**`(sourceDirectory: string, uploadDirectory: string)`
