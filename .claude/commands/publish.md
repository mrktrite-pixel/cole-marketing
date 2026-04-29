---
name: publish
description: Publish approved content to a platform. Only runs after
             Soverella approval. Specify platform: linkedin, youtube,
             instagram, x, reddit-draft, or all.
invocation: user
---

# /publish [content-id] [platform]

## Requires
Content must be APPROVED in Soverella queue first.
Do not run this command on unapproved content.

## Platforms
  linkedin      → LinkedIn API (Tue/Thu 9am schedule)
  youtube       → YouTube Data API (Wed/Fri 10am)
  instagram     → Meta Graph API (6pm daily)
  x             → X API v2 (8am/12pm/5pm)
  reddit-draft  → Saves draft only — you post manually
  all           → All approved platforms in sequence

## Platform Manager Gates

Before any Publisher Bee fires, Platform Manager checks:

LinkedIn Manager checks:
  No hashtags? One link? Value before ask?
  Professional tone? Calculator UTM present?

YouTube Manager checks:
  Video file exists? Thumbnail exists?
  Fear number in thumbnail? Title under 60 chars?
  Chapters in description? End screen set?

Instagram Manager checks:
  Reel under 60s? Hook in first 3 words?
  5 hashtags max? Bio link referenced?

X Manager checks:
  Hook tweet under 280 chars? Chaos angle used?
  Fear number in first 2 tweets? Link in final tweet?

If any check fails → back to Adapter Bee with reason.
If all pass → Publisher Bee fires.

## Output

```
PUBLISH COMPLETE: [content-id]

Platform: [platform]
Platform Manager: APPROVED ✅
Published at: [URL or post ID]
UTM tracking: [utm parameters confirmed]
Distribution Manager: all pings confirmed ✅

Logged to: content_performance table
Soverella: status updated to Published ✅

Cost: $0 (Tier 0 — API calls only)
```
