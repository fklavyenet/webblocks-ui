# WebBlocks UI

WebBlocks UI - UI building blocks for humans and AI.

**No build step. No npm. No dependencies.**

Works with Laravel Blade, Craft Twig, Django templates, or plain HTML files.

---

## Identity

- foundation for tokens and theme axes
- layout primitives for structure
- primitives for controls and local UI contracts
- surfaces for framed content regions
- patterns for real screens

WebBlocks stays HTML-first. You use standard markup, shipped classes, and opt-in JavaScript behavior.

## Start The Right Way

Start from patterns, not primitives.

- [`../../PATTERNS.md`](../../PATTERNS.md) - canonical auth, dashboard, form, and marketing starting points
- [`../../PRIMITIVES.md`](../../PRIMITIVES.md) - definitions for layout primitives, UI primitives, and utilities
- [`../../INTEGRATION.md`](../../INTEGRATION.md) - pattern-first architecture rules
- [`INTEGRATION.md`](INTEGRATION.md) - shipped package reference sourced from `src/` and `build.sh`

---

## Quick start

```html
<link rel="stylesheet" href="dist/webblocks-ui.css">
<script src="dist/webblocks-ui.js"></script>
```

Add the dist files to your project, choose a pattern, and adapt the surfaces and primitives it uses.

---

## Repository Context

In this repository, the package itself lives in `packages/webblocks/`.

Reference docs and integrated pattern examples live under `docs/`.

---

## Theme engine

Set axes on the `<html>` element:

```html
<html data-mode="dark"
      data-accent="ocean"
      data-preset="modern"
      data-density="compact"
      data-radius="soft"
      data-shadow="flat"
      data-border="subtle">
```

| Attribute      | Values                                                                              |
|----------------|-------------------------------------------------------------------------------------|
| `data-mode`    | `light` \| `dark` \| `auto`                                                        |
| `data-accent`  | `ocean` \| `forest` \| `sunset` \| `royal` \| `mint` \| `amber` \| `rose` \| `slate-fire` |
| `data-preset`  | `modern` \| `minimal` \| `editorial` \| `playful` \| `corporate`                  |
| `data-radius`  | `sharp` \| `soft`                                                                   |
| `data-density` | `compact` \| `comfortable`                                                          |
| `data-shadow`  | `flat` \| `soft`                                                                    |
| `data-border`  | `none` \| `subtle` \| `medium` \| `bold` \| `dashed`                               |

`data-mode="auto"` respects the OS `prefers-color-scheme` setting.

### Switch via buttons

```html
<button data-wb-mode-set="dark">Dark</button>
<button data-wb-mode-set="light">Light</button>
<button data-wb-accent-set="forest">Forest</button>
<button data-wb-preset-set="playful">Playful</button>
```

Preferences are saved to `localStorage` automatically.

---

## Shipped Building Blocks

Use this section after you choose a pattern. It inventories the shipped UI primitives, shells, helpers, and interaction patterns.

### Button

```html
<button class="wb-btn wb-btn-primary">Save</button>
<button class="wb-btn wb-btn-secondary">Cancel</button>
<button class="wb-btn wb-btn-outline">Outline</button>
<button class="wb-btn wb-btn-ghost">Ghost</button>
<button class="wb-btn wb-btn-danger">Delete</button>

<!-- Sizes -->
<button class="wb-btn wb-btn-primary wb-btn-sm">Small</button>
<button class="wb-btn wb-btn-primary wb-btn-lg">Large</button>

<!-- Icon-only -->
<button class="wb-btn wb-btn-ghost wb-btn-icon">✕</button>
```

### Badge

```html
<span class="wb-badge wb-badge-primary">New</span>
<span class="wb-badge wb-badge-success wb-badge-dot">Active</span>
<span class="wb-badge wb-badge-danger">Error</span>
```

### Card

```html
<div class="wb-card">
  <div class="wb-card-header">Title</div>
  <div class="wb-card-body">Content</div>
  <div class="wb-card-footer">Footer</div>
</div>
```

