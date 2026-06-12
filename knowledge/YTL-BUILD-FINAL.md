# YTL BUILD — FINAL
## YouTube Long-form Pipeline · Distribution Queen V2 · taxchecknow
**Status:** BUILD COMPLETE through L7 + companion YTS steps (11, 11b, Onboard-v2, YT-M2). System live and autonomous, 2026-06-11 (AWST).
**Relationship:** Sibling and successor record to `YTS-BUILD-FINAL.md`. Design authority: `YTL-DESIGN-V1.1-RATIFIED.md` (D1–D8, A1–A7, S1–S6). Same chassis, different engine — built in one operator-day.
**Replication grade:** this document + the design doc + YTS-BUILD-FINAL are sufficient to rebuild both engines for any future hive.

---

## 1. WHAT EXISTS NOW (ONE PAGE)

A fully autonomous dual-format YouTube content factory for taxchecknow:

- **Shorts (YTS):** 3/day at 09:00/14:00/19:00 AWST, cron `*/15`, render floor, cadence caps, format guards — per YTS-BUILD-FINAL, untouched (the regression bar held byte-for-byte through every YTL build).
- **Long-form (YTL):** 1/week, Tuesday 09:00 AWST, 14-day horizon. The scheduler draws a candidate (Shorts winner or operator pick), initiates outline → script → render on its own, and publishes off the operator's gates.
- **The judge (YT-M2):** every gated item — outline, short script, long script, expansion, render — receives a reasoned approve/reject recommendation BEFORE the operator looks at it. Every operator click is captured as agreement training data. Auto-approve is scaffolded, all-false, flips only on the operator's explicit config word.
- **The verdict ladders:** Shorts (Step 11 winners board) and longs (L7) classify at maturity, queue winner-expansions, route losers to the rewrap ladder, retire the exhausted, and feed long-form selection. The 24h no-touch window is code-side law.
- **Perpetual intake:** any new product onboards with one command for ~$0.024 LLM + ~8 min compute. The draw runs on two queues (foundlings + winner-expansions) and structurally cannot starve.

Human touches at steady state: ~4 short inbox reads/week, one render watch, gate clicks. Everything else is the machine's.

First public long-form: **au-19 (FRCGW clearance certificate), scheduled Tuesday 2026-06-16 09:00 AWST** — selected by the system's own data, gated three times by the operator, produced entirely by the machine.

---

## 2. THE BUILD SEQUENCE — YTL L0–L7 (SHAs ARE THE LEDGER)

