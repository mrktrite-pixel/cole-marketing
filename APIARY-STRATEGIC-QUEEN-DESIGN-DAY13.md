# Apiary Strategic Queen — Design (Day 13)

**Status:** First draft for critique. Designed backwards from the locked architecture (COLE-ARCHITECTURE-LOCKED-DAY13.md, Principle 7).
**Scope:** Apiary-level Strategic Queen (in the Bee Farm). NOT a per-hive queen.
**Method:** Outcome → Output → Bees → Sources. Same shape as per-hive Strategic Queen, scoped one level up.

---

## §1 — The locked outcome

From the architecture document, Apiary Strategic Queen's one-line job:

> "What new niche should COLE add as a hive?"

She is the **cross-niche scout**. While per-hive Strategic Queens scan for topics within their assigned domain (Tax Hive Strategic looks for new tax topics; Visa Hive Strategic looks for new visa topics), the Apiary Strategic Queen looks **across all of regulated/professional information for entirely new domains COLE should expand into.**

She operates one level above any hive. Her output isn't "build a product" — it's "build a hive."

She owns:
- Continuous cross-niche scanning for citation gap patterns
- Niche-level demand detection (vs topic-level)
- Niche viability scoring (market size, regulatory stability, pricing potential)
- Routing decisions: CLONE_NEW_HIVE / EXPAND_EXISTING_HIVE / IGNORE

She does NOT do:
- Topic detection within an existing hive's domain (per-hive Strategic owns)
- Hive cloning execution (Vanilla template + clone workflow owns)
- Anything customer-facing
- Anything inside a single hive's operations

She is the **prospector who finds new gold seams**, not the miner who works one seam.

---

## §2 — Inputs and outputs

### Inputs

- Same source toolkit as per-hive Strategic Queen, but with broader prompt sets
- The current hive inventory (what domains already exist as hives)
- Operator-provided exploration hypotheses (operator can hint: "explore property tax")
- Cross-hive learning patterns from Orchestrator (e.g., "verticals like tax and visa share these traits — look for more verticals with same traits")

### Output

#### Output 1 — `apiary_strategic_handoffs` table

```
apiary_strategic_handoffs
─────────────────────────────────────────────

PRIMARY KEY
  handoff_id              uuid
  created_at              timestamp

NICHE IDENTITY
  niche_slug              e.g. "property-tax-uk-au", "crypto-tax-global"
  niche_name              human-readable e.g. "UK & AU Property Tax Compliance"
  niche_summary           1-2 paragraph description of the niche

JURISDICTIONS COVERED
  jurisdictions[]         Which jurisdictions this niche spans
                          e.g. [UK, AU] for property tax
                          e.g. [GLOBAL] for crypto tax

ACTION & SCORING
  action                  CLONE_NEW_HIVE | EXPAND_EXISTING_HIVE | IGNORE
  expand_existing_hive    if EXPAND: which hive to extend (e.g., add UK tax to Tax Hive)

  overall_score           0.0–10.0
  score_components        {
                            citation_gap_density:    0.0–10.0  // how many gaps?
                            regulatory_stability:    0.0–10.0  // will the law be there in 2 years?
                            personalisation_density: 0.0–10.0  // % of gaps that need tools
                            authority_clarity:       0.0–10.0  // is there a clear official source?
                            market_size_signal:      0.0–10.0  // how many people affected
                            competitor_landscape:    0.0–10.0  // how weak are existing answers
                            cost_to_clone:           0.0–10.0  // inverse — high score = cheap to clone
                          }
  confidence              0.0–1.0

EVIDENCE TRAIL
  evidence                {
                            sample_topics_detected: [...]   // 10-30 specific topics
                                                            // already found in this niche
                            grounding_query_patterns: [...] // recurring AI fan-out patterns
                            top_authority_domains: [...]    // gov.au, gov.uk, etc.
                            top_cited_competitors: [...]    // who's getting AI citations now
                            youtube_volume_estimate: ...
                            stackexchange_communities: [...]
                            decay_window: "rising" | "stable" | "declining"
                          }

CLONE PROPOSAL (if action = CLONE_NEW_HIVE)
  proposed_hive_name      e.g. "uk-property-tax"
  proposed_domain         e.g. "propertytaxcheck.uk" or similar
  proposed_persona_seeds  recommended characters for this niche
                          e.g. "Owen the UK property investor"
  vanilla_version_to_clone  which version of Vanilla to use
  config_overrides        niche-specific config that should differ from defaults
                          e.g. {
                            jurisdictions_to_scan: [UK, AU],
                            domain_keywords: [...],
                            authority_sources: [
                              "gov.uk/government/organisations/hm-revenue-customs",
                              "ato.gov.au/...property..."
                            ]
                          }
  estimated_first_products  list of 5-10 likely first products for this hive
                          (sourced from the topics already detected)

EXPAND PROPOSAL (if action = EXPAND_EXISTING_HIVE)
  target_hive             e.g. "tax"
  expansion_summary       what's being added
                          e.g. "Add UK and US jurisdictions to existing
                                Tax Hive instead of cloning new hive"

OPERATOR GATE
  approval_status         PENDING | APPROVED | REJECTED | DEFERRED
  approved_by             operator id
  approved_at             timestamp

DOWNSTREAM TRACKING
  clone_initiated_at      timestamp when operator triggers clone
  hive_live_at            timestamp when new hive's first product ships
```

