# YTS BUILD — FINAL
## YouTube Shorts Pipeline · Distribution Queen V2 · taxchecknow
**Status:** Phase A complete through Step 10a (scheduler live, pre-cron) · Steps 10b / yt-m2 / 11 / 12 outstanding
**Doc home:** `soverella/docs/help/distribution-queen-v2/YTS-BUILD-FINAL.md` (mirror to `cole-marketing` per durable-docs convention)
**Date ratified:** 2026-06-11 (AWST)

---

## 0. WHAT THIS IS

The complete record of the autonomous YouTube Shorts (YTS) pipeline built for
taxchecknow under the COLE Distribution Queen: what exists, why each piece is
shaped the way it is, every hard rule learned in live contact, and what a
replicator must change to stand this up for a new site.

Every video has ONE job: send someone to a calculator page, measurably.

```
PLAN -> SCRIPT -> GATE-1 -> RENDER -> MINT -> GATE-2 (human) -> PUBLISH
  -> STAMP (UTM) -> MEASURE (snapshots + conversions) -> VERDICT
  -> REWRAP (packaging / hook) -> back to MEASURE
```

The system plans its own calendar, produces its own videos, publishes on its
own slots, attributes its own revenue, and reworks its own failures. The single
human touchpoint is Gate-2 approval — by ratified ruling, that judgment migrates
to a bee (yt-m2) and the human click becomes oversight, then retires.

---

## 1. THE CADENCE CONTRACT (RATIFIED — operator, 2026-06-11)

```
3 posts per day            (lanes config; manual posts COUNT against the 3)
3-day planning horizon     (plan_ahead_days: 3 — day 4+ does not exist yet)
4–6h spacing               (slot_times: 09:00 / 14:00 / 19:00 AWST)
```

Key semantics, in the operator's own framing:
- The horizon is a **visibility window, not a delay**. Approval never changes
  timing; the calendar owns timing. Approve anytime, in any order.
- At most ~9 slots exist at any moment; each daily tick rolls the window
  forward one day, planned against live data (verdicts will claim future
  slots from foundlings — never over-commit).
- Retuning is a one-line YAML edit in the config file. No code, no deploy
  logic. This was exercised live (plan_ahead_days 2→3).

---

## 2. ARCHITECTURE AT A GLANCE

```
soverella (Next.js / Vercel)          cluster-worldwide/taxchecknow      cole-marketing
  lib/bees/yt-s1..s4, yts-scheduler     components/UtmCapture.tsx          knowledge/YTS-CONFIG-taxchecknow.md
  lib/youtube/* (oauth, stamp, ...)     decision_sessions UTM persist      (durable design docs, lessons)
  lib/render/* (enqueue, bridge)
  app/dashboard/monitor/distribution-queen (Gate-1 + Gate-2 inboxes)
  app/dashboard/queue (calendar view of campaign_calendar)
  .github/workflows/render.yml (GHA render worker)
  bees-snapshot/ (build-time sync of cole-marketing specs + knowledge)

Supabase = the shared data plane (project ngxuroxsabyamqcnvrei)
YouTube publishing = Zernio · YouTube edit/analytics = Google OAuth
  (two verbs, two credentials — ruled non-conflicting)
Render engine = Remotion in render-engine/, executed by the GHA worker
```

**There is NO orchestrator.** The pipeline is an implicit state machine over
`content_jobs.output_data` keys. Each bee reads the state, does one thing,
writes one key. The scheduler is just a clock that pokes the state machine.

State key ladder on `content_jobs.output_data` (per product, single-slot):
```
youtube_short_script        (yt-s1 writes; force=true overwrites in place)
youtube_gate                (yt-m-gate writes pass/fail)
youtube_script_approved_at  (Gate-1 stamp — dashboard server action)
youtube_render              (enqueue + reconcile write status/video_url/content_asset_id)
youtube_publish             (yt-s3/bridge write zernio id, watch_url, visibility)
youtube_targeting / youtube_history[]   (rewrap arm archives prior generations)
```

Multiplicity lives in `content_assets` (sequence_number, version_letter,
parent_asset_id lineage), NOT in content_jobs. yt-s3 publishes only
`status='approved'` assets and goes `blocked_ambiguous` if more than one
approved asset exists for a product — which is why duplicate approvals are
landmines (see §9 lessons).

