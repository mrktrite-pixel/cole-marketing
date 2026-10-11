---
name: cole-x-lane-reference
description: >
  The X (Twitter) lane for taxchecknow, end to end: architecture, standing rules of record,
  config, data shapes, operator surfaces, known limits, and the X0 probe that grounds it.
  Written from the live code and this branch's reports. Triggers for: "x lane", "twitter",
  "x-generator", "threadItems", "first reply", "x post band".
---

# COLE — X LANE REFERENCE
**2026-09-21 · taxchecknow · branch feat/self-approving-lane**

Every claim below is tagged:
**[MEASURED]** read from live data or the running code on 2026-09-21 ·
**[RULED]** an operator ruling · **[DOC]** Zernio's published documentation.

Paths verified against the working tree before writing. Values re-read live, not recalled.

---

## 1. ARCHITECTURE

```
x-generator (cron :20 past the hour)
    │   lib/bees/x-generator.ts          registered lib/bees/_registry.ts:23,76
    │   cron  /api/cron/x-generator      vercel.json:65-67  "20 * * * *"   [MEASURED]
    ▼
select from ALREADY-JUDGED BEATS (never assembles new propositions — §2.3)
    ▼
x-validate  lib/supply/x-validate.ts     9 authoring binds, weighted characters
    ▼
deterministic PRE-FILTER (reject-only, can never approve)   x-generator.ts judgeXPost()
    ▼
Sonnet judge  lib/supply/x-judge.ts      claude-sonnet-4-6, pass >= 70          [MEASURED]
    ▼
BLUE booking into campaign_calendar      platform='twitter', status='scheduled'
    ▼
scheduled-publisher  lib/bees/scheduled-publisher.ts
    │   due query covers both social lanes            :323  .in("platform",["linkedin","twitter"])
    │   X branch                                      :560  if (cal.platform === "twitter")
    ▼
Zernio adapter  lib/social-publisher/zernio.ts
        2-ITEM SELF-THREAD via platformSpecificData.threadItems
        invariant asserted before every send          :110, :116
    ▼
X — body as the root post, calculator link as the FIRST REPLY
```

Supporting:
- `lib/x/x-config.ts` — the lane's config loader (`X_PLATFORM = "twitter"`)
- `lib/dashboard/supply-health.ts:394` — `loadXSupply()`, the DQ picker's card numbers
- `app/dashboard/videos/_lib/video-command.ts:798` — X's own verdict branch

---

## 2. STANDING RULES OF RECORD

