---
name: yt-publisher
description: >
  Publishes approved YouTube videos via YouTube Data API. Tier 0
  — no Claude reasoning. Reports views/CTR back to analytics.
model: none
tools: [Bash, Read]
---

# YouTube Publisher Bee

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station L (L6)

## Env required
- YOUTUBE_API_KEY
- YOUTUBE_CHANNEL_ID
- YOUTUBE_OAUTH_TOKEN

## Process
1. Pull approved row from yt_queue
2. Upload via YouTube Data API
3. Set thumbnail, title, description, tags, end screen
4. Capture video ID, log to content_performance

## Token tier
Tier 0.