---

## 3. DATA MODEL — THE TABLES THAT MATTER

| Table | Role | Critical columns / facts |
|---|---|---|
| `content_jobs` | One row per product; the de-facto 47-product job board and state machine | `product_key`, `output_data` (the key ladder above) |
| `content_assets` | Every rendered video, with lineage | `asset_type='video'`, `status`: rendering → manual_pending → approved/rejected → published; `parent_asset_id`; `asset_name` convention `taxchecknow-<pk>-yt-<yyyymmdd>-<seq><ver>` |
| `render_jobs` | GHA worker queue | `props_json` (inputs only — hook, scriptText, ctaText, hookStat, ruleSource…), `video_url`, `status`. **No post-render metadata exists** (no duration/audio) until 10b ffprobe write-back |
| `campaign_calendar` | THE queue, all platforms | 16 cols + `lane` (added Step 10a): `scheduled_date`+`publish_time` (UTC) +`platform`+`product_key`+`status`+`lane` (`foundling`/`winner_rewrap`/`loser_rewrap`/`manual`); transitions scheduled→published by executors; rendered by `/dashboard/queue` |
| `content_performance` | Per-VIDEO performance row (bridge-created) | `product_key` (bridge writes it forward — Step 9 root fix), `youtube_video_id`, `published_at`, snapshots feed it; keyed per-video NEVER per-product |
| `youtube_rewraps` | Rewrap dispatch ledger | `verdict_id` idempotency, `kind` (packaging/hook), `product_key`; caps enforced here (packaging cap=2 per VIDEO, hook cap=2 per PRODUCT) |
| `decision_sessions` | Site-side sessions | + 4 UTM cols (Step 8b): `utm_source/medium/campaign/content` (trimmed, cap 100); joins to `purchases` via Stripe metadata `decision_session_id` |
| `products` | The product registry (Step 9) | 48 rows; `answer_path` jsonb + `has_answer_path`; pricing cols ruled NULLABLE (never invent Stripe keys); orphan `au-division-293-tax-calculation` left untouched, flagged |
| `strategic_queen_product_embeddings` | Bee-3 dedup vectors | Keyed on products UUID; **42 new rows un-embedded** until `OPENAI_API_KEY` is local (flagged 2026-06-11) |

---

## 4. THE PIPELINE, STAGE BY STAGE

### 4.1 Plan (yts-scheduler PLANNER — Step 10a)
Registered bee `yts-scheduler` (in `lib/bees/_registry.ts`), runnable via
`/api/cron/[bee]` and `scripts/run-yts-scheduler.ts` (DRY BY DEFAULT, `--live`).
Each tick, in order:

a. **RECONCILE** — render_jobs `done` whose product has NO content_assets video
   → patch `youtube_render` + yt-s2 self-heal mint (payload
   `engine:"json2video"` guard-bypass). This made the GHA worker's
   missing write-back a routine repair instead of manual ops.
   GUARD: skip products that already have ANY content_assets video —
   a missing `content_asset_id` on a published cohort row is unbackfilled
   linkage, not a missing mint (live-caught false positive, fixed).

b. **PLAN SLOTS** — for today..+plan_ahead_days, fill `campaign_calendar`
   youtube/short rows per config lanes from `getFoundlingPool()`:
   - per-slot (date,time) taken-set — a slot is filled once (idempotency,
     live-caught: dry runs against an empty calendar cannot expose this)
   - per-AWST-day cap = calendar rows + **bridged publishes** + planned
     (one set of books: manual posts count — operator-caught hole)
   - **HELD-SKIP**: a product with an approved-but-unpublished asset is
     operator-paced; never auto-drawn; reported, never silent
   - pool short → cascade foundling → winner_rewrap → loser_rewrap →
     FEWER (never filler) + `build_more_products` signal

c. **INITIATE PRODUCTION** — planned slot, no approved asset, not
   mid-pipeline → yt-s1 (script) → yt-m-gate (fail → flag, slot rolls) →
   `enqueueRender`. Gate-2 stays human (for now — see §8 yt-m2).