### Stat card

```html
<div class="wb-stat">
  <div class="wb-stat-label">Total Users</div>
  <div class="wb-stat-value">1,284</div>
  <div class="wb-stat-delta wb-stat-delta-up">+12%</div>
</div>
```

### Alert

```html
<div class="wb-alert wb-alert-info">Informational message.</div>
<div class="wb-alert wb-alert-success">Success!</div>
<div class="wb-alert wb-alert-warning">Warning message.</div>
<div class="wb-alert wb-alert-danger wb-alert-dismiss">
  Error message.
  <button class="wb-alert-close" data-wb-dismiss="alert">&times;</button>
</div>
```

### Form

Assistive field content must be wrapped in `wb-field-meta`. Do not place `wb-field-hint` or `wb-field-error` directly under `wb-field`.

```html
<div class="wb-field">
  <label class="wb-label">Email</label>
  <input class="wb-input" type="email" placeholder="you@example.com">
  <div class="wb-field-meta">
    <div class="wb-field-error">This field is required.</div>
  </div>
</div>

<select class="wb-select"> ... </select>
<textarea class="wb-textarea"></textarea>

<label class="wb-check"><input type="checkbox"> Remember me</label>
<label class="wb-radio"><input type="radio"> Option</label>
<label class="wb-switch">
  <input type="checkbox">
  <span class="wb-switch-track"></span>
  Enabled
</label>
```

### Table

```html
<div class="wb-table-wrap">
  <table class="wb-table wb-table-hover">
    <thead><tr><th>Name</th><th>Status</th></tr></thead>
    <tbody><tr><td>Alice</td><td>Active</td></tr></tbody>
  </table>
</div>
```

Modifiers: `wb-table-hover`, `wb-table-striped`, `wb-table-sm`

### Modal

```html
<!-- Trigger -->
<button data-wb-toggle="modal" data-wb-target="#myModal">Open</button>

<!-- Modal -->
<div class="wb-modal" id="myModal" role="dialog" aria-modal="true">
  <div class="wb-modal-dialog">
    <div class="wb-modal-header">
      <h5 class="wb-modal-title">Title</h5>
      <button class="wb-modal-close" data-wb-dismiss="modal">&times;</button>
    </div>
    <div class="wb-modal-body">Content</div>
    <div class="wb-modal-footer">
      <button class="wb-btn wb-btn-secondary" data-wb-dismiss="modal">Cancel</button>
      <button class="wb-btn wb-btn-primary">Save</button>
    </div>
  </div>
</div>
```

Sizes: `wb-modal-sm`, `wb-modal-lg`, `wb-modal-xl`

### Confirmation dialog

```html
<div class="wb-modal wb-confirm" id="myConfirm" role="alertdialog" aria-modal="true">
  <div class="wb-modal-dialog">
    <div class="wb-modal-body">
      <div class="wb-confirm-icon wb-confirm-icon-danger">!</div>
      <div class="wb-confirm-title">Delete item?</div>
      <div class="wb-confirm-message">This action cannot be undone.</div>
    </div>
    <div class="wb-modal-footer">
      <button class="wb-btn wb-btn-secondary" data-wb-dismiss="modal">Cancel</button>
      <button class="wb-btn wb-btn-danger">Delete</button>
    </div>
  </div>
</div>
```

### Dropdown

```html
<div class="wb-dropdown">
  <button class="wb-btn wb-btn-secondary" data-wb-toggle="dropdown" aria-expanded="false">
    Actions ▾
  </button>
  <ul class="wb-dropdown-menu">
    <li><a class="wb-dropdown-item" href="#">Edit</a></li>
    <li class="wb-dropdown-divider"></li>
    <li><a class="wb-dropdown-item" href="#">Delete</a></li>
  </ul>
</div>
```

### Tabs

