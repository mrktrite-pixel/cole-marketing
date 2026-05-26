# COLE Architecture — Locked (Day 13)

**Date locked:** 16 May 2026
**Session:** Day 13 — Strategic Queen Redesign through full hive re-architecture
**Operator:** Matt V
**Status:** Foundation document. Supersedes earlier architectural assumptions in Day 12 walking ledger. Do not re-debate without explicit operator decision.

---

## Purpose of this document

This document captures the locked architectural decisions from Day 13's session. It exists so the next session — and any future operator or AI working on COLE — can start from settled ground rather than re-debating fundamentals.

Anything not in this document is either:
- A lower-level design decision still to be made (see §10 Deferred Items), OR
- An implementation detail subordinate to these decisions

Anything in conflict with this document supersedes earlier documents (Day 12 walking ledger, technical-design pub-test pages, etc.).

---

## §1 — What COLE is, in one sentence

> COLE is a marketing operating system that **Converts, Operates, Learns, and Executes** autonomously across multiple niches, run by one human operator.

**CO·LE** is the acronym AND the organising principle. Every health indicator at every level rolls up to one of these four verbs. The operator dashboard leads with the four verbs. Queens and bees are the mechanism beneath.

| Verb | What it means | Primary queens responsible |
|---|---|---|
| **Converts** | Free visitors → paying customers; demand → revenue | Distribution + Concierge |
| **Operates** | Day-to-day execution without operator babysitting | Governance + Concierge |
| **Learns** | Methodology compounds; each hive starts smarter than the last | Adaptive + Orchestrator |
| **Executes** | Ships products and content; not just plans/analyses | Production + Distribution |

Strategic Queen sits **upstream** of all four — she feeds the system by finding what to build, but doesn't herself perform any of the four verbs. She's the "what." The other queens perform the "how."

---

## §2 — Constitutional principles (the seven locks)

Every future architectural decision tests against these. If a proposal violates one, it is rejected by default. If it appears to require violation, the principle itself must be reconsidered explicitly before adoption.

### Principle 1 — Whoever made it owns it for life

If a queen produces a thing, she owns its persona, its revisions, its deprecation, its source verification, its lifecycle emails about it, its cross-references, its trust signals.

No queen revises another queen's work. They emit events that say "your work needs attention," and the responsible queen handles it herself.

This eliminates the "kids' telephone game" — information degrading through repeated hand-offs.

### Principle 2 — Each queen self-monitors via pings on her own outputs

Every queen runs a scheduled ping cadence on whatever she produced. Diffs emit events. Events route through a shared event bus to whichever queen's handler is responsible.

Same pattern at every level:
- Strategic pings demand signal for existing topics
- Production pings her products' authority URLs and health
- Distribution pings her published assets' liveness
- Concierge pings her sequences' deliverability and customer state
- Adaptive pings her metric baselines for anomalies
- Governance pings infrastructure (DB sizes, secret ages, costs, quotas)

The ping is the universal "is everything still as I left it?" function. Cheap to run. Most pings return ✓ and nothing fires.

### Principle 3 — Each hive is flat internally; no AI middle-management

Within one hive, the six queens are peers. There is no Empress/CEO queen above them inside a hive.

The operator is the strategic layer. The queens execute autonomously within bounds and escalate to the operator when configured gates fire.

This preserves the operator's judgment as the actual moat. Delegating final strategic judgment to an AI would convert COLE into a generic content farm.

### Principle 4 — Each queen passes the TrustMRR pub test as a standalone product

Every queen has a real-world equivalent doing $50k+ MRR as its own business. If a proposed queen role doesn't, she's not a queen — she's a feature inside another queen.

The verified analogs:

| Queen | Standalone TrustMRR analog |
|---|---|
| Strategic | AEO Engine ($52k), IdeaProof, Niches Hunter, Trend Seeker |
| Production | SEOBOT ($64k), programmatic SEO services |
| Distribution | Postiz ($115k), Repurpose.io, OpusClip |
| Concierge | Intercom ($1B+), Customer.io, Klaviyo |
| Adaptive | Cometly ($207k), Datafast, Simple Analytics |
| Governance | Cronitor, Datadog, Vanta, Better Stack |
| Apiary Strategic | (cross-niche scout — methodology-as-a-service) |
| Orchestrator | Cross-domain methodology curation (Notion AI-class) |

### Principle 5 — Per-hive isolation; federated visibility

