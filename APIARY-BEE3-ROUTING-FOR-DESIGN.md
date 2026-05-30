# Apiary Bee 3 (Niche Router) — Full Design for Design Chat

**Status:** OPEN — full design, ready for Design ruling (workflow step 2).
**Date:** 2026-05-30. Supersedes the earlier short brief of the same name.
**Intended home:** `cole-marketing/APIARY-BEE3-ROUTING-FOR-DESIGN.md`
**Lineage:** verified against per-hive `bee-3-site-auditor.md`, DESIGN-DAY13
§6/§13, AS-BUILT §3.3/§10–§23, the architecture brief, the Mint-Hive +
Monitor dashboard screens, live DB probes (Session A, 2026-05-30), and the
operator's jurisdiction-grained boundary ruling (2026-05-30, this session).

**Workflow:** (1) this design → (2) Design chat rules → (3) build → (4) test →
(5) document. This doc is the step-1 artifact.

---

## 1. One line

Apiary Bee 3 is a **router**: mirror of per-hive Bee 3's skeleton, lifted to the
niche→hive scope. It reads scored-undecided niche candidates, gates on an 8.0
threshold, then makes ONE non-grounded Haiku fit-check against the existing-hive
inventory, and writes `CLONE_NEW_HIVE` / `EXPAND_EXISTING` / `IGNORE` back to the
row. Bee 4 consumes the decision. Bee 3 produces no proposal content.

## 2. Confirmed end-to-end flow (screenshots + spec reconciled)

