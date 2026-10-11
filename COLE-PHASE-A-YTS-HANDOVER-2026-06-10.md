# COLE Phase-A — YTS Handover (YouTube Shorts Analytics + Reaction/Rewrap Pipeline)

**Date:** 2026-06-10 (AWST)
**Author window:** Strategy/Design chat
**Purpose:** Durable handover so any window (or a fresh session) can pick up the YTS build cleanly. Destination repo: `cole-marketing`.

---

## 0. One-paragraph orientation

YTS is the autonomous YouTube Shorts loop for taxchecknow: ingest published Shorts → snapshot their metrics → a deterministic bee issues a verdict per video (winner / rewrap / retire / hold / immature) → reactions fire (rewrap-packaging = edit title/thumbnail in place; rewrap-hook = re-render + re-upload). The read/verdict spine is **built and live**. The OAuth write capability is **proven**. We are mid-build on the rewrap **generators** (title done, thumbnail in progress). The loop is currently **dormant** because all 6 published videos are too young/low-view to mature past `immature`.

---

## 1. WHERE WE ARE RIGHT NOW

**Mid-Step 7b.** The thumbnail-generator build directive is issued to Session A (build `Thumbnail.tsx`, render 6 PNGs, eyeball) — **not yet run**. That is the immediate next action.

After 7b: 7c (edit-in-place applier) → 7d (wire to verdict, dormant) → Step 8 → 12.

---

## 2. Environment & access

| Thing | Value |
|---|---|
| Supabase project | `ngxuroxsabyamqcnvrei` |
| soverella repo | `/c/Users/MATTV/CitationGap/soverella` → GH `mrktrite-pixel/soverella` (dashboard, bees, queens, `render-engine/` workspace) |
| taxchecknow repo | `/c/Users/MATTV/CitationGap/cluster-worldwide/taxchecknow` → GH `mrktrite-pixel/taxchecknow` (live site, ingest) |
| cole-marketing | `/c/Users/MATTV/CitationGap/cole-marketing` (durable docs; `.env.local` = the local test-env mirror) |
| Prod (last green) | soverella deploy `soverella-ralivyy7w` ✅ Ready |

**Three-window protocol (in force):**
- **Strategy/Design chat** (this window) — plans, rulings; NO direct DB/repo access.
- **Session A** (Claude Code CLI on the Windows box) — builds + tests LOCALLY, commits to GitHub.
- **Operator** — runs SQL in the Supabase editor; manages Vercel env.
- Durable execution = Vercel + GitHub + Supabase. Env secrets canonical in **Vercel**; `cole-marketing/.env.local` is the test mirror.

**Disciplines (hard):** probe-before-build; one thing at a time; never `git add .` (explicit adds); committed ≠ deployed (watch every deploy go green); commit each new SQL as a migration; verify-before-commit.

---

## 3. Credentials (names only — values live in Vercel + `.env.local`, not reproduced here)

| Var | Purpose | State |
|---|---|---|
| `YOUTUBE_API_KEY` | Public reads (channel/video enumeration, statistics) | Live (soverella Vercel since May; in local mirror) |
| `YOUTUBE_OAUTH_CLIENT_ID` | OAuth client (Desktop app) | Live in `.env.local`; **operator to confirm in Vercel** |
| `YOUTUBE_OAUTH_CLIENT_SECRET` | " | Same |
| `YOUTUBE_OAUTH_REFRESH_TOKEN` | Owner OAuth — analytics read + write (force-ssl) | Live in `.env.local`; **operator to confirm in Vercel** |

OAuth app is **published to Production** (personal-use, <100 users → exempt from Google verification; durable refresh token — Testing mode would expire it every 7 days). Scopes: `yt-analytics.readonly` + `youtube.force-ssl`.

---

## 4. Data substrate

| Table | Role |
|---|---|
| `content_performance` | **CANONICAL.** Read by the soverella dashboard YouTube tab + learner bees. `platform='youtube'`, split `format_type ∈ {short,long}`. Note: **no `created_at`/`updated_at` columns.** |
| `youtube_snapshots` | Append-only daily metrics (views, `watch_time_minutes` precise/un-rounded, `ctr` as fraction, `duration_s`). Migration `20260610_youtube_snapshots.sql` (RUN). |
| `youtube_verdicts` | Append-only verdict log. Migration `20260610_youtube_verdicts.sql` (RUN; also ALTERs snapshots to add `duration_s`). |
| `content_jobs.output_data.youtube_short_script` | Per-product: `title`, `thumbnail_text`, `hook_stat`, `consequence`, `rule_source`, etc. Source of grounding for rewrap generators. |
| `render_jobs` | Render worker job rows (`video_url`). |
| `campaign_calendar` | LinkedIn scheduler today; to be EXTENDED for YT in Step 10 (YT keeps publishing via Zernio). |
| `platform_accounts` | Zernio account / channel resolution by (site, platform). |
| `shorts_videos` / `shorts_performance` / `shorts_verdict` (view) | **LEGACY / orphaned** — to retire in Step 12 after porting. |