Each hive owns its own metrics table. Each queen in that hive writes to her hive's table. Each hive's Governance Queen publishes a summary to a global summaries table read by the operator's top-level Monitor view.

This isolates failures (a misbehaving queen in one hive doesn't corrupt 19 other hives' data) while preserving operator visibility across all hives.

Drill-down: Apiary → Hive → Queen → Asset. Each level reads from the closest-scoped data. No level scans across hives except the Apiary level reading the small summaries table.

### Principle 6 — Domain expertise stays in-hive; methodology propagates cross-hive

Tax-specific knowledge (ATO interpretation, foreign-resident emotional patterns, AU pricing tiers) stays inside Tax Hive forever.

Generic methodology ("5-input calculators convert 47% better," "FAQ headers using Bing grounding query phrases boost citation rate 2.1x") gets curated by the Orchestrator and rolled into the Vanilla template for every future hive.

This is the compounding moat. New hives inherit COLE's accumulated methodology while building their own proprietary domain expertise.

### Principle 7 — Design backwards from the outcome

When designing any queen's bees, start from her required output (handoff schema, dashboard fields, customer deliverables). Work backwards:
1. What must she deliver?
2. What does each field of that deliverable require to produce?
3. Which bee owns producing each input?
4. Which API/source/method does each bee call?

The bees fall out of the requirements. Never the reverse. Bees that don't produce a required output do not exist.

This methodology governs all queen-by-queen design sessions going forward.

---

## §3 — The three operator levels

COLE has three nested operator scopes. The operator navigates between them via the dashboard site selector and queen-card drill-down.

```
                    OPERATOR (you)
                          │
                          ▼
          ┌───────────────────────────────┐
          │          🐝 APIARY             │   LEVEL 1 — Meta / cross-hive
          │  (selected from "Bee Farm"     │
          │   option in site dropdown)     │
          └───────────────────────────────┘
                          │
                          │ contains workshop for ALL hives
                          ▼
        ┌────────────┬────────────┬────────────┐
        │            │            │            │
        ▼            ▼            ▼            ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    LEVEL 2 — Hive
   │Tax Hive │ │Visa Hive│ │Property │ │ Future  │    (per customer-facing site)
   │         │ │(future) │ │ Hive    │ │  Hive   │    (selected from site dropdown)
   └─────────┘ └─────────┘ └─────────┘ └─────────┘
        │
        │ each hive contains six queens
        ▼
   ┌────────────────────────────────────────────────────┐
   │  Strategic  Production  Distribution               │
   │  Concierge  Adaptive    Governance                 │   LEVEL 3 — Queen panel
   │                                                     │   (click any queen card)
   │  Click any queen card → her panel:                 │
   │    Heartbeat | Escalations | Approvals pending |   │
   │    Settings | History | Run-now controls           │
   └────────────────────────────────────────────────────┘
```

### Site selector dropdown structure

```
┌──────────────────────────────┐
│  🐝 Bee Farm (Apiary)        │  ← Level 1
│  ────────────────────────    │
│  taxchecknow                 │  ← Level 2 (Tax Hive)
│  visacheck (future)          │  ← Level 2 (Visa Hive)
│  propertycheck (future)      │  ← Level 2 (Property Hive)
│  ...                         │
└──────────────────────────────┘
```

The Apiary is NOT a customer-facing URL. It's the operator workshop where cross-hive concerns live.

---

## §4 — Level 1: The Apiary (Bee Farm)

The Apiary is the meta-control plane. It contains:

