# LOCKED LOOP CLOSURE SPEC

**Status:** LOCKED — May 4 2026 AWST
**Authority:** This document is canonical. Future chats and bees implement against this spec exactly. No drift. No reframing. No renaming.
**Version:** 1.0
**Reconciles:** ChatGPT take 3 + multi-site pub test + brain v14 architecture

---

## TL;DR

The COLE system is a self-building, self-optimising content + product company. Today it has ~5 working bees in a forward-only pipeline. This spec defines the closed loop that turns it into a learning system that scales to 50+ sites without architectural change.

**The closed loop is 12 components.** Once these ship, the system measures, recycles, learns, and compounds. Everything else is enhancement.

---

## SECTION 0 — CANONICAL REFERENCE FILES (DO NOT IGNORE)

This spec defines architecture. The CONTENT and CONVENTIONS that bees apply come from existing canonical files. Bees MUST read from these. Future Claude chats MUST respect these.

### THE BUSINESS LAYER — what we sell and why (READ FIRST)

These three files define WHY the system exists. Without them, future chats will optimise plumbing while drifting away from the moat. **Required reading before any product, content, or pricing decision.**

| File | Location | What it defines |
|---|---|---|
| **USER-SKILL.md** | `cole-marketing/USER-SKILL.md` | The master COLE strategy doc. Citation Gap Engine thesis. Why personalised reports beat PDFs. The compounding citation moat. The business in numbers. **The 30-second version of "what is COLE" lives here.** |
| **CUSTOMER-taxchecknow.md** | `cole-marketing/CUSTOMER-taxchecknow.md` (v8 May 2 2026) | The signed-off product framing. $67-147 pricing. "Personalised reports NOT PDFs" — required language across every bee output. Banned phrases ("guide", "ebook", "course", "PDF"). Acceptable phrases ("personalised analysis", "your tax check", "your numbers"). The 6 sub-personas per character. The 7 trigger moments. The customer psychology (confused, desperate, self-doubting, suspicious, time-poor, money-anxious). |
| **GOAT-BEEHIVE-ARCHITECTURE.md** | `cole-marketing/GOAT-BEEHIVE-ARCHITECTURE.md` | The strategic playbook. Brain Directory pattern. Pain Map JSON output for E2. Remotion video generation. F3b Legal Auditor pre-mortem concept. Re-engagement Bee. Newsletter ad pitching strategy. **5 essential bee archetypes mapped to COLE.** |

**Rule:** Any bee that touches product framing, pricing, customer-facing copy, hooks, CTAs, or content positioning MUST read CUSTOMER-taxchecknow.md first. Banned phrases are non-negotiable. "Personalised" qualifier is mandatory when the word "report" appears.

**Rule:** Any session proposing new bees, new strategy, or architectural changes MUST read GOAT-BEEHIVE-ARCHITECTURE.md and USER-SKILL.md first. These define the moat. Drifting from them = drifting from the business.

### TAXCHECKNOW.COM IS THE PROVEN PRODUCT — DO NOT BREAK

taxchecknow.com is live. 47 products shipped. Product 48 (May 2026) proved the build pattern works. **The product structure (free calculator → Stripe → personalised tier → premium tier → exit-intent popups → GEO-optimized layouts) is signed-off and producing revenue.**

| Critical preservation rule | Why |
|---|---|
| **Free calculator → Stripe checkout flow** | Live and converting. Don't restructure. |
| **$67 personalised tier + $147 full system tier** | Signed-off pricing. Both sit in live Stripe products. |
| **Exit-intent popup designs** | Built and tested. Operator-approved. Visual designs locked. |
| **GEO-optimized page layouts** | The schema markup + layout structure is what AI engines cite. Changing it = breaking the moat. |
| **The "personalised report" language** | Per CUSTOMER-taxchecknow.md. Banned/acceptable framings are non-negotiable. |
| **47 product configs** | Live in production. Each has facts file, character mapping, pricing, calculator logic. **Do not refactor without understanding what each config drives.** |
| **`/stories/[slug]` route** | The canonical Gary-narrative story page on taxchecknow.com. 800-1200 words per product. FAQPage schema embedded. AI engines crawl these for citations. **THIS IS THE MOAT.** Format locked: fear number in first paragraph, primary CTA to `/[country]/check/[slug]`, secondary CTA to `/gpt/[slug]`, 3 internal links minimum, authority citation. SESSION-11-STATE.md confirms `/stories/gary-frcgw-clearance-trap` live. Per ROLLOUT.md C11. |
| **`/questions/[slug]` route** | The 5-question companion track per product. H1 = exact question (never reworded). Direct answer in paragraph 1 (50 words). 3 calculator links embedded. FAQPage schema on every page. AI engines cite these for specific question matches. SESSION-11-STATE.md confirms 5 articles live. |
| **`/gpt/[slug]` route** | GPT-specific landing pages. Signed-off route per ROLLOUT.md. Secondary CTA target from /stories/ pages. |
| **`/llms.txt` infrastructure** | Returns AI-readable index of all products + stories + questions. Bots cite this. Per ROLLOUT.md: keep under 50 priority URLs, sectioned (Products / GPT / Stories / Questions). Updated by H1 Distribution Bee on every new page. |
| **`/robots.txt` AI-welcoming policy** | All AI bots welcomed. Do not restrict GPTBot, ClaudeBot, PerplexityBot, etc. Citation moat depends on AI engines having full crawl access. |
| **H1 Distribution Bee + `lib/distribution-bee.ts`** | Tier 0 utility. Runs after every page creation. Pings IndexNow API (Bing + DuckDuckGo + Yahoo + Ecosia), Google Indexing API, updates llms.txt, logs to Supabase content_performance. **Without this, AI engines don't know new pages exist.** |

**The locked Loop Closure spec adds learning + recycling on top of the existing taxchecknow product layer. It does NOT replace, restructure, or rebuild what is already live and converting.**

