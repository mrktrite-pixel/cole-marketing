# Audit — Unit 1 Foundation

- Date: 2026-05-17
- soverella main: `c7099d1` (working tree dirty: 2 modified, 1 untracked — DAY13 handover doc)
- cole-marketing main: `372e1ae`
- Method: READ-ONLY. File/code/cron/overlay = direct read. Schema = live PostgREST
  OpenAPI introspection (`GET /rest/v1/`) using cole-marketing/.env.local service-role
  key. No `psql` available on host; no DB password for direct `\d`. OpenAPI gives live
  column names + PG types + PK/FK — treated as the `\d` equivalent.
- Environment note: prompt assumed `/mnt/skills/...` Linux paths; actual host is Windows,
  repos at `C:\Users\MATTV\CitationGap\{soverella,cole-marketing}`. Skill files read from
  `cole-marketing/SKILL.md` + `cole-marketing/.claude/skills/cole-brain-final/SKILL.md`.

---

## A1 — Current Strategic Queen fire path (E1)

E1 = Citation Gap Scanner. Route delegates to `runE1()` in lib.

```json
{
  "file_path": "soverella/lib/queens/e1-citation-gap-scanner.ts (route: soverella/app/api/cron/e1-citation-gap-scanner/route.ts)",
  "cron_path": "/api/cron/e1-citation-gap-scanner?site=taxchecknow",
  "cron_schedule": "0 4 * * *",
  "last_success_at": "2026-05-17T04:04:40.488Z"
}
```

Notes: `agent_log` has no `status` column — success encoded as `action="e1_completed"`
(failure = `e1_failed`). Last run: `qualified=3, no_go=5, errors=0, topics_processed=8,
cost_usd=0.108`. Daily 04:04 UTC firing consistent across 2026-05-14..17.

---

## A2 — Tables E1 reads and writes

Reads/writes from `e1-citation-gap-scanner.ts` + its route. Overlay is loaded via
`loadOverlay()` (file, not a table).

```json
{
  "reads": ["citation_gaps", "legal_sources", "truth_tables", "deadlines", "gap_queue"],
  "writes": [
    { "table": "ai_engine_responses", "columns": "id,site,topic,engine_name,query_text,response_text,response_metadata,cost_usd,tokens_used,query_at,error_message (11)" },
    { "table": "truth_tables", "columns": "id,jurisdiction_code,gap_id,rule_key,rule_value,rule_type,effective_date,expiry_date,source_url,source_name,last_verified,is_current,created_at (13)" },
    { "table": "legal_sources", "columns": "id,jurisdiction_code,gap_id,source_type,title,section,url,enacted_date,verified_date,is_current,created_at (11)" },
    { "table": "citation_gaps", "columns": "id,jurisdiction_code,gap_name,gap_title,law_name,law_section,enacted_date,ai_drift_description,verified_by,demand_score,complexity_score,ai_drift_score,financial_impact_score,total_score,is_active,created_at (16)" },
    { "table": "product_research", "columns": "29 cols incl id,topic,country,site,citation_gap_confirmed,gate_*(7),gates_passed,block_scores,goat_score,recommendation,config_skeleton,research_status" },
    { "table": "gap_queue", "columns": "26 cols incl id,topic,site,priority_score,priority_tier,opportunity_classification,citation_gap_id,product_research_id,decay_class,cluster_routing_proposal" },
    { "table": "pending_approvals", "columns": "id,site,decision_type,status,payload,source_table,source_id,created_at,decided_at,decided_by,decision_reason,acted_id (12)" },
    { "table": "authority_source_snapshots", "columns": "id,site,topic,source_url,source_content,fetch_strategy,fetched_at,validity_until,fetch_error (9)" },
    { "table": "agent_log", "columns": "written by route, not pipeline — see A11" }
  ]
}
```

Notes: `gap_queue` and `citation_gaps` are read AND written. `authority_source_snapshots`
written indirectly via `fetchAuthoritySource()` (lib/sources/fetcher.ts) 7-day cache.

---

## A3 — strategic_queen_handoffs table