### 4.2 Render (GHA worker)
`.github/workflows/render.yml`: triggers = `workflow_dispatch`,
`repository_dispatch:[render]` (NOT WIRED — needs M3.1 token),
`schedule */30` (**heavily throttled by GitHub: real gaps 1.7–3.9h;
~55s runs are empty polls**). `ci/run-jobs.mjs` **drains ALL queued jobs in
one run** (the limit=1 reading was wrong — proven: one dispatch cleared 5
renders in 12 min, run #28). Practical implication: one manual
`workflow_dispatch` clears any backlog; M3.1 makes it instant.

### 4.3 Mint → Gate-2 (Step 10c)
yt-s2 mints `content_assets` `manual_pending`. The Gate-2 inbox
(`lib/dashboard/youtube-asset-inbox.ts` + `_components/AssetInbox.tsx` on the
distribution-queen page, surfaced TOP of the YouTube view via the
`?platform=` pill filter) shows product name (registry-resolved, acronyms
uppercased), preview, Approve/Reject. Server actions `approveAsset` /
`rejectAsset(reason REQUIRED, logged)` in `_actions.ts`:
- guarded to `manual_pending` + optimistic `.eq("status","manual_pending")`
  — published/rejected rows can never be resurrected via the UI
- a wrong approve is fixed by operator SQL (happened live; see §9)

### 4.4 Publish (yts-scheduler EXECUTOR + bridge)
Due slot (scheduled, time passed) WITH an approved asset → yt-s3 with the
EXPLICIT `content_asset_id` (never auto-resolve) → `bridgeYoutubePublish`
(inserts the per-video `content_performance` row, writes `product_key`
forward, self-stamps UTM) → slot `published` + `published_url`.
Hard rules: NEVER publish unapproved · never cram · overdue >60min grace →
**cap-aware roll** to the nearest day with capacity (R2a+R4) ·
`lane='manual'` slots are reservations: counted by the cap, SKIPPED by the
executor, reported "manual-held".

yt-s3 publishes via Zernio; the video id is resolved post-hoc via
`forHandle` channel read (uploads lag — single reads are never ground truth,
re-verify; au-15 and can-04 both resolved on a later pass).

### 4.5 Stamp + Measure (Step 8 — the attribution circuit)
- **8a** `stampVideoUtm`: rewrite description `utm_content` → the VIDEO ID
  (idempotent regex), post-publish; self-stamp wired into the bridge and the
  hook dispatcher's Stage C. Ruled: utm_content = video id.
- **8b** site-side: `components/UtmCapture.tsx` (first-touch sessionStorage
  `tcn_utm` + a global fetch wrapper — zero per-calculator edits) persists
  the 4 utm cols onto `decision_sessions`.
- **8c** `getVideoConversions`: sessions = decision_sessions
  (utm_source=youtube, utm_content=<vid>); conversions = join purchases.
  **MEASURED-SINCE epoch** `UTM_MEASURED_SINCE='2026-06-11T00:35:00Z'` +
  full 7-day window: a video is `measured:true` only when its whole window
  post-dates the circuit, so a measured ZERO genuinely means "could have
  converted and didn't" (pre-epoch cohort reports measured:false, ignored
  by money verdicts). First measurable videos: can-04, au-14 (~June 18–19).

### 4.6 Verdict → Rewrap (Step 7 arm)
yt-reaction reads snapshots (+ conversions per 8c) → verdict ladder →
`youtube_rewraps` dispatch:
- **Packaging rewrap (7b/7c/7d)**: thumbnail (`render-engine/src/Thumbnail.tsx`,
  1080×1920 still, fps1, figure fontSize ladder ≤4→300/≤6→240/≤8→190/else 150)
  and/or title via edit-in-place (`applyPackaging`: merge-snippet wipe-trap
  guard, dual lag-safe re-verify immediate+60s, **NEVER writes
  privacyStatus** — A4 contract; `lib/youtube/unlist.ts` is the ONLY
  privacy writer). Cap 2 per VIDEO. constrained/thin_grounding →
  thumbnail-only.
- **Hook rewrap (7e)**: stage-inferring — STAGE A archives output_data →
  `youtube_history[]` + yt-s1 force re-script + gate + enqueueRender;
  STAGE C publishes the new asset (explicit id), UNLISTS the loser,
  `parent_asset_id` lineage, bridge keys per-video. Cap 2 per PRODUCT
  (per-video would never accumulate — each generation is a new video id).

---

## 5. THE CONFIG FILE — PORTABILITY SPINE

