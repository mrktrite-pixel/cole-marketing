---
name: cole-rollout-plan
description: >
  The locked linear rollout plan for COLE.
  A to B to C road map. Factory first. Product second.
  Read this before every build session.
  No scope creep. No station jumping.
  Any addition must go through Change Process at bottom.
---

# COLE FACTORY ROAD MAP
# Locked April 2026
# Factory first. Product through factory second.
# A to B to C to D to D1 to D2 to D3 (repeat)

---

## THE ANALOGY

Build the car factory first.
Assembly line installed. Each station tested empty.
Quality gates in place. Conveyor belt moving.

THEN run the first car through.
Car goes A to B to C to D.
Each station does its job.
Quality gate checks it.
Car rolls off the end complete.

THEN repeat for every car.
Same line. Same process. Same quality.
Faster every time.

COLE is the factory.
Gary stories are the cars.
Products are the cars.
Articles are the cars.
The factory never changes.
The cars keep coming.

---

## CURRENT STATUS AT LOCK DATE

```
BUILT (factory shell exists):
  taxchecknow.com — 46 products live (the showroom)
  Soverella.com — dashboard live (foreman's office)
  Supabase — tables exist (the warehouse)
  Email system — T1/T2/S2/cron running (conveyor belt)
  COLE generator — the stamping machine
  37 GPT pages — first batch off the line
  Homepage 3-step router
  GTM + GA4
  Google Search Console

NOT BUILT (factory gaps):
  Queen stations — not installed
  Hive stations — not installed
  Manager quality gates — not installed
  Knowledge base (CHARACTERS.md, PRODUCTS.md) — missing
  /stories/ + /questions/ conveyor tracks — missing
  Distribution station — missing
  Platform stations (LinkedIn, YouTube etc) — missing
```

---

## THE STATIONS

```
A  Finish the foreman's office (Soverella + tables)
B  Install the instruction manuals (knowledge base)
C  Frame the factory floor (all 57 agent files)
D  Install the queens (4 queens, test each)
E  Install Hive 1 Research workers
F  Install Hive 2A Product workers
G  Install Hive 2B Content workers
H  Install the despatch dock (Distribution Bee)
I  Install the Launch Swarm (Campaign Planner)
J  Install Platform 1 — LinkedIn (test 2 weeks)
K  Install Hive 3 Optimise workers
L  Install Platform 2 (data decides which)
M  Install Platform 3 — Instagram
N  Install Platform 4 — TikTok (test first)
O  Install Platform 5 — Reddit (manual posts)
P  Run article factory at scale (920 articles)
Q  Second product — theviabilityindex (5 visa)

Repeatable loop after G+H complete:
  Research loop (weekly automated)
  Product loop (per approved gap)
  Content loop (per product)
  Article loop (3 per week automated)
  Optimise loop (weekly automated)
```

---

## STATION A — FINISH THE FOREMAN'S OFFICE
*Soverella must see the whole factory floor.*
*No point building workers if the foreman is blind.*

```
A1. Finish Phase 0 revenue protection:
    □ Bing Webmaster Tools — verify + submit sitemap
    □ Rotate CRON_SECRET in Vercel (exposed in transcript)
    □ Add OPERATOR_EMAIL to Vercel
    □ Google Indexing API service account setup
    □ Confirm delivery email arrives on test purchase

A2. Soverella Content Tab (foreman sees the floor):
    New route: /dashboard/content on soverella.com
    Sub-tabs: Pipeline | Queue | Published | Performance

    Pipeline: shows content_jobs in progress
              auto-refreshes every 30 seconds

    Queue: content awaiting your approval
           [Approve] [Edit] [Reject] per item
           filter by Platform | Country | Status

    Published: all live content
               URL | Platform | Published | Clicks | Revenue
               sorted by purchases attributed

    Performance: revenue per content piece
                 which platform drives most purchases
                 which content drove calculator visits

A3. Supabase warehouse racks (new tables needed):
    content_jobs          job pipeline for all bees
    content_performance   every published page tracked
    hook_matrix           20 hooks per product
    research_questions    20-50 questions per product
    li_research           LinkedIn platform research
    yt_research           YouTube platform research
    ig_research           Instagram platform research
    x_research            X platform research
    tt_research           TikTok platform research
    li_queue              LinkedIn content to publish
    yt_queue              YouTube content to publish
    ig_queue              Instagram content to publish
    x_queue               X content to publish
    chaos_angles          Chaos Agent outputs
    campaign_calendar     30-day launch schedules
    psychology_insights   why people buy
    competitors           competitor tracking
    agent_log             every bee logs here

SIGN OFF A:
  □ Soverella content tab live and functional
  □ All 19 new Supabase tables created
  □ Phase 0 revenue items complete
  □ You can see the whole floor from Soverella
```

