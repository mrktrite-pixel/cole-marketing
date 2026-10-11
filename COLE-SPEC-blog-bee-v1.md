# BLOG BEE — DAILY BLOG ENGINE SPEC v1
Save as: soverella/docs/help/SEO-queen/COLE-SPEC-blog-bee-v1.md
Status: SPEC — rulings 1–4 resolved 2026-10-07. Build NOT yet dispatched.
Parent scope: COLE-SCOPE-visibility-queen-seo-hive-v1.md (SHA 8964a64). This is a VQ organ pulled forward.

## 0. RULINGS OF RECORD (2026-10-07)
- R1 Surface: storefront subfolder taxchecknow.com/blog/ (later theviabilityindex.com/blog/). Subdirectory confirmed ≥.98 (consensus + case studies + 2–5× AI-citation advantage over subdomain). No separate WordPress, no subdomain, no Medium/Substack.
- R2 Cadence: RAMP — wk1–4: 3/wk · wk5–8: 5/wk · wk9+: 6–7/wk; each step-up requires GSC evidence (new posts indexing, impressions rising). TCN first; TVI begins after TCN cluster 1 complete + 4 clean weeks.
- R3 Cluster order rule: proven demand signal first (Bing grounding citations + GSC impressions). Current order: #1 CGT small-business concessions · #2 DASP/super-leaving-AU · #3 UK residency · then next Live product by question-count.
- R4 Sequencing: SPLIT. Steps 1–5 build now (storefront + new tables only). Step 6 (distribution re-pushes) DEFERRED into the Distribution Queen rework; blog bee may not write campaign_calendar or any lane table until that rework defines the interface.
- Standing doctrine: publisher model (cite ATO/HMRC/IRS, never advise) · faceless brand-as-entity byline ("TaxCheckNow Research Team") · characters only as disclosed personas, never experts of record.

## 1. ANTI-PENALTY GUARDS (the .98 is conditional on ALL FOUR — removing any is a spec violation)
- G1 VERIFIED CORPUS + OPERATOR GATE: every post drafts ONLY from the product's verified corpus (product-page questions/answers, config figures, maze ✓-facts, attached authority citations). A figure absent from product config cannot appear. Every post is manual_pending until Matt approves (Gate-2 action pattern). No auto-publish. This is Google's stated safe harbor: AI-assisted, human-reviewed/enriched/approved.
- G2 INFORMATION GAIN: a post must ADD beyond its source product page — at least two of: worked numeric example, scenario walk, stats-in-prose, primary-source quotation+link, comparison table. A post that restates the product page's Q&A is a near-duplicate thin page → gate FAIL. Dedupe check vs product/gpt/questions/stories page classes (cannibalization rule from VQ scope): the post must target a query those classes do not.
- G3 RAMPED CADENCE per R2. Velocity never exceeds the ramp without a ruling.
- G4 KILL-SWITCH: weekly metric read (data plane already live). Two consecutive weeks of falling indexed-count OR falling total impressions → queue auto-pauses, report to operator, resume needs a ruling. Also hard-stop on any GSC manual action notice.

## 2. PIPELINE (steps 1–5 = this build)
1. blog_queue (new table): enrolls Live-roster products (same source as lanes' roster). Live re-tick = new enrollment. Pausing a product releases its unpublished queue slots (same semantics as booking-release ruling 7 Oct). New products enroll at Live automatically.
2. Topic derivation: per product, one post candidate per product-page question; ordered by R3 cluster rule. Candidate carries: source product key, question id, target query, cluster id.
3. Draft (Blog Bee): answer-first (answer inside first 30%), brand name in opening, stats-in-prose from config, ≥1 primary-source citation link, verification date stamp ("Figures verified against [source] on [date]"), CTA to the product calculator, Article + FAQ schema, factual tone (no promo voice). Byline: TaxCheckNow Research Team. Persona voice allowed only with the standard disclosure line.
4. Gate: (a) figure-parity check vs product config (config-vs-authority class) · (b) G2 information-gain + dedupe check · (c) manual_pending → operator Approve/Reject. FIX-LOG entry on any gate failure class seen twice.
5. Publish: /blog/{cluster}/{slug} on the storefront. Internal links: post → product calculator (always), post ↔ sibling cluster posts, product page → its cluster hub. Sitemap + IndexNow ping via existing Distribution Bee publish-time path (read-only use of existing pinger; no lane writes).

## 3. STEP 6 — DISTRIBUTION RE-PUSHES (DEFERRED, recorded for the DQ rework)
HeyTony/Diamante model: each published post is pushed multiple times — multi-platform + re-shares at +7d/+30d/+90d with varied hooks; LinkedIn untouched; Reddit stays paused until lifted. Interface to be defined INSIDE the Distribution Queen rework doc. Until then the blog bee's output ends at publish.

## 4. LEARNING LOOP (the bee that "learns and grows")
Weekly, from the live data plane (GSC service account, Bing Webmaster):
- impressions-no-clicks posts → title/meta rework queue (Bee S's remit — this is Bee S's trusted query source, lifting its dry-run constraint per its standing ruling: real query evidence now exists per-post)
- rising posts → refresh priority (freshness = 4.3× citation lever): re-verify figures, bump date stamp, extend with one new G2 element
- cluster saturation report: when a cluster's posts all hold page-1–3 positions or citations, cluster is COMPLETE → next cluster starts
- every learning action is a proposal row (YOUR MOVE for figure-touching changes; mechanical for meta-length fixes per Bee S LENGTH-FIX ruling)

## 5. SIZE TARGET (evidence-based, 2026)
~90 posts by month 3 (clusters 1–2 saturated) · ~350–400 by month 12 (corpus: ~48 products × ~8 questions). Topical-authority bands: 50–100 articles/cluster for medium competition; 40–50 cluster pages by month 9 shows authority effects. Volume WITHOUT guards G1–G4 = scaled content abuse profile; the guards are what make farm-scale output survivable in 2026.

## 6. BUILD BOUNDARIES (for the eventual dispatch)
Own branch (feat/blog-engine-p1). New tables via operator-paste DDL. No edits to: lane tables, campaign_calendar, existing bees, Distribution Queen surfaces, LinkedIn anything, Reddit anything. Storefront changes limited to /blog/ routes + generator. Verification per the 24 Sep standing rule: BUILT, NOT VERIFIED until Matt loads the preview pages and runtime log confirms.

## 7. ACCEPTANCE TEST
One CGT-cluster post traverses: enrolled → derived → drafted → gate (parity + info-gain pass) → Matt approves → live at /blog/ → appears in sitemap + IndexNow pinged → first weekly learning read returns its GSC row. Then cadence ramp begins.

## 8. OPEN ITEMS / LEDGER
Step-6 interface (owned by DQ rework) · TVI blog start date (after TCN cluster 1 + 4 clean weeks) · minimum-n privacy threshold if any post uses aggregate assessment stats (VQ scope ruling 3, still open) · blog posts enter the publish-gate checklist additions (VQ V5.3) once that gate lands.
