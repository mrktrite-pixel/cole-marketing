# Adaptive Queen — Design (Day 13)

**Status:** First draft for critique. Designed backwards from the locked architecture (COLE-ARCHITECTURE-LOCKED-DAY13.md, Principle 7).
**Scope:** Per-hive Adaptive Queen.
**Method:** Outcome → Output → Bees → Sources.

---

## §1 — The locked outcome

From the architecture document, Adaptive Queen's one-line job:

> "What's working, what's not, why, and what should change?"

She is the **editor / teacher who marks the work**. She produces NO customer-facing content. She produces only feedback cards routed to the queen who can act on them.

Her function is `Learns` in the CO·LE acronym (per-hive). She reads metrics across all the other queens' outputs, looks for patterns, diagnoses why something worked or failed, and recommends specific fixes routed to the responsible queen.

She owns:
- Cross-queen pattern detection (only she sees across queens)
- Performance diagnosis (when X drops, why?)
- Feedback card production (routed back to Production, Distribution, Concierge, or Strategic)
- Metric baseline tracking (so she knows what "normal" looks like)
- Anomaly detection (deviations from baseline)
- User-input distribution analysis (the calculator-input research signal we flagged as the differentiator)

She does NOT do:
- Primary metric collection (each queen pings her own outputs — Adaptive READS the shared metrics table)
- Customer-facing content (no queen except Production writes that)
- Direct execution of fixes (she recommends; responsible queen acts)
- Infrastructure/cost monitoring (Governance Queen owns)
- Cross-hive learning (Orchestrator owns)

---

## §2 — Inputs and outputs

### Input 1: the shared hive metrics table

From the architecture document, each queen writes to a per-hive metrics table. Adaptive Queen reads from this table. Schema (recap from architecture doc):

```
hive_metrics (per hive, e.g. tax_hive_metrics)
─────────────────────────────────────────

metric_id              uuid
recorded_at            timestamp
queen                  strategic | production | distribution |
                       concierge | governance
asset_id               reference to the queen's asset (product, publication,
                       message, handoff, etc.)
metric_type            see catalogue below
value                  numeric
metadata               jsonb for context (segment, channel, etc.)
```

### Input 2: source tables (per queen)

She also reads from each queen's own tables to enrich context:
- `strategic_queen_handoffs` — what got built, what was rejected
- `products` — for product attribute joins
- `content_publications` — for asset-level joins
- `concierge_messages` — for message-level joins
- `customer_events` — for behavioral joins
- `customer_state` — for cohort joins

She does NOT WRITE to any of these tables. Read-only.

### Input 3: user-input distributions (the COLE differentiator)

When customers use calculators, their inputs are stored. Adaptive Queen reads this anonymized distribution. The flagged COLE differentiator:

```
calculator_inputs (per hive, written by Production Queen's product runtime)
──────────────────────────────────────────────────────────────────────

input_record_id        uuid
product_id             which product
submitted_at           timestamp
customer_id_hash       hashed (privacy-respecting)
inputs                 jsonb — the actual input values
output_tier            the result tier (e.g. "HIGH RISK")
session_id             for funnel analysis
referrer               where the user came from
```

Adaptive Queen aggregates these for patterns.

### Output: feedback cards

Adaptive Queen writes to `feedback_cards`:

```
feedback_cards (per hive)
─────────────────────────────────────────

card_id                uuid
created_at             timestamp
hive                   e.g. "tax"

DIAGNOSIS
  finding              one-sentence summary
                       e.g. "Product au-19-frcgw-clearance-certificate
                             page bounces at 73% on calculator input #4
                             (current best products: 38%)"
  category             "performance_drop" | "performance_anomaly" |
                       "pattern_detected" | "user_input_insight" |
                       "cohort_diverging" | "calibration_drift"
  evidence             jsonb — the data behind the finding
                       (metric values, comparison baselines, time series)
  confidence           0.0–1.0

RECOMMENDATION
  recommendation       free-text: specific action to take
                       e.g. "Production Queen: input #4 (settlement_date)
                             is rejected most often. Re-examine the help_text
                             and consider splitting into two simpler inputs."
  recommended_queen    strategic | production | distribution |
                       concierge | governance
  recommended_action_id null or pointer to a structured action template

PRIORITY
  severity             low | medium | high | critical
  impact_estimate      "$X revenue lost over Y period" or "% engagement drop"

LIFECYCLE
  state                NEW | OPERATOR_REVIEWED | ACCEPTED | REJECTED |
                       IN_PROGRESS | RESOLVED | STALE
  reviewed_by          operator id
  reviewed_at          timestamp
  resolved_at          timestamp
  resolution_notes     what was done
  outcome_after_fix    captured post-fix to verify the diagnosis was right
```

Adaptive Queen routes these to operator dashboard (under Adaptive Queen panel) and notifies the recommended_queen via event.

### Output: metric baselines

She also writes/maintains baselines:

```
metric_baselines (per hive)
─────────────────────────────────────────

baseline_id            uuid
metric_type            e.g. "page_bounce_rate"
scope                  hive | queen | asset_class | specific_asset
scope_id               which scope this baseline applies to
window                 "rolling_30d" | "rolling_90d" | "all_time"
mean                   numeric
median                 numeric
stddev                 numeric
percentiles            {p10, p25, p75, p90}
last_updated           timestamp
```

Used by anomaly detection — "this is a deviation" requires knowing what's normal.

---

## §3 — The bees that produce these outputs

```
Bee 1: Metric Aggregator         →  rolls up raw metrics into time-series
                                    + computes baselines
                                    + maintains aggregation cache

Bee 2: Anomaly Detector          →  detects deviations from baselines
                                    → produces "performance_anomaly" cards

Bee 3: Pattern Synthesizer       →  cross-queen pattern detection
                                    (correlations, cascades, cohort divergence)
                                    → produces "pattern_detected" cards

Bee 4: User-Input Analyzer       →  aggregates calculator inputs across users
                                    surfaces real-world distribution insights
                                    → produces "user_input_insight" cards

Bee 5: Recommendation Composer   →  takes a diagnosis, generates the
                                    specific recommendation + routing

Bee 6: Outcome Tracker           →  after a fix is applied, watches whether
                                    the metric actually moved
                                    → validates Adaptive Queen's diagnoses
                                    + closes loop (RESOLVED state)

Bee 7: Self-Calibration Pinger   →  pings her own diagnoses for accuracy
                                    if recommendations consistently miss,
                                    flags scoring rubric for tuning
```

**Seven bees.** Bees 1, 2, 3, 4 run on schedule (different cadences). Bee 5 fires when 2/3/4 produce findings. Bee 6 fires when feedback_cards transition to IN_PROGRESS or RESOLVED. Bee 7 is meta-monitoring.

---

## §4 — The metric catalogue (what gets read)

Before describing bees, let me catalog what metrics Adaptive Queen reads from each queen. This is the universe she operates on.

### From Strategic Queen
- Handoff approval rate (operator-approved vs rejected)
- Score-calibration accuracy (how often did 9/10 scored topics actually convert?)
- Time-from-handoff-to-production-pickup
- Time-from-pickup-to-product-live

### From Production Queen
- Build duration per product
- Quality Gate pass rate per attempt
- Legal Gate pass rate per attempt
- Bee-level performance (which bee fails most?)
- Product-level metrics (page bounce, calculator completion rate, calculator-to-purchase conversion, time-on-page, exit points)
- Authority ping success rate (Bee H reliability)
- Authority change frequency per source (which sources flap most?)

### From Distribution Queen
- Asset-level metrics per channel (views, likes, comments, shares, CTR to product)
- Channel-level aggregate performance
- Asset-to-product conversion (how many viewers from YouTube actually bought?)
- Newsletter open rate, click rate
- Liveness state (how many assets still live vs 404/removed)

