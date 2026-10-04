## Fallow: no issues found

## Fallow: 1 clone group found (0.4% duplication)

### Duplicates

**Clone group 1** (8 lines, 2 instances)

- `src/utilities/index.ts:141-148`
- `src/utilities/index.ts:156-163`

### Clone Families

**Family 1** (1 group, 8 lines across `src/utilities/index.ts`)

- Extract shared function (8 lines) from index.ts, index.ts (~8 lines saved)

**Summary:** 16 duplicated lines (0.4%) across 1 file

## Vital Signs

| Metric | Value |
|:-------|------:|
| Total LOC | 3801 |
| Avg Cyclomatic | 3.0 |
| P90 Cyclomatic | 7 |
| Cyclomatic units | Functions: 301, module scopes: 0, templates: 0 |
| Dead Files | 0.0% |
| Dead Exports | 0.0% |
| Maintainability (avg) | 92.1 |
| Hotspots (since 6 months) | 1 |
| Circular Deps | 0 |
| Unused Deps | 0 |


### File Health Scores (27 files)

| File | Maintainability | Fan-in | Fan-out | Dead Code | Density | Risk |
|:-----|:---------------|:-------|:--------|:----------|:--------|:-----|
| `src/actions/documentQualitySecurity.ts` | 91.8 | 1 | 1 | 0% | 0.18 | 16.0 |
| `src/utilities/rustCrates.ts` | 90.0 | 1 | 1 | 0% | 0.24 | 13.0 |
| `src/utilities/apiReference.ts` | 83.1 | 1 | 1 | 0% | 0.47 | 12.0 |
| `src/actions/documentDependencies.ts` | 85.8 | 1 | 3 | 0% | 0.29 | 12.0 |
| `src/actions/documentBundleSizes.ts` | 87.3 | 1 | 1 | 0% | 0.33 | 10.3 |
| `src/vite.ts` | 91.6 | 1 | 0 | 0% | 0.28 | 8.3 |
| `src/utilities/index.ts` | 92.8 | 23 | 0 | 0% | 0.24 | 8.0 |
| `src/actions/checkConfigFiles.ts` | 90.6 | 1 | 1 | 0% | 0.22 | 7.0 |
| `src/utilities/cloudflare.ts` | 90.6 | 2 | 1 | 0% | 0.22 | 7.0 |
| `src/actions/auditDependencies.ts` | 91.5 | 1 | 1 | 0% | 0.19 | 7.0 |
| `src/actions/documentOpening.ts` | 91.8 | 1 | 1 | 0% | 0.18 | 7.0 |
| `src/actions/documentContributingLicense.ts` | 92.4 | 1 | 1 | 0% | 0.16 | 7.0 |
| `src/actions/checkDependencies.ts` | 93.3 | 1 | 1 | 0% | 0.13 | 7.0 |
| `src/actions/testProject.ts` | 93.6 | 1 | 1 | 0% | 0.12 | 7.0 |
| `src/actions/documentProject.ts` | 87.5 | 2 | 9 | 0% | 0.11 | 6.0 |
| `src/actions/releaseProject.ts` | 90.9 | 1 | 4 | 0% | 0.09 | 6.0 |
| `src/actions/documentUsage.ts` | 91.8 | 1 | 1 | 0% | 0.18 | 6.0 |
| `src/actions/publishProject.ts` | 90.8 | 2 | 2 | 0% | 0.16 | 5.0 |
| `src/actions/syncProjectWithGitHub.ts` | 94.8 | 1 | 1 | 0% | 0.11 | 4.0 |
| `src/actions/buildProject.ts` | 94.3 | 2 | 1 | 0% | 0.14 | 3.0 |
| `src/actions/documentActions.ts` | 95.4 | 1 | 1 | 0% | 0.06 | 3.0 |
| `src/actions/triggerGitHubRelease.ts` | 95.4 | 1 | 1 | 0% | 0.12 | 3.0 |
| `src/actions/documentApiReference.ts` | 94.4 | 1 | 2 | 0% | 0.08 | 2.0 |
| `src/actions/formatCode.ts` | 94.8 | 1 | 1 | 0% | 0.16 | 2.0 |
| `src/actions/lintCode.ts` | 96.0 | 1 | 1 | 0% | 0.11 | 2.0 |
| `vite.config.ts` | 99.4 | 0 | 0 | 0% | 0.02 | 2.0 |
| `src/actions/checkProject.ts` | 95.0 | 1 | 2 | 0% | 0.08 | 1.0 |

