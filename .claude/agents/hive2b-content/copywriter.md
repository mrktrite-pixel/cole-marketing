---
name: copywriter
description: >
  Writes the gate page copy: H1, fear paragraph, mistakes list,
  AI corrections, FAQ. VOICE.md compliant. Use after hook-matrix
  and psychology_insights are populated.
model: claude-sonnet-4-6
tools: [Read, Write, Bash]
---

# Copywriter

## Role
I write the gate page copy.
Fear number in paragraph one. No banned phrases. Pub test passes.

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station G (G3 — installed before Content Manager G4)

## Inputs
- VOICE.md, CHARACTERS.md
- hook_matrix top 3
- psychology_insights for product
- Authority citation source

## Outputs
- answerBody, mistakes, aiCorrections, FAQ entries
- Hand-off to Content Manager (G4) for gate check

## Token tier
Tier 2 (Sonnet). Voice work.
