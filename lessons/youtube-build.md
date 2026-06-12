# YouTube Build — Lessons (paid for live, now law)

From the YTL L0–L7 build (§8 of knowledge/YTL-BUILD-FINAL.md). These ride the
bees-snapshot into every future bee's context.

1. **Additive migrations run BEFORE the deploy that reads them.** The SQL box goes to the operator at commit time; deploy follows "ran it."
2. **"Success. No rows returned" on DDL verifies nothing about effect.** `drop constraint if exists <wrong-name>` is a silent no-op (auto-generated constraint names). PROBE THE BEHAVIOR: throwaway insert → expect accept/reject → delete. The name-agnostic `DO` block (iterate `pg_constraint`) is the durable fix pattern.
3. **ffprobe/ffmpeg is NOT preinstalled on ubuntu-latest.** Install it in the workflow. Graceful-degrade design (probe failure NEVER fails a render) turned this from an outage into a log line.
4. **TUS resumable is flaky at ~24MB; single-PUT+retry is reliable under the 50MB cap.** Size-route: <45MB single-PUT-first, ≥45MB TUS-first, each with the other as fallback.
5. **Stills-QA before render:** any composition change gets still-frames rendered AND VIEWED at the key beats (cold open, mid-chapter, CTA) before spending a 10-minute render. Caught the thumbnail clip; would have caught the cold-open overflow.
6. **Text-fit is a discipline, not a fix:** every text role gets length-derived font sizing against a hard maxWidth + line budget, inside a clipped 5% safe-area stage. Long-form is watched small on phones.
7. **Zernio is the source of truth for the video id** (sees unlisted, no lag). Never scan YouTube for what the publisher already knows.
8. **`products.slug` is path-form** (`nomad/check/…`); the bare slug derives from the product_key. Verified-then-derived, never assumed.
9. **A per-product constant cannot dedupe per-product content** (the menu-hash catch) — dedupe on a content signature.
10. **Additive means ADDITIVE:** new tick output goes in NEW fields (`reactionSignals`, not the shorts `signals` array). The regression diff is the arbiter, run every build, stripped of additive sections only.
11. **Session A can dispatch GHA** via the git-credential token + `workflow_dispatch` API. If a future instance claims otherwise, it lost context — runs #28–#35 are the proof.
12. **Specs can be wrong; the build corrects them with evidence** (menu-hash dedupe, "expect zero" intake, "ffprobe ships on the runner"). Probe-before-build catches the spec's assumptions too.
