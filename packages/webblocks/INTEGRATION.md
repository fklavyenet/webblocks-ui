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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fklavyenet/webblocks-ui@master/dist/webblocks-ui.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fklavyenet/webblocks-ui@master/dist/webblocks-icons.css">
<script src="https://cdn.jsdelivr.net/gh/fklavyenet/webblocks-ui@master/dist/webblocks-ui.js" defer></script>
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

### Cards, Stats, Panels

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

<section class="wb-panel">
  <div class="wb-panel-header">
    <h3 class="wb-panel-title">Recent Orders</h3>
  </div>
  <div class="wb-panel-body">...</div>
</section>
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
  <div class="wb-field-hint">We never share your email.</div>
  <div class="wb-field-error">Required</div>
</div>
```

Shipped form primitives:

- `wb-field`, `wb-label`, `wb-label-hint`, `wb-field-hint`, `wb-field-error`
- `wb-input`, `wb-select`, `wb-textarea`
- `wb-input-sm`, `wb-input-lg`, `wb-select-sm`, `wb-select-lg`
- `wb-input-error`, `wb-select-error`, `wb-textarea-error`
- `wb-form-row`, `wb-form-group`
- `wb-check`, `wb-radio`, `wb-switch`
- `wb-input-wrap`, `wb-input-icon`, `wb-input-suffix`
- `wb-input-group`, `wb-input-addon`, `wb-input-addon-btn`

Auth rule:

- auth forms MUST use the canonical `wb-field` / `wb-label` / `wb-input` / `wb-field-error` system
- DO NOT create auth-only field systems such as `guest-auth-*`, `qz-auth-*`, or other parallel naming schemes

Examples:

```html
<div class="wb-form-row">
  <div class="wb-field">
    <label class="wb-label" for="first-name">First name</label>
    <input id="first-name" class="wb-input" type="text">
  </div>
  <div class="wb-field">
    <label class="wb-label" for="last-name">Last name</label>
    <input id="last-name" class="wb-input" type="text">
  </div>
</div>

<div class="wb-input-group">
  <span class="wb-input-addon">https://</span>
  <input class="wb-input" type="text" value="example.com">
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

Common related classes:

- table: `wb-table-hover`, `wb-table-striped`, `wb-table-sm`
- toolbar: `wb-toolbar-sm`, `wb-toolbar-bulk`, `wb-toolbar-bulk-count`, `wb-toolbar-bulk-clear`
- filter bar: `wb-filter-count`, `wb-search-bar-sm`, `wb-search-bar-lg`
- actions: `wb-action-link`, `wb-action-link-danger`, `wb-action-more`, `wb-action-more-btn`, `wb-table-check-cell`

### Dropdowns

```html
<div class="wb-dropdown">
  <button class="wb-btn wb-btn-secondary" data-wb-toggle="dropdown" aria-expanded="false">
    Actions
  </button>
  <div class="wb-dropdown-menu">
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

### Modals and Confirmation Dialogs

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

### Drawers

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

<div class="wb-drawer-backdrop"></div>
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
  <button class="wb-btn wb-btn-secondary" data-wb-toggle="popover">Info</button>
  <div class="wb-popover-panel">
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

Optional JS enhancement:

- `data-wb-tooltip-delay="300"`

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

<nav class="wb-pagination" aria-label="Pagination">
  <a href="#" class="wb-page-item">&laquo;</a>
  <a href="#" class="wb-page-item is-active">1</a>
  <a href="#" class="wb-page-item">2</a>
  <a href="#" class="wb-page-item">&raquo;</a>
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
            <h1 class="wb-page-title">Overview</h1>
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
- canonical page-header stack is: breadcrumb optional, title required, subtitle optional, actions optional
- breadcrumb belongs above the title inside `wb-page-header-main`, not as a competing heading

### Auth Shell

```html
<div class="wb-auth-shell">
  <div class="wb-auth-card">
    <div class="wb-auth-logo">
      <h1 class="wb-auth-logo-title">Sign in</h1>
      <p class="wb-auth-logo-subtitle">Welcome back</p>
    </div>
    <div class="wb-auth-body">...</div>
    <div class="wb-auth-footer">Need an account?</div>
  </div>
</div>
```

Canonical auth shell:

- use `wb-auth-shell` and `wb-auth-card`
- build all auth form controls with the standard field system, not auth-specific field wrappers
- there is no alternate legacy shell class to prefer over `wb-auth-shell`

Split variant:

- `wb-auth-shell wb-auth-split`
- `wb-auth-panel`
- `wb-auth-form-area`

### Settings Shell

```html
<div class="wb-settings-shell">
  <aside class="wb-settings-nav">
    <div class="wb-settings-nav-header">Account</div>
    <a class="wb-settings-nav-link is-active" href="#">Profile</a>
  </aside>
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
- keep settings content inside `wb-settings-section` blocks instead of inventing page-specific card wrappers

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
      <h1 class="wb-page-title">Visible structure, quiet defaults.</h1>
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

