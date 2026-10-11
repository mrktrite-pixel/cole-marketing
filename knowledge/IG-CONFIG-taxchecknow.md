---
name: ig-config-taxchecknow
description: >
  Instagram lane config for taxchecknow. Read each tick by ig-scheduler and the
  scheduled-publisher Instagram branch via lib/ig/ig-config.ts. Edit the yaml block to retune
  cadence, the format pattern or the caption band; every key has an in-code default so a bad
  edit degrades, never breaks. Triggers for: "ig lane", "instagram", "reels", "ig carousel",
  "ig slots".
---

# IG Lane Config — taxchecknow

How the Instagram lane paces itself. `ig-scheduler` REUSES already-judged assets — it authors
no new content — and books BLUE `campaign_calendar` rows with `platform='instagram'`.
`scheduled-publisher` publishes them.

## Supply is REUSE, not a pipeline

Reels come from **already-published supply MP4s** (32-52s against Instagram's 90s Reel
ceiling — they fit without re-encoding). Carousels come from the LinkedIn carousel renders.
Captions are SELECTED FROM THE ARTIFACT'S OWN JUDGED BEATS — the standing estate-wide
doctrine: true figures never license a new proposition.

**Max 1 Instagram reuse per source asset.** Recorded as a `content_assets` row with
`platform='instagram'` and `parent_asset_id` = the source asset's id, so the constraint is
queryable with no new column.

## The defining constraint

**Instagram renders no clickable link — in a caption or a comment.** The one funnel is the
**bio URL** (ruled: the home page with `utm_source=instagram&utm_medium=bio&utm_campaign=ig_lane`).
Every caption carries a "Link in bio" pointer. **Per-post attribution is structurally
unavailable on this lane** and the dashboard says so rather than implying otherwise.

`firstComment` is used on **CAROUSELS ONLY** (the doc scopes it to "feed posts and carousels"),
carrying the product's calculator URL as **visible text** — a copy-paste convenience, never a
funnel. Whether it works on a **Reel** is an open measured-unknown, to be settled cheaply on
one later Reel.

## Format follows the media — there is no "make this a Reel" flag

From the docs: *"A plain post becomes a feed post when the media is an image and a Reel when
it is a single video."* Send one video and it is a Reel; send 2-10 images and it is a carousel.
`contentType` is only for Stories, which this lane does not use.

## Pacing

- `slot_times_utc` are **UTC**, the X precedent — "AU peak" is not one clock:
  | UTC | AEST (Sydney) | AWST (Perth) |
  |-----|---------------|--------------|
  | 08:00 | 18:00 | 16:00 |
  The AU early-evening slot, when people are off work and scrolling.
- `weekdays_only: true` — 5 posts a week, Monday to Friday. **HARD max 1 per day**, which the
  single slot time enforces structurally.
- `format_pattern` is the ruled **3 Reels + 2 carousels** per week, as an explicit Mon-Fri
  sequence rather than a ratio, so the same weekday always carries the same format and the
  pattern is readable rather than emergent.
- Max **1 post per product per day**; ordering **never-posted-first, then least-recently-posted**.

```yaml
slot_times_utc: ["08:00"]                                  # UTC — 18:00 AEST / 16:00 AWST
weekdays_only: true                                        # Mon-Fri only → 5/week
per_day: 1                                                 # HARD cap, RULED
format_pattern: ["reel","carousel","reel","reel","carousel"]  # Mon..Fri = 3 Reels + 2 carousels, RULED
buffer_target: 5                                           # future booked rows kept ahead (1 week)
caption_band: { min: 120, max: 2000 }                      # characters; IG's own limit is 2200
plan_ahead_days: 14
max_reuse_per_asset: 1                                     # RULED — by content_assets id
```

## Authoring binds

Every caption must pass `lib/supply/ig-validate.ts` before it is booked:
- caption inside the band and under Instagram's 2,200 ceiling
- **the hook inside the first 125 characters** — that is all that shows before the "more" fold
- **no URL in the caption** (Instagram renders none) and a **"Link in bio"** pointer present
- no hashtags — RULED: no measured basis exists for them, and folk knowledge is not evidence
- every figure token verified against the product's corpus (the shared `FIGURE_RE`)
- the authority named
- brand voice, no persona, no invented byline
- media present and correctly shaped: 1 video for a Reel, 2-10 images for a carousel, every
  URL a direct `https` (Instagram cannot fetch Drive/Dropbox/OneDrive links — they return HTML)

## Rate limit

Instagram allows 100 posts per rolling 24h across all types. **Read what is left from the API**
(`GET /v1/accounts/{id}/instagram/publishing-limit` → `quotaUsage`/`quotaTotal`), never hardcode
the cap. At 1/day this lane is nowhere near it, but the rule is the rule.
