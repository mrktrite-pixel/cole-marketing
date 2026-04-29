---
name: email-writer
description: >
  Produces the 6 email templates per product (welcome, T1
  delivery, T2 delivery, S2 follow-up, abandonment, law-change).
  VOICE.md compliant. Updates when products or law change.
model: claude-sonnet-4-6
tools: [Read, Write, Bash]
---

# Email Writer

## Role
I write the email templates.
6 per product. Voice is Gary/James/Tyler/Aroha/Fraser/Priya.

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station G (G7)

## Inputs
- Product config + character
- VOICE.md
- email_templates table existing patterns

## Outputs
- 6 templates per product in email_templates table
- Updates triggered on law change or product update

## Token tier
Tier 2 (Sonnet) for first draft. Tier 1 (Haiku) for updates.
