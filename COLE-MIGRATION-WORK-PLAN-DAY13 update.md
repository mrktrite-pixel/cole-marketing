# COLE Migration Work Plan — V1 LIGHT → Locked Day 13 Architecture

**Status:** Migration work plan. Designed against actual current state (per soverella codebase + Strategic Queen technical-design page + cole-marketing workflow JSX) and locked Day 13 architecture (COLE-ARCHITECTURE-LOCKED-DAY13.md).

**Created:** Day 13 (16 May 2026)
**Format:** Structural plan. Session A fills in code-specific details (file paths, exact commit recipes, schema migration SQL) during execution. Plain operator decisions live here.

**Important framing:** This is **NOT a rebuild**. 5 of 6 queens already ship at V1 LIGHT. The migration is incremental — preserve what works, re-cut ownership where the locked architecture differs, add net-new pieces (Concierge Queen, Apiary layer).

---

## §1 — Bee-by-bee disposition table (READ THIS FIRST)

Every existing bee/queen mapped to its disposition under the locked architecture. The table is the single source of truth — everything that follows references rows in this table.

### Legend

| Disposition | Meaning |
|---|---|
| **KEEP** | Bee stays as-is, no functional change |
| **RENAME** | Same code, new name (cosmetic) |
| **CHANGE** | Same role, behavior modifications required |
| **MOVE** | Re-homed to different queen (ownership re-cut) |
| **PROMOTE** | Existing minor capability gets promoted to first-class bee |
| **DELETE** | Removed entirely |
| **SHELVE** | Kept in code but disabled in overlay; not maintained |
| **NET-NEW** | Doesn't exist today; new build |

### Queens — top-level disposition

| Queen | Current state | New name | Disposition | Notes |
|---|---|---|---|---|
| Strategic Queen | LIVE Day 4 · synth proven · V1 LIGHT | Strategic Queen | **CHANGE** | Scope narrows: keeps demand detection + scoring + site auditor; loses ownership of E2/E3/E4/E7 deep research |
| Production Queen (was Tactical) | LIVE Day 3 · code still named tactical | Production Queen | **CHANGE** | Scope expands: absorbs E2/E3/E4/E7 deep research as scoped-per-build research bees |
| Distribution Queen | LIVE Day 5 · LinkedIn-only V1 LIGHT | Distribution Queen | **KEEP** | Stays focused on broadcast publishing; no scope change |
| Adaptive Queen | LIVE Day 5 PM · V1 LIGHT · 0 patterns yet | Adaptive Queen | **KEEP** | No scope change; just waits for data |
| Madame · Governance Queen | LIVE Day 6 · V1 LIGHT | Governance Queen | **CHANGE** | Add cross-queen Summary Publisher bee for Apiary federation |
| COLE Orchestrator | SPEC_ONLY · Day 9 target · Opus $15-30/run | COLE Orchestrator | **CHANGE** | Reframe per locked architecture: cross-hive aggregation + methodology curator, not cluster-strategy CEO |
| (none) | (no current Apiary layer) | Apiary Strategic Queen | **NET-NEW** | Scouts new hives. Lives in Bee Farm view |
| (none) | (no current Concierge construct) | Concierge Queen | **NET-NEW** | Absorbs scattered G7 email family + I3 re-engagement |

### E Station bees (currently under Strategic Queen) — destination

| Bee | Current state | Disposition | Goes to | Notes |
|---|---|---|---|---|
| E1 Citation Gap Scanner | LIVE Day 10 | **CHANGE → STAYS** in Strategic Queen | Strategic Queen / Demand Hunter | Expand source list: add Bing AI Performance + YouTube. Existing AI engine query stays. Path 1A (discovery via pending_approvals) is the operator gate that becomes Strategic Queen handoff approval |
| E2 Market Researcher (orchestrator) | LIVE Day 10 · Row-of-Bees parent | **MOVE** to Production Queen | Production Queen / Customer Voice Capturer (orchestrator) | The Row-of-Bees pattern itself is preserved. Becomes per-build orchestrator under Production Queen |
| E2a Google + Reddit | SHELVED · Google CSE expired + Reddit egress | **DELETE** | (gone) | Reddit deprecated per locked architecture. Remove from overlay. Schema columns stay for now |
| E2b Brave + Reddit | SHELVED · 15/15 fetch_failed per fire | **DELETE** | (gone) | Reddit deprecated. Wastes Brave API quota daily even shelved — disable in overlay immediately as Phase 0 quick win |
| E2c Brave + StackExchange | LIVE Day 10 · ~14 SE rows per fire | **MOVE** to Production Queen | Production Queen / Customer Voice Capturer / sub-bee | Stays Row-of-Bees pattern. Now scoped per build instead of fan-out daily |
| E2e-chatgpt | LIVE Day 10 · 76 URLs/fire | **MOVE + PROMOTE** | Strategic Queen / Demand Hunter (citation grounding sub-routine) AND Production Queen / Customer Voice Capturer | Dual purpose: at Strategic level it's a demand signal source; at Production level it's a per-topic citation capture for building |
| E2e-gemini | LIVE Day 10 · 7-21 authority URLs/row | **MOVE + PROMOTE** | Strategic Queen / Demand Hunter (grounding metadata routine) AND Production Queen / Authority Verifier | Same dual-purpose pattern. Critical input to both queens |
| E3 Customer Psychologist | LIVE Day 10 | **MOVE** to Production Queen | Production Queen / Customer Voice Capturer (psychology sub-routine) | Scoped per build, not fan-out daily |
| E4 Competitor Monitor | LIVE Day 10 · 23% success rate | **MOVE** to Production Queen | Production Queen / Competitor Auditor | Scoped per build. The Row-of-Bees pattern stays |
| E5 Retrieval Intelligence | SPEC_ONLY · deferred Day 30+ | **DELETE / DEFER** | (re-evaluate at Day 30+) | Reframed as Phrase Propagation Tracker. Locked architecture doesn't depend on it. Keep deferred |
| E6 Trend Velocity | LIVE deferred-activation until 2026-05-27 | **CHANGE → STAYS** in Strategic Queen | Strategic Queen / Demand Scorer | Velocity is a scoring input, not raw demand detection. Stays where it is |
| E7 Truth-Sync | LIVE | **MOVE** to Production Queen | Production Queen / Authority Verifier (continuous ping mode) | Authority changes are per-product, not per-hive. Each Production Queen-built product pings its own authority URLs. Initial verifier runs at build; continuous pinger runs ongoing |
| Priority Decay | LIVE Day 10 | **KEEP** | Strategic Queen / Demand Scorer (decay sub-routine) | Pure math, no LLM. Just stays |

### F Station bees (Production Queen build pipeline) — destination

| Bee | Current state | Disposition | Goes to | Notes |
|---|---|---|---|---|
| F1 Product Architect | SPEC_ONLY | **CHANGE** | Production Queen / Calculator Architect | Same role, formalized as bee in new design |
| F2 Calculator Builder | SPEC_ONLY | **CHANGE** | Production Queen / Page Assembler (calculator portion) | Same role |
| F3 Quality Checker | SPEC_ONLY | **CHANGE** | Production Queen / Quality Gate | Same role, GOAT 12-block scorer formalized |
| F3b Legal Auditor | SPEC_ONLY | **CHANGE** | Production Queen / Legal Gate | Same role |

### G Station bees (content creation) — destination

