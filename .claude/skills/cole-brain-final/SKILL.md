---
name: cole-brain-final
description: >
  The complete COLE Marketing Brain — final locked architecture.
  Use this skill whenever: building any marketing bee, manager bee,
  or queen bee. Designing the hive structure. Building the content
  pipeline. Setting up platform specialist teams. Designing the
  manager quality gate layer. Expanding Soverella content tab.
  Triggers for: "build the brain", "build a bee", "manager bee",
  "content quality gate", "platform specialist", "hive architecture",
  "story writer bee", "distribution bee", "LinkedIn team", "YouTube team",
  "token routing", "CHARACTERS.md", "PRODUCTS.md", or any question
  about the COLE marketing system architecture.
  READ THIS BEFORE BUILDING ANY BEE OR MANAGER.
  The architecture is final. 57 bees total. Build within it.
---

# COLE BRAIN — Final Locked Design
# Version 2.0 — April 2026
# DO NOT MODIFY WITHOUT READING ENTIRE DOCUMENT

---

## WHAT THIS IS

The complete autonomous marketing brain for the COLE 
Citation Gap Commerce Engine. Built on Claude Code native
sub-agent architecture. No Flowise needed. No n8n needed yet.
Soverella is the visual control room.

Every piece of content has ONE job:
Send someone to a calculator page.

---

## THE STACK — LOCKED

```
BRAIN:      Claude Code .claude/agents/ (native sub-agents)
MEMORY:     Supabase (shared across all bees)
CONTROL:    Soverella (your visual dashboard — expand it)
PRODUCTS:   taxchecknow.com (46 live, Next.js, Vercel)
PUBLISHING: Direct API calls (YouTube, LinkedIn, X, Meta)
INDEXING:   IndexNow + Google Indexing API (Distribution Bee)

NOT NEEDED YET:
  Flowise — add at Phase 3 if team grows beyond 3 people
  n8n — add at Month 3 when 3+ platforms auto-publishing
  Airtable — Supabase is better, you own it
```

---

## TOKEN ROUTING — EVERY BEE MUST FOLLOW THIS

```
TIER 0 — Free ($0):
  git operations, file reads/writes, API calls,
  database reads/writes, build commands,
  URL checks, sitemap updates, IndexNow pings,
  llms.txt updates, Distribution Bee tasks

TIER 1 — Claude Haiku (~$0.001/task):
  formatting, resizing, subject line variants,
  thumbnail text, yes/no classifications,
  selecting best option from a list,
  short summaries under 100 words

TIER 2 — Claude Sonnet (~$0.01/task):
  writing Gary stories, video scripts,
  platform adaptation, email templates,
  question articles, research synthesis,
  hook matrix generation, strategy documents

TIER 3 — Claude Opus (~$0.05/task):
  new product strategy from scratch only,
  GOAT audits, marketing psychology analysis,
  Strategic Queen decisions only
  NEVER for: formatting, publishing, research

TARGET: Under $150/month total Claude API cost
  70% Tier 0 | 20% Tier 1-2 | 10% Tier 3
```

---

## THE KNOWLEDGE BASE — EVERY BEE READS THESE

```
cole-marketing/
  VOICE.md          ← brand voice, Gary's voice,
                       banned phrases, pub test
  PLAN.md           ← plan before edit rule
  CHARACTERS.md     ← all 5 characters, full profiles
  PRODUCTS.md       ← all 46 products, fear numbers, URLs
  COMPETITORS.md    ← Research Bee fills this weekly
  PERFORMANCE.md    ← Analytics Bee updates this weekly
```

---

## THE BEE FILE TEMPLATE — EVERY AGENT USES THIS FORMAT

```markdown
# [Bee Name]

## Token Routing
DEFAULT MODEL: claude-haiku-4-5-20251001
UPGRADE TO SONNET: if writing content >200 words
UPGRADE TO OPUS: never without Strategic Queen authorisation

## Role
[one sentence — what this bee does]

## Status
FRAME | BUILDING | COMPLETE

## Before Starting (mandatory checklist)
1. Read VOICE.md
2. Read CHARACTERS.md
3. Read PLAN.md (researcher ran first?)
4. Check Supabase for existing research on this product
5. Use cheapest model tier that can do the job

## Triggers
[what activates this bee]

## Inputs
[what it reads and from where]

## Outputs
[what it produces + where it stores in Supabase]

## Hands off to
[next bee in the chain]

## Cost estimate per run
Tier 0: [which steps are free]
Tier 1: [which steps use Haiku]
Tier 2: [which steps use Sonnet]
Total per run: ~$[X]
```

---

## THE QUEEN AND HER THREE MINIONS

```
┌─────────────────────────────────────────────────────┐
│                   THE QUEEN BEE                     │
│              COLE ORCHESTRATOR                      │
│                                                     │
│  Reads: PERFORMANCE.md + gap_queue + weekly report  │
│  Decides: what to build next + which site           │
│  Coordinates: all three hives                       │
│  Reports to: you (via Soverella)                   │
│  Model: Opus (strategic decisions only)             │
│  Frequency: weekly review + on-demand               │
└──────────────────┬──────────────────────────────────┘
                   │
    ┌──────────────┼──────────────────┐
    ▼              ▼                  ▼
STRATEGIC       TACTICAL          ADAPTIVE
  QUEEN           QUEEN              QUEEN
"What to        "Build and         "Is it working?
 build next"     sell it"           Fix it."
    │              │                  │
    ▼              ▼                  ▼
 HIVE 1          HIVE 2            HIVE 3
RESEARCH      BUILD+MARKET       OPTIMISE
```

---

## HIVE 1 — RESEARCH & DISCOVER
*Strategic Queen coordinates. Runs continuously.*
*Feeds Hive 2 with what to build and how to position it.*

### 1.1 Citation Gap Finder
```
Token: Haiku (classifies) + Sonnet (analyses gap)
Role: Finds topics where AI gives wrong answers.
      Site-agnostic — queen decides taxchecknow vs
      theviabilityindex vs future sites.
      Also flags stale products needing updates.
Runs: Daily automated scan
Input: Perplexity/ChatGPT answers on tax topics
Output: gap_queue table in Supabase
        {topic, site, ai_error, correct_law,
         search_volume, urgency, recommended_product}
Hands to: Strategic Queen for approval
Cost/run: ~$0.02
```

