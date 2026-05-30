# Apiary Bee 3 (Niche Router) — Brief for Design

**Status:** OPEN — awaiting Design ruling. Blocks the Bee 3 build.
**Date:** 2026-05-30.
**Intended home:** `cole-marketing/APIARY-BEE3-ROUTING-FOR-DESIGN.md`
**Authors note:** Strategy chat. Verified against per-hive `bee-3-site-auditor.md`,
DESIGN-DAY13 §6/§13, AS-BUILT §3.3/§10–§22, the architecture brief, and live DB
probes (Session A, 2026-05-30). Recommendations lean cheap + reversible + mirror
the house pattern; Design to confirm or redirect.

---

## 1. The decision in one line

Build apiary Bee 3 as a **mirror of per-hive Bee 3's router skeleton**, with the
decision *semantics* and the fit-check *mechanism* swapped for apiary's niche→hive
scope. This is the same relationship apiary Bee 2 had to per-hive Bee 2 (§13:
"same shape, different scope"). Most of the prior "is this even a mirror?" debate
was a definitional confusion between skeleton (mirrors) and semantics (differ);
§13 resolves it — it is a mirror at the skeleton level.

---

## 2. What is already settled (NOT Design questions — listed so they are not re-opened)

| Item | Settled value | Authority |
|---|---|---|
| Framing | Same router skeleton as per-hive Bee 3, one scope up | DESIGN §13 |
| Decision enum (runtime) | `CLONE_NEW_HIVE` / `EXPAND_EXISTING` / `IGNORE` | DB CHECK `apiary_nc_decision_chk` (foundation migration L147) |
| Fit-check mechanism | LLM-assisted **semantic match**, NOT cosine embeddings | DESIGN §6 step 2; AS-BUILT §22 L451 |
| "Tax-seed embedder leak" | **Moot** — apiary copies no product-embedder; there is nothing to inherit | follows from the line above |
| Threshold | `overall_score >= 8.0`; first-fire all-IGNORE/watching is **intended**, do NOT temp-lower | DESIGN §6 step 1; AS-BUILT §21 L416 |
| Default-bias | CLONE when in doubt | DESIGN §6 critique; AS-BUILT §22 L452 |
| Routing-not-scoring | Bee 3 computes **no** new scoring signal; consumes Bee 2 outputs only | AS-BUILT §17 L305, §22 L453 |
| Fuzzy claimed-niche suppression | IS the EXPAND-vs-CLONE fork itself, not a separate job | AS-BUILT §3.3 L70 |
| Panelbeat triggers | Dropped — per-hive concept, not apiary's | architecture brief column map |
| Grounding gate for the fit-check | NO grounding — durable taxonomic judgment uses plain Haiku | DESIGN §18 Fork 3 (per-dimension gate) |
| Config home | Hardcoded module constants, not overlay (mirror Bee 2 / per-hive Bee 3) | AS-BUILT §11; per-hive Bee 3 spec L101–109 |
| Input contract | Fully pinned | AS-BUILT §22 |

---

## 3. Input contract (from AS-BUILT §22 — reproduced for Design's convenience)

Bee 3 reads `apiary_niche_candidates WHERE scored_at IS NOT NULL AND decided_at IS NULL`.

**Available per row:** `overall_score`; `score_components.{ai_citation_volume,
ai_citation_velocity (inert 5.0), personalisation_potential, authority_clarity,
competitor_weakness, urgency, regulatory_stability}`; `_meta.{regulatory_stability_grounded,
regulatory_stability_reasoning, haiku_reasoning}`; `confidence`; `recurrence_count`;
`niche_label`; `jurisdiction`; `suppressed`; `blacklist_blocked`.

**Deferred — Bee 3 does NOT get these (and must not compute them):** `cost_to_clone`,
`market_size_signal`, `citation_gap_density`, `personalisation_density`.

**The comparison target for the fit-check** is the existing-hive inventory — today
exactly **one** live content hive (`taxchecknow`); `apiary` is the queen-layer
overlay, not a content hive. There is **no DB hive-registry table** (Session A
probe); the source of truth is the filesystem overlays. Consequence: with one
hive, almost every niche is different-domain → CLONE-by-default, and EXPAND is the
rare case (a tax-domain niche in a new jurisdiction). This mirrors per-hive Bee 3's
day-one all-fallback behaviour (empty embeddings → all BUILD_NEW).

---

## 4. The decision flow (proposed — mirror of per-hive, semantics swapped)

