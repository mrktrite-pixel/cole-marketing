# Apiary Bee 3 (Niche Router) — Build Handover for New Chat

**Status of this document:** authoritative handover. Bee 1 + Bee 2 LIVE + drained; Bee 3 NOT YET SCOPED. Operator wants Bee 3 built next.

**Authored by:** outgoing chat after delivering Bee 2 close-out (2026-05-30). Outgoing chat banked all session work; this doc is the cold-start for the new chat.

**Lives at:** `cole-marketing/APIARY-BEE-3-HANDOVER.md` (durable handover corpus alongside other apiary design briefs).

---

## ⚠️ CRITICAL FINDING — READ FIRST BEFORE ANYTHING

**Per-hive Bee 3 is NOT a router.** Verified 2026-05-30 by file inventory:

- Per-hive Bee 3 = `strategic-bee-3-site-auditor.ts` + `strategic-bee-3-product-embedder.ts` (a Site Auditor + Product Embedder pair)
- Per-hive Bee 3 spec doc: `docs/help/strategic-queen-v2/bees/bee-3-site-auditor.md`

**Apiary Bee 3 per spec (Day-13 §6) is Niche Router** — CLONE_NEW_HIVE / EXPAND_EXISTING / IGNORE decision per scored niche candidate.

**These are entirely different roles.** Apiary Bee 3 has ZERO direct per-hive analogue.

**Implications:**
1. The "copy taxchecknow exactly except [locked deviations]" mandate that drove Bees 1 + 2 **does NOT directly apply** to apiary Bee 3 — there's nothing to copy. Apiary Bee 3 is net-new shape.
2. The DESIGN.md note about apiary Bee 3 "inheriting per-hive Bee-3 product-embedder tax-seed leak" was based on assumed structural parity that does NOT exist. Apiary Bee 3 is a router, not a product embedder. **No tax-seed leak to inherit.**
3. This is a **bigger Design call than Bee 2 was.** Bee 2 had per-hive's row-enrichment shape to mirror; Bee 3 doesn't. Strategy should expect to write a substantial design brief before any code.

**Honest take:** the spec (§6) is well-defined. Apiary Bee 3 should follow §6 directly, with Strategy reading § 6 + the §2 handoff contract + reviewing Bee 2's outputs as the input — not pattern-matching to a per-hive precedent that isn't there.

---

## How to start (read order)

Read these in order. **Don't skip — every doc captures load-bearing context.**

### Step 1 — read STATE.md
**`soverella/docs/help/apiary-strategic-queen/STATE.md`** (committed `aaf2e61`)

The single-page cold-start handoff. Tells you where Bees 1 + 2 stand, what's NOT done, what's the next step. ~7KB. Read in full.

### Step 2 — read AS-BUILT.md
**`soverella/docs/help/apiary-strategic-queen/queen/APIARY-STRATEGIC-QUEEN-AS-BUILT.md`** (committed `a6cebbc`)

The dense authoritative reference. 466 lines. §1-14 covers Bee 1; §15-23 covers Bee 2. Read §11 (locked items) and §17 + §18 (both Bee 2 Design rulings verbatim) carefully — those rulings established discipline you'll mirror.

### Step 3 — read DESIGN.md
**`soverella/docs/help/apiary-strategic-queen/DESIGN.md`** (committed `c3b05d8`)

The decisions log. 358 lines. Decisions 1-9 are Bee 1; 10-16 are Bee 2. Read 10 (output grain locked to row-enrichment), 11 (Path D sharpened ruling), 12 (Option X with Fork 3), 14 (first-fire prompt calibration discipline) — these set patterns Bee 3 will follow.

### Step 4 — read the Bee 2 spec doc
**`soverella/docs/help/apiary-strategic-queen/bees/bee-2-niche-scorer.md`** (committed `8981756`)

Bee 3's direct upstream. The "Bee 3 input contract" section at the bottom enumerates exactly what scored signals Bee 3 will consume. 358 lines.

### Step 5 — read the spec §6
**`cole-marketing/APIARY-STRATEGIC-QUEEN-DESIGN-DAY13.md` §6 (Bee 3 — Niche Router)**

