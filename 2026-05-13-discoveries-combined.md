# Day 10 Discovery Log — Combined

**Save as TWO separate files in cole-marketing/ root:**

1. `cole-marketing/2026-05-13-e5-retrieval-intelligence.md` (overwrites yesterday's file with appended Day 10 update)
2. `cole-marketing/2026-05-13-cole-knowledge-propagation.md` (new file)

Each file's content is delimited below by `===== FILE 1 =====` and `===== FILE 2 =====` markers. Copy each block into its own file.

---

===== FILE 1 START =====

Filename: `2026-05-13-e5-retrieval-intelligence.md`

```markdown
# E5 reframed: "AI Citation Tracking" → "Retrieval Intelligence"

**Date originally created:** 2026-05-13 (Day 10, early morning AWST)
**Date last updated:** 2026-05-13 (Day 10, ~10am AWST — empirical confirmation appended)
**Context:** Strategic Queen Phase 2, designing E5 GEO Scanner
**Trigger:** Research into Microsoft Bing AI Performance data sources
**Status:** New canonical framing — affects E5 spec, schema design, dashboard

---

## What we realized (Original Day 10 entry, early morning)

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

## Why this matters

The original framing made E5 a passive observer ("track what AI says").

The new framing makes E5 an **intelligence layer** that informs:

| Downstream consumer | What Retrieval Intelligence enables |
|---|---|
| **Production Queen (Phase 3)** | What content FORMAT gets retrieved, not just cited. Bullet vs table vs FAQ structure choice has measurable effect. |
| **E6 Authority Tracker** | Which authority signals (gov sources, peer-reviewed, brand age) drive retrieval. Not just "cited" but "why cited." |
| **Distribution Queen (Phase 4)** | Where to push content to enter retrieval-eligible pool. Not just "rank on Google" — "be retrievable by AI." |
| **Strategic Queen synthesis** | Higher-quality gap scoring (gap with high retrieval-failure rate ranks higher than gap with low retrieval-failure rate) |

## What this changes architecturally (original capture)

### E5 schema (`ai_engine_responses` table — Day 10 design)

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

### E5 prompting strategy

Originally: query AI engine with gap question, parse citations.

Reframed: query AI engine with **3 query variants** per gap (verbatim Reddit phrasing, technical phrasing, casual phrasing) to surface retrieval pattern sensitivity. Capture full response shape, not just URLs.

### E5 dashboard panel

Originally: "What URLs does AI cite for our gaps?"

Reframed: "Retrieval Intelligence dashboard" — shows per-gap:
- Which AI engines retrieve correctly vs incorrectly
- Authority signal patterns (which source types win)
- Synthesis pattern (do AI engines treat this as comparison topic, list topic, narrative topic)
- Drift over time
- Cross-engine consistency

## What this affects (cross-doc impact)

- **ARCHITECTURE.md** → E5 section needs full rewrite. Old framing was 80 words; new framing is ~300 words and includes schema.
- **STRATEGIC-QUEEN-PHASE-2.md** → Section 8 (E5 GEO Scanner) → rename to "E5 Retrieval Intelligence" or keep "GEO Scanner" as bee_id but document new internal scope
- **Business Plan v1.1 → v1.2** → Section 2 (architecture) should reflect "Retrieval Intelligence" terminology; Section 11 (spin-offs) → Mireu (provisional name from E5) may need rename to reflect broader scope
- **DISCOVERIES.md** → index entry added
- **HOUSEKEEPING.md** → Add: "Bing AI Performance data source TBD — Microsoft has no public API; investigate alternatives Day N+"
- **HOUSEKEEPING.md** → Add: "Verify 'Retrieval Intelligence' isn't a Microsoft/Google product name before locking into spec"

## Related discoveries

- [2026-05-12 — Row-of-bees architecture](2026-05-12-row-of-bees.md) — E5 follows same source-agnostic pattern but is "self-contained" (no SERP→content two-step)
- [2026-05-12 — Spin-off product layer](2026-05-12-spin-off-product-layer.md) — E5 spinoff (Mireu, provisional) now has broader value proposition
- [2026-05-12 — AI Retrieval Optimization category](2026-05-12-ai-retrieval-optimization-category.md) — E5 is the measurement layer for this category
- [2026-05-12 — GEO/AEO Production Queen additions](2026-05-12-geo-aeo-production-queen-additions.md) — Retrieval Intelligence informs how to build the 10 GEO/AEO deliverables

## Honest disclosures (original)

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

## Day 10 Update — Empirical Confirmation + Architectural Realization

**Date appended:** 2026-05-13 (Day 10, ~10am AWST, mid-Phase 2 sprint)
**Context:** Attempted to ship E5 today during Strategic Queen Phase 2 closing push
**Outcome:** Empirically confirmed yesterday's hypothesis; surfaced foundational architectural principle worth its own Discovery Log entry

### Empirical confirmation of the API gap

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

### Decision: Pivot to E3, not Path C

Originally considered Path C (redefine E5 around working APIs like `GetQueryStats`, `GetPageStats`). Rejected because:

- Redefined E5 would be "Bing search visibility tracker" not "Retrieval Intelligence"
- That's not less of E5 — it's a different bee with the same name
- Shipping it pollutes `geo_citations` with proxy data we'd need to deprecate
- E3 has 29 rows of live data ready to consume RIGHT NOW (E2 closed Day 10)
- Phase 2 architecture spec doesn't include phrase tracking — needs proper CAB decision before scope expansion

Final call: E3 ships today, E5 deferred with full Retrieval Intelligence scope preserved for Day 30+ build.

### Operator-surfaced principle that triggered separate Discovery Log

During Day 10 architecture discussion, operator stated: "We need to always make sure our data loops and is a benefit to the whole hive."

Then expanded: "We self govern and report and learn all the time. Our bees need to get smarter all the time. What 1 hive learns they all need to learn (outside of their niche intelligence). We share knowledge in COLE."

This is **bigger than per-bee documentation.** It's a system-wide knowledge propagation principle requiring its own Discovery Log entry.

→ See `cole-marketing/2026-05-13-cole-knowledge-propagation.md` (same date, separate doc, foundational principle)

E5 inherits the principle (when built Day 30+) as one of many consumers, not as the bee that defines it.

### What E5 v1 should still capture (when built Day 30+)

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

### Cross-doc impact additions (Day 10)

- `cole-marketing/2026-05-13-cole-knowledge-propagation.md` — NEW Discovery Log entry covering self-governance + continuous learning + cross-hive knowledge sharing
- `ARCHITECTURE.md` → Add "Knowledge Propagation Architecture" section (foundational, not E5-specific)
- `HIVE-KNOWLEDGE-FLOW.md` → New doc describing data flow between bees → queens → hives → COLE orchestrator
- `BUSINESS-PLAN-v1.2` → Section on continuous learning + cross-site knowledge transfer

### Housekeeping items added Day 10 (Retrieval Intelligence specific)

- **#56** — Spec E5 blocked: Microsoft AI Performance API does not exist (May 2026 confirmed). Monthly Microsoft API status check.
- **#57** — Manual Bing AI Performance dashboard review cadence: weekly screenshot/paste into Notion until API exists.
- **#60** — E5 Phrase Propagation Tracker (Day 30+): genuine retrieval intelligence bee with phrase probing + paraphrase detection + queen-routing per loop logic.
- **#61** — Citation Seeding strategy (Day 30+): deliberately publish unique terminology designed to be tracked.
```

===== FILE 1 END =====

---

===== FILE 2 START =====

Filename: `2026-05-13-cole-knowledge-propagation.md`

```markdown
# COLE Knowledge Propagation: Self-Governing, Continuously Learning Hives

**Date created:** 2026-05-13 (Day 10, ~10:30am AWST)
**Context:** Surfaced during Strategic Queen Phase 2 closing push, while discussing E5 deferral and hive-loop principle for individual bees
**Trigger:** Operator stated: "We need to always make sure our data loops and is a benefit to the whole hive... we self govern and report and learn all the time... what 1 hive learns they all need to learn (outside of their niche intelligence)... we share knowledge in COLE"
**Status:** Foundational architectural principle — affects every queen, every bee, every site hive, the COLE orchestrator itself

---

## What we realized

Earlier Day 10 captured "hive feedback loop" as a per-bee documentation requirement (housekeeping #62) — every bee's output must route to a queen action.

But that framing missed the bigger structure. Operator's full statement reveals **three architectural principles in one**:

### Principle 1 — Self-Governance

Hives audit themselves. Not just operator audits them.

Each queen exports its own assessment:
- What worked
- What didn't  
- What pattern is emerging
- What it would change next month

This is queen-internal cognition, not external monitoring.

### Principle 2 — Continuous Learning

Bees improve over time. Not just execute fixed code.

When a bee's accuracy improves (e.g., E2c StackExchange URLs filter to 95% relevance vs 30% baseline), that improvement must:
- Be measured
- Be persisted (so we don't lose it on cron retry)
- Be teachable to similar bees (e.g., E2c learns → E2 future bees inherit)

### Principle 3 — Cross-Hive Knowledge Sharing

What one hive learns, all hives learn. Outside their niche intelligence.

Site A's taxchecknow hive discovers "ATO citations rank highest with table-format answers." Site B's theviabilityindex.com hive **automatically inherits** that knowledge.

Niche intelligence (Site A's specific tax rules) stays in Site A. Meta-intelligence (table-format > prose for authority sources) propagates across all hives.

## Why this matters

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

## What this architecturally requires

### Layer 1 — Bee-level metrics capture

Every bee must produce structured metrics on every run:
- Did it succeed?
- What was its cost?
- What was its accuracy?
- What surprised it (errors, edge cases)?
- What rules did it learn (e.g., "this URL pattern always fails", "this prompt shape works best")?

Schema TBD but lives in `bee_run_metrics` table or similar.

### Layer 2 — Queen-level synthesis

Each queen reads its bees' metrics and synthesizes:
- "Across 30 days, E2 learned that StackExchange URLs filter to 95% relevance when subdomain regex excludes meta + drupal"
- "E1 learned that Anthropic and Gemini disagree on tax topics 40% of the time but agree on 95% on geographic topics"

Queens produce `queen_monthly_lessons` rows.

### Layer 3 — Hive-level report

Each site hive (4 queens combined) produces monthly report:
- Niche lessons (specific to this site's topic/jurisdiction)
- Meta-lessons (generalizable to other hives)
- Open questions for COLE orchestrator
- Phase-upgrade candidates for CAB

Lives in `hive_monthly_reports` table.

### Layer 4 — COLE orchestrator (cross-hive)

COLE reads all hive reports. Performs three actions:

**Action A — Cross-hive propagation:**
Takes meta-lessons from Hive A and pushes them to Hive B/C/D.
Each receiving hive's queens incorporate the lesson into their next-cycle prompts/configs.

**Action B — Phase-upgrade triggers:**
If multiple hives independently report the same problem ("Production Queen needs better story-shaping for fear emotions"), surface to CAB as phase-upgrade candidate.

**Action C — Anti-pattern detection:**
If hives report contradictory lessons, surface for human resolution.

### Layer 5 — CAB integration

CAB receives phase-upgrade candidates from COLE orchestrator.
Operator approves/rejects.
Approved upgrades flow back to all hives as architecture changes.

## What this changes about current build

### Immediate (Day 10-15)

**Every bee being built now needs a metrics capture mechanism.** Not added later — added now while bees are small.

- E2 (closed today) needs metrics retroactively added — what did it learn this fire? Captured in agent_log via `e2_bee_completed` rows but no structured lesson extraction yet
- E3 (today's build) must include lesson capture from day 1
- All future bees inherit this requirement

### Phase 2 close (Day 14-21)

After Strategic Queen Phase 2 ships, **build Phase 3 of Strategic Queen as Knowledge Propagation Layer** before Production Queen Phase 2.

Specifically:
- `bee_run_metrics` table (per-run granular metrics)
- `queen_monthly_lessons` table (queen-level synthesis)
- `hive_monthly_reports` table (cross-queen aggregation)
- `cole_orchestrator_log` table (cross-hive propagation actions)
- Monthly cron: queen lesson extraction
- Quarterly cron: hive report compilation
- COLE orchestrator decision logic

### Phase upgrades (Day 30+)

Hive reports start producing phase-upgrade candidates organically. CAB pipeline expands beyond "operator notices problem" to "system surfaces problem."

## Cross-doc impact

- `ARCHITECTURE.md` → New top-level section "Knowledge Propagation Architecture" 
- `STRATEGIC-QUEEN-PHASE-3.md` → Becomes Knowledge Propagation Layer (was previously planned as something else; needs reassignment)
- `HIVE-KNOWLEDGE-FLOW.md` → New doc with full data flow diagram
- `BUSINESS-PLAN-v1.2` → Section 4 (architecture moat) leads with knowledge propagation as primary differentiation
- `CAB-PROCESS.md` → Update to receive system-surfaced phase-upgrade candidates
- `HOUSEKEEPING.md` → Items #62-65 reframed (see below)

## Reframing of Day 10 housekeeping items

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

## Honest disclosures

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

## Related discoveries

- [2026-05-13 — E5 Retrieval Intelligence](2026-05-13-e5-retrieval-intelligence.md) — E5 is one consumer of this architecture; its `cross_hive_lesson_id` field connects to this layer
- [Earlier discoveries needing review] — Row-of-bees architecture, AI Retrieval Optimization category, Spin-off product layer — all should be re-read against this knowledge propagation framing

## Next-session awareness

**The next Strategy Chat needs to know:**

1. Knowledge Propagation is now THE foundational COLE architecture, not E5-specific
2. Every bee built from Day 10 forward needs metrics capture forward-compatible with `bee_run_metrics` schema (Layer 1)
3. Strategic Queen Phase 3 is reassigned to Knowledge Propagation Layer implementation
4. Phase upgrades will increasingly be system-surfaced + CAB-approved, not just operator-initiated
5. Discovery Logs themselves embody the principle — when operator surfaces a system-wide insight, capture it immediately as Discovery Log entry, not housekeeping
```

===== FILE 2 END =====

---

## How to use this file

1. Open this combined file
2. Copy contents between `===== FILE 1 START =====` and `===== FILE 1 END =====` markers (excluding the markers themselves and the `filename:` line)
3. Save as `cole-marketing/2026-05-13-e5-retrieval-intelligence.md` (overwrites existing)
4. Copy contents between `===== FILE 2 START =====` and `===== FILE 2 END =====` markers (excluding the markers themselves and the `filename:` line)
5. Save as `cole-marketing/2026-05-13-cole-knowledge-propagation.md` (new file)

The text inside the triple-backtick code blocks is what you paste into the .md files. Don't include the triple backticks themselves — they're just formatting for this combined file.
