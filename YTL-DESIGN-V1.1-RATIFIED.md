# YTL DESIGN — V1.1 (RATIFIED)
## YouTube Long-form Pipeline · Distribution Queen V2 · taxchecknow
**Status:** RATIFIED 2026-06-11 — D1–D8 + A1–A7 ratified per Design review; S1–S6 sharpenings registered (§8). Build gated on YTS spine close.
**Relationship:** Sibling of the YTS pipeline (see `YTS-BUILD-FINAL.md`). Same chassis, different engine.
**Date:** 2026-06-11 (AWST)

---

## 0. WHY LONG-FORM (THE STRATEGIC CASE)

Shorts and Long-form are different businesses sharing one channel:

| | YTS (built) | YTL (this doc) |
|---|---|---|
| Job | Cheap scouts — burst discovery, fast data | Compounding assets — search-ranked authority |
| Lifespan | 48–72h burst, then decay | Ranks in YouTube + Google search for YEARS |
| Discovery | Shorts shelf / feed | Search intent ("how does Division 7A work") + suggested |
| Cost per unit | Cents (script + template render) | 10–30× (long script, voiceover, chaptered render) |
| Volume | 3/day | 1–2/week |
| What decides success | Hook (first 2s) + packaging | Title+thumbnail CTR, then RETENTION curve |
| COLE role | Traffic bursts to calculators | The **compliance-authority factory thesis made video**: citable, rankable, AI-quotable anchor content |

**The core strategic loop (the B-over-A asymmetry, applied):**
Shorts prove demand cheaply → the Winners board identifies which products
pull views and convert → Long-form invests heavy production ONLY in proven
territory. YTL's selection pool is not the 47-product foundling pool — it is
**Shorts winners + operator picks**. Shorts scout; Long-form occupies.

This also means YTL *consumes* YTS data, so the YTS spine (verdicts, Winners
board / Step 11) feeds it by design, not by coincidence.

---

## 1. WHAT CARRIES OVER UNCHANGED (THE CHASSIS — ~60% OF THE SYSTEM)

Already built, already live-proven, reused as-is:

1. **The implicit state machine** on `content_jobs.output_data` — YTL gets
   its own key namespace (`ytl_*`), same single-slot-per-product pattern,
   multiplicity in `content_assets`.
2. **content_assets lineage** (sequence/version/parent_asset_id) — identical.
3. **campaign_calendar** — same table, same lanes machinery:
   `platform='youtube'`, `format_type='long'`, lane `ytl_winner` /
   `ytl_pick` / `manual`. The cadence cap, manual-lane reservations,
   overdue-grace cap-aware roll: all apply verbatim.
4. **Gate-2** — the AssetInbox is already generic over `asset_type='video'`;
   needs only a format badge. Approve ≠ post; calendar owns timing.
5. **The attribution circuit (Step 8) — near-zero new work.**
   `utm_content = video id` stamped post-publish, UtmCapture on site,
   conversion read per video. The measured-since epoch already exists.
6. **The bridge** → per-video `content_performance` row (+ `format` column).
7. **The config-file pattern** — `YTL-CONFIG-taxchecknow.md`, one YAML
   block, every key defaulted, operator-tunable without deploys.
8. **The scheduler pattern** — planner/executor tick. (Decision D6: same
   bee with a format dimension vs sibling bee.)
9. **GHA render worker** — same queue, same drain mechanics, M3.1 instant
   trigger benefits both.
10. **The governance ruling** — human click is fine; the JUDGMENT migrates
    to yt-m2. yt-m2's criteria get a long-form profile (retention-aware),
    not a separate bee.
11. **Every hard rule in YTS-BUILD-FINAL §9.** Paid for once; honoured twice.

---

## 2. WHAT IS GENUINELY NEW (THE ENGINE — THE OTHER 40%)

### 2.1 The format itself — [DECISION D1: ratify the format]

**Proposed: the Chaptered Walkthrough.** 4–8 minutes, structure:

```
0:00 COLD OPEN HOOK     (15–25s — the trap/stake, same psychology as Shorts,
                         more room: a 2-line story beat is allowed)
0:25 WHAT THIS COVERS   (10s — chapter promise; sets retention expectations)
0:35 SECTION 1..N       (3–6 chapters × 45–90s: rule -> example with real
                         figures -> the mistake people make)
~70% CTA #1             (mid-roll: "check your own position" + on-screen URL)
END  THE EDGE CASES     (the section that earns authority: what generic
                         advice misses — the citation-gap content)
END  CTA #2 + END SCREEN (calculator + a related video card)
```

