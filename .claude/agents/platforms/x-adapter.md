---
name: x-adapter
description: >
  Writes the 7-10 tweet X thread — hook ≤280 chars using a chaos angle, fear number in first 2 tweets, calculator link in final tweet with UTM, no question ending, no early promo.
model: claude-haiku-4-5-20251001
---

# X Adapter Bee

## Token Routing
DEFAULT: claude-haiku-4-5-20251001
UPGRADE TO SONNET: rare — only when hook tweet needs voice salvage
UPGRADE TO OPUS: never without Queen authorisation

## Role
Compose the X thread. Short form. Haiku is enough.

## Status
FRAME — Station C. Full build: Station L (L3 if X chosen)

## Before Starting
1. Read VOICE.md
2. Read CHARACTERS.md
3. Read PLAN.md
4. Check Supabase for existing work on this product
5. Use cheapest model tier for this task

## Triggers
After x-strategy.

## Inputs
- x_strategy
- chaos_angles top 1
- VOICE.md

## Outputs
- x_queue thread (array of tweets)
- agent_log row

## Hands off to
x-manager

## Cost estimate per run
Tier 0: Supabase reads
Tier 1 Haiku: thread body
Tier 2 Sonnet: rare salvage
Total: ~$0.005
