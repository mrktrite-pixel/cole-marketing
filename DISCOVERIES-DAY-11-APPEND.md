# DISCOVERIES.md — Day 11 Update

**Date appended:** 2026-05-14 (Day 11, ~18:00 AWST close)
**Append target file:** `cole-marketing/DISCOVERIES.md`
**Append instruction:** Two operations — (A) UPDATE INDEX at top of file, (B) APPEND new entry block after Index, before existing 2026-05-13 entries

---

# ============================================================================
# OPERATION A — UPDATE INDEX (top of DISCOVERIES.md, around line 11-18)
# ============================================================================
#
# REPLACE the existing Index block with this expanded version:

## Index

- **2026-05-14** — [Day 11 Audit Closure: Strategic Queen Architecture Empirically Proven](#2026-05-14--day-11-audit-closure-strategic-queen-architecture-empirically-proven)
- **2026-05-13** — Dashboard Architecture: Decisions, Not Data
- **2026-05-13** — COLE as Managed Service: Operator vs Client Modes
- **2026-05-13** — [E5 reframed: "AI Citation Tracking" → "Retrieval Intelligence"](#2026-05-13--e5-reframed-ai-citation-tracking--retrieval-intelligence)
- **2026-05-13** — [COLE Knowledge Propagation: Self-Governing, Continuously Learning Hives](#2026-05-13--cole-knowledge-propagation-self-governing-continuously-learning-hives)
- _(Earlier entries to be migrated here from any prior date-prefixed files)_

# ============================================================================
# OPERATION B — APPEND NEW ENTRY (after Index, before "## 2026-05-13 — Dashboard Architecture")
# ============================================================================

---

## 2026-05-14 — Day 11 Audit Closure: Strategic Queen Architecture Empirically Proven

**Date created:** 2026-05-14 (Day 11, full-day Strategy Chat audit session, AWST)
**Context:** Planned "close Phase 2 today" pivoted to comprehensive end-to-end audit when Synthesis Layer was discovered reading 0 bee signals at noon. ~10 hours of disciplined audit produced empirical proof of Strategic Queen working end-to-end + canonical technical design document + 12 new discoveries ratified.
**Trigger:** Operator at noon: "we believed 80% GOAT, actual ~33%, what's wrong?" → discovery that Synthesis Layer was reading 0 bee signals due to NULL citation_gap_id FKs on gap_queue rows → F1 backfill (3 UUIDs to citation_gaps + FK linkage) → audit rounds → empirical verification via synthesis run_id `813d495d-9b82-48f3-ba8e-7bed99858e0e`
**Status:** Foundational — Strategic Queen Phase 2 architecturally + empirically signed off. Production Queen build can proceed Day 12 with proven substrate. Discipline locks ratified for ongoing application.

### What we realized

Day 11 morning's confidence ("80% GOAT, close to sign-off") was discipline failure made visible. The Synthesis Layer had been shipping commits, but it was reading **zero** bee signals because `gap_queue.citation_gap_id` FKs were NULL on all active rows. F1 backfill closed the foundational substrate connection.

But the deeper realization is that **the "85% close enough" pattern is the silent killer of disciplined engineering.** Day 11 caught it before it bled into Production Queen build. Without the noon discovery, Production Queen would have been built on a foundation we believed worked but hadn't actually proven.

### Why this matters

**Without Day 11 audit:**
- Production Queen Day 12 hits "no handoffs visible" → spirals into 1-2 day debug session under build pressure
- Synthesis Layer ships more features atop a foundation that isn't connecting bee signals to decisions
- Bee outputs accumulate in tables but never inform Strategic Queen's reasoning
- Discoveries (12 of them surfaced Day 11) remain unknown-unknowns

**With Day 11 audit:**
- Strategic Queen empirically proven end-to-end via run `813d495d` (46s, $0.053, 3 decisions + 3 handoffs + 5 actions)
- 15 connection points documented, 9 GREEN + 6 RED with named fix paths
- 36+ HK items prioritized and categorized
- 8 discipline locks ratified (Day 11 added Lock #8: scope creep is the silent killer)
- Canonical technical design document (~1,475 lines) created for Production Queen integration

### The 15 Connection Points

Strategic Queen's architecture is held together by 15 specific data linkages. Each was audited Day 11:

| # | Connection | Status |
|---|---|---|
| 1 | gap_queue.citation_gap_id → citation_gaps.id | ✅ GREEN (F1 backfill applied) |
| 2 | pending_approvals.payload contains citation_gap_id | ✅ GREEN |
| 3 | Approval server action carries citation_gap_id forward | ✅ GREEN |
| 4 | E7 populates change_diff.affected_gap_ids | ✅ GREEN-EMPIRICAL (5 HMRC entries correctly filtered) |
| 5 | Synthesis JOINs rule_changes via citation_gap_id | ✅ GREEN |
| 6 | E2 stamps gap_queue_id AND citation_gap_id | ✅ GREEN |
| 7 | E3 keys on citation_gap_id | ✅ GREEN |
| 8 | Synthesis JOINs all 6 sources | ✅ GREEN-EMPIRICAL (run 813d495d) |
| 9 | E4 stamps gap_queue_id AND citation_gap_id | ✅ GREEN |
| 10 | last_signal_refreshed_at updated by every bee | ❌ PARTIAL (F2 work) |
| 11 | Every bee writes bee_run_metrics | ❌ PARTIAL (F3 work) |
| 12 | Vercel cron envelope discipline | ❌ NOT IMPLEMENTED |
| 13 | Sub-bee failure isolation | ❌ NOT IMPLEMENTED |
| 14 | API budget monitoring | ❌ NOT IMPLEMENTED (Madame Governance Phase 2) |
| 15 | Shelved-bee runtime enforcement | ❌ NOT IMPLEMENTED |

**Net: 9 of 15 GREEN. 6 are polish on a working system, not architectural blockers.**

### The 12 Day 11 discoveries (ratified as lessons)

**Discovery #1 — The "85% close enough" pattern is the silent killer.**
Day 11 morning believed Strategic Queen was 80% GOAT. Was actually 33%. Pattern: incremental confidence accumulation without empirical verification. **Counter: Discipline Lock #5 — every stage GREEN before advance.**

**Discovery #2 — Verify-before-compose catches ~10 silent failures per audit session.**
Day 11 logged ~10 catches where assumed column/file/schema was wrong. Each one would have been a debug session. **Counter: Discipline Lock #2 — always view file/schema before composing edits.**

**Discovery #3 — Silent-await is a class of bug, not an instance.**
HK #E-1 surfaced at one site (Synthesis writer). Investigation revealed the same pattern at 5 other sites: E3:408, E4:864, E6:290+452, Priority Decay:325. **Lesson: When you find a bug pattern, grep for siblings.**

**Discovery #4 — Scope creep masquerades as decisive action.**
"Just one more thing" mentality drove F1 → F1+F2+F3 → F1+F2+F3+Reddit-redesign mid-flight. Each addition felt obvious. Cumulative cost: hours. **Counter: Discipline Lock #8 — when scope grows mid-flight, STOP and re-scope with operator.**

**Discovery #5 — Vercel cron is best-effort, not guaranteed.**
E1 scheduled 04:00 UTC, actually fired ~05:24 UTC (84-min variance). E2 timed out at 4:50 of 5:00 envelope. **Lesson: Don't write code that assumes cron fires at the scheduled minute or completes within envelope. Plan for graceful timeout.**

**Discovery #6 — The `_help.tsx` pattern (underscore-prefix component).**
`app/dashboard/help/page.tsx` is a 259-byte wrapper; `_help.tsx` (7,027 bytes) is the actual content. When updating a "page," check file sizes first. **Lesson: Underscore-prefix files in route folders are imported components, NOT the page itself.**

**Discovery #7 — Test fixtures vs real data coexist with no schema flag.**
Day 10 test fixtures (example.com competitor, `fddb8b39` row) coexist in production tables. No naming convention or schema flag distinguishes them. **HK #G-32 captures this.** Production Queen must filter test fixtures explicitly or risk shipping broken builds based on test data.

**Discovery #8 — `rule_changes.change_diff` is TEXT not JSONB.**
Day 11 verify-before-compose catch #8. **Workaround: cast at query time with `::jsonb` for JSONB operators.** HK #G-36 captures potential migration if KP Layer 2 needs scale-level querying.

**Discovery #9 — `psychology_signals.pattern_confidence` is integer (0-100) not float (0-1).**
Earlier Session A audit cited wrong type. Day 11 corrected via direct schema dump. **HK #G-20 captures.** Lesson: don't trust earlier audit outputs without re-verification when composing queries.

**Discovery #10 — E4 dominant failure is NOT HTTP 403.**
Initial hypothesis was egress block. Empirical investigation showed 36% `url_resolve_failed` (Brave SERP query construction issue), only 22% `fetch_failed`. **HK #G-19 REVISED reflects corrected root cause.** Fix path: investigate Brave query construction, NOT proxy/OAuth as initially planned.

**Discovery #11 — Strategic Queen reads business context beyond bee signals.**
Synthesis run `813d495d` produced a payment infrastructure escalate flag from observing "8 sessions, 0 purchases" — metrics NOT from any bee. Source of this business context is unclear. **HK #G-29 captures.** Lesson: Strategic Queen is more capable than bee-signal-only thinking suggests. Document the broader context source for Day 12+ understanding.

**Discovery #12 — Character matching emerges naturally from E3 patterns.**
Sonnet matched FRCGW deadline-fear → Priya, s100A innocent-family-caught → Gary, PSI confusion → Priya — **without explicit matching rules**. The emotional pattern from E3 plus the character archetypes in context were sufficient. **HK #G-27 captures.** Implication for KP Layer 2 substrate: character-matching logic can be extracted as a learned pattern from accumulated decisions.

### The 8 discipline locks (Day 11 final form)

These were ratified throughout Day 11. Apply going forward in every Strategy Chat and Session A dispatch.

**Lock #1 — Audit-first protocol:** Verify infrastructure state before drafting fixes.

**Lock #2 — Verify-before-compose:** Schema dump before SQL. File read before edits. ~10 catches Day 11.

**Lock #3 — Deploy verification protocol:** Confirm Vercel SHA matches expected commit before declaring shipped.

**Lock #4 — One-command-at-a-time:** No batched fires. No fire-then-verify combos.

**Lock #5 — GOAT stage sign-off:** Every stage GREEN before advance. No yellow. No "we'll come back to it."

**Lock #6 — Reddit-signal-critical:** Operator-declared foundational ("this bee cannot die"). HK #G-10 is foundational priority.

**Lock #7 — Strategic University:** Bees attend class continuously. Hive learns from its own output via bee_run_metrics + KP layers. Don't manually replicate what should be automated.

**Lock #8 (NEW Day 11) — Scope creep is the silent killer:** When a fix grows mid-flight, STOP and re-scope explicitly with operator. Don't proceed.

### Phase 2 verdict

**Phase 2 of Strategic Queen is empirically signed off.** Run `813d495d` is the proof point:

- 3 gaps synthesized
- 16 E2 + 3 E3 + 8 E4 + 0 E6 + 0 E7 signals read
- 3 decisions written (priority adjustments)
- 3 handoffs written (production-queen × 2, operator × 1)
- 5 recommended actions (build_product × 2, escalate, build_story, manual)
- $0.053 cost, 46s elapsed, 7,663 tokens
- Multi-bee triangulation in Sonnet reasoning
- Character matching to E3 patterns
- Product slug routing to COLE registry
- Business-context awareness (payment infra escalate)

**Audit table reaches ~95% locked.** Remaining 5% is:
- E1 Path 1A end-to-end test (deferred — operator pivoted to Production Queen)
- 5 deferred-by-design items (E6 activation 2026-05-27, KP Layers 2/3/4 monthly+, D-30 scoring refresh)

### Strategic Queen → Production Queen handover contract

Strategic Queen's outputs are now the substrate for Production Queen Day 12+:

**Three output tables Production Queen reads:**
- `strategic_queen_handoffs` — primary (1 row per build target, includes synthesis_provenance)
- `strategic_queen_decisions` — audit trail (priority adjustments)
- `strategic_queen_recommended_actions` — non-build operator directives

**3 Day 11 handoffs waiting for Production Queen:**

| Gap | Character | Phase | handed_to |
|---|---|---|---|
| FRCGW (Foreign Resident Capital Gains Withholding) | Priya | now | production-queen |
| s100A (Trust Reimbursement Agreements) | Gary | now | production-queen |
| PSI (Personal Services Income 80/20) | Priya | next_quarter | operator |

First two are auto-flow. Third is operator-gated.

**Canonical Production Queen read query** documented in `app/dashboard/help/queens/strategic-queen/technical-design/STRATEGIC-QUEEN-TECHNICAL-DESIGN.md` Section 9.2.

### What today did NOT achieve (honest accounting)

**Did not ship:** F2 (cross-bee last_signal_refreshed_at), F3 (cross-bee bee_run_metrics), HK #E-1 ripple fix (5 silent-await sites), E2b runtime disable, E4 Brave SERP query construction fix, Reddit OAuth integration, E1 Path 1A end-to-end empirical verification, Production Queen integration.

**Did achieve:** F1 backfill applied, Step 10 Synthesis Layer shipped (5 commits + hotfix d74d9ee), RLS policy applied to citation_gaps + gap_queue (parity with 10-table pattern), audit table ~95% locked, canonical technical design document (~1,475 lines), 8 discipline locks ratified, 36+ HK items prioritized, 15 connection points documented, help page updated with Strategic Queen Overview + Technical Design buttons.

**Net:** Day 11 paid the audit debt that would have crippled Production Queen build. Production Queen will hit issues Day 12 — those issues are now KNOWN with clear fix paths. Without Day 11, those issues would have been unknown-unknowns eating Day 12-14.

### Pivot to Production Queen Day 12

Operator decision end of Day 11: skip remaining Phase 3 audit (E1 Path 1A test), start Production Queen build Day 12. When Production Queen hits an issue, cross-reference today's HK backlog and verified code locations. **Don't build a fix-list-first session — let real Production Queen integration surface the actual blockers.**

### 8 predicted Production Queen blockers (with workarounds documented)

These will likely surface Day 12+ during Production Queen integration. Each is captured in the handover doc with symptom + cause + workaround + real fix:

1. `strategic_queen_decisions.signals_jsonb` NULL (HK #G-25) → use synthesis_provenance instead
2. `opportunity_score + build_timing_score` NULL on priority_update (HK #G-24) → use gap_queue priority_score directly
3. psychology_signals only 8 rows total → LEFT JOIN gracefully
4. E4 competitor_signals 77% error rate (HK #G-19) → filter WHERE fetch_status='ok'
5. rule_changes.change_diff TEXT not JSONB (HK #G-36) → cast `::jsonb` in queries
6. 3 unknown 'pending' gap_queue rows from 2026-05-11 (HK #G-18) → filter WHERE status='approved'
7. E2b shelved but still fires (Connection #15) → operator monitors envelope until disabled
8. last_signal_refreshed_at not updated by E2/E3/E4/E6 (F2) → affects decay, not Production Queen reads directly

### Cumulative housekeeping captured Day 11

- **#116** — F1 backfill: 3 citation_gaps rows created via direct SQL with operator-tagged `verified_by='operator-day-11-backfill'`. UUIDs: `d3d5d840` (FRCGW), `34026538` (s100A), `702a5313` (PSI). Day 30+ D-30 review must regenerate scoring via fresh AI engine queries.
- **#117** — F2 ship: Cross-bee last_signal_refreshed_at updates on E2/E3/E4/E6 (~30-45 min Session A). Currently only E1 + E7 update this column.
- **#118** — F3 ship: Cross-bee bee_run_metrics writes on E1/E2/E7 (~30-45 min Session A). Currently 5 of 8 bees write to Layer 1 substrate.
- **#119** — HK #E-1 ripple: Silent-await pattern on bee_run_metrics inserts at 5 sites (E3:408, E4:864, E6:290+452, Priority Decay:325). ~75-100 LOC cross-bee patch matching Synthesis Commit E `d74d9ee` hardened pattern.
- **#120** — HK #G-19 REVISED: E4 dominant failure is "no SERP results" (Brave query construction), NOT HTTP 403 egress block. Earlier hypothesis incorrect. Fix path: audit Brave query construction in `e4-competitor-monitor.ts`, NOT proxy/OAuth infrastructure.
- **#121** — E2b runtime disable: Was paused mid-flight Day 11. ~5 min ship — overlay `enabled: false` flag enforced at orchestrator dispatch. Closes Connection #15 partially.
- **#122** — Vercel cron envelope discipline (Connection #12): E2 timed out at 4:50/5:00. Three fix paths — (a) split sub-bees into separate cron routes, (b) in-bee graceful timeout safeguard, (c) Vercel Pro maxDuration bump.
- **#123** — Sub-bee failure isolation (Connection #13): E2b consumes envelope despite SHELVED status. ~5 min tactical fix; ~2-3 hour proper redesign with per-sub-bee timeout + parallel dispatch.
- **#124** — Three unknown 'pending' gap_queue rows from 2026-05-11 of unknown origin (HK #G-18). Day 12+ decision: delete or investigate origin.
- **#125** — Day 10 test fixture cleanup (HK #G-32): example.com competitor + `fddb8b39` row coexist with real data. Decision needed: keep for regression OR remove for cleanliness.
- **#126** — RLS policy uniformity review (HK #G-12): All 12 Strategic Queen tables. Day 11 brought citation_gaps + gap_queue to parity with existing 10. Phase 2.5 review whether stricter site-scoped pattern needed.
- **#127** — citation_gaps indexes for airport-model scale (HK #G-17): (jurisdiction_code, is_active) composite + gap_name indexes needed at 50+ jurisdictions × 100s of gaps.
- **#128** — Strategic Queen output schema gaps (HK #G-23/G-24/G-25): signals_jsonb NULL on all observed rows, opportunity_score NULL on priority_update, dominant_signal=scoring_only logic inconsistency. Investigation Day 13-21+.
- **#129** — CRON_SECRET rotation: `f5b5367d1236b308e317084303513ac8` was pasted in chat Day 11. HK #D-1 requires rotation Day 12 first thing.
- **#130** — Reddit OAuth integration (HK #G-10): operator-declared foundational ("this bee cannot die"). ~4-6 hours. Day 13-14 candidate.
- **#131** — Technical-design folder Day 12 verification: Uncertain whether `app/dashboard/help/queens/strategic-queen/technical-design/` folder + files (page.tsx + STRATEGIC-QUEEN-TECHNICAL-DESIGN.md) made it to disk Day 11. Second help page button may 404. Day 12 verifies first thing.
- **#132** — Universal vs topic-specific bee learning classification (raised during Day 11 STAGE 0 A5 architectural review): bee_run_metrics + lessons_learned + edge_cases_observed need TWO classification layers when airport-model cloning to 2nd site. Today no distinction exists. Worth structural work Day 30+ when KP Layer 2 builds.

### Next-session awareness

**The next Strategy Chat needs to know:**

1. Strategic Queen Phase 2 is empirically signed off — don't re-audit, trust run `813d495d`
2. Day 12 operator pivoted to Production Queen build — not a fix-list session
3. 8 predicted Production Queen blockers documented with symptom + workaround + real fix
4. Discipline Lock #8 (scope creep is silent killer) is the new addition — apply ruthlessly
5. Canonical technical design document is the Production Queen integration reference
6. 3 handoffs are waiting from synthesis run 813d495d — first 2 are auto-flow, 3rd is operator-gated
7. Connection #10 (last_signal_refreshed_at) + Connection #11 (bee_run_metrics) are PARTIAL — F2 + F3 pending
8. `rule_changes.change_diff` is TEXT not JSONB — cast `::jsonb` for query operators
9. The technical-design folder + files may not have shipped Day 11 — verify before assuming 2nd help button works
10. CRON_SECRET rotation pending — HK #D-1, do it first thing Day 12
11. E1 Path 1A end-to-end test is empirically unproven (only test fixture exists) — will fire naturally when operator adds new topic to overlay
12. Strategic Queen reads business context beyond bee signals — source unclear (HK #G-29), worth documenting Day 12+

### Related discoveries

- 2026-05-13 "Dashboard Architecture: Decisions, Not Data" — Strategic Queen's three output tables ARE the decision-card substrate this entry described as foundational
- 2026-05-13 "COLE Knowledge Propagation" — KP Layer 1 (bee_run_metrics) is what Day 11 verified is PARTIAL coverage (5 of 8 bees) — direct empirical follow-up to the KP architecture entry
- 2026-05-13 "E5 reframed" — E5 deferred Day 30+; Day 11 did not touch E5; the 6 signal sources Strategic Queen reads are E1/E2/E3/E4/E6/E7 (no E5)

# ============================================================================
# END OF DAY 11 UPDATE
# ============================================================================
