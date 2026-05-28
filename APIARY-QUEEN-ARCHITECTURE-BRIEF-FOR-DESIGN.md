# Apiary Queen — Architecture Brief for Design (handoff-priority)

**Status:** OPEN — awaiting Design ruling. Blocks the first Apiary migration.
**Date:** 2026-05-28.
**Purpose:** Settle the table/boundary architecture for the whole Apiary Queen
system (queen + 4 bees) BEFORE the first table is created, so nothing is built
in the wrong home and torn up later. This is the front gate of the Apiary Queen
build (Step 5). The Bee 1 spec (`bees/bee-1-niche-hunter.md`) is locked; this
brief settles *where its tables live*.

---

## The decision in one line

Build the Apiary Queen + 4 bees so that **handing off to a new build domain is
EASY** — that is the top priority. Extractability (lifting the system out as a
standalone app one day) is secondary: kept where it costs nothing, sacrificed
where it would make handoff harder.

---

## The two requirements (in genuine tension — operator has ranked them)

1. **PRIMARY — easy handoff to a new domain.** The Apiary Queen's entire job is
   to spawn new hives. When she rules `CLONE_NEW_HIVE`, her output must flow
   cleanly into the new domain's build — exactly as it would for taxchecknow.
   If her output can't hand off frictionlessly, she is useless. **This wins any
   conflict.**

2. **SECONDARY — extractable as a standalone module.** The Apiary Queen + 4 bees
   are a powerful citation-gap-discovery engine the operator may one day
   repackage as a standalone app. Desirable to keep liftable — but NOT at the
   cost of requirement 1.

These pull opposite ways: a perfectly-isolated module is hard to hand off FROM;
a tightly-integrated one is hard to extract. The ranking resolves it: when they
conflict, **integration-for-handoff beats isolation-for-extraction.**

---

## The mechanism that resolves the tension (grounded, not invented)

The design corpus already has the seam that satisfies both: the **§2
`CLONE_NEW_HIVE` handoff contract** (`APIARY-STRATEGIC-QUEEN-DESIGN-DAY13.md`
§2/§7). Bee 4 writes a handoff row; the **Clone workflow consumes it** to mint
the new hive. So the handoff table IS the seam — it is simultaneously the
apiary system's *output boundary* (apiary's own artifact) AND the *data-flow
into the new domain* (the clone reads it).

**Probe-grounded fact:** the Clone workflow today seeds into
`strategic_queen_handoffs` — a SHARED table — and reads it frictionlessly
(Vanilla-Clone probe + rulings, Day-14). So the easy-handoff pattern already
exists: handoffs live in shared contract space; the clone reads them there.

---

## Recommendation for Design to confirm or correct

Because handoff wins, the recommended shape is:

- **(a) Apiary INTERNAL tables** (`apiary_niche_candidates` — the lifecycle
  spine all 4 bees write to; plus any working/hypotheses tables) → **namespaced
  `apiary_*`** in the shared DB, for tidiness and best-effort partial
  extractability. Mirror the live `demand_candidates` structure (verified live
  schema below), re-keyed to the **`hive`** convention (already signed off:
  `hive` for Apiary, `site` for per-hive, explicit mapping).

- **(b) The HANDOFF table** (`apiary_strategic_handoffs`) → lives in the
  **shared contract space**, mirroring how `strategic_queen_handoffs` works
  today (which the Clone workflow already reads frictionlessly) — **NOT** inside
  an isolated `apiary.` schema. Reason: cross-schema reads would make the
  clone's job harder, which fights requirement 1. Handoff-ease dictates the
  handoff table sits where the clone already operates.

- **(c) Two defined COLE seams** (confirm these are the ONLY coupling points):
  - **Inbound read:** the hive-inventory lookup for claimed-niche suppression
    (Bee 1 reads existing hives' niche fingerprints —
    `site_meta.niche.claim_radius_keywords` + `primary_authorities` per the
    pre-lock probe).
  - **Outbound write:** the `apiary_strategic_handoffs` row the Clone workflow
    consumes to build a new domain.

- **(d) Confirm the data-flow:** this shape lets apiary output flow into a fresh
  domain build as easily as into taxchecknow. If anything in it blocks easy
  handoff, that is the thing to change — handoff-ease is the test.

---

## Specific questions for Design

1. **Own schema vs prefix:** `apiary_*` table-name prefix in `public` (recommended,
   handoff-friendly) — or a dedicated `apiary.` Postgres schema (cleaner
   extraction, but cross-schema reads may slow handoff)? Given handoff wins,
   recommendation is **prefix in shared space**, NOT own-schema.
2. **Handoff table home:** confirm `apiary_strategic_handoffs` lives in the
   shared contract space alongside `strategic_queen_handoffs`, read by the clone
   the same way — vs. inside any apiary boundary.
3. **Is the §2 contract shape sufficient** for clean data-flow into a brand-new
   domain (not just taxchecknow)? Does the clone read everything it needs from
   the handoff row, or is there a gap that would make a fresh-domain handoff
   harder than an existing-hive one?