```html
<div class="wb-tabs" data-wb-tabs>
  <div class="wb-tabs-nav" role="tablist">
    <button class="wb-tabs-btn is-active" data-wb-tab="tab1" role="tab"
            aria-selected="true" aria-controls="tab1">Tab 1</button>
    <button class="wb-tabs-btn" data-wb-tab="tab2" role="tab"
            aria-selected="false" aria-controls="tab2" tabindex="-1">Tab 2</button>
  </div>
  <div>
    <div class="wb-tabs-panel is-active" id="tab1" role="tabpanel">Content 1</div>
    <div class="wb-tabs-panel" id="tab2" role="tabpanel">Content 2</div>
  </div>
</div>
```

### Accordion

```html
<div class="wb-accordion" data-wb-accordion data-wb-accordion-single="true">
  <div class="wb-accordion-item">
    <button class="wb-accordion-trigger" data-wb-accordion-trigger
            aria-expanded="false" aria-controls="a1">
      Question
      <span class="wb-accordion-icon"></span>
    </button>
    <div class="wb-accordion-content" id="a1" style="max-height:0">
      <div class="wb-accordion-body">Answer content.</div>
    </div>
  </div>
</div>
```

### Pagination

```html
<nav class="wb-pagination">
  <a class="wb-page-item" href="#">&laquo;</a>
  <a class="wb-page-item is-active" href="#">1</a>
  <a class="wb-page-item" href="#">2</a>
  <a class="wb-page-item" href="#">&raquo;</a>
</nav>
```

### Breadcrumb

```html
<nav aria-label="Breadcrumb">
  <ol class="wb-breadcrumb wb-breadcrumb-minimal">
    <li class="wb-breadcrumb-item"><a href="#">Home</a></li>
    <li class="wb-breadcrumb-item"><a href="#">Settings</a></li>
    <li class="wb-breadcrumb-item is-active"><span aria-current="page">Profile</span></li>
  </ol>
</nav>
```

Presets:

- `wb-breadcrumb-minimal` - safe default for admin/dashboard headers
- `wb-breadcrumb-surface` - soft surfaced variant for gentle separation
- `wb-breadcrumb-bordered` - structured variant for data-heavy panels
- `wb-breadcrumb-inline` - compact slash-first variant for tool-like UIs
- `wb-breadcrumb-context` - single-item context label variant

Separators:

- `wb-breadcrumb-sep-chevron`
- `wb-breadcrumb-sep-slash`
- `wb-breadcrumb-sep-none`

Use breadcrumb as secondary context, not as the page heading. Prefer product-first, context-second hierarchy in topbars.

Quick guidance:

- `minimal` - default admin/dashboard breadcrumb
- `surface` - soft separation inside calmer headers
- `bordered` - enterprise/data-heavy structured headers
- `inline` - tool-like, dense horizontal context
- `context` - single-item location label when a full trail is unnecessary

### Avatar

```html
<div class="wb-avatar">JD</div>
<div class="wb-avatar wb-avatar-lg wb-avatar-success">AB</div>

<!-- Group -->
<div class="wb-avatar-group">
  <div class="wb-avatar wb-avatar-sm">A1</div>
  <div class="wb-avatar wb-avatar-sm">A2</div>
  <div class="wb-avatar wb-avatar-sm wb-avatar-muted">+3</div>
</div>
```

Sizes: `wb-avatar-sm`, _(default)_, `wb-avatar-lg`, `wb-avatar-xl`
Colors: `wb-avatar-success`, `wb-avatar-warning`, `wb-avatar-danger`, `wb-avatar-info`, `wb-avatar-muted`

### Toast

```html
<!-- Container is created automatically — no HTML needed for programmatic toasts -->
```

```js
// Programmatic (recommended)
WBToast.show('Saved successfully');
WBToast.show('Something went wrong', { type: 'danger' });
WBToast.show('Upload complete', {
  type: 'success',
  title: 'Done',
  position: 'top-right',   // top-right | top-center | top-left | bottom-right | bottom-center | bottom-left
  duration: 4000,           // ms, 0 = no auto-dismiss
  closable: true
});
```