#### Output 2 — `niche_candidates` (long-tail observations, not yet handoff-worthy)

She also produces an ongoing log of niches she's watching that haven't crossed threshold:

```
niche_candidates
─────────────────────────

candidate_id           uuid
first_observed_at      timestamp
last_observed_at       timestamp
niche_hypothesis       what she thinks this niche might be
current_score          0.0–10.0
score_history          time series of how the score has changed
status                 watching | promoted_to_handoff | dropped
```

This lets her track niches over time as they mature. A niche scoring 5/10 today might score 8/10 in 6 months. She remembers.

---

## §3 — The bees that produce these outputs

```
Bee 1: Niche Hunter             →  candidate niches with raw evidence
Bee 2: Niche Scorer             →  multi-dimensional niche viability scores
Bee 3: Niche Router             →  CLONE_NEW_HIVE / EXPAND_EXISTING / IGNORE
Bee 4: Clone Proposal Composer  →  the assembled handoff with clone config
```

Same four-bee structure as per-hive Strategic Queen, but with bigger-scoped methods.

---

## §4 — Bee 1: Niche Hunter

### Purpose
Scan for citation gap patterns across niches (not within a niche).

### Method

#### Routine A — Broad domain prompts to Gemini grounding
Different from per-hive Strategic Queen prompts. Per-hive asks about specific tax topics. Apiary asks about whole categories of regulated/professional information.

Example Apiary prompts:
- "What categories of regulated compliance information generate the highest volume of AI queries that current online resources fail to answer well?"
- "Which professional/legal/regulatory verticals show fastest growth in AI citation demand in the past 6 months?"
- "What types of personal compliance decisions (tax, visa, healthcare, financial planning, etc.) are most asked-about with the least clear authoritative answers?"
- "Where do users most consistently fail to find clear, personalised answers to compliance questions?"

Captures the `groundingMetadata` — the fan-out queries and cited sources reveal which whole domains have systemic citation gaps.

#### Routine B — Cross-hive learning consumption
Reads from the Orchestrator's curated learnings table. If 3 hives have all independently detected a pattern like "people get confused about jurisdictional thresholds," that's a hint that domains organized around jurisdictional-threshold questions are likely candidates.

#### Routine C — Operator hypothesis injection
The operator can drop hypotheses into a `niche_exploration_queue`:
- "Look at UK property tax"
- "What about crypto tax?"
- "Explore healthcare compliance for self-employed"

Niche Hunter prioritizes these in her scanning. Operator's curiosity becomes a real input.

#### Routine D — Adjacent niche detection
For each existing hive, scan for niches "one step adjacent":
- Tax → Visa (both compliance, both jurisdictional)
- Tax → Property tax (subset that could be its own hive)
- Tax → Crypto tax (subset)
- Tax → Healthcare (different domain, similar customer demographic)

Method: LLM-assisted similarity search. "Given the Tax Hive's product catalogue, what adjacent domains share similar customer pain shapes?"

#### Routine E — Market signal observation
- Industry news (regulatory changes, new laws shipping)
- Funding signals (which compliance-tech startups raised recently — proxy for market interest)
- Trade publication trends

These don't drive primary scoring but supplement evidence.

### Source registry

Apiary Strategic Queen has her own source registry, separate from per-hive sources:

```yaml
# apiary_config.yml
apiary_strategic:
  niche_hunter:
    gemini_grounding:
      enabled: true
      cadence_days: 7
      prompts:
        # ~30 broad cross-niche prompts
        - "What categories of regulated compliance..."
        - ...

    operator_hypothesis_queue:
      enabled: true
      check_cadence_hours: 6

    adjacent_niche_scan:
      enabled: true
      cadence_days: 14
      from_hives: ALL

    cross_hive_learnings:
      enabled: true
      read_from: orchestrator_learnings
      cadence_days: 7

    market_signal:
      enabled: false  # phase 2
```

### Output

Writes to `niche_candidates`. Each candidate accumulates evidence over time. Bumps `recurrence_count` when the same niche is seen across sources.

### Critique point

The line between "niche worth its own hive" vs "topic within existing hive" is fuzzy. Bee 3 (Niche Router) is where that's resolved, but Bee 1 needs to be willing to surface candidates that COULD go either way. **Niche Hunter is generous in what she surfaces; Bee 3 makes the call.**

---

## §5 — Bee 2: Niche Scorer

### Purpose
For each candidate niche, produce a 7-dimension viability score.

### The 7 dimensions

#### citation_gap_density
- How many citation gaps does this niche contain?
- Sample 50-100 broad questions in the niche. How many show weak AI answers?
- **Method:** For each sample question, run a Gemini grounding query. Count how many cited URLs are weak (thin authority, missing personalisation angle, etc.).
- **Scoring:** % weak / total. >40% weak = high citation_gap_density.

#### regulatory_stability
- Will the legal/regulatory framework be there in 2 years?
- **Method:** LLM assessment with grounding to recent regulatory news. "Is [niche] a stable regulatory area, or actively changing/being deprecated?"
- High = stable laws likely to remain (e.g., property tax = very stable)
- Low = fast-changing (e.g., crypto tax — viable but volatile)

#### personalisation_density
- What % of detected topics in this niche actually need a tool (calculator/checker) vs being answerable by a plain article?
- **Method:** Sample 30+ topics from Bee 1. Score each on personalisation_potential (same logic as per-hive Strategic Queen). Average across niche.
- High % → high tool density → defensible from generic content competitors

#### authority_clarity
- Is there a clear official source for this niche?
- High = clear gov body / regulator with comprehensive website (HMRC for UK tax; USCIS for US visa)
- Low = multiple competing authorities, unclear primary source
- High clarity = easier to build defensible authority-grounded products

#### market_size_signal
- How many people are affected by this niche?
- **Method:** Combine:
  - Google Trends volume for canonical niche queries
  - YouTube channel subscribers in this niche
  - StackExchange community sizes
  - Estimated market size from public reports if available
- Crude but directional

#### competitor_landscape
- How weak/strong are existing online resources?
- **Method:** Same logic as per-hive Strategic Queen's competitor_weakness, applied to top-cited URLs across the niche
- Weak competitors = easier to win citations

#### cost_to_clone
- How expensive will it be to actually clone Vanilla into a working hive for this niche?
- **Method:** Heuristic factors:
  - Number of jurisdictions to support (more = more expensive)
  - Authority sources to integrate (gov APIs available vs scraping)
  - Persona research needed (similar to existing niches = cheap)
  - Specialized data needs (e.g., tax brackets per jurisdiction)
- Inverse scoring: high score = cheap to clone

### overall_score
Weighted blend:
- citation_gap_density: 0.20
- regulatory_stability: 0.10
- personalisation_density: 0.15
- authority_clarity: 0.15
- market_size_signal: 0.15
- competitor_landscape: 0.15
- cost_to_clone: 0.10

Operator-configurable.

### confidence
Multi-factor (same shape as per-hive Strategic Queen).

### Why this scoring matters

The TrustMRR analogs for per-hive Strategic Queen include AEO Engine, IdeaProof, Niches Hunter. Apiary Strategic Queen is **a level higher** — she's closer to the kind of strategic intelligence VCs use to size markets. The seven dimensions force a thorough evaluation:

- A high citation_gap_density niche with terrible regulatory_stability is a trap (you build, the law changes, products die)
- A stable niche with low market_size is a trap (you build, the audience is too small)
- A clearly authoritative niche with high competitor_landscape (= strong competitors) is a trap (you build, you can't displace incumbents)

The composite captures these tradeoffs.

---

## §6 — Bee 3: Niche Router

### Purpose
Decide CLONE_NEW_HIVE / EXPAND_EXISTING_HIVE / IGNORE for each scored niche.

### Decision logic

```
                    [Scored Niche Candidate]
                              │
                              ▼
              overall_score < threshold (8.0)? ── YES ──► IGNORE
                              │                            (kept in niche_candidates
                              NO                            for re-evaluation)
                              │
                              ▼
              Does this niche fit inside an existing hive?
                              │
                      ┌───────┴───────┐
                      │               │
                     YES              NO
                      │               │
                      ▼               ▼
              EXPAND_EXISTING       CLONE_NEW_HIVE
              _HIVE
                      │
                      ▼
              (e.g., add UK
              jurisdiction to
              existing Tax Hive)
```

### Step 1 — Threshold gate

Apiary threshold is HIGH (default 8.0+). Cloning a new hive is expensive — config, customer-facing site, integrations, initial product seeding. Don't clone for marginal opportunities.

Niches below threshold stay in `niche_candidates` with `status=watching`. They get re-scored periodically; some mature, some don't.

### Step 2 — Fit-within-existing-hive check

Compare the candidate niche against each existing hive's domain config:
- Does the candidate's domain overlap with an existing hive's domain?
- Does the candidate's jurisdictions add to an existing hive's jurisdiction list?
- Is the customer demographic similar?

**Method:** LLM-assisted semantic match:
> "Given niche [candidate] and existing hive [hive name with domain description], should the candidate be added to the existing hive as a jurisdiction/topic expansion, or is it different enough to warrant its own hive?"

Decision logic:
- Same domain + new jurisdiction → likely EXPAND_EXISTING_HIVE (add UK to Tax Hive)
- Same customer demographic + adjacent domain → maybe EXPAND or maybe CLONE (e.g., tax-adjacent crypto questions)
- Different domain → CLONE_NEW_HIVE

### Critique point

This decision has long-term consequences. EXPAND keeps the hive monolithic (Tax Hive grows). CLONE creates a new hive (Crypto Hive, Property Hive). 

Trade-offs:
- **EXPAND benefits:** shared infrastructure, shared persona, shared learnings
- **EXPAND costs:** hive becomes complex, queens manage more diversity, single hive's failures affect more revenue
- **CLONE benefits:** clean separation, independent failure modes, can be sold/spun off independently
- **CLONE costs:** more infrastructure, slower to start each new hive

**Default bias:** when in doubt, CLONE. Operator can later merge if they overshot. Merging is easier than splitting.

The operator should override the bee's decision frequently in early days, until you've calibrated to your preferences.

---

## §7 — Bee 4: Clone Proposal Composer

### Purpose
If action is CLONE_NEW_HIVE, assemble a complete clone proposal the operator can approve in one click.

If action is EXPAND_EXISTING_HIVE, assemble an expansion proposal.

### Method

#### For CLONE_NEW_HIVE

Generate:
1. **proposed_hive_name** — a slug. e.g., "uk-property-tax", "crypto-tax-global"
2. **proposed_domain** — suggest a customer-facing domain. LLM-assisted. Multiple options.
3. **proposed_persona_seeds** — 2-3 candidate personas based on niche characteristics
4. **vanilla_version_to_clone** — current Vanilla version
5. **config_overrides** — what differs from Vanilla defaults
6. **estimated_first_products** — 5-10 likely first products

For #6, she pulls from `niche_candidates` evidence — the topics already detected for this niche become seed handoffs for the new hive's Strategic Queen on day one.

#### For EXPAND_EXISTING_HIVE

Simpler. Generate:
1. **target_hive** — which hive
2. **expansion_summary** — what's added
3. **config_diff** — config changes needed
4. **estimated_first_products** — new products that become available with expansion

### Outputs

Writes complete `apiary_strategic_handoffs` row with status=PENDING.

---

## §8 — Operator gate (Apiary level)

The operator approval flow for an Apiary handoff is more deliberate than for per-hive handoffs. Cloning a hive is a bigger commitment than building a product.

```
┌─────────────────────────────────────────────────────────────┐
│ NEW HIVE OPPORTUNITY                              [Approve] │
│                                                   [Reject]  │
│                                                   [Defer]   │
│                                                              │
│ Proposed Hive: UK & AU Property Tax                          │
│ Action: CLONE_NEW_HIVE                                       │
│ Score: 8.7/10 (confidence 0.78)                              │
│                                                              │
│ Score breakdown:                                             │
│   citation_gap_density:    9.1   ▓▓▓▓▓▓▓▓▓░                 │
│   regulatory_stability:    8.5   ▓▓▓▓▓▓▓▓▓░                 │
│   personalisation_density: 8.8   ▓▓▓▓▓▓▓▓▓░                 │
│   authority_clarity:       9.0   ▓▓▓▓▓▓▓▓▓░                 │
│   market_size_signal:      7.5   ▓▓▓▓▓▓▓░░░                 │
│   competitor_landscape:    9.2   ▓▓▓▓▓▓▓▓▓░ (weak)          │
│   cost_to_clone:           7.8   ▓▓▓▓▓▓▓▓░░                 │
│                                                              │
│ Niche summary:                                               │
│   Property tax compliance for UK and AU residents and        │
│   foreign owners. ~30 detected citation gaps including       │
│   stamp duty calculations, foreign buyer surcharges, and    │
│   capital gains on second properties.                        │
│                                                              │
│ Clone proposal:                                              │
│   Hive name: uk-au-property-tax                              │
│   Suggested domain: propertytaxcheck.com / .uk / .com.au    │
│   Vanilla version: v3.2                                     │
│   First 8 candidate products:                                │
│     1. UK Stamp Duty Calculator for Non-Residents           │
│     2. AU Foreign Investment Review Board Check             │
│     3. Capital Gains on Second Home Calculator               │
│     4. ...                                                   │
│                                                              │
│ Recommended personas:                                        │
│   - "Owen the UK property investor"                         │
│   - "Cathy the cross-border property buyer"                 │
│                                                              │
│ Estimated setup time: 8-12 hours operator + 2 weeks         │
│   for hive to reach baseline operating state.                │
│                                                              │
│ Evidence: [view full evidence trail]                         │
└─────────────────────────────────────────────────────────────┘
```

If operator approves → triggers the Clone New Hive workflow (deferred — see architecture document §10 deferred items).

---

## §9 — Cadence and runtime behaviour

```
Bee 1 (Niche Hunter)
  - Gemini grounding routine: weekly
  - Operator hypothesis queue: every 6 hours
  - Adjacent niche scan: every 14 days
  - Cross-hive learnings ingestion: weekly
  - Manual "Run now": triggered by operator from Apiary panel

Bee 2 (Niche Scorer)
  - Triggered by Bee 1 producing new candidates
  - Also fires monthly to re-score existing candidates
    (a niche scoring 6/10 today might score 8/10 in 6 months)

Bee 3 (Niche Router)
  - Triggered when Bee 2's score crosses threshold
  - Manual operator override available

Bee 4 (Clone Proposal Composer)
  - Triggered by Bee 3 producing CLONE_NEW_HIVE or EXPAND decision
```

### Estimated cost

```
Apiary Strategic Queen own operational cost:
  Gemini API (broad prompts): ~$15/month
  ChatGPT API (cross-engine confirmation): ~$10/month
  Perplexity API: ~$5/month
  Embedding for similarity: ~$0.50/month
  LLM calls for scoring (7 dimensions × multiple candidates): ~$10/month
  LLM for clone proposal composition: ~$3/month
  YouTube quota: free

TOTAL: ~$40-50/month
```

She's more expensive than a per-hive Strategic Queen because her scanning is broader. Still tiny relative to the value of finding one good new hive.

---

## §10 — Apiary Strategic Queen in the Bee Farm view

How she appears in the operator UI (from Architecture Document §4):

```
┌─────────────────────────────────────────────────────────┐
│  🐝 APIARY — Bee Farm                                    │
│                                                           │
│  ┌────────────────────────────────────────────────┐    │
│  │  APIARY STRATEGIC QUEEN              [Run now] │    │
│  │  "What new niche should COLE add?"   [Settings]│    │
│  │                                                  │    │
│  │  🟢 Apiary Strategic alive                      │    │
│  │                                                  │    │
│  │  Last fired: 2d ago                              │    │
│  │  Runs (7d): 1 (1 ok, 0 failed)                  │    │
│  │  Cost (30d): $42.31                              │    │
│  │  Next fire: Tuesday 06:00 UTC                    │    │
│  │                                                  │    │
│  │  PENDING HIVE OPPORTUNITIES         3 pending   │    │
│  │  ▸ UK & AU Property Tax  score 8.7  CLONE       │    │
│  │  ▸ Crypto Tax Global     score 8.4  CLONE       │    │
│  │  ▸ US Tax expansion      score 8.1  EXPAND      │    │
│  │     (to existing Tax Hive)                       │    │
│  │                                                  │    │
│  │  WATCHING (long-tail candidates)   12 niches    │    │
│  │  ▸ Healthcare compliance  score 7.2 (stable)    │    │
│  │  ▸ AU Visa compliance     score 7.5 (rising)    │    │
│  │  ▸ ...                                          │    │
│  │                                                  │    │
│  │  OPERATOR HYPOTHESIS QUEUE        0 pending     │    │
│  │  [+ Add hypothesis to explore]                  │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

She lives in the Apiary alongside the COLE Orchestrator and the Vanilla template / Clone tool. The operator engages with her when thinking about strategic expansion.

---

## §11 — How this maps to the locked principles

| Principle | Honored? |
|---|---|
| 1. Whoever made it owns it | ✓ Apiary Strategic Queen owns niche detection and the handoffs to clone/expand. Once a hive is cloned, she forgets about the topic-level work in that hive (per-hive Strategic Queen owns from there). |
| 2. Each queen self-monitors via pings | ✓ Her scanning IS continuous self-monitoring of the niche landscape. She doesn't ping her own handoffs — once a hive is born, Orchestrator and per-hive queens own ongoing tracking. |
| 3. Flat hive, no AI middle-management | ✓ Reports to operator. Sits above hives but is not hierarchical over them — she works in parallel with per-hive Strategic Queens at different scopes. |
| 4. TrustMRR pub test | ✓ "Cross-niche opportunity scout" is a real category. Methodology-as-a-service sells to operators of multi-niche businesses (think: NicheHunter at Apiary scope). |
| 5. Per-hive isolation, federated visibility | ✓ Apiary-level data lives in apiary tables, not in any hive's tables. Operator views via Bee Farm. |
| 6. Domain expertise in-hive, methodology cross-hive | ✓ Niche detection METHODOLOGY is generic, propagated. Domain expertise STAYS in respective hives once cloned. |
| 7. Design backwards from outcome | ✓ Started from "what does the operator need to decide whether to clone a new hive" → bees fall out. |

---

## §12 — Critique points

Where I'm least confident:

1. **The threshold for cloning (8.0) is arbitrary.** Real-world data will recalibrate. Worth starting conservative and lowering only with evidence.

2. **EXPAND vs CLONE decision is fuzzy.** I gave a default-to-CLONE bias, but the operator might prefer fewer larger hives. **This should be a per-operator preference setting**, not a fixed rule.

3. **Niche viability scoring uses LLM heavily.** Same noise as per-hive scorer. Same mitigations apply (multiple calls, median, cross-engine confirmation).

4. **Operator hypothesis queue is great in concept** but could be abused (operator dumps random ideas, Niche Hunter wastes cycles). Worth a rate limit or priority queue.

5. **Adjacent niche scan (Routine D) is the most speculative routine.** Most likely to produce false positives. Worth gating with extra confidence requirement before promoting candidates from this routine.

6. **Market size signal is weak.** I sketched Google Trends + YouTube subs + community size, but none of those are good proxies for actual market size of a regulated compliance niche. Worth thinking harder about better signals (e.g., government statistics on affected populations, trade body member counts).

7. **The clone proposal includes "estimated first products."** This is great UX but creates a coupling — the new hive's Strategic Queen will inherit these as seed handoffs. If those handoffs are bad, the new hive starts on the wrong foot. Worth flagging them as suggestions, not commitments.

8. **No explicit handling of overlap with cross-hive learnings.** Orchestrator curates generic methodology. Apiary Strategic Queen reads it. But the loop back — when Apiary Strategic identifies a niche pattern that becomes methodology — isn't designed. The relationship between Apiary Strategic and Orchestrator needs explicit clarification in the Orchestrator design doc.

9. **Cadence assumes one operator.** At 20 hives, you may want Apiary Strategic to run more aggressively to keep up with niche discovery. Configurable.

10. **The Bee Farm view in §10 doesn't yet show how she connects to the Orchestrator and Vanilla template.** The three Apiary residents are listed side-by-side in the architecture doc but interactions between them aren't fully specified.

---

## §13 — How she relates to the per-hive Strategic Queens

**Same shape, different scope.** Both are scouts. Per-hive scouts find topics within a domain. Apiary scout finds new domains.

When Apiary Strategic detects a niche worth a new hive:
- She does NOT pre-build the hive's product catalogue
- She does NOT decide which specific products the new hive should make
- She passes "here's the niche, here are some seed topics" to the operator
- Operator approves clone
- Vanilla clones into new hive
- New hive's own Strategic Queen takes over from day one
- New hive's Strategic Queen reads the seed topics as her first handoffs

**Clean handoff. No telephone game.** Apiary Strategic Queen and per-hive Strategic Queens operate at different layers and never overlap in scope.

---

## §14 — Migration map

| Existing element | New home |
|---|---|
| (No current Apiary Strategic Queen exists today) | Net new construction |
| Operator's manual "I should explore X niche" thoughts | Replaced by `niche_exploration_queue` + scoring |
| Day 12 Strategic Queen architecture treating new niches as part of the same scope | Removed — that responsibility re-homed to Apiary Strategic Queen |

Net new build. Phase 1 priority should be building the simplest version (Bee 1 with broad prompts, Bee 2 with crude scoring, no Bee 3/4 routing — just present candidates to operator). Refine over time.

---

## §15 — Sanity check against the operator's morning

If this design is right, your monthly strategic review:

1. Open Bee Farm (Apiary view)
2. Look at Apiary Strategic Queen's pending hive opportunities (typically 0-3 per month)
3. For each: read niche summary + score breakdown + clone proposal
4. Decide: clone now? defer? add to watching? reject?
5. Glance at "Watching" list — anything that crossed threshold from last review?
6. If you have a hunch, drop it into the operator hypothesis queue

**This is monthly strategic work, not daily operational work.** A new hive is a quarter-scale commitment. Apiary Strategic Queen's job is to surface 1-2 high-quality opportunities per month and let the operator deliberate calmly.

Compared to: doing this manually with no tooling, where the operator only thinks about expansion when something happens by accident. Apiary Strategic Queen makes expansion a deliberate, regularly-revisited operator decision.

---

## §16 — Closing

The Apiary Strategic Queen is the queen that makes COLE compound. Without her, COLE is one tax hive forever. With her, COLE finds the visa hive, then the property hive, then crypto, then healthcare — each one starting from accumulated methodology + verified demand.

She is the **growth engine** at the highest layer of the architecture. Not a marketing engine — a business-expansion engine. She tells you what new business to start, with evidence.

**End of Apiary Strategic Queen design.**

---

## §17 — Persona extraction (required, Day-14 addition)

> Added 2026-05-27 (Day 14) as part of banking the Vanilla+Clone rulings — see
> `VANILLA-CLONE-DESIGN-RULINGS-DAY14.md` (PERSONA ruling, Option A). The §1–§16 above are the original
> Day-13 record, unchanged; this section is a forward requirement on the Apiary Queen when she is built.

When the Apiary Strategic Queen is built, one of her steps — as part of producing the `CLONE_NEW_HIVE`
handoff — is to **EXTRACT a STARTING persona** from her niche evidence (`evidence.stackexchange_communities`,
`evidence.top_cited_competitors`, `proposed_persona_seeds`) and **author it into the character surface, in
the SHAPE that surface requires**. The per-hive Strategic Queen then **REFINES** the persona post-launch from
real customer voice.

This resolves the persona **chicken-and-egg for future hives**: the starting persona comes from the **Apiary
layer's pre-clone research**, NOT from the new hive's not-yet-run Strategic Queen. (The Clone workflow itself
does NOT generate personas — it references existing ones for taxchecknow and emits a checklist item for new
hives; persona *generation* is this Apiary capability.)

### ⚠️ CONSTRAINT (verified — Vanilla+Clone probe 1c-A)

The character "registry" is **TODAY a hardcoded TS module** (`lib/bees/_character-registry.ts`) sourced from
`cole-marketing/CHARACTERS.md` — **NOT a writable table**. So this persona-extraction step must either
**author the TS/markdown directly**, **OR** depend on a **WRITABLE CHARACTER SURFACE being built first**.
Resolve that constraint when the Apiary Queen is built.

**Flagged follow-up:** a writable character surface — **trigger: when the Apiary persona-step is built.**