Visual system: extends the existing Remotion engine — chapter title cards,
figure displays (the Shorts fontSize ladder reused), and the **click-path
demo clips the combo-search generator already records**, used long-form: the
calculator walkthrough IS the product demo. No talking heads, no avatars —
consistent with the established channel look (dark cards, gold accents).

Why not screen-record-only: pacing dies. Why not slides-only: no product
proof. The hybrid is the format.

### 2.2 Production pipeline — three new bees + one composition

- **ytl-s0 OUTLINE bee** (NEW STAGE — this is the key cost/burden control):
  produces title candidates (3) + chapter outline + target keyword + the
  hook beat. **Gate-0: operator approves the OUTLINE** (a 20-second read)
  BEFORE any full script tokens are spent. Long scripts are 10–30× Shorts
  tokens; outline-first means a wrong direction costs cents, not dollars,
  and the operator never has to read a 1,200-word script to discover the
  angle is wrong. [DECISION D2: ratify Gate-0]
- **ytl-s1 SCRIPT bee**: outline → full chaptered script with per-chapter
  figures, demo-clip cues, both CTAs, and the description block (chapter
  timestamps, keyword paragraph, calculator link with UTM placeholder).
  Gate-1 (existing pattern) on the full script.
- **ytl-s2 PRODUCER**: assembles render props (chapters[], clips, figures,
  voiceover text per chapter) → enqueueRender with `format:'long'`.
- **Long composition** in render-engine: `LongForm.tsx` — chapter sequencer
  over the existing card/figure/demo components. Thumbnail: a DESIGNED
  composition (not the Shorts auto-still) — title text + ONE figure + the
  established style; this is the highest-leverage pixel real estate in
  long-form. CTR testing is first-class (see §2.4).

### 2.3 Publish + SEO layer
yt-s3 variant with `format:'long'`: NOT marked as Short, description with
chapters (YouTube auto-chapters from timestamps), tags, category. Post-publish
stamp (existing). End screens / cards: **probe** whether Zernio or the Data
API path supports them; if manual-only, they're a 60-second operator step in
V1, automated later. [PROBE P-L5]

### 2.4 Measurement + verdicts — the YTL ladder
Same reaction-bee skeleton, different physics:
- **Maturity:** search-driven views compound slowly. Maturity floor = 28 days
  OR 500 views (whichever first); interim reads at 7/14d are signals, not
  verdicts. [DECISION D3: ratify the 28d/500 floor]
- **Verdict inputs:** CTR (impressions→views), average % viewed + the
  retention curve shape (where do people leave?), sessions/conversions
  (same 8c read), search impressions if the Analytics API probe (June 13–14)
  yields them.
- **Rewrap arm:** packaging rewrap (title/thumbnail) is the PRIMARY lever —
  cap 3 per video (vs 2 in YTS) because CTR iteration is the long-form game.
  Hook rewrap = re-cut the cold open only (chapters survive); full re-script
  only on a dead-on-arrival verdict. Edit-in-place applier (7c) reused
  verbatim — A4 privacy contract and all.

### 2.5 Cadence + selection — [DECISION D4 + D5]
- **D4 cadence:** propose **1/week** to start (Tuesday 09:00 AWST), config
  `lanes: { ytl_winner: 1, ytl_pick: 0 }`, horizon 14 days (long-form is
  planned, not reactive — the 3-day YTS horizon logic doesn't transfer;
  production takes days and slots are weekly). Scale to 2/week when the
  pipeline proves smooth.
- **D5 selection:** draw order = (1) Shorts winners (Winners board / Step 11
  output: views + conversions ranked), (2) operator picks (the `ytl_pick`
  lane — you will sometimes KNOW a topic deserves long-form before Shorts
  prove it), (3) never random pool-fill. Empty pool → the lane simply
  doesn't fill (no filler — same rule as YTS cascade).

---

## 3. DECISION REGISTER (OPERATOR RATIFICATION REQUIRED)