```html
<!-- Manual HTML toast -->
<div class="wb-toast-container wb-toast-container-top-right" id="toastArea"></div>

<div class="wb-toast wb-toast-success">
  <div class="wb-toast-body">Saved successfully.</div>
  <button class="wb-toast-close" data-wb-dismiss="toast">&times;</button>
</div>
```

Variants: `wb-toast-success`, `wb-toast-warning`, `wb-toast-danger`, `wb-toast-info`

### Skeleton

```html
<div class="wb-skeleton wb-skeleton-text"></div>
<div class="wb-skeleton wb-skeleton-circle"></div>
<div class="wb-skeleton wb-skeleton-rect" style="height:120px"></div>
```

### Empty state

```html
<div class="wb-empty">
  <div class="wb-empty-icon">📭</div>
  <div class="wb-empty-title">No results</div>
  <div class="wb-empty-text">Try adjusting your filters.</div>
  <div class="wb-empty-action"><button class="wb-btn wb-btn-primary">Add item</button></div>
</div>
```

### Tooltip

Pure CSS — no JavaScript required for hover/focus.

```html
<!-- Default (top) -->
<button data-wb-tooltip="Save changes">Save</button>

<!-- Placements -->
<span data-wb-tooltip="Left side"  data-wb-tooltip-placement="left">Hover</span>
<span data-wb-tooltip="Right side" data-wb-tooltip-placement="right">Hover</span>
<span data-wb-tooltip="Below"      data-wb-tooltip-placement="bottom">Hover</span>

<!-- Multi-line -->
<button data-wb-tooltip="This is a longer tooltip that wraps to multiple lines."
        data-wb-tooltip-wrap>Info</button>

<!-- Show delay (JS required) -->
<button data-wb-tooltip="Delayed" data-wb-tooltip-delay="400">Hover me</button>
```

Triggers on `hover` and `focus-visible` (keyboard accessible).

### Popover

```html
<div class="wb-popover" data-wb-popover>
  <button class="wb-btn wb-btn-secondary" data-wb-toggle="popover">Info</button>
  <div class="wb-popover-panel">
    <div class="wb-popover-header">
      <span class="wb-popover-title">Title</span>
      <button class="wb-popover-close" data-wb-dismiss="popover">&times;</button>
    </div>
    <div class="wb-popover-body">Popover content here.</div>
  </div>
</div>
```

Placements (add to wrapper): `wb-popover-top`, `wb-popover-right`, `wb-popover-left`, `wb-popover-end`

### Alert (dismissible)

```html
<div class="wb-alert wb-alert-info wb-alert-dismiss">
  <span class="wb-alert-title">Heads up!</span>
  This is a dismissible alert.
  <button class="wb-alert-close" data-wb-dismiss="alert" aria-label="Close">&times;</button>
</div>
```

`data-wb-dismiss="alert"` triggers `WBDismiss` — the alert fades out and is removed from the DOM.

### Drawer

```html
<!-- Trigger -->
<button data-wb-toggle="drawer" data-wb-target="#myDrawer">Open</button>

<!-- Drawer -->
<div class="wb-drawer wb-drawer-right" id="myDrawer">
  <div class="wb-drawer-header">
    <h5 class="wb-drawer-title">Title</h5>
    <button class="wb-drawer-close" data-wb-dismiss="drawer">&times;</button>
  </div>
  <div class="wb-drawer-body">Content</div>
  <div class="wb-drawer-footer">
    <button class="wb-btn wb-btn-secondary" data-wb-dismiss="drawer">Close</button>
  </div>
</div>

<div class="wb-drawer-backdrop"></div>
```

Sides: `wb-drawer-right` (default), `wb-drawer-left`, `wb-drawer-top`, `wb-drawer-bottom`
Sizes: `wb-drawer-sm`, `wb-drawer-lg`, `wb-drawer-xl`

Full focus trap — Tab cycles within the drawer; Escape closes.

### Command palette

