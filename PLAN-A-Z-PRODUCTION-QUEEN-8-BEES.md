# PLAN A-Z — Production Queen 8 Bees, Garden to Table

**Created:** Day 14+ session
**For:** Production Queen build chat + Session A + operator Matt V
**Status:** Execution plan. Design is locked (PRODUCTION-QUEEN-DESIGN-DAY13.md). KISS-passed: 8 bees confirmed. Execute without re-debating the bee count.

---

## §1 — Context (3 paragraphs)

This plan takes Production Queen from nothing built to eight bees producing one complete, GOAT-grade product end-to-end, triggered by an approved Strategic Queen handoff, with the operator approving before anything goes LIVE. The end state: an approved handoff is picked up, three research bees run in parallel, two synthesis bees build the page + calculator, two gates check quality and legality, the operator approves, the product goes LIVE, and one continuous bee monitors its authority sources forever.

The KISS verdict is settled: **8 bees is right, not over-scoped.** Unlike Strategic Queen (one activity sliced too thin, cut 13→4), Production Queen's 8 are genuinely 8 different activities. The pass confirmed the count rather than reducing it. Do not collapse bees during the build. The risk is NOT the bee count — it is calculator-logic correctness (Bee D) and authority-ping diff sensitivity (Bee H). Those are where build attention concentrates.

**Production Queen is a FULL GOAT builder, not a light proposer.** This supersedes any earlier "proposer / monitor existing pages" framing. A thin product cannot validate the thesis (a non-converting thin product tells you nothing about whether the gap was real). She builds at the same standard as the 47 manually-built products. **Critical repo note: Production Queen writes to `cluster-worldwide/taxchecknow/cole/`, NOT soverella.** That is where the live product configs and calculators are.

---

## §2 — Prerequisites (operator-side, before Step A)

| # | Prerequisite | Action |
|---|---|---|
| P1 | OpenAI API key (LLM synthesis + any embeddings) | Confirm existing |
| P2 | Anthropic API key (Sonnet for bee reasoning) | Confirm existing |
| P3 | Truth-consensus engine access (GPT / Claude / Grok / Perplexity) | Confirm keys for all four — needed for the truth-consensus gate |
| P4 | The `taxchecknow-product-builder` skill + the 46 product configs as reference | Confirm location: `cluster-worldwide/taxchecknow/cole/config/` |
| P5 | The GOAT 12-block standard (Bee F reads it) | Confirm location: `cole/types/README.md` per migration map |
| P6 | Persona library for Tax Hive | Confirm personas (gary, priya, etc.) exist in hive config |
| P7 | Approved Strategic Queen handoffs exist | At least 1 APPROVED handoff in `strategic_queen_handoffs` to build from (the 52 PENDING handoffs → approve one for the first real build) |
| P8 | Stripe integration for the price gate | Confirm existing (the 46 live products already use it) |

**If any of P1-P8 is unresolved when you start Step A, stop and resolve first.**

---

## §3 — The plan A through Z

Each step: **Who** · **Entry** · **Work** · **Done** · **Uncertainty**.

---

### Step A — Probe current state (cross-repo)

**Who:** Session A
**Entry:** Prerequisites confirmed.
**Work:** Read-only probe. Report:
1. Does `products` table exist in the storefront repo? Full column list vs the design's §2 spec (the design expects ~40 fields across lifecycle/lineage/identity/content/authority/voice/competitor/deprecation sections)
2. Does `transactional_email_templates` exist? Schema if yes
3. What does ONE complete existing product config look like (pick the largest AU config as GOAT reference)? Full content
4. The matching calculator file for that config — full content
5. Does the GOAT 12-block standard doc exist at `cole/types/README.md`? Confirm contents
6. Confirm the repo path Production Queen writes to (`cluster-worldwide/taxchecknow/cole/` expected)
7. Does a Production Queen monitor page exist in the dashboard, or only the V1 tactical-queen one?

