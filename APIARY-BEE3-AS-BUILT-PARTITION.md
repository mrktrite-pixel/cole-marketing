---

# Bee 3 — Niche Router

## 24. What Bee 3 is, in one paragraph

Bee 3 is the Apiary Strategic Queen's router. It reads scored, undecided niche candidates from `apiary_niche_candidates` (those Bee 2 has scored, `decided_at IS NULL`) and routes each to one of three row decisions — `CLONE_NEW_HIVE`, `EXPAND_EXISTING`, or `IGNORE` — then writes the decision back. It is routing, not scoring: it consumes Bee 2's `overall_score` and computes no new score. It mirrors the per-hive Bee 3 router skeleton (same shape, different scope: Apiary routes across the whole internet's citation-gap niches rather than auditing one hive's pages). It runs as a standalone Vercel cron route (`maxDuration = 300`, `force-dynamic`); there is no Apiary orchestrator route — each Apiary bee is independently schedulable. Schedule is HELD (no `vercel.json` entry) pending the pre-go-live gates.

## 25. As-built decision set

Each candidate flows through, in order:

| Stage | Condition | Outcome |
|---|---|---|
| Threshold gate | `overall_score < 8.0` | `IGNORE` — `below_threshold_watching` (no Opus call) |
| Opus fit-check | `overall_score >= 8.0` | one `claude-opus-4-7` call (Tier 3), then the gates below |
| Scope gate 1 | no clear/citable governing authority | `IGNORE` — `out_of_scope: no_anchor_authority` (permanent) |
| Scope gate 2 | authority exists but guidance too thin to ground 100% accuracy | `IGNORE` — `out_of_scope: insufficient_anchor` |
| Scope gate 3 | authority is non-English | `IGNORE` — `out_of_scope: language_capacity` (deferred) |
| In-scope: claimed | same domain, jurisdiction already claimed | `IGNORE_CLAIMED → IGNORE` (`existing_hive_satisfies`) |
| In-scope: new juris. | same domain, new in-scope jurisdiction | `EXPAND_EXISTING → EXPAND` (sets `existing_hive`) |
| In-scope: new domain | different domain, or matches a hive's exclusions | `CLONE_NEW_HIVE → CLONE` |
| In-scope: undecided | genuinely ambiguous EXPAND vs CLONE | `AMBIGUOUS → CLONE` (default bias) |

Fail-safe: any fit-check exception/parse failure leaves the row **undecided** (auto-retried next fire) and **never** auto-CLONEs. The fit-check prompt requires the model to name the governing authority, report its primary language, and report `anchor_sufficient`; the dispatcher gates deterministically on those reported facts.

## 26. Design ruling 2026-05-30 — Apiary Bee 3 completion

**Brief filed at:** `cole-marketing/APIARY-BEE3-ROUTING-FOR-DESIGN.md` (commit `22b9035`).

### Verdict
Ratified. Bee 3 is a router mirroring the per-hive Bee 3 skeleton (the handover claim "not a router" was refuted). Threshold 8.0 is intended-high; the first-fire all-IGNORE result is correct, not a miss — do not lower it. Default-bias CLONE on ambiguity.

### Key reasoning
Routing decisions consume Bee 2 outputs; cloning is expensive, so the bar to leave the watching state is deliberately high. The decision enum matches the DB CHECK (`CLONE_NEW_HIVE | EXPAND_EXISTING | IGNORE`).

### Catalogued deferred
`phase_readiness` on CLONE verdicts → deferred to Bee 4 / the handoff layer.

### Operator mandate satisfied
Conservative threshold; never auto-CLONE on failure; routing-not-scoring; schedule HELD until gates clear.

## 27. Design ruling 2026-05-31 (follow-up) — Phase-1 jurisdiction scope & authority-anchor gate

**Brief filed at:** `cole-marketing/APIARY-SCOPE-ADDITION-FOR-DESIGN.md` (ratified with three pickups).

### Verdict
Ratified. Adds the missing scope rule surfaced during fixture testing (a Germany-VAT fixture routed CLONE because no scope rule existed).

