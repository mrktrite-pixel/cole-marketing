# 📋 OPERATIONAL STATE — LIVING WORKING FILE

> **⚠️ THIS FILE IS UPDATED CONSTANTLY. NEVER ASSUME ITS CONTENTS ARE STATIC. ⚠️**
>
> If you are a new chat reading this, the content here is the most recent
> snapshot of how the COLE system actually operates today. It will be
> different next time. Always read the timestamp at the top.

---

**Last updated:** May 4 2026 — end of session 13 sprint + Chat A's design doc integrated
**Current sprint task:** Block 1 Task 1.6 auto-firing tonight (G5/J2/J3 crons)
**Block 1 status:** 7 of 8 done (87.5%)

---

## 🎯 WHAT THIS FILE IS

This is the **operational layer** between architecture (slow-changing — lives in
`SKILL.md`) and session logs (historical — lives in `SESSION-13-LOG.md`).

This file holds **what's running RIGHT NOW** that any new chat must know to
work without drift:

- Sabrina alignment + URL reference list
- Prompt format/layout conventions we've evolved
- Sprint mode rules — when to wait vs when to build
- Blotato integration state
- Active integrations + their current state
- Standard workflows (how to fire bees, backup AU-19, verify deploys)
- Today's open items / pending decisions
- Chat A as reference (when to escalate)
- Chat A's latest authoritative input (placeholder — will be dumped here)

---

## ✏️ HOW TO UPDATE THIS FILE

When something changes operationally:
1. Append to the relevant section
2. Update the "Last updated" timestamp at top
3. Add an entry to the **What Changed** log at the bottom
4. Sync to skill folder (`cp` from brain v14)

This file is **not architecture**. Don't put architecture decisions here.
Architecture goes in `SKILL.md`. Drift incidents go in `SESSION-13-LOG.md`.
This file is for **how we work today**.

---

# A — SABRINA ALIGNMENT

Sabrina Ramonov is the founding voice methodology for the COLE marketing
system. Per **Locked Rule #4** and **Locked Rule #13**, every architecture
decision answers 4 questions before proceeding:

1. Does Sabrina cover this?
2. If yes, are we matching?
3. If diverging, why?
4. Document the divergence.

## Sabrina Canonical URLs

| URL | What it is | When to consult |
|---|---|---|
| https://sabrinaramonov.notion.site/FREE-AI-Prompts-Library-Sabrina-Ramonov-6ac894954218492d9fc9e1f7f90abc6c | FREE AI Prompts Library | Building any new bee that uses LLM prompts. Reference Sabrina's prompt structure first. |
| https://www.sabrina.dev | Sabrina.dev homepage | General context on Sabrina's methodology |
| https://www.sabrina.dev/p/i-built-an-ai-social-media-system | "I built an AI social media system" article | Architecture inspiration for the marketing brain |
| https://agents.sabrina.dev/ | Sabrina's agents site | Agent architecture patterns |
| https://help.blotato.com/tips-and-tricks/growth-best-practices | Blotato growth best practices (Sabrina-referred) | When publishing through Blotato — see Section D |
| https://www.youtube.com/@sabrina_ramonov | Sabrina's YouTube channel | Latest Sabrina content |
| https://www.youtube.com/playlist?list=PLy9mLEnHHo4WrBQReh8Cpo7u1OqlMvRsP | Sabrina YouTube playlist | Curated playlist (operator-flagged) |
| https://www.youtube.com/watch?v=YRP3Xlb33Po | Specific YouTube video (operator-flagged) | Reference video |
| ⚠️ https://www.youtube.com/watch?v=RbOAGU_aG7U/p/your-100-automated-ai-clone-makes-talking-videos | **MALFORMED URL — flagged for operator**. Looks like two URLs concatenated. Possibly meant: `https://www.youtube.com/watch?v=RbOAGU_aG7U` + a separate sabrina.dev article. Operator to clarify. | "Your 100% automated AI clone makes talking videos" — operator flagged as **good** |

