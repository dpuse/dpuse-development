# Data view storage plan

How the data view workflow stores and queries data after the audit, and where workspace data (data view configs,
event query configs and later kinds) lives. Paste the **Shared context** section plus one open item or phase into a new
chat. Each item ends with its own checks.

## Shared context (paste with every phase)

Repos are under `/Users/jonathanterrell/DPUse/GitHub`. Follow the `CLAUDE.md` files there and in each repo. Commit to
`main`. A change to `dpuse-shared` is released (`npm run release`) before the repos that use it bump to the new version.
`dpuse-development` bundles `dpuse-shared` into its own build, so a change to the connector config schema (for example a
new action name) also needs `dpuse-development` bumped and released before a connector using it can release.

Decisions already made:

1. Audit is the last required step of a data view. Investigate and transform are optional.
2. The audit stores nothing. It only reads, and its result (`ContentAuditConfig`, with each column's type) is the
   schema for anything loaded later.
3. A data view's records are loaded into a store the first time the user opens investigate, re-read from the source
   using the audited types. They stay saved on OPFS across sessions, and are loaded again only when the audit changes or
   the user chooses 'Load again'. The engine reads from the source connector and writes to the store connector, so the
   records never pass through the app.
4. There are two store connectors, and the user will choose between them. SQLite is the default.
   - `dpuse-connector-sqlite-wasm`: light. The `.wasm` is 0.4 MB gzipped, and starting it takes about 15–30 MB of
     memory. Grouping takes 0.4–2.5 s at 1–3M rows.
   - `dpuse-connector-duckdb-wasm`: fast. The `.wasm` is 8.4 MB gzipped, and starting it takes about 180–390 MB of
     memory. Grouping takes under 0.1 s at 3M rows.
5. Both are built from `connectors/dpuse-connector-template` and published to R2 like every other connector. Each
   serves its own `.wasm` (and DuckDB's worker script) from its R2 folder. They can't come from `my.dpuse.app`, because
   Workers Static Assets limits each file to 25 MiB and DuckDB's `.wasm` is 33.7 MB. `uploadModuleToR2` uploads `.wasm`
   as `application/wasm`, which Cloudflare compresses (checked: Brotli).
6. Both connectors implement the same store actions in `dpuse-shared`: `openStore`, `closeStore`, `loadObjectRecords`,
   `queryRecords` and `dropObject`. Queries are structured (filters, sorts, grouping with count, countDistinct, sum,
   average, minimum and maximum, offset and limit). Columns are named by their position in the audit's columns, because
   an audited column has a label but no id. Results come back in one engine-neutral shape (`StoreRecord[]`).
7. Data is saved on OPFS from the start, one database per connector, one table per data view (named by its id).
8. Only one tab can use a store. This is an OPFS limit, not an engine one: tested in Chromium, Firefox and WebKit for
   both engines. Each connector takes a Web Lock before opening and releases it on close. A second tab gets
   'heldElsewhere' and the app shows "Investigate is open in another tab". A 'Use here' handoff is deferred.
9. DuckDB-Wasm is pinned to `1.33.1-dev110.0` (npm `latest` 1.33.1-dev57.0 doesn't write to OPFS and lacks the
   `duckdb-base.wasm` the build needs), with `apache-arrow` 17.0.0, the major version DuckDB depends on (`^17.0.0`). The
   connector's `.ncurc.json` rejects both, so 'npm run check' can't offer `latest`, and 'Check configuration files'
   reporting that file as different is expected. Raise either pin by hand, and test the round trips when doing so.
   SQLite Wasm is pinned to `3.54.1-build1` on the `opfs-sahpool` VFS, which needs no COOP/COEP.
10. A value that doesn't fit its column's audited type is stored as null. (Chosen while building. Revisit if the user
    wants such values counted or shown.)
11. Remote stores (MotherDuck, Turso, D1, Postgres) come later as their own connectors implementing the same store
    actions. MotherDuck no longer needs cross-origin isolation (removed in wasm-client 1.5.2), but needs CSP entries for
    `app.motherduck.com`.
12. Rust (`dpuse-tool-rust-csv-core-parser`) only parses. It has no storage or network code.
13. The meta store is renamed the workspace store, on TinyBase: a `MergeableStore` saved to IndexedDB, synced for
    signed-in users to a TinyBase `WsServerDurableObject` in `dpuse-api`, saved with
    `createDurableObjectSqlStoragePersister(…, this.ctx.storage.sql, { mode: 'fragmented' })`.
14. The app calls `navigator.storage.persist()` when the user first saves work, not when the page opens.
15. Deferred: sharing datasets as Parquet snapshots on R2 through signed links from `dpuse-api`.
16. Dexie stays available as a store connector (`dpuse-connector-dexie-js`). Only the workspace store stopped using it.

How it works, as of 2026-10-30:

- `dpuse-engine/src/engine.ts` `loadObjectRecords` reads the source with `retrieveRecords`, skips the header record,
  types each value with `constructStoreRecord` (`src/storeRecords.ts`) and hands the chunks to the store through
  `createStoreRecordQueue`. While the queue holds more than 2 chunks, the source waits before reading on.
- `dpuse-app/src/features/studio/dataViews/_dataViewStore.ts` holds `INVESTIGATE_STORE_CONNECTOR_ID` (SQLite, set in code
  until there is a setting) and remembers which audit each data view was loaded from, in local storage
  (`dpuse-investigate-loads`).
- `InvestigateDataPanel.vue` opens the store, loads when needed with progress and Stop, shows the 'heldElsewhere' and
  'unavailable' messages, pages through records in `Table`, and closes the store on leaving.
- DuckDB connector workarounds, all in its `src/index.ts` and `src/duckdbSql.ts`:
    - DuckDB's worker starts from a blob that creates its own Trusted Types policy (`dpuse-connector-duckdb-wasm`, listed
      in the app's CSP) and `importScripts` the worker script from R2. A module worker fails under the app's CSP.
    - Arrow columns are built from typed arrays with `makeData`, because Arrow's builders use `new Function`, which the
      CSP forbids. Dates are staged as milliseconds and cast in SQL.
    - DuckDB leaves `duckdb/scratch/<id>/` (about 66 files) in OPFS. Each open removes the previous one, so at most one
      remains.
- Both CSV parser tools implement `parseStream` and `parseText`: `dpuse-tool-rust-csv-core-parser` (the default, set
  by `DEFAULT_PARSER_TOOL_IDS` in dpuse-shared) and `dpuse-tool-adaltas-csv-parser` (`csv-parse`). The user picks one in
  the item preview, and the audit and the load use the same one. An item previewed before Rust became the default keeps
  the parser saved with its preview. Both read the stream in 1 MB slices (see item A under Done). The Rust tool reports
  no preview issues, because `csv-core` never reports a parse error.

Released: dpuse-shared 1.0.165, dpuse-development 1.0.141, dpuse-engine 1.0.228, dpuse-app 1.0.232, Adaltas CSV parser
1.0.126, Rust CSV parser 1.0.116, SQLite connector 1.0.8, DuckDB connector 1.0.6, file store emulator connector 1.0.339,
application emulator connector 1.0.138, dexie connector 1.0.114, dbnomics connector 1.0.113.

## Done

- **Phase 1 ─ The audit stops storing records.**
- **Phase 2 ─ Workspace store on TinyBase, local only.**
- **Phase 3 ─ Store connectors.** Store actions in dpuse-shared. SQLite and DuckDB connectors on OPFS, with the Web Lock
  and tested cross-origin under the app's CSP in Chromium, Firefox and WebKit. Measured on OPFS at 1M rows: SQLite loads
  in 1.9–3.0 s and groups in 0.9–1.4 s, DuckDB loads in 0.9–1.5 s and groups in about 15 ms.
- **Phase 4 ─ Load on demand and investigate.** The engine's load operation, and the investigate panel with paging. The
  user has tested it in the released app, and it works.
- **A ─ Large audits crashed on iOS.** Fixed and tested by the user: a 168 MB, 375,000-record CSV audits in 59 s on an
  iPhone 13 and 35 s in desktop Chrome on an M4.
    - Cause: WebKit hands over a file stream in pieces of about 18 MB, against about 2 MB in Chromium. Parsing a piece
      that large at once took the tab past 5 GB. Reading the stream alone stays at 0.15 GB.
    - Fix: both parsers read each piece in 1 MB slices (`MAX_SLICE_BYTE_COUNT`). The Adaltas parser also waits for
      'drain'.
    - Peak memory in WebKit on a Mac (Playwright), before and after: csv-parse reading only 5.7–7.4 GB → 0.58 GB;
      csv-parse audit 5.6–7.5 GB → 0.93 GB; Rust reading only 1.3 GB → 0.51 GB; Rust audit 3.9–7.3 GB → 1.95 GB
      (0.86 GB on the iPhone 13 itself, see A2). WebKit runs vary by up to 3 GB from one run to the next, so repeat a
      run before trusting it. Chromium stays under 0.6 GB throughout. On iPhone, Safari's page process has a soft limit
      of about 1.5 GB.
    - Tested and ruled out: the per-value objects (`cast` in csv-parse made no difference) and GC lag (yielding between
      chunks made no difference).
    - To reproduce: generate the CSV with Python (14 columns, a long quoted notes column), bundle a worker that runs the
      tool's `parseStream` with the engine's `constructColumnAuditor`, and sample the `ps` RSS of Playwright's WebKit
      `WebContent` process every 250 ms.
- **B ─ Store queue limit.** `createStoreRecordQueue` makes the source wait while more than 2 chunks are queued, and
  lets it go if the store stops reading. The connector `chunk` callback may return a promise for this.

## Open items

### A2 ─ Audit performance

- Date and time inference took about 85% of the audit's time: every value of 8 characters or more was split again for
  each format. `temporalInference.ts` now splits each value once and skips values with no digit. Same results on
  308,700 distinct values. The audit fell from about 62 s to 14 s in WebKit and from 34 s to 13 s in Chromium, at the
  same peak memory (0.89–0.99 GB in four of five WebKit runs, 1.97 GB in one). (Done, released in dpuse-engine
  1.0.225.)
- Audit times measured by the user on the 168 MB, 375,000-record CSV, from the file store emulator connector:

    | Device             | csv-parse, before the date and time change | csv-parse, after | Rust, after  |
    | ------------------ | ------------------------------------------ | ---------------- | ------------ |
    | Desktop Chrome, M4 | 35 s                                       | 22 s             | 15.7 s       |
    | iPhone 13          | 59 s                                       | 37 s             | 26.1 s       |
    | iPhone 15          | 59 s                                       | not measured     | not measured |

- The same audit with the released inference rework, measured by the user with the default parser (Rust): desktop
  Chrome 11.2 s with 0.1 s waiting for data, iPhone 13 17.5 s with 0.8 s waiting for data.
- The investigate load of the same file, measured by the user with the app's load time: SQLite 17.7 s and DuckDB 13.6 s
  in desktop Chrome, SQLite 28.3 s and DuckDB 21.2 s in iPhone Safari.
- The audit summary now shows 'Waiting for data': the part of the duration the parser sat idle waiting for the next
  piece of the file (`sourceWaitDuration`, from `auditObjectContentWithParser`). Measured 0.1 s on desktop with either
  parser, 0 s on the iPhone 13 with csv-parse and 0.8 s with Rust. The download is always ahead of the parser, so
  the time is processing, not network. The wait for the server's first response falls before the audit's clock starts
  and is not counted.
- Peak memory on the iPhone 13 during the audit, recorded with Safari's Web Inspector (Timelines, Memory track):
  csv-parse 1.04 GB, Rust 0.86 GB. Both are under Safari's soft limit of about 1.5 GB. Memory returns to under 0.4 GB
  once the audit ends. Recording slows the phone, so the audit took about 55 s (csv-parse) and 45 s (Rust) while
  recorded.
- The WebKit benchmark on a Mac is a fair guide for csv-parse (0.93 GB) but not for Rust, where it gave 1.95 GB. Check
  memory on the phone before acting on a benchmark figure.
- Parsing alone, without the audit, takes about 0.7 s with Rust and 5.7 s with csv-parse in WebKit. Most of the
  audit's time is type inference in JavaScript, not parsing.
- The quoted flag (`valueWasQuoted`) cost nothing measurable: removing csv-parse's `cast` changed neither memory nor
  time. Building one `{ value, valueWasQuoted }` object per value costs about 0.4 GB of the Rust parser's 1.3 GB peak
  (before slicing) and little time.

Inference rework (all released, in the versions listed above):

- `classifyValue` (`src/dataTypes/inference/classification.ts`) says what a value is, for counting. The preview and the
  audit count through `src/dataTypes/columnTally.ts`. `convertValue` (`src/dataTypes/conversion.ts`) reads a value as
  its column's audited type for the load, with no guessing. `tests/fixtures/inferenceCases.json` holds 179 values and
  their expected results as plain data, for the Rust port to pass too.
- Column rules: blanks are left out of the 70%. The 70% applies to the main type (numeric, temporal), and the column
  takes the widest subtype present. A column under 70% is text, so nothing is lost. A column of only void values stays
  'unknown'. `invalidValueCount` counts the values that do not fit, which load as null.
- Columns record `formats` (a count per format, for dates, numbers and booleans), `dateOrderId`, `decimalSeparatorId`
  and `isFormatAmbiguous`. A column's unambiguous values settle how its ambiguous ones (`03/04/2024`, `1,234`) are read.
  With no proof the browser's locale decides, and the audit screen says the column is unclear.
- Audits saved before this have no `formats` and may have 'unknown' columns, so audit them again before loading.
- `inferenceRecords` is no longer saved with a preview. The preview table shows `parsedRecords`.
- A blank value in a text column now loads as null rather than an empty string.
- A date, date-time or time with no time zone is taken as UTC, so the same text stores the same value in every browser,
  and investigate shows every date in UTC. A value with a time zone is therefore shown converted to UTC.
  `LOAD_FORMAT_VERSION` in `_dataViewStore.ts` is raised when stored values change meaning, so existing loads run again.
- Stored forms, chosen by measuring 375,000 values. SQLite has no date type, and its docs leave the choice to the
  application: a date is a whole number of days since 1970 (3.60 MB against 6.46 MB as text), a date and time is
  milliseconds since 1970 (5.02 MB against 9.72 MB), and a time is milliseconds since midnight (4.28 MB against 7.20 MB
  with milliseconds). `isDayNumber` on a stored column marks day numbers, so a date column loaded earlier still reads
  correctly. DuckDB uses `DATE` (1.01 MB), `TIME` (2.01 MB) and `TIMESTAMP` (2.76 MB). It returns `TIME` as bigint
  microseconds, but `DATE` and `TIMESTAMP` as milliseconds. SQLite's own date functions expect seconds, so SQL using
  them must convert first.
- The engine and the app run their unit tests in one fixed time zone, set in `vitest.config.ts`. It is not UTC, so code
  wrongly using local time fails on every machine.
- Audit of the 166 MB CSV in WebKit: about 8 s with csv-parse (was about 14 s) and 3 s with Rust. Peak 0.87 GB with
  csv-parse (1.56 GB in one of three runs) and 1.2 GB with Rust. Chromium with Rust: 3.3 s, 0.23 GB.

Rejected: doing the audit and the load in one pass. It only helps while type inference is in JavaScript, and it
conflicts with moving inference to Rust, where reading the file a second time costs little.

Outstanding, in the suggested order:

1. Test the released app. The date and time storage has only been tested in Node, against real SQLite and DuckDB, not in
   a browser on OPFS. Re-audit a data view, load it into SQLite, then set `INVESTIGATE_STORE_CONNECTOR_ID` to DuckDB and
   load it there. Check that dates, times and date-times show correctly on desktop and on the iPhone. (Done.)
2. Measure the audit and the investigate load on the iPhone with the released code. The audit took 17.5 s on the
   iPhone 13. The load took 28.3 s with SQLite and 21.2 s with DuckDB. Use Safari's Web Inspector for memory: the pencil
   beside 'Enabled Timelines', tick Memory, untick Screenshots, and untick 'Stop recording once page loads'.
   (Done.)
3. Report parse issues from the Rust parser, such as a quote left open. Rust is now the default, and `csv-core` reports
   none itself, so the preview gives no warnings for a malformed file. The Rust reader would have to detect them. This
   is the most important code item. (Not done.)
4. Read dates with a numeric time zone. `2023-12-31 10:11:12 +05:30` stays text, because the delimiters split the
   offset, so such a column doesn't sort as dates. `Z` and `UTC` are read. Once fixed, those values show converted to
   UTC, because the store keeps no offset. (Not done, decision pending.)
5. Read times with milliseconds and no zone. `10:11:12.123` and `10:11:12.123Z` stay text, because `ss` is split on ':'
   only. Both are recorded as today's behaviour in `inferenceCases.json`, so a fix changes those two cases. (Not done.)
6. Fix the time zone in the test runs of the store connectors, as the engine and the app do in `vitest.config.ts`. They
   pass today in UTC, New York, Tokyo and Auckland, but only by hand. (Not done.)
7. One-time port of `classifyValue` and `convertValue` to Rust, so the audit returns only the column summary and no
   value crosses into JavaScript. Most of the audit's time is inference, so this is what would make Rust much faster.
   Later changes then go into both. Both must pass `inferenceCases.json`. Changes decision 12. (Needs the user's OK.)
8. Profile the audit again for the next hotspot before the port, so the port is of the simplest code. (Not done.)
9. Send Arrow batches from Rust to DuckDB for the load (already under Later). One block of bytes per batch, with no
   per-value JavaScript. Helps DuckDB only, because SQLite binds values one at a time. Needs item 7. (Not done.)
10. Keep the downloaded file in OPFS during the audit, so the load reads it locally. Low value while 'Waiting for data'
    is under 1.5 s, but useful for slow connections or connectors with rate limits. (Not done.)
11. Other formats. A parser tool declares its formats in `dataFormatIds`, and the format list already holds JSON, JSON
    Lines, Parquet and Excel. Parquet could read through DuckDB. This widens what users can open more than another CSV
    parser would. Papa Parse and uDSV were looked at and rejected: they add nothing the two parsers don't have. DuckDB's
    own CSV reader is the one option worth revisiting. (Needs the user's decision.)
12. Review the pinned DuckDB and Arrow versions at each DuckDB release, for security fixes and a supported production
    release. Neither is offered by 'npm run check' any more. See the TODO at the top of the connector's `src/index.ts`.
    (Ongoing.)
13. `eslint-plugin-n` 18.5.0 flags the browser's `Worker` as an experimental Node feature, which is a false alarm. Any
    other repo using `Worker` gets the same lint error when it updates, and needs the same disable comment with a
    reason. (Done.)

### C ─ Deleting a data view leaves its stored table

`useDeleteDataView` doesn't drop the table. Opening the store just to drop it would download DuckDB, so decide when it
is dropped: on delete if the store is free, or the next time investigate opens. (Not done.)

### D ─ Sort, filter and group in investigate

The connectors and `queryRecords` support all three. The panel only pages. Needs the user's decision on the screen
design.

### E ─ Store connectors in the connection list

The SQLite and DuckDB connectors need no sign-in, so `connectionConfigs` in `dpuse-app/src/state/configs.ts` gives them
a connection, and they appear when choosing a connection for a new data view. Needs the user's decision on whether
connectors that can't be a source are hidden there.

### F ─ Investigate engine setting

`INVESTIGATE_STORE_CONNECTOR_ID` is set in code. Needs the user's decision on where the setting lives, with the
trade-off in plain words and a confirmation before the larger DuckDB download.

## Phase 5 ─ Keep local data

Repo: `dpuse-app`.

1. Call `navigator.storage.persist()` the first time the user saves work or a load into a store finishes, and only
   while `navigator.storage.persisted()` is false. Don't ask again straight after a refusal.
2. Firefox shows a prompt, while Chrome and Safari decide by themselves. A WebKit bug reports that Safari 17 always
   answers no. Treat a refusal as normal, not as an error.

Done when: the call happens once at the right moment and the app behaves the same whatever the answer; lint and tests
pass.

## Phase 6 ─ Workspace sync for signed-in users

Repos: `dpuse-api`, then `dpuse-app`.

1. In `dpuse-api`: add a Durable Object class that extends TinyBase's `WsServerDurableObject`. Its `createPersister`
   returns this persister:
   `createDurableObjectSqlStoragePersister(createMergeableStore(), this.ctx.storage.sql, { mode: 'fragmented' })`.
   Add the class to `wrangler.jsonc` under a new migration tag in `new_sqlite_classes`. Use one object per account for
   now (`idFromName(accountId)`).
2. Check sign-in before routing to the object. A browser can't set an `Authorization` header on a WebSocket, so agree
   with the user how the token travels (a short-lived token in the URL, or a subprotocol), then verify it with the
   same secret as `verifyAuthorisationToken` in `src/token.ts`. The account in the token must match the requested
   workspace.
3. In `dpuse-app`: for a signed-in user, start a `createWsSynchronizer` on the workspace store after the session
   check. Stop it on sign-out or account change. Guests stay local only.
4. When the connection drops, keep working locally. The synchroniser catches up when it reconnects.
5. Before syncing, check the size of a saved data view config. It holds the whole preview (`previewConfig`): the raw
   text, the parsed records and the typed values (`inferenceRecords`), so each previewed value is stored three times.
   Each config is one cell, and a Durable Object row is limited to 2 MB. Measure a large preview, and decide whether
   to save less, e.g. drop the text or the parsed records and rebuild them when needed. (Not done.)

Done when: two browsers signed in to the same account see each other's saves; a signed-out user's work never leaves
the browser; a token for another account is refused; lint and tests pass in both repos.

## Later (not in this plan)

- A 'Use here' handoff between tabs for the store (decision 8).
- Rust parser sends Arrow IPC batches straight to DuckDB, in place of JS values. This keeps decision 12, because Rust
  only formats the batches.
- Transform, and a transformed result used as the source of another data view.
- Parquet export.
- Shared Parquet snapshots on R2 (decision 15).
- Sharing a workspace with other users: one Durable Object per shared workspace, with membership checks.
- MotherDuck and other remote store connectors (decision 11).
