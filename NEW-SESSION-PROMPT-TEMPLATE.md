# New Session Prompt Template — Day 13 Pickup

**Paste the block below as your FIRST message in a new Claude conversation on Day 13.**

The new Claude session will arrive oriented, knowing the walk's state, the disciplines, the decisions queued, and where to start.

---

## The Prompt (copy-paste this block)

```
I'm continuing the Tax Hive Colony Sign-Off Walk that I started on Day 12 (2026-05-15). You are picking up from a previous session that has been fully documented.

CONTEXT — Read these files BEFORE responding to me:
1. C:\Users\MATTV\CitationGap\soverella\WALKING-LEDGER-DAY12.md (262 lines — full walk record)
2. C:\Users\MATTV\CitationGap\soverella\FIX-LIST-TIER1.md (210 lines — 8 fixes ready to ship)
3. C:\Users\MATTV\CitationGap\soverella\END-OF-DAY-12-OPERATIONAL-BATCH.md (117 lines — 4 operator actions queued)
4. C:\Users\MATTV\CitationGap\soverella\HANDOVER-DAY-13-PICKUP.md (full handover)
5. C:\Users\MATTV\CitationGap\soverella\DECISIONS-QUEUED.md (decisions queued for Day 13)

Repository: C:\Users\MATTV\CitationGap\soverella
Branch: main
Latest commit: cb83c59 (Day 12 walk artifacts, local-only, not pushed)
Uncommitted: .claude/settings.local.json + production-queen-page.tsx (stray at repo root)

WHO I AM AND HOW WE WORK:
- Operator: Matt V, building CitationGap / soverella / 47 manual tax products on taxchecknow.com
- We work via "Strategy Chat" (you) drafting prompts that I send to "Session A" (a separate Claude Code instance with tool access to the repo + Supabase + filesystem)
- Three verification layers: Day 11 audit (connection points) + Strategy Chat (interpretation against doctrine) + Session A (live data + code verification)
- All three layers must be preserved. They mutually error-correct.

DISCIPLINE LOCKS (carry forward from Day 12):
1. Audit-first protocol
2. Verify-before-compose (applies to SQL, fix specs, prompts, EVERYTHING)
3. Deploy verification protocol
4. One-command-at-a-time (Session A executes sequentially)
5. Two-state sign-off (GOAT or ON FIX LIST, no softening)
6. Reddit-signal-critical
7. Strategic University
8. Scope creep is silent killer
9. Capture-with-full-evidence, fix-in-batches
10. Investigation OK if <5min, read-only, improves ledger
11. Meal/gravy classification for every bee
12. Read orchestrator before workers when investigating starvation
13. Classification language matters as much as accuracy

WHAT WE ACHIEVED ON DAY 12:
- 19 bee sign-off units across 6 phases (A through F)
- Phase G inventory captured (4 walks pending: K20, K21, V1, governance-queen)
- 6 GOAT/CONFIRMED, 16 ON FIX LIST
- ~30 HK items consolidated into 10 leak classes
- Tier 1 fix batch defined: 8 fixes ~40 LOC
- 4 operator hygiene actions queued
- Strategy Chat interpretation errors caught by deeper Session A walks: HK #PD-2 closed, HK #FLOW-1 closed
- 3 confirmed Bible drift patterns (naming, reads-description, status)
- 5 positive architectural findings (adaptive-queen 5-property watcher template, deduction-only confidence model, "build it now, run it deferred" pattern, 4 distinct Phase 2 scope buckets, working observation layer)

WHAT IS NOT YET DONE:
- Phase G walks (4 bees)
- Phase H walk (COLE Orchestrator)
- Phase I end-to-end colony cycle test
- Phase J colony sign-off page
- Tier 1 fix application (0 of 8 fixes applied)
- End-of-Day-12 operational batch (4 actions queued, 0 executed)

MY GOAL FOR THIS SESSION:
[FILL IN ONE OR MORE]
- [ ] Execute the end-of-Day-12 operational batch (4 actions, ~30 min, mostly my hands + Session A for some)
- [ ] Apply Tier 1 fixes (8 fixes, ~3-4 hours)
- [ ] Continue Phase G walks
- [ ] Continue Phase H walk
- [ ] Run Phase I cycle test
- [ ] Write Phase J colony sign-off page
- [ ] Something else: ___________

START BY:
1. Confirming you've read the 5 disk-persisted files
2. Acknowledging the discipline locks
3. Asking me clarifying questions if my goal-checkbox isn't clear
4. Then producing the first action prompt (whether for me to execute, or to send to Session A)

DO NOT:
- Re-litigate Day 12 findings unless I ask
- Try to "remember" what's in the disk files — read them
- Make assumptions about repo state — verify via git status when relevant
- Soften sign-off discipline (two-state, GOAT or ON FIX LIST)
- Skip verify-before-compose

I'll respond after you've confirmed orientation. Then we proceed.
```

---

## Notes for the operator (Matt V)

### Before pasting the prompt
1. Confirm the 5 disk files exist:
   ```
   ls C:\Users\MATTV\CitationGap\soverella\*.md
   ```
   You should see 5 files: WALKING-LEDGER-DAY12.md, FIX-LIST-TIER1.md, END-OF-DAY-12-OPERATIONAL-BATCH.md, HANDOVER-DAY-13-PICKUP.md, DECISIONS-QUEUED.md

2. Confirm git state:
   ```
   cd C:\Users\MATTV\CitationGap\soverella
   git log --oneline -3
   ```
   You should see commits with the Day 12 walk artifacts and handover docs.

3. Decide your goal for the session (the checkboxes in the prompt). Most common Day 13 starting points:
   - **Operational batch first** (recommended) — 30 min to clear small hygiene items
   - **Tier 1 fixes first** — 3-4 hours focused, ships production improvements
   - **Continue walking** — Phase G + H + I + J to complete diagnostic discipline

### What to expect from the new Claude session
- Should respond by confirming it read the 5 files (or asking you to provide them if path access fails)
- Should re-state the discipline locks
- Should ask clarifying questions if your goal is ambiguous
- Should produce the first action prompt only after orientation is confirmed

### If the new session struggles to orient
If the new Claude responds without reading the files, or makes assumptions that contradict the disk artifacts, **stop and re-paste the prompt with stronger emphasis on "read the files first."** A fresh session that hasn't read the handover will produce sub-quality work.

### If you've forgotten what you decided to do
Read DECISIONS-QUEUED.md → Decision A. The recommendation there (A2 — fix-first) is the default if you have no specific preference for Day 13.

### Memory expectations for new session
A fresh Claude session won't have today's compaction baggage. It should be sharp on every detail in the markdown files. **Expect higher accuracy and less hedging than late-session Day 12 Claude.**

### Alternative: shorter prompt if you want to start fast
If you don't want the full template, the minimum viable opening message is:

```
Resuming Tax Hive Colony Sign-Off Walk from Day 12.
Read these 5 files first:
- WALKING-LEDGER-DAY12.md
- FIX-LIST-TIER1.md
- END-OF-DAY-12-OPERATIONAL-BATCH.md
- HANDOVER-DAY-13-PICKUP.md
- DECISIONS-QUEUED.md

All at repo root: C:\Users\MATTV\CitationGap\soverella

My goal today: [STATE YOUR GOAL].

Confirm orientation, then we proceed.
```

The full template is more thorough; the short version is faster.

---

**End of NEW-SESSION-PROMPT-TEMPLATE.md**
