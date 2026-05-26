# PLAN A-Z — Strategic Queen 4 Bees, Garden to Table

> **⚠️ SUPERSEDED DUPLICATE — use PLAN-A-Z-STRATEGIC-QUEEN-4-BEES.md (the base file) instead. This doubled-space copy is stale.**

**Created:** Day 13 EOD (16 May 2026), final deliverable before this conversation closes
**For:** Next Strategy Chat + Session A + operator Matt V
**Status:** Execution plan. Architecture is locked. Execute this without re-debating.

---

## §1 — Context (3 paragraphs)

This plan takes Strategic Queen V2 from nothing built to four bees firing live in production with a true end-to-end test. The end state: Demand Hunter scans 6 sources daily, candidates flow through Demand Scorer → Site Auditor → Handoff Composer, the operator sees pending handoffs in the dashboard, approves one, and the system has a real handoff waiting for Production Queen to pick up.

The plan is sequenced so Phase 3 work (re-cutting E2/E3/E4/E7 to Production Queen) wires onto these foundations without rework. Schemas are forward-compatible. Bees are scoped so their interfaces don't change when Production Queen's deep research bees plug in later.

**Bing AI Performance CSV upload is DEFERRED, not in scope.** At multi-site scale, manual weekly CSV upload becomes operator-prohibitive. Instead, the plan introduces **SERP Community Discovery** as the first-class community-signal routine — using Brave SERP queries against `site:reddit.com`, `site:community.ato.gov.au`, etc. This captures the Reddit + authority forum signal AI engines actually ground on, without depending on any single vendor's API or operator manual work. The "new door we built when everyone else cried over Reddit API." Bing CSV remains available as a future power-user override if first-party impression data ever proves materially needed.

---

## §2 — Prerequisites (operator-side, before Step A)

Confirm or acquire BEFORE the build starts. Session A cannot wire routines that fail on missing keys.

| # | Prerequisite | Action |
|---|---|---|
| P1 | OpenAI API key (for embeddings + ChatGPT search) | Confirm existing key or create. Cost ~$0.50/month for embeddings + ~$8/month for ChatGPT search calls |
| P2 | Gemini API key with grounding | Confirm existing (Google Cloud project). Cost ~$5/month |
| P3 | YouTube Data API key | Same Google Cloud project as Gemini. Free tier 10k units/day |
| P4 | Perplexity API key | Net-new. Cost ~$5/month |
| P5 | Anthropic API key | Confirm existing (already used by all current queens) |
| P6 | Brave SERP API key | Confirm existing in Vercel env (used by current E2c routine). No new key needed. |
| P7 | All keys added to Vercel env as Production + Preview + Development | Session A can guide on exact env var names during Step B |
| P8 | Day 13 architecture documents committed to `soverella/docs/day13/` | If not done, do this first. New Claude needs them in the repo |

**If any of P1-P8 is unresolved when you start Step A, stop and resolve first.** Wired-but-missing-key failures are the most common cause of "looks built but doesn't work" outcomes.

---

## §3 — The plan A through Z

Each step lists: **Who** does it · **Entry** criteria · **Work** · **Done** criteria · **Uncertainty** (if any).

---

### Step A — Probe current state

**Who:** Session A
**Entry:** Day 13 docs committed to repo. Prerequisites P1-P8 confirmed.
**Work:** Read-only probe of live Supabase. Report 6 things:
1. Does `demand_candidates` exist? Full column list if yes, "not present" if no
2. Full column list of current `strategic_queen_handoffs` (12 cols expected per audit)
3. Full column list of `bee_run_metrics`, including CHECK constraints on `queen_id`
4. 3 most recent rows of `bee_run_metrics` showing how E3/E4/E6/priority-decay populate the existing jsonb column
5. Does `agent_log` have tagging columns (hive, queen, bee)? If not, what tagging columns exist?
6. Full column list of `products` table (audit said 19 cols)

**Done:** Single chat report with all 6 answers. No file, no commit. Strategy Chat reviews before writing Step B.
**Uncertainty:** Low. This is read-only and Session A has done similar probes already.

---

### Step B — Schema migration design

