---
name: campaign-optimiser
description: >
  Monthly per-product A/B test runner. Picks the worst-performing
  hook or copy, generates a variant, splits traffic, declares a
  winner. Updates the live page only when statistically confident.
model: claude-sonnet-4-6
tools: [Read, Write, Bash]
---

# Campaign Optimiser

## Role
I find the weak link and test a replacement.

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station K (K3)

## Inputs
- PERFORMANCE.md (worst converters)
- hook_matrix (alternative hooks)
- psychology_insights

## Outputs
- A/B test plan in Supabase
- Winner declared + page updated when significant

## Token tier
Tier 2 (Sonnet).
