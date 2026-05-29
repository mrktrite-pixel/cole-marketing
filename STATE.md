# Apiary Strategic Queen — State (cold-start handoff)

**Read this first.** Single-page handoff for a fresh chat picking up Apiary
Strategic Queen work cold.

## What the Apiary Queen is

The **cross-niche scout** — one layer above all hives. Per-hive Strategic Queens
find new *topics* within their niche; she finds entirely new *niches* COLE
should add as hives. Four bees, same shape as the per-hive queen scoped up:
**hunt (niches) → score (viability) → route (clone/expand/ignore) → compose
(the CLONE_NEW_HIVE handoff)**. She is the growth engine that makes COLE
compound from one tax hive into many. Full outcome design:
`cole-marketing/APIARY-STRATEGIC-QUEEN-DESIGN-DAY13.md`.

## Build status

| Bee | Role | Status |
|---|---|---|
| **Bee 1 — Niche Hunter** | Wide scan → `niche_candidates` | **SPEC LOCKED, NOT BUILT** — `bees/bee-1-niche-hunter.md` |
| **Bee 2 — Niche Scorer** | Niche viability score | SPEC ONLY (Day-13 §5) |
| **Bee 3 — Niche Router** | CLONE / EXPAND / IGNORE | SPEC ONLY (Day-13 §6) |
| **Bee 4 — Clone Proposal Composer** | `apiary_strategic_handoffs` row | SPEC ONLY (Day-13 §7) |

**Nothing is built yet.** This is net-new construction (Day-13 §14). We are at:
Bee 1 scoped + Design-reviewed + locked + documented (Step 4 done). Next is
Step 5 — build Bee 1, starting with the table-convention ruling + migration.

## How we got here (the verify-before-compose trail)

Three READ-ONLY Session-A probes + Design-chat input grounded the Bee 1 spec.
Do NOT re-derive from memory — the findings are banked in the Bee 1 spec's
"Provenance" section. Headlines:
- The per-hive Strategic "Queen" is a **synthesis cron route + bees, not a
  class**; the bees are **config-driven and tax-clean in logic** (vanilla held).
- The overlay loader is **site-agnostic** — `overlays/apiary/strategic-v2.json`
  loads cleanly; a minimal apiary overlay validates (no taxchecknow-shaped
  fields required).
- The **blacklist already exists** (`lib/cluster/blacklist-filter.ts`) but is
  **topic-granular** — it false-blocks niches that merely mention a banned word,
  so Bee 1 feeds it **niche labels**, not raw text (Shape B + targeted rescue).
- Hive-niche identity is readable only as a **fingerprint**
  (`site_meta.niche.claim_radius_keywords` + `primary_authorities`) — no
  canonical niche slug; `getSites()` ≠ sites-with-overlays (drift).

## The keystone design bet (honest status)

The single thing we could NOT verify in advance: whether **niche-label
derivation** (turning a wide signal like *"how is crypto staking taxed"* into a
clean niche label + confidence) is cheap or is the *hardest part of Bee 1*. The
table she writes (`niche_candidates`) is design-only — there was nothing to read.
The spec treats derivation as a **core step she must perform**, not a free
byproduct. Its stability is the #1 thing the first live fire validates. This is
a design bet built to be tested, not a verified fact — flagged so no future chat
mistakes it for one.

## Locked decisions (Step 3)

- **Blacklist:** Shape B (filter the derived niche label) + targeted Haiku
  rescue gated on `APIARY_NICHE_CONFIDENCE_FLOOR` (named tunable const, init
  `0.6`) OR banned/non-banned ambiguity. Reuse the existing filter; no migration.
- **Claimed-niche suppression:** coarse-auto in Bee 1 (set-overlap on existing
  hives' niche fingerprints), fuzzy near-niche judgment deferred to Bee 3,
  operator override always. Caveat: only as good as the thin hive-inventory.
- **Config home:** `overlays/apiary/strategic-v2.json`.
- **Table convention:** `hive` for Apiary, `site` for per-hive, explicit
  mapping. Rule formally before the migration.
- **Edit-surface:** deferred (blacklist stays a checked-in file).
- **`cross_hive_learnings`:** built `enabled:false` until Orchestrator exists.

## Open prerequisites (resolve at/before build)

1. **Table-convention ruling** (Design) — then `niche_candidates` + apiary
   hypotheses migration on the `hive` convention, incl. hive↔site mapping.
2. **Routine-schema decision** — the V2 `RoutineSchema.name` enum is the 6
   per-hive routines; apiary routine names (`adjacent_niche_scan`,
   `cross_hive_learnings`) need an extended enum or an apiary schema. Do NOT
   silently reuse the per-hive enum.
3. **`niche_candidates` final columns** — ruled at migration time.

## Dashboard (not built)

She needs her own surface, selected by the dropdown swapping to `apiary`. The
loader supports `'apiary'`; the dropdown's swap-the-whole-surface mechanism does
NOT exist (current dropdown is hard-scoped to sites — `?site=` + `.eq("site",…)`
everywhere). Mirror the per-hive Monitor panel
(`/dashboard/monitor/strategic-queen` + `getStrategicQueenMonitor`). UI build is
its own stone, after the bees.

## Next step

**Step 5 — build Bee 1**, in order (one directive each, banked + pushed):
table-convention ruling → migration → routine-schema → apiary overlay →
niche-label derivation helper (keystone, build + unit-test isolated) →
blacklist wrapper → suppression helper → 2 live routines + dispatcher → cron →
first live fire → convert the Bee 1 spec to as-built.

## Doc pointers

- `bees/bee-1-niche-hunter.md` — the locked Bee 1 spec (full detail + provenance).
- `README.md` — index.
- `DESIGN.md` — decisions log.
- `cole-marketing/APIARY-STRATEGIC-QUEEN-DESIGN-DAY13.md` — original design §1–§17.
- Per-hive template mirrored: `docs/help/strategic-queen-v2/`.