### 1.2 Market Researcher
```
Token: Haiku (fetches) + Sonnet (synthesises)
Role: Finds every question ever asked about each topic.
      Outputs exact questions for Article Builder.
Sources: Reddit API, Google autocomplete,
         People Also Ask, AnswerThePublic API,
         YouTube comment analysis, Quora
Input: product-slug
Output: research_questions table in Supabase
        20-50 exact questions per product
        Sorted by search volume
        Reddit threads flagged for Reddit Writer
Hands to: Article Builder + Reddit Writer
Cost/run: ~$0.015
```

### 1.3 Customer Psychologist
```
Token: Sonnet (synthesis and insight)
Role: Analyses Supabase data to understand
      why people buy. Finds which fear numbers
      and situations convert best.
      Feeds all copy workers.
Input: purchases + decision_sessions + leads tables
Output: psychology_insights table in Supabase
        {product, best_fear_format, converting_demo,
         best_utm_source, conversion_rate, insight}
Runs: Weekly (Monday morning)
Hands to: Copywriter + Hook Matrix + Ad Buyer
Cost/run: ~$0.02
```

### 1.4 Competitor Monitor
```
Token: Haiku (classifies results)
Role: Watches for new competitors in citation gap space.
      Identifies weaknesses to exploit.
Input: GPT Store, Product Hunt, Perplexity citations,
       Google top 10 for target keywords
Output: COMPETITORS.md updated
        Competitors table in Supabase
Runs: Weekly
Hands to: Strategic Queen
Cost/run: ~$0.005
```

### 1.5 Analytics Reader
```
Token: Sonnet (synthesis)
Role: Weekly performance report across all channels.
      What content drove what purchases.
      Reads GA4 + Supabase + email performance.
Input: purchases, leads, content_performance,
       email_log tables + GA4 API
Output: PERFORMANCE.md updated weekly
        Weekly report to Soverella analytics tab
Runs: Every Monday 8am (cron)
Hands to: Adaptive Queen + Idea Generator
Cost/run: ~$0.02
```

---

## HIVE 2 — BUILD + SELL + MARKET
*Tactical Queen coordinates. Two parallel sub-swarms.*

### SUB-SWARM A — PRODUCT BUILDERS
*Run in parallel when new product approved.*
*Full spec in taxchecknow-product-builder skill.*

```
2A.1 Config Architect     → writes ProductConfig
2A.2 Calculator Builder   → builds calculator TSX
2A.3 Quality Checker      → npm run build green
2A.4 Delivery Mapper      → DELIVERY_MAP + getPriceId
2A.5 Deployer             → git push + Vercel + 200 confirm
```

All Token: Sonnet (Haiku for simple checks)
All read: VOICE.md for copy fields in configs

### SUB-SWARM B — CONTENT CREATORS
*Run in parallel with Sub-Swarm A.*
*Also runs independently for existing products.*

#### 2B.1 Hook Matrix Bee
```
Token: Sonnet (generates) + Haiku (selects top 3)
Role: MUST run before any content is written.
      Generates 20+ hook variations per product.
      Hook types: Factual, Question, Absurd,
      Provocative, Relatable, Statistic, Threat, Contrast
Input: product config + psychology_insights
Output: hook_matrix table in Supabase
        20 hooks stored as JSON
        Top 3 marked as recommended
Hands to: Story Writer + Copywriter + Chaos Agent
Cost/run: ~$0.012
```

#### 2B.2 Chaos Agent
```
Token: Sonnet
Role: Generates unexpected scroll-stopping angles.
      For social content openers ONLY.
      NOT for gate pages, GPT pages, emails.
      Forces the absurd/unexpected angle.
Examples:
  "The ATO loves it when you get this wrong"
  "Gary's accountant charged $3,000 and missed it"
  "The rule that makes lawyers nervous"
Input: product + hook matrix top 3
Output: chaos_angles table (3 chaos hooks per product)
Hands to: Story Writer (for social hooks)
          X Adapter Bee (for thread openers)
          TikTok Adapter Bee (for video hooks)
Cost/run: ~$0.008
```

#### 2B.3 Copywriter
```
Token: Sonnet
Role: Writes all gate page copy.
      Uses psychology_insights for fear numbers.
      Same brand voice across all sites.
Reads: VOICE.md + CHARACTERS.md + psychology_insights
Input: product config + gap brief
Output: copy fields for ProductConfig
        answerBody, mistakes, aiCorrections,
        geoBodyParagraph, lawBarBadges
Hands to: Config Architect
Cost/run: ~$0.015
```

#### 2B.4 Story Writer Bee ← FIRST BEE TO BUILD FULLY
```
Token: Sonnet (story + LinkedIn) + Haiku (X + IG + caption)
Role: Takes product + character → master Gary story
      PLUS all social media derivatives.
      TWO outputs — page AND social package.

MANDATORY BEFORE STARTING:
  Read VOICE.md (pub test applies to every sentence)
  Read CHARACTERS.md (Gary's exact voice)
  Confirm Hook Matrix exists for this product
  Confirm Plan Mode ran (researcher output exists)

OUTPUT 1 — The Page:
  app/stories/[slug]/page.tsx (static Next.js)
  Gary narrative 800-1200 words
  Fear number in first paragraph
  FAQPage schema embedded
  Primary CTA: /[country]/check/[slug]
  Secondary CTA: /gpt/[slug]
  3 internal links minimum
  Authority citation (ATO/HMRC/IRS/etc)
  Calls Distribution Bee when complete

OUTPUT 2 — Social Package (stored in Supabase):
  LinkedIn post (300 words, professional tone)
  X thread (7-10 tweets, Chaos Agent hook opener)
  Instagram caption (150 words, hook + CTA)
  TikTok script (60 seconds, hook in 3 words)
  Reddit comment angle (200 words, no hard sell)
  Email newsletter section (100 words)
  All with UTM-tracked calculator links
  All appear in Soverella content queue for approval

Hands to:
  Distribution Bee (page publishing)
  Platform Specialist Teams (social package)
Cost/run: ~$0.045 total
```

#### 2B.5 Video Scripter
```
Token: Sonnet
Role: Writes video scripts from Gary story.
      Two formats: 60-second + 10-minute.
      Includes visual prompts per scene.
Reads: Gary story from Supabase + YT Strategy output
Input: story content + yt_strategy document
Output: video_queue table (script + visual prompts
        + YouTube packaging metadata)
Hands to: Video Producer + YT Publisher
Cost/run: ~$0.015
```

