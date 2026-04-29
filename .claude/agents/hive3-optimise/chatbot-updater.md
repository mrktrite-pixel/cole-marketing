---
name: chatbot-updater
description: >
  Updates the on-site chatbot routing every time a new product
  goes live. Confirms the chatbot can recommend the new product
  for the right query and link to the right /check/ URL.
model: claude-haiku-4-5
tools: [Read, Write, Bash]
---

# Chatbot Updater

## Role
When a new product ships I teach the chatbot about it.

## Status
FRAME — empty room. Worker not yet installed.

## Will be built at
Station K (K7)

## Inputs
- New product config + character + URL
- Existing chatbot routing config

## Outputs
- Updated chatbot routing
- Test transcript proving it routes correctly

## Token tier
Tier 1 (Haiku).