```
┌─────────────────────────────────────────────────────────────┐
│  🐝 APIARY — Bee Farm                                        │
│  Meta-control for COLE — operations across all hives         │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  CO·LE HEALTH (cross-hive)                          │   │
│  │  CONVERTS  OPERATES  LEARNS  EXECUTES               │   │
│  │   🟢        🟢        🟡       🟢                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  APIARY STRATEGIC QUEEN                              │   │
│  │  "What new niche should COLE add?"                  │   │
│  │                                                       │   │
│  │  Pending hive opportunities:                         │   │
│  │   — Visa compliance (AU/US/UK)  score 8.4           │   │
│  │   — Crypto tax (multi-juris)    score 7.8           │   │
│  │   — Property tax (AU/UK)        score 7.1           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  COLE ORCHESTRATOR                                   │   │
│  │  Cross-hive intelligence + methodology curator       │   │
│  │                                                       │   │
│  │  Active hives:    1 (taxchecknow)                    │   │
│  │  Total ARR:       $X                                 │   │
│  │  Total cost/mo:   $X                                 │   │
│  │  Pending generic learnings: 3 awaiting approval      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  VANILLA TEMPLATE                                    │   │
│  │  Master hive blueprint                               │   │
│  │  Version v3.2  ·  Inherited by 1 hive               │   │
│  │  Pending backports from active hives: 4 candidates   │   │
│  │  [ View ]  [ Edit ]  [ Diff vs Tax Hive ]           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  CLONE NEW HIVE                                      │   │
│  │  Spin up new hive from Vanilla                       │   │
│  │  [ + New Hive ]                                      │   │
│  │  Recent: taxchecknow (cloned 2026-04-22)             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ACTIVE HIVES                                        │   │
│  │  Tax Hive (taxchecknow)  🟢  $X MRR  47 products    │   │
│  │  ...                                                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Apiary residents

#### Apiary Strategic Queen
- **Job:** Scout the world for new NICHE opportunities (not new topics within an existing niche — those are hive-level Strategic Queens' job).
- **Output:** Ranked list of new hive opportunities. "Build a Visa Hive — here's the demand evidence."
- **Operator gate:** You approve before any hive cloning occurs.
- **Scope:** Operates above all hives. Not scoped to any one domain.

#### COLE Orchestrator
- **Job:** Cross-hive aggregation + methodology curation.
- **Aggregation:** Reads each hive's published summary, renders cross-hive financial + operational view.
- **Curation:** Classifies learnings as generic (broadcast to all hives via Vanilla update) or domain-specific (stays in originating hive).
- **Operator gate:** You approve before generic learnings are pushed to Vanilla.
- **Scope:** Operates above all hives. Becomes more important with each hive added.

#### Vanilla Template
- **Job:** Inspectable, versioned master blueprint that new hives clone from.
- **Contents:** Schemas, default configs, base queens (with placeholder personas), generic methodology learnings, integration patterns.
- **Update path:** Orchestrator proposes updates (from approved generic learnings or operator edits). Operator approves. New version published. Existing hives can opt-in to backport changes.

#### Clone New Hive
- **Job:** Workflow to instantiate a new hive from Vanilla. (Detailed onboarding flow is deferred — see §10.)

#### Active Hives Summary
- **Job:** At-a-glance health indicator for each operating hive. Click any hive → switches site selector to that hive's Level 2 view.

---

## §5 — Level 2: The Hive (six queens per niche)

Each hive serves one niche (Tax, Visa, Property, etc.). It contains six peer queens, all flat — no in-hive hierarchy.

```
┌─────────────────────────────────────────────────────────────┐
│  HIVE — e.g. Tax Hive (taxchecknow)                          │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  CO·LE HEALTH (this hive)                            │   │
│  │  CONVERTS  OPERATES  LEARNS  EXECUTES               │   │
│  │   🟢        🟡        🟢       🟢                    │   │
│  │  $4.2k/mo  1 alert   +12      3 builds              │   │
│  │  +18% MoM            cards    in flight             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  Six peer queens (click to drill into Level 3):              │
│                                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │Strategic │ │Production│ │Distribut.│                    │
│  │  👑      │ │  🏗      │ │   📡     │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │Concierge │ │ Adaptive │ │Governance│                    │
│  │  💌      │ │   📊     │ │   🧹     │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

### The six queens — role specs at the role level

(Bee-level specs come in queen-by-queen sessions; see §10.)

#### 👑 Strategic Queen
- **One-line job:** "What should we build next within this hive's domain?"
- **Job in CO·LE:** Upstream of all four verbs. Feeds the system.
- **Continuous function:** Scans demand signals (Bing AI Performance, Gemini grounding, ChatGPT/Perplexity citations, YouTube). For each find: site auditor checks "do we have this?" → routes either BUILD_NEW or PANELBEAT to Production Queen, or ignores.
- **Owns:** The demand-detection recipe + the site catalogue audit logic.
- **Operator gate:** You approve new build_new requests before Production Queen acts.
- **TrustMRR analog:** AEO Engine ($52k), IdeaProof, Niches Hunter, Trend Seeker.

