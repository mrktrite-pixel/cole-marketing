# Distribution Queen — Design (Day 13)

**Status:** First draft for critique. Designed backwards from the locked architecture (COLE-ARCHITECTURE-LOCKED-DAY13.md, Principle 7).
**Scope:** Per-hive Distribution Queen.
**Method:** Outcome → Output → Bees → Sources. Bees fall out of requirements.

---

## §1 — The locked outcome

From the architecture document, Distribution Queen's one-line job:

> "Amplify the finished product to broadcast channels."

She is the **ad agency** of the hive. She reads Production Queen's finished products and regurgitates them into channel-specific formats. She does NOT research. She does NOT write from scratch. She reformats and amplifies.

**Hard line:** broadcast only. 1:1 customer messages are Concierge Queen's job. The test: does the message exist because of a publishing event or a customer event? Publishing event → Distribution. Customer event → Concierge.

She owns:
- YouTube video scripts (and eventually production)
- Social posts (LinkedIn, Twitter/X, etc.)
- Newsletter blasts
- TikTok hooks and shorts
- "New product released" announcements to subscriber lists
- Published asset liveness (her own pings on her own outputs)
- Channel-specific reformatting of one product into many formats

She does NOT do:
- Research (Production Queen owns)
- 1:1 customer emails (Concierge Queen owns)
- Customer support replies (Concierge Queen owns)
- Performance measurement (Adaptive Queen owns)
- Infrastructure (Governance Queen owns)
- Product revisions when authority changes (she gets notified, doesn't rewrite content herself — she repurposes whatever Production Queen revised)

---

## §2 — Inputs and outputs

### Input: a finished product

Distribution Queen reads from `products` where `state = LIVE` and `distribution_pickup_at IS NULL` (a tracker field she adds).

The product gives her everything:
- canonical_question + short_question
- topic_summary (the 2-4 sentence AI-citation-ready answer)
- hero_copy + faq_items + customer_language_pack (the persona voice, the fear/hope/confusion phrases)
- competitor_audit + differentiation_hook (why this product wins)
- calculator_spec (so she can describe what users get)
- authority_grounding (so videos can cite the same sources)
- related_products (cross-pollination cues)

### Input: revision triggers

She also reads `revision_events` for products she's already published content about. When a product is panelbeated by Production Queen, her existing published assets may need refresh or supersession.

### Input: newsletter / broadcast event triggers

- Operator triggers a manual broadcast
- Scheduled cadence (weekly newsletter, etc.)
- Strategic Queen events for "new gap detected and product launched" announcements

### Output: published assets across channels

She writes to `content_publications`:

```
content_publications (per-hive table)
─────────────────────────────────────────

PRIMARY KEY
  publication_id          uuid
  hive                    e.g. "tax"

LINEAGE
  source_product_id       reference to products (which product this amplifies)
  source_revision_event_id null or reference (if this is a revision publication)
  parent_publication_id   null for fresh; populated for revisions

CHANNEL
  channel                 youtube | linkedin | twitter | newsletter |
                          tiktok | instagram | reddit_post (rare) |
                          forum_post | blog
  channel_account_id      which account/page (if hive has multiple)

ASSET TYPE
  asset_type              video | short | thread | post | email_blast |
                          carousel | image_post

CONTENT
  title                   for video / blog / email
  body                    full text content (script, caption, post body)
  asset_urls              array of generated media URLs (image, video, audio)
  thumbnail_url           if applicable
  hashtags                array
  cta_text                e.g. "Get your risk score at taxchecknow.com/frcgw"
  cta_url                 deep link to source_product_id's page

PUBLICATION STATE
  state                   DRAFT | SCHEDULED | PUBLISHED | FAILED | RETIRED
  scheduled_for           timestamp (if SCHEDULED)
  published_at            timestamp
  external_id             the platform's ID for the asset (YouTube video ID,
                          tweet ID, etc.)
  external_url            public URL of the published asset

PING DATA
  last_pinged_at          timestamp
  liveness_state          OK | 404 | UNAVAILABLE | REMOVED_BY_PLATFORM
  publication_metrics     { views, likes, comments, ... } updated by pings

OPERATOR APPROVAL
  approval_status         PENDING | APPROVED | REJECTED | AUTO_APPROVED
  approved_by             operator id
  approved_at             timestamp
```

She also writes to `broadcast_email_blasts` (newsletter/announcements — broadcast only):

```
broadcast_email_blasts (per-hive)
────────────────────────────────

blast_id                 uuid
trigger                  newsletter_scheduled | new_product_launched |
                         operator_manual | seasonal_campaign
subject_line             in hive's voice
body                     html + text versions
audience_segment         "all_subscribers" | "tax_paying_customers" |
                         "free_tier_users" | "newsletter_only"
                         (broadcast — not 1:1)
scheduled_for            timestamp
sent_at                  timestamp
metrics                  { opens, clicks, bounces, unsubs }
approval_status          ...
```

---

## §3 — The bees that produce these outputs

Working backwards from the channels:

```
Bee 1: Channel Adapter (YouTube)     →  video script + thumbnail prompts
                                       + chapter timestamps + description

Bee 2: Channel Adapter (Short-form)  →  TikTok / Shorts / Reels hooks
                                       (1-2 sentence opener + 30-60s outline)

Bee 3: Channel Adapter (LinkedIn)    →  professional/B2B post variants
                                       (different angle from Twitter/X)

Bee 4: Channel Adapter (Twitter/X)   →  thread + single-tweet variants

Bee 5: Channel Adapter (Newsletter)  →  email blast body
                                       (newsletter cadence + product launches)

Bee 6: Publisher                     →  posts to platform APIs
                                       captures external_id, external_url

Bee 7: Asset Liveness Pinger         →  pings each PUBLISHED asset
                                       updates liveness_state + metrics
                                       emits events on failures

Bee 8: Revision Repurposer           →  when Production Queen revises a
                                       product, identifies affected assets
                                       and proposes refresh or retirement
```

**Eight bees.** Five channel adapters (each is a small dedicated transformer), one publisher (handles API calls to platforms), one liveness pinger, one revision repurposer.

The five channel adapters fire **in parallel** for the same source product. They each produce a draft publication. Operator approves (or auto-approves per config) → Publisher fires.

---

## §4 — Bee 1: YouTube Channel Adapter

### Purpose
Take a product, produce a YouTube video script (script-only — actual video production is deferred).

### Input
- A `products` row
- Hive config: persona voice, channel branding, video style preferences

### Output
- A `content_publications` row with `channel = youtube`, `asset_type = video`
- Title, description, full script (with chapter markers), thumbnail prompts, hashtags, CTA

### Method

#### Step 1 — Title
LLM prompt:
> "Generate a YouTube video title for a video answering '{canonical_question}'. Match the voice of {persona}. Maximum 60 characters. Include the question's emotional hook (from `customer_language_pack.fear_phrases`)."

#### Step 2 — Description
Standard YouTube description template:
- Hook (2 sentences from `topic_summary`)
- What you'll learn (3-5 bullets from FAQ items)
- CTA: "Get your personalised result at [URL]"
- Authority links (the primary_authority URL — gives YouTube + AI engines a citation trail)
- Timestamps (from chapter markers — see Step 4)

#### Step 3 — Script structure

Long-form, 8-15 minutes. Structure:

```
0:00 - Hook (the canonical question + the fear)
0:30 - Why this matters (the urgency / risk)
1:30 - The legal/regulatory ground truth (from authority)
3:00 - Common mistakes (from competitor_audit's "their_gap")
5:00 - How to know if you're at risk (a walk-through of calculator inputs)
8:00 - What the result means + recommended actions
11:00 - FAQ rapid-fire (top 4-6 from faq_items)
13:00 - CTA + next steps
```

LLM prompt to assemble:
> "Write a YouTube video script in the voice of {persona}, structured as above. Use the product's customer_language_pack for emotional phrasing. Cite primary_authority by name when discussing legal positions. End with a clear CTA to the product page. Length target: 10-12 minutes when read aloud."

#### Step 4 — Chapter markers

Embedded in description. From the research:
> *Videos that include timestamps or chapter markers get cited 3x more in AI overviews. 78% of timestamped videos cited by AI are cited at multiple chapters.*

So timestamps are not cosmetic. They're a citation-yield feature.

LLM prompt:
> "Convert this script into YouTube chapter markers. Format: [HH:MM:SS] [Chapter Title]. Make chapter titles question-shaped where possible (matches AI grounding query patterns)."

#### Step 5 — Thumbnail prompts

For each video, three thumbnail prompts (operator picks one):
- Variant A: emotional/fear-driven (matches fear_phrases)
- Variant B: calculator/result-focused (shows the personalisation)
- Variant C: authority-focused (cites ATO/HMRC visually)

Image generation deferred to operator's image tooling. Distribution Queen produces the prompts only at this phase.

#### Step 6 — Hashtags

LLM prompt:
> "Generate 10-15 YouTube hashtags for this video. Prioritize ones that match the fan_out_queries (these are what AI engines search for, so matching tags increases citation odds)."

### Edge cases

- **Long products** (calculator with 7 inputs, complex logic) — script may run >15 min. Operator can request multi-part series.
- **Short products** (simple decision tree) — script may compress to 5-7 min. Mark as `short_form_long = true` so Bee 2 doesn't double up with a TikTok version of essentially the same thing.

---

## §5 — Bee 2: Short-Form Channel Adapter (TikTok / Shorts / Reels)

### Purpose
Generate 30-60 second hooks for short-form platforms. Different shape from long-form — purely top-of-funnel attention grab.

### Input
- A `products` row
- Optionally: the YouTube long-form video URL (for "watch full version" CTA)

### Output
- 3-5 `content_publications` rows, each `asset_type = short`, different platforms
- Each with hook + outline + on-screen text + CTA

### Method

#### Step 1 — Hook variants

Generate 5 different hooks, all targeting the same product. LLM prompt:
> "Write 5 different 1-sentence hooks for a short-form video about '{canonical_question}'. Each should:
> - Be ≤12 words
> - Stop the scroll (use fear, surprise, or specific number)
> - Reference the user's situation, not the abstract topic
> Variants:
> 1. Fear hook (lead with the worst-case scenario)
> 2. Specific number hook (a striking statistic from the authority)
> 3. Question hook (a question the viewer would type into Google)
> 4. Mistake hook ('You're doing X wrong if...')
> 5. Urgency hook (time-pressure framing)"

#### Step 2 — Outline for each hook

For each accepted hook (operator picks 2-3), produce a 30-45 second outline:

```
0:00 [Hook]
0:05 [Specific stat or fear amplification]
0:15 [The "secret" or actual answer in plain English]
0:30 [CTA to full product / long-form video]
```

#### Step 3 — On-screen text

Short-form platforms reward heavy on-screen text. Generate the text overlay sequence corresponding to the audio script.

### Edge cases

- **Topic doesn't lend itself to short-form** (e.g., complex multi-input calculator with no single "wow" stat) — skip short-form generation. Mark `short_form_skipped = true` with reason.
- **Operator wants series of shorts** — generate 5-7 shorts each highlighting a different FAQ item, all CTA'ing to the same product.

---

## §6 — Bee 3: LinkedIn Channel Adapter

### Purpose
Professional/B2B framing of the same topic. Different audience than YouTube/short-form.

### Input
- A `products` row

### Output
- A `content_publications` row, channel = linkedin, asset_type = post
- Plus optionally a "long-form LinkedIn article" if the topic warrants

### Method

#### Step 1 — Audience reframing

LinkedIn audience = tax professionals, accountants, business owners. Different angle:
- Less fear, more competence/expertise framing
- "Here's what your client may not know about X"
- Data-led: lead with the statistic

#### Step 2 — Post structure

```
Hook (2 lines, stop the scroll)
[blank line]
The context (3-4 sentences)
[blank line]
The actual content (5-7 lines — the substantive answer)
[blank line]
The takeaway / CTA
```

LLM prompt:
> "Write a LinkedIn post about '{canonical_question}' in a professional B2B voice. Lead with a data point or surprising fact. Position as 'something your client might not know.' End with CTA to the product. Length: 200-280 words."

#### Step 3 — Long-form article (optional)

If the product has high authority_grounding confidence AND the canonical_question is one accountants/advisors would research, generate a longer LinkedIn article. ~800-1200 words. Structured like a brief professional guide. Higher citation yield in B2B-relevant AI queries.

### Edge cases

- **Topic is too consumer-facing for LinkedIn** (e.g., personal property sale anxiety) — skip LinkedIn generation. Or reframe through an advisor's lens ("when your client is selling...").
- **Hive is consumer-only** (no B2B angle exists) — skip LinkedIn entirely for that hive.

---

## §7 — Bee 4: Twitter/X Channel Adapter

### Purpose
Short-form text. Threads + single-tweet variants. Optimized for share/retweet.

### Input
- A `products` row

### Output
- A `content_publications` row, channel = twitter, asset_type = thread
- Plus optionally a single-tweet variant

### Method

#### Step 1 — Thread structure

Threads work for explainer content. 5-12 tweets max.

LLM prompt:
> "Convert this product into a Twitter/X thread of 6-10 tweets. Structure:
> Tweet 1: The hook (counter-intuitive or fear)
> Tweet 2-3: The setup (why this matters)
> Tweet 4-8: The substance (the actual answer, broken into tweet-sized chunks)
> Tweet 9-10: The takeaway + CTA
> Each tweet ≤270 characters. Use formatting (bullets, em-dashes) sparingly."

#### Step 2 — Single-tweet variant

For operators who prefer single-tweet posting. One tweet that captures the hook + CTA.

### Edge cases

- **Topic is too jurisdictional for global Twitter audience** — keep tweet count low, focus on universal-feeling framing (fear / surprise) rather than jurisdiction-specific specifics.

---

## §8 — Bee 5: Newsletter Channel Adapter

### Purpose
Broadcast email to subscriber list. Triggered by: (a) new product launched, (b) scheduled weekly newsletter, (c) operator manual, (d) seasonal campaign.

### Input
- For (a): a new product
- For (b): all products published in the last week (or other window)
- For (c) / (d): operator-supplied theme

### Output
- A `broadcast_email_blasts` row with subject + body + audience_segment

### Method

#### Variant A: New-product launch email

> "We just released a new tool: [Product short_question]"

Body:
- Lead with the hero_copy headline
- Brief context (2-3 sentences)
- What the tool delivers (calculator overview, recommended_actions)
- CTA: "Try the [product name] now"
- P.S. with cross-pollination cue (related_products[0])

#### Variant B: Weekly newsletter

Curated digest. Top 3-5 things to cover:
- New products launched this week
- Authority changes detected (from Bee H pings — selected ones relevant to subscribers)
- Cross-hive learnings (if Orchestrator surfaces something)
- One "from the archive" — an older product that's seasonally relevant

LLM prompt to compose, in hive's editorial voice.

#### Variant C: Operator manual

Operator supplies theme, draft, or just trigger. Bee 5 expands to full email.

#### Variant D: Seasonal campaign

Tax season, budget announcement, end-of-financial-year — pre-configured in hive calendar. Bee 5 generates campaign-appropriate content with all products tagged as relevant for that season.

### Audience segmentation (broadcast-only)

Important: Distribution Queen sends to **segments**, not individuals. Segments are:
- `all_subscribers` — everyone
- `customers` — anyone who's bought something
- `free_tier_users` — used free calculator, never bought
- `newsletter_only` — opted into newsletter but no engagement otherwise
- `product_category_X` — bought a specific product category (e.g., all FRCGW buyers)

Individual customer state (purchase recency, last login, support history) is **Concierge Queen's domain.** Distribution Queen does not send 1:1 messages — even segmented broadcasts go to all members of a segment with the same content.

### Edge cases

- **No content to send for weekly newsletter** (slow week) — skip with operator notification. Don't send empty newsletters.
- **Segment overlap** — operator decides which segment a given blast targets. Bee 5 doesn't deduplicate across segments (intentional — different blasts may legitimately reach the same person if relevant).

---

## §9 — Bee 6: Publisher

### Purpose
After operator approval, post drafts to actual platform APIs.

### Input
- A `content_publications` row in state `APPROVED`

### Output
- Updates the row to `PUBLISHED`, captures `external_id`, `external_url`
- Or marks as `FAILED` with error log

### Method

Per channel, a dedicated publishing routine:

#### YouTube
- YouTube Data API v3 `videos.insert`
- Or: queue for manual upload (if video file production is operator-handled, which is likely Phase 0)
- Operator confirms upload → Bee 6 captures the resulting YouTube URL + ID

#### LinkedIn
- LinkedIn API for posts (requires OAuth)
- Or: queue for manual posting if API access is restricted

#### Twitter/X
- Twitter API v2 for thread posting
- Subject to current API pricing (which has shifted considerably; see locked architecture doc)
- May default to "queue for manual posting" if API costs unsustainable

#### Newsletter
- Resend / SendGrid API for email broadcast
- Triggers send to audience_segment

#### Short-form (TikTok / Reels)
- Usually no API for direct posting
- Queue for manual upload
- Distribution Queen produces the script + on-screen text; operator uploads

#### Reddit posts
- Possible but VERY careful — Reddit ToS sensitivities
- Default: do not auto-post to Reddit. Operator manually posts if at all.

### Failure handling

If API call fails:
- Mark as FAILED with error
- Notify operator
- Operator can retry, or queue for manual posting

### Edge cases

- **Platform API down** — Bee 6 retries with exponential backoff (max 3 retries), then escalates.
- **Rate limit hit** — Bee 6 queues with delay, respects rate limits per platform.

---

## §10 — Bee 7: Asset Liveness Pinger

### Purpose
After publishing, watch each published asset for liveness and pull metrics.

### Input
- All `content_publications` in state `PUBLISHED`

### Output
- Updated `last_pinged_at`, `liveness_state`, `publication_metrics`
- Events on state changes (404, removed, etc.)

### Method

#### Per-channel ping logic

**YouTube:**
- HEAD request to external_url — should return 200
- YouTube Data API `videos.list` with the external_id — fetch viewCount, likeCount, commentCount
- Cadence: every 24 hours

**LinkedIn / Twitter / TikTok / etc.:**
- HEAD request to external_url
- If platform has API for metrics, pull; if not, just liveness check
- Cadence: every 24-48 hours

**Newsletter:**
- Resend webhook delivers open/click/bounce metrics back
- Bee 7 reads from webhook log and aggregates per blast
- Cadence: continuous via webhook + periodic reconciliation

### Event emission

- `liveness_404` → asset gone (deleted by platform or operator)
- `liveness_unavailable` → temporary issue
- `metrics_anomaly` → if views/clicks drop 50%+ vs baseline (Adaptive Queen will diagnose; Distribution Queen just emits the signal)

### Edge cases

- **Platform changes URL structure** — HEAD checks return 301/302; follow redirect; update external_url; log change.
- **Asset removed by platform** (e.g., YouTube takedown) — mark `liveness_state = REMOVED_BY_PLATFORM`, escalate to operator.

---

## §11 — Bee 8: Revision Repurposer

### Purpose
When Production Queen revises a product (via the panelbeat flow), determine what Distribution Queen needs to do about the published assets that point to that product.

### Input
- A `revision_event` from Production Queen (product X has been revised, here's what changed)
- All `content_publications` where `source_product_id = X`

### Output
- For each affected publication, a recommendation:
  - **REFRESH** — produce a new asset with the updated information (e.g., re-record video with new threshold value)
  - **ANNOTATE** — add a comment / pinned reply / update note on existing asset
  - **RETIRE** — supersede with newer content; flag for archival
  - **NO_CHANGE** — the revision doesn't affect this asset (e.g., FAQ update doesn't affect a video that only covered the calculator)

### Method

For each affected publication:

#### Step 1 — Diff the revision

What specifically changed in the product? From the revision_event:
- Sections affected (e.g., "FAQ items 3, 7" + "calculator threshold value")
- Authority that changed (e.g., new ATO page)

#### Step 2 — Map to asset content

LLM prompt:
> "Given this published asset (script/post/email) and the product revision summary, does the asset need:
> (a) full refresh — the asset is materially affected by the change
> (b) annotation — minor update, easier to annotate than re-create
> (c) retirement — supersede with newer content
> (d) no change — asset doesn't cover the affected sections
> Provide recommendation + 1-sentence rationale."

#### Step 3 — Generate refresh draft (if REFRESH)

If REFRESH recommended, Bee 8 hands off to Bees 1-5 (the channel adapters) to produce a new draft of the same asset type. Versioning is preserved via `parent_publication_id`.

#### Step 4 — Generate annotation copy (if ANNOTATE)

For platforms that support it (YouTube has pinned comments, LinkedIn has post comments), Bee 8 drafts an annotation:

> "UPDATE (May 2026): The ATO has revised the FRCGW threshold from 12.5% to 15%. The current threshold information is at [link to revised product page]."

Operator approves the annotation. Bee 6 posts it as a pinned comment.

#### Step 5 — Operator review

For each affected asset, operator sees the recommendation + rationale + draft (if applicable) and approves the action.

### Edge cases

- **Cascading revisions** — one law change affects 30 products, each with 5 published assets = 150 assets to evaluate. Bee 8 batches by product revision; operator gets digest, not 150 alerts.
- **Asset has high engagement, refresh would lose it** (e.g., YouTube video with 100k views) — recommend ANNOTATE over REFRESH; supersede only when annotation no longer suffices.

---

## §12 — Lifecycle orchestration

### Phase 1: New product pickup
- Distribution Queen polls `products` for `state = LIVE AND distribution_pickup_at IS NULL`
- One product at a time per Distribution Queen instance (configurable parallelism)
- Marks pickup time

### Phase 2: Parallel channel adaptation (Bees 1-5)
- Bees 1, 2, 3, 4, 5 fire in parallel for the same source product
- Each writes a draft `content_publications` row in their channel
- Wait for all to complete (with per-bee timeouts and graceful skip)

### Phase 3: Operator approval
- All drafts surface in Distribution Queen panel as "Pending Approval"
- Operator reviews per channel
- Approves, rejects, edits, or batches

### Phase 4: Publishing (Bee 6)
- For each APPROVED draft, Bee 6 fires
- Captures external_id, external_url
- State moves to PUBLISHED

### Phase 5: Continuous monitoring (Bee 7)
- All PUBLISHED assets pinged on cadence
- Liveness + metrics updated
- Events emitted on anomalies

### Phase 6: Revision handling (Bee 8)
- On product revision event from Production Queen
- Bee 8 evaluates affected publications
- Recommends actions, operator approves, Bees 1-6 execute revisions

---

## §13 — Auto-approve and operator gate density

Distribution Queen has many outputs (5 channels × N products = lots of drafts). Manual approval of every draft doesn't scale.

### Suggested gate model

```yaml
distribution_approval:
  default: pending  # operator review required

  auto_approve_when:
    - channel: newsletter
      content_type: new_product_launch
      product_authority_confidence: ">= 0.9"
      # auto-approve confident product launches

    - channel: linkedin
      content_type: post
      product_authority_confidence: ">= 0.85"
      # auto-approve B2B posts on solid products

    - channel: twitter
      content_type: single_tweet
      product_authority_confidence: ">= 0.8"
      # tweets are low-stakes

  always_require_approval:
    - channel: youtube       # video is high investment
    - channel: tiktok        # consumer-facing high visibility
    - product_authority_confidence: "< 0.7"
    - asset_type: video       # any video format
```

Operator tunes thresholds based on what's actually working (from Adaptive Queen feedback). Aggressive auto-approve once trust is established.

---

## §14 — Cost per product per channel

```
Bee 1 (YouTube script):              ~$0.40
Bee 2 (Short-form, 3 hooks + outlines): ~$0.20
Bee 3 (LinkedIn post + optional article): ~$0.15-$0.40
Bee 4 (Twitter thread + single):     ~$0.10
Bee 5 (Newsletter, if launch):       ~$0.15

──────────────────────────────────────
Per product (all channels):          ~$1.10-$1.40
```

Bees 6, 7, 8 are infrastructure (API calls, pings) — pennies per ping per asset.

At 5 new products/month × full channel coverage = ~$7/month per hive on Distribution Queen LLM costs. Cheaper than Production Queen because no fresh research, just reformatting.

---

## §15 — Hive-config dependencies

Distribution Queen needs hive-level config:

```yaml
distribution_config:
  enabled_channels:
    youtube: true
    short_form: true
    linkedin: true
    twitter: true
    newsletter: true
    tiktok: false  # operator may disable some

  channel_accounts:
    youtube:
      channel_id: "..."
      api_credentials: ...
    linkedin:
      page_id: "..."
      api_credentials: ...
    newsletter:
      provider: "resend"
      audience_segments:
        - "all_subscribers"
        - "customers"
        - "free_tier_users"

  voice_per_channel:
    # Some channels need adjusted voice from product's persona
    linkedin: "professional_advisor_voice"  # override hive default
    youtube: "default"  # use product's persona

  schedule:
    newsletter:
      cadence: "weekly"
      day: "tuesday"
      time: "09:00 UTC"
    youtube:
      max_per_week: 2  # rate-limit publishing
```

This is per-hive because tax hive may have different channel mix than visa hive.

---

## §16 — How this maps to the locked principles

| Principle | Distribution Queen design honors it? |
|---|---|
| 1. Whoever made it owns it | ✓ Distribution Queen publishes → owns asset liveness, revision repurposing, metrics for her own assets. |
| 2. Each queen self-monitors via pings | ✓ Bee 7 pings published assets. Emits events on liveness/metric anomalies. |
| 3. Flat hive, no AI middle-management | ✓ Distribution Queen escalates to operator for approval; no queen above her. |
| 4. TrustMRR pub test | ✓ Postiz $115k MRR is the standalone analog. |
| 5. Per-hive isolation | ✓ All Distribution Queen tables are per-hive. |
| 6. Domain in-hive, methodology cross-hive | ✓ Hive-specific: channel accounts, voice per channel, audience segments. Generic: bee architecture, channel adapter patterns, cadence patterns. |
| 7. Design backwards from outcome | ✓ Designed from content_publications schema backwards. |

---

## §17 — Critique points

1. **Five channel adapters is a lot.** Could fold short-form + Twitter into one "short text" adapter. I kept them separate because the voice/format differs meaningfully (Twitter threads vs TikTok hooks aren't the same shape). Open to merging.

2. **Video production is deferred.** Bee 1 produces a script. Actual video creation (voiceover, B-roll, edits) is currently manual operator work. At some point, COLE will need a video-production capability — but that's a substantial Phase 2+ build (HeyGen / Synthesia / native AI video integration). Flag for the deferred items list.

3. **Reddit posting deliberately excluded.** No auto-post to Reddit due to ToS sensitivities. Operator may manually post. Matches the Reddit-free architecture decision but worth being explicit.

4. **Audience segmentation is shallow.** Five segments isn't a lot. Real email systems get into behavioral targeting. But Distribution Queen is broadcast-only — fine-grained targeting belongs to Concierge Queen. The shallow segmentation is intentional.

5. **No cross-hive distribution coordination.** If Tax Hive and Visa Hive both publish on the same day, are we spamming subscribers? Currently each hive operates independently. At 5+ hives, this might need Orchestrator-level coordination. Defer.

6. **Bee 8 LLM judgment on REFRESH vs ANNOTATE.** This is a real call. Getting it wrong wastes work (refresh when annotate would do) or leaves stale assets (annotate when refresh needed). Worth calibrating on first 3-5 revisions.

7. **Operator gate density.** With 5 channels per product, even with auto-approve, operator faces dozens of decisions per new product. The auto-approve config helps but needs to be tuned to avoid either rubber-stamp fatigue or paralysis.

8. **Channel adapter overlap.** Bees 1, 2 both might want to use the same FAQ items. Currently each bee reads independently. Could cache shared LLM-generated artifacts (e.g., key statistic extraction) but adds complexity. Skip for now; revisit if cost becomes issue.

9. **Publishing failure recovery.** Bee 6 retries on API failure but operator can be left with assets in PENDING_PUBLISH state for days if not noticed. Governance Queen could ping for stalled publications. Cross-queen coordination point.

10. **Metrics interpretation.** Bee 7 captures views, likes, etc. — but interpreting "did this content work" is Adaptive Queen's job. Currently I have Bee 7 emit `metrics_anomaly` events for large drops. Should it also emit for large increases (something is going viral)? Probably yes. Easy addition.

---

## §18 — Sanity check against the operator's morning

Distribution Queen's morning surface:

1. **Drafts pending approval** — for each new LIVE product, the channel drafts await review
2. **Revision drafts** — when Production Queen revises a product, Bee 8 produces revision proposals for affected assets
3. **Liveness alerts** — any published assets that 404'd or got removed by platforms
4. **Anomalies** — assets with sudden drop or surge in metrics

Operator time per day for Distribution: probably 10-15 minutes reviewing drafts, plus occasional revision approvals.

---

## §19 — Closing

This design is for critique. Strongest points to challenge:
- 5 channels vs collapsing some
- Video production deferred — when do we add it?
- Auto-approve threshold tuning
- Cross-hive publishing coordination at scale
- Bee 8's REFRESH/ANNOTATE judgment quality

If a critique lands, revise. If not, lock and move to Concierge Queen next.

**End of Distribution Queen design.**