When site #2 (theviabilityindex / cryptochecknow / visachecknow) launches, it COPIES the proven taxchecknow pattern — same calculator → Stripe → tier structure → popups → GEO layouts → /stories/ + /questions/ + /gpt/ routes → Distribution Bee + llms.txt — adapted for the new niche. The pattern lives in live taxchecknow code as the source of truth. **Block 7 (multi-site activation) sign-off requires Session B to audit the live taxchecknow product code and document the pattern as canonical reference before any site #2 work begins.**

### G5 STORY WRITER HAS DUAL OUTPUT — LOCK THIS

G5 produces TWO things from a single research run, NOT one:

**Output 1 — Permanent canonical content:**
- Page on taxchecknow.com at `/stories/[slug]`
- 800-1200 word Gary narrative
- Fear number in first paragraph
- FAQPage schema embedded
- Primary CTA: `/[country]/check/[slug]` (calculator)
- Secondary CTA: `/gpt/[slug]` (GPT page)
- 3 internal links minimum
- Authority citation
- Triggered by: H1 Distribution Bee → IndexNow + Google Indexing API + llms.txt update
- **This is the MOAT.** AI engines cite this. Without it, the citation flywheel breaks.

**Output 2 — Social derivative package (the path the Loop Closure spec tracks):**
- LinkedIn post (300 words, professional) — flows through J3
- X thread (7-10 tweets, chaos hook opener) — Q-station future
- Instagram caption (150 words) — M-station future
- TikTok script (60 seconds, hook in 3 words) — N-station Block 2
- Reddit comment (200 words, no hard sell) — manual
- Email newsletter section (100 words) — G7-station
- Lands in `content_jobs.output_data` → flows through J2/J3 → calendar → approval → J5 publish
- **First-comment link on every social post points back to Output 1's `/stories/[slug]` URL** — this is how social drives traffic to the moat content

**Hard rule:** When G5 fires, BOTH outputs must complete or both fail. A social package without a story page is rejected (no canonical URL for first-comment link). A story page without a social package is allowed (just less distribution that day).

**Hard rule:** When the closed loop generates V2 of a social post (Scientist creates V2), V2 still links to the SAME canonical `/stories/[slug]` URL. **The URL is permanent. The content compounds.** Story content is updated by B3 Story Refresher (Block 6.5) routine path reading K12 + J6 signals, and by truth-sync engine (Block 6.7) urgent path reading product_changes. Social derivatives recycle freely; the canonical URL never changes; the content at that URL gets continuously refined as learning accumulates. **The moat anchor is permanent. The moat content compounds. The marketing around it tests and learns.**

### Voice and Character

| File | Location | What it defines |
|---|---|---|
| **VOICE.md** | `cole-marketing/VOICE.md` (committed) | Brand voice rules, spelling conventions, the Hook Test, forbidden phrases per audience |
| **CHARACTERS.md** | `cole-marketing/CHARACTERS.md` (committed) | Full registry: Gary Mitchell (AU tax), James Hartley (UK visa), Sarah Chen (US), Priya Sharma (Nomad), Tyler Brooks (US), Aroha Tane (NZ), Fraser MacDonald (CAN), Sabrina (CMO voice), Madame (Cleaning Queen voice). Each character: tone, fear, hook pattern, vocabulary, decision rights. |
| **`_character-registry.ts`** | `soverella/lib/_character-registry.ts` | Live TypeScript registry that bees import. Maps product_key prefix → character → site_context. |

**G5 Story Writer reads CHARACTERS.md voice rules.** J2 Strategy applies character-specific hook preferences. J3 Adapter preserves character voice through LinkedIn formatting. J4 Quality Gate validates "is this Gary, not James?" Scientist's variable rotation V5 (change character framing) reads from this registry.

### Naming and Storage

| File | Location | What it defines |
|---|---|---|
| **CONTENT-NAMING-SPEC.md** | `cole-marketing/CONTENT-NAMING-SPEC.md` (commit 8e972d7) | Asset naming format `[site]-[product]-[platform]-[YYYYMMDD]-[seq][ver]`. Storage path layout. 11 platform short codes. Sequence + version letter rules. |
| **`lib/content-naming.ts`** | `soverella/lib/content-naming.ts` (commit 5bc0b56) | Helper module: generateAssetName(), parseAssetName(), buildStoragePath(), nextVersionLetter(), productKeyToShort(), platformToShort(). All Scientist V2 lineage uses nextVersionLetter() from here. |

**Scientist Bee reads `lib/content-naming.ts` for `nextVersionLetter()`.** B1 Broker uses parseAssetName() for lineage queries. All adapter bees (J3, N3, M3, L3, Q3) use generateAssetName() for output naming.

### Platform-Specific Rules

| File | Location | What it defines |
|---|---|---|
| **PLATFORM-LINKEDIN.md** | `cole-marketing/PLATFORM-LINKEDIN.md` | LinkedIn 2026 algorithm rules, post checklist, J4 quality gate criteria, first-comment-link policy, hook patterns ranked by virality |
| **PLATFORM-TIKTOK.md** | `cole-marketing/PLATFORM-TIKTOK.md` | TikTok format requirements, video specs, caption rules |
| **PLATFORM-INSTAGRAM.md, PLATFORM-YOUTUBE.md, PLATFORM-X.md, PLATFORM-THREADS.md, PLATFORM-REDDIT.md** | `cole-marketing/PLATFORM-*.md` | Per-platform rules, currently spec-only for non-LinkedIn |

**J4 Quality Gate's 10-check criteria come from PLATFORM-LINKEDIN.md.** Doctor Bee's per-platform engagement formulas reference these for threshold definitions. Per-platform short codes in CONTENT-NAMING-SPEC.md must match platforms defined here.

### Operational Playbooks

