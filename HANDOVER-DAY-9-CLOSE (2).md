# NEXT-CHAT HANDOFF — Day 9 EOD State

**Date:** May 12 2026 (Day 9 of expanded sprint)
**Operator:** Matt (AWST timezone)
**Hours today:** ~9.5 hours (6:30 AM → 4:00 PM AWST)
**Last commit:** `c041e0d` — Brave SERP wrapper + dispatch + overlay toggle (E2a off, E2b on)

---

## TL;DR for fresh chat

**Phase 2 Step 4 (E2 Market Researcher) shipped its full architectural foundation today.** The multi-source row-of-bees pattern, source-agnostic schema, dispatch infrastructure, dashboard panel, and cron schedule are all live in production.

**Two infrastructure blockers prevented Day 9 from producing first rows in `market_research_signals`:**
1. **Google Custom Search API** returns "API key expired" despite freshly created key + Custom Search API enabled in project. Cause unknown after ~3 hours debugging.
2. **Reddit public JSON endpoint** rejects unauthenticated requests from Vercel egress IP pool. 15/15 fetches failed on first test.

**Day 10 priorities:**
1. Pivot Reddit fetch path OR resolve OAuth (Reddit CAPTCHA loop blocker)
2. Ship E2c (StackExchange) — self-contained bee, no IP risk
3. Ship E2e (AI citations) — self-contained bee, captures GEO/AEO baseline
4. **REORDER:** Move E5 GEO Scanner up to next-after-E2 priority
5. Begin Step 5 OR Step 8 (E5) based on accumulated state

---

## GOALS — what we are building (GOAT)

### The vision: COLE Marketing OS

**COLE = Citation Gap Commerce Engine.** A multi-site, multi-product, AI-search-era authority business.

**The thesis:** AI engines (ChatGPT, Claude, Gemini, Perplexity, Copilot) are becoming the primary search interface. Traditional SEO is dying. The winners will be sites whose content is:
- AI-citable (extractable answers, authority panels)
- AI-corrective ("what AI gets wrong" content)
- AI-prompt-mirrored (mirror how humans ask AI, not how they Google)
- Authority-anchored (verifiable government/ATO/HMRC source citations)

**Operator's framing today:**
> "The production queen is putting the food on the plate to sell and rank. We need to make the right ingredients available that she can cook the right food that will sell."

