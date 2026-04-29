---
name: yt-adapter
description: >
  Adapts the script + thumbnail + title + description for YouTube.
  Reads yt_strategy. Calculator URL above the fold in description.
  Chapter timestamps. End-screen link plan.
model: claude-sonnet-4-6
tools: [Read, Write, Bash]
---

# YouTube Adapter Bee

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station L (L3)

## Rules
- Title: keyword + under 60 chars
- Description: chapters + calculator URL above fold
- Tags: researched, not generic

## Outputs
- yt_queue row (awaits manager + operator approval)

## Token tier
Tier 2 (Sonnet) for description, Tier 1 (Haiku) for tags.