### Key reasoning
In-scope requires **both** a clear, citable, *definitive* governing authority (the correctness gate) **and** that authority operating in a language we can author in today (the capacity gate). The anchor test is simultaneously the scope gate **and** the quality gate — a niche with no citable authority cannot satisfy the citation-gap thesis, so routing it to CLONE would create a hive that cannot ship a GOAT product by construction. Scope follows the governing authority, not the geography named.

### Catalogued deferred
Non-English markets (future authoring-capacity phase); CLONEs to not-yet-live verticals carry `phase_readiness: queued`.

### Operator mandate satisfied (Q1, Q3 — operator-strategy calls)
- Q1: in-scope = English-authority jurisdictions; **US is the priority market**; open to new English-authority jurisdictions (Ireland/Singapore/SA) as capacity allows.
- Q3: phase-gating via Reading 1 (existing PENDING handoff + `phase_readiness` flag); live = tax (EXPAND); Phase 1 = visa; queued = immigration / crypto / estate / business-viability.

## 28. Strategy-resolved sub-decisions (within the two rulings)

- **Model tier: Opus (`claude-opus-4-7`).** Rejected: Haiku. Design initially ratified Haiku, but the cole-brain mandatory convention (Strategic-Queen decisions run on Tier 3) outranks a ratification made before the convention surfaced. Operator-authorized per BEE-STAGE-GATES.md.
- **Gate placement: prompt-driven (model names authority/language/sufficiency).** Rejected: hard country allow-list — brittle against free-text jurisdictions and encodes a moving target into code; a prompt gate adapts as overlays change.
- **Two distinct out-of-scope reasons.** Rejected: collapsing non-English into "no authority" — Germany *has* an anchor (BZSt); deferring it for language vs absence-of-authority are different conditions, and preserving the signal keeps future "add non-English authoring?" decisions data-driven.
- **New jurisdiction, same domain → EXPAND.** Rejected: CLONE-per-jurisdiction — taxchecknow is already a six-authority hive; a 7th English-authority tax jurisdiction is the hive growing, and a separate site would fragment the tax domain and break the Connections Desk.
- **Anchor bar = citation-sufficiency (depth), not existence.** Rejected: existence-only — a named-but-thin authority cannot ground 100%-accurate content; this is the ratified word "definitive" applied correctly.
- **Batch = 20.** Rejected: 30 (zero margin if every Opus call retries: 30 × ~13.5s = 405s > 300s) and 10 (bottlenecks backlog drainage).

## 29. First-fire diagnostic findings (2026-05-30 → 05-31)

The fit-check path was broken on first contact and fixed through instrument-don't-guess:

- **`temperature` is deprecated for Opus 4.x.** The call mirrored Bee 2's Haiku shape and passed `temperature`; Opus rejected it with `400 invalid_request_error`. First fix (drop it from Bee 3) was incomplete — the shared helper still sent its `?? 0.7` default. Real fix: `lib/bee-runner/anthropic.ts` now omits `temperature` for `claude-opus-*` only (Haiku/Sonnet unaffected). This was a latent cluster-wide Opus bug.
- **Instrument, don't guess.** The fit-check `catch` swallowed the error, so the cause was invisible; adding error surfacing to `decision_reason` revealed the exact 400 in one re-fire.
- **Field-drop bug (caught by fixtures).** `governing_authority` / `authority_language` were added to the interface, prompt, and gate but **not mapped from the parsed response**, so every candidate hit `no_anchor_authority` — including UK/HMRC and Ireland/Revenue, which can't be authority-less. The fixtures surfaced it immediately; in production it would have silently IGNORE'd everything.
- **EXPAND wouldn't fire.** Even for the textbook case (Ireland VAT), the model mapped *any* unclaimed jurisdiction → CLONE. Cause: the prompt handed it five named authorities, so it reasoned "not in the list → new hive" instead of abstracting "taxchecknow = the tax domain." Fix: prompt now has the model infer each hive's domain from its claimed terms and treat same-domain-new-jurisdiction as EXPAND.

## 30. First-fire / drain results — the validation evidence

