# WebBlocks UI - Integration Reference

Implementation-accurate integration guide for developers and AI agents using shipped WebBlocks UI assets.

This document is sourced from `packages/webblocks/src/` and `packages/webblocks/build.sh`, not from docs pages.

---

## Installation

### Local dist files

```html
<link rel="stylesheet" href="dist/webblocks-ui.css">
<link rel="stylesheet" href="dist/webblocks-icons.css">
<script src="dist/webblocks-ui.js" defer></script>
```

### CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fklavyenet/webblocks-ui@v2.3.11/dist/webblocks-ui.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fklavyenet/webblocks-ui@v2.3.11/dist/webblocks-icons.css">
<script src="https://cdn.jsdelivr.net/gh/fklavyenet/webblocks-ui@v2.3.11/dist/webblocks-ui.js" defer></script>
```

Notes:

- `webblocks-icons.css` is optional unless you use `<i class="wb-icon wb-icon-*">`
- `webblocks-ui.css` already includes tokens, UI primitive source output, layouts, utilities, and the scoped `webgames` extension classes
- `webblocks-ui.js` exposes `window.*` APIs and data-attribute behavior for interactive patterns

---

## Starting Point

Start from patterns, not primitives.

Use [`../../PATTERNS.md`](../../PATTERNS.md) to choose a canonical auth, dashboard, form, or marketing starting point first. Use this file after that to confirm the shipped primitive, shell, utility, and API names.

---

## Core Rules

- every public class uses the `wb-` prefix
- use semantic HTML first, then apply WebBlocks classes
- compose layouts with shipped primitives first: `wb-stack`, `wb-cluster`, `wb-split`, `wb-grid`, `wb-grid-auto`
- introduce custom wrapper classes only as a last resort after primitive composition is exhausted
- use design tokens and shipped utilities instead of hardcoded colors, radii, or spacing
- interactive behavior is opt-in through `data-wb-*` attributes or `window.WB*` APIs
- build order is strict: foundation -> base -> UI primitive source files -> layouts -> scoped extensions -> utilities
- if you modify source CSS, JS, or icons in this package, rebuild `dist/` with `./build.sh`

### Canonical Vocabulary

Use these nouns first in examples, reviews, and generated markup:

- shells: `wb-auth-shell`, `wb-dashboard-shell`, `wb-settings-shell`, `wb-content-shell`
- layout helpers: `wb-container`, `wb-section`, `wb-stack`, `wb-cluster`, `wb-split`, `wb-grid`, `wb-grid-auto`, `wb-row`, `wb-col-*`
- global surfaces: `wb-card`, `wb-stat`, `wb-toolbar`, `wb-filter-bar`, `wb-callout`, `wb-empty`, `wb-list`
- shell-local surfaces: `wb-page-header`, `wb-settings-section`
- controls: `wb-btn`, `wb-input`, `wb-select`, `wb-textarea`, `wb-table`, `wb-media`, `wb-overlay`, `wb-dropdown`, `wb-tabs`, `wb-modal`, `wb-drawer`, `wb-popover`, `wb-toast`, `wb-accordion`, `wb-collapse`
- navigation: `wb-navbar`, `wb-sidebar`, `wb-section-nav`, `wb-nav-group`, `wb-menu`, `wb-breadcrumb`, `wb-pagination`

### Classification Rule

Public classification follows UI job:

- primitives = atomic controls and local UI contracts
- surfaces = framed content regions
- patterns = page-level compositions

File structure does not define public classification.

### Forbidden Vocabulary In New Docs

Do not introduce or teach these as current canonical classes:

- `wb-page`
- `wb-page-center`
- `wb-btn-block`
- `wb-stack-sm`
- `wb-stack-md`
- `wb-align-center`
- `wb-checkbox`
- a second framed-surface noun beside `wb-card`
- a generic page-title class shared across page-header and page-intro contexts

### Boundary Rules

- `wb-card` is the canonical global container surface and the only generic framed surface noun
- dashboard work areas also use `wb-card`; do not introduce a second dashboard-only framed surface family
- `wb-page-header` is a page-context surface, not a generic layout wrapper
- `wb-page-header-title` belongs only to `wb-page-header`; `wb-page-intro-title` belongs only to `wb-page-intro`
- `wb-settings-section` belongs to the settings-shell vocabulary
- `data-wb-*` attributes are behavior hooks, not primitive class families
- aliases may still ship, but they are not equal canonical vocabulary in primary examples

### Surface Layer

Surfaces are framed content regions.

They are reusable, but they are not primitives.

Global surfaces:

- `wb-card`
- `wb-callout`
- `wb-stat`
- `wb-toolbar`
- `wb-filter-bar`
- `wb-empty`
- `wb-list`
- `wb-link-list`

Pattern-local surfaces:

- `wb-page-header`
- `wb-settings-section`

Strict rules:

- surfaces must not be treated as primitives, even if they live in `src/css/primitives/`
- classify by UI role, not by file path

### New Class Threshold

Add a new class only when all are true:

1. shipped composition cannot solve the problem cleanly
2. the need repeats across more than one screen or component
3. the new class has one clear contract
4. the name does not duplicate an existing noun or alias
5. the job belongs clearly to one layer

---

## Theme System

Theme state lives on the root `<html>` element.

| Attribute | Values | Notes |
|---|---|---|
| `data-mode` | `light` \| `dark` \| `auto` | default is `auto` |
| `data-accent` | `ocean` \| `forest` \| `sunset` \| `royal` \| `mint` \| `amber` \| `rose` \| `slate-fire` | default is `ocean` |
| `data-preset` | `modern` \| `minimal` \| `editorial` \| `playful` \| `corporate` | optional bundle of axis values |
| `data-radius` | `sharp` \| `soft` | omit attribute for default |
| `data-density` | `compact` \| `comfortable` | omit attribute for default |
| `data-shadow` | `flat` \| `soft` | omit attribute for default |
| `data-font` | `system` \| `modern` \| `editorial` | default is `modern` |
| `data-border` | `none` \| `subtle` \| `medium` \| `bold` \| `dashed` | default comes from tokens |

Example:

```html
<html data-mode="dark" data-accent="forest" data-density="compact">
```

Important:

- `data-mode` is correct; `data-theme` does nothing
- JS setters also accept `default` for `radius`, `density`, and `shadow`; the theme engine removes the matching attribute to return to default
- presets set multiple axes at once, then individual axis setters can override them

Theme button hooks supported by `WBTheme`:

```html
<button data-wb-mode-set="dark">Dark</button>
<button data-wb-mode-cycle>Cycle mode</button>
<button data-wb-preset-set="editorial">Editorial</button>
<button data-wb-accent-set="forest">Forest</button>
<button data-wb-radius-set="soft">Soft</button>
<button data-wb-radius-set="default">Default radius</button>
<button data-wb-density-set="compact">Compact</button>
<button data-wb-shadow-set="soft">Soft shadow</button>
<button data-wb-font-set="editorial">Editorial font</button>
```

---

## Design Tokens

Never hardcode colors or layout values inside WebBlocks source CSS.

| Group | Common tokens |
|---|---|
| surfaces | `--wb-bg`, `--wb-surface`, `--wb-surface-2`, `--wb-surface-3`, `--wb-overlay` |
| text | `--wb-text`, `--wb-muted`, `--wb-white`, `--wb-black` |
| border | `--wb-border` |
| accent | `--wb-accent`, `--wb-accent-hover`, `--wb-accent-active`, `--wb-accent-soft`, `--wb-accent-softer`, `--wb-accent-border`, `--wb-accent-text`, `--wb-accent-on`, `--wb-accent-ring`, `--wb-accent-ring-rgb`, `--wb-accent-selection`, `--wb-accent-glow-rgb` |
| backward-compat aliases | `--wb-primary`, `--wb-primary-dark`, `--wb-primary-soft` |
| semantic | `--wb-success`, `--wb-success-dark`, `--wb-success-soft`, and same pattern for `warning`, `danger`, `info` |
| spacing | `--wb-s1` through `--wb-s20` |
| radius | `--wb-r-sm`, `--wb-r-md`, `--wb-r-lg`, `--wb-r-xl`, `--wb-r-full` |
| shadows | `--wb-shadow-sm`, `--wb-shadow-md`, `--wb-shadow-lg`, `--wb-shadow-xl` |
| typography | `--wb-font`, `--wb-font-heading`, `--wb-font-mono`, `--wb-font-size-xs` through `--wb-font-size-xl` |
| layout | `--wb-sidebar-w`, `--wb-content-w` |
| z-index | `--wb-z-dropdown`, `--wb-z-modal`, `--wb-z-toast` |

Use `--wb-accent*` in new code. `--wb-primary*` exists for backward compatibility.

---

## Canonical UI Primitives And Patterns

### Buttons

```html
<button class="wb-btn wb-btn-primary">Save</button>
<button class="wb-btn wb-btn-secondary">Cancel</button>
<button class="wb-btn wb-btn-ghost">Ghost</button>
<button class="wb-btn wb-btn-outline">Outline</button>
<button class="wb-btn wb-btn-danger">Delete</button>
<button class="wb-btn wb-btn-success">Publish</button>
<button class="wb-btn wb-btn-primary wb-btn-sm">Small</button>
<button class="wb-btn wb-btn-primary wb-btn-lg">Large</button>
<button class="wb-btn wb-btn-secondary wb-btn-icon" aria-label="Edit">
  <i class="wb-icon wb-icon-pencil" aria-hidden="true"></i>