**The 6 published videos** (all `status=published`, `format_type=short`, ~63–111 views, all verdicts `immature`):
frcgw `oHkUNUwdpAM` · 183-day `klS6M_tW9-Y` · tax-treaty `xDz0hE3kmqk` (unlisted, the probe guinea-pig) · small-biz-cgt `QuwvqCS23fM` · cgt-main-residence `4AUp6xNfLXc` · super-death `u_sxYPwj_t8`.

---

## 5. What's BUILT (Steps 1–7a)

| Step | What | Files / artifacts | Commit / state |
|---|---|---|---|
| 1 | Confirm-checks (a–f) | — | done |
| 2 | Dashboard YouTube tab lit | `app/dashboard/analytics/_components/YouTubeTab.tsx` (existing) | done (display issue → backlog, §8) |
| 3 | Publish-bridge + snapshot table + ingest repoint | soverella `lib/render/youtube-publish-bridge.ts`, `scripts/bridge-youtube-publish.ts`, migration `20260610_youtube_snapshots.sql`; taxchecknow `scripts/cole-shorts-ingest.mjs` (repointed to write shorts_performance + content_performance + youtube_snapshots) | soverella `ebc6941` (branch `phase-a/youtube-bridge`, PUSHED); taxchecknow `baed670` (branch `phase-a/ingest-repoint`, PUSHED) |
| 5 | YT-Reaction bee (deterministic, no LLM) | `lib/bees/yt-reaction.ts`, `scripts/run-yt-reaction.ts`, migration `20260610_youtube_verdicts.sql` | `a66cc6f` (branch `phase-a/yt-reaction`, **NOT pushed**). Ran live → 6 verdicts, all `immature` (correct). Not in `_registry.ts` yet. |
| 6a | Video-ID resolver (API key) | `lib/youtube/id-resolver.ts`, `scripts/run-yt-id-resolver.ts` | `50d8724` (branch `phase-a/yt-id-resolver`, **NOT pushed**). 6/6 matched dry-run. |
| 6b-1 | GCP OAuth setup | GCP project `gen-lang-client-0406069186` (Data API v3 + Analytics API enabled; published Production) | done |
| 6b-2 | Refresh token minted + verified | one-off helper `scripts/youtube-oauth-consent.ts` (uncommitted, kept for re-auth/portability) | done — token live, `getAccessToken()` verified |
| 7-probes | Both write verbs proven | — (temp probes, deleted) | `videos.update` (title) ✅ + `thumbnails.set` (thumbnail) ✅ — no verification gate |
| 7a | Title-rewrap generator | `lib/youtube/title-rewrap.ts`, `scripts/run-title-rewrap.ts` | `8ab9f96` (branch `phase-a/yt-title-rewrap`, **NOT pushed**). Dry-tested clean: emoji-banned, thin-grounding-guarded, constraint-validated. |

**Prod-outage fixes (committed direct to `main`, PUSHED, deploy green):**
`611a4e7` (re-stamp `bees-snapshot/manifest.json` → clear 21d TTL guard) + `030ea12` (tsconfig `exclude: ["node_modules","render-engine"]` → clear `@remotion/cli` type error). Neither touched Phase-A code.

---

## 6. Key findings & rulings (the durable lessons — read before building)

