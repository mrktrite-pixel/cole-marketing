# DAY 11 → DAY 12 HANDOVER

**Date:** 2026-05-14 (Thursday) → 2026-05-15 (Friday) AWST
**Outgoing chat:** Day 11 Strategic Queen audit + Phase 2 sign-off
**Incoming chat:** Day 12 — Production Queen build session (operator-led)
**Handover quality target:** Day 12 operational within 5 minutes, not hours

---

## TL;DR FOR INCOMING CHAT

> Read this section. If you do nothing else, read this.

**What happened Day 11:** A planned "close Phase 2 today" became a comprehensive audit when we discovered the Synthesis Layer was reading 0 bee signals. Pivoted to discipline. Spent ~10 hours auditing Strategic Queen end-to-end. **Result: Strategic Queen Phase 2 is empirically verified working** (synthesis run_id `813d495d`) — 3 decisions + 3 handoffs + 5 recommended_actions in 46s at $0.053. Architecture proven. **Zero new features shipped.** Just audit + tests + one canonical technical design document.

**What Day 12 is:** Operator decided to start Production Queen build. When Production Queen hits issues (which it will — see "Known Production Queen blockers" below), those are the audit findings made tangible. Fix them as they surface. Don't build a fix-list-first session.

**What you must NOT do:**
1. Re-audit Strategic Queen. It's signed off at ~95%. Trust the audit table.
2. Re-discover folder structure. Section 2 of this doc tells you everything.
3. Try to verify E1 Path 1A unprompted. Operator deferred it.
4. Scope-creep. Day 11 lesson #1: scope creep is the silent killer.

**What you MUST do:**
1. Read sections 1-4 of this doc in the first 5 minutes
2. Apply the 7 discipline locks (section 5) ruthlessly
3. When operator hits a Production Queen issue, cross-reference section 8 (Known Production Queen blockers) and section 10 (HK backlog)
4. If something feels wrong, **stop and verify before composing**. Discipline Lock #2.

---

## TABLE OF CONTENTS

1. Day 11 narrative (what actually happened)
2. Repository structure & directory map
3. Today's deliverables (what got shipped)
4. Empirical verdict (Strategic Queen state)
5. Discipline locks (7 ratified today)
6. The pivot to Production Queen
7. Production Queen entry guide
8. Known Production Queen blockers (predicted issues)
9. Session A protocol (when + how to dispatch)
10. Full HK backlog (prioritised)
11. Today's verified code locations (Session A audit anchors)
12. Today's run_ids + UUIDs
13. The day's discoveries (lessons learned, ratified)
14. What today did NOT achieve (honest accounting)
15. Day 12 opening sequence (literal first 10 minutes)

---

## 1. DAY 11 NARRATIVE

**Morning (~7am AWST):** Started thinking Strategic Queen Phase 2 was 80% GOAT, close to sign-off. Plan was "close Phase 2 today."

**Mid-morning:** Shipped Step 10 Synthesis Layer (5 commits + hotfix Commit E `d74d9ee` for silent-insert bug on bee_run_metrics writer).

**Noon (~12pm AWST):** Discovered Synthesis Layer was reading 0 bee signals. Actual GOAT state ~33%, not 80%. Realised earlier "85% close enough" pattern was the discipline failure we'd been letting slip.

**1:30pm:** Operator timeout. "I've lost control of this." Reset. Locked discipline.

**2pm-5pm:** Disciplined audit. Session A code audit round (17 GREEN / 4 RED / 13 NEEDS-SQL). Operator SQL diagnostic round (13 GREEN). Phase 1 sign-off (3 items GREEN). Phase 2 sign-off (3 items GREEN + RLS bonus). Canonical data flow v2.0 doc.

**5pm-6pm:** Strategic Queen empirically verified end-to-end via synthesis fire `813d495d`. Canonical technical design document drafted (~1,475 lines, 7,353 words).

**6pm:** Two deliverables shipped to dashboard:
- `_help.tsx` updated (Strategic Queen split into Overview + Technical Design buttons)
- `technical-design/` route prepared but Day 12 needs to verify it's actually on disk (see section 3)

**Verdict:** Day 11 produced ZERO new features but achieved the most important thing — **architecture empirically proven**. Without this audit, Production Queen would have been built on a foundation we believed worked but didn't actually prove.

---

## 2. REPOSITORY STRUCTURE & DIRECTORY MAP

> Don't re-discover this. It's verified Day 11.

### 2.1 Two repos