---

## STATION B — THE INSTRUCTION MANUALS
*Every bee reads these files before starting work.*
*Without them the bees are blind workers.*

```
B1. VOICE.md (already written — copy from skill)
    Copy to: cole-marketing/VOICE.md

B2. PLAN.md (already written — copy from skill)
    Copy to: cole-marketing/PLAN.md

B3. CHARACTERS.md (write this next — highest priority)
    File: cole-marketing/CHARACTERS.md
    Gary Mitchell   AU | 64 | Perth | retired electrician
    James Hartley   UK | 54 | Birmingham | accountant
    Tyler Brooks    US | 47 | Austin | founder
    Aroha Tane      NZ | 43 | Auckland | property investor
    Priya Sharma    Visa | 33 | Sydney | 482 TSS holder
    Each profile contains:
      Full backstory (2 paragraphs)
      Voice rules (how they speak)
      Sample sentences (3 good, 3 bad)
      Banned phrases (specific to character)
      Pub test rule (would Gary say this in a pub?)
      Target situation (what brought them here)
      Fear number format ($ not % for Gary)

B4. PRODUCTS.md (auto-generate from cole/config/)
    File: cole-marketing/PRODUCTS.md
    Claude Code Session A reads all config files
    Generates one entry per product:
      product_key, name, fear_number, url,
      authority, target_demo, top_hook,
      country, character, related_products

B5. COMPETITORS.md (empty framework)
    File: cole-marketing/COMPETITORS.md
    Competitor Monitor Bee fills this weekly
    Sections: AU competitors | UK | US | NZ | Nomad | CAN

B6. PERFORMANCE.md (empty framework)
    File: cole-marketing/PERFORMANCE.md
    Analytics Bee fills every Monday
    Sections: Top converters | Bottom | By platform |
              By content type | This week vs last

SIGN OFF B:
  □ All 6 knowledge files exist in cole-marketing/
  □ CHARACTERS.md fully written (all 5 characters)
  □ PRODUCTS.md accurate (all 46 products)
  □ Every bee can read its briefing before starting
```

---

## STATION C — FRAME THE FACTORY FLOOR
*Create every room. Label every door.*
*Empty rooms. No workers yet.*
*Just the building with signs on the doors.*

```
C1. cole-marketing/ folder structure:
    C:\Users\MATTV\CitationGap\cole-marketing\
    CLAUDE.md + VOICE.md + PLAN.md
    CHARACTERS.md + PRODUCTS.md
    COMPETITORS.md + PERFORMANCE.md
    .claude/agents/ (all subfolders)
    .claude/commands/
    video-inbox/.gitkeep
    git init + first commit

C2. Queens (4 frame files):
    .claude/agents/queens/
      cole-orchestrator-queen.md
      strategic-queen.md
      tactical-queen.md
      adaptive-queen.md

C3. Managers (6 frame files):
    .claude/agents/managers/
      research-manager.md
      product-manager.md
      content-manager.md
      platform-manager.md
      distribution-manager.md
      optimise-manager.md

C4. Hive 1 Research (5 frame files):
    .claude/agents/hive1-research/
      citation-gap-finder.md
      market-researcher.md
      customer-psychologist.md
      competitor-monitor.md
      analytics-reader.md

C5. Hive 2A Product (5 frame files):
    .claude/agents/hive2a-product/
      config-architect.md
      calculator-builder.md
      quality-checker.md
      delivery-mapper.md
      deployer.md

C6. Hive 2B Content (9 frame files):
    .claude/agents/hive2b-content/
      hook-matrix.md
      chaos-agent.md
      copywriter.md
      story-writer.md
      video-scripter.md
      video-producer.md
      email-writer.md
      article-builder.md
      gpt-page-builder.md

C7. Launch Swarm (4 frame files):
    .claude/agents/launch-swarm/
      campaign-planner.md
      distribution-bee.md
      distribution-manager.md
      ad-buyer.md

C8. Platform Specialists (frames — all 6 platforms):
    .claude/agents/platforms/
      li-research.md + li-strategy.md + li-adapter.md
      li-manager.md + li-publisher.md + li-engagement.md
      yt-research.md + yt-strategy.md + yt-adapter.md
      yt-manager.md + yt-publisher.md
      ig-research.md + ig-strategy.md + ig-adapter.md
      ig-manager.md + ig-publisher.md
      x-research.md + x-strategy.md + x-adapter.md
      x-manager.md + x-publisher.md
      tt-research.md + tt-strategy.md + tt-adapter.md
      tt-manager.md + tt-publisher.md
      reddit-research.md + reddit-writer.md
      reddit-monitor.md

C9. Hive 3 Optimise (7 frame files):
    .claude/agents/hive3-optimise/
      performance-tracker.md
      campaign-optimiser.md
      idea-generator.md
      copy-editor.md
      geo-optimiser.md
      linkedin-engagement.md
      chatbot-updater.md

C10. Commands (5 files):
     .claude/commands/
       research.md    /research [product]
       create.md      /create [product] [format]
       publish.md     /publish [content-id]
       hooks.md       /hooks [product]
       report.md      /report [week|month]

C11. taxchecknow infrastructure:
     app/stories/page.tsx (empty index)
     app/questions/page.tsx (empty index)
     public/robots.txt (AI bots welcomed)
     app/llms.txt/route.ts (all 46 products)
     lib/distribution-bee.ts (IndexNow + Google + log)

SIGN OFF C:
  □ 57 agent files exist (frames only — no full build)
  □ All folder structure created and committed
  □ /stories/ and /questions/ live (empty)
  □ /llms.txt returning correct content
  □ robots.txt welcoming all AI bots
  □ Distribution Bee utility exists (not yet wired)
  □ git init + first commit in cole-marketing/
```

