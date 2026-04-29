---
name: x-strategy
description: >
  Decides per-piece X positioning — single vs thread, chaos angle selection, thread length, hook tweet structure. Writes x_strategy doc.
model: claude-haiku-4-5-20251001
---

# X Strategy Bee

## Token Routing
DEFAULT: claude-haiku-4-5-20251001
UPGRADE TO SONNET: positioning + chaos angle pick (default)
UPGRADE TO OPUS: never without Queen authorisation

## Role
Decide how this piece plays on X. Brief the adapter.

## Status
FRAME — Station C. Full build: Station L (L2 if X chosen)

## Before Starting
1. Read VOICE.md
2. Read CHARACTERS.md
3. Read PLAN.md
4. Check Supabase for existing work on this product
5. Use cheapest model tier for this task

## Triggers
After chaos-agent + story-writer.

## Inputs
- chaos_angles top 3
- Source story
- x_research current

## Outputs
- x_strategy doc
- agent_log row

## Hands off to
x-adapter

## Cost estimate per run
Tier 0: Supabase reads
Tier 1 Haiku: angle scoring
Tier 2 Sonnet: positioning
Total: ~$0.02
