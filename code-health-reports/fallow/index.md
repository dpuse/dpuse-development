## Fallow: no issues found

## Fallow: no code duplication found

## Vital Signs

| Metric | Value |
|:-------|------:|
| Total LOC | 2758 |
| Avg Cyclomatic | 3.0 |
| P90 Cyclomatic | 6 |
| Cyclomatic units | Functions: 207, module scopes: 0, templates: 0 |
| Dead Files | 0.0% |
| Dead Exports | 0.0% |
| Maintainability (avg) | 92.4 |
| Hotspots (since 6 months) | 2 |
| Circular Deps | 0 |
| Unused Deps | 0 |


### File Health Scores (23 files)

| File | Maintainability | Fan-in | Fan-out | Dead Code | Density | Risk |
|:-----|:---------------|:-------|:--------|:----------|:--------|:-----|
| `src/actions/documentQualitySecurity.ts` | 91.8 | 1 | 1 | 0% | 0.18 | 17.0 |
| `src/actions/documentApiReference.ts` | 82.8 | 1 | 1 | 0% | 0.48 | 12.0 |
| `vite.config.ts` | 97.5 | 0 | 0 | 0% | 0.10 | 12.0 |
| `src/utilities/index.ts` | 92.8 | 20 | 0 | 0% | 0.24 | 10.0 |
| `src/actions/documentDependencies.ts` | 89.4 | 1 | 1 | 0% | 0.26 | 9.6 |
| `src/actions/documentBundleSizes.ts` | 89.1 | 1 | 1 | 0% | 0.27 | 7.0 |
| `src/actions/checkConfigFiles.ts` | 90.3 | 1 | 1 | 0% | 0.23 | 7.0 |
| `src/utilities/cloudflare.ts` | 90.6 | 2 | 1 | 0% | 0.22 | 7.0 |
| `src/actions/documentContributingLicense.ts` | 92.4 | 1 | 1 | 0% | 0.16 | 7.0 |
| `src/actions/checkDependencies.ts` | 93.0 | 1 | 1 | 0% | 0.14 | 7.0 |
| `src/actions/testProject.ts` | 93.6 | 1 | 1 | 0% | 0.12 | 7.0 |
| `src/actions/documentProject.ts` | 87.8 | 2 | 9 | 0% | 0.10 | 6.0 |
| `src/actions/documentUsage.ts` | 91.8 | 1 | 1 | 0% | 0.18 | 6.0 |
| `src/actions/releaseProject.ts` | 91.8 | 1 | 3 | 0% | 0.09 | 6.0 |
| `src/actions/publishProject.ts` | 90.7 | 2 | 2 | 0% | 0.17 | 5.0 |
| `src/actions/documentOpening.ts` | 92.1 | 1 | 1 | 0% | 0.17 | 4.0 |
| `src/actions/syncProjectWithGitHub.ts` | 94.8 | 1 | 1 | 0% | 0.11 | 4.0 |
| `src/actions/documentActions.ts` | 95.4 | 1 | 1 | 0% | 0.06 | 3.0 |
| `src/actions/formatCode.ts` | 94.8 | 1 | 1 | 0% | 0.16 | 2.0 |
| `src/actions/auditDependencies.ts` | 96.0 | 1 | 1 | 0% | 0.11 | 2.0 |
| `src/actions/buildProject.ts` | 96.0 | 1 | 1 | 0% | 0.11 | 2.0 |
| `src/actions/lintCode.ts` | 96.0 | 1 | 1 | 0% | 0.11 | 2.0 |
| `src/actions/checkProject.ts` | 95.0 | 1 | 2 | 0% | 0.08 | 1.0 |

**Average maintainability index:** 92.4/100

### Hotspots (16 files, since 6 months)

| File | Score | Commits | Churn | Density | Fan-in | Trend |
|:-----|:------|:--------|:------|:--------|:-------|:------|
| `src/actions/documentApiReference.ts` | 51.8 | 12 | 463 | 0.48 | 1 | cooling |
| `src/actions/documentBundleSizes.ts` | 51.1 | 35 | 1188 | 0.27 | 1 | cooling |
| `src/actions/checkConfigFiles.ts` | 47.9 | 40 | 483 | 0.23 | 1 | cooling |
| `src/utilities/index.ts` | 44.3 | 32 | 432 | 0.24 | 20 | cooling |
| `src/actions/documentDependencies.ts` | 32.1 | 22 | 406 | 0.26 | 1 | cooling |
| `src/actions/documentUsage.ts` | 22.0 | 15 | 328 | 0.18 | 1 | accelerating |
| `src/actions/documentOpening.ts` | 19.7 | 16 | 243 | 0.17 | 1 | stable |
| `src/actions/checkDependencies.ts` | 12.3 | 14 | 156 | 0.14 | 1 | stable |
| `vite.config.ts` | 8.9 | 16 | 102 | 0.10 | 0 | cooling |
| `src/utilities/cloudflare.ts` | 8.7 | 9 | 43 | 0.22 | 2 | cooling |
| `src/actions/formatCode.ts` | 7.1 | 7 | 38 | 0.16 | 1 | stable |
| `src/actions/documentQualitySecurity.ts` | 6.5 | 4 | 588 | 0.18 | 1 | accelerating |
| `src/actions/auditDependencies.ts` | 3.9 | 6 | 30 | 0.11 | 1 | cooling |
| `src/actions/lintCode.ts` | 3.9 | 6 | 30 | 0.11 | 1 | cooling |
| `src/actions/documentActions.ts` | 3.0 | 8 | 88 | 0.06 | 1 | cooling |
| `src/actions/documentProject.ts` | 2.7 | 3 | 70 | 0.10 | 2 | cooling |

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

