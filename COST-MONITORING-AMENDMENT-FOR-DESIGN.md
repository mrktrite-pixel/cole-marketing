# Cost-Monitoring tile — AMENDMENT (FOR DESIGN)

**Amends:** the ratified `API-COST-MONITORING-GAP.md` brief. Prompted by research (web + codebase) that falsifies two of its load-bearing assumptions. This routes the re-spec to Design; positions + rejected alternatives below, not a menu.

## Researched findings (facts, not assumptions)

- **F1 — no provider "remaining balance" API.** Anthropic balance is Console-UI only (no documented endpoint; only unofficial scrapers read `platform.claude.com`). Gemini Prepay balance is AI-Studio-UI only. So section 1–2 as written ("pull balance → RED < threshold") is not buildable against any documented API.
- **F2 — providers DO offer native budget-alerts + auto-reload.** Anthropic: Cost Admin API for *spend* (requires an `sk-ant-admin` key + an **organization** — not available to individual accounts) + Console auto-recharge. Google: Cloud Billing Budget API (programmatic budgets + threshold alerts + Pub/Sub) + AI Studio Prepay auto-reload.
- **F3 — `agent_log` does NOT capture failed calls.** `callClaudeTracked`/`trackCost` write `agent_log` only on success; a thrown call (credit-out, non-429 4xx, or retries-exhausted) writes nothing. The brief's "count 4xx/429/5xx in `agent_log` per hour" cannot work today. `callClaude` retries 429/5xx, throws other 4xx, surfaces the code on `err.status`.
- **F4 — section 3 is buildable now.** `agent_log` already carries `cost_usd`/`tokens_used`/`model_used`/`bee_name`/`site`/`created_at` — the per-bee daily cost trend needs no new capture.

## Proposed re-spec (rulings for Design)

### Ruling A — Balance axis = native provider features, not a custom poller
Enable Anthropic Console auto-recharge + Gemini AI-Studio auto-reload, and set each provider's **native budget-threshold alerts** (Anthropic Console; Google Cloud Billing Budget API). The dashboard surfaces *spend trend* + auto-recharge/alert **status**, not a scraped balance number.
**Rejected:** a custom balance-poller scraping the provider UIs — unofficial, fragile, and would itself break silently (the exact failure mode this brief exists to prevent).
**Operator-check prerequisite:** is the COLE Anthropic account an **organization** (admin key available)? If individual, the Cost Admin API spend-pull isn't available — auto-recharge + the `agent_log` tile still are.

### Ruling B — Add failure-capture to the shared tracked-call seam (the load-bearing fix)
On a caught LLM error in `callClaudeTracked`/`trackCost`, write an `agent_log` row (`cost_usd=0`, `tokens_used=0`, `model`, plus `error_status` from `err.status` and the message, flagged as a failed attempt) **before re-throwing**. This is what directly detects the 2026-05-28 silent-credit-out, and it's the prerequisite for *any* failed-call-rate or silent-fail signal.
**Care:** it touches a wrapper every Claude-calling bee uses — the success path must be byte-for-byte unchanged; validate on a live success + a forced failure before commit.
**Rejected:** a separate balance-poll cron *instead* (leaves per-call failure invisible); doing nothing and sourcing 4xx elsewhere (no other seam sees every call).

### Ruling C — The tile's real, custom scope (built on A+B)
1. Per-bee daily cost trend (agent_log success rows) — buildable now.
2. Per-bee / per-provider **failed-call rate + silent-fail detector** (a bee's cost/calls dropping to zero) — buildable *after* Ruling B.
3. Provider auto-recharge / budget-alert **status** surfaced (config health), not a balance figure.

## Proposed build order
Ruling B (failure-capture) → operator enables native auto-recharge + budget alerts (Ruling A) → build the `agent_log`-backed tile (Ruling C). B first because it's the silent-fail detector and the brief's core justification; it also unblocks C-section-2.

## What Design should return
Ratify/refute A, B, C and the order. The substantive call is **B** — it changes a load-bearing shared wrapper, so it wants an explicit ruling, not a unilateral edit. A is mostly config + an operator-check (org status). C is then a normal dashboard build.
