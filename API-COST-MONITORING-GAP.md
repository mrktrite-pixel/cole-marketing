# Pre-go-live gate: API cost/balance monitoring tile

> Append to STATE.md (apiary or cluster-wide) under blocking pre-go-live items.

## Status: BLOCKING. Build before any production-scheduled cron firing.

**The pain (verified 2026-05-28):** Anthropic credits ran out mid-build. The first
live Bee 1 fire returned `candidates_written: 0`. Every Claude-calling bee in the
ENTIRE cluster (per-hive Bee 2 scorer included) was silently failing on 400s for an
unknown amount of time before. No alert, no dashboard, no visibility. Cost ~1 hour
of diagnosis to find "out of credits" as the cause.

## Required: API cost/balance monitoring on the admin dashboard

A panel showing, AT MINIMUM:
- **Current Anthropic balance** (pulled from Anthropic API — they expose a credit
  balance endpoint) — RED when below a threshold (e.g. $5)
- **Current Google AI / Gemini billing status** (same, for the gemini routine that
  underpins half the apiary)
- **Per-bee daily cost trend** (already available in `agent_log` — just needs
  surfacing): a sparkline or count per bee_name showing today vs yesterday vs week
  avg. Sudden drop in any bee's cost == that bee is probably failing silently
- **Recent failed-call rate per LLM provider** (count 400s/429s/5xx in agent_log
  per provider over the last hour) — non-zero = investigate

Plus an **alert** mechanism (email or in-dashboard banner) when:
- Anthropic balance < threshold
- Any bee's success rate drops below X% over the last N runs
- Any LLM provider returns >Y% 4xx over the last hour

## Why blocking, not nice-to-have
Without this, the failure mode is: a bee silently stops working, candidate tables
stop filling, nobody notices until a human happens to check. With Apiary going live
soon (which is meant to be the niche-discovery engine), going dark on it for hours
or days = a complete loss of why the system exists. Cost monitoring is the
difference between "we know within 5 minutes" and "we find out a week later."

## Where this lives (cole-admin-portal scope)
The cole-admin-portal skill governs the admin dashboard. This is a panel in that
dashboard. Likely co-located with the existing bee_run_metrics / per-bee health
views.

## Auto-recharge — separate but related
Enable Anthropic auto-recharge in the Console (Plans & Billing → Auto-recharge).
Doesn't replace the monitoring tile, but stops the bleeding while monitoring is
being built. CHECK THIS IS ON before any scheduled production fire.

## The two pre-go-live gates now (both BLOCKING)
1. **Fork-2b** — canonical niche registry (already logged 2026-05-28). Without
   it, `apiary_niche_candidates` fills with un-deduped/mis-routed rubbish.
2. **API cost/balance monitoring tile** (this gap). Without it, silent LLM
   failures go undetected.

Don't schedule the apiary cron in vercel.json until both are in place + verified.
