## Fallow: no issues found

## Fallow: 1 clone group found (0.4% duplication)

### Duplicates

**Clone group 1** (9 lines, 2 instances)

- `src/utilities/index.ts:157-165`
- `src/utilities/index.ts:172-180`

### Clone Families

**Family 1** (1 group, 9 lines across `src/utilities/index.ts`)

- Extract shared function (9 lines) from index.ts, index.ts (~9 lines saved)

**Summary:** 18 duplicated lines (0.4%) across 1 file

## Vital Signs

| Metric | Value |
|:-------|------:|
| Total LOC | 4247 |
| Avg Cyclomatic | 3.0 |
| P90 Cyclomatic | 7 |
| Cyclomatic units | Functions: 350, module scopes: 0, templates: 0 |
| Dead Files | 0.0% |
| Dead Exports | 0.0% |
| Maintainability (avg) | 91.8 |
| Hotspots (since 6 months) | 2 |
| Circular Deps | 0 |
| Unused Deps | 0 |


### File Health Scores (26 files)

| File | Maintainability | Fan-in | Fan-out | Dead Code | Density | Risk |
|:-----|:---------------|:-------|:--------|:----------|:--------|:-----|
| `src/actions/documentQualitySecurity.ts` | 91.5 | 1 | 1 | 0% | 0.19 | 15.0 |
| `src/actions/documentDependencies.ts` | 84.3 | 1 | 3 | 0% | 0.34 | 13.1 |
| `src/actions/documentBundleSizes.ts` | 87.9 | 1 | 1 | 0% | 0.31 | 13.0 |
| `src/utilities/rustCrates.ts` | 90.0 | 1 | 1 | 0% | 0.24 | 13.0 |
| `src/utilities/apiReference.ts` | 83.1 | 1 | 1 | 0% | 0.47 | 12.0 |
| `src/actions/documentOpening.ts` | 91.5 | 1 | 1 | 0% | 0.19 | 12.0 |
| `src/actions/documentUsage.ts` | 90.9 | 1 | 1 | 0% | 0.21 | 10.0 |
| `src/actions/auditDependencies.ts` | 90.6 | 2 | 1 | 0% | 0.22 | 9.0 |
| `src/vite.ts` | 91.3 | 1 | 0 | 0% | 0.29 | 8.3 |
| `src/utilities/index.ts` | 93.1 | 23 | 0 | 0% | 0.23 | 8.0 |
| `src/actions/checkDependencies.ts` | 89.6 | 1 | 2 | 0% | 0.20 | 7.0 |
| `src/actions/publishProject.ts` | 90.5 | 1 | 2 | 0% | 0.17 | 7.0 |
| `src/actions/checkConfigFiles.ts` | 90.6 | 1 | 1 | 0% | 0.22 | 7.0 |
| `src/actions/documentContributingLicense.ts` | 91.8 | 1 | 1 | 0% | 0.18 | 7.0 |
| `src/actions/testProject.ts` | 93.6 | 1 | 1 | 0% | 0.12 | 7.0 |
| `src/actions/documentProject.ts` | 87.5 | 1 | 9 | 0% | 0.11 | 6.0 |
| `src/actions/syncProjectWithGitHub.ts` | 93.9 | 1 | 1 | 0% | 0.11 | 6.0 |
| `src/utilities/cloudflare.ts` | 92.1 | 1 | 1 | 0% | 0.17 | 4.0 |
| `src/actions/lintCode.ts` | 94.7 | 1 | 1 | 0% | 0.13 | 4.0 |
| `src/actions/buildProject.ts` | 94.3 | 1 | 1 | 0% | 0.14 | 3.0 |
| `src/actions/documentActions.ts` | 95.4 | 1 | 1 | 0% | 0.06 | 3.0 |
| `src/actions/triggerGitHubRelease.ts` | 95.4 | 1 | 1 | 0% | 0.12 | 3.0 |
| `src/actions/documentApiReference.ts` | 94.4 | 1 | 2 | 0% | 0.08 | 2.0 |
| `src/actions/formatCode.ts` | 94.8 | 1 | 1 | 0% | 0.16 | 2.0 |
| `vite.config.ts` | 99.4 | 0 | 0 | 0% | 0.02 | 2.0 |
| `src/actions/checkProject.ts` | 95.0 | 1 | 2 | 0% | 0.08 | 1.0 |

**Average maintainability index:** 91.8/100

### Hotspots (24 files, since 6 months)

