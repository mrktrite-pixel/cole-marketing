# Decisions Queued — Day 13 Pickup

**Day 12 closed: 2026-05-15**
**All decisions in this document are operator decisions. No Claude session can resolve them autonomously.**

Each decision below has: context, options, recommendation, what executing it requires.

---

## Decision A — Next Mode of Work

**Context:** Day 12 produced a complete diagnostic list. Walk is at Phases A-F complete + Phase G inventory captured. Three work paths exist; can be done in any order.

**Options:**

### A1 — Documentation-first
Continue walk: Phase G → H → I → J. Then apply Tier 1 fixes. Then operational batch.
- Time: ~3.5-4.5 hours walk + ~3-4 hours fixes + ~30 min ops = ~7-8 hours
- Pro: Complete diagnostic discipline before production changes
- Con: Customer-facing improvements deferred longest

### A2 — Fix-first
Operational batch → Tier 1 fixes → walk remaining phases.
- Time: ~30 min ops + ~3-4 hours fixes + ~3.5-4.5 hours walk = ~7-8 hours
- Pro: Production improvements ship first; walk completes after with empirical fix feedback
- Con: Walk's diagnostic momentum partially lost; Phase G insights deferred

### A3 — Pragmatic interleave
Operational batch → Phase G walks → Tier 1 fixes → Phase H/I/J.
- Time: ~30 min + ~30-45 min + ~3-4 hours + ~2.5-3 hours = ~6.5-7.5 hours
- Pro: Each phase completes before context-switch; momentum preserved through G
- Con: Tier 1 fixes interrupt walk discipline slightly

**Recommendation: A2 (fix-first).** Three reasons:
1. Walk findings are already locked to disk. Production improvements compound.
2. Fixes test the diagnostic accuracy — if a fix doesn't behave as predicted, the walk's interpretation was incomplete.
3. Tier 1 fixes unblock multiple stuck pipelines (carousel rendering, flagship gap freshness, learning engine, competitor monitoring). Customer-visible impact > diagnostic completeness.

**Executing A2 requires:**
- Operator runs Action 1 (Vercel rotation) — 5 min, your hands
- New Claude session drives Session A for Actions 2-4 + Tier 1 fixes — ~4 hours
- Walk resumes after fix verification

---

## Decision B — Operational Batch Sequencing

**Context:** 4 actions queued in END-OF-DAY-12-OPERATIONAL-BATCH.md. Total ~30 min.

### B1 — CRON_SECRET rotation
**Operator action.** 5 min on Vercel dashboard.
- Why: HK #D-1, leaked Day-11 value still active 4+ days
- Steps:
  1. Generate new 64-char hex via `openssl rand -hex 32`
  2. Vercel dashboard → soverella project → Settings → Environment Variables
  3. Edit CRON_SECRET, paste new value, apply to all environments
  4. Trigger redeploy on most recent deployment
  5. Verify: curl with old secret returns 401; new secret returns 200
- Risk: If new secret typo'd, all crons fail until corrected. Verify with curl before walking away.

### B2 — Remove 3 premature cron entries
**Session A action.** ~5 LOC removal in vercel.json + commit + deploy.
- Why: HK #E-DISPATCH-1 reframed — g5/j2/j3 are product-scoped V1 LIGHT workers; parameterless cron entries are leftover from pre-V1-scoping
- Entries to remove from vercel.json:
  - `0 20 * * *` g5-story-writer
  - `0 21 * * *` j2-li-strategy
  - `15 22 * * *` j3-li-adapter
- Verification: tomorrow's 20:00/21:00/22:15 UTC have no missing_input fires in agent_log
- Rollback: restore entries if Phase 2 dispatcher gets deferred indefinitely