**Note:** URL 8 in the operator's list is malformed. Treating as 2 separate
URLs until clarified. Logged as **D50** for operator clarification.

## Sabrina Alignment Workflow

When designing a new bee, content type, or platform integration:

1. **Search Sabrina's Notion prompt library** for relevant prompts
2. **Watch the playlist video** if topic matches (e.g. AI clone videos for
   YouTube-Long content)
3. **Check Blotato growth best practices** for platform-specific guidance
4. **Compare to current COLE design** — if diverging, document why in
   `SESSION-{N}-LOG.md` as a drift incident or architectural decision

If the new chat skips this step, drift incidents follow. This is verified by
multiple sessions where Sabrina alignment caught architectural mistakes
before they shipped.

---

# B — PROMPT FORMAT / LAYOUT CONVENTIONS

These conventions emerged from sessions 1-13. Every new chat must follow
them. They prevent drift.

## The Card Method (Locked Rule #14)

Every command, edit, query, or action is presented as a **CARD** with three
fields:

```
CARD <ID> — <PURPOSE>
  
  COMMAND:
  <bash / curl / SQL / TypeScript snippet>
  
  REPORT:
  <what to verify in the output>
```

Cards have prefixes that indicate their phase:

| Prefix | Phase | Example |
|---|---|---|
| `J-PRE-N` | Pre-plan audit | `J-PRE-6` (hook_matrix audit) |
| `JP-N` | Plan Mode | `JP-1` (file architecture) |
| `V-N` | Pre-merge verification | `V1` (tsc), `V2` (eslint), `V3` (sanity) |
| `L-N` | Live test on production | `L1` (backup), `L2` (fire bee) |
| `M-N` | Manual / docs commit | `M1` (file presence), `M3` (commit) |
| `D-N` | D-task placeholder | `D40` (per-site timezone) |

## Plan Mode Before Code (Locked Rule #14)

No code is written without operator approval. Every code change goes through:

1. **Pre-plan audit cards** — verify state (read-only)
2. **Plan Mode** — show file architecture + workflow + types BEFORE writing code
3. **Manual approval per edit** — operator approves each chunk
4. **Pre-merge verification** — V1/V2/V3 cards
5. **Commit + push** — single PR per logical change
6. **Live test** — verify on production
7. **Cleanup** — restore baseline if test affected production
8. **Manuals** — USER + BUILD per Locked Rule #15
9. **Sign-off** — two-confirmation gate (technical + operator)

This is exhausting. It's also why this session shipped 6 sign-offs without
a single drift incident reaching production.

## Verification Card Standard Structure

Every system ships with these 5 cards (or a subset):

- **V1** — `npx tsc --noEmit` (TypeScript check, expect 0 errors)
- **V2** — `npx eslint <files>` (lint check, expect 0 errors)
- **V3** — Sanity tests (inline tsx, throwaway script, e.g., 15 unit cases)
- **V4** — Skip-if-exists guard test (no API key, expect graceful skip)
- **V5** — Local fallback test (cole-marketing absent, expect bees-snapshot fallback)

## Honest Reporting Standard (Locked Rule #9)

Every report must:
- Show actual numbers (token counts, costs, durations) not estimates
- Show failures with same prominence as successes
- Flag deviations from estimates ("cost was 2.4× projected — D45 logged")
- Never hide caveats or spin

## Two-Repo Architecture (Locked Rule #5)

```
cole-marketing/     ← THE BRAIN (docs only, site-agnostic)
soverella/          ← THE RUNTIME (code only)
soverella/bees-snapshot/   ← THE BRIDGE (synced from cole-marketing on every deploy)
```

Never mix concerns. Architecture lives in cole-marketing. Code lives in
soverella. Bees-snapshot copies cole-marketing into soverella so Vercel
runtime can read knowledge files.

---

# C — SPRINT MODE: WHEN TO WAIT vs WHEN TO BUILD

**This is operator's verbatim guidance. Codified here as an operational rule.**

## ⛔ WAITING PERIODS DO NOT EXIST DURING BUILD