1. **CTR + impressions are CSV-only, permanently.** The YouTube Analytics API returns HTTP 400 "Unknown identifier (impressions)" — these are Studio-only metrics. The API can **never** retire the manual CSV. Since the CSV (needed for CTR) also carries retention/views, the API read-pull (`6b-3`) has near-zero marginal value → **parked, not built.** Possible future niche: auto-pull *daily views* for velocity-decay maturity (reassess after videos mature).
2. **Analytics API returns empty for young/low-view videos** (~48–72h processing lag + low-traffic thresholds). Correct headers, zero rows. This is the main reason the loop is dormant.
3. **Title is SEO-locked** — yt-s1 forces the cited question **verbatim** + **≤65 chars**. So the title is a *narrow* CTR lever: 2 of 6 videos are fully constrained (question fills the budget → "thumbnail is the lever"); only ~3 of 6 can be meaningfully sharpened. The generator returns explicit `constrained` / `thin_grounding` signals rather than forcing filler.
4. **Thumbnail for Shorts = 9:16 (1080×1920), NOT 16:9.** Custom Shorts thumbnails surface on discovery surfaces (search, channel grid, Shorts shelf, suggested, watch history, desktop) but **not** the swipe feed (frame-based). A 16:9 1280×720 gets letterboxed/cropped in vertical placements. Browse surfaces (Home/Explore/Subs) may override with an auto 4:5 crop. **Net leverage caveat:** for Shorts, the swipe feed shows neither title nor thumbnail, so packaging-rewrap is partial; the strong Shorts lever is the video/hook itself (`rewrap_hook`), not packaging.
5. **Both write verbs proven live, reversible, no verification gate** — `videos.update(part=snippet)` (must resend `categoryId`+`description` or they wipe) and `thumbnails.set` (media upload). **Read-after-write lag:** an update returns 200 + persists, but an instant re-read can show the stale value — verify with a short delay/retry or trust the 200 + returned resource. Thumbnail "revert" is pixels-only (auto→custom flag flips irreversibly).
6. **Video-ID resolver matches by TITLE primary, publish-time tiebreaker** — `content_performance.published_at` (Zernio time) is up to ~18h off YouTube's `videoPublishedAt`, so time-nearest alone mis-assigns. Uses `channels.list?forHandle` + `playlistItems.list` (direct channel enumeration, ~2 quota units), **never** `search.list`.
7. **Snapshot TTL guard caused the 3-day prod outage** — `check-snapshot-fresh` fails the build when `bees-snapshot` is >21 days old. It **re-arms ~July 1.** Fix is `npm run sync-bees` + commit `bees-snapshot/manifest.json` (manifest re-stamp only; behaviourally inert). Sync reads `.claude/agents/**`, `knowledge/**`, `lessons/**` + a root allowlist — content from working tree, SHA from HEAD.
8. **`render-engine/` is a separate workspace** — own `package.json`/`node_modules` (remotion, @remotion/cli, @remotion/google-fonts, playwright), built by a GitHub Actions render worker via its own `npm ci`. It is **excluded from the soverella Next build's tsconfig**. The broad `**/*.ts` include glob will re-break the build if another sibling workspace with its own deps lands (→ backlog).

---

## 7. OUTSTANDING STEPS

### Step 7 — rewrap-packaging (write-side) — IN PROGRESS (~40%)

- **7b — Thumbnail generator** *(in progress — build directive issued, not run)*.
  Ruling: **Remotion 1080×1920 still template** (Option A). Build `render-engine/src/Thumbnail.tsx` — `AbsoluteFill` still, reuse `SITE_CONFIGS[site]` (bg `#0D0D0F`, accent `#F5A623`, danger `#E0241B`, font Oswald via `loadFont()`), styled as "HookCard frozen to one frame": big `thumbnail_text` + the real figure, brand footer. Register `<Composition id="Thumbnail" width={1080} height={1920} fps={1} durationInFrames={1}>` in `src/Root.tsx`. Render via the existing `remotion still` CLI verb. **Next action:** render 6 PNGs from each video's `thumbnail_text`, eyeball, then commit. Output later uploads to the Supabase `renders` bucket like videos.
- **7c — Edit-in-place applier** *(not started)*. Wrap the two proven verbs: take a chosen title candidate + rendered thumbnail → `videos.update` (preserve `categoryId`/`description`) + `thumbnails.set`. Verify lag-safely (trust 200 + returned resource, or delayed re-fetch). Testable now on the unlisted video. Hook-fail vs packaging-fail: **packaging** = edit-in-place (this); **hook** = new upload + UNLIST old loser (separate re-render path, not 7c).
- **7d — Wire to the `rewrap_packaging` verdict** *(not started; dormant)*. yt-reaction emits `rewrap_packaging` → trigger 7a/7b/7c. No verdict fires until videos mature (needs CTR from CSV + retention).

### Step 8 — UTM stamping at publish
Stamp UTMs at publish so video-level conversions light up. Until then the bee's conversion branches stay dormant (conversions null-guarded). Requires reading the `shorts_verdict` view DDL (deferred Step 4 — the conversion-attribution join authority).

### Step 9 — Consolidated product registry
Foundling detection = answer-paths − aired. ~41/47 products missing from the `products` table; backfill `product_key` (also fixes the dashboard Product column). New-product detection drives the queue's "build more" signal.

### Step 10 — Two-lane queue + scheduler
Lanes: **Proving Ground** (foundlings, amber, immediate first airing) + **Winners' Rotation** (green, auto-rewrap, relegation-on-decline) — evaluated separately. EXTEND `campaign_calendar` for YouTube (YT keeps publishing immediately via Zernio, not the scheduled-publisher), add colour-coding, enforce cadence. **Cadence (locked):** bootstrap 3 foundlings/day (all-new until verdicts exist; rewrap lanes empty until maturity); sweet spot 2–3/day, 4–6h spacing; 6/day rejected; supply-bounded ceiling; empty-pool cascade new → winner-rewrap → loser-rewrap → fewer (never filler) + emit "build more" signal.