| Decision | Means | Downstream consumer |
|---|---|---|
| `CLONE_NEW_HIVE` | different business domain — no existing hive fits | Bee 4 writes §2 CloneProposal → **Mint Hive** screen → gated live-commit writes `overlays/<site>/` + seeds registry (Fork-3-proven, taxchecknow round-trip) |
| `EXPAND_EXISTING` | same domain, **new jurisdiction** (or a domain sub-topic the hive doesn't cover) | Bee 4 writes expansion handoff → the existing hive's Strategic Queen (live-vs-dormant: see §12) |
| `IGNORE` | below threshold (watching) OR fuzzy-claimed (topic already inside a claimed jurisdiction) | stays in `apiary_niche_candidates` for re-evaluation; surfaced in the apiary Strategic Queen panel (Monitor → SITE=apiary) |

Apiary is itself a vanilla COLE site at the queen layer (`overlays/apiary/`); the
flavoured content hives (taxchecknow today) are vanilla + flavour overlay. Apiary's
Strategic Queen is selectable via the Monitor SITE dropdown above the per-hive queens.

## 3. The suppression ↔ EXPAND boundary (operator-ruled 2026-05-30 — jurisdiction-grained)

The dividing principle, grounded in §13 ("per-hive scouts find topics *within* a
domain; apiary finds *new domains*; they never overlap in scope"):

- **Topic inside a hive's CLAIMED jurisdiction** (e.g. "UK MTD deadline" when
  taxchecknow already covers UK tax) → taxchecknow's own Strategic Queen finds it →
  apiary must NOT act. Coarse cases are suppressed upstream by Bee 1; fuzzy cases
  that slip past land here → **IGNORE (existing_hive_satisfies)**. This IS the fuzzy
  claimed-niche suppression AS-BUILT §3.3 deferred to Bee 3.
- **Same domain, NEW jurisdiction** (e.g. "US tax" when taxchecknow is UK+AU) →
  a domain-entry decision the per-hive queen can't make for herself → **EXPAND_EXISTING**.
- **Different domain** (e.g. "immigration visas") → **CLONE_NEW_HIVE**.

The one-sentence test: *"Is this something the existing hive's own queen would
already find, or an entry decision she can't make for herself?"* First → IGNORE;
second → EXPAND. This makes apiary neither blind to claimed domains nor duplicative
of per-hive topic hunting.

**Dependency flag (not a Bee 3 design change):** EXPAND is only *reachable* if
Bee 1's claimed-niche suppression is jurisdiction-grained — i.e. it claims "UK tax"
without also suppressing "US tax." If `claim_radius_keywords` is domain-level only,
new-jurisdiction niches get suppressed before Bee 3 and EXPAND can never fire.
Confirm at build (Session A probe, §11).

**Documented expectation — EXPAND likely dormant for tax in v1 (Design-ratified
2026-05-30, NOT a design change):** taxchecknow's `primary_authorities` span FIVE
jurisdictions (ATO/HMRC/IRS/IRD-NZ/CRA = AU/UK/US/NZ/CA), so most tax jurisdictions
are already claimed → tax niches resolve to IGNORE_CLAIMED or (for different domains)
CLONE, and EXPAND will rarely fire in the single-hive present. This is **correct
dormancy**, the same shape as per-hive Bee 3's dormant panelbeat triggers — the bee
emits the right verdict even when the verdict is "nothing to expand here." Bee 3's
**primary live work in v1 is the IGNORE_CLAIMED vs CLONE_NEW_HIVE cut** ("already
covered, stop scanning" vs "genuinely new domain"), which is half the apiary's job.
EXPAND becomes load-bearing at hive #2, whose claim radius will be narrower. The
exact breadth (and therefore whether *any* real tax EXPAND fixture exists) depends
on the verbatim `claim_radius_keywords` — pending the Session A probe; do not infer.

## 4. Settled foundations (do NOT re-open — listed so Design doesn't re-litigate)

| Item | Settled value | Authority |
|---|---|---|
| Framing | same router skeleton as per-hive Bee 3, one scope up | DESIGN §13 |
| Decision enum (runtime) | `CLONE_NEW_HIVE` / `EXPAND_EXISTING` / `IGNORE` | DB CHECK `apiary_nc_decision_chk` (foundation L147) |
| Fit-check mechanism | LLM semantic match, NOT cosine embeddings | DESIGN §6 step 2; AS-BUILT §22 |
| "Tax-seed embedder leak" | moot — apiary copies no embedder | follows from above |
| Threshold | `overall_score >= 8.0`; first-fire all-IGNORE/watching is intended | DESIGN §6 step 1; AS-BUILT §21 L416 |
| Default-bias | CLONE when in doubt | DESIGN §6 critique; AS-BUILT §22 L452 |
| Routing-not-scoring | Bee 3 computes NO new scoring; consumes Bee 2 outputs only | AS-BUILT §17 L305, §22 L453 |
| Grounding gate | NO grounding — durable taxonomic judgment uses plain Haiku | DESIGN §18 Fork 3 |
| Config | hardcoded module constants, not overlay | AS-BUILT §11; per-hive Bee 3 L101–109 |
| No new table / no panelbeat triggers | confirmed | architecture brief; Session A |

## 5. Input contract (AS-BUILT §22)

Reads `apiary_niche_candidates WHERE scored_at IS NOT NULL AND decided_at IS NULL`.
Available: `overall_score`; `score_components.{ai_citation_volume, ai_citation_velocity
(inert 5.0), personalisation_potential, authority_clarity, competitor_weakness,
urgency, regulatory_stability}`; `_meta.{regulatory_stability_grounded,
regulatory_stability_reasoning, haiku_reasoning}`; `confidence`; `recurrence_count`;
`niche_label`; `jurisdiction`; `suppressed`; `blacklist_blocked`.
**Deferred — must NOT compute:** `cost_to_clone`, `market_size_signal`,
`citation_gap_density`, `personalisation_density`.

Comparison target = existing-hive inventory (today: one live hive, `taxchecknow`;
no DB hive-registry — filesystem overlays are source of truth). Zero-hive state →
every above-threshold niche legitimately CLONEs (data-driven, mirrors per-hive's
empty-embeddings→BUILD_NEW).

## 6. Decision flow

```
[scored, undecided candidate]
        │
        ▼
overall_score < 8.0 ? ── YES ──► IGNORE  (decision_reason: 'below_threshold_watching: overall=<x>')
        │
        NO
        ▼
existing-hive inventory empty ? ── YES ──► CLONE_NEW_HIVE  (data-driven; nothing to expand into)
        │
        NO
        ▼
fit-check (single Haiku, no grounding)  → {verdict, target_hive, new_jurisdiction, confidence, reasoning}
        │
        ├─ verdict EXPAND_EXISTING      → EXPAND_EXISTING; existing_hive=target_hive
        │                                 decision_reason='expand: <new jurisdiction / sub-topic> of <hive>'
        ├─ verdict CLONE_NEW_HIVE       → CLONE_NEW_HIVE; existing_hive=NULL
        │                                 decision_reason='clone: different domain — <why>'
        ├─ verdict IGNORE_CLAIMED       → IGNORE
        │                                 decision_reason='existing_hive_satisfies: <hive> already covers <jurisdiction>'
        └─ verdict AMBIGUOUS            → CLONE_NEW_HIVE  (default-bias §6)
                                          decision_reason='ambiguous_operator_review: <why> — defaulted CLONE'
```

On fit-check **call failure** (LLM error / unparseable JSON): write NOTHING
(`decided_at` stays NULL → auto-retried next fire), log via `error-capture`.
Never auto-CLONE on failure (asymmetric reversibility — CLONE is the expensive
action; a transient error must not mint an expensive proposal). Distinguish this
from the zero-hive data condition above, which is a legitimate CLONE.

## 7. The fit-check call (the load-bearing creative element)

**Model:** Haiku via `callClaude` (per-hive's durable-dimension pattern; no
grounding per §18 Fork 3). One call per candidate.

**Prompt — calibration-aware (per §20: framing must discriminate, not prime a
verdict).** Neutral classification, explicit criteria, conservative-merge instruction:

> **System:** "You classify whether a discovered business niche belongs inside an
> existing business hive or warrants a new one. You decide business-domain
> boundaries, not topic relevance or quality. Be conservative about merging: call
> EXPAND only when the niche is genuinely the same business domain as a listed
> hive and differs by a jurisdiction that hive does not yet claim. A topic already
> inside a hive's claimed jurisdiction is that hive's own concern — return
> IGNORE_CLAIMED. When genuinely undecided between EXPAND and CLONE, return
> AMBIGUOUS. Output JSON only."
>
> **User:** "CANDIDATE — niche: {niche_label}; jurisdiction: {jurisdiction};
> detected topics: {short evidence digest}. EXISTING HIVES — for each hive present
> its boundary as THREE distinct labelled fields (do NOT blend into prose):
>   • Claimed terms: {site_meta.niche.claim_radius_keywords}
>   • Claimed jurisdictions: {site_meta.niche.primary_authorities}
>   • Explicit exclusions: {site_meta.niche.explicit_exclusions}
> Decide ONE verdict: EXPAND_EXISTING | CLONE_NEW_HIVE | IGNORE_CLAIMED | AMBIGUOUS.
> Return: {\"verdict\":..., \"target_hive\": <name|null>, \"new_jurisdiction\": <bool>,
> \"confidence\": 0.0-1.0, \"reasoning\": \"<one sentence>\"}"

**Hive-boundary source (Design-ratified 2026-05-30, path (b)):** the overlay carries
NO readable domain-description field (Session A probe). Bee 3 reads the hive's
boundary directly from the three `site_meta.niche` arrays in
`overlays/<hive>/strategic.json` — the structured source of truth, not a drift-prone
prose summary. The three arrays are kept as **three labelled prompt fields** so Haiku
treats them as distinct signals: keywords = domain signal, authorities = jurisdiction
signal, exclusions = **negative** signal (the most decision-useful field — e.g.
taxchecknow's `explicit_exclusions` listing "immigration scope" resolves the
immigration-visas niche to CLONE with no guesswork). Zero schema change, zero
per-hive authoring burden, automatic for every future hive that meets Bee 1's
overlay floor — architecturally consistent with the clone workflow's locked
easy-handoff priority. §7-anticipated, §19-precedent (Strategy-resolvable within the
ruling, operator-confirmed). Verbatim array values pending Session A code-mirror
probe — they determine whether real EXPAND test fixtures exist (see §3 note + §14).

## 8. Write-back semantics

Writes only: `decided_at = now()`; `decision`; `decision_reason` (structured prefix
taxonomy: `below_threshold_watching` / `existing_hive_satisfies` / `expand` /
`clone` / `ambiguous_operator_review`); `existing_hive` (canonical hive name, EXPAND
only; NULL otherwise). No reject-log table (apiary-scale: decision_reason on the row
is the transparency surface, read by the Bee Farm view). No new migration.

## 9. Constants (hardcoded module constants, with rationale comments)

- `APIARY_CLONE_THRESHOLD = 8.0` — intended-high; cloning is expensive. Carry the
  §6 rationale + "first-fire all-watching is correct, do NOT lower" comment.
- `DEFAULT_BATCH_SIZE = 15` — one non-grounded Haiku call/candidate (~3–5s) is far
  cheaper than Bee 2's 25–30s Gemini chain, so 15 sits well under the 300s ceiling;
  confirm at first fire (do NOT inherit Bee 2's batch=8, which the Gemini tail forced).
- default-bias = CLONE — hardcoded for v1; per-operator preference deferred (§10 Q3).

## 10. Decisions for Design to ratify or redirect (step 2)

These are made with rationale; Design confirms or sharpens (Bee 2 precedent).

- **Q1 — Literal:** Bee 3 writes `EXPAND_EXISTING` (DB CHECK authority). The
  `EXPAND_EXISTING_HIVE` in DESIGN §6 + `clone-types.ts:23` is a phantom (never used
  as a value). Recommend conforming both to `EXPAND_EXISTING` — one-line TS-type edit
  + docs note, NO migration; runs separately with the clone test suite + operator
  sign-off (touches a built workflow file, outside Bee 3's own files).
- **Q2 — Failure default:** never auto-decide on LLM failure; leave undecided →
  auto-retry, log the error. CLONE-bias applies to genuine ambiguity, not to failure.
- **Q3 — CLONE-bias home:** hardcode for v1, defer the per-operator-preference
  setting (§12 critique #2) to a later brief (per-dimension-gate discipline).
- **Q4 — Watching/reject representation:** no new table/column; encode on the row
  via decision + structured decision_reason; operator surface is the Bee Farm view.
- **Q5 — Ambiguous band:** default CLONE + `ambiguous_operator_review` flag in
  decision_reason for the frequent early-days overrides §6 expects; no new queue.

## 11. Build-time probes (factual — for Session A, not Design)

1. **Hive domain-description field** — which `overlays/taxchecknow/` field holds a
   readable domain description for the fit-prompt (vs `claim_radius_keywords`).
2. **Claimed-suppression grain** — is `claim_radius_keywords` jurisdiction-scoped?
   (decides EXPAND reachability — §3 dependency flag).
3. **Spine schema home** — AS-BUILT §11/§3.4 say "Option B separate apiary schema,"
   but Session A reached the table via `public`. Confirm the schema-qualified name
   Bee 3's queries target.
4. **Re-run held SQL** — confirm `decision`/`decided_at` NULL on all 56 before first fire.
5. **Exact reuse helpers** — confirm the names of Bee 1's existing-hive overlay
   reader and Bee 2's `callClaude`/`tryParseJsonObject` imports (mirror, don't invent).

## 12. EXPAND consumer — live-vs-dormant (honest gap, to confirm)

The CLONE consumer is built (Mint Hive, Fork-3-proven). The EXPAND consumer —
feeding seed topics into an already-running hive's Strategic Queen — may not be
wired yet. Bee 3 emits the EXPAND decision + Bee 4 writes the PENDING handoff
regardless; if the consumer is dormant, EXPAND rows sit for operator approval (fine,
matches §15's monthly gate). Document as live-vs-dormant the way per-hive Bee 3
documents its dormant triggers. Operator to confirm which it is.

## 13. Build plan (step 3)

- **Create** `lib/queens/apiary-bee-3-niche-router.ts` — batch entrypoint +
  `routeOneCandidate(...)` extracted for testability (mirror Bee 2's structure).
- **Create** `app/api/cron/apiary-bee-3-niche-router/route.ts` — Bearer
  `CRON_SECRET`, `maxDuration:300`, `?site=`, `?batch=` (mirror Bee 2's route.ts).
- **Reuse, no modification:** `callClaude`, `tryParseJsonObject`, `trackCost`,
  `_shared/error-capture.ts`, Bee 1's existing-hive overlay reader.
- **No new migration.** Q1's TS-type edit is the only non-Bee-3 code touch, gated
  separately.

## 14. Validation plan (step 4)

- Vercel cron-fire + curl + Supabase read-back; never local execution with live keys.
- All 56 rows are <8.0 today → the fit-check won't fire on real data first pass.
  Exercise it with a **forced above-threshold fixture** so EXPAND/CLONE/IGNORE_CLAIMED
  branches all run before they matter in production.
- **Prompt-calibration as diagnostic (§20):** verify verdicts discriminate against
  ground truth — an in-claimed-jurisdiction fixture must return IGNORE_CLAIMED;
  immigration-visas (explicitly excluded) must return CLONE. Mechanical
  JSON-parses-clean is necessary but NOT sufficient.
- **EXPAND fixture (reframed, Design 2026-05-30):** because taxchecknow's claim spans
  5 jurisdictions, a *real* production tax-EXPAND case may not exist. The EXPAND test
  therefore uses an **artificial fixture** (a niche outside the 5 authorities — e.g.
  "German VAT" / "Singapore GST") and is framed as **exercising the branch correctly**,
  NOT as representing likely production traffic. Still a real test of the
  EXPAND-vs-CLONE discriminative boundary; honest about what it proves. Whether a real
  fixture exists at all is determined by the verbatim `claim_radius_keywords` (pending
  the Session A probe) — construct fixtures from the real arrays, not hypothesised ones.
- Confirm batch=15 vs the 300s ceiling; rely on proven per-candidate-UPDATE resumability.
- Deploy-trigger empty-commit if Vercel doesn't pick up the push.

## 15. Summary for Design

A threshold gate at 8.0 (intended-conservative) plus one non-grounded Haiku
fit-check against the existing-hive inventory, routing CLONE/EXPAND/IGNORE with a
jurisdiction-grained suppression boundary and default-bias CLONE. No embeddings, no
panelbeat triggers, no new scoring, no new table, no new migration. Five ratification
points (Q1–Q5), all leaning cheap + reversible + mirror-the-house-pattern; five
factual build-time probes; one honest live-vs-dormant gap (EXPAND consumer).
