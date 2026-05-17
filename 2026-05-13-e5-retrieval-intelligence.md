# E5 reframed: "AI Citation Tracking" → "Retrieval Intelligence"

**Date:** 2026-05-13 (Day 10)
**Context:** Strategic Queen Phase 2, designing E5 GEO Scanner
**Trigger:** Research into Microsoft Bing AI Performance data sources
**Status:** New canonical framing — affects E5 spec, schema design, dashboard

---

## What we realized

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

## What this changes architecturally

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

## Honest disclosures

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
