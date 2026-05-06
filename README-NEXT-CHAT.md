# READ THIS FIRST — NEXT CHAT INSTRUCTIONS

**Last updated:** May 6 2026 (end of Session 14 architecture lock)
**Status:** Architecture LOCKED. Build resumes. No more spec changes without explicit operator approval.

---

## 🛑 STOP — DO NOT START BUILDING UNTIL YOU READ THIS FILE COMPLETELY

If you skip this file, you will:
- Propose architecture that's already locked
- Break preservation rules on live taxchecknow.com
- Drift into scope creep that wasted 3 days previously
- Miss the canonical reference docs

**Read this file fully. Then read in priority order below. Then act.**

---

## CURRENT STATE — Honest snapshot

### What's locked and shipped

- **LOCKED-LOOP-CLOSURE-SPEC.md (956 lines, v1.0)** — the canonical architecture document. Reconciles ChatGPT Take 3 + 50-site pub test + brain v14. **THIS IS THE TRUTH.** Future chats implement against this spec exactly.
- **cole-bee-dashboard.jsx (1,951 lines, 15 lifecycles)** — the operator's bible. Visual representation of the entire system. Master Conveyor Belt + Closed Loop + per-platform lifecycles + Truth-Sync + Story Compounding + Cleaning Queen + Site Launch Runbook.
- **Block 1** ✅ shipped — LinkedIn autonomous publishing live since May 1 2026.
- **47 product configs** live on taxchecknow.com (signed-off, $67/$147 tiers, exit-intent popups, GEO layouts, calculator email-capture component).

### What's mid-flight

- **Block 2** ~17% complete — TikTok pipeline build (Tasks 2.0a–2.14)
  - Task 2.0e in progress: lib/_warm-up-guard.ts (TikTok-only, ~50% done)
  - After 2.0e: 2.0d / 2.0g / 2.1 / N1-N5 bee builds
- **Card B-EMAIL-AUDIT-1** — ready to fire. Verifies if T2 fires on Stripe purchase TODAY (potential silent revenue loss). 15-30 min Session B effort.

### What's blocked / pending operator action

- **Spec commit** — LOCKED-LOOP-CLOSURE-SPEC.md v1.0 (956 lines) needs commit to cole-marketing repo
- **Dashboard commit** — cole-bee-dashboard.jsx v1.0 (1,951 lines) needs commit
- **T2 verification** — does Stripe purchase trigger an email today? Critical revenue protection question.
- **Zernio Analytics restoration** — $34/mo (operator action, ~10 min)

---

## READ FILES IN THIS ORDER

### Tier 1 — Canonical truth (read before any action)

1. **LOCKED-LOOP-CLOSURE-SPEC.md** — THE architecture document. 15 sections. 956 lines. Section 0 lists every other canonical file. Section 1 shows the core flow. Section 2 has 11 hard rules nobody can violate. Section 11 has the 4-layer architectural evolution + scope discipline + North Star.

2. **cole-bee-dashboard.jsx** — The bible. 15 lifecycles. Open the Lifecycle Viewer tab and click "🟢 CREATE NEW SITE — Master Conveyor Belt" — this is the orchestrated end-to-end vision (28 stages, 4 Queens, today's manual reality + tomorrow's automation).

3. **CUSTOMER-taxchecknow.md (v8 May 2 2026)** — The product framing. $67-147 pricing. "Personalised reports NOT PDFs." Banned phrases. Acceptable phrases. **REQUIRED reading before ANY product, content, or pricing decision.**

4. **USER-SKILL.md** — The master COLE strategy doc. Citation Gap Engine thesis. Why personalised reports beat PDFs. The compounding citation moat.

5. **GOAT-BEEHIVE-ARCHITECTURE.md** — The strategic playbook. 5 essential bee archetypes mapped to COLE.

### Tier 2 — Voice and character

6. **VOICE.md** — Per-character voice + spelling. Banned/acceptable phrases.

7. **CHARACTERS.md (v8)** — Voice style guides per market. Gary=AU, James=UK tax, Tyler=US, Aroha=NZ, Fraser=CAN, Priya=Nomad. **All on taxchecknow only — characters do NOT cross sites.** Brand handle is @taxchecknow everywhere.

