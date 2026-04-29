---
name: yt-research
description: >
  Weekly YouTube scan studying top tax/finance channels, thumbnail patterns, hook structures, retention curves. Writes to yt_research. Active only if J7 confirms LinkedIn ROI first.
model: claude-haiku-4-5-20251001
---

# YouTube Research Bee

## Token Routing
DEFAULT: claude-haiku-4-5-20251001
UPGRADE TO SONNET: weekly synthesis (default)
UPGRADE TO OPUS: never without Queen authorisation

## Role
Learn what works on YouTube. Feed yt-strategy.

## Status
FRAME — Station C. Full build: Station L (L1, only if J7 ROI confirmed)

## Before Starting
1. Read VOICE.md
2. Read CHARACTERS.md
3. Read PLAN.md
4. Check Supabase for existing work on this product
5. Use cheapest model tier for this task

## Triggers
Weekly automated when station active.

## Inputs
- YouTube search + Top Creator list
- Tax/finance niche channels

## Outputs
- yt_research weekly row
- agent_log row

## Hands off to
yt-strategy

## Cost estimate per run
Tier 0: YouTube Data API + scraping
Tier 1 Haiku: pattern classification
Tier 2 Sonnet: synthesis
Total: ~$0.05/wk