---

## Screen Composition Examples

These are canonical starting structures. Extend them with shipped primitives and shells before adding custom wrappers.

### Auth Screen

```html
<div class="wb-auth-shell">
  <div class="wb-auth-card">
    <div class="wb-auth-logo">
      <h1 class="wb-auth-logo-title">Sign in</h1>
      <p class="wb-auth-logo-subtitle">Access your dashboard</p>
    </div>
    <div class="wb-auth-body">
      <div class="wb-stack wb-stack-4">
        <div class="wb-field">
          <label class="wb-label" for="login-email">Email</label>
          <input class="wb-input" id="login-email" type="email" placeholder="you@example.com">
        </div>
        <div class="wb-field">
          <label class="wb-label" for="login-password">Password</label>
          <input class="wb-input" id="login-password" type="password">
          <div class="wb-field-error">Required</div>
        </div>
        <button class="wb-btn wb-btn-primary">Sign in</button>
      </div>
    </div>
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
            <h1 class="wb-page-title">Overview</h1>
            <p class="wb-page-subtitle">Current account status</p>
          </div>
        </div>
      </div>
      <section class="wb-panel">
        <div class="wb-panel-header">
          <h2 class="wb-panel-title">Recent activity</h2>
        </div>
        <div class="wb-panel-body">...</div>
      </section>
    </main>
  </div>
</div>
```

### Settings Page

```html
<div class="wb-settings-shell">
  <aside class="wb-settings-nav">
    <div class="wb-settings-nav-header">Account</div>
    <a class="wb-settings-nav-link is-active" href="#">Profile</a>
    <a class="wb-settings-nav-link" href="#">Security</a>
  </aside>

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
- transform and spacing: `wb-uppercase`, `wb-lowercase`, `wb-capitalize`, `wb-tracking-tight`, `wb-tracking-normal`, `wb-tracking-wide`, `wb-tracking-wider`, `wb-tracking-widest`
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
- build forms only with `wb-field`, `wb-label`, `wb-input` / `wb-select` / `wb-textarea`, `wb-field-hint`, and `wb-field-error`
- choose breadcrumb presets by job: `minimal` for standard admin headers, `surface` for soft separated headers, `bordered` for enterprise/data-heavy panels, `inline` for dense tool-like context, `context` for single-item location labels
- keep header hierarchy strict: breadcrumb optional, title required, subtitle optional, actions optional
- keep topbar identity strict: product first, context second
- use canonical shell and primitive names when both canonical and legacy aliases exist
- NEVER invent a parallel class system for auth, settings, dashboard, icons, or field controls when shipped classes already exist
- NEVER create project-specific wrappers before checking whether the same structure can be expressed with shipped primitives and shells

---

## DO / DO NOT

DO:

- compose screens from shipped primitives before inventing new wrappers
- ALWAYS compose layouts using `wb-stack`, `wb-cluster`, `wb-grid`, and related primitives before introducing new wrapper classes
- use `wb-dashboard-shell` for dashboard layouts, `wb-settings-shell` for settings pages, and `wb-content-shell` for editorial/document pages
- use `wb-field`, `wb-label`, `wb-input`, `wb-field-hint`, and `wb-field-error` for canonical forms
- use `wb-auth-shell` + `wb-auth-card` for auth screens and keep auth fields on the canonical field system
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
- do not style breadcrumbs as page titles or make them compete visually with headings
- do not repeat the same noun in breadcrumb and title without a hierarchy reason
- do not make topbar context more visually dominant than the product name
- do not assume `WBModal.open('id')` or `WBDrawer.open('id')`; pass elements
- do not assume `WBDropdown.open(triggerEl)`; pass the menu element
- do not hardcode accent colors in new CSS; use `--wb-accent*` tokens
- do not mix `wb-shell` and `wb-dashboard-shell` in the same layout tree
- do not invent a separate loader icon class when `wb-spinner` already exists

---

## Common Gotchas

1. `webblocks-icons.css` is optional, but required for `<i class="wb-icon wb-icon-..."></i>` usage.
2. Missing `<i>` icon classes render the fallback `help-circle` mask, not an empty placeholder.
3. `wb-confirm` is a modal variant on the `.wb-modal` wrapper.
4. `wb-stat` lives in `card.css`; there is no separate stat stylesheet.
5. `wb-panel`, `wb-page-header`, `wb-page-actions`, and `wb-stat-row` live in `dashboard-shell.css`.
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
