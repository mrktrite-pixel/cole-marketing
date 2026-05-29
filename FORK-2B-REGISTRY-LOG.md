# Fork-2b — Canonical Niche Registry (HARD PRE-GO-LIVE GATE)

> Append this to STATE.md (apiary) under deferred/blocking items, and sharpen the
> existing Fork-2b line in bee-1-niche-hunter.md "Deferred" + DESIGN.md.

## Status: BLOCKING go-live. Build AFTER Bee 4, BEFORE first real production fire.

**Why it's a gate, not a nicety (operator ruling 2026-05-28):** until this exists,
Bee 1 hunts against thin, drifting per-site niche fingerprints and Bee 3 has no
canonical source to route against. Result: `apiary_niche_candidates` fills with
un-deduped, mis-routed rubbish. So the registry MUST be built before the apiary runs
for real — otherwise we pollute the table on day one.

## What it is (the golden nugget, ChatGPT 2026-05-28 — taken as IDEA, not its full design)

ONE canonical `niche_registry` table = single source of truth that ALL of these read:
classification, dedup/suppression ("already covered?"), blacklist, and routing
(route-to-existing-site vs propose-new-hive). Today these are scattered across:
per-site V1 overlay fingerprints + the checked-in cluster blacklist file + getSites()
— three drifting sources. The registry collapses them to one `status`-keyed table.

Key shape (adopt the PRINCIPLE; final columns ruled at build time):
- `niche_key` (canonical stable slug, e.g. `tax.au.property.cgt`), `canonical_name`,
  `parent_niche_key` (hierarchy)
- `status` ∈ active | candidate | watchlist | blacklisted | retired  ← ONE field
  replaces separate blacklist.json / active-sites / fingerprint files
- `route_type` ∈ existing_site | new_hive_candidate | blocked | watch_only
- `site_key` (which hive owns it, if active), `include_terms[]`, `exclude_terms[]`,
  `authority_domains[]`
- pair with a `site_registry` (don't infer live sites from overlays); overlays
  REFERENCE the registry (primary_niche_key + covered_niche_keys), not replace it.

**The one-brain principle (the actual nugget):** blacklist + active + candidate +
retired are all ROWS in one table distinguished by `status`, so the same matcher
compares a signal against everything at once. No drift.

## What we EXPLICITLY do NOT take from ChatGPT's answer (over-engineering for our scale)
- Embeddings / pgvector niche matching → that's Bee 3's fuzzy layer, NOT Bee 1
  (Bee 1 stays coarse set-overlap, locked). Don't add a vector store.
- The collapsed 4-stage matcher doing all routing in one place → routing is Bee 3's
  job, spread across the bees by design; don't centralize it into one matcher.
- `niche_signal_routes` audit table, matcher cache, 3 dashboard panels → premature
  at a-few-hives scale. Revisit only if the need proves itself.
- Moving the blacklist into a DB table NOW → deferred (touches the live E-bee
  cluster-filter dependency; asymmetric reversibility). The registry SUBSUMES this
  later; until then the checked-in filter stays as-is.

## Interaction with what's already built
- Bee 1's coarse suppression (built, `e4370bc`) reads per-site fingerprints — fine
  as a coarse pass for now; the registry REPLACES that inventory source when it lands.
- Bee 1's blacklist gate (built, `34111c6`) calls the cluster filter — stays as-is;
  the registry's `status=blacklisted` rows subsume it later.
- Bee 3 (future) is the real consumer — it does the route-vs-clone decision against
  this registry. Building the registry is effectively a Bee-3 prerequisite too.

## The gate, stated plainly
Build order remainder: finish Bee 1 → Bee 2 → Bee 3 → Bee 4 → **THEN Fork-2b
registry (this) → THEN go live.** Do not fire the apiary against production intent
until the registry exists. Flagged by operator as the thing that otherwise "fills it
up with rubbish."