### Step 11 — Winners board → EXPAND
Pull-not-push: ranked CLONE/EXPAND candidates surfaced from winners via niche-scorer Bee 2; operator paces.

### Step 12 — Cleanup
Retire `shorts_videos` + `shorts_verdict` after porting logic; **KEEP `youtube_snapshots`**. Revert the taxchecknow §5 admin-portal commits (`7074ac3` / `8f3e0a1`). Parameterise the calculator base domain (`taxchecknow.com` inline in `record-calc.mjs` / `build-answer-paths.mjs`) for portability — the only hardcoded site value left.

---

## 8. Test & Fix backlog (deliberate pass — do NOT interleave with the build)

- **Dashboard display fix** — `YouTubeTab.tsx` shows `views_7d` (NULL); real numbers in `views_30d` (63–111). Repoint Views KPI/column → `views_30d` (relabel "30d"); Product column → fall back to `slug` when `product_key` null; Likes stays blank (CSV carries none). Data is intact — display-only.
- **Thin-grounding videos** (e.g. 183-day, pre-v16 maiden scripts with empty `hook_stat`/`consequence`) — need a yt-s1 re-script before a rewrap is worth running.
- **Snapshot TTL re-arm (~July 1)** — automate the `sync-bees` re-stamp, extend the 21d threshold, or set a reminder, or prod reds again.
- **tsconfig `**/*.ts` glob** — tighten / formalise workspace boundary so the next sibling workspace doesn't break the build.
- **Vercel OAuth creds** — confirm all 3 `YOUTUBE_OAUTH_*` vars are in Vercel (soverella, Production). *Operator pending.*
- **Branch hygiene** — merge clean `phase-a/*` onto green `main`; push the unpushed: `yt-reaction` (`a66cc6f`), `yt-id-resolver` (`50d8724`), `yt-title-rewrap` (`8ab9f96`).
- **3 rendered-but-unpublished videos** — transfer-balance, super-to-trust, amt-shock — pending operator Gate-2.
- **Likes/comments enrichment** (optional) — from Data API `videos.list?part=statistics` (public counters, key-based, no lag).
- **Re-probe Analytics API ~June 13–14** — decide if there's a daily-views-for-velocity role once videos have data.

---

## 9. Reaction policy reference (the yt-reaction bee logic)

- **Retention** (derived): `(watch_min×60 / views) / duration_s × 100`. (API `averageViewPercentage` would be more accurate but the API is empty for now.)
- **CTR judged in BANDS** (`<2%` / `2–5%` / `>5%`) — never exact (the column rounds).
- **Maturity**: view-velocity-decay if ≥2 daily snapshots, else absolute view floor (**300** = placeholder).
- **Conversions NULL-GUARD**: unmeasured = null ≠ 0; `retire` never fires on null.
- **Verdict ladder**: `retention<35%` → `rewrap_hook` (new upload + unlist loser) · low-CTR-band + ok-retention → `rewrap_packaging` (edit-in-place) · `retention≥55%` OR measured conversion → `winner` · high-views + measured-zero-conversion → `retire` · else → `hold` · below maturity → `immature`. YTL inherits YTS thresholds.

---

## 10. Pipeline bees in play (existing)

- **yt-s1-shorts-scripter** — Sonnet 4.6 (`claude-sonnet-4-6`, `callClaude`, temp 0.4). Generates `title` (cited-question verbatim, ≤65c), `thumbnail_text` (≤5 words, must contain a digit/fear word), and the script, grounded on COLE product-menu figures. Exports `CITED_QUESTION_MAX_CHARS`, `SITE_NAME`, etc. (reused by 7a).
- **yt-m-gate** — Haiku machine-gate; validates `thumbnail_text` (digit/fear), title, etc.
- **yt-s3-shorts-publisher** — reads `output_data.youtube_short_script.title` → `publishWithZernio({ youtube: { title } })` → live YouTube. (Publisher = Zernio; no Blotato.)

---

## 11. Immediate next action

Run the issued 7b build directive (Session A): create `render-engine/src/Thumbnail.tsx` + the `Thumbnail` composition, render 6 PNGs from the videos' `thumbnail_text`, report paths → eyeball → commit. Then **7c** (applier) → **7d** (wire, dormant) → **Step 8 → 12**. The backlog (§8) is a separate deliberate pass, not interleaved.