The spec author's design intent for Bee 3. Threshold 8.0+, default-bias CLONE, EXPAND-vs-CLONE fork, operator override frequency. Read §13 (relationship to per-hive Strategic Queens) too — confirms apiary Bee 3 operates at a different layer than per-hive's Bee 3.

### Step 6 — verify per-hive Bee 3 truly isn't a router
**Verify yourself** by running:
```
cd /c/Users/MATTV/CitationGap/soverella
ls lib/queens/ | grep -i bee-3
cat docs/help/strategic-queen-v2/bees/bee-3-site-auditor.md | head -50
```

This is the verification step the outgoing chat ran. It surfaced the structural mismatch. Confirm before building.

---

## Working session pattern (proven across Bee 1 + Bee 2 builds)

**Two-window setup:**

1. **This chat** — the assistant (you). Has the design context, the spec, the patterns. Writes design briefs, drafts code, drafts docs. Does NOT have filesystem access.

2. **Session A** — the operator's separate terminal/Claude window with filesystem access to `C:\Users\MATTV\CitationGap\soverella` and `cole-marketing`. Runs verification commands, applies migrations, places files, commits + pushes.

**Flow for any code change or doc write:**
1. You write the content in chat → present file via `present_files` tool
2. Operator downloads attachment → manually saves/overwrites to disk
3. Operator runs Session A verify command (`ls -la <path>` to check mtime + size changed)
4. If verified, Session A runs `git add + commit + push`
5. Operator pastes Session A output back to you

**Critical discipline learned this session:**
- **Verify on disk before claiming the edit landed.** Multiple times in the Bee 2 session, file uploads silently dropped and Session A confirmed `0 changes added to commit`. Operator + Session A together caught it; pure trust-the-attachment was the failure mode.
- **`ls -la` is the verification primitive.** Check the mtime jumped to today and size matches what was attached.
- **`git diff <path> | head -40` confirms the actual content changed**, not just mtime touched.
- **`git status -sb` after `git add`** shows what's truly staged vs. claimed-staged.

**File upload reliability:** chat attachments for files >15KB dropped silently 3-4 times in Bee 2 session. If an upload fails, operator should paste contents inline as fallback. Don't waste time re-uploading; switch to inline.

---

## Standing operator disciplines (verbatim — DO NOT VIOLATE)

These rules govern every decision:

1. **"Never do things from memory, always research and keep GOAT."** When in doubt, run a verify command. Read the file before writing about it. Cite specific commits or line numbers when claiming things. Operator banks this hard.

