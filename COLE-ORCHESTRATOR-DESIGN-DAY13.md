# COLE Orchestrator — Design (Day 13)

**Status:** First draft for critique. Designed backwards from the locked architecture (COLE-ARCHITECTURE-LOCKED-DAY13.md, Principle 7).
**Scope:** Apiary-level orchestrator (in the Bee Farm). NOT a per-hive queen.
**Method:** Outcome → Output → Bees → Sources.

---

## §1 — The locked outcome

From the architecture document, COLE Orchestrator's role:

> "Cross-hive intelligence + methodology curator."

She has two distinct jobs that overlap in mechanism:

**Job 1 — Cross-hive operational aggregation.** She reads each hive's published summary (from Governance Queen's Summary Publisher) and renders the multi-hive view the operator needs. Total ARR across hives. Total cost. Per-hive health. Comparative performance. Which hive needs operator attention this morning.

**Job 2 — Methodology curation.** She watches what each hive learns (via Adaptive Queens' feedback cards, performance patterns, operator decisions). She classifies learnings as either:
- **Generic** (applies to any hive — propagates to Vanilla template for future hives)
- **Domain-specific** (stays in originating hive, never leaks)

She is **not** a CEO. She does **not** gate handoffs between queens. She does **not** approve anything operationally inside any hive.

She is the **librarian and the cross-hive accountant**, rolled into one.

She owns:
- The cross-hive operator dashboard (the top of the Bee Farm)
- Cross-hive financial reporting (total ARR, cost, profit per hive, ROI comparison)
- Methodology curation (classify learnings, propose Vanilla updates)
- The Vanilla template itself (versioning, diff management)
- Cross-hive pattern detection (when 3+ hives independently learn the same thing, that's a strong signal it's generic)

She does NOT do:
- Any approval gating inside a hive (operator does)
- Any product building (Production owns)
- Any operational alert for a specific hive (that hive's Governance Queen owns)
- Anything that would inject AI judgment into a hive's autonomy

---

## §2 — Inputs and outputs

### Inputs

#### From each hive's Governance Queen
- `global_hive_summaries` table — current snapshot of each hive's CO·LE health + financials + operational state

#### From each hive's Adaptive Queen
- `feedback_cards` (cross-queen pattern findings within a hive)
- `learnings` (insights Adaptive emitted that look like they might be generic)

#### From operator
- Approvals on proposed Vanilla updates
- Manual classification of edge-case learnings
- Vanilla template edits

#### From Apiary Strategic Queen
- Niche opportunity scoring (feeds context for understanding what types of niches exist)

### Outputs

#### Output 1 — Cross-hive operator dashboard (rendered in Bee Farm)

```
┌─────────────────────────────────────────────────────────────┐
│  🐝 APIARY — Cross-hive view                                 │
│                                                               │
│  CO·LE HEALTH (across all hives)                             │
│  CONVERTS  OPERATES  LEARNS  EXECUTES                       │
│   🟢        🟢        🟡       🟢                            │
│                                                               │
│  TOTAL ARR:    $X     (sum across hives)                     │
│  TOTAL COST:   $X     (LLM + infra + ops)                    │
│  PROFIT:       $X     (Y% margin)                            │
│  PROFIT/HIVE:  $X     (mean)                                 │
│  ACTIVE HIVES: 1 (Tax)                                       │
│                                                               │
│  HIVE COMPARISON:                                            │
│  ┌──────────────────────────────────────────┐               │
│  │ Hive         │ MRR    │ Cost  │ Health │               │
│  ├──────────────────────────────────────────┤               │
│  │ Tax          │ $4.2k  │ $283  │  🟢    │               │
│  │ Visa (future)│ -      │ -     │  -     │               │
│  └──────────────────────────────────────────┘               │
│                                                               │
│  PENDING METHODOLOGY UPDATES (Orchestrator)        3 pending │
│  ▸ "5-input calculators outperform 8-input" (from Tax)       │
│      Generic? Strong evidence — promote to Vanilla?          │
│  ▸ "Including grounding queries in FAQ headers boosts        │
│      citation 2.1x" (from Tax)                               │
│      Generic? Yes — promote.                                 │
│  ▸ "Australian foreign residents respond to 'panic' framing  │
│      3x better than 'planning'" (from Tax)                   │
│      Domain-specific — stays in Tax Hive.                    │
│                                                               │
│  VANILLA TEMPLATE                                            │
│  Version: v3.2 (last updated 2 weeks ago)                    │
│  Inherited by: 1 hive                                        │
│  [ View ] [ Edit ] [ Diff vs Tax Hive ]                     │
└─────────────────────────────────────────────────────────────┘
```

#### Output 2 — `methodology_proposals` table

The Orchestrator's surfacing of learnings that might be generic:

```
methodology_proposals
─────────────────────────────

proposal_id          uuid
created_at           timestamp
source_hive          which hive generated the learning
source_adaptive_card reference to feedback_card that surfaced it
learning_statement   human-readable
                     e.g. "Pages with 5-input calculators convert 47%
                           better than 8-input calculators."
classification       proposed: GENERIC | DOMAIN_SPECIFIC | UNCERTAIN
confidence           0.0–1.0
evidence             {
                       data_points: int,
                       cross_hive_corroboration: int,  // 0 if only 1 hive
                       statistical_signal: ...
                     }
proposed_vanilla_update  if GENERIC: the exact change to Vanilla
                         (config change, template change, code change)
approval_status      PENDING | APPROVED | REJECTED | DEFERRED
approved_by          operator id
approved_at          timestamp
applied_at           timestamp (when actually merged into Vanilla)
```

#### Output 3 — Vanilla template updates

When operator approves a methodology proposal:
- Bumps Vanilla version (v3.2 → v3.3)
- Writes the change to Vanilla template files
- Logs the change in `vanilla_changelog`
- Notifies all hives that a Vanilla update is available (they can opt-in to backport)

#### Output 4 — Cross-hive learning index

```
cross_hive_learnings
─────────────────────────

learning_id          uuid
statement            the learning
classification       generic | domain_specific
applies_to           "all" | list of hive names
applies_within       optional: scope qualifier
                     e.g. "all tax-domain hives" or "all AU jurisdiction hives"
in_vanilla_version   if generic, which Vanilla version contains it
source_hive          where first detected
detected_at          timestamp
last_corroborated_at timestamp (when last seen reinforced)
corroboration_count  int (across how many hives/events)
```

This is the institutional memory. Even if a Vanilla update is rejected, the learning is recorded.

#### Output 5 — Cross-hive analytics views

Pre-computed views that the dashboard reads from:
- Revenue trend across hives (week-over-week, MoM)
- Cost per acquired customer by hive
- Most/least profitable hives
- Cost trajectory (rising? stable?)
- New hive ramp-up curves (how fast does a new hive reach profitability)

---

## §3 — The bees that produce these outputs

```
Bee 1: Cross-Hive Aggregator      →  reads global_hive_summaries,
                                      composes the cross-hive view

Bee 2: Learning Classifier        →  reads feedback_cards + Adaptive learnings
                                      across hives, classifies generic vs
                                      domain-specific

Bee 3: Pattern Detector           →  finds learnings that appear in multiple
                                      hives independently — strong signal for
                                      generic

Bee 4: Vanilla Steward            →  manages the Vanilla template: versioning,
                                      change application, diff against active
                                      hives

Bee 5: Cross-Hive Dashboard       →  renders the Apiary's cross-hive view
        Renderer

Bee 6: Methodology Outcome Tracker →  after a Vanilla update is applied to
                                      new hives, tracks whether the predicted
                                      benefit materialized
```

Six bees.

---

## §4 — Bee 1: Cross-Hive Aggregator

### Purpose
Read each hive's published summary. Compose the cross-hive operator view.

### Method

- Reads `global_hive_summaries` (single row per hive, refreshed by each hive's Governance Queen every 5 minutes)
- Aggregates: sum financials, count alerts, compute health rollups
- Composes the data structure the Cross-Hive Dashboard Renderer consumes

### Cross-hive CO·LE rollup logic

For each verb (Converts / Operates / Learns / Executes):
- Most-conservative status across hives (one red = red overall, one yellow + rest green = yellow overall)
- Show aggregate value (sum or mean depending on metric)
- Show trend (rising? declining? mixed?)

Example: if Tax Hive is 🟢 on Operates and Visa Hive is 🟡 (1 alert open), Apiary Operates shows 🟡 with note "1 hive yellow, 1 hive green."

### Cadence

- Refreshes every 30 seconds when operator is viewing the Apiary dashboard
- Background refresh every 5 minutes regardless

### Critique point

The aggregation logic is simple now (1 hive). With 20 hives, the conservative roll-up means a single yellow hive paints the whole Apiary yellow — which could be alarming. **Worth a "summary mode" that shows X/20 green, Y/20 yellow, Z/20 red rather than a single color.** Operator can drill into the yellow ones.

---

## §5 — Bee 2: Learning Classifier

### Purpose
Read learnings emitted by each hive's Adaptive Queen. Classify them as generic, domain-specific, or uncertain.

### Method

#### Input
Adaptive Queens across all hives emit `learnings` records. Examples of what comes in:

- (Tax Hive) "Pages with 5-input calculators convert 47% better than 8-input calculators"
- (Tax Hive) "Australian foreign residents respond to 'panic' framing 3x better"
- (Tax Hive) "Including Bing grounding query phrases in FAQ headers boosts citation 2.1x"
- (Tax Hive) "ATO clearance certificate processing time is 28 days max — this is a hard fact, not a learning"
- (Visa Hive, future) "Customers who use the calculator for 90+ seconds are 3x more likely to convert"

#### Classifier method

Multi-signal classifier:

**Signal 1 — Linguistic check**
LLM call: "Is this learning specific to a particular niche/jurisdiction/customer demographic, or could it apply to any niche?"
- "Australian foreign residents..." → contains domain-specific terms → DOMAIN_SPECIFIC
- "5-input calculators outperform 8-input..." → no domain-specific terms → likely GENERIC
- "Customers who use calculator for 90+ seconds..." → no domain-specific terms → likely GENERIC

**Signal 2 — Cross-hive corroboration (when multiple hives exist)**
If 2+ hives independently emit the same or similar learning, that's strong evidence for GENERIC.
- "5-input calculators convert better" emerges in Tax Hive, Visa Hive, AND Property Hive → confident GENERIC
- "Panic framing works" only emerges in Tax Hive → likely DOMAIN_SPECIFIC unless other hives later corroborate

**Signal 3 — Operator override**
Operator can manually classify ambiguous cases. Operator's classification is final.

#### Output

Writes `methodology_proposals` row with `classification` and `confidence`.

### When the system has only one hive

Only Signal 1 (linguistic) is available. Cross-hive corroboration requires multiple hives. **Implication: confidence is lower for all classifications until COLE has 3+ hives.** This is honest — generic-vs-specific is genuinely harder to know from one data point.

Mitigation: operator can review classifications with appropriate skepticism, defer borderline cases until more evidence accumulates.

---

## §6 — Bee 3: Pattern Detector

### Purpose
Find learnings appearing across multiple hives — even if Adaptive Queens didn't recognize they were the same.

### Method

- Embed every learning statement (Adaptive Queen outputs across all hives)
- Cluster by similarity
- When a cluster contains learnings from 2+ hives → emit a "cross-hive pattern detected" event

Example: Tax Hive emits "5-input calculators perform better than 8-input." Visa Hive emits "Simpler forms convert better than complex ones." Linguistically different; semantically the same pattern. Pattern Detector clusters them and flags this as a strong GENERIC signal.

### Why this is needed

Adaptive Queens in different hives might phrase the same insight differently. Pattern Detector catches the semantic equivalence. Without her, learnings could be marked DOMAIN_SPECIFIC just because they appear in only one hive's vocabulary.

### Cadence

- Triggered when new learnings are emitted
- Also runs weekly as a sweep across all historical learnings

### Cost

- Embedding cost: trivial (~$0.01/month)
- Clustering: in-memory, no API calls
- LLM verification (optional, on borderline clusters): ~$2/month

---

## §7 — Bee 4: Vanilla Steward

### Purpose
Own the Vanilla template. Manage versioning. Apply approved changes. Track diff between Vanilla and active hives.

### What "Vanilla" actually contains

The Vanilla template is a configuration + code blueprint that becomes the starting point for every new hive. It includes:

- **DB schemas** — every table the hive will need
- **Default queens** — base implementations of all six queens with placeholder configs
- **Default bee implementations** — the methods each bee uses
- **Generic methodology** — accumulated learnings classified as generic, embedded as config defaults
- **Hive config template** — with all knobs and their default values
- **UI templates** — the dashboard renderer templates
- **Integration patterns** — how to wire up Bing Webmaster, Google APIs, Stripe, Resend, etc.
- **Persona scaffolding** — the structure of personas (Vanilla doesn't include specific personas; each hive creates its own)

### Vanilla as a versioned artifact

```
Vanilla template repository
├── v3.2 (current)
│   ├── schemas/
│   ├── queens/
│   │   ├── strategic/
│   │   ├── production/
│   │   ├── distribution/
│   │   ├── concierge/
│   │   ├── adaptive/
│   │   └── governance/
│   ├── methodology_constants.yml  (the accumulated generic learnings)
│   ├── hive_config_template.yml
│   └── changelog.md
├── v3.1
├── v3.0
└── ...
```

Each version is immutable. Updates create new versions, not mutate old ones.

### Method — applying a methodology update

When operator approves a `methodology_proposals` row:

1. Vanilla Steward bumps version: v3.2 → v3.3
2. Applies the change to the new version
3. Writes to changelog
4. Notifies active hives: "Vanilla v3.3 available with change X. Want to backport?"
5. Active hives can opt-in to backport (operator gates per hive)
6. New hives cloned from this point inherit v3.3 automatically

### Diff against active hives

For each active hive, Vanilla Steward shows the diff:

```
Tax Hive (cloned from v3.0):
  - Diverged from Vanilla on 2026-04-22 (clone date)
  - 4 generic learnings in current Vanilla NOT yet backported:
    • 5-input calculators outperform 8-input (v3.1)
    • Bing grounding queries in FAQ headers (v3.2)
    • ...
  - 0 hive-specific changes that would conflict with backport
  - [ Preview backport ] [ Apply backport ]
```

This is how hives keep up with methodology improvements over time.

### Critique point

Backporting changes to live hives is risky — could break existing products. **Operator must explicitly approve each hive's backport.** Vanilla Steward never auto-applies to live hives. Only new hive clones inherit automatically.

---

## §8 — Bee 5: Cross-Hive Dashboard Renderer

### Purpose
Render the Apiary's cross-hive view.

### Layout (described earlier in §2 Output 1)

Pulls data from:
- Bee 1 (Cross-Hive Aggregator) for the financial rollup and CO·LE health
- methodology_proposals table for pending approvals
- Vanilla Steward for template state
- Apiary Strategic Queen's handoffs for pending hive opportunities

### Refresh strategy

- Operator-facing: 30-second polling when Apiary view is open
- Critical updates (new methodology proposal, new hive opportunity) push via SSE

### Drill-down

- Click a hive card → switch site selector to that hive's per-hive view (Level 2)
- Click a methodology proposal → detail view with full evidence
- Click "View Vanilla" → Vanilla template explorer
- Click "Clone new hive" → triggers the Clone New Hive workflow (separate design)

---

## §9 — Bee 6: Methodology Outcome Tracker

### Purpose
After a methodology update is applied to a new hive, track whether the predicted benefit actually materialized. Close the learning loop.

### Why this matters

Without Outcome Tracker, the methodology gets locked in based on one hive's data and never validated. With her, you can detect when a "generic" learning was actually domain-specific (the prediction failed in the new hive) and unwind the Vanilla update.

### Method

- For each approved methodology proposal, record the **predicted improvement** (e.g., "47% better conversion on 5-input calculators")
- For new hives that ship products under this methodology, measure the actual improvement
- If actual matches prediction → confirm the learning, no action
- If actual significantly diverges → flag for operator review
- If consistent divergence across multiple new hives → revoke the Vanilla update, re-classify as DOMAIN_SPECIFIC

### Cadence

- Tracks for 60-90 days after a methodology update is applied
- Reports findings to Orchestrator dashboard as "learning corroboration status"

### Output

```
methodology_outcomes
─────────────────────────

outcome_id           uuid
proposal_id          reference to methodology_proposals
predicted_improvement  what was promised (e.g. "47% better conversion")
actual_improvement   what was measured in new hives
hives_measured       which new hives this was tracked in
status               confirmed | divergent | inconclusive
revoke_recommended   bool
```

### Critique point

This bee requires careful design. False negatives (saying "this didn't work" when actually it did, just in a different way) could revoke genuinely good methodology. Worth high threshold for "revoke recommended" status — confirmed divergence across multiple hives + statistical significance.

---

## §10 — Lifecycle orchestration

How the bees fit together:

```
Continuous (always running):
  Bee 1 (Cross-Hive Aggregator) — every 30 seconds when dashboard is viewed
  Bee 5 (Dashboard Renderer)    — on page load + 30s polling
  Bee 6 (Outcome Tracker)       — daily checks on tracked outcomes

Event-triggered:
  When Adaptive Queens emit learnings:
    Bee 2 (Learning Classifier) classifies them
    Bee 3 (Pattern Detector) checks for cross-hive similarity
    Together they produce methodology_proposals

  When operator approves a methodology proposal:
    Bee 4 (Vanilla Steward) applies it, bumps version, notifies hives

  When a new hive is cloned:
    Bee 4 (Vanilla Steward) provides the current Vanilla version
    Bee 6 (Outcome Tracker) registers expected improvements to measure
```

---

## §11 — Hive config dependencies

Orchestrator depends on minimal config. Most logic is generic:

```yaml
# apiary_config.yml — Orchestrator section
orchestrator:
  learning_classifier:
    confidence_threshold_for_auto_classify: 0.85
    require_operator_review_below: 0.85

  pattern_detector:
    similarity_threshold_for_cluster: 0.80
    min_hives_for_strong_signal: 2

  vanilla_steward:
    version_format: "v{major}.{minor}"
    auto_apply_to_new_clones: true
    auto_apply_to_existing_hives: false  # always operator-gated

  outcome_tracker:
    tracking_window_days: 60
    revoke_threshold:
      divergent_hive_count: 3
      statistical_p_value: 0.05

  dashboard:
    refresh_seconds: 30
```

---

## §12 — Cost estimate

```
Orchestrator operational cost:
  Bee 2 (LLM classification): ~$5/month per hive of learnings
  Bee 3 (embeddings + clustering): ~$1/month
  Bee 6 (outcome tracking): ~$0 (reads existing data)
  Everything else: ~$0

TOTAL: ~$5-10/month + scaling with number of hives
```

At 20 hives, expect ~$50-100/month. Still cheap.

---

## §13 — How this maps to the locked principles

| Principle | Honored? |
|---|---|
| 1. Whoever made it owns it | ✓ Orchestrator owns methodology curation + Vanilla + cross-hive dashboard. Doesn't reach into hive internals. |
| 2. Each queen self-monitors via pings | Partially — she runs continuous classification and pattern detection rather than ping cycles. Her "ping" equivalent is the cross-hive scan. ✓ |
| 3. Flat hive, no AI middle-management | ✓ Critically — Orchestrator does NOT gate handoffs in any hive. She only proposes methodology updates; operator approves. She is library, not CEO. |
| 4. TrustMRR pub test | ✓ Cross-domain methodology + multi-tenant analytics is a real category. Notion AI, multi-tenant SaaS analytics tools (Mixpanel for org-level views), methodology-as-a-service products. |
| 5. Per-hive isolation, federated visibility | ✓ Reads federated summaries, never reaches into hive internals. Writes only to Apiary-level tables. |
| 6. Domain expertise in-hive, methodology cross-hive | ✓ This is literally her core job — classify and propagate generic methodology, protect domain expertise. |
| 7. Design backwards from outcome | ✓ Started from "what does the operator need at Apiary level" → bees fall out. |

---

## §14 — Critique points

1. **Bee 2 (Learning Classifier) is heavily LLM-dependent.** Same noise risks as elsewhere. Mitigations: multiple calls, operator review below confidence threshold, pattern detector as secondary signal.

2. **With only 1 hive (current state), most Orchestrator value is latent.** Cross-hive aggregation is a 1-row report. Pattern detection needs 2+ hives. Outcome tracking needs new clones. **Phase 0 Orchestrator is mostly placeholder waiting for hive #2.** Worth being honest about this — most of her value materializes at 3+ hives.

3. **Vanilla Steward's backport mechanic is complex.** Applying changes to live hives without breaking them is genuinely hard. Recommendation: **don't backport live hives in Phase 1.** New hives inherit current Vanilla; existing hives stay on their cloned version. Backport becomes a future feature.

4. **Methodology proposals could pile up without operator review.** At 20 hives, dozens per month. Need triage UI (sort by confidence, by predicted impact). Worth designing the operator review flow more carefully.

5. **The line between "generic" and "domain-specific" is fuzzy in practice.** Some learnings are "generic within tax-adjacent domains" or "generic within AU jurisdiction." Worth supporting scoped generic classification, not just binary.

6. **Outcome Tracker depends on multiple hives implementing the same methodology to measure.** Realistically, this means Orchestrator confirms learnings only when COLE has 3+ hives. Until then, methodology updates are operator-trust-based.

7. **Vanilla version proliferation could be messy.** If you ship v3.3, v3.4, v3.5 every week, existing hives fall behind quickly. Worth batching updates (e.g., monthly Vanilla releases rather than per-change releases).

8. **The relationship between Orchestrator and Apiary Strategic Queen needs clarification.** Apiary Strategic reads cross-hive learnings from Orchestrator (as one signal source for niche detection). Orchestrator reads Apiary Strategic's outputs to understand which niches are being scouted. The interaction is bidirectional but lightweight — they each have distinct roles.

9. **Dashboard rollup logic (one yellow → all yellow) doesn't scale.** Needs per-status counts at scale.

10. **Vanilla template format is loosely specified.** "DB schemas + queens + bees + config" is a list, not a spec. **A dedicated Vanilla template design document is worth doing separately** — what file structure, what gets parameterized, what's version-controlled.

---

## §15 — Phase implementation roadmap

**Phase 0 (current — 1 hive):**
- Bee 1 (Aggregator): trivial — one hive's data passed through
- Bee 5 (Dashboard): minimal cross-hive view, mostly placeholder
- All other bees: registered but dormant (no signal to process)

**Phase 1 (with hive #2, e.g., Visa or Property launched):**
- Bee 2 (Classifier) becomes useful (can begin classifying learnings)
- Bee 3 (Pattern Detector) becomes useful (can detect cross-hive patterns)
- Bee 4 (Vanilla Steward) ships first methodology updates
- Aggregator and Dashboard show real cross-hive comparison

**Phase 2 (3+ hives):**
- Bee 6 (Outcome Tracker) becomes meaningful
- Pattern detection has enough signal to be reliable
- Vanilla version cadence stabilizes

**Phase 3+ (10+ hives):**
- Cross-hive financial analytics deepen
- Hive prioritization analysis ("which hive to invest in next")
- Cross-hive learnings library becomes substantial

---

## §16 — Migration map

| Existing element | New home |
|---|---|
| (No existing Orchestrator construct) | Net new |
| Operator's manual mental model of what works across products | Replaced by methodology_proposals + Vanilla |
| Operator's manual cross-hive rollup (when there's >1 hive) | Replaced by Apiary dashboard |

Net new build, but **most of the value lands in Phase 1-2.** Phase 0 build is minimal scaffolding.

---

## §17 — Sanity check against the operator's monthly review

If this design is right, monthly Apiary work:

1. Open Bee Farm Apiary view
2. Glance at cross-hive CO·LE health and financials — is the portfolio healthy?
3. Review pending methodology proposals — approve generics, reject domain-specifics
4. Check Apiary Strategic Queen's pending hive opportunities — discussed earlier
5. Skim Vanilla diff vs active hives — anything worth backporting?
6. (Quarterly) Review outcome tracker — are approved methodologies actually working?

**This is monthly strategic-investment work.** The day-to-day operations live in per-hive views.

---

## §18 — Closing

The Orchestrator is the queen that makes COLE compound across hives. Without her, each hive learns alone and starts each new hive from scratch. With her, every new hive starts smarter than the last, methodology accumulates as a defensible asset, and the operator sees the whole business as one portfolio rather than N separate businesses.

She is the **glue between hives**. She is the **memory of the whole system**. She is **the institution behind COLE**.

**End of COLE Orchestrator design.**