```json
{
  "exists": true,
  "columns": [
    "id uuid PK", "site text", "gap_id uuid", "handoff_type text",
    "recommended_character text", "recommended_phase text",
    "handed_off_at timestamptz", "handed_to text", "acted_on_at timestamptz",
    "acted_on_by text", "notes text", "synthesis_provenance jsonb"
  ]
}
```

12 columns. Indexes not exposed by OpenAPI introspection (only PK confirmed) — operator
to confirm secondary indexes via `\d` if needed.

---

## A4 — demand_candidates table

```json
{ "exists": false, "columns": null }
```

DOES NOT EXIST. Not in the 76-table live schema. Zero references in soverella or
cole-marketing (code or docs) — `grep -rln "demand_candidates"` returned nothing.

---

## A5 — products table — fan_out_queries column check

```json
{
  "has_fan_out_queries": false,
  "has_canonical_question": false,
  "has_authority_grounding": false,
  "full_column_list_summary": "19 columns: id,product_id,site,country,slug,name,tier1_price,tier2_price,tier1_key,tier2_key,product_status,goat_score,config_path,deadline,affected_count,monitor_urls,live_at,created_at,updated_at"
}
```

None of the three target columns exist. `canonical_question` currently lives in the
overlay `topic_universe[].canonical_question` (soverella/overlays/taxchecknow/strategic.json),
NOT on a table.

---

## A6 — E2e-gemini and E2e-chatgpt

These are NOT standalone bees with their own files/crons. They are entries in the overlay
`market_research_bees` array, dispatched by the single E2 orchestrator.

```json
{
  "e2e_gemini": {
    "file": "lib/sources/ai-citations.ts → fetchGeminiCitation (orchestrated by lib/queens/e2-market-researcher.ts, route app/api/cron/e2-market-research/route.ts)",
    "cron": "/api/cron/e2-market-research?site=taxchecknow @ 0 5 * * * (shared — no dedicated cron)",
    "captures_fanout": true,
    "writes_to": ["market_research_signals", "agent_log"]
  },
  "e2e_chatgpt": {
    "file": "lib/sources/ai-citations.ts → fetchChatGPTCitation (same orchestrator/route as above)",
    "cron": "/api/cron/e2-market-research?site=taxchecknow @ 0 5 * * * (shared)",
    "captures_fanout": false,
    "writes_to": ["market_research_signals", "agent_log"]
  }
}
```

Detail: `fetchGeminiCitation` reads `candidate.groundingMetadata.webSearchQueries` and
stores it as `content_metadata.search_queries` (ai-citations.ts ~line 322). ChatGPT path
(OpenAI Responses API `web_search` tool) captures only `url_citation` annotations into
`content_metadata.citations[]` — no fan-out / search-query list captured.

---

## A7 — E6 Trend Velocity + Priority Decay

```json
{
  "e6": {
    "file": "lib/queens/e6-trend-velocity-scanner.ts (route app/api/cron/e6-trend-velocity/route.ts, cron 45 6 * * *)",
    "table": "trend_signals (writes), bee_run_metrics (run metrics); reads market_research_signals + citation_gaps + gap_queue",
    "status": "DEFERRED — confirmed. E6_ACTIVATION_DATE = '2026-05-27' hardcoded; bee fires daily but Stage-0 early-returns before that date, writing deferred bee_run_metrics rows. Matches locked architecture."
  },
  "priority_decay": {
    "file": "lib/queens/priority-decay.ts (route app/api/cron/priority-decay/route.ts, cron 30 6 * * *)",
    "table": "gap_queue (UPDATE priority_score/priority_tier), bee_run_metrics (run metrics)"
  }
}
```

Time-series for Bee 2 `ai_citation_velocity`: `trend_signals` holds the velocity series
(`search_volume_absolute`, `search_volume_velocity_pct`, `velocity_weighted_volume`,
`measured_at`). Source counts come from `market_research_signals` (`mention_count_7d/30d`).

---

## A8 — Overlay state (soverella/overlays/taxchecknow/strategic.json)

`market_research_bees` is a JSON ARRAY of `{bee_id, enabled, ...}` objects — NOT an object
keyed `e2a`/`e2b`. The audit path `market_research_bees.e2a.enabled` does not resolve as
written; resolved by `bee_id` match below.

