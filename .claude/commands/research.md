---
name: research
description: Research a product or topic for content creation.
             Runs Market Researcher + Citation Gap Finder.
             Always runs before any content creation.
invocation: user
---

# /research [product-slug OR topic]

Read PLAN.md first. This is the Plan Mode step.

## What This Does

1. Runs Market Researcher for the product/topic
   → Finds 20+ questions in research_questions table

2. Checks Citation Gap Finder output for this topic
   → Confirms what AI gets wrong

3. Reads psychology_insights for this product
   → Loads which fear number format converts best

4. Reads PERFORMANCE.md
   → What similar content has driven purchases

5. Confirms Hook Matrix does not yet exist
   → If it does, loads existing hooks
   → If not, flags: run /hooks [product] next

## Output

```
RESEARCH COMPLETE: [product-slug]

Questions found: [N]
Top 5 by volume:
  1. "[exact question]" — [X searches/month]
  2. ...

AI Citation Gap:
  AI says: "[wrong answer]"
  Correct: "[law citation + correct answer]"

Psychology insight:
  Fear format: [$ amount | % | days]
  Best hook type: [Factual | Threat | Relatable]
  Converting demographic: [description]

PERFORMANCE context:
  Similar content last converted: [date + product]
  Best channel for this topic: [channel]

READY FOR: /hooks [product-slug]
```
