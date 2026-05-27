# Vanilla + Clone Build — Handover (Day 14)

**Status:** the clone MECHANISM is built + proven + pushed. The dashboard SHELL is built. What remains is **testing two pipes against the live system** — a cold chat can do this from the plan below. **The house is built; this doc is how you test the plumbing, not how to redesign it.**

> **Read order:** this doc → `VANILLA-CLONE-DESIGN-RULINGS-DAY14.md` (the locked rulings) → `APIARY-STRATEGIC-QUEEN-DESIGN-DAY13.md` §2 + §17 (the contract the clone consumes + the deferred persona step). All committed in `cole-marketing`.

---

## 1. The 30-second summary

We built the missing TOP of the machine: a **Vanilla overlay template + a Clone workflow** that mints a new hive's overlay from a `CloneProposal` ("build now, niche=X"). It's built to **consume the Apiary Strategic Queen's §2 `CLONE_NEW_HIVE` handoff** (the socket cut to her future plug — operator hand-fills it today, she fills it later). It is proven by the **taxchecknow round-trip** (a thin tax seed grows valid, loadable, taxchecknow-shaped *bones*; Fork-3 loop closed, bucket 3 empty). A dashboard "mint a hive" shell makes it visible/usable in **PREVIEW** mode.

**We are NOT building** the Apiary Strategic Queen herself (deferred — operator decides niches by hand for now) or the cross-hive COLE Orchestrator (Phase 3). The clone is the *executor*; the Queen is the *decider*; they meet at the §2 contract.

**Framing that governs everything (operator-locked):** taxchecknow's overlay/products are the existing tree — *"we use it, learn from it, grow it, but we don't water it; we're planting a new forest."* The clone mints *structure* (bones); content (topics, personas, weight maps) is grown by the Strategic Queen / honest-thin-then-enriched. **Never fabricate niche content (GOAT: honest-thin beats fabricated-full).**

---

## 2. What is BUILT + PROVEN + PUSHED (durable on origin)

All in `soverella`, pushed (`f36beda..91ab765`, in sync with origin/main):

| Part | File | SHA | What |
|---|---|---|---|
| 1 | `lib/clone/clone-types.ts` | c72e083 | `CloneProposal` (= the §2 CLONE_NEW_HIVE handoff, the socket) + `CloneResult`/`CloneChecklistItem` (the output contract). Types only. |
| 2 | `lib/clone/vanilla-template.ts` | e2e7a6b (+501ddfa fix) | The vanilla template builder — vanilla-invariant content + the Fork-1b `JURISDICTION_MAP` + marked niche slots. Produces schema-valid V1+V2 objects in memory. |
| 3 | `lib/clone/clone-hive.ts` | d4e1f00 | The clone workflow: `mapProposalToSlots` (pure) → `mintOverlays` (file-only, refuses to clobber) → `seedRegistry` (DB, **dry-run by default**, fires nothing unless `confirmLiveWrites===true`) → `cloneHive` (orchestrates → `CloneResult`). |
| 4 | `lib/clone/__test__/round-trip.ts` | e6d622a (+91ab765) | The round-trip gap-finder (the acceptance test). Run: `npx tsx lib/clone/__test__/round-trip.ts`. |
| 5 | `app/dashboard/mint-hive/{page.tsx,_actions/mintHive.ts,_components/MintHiveForm.tsx}` + `layout.tsx` nav | 47b1144 (**NOT yet pushed** as of writing — confirm) | The dashboard "mint a hive" PREVIEW shell. |

**Proven:** the round-trip showed a thin tax `CloneProposal` mints both overlay files schema-valid, every structural/vanilla-invariant **bone** reproduces (engines, thresholds, GOAT floor, revenue bands, e7, the jurisdiction→{language,prefix,authority} mapping, `primary_authorities` IDs exact via `domainAuthority`, authoritative_sources structure, v2 routine skeleton), and **bucket 3 (surprises) is empty** after the one real bug was fixed.

---

## 3. The two pipes to TEST (this is the cold-chat task — test/fix, don't redesign)

The shell deliberately previews everything safely. **Two write-pipes are built-but-live-untested.** Each has a clear test + a predicted leak + the fix shape.