---

## STATION D — INSTALL THE QUEENS
*Queens coordinate. Workers execute.*
*Test each queen empty before adding workers below.*
*Queens must work before any hive workers are installed.*

```
D1. Strategic Queen (fully built + tested)
    Token: Opus
    Role: Reads gap_queue + PERFORMANCE.md
          Decides what to build and which site
          Approves research, feeds to Tactical Queen
    Test: "Strategic Queen: what should we build next?"
    Expected: Clear recommendation with reasoning
    Sign off D1: Queen gives actionable output ✅

D2. Tactical Queen (fully built + tested)
    Token: Sonnet
    Role: Coordinates Hive 2A + 2B in parallel
          Fires Launch Swarm on completion
          Routes tasks to correct model tier
    Test: "Tactical Queen: coordinate build for AU-01"
    Expected: Spawns both sub-swarms simultaneously
    Sign off D2: Both swarms triggered correctly ✅

D3. Adaptive Queen (fully built + tested)
    Token: Sonnet
    Role: Monitors performance, triggers optimisation
          Feeds learnings back to Strategic Queen
          Alerts when products go stale
    Test: "Adaptive Queen: weekly review"
    Expected: Reads analytics, flags underperformers
    Sign off D3: Actionable weekly report produced ✅

D4. Cole Orchestrator Queen (fully built + tested)
    Token: Opus (sparingly)
    Role: Above all 3 queens. Full system view.
          Reports directly to you via Soverella.
    Test: "Orchestrator: full system status report"
    Expected: Consolidated view of all 3 queens
    Sign off D4: Clear system-level recommendation ✅

SIGN OFF D:
  □ All 4 queens fully built (not frames)
  □ Each queen tested independently
  □ Each queen test signed off above
  □ Queens can read Supabase + knowledge base
  □ Orchestrator routes between all 3 queens
```

---

## STATION E — HIVE 1 RESEARCH WORKERS
*Install in order E1 to E6.*
*Manager installs last — it checks all workers.*
*Sign off each before installing next.*

```
E1. Citation Gap Finder
    Token: Haiku + Sonnet
    Test: "Find citation gaps for AU tax topics"
    Sign off E1: Gap found with confirmed law source ✅

E2. Market Researcher
    Token: Haiku + Sonnet
    Test: "Research all questions for AU-01 CGT"
    Expected: 20+ questions in research_questions table
    Sign off E2: 20 questions confirmed in Supabase ✅

E3. Customer Psychologist
    Token: Sonnet
    Test: "Run psychology analysis on all purchases"
    Expected: psychology_insights table populated
    Sign off E3: Insights in Supabase ✅

E4. Competitor Monitor
    Token: Haiku
    Test: "Monitor competitors for AU tax tools"
    Expected: COMPETITORS.md updated
    Sign off E4: Competitors found and logged ✅

E5. Analytics Reader
    Token: Sonnet
    Test: "Generate weekly analytics report"
    Expected: PERFORMANCE.md updated
              Report in Soverella analytics tab
    Sign off E5: Report accurate, Soverella shows it ✅

E6. Research Manager (installs LAST)
    Token: Haiku
    Checklist: law citation confirmed, data sourced,
               site identified, urgency justified,
               gap not already covered
    Test: "Research Manager: check E1 output"
    Expected: Checklist runs, APPROVED or REJECTED
    Sign off E6: Manager correctly approves/rejects ✅

SIGN OFF E:
  □ All 5 research workers + manager fully built
  □ Each worker tested and signed off individually
  □ Research Manager checking all outputs
  □ Strategic Queen receives approved research
  □ gap_queue populating correctly
```

---

