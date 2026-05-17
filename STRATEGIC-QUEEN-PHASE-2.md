# STRATEGIC QUEEN — PHASE 2 SPEC (v3.0)

**Status:** DESIGN LOCKED — ready to build  
**Version:** 3.0 (Day 8 rewrite, post-Phase-1-infrastructure audit)  
**Date:** 2026-05-11 AWST  
**Supersedes:** STRATEGIC-QUEEN-PHASE-2-v2-ARCHIVED.md (architecturally invalid — assumed parallel infrastructure that already existed in superior form)  
**Builds against:** TaxCheckNow (first overlay, proof of model)  
**Phase 1 dependency:** ✅ Phase 1 close-out complete (PHASE-1-CLOSE-OUT.md)  
**Architectural foundation:** ✅ Phase 1 citation gap cluster discovered and documented (Sections 2-3 below)  
**Decision register:** All 28 architectural decisions captured in DAY-7-DECISIONS-CAPTURED.md, integrated here

---

## Version History — Why v3.0 Exists

### v1.0 (Day 7 draft)

Initial Phase 2 spec written from Phase 1 close-out + Vanilla Template Rollout doc context. Single-author conception. Approximately accurate but un-audited against actual Supabase schema state.

### v2.0 (Day 8 morning)

Rewritten with 28 architectural decisions integrated. Added CORE/OVERLAY discipline, blacklist + cluster scaffolding, two-score synthesis, decay_class, E7 reordered to position 3. Strong architecture but **factually wrong about existing infrastructure** — proposed parallel tables (`authority_changes`, parallel `geo_citations` schema, etc.) that duplicated thoughtfully-designed Phase 1 infrastructure I didn't have in context.

### v3.0 (Day 8 audit-corrected) ← THIS DOCUMENT

Written AFTER systematic audit of Supabase public schema (70 tables, see Section 2.4). Discovered:

- `citation_gaps` + `truth_tables` + `legal_sources` + `deadlines` + `jurisdictions` form a canonical citation gap cluster designed for exactly this work
- `rule_changes` table designed for E7's exact job (better-architected than v2.0's proposed `authority_changes`)
- `geo_citations` already exists with richer schema than v2.0 proposed
- `competitors` exists as registry — E4 reads, doesn't recreate
- `product_research` exists as GOAT qualification gate — entirely missing from v2.0
- `psychology_insights`, `lessons_learned`, `*_research` exist but serve different purposes (Adaptive Queen, not E-bees)

v3.0 corrects these errors. Phase 2 creates 4 new tables instead of 7. Leverages Phase 1's superior architecture. Adds explicit GOAT qualification gate that v2.0 missed entirely.

**The audit-first protocol that produced these discoveries is documented as Phase 1 of the COLE-QUEEN-BUILD-PROCESS for every future queen build.**

---

## 0. Macro Thesis

> **AI engines are creating a massive stale-information layer across the internet.**

This is most acute in:

- Tax law and compliance
- Visa and immigration rules
- Legal and regulatory matters
- Financial product mechanics
- AI tooling and workflows
- Government programs

The future internet problem is not lack of information. It is **outdated synthetic certainty**.

When ATO publishes new guidance, AI engines trained on pre-update data continue answering with the old rule. That gap between authority change and AI training cutoff is not temporary — it is a permanent structural feature of how LLMs work.

**The temporal lag between authority changes and AI training cutoffs is the permanent business window.**

Strategic Queen Phase 2 exists to detect this lag, score the opportunity it creates, qualify it through a 7-gate GOAT filter, and route the survivors to product creation.

### The category we are building

Not generic GEO tooling. Not generic AI visibility tracking. Not generic SEO content generation.

**Authority Gap Intelligence:**

> Find where AI engines are wrong against official sources, then build the story, product, and content that captures the gap before competitors realize it exists.

This is genuinely defensible. Adjacent tools (Profound, Otterly, AthenaHQ, GenOptima, Sight AI, AEO Engine) monitor citations or track AI visibility. None close the loop from gap detection → qualification gate → calculator → story → carousel → publish → measure → compound. **The full vertical is the moat.**

### Why now

The window is ~12-18 months. By 2027-2028, AI citation tracking will be commoditized. The moat by then must be **the vertical integration**, not the detection. Phase 2 builds detection + qualification. Phases 3-4 deepen vertical integration. Phase 1 already validated the principle (16 Bing citations earned across 5 URLs in 7 days on a 10-day-old site — empirical proof).

---

## 1. CORE / OVERLAY Architectural Rule

This is the single most important architectural rule in COLE. It is non-negotiable and threads through every component in Phase 2.

### 1.1 The rule

Strategic Queen and every E-station bee ship as **vanilla CORE code that works on any niche**. Niche-specific knowledge lives in **per-site OVERLAY configuration**.

```
SOVERELLA CORE (code, ships once)         DOMAIN OVERLAY (config, per site)
─────────────────────────────────         ──────────────────────────────────
E1 query logic                            authoritative_sources list
E1 disagreement detection                 validation_rules
E1 source-validation function             topic_universe
E2 forum scraping logic                   subreddit_list per niche
E3 fear/objection extractor               niche-specific emotional triggers
E4 competitor scraping                    competitor_id_list per niche (FK to competitors)
E6 velocity math                          velocity_thresholds per niche
E7 RSS reading                            authority_rss_feeds per niche
GOAT qualification logic                  GOAT gate thresholds per niche
Strategic Queen route                     signal_weights
Synthesis layer prompt template           product_authority_map
Priority decay math                       decay_rate_overrides per niche
gap_queue / decisions / handoffs          character_voice_map
```

### 1.2 The acceptance test

**Phase 2 is "vanilla-correct" when:**

A second overlay (e.g., Claude Code courses, or a stub of any non-tax niche) can be added by:

1. Creating a new overlay config file at `overlays/<newsite>/strategic.json`
2. NOT touching any code in `lib/bees/e*.ts`, `lib/queens/strategic-queen-*.ts`, `lib/overlay/`, `lib/cluster/`, or `app/api/cron/`
3. Running the same crons, getting niche-appropriate gap_queue rows

If any code change is required to onboard the second overlay, Phase 2 is incomplete and CORE/OVERLAY boundaries need fixing before sign-off.

### 1.3 The geography rule

Geography is overlay configuration, never CORE assumption.

- No CORE code assumes the user is from any particular country
- No CORE code references ATO, HMRC, IRS, ATO, CRA, IRD-NZ by name
- All authority routing comes from `overlay.product_authority_map`
- All jurisdiction references go through the existing `jurisdictions` table (AUS, USA, UK, CAN, ESP — already seeded)
- Country derivation from product key prefix happens via overlay rule, not hardcoded if/else

### 1.4 Where this rule applies

Every section below marks each component as **[CORE]**, **[OVERLAY]**, or **[CORE consuming OVERLAY]**. No mixed-purpose code allowed.

### 1.5 What this rule prevents

| Anti-pattern | Why it's banned |
|---|---|
| `if (site === 'taxchecknow') { ... }` | Hardcoded site logic in CORE |
| `if (countryCode === 'AU') { fetchATO() }` | Hardcoded authority in CORE |
| Hardcoded subreddit lists in CORE | Per-niche config must come from overlay |
| Hardcoded jurisdiction codes in CORE | Must reference `jurisdictions` table |
| Tax-specific terminology in prompt templates | Generic terminology in CORE, niche substitution from overlay |
| Hardcoded character names in CORE | Character voice from overlay |
| Hardcoded fear language patterns | Niche-specific psychology from overlay |
| Hardcoded competitor URLs | Must reference `competitors` registry filtered by overlay |

---

## 2. Phase 1 → Phase 2 Transition

### 2.1 What Phase 1 proved

- Strategic Queen route + gap_queue + decisions + handoffs LIVE end-to-end
- Signal-gather → Sonnet → decisions → handoffs pattern works (run_id `baa4843b...` produced 3 decisions + 3 handoffs)
- Manual gap_queue seeding produces ranked output
- 7 public assets published for au-19, 16 Bing AI citations earned
- 5 monitor dashboards LIVE

### 2.2 What Phase 1 ALSO had (which v2.0 spec missed)

The Day 8 audit (Section 2.4) revealed Phase 1 includes substantial citation gap infrastructure that was operator-curated waiting for automation:

#### 2.2.1 The Citation Gap Canonical Cluster

Five tables form a normalized, jurisdiction-anchored citation gap dictionary:

```
citation_gaps (DICTIONARY: 5 seed rows, all is_active=true, AUS jurisdiction)
├── jurisdiction_code, gap_name, gap_title
├── law_name, law_section, enacted_date
├── ai_drift_description (what AI gets wrong, free-text)
├── verified_by (comma-separated engine list: "gemini,claude,perplexity,grok,chatgpt")
├── demand_score, complexity_score, ai_drift_score, financial_impact_score, total_score
├── is_active
│
├──→ truth_tables (RULES: structured rule_key/rule_value pairs, FK gap_id)
│    ├── rule_key ("div296_threshold"), rule_value ("3000000"), rule_type ("currency")
│    ├── effective_date, expiry_date
│    ├── source_url, source_name, last_verified, is_current
│    └── Sample: 3 rows linked to Div 296 cost-base reset gap
│
├──→ legal_sources (CITATIONS: authority references, FK gap_id)
│    ├── source_type ("legislation" | "guidance" | "ruling"), title, section, url
│    ├── enacted_date, verified_date, is_current
│    └── Sample: Division 296 Tax Act + ATO PCG 2026/1 linked
│
├──→ deadlines (TIME-SENSITIVITY: hard/soft deadlines, FK gap_id)
│    ├── deadline_date, urgency_type ("hard" | "soft")
│    ├── description, messaging_key, is_active
│    └── Sample: June 30 2026 hard deadline for Div 296 cost-base reset
│
└── jurisdictions (REFERENCE: country codes)
    ├── AUS active, USA active, UK/CAN/ESP inactive (planned)
    └── code, name, currency, flag_emoji, region, is_active
```

This is the **canonical citation gap dictionary**. Currently operator-curated (5 gaps seeded 2026-04-13). E1's job is to populate this automatically.

#### 2.2.2 The GOAT Qualification Gate

```
product_research (QUALIFICATION GATE: 7 boolean gates + computed score)
├── topic, country, site
├── citation_gap_confirmed (boolean) — overall verdict
├── ai_error, correct_answer (the gap content)
├── 7 GATE BOOLEANS:
│   ├── gate_ai_error          — AI is demonstrably wrong
│   ├── gate_gov_anchor        — Authority source exists and clear
│   ├── gate_binary_question   — Can be framed as yes/no
│   ├── gate_deadline          — Time-sensitive hard date involved
│   ├── gate_threshold         — Specific numeric threshold involved
│   ├── gate_scale             — Affects meaningful population
│   └── gate_goat_blocks       — All GOAT content blocks satisfiable
├── gates_passed (integer count), block_scores (jsonb), goat_score (numeric)
├── binary_question, threshold, deadline_date, affected_count
├── gov_urls (text[])
├── recommendation ("BUILD" or "NO_GO")
├── no_go_reason, alternative_topic
├── config_skeleton (jsonb) — pre-filled product config ready to ship
└── research_status, created_at, updated_at
```

**This is the gate between E1's discovery and gap_queue's prioritization.** Topics that don't pass the 7 gates don't become products. Phase 1 designed this gate to prevent low-quality citation gaps from polluting the pipeline.

#### 2.2.3 E7's Existing Home: `rule_changes`

```
rule_changes (AUTHORITY CHANGE DETECTION: E7's exact table)
├── detected_at, source_url, source_title
├── change_summary, change_diff
├── affected_products (text[])
├── alert_sent, alert_sent_at
├── change_status, reviewed_by, reviewed_at, action_taken
├── config_updated, regenerated, regenerated_at
```

Purpose-built for E7 Truth-Sync Monitor. v2.0 proposed creating `authority_changes` — a strictly inferior duplicate. v3.0 uses `rule_changes`.

#### 2.2.4 E5's Existing Home: `geo_citations`

```
geo_citations (AI CITATION TRACKING: E5's existing table)
├── site, product_key, character_name
├── ai_model, question_asked, cited_url, cited_content_type
├── citation_position, full_response, citation_quote
├── competitors_cited (text[]) ← substitution data already supported
├── discovered_by, discovery_date, last_verified
├── status, notes, created_at
```

Already richer than v2.0's proposed schema. Includes character_name (links to Gary/Sarah/Priya), full_response (audit trail), competitors_cited (substitution detection in same table). E5 writes here.

#### 2.2.5 E4's Reference Registry: `competitors`

```
competitors (COMPETITOR REGISTRY: not signals)
├── name, url, country
├── weakness, our_advantage
├── found_at
```

Operator-curated registry of competitors to monitor. E4 READS from here (to know which URLs to scrape), WRITES per-gap analysis to a new `competitor_signals` table (Phase 2 creates).

#### 2.2.6 Adjacent learning infrastructure (NOT Phase 2 scope)

| Table | Purpose | Why Phase 2 doesn't touch it |
|---|---|---|
| `psychology_insights` | Per-product conversion intelligence (best fear amount, demographic, UTM) | Adaptive Queen / K12 territory — post-conversion learning, not pre-conversion signal |
| `lessons_learned` | Formal pattern detection with operator approval workflow | Adaptive Queen Phase 2 territory |
| `research_questions` | Weekly aggregated research patterns | Adaptive Queen weekly digest |
| `li_research`, `x_research`, `ig_research`, `yt_research` | Weekly platform aggregations | Adaptive Queen Phase 2 weekly summarization |
| `content_assets`, `content_jobs`, `content_performance` | Production pipeline state | Production Queen territory |
| `chaos_angles`, `viral_templates`, `hook_matrix` | Content variation library | Production Queen territory |

These tables exist and are well-designed for their purposes. Strategic Queen Phase 2 does NOT write to any of them. Mentioning them here so they're not accidentally reinvented.

### 2.3 What Phase 2 changes

| Aspect | Phase 1 state | Phase 2 state |
|---|---|---|
| citation_gaps population | Operator-curated (5 rows, all AUS) | E1 + E7 auto-populate, growing daily |
| truth_tables population | Operator-curated (3 rows for Div 296) | E1 captures structured rules from authority sources |
| legal_sources population | Operator-curated (3 rows) | E1 + E7 auto-capture authority citations |
| deadlines population | Operator-curated (3 rows) | E7 auto-captures from authority publications |
| rule_changes population | Empty (designed, unused) | E7 writes detected authority changes here |
| product_research population | Schema designed (status unclear) | E1's discoveries flow through here for GOAT qualification |
| geo_citations population | Empty (schema-ready) | E5 writes citation tracking here |
| competitors population | Operator-curated (3 rows) | E4 reads as registry, may extend during maturation |
| gap_queue seeding | Manual (3 rows) | Strategic Queen reads citation_gaps + product_research → writes operational priorities |
| Signal sources for Strategic Queen | gap_queue + observations | gap_queue + citation_gaps + truth_tables + 4 new signal tables + existing rule_changes + existing geo_citations |
| Synthesis output | Single priority_score | Two scores: opportunity_score + build_timing_score |
| Priority decay | None — scores stay forever | 5%/week decay unless refreshed, per-class rates via decay_class |
| Memory | Operator-curated strategic_queen_memory | Unchanged (K12 promotion is Adaptive Queen scope) |
| AI consensus signal | None | citation_gaps.verified_by populated by E1; ai_consensus_score on gap_queue derived |
| Source validation | None | E1 validates engine responses against truth_tables.rule_value (structured) + legal_sources (citations) |
| Authority change detection | None | E7 watches authority feeds → writes to rule_changes → updates citation_gaps + deadlines |
| Cluster data layer | None | Blacklist + territory map files; citation_gaps already provides jurisdiction-level routing data |

### 2.4 The Day 8 Audit That Made v3.0 Necessary

Before any code touched disk on Day 8, Section 13 of v2.0 had a pre-migration audit specification (Queries A1-A4). Running A3 revealed `geo_citations` already existed with a different schema than v2.0 proposed.

Investigation expanded to a full schema audit:

| Audit batch | What was checked | Result |
|---|---|---|
| Batch 1 | citation_gaps cluster (citation_gaps, truth_tables, legal_sources, deadlines, jurisdictions) | Major discovery: Phase 1 designed canonical citation gap infrastructure waiting for E1/E7 to populate |
| Batch 2 | psychology_insights, competitors, rule_changes, lessons_learned | rule_changes = E7's exact table. competitors = E4 registry. psychology_insights ≠ E3 (different purpose). lessons_learned = Adaptive Queen scope. |
| Batch 3 | product_research, research_questions, li_research | product_research = GOAT qualification gate (entirely missing from v2.0). research_questions + *_research = weekly aggregations, Adaptive Queen scope. |

**Total audit time:** ~75 minutes  
**Surprises caught pre-implementation:** 3 major (citation_gaps cluster, rule_changes vs authority_changes, product_research gate)  
**Phantom tables prevented from creation:** 3 (authority_changes, parallel geo_citations, parallel psychology table)  
**Phantom architecture prevented:** Major (E1 writing directly to gap_queue bypassing GOAT gate)  

