# COLE Stepping Stones — Final Locked Map (Day 14)

**Purpose:** The single, locked, current-state map of the COLE pipeline. Reconciles three sources: Design chat's stage breakdown + four-question discipline (the spine), our Day-14 banked work (the verified ground truth), and the three nuggets we filtered from ChatGPT (failure-state surfacing, runtime product health, delivery-adapter confirmation). Stone 0 (the foundational architecture fork) is the operator's contribution.

**Discipline per step (from Design):** every step names *(a) what triggers it · (b) what executes it · (c) what state it produces · (d) what the next step reads from that state.* If any of those four is missing or hand-waved, the step is a leak and is marked as one.

**Status legend:**
- ✅ **BUILT + PROVEN + BANKED** — code exists, verified, durable on origin (commit named).
- ✓ **BUILT, LIVE-UNTESTED** — code exists, dry-run-proven, hasn't fired live yet.
- ⚙️ **BUILT, BUT GAPPED** — works partially / for taxchecknow only / missing a sub-piece.
- ⚠️ **UNVERIFIED** — we assume something; haven't read real code to confirm. Needs a probe.
- 🔲 **GAP** — doesn't exist; needs to be built.
- 🤔 **FOUNDATIONAL** — bigger than a step; Design ruling needed before steps under it make sense.

**Two ⚠️s that should be resolved before commit (cheap probes — listed at the end):**
- Step 7c (Monitor renders for any `?site=`?) — *60-second operator click on `theviabilityindex` in the dropdown.*
- Step 16 (Bee E built?) — *one Session-A read for the SHA.*

---

## STEP 0 — The architecture fork

🤔 **FOUNDATIONAL. Sits UNDER everything below. Operator surfaced Day 14.**

**The question:** which architecture is COLE actually built as?

**The three options — given equal treatment because the answer is genuinely open:**

- **(a) Shared architecture** — one Supabase brain, one factory (soverella), hives differ only by `site` column + per-hive overlay. *What's mostly built today.* Cheap, simple, one place to update everything. **Risks:** hives are entangled (hard to detach and sell a single hive), single point of failure (one DB outage = all 50 down), footprint exposure (50 sites visibly on shared infra).

- **(b) Isolated architecture** — per-hive folder + per-hive DB + per-hive everything; each hive is a detachable sellable unit. *Resolves all three risks at once* (sale-ability, failure-isolation, distinct footprints) **but** loses cross-hive learning (50 islands, no shared brain), multiplies infra cost (50× of everything), and **almost certainly requires re-architecting the data layer** (every query today assumes one shared DB filtered by `site`).

- **(c) Hybrid architecture** *(probably the right answer — given proper treatment, not a footnote)* — shared **factory + learning layer** (soverella's queens + cross-hive analytics + shared Supabase for the *building process*) **plus** per-hive **sellable assets** (the delivery repo, the live products, the customer data, the revenue — in per-hive structure that can be cleanly handed over). This threads the three risks: sale-ability via per-hive sellable assets; single-point-of-failure mitigation by keeping critical customer/revenue data per-hive; footprint risk partially mitigated by distinct delivery infrastructure (each hive's customer-facing site is its own thing). **The cost:** designing the seam between "shared building" and "isolated selling" — what data lives where, what migrates on sale.

**The three risks all point at the same fork:**
1. **Sale-ability** — can a hive be cleanly detached and sold?
2. **Single point of failure** — one shared Supabase = all hives go down together.
3. **Footprint / penalty risk** — do AI engines and Google detect 50 similar sites on shared infra as a farm? *(Time-sensitive question — needs current 2026 information, not memory.)*

**Two prerequisites before this is ruled (gather inputs, decide fresh):**
- **Feasibility probe (read-only, Session A):** how does the code connect to Supabase today, how woven-in is `site`-column-scoping, what would per-hive DBs mechanically require — a script or a re-architecture? *This tells us whether option (b) is days or months of work.*
- **Footprint search:** current 2026 reality on how Google + AI engines treat networks of similar sites / shared-infra portfolios.

**Then Design rules the architecture.** Until ruled: every step below assumes the current shared model in practice (because that's what's built) but flags where the architecture decision would reshape it.

### ⚠️ STEP 0 → STEP 4 HARD GUARD