</button>
```

Also shipped:

- `wb-btn-group`
- `wb-btn-group-join`

### Badges

```html
<span class="wb-badge">Draft</span>
<span class="wb-badge wb-badge-primary">New</span>
<span class="wb-badge wb-badge-success wb-badge-dot">Active</span>
<span class="wb-badge wb-badge-warning">Pending</span>
<span class="wb-badge wb-badge-danger">Failed</span>
<span class="wb-badge wb-badge-info wb-badge-lg">Info</span>
```

### Cards and Stats

```html
<div class="wb-card">
  <div class="wb-card-header">
    <h2 class="wb-card-title">Project</h2>
  </div>
  <div class="wb-card-body">Content</div>
  <div class="wb-card-footer">Footer actions</div>
</div>

<div class="wb-stat">
  <span class="wb-stat-label">Revenue</span>
  <strong class="wb-stat-value">$24.8k</strong>
  <span class="wb-stat-delta wb-stat-delta-up">+12%</span>
</div>
```

Useful modifiers:

- `wb-card-flat`
- `wb-card-muted`
- `wb-card-highlight`
- `wb-card-accent`

### Alerts and Callouts

```html
<div class="wb-alert wb-alert-info">Info message</div>
<div class="wb-alert wb-alert-success">Success message</div>
<div class="wb-alert wb-alert-warning">Warning message</div>
<div class="wb-alert wb-alert-danger">Error message</div>

<div class="wb-callout wb-callout-accent">
  <strong class="wb-callout-title">Note</strong>
  Keep integration rules close to real source behavior.
</div>
```

For dismissible alerts, use `data-wb-dismiss="alert"` on the close button.

### Forms

Canonical field markup:

```html
<div class="wb-field">
  <label class="wb-label" for="email">
    Email
    <span class="wb-label-hint">Used for notifications</span>
  </label>
  <input id="email" class="wb-input" type="email" placeholder="you@example.com">
  <div class="wb-field-meta">
    <div class="wb-field-hint">We never share your email.</div>
    <div class="wb-field-error">Required</div>
  </div>
</div>
```

`wb-field` is a three-slot contract:

- label row
- control row
- `wb-field-meta` row

Use `wb-field-meta` as the only assistive-content area under the control.
This keeps sibling fields in the same `wb-form-row` visually aligned even when one field has a hint, an error, both, or neither.
Do not place `wb-field-hint` or `wb-field-error` directly under `wb-field`.
In stacked single-column forms, an empty `wb-field-meta` is usually unnecessary.

Shipped form primitives:

- `wb-field`, `wb-label`, `wb-label-hint`, `wb-field-meta`, `wb-field-hint`, `wb-field-error`
- `wb-input`, `wb-select`, `wb-textarea`
- `wb-input-sm`, `wb-input-lg`, `wb-select-sm`, `wb-select-lg`
- `wb-input-error`, `wb-select-error`, `wb-textarea-error`
- `wb-form-row`, `wb-form-group`
- `wb-check`, `wb-radio`, `wb-switch`
- `wb-input-wrap`, `wb-input-icon`, `wb-input-suffix`
- `wb-input-group`, `wb-input-addon`, `wb-input-addon-btn`

Meta-area rule:

- place `wb-field-hint` and `wb-field-error` inside `wb-field-meta`
- use hint first, then error when both are present
- include an empty `wb-field-meta` in aligned multi-column rows when a sibling field uses assistive text
- omit empty `wb-field-meta` in stacked forms when no assistive content is present
- direct `wb-field-hint` or `wb-field-error` children under `wb-field` are not valid canonical markup

Auth rule:

- auth forms MUST use the canonical `wb-field` / `wb-label` / `wb-input` / `wb-field-meta` / `wb-field-error` system
- DO NOT create auth-only field systems such as `guest-auth-*`, `qz-auth-*`, or other parallel naming schemes

Password visibility rule:

- password visibility belongs to the standard field and input-group contract, not an auth-only helper layer
- use a trailing `wb-input-addon-btn` button with `data-wb-password-toggle`
- point the button at the input with `data-wb-target="#field-id"`
- start hidden with `type="password"`, `aria-pressed="false"`, and `wb-icon-eye`
- visible state becomes `type="text"`, `aria-pressed="true"`, and `wb-icon-eye-off`
- canonical show/hide icon names are `wb-icon-eye` and `wb-icon-eye-off`

Examples:

```html
<div class="wb-form-row">
  <div class="wb-field">
    <label class="wb-label" for="first-name">First name</label>
    <input id="first-name" class="wb-input" type="text">
    <div class="wb-field-meta">
      <div class="wb-field-hint">Shown in member lists and activity logs.</div>
    </div>
  </div>
  <div class="wb-field">
    <label class="wb-label" for="last-name">Last name</label>
    <input id="last-name" class="wb-input" type="text">
    <div class="wb-field-meta"></div>
  </div>
</div>

<div class="wb-input-group">
  <span class="wb-input-addon">https://</span>
  <input class="wb-input" type="text" value="example.com">
</div>

<div class="wb-field">
  <label class="wb-label" for="account-password">Password</label>
  <div class="wb-input-group">
    <input class="wb-input" id="account-password" type="password" autocomplete="current-password">
    <button class="wb-btn wb-btn-secondary wb-input-addon-btn wb-btn-icon"
            type="button"
            data-wb-password-toggle
            data-wb-target="#account-password"
            aria-label="Show password"
            aria-pressed="false">
      <i class="wb-icon wb-icon-eye" aria-hidden="true"></i>
    </button>
  </div>
  <div class="wb-field-meta">
    <div class="wb-field-hint">Use the shipped input-group toggle instead of page-local show/hide scripts.</div>
  </div>
</div>

<label class="wb-check">
  <input type="checkbox">
  <span>Send me updates</span>
</label>

<label class="wb-switch">
  <input type="checkbox">
  <span class="wb-switch-track"></span>
  <span>Enable API access</span>
</label>

<div class="wb-input-wrap">
  <span class="wb-input-icon"><i class="wb-icon wb-icon-search" aria-hidden="true"></i></span>
  <input class="wb-input" type="search" placeholder="Search">
</div>
```

### Tables, Filters, Toolbars, Actions

```html
<div class="wb-filter-bar">
  <div class="wb-filter-bar-start">
    <div class="wb-search-bar wb-search-bar-full">
      <span class="wb-search-bar-icon"><i class="wb-icon wb-icon-search" aria-hidden="true"></i></span>
      <input class="wb-search-bar-input" type="search" placeholder="Search users">
    </div>
    <select class="wb-filter-select">
      <option>All roles</option>
    </select>
    <button class="wb-filter-chip is-active">Active</button>
  </div>
  <div class="wb-filter-bar-end">
    <span class="wb-filter-results">24 results</span>
  </div>
</div>

<div class="wb-table-wrap">
  <div class="wb-toolbar wb-toolbar-inset">
    <div class="wb-toolbar-start">
      <h2 class="wb-toolbar-title">Users</h2>
      <p class="wb-toolbar-subtitle">24 active accounts</p>
    </div>
    <div class="wb-toolbar-end">
      <button class="wb-btn wb-btn-primary wb-btn-sm">Add user</button>
    </div>
  </div>

  <table class="wb-table wb-table-hover wb-table-striped">
    <thead>
      <tr><th>Name</th><th>Status</th><th></th></tr>
    </thead>
    <tbody>
      <tr>
        <td>Atlas</td>
        <td><span class="wb-status-pill wb-status-active">Active</span></td>
        <td>
          <div class="wb-action-group">
            <a class="wb-action-btn wb-action-btn-edit" href="#" aria-label="Edit">
              <i class="wb-icon wb-icon-pencil" aria-hidden="true"></i>
            </a>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

Table surface rule:

- `wb-table-wrap` owns border, radius, background, and clipping
- a toolbar inside `wb-table-wrap` is a control row, not a second surface
- table header cells are a header band only; they must not add their own corner radius

Text casing rule:

- casing is content-defined; UI primitives and patterns must not force uppercase or capitalize transforms
- use weight, size, spacing, and color for emphasis instead of rewriting content
- metadata labels and eyebrows should read as quiet hierarchy markers, not body text or mini-headings

Common related classes:

- table: `wb-table-hover`, `wb-table-striped`, `wb-table-sm`
- toolbar: `wb-toolbar-sm`, `wb-toolbar-bulk`, `wb-toolbar-bulk-count`, `wb-toolbar-bulk-clear`
- filter bar: `wb-filter-count`, `wb-search-bar-sm`, `wb-search-bar-lg`
- actions: `wb-action-link`, `wb-action-link-danger`, `wb-action-more`, `wb-action-more-btn`, `wb-table-check-cell`

### Dropdowns

```html
<div class="wb-dropdown">
  <button class="wb-btn wb-btn-secondary" data-wb-toggle="dropdown" data-wb-target="#actions-menu" aria-expanded="false">
    Actions
  </button>
  <div class="wb-dropdown-menu" id="actions-menu">
    <a href="#" class="wb-dropdown-item">Edit</a>
    <a href="#" class="wb-dropdown-item is-active">Current view</a>
    <hr class="wb-dropdown-divider">
    <button class="wb-dropdown-item wb-dropdown-item-danger">Delete</button>
  </div>
</div>
```

Optional explicit target:

```html
<div class="wb-dropdown wb-dropdown-end">
  <button data-wb-toggle="dropdown" data-wb-target="#account-menu" aria-expanded="false">Account</button>
  <div class="wb-dropdown-menu" id="account-menu">...</div>
</div>
```

