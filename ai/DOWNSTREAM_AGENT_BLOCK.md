# WebBlocks UI Downstream Agent Block

## Purpose

This block defines the required WebBlocks UI usage rules for AI coding agents working inside downstream projects.

## Copy Target

Copy this text into a downstream project's `AGENTS.md`, `AI_RULES.md`, `TO_DEVELOPER.md`, or equivalent AI context file.

## Required Block

```md
## WebBlocks UI Usage

This project uses WebBlocks UI for admin, auth, dashboard, settings, and related application UI.

Before making UI changes, read the WebBlocks UI sources and AI usage contract from:

`<WEBBLOCKS_UI_REPO_PATH>`

Required reading:

- `<WEBBLOCKS_UI_REPO_PATH>/ai/DOWNSTREAM_USAGE_RULES.md`
- `<WEBBLOCKS_UI_REPO_PATH>/ai/REVIEW_CHECKLIST.md`
- `<WEBBLOCKS_UI_REPO_PATH>/ai/FORBIDDEN_PATTERNS.md`
- `<WEBBLOCKS_UI_REPO_PATH>/PATTERNS.md`
- `<WEBBLOCKS_UI_REPO_PATH>/PRIMITIVES.md`
- `<WEBBLOCKS_UI_REPO_PATH>/INTEGRATION.md`

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

## Local Path Example

Current local WebBlocks UI repo path example:

```text
/Users/osm/Sites/projects/project-web_blocks/project-webblocks-ui/webblocks-ui
```

## Usage Notes

Update `<WEBBLOCKS_UI_REPO_PATH>` for each downstream project before copying the block. The path should point to the local checkout of this WebBlocks UI repository that the downstream agent can read.
