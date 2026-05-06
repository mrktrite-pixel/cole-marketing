# MASTER BUILD SHEET — Sprint to COLE Alive

**Created:** May 4 2026
**Mode:** Sprint (60 hr/week, full-time)
**Goal:** All 7 blocks shipped. House complete. COLE alive.

---

## STATUS LEGEND

- ⬜ Not started
- 🟡 In progress
- ✅ Done (technical + operator + Rule #15 docs)
- 🔵 Operator action (not Claude task)
- ⚠️ Blocked

---

## OPERATOR PARALLEL TASKS (start NOW, no Claude block)

These run alongside Claude builds. Tick off as completed. Doesn't affect sequence — just gets them done while you're not at the keyboard.

| # | Task | Status | Time | Notes |
|---|---|---|---|---|
| OP1 | Sign up at blotato.com + get API key | 🔵 | ~5 min | Required before Block 3 step 11 (Blotato adapter) |
| OP2 | Add `BLOTATO_API_KEY` to Vercel env | 🔵 | ~2 min | After OP1 |
| OP3 | Create TikTok @taxchecknow account | 🔵 | ~10 min | Start 4-week warmup clock |
| OP4 | Create YouTube @taxchecknow account (or confirm existing) | 🔵 | ~10 min | Start warmup |
| OP5 | Create Instagram @taxchecknow account | 🔵 | ~10 min | Start warmup |
| OP6 | Create X @taxchecknow account | 🔵 | ~10 min | Start warmup |
| OP7 | Upload 1 manual YouTube video (any FRCGW screen-record) | 🔵 | ~30 min | Warmup signal — required before Blotato YT connection |
| OP8 | Post 5 manual TikTok test videos over 2 weeks | 🔵 | ~2 hr total | Per N spec, optional but useful for algorithm warmup |
| OP9 | Verify GA4 conversion tracking working | 🔵 | ~10 min | Spot-check after P5.5 confirmation tomorrow morning |
| OP10 | Confirm P5.5 GA4 working — query content_performance bf2394b0... | 🔵 | ~2 min | Tomorrow morning May 4, after Doctor Bee 22:00 UTC |

---

## BLOCK 1 — Content Foundation (estimate: 6-8 hr, ~2-3 sessions)

**Goal:** LinkedIn fully autonomous, 47 products ready to post.

| # | Task | Status | Time est | Notes |
|---|---|---|---|---|
| 1.1 | G5 Story-writer build (incl. _character-registry.ts foundational dependency + sync infrastructure extension) | ✅ DONE May 4 | actual: ~6 hr | Sonnet, multi-character, Vercel-readable. Commits 07f5100 + 0ddca5d (VOICE.md merge). Live test verified ($0.018 G5 + $0.010 J3 chain) |
| 1.2 | G5 + Registry + Sync USER + BUILD manuals (6 manuals total) | ✅ DONE May 4 | actual: ~90 min | Per Rule #15. Commit 7922cc0 (~2,289 lines across 6 manuals based on real test data) |
| 1.3 | J2 LI-strategy build + manuals (Plan Mode + build + 2 manuals) | ✅ DONE May 4 | actual: ~4 hr | Haiku-extract + Sonnet self-heal. Commits 2ec5f72 (code) + 5b94218 (docs). Live test verified end-to-end G5→J2→J3 chain ($0.014). |
| 1.4 | J2 USER + BUILD manuals | ✅ DONE May 4 | folded into 1.3 | 780 lines combined |
| 1.5 | End-to-end LinkedIn pipeline test (G5 → J2 → J3) on AU-19 | ✅ DONE May 4 | folded into 1.3 | First run hit length band on first try (1496 chars, character_review_required=false) |
| 1.6 | Backfill linkedin_adapted for AU-01..AU-46 (run G5+J2+J3) | ⬜ NEXT | 30-60 min | ~$0.84 cost projection (1×Haiku + 46×Sonnet self-heal) |
| 1.7 | I1 filter tightened + 3 per-bee crons (G5, J2, J3 staggered) | ✅ DONE May 4 | actual: ~30 min | Drift #31 resolved (I1 stays scheduler). Commit 0122eaa. 9 crons live. Per Chat A: per-bee staggered crons = de-facto orchestrator. |
| 1.8 | Verify I1 filter excludes 46 cascade-incomplete products | ✅ DONE May 4 | folded into 1.7-V3 | Live test: 1/47 qualifies (AU-19), 46 excluded for missing linkedin_post |

**Block 1 sign-off gate:** All 47 products have linkedin_adapted, I1 schedules them, USER+BUILD manuals exist for G5 + J2.

---

## BLOCK 2 — Blotato + TikTok (estimate: 9-11 hr, ~2-3 sessions)

**Goal:** First video pipeline. TikTok station established as architectural template for video platforms. Content lifecycle foundation (naming + content_assets table) ships first so all downstream bees write to a structured asset registry.

**Sequencing decision (May 4 — drift incident #32):** Hive 4 Maintenance (formerly Block 2) deferred to **Block 4** — moved to AFTER all platform stations live. Rationale: Madame has nothing to clean until video/carousel/image content actually accumulates. Building cleanup BEFORE there's mess = building a janitor for an empty hallway. Sprint priority = revenue-generating work first. D22 (orphaned carousel_brief row `6fd8be90-...`) handled manually instead of via K17.

**Foundation expansion (May 4 — operator strategic input):** Per-warm-up pipeline gap caught by operator. Block 2 now starts with content lifecycle foundation (Tasks 2.0a-d) before Blotato adapter work. Naming convention + content_assets table ship first so N1-N5 bees write to structured registry. Madame's K15/K17 cleaners (Block 4) consume this registry — without it, files would land in random storage paths and migration cost would be huge.

**Architectural correction (May 4 — drift incident #33):** Master sheet originally specced `lib/adapters/blotato.ts` as new file. Audit revealed existing 3-adapter trio (`lib/{video,social,carousel}-publisher/blotato.ts`) IS the correct adapter pattern per Chat A Rule 9. Task 2.1 revised: gap-fill existing trio + add warm-up guard, NOT greenfield build.

**Per-site warm-up rule (May 4 — operator):** Every new COLE site = new social accounts on every platform = new warm-up cycle. One-time per (site, platform). For Block 2: only TikTok rules codified. Other platforms get rules added in their respective Block 3 sub-blocks per YAGNI.

**Prerequisites:** OP1 ✅, OP2 ✅, OP3 ✅, OP8 (in progress)

| # | Task | Status | Time est | Notes |
|---|---|---|---|---|
| 2.0a | Naming convention spec doc | ⬜ | 30 min | Format: `[site]-[product]-[platform]-[YYYYMMDD]-[seq][ver]` (compound). Storage path: `storage/[site]/[product]/[platform]/[YYYYMM]/[name].[ext]`. Doc lands in `cole-marketing/CONTENT-NAMING-SPEC.md`. |
| 2.0b | `content_assets` table migration | ⬜ | 30 min | New table. Tracks asset lifecycle: draft → approved → manual_pending → published → superseded → archived. Schema includes provenance (research_job_id, strategy_job_id, adapter_job_id, manager_check_id, publisher_job_id), storage path, version letter, parent_asset_id. RLS per Locked Rule #5. |
| 2.0c | `lib/content-naming.ts` helper | ⬜ | 1 hr | TypeScript helper. Functions: `generateAssetName()`, `parseAssetName()`, `buildStoragePath()`, `nextSequenceNumber()`, `nextVersionLetter()`. Single source of truth used by all adapter bees (N3, future M3, L3, K3, etc.). Imported by Madame K15 in Block 4 for cleanup logic. |
| 2.0d | Naming + content_assets USER + BUILD manuals | ⬜ | 30 min | Per Rule #15. `docs/help/CONTENT-NAMING-USER-MANUAL.md` + `docs/help/CONTENT-NAMING-BUILD-MANUAL.md`. Documents: naming spec, content_assets schema, status lifecycle, helper API, integration pattern for new platform stations. |
| 2.0e | Warm-up guard infrastructure (already 50% done) | 🟡 | 30 min | ✅ DONE: `platform_accounts.warm_up_completed_at` + `warm_up_override_reason` columns added; LinkedIn override documented; TikTok row inserted (warm at May 31 WST). REMAINING: write `lib/_warm-up-guard.ts` helper (TikTok-only per YAGNI), plus warm-up section in Blotato build manual. |
| 2.0f | Drift #24 closure — verify J station "BUILT" claims (D40) | ⬜ | 15 min | Session B audit: confirm actual code state of J3.5, J3.6, J4, J6. Dashboard surfaced these as UNVERIFIED on May 4. PLATFORM-LINKEDIN.md + Chat A flowchart claim BUILT, drift #24 from session 13 says verify. NON-NEGOTIABLE before Block 2 sign-off. Outcome documents which actually exist as code, with commit SHA where applicable. Dashboard JSX updated based on results. |
| 2.0g | Block 6.0 — Soverella dashboard preview (early sequence per Living Dashboard pattern) | ⬜ | 1.5-2 hr | Embed cole-bee-dashboard.jsx at /dashboard/bees in soverella. Per Session B audit B6.0-PRE-1: App Router, Tailwind v4, no auth middleware (advisory gate). Add nav entry as non-primary (after Accounts). Build per Card B6.0-BUILD. Inserted ahead of Block 6 master sequence as deliberate decision (drift #36, Living Dashboard pattern). |
| 2.1 | Blotato adapter trio defect fixes (revised from greenfield) | ⬜ | 1-2 hr | Drift #33: Existing trio is correct architecture. Fix 3 defects: (1) `video-publisher/blotato.ts` pass structured `inputs.scenes` not free-text prompt; (2) `social-publisher/blotato.ts` add TikTok required fields (privacyLevel + 6 booleans); (3) (deferred to Block 3B) YouTube required fields. Wire in warm-up guard. |
| 2.2 | Blotato integration USER + BUILD manuals | ⬜ | 30 min | Documents the trio pattern, env-gating, when to use each, warm-up integration. |
| 2.3 | N1 TT Research Bee | ⬜ | 1 hr | Haiku — TikTok keyword + competitor scan. Writes research output to `content_jobs.output_data.tt_research`. |
| 2.4 | N1 USER + BUILD manuals | ⬜ | 20 min | |
| 2.5 | N2 TT Strategy Bee | ⬜ | 2 hr | Sonnet — keyword + 5-hook lab. Reads N1 output, picks angle, writes to `tt_strategy`. |
| 2.6 | N2 USER + BUILD manuals | ⬜ | 30 min | |
| 2.7 | N3 TT Adapter Bee | ⬜ | 2 hr | Haiku — 60s script + on-screen text + caption + CTAs. **Writes to `content_assets` row with status='draft' using lib/content-naming.ts.** Calls Blotato video-publisher adapter to generate MP4. |
| 2.8 | N3 USER + BUILD manuals | ⬜ | 30 min | |
| 2.9 | N4 TT Manager Bee | ⬜ | 1 hr | Haiku — 9-point quality checklist. Updates `content_assets.status` to `approved` or `rejected` based on check. |
| 2.10 | N4 USER + BUILD manuals | ⬜ | 20 min | |
| 2.11 | N5 TT Publisher Bee | ⬜ | 1 hr | Reads warm-up guard. Mode `manual_handoff` until May 31 WST: queues for Soverella manual upload tab, sets `content_assets.status='manual_pending'`. Mode `auto` after: calls Blotato social-publisher, sets status='published'. |
| 2.12 | N5 USER + BUILD manuals | ⬜ | 20 min | Documents both modes, manual upload flow, warm-up transition. |
| 2.13 | End-to-end TikTok test against AU-19 | ⬜ | 30 min | Generate first TikTok video, manual review before publish, verify content_assets row populated correctly. |
| 2.14 | TikTok pipeline integration with I1 conductor | ⬜ | 30 min | Add tt_adapted gating to I1 filter. |

**Block 2 sign-off gate:** Content lifecycle foundation shipped (naming + content_assets), Blotato trio defects fixed, warm-up guard in place (TikTok-only), N1-N5 TT bees built end-to-end, first TikTok video generated and queued for manual handoff, all components have USER+BUILD manuals.

---

## BLOCK 3 — Wash-and-Repeat Platforms (estimate: 10-15 hr, ~4-5 sessions)

**Goal:** All 5 platforms autonomous. Multi-platform exposure live.

**Prerequisites:** Block 2 complete (Blotato adapter + TikTok station as template)

### Block 3A — Instagram Station (estimate: 3-4 hr, ~1-2 sessions)

| # | Task | Status | Time est | Notes |
|---|---|---|---|---|
| 3A.1 | M1 IG Research Bee | ⬜ | 45 min | Reuse N1 pattern |
| 3A.2 | M2 IG Strategy Bee | ⬜ | 1 hr | Reuse N2 pattern, adapt for Reels + carousel |
| 3A.3 | M3 IG Adapter Bee | ⬜ | 1 hr | Reuse N3 pattern + carousel handling |
| 3A.4 | M4 IG Manager Bee | ⬜ | 30 min | Adapt N4 checklist for IG |
| 3A.5 | M5 IG Publisher Bee | ⬜ | 30 min | Reuse N5 pattern, adds bio link rotation |
| 3A.6 | M-station USER + BUILD manuals (5 docs) | ⬜ | 1.5 hr | |
| 3A.7 | End-to-end IG test against AU-19 | ⬜ | 30 min | |

### Block 3B — YouTube Shorts Station (estimate: 2-3 hr, ~1 session)

| # | Task | Status | Time est | Notes |
|---|---|---|---|---|
| 3B.1 | L2 YT-Short Research Bee | ⬜ | 30 min | |
| 3B.2 | L2 YT-Short Strategy Bee | ⬜ | 1 hr | |
| 3B.3 | L3 YT-Short Adapter Bee | ⬜ | 1 hr | |
| 3B.4 | L4 YT-Short Manager Bee | ⬜ | 30 min | |
| 3B.5 | L5 YT-Short Publisher Bee | ⬜ | 30 min | |
| 3B.6 | YT-Short USER + BUILD manuals | ⬜ | 1.5 hr | |
| 3B.7 | End-to-end YT-Short test | ⬜ | 30 min | |

### Block 3C — X / Twitter Station (estimate: 2-3 hr, ~1 session)

| # | Task | Status | Time est | Notes |
|---|---|---|---|---|
| 3C.1 | K1 X Research Bee | ⬜ | 30 min | |
| 3C.2 | K2 X Strategy Bee | ⬜ | 1 hr | Thread structure, no video |
| 3C.3 | K3 X Adapter Bee | ⬜ | 1 hr | Text threads, character count |
| 3C.4 | K4 X Manager Bee | ⬜ | 30 min | |
| 3C.5 | K5 X Publisher Bee | ⬜ | 30 min | Native API (Blotato may also support) |
| 3C.6 | X-station USER + BUILD manuals | ⬜ | 1.5 hr | |
| 3C.7 | End-to-end X test | ⬜ | 30 min | |

### Block 3D — YouTube Long-form Station (estimate: 3-5 hr, ~2 sessions)

| # | Task | Status | Time est | Notes |
|---|---|---|---|---|
| 3D.1 | L1-Long Research Bee | ⬜ | 30 min | |
| 3D.2 | L1-Long Strategy Bee | ⬜ | 1.5 hr | Different — chapters, thumbnail strategy |
| 3D.3 | L1-Long Adapter Bee | ⬜ | 2 hr | 16:9, longer videos, thumbnails, descriptions |
| 3D.4 | L1-Long Manager Bee | ⬜ | 30 min | |
| 3D.5 | L1-Long Publisher Bee | ⬜ | 30 min | |
| 3D.6 | L1-Long USER + BUILD manuals | ⬜ | 1.5 hr | |
| 3D.7 | End-to-end YT Long test | ⬜ | 30 min | |

**Block 3 sign-off gate:** All 4 sub-stations live (3A IG, 3B YT-Short, 3C X, 3D YT-Long), all USER+BUILD manuals delivered, integration tests passed for each.

---

## BLOCK 4 — Hive 4 Maintenance (Madame + Cleaners) — DEFERRED FROM ORIGINAL BLOCK 2 (estimate: 4-6 hr, ~2 sessions)

**Goal:** System self-cleans Sunday 4am AWST. No more orphaned rows accumulating.

**Sequencing rationale (drift #32, May 4):** Originally scheduled as Block 2 but deferred. Madame's job is "is the container full? clean it." Until video/image content starts accumulating from Block 2-3 platforms, there is nothing to clean. Building cleanup BEFORE there's mess = janitor for an empty hallway. Now sequenced AFTER all 5 platform stations are live so Madame has real work on first run.

**Prerequisites:** Block 3 complete (all platforms producing content). 4-6 weeks of content accumulated before first dry run.

| # | Task | Status | Time est | Notes |
|---|---|---|---|---|
| 4.1 | Madame Cleaning Queen dispatcher build | ⬜ | 2 hr | **Token: Haiku** (revised from Sonnet — pure dispatcher with summary text). Coordinates all Hive 4 bees, weekly summary. |
| 4.2 | Madame USER + BUILD manuals | ⬜ | 30 min | |
| 4.3 | K15 Storage Sweeper build | ⬜ | 1 hr | Haiku — carousel PDFs >90d, orphaned renders >30d |
| 4.4 | K15 USER + BUILD manuals | ⬜ | 20 min | |
| 4.5 | K16 Log Archiver build | ⬜ | 1 hr | Haiku — agent_log >90d → archive table |
| 4.6 | K16 USER + BUILD manuals | ⬜ | 20 min | |
| 4.7 | K17 Queue Janitor build | ⬜ | 1 hr | Haiku — video_queue stale, content_jobs in_progress >14d |
| 4.8 | K17 USER + BUILD manuals | ⬜ | 20 min | |
| 4.9 | K21 Cost Reporter build | ⬜ | 1.5 hr | Haiku — weekly token cost, alerts on budget exceeded |
| 4.10 | K21 USER + BUILD manuals | ⬜ | 20 min | |
| 4.11 | Cron schedule Madame for Sunday 4am AWST (Saturday 20:00 UTC) | ⬜ | 10 min | Vercel cron addition (will be 10th cron) |
| 4.12 | First dry run + verify Sunday cleanup behavior on real accumulated content | ⬜ | 30 min | Manual trigger, observe — should clean real videos/PDFs by then |

**Block 4 sign-off gate:** Madame dispatched, 4 cleaner bees firing, real content swept on first run, USER+BUILD manuals for all 5 components.

**Note:** D22 (orphaned carousel_brief row) handled manually via Supabase SQL editor on May 4 (no longer dependent on K17 build).

---

## BLOCK 5 — Hive 3 Loop Closure (estimate: 3-4 hr, ~1-2 sessions)

**Goal:** Self-improving system. Scientist Bee proposes V2 when underperforming. Health monitoring across all platforms.

| # | Task | Status | Time est | Notes |
|---|---|---|---|---|
| 5.1 | Scientist Bee build (K-Analytics-2) | ⬜ | 2 hr | Sonnet — diagnose underperformance, propose V2 |
| 5.2 | Scientist Bee USER + BUILD manuals | ⬜ | 30 min | |
| 5.3 | K9 Review Monitor build | ⬜ | 1 hr | Haiku — track Reddit comments, replies, complaints |
| 5.4 | K9 USER + BUILD manuals | ⬜ | 20 min | |
| 5.5 | K10 Site Health Bee build | ⬜ | 1 hr | Haiku — calculator uptime, error rate |
| 5.6 | K10 USER + BUILD manuals | ⬜ | 20 min | |
| 5.7 | K20 Link Health build | ⬜ | 1 hr | Haiku — sweep content_performance.url, flag broken |
| 5.8 | K20 USER + BUILD manuals | ⬜ | 20 min | |
| 5.9 | K22 Backup Verifier build | ⬜ | 30 min | Haiku — confirm Supabase + GitHub backups |
| 5.10 | K22 USER + BUILD manuals | ⬜ | 20 min | |

**Block 5 sign-off gate:** Self-improvement loop closed. System monitors itself across all platforms.

---

## BLOCK 6 — Soverella Dashboard (estimate: 6-10 hr, ~2-3 sessions)

**Goal:** Operator visibility. Help tab. Approval queue. Analytics views.

**Critical:** Once Help tab is built, USER+BUILD manuals deliver TO DASHBOARD instead of operator chat.

| # | Task | Status | Time est | Notes |
|---|---|---|---|---|
| 6.1 | Help Tab UI build (D8) | ⬜ | 2-3 hr | Renders /docs/help/*.md from cole-marketing |
| 6.2 | Help Tab USER + BUILD manuals | ⬜ | 30 min | Last manual delivered to chat — after this they go to dashboard |
| 6.3 | Approval Queue UI (D2) | ⬜ | 2 hr | Pending posts → operator approves/rejects |
| 6.4 | Approval Queue manuals | ⬜ | 30 min | |
| 6.5 | Analytics Dashboard (per-platform performance) | ⬜ | 2 hr | Reads content_performance, shows winners |
| 6.6 | Analytics manuals | ⬜ | 30 min | |
| 6.7 | Cost Tracking Dashboard | ⬜ | 1 hr | Reads agent_log.cost_usd, weekly/monthly view |
| 6.8 | Cost Tracking manuals | ⬜ | 20 min | |
| 6.9 | Cleaning Queen weekly summary view | ⬜ | 1 hr | Madame's Sunday summary rendered |
| 6.10 | Cleaning Queen view manuals | ⬜ | 20 min | |
| 6.11 | Backfill ALL prior systems' manuals to /docs/help/ (D19, D20, plus everything in Blocks 1-5) | ⬜ | 1 hr | Help tab now visible — push everything in |

**Block 6 sign-off gate:** Operator has full system visibility. Help tab populated. Documentation accessible without chat.

---

## BLOCK 7 — Multi-site Replication (estimate: 2-4 hr, ~1 session)

**Goal:** Add second site (TheViabilityIndex or other domain). System scales beyond taxchecknow.

| # | Task | Status | Time est | Notes |
|---|---|---|---|---|
| 7.1 | Site provisioning workflow build | ⬜ | 1.5 hr | Per-site env setup, RLS verification |
| 7.2 | Site provisioning USER + BUILD manuals | ⬜ | 30 min | |
| 7.3 | Test pipeline against new site (build 1 product end-to-end on second domain) | ⬜ | 1 hr | Validates multi-site is real |
| 7.4 | Cross-pollination integration (per cole-core skill) | ⬜ | 30 min | Cluster Worldwide flow |
| 7.5 | Multi-site USER + BUILD manuals | ⬜ | 30 min | |

**Block 7 sign-off gate:** Second site operational, pipeline runs against it autonomously.

---

## OVERALL PROGRESS

| Block | Status | % Complete |
|---|---|---|
| Block 1 Content Foundation | 🟡 In Progress | 87.5% (7 of 8 — Task 1.6 auto-completes via crons May 5-8) |
| Block 2 Blotato + TikTok | ⬜ Not started | 0% |
| Block 3A Instagram | ⬜ Not started | 0% |
| Block 3B YouTube Shorts | ⬜ Not started | 0% |
| Block 3C X/Twitter | ⬜ Not started | 0% |
| Block 3D YouTube Long-form | ⬜ Not started | 0% |
| Block 4 Hive 4 Maintenance (Madame) — DEFERRED | ⬜ Not started | 0% |
| Block 5 Hive 3 Loop | ⬜ Not started | 0% |
| Block 6 Soverella Dashboard | ⬜ Not started | 0% |
| Block 7 Multi-site | ⬜ Not started | 0% |

**Total estimated build time: ~37-55 hr at sprint pace.**
**Operator parallel time: ~3-4 hr (warmups + verifications).**

---

## SESSION CADENCE (sprint mode)

- Sessions continue until Claude context window forces retirement
- At retirement: full brain dump (this sheet + drift log + closing notes)
- Next session opens with this sheet + brain v14 → resumes at next ⬜ task
- USER + BUILD manuals delivered after each system ships
- After Block 6.1 (Help Tab built): manuals go to dashboard, not chat

---

## CURRENT NEXT STEP

**▶ Block 2 — Blotato + TikTok (formerly Block 3, promoted to Block 2 after Madame deferred)**

**Block 1 closing automatically May 5-8 via overnight crons.** G5 fires 6am AWST → J2 7am → J3 8:15am. By May 8 all 47 products complete the LinkedIn chain.

**Block 2 starts NEXT.** Blotato adapter build is the foundation — once shipped, it becomes the template for IG/YT/X publishers in Block 3.

**Block sequencing change (drift #32, May 4):** Original Block 2 (Madame Cleaning Queen) deferred to Block 4. Rationale: nothing to clean until video/image content accumulates. See Block 4 narrative for full reasoning. D22 (orphaned carousel_brief) cleaned manually on May 4 instead of via K17 build.

**Operator action while we build Block 2:** OP1 + OP2 + OP3 + OP8 (Blotato signup, TikTok account warm-up — TikTok needs 4 weeks minimum so created May 2 = ready June 1).

---

**Document version:** 1.0
**Last updated:** May 4 2026 (sprint start)