#### 🏗 Production Queen
- **One-line job:** "Build this product end-to-end, correctly, in the right voice."
- **Job in CO·LE:** Executes; contributes to converts (the product is the conversion asset).
- **Scope per assignment:** Narrow and deep. One topic at a time. She receives a handoff from Strategic Queen and does ALL research and writing for that one topic.
- **Owns:** Persona selection, calculator design, page content, FAQ, authority verification (her own URL pings), trust ledger, related-product map, transactional emails (post-Stripe delivery, immediate confirmation), product deprecation.
- **Operator gate:** You approve before publishing to live.
- **TrustMRR analog:** SEOBOT ($64k), programmatic SEO services.

#### 📡 Distribution Queen
- **One-line job:** "Amplify the finished product to broadcast channels."
- **Job in CO·LE:** Executes + converts (broadcast drives traffic).
- **Scope:** Reads Production Queen's finished products. Regurgitates into channel formats: YouTube video script, social posts, newsletter blast, LinkedIn variant, TikTok hook.
- **Owns:** Published assets' liveness (pings), channel-specific reformatting, broadcast email (newsletter, "we just published X").
- **Critical line:** Broadcast only. 1:1 customer messages are Concierge's job. (Test: does the message exist because of a publishing event or a customer event? Publishing event → Distribution.)
- **Operator gate:** Configurable — auto-publish small assets, gate large campaigns.
- **TrustMRR analog:** Postiz ($115k), Repurpose.io, OpusClip.

#### 💌 Concierge Queen
- **One-line job:** "Be the 1:1 voice of the business to individual customers."
- **Job in CO·LE:** Converts + operates.
- **Scope:** Triggered by customer events (purchase, dormancy, anniversary, support inbound). NOT broadcast.
- **Owns:** Lifecycle email sequences (day-14 review, day-60 reactivation, cross-pollination, renewal), customer support replies, eventual chatbot conversations, refund handling, comment replies on socials (1:1 engagement).
- **Phase 0-1 reality:** Lifecycle email sequences only.
- **Phase 2-5 growth:** Chatbot, support triage, proactive outreach.
- **Operator gate:** Configurable — auto-run approved sequences, gate new sequence templates.
- **TrustMRR analog:** Intercom ($1B+), Customer.io, Klaviyo.

#### 📊 Adaptive Queen
- **One-line job:** "What's working, what's not, why, and what should change?"
- **Job in CO·LE:** Learns (per-hive).
- **Scope:** Reads from the hive's shared metrics table (which other queens write to). Looks for patterns across queens' outputs. Emits feedback cards routed to the responsible queen.
- **Owns:** Cross-queen pattern detection, performance diagnosis, feedback card production. Owns NO customer-facing content. She is the editor/teacher who marks the work.
- **Operator gate:** None — she only produces feedback. The responsible queen decides whether to act.
- **TrustMRR analog:** Cometly ($207k), Datafast, Simple Analytics.

#### 🧹 Governance Queen
- **One-line job:** "Keep this hive running cleanly."
- **Job in CO·LE:** Operates.
- **Scope:** Infrastructure for THIS hive. Renders the hive's operator dashboard. Publishes hive summary to global summaries table for Apiary visibility.
- **Owns:** DB hygiene (table sizes, vacuum, indexes), cron orchestration, secret rotation, cost monitoring (LLM API spend, hosting, etc.), audit trail, quota management, backup verification, the hive's operator dashboard.
- **Operator gate:** Configurable — auto-run janitorial work, gate secret rotation and policy changes.
- **TrustMRR analog:** Cronitor, Datadog, Vanta, Better Stack.

---

## §6 — Level 3: The Queen panel (drill-down)

Each queen card on the Hive view → click → her individual panel. Already partially built in soverella.com/dashboard/monitor.

```
┌─────────────────────────────────────────────────────────────┐
│  ← Monitor                                                   │
│                                                               │
│  👑 Strategic Queen          RESEARCH DIRECTOR    [Run now]  │
│  "What should we build next?"                     [Pause]    │
│                                                  [Settings]  │
│                                                               │
│  🟢 Strategic Queen alive                                     │
│                                                               │
│  LAST FIRED   RUNS (24H)   COST (24H)   NEXT FIRE            │
│  5h ago       1            $0.0517      06:00 UTC            │
│                                                               │
│  ──────────────────────────────────────────                  │
│                                                               │
│  ESCALATIONS                                                 │
│  (queen-specific things requiring operator decision)         │
│                                                               │
│  ──────────────────────────────────────────                  │
│                                                               │
│  APPROVALS PENDING                                  6 PENDING│
│  (queen-specific approval gates)                             │
│                                                               │
│  ▸ [Item with Approve / Reject buttons]                      │
│  ▸ ...                                                       │
│                                                               │
│  ──────────────────────────────────────────                  │
│                                                               │
│  HISTORY / SETTINGS / RUN DETAILS                            │
└─────────────────────────────────────────────────────────────┘
```

