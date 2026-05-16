# WebBlocks UI — Primitive Boundary Map

## Purpose

This file defines what counts as a primitive, what does not, and where the current shipped families belong.

Source of truth:

- `packages/webblocks/src/css/`
- `packages/webblocks/src/js/`
- `packages/webblocks/build.sh`

## Classification Model

WebBlocks uses these buckets:

1. Foundation
2. Layout helpers
3. UI primitives
4. Surfaces
5. Patterns
6. Interactive hooks

## Foundation

Foundation is not a primitive layer.

Foundation includes:

- tokens
- dark mode overrides
- accent, preset, radius, density, shadow, font, border axes
- reset
- global element styling

Foundation sets system rules. It does not provide page building blocks by itself.

## Layout Helpers

Layout helpers are not UI primitives.

They solve structure and flow only.

Canonical layout helpers:

- `wb-container*`
- `wb-section*`
- `wb-stack*`
- `wb-cluster*`
- `wb-split`
- `wb-grid*`
- `wb-grid-auto*`
- `wb-row`
- `wb-col-*`

## UI Primitives

A primitive is a reusable UI building block with a clear local contract.

Canonical primitive families include:

- button
- badge
- media
- form controls and field system
- table
- modal
- dropdown
- tabs
- accordion
- collapse
- breadcrumb
- pagination
- avatar
- toast
- divider
- popover
- drawer
- radio-card
- action controls
- local editorial body copy
- icons

Examples:

- `wb-btn`
- `wb-media`
- `wb-input`
- `wb-table`
- `wb-modal`
- `wb-dropdown`
- `wb-tabs`
- `wb-pagination`
- `wb-rich-text`

Primitives are controls and local UI contracts.

They are not framed content regions.

`wb-rich-text` is a CSS-only scoped typography primitive for sanitized editorial body copy.

Boundary rules for `wb-rich-text`:

- it is not a layout helper or a replacement for `wb-stack`
- it is not a pattern and it is not a WYSIWYG/editor contract
- it scopes body-copy rules to one wrapper instead of changing global typography
- headings, media, tables, buttons, figures, and larger composition blocks stay in their own primitives, surfaces, or patterns

Overlay boundary inside primitives:

- `wb-modal` = canonical top-layer primitive for confirms, forms, action dialogs, and content-first viewer usage
- `wb-overlay-root` is shared runtime infrastructure, not a public page-level primitive to author directly
- gallery viewer behavior belongs to `wb-modal` usage, while `wb-gallery` itself belongs to patterns
- cookie consent preference centers also belong to `wb-modal` usage, while `wb-cookie-consent` itself belongs to patterns plus interactive hooks

Overlay Stack Standard:

- `wb-modal` remains the canonical public top-layer primitive for focused dialog-like experiences
- `wb-overlay-root` remains shared runtime infrastructure and is not authored as a public page primitive
- runtime-owned overlays that can escape normal flow must mount, portal, or hoist into `#wb-overlay-root` when enhanced JS behavior is active
- nested overlays must not remain clipped by local containers, cards, drawers, or parent modal bodies
- a nested modal, picker, or dialog must render above the opener overlay, not inside its visual clipping context
- only the topmost overlay receives pointer and keyboard interaction
- Escape closes the topmost overlay first
- body scroll locking must be stack-aware
- focus should return to the opener of the overlay that just closed when practical
- `wb:overlay:close-request` is the canonical overlay-level hook for unsaved-change guards before user-initiated overlay close attempts
- host apps own dirty-state policy and any follow-up confirmation UI; a save/discard-confirmed programmatic close should not trigger `wb:overlay:close-request`
- backdrop and modal stacking must be deterministic rather than relying only on incidental DOM order
- do not introduce a public `wb-overlay` primitive or a second lightbox/viewer primitive beside `wb-modal`
- do not teach `panel` as a generic public noun; `panel` may remain only in scoped internal names such as `wb-popover-panel`, `wb-collapse-panel`, or `wb-auth-panel`

