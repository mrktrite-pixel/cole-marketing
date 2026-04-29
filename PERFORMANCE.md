# PERFORMANCE.md
# Updated by Analytics Reader every Monday

## Week Ending 2026-04-29

Status: BASELINE — factory at Station C, no marketing OS content shipped yet.
taxchecknow.com live since 2026-04-24 (5 days). Adaptive Queen / Hive 3 installs at Station K.

### Data source status
- Supabase: connected, tables empty (purchases 0, email_log 0, decision_sessions 0)
- GA4: not wired (no service-account key)
- Search Console: not wired
- Stripe webhook → Supabase: handler exists, no rows recorded
- Email (Resend): key present, no sends logged

### Top Converting Products (this week)
None — 0 purchases recorded.

### Top Converting Channels
None — no utm data yet.

### Bottom Performers
N/A — nothing has run.

### Platform Performance
LinkedIn / YouTube / Reddit / IG / X / TikTok: not yet installed (Stations J–O).

### AI Citations
Not measured this week.

### Articles
Published this week: 0 of 920 target. Total published: 0/920.

### Psychology Insights
Source: customer-psychologist run 2026-04-29 (6 insights, 0 from data, 6 baseline)
Top fear format this period: dollar_amount (100% of insights — baseline only, no purchase data)
Top converting demographic: baseline only — no data yet (per-country defaults: Gary 55-65 AU, James 50-58 UK, Tyler 40-50 US, Aroha 40-48 NZ, Fraser 48-55 CAN, Priya 30-38 Nomad)
Top converting source: baseline only — no data yet (assumed: reddit AU/US, linkedin UK, google NZ/CAN/Nomad)
Notes: baseline only — no data yet. 6 baseline rows written (one per country: AU/UK/US/NZ/CAN/Nomad), each tagged ASSUMED, sourced from CHARACTERS.md fear numbers and PRODUCTS.md headline figures. Refresh once first purchases land in Supabase.

### Operator action items (flagged from this run)
1. Verify Stripe price IDs are set in Vercel and a redeploy fired after 2026-04-24.
2. Smoke-test one checkout end-to-end (e.g. /au/check/cgt-main-residence-trap $67) and confirm a row lands in Supabase `purchases`.
3. Add GA4 service-account credentials so next week's report has session + conversion data.
4. Continue rollout: D → E → F → G → H before any optimise loop can produce signal.

### Next meaningful report
2026-05-06 — only if at least one piece of content has shipped through the factory and at least one Stripe purchase has been recorded.