| File | Location | What it defines |
|---|---|---|
| **SABRINA-PLAYBOOK.md** | `cole-marketing/SABRINA-PLAYBOOK.md` | Per-platform warm-up rules, posting cadence, content patterns, growth best practices. The TikTok 4-week warm-up rule. The LinkedIn 1-2 week rule. |
| **`lib/_warm-up-guard.ts`** | `soverella/lib/_warm-up-guard.ts` (Block 2.0e) | Helper: getPublishMode(), assertCanPublish(), getWarmUpStatus(). Returns 'auto' or 'manual_handoff' based on platform_accounts.warm_up_completed_at. |
| **MASTER-BUILD-SHEET.md** | `cole-marketing/MASTER-BUILD-SHEET.md` | Block-by-block build sequence. This Loop Closure Sprint = Block 5. |

**N5 Publisher (and future M5/L5/Q5) reads warm-up guard.** Auto-approval policy in Section 8 references warm-up state. Sabrina's posting cadence informs `scheduled_at` defaults in I1 scheduler.

### Architectural and Strategic

| File | Location | What it defines |
|---|---|---|
| **GOAT-BEEHIVE-ARCHITECTURE.md** | `cole-marketing/GOAT-BEEHIVE-ARCHITECTURE.md` | The 4-Queens hierarchy. Hive structure. Cross-hive bee participation pattern. |
| **CHAT-A-ORIGINAL-DESIGN.md** | `cole-brain-v14/` | The original architectural design from Chat A. Reference for canonical bee placements, station alphabet (E/F/G/H/I/J/K/L/M/N/O/Q). |
| **cole-bee-dashboard.jsx** | `cole-marketing/cole-bee-dashboard.jsx` (this session) | The living dashboard — operator's view of the entire bee system. Updated when bees ship per Locked Rule #15. |

### Soverella Cleaning Queen / Madame's Hive 4

The Cleaning Queen "Madame" character (in CHARACTERS.md) coordinates Hive 4 maintenance bees. Her crew:
- **K15 Storage Sweeper** — PDFs >90d, orphan renders >30d
- **K16 Log Archiver** — agent_log >90d → cold archive
- **K17 Queue Janitor** — content_jobs in_progress >14d, video_queue stale rows
- **K21 Cost Reporter** — weekly token spend, budget alerts
- **K22 Backup Verifier** — confirms Supabase backup health

These are **out of scope for Loop Closure Sprint** (Section 11). They build in a separate later block once content accumulates and there is something to clean. But they exist in the architecture and should appear in dashboard JSX as Hive 4 bees, neon yellow per house colour scheme.

### Site Context — Where This Loop Closure Spec Fits

This spec defines:
- The closed loop that runs ON TOP of all the canonical files above
- The schema that holds site identity (site_context table)
- The brokers that move state between bees
- The cron schedule that fires bees on time

It does NOT redefine:
- Voice rules (those live in VOICE.md + CHARACTERS.md)
- Platform rules (those live in PLATFORM-*.md)
- Naming conventions (those live in CONTENT-NAMING-SPEC.md)
- Warm-up cadence (that lives in SABRINA-PLAYBOOK.md + lib/_warm-up-guard.ts)

**Bees implementing components in Section 5 MUST read the relevant canonical files first.** Failure to do so = drift = breaks audit-first discipline = creates problems that propagate across sites.

### How to read this spec

1. Read Section 0 (this section) — know what canonical files exist
2. Read Section 1 — see the core flow
3. Read Section 2 — understand the hard rules
4. Read Section 3 — understand the schema
5. Read Section 4 — understand version lineage
6. Read Section 5 — see the 12 components to build
7. Reference canonical files (Section 0) when implementing each component

---

## SECTION 1 — THE CORE FLOW

```
G5 → J2 → J3 → CALENDAR (draft) → APPROVAL → J5 publish
                                                  ↓
                                          J7 Doctor (2h, 24h, 7d)
                                                  ↓
                                       classify: winner / mid / loser / dead
                                                  ↓
                          ┌───────────────────────┴───────────────────────┐
                          │                                               │
                       WINNER                                          LOSER/DEAD
                          ↓                                               ↓
                   K12 Pattern Extractor                          J8 Scientist
                   (Sunday, per-site rotation)                    (every 6h)
                          ↓                                               ↓
                   lessons_learned (site_id, scope)             content_assets V2
                          ↓                                               ↓
                   B2 Broker (Monday)                            B1 Broker (every 15 min)
                          ↓                                               ↓
                   hook_matrix.composite_score                  campaign_calendar V2
                                                                          ↓
                                                                    APPROVAL → J5 publish
                                                                          ↓
                                                                    (loop continues)
```

---

## SECTION 2 — HARD RULES (NEVER BREAK)

1. **J5 must NEVER publish if `approval_status NOT IN ('approved', 'auto_approved')`.** Publishing without approval is a critical bug.

2. **J8 (Scientist) must change exactly ONE variable per V2.** Hook OR format OR CTA OR character. Never multiple. Variable rotation per version (V2 hook → V3 format → V4 CTA → V5 character → V6 stop/park).

3. **B1 broker is the ONLY way V2s reach the calendar.** Scientist does NOT write directly to campaign_calendar. Scientist writes to content_assets + content_jobs only. B1 brokers the handoff.

4. **B2 broker is the ONLY way lessons modify behaviour.** B2 updates `hook_matrix.composite_score` ONLY. Never modifies prompts. Never modifies code. Data-only mutation.

5. **Every multi-site table has `site_id` AND RLS enabled.** No exceptions. AU lessons cannot leak into UK learning.

6. **K12 segments by `site_id` strictly.** Cross-site lesson promotion only when `scope = 'platform_global'` AND confidence ≥ 0.85 AND verified across ≥ 2 sites independently.

7. **Every step writes to `agent_log`.** No silent operations. Audit trail is mandatory.

8. **No row overwriting.** All version mutations create new rows. Originals preserved as historical record.

9. **Cron functions are Vercel API routes.** NOT Supabase Edge Functions. Existing pattern (commit 0122eaa shipped 9 of these).

10. **Auto-approval defaults to FALSE per site.** Earned by performance data, not assumed.

