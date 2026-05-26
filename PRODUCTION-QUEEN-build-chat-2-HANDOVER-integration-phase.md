# PRODUCTION QUEEN BUILD CHAT #2 — HANDOVER — V2: BUILD PHASE DONE → INTEGRATION PHASE

> For the next instance of THIS chat — the **Production Queen build chat #2** (me). If this
> conversation compacted, read this first. It captures who I am, the operating model, the
> disciplines, and the exact live state at the pivot from "build the bees" to "wire + dashboard +
> first end-to-end run (P7)."
>
> ⚠️ NAMING: do NOT confuse "Production Queen build chat" with the **Strategic Queen** (a queen in
> the system) or the chat that built her. There are TWO Production Queen build chats: **chat #1**
> built bees A–D; **chat #2 (this one)** built bees E–H. My function is planning/directing (I never
> touch the repo) — but my project identity is "Production Queen build chat #2," NOT "Strategy
> Queen" / "Strategic" anything.

---

## WHO I AM (the role — never drift from this)

I am the **Production Queen build chat #2**: I plan, spec, architect, and write the **directives**
that get pasted into **Session A**. I **NEVER touch the repo.** I have never run a build myself;
Session A (Claude Code on operator Matt V's Windows machine) is the ONLY party with repo access.
(I built bees E–H this session by authoring the directives Session A executed.)

**The cast:**
- **Me — Production Queen build chat #2** — write directives → operator pastes into Session A.
  Authored the *build directives* for bees **E–H** this session.
- **Production Queen build chat #1 ("big daddy" = its Design-approval reference)** — built Production
  bees **A–D** and specced the Strategic→Production wiring + the conveyor-belt lockdown. It documents
  the architecture-of-record. It does NOT touch the repo either; it feeds findings, the operator relays.
- **Session A** — Claude Code; the only repo-toucher; executes my directives.
- **Design** — rules architecture forks. The operator routes between Design and me.
- **Operator (Matt V)** — routes everything, runs SQL (only party with live-DB access), makes the
  business/liability calls.

**Division of authorship, settled (don't get this wrong — it got muddled twice and was corrected):**
bees **A–D** = Production Queen build chat #1; bees **E–H** = me, chat #2 (this session). Same Session A,
same Design, one continuous pipeline handed from chat #1 to chat #2. We are NOT racing; we are segments
of one build. (And neither of us is the **Strategic Queen** or her build chat — different thing entirely.)

---

## THE NON-NEGOTIABLE DISCIPLINES (these caught FOUR real bugs this session)

1. **PROBE, never guess.** STEP-0 reads REAL source before any edit/decision. This caught:
   the advanceBuildState clobber (#35 C-fix), the verified_facts synthesized-answer premise (#36),
   the Q2 escape-states flip (#31), and the "read-path-only bypass" that would have destroyed Bee G's
   bedrock (#38). It ALSO just caught a STALE BASELINE — the "consumer spec-only" claim was wrong;
   the consumer is built. **Reading real code beats trusting any summary, including a sibling chat's.**
2. **When a ruling's premise is falsified, route the falsification BACK to whoever owns the ruling.**
   Don't adopt my own reshape of someone else's decision.
3. **Bank each part before the next** — repo IS memory, chat is disposable. (This doc is that
   discipline applied to my own role.)
4. **Commits carry NO trailer.**
5. **Separate fact from judgment** — state verified facts as facts, inferences as inferences.
6. **Shared-surface changes get Design's blessing, not my assumption.**
7. **VANILLA** — every bee/mechanism is generic; flavour (jurisdiction/currency/blocklist) enters at
   the delivery adapter/config, never baked in.
8. **GOAT** — "cited because it's right"; honest-thin BEATS fabricated-full; never-fabricate is the moat.
   GOAT is the PRODUCT-correctness standard — don't misapply it to internal mechanics.
9. **Build proportional; let the first end-to-end run reveal real problems** — don't gold-plate before P7.
10. **Long directives truncate in transit.** Keep them tight by REFERENCING banked rulings (#-numbers)
    rather than re-carrying full text. Session A correctly HOLDS and flags truncation rather than
    guessing (it did this twice — #36 bank and the H-wrap). Build in atomic tsc-clean parts.
11. **Two SQL checks / live-DB facts: only the operator can run them.** Session A has no DB access.

---

## WHERE WE ARE — the verified state at this pivot

**ALL 8 BEES (A–H) BUILT + typechecked + documented + banked.** Repo (soverella) tip at last build
work = `1546070` (the H wrap: bee-h.md + redirect + README "ALL 8 BEES BUILT" + TODO.md).

**Commits:** A=39f32a8 · B=8b9aec0 · C=19661d8 · D=d376a87 · E=143fcc7 · F=6908c43 · G=0ad6996 ·
H=6b57add. PROGRESS rulings through #38.

**THE COUPLING IS BUILT, NOT SPEC-ONLY** (the other chat's probe falsified the stale "spec-only"
baseline; verify-the-code won again):
- `production-orchestrator.ts::claimNextHandoff()` polls `strategic_queen_handoffs` for
  `approval_status='APPROVED' AND production_pickup_at IS NULL`, guard-claims via
  `production_pickup_at`, creates the DRAFT `products` row + the `build_jobs` row, closes lineage
  via `production_product_id`. REAL + typechecked.
- `production-pipeline.ts` = the generic state-machine-over-declared-pipeline (phases as data, walked
  domain-blind). Both cron routes wired.
- **`build_jobs` IS APPLIED to the live DB** (operator ran the SQL — confirmed). Real shape: 13 columns
  incl. `research_output jsonb default '{}'` (the accumulator every bee reads/writes), `build_state text
  default 'PICKED_UP'`, plus product_id/source_handoff_id/site/run_id/bee_completions/failure_detail/
  retry_count/started_at/updated_at/completed_at/id.
- `build_state` enum = **16 values, not 13** — grew 3 NEEDS_* blocked states (NEEDS_AUTHORITY_URL,
  NEEDS_CALCULATOR_APPROVAL, NEEDS_AI_REVIEW) across later migrations. BLOCKED_STATES vs TERMINAL_STATES
  distinction lives in `production-types.ts`.

**THE COUPLING HAS NEVER EXECUTED. P7 = 0. Built ≠ proven.** The maiden run is the next milestone.

**Stale-baseline correction (important):** the conveyor-belt lockdown was written believing "consumer
spec-only." That's WRONG — the consumer is coded end-to-end. The lockdown's forward-looking design
(three human stops, feedback-edge observable-not-actuating, GOAT-section-plan-is-the-seam, backpressure)
survives; but its framing "build the consumer + rule the forks before building" is wrong — several forks
are already decided IN CODE. A reconciliation of the lockdown against as-built reality is owed (the other
chat's "option 3").

---

## THE REAL PIPELINE FLOW (as built — NOT a simple A→H march)

```
RESEARCH (A‖B‖C parallel, Promise.allSettled)
   A BLOCKS on no-authority (NEEDS_AUTHORITY_URL — grounding IS the gate)
   B, C complete-on-thin (enrichment, not gates)
→ CALCULATOR (D) — parks NEEDS_AI_REVIEW (INVARIANT-1 fail-closed; D never sets CALCULATOR_DONE itself)
   → AI-review gate (gpt-4o, CORRECTNESS): FAIL → CALCULATOR_FAILED (terminal, no human override);
     PASS → create operator pending row + NEEDS_CALCULATOR_APPROVAL
   → operator gate (SHIP): approve → CALCULATOR_DONE; reject → CALCULATOR_FAILED
→ ASSEMBLY (E): CALCULATOR_DONE → ASSEMBLED (writes research_output.page; INVARIANT-1-inverted)
→ QUALITY_GATE (F): ASSEMBLED → QUALITY_PASSED / QUALITY_FAILED (3-way verdict, any-FAIL disqualifies)
→ LEGAL_GATE (G): QUALITY_PASSED → GATES_PASSED / GATES_FAILED
H = continuous cron, OUTSIDE this flow (drift monitor; route exists, cron schedule NOT wired)
```

Each bee reads/writes `build_jobs.research_output.<concern>` (authority/voice/competitor/calculator/
page/quality/legal). Fails: NEEDS_AUTHORITY_URL/RESEARCH_FAILED, CALCULATOR_FAILED, ASSEMBLY_FAILED,
QUALITY_FAILED, GATES_FAILED.

---

## THE LIVE DECISION IN FLIGHT — the calculator-gate liability fork (ROUTED TO DESIGN)

**Operator's fixed liability intent:** he must NEVER be the party approving the calculator's
CORRECTNESS (legal/tax content; correctness liability deliberately assigned to the AI reviewer).

**Verified by Session A (real code):**
- AI owns correctness, hard-stop, NO human override ✓ (FAIL → CALCULATOR_FAILED terminal, no operator
  row; operator queue holds only AI-passed engines by construction).
- BUT the operator gate (NEEDS_CALCULATOR_APPROVAL) is MANDATORY — a BLOCKED_STATE, no auto-advance flag;
  a human must click approve for any calculator to proceed.
- The click is mechanically SHIP (re-judges nothing) but UN-FRAMED — the card's payload is the engine
  itself, so clicking "approve" on tax content reads, optically/legally, as a correctness vouch.
- The operator approval UI is UNBUILT (Step L deferred) — framing doesn't exist yet either way.

**OPERATOR'S DECISION (made): option (c)** — realize the intent as a **flagged ship/visibility gate**:
- Calculator stop reframed as SHIP/PROCEED, explicitly "the AI certified correctness; this is NOT a
  correctness judgment."
- Flag-controlled. **Default for first runs = human-VISIBLE** (operator SEES the calculator + gpt-4o
  signoff + clicks proceed — because the whole point of the first runs is to WATCH it in action and catch
  jams). Collapsible to **auto-advance** (pure option-a) with one config flip if the stop proves redundant.
- Operator's principle, explicit: "choose the best default, watch it run, change it if it jams" — don't
  over-design the gate before seeing it execute. Pure-(a) auto-advance would fly blind past the calculator
  on the maiden run (the opposite of "see it in action").

**Routed to DESIGN to CONFIRM (not choose — operator chose the shape):** (1) is the ship-only framing
legally sound? (2) is default-visible / flip-to-auto consistent with WHY the lockdown placed a human stop
there — if that stop ALSO carried a business/cost go/no-go function, visible-default preserves it; confirm
that's the right realization. **This ruling unblocks the A/B test plan AND the approval-card design.**

---

## FORWARD PLAN (in order)

1. **[AWAITING] Design's ruling on the calculator-gate fork** (above). STEP-0-verify any code premise it
   rests on before acting.
2. **Build the Monitor / Production-Queen panel** (Session A directive — mine to write next). It is the
   INSTRUMENT to watch the verified-real, never-run coupling execute. Must show the REAL 16-state machine
   (incl. D's NEEDS_AI_REVIEW + NEEDS_CALCULATOR_APPROVAL gates), the gpt-4o calculator signoff, a thin
   cost/API-activity indicator (from `agent_log` — every bee call is `callClaudeTracked`-tagged; Strategic's
   panel already shows COST 24H this way), failure-reason visibility, and a GATES_PASSED output peek (bare
   for v1). Mirror the Strategic Queen panel shape (header: alive + Run-now/Pause/Settings + stat slots;
   the panel exists for Strategic/Distribution/Adaptive/Governance — Production = "coming soon" placeholder).
   ⚠️ The "8-bee row" framing is WRONG — it's a phase machine with a built-in operator gate, not 8 equal steps.
3. **The first end-to-end run (P7)** — THE verifier. Needs: ≥1 APPROVED handoff (the Approvals tab already
   has 100 Strategic handoffs pending, Approve/Reject live), OPENAI_API_KEY + engine keys in deployed env,
   `build_jobs` applied (✓ confirmed). Pick a topic with a real Bee A fact-object (figures) so E's 2d fills.
   Tweaks EXPECTED — operator's explicit expectation.

---

## BUCKET-2 ITEMS THE FIRST RUN WILL HIT (probe before designing — do NOT guess these; unread live code)

- **Stripe env-var gate** — the operator creates two Stripe products per build ($67 + $147) as env vars
  (convention from the Vercel screenshot: `STRIPE_<SLUG>_147` / `STRIPE_<SLUG>_67`, e.g.
  `STRIPE_AU_FRCGW_147`, `STRIPE_NOMAD_BECK_67`). The system needs a way to know the operator created them
  before it can generate the success page. VANILLA, under taxchecknow, not site-tied. **PROBE how
  Stripe/success-page works today; likely a Design fork on the gate's form.** Not designed yet.
- **Email per-page config** — "what config per new page, is it wired?" Operator unsure it works.
  cole-email-system skill exists in repo. **PROBE current state — unknown.** Not designed.
- **Delivery adapter** — generic `research_output.page` → live taxchecknow page; folds G's
  `contradictions[]` → ai_corrections; renders disclaimer. DEFERRED all build session. Mechanism unsettled
  (DB-write vs PR). The first run verifies bees→artifact; artifact→live-page is a SECOND test after the adapter.
- **Disclaimer content registry + disclaimerForJurisdiction()** — BLOCKED-ON-OPERATOR, PRE-GO-LIVE-CRITICAL
  (legally-sensitive authored content; the forbidden-phrase check lands with it — import the then-exported
  v1-policy checker, don't duplicate BLOCK_RULES).
- **H cron SCHEDULE** — route exists; the Vercel-cron entry that invokes it on a cadence is operator/deploy.

---

## EXISTING DASHBOARD SURFACES (verified from operator screenshots — partially built, may be LEGACY-wired)

- **/dashboard/approvals** — "STRATEGIC QUEEN V2 HANDOFFS (100 pending)", per-card Approve/Reject, score,
  BUILD NEW, Show evidence. **Gate 1 (build trigger) lives here.** Operator wants it made MULTI-QUEEN
  (a queen selector/dropdown) so Production's surfaces can live here too. Does NOT yet render
  approve_calculator_engine (the calculator gate's UI is unbuilt — Step L).
- **/dashboard/pipeline** — traffic-light "every product in flight", 47 products, filters
  (All/Needs-You/Problem/Live/Building). ⚠️ Cards show `backfill_legacy` "BUILDING 24d" — likely the
  LEGACY system's pipeline, may NOT reflect the V2 bees. CONFIRM whether Pipeline reads the same
  build_jobs/products the V2 bees write, or a legacy source.
- **/dashboard/monitor** — six queen panels; Strategic/Distribution/Adaptive/Governance LIVE+clickable;
  **Production = "Panel coming soon"** (the hole to fill); COLE Orchestrator = SPEC ONLY.

---

## DECISIONS DEFERRED BY OPERATOR INTENT (do not build ahead of these)

- **NO final go-live (Gate 2) approval built yet.** Operator: "don't sign off the gate until we've pushed
  one product start→end, THEN sign and document." First run STOPS at GATES_PASSED for manual inspection;
  the real go-live gate is designed around the REAL artifact AFTER the first run. (Correctly "let the test
  reveal" applied to the gate's design.)
- **NO drift queue (Gate 3) yet** — H not cron-scheduled.

---

## KEY LOCKED RULINGS (PROGRESS.md, soverella docs/help/production-queen-v2/)

#11 operator-approval lock · #18–#22 Bee A · #24 Bee B/C · #25 decision-engine doctrine · #26 orchestrator
block contract + operator gate + 4-stage delivery boundary · #27 route-first menu-curation + AI-review gate
+ thin-voice fallback · #28 fact-object gate (AI-review cross-checks verified_facts vs source pre-assembly)
· #29 verdict-path idiom (LLM detects→field, CODE enforces) · #30 thin_reason contract (content-shape-not-
figures_pending trap) · #31 Q2-reruled · #32 countdown · #33 Bee F block-map · #34 Bee F calibrated bar + 2
seams · #35 advanceBuildState fromState-guard (the C fix; return-to-fail idiom) · #36 Bee G arbiter reshape
(bedrock = source_content + pinned figures, NOT synthesized verified_answer) · #37 Bee G grounded half ·
#38 Bee H built. Lock 4 = generic pipeline. Lock 12 = quality(F) never collapses into legal(G).

## REPOS (cross-repo = #1 gotcha — always name the path)
- **soverella** = `/c/Users/MATTV/CitationGap/soverella` — bees (`lib/queens/`), orchestrator, pipeline,
  fetcher (`lib/sources/fetcher.ts`), v2 docs (`docs/help/production-queen-v2/`: PROGRESS.md, TODO.md, bees/).
- **taxchecknow** = `/c/Users/MATTV/CitationGap/cluster-worldwide/taxchecknow` — storefront + GOAT machinery.
- Shared Supabase host `ngxuroxsabyamqcnvrei`.
- EVERY git directive needs explicit `git -C /c/Users/MATTV/CitationGap/soverella` — do NOT rely on shell cwd.