**Done:** Single chat report. No file, no commit. Build chat reviews before Step B.
**Uncertainty:** Medium. Cross-repo — confirm Production Queen's write target is genuinely the storefront repo, not soverella. This is the #1 thing to get right; building against the wrong repo wastes the whole effort.

---

### Step B — Schema reconciliation design

**Who:** Build chat (Strategy-level)
**Entry:** Step A probe results in hand.
**Work:** Reconcile the design's `products` spec against what exists. The 46 live products already have configs — determine: does the new `products` table extend the existing config shape, or is it a parallel table? Decide additively (do NOT break the 46 live products). Cover:
- `products` table (or extension) — full DDL delta
- `transactional_email_templates` (net-new if absent)
- Any draft-state columns needed for the lifecycle (DRAFT / IN_REVIEW / LIVE / DEPRECATED / ARCHIVED)
- The `fan_out_queries` / `canonical_question` / `authority_grounding` columns Bee 3 of Strategic Queen depends on for its deferred `fan_out_drift` trigger (this is where that dependency gets closed)
- Schema-verify-first protocol explicit for Session A

**Done:** Migration SQL ready. Operator reviews before apply.
**Uncertainty:** Medium-high. The existing 46 products' config shape determines whether this is an extension or a new table. The probe resolves it.

---

### Step C — Apply schema migration

**Who:** Session A
**Entry:** Migration SQL reviewed.
**Work:** Apply. Verify each table/column. Verify the 46 live products are untouched and still render. Commit.
**Done:** Schema exists. 46 live products unaffected. Commit hash reported.
**Uncertainty:** Low. Additive migration.
**Rollback:** Reverse migration (drop new columns/tables). 46 products were never modified, so they're safe regardless.

---

### Step D — Production Queen lifecycle orchestrator skeleton

**Who:** Session A (under spec from build chat)
**Entry:** Step C complete.
**Work:** Build the orchestrator shell that runs the 6-phase lifecycle (per design §12):
- Phase 1 Pickup: poll `strategic_queen_handoffs` for APPROVED + unpicked, mark `production_pickup_at`, create DRAFT product row
- Phase 2-6 are stubs for now (no bees wired yet)
- Bee interface contract (every bee implements `run(draftProductId, handoff) → writes its owned fields`)
- Error isolation + per-bee timeout + stalled-draft detection
- Cost-attribution wrapper (reuse the shared module from Strategic Queen if it exists; else build per that pattern)
- Writes to `cluster-worldwide/taxchecknow/cole/` — confirm path

**Done:** Orchestrator boots, picks up one APPROVED handoff, creates a DRAFT product row, fires zero bees (all stubbed), exits cleanly. Smoke test passes. Commit hash reported.
**Uncertainty:** Medium. The cross-repo write + the handoff-read-from-soverella-tables-but-write-to-storefront-repo boundary needs care.

---

### Step E — Bee A: Authority Verifier (the truth foundation, build first)

**Who:** Build chat (spec) + Session A (build)
**Entry:** Step D complete.
**Work:** Build Bee A per design §4:
- Identify authority registry for jurisdiction (ATO/HMRC/IRS)
- Find canonical page, snapshot + hash, extract law-section refs, confidence-score
- Writes authority grounding + trust ledger + law refs to draft product
**Done:** Bee A fires on a real handoff's topic, produces verified authority grounding with a real ATO/HMRC URL + hash + confidence. Commit hash reported.
**Uncertainty:** Medium. Authority-registry identification per jurisdiction needs the registry map in config.
**Why first:** everything downstream rests on verified truth. Build the foundation before the bees that build on it.

---

### Step F — Bee B: Customer Voice Capturer

