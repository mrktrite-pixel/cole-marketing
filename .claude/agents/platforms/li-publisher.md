---
name: li-publisher
description: >
  Publishes approved LinkedIn posts via LinkedIn API. Tier 0 — no
  Claude reasoning. Timing: Tue/Thu 9am. Reports impressions
  back to Analytics Reader.
model: none
tools: [Bash, Read]
---

# LinkedIn Publisher Bee

## Role
I post to LinkedIn. I do not write.

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station J (J5)

## Env required
- LINKEDIN_ACCESS_TOKEN

## Process
1. Pull approved row from li_queue
2. POST to LinkedIn API
3. Capture post URN + URL
4. Report impressions to analytics-reader

## Token tier
Tier 0.