## Surfaces

Surfaces are visible structured regions that are larger than a single primitive but smaller than a full page pattern.

Canonical surfaces include:

- `wb-card`
- `wb-stat`
- `wb-toolbar`
- `wb-filter-bar`
- `wb-callout`
- `wb-empty`
- `wb-list`
- `wb-link-list`
- `wb-promo`
- `wb-page-header`
- `wb-settings-section`

Boundary rules:

- `wb-card` is a surface, not a primitive
- `wb-card` is the canonical global container surface and the only generic framed surface noun
- dashboard work areas still use `wb-card`
- `wb-page-header` is a page-context surface, not a generic layout helper
- `wb-settings-section` belongs to settings-shell vocabulary
- page-header titles and page-intro titles are family-specific contracts, not one shared generic title primitive

## Framed Surface Naming Rule

- `wb-card` is the ONLY generic framed surface.
- `wb-panel` is forbidden as a generic class.
- `wb-box` is forbidden as a generic class.
- `*-panel` naming is allowed ONLY for component-internal parts such as `wb-popover-panel`, `wb-collapse-panel`, `wb-auth-panel`, or other scoped pattern/component structures.

DO:

```html
<div class="wb-card">...</div>
```

DO NOT:

```html
<div class="wb-panel">...</div>
<div class="wb-box">...</div>
```

## What Is Not A Primitive

These are not primitives even if they are reusable:

- `wb-card`
- `wb-callout`
- `wb-stat`
- `wb-toolbar`
- `wb-filter-bar`
- `wb-empty`
- `wb-list`
- `wb-link-list`

They are surfaces because they group content as visible framed regions.

## Patterns

Patterns are screen-level or page-level compositions.

Canonical pattern families:

- `wb-auth-shell`
- `wb-dashboard-shell`
- `wb-settings-shell`
- `wb-content-shell`
- `wb-cookie-consent`
- `wb-page-intro`
- marketing families such as `wb-hero` and footer structures

Patterns are what users should usually start from for real pages.

## Interactive Hooks

Some shipped behavior contracts are not class-first.

Examples:

- `data-wb-toggle`
- `data-wb-target`
- `data-wb-dismiss`
- `data-wb-tooltip`
- `data-wb-collapse`
- `data-wb-nav-group`
- `data-wb-ajax-toggle`
- `data-wb-password-toggle`
- `data-wb-cookie-consent`
- `data-wb-cookie-consent-open`
- `data-wb-cookie-consent-accept`
- `data-wb-cookie-consent-reject`
- `data-wb-cookie-consent-save`

These are not UI primitives.
They are interaction hooks owned by shipped JS and attribute-driven CSS behavior.

Cookie Consent classification rule:

- Cookie Consent is not a primitive
- it is a pattern plus interactive hooks
- it composes `wb-card`, `wb-btn`, form controls, layout primitives, and one `wb-modal` preference center

## What Is Not Canonical Primitive Vocabulary

Do not treat these as current canonical primitive contracts:

- `wb-page`
- `wb-page-center`
- `wb-btn-block`
- `wb-stack-sm`
- `wb-stack-md`
- `wb-align-center`
- `wb-checkbox`
- a second framed-surface noun beside `wb-card`
- a generic page-title class shared across page-header and page-intro contexts

## Alias Rules

Aliases may ship, but they are not equal canonical vocabulary.

Examples:

- `wb-shell*` is legacy compatibility for dashboard shell
- `wb-sidebar-header` is an older alias beside `wb-sidebar-brand`
- old tab names remain compatible but should not be the first documented path

## Practical Rule

When choosing between two valid nouns:

- prefer the more global, clearer, more reusable canonical family
- prefer `wb-card` over any second framed-surface synonym
- prefer shell vocabulary only inside its shell boundary

## Final Model

WebBlocks is not primitive-first in usage.

It is:

- pattern-first for real pages
- primitive-based for composition
- utility-supported for small adjustments
- enforced by shipped source, not by invented examples
