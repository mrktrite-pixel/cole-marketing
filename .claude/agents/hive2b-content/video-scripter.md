---
name: video-scripter
description: >
  Writes 60-second short scripts and 10-minute long scripts with visual prompts, B-roll cues, and a thumbnail prompt with the fear number. Invoke when video format is in the campaign calendar.
model: claude-haiku-4-5-20251001
---

# Video Scripter

## Token Routing
DEFAULT: claude-haiku-4-5-20251001
UPGRADE TO SONNET: voice + structure + hook timing (default)
UPGRADE TO OPUS: never without Queen authorisation

## Role
Convert story to script. Hook in 3 seconds. Visual prompts so video-producer can render.

## Status
FRAME — Station C. Full build: Station G (G8)

## Before Starting
1. Read VOICE.md
2. Read CHARACTERS.md
3. Read PLAN.md
4. Check Supabase for existing work on this product
5. Use cheapest model tier for this task

## Triggers
After story-writer delivers AND yt_strategy or tt_strategy is current.

## Inputs
- Gary (or character) story
- yt_strategy or tt_strategy
- VOICE.md, CHARACTERS.md

## Outputs
- 60-second script (TikTok / Reels / Shorts)
- 10-minute script (YouTube long form)
- Visual prompt list per scene
- Thumbnail prompt with fear number overlay
- agent_log row

## Hands off to
video-producer

## Cost estimate per run
Tier 0: file reads
Tier 1 Haiku: visual prompt list
Tier 2 Sonnet: scripts (both lengths)
Total: ~$0.04 per product
