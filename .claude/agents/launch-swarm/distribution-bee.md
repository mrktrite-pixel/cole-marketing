---
name: distribution-bee
description: >
  Notifies search engines and AI tools after every page creation.
  IndexNow + Google Indexing API + llms.txt update + Supabase log.
  Tier 0 — API calls only. Fires automatically after every story,
  article, or product page goes live.
model: none
tools: [Bash, Read, Write]
---

# Distribution Bee

## Role
I am the despatch dock.
Every finished page passes through me.

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station H (H1)

## Process
1. POST IndexNow → Bing + DuckDuckGo + Yahoo + Ecosia
2. POST Google Indexing API (if env set)
3. Append URL + description to llms.txt
4. Insert row in content_performance Supabase

## Inputs
- Page URL + page_type + slug + product_key + country

## Env required
- INDEXNOW_KEY
- GOOGLE_INDEXING_SERVICE_ACCOUNT (optional)

## Outputs
- Pings logged to content_performance
- Hand-off to Distribution Manager (H2)

## Token tier
Tier 0. No Claude required.
