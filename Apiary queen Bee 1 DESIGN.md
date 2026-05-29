# Apiary Strategic Queen — DESIGN (decisions log)

Per-bee design decisions, each with the WHY and its grounding (probe finding or
Design ruling). Mirrors `strategic-queen-v2/DESIGN.md`. Bee 1 decisions are
locked (Step 3); Bees 2–4 carry their Day-13 design until scoped.

## Where the Apiary spec lives

- **Outcome / bees / scoring / operator-gate / persona:**
  `cole-marketing/APIARY-STRATEGIC-QUEEN-DESIGN-DAY13.md` §1–§17 (the original).
- **Bee 1 locked spec:** `bees/bee-1-niche-hunter.md`.
- **Cold-start + status:** `STATE.md`.

---

## Bee 1 — Niche Hunter — design decisions (LOCKED 2026-05-28)

### 1. Output grain is the NICHE, not the topic
The per-hive Bee 1 writes topic candidates (`demand_candidates`); Apiary Bee 1
writes niche candidates (`niche_candidates`). Every other decision follows from
this. *Grounding:* Day-13 §1 (her unit of reasoning is the niche).

### 2. Niche-label derivation is a CORE step, not a free byproduct
The spec treats "turn a wide signal into a normalized niche label + confidence"
as load-bearing net-new behavior. *Why not free:* the "it's free because dedup
keys on niche identity anyway" claim could NOT be verified — `niche_candidates`
is design-only (no code to read). A fan-out query string is not a niche label;
deriving one is plausibly the hardest part of Bee 1. *Honest status:* design bet,
validated on first fire — not a verified fact. *Grounding:* Probe 1
(`niche_candidates` design-only); operator ruling (no way to know but to build).

### 3. Blacklist = Shape B (filter the niche label) + targeted rescue
The existing filter is topic-granular and false-blocks niches mentioning a
banned word (`"tax treatment of gambling winnings"` → blocked on `\bgambling\b`,
Probe 3, against real phrase lists; the filter's own comment documents the FP
class). So filter the **derived niche label**, not raw text — the
semantically-correct "block niches not topics." A cheap Haiku rescue fires ONLY
on ambiguous derivation (`niche_confidence < APIARY_NICHE_CONFIDENCE_FLOOR`
[init 0.6] OR label rolls up to ≥1 banned + ≥1 non-banned niche). *Why scoped
not blanket:* Pure-A rescues every block (wasteful, most blocks are correct);
Pure-B has no net for low-confidence labels (the genuine failure mode). The gate
is a **named tunable constant** (Design's honest flag — a vague gate either
never or always fires). *Why it matters more here:* a niche false-block is
invisible and unrecoverable (no override to add for a niche you never saw),
which strangles discovery — Bee 1's entire purpose. *Grounding:* Probe 3
(granularity) + Design ruling (B-with-targeted-rescue).

### 4. Reuse the existing blacklist filter; do NOT migrate it
Bee 1 calls `lib/cluster/blacklist-filter.ts` as-is (fed niche labels). No new
filter logic, no DB migration. *Why:* migrating the checked-in JSON to a DB
table (to enable dashboard editing) refactors a **live E-bee dependency** for a
convenience feature — asymmetric reversibility (ship-on-file is reversible;
breaking an E-bee is not). *Grounding:* Probe 2 (filter exists, every E-bee uses
it; no config-CRUD UI exists) + Design ruling (defer).

### 5. Claimed-niche suppression = coarse-auto in Bee 1, fuzzy in Bee 3
Bee 1 auto-suppresses OBVIOUS matches via set-overlap on existing hives'
`site_meta.niche.{claim_radius_keywords, primary_authorities}`; the fuzzy
"is X the same niche or its own" judgment is deferred to Bee 3 (Router) — the
CLONE-vs-EXPAND fork's natural home. Operator override always. *Why this split:*
mirrors the per-hive Bee1-coarse-dedup / Bee3-fuzzy-embedding split. *Caveat:*
only as good as the hive-inventory source (thin: placeholder `platform_accounts`
+ per-site V1 overlays; no `sites` table, no niche slug). *Grounding:* Probe 3
(only fingerprint readable; getSites ≠ overlays drift) + Design ruling.

### 6. Config home = `overlays/apiary/strategic-v2.json` (vanilla seam)
Wide prompts + cadence + budgets live in an apiary V2 overlay, read like any
site's. *Why this is the vanilla seam:* "wide" enters as **config**, keeping the
routine logic generic — the same discipline that kept the per-hive routines
tax-clean. *Grounding:* Probe 2 (loader site-agnostic) + Probe 3 (minimal apiary
overlay validates; exact required set known).

### 7. `cross_hive_learnings` built but `enabled:false`
The Orchestrator it reads is SPEC-ONLY. The cadence gate already skips
`enabled:false` routines, so build the socket and ship it off — enable when the
Orchestrator lands. *Grounding:* Probe 1 (real dispatcher filters
`routines.filter(r => r.enabled)`).

### 8. Routine-schema is an OPEN prerequisite, not silently reused
The V2 `RoutineSchema.name` is an enum of the 6 per-hive routine names; the
apiary routine names would be rejected. Must extend the enum or author an apiary
schema — flagged, NOT assumed. *Grounding:* Probe 3 (the enum shape).

---

## Table convention (LOCKED — rule formally before migration)

Apiary tables use **`hive`**; per-hive tables keep **`site`**; an explicit
hive↔site mapping joins them. *Why:* the layers reason about different things —
a *hive* is a niche-operation; a *site* is a deployed storefront. The codebase
already straddles both nouns (the real per-hive dispatcher takes `site` but
passes `hive` to routines), and `strategic_queen_operator_hypotheses` already
uses `hive`. So this is "rule which layer owns which + define the mapping," not
"introduce a noun." *Risk if ignored:* `hive` and `site` used
interchangeably-but-inconsistently, with no defined join. *Grounding:* Probe 1
(site/hive straddle) + Probe 2 (hypotheses table uses `hive`) + Design ruling.

---

## Bees 2–4 — design (as-designed, Day-13; not yet scoped/locked)

Carry the Day-13 design until each is scoped in turn:
- **Bee 2 — Niche Scorer** (§5): 7-dimension viability score. ⚠️ Will inherit
  the per-hive Bee-2 "tax-topic" prompt leak — fix in the apiary copy (copy +
  adapt), do NOT touch the live per-hive scorer.
- **Bee 3 — Niche Router** (§6): CLONE_NEW_HIVE / EXPAND / IGNORE; threshold
  8.0+; default-bias CLONE. Owns the fuzzy near-niche judgment Bee 1 defers up.
  ⚠️ Will inherit the per-hive Bee-3 product-embedder tax-seed leak — fix in the
  apiary copy.
- **Bee 4 — Clone Proposal Composer** (§7): assembles `apiary_strategic_handoffs`
  (the §2 CLONE_NEW_HIVE contract the clone workflow consumes). §17 persona
  extraction lands here (constraint: character registry is a hardcoded TS module
  — resolve the writable-surface dependency when scoping Bee 4).
