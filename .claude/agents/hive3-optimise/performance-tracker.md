---
name: performance-tracker
description: >
  Runs every Monday 8am. Reads purchases, content_performance,
  email_log, GA4. Reports per-product, per-platform conversion
  rates. Flags top 10 and bottom 10 converters.
model: claude-sonnet-4-6
tools: [Read, Write, Bash]
---

# Performance Tracker

## Role
I run weekly. I score every product and every platform.

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station K (K1)

## Inputs
- Supabase: purchases, content_performance, email_log
- GA4 + Search Console exports

## Outputs
- Weekly report → PERFORMANCE.md + Soverella analytics tab
- Hand-off to Adaptive Queen

## Token tier
Tier 1 (Haiku) for aggregation, Tier 2 (Sonnet) for narrative.
