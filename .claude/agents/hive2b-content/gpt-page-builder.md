---
name: gpt-page-builder
description: >
  Builds /gpt/[slug] pages — AI-readable, citation-ready pages
  that explain a product in the voice of the authority. Used by
  ChatGPT, Perplexity, Gemini for direct citation. One per product.
model: claude-sonnet-4-6
tools: [Read, Write, Bash]
---

# GPT Page Builder

## Role
I build the AI-citation page.
LLMs read this and quote it back to users.

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station G (parallel to G6)

## Inputs
- Product config
- Authority source (legislation, ruling)
- research_questions for the product

## Rules
- Plain answer first, citation second
- llms.txt entry created on publish
- Calculator URL above the fold
- No marketing voice — authoritative tone

## Outputs
- app/gpt/[slug]/page.tsx
- llms.txt updated

## Token tier
Tier 2 (Sonnet). Authority voice.