This is the operator's working surface for one queen. Per-queen specifics of what shows in each section is deferred to queen-by-queen design sessions.

---

## §7 — Data flow across the architecture

The architecture has no direct queen-to-queen calls. All communication goes through:

1. **Published output tables** (handoffs, products, publications, feedback cards, metrics)
2. **Shared event bus** (pings emit events; events route to handlers)

```
                          OPERATOR
                              │
                              │ approves gates, reads dashboards
                              ▼
   ┌─────────────────────────────────────────────────────┐
   │  STRATEGIC QUEEN                                     │
   │  reads:  signal sources (Bing AI Performance,        │
   │          Gemini grounding, ChatGPT, Perplexity,      │
   │          YouTube), site catalogue                    │
   │  writes: strategic_queen_handoffs                    │
   └─────────────────────────────────────────────────────┘
                              │
                              │ Strategic handoffs
                              ▼
   ┌─────────────────────────────────────────────────────┐
   │  PRODUCTION QUEEN                                    │
   │  reads:  strategic_queen_handoffs                    │
   │  her bees fire scoped to the assignment              │
   │  pings:  her products' authority URLs, health        │
   │  writes: products, transactional_emails              │
   └─────────────────────────────────────────────────────┘
                              │
                              │ finished products
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
   ┌────────────┐    ┌────────────┐    ┌────────────┐
   │DISTRIBUTION│    │ CONCIERGE  │    │  ADAPTIVE  │
   │   QUEEN    │    │   QUEEN    │    │   QUEEN    │
   │            │    │            │    │            │
   │reads:      │    │reads:      │    │reads:      │
   │ products   │    │ products,  │    │ all queens'│
   │            │    │ purchase   │    │ metrics    │
   │writes:     │    │ events     │    │            │
   │ broadcast  │    │            │    │writes:     │
   │ pubs       │    │writes:     │    │ feedback   │
   │            │    │ 1:1        │    │ cards      │
   │pings:      │    │ messages,  │    │            │
   │ asset      │    │ sequences  │    │pings:      │
   │ liveness   │    │            │    │ metric     │
   │            │    │pings:      │    │ baselines  │
   │            │    │ deliver-   │    │            │
   │            │    │ ability    │    │            │
   └────────────┘    └────────────┘    └────────────┘
            │                 │                 │
            └─────────────────┼─────────────────┘
                              │ feedback cards
                              ▼
   ┌─────────────────────────────────────────────────────┐
   │  GOVERNANCE QUEEN                                    │
   │  reads:  this hive's metrics table, infrastructure  │
   │  pings:  DB sizes, costs, secrets, quotas, backups  │
   │  writes: hive_metrics summary → Apiary global table │
   │          operator_alerts, audit_log                  │
   │  renders: this hive's operator dashboard             │
   └─────────────────────────────────────────────────────┘
                              │
                              │ hive summary
                              ▼
   ┌─────────────────────────────────────────────────────┐
   │  APIARY (cross-hive)                                 │
   │  Apiary Strategic + Orchestrator + Vanilla           │
   │  reads:  all hives' summaries                        │
   │  writes: vanilla_updates, new_hive_seeds             │
   └─────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────┐
   │  EVENT BUS (shared infrastructure)                   │
   │  All queens emit events on ping diffs.               │
   │  Events route to whichever queen owns the handler.   │
   │  Dumb storage + router. No agency.                   │
   └─────────────────────────────────────────────────────┘
```

### Metrics flow (federation pattern)

```
Each queen in Tax Hive  →  tax_hive_metrics (per-hive table)
                                   │
                                   ▼
                          Tax Governance Queen reads, renders Tax Hive dashboard
                                   │
                                   ▼
                          publishes summary → global_hive_summaries
                                   │
                                   ▼
                          Apiary Orchestrator reads, renders cross-hive Monitor
```

Failure modes by design: a corruption in `tax_hive_metrics` only blinds Tax Hive's dashboard. Other hives operate normally. The global summary table is small (one row per hive) and rarely written — minimal failure surface.

---

## §8 — Source strategy (Reddit-free, AI-receipt-grounded)