```
C:\Users\MATTV\CitationGap\
├── soverella\           ← Dashboard control centre (deployed soverella.com)
│   ├── app\
│   │   ├── api\         ← Cron routes + server actions
│   │   │   └── cron\
│   │   │       ├── e1-citation-gap-scanner\route.ts
│   │   │       ├── e2-market-research\route.ts
│   │   │       ├── e3-customer-psychologist\route.ts
│   │   │       ├── e4-competitor-monitor\route.ts
│   │   │       ├── e6-trend-velocity-scanner\route.ts (deferred)
│   │   │       ├── e7-truth-sync\route.ts
│   │   │       ├── priority-decay\route.ts
│   │   │       └── strategic-queen\route.ts  ← Synthesis layer
│   │   ├── dashboard\
│   │   │   └── help\
│   │   │       ├── page.tsx          ← 259-byte wrapper (imports _help.tsx)
│   │   │       ├── _help.tsx         ← THE ACTUAL HELP PAGE (updated Day 11)
│   │   │       ├── queens\
│   │   │       │   └── strategic-queen\
│   │   │       │       ├── page.tsx              ← Overview ("bees · pub test")
│   │   │       │       └── technical-design\    ← NEW Day 11
│   │   │       │           ├── page.tsx          ← Technical Design page
│   │   │       │           └── STRATEGIC-QUEEN-TECHNICAL-DESIGN.md
│   │   │       └── (other manuals)
│   ├── lib\
│   │   ├── queens\      ← Bee logic (all bees + Strategic Queen helpers)
│   │   │   ├── e1-citation-gap-scanner.ts
│   │   │   ├── e2-market-researcher.ts
│   │   │   ├── e3-customer-psychologist.ts
│   │   │   ├── e4-competitor-monitor.ts
│   │   │   ├── e6-trend-velocity-scanner.ts
│   │   │   ├── e7-change-detector.ts
│   │   │   ├── priority-decay.ts
│   │   │   └── gatherSignals.ts      ← Strategic Queen batch signal reader
│   │   └── dashboard\
│   │       └── pending-approvals.ts
│   ├── overlays\
│   │   └── taxchecknow\
│   │       └── strategic.json        ← topic_universe + RSS feeds + competitor filters
│   ├── vercel.json                   ← Cron schedules (see 2.3)
│   └── .gitignore
│
└── cole-marketing\      ← Docs + live customer sites (taxchecknow.com etc.)
    └── (separate concerns from soverella)
```

### 2.2 The `_help.tsx` vs `page.tsx` pattern (CRITICAL — bit us Day 11)

The `app/dashboard/help/page.tsx` is a **259-byte wrapper** that just imports and re-exports `_help.tsx`. The actual help content is in `_help.tsx`. **When the operator asks to "update the help page," they mean `_help.tsx`, NOT `page.tsx`.** Same pattern may exist for other dashboard routes — when in doubt, check file size: if it's <500 bytes, it's almost certainly a wrapper.

### 2.3 Vercel cron schedule (verified Day 11)

```
04:00 UTC — E1 Citation Gap Scanner
04:30 UTC — E7 Truth-Sync
05:00 UTC — E2 Market Researcher (Row-of-Bees parent)
05:30 UTC — E3 Customer Psychologist
06:00 UTC — STRATEGIC QUEEN SYNTHESIS  ← The heart
06:15 UTC — E4 Competitor Monitor
06:30 UTC — Priority Decay
06:45 UTC — E6 Trend Velocity (deferred until 2026-05-27)
```

**Note:** E4 fires AFTER Strategic Queen. Day-N+1 synthesis reads Day-N's E4 outputs. This is by design.

### 2.4 Vercel envelope constraint

**5-minute maxDuration on Hobby plan.** E2 timed out on 2026-05-14 at 4:50 elapsed with FUNCTION_INVOCATION_TIMEOUT. Connection #12 (envelope discipline) NOT IMPLEMENTED. Documented as fix path needed.

---

## 3. TODAY'S DELIVERABLES

### 3.1 What's in git (verified pushed Day 11)

1. **6 commits to origin/main:**
   - `7fb725a / 5d765f8 / 34d8da7 / 8d260bb / 094f5e3 / d74d9ee` (Commit E — bee_run_metrics silent-insert hotfix)
   - Production deployment: `dpl_EgVEQa74NDUknzmbc5ahQMYLqrnd` (SHA `d74d9ee`, Ready)

2. **`_help.tsx` updated** (Strategic Queen split into Overview + Technical Design — committed end of Day 11)

### 3.2 What's UNCERTAIN about git state (Day 12 must verify first thing)

**Day 11 closed with this state — Day 12 must verify:**

```bash
cd C:\Users\MATTV\CitationGap\soverella
git log --oneline -5
git status
ls app\dashboard\help\queens\strategic-queen\
```

**Expected state:**
- `_help.tsx` last commit has message "docs(strategic-queen): split Help page Queens entry into Overview + Technical Design buttons"
- `app/dashboard/help/queens/strategic-queen/technical-design/` folder MAY or MAY NOT exist on disk

**Critical Day 11 anomaly to flag:** When the operator pushed the `_help.tsx` change, git showed "Everything up-to-date" before the technical-design folder was added. **It's possible the technical-design folder + its two files (`page.tsx` + `STRATEGIC-QUEEN-TECHNICAL-DESIGN.md`) were never saved to disk.** If the second button on `_help.tsx` ("Strategic Queen — Technical Design") leads to a 404, that's the cause.

**If the folder doesn't exist, Day 12 needs to either:**
- (a) Re-create the technical-design folder + files (the files are in `/mnt/user-data/outputs/` from Day 11 chat if attached, OR can be regenerated from the canonical document content)
- (b) Revert the second button in `_help.tsx` until ready to ship the route

### 3.3 The canonical technical design document

**File:** `STRATEGIC-QUEEN-TECHNICAL-DESIGN.md` (~1,475 lines, 7,353 words)

**Target location:** `C:\Users\MATTV\CitationGap\soverella\app\dashboard\help\queens\strategic-queen\technical-design\STRATEGIC-QUEEN-TECHNICAL-DESIGN.md`

**Contents:** 11 sections — Purpose & Architectural Position, 15 Connection Points, Visual Flow Diagrams (6 ASCII), Schema Reference (13 tables), Bee-by-Bee Reference (8 bees with file paths + line numbers), Key Architectural Patterns (10), Known Issues Inventory (36+ HK items), Deferred-by-Design Items, Production Queen Integration Guide (canonical read query), Airport Model Considerations, Appendices.

**This is the canonical reference for Production Queen integration.** Section 9 has the exact SQL query Production Queen should use to read Strategic Queen handoffs.

