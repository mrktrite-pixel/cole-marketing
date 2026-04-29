---
name: create
description: Create content for a product. Requires /research and
             /hooks to have run first. Specify format: story, article,
             video, email, or gpt-page.
invocation: user
---

# /create [product-slug] [format]

## Formats
  story      → Gary narrative + social package
  article    → Question page (specify question number or exact question)
  video      → 60s or 10min script
  email      → All 6 email templates
  gpt-page   → GPT pre-check page

## Requires
  /research [product-slug] ✅ (check research_questions table)
  /hooks [product-slug] ✅ (check hook_matrix table)
  VOICE.md read ✅ (mandatory before writing)
  CHARACTERS.md read ✅ (correct character for product country)

## Story Format Flow

```
Hook Matrix (read top 3) →
Chaos Agent (read social angles) →
Story Writer (Sonnet) →
Content Manager (Haiku — quality gate) →
  IF APPROVED:
    Page created: app/stories/[slug]/page.tsx
    Social package stored in Supabase li_queue/x_queue/ig_queue
    Appears in Soverella content queue
  IF REJECTED:
    Specific failure reason returned
    Rewrite required before proceeding
```

## Article Format Flow

```
Market Researcher output (read question) →
Article Builder (Sonnet) →
Content Manager (Haiku — quality gate) →
  IF APPROVED:
    Page created: app/questions/[slug]/page.tsx
    Distribution Bee fires automatically
  IF REJECTED:
    Specific failure reason returned
```

## Output

```
CREATE COMPLETE: [product-slug] [format]

Content Manager: APPROVED ✅

Files created:
  [path to created file]

Soverella queue: [content added — awaiting your approval]

Distribution: [pending — fires after Soverella approval]

Cost: ~$[X]

READY FOR: /publish [content-id] (after Soverella approval)
```
