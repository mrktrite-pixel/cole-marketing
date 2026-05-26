# Vanilla Template + Clone Workflow — Design Rulings (Day 14)

**Status:** RULED + VERIFIED-against-real-code (2026-05-27). These are the locked decisions for building the
**Vanilla overlay template + Clone workflow** — the "top" of the machine that mints a new hive's overlay
(+ registry row) from an Apiary `CloneProposal`, proven by regenerating taxchecknow from vanilla.

**Scope (read first):** we are building the **Vanilla template + Clone executor ONLY** — the thing that
*consumes* the Apiary Queen's §2 `CLONE_NEW_HIVE` contract so she plugs in later. We are **NOT** building
the Apiary Strategic Queen, **NOT** the cross-hive COLE Orchestrator. The **taxchecknow round-trip is the
acceptance test** (self-contained — needs no 2nd hive).

> Banked durably because a ruling in a chat is one compaction from gone (the lesson from the Apiary-doc
> rescue → committed `c054821`). Companion: `APIARY-STRATEGIC-QUEEN-DESIGN-DAY13.md` (the §2 clone-proposal
> contract), §17 of which (Day-14 addition) carries the persona-extraction requirement this doc references.

---

## The overlay reality these rulings rest on (verified)

- The bees read **`overlays/<site>/strategic.json`** (V1, `OverlayConfigSchema`, via `getHiveConfig →
  loadOverlay`) — the PQ bees A–H — **AND** **`overlays/<site>/strategic-v2.json`** (`StrategicV2ConfigSchema`,
  via `loadStrategicV2Overlay`) — Strategic Bee-1 demand hunter. **A clone mints BOTH files.**
- The schema's non-empty `.min(1)` floor (fails `loadOverlay` if empty): `engines_to_query`, `topic_universe`,
  `authoritative_sources`, `niche.claim_radius_keywords`, `niche.primary_authorities`.
- taxchecknow's `strategic.json` is the round-trip target (hand-authored; the only concrete overlay today —
  no vanilla template, no clone/seed/mint script exists).

---

## FORK 1a → (c): placeholder topic_universe + first-products route to seed handoffs

The clone mints a **minimal-valid `topic_universe` PLACEHOLDER** — just enough to satisfy the loader's
`.min(1)` floor (one well-formed topic). `estimated_first_products` route to **seed `strategic_queen_handoffs`
rows**, NOT into the overlay. The new hive's own **Strategic Bee-1 populates the real `topic_universe`**
post-mint / pre-claim.

- **VERIFIED:** §2 prose already documents seed-topics-as-handoffs *verbatim* in the committed Apiary doc
  (`c054821`): L419 *"the topics already detected for this niche become seed handoffs for the new hive's
  Strategic Queen on day one"*; L601 (*"will inherit these as seed handoffs… suggestions, not commitments"*);
  L621. **NO §2 amendment needed — the clone just ROUTES.**
- ⚠️ **Naming:** seed handoffs = the per-hive **`strategic_queen_handoffs`** table — NOT
  `apiary_strategic_handoffs` (Bee-4's clone-proposal table). Don't conflate the two.

## FORK 1b → (b): jurisdiction map is vanilla infrastructure; derive authority IDs

`jurisdiction → {language, product_key_prefix}` is **flavour-invariant VANILLA INFRASTRUCTURE** (AU→`en-AU`/
`au-*`, UK→`en-GB`/`uk-*`, … holds for any niche) — it lives in the **template/clone layer, NOT §2**. The
clone derives `niche.primary_authorities` short IDs (e.g. `ato`) from §2's authority URLs via the existing
**`domainAuthority`** mapping. Division of labour: **§2 carries niche-specific (the authority URLs);
the clone supplies the invariant (the jurisdiction map + the URL→ID derivation).**

## FORK 1c → landing surfaces (NOT overlay fields)

`proposed_persona_seeds` → the **COLE character surface**; `estimated_first_products` → seed
**`strategic_queen_handoffs`**. Neither is an overlay field.

- ⚠️ **VERIFIED 1c-A:** the character "registry" is a **HARDCODED TS MODULE** (`lib/bees/_character-registry.ts`)
  sourced from `cole-marketing/CHARACTERS.md` — **NOT a writable table**. So a persona seed has **no
  automatable clone-write** today → see the PERSONA ruling.

## PERSONA (the 1c-A resolution) → OPTION A: clone references, does not generate

The clone does **NOT** generate or write personas. For **taxchecknow** it **REFERENCES** the existing
personas (`character_voice_map → _character-registry.ts`). For **future hives** it **EMITS A CHECKLIST ITEM**.

- **Rationale:** the clone mints **STRUCTURE, not CONTENT**. A persona is research-derived content (like
  disclaimers — NOT auto-fabricated from a one-line seed). Persona **generation** is a future capability
  owned by the **Apiary Queen** (see `APIARY-…-DAY13.md` §17, the Day-14 addition).
- **No chicken-and-egg for the maiden run:** taxchecknow's persona already exists (manual research), so the
  round-trip references it; nothing to generate.

## FORK 2 → (a)-now + (b)-flagged: placeholder registry row now, real sites table later

The clone seeds a **placeholder `platform_accounts` row** to unblock the round-trip **(a)** — because
`getSites()` derives the dropdown from `platform_accounts` (there is **no dedicated sites registry** today;
seed fallback `["taxchecknow","theviabilityindex"]`). A **proper sites-registry table** is the right shape
**(b)** — it fits federation and fixes the `theviabilityindex` drift (in the seed but with no overlay file).

- **(b) is a FLAGGED follow-up with a REAL TRIGGER** — *before hive #2 ships, or on a second
  `OverlayNotFoundError` drift* — **not a rotting TODO**, and **not on the clone-proof critical path**.

## FORK 3 → (b): author the vanilla template CLEAN; prove via the taxchecknow round-trip

**Author** the vanilla template clean from the schema; **prove** it via the **taxchecknow ROUND-TRIP**
(regenerate `strategic.json` from `vanilla + a taxchecknow CloneProposal`). The **round-trip is the
GAP-FINDER** — its failures are the spec for what the template/§2 must carry.

- **STRIP rejected:** stripping taxchecknow's overlay silently bakes in tax-shaped structure (the 5-jurisdiction
  map, tax-keyed weight maps, ARR band labels) that wouldn't surface until hive #2.