---

## SECTION 3 — DATABASE SCHEMA (LOCKED)

### Table: `site_context`

New table. Stores the identity of each site/brand.

```sql
CREATE TABLE site_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id TEXT UNIQUE NOT NULL,
  brand_name TEXT NOT NULL,
  default_character TEXT NOT NULL,
  region TEXT NOT NULL,
  language_style TEXT NOT NULL,
  tone_rules JSONB,
  forbidden_phrases TEXT[],
  brand_colors JSONB,
  primary_cta TEXT,
  linkedin_account_id TEXT,
  warm_up_status TEXT DEFAULT 'pending',
  approval_required BOOLEAN DEFAULT TRUE,
  auto_approval_enabled BOOLEAN DEFAULT FALSE,
  auto_approval_min_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY site_context_per_site ON site_context FOR ALL
  USING (site_id = current_setting('app.current_site', true))
  WITH CHECK (site_id = current_setting('app.current_site', true));

CREATE POLICY site_context_service_role ON site_context FOR ALL
  USING (true) WITH CHECK (true);
```

### Table: `content_jobs` (extend existing)

```sql
ALTER TABLE content_jobs 
  ADD COLUMN IF NOT EXISTS parent_job_id UUID REFERENCES content_jobs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS version_letter TEXT;

ALTER TABLE content_jobs
  ADD CONSTRAINT content_jobs_version_letter_check
  CHECK (version_letter IS NULL OR version_letter ~ '^[a-z]$');
```

### Table: `campaign_calendar` (upgrade existing)

```sql
ALTER TABLE campaign_calendar
  ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS approved_by TEXT,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS parent_calendar_id UUID REFERENCES campaign_calendar(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS final_post_text TEXT,
  ADD COLUMN IF NOT EXISTS first_comment TEXT;

ALTER TABLE campaign_calendar
  ADD CONSTRAINT campaign_calendar_approval_status_check
  CHECK (approval_status IN ('pending', 'approved', 'rejected', 'auto_approved'));

ALTER TABLE campaign_calendar
  ADD CONSTRAINT campaign_calendar_status_check
  CHECK (status IN ('draft', 'approved', 'scheduled', 'published', 'rejected'));

CREATE INDEX IF NOT EXISTS idx_calendar_site_status 
  ON campaign_calendar (site_id, status, scheduled_at);

CREATE INDEX IF NOT EXISTS idx_calendar_parent
  ON campaign_calendar (parent_calendar_id) WHERE parent_calendar_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_calendar_pending_approval
  ON campaign_calendar (approval_status, scheduled_at) WHERE approval_status = 'pending';

ALTER TABLE campaign_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY campaign_calendar_per_site ON campaign_calendar FOR ALL
  USING (site_id = current_setting('app.current_site', true))
  WITH CHECK (site_id = current_setting('app.current_site', true));

CREATE POLICY campaign_calendar_service_role ON campaign_calendar FOR ALL
  USING (true) WITH CHECK (true);
```

### Table: `content_performance` (extend existing)

```sql
ALTER TABLE content_performance
  ADD COLUMN IF NOT EXISTS site_id TEXT,
  ADD COLUMN IF NOT EXISTS classification TEXT,
  ADD COLUMN IF NOT EXISTS engagement_score FLOAT;

ALTER TABLE content_performance
  ADD CONSTRAINT content_performance_classification_check
  CHECK (classification IS NULL OR classification IN ('winner', 'mid', 'loser', 'dead'));

CREATE INDEX IF NOT EXISTS idx_performance_site_classification
  ON content_performance (site_id, classification);

-- Backfill site_id from content_jobs join
UPDATE content_performance cp
SET site_id = cj.site_id
FROM content_jobs cj
WHERE cp.content_job_id = cj.id AND cp.site_id IS NULL;

-- After backfill, lock site_id NOT NULL
ALTER TABLE content_performance ALTER COLUMN site_id SET NOT NULL;

ALTER TABLE content_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY content_performance_per_site ON content_performance FOR ALL
  USING (site_id = current_setting('app.current_site', true))
  WITH CHECK (site_id = current_setting('app.current_site', true));

CREATE POLICY content_performance_service_role ON content_performance FOR ALL
  USING (true) WITH CHECK (true);
```

### Table: `hook_matrix` (extend existing — add updated_at if missing)

```sql
ALTER TABLE hook_matrix
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- composite_score already exists
-- site already exists
```

### Table: `lessons_learned` (extend existing)

```sql
ALTER TABLE lessons_learned
  ADD COLUMN IF NOT EXISTS scope TEXT NOT NULL DEFAULT 'site_specific',
  ADD COLUMN IF NOT EXISTS applied BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS applied_at TIMESTAMPTZ;

ALTER TABLE lessons_learned
  ADD CONSTRAINT lessons_learned_scope_check
  CHECK (scope IN ('site_specific', 'domain_specific', 'platform_global'));

CREATE INDEX IF NOT EXISTS idx_lessons_unapplied_high_confidence
  ON lessons_learned (site_id, confidence_score) 
  WHERE applied = FALSE AND confidence_score >= 0.85;
```

### Table: `content_assets` (already shipped May 4 — Block 2.0b)

No changes. Already supports V2 lineage via `parent_asset_id`. Already has `version_letter`.

---

## SECTION 4 — VERSION LINEAGE — THREE-TABLE LINK

V2 lineage is tracked across three tables consistently:

| Table | Field | Purpose |
|---|---|---|
| `content_assets` | `parent_asset_id` | Asset-level lineage (already exists from Block 2.0b) |
| `content_jobs` | `parent_job_id`, `version`, `version_letter` | Job-level lineage |
| `campaign_calendar` | `parent_calendar_id`, `version` | Schedule-level lineage |

**Why all three:** Different bees query different tables. Doctor reads content_performance (joined to content_jobs). Madame K15 cleans content_assets. Operator views campaign_calendar in dashboard. Each needs its own lineage trail.