Strategic Queens (Apiary + per-hive) do NOT depend on Reddit's API. The Reddit API was effectively closed for commercial use through 2025–2026 (GummySearch shutdown is the textbook case).

Instead, Strategic Queens read **the receipts that AI engines already produce when they cite Reddit + YouTube + Quora + everywhere**:

| Source | What it gives us | Access pattern |
|---|---|---|
| Bing AI Performance Dashboard (Bing Webmaster Tools) | Grounding queries that triggered citations to your site, page-level citation activity, visibility trends | Free; manual dashboard read (no API yet as of May 2026); page scrape or export |
| Gemini API with `tools: [{ googleSearch: {} }]` | `groundingMetadata` field: web sources cited, `webSearchQueries` (the fan-out sub-queries Gemini ran internally) | Paid API, cheap per call |
| ChatGPT API with web_search tool | URL citations in response | Paid API |
| Claude API with web_search tool | Similar pattern | Paid API |
| Perplexity API | Returns cited sources inline with answers | Paid API |
| YouTube Data API v3 | Comments on top-cited videos, transcripts, video search | Free 10k quota units/day |
| StackExchange API | Tax SE, Money SE, Personal Finance SE | Free, rate-limited |
| Quora | Public scraping (rate-limited, respectful) | Free with rate limits |

**The key insight:** AI engines already synthesize Reddit + YouTube + Quora + LinkedIn + forums into their grounding metadata. Reading their grounding outputs gives you pre-synthesized signal without needing to source the underlying platforms.

YouTube as of 2026 has overtaken Reddit as the #1 social citation source in AI answers (16% vs 10% of LLM responses). YouTube Data API is open, free, stable — and is your primary direct-source for customer voice on a topic.

---

## §9 — Migration map: existing COLE code to new architecture

Items from Day 12's walking ledger and the existing soverella codebase re-mapped to the locked architecture.

| Existing element | Locked architecture home |
|---|---|
| E1 (current Strategic Queen bee, daily 04:04 UTC) | Stays in Strategic Queen as Demand Hunter, expanded with Bing/Gemini/YouTube |
| E2 Market Researcher (sub-bees scraping for customer questions) | Re-homed to **Production Queen** as Customer Voice Capturer, scoped per-build |
| E2a / E2b (Reddit-related sub-bees, currently blocked by WAF) | **Deprecated.** Reddit no longer on critical path. Capacity reused. |
| E2c StackExchange | Re-homed to Production Queen's Customer Voice Capturer |
| E2e-chatgpt / E2e-gemini | Re-purposed for both Strategic Queen (broad demand) and Production Queen (topic-scoped) |
| E3 Customer Psychologist | Re-homed to Production Queen |
| E4 Competitor Monitor | Re-homed to Production Queen as Competitor Auditor, scoped per-build |
| E7 Truth-Sync (ATO/HMRC RSS monitoring) | Stays as authority verification, but split: **build-time** instance lives in Production Queen; **continuous URL ping** lives in Production Queen's ongoing ping cycle |
| F1/F2/F3/F3b (Production Queen builder bees) | Stay in Production Queen; sequence/scope refined in queen-by-queen design |
| K12/K14 (Adaptive Queen pattern-learners) | Stay in Adaptive Queen, reframed as pattern detection on metrics table |
| Doctor-bee, D-bees (existing janitorial code) | Re-homed to **Governance Queen** |
| G5 Story Writer, J2/J3 LinkedIn bees (removed in Day 13 cron cleanup) | Future: belong to Distribution Queen when re-introduced; currently shelved |
| K20/K21 / V1 / governance-queen pub-test page | Belongs to Governance Queen panel work, deferred |
| Existing Concierge functionality | Currently absent. New queen, new build. Phase 0-1 priority: lifecycle email sequences. |
| Email campaigns (currently fragmented across various crons) | Re-home all to Concierge Queen, except Production-Queen-owned transactional emails (Stripe receipt, immediate delivery) |
| Existing `soverella/overlays/` configs | Stay; become per-hive config the Vanilla template can clone-with-overrides |
| `cluster-worldwide/taxchecknow/` (customer storefront) | Stays as-is — this is Tax Hive's customer-facing surface, separate from the control plane |
| `soverella/` (control plane / dashboard) | Stays as-is — this IS the operator dashboard renderer |

### Tier 1 fixes from Day 12 — re-evaluation