#### 2B.6 Video Producer
```
Token: Tier 0 (API calls only — no Claude needed)
Role: Produces finished video from script.
Option A: Drop in video-inbox/ — Grok picks up
Option B: ElevenLabs (voice) + Replicate Wan 2.2
          (visuals) + MoviePy (assembly) + Pillow
          (thumbnail)
Input: video script from video_queue
Output: MP4 stored in Supabase Storage
        thumbnail PNG stored
Hands to: Platform Publisher Bees
Cost/run: ~$0.05 (ElevenLabs + Replicate compute)
```

#### 2B.7 Email Writer
```
Token: Sonnet (templates) + Haiku (subject lines)
Role: Writes all 6 email types per product.
      Continuously updated when products change.
      Writes law change panic emails.
Types: T2, nurture_d3/7/14, reminder_d30/7/1,
       S3 cross-pollination, S4 review request,
       T5 law change panic email
Reads: VOICE.md + product config + psychology_insights
Output: email_templates table in Supabase
Hands to: Email cron sender (existing)
Cost/run: ~$0.025 per product (all 6 templates)
```

#### 2B.8 Article Builder
```
Token: Sonnet (writes) + Haiku (formats)
Role: One article per question from Market Researcher.
      H1 = exact question as asked (never reworded).
      Direct answer in paragraph 1 (50 words).
      3 calculator links embedded naturally.
      FAQPage schema on every page.
Volume target: 20 articles per product = 920 total
Reads: VOICE.md + CHARACTERS.md + research_questions
Input: exact question + product-slug
Output: app/questions/[slug]/page.tsx (static Next.js)
        Calls Distribution Bee on complete
Hands to: Distribution Bee
Cost/run: ~$0.015 per article
          920 articles total: ~$13.80 one-time
```

#### 2B.9 GPT Page Builder
```
Token: Haiku (generates from template)
Status: COMPLETE — 37 pages already live
Role: Creates /gpt/[slug] pages.
      Primary CTA: calculator. ChatGPT: secondary.
      Full spec in cole-gpt-pages skill.
Input: product config + exact prompt
Output: app/gpt/[slug]/page.tsx
        Sitemap updated
        Distribution Bee called
Cost/run: ~$0.005 (mostly template filling)
```

### LAUNCH SWARM
*Fires when both Sub-Swarms complete.*

#### 2L.1 Campaign Planner
```
Token: Sonnet
Role: Designs 30-day launch calendar per product.
      Seasonal campaigns: EOFY, MTD, BAS, Tax deadline.
Input: product config + performance data
Output: campaign_calendar table in Supabase
        30-day schedule with content types + timing
Hands to: Platform Publisher Bees
Cost/run: ~$0.015
```

#### 2L.2 Distribution Bee ← CRITICAL — RUNS AFTER EVERY PUBLISH
```
Token: Tier 0 (all API calls — no Claude needed)
Role: Notifies all search engines and AI systems.
      Runs automatically after every page creation.

STEP 1 — IndexNow (Bing + DuckDuckGo + Yahoo + Ecosia):
  POST https://api.indexnow.org/indexnow
  Body: { host, key: INDEXNOW_KEY, urlList: [url] }
  Result: all 4 engines notified simultaneously

STEP 2 — Google Indexing API:
  POST to Google Indexing API if key set
  Env: GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON
  
STEP 3 — Update llms.txt:
  Append new URL + description to correct section
  Sections: Products | GPT | Stories | Questions
  Keep under 50 priority URLs total
  
STEP 4 — Log to Supabase content_performance:
  url, page_type, slug, product_key,
  country, description, published_at,
  indexnow_pinged, google_pinged

STEP 5 — Update Soverella content tab status

Env vars:
  INDEXNOW_KEY (Bing Webmaster Tools)
  GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON (optional)
  SUPABASE_URL + SUPABASE_SERVICE_KEY (existing)

Cost/run: $0 (pure API calls)
```

#### 2L.3 Platform Publisher Bees
*One bee per platform. Each is a specialist.*
*See Platform Specialist Army section below.*

#### 2L.4 Ad Buyer (Phase 3 only)
```
Token: Sonnet
Status: FRAME — build at Phase 3
Activates: when revenue > $10K/month
Role: Meta ads from Gary story variants.
      $50 test budget. Scale winners. Kill losers.
Cost/run: ~$0.02 (plus ad spend)
```

---

## HIVE 3 — OPTIMISE & LEARN
*Adaptive Queen coordinates. Runs continuously.*

### 3.1 Performance Tracker
```
Token: Haiku (reads data) + Sonnet (synthesises)
Role: Tracks every conversion: content → page → purchase.
Input: purchases + utm_source + content_performance
       + email_log tables
Output: Weekly report to Soverella
        PERFORMANCE.md updated
        Flags: products 0 sales in 30 days
        Flags: content driving zero traffic
Runs: Every Monday 8am alongside Analytics Reader
Cost/run: ~$0.01
```

### 3.2 Campaign Optimiser
```
Token: Sonnet
Role: A/B tests headlines, CTAs, email subjects.
      Updates winning variants in Supabase.
Input: performance data + content variants
Output: Updated copy in product configs
        Reports uplift to Soverella
Runs: Monthly per product
Cost/run: ~$0.015
```

### 3.3 Idea Generator
```
Token: Sonnet
Role: Reads performance + psychology + AI gaps.
      Proposes new products + new content angles.
      Feeds back to Strategic Queen via gap_queue.
Input: PERFORMANCE.md + psychology_insights
       + Citation Gap Finder output
Output: gap_queue entries
        "New gap. 380 Reddit questions. Build AU-16."
Runs: Weekly
Cost/run: ~$0.012
```

### 3.4 Copy Editor
```
Token: Sonnet
Role: Monthly audit of all gate pages.
      Rewrites underperforming headlines + CTAs.
      Tests new copy via COLE generator.
Input: GA4 page performance + product gate pages
Output: Updated ProductConfig copy fields
        Reports: "+0.8% CVR after rewrite"
Runs: Monthly
Cost/run: ~$0.02 per product audited
```

