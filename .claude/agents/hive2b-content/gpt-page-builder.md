---
name: gpt-page-builder
description: >
  Builds /gpt/[slug] AI-citation pages in authoritative voice for ChatGPT, Perplexity, and Gemini to quote, with the calculator URL above the fold. One per product. Invoke after product approved.
model: claude-haiku-4-5-20251001
---

# GPT Page Builder

## Token Routing
DEFAULT: claude-haiku-4-5-20251001
UPGRADE TO SONNET: authority-voice writing (default — citation needs precision)
UPGRADE TO OPUS: never without Queen authorisation

## Role
Build the AI-citation page. LLMs read this and quote it back.

## Status
FRAME — Station C. Full build: Station G (parallel to G6)

## Before Starting
1. Read VOICE.md
2. Read CHARACTERS.md
3. Read PLAN.md
4. Check Supabase for existing work on this product
5. Use cheapest model tier for this task

## Triggers
After product approved AND authority source captured.

## Inputs
- Product config
- Authority source (legislation, ruling)
- research_questions for the product

## Outputs
- app/gpt/[slug]/page.tsx
- llms.txt updated entry
- agent_log row

## Hands off to
distribution-bee

## Cost estimate per run
Tier 0: file reads, llms.txt append
Tier 1 Haiku: scaffolding + structured Q&A
Tier 2 Sonnet: authority-voice body
Total: ~$0.03 per product
