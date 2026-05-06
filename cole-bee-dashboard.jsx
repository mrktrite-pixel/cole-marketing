import { useState } from "react";

const COLORS = {
  navy: "#0f1729",
  navyLight: "#1a2744",
  navyDarker: "#0a1424",
  teal: "#0d9488",
  tealDim: "#0d948840",
  amber: "#d97706",
  amberDim: "#d9770630",
  red: "#dc2626",
  redDim: "#dc262630",
  green: "#16a34a",
  greenDim: "#16a34a30",
  purple: "#7c3aed",
  purpleDim: "#7c3aed30",
  blue: "#2563eb",
  blueDim: "#2563eb30",
  grey: "#475569",
  greyDim: "#47556930",
  orange: "#ea580c",
  orangeDim: "#ea580c30",
  pink: "#db2777",
  pinkDim: "#db277730",
  text: "#f1f5f9",
  textDim: "#94a3b8",
  border: "#1e3a5f",
};

const STATUS = {
  LIVE: { label: "LIVE", color: COLORS.teal, bg: COLORS.tealDim, sortRank: 1 },
  BUILT: { label: "BUILT", color: COLORS.green, bg: COLORS.greenDim, sortRank: 2 },
  IN_PROGRESS: { label: "IN PROGRESS", color: COLORS.blue, bg: COLORS.blueDim, sortRank: 3 },
  STUB: { label: "STUB", color: COLORS.amber, bg: COLORS.amberDim, sortRank: 4 },
  UNVERIFIED: { label: "UNVERIFIED", color: COLORS.pink, bg: COLORS.pinkDim, sortRank: 5 },
  DEFECT: { label: "BUILT W/ DEFECT", color: COLORS.red, bg: COLORS.redDim, sortRank: 6 },
  SPEC_ONLY: { label: "SPEC ONLY", color: COLORS.orange, bg: COLORS.orangeDim, sortRank: 7 },
  NOT_BUILT: { label: "NOT BUILT", color: COLORS.grey, bg: COLORS.greyDim, sortRank: 8 },
};

const DB_TABLES = {
  gap_queue: { color: "#7c3aed", state: "exists, manually populated" },
  research_questions: { color: "#0d9488", state: "specced, unused" },
  psychology_insights: { color: "#0d9488", state: "specced, unused" },
  competitors: { color: "#0d9488", state: "specced, unused" },
  geo_citations: { color: "#0d9488", state: "specced, unused" },
  hook_matrix: { color: "#d97706", state: "20 rows · J1.5 bootstrap · live" },
  chaos_angles: { color: "#d97706", state: "specced, no consumer (G2 LAZY)" },
  content_jobs: { color: "#2563eb", state: "47 rows · output_data jsonb · live" },
  video_queue: { color: "#2563eb", state: "3 rows · J3 carousels · live" },
  campaign_calendar: { color: "#16a34a", state: "scheduled posts · live" },
  content_performance: { color: "#dc2626", state: "1 row · LinkedIn May 1 · live" },
  agent_log: { color: "#475569", state: "~150 rows · all bee runs" },
  viral_templates: { color: "#d97706", state: "live · J1.5 populates" },
  lessons_learned: { color: "#16a34a", state: "specced, unused" },
  platform_accounts: { color: "#16a34a", state: "2 rows · LinkedIn + TikTok · NEW: warm_up cols" },
  follower_snapshots: { color: "#475569", state: "specced, unused" },
  reddit_opportunities: { color: "#ea580c", state: "specced, unused" },
  content_assets: { color: "#0d9488", state: "🆕 May 4 · 25 cols · 0 rows · ready for N3" },
  scientist_wake: { color: "#dc2626", state: "🚫 NO TABLE EXISTS — pure architectural intent" },
};

