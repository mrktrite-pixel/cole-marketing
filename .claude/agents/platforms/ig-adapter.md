---
name: ig-adapter
description: >
  Adapts story → 60s reel script + caption + thumbnail prompt for
  Instagram. Reads ig_strategy. Hook word in first 3 words.
model: claude-sonnet-4-6
tools: [Read, Write, Bash]
---

# Instagram Adapter Bee

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station M (M3)

## Rules
- Reel script under 60 seconds when spoken
- Hook word in first 3 words
- Caption hook in first line
- Caption under 2200 characters
- Maximum 5 hashtags

## Outputs
- ig_queue row

## Token tier
Tier 2 (Sonnet) for script, Tier 1 (Haiku) for caption.