```json
{
  "e2a_enabled": false,
  "e2b_enabled": false,
  "all_bees_state": {
    "e2a-google-reddit": false,
    "e2b-brave-reddit": false,
    "e2c-brave-stackexchange": true,
    "e2e-chatgpt": true,
    "e2e-gemini": true
  }
}
```

e2a/e2b match expected (false). e2c/e2e-chatgpt/e2e-gemini are enabled=true — Phase 1
quick-wins only specified e2a/e2b disable; the three enabled bees are reported as-is, not
flipped.

---

## A9 — Cron inventory and ghost cron sweep

22 cron entries in soverella/vercel.json. 13 have dedicated static route dirs under
`app/api/cron/`; the other 9 resolve through the dynamic `app/api/cron/[bee]/route.ts`,
which whitelists against `lib/bees/_registry.ts`. All 9 dynamic-routed bee names are
present as registry keys (`doctor-bee`, `k12-pattern-learner`, `j1.5-viral-template-scraper`,
`scheduled-publisher`, `j3.6-carousel-renderer`, `k14-confidence-evaluator`,
`k20-queue-monitor`, `k21-cost-reporter`, `v1-policy-validator`).

```json
{
  "total_crons": 22,
  "orphans": [],
  "deprecated_still_present": []
}
```

No cron path is named G1/G2/G4/I2/V2/B1/B2 — none of the DELETE-disposition bees have a
cron entry. Every cron resolves to a route.

Cron list: ping, k20-queue-monitor, k21-cost-reporter, v1-policy-validator,
strategic-queen, distribution-queen, k14-confidence-evaluator, adaptive-queen,
governance-queen, doctor-bee, k12-pattern-learner, j1.5-viral-template-scraper,
scheduled-publisher, j3.6-carousel-renderer, tactical-queen, e7-truth-sync,
e1-citation-gap-scanner, e2-market-research, e3-customer-psychologist,
e4-competitor-monitor, priority-decay, e6-trend-velocity.

---

## A10 — Tactical → Production naming state

```json
{
  "code_files_with_tactical": 25,
  "table_count_with_tactical_prefix": 1,
  "table_names": ["tactical_queen_observations"]
}
```

Breakdown: `grep -rln "tactical_queen"` (underscore) = 17 files; `grep -rln "tactical-queen"`
(hyphen) = 25 files (count reported uses the hyphen form per A10 field naming; underscore
count noted for completeness). Live DB has exactly one `tactical_queen_*` table:
`tactical_queen_observations`. Cron `/api/cron/tactical-queen` + route + lib files
(`lib/queens/tactical-queen-*.ts`) all still present. Tactical→Production rename not done.

---

## A11 — agent_log + cost tagging baseline

```json
{
  "columns": ["id uuid PK", "bee_name text", "job_id uuid", "product_key text", "action text", "result text", "model_used text", "tokens_used integer", "cost_usd numeric", "created_at timestamptz", "site text"],
  "sample_row_has_cost_tags": true,
  "tags_present_today": ["bee_name", "model_used", "tokens_used", "cost_usd", "site"]
}
```

11 columns. Sample row (governance-queen, 2026-05-17T10:00 UTC) has `model_used`,
`tokens_used`, `cost_usd` populated — per-row cost data exists. But agent_log has NO
`queen_id` / `hive` / bee-category tagging column; `bee_name` is the only bee identifier.
Queen/hive/run cost tagging lives in the SEPARATE `bee_run_metrics` table (14 cols:
`site, bee_name, queen_id, run_id, success_count, error_count, cost_usd, tokens_used,
run_duration_ms, accuracy_metrics, lessons_learned, edge_cases_observed, fired_at`).

---

## A12 — LLM spend last 30 days

No billing-API access and no vendor-console access from this session.

```json
{
  "gemini_30d": "UNAVAILABLE",
  "anthropic_30d": "UNAVAILABLE",
  "openai_30d": "UNAVAILABLE",
  "perplexity_30d": "$0 — no Perplexity engine exists in the system",
  "source": "estimate"
}
```