| Bee | Current state | Disposition | Goes to | Notes |
|---|---|---|---|---|
| G1 Hook Matrix | SPEC_ONLY · NEVER RUN | **DELETE** | (gone) | Critical issue today. Hand-stuffed currently. Not part of new architecture — Production Queen's Page Assembler writes copy directly |
| G2 Narrative Planner | SPEC_ONLY · NEW Day 4 | **DELETE** | (gone) | Planner→Critic→Refiner pattern not preserved; new architecture's Quality Gate replaces it |
| G4 Story Critic | SPEC_ONLY · NEW Day 4 | **DELETE** | (gone) | Same — Quality Gate replaces |
| G5 Story Writer | LIVE Day 4 | **MOVE** to Production Queen | Production Queen / Page Assembler (story sub-component) | Multi-character stories continue. Persona logic stays |
| G6 Article Builder | SPEC_ONLY | **MOVE** to Production Queen | Production Queen / Page Assembler (article sub-component) | /questions/ companion articles |
| G7 Email Writer family | LIVE (β engine Day 2) | **SPLIT** | Production Queen (transactional only) + Concierge Queen (lifecycle/nurture/re-engagement) | Build-time transactional emails (Stripe receipt, immediate delivery) stay with Production Queen; everything else moves to Concierge |
| G8 Video Scripter | (not in current code) | (no action) | — | Distribution Queen owns video scripts in new architecture |

### H Station — destination

| Bee | Current state | Disposition | Goes to | Notes |
|---|---|---|---|---|
| H1 Distribution Bee | LIVE | **MOVE** to Production Queen | Production Queen / Page Assembler (publish + indexation portion) | IndexNow/Google Indexing/llms.txt update is part of the product's publication. Belongs with Production Queen |

### I Station — destination

| Bee | Current state | Disposition | Goes to | Notes |
|---|---|---|---|---|
| I1 Conductor (scheduler) | LIVE | **MOVE** to Distribution Queen | Distribution Queen / Publisher | Scheduling broadcast publications is Distribution's job |
| I2 Launch Manager | SPEC_ONLY | **DELETE** | (gone) | 14-check quality gate is now Production Queen's Quality Gate. Don't need a separate launch manager |
| I3 Re-engagement Bee | LIVE Day 2 (β engine) | **MOVE** to Concierge Queen | Concierge Queen / Sequence Engine (re-engagement sequence) | 1:1 customer lifecycle work |

### J Station (LinkedIn) — destination

| Bee | Current state | Disposition | Goes to | Notes |
|---|---|---|---|---|
| J1 LinkedIn Research | BUILT | **MOVE** to Distribution Queen | Distribution Queen / LinkedIn Channel Adapter (research sub-routine) | Bundled into the LinkedIn adapter bee |
| J1.5 Viral Template Scraper | BUILT (Claude-knowledge weakness) | **MOVE** to Distribution Queen | Distribution Queen / LinkedIn Channel Adapter | Same bundling |
| J2 LinkedIn Strategy | LIVE | **MOVE** to Distribution Queen | Distribution Queen / LinkedIn Channel Adapter (strategy sub-routine) | Same bundling |
| J3 LinkedIn Adapter | LIVE | **MOVE** to Distribution Queen | Distribution Queen / LinkedIn Channel Adapter (adapter sub-routine) | Same bundling |
| J3.5 Carousel Copywriter | BUILT | **MOVE** to Distribution Queen | Distribution Queen / LinkedIn Channel Adapter (carousel sub-routine) | Same bundling |
| J3.6 Carousel Renderer | BUILT | **MOVE** to Distribution Queen | Distribution Queen / LinkedIn Channel Adapter (renderer sub-routine) | Same bundling |
| J4 LinkedIn Manager | BUILT (UNVERIFIED) | **MOVE** to Distribution Queen | Distribution Queen / Publisher (quality gate sub-routine) | Same role, just under Distribution Queen instead of standalone J-station |
| J5 LinkedIn Publisher | LIVE | **MOVE** to Distribution Queen | Distribution Queen / Publisher (LinkedIn channel) | Same |
| J6 LinkedIn Engagement | BUILT | **MOVE** to Concierge Queen | Concierge Queen / Inbound Handler (LinkedIn channel) | Comment replies = 1:1 engagement, not broadcast. Belongs to Concierge |

### N Station (TikTok) — destination

| Bee | Current state | Disposition | Goes to | Notes |
|---|---|---|---|---|
| N1-N5 TikTok bees | SPEC_ONLY (Block 2 in progress) | **MOVE** to Distribution Queen | Distribution Queen / Short-Form Channel Adapter (TikTok sub-routine) | Same Row-of-Bees pattern preserved, just under Distribution Queen |

### M / L / Q / O Stations — destination

| Station | Current state | Disposition | Goes to | Notes |
|---|---|---|---|---|
| M (Instagram) | SPEC_ONLY | **MOVE** to Distribution Queen | Distribution Queen / Short-Form Channel Adapter (Instagram) + Carousel Renderer | Future Block 3A |
| L (YouTube) | SPEC_ONLY | **MOVE** to Distribution Queen | Distribution Queen / YouTube Channel Adapter (Shorts + Long-Form) | Future Block 3B + 3D |
| Q (X/Twitter) | SPEC_ONLY | **MOVE** to Distribution Queen | Distribution Queen / X Channel Adapter | Future Block 3C |
| O (Reddit) | SPEC_ONLY | **DELETE** | (gone for now) | Per locked architecture, Reddit is not on critical path. Can revisit if SABRINA-PLAYBOOK manual approach still desired separately |

### K Station (broker + maintenance) — destination

| Bee | Current state | Disposition | Goes to | Notes |
|---|---|---|---|---|
| P5 Doctor Bee | STUB · GA4 wrapper live but reader unbuilt | **MOVE** to Adaptive Queen | Adaptive Queen / Anomaly Detector | Per-platform health checks become Adaptive's anomaly detection |
| K1 Scientist Bee | SPEC_ONLY | **MOVE** to Adaptive Queen | Adaptive Queen / Recommendation Composer | V2 strategy generation = Adaptive's prescription engine |
| K9 Review Monitor | SPEC_ONLY | **MOVE** to Concierge Queen | Concierge Queen / Inbound Handler | Comment monitoring is 1:1 customer engagement |
| K10 Site Health | SPEC_ONLY | **MOVE** to Governance Queen | Governance Queen / Infrastructure Pinger | URL health is infrastructure |
| K12 Pattern Extractor | SPEC_ONLY · CRITICAL | **MOVE** to Adaptive Queen | Adaptive Queen / Pattern Synthesizer | Same role, cleaner home |
| K13 Behavior Updater | SPEC_ONLY · CRITICAL | **MOVE** to Adaptive Queen | Adaptive Queen / Recommendation Composer (feedback card writer) | Feedback cards replace direct bee_config writes (operator-gated) |
| K14 Confidence Evaluator | LIVE Day 5 (registry fix Day 6) | **MOVE** to Adaptive Queen | Adaptive Queen / Self-Calibration Pinger | Same role |
| K15 Storage Sweeper | SPEC_ONLY | **MOVE** to Governance Queen | Governance Queen / Janitor | Same role |
| K17 Queue Janitor | SPEC_ONLY | **MOVE** to Governance Queen | Governance Queen / Janitor | Same role |
| K20 Queue Monitor | LIVE Day 6 | **MOVE** to Governance Queen | Governance Queen / Infrastructure Pinger | Same role |
| K21 Cost Reporter | LIVE Day 6 | **MOVE** to Governance Queen | Governance Queen / Cost Watcher | Same role |
| K22 Retry Manager | SPEC_ONLY | **MOVE** to Governance Queen | Governance Queen / Infrastructure Pinger | Same role |
| K23 Dependency Watcher | SPEC_ONLY | **MOVE** to Governance Queen | Governance Queen / Infrastructure Pinger | Same role |
| B1 Broker (V2 → Calendar) | SPEC_ONLY | **DELETE** | (gone) | Locked architecture has no broker pattern; Adaptive emits feedback cards directly to Distribution Queen who acts on them |
| B2 Broker (Lessons → hook_matrix) | SPEC_ONLY | **DELETE** | (gone) | Same — feedback cards replace broker pattern |
| B3 Story Refresher | SPEC_ONLY | **MOVE** to Production Queen | Production Queen / Page Assembler (refresh mode) | Story compounding is Production Queen's ownership per "whoever made it owns it" |

