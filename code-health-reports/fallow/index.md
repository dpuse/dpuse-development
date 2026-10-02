## Fallow: no issues found

## Fallow: no code duplication found

## Vital Signs

| Metric | Value |
|:-------|------:|
| Total LOC | 3535 |
| Avg Cyclomatic | 2.9 |
| P90 Cyclomatic | 6 |
| Cyclomatic units | Functions: 280, module scopes: 0, templates: 0 |
| Dead Files | 0.0% |
| Dead Exports | 0.0% |
| Maintainability (avg) | 92.3 |
| Hotspots (since 6 months) | 4 |
| Circular Deps | 0 |
| Unused Deps | 0 |


### File Health Scores (27 files)

| File | Maintainability | Fan-in | Fan-out | Dead Code | Density | Risk |
|:-----|:---------------|:-------|:--------|:----------|:--------|:-----|
| `src/actions/documentQualitySecurity.ts` | 91.8 | 1 | 1 | 0% | 0.18 | 17.0 |
| `src/utilities/rustCrates.ts` | 90.0 | 1 | 1 | 0% | 0.24 | 13.0 |
| `src/utilities/apiReference.ts` | 83.1 | 1 | 1 | 0% | 0.47 | 12.0 |
| `src/actions/documentDependencies.ts` | 85.8 | 1 | 3 | 0% | 0.29 | 9.6 |
| `src/vite.ts` | 91.6 | 1 | 0 | 0% | 0.28 | 8.3 |
| `src/utilities/index.ts` | 92.8 | 23 | 0 | 0% | 0.24 | 8.0 |
| `src/actions/documentBundleSizes.ts` | 88.8 | 1 | 1 | 0% | 0.28 | 7.0 |
| `src/utilities/cloudflare.ts` | 90.6 | 2 | 1 | 0% | 0.22 | 7.0 |
| `src/actions/checkConfigFiles.ts` | 90.9 | 1 | 1 | 0% | 0.21 | 7.0 |
| `src/actions/documentContributingLicense.ts` | 92.4 | 1 | 1 | 0% | 0.16 | 7.0 |
| `src/actions/checkDependencies.ts` | 93.3 | 1 | 1 | 0% | 0.13 | 7.0 |
| `src/actions/testProject.ts` | 93.6 | 1 | 1 | 0% | 0.12 | 7.0 |
| `src/actions/documentProject.ts` | 87.5 | 2 | 9 | 0% | 0.11 | 6.0 |
| `src/actions/releaseProject.ts` | 90.9 | 1 | 4 | 0% | 0.09 | 6.0 |
| `src/actions/documentUsage.ts` | 91.8 | 1 | 1 | 0% | 0.18 | 6.0 |
| `src/actions/publishProject.ts` | 90.8 | 2 | 2 | 0% | 0.16 | 5.0 |
| `src/actions/documentOpening.ts` | 92.1 | 1 | 1 | 0% | 0.17 | 5.0 |
| `src/actions/syncProjectWithGitHub.ts` | 94.8 | 1 | 1 | 0% | 0.11 | 4.0 |
| `src/actions/buildProject.ts` | 94.3 | 2 | 1 | 0% | 0.14 | 3.0 |
| `src/actions/documentActions.ts` | 95.4 | 1 | 1 | 0% | 0.06 | 3.0 |
| `src/actions/triggerGitHubRelease.ts` | 95.4 | 1 | 1 | 0% | 0.12 | 3.0 |
| `src/actions/documentApiReference.ts` | 94.4 | 1 | 2 | 0% | 0.08 | 2.0 |
| `src/actions/formatCode.ts` | 94.8 | 1 | 1 | 0% | 0.16 | 2.0 |
| `src/actions/lintCode.ts` | 96.0 | 1 | 1 | 0% | 0.11 | 2.0 |
| `src/actions/auditDependencies.ts` | 96.1 | 1 | 1 | 0% | 0.08 | 2.0 |
| `vite.config.ts` | 99.4 | 0 | 0 | 0% | 0.02 | 2.0 |
| `src/actions/checkProject.ts` | 95.0 | 1 | 2 | 0% | 0.08 | 1.0 |

**Average maintainability index:** 92.3/100

### Hotspots (19 files, since 6 months)

| File | Score | Commits | Churn | Density | Fan-in | Trend |
|:-----|:------|:--------|:------|:--------|:-------|:------|
| `src/actions/documentBundleSizes.ts` | 80.7 | 40 | 1343 | 0.28 | 1 | cooling |
| `src/actions/checkConfigFiles.ts` | 72.4 | 48 | 543 | 0.21 | 1 | cooling |
| `src/actions/documentDependencies.ts` | 66.9 | 29 | 879 | 0.29 | 1 | stable |
| `src/utilities/index.ts` | 65.0 | 36 | 510 | 0.24 | 23 | stable |
| `src/actions/documentOpening.ts` | 29.8 | 19 | 283 | 0.17 | 1 | accelerating |
| `src/actions/documentUsage.ts` | 28.9 | 16 | 330 | 0.18 | 1 | accelerating |
| `src/actions/checkDependencies.ts` | 18.4 | 17 | 194 | 0.13 | 1 | stable |
| `src/actions/documentQualitySecurity.ts` | 14.0 | 7 | 601 | 0.18 | 1 | cooling |
| `src/utilities/cloudflare.ts` | 12.6 | 9 | 41 | 0.22 | 2 | stable |
| `src/actions/documentApiReference.ts` | 11.5 | 13 | 772 | 0.08 | 1 | cooling |
| `src/actions/formatCode.ts` | 8.7 | 7 | 38 | 0.16 | 1 | stable |
| `src/actions/documentProject.ts` | 6.1 | 5 | 85 | 0.11 | 2 | cooling |
| `src/actions/publishProject.ts` | 5.4 | 3 | 62 | 0.16 | 2 | cooling |
| `src/actions/auditDependencies.ts` | 5.3 | 8 | 43 | 0.08 | 1 | stable |
| `src/actions/documentActions.ts` | 5.1 | 10 | 102 | 0.06 | 1 | stable |
| `src/actions/lintCode.ts` | 4.8 | 6 | 30 | 0.11 | 1 | cooling |
| `src/actions/buildProject.ts` | 4.7 | 3 | 56 | 0.14 | 2 | cooling |
| `src/actions/releaseProject.ts` | 4.0 | 4 | 76 | 0.09 | 1 | cooling |
| `vite.config.ts` | 2.8 | 19 | 126 | 0.02 | 0 | cooling |

*8 files excluded (< 3 commits)*

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

