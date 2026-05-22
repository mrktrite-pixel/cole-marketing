# PLAN A-Z — Strategic Queen 4 Bees, Garden to Table

**Created:** Day 13 EOD (16 May 2026), final deliverable before this conversation closes
**For:** Next Strategy Chat + Session A + operator Matt V
**Status:** Execution plan. Architecture is locked. Execute this without re-debating.

---

## How to use this as a rinse-and-repeat recipe (added 2026-05-22)

This plan is now the **single reusable recipe** — both the as-built record of **house #1 (taxchecknow)** and the template for building the next house (the Vanilla Strategic Queen above any new site).

**Read each step's tag:**
- **GENERIC** — copy verbatim. Site-agnostic architecture, schema, patterns, process.
- **CALIBRATE** — re-derive per site. taxchecknow's value is the **worked example**, not the law (prompts, scoring weights, thresholds, community domains, cron slots, products, V1-retirement).

**Build-state legend:** ✅ done/LIVE · ⏳ pending · ⚠️ scrapped/repurposed/deferred (read the AS-BUILT note before assuming the original step text).

**The four-bee shape is locked:** Bee 1 Demand Hunter → Bee 2 Demand Scorer → Bee 3 Site Auditor → Bee 4 Handoff Composer. V2 marker on the shared `strategic_queen_handoffs` table: `action NOT NULL` + `gap_id NULL`.

**Monitoring / overseer layer is NOT a per-hive rebuild decision** — it's locked in `COLE-ARCHITECTURE-LOCKED-DAY13`: Principle 2 (each queen self-monitors via pings on her own outputs — Strategic pings demand signal; Governance pings infrastructure incl. cost/quotas), Principle 5 (per-hive isolation; Governance publishes a summary to the operator's Monitor view), and the deferred event bus (§10.10, Governance-owned). Strategic is **observable, not her own overseer**; the operator is the strategic whip (Principle 3 — no in-hive queen-over-queen).

### Step state + GENERIC/CALIBRATE map

| Step | What | State | Tag |
|---|---|---|---|
| A | Probe current state | ✅ done | GENERIC |
| B | Schema migration design | ✅ done | GENERIC |
| C | Apply schema migration | ✅ done | GENERIC |
| D | Cost attribution wrapper | ✅ done | GENERIC |
| E | Hive config additions | ✅ done | CALIBRATE (prompts/weights/thresholds per-site) |
| F | Bee 1 dispatcher skeleton | ✅ done | GENERIC |
| G | Bee 1 cron registration | ✅ done | GENERIC (slot CALIBRATE) |
| H | Routine: YouTube | ✅ done | GENERIC code / CALIBRATE queries |
| I | Routine: Gemini grounding | ✅ done | GENERIC / CALIBRATE prompts |
| J | Routine: ChatGPT search | ✅ done | GENERIC / CALIBRATE prompts |
| K | Routine: Perplexity | ⚠️ DEFERRED (never built) | GENERIC when built |
| L | Routine: Bing CSV | ⚠️ SCRAPPED → serp_community | CALIBRATE (community domains per-site) |
| M | Enable routines + first fire | ✅ done (306→214) | GENERIC process |
| N | Candidate dedup | ✅ done | GENERIC |
| O | Bee 2 Demand Scorer | ✅ LIVE | GENERIC code / CALIBRATE weights+floor |
| P | Bee 2 cron registration | ✅ done (35 5) | GENERIC (slot CALIBRATE) |
| Q | Bee 3 embeddings prep | ⚠️ SCRAPPED | moot (demand-discovery-only) |
| R | Bee 3 Site Auditor | ✅ LIVE (55 5) | GENERIC code / CALIBRATE thresholds (5.0 floor, 0.85/0.70) |
| S | ~~Bee 3 cron~~ → product-embedding writer | ⚠️ REPURPOSED, ⏳ PENDING | GENERIC |
| T | Bee 4 Handoff Composer | ✅ LIVE (20 6) | GENERIC |
| U | Bee 4 cron registration | ✅ done (folded into T) | GENERIC (slot CALIBRATE) |
| V | Operator dashboard (approvals) | ⏳ PENDING | GENERIC |
| W | End-to-end manual test | ⏳ PENDING | GENERIC process |
| X | 2-week shadow run | ⏳ PENDING | GENERIC process |
| Y | Retire E1 / V1 LIGHT | ⏳ PENDING | CALIBRATE (per-site call) |
| Z | Phase 2 close-out | ⏳ PENDING | GENERIC process |

### AS-BUILT note — cron cascade (CALIBRATE)
Planned slots in steps G/P/S/U (05:00 / 05:30 / 05:45 / 06:05) were re-derived during the house-#1 build to dodge real collisions with existing crons. **Live taxchecknow cascade: Bee 1 `15 5` → Bee 2 `35 5` → Bee 3 `55 5` → Bee 4 `20 6` (UTC).** Cron slots are always CALIBRATE: a new site's existing crons differ — pick collision-free slots from that site's live `vercel.json` array.