```html
<!-- Trigger: Cmd/Ctrl+K opens automatically -->
<button data-wb-toggle="cmd" data-wb-target="#myCmdPalette">Search</button>

<!-- Palette -->
<div class="wb-cmd-backdrop" id="myCmdPalette">
  <div class="wb-cmd-dialog" role="dialog" aria-modal="true">
    <div class="wb-cmd-search">
      <input class="wb-cmd-input" type="text" placeholder="Search...">
    </div>
    <div class="wb-cmd-results">
      <a class="wb-cmd-item" href="#">Dashboard</a>
      <a class="wb-cmd-item" href="#">Settings</a>
    </div>
  </div>
</div>
```

Keyboard: `↑` `↓` navigate, `↵` activate, `Esc` close.

### Nav group

```html
<!-- Sidebar navigation with collapsible groups -->
<nav data-wb-nav-group-accordion>
  <div class="wb-nav-group">
    <button class="wb-nav-group-toggle">
      Settings
      <span class="wb-nav-group-arrow"></span>
    </button>
    <div class="wb-nav-group-items">
      <a class="wb-nav-group-item" href="#">Profile</a>
      <a class="wb-nav-group-item" href="#">Security</a>
    </div>
  </div>

  <a class="wb-menu-item is-active" href="#">Dashboard</a>
</nav>
```

`data-wb-nav-group-accordion` on the parent closes siblings when one group opens.

### Filter bar

```html
<div class="wb-filter-bar">
  <div class="wb-filter-bar-start">
    <div class="wb-search-bar">
      <input class="wb-search-bar-input" type="search" placeholder="Search...">
    </div>
    <select class="wb-filter-select">
      <option>All statuses</option>
    </select>
    <button class="wb-filter-chip is-active">Active</button>
  </div>
  <div class="wb-filter-bar-end">
    <span class="wb-filter-results">12 results</span>
  </div>
</div>
```

### Action menu

```html
<div class="wb-action-group">
  <button class="wb-action-btn wb-btn wb-btn-ghost wb-btn-icon"
          data-wb-tooltip="Edit" data-wb-tooltip-placement="top">✎</button>
  <button class="wb-action-btn wb-action-btn-delete"
          data-wb-tooltip="Delete">✕</button>
</div>

<!-- Status pill -->
<span class="wb-status-pill wb-status-active">Active</span>
<span class="wb-status-pill wb-status-inactive">Inactive</span>
<span class="wb-status-pill wb-status-pending">Pending</span>
```

### Loading

```html
<!-- Inline spinner -->
<span class="wb-spinner"></span>
<span class="wb-spinner wb-spinner-sm"></span>
<span class="wb-spinner wb-spinner-lg"></span>

<!-- Full overlay (on a positioned parent) -->
<div class="wb-loading-overlay is-open">
  <span class="wb-spinner wb-spinner-lg"></span>
</div>

<!-- Full-screen loading screen -->
<div class="wb-loading-screen is-open">
  <span class="wb-spinner wb-spinner-xl"></span>
</div>

<!-- Progress bar (indeterminate) -->
<div class="wb-loading-bar is-open"></div>

<!-- Progress bar (determinate) -->
<div class="wb-progress-bar">
  <div class="wb-progress-bar-fill" style="width: 65%"></div>
</div>
```

### Divider

```html
<!-- Horizontal -->
<hr class="wb-divider">

<!-- Labeled -->
<div class="wb-divider-label"><span>OR</span></div>

<!-- Dashed / dotted -->
<hr class="wb-divider wb-divider-dashed">
<hr class="wb-divider wb-divider-dotted">

<!-- Vertical (in a flex row) -->
<span class="wb-divider-v"></span>
```

### List group

```html
<ul class="wb-list">
  <li class="wb-list-item">Item one</li>
  <li class="wb-list-item is-active">Item two (active)</li>
  <li class="wb-list-item">Item three</li>
</ul>

<!-- Flush (no outer border) -->
<ul class="wb-list wb-list-flush"> ... </ul>

<!-- Compact -->
<ul class="wb-list wb-list-sm"> ... </ul>

<!-- Numbered -->
<ol class="wb-list wb-list-numbered"> ... </ol>
```