const beeData = [
  // QUEENS
  {
    id: "orchestrator-queen",
    name: "COLE Orchestrator Queen (Soverella)",
    station: "QUEENS",
    token: "Opus",
    status: STATUS.SPEC_ONLY,
    role: "Top-level coordinator. Routes between all hives. Decides which site gets which product.",
    reads: ["gap_queue", "analytics reports"],
    writes: ["strategic decisions"],
    flags: ["Coordinator code: 0 lines · operator currently plays this role"],
    runs: "On strategic triggers",
  },
  {
    id: "strategic-queen",
    name: "Strategic Queen",
    station: "QUEENS",
    token: "Opus",
    status: STATUS.SPEC_ONLY,
    role: "Runs Hive 1 (Research). Approves citation gaps. Feeds Hive 2.",
    reads: ["gap_queue", "analytics reports"],
    writes: ["approved product queue"],
    flags: ["NOT WIRED — operator plays Strategic Queen by hand"],
    runs: "Daily",
  },
  {
    id: "tactical-queen",
    name: "Tactical Queen",
    station: "QUEENS",
    token: "Sonnet",
    status: STATUS.SPEC_ONLY,
    role: "Runs Hive 2 (Build + Sell + Market). Coordinates F, G, H, I stations.",
    reads: ["content_jobs", "campaign_calendar"],
    writes: ["coordination signals"],
    flags: [
      "NOT WIRED — bees fire independently via per-bee crons",
      "Per drift #31: per-bee staggered crons play this role today (G5 6am, J2 7am, J3 8:15am AWST)",
    ],
    runs: "Per-product",
  },
  {
    id: "adaptive-queen",
    name: "Adaptive Queen",
    station: "QUEENS",
    token: "Sonnet",
    status: STATUS.SPEC_ONLY,
    role: "Runs Hive 3 (Monitor + Improve). Reads Analytics Reader. Triggers V2.",
    reads: ["content_performance", "lessons_learned"],
    writes: ["gap_queue (new gaps)", "v2 triggers"],
    flags: ["NOT WIRED — Doctor + Scientist fire independently"],
    runs: "Weekly",
  },
  {
    id: "cleaning-queen-madame",
    name: "Madame · Cleaning Queen",
    station: "QUEENS",
    token: "Haiku (revised from Sonnet)",
    status: STATUS.SPEC_ONLY,
    role: "Runs Hive 4 (Maintenance). Sweeps storage, archives logs, reports costs Sunday 4am AWST.",
    reads: ["all 4 hive databases", "Supabase Storage"],
    writes: ["weekly cleanup report"],
    flags: [
      "DEFERRED to Block 4 (drift #32)",
      "Reason: nothing to clean until video/carousel content accumulates from Block 2-3",
      "K17 Queue Janitor scope ambiguity (drift #36) — needs spec update",
    ],
    runs: "Sunday 4-7am AWST",
  },

  // E STATION
  {
    id: "e1-citation-gap-scanner",
    name: "E1 Citation Gap Scanner",
    station: "E",
    token: "Haiku + Sonnet",
    status: STATUS.SPEC_ONLY,
    role: "Finds topics where AI gives wrong answers. The gap IS the product opportunity.",
    reads: ["AI search results", "ATO/HMRC pages"],
    writes: ["gap_queue"],
    flags: ["NOT BUILT · gap_queue manually populated by operator"],
    runs: "Daily automated",
  },
  {
    id: "e2-market-researcher",
    name: "E2 Market Researcher",
    station: "E",
    token: "Haiku + Sonnet",
    status: STATUS.SPEC_ONLY,
    role: "Finds every question asked about topic. CRITICAL: creates product facts file.",
    reads: ["Reddit API", "Google autocomplete", "AnswerThePublic"],
    writes: ["research_questions", "knowledge/[product]-facts.md"],
    flags: [
      "Facts file creation MUST happen here (today: hand-written by operator)",
      "Pain Map upgrade pending",
    ],
    runs: "Per product research",
  },
  {
    id: "e3-customer-psychologist",
    name: "E3 Customer Psychologist",
    station: "E",
    token: "Sonnet",
    status: STATUS.SPEC_ONLY,
    role: "Understands buyer emotional state. Fear, confusion, urgency. Feeds hooks.",
    reads: ["research_questions", "Reddit thread sentiment"],
    writes: ["psychology_insights"],
    flags: [],
    runs: "Per product research",
  },
  {
    id: "e4-competitor-monitor",
    name: "E4 Competitor Monitor",
    station: "E",
    token: "Haiku",
    status: STATUS.SPEC_ONLY,
    role: "What are competitors doing wrong? Competitor gaps = our content angles.",
    reads: ["Google top 10 results", "TrustPilot reviews"],
    writes: ["competitors"],
    flags: ["complaints→hook_matrix wiring not implemented"],
    runs: "Per product + periodic",
  },
  {
    id: "e5-geo-scanner",
    name: "E5 GEO Scanner",
    station: "E",
    token: "Haiku",
    status: STATUS.SPEC_ONLY,
    role: "Checks if our content is being cited by AI engines monthly.",
    reads: ["ChatGPT", "Perplexity real queries"],
    writes: ["geo_citations"],
    flags: ["Possible duplicate with K19 Citation Auditor"],
    runs: "Monthly",
  },

  // F STATION
  {
    id: "f1-product-architect",
    name: "F1 Product Architect",
    station: "F",
    token: "Opus",
    status: STATUS.SPEC_ONLY,
    role: "Designs the calculator structure. Questions, outputs, legislation.",
    reads: ["E2 facts file", "psychology_insights"],
    writes: ["ProductConfig structure"],
    flags: ["Calculator pages currently hand-built via Lovable"],
    runs: "Once per product",
  },
  {
    id: "f2-calculator-builder",
    name: "F2 Calculator Builder",
    station: "F",
    token: "Sonnet",
    status: STATUS.SPEC_ONLY,
    role: "Builds the calculator from F1 architecture.",
    reads: ["ProductConfig"],
    writes: ["calculator React components"],
    flags: ["Today: operator hand-writes facts file → Lovable generates → manual deploy"],
    runs: "Per product build",
  },
  {
    id: "f3-quality-checker",
    name: "F3 Quality Checker",
    station: "F",
    token: "Haiku",
    status: STATUS.SPEC_ONLY,
    role: "Final QA before product ships. Tests calculations, copy, links.",
    reads: ["live calculator URL"],
    writes: ["pass/fail report"],
    flags: [],
    runs: "Per product launch",
  },
  {
    id: "f3b-legal-auditor",
    name: "F3b Legal Auditor",
    station: "F",
    token: "Opus",
    status: STATUS.SPEC_ONLY,
    role: "Verifies legal/tax claims against ATO, HMRC, IRS sources.",
    reads: ["calculator content", "authority sources"],
    writes: ["legal review report"],
    flags: ["Critical for tax products"],
    runs: "Per product launch",
  },

  // G STATION
  {
    id: "g1-hook-matrix",
    name: "G1 Hook Matrix",
    station: "G",
    token: "Sonnet",
    status: STATUS.SPEC_ONLY,
    role: "Generates hooks for content. Should produce composite_score per hook.",
    reads: ["E3 psychology_insights", "viral_templates"],
    writes: ["hook_matrix"],
    flags: [
      "🔴 CRITICAL: NEVER RUN. All 20 AU-19 hooks were hand-stuffed.",
      "composite_score always NULL",
      "J2 self-heals when hook_matrix empty (Sonnet path) — covers G1's absence",
    ],
    runs: "Per product",
  },
  {
    id: "g5-story-writer",
    name: "G5 Story Writer",
    station: "G",
    token: "Sonnet",
    status: STATUS.LIVE,
    role: "Writes the canonical story for a product. Multi-character (Gary, Priya, Sarah, etc.)",
    reads: ["product facts file", "_character-registry.ts", "VOICE.md"],
    writes: ["content_jobs.output_data.linkedin_post (story)"],
    flags: [
      "✅ LIVE since May 4 (commit b6b9f6e + 0ddca5d)",
      "Daily 6am AWST cron · skip-if-exists pattern",
      "Sonnet tier · multi-character · respects VOICE.md spelling rules",
    ],
    runs: "6am AWST daily cron",
    commit: "b6b9f6e",
  },
  {
    id: "g6-article-builder",
    name: "G6 Article Builder",
    station: "G",
    token: "Sonnet",
    status: STATUS.SPEC_ONLY,
    role: "Long-form articles for taxchecknow blog (GEO-optimized).",
    reads: ["G5 story", "facts file"],
    writes: ["WordPress posts", "articles bucket"],
    flags: [],
    runs: "Per content cycle",
  },
  {
    id: "g7-email-writer",
    name: "G7 Email Writer family (T0/T2/T3/T5/Upsell/Nurture)",
    station: "G",
    token: "Sonnet (templates) + Haiku (subject lines)",
    status: STATUS.SPEC_ONLY,
    role: "Email writer family. Composes per-user emails using template + merge fields (calculator data + character voice + story excerpt). NO LLM-per-email — deterministic merge from canonical sources. Each email = paragraph 1 (THEIR data) + paragraph 2 (story excerpt from /stories/) + bridge sentence + CTA.",
    reads: ["VOICE.md", "CHARACTERS.md", "decision_sessions (their data)", "purchases", "/stories/[slug] excerpt", "product config", "lessons_learned"],
    writes: ["email_templates", "email_queue"],
    flags: [
      "🔴 T2 STATUS UNCONFIRMED — Card B-EMAIL-AUDIT-1 verifies if T2 fires on Stripe purchase TODAY (potential silent revenue loss)",
      "Email family includes: T0 (free-calc capture), T2 (purchase confirmation), T3 (day-3 action), T5 (law-change panic), $67-to-$147 Upsell, nurture_d7/d14, reminder_d30, S3 cross-pollination",
      "Per CUSTOMER-taxchecknow.md: 'personalised report' language mandatory · banned phrases (PDF/guide/ebook/course)",
      "Pre-purchase emails: NO name (only from Stripe at purchase) — anonymous-but-data-personalised",
      "Sender.com locked as provider per operator decision",
      "Block 3.5 (urgent) + Block 6.7 truth-sync (T5 cascade) + Block 4 (full system)",
      "EMAIL-SYSTEM-SPEC.md to be drafted (still pending Q2/Q3/Q4 + T2 audit verdict)",
    ],
    runs: "Per email trigger (Stripe webhook for T2, calculator submit for T0, daily crons for nurture, product_changes cascade for T5)",
  },

  // INFRA (newly built support layer — Block 2)
  {
    id: "infra-content-assets-table",
    name: "content_assets table",
    station: "INFRA",
    token: "—",
    status: STATUS.LIVE,
    role: "Lifecycle registry of every generated asset (videos, carousels, etc.). Bridge between content_jobs and content_performance.",
    reads: ["—"],
    writes: ["—"],
    flags: [
      "🆕 May 4 (Block 2.0b)",
      "25 columns, 7 constraints, 8 indexes, 2 RLS policies",
      "0 rows currently — first row will land when N3 fires",
      "Naming spec enforced at DB level (UNIQUE 6-tuple + CHECK regex)",
    ],
    runs: "passive (queried by all adapter bees)",
  },
  {
    id: "infra-content-naming-helper",
    name: "lib/content-naming.ts",
    station: "INFRA",
    token: "—",
    status: STATUS.LIVE,
    role: "Helper module: generateAssetName, parseAssetName, buildStoragePath, nextVersionLetter, productKeyToShort, platformToShort.",
    reads: ["content_assets (for next seq + version)"],
    writes: ["—"],
    flags: [
      "🆕 May 4 (Block 2.0c, commit 5bc0b56)",
      "415 lines · 38 sanity tests passing",
      "Untested in production until first N3 call",
    ],
    runs: "imported by N3, M3, L3, Q3, future Scientist V2",
    commit: "5bc0b56",
  },
  {
    id: "infra-warmup-guard",
    name: "lib/_warm-up-guard.ts",
    station: "INFRA",
    token: "—",
    status: STATUS.IN_PROGRESS,
    role: "Per-site, per-platform publish mode resolver. Returns 'auto' or 'manual_handoff' based on platform_accounts.warm_up_completed_at.",
    reads: ["platform_accounts"],
    writes: ["—"],
    flags: [
      "🛠 Session B building NOW (Block 2.0e)",
      "TikTok-only for Block 2 (per YAGNI · Decision E)",
      "Other platforms added when their station builds",
      "Per Locked Rule #25 candidate: warm-up is one-time per (site, platform)",
    ],
    runs: "called by N5 publisher (and future M5, L5, Q5, etc.)",
  },
  {
    id: "infra-ga4-wrapper",
    name: "lib/adapters/ga4.ts",
    station: "INFRA",
    token: "—",
    status: STATUS.LIVE,
    role: "GA4 Data API wrapper. Used by Doctor Bee P5 to read traffic + conversion data.",
    reads: ["GA4 Data API"],
    writes: ["—"],
    flags: [
      "✅ LIVE since May 3 (commit 0ce488a)",
      "Service account configured · GA4 reachable",
      "Awaiting P5 Doctor reader to consume",
    ],
    runs: "imported by P5 Doctor",
    commit: "0ce488a",
  },
  {
    id: "infra-blotato-adapters",
    name: "lib/{video,social,carousel}-publisher/blotato.ts",
    station: "INFRA",
    token: "—",
    status: STATUS.DEFECT,
    role: "Blotato adapter trio: video generation, social posting, carousel rendering.",
    reads: ["Blotato API"],
    writes: ["video URLs", "social post IDs"],
    flags: [
      "💧 DEFECT 1: video-publisher passes free-text prompt instead of structured inputs.scenes (will fail on first real call)",
      "💧 DEFECT 2: social-publisher missing TikTok required fields (privacyLevel + 6 booleans)",
      "💧 DEFECT 3: social-publisher missing YouTube required fields (title, privacyStatus, shouldNotifySubscribers)",
      "Carousel renderer is stub-only (CAROUSEL_PROVIDER=html2pdf is the live path)",
      "Block 2 Task 2.1 will fix all 3 defects + add warm-up guard",
    ],
    runs: "called by J5 (LinkedIn live) and future N5/M5/L5",
  },

  // H STATION (Despatch Dock — distribution + GEO infrastructure)
  {
    id: "h1-distribution-bee",
    name: "H1 Distribution Bee",
    station: "H",
    token: "Tier 0 (no LLM)",
    status: STATUS.LIVE,
    role: "Pings IndexNow API (Bing/DuckDuckGo/Yahoo/Ecosia) + Google Indexing API + updates llms.txt + logs to content_performance. Runs after every page creation. THE GEO MOAT INFRASTRUCTURE — without this, AI engines don't know new pages exist.",
    reads: ["new page URLs from G5/G6", "current llms.txt"],
    writes: ["IndexNow notifications", "Google Indexing API calls", "llms.txt updated", "content_performance logs"],
    flags: [
      "Per ROLLOUT.md C11 — 'lib/distribution-bee.ts' specced",
      "Status confirmed live per SESSION-11-STATE.md (story page distributed)",
      "Tier 0 — pure HTTP calls, no Claude needed",
      "Updates llms.txt sectioned (Products / GPT / Stories / Questions)",
      "Keep llms.txt under 50 priority URLs",
    ],
    runs: "Triggered after every G5/G6 page creation",
  },

  // SUPPORTING ROUTES (canonical content infrastructure)
  {
    id: "infra-stories-route",
    name: "/stories/[slug] route — THE MOAT",
    station: "INFRA",
    token: "—",
    status: STATUS.LIVE,
    role: "Canonical Gary-narrative story pages. 800-1200 words per product. FAQPage schema. AI engines crawl these for citations. Format LOCKED per Section 0 of LOCKED-LOOP-CLOSURE-SPEC: fear number p1, 1 PRIMARY CTA + max 2 secondary, FAQPage schema, authority citation.",
    reads: ["G5 Story Object output"],
    writes: ["app/stories/[slug]/page.tsx"],
    flags: [
      "Confirmed live: /stories/gary-frcgw-clearance-trap (SESSION-11-STATE.md)",
      "URL is permanent. Content compounds (B3 Refresher in Block 6.5).",
      "1 PRIMARY CTA only · MAX 2 secondary · NEVER more than 3 total",
      "Site #2 launches MUST replicate this route pattern",
    ],
    runs: "Page rendering on user request (Next.js)",
  },
  {
    id: "infra-questions-route",
    name: "/questions/[slug] route",
    station: "INFRA",
    token: "—",
    status: STATUS.LIVE,
    role: "5-question companion track per product. H1 = exact question (never reworded). Direct answer p1 (50 words). 3 calculator links embedded. FAQPage schema. AI engines cite these for specific question matches.",
    reads: ["G6 Article Builder output"],
    writes: ["app/questions/[slug]/page.tsx"],
    flags: [
      "Confirmed live: 5 articles per product (SESSION-11-STATE.md)",
      "FAQPage schema mandatory on every page",
      "G6 Article Builder is SPEC_ONLY — articles likely seeded manually for now",
    ],
    runs: "Page rendering on user request (Next.js)",
  },
  {
    id: "infra-gpt-route",
    name: "/gpt/[slug] route",
    station: "INFRA",
    token: "—",
    status: STATUS.LIVE,
    role: "GPT-specific landing pages. Secondary CTA target from /stories/ pages. Per ROLLOUT.md.",
    reads: ["—"],
    writes: ["app/gpt/[slug]/page.tsx"],
    flags: [
      "Signed-off route per ROLLOUT.md",
      "Listed in llms.txt sections",
    ],
    runs: "Page rendering on user request (Next.js)",
  },
  {
    id: "infra-llms-txt",
    name: "/llms.txt + /robots.txt",
    station: "INFRA",
    token: "—",
    status: STATUS.LIVE,
    role: "AI-readable index of all products + stories + questions. Bots cite this. /robots.txt welcomes ALL AI bots (GPTBot, ClaudeBot, PerplexityBot). Citation moat depends on full crawl access.",
    reads: ["all live URLs"],
    writes: ["served at /llms.txt and /robots.txt"],
    flags: [
      "Updated by H1 Distribution Bee on every new page",
      "Sectioned: Products / GPT / Stories / Questions",
      "Keep under 50 priority URLs (per ROLLOUT.md)",
      "DO NOT restrict any AI bot — citation moat depends on access",
    ],
    runs: "Static + updated by H1",
  },
  {
    id: "infra-calculator-email-capture",
    name: "Calculator email-capture component (Save box)",
    station: "INFRA",
    token: "—",
    status: STATUS.LIVE,
    role: "Live email capture on every /[country]/check/[product] page. Positioned at the inflection point — AFTER user completes calculator inputs, BEFORE clicking primary 'Get my [result]' CTA. Headline: 'Save your [outcome] for your [professional]'. Body: 'Get a copy of your [outcome] by email — free.' CTA: 'Save'. THE FIRST EMAIL-CAPTURE MOMENT in the entire funnel.",
    reads: ["calculator inputs", "computed outputs"],
    writes: ["email_queue (T0 trigger)", "decision_sessions"],
    flags: [
      "DO NOT MODIFY — operator-approved component (Section 0 preservation)",
      "Confirmed live at taxchecknow.com/nomad/check/uk-residency",
      "Highest-leverage intent signal in the entire system",
      "Captures email but NOT name (name only comes from Stripe at purchase)",
      "All email sequences design AROUND this capture point",
    ],
    runs: "Per calculator submission",
  },

  // I STATION
  {
    id: "i1-conductor",
    name: "I1 Conductor (scheduler)",
    station: "I",
    token: "Haiku",
    status: STATUS.LIVE,
    role: "Reads completed content_jobs, inserts into campaign_calendar with seasonal boosts.",
    reads: ["content_jobs (all 3 fields must exist)", "platform_accounts", "content_performance history"],
    writes: ["campaign_calendar rows (status=scheduled)"],
    flags: [
      "✅ LIVE since May 4 (commit 0122eaa)",
      "⚠️ NOT an orchestrator — does NOT trigger G5/J2/J3 (drift #31)",
      "Filter: requires linkedin_post + linkedin_strategy + linkedin_adapted ALL present",
      "Today: 1 of 47 products qualifies (AU-19). Backfill auto-runs May 5-8 via crons.",
      "Seasonal boosts: AU June+July +200, UK Jan+Feb +200, US/NZ/CAN Mar+Apr +200",
    ],
    runs: "Every 15 minutes cron",
    commit: "0122eaa",
  },
  {
    id: "i2-launch-manager",
    name: "I2 Launch Manager",
    station: "I",
    token: "Haiku",
    status: STATUS.SPEC_ONLY,
    role: "14-check quality gate before any campaign fires. Last human-facing check.",
    reads: ["content_jobs", "platform_accounts", "taxchecknow URLs"],
    writes: ["LAUNCH APPROVED or BLOCKED"],
    flags: ["Trigger point unclear — between I1 scheduling and J5 publishing?"],
    runs: "Per product launch",
  },
  {
    id: "i3-re-engagement",
    name: "I3 Re-engagement Bee",
    station: "I",
    token: "Haiku",
    status: STATUS.SPEC_ONLY,
    role: "Users who started calculator but did not purchase. Single follow-up email.",
    reads: ["decision_sessions WHERE no purchase AND 24h old"],
    writes: ["email_queue (single email per session)"],
    flags: ["decision_sessions table existence unconfirmed"],
    runs: "Daily (24h after abandoned session)",
  },

  // J STATION (LinkedIn — the live tower)
  // Native J bees + cross-hive bees that participate in J's lifecycle
  // are shown together. Cross-hive bees marked with crossHive: true and
  // nativeStation field. Status reflects May 4 brain audit per drift #24.
  {
    id: "j1-li-research",
    name: "J1 LinkedIn Research",
    station: "J",
    token: "Haiku",
    status: STATUS.BUILT,
    role: "Researches LinkedIn niche performance. Hook patterns. Format performance.",
    reads: ["LinkedIn public data", "web search"],
    writes: ["research_questions"],
    flags: [
      "BUILT per PLATFORM-LINKEDIN.md (status updated May 4 from drift #24 closure)",
      "Possible consolidation candidate with J1.5 (both research-flavored)",
    ],
    runs: "Weekly",
  },
  {
    id: "j1-5-viral-template-scraper",
    name: "J1.5 Viral Template Scraper",
    station: "J",
    token: "Sonnet",
    status: STATUS.BUILT,
    status_caveat: "Built but pattern-matches against Claude knowledge, not live LinkedIn",
    role: "Sunday weekly: finds high-performing LinkedIn post STRUCTURES (not content). Per Locked Rule #8: never copy specific content, only patterns. Bootstraps hook_matrix.",
    reads: ["web search for patterns", "own content_performance top performers"],
    writes: ["viral_templates"],
    flags: [
      "BUILT per brain commit 062d017 + 385074e (status updated May 4 from drift #24 closure)",
      "WEAKNESS: uses Claude knowledge not live web scraping — pattern-matches against what an LLM thinks LinkedIn looks like, not what LinkedIn actually rewards today (ChatGPT audit May 4)",
      "Currently 0 production runs — needs first manual trigger",
    ],
    runs: "Sunday 6am AWST",
    commit: "062d017",
  },
  {
    id: "j2-li-strategy",
    name: "J2 LinkedIn Strategy",
    station: "J",
    token: "Haiku/Sonnet",
    status: STATUS.LIVE,
    role: "Plans 3-post sequence. Selects hooks. Reads G5 first 280 chars for direction.",
    reads: ["hook_matrix", "viral_templates", "lessons_learned", "campaign_calendar", "CHARACTERS.md", "G5 output first 280 chars"],
    writes: ["content_jobs.output_data.linkedin_strategy (3-post object)"],
    flags: [
      "✅ LIVE since May 4 (commit 2ec5f72)",
      "Haiku if hook_matrix has rows, Sonnet if empty (self-heal)",
      "Writes hooks back to hook_matrix if empty (source=j2-self-heal)",
    ],
    runs: "7am AWST daily cron (skip-if-exists)",
    commit: "2ec5f72",
  },
  {
    id: "j3-li-adapter",
    name: "J3 LinkedIn Adapter",
    station: "J",
    token: "Haiku",
    status: STATUS.LIVE,
    role: "Adapts G5 story to LinkedIn format. First 140 chars hook. First comment link.",
    reads: ["J2 linkedin_strategy", "G5 linkedin_post"],
    writes: ["content_jobs.output_data.linkedin_adapted.post1_text", "content_jobs.output_data.linkedin_adapted.post1_first_comment"],
    flags: [
      "✅ LIVE since May 4 (commit 576647a)",
      "Char-cap soft-fails: D38 logged, 1532 vs 1500 cap, post still ships (not blocking)",
    ],
    runs: "8:15am AWST daily cron (skip-if-exists)",
    commit: "576647a",
  },
  {
    id: "j3-5-carousel-copywriter",
    name: "J3.5 Carousel Copywriter",
    station: "J",
    token: "Sonnet",
    status: STATUS.BUILT,
    role: "On-demand: writes 7-slide carousel copy in Gary voice. JSON format for J3.6 to render. Slide 1: fear number on dark navy #1a2744, max 8 words.",
    reads: ["product facts", "hook_matrix", "viral_templates"],
    writes: ["video_queue.slides JSON array"],
    flags: [
      "BUILT per brain commit b961673 (status updated May 4 from drift #24 closure)",
      "Currently 3 carousel rows in video_queue from J3 chain test",
    ],
    runs: "Per carousel post",
    commit: "b961673",
  },
  {
    id: "j3-6-carousel-renderer",
    name: "J3.6 Carousel Renderer",
    station: "J",
    token: "Haiku",
    status: STATUS.BUILT,
    role: "Tuesday 5pm AWST cron (48h before carousel post): converts J3.5 JSON slides → PDF via Playwright. Uploads to Supabase storage carousels bucket.",
    reads: ["video_queue.slides JSON"],
    writes: ["carousels bucket (Supabase Storage)", "campaign_calendar.rendered_url"],
    flags: [
      "BUILT per brain commits e8b3fd0 + fb92eac (status updated May 4 from drift #24 closure)",
      "Chromium sanity test passed — first real render pending production trigger",
    ],
    runs: "Tuesday 5pm AWST cron (48h before carousel post)",
    commit: "e8b3fd0",
  },
  {
    id: "j4-li-manager",
    name: "J4 LinkedIn Manager",
    station: "J",
    token: "Haiku",
    status: STATUS.BUILT,
    role: "Before each LinkedIn publish: 10-check quality gate. Virality score ≥8.0. No body links. Gary voice confirmed. Returns APPROVED or BLOCKED.",
    reads: ["content_jobs.linkedin_adapted", "platform_accounts"],
    writes: ["APPROVED or BLOCKED to content_jobs"],
    flags: [
      "BUILT per brain (status updated May 4 from drift #24 closure)",
      "10-check quality gate per PLATFORM-LINKEDIN.md",
      "First production verification when next J5 publish fires",
    ],
    runs: "Before each LinkedIn publish",
  },
  {
    id: "j5-li-publisher",
    name: "J5 LinkedIn Publisher",
    station: "J",
    token: "Haiku",
    status: STATUS.LIVE,
    role: "Publishes via Zernio. Writes wristband. Logs 60-min engagement alert.",
    reads: ["platform_accounts (Account ID: 69f40768985e734bf3e81f56)", "campaign_calendar"],
    writes: ["content_performance wristband row", "agent_log (60-min alert)"],
    flags: [
      "✅ LIVE — first post May 1 2026",
      "OPTIMISTIC-FAILURE: only updates DB on Zernio success",
      "First comment link kept despite 2026 suppression (UTM tracking value)",
    ],
    runs: "Triggered by scheduled-publisher",
  },
  {
    id: "j6-li-engagement",
    name: "J6 LinkedIn Engagement",
    station: "J",
    token: "Haiku",
    status: STATUS.BUILT,
    role: "24h after each publish: monitors replies, drafts Gary-voice responses, reads Zernio analytics. Per ChatGPT audit: should upgrade to feed comments back to research_questions + hook_matrix (currently doesn't).",
    reads: ["agent_log for publish events", "Zernio analytics"],
    writes: ["agent_log (draft responses for operator review)"],
    flags: [
      "BUILT per brain (status updated May 4 from drift #24 closure)",
      "WEAKNESS: only drafts replies, doesn't mine comment intelligence (ChatGPT J12 audit). Upgrade pairs with K9 Review Monitor when both fire.",
      "Zernio Analytics add-on ON ICE ($34/month) — degraded mode",
    ],
    runs: "24h after each LinkedIn post",
  },

  // N STATION (TikTok — Block 2 in progress)
  {
    id: "n1-tt-research",
    name: "N1 TT Research Bee",
    station: "N",
    token: "Haiku",
    status: STATUS.SPEC_ONLY,
    role: "TikTok keyword + competitor scan. Reads via web (no auth needed).",
    reads: ["TikTok web search", "Creator Search Insights"],
    writes: ["content_jobs.output_data.tt_research"],
    flags: ["Block 2 Task 2.3 · pending Session B"],
    runs: "Per product · daily cron",
  },
  {
    id: "n2-tt-strategy",
    name: "N2 TT Strategy Bee",
    station: "N",
    token: "Sonnet",
    status: STATUS.SPEC_ONLY,
    role: "Picks keyword + 5 hook variants for product. Writes hooks back to hook_matrix.",
    reads: ["N1 tt_research", "hook_matrix", "viral_templates"],
    writes: ["content_jobs.output_data.tt_strategy"],
    flags: ["Block 2 Task 2.5"],
    runs: "Per product · daily cron",
  },
  {
    id: "n3-tt-adapter",
    name: "N3 TT Adapter Bee",
    station: "N",
    token: "Haiku",
    status: STATUS.SPEC_ONLY,
    role: "60s script + on-screen text + caption + CTAs. Calls Blotato to render MP4. Writes content_assets row with status=draft.",
    reads: ["G5 story", "N2 tt_strategy"],
    writes: ["content_jobs.output_data.tt_adapted", "content_assets row", "Supabase Storage"],
    flags: [
      "Block 2 Task 2.7",
      "Will be FIRST consumer of lib/content-naming.ts and content_assets table",
    ],
    runs: "Per product · daily cron",
  },
  {
    id: "n4-tt-manager",
    name: "N4 TT Manager Bee",
    station: "N",
    token: "Haiku",
    status: STATUS.SPEC_ONLY,
    role: "9-point quality checklist. Updates content_assets.status to approved or rejected.",
    reads: ["content_assets", "N3 tt_adapted"],
    writes: ["content_assets.status"],
    flags: ["Block 2 Task 2.9"],
    runs: "Per video · 30 min after N3",
  },
  {
    id: "n5-tt-publisher",
    name: "N5 TT Publisher Bee",
    station: "N",
    token: "Haiku",
    status: STATUS.SPEC_ONLY,
    role: "Reads warm-up guard. mode='manual_handoff' until May 31 WST: queues for Soverella manual upload. mode='auto' after.",
    reads: ["content_assets WHERE status=approved", "lib/_warm-up-guard.ts"],
    writes: ["content_assets.status='manual_pending' or 'published'"],
    flags: [
      "Block 2 Task 2.11",
      "TikTok account warm-up complete: May 31 WST 2026",
      "Until then: manual_handoff mode (operator manually uploads)",
    ],
    runs: "Triggered by scheduled-publisher",
  },

  // K STATION (Hive 3 — Adaptive)
  {
    id: "p5-doctor-bee",
    name: "Doctor Bee (P5)",
    station: "K",
    token: "Haiku (+ Sonnet for diagnosis)",
    status: STATUS.STUB,
    role: "Reads analytics at 24h + 7d. Assigns GOAT grades. Wakes Scientist on FAIL/DEAD.",
    reads: ["content_performance", "Zernio API (ON ICE)", "YouTube Analytics API", "GA4 Data API"],
    writes: ["content_performance (impressions, likes, grade)", "agent_log (scientist_wake if FAIL/DEAD)"],
    flags: [
      "P5.5 GA4 wrapper LIVE (commit 0ce488a) but P5 reader unbuilt",
      "Zernio Analytics ON ICE — writes null metrics (graceful)",
      "YouTube OAuth not yet set up",
      "DEAD threshold: 7 days for LinkedIn, 14 days for YouTube",
    ],
    runs: "Daily 6am AWST + triggered by J5 publish",
  },
  {
    id: "k1-scientist",
    name: "K1 Scientist Bee",
    station: "K",
    token: "Sonnet",
    status: STATUS.SPEC_ONLY,
    role: "Diagnoses cause. Hypothesises fix. Changes ONE variable. Writes V2 to content_assets (parent_asset_id link).",
    reads: ["content_performance", "youtube_retention_curves", "agent_log"],
    writes: ["content_assets V2 entry (parent_asset_id set)", "agent_log (Soverella approval card)"],
    flags: [
      "ONE VARIABLE PER TEST always",
      "Needs ≥10-20 published items before activates",
      "Will be FIRST consumer of nextVersionLetter() in lib/content-naming.ts",
    ],
    runs: "Triggered by Doctor Bee scientist_wake action",
  },
  {
    id: "k9-review-monitor",
    name: "K9 Review Monitor",
    station: "K",
    token: "Haiku",
    status: STATUS.SPEC_ONLY,
    role: "Scans comments for pattern questions → triggers new content briefs.",
    reads: ["LinkedIn comments", "TikTok comments", "Reddit replies"],
    writes: ["agent_log (content brief)"],
    flags: [],
    runs: "Daily",
  },
  {
    id: "k10-site-health",
    name: "K10 Site Health Bee",
    station: "K",
    token: "Haiku",
    status: STATUS.SPEC_ONLY,
    role: "Weekly: all calculator URLs must return 200. 404 = lost revenue.",
    reads: ["all taxchecknow product URLs"],
    writes: ["agent_log (health report)"],
    flags: ["Simple but important — not yet running"],
    runs: "Weekly",
  },
  {
    id: "k15-storage-sweeper",
    name: "K15 Storage Sweeper (Madame's crew)",
    station: "K",
    token: "Haiku",
    status: STATUS.SPEC_ONLY,
    role: "Sweeps old PDFs >90d, orphaned renders >30d. Reads content_assets for archive-eligible.",
    reads: ["content_assets WHERE status IN ('archived')", "Supabase Storage"],
    writes: ["DELETE storage files"],
    flags: ["Block 4 task · waits for content to accumulate"],
    runs: "Sunday 4-5am AWST",
  },
  {
    id: "k17-queue-janitor",
    name: "K17 Queue Janitor (Madame's crew)",
    station: "K",
    token: "Haiku",
    status: STATUS.SPEC_ONLY,
    role: "video_queue stale rows · content_jobs in_progress >14d.",
    reads: ["video_queue", "content_jobs", "content_assets"],
    writes: ["DELETE stale rows"],
    flags: [
      "Block 4 task",
      "Drift #36: scope ambiguous between video_queue and content_assets — needs spec update",
    ],
    runs: "Sunday 5-6am AWST",
  },
  {
    id: "k21-cost-reporter",
    name: "K21 Cost Reporter (Madame's crew)",
    station: "K",
    token: "Haiku",
    status: STATUS.SPEC_ONLY,
    role: "Weekly token spend · budget alerts.",
    reads: ["agent_log.tokens_used"],
    writes: ["weekly cost report"],
    flags: ["Block 4 task"],
    runs: "Sunday 6-7am AWST",
  },

  // K STATION — LOOP CLOSURE BROKERS (Block 5 — the 12 components)
  {
    id: "b1-broker-v2-calendar",
    name: "B1 Broker (V2 → Calendar)",
    station: "K",
    token: "Tier 0 (no LLM)",
    status: STATUS.SPEC_ONLY,
    role: "The ONLY way V2 social posts reach campaign_calendar. Reads content_jobs WHERE version > 1 AND status='ready_for_calendar' AND no calendar entry exists. INSERTs calendar row with parent_calendar_id linkage and 14-day cooling-off. Idempotent (NOT EXISTS check).",
    reads: ["content_jobs (V2+)", "campaign_calendar (lookup)"],
    writes: ["campaign_calendar (V2 rows with parent_calendar_id)"],
    flags: [
      "🔴 BLOCK 5 BUILD — Component 7 of 12",
      "Locked as SEPARATE broker (not absorbed into Scientist) per 50-site pub test",
      "Cron: every 15 min · ~50 lines + idempotent guard",
      "Critical: Scientist writes content_assets + content_jobs only · B1 brokers calendar handoff",
    ],
    runs: "Every 15 min (Vercel cron)",
  },
  {
    id: "b2-broker-lessons-weights",
    name: "B2 Broker (Lessons → hook_matrix.composite_score)",
    station: "K",
    token: "Tier 0 (no LLM)",
    status: STATUS.SPEC_ONLY,
    role: "The ONLY way K12 lessons modify behaviour. Reads lessons_learned WHERE applied=false AND confidence>=0.85 → updates hook_matrix.composite_score. Marks lesson applied=true. Data-only mutation — NEVER modifies prompts.",
    reads: ["lessons_learned"],
    writes: ["hook_matrix.composite_score", "lessons_learned.applied=true"],
    flags: [
      "🔴 BLOCK 5 BUILD — Component 9 of 12",
      "DATA-ONLY MUTATION — never modifies prompts, never modifies code",
      "Idempotent: applied=true prevents re-application",
      "Cron: Monday 4am AWST (after K12 finishes Sunday)",
    ],
    runs: "Monday 4am AWST (Vercel cron)",
  },
  {
    id: "b3-story-refresher",
    name: "B3 Story Refresher (Block 6.5)",
    station: "K",
    token: "Sonnet",
    status: STATUS.SPEC_ONLY,
    role: "Routine refresh path: reads K12 high-confidence patterns + J6 research_questions monthly → proposes /stories/[slug] content updates. URL preserved · content compounds · append/refine never rewrite. Operator approval gate. Story_revisions table preserves every version.",
    reads: ["lessons_learned", "research_questions", "/stories/[slug] current content"],
    writes: ["story_revisions table", "/stories/[slug] new content version"],
    flags: [
      "🟣 BLOCK 6.5 (Story Compounding Sprint, ~6 hr)",
      "TWO trigger paths in final form: routine (monthly K12/J6) + urgent (Block 6.7 truth-sync via product_changes)",
      "URL is permanent. Content compounds. dateModified updated. H1 re-pings.",
      "Append/refine ONLY — never wholesale rewrite",
      "Monthly batch cadence default · prevents Google high-frequency-edit penalty",
    ],
    runs: "Monthly (Block 6.5 routine path)",
  },

  // M STATION (Instagram — Block 3A)
  {
    id: "m-station-stub",
    name: "M-station Instagram (5 bees)",
    station: "M",
    token: "Haiku/Sonnet",
    status: STATUS.SPEC_ONLY,
    role: "M1-M5: Research → Strategy → Adapter (Reels + carousel) → Manager → Publisher.",
    reads: ["pattern of N-station once built"],
    writes: ["IG-specific content"],
    flags: ["Block 3A · 7 sub-tasks · estimate 3-4 hr"],
    runs: "Once built: per product · daily",
  },

  // L STATION (YouTube — Block 3B + 3D)
  {
    id: "l-station-stub",
    name: "L-station YouTube (10 bees: short + long)",
    station: "L",
    token: "Haiku/Sonnet/Opus",
    status: STATUS.SPEC_ONLY,
    role: "L1-L5 (Shorts) + L1L-L5L (Long-form). YT-Long uses Opus for chapter strategy.",
    reads: ["pattern of N-station once built"],
    writes: ["YT-specific content"],
    flags: ["Block 3B + 3D · YouTube OAuth setup needed (YOUTUBE_REFRESH_TOKEN)"],
    runs: "Once built: per product",
  },

  // Q STATION (X / Twitter — Block 3C)
  {
    id: "q-station-stub",
    name: "Q-station X / Twitter (5 bees)",
    station: "Q",
    token: "Haiku/Sonnet",
    status: STATUS.SPEC_ONLY,
    role: "K1-K5 (renamed Q for X to avoid K-station collision). Threads, no video.",
    reads: ["pattern of N-station once built"],
    writes: ["X threads"],
    flags: ["Block 3C · text only, no video pipeline needed"],
    runs: "Once built: per product",
  },

  // O STATION (Reddit — future)
  {
    id: "o-station-stub",
    name: "O-station Reddit (3 bees)",
    station: "O",
    token: "Haiku",
    status: STATUS.SPEC_ONLY,
    role: "O1 Listen · O2 Reply · O3 Compliance.",
    reads: ["Reddit API"],
    writes: ["Reddit replies (with approval gate)"],
    flags: ["Future block · post-Block-3"],
    runs: "Once built: per opportunity",
  },
];

