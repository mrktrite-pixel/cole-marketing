---
name: hook-matrix
description: >
  Generates 20 hook variations per product, scores them on fear strength, specificity, and pub test, and marks the top 3 as recommended in hook_matrix. Invoke first in any content build for a product.
model: claude-haiku-4-5-20251001
---

# Hook Matrix Bee

## Token Routing
DEFAULT: claude-haiku-4-5-20251001
UPGRADE TO SONNET: hook generation across the 5 styles (default — creative work)
UPGRADE TO OPUS: never without Queen authorisation

## Role
Produce 20 hooks per product. Mark top 3. Feed every other content bee.

## Status
FRAME — Station C. Full build: Station G (G1)

## Before Starting
1. Read VOICE.md
2. Read CHARACTERS.md
3. Read PLAN.md
4. Check Supabase for existing work on this product
5. Use cheapest model tier for this task

## Triggers
After product approved AND psychology_insights for it exists.

## Inputs
- Product config + fear number
- VOICE.md, CHARACTERS.md
- psychology_insights for the product

## Outputs
- 20 rows in hook_matrix per product (style, hook, fear score, specificity score, pub test pass/fail, top-3 flag)
- agent_log row

## Hands off to
chaos-agent, copywriter, story-writer

## Cost estimate per run
Tier 0: Supabase reads
Tier 1 Haiku: scoring + classification
Tier 2 Sonnet: hook generation across 5 styles
Total: ~$0.03 per product
