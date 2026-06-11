---
name: ytl-config-taxchecknow
description: >
  YouTube LONG-form scheduler config for taxchecknow. Read each tick by the YTL
  scheduler (L2+) via lib/youtube/ytl-config.ts. Edit the yaml block to retune
  cadence/lanes; every key has an in-code default so a bad edit degrades, never
  breaks. Triggers for: "ytl", "long-form", "long video", "ytl_winner", "weekly".
---

# YTL Scheduler Config — taxchecknow

How the YouTube LONG-form scheduler paces itself. Long-form is **weekly**, not
daily — one strong piece per week beats a flood. Lanes cascade like YTS:

1. **ytl_winner** — re-cut/expand a proven winner into long-form (bootstrap: 1/week).
2. **ytl_pick** — an operator/strategy-chosen long topic (held at 0 until L2+).

Cadence is a single weekly slot (`slot.day`/`slot.time`, AWST). `horizon_days`
plans a fortnight ahead. The rewrap caps mirror YTS but per long-piece. `maturity`
is slower (28 days, 500-view floor) because long-form accrues views over weeks.

`no_touch_hours` gets code-side teeth at L7 (don't re-touch a freshly published
long video for a day). `aspirational_not_enforced` names the S2 quality bar
(first-30s retention) **explicitly so it's a stated goal, never a silent one** —
no code enforces it yet.

```yaml
lanes: { ytl_winner: 1, ytl_pick: 0 }     # per WEEK
ytl_pick: ""                               # operator-named product_key for the pick lane (interim storage; empty = use ytl_winner)
slot: { day: "tuesday", time: "09:00" }    # AWST
horizon_days: 14
packaging_rewrap_cap: 3
hook_recut_cap: 1
maturity: { days: 28, view_floor: 500 }
no_touch_hours: 24                         # code-side teeth at L7
render_floor: { min_s: 240, max_s: 480 }   # L6 — long duration band (4-8min) the render must land in to publish
auto_approve: { gate0_long: false, gate1_long: false, gate15_render: false }  # YT-M2 — true lets the tick auto-stamp ONLY where yt-m2 recommends approve + zero hard-fails. ALL FALSE until the operator's explicit word.
aspirational_not_enforced:
  first_30s_retention_pct: 70              # S2: named, not silent
```