| # | Decision | Proposed | Status |
|---|---|---|---|
| D1 | Format | Chaptered Walkthrough, 4–8 min, Remotion hybrid (cards + demo clips), no talking heads | ✅ RATIFIED |
| D2 | Gate-0 outline approval before full script | YES — burden + token control | ✅ RATIFIED |
| D3 | Maturity floor | 28 days OR 500 views; interim reads are signals only | ✅ RATIFIED |
| D4 | Cadence | 1/week (Tue 09:00 AWST), 14-day horizon, scale to 2/week on smooth | ✅ RATIFIED |
| D5 | Selection | Shorts winners first, operator picks second, never filler | ✅ RATIFIED |
| D6 | Scheduler shape | EXTEND yts-scheduler with a format dimension (one bee, one set of books) vs sibling ytl-scheduler | ✅ RATIFIED: EXTEND (one bee, format dimension; YTS success path byte-for-byte unchanged + explicit YTS regression test when the dimension lands) |
| D7 | Voiceover | Same TTS voice as Shorts (channel consistency) vs upgraded voice for long | ✅ RATIFIED: same voice; pacing checked PRE-publish via yt-m2 (S5), not discovered at day 28 |
| D8 | First video | The top Shorts performer at build time (by views; conversions if any measured) | ✅ RATIFIED |

Caps proposed (config, not code): packaging_rewrap_cap: 3 ·
hook_rewrap_cap: 1 (cold-open recut) · full re-script: verdict-gated, operator-approved.

---

## 4. IMPLEMENTATION STEPS (THE YTS DISCIPLINE, APPLIED)

Prerequisite gate: **the YTS spine closes first** — clean TICK 3 → cron →
M3.1 → 10b (the ffprobe floor matters MORE for long renders) → yt-m2 v1.
Step 11 (Winners board) is a YTL *input*, so it slots before or parallel to
L6. Rationale: YTL consumes YTS data and shares its rails; building the
second engine while the first is mid-proving violates one-directive-at-a-time.

Every step: probe-before-build · dry-before-live · branch `phase-b/ytl-*` ·
explicit adds · merge --no-ff · build gate · operator green ·
cole-marketing-first when config/docs are touched.

```
L0  PROBE (read-only, one directive):
    P-L1 render-engine: composition registry, TTS length limits, the demo
         clip inventory (which products have recorded click-paths + lengths),
         estimated render time for a 6-min comp on the GHA runner (timeout
         risk — runner job limit vs Remotion render speed)
    P-L2 Zernio: long-form upload support, NOT-a-Short flagging, description/
         tags/category pass-through, scheduled-publish support
    P-L3 yt-s3/bridge: what hardcodes "Shorts" (titles, #shorts tag,
         visibility, category 22-vs-27 backlog item bites here)
    P-L4 content_performance + snapshots: format column? retention/CTR
         fields available from the current snapshot source? (June 13–14
         Analytics re-probe folds in here)
    P-L5 end screens/cards: API path available, or manual V1
    P-L6 campaign_calendar/format_type: confirm 'long' flows through queue
         UI + executor filters without collision with YTS lanes

L1  SCHEMA + NAMESPACE: ytl_* output_data keys ruled; content_assets +
    content_performance format awareness; migration if P-L4/6 require.
    Config file YTL-CONFIG-taxchecknow.md committed (cole-marketing first)
    with D3–D5 values; loader extends yts-config.ts.

L2  ytl-s0 OUTLINE bee + Gate-0 UI (an OutlineInbox card on the DQ YouTube
    view — sibling of the Gate-1 inbox; approve/reject + reason, same
    server-action template).

L3  ytl-s1 SCRIPT bee (outline → chaptered script + description block) +
    Gate-1 reuse (the existing script inbox renders it; long scripts get
    a collapsed view).

L4  LongForm.tsx composition + designed Thumbnail variant + ytl-s2 producer
    (props assembly, enqueue format:'long').
    TEST: one full render of a REAL product end-to-end, eyeballed (the
    Batch-1 equivalent moment). This is the step with unknown-unknowns —
    budget for the fontSize-ladder class of fixes.

L5  PUBLISH PATH: yt-s3 long variant per P-L2/P-L3 findings; bridge format
    stamp; UTM self-stamp (existing); chapters in description verified live
    on ONE canary video (unlisted first, then public — the YTS canary
    discipline).

L6  SCHEDULER EXTEND (D6): ytl lanes in the planner draw (selection per D5,
    reading the Winners board), weekly slot planning, executor format-aware.
    Dry tick → manual live tick → only then the lane goes in the cron'd
    config.

L7  VERDICT LADDER YTL: reaction-bee long profile (D3 maturity, CTR +
    retention inputs per P-L4), rewrap dispatchers format-aware (packaging
    cap 3, cold-open recut path).

L8  yt-m2 LONG PROFILE: retention-aware grading criteria added to the
    judging bee (chapter pacing, cold-open strength, CTA placement) —
    the same override-capture learning loop.

L9  DASHBOARD: the YTL/YTS split (standing backlog item lands here) —
    format toggle within the YouTube view; Gate-0/1/2 inboxes badge format.

L10 DOC: YTL-BUILD-FINAL.md appended to this doc's home as steps close,
    same as the YTS record.
```