2. **"Copy taxchecknow exactly except [explicitly locked deviations]."** For Bees 1 + 2 this was the framing. **For Bee 3, this mandate breaks** (per-hive Bee 3 isn't a router) — flag this explicitly to operator and route the question.

3. **"Match taxchecknow and then better, not below, because apiary is bigger and better."** Surfaced during Bee 2; ratified by Design Option X ruling. Read precisely as "match as floor, exceed where apiary's job warrants." NOT a blanket upgrade ratchet — per-dimension gate principle applies (see Fork 3 ruling in AS-BUILT §18 / DESIGN.md decision 12).

4. **"Document well — operator dashboard-attached."** Every Bee close-out writes to AS-BUILT.md + bees/<bee-name>.md + DESIGN.md + STATE.md. Help dashboard renders these. Future chats start here.

5. **Route architectural questions to Design chat; Strategy executes verbatim per ruling.** Bees 1 + 2 had multiple Design rulings (Decision 7, 2026-05-29 Path D for adjacent, 2026-05-30 Path D sharpened for Bee 2 dims, 2026-05-30 Option X for regulatory_stability LLM-call shape). Strategy mirrored each ruling exactly. **Bee 3 will almost certainly need at least one Design ruling** given the no-direct-precedent shape.

6. **GOAT-level discovery — find anything of note that's a citation gap.** Apiary's purpose is citation-gap discovery at the niche layer. Bee 3's routing decisions affect whether discoveries become hives.

7. **Validation discipline:** Vercel cron-fire + curl + Supabase read-back is the ONLY validation method. NEVER run local `tsx` smoke tests against live keys. Manual fire → verify rows → schedule.

8. **Empty-commit deploy trigger pattern.** Vercel auto-deploy sometimes doesn't pick up a push. Recovery: `git commit --allow-empty -m "chore: trigger vercel deploy"; git push origin main`. Fired 2-3 times in this session; standard pattern now.

9. **Combined check for file existence:** `ls -la <path> && npx tsc 2>&1 | grep <name> || echo "EXISTS + NO ERRORS"`. `tsc | grep` returning empty is ambiguous (file absent OR no errors); the combined check resolves it.

10. **Don't band-aid what Fork-2b resolves.** Fork-2b canonical niche registry is the right fix for fragmentation + over-suppression + cost_to_clone. Building on the broken V1-overlay substrate is the locked anti-pattern.

---

## Verified file inventory (as of 2026-05-30 close)

### Apiary code (`soverella/lib/queens/`)
```
apiary-bee-1-niche-hunter.ts          # Bee 1 dispatcher (LIVE)
apiary-bee-2-niche-scorer.ts          # Bee 2 dispatcher (LIVE, DEFAULT_BATCH_SIZE=8)
apiary-routine-gemini.ts              # Bee 1 routine
apiary-routine-chatgpt.ts             # Bee 1 routine
apiary-routine-serp-community.ts      # Bee 1 routine
apiary-routine-youtube.ts             # Bee 1 routine
apiary-routine-operator-hypothesis.ts # Bee 1 routine
apiary-routine-cross-hive-learnings.ts # Bee 1 socket (enabled:false)
apiary-blacklist-gate.ts              # Bee 1 helper
apiary-niche-deriver.ts               # Bee 1 helper (the keystone)
apiary-niche-suppression.ts           # Bee 1 helper
apiary-candidate-writer.ts            # Bee 1 helper (per-signal pipeline)
```

### Apiary cron routes (`soverella/app/api/cron/`)
```
apiary-bee-1-niche-hunter/route.ts    # LIVE, manual fires only (no vercel.json yet)
apiary-bee-2-niche-scorer/route.ts    # LIVE, manual fires only (no vercel.json yet)
```

### Apiary docs (`soverella/docs/help/apiary-strategic-queen/`)
```
README.md
STATE.md              # cold-start handoff (refreshed aaf2e61)
DESIGN.md             # decisions log (refreshed c3b05d8)
bees/
  bee-1-niche-hunter.md   # Bee 1 spec doc (live as-built)
  bee-2-niche-scorer.md   # Bee 2 spec doc (live as-built, committed 8981756)
queen/
  APIARY-STRATEGIC-QUEEN-AS-BUILT.md  # dense reference (committed a6cebbc, 466 lines)
```

### Apiary migrations (`soverella/migrations/`)
```
20260528120000_apiary_foundation.sql                       # tables + scoring columns
20260528140000_apiary_upsert_function.sql                  # superseded by v2
20260528150000_apiary_upsert_function_v2.sql               # niche-layer-aware
20260528160000_apiary_niche_exploration_queue.sql          # operator hypothesis queue
20260528170000_apiary_nc_source_chk_expand.sql             # superseded
20260528180000_apiary_nc_source_chk_mirror_per_hive.sql    # current source CHECK
20260530060000_bee_run_metrics_queen_id_add_apiary.sql     # queen_id CHECK includes 'apiary'
```

### Cole-marketing durable design corpus
```
APIARY-STRATEGIC-QUEEN-DESIGN-DAY13.md                          # original spec §1-17
APIARY-QUEEN-ARCHITECTURE-BRIEF-FOR-DESIGN.md                   # architectural brief
Apiary queen Bee 1 DESIGN.md                                    # Bee 1 design brief
APIARY-BEE2-SCORING-FOR-DESIGN.md                               # Bee 2 brief (Path D sharpened)
APIARY-BEE2-REGULATORY-STABILITY-LLM-FOLLOWUP.md                # Bee 2 follow-up (Option X + Fork 3)
STRATEGIC-QUEEN-REPLICATION-RUNBOOK.md                          # per-hive replication recipe
FORK-2B-REGISTRY-LOG.md                                         # pre-go-live gate
API-COST-MONITORING-GAP.md                                      # pre-go-live gate
APIARY-BEE-3-HANDOVER.md                                        # THIS DOCUMENT
```

### Per-hive Bee 3 (for reference, NOT to mirror)
```
soverella/lib/queens/strategic-bee-3-site-auditor.ts        # 13564 b
soverella/lib/queens/strategic-bee-3-product-embedder.ts    # 5765 b
soverella/app/api/cron/strategic-queen-bee-3-site-auditor/route.ts
soverella/docs/help/strategic-queen-v2/bees/bee-3-site-auditor.md
```

**Important:** per-hive Bee 3 is a Site Auditor + Product Embedder pair. Apiary Bee 3 is a Niche Router. **Different role. Different shape. Different inputs. Different outputs.** Don't pattern-match.

---

## Database state (verified 2026-05-30)

### `apiary_niche_candidates`
- **152 total rows** (across multiple Bee 1 fires)
- **56 scored** (all eligible — non-suppressed, non-blacklisted)
- **96 suppressed** (~63% over-match rate from V1-overlay false positives, known Fork-2b territory)
- **0 blacklist_blocked** (the 3 signals dropped during Bee 1 serp fire didn't get rows; blocked at gate)

### Scoring columns populated for the 56 eligible rows
- `score_components` jsonb with 7 dimensions + _meta
- `overall_score` 4.22 - 7.39 range
- `confidence` 0.55 - 0.75 range (low because recurrence_count=1 for most; will compound across multi-fire history)
- `scored_at` populated for all 56

### `apiary_strategic_handoffs`
- **0 rows** — Bee 4 hasn't built; this is Bee 3's downstream + Bee 4's output

### `apiary_niche_exploration_queue`
- **2 rows** from Bee 1 operator_hypothesis fire validation (the "Claude Code for business owners" hypothesis test)

---

## Where Bee 3 fits — the spec (Day-13 §6 paraphrased)

**Purpose:** Decide CLONE_NEW_HIVE / EXPAND_EXISTING_HIVE / IGNORE for each scored niche candidate.

**Decision logic per §6:**

1. **Threshold gate.** If `overall_score < 8.0` (default, operator-configurable) → IGNORE. Niche stays in `apiary_niche_candidates` with potential to re-score later if Bee 2 re-runs.

2. **Fit-within-existing-hive check.** For niches passing the threshold, compare against each existing hive's domain config:
   - Same domain + new jurisdiction → likely EXPAND_EXISTING_HIVE
   - Same customer demographic + adjacent domain → MAYBE EXPAND or MAYBE CLONE
   - Different domain → CLONE_NEW_HIVE

   Method per §6: LLM-assisted semantic match. *"Given niche [candidate] and existing hive [hive_name with domain description], should the candidate be added to the existing hive as a jurisdiction/topic expansion, or is it different enough to warrant its own hive?"*

3. **Default-bias CLONE** when ambiguous (§6 critique #1). Operator can later merge if overshot; merging is easier than splitting.

**Output:** writes decision back to `apiary_niche_candidates`:
- `decided_at` (timestamptz)
- `decision` (`CLONE_NEW_HIVE` | `EXPAND_EXISTING` | `IGNORE`)
- `decision_reason` (text — LLM reasoning)
- `existing_hive` (text, only set for EXPAND)

Bee 4 reads decided rows where `decision='CLONE_NEW_HIVE'` or `decision='EXPAND_EXISTING'` and composes `apiary_strategic_handoffs` rows.

---

## Bee 3 input contract (from Bee 2 spec doc — verified live data 2026-05-30)

**Available signals on each scored `apiary_niche_candidates` row:**
- `overall_score` (numeric 0-10) — weighted blend of 7 dimensions
- `score_components.ai_citation_volume` (0-10)
- `score_components.ai_citation_velocity` (0-10, currently inert at 5.0)
- `score_components.personalisation_potential` (0-10)
- `score_components.authority_clarity` (0-10)
- `score_components.competitor_weakness` (0-10)
- `score_components.urgency` (0-10)
- `score_components.regulatory_stability` (0-10, apiary-net-new)
- `score_components._meta.regulatory_stability_grounded` (boolean — proxy for signal confidence on regulatory dim)
- `score_components._meta.regulatory_stability_reasoning` (string, grounded justification from Gemini+Haiku)
- `score_components._meta.haiku_reasoning` (object — personalisation/urgency/competitor justifications)
- `score_components._meta.haiku_calls_succeeded` (integer 0-3 — proxy for LLM scoring reliability)
- `confidence` (numeric 0-1)
- `recurrence_count` (integer — cross-source convergence)
- `niche_label`, `jurisdiction`, `suppressed`, `blacklist_blocked` (row identity + gate state)

**Explicitly deferred (NOT available in v1; documented at AS-BUILT §17 + Bee 2 spec):**
- `cost_to_clone` — Fork-2b blocked
- `market_size_signal` — admitted weak; deferred
- `citation_gap_density` — probe Bee 1 redundancy first
- `personalisation_density` (niche-level roll-up) — derivable later from per-row outputs

---

## What Bee 3 should NOT do without re-routing to Design

Inherited locks from AS-BUILT.md §11 + Bee 1 + Bee 2 rulings:

- Don't band-aid what Fork-2b will resolve (V1-overlay matching for fuzzy near-niche judgment IS Fork-2b territory — the same broken substrate that ruled out Bee 1's adjacent_niche_scan + Bee 2's cost_to_clone).
- Don't auto-promote dimensions to grounding (Fork 3 ruling — per-dimension gate applies).
- Don't modify Bee 2's score_components shape — Bee 3 consumes it as-is.
- Don't touch live per-hive code (per-hive Bee 3 is separate; touching it cascades to taxchecknow's production).
- Don't reduce per-hive's safe batch defaults (apiary's batch=8 is apiary-specific; don't propagate to per-hive's batch=30).

**Likely Bee 3-specific locks to surface to Design:**
- Threshold gate value (default 8.0+; first-pass data showed top score 7.39 — operator may want to lower threshold to surface immigration-visas as a recommendation, OR keep at 8.0 to require more recurrence_count compounding first)
- LLM-call shape for fit-within-existing-hive check (Haiku alone? Gemini-with-grounding? Same per-dimension-gate principle as Bee 2)
- How to handle the false-positive suppression rate (~63% over-match) — does Bee 3 need to re-evaluate suppressed niches that might actually warrant CLONE_NEW_HIVE? Or trust Bee 1's suppression as terminal?

---

## Three honest paths Bee 3 might take (preview the design call)

This is the **structural fork** Strategy will likely need to brief to Design before any code:

**Path A — Row-level router (per-hive Bee 2/3 shape, applied at niche level).** Operates on each `apiary_niche_candidates` row individually. Same dispatcher + cron-route + batch=N pattern as Bees 1 + 2. Decision per row written back atomically.

**Path B — Niche-level router operating on aggregated niche identity.** Reads multiple rows per niche (where `recurrence_count > 1` or where the same `niche_label` appears across multiple `source_payload` types), aggregates the signal, decides per UNIQUE niche label. Output written back to... a separate table? Or to all rows sharing the label?

**Path C — Hybrid (Bee 3 routes individual rows BUT considers niche-level aggregate context).** Each row decided individually for write-back, but the decision logic reads sibling rows with the same `niche_label` for context.

**Most likely correct path:** A. Apiary's keystone (niche-label-keyed fingerprint) already collapses multiple signals to one row via recurrence_count — so "row-level" IS effectively "niche-level" for apiary because dedup happened at Bee 1's write. But this is a Design call — Strategy verifies the assumption and routes if unsure.

---

## Pre-build verification points (DO THESE FIRST in new chat)

Before writing any design brief or code:

1. **Verify per-hive Bee 3 truly isn't a router** (run the `ls + cat` commands above to confirm — outgoing chat found this 2026-05-30; double-check it hasn't changed).

2. **Read the per-hive Bee 3 spec doc** at `soverella/docs/help/strategic-queen-v2/bees/bee-3-site-auditor.md`. Even though it's not a mirror target, it tells you what the per-hive cluster thinks about post-scoring routing (the answer is: per-hive doesn't route at the niche level; per-hive's "routing" is product-level via the embedder).

3. **Verify Bee 2's score_components shape on real data.** Run:
   ```sql
   SELECT
     niche_label,
     overall_score,
     score_components -> '_meta' AS meta,
     decided_at, decision
   FROM apiary_niche_candidates
   WHERE scored_at IS NOT NULL AND hive='apiary'
   ORDER BY overall_score DESC
   LIMIT 5;
   ```
   Confirm the `_meta` block has `regulatory_stability_grounded` + `haiku_reasoning` + `haiku_calls_succeeded` fields. Confirm `decided_at` + `decision` columns exist + are NULL (Bee 3 fills them).

4. **Verify Fork-2b is still NOT built.** Run:
   ```
   ls /c/Users/MATTV/CitationGap/cole-marketing/FORK-2B-REGISTRY-LOG.md
   ls /c/Users/MATTV/CitationGap/soverella/migrations/ | grep -i fork2b
   ```
   If Fork-2b has landed since this handover doc was written, the "don't band-aid the broken substrate" lock relaxes — re-evaluate the fuzzy near-niche judgment design.

5. **Verify vercel.json status.** Both Bee 1 and Bee 2 crons are HELD (not scheduled) pending Fork-2b + monitoring tile + auto-recharge. Confirm nothing was scheduled silently.

6. **Verify standing untracked pair.** Run `git status -s | head -10`. Should show:
   ```
   M .claude/settings.local.json
   ?? app/dashboard/help/queens/strategic-queen/technical-design/PLAN-A-Z-STRATEGIC-QUEEN-4-BEES.md
   ```
   Preserve these throughout the session. Operator wants them gitignored eventually but not now.

---

## Known issues Bee 3 should be aware of

**Inherited from Bee 1:**
- Niche-label fragmentation (19 distinct "compliance" variants surfaced) — Fork-2b territory, NOT Bee 3 to fix at the label level
- Suppression over-match (~63% of candidates suppressed vs real overlap rate significantly lower) — Fork-2b territory. **Decision for Bee 3:** does it re-evaluate suppressed niches, or trust suppression as terminal?

**Inherited from Bee 2:**
- vol=5 fallback for `recurrence_count=1` mutes ai_citation_volume signal — niches need multi-fire history to compound. Bee 3's threshold gate should account for this.
- regulatory_stability is the apiary-net-new dim — its grounded flag in _meta is a meaningful confidence signal Bee 3 should weight.
- 4 §5 dimensions deferred (cost_to_clone, market_size_signal, citation_gap_density, personalisation_density) — Bee 3 designs around their absence.

**Apiary-specific operational gotchas:**
- batch=8 is apiary's safe production size (per-candidate ~25-30s due to Gemini grounding in Bee 2). If Bee 3 uses Gemini calls per row, expect similar timing. Per-hive's batch=30 is NOT safe for apiary.
- Resumability via atomic per-row UPDATEs is proven (Bee 2's batch=13 timeout committed 9/13 cleanly). Mirror this pattern.
- Vercel auto-deploy gaps require empty-commit kicks. Standard pattern.

**LLM provider balance bleeds:**
- Anthropic + OpenAI both bled silently during Bee 1 session (catastrophic when callClaude wrapper hides 4xx errors). Verify both have auto-recharge enabled before any production fires.

---

## Pre-go-live gates (NOT Bee 3's responsibility, but Bee 3's scheduling depends on)

All 4 still outstanding:
1. **Fork-2b canonical niche registry** — blocks adjacent_niche_scan body + cost_to_clone + (potentially) Bee 3's fuzzy near-niche judgment
2. **API cost monitoring tile** — bleed protection
3. **Anthropic + OpenAI auto-recharge** — bleed protection (verify at console.anthropic.com + platform.openai.com)
4. **COLE Orchestrator** — unblocks cross_hive_learnings (Phase 2+)

Bee 3 can be **built + manually fired** without these gates clearing. Just don't schedule in vercel.json until they're done.

---

## Recent commits (full session record for context)

Latest 9 commits on origin/main (`soverella`):
```
aaf2e61 docs(apiary): STATE.md refresh (Bees 1+2 LIVE, follow-up to c3b05d8)
c3b05d8 docs(apiary): STATE.md + DESIGN.md refresh (only DESIGN.md landed actually)
8981756 docs(apiary): bee-2-niche-scorer.md spec doc
a6cebbc docs(apiary): as-built doc updated §15-23 for Bee 2
9c8565f fix(apiary): bee-2 DEFAULT_BATCH_SIZE 30 → 8
5cd59a3 fix(apiary): bee-2 regulatory_stability prompt calibration
f5884be chore: trigger vercel deploy for apiary bee-2
1edac66 feat(apiary): bee-2 niche scorer + cron route
2979cdf docs(apiary): bee-1 close (prior session)
```

Latest on `cole-marketing`:
```
241d606 docs(runbook): add Bee 2 replication section (Stage F)
ba1db90 Apiary queen Bee 1 DESIGN (prior session)
```

---

## The build sequence for Bee 3 (predicted, based on Bees 1 + 2 pattern)

This is the **expected shape**, not gospel. Adjust as the build reveals real needs.

1. **Read** STATE.md → AS-BUILT.md → DESIGN.md → bee-2-niche-scorer.md → spec §6 (the read order above). Honestly read; don't skim.
2. **Verify** per-hive Bee 3 isn't a router (the file inventory check).
3. **Verify** Bee 2's score_components shape on real data via SQL.
4. **Brief Design** with the structural fork (Paths A/B/C from this doc, or whatever shape emerges). Bee 3 has no per-hive precedent — Strategy almost certainly needs Design ruling before code.
5. **Receive Design ruling** — execute verbatim per the ruling.
6. **Write the dispatcher** (probably `lib/queens/apiary-bee-3-niche-router.ts`).
7. **Write the cron route** (probably `app/api/cron/apiary-bee-3-niche-router/route.ts`).
8. **First-fire validation** with `?batch=1` then `?batch=5` (NOT batch=30 — apiary's per-candidate cost is higher than per-hive's).
9. **Watch for signal-quality miscalibration** — the prompt-calibration discipline from Bee 2 applies universally. Don't trust "the chain works" as validation; require signal discrimination on known-ground-truth niches.
10. **Drain the backlog** (56 scored candidates ready for routing).
11. **Doc sync** — AS-BUILT update + bees/bee-3-*.md spec doc + DESIGN.md decisions + STATE.md refresh + replication runbook Stage G.
12. **Pre-go-live gates remain** — don't schedule cron in vercel.json yet.

---

## One honest meta-note for the new chat

The outgoing chat (this one) made several mistakes worth knowing:

1. **Flipped twice on regulatory_stability LLM-call shape** (X → Y → X) before routing to Design. The flips were on the right principles each time but the right move was to route earlier. **Bank: when Strategy flips twice in one session, route to Design rather than self-decide.**

2. **Initially mis-read the per-hive Bee 2 prompt leak as a structural issue** when it was a 5-character English-string edit. The "exactly same as taxchecknow" mandate was technically satisfied by one string change + adding regulatory_stability. **Bank: read the actual code before theorizing about structural difficulty.**

3. **First-fire validation surfaced a real miscalibration** (uniform 2/10 regulatory_stability) that the chain-works-mechanically check would have missed. The fix landed in 30 minutes once spotted. **Bank: signal-quality validation is separate from mechanical-correctness validation. Do both.**

4. **Multiple file upload failures** through the session — chat attachments dropped silently for files >15KB about 3-4 times. Operator+Session A caught it via `ls -la` mtime check. **Bank: verify placement on disk before commit, every time.**

5. **One commit message overstated what landed** (`c3b05d8` claimed both STATE.md and DESIGN.md refreshed; only DESIGN.md did). Recovered with a follow-up commit (`aaf2e61`). **Bank: read `git status -sb` output before `git commit`, not just after.**

These are normal session mistakes. Bank them so the new chat avoids re-discovering.

---

## Closing

Bee 3 is the strategic decision-maker. CLONE / EXPAND / IGNORE per niche. Default-bias CLONE (operator can merge later; merging is easier than splitting). Threshold 8.0+ default but operator-configurable. Writes back to `apiary_niche_candidates`. Bee 4 reads decided rows.

The work is well-set-up. Bee 2's outputs are clean and discriminating. The 56 scored candidates are ready for routing. Top niche `immigration-visas` (7.39) is the strongest first apiary discovery.

Trust the docs. Verify before claiming. Route to Design for shape calls. Match per-hive where shape applies, defer with named reasons where it doesn't, build apiary-net-new shape where there's no per-hive precedent (this is Bee 3's whole story).

Good luck.

— outgoing chat, 2026-05-30
