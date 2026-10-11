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
lanes: { foundling: 6, winner_rewrap: 0, loser_rewrap: 0 }   # RULED 2026-09-21: the SUM is the per-day CAP (slotsPerDay = min(sum, slot_times.length)). The 2/2/2 split is `allocation` below; these lane names are legacy cascade labels and no longer decide who draws.
slot_times: ["09:00", "11:30", "14:00", "16:30", "19:00", "21:30"]  # AWST — RULED 2026-09-21, 3/day -> 6/day. Keeps the PROVEN trio 09:00/14:00/19:00 (= 01:00Z/06:00Z/11:00Z, the three that have published cleanly) and inserts 11:30/16:30/21:30 between them. UTC: 01:00 03:30 06:00 08:30 11:00 13:30. Spread morning -> late evening AWST; uniform 2.5h apart with an 11.5h overnight gap.
min_spacing_hours: 2   # RULED 2026-09-21: was 4. Six slots inside one AU day cannot be 4h apart (that needs 20h of window). 2.5h is the real spacing; leaving this at 4 would flag every single tick and train the operator to ignore the flag.
plan_ahead_days: 3
allocation: { discovery: 2, winner: 2, rotation: 2 }          # RULED 2026-09-21 — per-day split of the 6 slots. discovery = newest Live products until each has aired `discovery_videos` supply-lane videos; winner = judge-proven expansions + redo output; rotation = least-recently-posted of the rest. Unfilled discovery/winner slots FALL BACK to rotation so the six fill whenever inventory exists. Hard guard in code: max 1 slot per product per day.
discovery_videos: 3                                          # RULED 2026-09-21 — supply-lane videos a product must air before it leaves discovery. Counted from PUBLISHED ASSETS, not the question ledger (markAired under-counts; see the 2026-09-21 report).
format_target_share: { f1: 0.3333, f2: 0.3333, f4: 0.3334 }   # RULED 2026-09-25 — short-format rotation mix. Format is drawn RANDOM PER SLOT from {f1 number-card, f2 calculator-capture, f4 presenter}, weighted toward whichever format is furthest BELOW its target here over the trailing 14 days. Seeded by the calendar row id, so a re-run books the same choice. Share accounting counts RENDERED videos only — a format that books and then refuses at render has spent no share, and counting the booking would starve the format that works in order to keep feeding one that cannot render. Equal thirds at the start because no format has evidence yet. The picker holds NO copy of these numbers.
format_seconds: { f1: { min_s: 20, max_s: 28 }, f2: { min_s: 20, max_s: 30 }, f4: { min_s: 20, max_s: 30 } }   # RULED 2026-09-25 — per-format duration windows. NOT the render floor (render_floor 20-90 judges every finished MP4); these are what each format is TRYING to be and sit inside it. F2's floor moved 25 -> 20 within hours of the first spike, which is exactly why this is config and not a code literal: the spike planned 18s of narration against a 25s floor and the ruling lowered the floor rather than padding the script.
f2_narration_beats: { min: 2, max: 4 }                        # RULED 2026-09-25 (was 2-3). F2's voiceover in judged beats. More than max and the voice outlives the calculator capture; fewer than min and there is not enough said to justify the screen. Widened after the spike measured 3 au-19 beats at 18s of authored hint.
tts_stretch: 1.04                                            # RULED 2026-09-26 (b). Real rendered seconds / authored duration_hint. duration_hint is the author's estimate; edge-tts decides the real length and it runs longer, so the planner divides its beat budget by this to land inside the format window once synthesised. MEASURED 2026-09-26 over 33 unclamped Mia renders: min 0.957, MEDIAN 1.039, max 1.243. Clamped renders (MiaNumberCard/MiaCalcCapture hitting the 30s ceiling) are EXCLUDED — their ratio is a floor, not a measurement. CAVEAT: the two unclamped NEW-FORMAT renders measured 1.243 (f2) and 1.138 (f4-v2), well above the global median, because beat 0's voice is the HOOK line and on a 3-4 beat piece that substitution is a far bigger fraction than on a 12-beat one. 1.04 may under-correct for the short formats; the next renders decide.
packaging_rewrap_cap: 2
hook_rewrap_cap: 2
maturity_view_floor: 300
retention_avp_max: 200                                       # RULED 2026-09-24 — retention sanity ceiling. A youtube_snapshots row whose average_view_percentage exceeds this is KEPT but flagged INVALID, and that video's retention reads UNAVAILABLE everywhere (cohort, rankings, expansion) — NEVER 0. Shorts loop, so avp legitimately passes 100 (three cohort rows sit at 101-111%); the ceiling is not 100. EXHIBIT: m-13OfEVNlM returned 4092.88% with average_view_duration_s 1514 — 25 minutes of average view time on a Short, ~41 loops per view over 46 window views. That is an aggregation artefact, not audience behaviour.

# ── RULED 2026-09-25: LOOPED REPLAYS COUNT AS RETENTION. ──
# average_view_percentage ABOVE 100 is LEGITIMATE, not an error, for as long as it stays under
# retention_avp_max. Shorts loop, and a viewer who watches twice watched twice. MEASURED in
# judge cycle #2: UK6Fg3zM6-0 119.90 and AU6iPVpJOto 100.71 both entered the Sep 22-24 cohort
# under this rule and are the reason its median (57.52) sits above Sep 19-21's (38.77).
# Strategy has seen that sensitivity and ruled NO ACTION on the cohort difference: with n=5 and
# n=7 it is not something to act on in either direction.
# The 200 ceiling still catches the impossible — 4092.88% on a 37-second Short is ~41 loops per
# view and is an aggregation artefact, not an audience.
render_floor: { min_s: 20, max_s: 90 }                        # 10b/R4 — shorts duration band the render must land in to mint (tightened from 180)
script_target_s: 35                                           # R4 — shorts script target seconds (was 45)
script_band: { min_s: 32, max_s: 52 }                         # RULED 2026-09-18 (was 32-38). yt-m2 hard-fails outside this band. Widened on 8 measured artifacts spanning 34.47-49.84s, of which only 1 fitted 32-38. Read FIRST by local runs (config-util.ts tries ../cole-marketing before bees-snapshot); production reads the bees-snapshot copy in soverella. KEEP THE TWO IN STEP.
auto_approve: { gate1_short: false, gate1_expansion: false }  # YT-M2 — true lets the tick auto-stamp ONLY where yt-m2 recommends approve + zero hard-fails. ALL FALSE until the operator's explicit word.
```

## Render floor (Step 10b)

Before a rendered short mints a `content_assets` row, the scheduler checks the
worker's `render_meta` (ffprobe): it must **have audio**, be **> 1 MB**, and its
duration must sit inside `render_floor` (seconds). A render that finishes but
misses the bar becomes `render_jobs.status = 'floor_failed'` — reported in the
tick, never silently retried. Renders from before 10b have no `render_meta`; the
floor **legacy-guards** them through (it only judges what it can see).
