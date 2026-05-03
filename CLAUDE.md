# COLE Marketing OS — Master Context
# Every Claude Code session in cole-marketing reads this first.

## What This System Is

An autonomous marketing brain for the COLE Citation Gap Commerce Engine.
Every piece of content has ONE job: send someone to a calculator page.

Not: build brand awareness
Not: get followers
Not: go viral
One job: person reads/watches/hears → recognises themselves
         → clicks link → runs free check → purchases

## The Stack

```
BRAIN:      Claude Code .claude/agents/ (native sub-agents)
MEMORY:     Supabase (shared across all sites)
CONTROL:    Soverella.com (visual dashboard)
PRODUCTS:   taxchecknow.com (46 live products)
PUBLISHING: Direct API calls (YouTube, LinkedIn, X, Meta)
INDEXING:   IndexNow + Google Indexing API
```

## Before Starting ANY Task

Read these files in order:
1. VOICE.md — brand voice, banned phrases, pub test
2. PLAN.md — plan before edit rule
3. CHARACTERS.md — who Gary/James/Tyler/Aroha/Priya/Fraser are
4. PRODUCTS.md — all 46 products with fear numbers
5. Check Supabase PERFORMANCE.md for what is working

## The Rollout Plan

Current station: see .claude/skills/cole-brain-final/ROLLOUT.md
Do not skip stations.
Do not build out of order.

## Sites

```
taxchecknow.com       → tax products (46 live)
theviabilityindex.com → visa/viability (Phase 7)
future sites          → queen decides based on topic
```

## OPERATOR APPROVAL PATTERN (current — until Soverella UI ships)

The Soverella content queue UI is not yet built. Until it ships, the
operator approval mechanism for any content_jobs row is a **direct
Supabase PATCH** changing `status` from its current value (typically
`pending_approval`) to `approved`:

```bash
PATCH /rest/v1/content_jobs?id=eq.[job-id]
Body: {"status": "approved"}
```

Bee implications:
- I1 campaign-conductor's `status=eq.approved` filter is the right
  filter — the PATCH is what flips it.
- I2 launch-manager's PATCH from `approved` to `launch_approved` is the
  next step in the chain after I1 has a calendar.
- When Soverella content queue UI ships (Station K or later), it will
  simply be a button that fires the same PATCH. **No bee spec changes.**
  Only the interface changes.
- The I1 conductor's status fallback rule (try `approved`, fall back to
  `pending_approval` and stamp calendar rows `draft_pending_approval`)
  remains the safety net for runs that happen before the operator
  fires the PATCH.

This documents what is otherwise an undocumented operator workflow.

## SITE CONTEXT

Every bee invocation must pass:
  site: taxchecknow (default)
All Supabase writes include site field.
All Supabase reads filter by site.

Future sites: viabilityindex, soverella

Tables that carry the `site` column (added 2026-04-30 migration):
  content_jobs, content_performance, campaign_calendar,
  hook_matrix, chaos_angles, research_questions,
  video_queue, email_templates, agent_log

Default for every existing row: 'taxchecknow'.
Bees that omit `site` on INSERT will get the default — but specs require
explicit pass-through so Soverella can route per-site analytics cleanly
once viabilityindex (Phase 7) and soverella (own marketing) come online.

## ENVIRONMENT VARIABLES

cole-marketing local development reads from `.env` (Supabase keys —
checked in earlier this session) and `.env.local` (additional secrets).
Both are gitignored. Production secrets live in Vercel.

**IMPORTANT — Vercel project naming:**
cole-marketing deploys as the **`soverella`** Vercel project (not
`cole-marketing`). When a bee spec references "Vercel project" for the
cole-marketing side, use `soverella`. The taxchecknow Vercel project
is its own deploy target.

### Required env vars (cole-marketing → Vercel project: soverella)

