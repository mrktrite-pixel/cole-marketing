# Production Queen — Design (Day 13)

**Status:** First draft for critique. Designed backwards from the locked architecture (COLE-ARCHITECTURE-LOCKED-DAY13.md, Principle 7).
**Scope:** Per-hive Production Queen (e.g. Tax Hive's Production Queen).
**Method:** Outcome → Handoff Input → Build Output → Bees → Sources. Bees fall out of requirements.

---

## §1 — The locked outcome

From the architecture document, Production Queen's one-line job:

> "Build this product end-to-end, correctly, in the right voice."

She receives one assignment from Strategic Queen — a single approved topic — and her hive of bees does ALL research, writing, and assembly for that one topic. Narrow and deep. Like a commissioned editor who writes one book.

She owns the product **for life** after building:
- Persona selection
- Calculator design (inputs, logic, outputs)
- Page content (above-the-fold, FAQ, success page)
- Authority verification (initial AND continuous pings)
- Trust ledger (verification timestamps, displayed on the page)
- Related-product map (cross-references to other products in the hive)
- Transactional emails (Stripe receipt, immediate delivery confirmation)
- Product deprecation (death certificate)
- Ongoing source-URL pings (catches authority changes faster than Strategic Queen's broad scan)

She does NOT do:
- Demand detection across topics (Strategic Queen owns)
- Broadcast distribution to YouTube/social/newsletter (Distribution Queen owns)
- Lifecycle email sequences after delivery (Concierge Queen owns)
- Performance measurement and diagnosis (Adaptive Queen owns)
- Infrastructure monitoring (Governance Queen owns)

---

## §2 — The inputs and outputs

### Input: an approved handoff from Strategic Queen

Production Queen reads from `strategic_queen_handoffs` where `approval_status = APPROVED` and `production_pickup_at IS NULL`. She picks up one at a time, marks it picked up, and begins work.

The handoff gives her:
- The topic identity (slug, canonical question, short question, jurisdiction)
- The action (BUILD_NEW or PANELBEAT)
- The score components + evidence trail (so she knows WHY this topic was approved)
- Fan-out queries (the actual AI sub-queries — gold for FAQ writing)
- If PANELBEAT: the existing product to revise + reason

### Output: a complete product

She writes to `products`:

```
products (per-hive table)
─────────────────────────────────────────

PRIMARY KEY
  product_id              uuid
  product_slug            from handoff
  hive                    e.g. "tax"
  jurisdiction            e.g. "AU"

LIFECYCLE STATE
  state                   DRAFT | IN_REVIEW | LIVE | DEPRECATED | ARCHIVED
  created_at              timestamp
  first_published_at      timestamp (null until LIVE)
  last_revised_at         timestamp
  deprecated_at           timestamp (null until DEPRECATED)

LINEAGE
  source_handoff_id       reference to strategic_queen_handoffs
  parent_product_id       null for BUILD_NEW; populated for PANELBEAT
                          (panelbeats produce a new version, old becomes archived)
  jurisdiction_siblings   array of product_ids for the same concept
                          in other jurisdictions (e.g. AU FRCGW + US FIRPTA)

IDENTITY
  canonical_question      from handoff
  short_question          from handoff
  topic_summary           one paragraph, 2-4 sentences
                          (the AI-citation-ready answer summary)
  persona                 character voice used (e.g. "gary", "priya")
  price_tier              "$67" | "$147" | "$297"
  product_type            calculator | decision_tree | checker | guide

CONTENT (the actual product page assets)
  hero_copy               above-the-fold headline + subheadline + CTA
  faq_items               array of { question, answer, source_signal,
                                     authority_ref }
                          (target: 8-12 items)
  success_page_copy       what the customer sees after Stripe checkout
  calculator_spec         {
                            inputs: [{ label, type, options[], required,
                                        help_text, risk_signal }],
                            logic: <scoring rules / formula>,
                            outputs: [{ label, type, tier_labels,
                                        explanation }],
                            recommended_actions: [...]
                          }
  related_products        array of { product_id, relationship_type,
                                     reason_for_cross_ref }

AUTHORITY GROUNDING (defensibility)
  primary_authority       { url, title, last_verified_at,
                            content_snapshot_hash }
  secondary_authorities   array of same shape
  law_section_refs        array of specific clause references
  trust_ledger            {
                            built_at: timestamp,
                            last_verified_at: timestamp,
                            next_verification_due: timestamp,
                            verification_history: [...],
                            confidence_score: 0.0-1.0
                          }
  fan_out_queries         from handoff — preserved so Site Auditor
                          can detect drift later

CUSTOMER VOICE PROVENANCE
  customer_language_pack  {
                            fear_phrases: [...],
                            hope_phrases: [...],
                            confusion_phrases: [...],
                            user_quotes: [{ text, source_url }],
                            emotional_frame: fear | confusion | planning | urgency
                          }
                          (used by Distribution and Concierge later)
  research_sources        array of URLs Production Queen consulted

COMPETITOR ANALYSIS
  competitor_audit        array of { url, their_angle, their_gap,
                                     our_advantage }
  differentiation_hook    one sentence; why we win

DEPRECATION
  deprecation_reason      null until deprecated; free-text when set
  successor_product_id    null or pointer to replacement
  redirect_strategy       null | "301_to_successor" | "archive_only"
```

That's the complete product spec. Production Queen produces every field. Distribution and Concierge Queens read from this later.

### Output: transactional email templates

She also writes to `transactional_email_templates`:

```
transactional_email_templates
─────────────────────────────────────

template_id            uuid
product_id             link back to product
trigger                "stripe_purchase_success" | "free_calculator_email"
subject                in persona voice, references product
body                   in persona voice; includes product link
created_at, updated_at
```

Triggered at the moment of product instantiation (purchase or free-tier delivery). Anything fired AFTER that delivery moment is Concierge's job.

---

## §3 — The bees that produce the product

Working backwards: which bee produces which output section?

```
Bee A: Authority Verifier      →  authority grounding + trust ledger
                                  + law_section_refs
                                  + customer_voice (legal-side language)

Bee B: Customer Voice Capturer →  customer_language_pack
                                  + research_sources
                                  + emotional_frame
                                  + faq question candidates

Bee C: Competitor Auditor      →  competitor_audit
                                  + differentiation_hook
                                  + gap analysis to inform calculator

Bee D: Calculator Architect    →  calculator_spec (inputs/logic/outputs)
                                  + recommended_actions
                                  + topic_summary (the AI-citation-ready answer)

Bee E: Page Assembler          →  hero_copy + faq_items (answers)
                                  + success_page_copy
                                  + related_products
                                  + persona selection
                                  + price_tier recommendation
                                  + transactional email templates

Bee F: Quality Gate            →  pass/fail against GOAT 12-block standard
                                  + detailed feedback if fail

Bee G: Legal Gate              →  citation verification pass/fail
                                  + compliance check pass/fail

Bee H: Source-URL Pinger       →  continuous (post-build): pings authority
                                  URLs, updates trust ledger,
                                  emits "authority_changed" events
```

**Eight bees.** Each produces a clearly-named portion of the output. None duplicates another's work.

Bees A, B, C run in **parallel** for the same assignment (they're independent research streams on the same topic). Bees D, E need their outputs. Bees F, G are sequential gates. Bee H runs post-build, continuously, forever.

---

## §4 — Bee A: Authority Verifier

### Purpose
Establish the legal/regulatory ground truth for this specific topic. Capture authoritative sources. Score confidence in the legal position.

### Input
- The handoff's canonical question and jurisdiction

### Output
- `primary_authority` (one canonical source)
- `secondary_authorities` (supporting)
- `law_section_refs` (specific clauses)
- Initial `trust_ledger.confidence_score`
- Legal-language phrases for the customer voice pack (formal terms users encounter)

### Method

#### Step 1 — Identify the authority registry for this jurisdiction

Hive config has authority sources per jurisdiction:
```yaml
authority_sources:
  AU:
    primary: ["ato.gov.au", "treasury.gov.au", "legislation.gov.au"]
    secondary: ["tpb.gov.au", "asic.gov.au"]
  UK:
    primary: ["gov.uk/hmrc", "legislation.gov.uk"]
    secondary: ["taxadvisermagazine.com"]
  US:
    primary: ["irs.gov", "treasury.gov"]
  # etc.
```

#### Step 2 — Find the canonical page

For the canonical question, identify which authority page is THE answer. Two methods:

**Method 2a — Cited URLs from handoff evidence.** The handoff's evidence trail includes `cited_competitor_urls`. Filter to authority domains for this jurisdiction. These are pre-validated as relevant.

**Method 2b — LLM-assisted search.** Call Gemini API with grounding, prompt: "What is the single canonical {jurisdiction} authority page for this question: '{canonical_question}'?" Capture cited URLs, filter to authority domains.

Cross-reference 2a and 2b. The URL appearing in both is the strongest primary candidate.

#### Step 3 — Snapshot and hash

Fetch the page. Store:
- Full text content
- Hash of the content (SHA-256)
- Last-modified timestamp from response headers (if available)
- Snapshot timestamp

The hash becomes the baseline for Bee H's ongoing ping comparison.

#### Step 4 — Extract law section references

LLM prompt: "From this authority page text, extract specific law section references (e.g. 'Subdivision 14-D', 'Section 855', 'TAA 1953 s 14-200'). Return as structured list."

Captured for `law_section_refs`.

#### Step 5 — Confidence scoring

How clean is the legal position? Score 0.0-1.0 based on:
- Single canonical page exists (vs scattered partial answers): +0.3
- Page is current (last updated within 12 months): +0.2
- Law sections are explicitly cited: +0.2
- No contradictory secondary sources: +0.2
- Authority registry includes this domain: +0.1

This becomes `trust_ledger.confidence_score`. Sub-0.7 confidence flags for operator review before product goes live.

### Edge cases

- **No authority page found** — escalates to operator. Product cannot be built without legal grounding. Most often happens when Strategic Queen surfaced a topic the regulator hasn't yet published guidance on (rare but real for emerging law).
- **Multiple competing authority pages** — capture both, flag for operator. Common with regulatory transitions.
- **Authority page exists but is in PDF / behind login** — capture URL + summary, flag confidence drop.

---

## §5 — Bee B: Customer Voice Capturer

### Purpose
Capture how real customers actually talk about this topic. Surface emotional patterns, real questions, real phrases.

### Input
- The handoff's canonical question and fan-out queries
- The handoff's evidence (which YouTube videos, StackExchange threads were the signal)

### Output
- `customer_language_pack` (fear/hope/confusion phrases + user quotes)
- `emotional_frame` classification
- FAQ question candidates (raw — Bee E will write the answers)
- `research_sources` list

### Method

#### Step 1 — Pull comments from top-cited YouTube videos
The handoff identified top-cited YouTube videos. For each:
- YouTube Data API: `commentThreads.list` to pull top comments by relevance
- Limit ~50 comments per video
- Filter to comments with substantive text (>20 chars)
- Capture: comment text, video URL, comment URL, like count

#### Step 2 — Pull StackExchange threads
Search relevant SE communities (Money SE, Personal Finance SE for tax) for the topic.
- Top 10 questions by score
- Top 3 answers per question
- Capture: question, answer, vote counts, URLs

#### Step 3 — Pull Quora threads (conditional)
If Quora has substantial activity on this topic (operator-configurable per hive):
- Public search, respectful rate-limit scraping
- Top 10 questions, top answers

#### Step 4 — Extract pain language
LLM prompt processing the captured corpus:
> "Read the following customer comments and questions. Extract:
> - **Fear phrases** (what users are afraid of, in their words)
> - **Hope phrases** (what users hope for, in their words)
> - **Confusion phrases** (what users find unclear, in their words)
> - **Verbatim user quotes** (3-5 quotes that capture the emotional core)
> Return as structured JSON."

Run this on chunks (≤2000 tokens per call) and merge results.

#### Step 5 — Classify emotional frame

Single LLM call:
> "Based on this customer voice corpus, which emotional frame dominates: fear, confusion, planning, or urgency? Provide a single classification and a one-sentence rationale."

This drives Bee E's persona selection.

#### Step 6 — Extract FAQ question candidates

LLM prompt:
> "From this corpus, extract the 15-20 most common questions users are asking about this topic. Phrase each as a question in the user's voice. Group similar questions and return the deduplicated list."

Bee E will pick 8-12 and write the answers.

### Edge cases

- **Topic too new** (low YouTube/SE/Quora signal) — fall back to LLM-imagined customer voice using ChatGPT prompt: "Imagine customers searching for X. What are their fears, hopes, confusions?" Flag as `language_pack_synthetic = true` so trust ledger reflects lower confidence.
- **Mixed jurisdictions in customer voice** (e.g., AU-tagged topic but most YouTube comments are from US users) — filter aggressively by jurisdiction cues; flag if filtering removes >70% of corpus.

---

## §6 — Bee C: Competitor Auditor

### Purpose
Find what's already ranking/being cited for this topic. Identify the gap. Define the differentiation.

### Input
- Handoff's `cited_competitor_urls`
- Optionally: top Google/Bing search results for the canonical question

### Output
- `competitor_audit` array
- `differentiation_hook` (one sentence)
- Gap analysis informing Calculator Architect

### Method

#### Step 1 — Collect top competitor URLs
Sources:
- Handoff evidence's cited competitor URLs (highest priority — these are what AI engines actually cite)
- Bing / Google search for `canonical_question` site:exclusion of own domain
- Top 5 unique competitor URLs total

#### Step 2 — Fetch and summarize each

For each URL:
- Fetch page content
- LLM prompt: "Summarize how this page answers the question '{canonical_question}'. What's the angle? What's missing? Where is it weak? Is it personalised or generic? Length: 3 sentences each."

Captured as `their_angle` and `their_gap` per URL.

#### Step 3 — Identify differentiation

LLM prompt across all summaries:
> "Given these competitor pages, what is the strongest possible differentiating angle for a new page on '{canonical_question}'? Consider: (a) personalisation via calculator/checker, (b) deeper jurisdiction-specific authority, (c) better emotional framing matching the customer voice pack, (d) more current data. Return one sentence as the differentiation hook."

Captured as `differentiation_hook`. This becomes Bee E's hero copy north star.

#### Step 4 — Gap signal for calculator

If competitors are all article-style and the topic has high personalisation_potential (from Strategic Queen's scoring) — flag explicitly: "calculator is the gap." Bee D will use this.

### Edge cases

- **All competitors are gov authority pages** — different game. Differentiation is "personalisation that the regulator can't provide" or "plain-English translation of regulatory language."
- **Competitor pages are paywalled or login-only** — capture URL, note paywall, mark as "unverifiable."

---

## §7 — Bee D: Calculator Architect

### Purpose
Design the interactive tool that delivers personalisation. This is the conversion asset. Without a calculator/checker, the product is just an article.

### Input
- Output from Bees A (authority grounding), B (customer voice), C (gap analysis)
- The handoff's canonical question and `personalisation_potential` score

### Output
- `calculator_spec` (inputs / logic / outputs)
- `recommended_actions`
- `topic_summary` (the AI-citation-ready one-paragraph answer)

### Method

#### Step 1 — Determine product type
From handoff's `product_type` hint and gap analysis, confirm one of:
- **calculator** — numeric inputs, numeric or tiered outputs
- **decision_tree** — branching yes/no flow
- **checker** — risk assessment with input-driven score
- **guide** — last resort if personalisation_potential genuinely low (rare)

#### Step 2 — Design inputs

From the customer voice pack and authority grounding, identify the variables that actually determine the answer for this user. LLM-assisted prompt:

> "Given the canonical question '{q}' and the authoritative answer involves variables {X, Y, Z from authority extraction}, design 3-7 input fields that a user could fill in to get a personalised answer.
>
> For each input, return:
> - label (in customer voice, not legal voice)
> - input type (date, yes_no, dropdown, number)
> - options (if dropdown)
> - required (bool)
> - help text (one sentence)
> - risk_signal (what this value means for outcome: e.g. 'older dates = higher risk')"

**Hard cap:** 7 inputs max. From the research mentioned in our session, 5-input calculators convert 47% better than 7+. Default to 5 unless the topic genuinely requires more.

#### Step 3 — Design logic

For each input combination, what's the output? Two patterns:

**Pattern A — Scoring rubric** (most common for "checker" types)
```
"No return lodged in 2+ years": +30 risk
"Name mismatch on title": +20 risk
"Settlement within 14 days": +25 risk
[Total risk score determines tier]
```

**Pattern B — Formula** (for true calculators)
```
withholding_amount = sale_price × 0.15  [if no clearance certificate]
withholding_amount = 0                    [if clearance certificate]
```

LLM-assisted, grounded in authority document. Operator review on logic before publication.

#### Step 4 — Design outputs and recommended actions

For each output tier (or value range), what does the user see?
- Output label (e.g. "Delay Risk: HIGH")
- Plain-English explanation (2-3 sentences)
- Specific recommended action (e.g. "Apply for clearance NOW; contact ATO priority line at [link]")

#### Step 5 — Compose `topic_summary`

This is the **AI-citation-ready paragraph** — the 2-4 sentences that AI engines can extract as a clean citation. Drafted to:
- Answer the canonical question directly
- Use plain language
- Include the key numeric/legal facts
- Be retrieval-friendly

Example for FRCGW:
> "Most ATO clearance certificates arrive within days. Some take up to 28 days. Without a clearance certificate at settlement, the buyer is legally required to withhold 15% of the sale price under Subdivision 14-D of the Taxation Administration Act 1953."

This appears above-the-fold on the page and is the most important text for citation purposes.

### Edge cases

- **Calculator logic gets complex** (e.g., interacting variables, jurisdiction-specific exceptions) — operator gate before publication. No calculator ships without operator review of logic correctness.
- **Personalisation genuinely doesn't fit** (the topic IS just informational) — defer to "guide" product type, generate a structured FAQ-heavy page. Flag for review: are we sure Strategic Queen scored personalisation correctly?

---

## §8 — Bee E: Page Assembler

### Purpose
Write the customer-facing copy. Persona-driven. Reads from all previous bees' outputs.

### Input
- Authority grounding (Bee A)
- Customer voice pack + emotional frame (Bee B)
- Competitor differentiation hook (Bee C)
- Calculator spec + topic summary (Bee D)
- Hive config for personas + pricing tiers

### Output
- `hero_copy` (headline + subheadline + CTA)
- `faq_items` (questions from Bee B, answers freshly written here)
- `success_page_copy`
- `related_products`
- `persona` selection
- `price_tier` recommendation
- Transactional email templates

### Method

#### Step 1 — Select persona

Hive config has persona library (e.g., Gary, Priya, etc.) each tagged with:
- Emotional ranges they fit (fear / planning / etc.)
- Jurisdiction primary association
- Demographic angle

Match persona to:
- Bee B's `emotional_frame`
- Topic's jurisdiction
- Topic's demographic angle (foreign resident vs local, etc.)

Single LLM call:
> "Given emotional frame {frame}, jurisdiction {j}, demographic {d}, which persona from this library fits best, and why?"

#### Step 2 — Determine price tier

Hive config has tier rubric:
- **$67** — light personalisation, single decision point
- **$147** — multi-input checker, urgent or fear-driven
- **$297** — done-for-you tier or high-stakes risk

Match based on:
- `personalisation_potential` from handoff
- `urgency` from handoff
- Calculator complexity (input count, logic depth)

#### Step 3 — Write hero copy

In persona voice, addressing the customer voice pack:

```
LLM prompt:
> "Write hero copy for a product page in the voice of {persona}.
> The canonical question is: '{canonical_question}'.
> The differentiation hook is: '{differentiation_hook}'.
> Customer fears include: {top 3 fear phrases}.
> Output:
> - Headline (≤12 words; tension with the fear, promise relief)
> - Subheadline (≤25 words; what the calculator delivers)
> - CTA button text (≤4 words; action-oriented)"
```

#### Step 4 — Write FAQ answers

For each FAQ question candidate from Bee B (operator can select 8-12 from the candidate list):

```
LLM prompt:
> "Write a FAQ answer to '{question}' for our page on '{canonical_question}'.
> Voice: {persona}.
> Authority: cite {primary_authority.url} for legal claims.
> Length: 2-4 sentences. Citation-ready style.
> Include the relevant data from the authority page."
```

Output: `{ question, answer, source_signal, authority_ref }`.

#### Step 5 — Write success page copy

What the customer sees after Stripe checkout. In persona voice. Includes:
- Confirmation
- Link to the result (or the result inline)
- Next steps
- Cross-pollination cue ("you may also need...")

#### Step 6 — Generate related products map

Query the hive's products table for products with overlapping `customer_language_pack.fear_phrases` or shared `jurisdiction_siblings`. Top 3 most relevant.

For each related product, produce `relationship_type` (e.g. "next step after this") and `reason_for_cross_ref` (one sentence).

#### Step 7 — Generate transactional email templates

Two templates:

**"stripe_purchase_success":**
- Subject in persona voice (e.g. "Your FRCGW risk report is ready, [Name]")
- Body: confirmation + link to result + reassurance
- One CTA: open the product

**"free_calculator_email":**
- Subject for the free-tier email capture flow
- Body: delivers the calculator + soft upsell to the full version

These fire at the moment of purchase / free-tier delivery, owned by Production Queen. Anything fired AFTER delivery is Concierge Queen.

### Edge cases

- **No suitable persona in hive library** — fallback to a generic professional voice and flag for operator review. Suggest adding a new persona.
- **Topic spans multiple jurisdictions but only one product** — pick primary persona for the topic's listed jurisdiction.

---

## §9 — Bee F: Quality Gate

### Purpose
Score the assembled product against the GOAT 12-block standard. Pass/fail with feedback.

### Input
- Full draft product from Bees A-E

### Output
- Pass/fail
- Detailed per-block feedback if fail
- If fail, routes back to the responsible bee (or operator)

### Method

The GOAT 12-block standard is documented in `cole/types/README.md` per the existing Pub Test pages. Each block is a checkable criterion:

```
Block 1: Above-the-fold question matches canonical_question ✓/✗
Block 2: Topic summary is 2-4 sentences, citation-ready ✓/✗
Block 3: At least one authority URL cited and verified ✓/✗
Block 4: 8-12 FAQ items with answers ✓/✗
Block 5: Calculator has 3-7 inputs with help text ✓/✗
Block 6: Calculator logic is documented and reviewable ✓/✗
Block 7: Recommended actions are concrete and time-bound ✓/✗
Block 8: Customer voice matches captured emotional frame ✓/✗
Block 9: Persona is consistent throughout the page ✓/✗
Block 10: Trust ledger fields populated ✓/✗
Block 11: Related products map has at least 2 entries ✓/✗
Block 12: Transactional email templates exist ✓/✗
```

For each block, an automated check (structural) and/or an LLM judgment (qualitative).

#### Failure routing
- Block 3 fail → back to Bee A (Authority Verifier)
- Block 4, 8, 9 fail → back to Bee E (Page Assembler)
- Block 5, 6, 7 fail → back to Bee D (Calculator Architect)
- Block 1, 2, 10, 11, 12 fail → fix in place if straightforward, else operator review

Max retry: 2 cycles per bee. After that, escalate to operator with the failure pattern.

### Edge cases

- **Multiple blocks fail** — fix in dependency order (A → B → D → E). Don't re-run downstream bees until upstream fixed.
- **GOAT standard evolves** — operator updates the standard in `cole/types`. Quality Gate picks up the new rubric on next run. Existing products can be flagged for re-validation against the updated standard.

---

## §10 — Bee G: Legal Gate

### Purpose
Verify legal/compliance soundness before publication. Independent of Quality Gate.

### Input
- Full draft product (post-Quality Gate)

### Output
- Pass/fail
- If fail: specific compliance issue

### Method

#### Step 1 — Citation validity
For each authority URL in the draft:
- Fetch the URL (verify still resolves, no 404)
- Verify the cited fact actually appears on that page (LLM check: "Does this page support the claim 'X' that we're citing?")
- Flag any citations that no longer resolve or no longer support claims

#### Step 2 — Compliance checklist (per jurisdiction)

Hive config has per-jurisdiction compliance items:
```yaml
compliance:
  AU:
    - "No phrase implies tax advice without disclaimer"
    - "ASIC/TPB disclosures if applicable"
    - "Privacy Act consent language on email captures"
  UK: ...
```

LLM check against each item.

#### Step 3 — Disclaimer presence
Verify standard disclaimer is present and current for the jurisdiction.

### Failure routing
- Citation fails → back to Bee A (Authority Verifier) for refresh, or Bee E (Page Assembler) for rewording
- Compliance fails → operator review (legal issues need human judgment)
- Disclaimer missing → auto-fix from template, single retry

### Edge cases

- **Legal Gate is the LAST gate before publication.** No product goes live without Legal Gate passing. Production Queen does NOT publish; she marks `state = IN_REVIEW` and notifies operator. Operator approves publication, state moves to LIVE.
- **Compliance items shift** (regulator updates rules) — Governance Queen's authority pings detect this and emit "compliance_rules_changed" events. Legal Gate re-runs on affected products.

---

## §11 — Bee H: Source-URL Pinger (continuous, post-build)

### Purpose
After the product is built, watch its authority sources for changes. This is the "Production Queen pings her own products" function from the locked architecture.

### Input
- Each product in the hive (LIVE state)
- The product's `primary_authority` and `secondary_authorities` URLs + content hashes

### Output
- Updated `last_verified_at` and `verification_history` on each ping
- "authority_changed" events when content hash differs from baseline
- "authority_404" events when URL no longer resolves

### Method

#### Cadence
Per-URL configurable. Defaults:
- Primary authority: every 7 days
- Secondary authorities: every 14 days
- Critical-jurisdiction sources (during budget season, etc.): every 1-3 days

#### Each ping
1. Fetch URL
2. Compute content hash (SHA-256 of normalized text — strip whitespace, ads, navigation)
3. Compare to stored baseline hash
4. If unchanged: update `last_verified_at`, no event
5. If changed: capture diff, emit "authority_changed" event with:
   - product_id affected
   - authority URL
   - old hash, new hash
   - diff summary (LLM-generated: "what materially changed")
6. If 404: emit "authority_404" event

#### Event routing
"authority_changed" event → routes to operator dashboard as a revision request:

```
┌─────────────────────────────────────────────────────────┐
│ AUTHORITY CHANGE DETECTED                  [Review]     │
│                                                          │
│ Product: au-19-frcgw-clearance-certificate              │
│ Authority: ato.gov.au/.../foreign-resident-cgw          │
│ Change: ATO updated FRCGW threshold from 12.5% to 15%   │
│                                                          │
│ Suggested action: Production Queen will rebuild section │
│ X and FAQ items 3, 7, 8 referencing the threshold.     │
│ Distribution Queen will be notified for video update.   │
│                                                          │
│ [Approve revision]  [Snooze]  [No change needed]        │
└─────────────────────────────────────────────────────────┘
```

Operator approves → Production Queen fires a revision sub-cycle (Bees D, E rerun on affected sections only, Bees F, G validate, operator final-approves publication).

### Edge cases

- **Authority site temporarily down** — distinguish 5xx from 404; retry 3x; only fire event if persistent.
- **Trivial content change** (timestamp updated but content same) — content hash should normalize away timestamps. If false positive rate is high, refine normalization.
- **Cascading revisions** (one law change affects 30 products) — batch the events; operator gets one digest with all affected products.

---

## §12 — Lifecycle orchestration

How the bees coordinate for a single assignment.

### Phase 1: Pickup
- Production Queen polls `strategic_queen_handoffs` for `approval_status = APPROVED AND production_pickup_at IS NULL`
- One handoff at a time per Production Queen instance (configurable parallelism per hive)
- Marks `production_pickup_at = now()`
- Creates a draft `products` row with `state = DRAFT`

### Phase 2: Parallel research (Bees A, B, C)
- Fire Bees A, B, C in parallel
- Each writes to draft product row in their owned fields
- Wait for all three to complete (timeout per bee, escalate on failure)

### Phase 3: Synthesis (Bees D, E)
- Bee D fires when A and B complete (needs both)
- Bee E fires when A, B, C, D complete
- Sequential, not parallel

### Phase 4: Gates (Bees F, G)
- Bee F fires after E
- Bee G fires after F passes
- Failures route back per §9, §10

### Phase 5: Operator review and publication
- State moves to `IN_REVIEW`
- Operator sees the draft product in dashboard
- Operator approves → state moves to `LIVE`, `first_published_at = now()`
- Production Queen marks the handoff `production_completed_at = now()`, `production_product_id = <new id>`

### Phase 6: Continuous (Bee H)
- Bee H runs forever for every LIVE product in the hive
- Per-URL cadences as configured
- Events route to operator dashboard for any detected changes

### Failure handling

If any phase stalls (>configured timeout):
- Doctor-bee equivalent detects stalled draft
- Notifies operator
- Operator can: resume, restart phase, abandon (deletes draft)

Failed drafts don't pollute LIVE products. The draft stays in `DRAFT` or `IN_REVIEW` until resolved.

---

## §13 — PANELBEAT vs BUILD_NEW — what's different

For PANELBEAT, Production Queen receives a handoff pointing to an existing product. Two sub-cases:

#### Sub-case A: Authority changed (new ATO page, etc.)
- Bee H already detected this AND emitted the event
- Production Queen re-runs Bees A, D, E on AFFECTED SECTIONS ONLY
- Doesn't touch sections that didn't depend on the changed authority
- Quality Gate / Legal Gate verify the revision
- Operator approves the revision → new version published, old version archived

#### Sub-case B: Fan-out drift (AI engines now asking different sub-questions)
- Bees B, D, E re-run for the drifted FAQ items / calculator inputs
- Authority Verifier (A) usually doesn't change (same legal position, new framing)
- Same gate cycle, same operator approval

### Versioning

When a product is panelbeated, the new version is created with:
- `parent_product_id = <old product id>`
- Old product `state = ARCHIVED` after new version goes LIVE
- 301 redirect strategy preserves SEO/citation continuity

### Edge cases

- **Multiple concurrent panelbeats on same product** (rare but possible) — queue them sequentially; second panelbeat sees first's result as starting state.
- **Panelbeat fails Quality Gate repeatedly** — escalate to operator; consider deprecation instead of revision.

---

## §14 — Death certificate (deprecation)

Production Queen owns deprecation. Triggered when:

#### Trigger 1: Legal Gate fails permanently
- The law that the product is built on has changed enough that no revision can save it (e.g., regulator removed the entire framework)
- Bee G escalates to operator with deprecation recommendation
- Operator confirms → product moves to DEPRECATED

#### Trigger 2: Adaptive Queen recommendation
- Adaptive Queen's feedback cards may include "this product is structurally underperforming and rebuild won't fix it"
- Operator reviews → optional deprecation

#### Trigger 3: Strategic Queen demand collapse
- Strategic Queen's site auditor logs: "we have this product, but its underlying demand fell from 9.2 to 2.1 over 6 months"
- Operator reviews → optional deprecation

### Deprecation workflow
1. State moves to `DEPRECATED`
2. `deprecation_reason` captured
3. `successor_product_id` set if there's a replacement
4. `redirect_strategy` chosen:
   - `301_to_successor` if a replacement product exists
   - `archive_only` if no replacement (page goes to archive URL with notice)
5. Customer support implications: Concierge Queen notified to update lifecycle sequences referencing this product
6. Distribution Queen notified to either repurpose or archive related videos/social posts

After 90 days in DEPRECATED with no operator un-deprecation, state moves to `ARCHIVED` (data preserved but no longer in active catalogue).

---

## §15 — Cost estimate per build

Approximate LLM cost per single product build:

```
Bee A (Authority Verifier):       ~$0.50
  - 3-5 Gemini grounding calls
  - 2-3 LLM extraction calls

Bee B (Customer Voice Capturer):  ~$1.20
  - YouTube comment processing (multiple LLM chunks)
  - 4-6 LLM extraction calls

Bee C (Competitor Auditor):       ~$0.40
  - Page summaries (5 URLs)
  - Differentiation synthesis

Bee D (Calculator Architect):     ~$0.30
  - Input design
  - Logic design
  - Topic summary

Bee E (Page Assembler):           ~$0.80
  - Persona selection
  - Hero copy
  - 8-12 FAQ answers
  - Success page
  - Transactional templates

Bee F (Quality Gate):             ~$0.20
  - 12 block checks

Bee G (Legal Gate):               ~$0.30
  - Citation verification
  - Compliance checks

──────────────────────────────────────
TOTAL PER BUILD:                  ~$3.70
```

For PANELBEAT, typically $1.50-$2.00 (subset of bees re-run).

For Bee H (continuous pings post-build), ~$0.05/product/month.

At 47 LIVE products + 5 builds/month, hive cost: ~$20/month for Production Queen runtime.

---

## §16 — How this maps to the locked principles

| Principle | Production Queen design honors it? |
|---|---|
| 1. Whoever made it owns it | ✓ Production Queen builds → owns persona, lifecycle, deprecation, related products, transactional emails, authority pings. Forever. |
| 2. Each queen self-monitors via pings | ✓ Bee H is the ping. Pings authority URLs, emits authority_changed events. |
| 3. Flat hive, no AI middle-management | ✓ Production Queen escalates to operator for gates (build approval, legal review, deprecation). No queen above her. |
| 4. TrustMRR pub test | ✓ SEOBOT $64k MRR is the standalone analog. |
| 5. Per-hive isolation | ✓ All Production Queen tables are per-hive. |
| 6. Domain stays in-hive, methodology cross-hive | ✓ Hive-specific: authority registry, persona library, compliance rules. Generic: bee architecture itself, GOAT 12-block standard, calculator design patterns. |
| 7. Design backwards from outcome | ✓ Designed from `products` table schema backwards to bees. |

---

## §17 — Critique points

Honest list of where this design is weakest or most debatable:

1. **Bee count.** Eight bees is more than Strategic Queen's four. Production Queen's job is genuinely bigger, but is 8 right? Possible collapses: A + G (authority verification + legal verification — both deal with citation correctness). I separated them because Legal Gate runs on the assembled product, not on raw authority capture. Open to merging.

2. **LLM cost per build (~$3.70).** Cheap but not free. At 50 builds/month per hive × 10 hives, that's $1,850/month. Worth budget-capping at the hive level.

3. **Operator approval gates.** I have operator gating at: build approval (before LIVE), authority-change revisions, compliance issues, deprecation. Is this too many? Could automate revision approval for low-risk changes (typo-level updates). Configurable thresholds like Strategic Queen.

4. **Customer voice synthesis quality.** Bee B's LLM-based phrase extraction may produce generic-sounding language packs. The mitigation (verbatim quotes from real sources) helps but introduces source noise. Worth a calibration check after first 5 products.

5. **Calculator logic correctness.** This is the highest-risk failure mode. A wrong calculator can mislead users with real money implications. Bee D's LLM-assisted design needs operator review for logic, always. I noted this but it deserves emphasis: **no calculator ships without explicit operator approval of the scoring/formula logic.**

6. **Persona library config.** I assumed personas pre-exist in hive config. For the first hive (Tax), they may. For new hives, persona creation is part of New Hive onboarding (deferred item #2 in architecture doc).

7. **Bee H's URL diff sensitivity.** Content hashing is brittle. Government sites often update navigation/timestamps without material content change. False positives waste operator attention. Real engineering work needed on the diff normalizer.

8. **Versioning of panelbeated products.** Creating a new version each panelbeat is clean but produces accumulation. At 47 products × 4 panelbeats/year = ~190 versions/year. Need an archival policy for versions older than N years.

9. **Quality Gate's GOAT 12-block standard.** Inherited from existing Pub Test pages. Worth re-validating that all 12 blocks make sense under the new architecture; some may be obsolete or need new ones added.

10. **The PANELBEAT vs new-version model.** When a panelbeat is significant enough, is it a revision or a fresh BUILD_NEW? Edge case: ATO restructures FRCGW so significantly that the old product can't be salvaged. Currently this would fail Legal Gate and trigger deprecation, then Strategic Queen would emit a fresh BUILD_NEW. But it's worth being explicit about the boundary.

---

## §18 — Migration map from existing E1-E7 / F-bees

| Existing element | Where it goes in Production Queen design |
|---|---|
| E2 Market Researcher | Bee B (Customer Voice Capturer) |
| E2c StackExchange | Bee B's Step 2 (one of the sources) |
| E3 Customer Psychologist | Bee B's Step 4 (pain language extraction) + Step 5 (emotional frame classification) |
| E4 Competitor Monitor | Bee C (Competitor Auditor) |
| E7 Truth-Sync (ATO/HMRC RSS) | Bee H (Source-URL Pinger) at build-time AND continuous |
| F1 (Calculator builder, existing) | Bee D (Calculator Architect) |
| F2 (Page assembler, existing) | Bee E (Page Assembler) |
| F3 / F3b (existing) | Bee E + Bee G depending on current scope |
| F4 (Quality scorer, existing) | Bee F (Quality Gate) |
| GOAT 12-block standard in `cole/types/README.md` | Inherited by Bee F |

**Net effect:** the existing F-bees are mostly preserved in updated form. The E-bees that were in Strategic Queen are absorbed into Production Queen's research bees (A, B, C). E7 takes on a new lifecycle role (build-time AND continuous via Bee H).

---

## §19 — Sanity check against the operator's morning

Production Queen's morning surface to the operator:

1. **Builds in draft** — open in research/synthesis phase
2. **Builds in IN_REVIEW** — awaiting your approval to go LIVE
3. **Authority changes detected** (from Bee H) — affected products + suggested revisions
4. **Compliance flags** (from Bee G) — products needing legal review
5. **Deprecation recommendations** — products Adaptive Queen / Strategic Queen flagged for retirement

For each, one-click action (Approve, Reject, Defer). Same UX pattern as Strategic Queen.

If a typical day shows 1-3 IN_REVIEW products, 0-2 authority change events, occasional deprecation reviews → operator workload is ~10-15 minutes for Production Queen. That's the leverage.

---

## §20 — Closing

This design is for critique. Strongest points to challenge:
- Bee count and possible mergers (esp. A + G)
- Calculator logic safety (the highest-risk component)
- Bee H diff sensitivity (highest false-positive risk)
- PANELBEAT vs BUILD_NEW boundary cases
- Operator gate density

If a critique lands, revise. If not, lock and move to Distribution Queen next.

**End of Production Queen design.**
