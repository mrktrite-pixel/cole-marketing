# Concierge Queen — Design (Day 13)

**Status:** First draft for critique. Designed backwards from the locked architecture (COLE-ARCHITECTURE-LOCKED-DAY13.md, Principle 7).
**Scope:** Per-hive Concierge Queen. New queen — no existing code base to migrate from.
**Method:** Outcome → Output → Bees → Sources.

---

## §1 — The locked outcome

From the architecture document, Concierge Queen's one-line job:

> "Be the 1:1 voice of the business to individual customers."

She handles **anything triggered by a customer event**, not a publishing event. The defining test:
- Newsletter to 10,000 subscribers → Distribution Queen
- Day-14 review request to one customer → Concierge Queen
- "We just launched new product X" announcement to all → Distribution Queen
- "You bought X 60 days ago, consider Y" to one specific customer → Concierge Queen
- Customer asks "can I get a refund?" → Concierge Queen
- Customer comments on a YouTube video → Distribution Queen publishes the video, Concierge Queen replies to the comment (1:1)

She owns:
- Lifecycle email sequences (day 3, day 14, day 60, anniversary, etc.)
- Cross-pollination emails (post-purchase, "you may also need...")
- Refund handling
- Customer support replies (email, eventually chat)
- Comment replies on social/YouTube (1:1 engagement)
- Eventual chatbot conversations on the site
- In-product help (eventually)
- Re-engagement campaigns to dormant customers
- Law-change notifications to affected customers (consumes Production Queen's authority-ping events)

She does NOT do:
- Broadcast emails (Distribution Queen owns)
- Building products (Production Queen owns)
- Demand detection (Strategic Queen owns)
- Performance measurement (Adaptive Queen owns — Concierge captures her own metrics for Adaptive to read)
- Infrastructure (Governance Queen owns)

She is new. No existing code. Phase 0 implementation will be minimal (just lifecycle email sequences). Phase 2+ adds chatbot, support triage, proactive outreach.

---

## §2 — Inputs and outputs

### Input: customer state

Concierge Queen reads from a `customer_state` table — the source of truth for who customers are and what's happened with them:

```
customer_state (per-hive table)
─────────────────────────────────────────

customer_id            uuid
email                  unique per hive
created_at             when first captured (free-tier signup, purchase, etc.)
hive                   e.g. "tax"

ACQUISITION
  acquisition_source   "stripe_purchase" | "free_calculator" | "newsletter_signup"
  acquisition_product  reference to first product touched
  acquisition_utm      utm parameters from acquisition

PURCHASE HISTORY
  purchases            array of { product_id, purchased_at, amount, stripe_id }
  total_spent          number
  last_purchase_at     timestamp
  first_purchase_at    timestamp

ENGAGEMENT
  last_login_at        timestamp
  last_active_at       timestamp (any interaction)
  calculator_uses      array of { product_id, used_at, inputs_hash }
                       (anonymized but per-customer for personalization)
  emails_opened        count
  emails_clicked       count
  comments_made        count

SEQUENCE STATE
  active_sequences     array of { sequence_id, started_at,
                                  current_step, next_fire_at }
  completed_sequences  array of sequence_ids
  suppressed_sequences array of sequence_ids (user opted out)

PREFERENCES
  email_subscribed     bool
  newsletter_subscribed bool
  marketing_consent    bool (jurisdiction-dependent, e.g. GDPR / Privacy Act)
  preferred_persona    null or override
  language_preference  en | other

LIFECYCLE STAGE
  stage                "new" | "active" | "dormant_30" |
                       "dormant_60" | "dormant_90" | "churned"
  stage_changed_at     timestamp
```

This table is **also written to** by Production Queen (when a Stripe purchase fires) and Distribution Queen (when someone subscribes to newsletter). Concierge Queen is the primary reader and the keeper of sequence state.

### Input: customer events

Concierge Queen reads from `customer_events`:

```
customer_events (per-hive table, append-only)
────────────────────────────────────────────

event_id               uuid
customer_id            reference
event_type             enum: see below
occurred_at            timestamp
payload                jsonb

EVENT TYPES
  purchase_completed
  free_calculator_completed
  newsletter_signup
  email_opened
  email_clicked
  product_logged_in
  product_used (calculator submitted)
  support_email_received
  comment_posted (on YouTube/social)
  refund_requested
  refund_processed
  unsubscribe
  bounce
  spam_complaint
```

These events trigger sequences. They also update customer_state.

### Input: revision events from Production Queen

When Production Queen panelbeats a product (authority change), Concierge Queen reads the revision event and identifies affected customers (those who bought or used that product). She sends them notification: *"The product you purchased has been updated. Here's what changed and your new result..."*

### Output: 1:1 messages

```
concierge_messages (per-hive)
────────────────────────────────────

message_id             uuid
customer_id            reference
trigger_event_id       reference to customer_event that triggered (if applicable)
sequence_id            reference (if part of a sequence)
sequence_step          int

DELIVERY
  channel              email | chat | support_reply | comment_reply
  to_address           email or external user handle
  subject              for email
  body                 in persona voice, customized per customer
  scheduled_for        timestamp
  sent_at              timestamp
  external_id          provider's message ID (Resend message ID, etc.)

STATE
  state                DRAFT | SCHEDULED | SENT | DELIVERED |
                       OPENED | CLICKED | BOUNCED | FAILED
  delivery_metadata    provider-specific

APPROVAL
  approval_status      AUTO_APPROVED | PENDING | APPROVED | REJECTED
  approved_by          operator id (when manual)
```

### Output: chatbot conversation state (Phase 2+)

Deferred to Phase 2 implementation. Schema sketched:

```
concierge_conversations (Phase 2+, per-hive)
────────────────────────────────────────────

conversation_id        uuid
customer_id            null if anonymous visitor
started_at             timestamp
ended_at               timestamp
messages               array of { role: user|assistant,
                                  content, sent_at }
resolution             "resolved" | "escalated_to_operator" |
                       "abandoned" | "ongoing"
escalation_reason      if escalated
```

---

## §3 — The bees that produce these outputs

```
Bee 1: Sequence Engine          →  fires scheduled lifecycle sequences
                                   (the "post office")

Bee 2: Event Router             →  catches customer_events, decides which
                                   sequences to start/stop/branch

Bee 3: Message Composer         →  generates the actual message text,
                                   personalized per customer, in persona voice

Bee 4: Delivery Engine          →  calls Resend / SendGrid / etc. to actually send
                                   captures delivery state

Bee 5: Inbound Handler          →  reads inbound emails / comments / chat messages
                                   classifies intent, drafts replies

Bee 6: Refund / Support Workflow →  handles the structured "refund requested",
                                   "billing question", "product issue" flows

Bee 7: Deliverability Pinger     →  pings email infrastructure (bounce rates,
                                   spam scores, sender reputation)
                                   her self-monitoring function

Bee 8: Chatbot Interface         →  Phase 2+ — on-site conversational interface
                                   not built initially
```

**Eight bees** total. Phase 0 implementation = Bees 1, 2, 3, 4, 7 (lifecycle emails + deliverability monitoring). Phase 1 adds Bees 5, 6 (inbound handling + refunds). Phase 2 adds Bee 8 (chatbot).

---

## §4 — Bee 1: Sequence Engine

### Purpose
The scheduler that fires lifecycle sequences on time. The "post office" function.

### Input
- All active sequences for all customers in the hive
- Current time

### Output
- Triggers Bee 3 (Message Composer) for each sequence step due to fire
- Updates sequence state in customer_state

### Method

#### Sequence definitions (per hive config)

```yaml
sequences:
  post_purchase_followup:
    trigger_event: purchase_completed
    steps:
      - step: 1
        delay: "3 days after trigger"
        template: "did_you_use_it"
        condition: "customer didn't use product yet"

      - step: 2
        delay: "14 days after trigger"
        template: "review_request"
        condition: "customer used product"

      - step: 3
        delay: "60 days after trigger"
        template: "reactivation_check_in"
        condition: "customer hasn't logged in for 30 days"

      - step: 4
        delay: "365 days after trigger"
        template: "anniversary_or_renewal"
        condition: "always"

  free_to_paid_nurture:
    trigger_event: free_calculator_completed
    steps:
      - step: 1
        delay: "immediately"
        template: "result_delivery"
      - step: 2
        delay: "3 days"
        template: "upsell_to_paid"
      - step: 3
        delay: "7 days"
        template: "second_upsell_different_angle"
      - step: 4
        delay: "21 days"
        template: "final_nudge"
        condition: "not converted yet"

  cross_pollination_post_purchase:
    trigger_event: purchase_completed
    steps:
      - step: 1
        delay: "30 days after trigger"
        template: "you_may_also_need"
        params:
          related_product: "from purchased product's related_products map"
        condition: "related_products map has eligible product"

  authority_change_notification:
    trigger_event: revision_event_from_production
    steps:
      - step: 1
        delay: "immediately"
        template: "product_updated_notice"
        params:
          revision_summary: "from revision event"
```

#### Runtime behavior

Bee 1 runs every N minutes (configurable, default every 5 min):
1. Query: all `active_sequences` where `next_fire_at <= now()`
2. For each due step:
   - Re-check the `condition` (customer may have done the thing that voids the step)
   - If condition passes: enqueue Bee 3 to compose the message
   - If condition fails: skip step, advance to next
3. Update sequence state (current_step, next_fire_at)

#### Sequence state transitions

- Customer event "unsubscribe" → all active sequences move to suppressed
- Customer event "purchase" for the cross-pollination product → mark cross-pollination sequence completed (they bought it)
- Customer event "refund_requested" → suspend all marketing sequences pending refund resolution

### Edge cases

- **Customer triggers multiple overlapping sequences** (e.g., bought 3 products in one day → 3 post_purchase_followup sequences). Bee 1 deduplicates by `(customer_id, sequence_type)` — only one active per type per customer. Newest trigger wins.
- **Long delays** (1-year anniversary) — Bee 1 stores next_fire_at, so even if Concierge Queen is down for a day, the sequence catches up when she's back.
- **Sequence definition changes** (operator updates the config) — affects future starts only. In-flight sequences continue with the version they started under.

---

## §5 — Bee 2: Event Router

### Purpose
Listen to the customer_events firehose. Decide what to do.

### Input
- New rows in customer_events

### Output
- Starts sequences (writes to customer_state.active_sequences)
- Stops sequences (suppresses)
- Updates customer_state (engagement counters, stage)

### Method

For each new event:

#### Step 1 — Match against sequence trigger configuration

For each sequence defined in hive config, check if this event_type matches its trigger. If yes, evaluate trigger conditions (e.g., specific product, jurisdiction).

#### Step 2 — Start sequence

If matched and customer doesn't already have this sequence active:
- Add to active_sequences
- Set step 1, calculate next_fire_at
- Log the start

#### Step 3 — Stop / branch existing sequences

Some events stop or branch sequences:
- `purchase_completed` for the same product nurture is targeting → mark free_to_paid_nurture as completed (they converted)
- `unsubscribe` → mark all sequences as suppressed
- `refund_requested` → pause all marketing sequences

#### Step 4 — Update customer_state aggregates

- Increment counters (emails_opened, emails_clicked, comments_made)
- Update last_active_at
- Recalculate lifecycle stage:
  - First purchase → stage = "active"
  - No login in 30 days → stage = "dormant_30"
  - No login in 60 days → stage = "dormant_60"
  - etc.
- If stage changed, emit stage_changed event (which itself can trigger sequences)

### Edge cases

- **Event ordering matters** (e.g., purchase then immediately refund) — events processed in order; refund handler can suspend the post-purchase sequence before it fires.
- **Duplicate events** (Stripe webhook fired twice) — Bee 2 idempotency check: same external event ID → ignore second.

---

## §6 — Bee 3: Message Composer

### Purpose
Generate the actual message text. Personalized per customer, in the right persona voice, referencing the right product.

### Input
- A sequence step that's ready to fire (from Bee 1)
- The customer_state for that customer
- The relevant product (if sequence is tied to a product)

### Output
- A `concierge_messages` row with subject, body, channel, ready for Bee 4 to send

### Method

#### Step 1 — Resolve template

From the sequence step's `template` (e.g. "review_request"), load the template definition:

```yaml
templates:
  review_request:
    channel: email
    persona: "from product"  # use the product's persona
    subject_pattern: "{persona_voice}: Did the {product_short_question} help, {first_name}?"
    body_outline: |
      - Greet by name
      - Brief acknowledgment of what they bought
      - Specific question about their experience
      - Easy CTA to leave a review
      - Sign off in persona voice
    constraints:
      - max_length: 150 words
      - tone: "warm, not pushy"
      - one_cta_only: true
```

#### Step 2 — Gather context

- Customer's first_name (from email or stored)
- Product they bought (canonical_question, persona, etc.)
- Time elapsed since purchase ("3 days ago", "two weeks ago")
- Any specific result if available (their calculator result, anonymized)

#### Step 3 — Compose with LLM

```
LLM prompt:
> "Compose an email following this template definition. Use the customer's name '{first_name}'. The product is '{product_short_question}', purchased {time_elapsed} ago by this customer. Voice: {persona}. Tone: {tone}. Constraints: {constraints}. Output subject and body."
```

Cost: ~$0.005 per message.

#### Step 4 — Variant testing (optional)

For high-volume sequences, Bee 3 can produce 2-3 variants (A/B test). Operator config decides whether to send variants randomly per customer for measurement. Adaptive Queen reads results.

#### Step 5 — Personalization safety

Critical: avoid hallucinated personalization. Don't write "I see you used the FRCGW calculator on Tuesday" unless we actually have that fact. Bee 3 grounds personalization claims only on verified customer_state fields.

### Edge cases

- **No first_name available** — fallback to generic but warm opener ("Hi there,").
- **Customer purchased multiple products** — sequence is per-product; the message references the specific product the sequence is about.
- **Persona library doesn't have a matching persona** for cross-channel context — fallback to hive default persona.
- **Template constraints violated by LLM output** (too long, two CTAs, etc.) — retry with stricter prompt or trim. Hard fail after 2 retries → escalate.

---

## §7 — Bee 4: Delivery Engine

### Purpose
Send the message via the right channel. Capture delivery state.

### Input
- A `concierge_messages` row in state SCHEDULED or APPROVED

### Output
- Calls provider API (Resend for email, etc.)
- Updates message state (SENT, FAILED)
- Captures provider's external_id

### Method

#### Email (Resend)

```javascript
// Pseudo-code
POST https://api.resend.com/emails
{
  from: hive_config.sender_address,
  to: customer.email,
  subject: message.subject,
  html: message.body,  // rendered from markdown if needed
  tags: [
    { name: "sequence_id", value: message.sequence_id },
    { name: "customer_id", value: message.customer_id }
  ]
}
```

Capture Resend's message ID. Resend webhooks deliver open/click/bounce events back → flow into customer_events.

#### Support reply (email reply)

When responding to inbound support emails, threading is important. Reply must include the original Message-ID in In-Reply-To header.

#### Chat reply (Phase 2+)

Via on-site chat widget — different mechanism than email. Real-time.

#### Comment reply (LinkedIn, YouTube)

Posts via platform API (subject to API availability and rate limits).

### Rate limits

Per-platform limits respected. Resend has generous limits but spam complaint protection. Bee 4 enforces:
- Max emails per customer per day (default: 1, configurable)
- Max emails per hive per hour (rate-limit per provider)
- Bounce-rate circuit breaker (if bounce rate > 5% in last hour, pause all sends and alert operator — see Bee 7)

### Edge cases

- **Provider down** — retry with backoff (3 retries), then mark FAILED, alert operator.
- **Customer has unsubscribed** between scheduling and sending — Bee 4 re-checks just before send and aborts if unsubscribed.
- **Wrong sender / domain not verified** — operator config issue, fail fast with clear error.

---

## §8 — Bee 5: Inbound Handler

### Purpose
Handle incoming customer messages (email replies, support emails, comments). Classify intent. Draft replies.

This is **Phase 1**, not Phase 0. Initially operator handles all inbound manually.

### Input
- Inbound emails (from Resend / mail provider)
- Comments on social/YouTube (from Distribution Queen's pings)
- Eventually: chatbot messages (Phase 2+)

### Output
- Classification of intent
- Drafted reply (operator reviews before send)
- Routing to specialized handlers if needed (refund → Bee 6)

### Method

#### Step 1 — Classify intent

LLM prompt:
> "Classify this customer message into one or more categories:
> - support_question (clarification, how-to)
> - refund_request
> - billing_issue
> - product_complaint
> - product_compliment
> - feature_request
> - sales_inquiry (about a different product)
> - other
> Return classifications + confidence + 1-sentence summary."

#### Step 2 — Route by classification

- `refund_request` → Bee 6 (Refund Workflow)
- `support_question` with high confidence → Bee 5 drafts a reply using product's FAQ + authority sources
- `product_compliment` → Bee 5 drafts a thank-you (very low-stakes, often auto-send)
- `feature_request` → log + acknowledge to customer; operator reviews bulk-list weekly
- `sales_inquiry` → cross-pollination response if related_products has match; else operator
- `other` → escalate to operator

#### Step 3 — Draft reply

For support questions, LLM with grounding:
> "Draft a reply to this customer message. The customer bought {product}. The product's FAQ items are {faq_items}. The authority source is {primary_authority.url}. Voice: {persona}. Length: 100-200 words. Cite the FAQ item or authority if relevant. Sign off warmly."

#### Step 4 — Operator approval (Phase 1) or auto-send (later, with calibration)

Phase 1: every Bee 5 reply needs operator approval before send. After calibration period (months), thresholds for auto-send may be enabled for high-confidence simple support replies.

### Edge cases

- **Multi-issue messages** ("I want a refund AND the calculator was wrong") — classify multiple intents, route to multiple handlers, compose unified reply.
- **Angry customer** — detect via sentiment, escalate to operator even if technically a simple support question.
- **Off-topic / spam** — classify, suppress without reply, log.

---

## §9 — Bee 6: Refund / Support Workflow

### Purpose
Structured workflow for refund requests. Higher stakes than general support — money flows.

### Input
- A classified `refund_request` from Bee 5
- Or: direct customer event `refund_requested` (from a refund form on the site)

### Output
- A structured refund workflow tracking the steps
- Drafted communications at each step
- Stripe API calls for actual refund execution

### Method

#### Step 1 — Capture refund request

Create a `refund_request` record:
```
refund_id, customer_id, product_id (which purchase),
requested_at, reason (from customer message),
operator_review_state, stripe_refund_id (after execution)
```

#### Step 2 — Eligibility check

Per hive config:
```yaml
refund_policy:
  AU:
    eligible_within_days: 30
    must_have_not_used: true  # automated check via customer.calculator_uses
    operator_approval_required: true
```

#### Step 3 — Draft response

Three template responses:
- **Approved refund** ("Sure, refunding now, here's the timeline...")
- **Conditional refund** ("Refunds are normally within 30 days; let me check with...")
- **Declined refund** ("Looking at our records, this purchase was X days ago...")

In persona voice. Always polite, never defensive.

#### Step 4 — Operator gate

Operator approves the response AND the refund execution.

#### Step 5 — Stripe refund execution

If operator approved refund:
- Call Stripe `refunds.create`
- Capture stripe_refund_id
- Send approved-refund message
- Update customer_state (suspend marketing sequences, mark as refunded)

#### Step 6 — Follow-up

Optional sequence: "We refunded you. Is there anything we could have done better?" (feedback collection — feeds Adaptive Queen).

### Edge cases

- **Customer demands refund publicly** (Twitter, review site) — handle the public response separately. Refund workflow proceeds independently.
- **Chargeback received before refund processed** — different workflow (operator handles directly, Bee 6 doesn't auto-resolve chargebacks).
- **Pattern of refunds** (3+ for same product in a month) — emit `refund_pattern_detected` event. Adaptive Queen reads, recommends Production Queen review the product.

---

## §10 — Bee 7: Deliverability Pinger

### Purpose
Concierge Queen's self-monitoring function. Pings email infrastructure to detect deliverability problems before they damage sender reputation.

### Input
- Recent message delivery metadata
- Provider (Resend) sender reputation metrics

### Output
- Updated deliverability_state
- Events emitted on threshold breaches

### Method

#### Daily pings

Pull from Resend:
- Bounce rate over last 24h
- Spam complaint rate over last 24h
- Open rate over last 7d
- Send volume over last 24h
- Domain reputation score (if available)

#### Threshold checks

```yaml
deliverability_thresholds:
  bounce_rate_24h: 2.0%   # > 2% triggers warning
  bounce_rate_24h_critical: 5.0%  # > 5% triggers circuit breaker (pause sends)

  spam_rate_24h: 0.1%     # > 0.1% triggers warning
  spam_rate_24h_critical: 0.3%  # > 0.3% triggers immediate pause

  open_rate_7d: 15%       # < 15% suggests deliverability issues
                          # (only after sufficient volume baseline)
```

#### Events emitted

- `deliverability_warning` — operator notified, no action automatic
- `deliverability_critical` — Bee 4 sends are paused, operator alerted
- `sender_reputation_drop` — track over time, emit if trending down

### Circuit breaker

When `deliverability_critical` fires:
- All scheduled outbound emails pause
- Existing in-flight messages may still send (no abort mid-flight)
- Operator must acknowledge and decide: resume / investigate / restart with reduced volume

### Edge cases

- **Low-volume hive** (new hive, few customers, low send volume) — thresholds need volume sufficiency check (don't fire alert based on "1 of 3 bounced = 33% bounce rate").
- **Email provider's own issues** vs **our content issues** — Bee 7 captures both but distinguishes via sender reputation tracking over time.

---

## §11 — Bee 8: Chatbot Interface (Phase 2+, deferred)

### Purpose
On-site conversational interface. Pre-purchase (route to product) and post-purchase (support).

### Phase 2+ implementation

Two roles per the existing cole-chatbot skill:
1. **Router** — pre-purchase visitor asks "I'm a foreign resident selling property" → chatbot routes them to the right product
2. **Post-purchase support** — buyer asks "I got Medium risk, what does that mean?" → chatbot explains using the product's FAQ/calculator context

### Method (sketch only — full design when Phase 2 starts)

- Anthropic Claude API for the actual chat
- System prompt: persona + hive catalogue + product FAQs
- Tools: lookup_product, lookup_customer_purchases, escalate_to_human
- Conversation state stored in `concierge_conversations`
- Escalation to operator for: questions outside catalogue, refund requests, angry sentiment, ambiguous intent

Existing cole-chatbot skill is the implementation reference when this phase begins.

### Edge cases (anticipated)

- **Hallucination risk** — chatbot must NOT invent product details. Grounded only in stored product data.
- **Privacy** — anonymous visitors vs identified customers have different scopes.
- **Cost** — chat costs LLM tokens per turn; long conversations expensive. Cap at N turns then escalate.

---

## §12 — Lifecycle orchestration

### Continuous loop

Bee 1 (Sequence Engine) runs every 5 minutes:
1. Check all sequences for due steps
2. For each due step, enqueue Bee 3 (Compose)
3. Bee 3 produces message → Bee 4 (Delivery) sends
4. Resend webhooks fire customer_events back
5. Bee 2 (Event Router) processes events, updates sequence state and customer_state

### Event-driven loop

Customer event arrives (Stripe webhook, Resend webhook, support email):
1. Stored in customer_events
2. Bee 2 (Event Router) processes
3. Triggers/updates sequences
4. Possibly triggers Bee 5 (Inbound Handler) for support emails
5. Possibly triggers Bee 6 (Refund Workflow) for refund requests

### Self-monitoring loop

Bee 7 (Deliverability Pinger) runs daily:
1. Pull provider metrics
2. Check thresholds
3. Emit warnings or fire circuit breaker

---

## §13 — Hive config dependencies

Concierge Queen needs:

```yaml
concierge_config:
  email_provider:
    type: resend
    api_key: ${RESEND_API_KEY}
    sender:
      address: "no-reply@taxchecknow.com"
      name: "TaxCheckNow Team"
      reply_to: "support@taxchecknow.com"

  sequences:
    # full sequence definitions per §4 example

  templates:
    # template library per §6 example

  refund_policy:
    # per-jurisdiction config per §9

  deliverability_thresholds:
    # per §10

  rate_limits:
    max_emails_per_customer_per_day: 1
    max_emails_per_hive_per_hour: 500

  approval_gates:
    sequences:
      lifecycle_emails: auto_approve  # routine, templated
      cross_pollination: auto_approve
      authority_change_notification: operator_approve  # high-stakes
      refund_response: operator_approve  # always

    inbound_handler:
      simple_support: operator_approve  # Phase 1
      compliments: auto_approve
      refunds: operator_approve  # always

  legal:
    unsubscribe_required: true  # CAN-SPAM, etc.
    privacy_policy_link: "..."
    list_unsubscribe_header: true  # one-click unsubscribe
```

---

## §14 — Cost estimate per hive per month

Volume assumptions: 500 customers, growing 50/month, average 4 sequence emails per customer per year + ad-hoc inbound.

```
Bee 3 (LLM message composition):
  500 customers × 4 emails/year ÷ 12 = ~170 emails/month composed
  × $0.005 per compose = $0.85/month

Bee 4 (Resend email delivery):
  Free tier: 3,000 emails/month
  Paid: $20/month for 50k emails
  At 170 emails/month, well within free tier

Bee 5 (Inbound classification):
  ~30 inbound messages/month × $0.01 = $0.30

Bee 6 (Refund composition):
  ~5 refunds/month × $0.02 = $0.10

Bee 7 (Deliverability pinger):
  No LLM cost; API pulls free
  $0

Bee 8 (Chatbot — Phase 2+):
  Highly variable; budget separately when active

──────────────────────────────────────
TOTAL Phase 0-1:                  ~$1.25-$2/month LLM
+ $20/month Resend if scaled past free tier
```

Concierge Queen is the cheapest queen to run. Almost all cost is delivery infrastructure, not intelligence.

---

## §15 — How this maps to the locked principles

| Principle | Concierge Queen design honors it? |
|---|---|
| 1. Whoever made it owns it | ✓ Concierge sends a message → owns sequence state, message history, deliverability for her own outputs. |
| 2. Each queen self-monitors via pings | ✓ Bee 7 pings deliverability. Emits events on threshold breaches. |
| 3. Flat hive, no AI middle-management | ✓ Concierge escalates to operator on gates (refund approval, inbound replies). No queen above her. |
| 4. TrustMRR pub test | ✓ Intercom $1B+, Customer.io, Klaviyo are standalone analogs. |
| 5. Per-hive isolation | ✓ All Concierge tables are per-hive. Customer_state is per-hive (a customer of Tax Hive is a separate row from same person being a customer of future Visa Hive). |
| 6. Domain in-hive, methodology cross-hive | ✓ Hive-specific: sequence templates, refund policy by jurisdiction, persona voice. Generic: bee architecture, lifecycle sequence patterns, deliverability thresholds. |
| 7. Design backwards from outcome | ✓ Designed from concierge_messages + customer_state schemas backwards. |

---

## §16 — Critique points

1. **Customer_state schema is large.** Lots of fields, lots of state. Could split into separate tables (customer_purchases, customer_engagement, customer_preferences). I kept it as one for design clarity but real implementation will likely split.

2. **Sequence definition is YAML-config.** Means operator edits YAML to change sequences. Could be a UI in the dashboard. Phase 0: YAML is fine. Phase 1+: dashboard UI for editing sequences.

3. **Cross-hive customer identity.** If same person is in Tax Hive AND Visa Hive, are they one customer or two? Currently: two (per-hive isolation principle). But for cross-pollination across hives, you'd want to know. Defer this — only matters when there's a 2nd hive AND the person crosses hives.

4. **Auto-approve for inbound replies.** Currently all Bee 5 outputs need operator approval. This won't scale. Need an approved-template approach (operator pre-approves response templates; Bee 5 fills variables; auto-send when LLM matches a template confidently).

5. **Chatbot deferred to Phase 2.** Major capability missing. But the existing cole-chatbot skill is the reference. When Phase 2 starts, Bee 8 builds on that.

6. **Comment reply on social platforms.** Mentioned in scope but not deeply designed. Need: platform-specific reply mechanisms (YouTube comment API, LinkedIn comment, etc.). Treat as Phase 1.5.

7. **GDPR / Privacy Act / CAN-SPAM compliance** is sketched in config but not designed. Real implementation needs: consent capture flow, data export request handling, right-to-be-forgotten workflow. Substantial Phase 1 work.

8. **Sequence step idempotency.** What if Bee 1 fires Bee 3 twice for the same step (system restart, missed update)? Need idempotency key: `(customer_id, sequence_id, step)` enforced unique.

9. **Bee 6's stripe refund execution.** Real money flowing through automated code is the highest-risk function in Concierge Queen. Triple-check operator gate is mandatory. NEVER auto-refund without operator approval. Worth explicit policy.

10. **Bounce-rate circuit breaker.** Pausing all sends is heavy-handed. Maybe pause for affected segment only? But for new hives establishing sender reputation, even narrow problems can poison the whole domain. Default to conservative (pause all) and refine later.

---

## §17 — Sanity check against the operator's morning

Concierge Queen's morning surface:

1. **Inbound messages awaiting reply** (drafts from Bee 5)
2. **Refund requests** (drafts from Bee 6 + Stripe action button)
3. **Deliverability alerts** (warnings from Bee 7)
4. **Authority change notifications about to fire** (drafts from authority_change_notification sequence)
5. **Sequence performance summary** (read from Adaptive Queen later)

At ~500 customers: 10-30 inbound replies / day, 5-10 refund decisions / month, occasional deliverability events.

Operator time per day for Concierge: probably 15-25 minutes initially (high inbound review), reducing to ~10 minutes as templates get calibrated.

---

## §18 — Phase implementation roadmap

**Phase 0** (initial build):
- Bees 1, 2, 3, 4, 7
- Lifecycle sequences: post_purchase_followup, free_to_paid_nurture, authority_change_notification
- Resend integration for email
- Customer state tracking from Stripe + free-tier captures

**Phase 1** (add inbound):
- Bee 5 (Inbound Handler) for support emails
- Bee 6 (Refund Workflow)
- Cross-pollination sequences
- Privacy/GDPR/CAN-SPAM compliance flows

**Phase 1.5** (social reply):
- Comment replies on YouTube/LinkedIn (1:1 engagement)

**Phase 2** (chatbot):
- Bee 8 from cole-chatbot skill
- Router + post-purchase support roles

**Phase 3** (proactive):
- Detect engagement drops → proactive check-in
- Predictive re-engagement before dormancy

---

## §19 — Closing

This design is for critique. Strongest points to challenge:

- Customer_state schema breadth (split into multiple tables?)
- Auto-approve for inbound at scale
- Cross-hive customer identity (defer or plan now?)
- Stripe refund automation safety
- GDPR/CAN-SPAM compliance depth

If a critique lands, revise. If not, lock and move to Adaptive Queen next.

**End of Concierge Queen design.**