**Who:** Strategy Chat
**Entry:** Step A probe results in hand.
**Work:** Write the migration SQL against actual probed state. Covers:
- `demand_candidates` (net-new) — full DDL
- `strategic_queen_handoffs` (additive +13 cols to current 12)
- `demand_candidates` includes scoring columns (so Bee 2 writes back to same row, no second table)
- `strategic_queen_product_embeddings` (net-new) — for Bee 3's semantic match cache (Strategic Queen owns its own embeddings, doesn't touch products)
- `strategic_queen_reject_log` (net-new) — for IGNORE-disposition candidates with reasons
- All tables have RLS policies matching existing soverella pattern
- Indexes for query performance on common predicates
- **Schema-verify-first protocol** explicit in the migration file

**Done:** Single migration SQL file ready for Session A to execute.
**Uncertainty:** Medium. Column types and constraints on existing tables determine some choices. Probe results resolve.

---

### Step C — Apply schema migration

**Who:** Session A
**Entry:** Migration SQL from Step B reviewed by operator.
**Work:** Apply migration to Supabase. Verify each new table exists with expected columns. Verify RLS policies in place. Verify indexes created. Commit migration file to repo.
**Done:** All net-new tables exist in production. `strategic_queen_handoffs` has all expected columns. V1 LIGHT continues to operate (existing Strategic Queen synthesis still fires daily). Commit hash reported.
**Uncertainty:** Low. Schema migrations are routine.
**Rollback:** Migration is reversible (drop new tables, drop new columns).

---

### Step D — Cost attribution wrapper (shared module)

**Who:** Strategy Chat (spec) + Session A (build)
**Entry:** Step C complete.
**Work:**
- Strategy Chat writes spec for `lib/cost-attribution/` module
- Module wraps every LLM API call with mandatory tagging: `{ hive, queen, bee, routine, purpose }`
- Tags flow through to existing `bee_run_metrics` jsonb column (using actual column name from Step A probe)
- Cost is computed from response metadata when available, otherwise estimated from token counts
- This module is shared infrastructure — ALL future queens use it

**Done:** Module exists at `lib/cost-attribution/`. Test that a tagged call writes correctly to bee_run_metrics. Smoke test passes. Commit hash reported.
**Uncertainty:** Low-medium. Pattern is well-understood; integration with existing bee_run_metrics is the main complexity.

---

### Step E — Hive config additions for Strategic Queen V2

**Who:** Session A (under spec from Strategy Chat)
**Entry:** Step D complete.
**Work:** Add `strategic_queen` section to `soverella/overlays/taxchecknow/strategic-v2.json` (new file, V2 lives alongside V1 LIGHT). Contains:
- Source registry: 5 routines (Bing AI Perf, Gemini, ChatGPT, Perplexity, YouTube), all `enabled: false` initially
- Per-routine cadences, prompt sets, budget caps
- Scoring weights for the 6 dimensions
- Threshold defaults (auto-ignore < 6.0, auto-approve disabled by default)
- Embedding model selection (`text-embedding-3-small`)

**Done:** Config file exists, parses correctly, validation test passes. Operator reviews defaults and approves.
**Uncertainty:** Low. File format is established; content comes from Strategic Queen design doc §4.

---

### Step F — Bee 1 dispatcher skeleton

**Who:** Session A
**Entry:** Step E complete.
**Work:** Create Bee 1 dispatcher shell at `lib/queens/strategic-bee-1-demand-hunter.ts` (flat kebab-case per audit findings). Contains:
- Routine interface (every routine implements same shape: `run(config) → candidates[]`)
- Source registry reader (reads from strategic-v2.json)
- Dispatcher: for each enabled routine, fire it, isolate errors, aggregate output
- Candidate writer: writes normalised rows to `demand_candidates`
- No routine implementations yet — just the shell
- Imports use existing `getSupabaseAdmin()` pattern from `lib/supabase`
- Cost attribution wrapper imported

**Done:** Dispatcher boots, fires a no-op cycle (zero routines enabled), writes nothing, exits cleanly. Smoke test passes. Commit hash reported.
**Uncertainty:** Low. Pattern is well-understood.

---

### Step G — Bee 1 cron registration

**Who:** Session A
**Entry:** Step F complete.
**Work:**
- Add Vercel cron entry: route `/api/cron/strategic-queen-bee-1-demand-hunter`, fires daily at 05:00 UTC (between E1 at 04:00 and other crons)
- Route handler authenticates via CRON_SECRET
- Calls the dispatcher
- Logs run to bee_run_metrics

**Done:** Cron registered. Manual fire via curl succeeds. Auth fails without CRON_SECRET (security check). Real cron entry in vercel.json. Commit hash reported.
**Uncertainty:** Low. Cron pattern is established across 22 existing crons.

---

### Step H — Routine 1: YouTube (easiest, free, proves the pattern)