### B3 — Rename 4 Pub Test pages
**Session A action.** 3 simple renames + 1 rewrite.
- Why: HK #OPS-2, all 4 confirmed not URL-routable
- Files:
  - `app/dashboard/help/queens/production-queen/production-queen-page.tsx` → rename to `page.tsx`
  - `app/dashboard/help/queens/distribution-queen/distribution-queen-page.tsx` → rename to `page.tsx`
  - `app/dashboard/help/queens/adaptive-queen/adaptive-queen-page.tsx` → rename to `page.tsx`
  - `app/dashboard/help/queens/governance-queen/adaptive-queen-page (1).tsx` → DELETE + create new `page.tsx` with governance content (Windows copy-paste artifact)
- Also: move stray `production-queen-page.tsx` at repo root to its proper location (it was drafted in Day 12 chat but never placed)
- Verification: all 4 pages reachable at their URLs in dashboard

### B4 — scheduled-publisher x/reddit/email decision

**Operator decision required.**

#### Option B4-A: Reconnect accounts via Zernio/Blotato
- Time: ~30 min per platform (X, Reddit, Email = ~90 min total)
- Pro: Distribution amplification across 3 more platforms
- Con: 47-product catalog doesn't depend on these today; operator time spent on Phase 2 setup vs Phase 1 fixes
- Action: Operator sets up accounts in Zernio + Blotato dashboards; SQL inserts into `platform_accounts` table

#### Option B4-B: Purge 3 stuck calendar rows (RECOMMENDED)
- Time: 1 min SQL execution
- Pro: Stops 2930 wasted skip-cycles in 15 days; immediate noise reduction
- Con: 3 calendar rows lost (already non-functional, so no real loss)
- Action: Session A runs SQL DELETE on the 3 stuck campaign_calendar rows
- Verification: zero `no_active_account_for_platform` skips in following 24h of scheduled-publisher fires
- Note: HK #SP-1 (terminal state for permanent failures) should ship eventually regardless

**Recommendation: B4-B.** Faster, cleaner, addresses noise without committing operator time to Phase 2 platform setup that may shift.

---

## Decision C — Tier 1 Fix Execution

**Context:** 8 fixes specified in FIX-LIST-TIER1.md, ~40 LOC total. Ship in order; each verifies before next.

### Fix 1 + 2 PAIRED — HK #J36-1 + HK #J36-2 (j3.6 slide rendering)
- Files: `lib/bees/j3-li-adapter.ts` + `vercel.json` (functions config for j3.6 route)
- LOC: ~20 (slide_number change + shared CarouselSlide interface) + 5 (memory config)
- Why ship paired: HK #J36-2 activates the moment HK #J36-1 fixes the contract and carousels actually render
- Test: Manual j3 fire produces video_queue row with `slide_number` key; manual j3.6 fire renders the carousel successfully
- Rollback: revert commit
- Downstream: j3.6 starts producing carousels (currently 0 output)

### Fix 3 — HK #D-E1-2 (E1 topic format)
- File: E1 Citation Gap Scanner (path in FIX-LIST-TIER1.md)
- LOC: ~3
- Change: lookup uses `topic_id` UUID format, not natural-language `topic` string
- Test: Re-fire E1 → 3 flagship gaps (FRCGW, s100A, PSI) get `last_signal_refreshed_at` updated
- Rollback: revert commit
- Downstream: Strategic Queen Synthesis re-ranks against fresh data; Priority Decay starts seeing non-frozen flagship inputs

### Fix 4 — HK #E4-1 (E4 jurisdiction)
- File: E4 Competitor Monitor
- LOC: ~3
- Change: pair-generation includes jurisdiction filter
- Test: Re-fire E4 → pipeline error rate drops below 72%, organic threats start surfacing
- Rollback: revert commit
- Downstream: E4 contributes meaningful competitor signal to SQ Synthesis

### Fix 5 — HK #K14-1 (K14 platform-aware sources)
- File: `lib/bees/k14-confidence-evaluator.ts`
- LOC: ~3-5
- Change: CRITICAL_SOURCES becomes platform-aware (LinkedIn→zernio_post_id, TikTok→blotato_post_id, etc.)
- Test: Re-fire K14 on 3 existing rows → confidence scores reflect actual provider presence, not capped at 0.7
- Rollback: revert commit
- Downstream: When real engagement data flows, learning engine can cross 0.98 GOAT gate

