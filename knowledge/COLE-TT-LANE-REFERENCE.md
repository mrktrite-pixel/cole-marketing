# COLE — TIKTOK LANE REFERENCE

Provenance: every row below is MEASURED on @tackchecknowsite unless marked otherwise.
Truth table established TT0 (2026-09-23), extended by the 2026-09-24 probe.
Config: `lib/tiktok/tt-config.ts` + `knowledge/TT-CONFIG-taxchecknow.md` (both copies).

## The lane

| | |
|---|---|
| generator | `lib/bees/tt-generator.ts` — hourly, books BLUE, weekdays only |
| publisher | `lib/bees/tt-publisher.ts` — its OWN publisher, not scheduled-publisher |
| platform string | `tiktok` |
| account | `tackchecknowsite` (zernio account `_id` 6a3906405f7d1751ab490026) |
| supply | REUSE ONLY, provenance-scoped: `render_jobs.props_json.supply_artifact` |
| cadence | 5/week weekdays, 1/day, slot 01:00Z |

## *** THE DIRECT ADAPTER IS NEVER USED FOR A PRODUCTION PUBLISH ***

RULED 2026-09-24. TT0's proof post was published with `publishWithZernio` directly, as that
phase required. That path **writes nothing**: no `campaign_calendar` update, no
`content_assets.published_at`, no `content_performance` row. tt-publisher is what writes all
three.

CONSEQUENCE, MEASURED: the only compliant TikTok post this account has ever carried was
invisible to the dashboard, the redo loop and every count, from 2026-09-23 until it was
backfilled by hand on 2026-09-24 (`content_performance` 6736ed61, stamped
"TT0 proof post, direct adapter, backfilled 2026-09-24").

**Every production publish goes through tt-publisher.** A direct-adapter call is a probe
instrument only, and a probe that publishes must be followed by the row it did not write.

## TIKTOK TRUTH IS THE PUBLIC PAGE — ZERNIO IS A MIRROR

Zernio's counts disagree with each other and none is what TikTok serves. MEASURED 2026-09-24:

| source | says |
|---|---|
| TikTok Studio (operator) | 1 post |
| anonymous public page | 1 served; the other two return 10204 |
| Zernio `metadata.profileData.videoCount` | 1 |
| Zernio `externalPostCount` | 2 |
| Zernio `/posts` | 3 published on 2026-09-23 |

Zernio knows what it **sent**. It never learns that a post was removed.

### The readback (in `tt-publisher`'s reconcile, every tick)

Fetch the video URL **with no session** and read two fields from the payload:

* `"statusCode":0` — the item **is served** to a logged-out viewer
* `"statusCode":10204` — **not available** to that viewer
* `"playCount"` — the view counter on the same payload

Recorded into the calendar row's notes as `[tiktok-truth served statusCode=0 playCount=N …]`
or `[tiktok-truth NOT-SERVED statusCode=… …]`. An unreadable fetch records
`UNREADABLE` — **visibility unknown, never assumed**.

### *** THE TRAP: "Video currently unavailable" IS BOILERPLATE ***

That string is present in the page of a **known-public control video with 581,000 views**.
It lives in the i18n bundle and is not a state. Classifying on it reports a healthy post as
under review — which is exactly what the first pass of the 2026-09-24 probe nearly did.
**Only `statusCode` and `playCount` are diagnostic**, and a control fetch against a
known-public video is what proves the instrument before any zero is believed.

MEASURED on this account 2026-09-24:

| video | statusCode | playCount | verdict |
|---|---|---|---|
| 7688631701362183445 (TT0 proof, nomad-10) | 0 | 0 | served, cold start |
| 7688624687093484821 (rogue, nz-02) | 10204 | — | not available |
| 7688615744111267089 (rogue, us-02) | 10204 | — | not available |

## Accept-time id is NOT the video id

`platformPostId` at accept is a `v_pub_url~v2.<n>` form whose numeric tail is **not** the
video id (proof post: accept `…0720556517396`, reconciled `…1701362183445`). So
`published_url` is **NULL at accept** and filled by reconcile, which skips any value still
carrying `~`. Composing a URL from the accept-time value produces a dead link — the same
class of error that gave every X post a 404 for a week.

## Other measured rows

* Caption rides in the parent `content`; 564 chars accepted. Hard ceiling **untested**.
* `platformSpecificData.tiktokSettings` requires `content_preview_confirmed` **and**
  `express_consent_given`.
* First comment: **not supported** on this path.
* Link handling: no website field on this account. Captions end "Link in bio";
  **per-post attribution is not measurable today** — stated, not asserted.
* Hashtags: NONE, pending a measured proposal.
* Token `expires_in` 86400 (24h), refreshed by Zernio.
* Warm-up guard: TikTok is the ONLY platform in `WARM_UP_DAYS` (28 days), and `tt-publisher`
  is its only consumer (`lib/_warm-up-guard.ts:112`, `tt-publisher.ts:193`). That guard also
  performs the no-account / inactive / no-zernio_account_id checks, so a lane that opts OUT of
  it must make those three checks itself.

## Removals on this account — who removed what

RULED 2026-09-24, operator-stated: **the operator deleted both rogue posts.**

So although `7688624687093484821` (nz-02) and `7688615744111267089` (us-02) now return
`statusCode 10204` to an anonymous viewer, that is **our** deletion, not TikTok's.

> **The account has had NO TikTok-initiated removals as of 2026-09-24.**

This matters for how the readback is read: a 10204 means "not available to this viewer" and
says nothing about WHY. It is not evidence of a platform action. Both known 10204s on this
account are explained, and any future one must be explained before it is treated as a
moderation signal.

## `url` on content_performance — the platform post URL

RULED 2026-09-24. `url` is **the platform's own post URL** wherever the platform exposes one
(tiktok, youtube, linkedin). Calculator links go in the per-post link/UTM fields, **never** in
`url`. The column used to mean the destination on some rows and the post itself on others.

* tt-publisher writes `url: null` at insert — the accept-time id is not the video id — and the
  reconcile fills **both** `campaign_calendar.published_url` and `content_performance.url`
  from the platform's own id once it settles.
* **The nine pre-refit tiktok rows are NOT rewritten.** They are another account's history and
  carry the old convention; the doc records the change rather than editing the past.
* CONSEQUENCE, stated: a TikTok caption carries no URL (it ends "Link in bio"), so with the
  calculator link out of `url` there is now **no column on a tiktok row recording the
  calculator destination**. Per-post attribution on this lane was already not measurable
  (see the link-handling row above); this makes the absence explicit rather than papering
  over it with a link the post never carried.