### 2.1 The link NEVER rides the body — `threadItems[1]` carries it **[RULED]**
X suppresses reach on posts carrying an outbound link in the body, worst of all for
non-Premium accounts. **[MEASURED]** from Zernio's account record for @taxchecknow on
2026-09-21: `isPremium: false`, `verifiedType: "none"`, `subscriptionType: "None"`,
`is_blue_verified: false` (the last from X's own public syndication endpoint). This account is
the worst case, so the first-reply rule is not a preference — it is the difference between
reach and none.

The body is figure-led text; the calculator link with its UTM goes in the first reply.

### 2.2 `threadItems[0]` carries the body — a NAMED INVARIANT **[RULED]**
**[DOC]** docs.zernio.com/platforms/twitter/posts, Step 3, verbatim:
> "Put the whole sequence in `platformSpecificData.threadItems`. The first item is the root
> post and each later item replies to the one before it."
> **"When `threadItems` is set, the top-level `content` is stored for display and search only
> and is NOT published, so the first post goes in `threadItems[0]`."**

Set `content` alone alongside `threadItems` and an **empty thread publishes** — silent, public,
un-publishable-back. The adapter therefore THROWS before the network call if
`threadItems[0].content` is empty or does not match the caller's text, and again if
`threadItems[1]` is empty (`zernio.ts:110`, `:116`). The trap is structurally impossible, not
merely currently avoided.

### 2.3 The composer SELECTS FROM JUDGED BEATS — the true-figures/false-proposition doctrine **[RULED]**
**This is the lane's most important rule and it now stands as doctrine for every text lane.**

The first implementation assembled sentences from the product's verified figure pool:
`"the {authority} threshold moved from {money[1]} to {money[0]}"`. **Every number it used was
verified. The output was still capable of being false**, because it invented the RELATIONSHIP
between them.

**[MEASURED]** the example that caught it — au-19's figure set yields "$750,000 to $0", a real
change over time confirmed against the corpus. The **same template** applied to nomad-10's set
yields:

> **"the rate went from 47% to 24%"**

and those are **two alternative rates** — the Beckham Law flat rate versus Spain's progressive
top rate — **not a change**. True figures, false proposition. The fabrication gate would have
passed it, because the gate checks TOKENS against the corpus, not the CLAIMS built from them.

So the composer selects whole sentences from the artifact's own **beats** — text a Sonnet judge
already scored and passed in the supply lane, carrying its figures in relationships the corpus
supports. It selects and trims; **it never asserts anything new**. Sentences are omitted, never
rewritten.

**[MEASURED]** How it reaches the band: beats run 76-185 weighted characters (written for a
35-second spoken short). On au-19, **no contiguous run of beats lands inside 240-259 at all**
(79+101=180; the next takes it to 265). So the search is over SUBSETS in authored order,
optionally opened by the artifact's chosen hook — 5-6 beats means at most 64 combinations, so
it is exhaustive rather than greedy.

### 2.4 Brand voice — no persona, no byline **[RULED]**
The **inverse** of the LinkedIn rule, deliberately. LinkedIn assigns a character per country
prefix (Gary Mitchell for `au-`, Priya Sharma for `nomad-`). X has no such mapping, and
inventing one would put words in a fictional person's mouth **on a public timeline under a
brand handle**. The validator enforces no first-person voice (`persona_brand_voice`).

### 2.5 Platform string **[RULED]**
`"twitter"` everywhere machine-facing — Zernio calls, `platform_accounts`,
`campaign_calendar.platform`, `content_performance.platform`, the `Lane` union.
`"X"` is a **UI label only** (`LANE_LABEL`/`LANE_NAME` in video-command.ts:187,189; the picker's
`VIEWS` map in Overview.tsx:23). **[MEASURED]** `X_PLATFORM === "twitter"`.

### 2.6 Weighted characters **[DOC]** + **[MEASURED]**
X counts **a URL as 23 characters whatever its length** and **an emoji as 2**. Free-account
ceiling **280** (Premium 25,000). The band is measured on the weighted count, never
`str.length`: `URL_WEIGHT = 23`, `X_HARD_LIMIT = 280`, `X_MIN_CHARS = 240`, `X_MAX_CHARS = 259`
(x-validate.ts:17,19,21,22). **[MEASURED]** `xLength("https://a.example.com/very/long/path?q=1")`
returns **23**.

Counting naively would let a 259-"character" post carrying a 90-character link pass a local
check and fail at publish with "Tweet text is too long".

### 2.7 Dedupe at AUTHORING **[RULED]**
**[DOC]** "X also rejects a post whose text matches one it already has." Discovering that at
publish costs the slot and leaves a booked row that can never succeed. `x-generator` builds a
corpus of every prior X body for the account and refuses a match **before** booking
(`dedupeKey()` folds case and whitespace, so a trivially-reworded repeat is caught too).

### 2.8 No hashtags **[RULED]** — off-doctrine for this lane; enforced on body and reply.

### 2.9 `FIGURE_RE` is the ONE figure definition **[RULED]**
`x-validate.ts:35`, exported, used by the composer, the pre-filter and the validator. There
were briefly **three** divergent copies disagreeing about currency symbols, so a correctly
composed €600,000 post scored one figure short and failed the bar. Same class as `views_7d`,
the cadence constants, and the two "future slot" definitions. A new currency or unit is added
**here** and every reader gets it.

### 2.10 Cadence — config-owned, never code constants **[RULED]**
3/day, UTC slot times, with the city table in the config file (§3). Max **1 post per product
per day**; ordering **never-posted-first, then least-recently-posted**. All four decided from
the CALENDAR, not from counters the bee keeps in memory. Slot occupancy is tracked as
`(date|time)` pairs — without that, every caller picks the first future time and two posts book
the same instant (**[MEASURED]** — that is exactly what the first live run did).

### 2.11 Async shape — Zernio-accept IS success **[RULED]**
The publish latch is stamped **before** the Zernio call; a Zernio **accept** is the success
condition; ids are recorded the moment Zernio returns them; the platform outcome is reconciled
later rather than waited on. **There is no 240s timeout trap in this lane because nothing here
waits.** The rule exists because of the LinkedIn lane: **[MEASURED]** Zernio accepted in 0.6s
and LinkedIn actually published **11.5 minutes later**, timing the bee out at 240s while the
post was already live.

### 2.12 R-X3 — FREE tier **[RULED]**
The account stays free: test first, upgrade on evidence. X metrics are therefore read as
**free-tier, link-suppressed** numbers, and **no verdict about content quality is drawn from
reach alone** while free. The Premium decision revisits once 2+ weeks of publish data exist.

---

## 3. CONFIG

`knowledge/X-CONFIG-taxchecknow.md`, loaded by `lib/x/x-config.ts`. **BOTH COPIES EXIST**
**[MEASURED]**:
- `soverella/bees-snapshot/knowledge/X-CONFIG-taxchecknow.md` — **PRODUCTION READS THIS ONE**
- `cole-marketing/knowledge/X-CONFIG-taxchecknow.md` — read first in local dev

`lib/youtube/config-util.ts` tries `../cole-marketing/<rel>` then `bees-snapshot/<rel>`. Vercel
has no sibling `cole-marketing`, so prod falls through to bees-snapshot. **[MEASURED]** a live
load reports `_source = …/bees-snapshot/knowledge/X-CONFIG-taxchecknow.md`, `_flags = []`.

| key | value | note |
|---|---|---|
| `slot_times_utc` | `["02:00","05:00","08:00"]` | **UTC**, deliberately not local |
| `per_day` | `3` | site-wide **[RULED]** |
| `buffer_target` | `5` | future booked rows kept ahead |
| `band` | `{min: 240, max: 259}` | X-weighted characters |
| `judge_min_score` | `70` | Sonnet pass mark |
| `plan_ahead_days` | `3` | |

**Why UTC and not a local time.** "AU weekday peak" is not one clock — Sydney and Perth differ
by 2-3 hours, so a single local time labelled "peak" is peak in one city and mid-morning in the
other. The file carries the table:

| UTC | AEST (Sydney) | AWST (Perth) |
|---|---|---|
| 02:00 | 12:00 | 10:00 |
| 05:00 | 15:00 | 13:00 |
| 08:00 | 18:00 | 16:00 |

The AU midday-to-evening window, three hours apart so they cannot bunch. The loader **caps and
flags** if `per_day` exceeds the number of slot times — there is nowhere to put the extra post.

---

## 4. DATA

### `campaign_calendar` — an X row **[MEASURED]**, live
```json
{ "platform": "twitter", "format_type": "text", "content_type": "x_post",
  "status": "scheduled", "scheduled_date": "2026-09-22", "publish_time": "02:00:00",
  "notes": "x-generator post 6d087d21-52a5-42b6-9614-959a65533687",
  "created_by": "campaign-conductor", "character_name": null, "lane": null }
```
`notes` carries the post id — that is how the executor finds the body. `created_by` is a
**column default**, not the real author; the notes name the real one. `lane` is unused by X.

### `content_jobs.output_data.x_posts[]` **[MEASURED]**, live keys
`id, body, judge, reply, status, authority, authored_at, product_key, utm_content,
figures_used, weighted_length`

Live sample: `{id 1e2fc6d6…, status "booked", weighted_length 255, judge 72, utm_content ===
id}`. **`utm_content` is the post's own id — H6 from day one.**

Optional fields on the `XPost` type, set on publish: `zernio_post_id`, `platform_post_id`, and
`reply_platform_post_id` — **[MEASURED]** the last is absent on every stored row, see §6.

### `platform_accounts` **[MEASURED]**, live
```
platform twitter · account_handle taxchecknow · zernio_account_id 6ab10c038d284ffb21260552
is_active true · env_var_name ZERNIO_API_KEY · character_name "taxchecknow"
```
**CHARACTER_NAME CAVEAT.** The column is `NOT NULL`, so it cannot express "no persona". It
holds the **brand handle**, which is NOT a character assignment — the `notes` field records the
ruling explicitly so nobody later reads that value as a persona. (`env_var_name` is likewise
NOT NULL and holds `ZERNIO_API_KEY`.)

---

## 5. OPERATOR SURFACES

**Video Command is the X surface. There is no X cockpit** — one truth surface per lane is the
consolidation ruling.

- **Product cards** — X joins `posting on: YT / LI / X` with its own tick, cross or dash, and
  the full per-lane verdict in the tooltip. The card headline is the **worst** lane.
- **Pause X** — a per-lane pause beside the master STOP. Pause holds ONE platform; STOP stops
  all. Honoured at the X executor and in `x-generator`'s roster.
- **Verdicts** — X has its own text and never inherits another lane's
  (`video-command.ts:798`): *"ON, but no X slot is booked."* with the fix naming x-generator,
  its 3/day cap, its ordering and its :20 cron.
- **DQ picker** — an X card alongside YouTube/LinkedIn/TikTok, numbers from `loadXSupply()`
  (`supply-health.ts:394`), opening **Video Command →**. Runway is **blue only** (amber is
  residue, not supply) and thresholds derive from the buffer target.
- **Performance tab — what it CAN and CANNOT show.** It shows the **publish record only**:
  that a post went out, when, and its Zernio id. It shows **no engagement at all**, because
  **[MEASURED]** `xCapabilities = {analytics: false, inbox: false}` on this account — Zernio
  cannot read X analytics for it. The panel states that fact plus the free-tier reading
  (§2.12). **It never renders zeros for unavailable metrics.**

---

## 6. KNOWN LIMITS & OPEN ITEMS

1. **The reply's own tweet id is unobtainable** **[MEASURED]**. Zernio stores `threadItems`
   but exposes **no per-item `platformPostId`**, and its lookup endpoint
   `GET /v1/twitter/tweet` returned **403** for this account — consistent with the documented
   X passthrough billing gate, not a scope problem (`tweet.read` IS granted). Evidence that a
   reply exists is X's own `conversation_count` plus Zernio's stored `threadItems[1]`.
   **[RULED]** record the id if the operator supplies it from the thread view; build no
   scraper. `XPost.reply_platform_post_id` waits for it and is empty on every row today.
2. **X analytics unavailable** — `xCapabilities.analytics = false`. Not a bug to fix here; the
   panel says so.
3. **The third X slot stays empty until nomad-03 has judged content** **[MEASURED]**. 3/day is
   a CAP; fill = min(cap, products with judged artifacts). nomad-03 is Live and ticked but has
   **0** s2 artifacts, so there is nothing judged-safe to derive from and it is parked by name
   on every generator run.
4. **Attribution is ALREADY SOLVED here — the contrast worth stating.** LinkedIn publishes
   with `utm_content=v1` on every post, so its traffic cannot be attributed to a specific post
   (the ruled LI-H6 slice is still outstanding). **X binds `utm_content` to the post's own id
   at AUTHORING, from day one** — **[MEASURED]** on both booked posts, `utm_content === id`.
   The X lane has no v1 debt to repay.

---

## 7. THE X0 PROBE — the empirical ground the lane stands on

Reproduced from `reports/2026-09-21-X0-zernio-x-probe.txt`. The probe post is **real, public,
and the lane's first** — X has no unlisted mode, which is why the probe doubles as post #1.

**IDs** — Zernio post `6ab10e17d59140d67eeaa339` · X status `2101989715998113970` ·
published `2026-09-21T10:59:36.563Z` ·
public `https://x.com/taxchecknow/status/2101989715998113970`

**THE BODY** (257 weighted characters):
> From 1 January 2025 the ATO cut the foreign resident capital gains withholding threshold from
> $750,000 to $0 and raised the rate from 12.5% to 15%. Every Australian property sale now needs
> a clearance certificate before settlement. Processing takes 28 days.

Figures grounded live against `taxchecknow.com/api/rules/frcgw-clearance-certificate`:
threshold `$750,000 → $0`, rate `12.5% → 15%`, effective `1 January 2025`, authority **ATO**,
TAA 1953 Sch 1 Subdiv 14-D.

**TRUTH TABLE** — verified against X's own public endpoint, not only Zernio:

| claim | evidence | verdict |
|---|---|---|
| post is live | X syndication `id_str 2101989715998113970` | TRUE |
| text published verbatim | syndication text === the authored body | TRUE |
| length as computed | `display_text_range [0,257]` — matches the validator's 257 exactly | TRUE |
| author is the right account | `screen_name "taxchecknow"`, id `2101984773237551104` | TRUE |
| account is non-Premium | `is_blue_verified false`, `verified false` | TRUE |
| a reply exists on the post | syndication `conversation_count = 1` | TRUE |
| reply carries the link + utm | Zernio `threadItems[1]` stored with the URL | TRUE |
| no link in the body | syndication `entities = {}` (no urls) | TRUE |
| Zernio post state | `status "published"`, `publishAttempts 0`, no error | TRUE |

**WHAT THE PROBE COULD NOT ESTABLISH**, stated rather than glossed: the reply's own tweet id
(§6.1). The author of this document did not open X in a browser; the evidence is the API.

---

## PROVENANCE

Built and ruled across 2026-09-21. Source reports, all in `CitationGap/reports/`:
`2026-09-21-X0-zernio-x-probe.txt` · `2026-09-21-X1-lane-complete.txt` ·
`2026-09-21-picker-x-card.txt` · `2026-09-21-li-runway-rulings.txt`.
Commits: `282651b` (X0) · `6a615f7` (X1) · `c2aad25` · picker slice · `d45cdbe` (runway).
