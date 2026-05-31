# Apiary — Phase-1 Jurisdiction Scope & Authority-Anchor Gate
### Addendum to `APIARY-BEE3-ROUTING-FOR-DESIGN.md`

**Status:** ✅ RATIFIED (Design chat, 31 May 2026) with three pickups folded in.
Q1 + Q3 confirmed by operator; Q2 + Q4 ratified by Design.
**Amends:** §3 (suppression ↔ EXPAND boundary), §6 (decision flow), §7 (fit-check prompt).
**Touches:** Apiary Bee 1 (niche hunter, LIVE) and Apiary Bee 3 (niche router, in build).

---

## 1. Why this exists (the gap)

The ratified Bee 3 design routes every above-threshold niche to CLONE / EXPAND / IGNORE, but never encoded **which jurisdictions the engine is allowed to pursue at all**. Live testing exposed it: a synthetic `germany-vat-compliance` fixture (tax domain, unclaimed jurisdiction) routed to **CLONE_NEW_HIVE**. The model reasoned correctly within its given rules and defaulted to clone because no scope rule existed. Any non-claimed niche would have hit the same fate — a real gap, not a corner case. This addendum adds the rule.

---

## 2. The rule (two gates, distinct conditions)

> **A niche is in-scope only if it clears BOTH gates:**
> **Gate 1 — Anchor (correctness):** there is a clear, citable, definitive governing authority for the niche.
> **Gate 2 — Capacity (market/language):** that authority operates in a language we can author content in today (English).

**Scope follows the governing authority, not the geography named in the niche.** A US citizen living in Spain who must file US taxes is governed by the **IRS** → in-scope (Spain is incidental). The governing authority is the axis, not residence.

**US is the priority market** — bigger and more financially viable — but the engine is open to *any* jurisdiction that clears both gates, as capacity allows.

**The two failure modes are different conditions and must be recorded separately** (this is the key sharpening from ratification):

| Fails | `decision_reason` | Nature | Remediation path |
|---|---|---|---|
| Gate 1 — no citable authority exists | `out_of_scope: no_anchor_authority` | **Permanent** | None — the niche can never be a COLE product, because there is nothing to ground it to. |
| Gate 2 — authority exists but is non-English | `out_of_scope: language_capacity` | **Temporary / deferred** | Could open when COLE adds non-English authoring capacity (a real future phase). |

Germany illustrates why the split matters: it *has* a citable authority (Bundeszentralamt für Steuern). It is deferred for **language capacity**, not absence of an anchor. Collapsing both into "non-English → IGNORE" would bury the signal and make a future "should we add German/French authoring?" decision a guess instead of a data-driven call.

---

## 3. Why this is the right rule (it's already foundational)

This is not a new constraint — it is the locked citation-gap correctness discipline from `cole-core`, applied at the routing layer:

- COLE grounds every product to a definitive authority (the IRD/ATO/HMRC/IRS authority block).
- The one rule that cannot break: *a verdict, a number, a next step* — **depth before breadth, always.**
- A niche with no citable authority cannot satisfy that thesis; routing it to CLONE would create a hive that *cannot ship a GOAT product by construction*.

So **Gate 1 (is there an authority to anchor to) is simultaneously the scope gate and the quality gate** — the same test doing double duty. Requiring the router to *name the governing authority* is exactly the check the correctness mandate already needs. Gate 2 (language/capacity) is a separate market/audience axis layered on top, not part of correctness.

---

## 4. In-scope set (Q1 — operator-confirmed)

**Live today (taxchecknow — one hive, six anchored jurisdictions):**

| Jurisdiction | Authority | Notes |
|---|---|---|
| US | IRS | **Priority / main market** |
| UK | HMRC | |
| AU | ATO | |
| NZ | IRD-NZ | |
| CA | CRA | |
| Nomad | (home authority, IRS-skewed) | Cross-border / expat. Anchors to whichever home authority governs the obligation — mostly IRS (FEIE, expat tax), also UK NRLS, AU expat CGT. Not a separate non-English market. |

The five country authorities are confirmed verbatim from the overlay (`buildClaimedInventory`, ed5d270): `ato / hmrc / irs / ird-nz / cra` — not assumed.

**Open to add (clears both gates), as capacity allows:** Ireland (Revenue Commissioners), Singapore (IRAS), South Africa (SARS), and similar. These are valid EXPAND candidates — see §6.

**Out-of-scope today:** anything failing Gate 1 (`no_anchor_authority`, permanent) or Gate 2 (`language_capacity`, deferred).

---

## 5. How it folds into the two bees

**Bee 1 (niche hunter) — hunt-scope constraint.**
Hunt authority-anchored, English-authoring niches only. Don't surface out-of-scope markets in the first place. ("Only searching for English products.")

**Bee 3 (niche router) — fit-check gate (the backstop), runs first.**
Add an **anchor-authority gate as the first step of the fit-check**, before the EXPAND/CLONE/IGNORE_CLAIMED logic. The prompt instructs the model to:
1. **Name the governing tax/visa authority** for the niche, and
2. **Report that authority's primary operating language.**

Then:
- No clear, citable authority can be named → **IGNORE `no_anchor_authority`** (permanent).
- Authority named but non-English → **IGNORE `language_capacity`** (deferred).
- Authority named and English → proceed to EXPAND / CLONE / IGNORE_CLAIMED.