### Pipe A — writing the REAL overlay files
- **What:** `mintOverlays(slots, { force })` writes `overlays/<site>/strategic.json` + `strategic-v2.json`. The shell mints to a *temp* dir; a real mint writes to `overlays/<site>/`.
- **Test:** pick a real new niche, hand-author a `CloneProposal` (use the dashboard "Load example" shape or the round-trip's THIN proposal as the template), run `cloneHive(proposal, { /* real overlaysDir */ })`. Confirm `overlays/<site>/` now has two schema-valid files and `getHiveConfig(<site>)` loads them without throwing.
- **Predicted leak:** none structural (the round-trip proved the files are valid). The only risk is the clobber-refusal — it *refuses* to overwrite an existing `overlays/<site>/` without `force:true` (correct — protects taxchecknow). For a brand-new site there's nothing to clobber.
- **Fix shape:** none expected; if `getHiveConfig` throws, the error names the failing `.min(1)` floor → check the proposal supplied that field.

### Pipe B — the live registry seed (`seedRegistry` with `confirmLiveWrites:true`)
- **What:** writes a placeholder `platform_accounts` row (Fork 2a, so the site resolves in the dropdown) + seed `strategic_queen_handoffs` from `estimated_first_products` (Fork 1a) + a `demand_candidates` row per seed carrying the **real jurisdiction** with the handoff's `candidate_id` linked (the wiring fix — so `claimNextHandoff`'s `jurisdictionToCountry` doesn't default to "au").
- **⚠️ THE PREDICTED LEAK (the one real unknown):** `platform_accounts` and `strategic_queen_handoffs` have **NO in-repo CREATE migration** — they were created manually, so their full NOT-NULL/default constraint sets are **unverified from source**. The live insert is the *first* validation against their real schema. **An insert may be rejected by a NOT-NULL column the dry-run plan didn't include.**
- **Test (operator-only — only the operator runs live-DB writes):**
  1. Run `seedRegistry(slots, { confirmLiveWrites: false })` first (or use the dashboard preview) → inspect the would-insert rows.
  2. **Validate those rows against the LIVE schema** (operator: `\d platform_accounts`, `\d strategic_queen_handoffs`, `\d demand_candidates` — confirm every NOT-NULL-without-default column is present in the would-insert row).
  3. If a required column is missing from the plan → **fix shape:** add it to the relevant seed object in `seedRegistry` (`lib/clone/clone-hive.ts`), keeping it honest (real value or a sensible default, never fabricated). This is a small, bounded patch — a column add, not a redesign.
  4. Then run with `confirmLiveWrites: true` (operator-confirmed) for one real hive. Confirm: the site appears in the dropdown (`getSites()`), the seed handoffs are claimable, and a claimed handoff derives the *correct* country (not "au") — proving the `candidate_id` wiring fix.
- **Confirmed safe today:** `demand_candidates` columns are verified (site, jurisdiction, raw_topic_signal, source — `source:"operator_hypothesis"` is CHECK-valid). The handoff V2-row shape inserts for a brand-new site (no FK/site-guard). The *unknowns* are only the two un-migrated tables' base constraints.

---

## 4. The rulings (locked — see `VANILLA-CLONE-DESIGN-RULINGS-DAY14.md` for full)

- **1a:** clone mints a minimal-valid `topic_universe` placeholder; `estimated_first_products` → seed handoffs (NOT overlay); Strategic Bee-1 grows real topics. §2 documents this verbatim — no contract amendment.
- **1b:** `jurisdiction→{language,prefix}` = vanilla infrastructure (the `JURISDICTION_MAP`), not §2; authority IDs derived from §2 URLs via `domainAuthority`. ⚠️ `domainAuthority` only names the 5 tax authorities + generic gov — **non-gov niches fall back to a host-label ID + warn** (the 1b derivation is partial; honest fallback works).
- **1c / persona → Option A:** clone does NOT generate personas (the registry is a hardcoded TS module `lib/bees/_character-registry.ts` + `CHARACTERS.md`, not a writable table). Clone references existing (taxchecknow) / emits a checklist item (new hives). Persona *generation* = future Apiary Queen step (her §17).
- **2 → (a)-now/(b)-flagged:** placeholder `platform_accounts` row now; a real `sites` table is the flagged follow-up (trigger: before hive #2, or on a 2nd `OverlayNotFoundError` drift).
- **3 → author-clean + round-trip** (the gap-finder). Prompt-noun cleanse (#138/#139, Bee C "TAX topic") is a separate code-cleanse, flag-not-couple.
- **4th gap (v2-routines):** clone seeds honest-thin routines from §2 evidence; richness grown by Bee-1/Strategic Queen/Apiary §17. ⚠️ The round-trip is STRUCTURAL-ONLY — it does NOT test routine *quality* (that's operation-time).
- **`border_sensitivity`/`primary_market_skew`:** ruled bucket-2 (vanilla-default; operator tunes post-mint; not a §2 slot).
- **`competitor_country_filter`:** fixed (501ddfa) — emits the competitor-country tag (AU/UK/US/NZ/CAN/Nomad), not jurisdiction_code.

---

## 5. Flagged follow-ups (real triggers, not rotting TODOs)

- **A real `sites` registry table** — trigger: before hive #2, or a 2nd dropdown drift. (Fork 2b.)
- **A writable character surface** — trigger: when the Apiary persona-step (her §17) is built.
- **Prompt-noun cleanse (#138/#139)** — before hive #2's bees emit non-tax content.
- **Per-product jurisdiction tagging in seed handoffs** — minor; today all seeds take `jurisdictions[0]`; refine if a hive's products span jurisdictions.
- **The Apiary Strategic Queen** (the decider) and the **cross-hive COLE Orchestrator** (Phase 3) — both deferred by design; the clone plugs into her §2 contract when she's built.

---

## 6. What's NEXT after the pipes are tested

Once Pipe A + Pipe B are validated against the live system (a real hive minted, the site resolves, a handoff claims with the right country): the clone layer is *operationally* proven, not just mechanically. Then the open questions become operation-time (do honest-thin v2 routines hunt usefully? — the 4th-gap operation question) and the natural next builds are the deferred deciders (Apiary Queen) — but those are new scope, not this build.

**Discipline that built this (carry forward):** PROBE never guess (STEP-0 reads real source before any edit/decision); verify-before-compose every schema/surface claim; bank-each-part-before-next; **committed-AND-pushed or it doesn't count as saved**; commits carry NO trailer; only the operator runs live-DB writes; honest-thin never fabricated; build the shell with deep context, leave testing as a cold-chat-safe documented plan.