## STATION F — HIVE 2A PRODUCT WORKERS
*These already work manually in taxchecknow.*
*This station formalises them as proper bees.*
*Install in order F1 to F6.*

```
F1. Config Architect
    Token: Sonnet
    Reads: gap approval + VOICE.md + legislation
    Test: "Config Architect: build config for [gap]"
    Sign off F1: Valid ProductConfig generated ✅

F2. Calculator Builder
    Token: Sonnet
    Reads: config from F1
    Test: "Calculator Builder: build [product]"
    Sign off F2: Calculator TSX compiles ✅

F3. Quality Checker
    Token: Haiku (checks) + Sonnet (fixes)
    Test: "Quality Checker: check [product] build"
    Sign off F3: npm run build green, L40/41/42 clean ✅

F4. Delivery Mapper
    Token: Haiku
    Test: "Delivery Mapper: add [product] entries"
    Sign off F4: DELIVERY_MAP count correct ✅

F5. Deployer
    Token: Tier 0 (git only)
    Test: "Deployer: deploy [product]"
    Sign off F5: URL returns 200 ✅

F6. Product Manager (installs LAST)
    Token: Haiku
    Checklist: L28-L42 rules, build green,
               GOAT framework applied,
               fear number in H1, binary output,
               Stripe checklist present, URL 200
    Test: "Product Manager: check F1-F5 output"
    Sign off F6: Manager correctly gates deployment ✅

SIGN OFF F:
  □ All 5 product workers + manager fully built
  □ Each worker tested and signed off individually
  □ Product Manager quality gate active
  □ Full product build runs end-to-end automatically
  □ Test: new product from gap to live URL in one session
```

---

## STATION G — HIVE 2B CONTENT WORKERS
*Install in strict order G1 to G9.*
*Each bee depends on the previous.*
*Content Manager installs after G3, tests G4-G9.*

```
G1. Hook Matrix Bee
    Token: Sonnet + Haiku
    Test: "Hook Matrix: generate for AU-01"
    Expected: 20 hooks in hook_matrix Supabase table
              Top 3 marked recommended
    Sign off G1: 20 hooks confirmed in Supabase ✅

G2. Chaos Agent Bee
    Token: Sonnet
    Test: "Chaos Agent: 3 angles for AU-01"
    Expected: chaos_angles table populated
              Angles are genuinely unexpected
    Sign off G2: Unexpected angles confirmed ✅

G3. Copywriter Bee
    Token: Sonnet
    Reads: VOICE.md + psychology_insights + hook_matrix
    Test: "Copywriter: gate copy for AU-01"
    Expected: answerBody, mistakes, aiCorrections
              No banned phrases, fear number present
    Sign off G3: VOICE.md compliant output ✅

G4. Content Manager Bee (installs HERE — before G4)
    Token: Haiku
    Checklist:
      Pub test passed (would Gary say this in a pub)?
      Fear number in first paragraph?
      No banned phrases from VOICE.md?
      Primary CTA links to correct /check/ URL?
      UTM parameters on all external links?
      FAQPage schema present and valid?
      3 internal links minimum?
      Authority citation present?
      Character voice matches product country?
    Test: "Content Manager: check G3 output"
    Sign off G4 (manager): Approves or returns ✅

G5. Story Writer Bee (most important bee)
    Token: Sonnet (story) + Haiku (social)
    Reads: VOICE.md + CHARACTERS.md + hook_matrix
           + chaos_angles + PLAN.md
    MANDATORY BEFORE STARTING:
      Confirm Hook Matrix exists for this product
      Confirm Plan Mode ran (researcher output exists)
      Read VOICE.md (non-negotiable)
      Read CHARACTERS.md (Gary's exact voice)

    OUTPUT 1 — The Page:
      app/stories/[slug]/page.tsx
      Gary narrative 800-1200 words
      Fear number in first paragraph
      FAQPage schema embedded
      Primary CTA: /[country]/check/[slug]
      Secondary CTA: /gpt/[slug]
      3 internal links minimum
      Authority citation

    OUTPUT 2 — Social Package (Supabase):
      LinkedIn post (300 words, professional)
      X thread (7-10 tweets, chaos hook opener)
      Instagram caption (150 words)
      TikTok script (60 seconds, hook in 3 words)
      Reddit comment (200 words, no hard sell)
      Email newsletter section (100 words)
      All UTM-tracked

    Content Manager checks OUTPUT 1 before passing
    Social package appears in Soverella queue

    Test: "Story Writer: Gary story for AU-01"
    Expected: /stories/gary-cgt-main-residence-trap 200
              Social package in Soverella queue
    Sign off G5: Page live, social package in queue ✅

G6. Article Builder Bee
    Token: Sonnet + Haiku
    H1 = exact question (never reworded)
    Direct answer in paragraph 1 (50 words)
    3 calculator links embedded
    FAQPage schema on every page
    Content Manager checks before Distribution Bee
    Test: "Article Builder: question 1 for AU-01"
    Sign off G6: /questions/[slug] live, schema valid ✅

G7. Email Writer Bee
    Token: Sonnet + Haiku
    Produces: 6 email templates per product
    Updates: when products change or law changes
    Test: "Email Writer: all 6 templates for AU-01"
    Sign off G7: Templates follow VOICE.md ✅

G8. Video Scripter Bee
    Token: Sonnet
    Reads: Gary story + yt_strategy (when built)
    Produces: 60s + 10min scripts with visual prompts
    Test: "Video Scripter: 60-second script AU-01"
    Sign off G8: Script follows VOICE.md, hook in 3s ✅

G9. Video Producer Bee
    Token: Tier 0 (API calls only)
    Option A: Drop-folder pickup (Grok video → inbox)
    Option B: ElevenLabs voice + Replicate visuals
              + MoviePy assembly + Pillow thumbnail
    Test: Drop test script → confirm MP4 produced
    Sign off G9: MP4 plays, thumbnail exists ✅

SIGN OFF G:
  □ All 9 content workers fully built
  □ Content Manager installed after G3, checks G5-G9
  □ Full content run: Hook to Chaos to Story
    to Manager check to Page live to Social drafted
  □ First Gary story at /stories/ URL confirmed
  □ Soverella queue shows social package for approval
```