const issuesList = [
  { sev: "CRITICAL", icon: "🔴", text: "G1 Hook Matrix has NEVER RUN. All 20 AU-19 hooks were hand-stuffed. composite_score always NULL. J2 self-heals (Sonnet path) but G1 is supposed to be the hook authority." },
  { sev: "CRITICAL", icon: "🔴", text: "All 5 Queens are SPEC ONLY with no code path calling them. Tactical Queen 'coordinates' F/G/H/I stations but bees fire via independent crons. Per-bee crons + operator are doing the queens' work today (drift #31 confirmed this is correct architecture for current scale)." },
  { sev: "CRITICAL", icon: "🔴", text: "J4 LinkedIn Manager status UNVERIFIED — high disagreement between PLATFORM-LINKEDIN.md (says BUILT), Chat A flowchart (says BUILT), and drift #24 (says verify before trusting). If J4 isn't actually built, LinkedIn ships posts with ZERO quality gate. D40 task: Session B must audit." },
  { sev: "CRITICAL", icon: "🔴", text: "Zernio Analytics add-on is ON ICE ($34/month). Doctor Bee runs but writes NULL metrics. GOAT grades cannot be calculated without impression data. The entire learning loop is currently blind." },
  { sev: "CRITICAL", icon: "🔴", text: "YouTube OAuth not set up (YOUTUBE_REFRESH_TOKEN missing). Doctor Bee cannot read YouTube retention curves. Scientist cannot diagnose YouTube posts. L station bees cannot publish." },
  { sev: "HIGH", icon: "🟠", text: "video-publisher/blotato.ts has payload defect: passes free-text prompt instead of structured inputs.scenes per Blotato MCP. WILL FAIL on first real call from N3. Block 2 Task 2.1 will fix." },
  { sev: "HIGH", icon: "🟠", text: "social-publisher/blotato.ts missing TikTok-required fields (privacyLevel + 6 booleans). TikTok publish would 4xx on first call. Same defect for YouTube (title, privacyStatus). Block 2 Task 2.1 fixes." },
  { sev: "HIGH", icon: "🟠", text: "scientist_wake signal — designed in architecture but no table exists, no writer, no consumer. Adaptive Queen → Strategic Queen loop-back is pure intent. Will block Hive 3 from closing the learning loop." },
  { sev: "HIGH", icon: "🟠", text: "J3.5, J3.6, J6 status UNVERIFIED — same drift #24 pattern as J4. PLATFORM-LINKEDIN.md claims BUILT, but Session B audit not yet performed. D40 covers all 4 (J4 + J3.5 + J3.6 + J6)." },
  { sev: "HIGH", icon: "🟠", text: "G2 Chaos Agent writes to chaos_angles table. Nothing reads this table yet. Q2/Q3 (X station) are NOT BUILT. G2 is generating output with zero current consumer = LAZY bee." },
  { sev: "HIGH", icon: "🟠", text: "I2 Launch Manager (14-check gate) — trigger point in flow unclear. Between I1 scheduling and J5 publishing? Not confirmed wired." },
  { sev: "HIGH", icon: "🟠", text: "E2 Market Researcher Pain Map upgrade pending. Competitors' complaints should feed hook_matrix. This wiring does not exist. E4 output (competitors table) has no confirmed downstream consumer." },
  { sev: "MEDIUM", icon: "🟡", text: "K17 Queue Janitor scope ambiguity (drift #36): spec says video_queue, but content_assets is now the canonical queue post-Block-2.0b. Spec needs update before Block 4 build." },
  { sev: "MEDIUM", icon: "🟡", text: "I3 Re-engagement Bee depends on decision_sessions table. Existence + population not confirmed in any session state." },
  { sev: "MEDIUM", icon: "🟡", text: "G6 Article Builder + G7 Email Writer + G8 Video Scripter all SPEC ONLY · no daily crons running. Content gap for all non-LinkedIn platforms." },
  { sev: "MEDIUM", icon: "🟡", text: "K10, K20, K19 are weekly/monthly health bees — all SPEC ONLY. System health monitoring not operational." },
  { sev: "MEDIUM", icon: "🟡", text: "E5 GEO Scanner (monthly) and K19 Citation Auditor (monthly) do the same thing — possible duplicate. Need consolidation decision." },
  { sev: "LOW", icon: "🟢", text: "J1.5 Viral Template Scraper bootstrap done · uses Claude knowledge, not live scraping. viral_templates seeded · quality unknown until compared to actual LinkedIn performance." },
  { sev: "LOW", icon: "🟢", text: "lib/content-naming.ts (Block 2.0c, commit 5bc0b56) — DB-side functions untested in production. First call will be from N3 (Block 2.7). Sanity tests pass (38/38) but production verification waits." },
  { sev: "LOW", icon: "🟢", text: "Per-site warm-up rule (Locked Rule #25 candidate) — codified for TikTok only in Block 2 (per YAGNI). Other platforms get rules added when their station builds. Future Claude chats trying to add a new platform will hit explicit throw — by design." },
];