### AS-BUILT note — orchestration principle (GENERIC)
There is no central orchestrator. Orchestration **is** the staggered cron cascade: the four bees fire ~20 min apart on collision-free slots, each after the prior likely finishes (Bee 4, being LLM-per-candidate, is slowest — give it the widest berth). This pattern is GENERIC; copy it, re-deriving only the specific minutes per site.

---

## §1 — Context (3 paragraphs)

This plan takes Strategic Queen V2 from nothing built to four bees firing live in production with a true end-to-end test. The end state: Demand Hunter scans 6 sources daily, candidates flow through Demand Scorer → Site Auditor → Handoff Composer, the operator sees pending handoffs in the dashboard, approves one, and the system has a real handoff waiting for Production Queen to pick up.

The plan is sequenced so Phase 3 work (re-cutting E2/E3/E4/E7 to Production Queen) wires onto these foundations without rework. Schemas are forward-compatible. Bees are scoped so their interfaces don't change when Production Queen's deep research bees plug in later.

**Bing AI Performance is included as a first-class source.** No public API exists, so the routine reads via operator-uploaded weekly CSV exports (Option C from the design — manual now, scraping later). This unblocks the source list and gets all 5 routines firing.

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
| P6 | Bing Webmaster Tools dashboard access | You already have this. Confirm you can log in and export AI Performance data as CSV |
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

### Step L — Routine 5: Bing AI Performance (manual CSV upload)

**Who:** Strategy Chat (design) + Session A (build) + Operator (weekly upload)
**Entry:** Step K complete. Operator can log into Bing Webmaster Tools and export AI Performance as CSV.
**Work:**
- Strategy Chat designs the operator UI for CSV upload: a small panel on the Strategic Queen monitor page with "Upload Bing AI Performance CSV" button
- Session A builds the upload endpoint that parses the CSV and writes normalised rows to `bing_ai_performance_snapshots` (new table — Step B should have included this)
- Session A builds the Bing routine at `lib/queens/strategic-routine-bing-ai-perf.ts` that reads from `bing_ai_performance_snapshots` (not the dashboard directly — the routine reads the table; operator feeds the table)
- Routine fires on schedule reading whatever's been uploaded

**Done:** Operator can upload a CSV via the dashboard. Parsed rows appear in bing_ai_performance_snapshots. Routine reads them and writes candidate rows with `source: 'bing-ai-perf'`. Commit hash reported.
**Uncertainty:** Medium. CSV format from Bing Webmaster Tools needs investigation — the columns may differ from what we expect. Strategy Chat reviews CSV sample BEFORE Session A writes the parser.

---

### Step M — Enable all 5 routines + Bee 1 first real fire

**Who:** Operator + Session A
**Entry:** Steps H, I, J, K, L all complete and verified.
**Work:**
- Operator flips `enabled: true` for all 5 routines in strategic-v2.json
- Manual fire Bee 1 via curl
- All 5 routines execute in sequence (Bing reads uploaded data, others call APIs)
- Candidates flow into demand_candidates
- bee_run_metrics row written with per-routine breakdown in jsonb
- Cost attribution shows real per-routine spend

**Done:** First real Bee 1 fire produces ≥20 candidate rows across all 5 sources. No silent failures. Per-routine cost adds up to ~expected envelope. Commit hash for any config tweaks reported.
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

> **⚠️ AMENDED DURING BUILD (2026-05-22) — Steps Q/R/S below are the original Day-14 recipe and were refined during the actual build. Design B is canonical (per Design Chat 2026-05-22). The authoritative per-bee spec is soverella `docs/help/strategic-queen-v2/bees/` — consult those for current detail; the notes below mark where this recipe diverged from what was built.**

**Who:** Session A
**Entry:** Step P complete.
**Work:**
- For every existing product on taxchecknow, compute embedding of its canonical question using `text-embedding-3-small`
- Store in `strategic_queen_product_embeddings` (new table from Step B): product_id, canonical_question_text, embedding vector, computed_at
- This is a one-time backfill; ongoing updates happen when Production Queen builds new products

**Done:** Every existing product has an embedding row. Cost ~$0.01 total (embeddings are cheap). Commit hash reported.
**AS-BUILT:** Step Q (one-time embedding backfill of legacy products) was SCRAPPED — the build deliberately did NOT fabricate canonical questions for the 5 legacy UK products (derive-or-defer ruling). Embeddings became demand-discovery-only. The product-embedding writer moved to the as-built "Step S" (see below). Bee 3 therefore shipped FIRST with an empty embeddings table (graceful degradation → all BUILD_NEW until embeddings exist).
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
**AS-BUILT (canonical = bees/bee-3-site-auditor.md):** score floor is 5.0 NOT 6.0 (TEMPORARY — raise to 6.0 ~2026-05-27 after E6 trend velocity activates; 6.0 today would IGNORE most of the live pool for the wrong reason). Panelbeat triggers are the closed FOUR — law_change, authority_change, fan_out_drift, score_climb (priority order) — NOT the three listed above; only authority_change is live at go-live, the other three are dormant stubs (score_climb must NOT wire to goat_score — category error). Bee 3 writes decision_reason + panelbeat_triggers_fired to demand_candidates; panelbeat_reason is Bee 4's column on strategic_queen_handoffs, NOT Bee 3's. Cosine thresholds 0.85/0.70 are calibration-pending (tune after the embedding writer populates real product embeddings). Cron registration was done INSIDE this step (55 5 * * *), not as a separate Step S.