| Step | What | Key commits (soverella unless noted) |
|---|---|---|
| **L0** | Six probes: render-time (~1.5–2×, viable), Zernio format-agnostic + `scheduledFor`, retention curve UNAVAILABLE (S2 invoked), CTR/impressions CSV-only, upload failure surfaced | probe session (no commits; findings in design doc §6) |
| **L1** | Upload hardening (TUS + single-PUT fallback), bridge `format` param (default `short`), `content_assets.format_type` migration, **ytl_\* namespace contract**, YTL config + shared config-util | `5164384`, `c826671` → merge `602865f`; cole-marketing `f5f348d` |
| **L2** | ytl-s0 outliner bee + Gate-0 OutlineInbox + selection helper (`ytl_pick` → top Short interim) | `df81885` → `bbb7107`; cole-marketing `92fa183` |
| **L3** | ytl-s1 scripter (deterministic self-validation: duration band, chapter match, CTAs, A1 promise-token check) + Gate-1 long surface (format-branched actions; shorts byte-for-byte) | `ed9340a` → `b5ba999` |
| **L4** | YTS reconcile guard (skip non-Short comps), worker comp-select (default Short), **LongForm.tsx** (1920×1080, per-chapter TTS → exact starts, ≤10s structural rotation, cold open, mid+end CTAs), **LongThumb.tsx** (1280×720), ytl-s2 producer. First render: run #34, 10m20s wall for 312s video, 25.3MB | branch tip `feb6cc2` → `a94a2cb` |
| **L4.1** | Cold-open overflow hotfix: `fitFont` line-budget sizing + `figureLead()` prose extraction + clipped 5% safe-area stage, **stills-QA-before-render discipline**. Re-render #35 → canary replaced | `d3f59b4` |
| **L5** | ytl-s3 publisher: mint (canonical naming) → real description (chapters/keyword/calc-link `{{utm_content}}`/tags) → **Zernio UNLISTED canary-first** → id resolve → thumbnail (7c applier) → UTM stamp → pinned-comment candidate → `ytl_publish`. Plus B0: worker persists real chapter timestamps into `render_meta.chapters` | `765933a` → `b7fab58`; hardening `e625316`, `da3140a`, `785c10e` |
| **L6** | Scheduler YTL lane (D6: one bee, format dimension) — weekly Tue slot, 7-day min-lead, PLAN→DRAW→INITIATE→EXECUTE, S6 render-by-T-24h roll, long floor band [240,480], **Gate-1.5 render-eyeball** (publish never fires without it), steady-state = scheduled-PUBLIC. au-19 backfilled; June 23 drawn (nomad-02) | `3232a2d` → `06a48f1`; cole-marketing `a16fa48` |
| **L7** | Long verdict ladder: explicit signal inventory (S2 — every verdict records `signals_used`), maturity 28d/500 behind the A3 14-day floor, WINNER/LOSER/NEUTRAL, reaction tree (packaging-rewrap cap 3 as operator task per S1 / hook-recut cap 1 flagged / DOA → re-script candidacy), **24h no-touch as code-side teeth** in `applyPackaging` (both formats; UTM stamp exempt) | `beed472` → `e831553` |

Upload-order refinement (post-L4 ruling): size-routed — <45MB single-PUT-first (2-for-2 proven), ≥45MB TUS-first. `0fcbf6c`.

---

## 3. THE COMPANION YTS-SIDE STEPS (BUILT IN THE SAME DAY, FEEDING YTL)

| Step | What | Commits |
|---|---|---|
| **10b** | Render floor: worker ffprobe → `render_jobs.render_meta`, floor at the mint gateway (audio + >1MB + format band), legacy guard for pre-10b renders, `hidden_7d` counter, stuck-foundling exclusion. ffmpeg added to the runner (NOT preinstalled — verified) | `0b3878e` → `bd19b77`; ffmpeg `bf1cd37` → `1227af3`; cole-marketing `5247430` |
| **Step 11** | Winners board (classify at maturity; conversions auto-promote over views), reaction arm, **two-queue draw** (foundlings + winner-expansions; provably cannot starve), new-product intake detector, `products.retired` | `2857766` |
| **Step 11b** | Winner-expansion executor: yt-s1 expansion mode (priors-as-exclusions, **content-signature dedupe** — menu-hash correctly rejected as a per-product constant), Gate-1 EXPANSION badge, **the archive+swap pattern** (approval archives the live script to `youtube_short_script_history[]` and swaps the expansion in — zero downstream changes), lifecycle close, cap 2/product | `344118e` → `17c36b6` |
| **Onboard v2** | **Tables→data refactor** (`answer-paths.data.json` — onboarding appends DATA, never edits code; 35 paths regenerated byte-identical) + one-command chain: resolve calculator → append → combo-search probe → paid verifier → append verified → synthesize → register. **THE NUMBER: $0.024 LLM + ~8.4 min compute per product.** nomad-02 onboarded live; intake 13→12 | `a7cd4e5` → `eb0619f` |
| **YT-M2** | The judging bee: two profiles (SHORT: deterministic duration/figure-grounding-HARD-FAIL/hook/CTA + LLM rubric + operator-reject-reason curriculum; LONG: A1/A2/S5 hard-fails + LLM), tick enumerate→judge→insert (idempotent on `(job_id,gate,item_signature)`), M2Badge on all five gate inboxes, agreement capture in all 9 actions (non-blocking), auto-approve scaffold all-false. **~$0.005/judgment.** First verdicts: REJECT the au-19 expansion (independently flagged the 47s + weak hook), APPROVE the autonomous nomad-02 outline | `cca22e1` → `9b4effa`; cole-marketing `b2b7bc8` |