const stationInfo = {
  QUEENS: { label: "👑 Queens — coordinator layer", color: COLORS.purple, desc: "All 5 unwired" },
  E: { label: "E — Research (Hive 1, Strategic Queen)", color: COLORS.purple, desc: "All spec only" },
  F: { label: "F — Product Build (Hive 2)", color: COLORS.blue, desc: "All spec only · operator hand-builds" },
  G: { label: "G — Content Creation (Hive 2)", color: COLORS.blue, desc: "1 of 9 live (G5)" },
  H: { label: "H — Despatch Dock (GEO infrastructure)", color: COLORS.teal, desc: "H1 Distribution Bee · the moat infrastructure" },
  I: { label: "I — Launch Swarm", color: COLORS.green, desc: "I1 live · others spec" },
  INFRA: { label: "🔧 Infrastructure (helpers + tables + routes)", color: COLORS.grey, desc: "Block 2 foundation + canonical routes" },
  J: { label: "J — LinkedIn (the live tower)", color: COLORS.teal, desc: "Most depth · 4 unverified" },
  N: { label: "N — TikTok (Block 2 in progress)", color: COLORS.amber, desc: "Building now" },
  M: { label: "M — Instagram", color: COLORS.amber, desc: "Block 3A" },
  L: { label: "L — YouTube (Short + Long)", color: COLORS.red, desc: "Block 3B + 3D" },
  Q: { label: "Q — X / Twitter", color: COLORS.amber, desc: "Block 3C" },
  O: { label: "O — Reddit", color: COLORS.orange, desc: "Future" },
  K: { label: "K — Optimise + Maintenance + Brokers (Hive 3 + 4)", color: COLORS.purple, desc: "Loop closure brokers + Madame's crew" },
};