Notes:

- canonical wrapper helper is `wb-dropdown-end`
- `wb-dropdown-menu-end` is the older alternative alias on the menu itself
- if `data-wb-target` is omitted, the JS looks for the first `.wb-dropdown-menu` in the same `.wb-dropdown`
- right alignment can use `wb-dropdown-end` on the wrapper or `wb-dropdown-menu-end` on the menu
- with JS enabled, the active visible dropdown menu node is rendered under the shared `#wb-overlay-root` anchored layer so it does not clip inside cards, shells, or other local containers

### Overlays, Modals, and Confirmation Dialogs

Overlay architecture in this package has three layers:

- `wb-overlay-root` = shared top-layer infrastructure root used by floating and portaled UI
- `wb-modal` = canonical public dialog pattern for structured modal UI
- `wb-overlay` = canonical public content-first overlay pattern for viewer-style experiences

They are related, but they are not the same thing.

Use `wb-modal` for:

- confirmation dialogs
- form modals
- action/decision flows
- settings/help dialogs with explicit modal chrome and footer actions

Canonical modal example:

```html
<button class="wb-btn wb-btn-primary" data-wb-toggle="modal" data-wb-target="#delete-modal">
  Open modal
</button>

<div class="wb-modal wb-modal-sm" id="delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
  <div class="wb-modal-dialog">
    <div class="wb-modal-header">
      <h2 class="wb-modal-title" id="delete-modal-title">Delete item</h2>
      <button class="wb-modal-close" data-wb-dismiss="modal" aria-label="Close">&times;</button>
    </div>
    <div class="wb-modal-body">This action cannot be undone.</div>
    <div class="wb-modal-footer">
      <button class="wb-btn wb-btn-secondary" data-wb-dismiss="modal">Cancel</button>
      <button class="wb-btn wb-btn-danger">Delete</button>
    </div>
  </div>
</div>
```

Sizes go on the `.wb-modal` wrapper:

- `wb-modal-sm`
- `wb-modal-lg`
- `wb-modal-xl`

Confirmation pattern:

```html
<div class="wb-modal wb-confirm" id="confirm-publish" role="alertdialog" aria-modal="true">
  <div class="wb-modal-dialog">
    <div class="wb-modal-body">
      <div class="wb-confirm-icon wb-confirm-icon-warning">!</div>
      <div class="wb-confirm-title">Publish now?</div>
      <p class="wb-confirm-message">This will make the content visible immediately.</p>
    </div>
    <div class="wb-modal-footer">
      <button class="wb-btn wb-btn-secondary" data-wb-dismiss="modal">Cancel</button>
      <button class="wb-btn wb-btn-primary">Publish</button>
    </div>
  </div>
</div>
```

`wb-overlay` is for content-first focus states where the content itself is primary and dialog chrome is secondary.

Use it for:

- media viewers and lightbox-style enlargement with `wb-media`
- minimal-chrome viewer overlays
- content-first focus surfaces where footer/button chrome should stay minimal

Do not use `wb-overlay` as a casual replacement for structured modal dialogs that already fit `wb-modal`.

Canonical media viewer:

```html
<figure class="wb-media">
  <button class="wb-btn wb-btn-ghost wb-block wb-w-full wb-p-0" type="button" data-wb-overlay-open="media-viewer-1" aria-label="Open dashboard overview">
    <img class="wb-media-img" src="/images/demo-shot.jpg" alt="Analytics dashboard with KPI cards and a weekly chart">
  </button>
  <figcaption class="wb-media-caption">Open the media in a focused overlay.</figcaption>
</figure>

<div class="wb-overlay" id="media-viewer-1" hidden>
  <div class="wb-overlay-backdrop" data-wb-overlay-close></div>

  <div class="wb-overlay-dialog wb-overlay-dialog-media" role="dialog" aria-modal="true" aria-labelledby="media-viewer-1-title">
    <button class="wb-overlay-close" type="button" aria-label="Close" data-wb-overlay-close>
      <i class="wb-icon wb-icon-x" aria-hidden="true"></i>
    </button>

    <div class="wb-overlay-body">
      <figure class="wb-media">
        <img class="wb-media-img" src="/images/demo-shot.jpg" alt="Analytics dashboard with KPI cards and a weekly chart">
        <figcaption class="wb-media-caption" id="media-viewer-1-title">Dashboard overview enlarged inside the canonical overlay shell.</figcaption>
      </figure>
    </div>
  </div>
</div>
```

Minimal subparts:

- `wb-overlay` = viewport overlay wrapper
- `wb-overlay-backdrop` = backdrop layer and close target
- `wb-overlay-dialog` = centered content/viewer shell
- `wb-overlay-body` = scrollable content region
- `wb-overlay-close` = explicit close affordance

Optional subparts:

- `wb-overlay-header`
- `wb-overlay-title`
- `wb-overlay-footer`

These optional subparts exist for the cases that need them, but the primary overlay job is still content-first rather than footer/action-first.

Behavior contract:

- open with `data-wb-overlay-open="overlay-id"`
- close with `data-wb-overlay-close`
- `WBOverlay.open(elOrId)` and `WBOverlay.close(elOrId)` are available for imperative control
- ESC closes the active overlay
- backdrop click closes the active overlay when the backdrop uses `data-wb-overlay-close`
- focus moves into the overlay on open and returns to the opener on close
- body scroll locks while an overlay is open

Accessibility baseline:

- put `role="dialog"` and `aria-modal="true"` on `.wb-overlay-dialog`
- provide a real label through `aria-labelledby` or `aria-label`
- always include a visible close control; do not rely only on backdrop click
- keep inactive overlays `hidden`

Do:

- keep `wb-modal` as the first choice for confirms, forms, and action dialogs
- treat `wb-overlay` as the content-first shell for media viewers and similar viewer states
- keep overlay content semantically honest
- use `wb-media` inside media-viewer overlays instead of overlay-local image classes

Do not:

- demote `wb-modal` when the job is still a modal dialog
- invent a separate `wb-lightbox` system for the same job
- present `wb-overlay` and `wb-modal` as interchangeable defaults
- rely only on clicking outside to close
- hide close behavior in app-local scripts
- duplicate the same content once for inline display and again for the viewer unless the real UX requires it

### Drawers

`wb-drawer` remains the shipped side-sheet primitive.

Use it when the overlay job is specifically an edge-attached panel rather than a centered dialog or content-first viewer. `wb-modal` remains the dialog-focused choice; `wb-overlay` remains the viewer/content-first choice.

```html
<button class="wb-btn wb-btn-secondary" data-wb-toggle="drawer" data-wb-target="#settings-drawer">
  Open drawer
</button>

<div class="wb-drawer wb-drawer-right" id="settings-drawer" role="dialog" aria-modal="true" aria-labelledby="settings-drawer-title">
  <div class="wb-drawer-header">
    <h2 class="wb-drawer-title" id="settings-drawer-title">Settings</h2>
    <button class="wb-drawer-close" data-wb-dismiss="drawer" aria-label="Close">&times;</button>
  </div>
  <div class="wb-drawer-body">...</div>
  <div class="wb-drawer-footer">
    <button class="wb-btn wb-btn-secondary" data-wb-dismiss="drawer">Cancel</button>
    <button class="wb-btn wb-btn-primary">Save</button>
  </div>
</div>

```

### Tabs

Preferred modern pattern:

```html
<div class="wb-tabs" data-wb-tabs>
  <div class="wb-tabs-nav" role="tablist">
    <button class="wb-tabs-btn is-active" data-wb-tab="panel-overview" aria-selected="true">Overview</button>
    <button class="wb-tabs-btn" data-wb-tab="panel-settings" aria-selected="false" tabindex="-1">Settings</button>
  </div>
  <div class="wb-tabs-panel is-active" id="panel-overview">Overview content</div>
  <div class="wb-tabs-panel" id="panel-settings">Settings content</div>
</div>
```

Legacy-compatible alternate class names also work:

- canonical names: `wb-tabs-nav`, `wb-tabs-btn`, `wb-tabs-panel`
- legacy/alternate names: `wb-tab-list`, `wb-tab-item`, `wb-tab-panels`, `wb-tab-panel`

### Accordion

Full attribute-based pattern:

```html
<div class="wb-accordion" data-wb-accordion data-wb-accordion-single="true">
  <div class="wb-accordion-item">
    <button class="wb-accordion-trigger" data-wb-accordion-trigger aria-expanded="false" aria-controls="acc-api">
      API Access
    </button>
    <div class="wb-accordion-content" id="acc-api">
      <div class="wb-accordion-body">Details</div>
    </div>
  </div>
</div>
```

Simpler class-only pattern also works:

```html
<div class="wb-accordion">
  <div class="wb-accordion-item is-open">
    <button class="wb-accordion-trigger">Billing</button>
    <div class="wb-accordion-body">Details</div>
  </div>
</div>
```

### Collapse

Standalone collapse uses `data-wb-collapse`, not `data-wb-toggle="collapse"`.

```html
<button class="wb-btn wb-btn-secondary" data-wb-collapse="advanced-fields" aria-expanded="false">
  Toggle advanced fields
</button>

<div class="wb-collapse" id="advanced-fields">
  <div class="wb-collapse-body">Content here</div>
</div>
```

Bordered panel variant:

```html
<div class="wb-collapse-panel">
  <button class="wb-collapse-trigger" aria-expanded="false">
    Advanced options
    <span class="wb-collapse-icon">v</span>
  </button>
  <div class="wb-collapse">
    <div class="wb-collapse-body">Panel content</div>
  </div>
</div>
```