---

## 4. EMPIRICAL VERDICT (Strategic Queen state)

### 4.1 The killer empirical proof

**Synthesis fire run_id `813d495d-9b82-48f3-ba8e-7bed99858e0e`** (2026-05-14 07:30:29 UTC):
- 46s elapsed, $0.053, 7,663 tokens, model=claude-sonnet-4-6
- 3 gaps synthesised
- 16 E2 + 3 E3 + 8 E4 + 0 E6 + 0 E7 signals read
- 3 decisions written (all priority_update, scores +1 to +2 to offset decay)
- 3 handoffs written:
  - FRCGW → Priya → production-queen → phase=now
  - s100A → Gary → production-queen → phase=now
  - PSI → Priya → operator → phase=next_quarter
- 5 recommended_actions written:
  - 2× build_product (urgent, FRCGW + s100A)
  - 1× escalate (urgent, payment infrastructure check)
  - 1× build_story (high, FRCGW /stories/)
  - 1× manual (high, queue PSI)
- signal_provenance: 2 of 3 show dominant_signal=psychology, 1 shows scoring_only

**This proves end-to-end working:**
- Connection #8 (Synthesis JOINs all 6 sources) ✅
- Cross-bee triangulation in Sonnet reasoning ✅
- Character matching to E3 patterns ✅
- Product slug routing to COLE registry ✅
- Business-context awareness (payment infra escalate flag from "8 sessions, 0 purchases") ✅
- Handoff routing logic (production-queen vs operator) ✅

### 4.2 The 15 Connection Points — final Day 11 state

| # | Connection | Status |
|---|---|---|
| 1 | gap_queue.citation_gap_id → citation_gaps.id | ✅ GREEN |
| 2 | pending_approvals.payload contains citation_gap_id | ✅ GREEN |
| 3 | Approval server action carries citation_gap_id forward | ✅ GREEN |
| 4 | E7 populates change_diff.affected_gap_ids | ✅ GREEN-EMPIRICAL |
| 5 | Synthesis JOINs rule_changes via citation_gap_id | ✅ GREEN |
| 6 | E2 stamps gap_queue_id AND citation_gap_id | ✅ GREEN |
| 7 | E3 keys on citation_gap_id | ✅ GREEN |
| 8 | Synthesis JOINs all 6 sources | ✅ GREEN-EMPIRICAL |
| 9 | E4 stamps gap_queue_id AND citation_gap_id | ✅ GREEN |
| 10 | last_signal_refreshed_at updated by every bee | ❌ PARTIAL (F2 work) |
| 11 | Every bee writes bee_run_metrics | ❌ PARTIAL (F3 work) |
| 12 | Vercel cron envelope discipline | ❌ NOT IMPLEMENTED |
| 13 | Sub-bee failure isolation | ❌ NOT IMPLEMENTED |
| 14 | API budget monitoring | ❌ NOT IMPLEMENTED |
| 15 | Shelved-bee runtime enforcement | ❌ NOT IMPLEMENTED |

**Net: 9 of 15 GREEN. 6 are polish on a working system, not architectural blockers.**

### 4.3 What's signed off vs deferred

| Phase | Status | Items |
|---|---|---|
| Phase 1 (quick wins) | ✅ SIGNED OFF 100% | 4.B3, 7.B1, 7.B2, 7.B3, 6.B1 |
| Phase 2 (bee fires) | ✅ SIGNED OFF 100% | Item 1 (synthesis 813d495d), Item 2 (E4 threshold), Item 3 (E7 cascade) + RLS bonus |
| Phase 3 (hard-to-verify) | 🟡 DEFERRED | E1 Path 1A test (operator decision) |

**Audit table state: ~95% locked. 5% deferred-by-design or empirically unprovable today.**

---

## 5. DISCIPLINE LOCKS (7 ratified Day 11 — APPLY GOING FORWARD)

These are non-negotiable. Day 11 discipline failures all traced back to violating one of these.

### Lock #1 — Audit-first protocol
**Verify infrastructure state before drafting fixes.** Day 11 example: assumed Synthesis was reading bee signals. It wasn't. Cost ~4 hours of recovery.

### Lock #2 — Verify-before-compose
**Schema dump BEFORE composing SQL that references columns. File read BEFORE composing edits.** ~10 catches Day 11. Examples:
- `rule_changes.change_diff` is TEXT not JSONB (assumed JSONB → SQL would have failed)
- `psychology_signals.pattern_confidence` is integer 0-100 not float 0.0-1.0
- `_help.tsx` is the actual help page, NOT `page.tsx` (the 259-byte wrapper)
- `pg_tables.forcerowsecurity` doesn't exist this Postgres version

### Lock #3 — Deploy verification protocol
**Confirm Vercel SHA matches expected commit before declaring shipped.** Day 11 hotfix Commit E (`d74d9ee`) verified Ready before sign-off.

### Lock #4 — One-command-at-a-time
**No batched fires. No fire-then-verify combos.** Each command runs, output observed, decision made, next command issued.

### Lock #5 — GOAT stage sign-off
**Every stage GREEN before advance. No yellow. No "we'll come back to it."** Day 11 example: refused to sign off Phase 2 at 33% (1 of 3 items GREEN). Finished all 3 properly.

### Lock #6 — Reddit-signal-critical
**Operator declared Reddit signal foundational.** Quote: "this bee cannot die." HK #G-10 (Reddit OAuth integration) is operator-foundational priority. ~4-6 hours estimated.

### Lock #7 — Strategic University
**Bees attend class continuously.** Operator watching less needed. The hive learns from its own output via bee_run_metrics + KP layers. Don't manually replicate what should be automated.

