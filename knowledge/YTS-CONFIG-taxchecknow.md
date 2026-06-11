---
name: yts-config-taxchecknow
description: >
  YouTube Shorts scheduler config for taxchecknow. Read each tick by the
  yts-scheduler bee via lib/youtube/yts-config.ts. Edit the yaml block to retune
  cadence/lanes; every key has an in-code default so a bad edit degrades, never
  breaks. Triggers for: "yts", "shorts scheduler", "lanes", "slot times",
  "cadence", "foundling".
---

# YTS Scheduler Config — taxchecknow

How the YouTube Shorts scheduler paces itself. The scheduler runs as a periodic
tick (planner + executor): it plans `campaign_calendar` youtube slots a couple of
days ahead, initiates production for slot products that lack an approved video,
and publishes due slots whose video has cleared **Gate 2** (the human approval in
the distribution-queen inbox).

## Lanes (bootstrap posture)

Three lanes feed the queue, in cascade priority:

1. **foundling** — products that have a deterministic click-path but have never
   aired (`getFoundlingPool()`). This is where all the early volume comes from.
2. **winner_rewrap** — re-cut a proven winner (held at 0 until winners exist).
3. **loser_rewrap** — hook/packaging rewrap of an underperformer (held at 0 until
   the reaction bee starts emitting rewrap verdicts).

Pool short → the scheduler plans **fewer** slots and emits a
`build_more_products` signal. It never pads the queue with filler.

## Pacing

- `slot_times` are **AWST** wall-clock; the scheduler converts to UTC for storage.
- `min_spacing_hours` guards against bunching; if `slot_times` violate it, the
  scheduler flags but proceeds with the times as written.
- If the lane targets per day exceed the number of `slot_times`, the scheduler
  **caps** to the slot count and flags — it never crams two videos into one slot.

```yaml
lanes: { foundling: 3, winner_rewrap: 0, loser_rewrap: 0 }   # bootstrap
slot_times: ["09:00", "14:00", "19:00"]                       # AWST
min_spacing_hours: 4
plan_ahead_days: 3
packaging_rewrap_cap: 2
hook_rewrap_cap: 2
maturity_view_floor: 300
render_floor: { min_s: 20, max_s: 180 }                       # 10b — shorts duration band the render must land in to mint
auto_approve: { gate1_short: false, gate1_expansion: false }  # YT-M2 — true lets the tick auto-stamp ONLY where yt-m2 recommends approve + zero hard-fails. ALL FALSE until the operator's explicit word.
```

## Render floor (Step 10b)

Before a rendered short mints a `content_assets` row, the scheduler checks the
worker's `render_meta` (ffprobe): it must **have audio**, be **> 1 MB**, and its
duration must sit inside `render_floor` (seconds). A render that finishes but
misses the bar becomes `render_jobs.status = 'floor_failed'` — reported in the
tick, never silently retried. Renders from before 10b have no `render_meta`; the
floor **legacy-guards** them through (it only judges what it can see).