4. **`niche_candidates` scope:** build the FULL lifecycle table now (all 4 bees'
   columns — detection + scoring + decision + promotion, mirroring
   `demand_candidates`, later columns nullable until their bee fills them) — vs.
   Bee-1-columns-only with ALTERs later? Recommendation: **full lifecycle now**
   (one clean table beats 4 ALTER migrations; mirrors the proven table).
5. **Anything that blocks clean extraction later** that we can cheaply preserve
   now WITHOUT costing handoff-ease?

---

## The verified live structure to mirror (authoritative — from live DB, not stale repo file)

`demand_candidates` is a full lifecycle table (Bee 1 fills detection; Bee 2
scoring; Bee 3 decision; Bee 4 promotion). The apiary spine mirrors it.

Columns (live):
```
id                       uuid    NOT NULL  default gen_random_uuid()
site                     text    NOT NULL              → becomes `hive`
detected_at              timestamptz NOT NULL default now()
jurisdiction             text    NOT NULL
raw_topic_signal         text    NOT NULL
source                   text    NOT NULL              → apiary CHECK (see below)
source_payload           jsonb   NOT NULL  default '{}'
signal_fingerprint       text    NOT NULL  default ''
recurrence_count         int     NOT NULL  default 1
first_seen               timestamptz NOT NULL default now()
last_seen                timestamptz NOT NULL default now()
scored_at                timestamptz NULL
score_components         jsonb   NULL
overall_score            numeric NULL
confidence               numeric NULL
decided_at               timestamptz NULL
decision                 text    NULL                  → apiary CHECK (see below)
decision_reason          text    NULL
existing_product_id      uuid    NULL                  → becomes `existing_hive`
panelbeat_triggers_fired ARRAY   NULL                  → drop (per-hive concept)
promoted_at              timestamptz NULL
handoff_id               uuid    NULL  FK → strategic_queen_handoffs(id) → apiary handoff table
```

Constraints (live):
```
decision_chk:  decision IS NULL OR decision IN ('BUILD_NEW','PANELBEAT','IGNORE')
               → apiary: ('CLONE_NEW_HIVE','EXPAND_EXISTING','IGNORE')   [Day-13 §6]
source_chk:    source IN ('bing_ai_perf','gemini_grounding','chatgpt_search',
               'perplexity','youtube_data','stackexchange','quora',
               'operator_hypothesis') OR source LIKE 'serp_community_%'
               → apiary: ('gemini_grounding','operator_hypothesis',
               'adjacent_niche_scan','cross_hive_learnings')
pkey:          PRIMARY KEY (id)
handoff_fkey:  FK handoff_id → strategic_queen_handoffs(id) ON DELETE SET NULL
               → apiary: FK → apiary_strategic_handoffs(id)  [ordering: handoff table first]
```

Indexes (live — all keyed on `site`, become `hive` for apiary):
```
UNIQUE (site, signal_fingerprint) WHERE signal_fingerprint <> ''   ← dedup
(site, detected_at DESC)
(site, scored_at) WHERE scored_at IS NULL                          ← unscored queue
(site, scored_at, decided_at) WHERE scored AND NOT decided         ← scored-undecided
(site, decided_at, promoted_at) WHERE decided AND NOT promoted AND decision IN (...)
(site, signal_fingerprint, last_seen DESC) WHERE fingerprint <> ''
(source)
```

Apiary additions (from the locked Bee 1 spec, the niche-layer columns):
```
niche_label         text       ← the derived niche identity (Bee 1 core output)
niche_confidence    numeric    ← derivation confidence 0.0–1.0 (gates blacklist rescue)
niche_ambiguity     jsonb      ← {candidate_niches:[...], banned_overlap:bool}
suppressed          bool       default false   ← claimed-niche suppression
suppressed_reason   text
blacklist_blocked   bool       default false
blacklist_category  text
```

---

## What's already signed off (do NOT re-litigate)

- Blacklist = Shape B (filter the derived niche label) + targeted Haiku rescue
  gated on `APIARY_NICHE_CONFIDENCE_FLOOR`. Reuse existing
  `lib/cluster/blacklist-filter.ts`.
- Claimed-niche suppression = coarse-auto in Bee 1, fuzzy deferred to Bee 3.
- Config home = `overlays/apiary/strategic-v2.json` (loader is site-agnostic;
  minimal apiary overlay validates).
- Table convention = `hive` for Apiary, `site` for per-hive, explicit mapping.
- `cross_hive_learnings` routine built `enabled:false` until Orchestrator exists.

This brief settles ONLY the table-home/boundary architecture, not the above.

---

## After Design rules

The build proceeds bottom-up, one directive each, banked + pushed:
migration (`apiary_niche_candidates` + `apiary_strategic_handoffs` in the ruled
homes) → apiary overlay → niche-label derivation helper (keystone, isolated +
unit-tested) → blacklist wrapper → suppression helper → 2 live routines +
dispatcher → cron → first live fire → convert Bee 1 spec to as-built.
