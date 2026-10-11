---
name: x-config-taxchecknow
description: >
  X (Twitter) lane config for taxchecknow. Read each tick by x-generator and the
  scheduled-publisher X branch via lib/x/x-config.ts. Edit the yaml block to retune cadence,
  band or the judge bar; every key has an in-code default so a bad edit degrades, never
  breaks. Triggers for: "x lane", "twitter", "x slot times", "x cadence", "x band".
---

# X Lane Config — taxchecknow

How the X lane paces itself. x-generator authors figure-led text posts from the verified
answer pool, judges them, and books BLUE `campaign_calendar` rows with `platform='twitter'`.
scheduled-publisher publishes them as a 2-item self-thread.

## The defining rule

**The calculator link never rides the post body.** X suppresses reach on link posts, worst of
all for non-Premium accounts, and this account is non-Premium (measured 2026-09-21:
`isPremium false`, `verifiedType "none"`). The link goes in the FIRST REPLY, published via
`platformSpecificData.threadItems` — item 0 is the body, item 1 is the reply.

**`threadItems[0]` carries the body.** Zernio's docs: *"When threadItems is set, the top-level
content is stored for display and search only and is NOT published."* Set `content` alone and
an empty thread publishes. The publisher asserts this invariant before every send.

## Counting

X counts a **URL as 23 characters** whatever its real length and an **emoji as 2**. The band
below is measured on that WEIGHTED count, never `str.length`. Free-account ceiling is 280
(Premium 25,000); this account is free — see the tier note.

## Tier — RULED (R-X3)

The account stays on the **free tier**: test first, upgrade on evidence. So X reach figures
are read as **free-tier, link-suppressed numbers**, and no verdict about content quality is
drawn from reach alone while free. The Premium decision revisits once 2+ weeks of publish data
exist. `xCapabilities.analytics` is **false** on this account, so the dashboard shows the
publish record and states that analytics are unavailable — it never renders zeros.

## Pacing

- `slot_times_utc` are **UTC**, deliberately not local. "AU weekday peak" is not one clock —
  Sydney and Perth differ by 2-3 hours, so a single local time labelled "peak" is peak in one
  city and mid-morning in the other. The UTC values below and their local equivalents:
  | UTC | AEST (Sydney) | AWST (Perth) |
  |-----|---------------|--------------|
  | 02:00 | 12:00 | 10:00 |
  | 05:00 | 15:00 | 13:00 |
  | 08:00 | 18:00 | 16:00 |
  The AU midday-to-evening window, three hours apart so they cannot bunch.
- `per_day` is **site-wide**, not per product. The generator also enforces max 1 post per
  product per day.
- If `per_day` exceeds the number of `slot_times_utc`, the loader **caps and flags** — there is
  nowhere to put the extra post.

```yaml
slot_times_utc: ["02:00", "05:00", "08:00"]   # UTC — see the table above for AEST/AWST
per_day: 3                                     # RULED 2026-09-21 — site-wide
buffer_target: 5                               # future booked rows kept ahead (= 5 days at 3/day is 15 posts; this is a ROW count)
band: { min: 200, max: 275 }                                  # RULED 2026-09-25 — was 240/259. X-WEIGHTED characters (URL=23, emoji=2). The narrow band was half of why the lane stalled: two products could build NO in-band subset from their judged beats at all, and three more had spent every cut it allowed. A wider band admits more distinct subsets of the SAME judged sentences — it changes what can be SELECTED, never what can be written.
judge_min_score: 70                            # RULED — X rubric: hook doctrine + bookmarkable specificity
plan_ahead_days: 3
```

## Authoring binds

Every body must pass `lib/supply/x-validate.ts` before it is booked:
- weighted length inside `band`
- **no URL in the body** (the link rides the reply)
- no hashtags
- every figure token verified against the product's own corpus — the fabrication gate
- the authority named in the body (a figure without its source is not citable)
- **brand voice, no first person, no invented byline.** RULED: X publishes as @taxchecknow.
  LinkedIn's per-country character mapping (Gary Mitchell, Priya Sharma) is LinkedIn's alone —
  a fictional character speaking under the brand handle on a public timeline is not acceptable.
- the reply carries the link with `utm_content` bound to THIS post's own id (H6 from day one)
- **no duplicate text.** X rejects a post whose text matches one the account already has, so
  the generator checks at AUTHORING against every prior X body rather than discovering it at
  publish.