### Fix 6 — HK #K12-1 + HK #K12-2 STACKED — K12 grading filter + idempotency window
- File: `lib/bees/k12-pattern-learner.ts`
- LOC: ~5-8 total (~3 for K12-1, ~2-4 for K12-2)
- Why ship stacked: K12-1 fix exposes K12-2 (fortnightly idempotency bug activates the moment K12 starts succeeding)
- Change K12-1: filter on `k14_evaluated_at >= now-7d` instead of `published_at >= now-7d`
- Change K12-2: idempotency window shrinks from 7d to 6d (or 5d) so consecutive Sunday cron fires don't skip
- Test: Re-fire K12 with stacked fix → eligible rows return non-zero, lessons_learned starts populating
- Rollback: revert commit
- Downstream: Learning engine produces lessons (when sufficient sample size)

### Fix 7 — HK #SQ-1 (SQ handoff notes caveat)
- File: `lib/queens/strategic-queen-prompt.ts`
- LOC: ~10-15 (prompt instruction additions)
- Change: When `dominant_signal=scoring_only` OR `e7_recent_change_count_30d=0`, handoff `notes` field must include degradation caveat
- Test: Re-fire SQ Synthesis with ATO WAF still blocking → handoff notes for FRCGW say "build immediately, authority signal unavailable — claim from seed data" instead of "build immediately"
- Rollback: revert commit
- Downstream: Operator-facing accuracy restored; F1 Product Architect (Phase 2) inherits honest signal

### Fix 8 — HK #DQ-1 (distribution-queen Zernio read)
- File: `lib/queens/distribution-queen-prompt.ts` line ~231
- LOC: ~4
- Change: `gatherSignals` SELECT includes `zernio_account_id` alongside `blotato_account_id`
- Test: Re-fire distribution-queen → today's LinkedIn diagnosis correctly identifies Zernio-connected, not "no-blotato"
- Rollback: revert commit
- Downstream: distribution-queen handoffs stop misdiagnosing LinkedIn

---

## Decision D — Push cb83c59 to Remote

**Context:** Local commit only. Walk artifacts persist locally but not on origin.

### D1 — Push now
- Pro: Walk findings backed up on remote
- Con: Walk-in-progress state visible to anyone with repo access

### D2 — Push after Tier 1 fixes
- Pro: One coherent commit family (walk artifacts + first fixes)
- Con: Walk findings unbacked-up for ~half-day longer

### D3 — Never push (delete local commit, rely on local files)
- Pro: Walk artifacts stay private
- Con: Loss of single source of truth; if local disk fails, walk findings gone

**Recommendation: D2.** Push after the first 1-2 Tier 1 fixes land so the remote captures "walk + initial production response" as a coherent state.

---

## Decision E — Phase G Walk Scope Confirmation

**Context:** Phase G inventory captured Madame Governance bees: K20 (queue monitor), K21 (cost reporter), V1 (policy validator), governance-queen orchestrator. 4 walk units.

### E1 — Walk all 4 as planned
- Time: ~30-45 min
- Pro: Complete diagnostic coverage of Madame Governance
- Con: None significant

### E2 — Defer V1 walk (specifically)
- Reasoning: V1 has produced 0 policy_blocks in 6 fires; resolving "healthy vs not-detecting" might require domain expertise
- Pro: Walk completes faster
- Con: V1 sign-off remains incomplete

### E3 — Skip Phase G entirely, jump to Phase H
- Pro: Faster to colony sign-off page
- Con: Madame Governance unsigned-off; inventory captured but no per-bee verdicts

**Recommendation: E1.** Phase G is small. Walking all 4 takes ~30-45 min. Madame Governance fully diagnosed makes the colony sign-off page more authoritative.

