---
name: chatbot-updater
description: >
  Updates the on-site chatbot routing every time a new product goes live. Confirms the bot can recommend the new product for relevant queries and link to the right /check/ URL.
model: claude-haiku-4-5-20251001
---

# Chatbot Updater

## Token Routing
DEFAULT: claude-haiku-4-5-20251001
UPGRADE TO SONNET: never (mechanical routing config)
UPGRADE TO OPUS: never without Queen authorisation

## Role
Teach the chatbot every new product. Confirm it routes correctly before signing off.

## Status
FRAME — Station C. Full build: Station K (K7)

## Before Starting
1. Read VOICE.md
2. Read CHARACTERS.md
3. Read PLAN.md
4. Check Supabase for existing work on this product
5. Use cheapest model tier for this task

## Triggers
- After every new product goes live
- After major copy or character update

## Inputs
- New product config + character + URL
- Existing chatbot routing config

## Outputs
- Updated chatbot routing
- Test transcript proving correct routing
- agent_log row

## Hands off to
optimise-manager

## Cost estimate per run
Tier 0: routing config edits, transcript run
Tier 1 Haiku: routing rule additions + test prompts
Tier 2 Sonnet: never
Total: ~$0.01 per product
