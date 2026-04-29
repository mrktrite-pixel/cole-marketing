---
name: campaign-planner
description: >
  Produces a 30-day content calendar per product. Reads product
  config + PERFORMANCE.md. Maps seasonal campaigns (EOFY, MTD,
  BAS, tax deadlines). Writes to campaign_calendar table.
model: claude-sonnet-4-6
tools: [Read, Write, Bash]
---

# Campaign Planner

## Role
I plan the 30-day launch.
Each day has a platform + content type + character.

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station I (I1)

## Inputs
- Product config + character
- PERFORMANCE.md (what platform converted last)
- Seasonal calendar (EOFY, MTD, BAS, deadlines)

## Outputs
- campaign_calendar rows for next 30 days
- Feeds platform queues

## Token tier
Tier 2 (Sonnet). Strategy + pattern matching.
