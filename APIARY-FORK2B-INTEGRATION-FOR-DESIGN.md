# Fork-2b — niche_registry INTEGRATION (FOR DESIGN)

**Status:** `niche_registry` table SHIPPED (`80f6321`, empty). This brief routes the *integration* decisions — the ones that touch the LIVE Bee 1 (suppression + blacklist gate) and Bee 3 reader — to Design for ruling before any code. Each question carries the builder's recommendation + rejected alternative; Design ratifies or refutes.

## What is established (researched, not assumed)

- `niche_registry` exists: 14 columns — `niche_key` (unique canonical slug), `canonical_name`, `parent_niche_key`, `status ∈ {active,candidate,watchlist,blacklisted,retired}`, `route_type ∈ {existing_site,new_hive_candidate,blocked,watch_only}`, `site_key` (text hive ref), `jurisdiction`, `include_terms[]`, `exclude_terms[]`, `authority_domains[]`, `notes`, timestamps. Cluster-wide. **Empty.**
- `sites` exists (deployed-hive table): `id`(uuid), `name`, `domain`, `cluster`, `jurisdiction_code`, `is_live`, `monthly_revenue`. It is the **site-identity** table.
- The system references hives by **text key** (`apiary_niche_candidates.existing_hive` / `handoff.expand_existing_hive` = `'taxchecknow'`), not uuid — hence `niche_registry.site_key` is text.
- The three drifting sources the registry is meant to collapse are **file/code-based**, not DB tables: per-site V1 fingerprints, cluster `blacklist.json`, `getSites()`. (DB probe found no overlay/fingerprint tables.)
- **Correction on record:** the builder initially inferred `sites` *was* the paired `site_registry`; the operator's log states `site_registry` is a **separate, possibly-not-yet-built** table. The shipped `site_key` (text, no FK) is compatible with either, so the shipped table stands.

## Q1 — site_registry: build now, or defer?

**Recommendation: DEFER.** `niche_registry.site_key` (text) already resolves against the existing hive-key convention, and `sites` already supplies deployed-hive identity (name/domain/cluster/jurisdiction/is_live). A separate `site_registry` has **no current consumer** that needs site-level fields `sites` can't provide.
**Rejected alternative — build site_registry now:** premature; it adds a table nothing reads yet, and asymmetric reversibility favors waiting (adding it later when a concrete consumer needs it is cheap; an unused table is exactly the kind of drift Fork-2b exists to kill).
**Design must rule:** is there a consumer in the plan that needs a distinct `site_registry` schema before go-live, or does `sites` + text `site_key` suffice for v1?

## Q2 — Population: backfill, or organic fill?

**Recommendation: one-time BACKFILL/SEED, before any consumer rewire.** Seed in one pass: each hive's claimed inventory → `status='active'`, `route_type='existing_site'`, `site_key=<hive>`; every `blacklist.json` entry → `status='blacklisted'`, `route_type='blocked'`; (optionally) current above-floor candidates → `status='candidate'`.
**Rejected alternative — organic fill (registry starts empty, fills as Bee 1 runs):** leaves a window where a LIVE consumer reads an incomplete registry and mis-suppresses or mis-routes real niches. Unacceptable for live bees — the registry is load-bearing only once populated.
**Design must rule:** confirm backfill-first, and confirm the three seed sources + their status/route_type mapping above.

## Q3 — Cutover: dual-read vs hard-cut, and consumer order

**Recommendation: DUAL-READ transition (registry primary, legacy fallback), staged by blast radius.** Order: (1) seed; (2) **Bee 3 reader** first — read-only routing consumer, lowest risk (a wrong read mis-routes one candidate, caught downstream by the operator gate); (3) **Bee 1 blacklist gate** — medium (a miss lets a blacklisted niche through, caught next cycle by Bee 3); (4) **Bee 1 suppression** last — highest risk, it touches the live hunt's dedup and a wrong suppression silently drops real niches. Validate each step on fixtures before the next; remove the legacy fallback only after all four are proven.
**Rejected alternative — hard-cut all consumers at once:** no rollback, all-or-nothing risk to the LIVE Bee 1/2 hunt-and-score loop.
**Design must rule:** approve dual-read + this risk-ordered sequence, or specify a different cutover.

## Q4 — Columns: are the 14 sufficient for v1?

**Recommendation: sufficient; defer additions.** Add `last_seen` / recurrence / a signal-linkage back to `apiary_niche_candidates` / evidence only when a named consumer needs them (cheap to add; premature columns are drift).
**Design must rule:** does the log specify any columns the shipped 14 omit? If so, name them and we migrate before seeding.

## What Design should return

A ruling on Q1–Q4. The substantive ones are Q2 (backfill is the gate before any rewire) and Q3 (the order in which LIVE bees get rewired). Q1 and Q4 are likely "defer / sufficient" but must be confirmed against the log. On ratification, the build order is: seed migration → Bee 3 reader (dual-read) → blacklist gate → suppression → drop legacy fallback → then the apiary cron is unblocked on the registry axis.