The 8 Tier 1 fixes drafted in Day 12 were scoped against the old architecture. Under the locked architecture:
- Fixes related to E2/E3/E4/E7 need re-evaluation in light of their re-homing
- Reddit-related fixes (HK #108 egress strategy, E2a/E2b shelved-bee fixes) are **deprecated**
- Other Tier 1 fixes (CRON_SECRET, cron cleanup, Pub Test page renames) were already executed in Day 13's operational batch

Full re-evaluation of remaining Tier 1 items belongs in a follow-up session before any further bee implementation.

---

## §10 — Deferred items (the boundary of what's locked)

Locked at the architecture level. NOT yet designed at the implementation level:

1. **Per-queen bee specs** — what each queen's internal bees produce and which sources they call. Approach: queen-by-queen sessions, design-backwards-from-outcome (Principle 7). Next session: Strategic Queen.

2. **New Hive onboarding workflow** — when "Clone New Hive" button is clicked, what is the full process? Includes: dashboard section provisioning, account setup docs (Bing Webmaster, Google APIs, YouTube channel, Stripe account, domain registration, Vercel project), integration checklists, character/persona configuration, jurisdiction-specific authority registry, initial product seeding. This is a substantial design session of its own.

3. **Handoff schemas between queens** — minimum-viable contract for each queen-to-queen interface. Five interfaces minimum (Strategic → Production, Production → Distribution, Production → Concierge, Adaptive → all, Governance → operator). Plus Apiary → hive flows.

4. **Operator gate configuration** — which actions require operator approval, which auto-execute, threshold knobs. Per-queen design.

5. **User-input capture as primary research** — the differentiator we named but didn't design. Adaptive Queen captures distribution of calculator inputs; Strategic Queen uses for demand validation; Production Queen uses for content refinement. Crosses queens — needs deliberate design.

6. **Apiary Strategic Queen specifics** — she's named at role level but her actual signal sources, scoring rubric for "this is a new niche worth a hive," and handoff schema to the Clone New Hive workflow all need design.

7. **Orchestrator's methodology curation mechanics** — how does a "generic learning" get classified vs domain-specific? Auto-classifier + operator approval? Pattern-detection across hives ("3 hives independently found this same thing")? Needs design.

8. **The trust ledger / verification display** — Production Queen owns it conceptually. Display format, ping cadence, and how it renders on the customer-facing page need design.

9. **Death certificate / deprecation workflow** — Production Queen owns it conceptually. Trigger conditions, 301 redirect strategy, archive vs hard-delete, customer notification via Concierge — needs design.

10. **Event bus implementation** — shared infrastructure; schema, durability, retry, dead-letter, ordering guarantees. Governance Queen owns; needs explicit technical design.

11. **Apiary Monitor dashboard** — at scale (5+ hives), what does the Apiary view actually show? Wireframe sketched in §4; production design deferred.

---

## §11 — How the four marketing pillars land

COLE is unique because almost no competitor product combines all four marketing pillars in one operator workflow:

```
   RESEARCH              BUILDING               DISTRIBUTION          CUSTOMER OPS
   ────────              ────────               ────────────          ────────────
   What gaps             Build the              Amplify across        Handle the
   exist? What           product that           channels to           customers it
   should we             answers them.          drive traffic.        attracts.
   build?
                                                                      Refunds, support,
   Strategic Queen       Production Queen       Distribution Queen    chatbot,
   Apiary Strategic                                                   lifecycle email.

                                                                      Concierge Queen


   And underneath ALL of them:                  Above them:
   MEASUREMENT (Adaptive Queen)                 META-CONTROL (Apiary)
   INFRASTRUCTURE (Governance Queen)            Orchestrator + Vanilla + scout
```

Standalone businesses in each pillar are doing $50k–$200k MRR on TrustMRR. COLE doing all four pillars under one operator is the category-of-one position.

The defensibility isn't in any single pillar — each is a known commodity. The defensibility is in the **integration** + the **cross-hive learning loop**, which no current competitor on TrustMRR's leaderboard combines.

---

## §12 — Closing principle

> The architecture is locked at the role level and the principle level. The bee level is open. Anything in this document that we discover, in practice, to be wrong gets revised explicitly and deliberately. Anything not in this document is open to design.

End of locked architecture document.

---

**Sign-off:** Day 13 session, 16 May 2026.
**Next session entry point:** Strategic Queen bee design (Principle 7 methodology — design backwards from the locked handoff outcome).