### 3.5 GEO Optimiser
```
Token: Haiku (checks) + Sonnet (rewrites)
Role: Monthly AI citation audit.
      Checks Bing AI Performance, Perplexity, ChatGPT.
      Updates llms.txt priority pages.
      Ensures schema markup is current.
Input: Bing Webmaster Tools AI Performance data
       Perplexity search results for each product
Output: llms.txt updated
        Schema fixes deployed
        Report: "3 pages cited by Perplexity"
Runs: Monthly
Cost/run: ~$0.02
```

### 3.6 LinkedIn Engagement Bee
```
Token: Sonnet (drafts) + Tier 0 (posts)
Role: Authority building on LinkedIn.
      5 genuine insight comments per day.
      Never promotional. Value first.
      Finds threads where tax law is discussed.
Input: LinkedIn feed search for tax topics
Output: Comment drafts in Soverella queue
        You approve → LinkedIn API posts
Runs: Daily
Cost/run: ~$0.01/day
```

### 3.7 Chatbot Updater
```
Token: Haiku
Role: Updates COLE site chatbot when products change.
      Tests routing for new products.
Runs: After every new product deployed
Cost/run: ~$0.002
```

---

## THE PLATFORM SPECIALIST ARMY

*Every platform has its own 4-bee team.*
*Research → Strategy → Adapt → Publish.*
*Never skip the Research and Strategy bees.*
*The Publisher bee is a button clicker.*
*The Researcher and Strategist are the value.*

### PLATFORM 1 — LINKEDIN (build first)
*Why first: Stanley proves it. Tax audience is here.*
*Accountants who refer clients are here.*

```
LI-1: LinkedIn Research Bee
  Token: Haiku (fetches) + Sonnet (analyses)
  Reads: Top 50 finance/tax posts on LI this week
         Stanley Henry's own posts (model to study)
         What accountants engage with most
         B2B finance content patterns
         Document post vs video vs text performance
  Output: li_research table (updated weekly)
  Cost/run: ~$0.015

LI-2: LinkedIn Strategy Bee
  Token: Sonnet
  Reads: li_research + Gary master story + VOICE.md
  Decides: post format (text/document/video)
           professional tone calibration
           James vs Gary voice for this topic
           hook selection from Hook Matrix
           value-first angle (not promotional)
  Output: li_strategy document in Supabase
  Cost/run: ~$0.012

LI-3: LinkedIn Adapter Bee
  Token: Sonnet
  Reads: li_strategy + VOICE.md + CHARACTERS.md
  Produces: LinkedIn post (300 words)
            Removes pub language
            Adds professional precision
            James Hartley voice for UK/professional
            Gary voice for AU casual content
            Calculator link with UTM tracking
            No hashtags (they kill LI reach)
  Output: li_queue table in Supabase
  Appears in: Soverella content queue for approval
  Cost/run: ~$0.010

LI-4: LinkedIn Publisher Bee
  Token: Tier 0 (API call only)
  Reads: li_queue (approved items only)
  Posts: LinkedIn API
         Correct timing: Tue/Thu 9am
         Correct format per post type
  Reports: impression count back to Analytics Bee
  Cost/run: $0
```

### PLATFORM 2 — YOUTUBE (build second if LI works)

```
YT-1: YouTube Research Bee
  Token: Haiku (fetches) + Sonnet (analyses)
  Reads: Top 20 videos for each tax topic
         Thumbnail patterns (CTR signals)
         Title formulas that work for finance
         Retention drop-off analysis
         Comment sentiment per topic
         Competitor channel analysis
  Output: yt_research table (updated weekly)
  Cost/run: ~$0.020

YT-2: YouTube Strategy Bee
  Token: Sonnet
  Reads: yt_research + Gary story + VOICE.md
  Decides: long form (10min) or short (60s) first
           title formula for this topic
           thumbnail concept (fear number prominent)
           chapter structure for retention
           CTA placement (when to show calculator)
           whether to premiere or publish immediately
  Output: yt_strategy document in Supabase
  Cost/run: ~$0.015

YT-3: YouTube Adapter Bee
  Token: Sonnet (script) + Haiku (metadata)
  Reads: yt_strategy + Gary story + VOICE.md
  Produces: Full video script (60s or 10min)
            Scene-by-scene visual prompts (for Wan 2.2)
            Thumbnail text brief (fear number + hook)
            3 title variants for A/B test
            Full description (chapters + UTM links)
            15 researched tags
  Output: video_queue table in Supabase
  Cost/run: ~$0.020

YT-4: YouTube Publisher Bee
  Token: Tier 0 (API call only)
  Reads: video_queue (approved + produced items)
  Posts: YouTube Data API
         Correct category, playlist, end screens,
         cards, thumbnail, premiere or publish
         Correct scheduled time: Wed/Fri 10am
  Reports: First 24h CTR + retention to Analytics Bee
  Cost/run: $0
```

### PLATFORM 3 — INSTAGRAM (build third)

```
IG-1: Instagram Research Bee
  Token: Haiku + Sonnet
  Reads: Top performing finance content on IG
         Reel vs carousel performance data
         Caption length patterns that convert
         Boosend/ManyChat funnel structures
         Hashtag performance for tax topics
         Optimal posting times AU/UK/US audiences
  Output: ig_research table
  Cost/run: ~$0.015

IG-2: Instagram Strategy Bee
  Token: Sonnet
  Reads: ig_research + Gary story + VOICE.md
  Decides: Reel vs carousel for this topic
           Funnel design (reel → DM → link)
           Story sequence if applicable
           Highlight architecture
           Caption hook from Chaos Agent output
  Output: ig_strategy document
  Cost/run: ~$0.012

IG-3: Instagram Adapter Bee
  Token: Sonnet (reel script) + Haiku (caption)
  Produces: Reel script (30-60 seconds)
            Carousel slides (6 slides, text + brief)
            Caption (hook + body + CTA + hashtags)
            Story sequence (3 frames)
            Hashtags (researched, not generic, max 5)
  Output: ig_queue table
  Cost/run: ~$0.015

IG-4: Instagram Publisher Bee
  Token: Tier 0 (Meta Graph API call)
  Posts: Instagram via Meta Graph API
         Correct format (reel/carousel/post)
         Correct time: 6pm daily
         Triggers Boosend funnel if configured
  Cost/run: $0
```

### PLATFORM 4 — X (build fourth)