`cole-marketing/knowledge/YTS-CONFIG-taxchecknow.md` — prose rationale + ONE
fenced yaml block:

```yaml
lanes: { foundling: 3, winner_rewrap: 0, loser_rewrap: 0 }   # bootstrap mix
slot_times: ["09:00", "14:00", "19:00"]                       # AWST
min_spacing_hours: 4
plan_ahead_days: 3
packaging_rewrap_cap: 2
hook_rewrap_cap: 2
maturity_view_floor: 300        # acknowledged placeholder
```

Loader `lib/youtube/yts-config.ts` (js-yaml): reads `../cole-marketing` in
dev, `bees-snapshot/knowledge/` in prod (the prebuild `sync-bee-specs`
mirrors it). **EVERY key has an in-code default** — a missing file or a bad
edit degrades, never throws. Lane targets exceeding slot capacity → cap +
flag, never cram. This is the first runtime-parsed config in the colony
(frontmatter elsewhere is loader metadata only) — a deliberate ruling.

Operator retune = edit YAML in cole-marketing → commit cole-marketing →
soverella build re-syncs. (See ordering rule, §9.)

---

## 6. BUILD RECORD — STEPS + COMMITS (soverella `main` unless noted)

| Step | What | Key commits / facts |
|---|---|---|
| 1–6 | Checks, publish bridge, yt-reaction, resolver/OAuth, snapshots | (prior sessions — see Phase-A handover) |
| 7b | Thumbnail generator | `f80c9fb` — Thumbnail.tsx + `_render-thumbs.mjs` (always emits explicit figure ""), figure-leak + long-figure clip fixed |
| 7c | Edit-in-place applier | `45055d3` — oauth.ts, edit-in-place.ts (wipe-trap guard, dual re-verify, A4: never writes privacy), canary-locked runner. Live-proven on `xDz0hE3kmqk` |
| 7d | Packaging dispatcher | migration `22fcbcc` + `85e729e` — youtube_rewraps (+product_key ALTER), verdict-gated, idempotent on verdict_id |
| 7e | Hook dispatcher | `03d4960` m `d78a68a` — resolve-video.ts, unlist.ts (sole privacy writer), rewrap-hook.ts (stage-inferring, lineage) |
| 8a | UTM stamper | `1c0c2a6` m `35eb8a1` — stamp-utm.ts; 6/6 cohort live-stamped dual-verified |
| 8b | Site capture | taxchecknow `ee4bef2` m `2e60cb3` + migration `6cd3eae` — UtmCapture.tsx, 4 utm cols |
| 8c | Conversion read | `8ec5912` m `84efc00` — conversion-read.ts, measured-since epoch, yt-reaction null replaced |
| 9 | Product registry | `1cd373a` m `9764ab1` — backfill 6→48 (pricing-nullable migration ruled mid-live), sync-answer-paths 35/35, cp.product_key repair 7/7 + bridge root fix, foundling pool=29, acronym map + `ANSWER_PATH_ALIASES` (alias-pending-generator-fix) |
| 10c | Gate-2 UI | `0ba1520` m `e98619f` — asset inbox loader, approve/rejectAsset guarded actions, AssetInbox.tsx |
| 10a | Scheduler + config | `c12db43`+`5628cec` m `e0282cd` (cole-marketing `1d9176b`); js-yaml dep added (build-forced, flagged) |
| 10a guard | Held-skip + slot idempotency | `8964560` m `5c67e60` — operator-held draw skip + per-slot taken-set + per-day cap (live-exposed bug) |
| Filter | DQ platform pills | `d712484` m `44be035` — `?platform=` navigation, YouTube view = inboxes on TOP |
| Cadence pack | R2–R5 (in flight at doc time) | overdue-grace, true per-day cap (calendar+bridged+manual), au-14 `lane='manual'` reservation, cap-aware roll, plan_ahead_days 2→3 |

Deploy pattern (every step): branch `phase-a/*` → explicit adds (NEVER
`git add .`) → `merge --no-ff` to main → local `npm run build` gate
(snapshot-fresh guard) → push → **operator verifies Vercel green**
(committed ≠ deployed).

---

## 7. THE PROVING RUN (2026-06-11) — END-TO-END EVIDENCE