### Hidden Lock #8 (emerged Day 11, ratify here) — Scope creep is the silent killer
Day 11 example: F1 became F1+F2+F3 became F1+F2+F3+Reddit-redesign. Hours lost to scope inflation. **When a fix grows mid-flight, STOP and re-scope explicitly with operator.** Don't proceed.

---

## 6. THE PIVOT TO PRODUCTION QUEEN

**Operator decision end of Day 11:** Skip remaining Phase 3 (E1 Path 1A test) and start Production Queen Day 12.

**Operator rationale:** "When we hit an issue there we can fix it." Don't pre-fix; let real Production Queen integration surface the actual blockers.

**Day 12 implication:** This is NOT a fix-list session. This is a **build session that uses today's audit findings as the troubleshooting reference**.

When Production Queen hits an issue:
1. Cross-reference section 8 (Known Production Queen blockers) — was this predicted?
2. Cross-reference section 10 (HK backlog) — is there a known fix path?
3. Apply Discipline Locks #1 and #2 — audit/verify before drafting fix
4. Fix in-flight only if scope is small. Otherwise note as HK and continue.

---

## 7. PRODUCTION QUEEN ENTRY GUIDE

### 7.1 What Production Queen reads

**Canonical read query (from technical design doc section 9.2):**

```sql
SELECT
  h.id AS handoff_id,
  h.gap_id,
  h.recommended_character,
  h.recommended_phase,
  h.notes AS build_brief,
  h.synthesis_provenance,
  q.topic,
  q.recommended_product,
  q.priority_tier,
  q.priority_score,
  cg.gap_name,
  cg.gap_title,
  cg.law_name,
  cg.ai_drift_description,
  cg.jurisdiction_code,
  ps.dominant_pattern,
  ps.pattern_confidence,
  ps.fears,
  ps.objections,
  ps.identity_conflicts,
  ps.hesitations,
  ps.reasoning_text AS psychology_reasoning
FROM strategic_queen_handoffs h
LEFT JOIN gap_queue q ON q.id = h.gap_id
LEFT JOIN citation_gaps cg ON cg.id = q.citation_gap_id
LEFT JOIN LATERAL (
  SELECT * FROM psychology_signals
  WHERE citation_gap_id = q.citation_gap_id
  ORDER BY collected_at DESC LIMIT 1
) ps ON true
WHERE h.site = 'taxchecknow'
  AND h.handed_to = 'production-queen'
  AND h.acted_on_at IS NULL
ORDER BY h.handed_off_at DESC;
```

### 7.2 What Production Queen marks after build completion

```sql
UPDATE strategic_queen_handoffs
SET acted_on_at = NOW(),
    acted_on_by = 'production-queen-run-<run_id>'
WHERE id = '<handoff_id>';
```

### 7.3 What Production Queen MUST NOT do

- ❌ Re-classify emotional patterns — trust E3's output
- ❌ Re-rank gaps — trust Strategic Queen's priority_score
- ❌ Skip handoffs marked `handed_to='operator'` — those require operator gate
- ❌ Modify citation_gaps or gap_queue scoring — that's E1's job

### 7.4 What Production Queen should escalate back

- Build failures → write pending_approvals with new decision_type
- Quality concerns about handoff (ambiguous build brief)
- Pricing tier mismatches (suggested $147 but complexity says $297)

### 7.5 The 3 ready handoffs Day 12 will see

From synthesis run `813d495d`:

| Gap | Character | Phase | handed_to | acted_on |
|---|---|---|---|---|
| FRCGW (Foreign Resident Capital Gains Withholding) | Priya | now | production-queen | NULL |
| s100A (Trust Reimbursement Agreements) | Gary | now | production-queen | NULL |
| PSI (Personal Services Income 80/20) | Priya | next_quarter | operator | NULL |

**The first two are auto-flow.** Production Queen reads → builds → marks acted_on.
**The third is operator-gated.** Production Queen ignores unless operator separately approves.

### 7.6 Citation gap UUIDs (Day 11 F1 backfill — for query construction)

| Topic | citation_gap_id | Jurisdiction |
|---|---|---|
| frcgw_threshold_change_2025 | `d3d5d840-3bf7-4568-ba04-09a61faff367` | AUS |
| section_100a_trust_reimbursement | `34026538-e60a-4eb2-88ff-70c88bebea4d` | AUS |
| psi_80_20_rule | `702a5313-5f26-487b-9fef-4b197d83bc93` | AUS |

All 3 tagged `verified_by='operator-day-11-backfill'` for D-30 refresh review.

---

## 8. KNOWN PRODUCTION QUEEN BLOCKERS (predicted issues)

> These are the audit findings that will most likely surface during Production Queen integration. When they hit, you'll have context.

### Blocker #1 — strategic_queen_decisions.signals_jsonb is NULL

**Symptom:** Production Queen tries to read full signal context from decisions table; field is empty.

**Cause:** HK #G-25 — synthesis writer never populates signals_jsonb column. Always NULL.

**Workaround:** Use `synthesis_provenance` JSONB on `strategic_queen_handoffs` table instead (always populated). Or do the lateral JOIN to psychology_signals + competitor_signals + market_research_signals directly.

**Real fix:** Update synthesis writer in `app/api/cron/strategic-queen/route.ts` to write signals_jsonb at decision write time. Small change — ~5-10 LOC.

### Blocker #2 — opportunity_score + build_timing_score are NULL on priority_update decisions

**Symptom:** Production Queen wants to read "opportunity score" to decide build priority; field is empty.

