# Apiary Bee 4 — Dispatcher Design (step 4b) — FOR DESIGN REVIEW

**Status:** RATIFIED 2026-05-31 — Design ruled all six questions (see §8). Build-ready. Two rulings changed the code from the first draft: Q2 tier → **Haiku** (not Opus), Q5 EXPAND → **fully deterministic, no LLM call**.
**Purpose:** the implementation-level design for `lib/queens/apiary-bee-4-handoff-composer.ts`, flowing from the ratified Bee 4 brief + the step-1 schema probe.

## 0. What's already locked (don't re-litigate)
- **Brief ratified** (`3b4a0d2`): Bee 4 is a per-candidate mapper/synthesizer — one row in, one row out, trust Bee 2 (score) + Bee 3 (decision), no re-scoring, no clustering, no auto-approve. Thick stub (not full `CloneProposal`); EXPAND write-PENDING-now; phase_readiness written-and-parked.
- **Naming** locked `EXPAND_EXISTING` across DB/Bee 3/TS (`6ca738e`).
- **Schema migrated** (`c614ed4`): `phase_readiness` column (CHECK `ready|queued`) + `idx_anc_decided_unpromoted` partial index.
- **slugify helper** built (step 4a).

## 1. The real schema (step-1 findings)
`apiary_strategic_handoffs` is the `CloneProposal` **flattened into discrete columns** (not a jsonb payload): `niche_slug, niche_name, niche_summary, jurisdictions[], action, expand_existing_hive, overall_score, score_components(jsonb), confidence, evidence(jsonb), proposed_domain, proposed_persona_seeds(jsonb), vanilla_version_to_clone, config_overrides(jsonb), estimated_first_products(jsonb), approval_status(default 'PENDING'), approved_by, approved_at, clone_initiated_at, hive_live_at, notes, candidate_id(FK→apiary_niche_candidates), hive(default 'apiary'), phase_readiness`.
- `action` CHECK = `{CLONE_NEW_HIVE, EXPAND_EXISTING, IGNORE}`; `approval_status` CHECK = `{PENDING, APPROVED, REJECTED, DEFERRED}`.
- Loop-closer is **first-class**: `candidate_id` FK + `promoted_at`/`handoff_id` on the candidate (no `gap_id`-style scramble).
- **EXPAND has a home**: `expand_existing_hive` column already exists.
- **Note:** there is **no `proposed_hive_name` column** even though the `CloneProposal` TS type lists one (see Q3).

## 2. Entry + read contract (settled)
```sql
decided_at IS NOT NULL
AND decision IN ('CLONE_NEW_HIVE','EXPAND_EXISTING')   -- IGNORE filtered at SELECT
AND promoted_at IS NULL                                -- resumability sentinel
ORDER BY decided_at ASC
LIMIT <batch>
```
Backed by `idx_anc_decided_unpromoted`. Forwards from the candidate: `niche_label, jurisdiction, source_payload, recurrence_count, overall_score, score_components, confidence, decision, decision_reason, existing_hive`.