Internal DB-attributed estimate ONLY (not vendor billing): `ai_engine_responses`
2026-04-17..05-17 (288 rows) — anthropic-claude-sonnet-4-6 $0.7534, openai-gpt-4o-mini
$0.0157, google-gemini-2-5-flash $0.0009. `agent_log` cost_usd sum hit the 1000-row
PostgREST cap (undercounted — scheduled-publisher alone fires ~2880×/30d). These figures
reflect only what bees self-reported into the DB. **Operator to provide vendor console
totals for Gemini / Anthropic / OpenAI.**

---

## Discrepancies flagged

- **demand_candidates does not exist** and is referenced nowhere in code or docs (A4).
  Any design assuming it is net-new.
- **products table lacks fan_out_queries, canonical_question, authority_grounding** (A5).
  `canonical_question` currently lives in overlay `topic_universe[]`, not a table.
- **`market_research_bees` is an array, not an object** (A8). Audit path
  `market_research_bees.e2a.enabled` does not resolve; must match by `bee_id`.
- **E2e-gemini / E2e-chatgpt are not standalone bees** (A6) — no own files, no own crons.
  They are overlay entries run inside the single `e2-market-research` cron.
- **e2e-chatgpt does NOT capture fan-out queries** (A6). OpenAI Responses `web_search`
  exposes citations but no `webSearchQueries` equivalent. Gemini DOES capture it.
- **agent_log has no queen/hive tagging column** (A11). Cost-per-queen attribution
  requires `bee_run_metrics`, a separate table.
- **agent_log has no `status` column** (A1) — success/failure is encoded in `action`.
- **e2c/e2e-chatgpt/e2e-gemini overlay flags are enabled=true** (A8) while Phase 1 only
  specified e2a/e2b disable — state reported, not changed.
- **tactical→production rename not started** (A10): cron + route + ~25 files + 1 table
  still carry the `tactical` name.
- **soverella main working tree is dirty** — 2 modified files + 1 untracked DAY13 handover
  doc uncommitted at `c7099d1`.

## Net-new vs reuse summary

Net-new (build fresh):
- `demand_candidates` table (schema undefined — Strategy Chat to spec).
- `products` columns `fan_out_queries`, `canonical_question`, `authority_grounding`
  (or a decision to keep them in the overlay / a new table).
- Bee 1 code itself + its cron route.
- agent_log `queen_id`/`hive` tagging IF cost rollup must read agent_log directly
  (otherwise reuse `bee_run_metrics`).

Reuse with modification:
- `e1-citation-gap-scanner.ts` 10-step pipeline + `e1-goat-gate.ts`.
- `e2-market-researcher.ts` + `lib/sources/ai-citations.ts` (Gemini fan-out capture
  already present; ChatGPT fan-out would need new work).
- `e6-trend-velocity-scanner.ts` + `trend_signals` time-series for Bee 2
  `ai_citation_velocity`.
- `strategic_queen_handoffs` table — exists, 12 cols, reusable.
- `bee_run_metrics` table — exists, already has `queen_id` + cost fields.
- `priority-decay.ts`, overlay loader, `[bee]` dynamic cron route + `_registry.ts`.

## Open questions for operator

- Where should `fan_out_queries` / `canonical_question` / `authority_grounding` live —
  new columns on `products`, the overlay, or a dedicated table? `canonical_question`
  already exists in overlay `topic_universe[]`.
- `demand_candidates` schema is entirely undefined — confirm Strategy Chat specs it in
  the Unit 1 spec card.
- e2e-chatgpt fan-out: OpenAI Responses API has no `webSearchQueries` equivalent. Does
  Bee design need ChatGPT fan-out, and if so by what mechanism?
- LLM vendor spend (A12): operator must pull Gemini / Anthropic / OpenAI console totals;
  Perplexity is unused.
- Is the tactical→production rename (cron + ~25 files + `tactical_queen_observations`)
  in scope for Unit 1, or a separate migration step?
- Is `e2e-gemini` / `e2e-chatgpt` / `e2c` staying enabled=true intended, or should they
  also be disabled pending Phase 1 sign-off?
- `strategic_queen_handoffs` secondary indexes not visible via OpenAPI introspection —
  confirm via direct `\d` if Bee 1 depends on a specific index.