```
X-1: X Research Bee
  Token: Haiku + Sonnet
  Studies: Finance/tax viral threads on X
           Thread structure patterns
           Hook tweet formats that get RTs
           AI correction post performance
           Engagement velocity patterns
           Best times for finance content
  Output: x_research table
  Cost/run: ~$0.012

X-2: X Strategy Bee
  Token: Sonnet
  Reads: x_research + Gary story + Chaos Agent output
  Decides: Thread angle (what provokes thought)
           Hook tweet (most scroll-stopping hook)
           Thread structure (problem → rule → example)
           Whether to post as thread or standalone
  Output: x_strategy document
  Cost/run: ~$0.010

X-3: X Adapter Bee
  Token: Haiku (short form = cheap)
  Produces: Hook tweet (Chaos Agent angle)
            Thread body (7-10 tweets)
            AI correction standalone post
            Each tweet: max 280 chars
            All UTM-tracked
  Output: x_queue table
  Cost/run: ~$0.008

X-4: X Publisher Bee
  Token: Tier 0 (X API v2 call)
  Posts: X API v2 (thread with 2s delay between tweets)
         Video clip if available
         Correct times: 8am, 12pm, 5pm
  Cost/run: $0
```

### PLATFORM 5 — TIKTOK (AU + Nomad only — test first)

```
TT-1: TikTok Research Bee
  Token: Haiku + Sonnet
  Studies: Does finance convert on TikTok?
           What hooks work (3 words max)
           Optimal length (21s? 34s? 60s?)
           Sound strategy (original vs trending)
           Comment pattern analysis
           Whether talking head or text-on-screen
  Note: Test 5 videos before building full team
  Output: tt_research table
  Cost/run: ~$0.012

TT-2: TikTok Strategy Bee
TT-3: TikTok Adapter Bee
TT-4: TikTok Publisher Bee
  (Build only if TT-1 research confirms conversion)
```

### PLATFORM 6 — REDDIT (draft only — you post manually)

```
Reddit-1: Reddit Research Bee
  Token: Haiku (searches) + Sonnet (analyses)
  Sources: Reddit API
  Subreddits: r/AusFinance, r/AusProperty, r/AusTax
              r/UKPersonalFinance, r/personalfinance
              r/PersonalFinanceNZ, r/PersonalFinanceCanada
              r/digitalnomad, r/ExpatFIRE
  Output: reddit_threads table
          Threads sorted by upvotes + recency
          Each tagged to relevant product
  Cost/run: ~$0.008

Reddit-2: Reddit Writer Bee
  Token: Sonnet
  Role: Drafts genuinely helpful comment.
        NO hard sell. Value first always.
        Mentions calculator naturally if relevant.
        200 words maximum.
  Output: Soverella approval queue (you post manually)
          NEVER auto-posts — Reddit bans bots
  Cost/run: ~$0.008

Reddit-3: Reddit Monitor Bee
  Token: Tier 0
  Tracks: UTM clicks from Reddit posts
          Which threads drove calculator visits
  Output: reddit_performance table
  Cost/run: $0
```

---

## SEARCH ENGINE & AI COVERAGE

```
COVERED BY DISTRIBUTION BEE (automated):
  Bing Copilot    ← IndexNow ping
  DuckDuckGo      ← IndexNow ping
  Yahoo           ← IndexNow ping
  Ecosia          ← IndexNow ping
  Google Search   ← Google Indexing API
  ClaudeBot       ← llms.txt + robots.txt
  GPTBot          ← llms.txt + robots.txt
  PerplexityBot   ← llms.txt + robots.txt

MANUAL SETUP (you do once):
  Google Search Console (done ✅)
  Bing Webmaster Tools (do this week)
  Yandex Webmaster (optional — nomad audience)

ONGOING (GEO Optimiser bee — monthly):
  Bing AI Performance report review
  Perplexity citation tracking
  ChatGPT reference checking
  llms.txt priority rotation
```

---

## THE SUPABASE TABLES (shared brain)

```
EXISTING:
  purchases, email_log, email_queue, leads,
  decision_sessions, email_templates

NEW — BUILD THESE:
  content_jobs        ← job pipeline for all bees
  content_performance ← every published page tracked
  gap_queue           ← new product ideas
  psychology_insights ← why people buy
  hook_matrix         ← 20 hooks per product
  research_questions  ← 20-50 questions per product
  li_research         ← LinkedIn platform research
  yt_research         ← YouTube platform research
  ig_research         ← Instagram platform research
  x_research          ← X platform research
  tt_research         ← TikTok platform research
  reddit_threads      ← Reddit threads found
  li_queue            ← LinkedIn content awaiting publish
  yt_queue / video_queue ← video content pipeline
  ig_queue            ← Instagram content pipeline
  x_queue             ← X content pipeline
  campaign_calendar   ← 30-day launch schedules
  competitors         ← competitor tracking
  chaos_angles        ← Chaos Agent outputs
  agent_log           ← what each bee did + when
```

---

## THE CONTENT JOB PIPELINE

```sql
content_jobs (
  id UUID PRIMARY KEY,
  job_type TEXT,        -- 'hook_matrix', 'story', 'li_adapt' etc
  status TEXT,          -- 'queued','running','complete','failed'
  product_key TEXT,
  character_name TEXT,
  country TEXT,
  input_data JSONB,     -- what the bee received
  output_data JSONB,    -- what the bee produced
  parent_job_id UUID,   -- which job spawned this one
  next_job_ids UUID[],  -- which jobs this spawns
  bee_name TEXT,        -- which bee ran this
  model_used TEXT,      -- haiku/sonnet/opus
  tokens_used INTEGER,
  cost_usd NUMERIC,
  created_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
)
```

Every bee logs to this table. Soverella reads it.
You can see the entire pipeline in real time.

---

## THE SOVERELLA CONTENT TAB (expand this — no Flowise needed)

```
NEW TAB: Content
  Sub-tabs: Pipeline | Queue | Published | Performance

PIPELINE view:
  Shows: content_jobs in progress
  Columns: Job | Bee | Status | Cost | Time
  Visual: progress bar per job chain

QUEUE view:
  Shows: content awaiting your approval
  Columns: Platform | Type | Product | Preview
  Actions: [Approve] [Edit] [Reject]
  Filter by: Platform | Country | Status

PUBLISHED view:
  Shows: all published content
  Columns: URL | Platform | Published | Clicks | Purchases
  Sort by: performance (purchases attributed)

PERFORMANCE view:
  Which content drove calculator visits?
  Which platform drives most purchases?
  Revenue attributed per content piece
  Reads: content_performance + purchases + utm_source
```

