# FINAL BEE STRUCTURE — Vanilla Template (COLE Canonical)

**Locked:** Day 3 close (May 8 evening 2026)
**Supersedes:** PROPOSED-QUEEN-REORG.md (v1) and PROPOSED-QUEEN-REORG-v2.md
**Operator framing:** "Vanilla template, strawberry instances. Same process, different ingredients per site."
**Status:** LOCKED — no more iteration. Build from this.

---

## Architecture model

```
🏗️ STRATEGIC QUEEN (Hive 1: Research) — "finds the land"
🏠 PRODUCTION QUEEN (Hive 2: Build) — "builds the house"  ← LIVE
🛣️ DISTRIBUTION QUEEN (Hive 3: Publish + Traffic + Authority) — "builds the roads"
🔨 ADAPTIVE QUEEN (Hive 4: Learn + Calibrate) — "renovates based on feedback"
💡 GOVERNANCE QUEEN (Hive 5: Integrity + Stability) — "keeps the lights on"

+ COLE ORCHESTRATOR QUEEN (cluster layer) — "decides which neighbourhoods to enter"

5 per-site queens + 1 cluster queen = 6 total
```

---

## QUEEN 1 — STRATEGIC QUEEN (Hive 1: Research)

**Purpose:** "What should we build next?"
**Token:** Sonnet
**Risk tier:** LOW (research only)
**Cron:** Daily fast loop on gap_queue + weekly slow loop on strategy
**Build target:** Day 4

### Bees (7 total)

