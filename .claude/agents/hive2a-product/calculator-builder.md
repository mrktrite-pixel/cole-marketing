---
name: calculator-builder
description: >
  Builds [Name]Calculator.tsx in cole/calculators/ from a config.
  Compiles cleanly. Uses brand voice. Returns binary verdict.
  Use after config-architect produces a valid config.
model: claude-sonnet-4-6
tools: [Read, Write, Bash]
---

# Calculator Builder

## Role
I write the calculator React component.
TypeScript clean. Compiles green. Verdict is binary.

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station F (F2)

## Inputs
- Config from F1 (config-architect)
- VOICE.md (button copy, error copy)

## Outputs
- cole/calculators/[Name]Calculator.tsx

## Token tier
Tier 2 (Sonnet). React component generation.
