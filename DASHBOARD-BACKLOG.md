# DASHBOARD BACKLOG — Per Queen, Per Bee UI Wiring State

Single canonical file. Lives at `cole-marketing/DASHBOARD-BACKLOG.md`. Tracks UI work per queen, per decision type, per drill-down surface.

Day 10 architecture (per DISCOVERIES.md "Dashboard Architecture: Decisions, Not Data"): operator surfaces are DECISIONS (approvals page), STATUS (monitor pages, minimal), REPORTS (Day N+ tab).

**Last updated:** 2026-05-13 (Day 10 close after E4 ship)

---

## Daily Operator Surface — /dashboard/approvals

**Status:** ✅ FUNCTIONAL Day 10 close (2 decision types active)

### Section ordering (upstream → downstream flow)
1. **Strategic Decisions** — gap promotion (E1)
2. **Competitor Threats** — competitive response (E4)
3. **Content Waiting For Review** — existing content_jobs
4. **Scientist Reports** — existing video_queue

### Empty state
"Nothing to approve right now. Bees are running. You'll be notified when something needs a decision."

### Decision types — current state

**Active V1:**
- ✅ `promote_gap_to_active` (E1 writes; Approve = gap_queue insert; Reject = status flip)
- ✅ `flag_competitor_threat` (E4 writes; Approve = strategic_queen_handoffs insert with handed_to='production-queen'; Reject = status flip + 7-day cooldown auto-applied via E4's rejected-row query)

**Reserved schema, no V1 writes:**
- ⏳ `mark_gap_no_go` (E1 NO_GO branch; UI ships Day 12+ when operator surface needed)
- ⏳ `authority_change_cascade` (E7 migrates from rule_changes Day 14+)
- ⏳ `track_new_competitor` (E4 discovery sub-bee Day 14+ when SERP-based competitor detection ships)

**Planned future:**
- Production Queen Phase 2+: `new_product_build_proposal`
- Distribution Queen Phase 2+: `content_publish_proposal`
- Madame Governance Phase 1+: `bee_prompt_change`, `cost_threshold_exceeded`
- COLE Orchestrator Phase 1+: `cab_phase_upgrade_recommendation`

---

## Queen Monitor Pages — /dashboard/monitor/{queen}

### Strategic Queen — /dashboard/monitor/strategic-queen

**Status:** ✅ SIMPLIFIED Day 10 close (Commit 5d0aefe)

**Surface elements (operator-facing):**
- Binary status banner: alive (green) / needs help (rose with reasons) / has not fired yet (gray)
- 4 status fields: Last fired, Runs (24h), Cost (24h), Next fire
- Escalations panel (placeholder until E4 + E7 Phase 2 populate)
- Authority Changes Pending Review (transitional, Day 14+ migration to /approvals)
- Signal Sources (compact transparency strip showing what each bee writes)
- Strategic Memory (operator manual notes)
- Footer link to /approvals (affordance)
- Action buttons placeholder: Run now / Pause / Settings (DISABLED V1)

**Wired bees writing to monitor inputs:**
- ✅ E1 Citation Gap Scanner (writes pending_approvals → Strategic Decisions section)
- ✅ E2 Market Researcher (writes market_research_signals; 29 rows at Day 10)
- ✅ E3 Customer Psychologist (writes psychology_signals + bee_run_metrics)
- ✅ E4 Competitor Monitor (writes competitor_signals + pending_approvals → Competitor Threats section + bee_run_metrics)
- ✅ E7 Truth-Sync (writes rule_changes — surfaces in transitional panel; Day 14+ migration to /approvals)

**Pending bees Phase 2 close:**
- ⏳ E6 Trend Velocity Scanner (Step 7 next)
- 🚫 E5 Retrieval Intelligence (Day 30+, deferred)

**Phase 2 Steps Status:**
- Steps 0-3.5: ✅ Closed
- Step 4 (E2): ✅ Closed Day 10
- Step 5 (E3): ✅ Closed Day 10
- Steps 5.5-5.8 (E1 dashboard retrofit): ✅ Closed Day 10
- Step 6 (E4): ✅ Closed Day 10
- Step 7 (E6): ⏳ Pending
- Step 8 (E5): 🚫 Deferred Day 30+
- Step 9 (Priority Decay cron): ⏳ Pending
- Step 10 (Synthesis Layer): ⏳ Pending
- Steps 11+12 (Validation): ⏳ Pending

### Production Queen — /dashboard/monitor/production-queen

**Status:** NOT YET BUILT (Day 14+ work when Production Queen Phase 2 starts)
**Pattern:** same as Strategic Queen (binary status + minimal panels + footer link to /approvals)

### Distribution Queen — /dashboard/monitor/distribution-queen

**Status:** NOT YET BUILT (Day 21+ work)
**Pattern:** same as Strategic Queen

### Adaptive Queen — /dashboard/monitor/adaptive-queen

**Status:** NOT YET BUILT (Day 30+ work)

### Madame Governance — /dashboard/monitor/madame-governance

**Status:** NOT YET BUILT

### COLE Orchestrator — /dashboard/monitor/cole-orchestrator

**Status:** NOT YET BUILT (Day 30+ work, cross-hive view)

---

## Reports Tab — /dashboard/reports

**Status:** NOT YET BUILT — Day 30+ infrastructure dependency

Requires Knowledge Propagation Layers 2-3 (`queen_monthly_lessons` + `hive_monthly_reports` tables, monthly cron). Built Day 14-21 as Strategic Queen Phase 3.

**Serves:**
- Mode A (owner-operated) — operator monthly accountability
- Mode B (client-managed service) — branded client-facing reports per COLE as Managed Service Discovery Log entry

---

## Detail / Drill-Down Pages

### Gap detail — /dashboard/monitor/strategic-queen/gap/[id]

**Status:** ✅ Built Day 10 (Commit 48807dc) — accepted as drill-down layer
- GapDetailHeader, EngineDisagreement, GapCostTrend components
- Reachable from approvals page (when citation_gap_id present) or direct URL

### Per-bee detail pages

**Status:** NOT YET BUILT
- 6 component files retained on disk for drill-down restoration if pattern emerges Day 11+
- Per Q-E1 lock on E4: per-bee detail pages are the right home for granular bee diagnostics (Day 14+)

---

## Knowledge Propagation Layer Surfaces (per DISCOVERIES.md)

### Layer 1 — bee_run_metrics
**Audience:** Queens (machine reads)
**UI surface:** None — internal only
**Current contributing bees:**
- ✅ E1 (writes per fire)
- ⏳ E2 (retroactive add needed — housekeeping #70)
- ✅ E3 (writes per fire from day 1)
- ✅ E4 (writes per fire from day 1)
- ⏳ E7 (not yet wired — housekeeping captures)

### Layer 2 — queen_monthly_lessons
**Audience:** Queens themselves (self-correction)
**UI surface:** None — internal only
**Status:** NOT YET BUILT — Day 14-21 work

### Layer 3 — hive_monthly_reports
**Audience:** Operator + clients
**UI surface:** `/dashboard/reports` tab (Day 30+)
**Status:** NOT YET BUILT — Day 14-21 schema + Day 30+ UI

### Layer 4 — cole_orchestrator_log
**Audience:** COLE Orchestrator (machine)
**UI surface:** Surfaces phase-upgrade triggers to CAB
**Status:** NOT YET BUILT — Day 21+ work

### Layer 5 — CAB integration
**Audience:** Operator (architectural decisions)
**UI surface:** Surfaces via approvals page as CAB decisions
**Status:** NOT YET BUILT — Day 30+ flow design

---

## Day 11+ Backlog

### Tactical UI fixes (small)
- Manual Run now button wiring on Strategic Queen monitor (HK #89)
- Detail page link added to StrategicDecisionCard when citation_gap_id != null
- Approvals page badge linking Strategic Queen → /approvals when pending count > 0

### Architectural follow-ups (medium)
- E7 → pending_approvals migration + RuleChangesQueue redirect (HK #87) — Day 14+
- `mark_gap_no_go` UI when E1 NO_GO branch needs operator surface (HK Day 12)
- Drill-down detail page architecture decision (HK #88) — per access pattern emergence
- Per-bee detail pages for E4 cron failures (HK #91) — Day 14+
- E4 query strategy adjustments — investigate higher success rate from 23% (HK #92)
- E4 HTTP 403 mitigation — User-Agent header tuning (HK #93)

### Strategic / multi-tenant (Day 60+)
- Cross-COLE Cost view — likely lives within Reports tab Layer 3 (Day 30+)
- Multi-tenant access control for client-managed mode (HK #78)
- Reports tab branding/templating spec (HK #79)
- Pricing model for managed service (HK #80)

### Day 30+ refinements
- Max threat cards per day per site cap (HK #94)
- Nomad jurisdiction re-evaluation in competitor_country_filter (HK #95)
- Row-of-bees pattern extension if E4b/E4c needed (HK #96)

---

## Process Locks Day 10

- **Audit-first protocol** locked as foundational engineering discipline (DISCOVERIES.md entry)
- **Test fixture pattern** proven for both Strategic Decisions and Competitor Threats — Day 11+ document SQL templates in fixtures library (HK #97)
- **LOC estimate adjustment factors** captured (HK #98-99):
  - UI cards: multiply estimate by 1.5
  - Bee code with audit-trail-per-stage: add 50% buffer
- **Visual sign-off discipline** validated across 4 commits Day 10 (E3 close + Commit A/B/C of pending_approvals + Commit C monitor simplification + E4 Commit A + E4 Commit B)