### Toolbar

Action bar for tables and list views. Supports bulk-select mode.

```html
<div class="wb-toolbar">
  <div class="wb-toolbar-start">
    <span class="wb-toolbar-title">Users</span>
  </div>
  <div class="wb-toolbar-end">
    <button class="wb-btn wb-btn-primary wb-btn-sm">Add user</button>
  </div>
</div>

<!-- Bulk action bar (shown with is-active when rows are selected) -->
<div class="wb-toolbar-bulk is-active">
  <span>3 selected</span>
  <button class="wb-btn wb-btn-danger wb-btn-sm">Delete</button>
  <button class="wb-btn wb-btn-ghost wb-btn-sm">Deselect</button>
</div>
```

Modifier: `wb-toolbar-inset` is the bordered variant for use inside a card or table wrapper.

---

## Icons

WebBlocks ships a curated set of **173 Lucide icons** as a CSS icon file for mask-image based usage.

**For users:** Use the pre-built icon files from `dist/`.

**For developers:** The shipped CSS mappings are built from the internal source icon set in `src/css/icons/webblocks-icons.svg`.

### Canonical usage — Bootstrap style `<i>` tag

Requires `webblocks-icons.css` in addition to `webblocks-ui.css`:

```html
<link rel="stylesheet" href="/dist/webblocks-ui.css">
<link rel="stylesheet" href="/dist/webblocks-icons.css">

<i class="wb-icon wb-icon-settings"></i>
<i class="wb-icon wb-icon-settings wb-icon-lg wb-icon-accent"></i>
<i class="wb-icon wb-icon-trash wb-icon-sm wb-icon-danger"></i>
```

### Sizes

```html
<i class="wb-icon wb-icon-settings wb-icon-xs"></i>   <!-- 14px -->
<i class="wb-icon wb-icon-settings wb-icon-sm"></i>   <!-- 16px -->
<i class="wb-icon wb-icon-settings"></i>              <!-- 18px default -->
<i class="wb-icon wb-icon-settings wb-icon-lg"></i>   <!-- 24px -->
<i class="wb-icon wb-icon-settings wb-icon-xl"></i>   <!-- 32px -->
<i class="wb-icon wb-icon-settings wb-icon-2xl"></i>  <!-- 40px -->
```

### Colors

```html
<i class="wb-icon wb-icon-activity wb-icon-accent"></i>
<i class="wb-icon wb-icon-activity wb-icon-success"></i>
<i class="wb-icon wb-icon-activity wb-icon-warning"></i>
<i class="wb-icon wb-icon-activity wb-icon-danger"></i>
<i class="wb-icon wb-icon-activity wb-icon-muted"></i>
```

### Icon wrap (colored badge container)

```html
<span class="wb-icon-wrap">
  <i class="wb-icon wb-icon-settings wb-icon-sm"></i>
</span>

<span class="wb-icon-wrap wb-icon-wrap-success wb-icon-wrap-circle">
  <i class="wb-icon wb-icon-shield-check wb-icon-sm"></i>
</span>
```

Variants: `wb-icon-wrap-success`, `wb-icon-wrap-warning`, `wb-icon-wrap-danger`, `wb-icon-wrap-info`, `wb-icon-wrap-muted`
Sizes: `wb-icon-wrap-sm`, `wb-icon-wrap-lg`
Shape: `wb-icon-wrap-circle`

### In buttons

```html
<button class="wb-btn wb-btn-primary wb-icon-btn">
  <i class="wb-icon wb-icon-plus wb-icon-sm"></i>
  New item
</button>
```

### Icon system standard

- CSS icon classes use `wb-icon-*` names, for example `wb-icon-settings`
- CSS icon usage stays compact:

```html
<i class="wb-icon wb-icon-settings" aria-hidden="true"></i>
```

- Brand icons follow Lucide kebab-case names as shipped, for example `wb-icon-github`, `wb-icon-linkedin`, `wb-icon-twitter`, `wb-icon-instagram`, `wb-icon-youtube`

