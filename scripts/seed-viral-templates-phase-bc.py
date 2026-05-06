#!/usr/bin/env python3
"""
One-shot seed for viral_templates Phase B (5 Sabrina archetypes) +
Phase C (5 citation-gap vertical extensions).

PostgREST batch insert is atomic — if any row violates a constraint,
the whole batch rolls back. Same guarantee as BEGIN/COMMIT.

Run from cole-marketing/. Reads SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
from .env.local (loaded by the wrapping shell command).
"""
import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
if not SUPABASE_URL or not SERVICE_KEY:
    print("ERROR: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set", file=sys.stderr)
    sys.exit(2)

NOW = datetime.now(timezone.utc).isoformat()

# ---------- PHASE B — 5 Sabrina archetypes ----------

phase_b = [
    {
        "source_url": "https://help.blotato.com/tips-and-tricks/hooks",
        "source_author": "Sabrina Ramonov (Blotato playbook)",
        "source_platform": "linkedin",
        "scraped_at": NOW,
        "template_name": "Pattern Interrupt — Surprising Stat Opener",
        "hook_pattern": (
            "Open with a surprising statistic or unexpected number that contradicts what most readers assume. "
            "Format: \"[Specific number]% of [audience] [unexpected behaviour/outcome].\" or "
            "\"[Number] out of [number] [people in niche] [shocking fact].\" "
            "The stat must be verifiable from a cited authority (ATO, HMRC, IRS, etc.). "
            "After the stat, one-line acknowledgement of why this surprises people. "
            "Then introduce the calculator/product as the path to checking your own number."
        ),
        "body_structure": (
            "Line 1: stat opener (verifiable, sourced). Line 2: blank. "
            "Line 3: one-line \"why this surprises people\". Line 4: blank. "
            "Lines 5-8: 3-4 lines explaining the rule that produces this stat. Line 9: blank. "
            "Line 10: \"Most people don't realise this until [specific late moment — sale, audit, deadline].\" "
            "Line 11: blank. Line 12: CTA to calculator."
        ),
        "cta_pattern": "Calculator self-check: \"Run your numbers in 90 seconds: [URL]\". First comment carries the link if no_active_account_for_link.",
        "topic_category": "pattern_interrupt",
        "format_type": "text",
        "applicable_characters": ["gary-mitchell"],
        "applicable_platforms": ["linkedin"],
        "status": "active",
        "notes": "Sabrina framework #1 (Pattern Interrupt) — niche-agnostic structure. Citation-gap moat: stat must be verifiable from authority source.",
    },
    {
        "source_url": "https://help.blotato.com/tips-and-tricks/hooks",
        "source_author": "Sabrina Ramonov (Blotato playbook)",
        "source_platform": "linkedin",
        "scraped_at": NOW,
        "template_name": "Problem Agitate Solution — Cost-of-Inaction",
        "hook_pattern": (
            "Open by naming a specific problem the reader probably has but hasn't calculated. "
            "Then quantify the cost in dollars/days/lost-claim. "
            "Then escalate by adding a second-order consequence (audit, penalty, deadline missed). "
            "Finally pivot to the solution: a calculator or rule that fixes it."
        ),
        "body_structure": (
            "Line 1: \"If you [specific situation], you may have already [hidden cost].\" Line 2: blank. "
            "Lines 3-5: agitate — quantify with specific numbers. \"[$X] in lost [claim/deduction/credit]. "
            "Plus [consequence Y]. Plus [consequence Z].\" Line 6: blank. "
            "Lines 7-9: solution. Name the rule/section/calculator that resolves it. Line 10: blank. Line 11: CTA."
        ),
        "cta_pattern": "Calculator pivot: \"Find out exactly how much in 90 seconds: [URL]\"",
        "topic_category": "problem_agitate_solution",
        "format_type": "text",
        "applicable_characters": ["gary-mitchell"],
        "applicable_platforms": ["linkedin"],
        "status": "active",
        "notes": "Sabrina framework #3 (Problem Agitate Solution) — vertical adaptation: cost is verifiable from law/regulation, not just opinion.",
    },
    {
        "source_url": "https://help.blotato.com/tips-and-tricks/hooks",
        "source_author": "Sabrina Ramonov (Blotato playbook)",
        "source_platform": "linkedin",
        "scraped_at": NOW,
        "template_name": "Educational Hook — Engaging Question + Reveal",
        "hook_pattern": (
            "Open with a specific question the reader thinks they know the answer to, but probably doesn't. "
            "Question must be answerable with a number, date, or specific rule citation. "
            "Body delivers the answer in 3-5 lines, then explains why the common assumption is wrong, "
            "then closes with the rule citation."
        ),
        "body_structure": (
            "Line 1: question. \"Do you know the [exact threshold/deadline/rate] for [common situation]?\" "
            "Line 2: blank. Line 3: most-common-wrong-answer. \"Most people say [wrong answer].\" "
            "Line 4: blank. Line 5: correct answer with source. \"It's actually [correct answer] — per [specific authority/section].\" "
            "Lines 6-9: short explanation of why the rule works that way. Line 10: blank. "
            "Line 11: CTA \"Check yours: [URL]\"."
        ),
        "cta_pattern": "Educational close: \"If you're unsure where you sit, the calculator runs the numbers exactly as the [authority] would: [URL]\"",
        "topic_category": "educational_explainer",
        "format_type": "text",
        "applicable_characters": ["gary-mitchell"],
        "applicable_platforms": ["linkedin"],
        "status": "active",
        "notes": "Sabrina framework #6 (Educational Hook) — vertical adaptation: answer must be citable from authority, not opinion.",
    },
    {
        "source_url": "https://help.blotato.com/tips-and-tricks/hooks",
        "source_author": "Sabrina Ramonov (Blotato playbook)",
        "source_platform": "linkedin",
        "scraped_at": NOW,
        "template_name": "Social Proof — Result-First Story",
        "hook_pattern": (
            "Lead with the outcome. \"[Specific person profile] saved [$X]\" or \"[Specific person profile] avoided [$X penalty]\" "
            "— anonymised but specific enough to feel real. "
            "Establish credibility by naming the rule/section/calculator that produced the result. "
            "Then explain the method in 3-5 steps. Close with subsequent steps the reader can take."
        ),
        "body_structure": (
            "Line 1: result. \"Last [week/month] a [profile, e.g. Perth investor / Sydney small-business owner / Brisbane retiree] "
            "[saved/avoided/claimed] [$X amount].\" Line 2: blank. "
            "Lines 3-4: credibility. \"They used [specific rule/section] under [authority]. Most people in their position miss this.\" "
            "Lines 5-9: method in 3 numbered steps. Line 10: blank. Line 11: subsequent step CTA."
        ),
        "cta_pattern": "Method-replication CTA: \"Check if this applies to you: [URL]\"",
        "topic_category": "social_proof_story",
        "format_type": "text",
        "applicable_characters": ["gary-mitchell"],
        "applicable_platforms": ["linkedin"],
        "status": "active",
        "notes": "Sabrina framework #7 (Social Proof) — anonymised but specific. Vertical adaptation: result is verifiable from rule, not testimonial.",
    },
    {
        "source_url": "https://help.blotato.com/tips-and-tricks/hooks",
        "source_author": "Sabrina Ramonov (Blotato playbook)",
        "source_platform": "linkedin",
        "scraped_at": NOW,
        "template_name": "Quick Win — 3-Step Action",
        "hook_pattern": (
            "Promise an immediate result the reader can act on TODAY. "
            "Outline a simple method in 3 steps maximum. Each step must be doable without a professional. "
            "Confirm rapidity (e.g. \"takes 90 seconds\", \"before EOD\"). "
            "Close with the calculator that confirms the win."
        ),
        "body_structure": (
            "Line 1: promise. \"You can [specific outcome] in the next [short window].\" Line 2: blank. "
            "Lines 3-5: 3 numbered steps, each one verb-led and specific. Line 6: blank. "
            "Line 7: rapidity confirmation. \"Total time: [X minutes].\" Line 8: blank. Line 9: CTA confirming the win."
        ),
        "cta_pattern": "Confirm-the-win CTA: \"Run the numbers and verify: [URL]\"",
        "topic_category": "quick_win",
        "format_type": "text",
        "applicable_characters": ["gary-mitchell"],
        "applicable_platforms": ["linkedin"],
        "status": "active",
        "notes": "Sabrina framework #9 (Quick Win) — vertical adaptation: each step traceable to a rule/section, not generic advice.",
    },
]

