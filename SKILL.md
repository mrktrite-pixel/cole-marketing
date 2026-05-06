---
name: cole-marketing-os
description: >
  The COLE Marketing OS — complete hive architecture for building an
  autonomous content and distribution system. Use this skill whenever:
  building any marketing agent, content pipeline, video system, email
  automation, social publisher, analytics tracker, or campaign system.
  Also triggers for: "build the hive", "marketing agent", "content OS",
  "story writer", "video scripter", "article builder", "hook matrix",
  "reddit research", "social publisher", "email sequences", "GEO optimiser",
  "citation gap finder", "campaign planner", "ad buyer", "analytics reader",
  or any question about the COLE marketing system.
  READ THIS BEFORE BUILDING ANY MARKETING COMPONENT.
  The architecture is final. Build within it.
---

# COLE MARKETING OS — CURRENT STATE

**Last updated:** May 6 2026 (Session 14 complete — LOCKED-LOOP-CLOSURE-SPEC v1.0 + dashboard rebuild + 15 lifecycles)
**Current sprint task:** Block 2 Task 2.0e — lib/_warm-up-guard.ts (TikTok-only, ~50% complete via Session B)
**Architecture status:** 🔒 LOCKED. No new spec changes without explicit operator approval.

---

## ⚠️ CRITICAL — READ BEFORE ANY ACTION

**START HERE:** `README-NEXT-CHAT.md` is the entry point for new chats. It has the priority read order, current state, hard rules, preservation list, and what NOT to do. **If you're starting a new chat, read README-NEXT-CHAT.md FIRST.**

**Canonical truth (post-Session 14):**
- `LOCKED-LOOP-CLOSURE-SPEC.md` — 🔒 **THE architecture document.** 956 lines, 15 sections. Reconciles ChatGPT Take 3 + 50-site pub test + brain v14. Section 0 lists all 12 canonical reference files. **Future chats implement against this spec exactly.**
- `cole-bee-dashboard.jsx` — 🔒 **The bible.** 1,951 lines, 15 lifecycles. Master Conveyor Belt + Closed Loop + per-platform views. **The operator's bible — future updates must work with this flowchart.**

**Companion files (read in order shown):**
- `README-NEXT-CHAT.md` — entry point with priority order
- `LOCKED-LOOP-CLOSURE-SPEC.md` — architecture truth
- `cole-bee-dashboard.jsx` — visual bible
- `CUSTOMER-taxchecknow.md` (v8 May 2 2026) — product framing + banned phrases
- `USER-SKILL.md` — strategy thesis (Citation Gap Engine)
- `GOAT-BEEHIVE-ARCHITECTURE.md` — strategic playbook
- `OPERATIONAL-STATE.md` — 🔴 **LIVING WORKING FILE** — daily working state
- `VOICE.md` — canonical voice + spelling reference (per-character)
- `CHARACTERS.md` (v8) — character voice guides per market (Gary=AU, James=UK, etc. — all on taxchecknow only)
- `MASTER-BUILD-SHEET.md` — current sprint progress tracker
- `SESSION-13-FULL-LOG.md` + earlier logs — institutional memory (drift incidents, D-tasks)
- `CHAT-A-ORIGINAL-DESIGN.md` — 🟡 **REFERENCE ONLY** — original design intent. Does NOT override LOCKED-LOOP-CLOSURE-SPEC.

**File priority (when conflict exists):**
1. **LOCKED-LOOP-CLOSURE-SPEC.md** = architectural truth. The lock as of May 6 2026. Slow-changing.
2. **OPERATIONAL-STATE.md** = working file. How we operate today. Updated constantly.
3. **SKILL.md** (this file) = 19+ locked rules. Slow-changing.
4. **cole-bee-dashboard.jsx** = visual representation of architecture. Locked.
5. **SESSION-X-LOG.md** = institutional memory. Append-only history.
6. **CHAT-A-ORIGINAL-DESIGN.md** = REFERENCE ONLY. Does NOT override above.