| File | Score | Commits | Churn | Density | Fan-in | Trend |
|:-----|:------|:--------|:------|:--------|:-------|:------|
| `src/actions/documentBundleSizes.ts` | 58.9 | 47 | 1853 | 0.31 | 1 | stable |
| `src/actions/documentDependencies.ts` | 53.5 | 35 | 1187 | 0.34 | 1 | stable |
| `src/utilities/index.ts` | 48.9 | 46 | 748 | 0.23 | 23 | stable |
| `src/actions/checkConfigFiles.ts` | 45.4 | 53 | 586 | 0.22 | 1 | cooling |
| `src/actions/documentUsage.ts` | 32.0 | 25 | 424 | 0.21 | 1 | accelerating |
| `src/actions/documentOpening.ts` | 27.9 | 27 | 455 | 0.19 | 1 | accelerating |
| `src/actions/checkDependencies.ts` | 18.4 | 20 | 256 | 0.20 | 1 | stable |
| `src/actions/documentQualitySecurity.ts` | 17.7 | 14 | 807 | 0.19 | 1 | cooling |
| `src/actions/auditDependencies.ts` | 14.7 | 13 | 255 | 0.22 | 2 | accelerating |
| `src/utilities/cloudflare.ts` | 13.9 | 15 | 324 | 0.17 | 1 | accelerating |
| `src/actions/publishProject.ts` | 10.6 | 10 | 122 | 0.17 | 1 | cooling |
| `src/vite.ts` | 8.8 | 4 | 219 | 0.29 | 1 | accelerating |
| `src/utilities/rustCrates.ts` | 8.7 | 5 | 232 | 0.24 | 1 | stable |
| `src/utilities/apiReference.ts` | 7.9 | 3 | 404 | 0.47 | 1 | cooling |
| `src/actions/formatCode.ts` | 7.0 | 9 | 44 | 0.16 | 1 | stable |
| `src/actions/documentApiReference.ts` | 5.7 | 13 | 772 | 0.08 | 1 | cooling |
| `src/actions/documentContributingLicense.ts` | 5.0 | 4 | 127 | 0.18 | 1 | stable |
| `src/actions/documentProject.ts` | 4.9 | 7 | 96 | 0.11 | 1 | cooling |
| `src/actions/lintCode.ts` | 3.9 | 7 | 49 | 0.13 | 1 | stable |
| `src/actions/syncProjectWithGitHub.ts` | 3.1 | 4 | 76 | 0.11 | 1 | stable |
| `src/actions/documentActions.ts` | 2.5 | 10 | 102 | 0.06 | 1 | stable |
| `src/actions/buildProject.ts` | 2.3 | 3 | 56 | 0.14 | 1 | cooling |
| `vite.config.ts` | 2.2 | 24 | 135 | 0.02 | 0 | stable |
| `src/actions/testProject.ts` | 2.1 | 3 | 70 | 0.12 | 1 | cooling |

*2 files excluded (< 3 commits)*

### Hidden Change Coupling (10 pairs, since 12 months)

| File A | File B | Degree | Shared | Commits A | Commits B | Strong |
|:-------|:-------|:-------|:-------|:----------|:----------|:-------|
| `src/actions/formatCode.ts` | `src/actions/lintCode.ts` | 75% | 6 | 9 | 7 | **strong** |
| `src/actions/auditDependencies.ts` | `src/actions/formatCode.ts` | 55% | 6 | 13 | 9 | **strong** |
| `src/actions/auditDependencies.ts` | `src/actions/lintCode.ts` | 50% | 5 | 13 | 7 | **strong** |
| `src/actions/checkDependencies.ts` | `src/actions/formatCode.ts` | 48% | 7 | 20 | 9 |  |
| `src/actions/checkDependencies.ts` | `src/actions/lintCode.ts` | 44% | 6 | 20 | 7 |  |
| `src/actions/documentOpening.ts` | `src/actions/documentUsage.ts` | 38% | 10 | 27 | 25 |  |
| `src/actions/documentDependencies.ts` | `src/actions/formatCode.ts` | 36% | 8 | 35 | 9 |  |
| `src/actions/documentQualitySecurity.ts` | `src/actions/documentUsage.ts` | 36% | 7 | 14 | 25 |  |
| `src/actions/documentOpening.ts` | `src/actions/documentQualitySecurity.ts` | 34% | 7 | 27 | 14 |  |
| `src/actions/auditDependencies.ts` | `src/actions/documentDependencies.ts` | 33% | 8 | 13 | 35 |  |

*Files that change together in the commit history with no import between them.*

### Refactoring Targets (3)

| Efficiency | Category | Effort / Confidence | File | Recommendation |
|:-----------|:---------|:--------------------|:-----|:---------------|
| 10.8 | hidden coupling | low / medium | `src/actions/formatCode.ts` | Changes with lintCode.ts in 6 commits (75% coupling) without an import, make the dependency explicit or move the shared logic into one module |
| 9.1 | hidden coupling | low / medium | `src/actions/lintCode.ts` | Changes with formatCode.ts in 6 commits (75% coupling) without an import, make the dependency explicit or move the shared logic into one module |
| 8.8 | hidden coupling | medium / medium | `src/actions/auditDependencies.ts` | Changes with formatCode.ts in 6 commits (55% coupling) without an import, make the dependency explicit or move the shared logic into one module |

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
- **Efficiency**: priority / effort (higher = better quick-win value, default sort)
- **Category**: recommendation type (churn+complexity, high impact, dead code, complexity, coupling, circular dep)
- **Effort**: estimated effort (low / medium / high) based on file size, function count, and fan-in
- **Confidence**: recommendation reliability (high = deterministic analysis, medium = heuristic, low = git-dependent)

[Full metric reference](https://fallow.tools/docs/explanations/health/)

</details>