### Tier 3 — Operational state

8. **OPERATIONAL-STATE.md** — Living working file. How we operate today. Updated constantly. Sabrina URLs, prompt conventions, sprint mode rules.

9. **MASTER-BUILD-SHEET.md** — Current sprint progress. Block-by-block task tracking.

10. **SKILL.md** — 19+ Locked Rules. Audit-first. Plan-mode-before-edit.

### Tier 4 — Platform specifics (read when working that station)

- PLATFORM-LINKEDIN.md — J station (live)
- PLATFORM-TIKTOK.md — N station (Block 2 building)
- PLATFORM-INSTAGRAM.md — M station (Block 3A)
- PLATFORM-YOUTUBE.md — L station (Block 3B Shorts + 3D Long-form)
- PLATFORM-X.md — Q station (Block 3C)
- PLATFORM-REDDIT.md — O station (manual + 9+)
- PLATFORM-THREADS.md — secondary

### Tier 5 — Reference only (NOT authoritative)

- CHAT-A-ORIGINAL-DESIGN.md — Chat A's design intent. Reference only. Does NOT override LOCKED-LOOP-CLOSURE-SPEC.
- CHAT-A-YOUTUBE-PROMPTS.md — YouTube prompt library for future L-station builds.
- SESSION-11-STATE.md, SESSION-12-FULL-LOG.md, SESSION-13-FULL-LOG.md — historical session logs.

---

## THE 4-LAYER ARCHITECTURAL EVOLUTION (from LOCKED spec Section 11)

Build proceeds in this strict order. Do NOT parallelise. Each layer proves out before the next starts.

| Layer | Block | What it delivers | Status |
|---|---|---|---|
| **Layer 1** | Block 5 (Loop Closure Sprint) | 12 components: approval UI + J5 gating + Doctor cron + Scientist + B1/B2 brokers + K12 cron + multi-site readiness | NEXT (after Block 2) |
| **Layer 2** | Block 6.5 (Story Compounding) | B3 Story Refresher · K12+J6 signals → /stories/ updates · URL permanent · content compounds | After Layer 1 |
| **Layer 3** | Block 6.7 (Truth-Sync Engine) | product_changes table + cascade fan-out (calc/story/social/email) + product_versions + B3 urgent path · Stripe/Shopify pattern for tax/visa | After Layer 2 |
| **Layer 4** | Block 9+ (Automation) | RSS law detection + G7 email pipeline + computed priority + F1/F2 automation + E1-E4 research swarm | After Layer 3 |

**The North Star:** *"Self-updating business engine. Detects truth changes (law/market/customer) → updates products → updates content → updates marketing → updates customers."*

---

## DO NOT TOUCH list (preservation rules — non-negotiable)

These are LIVE on taxchecknow.com producing revenue. Touching them breaks the moat.

1. **Free calculator → Stripe checkout flow** — converting today, do not restructure
2. **$67 personalised tier + $147 full system tier** — signed-off pricing, locked
3. **Exit-intent popup designs** — operator-approved, visual designs locked
4. **GEO-optimized page layouts** — schema markup is what AI engines cite, do not change
5. **"Personalised report" language** — banned phrases (PDF, guide, ebook, course) are absolute
6. **47 product configs** — each has facts file + character mapping + pricing + calculator logic
7. **Calculator page email-capture component (Save box)** — operator-approved, DO NOT MODIFY. Live on every /[country]/check/[product] page. The first email-capture moment in the entire funnel.
8. **/stories/[slug] route** — THE MOAT. 1 PRIMARY CTA + max 2 secondary, FAQPage schema, authority citation. URL permanent, content compounds.
9. **/questions/[slug] route** — 5-question companion track per product. FAQPage schema mandatory.
10. **/gpt/[slug] route** — secondary CTA target.
11. **/llms.txt infrastructure** — sectioned Products/GPT/Stories/Questions, under 50 priority URLs.
12. **/robots.txt** — ALL AI bots welcomed (GPTBot, ClaudeBot, PerplexityBot). Citation moat depends on access.
13. **H1 Distribution Bee** (lib/distribution-bee.ts) — IndexNow + Google Indexing API + llms.txt update. Without this, AI engines don't know new pages exist.

