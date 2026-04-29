# PLAN BEFORE EDIT — NON-NEGOTIABLE
# Every content agent reads this before generating anything

## The Rule

Plan Mode → Edit Mode. Always in this order. Never reversed.

## What Plan Mode Means

Before any content is written:

1. Market Researcher has run for this product
   Check: Supabase agent_log for recent research
   If not found: run Market Researcher first

2. Top performing content on this topic identified
   Check: content_performance table for this product
   Check: Analytics Reader last report

3. Hook Matrix exists with 20+ variations
   Check: content_performance for hook_matrix_run
   If not found: run Hook Matrix Generator first

4. Psychology insights loaded
   Check: psychology_insights for this product
   If not found: use general insights for this country

5. Plan stored (even just 3 lines in agent_log)
   "Using hook type: Factual ($47,000 number upfront)
    Character: Gary Mitchell
    Target: AU property sellers 55-65"

6. ONLY THEN does any writer generate content

## Why This Exists

Generating without research produces AI slop.
AI slop kills authority.
Authority is the entire COLE moat.

Stanley Henry's rule: quantity reveals quality.
But quantity of what? Quantity of VARIATIONS on a
researched angle — not quantity of generic outputs.

## The Check (run before every writing task)

```
□ Market Researcher run for this product? (check agent_log)
□ Hook Matrix generated (20+ hooks)? (check content_performance)
□ Psychology insights loaded? (check psychology_insights)
□ Top competitor content identified? (check agent_log)
□ Plan written (3 lines minimum)?
```

If any box is unchecked → run that step first.
Do not skip. Do not assume it was done before.
Check the database. Trust the data.

## Time Cost vs Quality Gain

Research + Hook Matrix: ~5 minutes of Claude time
Writing without research: produces content that does not convert
Writing with research: produces content that drives purchases

5 minutes now = $X revenue later.
Skipping = wasted production cost.