---

## Decision F — Phase H Scope

**Context:** COLE Orchestrator is the top-level cluster-strategy queen. Strategy Chat is genuinely uncertain about scope.

### F1 — Inventory probe first (like Phase G), then walk
- Time: ~10 min probe + ~30-45 min walks
- Pro: Verified scope before committing to walks
- Con: Adds 10 min

### F2 — Walk directly without probe
- Pro: Faster
- Con: Risk of mis-scoping like Strategy Chat did with K20/K21/V1 in Phase F

**Recommendation: F1.** Inventory probes have caught 3 Strategy Chat memory errors already. Worth the 10 min insurance.

---

## Decision G — Phase I Cycle Test Approach

**Context:** End-to-end colony cycle test. Definition uncertain.

### G1 — Live cycle observation
- Approach: Wait for natural cron cycle (Strategic Queen 06:00 → Distribution Queen 07:00 → K-station bees → Adaptive Queen 09:00 → governance-queen 10:00). Observe what flows through.
- Time: ~1 hour observation
- Pro: Most realistic test
- Con: Depends on actual fires; if a queen errors, must wait next cycle

### G2 — Manual cycle trigger
- Approach: Fire each queen manually in sequence with controlled inputs. Verify each downstream consumer sees expected output.
- Time: ~60-90 min
- Pro: Controlled, can test specific scenarios
- Con: Doesn't test natural cron timing dependencies

### G3 — Hybrid (observe natural cycle + supplement with manual triggers for any failures)
- Time: ~60-120 min
- Pro: Best coverage
- Con: Longest

**Recommendation: G3.** Most rigorous. Surfaces emergent issues most reliably.

---

## Decision H — Phase J Colony Sign-Off Page Structure

**Context:** The deliverable that makes the walk's value durable.

### Required sections (locked):
1. Tax Hive birth certificate (state of the colony at end of walk)
2. Vanilla Hive extraction template (what's replicable to new hives)
3. Cross-cutting findings (Day 11 drift, Strategy Chat drift, Bible drift)
4. Positive architectural patterns (5-property watcher, deduction-only confidence, etc.)
5. Phase 2 scope disentanglement (4 distinct buckets)
6. Fix priority order (Tiers 1-5)

### Optional sections (decide):
- **H1: Dashboard updates** — what should the Soverella dashboard show post-walk?
- **H2: Operator runbook** — daily/weekly/monthly checks for ongoing colony health
- **H3: Migration guide** — if/when Vanilla Hive (Visa Hive Australia, etc.) extracts from Tax Hive template

**Recommendation:** Include H2 (operator runbook). Skip H1 and H3 for Day 13; can ship as separate documents later.

---

## Summary — Day 13 Decision Tree

```
Start of Day 13:
├─ Decision A: Mode of work
│  └─ Recommend: A2 (fix-first)
│
├─ Decision B: Operational batch
│  ├─ B1: Operator action (CRON_SECRET) — DO FIRST
│  ├─ B2: Session A (cron cleanup)
│  ├─ B3: Session A (Pub Test renames)
│  └─ B4: Decide between B4-A (reconnect) vs B4-B (purge)
│     └─ Recommend: B4-B
│
├─ Decision C: Tier 1 fix sequence
│  └─ Ship 8 fixes in FIX-LIST-TIER1.md order
│
├─ Decision D: Push to remote
│  └─ Recommend: D2 (after first 1-2 fixes)
│
├─ Decision E: Phase G scope
│  └─ Recommend: E1 (walk all 4)
│
├─ Decision F: Phase H approach
│  └─ Recommend: F1 (inventory probe first)
│
├─ Decision G: Phase I cycle test
│  └─ Recommend: G3 (hybrid observation + manual)
│
└─ Decision H: Phase J sign-off page structure
   └─ Recommend: include H2 (operator runbook)
```

---

**End of DECISIONS-QUEUED.md**
