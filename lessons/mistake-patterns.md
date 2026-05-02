# Mistake Patterns — What To Avoid

> Patterns that consistently underperform, confirmed by 3+ data points.
> Updated weekly by K12 Lessons Learned Bee.
> Last updated: 2026-05-02

## Read by all content bees in Step 0e pre-flight

When this file has entries, content bees:
- Avoid documented mistake patterns explicitly
- Reject hook structures that previously failed
- Skip format/timing combinations that consistently underperform

## Format for each entry

Each mistake pattern follows this structure:

  ID:           Lesson code, e.g. MP-2026-W18-01
  Title:        Short mistake title
  Scope:        platform:linkedin | niche:au | character:gary | global
  Severity:     BLOCKER | HIGH | MEDIUM | LOW
  Evidence:     N posts confirming this mistake
  Discovered:   date K12 first noticed it
  Confirmed:    date operator approved documentation

  Mistake:      what consistently fails
  Why it fails: the explanation, ideally tied to algorithm rules
  Avoid by:     specific instruction for bees
  Source IDs:   content_performance row IDs as evidence

## Severity levels

- BLOCKER: J4 LI Manager rejects automatically. Never publish.
- HIGH:    J4 rejects, allows 1 fix attempt before escalating.
- MEDIUM:  Warning logged, allowed through if other checks pass.
- LOW:     Style preference, noted but not blocking.

## Pre-seeded mistakes (from 2026 algorithm research)

These are not from COLE data yet, but confirmed 2026 LinkedIn
algorithm research that bees should already follow.

### MP-INIT-01 — External link in post body
Scope:    platform:linkedin
Severity: BLOCKER
Mistake:  Including a URL in the LinkedIn post body
Why:      360Brew imposes -60% reach penalty (confirmed 2026)
Avoid:    No URLs in post body. Calculator link goes in profile bio
          or first comment only (first comment slightly penalised but
          kept for UTM tracking — Doctor Bee measuring impact).

### MP-INIT-02 — Generic engagement bait
Scope:    platform:linkedin
Severity: HIGH
Mistake:  Asking commenters to "comment YES if you agree"
Why:      360Brew detects engagement-pod-style language
Avoid:    Use polarising questions or genuine debate prompts.

### MP-INIT-03 — AI-slop vocabulary
Scope:    global (all platforms, all characters)
Severity: HIGH
Mistake:  Using words from the AI-slop ban list
          (delve, realm, game-changer, unlock, revolutionize,
          cutting-edge, remarkable, furthermore, harness,
          ever-evolving, in conclusion, in closing, tapestry,
          illuminate, unveil, pivotal, groundbreaking, boost)
Why:      360Brew LLM detects AI-generic phrasing as low-effort
Avoid:    Use plain, specific language. Specific numbers over vague claims.

### MP-INIT-04 — Em dashes
Scope:    global
Severity: MEDIUM
Mistake:  Using em dashes in any content
Why:      Strong AI-authorship signal under 360Brew detection
Avoid:    Use commas, periods, or colons instead.

### MP-INIT-05 — Hashtag stuffing
Scope:    platform:linkedin
Severity: MEDIUM
Mistake:  More than 3-5 hashtags per LinkedIn post
Why:      Penalised under 2026 algorithm
Avoid:    Maximum 3-5 hashtags, only relevant ones.