E2 (today's bee) captures the INGREDIENTS. Production Queen + future bees TRANSFORM them into AI-citable pages.

### Current revenue state (live)

- **taxchecknow.com** — 48 calculator products live at $67/$147 (46 manually built, 1 system test #19)
- **Distribution Queen** = cream on the pudding (Phase 4) — Reddit/social re-engagement playbook
- **Production Queen** = building calculators (Phase 3) — uses E2 + E5 ingredients

### 12-month best-case probability (revised today, upward)

**40-50%** — based on actual revenue state revealed. Genuinely achievable with disciplined Phase 2-4 execution.

### Site hierarchy under Cluster Worldwide (multi-site COLE)

- **taxchecknow.com** — current revenue site (AU/UK/US/NZ tax check products)
- **theviabilityindex.com** — Phase 2+ launch (business viability)
- Future sites per "airport model" (each site = airport, products = gates)

---

## THE BEE + QUEEN ARCHITECTURE

### Four queens

| Queen | Phase | Role | Status |
|---|---|---|---|
| **Strategic Queen** | Phase 2 (Day 4-18) | Find + rank citation gaps; harvest market signals | 🔵 In progress |
| **Production Queen** | Phase 3 (Day 19+) | Build calculator products + AI-citable pages | ⏳ Future |
| **Distribution Queen** | Phase 4 (Day 30+) | Re-engage Reddit/social/AI engines | ⏳ Future |
| **Operator** | Always | Approve/reject decisions, strategic oversight | ✅ Live |

### Strategic Queen bees (Phase 2 — current focus)

| Bee | Role | Status |
|---|---|---|
| **E1 Citation Gap Scanner** | Find new gaps (daily forever) | ✅ Live (Day 4-5) |
| **E7 Truth-Sync Monitor** | Detect rule changes affecting existing products | ✅ Live (Day 8) |
| **E2 Market Researcher** | Harvest market signals per gap | 🔵 Architecture live, data blocked |
| **E3 Customer Psychologist** | Extract psychological signals from E2 data | ⏳ Day 11+ |
| **E4 Competitor Monitor** | Track competitor pricing/positioning | ⏳ Deferred (hardest) |
| **E5 GEO Scanner** | Query AI engines, capture responses + citations | ⏳ **REORDERED to next** |
| **E6 Authority Tracker** | Track where authority citations live | ⏳ Day 12+ |

### E2 sub-bees (today's row-of-bees architecture)

| Bee | SERP source | Content source | Status today |
|---|---|---|---|
| **E2a** | Google | Reddit | ❌ Disabled (Google CSE blocked) |
| **E2b** | Brave | Reddit | 🟡 Live, Reddit IP-blocked |
| **E2c** | Google | StackExchange | ⏳ Wrapper pending (Day 10) |
| **E2e-chatgpt** | ChatGPT | chatgpt_citation | ⏳ Wrapper pending (Day 10) |
| **E2e-gemini** | Gemini | gemini_citation | ⏳ Wrapper pending (Day 10) |

### Bee frequency model (operator-clarified today)

| Bee type | Cadence | Why |
|---|---|---|
| E1, E7 | Daily forever | Find new gaps, detect rule changes |
| E2, E5 | Once per qualified gap + periodic re-fire | Harvest once, re-check evolution quarterly/monthly |
| E3, E4, E6 | TBD | Depends on signal volatility |
| Production Queen | Once per gap | Build, ship, move on |
| Distribution Queen | Once per gap + quarterly re-engagement | Initial seeding + periodic refresh |

**Today's daily cron with ON CONFLICT idempotence is wasteful but harmless.** Day 30 refactor adds `harvested_at` check.

---

## REPO ARCHITECTURE — three repos at `C:\Users\MATTV\CitationGap\`

### 1. `cole-marketing/` — THE BRAIN (docs only)

**Purpose:** Strategic intelligence layer. Architecture documents, manuals, operational state, retrospectives.

**Contains:**
- Architecture docs (FINAL-BEE-STRUCTURE.md, STRATEGIC-QUEEN-PHASE-2.md, etc.)
- Queen manuals (per queen)
- Operational state (OPERATIONAL-STATE.md)
- Sprint planning
- Daily handover docs (this doc lives here)
- Discoveries log (50+ entries documenting drift catches + lessons)

**Does NOT contain:** application code, migrations, Vercel config.

**Commit cadence:** End-of-day handovers + spec updates.

### 2. `soverella/` — THE NERVE CENTER (Next.js application)

**Purpose:** Dashboard + bee runtime + queen routes. Where the autonomous system lives.

**Tech stack:**
- Next.js 14 App Router on Vercel
- TypeScript strict mode
- Supabase (PostgreSQL + RLS, project: `ngxuroxsabyamqcnvrei`)
- Anthropic SDK (`claude-sonnet-4-6` for bee extraction)
- OpenAI SDK (`gpt-4o` for E1 AI engine queries + future E2e)
- Google Gemini SDK (existing for E1 + future E2e)
- Brave Search API (X-Subscription-Token auth, Day 9 addition)
- Tailwind for dashboard

**Vercel project:** `soverella` (team `mrktrite-6622s-projects`)
**Production URL:** `https://www.soverella.com`
**CRON_SECRET:** `f5b5367d1236b308e317084303513ac8`

### 3. `cluster-worldwide/taxchecknow/` — THE PRODUCT (customer site)

**Purpose:** Revenue-generating site (48 tax check products).

Not touched today.

---

## FILE STRUCTURE — soverella (Day 9 close state)

```
soverella/
├── app/
│   ├── api/cron/
│   │   ├── e1-citation-gap-scanner/route.ts      [Day 4-5]
│   │   ├── e7-truth-sync/route.ts                 [Day 8]
│   │   └── e2-market-research/route.ts            [Day 9 — 8077441, 66 lines]
│   ├── api/approvals/                              [Day 4]
│   └── dashboard/monitor/strategic-queen/
│       ├── page.tsx                                [Day 6, updated Day 9 — 95e921d]
│       └── _components/
│           ├── TopOpportunities.tsx                [Day 6]
│           ├── RuleChangesQueue.tsx                [Day 8]
│           ├── RankedQuestions.tsx                 [Day 9 — NEW, 205 lines]
│           ├── RecommendedActions.tsx              [Day 6]
│           ├── StrategicMemory.tsx                 [Day 6]
│           └── ActivityFeed.tsx                    [Day 6]
├── lib/
│   ├── supabase.ts                                 [Day 1]
│   ├── overlay/loader.ts                           [Day 1, +25 lines Day 9 — 73df1eb]
│   ├── engines/                                    [Day 5]
│   │   ├── anthropic.ts
│   │   ├── openai.ts
│   │   └── gemini.ts
│   ├── sources/                                    [Day 8-9]
│   │   ├── fetcher.ts                              [Day 8 — generic HTML fetch]
│   │   ├── google-cse.ts                           [Day 9 — 63dfb3c, 153 lines]
│   │   ├── brave-search.ts                         [Day 9 — c041e0d, 155 lines]
│   │   ├── reddit.ts                               [Day 9 — 830c5cf, 265 lines, public JSON]
│   │   ├── forum.ts                                [Day 9 — 59bf123, stub ~50 lines]
│   │   ├── stackexchange.ts                        [⏳ Day 10]
│   │   └── ai-citations.ts                         [⏳ Day 10]
│   ├── queens/
│   │   ├── e1-citation-gap-scanner.ts              [Day 4-5]
│   │   ├── e7-change-detector.ts                   [Day 8]
│   │   └── e2-market-researcher.ts                 [Day 9 — b7db053+73df1eb, 525 lines]
│   ├── dashboard/
│   │   └── strategic-queen-monitor.ts              [Day 6, +47 lines Day 9 — 95e921d]
│   └── feeds/rss.ts                                [Day 8]
├── overlays/taxchecknow/
│   └── strategic.json                              [Day 6, +48 lines Day 9 — 73df1eb]
├── migrations/
│   ├── 20260511073000_*.sql                        [Day 8 E7]
│   ├── 20260511120000_*.sql                        [Day 8 E7]
│   ├── 20260512000000_*.sql                        [Day 9 67abf31 — superseded]
│   └── 20260512xxxxxx_..._supersede.sql            [Day 9 51187b8 — live in Supabase]
└── vercel.json                                      [Day 9 — 092dd5d, E2 cron added]
```

**Key Day 9 additions:**
- `lib/sources/` directory now has 4 wrappers (google-cse, brave-search, reddit, forum)
- `lib/queens/e2-market-researcher.ts` — multi-bee orchestrator with dispatch maps
- `app/dashboard/.../RankedQuestions.tsx` — new panel
- E2 cron route + schedule live

---

## CURRENT DESIGN — E2 architecture

### Source-agnostic schema (the row-of-bees foundation)

`market_research_signals` table supports ANY (SERP source × content source) combination:

**SERP columns** (where the search happened):
- `serp_source` TEXT — enum: `google | bing | duckduckgo | chatgpt | perplexity | gemini | brave`
- `serp_query` TEXT — the query sent
- `serp_rank_position` INTEGER — rank within SERP results (1-10)
- `serp_result_url` TEXT — URL SERP returned

**Content columns** (where the actual discussion lives):
- `content_source` TEXT — enum: `reddit | quora | stackexchange | paa | forum | chatgpt_citation | perplexity_citation | gemini_citation`
- `content_url` TEXT — canonical content URL
- `content_id` TEXT — platform-specific ID (Reddit post ID, Quora question ID, etc.)
- `content_metadata` JSONB — platform-specific blob: `{subreddit: "..."}`, `{tags: [...]}`, `{citation_index: N}`
- `content_score` INTEGER — generic engagement metric (upvotes, etc.)
- `content_comment_count` INTEGER — discussion volume
- `content_created_at` TIMESTAMPTZ

**Sonnet extraction columns:**
- `question_samples` TEXT[] — verbatim questions extracted
- `emotional_signal` TEXT — enum: `confusion | frustration | fear | planning | technical_clarification | other`

**Audit columns:**
- `run_id` UUID, `collected_at` TIMESTAMPTZ, `site` TEXT, `citation_gap_id` UUID FK, `gap_queue_id` UUID FK, `topic` TEXT

**Hybrid data model** (two row types via CHECK constraint):
- **PER-THREAD rows** — `content_url IS NOT NULL`, all SERP+content fields populated
- **ROLLUP rows** — `content_url IS NULL`, `mention_count_7d/30d`+`discussion_locations jsonb` populated (Day N+ aggregator)

### Multi-bee dispatch (orchestrator)

`lib/queens/e2-market-researcher.ts` (525 lines):

```typescript
const SERP_DISPATCH = {
  "google":  queryGoogleCSE,
  "brave":   queryBraveSearch,
  // Future: chatgpt, gemini → register in Day 10 loopback
};

const CONTENT_DISPATCH = {
  "reddit":     fetchRedditThread,
  "forum":       fetchForumThread,
  // Future: stackexchange, chatgpt_citation, gemini_citation
};

const AI_CITATION_SOURCES = new Set([]);
// Will include: chatgpt_citation, gemini_citation, perplexity_citation
// And StackExchange if Day 10 ships self-contained pattern

const CONTENT_HOST_PATTERN = {
  "reddit":         /(?:^|\.)reddit\.com$/i,
  "stackexchange":    /(?:^|\.)stackexchange\.com$/i,
  "quora":              /(?:^|\.)quora\.com$/i,
};
```

**Two flow patterns:**
1. `runSerpToContentFlow` — SERP → filter URLs by host → content fetch each → Sonnet → INSERT (1500ms sleep between)
2. `runAiCitationFlow` — single round-trip (SERP+content collapsed for AI citations)

**Per-bee error isolation:** one bee failing doesn't kill others. Each bee writes its own agent_log subtotal row.

**INSERT pattern:** `.upsert({ onConflict: "site,content_source,content_id", ignoreDuplicates: true })` against partial unique index `idx_mrs_content_id_unique`.

### Overlay bee configs

`overlays/taxchecknow/strategic.json` — `market_research_bees[]` array (5 configs):

```json
[
  {
    "bee_id": "e2a-google-reddit",
    "enabled": false,
    "serp_source": "google",
    "content_source": "reddit",
    "query_template": "${gap_title} site:reddit.com",
    "max_threads_per_topic": 3,
    "results_to_consider": 10
  },
  {
    "bee_id": "e2b-brave-reddit",
    "enabled": true,
    "serp_source": "brave",
    "content_source": "reddit",
    "query_template": "${gap_title} site:reddit.com",
    "max_threads_per_topic": 3,
    "results_to_consider": 10
  },
  {
    "bee_id": "e2c-google-stackexchange",
    "enabled": true,
    "serp_source": "google",
    "content_source": "stackexchange",
    "query_template": "${gap_title} site:money.stackexchange.com OR site:stackexchange.com",
    "max_threads_per_topic": 3,
    "results_to_consider": 10
  },
  {
    "bee_id": "e2e-chatgpt",
    "enabled": true,
    "serp_source": "chatgpt",
    "content_source": "chatgpt_citation",
    "query_template": "${gap_title}",
    "max_threads_per_topic": 5,
    "results_to_consider": 10
  },
  {
    "bee_id": "e2e-gemini",
    "enabled": true,
    "serp_source": "gemini",
    "content_source": "gemini_citation",
    "query_template": "${gap_title}",
    "max_threads_per_topic": 5,
    "results_to_consider": 10
  }
]
```

---

## SONNET PROMPTS — what to test first

### E2 question + emotion extraction prompt (locked Day 9)

**Used by every E2 bee for question extraction across all content sources.**

```
ROLE
You are extracting underlying questions taxpayers are asking AND classifying
the emotional signal in the discussion, distilled from raw <CONTENT_SOURCE>
thread data.

INPUT
citation_gap_title:            ${gap.gap_title}
citation_gap_description:       ${gap.ai_drift_description}
jurisdiction:                    ${gap.jurisdiction_code}

CONTENT:
source:        ${content.source_name}
url:           ${content.content_url}
score:         ${content.score}↑
comments:      ${content.comment_count}
title:         ${content.title}
body:          ${truncate(content.body, 800)}
top_comments:
${content.top_comments.slice(0, 5).map(c =>
  `- (${c.score}↑) ${truncate(c.body, 300)}`
).join("\n")}

TASK
1. Extract canonical questions taxpayers are asking in this thread (up to 5).
   - Phrased in plain language, not jargon
   - Captures actual confusion, not surface phrasing
   - Distinct from each other (no near-duplicates)
   - Empty array if thread is off-topic — honest output beats padding

2. Classify the dominant emotional signal:
   - "confusion":                 people don't understand the rule
   - "frustration":                people understand but find it unfair/complex
   - "fear":                         people worried about consequences
   - "planning":                      people researching to make a decision (BEFORE acting)
   - "technical_clarification":         people resolving edge cases / specific scenarios
   - "other":                              none of the above fits

OUTPUT
Return strict JSON only, no commentary, no markdown fence:
{
  "questions_asked":    ["question 1", "question 2"],
  "emotional_signal":     "confusion" | "frustration" | "fear" | "planning" | "technical_clarification" | "other",
  "confidence":              0.0
}
```

**Settings:**
- Model: `claude-sonnet-4-6`
- Temperature: 0.1
- Cost: ~$0.012-0.016 per call
- Per-run total: 8 topics × 3 threads × 1 call = 24 calls = ~$0.36/run

### Day 10 prompts to design

**ai-citations.ts ChatGPT prompt template:**
```
What are the most common questions and confusion points about
${gap_title} for ${jurisdiction} taxpayers? Provide your answer
with specific sources cited.
```

**ai-citations.ts Gemini prompt template:** same as above

**StackExchange:** no Sonnet wrapper at fetch (uses SE native search ranking). Sonnet extraction runs on returned questions using same prompt as Reddit above.

### Test queries to validate Day 10

For each enabled bee after Day 10 ships, manually trigger:
```powershell
curl.exe -X POST "https://www.soverella.com/api/cron/e2-market-research?site=taxchecknow" `
  -H "Authorization: Bearer f5b5367d1236b308e317084303513ac8" `
  --max-time 300
```

**Success criteria:**
- `bees_processed: 4-5`
- `total_rows_inserted > 0`
- e2b OR e2c OR e2e bees show `error_summary: null` AND `rows_inserted > 0`
- Dashboard `/dashboard/monitor/strategic-queen?site=taxchecknow` shows populated Ranked Questions panel

---

## DASHBOARD — what's live

### Strategic Queen Monitor

**URL:** `https://www.soverella.com/dashboard/monitor/strategic-queen?site=taxchecknow`

**Layout:**

**Left column (top to bottom):**
1. **TopOpportunities** — gap_queue ranked by priority_score (Day 6)
2. **RuleChangesQueue** — E7 detections pending approve/reject (Day 8)
3. **RankedQuestions** — E2 ranked per-thread questions [NEW Day 9 — 205 lines]
4. **RecommendedActions** — Strategic Queen synthesis output (Day 6)

**Right column:**
5. **StrategicMemory** — synthesis logs
6. **ActivityFeed** — recent bee fires + decisions

### RankedQuestions panel (Day 9 new)

**Reads from:** `ranked_questions_view` (joins citation_gaps + gap_queue, filters per-thread rows)

**Display:**
- Grouped by `citation_gap_id`
- Per-gap header: gap_title + total_score + priority_tier badge + recommended_character
- Per-thread nested cards:
  - `serp_source` badge + rank position
  - `content_source` badge + subreddit (from `content_metadata.subreddit`)
  - `content_score` (upvotes)
  - `emotional_signal` color-coded badge
  - Top 3 `question_samples` truncated to 80 chars each
  - External link to `content_url` (target="_blank")

**Color-coded emotional signals:**
- `confusion` → amber
- `frustration` → rose
- `fear` → red
- `planning` → emerald
- `technical_clarification` → sky
- `other` → slate

**Empty state:** Currently shows "No market research signals yet. First E2 cron fire is scheduled for 05:00 UTC daily..." Will populate once Reddit fetch unblocks OR E2c/E2e ship Day 10.

### Database view (`ranked_questions_view`)

```sql
CREATE OR REPLACE VIEW ranked_questions_view AS
SELECT
  s.id, s.site, s.citation_gap_id, s.gap_queue_id, s.topic,
  s.serp_source, s.serp_query, s.serp_rank_position, s.serp_result_url,
  s.content_source, s.content_url, s.content_id, s.content_metadata,
  s.content_score, s.content_comment_count, s.content_created_at,
  s.question_samples, s.emotional_signal,
  s.collected_at, s.run_id,
  cg.gap_title, cg.id AS gap_id, cg.total_score,
  gq.recommended_character, gq.priority_tier, gq.priority_score
FROM market_research_signals s
LEFT JOIN citation_gaps cg ON cg.id = s.citation_gap_id
LEFT JOIN gap_queue      gq ON gq.id = s.gap_queue_id
WHERE s.content_url IS NOT NULL  -- per-thread rows only
ORDER BY cg.total_score DESC NULLS LAST, s.serp_rank_position ASC NULLS LAST;
```

Consumer queries (Production Queen Phase 3, Distribution Queen Phase 4) add their own filters.

### Canonical pattern locked Day 9

**Every bee ships three layers:**
1. **Raw data table** (with hybrid schema + CHECK constraints)
2. **Curated SQL view** (joins, filters, ranking)
3. **Operator dashboard panel** (read view, render with empty state)

This pattern repeats for all remaining queens (E3-E6 future builds).

---

## GEO/AEO ARCHITECTURE — for Production Queen Phase 3

10 GEO additions surfaced from operator research (rated 9.7-10/10):

| # | Addition | Rating | Producer |
|---|---|---|---|
| 1 | **AI correction blocks** ("what AI gets wrong → official source → correct interpretation") | 10/10 | Production Queen Phase 3 |
| 2 | **Page-1 Reddit question ingestion** | 9.9/10 | E2 (architecturally captured) |
| 3 | **Extractable answer blocks** (short concise authoritative answers) | 10/10 | Production Queen Phase 3 |
| 4 | **AI-citable FAQ clusters** | 9.8/10 | Production Queen Phase 3 |
| 5 | **Authority source panels** (render E1's legal_sources) | 9.7/10 | Production Queen Phase 3 |
| 6 | **Internal authority graph** (story ↔ calculator ↔ correction ↔ FAQ ↔ legislation) | 9.8/10 | Production Queen Phase 3 |
| 7 | **AI prompt mirroring** (using verbatim E2 question_samples) | 10/10 | Production Queen Phase 3 |
| 8 | **AI comparison panels** ("What ChatGPT vs Claude vs Gemini vs ATO says") | 9.9/10 | Production Queen Phase 3 + E5 data |
| 9 | **Story-question fusion** (character voice + extracted question) | 9.7/10 | Production Queen Phase 3 |
| 10 | **AI retrieval format testing** (bullets vs tables vs FAQs) | 10/10 | Future H3 Retrieval Lab |

**E2 captures the ingredients. Production Queen Phase 3 plates the dishes.**

**Architectural shift documented:** "AI Retrieval Optimization Infrastructure" — not just SEO/GEO tooling. The deeper category COLE is moving toward.

---

## CURRENT STATE — production verification

### Live cron schedule (UTC)

| Time UTC | Time AWST | Bee | Status |
|---|---|---|---|
| 04:00 | 12:00 PM | E1 Citation Gap Scanner | ✅ Daily |
| 04:30 | 12:30 PM | E7 Truth-Sync Monitor | ✅ Daily |
| 05:00 | 1:00 PM | E2 Market Researcher | ✅ Daily (rows: 0 until infra fix) |

### Vercel env vars status

| Var | Status |
|---|---|
| `CRON_SECRET` | ✅ Live |
| `SUPABASE_URL` | ✅ Live |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Live |
| `ANTHROPIC_API_KEY` | ✅ Live |
| `OPENAI_API_KEY` | ✅ Live |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ Live |
| `GOOGLE_CSE_API_KEY` | ⚠️ Set but returns "API key expired" |
| `GOOGLE_CSE_CX` | ✅ Live (`3725a7824117c4ef5`) |
| `BRAVE_SEARCH_API_KEY` | ✅ Live (Brave Free plan, $5/mo credit) |
| `REDDIT_CLIENT_ID/SECRET/USERNAME` | ❌ Not set (CAPTCHA blocked) |

### Live production verification (E7 from this morning)

E7 Truth-Sync Monitor fired successfully overnight (2026-05-12 ~04:30 UTC):
- HMRC pipeline: 2 rule_changes rows detected
- Both rejected via dashboard
- ATO WAF still permanent block (deferred Phase 4)

E1 fires daily, populating citation_gaps. E2 finds 5 active gaps via overlay.topic_universe.

---

## DAY 9 COMMIT CHAIN (soverella)

```
08e23df (Day 8 close)
   ↓
67abf31  Stale migration (Google+Reddit-specific) — never applied
   ↓
51187b8  Supersede migration — source-agnostic schema applied to Supabase
   ↓
63dfb3c  lib/sources/google-cse.ts (153 lines)
   ↓
58e053f  lib/sources/reddit.ts (OAuth version, 330 lines — historical)
   ↓
59bf123  lib/sources/forum.ts (stub, ~50 lines)
   ↓
b7db053  lib/queens/e2-market-researcher.ts (orchestrator, 525 lines)
   ↓
73df1eb  loader + overlay + orchestrator cleanup (+80/-17 net +63)
   ↓
8077441  app/api/cron/e2-market-research/route.ts (66 lines)
   ↓
95e921d  RankedQuestions panel + monitor lib + page.tsx (+256 lines)
   ↓
092dd5d  vercel.json E2 cron entry
   ↓
830c5cf  reddit.ts refactor to public JSON endpoints (-65 net)
   ↓
c041e0d  brave-search.ts (155 lines) + dispatch + overlay toggle ← DAY 9 CLOSE
```

**Total Day 9:** 11 commits, ~1,500+ lines code, 1 migration applied, 1 dashboard panel, 1 cron schedule.

---

## DAY 9 BLOCKERS — root causes + Day 10 fix paths

### Blocker 1 — Google Custom Search API "API key expired"

**Symptoms:**
```json
{
  "error": {
    "code": 400,
    "message": "API key expired. Please renew the API key.",
    "reason": "API_KEY_INVALID",
    "service": "customsearch.googleapis.com"
  }
}
```

**What was tried (all unsuccessful):**
- Created `GOOGLE_CSE_API_KEY` in Google Cloud project `taxchecknow`
- Enabled Custom Search API in project (verified in Enabled APIs)
- Restricted key to Custom Search API only
- Set up Programmable Search Engine at programmablesearchengine.google.com (cx = 3725a7824117c4ef5)
- "Search the entire web" toggle deprecated by Google — used Sites to search: www.reddit.com/*, *.stackexchange.com/*, *.stackoverflow.com/*, money.stackexchange.com/*
- Direct browser API test still returns "API key expired"
- Delete + recreate key from scratch — same error persists
- Verified Vercel value matches Google Cloud key value

**Day 10 paths:**
1. Try creating key in a DIFFERENT Google Cloud project (rule out project-level issue)
2. Check Google Cloud organization policies
3. Try with "Authenticate API calls through a service account" ENABLED
4. Contact Google Cloud support
5. **Pivot:** Accept Brave-only SERP, defer Google CSE indefinitely

### Blocker 2 — Reddit IP-level blocking from Vercel

**Symptoms:**
- 15 Reddit URLs returned by Brave (3 × 5 topics)
- All 15 fetches failed before Sonnet attempted
- agent_log per-bee: `serp=5, fetches=15, sonnet=0, inserted=0, errors=15`
- agent_log doesn't capture per-URL error details (Day 10 housekeeping item)

**Cause:** Reddit's anti-bot detection blocks unauthenticated requests from cloud provider IP pools (AWS, GCP, Vercel's Fastly edge). Post-2023 Pushshift crackdown.

**Day 10 paths:**
1. **Mobile Reddit CAPTCHA retry** (5 min test) — sometimes mobile passes where desktop fails
2. **Cloudflare Worker proxy** fronting Reddit
3. **Vercel Pro static IPs** (investigate cost)
4. **Pivot:** Skip Reddit fetch. StackExchange (E2c) + AI citations (E2e) cover the signal.
5. **OAuth via different/older Reddit account** with karma history

### Blocker 3 — Reddit CAPTCHA loop (operator-level)

**Symptoms:**
- https://www.reddit.com/prefs/apps → "create app" form → reCAPTCHA loops at "I'm not a robot"
- Tested 2 PCs + 4 browsers
- All resulted in same loop

**Day 10 paths:**
1. Try from mobile device
2. Different Reddit account
3. Wait 24-48 hours for anti-bot score reset

---

## STRATEGIC INSIGHTS CAPTURED TODAY

### 1. "Ingredients on the plate" framing (operator)
> "The production queen is putting the food on the plate to sell and rank. We need to make the right ingredients available."

**Captured as architectural principle.**

### 2. "Row of bees" architecture (operator)
> "We just built the google-reddit bee in 1 hour 20 min... we're just duplicating that bee. BING is huge right now for AI."

**Captured as canonical pattern.** Source-agnostic schema = every (SERP × content) pair shares orchestrator + table + dashboard.

### 3. "Once per qualified gap" frequency model (operator)
**Captured for Day 30 refactor:** Add `harvested_at` check to skip already-harvested gaps.

### 4. E5 GEO Scanner reorder (Day 9 close insight)
Spec ordered E5 at Step 8. Today's GEO/AEO research weight strongly suggests E5 should ship next-after-E2-closure. AI engine baselines = highest-value Production Queen ingredient for "AI correction block" pages.

### 5. Launch Club operational pattern (for Day 30 Distribution Queen)
Launch Club ($50k MRR product) found pain in Reddit threads → returned with helpful comments + product mentions. **Operational pattern, not positioning** — informs Distribution Queen Phase 4 playbook.

### 6. Every bee ships three layers (canonical pattern)
**Raw data table + curated SQL view + operator dashboard panel.** Pattern repeats for all queens.

### 7. "AI Retrieval Optimization Infrastructure" — the deeper category
**Architectural shift documented** — not just SEO/GEO tooling. COLE's true positioning.

---

## DAY 9 PROCESS IMPROVEMENTS CAPTURED

### What worked
- Audit-first protocol caught real issues (24hr Reddit token vs 1hr, rate limit math, URL canonicalization)
- Multi-bee architecture commitment upfront prevented schema rework
- Brave pivot decisiveness when Bing v7 deprecation surfaced
- Calling Day 9 close at fatigue point instead of pushing into 12+ hour day

### What didn't work
- **Google CSE setup before testing** — should have run direct browser test immediately. 5 min would have caught "API key expired" instead of 3 hours of orchestrator debugging.
- **Reddit OAuth detour** when first cron failed — assumed Reddit involved when it was Google. ~2 hours lost.
- **agent_log column schema misremembered** — wrote diagnostic SQL with wrong column names ("metadata" doesn't exist).
- **Long context window degradation** — by hour 8+, diagnostic mistakes compounded. Operator correctly called for fresh chat for Day 10.

### Process locks for Day 10
1. **First-line diagnostic on any per-bee `errors > 0` with `error_summary: null` is `agent_log` query, NOT architectural speculation**
2. **First-line diagnostic on any external API failure is a direct browser/curl test of the API itself** (bypass wrapper, bypass orchestrator)
3. **Verify table schema with `information_schema.columns` before writing diagnostic SQL** (every time)
4. **Per-URL errors must be captured in agent_log, not just bee subtotals** (Day 10 housekeeping)

---

## TO-DO / CLEANUP / HOUSEKEEPING (running list)

### From Day 8 (carried over)
1. ATO WAF escalation deferred to Phase 4 maturation (HMRC working as alternative)
2. legal_sources.jurisdiction_code schema verification
3. rule_changes.site column verification
4. E7 dashboard panel approve/reject operational verification

### Day 9 — infrastructure/blockers (priority for Day 10)
5. **Google CSE "API key expired" — Day 10 diagnose** (different project? service account binding? org policy?)
6. **Reddit IP-level blocking — Day 10 fix path** (mobile CAPTCHA, Cloudflare Worker proxy, OR skip Reddit)
7. **Reddit CAPTCHA loop — Day 10 retry** (mobile device, different account, 24-48h wait)

### Day 9 — code quality / observability
8. **agent_log per-URL error persistence** — orchestrator logs bee-level only; per-URL errors lost. ~20 line change.
9. **error_summary surfaces FIRST per-URL error** when `errors > 0` AND `rows_inserted = 0`
10. **content_metadata jsonb handling verification** — verified by reasoning, not in production yet
11. **ON CONFLICT with partial unique index verification** — `.upsert(...)` behavior not yet confirmed (no rows inserted today)
12. **Reddit `[deleted]`/`[removed]` filtering verification** — unchanged from OAuth version
13. **URL canonicalization across Reddit subdomains** — verify www/old/m/np all canonicalize
14. **Sonnet malformed JSON skip pattern** — per-URL skip in orchestrator, verify in production

### Day 30+ refactors
15. **E2 frequency model — "once per qualified gap"** — add `harvested_at` check
16. **E5 periodic re-fire** — AI engine citations evolve, weekly/monthly re-fire
17. **gap_queue_id resolution optimization** — cache gap→gap_queue map at run start (currently 16 SELECTs/run)
18. **Hybrid schema split decision** — market_research_threads vs market_research_rollups OR generated row_type column
19. **Cost recording refinement** — when paid sources come online

### Performance budgets
20. **300s Vercel timeout risk** — worst-case 354s. Mitigations: cap citation_gaps to 4 from 8, OR cut PER_CONTENT_FETCH_SLEEP_MS to 750ms, OR split E2 into per-bee crons
21. **Brave $5/month credit usage monitoring** — ~240/month at current scale (free covers 1000/month)
22. **StackExchange API quota monitoring** — 300/day per IP (Vercel shared)
23. **Brave 1-req/sec rate limit headroom** — 1500ms gives 0.67 req/sec, safe

### Configuration / overlay
24. **Brave country=AU + search_lang=en hardcoded** — Day N+ surface to overlay when multi-region launches
25. **Sonnet prompt content-source-agnostic** — Day N+ may need StackExchange/AI-citation variants
26. **Reddit User-Agent without username** — update to "by /u/username" when OAuth resolves

### Documentation (cole-marketing repo)
27. **Spec section 8.1 reconciliation** — original spec rollup-only; Day 9 went hybrid. Update docs.
28. **Row-of-bees architecture documentation** — add to spec section 8 as canonical pattern
29. **GEO/AEO 10 additions documentation** — capture for Production Queen Phase 3 spec
30. **Operator decision framework documentation** — approve/reject 3-question tree (from Day 8/9 E7 pattern)
31. **Step ordering proposal documentation** — E5 reorder rationale
32. **Distribution Queen Phase 4 playbook** — Launch Club informant captured, needs detailed design
33. **Untracked files audit** — FINAL-BEE-STRUCTURE.md, STRATEGIC-QUEEN-PHASE-2.md, possibly others

### Data quality
34. **Empty state design pattern** — codify operator-facing graceful loading messages for dashboard panels
35. **Pre-build check protocol** — query Supabase for existing tables before structural changes (Day 9 lesson)

### Future bee planning
36. **E2c Brave→StackExchange variant** — Day 10 decision: self-contained (SE native search) OR via Brave SERP
37. **E2e AI engine citation format quirks** — OpenAI Responses API vs Gemini grounding differ
38. **E2f-g future bees** — DuckDuckGo, Perplexity (when subscription decision made)
39. **Bing Grounding evaluation Day 30+** — $14/1000 + Azure AI Foundry
40. **AlsoAsked or SerpAPI for PAA** — $50/mo decision Day 30+

### Architectural alignment
41. **Cannibalism loop wiring documentation** — E2 finds → Production Queen builds → Distribution Queen returns
42. **Production Queen Phase 3 design** — consume `ranked_questions_view` as canonical reading surface
43. **E5 GEO Scanner spec section** — design `ai_engine_responses` table Day 10

### Daily operations
44. **Schema CHECK constraint for `brave` already applied Day 9 evening** — capture in version history docs
45. **CRON_SECRET literal captured for handover consistency**
46. **Day 30 strategic review** — Phase 2 step ordering, performance budgets, cost ceilings, scaling considerations

---

## PHASE 2 PROGRESS AT DAY 9 CLOSE

| Step | Bee | Status |
|---|---|---|
| 0 | Foundation | ✅ Days 1-3 |
| 1 | E1 Citation Gap Scanner | ✅ Day 4-5 |
| 1.5 | Dashboard scaffold | ✅ Day 6 |
| 2 | Strategic Queen synthesis | ✅ Day 7 |
| 3 | E7 Truth-Sync Monitor | ✅ Day 8 |
| **4** | **E2 Market Researcher** | **🔵 PARTIAL — architecture shipped, live data blocked** |
| 5 | E3 Customer Psychologist | ⏳ Day 11+ |
| 6 | E4 Competitor Monitor | ⏳ Deferred (hardest) |
| 7 | E6 Authority Tracker | ⏳ Day 12+ |
| **8 → next** | **E5 GEO Scanner** | **⏳ Day 10-11 (reordered up)** |
| 9-12 | Synthesis + closure | ⏳ Day 14-18 |

---

## DAY 10 PRIORITIES (suggested order)

### Morning (fresh chat, fresh energy)
1. **Read this handover** carefully — sets context for entire Phase 2 state
2. **Mobile Reddit CAPTCHA retry** (5 min) — quickest unlock if it works
3. **Decide Reddit path:**
   - If CAPTCHA works → OAuth setup → re-enable e2a/e2b with proper auth
   - If CAPTCHA fails → pivot: skip Reddit, double down on StackExchange + AI citations
4. **Ship `lib/sources/stackexchange.ts`** (~1 hour)
5. **Verify e2c-google-stackexchange returns rows > 0**

### Afternoon
6. **Ship `lib/sources/ai-citations.ts`** (~1.5-2 hours) — OpenAI + Gemini
7. **Verify e2e-chatgpt + e2e-gemini return rows > 0**
8. **Re-attempt Google CSE if energy allows** (~30 min max) — try different project

### Day 10 close target
- Step 4 effectively closed (3-4 bees flowing real data)
- E5 GEO Scanner schema designed (ai_engine_responses table)
- Day 10 handover written

### Day 11+
- Begin Step 8 (E5 GEO Scanner) build — reordered up from spec position
- OR begin Step 5 (E3 Customer Psychologist) if E2 has accumulated data

---

## CONTEXT FOR FRESH CHAT

**Day 10 chat opener should include:**
- Day 10 of expanded COLE Marketing OS build
- Strategic Queen Phase 2 mid-Step-4
- Three-chat pattern: Session A (soverella terminal at `C:\Users\MATTV\CitationGap\soverella\`), Session B (cole-marketing docs), strategy chat (this one)
- Read this handover doc first
- Propose Day 10 sequence
- Verify alignment with priorities above before proceeding
- Session A in soverella terminal can be reused or restarted

**Operator preferences (captured from Day 9):**
- No `ask_user_input_v0` questions (locks chat, deletes responses)
- Audit-first protocol on every file ship
- Honest disclosure expected after every build
- "Move on" signal means actually move on, don't keep iterating
- Long days are sustainable but fatigue is real — call closes when needed

**Anti-patterns to avoid Day 10:**
- Long architectural debates without code shipping
- Multiple iteration loops on same design (lock decisions, ship)
- Assuming infrastructure works without direct API test first
- Going down rabbit holes on diagnostic before checking the obvious (env vars, agent_log)

---

## END OF DAY 9 HANDOVER

**Day 9 was a hard day.** 9.5 hours, much of it on infrastructure friction (Google CSE, Reddit CAPTCHA, Reddit IP blocking) that wasn't operator-fault.

**What shipped is real:**
- Source-agnostic row-of-bees schema
- Multi-bee dispatch orchestrator
- Brave SERP integration end-to-end
- Dashboard panel ready
- 1,500+ LOC audit-first
- 11 commits clean

**What didn't ship:** First rows in market_research_signals.

**The gap:** one Day-10 infrastructure unlock. Either Reddit OAuth works OR we pivot Reddit → StackExchange+AI citations. Both paths → real data Day 10.

**Day 10 chat:** start here. Build clean.