---

## STATION H — THE DESPATCH DOCK
*Every finished product and content goes through here.*
*Notifies all search engines. Updates all AI files.*
*Runs automatically after G and F complete.*

```
H1. Distribution Bee
    Token: Tier 0 (all API calls — no Claude needed)
    Runs: automatically after every page creation

    Step 1: IndexNow API
            POST https://api.indexnow.org/indexnow
            Notifies: Bing + DuckDuckGo + Yahoo + Ecosia
            Env: INDEXNOW_KEY

    Step 2: Google Indexing API
            Only if GOOGLE_INDEXING_SERVICE_ACCOUNT set
            Notifies: Google for priority crawl

    Step 3: Update llms.txt
            Append new URL + description
            Correct section: Products | GPT | Stories | Questions
            Keep under 50 priority URLs

    Step 4: Log to Supabase content_performance
            url, page_type, slug, product_key,
            country, description, published_at,
            indexnow_pinged, google_pinged

    Test: Create one story → confirm IndexNow 200
    Sign off H1: IndexNow 200, llms.txt updated ✅

H2. Distribution Manager
    Token: Tier 0 (HTTP response checks only)
    Checklist:
      IndexNow returned 200?
      New URL appears in sitemap.xml?
      llms.txt updated with new entry?
      content_performance row exists in Supabase?
      Google Indexing API returned 200 (if set)?
      Page itself returns 200?
    If all pass: job marked COMPLETE in content_jobs
    If any fail: Distribution Bee reruns failed steps
    Test: "Distribution Manager: check H1 output"
    Sign off H2: All 6 checks pass ✅

SIGN OFF H:
  □ Distribution Bee fires after every page creation
  □ Distribution Manager confirms all pings landed
  □ Bing Webmaster Tools shows new pages discovered
  □ Google Search Console shows new pages queued
  □ content_performance table growing automatically
```

---

## STATION I — LAUNCH SWARM
*Coordinates 30-day campaigns per product.*
*Fires when G and F both complete.*

```
I1. Campaign Planner Bee
    Token: Sonnet
    Reads: product config + PERFORMANCE.md
    Produces: 30-day content calendar in Supabase
    Seasonal campaigns: EOFY | MTD | BAS | Tax deadlines
    Test: "Campaign Planner: 30-day plan for AU-01"
    Sign off I1: Calendar in campaign_calendar table ✅

I2. Ad Buyer Bee (FRAME ONLY — do not build yet)
    Status: FRAME — build at Station Q+ when revenue
            confirmed above $10K/month

SIGN OFF I:
  □ Campaign Planner generating launch calendars
  □ Calendars feeding platform queues correctly
```

---

## STATION J — PLATFORM 1: LINKEDIN
*First platform specialist team.*
*Do not build Platform 2 until J7 ROI confirmed.*
*Install in order J1 to J7.*

