# WebBlocks UI AI Knowledge Layer

This directory contains the source AI usage contract for WebBlocks UI. It is written for AI coding agents that need to advise or edit downstream projects while staying aligned with shipped WebBlocks UI patterns, surfaces, primitives, hooks, and integration rules.

WebBlocks UI is a source of truth for both humans and AI agents. Human developers can use the docs and package guides directly; downstream AI agents should use the versioned `packages/webblocks/dist/ai/contract.md` copy shipped with the pinned WebBlocks UI release.

## Recommended AI Reading Order

1. `ai/README.md`
2. `ai/contract.md`
3. `ai/webblocks-ui-expert.md`
4. `ai/downstream-usage-rules.md`
5. `ai/forbidden-patterns.md`
6. `ai/review-checklist.md`
7. `ai/response-formats.md`
8. `ai/examples.md`
9. `ai/downstream-agent-block.md`
10. `ai/knowledge-map.json`
11. Canonical source and docs listed in the knowledge map

Use `ai/downstream-agent-block.md` when a downstream project needs a copyable WebBlocks UI section for `AGENTS.md`, `AI_RULES.md`, `TO_DEVELOPER.md`, or an equivalent AI context file.

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

This directory is source documentation. The package build publishes versioned downstream AI artifacts under `packages/webblocks/dist/ai/`. It does not create a vector store, API service, runtime advisor, Workbench integration, docs HTML behavior change, or downstream project integration.