**Average maintainability index:** 92.1/100

### Hotspots (20 files, since 6 months)

| File | Score | Commits | Churn | Density | Fan-in | Trend |
|:-----|:------|:--------|:------|:--------|:-------|:------|
| `src/actions/documentBundleSizes.ts` | 55.0 | 40 | 1343 | 0.33 | 1 | cooling |
| `src/actions/checkConfigFiles.ts` | 46.8 | 50 | 562 | 0.22 | 1 | cooling |
| `src/actions/documentDependencies.ts` | 44.5 | 32 | 941 | 0.29 | 1 | stable |
| `src/utilities/index.ts` | 42.4 | 39 | 539 | 0.24 | 23 | stable |
| `src/actions/documentOpening.ts` | 20.7 | 21 | 332 | 0.18 | 1 | accelerating |
| `src/actions/documentUsage.ts` | 17.9 | 17 | 334 | 0.18 | 1 | accelerating |
| `src/actions/checkDependencies.ts` | 10.6 | 17 | 194 | 0.13 | 1 | stable |
| `src/actions/auditDependencies.ts` | 9.8 | 10 | 132 | 0.19 | 1 | stable |
| `src/actions/documentQualitySecurity.ts` | 9.3 | 8 | 673 | 0.18 | 1 | cooling |
| `src/utilities/apiReference.ts` | 9.2 | 3 | 404 | 0.47 | 1 | cooling |
| `src/utilities/cloudflare.ts` | 7.3 | 9 | 41 | 0.22 | 2 | stable |
| `src/actions/documentApiReference.ts` | 6.6 | 13 | 772 | 0.08 | 1 | cooling |
| `src/actions/formatCode.ts` | 5.0 | 7 | 38 | 0.16 | 1 | stable |
| `src/actions/publishProject.ts` | 4.2 | 4 | 66 | 0.16 | 2 | cooling |
| `src/actions/documentProject.ts` | 3.5 | 5 | 85 | 0.11 | 2 | cooling |
| `src/actions/releaseProject.ts` | 2.9 | 5 | 78 | 0.09 | 1 | cooling |
| `src/actions/documentActions.ts` | 2.9 | 10 | 102 | 0.06 | 1 | stable |
| `src/actions/lintCode.ts` | 2.8 | 6 | 30 | 0.11 | 1 | cooling |
| `src/actions/buildProject.ts` | 2.7 | 3 | 56 | 0.14 | 2 | cooling |
| `vite.config.ts` | 1.8 | 20 | 130 | 0.02 | 0 | cooling |

*7 files excluded (< 3 commits)*

---

<details><summary>Metric definitions</summary>

- **MI**: Maintainability Index (0–100, higher is better)
- **Order**: risk-aware triage order using the larger of low-MI concern and CRAP risk
- **Fan-in**: files that import this file (blast radius)
- **Fan-out**: files this file imports (coupling)
- **Dead Code**: % of value exports with zero references
- **Density**: cyclomatic complexity / lines of code
- **Risk**: max CRAP score for the file; low <15, moderate 15-30, high >=30
- **Score**: churn × complexity (0–100, higher = riskier)
- **Commits**: commits in the analysis window
- **Churn**: total lines added + deleted
- **Trend**: accelerating / stable / cooling

[Full metric reference](https://docs.fallow.tools/explanations/metrics)

</details>