```
J1. LinkedIn Research Bee
    Token: Haiku + Sonnet
    Runs: Weekly automated scan
    Studies: Top finance/tax posts on LI
             Stanley Henry's posts (model)
             What accountants engage with
             B2B finance patterns
    Output: li_research table (weekly update)
    Test: "LI Research: top finance content this week"
    Sign off J1: li_research table updated ✅

J2. LinkedIn Strategy Bee
    Token: Sonnet
    Reads: li_research + Gary story + VOICE.md
    Decides: post format, tone calibration,
             James vs Gary voice, hook selection,
             value-first angle
    Output: li_strategy document in Supabase
    Test: "LI Strategy: position AU-01 story for LI"
    Sign off J2: li_strategy document in Supabase ✅

J3. LinkedIn Adapter Bee
    Token: Sonnet
    Reads: li_strategy + VOICE.md + CHARACTERS.md
    Produces: 300-word post, no hashtags,
              professional tone, one external link,
              calculator UTM link included
    Output: li_queue table (awaiting approval)
    Appears in Soverella content queue
    Test: "LI Adapter: write post from Gary story"
    Sign off J3: Post in li_queue, Soverella shows it ✅

J4. LinkedIn Manager Bee
    Token: Haiku
    Checklist:
      No hashtags (they kill LI reach)?
      Maximum 1 external link?
      Opens with hook (not "I wanted to share")?
      First line works as standalone scroll-stopper?
      Professional tone (not pub voice)?
      Calculator link with UTM present?
      No "Click here" or "Check this out" CTA?
      Genuinely useful without clicking?
      Operator approved in Soverella?
    Test: "LI Manager: check J3 output"
    Sign off J4: Manager approves or returns with reason ✅

J5. LinkedIn Publisher Bee
    Token: Tier 0 (LinkedIn API call only)
    Env: LINKEDIN_ACCESS_TOKEN
    Timing: Tue/Thu 9am
    Reports: impression count to Analytics Bee
    Test: "LI Publisher: post approved content"
    Sign off J5: Post live on LinkedIn with UTM ✅

J6. LinkedIn Engagement Bee
    Token: Sonnet (drafts) + Tier 0 (posts)
    Runs: Daily — finds 5 threads, drafts comments
    Produces: 5 comment drafts in Soverella queue
    You approve → LinkedIn API posts comment
    Strategy: value first, link only when relevant
    Test: "LI Engagement: find 5 threads to comment"
    Sign off J6: 5 drafts in Soverella queue ✅

J7. MEASURE (2 weeks — not a bee, a decision gate)
    Track: utm_source=social_linkedin in Supabase
    Track: /au/check/* visits from LinkedIn source
    Track: purchases where utm_source=social_linkedin
    Question: Did LinkedIn drive calculator visits?
    Question: Did visits convert to purchases?

    Decision options:
      ROI confirmed → proceed to Station K
      ROI not confirmed → change content angle
                          try different hook type
                          do NOT proceed to Station L yet

    Document decision with data before moving on.

SIGN OFF J:
  □ All 6 LinkedIn bees fully built + tested
  □ LinkedIn Manager checking all content
  □ First post live on LinkedIn with UTM tracking
  □ 2 weeks of UTM data collected in Supabase
  □ ROI decision documented with evidence
  □ Decision: proceed to K or adjust first
```

---

## STATION K — HIVE 3 OPTIMISE WORKERS
*The factory learns from what it produces.*
*Build after J has 2 weeks of data to optimise.*
*Install in order K1 to K8.*

```
K1. Performance Tracker
    Token: Haiku + Sonnet | Runs: Every Monday 8am
    Sign off K1: Report accurate, Soverella shows it ✅

K2. Analytics Reader
    Token: Sonnet | Runs: Monday alongside K1
    Sign off K2: PERFORMANCE.md updated automatically ✅

K3. Campaign Optimiser
    Token: Sonnet | Runs: Monthly per product
    Sign off K3: A/B test created, winner tracked ✅

K4. Idea Generator
    Token: Sonnet | Runs: Weekly
    Sign off K4: gap_queue entry created ✅

K5. Copy Editor
    Token: Sonnet | Runs: Monthly audit
    Sign off K5: Underperforming copy flagged + fixed ✅

K6. GEO Optimiser
    Token: Haiku + Sonnet | Runs: Monthly
    Checks: Bing AI Performance, Perplexity, ChatGPT
    Sign off K6: AI citations confirmed, llms.txt updated ✅

K7. Chatbot Updater
    Token: Haiku | Runs: After every new product
    Sign off K7: Chatbot routes correctly to new product ✅

K8. Optimise Manager (installs LAST among original Hive 3)
    Token: Haiku
    Checks all Hive 3 outputs before they reach Queens
    Sign off K8: Manager correctly approves/rejects ✅

K9. Review Monitor Bee (weekly)
    Token: Haiku
    Triggered by G7 nurture_d14 review-request emails landing.
    Monitors Google Business reviews + maps competitive review velocity.
    See SESSION-11-STATE.md for full spec.
    Note: SESSION-11-STATE.md not yet on disk in cole-marketing/ — full
    spec to be added by operator before K9 invocation.
    Sign off K9: Review monitor reports weekly to PERFORMANCE.md ✅

SIGN OFF K:
  □ All 8 original Hive 3 workers + manager fully built
  □ K9 Review Monitor Bee operational (after SESSION-11-STATE.md spec lands)
  □ Optimise Manager quality gate active
  □ PERFORMANCE.md auto-updating every Monday
  □ Soverella analytics tab showing weekly reports
  □ gap_queue receiving ideas from Idea Generator
```