### Operational stats
- **Step 9 (real data):** drained all 56 scored rows; every one `IGNORE / below_threshold_watching` (top score 7.39 < 8.0), 0 failed, $0, ~260ms/row (threshold path, no Opus). Read-back: 0 undecided / 56 decided / 56 ignored. Resumability + write-back + 13-col `bee_run_metrics` all confirmed.
- **Step 11 (forced fixtures, post-fixes):** 6/6 routed correctly, 0 failed, $0.165 total (~3.7s/call), all six routing outcomes exercised.

### Calibration (the six fixtures, final run)
- `uk-vat-filing` → IGNORE `existing_hive_satisfies` (HMRC, claimed)
- `germany-vat-compliance` → IGNORE `language_capacity (BZSt, German)`
- `immigration-visa-sponsorship` → CLONE (UKVI, different domain + exclusion)
- `ireland-vat` → **EXPAND_EXISTING**, `existing_hive: taxchecknow` (Revenue Commissioners, new in-scope jurisdiction)
- `noauthority-niche` → IGNORE `no_anchor_authority`
- `weak-authority` (Belize) → IGNORE `insufficient_anchor` (real authority, guidance too thin)

### Honest read
The below-threshold path is proven on real data; every above-threshold path (IGNORE_CLAIMED, EXPAND, CLONE, and all three out-of-scope reasons) is proven on fixtures. The previously-flagged "EXPAND largely dormant" finding was **underweighted** — there are real English jurisdictions outside the five (Ireland/Singapore/SA), so EXPAND has live v1 candidates; the scope addendum un-dormants it. A transport quirk (empty client render of a fire that ran server-side) was resolved with `-UseBasicParsing`; the DB is treated as the authoritative read.

## 31. Bee 4 input contract (per hive)

Bee 4 (handoff composer — **not yet built**) consumes Bee 3's written decisions:
- `CLONE_NEW_HIVE` rows → Bee 4 produces a CloneProposal handoff that pends in `apiary_strategic_handoffs` until operator approval, carrying a `phase_readiness` (`ready | queued`) flag in metadata (the live/queue split per §27).
- `EXPAND_EXISTING` rows (with `existing_hive` set) → feed the named hive's Strategic Queen to expand its jurisdiction coverage.
- `IGNORE` rows → no handoff.

Bee 4 does **not** receive: the scope-gated IGNOREs (`no_anchor_authority` / `insufficient_anchor` / `language_capacity` are terminal), nor below-threshold watching rows. The `phase_readiness` mapping (which verticals are live vs queued) lives in Bee 4, not Bee 3.

## 32. Bee 3 build artifacts

- **Dispatcher:** `lib/queens/apiary-bee-3-niche-router.ts`
- **Cron route:** `app/api/cron/apiary-bee-3-niche-router/route.ts` (`maxDuration = 300`, `force-dynamic`)
- **Reader extension:** `lib/queens/apiary-niche-suppression.ts` — `buildClaimedInventory` additively surfaces `explicit_exclusions` (Bee 1 unchanged)
- **Shared-helper change:** `lib/bee-runner/anthropic.ts` — omit `temperature` for `claude-opus-*`
- **Reuses:** `callClaude` (anthropic) · `trackCost` (cost-attribution) · `tryParseJsonObject` (validator) · `logBeeError` (queens/_shared/error-capture) · `buildClaimedInventory` (apiary-niche-suppression)
- **Commit chain:** `ed5d270` (reader) → `9c1c117` (dispatcher + route, reconciled vs Bee 2) → `be552c4` (instrument errors) → `899a1f7` (drop temperature — partial) → `7fc07c1` (helper omits temperature for Opus) → `860361d` (scope gate) → `f13d55b` (map authority/language — field-drop fix) → `c807df6` (domain-abstraction EXPAND + citation-sufficiency) → `c87aea0` (batch = 20)
- **Schedule:** HELD — 0 Apiary entries in `vercel.json`, pending pre-go-live gates (mirrors Bee 2).

### Meta-lessons banked
Instrument the failure path before guessing a cause · fixtures catch empty/silent input that prod would hide · verify which queen's runtime you're reading (Apiary standalone route vs per-hive Strategic Queen) · a mandatory convention outranks a ratification made before it surfaced · size batches against measured latency with margin for unmeasured retry inflation · `&&`-gated `tsc → add → commit → push`; validation is `tsc --noEmit` + live-fire (no unit-test suite).
