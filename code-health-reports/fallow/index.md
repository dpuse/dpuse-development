## Fallow: no issues found

## Fallow: no code duplication found

## Vital Signs

| Metric | Value |
|:-------|------:|
| Total LOC | 2845 |
| Avg Cyclomatic | 2.9 |
| P90 Cyclomatic | 6 |
| Cyclomatic units | Functions: 219, module scopes: 0, templates: 0 |
| Dead Files | 0.0% |
| Dead Exports | 0.0% |
| Maintainability (avg) | 92.5 |
| Hotspots (since 6 months) | 4 |
| Circular Deps | 0 |
| Unused Deps | 0 |


### File Health Scores (24 files)

| File | Maintainability | Fan-in | Fan-out | Dead Code | Density | Risk |
|:-----|:---------------|:-------|:--------|:----------|:--------|:-----|
| `src/actions/documentQualitySecurity.ts` | 91.8 | 1 | 1 | 0% | 0.18 | 17.0 |
| `src/utilities/apiReference.ts` | 83.1 | 1 | 1 | 0% | 0.47 | 12.0 |
| `src/actions/documentDependencies.ts` | 88.8 | 1 | 1 | 0% | 0.28 | 9.6 |
| `src/utilities/index.ts` | 92.8 | 21 | 0 | 0% | 0.24 | 8.0 |
| `src/actions/documentBundleSizes.ts` | 89.1 | 1 | 1 | 0% | 0.27 | 7.0 |
| `src/actions/checkConfigFiles.ts` | 90.6 | 1 | 1 | 0% | 0.22 | 7.0 |
| `src/utilities/cloudflare.ts` | 90.6 | 2 | 1 | 0% | 0.22 | 7.0 |
| `src/actions/documentContributingLicense.ts` | 92.4 | 1 | 1 | 0% | 0.16 | 7.0 |
| `src/actions/checkDependencies.ts` | 93.3 | 1 | 1 | 0% | 0.13 | 7.0 |
| `src/actions/testProject.ts` | 93.6 | 1 | 1 | 0% | 0.12 | 7.0 |
| `src/actions/documentProject.ts` | 87.5 | 2 | 9 | 0% | 0.11 | 6.0 |
| `src/actions/documentUsage.ts` | 91.8 | 1 | 1 | 0% | 0.18 | 6.0 |
| `src/actions/releaseProject.ts` | 91.8 | 1 | 3 | 0% | 0.09 | 6.0 |
| `src/actions/publishProject.ts` | 90.7 | 2 | 2 | 0% | 0.17 | 5.0 |
| `src/actions/documentOpening.ts` | 91.5 | 1 | 1 | 0% | 0.19 | 5.0 |
| `src/actions/syncProjectWithGitHub.ts` | 94.8 | 1 | 1 | 0% | 0.11 | 4.0 |
| `src/actions/documentActions.ts` | 95.4 | 1 | 1 | 0% | 0.06 | 3.0 |
| `src/actions/documentApiReference.ts` | 94.4 | 1 | 2 | 0% | 0.08 | 2.0 |
| `src/actions/formatCode.ts` | 94.8 | 1 | 1 | 0% | 0.16 | 2.0 |
| `src/actions/auditDependencies.ts` | 96.0 | 1 | 1 | 0% | 0.09 | 2.0 |
| `src/actions/buildProject.ts` | 96.0 | 1 | 1 | 0% | 0.11 | 2.0 |
| `src/actions/lintCode.ts` | 96.0 | 1 | 1 | 0% | 0.11 | 2.0 |
| `vite.config.ts` | 99.3 | 0 | 0 | 0% | 0.03 | 2.0 |
| `src/actions/checkProject.ts` | 95.0 | 1 | 2 | 0% | 0.08 | 1.0 |

**Average maintainability index:** 92.5/100

### Hotspots (17 files, since 6 months)

| File | Score | Commits | Churn | Density | Fan-in | Trend |
|:-----|:------|:--------|:------|:--------|:-------|:------|
| `src/actions/checkConfigFiles.ts` | 78.6 | 44 | 510 | 0.22 | 1 | cooling |
| `src/actions/documentBundleSizes.ts` | 74.5 | 35 | 1188 | 0.27 | 1 | cooling |
| `src/utilities/index.ts` | 71.0 | 34 | 493 | 0.24 | 21 | cooling |
| `src/actions/documentDependencies.ts` | 54.1 | 23 | 445 | 0.28 | 1 | cooling |
| `src/actions/documentOpening.ts` | 37.2 | 18 | 274 | 0.19 | 1 | accelerating |
| `src/actions/documentUsage.ts` | 34.4 | 16 | 330 | 0.18 | 1 | accelerating |
| `src/actions/checkDependencies.ts` | 21.9 | 17 | 194 | 0.13 | 1 | stable |
| `src/utilities/cloudflare.ts` | 15.0 | 9 | 41 | 0.22 | 2 | stable |
| `src/actions/documentQualitySecurity.ts` | 14.3 | 6 | 594 | 0.18 | 1 | cooling |
| `src/actions/documentApiReference.ts` | 13.7 | 13 | 772 | 0.08 | 1 | cooling |
| `src/actions/formatCode.ts` | 10.4 | 7 | 38 | 0.16 | 1 | stable |
| `src/actions/documentProject.ts` | 7.3 | 5 | 85 | 0.11 | 2 | cooling |
| `src/actions/auditDependencies.ts` | 5.9 | 7 | 37 | 0.09 | 1 | stable |
| `src/actions/lintCode.ts` | 5.7 | 6 | 30 | 0.11 | 1 | cooling |
| `src/actions/documentActions.ts` | 5.2 | 9 | 92 | 0.06 | 1 | stable |
| `vite.config.ts` | 4.3 | 17 | 106 | 0.03 | 0 | cooling |
| `src/actions/releaseProject.ts` | 3.6 | 3 | 73 | 0.09 | 1 | accelerating |

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

