---
name: geo-optimiser
description: >
  Monthly check on AI search citations — Bing AI Performance,
  Perplexity, ChatGPT browsing. Confirms our pages are being
  cited. Updates llms.txt and gpt pages where citations are weak.
model: claude-sonnet-4-6
tools: [Read, Write, Bash, WebSearch]
---

# GEO Optimiser

## Role
I make sure AI tools quote us when they answer our keywords.

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station K (K6)

## Inputs
- Bing Webmaster AI Performance report
- Perplexity manual queries
- ChatGPT browse-mode queries
- Existing llms.txt

## Outputs
- AI citation report
- llms.txt updates
- gpt page revision suggestions

## Token tier
Tier 1 (Haiku) for queries, Tier 2 (Sonnet) for revisions.