| Variable | Purpose | Required by |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | All bees |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role for server-side writes | All bees that write to Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key for client-side reads | Soverella dashboard client components |
| `BLOTATO_API_KEY` | Video generation + multi-platform publishing | G9 Video Producer, J5 LinkedIn Publisher (and future TT/IG/X publishers) |
| `INDEXNOW_KEY` | IndexNow ping key | H1 Distribution Bee (`879c5718e8ab4114a247c1b85552331a`) |
| `ANTHROPIC_API_KEY` | Claude API for LLM-tier bees | Bee Runner — `lib/bee-runner/anthropic.ts`. Orchestration-only bees skip cleanly when unset. Required for G3/G5/J3.5/K12/J1.5. |
| `CRON_SECRET` | Vercel Cron auth token | `app/api/cron/[bee]/route.ts` handlers (P2). All cron handlers reject requests without `Authorization: Bearer ${CRON_SECRET}`. |
| `ADMIN_API_KEY` | Manual bee invocation auth | `app/api/admin/run-bee/route.ts`. Distinct from CRON_SECRET so cron leaks don't grant manual-trigger access. Used by Soverella "Run Bee" panel + ad-hoc operator curl. |
| `GA4_SERVICE_ACCOUNT_KEY` | GA4 Data API service-account JSON (raw JSON string, not base64). Service account must have **Viewer** on the GA4 property. | K-Analytics-1 Doctor Bee (P5.5) — `lib/adapters/ga4.ts`. Without it, Doctor Bee logs `ga4_skipped: true` and skips calculator-visit attribution. |
| `GA4_PROPERTY_ID` | Numeric GA4 property id (digits only, no `properties/` prefix). | K-Analytics-1 Doctor Bee (P5.5) — `lib/adapters/ga4.ts`. Required alongside `GA4_SERVICE_ACCOUNT_KEY`. |

Future additions (not yet wired):
- `LINKEDIN_ACCESS_TOKEN` — direct LinkedIn API (if Blotato fallback needed)
- `BLOTATO_LINKEDIN_ACCOUNT_ID` — per-platform account id when LinkedIn connected
- `OPERATOR_EMAIL` — alert routing for time-critical agent_log notifications

### Where keys live

- **`.env`** (cole-marketing) — Supabase keys (committed to .gitignore line 3)
- **`.env.local`** (cole-marketing) — Blotato + Supabase consolidated for Next.js
  precedence (committed to .gitignore line 4)
- **`.env.local`** (taxchecknow) — Stripe + Resend + Supabase + Blotato
  (gitignored via `.env*` glob)
- **Vercel `soverella` project** — production source of truth for cole-marketing
- **Vercel `taxchecknow` project** — production source of truth for taxchecknow

When rotating any key: update Vercel FIRST, then both `.env.local` files,
then redeploy. Never commit a key to git — every existing `.env*` pattern
is `.gitignore`-protected, but specs that paste keys into commit messages
or PR descriptions are equally exposing.

## Token Routing — Non-Negotiable

```
TIER 0 — Free:    git, file ops, API calls, builds, URL checks
TIER 1 — Haiku:   format, resize, classify, select, check
TIER 2 — Sonnet:  write stories, scripts, articles, strategy
TIER 3 — Opus:    new product strategy, GOAT audits ONLY
Target: under $150/month total Claude API cost
```

## Character Assignment

```
AU products     → Gary Mitchell
UK products     → James Hartley
US products     → Tyler Brooks
NZ products     → Aroha Tane
CAN products    → Fraser MacDonald
Nomad products  → Priya Sharma
Visa products   → Priya Sharma
```

## UTM Structure

```
utm_source:   story|social_linkedin|social_x|social_instagram|
              social_tiktok|youtube|email|reddit|gpt_page
utm_medium:   article|post|video|email|comment
utm_campaign: [product-slug]
utm_content:  [character_name]_[topic]
```

## Supabase Tables (shared brain)

```
EXISTING:
  purchases, email_log, email_queue, leads,
  decision_sessions, email_templates

MARKETING OS (create in Station A):
  content_jobs, content_performance, hook_matrix,
  research_questions, psychology_insights,
  li_research, yt_research, ig_research, x_research,
  li_queue, yt_queue, ig_queue, x_queue,
  chaos_angles, campaign_calendar,
  competitors, agent_log
```

## The One Rule That Cannot Break

Read VOICE.md before generating ANY content.
No exceptions. Not even for one-line outputs.
