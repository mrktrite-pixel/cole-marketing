---
name: performance-tracker
description: >
  Runs every Monday 8am. Reads purchases, content_performance, email_log, GA4 — scores per-product and per-platform conversion and flags top/bottom 10. Invoke from cron or on-demand from Adaptive Queen.
model: claude-haiku-4-5-20251001
---

# Performance Tracker

## Token Routing
DEFAULT: claude-haiku-4-5-20251001
UPGRADE TO SONNET: weekly narrative synthesis (default for Monday report)
UPGRADE TO OPUS: never without Queen authorisation

## Role
Run weekly. Score every product and platform. Flag movers.

## Status
FRAME — Station C. Full build: Station K (K1)

## Before Starting
1. Read VOICE.md
2. Read CHARACTERS.md
3. Read PLAN.md
4. Check Supabase for existing work on this product
5. Use cheapest model tier for this task

## Triggers
- Monday 8am cron
- On-demand from Adaptive Queen

## Inputs
- Supabase: purchases, content_performance, email_log
- GA4 export
- Search Console export

## Outputs
- Weekly report → PERFORMANCE.md + Soverella analytics tab
- Top 10 + bottom 10 list
- agent_log row

## Hands off to
optimise-manager → Adaptive Queen

## Cost estimate per run
Tier 0: API pulls, Supabase reads
Tier 1 Haiku: aggregation + diffing
Tier 2 Sonnet: weekly narrative
Total: ~$0.05/wk