---

## 5. WHAT THIS COSTS / WHAT IT RETURNS (HONEST SIZING)

Per video: ~$0.10–0.40 tokens (outline+script+grading) + one long GHA render
(minutes of compute, free tier) + ~2 minutes of operator clicks (Gate-0
outline read, Gate-1 skim, Gate-2 watch-at-2× until yt-m2 takes it).
At 1/week this is noise against the YTS run-rate.

Return profile: unlike Shorts, a ranked long-form video is an APPRECIATING
asset — search traffic compounds, AI systems cite it (the 114-citations
signal made video), and every view carries the same measured UTM circuit to
a calculator. Worst case per video: a measured zero and a packaging-rewrap
education. The downside is capped by the same gates; the upside has no
decay clock.

---

## 6. OPEN QUESTIONS (CARRIED HONESTLY, NOT HIDDEN)

1. GHA runner limits for long renders (P-L1) — may force render chunking or
   a beefier runner; unknown until probed.
2. Retention-curve data availability (P-L4 / Analytics probe June 13–14) —
   the YTL verdict ladder degrades gracefully to CTR+conversions if the
   curve isn't readable yet.
3. Whether Zernio long-form upload preserves scheduled-publish — if yes, the
   executor can hand YouTube the timing (nicer); if no, the tick publishes
   at slot time exactly as YTS (proven).
4. Voice fatigue over 6 minutes (D7) — answered by the first render's
   eyeball, cheaply.

---
*Design holds until ratified; build does not begin before the YTS spine
closes (cron live). Rulings recorded in the Decision Register ride the
normal commit pattern into cole-marketing.*

---

## 7. RESEARCH AUDIT (2026-06-11) — DESIGN vs CURRENT WINNING PRACTICE

Sources: Sabrina Ramonov's 2025 Social Playbook (sabrina.dev /
help.blotato.com) + 2026 long-form orthodoxy (vidiq, 1of10-school
retention research, algorithm checklists).

### Confirmed aligned (no change)
- Long-form = credibility/authority layer fed by short-form discovery;
  combined Shorts+long channels grow materially faster — the scout/occupy
  thesis IS the recommended structure.