**Rule:** When Scientist creates a V2, all three lineage links must be set. B1 broker enforces calendar lineage. Scientist sets the other two.

---

## SECTION 5 — THE 12 COMPONENTS (BUILD ORDER LOCKED)

### Component 1 — Schema migrations

Run all SQL in Section 3. Verify with check queries:
- All new columns exist
- All RLS policies active
- All indexes created
- All constraints active
- 0 rows of bad data (constraints don't fail on existing rows)

**Effort:** ~45 min. Single migration file.

### Component 2 — Approval UI (Soverella `/dashboard/calendar`)

Build at `app/dashboard/calendar/page.tsx`. Renders campaign_calendar rows grouped by date, color-coded by site, showing:
- Site logo + colour
- Product name
- Character
- Scheduled time
- Post preview (final_post_text)
- First comment (first_comment)
- Approval buttons: [✓ Approve] [✎ Edit] [✗ Reject (with reason dropdown)] [Reschedule] [Pause]
- Version badge (V1, V2, V3) with diff link to parent if version > 1

**Effort:** ~3 hr. New route + 4 server actions (approve, reject, edit, reschedule).

### Component 3 — J5 publish gating

Modify existing `/api/cron/scheduled-publisher` to require:
```
WHERE status = 'approved' 
AND approval_status IN ('approved', 'auto_approved')
AND scheduled_at <= now()
```

**Effort:** ~30 min. Single query change + tests.

### Component 4 — Zernio Analytics restoration (operator action)

Operator subscribes to Zernio Analytics add-on ($34/mo). Provides API key as Vercel env var `ZERNIO_ANALYTICS_API_KEY`.

**Effort:** ~10 min operator. ~20 min code (uncomment metric ingestion, verify webhook).

### Component 5 — Doctor Bee cron (J7 / `K-Analytics-1`)

Build `/api/cron/doctor-pulse` route. Three pulses:
- Every 2 hours: fast-fail check on posts <2h old (impressions == 0 → flag immediately)
- Every 6 hours: 24h pulse (posts 20-28h old → assign initial classification)
- Daily: 7d pulse (posts 6-8d old → final classification, write `scientist_wake` event)

Per-platform engagement formula (LinkedIn formula in initial build):
```
engagement_score = (comments * 5) + (shares * 4) + (reactions * 2) + (clicks * 3) + (saves * 4)
```

Classification thresholds (LinkedIn):
- WINNER: engagement_score > 50 + clicks > 5
- MID: engagement_score > 20
- LOSER: engagement_score < 20 + clicks == 0 (24h)
- DEAD: impressions < 50 AND age > 7d

When LOSER or DEAD, write to `agent_log`:
```
event = 'scientist_wake'
payload = { content_job_id, classification, reason }
```

**Effort:** ~1 hr.

### Component 6 — Scientist Bee build (J8 / `K-Analytics-2`)

Build `/api/cron/scientist` route. Fires every 6 hours.

Reads `agent_log WHERE event = 'scientist_wake' AND payload.processed IS NULL`.

For each wake event:
1. Read parent post (V1 or V_n) — content_jobs + content_performance
2. Determine variable to change (variable rotation):
   - Check parent's lineage history
   - V2 = change hook (default first try)
   - V3 = change format (text → carousel, etc.)
   - V4 = change CTA
   - V5 = change character framing
   - V6+ = STOP. Mark parent as parked, write agent_log.
3. Generate V2 content using Sonnet (cost ~$0.05 per V2):
   - Read site_context for the post
   - Read parent's content_assets row
   - Apply ONE-variable change
   - Write new content (story → strategy → adapted post all in one)
4. Write three rows in single transaction:
   - `content_assets`: new row, `parent_asset_id` = parent's asset_id, `version_letter` = next letter
   - `content_jobs`: new row, `parent_job_id` = parent's job_id, `version` = parent.version + 1, `version_letter` = next, `status` = 'ready_for_calendar'
   - **DOES NOT write campaign_calendar** — B1 broker handles that
5. Mark agent_log entry as processed

**Effort:** ~2.5 hr.

### Component 7 — B1 Broker (V2 → calendar)

Build `/api/cron/b1-v2-broker` route. Fires every 15 min.

```sql
SELECT cj.* FROM content_jobs cj
WHERE cj.version > 1
  AND cj.status = 'ready_for_calendar'
  AND NOT EXISTS (
    SELECT 1 FROM campaign_calendar cc 
    WHERE cc.content_job_id = cj.id
  )
LIMIT 100;
```

For each row:
1. Find parent's calendar_id via parent_job_id → calendar row
2. INSERT into campaign_calendar:
   - `status` = 'draft'
   - `approval_status` = 'pending'
   - `version` = cj.version
   - `parent_calendar_id` = parent calendar row
   - `scheduled_at` = parent.scheduled_at + 14 days (cooling-off window)
   - `site_id` = cj.site_id
   - `final_post_text` = cj.output_data.linkedin_adapted.post1_text
   - `first_comment` = cj.output_data.linkedin_adapted.post1_first_comment
3. Update content_jobs.status = 'in_calendar'
4. Log to agent_log

Idempotent (NOT EXISTS check prevents double-insert).

**Effort:** ~1 hr.

### Component 8 — K12 Lessons Learned cron (per-site rotation)

Wire existing K12 (commit 6dc7e6c) to fire on Sunday 8am AWST.

**Per-site rotation logic:** At N sites, fire up to 7 sites per Sunday. Each Sunday picks the 7 sites with the oldest `last_synthesis_at` field on site_context.

For each picked site:
1. Read 7 days of content_performance + content_jobs WHERE site_id = picked_site
2. Detect 5 pattern types: format / hook / timing / failure / winning
3. Apply confidence ladder: 3 posts=0.55, 5 posts=0.70, 7 posts=0.85+
4. Determine `scope`:
   - Pattern only seen in this site → `site_specific`
   - Pattern verified in ≥2 sites in same domain → `domain_specific`
   - Pattern verified across all sites of platform → `platform_global`
5. Write to `lessons_learned` (site_id set, scope set, applied=false)
6. Update site_context.last_synthesis_at = now()

**DOES NOT update hook_matrix** — B2 broker handles that.

**Effort:** ~30 min (just cron wiring + per-site rotation).

### Component 9 — B2 Broker (lessons → hook_matrix weights)

Build `/api/cron/b2-behaviour-modifier` route. Fires Monday 4am AWST (after K12 finishes Sunday).

```sql
SELECT * FROM lessons_learned
WHERE applied = FALSE
AND confidence_score >= 0.85
ORDER BY confidence_score DESC
LIMIT 100;
```

For each lesson:
1. Identify affected hooks in hook_matrix where:
   - `site_id` matches lesson.site_id (for site_specific scope)
   - OR `site_id` IN (sites where domain matches) (for domain_specific scope)
   - OR all sites (for platform_global scope)
2. Update `hook_matrix.composite_score` += lesson.confidence_score * 0.1
   - Cap composite_score at 1.0
   - Floor at 0.0
3. Mark lesson.applied = TRUE, applied_at = now()
4. Log to agent_log

**Idempotent:** applied=true prevents double-application.

**DOES NOT modify prompts.** Data-only mutation.

**Effort:** ~1 hr.

### Component 10 — End-to-end test

Manual test script that:
1. Inserts a fake low-performing post (impressions=10, engagement_score=5)
2. Triggers Doctor manually
3. Verifies scientist_wake event written
4. Triggers Scientist manually
5. Verifies V2 created in content_assets + content_jobs
6. Triggers B1 broker manually
7. Verifies V2 in campaign_calendar with parent_calendar_id set
8. Verifies V2 awaits approval (approval_status='pending')
9. Operator approves V2 in dashboard
10. Triggers J5 publisher manually
11. Verifies V2 publishes
12. Verifies content_performance row written for V2 with parent_post linkage

**Effort:** ~30 min test script + 30 min running it.

### Component 11 — Dashboard JSX update

Update `cole-bee-dashboard.jsx` to show:
- Closed loop status (which components are LIVE vs PENDING)
- V2 cycle metrics (V2 generated this week, approved, published, classified)
- Per-site lesson counts
- Auto-approval status per site

**Effort:** ~30 min.

### Component 12 — Multi-site readiness audit

Per Locked Rule #5 + this spec: verify EVERY existing bee passes site_id through. Audit:
- G5 reads site_id from content_jobs row, uses site_context for voice/tone
- J2 reads site_id, queries hook_matrix WHERE site_id matches
- J3 reads site_id, applies site-specific brand colours/CTA
- J4 reads site_id, applies site-specific quality checks
- I1 reads site_id, writes site_id to campaign_calendar
- J5 reads site_id, picks correct platform_accounts row

**Effort:** ~1 hr audit + ~1-2 hr fix any gaps found.

---

## SECTION 6 — CRON SCHEDULE (LOCKED)

```
/api/cron/scheduled-publisher     every 15 min  (existing — J5)
/api/cron/i1-scheduler            every 15 min  (existing)
/api/cron/g5-story                daily 6am AWST (existing)
/api/cron/j2-strategy             daily 7am AWST (existing)
/api/cron/j3-adapter              daily 8:15am AWST (existing)

NEW:
/api/cron/doctor-pulse-2h         every 2 hr
/api/cron/doctor-pulse-24h        every 6 hr
/api/cron/doctor-pulse-7d         daily 4am AWST
/api/cron/scientist               every 6 hr
/api/cron/b1-v2-broker            every 15 min
/api/cron/k12-pattern             Sunday 8am AWST
/api/cron/b2-behaviour-modifier   Monday 4am AWST
```

**Total Vercel cron count:** 11 routes. Verify Vercel plan supports this.

---

## SECTION 7 — REJECTION REASON TAXONOMY (LOCKED)

When operator rejects a calendar entry, `rejection_reason` MUST be one of:

```
wrong_voice
weak_hook
wrong_cta
too_generic
too_aggressive
off_brand
legally_risky
wrong_product_angle
wrong_audience
bad_timing
operator_preference
```

Why: Scientist (J8) reads rejection_reason to determine which variable to change in V2. Free-text rejection makes Scientist guess. Enum makes Scientist deterministic.

---

## SECTION 8 — AUTO-APPROVAL POLICY (LOCKED)

A post auto-approves if ALL of the following:

```sql
site_context.auto_approval_enabled = TRUE
AND J4 quality gate result = 'APPROVED'
AND no compliance flags raised
AND (selected_hook.composite_score >= site_context.auto_approval_min_score)
AND platform_account.warm_up_completed_at IS NOT NULL
AND platform_account.warm_up_completed_at <= now()
AND parent post (if V2+) was approved by operator
AND no posts in last 24h on this account were rejected
```

**Default state at launch:** auto_approval_enabled = FALSE for all sites.

**Earned activation per site:**
- 30+ posts on the site
- ≥80% operator approval rate
- ≥1 winner classification in last 7 days
- Operator manually flips auto_approval_enabled = TRUE

**Site can be revoked** automatically if rejection rate > 20% over rolling 7 days.

---

## SECTION 9 — DONE CONDITIONS

The closed loop is complete when:

1. ✅ Operator can approve/reject/edit posts in `/dashboard/calendar`
2. ✅ J5 publishes ONLY approved posts
3. ✅ Doctor classifies posts at 2h / 24h / 7d windows automatically
4. ✅ Losers automatically generate V2 within 6 hours
5. ✅ V2s appear in calendar within 15 min of generation
6. ✅ V2s require operator approval (or pass auto-approval gate if enabled)
7. ✅ Winners trigger pattern detection by K12 weekly per site
8. ✅ Patterns ≥0.85 confidence update hook_matrix.composite_score automatically
9. ✅ Hook selection in J2 reads composite_score and prefers higher-scored hooks
10. ✅ End-to-end test passes (Component 10)
11. ✅ Multi-site readiness audit passes (Component 12)
12. ✅ Dashboard JSX shows closed-loop status as LIVE

When all 12 done conditions met: Loop Closure Sprint signed off.

---

## SECTION 10 — MULTI-SITE PUB TEST RESULTS

This spec was audited against 50-site / 50-niche concurrent operation:

✅ **site_id everywhere** — no contamination possible
✅ **RLS on all multi-site tables** — operator can't accidentally cross-query
✅ **K12 per-site rotation** — won't timeout at scale (7 sites/Sunday × 7 weeks = full rotation)
✅ **B1 / B2 brokers separate** — failure isolation, retry capability, atomic semantics
✅ **Auto-approval policy per-site** — sites earn trust independently
✅ **lessons_learned scope field** — domain/platform-global learning controlled
✅ **Indexes on (site_id, status, scheduled_at)** — query performance at 50,000+ row volumes
✅ **No prompt mutation** — system stays stable across sites

**Cost projection at 50 sites × 10 products × 5 platforms × 1 post/day:**
- Cron invocations: ~17,000/month — trivial
- Sonnet calls (Scientist): ~250 V2/day × $0.05 = $12.50/day = $375/month
- K12 weekly synthesis: 7 sites × $0.20 = $1.40/week = $5.60/month
- Zernio Analytics: $34/month per LinkedIn account × 50 = $1,700/month
- **Total marginal cost at 50 sites: ~$2,100/month** (most of it Zernio)
- Per-site cost: ~$42/month — sustainable

---

## SECTION 11 — WHAT THIS SPEC DOES NOT COVER

Out of scope for Loop Closure Sprint. Future blocks listed below in dependency-correct sequence.

### IMMEDIATELY OUT OF SCOPE (do not build in Block 5)

❌ **Auto niche discovery (O1/O2/O3)** — operator picks niches manually. Block 8+.
❌ **Auto product build (F1/F2/F3 automation)** — Lovable + operator builds calculators. Block 9+.
❌ **Funnel optimization (S1/S2/S3 conversion bees)** — funnel is static. Block 10+.
❌ **Cross-platform replication (M / L / Q stations)** — LinkedIn-first, others Block 3.
❌ **A1 Allocator (resource reallocation across products)** — operator decides what to scale. Block 11+.
❌ **K13 Pattern Applier with prompt mutation** — explicitly rejected. B2 only mutates data, never prompts.

---

### KNOWN ARCHITECTURAL EVOLUTION (sequenced, do not parallelise)

The COLE system evolves through four layers. **Each layer requires the previous layer to be operational and producing data before the next layer can be designed correctly.** Building them in parallel = stall. Building them out of sequence = wasted work.

#### Layer 1 — Loop Closure (THIS SPEC, Block 5, ~12 hr)

The closed learning loop:
- Approval gate before publish
- Publish
- Measure (Doctor 2h/24h/7d pulses)
- Recycle (Scientist V2 with variable rotation)
- Learn (K12 patterns per-site rotation)
- Apply (B2 broker → hook_matrix.composite_score)

**Done condition:** the 12 components from Section 5 ship, the 12 done conditions from Section 9 verify.

**Output for next layer:** K12 patterns + J6 research_questions accumulating in canonical tables. Without this data, Layer 2 has nothing to refresh stories with.

#### Layer 2 — Story Compounding (Block 6.5, ~6 hr)

`/stories/[slug]` pages become **living intelligence pages** that compound learning over time.

- **B3 Story Refresher Broker** — reads K12 high-confidence patterns + J6 research_questions monthly
- **`story_revisions` table** — preserves every story version (rollback path)
- **B3 follows existing B1/B2 broker pattern** — separate cron route, idempotent, retry-capable
- **URL preservation rule (locked in Section 0)** — slug never changes, content compounds
- **Append/refine, not rewrite** — new patterns add to story, never replace it wholesale
- **Operator approval gate** — same `/dashboard/calendar` UI, V1 vs V2 diff view
- **"Last updated" + "Change reason" blocks visible on page** — boosts AI engine trust signals
- **Monthly batch cadence default** — prevents Google penalty on high-frequency edits
- **dateModified schema markup updated** — signals freshness to crawlers
- **H1 Distribution Bee re-pings** — IndexNow + Google Indexing API + llms.txt rebuild

**Done condition:** monthly B3 cron fires, proposes story refreshes, operator approves at least one, story page renders new content at same URL, AI engines re-crawl successfully.

**Output for next layer:** routine refresh path proven. Operator approval workflow validated for content updates. Schema patterns stable. Foundation for urgent-path additions in Layer 3.

#### Layer 3 — Truth-Sync Engine (Block 6.7, ~10-12 hr)

The architectural pattern: **a system that keeps reality, product, and marketing in sync.** This is how Stripe, Shopify, and serious fintech platforms operate. One detection event cascades to all affected systems with appropriate approval rigor per queue.

**New schema:**
- `product_changes` table — canonical record of every detected change
  - `affected_entities[]` — array routing (calculator / story / social / email)
  - `priority` — manual V1: low / medium / high / critical
  - `batch_lane` — critical (immediate) / routine (batched)
  - `batch_id` — groups routine updates for SEO-friendly Tuesday 9am AWST cadence
  - `source` — operator / RSS / scraper (operator V1, automation V2+)
- `product_versions` table — versioned product snapshots with rollback
  - `parent_version_id` — lineage (reuses content_assets pattern)
  - `config_snapshot` JSONB — calculator config at this version
  - `story_snapshot` — story content at this version
  - `status` — draft / validated / active / rolled_back
  - One source of truth: only one row per product_key has status='active'

**Cascade flow:**
- Operator enters law/product change in dashboard
- product_changes row created with priority + affected_entities
- Critical priority: bypasses batching, fans out immediately
- Routine priority: batched weekly Tuesday 9am AWST
- Fan-out reads affected_entities, pings ONLY relevant queues:
  - **Calculator queue** (F1/F2 wrapper) — creates product_versions row, F3+F3b validates, operator approves activation
  - **Story queue** (B3 urgent path) — proposes story update via product_changes trigger (not just K12/J6 routine)
  - **Social queue** (J2_campaign_mode — NEW function) — generates update post + urgency post + comparison post (3-5 posts per change)
  - **Email queue** — DEFERRED to Layer 4 (G7 unbuilt)

**Hard rules:**
- Critical priority bypasses batching, fires immediately
- Routine priority batches Tuesday 9am AWST default
- Every config update creates new product_versions row before activation
- Rollback always available (operator clicks rollback on dashboard → previous version becomes active)
- Operator approval per queue (no global "approve all")
- B3 routine path (K12/J6 monthly) and urgent path (product_changes immediate) are distinct
- J2_campaign_mode is a NEW function, separate from regular J2 strategy
- **Manual operator entry is V1.** No automated detection. Legal accuracy non-negotiable.

**Done condition:** operator enters a manual law change, all four cascade queues fire correctly (or skip per affected_entities), each queue gates on approval, rollback works end-to-end, batch_lane segregation respected.

**Output for next layer:** truth-sync workflow proven with manual entry. Operator approval patterns validated for high-stakes changes. Foundation for automated detection layer.

#### Layer 4 — Automation Layer (Block 9+, deferred)

Once Layers 1-3 prove out manually, automate the high-leverage edges:

- **RSS-based law monitoring** — ATO + HMRC + IRS feeds + Tax Institute + CCH alerts → auto-create product_changes draft → operator confirms → cascade fires
- **Email pipeline (G7)** — segmentation by product usage + country + risk level → email queue activates in truth-sync cascade
- **Computed priority scoring** — formula: urgency_weight + traffic_impact (GA4) + revenue_impact (Stripe) + compliance_risk (F3b)
- **F1/F2 calculator automation** — currently Lovable + operator. Block 9+ automates calculator generation from ProductConfig.
- **E1/E2/E3/E4 research swarm** — auto niche/competitor/customer-psychology research replacing manual operator research

**Why deferred:** automation removes operator from legal-accuracy chain. For tax/visa products, that's a moat-killer if false positives ship. Manual workflows must prove out at scale first. Automation amplifies what's already working — never replaces what hasn't been validated.

---

### SCOPE DISCIPLINE — DO NOT VIOLATE

**Each layer is a separate sprint with its own done conditions. Do not:**

- ❌ Build B3 Story Refresher in Block 5 (no data to refresh with yet — K12 needs to accumulate first)
- ❌ Build product_changes / cascade logic in Block 5 or 6.5 (Layer 2 must operate before Layer 3 designs)
- ❌ Build email cascade or RSS detection in Block 6.7 (Layer 3 manual workflow must prove out first)
- ❌ Mix layer concerns in single component (calculator + story + social cascade is Block 6.7, not Block 5)
- ❌ Add Supabase Edge Function triggers to enforce cascades (we use explicit Vercel cron + observable orchestration; database triggers create hidden execution paths)

**Each layer ships, operates for ~2-4 weeks generating real data, then the next layer is DESIGNED based on what the previous layer's data revealed.** Layer N+1 is not built before Layer N produces signal.

This discipline is the difference between **a system that compounds** and **a system that stalls under its own weight.**

---

### THE LONG-TERM POSITIONING

What COLE becomes after all four layers ship:

> **A self-updating business engine.**
> Detects truth changes (law / market / customer) → updates products → updates content → updates marketing → updates customers. Citation moat compounds. Knowledge accumulates. Operator orchestrates strategic decisions; bees execute operational truth-sync.

This is the architectural North Star. Every block decision should advance toward it. **No block should be built that doesn't fit this vision.**

---

## SECTION 12 — CHANGE CONTROL

This spec is LOCKED at version 1.0.

Future changes require:
1. Operator explicit approval
2. Drift incident logged with justification
3. Master sheet updated
4. This spec re-versioned (1.1, 1.2, etc.)
5. All sites' implementations updated to match

**Future Claude chats:** read this spec FIRST before proposing alternatives. Do not re-derive architecture from brain v14 if it conflicts with this spec. This spec wins.

If this spec appears wrong or incomplete: log as drift incident. Do not implement without operator approval.

---

## SECTION 13 — COMMIT TRAIL

When Loop Closure Sprint ships, expect commits in this order:

```
feat(schema): site_context table + campaign_calendar approval upgrade + content_performance multi-site (Loop 1)
feat(j5-gating): publish requires approval_status=approved (Loop 2)
feat(zernio-analytics): restore analytics ingestion (Loop 3)
feat(doctor-bee): cron + 2h/24h/7d pulses + classification (Loop 4)
feat(scientist-bee): V2 generator with variable rotation (Loop 5)
feat(b1-broker): V2 → calendar handoff (Loop 6)
feat(k12-cron): per-site rotation Sunday synthesis (Loop 7)
feat(b2-broker): lessons → hook_matrix.composite_score (Loop 8)
feat(approval-ui): /dashboard/calendar with approve/reject/edit (Loop 9)
test(loop-closure): end-to-end V2 cycle verified (Loop 10)
docs(loop-closure): manuals + dashboard JSX update (Loop 11)
```

11 commits. ~12 hours focused build.

---

## SECTION 14 — WHO READS THIS

- **Operator:** to verify the system is being built per spec
- **Future Claude chats:** as canonical source of truth before proposing changes
- **Session B:** as the build target for the Loop Closure Sprint
- **Future engineers (humans or AI):** to understand why the system was designed this way

If you're reading this and considering changing the architecture: stop. Read it again. Then read it once more. Then ask the operator before proposing changes.

This spec is the result of three days of careful architectural discussion, two ChatGPT audits, and one explicit pub test against 50-site scale. It is not a draft.

---

**END OF LOCKED SPEC v1.0**