### Popovers and Tooltips

```html
<div class="wb-popover" data-wb-popover>
  <button class="wb-btn wb-btn-secondary" data-wb-toggle="popover" data-wb-target="#popover-panel">Info</button>
  <div class="wb-popover-panel" id="popover-panel">
    <div class="wb-popover-body">Popover content</div>
  </div>
</div>

<button data-wb-tooltip="Save changes">Save</button>
<button data-wb-tooltip="Deletes permanently" data-wb-tooltip-placement="bottom">Delete</button>
<span data-wb-tooltip="This can wrap" data-wb-tooltip-wrap>Help</span>
```

Tooltip placement values:

- `top` (default)
- `bottom`
- `left`
- `right`

Tooltip delay:

- `data-wb-tooltip-delay="300"`

Enhanced behavior notes:

- dropdowns, popovers, and tooltips are anchored overlays managed through the shared overlay root/layer
- authored markup stays inline with the trigger, but in JS mode the active visible floating node is rendered under `#wb-overlay-root`
- wrapper-local DOM is not the runtime home for active anchored overlays in enhanced mode
- the enhanced path is the canonical runtime behavior for avoiding local overflow and clipping

### Toasts

Programmatic usage is primary:

```js
WBToast.show('Saved successfully', { type: 'success', duration: 2500 })
WBToast.show('Something went wrong', { type: 'danger', position: 'top-right' })
```

Static HTML also works:

```html
<div class="wb-toast wb-toast-success">
  <div class="wb-toast-body">Saved successfully</div>
  <button class="wb-toast-close" data-wb-dismiss="toast" aria-label="Close">&times;</button>
</div>
```

Supported positions:

- `bottom-right` (default)
- `bottom-center`
- `bottom-left`
- `top-right`
- `top-center`
- `top-left`

### Lists, Pagination, Breadcrumbs, Avatars, Empty States

```html
<div class="wb-list">
  <a href="#" class="wb-list-item wb-list-item-action is-active">
    <span class="wb-list-item-text">
      <span class="wb-list-item-title">Profile</span>
      <span class="wb-list-item-sub">Personal details</span>
    </span>
  </a>
</div>

<nav class="wb-pagination" aria-label="Results pages">
  <ol class="wb-pagination-list">
    <li class="wb-pagination-item is-disabled">
      <span class="wb-pagination-link" aria-disabled="true">
        <i class="wb-icon wb-icon-chevron-left" aria-hidden="true"></i>
        <span>Previous</span>
      </span>
    </li>
    <li class="wb-pagination-item is-active">
      <span class="wb-pagination-link" aria-current="page">1</span>
    </li>
    <li class="wb-pagination-item"><a href="#" class="wb-pagination-link">2</a></li>
    <li class="wb-pagination-item"><a href="#" class="wb-pagination-link">3</a></li>
    <li class="wb-pagination-item"><span class="wb-pagination-ellipsis" aria-hidden="true">...</span></li>
    <li class="wb-pagination-item"><a href="#" class="wb-pagination-link">8</a></li>
    <li class="wb-pagination-item">
      <a href="#" class="wb-pagination-link" rel="next">
        <span>Next</span>
        <i class="wb-icon wb-icon-chevron-right" aria-hidden="true"></i>
      </a>
    </li>
  </ol>
  <div class="wb-pagination-info">Page 1 of 8</div>
</nav>

<nav aria-label="Breadcrumb">
  <ol class="wb-breadcrumb wb-breadcrumb-minimal wb-breadcrumb-truncate">
    <li class="wb-breadcrumb-item"><a href="#">Home</a></li>
    <li class="wb-breadcrumb-item"><a href="#">Docs</a></li>
    <li class="wb-breadcrumb-item is-active"><span aria-current="page">Icons</span></li>
  </ol>
</nav>

<nav aria-label="Current section">
  <ol class="wb-breadcrumb wb-breadcrumb-context wb-breadcrumb-sep-none">
    <li class="wb-breadcrumb-item is-active"><span aria-current="page">Workspace Settings</span></li>
  </ol>
</nav>

<div class="wb-avatar">AB</div>

<div class="wb-empty">
  <div class="wb-empty-icon"></div>
  <h3 class="wb-empty-title">No results</h3>
  <p class="wb-empty-text">Try adjusting your search.</p>
</div>
```

Pagination rules:

- use `nav.wb-pagination` as the landmark and provide a meaningful `aria-label`
- use `ol.wb-pagination-list` with `li.wb-pagination-item` for the page sequence
- use `a.wb-pagination-link` for navigable pages and previous/next controls
- use a non-interactive `span.wb-pagination-link` for disabled and current states
- current page MUST use `aria-current="page"`; the matching item uses `.is-active`
- disabled previous/next MUST use `.is-disabled` plus a passive `span` with `aria-disabled="true"`
- optional ellipsis uses `span.wb-pagination-ellipsis` inside a normal pagination item
- use `wb-pagination-compact` only when the standard rhythm is too large for dense tables or narrow control rows
- do not use pagination for content/article previous-next footers or breadcrumb-style hierarchy; those are different navigation jobs

Breadcrumb preset system:

- `wb-breadcrumb-minimal` -> safe default for admin/dashboard headers; subdued and title-safe
- `wb-breadcrumb-surface` -> soft surface-backed variant for pages that need gentle separation from the header background
- `wb-breadcrumb-bordered` -> more structured enterprise/data-heavy variant with visible containment
- `wb-breadcrumb-inline` -> compact developer-tool style variant; tighter and slash-first by default
- `wb-breadcrumb-context` -> single-item-friendly location/context label; use when a full navigation trail is unnecessary

Separator controls:

- `wb-breadcrumb-sep-chevron` -> `>` separator
- `wb-breadcrumb-sep-slash` -> `/` separator
- `wb-breadcrumb-sep-none` -> no separator; primarily for `wb-breadcrumb-context`

Canonical rules:

- breadcrumb is secondary; it must not compete with the page title
- page title is the primary screen heading inside a page header
- single-item breadcrumb use is not the default navigation pattern; reserve it for `wb-breadcrumb-context`
- active state is `.wb-breadcrumb-item.is-active`; older `.is-current` usage is not canonical
- links should remain clickable, keyboard-focusable, and semantically inside `nav[aria-label]`
- use `wb-breadcrumb-truncate` when long labels must be safely ellipsized

### Radio Cards and Button Checks

```html
<div class="wb-radio-group">
  <label class="wb-radio-card">
    <input type="radio" name="plan" value="starter">
    <span class="wb-radio-card-body">
      <strong>Starter</strong>
      <span>$9 / month</span>
    </span>
  </label>
  <label class="wb-radio-card">
    <input type="radio" name="plan" value="pro">
    <span class="wb-radio-card-body">
      <strong>Pro</strong>
      <span>$29 / month</span>
    </span>
  </label>
</div>

<div class="wb-btn-check-group">
  <label class="wb-btn-check">
    <input type="radio" name="view" value="grid">
    <span>Grid</span>
  </label>
  <label class="wb-btn-check">
    <input type="radio" name="view" value="list">
    <span>List</span>
  </label>
</div>
```

### Command Palette

```html
<button class="wb-btn wb-btn-secondary" data-wb-toggle="cmd" data-wb-target="#site-cmd">
  Search
</button>

<div class="wb-cmd-backdrop" id="site-cmd" data-wb-cmd-default role="dialog" aria-modal="true" aria-label="Command palette">
  <div class="wb-cmd-dialog">
    <div class="wb-cmd-search">
      <input class="wb-cmd-input" type="text" placeholder="Search commands...">
    </div>
    <div class="wb-cmd-results">
      <div class="wb-cmd-group">
        <a class="wb-cmd-item" href="/docs">Documentation</a>
      </div>
      <div class="wb-cmd-empty" style="display:none;">No results</div>
    </div>
  </div>
</div>
```

The first palette marked with `data-wb-cmd-default` is used by `Cmd/Ctrl + K`.

### Nav Groups and Menus

```html
<div class="wb-nav-group" data-wb-nav-group data-wb-nav-group-open>
  <button class="wb-nav-group-toggle" aria-expanded="true">
    <span class="wb-nav-group-label">Settings</span>
    <span class="wb-nav-group-arrow"></span>
  </button>
  <div class="wb-nav-group-items">
    <a class="wb-nav-group-item is-active" href="#">Profile</a>
    <a class="wb-nav-group-item" href="#">Security</a>
  </div>
</div>

<nav class="wb-menu">
  <a class="wb-menu-item is-active" href="#">Overview</a>
  <a class="wb-menu-item" href="#">API keys</a>
  <hr class="wb-menu-divider">
  <button class="wb-menu-item wb-menu-item-danger">Delete</button>
</nav>
```

### Loading, Skeleton, Divider

```html
<span class="wb-spinner" aria-hidden="true"></span>
<span class="wb-spinner wb-spinner-sm" aria-hidden="true"></span>
<div class="wb-progress-bar"><div class="wb-progress-bar-fill" style="width:60%"></div></div>

<div class="wb-skeleton" style="height:1rem;width:60%"></div>
<div class="wb-skeleton wb-skeleton-circle" style="width:40px;height:40px"></div>

<hr class="wb-divider">
<div class="wb-divider-label">Or continue with</div>
<span class="wb-divider-v" aria-hidden="true"></span>
```

---

## Layout Primitives

### Containers, Sections, Flow Helpers

