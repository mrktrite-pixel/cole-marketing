# Governance Queen — Design (Day 13)

**Status:** First draft for critique. Designed backwards from the locked architecture (COLE-ARCHITECTURE-LOCKED-DAY13.md, Principle 7).
**Scope:** Per-hive Governance Queen (e.g. Tax Hive's Governance Queen).
**Method:** Outcome → Output → Bees → Sources. Bees fall out of requirements.

---

## §1 — The locked outcome

From the architecture document, Governance Queen's one-line job:

> "Keep this hive running cleanly."

She is the operator-facing queen. She doesn't produce customer-facing content. She produces operator visibility, infrastructure health, and the hive's dashboard.

Her job in CO·LE is **Operates**. Without her, the other five queens cannot reliably run because their infrastructure (DB, secrets, costs, crons) decays. With her, the operator sees the hive's health in one place and can act before things break.

She owns:
- DB hygiene (table sizes, vacuum, indexes, archival policies)
- Cron orchestration (which jobs run when, dependencies, retries)
- Secret rotation tracking (CRON_SECRET, OAuth tokens, API keys aging out)
- Cost monitoring (LLM API spend, hosting, third-party services)
- Audit trail (who changed what, when, what was approved)
- Quota management (rate-limit headroom, free-tier consumption)
- Backup verification (did the last backup succeed; is it restorable)
- The hive's operator dashboard (renders the per-hive Monitor view)
- Hive summary published to Apiary's global_hive_summaries

She does NOT do:
- Demand detection (Strategic owns)
- Product building (Production owns)
- Distribution (Distribution owns)
- Customer relationships (Concierge owns)
- Performance diagnosis (Adaptive owns) — though she displays the metrics Adaptive produces

She is the **plumber + dashboard renderer + auditor** rolled into one.

---

## §2 — Inputs and outputs

### Inputs

- This hive's metrics table (`{hive}_metrics`) — written by all queens
- This hive's DB system tables (`pg_stat_user_tables`, etc.) for size/health
- Cron infrastructure (Vercel cron logs, queue depths)
- Secret store (Vercel env vars, etc. — with ages)
- LLM API billing endpoints (Gemini, Anthropic, OpenAI, Perplexity) for cost
- Hosting/infrastructure bills (Vercel, Supabase, Resend, etc.)
- Operator action history (approvals, rejections, manual overrides)
- Backup status from whatever backup mechanism is in place

### Outputs

#### Output 1 — Hive operator dashboard (rendered)

The per-hive Monitor view (Level 2 in the architecture):

```
┌─────────────────────────────────────────────────────────────┐
│  TAX HIVE (taxchecknow)                                      │
│                                                               │
│  CO·LE HEALTH                                                │
│  CONVERTS  OPERATES  LEARNS  EXECUTES                       │
│   🟢        🟡        🟢       🟢                            │
│                                                               │
│  Six queens (clickable cards):                               │
│  Strategic  Production  Distribution                         │
│  Concierge  Adaptive    Governance                           │
│                                                               │
│  ALERTS                                                       │
│   🟡 Calendar table size > 80% of soft limit                 │
│   🟢 All other infrastructure healthy                        │
│                                                               │
│  COSTS (last 30 days)                                        │
│   LLM APIs:    $X                                            │
│   Hosting:     $X                                            │
│   Email:       $X                                            │
│   Total:       $X                                            │
└─────────────────────────────────────────────────────────────┘
```

#### Output 2 — Hive summary to Apiary

Published to `global_hive_summaries` (cross-hive table read by Orchestrator):

```
global_hive_summaries
─────────────────────────────

hive_name              e.g. "tax"
hive_url               e.g. "taxchecknow.com"
last_refreshed_at      timestamp

cole_health
  converts             {status: green|yellow|red, value, trend}
  operates             {status, value, trend}
  learns               {status, value, trend}
  executes             {status, value, trend}

financials_30d
  revenue              numeric
  cost                 numeric
  profit               numeric
  cost_per_product     numeric
  arpu                 numeric

operational
  active_products      int
  builds_in_flight     int
  approvals_pending    int
  alerts_open          int
  critical_alerts      int

infrastructure
  db_size_gb           numeric
  queue_depth          int
  cron_health          enum
  secret_aging_count   int
  backup_last_success  timestamp
```

#### Output 3 — `operator_alerts` table (per-hive)

Alerts the operator should see, surfaced via the dashboard:

```
operator_alerts
───────────────

alert_id              uuid
created_at            timestamp
severity              info | yellow | red
category              cost | quota | infra | secret | backup | audit
message               human-readable
context               JSON with details + recommended actions
status                open | acknowledged | resolved | dismissed
acknowledged_at       timestamp
resolved_at           timestamp
```

#### Output 4 — `audit_log` (per-hive)

Append-only record of operator-visible actions:

```
audit_log
─────────

audit_id              uuid
timestamp
actor                 operator | queen_name | system
action                e.g. "approved_handoff", "rotated_secret",
                            "deprecated_product"
target                e.g. "handoff_id=abc-123"
reason                optional free-text
before                optional JSON snapshot
after                 optional JSON snapshot
```

#### Output 5 — Janitorial work logs

Append-only record of what got archived, vacuumed, cleaned up:

```
cleanup_log
───────────

cleanup_id            uuid
timestamp
type                  archive | vacuum | purge | rotate
target_table          which table
rows_affected         int
disk_freed_mb         numeric
duration_ms           int
status                success | failure
```

---

## §3 — The bees that produce these outputs

```
Bee 1: Infrastructure Pinger    →  monitors infra health (DB, crons, queues,
                                    backups), produces alerts

Bee 2: Cost Watcher             →  reads billing endpoints, tracks spend by
                                    queen and by source, produces cost alerts

Bee 3: Secret Sentinel          →  tracks secret ages, OAuth refresh windows,
                                    API key expirations

Bee 4: Janitor                  →  scheduled cleanup: archival, vacuum, purge,
                                    log rotation

Bee 5: Audit Recorder           →  writes audit_log entries for operator
                                    actions and queen state changes

Bee 6: Dashboard Renderer       →  composes the hive's operator dashboard view
                                    from all the above

Bee 7: Summary Publisher        →  writes hive summary to global_hive_summaries
                                    for Apiary
```

**Seven bees.** Each has a narrow, named job. The Janitor is intentionally separate from the Infrastructure Pinger because monitoring (read-only, frequent) is a different operation from cleanup (write, less frequent, more consequential).

---

## §4 — Bee 1: Infrastructure Pinger

### Purpose
Continuously check that infrastructure is healthy. Emit alerts when something isn't.

### Method (per check)

#### Check 1 — Table sizes
- Read `pg_total_relation_size()` for each major table
- Compare against configured soft limits (per table)
- **Soft limit hit (>80% of cap):** yellow alert, suggest archival
- **Hard limit hit (>100%):** red alert, recommend Janitor run immediately
- Cadence: every 6 hours

#### Check 2 — Queue depths
- Count of unprocessed rows in event_bus, email_queue, build_queue, etc.
- **Healthy:** < N items, oldest item < M hours
- **Yellow:** queue building (>2x healthy depth or oldest item >M hours)
- **Red:** queue stuck (oldest item >24h)
- Cadence: every 15 minutes

#### Check 3 — Cron health
- Read Vercel cron invocation logs
- For each scheduled cron: did it fire in its expected window?
- **Missed fire:** yellow alert
- **3+ consecutive missed fires:** red alert
- Cadence: every hour

#### Check 4 — Backup verification
- Did the last scheduled backup succeed?
- Can a sample restore be performed? (weekly automated test)
- **Backup older than 24h:** yellow alert
- **Backup older than 48h or restore test failed:** red alert
- Cadence: daily check

#### Check 5 — Index health
- For each table: are indexes being used? (read `pg_stat_user_indexes`)
- Unused index after N weeks → flag for review
- Bloated index → flag for REINDEX
- Cadence: weekly

### Output

Writes `operator_alerts` rows when any check fails. Updates a `health_state` table with current status per check.

```yaml
# hive_config.yml — infrastructure limits (per-hive)
infrastructure:
  table_size_limits:
    products: 100MB
    story_writer_runs: 500MB
    market_research_runs: 500MB
    email_queue: 200MB
    audit_log: 1GB
    # ...

  queue_health:
    event_bus:
      healthy_depth: 100
      healthy_oldest_hours: 1
    email_queue:
      healthy_depth: 50
      healthy_oldest_hours: 2

  backup:
    expected_frequency_hours: 24
    restore_test_frequency_days: 7

  cron_tolerance_minutes: 15
```

---

## §5 — Bee 2: Cost Watcher

### Purpose
Track API and infrastructure spend. Catch runaway costs before they hurt.

### Method

#### Source 1 — LLM API billing
- Gemini: read usage from Google Cloud Console billing API
- Anthropic: read from Anthropic console (manual export if no API; or per-call cost tracking from response metadata)
- OpenAI: read from OpenAI usage API
- Perplexity: read from Perplexity dashboard

For each provider: capture spend per day, attribute to which queen called what (via tagging in the request metadata).

#### Source 2 — Infrastructure billing
- Vercel: read usage from Vercel API (function invocations, egress, builds)
- Supabase: read DB/storage usage
- Resend: read email volume + cost
- Stripe: read transaction fees (already known per sale)
- Domain/DNS providers: monthly fixed

#### Spend attribution

Every API call from a queen MUST tag its purpose:

```javascript
// Example: in Strategic Queen's Bee 2 (Demand Scorer) calling Gemini
const response = await gemini.call({
  prompt: "...",
  metadata: {
    hive: "tax",
    queen: "strategic",
    bee: "demand_scorer",
    purpose: "personalisation_scoring",
    handoff_id: "..." // if applicable
  }
});
```

Cost Watcher reads these tags and produces attribution reports.

#### Outputs

- Daily cost rollup per provider, queen, bee
- Cost per product built (Production Queen spend / products shipped)
- Cost per handoff approved (Strategic Queen spend / approved handoffs)
- Cost per customer acquired (total marketing spend / paying customers)
- Trend (rising/falling) for each

#### Cost alerts

```yaml
# hive_config.yml — cost thresholds
cost_thresholds:
  daily_total_yellow: 100  # USD
  daily_total_red: 200
  monthly_total_yellow: 2000
  monthly_total_red: 4000

  per_queen_daily_red:
    strategic: 5
    production: 50      # builds are expensive
    distribution: 10
    concierge: 5
    adaptive: 3
    governance: 1

  unusual_spike_pct: 200  # alert if today's spend is 2x average
```

When thresholds breach: yellow/red alert with breakdown of which queen drove the cost.

### Critique point

Spend attribution depends on every queen consistently tagging API calls. This is a discipline cost across the whole codebase. **Worth standardizing as part of the Vanilla template** so every new hive inherits the tagging pattern.

---

## §6 — Bee 3: Secret Sentinel

### Purpose
Track secret/credential ages and surface rotation needs before things expire.

### Tracked secrets

```
secrets_inventory (per-hive)
─────────────────────────────

secret_name              e.g. "CRON_SECRET", "GEMINI_API_KEY"
secret_type              cron | api_key | oauth_token | webhook_secret
created_at               when it was first stored
last_rotated_at          when it was last changed
rotation_due_at          when it should next be rotated
rotation_cadence_days    typical rotation interval
auto_rotatable           whether the system can rotate without operator
location                 vercel_env | supabase_secrets | etc.
used_by                  list of queens/bees that consume it
```

### Method

- Read `secrets_inventory` daily
- For any secret where `rotation_due_at < now() + 14 days`: yellow alert
- For any past due: red alert
- For auto-rotatable secrets: queue a rotation job (operator approves dispatch)
- Track OAuth refresh token usage — if a token failed to refresh, red alert

### Rotation workflow

For CRON_SECRET (the example from Day 13's operational batch):

1. Secret Sentinel sees `rotation_due_at` approaching
2. Yellow alert appears on operator dashboard
3. Operator clicks "Rotate"
4. System generates new value
5. Updates Vercel env (Production + Preview + Development)
6. Triggers redeploy
7. Updates `last_rotated_at` and computes new `rotation_due_at`
8. Writes audit_log entry

For OAuth tokens (e.g., YouTube Data API, Reddit if ever reintroduced):
- Refresh attempts logged
- Refresh failures trigger red alert
- Operator must manually re-authenticate

### Critique point

The rotation workflow needs careful design for secrets in active use. Rotating CRON_SECRET while a cron is mid-execution would fail that run. Mitigation: rotation window during low-activity hours; brief overlap period accepting both old and new (more code).

---

## §7 — Bee 4: Janitor

### Purpose
Scheduled cleanup of accumulating data. Archive, vacuum, purge.

### Janitorial tasks

#### Task 1 — Archive old log rows
Tables with append-only history (e.g., `story_writer_runs`, `market_research_runs`, `cleanup_log`, `audit_log`):
- Move rows older than configured retention to an archive table or external storage
- Cadence: weekly
- Default retention: 90 days hot, then archive

#### Task 2 — Purge stale calendar/queue entries
Tables that should not retain old completed rows (e.g., `email_queue` after send, `build_queue` after completion):
- Hard-delete rows in terminal status older than N days
- Cadence: daily
- Default: 30 days after terminal status

#### Task 3 — Vacuum tables
- Run `VACUUM ANALYZE` on tables with high churn
- Cadence: nightly during low-activity window

#### Task 4 — Rebuild bloated indexes
- For indexes flagged by Infrastructure Pinger as bloated
- `REINDEX CONCURRENTLY` to avoid locks
- Cadence: weekly during low-activity window

#### Task 5 — Compress old citation evidence
For Strategic Queen handoffs older than 90 days, compress the `evidence` JSON blob (which can be large) to a summary form
- Cadence: weekly

#### Task 6 — Embedding cache pruning
For embedding vectors used by Site Auditor and other queens: prune cached embeddings for products that no longer exist (deprecated)
- Cadence: monthly

### Operator gate

Most janitorial work runs automatically. **Exceptions requiring operator approval:**
- First-ever run of a destructive operation (purge, hard delete) on a new table
- Janitor encountering unexpected row counts (>10x normal)
- Any operation that would free >5GB at once

For these: Janitor queues the operation as PENDING, alerts operator, executes only on approval.

### Critique point

Janitor's policies are conservative by default. At scale, you may want more aggressive cleanup. Configurable per hive. Worth a sanity check: at 6 months of operation, will Tax Hive's tables fit comfortably? If projections show otherwise, tighten retention.

---

## §8 — Bee 5: Audit Recorder

### Purpose
Write append-only records of operator-visible actions for accountability.

### What gets audited

```
AUDIT EVENTS to record:

Operator actions:
  - approved_handoff
  - rejected_handoff
  - deferred_handoff
  - approved_publication
  - rejected_publication
  - approved_revision_request
  - manually_deprecated_product
  - rotated_secret
  - adjusted_hive_config
  - approved_apiary_action (e.g. clone new hive)
  - bulk_approved_pending_items

Queen state changes:
  - product_built (Production)
  - product_revised (Production)
  - product_deprecated (Production)
  - publication_pushed (Distribution)
  - sequence_started (Concierge)
  - feedback_card_emitted (Adaptive)
  - alert_raised (Governance)

System events:
  - secret_rotated (auto)
  - backup_completed
  - janitor_archived_rows
  - cron_missed
  - error_threshold_breached
```

### Method

- Other queens emit audit events via the shared event bus
- Audit Recorder subscribes to the audit channel, writes to `audit_log`
- Some events require additional context (e.g. "approved_handoff" should record which handoff, what score, why)

### Operator audit views

Dashboard panel that shows:
- Recent 100 audit events (filterable by category, actor, target)
- Search by entity (e.g. "all events for product X")
- Export to CSV for external compliance

### Why this matters

Three reasons:
1. **Debugging.** "Why did Product X get rebuilt last Tuesday?" Audit log shows the trigger.
2. **Compliance.** If you ever need to demonstrate process control (e.g., to a regulator, an acquirer, or a partner), the audit log is your evidence.
3. **Operator memory.** At 20 hives and 6 months in, you won't remember why a decision was made. The audit log is institutional memory.

---

## §9 — Bee 6: Dashboard Renderer

### Purpose
Compose the per-hive operator dashboard from all the data above.

### Method

The dashboard is server-rendered or hydrated client-side from these sources:
- `{hive}_metrics` (for CO·LE health + per-queen status)
- `operator_alerts` (open alerts)
- `audit_log` (recent activity)
- `cleanup_log` (janitorial activity)
- Cost rollups from Bee 2
- Secret ages from Bee 3
- Infrastructure health from Bee 1

### Layout (Level 2 — per-hive view)

```
┌─────────────────────────────────────────────────────────────┐
│  TAX HIVE — taxchecknow                                      │
│  Last refresh: 30s ago                                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  CO·LE HEALTH                                          │  │
│  │                                                        │  │
│  │  CONVERTS    OPERATES   LEARNS    EXECUTES           │  │
│  │   🟢          🟡         🟢         🟢                │  │
│  │  $4.2k MRR   1 alert    +12       3 builds          │  │
│  │  +18% MoM   (yellow)    cards     in flight         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  QUEEN CARDS (click to drill)                         │  │
│  │  [Strategic] [Production] [Distribution]              │  │
│  │  [Concierge] [Adaptive] [Governance]                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ALERTS (2 open)                                       │  │
│  │  🟡 Calendar table 82% of soft limit                  │  │
│  │     Suggested: Janitor archive run                    │  │
│  │     [Acknowledge] [Run now] [Dismiss]                 │  │
│  │                                                        │  │
│  │  🟡 GEMINI_API_KEY rotation due in 9 days             │  │
│  │     [Acknowledge] [Rotate now]                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  COSTS (last 30 days)                                 │  │
│  │  Strategic    $24                                      │  │
│  │  Production   $187                                     │  │
│  │  Distribution $42                                      │  │
│  │  Concierge    $18                                      │  │
│  │  Adaptive     $9                                       │  │
│  │  Governance   $3                                       │  │
│  │  ──────────────                                       │  │
│  │  TOTAL        $283                                     │  │
│  │  Revenue (30d) $4,237                                  │  │
│  │  PROFIT        $3,954  (93% margin)                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  RECENT ACTIVITY (last 24h)                           │  │
│  │  - Approved handoff: au-frcgw-settlement-delay        │  │
│  │  - Product built: au-19-frcgw-clearance-cert v2       │  │
│  │  - Published: YouTube video "FRCGW Explained"         │  │
│  │  - Adaptive feedback card: Calculator X needs simpler │  │
│  │    inputs (sent to Production)                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Refresh strategy

- Dashboard polls every 30 seconds for fresh data
- Critical alerts push via SSE or websocket (no polling lag for red alerts)
- Underlying metric snapshots can lag by up to N minutes (configurable)

### Drill-down

- Click a queen card → her detail panel (Level 3 — Strategic Queen panel, Production Queen panel, etc.)
- Click an alert → alert detail with full context and action buttons
- Click a cost figure → breakdown by bee and by API call

---

## §10 — Bee 7: Summary Publisher

### Purpose
Write this hive's summary to the global `global_hive_summaries` table for Apiary visibility.

### Method

- On a schedule (every 5 minutes), Summary Publisher reads from this hive's metrics + alerts + costs
- Composes the `global_hive_summaries` row shape (see §2 Output 2)
- Writes/updates one row in the global table where `hive_name = '{this_hive}'`
- Single row per hive — upsert pattern

### Why a separate bee

Could be folded into Dashboard Renderer or Infrastructure Pinger. Separated because:
1. **Failure isolation.** If the Apiary publishing endpoint is down, this hive's dashboard still renders. Summary Publisher fails alone.
2. **Cadence differs.** Dashboard refreshes every 30s for the operator; Summary Publisher updates every 5 minutes for the Apiary (less frequent, less load).
3. **Cleaner audit.** Summary publishes are themselves audited events.

### Critique point

The global_hive_summaries table is the federation bridge. It needs to handle the Apiary going down without losing data — but since each hive overwrites its own row, there's no data loss risk; the Apiary just sees stale data until summary publishing resumes.

---

## §11 — Lifecycle orchestration

How the bees fit together over time:

```
Continuous (always running):
  Bee 1 (Infrastructure Pinger) — every 15 min / hourly / 6h / daily
  Bee 2 (Cost Watcher) — daily rollup, hourly spike detection
  Bee 3 (Secret Sentinel) — daily
  Bee 4 (Janitor) — nightly cleanup window
  Bee 5 (Audit Recorder) — event-driven (responds to bus events)
  Bee 6 (Dashboard Renderer) — on operator page load + 30s polling
  Bee 7 (Summary Publisher) — every 5 minutes

Event-triggered:
  Bee 1 emits → operator_alerts
  Bee 2 emits → operator_alerts when cost thresholds breach
  Bee 3 emits → operator_alerts on rotation due / OAuth failure
  Bee 4 emits → cleanup_log entries + alerts on unexpected row counts
  Bee 5 emits → audit_log entries
  Bee 7 publishes → global_hive_summaries
```

### When operator opens the dashboard

```
1. Open soverella.com/dashboard/monitor?site=taxchecknow
2. Bee 6 (Dashboard Renderer) reads latest snapshots from all sources
3. Renders the page
4. Background poll refreshes every 30s
5. If operator clicks an alert action → audit_log entry + appropriate
   queen's handler fires
```

---

## §12 — Hive config dependencies

Governance Queen depends on per-hive config. Sketched throughout this document; consolidated here:

```yaml
# hive_config.yml — Governance Queen section
governance:
  infrastructure:
    table_size_limits:
      products: 100MB
      story_writer_runs: 500MB
      # ... per-table limits

    queue_health:
      event_bus:
        healthy_depth: 100
        healthy_oldest_hours: 1

    backup:
      expected_frequency_hours: 24
      restore_test_frequency_days: 7

    cron_tolerance_minutes: 15

  costs:
    daily_total_yellow: 100
    daily_total_red: 200
    monthly_total_yellow: 2000
    monthly_total_red: 4000
    per_queen_daily_red:
      strategic: 5
      production: 50
      distribution: 10
      concierge: 5
      adaptive: 3
      governance: 1
    unusual_spike_pct: 200

  secrets:
    rotation_cadences:
      CRON_SECRET: 90
      GEMINI_API_KEY: 365
      RESEND_API_KEY: 365
    warning_window_days: 14

  retention:
    story_writer_runs_days: 90
    market_research_runs_days: 90
    audit_log_days: 365      # longer for compliance
    cleanup_log_days: 180
    operator_alerts_resolved_days: 60
    email_queue_terminal_days: 30

  dashboard:
    refresh_seconds: 30
    summary_publish_minutes: 5
```

This is intentionally a lot. Most fields have sensible defaults from Vanilla. Operator only changes the ones that need tuning for this hive.

---

## §13 — Cost estimate

Governance Queen's own operational cost is tiny:

```
LLM calls: ~$0 (no LLM needed for any bee)
Infrastructure pings: DB read overhead, ~$0
Cost API reads: free (billing endpoints don't charge for reading)
Storage for logs: minimal, included in DB cost

TOTAL Governance Queen cost: ~$0-3/month per hive
```

She's the cheapest queen to run. Her value is in preventing the OTHER queens' costs from running away.

---

## §14 — How this maps to the locked principles

| Principle | Honored? |
|---|---|
| 1. Whoever made it owns it | ✓ Governance owns infrastructure decisions, alerts, dashboard rendering, audit trail. |
| 2. Each queen self-monitors via pings | ✓ Governance IS the ping-based queen. Infrastructure Pinger and Cost Watcher are her core monitoring. |
| 3. Flat hive, no AI middle-management | ✓ Governance reports to operator, not to any Empress. She renders the dashboard; operator decides. |
| 4. TrustMRR pub test | ✓ Cronitor, Datadog, Vanta, Better Stack are real $50M+ businesses doing this exact work. |
| 5. Per-hive isolation, federated visibility | ✓ Operates entirely on this hive's data. Federates summary to Apiary's global table for cross-hive view. |
| 6. Domain expertise in-hive, methodology cross-hive | ✓ Hive-specific thresholds are config. The monitoring/cost/audit *methodology* is generic, propagated via Vanilla template. |
| 7. Design backwards from outcome | ✓ Started from "what does the operator need to see and what needs to stay healthy" → bees fall out. |

---

## §15 — Critique points

Where I'm least confident or where there's real debate:

1. **Bee 5 (Audit Recorder) is event-driven only.** Means if the event bus is down, audit events are lost. Mitigation: queens write audit events to their own local audit_outbox first, Audit Recorder drains them. Adds reliability. Worth doing.

2. **Bee 2 (Cost Watcher) depends on every other queen tagging API calls.** This is a hard dependency that crosses the whole codebase. **Should be standardized in the Vanilla template** and probably enforced via a wrapper library. Otherwise attribution is incomplete.

3. **Bee 6 (Dashboard Renderer) is described as a bee but is really more of a UI component.** Could argue it's not really a bee at all — just code that reads tables. Counter-argument: it has scheduled refresh, owns layout decisions, and is meaningfully its own concern. I left it as a bee for consistency, but it's defensible to call it "the dashboard component" instead.

4. **Janitor's destructive operations.** Even with operator gates on the first run, there's risk. A bug in Janitor that purges the wrong table could be catastrophic. Mitigation: NEVER actually delete — Janitor moves to archive tables. Hard-delete is a separate operator-gated action, never auto. This needs to be stated more strongly in implementation.

5. **Alert fatigue at scale.** At 20 hives, Governance Queens collectively could produce hundreds of alerts per day. Apiary needs to aggregate and prioritize. Cross-references to Orchestrator design. **The "what should the operator see TODAY across all hives" is an Apiary problem, not a per-hive Governance problem.**

6. **Cost thresholds are hard to set correctly upfront.** First few months of operation will reveal what "normal" looks like. Initial thresholds will be wrong. Worth building self-calibration (Bee learns the baseline) — but that's beyond v1.

7. **Backup verification is hand-wavy.** I said "automated restore test" but the mechanics depend on your backup stack (Supabase point-in-time recovery? pg_dump to S3? Vercel-native?). This needs concrete design per the actual infrastructure.

8. **Secret Sentinel rotation workflow is operator-gated by default.** Could automate more aggressively. But getting CRON_SECRET rotation wrong takes down the hive — so operator gate is right for now.

9. **Audit log retention of 365 days might be too short.** For acquisition due diligence, longer is better. Configurable per hive.

10. **Per-queen dashboard panels need their own design.** I sketched the hive-level layout. Each queen's drill-down panel needs explicit specification (each queen design has a brief §6-style section, but operator-facing UI deserves its own spec). Deferred.

---

## §16 — Migration map from existing code

| Existing element | New home |
|---|---|
| Doctor-bee (existing health monitor) | Governance Queen Bee 1 (Infrastructure Pinger) |
| D-bees (existing archival/cleanup) | Governance Queen Bee 4 (Janitor) |
| Existing cron health checks scattered across cron jobs | Consolidated into Bee 1 |
| Existing cost tracking (if any — likely manual today) | Governance Queen Bee 2 (Cost Watcher) — likely net new |
| CRON_SECRET rotation done manually in Day 13 batch | Governance Queen Bee 3 (Secret Sentinel) — automate the workflow |
| Operator dashboard (existing soverella/dashboard/monitor pages) | Already rendered; refactor to read from Governance Queen's bee outputs |
| Audit trail (likely scattered today) | Governance Queen Bee 5 (Audit Recorder) — likely net new, requires bus integration |

**Net effect:** consolidates existing scattered monitoring/cleanup into one queen. Net-new work: Cost Watcher (currently no systematic cost attribution), Secret Sentinel automation, Audit Recorder.

---

## §17 — Sanity check against the operator's morning

If this design is right, your morning Governance experience:

1. Open Apiary dashboard → see all hives' health rolled up (each hive's Summary Publisher feeds this)
2. Click into Tax Hive → see CO·LE health, queen cards, alerts, costs, recent activity
3. Open alerts: triage by severity. Red alerts demand attention; yellows can wait.
4. Approve any pending actions (rotation due? cleanup ready to run? secret expiring?)
5. Glance at costs vs revenue — is the hive profitable?
6. Move to next hive

For 2-3 minutes per hive of morning attention, infrastructure is under control. **Without Governance Queen, this would be "log into 5 services, check 12 dashboards, hope nothing exploded." With her, it's one screen per hive.**

That's the operator leverage Governance exists to create.

---

## §18 — Phase implementation roadmap

Not all of Governance ships in v1:

**Phase 0 (existing today):**
- Doctor-bee (basic infrastructure health)
- Existing dashboard pages
- Manual cost tracking via Vercel/API consoles

**Phase 1 (immediate priority):**
- Bee 1 (Infrastructure Pinger) — formalize the checks, write alerts to table
- Bee 4 (Janitor) — formalize D-bees under one bee
- Bee 6 (Dashboard Renderer) — consolidate dashboard data sources
- Bee 7 (Summary Publisher) — required for Apiary visibility

**Phase 2:**
- Bee 2 (Cost Watcher) — requires queen-side tagging discipline first
- Bee 5 (Audit Recorder) — requires event bus reliability

**Phase 3:**
- Bee 3 (Secret Sentinel) — automate rotation workflows
- Self-calibration for cost thresholds
- Backup verification automation

**Phase 4+:**
- Cross-hive alert aggregation (Apiary concern, but Governance feeds it)
- Compliance export views (SOC 2 / ISO-style audit trail exports)
- Anomaly detection on infrastructure metrics (when DB size grows unusually fast, etc.)

---

## §19 — Closing

Governance Queen is the least glamorous queen and possibly the most important. Without her, the other five queens accumulate technical debt, secrets expire, costs run away, and the operator drowns in 12 dashboards. With her, one screen per hive shows everything.

**End of Governance Queen design.**