```
[scored, undecided niche candidate]
        │
        ▼
overall_score < 8.0 ?  ── YES ──►  IGNORE (watching)
        │                          decision='IGNORE'
        NO                         decision_reason='below_threshold (watching) — overall=<x> < 8.0'
        │                          (kept in table for re-evaluation; no new table)
        ▼
Fit-within-existing-hive check  (single Haiku call, NO grounding)
prompt: "Given niche <label + evidence + jurisdiction> and existing hive
         <hive name + domain description>, should this be added to the hive
         as a jurisdiction/topic expansion, or is it different enough to
         warrant its own hive?"  → {verdict, target_hive?, reasoning}
        │
   ┌────┴─────────────────────────┐
   │ fits an existing hive        │ different domain / no fit
   ▼                              ▼
EXPAND_EXISTING                 CLONE_NEW_HIVE
existing_hive=<hive>            existing_hive=NULL
decision_reason=<why>          decision_reason=<why>
        │
   (ambiguous band: "maybe EXPAND maybe CLONE" → default CLONE, flag for operator)
```

Bee 4 later reads decided rows and composes `apiary_strategic_handoffs` (§7).
Bee 3 writes **only** `decided_at`, `decision`, `decision_reason`, and
`existing_hive` (on EXPAND). It produces no proposal content — "whoever made it
owns it"; Bee 4 owns the handoff.

---

## 5. Design questions (5)

### Q1 — Reconcile `EXPAND_EXISTING` vs `EXPAND_EXISTING_HIVE`

The literal disagrees across surfaces:

| Surface | Literal | Location |
|---|---|---|
| DB CHECK (candidates + handoffs) + partial index | `EXPAND_EXISTING` | foundation migration L147 / L79 / L172 |
| DESIGN §6 (intent) | `EXPAND_EXISTING_HIVE` | DESIGN-DAY13 §6 |
| TS type union | `EXPAND_EXISTING_HIVE` | `lib/clone/clone-types.ts:23` |

Runtime authority is the DB CHECK (`EXPAND_EXISTING`) — Bee 3 writing the suffix
would be rejected by the constraint. The `_HIVE` literal is never used as a *value*
anywhere (Session A grep; its own clone-types comment marks it out-of-scope).

**Recommendation:** conform everything to the live DB literal `EXPAND_EXISTING`
— a one-line TS-type correction + a docs note, **no migration** (the CHECK and the
partial index already use it). The alternative (alter the CHECK to `_HIVE`) costs a
migration on a built foundation plus a partial-index predicate change, for no gain.
The TS-type edit touches a built+tested workflow file, so it runs with the test
suite and operator sign-off, **separate from Bee 3's own files.**

### Q2 — LLM-failure default for the fit-check

§22 says "defer to operator review"; §6 default-bias is CLONE. But CLONE is the
**expensive** action (config, site, integrations, seeding). Auto-CLONE on an LLM
failure would mint expensive proposals from transient errors — an asymmetric-
reversibility violation (cf. §19 discipline).

**Recommendation:** on fit-check LLM failure, do **not** auto-decide — leave the
row IGNORE/watching with `decision_reason='fit_check_failed — held for operator'`
(cheap, reversible), mirroring Bee 2's "one call's failure must not propagate" /
5.0-default resilience principle, adapted to a categorical decision: the *safe*
default is the cheap/reversible branch, not the default-bias branch. The §6
default-bias-CLONE applies to **genuine ambiguity**, not to **failure**.

### Q3 — Default-bias-CLONE: hardcoded constant or operator preference?

DESIGN §12 critique #2 says the EXPAND-vs-CLONE bias "should be a per-operator
preference setting, not a fixed rule."

**Recommendation:** hardcode default-bias-CLONE as a module constant for v1 (matches
the house hardcoded-constants pattern + §14 "build the simplest version first"),
and **defer** the per-operator-preference setting to a later brief with a named
reason (per-dimension-gate discipline — don't generalise an upgrade before it's
warranted). The operator already overrides decisions in the Bee Farm review (§15),
so the preference setting is not blocking v1.

### Q4 — How are "watching" and the ambiguous operator-review band represented?

§6 says below-threshold niches sit in `status=watching` and get re-scored; §15
describes an operator monthly "Watching list" and frequent overrides. The spine has
**no `status` column** (architecture brief), and **no `apiary_reject_log`** exists
(Session A).

**Recommendation:** no new table and no new column. Encode everything on the
candidate row via `decision='IGNORE'` + a structured `decision_reason` prefix
(`below_threshold_watching` / `existing_hive_satisfies` / `fit_check_failed`),
exactly as §6 L343 intends ("kept in niche_candidates for re-evaluation"). The
operator-review surface is the existing Bee Farm view reading `decision` +
`decision_reason`. This is the apiary-scale analogue of per-hive's reject-log
(56 candidates / 1 hive do not warrant a separate reject table) — a **defer-with-
named-reason**, not a "below per-hive." Confirm this is not considered "below."

### Q5 — Is the per-hive ambiguous-band → operator-queue pattern mirrored?

