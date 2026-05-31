# Apiary Bee 4 — Handoff Composer — FOR DESIGN (pre-build brief)

**Status:** RATIFIED 2026-05-31 — Design chat ruled all five questions (see §9); build-ready. The §3/§6 contract changes from the Q3 "thick stub" ruling are folded in below. Bee 3 is complete (`15d81c8`/`4f71398`, cron HELD).
**Role (proposed):** read each niche Bee 3 decided `CLONE_NEW_HIVE` or `EXPAND_EXISTING` (skip IGNORE), compose ONE `apiary_strategic_handoffs` row per niche, mark the niche promoted. One row in, one row out. Trusts Bee 2 (score) + Bee 3 (decision) — no re-scoring, no clustering. "Whoever made it owns it."

---

## 1. The proven sibling, and where Apiary diverges

The per-hive `strategic-bee-4-handoff-composer.ts` (LIVE, 52 handoffs) is the template: simple per-candidate mapper, entry condition `decided AND decision IN (...) AND not-yet-promoted`, writes a PENDING handoff, marks the candidate promoted, self-enforces the action enum in code (no DB CHECK reliance). Apiary mirrors all of that **structurally**.

**The divergence Design must register:** the sibling is a *light* mapper — one cheap LLM call (an ≤8-word `short_question`), everything else deterministic — because its candidate already holds the content. **Apiary's candidate does not.** A scored niche row carries the decision and the citation-gap evidence, but not the proposal. To emit a `CloneProposal`, Bee 4 must **synthesize** new content (hive name, domain, persona seeds, scan config, 5–10 seed products). Apiary Bee 4 is therefore a **synthesizer**, not a light mapper — the sibling's "one cheap call" principle does not transfer.

## 2. Entry condition + read contract (mirrors sibling)