**This is a sprint. Build the whole house.** No "wait 2 weeks for ROI"
gates between platforms. No "let's see how this performs before moving
on" pauses. No "let's iterate on Block 1 for another week before starting
Block 2" delays.

## ✅ WAITING ONLY KICKS IN AFTER:

- Platform is fully signed off (code + manuals + Rule #15 two-confirmation)
- Platform is actively posting to live audience
- THEN the standard 7-14 day warm-up period applies (algorithm learns,
  audience reacts, baseline establishes)
- Warm-up affects ANALYTICS reading, not BUILD timing

## During the build phase (current state)

Sequence: Block 1 → Block 2 → Block 3 → Block 4A → 4B → 4C → 4D → 5 → 6 → 7

- No artificial pauses between blocks
- Sign-off block-by-block per Locked Rule #15
- Move to next block IMMEDIATELY after sign-off
- The whole house gets built before warm-up matters

## ⚠️ REJECT THESE COMMON CLAUDE INSTINCTS

If a new chat suggests any of these, **reject immediately**:

- "Let's wait and see if X works before building Y"
- "We should iterate on this before moving on"
- "Let's give it a week to gather data"
- "Maybe pause and think about whether we need Y"
- "Let's get feedback before continuing"

These are valid in some contexts. **Not during build phase.** Operator's
explicit instruction (May 4): *"we building the whole house, the waiting
will kick in when a platform is signed off and starts posting its accepted
there is a period of warm up but that does not fall during the build, this
is a sprint."*

## How to know we're in build phase

Look at master sheet (`MASTER-BUILD-SHEET.md`). If any block shows
incomplete tasks, we're in build phase. Sprint until all blocks signed off.

---

# D — BLOTATO INTEGRATION STATE

Blotato is the **publishing infrastructure** that pushes content to social
platforms. It sits AFTER the content generation chain (G5 → J2 → J3) and
BEFORE actual platform APIs.

## Current state (May 4 2026)

| Item | Status |
|---|---|
| Blotato account | ✅ Created (OP1 done) |
| Social accounts connected to Blotato | ✅ 4 platforms connected (OP3-OP6 done) |
| LinkedIn account | ✅ Connected |
| Instagram account | ✅ Connected |
| X account | ✅ Connected |
| TikTok account | ✅ Connected |
| YouTube account | ⏳ Not yet connected (deferred — OP7) |
| Blotato MCP integration to Claude | ✅ Available (see system MCP list — `Blotato:blotato_*`) |
| Blotato consumed by which bees | None yet — Block 3 work |

## Where Blotato fits in the architecture

```
[content generated by G5 → J2 → J3]
          ↓
[Blotato API call from publishing bee — Block 3]
          ↓
[Blotato pushes to LinkedIn / IG / X / TikTok]
          ↓
[content_performance tracks engagement]
```

## Blotato MCP tools (already available)

When operator-asked to use Blotato, the MCP tools are deferred but loadable:

```
Blotato:blotato_create_post — publish to any connected platform
Blotato:blotato_create_visual — generate image/carousel/video
Blotato:blotato_list_accounts — list connected accounts
Blotato:blotato_create_source — extract from URL/text
... etc (14 total Blotato MCP tools)
```

Use `tool_search` with query "blotato" to load definitions before calling.

## Blotato is currently NOT used by any bee

Block 3 (Blotato + TikTok build) is when first bee will integrate Blotato.
Until then, Blotato MCP tools are available for operator-driven manual posting.

## Reference: Blotato Growth Best Practices

Read https://help.blotato.com/tips-and-tricks/growth-best-practices BEFORE
designing any Blotato-integrated bee. Sabrina-referred — likely contains
posting cadence, format guidelines, platform-specific rules.

---

# E — ACTIVE INTEGRATIONS

## Currently in production

| Integration | State | What it does | Where it's used |
|---|---|---|---|
| **Supabase** | ✅ Live | Database + RLS-enforced storage | All bees, all tables |
| **Anthropic API** | ✅ Live | Sonnet + Haiku tiers | G5 (Sonnet), J2 (Haiku/Sonnet self-heal), J3 (Haiku), Doctor Bee, K12 |
| **Vercel** | ✅ Live | Hosting + cron infrastructure | All bees deployed; 9 cron schedules active |
| **Zernio API** | ✅ Live | LinkedIn publishing | J5 LinkedIn Publisher |
| **GA4** | ✅ Live | Analytics for content_performance | P5.5 GA4 wrapper (Doctor Bee analytics half) |
| **Resend** | ⏳ Phase 3 | Email infrastructure | Email system not yet built (cole-email-system skill) |
| **Blotato** | ✅ Connected | Multi-platform publishing | No bees integrated yet (Block 3 work) |
| **Stripe** | ✅ Live (taxchecknow) | Payment processing | Product purchase flow (separate from marketing) |

## Active Vercel cron schedules (9 total)

| Bee | Schedule (UTC) | Schedule (AWST) |
|---|---|---|
| I1 conductor | every 15 min | every 15 min |
| Doctor Bee | `0 22 * * *` | 8:00 AM |
| P5.5 GA4 wrapper | (existing) | (existing) |
| J5 LinkedIn publisher | (existing) | (existing) |
| Other 2 (existing) | various | various |
| **G5 story writer (NEW May 4)** | `0 20 * * *` | 6:00 AM |
| **J2 LI-strategy (NEW May 4)** | `0 21 * * *` | 7:00 AM |
| **J3 LI-adapter (NEW May 4)** | `15 22 * * *` | 8:15 AM |

First natural fire of new crons: tonight (May 4 20:00 UTC = May 5 6:00 AWST).

## Built bee inventory

| Bee | Status | Token tier |
|---|---|---|
| P5.5 GA4 wrapper | ✅ Live | Tier 0 (no LLM) |
| J3 LinkedIn adapter | ✅ Live | Haiku |
| J1.5 viral-template-scraper | ✅ Live | Sonnet |
| J5 LinkedIn publisher | ✅ Live | Tier 0 (Zernio API) |
| Doctor Bee | ✅ Live | Haiku |
| K12 Pattern Learner | ✅ Live | Haiku |
| `_character-registry.ts` | ✅ Live (foundational, 6 chars, 2 sites) | N/A (TypeScript module) |
| G5 story-writer | ✅ Live (May 4) | Sonnet |
| J2 LI-strategy | ✅ Live (May 4) | Haiku primary, Sonnet self-heal |
| Sync infrastructure | ✅ Live (May 4) | N/A |

**~9 bees built. ~48 specced but unbuilt.** Master sheet tracks all 7 blocks.

---

# F — STANDARD WORKFLOWS

## Fire a bee manually (from operator side)

```bash
curl -X POST https://www.soverella.com/api/admin/run-bee \
  -H "x-admin-key: $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<bee-name>",
    "site": "taxchecknow",
    "product_key": "<product-key>",
    "trigger_source": "manual",
    "payload": {"force": true}
  }'
```

Replace `<bee-name>` with: `g5-story-writer`, `j2-li-strategy`, `j3-li-adapter`, etc.

## Backup AU-19 before live test

```bash
set -a && . ./.env.local && set +a && \
curl -sS \
  "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/content_jobs?select=id,output_data&product_key=eq.au-19-frcgw-clearance-certificate&site=eq.taxchecknow" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  | python -c "
import sys, json
rows = json.load(sys.stdin)
backup = {'job_id': rows[0]['id'], 'output_data': rows[0]['output_data']}
with open('/tmp/au19-baseline-backup.json', 'w') as f:
  json.dump(backup, f, indent=2)
print(f'Backup saved. linkedin_post length: {len(backup[\"output_data\"].get(\"linkedin_post\") or \"\")}')
"
```

Per **Locked Rule #11** (Live Products Are Verbatim Base Level), AU-19 is
the production baseline. Always backup before any test that uses `force=true`.

## Restore AU-19 after live test

Read `/tmp/au19-baseline-backup.json` and PATCH back. See session 13 Card L5
for full restore script.

## Verify a Vercel deploy

After `git push`:
1. Wait 1-2 min for build
2. Check Vercel dashboard: https://vercel.com/<org>/soverella
3. Verify deploy is green
4. Spot-check by hitting `/api/admin/health` (returns 200) or running smoke test bee

## Verify skill folder is loading correctly (pub test)

In a NEW chat (not this one), ask:

> "What's the latest commit on soverella main and what does it do?"

If new chat references the latest commit (e.g., `fa50be1` Task 1.7 delta
docs as of May 4) → skill folder bridge is working.

If new chat says "I don't know" or references stale state → skill discovery
broke or content drifted. Debug.

## Sync brain v14 to skill folder

After updating any file in `/home/claude/cole-brain-v14/`:

```bash
# Specific files to keep in skill folder
cp /home/claude/cole-brain-v14/SESSION-13-FULL-LOG.md /mnt/skills/user/cole-marketing-os/SESSION-13-LOG.md
cp /home/claude/cole-brain-v14/MASTER-BUILD-SHEET.md /mnt/skills/user/cole-marketing-os/MASTER-BUILD-SHEET.md
cp /home/claude/cole-brain-v14/VOICE.md /mnt/skills/user/cole-marketing-os/VOICE.md
# OPERATIONAL-STATE.md lives only in skill folder + brain v14, sync similarly
```

---

# G — TODAY'S OPEN ITEMS / PENDING DECISIONS

## Pending operator action

| Item | Status | Notes |
|---|---|---|
| **OP10 — P5.5 GA4 verification** | ⏸ Deferred all session | Verify P5.5 cron actually fired and wrote to content_performance. Query: `SELECT * FROM agent_log WHERE id='bf2394b0-242c-455c-9156-349ca1e6bba6'` |
| **Block 1 Task 1.6 backfill** | 🟡 Auto-firing tonight | G5 cron 20:00 UTC → J2 21:00 → J3 22:15. Tomorrow 9am AWST: count check should show 47/47 |
| **New chat pub test** | ⏳ Tomorrow morning | Verify skill folder bridge works in fresh chat (see Section F) |
| **Chat A's updated original build** | ⏳ Awaiting operator | When received, dump verbatim into Section I |
| **Sabrina URL 8 clarification** | ⏳ Awaiting operator | Malformed URL — split into 2 separate URLs |

## Open D-tasks (top priority)

49 D-tasks logged total. Most relevant to current sprint:

| D-task | Priority | Notes |
|---|---|---|
| **D40** per-site timezone in SITE_CONFIG | Medium | When non-AU sites launch (Phase 7) |
| **D41** consistent `source` field across hook_matrix writers | Low | When G1 + J1.5 graduate to canonical writers |
| **D42** build G1 hook-matrix bee | Medium | Block 5 Hive 3 work |
| **D45** J2 token budget reduction (~50% target) | Low | Cost optimization, not blocking |
| **D46** post3 calendar_id tiebreaker rule | Low | Edge case |
| **D47** encoding drift fix (UTF-8 strict) | Medium | Affects backup/restore cycles |
| **D48** monitor backfill progress May 5-8 | High | Daily count check |
| **D49** operator fast-track via manual cron triggers | Optional | If natural backfill stalls |
| **D50** [NEW] Sabrina URL 8 clarification | Low | This file flagged it |

Full D-task list lives in `SESSION-13-LOG.md`.

## Blockers — none currently

No blockers. Sprint can resume on Block 2 (Hive 4 Maintenance) or Block 3
(Blotato + TikTok) whenever operator is ready.

---

# H — CHAT A AS REFERENCE (When Stuck)

## What Chat A is

**Chat A is the older wise chat we consult when stuck.** It has institutional
memory from earlier sessions that current Claude (this iteration) doesn't.
Don't be afraid to escalate — Chat A has prevented hours of wrong-direction
work this session alone.

## When to escalate to Chat A

- Architectural decisions where multiple valid options exist
- Drift that contradicts brain v14's current state
- Schema mismatches between spec and reality
- Token tier decisions for new bees
- Cost trade-offs that affect backfill projections
- Anytime current Claude says "I don't know which is canonical"

## When NOT to escalate

- Implementation details (variable names, function signatures, test cases)
- Bug fixes
- Operator-driven scope changes
- Documentation
- Anything where Session B can verify via grep / query / file read

## What Chat A has resolved this session

| Drift / Decision | Chat A's call |
|---|---|
| **Drift #24** — PLATFORM-LINKEDIN.md said J2 BUILT, README said NOT BUILT | J2 unbuilt; PLATFORM-LINKEDIN.md needs correction |
| **J2 Architecture (6 questions)** | Haiku primary + Sonnet self-heal + write-back YES + adapt to current schema (Path B) |
| **J2 character key canonical** | `gary-mitchell` kebab; AU-19 stays as legacy snake_case |
| **J2 chain order** | G1 → I1 → G5 → J2 → J3 → J4 → J5 |
| **Drift #31** — Task 1.7 "I1 cascade update" | I1 was built correctly as scheduler. Per-bee staggered crons = de-facto orchestrator. NOT orchestrator bee (single point of failure). |

## How to escalate

Operator pastes a structured prompt to Chat A in the user's separate chat
window. Format:

```
═══════════════════════════════════════════════════════════
QUESTION FOR CHAT A — <TOPIC>
═══════════════════════════════════════════════════════════

CONTEXT:
<brief state of current sprint, recent commits>

DRIFT INCIDENT #N:
<what brain v14 says vs what reality is>

OPTIONS A/B/C:
<each with pros/cons + cost/effort estimate>

QUESTION FOR CHAT A:
<direct question, single yes/no or multi-choice>

WHAT WE NEED FROM YOU:
Direct authoritative answer, not options.
```

## Honest acknowledgment

Several times this session, my instinct said "no Chat A needed" and the
audit caught I was wrong (drift #24, #31). When in doubt, escalate.
Chat A is cheap. Drift is expensive.

---

# I — CHAT A'S UPDATED ORIGINAL BUILD

## Status: ✅ RECEIVED May 4 2026 (end of session 13)

Chat A's authoritative reference document received as `chat_A_cole-brain-update.skill` (zip). Two key files extracted and saved:

| File | Size | Purpose |
|---|---|---|
| `CHAT-A-ORIGINAL-DESIGN.md` | 1,931 lines (64 KB) | **The ground truth design intent.** Read this when stuck on architecture. |
| `CHAT-A-YOUTUBE-PROMPTS.md` | 66 KB | YouTube-specific prompt library for future YouTube bee builds |

**Both files live in:**
- `cole-marketing-os/` skill folder (auto-loads in new chats)
- Brain v14 (packaged in zip for backup)

## ⚠️ HOW TO USE CHAT A's CONTENT — IMPORTANT FRAMING

**Chat A's `ORIGINAL-DESIGN-READ-FIRST.md` is REFERENCE MATERIAL, NOT NEW ARCHITECTURE.**

**Order of authority** (when conflict exists):

1. **OPERATIONAL-STATE.md** wins for **operational matters** (today's state, what's running, what changed)
2. **SKILL.md** wins for **architectural rules** (the 19 Locked Rules)
3. **SESSION-13-LOG.md** wins for **historical decisions** (what we changed and why)
4. **CHAT-A-ORIGINAL-DESIGN.md** is **third-party authoritative reference** — use when:
   - Current chat is stuck on architecture
   - You don't understand WHY a design exists
   - You need the original "factory metaphor" framing
   - You need historical context for a bee or station

**If Chat A's document conflicts with our 4 canonical files: OUR FILES WIN.** Chat A's document is the wise older chat we consult — not a new authority that overrides current operational truth.

## What Chat A's document contains

### Part 1 — Why COLE makes money
The citation gap explained: AI models cite outdated info. We publish verified current legislation. AI models cite us. People click. People buy. **Read for sales context, not architecture.**

### Part 2 — The Factory Metaphor
COLE is a factory, not a website. 57 bees across 17 stations. The operator owns the factory but doesn't operate machines. **Useful framing for new chats — explains the system in 30 seconds.**

### Part 3 — Complete Bee Roster (57 bees across 17 stations)
Station letters: E (Research), F (Product Build), G (Content), H (Despatch), I (Launch), J (LinkedIn), K (Optimise), L (YouTube), M (Instagram), N (TikTok), O (Reddit), P (Threads), Q (X/Twitter). **Cross-reference with our MASTER-BUILD-SHEET.md when planning Block 2-7.**

### Part 4 — Three Repos
cole-marketing (brain), soverella (runtime), taxchecknow (products). **Already in our SKILL.md as Locked Rule #5 — no conflict.**

### Part 5 — Site Separation Architecture
Same as our Locked Rule #18 (Universal Brain). **Confirms our architecture.**

### Part 6 — Knowledge Files
Facts file format + G4 verification gate. **Useful for new product builds. Cross-references our facts file pattern.**

### Part 7 — The Character System
Cross-reference with our `VOICE.md` and `_character-registry.ts`. **Same architecture.**

### Part 8 — LinkedIn Algorithm 2026
Platform-specific tactics. **Useful when designing LinkedIn content — read before designing J3 prompts.**

### Part 9 — Chat A's 14 Rules
Mostly overlap with our 19 Locked Rules. See **comparison table below**.

### Part 10 — The Soverella Dashboard
Block 6 work. **Reference when starting Block 6 (dashboard build).**

### Part 11 — Costs, Accounts, Status
Account warm-up periods, env var checklist, monthly cost projections (~$106-126/month). **Most operationally useful section** — cross-reference with our Section E (Active Integrations).

### Part 12 — Phase Status (Chat A's view)
Confirms Phase 1-3 complete. Block 1 nearly done. Aligns with our master sheet.

### Part 13 — Income Projection
Month 3: $400-1,500 AUD profit. Month 12: $15,000-50,000. **Sales context, not architecture.**

### Quick Reference — Critical Facts
- Live LinkedIn post URL + content_performance ID
- AU-19 FRCGW verified facts (0.99 confidence)
- Zernio Account ID **`69f40768985e734bf3e81f56`** — NOT profile ID 69f40659... (causes 403 error)
- Key commits list

## Comparison — Chat A's 14 rules vs our 19 Locked Rules

| Chat A | Our Rule | Status |
|---|---|---|
| Rule 1 — No Proposal Without Audit | Rule #1 + #14 | ✅ Same intent |
| Rule 2 — Never Rename A Bee After Production | (new — not in ours) | 🆕 **Add to brain v14 — important** |
| Rule 3 — Every New Supabase Table Gets RLS | Rule #6 | ✅ Same |
| Rule 4 — Optimistic-Failure Pattern | (implicit — make explicit) | 🆕 **Add to brain v14** |
| Rule 5 — Hybrid Execution Model (Imperative + LLM, no agentic) | (implicit) | 🆕 **Add to brain v14** |
| Rule 6 — Scheduled-Publisher (15-min) May NOT Call LLM | (implicit) | 🆕 **Add to brain v14** |
| Rule 7 — I1 Is A Scheduler Not An Orchestrator | Drift incident #31 resolution | ✅ Same conclusion |
| Rule 8 — Spec Sync Strategy A (Prebuild Copy) | Rule #5 + sync infrastructure | ✅ Same |
| Rule 9 — Station Naming Convention | (new — not formalised) | 🆕 **Add to brain v14** |
| Rule 10 — Min Sample Size for K12 (3 graded posts) | (not yet — K12 work) | 🆕 **Add when K12 graduates** |
| Rule 11 — Content Missing Gets Its Own Agent Log Row | (implementation detail) | 🆕 **Add to brain v14** |
| Rule 12 — The Pub Test ("Would Gary say this in a pub?") | (implicit in voice work) | 🆕 **Make explicit Rule #20 candidate** |
| Rule 13 — Session Separation (A=taxchecknow, B=soverella) | Locked Rule #5 (two-repo) | ✅ Same intent |
| Rule 14 — Verify Before Cite (Audit-First) | Rule #14 | ✅ Same |

**5 new rules from Chat A worth promoting to our locked rules:**
- Rule #20 candidate: Pub Test (Gary speak check) — Chat A Rule 12
- Rule #21 candidate: No Bee Renames Post-Production — Chat A Rule 2
- Rule #22 candidate: Optimistic-Failure Pattern (publishers) — Chat A Rule 4
- Rule #23 candidate: Hybrid Execution Only (no pure agentic) — Chat A Rule 5
- Rule #24 candidate: Station Naming Convention — Chat A Rule 9

**These are D-tasks for next session** — D51 through D55. Operator should review and approve which to formalize as our Locked Rules.

## How to use Chat A's document going forward

### As reference (default)
- New chat encounters architecture question
- Reads our SKILL.md + OPERATIONAL-STATE.md first
- If still unclear: reads CHAT-A-ORIGINAL-DESIGN.md for original design intent
- Returns to our canonical files for current state

### When stuck (escalation)
- Operator opens fresh Chat A window
- Pastes structured question (see Section H format)
- Chat A responds with authoritative architectural answer
- New decisions get logged in OPERATIONAL-STATE.md + SESSION-N-LOG.md
- CHAT-A-ORIGINAL-DESIGN.md remains the historical reference

### What NOT to do with Chat A's document

- ❌ Don't treat Chat A's 14 rules as canonical (we have 19 + 5 candidates)
- ❌ Don't update CHAT-A-ORIGINAL-DESIGN.md ourselves (it's Chat A's authored content)
- ❌ Don't let new chats use Chat A's document instead of our SKILL.md (ours is current state, theirs is design intent)
- ❌ Don't use Chat A's bee station naming for bees not yet built without operator confirmation

---

# 📝 WHAT CHANGED LOG

Append-only log of edits to this file.

## May 4 2026 — Chat A's design doc integrated (after first creation)

- Section I populated with Chat A's `ORIGINAL-DESIGN-READ-FIRST.md` content reference
- Two new files added to skill folder:
  - `CHAT-A-ORIGINAL-DESIGN.md` (1,931 lines, 64 KB) — design intent reference
  - `CHAT-A-YOUTUBE-PROMPTS.md` (66 KB) — YouTube prompt library for future bee builds
- Comparison table added: Chat A's 14 rules vs our 19 Locked Rules
- 5 new Locked Rule candidates identified (D51-D55):
  - Pub Test (Chat A Rule 12)
  - No Bee Renames Post-Production (Chat A Rule 2)
  - Optimistic-Failure Pattern (Chat A Rule 4)
  - Hybrid Execution Only — no pure agentic (Chat A Rule 5)
  - Station Naming Convention (Chat A Rule 9)
- Order of authority established: OPERATIONAL-STATE > SKILL > SESSION log > CHAT-A reference
- Critical fact captured: Zernio LinkedIn Account ID = `69f40768985e734bf3e81f56` (NOT profile ID 69f40659... — causes 403)

## May 4 2026 — File created (end of session 13)

- Initial creation of OPERATIONAL-STATE.md
- All 9 sections populated based on session 13 state
- Sabrina URL list integrated (URL 8 flagged as malformed → D50)
- Blotato state captured (4 platforms connected, no bees integrated yet)
- Sprint mode rules codified (no waiting during build)
- Chat A framing added (when to escalate, what's been resolved)
- Section I placeholder for Chat A's pending updated build
- Operator verbatim guidance preserved: "we building the whole house, the
  waiting will kick in when a platform is signed off and starts posting"

---

**END OF OPERATIONAL-STATE.md**

> Remember: this file is updated CONSTANTLY. If the timestamp at the top is
> more than a few days old, ask operator if anything has changed. New chat
> drift starts when this file is treated as static.