This audit-first protocol (Protocol #17) saved at minimum a multi-day recovery from half-applied migration and post-implementation architectural rework. The discipline is now Protocol #34 in COLE-QUEEN-BUILD-PROCESS:

> **Protocol #34 (Day 8 discovered):** Before any Phase 2 schema migration, run a full `information_schema.tables` audit of the target database. Cross-reference every proposed CREATE TABLE against existing schema. The cost is ~30 minutes of queries; the cost of skipping it is potentially days of recovery from half-applied migrations.

---

## 3. Component Inventory

### 3.1 New bees (E-station)

| Bee | Purpose | Status | Writes to | Reads from |
|---|---|---|---|---|
| **E1 Citation Gap Scanner** | Multi-engine query → disagreement → source validation → GOAT qualification → classification | 🆕 BUILD | citation_gaps, truth_tables, legal_sources, ai_engine_responses, authority_source_snapshots, product_research, gap_queue | overlay.topic_universe, overlay.authoritative_sources, truth_tables (for validation) |
| **E7 Truth-Sync Monitor** | RSS-watch authority feeds for rule changes; updates canonical cluster | 🆕 BUILD | rule_changes, citation_gaps, legal_sources, deadlines | overlay.authority_rss_feeds, citation_gaps (for affected_product detection) |
| **E2 Market Researcher** | Reddit/forum/search collection + question extraction (raw daily output) | 🆕 BUILD | market_research_signals (NEW) | overlay.market_research_sources, citation_gaps |
| **E3 Customer Psychologist** | Fear/objection/urgency extraction from E2 outputs | 🆕 BUILD | psychology_signals (NEW) | market_research_signals, overlay.psychology_triggers |
| **E4 Competitor Monitor** | Competitor claim tracking per citation gap | 🆕 BUILD | competitor_signals (NEW) | competitors registry, citation_gaps |
| **E6 Trend Velocity Scanner** | Velocity-weighted volume per citation gap | 🆕 BUILD | trend_signals (NEW) | overlay.keyword_universe, citation_gaps |
| **E5 GEO Scanner** | Bing Webmaster API + shadow queries for citation tracking | 🆕 BUILD | geo_citations (existing schema), competitors_cited array | content_performance, citation_gaps |
| **E8 Search Opportunity Scanner** | Google/Bing intent gaps + SERP feature opportunities | ⏸ DEFER Phase 3 | — | — |

### 3.2 Strategic Queen extensions

| Extension | Purpose | Build effort |
|---|---|---|
| **Synthesis Layer** | Cross-bee synthesis with two-score output (opportunity + timing) reading from citation_gaps + product_research + signal tables | 0.5 day |
| **GOAT Qualification reader** | Strategic Queen prioritizes gap_queue rows linked to product_research entries with goat_score above threshold | 2-3 hours (bundled with synthesis) |
| **Confidence-in-ranking field** | Each ranked opportunity gets confidence + reasoning + signal coverage assessment | bundled with synthesis |
| **Citation gap linker** | Strategic Queen writes citation_gap_id + product_research_id on gap_queue rows it prioritizes | bundled with synthesis |

### 3.3 New cron + infrastructure

| Component | Purpose | Build effort |
|---|---|---|
| **Priority Decay cron** | Daily pass on gap_queue, decay 5%/week unless refreshed, per-class rates via decay_class | 2-3 hours |
| **Overlay loader** | CORE function to load + validate overlay config per site | 0.5 day |
| **Overlay schema validator** | JSON Schema that validates overlay config shape | 0.5 day (bundled) |
| **Shared blacklist filter utility** | `lib/cluster/blacklist-filter.ts` — every bee calls before queries | 2-3 hours |

### 3.4 Schema additions (Phase 2 Step 0 migration — CORRECTED v3.0)

#### 3.4.1 gap_queue extensions (4 new columns)

| Column | Type | Purpose |
|---|---|---|
| `citation_gap_id` | UUID FK to citation_gaps(id) | Links operational queue to canonical gap |
| `product_research_id` | UUID FK to product_research(id) | Links to GOAT qualification result |
| `topic_tags` | TEXT[] | Cluster data layer routing (Phase 3) |
| `cluster_routing_proposal` | JSONB | Reserved for COLE Orchestrator Phase 3 |
| `decay_class` | TEXT with CHECK | Per-class decay rates |

Note: Day 7 already added `opportunity_classification`, `last_signal_refreshed_at`, `ai_consensus_score`.

#### 3.4.2 strategic_queen_decisions extensions (3 new columns)

| Column | Type | Purpose |
|---|---|---|
| `opportunity_score` | NUMERIC CHECK 0-1 | Two-score model — should we build? |
| `build_timing_score` | NUMERIC CHECK 0-1 | Two-score model — when? |
| `signals_jsonb` | JSONB | Full signal snapshot for audit |

#### 3.4.3 New tables (4 only — down from v2.0's 7)

| Table | Purpose | FK to |
|---|---|---|
| `market_research_signals` | E2 raw daily output (Reddit/forum mentions, question samples) | gap_queue.id, citation_gaps.id |
| `psychology_signals` | E3 fear/objection/urgency extraction per gap | gap_queue.id, citation_gaps.id |
| `competitor_signals` | E4 per-gap competitor analysis (uses competitors registry) | gap_queue.id, citation_gaps.id, competitors.id |
| `trend_signals` | E6 velocity-weighted volume per gap | gap_queue.id, citation_gaps.id |

#### 3.4.4 Tables NOT created (v2.0 mistakes)

| v2.0 proposed | v3.0 reality |
|---|---|
| ❌ authority_changes (CREATE) | ✅ Use existing `rule_changes` |
| ❌ geo_citations (CREATE — would collide) | ✅ Use existing `geo_citations` |
| ❌ competitor_substitution (CREATE) | ✅ Use existing `geo_citations.competitors_cited` array column |

### 3.5 Cluster data layer (Approach A scaffolding)

Per Decision 29, Phase 2 ships forward-compatible data structures that COLE Orchestrator (Phase 3) will use:

| Component | Purpose | Where |
|---|---|---|
| `niche` overlay section | Each site declares its claim_radius + explicit_exclusions | `overlays/<site>/strategic.json` |
| `cluster-config/blacklist-v1.json` | Cluster-wide categorical/ethical/regulatory/brand exclusions | New file at repo root |
| `cluster-config/territory-map.json` | List of active + planned territories with site assignments | New file at repo root |
| `lib/cluster/blacklist-filter.ts` | Shared utility every bee calls before queries | New file |
| `gap_queue.topic_tags` column | E1 outputs topic tags per gap for routing | Schema column added |
| `gap_queue.cluster_routing_proposal` column | Future: COLE Orchestrator writes routing decisions | Schema column added |

Existing `jurisdictions` table provides jurisdiction-level routing already — Phase 2 doesn't duplicate. citation_gaps.jurisdiction_code is the authoritative routing field.

### 3.6 Phase 1 tables used as-is (no changes)

| Table | How Phase 2 uses it |
|---|---|
| `jurisdictions` | Reference data for citation_gaps.jurisdiction_code FK |
| `citation_gaps` | E1 + E7 write; Strategic Queen reads |
| `truth_tables` | E1 writes structured rules from authority sources; E1 validates engine responses against |
| `legal_sources` | E1 + E7 write authority citations; Synthesis Layer reads for source quality scoring |
| `deadlines` | E7 writes; Synthesis Layer reads for build_timing_score (hard vs soft urgency multiplier) |
| `rule_changes` | E7 writes detected authority changes; operator approval workflow |
| `geo_citations` | E5 writes Bing + shadow query results; competitor substitution in `competitors_cited` |
| `competitors` | E4 reads as registry; operator-curated, may extend during maturation |
| `product_research` | E1 writes qualification results (after 7-gate evaluation); Strategic Queen reads goat_score |
| `gap_queue` | Strategic Queen writes operational priorities; existing table with new columns |
| `strategic_queen_decisions` | Strategic Queen writes synthesis output; existing table with new columns |
| `strategic_queen_handoffs` | Strategic Queen writes to Production Queen; unchanged |
| `strategic_queen_memory` | Strategic Queen reads for institutional learning; unchanged (K12 promotion is Adaptive Queen) |
| `strategic_queen_recommended_actions` | Strategic Queen writes action recommendations; unchanged |
| `agent_log` | Every bee logs here; unchanged |
| `content_performance` | E5 reads for URL-to-topic mapping; otherwise unchanged |
| `ai_engine_responses` | E1 raw audit trail (Day 7 created) |
| `authority_source_snapshots` | E1 proof of "engines wrong" (Day 7 created) |

---

## 4. E1 Citation Gap Scanner — Detailed Spec

E1 is the flagship. The defensible moat. The single bee that makes "Citation Gap Commerce Engine" a real category, not marketing copy.

### 4.1 Purpose

E1 does NOT just detect AI engines disagreeing. Pure disagreement detection produces false positives — LLMs hallucinate even on settled questions. E1 detects the higher-value signal:

**AI engines giving answers that contradict structured rules from authoritative sources.**

The key word is "structured." Phase 1's `truth_tables` stores facts as `(rule_key, rule_value, rule_type)` tuples — e.g., `("frcgw_threshold", "0", "currency")` — making programmatic comparison possible. v2.0's spec relied on Sonnet text comparison ("is this engine response wrong?"); v3.0 uses structured rule comparison ("does engine response cite a number matching truth_tables.rule_value?") with Sonnet as backup for non-numeric claims.

### 4.2 Pipeline (8 steps)

```
For each topic in overlay.topic_universe:

  STEP 0: Blacklist filter (NEW per Decision 19-21)
    → Call filterTopicUniverse([topic]) from lib/cluster/blacklist-filter.ts
    → If blocked: write agent_log skip row, continue to next topic

  STEP 1: Resolve canonical citation_gap
    → Query: SELECT * FROM citation_gaps WHERE gap_name = topic.gap_name 
             AND jurisdiction_code = topic.jurisdiction_code
    → If exists: use it (we'll update verified_by, total_score)
    → If not: this is a new gap, create row at STEP 7

  STEP 2: Query each engine in overlay.engines_to_query
    → POST to OpenAI/Anthropic/Gemini APIs with canonical_question text
    → Save raw responses to ai_engine_responses table with (site, topic, gap_id if known)

  STEP 3: Fetch authoritative source
    → For each topic, overlay.authoritative_sources defines lookup strategy
    → Fetch URL via HTML-to-markdown adapter
    → Cache snapshot in authority_source_snapshots table (7-day cache per overlay.fetch_strategy)

  STEP 4: Structured rule extraction (NEW v3.0)
    → Read existing truth_tables rows where gap_id matches
    → If new gap: Sonnet extracts (rule_key, rule_value, rule_type, effective_date, expiry_date) tuples from fetched source
    → Write new truth_tables rows linked to gap_id, is_current=true, source_url+source_name populated
    → Write/update legal_sources rows for canonical citations (source_type, title, section, url, enacted_date)

  STEP 5: Structured comparison (NEW v3.0)
    → For each truth_tables rule for this gap:
        → Parse each engine response for citations of this rule_key
        → If engine cites a value, compare to rule_value:
            - rule_type 'currency': numeric comparison with tolerance
            - rule_type 'percentage': numeric comparison
            - rule_type 'date': date comparison
            - rule_type 'text': Sonnet semantic comparison
        → Record per-engine match/mismatch in working memory

  STEP 6: Sonnet validation pass (FALLBACK + NUANCE)
    → For aspects of the topic not captured in structured rules:
        → Sonnet pass: "Given this authoritative source [legal_sources content], 
                        are any of these engine answers demonstrably wrong on facts 
                        not already covered by structured rule comparison?"
        → Output: per-engine classification + reasoning

  STEP 7: Citation gap canonical write
    → Build verified_by string from engines that participated this run
      (e.g., "openai-gpt-4o-mini,anthropic-claude-sonnet-4-6,gemini-2.5-flash")
    → Compute scores:
        - ai_drift_score: count of engines wrong on structured rules (0-10)
        - financial_impact_score: from overlay.financial_impact_weights[gap_name]
        - demand_score: from existing truth_tables count + overlay
        - complexity_score: from overlay.complexity_map[gap_name]
        - total_score: weighted sum
    → If new gap: INSERT into citation_gaps (jurisdiction_code, gap_name, gap_title, 
                                                law_name, law_section, enacted_date,
                                                ai_drift_description, verified_by,
                                                demand_score, complexity_score, 
                                                ai_drift_score, financial_impact_score, 
                                                total_score, is_active=true)
    → If existing: UPDATE verified_by, ai_drift_description, scores
                    SET last_signal_refreshed_at = now()

  STEP 8: GOAT qualification gate
    → Evaluate 7 gates against this topic + collected evidence:
        - gate_ai_error: at least 2 of 3 engines wrong on structured rules
        - gate_gov_anchor: legal_sources has at least 1 row with is_current=true and source_type IN ('legislation', 'guidance', 'ruling')
        - gate_binary_question: overlay.topic_universe[topic].binary_question is non-empty
        - gate_deadline: deadlines has at least 1 row for this gap (any urgency_type)
        - gate_threshold: truth_tables has at least 1 row with rule_type IN ('currency', 'percentage')
        - gate_scale: overlay.topic_universe[topic].affected_count >= overlay.scale_threshold (default 1000)
        - gate_goat_blocks: overlay.goat_block_requirements all satisfiable (binary_question + threshold + deadline + financial_impact)
    → Compute gates_passed (integer 0-7), goat_score (numeric, weighted sum)
    → Compute recommendation:
        - 7 gates passed AND goat_score >= overlay.goat_threshold (default 0.7): "BUILD"
        - 5-6 gates: "BUILD_PENDING_OPERATOR"  
        - <5 gates: "NO_GO" + populate no_go_reason + alternative_topic suggestion
    → Build config_skeleton JSON (pre-filled product config keys/values from collected evidence)
    → INSERT into product_research (topic, country, site, citation_gap_confirmed,
                                     ai_error, correct_answer, all 7 gate booleans,
                                     gates_passed, block_scores, goat_score,
                                     binary_question, threshold, deadline_date,
                                     affected_count, gov_urls, recommendation,
                                     no_go_reason, alternative_topic, config_skeleton,
                                     research_status='qualified')

  STEP 9: Operational queue write (conditional)
    → IF recommendation IN ('BUILD', 'BUILD_PENDING_OPERATOR'):
        → UPSERT gap_queue row:
            - site, topic, ai_error, correct_law, search_volume (from overlay)
            - urgency: derived from deadlines.urgency_type (hard=urgent, soft=high)
            - recommended_product: from overlay.topic_to_product_map[topic]
            - recommended_character: from overlay.character_voice_map[site+country]
            - priority_score: 0.7 * goat_score + 0.3 * citation_gaps.total_score (normalized 0-100)
            - priority_tier: derived from priority_score (see Section 6.3 thresholds)
            - estimated_revenue_potential: from overlay.revenue_bands[goat_score_bucket]
            - competition_score: from competitors registry analysis (or default 5)
            - citation_gap_id: FK to citation_gaps row
            - product_research_id: FK to product_research row
            - topic_tags: from overlay.topic_universe[topic].topic_tags
            - decay_class: 'citation_gap_anchored'
            - last_signal_refreshed_at: now()
            - opportunity_classification: 'engines_wrong'
            - ai_consensus_score: 1.0 - (count engines wrong / total engines queried)
            - prioritised_by: 'e1-citation-gap-scanner'
            - status: 'pending_review' (operator approves via Strategic Queen dashboard)
    → IF recommendation = 'NO_GO':
        → Skip gap_queue write; product_research row preserves no_go_reason for audit

  STEP 10: Audit logging
    → Write 1 row to agent_log with run_id, cost_usd, tokens_in, tokens_out, 
      action='e1_completed', result with topic counts (qualified, no_go, skipped_blacklisted)
```

### 4.3 [CORE] vs [OVERLAY] in E1

**CORE (vanilla code, never changes per site):**

- Blacklist filter call (`lib/cluster/blacklist-filter.ts`)
- citation_gaps SELECT/INSERT/UPDATE logic
- Engine query loop (HTTP calls to OpenAI/Anthropic/Gemini)
- Source-fetch HTTP logic with retry + 7-day caching
- Sonnet rule extraction prompt template
- truth_tables write logic with structured rule comparison
- legal_sources write logic
- Sonnet validation prompt template (Step 6)
- 7-gate GOAT evaluation logic (Step 8)
- goat_score computation function
- config_skeleton builder
- gap_queue UPSERT logic (Step 9)
- Database writes to all referenced tables
- Score normalization math

**OVERLAY (per-site config, declarative):**

```jsonc
{
  "site_meta": {
    "site_key": "taxchecknow",
    "production_domain": "taxchecknow.com",
    "border_sensitivity": "strict",
    "primary_market_skew": "per-country",
    "niche": {
      "claim_radius_keywords": ["tax", "ATO", "HMRC", "IRS", "tax compliance", ...],
      "primary_authorities": ["ato", "hmrc", "irs", "ird-nz", "cra"],
      "explicit_exclusions": [
        "tax evasion (vs avoidance)",
        "specific medical advice in tax context",
        "celebrity tax gossip"
      ]
    },
    "product_authority_map": {
      "au-*":     { "authority": "ato",    "jurisdiction": "AUS", "language": "en-AU" },
      "uk-*":     { "authority": "hmrc",   "jurisdiction": "UK",  "language": "en-GB" },
      "us-*":     { "authority": "irs",    "jurisdiction": "USA", "language": "en-US" },
      "nz-*":     { "authority": "ird-nz", "jurisdiction": "NZL", "language": "en-NZ" },
      "can-*":    { "authority": "cra",    "jurisdiction": "CAN", "language": "en-CA" },
      "nomad-*":  { "authority": "irs",    "jurisdiction": "USA", "language": "en-US",
                    "note": "Nomad products are US persons abroad — IRS is home" }
    }
  },
  
  "engines_to_query": [
    {
      "name": "openai-gpt-4o-mini",
      "endpoint": "https://api.openai.com/v1/chat/completions",
      "auth_env_var": "OPENAI_API_KEY",
      "model": "gpt-4o-mini",
      "max_tokens": 800,
      "temperature": 0.1,
      "rate_limit_per_min": 60
    },
    {
      "name": "anthropic-claude-sonnet-4-6",
      "endpoint": "https://api.anthropic.com/v1/messages",
      "auth_env_var": "ANTHROPIC_API_KEY",
      "model": "claude-sonnet-4-6",
      "max_tokens": 800,
      "temperature": 0.1,
      "rate_limit_per_min": 50
    },
    {
      "name": "google-gemini-2-5-flash",
      "endpoint": "https://generativelanguage.googleapis.com/v1beta/...",
      "auth_env_var": "GOOGLE_API_KEY",
      "model": "gemini-2.5-flash",
      "max_tokens": 800,
      "temperature": 0.1,
      "rate_limit_per_min": 60
    }
  ],
  
  "topic_universe": [
    {
      "topic_id": "au-frcgw-threshold-15pct",
      "gap_name": "frcgw_threshold_change_2025",
      "jurisdiction_code": "AUS",
      "topic_label": "Foreign Resident CGT Withholding threshold and rate",
      "product_key": "au-19-frcgw-clearance-certificate",
      "canonical_question": "What is the current foreign resident capital gains withholding rate and property value threshold for Australian property sales?",
      "binary_question": "Does a clearance certificate need to be obtained for every Australian property sale regardless of price?",
      "affected_count": 250000,
      "topic_tags": ["tax", "frcgw", "property", "australia", "withholding"]
    },
    {
      "topic_id": "au-div296-cost-base-reset",
      "gap_name": "div296_cost_base_reset",
      "jurisdiction_code": "AUS",
      "topic_label": "Division 296 cost-base reset election for super > $3M",
      "product_key": "au-XX-div296-cost-base",
      "canonical_question": "Can the cost-base reset election under Division 296 be reversed after June 30, 2026?",
      "binary_question": "Is the cost-base reset election irrevocable?",
      "affected_count": 80000,
      "topic_tags": ["tax", "super", "division-296", "australia"]
    }
    // ... 6 more starter topics
  ],
  
  "authoritative_sources": [
    {
      "authority_id": "ato",
      "jurisdiction_code": "AUS",
      "primary_url_pattern": "https://www.ato.gov.au/",
      "topic_url_map": {
        "au-frcgw-threshold-15pct": "https://www.ato.gov.au/individuals-and-families/...",
        "au-div296-cost-base-reset": "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-much-can-you-put-in-to-super/division-296-tax"
      },
      "fetch_strategy": "html_to_markdown",
      "validity_period_days": 7,
      "fallback_urls": []
    }
  ],
  
  "scale_threshold": 1000,
  
  "goat_threshold": 0.7,
  
  "goat_block_requirements": {
    "must_have_binary_question": true,
    "must_have_threshold_or_deadline": true,
    "must_have_financial_impact": true,
    "must_have_government_anchor": true
  },
  
  "financial_impact_weights": {
    "frcgw_threshold_change_2025": 9,
    "div296_cost_base_reset": 10
  },
  
  "complexity_map": {
    "frcgw_threshold_change_2025": 6,
    "div296_cost_base_reset": 9
  },
  
  "revenue_bands": {
    "0.95_to_1.0": "$10-20k ARR",
    "0.85_to_0.95": "$5-10k ARR",
    "0.70_to_0.85": "$2-5k ARR"
  },
  
  "topic_to_product_map": {
    "au-frcgw-threshold-15pct": "au-19-frcgw-clearance-certificate",
    "au-div296-cost-base-reset": "au-XX-div296-cost-base"
  },
  
  "character_voice_map": {
    "taxchecknow_AUS": "gary",
    "taxchecknow_UK": "james",
    "taxchecknow_USA": "tyler",
    "taxchecknow_NZL": "sarah",
    "taxchecknow_CAN": "sarah"
  }
}
```

### 4.4 What E1 outputs per cron run

Per cron run, E1 writes to **8 tables** (3 of which are Phase 1 canonical cluster, 2 are Day 7 audit trails, 3 are gates/operational state):

| Table | Rows per run | Operation |
|---|---|---|
| `ai_engine_responses` | 3 engines × N topics | INSERT (raw audit) |
| `authority_source_snapshots` | 1 per topic (cached 7 days) | UPSERT (proof) |
| `truth_tables` | New rows for newly-discovered rules; UPDATE last_verified for existing | INSERT/UPDATE |
| `legal_sources` | New rows for newly-discovered citations; UPDATE verified_date for existing | INSERT/UPDATE |
| `citation_gaps` | New row if gap is new; UPDATE verified_by + scores if existing | INSERT/UPDATE |
| `product_research` | 1 per topic processed | INSERT (GOAT qualification result) |
| `gap_queue` | 1 per qualified topic (recommendation IN BUILD/BUILD_PENDING) | UPSERT |
| `agent_log` | 1 row | INSERT (summary) |

### 4.5 Starter topic universe (Phase 2 launch — 8 topics)

Empirically-grounded based on Bing AI Performance data + operator instinct + existing citation_gaps + truth_tables seed data:

| # | Topic | Jurisdiction | Authority | Linked existing data |
|---|---|---|---|---|
| 1 | au-frcgw-threshold-15pct | AUS | ATO | gap_queue seed row (priority 98) |
| 2 | au-div296-cost-base-reset | AUS | ATO | citation_gaps seed: `div296_cost_base_reset` + 3 truth_tables rules + 2 legal_sources + 1 hard deadline |
| 3 | au-div296-death-benefit | AUS | ATO | citation_gaps seed: `div296_death_benefit` + 1 legal_sources + 1 hard deadline |
| 4 | au-div296-super-exit | AUS | ATO | citation_gaps seed: `div296_super_exit` + 1 soft deadline |
| 5 | au-section-100a-trust | AUS | ATO | gap_queue seed row (priority 84) |
| 6 | au-psi-80-20-rule | AUS | ATO | gap_queue seed row (priority 72) |
| 7 | au-instant-asset-write-off | AUS | ATO | Bing data: 5 citations |
| 8 | uk-mtd-expansion | UK | HMRC | Operator: cross-jurisdiction test |

**Coverage:** 7 AUS + 1 UK = 2 jurisdictions tested. 4 of 8 link to existing citation_gaps seed data (free validation that v3.0 architecture works end-to-end).

### 4.6 Cost discipline

E1 cost per run at Phase 2 starter scale (8 topics × 3 engines):

- 8 topics × 3 engines × ~$0.003 avg = $0.072 for engine queries
- 8 topics × 1 Sonnet rule-extraction call × ~$0.005 = $0.040 (only for new gaps; cached after Day 1)
- 8 topics × 1 Sonnet validation call × ~$0.005 = $0.040
- 8 topics × 1 Sonnet GOAT gate evaluation × ~$0.003 = $0.024
- HTTP source fetches: ~$0 (7-day cache)
- **Total per run: ~$0.18 first run, ~$0.13 steady state (after rule extraction caches)**

Daily cron at this cost = ~$4-5/month per site at starter scale. Well within $5/day cap.

At full 47-topic scale: ~$0.50-0.75/run = ~$15-22/month per site.

### 4.7 Error handling

| Failure mode | Behaviour |
|---|---|
| Overlay missing or malformed | Skip cleanly, write agent_log skip, return 503 |
| Single engine API fails | Continue with remaining engines, note partial coverage, mark ai_consensus_score with confidence penalty |
| ALL engines fail | Mark topic 'skipped_engines_unreachable', continue to next topic |
| Source fetch fails | Mark gap source_unclear (no truth_tables write), don't fabricate validation, fall back to Sonnet on existing legal_sources data |
| Sonnet rule extraction parse fails | Log first 500 chars, skip truth_tables write for that gap (existing rules retained), continue |
| Structured comparison fails (parse error) | Fall back to Sonnet validation only for that rule, log warning |
| GOAT gate evaluation fails | Default to NO_GO with no_go_reason='gate_evaluation_error', preserve evidence in product_research |
| gap_queue UPSERT fails | Retry once with exponential backoff, surface in agent_log if persists |
| Never crash. Always log. | Standard pattern from Phase 1 |

### 4.8 E1 main route shape

```typescript
// app/api/cron/e1-citation-gap-scanner/route.ts

GET/POST /api/cron/e1-citation-gap-scanner?site=<site>

1.  Auth via Authorization: Bearer ${CRON_SECRET}
2.  Parse ?site= (required)
3.  Load overlay via overlayLoader(site) — fails fast if invalid
4.  Initialize Supabase admin client
5.  Initialize run summary { qualified: 0, no_go: 0, skipped_blacklisted: 0, errors: 0 }
6.  Filter topic_universe through filterTopicUniverse() [shared blacklist utility]
7.  For each allowed topic:
    a. resolveCanonicalGap(supabase, topic, overlay)
    b. queryEngines(topic, overlay.engines_to_query) → write ai_engine_responses
    c. fetchAuthoritySource(topic, overlay.authoritative_sources) → write authority_source_snapshots
    d. extractStructuredRules(source, gap_id, overlay) → write truth_tables + legal_sources
    e. compareEnginesToRules(engine_responses, truth_tables_rules) → per-engine match map
    f. sonnetValidation(engine_responses, legal_sources_content, comparison_map) → classification
    g. computeAndWriteCitationGap(supabase, gap_id, scores, verified_by) → citation_gaps UPSERT
    h. evaluateGoatGates(topic, overlay, citation_gap, deadlines_count, truth_tables_count) → 7 gates + goat_score
    i. writeProductResearch(supabase, topic, gates_result, config_skeleton) → product_research INSERT
    j. IF recommendation IN BUILD/BUILD_PENDING:
         writeGapQueue(supabase, topic, gap_id, product_research_id, scores) → gap_queue UPSERT
    k. Increment run summary counter
8.  writeAgentLog('e1-citation-gap-scanner', run_summary, cost, tokens)
9.  Return 200 { status: 'success', summary }
```

---

## 5. Strategic Synthesis Layer — Detailed Spec

### 5.1 Purpose

Phase 1's Strategic Queen Sonnet pass ranks gap_queue rows by basic priority. Phase 2's Synthesis Layer extends this to combine signals from multiple bees + Phase 1 canonical cluster into ranked opportunities with explicit reasoning and **two separate scores**.

**This is NOT a new bee.** It's an extension of Strategic Queen's existing prompt template + route.

### 5.2 The two scores (Decision 24)

**Opportunity score** = should we build this?

```
opportunity_score = weighted_sum(
  authority_clarity      * 0.25,   // structured truth_tables.is_current + legal_sources count
  ai_wrongness_severity  * 0.25,   // citation_gaps.ai_drift_score + comparison fail count
  human_confusion_volume * 0.15,   // market_research_signals.mention_count_7d + psychology_signals.fear_intensity
  goat_qualification     * 0.20,   // product_research.goat_score (NEW v3.0)
  monetization_path      * 0.10,   // overlay.revenue_bands match + competitor weakness from competitor_signals
  story_density          * 0.05    // overlay character_voice_map fit
)
```

**Build timing score** = when should we build it?

```
build_timing_score = weighted_sum(
  velocity_signal        * 0.40,   // trend_signals.velocity_pct (E6)
  decay_signal           * 0.20,   // Priority Decay age weight
  deadline_urgency       * 0.40    // deadlines.urgency_type ('hard' = 1.0, 'soft' = 0.6, none = 0.2)
)
```

**Why two scores:**

- Evergreen citation gaps (high opportunity, low velocity, no deadline) → build when capacity allows
- Hot gaps with deadlines (high opportunity, high velocity, hard deadline) → build this week or competitors do
- Low opportunity gaps (regardless of velocity) → don't build
- Decaying gaps (high opportunity initially, falling velocity) → race to build before relevance dies

This separation matches how the Phase 1 schema actually models reality — `deadlines.urgency_type` is structured 'hard' vs 'soft' precisely because timing decisions differ from value decisions.

### 5.3 Signal sources consumed by Synthesis Layer

| Signal | Source | Field |
|---|---|---|
| `authority_clarity` | citation_gaps + truth_tables + legal_sources | `truth_tables.is_current=true` count, `legal_sources` count where source_type IN ('legislation','guidance','ruling'), `citation_gaps.is_active` |
| `ai_wrongness_severity` | citation_gaps + ai_engine_responses | `citation_gaps.ai_drift_score` (0-10), recent ai_engine_responses divergence count |
| `human_confusion_volume` | market_research_signals + psychology_signals | `market_research_signals.mention_count_7d`, `psychology_signals.fear_intensity` |
| `goat_qualification` | product_research | `product_research.goat_score` (0-1), `recommendation` |
| `monetization_path` | overlay + competitor_signals + geo_citations | `overlay.revenue_bands`, `competitor_signals.competition_score`, `geo_citations.competitors_cited` substitution count |
| `story_density` | overlay | `character_voice_map[site_jurisdiction]` exists |
| `velocity_signal` | trend_signals | `trend_signals.velocity_weighted_volume` |
| `decay_signal` | gap_queue (computed) | `(now() - gap_queue.last_signal_refreshed_at) / decay_class rate` |
| `deadline_urgency` | deadlines | `deadlines.urgency_type` + days until deadline_date |

### 5.4 What Strategic Queen Sonnet pass outputs (Phase 2)

The existing output (decisions, handoffs, recommended_actions) is preserved. New output added:

```jsonc
{
  "ranked_opportunities": [
    {
      "opportunity_id": "uuid",
      "gap_queue_id": "uuid",
      "citation_gap_id": "uuid",
      "product_research_id": "uuid",
      "topic": "au-div296-cost-base-reset",
      "rank": 1,
      "synthesis_reasoning": "Citation gap div296_cost_base_reset has 3 active structured rules in truth_tables (threshold $3M, rate 15%, deadline 30 Jun 2026). ATO source verified 13 Apr 2026. GOAT qualification passed 7/7 gates with goat_score 0.94 (BUILD recommendation). Hard deadline 30 Jun 2026 (45 days from now) drives high build_timing_score. E1 engines wrong: GPT-4o-mini cited 2024 exposure draft threshold, Gemini missed cost-base reset is irrevocable. ai_drift_score 10/10. financial_impact_score 10/10 (death wall scenarios). E2 collected 47 questions on r/AusFinance in last 30 days. E3 flagged high fear intensity around 'irrevocable election'. Competitor analysis (E4): Money.com.au still cites old formula; competition_score 4/10 (clear weakness).",
      
      "signals": {
        "authority_clarity": 1.0,
        "ai_wrongness_severity": 0.95,
        "human_confusion_volume": 0.78,
        "goat_qualification": 0.94,
        "monetization_path": 0.85,
        "story_density": 0.9,
        "velocity_signal": 0.45,
        "decay_signal": 1.0,
        "deadline_urgency": 1.0,
        "deadline_days_remaining": 45,
        "deadline_urgency_type": "hard"
      },
      
      "opportunity_score": 0.92,
      "opportunity_reasoning": "7 signal sources contributing. Highest authority_clarity (3 structured rules + 2 legal sources, all current). High ai_wrongness (engines materially wrong on irrevocability). GOAT 7/7 passed. Monetization clear (au-* prefix → ATO → matches product_authority_map → $5-10k ARR band).",
      
      "build_timing_score": 0.88,
      "build_timing_reasoning": "Hard deadline 30 Jun 2026 dominates timing — 45 days remaining. velocity_signal moderate (Trends data shows steady not spiking). decay_signal full (newly refreshed by E7 detecting March 2026 ATO ruling).",
      
      "confidence_in_ranking": 0.92,
      "confidence_reasoning": "All 7 signal sources contributed. Citation gap canonical data verified by Phase 1 operator-curation. truth_tables provides programmatic rule comparison (not just text). GOAT qualification independent verification. Sample size strong: E2 (47 questions), E4 (3 competitor sources analyzed), E7 (1 confirmed authority change).",
      
      "estimated_revenue_band": "$5-10k ARR",
      "estimated_effort_band": "medium",
      
      "recommended_action_type": "build_product",
      "recommended_target_character": "gary",
      "topic_tags": ["tax", "super", "division-296", "australia"]
    }
  ]
}
```

### 5.5 [CORE] vs [OVERLAY] in Synthesis Layer

**CORE:**

- Prompt template structure
- Signal aggregation logic (sum weighted inputs from 9 signal sources)
- Two-score math
- Confidence math (signal coverage + source quality)
- citation_gaps + truth_tables + legal_sources + deadlines + product_research read logic
- Output schema validation

**OVERLAY:**

- `signal_weights` per niche (defaults shown above are tax-tuned; AI workflows might weight velocity higher)
- `revenue_bands` per niche
- `valid_action_types` per niche
- `character_voice_map` per site + jurisdiction
- `topic_to_character_match_rules`

`[IMPLEMENTATION-CALIBRATED: synthesis prompt template iterated against 5-10 real synthesis runs before locking. Signal weights tuned during Phase 4 maturation based on observed opportunity-to-conversion correlations.]`

### 5.6 Storage

`ranked_opportunities` writes to existing `strategic_queen_decisions` table with `decision_type = 'ranked_opportunity'`.

Fields populated:

```
strategic_queen_decisions:
  id, run_id, loop_type, decision_type = 'ranked_opportunity',
  gap_id (links to gap_queue),
  reasoning_long (full synthesis_reasoning text),
  opportunity_score (NEW v3.0 column),
  build_timing_score (NEW v3.0 column),
  signals_jsonb (NEW v3.0 column — full signal dict),
  confidence_score (existing),
  confidence_reasoning_long (existing)
```

### 5.7 Graceful degradation for partial data

Phase 2 first-fire may have only E1 + E7 firing (Steps 1-3 of build order). E2-E6 ship over subsequent days. Synthesis Layer handles this honestly:

- If signal source is absent: contributing weight reallocates proportionally to present sources
- `confidence_in_ranking` drops with signal coverage
- `confidence_reasoning` explicitly states which signals were absent

Example with only E1 + E7 firing:

```
authority_clarity:      present (E1 + E7)
ai_wrongness_severity:  present (E1)
human_confusion_volume: ABSENT (E2/E3 not yet built)  → reallocate weight
goat_qualification:     present (E1)
monetization_path:      partial (overlay only, no competitor_signals)
story_density:          present (overlay)
velocity_signal:        ABSENT (E6 not yet built)     → reallocate weight  
decay_signal:           present (Priority Decay)
deadline_urgency:       present (deadlines)

confidence_in_ranking:  0.65 (7/9 signal sources, partial coverage on 1)
confidence_reasoning:   "Strategic synthesis on partial signal coverage — 
                        E2 Market Researcher and E6 Trend Velocity not yet 
                        firing. Opportunity assessment relies on Phase 1 
                        canonical cluster + E1 + E7 only. Re-rank after 
                        E2 and E6 ship for higher confidence."
```

This means Synthesis Layer is **usable from Step 10** of build order (when only E1 + E7 + Decay are firing), not blocked until all 7 E-bees ship.

### 5.8 Strategic Queen Monitor dashboard integration

The Phase 1 dashboard "Top Opportunities" panel reads from `strategic_queen_decisions WHERE decision_type = 'ranked_opportunity'`. Phase 2 fills this with real synthesised data instead of empty-state placeholder.

Two new dashboard columns surface the dual-score model:

| Column | Source |
|---|---|
| Opportunity (should we?) | `opportunity_score` |
| Timing (when?) | `build_timing_score` + deadline_days_remaining |

New panel: "Signal Coverage" — for each ranked opportunity, shows which of the 9 signal sources contributed (visual indicator of confidence_in_ranking grounding).

---

## 6. Priority Decay — Detailed Spec

### 6.1 Purpose

Without decay, `gap_queue` accumulates "urgent" entries that are no longer urgent. Operator overload, strategic noise, and stale handoffs result.

Decay forces the system to **either re-justify priority via fresh signal, or quietly demote.** Stale gaps stop demanding operator attention.

### 6.2 The math

Daily cron pass. For each `gap_queue` row:

```
decay_rate           = overlay.decay_rates_per_class[row.decay_class] 
                        ?? overlay.decay_rates_per_class.default 
                        ?? 0.05
weeks_since_refresh  = (now() - last_signal_refreshed_at) / (7 * 24 * 60 * 60)
decay_multiplier     = (1 - decay_rate) ^ weeks_since_refresh
new_priority_score   = original_priority_score * decay_multiplier
```

Behaviour at 5% default rate (citation_gap_anchored class):
- Refreshed today → multiplier 1.0 → no change
- 4 weeks ago → multiplier ~0.81 → -19%
- 12 weeks ago → multiplier ~0.54 → -46%
- 26 weeks ago → multiplier ~0.26 → -74%

At 2% rate (authority_anchored — slow decay because the law itself is the relevance):
- 12 weeks ago → multiplier ~0.78 → -22%

At 12% rate (velocity_anchored — fast decay because hype cycles end):
- 12 weeks ago → multiplier ~0.22 → -78%

### 6.3 Tier transitions

When `priority_score` drops below thresholds, `priority_tier` flips:

```
score < archive_threshold (default 5)    → tier = 'archived'
score < low_threshold     (default 20)   → tier = 'low'
score < medium_threshold  (default 50)   → tier = 'medium'
score >= high_threshold   (default 80)   → tier = 'high'
score >= 95                               → tier = 'urgent'
```

`[IMPLEMENTATION-CALIBRATED: tier thresholds tuned during Phase 4 maturation based on observed gap_queue distribution.]`

### 6.4 Refresh logic

Any new signal write from E1-E7 to a gap_queue row sets `last_signal_refreshed_at = now()` and recomputes `priority_score` based on new signal strength. The decay cron then operates on the fresh timestamp.

Authority changes detected by E7 (writing to rule_changes) also trigger refresh of any gap_queue rows where `citation_gap_id` matches an affected gap.

### 6.5 Decay class (per-class decay rates)

Different topic origins warrant different decay rates. Each gap_queue row gets `decay_class` set by the bee that seeded it:

| decay_class | Default rate/week | Set by | Rationale |
|---|---|---|---|
| `authority_anchored` | 2% | E7 (when authority change drives the gap) | Law itself is the relevance — chatter dies but rule stays |
| `citation_gap_anchored` | 5% | E1 (engines_wrong drives the gap) | Standard decay tracking AI training cycles |
| `velocity_anchored` | 12% | E6 (velocity flag drives the gap) | Hype cycles decay fast |
| `operator_seeded` | 5% | Manual operator entries | Standard decay applies; operator boost just delays inevitable |
| `default` | 5% | Fallback when class unset | Same as standard |

Overlay can override per-class rates via `overlay.decay_rates_per_class` for niche tuning.

### 6.6 Edge cases

| Edge case | Behaviour |
|---|---|
| Row has no `last_signal_refreshed_at` (NULL) | Treat as `COALESCE(prioritised_at, created_at)`. Decay from row birth. |
| Row has no `decay_class` (NULL) | Treat as `'default'`. Apply standard 5% rate. |
| Row already at `priority_tier = 'archived'` | Skip decay pass. Archived rows stay archived until operator restores. |
| Row's `priority_score` already 0 | Skip — math would produce 0 forever. |
| Operator override (sets score = 100) | Decay still applies. Operator boost just delays inevitable decay. |
| `last_signal_refreshed_at` in future (clock skew) | Treat as `now()`. Log warning to agent_log. |
| Gap has hard deadline within decay window | Skip decay until deadline_date passes (Synthesis Layer handles via deadline_urgency signal; Decay just doesn't fight it) |

### 6.7 Backfill of existing rows

Day 7 added `last_signal_refreshed_at`. Day 8 adds `decay_class`. Before Decay cron goes live (Step 9):

```sql
-- Backfill last_signal_refreshed_at for existing gap_queue rows
UPDATE gap_queue
SET last_signal_refreshed_at = COALESCE(prioritised_at, created_at)
WHERE last_signal_refreshed_at IS NULL;

-- Backfill decay_class for existing rows (Phase 1 manually-seeded)
UPDATE gap_queue
SET decay_class = 'operator_seeded'
WHERE decay_class IS NULL;
```

### 6.8 [CORE] vs [OVERLAY] in Priority Decay

**CORE:**
- Decay math function (`lib/queens/priority-decay.ts`)
- Daily cron route (`app/api/cron/priority-decay/route.ts`)
- Refresh trigger logic (called by E1-E7 when they write/update gap_queue)
- Tier threshold logic
- decay_class lookup with overlay override

**OVERLAY:**
- `decay_rates_per_class` (defaults shown above)
- `archive_threshold` (default 5)
- `tier_thresholds` (defaults: low=20, medium=50, high=80, urgent=95)

### 6.9 Done conditions (Priority Decay)

| # | Condition | Verification |
|---|---|---|
| D1 | Daily cron fires without errors | `SELECT COUNT(*) FROM agent_log WHERE bee_name = 'priority-decay' AND created_at > now() - interval '24 hours' AND result LIKE '%success%'` ≥ 1 |
| D2 | At least one row's priority_score decays observably over 7 days | Compare snapshots at T0 and T+7 |
| D3 | Refreshed rows show unchanged priority_score | Manually refresh a row, observe next cron pass |
| D4 | Backfill complete | `SELECT COUNT(*) FROM gap_queue WHERE last_signal_refreshed_at IS NULL OR decay_class IS NULL` = 0 |
| D5 | Per-class rates differ correctly | Compare 7-day decay on authority_anchored (2%) vs velocity_anchored (12%) test rows |

### 6.10 Build effort

2-3 hours. Tiny component, important impact. Build at Step 9 of lego sequence.

---

## 7. E7 Truth-Sync Monitor — Detailed Spec

E7 is build position 3 (per Decision 23, moved up from original position 12). Authority change detection is the highest-leverage signal — the temporal lag between authority changes and AI training cutoffs IS the business model.

**v3.0 architectural correction:** E7 writes to existing `rule_changes` table, NOT a new `authority_changes` table. Plus updates `citation_gaps`, `legal_sources`, and `deadlines` for affected gaps. v2.0 missed that this infrastructure existed.

### 7.1 Purpose

E7 detects when authoritative sources (ATO, HMRC, IRS, etc.) publish or amend rules. Authority changes are the **leading indicator** of citation gaps:

```
Day N:     Authority publishes new rule
Day N+1:   E7 detects change via RSS, writes to rule_changes
Day N+1:   E7 updates citation_gaps.is_active + adds legal_sources row 
           + adds deadlines row if time-sensitive
Day N+1:   E7 refreshes gap_queue.last_signal_refreshed_at for affected rows
Day N+2:   E1 next run queries AI engines on this topic
Day N+3:   E1 detects engines still citing pre-change rule → engines_wrong
Day N+4:   Strategic Queen ranks high opportunity (high authority_clarity 
           + high ai_wrongness + high deadline_urgency if hard)
Day N+5:   Production Queen builds calculator + story
Day N+7:   Distribution Queen publishes
Day N+14:  AI engines start citing our new content
```

That 14-day window is the moat. E7 protects it by surfacing authority changes the moment they happen.

### 7.2 Pipeline (5 steps)

```
For each authority feed in overlay.authority_rss_feeds:

  STEP 1: Fetch feed + dedupe
    → HTTP GET on RSS/Atom URL
    → Parse via standard RSS library
    → For each item, check rule_changes table by source_url to dedupe
    → Keep new items as candidates

  STEP 2: Filter for relevance
    → For each candidate:
        - Match item.title + item.description against 
          overlay.topic_universe canonical_questions
        - Match against citation_gaps.gap_title + citation_gaps.ai_drift_description 
          where jurisdiction matches authority's jurisdiction
        - Match against overlay.niche.claim_radius_keywords
    → Drop items not matching any topic/keyword/gap
    → Keep matches as authority_change_candidates with affected_gap_ids[]

  STEP 3: Sonnet classification
    → For each candidate:
        - Sonnet pass: "Is this a substantive rule change? If yes, classify type 
                       (new_rule | amendment | clarification | guidance | none) 
                       and identify which existing citation_gaps it affects, 
                       what specific rule_keys in truth_tables become outdated, 
                       and whether it introduces a hard or soft deadline."
        - Output: change_type, affected_gap_ids[], affected_rule_keys[], 
                  deadline_signal { date, urgency_type }, summary, confidence

  STEP 4: Operator approval gate (Phase 2 ships manual)
    → Write to rule_changes table:
        - detected_at = now()
        - source_url, source_title (from feed item)
        - change_summary, change_diff (from Sonnet)
        - affected_products (text[]) — derived from affected_gap_ids → product_keys
        - alert_sent = false (Phase 3 may auto-alert)
        - change_status = 'pending_review'
    → Operator reviews via dashboard panel
    → On approval (operator sets change_status = 'approved'):
        a. UPDATE existing truth_tables rows for affected_rule_keys:
           SET is_current = false, expiry_date = effective_date
        b. INSERT new truth_tables rows with new rule_values from authority
        c. INSERT new legal_sources row for the change announcement
        d. INSERT deadlines row if deadline_signal present
        e. UPDATE citation_gaps.ai_drift_description with new framing
        f. UPDATE citation_gaps SET total_score = total_score + impact_boost (e.g., +5 for hard deadline)
        g. UPDATE gap_queue SET last_signal_refreshed_at = now() WHERE citation_gap_id IN affected
        h. UPDATE rule_changes SET reviewed_by, reviewed_at, action_taken, config_updated=true
    → On rejection:
        → UPDATE rule_changes SET change_status = 'rejected', action_taken = rejection_reason

  STEP 5: Audit logging
    → Write 1 agent_log row with run_id, feeds_checked, candidates_found, 
      classified, pending_approval count, cost_usd, tokens
```

**Phase 2 ships with manual approval.** Phase 3 may automate when confidence consistently ≥0.95 over 30+ days of operator approvals validating Sonnet's judgment.

### 7.3 [CORE] vs [OVERLAY] in E7

**CORE:**
- RSS fetcher (`lib/feeds/rss.ts`) — generic, handles any RSS/Atom feed
- Atom + RSS parser fallback chain
- Deduplication logic (by source_url against rule_changes)
- Relevance filter (matches feed items against citation_gaps + overlay topics)
- Sonnet classification prompt template
- Operator approval workflow (rule_changes status transitions)
- Cascading updates: rule_changes approve → truth_tables + legal_sources + deadlines + citation_gaps + gap_queue refresh

**OVERLAY:**
- `authority_rss_feeds` per niche
- `relevance_keywords` per authority (additional keywords beyond topic_universe)
- `confidence_threshold_for_approval_queue` (default 0.7)
- `impact_score_boost_per_change_type` map

### 7.4 Authority feeds for taxchecknow overlay (starter set)

**Phase 2 launch scope: ATO + HMRC only.** First-class RSS feeds with verified availability. Other authorities ship as `phase_4_maturation_adapter` — built during 30-day maturation as scrape adapters, not blocking dependencies for Phase 2 first-fire validation.

| Authority | Feed URL | Phase 2 status |
|---|---|---|
| ATO Media Centre | `https://www.ato.gov.au/about-ato/media-centre/media-releases/?feed=rss` | ✅ first-class RSS `[IMPLEMENTATION-CALIBRATED]` |
| ATO Legal Database | `https://www.ato.gov.au/law/view/document?docid=COG/PSLA20122/NAT/ATO/RSS` | ✅ first-class RSS `[IMPLEMENTATION-CALIBRATED]` |
| HMRC | `https://www.gov.uk/government/organisations/hm-revenue-customs.atom` | ✅ first-class Atom `[IMPLEMENTATION-CALIBRATED]` |
| IRS | `https://www.irs.gov/newsroom/...` (HTML scrape needed) | ⏸ `phase_4_maturation_adapter` |
| IRD NZ | TBD | ⏸ `phase_4_maturation_adapter` |
| CRA | TBD | ⏸ `phase_4_maturation_adapter` |

Done condition #E7-1 is "E7 fires daily on ≥1 authority feed successfully." Two feeds exceeds the bar with margin.

### 7.5 What E7 writes per cron run

Per cron run, E7 writes to **6 tables** (5 of which are Phase 1 existing):

| Table | Operation | Trigger |
|---|---|---|
| `rule_changes` | INSERT for each new detected change | Always (manual approval pending) |
| `truth_tables` | UPDATE is_current=false on affected rows + INSERT new | Only after operator approves |
| `legal_sources` | INSERT new authority citation | Only after operator approves |
| `deadlines` | INSERT if deadline_signal present | Only after operator approves |
| `citation_gaps` | UPDATE ai_drift_description + total_score | Only after operator approves |
| `gap_queue` | UPDATE last_signal_refreshed_at for affected rows | Only after operator approves |
| `agent_log` | INSERT 1 summary row | Always |

### 7.6 Cost discipline (E7)

E7 cost per run is low — most feed items filter out before LLM:

- HTTP fetches: ~$0 (caching + small payloads)
- Sonnet classification on candidates only: ~$0.003 per candidate
- Typical day: 2-5 candidates across 4-6 feeds = ~$0.01-0.02/run

Cost negligible. ~$0.50/month per site at starter scale.

### 7.7 Error handling

| Failure mode | Behaviour |
|---|---|
| Feed URL returns 404/500 | Skip feed, log to agent_log, continue with remaining feeds |
| Feed serves malformed RSS | Try Atom fallback, then HTML scrape, then skip |
| Sonnet classification parse fails | Log first 500 chars, mark candidate as change_type='none', continue |
| Database write fails | Retry once with exponential backoff, surface error in agent_log |
| Operator approval queue grows >50 items | Log warning, surface in dashboard alert (Phase 3 escalates) |
| rule_changes UNIQUE constraint violation on source_url | Treat as dedupe match, skip silently (expected behavior) |

### 7.8 Operator approval dashboard panel

The existing Strategic Queen Monitor dashboard (`/dashboard/monitor/strategic-queen`) gets a new panel:

**Panel: "Authority Changes Pending Approval"**

- Lists `rule_changes WHERE change_status = 'pending_review'`
- For each: source_title, source_url, change_summary, affected_products, Sonnet confidence
- Buttons: Approve, Reject (with reason)
- Approve triggers cascading writes via API endpoint

Phase 2 ships panel as **read-only initially** (operator approves via Supabase Studio direct SQL: `UPDATE rule_changes SET change_status = 'approved', reviewed_by = '<operator>', reviewed_at = now() WHERE id = '<uuid>';`). Approval UI button is Phase 2 mid-sprint enhancement.

### 7.9 Done conditions (E7)

| # | Condition | Verification |
|---|---|---|
| E7-1 | E7 fires daily on ≥1 authority feed successfully | `SELECT COUNT(*) FROM agent_log WHERE bee_name = 'e7-truth-sync' AND created_at > now() - interval '24 hours' AND result LIKE '%success%'` ≥ 1 |
| E7-2 | At least 1 rule_changes row written for taxchecknow | `SELECT COUNT(*) FROM rule_changes WHERE detected_at > now() - interval '7 days'` ≥ 1 |
| E7-3 | Sonnet classification populates affected_products correctly | Manual review of 5 random rows |
| E7-4 | Operator approval triggers cascading writes | Approve 1 candidate, verify truth_tables.is_current flipped + new rows inserted + gap_queue.last_signal_refreshed_at updated within 1 minute |
| E7-5 | rule_changes status transitions audit trail intact | `SELECT change_status, COUNT(*) FROM rule_changes GROUP BY change_status` shows distinct workflow states |

---

## 8. E2-E6 Specs (Architectural Depth, Implementation Calibrated)

E2-E6 enrich gap_queue + citation_gaps with additional signals beyond E1's citation gap detection and E7's authority change detection. Each follows CORE/OVERLAY pattern. Each writes to a NEW Phase 2 signal table that FKs to citation_gaps.id (canonical) and/or gap_queue.id (operational).

Implementation details (prompt templates, source URL specifics, scraper patterns) are `[IMPLEMENTATION-CALIBRATED]` — locked during build after testing.

### 8.1 E2 Market Researcher

**Purpose:** Collect Reddit/forum mentions of citation gap topics. Raw daily output that Adaptive Queen later aggregates into weekly `li_research`/`x_research`/`research_questions` summaries.

**Inputs:**
- citation_gaps (read for active gaps to monitor)
- overlay.market_research_sources (subreddits, forums)
- overlay.relevance_keywords per topic

**Outputs to NEW `market_research_signals`:**
- mention_count_7d, mention_count_30d (integers)
- question_samples (text[]) — top 5 actual questions extracted
- discussion_locations (jsonb) — which subreddits/forums mentioned

**Storage:**
```sql
CREATE TABLE market_research_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site TEXT NOT NULL,
  citation_gap_id UUID REFERENCES citation_gaps(id) ON DELETE CASCADE,
  gap_queue_id UUID REFERENCES gap_queue(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  mention_count_7d INTEGER,
  mention_count_30d INTEGER,
  question_samples TEXT[],
  discussion_locations JSONB,
  collected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_mrs_by_gap ON market_research_signals(citation_gap_id);
CREATE INDEX idx_mrs_recent ON market_research_signals(site, collected_at DESC);
ALTER TABLE market_research_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access" ON market_research_signals
  FOR ALL TO service_role USING (true) WITH CHECK (true);
```

**CORE:**
- Reddit API client (`lib/sources/reddit.ts`)
- Generic forum scraper (`lib/sources/forum.ts`)
- Sonnet question-extraction prompt template

**OVERLAY:**
- `subreddit_list` per niche. **taxchecknow starter set:** r/AusFinance, r/AusProperty, r/AusTax, r/AusLegal, r/Accounting, r/taxpros, r/UKPersonalFinance, r/tax, r/smallbusiness, r/Entrepreneur
- `forum_urls` per niche (HMRC community, Bogleheads, ATO community)
- `extraction_keywords` per topic
- `min_mention_threshold` (default 5 mentions over 30 days)

**Cost:** ~$0.20/run. ~$6/month per site at starter scale.

**Cron schedule:** Daily 05:00 UTC.

`[IMPLEMENTATION-CALIBRATED: Reddit API auth setup (PRAW or direct OAuth), final subreddit list, extraction prompt template iteration]`

**Done conditions (E2):**
- E2 fires daily without errors
- At least 1 topic has mention_count_7d > 0
- question_samples are real questions (operator spot-checks 5)

---

### 8.2 E3 Customer Psychologist

**Purpose:** Extract fear/objection/urgency from text collected by E2. Outputs psychology signal that Synthesis Layer reads.

**IMPORTANT:** Do NOT confuse with existing `psychology_insights` table. That table holds per-product CONVERSION intelligence (best_fear_amount, converting_demographic) populated post-purchase. E3 writes pre-conversion SIGNAL data per citation gap. Different layers, different purposes.

**Inputs:**
- market_research_signals.question_samples (from E2)
- overlay.psychology_triggers per niche (tax = financial fear, deadline pressure)

**Outputs to NEW `psychology_signals`:**
- fear_intensity (numeric 0-1)
- top_objections (text[])
- urgency_signals (text[])

**Storage:**
```sql
CREATE TABLE psychology_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site TEXT NOT NULL,
  citation_gap_id UUID REFERENCES citation_gaps(id) ON DELETE CASCADE,
  gap_queue_id UUID REFERENCES gap_queue(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  fear_intensity NUMERIC CHECK (fear_intensity BETWEEN 0 AND 1),
  top_objections TEXT[],
  urgency_signals TEXT[],
  extracted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ps_by_gap ON psychology_signals(citation_gap_id);
CREATE INDEX idx_ps_recent ON psychology_signals(site, extracted_at DESC);
ALTER TABLE psychology_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access" ON psychology_signals
  FOR ALL TO service_role USING (true) WITH CHECK (true);
```

**CORE:**
- Sonnet fear/objection/urgency extraction prompt template

**OVERLAY:**
- Per-niche emotional triggers list
- Per-niche urgency vocabulary

**Cost:** ~$0.15/run.

**Dependency:** E2 must produce question_samples first. Build E2 before E3.

**Cron schedule:** Daily 05:30 UTC (after E2 completes).

`[IMPLEMENTATION-CALIBRATED: psychology prompt template, niche-specific trigger calibration]`

---

### 8.3 E4 Competitor Monitor

**Purpose:** Track competitor authority on each citation gap. Output competition_score and weakness analysis.

**Two-table pattern:** E4 READS the existing `competitors` registry (operator-curated list of who to monitor) and WRITES per-gap analysis to NEW `competitor_signals` table.

**Inputs:**
- citation_gaps (read for active gaps)
- competitors registry (read — filtered by overlay.competitor_country_filter)
- overlay.claim_patterns_to_extract per topic

**Outputs to NEW `competitor_signals`:**
- competition_score (numeric 0-10, lower = better opportunity for us)
- competitor_weakness_map (jsonb) — per competitor, what's outdated/missing

**Storage:**
```sql
CREATE TABLE competitor_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site TEXT NOT NULL,
  citation_gap_id UUID REFERENCES citation_gaps(id) ON DELETE CASCADE,
  gap_queue_id UUID REFERENCES gap_queue(id) ON DELETE CASCADE,
  competitor_id UUID REFERENCES competitors(id),
  topic TEXT NOT NULL,
  competition_score NUMERIC CHECK (competition_score BETWEEN 0 AND 10),
  competitor_weakness_map JSONB,
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_cs_by_gap ON competitor_signals(citation_gap_id);
CREATE INDEX idx_cs_recent ON competitor_signals(site, analyzed_at DESC);
ALTER TABLE competitor_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access" ON competitor_signals
  FOR ALL TO service_role USING (true) WITH CHECK (true);
```

**CORE:**
- Generic competitor scraper (`lib/sources/competitor.ts`)
- Sonnet claim-comparison prompt template

**OVERLAY:**
- `competitor_country_filter` per site (which countries' competitors to monitor)
- `claim_patterns_to_extract` per topic

**Cost:** ~$0.40/run (HTTP scraping + Sonnet claim extraction).

**Cron schedule:** Daily 06:00 UTC.

`[IMPLEMENTATION-CALIBRATED: scraper robustness per-competitor, claim extraction prompt, weakness scoring rubric]`

---

### 8.4 E6 Trend Velocity Scanner

**Purpose:** Detect topics where search volume is accelerating. Output velocity_signal that Synthesis Layer uses for build_timing_score.

**Inputs:**
- citation_gaps (read for active gaps)
- overlay.keyword_universe per niche
- overlay.velocity_thresholds per niche

**Outputs to NEW `trend_signals`:**
- search_volume_absolute (integer, monthly)
- search_volume_velocity_pct (numeric, QoQ growth %)
- velocity_weighted_volume (numeric, composite metric)

**Storage:**
```sql
CREATE TABLE trend_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site TEXT NOT NULL,
  citation_gap_id UUID REFERENCES citation_gaps(id) ON DELETE CASCADE,
  gap_queue_id UUID REFERENCES gap_queue(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  search_volume_absolute INTEGER,
  search_volume_velocity_pct NUMERIC,
  velocity_weighted_volume NUMERIC,
  measured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ts_by_gap ON trend_signals(citation_gap_id);
CREATE INDEX idx_ts_recent ON trend_signals(site, measured_at DESC);
ALTER TABLE trend_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access" ON trend_signals
  FOR ALL TO service_role USING (true) WITH CHECK (true);
```

**CORE:**
- Google Trends wrapper (`lib/sources/google-trends.ts`)
- Velocity-volume composite math

**OVERLAY:**
- `keyword_universe` per niche (broader than topic_universe — includes adjacent terms)
- `velocity_threshold_for_flag` (default 50% QoQ growth)
- `minimum_absolute_volume` (default 1000 monthly searches to filter noise)

**Cost:** ~$0.10/run. No LLM calls. pytrends scrapes Google Trends.

**Risk:** pytrends breaks occasionally. Fallback: DataForSEO Trends API (~$5-15/month) if needed during maturation.

**Cron schedule:** Daily 06:30 UTC.

`[IMPLEMENTATION-CALIBRATED: pytrends version pinning, fallback handling, velocity threshold tuning]`

---

### 8.5 E5 GEO Scanner

**Purpose:** Track whether OUR content is getting cited by AI engines. Track competitor citation substitution (Decision 27).

**Uses existing `geo_citations` table** — richer schema than v2.0 proposed. Competitor substitution data goes in existing `competitors_cited` array column, not a separate table.

**Inputs:**
- Bing Webmaster API (`BING_WEBMASTER_API_KEY`)
- citation_gaps (read for active gaps)
- content_performance table (existing) — for URL mapping
- overlay.our_domain_patterns

**Outputs:**
- Writes to existing `geo_citations` table (site, product_key, character_name, ai_model, question_asked, cited_url, citation_position, full_response, citation_quote, competitors_cited[])

**CORE:**
- Bing Webmaster API client (`lib/sources/bing-webmaster.ts`)
- Shadow query engine (`lib/queens/e5-shadow-query.ts`) — queries AI engines on topics we have content for, sees what gets cited
- Sonnet citation comparison

**OVERLAY:**
- `our_domain_patterns` per site (e.g., taxchecknow.com)
- `published_topics_filter` — only run E5 on topics where we have published content

**Cost:** ~$0.50/run (mostly shadow queries to 3 engines × handful of topics).

**Dependency:** E5 needs published content. taxchecknow has 7 public assets and 16 Bing citations already — real signal exists.

**Cron schedule:** Daily 07:00 UTC.

**Pre-requisite:** Operator generates Bing Webmaster API key, adds to Vercel env vars as `BING_WEBMASTER_API_KEY`.

`[IMPLEMENTATION-CALIBRATED: Bing API endpoints, shadow query topic selection, dashboard panel for substitution data]`

**Done conditions (E5):**
- E5 fires daily without errors
- geo_citations table populated with current Bing data
- At least 1 row has competitors_cited populated (substitution detected)
- Operator sees "you would have been cited but X got cited instead" in dashboard

---

## 9. Cluster Data Layer

Per Decision 29, Phase 2 ships forward-compatible data structures that COLE Orchestrator (Phase 3) will use. **Important update for v3.0:** Phase 1's `jurisdictions` + `citation_gaps.jurisdiction_code` provide much of the cluster routing infrastructure already. Phase 2 adds blacklist + territory map + shared filter utility.

### 9.1 What already exists (from Phase 1 audit)

| Component | Source | Role in cluster routing |
|---|---|---|
| `jurisdictions` table | Phase 1 (AUS, USA, UK, CAN, ESP) | Authoritative jurisdiction reference |
| `citation_gaps.jurisdiction_code` | Phase 1 FK | Every gap is jurisdiction-anchored |
| `competitors.country` | Phase 1 | Country-scoped competitor filtering |
| `geo_citations.site` | Phase 1 | Site-scoped citation tracking |
| `gap_queue.site` | Phase 1 | Site-scoped operational queue |

The jurisdiction layer is already present and normalized. Phase 2 adds the **categorical exclusions** layer (blacklist) and the **territory routing** layer (which sites claim which territories) that Phase 1 didn't include.

### 9.2 Schema additions for cluster data layer (v3.0)

```sql
-- gap_queue extensions for cluster routing
ALTER TABLE gap_queue ADD COLUMN topic_tags TEXT[];
CREATE INDEX idx_gap_queue_topic_tags ON gap_queue USING GIN (topic_tags);

ALTER TABLE gap_queue ADD COLUMN cluster_routing_proposal JSONB;
-- Reserved for COLE Orchestrator Phase 3. Stays NULL in Phase 2.

ALTER TABLE gap_queue ADD COLUMN decay_class TEXT CHECK (decay_class IN (
  'authority_anchored', 'citation_gap_anchored', 'velocity_anchored', 
  'operator_seeded', 'default'
));
CREATE INDEX idx_gap_queue_decay_class ON gap_queue(decay_class, last_signal_refreshed_at);

ALTER TABLE gap_queue ADD COLUMN citation_gap_id UUID REFERENCES citation_gaps(id);
ALTER TABLE gap_queue ADD COLUMN product_research_id UUID REFERENCES product_research(id);
CREATE INDEX idx_gap_queue_citation_gap_id ON gap_queue(citation_gap_id);
CREATE INDEX idx_gap_queue_product_research_id ON gap_queue(product_research_id);
```

### 9.3 Cluster config files (new, repo root)

```
cluster-config/
├── blacklist-v1.json
└── territory-map.json
```

### 9.4 blacklist-v1.json structure

Per Decisions 19-21. Stored as versioned JSON. Operator-only edits.

```jsonc
{
  "version": 1,
  "last_updated": "2026-05-11",
  "last_updated_by": "operator",
  "change_audit_log": [],
  
  "categorical_no": [
    "adult content / pornography",
    "gambling / sports betting / lottery",
    "MLM / network marketing / recruitment schemes",
    "weight loss / diet / supplements / nutrition advice",
    "miracle cures / alternative medicine / homeopathy",
    "weapons / firearms / ammunition",
    "controlled substances / illegal drugs",
    "tobacco / vaping",
    "celebrity gossip / entertainment news",
    "religious instruction / theology",
    "political commentary / partisan content",
    "sports prediction / fantasy sports tips"
  ],
  
  "ethical_no": [
    "tax evasion (vs avoidance — distinction matters)",
    "fraud techniques / scam guides / phishing",
    "fake documentation / identity theft",
    "AI jailbreaking / prompt injection for harm",
    "social engineering / manipulation tactics",
    "anti-vaccine misinformation",
    "election fraud / disinformation",
    
    // Tax-niche specific
    "how to evade tax",
    "how to avoid paying tax illegally",
    "hide income from ATO",
    "hide income from HMRC",
    "hide income from IRS",
    "fool the ATO",
    "fool the HMRC",
    "fool the IRS",
    "fake proof of residency",
    "fake tax documents",
    "fake business expenses",
    "phantom employees",
    "fake invoices for tax",
    
    // Visa-niche anticipatory
    "guaranteed visa approval",
    "visa fraud",
    "fake employer for visa",
    "fake marriage for visa",
    
    // Financial-niche anticipatory
    "guaranteed investment returns",
    "guaranteed income schemes",
    "guaranteed crypto returns",
    "pump and dump strategies",
    "insider trading techniques"
  ],
  
  "regulatory_no": [
    "specific medical diagnosis / treatment recommendations",
    "specific legal advice / case strategy",
    "specific investment recommendations / stock picks",
    "psychiatric / psychological clinical advice"
  ],
  
  "brand_misalignment": [
    "celebrity gossip",
    "religious instruction",
    "partisan political commentary"
  ],
  
  "low_value_no": [
    "song lyrics / poem reproductions",
    "movie plot summaries",
    "video game walkthroughs",
    "fanfiction without commercial fit"
  ]
}
```

**Phase 4 maturation expectation:** This list grows as operator notices edge cases. Adding entries is calibration (no CAB). Removing entries is CAB-gated.

### 9.5 territory-map.json structure

Per Decisions 16-17. **Internal site_key decoupled from production_domain.**

```jsonc
{
  "version": 1,
  "last_updated": "2026-05-11",
  "operator": "Matt",
  "cluster_name": "Mrkt Rite Citation Gap Engine",
  
  "active_territories": [
    {
      "site_key": "taxchecknow",
      "label": "Personal and SMB tax compliance",
      "production_domain": "taxchecknow.com",
      "site_overlay_path": "overlays/taxchecknow/strategic.json",
      "claim_radius_keywords": [
        "income tax", "capital gains", "withholding", "expat tax",
        "small business tax", "super/retirement tax", "tax planning",
        "tax compliance", "tax authority guidance"
      ],
      "jurisdiction_codes": ["AUS", "UK", "USA", "NZL", "CAN"],
      "authorities": ["ato", "hmrc", "irs", "ird-nz", "cra"],
      "status": "active",
      "phase_2_built": true
    }
  ],
  
  "planned_territories": [
    {
      "site_key": "aioperatoracademy",
      "label": "AI tools and workflows for non-technical SMB owners",
      "production_domain": "TBD",
      "status": "planned-phase-3"
    },
    {
      "site_key": "checkfinance",
      "label": "Personal financial product mechanics",
      "production_domain": "TBD",
      "status": "planned-phase-3"
    },
    {
      "site_key": "checkvisas",
      "label": "Immigration and visa pathways",
      "production_domain": "TBD",
      "status": "planned-phase-3"
    },
    {
      "site_key": "viabilityindex",
      "label": "Business viability scoring + decision support",
      "production_domain": "TBD",
      "status": "planned-phase-3"
    }
  ],
  
  "discovery_rules": {
    "strategy": "open_with_exclusions",
    "discovery_budget_allocation": {
      "active_territories": 0.70,
      "planned_territories_exploration": 0.20,
      "frontier_scanning": 0.10
    },
    "frontier_scanning_whitelist": [
      "small business compliance",
      "professional licensing",
      "regulatory technology",
      "AI/automation for service professionals"
    ],
    "require_operator_approval_for_new_territory": true,
    "phase_2_enforcement": "keyword_blacklist_only",
    "phase_3_enforcement": "cole_orchestrator_routes_per_rules"
  }
}
```

`jurisdiction_codes` reference the existing `jurisdictions` table — don't duplicate jurisdiction data here, just point to it.

### 9.6 Shared Blacklist Filter Utility — Phase 2 Enforcement Layer

Phase 2 ships **cheap keyword-filter blacklist enforcement** as a shared utility that every signal-generating bee calls before initiating queries.

**File location:** `lib/cluster/blacklist-filter.ts` (CORE, cluster-level)

**Contract:**

```typescript
// lib/cluster/blacklist-filter.ts
import blacklist from '@/cluster-config/blacklist-v1.json';

export interface BlacklistResult {
  blocked: boolean;
  category: 'categorical_no' | 'ethical_no' | 'regulatory_no' 
          | 'brand_misalignment' | 'low_value_no' | null;
  matched_phrase: string | null;
  match_strength: 'exact' | 'substring' | 'phrase';
}

export function isBlacklisted(topic_label: string): BlacklistResult;
export function filterTopicUniverse<T extends { topic_label: string }>(
  topics: T[]
): {
  allowed: T[];
  blocked: Array<{ topic: T; result: BlacklistResult }>;
};
```

**How E1-E7 call it:**

```typescript
import { filterTopicUniverse } from '@/lib/cluster/blacklist-filter';

const { allowed, blocked } = filterTopicUniverse(overlay.topic_universe);

for (const blockedItem of blocked) {
  await writeAgentLog(sb, {
    bee_name: 'e1-citation-gap-scanner',
    site,
    action: 'topic_skipped_blacklisted',
    result: `category=${blockedItem.result.category}, matched=${blockedItem.result.matched_phrase}`,
  });
}

// Only iterate `allowed` for engine queries
for (const topic of allowed) {
  // ... E1 pipeline
}
```

**Matching algorithm:**

1. **Exact match** — topic_label exactly equals a blacklist phrase (case-insensitive)
2. **Substring match** — blacklist phrase appears anywhere in topic_label
3. **Phrase match** — all words from blacklist phrase appear in topic_label in same order

First match wins. Returns category + matched_phrase for audit trail.

**Operator override at overlay level:**

```jsonc
// overlay.json
"blacklist_overrides": [
  {
    "topic_id": "au-gambling-winnings-taxation",
    "override_reason": "Tax treatment of gambling winnings is core ATO content",
    "approved_by": "operator",
    "approved_at": "2026-05-15"
  }
]
```

Override checks happen AFTER blacklist match — if blocked, check overrides, if exists, allow with audit log entry.

**Phase 2 vs Phase 3 separation:**

| Layer | Phase 2 | Phase 3 (COLE Orchestrator) |
|---|---|---|
| Keyword filter (cheap, fast) | ✅ This shared utility | ✅ Still active (first pass) |
| Semantic classification (Sonnet) | ❌ Not built | ✅ Second pass on survivors |
| Cross-site routing | ❌ Not built | ✅ COLE Orchestrator |
| Territory expansion proposals | ❌ Not built | ✅ COLE Orchestrator surfaces |

**Build effort:** 2-3 hours including comprehensive test cases. Step 1.5 in build order.

### 9.7 Done conditions (Cluster Data Layer)

| # | Condition | Verification |
|---|---|---|
| CDL1 | `lib/cluster/blacklist-filter.ts` exists with documented contract | File present, exports match contract |
| CDL2 | `cluster-config/blacklist-v1.json` loads successfully | Manual test: `isBlacklisted('test phrase')` returns valid result |
| CDL3 | `cluster-config/territory-map.json` loads successfully | Manual test |
| CDL4 | Test cases pass: 5 obvious blocks + 5 obvious passes + 2 override scenarios | Test suite |
| CDL5 | E1 calls filter before engine queries | Code review confirms call site |
| CDL6 | E7 calls filter before relevance matching | Code review confirms call site |
| CDL7 | agent_log records `topic_skipped_blacklisted` when filter triggers | `SELECT COUNT(*) FROM agent_log WHERE action = 'topic_skipped_blacklisted'` reflects skip events |

### 9.8 What Phase 2 bees do with cluster data

| Bee | Cluster data layer interaction |
|---|---|
| E1 | Calls `filterTopicUniverse()` before queries. Writes `topic_tags[]` to gap_queue rows from overlay.topic_universe[].topic_tags. |
| E2-E6 | Call `filterTopicUniverse()` before scraping. Inherit topic_tags from gap_queue when enriching. |
| E7 | Calls `filterTopicUniverse()` before relevance matching. Writes topic_tags based on affected gap_ids. |
| Strategic Queen | Reads claim_radius from overlay (does not enforce cluster routing yet — single site). Reads citation_gaps.jurisdiction_code for jurisdiction context. |
| Priority Decay | Operates on all gap_queue rows regardless of cluster routing or tags. |

### 9.9 What Phase 2 bees do NOT do

- Do NOT enforce semantic blacklist via Sonnet (COLE Orchestrator Phase 3)
- Do NOT enforce cross-site territory routing (single-site in Phase 2)
- Do NOT write to `cluster_routing_proposal` (stays NULL until COLE Orchestrator)
- Do NOT modify `jurisdictions` table (read-only reference)

The semantic logic is deferred. Cheap keyword enforcement DOES happen at every bee's query boundary.

---

## 10. Build Order — Lego Stack

13 explicit steps (Step 0 + Step 1 + Step 1.5 + Steps 2-12), each declaring depends-on / enables relationships and success criteria. Each step produces something usable. Stopping mid-stack leaves a working partial system.

**v3.0 ordering rationale:** E7 at position 3 (per Decision 23). Synthesis Layer at position 10 with graceful degradation, meaning it can fire useful output as early as Step 3 (E1 + E7 only) and improves as E2-E6 come online.

### Step 0 — Schema Migration

**Depends on:** Day 7 schema baseline applied (gap_queue Day 7 columns + ai_engine_responses + authority_source_snapshots) + audit confirmation (A1-A8 queries pass)

**Enables:** Every subsequent step (all bees write to tables created/extended here)

**Success criteria:**
- All Day 8 schema additions applied atomically (4 new tables + 8 new columns)
- V1-V8 post-migration verification queries return expected counts
- gap_queue row count unchanged (additive only, no data loss)
- All new tables have RLS enabled with service_role policies
- Backfill complete: no NULL `last_signal_refreshed_at` or `decay_class` on existing gap_queue rows

**Files created:** None (SQL migration applied via Supabase SQL Editor)

**Acceptance:** Operator runs A1-A8 audit, applies migration SQL, runs V1-V8 verification, confirms results.

Full SQL block specified in Section 13.

### Step 1 — Overlay Loader + taxchecknow overlay JSON

**Depends on:** Step 0 (schema state matches overlay schema expectations)

**Enables:** Every subsequent step (every bee reads overlay)

**Success criteria:**
- `lib/overlay/loader.ts` exists, loads `overlays/<site>/strategic.json`, validates against schema
- `lib/overlay/types.ts` defines TypeScript interfaces for all overlay fields referenced in Sections 1-9
- `overlays/taxchecknow/strategic.json` exists with full configuration (engines, topics, authorities, niche, decay rates, character_voice_map, goat_threshold, goat_block_requirements, financial_impact_weights, complexity_map, revenue_bands, topic_to_product_map)
- `overlays/taxchecknow/strategic.schema.json` validates the overlay structure (JSON Schema)
- Manual test: `await loadOverlay('taxchecknow')` returns valid typed config object

**Files created:**
- `lib/overlay/loader.ts`
- `lib/overlay/types.ts`
- `overlays/taxchecknow/strategic.json`
- `overlays/taxchecknow/strategic.schema.json`

**Acceptance:** Operator runs Node test script that calls loadOverlay() — confirms schema validation passes + returned object matches TypeScript type contract.

### Step 1.5 — Shared Blacklist Filter Utility

**Depends on:** Step 1 (overlay loader exists)

**Enables:** Every E-bee (E1, E2, E3, E4, E6, E5, E7) — all call `filterTopicUniverse()` before queries

**Success criteria:**
- `lib/cluster/blacklist-filter.ts` exists with documented contract per Section 9.6
- `cluster-config/blacklist-v1.json` loads successfully (per Section 9.4 content)
- `cluster-config/territory-map.json` loads successfully (per Section 9.5 content)
- Test cases pass: 5 obvious blocks + 5 obvious passes + 2 override scenarios
- Manual test 1: `isBlacklisted('how to hide income from ATO')` → `{blocked: true, category: 'ethical_no', matched_phrase: 'hide income from ATO'}`
- Manual test 2: `isBlacklisted('CGT main residence exemption')` → `{blocked: false}`

**Files created:**
- `lib/cluster/blacklist-filter.ts`
- `cluster-config/blacklist-v1.json`
- `cluster-config/territory-map.json`

**Acceptance:** Operator runs test suite + reviews 2 manual test outputs. From this step onward, every bee that initiates external queries MUST call `filterTopicUniverse()` (enforced via code review per Hard Rule 1).

`[IMPLEMENTATION-CALIBRATED: matching algorithm tuned against 20+ test cases before locking — substring vs exact vs phrase match precedence]`

### Step 2 — E1 Citation Gap Scanner

**Depends on:** Step 1 (overlay loader), Step 1.5 (blacklist filter), Step 0 (schema includes citation_gaps + truth_tables + legal_sources + product_research + gap_queue.citation_gap_id FK), Vercel env vars for 3 engines (OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY — configured Day 7)

**Enables:** Step 3 (E7 detects authority changes against citation_gaps E1 has populated), Step 10 (Synthesis Layer reads citation_gaps + truth_tables + product_research populated by E1)

**Success criteria:**
- E1 cron route fires successfully
- E1 calls `filterTopicUniverse()` BEFORE engine queries (verified by code review)
- Per allowed topic in overlay.topic_universe:
  - ai_engine_responses receives 3 rows (one per engine)
  - authority_source_snapshots receives 1 row
  - truth_tables receives new rows for newly-discovered structured rules
  - legal_sources receives new rows for newly-discovered citations
  - citation_gaps receives new row (INSERT) or updates existing row (verified_by + scores)
  - product_research receives 1 row with all 7 gate booleans evaluated, goat_score computed, recommendation populated
  - IF recommendation IN BUILD/BUILD_PENDING: gap_queue receives row with citation_gap_id + product_research_id + decay_class='citation_gap_anchored' + topic_tags
- At least 1 row classified as `engines_wrong` (opportunity_classification on gap_queue)
- agent_log shows E1 success with cost + tokens + summary { qualified, no_go, skipped_blacklisted, errors }

**Files created:**
- `lib/engines/openai.ts`
- `lib/engines/anthropic-engine.ts`
- `lib/engines/gemini.ts`
- `lib/sources/fetcher.ts` (authority source HTTP fetcher with 7-day cache)
- `lib/sources/validator.ts` (Sonnet validation + structured rule comparison)
- `lib/queens/e1-citation-gap-scanner.ts` (main pipeline orchestrator)
- `lib/queens/e1-goat-gate.ts` (7-gate evaluation logic)
- `app/api/cron/e1-citation-gap-scanner/route.ts`

**Cron schedule:** Daily 04:00 UTC (12:00 PM AWST). Stagger ahead of other crons.

**Acceptance:** Operator triggers manual cron via curl. Verification queries against all 8 affected tables confirm rows present. At least one `engines_wrong` classification with citation_gap_id and product_research_id FKs populated.

`[IMPLEMENTATION-CALIBRATED: Sonnet prompt templates for rule extraction + validation + GOAT gate evaluation iterated against 5-10 real responses before locking]`

### Step 3 — E7 Truth-Sync Monitor

**Depends on:** Step 1 (overlay), Step 1.5 (blacklist filter), Step 2 (E1 populated citation_gaps so E7 has gaps to monitor for changes)

**Enables:** Synthesis Layer consumes E7's authority_clarity + deadline_urgency signals via the updated citation_gaps + new truth_tables/legal_sources/deadlines rows

**Success criteria:**
- E7 cron route fires successfully on at least 1 authority feed (ATO + HMRC starter scope)
- rule_changes table receives rows with detected_at, source_url, change_summary, affected_products, change_status='pending_review'
- Sonnet classification populates affected_products (text[]) correctly (operator spot-checks)
- Operator approval workflow tested end-to-end:
  - Operator UPDATE rule_changes SET change_status='approved' on 1 row
  - Cascading writes confirmed: truth_tables old rows flipped is_current=false, new rows inserted, legal_sources row inserted, deadlines row inserted (if applicable), citation_gaps.ai_drift_description updated, gap_queue.last_signal_refreshed_at updated for affected rows
- agent_log shows E7 success

**Files created:**
- `lib/feeds/rss.ts` (generic RSS/Atom reader)
- `lib/queens/e7-change-detector.ts` (Sonnet classification + relevance filtering)
- `lib/queens/e7-cascade-writer.ts` (cascading writes on approval)
- `app/api/cron/e7-truth-sync/route.ts`
- `app/api/admin/rule-changes/approve/route.ts` (operator approval endpoint)

**Cron schedule:** Daily 04:30 UTC (after E1).

**Acceptance:** Operator runs manual trigger. Verifies rule_changes rows. Manually approves one via Supabase Studio. Confirms cascading writes within 1 minute.

`[IMPLEMENTATION-CALIBRATED: actual RSS URLs verified live for ATO + HMRC, Sonnet classification prompt template iterated]`

### Step 4 — E2 Market Researcher

**Depends on:** Step 1 (overlay), Step 1.5 (blacklist filter), Step 0 (market_research_signals table exists), Step 2 (citation_gaps populated by E1)

**Enables:** Step 5 (E3 reads E2 output), Synthesis Layer consumes human_confusion_volume signal

**Success criteria:**
- E2 cron route fires successfully
- Reddit API queries return data
- market_research_signals table receives rows linked to citation_gaps.id AND gap_queue.id
- At least 1 topic has mention_count_7d > 0
- question_samples are real, coherent questions (operator spot-checks)

**Files created:**
- `lib/sources/reddit.ts` (Reddit API client)
- `lib/sources/forum.ts` (generic forum scraper)
- `lib/queens/e2-market-researcher.ts`
- `app/api/cron/e2-market-research/route.ts`

**Cron schedule:** Daily 05:00 UTC.

`[IMPLEMENTATION-CALIBRATED: Reddit API auth setup (PRAW or direct OAuth), final subreddit list from Section 8.1, extraction prompt template]`

### Step 5 — E3 Customer Psychologist

**Depends on:** Step 1, Step 4 (E2 must populate question_samples), Step 0 (psychology_signals table exists)

**Enables:** Synthesis Layer consumes fear_intensity component of human_confusion_volume

**Success criteria:**
- E3 cron route fires after E2
- psychology_signals table receives rows linked to citation_gaps.id AND gap_queue.id
- fear_intensity, top_objections, urgency_signals populated for at least 1 topic
- Operator confirms extractions are coherent (spot-check 5)

**Files created:**
- `lib/queens/e3-psychologist.ts` (Sonnet fear/objection/urgency extractor)
- `app/api/cron/e3-customer-psychologist/route.ts`

**Cron schedule:** Daily 05:30 UTC (after E2 completes).

`[IMPLEMENTATION-CALIBRATED: psychology extraction prompt template, niche-specific trigger calibration]`

### Step 6 — E4 Competitor Monitor

**Depends on:** Step 1, Step 0 (competitor_signals table exists), Phase 1 competitors registry has rows

**Enables:** Synthesis Layer consumes monetization_path component (competition_score)

**Success criteria:**
- E4 cron route fires successfully
- E4 reads from existing `competitors` table (filtered by overlay.competitor_country_filter)
- competitor_signals table receives rows linked to citation_gaps.id + gap_queue.id + competitors.id
- competitor_weakness_map populated for at least 1 competitor on 1 gap
- Operator confirms competitor assessments accurate (spot-check)

**Files created:**
- `lib/sources/competitor.ts` (generic competitor scraper)
- `lib/queens/e4-competitor-monitor.ts`
- `app/api/cron/e4-competitor-monitor/route.ts`

**Cron schedule:** Daily 06:00 UTC.

`[IMPLEMENTATION-CALIBRATED: scraper robustness per-competitor URL, claim extraction prompt, weakness scoring rubric]`

### Step 7 — E6 Trend Velocity Scanner

**Depends on:** Step 1, Step 0 (trend_signals table exists), pytrends library installed

**Enables:** Synthesis Layer consumes velocity_signal for build_timing_score

**Success criteria:**
- E6 cron route fires successfully
- trend_signals table receives rows linked to citation_gaps.id + gap_queue.id
- velocity_pct + velocity_weighted_volume populated for at least 1 topic
- pytrends library returns valid data

**Files created:**
- `lib/sources/google-trends.ts` (pytrends wrapper with version pinning + fallback handling)
- `lib/queens/e6-velocity-scanner.ts`
- `app/api/cron/e6-velocity-scanner/route.ts`

**Cron schedule:** Daily 06:30 UTC.

**Risk note:** pytrends fragility. If breaks within 30 days, fallback to DataForSEO API (~$5-15/month) per Phase 3 deferrals.

`[IMPLEMENTATION-CALIBRATED: pytrends version pinning, fallback handling, velocity threshold tuning]`

### Step 8 — E5 GEO Scanner

**Depends on:** Step 1, Step 0 (uses existing geo_citations table — no new table needed), Bing Webmaster API key (`BING_WEBMASTER_API_KEY` env var — operator generates during this step)

**Enables:** Synthesis Layer consumes geo_pickup data; competitor substitution data available in dashboard

**Success criteria:**
- E5 cron route fires successfully
- geo_citations table receives new rows from Bing API + shadow queries (using existing 18-column schema)
- competitors_cited array populated when competitor substitution detected
- At least 1 competitor substitution detected (Bing data already shows 16 citations — work to do)

**Files created:**
- `lib/sources/bing-webmaster.ts` (Bing Webmaster API client)
- `lib/queens/e5-shadow-query.ts` (shadow query engine + Sonnet citation comparison)
- `app/api/cron/e5-geo-scanner/route.ts`

**Cron schedule:** Daily 07:00 UTC.

**Pre-requisite:** Operator generates Bing Webmaster API key in Bing Webmaster Tools Settings → API Access, adds to Vercel env vars.

`[IMPLEMENTATION-CALIBRATED: Bing API endpoints, shadow query topic selection, dashboard panel for substitution data]`

### Step 9 — Priority Decay cron

**Depends on:** Step 2 (gap_queue with E1 writes populating decay_class)

**Enables:** gap_queue stays clean over time; Synthesis Layer reads decay_signal

**Success criteria:**
- Backfill of existing rows: `last_signal_refreshed_at IS NULL` count = 0, `decay_class IS NULL` count = 0
- Priority Decay cron fires daily
- At least 1 row's `priority_score` decays observably over 7 days
- Refreshed rows don't decay (last_signal_refreshed_at recent → multiplier 1.0)
- Per-class rates differ correctly: authority_anchored (2%) vs velocity_anchored (12%) on test rows

**Files created:**
- `lib/queens/priority-decay.ts`
- `app/api/cron/priority-decay/route.ts`

**Cron schedule:** Daily 03:00 UTC (before Strategic Queen's 06:00 daily run).

**Pre-step:** Run backfill SQL during Step 9 deploy (Section 13.3).

### Step 10 — Strategic Queen Synthesis Layer extension

**Depends on:** Steps 2-9 (signal sources populating tables) — though graceful degradation per Section 5.7 allows useful synthesis with only Steps 2+3 firing

**Enables:** Phase 2 done condition #3 (ranked_opportunities surface in dashboard) + Phase 2 done condition #7 (operator approves opportunity → handoff to Production Queen)

**Success criteria:**
- Strategic Queen route extension produces `ranked_opportunities[]` output
- strategic_queen_decisions table receives rows with decision_type = 'ranked_opportunity'
- opportunity_score + build_timing_score + signals_jsonb populated
- synthesis_reasoning text references at least 3 signal sources (more as bees come online)
- confidence_in_ranking populated with reasoning (per Section 5.7 graceful degradation)
- Dashboard "Top Opportunities" panel populates with real synthesised data + "Signal Coverage" panel shows which sources contributed

**Files modified:**
- `lib/queens/strategic-queen-prompt.ts` (extend existing with synthesis layer prompt section)
- `lib/queens/strategic-queen-synthesis.ts` (NEW — synthesis layer logic + two-score math + graceful degradation)
- `app/api/cron/strategic-queen/route.ts` (add ranked_opportunities write step after existing handoff writes)

**Schema additions used (from Step 0):**
- `strategic_queen_decisions.opportunity_score`
- `strategic_queen_decisions.build_timing_score`
- `strategic_queen_decisions.signals_jsonb`

`[IMPLEMENTATION-CALIBRATED: synthesis prompt template, two-score weight tuning, graceful degradation behavior with partial signal coverage]`

### Step 11 — End-to-end first-fire validation

**Depends on:** Steps 0-10 complete

**Enables:** Phase 2 done condition sign-off; transition to Phase 4 maturation per COLE-QUEEN-BUILD-PROCESS Section 1

**Success criteria:** All 8 done conditions (Section 11) pass verification queries.

**Process:**
1. Trigger E7 → E1 → E2 → E3 → E4 → E6 → E5 → Decay → Strategic Queen via curl
2. For each bee: verify agent_log shows success
3. Audit citation_gaps state — does it have E1-populated rows?
4. Audit truth_tables state — does it have structured rules from authority sources?
5. Audit product_research state — do GOAT gates have results?
6. Audit gap_queue state — does it have enriched rows with citation_gap_id + product_research_id?
7. Audit Strategic Queen output — does it produce ranked_opportunities with opportunity_score + build_timing_score?
8. Audit dashboard — does Top Opportunities + Signal Coverage panel render correctly?
9. Operator approves at least 1 synthesised opportunity → handoff to Production Queen → produces something

**Duration:** 2-4 hours of focused validation work.

### Step 12 — Vanilla validation acceptance test

**Depends on:** Step 11 (first-fire passes)

**Enables:** Phase 2 sign-off

**Success criteria:** Done condition #8 — second overlay (stub) added without code changes.

**Process:**
1. Create `overlays/test-claude-courses/strategic.json` (stub overlay with minimum required fields for E1)
2. Trigger E1 cron with `?site=test-claude-courses`
3. Verify ai_engine_responses + citation_gaps + product_research + gap_queue have rows for test site
4. Verify NO code changes required (only config files added)
5. Audit `git diff` confirms only `overlays/test-claude-courses/*` files added — no `lib/` or `app/` changes

If code change was required: Phase 2 incomplete. Iterate CORE/OVERLAY split until acceptance test passes.

---

## 11. Done Conditions — Phase 2 Sign-Off

8 verifiable conditions. Each has a SQL query or visual check. All must pass before Phase 2 first-fire sign-off (per COLE-QUEEN-BUILD-PROCESS Section 1, Phase 3 transition to maturation).

| # | Condition | Verification | Status |
|---|---|---|---|
| 1 | E1 runs daily on ≥5 topics from taxchecknow overlay, queries 3 engines, writes citation_gaps verified_by + truth_tables structured rules | `SELECT COUNT(DISTINCT topic) FROM ai_engine_responses WHERE site = 'taxchecknow' AND query_at > now() - interval '24 hours'` ≥ 5 AND `SELECT COUNT(*) FROM truth_tables WHERE last_verified > now() - interval '24 hours'` ≥ 1 | ⏳ |
| 2 | E1 source-validation step fires; engines_wrong classifications produce gap_queue rows with citation_gap_id + product_research_id FKs populated | `SELECT opportunity_classification, COUNT(*) FROM gap_queue WHERE site = 'taxchecknow' AND citation_gap_id IS NOT NULL GROUP BY opportunity_classification` shows engines_wrong rows present | ⏳ |
| 3 | Strategic Synthesis Layer outputs ≥1 ranked_opportunity with synthesis_reasoning citing ≥3 signal sources and both scores populated | `SELECT COUNT(*) FROM strategic_queen_decisions WHERE decision_type = 'ranked_opportunity' AND opportunity_score IS NOT NULL AND build_timing_score IS NOT NULL AND created_at > now() - interval '24 hours'` ≥ 1 | ⏳ |
| 4 | Priority Decay cron fires daily, decays gap_queue scores per decay_class rate, refreshes on new signals | Snapshot gap_queue.priority_score at T0, observe at T+7d; `last_signal_refreshed_at` updates when bees write | ⏳ |
| 5 | **LAUNCH:** 5 of 8 starter topics have citation_gaps + truth_tables + product_research populated within 7 days. **MATURITY:** 20+ of 47 taxchecknow products have coverage by end of Phase 4 maturation (Day 42+) | Launch: `SELECT COUNT(DISTINCT cg.gap_name) FROM citation_gaps cg JOIN truth_tables tt ON tt.gap_id = cg.id WHERE cg.jurisdiction_code = 'AUS' AND tt.last_verified > now() - interval '7 days'` ≥ 5. Maturity: same without filter ≥ 20 by Day 42. | ⏳ |
| 6 | Strategic Queen Monitor "Top Opportunities" panel + "Signal Coverage" panel populate with real synthesised data | Visual check at `/dashboard/monitor/strategic-queen?site=taxchecknow` | ⏳ |
| 7 | Operator approves ≥1 synthesised opportunity → handoff to Production Queen → produces something | `SELECT COUNT(*) FROM strategic_queen_handoffs WHERE acted_on_at IS NOT NULL AND created_at > now() - interval '7 days'` ≥ 1 | ⏳ |
| 8 | Vanilla validation: stub second overlay added, runs E1 cron once, produces non-tax-niche output, NO code changes required | `git diff main..HEAD` shows only files under `overlays/test-claude-courses/*`; agent_log shows E1 run for test site | ⏳ |

### 11.1 Done condition relationship to existing Phase 1 data

Four of the 8 done conditions can be validated against Phase 1 seed data:

- **DC #1:** Validates against 4 of 5 existing citation_gaps rows (div296_* + frcgw) by E1 confirming verified_by population
- **DC #5 launch:** 4 of 8 starter topics link to existing citation_gaps + truth_tables + deadlines seed data — instant validation that v3.0 architecture works end-to-end
- **DC #2:** Existing gap_queue rows (s100A, PSI, FRCGW) get citation_gap_id populated when E1 links them
- **DC #3:** Synthesis Layer reads existing citation_gaps + truth_tables to produce first ranked_opportunity in the FIRST CRON RUN (not pending future data accumulation)

**Net:** Phase 2 first-fire validation is GROUNDED in real existing data, not "empty database, hope it works."

---

## 12. Hard Rules — Non-Negotiable

12 rules. Violations require CAB approval. No exceptions during normal operation.

| # | Rule | Enforcement | Remediation if violated |
|---|---|---|---|
| 1 | CORE/OVERLAY separation: no `if (site === 'X')` or `if (countryCode === 'X')` anywhere in CORE | Code review during PR | Refactor to overlay lookup or jurisdictions table lookup |
| 2 | Strategic Queen handoffs must NOT specify or require new platform expansion. Platform choice is Distribution Queen's domain. | Output schema validation on `strategic_queen_handoffs` rows | Reject handoff with platform fields populated |
| 3 | No autonomous code/prompt mutation by bees (data-only updates) | Code review | Revert mutation |
| 4 | Source validation in E1 mandatory: no "disagreement detection only" mode. Must compare engine responses against truth_tables structured rules + legal_sources citations. | Code review + first-fire validation | Reject E1 deploys without structured comparison logic |
| 5 | Confidence on every ranked opportunity: confidence_in_ranking + reasoning + signal coverage assessment populated | Output schema validation | Re-run with proper output |
| 6 | Priority decay applies to ALL gap_queue rows, including manually-seeded (operator-seeded class) | Code review | Remove exceptions |
| 7 | Authority source snapshots required for engines_wrong classification (audit trail in authority_source_snapshots) | Database constraint or pre-write check | Cannot write engines_wrong without snapshot |
| 8 | Cost cap: E1 + E2 + E3 + E4 + E6 + E7 + E5 combined ≤ $5/day per site | K21 monitoring + pre-bee cost check | Skip bee for that day if exceeded, alert operator |
| 9 | Vanilla validation precedes Phase 2 sign-off (Done Condition #8) | First-fire process | Cannot sign off until passes |
| 10 | Locked decisions from Phase 1 carry forward (Path Y Company Pages only, Path A carousel, 3 posts/week, no external LinkedIn links, character voice rotation) | Distribution Queen spec inherits | Unchanged |
| 11 | CAB process for in-flight architectural additions (not calibration tweaks) per COLE-QUEEN-BUILD-PROCESS Section 3 | Operator gate | Document, defer, or approve |
| 12 | Audit-first protocols (#16-#34) enforced throughout build | Operator + AI discipline | Stop, audit, retry |
| 13 | Every E-bee that initiates external queries MUST call `filterTopicUniverse()` from `lib/cluster/blacklist-filter.ts` before queries (NEW v3.0) | Code review | Reject bee deploys missing the filter call |
| 14 | E1 writes to BOTH citation_gaps (canonical) AND product_research (qualification gate) AND conditionally gap_queue (operational). Skipping any of the three breaks downstream Synthesis Layer assumptions. (NEW v3.0) | Code review + first-fire validation | Reject E1 deploys missing any table write |
| 15 | E7 operator approval cascading writes are atomic. If any cascading write fails, entire transaction rolls back. truth_tables.is_current must never be flipped without corresponding new row insert. (NEW v3.0) | Database transaction wrapping + code review | Implement BEGIN/COMMIT/ROLLBACK pattern |

---

## 13. Schema Migration — Step 0

All Day 8 schema additions in one transaction. **Audit-first protocol applies (#17): full A1-A8 verification queries run before this SQL executes.**

### 13.1 Pre-migration audit (read-only verification)

Run these queries BEFORE applying migration. Confirms current schema state matches expectations.

```sql
-- A1: Verify Day 7 schema additions are present (3 rows expected)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'gap_queue'
  AND column_name IN ('opportunity_classification', 'last_signal_refreshed_at', 'ai_consensus_score');

-- A2: Verify Day 7 new tables exist (2 rows expected)
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('ai_engine_responses', 'authority_source_snapshots');

-- A3: Verify Phase 1 canonical citation gap cluster present (5 rows expected)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN (
  'citation_gaps', 'truth_tables', 'legal_sources', 'deadlines', 'jurisdictions'
);

-- A4: Verify Phase 1 GOAT qualification gate present (1 row expected)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'product_research';

-- A5: Verify existing E7 + E5 tables present (2 rows expected)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('rule_changes', 'geo_citations');

-- A6: Verify existing E4 registry present (1 row expected)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'competitors';

-- A7: Verify Day 8 additions DO NOT yet exist
-- Should return 0 rows (Day 8 gap_queue columns not yet added)
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'gap_queue'
  AND column_name IN ('topic_tags', 'cluster_routing_proposal', 'decay_class', 
                       'citation_gap_id', 'product_research_id');

-- Should return 0 rows (Day 8 new signal tables not yet created)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN (
  'market_research_signals', 'psychology_signals', 'competitor_signals', 'trend_signals'
);

-- Should return 0 rows (Day 8 strategic_queen_decisions columns not yet added)
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'strategic_queen_decisions'
  AND column_name IN ('opportunity_score', 'build_timing_score', 'signals_jsonb');

-- A8: Baseline gap_queue row count
SELECT COUNT(*) FROM gap_queue WHERE site = 'taxchecknow';
-- Note count. Post-migration count must match exactly (additive only, no data loss).
```

**If any expected count is wrong, STOP. Audit before proceeding.** Don't run the migration on a schema state that doesn't match expectations.

### 13.2 Migration SQL

```sql
-- ============================================================================
-- Strategic Queen Phase 2 v3.0 — Day 8 schema migration
-- 
-- Audit-first: run A1-A8 queries above first; confirm expected results
-- Apply this entire block in Supabase SQL Editor
-- All additive — no existing data modified
-- Idempotency: protected by IF NOT EXISTS where possible
-- ============================================================================


-- ============================================================================
-- 1. gap_queue extensions (cluster routing + canonical FKs + decay class)
-- ============================================================================

ALTER TABLE gap_queue
  ADD COLUMN topic_tags TEXT[];

CREATE INDEX idx_gap_queue_topic_tags 
  ON gap_queue USING GIN (topic_tags);

ALTER TABLE gap_queue
  ADD COLUMN cluster_routing_proposal JSONB;
  -- Reserved for COLE Orchestrator Phase 3. Stays NULL in Phase 2.

ALTER TABLE gap_queue
  ADD COLUMN decay_class TEXT
  CHECK (decay_class IN (
    'authority_anchored', 
    'citation_gap_anchored', 
    'velocity_anchored', 
    'operator_seeded', 
    'default'
  ));

CREATE INDEX idx_gap_queue_decay_class
  ON gap_queue(decay_class, last_signal_refreshed_at)
  WHERE decay_class IS NOT NULL;

-- Canonical citation gap link (FK to Phase 1 citation_gaps)
ALTER TABLE gap_queue
  ADD COLUMN citation_gap_id UUID REFERENCES citation_gaps(id);

CREATE INDEX idx_gap_queue_citation_gap_id
  ON gap_queue(citation_gap_id)
  WHERE citation_gap_id IS NOT NULL;

-- GOAT qualification link (FK to Phase 1 product_research)
ALTER TABLE gap_queue
  ADD COLUMN product_research_id UUID REFERENCES product_research(id);

CREATE INDEX idx_gap_queue_product_research_id
  ON gap_queue(product_research_id)
  WHERE product_research_id IS NOT NULL;


-- ============================================================================
-- 2. strategic_queen_decisions extensions (Synthesis Layer two-score model)
-- ============================================================================

ALTER TABLE strategic_queen_decisions
  ADD COLUMN opportunity_score NUMERIC 
  CHECK (opportunity_score BETWEEN 0 AND 1);

ALTER TABLE strategic_queen_decisions
  ADD COLUMN build_timing_score NUMERIC 
  CHECK (build_timing_score BETWEEN 0 AND 1);

ALTER TABLE strategic_queen_decisions
  ADD COLUMN signals_jsonb JSONB;
  -- Full snapshot of all 9 signal values feeding into the scores

CREATE INDEX idx_sqd_opportunity_score 
  ON strategic_queen_decisions(opportunity_score DESC)
  WHERE opportunity_score IS NOT NULL;


-- ============================================================================
-- 3. market_research_signals (E2 output, FK to citation_gaps + gap_queue)
-- ============================================================================

CREATE TABLE market_research_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site TEXT NOT NULL,
  citation_gap_id UUID REFERENCES citation_gaps(id) ON DELETE CASCADE,
  gap_queue_id UUID REFERENCES gap_queue(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  mention_count_7d INTEGER,
  mention_count_30d INTEGER,
  question_samples TEXT[],
  discussion_locations JSONB,
  collected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mrs_by_citation_gap ON market_research_signals(citation_gap_id);
CREATE INDEX idx_mrs_by_gap_queue ON market_research_signals(gap_queue_id);
CREATE INDEX idx_mrs_recent ON market_research_signals(site, collected_at DESC);

ALTER TABLE market_research_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access" ON market_research_signals
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- 4. psychology_signals (E3 output — distinct from psychology_insights)
-- ============================================================================

CREATE TABLE psychology_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site TEXT NOT NULL,
  citation_gap_id UUID REFERENCES citation_gaps(id) ON DELETE CASCADE,
  gap_queue_id UUID REFERENCES gap_queue(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  fear_intensity NUMERIC CHECK (fear_intensity BETWEEN 0 AND 1),
  top_objections TEXT[],
  urgency_signals TEXT[],
  extracted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ps_by_citation_gap ON psychology_signals(citation_gap_id);
CREATE INDEX idx_ps_by_gap_queue ON psychology_signals(gap_queue_id);
CREATE INDEX idx_ps_recent ON psychology_signals(site, extracted_at DESC);

ALTER TABLE psychology_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access" ON psychology_signals
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- 5. competitor_signals (E4 output — per-gap analysis, FK to competitors registry)
-- ============================================================================

CREATE TABLE competitor_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site TEXT NOT NULL,
  citation_gap_id UUID REFERENCES citation_gaps(id) ON DELETE CASCADE,
  gap_queue_id UUID REFERENCES gap_queue(id) ON DELETE CASCADE,
  competitor_id UUID REFERENCES competitors(id),
  topic TEXT NOT NULL,
  competition_score NUMERIC CHECK (competition_score BETWEEN 0 AND 10),
  competitor_weakness_map JSONB,
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cs_by_citation_gap ON competitor_signals(citation_gap_id);
CREATE INDEX idx_cs_by_gap_queue ON competitor_signals(gap_queue_id);
CREATE INDEX idx_cs_by_competitor ON competitor_signals(competitor_id);
CREATE INDEX idx_cs_recent ON competitor_signals(site, analyzed_at DESC);

ALTER TABLE competitor_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access" ON competitor_signals
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- 6. trend_signals (E6 output, FK to citation_gaps + gap_queue)
-- ============================================================================

CREATE TABLE trend_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site TEXT NOT NULL,
  citation_gap_id UUID REFERENCES citation_gaps(id) ON DELETE CASCADE,
  gap_queue_id UUID REFERENCES gap_queue(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  search_volume_absolute INTEGER,
  search_volume_velocity_pct NUMERIC,
  velocity_weighted_volume NUMERIC,
  measured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ts_by_citation_gap ON trend_signals(citation_gap_id);
CREATE INDEX idx_ts_by_gap_queue ON trend_signals(gap_queue_id);
CREATE INDEX idx_ts_recent ON trend_signals(site, measured_at DESC);

ALTER TABLE trend_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access" ON trend_signals
  FOR ALL TO service_role USING (true) WITH CHECK (true);
```

**Tables NOT created in v3.0 (versus v2.0's mistakes):**

- ❌ `authority_changes` — Phase 1's `rule_changes` is purpose-built for E7
- ❌ Parallel `geo_citations` schema — existing 18-column schema is richer
- ❌ `competitor_substitution` — existing `geo_citations.competitors_cited` array column handles substitution data

### 13.3 Post-migration backfill (Step 9 dependency)

Before Priority Decay cron goes live (Step 9), backfill existing rows:

```sql
-- Backfill last_signal_refreshed_at for existing gap_queue rows
UPDATE gap_queue
SET last_signal_refreshed_at = COALESCE(prioritised_at, created_at)
WHERE last_signal_refreshed_at IS NULL;

-- Backfill decay_class for existing rows (all Phase 1 manually-seeded)
UPDATE gap_queue
SET decay_class = 'operator_seeded'
WHERE decay_class IS NULL;

-- Note: citation_gap_id and product_research_id remain NULL for existing rows.
-- E1's next run will link them when it processes the matching topics.
-- This is intentional — preserves audit trail of "manually seeded vs E1 generated"
```

### 13.4 Post-migration verification

```sql
-- V1: Confirm gap_queue extensions present (5 rows expected)
SELECT column_name, data_type FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'gap_queue'
  AND column_name IN ('topic_tags', 'cluster_routing_proposal', 'decay_class',
                       'citation_gap_id', 'product_research_id');

-- V2: Confirm strategic_queen_decisions extensions (3 rows expected)
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'strategic_queen_decisions'
  AND column_name IN ('opportunity_score', 'build_timing_score', 'signals_jsonb');

-- V3: Confirm 4 new tables exist (4 rows expected)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN (
  'market_research_signals', 'psychology_signals', 
  'competitor_signals', 'trend_signals'
);

-- V4: Confirm no data loss in gap_queue (count matches A8)
SELECT COUNT(*) FROM gap_queue WHERE site = 'taxchecknow';

-- V5: Confirm RLS enabled on new tables (4 rows, all rowsecurity=true)
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename IN (
  'market_research_signals', 'psychology_signals',
  'competitor_signals', 'trend_signals'
);

-- V6: Confirm FK constraints to citation_gaps + gap_queue + competitors
SELECT
  tc.table_name, kcu.column_name, ccu.table_name AS foreign_table
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('market_research_signals', 'psychology_signals', 
                         'competitor_signals', 'trend_signals', 'gap_queue')
  AND ccu.table_name IN ('citation_gaps', 'gap_queue', 'competitors', 'product_research')
ORDER BY tc.table_name, kcu.column_name;
-- Expected: market_research_signals → citation_gaps + gap_queue (2 FKs)
--           psychology_signals → citation_gaps + gap_queue (2 FKs)
--           competitor_signals → citation_gaps + gap_queue + competitors (3 FKs)
--           trend_signals → citation_gaps + gap_queue (2 FKs)
--           gap_queue → citation_gaps + product_research (2 FKs)
-- Total: 11 foreign key relationships from these tables

-- V7: After backfill, confirm no NULL values that should be populated
SELECT 
  COUNT(*) FILTER (WHERE last_signal_refreshed_at IS NULL) AS null_refreshed,
  COUNT(*) FILTER (WHERE decay_class IS NULL) AS null_decay_class
FROM gap_queue;
-- Expected: both 0 after backfill SQL

-- V8: Confirm existing seed data preserved
SELECT 
  (SELECT COUNT(*) FROM citation_gaps WHERE is_active = true) AS citation_gaps_count,
  (SELECT COUNT(*) FROM truth_tables WHERE is_current = true) AS truth_tables_count,
  (SELECT COUNT(*) FROM legal_sources WHERE is_current = true) AS legal_sources_count,
  (SELECT COUNT(*) FROM deadlines WHERE is_active = true) AS deadlines_count,
  (SELECT COUNT(*) FROM competitors) AS competitors_count,
  (SELECT COUNT(*) FROM jurisdictions WHERE is_active = true) AS jurisdictions_active;
-- Expected: citation_gaps_count=5, truth_tables_count=3, legal_sources_count≥2, 
--           deadlines_count=3, competitors_count=3, jurisdictions_active=2 (AUS+USA)
```

### 13.5 Rollback plan

If migration fails partway or causes issues:

```sql
-- Rollback order (reverse of migration order)
-- WARNING: dropping tables loses any data written to them. Only run if confirmed nothing valuable inside.

DROP TABLE IF EXISTS trend_signals;
DROP TABLE IF EXISTS competitor_signals;
DROP TABLE IF EXISTS psychology_signals;
DROP TABLE IF EXISTS market_research_signals;

ALTER TABLE strategic_queen_decisions DROP COLUMN IF EXISTS signals_jsonb;
ALTER TABLE strategic_queen_decisions DROP COLUMN IF EXISTS build_timing_score;
ALTER TABLE strategic_queen_decisions DROP COLUMN IF EXISTS opportunity_score;

DROP INDEX IF EXISTS idx_gap_queue_product_research_id;
ALTER TABLE gap_queue DROP COLUMN IF EXISTS product_research_id;

DROP INDEX IF EXISTS idx_gap_queue_citation_gap_id;
ALTER TABLE gap_queue DROP COLUMN IF EXISTS citation_gap_id;

DROP INDEX IF EXISTS idx_gap_queue_decay_class;
ALTER TABLE gap_queue DROP COLUMN IF EXISTS decay_class;

ALTER TABLE gap_queue DROP COLUMN IF EXISTS cluster_routing_proposal;

DROP INDEX IF EXISTS idx_gap_queue_topic_tags;
ALTER TABLE gap_queue DROP COLUMN IF EXISTS topic_tags;
```

Rollback returns schema to Day 7 baseline. Phase 1 tables (citation_gaps, truth_tables, legal_sources, deadlines, rule_changes, geo_citations, competitors, product_research, jurisdictions) are NEVER touched by rollback — they're pre-existing infrastructure.

### 13.6 Migration safety properties

**Atomic:** Single SQL block runs in one transaction (PostgreSQL default — explicit BEGIN/COMMIT optional but recommended in production tooling).

**Idempotent for tables:** `CREATE TABLE` will fail if tables already exist — explicit pre-migration audit (A7) catches this. Could use `CREATE TABLE IF NOT EXISTS` for safety but PROTOCOL #17 explicit-state check is preferred — we want to KNOW when there's a collision, not silently skip.

**Additive only:** No existing data modified. No DROP. No DELETE. No UPDATE except backfill of new NULL columns.

**Reversible:** Full rollback plan in 13.5.

**Audited before and after:** A1-A8 confirm pre-state, V1-V8 confirm post-state.

---

## 14. Cost Projection

All costs are **order-of-magnitude estimates** calibrated against rough industry pricing. `[IMPLEMENTATION-CALIBRATED]` — actual costs locked after 7 days of production billing data.

### 14.1 Per-bee daily cost (Phase 2 starter scale: taxchecknow, 8 topics, 3 engines)

| Bee | Daily cost | Monthly cost | Cost drivers |
|---|---|---|---|
| E1 Citation Gap Scanner | ~$0.20 | ~$6 | 24 engine queries + 8 Sonnet rule extraction (cached after Day 1) + 8 Sonnet validation + 8 Sonnet GOAT gate evaluation |
| E7 Truth-Sync Monitor | ~$0.02 | ~$0.60 | 2-5 Sonnet classifications/day from filtered RSS items |
| E2 Market Researcher | ~$0.20 | ~$6 | Reddit API + 8 Sonnet question extractions |
| E3 Customer Psychologist | ~$0.15 | ~$4.50 | 8 Sonnet fear/objection/urgency extractions |
| E4 Competitor Monitor | ~$0.40 | ~$12 | Competitor scraping + Sonnet claim extraction |
| E6 Trend Velocity Scanner | ~$0.01 | ~$0.30 | pytrends (free) + minimal LLM use |
| E5 GEO Scanner | ~$0.50 | ~$15 | Shadow queries to 3 engines on published topics + Sonnet citation comparison |
| Priority Decay | $0 | $0 | Pure SQL, no LLM |
| Strategic Queen Synthesis | ~$0.05 | ~$1.50 | Existing Strategic Queen call, marginal cost of synthesis layer extension |
| **TOTAL** | **~$1.53** | **~$46** | per site at starter scale |

### 14.2 Cost cap enforcement

Hard Rule #8 caps daily spend at **$5/day per site** (combined E1-E7). K21 Cost Reporter enforces.

```typescript
// Conceptual enforcement (built in Step 0 cron or K21 extension)
// Before each bee fires:
const todayCostForSite = await sumAgentLogCostUsd(site, '24 hours');
if (todayCostForSite >= 5.00) {
  await writeAgentLog({
    bee_name,
    site,
    action: 'skipped_cost_cap_exceeded',
    result: `daily cost ${todayCostForSite} >= cap 5.00`,
  });
  return; // skip this bee for today
}
```

At ~$1.53/day estimated, taxchecknow has **3.3x headroom** before hitting the cap. Sufficient margin for traffic spikes, calibration retries, and growth.

### 14.3 Scale projections

| Scale | Sites | Daily cost | Monthly cost | Annual cost |
|---|---|---|---|---|
| Phase 2 launch (taxchecknow only) | 1 | $1.53 | $46 | $552 |
| Phase 3 (3 sites: tax + finance + AI) | 3 | $4.59 | $138 | $1,656 |
| Phase 4 (5 sites) | 5 | $7.65 | $230 | $2,760 |
| Phase 5 (10 sites, mature cluster) | 10 | $15.30 | $459 | $5,508 |

`[IMPLEMENTATION-CALIBRATED: scale projections refine after first 30 days of taxchecknow billing. Real numbers may vary ±50% from estimates.]`

### 14.4 Revenue context

Phase 2 success doesn't depend on cost optimization. The brain is cheap relative to revenue projections:

- 1 $147 product sale per month per site = $147 revenue vs $46 cost = **3.2x net positive at smallest scale**
- 5 sales per month per site at $67 = $335 vs $46 cost = **7.3x net**
- 10-site cluster at modest 3 sales/month/site = $2,000+ revenue vs $459 cost = **4.4x net**

The cost discipline isn't about saving money — it's about catching runaway spend (infinite loops, prompt explosions, retry storms). $5/day cap is the canary.

### 14.5 Cost reduction opportunities (Phase 4 maturation)

These are calibration items (no CAB needed) that may reduce cost during 30-day maturation:

| Opportunity | Potential savings | Trigger |
|---|---|---|
| Cache truth_tables rule extraction past Day 1 | 30% of E1 cost | Existing gaps don't need re-extraction |
| Reduce engine query frequency for stable gaps | 20% of E1 cost | Settled gaps need less frequent re-validation |
| Switch E3 to smaller model for extraction | 50% of E3 cost | If GPT-4o-mini handles extraction adequately |
| Skip E6 on topics with no velocity_signal trend for 30 days | 30% of E6 cost | Saves trends API calls on flat topics |
| Skip E4 on competitors with no claim changes | 40% of E4 cost | Static competitor pages don't need re-analysis |

Total potential savings during maturation: ~25-30% of Phase 2 starter cost. Not pursued at launch (premature optimization). Phase 4 maturation may pursue these as calibration.

---

## 15. Phase 3+ Deferrals

Explicit list of what is NOT in Phase 2 scope, with reasoning. These come up as candidates during build — they get deferred, not added.

### 15.1 Deferred to Phase 3 (COLE Orchestrator)

| Item | Reason for deferral |
|---|---|
| **Semantic blacklist classification (Sonnet)** | Phase 2 ships cheap keyword filter. Semantic layer for edge cases is COLE Orchestrator territory. |
| **Cross-site territory routing logic** | Single site in Phase 2; routing only matters when multiple sites exist. |
| **Operator review queue for new territory candidates** | Surfacing gaps outside any site's claim_radius only makes sense with multiple sites. |
| **Product relationship graph ("crossover ping")** | Cross-site product links only matter with multiple sites. |
| **New site incubation panel** | Cluster-level dashboard, not per-site. |
| **Authority feed full automation (E7 auto-approve)** | Phase 2 ships manual approval. Auto-approve only after 30+ days of operator approvals consistently match Sonnet at ≥0.95 confidence. |
| **Cost-to-Opportunity math (expected value × required energy)** | Needs revenue baseline. Phase 2 has 0 purchases to calibrate against. |
| **E8 Search Opportunity Scanner** | Lower ROI than E1-E7. Polish layer once core engine proven. |
| **`gap_queue.cluster_routing_proposal` population** | Phase 2 ships the column scaffold; COLE Orchestrator writes to it. |

### 15.2 Deferred to other queens (not Strategic Queen scope)

| Item | Belongs to |
|---|---|
| **B1 / B2 Adaptive brokers** | Adaptive Queen Phase 2 |
| **K1 Scientist Bee autonomous V2 generation** | Adaptive Queen Phase 2 |
| **DQ1 Data Integrity Bee** | Adaptive Queen Phase 2 |
| **K12 → strategic_queen_memory auto-write promotion** | Adaptive Queen Phase 2 (Strategic Queen consumes memory, doesn't auto-write it) |
| **lessons_learned writes** | Adaptive Queen Phase 2 (pattern detection with operator approval workflow) |
| **Weekly aggregation of E2 output to `research_questions` / `li_research` / `x_research` / `ig_research` / `yt_research`** | Adaptive Queen Phase 2 weekly digest |
| **psychology_insights writes** | Adaptive Queen / K12 territory — populated from post-conversion data |
| **H2 Reddit Authority Piggyback Bee (Decision 26)** | Distribution Queen Phase 2 |
| **llms.txt Manager (Decision 28)** | Distribution Queen Phase 2 |
| **Authority snippet block format generator (Decision 28)** | Production Queen Phase 2 |
| **No-platform-expansion enforcement** | Distribution Queen Phase 2 (Strategic Queen handoffs are platform-agnostic per Hard Rule 2) |
| **Carousel pipeline + multi-platform publishing** | Distribution Queen Phase 2 |

### 15.3 Deferred to maturation period (calibration, no CAB)

These are EXPECTED to be tuned during Phase 4 maturation. NOT scope additions:

- E1 Sonnet prompt template iteration based on real engine responses
- E1 GOAT gate evaluation prompt iteration
- E7 RSS URL fixes when feeds change
- E7 expansion to IRS / IRD-NZ / CRA (scrape adapters)
- E2 subreddit list adjustments (add r/Whatever, remove inactive ones)
- E3 fear/objection vocabulary tuning per niche
- E4 competitor list expansion (add rows to existing competitors registry)
- E6 velocity threshold tuning
- Signal weight tuning in Synthesis Layer
- Decay rate tuning per `decay_class`
- Topic universe expansion (within existing overlay, e.g., 8 → 47 products)
- Authority source URL fixes
- Blacklist additions (operator notices edge cases)
- Cron schedule tuning
- Cost cap adjustments within $5/day envelope
- Tier threshold tuning (5/20/50/80/95 defaults)
- product_research GOAT gate weights tuning

### 15.4 Genuinely later (Phase 3 minimum, possibly Phase 4)

| Item | Reason |
|---|---|
| **Multi-site cluster (Production Queen, Distribution Queen Phase 2 also need to ship first)** | Strategic Queen alone doesn't make a cluster |
| **Vanilla template extraction** | Triggers after Strategic Queen Phase 5 sign-off (~Day 42+) per COLE-QUEEN-BUILD-PROCESS Section 1 |
| **Second site overlay deployment** | Acceptance test stub is Step 12 of build. Real second site is Phase 3+. |
| **Public API for citation gap data** | Premature productization. Build internal pipeline first. |
| **Per-niche signal weight learning (auto-calibration)** | Requires Adaptive Queen learning loop |
| **UI for blacklist editing** | Phase 2 ships JSON file editing. UI when blacklist edits become frequent. |
| **UI for rule_changes approval** | Phase 2 ships read-only panel. Approval via Supabase Studio. UI button mid-sprint enhancement. |

---

## 16. Open Questions — Real Build-Time Decisions

These are genuine unknowns that will need resolving during Phase 2 build. Not scope creep — real decisions where Phase 2 spec can't pre-commit.

### 16.1 Engine selection edge cases

**Q1:** If GPT-4o-mini's responses are too short/superficial for tax topics, upgrade to GPT-4o or GPT-5?
- **Resolution path:** Calibrate during E1 build (Step 2). Test against 5-10 starter topics. If responses lack substance, upgrade model in overlay config (no code change — overlay-driven).
- **Cost impact:** GPT-4o is ~3-5x GPT-4o-mini. Still well within $5/day cap.

**Q2:** If 3 engines produce too few `engines_wrong` classifications (most topics are settled), do we add Perplexity (deferred Decision 10) as a 4th engine?
- **Resolution path:** Observe E1 classification distribution for 14 days. If >80% are `settled`, signal-to-noise too low — add Perplexity for citation diversity.
- **Calibration trigger:** Day 14 of E1 operation.

### 16.2 Authority source fetch edge cases

**Q3:** ATO HTML pages render with JavaScript — does our HTML-to-markdown fetcher capture the content?
- **Resolution path:** Test fetch URL of `https://www.ato.gov.au/businesses-and-organisations/...` during Step 2 build. If JavaScript-rendered content missing, add Puppeteer-based fetcher to `lib/sources/fetcher.ts`.
- **Fallback:** Manual content capture in overlay (paste authority text directly into config) if scraping unreliable.

**Q4:** What happens when ATO changes a URL (e.g., reorganizes their site)?
- **Resolution path:** E7 detects via RSS that page moved; operator updates overlay `authoritative_sources` URL during maturation. This is calibration, not CAB.

### 16.3 Reddit / forum scraping reliability

**Q5:** Reddit API rate limits — how do we handle 429 responses gracefully?
- **Resolution path:** Standard exponential backoff in `lib/sources/reddit.ts`. If sustained 429s, switch to read-only public JSON endpoints (no auth needed, slower but no rate limit on small queries).

**Q6:** What if a subreddit gets banned/quarantined mid-build?
- **Resolution path:** E2 logs the failure, continues with remaining subreddits. Operator removes banned subreddit from overlay during maturation.

### 16.4 Google Trends fragility

**Q7:** pytrends library has historically broken when Google updates Trends UI. What's our fallback?
- **Resolution path documented in Phase 3 deferrals:** If pytrends breaks within Phase 4 maturation, switch to DataForSEO Trends API (~$5-15/month). Maintained, reliable, paid.
- **Decision deferred until breakage occurs.** Don't pre-emptively switch.

### 16.5 Bing Webmaster API specifics

**Q8:** Does Bing Webmaster API expose AI Performance citations programmatically, or is the dashboard the only access?
- **Resolution path:** Research during Step 8 build. If no API for AI Performance data, E5 ships with shadow queries only (skip Bing Webmaster integration, document as Phase 3 work when API improves).

**Q9:** How does operator generate the `BING_WEBMASTER_API_KEY`?
- **Resolution path:** Walkthrough during Step 8 build. Operator generates key in Bing Webmaster Tools Settings → API Access.

### 16.6 Strategic Queen Synthesis Layer behaviour

**Q10:** What happens when only E1 has fired (E2-E7 not yet built)?
- **Resolution path:** Synthesis Layer gracefully degrades per Section 5.7. `opportunity_score` computed from authority_clarity + ai_wrongness + goat_qualification only (other signals NULL). `confidence_in_ranking` drops proportionally to indicate partial-data assessment.
- **Why this works:** Lego stack means partial system always operates. Synthesis on partial data is honest output, not failure.

**Q11:** When Synthesis Layer produces a ranked_opportunity but no Production Queen handoff is approved by operator, what happens?
- **Resolution path:** Opportunity sits in `strategic_queen_decisions` with `acted_on_at = NULL`. Visible in dashboard. Decays per Priority Decay over time. Eventually archived. Operator can manually escalate if they want to revive.

### 16.7 GOAT qualification gate edge cases

**Q12:** What if a topic passes 6 of 7 gates but the missing gate is `gate_deadline` (no time-sensitivity)?
- **Resolution path:** Recommendation = `BUILD_PENDING_OPERATOR`. Operator decides whether evergreen topic without deadline is worth building.
- **Pattern observed in Phase 1 data:** au-section-100a-trust passed audit-risk gates but lacked hard deadline → manual operator decision.

**Q13:** What if engines disagree but no truth_tables structured rule exists yet for comparison?
- **Resolution path:** Fall back to Sonnet validation (Step 6) using legal_sources content. Lower confidence on classification. Flag for operator to create truth_tables rule entry during maturation if topic gets attention.

### 16.8 Build-time discoveries

**Q14-Q∞:** Things we don't know yet but will surface during build.
- **Resolution path:** Capture in `DAY-N-BUILD-NOTES.md` (per-day build journal). Items that require operator decisions → CAB process. Items that are calibration → make the call and document.

---

## 17. Sign-Off Conditions

Per COLE-QUEEN-BUILD-PROCESS.md Section 1, sign-off occurs at three points:

### 17.1 First-Fire Sign-Off (end of Phase 2 build)

Triggers when all 8 done conditions from Section 11 pass verification queries.

**Operator review:**
- Review all 8 done condition queries with operator
- Operator confirms each one with explicit "yes" or "no"
- If "no" on any: iterate that condition, retry
- If 8/8 "yes": First-Fire Sign-Off granted

**State change at first-fire:**
- Strategic Queen enters Phase 4 maturation
- 30+ day calibration period begins
- Calibration tweaks no longer require CAB
- Architectural additions still CAB-gated
- Daily monitoring + weekly tuning expected

**Document produced:**
- `STRATEGIC-QUEEN-FIRST-FIRE-SIGNOFF.md` with all 8 conditions + verification timestamps + operator confirmation

### 17.2 Maturity Sign-Off (end of Phase 4 maturation, ~Day 42+)

Triggers when operator declares system stable after 30+ days of production operation.

**Operator review checklist:**

```
[ ] Confidence scores trending upward over last 14 days
[ ] Daily cost steady (within ±20% week-over-week)
[ ] Operator reviewing fewer false-positive opportunities than week 1
[ ] gap_queue rows producing genuine product opportunities (operator confirms qualitatively)
[ ] product_research goat_score distribution matches operator expectations
[ ] Strategic Queen handoffs converting to Production Queen builds
[ ] No CAB-triggered scope creep accepted during maturation
[ ] All calibration tweaks documented in DAY-N-BUILD-NOTES.md files
[ ] E1 prompt templates locked (final calibrated version in spec)
[ ] E1 GOAT gate evaluation prompt locked
[ ] E7 RSS adapters for IRS/IRD-NZ/CRA built (or explicitly deferred to Phase 3)
[ ] Authority source URLs verified stable
[ ] Signal weights calibrated based on observed opportunities
[ ] Cost baseline established (actual vs Section 14 projection)
[ ] Phase 1 seed data fully validated by E1 (verified_by populated with our 3 engines)
```

**State change at maturity:**
- Strategic Queen enters Phase 5
- Vanilla extraction trigger fires
- Next Queen build (Production Queen Phase 2) can begin Phase 0

**Document produced:**
- `STRATEGIC-QUEEN-MATURITY-SIGNOFF.md` with all checklist items + calibration deltas

### 17.3 Vanilla Extraction Trigger (post-maturity)

After Maturity Sign-Off, AI + operator review Strategic Queen's code for CORE/OVERLAY discipline:

**Process:**

1. AI reviews every file in `lib/queens/strategic-*`, `lib/overlay/*`, `lib/sources/*`, `lib/cluster/*`, `app/api/cron/e*`, `app/api/cron/strategic-queen/*`
2. AI flags any code that should move from queen-specific to vanilla template
3. AI proposes vanilla template structure for next queen build (Production Queen Phase 2)
4. Operator approves vanilla extraction
5. Vanilla template becomes baseline for next queen

**Document produced:**
- `STRATEGIC-QUEEN-VANILLA-EXTRACTION.md` with extracted patterns + reusable code references

**Then:** Production Queen Phase 0 (Decision Capture) begins per COLE-QUEEN-BUILD-PROCESS.

### 17.4 Sign-off conditions — Phase 2 spec itself

Before any code is written, this spec must be signed off:

- [ ] All 28 architectural decisions from DAY-7-DECISIONS-CAPTURED.md integrated
- [ ] Day 8 audit findings integrated (Section 2.4 + Section 13 corrected migration)
- [ ] Macro thesis approved (Section 0)
- [ ] CORE/OVERLAY rule accepted (Section 1)
- [ ] Two-score model accepted (Section 5)
- [ ] Priority Decay with decay_class accepted (Section 6)
- [ ] E7 build position 3 accepted (per Decision 23)
- [ ] E7 writes to existing `rule_changes` table accepted (v3.0 correction)
- [ ] E1 writes to citation_gaps + truth_tables + legal_sources + product_research (v3.0 correction)
- [ ] GOAT qualification gate integration accepted (Section 4.2 Step 8)
- [ ] Shared blacklist filter utility accepted (Section 9.6)
- [ ] Cluster data layer approach accepted (Section 9)
- [ ] Build order with 13 steps accepted (Section 10)
- [ ] 8 done conditions accepted (Section 11)
- [ ] 15 hard rules accepted (Section 12)
- [ ] Schema migration v3.0 approved (Section 13 — 4 new tables + 8 columns)
- [ ] Cost projection acceptable (Section 14)
- [ ] Phase 3+ deferrals accepted (Section 15)

When all 18 boxes ticked, spec is locked and Step 0 (schema migration) begins.

---

## 18. References

### Canonical process docs (read first)
- **COLE-QUEEN-BUILD-PROCESS.md** — Operating system for every queen build. `/mnt/user-data/outputs/cole-process/`
- **DAY-7-DECISIONS-CAPTURED.md** — 28 architectural decisions. `/mnt/user-data/outputs/day-7-capture/`

### Strategic Queen Phase 2 specific
- **STRATEGIC-QUEEN-PHASE-2.md** — This document (v3.0, canonical)
- **STRATEGIC-QUEEN-PHASE-2-v2-ARCHIVED.md** — Previous version (v2.0, architecturally invalid before audit corrections). Preserved as historical reference for the v2.0 → v3.0 evolution.
- **HANDOVER-NEXT-CHAT.md** — Day 9+ resume orientation. `/mnt/user-data/outputs/day-8-handover/`
- **PHASE-1-CLOSE-OUT.md** — Phase 1 sign-off baseline. `/mnt/user-data/outputs/phase-1-closeout/`

### Existing infrastructure
- **Vanilla Template Rollout doc** — Original Phase 1/2 framework (operator's canonical doc)
- **`/dashboard/architecture-bible`** — Day 6 EOD architecture (2,719 lines in soverella repo)
- **Strategic Queen route** at commit `d879c21` (baseline before Phase 2 extensions)
- **Live dashboards:** `/dashboard/monitor/strategic-queen`, `/dashboard/monitor/distribution-queen`, `/dashboard/monitor/adaptive-queen`, `/dashboard/monitor/governance-queen`

### Phase 1 canonical infrastructure (audit-discovered, v3.0 leverages)
- **citation_gaps** + **truth_tables** + **legal_sources** + **deadlines** + **jurisdictions** — Citation gap canonical cluster
- **product_research** — GOAT qualification gate (7 boolean gates + goat_score)
- **rule_changes** — E7 Truth-Sync Monitor target table
- **geo_citations** — E5 GEO Scanner target table (existing 18-column schema)
- **competitors** — E4 reference registry

### Live system references
- **Supabase project:** `ngxuroxsabyamqcnvrei`
- **Vercel project:** `soverella` → `www.soverella.com`
- **Repos:** `C:\Users\MATTV\CitationGap\soverella\`, `cole-marketing\`, `cluster-worldwide\taxchecknow\`

### Future Queen specs (to be written, follow same pattern as this doc)
- **PRODUCTION-QUEEN-PHASE-2.md** — After Strategic Queen Phase 5 sign-off
- **DISTRIBUTION-QUEEN-PHASE-2.md** — After Production Queen Phase 5 sign-off
- **ADAPTIVE-QUEEN-PHASE-2.md** — After Distribution Queen Phase 5 sign-off
- **MADAME-GOVERNANCE-QUEEN-PHASE-2.md** — After Adaptive Queen Phase 5 sign-off
- **COLE-ORCHESTRATOR-QUEEN-PHASE-3.md** — After all five queens mature

---

## 19. Process Template Established Here

Strategic Queen Phase 2 v3.0 is the **first queen following the full COLE-QUEEN-BUILD-PROCESS pattern through to spec completion with audit-first discipline**. The structure of this spec — 19 sections, audit-first protocols including Protocol #34 (full schema audit before migration), CORE/OVERLAY rules, lego-stack build order with explicit Phase 1 infrastructure leverage, three-stage sign-off, Phase 3+ deferrals — becomes the template for all subsequent queen specs.

When the next queen build begins (Production Queen Phase 2 after Strategic Queen Phase 5 sign-off):

- Use this spec (v3.0) as the structural template
- Adapt content per queen's domain
- Follow the same 6-phase pattern (Decision Capture → Handover+Spec → Implementation → First-Fire → Maturation → Sign-Off+Vanilla)
- Inherit all 34+ locked protocols
- Apply CAB process for in-flight scope changes
- Run audit-first protocols throughout (especially Protocol #34 schema audit BEFORE any migration)

Deviations from the template require operator approval per COLE-QUEEN-BUILD-PROCESS Section 0.

### 19.1 What v3.0 contributes to the template

Beyond what v2.0 established, v3.0 adds:

1. **Full Phase 1 infrastructure audit before spec finalization** (Section 2.4) — every future queen must audit existing infrastructure before proposing parallel tables
2. **Protocol #34** — full information_schema.tables audit before any Phase 2 schema migration
3. **Version history at top of spec** (lines 7-30 of this document) — every queen spec records its evolution
4. **Explicit "Tables NOT created" callouts** in schema migration sections — surface anti-patterns avoided
5. **Done conditions grounded in seed data** (Section 11.1) — first-fire validation uses existing operator-curated data, not empty-database hopes
6. **Cascading approval workflows** (Section 7.2 Step 4 for E7) — pattern for any bee that updates canonical infrastructure on operator approval
7. **Atomicity hard rules** (Hard Rule 15) — cascading writes must transact atomically
8. **18-item spec sign-off checklist** (Section 17.4, up from v2.0's 14) — covers Day 8 audit findings explicitly

### 19.2 The architectural lesson v3.0 encodes

> **Discover existing infrastructure before designing parallel infrastructure.**

v1.0 → v2.0 evolved through architectural reasoning. v2.0 → v3.0 evolved through architectural reality-check against Supabase schema state. Both kinds of evolution are necessary. Audit-first protocols ensure both happen in the right order: reason first (v1.0-v2.0), audit reality second (v2.0-v3.0), lock spec third (v3.0).

For every future queen: assume Phase 1 + prior queens' work has created infrastructure your queen should leverage, not duplicate. Audit before designing.

---

End of Strategic Queen Phase 2 spec v3.0.

**Version:** 3.0 (Day 8 audit-corrected)  
**Locked at:** Day 8 AWST (post operator sign-off on Section 17.4 checklist)  
**Implementation begins at:** Step 0 (schema migration) immediately after sign-off  
**First-Fire target:** Day 8-10 (Step 11 end-to-end validation)  
**Maturity target:** Day 42+ (30 days post first-fire)  
**Vanilla extraction target:** Day 42-50  
**Process template established:** This document. Every queen build follows.