**Who:** Session A
**Entry:** Step G complete. YouTube Data API key in Vercel env (P3).
**Work:** Implement YouTube routine at `lib/queens/strategic-routine-youtube.ts`:
- For each candidate topic configured in strategic-v2.json, search YouTube
- Capture: top video titles, view counts, upload dates, top 20 comments per video
- Score crude: comment volume + recency + view velocity
- Write normalised candidate rows to `demand_candidates` via dispatcher's candidate writer
- Cost attribution tags every call (`routine: 'youtube'`, `purpose: 'demand-hunting'`)

**Done:** Routine fires standalone via manual trigger. Writes ≥3 candidate rows to `demand_candidates` for the test topic. Cost row in bee_run_metrics. Quota usage tracked. Commit hash reported.
**Uncertainty:** Low-medium. Comment fetch quota usage needs care (each comment thread costs 1 unit; 5 videos × 20 comments = 100 units per topic).

---

### Step I — Routine 2: Gemini grounding (extract from E2 overlay)

**Who:** Session A (with Strategy Chat guidance)
**Entry:** Step H complete.
**Work:** Implement Gemini grounding routine at `lib/queens/strategic-routine-gemini.ts`:
- Extract Gemini-grounding logic from existing E2 overlay entry (currently lives inside E2's orchestrator)
- Reshape for Strategic Queen ownership — calls Gemini API with `tools: [{ googleSearch: {} }]`
- Captures `groundingMetadata.webSearchQueries` (the fan-out gold) AND `groundingMetadata.groundingChunks` (cited URLs)
- Uses broad-domain prompt set from strategic-v2.json
- Writes candidate rows
- **Critical:** E2's overlay entry stays in place. We're promoting the routine, not deleting from E2. V1 LIGHT continues to operate.

**Done:** Routine fires standalone. Writes candidate rows with `source: 'gemini-grounding'`, `source_payload` containing fan-out queries + cited URLs. E2 daily fire still happens unchanged. Commit hash reported.
**Uncertainty:** Medium. Extracting from E2's overlay without breaking E2 needs care. Strategy Chat should review the extraction pattern before Session A executes.

---

### Step J — Routine 3: ChatGPT web_search (extract from E2 overlay)

**Who:** Session A
**Entry:** Step I complete.
**Work:** Same pattern as Step I but for ChatGPT. Extract from E2 overlay, promote to standalone routine, capture URL citations.
- File: `lib/queens/strategic-routine-chatgpt.ts`
- Source: `chatgpt-search`
- Captures URL citations only (ChatGPT doesn't expose fan-out queries — confirmed in audit)
- Cost attribution per call

**Done:** Routine fires standalone, writes candidate rows. Day 10 fix #52 (citation parser) preserved. E2 still operates. Commit hash reported.
**Uncertainty:** Low. Pattern is now established from Steps H and I.

---

### Step K — Routine 4: Perplexity (net-new)

**Who:** Session A
**Entry:** Step J complete. Perplexity API key in Vercel env (P4).
**Work:** Implement Perplexity routine at `lib/queens/strategic-routine-perplexity.ts`. Calls Perplexity API, captures cited sources, writes candidate rows.
**Done:** Routine fires standalone, candidates land in demand_candidates. Commit hash reported.
**Uncertainty:** Low. Smallest of the new routines — Perplexity returns citations inline.

---

### Step L — Routine 5: SERP Community Discovery (replaces Bing CSV approach)

**Who:** Session A (under spec from Strategy Chat)
**Entry:** Step K complete. Brave SERP API key already in Vercel env (used by existing E2c routine, no new key needed).
**Work:** Implement SERP community discovery routine at `lib/queens/strategic-routine-serp-community.ts`:
- Per-hive config in strategic-v2.json declares which community/forum domains to query (Tax Hive: reddit.com, community.ato.gov.au, community.hmrc.gov.uk, irs.gov forums, money.stackexchange.com; future hives configure their own)
- For each candidate topic, run Brave SERP queries like:
  - `site:reddit.com/r/ "<canonical question phrase>"`
  - `site:community.ato.gov.au <topic keywords>`
  - `site:community.hmrc.gov.uk <topic keywords>`
- Capture: URL, title, snippet, ranking position
- Write candidate rows to `demand_candidates` with `source: 'serp-community-<domain>'` (e.g., `serp-community-reddit`, `serp-community-ato`)
- Cost attribution tags every call
- Cadence: weekly per domain
- Cost ~$3-5/month per hive (Brave SERP calls)

**Done:** Routine fires standalone for at least 3 topics across all configured domains. Captures real Reddit threads + ATO Community threads via SERP without touching their APIs. Demand_candidates shows community-source rows. Commit hash reported.
**Uncertainty:** Low-medium. Query template phrasing affects result quality — Strategy Chat reviews first-fire output and tunes query patterns before declaring the routine done.

**Why this routine matters:** This is the "new door we built when everyone else cried over Reddit API." We don't fetch Reddit's API, we don't scrape Reddit's domain — we read the Reddit threads Google/Brave have already indexed. Same signal AI engines see when grounding their answers. Zero legal/ToS risk. Same pattern works for ATO Community Forum, HMRC Community Forum, and any future authority Q&A site via config templates.

---

### Step L+1 — Routine 6: Operator Hypothesis Queue

**Who:** Session A (under spec from Strategy Chat)
**Entry:** Step L complete.
**Work:** Implement operator hypothesis queue at `lib/queens/strategic-routine-operator-hypothesis.ts`:
- New table: `strategic_queen_operator_hypotheses` (id, hive, hypothesis_text, status [pending|active|exhausted], created_at, processed_at)
- Operator UI on Strategic Queen monitor: small "Add hypothesis" input field with examples ("explore SMSF + crypto," "check FBT 2026 changes," "look at NSW property tax foreign owner rules")
- Routine reads pending hypotheses, runs the full prospecting suite against them (Gemini, ChatGPT, Perplexity, YouTube, SERP Community)
- After processing, marks hypothesis as exhausted; candidates written to demand_candidates with `source: 'operator-hypothesis'` + reference to originating hypothesis_id
- Cadence: every 6 hours (operator hypotheses get priority)
- Cost ~$1-2/month (depends on hypothesis volume)

**Done:** Operator can submit a hypothesis via dashboard. Routine picks it up within 6 hours. Demand_candidates shows operator-driven rows. Commit hash reported.
**Uncertainty:** Low. Pattern is well-defined; the value comes from operator judgment becoming a real input.

**Why this routine matters:** Your operator instinct catches patterns AI engines haven't surfaced yet. This is how the cross-hive learnings table (per Apiary Strategic Queen design) gets seeded with real intuition, not just algorithmic detection.

---

### Step L+2 — Bing AI Performance CSV Upload (DEFERRED, optional power-user feature)

**Who:** Operator decision when needed
**Entry:** Steps L and L+1 complete. After 4+ weeks of Bee 1 operation, operator assesses whether Bing impression-without-click data is materially missed.
**Work:** If operator decides Bing data is needed (likely never required given SERP Community already covers Reddit + community signal):
- Strategy Chat designs CSV upload UI
- Session A builds parser + storage at `bing_ai_performance_snapshots`
- Routine reads from uploaded data
- Bing becomes one additional supporting signal, not architectural center

**Done:** Operator-driven. May never ship.
**Uncertainty:** N/A — explicit deferral.

**Why this is deferred (not built):** Bing AI Performance gave us first-party "AI cited us" signal at single-site scale. At multi-site scale (5-20 hives), manual weekly CSV upload becomes operator-prohibitive. The SERP Community routine captures community-source signal AI engines actually ground on; cross-engine probing (future Phase 3+ work) captures first-party citation signal at scale with zero operator burden. Bing CSV is a defensive override we may never need.

---

### Step M — Enable all 6 routines + Bee 1 first real fire

**Who:** Operator + Session A
**Entry:** Steps H, I, J, K, L, L+1 all complete and verified.
**Work:**
- Operator flips `enabled: true` for all 6 routines in strategic-v2.json (YouTube, Gemini, ChatGPT, Perplexity, SERP Community, Operator Hypothesis)
- Manual fire Bee 1 via curl
- All 6 routines execute in sequence
- Candidates flow into demand_candidates
- bee_run_metrics row written with per-routine breakdown in jsonb
- Cost attribution shows real per-routine spend

**Done:** First real Bee 1 fire produces ≥20 candidate rows across all 6 sources. No silent failures. Per-routine cost adds up to ~expected envelope (~$25-30/month per hive total). Commit hash for any config tweaks reported.
**Uncertainty:** Medium. First real run often reveals interface mismatches. Plan a 2-hour debugging window.

---

### Step N — Candidate deduplication logic (Unit 8 from original plan)

**Who:** Session A
**Entry:** Step M complete.
**Work:** Add fingerprint-based dedup to the candidate writer in Bee 1 dispatcher:
- Compute fingerprint per candidate (topic-normalised hash)
- On insert: if fingerprint exists in last 7 days, UPDATE `recurrence_count++` and `last_seen` instead of INSERT
- Same signal hitting Gemini + ChatGPT + Perplexity becomes ONE row with recurrence_count=3, not three rows
- Backfill: dedup existing candidates from Step M's first fire

**Done:** Re-run Bee 1, verify recurrence_count increments correctly. Verify no exact duplicates exist in demand_candidates. Commit hash reported.
**Uncertainty:** Medium. Fingerprint normalisation (lowercase? strip stopwords? embedding similarity?) needs a design call.

---

### Step O — Bee 2 Demand Scorer (the brain)

**Who:** Strategy Chat (spec) + Session A (build)
**Entry:** Step N complete. Demand_candidates has 50+ deduped rows from at least 3 days of Bee 1 fires.
**Work:**
- Strategy Chat writes Bee 2 spec: for each unscored candidate, compute 6 dimensions:
  - `ai_citation_volume` — counted from candidate evidence
  - `ai_citation_velocity` — read from trend_signals (E6 activates 2026-05-27)
  - `personalisation_potential` — LLM judgment (3-call median to reduce noise)
  - `authority_clarity` — LLM check for canonical authority source
  - `competitor_weakness` — LLM scores top cited URLs
  - `urgency` — LLM heuristic
- Compute overall_score (weighted blend per strategic-v2.json weights) + confidence (0-1)
- Session A builds at `lib/queens/strategic-bee-2-demand-scorer.ts`
- Writes back to demand_candidates: score_components jsonb, overall_score, confidence, scored_at

**Done:** Bee 2 fires manually, scores ≥10 candidates from the existing pool. Score breakdowns are inspectable. Cost per scored candidate ~$0.30 (3 LLM calls × multiple dimensions). Commit hash reported.
**Uncertainty:** Medium-high. LLM scoring is noisy. First fire's outputs need operator review for sanity before continuing.

---

### Step P — Bee 2 cron registration

**Who:** Session A
**Entry:** Step O complete and operator has reviewed first-fire scoring outputs.
**Work:** Register cron at 05:30 UTC (after Bee 1's 05:00, before V1 LIGHT synthesis at 06:00). Reads unscored candidates, scores them, writes back.
**Done:** Cron fires. Manual fire works. Auth verified. Commit hash reported.
**Uncertainty:** Low.

---

### Step Q — Bee 3 product embeddings prep (semantic match prerequisite)

**Who:** Session A
**Entry:** Step P complete.
**Work:**
- For every existing product on taxchecknow, compute embedding of its canonical question using `text-embedding-3-small`
- Store in `strategic_queen_product_embeddings` (new table from Step B): product_id, canonical_question_text, embedding vector, computed_at
- This is a one-time backfill; ongoing updates happen when Production Queen builds new products

**Done:** Every existing product has an embedding row. Cost ~$0.01 total (embeddings are cheap). Commit hash reported.
**Uncertainty:** Low. Where does the product's "canonical question" come from for existing products? Strategy Chat may need to specify — likely from product metadata or the overlay's topic_universe entries. Resolve during Step Q spec.

---

### Step R — Bee 3 Site Auditor

**Who:** Strategy Chat (spec) + Session A (build)
**Entry:** Step Q complete.
**Work:**
- Strategy Chat writes Bee 3 spec: for each scored candidate, decide BUILD_NEW / PANELBEAT / IGNORE
- Step 1: threshold gate (score < 6.0 → IGNORE, write to reject log)
- Step 2: compute embedding of candidate's canonical_question, cosine similarity vs every product embedding from Step Q
- Step 3: if cosine > 0.85 → MATCH; if 0.70-0.85 → SOFT MATCH (operator review flag); if < 0.70 → BUILD_NEW
- Step 4: if MATCH, check 3 panelbeat triggers (new_authority_cited, stale_with_rising_velocity, operator_flagged). **fan_out_drift trigger deferred** — needs products schema columns that Production Queen will add later
- Session A builds at `lib/queens/strategic-bee-3-site-auditor.ts`
- Writes decision + panelbeat_reason (if applicable) back to demand_candidates

**Done:** Bee 3 fires manually on scored candidates from Step O. Produces decisions visible in DB. Reject log has IGNORE entries with reasons. Commit hash reported.
**Uncertainty:** Medium. Semantic similarity thresholds (0.85/0.70) are picked from instinct. First-fire results will show whether they're calibrated correctly.

---

### Step S — Bee 3 cron registration

**Who:** Session A
**Entry:** Step R complete and operator approves first-fire decisions.
**Work:** Register cron at 05:45 UTC. Reads scored-but-undecided candidates, decides, writes back.
**Done:** Cron fires. Commit hash reported.

---

### Step T — Bee 4 Handoff Composer

**Who:** Strategy Chat (spec) + Session A (build)
**Entry:** Step S complete.
**Work:**
- Strategy Chat writes Bee 4 spec: for each candidate with BUILD_NEW or PANELBEAT decision, assemble handoff row
- Generate canonical_question via LLM (temp 0, user-voice rewrite)
- Generate short_question via LLM (≤8 words)
- Generate topic_slug deterministically (jurisdiction-prefix + domain-prefix + slug, collision-checked against existing slugs)
- Bundle all fields per design doc §2 schema
- Write to strategic_queen_handoffs with approval_status='PENDING'
- Emit event `strategic_queen.handoff_pending` (just an audit_log entry for now)

**Done:** Bee 4 fires manually, produces ≥3 PENDING handoffs visible in strategic_queen_handoffs with full evidence + score breakdowns. Commit hash reported.
**Uncertainty:** Low. Composition is mechanical.

---

### Step U — Bee 4 cron registration

**Who:** Session A
**Entry:** Step T complete.
**Work:** Register cron at 06:00 UTC. Reads decided candidates, composes handoffs.
**Done:** Cron fires. Commit hash reported.
**Note:** This now collides with V1 LIGHT Strategic Queen synthesis at 06:00. **Resolve by shifting Bee 4 to 06:05 UTC** so V1 LIGHT goes first and Bee 4 doesn't interfere. Session A confirms timing in vercel.json.

---

### Step V — Operator dashboard for handoff approvals

**Who:** Session A (with Strategy Chat guidance on layout)
**Entry:** Step U complete.
**Work:**
- Session A first checks if `/dashboard/monitor/strategic-queen` already has any handoff-display panels (it likely does for V1 LIGHT — extend, don't replace)
- Add "Pending Handoffs" section showing all PENDING handoffs from strategic_queen_handoffs
- Each handoff card shows: topic_slug, canonical_question, action, score breakdown (6 dimensions with bars), evidence summary, confidence
- Three buttons per handoff: Approve / Reject / Defer
- Approve action: writes approval_status='APPROVED', approved_by, approved_at, then optionally writes to audit_log
- Reject action: similar with reason
- Defer action: similar with optional reappear date

**Done:** Operator opens dashboard, sees real PENDING handoffs from Step T, clicks Approve on one. Database row updates correctly. Commit hash reported.
**Uncertainty:** Medium. UI layout decisions, need to match existing soverella styling.

---

### Step W — End-to-end manual test (the true test)

**Who:** Operator + Session A
**Entry:** Steps A through V complete.
**Work:**
- Manually fire Bee 1. Watch all 5 routines run, candidates land in demand_candidates
- Manually fire Bee 2. Watch scoring complete, scores visible
- Manually fire Bee 3. Watch decisions made
- Manually fire Bee 4. Watch handoffs land in strategic_queen_handoffs as PENDING
- Open dashboard. Verify PENDING handoffs visible with full data
- Click Approve on one handoff
- Verify approval_status='APPROVED' in DB
- Verify production_pickup_at is NULL (Production Queen rebuild will populate later)

**Done:** Full chain works end-to-end with real data. Operator has approved one real handoff. The wall is built.
**Uncertainty:** High — first real end-to-end runs reveal interface mismatches. Plan a 4-6 hour debugging window for this step.

---

### Step X — 2-week shadow run period (per migration plan §5 Step 2.8)

**Who:** All cron-driven. Operator monitors.
**Entry:** Step W passes.
**Work:**
- All 4 bees run on their crons daily
- V1 LIGHT Strategic Queen continues firing alongside (E1 + E2 + E3 + E4 + E6 + E7 + Priority Decay + V1 synthesis)
- Operator observes daily:
  - Are Bee 1's candidates relevant?
  - Are Bee 2's scores defensible?
  - Are Bee 3's decisions correct? (especially: are MATCH/IGNORE calls right?)
  - Are Bee 4's handoffs higher quality than V1 LIGHT's handoffs?
- Operator approves real handoffs from V2 during this period (V1 LIGHT handoffs may also keep flowing — operator decides per item)
- Discovery log captures anything surprising

**Done:** 14 days elapsed. Operator has approved or rejected enough handoffs (≥20) to form a real opinion on V2 quality. No catastrophic regressions.
**Uncertainty:** This is the real test. Surprises will land here.

---

### Step Y — Retirement decision: E1 + V1 LIGHT

**Who:** Operator (with Strategy Chat consultation)
**Entry:** Step X complete (14 days of shadow data).
**Work:**
- Compare V2 handoffs to V1 LIGHT handoffs over the shadow period
- Decide one of three:
  - **(a) Retire** — V2 quality ≥ V1 LIGHT. Disable E1 cron + V1 LIGHT synthesis cron. V2 becomes authoritative.
  - **(b) Keep both** — V2 is good but V1 LIGHT is also producing useful redundant signal. Run both indefinitely until Phase 3 work removes the redundancy.
  - **(c) Roll back** — V2 has problems. Disable V2 crons. Investigate. Strategic Queen V2 returns to spec-only until issues resolved.

**Done:** Decision made and executed (cron entries either disabled or kept). Commit hash for any vercel.json changes reported.
**Uncertainty:** Depends on Step X observations. Can't predict.

---

### Step Z — Phase 2 close-out

**Who:** Operator + Strategy Chat
**Entry:** Step Y complete.
**Work:**
- Document the shadow-run findings in Day 14+ session log
- Update Day 13 architecture document with any deltas discovered during build
- Mark Strategic Queen Phase 2 as COMPLETE in the migration plan
- Define the entry point for Phase 3 (Production Queen re-cut of E2/E3/E4/E7)

**Done:** Strategic Queen V2 is the authoritative demand-detection system for taxchecknow. Operator has confidence in the bees. The architectural walls are in place for Phase 3 to plug in. Migration plan updated.

---

## §4 — Operator decisions you need to make during the build

These are calls that genuinely need your judgment, not Session A's. The plan flags them but you make them:

| Decision | When | Default |
|---|---|---|
| SERP Community query templates (per-hive domain list + phrasing) | Step L | Strategy Chat drafts initial templates for Tax Hive (Reddit AU subs + ATO Community + HMRC Community + IRS forums + Money.SE). Operator reviews and tunes before first fire. |
| Scoring weights for 6 dimensions (per-hive tuning) | Step E | Use design doc defaults; tune after Step O reveals first scores |
| Embedding similarity thresholds (0.85 / 0.70) | Step R | Use design doc defaults; tune if Step R first-fire shows misclassification |
| Auto-approve thresholds (off by default) | Step V | Off — manual approval until you trust scoring calibration |
| Operator Hypothesis Queue priority handling | Step L+1 | Hypotheses get priority cadence (every 6h) by default; operator can override per-hypothesis if needed |
| Step Y retirement decision | Step Y | Depends on Step X data |

---

## §5 — Honest critique points (least-confident areas)

1. **Bee 1 first real fire (Step M) will surface interface mismatches.** I've planned for a 2-hour debugging window. Could be longer if multiple routines fail simultaneously.

2. **Bee 2 scoring noise (Step O).** LLM-based dimensions (personalisation_potential, authority_clarity, competitor_weakness, urgency) are inherently noisy. The 3-call median helps but doesn't eliminate it. First-fire scoring outputs may surprise you. Plan to review them carefully and tune.

3. **Bee 3 panelbeat triggers limited to 3 instead of 4.** fan_out_drift is deferred (needs Production Queen schema). The remaining 3 triggers cover most cases but fan_out_drift was the most novel/valuable. Phase 3 work re-enables it.

4. **SERP Community query templates need tuning per first-fire.** Step L's query phrasing (`site:reddit.com/r/ "exact phrase"` vs broader keywords) affects result quality. Plan a Strategy Chat review of first-fire output before declaring the routine settled. Different jurisdictions may need different community domains configured (Tax Hive AU emphasises ATO Community + Reddit AU subs; future US Tax Hive emphasises IRS forums + Bogleheads + Reddit US subs).

5. **Dashboard work (Step V) might be more complex than estimated** if existing soverella patterns require extension rather than greenfield. Session A first checks what exists.

6. **Step W end-to-end test is the real risk concentration.** First real run of a multi-bee chain rarely works perfectly. The 4-6 hour debug window is honest.

7. **Step X 2-week shadow is mandatory.** No shortcut. The migration plan is explicit. Don't be tempted to compress.

8. **Embeddings storage in `strategic_queen_product_embeddings` is a Strategic-Queen-owned table.** When Production Queen rebuild happens (Phase 3), there's a decision about whether embeddings move to `products` table or stay where they are. That's a Phase 3 architectural decision — not Phase 2's problem.

---

## §6 — Rollback procedures at key checkpoints

| Step | Rollback | What's preserved |
|---|---|---|
| C (schema migration) | Reverse migration SQL (drop new tables, drop new columns) | V1 LIGHT data, all existing tables |
| F-G (Bee 1 skeleton + cron) | Disable cron in vercel.json. Delete bee file or leave dormant. | All existing crons + V1 LIGHT |
| H-L+1 (routines) | Flip `enabled: false` per routine in strategic-v2.json | All routines stop firing, dispatcher continues running with zero routines |
| M (first real fire) | Disable Bee 1 cron entirely. Demand_candidates rows remain for analysis. | V1 LIGHT continues to produce handoffs |
| O-T (Bees 2/3/4) | Disable specific bee crons. Earlier bees continue. | The chain breaks at the disabled bee; upstream candidates accumulate. |
| V (dashboard) | Revert dashboard page commit. Operator approves via DB until fixed. | All bee logic continues firing |
| X (shadow) | Disable all V2 crons (5 entries). V1 LIGHT becomes sole system again. | V1 LIGHT data unchanged |

**The principle:** every step is reversible. V1 LIGHT is the safety net throughout.

---

## §7 — End state — what working looks like

After Step Y completes:

1. **6 routines firing daily.** YouTube + Gemini + ChatGPT + Perplexity + SERP Community Discovery + Operator Hypothesis Queue. All writing normalised candidates to demand_candidates. Reddit signal captured via SERP without depending on Reddit's API. Zero operator burden per site at multi-hive scale.

2. **Bee 2 scoring nightly.** Every fresh candidate gets a 6-dimension score with confidence within 24 hours.

3. **Bee 3 deciding daily.** BUILD_NEW / PANELBEAT / IGNORE per candidate. Reject log full of transparent reasoning. SOFT MATCH flags surface for operator review.

4. **Bee 4 composing handoffs.** Real PENDING handoffs land in strategic_queen_handoffs with full evidence + score breakdowns.

5. **Operator approves in 30 seconds per handoff.** Dashboard shows pending handoffs with score bars and evidence. One click to approve.

6. **Production Queen ready for pickup.** Once Phase 3 work re-cuts Production Queen, she reads APPROVED handoffs from strategic_queen_handoffs and begins per-build deep research. The walls are built; the floor is in place.

7. **Operating cost ~$27/month per hive** (Gemini $5, ChatGPT $8, Perplexity $5, Brave SERP $3-5, scoring LLM $3, composer LLM $1, embeddings $0.05, YouTube free, operator hypothesis $1-2). Bing CSV upload deferred — no cost.

8. **V1 LIGHT either retired (Step Y option a) or running redundantly (option b).** Either way, V2 is the authoritative future.

9. **Architecture walls in place for Phase 3.** When Production Queen is re-cut later, she plugs into the existing strategic_queen_handoffs interface. No retrofit needed.

---

## §8 — Estimated effort

- Steps A-G (foundation): 2-3 days of focused work
- Steps H-L+1 (6 routines): 4-7 days
- Step M (first fire + debug): 0.5-1 day
- Step N (dedup): 0.5 day
- Steps O-U (Bees 2/3/4 + crons): 4-6 days
- Step V (dashboard): 1-2 days
- Step W (end-to-end test + debug): 0.5-1 day
- Step X (shadow run): 14 days elapsed time, minimal active work
- Step Y (retirement decision + execute): 0.5 day
- Step Z (close-out): 0.5 day

**Total active work: ~13-20 days** spread across Strategy Chat + Session A + operator.
**Total calendar time: ~25-35 days** including the 14-day shadow window.

---

## §9 — Closing note

This plan is paint-by-numbers from garden to table. Each step has a clear who/what/done/uncertainty. No re-debating architecture during execution — the architecture is locked in the Day 13 documents.

When the next Claude executes against this plan, they should:
1. Read this document first
2. Read the Day 13 architecture + Strategic Queen design + migration plan documents
3. Start at Step A
4. Move sequentially through steps
5. Only escalate to operator when a step explicitly says so

Process management, certainty percentages, and rule-numbering theater are NOT part of execution. The plan is the plan. Execute it.

**End of A-Z plan. Build the bees.**