---

## HARD RULES (from LOCKED spec Section 2)

11 rules nobody can violate without explicit operator approval:

1. **J5 must NEVER publish if approval_status NOT IN ('approved', 'auto_approved')**
2. **J8 (Scientist) changes exactly ONE variable per V2** — hook OR format OR CTA OR character (V2 hook → V3 format → V4 CTA → V5 character → V6 stop)
3. **B1 broker is the ONLY way V2s reach the calendar**
4. **B2 broker is the ONLY way lessons modify behaviour** — DATA-only mutation, never modifies prompts
5. **Every multi-site table has site_id AND RLS enabled** — no exceptions
6. **K12 segments by site_id strictly** — cross-site lesson promotion only when scope='platform_global' AND confidence ≥0.85 AND verified across ≥2 sites
7. **Every step writes to agent_log** — no silent operations
8. **No row overwriting** — all version mutations create new rows
9. **Cron functions are Vercel API routes** — NOT Supabase Edge Functions
10. **Auto-approval defaults to FALSE per site** — earned by performance data
11. **No content bee bypasses /stories/** — all adapter bees (J3, N3, M3, L3, Q3, G7 family) MUST read from canonical /stories/[slug] or content_jobs row before composing. Story is single source of narrative truth. Adapters adapt, never invent. Exception: pure data outputs (T2 receipts, calculator results)

---

## CHARACTER-SITE BINDING (NON-NEGOTIABLE)

At 50 sites, character contamination = catastrophic failure mode.

```
SITE: taxchecknow.com  
  /au products       → voice: Gary Mitchell        (Australian pub-Aussie)
  /uk products       → voice: James Hartley        (dry British, factual)  
  /us products       → voice: Tyler Brooks         (direct, fintech-literate)
  /nz products       → voice: Aroha Tane           (down-to-earth, practical)
  /can products      → voice: Fraser MacDonald     (measured, factual)
  /nomad products    → voice: Priya Sharma         (international, treaty-aware)

SITE: theviabilityindex.com (FUTURE — Block 7+)
  Characters: NEW characters per market, NOT Gary/James/etc.
  TBD when site #2 launches.

SITE: cryptochecknow.com (FUTURE — Block 7+)  
  Characters: NEW characters per crypto-jurisdiction.
  TBD when site #2 launches.
```

**Critical:** Characters are voice STYLE guides per market within taxchecknow. Brand handle is @taxchecknow everywhere. Gary, James, etc. appear in stories as **named case studies (third-person, brand-narrated)** — NOT as first-person personas with their own accounts.

If theviabilityindex needs an AU visa voice, NEW character required. Reuse of taxchecknow characters on other sites = drift incident.

---

## SCOPE DISCIPLINE — DO NOT VIOLATE

These items are explicitly OUT OF SCOPE for current sprint:

- ❌ Auto niche discovery (O1/O2/O3) — Block 8+
- ❌ Auto product build (F-station full automation) — Block 8+
- ❌ Funnel optimization bees (S1/S2/S3) — Block 10+
- ❌ Supabase Edge Function triggers — we use Vercel cron
- ❌ K13 prompt mutation — explicitly rejected, B2 only mutates data
- ❌ Auto-approval as default — earned, not assumed
- ❌ Story OS as primary architecture term — current terminology is sharp enough
- ❌ Soverella as third public site — confusion was rejected
- ❌ Adding "1 product → 3 variants max" rule — premature, validate empirically

If new architecture work is proposed: STOP. Re-read LOCKED-LOOP-CLOSURE-SPEC. The architecture is final. Build within it.

---

## CRITICAL DRIFT INCIDENTS — DO NOT REPEAT

This session (14) caught significant scope-loss risks resolved:

1. **Voice/character canonical refs missing** → Section 0 expanded with 12 canonical files
2. **/stories/ + /questions/ + /gpt/ + llms.txt + H1 Distribution Bee infrastructure missing from spec** → 8 preservation rules added
3. **Email system entirely missing** → G7 family expanded, T2 audit card written, full email lifecycle in dashboard
4. **CTA structure ambiguity** → 1 PRIMARY + max 2 SECONDARY (never more than 3 total) locked
5. **G5 dual output not in flow diagram** → Section 1 updated to show Story Object + Derivation Map split
6. **YouTube not split** → Shorts (Block 3B) and Long-form (Block 3D) now separate lifecycles
7. **Reddit missing from lifecycles** → added with SABRINA-PLAYBOOK governance
8. **Master Conveyor Belt missing** → "Create New Site" lifecycle added (28 stages, 4 Queens explicit)

