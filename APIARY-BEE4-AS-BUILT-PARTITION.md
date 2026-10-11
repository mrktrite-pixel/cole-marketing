
---

# Bee 4 — Handoff Composer

## 33. What Bee 4 is, in one paragraph

Bee 4 is the Apiary Strategic Queen's handoff composer — the 4th and final bee. It reads niches Bee 3 decided `CLONE_NEW_HIVE` or `EXPAND_EXISTING` (skips IGNORE) from `apiary_niche_candidates` (`decided_at NOT NULL`, `promoted_at IS NULL`), composes ONE `apiary_strategic_handoffs` row per niche, and marks the candidate promoted. One row in, one row out — it trusts Bee 2's score and Bee 3's decision; no re-scoring, no clustering, no auto-approve. CLONE rows get a single Haiku "thick stub" (enough to ground the operator's approve-this-hive decision); EXPAND rows are fully deterministic (no LLM). Standalone Vercel cron route (`maxDuration=300`, `force-dynamic`); schedule HELD.

## 34. As-built routing paths

CLONE_NEW_HIVE → one Haiku thick-stub call → fills `niche_*`, score/evidence, 2–3 `estimated_first_products`, `notes`(rationale), `phase_readiness` (domain-map, default `queued`); mint-time columns NULL. EXPAND_EXISTING → deterministic → fills `expand_existing_hive`, `jurisdictions[]`, `config_overrides` delta, `notes`=decision_reason verbatim, `phase_readiness='ready'`; no LLM. Both write `approval_status='PENDING'`; then a two-step write closes the loop (handoff insert → candidate `promoted_at`+`handoff_id`), with the loop-close throw surfacing `handoff_id` as an orphan diagnostic.

## 35. Design ruling — handoff brief (2026-05-30/31, `3b4a0d2`)

Bee 4 is a per-candidate mapper, not a clusterer/re-scorer. Thick stub, not the full `CloneProposal`. EXPAND written-PENDING-now (record-don't-actuate). phase_readiness written-and-parked. The CloneProposal socket (`lib/clone/clone-types.ts`) + the `cloneHive`/`mint-hive` consumer already exist — Bee 4 is the missing emitter.

## 36. Design ruling — dispatcher design (2026-05-31, `1e4b724`)

Six resolutions: (1) CLONE synthesizes / EXPAND deterministic; (2) tier **Haiku** not Opus (describes a decision, not strategic judgment); (3) suggested hive name → `niche_name` (no column add); (4) thick-stub boundary confirmed, mint-time regenerates the full product list; (5) EXPAND fully deterministic, no LLM; (6) conservative phase map (EXPAND-to-live=`ready`, all CLONE=`queued` until the operator opens a phase). Build note: loop-close throw carries `handoff_id`.

## 37. Schema (step-1 probe)

`apiary_strategic_handoffs` = `CloneProposal` flattened to discrete columns; `action` CHECK allows `EXPAND_EXISTING`; `expand_existing_hive` column exists; `candidate_id` FK + candidate `promoted_at`/`handoff_id` give a first-class loop-closer. `phase_readiness` column (CHECK `ready|queued`) + `idx_anc_decided_unpromoted` added by migration `20260531050029` (`c614ed4`). No `proposed_hive_name` column (by design).

## 38. First-fire / validation results

Empty real-data fire: 56 IGNORE → `written:0`, metrics row clean (column-drift watch-point passed). Forced fixtures (2/2): CLONE (Spain visa) Haiku thick-stub — real name/summary/rationale, 3 example products, `queued`, all mint-time columns NULL, $0.0015 / 574 tokens; EXPAND (Ireland tax) deterministic — `expand_existing_hive=taxchecknow`, delta in `config_overrides`, verbatim `notes`, `ready`, zero cost. Loop closed; metrics `2/0`, `clone:1/expand:1`. Fixtures cleaned up.

## 39. Bee 4 → mint-time contract

CLONE handoffs land `PENDING` for operator approval on the existing `mint-hive` page; on approval the **full** `CloneProposal` is synthesized at mint-time (persona seeds, full 5–10 products, config_overrides, proposed_domain, vanilla_version) and `cloneHive()` runs. That mint-time synthesizer is **net-new/unbuilt** (the Q3 thick-stub consequence). EXPAND handoffs land `PENDING` for a future extend-consumer (also unbuilt — record-don't-actuate).

## 40. Bee 4 build artifacts

Dispatcher `lib/queens/apiary-bee-4-handoff-composer.ts` (`460edcb`, batch `79ca5ed`); route `app/api/cron/apiary-bee-4-handoff-composer/route.ts` (`7f89290`); `_shared/slugify.ts` (`a037f80`); `ApiaryAction` rename (`6ca738e`); migration (`c614ed4`). Briefs in cole-marketing (`3b4a0d2`, `1e4b724`). Schedule HELD — 0 apiary entries in `vercel.json`; gated on Fork-2b registry + cost-monitoring tile (shared, NOT BUILT) and the unbuilt mint-time synthesizer.