```html
<section class="wb-section">
  <div class="wb-container wb-container-lg">
    <div class="wb-stack wb-stack-4">
      <div class="wb-split">
        <div>Left</div>
        <div>Right</div>
      </div>
      <div class="wb-cluster wb-cluster-between">
        <span>Item A</span>
        <span>Item B</span>
      </div>
    </div>
  </div>
</section>
```

Shipped primitives:

- containers: `wb-container`, `wb-container-sm`, `wb-container-md`, `wb-container-lg`, `wb-container-xl`, `wb-container-full`
- sections: `wb-section`, `wb-section-sm`, `wb-section-lg`
- stack: `wb-stack`, `wb-stack-1`, `wb-stack-2`, `wb-stack-3`, `wb-stack-4`, `wb-stack-6`, `wb-stack-8`
- cluster: `wb-cluster`, `wb-cluster-2`, `wb-cluster-4`, `wb-cluster-6`, `wb-cluster-end`, `wb-cluster-center`, `wb-cluster-between`
- split: `wb-split`
- grid primitives: `wb-grid`, `wb-grid-2`, `wb-grid-3`, `wb-grid-4`, `wb-grid-auto`, `wb-grid-auto-sm`, `wb-grid-auto-lg`

### Navbar

```html
<header class="wb-navbar">
  <a href="#" class="wb-navbar-brand">WebBlocks</a>
  <div class="wb-navbar-spacer"></div>
  <nav class="wb-navbar-links">
    <a href="#" class="wb-navbar-link is-active">Dashboard</a>
    <a href="#" class="wb-navbar-link">Settings</a>
  </nav>
  <div class="wb-navbar-end">
    <button class="wb-navbar-toggle" data-wb-toggle="sidebar" data-wb-target="#app-sidebar" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
```

Variants and helpers:

- `wb-navbar--static`
- `wb-navbar-glass`
- `wb-navbar-filled`
- `wb-navbar-links`, `wb-navbar-nav`, `wb-navbar-nav-item`, `wb-navbar-end`
- `wb-navbar-identity`, `wb-navbar-context`, `wb-navbar-brand-note`
- `wb-topbar-identity`, `wb-topbar-product`, `wb-topbar-context`, `wb-topbar-actions`, `wb-topbar-action`, `wb-topbar-user`

Topbar identity hierarchy:

- product name is always primary
- context, role, admin, teacher, workspace, or environment labels are secondary
- use product-first order, then context second; avoid ambiguous patterns like `Teacher / QuizTem`
- preferred pattern is `QuizTem` as product, with `Teacher Workspace` or `Admin Panel` as the secondary label

Stacked navbar:

```html
<header class="wb-navbar wb-navbar-stacked">
  <div class="wb-navbar-row">
    <div class="wb-navbar-start">
      <a href="#" class="wb-navbar-brand">WebBlocks</a>
    </div>
    <div class="wb-navbar-end">
      <a href="#" class="wb-navbar-link">Account</a>
    </div>
  </div>
  <div class="wb-navbar-row wb-navbar-sub">
    <a href="#" class="wb-navbar-link is-active">Overview</a>
    <a href="#" class="wb-navbar-link">API</a>
  </div>
</header>
```

### Sidebar and Dashboard Shell

```html
<div class="wb-sidebar-backdrop" data-wb-sidebar-backdrop></div>

<div class="wb-dashboard-shell">
  <aside class="wb-sidebar" id="app-sidebar">
    <a href="#" class="wb-sidebar-brand">WebBlocks</a>
    <nav class="wb-sidebar-nav">
      <a href="#" class="wb-sidebar-link is-active">Dashboard</a>
      <a href="#" class="wb-sidebar-link">Billing</a>
    </nav>
  </aside>

  <div class="wb-dashboard-body">
    <header class="wb-navbar">...</header>
    <main class="wb-dashboard-main">
      <div class="wb-page-header">
        <div class="wb-page-header-main">
          <nav class="wb-page-breadcrumb" aria-label="Breadcrumb">
            <ol class="wb-breadcrumb wb-breadcrumb-minimal">
              <li class="wb-breadcrumb-item"><a href="#">Dashboard</a></li>
              <li class="wb-breadcrumb-item is-active"><span aria-current="page">Overview</span></li>
            </ol>
          </nav>
          <div>
            <h1 class="wb-page-header-title">Overview</h1>
            <p class="wb-page-subtitle">Current account health</p>
          </div>
        </div>
        <div class="wb-page-actions">
          <button class="wb-btn wb-btn-primary">Create</button>
        </div>
      </div>
      <div class="wb-stat-row">...</div>
    </main>
  </div>
</div>
```

Important:

- canonical shell is `wb-dashboard-shell`, `wb-dashboard-body`, `wb-dashboard-main`
- legacy aliases still ship: `wb-shell`, `wb-shell-main`, `wb-shell-body`
- do not mix V1 and V2 shell structures in the same layout
- `wb-sidebar-brand` is the clearer canonical name; `wb-sidebar-header` is the older alias
- canonical page-header stack is: breadcrumb optional, `wb-page-header-title` required, `wb-page-subtitle` optional, actions optional
- breadcrumb belongs above the title inside `wb-page-header-main`, not as a competing heading

### Auth Shell

```html
<div class="wb-auth-shell">
  <div class="wb-auth-card">
    <div class="wb-auth-header">
      <h1 class="wb-auth-header-title">Sign in</h1>
      <p class="wb-auth-header-subtitle">Welcome back</p>
    </div>
    <div class="wb-auth-body">...</div>
    <div class="wb-auth-footer">Need an account?</div>
  </div>
</div>
```

Canonical auth shell:

- use `wb-auth-shell` and `wb-auth-card`
- keep the explicit `wb-auth-header`, `wb-auth-body`, and `wb-auth-footer` anatomy so auth cards read as real three-region cards
- header and footer should integrate into one calm card shell while the body remains the primary work zone
- build all auth form controls with the standard field system, not auth-specific field wrappers
- there is no alternate legacy shell class to prefer over `wb-auth-shell`

Split variant:

- `wb-auth-shell wb-auth-split`
- `wb-auth-panel`
- `wb-auth-form-area`

### Settings Shell

```html
<div class="wb-settings-shell">
  <nav class="wb-section-nav wb-settings-nav" aria-label="Settings sections">
    <div class="wb-section-nav-title">Account</div>
    <ul class="wb-section-nav-list">
      <li class="wb-section-nav-item">
        <a class="wb-section-nav-link is-active" href="#profile" aria-current="page">Profile</a>
      </li>
    </ul>
  </nav>
  <div class="wb-settings-body">
    <div class="wb-settings-header">
      <h1 class="wb-settings-title">Profile</h1>
      <p class="wb-settings-desc">Manage your personal information.</p>
    </div>
    <section class="wb-settings-section">
      <div class="wb-settings-section-body">...</div>
    </section>
  </div>
</div>
```

Canonical settings shell:

- use `wb-settings-shell`, `wb-settings-nav`, `wb-settings-body`, `wb-settings-section`
- use `wb-section-nav` inside the settings rail instead of a separate settings-only inner-nav contract
- keep settings content inside `wb-settings-section` blocks instead of inventing page-specific card wrappers

### Section Nav

`wb-section-nav` is the canonical reusable pattern for section-level navigation inside a page or shell.

Use it for:

- settings side navigation
- docs subsection navigation
- getting started step/section navigation
- similar in-page section switching contexts

Do not use it for:

- global site nav
- primary app sidebar replacement
- breadcrumbs
- unrelated top-level tab systems

Canonical markup:

```html
<nav class="wb-section-nav" aria-label="Settings sections">
  <div class="wb-section-nav-title">Settings</div>
  <ul class="wb-section-nav-list">
    <li class="wb-section-nav-item">
      <a class="wb-section-nav-link is-active" href="#profile" aria-current="page">Profile</a>
    </li>
    <li class="wb-section-nav-item">
      <a class="wb-section-nav-link" href="#security">Security</a>
    </li>
    <li class="wb-section-nav-item">
      <a class="wb-section-nav-link" href="#billing">Billing</a>
    </li>
  </ul>
</nav>
```

Subparts:

- `wb-section-nav` = wrapper
- `wb-section-nav-title` = quiet label for the local nav group
- `wb-section-nav-list` = vertical list container
- `wb-section-nav-item` = semantic list item / stable hook
- `wb-section-nav-link` = row-level interactive target

Active state:

- use `is-active` on the current link
- pair it with `aria-current="page"` when the current route is truly known in static markup
- for in-page anchor navigation, let runtime apply `is-active` and `aria-current="location"` based on the current hash or reading position instead of hardcoding a fake current item

Semantic rule:

- use `nav` with a real `aria-label`
- use `ul/li` when the content is a link list

Contract rule:

- the pattern is class-driven by design so layout, spacing, and interaction do not depend on descendant element selectors or a specific heading/list shape

### Content Shell and Editorial Surfaces

```html
<article class="wb-content-shell wb-content-shell-narrow">
  <header class="wb-content-header">
    <nav class="wb-content-breadcrumb">...</nav>
    <h1 class="wb-content-title">Integration Guide</h1>
    <p class="wb-content-subtitle">Implementation-accurate patterns.</p>
  </header>
  <div class="wb-content-body">...</div>
</article>

<section class="wb-page-intro">
  <div class="wb-container wb-page-intro-grid">
    <div class="wb-page-intro-copy">
      <div class="wb-page-eyebrow">Overview</div>
      <h1 class="wb-page-intro-title">Visible structure, quiet defaults.</h1>
      <p class="wb-page-lead">Use for docs and marketing intros.</p>
    </div>
    <aside class="wb-page-intro-aside">...</aside>
  </div>
</section>
```

