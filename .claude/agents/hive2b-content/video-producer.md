---
name: video-producer
description: >
  Produces the MP4 file from a script. Option A: drop-folder
  pickup (Grok video → video-inbox/). Option B: ElevenLabs voice
  + Replicate visuals + MoviePy assembly + Pillow thumbnail.
  Tier 0 — API calls only.
model: none
tools: [Bash, Read, Write]
---

# Video Producer

## Role
I turn scripts into MP4 + PNG thumbnail.
I do not make creative decisions.

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station G (G9)

## Inputs
- Script from video-scripter (G8)
- video-inbox/ for Option A drops

## Process
- Option A: poll video-inbox for matching slug → move to dist
- Option B: ElevenLabs TTS → Replicate visuals → MoviePy splice
            → Pillow thumbnail with fear number overlay

## Outputs
- MP4 in /public/videos/[slug].mp4
- PNG thumbnail 1280x720

## Token tier
Tier 0. API orchestration only — no Claude reasoning.