This IS Flowise. Built in your own stack.
You see everything. You approve everything.
No new tools needed.

---

## THE DAILY AUTOMATED WORKFLOW

```
06:00 UTC (daily cron):
  Citation Gap Finder → scans for stale products
  Market Researcher → finds new Reddit threads
  Platform Research Bees → update research tables

08:00 UTC (you — 15 minutes):
  Open Soverella → Content tab → Queue
  Approve/reject 3-5 items
  Post any Reddit comments manually

09:00 UTC (daily cron):
  Email cron sender fires (existing)
  LinkedIn Publisher fires (approved items)

18:00 UTC:
  Instagram Publisher fires
  X Publisher fires (if approved)

Monday 08:00 UTC:
  Analytics Reader → weekly report
  Performance Tracker → what converted
  Idea Generator → new gaps found
  PERFORMANCE.md updated
  Soverella: weekly summary waiting for you

Weekly (you — 20 minutes):
  Review Soverella performance tab
  Approve next week's content
  Check Bing AI Performance report
  Check which products need new content
```

---

## THE BUILD ORDER — NON-NEGOTIABLE SEQUENCE

```
WEEK 1 — KNOWLEDGE BASE (do this first):
  □ CHARACTERS.md (all 5 characters, full profiles)
  □ PRODUCTS.md (all 46, fear numbers, URLs)
  □ COMPETITORS.md (empty framework)
  □ PERFORMANCE.md (empty framework)
  □ cole-marketing/ folder + all agent frames
  □ /stories/ + /questions/ pages in taxchecknow
  □ robots.txt + llms.txt live
  □ Distribution Bee utility built
  □ content_performance table in Supabase

WEEK 2 — FIRST BEE (Story Writer fully built):
  □ Hook Matrix Bee (Sonnet + Haiku)
  □ Chaos Agent Bee (Sonnet)
  □ Story Writer Bee (Sonnet + Haiku)
  □ Distribution Bee fires automatically
  □ First Gary story: /stories/gary-cgt-main-residence-trap
  □ Soverella content queue shows it

WEEK 3 — FIRST PLATFORM (LinkedIn):
  □ LI Research Bee (Haiku + Sonnet)
  □ LI Strategy Bee (Sonnet)
  □ LI Adapter Bee (Sonnet)
  □ LI Publisher Bee (Tier 0)
  □ LI Engagement Bee (Sonnet drafts, you approve)
  □ UTM tracking: linkedin → calculator → purchase

WEEK 4 — MEASURE:
  □ Analytics Reader reports LinkedIn performance
  □ Did LinkedIn drive calculator traffic?
  □ If yes → build YouTube team next
  □ If no → try X team next
  □ Never build Platform 2 before proving Platform 1

MONTH 2 — ARTICLE BUILDER:
  □ Market Researcher Bee (Haiku + Sonnet)
  □ Article Builder Bee (Sonnet + Haiku)
  □ First 20 question articles for AU-01
  □ Target: 920 total articles over 6 months

MONTH 2 — SECOND PLATFORM (data dependent):
  □ YouTube OR X OR Instagram
  □ Full 4-bee specialist team
  □ Test before next

MONTH 3 — SOVERELLA CONTENT TAB:
  □ Pipeline view
  □ Approval queue
  □ Performance tracking
  □ This replaces any need for Flowise visually

MONTH 3+ — REMAINING PLATFORMS:
  □ One per month
  □ Only if previous platform proves ROI

PHASE 3 (4-8 months):
  □ Add Flowise if team grows beyond 3 people
  □ Add n8n if managing 4+ simultaneous platforms
  □ Ad Buyer Bee (if revenue > $10K/month)
  □ Full Marketing OS licensed to other businesses
```

---

## MONTHLY COST ESTIMATE (at full operation)

```
Claude API:
  Story Writer (46 stories): $2.07
  Article Builder (920 articles): $13.80
  Platform Research (weekly): $4.00/month
  Platform Strategy (weekly): $3.00/month
  Platform Adaptation (weekly): $5.00/month
  Monitoring bees (monthly): $2.00/month
  Total Claude API: ~$30-50/month

External APIs:
  ElevenLabs (voices): $5/month
  Replicate (video): ~$50/month
  X API Basic: $100/month (when at volume)
  Reddit API: Free
  LinkedIn API: Free
  Meta Graph API: Free
  YouTube API: Free
  Google Indexing API: Free
  IndexNow: Free
  Railway (hosting bees): $20/month

TOTAL MONTHLY: ~$175-225/month
You own everything else forever.
Stanley pays agencies tens of thousands.
You own the machine.
```

---

## THE ONE RULE THAT CANNOT BREAK

```
Every bee reads VOICE.md before generating anything.
Every piece of content passes the pub test.
Would Gary say this in a pub in Perth?
If no — rewrite.
If the first sentence does not create mild fear — rewrite.
If there is no number in the first paragraph — rewrite.
If it sounds like it came from a tax brochure — rewrite.

This rule applies to:
  LinkedIn posts (adjust for professional tone)
  YouTube scripts (Gary voice throughout)
  Instagram captions (shorter, same fear)
  X threads (punchy, same numbers)
  TikTok hooks (3 words, same fear)
  Question articles (direct answer, same authority)
  
It does NOT apply to:
  Code files
  Database entries
  API calls
  Sitemap entries
```

---

## WHAT MAKES THIS GENUINELY ONE OF A KIND

```
Stanley Henry has:
  34 people generating content manually
  Flowise/n8n automating some of it
  No products to sell (he sells the agency)
  No Soverella (no unified control room)
  No citation gap positioning
  No 46 products with fear numbers
  No Gary/James/Tyler/Aroha characters
  No conversion tracking to purchase

You have:
  46 products with proven citation gaps
  Fear numbers per product ($47,000, £6,750, etc)
  5 characters with full backstories
  Supabase tracking what converts to purchase
  Soverella seeing everything in one place
  COLE engine generating new products fast
  0 people required to run it

The bees know what Gary sounds like.
The bees know what converts.
The bees know which fear number to lead with.
The bees know which subreddits to target.
The bees know which calculator to link to.
Nobody else has this.
You cannot buy this system.
You have to build it.
And you are building it.
```