**If next session feels like it's drifting — STOP. Re-read this file. Then re-read LOCKED-LOOP-CLOSURE-SPEC.**

---

## OPERATOR'S OWN WORDS (verbatim guidance)

From session 14:

1. *"this is my build evolution going forward, this is the bible of my business so go ahead, this stays the truth and any future updates will have to make sure this works with my flowchart"* (re: dashboard)

2. *"we building everything now so our documentation needs to be 100% on point for no scope creep so we can be done asap"*

3. *"the passage has to be built to get to the back door from the front door from day 1"* (re: even when manual, document the full flow)

4. *"we must never lose the actual gold which is personalised product so all the stories are there to convince and make them understand they need they personalised data for there own situation"*

5. *"Gary is only taxchecknow.com/au character... at 50 sites it never confuses the story and character to the wrong site"*

From earlier sessions:

6. *"You the first chat to cause such big design drift"* (warning)
7. *"We sticking to the rollout order"*
8. *"We start posting as soon as its live, we dont wait 3 weeks"*

---

## BLOCK SEQUENCE — what's coming

```
Block 1 ✅ DONE         — Content Foundation (LinkedIn autonomous live since May 1)
Block 2 🟡 IN PROGRESS  — TikTok pipeline (~17% done · Task 2.0e mid-flight)
Block 3.5 ⏳ NEXT URGENT — Email System Audit + T2 Wiring (Card B-EMAIL-AUDIT-1)
Block 5 ⏳ AFTER BLOCK 2 — Loop Closure Sprint (~12 hr · 12 components)
Block 6.5 ⏳            — Story Compounding (~6 hr · B3 Story Refresher)
Block 6.7 ⏳            — Truth-Sync Engine (~10-12 hr · cascade fan-out)
Block 7 ⏳              — Multi-site activation (Site #2 launches)
Block 9+ ⏳             — Automation (RSS detection, full G7 pipeline, F1/F2)
```

---

## WHAT TO DO IN A NEW CHAT

### Step 1 — Read in priority order

LOCKED-LOOP-CLOSURE-SPEC.md → cole-bee-dashboard.jsx (open Lifecycle Viewer → Master Conveyor) → CUSTOMER-taxchecknow.md → USER-SKILL.md → MASTER-BUILD-SHEET.md → OPERATIONAL-STATE.md

### Step 2 — Identify current sprint task

Check MASTER-BUILD-SHEET.md for current Block 2 task status. Don't start anything new — finish what's mid-flight.

### Step 3 — Respect the locks

- Architecture is locked → don't propose changes
- Live products are locked → don't refactor
- Character bindings are locked → don't reuse across sites
- Hard Rules 1-11 are locked → don't violate

### Step 4 — Build using audit-first

Every action: grep brain first, verify schema, read existing code, then write.

### Step 5 — If stuck, ask the operator

Don't propose architecture. Don't redesign. Don't speculate. **If the locked spec doesn't answer the question, surface the gap and ask.**

---

## DEFERRED WORK — DOCUMENTED, NOT FORGOTTEN

These items are KNOWN, DOCUMENTED, and DELIBERATELY DEFERRED. Future chats should NOT re-propose, re-discover, or re-design these — they're tracked here and slot in at their designated block.

### Future cards (do NOT propose as new work)