### DQ / V / C / AUDIT Stations — destination

| Bee | Current state | Disposition | Goes to | Notes |
|---|---|---|---|---|
| DQ1 Data Integrity | SPEC_ONLY · BLOCKS Adaptive | **MOVE** to Adaptive Queen | Adaptive Queen / Metric Aggregator | Data quality gate inside Adaptive |
| V1 Policy Validator | LIVE Day 6 | **MOVE** to Governance Queen | Governance Queen / Audit Recorder + Infrastructure Pinger (compliance check side) | Policy validation = compliance/safety |
| V2 Risk Escalator | SPEC_ONLY | **DELETE** | (gone) | Locked architecture handles escalation via event bus + operator alerts, not a dedicated escalator bee |
| V3 Drift Detector | SPEC_ONLY | **MOVE** to Adaptive Queen | Adaptive Queen / Anomaly Detector | Drift detection is anomaly detection |
| V4 Rollback Manager | SPEC_ONLY | **MOVE** to Governance Queen | Governance Queen / Audit Recorder (version control side) | Rollback is config audit + management |
| C1 Duplicate Cleaner | SPEC_ONLY | **MOVE** to Governance Queen | Governance Queen / Janitor | Same role |
| C2 Dead Link Scanner | SPEC_ONLY | **MOVE** to Governance Queen | Governance Queen / Infrastructure Pinger | Same |
| C3 Archive Manager | SPEC_ONLY | **MOVE** to Governance Queen | Governance Queen / Janitor | Same |
| C4 Ecosystem Health | SPEC_ONLY | **MOVE** to Governance Queen | Governance Queen / Summary Publisher | Single ecosystem health score = federated summary |
| A20 Change Logger | SPEC_ONLY | **MOVE** to Governance Queen | Governance Queen / Audit Recorder | Same role |
| A21 Decision Historian | SPEC_ONLY | **MOVE** to Governance Queen | Governance Queen / Audit Recorder | Same role |
| A22 Compliance Archivist | SPEC_ONLY | **MOVE** to Governance Queen | Governance Queen / Audit Recorder | Same role |

### Net-new bees with no current equivalent

| New bee | Lives in | Why net-new |
|---|---|---|
| Bing AI Performance reader | Strategic Queen / Demand Hunter | No current code reads Bing AI Performance dashboard |
| YouTube Data API reader | Strategic Queen / Demand Hunter AND Production Queen / Customer Voice Capturer | YouTube comments + transcripts are new source |
| Concierge Queen / Sequence Engine | Concierge Queen | Lifecycle emails are scattered today; need dedicated engine |
| Concierge Queen / Inbound Handler | Concierge Queen | Customer support replies + comment replies have no current home |
| Concierge Queen / Refund/Support workflow | Concierge Queen | Currently manual |
| Concierge Queen / Chatbot Interface | Concierge Queen | Phase 2+ build |
| Apiary Strategic Queen / Niche Hunter | Apiary | Cross-niche scanning doesn't exist today |
| Apiary Strategic Queen / Niche Scorer | Apiary | New |
| Apiary Strategic Queen / Niche Router | Apiary | New |
| Apiary Strategic Queen / Clone Proposal Composer | Apiary | New |
| COLE Orchestrator / Cross-Hive Aggregator | Apiary | Different scope from current Orchestrator spec |
| COLE Orchestrator / Learning Classifier | Apiary | New methodology curator role |
| COLE Orchestrator / Pattern Detector | Apiary | New |
| COLE Orchestrator / Vanilla Steward | Apiary | New (no Vanilla template management exists) |
| COLE Orchestrator / Outcome Tracker | Apiary | New |
| Governance Queen / Summary Publisher | Governance Queen | Cross-hive federation requires this bee per locked architecture |
| Governance Queen / Secret Sentinel | Governance Queen | Secret rotation automation doesn't exist today |
| Adaptive Queen / User-Input Analyzer | Adaptive Queen | Capturing calculator input distributions as research signal is new |
| Production Queen / Source-URL Pinger | Production Queen | Continuous URL pinging is new (E7 today is hive-wide; new design is per-product) |
| Production Queen / Trust ledger display | Production Queen | Trust ledger UX is new |

### Net-new tables

| Table | Why | Owner |
|---|---|---|
| `concierge_queen_*` (decisions, handoffs, observations, sequences, customer_states) | Concierge is net-new | Concierge Queen |
| `apiary_strategic_queen_*` (handoffs, niche_candidates) | Apiary Strategic is net-new | Apiary Strategic Queen |
| `orchestrator_*` (methodology_proposals, vanilla_changelog, cross_hive_learnings, methodology_outcomes) | Orchestrator updated scope | COLE Orchestrator |
| `vanilla_template_versions` | Versioned Vanilla template | COLE Orchestrator / Vanilla Steward |
| `global_hive_summaries` | Cross-hive federation | All Governance Queens write; Orchestrator reads |
| `per_product_authority_pings` | Continuous source URL ping per product | Production Queen |
| `user_input_distributions` | Calculator input analytics | Adaptive Queen |

### Net-new infrastructure

| Item | Why |
|---|---|
| Bing Webmaster Tools dashboard read mechanism | No API — manual export OR authenticated scrape |
| YouTube Data API OAuth + quota tracking | New source |
| Vanilla template repository structure | Versioning + cloning infrastructure |
| Bee Farm dashboard view | Net-new operator UI |
| Site selector "🐝 Bee Farm" option | Operator UI |
| Event bus formalization | Currently scattered; needs unified shape |

---

## §2 — Migration phases (high-level)

Seven phases, each with entry criteria, exit criteria, and operator approval gates. Phases CAN overlap (some are parallel-safe); the order below is the suggested sequence for lowest risk.

| Phase | Name | Effort | Parallel-safe with |
|---|---|---|---|
| **Phase 0** | Pre-migration verification | 0.5-1 day | (must come first) |
| **Phase 1** | Quick wins (deprecate Reddit, rename Tactical→Production) | 0.5 day | Phase 2 |
| **Phase 2** | Strategic Queen source expansion (add Bing AI Perf + YouTube) | 2-3 days | Phase 1, Phase 3 |
| **Phase 3** | E2/E3/E4/E7 ownership re-cut (Strategic → Production) | 3-5 days | Phase 2 |
| **Phase 4** | Concierge Queen build (Phase 1 — lifecycle email only) | 4-6 days | Phase 5 |
| **Phase 5** | Distribution Queen consolidation (J/N/M/L/Q under one queen) | 2-3 days | Phase 4 |
| **Phase 6** | Apiary layer build (Bee Farm view + Orchestrator + Vanilla) | 4-6 days | (depends on Phases 1-5) |
| **Phase 7** | Apiary Strategic Queen build | 3-4 days | (depends on Phase 6) |

**Total effort estimate: 20-30 days of focused work**, much of it parallelizable between Strategy Chat and Session A. Each phase has internal operator gates to control risk.

---

## §3 — Phase 0: Pre-migration verification

**Goal:** Confirm current state matches assumptions before touching anything. If reality differs from this plan, revise plan before proceeding.