If LOCKED-LOOP-CLOSURE-SPEC and any other file conflict, **LOCKED-LOOP-CLOSURE-SPEC wins**. Chat A's documents are reference layers, not authoritative.

---

## 19 LOCKED RULES (canonical, never violate without explicit operator approval)

### Rule #1 — Audit-First (May 1 2026)
Before any code/SQL/edit, audit existing state. Verify schema before writing queries. Verify file existence before referencing. Read existing code before refactoring.

### Rule #2 — Context Window Discipline (May 1 2026)
At ~50% context, declare it. Plan for handoff. Never run out of context mid-task.

### Rule #3 — Single Brand Handle Architecture (May 2 2026)
Brand is the speaker on every platform (e.g. @taxchecknow). Characters are CONTENT STYLE GUIDES not personas. Never first-person from characters. Always "we built", "our analysis", "we ran X calculator sessions."

### Rule #4 — Sabrina Alignment (May 2 2026)
Match Sabrina's principles for content creation. If diverging, document why as vertical-specific extension.

### Rule #5 — Two-Repo Architecture (May 2 2026)
- `cole-marketing` = THE BRAIN (docs only, site-agnostic)
- `soverella` = THE RUNTIME (code only)
- `bees-snapshot/` in soverella = the bridge (synced from cole-marketing, ships with deploy)

### Rule #6 — RLS Mandatory (May 2 2026)
Every Supabase table has RLS enabled with site-scoped policies. No exceptions.

### Rule #7 — Schema Verification (May 2 2026)
Never write SQL without verifying actual schema first. Never assume column names.

### Rule #8 — Voice File Enforcement (May 3 2026)
Every content-generating bee reads VOICE.md (or registry-derived voice block). Never hardcode character voice inline.

### Rule #9 — Honest Reporting (May 3 2026)
Report failures with same prominence as successes. No optimistic spin. No hidden caveats.

### Rule #10 — Audit-First (formalized) (May 3 2026)
Before any change, run audit cards verifying current state. Plan mode shows proposed changes BEFORE code is written.

### Rule #11 — Live Products Are Verbatim Base Level (May 3 2026)
Never modify live calculators. They are baseline truth. Test against them, never against modified copies.

### Rule #12 — Two-Confirmation Sign-Off (May 3 2026)
Phase signs off only after BOTH technical confirmation (commit + tests pass) AND operator confirmation (operator reviewed and accepted output).

### Rule #13 — Sabrina Alignment Check (May 3 2026)
Before any architecture decision, answer 4 questions: (1) Does Sabrina cover this? (2) If yes, are we matching? (3) If diverging, why? (4) Document the divergence.

### Rule #14 — Command Card Method (May 3 2026)
Every command/edit gets a Card with: PURPOSE, COMMAND, REPORT format. No commands fire without explicit per-edit operator approval. Verify-before-cite mandatory.

### Rule #15 — Phase Documentation Gate (May 3 2026)
Every system ships with USER + BUILD manuals before sign-off. No exceptions. Manuals based on real test data, not hypotheticals.

### Rule #16 — Sprint Cadence (May 4 2026)
Sessions continue until context forces retirement. Build the whole house. No artificial session breaks. No "wait 2 weeks for ROI" gates between platforms.

### Rule #17 — Documentation Discipline (May 4 2026)
Manuals delivered per-system. Pre-Help-Tab: deliver to chat + brain `docs/help/`. Post-Help-Tab (Block 6.1): deliver direct to dashboard.

### Rule #18 — Universal Brain Architecture (May 4 2026)
cole-marketing is SITE-AGNOSTIC. Characters are per-MARKET (geography), NOT per-SITE (product domain). When a 2nd site launches, brain is NOT duplicated. Inheritance unit = CHARACTER, not SITE.

**DRIFT TO AVOID:**
- Don't propose per-site voice files
- Don't propose per-site character files
- Don't duplicate knowledge files per site
- Don't split lessons by site