// LIFECYCLE VIEWER — pick a system, see the full flow
const lifecycles = {
  "create-new-site": {
    name: "🟢 CREATE NEW SITE — Master Conveyor Belt",
    icon: "🟢",
    description: "The complete operational vision: clicking 'Create New Site' creates a self-running business unit. Today this is mostly manual (Block 7 runbook). Tomorrow it's a green button. The PASSAGE is documented from front door to back door — even when manual today, every stage has a clear handoff so automation slots in without retrofit.",
    block: "Block 7 (manual runbook today) → Block 8+ (semi-auto wizard) → Block 10+ (fully automated green button)",
    color: COLORS.green,
    steps: [
      { phase: "STAGE 1 — Setup Wizard (Human Inputs)", bees: ["site_id, brand_name, domain, market, country, character mapping, primary CTA"], status: "MANUAL", note: "Today: operator fills in site_context row by hand. Future: dashboard form. Identifies the new business unit." },
      { phase: "STAGE 2 — Product Ladder Config", bees: ["free_calculator + tier_1 ($67) + tier_2 ($147) Stripe products"], status: "MANUAL", note: "Today: operator creates Stripe products manually. Future: auto-provisioning. Pricing per CUSTOMER-taxchecknow.md pattern." },
      { phase: "STAGE 3 — Social Account Setup", bees: ["LinkedIn / TikTok / IG / YouTube / X / Reddit accounts"], status: "MANUAL", note: "Per platform: account_name, api_key, warm_up_status, manual_handoff_until. Today operator. Future wizard collects all in one form." },
      { phase: "STAGE 4 — Infrastructure Checklist", bees: ["Vercel project · GitHub repo · Supabase site row · Stripe webhook · GA4 · IndexNow · llms.txt · robots.txt"], status: "MANUAL", note: "Today operator runbook (~half day per site). Future: validation gate ensures all green before hive starts." },
      { phase: "STAGE 5 — Validation Gate", bees: ["system checks: Can publish? Can track? Can sell? Can index? Can roll back? Can approve?"], status: "MANUAL", note: "🔴 Critical: hive does NOT start until all green. Status flips: setup_incomplete → active. ChatGPT-locked principle: no premature launch. taxchecknow ran through this May 6 2026 (Phase 0 Day 1) — 6-check gate executed, verdict 4 ✅ / 2 ⚠️ / 1 🔴 PASS, status flipped to system-managed." },
      { phase: "STAGE 6 — Strategic Queen Wakes", bees: ["Strategic Queen (purple)"], status: "MANUAL", note: "Today: operator IS the Strategic Queen. Future: real bee. Approves what site builds." },
      { phase: "STAGE 7 — Research Conveyor (E + O stations)", bees: ["O1 Opportunity Scanner", "O2 Filter", "O3 Validator", "E1 Citation Gap Scanner", "E2 Market Researcher", "E3 Customer Psychologist", "E4 Competitor Monitor"], status: "MANUAL", note: "Today: operator hand-finds gaps via Reddit + autocomplete + AI engines. Future: bees automate. Output: validated_niche_report + recommended_product_list (10+ products)." },
      { phase: "STAGE 8 — Operator Approves Niche", bees: ["dashboard approval"], status: "MANUAL", note: "Human-in-the-loop checkpoint. 'This site has strong opportunity in X. 10+ products found. Proceed?'" },
      { phase: "STAGE 9 — Tactical Queen Wakes", bees: ["Tactical Queen (teal)"], status: "MANUAL", note: "Today: operator + per-bee staggered crons (drift #31). Future: real coordinator bee." },
      { phase: "STAGE 10 — Product Factory (F station)", bees: ["P1 Product Mapper", "F1 Product Architect", "F2 Calculator Builder", "F3 Quality Checker", "F3b Compliance/Legal Auditor"], status: "MANUAL", note: "Today: operator hand-builds with Lovable/Claude (per Block 1 pattern). Future: bees automate. Per PRODUCT-BUILD-PATTERN.md (Block 7 prerequisite). Status flow: researching → building → checking → ready_for_launch." },
      { phase: "STAGE 11 — Operator Approves Product Launch", bees: ["dashboard approval"], status: "MANUAL", note: "Human-in-the-loop. Each product launches independently when ready." },
      { phase: "STAGE 12 — Story OS Starts (G5 dual output)", bees: ["G5 Story Writer"], status: "LIVE", note: "Outputs Story Object → /stories/[slug] page AND Derivation Map (structured JSON). Per LOCKED-LOOP-CLOSURE-SPEC. → see 'Story Creation' lifecycle for detail." },
      { phase: "STAGE 13 — Distribution + Indexing (H1)", bees: ["H1 Distribution Bee"], status: "LIVE", note: "IndexNow + Google Indexing API + llms.txt update. Triggers AI engine crawl. THE MOAT INFRASTRUCTURE." },
      { phase: "STAGE 14 — /questions/ companions (G6)", bees: ["G6 Article Builder"], status: "SPEC_ONLY", note: "5-7 question articles per product. FAQPage schema. AI engines cite for specific questions. Today: seeded manually." },
      { phase: "STAGE 15 — Social Conveyor (J/N/M/L/Q/O all read story)", bees: ["J3 LinkedIn", "N3 TikTok", "M3 Instagram", "L3-Shorts YouTube", "L3-LF YouTube", "Q3 X", "O3 Reddit"], status: "PARTIAL", note: "All adapter bees read Derivation Map (Rule 11: never invent). J3 LIVE · N3 building · others SPEC_ONLY. → see per-platform lifecycles for detail." },
      { phase: "STAGE 16 — Calendar + Approval Queue", bees: ["I1 Conductor", "campaign_calendar", "operator approval UI (Block 5 C2)"], status: "PARTIAL", note: "I1 LIVE · approval UI is Block 5 C2 build. Status: draft → pending → approved → scheduled." },
      { phase: "STAGE 17 — Operator Reviews Drafts", bees: ["dashboard /calendar"], status: "MANUAL-MISSING-UI", note: "🔴 Block 5 C2 builds the approval UI. Today operator approves manually via direct DB or per-bee outputs. Approve/edit/reject/reschedule per draft." },
      { phase: "STAGE 18 — Publish Per Platform", bees: ["J5 LinkedIn", "N5 TikTok", "M5/L5/Q5 future"], status: "PARTIAL", note: "J5 LIVE · N5 building · publish gate per Block 5 C3 ensures only approved content goes live." },
      { phase: "STAGE 19 — Sales Conveyor", bees: ["traffic → /stories/ → /check/{product} → free result → $67 → $147"], status: "LIVE", note: "Funnel exists. Conversion paths working per CUSTOMER-taxchecknow.md. S1/S2/S3 funnel optimisers are Block 10+." },
      { phase: "STAGE 20 — Adaptive Queen Wakes", bees: ["Adaptive Queen (amber)"], status: "MANUAL", note: "Today: operator. Future: bee. Decides V2 strategies + reads pattern signals." },
      { phase: "STAGE 21 — Learning Loop (Doctor → Scientist → V2 → B1)", bees: ["Doctor (J7)", "Scientist (J8)", "B1 Broker", "campaign_calendar V2"], status: "SPEC_ONLY", note: "🔴 Block 5 C5-C7 build. Loser content gets V2 with one variable changed. Winners feed K12." },
      { phase: "STAGE 22 — Pattern Learning (K12 → B2 → hook_matrix)", bees: ["K12 Pattern Extractor", "B2 Broker"], status: "SPEC_ONLY", note: "🔴 Block 5 C8-C9 build. Sunday batched per-site. Lessons update hook_matrix.composite_score (DATA-only, never prompts)." },
      { phase: "STAGE 23 — G7 Email Conveyor", bees: ["G7-T0 free-calc capture", "G7-T2 purchase", "G7-T3 day-3 reminder", "G7-Upsell $67→$147", "G7-T5 law-change", "I3 Re-engagement"], status: "UNCONFIRMED", note: "🔴 T2 status uncertain (Card B-EMAIL-AUDIT-1). Sender.com locked. Pre-purchase: data-only personalisation (no name). Post-purchase: full." },
      { phase: "STAGE 24 — Permanent Research Never Stops", bees: ["O1 keeps scanning · E2 keeps collecting · J6 keeps mining comments · A1 keeps spotting winners"], status: "SPEC_ONLY", note: "Site is never 'done.' Strategic Queen keeps proposing new products. Per ChatGPT-locked principle: living, researching, growing." },
      { phase: "STAGE 25 — Truth-Sync Engine", bees: ["product_changes table → cascade to calc/story/social/email"], status: "SPEC_ONLY", note: "Block 6.7. When law/market/customer changes → all derivatives update with versioning + rollback. → see 'Truth-Sync Engine' lifecycle for detail." },
      { phase: "STAGE 26 — Story Compounding", bees: ["B3 Story Refresher"], status: "SPEC_ONLY", note: "Block 6.5. URL permanent · content compounds. Monthly batched. → see 'Story Compounding' lifecycle for detail." },
      { phase: "STAGE 27 — Cleaning Queen Maintains Health", bees: ["Madame · K15-K17, K21, K22"], status: "SPEC_ONLY", note: "Block 4. Sunday-batched. Storage sweep, log archive, queue janitor, cost reporter, backup verifier. → see 'Madame' lifecycle for detail." },
      { phase: "STAGE 28 — Cross-Pollination Across Sites (Block 7+)", bees: ["S3 Cross-pollination Email", "operator-curated cross-site referrals"], status: "SPEC_ONLY", note: "When site #2+ exists. Customer who bought taxchecknow product gets viability/visa cross-sell. Architectural pattern, not yet implemented." },
    ],
    keyRule: "🔒 THE BIG ONE: 'Create New Site' is not a button — it's the creation of a permanent, self-running, self-improving business unit. Today most stages are manual operator runbook. Each stage has a clear input → output → handoff so when automation arrives, it slots into the existing passage. THE PASSAGE FROM FRONT DOOR TO BACK DOOR IS BUILT FROM DAY 1 — even when manual. This prevents retrofit, prevents drift, and ensures the system grows in a single unified direction.",
  },

  "story-creation": {
    name: "📖 Story Creation Lifecycle",
    icon: "📖",
    description: "How a single product becomes the canonical /stories/ page + Derivation Map for all platform distributions.",
    block: "Live + Block 5 enhancements",
    color: COLORS.teal,
    steps: [
      { phase: "1. Research", bees: ["E1 Citation Gap Scanner", "E2 Market Researcher", "E3 Customer Psychologist"], status: "SPEC_ONLY", note: "Today: operator hand-writes facts file" },
      { phase: "2. Legal Lock", bees: ["F3b Legal Auditor"], status: "SPEC_ONLY", note: "Critical for tax/visa accuracy — pre-mortem before story" },
      { phase: "3. Story Object Creation", bees: ["G5 Story Writer (LIVE)"], status: "LIVE", note: "Reads VOICE.md + CHARACTERS.md + product facts. Outputs canonical narrative." },
      { phase: "4. Page Publish", bees: ["app/stories/[slug]/page.tsx", "H1 Distribution Bee"], status: "LIVE", note: "/stories/ page rendered + IndexNow + Google Indexing + llms.txt updated" },
      { phase: "5. Derivation Map", bees: ["G5 emits structured JSON"], status: "PARTIAL", note: "Today: G5 outputs social-package shape. Lock: structured map per LOCKED-LOOP-CLOSURE-SPEC Section 0" },
      { phase: "6. /questions/ companion articles", bees: ["G6 Article Builder"], status: "SPEC_ONLY", note: "5 question articles per product · FAQPage schema · seeded manually today" },
      { phase: "7. Distribution to platforms", bees: ["J3 (LinkedIn)", "N3 (TikTok future)", "M3 (IG future)", "L3 (YT future)", "Q3 (X future)"], status: "PARTIAL", note: "J3 LIVE for LinkedIn · others build per Block 2/3" },
      { phase: "8. Email derivation", bees: ["G7 Email family"], status: "UNCONFIRMED", note: "T0/T2 audit pending (Card B-EMAIL-AUDIT-1)" },
    ],
    keyRule: "STORY = SOURCE OF TRUTH. No content bee invents content. All adapters read Story Object + Derivation Map.",
  },

  "closed-loop": {
    name: "🔁 Closed Loop (12 Components)",
    icon: "🔁",
    description: "Approval → publish → measure → recycle → learn. The Block 5 sprint that turns the system from forward-only to self-improving.",
    block: "Block 5 (~12 hr build · next after Block 2 finishes)",
    color: COLORS.teal,
    steps: [
      { phase: "C1. Schema migrations", bees: ["site_context table", "campaign_calendar upgrade", "content_performance multi-site"], status: "SPEC_ONLY", note: "~45 min · single migration file" },
      { phase: "C2. Approval UI", bees: ["app/dashboard/calendar/page.tsx + 4 server actions"], status: "SPEC_ONLY", note: "~3 hr · approve/edit/reject/reschedule/pause" },
      { phase: "C3. J5 publish gating", bees: ["J5 Publisher (existing)"], status: "LIVE-NEEDS-UPDATE", note: "~30 min · WHERE approval_status IN ('approved','auto_approved')" },
      { phase: "C4. Zernio Analytics", bees: ["operator action: $34/mo restoration"], status: "ON_ICE", note: "Operator action · ~10 min · without this Doctor reads null" },
      { phase: "C5. Doctor Bee cron", bees: ["Doctor (J7/K-Analytics-1)"], status: "BUILT-CRON-NOT-WIRED", note: "~1 hr · 2h + 24h + 7d pulses · per-platform engagement formulas" },
      { phase: "C6. Scientist Bee build", bees: ["Scientist (J8/K-Analytics-2)"], status: "SPEC_ONLY", note: "~2.5 hr · variable rotation V2=hook → V3=format → V4=CTA → V5=character → V6=stop" },
      { phase: "C7. B1 Broker", bees: ["B1 Broker (V2 → Calendar)"], status: "SPEC_ONLY", note: "~1 hr · separate broker per 50-site pub test · idempotent" },
      { phase: "C8. K12 Lessons cron", bees: ["K12 Pattern Extractor"], status: "BUILT-CRON-NOT-WIRED", note: "~30 min · per-site rotation Sunday 8am AWST" },
      { phase: "C9. B2 Broker", bees: ["B2 Broker (Lessons → hook_matrix)"], status: "SPEC_ONLY", note: "~1 hr · DATA-ONLY mutation · never modifies prompts" },
      { phase: "C10. End-to-end test", bees: ["test script"], status: "PENDING", note: "~1 hr · trigger fake FAIL → verify V2 cycle fires through to publish" },
      { phase: "C11. Dashboard JSX update", bees: ["this dashboard"], status: "PENDING", note: "~30 min · show closed-loop status as LIVE" },
      { phase: "C12. Multi-site readiness audit", bees: ["audit cards B-J-AUDIT-1/2/3"], status: "PENDING", note: "~1-2 hr · verify every bee passes site_id through" },
    ],
    keyRule: "12 components ship in build order. Each has effort estimate. Done conditions in Section 9 of LOCKED-LOOP-CLOSURE-SPEC.",
  },

  "linkedin": {
    name: "💼 LinkedIn (J Station)",
    icon: "💼",
    description: "Currently the live distribution channel. Forward path works. Loop closure pending Block 5.",
    block: "Live (forward) + Block 5 (loop closure) + Block 6.5 (story refresh)",
    color: COLORS.teal,
    steps: [
      { phase: "1. Story available", bees: ["G5 Story Object → /stories/", "G5 Derivation Map"], status: "LIVE", note: "Reads from canonical story" },
      { phase: "2. LinkedIn research", bees: ["J1 Research", "J1.5 Viral Templates"], status: "BUILT-UNVERIFIED", note: "J1.5 Claude-knowledge based, not live scrape" },
      { phase: "3. Strategy", bees: ["J2 Strategy"], status: "LIVE", note: "Self-heals when hook_matrix empty (Sonnet fallback)" },
      { phase: "4. Adaptation", bees: ["J3 LinkedIn Adapter", "J3.5 Carousel Copywriter", "J3.6 Carousel Renderer"], status: "LIVE", note: "Char-cap soft-fail (D38) · adapts story for LinkedIn format" },
      { phase: "5. Quality gate", bees: ["J4 LinkedIn Manager"], status: "BUILT-UNVERIFIED", note: "10-check gate per PLATFORM-LINKEDIN.md · status critical to verify" },
      { phase: "6. Schedule", bees: ["I1 Conductor"], status: "LIVE", note: "Writes campaign_calendar (NEEDS upgrade per Block 5 C2)" },
      { phase: "7. Approval", bees: ["operator (UI to be built)"], status: "MISSING", note: "🔴 Block 5 C2 builds this" },
      { phase: "8. Publish", bees: ["J5 LinkedIn Publisher"], status: "LIVE-NEEDS-UPDATE", note: "Block 5 C3 adds approval gate · today bypasses" },
      { phase: "9. Engagement", bees: ["J6 Engagement Bee"], status: "BUILT", note: "Drafts replies · doesn't yet mine to research_questions (Block 5 enhancement)" },
      { phase: "10. Measure", bees: ["Doctor Bee (J7)"], status: "BUILT-CRON-NOT-WIRED", note: "🔴 Loop break — Block 5 C5 wires cron" },
      { phase: "11. Recycle losers", bees: ["Scientist (J8)"], status: "SPEC_ONLY", note: "🔴 Loop break — Block 5 C6 builds" },
      { phase: "12. V2 → Calendar", bees: ["B1 Broker"], status: "SPEC_ONLY", note: "🔴 Loop break — Block 5 C7 builds" },
      { phase: "13. Pattern learn", bees: ["K12 Pattern Extractor"], status: "BUILT-CRON-NOT-WIRED", note: "🔴 Loop break — Block 5 C8 wires cron" },
      { phase: "14. Apply learning", bees: ["B2 Broker"], status: "SPEC_ONLY", note: "🔴 Loop break — Block 5 C9 builds" },
    ],
    keyRule: "LinkedIn is the proven forward path. Block 5 closes the back-half (measure → recycle → learn).",
  },

  "tiktok": {
    name: "🎵 TikTok (N Station)",
    icon: "🎵",
    description: "Block 2 in progress. Builds on Blotato + warm-up infrastructure shipped this session.",
    block: "Block 2 (current sprint, ~17% done)",
    color: COLORS.amber,
    steps: [
      { phase: "1. Foundation infrastructure", bees: ["content_assets table", "lib/content-naming.ts", "lib/_warm-up-guard.ts"], status: "PARTIAL", note: "Tables LIVE · naming LIVE · warm-up guard 50% (Task 2.0e)" },
      { phase: "2. Account warming", bees: ["@taxchecknow TikTok account"], status: "WARMING", note: "Account warming until May 31 WST · J5 in manual_handoff during warm-up" },
      { phase: "3. Story available", bees: ["G5 Derivation Map (tiktok_3s_hook + tiktok_30s_script)"], status: "PARTIAL", note: "G5 LIVE · TikTok-specific fields need Block 2 audit" },
      { phase: "4. TikTok research", bees: ["N1 Research"], status: "SPEC_ONLY", note: "Block 2.3+ build" },
      { phase: "5. Strategy", bees: ["N2 Strategy"], status: "SPEC_ONLY", note: "Block 2.4 build" },
      { phase: "6. Adapter (script + video)", bees: ["N3 Adapter"], status: "SPEC_ONLY", note: "Block 2.5+ · first consumer of content_assets table · uses Blotato video adapter" },
      { phase: "7. Quality gate", bees: ["N4 Manager"], status: "SPEC_ONLY", note: "Block 2.7 build" },
      { phase: "8. Publish", bees: ["N5 Publisher"], status: "SPEC_ONLY", note: "Block 2.8+ · reads warm-up guard · auto vs manual_handoff" },
      { phase: "9. Blotato adapter trio", bees: ["lib/blotato.ts video + social + carousel"], status: "DEFECT", note: "💧 3 defects to fix in Task 2.1 before N5 can fire" },
    ],
    keyRule: "Block 2 ships TikTok pipeline. Closed loop (N7/N8 equivalent) inherits from Block 5 K-station bees.",
  },

  "email-system": {
    name: "📧 Email System Lifecycle",
    icon: "📧",
    description: "Cold capture → personalised T0 → purchase T2 → upsell to $147 → retention. Two-tier personalisation: pre-purchase (data only) + post-purchase (data + name from Stripe).",
    block: "Block 3.5 urgent T2 fix · Block 4 full system · Block 6.7 truth-sync T5 cascade",
    color: COLORS.amber,
    steps: [
      { phase: "1. Cold traffic arrives", bees: ["/stories/, social link, search, AI citation"], status: "LIVE", note: "Multiple acquisition paths" },
      { phase: "2. Calculator filled", bees: ["calculator UI · decision_sessions row created"], status: "LIVE", note: "User enters product-specific data" },
      { phase: "3. Email captured (Save box)", bees: ["calculator email-capture component"], status: "LIVE", note: "DO NOT MODIFY · operator-approved · email only (no name)" },
      { phase: "4. T0 free-calc result email", bees: ["G7-T0 (SPEC_ONLY)"], status: "SPEC_ONLY", note: "Para 1: their data · Para 2: story excerpt · Bridge sentence + CTA to $67" },
      { phase: "5. Stripe purchase happens", bees: ["Stripe checkout · purchases row"], status: "LIVE", note: "Name now available from Stripe customer object" },
      { phase: "6. T2 purchase confirmation", bees: ["G7-T2"], status: "UNCONFIRMED", note: "🔴 Card B-EMAIL-AUDIT-1: does T2 fire today? Potential silent revenue loss." },
      { phase: "7. T3 day-3 action reminder", bees: ["G7-T3"], status: "SPEC_ONLY", note: "Block 4 build · personalised deadline math" },
      { phase: "8. $67 → $147 upsell", bees: ["G7-Upsell (T2.5 day-2 dedicated email)"], status: "SPEC_ONLY", note: "Block 4 build · soft mention in T2 + dedicated upsell" },
      { phase: "9. Nurture sequence", bees: ["nurture_d7 (cross-sell)", "nurture_d14 (review request)", "reminder_d30 (re-engagement)"], status: "SPEC_ONLY", note: "Block 4 build" },
      { phase: "10. Law-change panic email (T5)", bees: ["G7-T5 via Block 6.7 truth-sync cascade"], status: "SPEC_ONLY", note: "Block 6.7 · triggered by product_changes" },
      { phase: "11. I3 abandoner re-engagement", bees: ["I3 Re-engagement Bee"], status: "SPEC_ONLY", note: "decision_sessions WHERE no purchase + 24h old · single follow-up only" },
      { phase: "12. Cross-pollination (S3)", bees: ["G7-S3"], status: "SPEC_ONLY", note: "Block 7+ multi-site · suggests related product on different site" },
    ],
    keyRule: "PRE-purchase: anonymous-but-data-personalised. POST-purchase: full personalisation with name. Sender.com handles all delivery.",
  },

  "truth-sync": {
    name: "⚖️ Truth-Sync Engine (Law Change Cascade)",
    icon: "⚖️",
    description: "Block 6.7 architectural pattern: when reality changes, every dependent system updates. Operator entry → product_changes → cascade to calculator + story + social + email queues with appropriate approval rigor each.",
    block: "Block 6.7 (~10-12 hr · after Block 6 calendar UI ships)",
    color: COLORS.purple,
    steps: [
      { phase: "1. Detection event", bees: ["operator manual entry V1"], status: "SPEC_ONLY", note: "Block 9+ adds RSS-based auto-detection (with operator-confirms gate)" },
      { phase: "2. product_changes table write", bees: ["dashboard UI for entry"], status: "SPEC_ONLY", note: "Schema: product_key, change_type, source, effective_date, affected_entities[], priority, batch_lane, urgency" },
      { phase: "3. Priority + batch routing", bees: ["routing logic"], status: "SPEC_ONLY", note: "Critical: bypasses batching, fires immediately · Routine: batches Tuesday 9am AWST" },
      { phase: "4a. Calculator queue (engineering rigor)", bees: ["F1/F2 versioning wrapper", "F3 + F3b legal validate"], status: "SPEC_ONLY", note: "Creates product_versions row · operator approves activation · rollback always available" },
      { phase: "4b. Story queue (content rigor)", bees: ["B3 Story Refresher (urgent path)"], status: "SPEC_ONLY", note: "Reads product_changes · proposes story update · operator approves · same as routine path UI" },
      { phase: "4c. Social queue (campaign mode)", bees: ["J2_campaign_mode (NEW function)"], status: "SPEC_ONLY", note: "Generates 3-5 posts: update post + urgency post + before/after comparison" },
      { phase: "4d. Email queue", bees: ["G7-T5 family"], status: "DEFERRED-LAYER-4", note: "Block 9+ when G7 email pipeline ships · operator manual notification interim" },
      { phase: "5. Operator dashboard sorted by priority", bees: ["dashboard view"], status: "SPEC_ONLY", note: "Priority + batch view · per-queue approve/reject" },
      { phase: "6. Per-queue execution on approval", bees: ["each pipeline runs its standard flow"], status: "SPEC_ONLY", note: "Calculator activates · story revises · social schedules · email sends" },
      { phase: "7. Logging + audit trail", bees: ["agent_log + product_changes.applied_at"], status: "SPEC_ONLY", note: "Every cascade fully audited · rollback path preserved" },
    ],
    keyRule: "ONE detection event → multiple parallel approval queues → operator orchestrates which fires when. The 'Stripe/Shopify pattern' for tax/visa products.",
  },

  "story-refresh": {
    name: "🔄 Story Compounding (Block 6.5)",
    icon: "🔄",
    description: "Stories are LIVING intelligence pages. Routine refresh path keeps them current with K12 patterns + J6 questions. URL is permanent. Content compounds.",
    block: "Block 6.5 (~6 hr · after Block 5 Loop Closure ships and data accumulates)",
    color: COLORS.teal,
    steps: [
      { phase: "1. Routine signals accumulate", bees: ["K12 Pattern Extractor", "J6 Engagement Bee"], status: "SPEC_ONLY", note: "Block 5 wires these · they generate data B3 needs" },
      { phase: "2. B3 fires monthly", bees: ["B3 Story Refresher cron"], status: "SPEC_ONLY", note: "Monthly cadence default · prevents Google high-frequency-edit penalty" },
      { phase: "3. B3 reads recent signals", bees: ["B3"], status: "SPEC_ONLY", note: "K12 lessons confidence ≥0.85 + J6 customer questions + trend signals" },
      { phase: "4. B3 proposes refinements", bees: ["B3"], status: "SPEC_ONLY", note: "Append/refine — never wholesale rewrite · stronger hooks + new FAQs + updated numbers" },
      { phase: "5. story_revisions row created", bees: ["story_revisions table"], status: "SPEC_ONLY", note: "Every version preserved (rollback path)" },
      { phase: "6. Operator approves diff", bees: ["dashboard /calendar approval UI extension"], status: "SPEC_ONLY", note: "V1 vs V2 diff view · approve/edit/reject" },
      { phase: "7. /stories/[slug] renders new content", bees: ["Next.js page"], status: "LIVE", note: "URL unchanged · dateModified updated" },
      { phase: "8. H1 Distribution Bee re-pings", bees: ["H1 Distribution Bee"], status: "LIVE", note: "IndexNow + Google Indexing + llms.txt updated" },
      { phase: "9. AI engines re-crawl", bees: ["GPTBot, ClaudeBot, PerplexityBot"], status: "LIVE", note: "Citation moat continues to compound" },
    ],
    keyRule: "URL permanent. Content compounds. Append/refine never rewrite. Monthly cadence. The moat doesn't churn — the marketing around it does.",
  },

  "site-launch-runbook": {
    name: "📋 Site Launch Runbook (Block 7 — One-time Setup)",
    icon: "📋",
    description: "The ONE-TIME setup steps to go from 'nothing' to 'site live and ready for operation.' COPIES the proven taxchecknow pattern. After this completes, the Master Conveyor Belt takes over.",
    block: "Block 7 (~6 hr · after Block 6.7 truth-sync ships)",
    color: COLORS.green,
    steps: [
      { phase: "1. Operator runbook (manual)", bees: ["operator: domain + Vercel + Supabase + GA4 + LinkedIn page + Zernio + Blotato"], status: "MANUAL", note: "~half day operator work · once per new site (rare)" },
      { phase: "2. site_context row insert", bees: ["site_context table"], status: "SPEC_ONLY", note: "Single row defines the entire site to the system" },
      { phase: "3. New characters mapped", bees: ["CHARACTERS.md update"], status: "MANUAL", note: "🔴 Critical: new site = new characters (NOT Gary/James — those are taxchecknow)" },
      { phase: "4. Pre-launch audit", bees: ["Session B audits live taxchecknow code"], status: "SPEC_ONLY", note: "🔴 Block 7 sign-off requires this audit FIRST · documents the proven pattern" },
      { phase: "5. PRODUCT-BUILD-PATTERN.md written", bees: ["audit deliverable"], status: "PENDING", note: "Canonical doc for the taxchecknow product structure (Stripe + tiers + popups + GEO + routes)" },
      { phase: "6. First product seeded", bees: ["operator + Lovable for calculator"], status: "MANUAL", note: "F-station automation is Block 9+ · operator hand-builds for now" },
      { phase: "7. /stories/, /questions/, /gpt/, llms.txt, robots.txt routes added", bees: ["site replicates taxchecknow infrastructure"], status: "MANDATORY", note: "🔴 Section 0 preservation rule — site #2 MUST have all these routes" },
      { phase: "8. H1 Distribution Bee for new site", bees: ["H1 distribution-bee with new site config"], status: "SPEC_ONLY", note: "Per-site H1 instance OR config-aware H1" },
      { phase: "9. G5 + character bee fires", bees: ["G5 with new site_context"], status: "PARTIAL", note: "G5 LIVE for taxchecknow · multi-site untested · Block 7 verifies" },
      { phase: "10. Multi-site smoke test", bees: ["3 clean drafts + 3 clean approvals + 0 contamination"], status: "SPEC_ONLY", note: "Sign-off gate per ChatGPT spec · Section 11 of LOCKED-LOOP-CLOSURE-SPEC" },
      { phase: "11. Per-site warm-up", bees: ["lib/_warm-up-guard.ts"], status: "PARTIAL", note: "TikTok-only today · Block 2.0e · LinkedIn warm-up rules pending codification" },
      { phase: "12. Site goes live", bees: ["full pipeline"], status: "PENDING", note: "When all 11 above pass · then operating same as taxchecknow" },
    ],
    keyRule: "COPY the proven taxchecknow pattern. Don't reinvent. Multi-site contamination is the catastrophic failure mode — site_id discipline + RLS + character binding prevent it.",
  },

  "instagram": {
    name: "📸 Instagram (M Station)",
    icon: "📸",
    description: "Future platform · Block 3A · derives from G5 Derivation Map.",
    block: "Block 3A (after Block 5 + Block 7)",
    color: COLORS.amber,
    steps: [
      { phase: "1. M station bees not yet built", bees: ["M1 Research", "M2 Strategy", "M3 Adapter (Reels + Carousels)", "M4 Manager", "M5 Publisher"], status: "SPEC_ONLY", note: "All 5 bees pending Block 3A" },
      { phase: "2. Account warm-up needed", bees: ["@taxchecknow Instagram"], status: "PENDING", note: "Per-platform warm-up rule applies · lib/_warm-up-guard.ts must be IG-aware" },
      { phase: "3. Reuses TikTok video output", bees: ["N3 video output → IG Reels"], status: "SPEC_ONLY", note: "Reels are short-form video · likely shares N3's video derivation" },
      { phase: "4. Carousels separate", bees: ["M3 reads Derivation Map carousel_slides"], status: "SPEC_ONLY", note: "Different format from text/video · 5-7 visual slides" },
      { phase: "5. Captions adapted", bees: ["M3 reads Derivation Map"], status: "SPEC_ONLY", note: "Per PLATFORM-INSTAGRAM.md rules" },
      { phase: "6. Loop closure inherits from K station", bees: ["Doctor + Scientist + K12 + B1 + B2"], status: "SPEC_ONLY", note: "Same K-station bees that close loop for LinkedIn close it for IG" },
    ],
    keyRule: "All future platforms inherit Block 5 closed loop. Per-platform: only the adapter (M3) and publisher (M5) are platform-specific.",
  },

  "youtube-shorts": {
    name: "📹 YouTube Shorts (L Station — Block 3B)",
    icon: "📹",
    description: "Short-form vertical video · 60 seconds · inherits TikTok pattern (60-second video, vertical, hook-driven). Block 3B.",
    block: "Block 3B (after Block 3A Instagram)",
    color: COLORS.red,
    steps: [
      { phase: "1. L-Shorts bees not yet built", bees: ["L1-Shorts Research", "L2-Shorts Strategy", "L3-Shorts Adapter", "L5-Shorts Publisher"], status: "SPEC_ONLY", note: "All Shorts bees pending Block 3B" },
      { phase: "2. YOUTUBE_REFRESH_TOKEN missing", bees: ["operator action: OAuth setup"], status: "BLOCKED", note: "🔴 Critical · L5 cannot publish without this regardless of bee build status" },
      { phase: "3. Reuses TikTok video output", bees: ["L1-Shorts reads N3 video derivation"], status: "SPEC_ONLY", note: "Vertical 60s video format = same as TikTok · cross-platform reuse" },
      { phase: "4. Adapter formats for YT Shorts", bees: ["L3-Shorts"], status: "SPEC_ONLY", note: "Shorts have own thumbnail/title rules · platform-specific adaptation" },
      { phase: "5. Quality gate", bees: ["L4-Shorts Manager"], status: "SPEC_ONLY", note: "Per PLATFORM-YOUTUBE.md Shorts rules" },
      { phase: "6. Per-platform warm-up", bees: ["lib/_warm-up-guard.ts (YT-aware)"], status: "SPEC_ONLY", note: "Today TikTok-only · Block 3B extends to YT" },
      { phase: "7. Publish via YouTube Data API v3", bees: ["L5-Shorts Publisher"], status: "SPEC_ONLY", note: "Direct API · NOT Blotato (Blotato YT path is unverified)" },
      { phase: "8. Loop closure inherits from K station", bees: ["Doctor + Scientist + K12 + brokers"], status: "SPEC_ONLY", note: "Same K-station bees that close loop for all platforms" },
    ],
    keyRule: "Shorts = TikTok video reused + YT-specific metadata. Adapter and Publisher are platform-specific; everything else inherits.",
  },

  "youtube-long-form": {
    name: "🎥 YouTube Long-form (L Station — Block 3D)",
    icon: "🎥",
    description: "Horizontal long-form video · 8-15 min explainer format · narrative arcs · different audience behavior than Shorts. Block 3D.",
    block: "Block 3D (after Shorts + IG + X · biggest production effort)",
    color: COLORS.red,
    steps: [
      { phase: "1. L-LongForm bees not yet built", bees: ["L1-LF Research", "L2-LF Strategy", "L3-LF Script Builder", "L4-LF Manager", "L5-LF Publisher"], status: "SPEC_ONLY", note: "Most expensive station · highest production cost per asset" },
      { phase: "2. YOUTUBE_REFRESH_TOKEN missing", bees: ["operator action: OAuth setup"], status: "BLOCKED", note: "🔴 Same OAuth blocker as Shorts" },
      { phase: "3. Different script format from TikTok/Shorts", bees: ["G8-LF Video Scripter (long-form variant)"], status: "SPEC_ONLY", note: "8-15 min · multi-act narrative · NOT a 30s hook" },
      { phase: "4. Story → multi-chapter arc", bees: ["L3-LF reads /stories/[slug] full content (not just Derivation Map)"], status: "SPEC_ONLY", note: "Long-form reads ENTIRE canonical story · not just snippets · only platform that does this" },
      { phase: "5. Production complexity", bees: ["video editing service / Remotion / external"], status: "SPEC_ONLY", note: "Per GOAT-BEEHIVE-ARCHITECTURE.md · Remotion video gen specced · long-form needs more shots" },
      { phase: "6. Thumbnail design", bees: ["thumbnail generator"], status: "SPEC_ONLY", note: "Long-form CTR depends heavily on thumbnail · separate visual asset" },
      { phase: "7. Title/description SEO", bees: ["L4-LF Manager"], status: "SPEC_ONLY", note: "YT search algorithm · different from social · keyword research per video" },
      { phase: "8. Quality gate (higher bar)", bees: ["L4-LF Manager"], status: "SPEC_ONLY", note: "More expensive to fix post-publish · higher quality threshold" },
      { phase: "9. Publish via YouTube Data API v3", bees: ["L5-LF Publisher"], status: "SPEC_ONLY", note: "Same API as Shorts · different upload settings" },
      { phase: "10. Loop closure with longer measurement window", bees: ["Doctor + Scientist + K12 + brokers"], status: "SPEC_ONLY", note: "Long-form metrics need 7-30 day windows (vs 24h for shorts) · Doctor measurement schedule extends" },
    ],
    keyRule: "Long-form = different cost structure, different audience, different metrics. NOT just longer Shorts. Block 3D specifically because it's the biggest production lift.",
  },

  "x-twitter": {
    name: "🐦 X / Twitter (Q Station)",
    icon: "🐦",
    description: "Future platform · Block 3C · threads from /stories/ derivation.",
    block: "Block 3C (after Block 3A IG)",
    color: COLORS.amber,
    steps: [
      { phase: "1. Q station bees not yet built", bees: ["Q1-Q5"], status: "SPEC_ONLY", note: "All bees pending Block 3C" },
      { phase: "2. Threads from Derivation Map x_thread_opener", bees: ["Q3 Adapter"], status: "SPEC_ONLY", note: "Reads Derivation Map · adapts to 7-10 tweet thread format" },
      { phase: "3. Loop closure inherits from K station", bees: ["Doctor + Scientist + K12 + brokers"], status: "SPEC_ONLY", note: "Same as IG/YT · platform-specific only at adapter + publisher" },
    ],
    keyRule: "Threads = same story, different format. Lower priority than IG + YT for COLE customer base (40-65 demographic).",
  },

  "reddit": {
    name: "👽 Reddit (O Station — SABRINA-PLAYBOOK)",
    icon: "👽",
    description: "Manual today · brand handle u/taxchecknow · governed by SABRINA-PLAYBOOK.md. Reddit is harder than other platforms because authenticity matters and bots get banned.",
    block: "Manual today · automation Block 9+ · low priority (highest manual sensitivity)",
    color: COLORS.orange,
    steps: [
      { phase: "1. Manual today (per SABRINA-PLAYBOOK)", bees: ["operator: u/taxchecknow account"], status: "MANUAL", note: "Brand handle · post in relevant tax/visa/finance subreddits when topic comes up · NEVER spam · NEVER promote" },
      { phase: "2. O1 Opportunity Scanner (future)", bees: ["O1 Reddit scanner"], status: "SPEC_ONLY", note: "Watches subreddits for matching topic threads · flags threads where brand could legitimately help" },
      { phase: "3. Operator decides which threads are right", bees: ["operator approval"], status: "MANUAL", note: "🔴 Reddit is high-sensitivity · operator vetoes any auto-post · always" },
      { phase: "4. Response derived from /stories/", bees: ["O3 Reddit Adapter (future)"], status: "SPEC_ONLY", note: "Reads canonical story · drafts a Reddit-appropriate response · 200 words · no hard sell · helpful first" },
      { phase: "5. Operator posts manually", bees: ["operator"], status: "MANUAL", note: "🔴 NEVER auto-post to Reddit · auto-detection ban risk · always human in the loop" },
      { phase: "6. First-comment link to /stories/", bees: ["operator"], status: "MANUAL", note: "Same canonical URL pattern as other platforms · Reddit allows links if relevant" },
      { phase: "7. Engagement monitoring", bees: ["O5 (future) or J6 generalised"], status: "SPEC_ONLY", note: "Track engagement · Reddit has high signal/noise" },
      { phase: "8. Reddit-specific learning", bees: ["K12 with Reddit segmentation"], status: "SPEC_ONLY", note: "Reddit patterns differ from social · per-platform K12 segmentation respects this" },
    ],
    keyRule: "Reddit is the most manual-sensitive platform. SABRINA-PLAYBOOK.md is canonical. Auto-posting risks brand ban — operator always in the loop. Brand handle u/taxchecknow only.",
  },

  "cleaning-madame": {
    name: "🧹 Madame · Cleaning Queen (Hive 4)",
    icon: "🧹",
    description: "Maintenance, deduplication, cost control, backup verification. Runs autonomously after content accumulates.",
    block: "Block 4 (after Block 5 ships and data accumulates · ~Sunday batch)",
    color: COLORS.amber, // neon yellow per session decision but using closest to amber for visibility
    steps: [
      { phase: "1. K15 Storage Sweeper", bees: ["K15"], status: "SPEC_ONLY", note: "PDFs >90d · orphan renders >30d · cleans /assets bucket" },
      { phase: "2. K16 Log Archiver", bees: ["K16"], status: "SPEC_ONLY", note: "agent_log >90d → cold archive · keeps query performance" },
      { phase: "3. K17 Queue Janitor", bees: ["K17"], status: "SPEC_ONLY", note: "content_jobs in_progress >14d · video_queue stale rows" },
      { phase: "4. K21 Cost Reporter", bees: ["K21"], status: "SPEC_ONLY", note: "Weekly token spend · budget alerts" },
      { phase: "5. K22 Backup Verifier", bees: ["K22"], status: "SPEC_ONLY", note: "Confirms Supabase backup health" },
      { phase: "6. Story dedup (Block 6.5+)", bees: ["dedup logic"], status: "SPEC_ONLY", note: "Merges overlapping story arcs · prevents SEO cannibalisation" },
    ],
    keyRule: "Sunday-batched · autonomous · system stays efficient as it scales. Madame's voice: dry-butler-sarcasm.",
  },
};