```
TICK 1 (--live): 5 slots planned+inserted (lane=foundling, by=yts-scheduler)
                 5 productions: yt-s1 -> gate PASS -> renders enqueued
                 publishes 0 · pool guard verified (can-04 exited on air)
DRAIN:           1 workflow_dispatch -> run #28 -> ALL 5 rendered in 734s
TICK 2 (--live): RECONCILE minted 5 -> manual_pending -> Gate-2 inbox
                 (au-13 ea1c3085 · au-02 82e2dd91 · au-08 3dec3c53 ·
                  uk-06 85041668 · uk-02 04a73388)
                 au-14 held-skip reported · plan/initiate 0 · publishes 0
OPERATOR:        judges 5 at the inbox (the first labeled dataset for yt-m2)
TICK 3:          publishes due+approved at slots — post cadence-pack,
                 expected ~0 same-day (the executor respects the books)
CRON:            ships ONLY after a clean tick 3 — one vercel.json line,
                 own commit. Pre-cron requirements: overdue-grace + true
                 per-day cap MUST be live first (ratified).
```

Five machine-chosen, machine-scripted, machine-rendered videos reached the
human gate with zero manual ops. The trio-gap that was hand-cranked a week
prior is now a routine reconcile.

---

## 8. GOVERNANCE — GATES, AND WHERE JUDGMENT LIVES (RATIFIED RULINGS)

- **Gate-1 (script)**: human approve on the DQ dashboard (youtube_script_approved_at).
- **Gate-2 (video)**: human approve/reject at the AssetInbox. Approval is a
  QUALITY verdict only; the calendar owns timing. Approve ≠ post.
- **Operator ruling (2026-06-11)**: "the click is fine — the DECISION must
  become the bees', learning and getting better." Therefore:
  - **10b** (next): deterministic floor — ffprobe at the GHA worker writes
    back duration / audio-present / size; floor-fails flag and never reach
    the inbox; + hidden-this-week counter, stuck-foundling flag.
  - **yt-m2** (promoted, builds after 10b, before Step 11): the judging bee
    grades each render against explicit criteria (hook in first 2s,
    script-to-video fidelity, legibility, pacing, figure prominence) and
    puts score + recommendation + reasons ON the inbox card. The human
    click becomes oversight. Every override is captured as a labeled
    training example; published performance later scores the bee's own
    grades. `auto_approve: true` flips on (config) when agreement rate +
    grade-performance correlation EARN it — evidence, not faith.
- The operator's veto for marginal scheduled items is the approval itself:
  unapproved at slot+grace simply cap-aware-rolls. No special action.

---

## 9. HARD RULES + LESSONS (PAID FOR IN LIVE CONTACT)

1. **Probe before build; dry before live; canary before drain.** Dry runs
   validate LOGIC; live runs validate SCHEMA and STATE (the products
   NOT-NULL stop, the slot-idempotency bug, the reconcile false-positive
   were all live-only finds).
2. **Committed ≠ deployed** — operator eyeballs every Vercel green.
   **"Success. No rows returned" ≠ rows changed** — verify UPDATEs with a
   SELECT.
3. **YouTube reads can be stale for days; a single read is never ground
   truth.** Re-verify on a second pass (the " ·" title "contamination" was
   a stale-READ phantom; uploads lag forHandle).
4. **Never invent Stripe keys / pricing** — stop and rule (pricing went
   nullable instead).
5. **Cole-marketing-first commit ordering**: when a step adds a
   cole-marketing file, commit cole-marketing FIRST, then build/commit
   soverella — otherwise the manifest stamps a stale sha and must be
   re-stamped (`npx tsx scripts/sync-bee-specs.ts` + follow-up commit).
6. **One set of books**: anything that publishes must be visible to the cap
   — manual posts count (bridged rows), manual holds are `lane='manual'`
   calendar reservations. Ghosts cause over-publish.
7. **Approved duplicates are landmines** (blocked_ambiguous + Stage-C false
   positives). The Gate-2 guard prevents UI resurrection; a mistaken
   approve is fixed by operator SQL. Backlog: confirm-step on Approve when
   the product already has a published video.
8. **Never publish unapproved. Never cram. Never late-fire past grace.**
9. Module-init cycles (_registry → bee → bee-runner → _registry): lazy-import
   `runBee` inside the bee function.
10. The reject reason is REQUIRED and logged — every rejection is yt-m2
    curriculum.

---