---

## 4. DESIGN-vs-BUILT AUDIT (CONDUCTED 2026-06-11 AGAINST V1.1)

Every ratified decision honored. Full table in the session record; the deltas that matter:

- **A4 (repurposing hook — YTL scripts auto-feed cole-stories): NOT BUILT.** Caught by the audit, booked for the closing pass. The data exists in `ytl_script`; the feed is a half-session.
- **D5 selection** still reads the interim top-Short-by-views; swapping to the Step-11 winners-board read is a small pending upgrade.
- **S1 (thumbnail variants)** dormant by design until the first packaging rewrap fires — videos #1–5 are operator-authored.
- **L8 (yt-m2 long profile)** SHIPPED inside YT-M2 (A1/A2/S5 as hard-fails) — closes the S3 blind window.
- Beyond-design additions, all live-forced: Gate-1.5, Zernio as the unlisted-id authority, D-18 title correction on longs, size-routed uploads, text-fit/safe-area discipline, stills-QA-before-render.

---

## 5. ARCHITECTURE — THE LOAD-BEARING PATTERNS (COPY THESE FOR HIVE #2)

1. **Disjoint namespaces** (`youtube_*` vs `ytl_*` on `content_jobs.output_data`): one product carries a short AND a long in flight with zero collision. The contract file (`lib/youtube/ytl-namespace.ts`) IS the law; every bug it prevented was prevented silently.
2. **The gate ladder + irreversibility gradient:** Gate-0 outline (20s read, cents) → Gate-1 script (3-min read, ~$0.06) → Gate-1.5 render eyeball (watch it) → publish. Each gate is cheap relative to what it protects. The judge (YT-M2) fronts every gate; the click stays sovereign.
3. **The archive+swap pattern (expansions):** new content on a proven product integrates by swapping into the existing single-slot key, archiving provenance — ZERO changes to production/render/publish. Multiplicity lives in history arrays and `content_assets`, never in parallel pipelines.
4. **Two-queue draw with degeneration proof:** Q1 foundlings (anything registered + unpublished, forever) + Q2 winner-expansions; empty-Q2 degenerates byte-identically to the original draw (the regression bar), empty-Q1 feeds from Q2 (the no-starve proof).
5. **Tables→data:** anything a future product must join lives in a versioned data file, never hardcoded. Onboarding = append + probe + verify + register, one command.
6. **One scheduler, format dimensions (D6):** the YTL lane is a separate module the shorts tick calls — provable by JSON-diff that shorts behavior never moved. Separate cadences (longs don't count against the shorts per-day cap), shared calendar.
7. **Floor under the gates:** deterministic render floor (ffprobe meta vs format band) below the human eyeball — machines catch the mechanical failures, humans judge quality.
8. **Explicit degradation (S2):** every verdict records `signals_used`; unavailable signals are NAMED (ctr/impressions/avd null until the Analytics re-probe proves them). Never silent.
9. **Code-side teeth for ratified hard rules:** the 24h no-touch is a guard in `applyPackaging` that throws with the rule and unlock time — same class as the A4 privacy contract. Config discipline is for tuning; law goes in code.

---

## 6. THE PUBLISH CHAIN — ANATOMY + QUIRKS (THE EXPENSIVE KNOWLEDGE)

Order of operations (ytl-s3, all idempotent/resumable):
1. Mint `content_assets` (canonical naming: `product_short`/`platform_short`/`generation_date` — NOT-NULL columns bite).
2. Write `ytl_publish` BEFORE post-steps (a post-step failure can never lose the publish record).
3. Publish via Zernio. **Quirks paid for live:** Zernio does not reliably apply the YouTube title (falls back to the description's first line — D-18, both formats) → post-publish `videos.update(title)` is mandatory. categoryId falls back to 22 → applier extension on the backlog; operator sets 27 in Studio meanwhile.
4. **Resolve the video id from Zernio `GET /posts/{id}` → `platforms[youtube].platformPostId`** — authoritative, no lag, and the ONLY automated way to see an UNLISTED video (public-API uploads scans exclude unlisted; `mine=true` OAuth resolved a different brand-manager channel entirely).
5. Title-correct + thumbnail (`applyPackaging` — title BEFORE the UTM stamp so the stamp's wipe-trap merge preserves it) → UTM stamp (`utm_content=<video id>`; EXEMPT from the 24h teeth — it's publish-time mechanics, not a packaging reaction) → pinned-comment candidate via `commentThreads.insert` (PINNING is the operator's manual Studio click) → direct long `content_performance` row (the shorts bridge scans `youtube_publish` only — by namespace design, the long pipeline writes its own).
6. The OAuth token is a **brand manager**: it can EDIT (title/thumbnail/description proven) but **cannot DELETE** (403) — deleting a replaced canary is an owner click in Studio.

Per-chapter TTS (synth-long) gives exact chapter start times; the worker persists them as `render_meta.chapters` so descriptions carry REAL timestamps from the second render onward (the first used flagged estimates).

---

## 7. COST LEDGER (MEASURED, NOT ESTIMATED)

| Item | Cost | Notes |
|---|---|---|
| Outline (ytl-s0) | $0.026 | Sonnet, ~2.1k tokens |
| Long script (ytl-s1) | $0.056 | Sonnet, ~5k tokens, 974 words |
| Expansion script (yt-s1 expansion mode) | $0.030 | incl. dedupe re-roll budget |
| YT-M2 judgment | ~$0.0048 avg | $0.0036 short / $0.0059 long |
| Product onboarding (verifier) | **$0.0235** | + ~8.4 min compute (probe), zero-LLM otherwise |
| Long render | $0 LLM | 10m20s GHA wall-time for 312s video (~2×), free tier |
| **Total LLM per long video** | **~$0.10–0.15** | outline + script + judgments; within the design's $0.10–0.40 envelope |

---

## 8. LESSONS (PAID FOR LIVE — NOW LAW)

1. **Additive migrations run BEFORE the deploy that reads them.** The SQL box goes to the operator at commit time; deploy follows "ran it."
2. **"Success. No rows returned" on DDL verifies nothing about effect.** `drop constraint if exists <wrong-name>` is a silent no-op (auto-generated constraint names). PROBE THE BEHAVIOR: throwaway insert → expect accept/reject → delete. The name-agnostic `DO` block (iterate `pg_constraint`) is the durable fix pattern.
3. **ffprobe/ffmpeg is NOT preinstalled on ubuntu-latest.** Install it in the workflow. Graceful-degrade design (probe failure NEVER fails a render) turned this from an outage into a log line.
4. **TUS resumable is flaky at ~24MB; single-PUT+retry is reliable under the 50MB cap.** Size-route: <45MB single-PUT-first, ≥45MB TUS-first, each with the other as fallback.
5. **Stills-QA before render:** any composition change gets still-frames rendered AND VIEWED at the key beats (cold open, mid-chapter, CTA) before spending a 10-minute render. Caught the thumbnail clip; would have caught the cold-open overflow.
6. **Text-fit is a discipline, not a fix:** every text role gets length-derived font sizing against a hard maxWidth + line budget, inside a clipped 5% safe-area stage. Long-form is watched small on phones.
7. **Zernio is the source of truth for the video id** (sees unlisted, no lag). Never scan YouTube for what the publisher already knows.
8. **`products.slug` is path-form** (`nomad/check/…`); the bare slug derives from the product_key. Verified-then-derived, never assumed.
9. **A per-product constant cannot dedupe per-product content** (the menu-hash catch) — dedupe on a content signature.
10. **Additive means ADDITIVE:** new tick output goes in NEW fields (`reactionSignals`, not the shorts `signals` array). The regression diff is the arbiter, run every build, stripped of additive sections only.
11. **Session A can dispatch GHA** via the git-credential token + `workflow_dispatch` API. If a future instance claims otherwise, it lost context — runs #28–#35 are the proof.
12. **Specs can be wrong; the build corrects them with evidence** (menu-hash dedupe, "expect zero" intake, "ffprobe ships on the runner"). Probe-before-build catches the spec's assumptions too.

---

## 9. OPERATING RUNBOOK (STEADY STATE)

**Weekly rhythm (~30 min total):**
- Gate-0: read the autonomous outline (20s), check yt-m2's badge, pick a title, approve/reject-with-reason.
- Gate-1: read the script (3 min) against the badge. Reject reasons are curriculum — write them well.
- Gate-1.5: watch the render (at 2× is fine). The eyeball is the visual authority — yt-m2 says so itself.
- Shorts Gate-1/Gate-2 as they arrive (badged).
- Glance the winners board + `reactionSignals` for stuck/retired/new-product signals.

**Escape hatches:** `ytl_pick` in YTL-CONFIG names next Tuesday's product directly · S6 rolls an unrendered slot a week automatically · stuck/retired products self-exclude · every config key has an in-code default (a bad edit degrades, never breaks).

**Hard rules that protect you from yourself:** the 24h no-touch will refuse your own packaging edit on a fresh video — that's correct, wait for the unlock time. Auto-approve stays false until YOUR explicit word, gate by gate, earned by agreement rate.

**Onboarding a new product:** `npx tsx scripts/onboard-product.ts <product_key>` — one command, ~$0.024, ~8 min. It STOPS rather than guesses; a STOP message names the manual residue.

---

## 10. REPLICATION GUIDE (HIVE #2'S YOUTUBE ENGINE)

**Copy verbatim:** the render-engine (compositions, synth, worker, recorder), `lib/youtube/*` (namespaces, configs, selection, expansion, winners-board, yt-m2, ytl-verdicts, edit-in-place with the teeth), the bees, the gate inboxes, both config files, the migrations.
**Parameterize (currently taxchecknow-hardcoded):** `SITE` consts, the base domain in `record-calc.mjs`/`build-answer-paths.mjs` (Step-12 backlog item), channel handle in `platform_accounts`, the site-config colors/voice.
**Re-earn per hive (cannot copy):** the operator's gate judgment on the first ~10 items (the yt-m2 curriculum), the answer-path data file (per-product probes), the first-video canary cycle (UNLISTED first, always).
**Cost to stand up hive #2's engine:** the code is a clone; the data is `$0.024 × products`; the judgment is ~2 operator-weeks of normal gating.

---

## 11. OPEN ITEMS (THE CLOSING PASS + BACKLOG)

**Booked:** A4 repurposing hook (ytl_script → cole-stories) · L9 dashboard format toggle + Gate-1 pending-only filter · Step 12 cleanup (shorts_* retirement, taxchecknow reverts `7074ac3`/`8f3e0a1`, base-domain parameterization, ingest-repoint ruling) · ytl-selection → winners-board read swap · M3.1 instant render trigger (operator token outstanding).
**Calendar-gated:** Analytics API re-probe June 13–14 (unlocks CTR/impressions/AVD slots in both ladders — P-L4) · first measured conversions ~June 18–19 · S1 thumbnail variants at first packaging rewrap · July 1 snapshot-TTL re-arm.
**Backlog (one deliberate pass):** categoryId forcing in the applier · TUS ≥45MB reliability · 16:9 short-thumb variant · approve-confirm guard · likes/comments enrichment · auto-approve flip criteria (operator-defined agreement thresholds) · embeddings backfill (OPENAI_API_KEY).

---

## 12. THE RECORD

Built 2026-06-11 (AWST), one operator-day, three roles: Strategy/Design chat (directives + rulings), Session A (Claude Code, builds + verbatim reports), operator (gates, SQL, judgment). Disciplines that made it possible: probe-before-build, dry-before-live, canary-before-public, migration-before-deploy, stills-before-render, explicit-adds-only, byte-for-byte regression as the acceptance bar, and STOP-rather-than-guess. Eight live failures, all caught by canaries before any audience existed. The judge's first act was to disagree — correctly — with its own factory's output.

The machine has the watch.
