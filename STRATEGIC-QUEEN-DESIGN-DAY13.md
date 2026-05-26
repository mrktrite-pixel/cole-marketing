# Strategic Queen — Design (Day 13)

**Status:** First draft for critique. Designed backwards from the locked architecture (COLE-ARCHITECTURE-LOCKED-DAY13.md, Principle 7).
**Scope:** Per-hive Strategic Queen (e.g. Tax Hive's Strategic Queen). Apiary Strategic Queen is a separate design covered briefly in §10.
**Method:** Outcome → Handoff → Bees → Sources. Bees fall out of requirements. Anything that doesn't produce a handoff field doesn't exist.

---

## §1 — The locked outcome

From the architecture document, Strategic Queen's one-line job:

> "What should we build next within this hive's domain?"

She is upstream of the four CO·LE verbs. She feeds the system. She doesn't herself convert, operate, learn, or execute — but without her, the others have nothing to act on.

Her continuous function is to scan demand signals, score them, check the site catalogue, and route to Production Queen. Three answers per find: **BUILD_NEW** / **PANELBEAT** / **IGNORE**.

She does NOT do:
- Persona selection (Production owns)
- Authority verification per topic (Production owns at build, Production pings continuously)
- Customer voice research (Production owns, scoped per build)
- Calculator design (Production owns)
- FAQ writing (Production owns)
- Cross-product references (Production owns)
- Death certificates (Production owns)
- Anything customer-facing (no queen except Production writes customer-facing content)

She owns only: demand detection, scoring, routing.

---

## §2 — The handoff (designed first; bees fall out of this)

This is what Strategic Queen writes to `strategic_queen_handoffs`. Production Queen reads from this table.

```
strategic_queen_handoffs (per-hive table)
─────────────────────────────────────────────

PRIMARY KEY
  handoff_id              uuid
  created_at              timestamp
  hive                    e.g. "tax"

TOPIC IDENTITY
  topic_slug              e.g. "au-frcgw-settlement-delay-risk"
  canonical_question      The exact user question in user language
                          e.g. "Will my settlement be delayed by the
                                ATO clearance certificate, and will I
                                lose 15%?"
  short_question          ≤8 words, for headlines
                          e.g. "Will ATO withhold 15% from your settlement?"

JURISDICTION
  jurisdiction            AU | NZ | CAN | UK | US | NOMAD

ACTION & SCORING
  action                  BUILD_NEW | PANELBEAT
  overall_score           0.0–10.0
  score_components        {
                            ai_citation_volume:      0.0–10.0
                            ai_citation_velocity:    0.0–10.0
                            personalisation_potential: 0.0–10.0
                            authority_clarity:       0.0–10.0
                            competitor_weakness:     0.0–10.0
                            urgency:                 0.0–10.0
                          }
  confidence              0.0–1.0 (how sure she is)

EVIDENCE TRAIL (proof she's not making it up)
  evidence                {
                            grounding_queries: [...]   // fan-out queries
                                                        // from AI engines
                            cited_competitor_urls: [...]  // who AI cites today
                            youtube_signal: {
                              top_videos: [...],
                              comment_volume: int,
                              recency: ...
                            }
                            bing_ai_perf_snapshot: {
                              query_count: int,
                              citation_count: int,
                              ...
                            }
                            stackexchange_signal: {...}
                            decay_window: "rising" | "stable" | "declining"
                          }

PANELBEAT CONTEXT (only if action = PANELBEAT)
  existing_product_id     reference to the product needing revision
  panelbeat_reason        free-text: what changed that warrants revision
                          e.g. "New ATO page on FRCGW appeared in citations;
                                product currently doesn't reference it"
                          e.g. "Demand fan-out queries shifted; FAQ angle
                                no longer matches what AI is searching"

OPERATOR GATE
  approval_status         PENDING | APPROVED | REJECTED | DEFERRED
  approved_by             operator id (when approved)
  approved_at             timestamp

DOWNSTREAM TRACKING
  production_pickup_at    timestamp (when Production Queen began work)
  production_completed_at timestamp (when Production Queen shipped)
  production_product_id   reference to the resulting product
```

**Eight conceptual sections.** Most fields are small (a slug, a score, a jurisdiction). Evidence is rich because it's how the operator decides whether to trust the find.

---

## §3 — The bees that produce this handoff

Working backwards: which bee produces which field?

```
Bee 1: Demand Hunter        →  evidence (grounding_queries, cited URLs,
                                signal snapshots from each source)
                            →  candidate topic identification

Bee 2: Demand Scorer        →  score_components (all 6 sub-scores)
                            →  overall_score, confidence
                            →  decay_window classification

Bee 3: Site Auditor         →  action (BUILD_NEW | PANELBEAT | IGNORE)
                            →  existing_product_id (if PANELBEAT)
                            →  panelbeat_reason

Bee 4: Handoff Composer     →  the assembled handoff row
                            →  topic_slug, canonical_question, short_question
                            →  routes to operator for approval gate
```

**Four bees. That's it.** Each produces a clearly-named set of handoff fields. None of them does the work of another. If any bee can be removed without leaving a handoff field unfilled, it shouldn't exist.

Critique point worth flagging: Bee 4 (Handoff Composer) could arguably be merged into Bee 3 (Site Auditor). The Auditor already produces the action — she could just emit the handoff directly. I separated them because composition (canonicalising the question, picking the slug, formatting the short question) is meaningfully different from auditing. But it's a thin separation. **Open to merging if you'd rather have three bees.**

---

## §4 — Bee 1: Demand Hunter

### Purpose
Scan signals across the world (within hive's domain). Surface candidate topics.

### Input
- Hive's domain definition (e.g. for Tax Hive: "tax compliance, lodgement, withholding, residency, capital gains, etc.")
- Hive's jurisdiction scope (e.g. AU, NZ, CAN, UK, US, NOMAD)
- Source registry (configured list of signal sources)
- Cadence config (how often to scan each source)

### Output
Raw candidate signals, each with provenance:

```
demand_candidates (table written by Demand Hunter)
──────────────────────────────────────────────────

candidate_id           uuid
detected_at            timestamp
hive                   e.g. "tax"
jurisdiction           e.g. "AU"
raw_topic_signal       free-text from the source
                       e.g. "people asking about ATO clearance certs delay"
source                 enum: bing_ai_perf | gemini_grounding | chatgpt_search |
                             perplexity | youtube_data | stackexchange | quora
source_payload         {
                         // source-specific, e.g. for Gemini:
                         prompt_used: "...",
                         grounding_queries: [...],
                         cited_urls: [...],
                         cited_texts: [...]
                       }
recurrence_count       int — how many independent sources hit on this signal
first_seen             timestamp
last_seen              timestamp
```

### Method (per source)

The Demand Hunter has one routine per source. Each routine produces normalized candidate signals.

#### Routine A — Bing AI Performance grounding queries
- **What it asks:** "What grounding queries are appearing in Bing AI Performance dashboard for our own site (taxchecknow), AND for known competitor sites in our domain?"
- **How it reads:**
  - For own site: read directly from Bing Webmaster Tools dashboard (no API as of May 2026; manual export OR scrape your own logged-in session — operator decision)
  - For competitor sites: not possible (each site sees only its own data)
- **What it captures:** The actual fan-out queries AI engines used to retrieve content. These ARE the demand signals — what AI engines are asking on behalf of users.
- **Cadence:** Daily snapshot, kept as time series.

#### Routine B — Gemini API with grounding enabled
- **What it asks:** A small rotating set of broad domain prompts:
  - "What questions are foreign residents in Australia confused about regarding tax?"
  - "What are the most common UK property tax mistakes?"
  - "What's recent news in Australian capital gains tax that's causing confusion?"
  - (Routine has a config of 20-30 such prompts per hive, rotated)
- **How it reads:** Calls Gemini API with `tools: [{ googleSearch: {} }]`. Captures the `groundingMetadata` field from the response:
  - `webSearchQueries` — the fan-out sub-queries Gemini ran internally
  - `groundingChunks` — sources Gemini cited (with URLs)
  - `groundingSupports` — which parts of the answer came from which source
- **What it captures:** The fan-out queries are the gold. They reveal what AI engines are actually searching for. Each query is a candidate topic.
- **Cadence:** Weekly rotation through the prompt set.
- **Cost:** Cheap — pennies per call. Budget ~$5/month per hive.

#### Routine C — ChatGPT API with web_search
- **What it asks:** Same prompt set as Routine B, sent to ChatGPT.
- **How it reads:** Captures URL citations in the response.
- **What it captures:** Which URLs ChatGPT thinks are authoritative for these questions. Cross-references against Gemini's citations — overlap is high-confidence signal.
- **Cadence:** Weekly.

#### Routine D — Perplexity API
- **What it asks:** Same prompt set.
- **How it reads:** Perplexity returns cited sources inline. Capture them.
- **What it captures:** Like Routine C; cross-engine corroboration.
- **Cadence:** Weekly.

#### Routine E — YouTube Data API
- **What it asks:** For each candidate topic that emerges from Routines A-D, search YouTube for top videos.
- **How it reads:** YouTube Data API v3, `search.list` endpoint. Then `commentThreads.list` for top comments on top-cited videos.
- **What it captures:**
  - Top videos by view count for the topic
  - Comment volume and recency (proxy for active demand)
  - Common questions in comments (this is the customer voice signal Reddit used to provide)
- **Quota:** Free 10,000 units/day. A search costs ~100 units, comments ~1 unit each. Plenty of headroom.
- **Cadence:** On candidate emergence + weekly refresh on tracked topics.

#### Routine F — StackExchange (Money SE, Personal Finance SE, etc.)
- **What it asks:** Search for candidate topic terms in relevant SE communities.
- **How it reads:** StackExchange API, free, rate-limited (300 requests/sec quota).
- **What it captures:** Question volume, recent activity, accepted answers (or absence thereof).
- **Cadence:** Weekly.

### Source registry config (per hive)

```yaml
# hive_config.yml (Tax Hive)
domain: "tax compliance and planning"
jurisdictions: [AU, NZ, CAN, UK, US, NOMAD]

sources:
  bing_ai_perf:
    enabled: true
    sites_tracked:
      - taxchecknow.com
    competitor_sites_tracked: []  # cannot read competitor data
    cadence_days: 1

  gemini_grounding:
    enabled: true
    cadence_days: 7
    prompts:
      - "What questions are foreign residents in Australia confused about regarding tax?"
      - "What are common UK property tax mistakes?"
      - ...30 prompts total
    budget_usd_per_month: 5

  chatgpt_search:
    enabled: true
    cadence_days: 7
    # uses same prompt set as gemini_grounding
    budget_usd_per_month: 8

  perplexity:
    enabled: true
    cadence_days: 7
    budget_usd_per_month: 5

  youtube:
    enabled: true
    cadence_days: 7
    quota_units_per_day_cap: 5000  # leave headroom

  stackexchange:
    enabled: true
    cadence_days: 7
    communities: [money, personalfinance]
```

The config is per-hive because each hive has different domain, jurisdiction, and source priorities.

### Edge cases the Demand Hunter handles

- **Same signal from multiple sources** → bumps `recurrence_count` rather than creating duplicate candidates. High recurrence = high confidence in Scorer.
- **Source temporarily down** (Gemini API outage, YouTube quota hit) → skips that source for that cadence, logs the miss, continues with others. Hunter does NOT block on any one source.
- **New source added later** → config update, Hunter picks it up next cadence. No code change.
- **Operator wants to scan something one-off** → manual "Run now" trigger on the Strategic Queen panel triggers an immediate Hunter cycle for current prompt set.

---

## §5 — Bee 2: Demand Scorer

### Purpose
Take raw candidates from Demand Hunter. Produce a multi-dimensional score plus confidence.

### Input
- A demand_candidate row (or a cluster of related candidates from different sources)
- Historical data for trend velocity (previous candidate snapshots)

### Output
Score components written to the handoff:

```
score_components               (each 0.0–10.0)
─────────────────────────────────────────────

ai_citation_volume      How many AI engines cite content on this topic?
                        How often do they cite?
                        High = many citations across many engines.

ai_citation_velocity    Is this topic's citation count rising or falling?
                        Computed from time-series snapshots.
                        High = rising fast.

personalisation_potential   Could this question only be answered by a tool
                            that takes user inputs?
                            High = yes, calculator/checker is needed.
                            Low = a plain article would suffice.

authority_clarity       How clear is the authoritative answer?
                        High = ATO/IRS has a clean canonical page.
                        Low = answer is contested or unclear.

competitor_weakness     Where AI cites today — are those answers weak?
                        High = top citations are thin, outdated, or
                        miss the personalisation angle.
                        Low = strong canonical answers already exist.

urgency                 Time-pressure dimension.
                        High = user has a deadline or risk window
                        (e.g. "settlement in 14 days").
                        Low = informational, no time pressure.

overall_score           Weighted blend of the 6 sub-scores.
                        Weights configurable per hive.

confidence              How sure she is. Drops if:
                        - Few sources corroborated
                        - Mixed signals
                        - Recent signal only (no history)
```

### Method

For each sub-score, a focused method:

#### ai_citation_volume
- Count of distinct AI engines (Gemini, ChatGPT, Perplexity) that cite any source on this topic, in the most recent snapshot
- Total citation count across engines
- Number of distinct cited domains
- **Scoring rubric:** 0–3 cited sources = low; 4–8 = medium; 9+ = high. Configurable per hive.

#### ai_citation_velocity
- Compare current snapshot to previous N snapshots
- Compute slope of citation count over time
- **Scoring rubric:** declining = 0–3; flat = 4–6; rising = 7–10.
- **Requires:** at least 2 snapshots. New topics get default 5.0 with `confidence` dropped.

#### personalisation_potential
- This one is the trickiest. Hard to compute deterministically.
- **Method:** Use an LLM call. Prompt: "Given this question — '{canonical_question}' — would a user be best served by (a) a plain article, (b) a calculator/checker tool taking their inputs, or (c) a decision tree? Reply with a score 0-10 where 10 = clearly needs interactive personalisation."
- **Cost:** One LLM call per candidate, cheap.
- **Critique point:** This depends on LLM judgment which has noise. Mitigate by calling 3 different LLMs and averaging, or by using a fixed-prompt heuristic. Open to debate.

#### authority_clarity
- Search the cited URLs in Bee 1's evidence for canonical authority pages (ATO, HMRC, IRS, etc.)
- Check: is there ONE clear authority page that answers this? Or are answers scattered?
- **Scoring rubric:** one clear gov page found = 8–10; multiple scattered = 4–7; no clear authority = 0–3.

#### competitor_weakness
- For top N URLs AI engines cite today (from Bee 1's evidence), use an LLM to assess: "Does this page actually answer '{canonical_question}' well? Score 0-10 where 10 = comprehensive and personalised."
- Inverse the score: weak competitors → high competitor_weakness score → opportunity.
- **Cost:** ~3 LLM calls per candidate.

#### urgency
- LLM heuristic: "Does this question imply time pressure or a deadline? Score 0-10."
- Crude but effective; can be refined per hive (Tax Hive has explicit deadline knowledge — lodgement dates, settlement dates).

#### overall_score
- Weighted average of the 6. Default weights:
  - ai_citation_volume: 0.15
  - ai_citation_velocity: 0.20
  - personalisation_potential: 0.20
  - authority_clarity: 0.10
  - competitor_weakness: 0.20
  - urgency: 0.15
- Weights are per-hive config; tax-vs-visa might weight urgency differently.

#### confidence
- Multi-factor:
  - Number of sources corroborating: ≥3 sources → high confidence
  - Velocity computable (≥2 snapshots): adds confidence
  - Authority clarity high: adds confidence
- Combined into 0.0–1.0.

### Why six dimensions, not one

A single overall score loses too much information. The operator approval gate needs to see WHY a topic scored 8/10:
- "8/10, driven by urgency (10) and competitor weakness (9)" — operator decides "yes, build it"
- "8/10, driven by AI citation volume (9), but authority clarity 3 and personalisation 4" — operator might reject, because building this would produce a thin article competing with established answers

The six dimensions let the operator make a real decision instead of trusting an opaque number.

### Edge cases

- **First-time topic** (no history for velocity) → velocity defaults to 5.0, confidence drops to 0.5 until second snapshot.
- **LLM-based scoring is noisy** → run 3 calls per LLM-based dimension, take median. Cost-bounded by overall budget.
- **Scoring weights need tuning** → operator can adjust weights in hive config and re-score historical candidates. Useful when calibrating.

---

## §6 — Bee 3: Site Auditor

### Purpose
For each scored candidate, check the hive's product catalogue. Decide BUILD_NEW / PANELBEAT / IGNORE.

### Input
- A scored demand candidate (with score components)
- The hive's `products` table (all products this hive currently sells)

### Output
- `action` field on the handoff: BUILD_NEW | PANELBEAT | IGNORE
- If PANELBEAT: `existing_product_id` + `panelbeat_reason`
- If IGNORE: written to a reject log with reason (for transparency, not handed off)

### Decision logic

```
                    [Scored Candidate]
                          │
                          ▼
              overall_score < threshold? ──── YES ───► IGNORE
                          │                              (log: "score below 6.0")
                          NO
                          │
                          ▼
              semantic_match against products?
                          │
                  ┌───────┴───────┐
                  │               │
                 YES              NO
                  │               │
                  ▼               ▼
          panelbeat trigger?    BUILD_NEW
          (see below)
                  │
            ┌─────┴─────┐
            │           │
           YES         NO
            │           │
            ▼           ▼
        PANELBEAT    IGNORE
                     (log: "existing product
                      satisfies; no revision
                      needed")
```

### Step 1 — Threshold gate

Reject candidates below configurable threshold (default `overall_score < 6.0`). These get logged to a reject table for transparency. They don't waste downstream work.

### Step 2 — Semantic match against products

For each candidate that passes threshold:
- Embed `canonical_question` using a text embedding model (e.g. `text-embedding-3-small`)
- Compare against pre-computed embeddings of every product's `canonical_question` in the hive
- If cosine similarity > 0.85 → "match" against existing product
- If 0.70–0.85 → "soft match" — flag for operator review
- If < 0.70 → "no match" → BUILD_NEW

**Embedding cost:** trivial. ~$0.00002 per embedding. Pre-computed and cached per product.

### Step 3 — Panelbeat trigger logic (only if match)

When a candidate matches an existing product, the question becomes: does this matter? Should the existing product be revised, or is it already fine?

A panelbeat is triggered if ANY of these conditions are true:

```
PANELBEAT_TRIGGERS = {
  # Trigger 1: New cited authority URL not in product's authority_grounding
  "new_authority_cited": (
    any URL in candidate's evidence.cited_competitor_urls
    is from a recognized authority domain (.gov.au, .gov.uk, etc.)
    AND not in product.authority_grounding
  ),

  # Trigger 2: Velocity rising and product's last_revised > 90 days ago
  "stale_with_rising_velocity": (
    candidate.score_components.ai_citation_velocity >= 7.0
    AND product.last_revised_at < now() - 90 days
  ),

  # Trigger 3: Significant fan-out query divergence
  # The grounding queries Bee 1 captured are meaningfully different
  # from the queries the product was originally built to answer
  "fan_out_drift": (
    overlap of candidate.evidence.grounding_queries
    with product.fan_out_queries < 0.5  # less than half overlap
  ),

  # Trigger 4: Operator-flagged review
  "operator_flagged": (
    product has a manual flag from operator review
  )
}
```

If any trigger fires → PANELBEAT.
If no triggers fire → IGNORE (log: "existing product satisfies, no revision needed").

### `panelbeat_reason` text

Human-readable explanation of which trigger(s) fired:

> "Panelbeat triggered: ATO published a new page on FRCGW that AI engines now cite (ato.gov.au/business/.../new-page-2026). Product au-19-frcgw-clearance-certificate does not reference this source. Consider rebuilding sections that should cite it."

> "Panelbeat triggered: fan-out query divergence. Product was built to answer 'When does the ATO issue a clearance certificate?' but current AI fan-out queries are 'What if my settlement is in 7 days?' and 'Can I get an expedited certificate?' — these aren't covered."

### Critique point

Trigger 1 (new authority cited) depends on Bee 1 capturing the cited URLs accurately. If Gemini grounding metadata is the source, this works. If we're scraping search results instead, this is noisier.

Trigger 3 (fan-out drift) is the most novel one and the most powerful — but it requires that products store their original fan-out queries (added to the `products` table schema, written by Production Queen at build time). **That's a dependency on Production Queen's design.** Flagging here so we don't lose it.

---

## §7 — Bee 4: Handoff Composer

### Purpose
Assemble the handoff row. Generate the topic slug, canonicalise the question, produce the short headline version.

### Input
- A scored candidate from Bee 2
- An auditor decision from Bee 3 (BUILD_NEW or PANELBEAT)

### Output
- A complete `strategic_queen_handoffs` row, status = PENDING (operator gate)

### Method

#### Compose `canonical_question`
The original signal from Bee 1 is often raw. E.g., from a Gemini fan-out query it might be:
> "ato clearance certificate processing time"

The Composer rewrites this in user voice:
> "How long does the ATO take to issue a clearance certificate?"

**Method:** LLM call with prompt:
> "Rewrite this query as a clear question in the voice of a first-person user. Keep it natural and concrete. Original: '{raw_signal}'. Output the question only."

Cheap, deterministic enough at temperature 0.

#### Compose `short_question`
> "How long does ATO clearance take?" (≤8 words)

Same approach, separate LLM call with prompt constraining to ≤8 words.

#### Compose `topic_slug`
Deterministic, no LLM:
- Jurisdiction prefix: "au-" | "uk-" | "us-" | etc.
- Domain prefix: "tax-" (per hive)
- Core: derived from canonical_question via standard slugification
- Example: `au-tax-frcgw-clearance-certificate-processing-time`

Slug uniqueness check against existing handoffs and products — if collision, append `-v2` etc.

#### Bundle the row
All fields from Bee 1 (evidence), Bee 2 (scores, confidence), Bee 3 (action, panelbeat context). Write to table. Emit event.

---

## §8 — Operator gate (the approval step)

Once Bee 4 writes a PENDING handoff:

1. Event fires: `strategic_queen.handoff_pending`
2. Governance Queen's dashboard picks it up, renders it in the Strategic Queen panel's "Approvals Pending" section
3. Operator sees:

```
┌─────────────────────────────────────────────────────────────┐
│ NEW BUILD OPPORTUNITY                            [Approve]  │
│                                                  [Reject]   │
│                                                  [Defer]    │
│                                                              │
│ Topic: au-tax-frcgw-clearance-certificate-delay-risk         │
│ Question: "Will my settlement be delayed by the ATO         │
│            clearance certificate, and will I lose 15%?"      │
│ Action: BUILD_NEW                                            │
│ Score: 9.2 / 10  (confidence 0.84)                          │
│                                                              │
│ Score breakdown:                                             │
│   AI citation volume:        8.5   ▓▓▓▓▓▓▓▓▓░               │
│   AI citation velocity:      9.7   ▓▓▓▓▓▓▓▓▓▓ rising fast   │
│   Personalisation potential: 9.2   ▓▓▓▓▓▓▓▓▓▓ needs tool    │
│   Authority clarity:         8.0   ▓▓▓▓▓▓▓▓░░ ATO is clear  │
│   Competitor weakness:       9.3   ▓▓▓▓▓▓▓▓▓▓ thin answers  │
│   Urgency:                   9.6   ▓▓▓▓▓▓▓▓▓▓ deadline      │
│                                                              │
│ Evidence:                                                    │
│   AI engines citing: Gemini (8), ChatGPT (5), Perplexity (3)│
│   Fan-out queries detected:                                  │
│     - "ATO clearance certificate processing time"           │
│     - "FRCGW withholding 15% delay"                         │
│     - "settlement risk foreign resident Australia"          │
│   Top YouTube videos: 3 videos with 200k+ views combined    │
│   StackExchange Money SE: 47 questions in last 6 months     │
│   Trend velocity: 18% MoM increase over last 3 months       │
│                                                              │
│ Why this matters:                                            │
│   New topic for taxchecknow. No existing product covers     │
│   this. Settlement-delay framing isn't addressed by         │
│   competitor pages (which focus on the certificate itself,  │
│   not the timing risk).                                      │
└─────────────────────────────────────────────────────────────┘
```

Operator clicks Approve → status = APPROVED → Production Queen's pickup logic sees it and begins work.

Operator clicks Reject → status = REJECTED → reason captured → handoff is closed.

Operator clicks Defer → status = DEFERRED with a reminder date → reappears at that date.

### Auto-approve thresholds (configurable)

Optional per-hive config:
```yaml
auto_approve:
  enabled: false  # off by default
  conditions:
    - action: BUILD_NEW
      overall_score: ">= 9.0"
      confidence: ">= 0.9"
      panelbeat_only: false
    - action: PANELBEAT
      panelbeat_reason: "new_authority_cited"
      overall_score: ">= 7.0"
```

Off by default. The operator's judgment IS the moat. Auto-approval is a power-tool the operator can switch on once she trusts the scoring calibration.

---

## §9 — Cadence and runtime behaviour

### How often does each bee run?

```
Bee 1 (Demand Hunter)
  - Per-source cadence (varies, see source registry config)
  - Most sources: weekly
  - Bing AI Performance: daily
  - YouTube refresh on tracked topics: weekly
  - Manual "Run now": triggered by operator from queen panel

Bee 2 (Demand Scorer)
  - Triggered by Bee 1 producing new candidates
  - Also fires on schedule (weekly) to re-score existing candidates
    that haven't yet been routed to a handoff (in case scores
    change with new history)

Bee 3 (Site Auditor)
  - Triggered by Bee 2 producing scored candidates
  - Fires immediately after scoring

Bee 4 (Handoff Composer)
  - Triggered by Bee 3 producing a BUILD_NEW or PANELBEAT decision
  - Composes and writes the handoff
```

### Estimated cost per hive per month

```
Gemini API (Bee 1, Routine B): ~$5
ChatGPT API (Bee 1, Routine C): ~$8
Perplexity API (Bee 1, Routine D): ~$5
YouTube Data API (Bee 1, Routine E): $0 (free quota sufficient)
StackExchange API (Bee 1, Routine F): $0 (free)
LLM calls for scoring (Bee 2): ~$3
LLM calls for composing (Bee 4): ~$1
Embeddings (Bee 3): ~$0.05

TOTAL: ~$22/month per hive
```

Very cheap relative to the value delivered (one approved build can be a $147 product generating ongoing revenue).

### What if operator is asleep / unavailable?

Handoffs sit in PENDING state. Production Queen does not pick them up until APPROVED. No work is wasted; the queen just waits.

The Strategic Queen continues scanning regardless of operator availability. If 30 candidates pile up while operator is on holiday, all 30 are there to triage on return.

---

## §10 — Apiary Strategic Queen (brief note, full design deferred)

The Apiary Strategic Queen has the same role shape (scan, score, route) but at a different scope:

- **Scope:** New NICHES, not new topics within a niche.
- **Sources:** Same source list, but with much broader prompt sets ("What entire categories of regulated information have rising AI citation demand?").
- **Routing:** Instead of BUILD_NEW / PANELBEAT, her decisions are CLONE_NEW_HIVE / EXPAND_EXISTING_HIVE / IGNORE.
- **Handoff:** Goes to the operator via Apiary dashboard, NOT to any Production Queen.

Her bees are conceptually similar but with one extra step: niche viability scoring (market size, regulatory stability, pricing potential — different dimensions from per-topic scoring).

Full design deferred to its own session.

---

## §11 — How this maps to the locked principles

Let me check this design against the seven constitutional principles from the architecture document:

| Principle | Strategic Queen design honors it? |
|---|---|
| 1. Whoever made it owns it | ✓ Strategic Queen produces handoffs and owns the demand-detection recipe. Doesn't touch products. |
| 2. Each queen self-monitors via pings | Partially. Demand Hunter IS the continuous scan — that's her "ping" equivalent. She doesn't ping her own handoffs (those become Production Queen's responsibility once approved). ✓ |
| 3. Flat hive, no AI middle-management | ✓ Strategic Queen reports to operator, not to any Empress. |
| 4. TrustMRR pub test | ✓ Standalone product analog confirmed: AEO Engine $52k, IdeaProof, Niches Hunter, Trend Seeker. |
| 5. Per-hive isolation, federated visibility | ✓ All Strategic Queen tables are per-hive. Handoffs feed into hive_metrics, summary federates to Apiary. |
| 6. Domain expertise in-hive, methodology cross-hive | ✓ Source prompts and scoring weights are per-hive config (domain-specific). Scoring rubric structure is generic (methodology, propagated via Vanilla). |
| 7. Design backwards from outcome | ✓ This entire document started from the handoff schema and worked backwards. |

All seven preserved. Strategic Queen design is architecturally clean.

---

## §12 — What to criticize

Honest list of design points where I'm least confident or where there's real debate:

1. **Bee 4 vs merge into Bee 3.** I separated Handoff Composer from Site Auditor. Could be combined. Open to argument.

2. **personalisation_potential scoring via LLM judgment.** Noisy. Alternatives: heuristic rules (if "calculator" or "checker" pattern fits the question, score high; if "what is X" pattern, score low), or per-hive customization. The LLM approach is most flexible but least deterministic.

3. **Auto-approve thresholds being off by default.** I picked that. Argument the other way: at 20 hives, operator can't review every handoff. Better to start with conservative auto-approve enabled for very high scores. Debatable; depends on your appetite.

4. **Bing AI Performance dashboard read mechanism.** No API. Options: (a) manual export, (b) authenticated scrape of your own dashboard, (c) wait for Microsoft to ship an API. I sketched it as "manual or scrape" but it's the weakest part of the source strategy. **This deserves its own design micro-session.**

5. **Source list completeness.** I listed Bing/Gemini/ChatGPT/Perplexity/YouTube/StackExchange. Quora was mentioned earlier in the architecture doc but I dropped it from the routine list because Quora scraping is fragile. **Should Quora be a routine?** I lean no, but it's a real call.

6. **Cost estimate (~$22/month per hive).** Probably accurate at low volume. Could escalate to ~$60-80/month if you broaden prompt sets aggressively. Operator should set the budget cap explicitly.

7. **The site auditor's embedding-similarity threshold (0.85 hard match, 0.70 soft match).** Picked from instinct; needs calibration against your actual product set. The first few weeks of operation may surface that 0.85 is too tight or too loose.

8. **Panelbeat triggers.** The three triggers (new authority cited, stale + rising velocity, fan-out drift) are good defaults but might miss real cases. **Worth a sanity-check against the FRCGW product specifically** — would these triggers have caught the right panelbeats over the past 6 months?

9. **Handoff schema completeness.** I included ~25 fields. Some might be redundant; some might be missing. Specifically: do we need a `tags` / `category` field for filtering in the dashboard? Do we need a `related_handoffs[]` to link panelbeats that depend on each other?

10. **The "IGNORE" log is real but unspecified.** Where does it live? How does the operator review what's been ignored? Probably belongs in the Strategic Queen panel as a separate tab. Defer.

---

## §13 — Migration from existing E1/E2/E3/E4/E7 code

From the architecture document's migration map, several existing bees map to the new Strategic Queen + Production Queen split:

| Existing bee | New home | Notes |
|---|---|---|
| E1 (current Strategic Queen daily scan) | Strategic Queen Bee 1 (Demand Hunter) | Refactor: source list expanded, scoring moved to Bee 2 |
| E2 Market Researcher | Production Queen (Customer Voice Capturer) | Removed from Strategic Queen entirely |
| E2a/E2b (Reddit-related) | Deprecated | Reddit no longer on critical path |
| E2c StackExchange | Production Queen, OR Strategic Queen Bee 1 Routine F | Currently both have a use; resolve in Production Queen design |
| E2e-chatgpt/gemini | Strategic Queen Bee 1 Routines B/C | Refactor |
| E3 Customer Psychologist | Production Queen | Removed |
| E4 Competitor Monitor | Production Queen (Competitor Auditor) | Removed |
| E7 Truth-Sync (ATO RSS) | Production Queen (continuous ping) | Removed |

**Net effect on Strategic Queen:** smaller, sharper. Roughly E1 expanded with multi-source routines + new scoring + new site auditor + new handoff composer. The "make Strategic Queen bigger by absorbing E2/E3/E4/E7" thinking is the OLD architecture. New architecture says Strategic Queen is narrow and deep on demand detection only.

---

## §14 — What's NOT in this design (deferred)

- Concrete database schema (column types, indexes) — needs a separate technical doc
- Bee-level code organization (file structure, function signatures) — implementation detail
- Specific Gemini/ChatGPT prompt wording per source routine — needs operator-curated prompt library
- Bing AI Performance dashboard read mechanism — its own micro-design session
- Apiary Strategic Queen full design — its own design session
- Site Auditor's full panelbeat trigger logic for edge cases (e.g., what if a candidate matches TWO existing products?) — needs walkthrough against real examples
- Reject log dashboard view — UI/UX deferred
- Operator approval batch actions (approve all 9+ score handoffs at once?) — UI feature, deferred
- Handoff archival policy (Governance Queen owns) — deferred
- The shift from current overlay-based topic_universe (in `soverella/overlays/taxchecknow/strategic.json`) to the new handoff-driven flow — migration plan needed

---

## §15 — Sanity-check against the operator's morning

If this design is right, your morning workflow becomes:

1. Open Apiary dashboard → 4 CO·LE indicators per hive → spot anything red/yellow
2. Open Tax Hive Strategic Queen panel → "Approvals Pending" section shows new handoffs
3. For each handoff: read evidence + scores → Approve / Reject / Defer
4. Approved handoffs disappear into Production Queen's pickup queue
5. Move to next queen's panel

For 5 minutes of morning attention, you've directed the entire research → build pipeline for the day. **That's the operator leverage Strategic Queen exists to create.**

If the morning experience feels slower than this — too many handoffs, too much evidence to read, scoring that confuses rather than clarifies — the design needs refinement. Worth re-testing after first week of operation.

---

## §16 — Closing

This design is for critique, not adoption-by-default. Strong cases to challenge:
- Bee 4 separation from Bee 3
- LLM-based scoring noise
- Bing AI Performance read mechanism
- Auto-approve defaults
- Panelbeat trigger completeness
- Handoff schema field set

If a critique point lands, we revise. If it doesn't, we lock the design and move to Production Queen next.

**End of Strategic Queen design.**