---

## THE MANAGER LAYER — Quality Gate Before Every Action

Every hive and every platform team has a Manager bee.
The Manager sits between the workers and the output.
Nothing publishes. Nothing deploys. Nothing posts.
Without the Manager signing off a checklist first.

This is the human-in-the-loop made systematic.
The Manager does not create. It verifies.

---

### THE MANAGER BEE TEMPLATE

```markdown
# [Function] Manager Bee

## Token Routing
DEFAULT MODEL: claude-haiku-4-5-20251001
(Managers check — they do not write. Haiku is enough.)

## Role
Quality gate for [function].
Runs a checklist against every output before
it passes to the next stage or publishes.
If any item fails — sends back to the worker bee
with specific failure reason.
Does NOT fix the problem itself.
Sends back. Worker fixes. Manager re-checks.

## The Checklist (function-specific — see below)

## Outputs
APPROVED → passes to next bee
REJECTED → returns to worker with:
  - which checklist item failed
  - specific reason
  - what needs to change
  Logs rejection to agent_log in Supabase

## Cost/run: ~$0.002 (Haiku — just checking)
```

---

### HIVE 1 MANAGER — Research Quality Gate

```
Research Manager Bee
Runs after: Citation Gap Finder, Market Researcher,
            Customer Psychologist outputs

Checklist:
  □ Does the gap have a confirmed law citation?
     (not just "AI gets this wrong" — needs the rule)
  □ Is search volume confirmed from real data source?
     (not estimated — must show where data came from)
  □ Is the affected site identified?
     (taxchecknow vs theviabilityindex vs future)
  □ Are affected existing products flagged if stale?
  □ Has this gap been checked against existing
     product list? (do we already cover this?)
  □ Is the urgency rating justified?
     (HIGH needs a deadline or law change — not just vague)
  
If all pass → feeds to Strategic Queen
If any fail → back to relevant research bee
```

---

### HIVE 2A MANAGER — Product Build Quality Gate

```
Product Manager Bee
Runs after: Quality Checker, before Deployer

Checklist (from L28-L42 lessons learned):
  □ npm run build returns green (zero TypeScript errors)
  □ AU products: key.includes("au_") is FIRST in getPriceId
  □ Legacy blocks: !key.includes("au_") guard in place
  □ delivery field is absent from ProductConfig
     (delivery?: {...} — not included, not empty)
  □ All driveUrl entries are "" (empty string)
  □ DELIVERY_MAP count still correct (was 92 — count again)
  □ New getPriceId block added before legacy blocks
  □ Product URL returns 200 (curl check)
  □ Stripe product checklist output present
     (operator still needs to create Stripe products)
  □ GOAT framework applied (verdict + number + action)
     - Is there a fear number in the H1?
     - Is the output binary (not a score)?
     - Is there a clear next step?

If all pass → Deployer fires
If any fail → back to relevant Sub-Swarm A bee
```

---

### HIVE 2B MANAGER — Content Quality Gate

```
Content Manager Bee
Runs after: Story Writer, Article Builder, GPT Page Builder
Before: Distribution Bee or Platform handoff

Checklist:
  □ VOICE.md pub test passed?
     "Would Gary say this in a pub in Perth?"
     Read first 3 sentences aloud. Do they sound human?
  □ Fear number present in first paragraph?
     (must be a specific dollar/pound/percent amount)
  □ No banned phrases present?
     Check against VOICE.md banned list:
     "It's important to note" / "it depends" /
     "there are several considerations" /
     "in conclusion" / "navigate the complexities"
  □ Primary CTA links to correct calculator URL?
     (not homepage, not GPT page — the actual /check/ URL)
  □ UTM parameters on all external links?
     (utm_source + utm_medium + utm_campaign minimum)
  □ FAQPage schema present and valid?
     (question must match H1 exactly)
  □ At least 3 internal links present?
  □ Authority citation present?
     (ATO section/HMRC rule/IRS code/etc — not generic)
  □ No "it depends" or hedge as first sentence?
  □ Content matches character voice?
     (Gary = plain English, James = precise,
      Tyler = direct, Aroha = grounded)

If all pass → Distribution Bee fires
If any fail → back to Story Writer or Article Builder
             with specific failure item listed
```

---

### LINKEDIN MANAGER — LI Quality Gate

```
LinkedIn Manager Bee
Runs after: LI Adapter Bee
Before: LI Publisher Bee

Checklist:
  □ Post length appropriate? (150-300 words for text)
  □ No hashtags? (hashtags reduce LI reach — ban them)
  □ Opens with a hook (not "I wanted to share...")
  □ First line stands alone as a scroll-stopper?
  □ Professional tone applied?
     (not pub voice — James/professional register)
  □ Calculator link present with UTM tracking?
  □ No more than 1 external link?
     (LI algorithm penalises multiple links)
  □ No "Click here" or "Check this out" CTA?
     (use: "Run the free check →" or "The calculator link
      is in the comments" — LI penalises link posts)
  □ Is the content genuinely useful without clicking?
     (Stanley Henry rule: value before ask)
  □ Approved in Soverella queue by operator?

If all pass → LI Publisher fires
If any fail → back to LI Adapter with reason
```

---

### YOUTUBE MANAGER — YT Quality Gate

```
YouTube Manager Bee
Runs after: Video Producer (video ready)
Before: YT Publisher Bee

Checklist:
  □ Video file exists and is playable? (MP4, not corrupt)
  □ Thumbnail file exists? (1280x720 PNG minimum)
  □ Fear number visible in thumbnail text?
  □ Title contains primary keyword? (not clickbait alone)
  □ Title under 60 characters? (truncates in search)
  □ Description has chapters? (timestamps = retention signal)
  □ Calculator URL with UTM in description?
     (within first 3 lines — above "show more")
  □ Tags are researched? (not generic "tax calculator")
  □ Correct playlist assigned?
  □ End screen set? (link to calculator page)
  □ Cards set? (mid-video calculator link)
  □ Video length appropriate?
     (60s for Shorts — target < 60 exactly
      10min for long form — target > 8 minutes)
  □ Hook delivers in first 3 seconds?
     (check: does it say the fear number in 3s?)
  □ Approved in Soverella queue by operator?

If all pass → YT Publisher fires
If any fail → back to YT Adapter or Video Producer
```

