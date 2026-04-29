---
name: distribution-manager
description: >
  Same role as managers/distribution-manager.md — listed here in launch-swarm per ROLLOUT.md C7. Single quality gate, two listings. Confirms the six pings landed after distribution-bee.
model: claude-haiku-4-5-20251001
---

# Distribution Manager (launch-swarm listing)

## Token Routing
DEFAULT: claude-haiku-4-5-20251001
UPGRADE TO SONNET: never (pure HTTP checks)
UPGRADE TO OPUS: never without Queen authorisation

## Role
Run the six-step ping checklist. Mark COMPLETE or rerun.

## Status
FRAME — Station C. Full build: Station H (H2)

## Before Starting
1. Read VOICE.md
2. Read CHARACTERS.md
3. Read PLAN.md
4. Check Supabase for existing work on this product
5. Use cheapest model tier for this task

## Triggers
After distribution-bee finishes a page-creation run.

## Inputs
- distribution-bee result payload
- content_performance row
- sitemap.xml + llms.txt + page URL

## Outputs
- All pass → content_jobs row marked COMPLETE
- Any fail → distribution-bee reruns failed steps
- agent_log row

## Hands off to
content_jobs (mark COMPLETE) | distribution-bee on rerun

## Cost estimate per run
Tier 0: HTTP HEAD, Supabase reads
Tier 1 Haiku: rare — only on failure narrative
Tier 2 Sonnet: never
Total: ~$0