### Future icon workflow

1. Add or remove icons in `packages/webblocks/scripts/update-icons.js`
2. Run `node packages/webblocks/scripts/update-icons.js` from the repo root, or `node scripts/update-icons.js` from inside `packages/webblocks/`
3. Run `./packages/webblocks/build.sh` from the repo root, or `./build.sh` from inside `packages/webblocks/`, to regenerate `dist/` and CSS mappings
4. Verify `<i class="wb-icon wb-icon-*"></i>` mappings still work

Live preview with search: `../../docs/icons.html`

---

## Using with Laravel

WebBlocks UI is plain HTML and CSS — it works in any Laravel Blade template without any extra setup. Just include the dist files and write standard HTML:

```blade
<button class="wb-btn wb-btn-primary">Save</button>

<div class="wb-field">
    <label class="wb-label" for="email">Email</label>
    <input class="wb-input" type="email" name="email" id="email">
    <div class="wb-field-meta">
    @error('email')
        <div class="wb-field-error">{{ $message }}</div>
    @enderror
    </div>
</div>

<div class="wb-alert wb-alert-success">{{ session('status') }}</div>
```

No Blade wrappers or hidden markup APIs — HTML stays HTML.

### AJAX Toggle

Sends a JSON POST automatically when the checkbox changes. Designed for Laravel admin panels.

```html
<input type="checkbox"
       class="wb-switch"
       data-wb-ajax-toggle
       data-wb-url="/admin/posts/toggle"
       data-wb-field="publish"
       data-wb-id="42"
       checked>
```

POST body:
```json
{ "id": "42", "name": "publish", "checked": "true" }
```

| Attribute | Description |
|---|---|
| `data-wb-ajax-toggle` | Marker — required |
| `data-wb-url` | POST endpoint — required |
| `data-wb-field` | Field name (sent as `name`) — required |
| `data-wb-id` | Record ID — required |
| `data-wb-feedback` | `toast` (default) \| `none` |
| `data-wb-success-msg` | Özel başarı toast metni |
| `data-wb-error-msg` | Özel hata toast metni |

- `X-CSRF-TOKEN` header is read automatically from `<meta name="csrf-token">`
- On error, the checkbox reverts to its previous value
- HTTP 200–299 ve/veya `{ "success": true }` JSON yanıtı başarı olarak kabul edilir

---

## JavaScript API

Interactive modules expose `window.*` objects for opt-in behavior:

- `WBTheme`
- `WBModal`
- `WBDropdown`
- `WBTabs`
- `WBAccordion`
- `WBSidebar`
- `WBNavGroup`
- `WBDrawer`
- `WBCommandPalette`
- `WBToast`
- `WBPopover`
- `WBTooltip`
- `WBDismiss`
- `WBAjaxToggle`
- `WBCollapse`

Use [`INTEGRATION.md`](INTEGRATION.md) for canonical method signatures, data attributes, and emitted events.

---

## Build

**For users:** The dist files are pre-built and ready to use. No build step required.

**For developers:** Regenerate dist files from source:

```bash
chmod +x ./packages/webblocks/build.sh
./packages/webblocks/build.sh
```

This concatenates source files into `dist/webblocks-ui.css` and `dist/webblocks-ui.js`, and regenerates the icon CSS mappings from the internal source icon set.

No npm. No node_modules. Pure shell script.

### Icon regeneration (development only)

To regenerate the shipped icon CSS after changing the source icon set:

```bash
node packages/webblocks/scripts/build-icons.js
```

This reads `src/css/icons/webblocks-icons.svg` and writes `src/css/icons/webblocks-icons.css` plus `dist/webblocks-icons.css`.

To refresh the source icon set itself from Lucide:

```bash
node packages/webblocks/scripts/update-icons.js
./packages/webblocks/build.sh
```

`update-icons.js` requires internet access and is only for maintainers changing the curated icon list.

---

## Package structure

