# Data view storage plan

How the data view workflow stores and queries data after the audit, and where workspace data (data view configs,
event query configs and later kinds) lives. Paste the **Shared context** section plus one phase into a new chat. Run the
phases in order. Each phase ends with its own checks.

## Shared context (paste with every phase)

Repos are under `/Users/jonathanterrell/DPUse/GitHub`. Follow the `CLAUDE.md` files there and in each repo. Commit to
`main`. A change to `dpuse-shared` is released (`npm run release`) before the repos that use it bump to the new version.

Decisions already made:

1. Audit is the last required step of a data view. Investigate and transform are optional.
2. The audit stores nothing. It only reads, and its result (`ContentAuditConfig`, with each column's type) is the
   schema for anything loaded later.
3. Records are loaded into a store only when the user opens investigate, re-read from the source using the audited
   types.
4. Datasets live in DuckDB-Wasm on OPFS, inside the engine worker (`dpuse-engine`, a dedicated worker, which OPFS sync
   handles need). It's loaded only when needed, so users who only audit never download it.
5. DuckDB-Wasm is pinned to a build tested with OPFS. npm `latest` (1.33.1-dev57.0) creates OPFS files but never writes
   to them. `next` 1.33.1-dev110.0 was tested and works.
6. All DuckDB use sits behind one engine module, so the MotherDuck Wasm client can later be opened in its place for
   users with a MotherDuck account. MotherDuck needs a token and has no local-only mode.
7. Only one tab can open a DuckDB database on OPFS. This was tested in Chromium 156, Firefox 157 and WebKit 27.2: a
   second open fails, even read-only. The tab holding a Web Lock owns DuckDB. Other tabs show "open in another tab"
   with a "Use here" button, which asks the owner over a `BroadcastChannel` to close and release the lock. Queries are
   not forwarded between tabs.
8. Arrow carries record batches into DuckDB. Parquet is the format for datasets saved or shared outside DuckDB.
9. Rust (`dpuse-tool-rust-csv-core-parser`) only parses. It has no storage or network code.
10. Remote stores (Postgres SaaS, D1, Turso, MotherDuck, DuckLake) are later connectors fed from the audited types.
11. The meta store is renamed the workspace store.
12. The workspace store moves from Dexie to TinyBase: a `MergeableStore` saved to IndexedDB in the browser, synced for
    signed-in users to a TinyBase `WsServerDurableObject` in `dpuse-api`. On the server it saves with
    `createDurableObjectSqlStoragePersister(…, this.ctx.storage.sql, { mode: 'fragmented' })`. Each config is one cell
    holding the whole config object, and the later save wins. (Tested: fragmented mode stores each cell in its own
    SQLite row, under the 2 MB limit for each row. The default JSON mode puts the whole workspace in one row.)
13. The app calls `navigator.storage.persist()` when the user first saves work, not when the page opens.
14. Deferred: sharing datasets as Parquet snapshots on R2 through signed links from `dpuse-api`. Not in this plan.
15. Dexie stays available as a store connector (`dpuse-connector-dexie-js`). Only the workspace store stops using it.

Code as of 2026-10-28:

- `dpuse-engine/src/engine.ts` `auditObjectContent` opens a record store through `openRecordStore`
  (`dpuse-engine/src/recordStore.ts`) when `options.recordStore` is set, and writes every chunk to it.
- `dpuse-shared/src/component/module/connector/index.ts` has `AuditObjectContentOptions.recordStore`, `RecordStoreConfig`
  and the `records` argument of `ConnectorInterface.auditObjectContent`. `objectParsing.ts`
  `auditObjectContentWithParser` takes `onRecords`.
- `dpuse-app/src/features/studio/dataViews/_dataViews.ts` `auditDataViewContent` passes
  `recordStore: await establishDataViewRecordStore(…)`.
- `dpuse-app/src/services/metaStore.ts` reads and writes the workspace through the engine and the Dexie connector
  (`LOCAL_META_STORE_CONNECTOR_ID` in `src/state/configs.ts`). Its databases are named `dpuMetaStore` (guest) and
  `dpuMetaStore-<accountId>`. It also uses the TanStack Query cache.
- Parsing runs in the parser tools. Type inference runs in JS in the engine (`constructColumnAuditor`, `inferValues`).
  The Rust parser returns records as JS values (`CsvSession.push_chunk`).

## Phase 1 ─ The audit stops storing records

Repos: `dpuse-shared`, then `dpuse-engine` and the connectors that pass `records` on, then `dpuse-app`.

1. List every user of `recordStore`, `RecordStoreConfig`, `onRecords`, the `records` argument of `auditObjectContent`,
   `openRecordStore`, `establishDataViewRecordStore` and `retrieveDataViewRecordRange`, across all repos. Show the list,
   and ask before removing anything that this phase doesn't strictly need to change.
2. In `dpuse-shared`: take the record-store option out of the audit. Release.
3. In `dpuse-engine`: the audit no longer opens a record store. Bump `dpuse-shared`. Release.
4. In each connector that implements `auditObjectContent`: stop passing records on. Bump and release.
5. In `dpuse-app`: `auditDataViewContent` no longer passes `recordStore`. Update its comment, which says records are
   stored. The investigate panel then has no data until Phase 4, so it shows a holding message.

Note: when this plan was written, dpuse-app had uncommitted work (`retrieveDataViewRecordRange` in `metaStore.ts`,
changes in `InvestigateDataPanel.vue`, a new `InvestigateDataPanel_.json` and tests) that reads the records the audit
stores. Ask the user what to do with it before starting.

Done when: an audit finishes and stores nothing; each changed repo passes `npm run lint` and `npx vitest run`, and
dpuse-app also passes `npx playwright test`.

## Phase 2 ─ Workspace store on TinyBase, local only

Repo: `dpuse-app`.

1. Add `tinybase`, pinned. TinyBase was at 10.0.1 when tested.
2. Create `src/services/workspaceStore.ts` in place of `metaStore.ts`. It has one `MergeableStore` for the current
   account, or one for guests, saved with `createIndexedDbPersister`. Keep `metaStore.ts`'s rules: one store per
   account and one for guests, nothing read until the session check is done, and everything dropped when the account
   changes. Each config is one cell holding the whole config object, in a table per kind (`dataViews` first).
3. Decide with the user whether TanStack Query stays over TinyBase or the screens read TinyBase directly. TinyBase
   already holds the data and reports changes.
4. Rename the meta store terms to workspace store across the app, its tests and its e2e tests, comments included:
   `metaStoreId`, `MetaStoreNodeId`, `META_STORE_*`, `metaStoreConnectionConfig`, and the `GuestWorkNotice.vue` and
   `SessionMenu.vue` wording.
5. One-time move: when a `dpuMetaStore` or `dpuMetaStore-<accountId>` Dexie database exists and the TinyBase store is
   empty, copy its configs across, then mark the move done. Leave the old Dexie database in place; deleting it is a
   separate decision for the user. TinyBase needs its own IndexedDB database, because it can't share the Dexie one.
6. The workspace store no longer goes through the engine or the Dexie connector. Ask before removing anything that
   only the old path used.

Done when: data views save, list, open and delete as before; guest and account work stay separate; existing saved
work is copied across once; lint, vitest and playwright pass.

## Phase 3 ─ DuckDB-Wasm in the engine

Repos: decide with the user first whether DuckDB is a new store connector (from `connectors/dpuse-connector-template`,
loaded by the engine like the others) or a module inside `dpuse-engine`. A connector matches decision 10. Either way,
all DuckDB calls go through one module (decision 6).

1. Add `@duckdb/duckdb-wasm` pinned to a tested build (decision 5), plus `apache-arrow` at the version it needs.
2. Open the database at an `opfs://` path inside the engine worker, read-write, only when first needed. Load the
   DuckDB worker and the `.wasm` file lazily from the app's own origin.
3. Tab ownership (decision 7): take a Web Lock (`navigator.locks`, available in workers) before opening, and close the
   database when the lock is released. Report "open in another tab" to the app when the lock is held elsewhere. Handle
   the "Use here" request from a `BroadcastChannel`.
4. Close the database when the user leaves the screens that need it, so idle tabs don't hold the lock.
5. Check that each DuckDB instance's scratch folder (`duckdb/scratch/<id>/` in OPFS, 64 pool files plus a manifest)
   is removed when it closes. Report any leftovers.
6. Operations: load a data view's records into a table named after the data view, replacing any earlier load; run a
   query and return Arrow batches; drop a data view's table.

Done when: a test loads records into DuckDB on OPFS and reads them back after a reload; a second tab is refused and
"Use here" moves ownership; lint and tests pass in every changed repo.

## Phase 4 ─ Load on demand and investigate

Repos: `dpuse-engine` (or the new connector), `dpuse-shared` for any new option types, `dpuse-app`.

1. Add a load operation that re-reads the source the way the audit did (same parser, delimiter and encoding), types
   each value with the audited column types, builds Arrow record batches and inserts them into DuckDB
   (`insertArrowFromIPCStream` or the Arrow table insert). Report progress as the audit does.
2. Create the table from the audited types (`ContentAuditConfig.columns`), not from values guessed during the load.
   Decide with the user what to do with a value that doesn't fit its audited type (null it, or count it and show it).
3. In `dpuse-app`: opening investigate loads the data view if it isn't loaded, or if its audit is newer than its load.
   The investigate panel then pages through rows with SQL `LIMIT`/`OFFSET` queries.
4. Deleting a data view, or auditing it again, drops its DuckDB table.

Done when: audit, then investigate, shows the records with their audited types; a re-audit followed by investigate
shows fresh data; lint, vitest and playwright pass.

## Phase 5 ─ Keep local data

Repo: `dpuse-app`.

1. Call `navigator.storage.persist()` the first time the user saves work or a load into DuckDB finishes, and only
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

Done when: two browsers signed in to the same account see each other's saves; a signed-out user's work never leaves
the browser; a token for another account is refused; lint and tests pass in both repos.

## Later (not in this plan)

- Rust parser sends Arrow IPC batches straight to DuckDB, in place of JS values. This keeps decision 9, because Rust
  only formats the batches. Do it once profiling shows the load step is slow.
- Transform, and a transformed result used as the source of another data view.
- Parquet export.
- Shared Parquet snapshots on R2 (decision 14).
- Sharing a workspace with other users: one Durable Object per shared workspace, with membership checks.
- MotherDuck as an alternative engine for users with an account (decision 6).
- Remote store connectors (decision 10).
