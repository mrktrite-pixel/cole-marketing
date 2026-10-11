# TT-CONFIG — taxchecknow TikTok lane

Operator-authored. Every key has an in-code default in `lib/tiktok/tt-config.ts`; a bad edit
degrades to the default and is flagged, it does not throw.

**Account:** `@tackchecknowsite` (measured 2026-09-23 — NOT `@taxchecknow`, which holds the
June posts on a different account). Cold start: 0 followers at reconnect.

**Slot times are UTC.** "AU peak" is not one clock — Sydney and Perth differ by 2–3 hours — so
the file stores UTC and the city table sits beside it.

| UTC   | AEST (Sydney) | AWST (Perth) |
|-------|---------------|--------------|
| 01:00 | 11:00         | 09:00        |

```yaml
slot_times_utc: ["01:00"]
weekdays_only: true
per_day: 1
buffer_target: 5
caption_band:
  min: 80
  max: 900
plan_ahead_days: 14
max_reuse_per_asset: 1
hashtags: []
link_tail: "Link in bio"

# ── CAPTION v2. RULED 2026-09-25 on Strategy's external evidence. ──
# 3-5 specific hashtags including the keyword verbatim · keyword in the first line · a
# 100-150 char sweet spot. MEASURED on the TT0 proof post BEFORE this: ~570 chars, 0 hashtags,
# keyword first appearing at roughly character 70.
# Every word of a v2 caption is SELECTED from the product's own s2 artifact — its ledger
# question, its judged beats, its packaging.tags. Nothing is written, and the composer REFUSES
# rather than improvise when no judged line carries a product keyword in its opening words.
hashtag_count: 3                                             # exactly this many, all from the product's OWN packaging.tags. Keyword first, verbatim. Never #fyp/#viral — nothing is added that the product did not already carry.
body_max_chars: 150                                          # cap on the judged-beat body (the "sweet spot" half). NOTE: this caps the BODY, not the whole caption — line 1 + CTA + hashtags sit on top, so rendered captions currently land at ~270-290 chars.
caption_max_chars: 2200                                      # hard ceiling; the gate refuses above it. TikTok's own limit is ~2200.
keyword_window_words: 10                                     # the keyword must appear within this many words of line 1, or the composer refuses.
tt_cta: "Free check → link in bio"                      # RULED 2026-09-25: operator confirmed the bio URL, so this is now "Free check → link in bio". The profile must keep that promise — if the bio URL is ever removed this string has to change back the same day.
```

## Why these values

- **5/week weekdays, hard max 1/day** — ruled 2026-09-23.
- **01:00Z** preserves the slot the lane's existing bookings already used, rather than inventing
  a new one.
- **caption_band.max 900** is deliberately conservative. 564 characters published cleanly in the
  TT0 proof post; TikTok's real ceiling is UNTESTED, and a guess at it would be a claim.
- **hashtags: []** — ruled default. The account has three videos and zero followers, so there is
  no evidence on which to propose any, and a guess dressed as a measurement is worse than none.
- **link_tail** — TikTok makes no caption URL clickable and this account has no website field
  (operator-measured), so the bio is the only funnel and the caption points at it. The shared
  calculator-URL builder feeds the BIO document, never a caption.
- **max_reuse_per_asset 1** — the IG dedupe shape, which the 2026-09-23 sweep confirmed correct
  by construction.
