# Apiary Strategic Queen — State (cold-start handoff)

**Read this first.** Single-page handoff for a fresh chat picking up Apiary
Strategic Queen work cold. Last refreshed 2026-05-31.

## What the Apiary Queen is

The **cross-niche scout** — one vanilla layer above all hives. It hunts
citation-gap niches across the whole internet and routes winners via four bees.
Only live hive today is **taxchecknow** (6 jurisdictions: ATO/HMRC/IRS/IRD-NZ/CRA
+ nomad). Apiary is apiary-scoped; each bee is an independent cron, no orchestrator.

## Current status — ALL FOUR BEES BUILT

| Bee | State |
|---|---|
| **Bee 1 — Niche Hunter** | **LIVE.** Drained 2026-05-29: 152 surfaced, 56 eligible. |
| **Bee 2 — Niche Scorer** | **LIVE.** Drained 2026-05-30: 56/56 scored, ~$0.43, top 7.39. |
| **Bee 3 — Niche Router** | **BUILT 2026-05-31**, validated (56-row drain + 6/6 fixtures), documented. Cron HELD. Build `c87aea0`; docs `15d81c8`/`4f71398`. |
| **Bee 4 — Handoff Composer** | **BUILT 2026-05-31**, validated (empty fire + 2/2 fixtures), documented. Cron HELD. Chain `460edcb → 7f89290 → 79ca5ed → 37d436f` (+ migration `c614ed4`, slugify `a037f80`, rename `6ca738e`). |

The whole queen is **built and HELD** — manual curl fires only, **zero `apiary-bee`
entries in `vercel.json`.**

## Go-live gates — both BLOCKING, both briefed + routed to Design

1. **Fork-2b canonical `niche_registry`.** Table migration shipped (`80f6321`,
   empty). Integration brief filed (`4caf233`) → **awaiting Design ruling** on
   site_registry / population / cutover order / columns. On ruling, build order:
   seed → Bee 3 reader (dual-read) → Bee 1 blacklist gate → Bee 1 suppression.
2. **API cost/balance monitoring tile.** Researched: no provider balance API
   exists, and `agent_log` does not capture failed calls. Amendment brief filed
   (`417b74b`) → **awaiting Design ruling** on A (native auto-recharge + budget
   alerts), B (add failure-capture to `callClaudeTracked`/`trackCost` — the
   load-bearing fix), C (`agent_log`-backed tile). Operator-check: is the COLE
   Anthropic account an **organization** (admin-key-capable)?
3. **Anthropic auto-recharge + Gemini auto-reload** — operator-check, interim
   stop-bleed (part of cost-monitor Ruling A).
4. **`vercel.json` apiary cron** — register only after 1+2 clear.

## Locked decisions (ratified, in cole-marketing)

- Bee 3: routing brief `APIARY-BEE3-ROUTING-FOR-DESIGN.md` (`22b9035`) + scope
  addendum `APIARY-SCOPE-ADDITION-FOR-DESIGN.md` (`622b363`).
- Bee 4: handoff brief `APIARY-BEE4-HANDOFF-FOR-DESIGN.md` (`3b4a0d2`) +
  dispatcher design `APIARY-BEE4-DISPATCHER-FOR-DESIGN.md` (`1e4b724`).
- Fork-2b: registry log + integration brief `APIARY-FORK2B-INTEGRATION-FOR-DESIGN.md`.
  Registry = single status-keyed table, no pgvector, no centralized matcher.
- Cost-monitor: `COST-MONITORING-AMENDMENT-FOR-DESIGN.md`.
- Token tiers (cole-brain): Bee 2 = Haiku×3 + Gemini; Bee 3 = Opus (`claude-opus-4-7`);
  Bee 4 = Haiku thick-stub on CLONE only. Batch sizes: Bee 2 = 8, Bee 3 = 20, Bee 4 = 20.
- Cron posture: all four HELD until the two gates clear; manual curl fires are
  operator-driven and do not trip any first-run gate.

## Next step

Await the two Design rulings (Fork-2b integration; cost-monitor A/B/C). On each
ruling, build that gate one step at a time, validate, then — once both gates are
done — register the apiary crons in `vercel.json`. Nothing else is build-ready;
proceeding before the rulings would be guessing on changes that touch the LIVE
Bee 1/2 loop and a shared LLM wrapper.

## Canonical docs

- As-built (authoritative): `soverella/docs/help/apiary-strategic-queen/` —
  `README` / `STATE.md` / `DESIGN.md`, `bees/bee-{1,2,3,4}-*.md`, and
  `queen/APIARY-STRATEGIC-QUEEN-AS-BUILT.md` (§1–14 queen, §15–23 Bee 2,
  §24–32 Bee 3, §33–40 Bee 4).
- Durable design briefs: `cole-marketing/` (the FOR-DESIGN briefs above).
- NOTE: this is the cole-marketing mirror; the soverella copy at
  `docs/help/apiary-strategic-queen/STATE.md` is the in-repo authoritative state.