Also shipped for editorial/marketing surfaces:

- `wb-section-heading`
- `wb-link-list`
- `wb-inline-list`
- `wb-promo`
- `wb-hero`, `wb-hero-content`, `wb-hero-title`, `wb-hero-text`, `wb-hero-actions`
- `wb-content-columns`, `wb-content-stack`, `wb-footer-grid`, `wb-footer-list`, `wb-footer-link`
- `wb-page-intro-title` for intro/masthead headings; do not reuse page-header title markup here

---

## Overlay Runtime Infrastructure

This package also ships shared internal overlay infrastructure for anchored floating UI and top-layer surfaces such as dropdowns, popovers, tooltips, toasts, modals, and content overlays.

Canonical rule:

- `wb-overlay-root` = shared internal top-layer infrastructure root
- public `wb-modal` = structured dialog primitive on the shared dialog layer
- public `wb-overlay` = content-first viewer-style overlay primitive on the shared dialog layer
- internal overlay infrastructure = shared root/layer runtime used by anchored or portaled floating UI

Anchored overlay notes:

- authored markup for dropdowns and popovers stays inline with the trigger
- in JS mode the active floating node is rendered under the shared `#wb-overlay-root` layer to avoid clipping
- `WBDropdown`, `WBPopover`, and `WBTooltip` are consumers of the same internal layer utilities
- `WBModal` and `WBOverlay` also consume the shared dialog/top-layer runtime instead of shipping unrelated overlay engines
- do not build separate per-component positioning engines or ad hoc z-index ladders

Internal layer classes such as `wb-overlay-root`, `wb-overlay-layer`, and `wb-overlay-layer--anchored` are runtime infrastructure, not the primary public authoring contract for page-level dialogs.

---

## Screen Composition Examples

These are canonical starting structures. Extend them with shipped primitives and shells before adding custom wrappers.

### Auth Screen

```html
<div class="wb-auth-shell">
  <div class="wb-auth-card">
    <div class="wb-auth-header">
      <h1 class="wb-auth-header-title">Sign in</h1>
      <p class="wb-auth-header-subtitle">Access your dashboard</p>
    </div>
    <div class="wb-auth-body">
      <div class="wb-stack wb-stack-4">
        <div class="wb-field">
          <label class="wb-label" for="login-email">Email</label>
          <input class="wb-input" id="login-email" type="email" placeholder="you@example.com">
        </div>
        <div class="wb-field">
          <label class="wb-label" for="login-password">Password</label>
          <div class="wb-input-group">
            <input class="wb-input wb-input-error" id="login-password" type="password" autocomplete="current-password">
            <button class="wb-btn wb-btn-secondary wb-input-addon-btn wb-btn-icon"
                    type="button"
                    data-wb-password-toggle
                    data-wb-target="#login-password"
                    aria-label="Show password"
                    aria-pressed="false">
              <i class="wb-icon wb-icon-eye" aria-hidden="true"></i>
            </button>
          </div>
          <div class="wb-field-meta">
            <div class="wb-field-error">Required</div>
          </div>
        </div>
        <button class="wb-btn wb-btn-primary">Sign in</button>
      </div>
    </div>
    <div class="wb-auth-footer">Use the footer for secondary help, alternate routes, or quiet auth context.</div>
  </div>
</div>
```

### Dashboard Page

```html
<div class="wb-sidebar-backdrop" data-wb-sidebar-backdrop></div>

<div class="wb-dashboard-shell">
  <aside class="wb-sidebar" id="app-sidebar">
    <a href="#" class="wb-sidebar-brand">WebBlocks</a>
    <nav class="wb-sidebar-nav">
      <a class="wb-sidebar-link is-active" href="#">Overview</a>
      <a class="wb-sidebar-link" href="#">Billing</a>
    </nav>
  </aside>

  <div class="wb-dashboard-body">
    <header class="wb-navbar">
      <div class="wb-navbar-identity">
        <a href="#" class="wb-navbar-brand">QuizTem</a>
        <span class="wb-navbar-context">Admin Panel</span>
      </div>
    </header>
    <main class="wb-dashboard-main">
      <div class="wb-page-header">
        <div class="wb-page-header-main">
          <nav class="wb-page-breadcrumb" aria-label="Breadcrumb">
            <ol class="wb-breadcrumb wb-breadcrumb-minimal">
              <li class="wb-breadcrumb-item"><a href="#">Workspace</a></li>
              <li class="wb-breadcrumb-item is-active"><span aria-current="page">Overview</span></li>
            </ol>
          </nav>
          <div>
            <h1 class="wb-page-header-title">Overview</h1>
            <p class="wb-page-subtitle">Current account status</p>
          </div>
        </div>
      </div>
      <section class="wb-card wb-card-flat">
        <div class="wb-card-header">
          <h2 class="wb-card-title">Recent activity</h2>
        </div>
        <div class="wb-card-body">...</div>
      </section>
    </main>
  </div>
</div>
```

### Settings Page

```html
<div class="wb-settings-shell">
  <nav class="wb-section-nav wb-settings-nav" aria-label="Account sections">
    <div class="wb-section-nav-title">Account</div>
    <ul class="wb-section-nav-list">
      <li class="wb-section-nav-item">
        <a class="wb-section-nav-link is-active" href="#profile" aria-current="page">Profile</a>
      </li>
      <li class="wb-section-nav-item">
        <a class="wb-section-nav-link" href="#security">Security</a>
      </li>
    </ul>
  </nav>

  <div class="wb-settings-body">
    <div class="wb-settings-header">
      <nav class="wb-page-breadcrumb" aria-label="Breadcrumb">
        <ol class="wb-breadcrumb wb-breadcrumb-surface">
          <li class="wb-breadcrumb-item"><a href="#">Account</a></li>
          <li class="wb-breadcrumb-item is-active"><span aria-current="page">Profile</span></li>
        </ol>
      </nav>
      <h1 class="wb-settings-title">Profile</h1>
      <p class="wb-settings-desc">Manage your public details.</p>
    </div>

    <section class="wb-settings-section">
      <div class="wb-settings-section-header">
        <div>
          <h2 class="wb-settings-section-title">Public profile</h2>
        </div>
      </div>
      <div class="wb-settings-section-body">...</div>
    </section>
  </div>
</div>
```

---

## Grid and Utility System

### 12-column grid

```html
<div class="wb-row wb-row-gap-6 wb-row-middle">
  <div class="wb-col-12 wb-col-md-8">Main</div>
  <div class="wb-col-12 wb-col-md-4">Sidebar</div>
</div>
```

Supported grid column classes:

- base: `wb-col-1` through `wb-col-12`, `wb-col`
- breakpoints: `wb-col-sm-*`, `wb-col-md-*`, `wb-col-lg-*`, `wb-col-xl-*`
- offsets: `wb-col-offset-1`, `wb-col-offset-2`, `wb-col-offset-3`, `wb-col-offset-4`, `wb-col-offset-6`
- row helpers: `wb-row-center`, `wb-row-end`, `wb-row-stretch`, `wb-row-top`, `wb-row-middle`, `wb-row-bottom`

### Utility classes

Display:

- `wb-hidden`, `wb-block`, `wb-inline`, `wb-inline-block`, `wb-flex`, `wb-inline-flex`, `wb-grid-display`

Flex and gap:

- `wb-flex-col`, `wb-flex-row`, `wb-flex-wrap`, `wb-flex-nowrap`, `wb-flex-1`, `wb-flex-shrink-0`
- `wb-items-start`, `wb-items-center`, `wb-items-end`
- `wb-justify-start`, `wb-justify-center`, `wb-justify-end`, `wb-justify-between`
- `wb-gap-1`, `wb-gap-2`, `wb-gap-3`, `wb-gap-4`, `wb-gap-6`, `wb-gap-8`

Spacing:

- margin: `wb-m-0`, `wb-mt-*`, `wb-mb-*`, `wb-ms-auto`, `wb-me-auto`, `wb-mx-auto`
- padding: `wb-p-0`, `wb-p-2`, `wb-p-3`, `wb-p-4`, `wb-p-6`, `wb-px-4`, `wb-px-6`, `wb-py-2`, `wb-py-4`, `wb-py-6`

Typography:

- sizes: `wb-text-xs`, `wb-text-sm`, `wb-text-base`, `wb-text-lg`, `wb-text-xl`, `wb-text-2xl`, `wb-text-3xl`, `wb-text-4xl`
- weight: `wb-font-normal`, `wb-font-medium`, `wb-font-semibold`, `wb-font-bold`, `wb-mono`
- align: `wb-text-left`, `wb-text-center`, `wb-text-right`
- line-height: `wb-leading-tight`, `wb-leading-normal`, `wb-leading-loose`
- case-safe emphasis and spacing: `wb-lowercase`, `wb-tracking-tight`, `wb-tracking-normal`, `wb-tracking-wide`, `wb-tracking-wider`, `wb-tracking-widest`
- text flow: `wb-nowrap`, `wb-truncate`, `wb-no-decoration`

Color and surfaces:

- text: `wb-text-primary`, `wb-text-success`, `wb-text-warning`, `wb-text-danger`, `wb-text-muted`, `wb-text-default`
- background: `wb-bg-surface`, `wb-bg-surface-2`, `wb-bg-primary`, `wb-bg-success`, `wb-bg-danger`, `wb-bg-warning`

Borders, radius, shadow:

- `wb-border`, `wb-border-top`, `wb-border-bottom`, `wb-border-0`
- `wb-rounded`, `wb-rounded-sm`, `wb-rounded-lg`, `wb-rounded-xl`, `wb-rounded-full`
- `wb-shadow-sm`, `wb-shadow`, `wb-shadow-lg`, `wb-shadow-0`

Position, size, overflow:

- `wb-relative`, `wb-absolute`, `wb-fixed`, `wb-sticky`, `wb-inset-0`
- `wb-w-full`, `wb-w-auto`, `wb-h-full`, `wb-min-w-0`
- `wb-overflow-hidden`, `wb-overflow-auto`, `wb-overflow-scroll`, `wb-overflow-x-auto`, `wb-overflow-y-auto`

Other:

- `wb-cursor-pointer`, `wb-cursor-default`, `wb-cursor-not-allowed`
- `wb-opacity-50`, `wb-opacity-75`, `wb-opacity-100`
- `wb-sr-only`
- responsive visibility: `wb-hidden-sm`, `wb-hidden-md`, `wb-hidden-lg`, `wb-visible-mobile`, `wb-visible-desktop`

---

## Icons

Canonical icon pattern:

```html
<i class="wb-icon wb-icon-home" aria-hidden="true"></i>
<i class="wb-icon wb-icon-settings wb-icon-lg wb-icon-accent" aria-hidden="true"></i>
```

Icon helpers:

- size: `wb-icon-xs`, `wb-icon-sm`, `wb-icon-lg`, `wb-icon-xl`, `wb-icon-2xl`
- stroke: `wb-icon-thin`, `wb-icon-medium`, `wb-icon-bold`
- color: `wb-icon-muted`, `wb-icon-accent`, `wb-icon-success`, `wb-icon-warning`, `wb-icon-danger`, `wb-icon-info`, `wb-icon-on`
- layout: `wb-icon-btn`, `wb-icon-card`, `wb-icon-solo`
- wrappers: `wb-icon-wrap`, `wb-icon-wrap-sm`, `wb-icon-wrap-lg`, `wb-icon-wrap-circle`, `wb-icon-wrap-success`, `wb-icon-wrap-warning`, `wb-icon-wrap-danger`, `wb-icon-wrap-info`, `wb-icon-wrap-muted`

Canonical action icon naming:

- `wb-icon-refresh` -> alias of `wb-icon-rotate-cw`
- `wb-icon-refresh-cw` -> alias of `wb-icon-rotate-cw`
- `wb-icon-rotate-cw` -> canonical refresh/rotate clockwise glyph
- `wb-icon-sync` -> alias of `wb-icon-repeat`
- `wb-icon-repeat` -> canonical sync/repeat glyph
- `wb-icon-rotate-ccw` -> separate real glyph
- `wb-icon-eye` -> canonical hidden-password toggle glyph
- `wb-icon-eye-off` -> canonical visible-password toggle glyph

Canonical vs alias rule:

- prefer `wb-icon-rotate-cw` and `wb-icon-repeat` when documenting the base glyphs
- use `wb-icon-refresh`, `wb-icon-refresh-cw`, and `wb-icon-sync` only when semantic readability is more helpful than the canonical glyph name

Semantic guidance:

- use `refresh` for reloading current data
- use `sync` for reconciling with a remote source
- use `rotate-cw` or `rotate-ccw` for literal rotation/cycle actions
- use `wb-spinner` for loading state instead of inventing a loader icon class

Important icon behavior:

- CSS mask classes are `wb-icon-*`
- if an `<i class="wb-icon wb-icon-missing">` class does not resolve to a generated rule, the fallback glyph is `help-circle`, not a blank box
- current icon source of truth is `src/css/icons/webblocks-icons.svg`, built into `webblocks-icons.css` by `scripts/build-icons.js`

---

## JS APIs

All modules are available on `window.*` after `webblocks-ui.js` loads.

```js
WBTheme.setMode('dark')
WBTheme.setPreset('modern')
WBTheme.setAccent('forest')
WBTheme.setRadius('soft')
WBTheme.setDensity('compact')
WBTheme.setShadow('soft')
WBTheme.setFont('editorial')
WBTheme.getAll()

WBModal.open(document.getElementById('my-modal'))
WBModal.close()

WBDrawer.open(document.getElementById('my-drawer'))
WBDrawer.close()

WBDropdown.open(document.getElementById('account-menu'))
WBDropdown.close(document.getElementById('account-menu'))
WBDropdown.closeAll()

WBTabs.activate(document.querySelector('.wb-tabs'), 'panel-settings')
WBTabs.activateById('panel-settings')

WBAccordion.open(document.querySelector('.wb-accordion-trigger'))
WBAccordion.close(document.querySelector('.wb-accordion-trigger'))
WBAccordion.toggle(document.querySelector('.wb-accordion-trigger'))

WBSidebar.open(document.getElementById('app-sidebar'))
WBSidebar.close(document.getElementById('app-sidebar'))
WBSidebar.toggle(document.getElementById('app-sidebar'))

WBNavGroup.open(document.querySelector('[data-wb-nav-group]'))
WBNavGroup.close(document.querySelector('[data-wb-nav-group]'))
WBNavGroup.toggle(document.querySelector('[data-wb-nav-group]'))

WBCommandPalette.open(document.getElementById('site-cmd'))
WBCommandPalette.close()
WBCommandPalette.onSearch(function (query, callback) {
  callback('<a class="wb-cmd-item" href="/docs">Docs</a>')
})

WBToast.show('Saved', { type: 'success', duration: 3000 })
WBToast.dismiss(document.querySelector('.wb-toast'))

WBPopover.open(document.querySelector('.wb-popover'))
WBPopover.close(document.querySelector('.wb-popover'))
WBPopover.closeAll()

WBTooltip.show(document.querySelector('[data-wb-tooltip]'))
WBTooltip.hide(document.querySelector('[data-wb-tooltip]'))
WBTooltip.hideAll()

WBDismiss.dismiss(document.querySelector('.wb-alert'))

WBAjaxToggle.handle(document.querySelector('[data-wb-ajax-toggle]'))

WBPasswordToggle.toggle(document.querySelector('[data-wb-password-toggle]'))
WBPasswordToggle.sync(document)

WBCollapse.open('advanced-fields')
WBCollapse.close('advanced-fields')
WBCollapse.toggle('advanced-fields')
```

Notes:

- `WBModal.open` and `WBDrawer.open` take element references, not id strings
- `WBDropdown.open` takes the menu element, not the trigger button
- `WBTabs.activate` takes `(containerEl, tabId)`
- `WBCollapse.open/close/toggle` take an element id string

---

## Data Attribute Behavior

Supported shipped behavior:

```html
<!-- theme -->
<button data-wb-mode-set="dark">Dark</button>
<button data-wb-mode-cycle>Cycle</button>
<button data-wb-preset-set="corporate">Corporate</button>
<button data-wb-accent-set="royal">Royal</button>
<button data-wb-radius-set="default">Default radius</button>
<button data-wb-density-set="comfortable">Comfortable</button>
<button data-wb-shadow-set="flat">Flat</button>
<button data-wb-font-set="system">System font</button>

<!-- modal / drawer / dropdown / command palette -->
<button data-wb-toggle="modal" data-wb-target="#my-modal">Open modal</button>
<button data-wb-dismiss="modal">Close modal</button>

<button data-wb-toggle="drawer" data-wb-target="#my-drawer">Open drawer</button>
<button data-wb-dismiss="drawer">Close drawer</button>

<button data-wb-toggle="dropdown">Open dropdown</button>
<button data-wb-dismiss="dropdown">Close dropdown item</button>

<button data-wb-toggle="cmd" data-wb-target="#site-cmd">Open command palette</button>

<!-- sidebar -->
<button data-wb-toggle="sidebar" data-wb-target="#app-sidebar" aria-expanded="false">Menu</button>
<div data-wb-sidebar-backdrop></div>

<!-- tabs / accordion / collapse -->
<button data-wb-tab="panel-billing">Billing</button>

<div data-wb-accordion data-wb-accordion-single="true">...</div>
<button data-wb-accordion-trigger aria-controls="acc-one">Toggle</button>

<button data-wb-collapse="advanced-fields" aria-expanded="false">Toggle collapse</button>

<!-- password visibility -->
<div class="wb-input-group">
  <input class="wb-input" id="account-password-field" type="password">
  <button class="wb-btn wb-btn-secondary wb-input-addon-btn wb-btn-icon"
          type="button"
          data-wb-password-toggle
          data-wb-target="#account-password-field"
          aria-label="Show password"
          aria-pressed="false">
    <i class="wb-icon wb-icon-eye" aria-hidden="true"></i>
  </button>
</div>

<!-- nav groups -->
<div data-wb-nav-group data-wb-nav-group-open>...</div>
<div data-wb-nav-group data-wb-nav-group-accordion>...</div>

<!-- tooltip -->
<button data-wb-tooltip="Save" data-wb-tooltip-placement="bottom" data-wb-tooltip-delay="250">Save</button>

<!-- ajax toggle -->
<input
  type="checkbox"
  data-wb-ajax-toggle
  data-wb-url="/admin/posts/toggle"
  data-wb-field="publish"
  data-wb-id="42"
  data-wb-feedback="toast"
  data-wb-success-msg="Published"
  data-wb-error-msg="Could not update"
>
```

Important:

- `ajax-toggle` uses `data-wb-url`, `data-wb-field`, `data-wb-id`
- it does not use `data-url` or `data-csrf`
- CSRF is read automatically from `<meta name="csrf-token">`