**DO NOT register a new domain, create a new Vercel project, or stand up new hive infrastructure (Step 4) before Step 0 is ruled.** The shared-vs-isolated-vs-hybrid decision changes *how Step 4 even works* (one Vercel project per hive vs. monorepo; per-hive Supabase vs. shared; per-hive Stripe account vs. shared). Doing Step 4 early on the wrong architecture costs real money (domain registration, Vercel paid project) and real rework. **Step 0 first.**

---

## STAGE 0 — NICHE DISCOVERY

*"How does the system know it wants a hive?"*

### STEP 1 — Niche guardrail: the allowed-niche list

🔲 **GAP.** Doesn't exist anywhere.

- **Trigger:** before any niche enters the funnel.
- **Executes:** a check against an operator-curated list of allowed niches (the "force 20 niches; we don't search certain topics" safety rail).
- **Produces:** an `allowed: true/false` gate on any candidate niche.
- **Next step reads:** Steps 2.1–2.5 (Apiary) can only consider allowed niches.

*Small build. Sits at the very front. Stops the machine wandering into topics you don't want.*

### STEPS 2.1–2.5 — Apiary Strategic Queen finds + proposes a niche

🔲 **GAP (deferred by design).** Apiary Queen is fully designed (`APIARY-STRATEGIC-QUEEN-DESIGN-DAY13.md` + §17 persona extraction banked Day 14), not built. Operator is the Apiary Queen for now — picks niches by hand.

Design summary (the four-question discipline, from the doc):
- **2.1 — Bee 1 (Niche Hunter)** scans broadly → writes `niche_candidates` rows with raw evidence.
- **2.2 — Bee 2 (Niche Scorer)** scores 7 dimensions → updates rows with `overall_score` + `score_components`.
- **2.3 — Bee 3 (Niche Router)** threshold-gates + fit-check → decides `CLONE_NEW_HIVE` / `EXPAND_EXISTING_HIVE` / `IGNORE`.
- **2.4 — Bee 4 (Clone Proposal Composer)** assembles the full `CloneProposal` → writes to `apiary_strategic_handoffs` with `PENDING`.
- **2.5 — Operator approves** in the apiary approval dashboard → `decideApiaryHandoff` action sets `APPROVED`.

Tables `niche_candidates` + `apiary_strategic_handoffs` don't exist yet. Phase-2 work.

### STEP 3 — The pick becomes a `CloneProposal`

✅ **BUILT + PROVEN + BANKED.** Part 1, `lib/clone/clone-types.ts` (`c72e083`).

- **Trigger:** operator picks a niche (today) / Apiary Bee 4 produces it (future).
- **Executes:** hand-fill (today) or composer bee (future) — the typed `CloneProposal` schema (the §2 socket).
- **Produces:** a `CloneProposal` object — domain, jurisdictions, authority URLs, keywords, first-products, evidence.
- **Next step reads:** the mint trigger (Step 5).

*Note: the dashboard's `/dashboard/mint-hive` paste-JSON form is the operator-trigger UI for this.*

---

## STAGE 1 — MINTING THE HIVE

*What "the clone takes over" actually means, end-to-end.*

### STEP 4 — Stand up the physical site (domain → repo → Vercel → DNS → deploy)

⚙️ **BUILT, BUT GAPPED — half-documented.** The runbook for the *first* half (repo→Vercel→web-DNS) doesn't exist; the *second* half (email setup) does.

