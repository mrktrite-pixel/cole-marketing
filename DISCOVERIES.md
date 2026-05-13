

# COLE Discovery Log

Single canonical file. Newest entries at top. Each entry dated. Appended updates within an entry are dated inline.

**File convention:** This file lives at `cole-marketing/DISCOVERIES.md`. Always overwrite. Never date-prefix the filename. Dates live inside entries, not in the filename.

---

## Index

- **2026-05-13** — Dashboard Architecture: Decisions, Not Data
- **2026-05-13** — COLE as Managed Service: Operator vs Client Modes
- **2026-05-13** — [E5 reframed: "AI Citation Tracking" → "Retrieval Intelligence"](#2026-05-13--e5-reframed-ai-citation-tracking--retrieval-intelligence)
- **2026-05-13** — [COLE Knowledge Propagation: Self-Governing, Continuously Learning Hives](#2026-05-13--cole-knowledge-propagation-self-governing-continuously-learning-hives)
- _(Earlier entries to be migrated here from any prior date-prefixed files)_

---

## 2026-05-13 — Dashboard Architecture: Decisions, Not Data

**Date created:** 2026-05-13 (Day 10, late afternoon AWST, during E1 UI retrofit pre-audit review)
**Context:** Operator paused E1 UI retrofit ship to clarify daily workflow. Surfaced architectural shift in what dashboards are FOR.
**Trigger:** Operator: "why will I be on the taxchecknow strategic queen page? what do I need to see or approve or disapprove, is it all there and easy to read?" → followed by: "37 today because they want the production queen to urgently build more products or approve to not do it but the production queen is not ready" → followed by: "these need to show on the dashboard for a decision and be easy to understand and approve or reject" → followed by: "health checks, costs, drill-downs is secondary support... these need to be fed to the Queen in the audit report we spoke about to learn and fix, I don't care about it on the dashboard" → confirmed by: "down the road add a reports tab... for day to day you nailed the dashboard, anything needing actual approvals pings in the approvals I setup a task everyday and go through that as a everyday task"
**Status:** Foundational architectural principle — affects every queen's UI design, every bee's output routing, every operator-facing surface

### What we realized

The Strategic Queen dashboard had been designed as a SaaS analytics page — surface every metric, give the operator full visibility into bee data. Dashboards showed Health 37/100, cost breakdowns, engine disagreement panels, drill-down detail pages. ~745 LOC of E1 UI retrofit was pre-audited around this model.

Operator pushed back: **this is the wrong UI mission.**

The right UI mission for operator daily use is:

> **"Decisions awaiting your approval. Each one: what, why, evidence, approve/reject."**

That's it. Everything else (health checks, costs, drill-downs, charts) is **queen-internal cognition** that feeds Layer 2-3 audit reports, NOT operator daily surfaces.

### Why this matters

Without this clarity:
- Operator opens Strategic Queen page and sees Health 37/100 with no actionable meaning
- Builds dashboards that look impressive but don't serve operator workflow
- Operator wastes time interpreting metrics instead of making decisions
- Doesn't scale to 100+ sites (browsing queen data daily across N sites is impossible)

With this clarity:
- Operator opens Approvals page, sees N decision cards, processes them
- Queens internalize their own health/cost/error data, self-correct
- Monthly reports tab serves client-facing accountability
- COLE scales because operator only handles decisions and escalations, not data review

### The three operator surfaces

| Surface | Purpose | Cadence | What it shows |
|---|---|---|---|
| `/dashboard/approvals` | Operator decisions | DAILY (5-10 min ritual) | Decision cards. Approve/Reject buttons. "Nothing to approve right now" when empty. |
| `/dashboard/monitor/*` | Queen status | Occasional (as needed) | "Queen is alive and working" OR "Queen needs help" — binary state, NOT fractional health |
| `/dashboard/reports` | Monthly accountability | Monthly (operator pulls; client review) | Hive monthly reports per site. Full breakdown of what worked / didn't. Client-facing capable. |

**Operator only required-attention surface is Approvals.** Monitor and Reports are pull-based, not push-based.

### What this fundamentally changes

**Strategic Queen page restructure:**
- Health 37/100 with "(3 inputs · partial)" → REMOVED from daily surface
- Engine disagreement panels → REMOVED (feeds queen audit instead)
- Per-engine cost trend → REMOVED (feeds queen audit instead)
- Gap drill-down detail → REMOVED from daily flow (drill-down exists only when investigating)
- Page becomes minimal "queen status" with click-through to detail if needed

**Approvals page becomes central operator experience:**
- Currently shows "Nothing to approve right now. Bees are running. You'll be notified when something needs a decision."
- That UI pattern is correct — just needs bees to actually emit gated decisions
- Daily operator ritual: open approvals, process cards, close

**Queens audit themselves (Knowledge Propagation Layer 2-3):**
- Bee_run_metrics + costs + errors feed queen_monthly_lessons synthesis
- Queens identify their own degradation, recommend their own fixes
- Most of this is queen-internal — operator doesn't see it
- Major issues escalate to CAB via Layer 5 (operator approves architectural changes)

**Reports tab serves client-facing accountability:**
- Day N+ build (Phase 3-4 timeframe)
- Reads hive_monthly_reports (Layer 3)
- "How is taxchecknow doing this month" — costs, performance, gaps built, AI citations earned
- Critical for managed-service business model (see separate COLE as Managed Service Discovery Log entry)

### Knowledge Propagation Layer audience clarification

Each layer's UI surface is now clear:

| Layer | Audience | Operator UI surface |
|---|---|---|
| Layer 1 — bee_run_metrics | Queens (machine reads) | None — internal only |
| Layer 2 — queen_monthly_lessons | Queens themselves (self-correction) | None — internal only |
| Layer 3 — hive_monthly_reports | Operator + clients | `/dashboard/reports` tab (Day N+) |
| Layer 4 — cole_orchestrator_log | COLE Orchestrator (machine) | Surfaces phase-upgrade triggers to CAB |
| Layer 5 — CAB integration | Operator (architectural decisions) | Surfaces via approvals page as CAB decisions |

**Operator only interacts at Layers 3 and 5.** Layers 1-2 are queen-internal cognition. Layer 4 is COLE-internal.

### The operator-bee contract (pending_approvals)

For decisions to surface to operator, bees write proposals to a `pending_approvals` table. Schema rough:

```
id, site, decision_type, proposed_by_bee, proposed_by_queen, run_id,
target_entity_type, target_entity_id (FK to whatever entity),
evidence_payload jsonb, reasoning_text, confidence_score,
status (pending | approved | rejected | expired),
expires_at, resolved_at, resolved_by, created_at
```

**Decision types include:**
- `promote_gap_to_active` — E1 proposes promoting candidate topic to active gap
- `mark_gap_no_go` — bee proposes killing a gap as low-opportunity
- `authority_change_cascade` — E7 proposes cascading authority change to dependent tables
- `new_product_build_proposal` — Production Queen proposes building product for a gap
- `content_publish_proposal` — Distribution Queen proposes publishing content
- `bee_prompt_change` — meta: bee proposes changing its own prompt based on accuracy data
- `cost_threshold_exceeded` — alert/decision required
- `cab_phase_upgrade_recommendation` — system surfaces phase upgrade for operator architectural decision

**Approval consequences:** approving fires downstream cron / state update. Rejecting marks as expired/rejected with reasoning. Expired (no operator action within N days) defaults per decision type.

### Autonomy graduation framework

Linked to this dashboard architecture: bees graduate from "propose for approval" to "auto-approve" as data accumulates evidence of reliability. Phases:

- **Phase 2 (today):** Operator approves every gated decision (100% manual gate)
- **Phase 3 (Day 14-30):** Bees report confidence + reasoning, operator approves with recommendations visible
- **Phase 4 (Day 30-60):** Production Queen builds products, performance data accumulates
- **Phase 5 (Day 60-90):** First auto-approve tier emerges. Decisions matching learned high-confidence patterns auto-execute. Below threshold: queue for operator
- **Phase 6+ (Day 90+):** Most gates auto-approve. Operator handles edge cases, new categories, architectural decisions only

**The autonomy is earned through data, not designed up-front.** Until then, pending_approvals is the central contract.

### What this changes about current build

**Halt Session A's E1 UI retrofit immediately.** The 745 LOC pre-audit was wrong architectural target.

**Discard scope:**
- EngineCostTrend panel on main page
- Classification badge on TopOpportunities rows (engine disagreement signal becomes evidence inside decision cards instead)
- Per-engine cost trend display
- Gap detail drill-down /gap/[id] page (operator doesn't browse gaps; if needed, comes via approval card)

**New scope:**
- `pending_approvals` table + write/read API
- Approvals page renders pending_approvals as decision cards
- E1 (and other Strategic Queen bees) refactored to write proposals to pending_approvals instead of auto-promoting gaps
- Strategic Queen monitor page simplified: removes Health 37/100 fractional display, shows "queen alive" status only

### Cross-doc impact

- `ARCHITECTURE.md` → Major section rewrite on "Operator Surfaces" — replace any "show all data" dashboard descriptions with this decisions/monitor/reports framing
- `STRATEGIC-QUEEN-PHASE-2.md` → Section on UI removed or rewritten to match decision-card pattern; Step 12 acceptance criteria rewrites
- `STRATEGIC-QUEEN-PHASE-3.md` → Knowledge Propagation Layer build explicitly includes monthly reports generation for Reports tab
- `HOUSEKEEPING.md` → Items #74-77 captured for follow-up
- `DASHBOARD-BACKLOG.md` → Significant rewrite — much shorter now since most "wire bee data to UI" items disappear

### Housekeeping items added Day 10 (Dashboard Architecture specific)

- **#74** — Every queen page UI must answer ONE primary operator question at a glance. Drill-down detail pages exist for "tell me more." Don't build "show all data" dashboards. Foundational principle.
- **#75** — Cross-COLE Cost Dashboard — Cost data is queen-audit input, not operator-daily surface. Likely surfaces within Reports tab (Layer 3), not as separate cost page. Operator can pull cost summary monthly via Reports.
- **#76** — Autonomy graduation framework — what each bee can decide alone vs propose-for-approval vs escalate-for-decision. To be built over Phase 3-6 as data accumulates.
- **#77** — `pending_approvals` table + Approvals UI flow (significant Phase 2 work, replaces the engine-disagreement E1 UI retrofit)

### Honest disclosures

**1. This invalidates ~6 hours of Session A pre-audit work**

The 745 LOC E1 UI pre-audit was discarded. Honest about the cost. But: caught BEFORE ship. Per audit-first protocol, this is the correct outcome — pre-audit exists to catch wrong direction before code lands.

**2. Reports tab (`/dashboard/reports`) is Day N+ infrastructure, not Phase 2**

Reports need queen_monthly_lessons + hive_monthly_reports (Layers 2-3 of Knowledge Propagation) to populate. Those build Day 14-21 as Strategic Queen Phase 3. Reports UI is Day 30+ when there's a month of data to render.

**3. Until Reports tab ships, monthly accountability is operator-manual**

Operator runs SQL queries against bee_run_metrics for monthly review until Reports tab exists. Acceptable as bridge state.

**4. CAB integration with pending_approvals needs separate spec**

Currently CAB is operator-initiated. Phase upgrade triggers from COLE Orchestrator surfacing in pending_approvals is a new flow. Day 21+ design when Layer 4 ships.

### Next-session awareness

**The next Strategy Chat needs to know:**

1. Dashboard architecture is decisions/monitor/reports, not data-dashboards
2. Daily operator surface is `/dashboard/approvals` only
3. Bees write to `pending_approvals` table for gated decisions
4. Queens audit themselves via Knowledge Propagation Layers 2-3 (operator doesn't see)
5. Reports tab is Day N+ but is the client-facing accountability surface for managed-service operations
6. Every queen page should be minimal status only — "alive and well" or "needs help"
7. Engine disagreement / cost trends / drill-down detail = feeds queen audit, NOT operator daily UI
8. Strategic Queen Phase 2 acceptance test (Step 12) needs rewrite to match this architecture

### Related discoveries

- COLE Knowledge Propagation (this file) — Knowledge Propagation Layer 2-3 is what enables queens to self-audit so operator doesn't need to see their data daily
- COLE as Managed Service (this file) — Reports tab serves both owner-operated and client-managed sites; this dashboard architecture is what makes managed service scalable

---

## 2026-05-13 — COLE as Managed Service: Operator vs Client Modes

**Date created:** 2026-05-13 (Day 10, late afternoon AWST, during dashboard architecture clarification)
**Context:** Operator surfaced dual-mode business architecture while discussing reports tab
**Trigger:** Operator: "if I am running taxchecknow for a client and we need to see monthly how its doing, this will run a full report"
**Status:** Foundational business architecture — COLE serves both owner-operated and client-managed sites; affects access control, branding, reports tab design, multi-tenant data model

### What we realized

COLE was implicitly being designed as "operator runs their own sites." The reports tab clarification surfaced a richer business architecture:

**COLE operates in two modes:**

**Mode A — Owner-Operated:** Operator runs sites for their own revenue (e.g., taxchecknow.com earning purchase commissions).

**Mode B — Client-Managed Service:** Operator runs sites for clients (e.g., a tax advisory firm hires COLE to manage their AI search visibility, monthly retainer + performance fees).

Both modes use the same COLE infrastructure. **Reports tab is the operator-client interface for Mode B.**

### Why this matters

The dashboard architecture (decisions/monitor/reports) is what makes Mode B economically viable:

- Operator can't browse 100 sites of bee data daily — doesn't scale
- BUT operator CAN review approvals across all sites daily (5 min per site × 5 critical decisions = manageable)
- AND client receives monthly reports without operator manually compiling them

**The Reports tab + automated monthly synthesis is the deliverable that justifies managed-service pricing.**

Without this architecture, managed service requires custom reports per client — operator hours that don't scale. With this architecture, each site auto-generates its monthly report, operator reviews, sends to client.

### What this architecturally implies

**Multi-tenant data isolation:**

- Already partially handled (every table has `site` column for filtering)
- Site filter in URL (`?site=taxchecknow`) already pattern
- But operator's access vs client's access not yet defined

**Access control needed:**

- Operator (you) has full access to all sites, all queens, all decisions
- Client has read-only access to their site's reports only
- Client does NOT see approvals page (that's operator's job)
- Client does NOT see queen internals
- Client sees `/clients/{slug}/reports` or similar — branded, polished, signed by operator

**Branding per site:**

- Reports may need client logo, brand colors, custom intro
- Site-level config: `client_branding jsonb` on sites table (or similar)

**Report content per mode:**

- Mode A (owner-operated): full operator-facing report with cost/efficiency/learnings detail
- Mode B (client-managed): client-facing report emphasizing OUTCOMES (citations earned, content built, traffic delivered) not COSTS (operator's margin)

### What this changes about current build

**Nothing immediate.** Today's work doesn't touch reports tab. But:

**Day 14-21 work (Strategic Queen Phase 3 Knowledge Propagation Layer 2-3):**
- `queen_monthly_lessons` schema should support mode-agnostic synthesis
- `hive_monthly_reports` schema should support both operator and client report templates
- Report generation logic considers report mode (operator-facing detail vs client-facing outcomes)

**Day 30+ Reports tab build:**
- Two report templates per site: operator (detailed) and client (branded outcomes)
- Operator approval step before client report ships
- PDF/email export capability for client delivery
- Custom branding fields populated from site config

**Day 60+ multi-tenant access control:**
- Real client login flow (not just operator viewing reports)
- Client-scoped data access (Supabase RLS policies extended)
- Audit log for client-side actions

### Cross-doc impact

- `BUSINESS-PLAN-v1.2` → Section on revenue models needs Mode A + Mode B explicit (managed service is real revenue channel, not just thinking)
- `ARCHITECTURE.md` → Multi-tenant section — currently single-tenant assumed; need to plan for client-mode
- `cole-marketing/REPORTS-TAB-SPEC.md` → New doc when Phase 3+ approaches, define report templates
- `cole-marketing/CLIENT-ONBOARDING.md` → New doc when first managed-service client signed
- `HOUSEKEEPING.md` → Items #78-80 captured

### Housekeeping items added Day 10 (Managed Service specific)

- **#78** — Multi-tenant access control design (Day 60+): client login, RLS policies per site, audit log
- **#79** — Reports tab branding/templating spec (Day 30+): operator vs client report templates, custom branding per site
- **#80** — Pricing model for managed service (operator decision): retainer + performance fees? % of citation-driven revenue? Flat monthly?

### Honest disclosures

**1. Managed service is implied, not yet pursued**

Today taxchecknow is owner-operated. No client paying for COLE-managed taxchecknow yet. But the architecture being designed should be ready for it.

**2. Managed service may never materialize as primary business**

Owner-operated COLE may earn more than managed service ever does. But: architecture cost of supporting both is low (RLS policies + report templates), strategic optionality high. Build for both.

**3. Reports tab is also useful for owner-operated mode**

Even without clients, operator wants monthly accountability on their own sites. Reports tab is dual-purpose. Mode B just adds branding + access control.

### Related discoveries

- Dashboard Architecture: Decisions, Not Data (this file) — Reports tab is third operator surface in that architecture
- COLE Knowledge Propagation (this file) — Layer 3 hive_monthly_reports is what populates Reports tab

### Next-session awareness

**The next Strategy Chat needs to know:**

1. COLE has two business modes — owner-operated and client-managed
2. Reports tab serves both, but client mode requires branding + access control
3. Multi-tenant data isolation already partially handled via `site` column
4. Client access control is Day 60+ infrastructure
5. Pricing model is undefined — operator decision when first client interest emerges
6. The dashboard architecture (decisions/monitor/reports) IS what makes managed-service scalable

---

## 2026-05-13 — E5 reframed: "AI Citation Tracking" → "Retrieval Intelligence"

**Date originally created:** 2026-05-13 (Day 10, early morning AWST)
**Date last updated:** 2026-05-13 (Day 10, ~10am AWST — empirical confirmation appended)
**Context:** Strategic Queen Phase 2, designing E5 GEO Scanner
**Trigger:** Research into Microsoft Bing AI Performance data sources
**Status:** New canonical framing — affects E5 spec, schema design, dashboard

### What we realized (Original Day 10 entry, early morning)

Originally framed E5 as "AI citation tracking" — query AI engines (ChatGPT, Gemini, Claude, Perplexity), capture which URLs they cite, track changes over time. Passive observer model.

While researching Bing AI Performance data sources to potentially include as an additional E5 input, discovered **Microsoft has no public API for Bing AI Performance data.** No documented endpoint, no enterprise tier, no partner program offering it. This forced a pivot to explore alternative framings.

Asking ChatGPT for architectural alternatives surfaced a stronger reframe:

**E5 isn't about tracking citations. It's about understanding the full RETRIEVAL pattern** — what AI engines retrieve, how they synthesize, what they prioritize, why some sources get cited and others don't.

"Retrieval Intelligence" captures all of:
- **Citation extraction** (what we had — which URLs AI engines cite)
- **Retrieval pattern analysis** (what AI does BEFORE citing — query expansion, source selection)
- **Synthesis behavior** (how AI combines multiple sources into answers)
- **Authority weighting** (why AI prefers certain sources over others)
- **Temporal drift** (how AI engine behavior changes over time)
- **Prompt-shape sensitivity** (how same question phrased differently retrieves differently)

### Why this matters

The original framing made E5 a passive observer ("track what AI says").

The new framing makes E5 an **intelligence layer** that informs:

| Downstream consumer | What Retrieval Intelligence enables |
|---|---|
| **Production Queen (Phase 3)** | What content FORMAT gets retrieved, not just cited. Bullet vs table vs FAQ structure choice has measurable effect. |
| **E6 Authority Tracker** | Which authority signals (gov sources, peer-reviewed, brand age) drive retrieval. Not just "cited" but "why cited." |
| **Distribution Queen (Phase 4)** | Where to push content to enter retrieval-eligible pool. Not just "rank on Google" — "be retrievable by AI." |
| **Strategic Queen synthesis** | Higher-quality gap scoring (gap with high retrieval-failure rate ranks higher than gap with low retrieval-failure rate) |

### What this changes architecturally (original capture)

**E5 schema (`ai_engine_responses` table — Day 10 design)**

Originally planned columns:
- `engine_name`, `query`, `response_text`, `cited_urls`, `captured_at`

Reframed columns (broader scope):
- `engine_name`, `query`, `query_variant` (we send same query 3+ ways)
- `response_text`, `cited_urls` (still core)
- `retrieval_metadata` JSONB — Q&A about WHY (when API provides this)
- `authority_signals` JSONB — which authority types appear in response
- `synthesis_pattern` enum — "single_source" | "multi_source_blend" | "comparison" | "list" | "narrative"
- `temporal_marker` — to track behavior drift over time
- `prompt_shape` — to compare across query variants

**E5 prompting strategy**

Originally: query AI engine with gap question, parse citations.

Reframed: query AI engine with **3 query variants** per gap (verbatim Reddit phrasing, technical phrasing, casual phrasing) to surface retrieval pattern sensitivity. Capture full response shape, not just URLs.

**E5 dashboard panel**

Originally: "What URLs does AI cite for our gaps?"

Reframed: "Retrieval Intelligence dashboard" — shows per-gap:
- Which AI engines retrieve correctly vs incorrectly
- Authority signal patterns (which source types win)
- Synthesis pattern (do AI engines treat this as comparison topic, list topic, narrative topic)
- Drift over time
- Cross-engine consistency

### What this affects (cross-doc impact)

- **ARCHITECTURE.md** → E5 section needs full rewrite. Old framing was 80 words; new framing is ~300 words and includes schema.
- **STRATEGIC-QUEEN-PHASE-2.md** → Section 8 (E5 GEO Scanner) → rename to "E5 Retrieval Intelligence" or keep "GEO Scanner" as bee_id but document new internal scope
- **Business Plan v1.1 → v1.2** → Section 2 (architecture) should reflect "Retrieval Intelligence" terminology; Section 11 (spin-offs) → Mireu (provisional name from E5) may need rename to reflect broader scope
- **HOUSEKEEPING.md** → Add: "Bing AI Performance data source TBD — Microsoft has no public API; investigate alternatives Day N+"
- **HOUSEKEEPING.md** → Add: "Verify 'Retrieval Intelligence' isn't a Microsoft/Google product name before locking into spec"

### Related discoveries

- 2026-05-12 — Row-of-bees architecture — E5 follows same source-agnostic pattern but is "self-contained" (no SERP→content two-step)
- 2026-05-12 — Spin-off product layer — E5 spinoff (Mireu, provisional) now has broader value proposition
- 2026-05-12 — AI Retrieval Optimization category — E5 is the measurement layer for this category
- 2026-05-12 — GEO/AEO Production Queen additions — Retrieval Intelligence informs how to build the 10 GEO/AEO deliverables

### Honest disclosures (original)

**1. "Retrieval Intelligence" naming verification needed**

Before locking into spec docs, verify:
- Microsoft hasn't used "Retrieval Intelligence" as a product name
- Google hasn't used it for Gemini-adjacent features
- No SaaS competitor has the trademark
- Domain availability if it becomes external-facing terminology

Captured as housekeeping item.

**2. Bing AI Performance API absence may be temporary**

Microsoft has not announced a public API for AI Performance data. This could change as:
- They monetize the data (likely; pattern matches Bing Webmaster Tools history)
- They open it to enterprise partners
- They release it via Microsoft Advertising APIs

Day 30+ housekeeping: re-check Bing AI Performance API availability quarterly.

**3. The reframe is partially aspirational**

E5 v1 (Day 10-13 build) will capture citation URLs + basic metadata. The full "Retrieval Intelligence" scope (authority signals JSONB, synthesis patterns, etc.) is Day 60+ as we accumulate enough data to identify patterns. **Build the schema for v2 ambition. Populate it v1 minimally.**

---

### Day 10 Update (Appended) — Empirical Confirmation + Architectural Realization

**Date appended:** 2026-05-13 (Day 10, ~10am AWST, mid-Phase 2 sprint)
**Context:** Attempted to ship E5 today during Strategic Queen Phase 2 closing push
**Outcome:** Empirically confirmed yesterday's hypothesis; surfaced foundational architectural principle worth its own Discovery Log entry

**Empirical confirmation of the API gap**

Day 10 attempted Path C (redefine E5 around working Bing Webmaster API endpoints):

- Bing API key generated successfully (taxchecknow.com Webmaster Tools, self-service via gear icon → API Access)
- Added to Vercel env as `BING_WEBMASTER_API_KEY` (production environment)
- Smoke test against initial endpoint guess (`GetPagesByApiKey`): HTTP 404 — method doesn't exist in the API
- Smoke test against real endpoint (`GetUrlSubmissionQuota`): HTTP 200, returns real data
  - DailyQuota: 100
  - MonthlyQuota: 1900
- Web search confirmed Microsoft Q&A response (Feb 2026): "no API mentioned" for AI Performance data
- Official Microsoft Learn docs list URL submission, IndexNow, traffic stats, query stats — NO AI Performance method

**Verdict:** Bing infrastructure works perfectly for traditional endpoints. AI Performance data remains dashboard-only as of May 2026.

**Decision: Pivot to E3, not Path C**

Originally considered Path C (redefine E5 around working APIs like `GetQueryStats`, `GetPageStats`). Rejected because:

- Redefined E5 would be "Bing search visibility tracker" not "Retrieval Intelligence"
- That's not less of E5 — it's a different bee with the same name
- Shipping it pollutes `geo_citations` with proxy data we'd need to deprecate
- E3 has 29 rows of live data ready to consume RIGHT NOW (E2 closed Day 10)
- Phase 2 architecture spec doesn't include phrase tracking — needs proper CAB decision before scope expansion

Final call: E3 ships today, E5 deferred with full Retrieval Intelligence scope preserved for Day 30+ build.

**Operator-surfaced principle that triggered separate Discovery Log**

During Day 10 architecture discussion, operator stated: "We need to always make sure our data loops and is a benefit to the whole hive."

Then expanded: "We self govern and report and learn all the time. Our bees need to get smarter all the time. What 1 hive learns they all need to learn (outside of their niche intelligence). We share knowledge in COLE."

This is **bigger than per-bee documentation.** It's a system-wide knowledge propagation principle requiring its own Discovery Log entry.

→ See [COLE Knowledge Propagation](#2026-05-13--cole-knowledge-propagation-self-governing-continuously-learning-hives) (same date, separate entry, foundational principle)

E5 inherits the principle (when built Day 30+) as one of many consumers, not as the bee that defines it.

**What E5 v1 should still capture (when built Day 30+)**

Day 30+ E5 build per Discovery Log original + Day 10 additions:

| Field | Source | Notes |
|---|---|---|
| `engine_name` | Original | |
| `query` + `query_variant` | Original | 3 phrasings per gap |
| `response_text` | Original | |
| `cited_urls` | Original | |
| `retrieval_metadata` JSONB | Original | When API provides |
| `authority_signals` JSONB | Original | |
| `synthesis_pattern` enum | Original | |
| `temporal_marker` | Original | |
| `prompt_shape` | Original | |
| `phrase_propagation` rows (separate table) | Day 10 addition | Unique phrases probed weekly, exact + paraphrase detection |
| `queen_routing_action` enum | Day 10 addition | Which queen consumes this row |
| `loop_outcome` | Day 10 addition | Track action result over time |
| `cross_hive_lesson_id` (FK) | Day 10 addition | Per knowledge propagation doc — if this row produces a lesson, link here |

**Cross-doc impact additions (Day 10)**

- This Discovery Log — NEW entry for Knowledge Propagation (see below)
- `ARCHITECTURE.md` → Add "Knowledge Propagation Architecture" section (foundational, not E5-specific)
- `HIVE-KNOWLEDGE-FLOW.md` → New doc describing data flow between bees → queens → hives → COLE orchestrator
- `BUSINESS-PLAN-v1.2` → Section on continuous learning + cross-site knowledge transfer

**Housekeeping items added Day 10 (Retrieval Intelligence specific)**

- **#56** — Spec E5 blocked: Microsoft AI Performance API does not exist (May 2026 confirmed). Monthly Microsoft API status check.
- **#57** — Manual Bing AI Performance dashboard review cadence: weekly screenshot/paste into Notion until API exists.
- **#60** — E5 Phrase Propagation Tracker (Day 30+): genuine retrieval intelligence bee with phrase probing + paraphrase detection + queen-routing per loop logic.
- **#61** — Citation Seeding strategy (Day 30+): deliberately publish unique terminology designed to be tracked.

---

## 2026-05-13 — COLE Knowledge Propagation: Self-Governing, Continuously Learning Hives

**Date created:** 2026-05-13 (Day 10, ~10:30am AWST)
**Context:** Surfaced during Strategic Queen Phase 2 closing push, while discussing E5 deferral and hive-loop principle for individual bees
**Trigger:** Operator stated: "We need to always make sure our data loops and is a benefit to the whole hive... we self govern and report and learn all the time... what 1 hive learns they all need to learn (outside of their niche intelligence)... we share knowledge in COLE"
**Status:** Foundational architectural principle — affects every queen, every bee, every site hive, the COLE orchestrator itself

### What we realized

Earlier Day 10 captured "hive feedback loop" as a per-bee documentation requirement (housekeeping #62) — every bee's output must route to a queen action.

But that framing missed the bigger structure. Operator's full statement reveals **three architectural principles in one**:

**Principle 1 — Self-Governance**

Hives audit themselves. Not just operator audits them.

Each queen exports its own assessment:
- What worked
- What didn't
- What pattern is emerging
- What it would change next month

This is queen-internal cognition, not external monitoring.

**Principle 2 — Continuous Learning**

Bees improve over time. Not just execute fixed code.

When a bee's accuracy improves (e.g., E2c StackExchange URLs filter to 95% relevance vs 30% baseline), that improvement must:
- Be measured
- Be persisted (so we don't lose it on cron retry)
- Be teachable to similar bees (e.g., E2c learns → E2 future bees inherit)

**Principle 3 — Cross-Hive Knowledge Sharing**

What one hive learns, all hives learn. Outside their niche intelligence.

Site A's taxchecknow hive discovers "ATO citations rank highest with table-format answers." Site B's theviabilityindex.com hive **automatically inherits** that knowledge.

Niche intelligence (Site A's specific tax rules) stays in Site A. Meta-intelligence (table-format > prose for authority sources) propagates across all hives.

### Why this matters

Without this architecture:
- Each new site rebuilds from scratch
- Operator manually transfers lessons across sites (slow + error-prone)
- COLE doesn't compound — it linearly scales

With this architecture:
- Site #1 takes 8 weeks to build (full bootstrap)
- Site #2 takes 4 weeks (inherits ~50% of meta-knowledge)
- Site #N takes 1-2 weeks (inherits ~80% of meta-knowledge)
- COLE compounds exponentially as more sites operate

This is the **GOAT moat**. Not "AI tools that read dashboards" but "an organism that learns across instances of itself."

### What this architecturally requires

**Layer 1 — Bee-level metrics capture**

Every bee must produce structured metrics on every run:
- Did it succeed?
- What was its cost?
- What was its accuracy?
- What surprised it (errors, edge cases)?
- What rules did it learn (e.g., "this URL pattern always fails", "this prompt shape works best")?

Schema TBD but lives in `bee_run_metrics` table or similar.

**Layer 2 — Queen-level synthesis**

Each queen reads its bees' metrics and synthesizes:
- "Across 30 days, E2 learned that StackExchange URLs filter to 95% relevance when subdomain regex excludes meta + drupal"
- "E1 learned that Anthropic and Gemini disagree on tax topics 40% of the time but agree on 95% on geographic topics"

Queens produce `queen_monthly_lessons` rows.

**Layer 3 — Hive-level report**

Each site hive (4 queens combined) produces monthly report:
- Niche lessons (specific to this site's topic/jurisdiction)
- Meta-lessons (generalizable to other hives)
- Open questions for COLE orchestrator
- Phase-upgrade candidates for CAB

Lives in `hive_monthly_reports` table.

**Layer 4 — COLE orchestrator (cross-hive)**

COLE reads all hive reports. Performs three actions:

- **Action A — Cross-hive propagation:** Takes meta-lessons from Hive A and pushes them to Hive B/C/D. Each receiving hive's queens incorporate the lesson into their next-cycle prompts/configs.
- **Action B — Phase-upgrade triggers:** If multiple hives independently report the same problem ("Production Queen needs better story-shaping for fear emotions"), surface to CAB as phase-upgrade candidate.
- **Action C — Anti-pattern detection:** If hives report contradictory lessons, surface for human resolution.

**Layer 5 — CAB integration**

CAB receives phase-upgrade candidates from COLE orchestrator.
Operator approves/rejects.
Approved upgrades flow back to all hives as architecture changes.

### What this changes about current build

**Immediate (Day 10-15)**

**Every bee being built now needs a metrics capture mechanism.** Not added later — added now while bees are small.

- E2 (closed today) needs metrics retroactively added — what did it learn this fire? Captured in agent_log via `e2_bee_completed` rows but no structured lesson extraction yet
- E3 (today's build) must include lesson capture from day 1
- All future bees inherit this requirement

**Phase 2 close (Day 14-21)**

After Strategic Queen Phase 2 ships, **build Phase 3 of Strategic Queen as Knowledge Propagation Layer** before Production Queen Phase 2.

Specifically:
- `bee_run_metrics` table (per-run granular metrics)
- `queen_monthly_lessons` table (queen-level synthesis)
- `hive_monthly_reports` table (cross-queen aggregation)
- `cole_orchestrator_log` table (cross-hive propagation actions)
- Monthly cron: queen lesson extraction
- Quarterly cron: hive report compilation
- COLE orchestrator decision logic

**Phase upgrades (Day 30+)**

Hive reports start producing phase-upgrade candidates organically. CAB pipeline expands beyond "operator notices problem" to "system surfaces problem."

### Cross-doc impact

- `ARCHITECTURE.md` → New top-level section "Knowledge Propagation Architecture"
- `STRATEGIC-QUEEN-PHASE-3.md` → Becomes Knowledge Propagation Layer (was previously planned as something else; needs reassignment)
- `HIVE-KNOWLEDGE-FLOW.md` → New doc with full data flow diagram
- `BUSINESS-PLAN-v1.2` → Section 4 (architecture moat) leads with knowledge propagation as primary differentiation
- `CAB-PROCESS.md` → Update to receive system-surfaced phase-upgrade candidates
- `HOUSEKEEPING.md` → Items #62-65 reframed (see below)

### Reframing of Day 10 housekeeping items

Originally captured as standalone items #62-65. With this Discovery Log entry, they become **implementation steps for the Knowledge Propagation Architecture**, not standalone work.

| Original | Reframed |
|---|---|
| #62 — Hive feedback loop documentation for all bees | Part of Layer 1 — every bee captures lesson metrics |
| #63 — Queen Monthly Report architecture | Layer 2 — queen-level synthesis |
| #64 — Site hive aggregator | Layer 3 — hive monthly report |
| #65 — COLE orchestrator report consumer | Layer 4 — cross-hive propagation |

New items added Day 10:
- **#66** — Build `bee_run_metrics` table schema (Layer 1 foundation, build with E3 today)
- **#67** — Define "lesson" data structure (what does a queen extract from a bee?)
- **#68** — Define "meta-lesson" vs "niche lesson" classifier (which lessons propagate vs stay in hive?)
- **#69** — Strategic Queen Phase 3 spec rewrite as Knowledge Propagation Layer
- **#70** — E2 retroactive metrics capture (Day 11)

### Honest disclosures

**1. This is Day 30+ infrastructure (Layers 2-5), not Day 11**

Building full knowledge propagation requires real bee-run data to learn from. Strategic Queen Phase 2 needs to complete first. Production Queen Phase 2 needs to start producing data. Then knowledge propagation has substrate to operate on.

But: **Layer 1 (bee_run_metrics) starts Day 10.** E3 ships today with metrics capture from day 1. E2 gets retrofit Day 11. Future bees inherit by default.

**2. The "meta-lesson vs niche lesson" classifier is non-trivial**

How does COLE know "ATO citations love tables" is a niche lesson (AU tax specific) vs "authority-source content prefers structured formats" (universal)?

Open question. Likely needs Sonnet-driven classification with operator approval initially, ML pattern detection later.

**3. CAB integration is real complexity**

System surfacing phase-upgrade candidates means CAB receives more proposals over time. Need operator review cadence (weekly? batch monthly?). Current CAB is operator-initiated; future CAB is system-surfacing-with-operator-approval.

**4. This Discovery Log entry itself is an example of the principle**

Today's operator-surfaced principle was captured immediately as architectural reframe. That same pattern needs to apply to all hives — when a queen learns something, it captures the lesson immediately in a structured form, not at month-end retrospective.

### Related discoveries

- 2026-05-13 — [E5 Retrieval Intelligence](#2026-05-13--e5-reframed-ai-citation-tracking--retrieval-intelligence) — E5 is one consumer of this architecture; its `cross_hive_lesson_id` field connects to this layer
- Earlier discoveries needing review — Row-of-bees architecture, AI Retrieval Optimization category, Spin-off product layer — all should be re-read against this knowledge propagation framing

### Next-session awareness

**The next Strategy Chat needs to know:**

1. Knowledge Propagation is now THE foundational COLE architecture, not E5-specific
2. Every bee built from Day 10 forward needs metrics capture forward-compatible with `bee_run_metrics` schema (Layer 1)
3. Strategic Queen Phase 3 is reassigned to Knowledge Propagation Layer implementation
4. Phase upgrades will increasingly be system-surfaced + CAB-approved, not just operator-initiated
5. Discovery Logs themselves embody the principle — when operator surfaces a system-wide insight, capture it immediately as Discovery Log entry, not housekeeping


### Day 10 Update (Appended) — Full 3-Commit Retrofit Complete

**Date appended:** 2026-05-13 (Day 10, ~14:30 AWST close)
**Context:** All three architectural pivot commits shipped + visually verified end-to-end

**Commits shipped Day 10 implementing this architecture:**
- c9bb561 — pending_approvals table + E1 refactor + server action (Commit A, 336 LOC)
- dbf6312 — Approvals page Strategic Decisions card UI + reject modal (Commit B, 362 LOC)
- 5d0aefe — Strategic Queen monitor simplification (Commit C, -190 net LOC)

**Net architectural state Day 10 close:**

`/dashboard/approvals` is the daily operator surface. Strategic Decisions section at top renders pending_approvals.status='pending' rows as cards with payload-driven fields + Approve/Reject buttons + reject modal. Content Waiting + Scientist Reports sections below (unchanged from pre-Day-10).

`/dashboard/monitor/strategic-queen` is the queen-status surface. Binary "alive" or "needs help" banner. 4 key status fields (Last fired, Runs 24h, Cost 24h, Next fire). Preserved panels: Escalations (placeholder until E4+E7 Phase 2), Authority Changes Pending Review (transitional — Day 14+ migration to pending_approvals), Signal Sources (compact transparency strip), Strategic Memory (operator manual notes). Footer link to /approvals as affordance.

`/dashboard/reports` — not built. Day 30+ when Knowledge Propagation Layers 2-3 produce hive_monthly_reports data.

**E1 dashboard retrofit fully closed.** E1 now writes proposals to pending_approvals for first-time gap detection (refresh-in-place for existing approved gaps). Operator approves/rejects via Approvals page. Approved → gap_queue insert via server action.

**E7 unchanged in Commit C** — RuleChangesQueue panel remains on Strategic Queen monitor page as transitional surface. Schema enum `authority_change_cascade` reserved in pending_approval_type. Day 14+ migration commit moves E7 to /approvals canonical surface.

**Health 37/100 fractional display permanently removed.** What operators were seeing (and asking about) at Day 10 morning is gone. Replaced with binary semantics + reason transparency when not "alive."

**6 dashboard panel files retained on disk** (TopOpportunities, RankedQuestions, EngineCostTrend, RecommendedActions, ApprovalQueue, ActivityFeed) but no longer imported by Strategic Queen monitor page. Available for drill-down detail page restoration Day 11+ if operator pattern emerges.

**Manual `Run now` / `Pause` / `Settings` buttons remain disabled.** Wiring deferred to Day 11+ housekeeping. Operator manual cron firing still via curl.

### Cumulative housekeeping captured during Day 10 dashboard retrofit
- **#84** — Validate Approve path with real E1-generated pending_approval row (organically when E1 finds new gap, or by adding new topic to overlay). Test fixture validated Reject path only.
- **#85** — Test fixtures must mirror production payload field names exactly (priority_tier not tier, recommended_character not character, etc.). Caught during Commit B visual verify when fixture used wrong field names.
- **#86** — Verify data flow before proposing UI deletion. "Looks similar" ≠ "is duplicate." Caught when I incorrectly proposed RuleChangesQueue duplicates Approvals page — it does not (E7 still writes to rule_changes, not pending_approvals).
- **#87** — E7 → pending_approvals migration (Day 14+). Schema enum value already reserved. Single migration to flip E7's write target + redirect RuleChangesQueue to Approvals page.
- **#88** — Detail/drill-down page architecture (Day 11+). 6 retained component files (TopOpportunities, RankedQuestions, EngineCostTrend, RecommendedActions, ApprovalQueue, ActivityFeed) available for drill-down restoration once operator usage pattern emerges.
- **#89** — Manual Run now button wiring (Day 11+). Currently disabled placeholder.
- **#90** — Session A drift process hardening. Three incidents Day 10 where strategy chat architectural pivots reached Session A late. Need explicit "Session A sync state" tracking in strategy chat going forward.

# DASHBOARD BACKLOG — Per Queen, Per Bee UI Wiring State

Single canonical file. Tracks what UI work exists, what's complete, what's pending per queen.

Day 10 architecture: per Dashboard Architecture Discovery Log entry, operator surfaces are 
DECISIONS (approvals page), STATUS (monitor pages, minimal), REPORTS (Day N+ tab).

---

## Daily Operator Surface — /dashboard/approvals

Status: ✅ FUNCTIONAL Day 10 close

Sections:
- Strategic Decisions (renders pending_approvals where decision_type IN ('promote_gap_to_active', 'mark_gap_no_go') AND status='pending')
- Content Waiting For Review (existing — content_jobs)
- Scientist Reports (existing — video_queue)

Empty state: "Nothing to approve right now. Bees are running. You'll be notified when something needs a decision."

Decision types active V1:
- ✅ promote_gap_to_active (E1 writes; Approve = gap_queue insert; Reject = status flip)

Decision types reserved schema, no UI yet:
- ⏳ mark_gap_no_go (Day 12+, NO_GO branch UI ships)
- ⏳ authority_change_cascade (Day 14+ when E7 migrates from rule_changes)

Decision types planned future:
- Production Queen Phase 2+: new_product_build_proposal
- Distribution Queen Phase 2+: content_publish_proposal
- Madame Governance Phase 1+: bee_prompt_change, cost_threshold_exceeded
- COLE Orchestrator Phase 1+: cab_phase_upgrade_recommendation

---

## Queen Monitor Pages — /dashboard/monitor/{queen}

### Strategic Queen — /dashboard/monitor/strategic-queen

Status: ✅ SIMPLIFIED Day 10 close (Commit 5d0aefe)

Surface elements (operator-facing):
- Binary status banner: alive (green) / needs help (rose with reasons) / has not fired yet (gray)
- 4 status fields: Last fired, Runs (24h), Cost (24h), Next fire
- Escalations panel (placeholder until E4 + E7 Phase 2 populate)
- Authority Changes Pending Review (transitional, Day 14+ migration to /approvals)
- Signal Sources (compact transparency strip showing what each bee writes)
- Strategic Memory (operator manual notes)
- Footer link to /approvals (affordance)
- Action buttons placeholder: Run now / Pause / Settings (DISABLED V1)

Wired bees writing to monitor inputs:
- E1 ✅ (writes pending_approvals)
- E2 ✅ (writes market_research_signals — 29 rows)
- E3 ✅ (writes psychology_signals — 5 rows, bee_run_metrics)
- E7 ✅ (writes rule_changes — surfaces in transitional panel)

Pending bees Phase 2 close:
- E4 Competitor Monitor (Step 6 next)
- E6 Trend Velocity Scanner (Step 7)
- E5 Retrieval Intelligence (Day 30+, deferred)

### Production Queen — /dashboard/monitor/production-queen

Status: NOT YET BUILT (Day 14+ work when Production Queen Phase 2 starts)
Pattern: same as Strategic Queen (binary status + minimal panels)

### Distribution Queen — /dashboard/monitor/distribution-queen

Status: NOT YET BUILT (Day 21+ work)
Pattern: same as Strategic Queen

### Adaptive Queen — /dashboard/monitor/adaptive-queen

Status: NOT YET BUILT (Day 30+ work)

### Madame Governance — /dashboard/monitor/madame-governance

Status: NOT YET BUILT

### COLE Orchestrator — /dashboard/monitor/cole-orchestrator

Status: NOT YET BUILT (Day 30+ work, cross-hive view)

---

## Reports Tab — /dashboard/reports

Status: NOT YET BUILT — Day 30+ infrastructure dependency

Requires Knowledge Propagation Layers 2-3 (queen_monthly_lessons + hive_monthly_reports tables, monthly cron). 
Built Day 14-21 as Strategic Queen Phase 3.

Serves: 
- Mode A (owner-operated) — operator monthly accountability
- Mode B (client-managed service) — branded client-facing reports per COLE as Managed Service Discovery Log entry

---

## Detail / Drill-Down Pages

### Gap detail — /dashboard/monitor/strategic-queen/gap/[id]

Status: ✅ Built Day 10 (Commit 48807dc) — accepted as drill-down layer
- GapDetailHeader, EngineDisagreement, GapCostTrend components
- Reachable from approvals page (when citation_gap_id present) or direct URL

### Per-bee detail pages

Status: NOT YET BUILT
6 component files retained on disk for drill-down restoration if pattern emerges Day 11+

---

## Day 11+ Backlog

- Manual Run now button wiring (HK #89)
- E7 → pending_approvals migration + RuleChangesQueue redirect (HK #87)
- mark_gap_no_go UI when E1 NO_GO branch surfaces operator-visible (HK at Day 12)
- Drill-down detail page architecture decision (HK #88)
- Detail page link added to StrategicDecisionCard when citation_gap_id != null
- Cross-COLE Cost view — likely lives within Reports tab Layer 3 (Day 30+)


# ============================================================================
# DISCOVERIES.md APPEND-ONLY UPDATE — Day 10 Close
# ============================================================================
#
# INSTRUCTIONS FOR OPERATOR:
# 
# This file contains TWO additions to append to your existing DISCOVERIES.md:
#
# 1. ADD TO INDEX (near top of file, after the existing entries)
# 2. APPEND NEW DISCOVERY LOG ENTRY at top of entries (after Index, before
#    "Audit-First Protocol" entry)
# 3. APPEND "Day 10 Update 3" SECTION to the existing Dashboard Architecture
#    entry (at the bottom of that entry, after the existing Day 10 Update 2)
#
# All three additions are below in order. Each section has clear markers.
#
# ============================================================================

# ============================================================================
# ADDITION 1: UPDATE THE INDEX
# ============================================================================
# 
# Find the Index section near the top. Add this NEW LINE as the first entry
# (it goes ABOVE "Audit-First Protocol"):

- **2026-05-13** — Deferred-Activation Pattern: Build Complete Now, Fire When Ready

# ============================================================================
# ADDITION 2: NEW DISCOVERY LOG ENTRY (INSERT AT TOP OF ENTRIES)
# ============================================================================
#
# Insert this entire block AFTER the Index (and the "---" separator below it),
# BEFORE the existing "Audit-First Protocol" entry:

## 2026-05-13 — Deferred-Activation Pattern: Build Complete Now, Fire When Ready

**Date created:** 2026-05-13 (Day 10, ~22:30 AWST close)
**Context:** E6 Trend Velocity Scanner (Step 7) shipped as last bee in Strategic Queen Phase 2 with a built-in activation gate that defers firing until 2026-05-27. Operator-surfaced architectural principle when the question arose: "Can we build E6 tonight but not have it fire until baseline data accumulates?"
**Trigger:** E6's V1 reality is that velocity_pct cannot be meaningfully computed until ~14 days of `market_research_signals` history accumulates. The bee is architecturally complete but signal is NULL until ~Day 21.
**Status:** Foundational architectural pattern — applies to any future bee/component whose value materializes on a delay

### What we realized

Three options were on the table for E6 at Day 10 close:

1. **Skip the build entirely** — defer E6 to Day 21+ alongside Synthesis Layer
2. **Build but disable in overlay** — flip a flag at Day 21
3. **Build with activation gate** — bee logic self-defers until target date, naturally activates without manual intervention

Operator instinct chose Option 3 with this framing:

> "I dont want to come back and build bees, after this we move to the next queen, can we build and not have it fire until the 2 week date?"

That instinct surfaced an architectural principle larger than E6 itself.

### The principle

**Phases close clean. No cognitive debt carried forward.**

When a component is architecturally complete but operationally premature, build it now with a self-defer mechanism. Don't leave half-built work for later. Don't require manual flag-flips at the right moment. Build complete; let time activate it.

This is the same energy as audit-first protocol — discipline that prevents architectural drift through "we'll come back to it later" debt that compounds.

### The deferred-activation pattern

Implementation specifics (E6 reference implementation):

```typescript
// lib/queens/e6-trend-velocity-scanner.ts

const E6_ACTIVATION_DATE = '2026-05-27';

export async function runTrendVelocityScanner(sb, overlay, site_key, run_id) {
  // Stage 0: Activation gate
  const now = new Date();
  const activation = new Date(E6_ACTIVATION_DATE);
  
  if (now < activation) {
    const days_until = Math.ceil((activation.getTime() - now.getTime()) / 86400000);
    
    // KP Layer 1 emission with deferred status
    await sb.from('bee_run_metrics').insert({
      bee_name: 'e6-trend-velocity',
      success_count: 0,
      error_count: 0,
      cost_usd: 0,
      run_duration_ms: 0,
      accuracy_metrics: {
        status: 'deferred',
        deferred_until: E6_ACTIVATION_DATE,
        days_until_activation: days_until,
      }
    });
    
    // agent_log human-readable record
    await sb.from('agent_log').insert({
      bee_name: 'e6-trend-velocity',
      action: 'e6_deferred',
      result: `deferred until ${E6_ACTIVATION_DATE} (awaiting baseline data for velocity computation), run_id=${run_id}`,
    });
    
    return { status: 'deferred', active: false, activation_date: E6_ACTIVATION_DATE };
  }
  
  // Normal pipeline executes after activation date
  // ...
}
```

### Why this beats alternatives

**vs Option 1 (skip build, defer to Day 21+):**
- Cognitive debt: operator must remember to build E6 alongside Synthesis Layer
- Pattern drift risk: future bee work happens in a different mental mode (Production Queen scope), forgetting Strategic Queen patterns
- Phase 2 status hangs incomplete

**vs Option 2 (build with manual flag):**
- Flag-flip-at-right-moment risk: easy to forget on 2026-05-27
- Operator action required at activation milestone
- Less self-documenting

**vs Option 3 (activation gate — chosen):**
- Zero manual action at activation milestone
- Code self-documents when it activates and why
- bee_run_metrics captures "deferred" status so queens reading KP can see this bee isn't dead — it's pending
- SignalSources panel shows "awaiting baseline data (activates YYYY-MM-DD)" — operator visibility free
- Cron continues firing daily, but exits cleanly in seconds during deferred period (~600ms vs ~3 minutes for full pipeline)

### KP Layer 1 visibility during deferred period

A critical detail: the bee writes a `bee_run_metrics` row EVERY firing, even when deferred. Status field captures `deferred`. days_until_activation count down to zero.

This means:
- Queens auditing system health see E6 is "alive but pending" not "missing"
- Strategic Queen monitor SignalSources panel shows E6 with descriptive status text
- Layer 2 audit reports (Day 14+ when queen_monthly_lessons ships) can read deferred history
- Day 21 milestone observation: KP Layer 1 shows first non-deferred fire automatically

### Empirical proof Day 10 close

E6 first fire after activation gate ship (`4fdc564`):

```
Response: { status: "success", summary: { status: "deferred", 
           active: false, activation_date: "2026-05-27", 
           elapsed_ms: 602 } }
bee_run_metrics: 1 row with status='deferred', days_left=14
agent_log: 1 row with action='e6_deferred'
trend_signals: 0 rows (gate prevented writes)
```

Gate exit in ~600ms. No database writes to trend_signals. Full audit trail preserved.

### Application beyond E6

This pattern applies to any future component with delayed value:

- **Production Queen Phase 2 bees** — content_writer, calculator_builder etc. may need user-traffic baseline before A/B tests are meaningful
- **Distribution Queen Phase 2 bees** — citation_tracker needs ~30d of published content before signal accumulates
- **Knowledge Propagation Layer 2** — queen_monthly_lessons cron needs ~30d of Layer 1 data before first monthly audit produces meaning
- **Cost monitoring bees** (HK #109+) — burn rate calculation needs ~14d of cost_snapshots history

In all cases: build complete now, activation date in code, deferred-status visibility via KP Layer 1.

### Cross-doc impact

- `ARCHITECTURE.md` → New section on deferred-activation pattern as engineering discipline
- All future pre-audits → Section to consider: "Does this component need delayed activation? If so, build the gate."
- `HOUSEKEEPING.md` → Each deferred component gets a milestone-watch HK item (e.g. HK #113: E6 Day 21 activation milestone observation; HK #114: validate first real velocity_pct numeric values)

### Related discoveries

- COLE Knowledge Propagation (this file) — KP Layer 1 substrate captures deferred status, queens self-aware of component state
- Dashboard Architecture: Decisions, Not Data (this file) — SignalSources panel surface accommodates deferred status text naturally
- Audit-First Protocol (this file) — same engineering discipline category: prevent architectural drift through small upfront investments

### Next-session awareness

**The next Strategy Chat needs to know:**

1. Deferred-activation pattern is foundational, not a one-off E6 trick
2. When building future bees/components with delayed value, propose activation gate during pre-audit, not as afterthought
3. Day 21 (2026-05-27) is E6's first real fire — operator-side housekeeping at that date: observe non-NULL velocity values, validate threshold semantics, ship TrendVelocityCard.tsx if first threshold trips occur
4. Phase 2 closes clean architecturally — no E6 to-do hanging when Production Queen Phase 2 starts
5. KP Layer 1 records during deferred period are NOT noise — they're proof-of-life for self-governing queens

---

# ============================================================================
# ADDITION 3: APPEND "Day 10 Update 3" TO DASHBOARD ARCHITECTURE ENTRY
# ============================================================================
#
# Find the existing "Dashboard Architecture: Decisions, Not Data" entry.
# At the BOTTOM of that entry (after the existing "Day 10 Update 2 — E4 
# Competitor Monitor Proves Pattern Generalizes" section and its 
# housekeeping items #91-99), APPEND THIS new section:

### Day 10 Update 3 (Appended) — Strategic Queen Phase 2 Architecturally Complete

**Date appended:** 2026-05-13 (Day 10, ~22:30 AWST close)
**Context:** Steps 9 (Priority Decay) and 7 (E6 Trend Velocity Scanner) both shipped Day 10. With these, all Strategic Queen Phase 2 bees are architecturally complete pending Synthesis Layer (Step 10). 17 commits Day 10 total, 0 reverts.

**Final Day 10 commits ledger:**
- 6bbc857 — feat: Step 9 Priority Decay cron (~600 LOC)
- 8fbacc2 — refactor(e4): Row-of-Bees pattern compliance — 9.5 patch (~121 LOC)
- b2930d9 — fix(e2e-chatgpt): citation parser — HK #52 (~14 LOC)
- 4fdc564 — feat(strategic-queen): Step 7 E6 Trend Velocity — Day 10 final ship (~623 LOC)

**Strategic Queen Phase 2 bee inventory at Day 10 close:**

**Active firing (7 bees + 1 cron):**
- E1 Citation Gap Scanner — writes pending_approvals (Daily 03:00 UTC)
- E2 Market Researcher Row-of-Bees:
  - E2c Brave + StackExchange (live)
  - E2e-chatgpt (live, HK #52 citations parser fixed Day 10)
  - E2e-gemini (live)
- E3 Customer Psychologist — writes psychology_signals (Daily 05:30 UTC)
- E4 Competitor Monitor — writes competitor_signals + pending_approvals (Daily 06:15 UTC)
- E7 Truth-Sync — writes rule_changes
- Priority Decay cron — writes gap_queue priority_score / priority_tier (Daily 06:30 UTC)

**Temporarily blocked on infrastructure (2 bees, schema-ready for Day 14+):**
- E2a Google + Reddit (Google CSE key expired + Reddit egress blocked)
- E2b Brave + Reddit (Reddit egress blocked from Vercel IPs)

**Architecturally complete with deferred activation (1 bee):**
- E6 Trend Velocity Scanner — built with activation gate, fires daily but exits via Stage 0 deferred-status check until 2026-05-27 when baseline data accumulates (per Deferred-Activation Pattern Discovery Log entry)

**Deferred Day 30+ (1 bee):**
- E5 Retrieval Intelligence — no Microsoft AI Performance API exists yet; reframed Day 9 to Phrase Propagation Tracker; schema preserved, build Day 30+

**Approvals page decision-card surface — 4 sections:**
1. ✅ Strategic Decisions (E1 writes promote_gap_to_active) — proven Day 10
2. ✅ Competitor Threats (E4 writes flag_competitor_threat) — proven Day 10 with test fixture
3. Content Waiting For Review (existing content_jobs) — unchanged
4. Scientist Reports (existing video_queue) — unchanged

Plus 5 reserved schema decision types awaiting their bees' next phases:
- mark_gap_no_go (E1 NO_GO branch, Day 12+)
- authority_change_cascade (E7 migration, Day 14+)
- flag_rising_trend (E6 post-activation Day 21+)
- track_new_competitor (E4 discovery sub-bee Day 14+)
- cost_threshold_exceeded (Madame Governance Phase 1, Day 21+)

**KP Layer 1 (bee_run_metrics) coverage:**
- ✅ E1 (writes per fire)
- ⏳ E2 retroactive add still needed (housekeeping #70)
- ✅ E3 (writes per fire from Day 1)
- ✅ E4 (writes per fire from Day 1)
- ✅ E6 (writes per fire from Day 1, including deferred status during activation gate period)
- ✅ Priority Decay (writes per fire from Day 1, rich accuracy_metrics)
- ⏳ E7 retroactive add still needed (housekeeping #87)

5 of 8 active bees write to Layer 1 substrate from day 1. Layer 2 (queen_monthly_lessons) will read this Day 14-21 when Madame Governance build begins.

### Anthropic API credit exhaustion incident — Day 10

**Empirical incident:** Mid-fire on the post-HK#52 verification E2 cron, Anthropic API credits exhausted. e2e-chatgpt successfully wrote 4 of 5 rows before exhaustion; e2e-gemini fired 5/5 errors with "credit balance too low" message. Operator topped up credits, re-fired E2 — both bees produced clean output (5/5 ChatGPT rows × 10-20 citations each; 5/5 Gemini rows).

**Operational lessons:**
- Cost projections from individual bee fires don't aggregate visibly across the day
- bee_run_metrics tracks per-fire cost but no rolling total or burn-rate calculation exists
- No alerting mechanism if credits approach exhaustion
- Anthropic console email alerts (if available) are the only current safety net
- Manual credit top-ups need logging for burn-rate accuracy

**This is real infrastructure work for Day 14-21 Madame Governance Phase 1.** Captured as housekeeping #109-112 for Day 11+ implementation. The `cost_threshold_exceeded` decision_type is already schema-reserved in pending_approval_type enum.

### Cumulative housekeeping captured Day 10 close

- **#100** — E2/E3/E4 refresh hooks for last_signal_refreshed_at (decay consistency) — Day 11+ each bee gets ~5 LOC update hook when writing meaningful signals to gap_queue
- **#101** — Priority Decay deadline-skip edge case — Synthesis Layer Step 10 handles deadline weight; revisit if empirical issues surface
- **#102** — Tier threshold revisit (E1's 80/60/40/20 vs spec's 95/80/50/20) — Layer 2 audit Day 30+ will reveal optimal break points
- **#103** — priority_decay_log table — skipped V1, revisit if bee_run_metrics insufficient
- **#104** — Day 11 morning handover doc must include explicit architectural patterns checklist
- **#105** — Pattern verification at ship-time not just pre-audit — schema columns existing ≠ dispatch maps wired (E4 lesson)
- **#106** — Name actual bees firing not their conceptual umbrella — "E2" is shorthand obscuring Row-of-Bees architecture
- **#107** — Google CSE provisioning re-check monthly — restore E2a when API access available
- **#108** — Reddit egress strategy — proxy / Reddit OAuth API official access — restore E2b when infrastructure shifts
- **#109** — Anthropic API credit balance monitoring infrastructure (Day 21+ Madame Governance Phase 1)
- **#110** — Manual cost top-up logging — operator records "topped up $X on date Y" for burn-rate baseline
- **#111** — Anthropic Admin API key provisioning — add ANTHROPIC_ADMIN_API_KEY to Vercel env
- **#112** — Cost alerting via pending_approvals (cost_threshold_exceeded decision_type already reserved)
- **#113** — E6 Day 21 activation milestone (2026-05-27) — observe first non-NULL velocity_pct values
- **#114** — E6 threshold validation when first real velocity data arrives — validate 50% velocity / 1000 minimum tunability
- **#115** — TrendVelocityCard.tsx + decidePendingApproval extension Day 21+ if first threshold trips occur

### Day 10 close architecture statement

**Phase 2 Step 7 (E6 Trend Velocity) CLOSED with deferred-activation pattern.**
**Phase 2 Step 9 (Priority Decay) CLOSED.**

**10 of 12 official Phase 2 steps closed.** Step 8 (E5) deferred Day 30+ per operator lock. Steps 10-12 (Synthesis Layer + Validation) remain.

Strategic Queen Phase 2 architecturally complete pending Synthesis Layer (Step 10) which transforms raw bee signals into ranked operator decisions. Day 11+ work: pre-audit + ship Step 10, then End-to-End validation (Step 11) + Acceptance test rewrite (Step 12) to formally close Phase 2.

Operator pivots to Production Queen Phase 2 work alongside Synthesis Layer build. Bee-building era closes Day 10. Pattern inheritance ready: Production Queen and Distribution Queen build their own bees against the same Row-of-Bees + KP Layer 1 + audit-first + decision-card patterns proven across 8 Strategic Queen bees Day 10.

# ============================================================================
# END OF DAY 10 CLOSE UPDATE
# ============================================================================