## 3. Per-candidate flow (mirrors the LIVE sibling)
`composeOneHandoff(sb, cand)`: branch on `decision` → build the row (CLONE or EXPAND path below) → **two-step write**: (a) insert into `apiary_strategic_handoffs` → returns `id`; (b) update the candidate `promoted_at = now(), handoff_id = id`. Per-candidate error → `logBeeError` + continue (don't fail the batch). Throw on loop-close failure surfacing the written `handoff_id` (double-write diagnostic). Batch entry `runApiaryBee4HandoffComposer(sb, run_id, batch)`; one `bee_run_metrics` row per fire; `trackCost` around any LLM call.

## 4. CLONE_NEW_HIVE path — **thick-stub synthesis**
The candidate has the *decision* but no proposal content, so this path synthesizes (the brief's "synthesizer, not light mapper"). **One LLM call** producing a thick stub sized to ground the operator's *approve-this-hive?* decision — **not** the full proposal. **Tier: Haiku** (`claude-haiku-4-5`) — RATIFIED: the stub is bounded generation, not strategic judgment (Bee 3 already made the routing call); Bee 4 *describes* that decision. Fallback: promote only the `rationale` sub-output to Opus if first-approval quality is insufficient (model as a parameter; one call either way).

**Synthesis output (JSON):**
```jsonc
{
  "niche_name": "...",            // human label for the niche/hive
  "niche_summary": "...",         // 1-2 sentences: what this hive would cover
  "rationale": "...",             // why it merits a hive (grounds the approval)
  "domain_category": "tax|visa|immigration|crypto|estate|business|other",  // drives phase_readiness
  "suggested_hive_name": "...",   // a brand suggestion (see Q3 for where it lands)
  "example_first_products": ["...", "...", "..."]  // 2-3 only, to show shape
}
```

**Draft prompt (system):** *"You compose a concise decision stub for a proposed new content hive, NOT the full build proposal. Given a scored niche (jurisdiction, citation-gap evidence, Bee 3's decision rationale), output JSON only: a niche name, a 1–2 sentence summary, a short rationale for why it warrants its own hive, the business domain category, a suggested hive name, and 2–3 example first-products. Do NOT invent persona voices, a full product roadmap, scan config, or a web domain — those are produced later at mint time."*

**Column mapping (CLONE):**
- **FILL:** `action='CLONE_NEW_HIVE'`, `niche_slug=slugify(niche_name)`, `niche_name`, `niche_summary`, `jurisdictions[]` (from candidate), `overall_score`, `score_components`, `confidence`, `evidence` (from `source_payload`), `estimated_first_products` (the 2–3 stub examples), `notes` (rationale), `candidate_id`, `hive='apiary'`, `approval_status='PENDING'`, `phase_readiness` (§6).
- **LEAVE NULL (mint-time):** `proposed_domain`, `proposed_persona_seeds`, `vanilla_version_to_clone`, `config_overrides`, the *full* `estimated_first_products` (mint-time replaces the 2–3 stub with the full 5–10).

## 5. EXPAND_EXISTING path — **fully deterministic (no LLM call)** [RATIFIED]
The EXPAND payload is small and **already on the candidate** ("add jurisdiction X to hive Z"), so this path needs **no synthesis and no LLM call** — pure forward-mapping. Only CLONE pays for a model call.
- **FILL:** `action='EXPAND_EXISTING'`, `expand_existing_hive = candidate.existing_hive` (Bee 3 set it = `fit.target_hive`), `jurisdictions[] =` the new jurisdiction, `config_overrides =` the minimal delta (new authority + language, from the candidate/fit-check), `niche_name/summary` (deterministic from candidate fields), `overall_score`, `score_components`, `confidence`, `evidence`, `notes =` Bee 3's `decision_reason` **verbatim**, `candidate_id`, `hive='apiary'`, `approval_status='PENDING'`, `phase_readiness='ready'` (extends a live hive).
- **LEAVE NULL:** the CLONE-only/mint-time fields (`proposed_domain`, `proposed_persona_seeds`, `vanilla_version_to_clone`, `estimated_first_products`).

## 6. phase_readiness — map + mechanism
**Mechanism:** Bee 4 stamps `phase_readiness ∈ {ready, queued}` per the niche's **domain category**. For CLONE the category comes from the synthesis output (§4); for EXPAND it's the target hive's known domain (taxchecknow = tax). `approval_status='PENDING'` **always** — the approval dashboard surfaces `phase_readiness='ready'` and parks `'queued'`. (This is why we added a dedicated column rather than overloading `DEFERRED`: phase-gating and approval-lifecycle stay separate.)

**The map (OPERATOR-STRATEGY — to confirm; proposed default):**
| domain | readiness |
|---|---|
| EXPAND → a live hive (taxchecknow / tax) | `ready` |
| visa (CLONE) | `queued` (until Phase 1 is explicitly opened) — **operator to confirm ready-vs-queued now** |
| immigration / crypto / estate / business (CLONE) | `queued` |
Conservative default: only EXPAND-to-a-live-hive is `ready`; every CLONE is `queued` until the operator opens its phase.

## 7. Cost / tier / batch
- CLONE pays one LLM call (thick stub); EXPAND ≈ free. Above-threshold CLONE/EXPAND volume is rare today (Bee 3 drained all-IGNORE on real data), so cost is bounded.
- `DEFAULT_BATCH_SIZE` TBD at step 8 — heavier per-row than Bee 3 because this *generates* content; size against `maxDuration=300` with `callClaude` retry inflation, same method as Bee 3.

## 8. RATIFIED — Design ruling 2026-05-31

1. **CLONE/EXPAND asymmetry — CONFIRMED.** CLONE = thick-stub LLM synthesis; EXPAND = deterministic. Pay generative cost only where content must be produced.
2. **Synthesis tier — Haiku** (`claude-haiku-4-5`) for v1. The stub describes a decision Bee 3 already made; it's bounded generation, not judgment. Tier matches judgment-density, not workflow position. Fallback: promote only the `rationale` sub-output to Opus if first-approval quality is insufficient (model as a parameter).
3. **`proposed_hive_name` gap — name lives in `niche_name`** (a). Brand is mint-time-finalized; the handoff name is a suggestion, not a commitment. No column add. `notes` carries the rationale **only** — don't blur name and rationale.
4. **Thick-stub column boundary — CONFIRMED.** Sharpening: `estimated_first_products` holds 2–3 *examples* at handoff; the **mint-time consumer regenerates the full 5–10 and treats the stub as advisory** (does not augment). No schema change; make this explicit in the dispatcher's header comment.
5. **EXPAND — fully deterministic, NO LLM call.** Forward Bee 3's `decision_reason` verbatim into `notes`; map the minimal authority/language delta into `config_overrides` from candidate fields. Only CLONE pays a model call.
6. **phase_readiness — mechanism CONFIRMED** (CLONE domain-category from the Haiku output; EXPAND from the target hive's known domain). **Map (operator-strategy): conservative default — only EXPAND-to-a-live-hive = `ready`; every CLONE = `queued`** until the operator explicitly opens that phase (asymmetric-reversibility: `queued`→`ready` is recoverable; a wrongly-`ready` hive approval is not). `approval_status='PENDING'` always; the dashboard surfaces `phase_readiness='ready'`.

### Build notes (from the ruling)
- **Orphan-handoff diagnostic:** the loop-close-failure path must surface the written `handoff_id` **in the thrown error itself** (not just a log line) — the throw is the operational signal; the embedded id is what lets the operator resolve a partial write (delete the orphan handoff, or backfill the candidate's `promoted_at`/`handoff_id`).
- **Batch sizing (step 8):** ship small (5–10), measure actual per-row latency on real CLONE rows, tune. Don't pre-optimize — volume is low (Bee 3 drained all-IGNORE on real data).

## 9. Unchanged discipline (for the record)
No clustering/dedup (upstream owns it), no re-scoring, no auto-approve (`PENDING` + operator gate), mint-time owns the full `CloneProposal`. Probe-first already done (§1). Build order after ruling: dispatcher (this) → cron route (step 5) → live-fire + fixtures (6–7) → batch size (8) → docs (9) → go-live posture (10, HELD like Bee 3).
