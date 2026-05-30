# Strategic Queen Replication Runbook

**Last updated:** 2026-05-30 (Bee 2 added)
**Lives at:** `cole-marketing/STRATEGIC-QUEEN-REPLICATION-RUNBOOK.md` (also linkable from `soverella/docs/help/`)
**Purpose:** the recipe for adding a brand-new per-hive Strategic Queen for a new niche. This is the pattern apiary's future "clone hive" function executes (or that a chat assistant follows manually until the clone-function exists).
**Authoritative input:** an approved `apiary_strategic_handoffs` row with `decision: 'CLONE_NEW_HIVE'` and a populated niche identity + persona payload.

> **Scope:** this runbook produces a **new per-hive Strategic Queen** for a new niche (e.g. minting a `expat-tax` hive's Strategic Queen alongside taxchecknow's). It does **NOT** replicate apiary — apiary is the cross-hive layer; only one apiary instance ever exists. For apiary-specific deviations, see APIARY-STRATEGIC-QUEEN-AS-BUILT.md.

---

## 1. What you're replicating, in one paragraph

A per-hive Strategic Queen is the hive's discovery engine — Bee 1 hunts demand signals across multiple sources, Bee 2 scores topics for viability, Bee 3 routes (BUILD_NEW / PANELBEAT / IGNORE), Bee 4 composes the handoff for the Production Queen to consume. The proven template is taxchecknow's Strategic Queen V2 (built and live in production). Replication = copy the template byte-for-byte and swap in the new hive's identity (site key, jurisdictions, niche-specific prompts, niche-specific community domains).

## 2. Replication inputs (what you need before starting)

From the approved handoff:
- `hive_key` — short identifier (e.g. `expat-tax`, `gst-au`)
- `display_name` — human-readable name (e.g. "ExpatTax")
- `jurisdictions[]` — which jurisdictions the hive serves (e.g. `["AU","UK","US"]`)
- `niche_label` — the canonical niche identity
- `claim_radius_keywords[]` — the keyword set defining what this niche claims (used by apiary suppression)
- `primary_authorities[]` — the authoritative sources for this niche (e.g. ATO/HMRC for tax; USCIS for immigration)
- **Per-routine config payload** (filled in by Bee 4 from prospecting evidence):
  - Gemini prompts (7-ish broad domain prompts in the niche language)
  - ChatGPT prompts (7-ish concrete questions in the niche language)
  - SERP community domains (community/forum URLs with per-domain query sets)
  - (YouTube uses the V1 topic_universe — no separate prompt config)