---

## STATIONS L-O — PLATFORMS 2-5
*One platform per station. Same pattern every time.*
*Never start next station without previous ROI confirmed.*

```
STATION L — PLATFORM 2
  Decision after J7 measurement:
    LinkedIn confirmed ROI → build YouTube
    LinkedIn weak conversion → build X instead

  YOUTUBE (if chosen):
    L1. YT Research Bee    (Haiku + Sonnet, weekly)
    L2. YT Strategy Bee    (Sonnet)
    L3. YT Adapter Bee     (Sonnet + Haiku)
    L4. Video Producer     (Tier 0 — already in G9)
    L5. YT Manager Bee     (Haiku, checklist below)
    L6. YT Publisher Bee   (Tier 0, YouTube Data API)
    L7. MEASURE 2 weeks → decision

    YT Manager checklist:
      Video file exists and plays?
      Thumbnail exists (1280x720 PNG)?
      Fear number visible in thumbnail?
      Title contains keyword, under 60 chars?
      Description has chapters + calculator URL above fold?
      Tags researched (not generic)?
      Correct playlist assigned?
      End screen links to calculator?
      Hook delivers in first 3 seconds?
      Approved in Soverella?

  X (if chosen instead of YouTube):
    L1. X Research Bee     (Haiku + Sonnet, weekly)
    L2. X Strategy Bee     (Sonnet)
    L3. X Adapter Bee      (Haiku — short form cheap)
    L4. X Manager Bee      (Haiku)
    L5. X Publisher Bee    (Tier 0, X API v2)
    L6. MEASURE 2 weeks → decision

    X Manager checklist:
      Hook tweet under 280 characters?
      Hook uses Chaos Agent angle?
      Thread 7-10 tweets?
      Fear number in first 2 tweets?
      Calculator link in final tweet with UTM?
      No thread ends on a question?
      No promotional language in first 3 tweets?
      Approved in Soverella?

STATION M — PLATFORM 3: INSTAGRAM
  M1. IG Research Bee   (Haiku + Sonnet)
  M2. IG Strategy Bee   (Sonnet)
  M3. IG Adapter Bee    (Sonnet + Haiku)
  M4. IG Manager Bee    (Haiku)
  M5. IG Publisher Bee  (Tier 0, Meta Graph API)
  M6. MEASURE 2 weeks

  IG Manager checklist:
    Reel script under 60 seconds when spoken?
    Hook word in first 3 words?
    Caption hook in first line?
    Caption under 2200 characters?
    Maximum 5 hashtags?
    Calculator link in bio referenced?
    UTM on bio link?
    Approved in Soverella?

STATION N — PLATFORM 4: TIKTOK (AU + Nomad only)
  Research first: does finance convert on TikTok?
  Run 5 manual videos before building bees.
  If yes → build 5-bee team same pattern.
  If no → skip permanently. Document decision.

STATION O — PLATFORM 5: REDDIT (manual posts)
  O1. Reddit Research Bee   (finds threads)
  O2. Reddit Writer Bee     (drafts comment, you post)
  O3. Reddit Monitor Bee    (tracks UTM clicks)
  Note: You always post manually. Never automate Reddit.

SIGN OFF EACH STATION L-O:
  □ All bees built + tested
  □ Manager quality gate checking output
  □ First post live with UTM tracking
  □ 2 weeks of data collected
  □ ROI decision documented before next station
```

---

## STATION P — ARTICLE FACTORY AT SCALE
*Run alongside Stations J-O. Not sequential.*
*920 question articles. The content spider web.*

```
P1. Market Researcher runs on all 46 products
    20 questions per product = 920 total
    All stored in research_questions table
    Cost: ~$0.69 total (46 × $0.015)
    Time: 1 Claude Code session

P2. Article Builder publishes in batches
    10 articles per Claude Code session
    3 articles per week publishing schedule
    Stagger: never 2 from same product same week
    Content Manager checks each before Distribution Bee
    Distribution Bee fires after each article

P3. Article Manager checklist (per article):
    H1 = exact question (never reworded)?
    Direct answer in paragraph 1 (50 words max)?
    Fear number mentioned?
    3 calculator links embedded naturally?
    FAQPage schema present?
    No banned phrases?
    Authority citation present?

P4. /questions/ index page grows automatically
    Groups: AU | UK | US | NZ | Nomad | CAN
    Links to pillar pages per country topic
    Crawlable static HTML

SIGN OFF P:
  □ All 920 questions in research_questions table
  □ Publishing rate: 3 per week ongoing
  □ Content Manager checking every article
  □ /questions/ index growing weekly
  □ Internal links: questions → calculators confirmed
```

