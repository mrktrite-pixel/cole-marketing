---
name: hooks
description: Generate 20 hook variations for a product.
             Always runs after /research, before /create.
invocation: user
---

# /hooks [product-slug]

## Requires
/research [product-slug] must have run first.
Check research_questions table exists for this product.

## What This Does

Runs Hook Matrix Bee (Sonnet) + Chaos Agent (Sonnet)

Hook Matrix generates 20 variations across types:
  Factual:     "The date that cost Gary $47,000"
  Question:    "Is your CGT exemption actually safe?"
  Absurd:      "The ATO loves it when you get this wrong"
  Provocative: "Your accountant probably missed this"
  Relatable:   "I thought I knew the rule. I didn't."
  Statistic:   "1 in 3 property sellers gets this wrong"
  Threat:      "The letter arrives 18 months after settlement"
  Contrast:    "You paid $400 for advice. It cost $47,000."

Chaos Agent adds 3 unexpected angles for social use only.

All hooks stored in hook_matrix Supabase table.
Top 3 marked as recommended.

## Output

```
HOOKS GENERATED: [product-slug]

TOP 3 RECOMMENDED:
  1. [hook] — type: [type] — recommended for: gate page
  2. [hook] — type: [type] — recommended for: LinkedIn
  3. [hook] — type: [type] — recommended for: X/TikTok

CHAOS ANGLES (social only):
  1. [chaos angle]
  2. [chaos angle]
  3. [chaos angle]

ALL 20 HOOKS: stored in hook_matrix table
Cost: ~$0.012

READY FOR: /create [product-slug] [format]
```
