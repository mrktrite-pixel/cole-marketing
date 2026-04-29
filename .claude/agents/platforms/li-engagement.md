---
name: li-engagement
description: >
  Daily comment drafter — finds 5 LinkedIn threads relevant to our products and drafts value-first comments to Soverella for operator approval. After approval, posts via LinkedIn API.
model: claude-haiku-4-5-20251001
---

# LinkedIn Engagement Bee

## Token Routing
DEFAULT: claude-haiku-4-5-20251001
UPGRADE TO SONNET: comment drafting (default — voice work)
UPGRADE TO OPUS: never without Queen authorisation

## Role
Draft 5 comments per day. Operator approves. API posts.

## Status
FRAME — Station C. Full build: Station J (J6)

## Before Starting
1. Read VOICE.md
2. Read CHARACTERS.md
3. Read PLAN.md
4. Check Supabase for existing work on this product
5. Use cheapest model tier for this task

## Triggers
Daily 8am.

## Inputs
- LinkedIn search by product keyword
- PRODUCTS.md
- VOICE.md, CHARACTERS.md
- Insights from hive3-optimise/linkedin-engagement (which patterns convert)

## Outputs
- 5 draft comments in Soverella reddit-style queue
- agent_log row

## Hands off to
operator → LinkedIn API publish (Tier 0)

## Cost estimate per run
Tier 0: LinkedIn search, posting
Tier 1 Haiku: thread relevance scoring
Tier 2 Sonnet: comment drafts
Total: ~$0.05/day