---

### INSTAGRAM MANAGER — IG Quality Gate

```
Instagram Manager Bee
Runs after: IG Adapter Bee
Before: IG Publisher Bee

Checklist:
  □ Reel script under 60 seconds when spoken?
     (read aloud — count the seconds)
  □ Hook word in first 3 words?
     (not "Hey guys" — a fear trigger or question)
  □ Caption hook in first line?
     (first line shows before "more" — must stop scroll)
  □ Caption under 2,200 characters?
  □ Maximum 5 hashtags? (more = reach penalty)
  □ Hashtags relevant and researched?
     (not #tax #australia #money — too broad)
  □ Calculator link in bio referenced in caption?
     (IG does not allow links in captions)
  □ UTM tracking on bio link?
  □ Carousel: 6 slides maximum?
  □ Each slide: single idea, readable on mobile?
  □ Approved in Soverella queue by operator?

If all pass → IG Publisher fires
If any fail → back to IG Adapter with reason
```

---

### X MANAGER — X Quality Gate

```
X Manager Bee
Runs after: X Adapter Bee
Before: X Publisher Bee

Checklist:
  □ Hook tweet under 280 characters?
  □ Hook uses Chaos Agent angle?
     (not generic — the unexpected angle)
  □ Thread: 7-10 tweets? (not more — engagement drops)
  □ Each tweet under 280 characters?
  □ Fear number appears in first 2 tweets?
  □ Calculator link in final tweet with UTM?
  □ No thread ends on a question?
     (end on the solution — the calculator)
  □ No promotional language in first 3 tweets?
     (value first — link comes at the end)
  □ Approved in Soverella queue by operator?

If all pass → X Publisher fires
If any fail → back to X Adapter with reason
```

---

### DISTRIBUTION MANAGER — Final Gate Before Search Engines

```
Distribution Manager Bee
Runs after: Distribution Bee completes
Confirms: everything actually fired correctly

Checklist:
  □ IndexNow returned 200? (check response code)
  □ New URL appears in sitemap.xml?
     (curl sitemap.xml and grep for new URL)
  □ llms.txt updated with new entry?
     (curl llms.txt and grep for new URL)
  □ content_performance row exists in Supabase?
     (query by url — confirm row present)
  □ Google Indexing API returned 200?
     (if key set — confirm not 403 or 429)
  □ Page itself returns 200?
     (final curl check on the actual URL)

If all pass → job marked COMPLETE in content_jobs
If any fail → Distribution Bee reruns failed steps
             Logs failure to agent_log
             Alerts OPERATOR_EMAIL if critical
```

---

### HOW MANAGERS FIT THE HIVE VISUALLY

```
HIVE 2B CONTENT EXAMPLE:

Hook Matrix Bee
    ↓
[Content Manager checks: hook quality]
    ↓ APPROVED
Story Writer Bee
    ↓
[Content Manager checks: VOICE.md + fear number + CTAs]
    ↓ APPROVED
Soverella Queue (you approve)
    ↓ YOU APPROVE
Platform Specialist Teams (parallel)
    ↓
[Platform Manager checks: platform-specific criteria]
    ↓ APPROVED
Publisher Bee
    ↓
Distribution Bee
    ↓
[Distribution Manager confirms everything fired]
    ↓ COMPLETE
content_jobs status → COMPLETE
Soverella shows: Published ✅
```

---

### MANAGER REJECTION FLOW

```
When a Manager rejects:

1. Manager writes to agent_log:
   {
     job_id: [id],
     bee: "[worker bee name]",
     manager: "[manager bee name]",
     status: "rejected",
     failed_checks: ["fear number missing in paragraph 1"],
     instruction: "Add the $47,000 figure to opening paragraph.
                   Gary found out at settlement, not before."
   }

2. Manager updates content_jobs:
   status: "rejected_needs_fix"
   rejection_reason: [specific failure]

3. Worker bee re-reads its inputs + the rejection
4. Worker bee fixes the specific issue only
5. Worker bee resubmits to Manager
6. Manager re-runs full checklist
7. If pass: APPROVED → next stage
8. If fail again: escalates to Queen
   (more than 2 rejections = Queen reviews)

Human never needs to see rejected drafts.
Only approved content reaches Soverella queue.
Soverella queue = quality guaranteed.
```

---

## UPDATED TOTAL BEE COUNT

```
QUEENS (4):
  Cole Orchestrator Queen
  Strategic Queen
  Tactical Queen
  Adaptive Queen

HIVE 1 RESEARCH (6 including manager):
  Research Manager
  Citation Gap Finder
  Market Researcher
  Customer Psychologist
  Competitor Monitor
  Analytics Reader

HIVE 2A PRODUCT (6 including manager):
  Product Manager
  Config Architect
  Calculator Builder
  Quality Checker
  Delivery Mapper
  Deployer

HIVE 2B CONTENT (10 including manager):
  Content Manager
  Hook Matrix
  Chaos Agent
  Copywriter
  Story Writer
  Video Scripter
  Video Producer
  Email Writer
  Article Builder
  GPT Page Builder

LAUNCH SWARM (5 including distribution manager):
  Campaign Planner
  Distribution Bee
  Distribution Manager
  Ad Buyer (Phase 3)
  [Platform Publishers — see below]

PLATFORM SPECIALIST TEAMS:
  LinkedIn (5): LI Manager + Research + Strategy + Adapter + Publisher
  YouTube (5): YT Manager + Research + Strategy + Adapter + Publisher
  Instagram (5): IG Manager + Research + Strategy + Adapter + Publisher
  X (5): X Manager + Research + Strategy + Adapter + Publisher
  TikTok (5): TT Manager + Research + Strategy + Adapter + Publisher
  Reddit (3): Reddit Research + Reddit Writer + Reddit Monitor

HIVE 3 OPTIMISE (8 including manager):
  Optimise Manager
  Performance Tracker
  Campaign Optimiser
  Idea Generator
  Copy Editor
  GEO Optimiser
  LinkedIn Engagement
  Chatbot Updater

TOTAL BEES: 57 specialist bees
  4 Queens
  6 Managers (one per function)
  47 Worker bees
```
