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
- background media
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
- rating
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

`wb-background-media` is an opt-in visual primitive for an existing semantic root. It does not create a surface, change the root's layout, or make `wb-section` background-aware by default.

```html
<section
  class="wb-section wb-background-media wb-background-media--overlay-medium"
  style="--wb-background-media-image: url('/media/section.webp'); --wb-background-media-position: center;"
>
  ...
</section>
```

Boundary rules for `wb-background-media`:

- the host owns media selection, URL safety, and the semantic root
- the image is decorative; accessible content remains real child markup
- no overlay modifier means the soft default
- supported modifiers are `wb-background-media--overlay-none`, `wb-background-media--overlay-medium`, and `wb-background-media--overlay-strong`
- `--wb-background-media-position` defaults to `center`; hosts should allowlist accepted CSS positions
- do not add it when no background image custom property is present

Boundary rules for `wb-rich-text`:

- it is not a layout helper or a replacement for `wb-stack`
- it is not a pattern and it is not a WYSIWYG/editor contract
- it scopes body-copy rules to one wrapper instead of changing global typography
- headings, media, tables, buttons, figures, and larger composition blocks stay in their own primitives, surfaces, or patterns

Overlay boundary inside primitives:

- `wb-modal` = canonical top-layer primitive for confirms, forms, action dialogs, and content-first viewer usage
- `wb-overlay-root` is shared runtime infrastructure, not a public page-level primitive to author directly
- gallery viewer behavior belongs to `wb-modal` usage, while `wb-gallery` itself belongs to patterns
- slider behavior belongs to the `wb-slider` pattern plus interactive hooks, not to a primitive
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

Feedback and toast standard:

- transient success feedback belongs in a toast and must not push the topbar, page header, main content, cards, or forms downward
- validation errors and user-correctable failures belong inline at the top of the related form, card, or section using contextual feedback primitives such as `wb-alert`
- persistent warnings or blocking failures belong inline in the related card or section
- page-global alerts are reserved for truly global or system-level states
- toasts are not modals: no backdrop, focus trap, body scroll lock, or page interaction blocking
- toast containers should stay outside normal layout flow, preferably inside `#wb-overlay-root.wb-overlay-root`
- `.wb-overlay-layer.wb-overlay-layer--toast` is optional for applications that already manage overlay layers; it is not required for simple app markup
- dismiss controls must be real buttons with accessible labels

Canonical toast markup:

```html
<div id="wb-overlay-root" class="wb-overlay-root">
  <div class="wb-toast-container wb-toast-container-top-right" aria-live="polite" aria-atomic="true">
    <div class="wb-toast wb-toast-success" role="status">
      <div class="wb-toast-body">
        <strong class="wb-toast-title">Message sent</strong>
        <span>Thanks for your message.</span>
      </div>
      <button type="button" class="wb-toast-close" aria-label="Dismiss">×</button>
    </div>
  </div>
</div>
```

Compact single-message toast:

```html
<div class="wb-toast wb-toast-success" role="status">
  <div class="wb-toast-body">
    <span>Message sent. Thanks for your message.</span>
  </div>
  <button type="button" class="wb-toast-close" aria-label="Dismiss">×</button>
</div>
```

Link list leading visual standard:

- `wb-link-list-item` is a two-column row: `wb-link-list-main` beside `wb-link-list-desc`
- a row with a leading thumbnail or icon must also carry `wb-link-list-item--media`, which adds the leading column; without it the visual consumes the main column
- `wb-link-list-thumb` is the square image slot, `wb-link-list-icon` the icon slot; use one or the other, not both
- the host owns the `<img>`, its `src`, and its alt text
- below 960px the row keeps the leading column and the description spans the full width

```html
<a class="wb-link-list-item wb-link-list-item--media" href="/games/blockfall">
  <img class="wb-link-list-thumb" src="/media/blockfall.jpg" alt="">
  <div class="wb-link-list-main">
    <span class="wb-link-list-title">Blockfall</span>
    <span class="wb-link-list-meta">Arcade puzzle</span>
  </div>
  <div class="wb-link-list-desc">Turn, stack, and clear glowing rows.</div>
</a>
```

Promo split standard:

- `wb-promo` is the promo/hero panel: copy on one side, actions on the other
- `wb-promo--split` switches it to copy beside a foreground image and left-aligns the actions
- the image column is `wb-promo-media`; the host owns the `<img>`, its `src`, and its alt text
- use `wb-promo--split` for a foreground image; keep the plain `wb-promo` when the image is a background
- the split grid collapses to one column at 900px

```html
<section class="wb-card wb-promo wb-promo--split">
  <div class="wb-card-body wb-promo-copy wb-stack wb-gap-3">
    <h1 class="wb-promo-title">Ship faster</h1>
    <p class="wb-promo-text">Composable content operations.</p>
    <div class="wb-promo-actions wb-cluster wb-cluster-2">
      <a class="wb-btn wb-btn-primary" href="/signup">Get started</a>
    </div>
  </div>
  <figure class="wb-promo-media"><img src="/media/hero.jpg" alt=""></figure>
</section>
```

Rating standard:

- `wb-rating` is the canonical star rating primitive, split into a read-only average display and an interactive input
- `wb-rating-stars` is the read-only average: five stars with a partial gold fill driven by `--wb-rating-value` (a percentage), plus `role="img"` and an `aria-label` carrying the numeric average
- `wb-rating-input` is a no-JavaScript input where each star is its own submit control; hover fills the pointed star and every star before it, and `aria-pressed="true"` on a star persists a chosen value on re-render
- the input degrades safely without JavaScript because each star is a real submit button; enhanced JS is optional, not required
- colors and size are host-overridable per instance with `--wb-rating-color` (filled), `--wb-rating-empty` (unfilled, defaults to `--wb-border`), and `--wb-rating-size`
- `wb-rating` carries no form logic, endpoints, storage, or CSRF; the host owns the form action, hidden fields, submission, aggregation, and any per-visitor rules
- it is a primitive, not a pattern: it does not own a visible heading, card chrome, or summary copy — compose those with neighboring primitives and surfaces

Canonical read-only average:

```html
<span class="wb-rating-stars" style="--wb-rating-value: 86%"
      role="img" aria-label="Average 4.3 out of 5"></span>
```

Canonical interactive input:

```html
<form class="wb-rating-input" method="post" action="/ratings">
  <button type="submit" name="rating_value" value="1" aria-label="1 star">★</button>
  <button type="submit" name="rating_value" value="2" aria-label="2 stars">★</button>
  <button type="submit" name="rating_value" value="3" aria-label="3 stars">★</button>
  <button type="submit" name="rating_value" value="4" aria-label="4 stars">★</button>
  <button type="submit" name="rating_value" value="5" aria-label="5 stars">★</button>
</form>
```

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
- `wb-slider`
- `wb-page-intro`
- marketing families such as `wb-hero` and footer structures
- topbar compositions such as `wb-language-switcher`, `wb-auth-entry`, and `wb-user-menu`

Topbar menu boundary:

- `wb-dropdown`, `wb-topbar-action`, `wb-topbar-user`, and `wb-avatar` remain the underlying primitives
- `wb-language-switcher`, `wb-auth-entry`, and `wb-user-menu` only standardize their composition inside application topbars
- WebBlocks UI owns layout, variants, responsive presentation, and dropdown interaction
- host applications own locale URLs, current-language copy, user data, authorization, menu visibility, CSRF, and logout behavior

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
- `data-wb-slider`
- `data-wb-slider-prev`
- `data-wb-slider-next`
- `data-wb-slider-dots`
- `data-wb-cookie-consent`
- `data-wb-cookie-consent-open`
- `data-wb-cookie-consent-accept`
- `data-wb-cookie-consent-reject`
- `data-wb-cookie-consent-save`
- `data-wb-update-indicator`
- `data-wb-update-indicator-url`
- `data-wb-update-indicator-label`

These are not UI primitives.
They are interaction hooks owned by shipped JS and attribute-driven CSS behavior.

Cookie Consent classification rule:

- Cookie Consent is not a primitive
- it is a pattern plus interactive hooks
- it composes `wb-card`, `wb-btn`, form controls, layout primitives, and one `wb-modal` preference center

Slider classification rule:

- Slider is not a primitive
- it is a pattern plus interactive hooks
- it composes media, buttons, icons, layout helpers, and normal content inside each `wb-slide-content` slot
- `wb-slider-viewport` and `wb-slider-track` are pattern anatomy for movement, not generic layout helpers

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