**⚠️ GATED BY STEP 0** (see hard guard above — don't execute for a new hive before Step 0 is ruled).

- **Trigger:** operator action, after a `CloneProposal` exists AND Step 0 is ruled.
- **Executes (today, manual):** register domain at Namecheap → create new delivery repo (mirroring `cluster-worldwide/taxchecknow` shape: Next.js app + `cole/` generator + Stripe/email/cron routes + `sync-cole-lib.mjs` + 2-cron `vercel.json`) → create Vercel project + import repo → set env vars (`NEXT_PUBLIC_SITE_URL`, shared Supabase pair, `RESEND_API_KEY`, per-product `STRIPE_*`) → add web DNS at Namecheap → run the 15-step email-setup runbook → deploy.
- **Produces:** a live, deployed `https://<newdomain>` ready for products.
- **Next step reads:** when machine-built products land (Step 20), the delivery repo renders them; when the site shell is built (Step 20.5), the homepage renders.

**Sub-gaps:**
- 🔲 The repo→Vercel→web-DNS half of the runbook is undocumented. Email half is documented (`email-setup-new-site-manual.md`).
- ⚠️ The delivery repo has hardcoded `TaxCheckNow` / `taxchecknow.com` across ~20+ files. Two options: per-hive find-replace (works today, manual, fragile) OR vanilla-ize the delivery repo to route through env vars (the proper fix; carefully, because it touches the live revenue site).

### STEP 5 — Mint the overlay (the two JSON files)

✅ **BUILT + PROVEN + BANKED.** Parts 2–4 (`e2e7a6b`, `d4e1f00`, `e6d622a` + fixes `501ddfa`, `91ab765`). Round-trip proven: bucket 3 empty.

- **Trigger:** operator clicks "Preview mint" in `/dashboard/mint-hive` (today, dry-run) / a live-fire trigger (live, deferred).
- **Executes:** `mintHive` server action → `mapProposalToSlots` → `mintOverlays` (writes the two files; refuses to clobber existing) → `seedRegistry` (Step 6).
- **Produces:** `overlays/<site>/strategic.json` + `strategic-v2.json` — schema-valid, taxchecknow-shaped bones.
- **Next step reads:** Strategic Queen Bee-1 reads `strategic-v2.json` (Step 9); all Production bees read `strategic.json` via `getHiveConfig`.

**Live-fire status:** the dashboard previews to a temp dir. **Pipe A** in the handover (`VANILLA-CLONE-BUILD-HANDOVER-DAY14.md`) = writing the *real* `overlays/<site>/` files. Predicted: no structural risk (the round-trip proved the files are valid).

### STEP 6 — Seed the registry + first handoffs **(Tier 1.5 — see priorities)**

✓ **BUILT, LIVE-UNTESTED.** `lib/clone/clone-hive.ts::seedRegistry` (`d4e1f00`). Dry-run by default; `confirmLiveWrites:true` required to fire.

- **Trigger:** invoked by `cloneHive` after `mintOverlays` succeeds (currently always dry-run from the dashboard).
- **Executes:** three writes — (a) placeholder `platform_accounts` row (so dropdown resolves the new site) · (b) seed `strategic_queen_handoffs` rows from `estimated_first_products` (so Production has day-one work to claim) · (c) `demand_candidates` row per seed with real jurisdiction + linked `candidate_id` (so `jurisdictionToCountry` doesn't default to "au" — the wiring fix).
- **Produces:** the new hive is *registered* (appears in dropdown) and *seeded* (Production has approved handoffs to claim).
- **Next step reads:** Step 7 (does the colony actually start running?) + Step 12 (Production claims a handoff).

**⚠️ Pipe B (the documented test step):** `platform_accounts` and `strategic_queen_handoffs` have **no in-repo CREATE migration** — their NOT-NULL constraint set is unverified. Live insert is the first real validation. Predicted fix-shape if it fails: a bounded column-add in `seedRegistry`. Operator-only (only operator runs live-DB writes).

**Why elevated to Tier 1.5:** Step 7's probes (does the colony come alive?) *assume* Step 6 actually wrote correctly. If a NOT-NULL column is missing from the seed, Step 7 is investigating a foundation that didn't pour. Live-firing Step 6 on `theviabilityindex` (the already-registered second site) is one operator-action and validates the foundation everything above depends on.

### STEP 7 — The colony comes alive (does the new hive actually start running?)

⚠️ **UNVERIFIED. Three sub-questions, none answered from real code.**

- **7a — Does the new hive's Strategic Queen actually FIRE?** ⚠️ Pre-flight probe showed the Production orchestrator cron is **not scheduled in vercel.json** (manual curls). Same question unanswered for Strategic Queen Bee-1: is her cron per-site-registered or shared-loops-all-sites? If she's per-site-and-unscheduled, the hive sits dead with a valid overlay nobody reads.
- **7b — Do the routines CONSTRAIN her to the niche, or just seed her?** ⚠️ The minted `strategic-v2.json` carries tax routines. Does Bee-1 hunt *only* those, or can she wander? The "stays in tax" guardrail is unverified.
- **7c — Do the Monitor panels render for *any* `?site=`, or assume `taxchecknow`?** ⚠️ Cheap to verify before commit — click `theviabilityindex` in the existing dropdown and see what renders.

*Probe needed. This step is the seam between "minted" and "alive."*

---

## STAGE 2 — STRATEGIC QUEEN PRODUCES HANDOFFS

*Once the new hive is alive, its Strategic Queen finds work for Production.*

### STEPS 8–11 — Strategic bees run; operator approves a handoff

⚙️ **BUILT (for taxchecknow); UNVERIFIED for a new hive.** Per Step 7, depends on whether her crons fire for the new site.

- **8 — Bee-1 (Demand Hunter)** reads `strategic-v2.json` → runs routines → writes `demand_candidates`.
- **9 — Bee-2 (Scorer)** scores candidates.
- **10 — Bees 3 + 4 (Site Auditor + Handoff Composer)** assemble handoffs into `strategic_queen_handoffs` with `PENDING`.
- **11 — Operator approves a handoff** in `/dashboard/approvals` (the V2 handoff card). **Built and live for taxchecknow ✓** (verified by pre-flight probe: `decideHandoff` action exists, the card renders).

---

## STAGE 3 — PRODUCTION QUEEN BUILDS THE PRODUCT

*The state-machine walk: research → calculator → assembly → gates.*

### STEP 12 — Orchestrator claims the approved handoff

⚙️ **BUILT (`claimNextHandoff` verified from real code in pre-flight probe), NOT SCHEDULED.**

- **Trigger:** the orchestrator cron route `app/api/cron/production-queen-orchestrator/route.ts` — fires manually via curl with `Bearer $CRON_SECRET` (cron is NOT in `vercel.json`).
- **Executes:** filter `site=<site> AND approval_status='APPROVED' AND production_pickup_at IS NULL` → claim one → create `build_jobs` row with `build_state='PICKED_UP'` → start advancing in-flight jobs by one phase per tick.
- **Produces:** a `build_jobs` row entering the state machine.
- **Next step reads:** Step 13 (RESEARCH phase reads the claimed job).

🔲 **Sub-gap: the orchestrator cron should be scheduled for autonomy.** Today: manual curls, one phase per tick.

### STEP 13 — RESEARCH phase: Bees A‖B‖C run in parallel

✅ **BUILT + typechecks** (commits `39f32a8`, `8b9aec0`, `19661d8`). **Not yet run end-to-end** (P7=0 — nothing has actually walked the pipeline).

- **Trigger:** orchestrator advances `PICKED_UP` → `RESEARCHING`.
- **Executes:** Bee A (Authority Verifier — `BRAVE_SEARCH_API_KEY` + Anthropic) · Bee B (Customer Voice Capturer) · Bee C (Competitor Auditor). All three run; each writes its slice to `research_output`.
- **Produces:** `research_output.{authority, voice, competitor}`. State → `RESEARCH_COMPLETE` when all three complete.
- **Next step reads:** Step 14 (CALCULATOR) reads A/B/C output.

⚠️ **Sub-stop: Bee A can park at `NEEDS_AUTHORITY_URL`** if it can't auto-discover the authority page (weak `BRAVE_SEARCH_API_KEY`, or obscure topic). 🔲 **Resume path is a TODO — no built action to paste a URL and continue.** Mitigation for maiden run: pick a stable-law topic with an obvious official source.

### STEP 14 — CALCULATOR phase: Bee D + AI-review

✅ **Bee D BUILT + typechecks** (`d376a87`).

- **Trigger:** orchestrator advances `RESEARCH_COMPLETE` → calculator phase.
- **Executes:** Bee D reads A/B/C output → builds engine + menu + routing logic. State → `NEEDS_AI_REVIEW`. Next orchestrator tick runs gpt-4o adversarial review (`OPENAI_API_KEY` — **verified set in Vercel May 10 ✓**, silent-jam risk closed). On pass: creates `pending_approvals` row + state → `NEEDS_CALCULATOR_APPROVAL`. On fail: state → `CALCULATOR_FAILED`.
- **Produces:** an engine artifact + a pending-approval row for the operator.
- **Next step reads:** Step 15 (the operator approves the engine).

### STEP 15 — Operator approves the calculator engine 🚨 PREDICTED MAIDEN-RUN STOP

🔲 **GAP — the approval UI does not exist.** Pre-flight probe confirmed: `/dashboard/approvals` renders only `promote_gap_to_active` + `flag_competitor_threat` — **it does NOT render `approve_calculator_engine`**. The backend (the action) exists; the surface to use it doesn't (Step L, deliberately deferred).

- **Trigger:** state = `NEEDS_CALCULATOR_APPROVAL`.
- **Executes (today, manual SQL workaround):** operator updates `build_jobs.build_state='CALCULATOR_DONE'` + updates the `pending_approvals` row to `approved`.
- **Produces:** state → `CALCULATOR_DONE`.
- **Next step reads:** Step 16 (ASSEMBLY).

**This is the predicted "where it stops" for the maiden run.** Building this UI is the highest-priority operator-blocking gap on the existing pipeline.

### STEP 16 — ASSEMBLY phase: Bee E

⚠️ **Build-state requires one-read confirmation** (the bee-E spec file in the upload set was a stub without a commit SHA, though Design lists Bee E as built and Day-12 walk had E among GOAT/CONFIRMED). Cheap to resolve before commit — Session A reads one file for the SHA.

- **Trigger:** orchestrator advances `CALCULATOR_DONE` → assembly.
- **Executes:** Bee E reads A/B/C/D output → assembles the 14-section page artifact (`research_output.page`).
- **Produces:** assembled page artifact. State → `ASSEMBLED`.
- **Next step reads:** Step 17 (QUALITY).

### STEP 17 — QUALITY gate: Bee F

✅ **BUILT + typechecks** (`6908c43`).

- **Trigger:** orchestrator advances `ASSEMBLED` → quality.
- **Executes:** Bee F grades the assembled page against the 12-block GOAT rubric (with engine cross-read for blocks 3/6); honest-thin discipline (no fabricated richness).
- **Produces:** pass/fail. On pass: state → `QUALITY_PASSED`. On fail: state → `QUALITY_FAILED`.
- **Next step reads:** Step 18 (LEGAL).

### STEP 18 — LEGAL gate: Bee G

✅ **BUILT + typechecks** (`0ad6996`). The "grounded half" per the latest G ruling.

- **Trigger:** orchestrator advances `QUALITY_PASSED` → legal.
- **Executes:** Bee G runs citation-validity, legal hard-rules, and 3-engine truth-consensus against the snapshot bedrock (verbatim figures + `source_content`); records engine-disagreements.
- **Produces:** pass/fail. On pass: state → `GATES_PASSED` (terminal-success). On fail: state → `GATES_FAILED`.
- **Next step reads:** Step 19 (operator ships) reads `GATES_PASSED` builds.

⚠️ Optional: `GOOGLE_GENERATIVE_AI_API_KEY` for G's 3rd consensus engine — non-blocking; G degrades silently if missing.

### STEP 19 — Operator ships the build

⚠️ **UNVERIFIED — the IN_REVIEW review surface may not render the assembled artifact.** Design flagged this as a probe question.

- **Trigger:** state = `GATES_PASSED`.
- **Executes:** operator reviews the assembled page + engine → ships → `products.lifecycle_state` flips `draft` → `live`.
- **Produces:** a live product (data side). State → `LIVE` (or equivalent terminal).
- **Next step reads:** Step 20 (the delivery adapter) reads ship signal.

---

## STAGE 4 — DELIVERY: PRODUCT BECOMES LIVE STOREFRONT PAGE 🚨 THE BIGGEST UNBUILT THING

*Design surfaced this; ChatGPT independently confirmed it. Strongest signal in the entire map.*

**Everything upstream produces `research_output`; the storefront renders from `cole/config/*.ts` files. Nothing today bridges them.**

### STEP 20 — The delivery adapter writes the product to the storefront repo

🔲 **GAP — the largest single unbuilt thing in the pipeline.** Named in rulings ("kitchen→cookie translation," "adapter writes the config"). No code that does this is known to exist.

- **Trigger:** operator ships at Step 19 (or auto-on-ship).
- **Executes:** the delivery adapter translates `research_output.page` + `research_output.calculator` (generic vanilla shape) → storefront-specific shape. Writes to the new hive's delivery repo: (a) `cole/config/<jurisdiction>-NN-<slug>.ts` (the product-of-record per locked architecture) · (b) the calculator code file · (c) the route at `/<jurisdiction>/check/<slug>` · (d) currency / deadline labels / disclaimer-set content from the disclaimer registry.
- **Produces:** real committed files in `cluster-worldwide/<newsite>/cole/` that render the live product.
- **Next step reads:** Vercel auto-deploys on push (Step 21).

**Without this step: machine-built products never become live storefront pages.**

### STEP 20.5 — The site shell: homepage, about, FAQ, navigation, legal pages 🆕

🔲 **GAP — a real layer I missed earlier.** A new hive at `https://<newdomain>` doesn't just need product pages at `/[country]/check/[slug]` — it needs a *front page* (`/`), about page, FAQ, navigation, footer, legal pages. taxchecknow's exist hand-built with taxchecknow-specific copy. A new hive has none of this.

- **Trigger:** part of standing up a new hive (Step 4) — before products go live, the *site shell* must exist; otherwise visitors hit `<newdomain>` and see a 404 / blank shell.
- **Executes:** *(unbuilt — needs design)* either (a) the delivery adapter extends to write the site shell from CloneProposal evidence, (b) a separate "site-shell generator" runs once per hive on standup, or (c) the new delivery repo is cloned from a *vanilla template repo* whose homepage/about/FAQ already have flavour slots fed by CloneProposal values.
- **Produces:** a working homepage + about page + FAQ + navigation that explains the niche to visitors and AI engines.
- **Next step reads:** customers and AI engines landing on `<newdomain>` see a real site (not a 404), and individual product pages (Step 20) have a parent site shell to live within.

**This is "adding flavour" applied to the site shell** — structure is vanilla (homepage component, FAQ component, navigation), content is per-hive flavour (the niche copy, the trust language, the FAQ questions). The CloneProposal carries some of the values needed (`proposed_domain`, `niche_summary`, the persona seeds for voice) — but homepage *copy* and FAQ *questions* are not currently in §2 of the Apiary contract. Either the contract extends, or the adapter generates copy from existing fields.

**Distinct from Step 20:** Step 20 writes per-product files; Step 20.5 writes the *site* that contains them. Both unbuilt; both block a new hive from being viable.

### STEP 21 — Storefront redeploys with the new product

⚠️ **Depends on whether Steps 20/20.5 commit to repo (auto-deploy) or just write files (separate deploy trigger).** Unaddressed.

- **Trigger:** new file landing in the delivery repo (auto) or explicit deploy.
- **Executes:** Vercel build + deploy.
- **Produces:** live pages — homepage at `https://<newdomain>/`, products at `https://<newdomain>/<jurisdiction>/check/<slug>`.

### STEP 22 — Stripe per-product wiring (the price↔product mapping)

🔲 **GAP (per-hive).** Part of the delivery adapter's responsibility.

- **Trigger:** Step 20 writes a new product config.
- **Executes:** maps the product's price tier ($67/$147/$297 — fixed-prices model) to existing reusable Stripe Price IDs; wires checkout to Stripe session for that price.
- **Produces:** a checkout flow that takes payment for the new product.
- **Next step reads:** Step 23 (the webhook that confirms payment).

### STEP 23 — Stripe webhook per new domain 🆕 PROMOTED TO ITS OWN STEP

🔲 **GAP — newly elevated.** Previously a sub-bullet; revenue-blocker on its own merits.

- **Trigger:** standing up a new hive on a new domain (Step 4).
- **Executes:** configure a Stripe webhook for the new domain pointing at `https://<newdomain>/api/stripe/webhook` (or share taxchecknow's webhook — architecture-dependent).
- **Produces:** Stripe purchase events reach the new hive's `stripe_purchase_success` flow.
- **Next step reads:** Step 24 (success page + emails fire on payment).

**Interaction with Step 0:** the shared-vs-isolated-vs-hybrid decision shapes this. *Shared Stripe* = one account, many webhooks (per-domain config, per-hive setup action). *Isolated Stripe* = per-hive Stripe account (cleaner for sale; more setup overhead). *Hybrid* = the likely answer (shared account, per-domain webhook — sellable hive transfers the products/customers/data but the operator keeps the Stripe account until sale). **This is its own per-hive Stripe-dashboard action no script can do — operator action, manual, real money flow.**

**Without this step: a new hive can't take money even if everything else works.** Same severity-tier as Step 20 (the delivery adapter) for a new hive's revenue.

### STEP 24 — Success page + transactional emails

⚠️ **PARTIAL.** Templates exist (Bee E writes `success_page_copy` + email templates); *sending* was Concierge Queen's job; Concierge is deferred. First-product fallback: the existing taxchecknow storefront webhook flow.

- **Trigger:** Stripe webhook fires on successful checkout (Step 23).
- **Executes:** success page renders (Bee E's content into storefront's success template) → transactional emails sent (receipt + delivery confirmation).
- **Produces:** customer sees success page + gets delivery email.

🔲 **Probe needed:** does the existing taxchecknow webhook flow auto-handle machine-built products, or require explicit wiring per product?

---

## STAGE 5 — PROOF: FIRST CUSTOMER + RUNTIME HEALTH

### STEP 25 — Customer arrives, runs calculator, pays

- **Trigger:** AI engine cites the page (the GEO play working) / direct or search traffic.
- **Executes:** customer journey → calculator routes → Stripe checkout → delivery.
- **Produces:** revenue.
- **No gap — this is the *act* the pipeline exists to enable.**

### STEP 26 — Runtime product health (the ChatGPT nugget worth keeping)

🔲 **GAP — newly named.** The 47 live products may already have invisible failure modes nobody sees.

- **What it tracks:** misroutes (calculator doesn't land users cleanly), escape states (user hits a branch with no answer), abandonment, unclear questions, low-confidence routes.
- **Distinct from "did the bees build it" (Stage 3) and "did it go live" (Stage 4).** This is *operational health of live products* — and it's currently invisible.
- **Probable home:** the Adaptive Queen layer (currently `LIVE` panel only). Worth a dedicated probe before any build: what's *already* recorded in the DB about runtime product behaviour that's just not surfaced?

**Promotion note:** if the cheap read-only probe finds real leakage from the 47 existing products, this immediately promotes to Tier 1.5 (current-revenue problem, not future-pipeline). Until that probe runs: defaults to Tier 3.

---

## CROSS-CUTTING THEME — FAILURE-STATE SURFACING (the ChatGPT nugget)

🔲 **DISCIPLINE GAP, not a single step.** Pulled together as a named theme.

Every `*_FAILED` terminal state (`RESEARCH_FAILED`, `CALCULATOR_FAILED`, `ASSEMBLY_FAILED`, `QUALITY_FAILED`, `GATES_FAILED`, `STALLED`) and every `NEEDS_*` blocked state (`NEEDS_AUTHORITY_URL`, `NEEDS_AI_REVIEW`, `NEEDS_CALCULATOR_APPROVAL`) needs an **operator-visible surface** — somewhere the operator sees that a build is stuck, why, and what action is needed.

- **What exists today:** the state machine *records* these states. The operator doesn't have a unified place to *see* them.
- **Touches:** Step 13 (Bee A resume), Step 15 (calculator approval UI), Step 19 (review surface), Step 26 (runtime health).
- **The right shape (probable):** an "Operator Inbox" / "Stuck Builds" surface in the dashboard that lists every blocked or failed build with the action needed.

*Not a single step — it's the operator-visibility theme that ties Steps 13/15/19/26 together.*

---

# THE LOCKED PRIORITIES — WHAT TO BUILD, IN ORDER

After all the reading, here's the honest ranking of what blocks the next product from existing:

## Tier 0 — Foundational (must rule before more building on top)

- **Step 0 — Architecture fork.** Run the feasibility probe + footprint search → Design rules shared / isolated / hybrid. Until ruled, every per-hive step below has an asterisk. *This may reshape Steps 4, 6, 20.5, 23.* **Hard guard: do not register a new domain or create a new Vercel project before this rules.**

## Tier 1 — Blocks the next product from existing

- **Step 15 — Calculator-approval UI.** Predicted maiden-run stop. The single highest-priority operator-blocking gap on the existing pipeline.
- **Step 20 — Delivery adapter.** The largest single unbuilt thing. Without it, machine-built products never become live storefront pages — *all* prior work is research that never becomes revenue.

## Tier 1.5 — Validates Tier-2 foundations + may surface current-revenue issues

- **Step 6 — Live-fire registry seed (Pipe B) on `theviabilityindex`.** Validates the un-migrated table constraints. Step 7's probes assume this wrote correctly; firing it once on the already-registered second site validates the foundation everything new-hive depends on.
- **Step 26 — Runtime product health *probe* (read-only).** Not the build — just the probe to find out if the 47 live products are leaking revenue invisibly. If yes: this immediately promotes to Tier 1.5 *build*. If no: stays Tier 3.

## Tier 2 — Blocks a *new* hive from existing

- **Step 4 — Site-standup runbook** (the repo→Vercel→DNS half). Without it, "I picked tax" can't reach Step 5.
- **Step 7 — Colony-comes-alive probe** + the implied fix (cron registration for the new hive's Strategic Queen; Monitor-renders-for-any-site verification).
- **Step 20.5 — Site shell (homepage / about / FAQ / nav)** for a new hive. Without it, `<newdomain>` is a 404 page even if products exist.
- **Step 23 — Stripe webhook per new domain.** Without it, a new hive can't take money.
- **Step 4 hardcode fix** — vanilla-ize the delivery repo's `TaxCheckNow`/`taxchecknow.com` bake-ins (carefully, because it touches live revenue).

## Tier 3 — Discipline + visibility

- **Failure-state surfacing theme** — the operator-inbox / stuck-builds surface; ties Steps 13/15/19/26 together.
- **Step 26 build** — runtime health surface (after the Tier-1.5 probe rules whether it's urgent).
- **Step 13 — Bee A resume path** (paste-a-URL action for `NEEDS_AUTHORITY_URL`).
- **Step 12 — Schedule the orchestrator cron** (turn manual curls into autonomy).

## Tier 4 — Deferred by design (don't build yet)

- **Steps 2.1–2.5 — Apiary Strategic Queen.** Operator picks niches by hand for now.
- **Step 1 — Allowed-niche guardrail.** Small build; can wait until Apiary is closer.

---

# RESOLVE BEFORE COMMIT (cheap probes — 5 minutes total)

Two ⚠️s in this map are cheaper to resolve than to carry forward. Doing them before commit sharpens Tier 1:

1. **Step 7c — Monitor renders for any `?site=`?** *60-second operator action:* click `theviabilityindex` in the existing site dropdown. If panels render → ✓. If they assume taxchecknow or render empty → 🔲 (and Tier 2 grows by one). *Operator runs this.*

2. **Step 16 — Bee E build-state.** *One Session-A read:* check `lib/bees/production/bee-E-page-assembler.ts` (or wherever Bee E lives) for the build status + SHA. If built → ✅. If stub/missing → 🔲 (and Tier 1 grows by one). *Session A reads this.*

Both can be answered in a single fresh chat-turn each. Doing them turns three ⚠️s into ✓/🔲 and removes ambiguity from the maiden-run critical path.

---

# STATE AT LOCK-IN (Day 14)

- **Origin (cole-marketing):** the Apiary doc, the Day-14 rulings (`VANILLA-CLONE-DESIGN-RULINGS-DAY14.md`), the build handover (`VANILLA-CLONE-BUILD-HANDOVER-DAY14.md`), persona §17 (`430a8e2`), 4th-gap (`451d1dc`), Day-13 corpus (`c054821`).
- **Origin (soverella):** Parts 1–5 of the clone build (`c72e083` through `47b1144`), Production bees A/B/C/D/F/G/H built+typechecked but never run end-to-end.
- **The shell is up; the pipes are documented; the maiden run is one operator-decision away (which gap to attack first).**

This document IS the locked map. Build by stepping through the Tier order above.

**Discipline reminder (per Design):** when this doc lands as the locked map, **start a fresh build chat from it** — don't extend this conversation. The doc is the single source of truth; every fact traceable to a commit or a probe finding. Trust the doc, start fresh, let it be the source of truth instead of any one chat's memory.