---

### Step S — Bee 3 cron registration

**Who:** Session A
**Entry:** Step R complete and operator approves first-fire decisions.
**Work:** Register cron at 05:45 UTC. Reads scored-but-undecided candidates, decides, writes back.
**Done:** Cron fires. Commit hash reported.
**AS-BUILT:** This step's original content (Bee 3 cron registration) was folded into Step R (cron registered at 55 5 * * * during the Bee 3 build). "Step S" now denotes the PRODUCT-EMBEDDING WRITER — opportunistic, gated on Production Queen shipping new products; it un-dormants Bee 3's cosine-match path per-jurisdiction when it lands (no Bee 3 code change). Still pending as of 2026-05-22.

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
| Bing CSV format mapping (after first export inspection) | Step L | Strategy Chat maps based on actual CSV |
| Scoring weights for 6 dimensions (per-hive tuning) | Step E | Use design doc defaults; tune after Step O reveals first scores |
| Embedding similarity thresholds (0.85 / 0.70) | Step R | Use design doc defaults; tune if Step R first-fire shows misclassification |
| Auto-approve thresholds (off by default) | Step V | Off — manual approval until you trust scoring calibration |
| Bing routine cadence (operator uploads weekly? monthly?) | Step L | Weekly upload is the design default; adjust based on your Bing dashboard refresh rhythm |
| Step Y retirement decision | Step Y | Depends on Step X data |

---

## §5 — Honest critique points (least-confident areas)

1. **Bee 1 first real fire (Step M) will surface interface mismatches.** I've planned for a 2-hour debugging window. Could be longer if multiple routines fail simultaneously.

2. **Bee 2 scoring noise (Step O).** LLM-based dimensions (personalisation_potential, authority_clarity, competitor_weakness, urgency) are inherently noisy. The 3-call median helps but doesn't eliminate it. First-fire scoring outputs may surprise you. Plan to review them carefully and tune.

3. **Bee 3 panelbeat triggers limited to 3 instead of 4.** fan_out_drift is deferred (needs Production Queen schema). The remaining 3 triggers cover most cases but fan_out_drift was the most novel/valuable. Phase 3 work re-enables it.

4. **Bing CSV format unknown until operator exports one.** Step L is partly speculative until we see real Bing data. Plan a Strategy Chat session to inspect the first CSV before Session A writes the parser.

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
| H-L (routines) | Flip `enabled: false` per routine in strategic-v2.json | All routines stop firing, dispatcher continues running with zero routines |
| M (first real fire) | Disable Bee 1 cron entirely. Demand_candidates rows remain for analysis. | V1 LIGHT continues to produce handoffs |
| O-T (Bees 2/3/4) | Disable specific bee crons. Earlier bees continue. | The chain breaks at the disabled bee; upstream candidates accumulate. |
| V (dashboard) | Revert dashboard page commit. Operator approves via DB until fixed. | All bee logic continues firing |
| X (shadow) | Disable all V2 crons (5 entries). V1 LIGHT becomes sole system again. | V1 LIGHT data unchanged |

**The principle:** every step is reversible. V1 LIGHT is the safety net throughout.

---

## §7 — End state — what working looks like

After Step Y completes:

1. **5 routines firing daily.** YouTube + Gemini + ChatGPT + Perplexity reading APIs; Bing reading operator-uploaded CSVs. All writing normalised candidates to demand_candidates.

2. **Bee 2 scoring nightly.** Every fresh candidate gets a 6-dimension score with confidence within 24 hours.

3. **Bee 3 deciding daily.** BUILD_NEW / PANELBEAT / IGNORE per candidate. Reject log full of transparent reasoning. SOFT MATCH flags surface for operator review.

4. **Bee 4 composing handoffs.** Real PENDING handoffs land in strategic_queen_handoffs with full evidence + score breakdowns.

5. **Operator approves in 30 seconds per handoff.** Dashboard shows pending handoffs with score bars and evidence. One click to approve.

6. **Production Queen ready for pickup.** Once Phase 3 work re-cuts Production Queen, she reads APPROVED handoffs from strategic_queen_handoffs and begins per-build deep research. The walls are built; the floor is in place.

7. **Operating cost ~$22/month per hive** (Gemini $5, ChatGPT $8, Perplexity $5, embeddings $0.05, scoring LLM $3, composer LLM $1, YouTube free, Bing free).

8. **V1 LIGHT either retired (Step Y option a) or running redundantly (option b).** Either way, V2 is the authoritative future.

9. **Architecture walls in place for Phase 3.** When Production Queen is re-cut later, she plugs into the existing strategic_queen_handoffs interface. No retrofit needed.

---

## §8 — Estimated effort

- Steps A-G (foundation): 2-3 days of focused work
- Steps H-L (5 routines): 4-6 days
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