function BeeCard({ bee, onClick, selected }) {
  return (
    <div
      onClick={() => onClick(bee)}
      style={{
        background: selected ? bee.status.bg : "#0f1e35",
        border: `1px solid ${selected ? bee.status.color : COLORS.border}`,
        borderRadius: 8,
        padding: 12,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, lineHeight: 1.3 }}>{bee.name}</span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <span style={{ background: bee.status.bg, color: bee.status.color, padding: "2px 8px", borderRadius: 3, fontSize: 10, fontWeight: 700 }}>
          {bee.status.label}
        </span>
        <span style={{ background: "#1e3a5f", color: COLORS.textDim, padding: "2px 8px", borderRadius: 3, fontSize: 10 }}>
          {bee.token}
        </span>
        {bee.commit && (
          <span style={{ background: COLORS.greenDim, color: COLORS.green, padding: "2px 8px", borderRadius: 3, fontSize: 10, fontFamily: "monospace" }}>
            {bee.commit}
          </span>
        )}
      </div>
    </div>
  );
}

function Section({ label, items, color }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      {items.map((item, i) => {
        const isTable = Object.keys(DB_TABLES).includes(item);
        return (
          <div
            key={i}
            style={{
              fontSize: 12,
              color: isTable ? DB_TABLES[item].color : COLORS.textDim,
              marginBottom: 3,
              paddingLeft: 8,
              borderLeft: `2px solid ${isTable ? DB_TABLES[item].color : "#1e3a5f"}`,
              fontFamily: isTable ? "monospace" : "inherit",
              fontWeight: isTable ? 600 : 400,
            }}
          >
            {isTable ? `⬡ ${item}` : item}
          </div>
        );
      })}
    </div>
  );
}