**Gate placement: prompt, not a hard country allow-list (Q4 — Design-ratified).** Reasons:
- *Architecturally vanilla:* an allow-list encodes a moving target into code — every jurisdiction expansion (Ireland, then Singapore, then…) becomes a code change. A prompt-based gate adapts as the overlays/claim data the system already maintains change.
- *Robustness:* the model reliably maps authorities to jurisdictions; a rigid list is brittle against free-text jurisdiction values and risks false IGNOREs on valid niches.
- **Named risk:** a prompt gate is itself a model judgment that can fail. The §20 calibration discipline applies — the instruction must *discriminate*, not prime a verdict, and must avoid being read as either "only the six listed authorities" (over-restrictive — Ireland would wrongly IGNORE) or "anything English" (under-restrictive — a weak/contested authority would wrongly pass). This is why the §9 test plan now includes a boundary fixture.

---

## 6. EXPAND-vs-CLONE boundary + phase-gating (§3 resolution; Q2 + Q3)

**Same domain + new in-scope jurisdiction → EXPAND (Q2 — Design-ratified).**
taxchecknow is already a six-authority hive, so adding Ireland (Revenue Commissioners) is the hive *growing its jurisdiction coverage*, not a new hive. A hive that already spans six authorities expanding to a seventh is definitionally expansion, not cloning.

**Different domain → CLONE / route to that domain's own hive.**
Visa → theviabilityindex; immigration / crypto / estate / business-viability → their own verticals.

**Out-of-scope jurisdiction (per §2) → IGNORE**, regardless of domain.

**Phase-gating CLONEs — Reading 1 (Q3 — operator-confirmed).**
CLONE means "belongs to a different hive," *not* "build that hive now." Use the **existing PENDING handoff workflow**: Bee 3 writes the CLONE verdict; Bee 4 produces the CloneProposal handoff, which pends in `apiary_strategic_handoffs` until the operator approves. A **`phase_readiness` flag** (`ready` | `queued`) in the handoff metadata lets the operator dashboard separate approve-now from future-phase candidates. No new intermediate state is introduced.

**Live-vs-queue split (Q3 — operator-confirmed):**
- **tax → live now** (EXPAND taxchecknow).
- **visa → Phase 1, launching** (theviabilityindex) — `phase_readiness: ready` as it goes live.
- **immigration / crypto / estate / business-viability → `phase_readiness: queued`** (not yet live; CLONE verdict is correct but the handoff waits for its phase).

So a high-scoring immigration niche routes CLONE with `phase_readiness: queued` — the verdict is recorded, the build is deferred.

---

## 7. Updated Bee 3 decision flow (amends §6)

```
1. Below CLONE_THRESHOLD (8.0)              → IGNORE (below_threshold_watching)  [cheap, no Opus]
2. Opus fit-check:
   2a. Anchor gate (Gate 1)  [NEW, first]   → IGNORE (no_anchor_authority)   if no citable authority   [permanent]
   2b. Capacity gate (Gate 2) [NEW]         → IGNORE (language_capacity)      if authority non-English  [deferred]
   2c. In-scope routing:
        • already covered by a hive          → IGNORE_CLAIMED  → IGNORE
        • same domain, new in-scope juris.   → EXPAND_EXISTING → EXPAND (set existing_hive)
        • different domain                   → CLONE_NEW_HIVE  → CLONE (phase_readiness: ready|queued)
        • ambiguous                          → CLONE (default bias, unchanged)
```

The scope gates sit **inside** the Opus call (the model judges them and reports authority + language). Out-of-scope niches therefore still cost one Opus call — acceptable, since Bee 1's hunt-scope keeps most out-of-scope niches from ever reaching Bee 3. A cheap pre-Opus filter can be added later if cost proves material.

---

## 8. Ratification questions — resolved

- **Q1 (in-scope set + US priority):** operator-confirmed — §4 stands.
- **Q2 (EXPAND for new in-scope jurisdiction):** Design-ratified — §6.
- **Q3 (phase-gating CLONEs):** operator-confirmed — Reading 1 + the live/queue split in §6.
- **Q4 (gate placement: prompt vs allow-list):** Design-ratified — prompt, §5.

---

## 9. Re-test plan

Reset the held fixtures' `decided_at` to NULL, add the new ones, update the Bee 3 fit-check prompt with the two-gate authority check, then re-fire:

| Fixture | Jurisdiction / domain | Expected |
|---|---|---|
| `fixture-uk-vat-filing` | UK tax (HMRC, covered) | IGNORE_CLAIMED → IGNORE |
| `fixture-germany-vat-compliance` | Germany tax (authority exists, non-English) | **IGNORE — `language_capacity`** (deferred) |
| `fixture-immigration-visa-sponsorship` | UK immigration (different domain) | CLONE — `phase_readiness: queued` |
| `fixture-ireland-vat` *(new)* | Ireland tax (English, Revenue Commissioners) | **EXPAND_EXISTING → taxchecknow** |
| `fixture-noauthority-niche` *(new)* | English topic, no citable governing authority | **IGNORE — `no_anchor_authority`** (permanent) |
| `fixture-weak-authority` *(new — boundary probe)* | English jurisdiction with a real but thin/sporadic authority | **Calibration probe** — outcome IS the finding (does "clear, citable, definitive" discriminate, or rubber-stamp anything English?). Not pass/fail. |

This exercises all routing outcomes including the previously-underweighted EXPAND branch, both out-of-scope reasons distinctly, and the boundary case where Gate 1's judgment is actually tested.

---

## 10. Record correction (carried from ratification)

The earlier "EXPAND is largely dormant for taxchecknow" finding was **underweighted**. There are real English jurisdictions outside taxchecknow's five authorities — Ireland (Revenue Commissioners), Singapore (IRAS), South Africa (SARS) — so EXPAND has genuinely-live v1 candidates, not just synthetic fixtures. This addendum partly *un-dormants* EXPAND by clarifying that "in-scope" includes English jurisdictions taxchecknow hasn't claimed yet. To be reflected in AS-BUILT.
