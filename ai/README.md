# WebBlocks UI AI Knowledge Layer

This directory contains the static AI usage contract for WebBlocks UI. It is written for AI coding agents that need to advise or edit downstream projects while staying aligned with shipped WebBlocks UI patterns, surfaces, primitives, hooks, and integration rules.

WebBlocks UI is a source of truth for both humans and AI agents. Human developers can use the docs and package guides directly; AI agents should use this directory as an orientation layer before reading the canonical package and documentation sources.

## Recommended AI Reading Order

1. `ai/README.md`
2. `ai/WEBBLOCKS_UI_EXPERT.md`
3. `ai/DOWNSTREAM_USAGE_RULES.md`
4. `ai/FORBIDDEN_PATTERNS.md`
5. `ai/REVIEW_CHECKLIST.md`
6. `ai/RESPONSE_FORMATS.md`
7. `ai/EXAMPLES.md`
8. `ai/DOWNSTREAM_AGENT_BLOCK.md`
9. `ai/knowledge-map.json`
10. Canonical source and docs listed in the knowledge map

Use `ai/DOWNSTREAM_AGENT_BLOCK.md` when a downstream project needs a copyable WebBlocks UI section for `AGENTS.md`, `AI_RULES.md`, `TO_DEVELOPER.md`, or an equivalent AI context file.

## Source of Truth

The shipped package and existing documentation remain the source of truth:

* `packages/webblocks/src/`
* `packages/webblocks/dist/`
* `packages/webblocks/INTEGRATION.md`
* root `INTEGRATION.md`
* `PATTERNS.md`
* `PRIMITIVES.md`
* `docs/*.html`

If this AI contract conflicts with shipped package source or canonical documentation, prefer the shipped package source first, then package docs, then root docs, then this `ai/` layer.

## Scope

This directory is documentation-only. It does not implement a vector store, API service, runtime advisor, Workbench integration, package build change, docs HTML behavior change, or downstream project integration. Those belong to later phases.