| Bee | Status | Purpose |
|---|---|---|
| E1 Citation Gap Scanner | LIVE-spec | Finds where AI gives wrong answers |
| E2 Market Researcher | LIVE-spec | Every question asked about topic |
| E3 Customer Psychologist | LIVE-spec | Buyer emotional state, fears, urgency |
| E4 Competitor Monitor | LIVE-spec | Competitor gaps = our angles |
| E5 GEO Scanner | LIVE-spec | Monthly check: are we cited by AI engines? |
| **E6 Trend Velocity Scanner** | **NEW SPEC** | Rising topics before saturation |
| **E7 Truth-Sync Monitor** | **NEW SPEC** | Per-site configurable: laws + tech-stack + market signals (Gemini's expansion of regulatory) |

**Per-site config:** E7 watch sources defined in `site_context.truth_sync_sources` (e.g. taxchecknow: ATO+HMRC+IRS; claudecowork: Anthropic blog+MCP repos)

---

## QUEEN 2 — PRODUCTION QUEEN (Hive 2: Build) ← RENAMED FROM TACTICAL

**Purpose:** "Turn opportunities into assets"
**Token:** Sonnet
**Risk tier:** MEDIUM (writes operational observations)
**Cron:** Every 4h (already LIVE)
**Build target:** ✅ ALREADY LIVE — needs cosmetic rename

### Bees (10 total + 6 infrastructure components)

| Bee | Status | Purpose |
|---|---|---|
| F1 Product Architect | LIVE-spec | Designs calculator structure |
| F2 Calculator Builder | LIVE-spec | Builds calculator from F1 |
| F3 Quality Checker | LIVE-spec | Final QA before product ships |
| F3b Legal Auditor | LIVE-spec | Verifies legal/tax claims |
| G1 Hook Matrix | LIVE-spec | Hooks with composite_score |
| **G2 Narrative Planner** | **NEW SPEC** | Story arc selection (Planner→Critic→Refiner) |
| **G4 Story Critic** | **NEW SPEC** | Critiques story clarity + strength |
| G5 Story Writer | LIVE-spec | Canonical Gary-narrative stories |
| G6 Article Builder | LIVE-spec | Long-form GEO articles |
| G7 Email Writer family | ✅ LIVE | T2/Nurture/Re-engagement (β engine Day 2) |

**Infrastructure (Production Queen domain):**
- /stories/[slug] route
- /questions/[slug] route
- /gpt/[slug] route
- /llms.txt + /robots.txt
- Calculator email-capture (Save box)
- β Save-Box Conversion Engine
- content_assets table
- lib/content-naming.ts

**STATUS:** Queen ALREADY LIVE on taxchecknow as "Tactical Queen" (commit c4af6cd). Rename Tactical → Production = cosmetic dashboard change.

---

## QUEEN 3 — DISTRIBUTION QUEEN (Hive 3: Publish + Traffic + Authority) ← NEW QUEEN

**Purpose:** "Keep traffic alive at all costs" — circulation system + authority propagation + search intelligence
**Token:** Sonnet
**Risk tier:** HIGH (publishes to live platforms — operator-gated first runs per site)
**Cron:** Daily synthesis + ad-hoc on platform_accounts changes
**Build target:** Day 5

### Bees (27 total at full station coverage)

#### Distribution Health (3 NEW)

| Bee | Status | Purpose |
|---|---|---|
| **D1 Cadence Monitor** | **NEW SPEC** | Catches Finding B-type silent failures (posting slowdown) |
| **D2 Reach Decay Detector** | **NEW SPEC** | Traffic decline alerts |
| **D3 Warm-Up Manager** | **NEW SPEC** | Wraps lib/_warm-up-guard.ts as autonomous bee |

#### Authority Propagation (3 NEW — biggest insight from external audit)

| Bee | Status | Purpose |
|---|---|---|
| **A2 Internal Linking Bee** | **NEW SPEC** | Builds authority graph between /stories/ + /questions/ + /products/ |
| **A3 GEO Optimizer Bee** | **NEW SPEC** | Tunes content format for AI extraction |
| **A7 Content Decay Bee** | **NEW SPEC** | Detects stale authority pages, feeds B3 Story Refresher |

#### Search Intelligence (3 NEW — biggest insight from external audit)

| Bee | Status | Purpose |
|---|---|---|
| **S1 Indexation Monitor** | **NEW SPEC** | Catches silent indexing failures |
| **S2 Ranking Monitor** | **NEW SPEC** | SERP position tracking |
| **S3 Snippet/GEO Monitor** | **NEW SPEC** | Tracks AI Overviews + Perplexity citations |

#### Pipeline Orchestration (existing 3)

| Bee | Status | Purpose |
|---|---|---|
| H1 Distribution Bee | LIVE-spec | IndexNow + Google Indexing + llms.txt updates |
| I1 Conductor | LIVE-spec | Reads completed jobs → campaign_calendar |
| I2 Launch Manager | LIVE-spec | 14-check quality gate before campaign fires |
| I3 Re-engagement | LIVE-spec | Single follow-up email (β engine integration) |

#### Platform Stations (existing publishing pipelines)

| Station | Bees | Status |
|---|---|---|
| LinkedIn (J) | 9 bees: J1, J1.5, J2, J3, J3.5, J3.6, J4, J5, J6 | LIVE-spec |
| TikTok (N) | 5 bees: N1-N5 | LIVE-spec |
| Instagram (M) | 5 bees stub: M1-M5 | STUB |
| YouTube (L) | 10 bees stub: L1-L5 Shorts + L1L-L5L Long-form | STUB |
| X/Twitter (Q) | 5 bees stub | STUB |
| Reddit (O) | 3 bees stub: O1 Listen + O2 Reply + O3 Compliance | STUB |

---

## QUEEN 4 — ADAPTIVE QUEEN (Hive 4: Learn + Calibrate)

**Purpose:** "What is actually working?" — the moat
**Token:** Sonnet
**Risk tier:** HIGH (modifies bee behavior — operator-gated for first run per bee)
**Cron:** Weekly synthesis + ad-hoc on Doctor 3-fail patterns
**Build target:** Day 7-8

### Bees (10 total)

| Bee | Status | Purpose |
|---|---|---|
| Doctor Bee (P5) | LIVE-spec | Analytics grading at 24h + 7d, GOAT grades |
| K1 Scientist Bee | LIVE-spec | V2 generation on FAIL/DEAD |
| K9 Review Monitor | LIVE-spec | Comments → research_questions |
| K10 Site Health Bee | LIVE-spec | Weekly URL health checks |
| B1 Broker (V2→Calendar) | LIVE-spec | The ONLY way V2 reaches calendar |
| B2 Broker (Lessons→Weights) | LIVE-spec | The ONLY way K12 lessons modify hook_matrix |
| B3 Story Refresher | LIVE-spec | Reads K12 patterns → /stories/ updates |
| **K12 Pattern Extractor** | **NEW SPEC** | CRITICAL — moat infrastructure |
| **K13 Behavior Updater** | **NEW SPEC** | CRITICAL — modifies bee_configs |
| **K14 Confidence Evaluator** | **NEW SPEC** | Confidence scores prevent overreaction to noise |

---

## QUEEN 5 — GOVERNANCE QUEEN (Hive 5: Integrity + Stability) ← RENAMED FROM CLEANING

**Purpose:** "Keep the ecosystem trustworthy and resilient" — operations + compliance + infrastructure
**Token:** Mixed (Haiku for hygiene, Sonnet for policy/drift)
**Risk tier:** Mixed (LOW for hygiene, MEDIUM for policy)
**Cron:** Various (hygiene weekly, policy ad-hoc, audit continuous)
**Build target:** Day 8-9

**Madame stays as the queen's nickname/personality. Title is Governance Queen.**

### Bees (15 total)

#### Existing Hygiene (3)

| Bee | Status | Purpose |
|---|---|---|
| K15 Storage Sweeper | LIVE-spec | Old PDFs >90d, orphaned renders >30d |
| K17 Queue Janitor | LIVE-spec | Stale video_queue, in_progress >14d |
| K21 Cost Reporter | LIVE-spec | Weekly token spend + budget alerts |

#### Data Quality (1 NEW — CRITICAL, blocks Adaptive Queen)

| Bee | Status | Purpose |
|---|---|---|
| **DQ1 Data Integrity Bee** | **NEW SPEC** | Sample size + anomaly + attribution confidence — without this, Adaptive Queen self-trains on noise |

#### Safety (4 NEW)

| Bee | Status | Purpose |
|---|---|---|
| **V1 Policy Validator** | **NEW SPEC** | Blocks medical/legal/tax false claims |
| **V2 Risk Escalator** | **NEW SPEC** | Severity routing 1-5 |
| **V3 Drift Detector** | **NEW SPEC** | Behavioral degradation alerts |
| **V4 Rollback Manager** | **NEW SPEC** | Reverts failed bee_config changes |

#### Reliability (3 NEW)

| Bee | Status | Purpose |
|---|---|---|
| **K20 Queue Monitor** | **NEW SPEC** | Stuck jobs |
| **K22 Retry Manager** | **NEW SPEC** | Fixes Finding B silent failures |
| **K23 Dependency Watcher** | **NEW SPEC** | Broken pipeline chains |

#### Hygiene Expansion (4 NEW)

| Bee | Status | Purpose |
|---|---|---|
| **C1 Duplicate Cleaner** | **NEW SPEC** | Duplicate stories/content |
| **C2 Dead Link Scanner** | **NEW SPEC** | Broken links |
| **C3 Archive Manager** | **NEW SPEC** | Discovery #44 ghost rows + stale content |
| **C4 Ecosystem Health Monitor** | **NEW SPEC** | Site Health Score (single metric for ecosystem health) |

#### Audit + Memory (3 NEW)

| Bee | Status | Purpose |
|---|---|---|
| **A20 Change Logger** | **NEW SPEC** | What changed |
| **A21 Decision Historian** | **NEW SPEC** | Why changes happened |
| **A22 Compliance Archivist** | **NEW SPEC** | Legal/audit trail |

---

## QUEEN 6 — COLE ORCHESTRATOR QUEEN (Cluster Layer)

**Purpose:** Cross-site portfolio strategy
**Token:** Opus (highest accuracy strategic decisions)
**Risk tier:** LOW (advisory only — operator approves all)
**Cron:** Daily 4am UTC
**Build target:** Day 9
**Per-site bees:** 0 (she IS the cluster intelligence)

### Outputs

`orchestrator_recommendations` table with 7 recommendation types:
- NEW_SITE
- NEW_PRODUCT
- RETIRE_PRODUCT
- INVESTIGATE_ANOMALY
- REBALANCE_FOCUS
- CROSS_POLLINATION
- PRICING_CHANGE

**She lives ABOVE per-site queens.** Reads cross-site purchases + decision_sessions + content_performance. Writes recommendations to operator. Operator gates all decisions.

---

## TOTAL BEE COUNT (vanilla template)

```
Queens: 6 (5 per-site + 1 cluster)
Strategic:    7 bees (5 LIVE-spec + 2 NEW)
Production:   10 bees (8 LIVE-spec + 2 NEW) + 6 infra components
Distribution: 27 bees (18 LIVE-spec + 9 NEW) + 23 station stubs (M/L/Q/O at full coverage)
Adaptive:     10 bees (7 LIVE-spec + 3 NEW)
Governance:   15 bees (3 LIVE-spec + 12 NEW)

Total bees: 69 + 23 station stubs = 92 at full station coverage
Total components: 92 bees + 6 queens + 6 infra = 104

Matches ChatGPT's "60-90 bees per site" estimate ✅ (within range)
```

---

## SPRINT MUST-SHIP SUBSET (Days 5-9, ~10 bees)

These are the bees that genuinely BUILD vs JUST DOCUMENT in sprint:

```
Day 5 — Distribution Queen build:
  ✓ Distribution Queen herself
  ✓ D1 Cadence Monitor
  ✓ D2 Reach Decay Detector

Day 6 — Adaptive prerequisites:
  ✓ Doctor Bee (P5) build
  ✓ K12 Pattern Extractor
  ✓ bee_configs migration (7 bees off hardcoded)

Day 7 — Adaptive Queen + safety net:
  ✓ DQ1 Data Integrity Bee (BLOCKS Adaptive)
  ✓ K13 Behavior Updater
  ✓ K14 Confidence Evaluator
  ✓ Adaptive Queen build

Day 8 — Governance critical path:
  ✓ Governance Queen rename + scope expansion
  ✓ V1 Policy Validator
  ✓ V3 Drift Detector
  ✓ K20 Queue Monitor
  ✓ K22 Retry Manager (fixes Finding B)
  ✓ First content shipped through full pipeline

Day 9 — COLE Orchestrator + Email Phase 1:
  ✓ COLE Orchestrator Queen build
  ✓ Email Phase 1 wired to β engine

Day 10 — COLE re-runs taxchecknow + retrospective
```

**Sprint subset: ~16 bees built. 53+ bees remain SPEC_ONLY in dashboard for Phase 8+.**

---

## PHASE 8+ DEFERRED (53 bees as SPEC_ONLY in dashboard)

Documented in dashboard but NOT built in sprint:

```
Strategic:
  E6 Trend Velocity Scanner
  E7 Truth-Sync Monitor (note: scope locked tomorrow, build later)

Production:
  G2 Narrative Planner
  G4 Story Critic

Distribution:
  D3 Warm-Up Manager
  A2 Internal Linking
  A3 GEO Optimizer
  A7 Content Decay
  S1 Indexation Monitor
  S2 Ranking Monitor
  S3 Snippet/GEO Monitor
  All M/L/Q/O station bees (when each platform's turn comes)

Governance:
  V2 Risk Escalator
  V4 Rollback Manager
  K23 Dependency Watcher
  C1 Duplicate Cleaner
  C2 Dead Link Scanner
  C3 Archive Manager
  C4 Ecosystem Health Monitor
  A20 Change Logger
  A21 Decision Historian
  A22 Compliance Archivist
```

---

## DASHBOARD UPDATE REQUIREMENTS (Day 4 morning)

```
RENAMES:
- Tactical Queen → Production Queen (in beeData)
- Madame · Cleaning Queen → Madame · Governance Queen
- Update queens-architecture lifecycle entries to match
- Update issuesList critical items

NEW QUEEN CARD (full SPEC_ONLY):
- Distribution Queen

NEW BEE CARDS (28 SPEC_ONLY):
Strategic: E6, E7
Production: G2, G4
Distribution: D1, D2, D3, A2, A3, A7, S1, S2, S3
Adaptive: K12, K13, K14
Governance: DQ1, V1, V2, V3, V4, K20, K22, K23, C1, C2, C3, C4, A20, A21, A22

UPDATED CARDS:
- Production Queen card (was Tactical) — already LIVE status
- Governance Queen card (was Cleaning) — expanded scope description

HEADER UPDATE:
"60 bees · 14 stations · May 8 2026 (Day 3 close-out · TACTICAL QUEEN SHIPPED LIVE)"
→ "~92 bees · 6 queens · 14 stations · May 9 2026 (Day 4 architecture v2 — vanilla template locked)"

DB_TABLES additions:
- gap_queue (Strategic Queen output)
- strategic_queen_decisions (Day 4)
- distribution_queen_observations (Day 5)
- adaptive_queen_decisions (Day 7)
- governance_queen_actions (Day 8)
- bee_configs (versioned configs)
- lessons_learned (K12 output)
- content_performance (Doctor Bee output)
- operator_gates (Day 9 with Approvals tab)
```

---

## SPRINT SEQUENCE (Days 4-10)

```
Day 4 morning (~2-3h):
  - Read this doc + confirm
  - Operator confirms 6-decision lock (queen renames + 28 SPEC_ONLY 
    additions + sprint subset + Phase 8 deferral)
  - I produce updated page.tsx (wholesale rewrite, like Day 2/Day 3)
  - Operator commits + Vercel verifies
  - Day 4 architecture revision SHIPPED LIVE

Day 4 afternoon (~3-4h):
  - Strategic Queen build (5-phase pattern, same as Tactical/Production)
  - First-fire with manually-seeded gap_queue
  - End-of-day discipline (flowchart + OPERATIONAL-STATE)

Day 5 — Distribution Queen + D1 + D2 (~4h)
Day 6 — Doctor Bee + K12 + bee_configs migration (~5-6h)
Day 7 — DQ1 + K13 + K14 + Adaptive Queen (~5h)
Day 8 — Governance Queen + V1 + V3 + K20 + K22 + first content (~5-6h)
Day 9 — COLE Orchestrator + Email Phase 1 (~5h)
Day 10 — COLE re-runs taxchecknow + retrospective (~4h)
```

---

## VANILLA → STRAWBERRY (operator's analogy locked)

```
THE COLE TEMPLATE IS VANILLA:
- 6 queens
- ~69 bees (vanilla recipe)
- Per-site config in site_context table (the strawberry recipe)
- Operator manually curates per-site config at site spin-up
- Bees execute against per-site config without code changes

EACH SITE IS STRAWBERRY:
- Same vanilla architecture
- Different ingredients per site (audience, content, regulatory 
  domain, products, character voice)
- Same compounding loop
- Same business process
- Different validation metrics per niche if needed

EXAMPLE: claudecowork.com (future site)
- Same 6 queens, same 69 bees
- Different E7 watch sources (Anthropic blog + MCP repos vs ATO/HMRC)
- Different character voice (tech founder vs Gary the migrant)
- Different product mix ($67 personalised AI tool replacement template)
- Same Doctor Bee grading flow, same Adaptive Queen learning loop
- Strawberry on top of vanilla
```

---

**LOCKED. Build from this. No more iteration.**