---

## Events and Integration Hooks

Useful emitted events:

- modal: `wb:modal:open`, `wb:modal:close`
- drawer: `wb:drawer:open`, `wb:drawer:close`
- tabs: `wb:tabs:change`
- accordion: `wb:accordion:toggle`
- nav group: `wb:navgroup:open`, `wb:navgroup:close`
- toast: `wb:toast:open`, `wb:toast:close`
- popover: `wb:popover:open`, `wb:popover:close`
- tooltip: `wb:tooltip:show`, `wb:tooltip:hide`
- dismiss: `wb:dismiss`, `wb:dismissed`
- ajax toggle: `wb:ajax-toggle:success`, `wb:ajax-toggle:error`
- command palette: `wb:cmd:open`, `wb:cmd:close`, `wb:cmd:search`

---

## Scoped WebGames Extension

`build.sh` currently ships a scoped game-oriented extension under `.wb-game-ui`. These classes do not alter the base library outside that scope.

Available classes include:

- tokens scope: `.wb-game-ui`
- screens: `wb-game-screen`, `wb-game-screen-head`, `wb-game-screen-copy`, `wb-game-screen-eyebrow`, `wb-game-screen-title`, `wb-game-screen-lead`, `wb-game-screen-meta`, `wb-game-screen-actions`, `wb-game-screen-side`
- panels/cards: `wb-game-panel`, `wb-game-panel--soft`, `wb-game-panel--accent`, `wb-game-card`, `wb-game-card.is-selected`
- buttons: `wb-game-btn`, `wb-game-btn-primary`, `wb-game-btn-secondary`, `wb-game-btn-ghost`, `wb-game-btn-lg`, `wb-game-btn-block`
- statuses: `wb-game-status`, `wb-game-status-dot`, `wb-game-status-accent`, `wb-game-status-success`, `wb-game-status-warning`, `wb-game-status-danger`

Use this extension only inside a deliberately scoped game-like surface.

---

## AI Usage Contract

- choose the shell first: `wb-auth-shell` for login/register, `wb-dashboard-shell` for app dashboards, `wb-settings-shell` for account/settings flows, `wb-content-shell` for editorial/docs content
- when building auth, dashboard, or settings screens, start from the canonical examples in `Screen Composition Examples` and expand them without changing the shell contract
- build each screen from shipped primitives first: `wb-stack`, `wb-cluster`, `wb-split`, `wb-grid`, `wb-grid-auto`, then add UI primitives inside those structures
- build forms only with `wb-field`, `wb-label`, `wb-input` / `wb-select` / `wb-textarea`, `wb-field-meta`, `wb-field-hint`, and `wb-field-error`
- wrap all assistive field content in `wb-field-meta`; never place `wb-field-hint` or `wb-field-error` directly under `wb-field`
- keep table surfaces singular: `wb-table-wrap` owns the surface, `wb-toolbar` inside it stays a control row, and `thead` stays a header band
- keep text casing content-defined; do not rely on automatic uppercase or capitalize transforms for UI emphasis
- choose breadcrumb presets by job: `minimal` for standard admin headers, `surface` for soft separated headers, `bordered` for enterprise/data-heavy screens, `inline` for dense tool-like context, `context` for single-item location labels
- keep header hierarchy strict: breadcrumb optional, title required, subtitle optional, actions optional
- keep topbar identity strict: product first, context second
- use `wb-card` for framed content regions across all shells, including dashboard work areas
- use canonical shell and primitive names when both canonical and legacy aliases exist
- NEVER invent a parallel class system for auth, settings, dashboard, icons, or field controls when shipped classes already exist
- NEVER create project-specific wrappers before checking whether the same structure can be expressed with shipped primitives and shells

---

## DO / DO NOT

DO:

- compose screens from shipped primitives before inventing new wrappers
- ALWAYS compose layouts using `wb-stack`, `wb-cluster`, `wb-grid`, and related primitives before introducing new wrapper classes
- use `wb-dashboard-shell` for dashboard layouts, `wb-settings-shell` for settings pages, and `wb-content-shell` for editorial/document pages
- use `wb-field`, `wb-label`, `wb-input`, `wb-field-meta`, `wb-field-hint`, and `wb-field-error` for canonical forms
- use `wb-auth-shell` + `wb-auth-card` for auth screens and keep auth fields on the canonical field system
- use `wb-card` for framed content regions, including dashboard work areas
- choose a breadcrumb preset instead of writing per-project breadcrumb CSS
- use `wb-icon` helpers for icon sizing/color rather than custom inline styles when possible
- use `WBTheme` or root `data-*` attributes to manage theme state
- use shipped `wb-stack`, `wb-cluster`, `wb-split`, and `wb-grid-auto` helpers for layout rhythm

DO NOT:

- do not use `data-theme`; use `data-mode`
- do not document or implement collapse with `data-wb-toggle="collapse"`; shipped API is `data-wb-collapse="id"`
- do not use `.is-current` for breadcrumbs; shipped active class is `.wb-breadcrumb-item.is-active`
- do not use `.wb-auth`; shipped auth shell class is `.wb-auth-shell`
- do not create auth-specific field namespaces such as `guest-auth-*` or `qz-auth-*`
- do not place `wb-field-hint` or `wb-field-error` directly under `wb-field`; use `wb-field-meta`
- do not add competing radius or card-like backgrounds inside `wb-table-wrap`
- do not use automatic uppercase or capitalize transforms for UI labels, headers, or metadata
- do not style breadcrumbs as page titles or make them compete visually with headings
- do not repeat the same noun in breadcrumb and title without a hierarchy reason
- do not make topbar context more visually dominant than the product name
- do not assume `WBModal.open('id')` or `WBDrawer.open('id')`; pass elements
- do not assume `WBDropdown.open(triggerEl)`; pass the menu element
- do not hardcode accent colors in new CSS; use `--wb-accent*` tokens
- do not mix `wb-shell` and `wb-dashboard-shell` in the same layout tree
- do not invent a separate loader icon class when `wb-spinner` already exists
- do not introduce or reintroduce a second generic framed surface noun beside `wb-card`

---

## Review Checklist

Use this checklist before shipping docs, examples, or new UI slices:

1. Does the example use shipped classes only?
2. Is the page starting from the correct shell for its job?
3. Are layout helpers solving layout before new wrappers or utilities do?
4. Are forms using the canonical `wb-field` / `wb-label` / `wb-input` / `wb-field-meta` system?
5. Are `wb-page-header-title` and `wb-page-intro-title` used only in their own families?
6. Are framed content regions using `wb-card` instead of a second generic surface noun?
7. Are aliases avoided unless compatibility is the explicit topic?
8. Are JS hooks and APIs source-accurate?
9. If a new class is proposed, did primitive composition fail first?

---

## Drift Warning Signs

- surfaces are described as primitives because of their file location
- a docs example uses a class that does not exist in shipped source
- a second framed-surface noun appears beside `wb-card` for the same job
- a pattern-local class is presented as a global primitive
- a generic title class is used where the source contract is actually family-specific
- a compatibility alias appears as the first or only documented path
- behavior is described from memory instead of current `src/js/` behavior
- HTML hierarchy is replaced by a new class name instead of semantic structure

Drift warning:

Misclassifying surfaces as primitives leads to vocabulary drift and parallel naming.
Always classify by UI role, not by file location.

---

## Common Gotchas

1. `webblocks-icons.css` is optional, but required for `<i class="wb-icon wb-icon-..."></i>` usage.
2. Missing `<i>` icon classes render the fallback `help-circle` mask, not an empty placeholder.
3. `wb-confirm` is a modal variant on the `.wb-modal` wrapper.
4. `wb-stat` lives in `card.css`; there is no separate stat stylesheet.
5. `wb-page-header`, `wb-page-actions`, and `wb-stat-row` live in `dashboard-shell.css`; framed dashboard regions still use the card family from `card.css`.
6. `wb-divider` exists in both layout and primitive sources, but the richer primitive API is the canonical one to document.
7. `wb-grid-2`, `wb-grid-3`, and `wb-grid-4` exist in both layout and utility sources; both ship compatible behavior, but `container.css` is the broader layout primitive source.
8. `WBTheme` stores values in localStorage under `wb-*` keys and re-syncs control buttons automatically.
9. `data-wb-mode-cycle` updates the icon inside the button if it contains either `<use>` or `<i class="wb-icon">`.
10. `WBAjaxToggle` disables the checkbox during the request and reverts its state on failure.
11. `WBCommandPalette` uses `Cmd/Ctrl + K`; `data-wb-cmd-shortcut` is mentioned in comments but is not actually wired in the shipped JS, so do not rely on custom shortcut attributes.
12. `wb-navbar` is sticky by default; add `wb-navbar--static` to opt out.
13. `wb-sidebar` is always visible on desktop by CSS; JS open/close matters mainly for mobile.
14. `sitemap` is not a shipped Lucide icon in this set; use `wb-icon-folder-tree` when you need that concept.

---

## Build and Source of Truth

Package build command:

```bash
./build.sh
```

Implementation source of truth:

- CSS: `packages/webblocks/src/css/`
- JS: `packages/webblocks/src/js/`
- icon source: `packages/webblocks/src/css/icons/webblocks-icons.svg`
- icon CSS source: `packages/webblocks/src/css/icons/webblocks-icons.css`
- build manifest/order: `packages/webblocks/build.sh`

If this guide conflicts with the source files, trust the source files and update this guide.