### Entry criteria
- Locked architecture document signed off (✓ Day 13)
- This migration plan reviewed by operator

### Steps

**Step 0.1 — Session A current-state audit**

Session A produces a written current-state report covering:

1. List of every bee currently firing today (with cron schedules)
2. Last successful run timestamp for each bee
3. Tables each bee writes to
4. Tables each bee reads from
5. Downstream consumers of each bee's output
6. Code file paths for each bee
7. Empirical verification: are E2a, E2b actually disabled in overlay today? (overlay.market_research_bees state)
8. Are there any cron entries in vercel.json that DON'T have corresponding bee code? (Day 13 found `/api/cron/ping` ghost — check for similar)
9. Confirm current schema matches what's documented in workflow JSX

**Step 0.2 — Operator reviews audit + reconciles with this plan**

Discrepancies between audit and this plan get resolved here. Plan updates issued if needed.

**Step 0.3 — Backup snapshot**

Operator triggers Supabase point-in-time snapshot. Establishes rollback point.

**Step 0.4 — Cost baseline measurement**

Capture current LLM API spend (last 30 days per provider) so Phase 2+ cost changes are measurable.

### Exit criteria

- Current-state audit reconciles with this plan (or plan is revised)
- Backup snapshot exists
- Cost baseline captured

### Rollback procedure

N/A (verification phase, no changes made)

### Operator approvals required

- Sign-off on current-state audit
- Trigger backup snapshot

---

## §4 — Phase 1: Quick wins

**Goal:** Low-risk, high-clarity changes that improve the system immediately without depending on later phases.

### Entry criteria
- Phase 0 complete

### Steps

**Step 1.1 — Disable E2a in overlay**

Already DELETE-disposition per §1 table. E2a has been failing daily on Google CSE expired + Reddit egress. No-op in current operation.

- Action: Edit `soverella/overlays/taxchecknow/strategic.json` → set `market_research_bees.e2a.enabled = false`
- Verification: Next E2 fire (next 05:00 UTC) skips e2a cleanly
- Audit: Write changelog entry in HK ledger

**Step 1.2 — Disable E2b in overlay (Reddit egress is the wall)**

Per locked architecture, Reddit is not on critical path. E2b currently fires 5 SERP calls + 15 fetches per day for 0 success.

- Action: Edit `soverella/overlays/taxchecknow/strategic.json` → set `market_research_bees.e2b.enabled = false`
- Verification: Next E2 fire skips e2b. Brave API daily spend drops by ~5 calls. Audit trail clean.
- Cost saving: ~$0.30/month per hive in saved Brave SERP calls

**Step 1.3 — Rename Tactical Queen code to Production Queen**

Current state: Production Queen LIVE Day 3 but code/tables still named `tactical_queen_*`. Day 4 cosmetic rename done, code rename deferred.

This is a substantial rename touching multiple files and tables. Two sub-steps:

**Step 1.3a — Code rename (Strategy Chat scopes; Session A executes)**

- Identify all files referencing `tactical_queen` (Session A: `grep -r "tactical_queen" soverella/`)
- Rename code paths: `tactical-queen/` → `production-queen/`
- Update import paths
- Commit as single atomic commit with verification: dashboard pages still render

**Step 1.3b — Table rename (deferred — risky)**

- Tables `tactical_queen_observations`, `tactical_queen_*` STAY named with `tactical_queen_*` for now
- Schema alias views can be created (`production_queen_observations` view selecting from `tactical_queen_observations`) but actual table rename deferred to a dedicated migration session
- Document in comment that table names lag the queen name by design

**Step 1.4 — Delete cron entries for deprecated bees**

Some cron entries may exist for bees being deleted (G1, G2, G4, I2, V2, B1, B2). Sweep vercel.json:

- Audit each cron entry against §1 table
- Any cron entry whose bee is **DELETE** disposition: remove from vercel.json
- Commit each removal separately for clean rollback
- Verify no missing_input errors fire in the next 24h cron cycle

**Step 1.5 — Sweep for ghost crons**

Per Day 13 finding: `/api/cron/ping` was listed in vercel.json but no route exists. Sweep for similar:

- For every cron entry in vercel.json, verify route file exists
- Remove orphaned entries
- This is general hygiene Governance Queen would do; doing it as Phase 1 quick win because it's free

### Exit criteria

- E2a, E2b disabled in overlay
- Tactical→Production code rename committed (tables aliased, deferred for actual rename)
- Deprecated bee crons removed
- Ghost crons removed
- 24h post-change: no new errors in agent_log attributable to these changes

### Rollback procedure

- All Phase 1 changes are individual commits. Revert specific commits if any issue.
- Overlay changes: flip `enabled` back to true
- Table aliases can be dropped without affecting underlying data

### Operator approvals required

- Approve overlay changes (E2a, E2b disable)
- Approve Production Queen code rename commit
- Approve each cron deletion

---

## §5 — Phase 2: Strategic Queen source expansion

**Goal:** Add Bing AI Performance and YouTube as first-class signal sources for Strategic Queen's Demand Hunter. Migrate from "ask LLMs about gaps + check authority" to "read AI engine citation receipts + read YouTube citation receipts."

This is the most architecturally significant phase. It changes WHAT Strategic Queen perceives.

### Entry criteria
- Phase 0 complete
- Phase 1 complete (deprecated bees out of the way)

### Steps

**Step 2.1 — Bing AI Performance read mechanism design micro-session**

Critical sub-decision: Bing AI Performance has no API. Options:

- **Option A:** Manual operator export (operator exports CSV weekly, uploads to system)
- **Option B:** Authenticated scrape of operator's own Bing Webmaster dashboard
- **Option C:** Hybrid — start with A, automate to B over time
- **Option D:** Wait for Microsoft API (could be months)

This is a 1-2 hour dedicated design session before any code is written. Output: written decision + implementation sketch.

**My recommendation:** Option C. Start with manual export this week (operator already has the dashboard); plan authenticated scraping for Phase 2.5.

**Step 2.2 — Bing AI Performance routine build (Strategic Queen Bee 1 / Routine A)**

If Option A or C chosen:

- New table: `bing_ai_performance_snapshots` — operator-uploaded CSV gets parsed into this table
- Operator UI: upload CSV from Strategic Queen panel
- Demand Hunter reads from this table as Routine A
- Cadence: whatever operator uploads (weekly typical)

**Step 2.3 — YouTube Data API integration**

- Apply for YouTube Data API key (free tier 10,000 quota units/day)
- Add `YOUTUBE_DATA_API_KEY` env to Vercel
- Build minimal wrapper: search videos by topic, fetch top comments
- New table: `youtube_signals` — caches search results + comment volume
- Demand Hunter Routine E reads from this

**Step 2.4 — Add YouTube routine to Demand Hunter**

For each topic in `citation_gaps` or candidate topic from other routines:
- Search YouTube for top 5 videos
- Capture: title, view count, upload date, channel
- Fetch top 20 comments per video
- Score: comment volume + recency + view velocity
- Write to `youtube_signals`

**Step 2.5 — Strategic Queen synthesis layer reads YouTube + Bing signals**

Existing synthesis reads E1+E2+E3+E4+E6+E7. Add:
- `bing_ai_performance_snapshots` join
- `youtube_signals` join

Synthesis prompt updated to include these as additional signal blocks per gap.

**Step 2.6 — Demand Scorer dimension updates**

Per the new Strategic Queen design (six score dimensions), update scoring:

- `ai_citation_volume` now includes Bing AI Performance citations as an input
- `ai_citation_velocity` uses Bing AI Performance time-series
- `personalisation_potential` (LLM heuristic) unchanged
- `authority_clarity` unchanged
- `competitor_weakness` updated to use Bing-cited competitor URLs
- `urgency` unchanged