- **Prompt-noun cleanse (#138/#139** — Bee C "TAX topic", Bee B "TAX question)** is a SEPARATE code-cleanse
  (the literals are in bee *prompt code*, not the overlay; the real topic rides `canonical_question`). **Flag,
  don't couple** to vanilla extraction.

---

## VERIFIED DEPENDENCIES (the verify-before-compose pass)

- **1a — §2 documents seed-handoffs:** ✓ (verbatim, `c054821` L419/L601/L621).
- **1c-A — character registry writable:** ✗ **PRESUMED-NOT-REAL** — hardcoded TS module + `CHARACTERS.md`
  bibles, not a table. → resolved by PERSONA Option A (reference now; Apiary §17 generates later).
- **1c-B — seed handoffs insertable for a brand-new site:** ✓ — a V2-shape row (`site` is plain `text NOT NULL`,
  **no FK / no site-must-exist guard**; `gap_id` nullable + **no FK**; `candidate_id` nullable — per migration
  `20260522120000`). The discriminator: V2 rows = `action NOT NULL`, `gap_id` NULL.
- **No `topic_universe` chicken-and-egg:** ✓ — Strategic **Bee-1 reads `strategic-v2.json` (routines/
  jurisdictions), NOT `topic_universe`** (grep-confirmed: zero `topic_universe` references in
  `strategic-bee-1-demand-hunter.ts`). The placeholder satisfies only the **PQ loader floor**; Bee-1 is
  decoupled and *produces* `demand_candidates`. Ordering holds: mint both overlays → seed handoffs → Bee-1
  runs → handoff claimed → build.

## ⚠️ WIRING FIX the clone must include (latent bug — not a blocker)

`claimNextHandoff` derives jurisdiction via `candidate_id → demand_candidates.jurisdiction`, and
`jurisdictionToCountry(null)` **DEFAULTS TO `"au"`**. So a seed handoff **with no `candidate_id`**
mis-defaults a **non-AU** hive to AU at claim. **The clone's seeding step must write a `demand_candidates`
row (correct jurisdiction) + set the handoff's `candidate_id`** — or add an orchestrator jurisdiction
fallback (handoff/overlay). Real latent bug; fix it in the seeding step.

---

## SCOPE GUARD

Build the **Vanilla template + Clone workflow ONLY** (the executor, consuming the Apiary contract). **NOT** the
Apiary Strategic Queen; **NOT** the cross-hive COLE Orchestrator. The **round-trip is the acceptance test**
(self-contained — no 2nd hive needed). What the clone produces to be bee-runnable: `overlays/<site>/
strategic.json` + `strategic-v2.json` (both schema-valid) + a registry row (placeholder `platform_accounts`),
minted **before** any handoff for that site is claimed (else Bee A dies at `getHiveConfig`). Customer-facing
surfaces (email, Stripe products, DNS, delivery repo, per-site env) are **emitted as a checklist**, not minted.
