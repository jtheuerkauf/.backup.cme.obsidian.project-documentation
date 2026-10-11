# Memory Bloat Bugfix

## Recommendations:

1. Remove the all-run $new and $updated result arrays; retain only the existing integer counts.
2. Stop printing every changed record at the end. If manual progress needs detail, report per-page counts (as it already does) or write per-record details incrementally from the command callback—not from
   the queued job.
3. Keep $seenProjectIds unless duplicate records across pages are proven impossible. It preserves the first/newest record across duplicate pages. If its footprint eventually matters, move that deduplication
   state to a temporary DB-backed mechanism; it is a smaller concern than the change-summary arrays.
4. Optionally change the page comparison from Eloquent models to plain query rows. This reduces each page’s temporary footprint but is a secondary optimization.
5. Avoid logging full API response bodies at debug level during historical pulls. That is not expected to be retained in PHP across pages, but it adds a second full copy of each response during the page and
   creates very large logs.

## My Response:

1. The per-page result arrays are summed at the end for the count totals, correct? If so, yes they can be released once they are sent to stdout (per command options) and update the running totals.
2. Regarding the Job workload: agreed, the Job should be required to do only the fetch and upsert. It's not meant to collect statistics other than the counts for the `sync_runs` record.
   That said, the job will rarely -- if ever -- be used for historical pulls. Those will be almost exclusively done in Console.
   Generally speaking, the routine pulls will be dealing with far fewer total records so the risk of memory bloat is minimal.
3. I'm open to stashing the `$seenProjectIds` data in a temporary table to move that data out of (PHP's) memory allocation. Is this a viable path to cutting down cross-page ID tracking?
4. Regarding DB instead of Models: agreed. Add that change to the confirmed list.
5. I must have lost track of the logging. At most, log the full response ONLY when the page fails (if possible).
   Otherwise debug logging should be the record hash and Project ID to assist locating existing data and requerying projects individually.

## Assessment

Replace every `$new`/`$updated` array with per-page integer counts. `persist()` can return `new`, `updated`, and `unchanged` counts; the console callback consumes that page's counts immediately, then they are discarded.

Remove the final per-record `NEW …` / `UPDATED …` output and the all-run arrays entirely. The job result should retain only the sync-run totals: `returned`, `accepted`, `persisted`, and `errors` (plus `unchanged` only if the console summary still needs it).

Change the existing-row lookup to use the base query builder, returning plain rows rather than hydrated Eloquent models. It remains page-bounded, but removes model/cast/collection overhead.

For cross-page deduplication, do not add a temporary table. `build_central_projects.build_central_sync_run_id` already provides the durable, DB-backed "seen during this run" marker:

1. Load the page's candidate IDs with `build_central_id`, `created_at`, `payload_hash`, and `build_central_sync_run_id`.
2. Ignore rows whose stored sync-run ID is the current run.
3. Upsert the remaining new/changed rows and mark all accepted rows—including unchanged ones—with the current sync-run ID.

That removes `$seenProjectIds` from PHP memory, preserves first-page-wins ordering, and ensures a row is only considered seen after its page actually persists.

For logging:

- Keep request URL/method/status at debug level, without the response body.
- Emit per-record debug context with `build_central_id`, `payload_hash`, and computed status (`new`, `updated`, `unchanged`).
- Log the full response body only when an HTTP response is terminally failing or JSON decoding/validation fails. For exhausted 409/429 retries, retain and log only the final response body.

This gives a bounded-memory loop: one API page, its normalized rows, and its comparison rows at a time.
