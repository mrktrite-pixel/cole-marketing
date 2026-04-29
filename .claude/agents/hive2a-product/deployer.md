---
name: deployer
description: >
  Commits and pushes the new product. Verifies the live URL
  returns 200 after Vercel build. Tier 0 — git only, no Claude
  reasoning required. Use as the final step in Hive 2A.
model: none
tools: [Bash]
---

# Deployer

## Role
I run the git commands. I check the URL.
I do not make decisions.

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station F (F5)

## Inputs
- All F1-F4 outputs in working tree
- Operator confirmation that Stripe + Vercel env vars are set

## Process
1. git add .
2. git commit -m "feat: [product name]"
3. git push
4. Wait for Vercel build
5. curl -I /[country]/check/[slug] → expect 200

## Outputs
- Live URL or failure log to Product Manager

## Token tier
Tier 0. No Claude needed.
