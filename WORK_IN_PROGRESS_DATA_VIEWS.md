# Data view workflow ─ outstanding

Consolidated on 2026-11-03 from the data view sessions of 2–3 November and the open items in
[WORK_IN_PROGRESS.md](WORK_IN_PROGRESS.md), which keeps the detail and the decisions. Item references (A2.3, D, G1)
point to that file.

At the time of writing all repos were clean and released: dpuse-shared 1.0.178, dpuse-engine 1.0.243, dpuse-app 1.0.249.

## Needs your answer or decision

- Sort, filter and group in Investigate: screen design (D).
- Store connectors in the connection list: hide connectors that can't be a source (E).
- Investigate engine setting: where it lives (F).
- Other formats: Excel, JSON, Parquet (A2.11).
- Dates with numeric time zones (`+05:30`), read as text today (A2.4).
- Port inference to Rust (A2.7).

## Not done ─ needs your OK to start

### Parsing

- Rust parser reports no parse problems; an open quote can swallow the rest of the file (A2.3).
- Stopping with an open quote may run to the end of the file.
- Skip lines, quote and escape options, and a custom delimiter.
- Encoding detected from the first 4 KB only.
- Row numbers for bad values.

### Dates and times

- Times with milliseconds (`10:30:00.123`) read as text (A2.5).
- `2024-01-15T10:30:00`, `15.01.2024` and `Jan 15, 2024` read as text.
- Microseconds give the wrong time.
- Three near-identical date parsers to merge.

### Numbers

- Cap on digit length (a 1M-digit value takes 250 ms).

### Headers

- Labels changed by type reading (`Yes`, `007`, dates).
- Year headers (`1960, 1961…`) treated as data.
- No header check for all-text or ambiguous columns.
- Duplicate and blank column names.
- Changing the header discards the audit without warning.

### Code and speed

- Pass the locale in rather than reading it in the tally.
- Import cycles in `dataTypes`.
- Per-column cache of classified values.
- Try the last matched date format first.
- Reject date-shaped values before the number check.
- Kept slices holding whole batches in memory.

### Statistics

- Mean, deviation, quartiles and histograms.
- User-adjustable null words.
- Distinct and top values beyond 1,000.

### Rust preparation

- Column-level fixture cases.
- One whitespace set shared by JS and Rust.

### Screens

- Reopening a saved data view re-detects format, encoding, parser, delimiter and headers instead of restoring them.
- Warning focus outline contrast in `ErrorNotice.vue`, and warning text style in alerts and banners.
- Casing sweep: about 7 titles in sentence case and 21 labels in Title Case.
- Accessibility of the key icons and drag handles.
- Add the agreed table rules (alignment, tints, column sizing) to `dpuse-app/CLAUDE.md`.

## Not done ─ planned

- IndexedDB store, when loading is reimplemented: plain numbers, except a whole-number column with values beyond ±2^53,
  which holds every value as a `BigInt` plus an order-preserving string key for sorting and filtering. Save each
  column's form with the table, as the SQLite and DuckDB stores do. Large-number rules: whole numbers within int64 are
  exact numbers in every store, beyond int64 they are read as text (codes), and decimals are doubles.

- Check the file's date before a load (G2).
- Keep the counts of values that didn't fit after a load (G3).
- Fix the time zone in the store connector test runs (A2.6).
- Profile the audit before the Rust port (A2.8).
- Big-number handling in Rust, during the port.
- Send Arrow batches from Rust to DuckDB, after the port (A2.9).
- Keep the downloaded file in OPFS during the audit (A2.10).
- Measure config size before sync (Phase 6.5).
- Phase 5, keep local data.
- Phase 6, workspace sync for signed-in users.

## You do this

- Test on a real iPhone and on DuckDB, with an older audited data view (G1).
- Check the fitted column widths, and the "Previewed" text at narrow widths, in Spanish too.
- Review the pinned DuckDB and Arrow versions at each DuckDB release (A2.12, ongoing).
- Two tabs saving the same data view: the last Save wins with no warning. Accepted for now.