function DetailPanel({ bee, onClose }) {
  if (!bee) return null;
  return (
    <div style={{
      background: "#0a1628",
      border: `1px solid ${bee.status.color}`,
      borderRadius: 12,
      padding: 20,
      position: "sticky",
      top: 20,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>{bee.name}</div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.textDim, cursor: "pointer", fontSize: 20, marginTop: -4 }}>×</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ background: bee.status.bg, color: bee.status.color, padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
          {bee.status.label}
        </span>
        <span style={{ background: "#1e3a5f", color: COLORS.textDim, padding: "3px 10px", borderRadius: 4, fontSize: 11 }}>
          {bee.token}
        </span>
        <span style={{ background: "#1e3a5f", color: COLORS.textDim, padding: "3px 10px", borderRadius: 4, fontSize: 11 }}>
          Station {bee.station}
        </span>
        {bee.commit && (
          <span style={{ background: COLORS.greenDim, color: COLORS.green, padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "monospace" }}>
            commit {bee.commit}
          </span>
        )}
      </div>
      <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6, marginBottom: 16 }}>{bee.role}</div>
      <Section label="📥 READS FROM" items={bee.reads} color={COLORS.blue} />
      <Section label="📤 WRITES TO" items={bee.writes} color={COLORS.teal} />
      {bee.flags.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.amber, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
            ⚠ FLAGS / ISSUES
          </div>
          {bee.flags.map((f, i) => (
            <div key={i} style={{ fontSize: 12, color: COLORS.amber, marginBottom: 4, paddingLeft: 8, borderLeft: `2px solid ${COLORS.amber}`, lineHeight: 1.5 }}>
              {f}
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 12, fontSize: 11, color: COLORS.textDim }}>
        <strong style={{ color: COLORS.textDim }}>Runs:</strong> {bee.runs}
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [filterStation, setFilterStation] = useState("ALL");
  const [tab, setTab] = useState("flow");
  const [selectedLifecycle, setSelectedLifecycle] = useState("create-new-site");

  const stations = ["ALL", ...Object.keys(stationInfo)];

  const filtered = beeData.filter(b => {
    if (filterStation !== "ALL" && b.station !== filterStation) return false;
    return true;
  });

  const counts = {
    LIVE: beeData.filter(b => b.status === STATUS.LIVE).length,
    BUILT: beeData.filter(b => b.status === STATUS.BUILT).length,
    IN_PROGRESS: beeData.filter(b => b.status === STATUS.IN_PROGRESS).length,
    STUB: beeData.filter(b => b.status === STATUS.STUB).length,
    UNVERIFIED: beeData.filter(b => b.status === STATUS.UNVERIFIED).length,
    DEFECT: beeData.filter(b => b.status === STATUS.DEFECT).length,
    SPEC_ONLY: beeData.filter(b => b.status === STATUS.SPEC_ONLY).length,
  };

  const totalBees = beeData.length;
  const operationalBees = counts.LIVE + counts.BUILT;
  const operationalPct = Math.round((operationalBees / totalBees) * 100);

  // Lopsidedness: how unevenly is depth distributed?
  const stationDepth = {};
  Object.keys(stationInfo).forEach(s => {
    const sBees = beeData.filter(b => b.station === s);
    const sLive = sBees.filter(b => b.status === STATUS.LIVE || b.status === STATUS.BUILT).length;
    stationDepth[s] = { total: sBees.length, live: sLive, pct: sBees.length ? Math.round((sLive / sBees.length) * 100) : 0 };
  });

  return (
    <div style={{ background: COLORS.navy, minHeight: "100vh", color: COLORS.text, fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: COLORS.navyLight, borderBottom: `1px solid ${COLORS.border}`, padding: "16px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1400, margin: "0 auto", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.teal, letterSpacing: -0.5 }}>COLE BEE WORKFLOW · LIVE</div>
            <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 2 }}>{totalBees} bees · 14 stations · May 4 2026 · {operationalBees}/{totalBees} operational ({operationalPct}%)</div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {Object.entries(counts).map(([k, v]) => (
              <div key={k} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: STATUS[k]?.color || COLORS.text }}>{v}</div>
                <div style={{ fontSize: 9, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 0.5 }}>{k.replace("_", " ")}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: COLORS.navyLight, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", display: "flex", gap: 0, flexWrap: "wrap" }}>
          {[
            ["flow", "🔀 Bee Flow"],
            ["lifecycle", "🧬 Lifecycle Viewer"],
            ["lopsided", "📐 Lopsidedness Audit"],
            ["block2", "🛠 Block 2 Progress"],
            ["issues", "⚠️ Issues & Gaps"],
            ["db", "⬡ Database Tables"],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              background: tab === id ? COLORS.teal : "none",
              border: "none", color: tab === id ? "#fff" : COLORS.textDim,
              padding: "12px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600,
              borderRadius: tab === id ? "4px 4px 0 0" : 0,
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>

        {/* FLOW TAB */}
        {tab === "flow" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {stations.map(s => (
                <button key={s} onClick={() => setFilterStation(s)} style={{
                  background: filterStation === s ? (stationInfo[s]?.color || COLORS.teal) : "#0f1e35",
                  border: `1px solid ${filterStation === s ? (stationInfo[s]?.color || COLORS.teal) : COLORS.border}`,
                  color: filterStation === s ? "#fff" : COLORS.textDim,
                  padding: "4px 12px", borderRadius: 20, cursor: "pointer", fontSize: 11, fontWeight: 600,
                }}>{s === "ALL" ? "ALL" : stationInfo[s]?.label?.split("—")[0]?.trim() || s}</button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 24, alignItems: "start" }}>
              <div>
                {(filterStation === "ALL" ? Object.keys(stationInfo) : [filterStation]).map(station => {
                  const bees = filtered.filter(b => b.station === station);
                  if (bees.length === 0) return null;
                  const info = stationInfo[station] || {};
                  const live = bees.filter(b => b.status === STATUS.LIVE || b.status === STATUS.BUILT).length;
                  return (
                    <div key={station} style={{ marginBottom: 32 }}>
                      <div style={{
                        background: `${info.color}20`, border: `1px solid ${info.color}40`,
                        borderRadius: 8, padding: "10px 16px", marginBottom: 12,
                        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
                      }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: info.color }}>{info.label}</div>
                          <div style={{ fontSize: 11, color: COLORS.textDim }}>{info.desc} · {bees.length} bees</div>
                        </div>
                        <div style={{
                          fontSize: 11, color: info.color,
                          background: `${info.color}20`, padding: "2px 8px", borderRadius: 4,
                        }}>
                          {live}/{bees.length} live/built
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
                        {bees.map(bee => (
                          <BeeCard key={bee.id} bee={bee} onClick={setSelected} selected={selected?.id === bee.id} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              {selected && <DetailPanel bee={selected} onClose={() => setSelected(null)} />}
            </div>
          </div>
        )}

        {/* LIFECYCLE VIEWER TAB */}
        {tab === "lifecycle" && (
          <div>
            <div style={{ background: COLORS.navyDarker, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.teal, marginBottom: 8 }}>
                🧬 Lifecycle Viewer · pick a system, see the entire flow
              </div>
              <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.7 }}>
                Choose any lifecycle below to see the full bee flow, status per phase, and key architectural rules.
                Each lifecycle traces back to the canonical <strong style={{ color: COLORS.teal }}>LOCKED-LOOP-CLOSURE-SPEC.md</strong>.
                <br /><br />
                <strong style={{ color: COLORS.amber }}>This is the operator's bible.</strong> Future updates to the system must check that they fit with these flows.
              </div>
            </div>

            {/* LIFECYCLE PICKER */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 8, marginBottom: 24 }}>
              {Object.entries(lifecycles).map(([key, lc]) => (
                <button
                  key={key}
                  onClick={() => setSelectedLifecycle(key)}
                  style={{
                    background: selectedLifecycle === key ? `${lc.color}30` : "#0f1e35",
                    border: `1px solid ${selectedLifecycle === key ? lc.color : COLORS.border}`,
                    borderRadius: 8,
                    padding: "10px 14px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, color: selectedLifecycle === key ? lc.color : COLORS.text, marginBottom: 4 }}>
                    {lc.icon} {lc.name.replace(lc.icon + " ", "")}
                  </div>
                  <div style={{ fontSize: 10, color: COLORS.textDim, lineHeight: 1.4 }}>{lc.block}</div>
                </button>
              ))}
            </div>

            {/* SELECTED LIFECYCLE DETAIL */}
            {selectedLifecycle && lifecycles[selectedLifecycle] && (
              <div>
                <div style={{
                  background: `${lifecycles[selectedLifecycle].color}15`,
                  border: `1px solid ${lifecycles[selectedLifecycle].color}50`,
                  borderRadius: 12,
                  padding: 24,
                  marginBottom: 20,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: lifecycles[selectedLifecycle].color, marginBottom: 8 }}>
                    {lifecycles[selectedLifecycle].name}
                  </div>
                  <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.6, marginBottom: 12 }}>
                    {lifecycles[selectedLifecycle].description}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 4 }}>
                    <strong style={{ color: COLORS.amber }}>Block:</strong> {lifecycles[selectedLifecycle].block}
                  </div>
                </div>

                {/* PHASES / FLOW STEPS */}
                <div style={{ marginBottom: 24 }}>
                  {lifecycles[selectedLifecycle].steps.map((step, i) => {
                    const statusColor = 
                      step.status === "LIVE" ? COLORS.teal :
                      step.status === "BUILT" ? COLORS.green :
                      step.status === "PARTIAL" ? COLORS.blue :
                      step.status === "BUILT-CRON-NOT-WIRED" ? COLORS.amber :
                      step.status === "BUILT-UNVERIFIED" ? COLORS.pink :
                      step.status === "LIVE-NEEDS-UPDATE" ? COLORS.amber :
                      step.status === "WARMING" ? COLORS.amber :
                      step.status === "MISSING" ? COLORS.red :
                      step.status === "BLOCKED" ? COLORS.red :
                      step.status === "DEFECT" ? COLORS.red :
                      step.status === "UNCONFIRMED" ? COLORS.pink :
                      step.status === "ON_ICE" ? COLORS.grey :
                      step.status === "MANUAL" ? COLORS.purple :
                      step.status === "MANDATORY" ? COLORS.amber :
                      step.status === "DEFERRED-LAYER-4" ? COLORS.grey :
                      step.status === "PENDING" ? COLORS.textDim :
                      COLORS.orange; // SPEC_ONLY default

                    return (
                      <div key={i} style={{
                        background: "#0f1e35",
                        border: `1px solid ${statusColor}40`,
                        borderLeft: `4px solid ${statusColor}`,
                        borderRadius: 6,
                        padding: 16,
                        marginBottom: 8,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 12, flexWrap: "wrap" }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, flex: "1 1 auto" }}>
                            {step.phase}
                          </div>
                          <span style={{
                            background: `${statusColor}25`,
                            color: statusColor,
                            padding: "2px 8px",
                            borderRadius: 3,
                            fontSize: 10,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}>
                            {step.status}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                          {step.bees.map((bee, j) => (
                            <span key={j} style={{
                              background: "#1e3a5f",
                              color: COLORS.textDim,
                              padding: "2px 8px",
                              borderRadius: 3,
                              fontSize: 11,
                              fontFamily: "monospace",
                            }}>
                              {bee}
                            </span>
                          ))}
                        </div>
                        {step.note && (
                          <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.5, fontStyle: "italic" }}>
                            {step.note}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* KEY RULE */}
                <div style={{
                  background: COLORS.navyDarker,
                  border: `2px solid ${lifecycles[selectedLifecycle].color}`,
                  borderRadius: 8,
                  padding: 20,
                  marginBottom: 16,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: lifecycles[selectedLifecycle].color, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                    🔒 Key Architectural Rule
                  </div>
                  <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.6 }}>
                    {lifecycles[selectedLifecycle].keyRule}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LOPSIDEDNESS TAB */}
        {tab === "lopsided" && (
          <div>
            <div style={{ background: COLORS.navyDarker, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.teal, marginBottom: 8 }}>
                The shape of the build · are we lopsided?
              </div>
              <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.7 }}>
                <strong style={{ color: COLORS.amber }}>Yes — deliberately.</strong> Per Locked Rule #11 (Live Products Are Verbatim Base), 
                LinkedIn was built deep first to validate the architecture against AU-19 baseline. Other platforms now follow 
                the proven pattern (Block 3A-3D). Coordination layer (Queens, Madame) builds last — once content flows.
                <br/><br/>
                The lopsided shape is V1's intentional shape. Cathedral built one buttress at a time, not even spread of stones at ground level.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
              {Object.entries(stationDepth).map(([station, depth]) => {
                const info = stationInfo[station];
                if (!info) return null;
                return (
                  <div key={station} style={{
                    background: "#0f1e35",
                    border: `1px solid ${info.color}40`,
                    borderLeft: `4px solid ${info.color}`,
                    borderRadius: 8,
                    padding: 16,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: info.color, marginBottom: 4 }}>
                      {info.label}
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 10 }}>
                      {depth.live}/{depth.total} live or built · <strong style={{ color: depth.pct === 100 ? COLORS.green : depth.pct > 50 ? COLORS.amber : depth.pct > 0 ? COLORS.orange : COLORS.red }}>{depth.pct}% depth</strong>
                    </div>
                    <div style={{ background: COLORS.navy, height: 8, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        background: depth.pct === 100 ? COLORS.green : depth.pct > 50 ? COLORS.amber : depth.pct > 0 ? COLORS.orange : COLORS.red,
                        height: "100%",
                        width: `${depth.pct}%`,
                        transition: "width 0.3s",
                      }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BLOCK 2 PROGRESS TAB */}
        {tab === "block2" && (
          <div>
            <div style={{ background: COLORS.navyDarker, border: `1px solid ${COLORS.teal}40`, borderLeft: `4px solid ${COLORS.teal}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.teal, marginBottom: 8 }}>
                Block 2 — Blotato + TikTok · ~17% (3 of 19 sub-tasks)
              </div>
              <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.7 }}>
                Foundation layer (2.0a-e) ships first so all downstream bees write to a structured asset registry. 
                Per drift #33: existing Blotato adapter trio is correct architecture — Task 2.1 is gap-fill + warm-up guard, NOT greenfield.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
              {[
                { id: "2.0a", name: "Naming convention spec doc", status: "DONE", commit: "8e972d7", note: "471 lines · committed to cole-marketing" },
                { id: "2.0b", name: "content_assets table migration", status: "DONE", commit: "—", note: "25 cols · 7 constraints · 8 indexes · 2 RLS policies" },
                { id: "2.0c", name: "lib/content-naming.ts helper", status: "DONE", commit: "5bc0b56", note: "415 lines · 38 tests passing · auto-synced spec from cole-marketing" },
                { id: "2.0d", name: "Naming + content_assets manuals", status: "NEXT", commit: "—", note: "USER + BUILD per Rule #15" },
                { id: "2.0e", name: "Warm-up guard infrastructure", status: "IN PROGRESS", commit: "—", note: "DB done · Session B building helper now" },
                { id: "2.1", name: "Blotato adapter trio defect fixes", status: "PENDING", commit: "—", note: "Fix 3 defects + warm-up guard wiring" },
                { id: "2.2", name: "Blotato integration manuals", status: "PENDING", commit: "—", note: "" },
                { id: "2.3", name: "N1 TT Research Bee", status: "PENDING", commit: "—", note: "Haiku · TikTok web research" },
                { id: "2.4", name: "N1 USER + BUILD manuals", status: "PENDING", commit: "—", note: "" },
                { id: "2.5", name: "N2 TT Strategy Bee", status: "PENDING", commit: "—", note: "Sonnet · keyword + 5-hook lab" },
                { id: "2.6", name: "N2 USER + BUILD manuals", status: "PENDING", commit: "—", note: "" },
                { id: "2.7", name: "N3 TT Adapter Bee", status: "PENDING", commit: "—", note: "First consumer of content_assets + lib/content-naming.ts" },
                { id: "2.8", name: "N3 USER + BUILD manuals", status: "PENDING", commit: "—", note: "" },
                { id: "2.9", name: "N4 TT Manager Bee", status: "PENDING", commit: "—", note: "9-point quality gate" },
                { id: "2.10", name: "N4 USER + BUILD manuals", status: "PENDING", commit: "—", note: "" },
                { id: "2.11", name: "N5 TT Publisher Bee", status: "PENDING", commit: "—", note: "Reads warm-up guard · manual_handoff or auto" },
                { id: "2.12", name: "N5 USER + BUILD manuals", status: "PENDING", commit: "—", note: "" },
                { id: "2.13", name: "End-to-end TikTok test against AU-19", status: "PENDING", commit: "—", note: "" },
                { id: "2.14", name: "I1 conductor integration (tt_adapted gating)", status: "PENDING", commit: "—", note: "" },
              ].map(t => {
                const colorMap = { DONE: COLORS.green, "IN PROGRESS": COLORS.blue, NEXT: COLORS.amber, PENDING: COLORS.textDim };
                const c = colorMap[t.status];
                return (
                  <div key={t.id} style={{
                    background: "#0f1e35",
                    border: `1px solid ${c}40`,
                    borderLeft: `4px solid ${c}`,
                    borderRadius: 6,
                    padding: "10px 16px",
                    display: "grid",
                    gridTemplateColumns: "60px 1fr auto",
                    gap: 12,
                    alignItems: "center",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: c, fontFamily: "monospace" }}>{t.id}</div>
                    <div>
                      <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 600 }}>{t.name}</div>
                      {t.note && <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>{t.note}</div>}
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {t.commit !== "—" && (
                        <span style={{ background: COLORS.greenDim, color: COLORS.green, padding: "2px 8px", borderRadius: 3, fontSize: 10, fontFamily: "monospace" }}>
                          {t.commit}
                        </span>
                      )}
                      <span style={{ background: `${c}20`, color: c, padding: "3px 10px", borderRadius: 3, fontSize: 10, fontWeight: 700 }}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ISSUES TAB */}
        {tab === "issues" && (
          <div>
            <div style={{ fontSize: 14, color: COLORS.textDim, marginBottom: 20 }}>
              {issuesList.length} issues found across the workflow · sorted by severity
            </div>
            {issuesList.map((issue, i) => {
              const bgMap = { CRITICAL: COLORS.redDim, HIGH: COLORS.amberDim, MEDIUM: "#7c3aed20", LOW: COLORS.greenDim };
              const colMap = { CRITICAL: COLORS.red, HIGH: COLORS.amber, MEDIUM: COLORS.purple, LOW: COLORS.green };
              return (
                <div key={i} style={{
                  background: bgMap[issue.sev], border: `1px solid ${colMap[issue.sev]}40`,
                  borderLeft: `4px solid ${colMap[issue.sev]}`,
                  borderRadius: 8, padding: "12px 16px", marginBottom: 10,
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}>
                  <div style={{ fontSize: 18, flexShrink: 0 }}>{issue.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: colMap[issue.sev], marginBottom: 4 }}>{issue.sev}</div>
                    <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>{issue.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DB TAB */}
        {tab === "db" && (
          <div>
            <div style={{ fontSize: 14, color: COLORS.textDim, marginBottom: 20 }}>
              Supabase tables in the workflow. RLS enabled on all 45 tables ✅ · 🆕 = added in Block 2 · 🚫 = specced but no table exists yet
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {Object.entries(DB_TABLES).map(([table, { color, state }]) => {
                const writers = beeData.filter(b => b.writes.some(w => w.includes(table)));
                const readers = beeData.filter(b => b.reads.some(r => r.includes(table)));
                return (
                  <div key={table} style={{
                    background: "#0f1e35",
                    border: `1px solid ${color}40`,
                    borderLeft: `4px solid ${color}`,
                    borderRadius: 8,
                    padding: "12px 16px",
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color, fontFamily: "monospace", marginBottom: 4 }}>
                      ⬡ {table}
                    </div>
                    <div style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 8, fontStyle: "italic" }}>
                      {state}
                    </div>
                    {writers.length > 0 && (
                      <div style={{ marginBottom: 6 }}>
                        <div style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 3 }}>WRITTEN BY</div>
                        {writers.map(b => (
                          <div key={b.id} style={{ fontSize: 11, color: b.status.color, marginBottom: 2 }}>
                            → {b.name}
                          </div>
                        ))}
                      </div>
                    )}
                    {readers.length > 0 && (
                      <div>
                        <div style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 3 }}>READ BY</div>
                        {readers.map(b => (
                          <div key={b.id} style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 2 }}>
                            ← {b.name}
                          </div>
                        ))}
                      </div>
                    )}
                    {writers.length === 0 && readers.length === 0 && (
                      <div style={{ fontSize: 11, color: COLORS.red }}>⚠ NO BEES REFERENCE THIS TABLE</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "16px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: COLORS.textDim }}>
          Living document · last updated May 4 2026 · update this when bees ship · click any bee for full detail
        </div>
      </div>
    </div>
  );
}
