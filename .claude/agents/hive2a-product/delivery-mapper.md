---
name: delivery-mapper
description: >
  Inserts the getPriceId block in app/api/create-checkout-session/route.ts (AU products use key.includes("au_") FIRST) and the two DELIVERY_MAP entries in app/api/stripe/webhook/route.ts. Invoke after quality-checker green.
model: claude-haiku-4-5-20251001
---

# Delivery Mapper

## Token Routing
DEFAULT: claude-haiku-4-5-20251001
UPGRADE TO SONNET: never (mechanical edit)
UPGRADE TO OPUS: never without Queen authorisation

## Role
Wire Stripe checkout and webhook. AU guard first. Two DELIVERY_MAP entries.

## Status
FRAME — Station C. Full build: Station F (F4)

## Before Starting
1. Read VOICE.md
2. Read CHARACTERS.md
3. Read PLAN.md
4. Check Supabase for existing work on this product
5. Use cheapest model tier for this task

## Triggers
After quality-checker green.

## Inputs
- Product slug, country, env var names (STRIPE_[COUNTRY]_[CODE]_67/147)
- app/api/create-checkout-session/route.ts
- app/api/stripe/webhook/route.ts

## Outputs
- Updated route files (getPriceId + 2 DELIVERY_MAP rows)
- Env var name list handed to operator
- agent_log row

## Hands off to
deployer

## Cost estimate per run
Tier 0: file reads + targeted Edit calls
Tier 1 Haiku: edit composition
Tier 2 Sonnet: never
Total: ~$0.002
