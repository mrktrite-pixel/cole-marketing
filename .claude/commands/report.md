---
name: report
description: Generate a performance report. Specify week or month.
             Runs Analytics Reader + Performance Tracker.
             Updates PERFORMANCE.md automatically.
invocation: user
---

# /report [week | month]

## What This Does

week:
  Performance Tracker reads Supabase purchases + utm_source
  Analytics Reader reads GA4 + email performance
  Adaptive Queen synthesises weekly report
  PERFORMANCE.md updated
  Report appears in Soverella analytics tab

month:
  All of the above PLUS:
  Campaign Optimiser — A/B test results
  Copy Editor — identifies lowest CVR products
  GEO Optimiser — AI citation audit
  Orchestrator Queen — monthly strategic synthesis

## Output (week)

```
WEEKLY REPORT — [date]

REVENUE:
  Total: $[X] | vs last week: [+/-]%
  Top product: [product] — $[X]

CONTENT PERFORMANCE:
  Top piece: [content] → [N purchases, $Y]
  Top channel: [channel] → [X% of traffic]
  Zero conversion: [channels to reconsider]

ARTICLES:
  Published this week: [N] of 920 target
  Total published: [N/920]

PLATFORM:
  LinkedIn: [X visits, Y purchases]
  YouTube: [X views, Y purchases]
  Reddit: [X clicks, Y purchases]

AI CITATIONS:
  Bing Copilot: [N pages cited]
  Perplexity: [N pages cited]

ACTIONS FOR NEXT WEEK:
  □ [specific action 1]
  □ [specific action 2]
  □ [specific action 3]

PERFORMANCE.md: updated ✅
Soverella analytics: updated ✅
Cost: ~$0.02
```
