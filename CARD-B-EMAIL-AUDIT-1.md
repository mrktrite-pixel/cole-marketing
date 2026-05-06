# CARD B-EMAIL-AUDIT-1 — VERIFY T2 PURCHASE EMAIL FIRES

**Priority:** CRITICAL — potentially active revenue loss
**Estimated effort:** 15-30 min
**Repo:** taxchecknow (NOT soverella)
**Blocks:** Nothing in Block 2. Should run in parallel with Block 2 work.

---

## CONTEXT

Per Chat A's email-system audit, T2 (purchase confirmation email) is the immediate trigger after Stripe purchase. If T2 does not fire, every paying customer pays $67-$147 and receives nothing — silent revenue loss + trust damage.

The brain v14 references "Email cron sender (existing)" but cannot confirm whether:
- T2 actually fires on Stripe purchase
- Which email provider is wired (Resend / SendGrid / Sender.com / SMTP / nothing)
- Any email has ever been sent in production
- Templates exist in the email_templates table

This card verifies current state. It does NOT design a new email system.

---

## TASKS

### Task 1 — Find email-sending code in taxchecknow repo

```bash
cd taxchecknow

# Search for email-sending integrations
grep -r -l "resend\|sendgrid\|nodemailer\|sender\.com\|@sendgrid\|emailjs\|postmark" \
  scripts/ lib/ app/api/ 2>/dev/null

# Search for email_queue / email_templates references
grep -r -l "email_queue\|email_templates\|email_log\|email_sequences" \
  scripts/ lib/ app/api/ 2>/dev/null

# Search for Stripe webhook handlers
grep -r -l "stripe.*webhook\|checkout\.session\|payment_intent\.succeeded" \
  scripts/ lib/ app/api/ 2>/dev/null
```

**Document findings:**
- Which file(s) handle email sending (if any)?
- Which provider is used (if any)?
- Is there a Stripe webhook handler that triggers email?
- Are email_templates / email_queue tables read anywhere in code?

### Task 2 — Check Vercel environment variables

```
vercel env ls
```

Look for: `RESEND_API_KEY`, `SENDGRID_API_KEY`, `SENDER_API_KEY`, `SMTP_HOST`, `EMAIL_FROM`

**Document:** which email-related env vars are set (names only, never values).

### Task 3 — Check Stripe dashboard

Login to Stripe → Developers → Webhooks

**Document:**
- Which webhook endpoints are configured?
- What events do they listen to (checkout.session.completed, payment_intent.succeeded)?
- Recent successful webhook deliveries (last 7 days, count + endpoints)
- Any failed webhook deliveries?

### Task 4 — Database state check

```sql
-- Templates
SELECT COUNT(*), site_id 
FROM email_templates 
GROUP BY site_id;

-- Sent emails
SELECT COUNT(*), template_type, MAX(created_at) AS most_recent
FROM email_log 
WHERE created_at > now() - interval '30 days'
GROUP BY template_type;

-- Queue state
SELECT COUNT(*), status 
FROM email_queue 
GROUP BY status;

-- Recent purchases
SELECT COUNT(*), DATE(created_at) AS day
FROM purchases
WHERE created_at > now() - interval '30 days'
GROUP BY DATE(created_at)
ORDER BY day DESC
LIMIT 10;
```

**Document each query result.**

### Task 5 — Production test (LAST RESORT — only if Tasks 1-4 inconclusive)

Make a real test purchase via Stripe test mode if available, or buy with operator card on a low-value product if necessary.

**Verify:**
- Did the purchase complete?
- Did the buyer email receive ANY email within 5 minutes?
- If yes: capture subject line + sender domain + body structure
- If no: confirmed silent failure — log as drift incident

---

## DELIVERABLE

A single audit report at `/mnt/user-data/outputs/T2-AUDIT-REPORT.md` covering:

1. **State of email-sending infrastructure** — exists / partial / missing
2. **Email provider in use** — Resend / SendGrid / Sender / SMTP / none
3. **Stripe webhook → email connection** — wired / not wired / unclear
4. **Database state** — counts from each query
5. **Recent purchases** — how many in last 30 days (gives sense of scale of any potential silent loss)
6. **VERDICT:** one of:
   - ✅ T2 fires correctly — no action needed
   - ⚠️ T2 fires but uses old provider / outdated template — needs update
   - 🔴 T2 does NOT fire — URGENT FIX, revenue loss happening now
   - ❓ Cannot determine without test purchase

---

## RULES

- Do NOT modify any code in this card. Audit only.
- Do NOT send any test emails to real customer addresses.
- Do NOT log Stripe API keys or full webhook secrets in the report.
- Do NOT design a new email system. That's a future card after this audit.
- Read-only queries. No schema changes.

---

## ESCALATION

If verdict is 🔴 (T2 not firing):
- Stop other Block 2 work immediately
- Operator notified
- New card B-EMAIL-FIX-1 written based on audit findings
- T2 wiring becomes urgent priority

If verdict is ✅ or ⚠️:
- Continue Block 2 as planned
- Audit report informs future EMAIL-SYSTEM-SPEC drafting

---

## WHY THIS CARD MATTERS

A customer paid $67. They got nothing. They feel scammed. They dispute the charge or churn or warn others. Multiply by every silent T2 failure since the email system was supposed to start working.

This is a 15-30 minute audit that protects revenue + reputation + the entire personalised-product moat. It runs in parallel with Block 2 work and does not interrupt the build.

**Worst-case outcome:** find a real revenue leak and fix it. Best-case: confirm everything works and move on with confidence.

Either way: knowledge replaces uncertainty.
