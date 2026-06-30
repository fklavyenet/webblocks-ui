# WebBlocks UI Downstream Agent Block

## Purpose

This block defines the minimal WebBlocks UI usage reference for AI coding agents working inside downstream projects.

## Copy Target

Copy this text into a downstream project's `AGENTS.md`, `AI_RULES.md`, `TO_DEVELOPER.md`, or equivalent AI context file.

## Required Block

```md
## WebBlocks UI Usage

This project uses pinned WebBlocks UI assets for admin, auth, dashboard, settings, and related application UI.

Before making WebBlocks UI changes, read the AI contract shipped with the pinned WebBlocks UI version:

`https://cdn.jsdelivr.net/gh/fklavyenet/webblocks-ui@<WEBBLOCKS_UI_VERSION>/packages/webblocks/dist/ai/contract.md`

Use WebBlocks UI pattern-first:

- Start from shipped WebBlocks UI patterns before creating local wrappers.
- Use `wb-dashboard-shell` for admin/dashboard screens.
- Use `wb-auth-shell` for auth screens.
- Use `wb-settings-shell` for settings screens.
- Use `wb-card` as the only generic framed surface.
- Do not invent generic framed surfaces besides `wb-card`.
- Use `wb-modal` for destructive confirmation flows instead of browser `confirm()`.
- Admin lists must follow the canonical table/action contract: `wb-page-header`, filters before the list card, `section.wb-card`, `.wb-card-body`, `.wb-table-wrap`, explicit `Actions` header, `td.wb-table-actions`, `.wb-action-group`, and pagination in `.wb-card-footer`.
- Add custom CSS or JS only as a last resort after shipped WebBlocks UI composition is proven insufficient.
- Do not add Tailwind, Vite, React, Vue, Livewire, or Inertia UI layers for WebBlocks UI surfaces.

When reviewing UI changes, verify shells, surfaces, tables, forms, overlays, feedback, branding, custom CSS/JS, and tests against the WebBlocks UI checklist.
```

## Usage Notes

Replace `<WEBBLOCKS_UI_VERSION>` with the pinned tag used by the downstream project, such as `v2.7.12`. Keep project-specific route, package, asset, and validation rules in the downstream project's own AI instructions.