```
packages/webblocks/
├── dist/
│   ├── webblocks-ui.css         ← main stylesheet (always include)
│   ├── webblocks-ui.js          ← main JS (always include)
│   └── webblocks-icons.css      ← icon classes (173 icons, opt-in)
├── src/
│   ├── css/
│   │   ├── foundation/      tokens, dark, presets, accents, radius,
│   │   │                    density, shadow, font, border
│   │   ├── base/            reset, elements
│   │   ├── foundation/      tokens, dark, presets, accents, radius,
│   │   │                    density, shadow, font, border, reset, elements
│   │   ├── layout/          container, grid, navbar, sidebar
│   │   ├── primitives/      button, badge, card, alert, form, table,
│   │   │                    modal, dropdown, tabs, accordion, pagination,
│   │   │                    breadcrumb, avatar, toast, skeleton, empty,
│   │   │                    nav-group, filter-bar, action-menu, loading,
│   │   │                    popover, drawer, command-palette, divider,
│   │   │                    list-group, tooltip, toolbar, callout,
│   │   │                    section-heading, link-list, inline-list, promo,
│   │   │                    radio-card, collapse, scoped webgames primitives
│   │   ├── patterns/        page-intro, auth-shell, dashboard-shell,
│   │   │                    settings-shell, content-shell, marketing,
│   │   │                    webgames-screen
│   │   ├── utilities/       helpers
│   │   └── icons/           icons.css, webblocks-icons.svg, webblocks-icons.css (internal source + generated CSS)
│   └── js/
│       ├── theme.js         theme engine
│       ├── dropdown.js      dropdown toggle
│       ├── modal.js         modal + confirmation dialog, focus trap
│       ├── tabs.js          tab panels with keyboard nav
│       ├── accordion.js     animated accordion
│       ├── sidebar.js       mobile sidebar + backdrop
│       ├── nav-group.js     collapsible sidebar nav groups
│       ├── drawer.js        drawer with focus trap + Escape
│       ├── command-palette.js  Cmd/Ctrl+K palette with ↑↓↵Esc
│       ├── toast.js         programmatic toasts + auto-dismiss
│       ├── popover.js       toggle, Escape + outside-click
│       ├── tooltip.js       programmatic show/hide + delay
│       └── dismiss.js       alert/banner dismiss with animation
└── build.sh
```

---

## Accent colors

Each accent exposes 12 CSS custom properties usable anywhere in your UI:

| Token                   | Purpose                               |
|-------------------------|---------------------------------------|
| `--wb-accent`           | Primary action color                  |
| `--wb-accent-hover`     | Hover state                           |
| `--wb-accent-active`    | Pressed / active state                |
| `--wb-accent-soft`      | Subtle tinted background              |
| `--wb-accent-softer`    | Very subtle tinted background         |
| `--wb-accent-border`    | Tinted border / divider               |
| `--wb-accent-text`      | Text color on light surfaces          |
| `--wb-accent-on`        | Text/icon on filled accent background |
| `--wb-accent-ring`      | Focus ring (`rgb(...)` value)         |
| `--wb-accent-ring-rgb`  | Focus ring channels (`r g b`)         |
| `--wb-accent-selection` | `::selection` background              |
| `--wb-accent-glow-rgb`  | Glow / shadow tint (`r g b`)          |

`--wb-primary`, `--wb-primary-dark`, `--wb-primary-soft` are backward-compat aliases that resolve to `--wb-accent`, `--wb-accent-hover`, `--wb-accent-soft` automatically.

| Key          | Description         |
|--------------|---------------------|
| `ocean`      | Blue-teal (default) |
| `forest`     | Deep green          |
| `sunset`     | Orange / warm       |
| `royal`      | Indigo / purple     |
| `mint`       | Teal / cyan         |
| `amber`      | Amber / gold        |
| `rose`       | Pink / rose         |
| `slate-fire` | Red / ember         |

---

## License

Copyright (c) 2026 fklavye.net. All rights reserved.

See [LICENSE](../../LICENSE) for full terms.