**Step 2.7 — Strategic Queen monitor dashboard updates**

The Strategic Queen panel at `/dashboard/monitor/strategic-queen` already exists with 9 panels. Add:

- Bing AI Performance summary panel (last upload date, total citations tracked, top trending topics)
- YouTube signal panel (top videos surfaced this week, comment volume trends)
- Updated score breakdown showing 6 dimensions instead of current score components

**Step 2.8 — Shadow run period (2 weeks)**

Critical: don't immediately route new signal sources to handoffs. Run them in shadow:

- New signals captured in tables ✓
- Synthesis reads new signals ✓
- But handoff decisions still rely primarily on old signals
- Operator reviews dashboard daily to see what new signals WOULD have changed

After 2 weeks of shadow comparison, operator decides whether new signals graduate to primary inputs.

### Exit criteria

- Bing AI Performance data flowing in (manually uploaded weekly is acceptable for Phase 2)
- YouTube Data API integration live, signals flowing
- Strategic Queen synthesis reads new signals
- Demand Scorer updated to 6-dimension scoring
- Dashboard reflects new sources
- 2-week shadow comparison complete, operator approves graduating new signals

### Rollback procedure

- Disable Bing AI Performance routine in overlay
- Disable YouTube routine in overlay
- Revert synthesis prompt changes (commit)
- Existing E1/E2/E3/E4/E7 flow continues unchanged

### Operator approvals required

- Approve Option A/B/C decision for Bing AI Performance read mechanism
- Approve YouTube API key budget
- Approve shadow run period
- Approve graduation of new signals after shadow period

### Cost impact

- Bing AI Performance: $0 (manual upload) or developer time (scraping)
- YouTube Data API: $0 (free quota sufficient for hive-scale)
- Net Strategic Queen monthly cost change: +$0 to +$10/month

---

## §6 — Phase 3: E2/E3/E4/E7 ownership re-cut

**Goal:** Move E2/E3/E4/E7 from Strategic Queen's fan-out daily fire to Production Queen's per-build scoped execution. Per locked architecture: deep research is per-product, not per-hive.

This is structurally significant but operationally low-risk — bees keep doing the same work, just under different ownership and triggering.

### Entry criteria
- Phase 0 complete
- Phase 1 complete
- Phase 2 in progress or complete (Strategic Queen has alternative signal sources during/after this transition)

### Steps

**Step 3.1 — Define Production Queen's per-build research execution model**

Currently E2/E3/E4/E7 fire on daily cron across ALL gaps. New behavior: fire when Production Queen has an active build assignment.

Two model options:

- **Model A (cleanest):** Bees only fire when Production Queen explicitly triggers them per build. Daily cron fans-out disabled.
- **Model B (transitional):** Bees keep daily cron AND respond to per-build triggers. Strategic Queen still gets daily signals; Production Queen gets per-build deep dives.

Model A is target. Model B is a compatibility step during migration.

**Recommendation:** Model B for migration window, transition to Model A once Strategic Queen reliably gets demand signals from Bing/Gemini/YouTube (Phase 2 complete).

**Step 3.2 — Production Queen build pipeline scaffolding**

Build the per-assignment orchestration:

- When Production Queen receives an approved handoff from Strategic Queen, she triggers her hive of bees scoped to that one topic
- New table: `production_queen_assignments` — one row per active build
- Each E-bee picks up assignments from this table when scoped to per-build mode
- E-bee outputs continue to write to existing tables but include `production_assignment_id` for traceability

**Step 3.3 — E2 Customer Voice Capturer transformation**

E2 today: fires daily across all gaps, writes `market_research_signals`.

E2 tomorrow: fires per assignment scoped to one topic, writes `market_research_signals` with `production_assignment_id` set.

Transitional (Model B): both. Daily cron continues; per-assignment also writes scoped rows.

**Step 3.4 — E3 Customer Psychologist transformation**

Same pattern as E2. Daily fan-out + per-assignment scoped.

**Step 3.5 — E4 Competitor Monitor transformation**

Same pattern. Note E4 currently has 23% success rate (per technical-design page) — fix is HK #92/93/94 territory, separate from this migration but should be addressed before Production Queen depends on it.

**Step 3.6 — E7 Truth-Sync transformation**

E7 transforms most significantly. Currently watches all authority sources daily. New design:

- **Build-time mode (in Production Queen):** When Production Queen builds a product, E7-as-Authority-Verifier captures snapshot of authority URLs cited by the product
- **Continuous mode (Production Queen / Source-URL Pinger):** Pings each product's captured authority URLs on a schedule (monthly default)
- **Detection:** When ping detects diff against last-known content, emit event → Production Queen revises affected product

The current daily ATO/HMRC RSS scan continues as transitional behavior. New per-product ping system builds alongside.

**Step 3.7 — Strategic Queen synthesis adjustment**

Strategic Queen needs to operate without rich E2/E3/E4 signal once Phase 2 sources are mature:

- Synthesis reads Bing/Gemini/YouTube primarily
- E2/E3/E4 daily fan-out signals available but de-prioritized
- Decay logic accounts for the changed signal flow

**Step 3.8 — Operator gate verification**

After 2 weeks of Model B operation, operator reviews:

- Are Strategic Queen handoffs still high quality without E2/E3/E4 as primary inputs?
- Are Production Queen per-build deep dives producing better output than the old fan-out?
- If both yes, proceed to Model A

**Step 3.9 — Transition to Model A**

- Disable E2/E3/E4 daily cron (set enabled: false in overlay)
- Production Queen per-assignment mode becomes the only fire path
- E7 daily fan-out replaced by per-product pinger
- Strategic Queen relies fully on Bing/Gemini/YouTube + E6 velocity + Priority Decay

### Exit criteria

- E2/E3/E4/E7 firing on per-build basis under Production Queen
- Strategic Queen producing handoffs from Bing/Gemini/YouTube as primary signals
- Per-product authority pings replacing E7 fan-out
- Cost shifted: less daily LLM spend, more concentrated per-build spend

### Rollback procedure

- Re-enable daily cron for E2/E3/E4/E7 in overlay (Model A → Model B)
- Strategic Queen synthesis reads both signal sets (already coded during transition)
- Per-build mode can stay enabled or be disabled depending on root cause of rollback

### Operator approvals required

- Approve Model A vs Model B migration sequence
- Approve transition from Model B to Model A after 2-week observation
- Approve per-product authority ping schema and cadence defaults

### Cost impact

- Net cost likely **decreases**: less daily fan-out, more concentrated per-build spend
- Per-build cost rises modestly (Production Queen does more work per assignment)
- Per-day baseline cost drops significantly

---

## §7 — Phase 4: Concierge Queen build

**Goal:** Build Concierge Queen Phase 0-1 (lifecycle email sequences only). Absorb scattered G7 email family + I3 re-engagement into one queen.

This is the most net-new work in the migration but operates in a domain (customer email) where the β engine already exists Day 2.

### Entry criteria
- Phase 0 complete
- β save-box conversion engine still operating cleanly (already LIVE Day 2)
- Production Queen owns transactional emails (post-Stripe receipt, immediate delivery) — confirmed in Phase 1

### Steps

**Step 4.1 — Concierge Queen schema**

Create new tables per Concierge Queen design doc:

- `concierge_queen_decisions`
- `concierge_queen_handoffs`
- `concierge_queen_observations`
- `concierge_sequences` (lifecycle sequence definitions)
- `customer_states` (per-customer journey state)
- Existing `email_queue`, `email_log`, `decision_sessions` referenced

**Step 4.2 — Sequence Engine bee**