Read from `apiary_niche_candidates`:
```sql
decided_at IS NOT NULL
AND decision IN ('CLONE_NEW_HIVE', 'EXPAND_EXISTING')
AND <promoted-marker> IS NULL
```
IGNORE rows are decided but never promoted (they stay forever). **Design Q5:** read-filter on `decision IN (...)` vs. read-all-then-skip — recommend the read-filter (mirrors sibling's partial-index approach; needs the equivalent index on `apiary_niche_candidates`).

Bee 4 forwards from the row (no recompute): `overall_score`, `score_components`/equivalent, `confidence`, `jurisdiction`, `decision`, `decision_reason`, `existing_hive` (EXPAND only — set to `fit.target_hive` by Bee 3), and the citation-gap evidence payload. Reuses `buildClaimedInventory()` for hive-inventory context when composing.

## 3. Output contract A — `CLONE_NEW_HIVE` → `CloneProposal`

The socket already exists: `lib/clone/clone-types.ts` defines `CloneProposal`, tagged *"the Apiary Queen's CLONE_NEW_HIVE handoff shape… LATER the Apiary Strategic Queen produces it (Bee-4)."* The consumer is built: operator approves a PENDING handoff on the existing `app/dashboard/mint-hive/` page → `cloneHive()` runs. **Rails exist end-to-end; Bee 4 just fills the socket.**

Fields Bee 4 must **synthesize** (generative): `niche_slug` (deterministic slugify), `niche_name`, `niche_summary`, `proposed_hive_name`, `proposed_domain`, `proposed_persona_seeds[]`, `vanilla_version_to_clone`, `config_overrides{jurisdictions_to_scan, domain_keywords, authority_sources}`, `estimated_first_products[5–10]`.
Fields Bee 4 **forwards** (mechanical): `overall_score`, `score_components`, `confidence`, `evidence{...}`, `approval_status='PENDING'`.

## 4. Output contract B — `EXPAND_EXISTING` → (NET-NEW, no precedent)

`CloneProposal` is explicitly scoped **out** of EXPAND (`clone-types.ts:17`: *"EXPAND_EXISTING / IGNORE are out of the clone workflow's scope (different downstream); carried on the same table, not here"*). There is **no consumer and no payload shape** for EXPAND today. **This is the #1 thing Design must rule on.**

Proposed shape (for Design to accept/amend): same `apiary_strategic_handoffs` table, `action='EXPAND_EXISTING'`, payload pointing at the **existing hive's overlay to extend** rather than minting a new one — e.g. `{ target_hive, new_jurisdiction, new_authority, authority_language, config_delta{jurisdictions_to_add, authority_sources_to_add}, estimated_added_products[] }`. Consumer (an "extend-hive" path analogous to `cloneHive`) is **also unbuilt** — Design should rule whether Bee 4's EXPAND handoff lands as PENDING for a future extend-consumer, or is deferred until that consumer exists.

## 5. `phase_readiness` (Bee 3 deferred this to Bee 4 — define it here)

Per the ratified scope addendum: domains carry a readiness state — tax = live, visa = Phase 1, immigration/crypto/estate/business = queued. **Proposed:** Bee 4 stamps each handoff `phase_readiness ∈ {ready, queued}` from the niche's domain; `ready` handoffs surface for operator approval now, `queued` handoffs are written PENDING-but-parked (not surfaced) until the phase opens. **Design Q2:** confirm the readiness map + whether queued handoffs are written-and-parked or held entirely.

## 6. Synthesis strategy (the cost/quality crux — Design Q3)

Because CLONE synthesis is generative and expensive (unlike the sibling), options:
- **(a) Synthesize-upfront:** full `CloneProposal` minted at handoff time → operator sees a complete proposal when deciding. Cost: Opus spend on proposals that may be rejected or are `queued` (possibly wasted).
- **(b) Stub-then-synthesize-on-approval:** Bee 4 writes a lightweight proposal (niche summary + decision + score) PENDING; full synthesis runs at mint time after approval. Cheaper, but the operator approves with less detail.
- Tier: recommend **Opus** (`claude-opus-4-7`, Tier-3 strategic, same as Bee 3's fit-check) for whichever synthesis step Design picks; deterministic slug + forwarded score fields regardless.
Interaction with `phase_readiness`: `queued` clones argue for (b) — don't pay to synthesize a proposal that's parked.

## 7. Naming lock (Design Q4 — trivial but must be settled)

Divergence: DB CHECK (`apiary_strategic_handoffs.action`) and Bee 3 dispatcher use **`EXPAND_EXISTING`** (no suffix); the TS `ApiaryAction` union (`clone-types.ts:23`) uses **`EXPAND_EXISTING_HIVE`**. The TS type is never used as a value (zero grep hits), so the safe fix is to drop `_HIVE` from `ApiaryAction` to match DB + Bee 3. Bee 4 must not inherit the mismatch.

## 8. Reuses + files (build-time, post-ruling)

Reuse unchanged: `logBeeError`, `callClaude`, `trackCost`, `buildClaimedInventory`, a `slugify` helper (confirm/create `lib/queens/_shared/slugify.ts`).
Create: `lib/queens/apiary-bee-4-handoff-composer.ts` (batch + per-candidate fn, mirror Bee 2/3), `app/api/cron/apiary-bee-4-handoff-composer/route.ts` (Bearer `CRON_SECRET`, `maxDuration=300`, `?batch=N`, standalone — no orchestrator). Possibly: a partial index on `apiary_niche_candidates` for the entry query; the `ApiaryAction` rename; the EXPAND consumer (separate task).
Probe-first at build (sibling's lesson): confirm `apiary_strategic_handoffs` columns + nullability and the `apiary_niche_candidates` promoted-marker before writing the insert path.

## 9. RATIFIED — Design ruling 2026-05-31

All five questions ruled. Operator-strategy pieces confirmed separately (noted).

1. **EXPAND_EXISTING handoff shape — ACCEPTED.** Same `apiary_strategic_handoffs` table, `action='EXPAND_EXISTING'`, `config_delta` payload pointing at the existing hive's overlay to extend (jurisdictions/authorities to *add*, not mint). Write-vs-defer ruled **Position 1: write-PENDING-now** — Bee 4 emits the EXPAND handoff regardless of whether the extend-consumer exists, carrying **consumer-readiness as metadata** on the row (record-don't-actuate, identical discipline to Bee 3's dormant-EXPAND verdict). The approval surface filters by consumer-readiness; Bee 4 carries no consumer-readiness *branch*.

2. **`phase_readiness` — RATIFIED `written-and-parked`.** Bee 4 stamps `phase_readiness ∈ {ready, queued}` from the niche's domain; `ready` surfaces for approval now, `queued` is written-PENDING-but-parked (dashboard filters on it; Bee 4 carries no phase branch). The domain→readiness **map** (tax=live, visa=Phase 1, immigration/crypto/estate/business=queued) is **operator-strategy — operator-confirmed**, not a Design lever.

3. **Synthesis strategy — RATIFIED (b) "thick stub".** Bee 4 does NOT mint the full `CloneProposal` at handoff time. It writes a **thick stub** sized to ground the operator's *approve-this-hive?* decision: `niche_summary` + `decision` + `overall_score`/components + a short **rationale** (from Bee 3's `decision_reason`) + a **suggested `proposed_hive_name`** + **2–3 example first-products** (cheap). Deterministic `topic_slug`; forwarded score/confidence/evidence. **Tier: Opus** (`claude-opus-4-7`, same as Bee 3's fit-check) for the rationale + name + examples. The **full** `CloneProposal` (persona seeds, full 5–10 first-products with grounding, `config_overrides`) is synthesized **at mint-time, after operator approval** — pay the expensive generative cost only on a yes-decision. (Per-dimension-gate discipline applied to cost: synthesize what materially affects the decision; defer what doesn't.)

4. **Naming — RATIFIED `EXPAND_EXISTING`** (drop `_HIVE` from the TS `ApiaryAction` union to match DB + Bee 3; zero value-callsites, safe rename).

5. **IGNORE handling — RATIFIED read-filter + partial index** on `apiary_niche_candidates` (mirrors the sibling; cheaper than read-all-then-skip).

### Build consequence of the Q3 ruling (flag for build planning, not a new Design question)
The thick-stub ruling **moves full-`CloneProposal` synthesis out of Bee 4 to a mint-time step** (post-approval, before `cloneHive()`). That synthesizer is **net-new and unowned today** — the existing `mint-hive` rail consumes a *complete* hand-filled `CloneProposal`. So the build now has two loci: Bee 4 (thick stub → PENDING) and a **synthesize-full-proposal-on-approval** step feeding `cloneHive()`. Decide at build whether that step extends the `mint-hive` flow or is a small standalone composer. §3's "Bee 4 just fills the socket" is now "Bee 4 fills a *thick stub*; the socket is completed at mint-time."

### Build order (post-ratification)
Probe-first (`apiary_strategic_handoffs` columns + nullability, `apiary_niche_candidates` promoted-marker) → `ApiaryAction` rename → partial index → `apiary-bee-4-handoff-composer.ts` (thick-stub Opus synthesis + EXPAND `config_delta` + `phase_readiness` stamp + PENDING write + promote) → cron route → the mint-time full-synthesis step (separate; may be its own task).

## 10. What is NOT in scope (mirror the sibling's discipline)

No clustering/dedup (handled upstream — Bee 1 fingerprint + Bee 3 cosine + operator gate; don't add a 4th owner). No re-scoring. No character/persona *selection* beyond seed suggestions if Design wants an owner boundary (the sibling left `recommended_character` NULL for Production Queen — Apiary's analog: Bee 4 may *seed* persona ideas in the proposal but the hive's final brand is owned downstream). No auto-approve — `PENDING` + operator gate, always.

## See
- `bees/bee-3-niche-router.md` + queen `APIARY-STRATEGIC-QUEEN-AS-BUILT.md` §24–32 (Bee 4's input contract)
- `cole-marketing/APIARY-SCOPE-ADDITION-FOR-DESIGN.md` (phase_readiness origin)
- `soverella/lib/clone/clone-types.ts` (CloneProposal socket), `lib/clone/clone-hive.ts` (consumer), `app/dashboard/mint-hive/` (approval rail)
- `soverella/lib/queens/strategic-bee-4-handoff-composer.ts` (per-hive sibling template)
- `cole-marketing/STRATEGIC-QUEEN-REPLICATION-RUNBOOK.md`, `VANILLA-CLONE-*-DAY14.md` (clone workflow background)
