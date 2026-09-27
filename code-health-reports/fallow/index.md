## Fallow: no issues found

## Fallow: no code duplication found

## Vital Signs

| Metric | Value |
|:-------|------:|
| Total LOC | 2410 |
| Avg Cyclomatic | 2.9 |
| P90 Cyclomatic | 6 |
| Cyclomatic units | Functions: 174, module scopes: 0, templates: 0 |
| Dead Files | 0.0% |
| Dead Exports | 0.0% |
| Maintainability (avg) | 92.2 |
| Hotspots (since 6 months) | 4 |
| Circular Deps | 0 |
| Unused Deps | 0 |


### File Health Scores (16 files)

| File | Maintainability | Fan-in | Fan-out | Dead Code | Density | Risk |
|:-----|:---------------|:-------|:--------|:----------|:--------|:-----|
| `src/actions/documentGovernance.ts` | 91.8 | 1 | 1 | 0% | 0.18 | 16.0 |
| `vite.config.ts` | 97.5 | 0 | 0 | 0% | 0.10 | 12.0 |
| `src/utilities/index.ts` | 91.9 | 14 | 0 | 0% | 0.27 | 10.0 |
| `src/actions/documentDependencies.ts` | 89.4 | 1 | 1 | 0% | 0.26 | 9.6 |
| `src/actions/manageProject.ts` | 89.4 | 1 | 3 | 0% | 0.17 | 9.0 |
| `src/actions/documentApiReference.ts` | 85.5 | 2 | 1 | 0% | 0.39 | 8.0 |
| `src/actions/documentBundleSizes.ts` | 89.1 | 1 | 1 | 0% | 0.27 | 7.0 |
| `src/actions/checkConfigFiles.ts` | 90.3 | 1 | 1 | 0% | 0.23 | 7.0 |
| `src/utilities/cloudflare.ts` | 90.6 | 2 | 1 | 0% | 0.22 | 7.0 |
| `src/actions/checkDependencies.ts` | 92.7 | 1 | 1 | 0% | 0.15 | 7.0 |
| `src/actions/documentUsage.ts` | 90.9 | 1 | 1 | 0% | 0.21 | 6.0 |
| `src/actions/documentOpening.ts` | 93.3 | 1 | 1 | 0% | 0.13 | 3.0 |
| `src/actions/documentActions.ts` | 95.4 | 1 | 1 | 0% | 0.06 | 3.0 |
| `src/actions/formatCode.ts` | 94.8 | 1 | 1 | 0% | 0.17 | 2.0 |
| `src/actions/auditDependencies.ts` | 96.0 | 1 | 1 | 0% | 0.11 | 2.0 |
| `src/actions/lintCode.ts` | 96.0 | 1 | 1 | 0% | 0.11 | 2.0 |

**Average maintainability index:** 92.2/100

### Hotspots (15 files, since 6 months)

| File | Score | Commits | Churn | Density | Fan-in | Trend |
|:-----|:------|:--------|:------|:--------|:-------|:------|
| `src/actions/documentBundleSizes.ts` | 90.3 | 34 | 1182 | 0.27 | 1 | cooling |
| `src/actions/checkConfigFiles.ts` | 85.2 | 39 | 479 | 0.23 | 1 | cooling |
| `src/utilities/index.ts` | 70.0 | 27 | 259 | 0.27 | 14 | cooling |
| `src/actions/documentDependencies.ts` | 55.3 | 21 | 403 | 0.26 | 1 | cooling |
| `src/actions/manageProject.ts` | 40.3 | 23 | 778 | 0.17 | 1 | cooling |
| `src/actions/documentGovernance.ts` | 34.5 | 13 | 737 | 0.18 | 1 | accelerating |
| `src/actions/documentUsage.ts` | 26.4 | 9 | 241 | 0.21 | 1 | accelerating |
| `src/actions/checkDependencies.ts` | 22.0 | 13 | 154 | 0.15 | 1 | cooling |
| `src/actions/documentOpening.ts` | 21.4 | 13 | 205 | 0.13 | 1 | stable |
| `src/utilities/cloudflare.ts` | 16.3 | 9 | 43 | 0.22 | 2 | cooling |
| `vite.config.ts` | 14.8 | 15 | 100 | 0.10 | 0 | cooling |
| `src/actions/formatCode.ts` | 11.2 | 6 | 37 | 0.17 | 1 | cooling |
| `src/actions/documentActions.ts` | 5.6 | 8 | 88 | 0.06 | 1 | cooling |
| `src/actions/auditDependencies.ts` | 5.4 | 5 | 29 | 0.11 | 1 | cooling |
| `src/actions/lintCode.ts` | 5.4 | 5 | 29 | 0.11 | 1 | cooling |

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