Currently scattered: T2 in api/leads, nurture in cron/send-emails, re-engagement in cron/re-engagement.

New design: one Sequence Engine bee that:
- Reads customer events (purchase, save, dormancy)
- Looks up applicable sequence definitions
- Schedules sends to `email_queue`

Migration:
- Build Sequence Engine
- Migrate T2 + nurture d3/d7/d14 sequence definitions into `concierge_sequences`
- Migrate re-engagement sequence
- Existing crons keep firing during transition; Sequence Engine writes alongside; verify output matches before cutover

**Step 4.3 — Event Router bee**

Currently customer events fire ad-hoc (save-box → /api/leads, Stripe webhook → queueReminders, etc.).

New design: Event Router consolidates all customer event reception:
- Save-box save event
- Calculator completion (without save)
- Purchase event
- Refund event
- Dormancy event (no activity for N days)

Each event routes to appropriate sequence(s).

**Step 4.4 — Message Composer bee**

Currently message templates live in code (`lib/email-templates/*`).

New design: Message Composer reads sequence definition + customer state + product persona, composes message:
- Pre-purchase: data-only personalisation (no name)
- Post-purchase: full personalisation (name from Stripe)
- Voice: matches the persona associated with the customer's product

**Step 4.5 — Delivery Engine bee**

Existing Resend integration formalized as a bee. Tracks deliverability, handles retries, captures bounces.

**Step 4.6 — Refund/Support workflow**

Phase 1: minimal stub. Refund requests go to operator alert; operator handles manually. Concierge Queen logs the event.

Phase 2+: automate refund processing, support ticket triage.

**Step 4.7 — Deliverability Pinger bee**

Pings Resend metrics. Watches:
- Bounce rate
- Spam complaint rate
- Delivery rate
- If any threshold breached, alert operator

**Step 4.8 — Migrate G7 family to Concierge Queen**