- **Budgets** — monthly $ caps per routine (default to taxchecknow's: $0 youtube, $5 gemini, $8 chatgpt, $5 serp, $5 operator; total $25/month)

## 3. The replication artifacts (in dependency order)

This is the exact order proven over the apiary build (8+ commits). Build upstream-first; consumer pieces follow.

### Stage A — Database surface (migrations applied first)

1. **`demand_candidates` table** (if not already cluster-wide — usually IS cluster-wide; this stage SKIPPED for an existing cluster). If brand new: mirror the existing per-hive table shape (id/site/jurisdiction/raw_topic_signal/source/source_payload/signal_fingerprint/detected_at + scoring/decision columns later for Bee 2/3).

**Bee 2 scoring columns** (cluster-wide on `demand_candidates`):
   - `scored_at` (timestamptz, nullable) — the resumable-batch sentinel
   - `score_components` (jsonb, nullable) — per-dimension breakdown
   - `overall_score` (numeric, nullable)
   - `confidence` (numeric, nullable)

   These columns are cluster-wide; verify they exist before Stage F. The apiary foundation migration (which created the parallel apiary scoring columns) thought ahead in the same shape.

2. **`strategic_queen_operator_hypotheses` table** (cluster-wide, ONE table — keyed by `hive`). If new cluster: mirror the per-hive shape (id/hive/hypothesis_text/status/created_at/processed_at/candidates_produced). For an existing cluster: this table is already there; the new hive just writes rows with its hive key.

3. **`bee_run_metrics` table** (cluster-wide). Probably already exists. Verify `queen_id` CHECK accepts the layer name (`'strategic'`).

4. **`dc_upsert_candidates` RPC** (or equivalent). Atomic batch INSERT with `ON CONFLICT (site, signal_fingerprint) DO UPDATE recurrence_count + last_seen`. Mirror the per-hive function.

5. **Source CHECK constraint expansion** (if cluster's existing `demand_candidates_source_chk` doesn't already allow the routine sources). The canonical pattern allows:
   ```
   source = ANY (ARRAY[
     'bing_ai_perf','gemini_grounding','chatgpt_search','perplexity',
     'youtube_data','stackexchange','quora','operator_hypothesis'
   ]) OR source ~~ 'serp_community_%'
   ```
   The `~~ 'serp_community_%'` prefix match is critical — serp_community writes `source='serp_community_<suffix>'` (e.g. `serp_community_reddit`), and a literal allow-list would reject it.

**Critical gotcha:** Supabase SQL editor's statement-splitter chokes on `BEGIN; ... COMMIT;` wrappers around `$$`-bodied functions. Apply `CREATE OR REPLACE` blocks WITHOUT the wrapper. CREATE OR REPLACE is idempotent, so safe to re-run.

### Stage B — Schema + overlay (configuration)

6. **V2 overlay loader** (`lib/overlay/loader-v2.ts` — usually already exists cluster-wide). Verify it accepts the new hive's overlay path: `overlays/<hive_key>/strategic-v2.json`.

7. **V2 overlay JSON** (`overlays/<hive_key>/strategic-v2.json`). New file per hive. Mirror taxchecknow's `overlays/taxchecknow/strategic-v2.json` shape exactly:
   - `hive: "<hive_key>"`
   - `jurisdictions: [<from handoff>]`
   - `bee_1_demand_hunter.monthly_budget_usd: 25` (or per handoff)
   - 6 routines configured (5 enabled + perplexity disabled):
     - `youtube_data` — enabled, weekly, $0, no prompt config (routine reads V1 topic_universe)
     - `gemini_grounding` — enabled, weekly, $5, ~7 niche-language broad prompts per jurisdiction
     - `chatgpt_search` — enabled, weekly, $8, ~7 niche-language concrete questions per jurisdiction
     - `perplexity` — disabled, weekly, $5 (specced, never built in either layer)
     - `serp_community` — enabled, weekly, $5, ~3 community domains with 5 queries each
     - `operator_hypothesis` — enabled, on_submit, $5, ~5 reddit + authority forum domains

**Content discipline:** every prompt and query string is niche-specific (e.g. for an expat-tax hive: "What are common expat tax mistakes...", not generic "What regulatory issues..."). The shape mirrors taxchecknow; the content is hive-specific.

### Stage C — Bee 1 code (the dispatcher + routines)

8. **Dispatcher** (`lib/queens/strategic-bee-1-demand-hunter.ts`). Already cluster-wide — this is per-hive's existing dispatcher. The new hive does NOT get its own dispatcher file; it consumes the existing one. The dispatcher is hive-agnostic (reads `overlay.hive`, writes `site=overlay.hive` to demand_candidates).

9. **5 intake routines** (`lib/queens/strategic-routine-{youtube,gemini,chatgpt,serp-community,operator-hypothesis}.ts`). Already cluster-wide — these are per-hive's existing routines, hive-agnostic (each reads from the overlay loaded for the firing hive). The new hive does NOT get new routine files. They self-register at module load via `registerRoutine()`.

10. **`insertCandidates`** (`lib/queens/_shared/candidate-writer.ts`). Already cluster-wide. Hive-agnostic.

**This is the elegance of the replication:** Stages C–E are pure CONFIG additions. Zero new code per hive. The dispatcher + routines + writer are all written once for the cluster; each hive plugs in its overlay and inherits the entire intake layer.

### Stage D — Cron route

11. **Bee 1 cron route** (`app/api/cron/strategic-queen-bee-1-demand-hunter/route.ts`). Already cluster-wide. The route takes `?site=<hive_key>` query param to load the right overlay. The new hive doesn't get a new route file — its hive_key is just a valid value for `?site=`.

12. **vercel.json schedule** (when adding scheduled fires). Add a new entry pointing at the cron URL with `?site=<hive_key>` — that's the per-hive Bee 1 schedule registration. Schedule Bee 2 separately (see Stage F).

### Stage E — Validation (first manual Bee 1 fires)

13. **First fire** — manual `[POWERSHELL — curl]` to validate the new hive's Bee 1 setup before scheduling. Force one routine at a time, exactly as we proved in apiary's session:

```powershell
$body = Invoke-RestMethod -Uri "https://www.<site>.com/api/cron/strategic-queen-bee-1-demand-hunter?site=<hive_key>&force_routine=gemini_grounding" -Method POST -Headers @{"Authorization"="Bearer $env:CRON_SECRET"}; $body | ConvertTo-Json -Depth 10
```

Staged validation order (proven pattern):
1. `gemini_grounding` first — cheapest, most informative (fan-out queries surface immediately)
2. `chatgpt_search` second — confirms OpenAI credits are funded, prompts work
3. `serp_community` third — free Brave API, ~200s due to 1.1s pacing × N queries
4. `youtube_data` fourth — confirms YOUTUBE_API_KEY env var is set, V1 topic_universe is populated for the hive
5. `operator_hypothesis` fifth — only if you've dropped a hypothesis into the queue with the new hive key

After each fire, read `demand_candidates` filtered to the new hive_key to confirm rows landed.

### Stage F — Bee 2 wire-up + validation (added 2026-05-30, after apiary Bee 2 build)

Bee 2 (Demand Scorer) is **cluster-wide infrastructure**, identical pattern to Bee 1 — the new hive does NOT get new Bee 2 code, just plugs in via `?site=<hive_key>`.

14. **Bee 2 dispatcher** (`lib/queens/strategic-bee-2-demand-scorer.ts`). Already cluster-wide. Hive-agnostic — reads `demand_candidates WHERE site=<hive> AND scored_at IS NULL`, scores in place, updates the same row. Resumable via `scored_at`.

15. **Bee 2 cron route** (`app/api/cron/strategic-queen-bee-2-demand-scorer/route.ts`). Already cluster-wide. Takes `?site=<hive_key>` query param. Optional `?batch=<N>` override for catch-up fires.

16. **Bee 2 scoring columns** verified in Stage A. Already cluster-wide.

17. **First Bee 2 fire (staged validation)** — mirror the Bee 1 staged validation discipline:

```powershell
# Stage 1: batch=1, validate end-to-end on one candidate
$body = Invoke-RestMethod -Uri "https://www.<site>.com/api/cron/strategic-queen-bee-2-demand-scorer?site=<hive_key>&batch=1" -Method POST -Headers @{"Authorization"="Bearer $env:CRON_SECRET"}; $body | ConvertTo-Json -Depth 10
```

Expected: `candidates_scored: 1`, `candidates_failed: 0`, `cost_usd ~$0.005`, `duration_ms ~5000-7000` for per-hive (Haiku-only, no Gemini grounding — see §7 gotcha for apiary's different per-candidate cost profile).

Then verify in DB:
```sql
SELECT
  raw_topic_signal,
  overall_score,
  confidence,
  score_components -> '_meta' -> 'llm_calls_succeeded' AS llm_succeeded,
  score_components -> 'personalisation_potential' AS pers,
  score_components -> 'urgency' AS urg,
  score_components -> 'competitor_weakness' AS comp,
  score_components -> 'authority_clarity' AS auth,
  score_components -> 'ai_citation_volume' AS vol
FROM demand_candidates
WHERE site = '<hive_key>' AND scored_at IS NOT NULL
ORDER BY scored_at DESC
LIMIT 5;
```

Expected: all 6 dimensions populated; `llm_succeeded: 3` (median-of-3 worked); reasonable scores for the niche.

```powershell
# Stage 2: batch=5, validate signal quality across multiple niches
$body = Invoke-RestMethod -Uri "https://www.<site>.com/api/cron/strategic-queen-bee-2-demand-scorer?site=<hive_key>&batch=5" -Method POST -Headers @{"Authorization"="Bearer $env:CRON_SECRET"}; $body | ConvertTo-Json -Depth 10
```

Expected: `candidates_scored: 5`, sensible score spread (not all clustered at one value).

**⚠️ CRITICAL signal-quality check after Stage 2:** if 5 niches all score the same on any one dimension (e.g. all `urgency: 5`, all `competitor_weakness: 8`), that's a prompt-calibration signal — see §7 gotcha "prompt-calibration as first-fire diagnostic." **The chain working ≠ signal discriminating.** Reset `scored_at = NULL` on affected rows, fix the prompt, re-fire before draining backlog.

```powershell
# Stage 3: drain backlog via batch=30 (per-hive's safe default)
# Per-hive Bee 2 is ~5.83s/candidate (Haiku-only). batch=30 lands ~175s, safe within 300s Vercel limit.
# REPEAT until candidates_scored: 0
$body = Invoke-RestMethod -Uri "https://www.<site>.com/api/cron/strategic-queen-bee-2-demand-scorer?site=<hive_key>&batch=30" -Method POST -Headers @{"Authorization"="Bearer $env:CRON_SECRET"}; $body | ConvertTo-Json -Depth 10
```

Confirm queue empty:
```sql
SELECT
  COUNT(*) FILTER (WHERE scored_at IS NULL) AS unscored,
  COUNT(*) FILTER (WHERE scored_at IS NOT NULL) AS scored
FROM demand_candidates
WHERE site = '<hive_key>';
```

18. **vercel.json schedule for Bee 2** (when adding scheduled fires). Per-hive's existing taxchecknow Bee 2 is registered at `35 5 * * *` UTC (20 min after Bee 1 at `15 5`). Add per-new-hive: `?site=<hive_key>` query param appended to the cron URL. Pick a clean minute that doesn't double-stack with other crons.

**Critical:** the `DEFAULT_BATCH_SIZE` constant in `strategic-bee-2-demand-scorer.ts` is 30 — that's per-hive's safe default (Haiku-only, ~5.83s/candidate). DO NOT modify this for per-hive replication. The constant is 8 in apiary's separate `apiary-bee-2-niche-scorer.ts` because apiary's per-candidate cost is materially higher (~25-30s/candidate) due to its apiary-specific `regulatory_stability` Gemini-grounded chain. Per-hive's batch=30 is safe; only apiary needs the lower default.

### Bee 2 dimensions (per-hive — 6 dimensions)

| Dimension | Method | Source |
|---|---|---|
| `ai_citation_volume` | deterministic | per-flavor magnitude (chatgpt recurrence, youtube log10(views)) |
| `ai_citation_velocity` | deterministic, currently inert | `trend_signals` lookup; defaults 5.0 with `computable: false` until populated |
| `personalisation_potential` | Haiku combined prompt × 3 + median | LLM reasoning over scorable text |
| `authority_clarity` | deterministic 4-class taxonomy | URL-domain regex via `_shared/domain-authority.ts` |
| `competitor_weakness` | Haiku same combined prompt | LLM reasoning + up to 5 incumbent domains |
| `urgency` | Haiku same combined prompt | LLM reasoning over scorable text |

**Weights (sum = 1.00):** ai_citation_volume:0.15, ai_citation_velocity:0.20, personalisation_potential:0.20, authority_clarity:0.10, competitor_weakness:0.20, urgency:0.15.

**Known leak to manage when replicating:** per-hive's `buildLlmPrompt` has a hardcoded system message `'You score tax-topic demand signals for a content-product company.'` — that's a tax-specific English string isolated to taxchecknow's per-hive scorer. **For a new non-tax hive, this leak would mis-prime LLM reasoning for any non-tax niche.** Options: (a) fix the per-hive scorer to read niche-language from the overlay (recommended; separate refactor work item; needs a `bee_2_demand_scorer.scoring_prompt_niche_language` field on the overlay), (b) accept the leak as a known issue (LLMs still produce reasonable scores from the actual `raw_topic_signal` content even when the system message mis-primes niche language), or (c) fork the scorer per hive (rejected as anti-cluster-config pattern). See §7 gotcha. Apiary's `apiary-bee-2-niche-scorer.ts` already has the niche-broadness translation (`'You score niche-level citation gap signals...'`) — apiary is the existence proof that this fix is mechanical.

## 4. Per-routine "swap fields" reference

When copying taxchecknow's overlay to write the new hive's overlay, here's what changes vs what stays:

### What ALWAYS changes (per-hive identity)
- `hive: "<new_key>"`
- `jurisdictions: [...]`
- All `prompts[].text` — translated to the new niche's language
- All `domains[].queries[]` — translated to the new niche's question patterns
- All `domains[].host` — swapped to the new niche's authority forums (e.g. tax → ATO/HMRC; immigration → USCIS-equivalent forums)
- Optionally: `budget_usd_per_month` per routine if the niche has different cost profile

### What CAN stay (per-hive structure)
- `bee_1_demand_hunter` key (cluster convention)
- 6 routines listed (5 enabled + perplexity disabled — standard)
- Cadences (`weekly` for the 4 LLM/SERP routines, `on_submit` for operator_hypothesis)
- Field shapes (every `prompt` object has `text` + `jurisdiction`; every `domain` has `host` + `source_suffix` + `jurisdiction` + `queries`)

### What MUST NOT change (cluster contracts)
- Routine names (must match the enum in `loader-v2.ts`)
- Source strings the routine writes (must match the source CHECK constraint)
- Field types (the zod schema rejects shape drift)

## 5. Test-fire validation checklist

### Bee 1 fires

After each forced Bee 1 fire, the response JSON should show:

| Field | Expected |
|---|---|
| `summary.routines_enabled` | 1 (force_routine isolation works) |
| `summary.routines_succeeded` | 1 if the routine worked end-to-end |
| `summary.candidates_written` | > 0 (some niches written) |
| `per_routine[0].cost_usd` | Within `budget_usd_per_month / 4` (per-fire budget cap) |
| `per_routine[0].duration_ms` | < 240,000 (well within 300s Vercel limit) |
| `per_routine[0].routine_metadata.per_prompt[].error` | Empty (no API errors per prompt) |
| `per_routine[0].routine_metadata.fan_out_count` or `citation_count` or `results_total` | Non-zero (source surface returned data) |

Then verify in DB:

```sql
SELECT count(*), source FROM demand_candidates
WHERE site = '<new_hive_key>'
GROUP BY source;
```

Each routine's source value should show non-zero count after its fire.

### Bee 2 fires

After each Bee 2 fire, the response JSON should show:

| Field | Expected |
|---|---|
| `summary.candidates_scored` | matches batch param (or remaining unscored, whichever is smaller) |
| `summary.candidates_failed` | 0 (per-candidate failure is rare; row-level UPDATE atomicity isolates failures) |
| `summary.cost_usd` | ~$0.005 × candidates_scored for per-hive (Haiku-only) |
| `summary.duration_ms` | ~5800ms × candidates_scored for per-hive |
| `per_candidate[*].overall_score` | 0-10 range, sensible variance across niches |
| `per_candidate[*].confidence` | 0-1 range, ~0.5-0.85 typical (0.5 base + boosts) |

Then verify in DB:

```sql
SELECT
  COUNT(*) FILTER (WHERE scored_at IS NULL) AS unscored,
  COUNT(*) FILTER (WHERE scored_at IS NOT NULL) AS scored,
  AVG(overall_score)::numeric(4,2) AS avg_score,
  MIN(overall_score)::numeric(4,2) AS min_score,
  MAX(overall_score)::numeric(4,2) AS max_score
FROM demand_candidates
WHERE site = '<new_hive_key>';
```

Expected: score spread (e.g. 3.5-7.5 range, not all clustered at one value); unscored count decreases each fire.

## 6. Common failure modes + recovery

| Symptom | Diagnosis | Recovery |
|---|---|---|
| `Unauthorized` (401) | `CRON_SECRET` env var missing or wrong | Verify Vercel env panel; re-fire |
| `Overlay load failed` (503) | `overlays/<hive_key>/strategic-v2.json` missing or schema-invalid | Check file exists at exact path; run typecheck to surface zod errors |
| `Unknown routine` (400) | `force_routine` value doesn't match enum or the routine isn't imported in cron route | Verify routine name matches loader-v2 enum; verify cron route imports it |
| Cron fire returns `ok:true` but `candidates_written:0` and no errors in `per_prompt` | Source surface returned nothing (e.g. ChatGPT prompts too broad/specific to surface citations) | Refine prompts; if persistent, the niche may not have AI-surface demand |
| Bee 2 fire returns `FUNCTION_INVOCATION_TIMEOUT` | Batch size too large for per-candidate cost × Vercel's 300s ceiling | Per-hive safe default: batch=30 (~175s). Cap at batch=50 max for catch-up fires; batch=70 timed out at 300s on per-hive (50 of 70 committed atomically — resumable, but messy). Apiary's separate scorer uses batch=8 because Gemini grounding pushes per-candidate cost to ~25-30s |
| Bee 2 score_components show every niche scoring 5.0 on multiple dimensions | LLM calls failing silently — `_meta.llm_calls_succeeded: 0` | Check Anthropic credit balance; check that callClaude wrapper is logging actual errors (not swallowing in try/catch). See gotcha "balance bleed silent failures" |
| Bee 2 score_components show every niche scoring at one value (e.g. 2/10) on the same dimension despite chain working | **Prompt calibration issue** — chain is mechanically clean but the prompt design primes the wrong frame | See §7 gotcha "prompt-calibration as first-fire diagnostic" — re-write the prompt to ask the right question, reset `scored_at = NULL` on affected rows, re-fire |
| `OpenAI HTTP 429: insufficient_quota` per-prompt | OpenAI account out of balance | Top up at platform.openai.com; verify auto-recharge is enabled |
| Every Haiku-calling bee returns silent fallbacks | Anthropic account out of balance | Top up at console.anthropic.com; verify auto-recharge is enabled |
| `POST bee_run_metrics → 400` (visible in Vercel logs only) | `bee_run_metrics_queen_id_check` doesn't allow this queen layer | Add the queen layer name to the CHECK via migration |
| Deploy doesn't pick up the push (route 404s after push) | Vercel auto-deploy webhook gap | `git commit --allow-empty -m "trigger deploy"; git push` |
| `npx tsc \| grep "<routine-name>"` returns nothing | Could mean "no errors" OR "file doesn't exist" — ambiguous | Combined check: `ls -la <path> && npx tsc 2>&1 \| grep <name> \|\| echo "EXISTS + NO ERRORS"` |

## 7. Gotchas captured this session (build-discipline learned)

- **Empty-commit deploy kick.** Vercel auto-deploy sometimes doesn't fire from a push. Confirmed multiple times across Bee 1 + Bee 2 sessions. Recovery: `git commit --allow-empty -m "chore: trigger deploy"; git push origin main`. Bank as standard.
- **BEGIN/COMMIT wrapper on Supabase SQL editor** chokes `CREATE OR REPLACE` blocks for `$$`-bodied functions. Apply unwrapped — `CREATE OR REPLACE` is idempotent.
- **Source CHECK with LIKE prefix** for serp_community — `OR source ~~ 'serp_community_%'::text`. Literal allow-list would reject suffix variants.
- **File-existence ambiguity** in `tsc | grep` — empty output means either "no errors" or "file absent." Always combined check.
- **Two LLM provider balance bleeds in one session** — Anthropic (deriver Haiku) and OpenAI (ChatGPT routine). Auto-recharge on both is mandatory before any scheduled fire.
- **`bee_run_metrics.queen_id` CHECK** silently rejects values not in its allow-list — the run continues (try/catch + logBeeError), but metrics rows don't land. Verify CHECK includes the queen layer name.
- **Brave 1-req/sec pacing** must be preserved — `serp_community` routine has 1100ms sleep between every call (success or error). Don't "optimize" it away.
- **`callClaudeTracked` swallows non-retriable 4xx errors silently** if the caller's try/catch fallback returns gracefully. Diagnostic logging in the caller's catch block is essential for surfacing the actual API error.
- **Per-hive Bee 2 batch-size discipline** — per-hive's per-candidate cost is ~5.83s (Haiku-only). batch=30 lands ~175s, well within 300s Vercel limit. **For per-hive Bee 2 backlog catch-up fires, cap `?batch=` at 50.** A batch=70 fire timed out at 300s on per-hive (50 of 70 committed atomically — resumable, but messy). DO NOT change `DEFAULT_BATCH_SIZE=30` for per-hive replication — only apiary's separate `apiary-bee-2-niche-scorer.ts` uses batch=8 because its regulatory_stability Gemini chain pushes per-candidate cost to ~25-30s.
- **Prompt-calibration as first-fire diagnostic** (added 2026-05-30 during apiary Bee 2 build, applies universally to any LLM-scored dimension). A load-bearing LLM dimension can land mechanically clean (chain works, JSON parses, no candidates fail) AND produce miscalibrated signal because the prompt design primes the wrong frame. Apiary Bee 2's `regulatory_stability` first-fire produced uniform 2/10 across 10 niches incl. mature ones (personal-finance, medical-billing) because the grounding query asked "are laws being rewritten?" — a leading question that primed change-detection. Reframed to ask "will the foundation be there in 2 years?" produced clean 0-9 spread on re-fire. **Bank for any new hive's Bee 2 first-fire:** validation isn't just "did the chain work" — it's "does the signal discriminate against ground truth on known niches?" If 5 sample niches all score the same on a dimension where they shouldn't, the prompt is biased; reset `scored_at = NULL` on those rows + rewrite the prompt + re-fire before draining the backlog. **This caveat applies to BOTH apiary's apiary-specific dimensions AND per-hive's Haiku-scored dimensions** — same diagnostic discipline.
- **The per-hive Bee 2 "tax-topic" prompt leak.** Per-hive's `strategic-bee-2-demand-scorer.ts` has a hardcoded `'You score tax-topic demand signals for a content-product company.'` in the system message of `buildLlmPrompt`. **For a new non-tax hive**, this leak would mis-prime LLM reasoning for that niche. The right long-term fix is to read niche-language from the overlay (per-hive's overlay has no current field for this — needs `bee_2_demand_scorer.scoring_prompt_niche_language` or similar). Short-term workarounds: (a) accept the leak (LLMs still produce reasonable scores even with mis-primed niche language — they read the actual `raw_topic_signal` content), (b) fork the scorer per hive (rejected as anti-cluster-config-pattern), or (c) refactor per-hive scorer to read from overlay (recommended, separate work item). Apiary's `apiary-bee-2-niche-scorer.ts` already has the niche-broadness translation: `'You score niche-level citation gap signals...'`.
- **Resumability is real.** Per-candidate UPDATEs commit atomically before the dispatcher moves to the next candidate. A timeout mid-batch leaves the rows-that-finished cleanly scored and the rows-that-didn't ready for the next fire. Confirmed in production during apiary Bee 2's batch=13 timeout (9 of 13 committed; 4 picked up next fire, all scored cleanly). Don't fear the timeout for catch-up fires — just don't schedule one batch above the safe ceiling.

## 8. The replication is mostly CONFIG, not CODE

The proof: in this session, building apiary (which is harder than per-hive — apiary has 3 net-new code layers + apiary's own Bee 2 dispatcher with regulatory_stability) we wrote ~9 new TypeScript files. A new per-hive Strategic Queen — which is what this runbook covers — requires **0 new code files for Bee 1 OR Bee 2**. Just:

1. New migration files (DB constraints + tables — usually one or zero per new hive)
2. New overlay JSON file
3. New `vercel.json` schedule entries (one for Bee 1, one for Bee 2)
4. Per-hive content (prompts, queries, domains) written into the overlay

That's it. The dispatchers, routines, writer, scorer, cron routes are all cluster-wide and already exist. Each new hive PLUGS INTO the cluster's infrastructure.

## 9. Validation discipline

- **Vercel cron-fire + curl + Supabase read-back is the only validation method.** NEVER run local `tsx` smoke tests against live keys.
- **Stage fires by routine** — one `force_routine=<name>` at a time for Bee 1; one `?batch=1` then `?batch=5` for Bee 2 before draining.
- **Don't schedule in vercel.json until the manual fires all succeed.** Manual fire → verify rows → schedule.
- **Document the result of each first fire** — total candidates per routine, dedup rate vs cluster, costs, surface diagnostics. This is the first-fire log that proves the hive is operational.
- **For Bee 2: validate signal discrimination before draining backlog.** A `?batch=5` fire on diverse niches should produce a spread of scores, not uniform values. See gotcha "prompt-calibration as first-fire diagnostic."

## 10. Post-replication: handing off to Bee 3/4

Bee 1's `demand_candidates` rows for the new hive are now flowing AND Bee 2 has scored them with `overall_score` + `score_components`. The new hive's Bee 3 / Bee 4 will pick those up automatically — same dispatcher / router / composer infrastructure across the cluster. The new hive doesn't need its own Bee 3/4 code; the dispatcher reads the hive from the candidate row, runs the cluster's shared bee code, writes routed/composed results back.

**Bee 3 input contract from Bee 2:** Bee 3 (Router) reads scored rows and decides BUILD_NEW / PANELBEAT / IGNORE. Available inputs on each scored row:
- `overall_score` (numeric 0-10) — weighted blend of 6 dimensions
- `score_components.*` — each dimension's value
- `score_components._meta.llm_calls_succeeded` — proxy for scoring confidence
- `confidence` (numeric 0-1)
- `recurrence_count` — multi-fire convergence signal
- All Bee 1 identity columns (site/jurisdiction/raw_topic_signal/source/source_payload)

Bee 3 should use `overall_score >= threshold` as the primary gate (per-hive default likely 7.0+; tune per hive). EXPAND-vs-IGNORE for borderline scores is Bee 3's call.

Important: when adding Bee 2/3/4 routine equivalents (if any are needed per-hive), apply the same "config not code" discipline. Avoid hardcoded niche-specific prompts in the bee code itself. The taxchecknow Bee 2 scorer has a hardcoded "tax-topic" prompt — that's a known leak, isolated to taxchecknow, NOT to be copied into new hives (see §7 gotcha).

## 11. Source of truth pointers

- Per-hive Strategic Queen V2 design: `cole-marketing/STRATEGIC-QUEEN-V2-DESIGN.md` (or equivalent)
- Per-hive proven template: `overlays/taxchecknow/strategic-v2.json` (the reference overlay; copy + adapt)
- Per-hive Bee 2 spec: `soverella/docs/help/strategic-queen-v2/bees/bee-2-demand-scorer.md`
- Apiary-specific deviations (cross-hive layer only — NOT for per-hive replication): `soverella/docs/help/apiary-strategic-queen/queen/APIARY-STRATEGIC-QUEEN-AS-BUILT.md`
- Apiary Bee 2 spec (apiary-only, not per-hive): `soverella/docs/help/apiary-strategic-queen/bees/bee-2-niche-scorer.md`
- Pre-go-live cluster gates: `cole-marketing/FORK-2B-REGISTRY-LOG.md`, `cole-marketing/API-COST-MONITORING-GAP.md`
- This runbook: `cole-marketing/STRATEGIC-QUEEN-REPLICATION-RUNBOOK.md`