# ---------- PHASE C — 5 citation-gap vertical extensions ----------

phase_c = [
    {
        "source_url": None,
        "source_author": "COLE vertical extension",
        "source_platform": "linkedin",
        "scraped_at": NOW,
        "template_name": "Calculator-Result Authority Screenshot",
        "hook_pattern": (
            "Show the calculator result as proof. "
            "\"I put [specific scenario] into the [product] calculator. Result: $X.\" "
            "Then state the most-common-wrong-answer \"Most people guess $Y.\" "
            "Then state the rule that makes the calculator right."
        ),
        "body_structure": (
            "Line 1: scenario setup. \"Took a [specific profile] situation and ran the numbers.\" Line 2: blank. "
            "Line 3: result line. \"Calculator output: $X.\" Line 4: blank. "
            "Line 5: contrast. \"Most [advisors/accountants/people in this situation] would have estimated $Y.\" "
            "Line 6: blank. Lines 7-9: rule explanation with section citation. Line 10: blank. "
            "Line 11: CTA \"Run yours: [URL]\". Optional: include image of actual calculator output."
        ),
        "cta_pattern": "Image-supported CTA: image of calculator result + \"Try your own scenario: [URL]\"",
        "topic_category": "calculator_authority",
        "format_type": "text",
        "applicable_characters": ["gary-mitchell"],
        "applicable_platforms": ["linkedin"],
        "status": "active",
        "notes": "COLE citation-gap extension. Sabrina-equivalent: none (her vertical lacks deterministic calculators). Best for products with strong dollar-output (FRCGW, Div 7A, CGT timing).",
    },
    {
        "source_url": None,
        "source_author": "COLE vertical extension",
        "source_platform": "linkedin",
        "scraped_at": NOW,
        "template_name": "Specific-Statute Citation",
        "hook_pattern": (
            "Open by quoting a specific statute section number. "
            "Then state what most professionals get wrong about that section. "
            "Then give the correct interpretation with a worked example."
        ),
        "body_structure": (
            "Line 1: section quote. \"Section [X] of the [Act] says: [direct quote, ≤15 words].\" Line 2: blank. "
            "Line 3: misinterpretation. \"Most [accountants/lawyers/advisors] read this as [wrong interpretation].\" "
            "Line 4: blank. Line 5: correct read. \"What it actually requires: [correct interpretation].\" "
            "Lines 6-9: worked example with numbers. Line 10: blank. Line 11: CTA."
        ),
        "cta_pattern": "Verify-against-the-rule CTA: \"Check if your situation triggers [section]: [URL]\"",
        "topic_category": "statute_citation",
        "format_type": "text",
        "applicable_characters": ["gary-mitchell"],
        "applicable_platforms": ["linkedin"],
        "status": "active",
        "notes": "COLE citation-gap extension. Vertical-specific to regulated industries (tax, law, finance, healthcare). Sabrina-equivalent: none.",
    },
    {
        "source_url": None,
        "source_author": "COLE vertical extension",
        "source_platform": "linkedin",
        "scraped_at": NOW,
        "template_name": "Verified-Date Deadline Stack",
        "hook_pattern": (
            "Open with 3 specific dates listed line-by-line. "
            "Each date has a different consequence. "
            "Reader is forced to ask which one bites them. "
            "Body explains each deadline and which scenarios trigger which."
        ),
        "body_structure": (
            "Lines 1-3: three dates listed vertically. \"[Date 1]. [Date 2]. [Date 3].\" Line 4: blank. "
            "Line 5: framing question. \"Three deadlines. Three different consequences. Which one bites you?\" "
            "Line 6: blank. Lines 7-9: deadline 1 + consequence. Lines 10-12: deadline 2 + consequence. "
            "Lines 13-15: deadline 3 + consequence. Line 16: blank. "
            "Line 17: CTA \"Check which applies to you: [URL]\"."
        ),
        "cta_pattern": "Self-diagnosis CTA: \"Find out which deadline applies in 90 seconds: [URL]\"",
        "topic_category": "deadline_stack",
        "format_type": "text",
        "applicable_characters": ["gary-mitchell"],
        "applicable_platforms": ["linkedin"],
        "status": "active",
        "notes": "COLE citation-gap extension. Multi-deadline products (FRCGW, EOFY, super contributions). Sabrina-equivalent: none — her niche has no statutory deadlines.",
    },
    {
        "source_url": None,
        "source_author": "COLE vertical extension",
        "source_platform": "linkedin",
        "scraped_at": NOW,
        "template_name": "Failure-Cost Receipt",
        "hook_pattern": (
            "Open with a specific cost a real person paid because they missed a rule. "
            "Anonymised but specific. Then break down EXACTLY what they should have done. "
            "Reader recognises themselves."
        ),
        "body_structure": (
            "Line 1: cost line. \"Last [week/month] someone sent me their [tax bill / penalty notice / settlement statement].\" "
            "Line 2: blank. Line 3: amount. \"Cost: $[X].\" Line 4: blank. "
            "Line 5: rule missed. \"What they missed: [specific rule/section/deadline].\" "
            "Lines 6-9: what they should have done in 3-4 numbered steps. Line 10: blank. "
            "Line 11: CTA \"Don't be them — check yours: [URL]\"."
        ),
        "cta_pattern": "Avoidance CTA: \"Check before you become this story: [URL]\"",
        "topic_category": "failure_receipt",
        "format_type": "text",
        "applicable_characters": ["gary-mitchell"],
        "applicable_platforms": ["linkedin"],
        "status": "active",
        "notes": "COLE citation-gap extension. Real-cost framing makes the calculator urgent. Sabrina-equivalent: closest is her Section 7 Social Proof but inverted (loss not win). Vertical-specific power.",
    },
    {
        "source_url": None,
        "source_author": "COLE vertical extension",
        "source_platform": "linkedin",
        "scraped_at": NOW,
        "template_name": "Cross-Jurisdiction Compare",
        "hook_pattern": (
            "Open with the same scenario across 2-3 jurisdictions, showing different outcomes. "
            "Reader who has assets/income/family in two of them realises they're exposed. "
            "Body explains the rule difference."
        ),
        "body_structure": (
            "Lines 1-3: 3 jurisdictions listed with their outcomes. \"[AU] does [X]. [UK] does [Y]. [US] does [Z].\" "
            "Line 4: blank. Line 5: framing. \"If you have [assets/income/family] in two of these, here's where it gets interesting.\" "
            "Lines 6-9: rule difference explained briefly. Line 10: blank. "
            "Line 11: CTA — pivot to jurisdiction-specific calculator."
        ),
        "cta_pattern": "Jurisdiction-pivot CTA: \"Check your situation: AU [URL_AU] · UK [URL_UK] · US [URL_US]\"",
        "topic_category": "cross_jurisdiction",
        "format_type": "text",
        "applicable_characters": ["gary-mitchell"],
        "applicable_platforms": ["linkedin"],
        "status": "active",
        "notes": "COLE citation-gap extension. Cross-pollination across COLE sites (taxchecknow + future UK/US). Sabrina-equivalent: none. Phase 4+ activation when other sites launch — initial use limited until UK/US products live.",
    },
]

batch = phase_b + phase_c
assert len(batch) == 10, f"Expected 10 rows, got {len(batch)}"

url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/viral_templates"
body = json.dumps(batch).encode("utf-8")
req = urllib.request.Request(
    url,
    data=body,
    method="POST",
    headers={
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    },
)

try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        status = resp.status
        body_text = resp.read().decode("utf-8")
except urllib.error.HTTPError as e:
    status = e.code
    body_text = e.read().decode("utf-8")
except Exception as e:
    print(f"NETWORK_ERROR: {e}", file=sys.stderr)
    sys.exit(3)

print(f"HTTP_STATUS={status}")
if status >= 400:
    print(f"BATCH FAILED — full rollback. Response:\n{body_text}", file=sys.stderr)
    sys.exit(1)

inserted = json.loads(body_text)
print(f"INSERTED_COUNT={len(inserted)}")
for r in inserted:
    print(f"- {r.get('id')} | {r.get('template_name')}")