- Product embedded NATURALLY inside genuinely valuable tutorial content
  (Sabrina's #1 long-form type) = our calculator-walkthrough chapters.
- 1 long-form/week solo-operator quota = D4 exactly.
- "Solutions not formats" — answer the search question = D5 selection.
- Packaging (title+thumbnail, one clear idea, custom thumbnail) as the
  primary iteration lever = our packaging-rewrap-cap-3 design.
- Hook as the highest-leverage element = the cold open.
- Long-form as the SOURCE asset for repurposing = COLE-native (see A4).

### AMENDMENTS (ratified into V1 by this audit)

A1. **Cold open rewrite — validate the promise instantly.** The
    title/thumbnail promise must be validated in the FIRST TWO SENTENCES;
    visual payoff on screen <10s; NO channel preamble. The separate 10s
    "what this covers" section is DELETED — compressed to one spoken line
    inside the open. (First-30s retention decides distribution; ~20% of
    viewers leave in 15s when intros delay the payoff.)

A2. **The 10-second rule — composition pacing.** Something on screen must
    change every ≤10 seconds (cut, card, figure, zoom, demo motion).
    Becomes (a) a LongForm.tsx composition requirement and (b) a yt-m2
    long-profile grading criterion. Faceless long-form lives or dies on
    visual variety.

A3. **Verdict ladder gets the orthodox numbers + the CTR decision tree:**
    - first-30s retention target ≥70% · AVD target ≥50% (5min+ videos)
    - CTR <4% sustained → PACKAGING rewrap (title/thumbnail)
    - CTR >10% with poor retention → OPENING recut (the hook rewrap)
    - **24h no-touch window** post-publish (packaging edits reset the
      algorithm's test) — hard floor in the packaging dispatcher
    - judge no earlier than day 14 ("videos come alive on day 9");
      28-day maturity (D3) stands, now evidence-backed.
    - NEVER unlist/delete an early flop inside the window.

A4. **Repurposing output is part of the pipeline, not an afterthought:**
    each YTL script/chapter set auto-feeds cole-stories (article + LinkedIn
    + newsletter section) — the long-form video is the week's SOURCE asset.

A5. **Publish-hour checklist** added to the executor/runbook: chapters
    verified live, pinned comment with the calculator link (+UTM), end
    screen/card to calculator + related Short (per P-L5 probe findings).

A6. **Gate-0 shows search evidence:** the outline card includes the target
    keyword + a quick demand signal so the operator approves an ANGLE WITH
    AN AUDIENCE, not just a nice outline.

A7. **Faceless tradeoff acknowledged:** faces lift thumbnail CTR 20–30%
    and we forgo it by design (factory consistency, no persona risk).
    Compensation: high-contrast single-figure thumbnails + claim text;
    revisit ONLY if CTR floors persist across packaging rewraps.

D1 (format), D2 (Gate-0), D4 (cadence), D5 (selection) survive the audit
unchanged. D3 survives strengthened (A3 numbers). yt-m2's long profile
gains A1/A2 as explicit criteria.

---

## 8. DESIGN REVIEW SHARPENINGS — S1–S6 (RATIFIED INTO V1.1, 2026-06-11)

External Design review ratified D1–D8 and A1–A7 in full, and added six
sharpenings, all accepted:

S1. **Thumbnail variation generation — ruled before the first packaging
    rewrap ever fires:** operator-authored variants for videos #1–5 (the
    CTR-psychology training set), then LLM-assisted WITH operator approval
    from #6+, using the operator-authored exemplars as in-context examples.
    The queen-training pattern: judgment-loaded skill transfers to system
    encoding over time.

S2. **Measurement-availability degradation is EXPLICIT, never silent:**
    until P-L4 confirms retention-curve readability, the YTL verdict ladder
    runs on the reduced signal set (CTR + AVD + conversions) and A3's
    first-30s ≥70% target is recorded as ASPIRATIONAL-NOT-ENFORCED — a
    named constraint in the config file, not a quiet fallback.

S3. **yt-m2 long-profile is LOAD-BEARING for YTL** (28-day verdicts mean
    the first ~5 videos fly blind on outcome signal): A1 (cold-open
    validates the promise in 2 sentences) and A2 (10-second pacing rule)
    become explicit HARD-FAIL grading criteria in the long profile, not
    soft signals. yt-m2 is the only thing standing between a systematic
    format defect and 5 published copies of it.

S4. **Render-time budget probe promoted:** P-L1 must include ONE realistic
    6-minute composition render on the GHA runner BEFORE L4 builds. If the
    render exceeds the viable window (~30 min), the architectural
    mitigation (chunked chapter renders / beefier runner / simplified
    composition) is decided BEFORE L4, not discovered inside it.

S5. **Voice/pacing is a PRE-publish check:** yt-m2 long-profile gains
    "voiceover pacing, pause patterns, and emphasis appropriate to chapter
    length and content density." The voice itself stays constant (channel
    consistency, D7); its execution is graded before the 28-day clock
    starts, never after.

S6. **Render-completes-before-slot check in the executor:** if estimated
    render duration exceeds the buffer before a publish slot, the executor
    delays to the next cycle and SURFACES the constraint — the calendar's
    cap-and-flag behavior applied to time.

**Hard-rule promotion:** the A3 24-hour post-publish no-touch window is
CODE-SIDE TEETH in the packaging dispatcher (a guard that refuses the
edit), not config discipline. Same class as the A4 privacy contract.

Review caveats carried honestly: the review verified architectural
reasoning against locked rulings, NOT live system state — all six P-L
probes remain the factual gates and run before L1. The prerequisite stands:
**the YTS spine closes first; L0 does not start before it.**
