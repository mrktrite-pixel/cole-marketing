# PERFORMANCE.md
# Updated by Analytics Reader every Monday

## Week of 2026-04-29

Status: BASELINE — no purchase / lead / email data this period. taxchecknow.com live since 2026-04-24 (5 days). Marketing OS at Station E (research layer); content factory not yet shipping. Snapshot pulled 2026-04-29T07:57:43Z from Supabase via `cole-analytics-snapshot.ts`.

### Revenue
No purchases this period (baseline).
Total: £0 (paid: $0 across currencies) | Products sold: 0
Top product: none recorded.
Stripe webhook handler exists; redeploy after env-var injection still required before first checkout will land.

### Leads
No leads this period (baseline).
Total captured: 0 | Converted: 0
By site|country: no rows.
Lead capture form not yet wired into any calculator success page.

### Email
No email activity this period (baseline).
Sent: 0 | Failed: 0 | Open rate: n/a
Resend API key present; queue and templates exist but nothing has been triggered (no purchases to fire receipts).

### Content Published
No content published this period (baseline).
Pages: 0 | Types: none | IndexNow pings: 0 | Google Indexing pings: 0
Content factory installs at Station G. Story writer / hook generator / distribution bees not yet built.

### Psychology Insights (from E3)
- AU_baseline — fear: dollar_amount $47,000 (CGT main-residence trap, Gary) — best_utm_source: reddit
- UK_baseline — fear: dollar_amount £240,000 (pension-IHT, James) — best_utm_source: linkedin
- US_baseline — fear: dollar_amount $340,000 (Section 174 amortisation, Tyler) — best_utm_source: reddit
- NZ_baseline — fear: dollar_amount $49,500 NZD (bright-line agreement-date trap, Aroha) — best_utm_source: google
- CAN_baseline — fear: dollar_amount $180,000 CAD (EOT exit, Fraser) — best_utm_source: google
- Nomad_baseline — fear: dollar_amount $34,000 AUD (treaty tiebreaker, Priya) — best_utm_source: google
Total insights on file: 6 (0 from data, 6 baseline). Refresh required once first purchases land.

### Competitor Landscape (from E4)
17 competitors logged across AU / UK / US / NZ / CAN / Nomad. See COMPETITORS.md for the per-country breakdown and citation-gap angles.

### Platform Performance
All zeros until Station J (LinkedIn) complete. Confirmed.
LinkedIn / YouTube / Reddit / IG / X / TikTok publishers not yet installed (Stations J–O).

### AI Citations
Not yet measured (Station K6 — GEO Optimiser).
gap_queue holds 3 rows seeded at E1; research_questions holds 25 rows for AU-01 from E2 — both feed Station K6 once it ships.

### Actions This Week
1. Complete Station E6 (research-manager quality gate) before launching the content factory at Station G — without it, hook/story output has no review layer.
2. Smoke-test one live checkout end-to-end (e.g. /au/check/cgt-main-residence-trap $67) to confirm the Stripe webhook → Supabase `purchases` path actually writes a row; current 0-count may be wiring, not absence-of-traffic.
3. Wire GA4 service-account credentials into the snapshot helper so next Monday's report has session + utm_source attribution to validate or overturn the 6 baseline psychology assumptions.

---

## Prior Weeks (history)