---

## STATION Q — SECOND PRODUCT (theviabilityindex)
*Second product through the same factory.*
*Factory unchanged. Product is different.*
*Only start after taxchecknow is stable.*

```
Q1. Add domain: "tax" field to all 46 taxchecknow configs
Q2. Scaffold theviabilityindex Next.js project
    Same COLE architecture. Same Supabase.
Q3. Build VIS-01 to VIS-05 (5 visa products)
    Character: Priya Sharma
    Authority: Department of Home Affairs
Q4. Cross-links: taxchecknow nomad → viabilityindex
Q5. 5 visa GPT pages on viabilityindex
Q6. Soverella site filter shows both sites
Q7. Stories + Questions for visa products
    Same factory (G + H stations). Different character.

SIGN OFF Q:
  □ theviabilityindex.com live with 5 visa products
  □ Test purchase on visa product confirmed
  □ Cross-links active between both sites
  □ Soverella shows both sites in dashboard
```

---

## THE REPEATABLE LOOPS (factory running at speed)

Once Stations A-H complete, every new product
and content piece follows this exact loop:

```
RESEARCH LOOP (weekly automated):
  E1 Citation Gap Finder scans
  E6 Research Manager checks → APPROVED
  D1 Strategic Queen reviews → BUILD APPROVED

PRODUCT LOOP (per approved gap):
  F1-F4 Config + Calculator + Check + Map (parallel)
  F6 Product Manager → APPROVED
  F5 Deployer → product live
  H1-H2 Distribution → indexed

CONTENT LOOP (per product, repeatable):
  G1 Hook Matrix → G2 Chaos → G5 Story Writer
  G4 Content Manager → APPROVED
  Soverella queue → you approve
  J3-J5 LinkedIn | L3-L5 YouTube | M3-M5 Instagram
  H1-H2 Distribution → indexed

ARTICLE LOOP (3 per week, automated):
  E2 Market Researcher → questions
  G6 Article Builder → page created
  G4 Content Manager → APPROVED
  H1-H2 Distribution → indexed

OPTIMISE LOOP (weekly automated):
  K1-K2 Performance + Analytics → PERFORMANCE.md
  K4 Idea Generator → gap_queue
  Back to RESEARCH LOOP
```

---

## SIGN-OFF LOG

Fill in as each station completes:

```
Station A: Completed _______ | Signed off: _______
Station B: Completed _______ | Signed off: _______
Station C: Completed _______ | Signed off: _______
Station D: Completed _______ | Signed off: _______
Station E: Completed _______ | Signed off: _______
Station F: Completed _______ | Signed off: _______
Station G: Completed _______ | Signed off: _______
Station H: Completed _______ | Signed off: _______
Station I: Completed _______ | Signed off: _______
Station J: Completed _______ | Signed off: _______
Station K: Completed _______ | Signed off: _______
Station L: Completed _______ | Signed off: _______
Station M: Completed _______ | Signed off: _______
Station N: Completed _______ | Signed off: _______
Station O: Completed _______ | Signed off: _______
Station P: Completed _______ | Signed off: _______
Station Q: Completed _______ | Signed off: _______
```

---

## SCOPE CHANGE PROCESS

Any new idea after this lock date:

```
STEP 1 — Write it down:
  What is it?
  Which station does it fit?
  Build time estimate?
  Monthly running cost?

STEP 2 — Impact check:
  Which existing bees does it affect?
  Which Supabase tables does it touch?
  Which stations does it change?
  Does it block any current station?

STEP 3 — Priority decision:
  Stations A-H critical (factory frame)?
    Can interrupt if truly blocking.
  Station I-Q enhancement?
    Add to correct station queue.
  New idea, no proven ROI?
    Add to Station Q+ consideration list.
    Only build after data proves need.

STEP 4 — Document it:
  Update this roadmap with the addition.
  Note: Added [date] via change process.
  Note: Affects stations: [list].

NO STATION SKIPPED.
NO BEE BUILT OUT OF ORDER.
THE LINE EXISTS FOR A REASON.
```

---

## CURRENT POSITION

```
COMPLETED:  Nothing yet (factory not built)
CURRENT:    Station A (95% done — finish today)
NEXT:       Station B — write CHARACTERS.md
AFTER THAT: Station C — frame the factory floor
```