### From Concierge Queen
- Sequence-level performance (each step's open rate, click rate, conversion impact)
- Lifecycle stage transitions (% moving from "active" to "dormant" etc.)
- Inbound message volume and classification distribution
- Refund rate
- Deliverability metrics (bounce, spam, sender rep)
- Unsubscribe rate

### From Governance Queen
- Costs per queen
- Infrastructure health (passed through for context, not Adaptive's concern)
- Job failure rates

### From Customer Events (the firehose)
- Visit → free_calculator_used → purchased funnel rates
- Purchase → product_used → review_left funnel rates
- All event volume / velocity over time

### Cross-queen joins (Adaptive's unique capability)
- Strategic handoff score (9.2) → did the resulting product convert? (yes / no, what %)
- Production build hour → does build duration predict product quality?
- Distribution channel → which channel produces highest LTV customers?
- Concierge sequence → does step 3 of sequence A drive more revenue than sequence B?

These cross-queen joins are what only Adaptive Queen can do, because she's the only queen with read access to the full metrics table.

---

## §5 — Bee 1: Metric Aggregator

### Purpose
Roll up raw metrics into time-series. Compute and maintain baselines. Cache aggregations for downstream bees.

### Input
- The hive_metrics table (raw rows)
- Existing metric_baselines

### Output
- Updated metric_baselines
- Aggregation cache (per-metric, per-scope, per-window)

### Method

#### Cadence
- Hourly: rolling 24h aggregations
- Daily: rolling 7d, 30d aggregations
- Weekly: rolling 90d baselines

#### Per metric_type, per scope

For each metric type and scope (hive-wide, per-queen, per-asset-class, per-specific-asset), Bee 1:
1. Query raw rows in the rolling window
2. Compute mean, median, stddev, percentiles
3. Compare new aggregate to previous baseline
4. If new aggregate within previous baseline +/- threshold → update slowly (smoothed average)
5. If new aggregate far from previous → mark as potentially anomalous (Bee 2 will look)

#### Sufficiency checks

Some metrics need volume before they're trustable:
- < 30 events → baseline marked "insufficient_data"
- 30-100 events → "low_confidence_baseline"
- 100+ events → "stable_baseline"

Bees 2/3 respect these confidence flags.

### Edge cases

- **New hive, no history** — baselines start at "insufficient_data". Adaptive Queen can't detect anomalies until baselines stabilize (typically 30-90 days). During this period, she only surfaces pattern findings, not anomaly findings.
- **Seasonal patterns** (e.g., tax season Jan-April) — long-term baselines need seasonal decomposition. Phase 1 feature; Phase 0 uses naive baselines and warns about seasonal-effect noise.
- **One-time spikes** (a viral moment, a news cycle) — Bee 1 normalizes against these by computing trimmed means (exclude top/bottom 5%).

---

## §6 — Bee 2: Anomaly Detector

### Purpose
For each updated metric, check if the current value is anomalous against baseline.

### Input
- Current aggregations from Bee 1
- Stable baselines (skip insufficient_data scopes)

### Output
- `performance_anomaly` feedback cards for genuine anomalies
- Suppression logs for false positives

### Method

#### Per metric, per scope

Standard statistical anomaly detection:
- If current value > mean + 2σ → high anomaly (positive)
- If current value < mean - 2σ → high anomaly (negative)
- If current value > mean + 3σ → extreme

Also: rate-of-change detection
- If 7-day average dropped >25% vs 30-day average → declining trend
- If 7-day average up >50% vs 30-day average → growing trend (also worth noting)

#### Anomaly classification

```yaml
anomaly_categories:
  performance_drop:        # something getting worse
    severity_high: "value < mean - 2σ AND <50% of baseline"
    severity_medium: "value < mean - 2σ"
    severity_low: "value < mean - 1σ"

  performance_surge:       # something getting better
    severity: medium       # worth noting but not urgent

  unexpected_zero:         # metric went to zero
    severity: high         # often indicates a broken pipeline

  pipeline_stall:          # no data points in expected window
    severity: critical     # something stopped reporting
```

#### Per-anomaly diagnosis stub

Bee 2 doesn't deeply diagnose — that's Bee 3/5's job. Bee 2 produces a stub:

```
{
  category: "performance_drop",
  severity: "high",
  metric: "calculator_completion_rate",
  scope: "product au-19-frcgw-clearance-certificate",
  current_value: 0.31,
  baseline_mean: 0.62,
  baseline_stddev: 0.08,
  detected_at: "2026-05-16T08:00:00Z",
  needs_diagnosis: true
}
```

Bee 5 then composes the full feedback card with recommendation.

### Suppression

Some anomalies are noise:
- Single data point anomaly without continuing pattern → suppress for 48 hours, re-evaluate
- Anomaly during known maintenance window → suppress
- Anomaly resolved by next data point → mark as "transient", don't escalate

Operator can also mark patterns as "expected" — Bee 2 learns to suppress those.

### Edge cases

- **Many simultaneous anomalies** (e.g., authority change cascading across many products) — Bee 2 detects the pattern (multiple products with same authority dropping at same time) and produces ONE high-severity card pointing to the shared cause, not 30 cards.
- **Cyclical patterns** — without seasonal decomposition, Bee 2 may flag weekly cycles as anomalies. Phase 0: operator suppression handles this. Phase 1: add weekly/monthly decomposition.

---

## §7 — Bee 3: Pattern Synthesizer

### Purpose
Cross-queen pattern detection. The thing only Adaptive Queen can do.

### Input
- Bee 1's aggregations across queens
- Source tables for joins

### Output
- `pattern_detected` feedback cards

### Method

#### Categories of patterns

**Cohort divergence:**
- Customers acquired via YouTube convert at 18%, via Newsletter at 32%, via Free Calculator at 8%
- Pattern card: "Newsletter cohorts convert 4x better than free-calc cohorts; consider weighting newsletter acquisition"
- Routes to: Strategic Queen (acquisition prioritization)

**Calibration drift (Strategic Queen's scoring):**
- Topics scored 8-10 by Strategic Queen historically converted at 22%
- Recent topics scored 8-10 converting at 12%
- Pattern: Strategic Queen's scoring has drifted; rubric needs recalibration
- Routes to: Strategic Queen + operator

**Cascade pattern (authority changes):**
- ATO published an update → 3 products affected
- Of those, the 2 panelbeated within 7 days kept citation share; the 1 not yet panelbeated lost 60% citation share
- Pattern: panelbeat-speed materially affects citation retention
- Routes to: operator (consider auto-prioritization of authority-driven panelbeats)

**Calculator funnel pattern:**
- 12 products have calculators with 7 inputs
- 8 products have calculators with 5 inputs
- 5-input products convert at 24%; 7-input at 11%
- Pattern: stronger evidence for 5-input cap
- Routes to: Production Queen + Vanilla template (Orchestrator picks this up as cross-hive learning)

**Channel attribution:**
- YouTube videos with timestamps drive 3.1x more product conversions than untimestamped
- Pattern: timestamp-mandate for Distribution Queen
- Routes to: Distribution Queen + Vanilla template

**Persona effectiveness:**
- Gary-voiced products convert at 19% on AU
- Priya-voiced products convert at 26% on UK
- Pattern: persona-jurisdiction fit
- Routes to: Production Queen (persona selection guidance)

**Refund cluster:**
- 5 refunds in 30 days for product X (above baseline of 2/quarter)
- Refund reasons cluster around "calculator gave wrong number"
- Pattern: calculator logic issue
- Routes to: Production Queen + operator

#### Pattern detection algorithm

For each metric pair (e.g., acquisition_source × conversion_rate):
1. Group by dimension
2. Test for statistically meaningful divergence (chi-square or simple ratio test)
3. If divergence is large AND volume sufficient → produce pattern card

Cadence: weekly run, plus on-demand when operator asks "what's happening with X?"

### Edge cases

- **Spurious correlations** — at high cardinality (many metrics × many dimensions), random correlations appear. Mitigate: require correlation persistence across 2+ weeks before card emission.
- **Operator already knows the pattern** — once a pattern is flagged and resolved/dismissed, suppress repeat findings for 90 days unless evidence dramatically intensifies.

---

## §8 — Bee 4: User-Input Analyzer

### Purpose
The COLE differentiator. Aggregate real-world calculator inputs to surface insights nobody else has.

### Input
- `calculator_inputs` table (anonymized inputs from users)
- Product metadata (which calculator, what inputs mean)

### Output
- `user_input_insight` feedback cards

### Method

#### For each product with sufficient input volume (>100 submissions)

Compute distributions:
- Per input field: histogram of values
- Per output tier: % of users hitting each tier
- Per input combination: which combinations are most common
- Per cohort (by acquisition channel, jurisdiction, etc.)

#### Surface insights

**Distribution insights:**
- "73% of FRCGW users have NOT lodged a tax return in 2+ years (vs 12% in general population)"
- This is content gold. Routes to: Distribution Queen ("publish this stat — it's citation-worthy")

**Mismatch insights:**
- "Calculator's input #3 is set to default for 91% of users (they don't change it)"
- Pattern: input may not be useful OR users don't understand it
- Routes to: Production Queen (consider removing or simplifying input)

**Tier distribution:**
- "Output tier MEDIUM RISK is rare (3% of users); LOW and HIGH dominate"
- Pattern: scoring rubric may be bimodal; MEDIUM tier might not be useful
- Routes to: Production Queen (consider 2-tier output)

**Demand validation:**
- Strategic Queen scored topic 9/10 based on AI engine signal
- After 6 months, calculator inputs show users actually do have the predicted situation
- Pattern: Strategic Queen's signal correlates with real demand
- Routes to: Strategic Queen (calibration confirmation)

#### Privacy

All input data is anonymized at capture (customer_id_hash, not customer_id). No re-identification. Aggregate-only insights. Operator should never see individual user inputs in feedback cards.

### Edge cases

- **Low volume products** — insufficient_data flag; revisit when volume reaches threshold.
- **Sensitive inputs** (e.g., income, tax bracket) — extra-privacy handling. Aggregate by bucket, not exact value.
- **Inputs that change distribution suddenly** (regulatory change shifted who's using it) — flag as anomaly via Bee 2 as well.

---

## §9 — Bee 5: Recommendation Composer

### Purpose
Take a diagnosis stub from Bee 2/3/4. Produce a complete, actionable feedback card with specific recommendation routed to the right queen.

### Input
- A diagnosis stub from upstream bee

### Output
- A complete `feedback_cards` row, state = NEW

### Method

For each diagnosis, LLM-assisted composition:

```
Prompt:
> "Given this diagnosis: '{diagnosis}'.
> Evidence: '{evidence}'.
> Scope: '{scope}' (a specific product, asset, sequence, etc.).
>
> Produce:
> 1. A clear one-sentence finding ('finding' field)
> 2. A specific actionable recommendation, naming the queen who can act
>    ('recommendation' + 'recommended_queen' fields)
> 3. An impact estimate in concrete units (revenue, %, count)
> 4. A severity level (low/medium/high/critical) based on
>    impact magnitude and time-sensitivity
>
> The recommendation must be:
> - Specific (name the asset, the change, the test)
> - Action-able by the recommended queen alone (no cross-queen orchestration)
> - Falsifiable (the recipient should be able to act and verify outcome)
>
> Return JSON."
```

Costs: ~$0.01 per recommendation. Cheap.

#### Recommendation templates per queen

To enforce consistency, Bee 5 uses templates per recommended_queen:

```yaml
recommendation_templates:
  to_production:
    examples:
      - "Production Queen: rebuild section {section} of product {product_id}
         because {reason}. Specific change: {change}."
      - "Production Queen: investigate calculator input #{input_n} of
         product {product_id} — completion drops at this step. Consider
         {hypothesis}."

  to_distribution:
    examples:
      - "Distribution Queen: refresh asset {asset_id} on {channel} because
         {reason}. Specific change: {change}."
      - "Distribution Queen: timestamped YouTube videos in this hive
         convert at {x}x rate. Mandate timestamps for all new videos."

  to_concierge:
    examples:
      - "Concierge Queen: sequence step {step_id} has open rate {x}%
         (vs {y}% benchmark). Consider {hypothesis}."
      - "Concierge Queen: refund cluster detected for product {p}.
         Investigate refund reasons and feedback to Production Queen."

  to_strategic:
    examples:
      - "Strategic Queen: scoring calibration drift — recent 9/10
         topics converted at {x}% (historical {y}%). Recalibrate weights."
      - "Strategic Queen: acquisition channel {c} produces {x}x LTV.
         Consider prioritizing topics likely to be discovered via {c}."

  to_operator:
    examples:
      - "Operator review: cross-cutting issue affecting multiple queens.
         {description}. Suggested action: {action}."
```

#### Severity scoring

```
revenue_impact > $5,000/month   → critical
revenue_impact > $1,000/month   → high
revenue_impact > $200/month     → medium
revenue_impact <= $200/month    → low

time_sensitive (e.g. broken funnel) → bump severity by 1
ambiguous_evidence              → drop severity by 1
```

Operator sees severity-ranked feedback cards. Critical at top.

### Edge cases

- **Diagnosis is ambiguous** — Bee 5 produces a card with the recommendation "investigate" rather than a specific change. Lower confidence flag set.
- **Multiple recommendations from same diagnosis** — produce multiple cards, link them via `related_card_ids`.
- **Recommendation crosses queens** (e.g., revision needed in Production AND Distribution) — produce two cards (one to each), reference each other; document the coupling.

---

## §10 — Bee 6: Outcome Tracker

### Purpose
After a feedback card is acted on, watch whether the metric actually moved. Validates Adaptive Queen's diagnoses; closes the loop.

### Input
- Feedback cards in state IN_PROGRESS or RESOLVED
- The metric that triggered the diagnosis

### Output
- Updated state on feedback cards (RESOLVED with outcome captured)
- Self-calibration signals for Bee 7

### Method

When a card transitions to IN_PROGRESS (queen is acting):
1. Capture pre-fix baseline of the original metric
2. Set monitoring window (typically 14-30 days post-action)

After monitoring window:
1. Compare current metric to pre-fix baseline
2. Classify outcome:
   - **Validated**: metric moved as predicted; diagnosis was correct
   - **Partial**: metric moved but less than predicted
   - **No change**: metric unchanged; diagnosis may have been wrong
   - **Reversed**: metric got worse; diagnosis was wrong or fix had side effects
3. Update card state to RESOLVED, capture `outcome_after_fix`

This data feeds Bee 7 to self-calibrate.

### Edge cases

- **External event during monitoring window** (e.g., news cycle) — note in outcome, flag for manual interpretation.
- **Recommended queen never acted** — card stale, transitions to STALE state after 60 days, optionally re-emitted with higher severity.
- **Multiple fixes during monitoring** — can't attribute cleanly; mark as "compounded" and skip attribution.

---

## §11 — Bee 7: Self-Calibration Pinger

### Purpose
Adaptive Queen's self-monitoring. If her diagnoses are consistently wrong, flag herself for tuning.

### Input
- All RESOLVED feedback cards' outcomes
- Bee 6's classifications

### Output
- Self-calibration cards routed to operator
- Internal rubric updates (with operator approval)

### Method

Cadence: monthly.

Pull last 90 days of RESOLVED cards. Compute:
- Validation rate per category
- Validation rate per recommended queen
- Validation rate per severity level

If validation_rate < 60% for any category → self-card:
> "Adaptive Queen: in last 90 days, '{category}' diagnoses validated at {x}% (target 70%+). Possible causes: noisy metric, weak detection threshold, recommendation specificity too low. Operator: review rubric for this category."

If validation rate is consistently very high (>90%) → also flag:
> "Adaptive Queen: '{category}' diagnoses validating at 92%+. May be over-cautious. Consider lowering detection threshold to catch more."

### Edge cases

- **Few resolved cards in window** — insufficient data; skip cycle.
- **Operator disagrees with Bee 6's classification** — operator can manually re-classify; Bee 7 uses the corrected data.

---

## §12 — Lifecycle orchestration

### Continuous loops

**Bee 1 (Metric Aggregator):**
- Hourly: rolling 24h aggregations
- Daily: rolling 7d, 30d, baseline updates
- Weekly: 90d baselines

**Bee 2 (Anomaly Detector):**
- Daily: check all stable-baseline metrics for anomalies
- On-demand: operator asks "anything unusual with X?"

**Bee 3 (Pattern Synthesizer):**
- Weekly: full cross-queen pattern scan
- On-demand: operator asks "why did X happen?"

**Bee 4 (User-Input Analyzer):**
- Weekly: scan all products with sufficient volume
- On product launch + every 30 days: deep dive into that product's inputs

**Bee 5 (Recommendation Composer):**
- Event-driven: fires when 2/3/4 produce diagnosis stubs

**Bee 6 (Outcome Tracker):**
- Continuous: watches IN_PROGRESS cards
- Daily evaluation cycle for cards approaching monitoring window end

**Bee 7 (Self-Calibration):**
- Monthly

---

## §13 — Hive config dependencies

```yaml
adaptive_config:
  baselines:
    update_cadence:
      hourly: ["24h_aggregations"]
      daily: ["7d_aggregations", "30d_aggregations"]
      weekly: ["90d_aggregations"]
    sufficiency_thresholds:
      insufficient: "< 30 events"
      low_confidence: "30-100 events"
      stable: "100+ events"

  anomaly_thresholds:
    drop_severity_high: "2σ AND <50% of baseline"
    drop_severity_medium: "2σ"
    drop_severity_low: "1σ"

  pattern_detection:
    min_persistence_weeks: 2
    cross_queen_pattern_cadence: "weekly"

  user_input_volume_threshold: 100  # min submissions before analysis

  feedback_routing:
    default_severity_to_show: ["high", "critical"]
    auto_dismiss_low_after_days: 14
    stale_threshold_days: 60

  self_calibration:
    validation_rate_target: 0.70
    monthly_review: true
```

---

## §14 — Cost estimate

Adaptive Queen is mostly aggregation queries (cheap) + occasional LLM calls.

```
Bee 1 (Metric Aggregator):          ~$0  (pure SQL/aggregation)
Bee 2 (Anomaly Detector):           ~$0  (statistical, no LLM)
Bee 3 (Pattern Synthesizer):        ~$2/month (occasional LLM-assisted)
Bee 4 (User-Input Analyzer):        ~$1/month (LLM summarizes
                                              distribution insights)
Bee 5 (Recommendation Composer):    ~$3/month (LLM per recommendation;
                                              maybe 20-50 cards/month)
Bee 6 (Outcome Tracker):            ~$0
Bee 7 (Self-Calibration):           ~$0.50/month

──────────────────────────────────────
TOTAL:                              ~$6-7/month per hive
```

Cheapest queen to run. The cost is mostly in storage (large metric tables) and query time (aggregations), which are infrastructure concerns (Governance Queen's domain).

---

## §15 — How this maps to the locked principles

| Principle | Adaptive Queen design honors it? |
|---|---|
| 1. Whoever made it owns it | ✓ Adaptive Queen produces feedback cards → owns the cards. Doesn't modify other queens' outputs (read-only on those). |
| 2. Each queen self-monitors via pings | ✓ Bee 7 (Self-Calibration) is Adaptive's self-monitoring. Pings her own diagnoses for accuracy. |
| 3. Flat hive, no AI middle-management | ✓ Adaptive recommends, doesn't direct. Recommended queen decides to act. |
| 4. TrustMRR pub test | ✓ Cometly $207k MRR is the standalone analog. |
| 5. Per-hive isolation | ✓ All Adaptive tables are per-hive. Reads from this hive's tables only. |
| 6. Domain in-hive, methodology cross-hive | ✓ Hive-specific: thresholds, category definitions. Generic: bee architecture, anomaly detection rubrics, pattern templates. |
| 7. Design backwards from outcome | ✓ Designed from feedback_cards schema backwards. |

---

## §16 — Critique points

1. **Bee count (7) is on the high end.** Could collapse: Bee 2 (Anomaly Detector) and Bee 3 (Pattern Synthesizer) into one "Detector". I kept them separate because anomaly detection is single-metric-statistical and pattern detection is cross-metric-correlational — different methods. Open to merging if you want fewer bees.

2. **Statistical anomaly thresholds (2σ, 3σ).** These are conventional but may be too noisy. Real-world data has fat tails. Possible refinement: use IQR-based detection or robust statistics. Calibrate after Bee 7 reports validation rates.

3. **Pattern detection is mostly hand-coded category recipes.** I sketched 6 pattern categories (cohort divergence, calibration drift, etc.). Real implementation may need more. Risk: missing patterns we haven't named. Mitigation: operator can add new pattern templates over time.

4. **LLM cost in Bee 5 (~$3/month).** Could be lower if templated tighter, higher if recommendations get more elaborate. Operator decides verbosity tradeoff.

5. **User-input analysis is the differentiator but also the most exposed to privacy concerns.** Need explicit privacy policy disclosure that aggregated inputs are analyzed. Hashing alone isn't enough if linkage attacks are possible. Phase 1: add proper differential privacy if any aggregated data is published externally.

6. **Outcome attribution (Bee 6).** Real-world attribution is hard. A metric improvement after a fix could be coincidence, seasonality, or co-occurring change. Bee 6 marks "compounded" but the validation rate Bee 7 reads will be noisy. Worth acknowledging.

7. **Cross-queen routing of feedback cards.** Some recommendations affect multiple queens. Currently I split into separate cards with `related_card_ids`. Could instead emit one card routed to operator with cross-queen action plan. KISS-debatable.

8. **Stale card handling.** Cards that sit unaddressed for 60 days transition to STALE. Some operators may simply triage less aggressively. Configurable; default is conservative.

9. **"Performance surge" is not actionable in the same way.** When something goes UP unexpectedly, what's the recommendation? Often: "investigate why so we can replicate." This is weaker than the drop case but still valuable. Worth distinct treatment.

10. **The data warehouse implication.** Adaptive Queen reads heavily. The hive_metrics table will grow large. Governance Queen owns table size; Adaptive Queen's queries need to be efficient. Performance/cost concern at scale.

---

## §17 — Sanity check against the operator's morning

Adaptive Queen's morning surface:

1. **New high/critical feedback cards** awaiting operator review
2. **Cards approaching stale** (recipient queen hasn't acted)
3. **Recently resolved cards' outcomes** (did the fix work?)
4. **Pattern findings** (weekly digest)
5. **Self-calibration alerts** (rare; flags Adaptive's own rubric drift)

Operator time per day: 5-15 minutes reviewing cards and outcomes.

Adaptive Queen is *enabling* — she doesn't drive operator workload up; she focuses attention on what matters by filtering signal from noise.

---

## §18 — Closing

This design is for critique. Strongest points to challenge:

- 7 bees — could collapse Bee 2/3?
- Statistical anomaly thresholds (2σ too sensitive?)
- Pattern category list — what's missing?
- User-input privacy depth (sufficient?)
- Performance attribution noise (Bee 6 reliability)

If critique lands, revise. If not, lock and move to Governance Queen next.

**End of Adaptive Queen design.**