### Rule #19 — No Filename Drift (May 4 2026)
Before introducing any new filename in cole-marketing or soverella, AUDIT whether the canonical name already exists.

**PROCEDURE:**
1. `grep -rn "<proposed-name>" cole-marketing/ soverella/`
2. `ls cole-marketing/` to see existing root-level files
3. If a file with similar scope already exists at a different name: choose between (a) merge content into existing canonical name, OR (b) explicit decision to create separately with documented rationale

**EXTENDED:** Applies to ANY brain-referenced file, not just .md filename collisions. Verify the file exists in the actual target repo before referencing it in plans (drift incident #21 occurred twice — VOICE-AND-SPELLING.md and PLATFORM-LINKEDIN.md).

---

## CURRENT SYSTEM STATE (May 4 2026)

### Latest commits

**cole-marketing main:** `0ddca5d` (VOICE.md merged canonical, 428 lines)
**soverella main:** `7922cc0` (G5 + character registry + sync infrastructure + 6 manuals)
**taxchecknow main:** `70852cc`

### Built and shipped bees

| Bee | Status |
|---|---|
| P5.5 GA4 wrapper (Doctor Bee analytics) | ✅ Live |
| J3 LinkedIn adapter | ✅ Live (Haiku, 7-key output) |
| J1.5 viral-template-scraper | ✅ Live (16 templates, gary-mitchell canonical) |
| J5 LinkedIn publisher | ✅ Live (Zernio API) |
| Doctor Bee + K12 Pattern Learner | ✅ Live |
| `_character-registry.ts` (foundational) | ✅ Live (520 lines, 6 chars, 2 sites) |
| G5 Story-writer | ✅ Live (Sonnet, multi-character) |
| Sync infrastructure (defensive optional pattern) | ✅ Live |

### Production data state

- AU-19 baseline preserved: 1392-char linkedin_post + 9-key linkedin_adapted (May 1 hand-stuffed snapshot)
- viral_templates: 16 rows, all gary-mitchell canonical
- bees-snapshot/ tracked in git: 88 files (77 specs + CHARACTERS + VOICE + 5 knowledge + 3 lessons + manifest)
- 6 cron schedules live and firing

### NOT YET BUILT (despite older docs claiming otherwise)

- **J2 LI-strategy** — spec only at `bees-snapshot/platforms/li-strategy.md`. PLATFORM-LINKEDIN.md says "✅ BUILT" — that's WRONG (drift #24). Next sprint task.
- **G1 Hook Matrix** — build status unconfirmed. J2 design assumes G1 exists. Verify before J2 ships.
- **J3.5, J3.6, J4, J6** — PLATFORM-LINKEDIN.md claims "BUILT" — verify before consuming.

### Sprint mode active (Rule #16)

60 hr/week, full-time. Build the whole house. Sign off block-by-block.

Master tracker: `MASTER-BUILD-SHEET.md` (this skill folder).

**Block 1 of 7: Content Foundation**
- ✅ Task 1.1 G5 + registry + sync (DONE May 4)
- ✅ Task 1.2 6 manuals (DONE May 4)
- 🟡 Task 1.3 J2 LI-strategy (IN PROGRESS — Chat A architecture confirmed)
- ⬜ Task 1.4-1.8 J2 manuals + chain test + backfill 47 + I1 conductor update

---

## DRIFT INCIDENTS — INSTITUTIONAL MEMORY

**27 drift incidents logged across sessions.** Read `SESSION-13-LOG.md` for full descriptions.

**Most-repeated patterns to watch for:**

1. **Brain-vs-repo file confusion (drift #21, repeated twice)** — Claude assumes a file mentioned in brain v14 exists in cole-marketing repo. It often doesn't. ALWAYS verify file existence before referencing.

2. **Hardcoded character/country/authority (drift #19)** — Bee designs hardcode Gary/AU/ATO inline. Multi-character architecture from day 1 via `_character-registry.ts`. Zero hardcoded character/country/authority/currency/spelling values in any new bee.

3. **Per-site duplication (drift #22)** — Almost split universal voice canon into per-site files. Chat A clarified: cole-marketing is universal brain. Characters per-MARKET, not per-SITE. ONE voice canon shared across all sites.

4. **Filename drift (drift #23)** — VOICE-AND-SPELLING.md vs VOICE.md. Two files for same scope = drift. Always merge into canonical name.

5. **Stale "BUILT" claims in platform docs (drift #24)** — PLATFORM-LINKEDIN.md says J2/J3.5/J3.6/J4/J6 are "BUILT" — they may not be. Verify against actual repo before consuming any "built" claim.

6. **Skill folder not updated across sessions (drift #27)** — RESOLVED May 4 2026 by writing this updated SKILL.md + companion files directly to `/mnt/skills/user/cole-marketing-os/`. No more "every chat starts confused."

---

## WORKFLOW RULES FOR NEW CHATS

Per Rule #15 + Rule #16 + Rule #17:

1. **Plan Mode FIRST** — Cards before code, manual approval per edit
2. **Audit-first verification** — `ls`, `grep`, schema check before any write
3. **Multi-character + multi-site by default** — registry-driven, never hardcoded
4. **Sync via bees-snapshot** — cole-marketing → bees-snapshot → Vercel runtime
5. **Defensive optional pattern** — files that don't exist yet should warn-and-continue, not fail
6. **Length verify, no retry** — content bees flag length issues, downstream bee handles compression
7. **Read-modify-write merge** — preserve sibling output_data keys
8. **Cost transparency** — log token + cost in agent_log for every LLM call
9. **Real test data drives manuals** — never write hypothetical examples
10. **Two-confirmation sign-off** — technical (commits + tests) + operator (review + accept)

---

## WHEN STARTING A NEW CHAT

Read in this order:

1. This SKILL.md (you're here)
2. `VOICE.md` (canonical voice + spelling)
3. `SESSION-13-LOG.md` (institutional memory — 27 drift incidents + 43 D-tasks)
4. `MASTER-BUILD-SHEET.md` (current sprint state)

Then ask operator: "What's the current sprint focus?" Don't assume — verify the master sheet.

---

## ARCHITECTURAL PRINCIPLES (do not violate)

### The 4 hives

```
HIVE 1 — Research + Planning (researchers, planners)
HIVE 2 — Content + Adaptation (writers, formatters, adapters)
HIVE 3 — Distribution + Optimization (publishers, monitors, scientists)
HIVE 4 — Maintenance + Cleanup (Madame + cleaners + cost reporter)
```

### The 4 queens

```
Strategic Queen   — coordinates Hive 1 (research → strategy)
Tactical Queen    — coordinates Hive 2 + 3 (content → distribution)
Adaptive Queen    — coordinates Hive 3 optimization loop (Doctor + Scientist + K12)
Cleaning Queen    — coordinates Hive 4 (Madame dispatches K15-22 weekly)
```

### Total bees in full architecture

~57 bees across 4 hives. Currently ~9 built, ~48 specced but unbuilt. Master sheet tracks all 7 blocks of construction.

---

## TOKEN TIER GUIDELINES

- **Sonnet:** creative writing (G5 narrative, strategy decisions when generating fresh content)
- **Haiku:** extraction, formatting, selection (J3 adapter, J2 hook selection from existing matrix)
- **Tier 0:** API calls only (J5 publisher, no LLM)

Default to Haiku. Upgrade to Sonnet only when output quality fails the pub test.

---

## OPERATOR CONTEXT

- **Name:** Matt
- **Pace:** 60 hr/week sprint mode
- **Goal:** Earn money ASAP — sprint not marathon
- **Style:** Direct. Catches drift fast. Trusts but verifies. House-analogy thinker ("don't wait between rooms").
- **Verbatim guidance:** "Never guess, always check. Run the prompts so we catch scope creep."

---

For full details, see `SESSION-13-LOG.md` and `MASTER-BUILD-SHEET.md` in this skill folder.

The architecture is final. Build within it.
