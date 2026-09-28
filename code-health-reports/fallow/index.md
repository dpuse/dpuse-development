## Fallow: no issues found

## Fallow: no code duplication found

## Vital Signs

| Metric | Value |
|:-------|------:|
| Total LOC | 2731 |
| Avg Cyclomatic | 3.0 |
| P90 Cyclomatic | 6 |
| Cyclomatic units | Functions: 207, module scopes: 0, templates: 0 |
| Dead Files | 0.0% |
| Dead Exports | 0.0% |
| Maintainability (avg) | 92.1 |
| Hotspots (since 6 months) | 0 |
| Circular Deps | 0 |
| Unused Deps | 0 |


### File Health Scores (23 files)

| File | Maintainability | Fan-in | Fan-out | Dead Code | Density | Risk |
|:-----|:---------------|:-------|:--------|:----------|:--------|:-----|
| `src/actions/documentQualitySecurity.ts` | 91.8 | 2 | 1 | 0% | 0.18 | 16.0 |
| `src/actions/documentApiReference.ts` | 83.1 | 2 | 1 | 0% | 0.47 | 12.0 |
| `vite.config.ts` | 97.5 | 0 | 0 | 0% | 0.10 | 12.0 |
| `src/utilities/index.ts` | 92.2 | 21 | 0 | 0% | 0.26 | 10.0 |
| `src/actions/documentDependencies.ts` | 89.4 | 2 | 1 | 0% | 0.26 | 9.6 |
| `src/actions/testProject.ts` | 92.7 | 1 | 1 | 0% | 0.15 | 9.0 |
| `src/actions/documentBundleSizes.ts` | 89.1 | 2 | 1 | 0% | 0.27 | 7.0 |
| `src/utilities/project.ts` | 89.6 | 3 | 2 | 0% | 0.20 | 7.0 |
| `src/actions/checkConfigFiles.ts` | 90.3 | 1 | 1 | 0% | 0.23 | 7.0 |
| `src/utilities/cloudflare.ts` | 90.6 | 2 | 1 | 0% | 0.22 | 7.0 |
| `src/actions/documentContributingLicense.ts` | 92.4 | 2 | 1 | 0% | 0.16 | 7.0 |
| `src/actions/checkDependencies.ts` | 93.0 | 1 | 1 | 0% | 0.14 | 7.0 |
| `src/actions/documentUsage.ts` | 90.6 | 2 | 1 | 0% | 0.22 | 6.0 |
| `src/actions/releaseProject.ts` | 91.2 | 1 | 3 | 0% | 0.11 | 6.0 |
| `src/actions/documentOpening.ts` | 91.8 | 2 | 1 | 0% | 0.18 | 5.0 |
| `src/actions/documentProject.ts` | 88.9 | 2 | 8 | 0% | 0.08 | 4.0 |
| `src/actions/syncProjectWithGitHub.ts` | 93.1 | 1 | 2 | 0% | 0.11 | 4.0 |
| `src/actions/buildProject.ts` | 93.8 | 1 | 2 | 0% | 0.11 | 3.0 |
| `src/actions/publishProject.ts` | 93.9 | 1 | 2 | 0% | 0.10 | 3.0 |
| `src/actions/documentActions.ts` | 95.4 | 2 | 1 | 0% | 0.06 | 3.0 |
| `src/actions/formatCode.ts` | 94.8 | 1 | 1 | 0% | 0.16 | 2.0 |
| `src/actions/auditDependencies.ts` | 96.0 | 1 | 1 | 0% | 0.11 | 2.0 |
| `src/actions/lintCode.ts` | 96.0 | 1 | 1 | 0% | 0.11 | 2.0 |

**Average maintainability index:** 92.1/100

### Hotspots (14 files, since 6 months)

| File | Score | Commits | Churn | Density | Fan-in | Trend |
|:-----|:------|:--------|:------|:--------|:-------|:------|
| `src/actions/documentBundleSizes.ts` | 49.7 | 34 | 1182 | 0.27 | 2 | cooling |
| `src/actions/checkConfigFiles.ts` | 48.9 | 40 | 483 | 0.23 | 1 | cooling |
| `src/actions/documentApiReference.ts` | 43.2 | 10 | 444 | 0.47 | 2 | cooling |
| `src/utilities/index.ts` | 41.8 | 29 | 271 | 0.26 | 21 | cooling |
| `src/actions/documentDependencies.ts` | 32.8 | 22 | 406 | 0.26 | 2 | cooling |
| `src/actions/documentUsage.ts` | 19.3 | 11 | 259 | 0.22 | 2 | accelerating |
| `src/actions/documentOpening.ts` | 18.0 | 14 | 230 | 0.18 | 2 | stable |
| `src/actions/checkDependencies.ts` | 12.6 | 14 | 156 | 0.14 | 1 | stable |
| `vite.config.ts` | 9.0 | 16 | 102 | 0.10 | 0 | cooling |
| `src/utilities/cloudflare.ts` | 8.9 | 9 | 43 | 0.22 | 2 | cooling |
| `src/actions/formatCode.ts` | 7.3 | 7 | 38 | 0.16 | 1 | stable |
| `src/actions/auditDependencies.ts` | 4.0 | 6 | 30 | 0.11 | 1 | cooling |
| `src/actions/lintCode.ts` | 4.0 | 6 | 30 | 0.11 | 1 | cooling |
| `src/actions/documentActions.ts` | 3.1 | 8 | 88 | 0.06 | 2 | cooling |

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