Per-hive Bee 3 queues its 0.70–0.85 cosine band for operator review rather than
auto-disposing ("the ambiguous band is where expensive mistakes live"). Apiary's
analogue is §6's "maybe EXPAND maybe CLONE" band (tax-adjacent niches).

**Recommendation:** mirror the *intent* but not a separate queue — when the Haiku
verdict is low-confidence/ambiguous, take the §6 default (CLONE) **and** mark
`decision_reason` with an `ambiguous_operator_review` flag so the Bee Farm view can
surface it for the frequent early-days overrides §6 expects. No new infrastructure.

---

## 6. Build sketch (post-ruling — for reference, not a Design question)

Mirrors Bee 2's artifact set:

- **Create** `lib/queens/apiary-bee-3-niche-router.ts` — batch entrypoint +
  `routeOneCandidate(...)` extracted for testability (mirror Bee 2 /
  per-hive `scoreOneCandidate`).
- **Create** `app/api/cron/apiary-bee-3-niche-router/route.ts` — Bearer
  `CRON_SECRET`, `maxDuration:300`, `?site=` (default `apiary`/`taxchecknow` per
  the hive convention — confirm), `?batch=`.
- **Reuse, no modification:** `callClaude` (`lib/bee-runner/anthropic`),
  `tryParseJsonObject` (`lib/sources/validator`), `trackCost`
  (`lib/cost-attribution`), `_shared/error-capture.ts`, and the existing-hive
  overlay reader used by Bee 1's coarse suppression
  (`site_meta.niche.{claim_radius_keywords, primary_authorities}` — see build
  probe below).
- **No new migration** expected — the foundation already supports the write-back
  (Q4). The only DB-touching item is the Q1 TS-type edit, which is not a migration.
- **Hardcoded constants:** `APIARY_CLONE_THRESHOLD = 8.0` (carry "why 8.0 / when to
  revisit" comment, per §6), default-bias-CLONE (Q3), batch size.
- **Batch size:** Bee 3 makes ONE non-grounded Haiku call/candidate (~3–6s),
  far cheaper than Bee 2's 25–30s Gemini chain. Start at **batch=15** and confirm
  against the 300s ceiling at first fire; do not assume Bee 2's batch=8 (that was
  driven by the Gemini tail Bee 3 doesn't have).

### Build-time probes for Session A (factual, not Design)

1. **Hive domain-description field:** §6's fit-prompt needs each hive's *domain
   description*. Confirm which overlay field holds a human-readable description
   suitable for the prompt (vs `claim_radius_keywords`, which is keyword-set, not
   prose). `overlays/taxchecknow/` inspection.
2. **Schema home of the spine:** AS-BUILT §11/§3.4 say "Decision 8 — separate
   apiary schema (Option B)", but Session A reached `apiary_niche_candidates` via a
   `public` query. Confirm the schema-qualified name Bee 3's queries must target
   (does not block this brief; blocks code).
3. **Re-run the held SQL** (decision/decided_at NULL on all 56) to confirm
   routability before first fire.

---

## 7. Validation discipline (banked from §13 gotchas — applies to Bee 3's first fire)

- Vercel cron-fire + curl + Supabase read-back; **never** local execution with live keys.
- **Prompt-calibration is a first-fire diagnostic, not just a smoke test** (§20):
  the fit-check prompt can be mechanically clean yet miscalibrated. Validate that
  the CLONE/EXPAND verdicts *discriminate against ground truth* (e.g. a deliberately
  tax-in-new-jurisdiction niche must come back EXPAND; `immigration-visas` must come
  back CLONE), not merely that JSON parses. Note: with all 56 rows currently <8.0,
  the fit-check won't fire on real data on first pass — validate it with a forced
  above-threshold fixture so the EXPAND/CLONE branch is exercised before it ever
  matters in production.
- Deploy-trigger empty-commit if Vercel doesn't pick up the push.

---

## 8. One-paragraph summary for Design

Bee 3 mirrors per-hive Bee 3's router skeleton at the niche→hive scope: threshold
gate at 8.0 (intended-conservative, first-fire all-watching is correct), then a
single non-grounded Haiku fit-check against the one live hive's domain description,
routing EXPAND_EXISTING / CLONE_NEW_HIVE / IGNORE with default-bias CLONE. It writes
only `decided_at/decision/decision_reason/existing_hive`; Bee 4 owns the handoff.
No embeddings, no panelbeat triggers, no new scoring, no new table, no new migration.
Five questions for ruling: (Q1) conform the `EXPAND_EXISTING` literal; (Q2) fail
safe to watching, not auto-CLONE; (Q3) hardcode the CLONE bias for v1, defer the
operator-preference setting; (Q4) represent watching/reject via decision_reason, no
new table; (Q5) flag ambiguous-band for operator review via decision_reason, no new
queue.