**Who:** Build chat (spec) + Session A (build)
**Entry:** Step E complete.
**Work:** Build Bee B per design §5: pull YouTube comments + StackExchange + (conditional) Quora for the topic; extract pain language; classify emotional frame; extract FAQ question candidates. Writes the customer language pack + emotional frame + FAQ seeds.
- **Reuse the handoff's `evidence.grounding_queries`** as the starting point — these are the real questions Strategic Queen already harvested. Bee B enriches, doesn't start from scratch.
**Done:** Bee B fires, produces a language pack with real verbatim quotes + classified emotional frame. Commit hash reported.
**Uncertainty:** Medium. LLM phrase-extraction can produce generic language (design critique #4) — verbatim-quote mitigation helps. Calibration check after first 5 products.

---

### Step G — Bee C: Competitor Auditor

**Who:** Session A (under spec)
**Entry:** Step F complete.
**Work:** Build Bee C per design §6: collect top competitor URLs (from handoff's `evidence.cited_competitor_urls` as starting point), fetch + summarize each, identify what all cover and what none fill, produce the differentiation hook + gap signal for the calculator.
**Done:** Bee C fires, produces competitor audit + differentiation hook + "what none of them cover" gap. Commit hash reported.
**Uncertainty:** Low-medium. Pattern similar to Strategic Queen's SERP work.

**→ Steps E, F, G are the parallel research bees. After G, all three research streams exist and can fire in parallel for one assignment.**

---

### Step H — Bee D: Calculator Architect (HIGHEST RISK — lock the gate)

**Who:** Build chat (spec, with intent-lock) + Session A (build)
**Entry:** Steps E, F complete (Bee D needs A + B).
**Work:** Build Bee D per design §7: determine product type, design inputs, design logic/formula, design outputs + recommended actions, compose `topic_summary` (the AI-citation-ready answer paragraph).
- **NON-NEGOTIABLE GATE: no calculator's scoring/formula logic ships without explicit operator approval.** Bee D produces a calculator spec that goes to the operator for logic review BEFORE it's ever used. This is the single most important correctness gate in the queen.
**Done:** Bee D fires, produces a calculator spec (inputs/logic/outputs). The logic is surfaced to the operator for explicit approval. Commit hash reported.
**Uncertainty:** HIGH. This is the highest-risk bee — a wrong formula gives wrong tax numbers to people making real-money decisions. Treat the operator-logic-approval as a hard gate, not a soft suggestion. Lock the intent (like Bee 3's thresholds) before building.

---

### Step I — Bee E: Page Assembler

**Who:** Build chat (spec) + Session A (build)
**Entry:** Steps E, F, G, H complete (Bee E needs all of A, B, C, D).
**Work:** Build Bee E per design §8: select persona, determine price tier, write hero copy, write FAQ answers (using B's FAQ seeds + the handoff's real questions), write success-page copy, build related-product map, write transactional emails — all in persona voice.
- **Real questions on the page:** the handoff's `evidence.grounding_queries` (the actual questions people asked AI engines) become the FAQ items. This is the GOAT-GEO real-questions-on-page mechanism.
- **Passage-level citability:** structure FAQ answers as self-contained, quotable paragraphs (from the market recon — AI engines lift single paragraphs).
**Done:** Bee E fires, produces a complete page (hero + FAQ + success page + emails) in persona voice with real harvested questions as FAQ items. Commit hash reported.
**Uncertainty:** Medium. Persona-voice quality + ensuring real questions land verbatim.

**→ Steps H, I are synthesis. After I, a complete draft product exists (research + calculator + page).**

---

### Step J — Bee F: Quality Gate

**Who:** Session A (under spec)
**Entry:** Step I complete.
**Work:** Build Bee F per design §10: pass/fail against the GOAT 12-block standard (from `cole/types/README.md`), with detailed feedback on fail. Failures route back to the relevant synthesis bee.
**Done:** Bee F fires on the assembled draft, produces pass/fail + GOAT score + feedback. Commit hash reported.
**Uncertainty:** Low-medium. Re-validate the 12 blocks make sense under the new architecture (design critique #9).

---

### Step K — Bee G: Legal Gate + Truth-Consensus

**Who:** Build chat (spec) + Session A (build)
**Entry:** Step J complete.
**Work:** Build Bee G per design §10: citation validity check, compliance checklist per jurisdiction, disclaimer presence. PLUS the truth-consensus layer (GPT / Claude / Grok / Perplexity all confirm the facts are correct). Pass/fail with failure routing.
- **Legal-fail is a different severity than quality-fail.** A legal fail means "this could give wrong tax advice — stop," never soft-passed. Keep distinct from Bee F's quality score.
**Done:** Bee G fires, runs the four-engine truth consensus + compliance + citation check, produces pass/fail. A legal fail blocks publication absolutely. Commit hash reported.
**Uncertainty:** Medium. Truth-consensus across four engines needs all four API keys (P3) and a consensus rule (unanimous? majority? — lock this in the spec).

**→ Steps J, K are the gates. After K, a draft product has passed quality + legal + truth-consensus.**

---

### Step L — Operator review + publication (the gate)

**Who:** Build chat (dashboard spec) + Session A (build) + Operator
**Entry:** Step K complete.
**Work:** Build the Production Queen review surface (extend the dashboard, mirror Strategic Queen's approval pattern):
- Draft products in IN_REVIEW state, shown to operator with: the page preview, the calculator spec (with logic surfaced for approval), the authority grounding, the quality + legal gate results
- Operator actions: Approve (→ LIVE, set `first_published_at`) / Reject / Defer / Edit
- On approve: state → LIVE, mark handoff `production_completed_at` + `production_product_id`
**Done:** Operator opens dashboard, sees the IN_REVIEW draft built end-to-end, reviews calculator logic, approves → product goes LIVE. Handoff marked complete. Commit hash reported.
**Uncertainty:** Medium. UI work + ensuring the calculator-logic-approval (Step H gate) surfaces clearly here.

---

### Step M — First real end-to-end build (the true test — garden to table)

**Who:** Operator + Session A
**Entry:** Steps A-L complete.
**Work:** Take ONE approved Strategic Queen handoff. Run the full lifecycle:
- Orchestrator picks it up → DRAFT created
- Bees A, B, C fire in parallel → research lands
- Bee D fires → calculator spec (operator approves logic)
- Bee E fires → page assembled
- Bee F → quality gate
- Bee G → legal + truth-consensus gate
- Operator reviews IN_REVIEW draft → approves → LIVE
- Verify the live product is GOAT-grade, correct, in persona voice, with real questions on the page
**Done:** ONE complete, correct, GOAT-grade product is LIVE, built entirely by the machine from a detected gap. **This is the loop closing — the most dangerous unknown in COLE retired.** Commit hash reported.
**Uncertainty:** HIGH. First real end-to-end build of an 8-bee chain. Plan a full day debugging window. This is the moment that validates (or invalidates) the whole thesis.

---

### Step N — Bee H: Source-URL Pinger (continuous, post-build)

**Who:** Build chat (spec — incl. the diff-normalizer) + Session A (build)
**Entry:** Step M complete (at least one LIVE product to ping).
**Work:** Build Bee H per design §11: ping each LIVE product's authority URLs on cadence, diff against the stored snapshot hash, update trust ledger, emit "authority changed" events for material changes.
- **The diff-normalizer is the real engineering.** Government sites change navigation/timestamps without changing the law. Without normalization, H throws false positives and trains the operator to ignore it. Build the normalizer to ignore non-material changes (nav, timestamps, boilerplate) and catch genuine law-text changes.
**Done:** Bee H pings the LIVE product's authority URL, correctly ignores a cosmetic change, would correctly flag a material one. Commit hash reported.
**Uncertainty:** Medium-high. The diff-normalizer sensitivity is the hard part (design critique #7).
**Open question to confirm:** Bee H is the one bee that runs forever, not once-per-build. Confirm it lives with Production Queen (the "whoever built it owns watching it" principle) vs moving to Governance/monitoring. Lean: keep with Production Queen. Confirm deliberately.

---

### Step O — PANELBEAT path (revise existing, don't rebuild)

**Who:** Build chat (spec) + Session A (build)
**Entry:** Step N complete. A handoff with `action=PANELBEAT` available.
**Work:** Build the PANELBEAT branch per design §13: when the handoff is a revision (not a new build), Production Queen reads the existing product + the panelbeat reason, runs the scoped revision (only the affected sections — new authority page, or fan-out drift), produces a new version (old becomes archived, `parent_product_id` set).
**Done:** A PANELBEAT handoff revises an existing product correctly, versioned, old archived. Commit hash reported.
**Uncertainty:** Medium. The BUILD_NEW-vs-significant-PANELBEAT boundary (design critique #10) — when a panelbeat is so big it should be a fresh build. Lock the boundary in the spec.

---

### Step P — Deprecation / death certificate

**Who:** Build chat (spec) + Session A (build)
**Entry:** Step O complete.
**Work:** Build the deprecation workflow per design §14: triggers (legal-gate permanent fail / Adaptive Queen recommendation / Strategic Queen demand collapse), the deprecation workflow (state → DEPRECATED, redirect strategy, successor pointer).
**Done:** A product can be deprecated cleanly with a redirect strategy. Commit hash reported.
**Uncertainty:** Low. Lifecycle bookkeeping.

---

### Step Q — Shadow / observation period

**Who:** All lifecycle-driven. Operator monitors.
**Entry:** Step M passed (loop closed at least once).
**Work:** Let Production Queen build the next several approved handoffs. Operator watches:
- Are the products GOAT-grade?
- Is Bee D's calculator logic correct every time (the highest-risk check)?
- Is Bee B's customer voice genuine or generic (calibration check after 5)?
- Is Bee H's pinging signal or noise?
- **Do the built products convert?** — the real validation
**Done:** Several products built, operator confident in quality, and crucially — early conversion signal on whether machine-detected gaps become real revenue.
**Uncertainty:** This is the real test of the thesis, not just the build.

---

### Step R — Close-out + the vanilla decision

**Who:** Operator + Strategy Chat
**Entry:** Step Q complete with conversion signal.
**Work:**
- Document findings
- Confirm whether the loop converts (detected gap → built product → revenue)
- **THEN make the vanilla-vs-next-queen decision** — now with the loop validated and knowing whether the thing is worth cloning
- Mark Production Queen Phase complete; define entry to whatever's next (Distribution Queen, or vanilla template cut)
**Done:** Production Queen is the authoritative builder for the hive. The loop has closed and been observed. The decision about cloning is now made on validated data, not hope.

---

## §4 — Operator decisions you make during the build

| Decision | When | Default |
|---|---|---|
| `products` table: extend existing config shape vs new table | Step B | Additive — don't break the 46 live products |
| Calculator logic approval (per build, hard gate) | Step H + every build | ALWAYS operator-approves logic before ship — non-negotiable |
| Truth-consensus rule (unanimous vs majority across 4 engines) | Step K | Lean unanimous for tax correctness; tune if too strict |
| Bee H's home (Production Queen vs Governance) | Step N | Keep with Production Queen; confirm deliberately |
| PANELBEAT-vs-fresh-build boundary | Step O | Significant restructure → fail legal gate → deprecate → fresh BUILD_NEW |
| Persona for first builds | Step I | Use existing Tax Hive personas (gary/priya) |

---

## §5 — Honest critique points (least-confident areas)

1. **Bee D calculator correctness (Step H) is the highest risk in the entire queen.** A wrong formula misleads people with real money. The operator-logic-approval gate is the mitigation and it is non-negotiable.
2. **Step M (first end-to-end) is the risk concentration.** 8-bee chain, first real run. Full-day debug window.
3. **Bee B customer voice may be generic** (design critique #4). Calibration check after first 5 products.
4. **Bee H diff sensitivity** (design critique #7). The normalizer is real engineering, not a stub.
5. **Truth-consensus across 4 engines** needs all 4 keys and a clear consensus rule. Could be slow/costly per build — budget-check.
6. **Cross-repo boundary** — Production Queen reads handoffs from soverella's tables but writes products to the storefront repo. Get this boundary explicit in Step A or the whole build targets the wrong place.
7. **The 46 live products must not break.** Every schema step is additive. Verify the live products render after each migration.

---

## §6 — Rollback at key checkpoints

| Step | Rollback | Preserved |
|---|---|---|
| C (schema) | Reverse migration | 46 live products (never modified) |
| D (orchestrator) | Disable; delete/dormant the orchestrator | Strategic Queen + 46 products |
| E-K (bees) | Disable per bee; orchestrator runs with stubs | All upstream + live products |
| L (dashboard) | Revert page commit | Bees continue; operator approves via DB |
| M (first build) | The product stays DRAFT, never goes LIVE without approval | Nothing live is affected by a failed draft |
| N (Bee H) | Disable pinger cron | Built products stay LIVE, just unmonitored |

**Principle:** every step reversible. The 46 live products and Strategic Queen are the safety net throughout. A failed draft never pollutes LIVE.

---

## §7 — End state — what working looks like

After Step R:
1. **Approved handoff → complete product, automatically.** The machine builds the 47th product, then the 48th, at the same GOAT standard as the manual 46.
2. **8 bees coordinate per the lifecycle:** A/B/C parallel research → D/E synthesis → F/G gates → operator approval → H continuous monitoring.
3. **No calculator ships without operator logic approval.** The correctness promise is real.
4. **Every product passes 5 gates:** schema, GOAT-quality, legal, truth-consensus, operator.
5. **Real questions on every page** (from the handoff's harvested grounding queries) — GOAT-GEO citability.
6. **Bee H watches authority sources forever** — catches law changes faster than the broad scan.
7. **The loop has closed and converted** — a machine-detected gap became a live product that makes money. The core thesis is validated.
8. **Production Queen built with marked hive-specific seams** — so the eventual vanilla cut is "lift the generic layer, leave config behind," not archaeology.

---

## §8 — Estimated effort

- Steps A-D (probe, schema, orchestrator): 2-3 days
- Steps E-G (3 research bees): 3-5 days
- Steps H-I (calculator + page synthesis): 3-4 days (Bee D needs careful logic-gate work)
- Steps J-K (quality + legal/truth gates): 2-3 days
- Step L (dashboard): 1-2 days
- Step M (first end-to-end + debug): 1 day (full debug window)
- Steps N-P (pinger, panelbeat, deprecation): 3-4 days
- Step Q (shadow/observation): days-to-weeks elapsed, light active work
- Step R (close-out + vanilla decision): 0.5 day

**Total active work: ~16-24 days.** Bigger than Strategic Queen — Production Queen is genuinely the larger queen, and it carries correctness/legal risk Strategic Queen never did.

---

## §9 — Closing note

This plan is paint-by-numbers, garden to table, for the larger and higher-risk of the two queens built so far. The design is locked (PRODUCTION-QUEEN-DESIGN-DAY13.md); the KISS pass confirmed 8 bees; this plan is pure execution sequence.

Build order rationale: Authority Verifier first (truth foundation), then the parallel research bees, then synthesis (calculator before page — page needs the calculator), then gates (quality before legal), then the operator gate, then the true end-to-end test (the loop closing), then the continuous + lifecycle bees (pinger, panelbeat, deprecation).

The two things to protect above all: **Bee D's calculator-logic operator approval** (the correctness promise) and **the 46 live products staying untouched** (additive everything). The one thing to consciously confirm: **Bee H's home.**

When the build chat executes this, they read this plan + PRODUCTION-QUEEN-DESIGN-DAY13.md, start at Step A, move sequentially, and only escalate to the operator where a step says so. No re-debating the bee count — it's locked at 8. No process theater. The plan is the plan.

**End of A-Z plan. Build the builder.**