| Item | When | Reason for deferral |
|---|---|---|
| **CARD-B-EMAIL-AUDIT-1** (T2 verification) | Anytime — runs in parallel with build | Independent audit, Session B 15-30 min |
| **CHARACTERS.md site-character binding update** | Operator action when slot | Small (~15 min) — operator-managed canonical doc |
| **MASTER-BUILD-SHEET.md update** | Operator action when slot | Block 5/6.5/6.7/7/9+ sequencing per locked spec |
| **EMAIL-SYSTEM-SPEC.md** | Block 4 prerequisite | Waiting on T2 audit verdict + Q2/Q3/Q4 from operator |
| **CONTENT-DERIVATION-SPEC.md** | Block 3 prerequisite | Per-platform derivation rules · drafted when M/L/Q stations build |
| **PRODUCT-BUILD-PATTERN.md** | Block 7 prerequisite | Session B audits live taxchecknow code and documents pattern · before site #2 launches |
| **CHARACTER-SERIES-SPEC.md** | Block 6.5+ | Brand strategy doc · "fluid per niche" naming · cinematic narrator format |
| **STORY-REFRESH-SPEC.md** | Block 6.5 | Designed when Block 5 ships and data flows |
| **TRUTH-SYNC-ENGINE-SPEC.md** | Block 6.7 | Designed when Block 6.5 ships |
| **Pre-Chat-A retirement questions** (10 prepared) | Defer to actual Chat A retirement moment | Operator-managed timing |

### Dashboard instrumentation — Block 5 Component 11.5 (NEW)

ChatGPT proposed adding state/blockers/ownership/throughput/triggers to dashboard stages. **All deferred** to Block 5 C11.5 because:
- 13 of 15 lifecycles are SPEC_ONLY → throughput data doesn't exist yet
- Static React component → can't query Supabase live without architectural change
- ChatGPT's own caveat: "instrument LinkedIn + stories first when data flows"

When Block 5 ships and data flows, instrument LinkedIn first as proof-of-pattern. Then expand per platform.

Items deferred:
- `stage_status` field (running/blocked/waiting_approval/complete/failed)
- `block_reason` + `block_owner` per blocked stage
- `owner_type` per stage (human/bee/queen)
- `items_in_stage` + `avg_time_in_stage` throughput metrics
- `trigger_in` / `trigger_out` per stage (REJECTED — redundant with existing flow arrows)

### Locked Rules pending promotion

- D51-D58 (drift incidents) → awaiting operator approval as Locked Rules #20-26

### Block 3.5 — Email System Audit + T2 Wiring

URGENT priority once Card B-EMAIL-AUDIT-1 verdict is in:
- If T2 broken: immediate fix sprint (~3-5 hr)
- If T2 works: full G7 build proceeds at Block 4 normally
- Either way: T2 audit must complete before EMAIL-SYSTEM-SPEC.md drafted

---

## DELIVERABLES IN THIS BRAIN

Canonical files updated as of Session 14:
- ✅ LOCKED-LOOP-CLOSURE-SPEC.md (956 lines, v1.0)
- ✅ cole-bee-dashboard.jsx (1,951 lines, 15 lifecycles)
- ✅ README-NEXT-CHAT.md (this file)
- 🟡 CHARACTERS.md (v8 + pending site-character binding update — operator action)
- ✅ CUSTOMER-taxchecknow.md (v8 May 2 2026)
- ✅ USER-SKILL.md, GOAT-BEEHIVE-ARCHITECTURE.md, VOICE.md
- ✅ Platform manuals (LINKEDIN, TIKTOK, INSTAGRAM, YOUTUBE, X, REDDIT, THREADS, RESEARCH)
- ✅ SABRINA-PLAYBOOK.md
- ✅ ROLLOUT.md, SYSTEM-MANUAL.md
- ✅ Session logs (11/12/13)
- ✅ MASTER-BUILD-SHEET.md (current sprint tracking)

---

## ENDING THOUGHT

Per ChatGPT (and operator-confirmed): *"Your biggest risk is no longer bad architecture. It is never seeing the system actually run."*

Architecture is locked. Documentation is locked. **Time to build, not to keep designing.** Block 2 finishes. Then Block 5 ships. Then the system runs end-to-end.

If you're in a new chat and you've read this file — you have what you need. Do not propose new architecture. Build against the spec. Honor the preservation rules. When the system runs, every operator decision becomes data, and the system learns.

**The bible is written. Now we follow it.**