## 10. OPERATIONS RUNBOOK

```
Manual tick:        npx tsx scripts/run-yts-scheduler.ts          (dry)
                    npx tsx scripts/run-yts-scheduler.ts --live
Drain renders now:  POST workflow_dispatch to render.yml (one run drains all)
Foundling pool:     npx tsx scripts/run-foundlings.ts             (live reader)
Rewrap dispatchers: scripts/run-rewrap-dispatcher.ts / run-hook-rewrap.ts (dry default)
Stamp a video:      scripts/run-stamp-utm.ts
Approve/Reject:     /dashboard/monitor/distribution-queen?platform=youtube
Calendar:           /dashboard/queue (AWST display; lane-stamped)
Retune cadence:     edit YAML in cole-marketing/knowledge/YTS-CONFIG-*.md
                    -> commit cole-marketing -> soverella build+commit
```

Env (Vercel canonical, `cole-marketing/.env.local` mirror):
`YOUTUBE_OAUTH_*`, `YOUTUBE_API_KEY`, Supabase, Zernio.
Missing at doc time: `OPENAI_API_KEY` locally (42 registry embeddings
pending — Bee-3 dedup blind on the new rows until run; idempotent).

---

## 11. OUTSTANDING (AT DOC TIME)

Sequence: clean TICK 3 → **cron entry** (one vercel.json line, own commit)
→ **M3.1** (operator: fine-grained GitHub PAT scoped to soverella,
Actions/contents perms → wire enqueueRender → repository_dispatch; kills
the throttled-poll wait; the drain-loop option is CANCELLED — worker
already drains all) → **10b** → **yt-m2** → Step 11 (Winners board →
EXPAND; pool ~9 days at 3/day forces the build_more signal on schedule)
→ Step 12 cleanup (retire shorts_* tables — view DDL dump owed; revert
taxchecknow 7074ac3/8f3e0a1; parameterise base domain in record-calc.mjs /
build-answer-paths.mjs; rule phase-a/ingest-repoint).

Backlog (one deliberate pass): dashboard display fix (views_30d, slug
fallback) · YTL/YTS split · yt-s1 re-scripts (183-day thin grounding,
frcgw $0 framing) + figure/text dedupe · title-provenance mismatch ·
categoryId 22-vs-27 · 16:9 thumbnail variant (data-decided post-CTR) ·
Windows npx wrinkle · tsconfig glob · TTL automation (July 1 re-arm is a
HARD date) · likes/comments enrichment · Analytics API re-probe June 13–14 ·
Session A Vercel read access · visibility metadata reconcile · registry
pricing enrichment · alias retirement at the answer-paths generator ·
Gate-2 approve-confirm guard.

---

## 12. REPLICATION GUIDE — STANDING THIS UP FOR A NEW SITE/HIVE

The code is site-parameterised around `SITE` + the config file. To replicate:

1. **Products + answer paths**: the site needs a content_jobs population and
   click-path answer-paths (the combo-search generator). Run the registry
   backfill (`scripts/backfill-products-registry.ts`) — it derives names
   (acronym map), attaches answer_paths, computes the foundling pool.
   Pricing stays null until products sell.
2. **Channel + credentials**: a YouTube channel, Zernio publishing account,
   Google OAuth (edit/analytics) — set the env vars. Two verbs, two creds.
3. **Config**: copy `YTS-CONFIG-<site>.md` to cole-marketing/knowledge/,
   set lanes/slot_times for the audience timezone. Commit cole-marketing
   FIRST. Defaults in code protect against a missing file.
4. **Site capture**: mount `UtmCapture.tsx` (first-touch + fetch wrapper) in
   the delivery site layout; add the 4 utm cols to decision_sessions;
   confirm the purchases join (Stripe metadata decision_session_id).
5. **Set the measured-since epoch** for the new site at circuit-live time —
   money verdicts must never read pre-circuit zeros as failures.
6. **Render worker**: the GHA render.yml pattern + (do it properly this
   time) the repository_dispatch token from day one.
7. **Prove by hand before the cron**: TICK 1 → drain → TICK 2 → judge →
   TICK 3, exactly as §7. The cron is the LAST line you ship.
8. Honour every rule in §9. They were not free.

---
*Maintained as the durable record of the YTS build. Corrections ride the
normal commit pattern; material design changes require a Design ruling.*
