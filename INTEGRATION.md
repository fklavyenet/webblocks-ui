# WebBlocks UI — Canonical Integration Rules

## Purpose

This file defines the top-level integration rules for WebBlocks UI.

Source of truth:

- shipped CSS: `packages/webblocks/src/css/`
- shipped JS: `packages/webblocks/src/js/`
- build manifest: `packages/webblocks/build.sh`

If this file conflicts with shipped source, shipped source wins.

## Core Model

WebBlocks is a controlled HTML/CSS/JS language with these layers:

1. Foundation
2. Layout helpers
3. UI primitives
4. Surfaces
5. Patterns
6. Interactive hooks

WebBlocks is not:

- a framework
- a custom element system
- a utility-first architecture
- a generated markup system
- a config-driven renderer

## Start Here

Start from a pattern when the page has a page-level job.

Canonical shells:

- `wb-auth-shell`
- `wb-dashboard-shell`
- `wb-settings-shell`
- `wb-content-shell`

Then compose inside those shells using shipped layout helpers and primitives.

## Canonical Vocabulary

Use these names as the default public language:

- layout: `wb-container`, `wb-section`, `wb-stack`, `wb-cluster`, `wb-split`, `wb-grid`, `wb-grid-auto`, `wb-row`, `wb-col-*`
- surfaces: `wb-card`, `wb-stat`, `wb-toolbar`, `wb-filter-bar`, `wb-list`, `wb-callout`, `wb-empty`
- screen-local surfaces: `wb-panel`, `wb-page-header`, `wb-settings-section`
- controls: `wb-btn`, `wb-badge`, `wb-input`, `wb-select`, `wb-textarea`, `wb-check`, `wb-radio`, `wb-switch`, `wb-table`, `wb-dropdown`, `wb-tabs`, `wb-accordion`, `wb-collapse`, `wb-modal`, `wb-drawer`, `wb-popover`, `wb-toast`, `wb-spinner`, `wb-progress-bar`
- navigation: `wb-navbar`, `wb-sidebar`, `wb-nav-group`, `wb-menu`, `wb-breadcrumb`, `wb-pagination`
- icons: `wb-icon`, `wb-icon-*`, `wb-icon-wrap*`

## Forbidden Vocabulary

Do not present these as canonical:

- `wb-page`
- `wb-page-center`
- `wb-btn-block`
- `wb-stack-sm`
- `wb-stack-md`
- `wb-align-center`
- `wb-checkbox`
- a generic page-title class shared across page-header and page-intro contexts
- `data-theme`
- `.is-current` for breadcrumbs
- `data-wb-toggle="collapse"`

## Boundary Rules

### Foundation

Foundation owns tokens, theme axes, resets, and global element styling.

It does not define page architecture.

### Layout Helpers

Layout helpers solve structure and flow only.

Use:

- `wb-container*`
- `wb-section*`
- `wb-stack*`
- `wb-cluster*`
- `wb-split`
- `wb-grid*`
- `wb-row` and `wb-col-*`

Do not invent new layout wrappers before trying these.

### UI Primitives

Primitives are reusable controls or local UI building blocks.

Examples:

- `wb-btn`
- `wb-input`
- `wb-card`
- `wb-table`
- `wb-dropdown`
- `wb-tabs`
- `wb-modal`

### Surfaces

Surfaces are larger framed regions that still are not full page patterns.

Examples:

- `wb-card`
- `wb-stat`
- `wb-toolbar`
- `wb-filter-bar`
- `wb-callout`
- `wb-empty`
- `wb-panel`
- `wb-page-header`
- `wb-settings-section`

Boundary rule:

- `wb-card` is the canonical global container surface
- `wb-panel` is dashboard-shell-local, not a second global card primitive
- `wb-page-header` is a dashboard/header surface, not a generic page wrapper primitive

### Patterns

Patterns define real page jobs and expected regions.

Examples:

- auth shell
- dashboard shell
- settings shell
- content shell
- marketing/page-intro structures

Patterns are the primary integration surface for real screens.

## HTML / CSS / JS Separation

- HTML owns document structure and semantics
- CSS owns presentation and visible states
- JS owns interaction, visibility toggles, focus handling, keyboard control, and async behavior

Use HTML structure instead of a new class when the problem is only hierarchy, reading order, grouping, or heading semantics.

Use JS instead of CSS-only tricks when the problem is:

- open / close behavior
- focus trap
- keyboard navigation
- Escape handling
- outside click dismissal
- async state changes

## Aliases And Compatibility

Some compatibility names still ship.

Do not prefer them in primary examples.

Examples:

- prefer `wb-dashboard-shell` over `wb-shell`
- prefer `wb-sidebar-brand` over `wb-sidebar-header`
- prefer `wb-dropdown-end` over `wb-dropdown-menu-end`
- prefer modern tabs names over legacy tab aliases

## Theme Rules

Theme state lives on `<html>`.

Use:

- `data-mode`
- `data-accent`
- `data-preset`
- `data-radius`
- `data-density`
- `data-shadow`
- `data-font`
- `data-border`

Do not use `data-theme`.

## Breadcrumb And Header Rules

Canonical page-header stack:

- breadcrumb optional
- `wb-page-header-title` required
- subtitle optional
- actions optional

`wb-page-intro` uses its own display-heading contract:

- `wb-page-intro-title`
- `wb-page-eyebrow`
- `wb-page-lead`

Do not collapse those two title families into a single generic title class.

Keep breadcrumb secondary to the page title.

Topbar hierarchy rule:

- product first
- context second

## New Class Threshold

Only add a new class if all are true:

1. shipped composition cannot solve the problem cleanly
2. the need repeats across more than one screen or component
3. the new class has one clear contract
4. it does not duplicate an existing noun or alias
5. its job belongs clearly to one layer

Bad reasons:

- one-off spacing
- naming a region that HTML already describes
- slight visual variation on an existing primitive
- avoiding semantic HTML

## Review Checklist

1. Does the example use shipped classes only?
2. Is the vocabulary canonical instead of legacy?
3. Is the page starting from the correct shell?
4. Are layout helpers solving layout before utilities do?
5. Are forms using the canonical field system?
6. Are breadcrumb and page-header/page-intro title families kept separate?
7. Is product identity stronger than context in the topbar?
8. Are JS hooks source-accurate?
9. Does the example avoid non-shipped classes?
10. If a new class is proposed, did composition fail first?

## Related Docs

- `PRIMITIVES.md` explains the current classification model
- `PATTERNS.md` explains the current pattern and shell model
- `packages/webblocks/INTEGRATION.md` is the detailed package implementation reference