- G7-T0 (free-calc capture confirmation): already lives in /api/leads → migrate to Concierge Sequence Engine
- G7-T2 (purchase confirmation): currently in Stripe webhook → keep transactional portion in Production Queen, lifecycle portion in Concierge
- G7-T3 day-3 reminder: into Concierge Sequence Engine
- G7-Upsell $67→$147: into Concierge
- G7-T5 law-change panic: into Concierge (triggered by Production Queen's authority change events)
- Nurture d3/d7/d14: into Concierge
- Re-engagement: I3 retired, behavior absorbed into Concierge

**Step 4.9 — Concierge Queen monitor dashboard**

New page at `/dashboard/monitor/concierge-queen`:

- Heartbeat (last fired, sequences active, customers in sequence)
- Email delivery health (bounce rate, complaint rate)
- Refund/support queue (Phase 1: alert list)
- Active customer journeys
- Settings (per-sequence config)

**Step 4.10 — Phase 2+ deferred work**

These are explicit deferrals:
- Chatbot Interface (Phase 2+)
- Comment replies on YouTube/social (Phase 3+)
- Inbound support email triage (Phase 4+)
- Proactive outreach (Phase 5+)

### Exit criteria

- Concierge Queen LIVE on taxchecknow
- All lifecycle emails (non-transactional) flowing through Concierge
- β save-box engine continues operating (now via Concierge Sequence Engine, not standalone code)
- Operator dashboard for Concierge functional
- 7-day no-regression period: email volume, delivery rates, conversion match pre-migration baseline

### Rollback procedure

- Concierge Sequence Engine has a disable flag
- Original /api/cron/send-emails and /api/cron/re-engagement remain in code (deactivated but not deleted) until 30-day no-regression confirmed
- Operator can flip back if regression detected

### Operator approvals required

- Approve Concierge Queen schema
- Approve Phase 1 scope (lifecycle email only; chatbot deferred)
- Approve cutover from old crons to Concierge Sequence Engine
- Approve final retirement of old crons after 30-day no-regression

### Cost impact

- Net cost change: ~$0 (same Resend volume, marginal LLM cost for Message Composer ≈ $10/month)

---

## §8 — Phase 5: Distribution Queen consolidation

**Goal:** Move all platform-specific bees (J/N/M/L/Q stations) under Distribution Queen as channel adapters. Apply Row-of-Bees pattern at Distribution Queen scope.

### Entry criteria
- Phase 0 complete
- Phase 1 complete (Tactical→Production rename done; reduces confusion during J-station migration)

### Steps

**Step 5.1 — Distribution Queen channel adapter framework**

Per Distribution Queen design doc, define the Channel Adapter shape:

- Each adapter takes a finished product as input
- Each adapter outputs channel-specific assets (video script, post text, carousel, etc.)
- Each adapter writes to a shared `distribution_queen_publications` table with `channel` column

This is the Row-of-Bees pattern applied to Distribution Queen.

**Step 5.2 — Migrate J station to LinkedIn Channel Adapter**

- J1, J1.5, J2, J3, J3.5, J3.6 all bundle into LinkedIn Channel Adapter
- J4 LinkedIn Manager merges into Distribution Queen's Publisher (quality gate)
- J5 LinkedIn Publisher merges into Distribution Queen's Publisher (channel-specific dispatch)
- J6 LinkedIn Engagement MOVES to Concierge Queen (per §1 table)

Migration approach:
- Keep existing J station code running
- Build LinkedIn Channel Adapter as wrapper that orchestrates J1.5/J2/J3/J3.5/J3.6 in correct sequence
- Cut over Distribution Queen to read from new adapter
- Old direct-cron entries deprecated

**Step 5.3 — Migrate N station to Short-Form Channel Adapter (TikTok side)**

Block 2 is currently 17% complete on N station. Pause Block 2 for migration; resume after:

- N1-N5 bundle into TikTok variant of Short-Form Channel Adapter
- Same pattern as J station migration

**Step 5.4 — Future stations**

M (Instagram), L (YouTube), Q (X) — design Channel Adapter shapes per Distribution Queen design doc. Don't build until needed; pattern is set so they slot in cleanly.

**Step 5.5 — Asset Liveness Pinger bee**

New bee: pings each published asset on a schedule:
- LinkedIn post still live?
- TikTok video still published?
- YouTube video status?
- If diff (asset removed, channel API changed, embed broken), emit event → Distribution Queen revises or alerts

**Step 5.6 — Revision Repurposer bee**

New bee: when Production Queen revises a product (per Source-URL Pinger detection), Distribution Queen's Revision Repurposer:
- Re-reads the updated product
- Updates affected published assets where possible (e.g., YouTube video description, LinkedIn post comment)
- Where assets can't be updated (e.g., recorded YouTube video), flags for re-record
- Writes to `distribution_queen_observations`

**Step 5.7 — Distribution Queen monitor dashboard updates**

Existing dashboard at `/dashboard/monitor/distribution-queen` has 11 panels. Add:
- Channel-adapter-level health (one row per platform)
- Asset Liveness summary
- Revision Repurposer queue

### Exit criteria

- Distribution Queen operates with Channel Adapter framework
- LinkedIn publishing flows through Distribution Queen's adapter
- TikTok publishing flows through adapter (when Block 2 resumes)
- Asset Liveness Pinger live
- Revision Repurposer wired to Production Queen's revision events

### Rollback procedure

- Old direct cron entries (g5-story-writer, etc. — already deleted in Day 13 but conceptually similar) — re-enable for individual J bees if adapter regresses
- Distribution Queen reads from old paths during transition (parallel run)

### Operator approvals required

- Approve Channel Adapter framework design
- Approve LinkedIn cutover
- Approve Block 2 resume timing
- Approve Asset Liveness Pinger ping cadence

### Cost impact

- Negligible — same publishing volume, marginal coordination overhead

---

## §9 — Phase 6: Apiary layer build (Bee Farm)

**Goal:** Build the Bee Farm view containing COLE Orchestrator + Vanilla template + Clone tool + Active Hives summary.

At single-hive state (current — only Tax Hive), much of this is scaffolding. Real value materializes with Hive #2.

### Entry criteria
- Phase 0 complete
- Phase 1 complete (renames done)
- Phase 5 complete (consolidation gives a clean per-hive shape to copy from)

### Steps

**Step 6.1 — Bee Farm option in site selector**

Update site selector top-right dropdown to include:
- 🐝 Bee Farm (top option)
- ─── separator ───
- taxchecknow (and future hives)

Path: `/dashboard/monitor/apiary` or `/dashboard/apiary`

**Step 6.2 — COLE Orchestrator schema**

Per Orchestrator design doc:

- `methodology_proposals`
- `cross_hive_learnings`
- `methodology_outcomes`
- `vanilla_template_versions`
- `global_hive_summaries` (already referenced in Phase 4 / Governance Summary Publisher)

**Step 6.3 — Cross-Hive Aggregator bee**

Reads `global_hive_summaries`, composes the cross-hive view. With only 1 hive currently, this is a 1-row report. Build the shape that scales to N hives.

**Step 6.4 — Vanilla template repository**

Create the Vanilla template structure:

- Locate Vanilla in repo (e.g., `soverella/vanilla/`)
- Snapshot current Tax Hive structure as v3.0 of Vanilla (the version Tax Hive was effectively cloned from)
- Document Vanilla file structure: schemas/, queens/, methodology_constants.yml, etc.

**Step 6.5 — Vanilla Steward bee**

Owns Vanilla versioning. Initial behavior:
- Display current Vanilla version
- Show diff between Vanilla and Tax Hive
- Manual edit interface for operator to update Vanilla
- Version bump workflow

**Step 6.6 — Learning Classifier + Pattern Detector bees**

With only 1 hive, these are mostly idle. Build the shape:
- Subscribe to Adaptive Queen's learning events from Tax Hive
- For each learning: linguistic classification (LLM call)
- Pattern Detector: embed + cluster (mostly no-op with 1 hive)

Both bees become valuable at Hive #2+.

**Step 6.7 — Methodology Outcome Tracker bee**

Same: mostly idle with 1 hive. Build the shape; tracking begins when methodology updates are applied to new hives.

**Step 6.8 — Apiary dashboard view**

New page at `/dashboard/apiary`:

- CO·LE health rollup (currently = Tax Hive's CO·LE)
- Total ARR, cost, profit (currently = Tax Hive's)
- Active hives card (Tax Hive only currently)
- Methodology proposals panel (likely empty with 1 hive)
- Vanilla template panel
- Clone New Hive button (Phase 7 dependency — see §10)
- Apiary Strategic Queen placeholder (Phase 7 build)

**Step 6.9 — Governance Queen Summary Publisher bee build**

This bee was net-new per §1. Required for Apiary to receive hive summaries.

Implementation:
- Reads Tax Hive's metrics
- Composes the `global_hive_summaries` row shape
- Upserts to `global_hive_summaries` every 5 minutes

### Exit criteria

- Bee Farm option in site selector functional
- Apiary dashboard renders (mostly placeholder content with 1 hive)
- Vanilla template versioned and inspectable
- Tax Hive's Governance Queen writes summary to global_hive_summaries
- Orchestrator-related bees registered and idle until hive #2

### Rollback procedure

- Bee Farm option in site selector can be hidden
- Apiary tables can stay (no-op until used)
- Vanilla template repo stays (no harm)

### Operator approvals required

- Approve Vanilla template snapshot of current Tax Hive
- Approve Bee Farm site selector option
- Approve Apiary dashboard scope (Phase 1 placeholder)

### Cost impact

- ~$0/month with 1 hive
- Scales linearly with # of hives

---

## §10 — Phase 7: Apiary Strategic Queen build

**Goal:** Build the cross-niche scout that recommends new hives.

### Entry criteria
- Phase 6 complete (Apiary infrastructure in place)
- Operator has identified at least one potential second niche (informally — to validate Apiary Strategic Queen's output)

### Steps

**Step 7.1 — Apiary Strategic Queen schema**

- `apiary_strategic_queen_handoffs`
- `niche_candidates`
- `niche_exploration_queue` (operator hypothesis input)

**Step 7.2 — Niche Hunter bee**

Build the scanning routines:

- Routine A: broad Gemini grounding prompts at niche scale
- Routine B: cross-hive learning consumption (will mostly be empty with 1 hive)
- Routine C: operator hypothesis queue
- Routine D: adjacent niche detection (looks at Tax Hive's domain, looks adjacent)
- Routine E: market signal observation (deferred to Phase 2)

**Step 7.3 — Niche Scorer bee**

Build the 7-dimension scorer per Apiary Strategic Queen design doc:
- citation_gap_density
- regulatory_stability
- personalisation_density
- authority_clarity
- market_size_signal
- competitor_landscape
- cost_to_clone

**Step 7.4 — Niche Router bee**

Decision logic: CLONE_NEW_HIVE / EXPAND_EXISTING_HIVE / IGNORE.

**Step 7.5 — Clone Proposal Composer bee**

Generates the full clone proposal for operator approval.

**Step 7.6 — Clone New Hive workflow**

This is a substantial workflow (deferred item #2 in locked architecture). Required at this phase:

- Operator UI: "Clone New Hive" button → form with proposed domain, persona seeds, jurisdictions, etc.
- Behind the scenes: clone Vanilla v[current] into new hive instance
- New hive gets its own Supabase project (or schema)
- New hive gets its own Vercel project
- New hive gets seed handoffs from Niche Hunter's evidence
- New hive's Strategic Queen begins firing on its own schedule
- Audit trail of clone operation

**Step 7.7 — Operator hypothesis injection UI**

In Apiary dashboard: "Add hypothesis" button. Operator types: "Look at UK property tax." Goes to `niche_exploration_queue`. Niche Hunter prioritizes in next scan.

**Step 7.8 — Apiary Strategic Queen monitor dashboard**

Per Apiary Strategic Queen design doc §10:
- Heartbeat
- Pending hive opportunities
- Watching (long-tail candidates)
- Operator hypothesis queue
- Recent decisions log

### Exit criteria

- Apiary Strategic Queen LIVE
- Niche Hunter scanning weekly
- At least one niche scored and surfaced to operator (real-world test)
- Operator can inject hypotheses
- Clone New Hive workflow functional (smoke-tested with a dummy clone in staging, NOT a real production new hive yet)

### Rollback procedure

- Disable Apiary Strategic Queen cron
- Pending niche candidates stay in tables (no harm)
- Clone New Hive button can be hidden

### Operator approvals required

- Approve Apiary Strategic Queen prompt set (broad niche-scanning prompts)
- Approve LLM cost budget (~$40-50/month)
- Approve first real clone proposal (when one emerges)
- Approve actually executing a clone (Hive #2 launch is a strategic decision separate from this phase)

### Cost impact

- ~$40-50/month for Apiary Strategic Queen operation

---

## §11 — Post-migration verification

After all 7 phases complete, run end-to-end verification:

### Verification checks

**Check V1 — Each queen passes the TrustMRR pub test**
- Strategic Queen: produces handoffs that match her standalone-product pitch
- Production Queen: builds products end-to-end including pings
- Distribution Queen: amplifies cleanly across channels
- Concierge Queen: handles customer lifecycle
- Adaptive Queen: produces feedback cards
- Governance Queen: renders dashboard, alerts, costs
- Apiary Strategic Queen: surfaces niche opportunities
- COLE Orchestrator: aggregates cross-hive (or stubs cleanly with 1 hive)

**Check V2 — Constitutional principles preserved**

Run through the seven principles from the architecture document:
1. Whoever made it owns it ✓ verified by walking through ownership in current code
2. Each queen self-monitors via pings ✓ verify ping cadences match design
3. Flat hive, no AI middle-management ✓ verify no AI gating decisions inside any hive
4. Each queen passes TrustMRR pub test ✓ (V1 above)
5. Per-hive isolation, federated visibility ✓ verify global_hive_summaries flow
6. Domain expertise in-hive, methodology cross-hive ✓ verify Vanilla template + cross_hive_learnings flow
7. Design backwards from outcome ✓ (architectural, not runtime — confirm via code review)

**Check V3 — Cost and performance baseline**

Compare to Phase 0 cost baseline:
- Per-hive monthly operational cost (expected ~$150-250 per the locked architecture)
- Strategic Queen daily cost
- Production Queen per-build cost
- Distribution Queen per-product cost
- Concierge Queen monthly cost
- Adaptive Queen monthly cost
- Governance Queen monthly cost
- Apiary Strategic Queen monthly cost

**Check V4 — No regressions**

- Tax Hive products still generating same revenue
- Email delivery rates unchanged
- Calculator function unchanged
- AI citations to taxchecknow.com still flowing
- Site uptime unchanged

**Check V5 — New capabilities verified**

- Bing AI Performance signals influencing Strategic Queen decisions
- YouTube signals captured
- Concierge sequences firing correctly
- Apiary dashboard renders
- Vanilla template inspectable
- Operator can inject niche hypothesis

### Final operator sign-off

When all verifications pass, locked architecture is empirically validated. Migration complete.

---

## §12 — Risks and mitigations

### Risk 1: Bing AI Performance read mechanism is hand-wavy

Per Strategic Queen design critique. Risk: Phase 2 stalls if Bing AI Performance read mechanism doesn't work.

**Mitigation:** Phase 2 includes a dedicated micro-design session (Step 2.1) to resolve this before any code is written. If no good mechanism, Strategic Queen still has Gemini grounding + ChatGPT + Perplexity + YouTube as primary sources — Bing is additive, not blocking.

### Risk 2: E2/E3/E4/E7 re-cut causes Strategic Queen signal quality drop

Risk: Strategic Queen's synthesis was empirically proven on rich E2/E3/E4 inputs. Stripping these without strong replacement could degrade decisions.

**Mitigation:** Phase 3 uses Model B (parallel run) for 2-week observation before final transition. If quality drops, can stay on Model B indefinitely or rebuild Phase 2 sources.

### Risk 3: Concierge Queen migration regresses email delivery

Risk: β save-box engine is currently working. Migrating to Concierge Sequence Engine could introduce bugs.

**Mitigation:** Phase 4 uses parallel run + cutover pattern. Old crons stay deactivated (not deleted) for 30-day no-regression observation. Rollback is one config flag.

### Risk 4: Vanilla template snapshot doesn't match reality

Risk: Snapshotting current Tax Hive as v3.0 of Vanilla assumes Tax Hive is the canonical "good state" — but Tax Hive has accumulated tech debt + V1 LIGHT compromises.

**Mitigation:** Vanilla v3.0 explicitly captures CURRENT Tax Hive state including tech debt. Subsequent versions can clean up. Don't try to fix Tax Hive into Vanilla in one step.

### Risk 5: Operator approval fatigue across 7 phases

Risk: Each phase requires multiple operator approvals. At 20-30 approvals over 20-30 days, operator slows down.

**Mitigation:** Each phase has a small number of decisive approvals at gates, not constant micro-approvals. Day-to-day execution is autonomous within phase scope.

### Risk 6: Migration takes longer than estimated

Risk: 20-30 days is an estimate. Real complexity may double it.

**Mitigation:** Migration is paused at any phase boundary. System remains functional in V1 LIGHT state if migration stalls. There is no "broken intermediate state" that must be reached quickly.

### Risk 7: Code rename (Tactical → Production) breaks something downstream

Risk: References to `tactical_queen_*` may exist in places the audit didn't catch.

**Mitigation:** Phase 1.3 splits code rename from table rename. Tables alias for compatibility. Search/replace is mechanical and reversible.

---

## §13 — What this plan does NOT cover

Honest list of things deferred or outside scope:

1. **The actual Bing AI Performance scraping mechanism.** Phase 2 includes a dedicated design session for this; the answer is unknown until that session.

2. **Clone New Hive end-to-end workflow at production grade.** Phase 7 builds the basic version. Full production-grade workflow (DNS, Vercel projects, Stripe products, social accounts) is its own multi-week effort, deferred per locked architecture §10 item #2.

3. **Per-queen panel UX redesign.** Existing monitor dashboards work. They could be redesigned per the locked architecture's principles but that's UX polish, not migration.

4. **Event bus formal implementation.** Currently implicit through tables. Formalizing to a true event bus (with retry, dead-letter, ordering guarantees) is its own design session.

5. **Trust ledger UX on customer-facing pages.** Production Queen design doc mentions this; rendering it on the live site is deferred.

6. **User-input distributions analysis.** Adaptive Queen design includes User-Input Analyzer bee; the analytics queries + dashboard panels are deferred.

7. **YouTube content production for distribution.** Phase 5 covers consumption (reading YouTube as signal); producing YouTube content is Block 3B/3D (existing future work).

8. **Pricing tier automation.** Currently per-product pricing is manual; auto-tiering based on demand signal strength is future.

9. **Methodology backporting to live hives.** Vanilla updates only apply to new clones initially. Backporting to active hives is deferred (high risk).

10. **The locked architecture's "Empress is you" UX principles.** Operator dashboard improvements (single morning brief, etc.) are gradual enhancements, not migration phases.

---

## §14 — Suggested execution rhythm

For a single operator working with Strategy Chat and Session A:

**Daily rhythm:**
- Morning: review Strategy Chat plan for the day, approve next steps
- Session A executes against the plan
- Evening: review Session A's commits + smoke tests, approve or rollback

**Phase boundaries (every 3-5 days):**
- Operator runs phase exit criteria checks
- Approve transition to next phase
- Document any lessons learned

**Migration ledger:**
- Create `WALKING-LEDGER-MIGRATION.md` similar to Day 12 walking ledger
- Each phase has a section
- Each commit/decision/approval is logged with date + commit hash
- Append-only

**Pause conditions:**
- Any phase exit criteria fails: pause until resolved
- Any rollback triggered: pause for 24h, investigate before resuming
- Operator unavailable: phases pause cleanly; no daemon needs constant operator attention to keep running

---

## §15 — Closing

This migration is real work but it's bounded, incremental, and reversible at every step. The locked Day 13 architecture isn't a rebuild — it's a re-cut of what already exists, plus the addition of Concierge and Apiary as net-new layers.

The biggest architectural shift is Phase 2 (source strategy) and Phase 3 (E2/E3/E4/E7 ownership). Both have explicit shadow-run / parallel-run periods before cutover. Worst case, system stays in transitional Model B indefinitely while being studied.

The constitutional principle that anchors the whole migration:

> **"Each queen passes the TrustMRR pub test as a standalone product."**

Test every migration step against this. If a change makes a queen less defensible as a standalone product, the change is wrong.

**End of migration plan.**

---

**Next document to write (when ready):** Migration execution guide for Session A. Maps every step in this plan to specific file paths, commit conventions, smoke test commands, and verification queries. That's the implementation companion to this strategic plan.