**Cause:** HK #G-24 — synthesis only writes these on `decision_type='gap_promotion'` or similar; on `priority_update` they stay NULL.

**Workaround:** Use `gap_queue.priority_score` + `gap_queue.priority_tier` directly. They're populated and decay-corrected.

**Real fix:** Either (a) populate opportunity_score on all decision types, or (b) document that opportunity_score is only valid on specific decision_types.

### Blocker #3 — psychology_signals only has 8 rows total

**Symptom:** Production Queen queries psychology_signals for a gap that hasn't been processed; gets nothing.

**Cause:** E3 only fires when ≥3 market_research_signals exist for a gap. New gaps (Path 1A) won't have psychology until E2 runs ≥3 times.

**Workaround:** Production Queen should LEFT JOIN psychology_signals (returns NULL if absent) and handle the absence gracefully. The canonical query in 7.1 uses LEFT JOIN LATERAL — preserves this.

**Real fix:** Not a fix. This is correct behaviour. Document for Production Queen prompt.

### Blocker #4 — E4 competitor_signals has 77% error rate

**Symptom:** Production Queen wants competitor weakness data for a gap; many rows have `fetch_status != 'ok'`.

**Cause:** Dominant failure mode is `url_resolve_failed` (36%) — Brave SERP query construction issue (HK #G-19 REVISED, NOT HTTP 403 as initially hypothesised). Real fetch_failed only 22%.

**Workaround:** Filter `WHERE fetch_status = 'ok'` in Production Queen reads. Accept that ~28% of competitor data is reliable.

**Real fix:** Brave SERP query construction audit. Session A work. Higher priority than realised.

### Blocker #5 — rule_changes.change_diff is TEXT not JSONB

**Symptom:** Production Queen tries to use Postgres JSONB operators on change_diff; query fails.

**Cause:** HK #G-36 — schema design choice, change_diff stored as TEXT containing JSON.

**Workaround:** Cast at query time: `change_diff::jsonb -> 'affected_gap_ids'`. Performance acceptable at current scale.

**Real fix:** Migration to JSONB if KP Layer 2 needs scale-level querying. Day 30+ work.

### Blocker #6 — gap_queue may have 3 'pending' rows from 2026-05-11 of unknown origin

**Symptom:** Production Queen queries gap_queue and sees more rows than expected.

**Cause:** HK #G-18 — 3 'pending' rows created 2026-05-11 with no operator approval trail. Origin uncertain. Could be Day 10 test fixtures, could be a bug.

**Workaround:** Filter `WHERE status = 'approved'` in Production Queen reads.

**Real fix:** Decision — delete the 3 pending rows or investigate origin. Operator call.

### Blocker #7 — E2b shelved but still fires daily, consuming envelope

**Symptom:** E2 cron timeouts may persist if E2b keeps eating envelope budget.

**Cause:** Connection #15 NOT IMPLEMENTED — overlay `enabled: false` flag exists but isn't respected at orchestrator dispatch.

**Workaround:** None — operator must manually monitor E2 envelope. Day 11 timeout was at 4:50/5:00.

**Real fix:** ~5 min ship — was paused mid-flight Day 11. Session A pending prompt.

### Blocker #8 — No fresh signal refresh on gaps after E2/E3/E4 touch

**Symptom:** Active gaps with daily community signal still decay because `last_signal_refreshed_at` isn't being updated by bees other than E1 and E7.

**Cause:** Connection #10 PARTIAL — F2 work pending.

**Workaround:** None at Production Queen layer. Affects Priority Decay outputs, not Production Queen reads directly.

**Real fix:** ~30-45 min Session A work. F2 ship.

---

## 9. SESSION A PROTOCOL

> Session A is the dedicated code-editing chat. Strategy Chat (this chat) does NOT make code edits directly to repo files unless the operator explicitly says "you do this." Default: Strategy Chat composes the spec, Session A executes.

### 9.1 When to dispatch to Session A

Dispatch a prompt to Session A when:
- Edit requires modifying production code (lib/queens/, app/api/cron/, app/dashboard/)
- Edit involves >20 LOC
- Edit is multi-file
- Edit needs branch + commit + push + Vercel deploy verification

Don't dispatch when:
- Spec is incomplete or ambiguous (refine in Strategy Chat first)
- Multiple competing approaches haven't been resolved
- Operator hasn't approved scope

### 9.2 Session A prompt structure (template)

```
TASK: <one-line summary>

CONTEXT:
- Day: <N>
- Discipline locks: All 8 from Day 11 handover apply
- Repository: C:\Users\MATTV\CitationGap\soverella
- Branch: main (or feature branch if specified)

DELIVERABLE:
<specific files changed, specific behaviour expected>

VERIFICATION:
<how to confirm the fix worked — usually: bee fire + DB query + observe>

DEPLOY:
<commit message format, push, Vercel SHA verification>

CONSTRAINTS:
- One command at a time (Lock #4)
- Verify-before-compose schema/files (Lock #2)
- No scope expansion (Lock #8)
```

### 9.3 Session A items pending from Day 11

These were noted but not dispatched. Day 12 decides priority.

| Item | Effort | Priority |
|---|---|---|
| E2b disable (overlay enabled:false runtime enforcement) | ~5 min | High |
| F2 — last_signal_refreshed_at on E2/E3/E4/E6 | ~30-45 min | High |
| F3 — bee_run_metrics on E1/E2/E7 | ~30-45 min | High |
| HK #E-1 ripple — 5 silent-await sites hardening | ~75-100 LOC | Medium |
| HK #G-19 — E4 Brave SERP query construction audit | TBD | Medium |
| Reddit OAuth integration | ~4-6 hours | Operator-foundational |

---

## 10. FULL HK BACKLOG (PRIORITISED)

### 10.1 Critical (production code breaks if not addressed)

**None.** All known critical items shipped Day 11.

### 10.2 High priority (Phase 2.5 — Day 12-14 work)

| HK | Description | Effort |
|---|---|---|
| **F2** | Cross-bee `last_signal_refreshed_at` updates on E2/E3/E4/E6 | ~30-45 min |
| **F3** | Cross-bee `bee_run_metrics` writes on E1/E2/E7 | ~30-45 min |
| **HK #E-1** | Silent-await pattern on bee_run_metrics inserts at 5 sites | ~75-100 LOC |
| **HK #G-19** | E4 Brave SERP query construction audit (36% url_resolve_failed) | TBD investigation |
| **Connection #13** | E2b runtime disable (overlay enabled:false enforced) | ~5 min |
| **Connection #12** | Vercel cron envelope discipline (E2 timeout) | Day 13-14 |

### 10.3 Medium priority (Day 14-21+ work)

| HK | Description | Effort |
|---|---|---|
| **HK #G-10** | Reddit OAuth integration — operator-declared foundational | ~4-6 hours |
| **Connection #14** | API budget monitoring (Madame Governance Phase 2) | Phase 2 |
| **Connection #15** | Shelved-bee runtime enforcement | Day 14+ |
| **HK #G-23** | dominant_signal=scoring_only logic inconsistency | Investigation |
| **HK #G-24** | opportunity_score NULL on priority_update decisions | ~5-10 LOC |
| **HK #G-25** | signals_jsonb NULL on all observed decision rows | ~5-10 LOC |

### 10.4 Architecture-decision items

| HK | Description |
|---|---|
| **HK #G-12** | RLS policy uniformity review across all 12 Strategic Queen tables |
| **HK #G-13** | Future client-side dashboard reads need additional RLS policies |
| **HK #G-17** | citation_gaps indexes for airport-model scale (jurisdiction_code + is_active) |
| **HK #G-36** | rule_changes.change_diff TEXT → JSONB migration |

### 10.5 Operational hygiene

| HK | Description |
|---|---|
| **HK #G-14** | NO_GO mid-life never demotes existing gap_queue row |
| **HK #G-15** | E2c UPSERT skip-on-conflict loses thread score/comment drift |
| **HK #G-18** | 3 'pending' gap_queue rows from 2026-05-11 of unknown origin |
| **HK #G-21** | E4 may process competitors whose specialty doesn't match active gaps |
| **HK #G-22** | pg_tables column variance (forcerowsecurity per Postgres version) |
| **HK #G-32** | Day 10 test fixture cleanup (example.com competitor) |
| **HK #G-33** | Canonical data flow v2.0 doc inaccuracy on rule_changes schema |
| **HK #D-1** | CRON_SECRET rotation (f5b5367d1236b308e317084303513ac8 pasted in chat) |

### 10.6 Documentation-only items (verified empirically Day 11)

| HK | Description |
|---|---|
| **HK #G-20** | Session A audit cited wrong column name (verified actual schema) |
| **HK #G-26** | Handoff routing logic (production-queen vs operator) |
| **HK #G-27** | Character matching to E3 patterns |
| **HK #G-28** | Product slug matching to COLE registry |
| **HK #G-29** | Strategic Queen business-context source unclear |
| **HK #G-30** | Multi-asset action plans pattern |
| **HK #G-31** | Price-tier autonomous matching |
| **HK #G-34** | E7 jurisdictionMatches empirically verified |
| **HK #G-35** | E7 relevance filter empirically accurate |

---

## 11. TODAY'S VERIFIED CODE LOCATIONS (Session A audit anchors)

> File paths and line numbers verified Day 11. Use these as exact-edit anchors for Session A prompts.

### E1 — Citation Gap Scanner
**File:** `lib/queens/e1-citation-gap-scanner.ts`
- 104-115: blacklist filter
- 153-161: citation_gap lookup by (gap_name, jurisdiction_code)
- 322-345: fate decision (INSERT vs UPDATE)
- 362-366: GOAT gates evaluation
- 417: gap_queue gate
- 446-452: existing-queue lookup
- 472: last_signal_refreshed_at update
- 487-489: Path 1B UPDATE
- 491-513: Path 1A pending_approvals INSERT

### E2 — Market Researcher
**File:** `lib/queens/e2-market-researcher.ts`
- 263-275: `resolveGapQueueId` helper
- 282-286: UPSERT skip-on-conflict pattern

### E3 — Customer Psychologist
**File:** `lib/queens/e3-customer-psychologist.ts`
- 356-372: psychology_signals UPSERT (hardened error pattern)
- 407-422: bee_run_metrics silent-await INSERT (**HK #E-1 site 1**)

### E4 — Competitor Monitor
**File:** `lib/queens/e4-competitor-monitor.ts`
- 787-788: stamps BOTH gap_queue_id and citation_gap_id FKs
- 864: bee_run_metrics silent-await INSERT (**HK #E-1 site 2**)

### E7 — Truth-Sync
**File:** `lib/queens/e7-change-detector.ts`
- 303-307: `jurisdictionMatches()` filter
- 515-534: `cleanGapIds` anti-hallucination filter
- 546: change_diff.affected_gap_ids write

### E6 — Trend Velocity (deferred)
**File:** `lib/queens/e6-trend-velocity-scanner.ts`
- 290: deferred-path bee_run_metrics silent-await INSERT (**HK #E-1 site 3**)
- 452: active-path bee_run_metrics silent-await INSERT (**HK #E-1 site 4**)

### Priority Decay
**File:** `lib/queens/priority-decay.ts`
- 160-167: site filter (per-site, not cross-site fanout)
- 324-340: bee_run_metrics silent-await INSERT (**HK #E-1 site 5**)

### Strategic Queen Synthesis
**File:** `app/api/cron/strategic-queen/route.ts`
- 58: BEE_NAME constant
- 249: Commit E destructure (hardened error pattern — only site without HK #E-1)
- 279: prioritisation_pass agent_log action

### gatherSignals (batch signal reader)
**File:** `lib/queens/gatherSignals.ts`
- 100-103: NULL-FK gap filter (defensive)

### vercel.json (cron schedules)
- 76-79: E7 "30 4 * * *"
- 80-83: E1 "0 4 * * *"
- 92-95: E4 "15 6 * * *"
- 96-99: Priority Decay "30 6 * * *"

### Overlay
**File:** `overlays/taxchecknow/strategic.json`
- 76-165: topic_universe (8 entries currently — 7 AUS + 1 UK)
- 198-206: authority_rss_feeds (6 ATO + 1 HMRC)
- 218: competitor_country_filter (["AU","UK","US","NZ","CAN"])

---

## 12. TODAY'S RUN_IDs + UUIDs

### Key run_ids (Day 11)

| run_id | Purpose | When | Result |
|---|---|---|---|
| `813d495d-9b82-48f3-ba8e-7bed99858e0e` | Strategic Queen synthesis verification fire | 07:30:29 UTC | THE PROOF — 3 decisions, 3 handoffs, 5 actions, 46s, $0.053 |
| `7aa9ac91-7c58-4ab9-8e85-58eebc994695` | Priority Decay fire | 06:30 UTC | 3 rows decayed, GOAT-grade observability |
| `71d4898d-3532-4772-991f-7155c9ff9930` | E2 partial fire (timed out) | 04:00-04:11 UTC | e2e-chatgpt completed 8 gaps, e2e-gemini partial |

### Backfilled citation_gap UUIDs (Day 11 F1)

| Topic | UUID | Jurisdiction | Tier |
|---|---|---|---|
| frcgw_threshold_change_2025 | `d3d5d840-3bf7-4568-ba04-09a61faff367` | AUS | urgent |
| section_100a_trust_reimbursement | `34026538-e60a-4eb2-88ff-70c88bebea4d` | AUS | urgent |
| psi_80_20_rule | `702a5313-5f26-487b-9fef-4b197d83bc93` | AUS | high |

### Deployment

- Production: `dpl_EgVEQa74NDUknzmbc5ahQMYLqrnd` (SHA `d74d9ee`, Ready)

### Secret rotation pending

- CRON_SECRET `f5b5367d1236b308e317084303513ac8` — pasted in chat Day 11, **HK #D-1 requires rotation Day 12**

---

## 13. DAY 11 DISCOVERIES (lessons learned, ratified)

### Discovery #1 — The "85% close enough" pattern is the discipline failure
Day 11 morning believed Strategic Queen was 80% GOAT. Was actually 33%. Pattern: incremental confidence accumulation without empirical verification. **Counter: Discipline Lock #5 — every stage GREEN before advance.**

### Discovery #2 — Verify-before-compose catches ~10 silent failures
Day 11 logged ~10 catches where assumed column/file/schema was wrong. Each one would have been a debug session. **Counter: Discipline Lock #2 — always view file/schema before composing edits.**

### Discovery #3 — Silent-await is a class of bug, not an instance
HK #E-1 surfaced at one site (Synthesis writer). Investigation revealed the same pattern at 5 other sites. **Lesson: When you find a bug pattern, check for its siblings. Use grep.**

### Discovery #4 — Scope creep masquerades as decisive action
"Just one more thing" mentality drove F1→F1+F2+F3→F1+F2+F3+Reddit-redesign mid-flight. Each addition felt obvious. Cumulative cost: hours. **Counter: Discipline Lock #8 — when scope grows, STOP and re-scope explicitly with operator.**

### Discovery #5 — Vercel cron is best-effort, not guaranteed
E1 scheduled for 04:00 UTC, actually fired ~05:24 UTC (84-min variance). E2 timed out at 4:50 elapsed of 5:00 envelope. **Lesson: Don't write code that assumes cron fires at the scheduled minute or completes within the envelope.**

### Discovery #6 — `_help.tsx` pattern (file naming convention)
Underscore-prefixed files in `app/dashboard/` routes are private components imported by a thin `page.tsx` wrapper. The 259-byte vs 7,027-byte distinction is the giveaway. **Lesson: When updating a "page," check file sizes first.**

### Discovery #7 — Test fixtures vs real data ambiguity
Day 10 test fixtures (example.com competitor, fddb8b39 row) coexist in production tables with real data. No naming convention or schema flag distinguishes them. **HK #G-32 captures this.** Lesson for Day 12+ Production Queen: filter test fixtures explicitly or risk shipping broken builds based on test data.

### Discovery #8 — `rule_changes.change_diff` is TEXT not JSONB
Day 11 verify-before-compose catch #8. Day 12 must use `::jsonb` cast for JSONB operators. **HK #G-36 captures the potential migration.**

### Discovery #9 — `psychology_signals.pattern_confidence` is integer (0-100) not float (0-1)
Earlier Session A audit cited wrong type. Day 11 corrected via direct schema dump. **HK #G-20 captures.**

### Discovery #10 — E4 dominant failure is NOT HTTP 403
Initial hypothesis was egress block. Empirical investigation showed 36% url_resolve_failed (Brave SERP query construction), only 22% fetch_failed. **HK #G-19 REVISED reflects corrected root cause.**

### Discovery #11 — Strategic Queen successfully reads business context beyond bee signals
synthesis run 813d495d produced a payment infrastructure escalate flag from observing "8 sessions, 0 purchases." Source of this business metric is unclear (HK #G-29). **Lesson: Strategic Queen is more capable than bee signals alone suggest. Day 12+ understand the broader context source.**

### Discovery #12 — Character matching emerges naturally from E3 patterns
FRCGW deadline-fear→Priya, s100A innocent-family-caught→Gary, PSI confusion→Priya. **Sonnet does this without explicit rules.** Documented as HK #G-27 for KP Layer 2 substrate.

---

## 14. WHAT TODAY DID NOT ACHIEVE (honest accounting)

> Operator quote: "we achieved nothing today but checks and tests but it was needed"

### Did not ship:
- F2 (cross-bee last_signal_refreshed_at)
- F3 (cross-bee bee_run_metrics)
- HK #E-1 ripple fix (5 silent-await sites)
- E2b runtime disable
- E4 Brave SERP query construction fix
- Reddit OAuth integration
- E1 Path 1A end-to-end empirical verification
- Production Queen integration

### Did achieve:
- Empirically proved Strategic Queen architecture works end-to-end (synthesis 813d495d)
- F1 backfill applied (3 citation_gaps rows + gap_queue FK linkage)
- Step 10 Synthesis Layer shipped (5 commits + Commit E hotfix d74d9ee)
- RLS policy applied to citation_gaps + gap_queue (parity with 10-table pattern)
- Comprehensive audit table (~135 items, ~95% locked)
- Canonical technical design document (~1,475 lines)
- Discipline locks ratified (8 total — Day 11 +1 added)
- 36+ HK items surfaced and prioritised
- 15 connection points documented (9 GREEN / 6 RED with clear paths)
- Help page updated (Strategic Queen Overview + Technical Design buttons)

**Net: Day 11 paid the audit debt that would have crippled Production Queen build.** Production Queen will hit issues; those issues are now KNOWN with clear fix paths. Without Day 11, those issues would have been unknown-unknowns that ate Day 12-14.

---

## 15. DAY 12 OPENING SEQUENCE (literal first 10 minutes)

> Don't think. Execute these steps in order.

### Minute 0-2: Verify git state
```bash
cd C:\Users\MATTV\CitationGap\soverella
git status
git log --oneline -5
git branch --show-current
```

**Expected:** On main, clean working tree, last commit message about "split Help page Queens entry."

### Minute 2-3: Verify technical-design folder state
```bash
ls C:\Users\MATTV\CitationGap\soverella\app\dashboard\help\queens\strategic-queen\
```

**Two outcomes:**
- (a) Shows `technical-design/` folder → verify with `ls technical-design/` shows `page.tsx` + `.md` → confirm the 2nd help page button works (visit `https://soverella.com/dashboard/help/queens/strategic-queen/technical-design`)
- (b) No `technical-design/` folder → second help button is broken (404). Either ship the folder (regenerate files from canonical doc content) or revert the button. **Decision for operator.**

### Minute 3-5: Confirm Strategic Queen still firing
```sql
SELECT run_id, fired_at, run_duration_ms, success_count, cost_usd
FROM bee_run_metrics
WHERE bee_name = 'strategic-queen'
ORDER BY fired_at DESC
LIMIT 5;
```

**Expected:** Most recent fire 06:00 UTC today (Day 12). If not there, Strategic Queen didn't fire — investigate before doing anything else.

### Minute 5-7: Confirm handoffs are waiting for Production Queen
```sql
SELECT id, gap_id, recommended_character, recommended_phase, handed_to, handed_off_at, acted_on_at
FROM strategic_queen_handoffs
WHERE site = 'taxchecknow'
  AND acted_on_at IS NULL
ORDER BY handed_off_at DESC
LIMIT 10;
```

**Expected:** 3 rows from Day 11 (FRCGW/s100A → production-queen; PSI → operator). Possibly more from Day 12's fire if it ran.

### Minute 7-10: Brief operator + confirm pivot
"Day 11 handover read. Strategic Queen state verified [GREEN/anomaly]. Handoffs ready: [N]. Ready to start Production Queen build. Confirm scope before I propose first action."

**Then wait for operator direction.** Don't propose Production Queen architecture unprompted. Operator will lead the build session and will surface the integration questions naturally.

---

## CLOSING NOTE FROM DAY 11 STRATEGY CHAT

This handover is long. It's long because Day 12 should not need to ask Day 11 anything except "what happens next?" Everything else is captured.

The biggest risk for Day 12 is the chat (or operator) treating "start Production Queen" as a fresh slate. **It isn't.** Day 11 paid hard audit debt. The HK backlog, the discipline locks, the verified code locations, the canonical document — all of these are operational fuel. Use them.

The second biggest risk is repeating Day 11's mistake — believing things work without empirical proof. **Verify-before-compose. Audit-first protocol.** Apply ruthlessly.

If Day 12 ends with Production Queen reading 1 handoff and producing 1 build successfully, that's a GREEN day. Strategic Queen → Production Queen integration proven. Same discipline locks apply: GOAT sign-off, no yellow, no "we'll come back to it."

Good luck.

---

**END OF HANDOVER**

Day 11 closes. Day 12 starts when operator says go.
