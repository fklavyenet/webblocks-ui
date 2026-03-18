# WebBlocks UI — Integration Reference

A concise reference for AI agents and developers integrating WebBlocks UI into a project.

---

## Installation (CDN)

```html
<!-- Core CSS + JS (required) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fklavyenet/webblocks-ui@master/dist/webblocks-ui.css">
<script src="https://cdn.jsdelivr.net/gh/fklavyenet/webblocks-ui@master/dist/webblocks-ui.js" defer></script>

<!-- Icon classes for <i> tags (optional) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fklavyenet/webblocks-ui@master/dist/webblocks-icons.css">
```

Add to `<html>` element to activate theme:

```html
<html data-mode="light" data-accent="ocean">
```

---

## Naming Conventions

- All classes use `wb-` prefix: `wb-btn`, `wb-card`, `wb-modal`
- BEM structure: `wb-block`, `wb-block-element`, `wb-block--modifier`
- State classes: `is-open`, `is-active`, `is-selected`, `is-leaving`
- Data attributes: `data-wb-toggle`, `data-wb-target`, `data-wb-dismiss`

---

## Theme System

Set on `<html>` element via `data-*` attributes.

| Attribute      | Values                                                              |
|----------------|---------------------------------------------------------------------|
| `data-mode`    | `light` \| `dark` \| `auto`                                        |
| `data-accent`  | `ocean` \| `forest` \| `sunset` \| `royal` \| `mint` \| `amber` \| `rose` \| `slate-fire` |
| `data-preset`  | `modern` \| `minimal` \| `rounded` \| `bold` \| `editorial`        |
| `data-radius`  | `sharp` \| `soft`                                                   |
| `data-density` | `compact` \| `comfortable`                                          |
| `data-shadow`  | `flat` \| `soft`                                                    |
| `data-font`    | `system` \| `modern` \| `editorial`                                 |
| `data-border`  | `none` \| `subtle` \| `medium` \| `bold` \| `dashed`               |

---

## Design Tokens

Never hardcode colors or sizes — always use tokens.

| Group       | Tokens                                                                 |
|-------------|------------------------------------------------------------------------|
| Surfaces    | `--wb-bg`, `--wb-surface`, `--wb-surface-2`, `--wb-surface-3`         |
| Text        | `--wb-text`, `--wb-muted`                                              |
| Border      | `--wb-border`                                                          |
| Accent      | `--wb-accent`, `--wb-accent-hover`, `--wb-accent-soft`, `--wb-accent-softer`, `--wb-accent-border`, `--wb-accent-text`, `--wb-accent-on` |
| Semantic    | `--wb-success`, `--wb-warning`, `--wb-danger`, `--wb-info` (each has `-dark` and `-soft`) |
| Spacing     | `--wb-s1` (4px) → `--wb-s20` (80px)                                   |
| Radius      | `--wb-r-sm`, `--wb-r-md`, `--wb-r-lg`, `--wb-r-xl`, `--wb-r-full`    |
| Shadows     | `--wb-shadow-sm`, `--wb-shadow-md`, `--wb-shadow-lg`, `--wb-shadow-xl`|
| Typography  | `--wb-font`, `--wb-font-mono`, `--wb-font-size-xs/sm/md/lg/xl`        |
| Z-index     | `--wb-z-dropdown` (100), `--wb-z-modal` (200), `--wb-z-toast` (300)   |
| Layout      | `--wb-sidebar-w` (260px), `--wb-navbar-h` (56px)                      |

---

## Components

### Buttons
```html
<button class="wb-btn wb-btn-primary">Primary</button>
<button class="wb-btn wb-btn-secondary">Secondary</button>
<button class="wb-btn wb-btn-danger">Danger</button>
<button class="wb-btn wb-btn-ghost">Ghost</button>
<button class="wb-btn wb-btn-primary wb-btn-sm">Small</button>
<button class="wb-btn wb-btn-primary wb-btn-lg">Large</button>
```

### Badge
```html
<span class="wb-badge">Default</span>
<span class="wb-badge wb-badge-success">Success</span>
<span class="wb-badge wb-badge-danger">Danger</span>
<span class="wb-badge wb-badge-warning">Warning</span>
```

### Card
```html
<div class="wb-card">
  <div class="wb-card-header">Title</div>
  <div class="wb-card-body">Content</div>
  <div class="wb-card-footer">Footer</div>
</div>
```

### Alert
```html
<div class="wb-alert wb-alert-success">Success message</div>
<div class="wb-alert wb-alert-danger">Error message</div>
<div class="wb-alert wb-alert-warning">Warning message</div>
<div class="wb-alert wb-alert-info">Info message</div>
```

### Table
```html
<table class="wb-table">
  <thead><tr><th>Name</th><th>Status</th></tr></thead>
  <tbody><tr><td>Item</td><td><span class="wb-badge wb-badge-success">Active</span></td></tr></tbody>
</table>
<!-- Modifiers: wb-table-striped, wb-table-compact, wb-table-hover -->
```

### Form
```html
<div class="wb-field">
  <label class="wb-label">Email</label>
  <input type="email" class="wb-input" placeholder="you@example.com">
  <span class="wb-field-error">Required</span>
</div>
<select class="wb-select">...</select>
<textarea class="wb-textarea">...</textarea>
<label class="wb-switch"><input type="checkbox"><span></span></label>
<!-- Input group -->
<div class="wb-input-group">
  <span class="wb-input-addon">@</span>
  <input type="text" class="wb-input">
</div>
```

### Modal
```html
<!-- Trigger -->
<button class="wb-btn wb-btn-primary" data-wb-toggle="modal" data-wb-target="#my-modal">Open</button>

<!-- Modal -->
<div class="wb-modal" id="my-modal">
  <div class="wb-modal-dialog">
    <div class="wb-modal-header">
      <h5 class="wb-modal-title">Title</h5>
      <button class="wb-btn-close" data-wb-dismiss="modal"></button>
    </div>
    <div class="wb-modal-body">Content</div>
    <div class="wb-modal-footer">
      <button class="wb-btn wb-btn-secondary" data-wb-dismiss="modal">Cancel</button>
      <button class="wb-btn wb-btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Dropdown
```html
<div class="wb-dropdown">
  <button class="wb-btn wb-btn-secondary" data-wb-toggle="dropdown">Actions</button>
  <div class="wb-dropdown-menu">
    <a href="#" class="wb-dropdown-item">Edit</a>
    <a href="#" class="wb-dropdown-item wb-dropdown-item-danger">Delete</a>
  </div>
</div>
```

### Tabs
```html
<div class="wb-tabs" id="my-tabs">
  <div class="wb-tab-list">
    <button class="wb-tab-item is-active" data-wb-tab="tab1">Overview</button>
    <button class="wb-tab-item" data-wb-tab="tab2">Settings</button>
  </div>
  <div class="wb-tab-panels">
    <div class="wb-tab-panel is-active" id="tab1">Overview content</div>
    <div class="wb-tab-panel" id="tab2">Settings content</div>
  </div>
</div>
```

### Accordion
```html
<div class="wb-accordion">
  <div class="wb-accordion-item is-open">
    <button class="wb-accordion-trigger">Question</button>
    <div class="wb-accordion-body">Answer</div>
  </div>
</div>
```

### Toast (programmatic)
```js
WBToast.show('Saved successfully', { type: 'success', duration: 3000 });
WBToast.show('Something went wrong', { type: 'danger' });
// types: success | danger | warning | info
```

### Drawer
```html
<!-- Trigger -->
<button data-wb-toggle="drawer" data-wb-target="#my-drawer">Open</button>

<!-- Drawer -->
<div class="wb-drawer wb-drawer-right" id="my-drawer">
  <div class="wb-drawer-header">
    <h5>Title</h5>
    <button class="wb-btn-close" data-wb-dismiss="drawer"></button>
  </div>
  <div class="wb-drawer-body">Content</div>
</div>
<!-- Placements: wb-drawer-right, wb-drawer-left, wb-drawer-top, wb-drawer-bottom -->
<!-- Sizes: wb-drawer-sm, wb-drawer-lg, wb-drawer-xl -->
```

### Popover
```html
<div class="wb-popover-wrap">
  <button class="wb-btn wb-btn-secondary" data-wb-toggle="popover">Info</button>
  <div class="wb-popover wb-popover-bottom">
    <div class="wb-popover-body">Popover content</div>
  </div>
</div>
<!-- Placements: wb-popover-top, wb-popover-right, wb-popover-bottom, wb-popover-left -->
```

### Tooltip
```html
<button class="wb-btn" data-wb-tooltip="Tooltip text">Hover me</button>
<button class="wb-btn" data-wb-tooltip="Top" data-wb-tooltip-placement="top">Top</button>
<!-- Placements: top, right, bottom (default), left -->
```

### Pagination
```html
<nav class="wb-pagination">
  <a href="#" class="wb-page-item">&laquo;</a>
  <a href="#" class="wb-page-item is-active">1</a>
  <a href="#" class="wb-page-item">2</a>
  <a href="#" class="wb-page-item">&raquo;</a>
</nav>
```

### Breadcrumb
```html
<nav class="wb-breadcrumb">
  <a href="#" class="wb-breadcrumb-item">Home</a>
  <span class="wb-breadcrumb-item is-active">Current</span>
</nav>
```

### Avatar
```html
<div class="wb-avatar">AB</div>
<img src="photo.jpg" class="wb-avatar">
<!-- Sizes: wb-avatar-sm, wb-avatar-lg, wb-avatar-xl -->
```

### Skeleton
```html
<div class="wb-skeleton" style="height:1rem;width:60%"></div>
<div class="wb-skeleton wb-skeleton-circle" style="width:40px;height:40px"></div>
```

### Empty State
```html
<div class="wb-empty">
  <div class="wb-empty-icon"><!-- icon --></div>
  <h4 class="wb-empty-title">No results</h4>
  <p class="wb-empty-text">Try adjusting your search.</p>
</div>
```

### Collapse
```html
<button class="wb-collapse-trigger" data-wb-toggle="collapse" data-wb-target="#panel1">Toggle</button>
<div class="wb-collapse" id="panel1">
  <div class="wb-collapse-panel">Content</div>
</div>
```

### Radio Card
```html
<div class="wb-radio-group">
  <label class="wb-radio-card">
    <input type="radio" name="plan" value="free">
    <span class="wb-radio-card-body">Free</span>
  </label>
  <label class="wb-radio-card">
    <input type="radio" name="plan" value="pro">
    <span class="wb-radio-card-body">Pro</span>
  </label>
</div>
```

### List Group
```html
<ul class="wb-list">
  <li class="wb-list-item">Item one</li>
  <li class="wb-list-item is-active">Item two</li>
</ul>
<!-- Modifiers: wb-list-flush, wb-list-compact, wb-list-numbered -->
```

### Divider
```html
<hr class="wb-divider">
<hr class="wb-divider wb-divider-labeled" data-label="OR">
<span class="wb-divider-vertical"></span>
```

### Progress Bar
```html
<div class="wb-progress-bar"><div style="width:60%"></div></div>
```

### Spinner
```html
<span class="wb-spinner"></span>
<span class="wb-spinner wb-spinner-sm"></span>
```

---

## Layouts

### Navbar
```html
<header class="wb-navbar">
  <a href="#" class="wb-navbar-brand">Logo</a>
  <div class="wb-navbar-spacer"></div>
  <nav class="wb-navbar-links">
    <a href="#" class="wb-navbar-link is-active">Dashboard</a>
    <a href="#" class="wb-navbar-link">Settings</a>
  </nav>
  <div class="wb-navbar-end">
    <button class="wb-btn wb-btn-primary wb-btn-sm">Action</button>
  </div>
</header>
<!-- Modifiers: wb-navbar-glass, wb-navbar-filled, wb-navbar--static -->
<!-- Default is sticky. Add wb-navbar--static to disable sticky. -->
```

### Stacked Navbar (two-row)
```html
<header class="wb-navbar wb-navbar-stacked">
  <div class="wb-navbar-row">
    <a href="#" class="wb-navbar-brand">Logo</a>
    <div class="wb-navbar-spacer"></div>
    <div class="wb-navbar-end">...</div>
  </div>
  <div class="wb-navbar-row wb-navbar-sub">
    <a href="#" class="wb-navbar-link is-active">Overview</a>
    <a href="#" class="wb-navbar-link">Settings</a>
  </div>
</header>
```

### Sidebar
```html
<aside class="wb-sidebar">
  <div class="wb-sidebar-header">
    <a href="#" class="wb-navbar-brand">Logo</a>
  </div>
  <nav class="wb-sidebar-nav">
    <a href="#" class="wb-sidebar-link is-active">Dashboard</a>
    <a href="#" class="wb-sidebar-link">Settings</a>
  </nav>
  <div class="wb-sidebar-footer">
    <!-- user info, version, etc. -->
  </div>
</aside>
```

### Dashboard Shell
```html
<div class="wb-dashboard-shell">
  <aside class="wb-sidebar">...</aside>
  <div class="wb-dashboard-body">
    <header class="wb-navbar">...</header>
    <main class="wb-dashboard-main">
      <div class="wb-container">...</div>
    </main>
  </div>
</div>
```

### Auth Shell
```html
<div class="wb-auth">
  <div class="wb-auth-card">
    <h1>Sign in</h1>
    <!-- form -->
  </div>
</div>
```

---

## Grid

```html
<div class="wb-row">
  <div class="wb-col-md-6">Half</div>
  <div class="wb-col-md-6">Half</div>
</div>
<div class="wb-row">
  <div class="wb-col-md-4">Third</div>
  <div class="wb-col-md-4">Third</div>
  <div class="wb-col-md-4">Third</div>
</div>
<!-- Breakpoints: sm, md, lg, xl — columns: 1–12 -->
<!-- Shorthand grids: wb-grid-2, wb-grid-3, wb-grid-4 -->
```

---

## Icons

```html
<!-- SVG sprite (semantic) -->
<svg class="wb-icon"><use href="dist/webblocks-icons.svg#wb-icon-home"></use></svg>

<!-- <i> tag (requires webblocks-icons.css) -->
<i class="wb-icon-home"></i>
<i class="wb-icon-settings wb-icon-lg"></i>
<!-- Sizes: wb-icon-sm, wb-icon-lg, wb-icon-xl -->
```

154 icons available. Full list: `dist/webblocks-icons.svg`.

---

## Utility Classes

### Typography
| Class | Value |
|---|---|
| `wb-text-xs` | 0.75rem |
| `wb-text-sm` | 0.85rem |
| `wb-text-base` | 1rem |
| `wb-text-lg` | 1.125rem |
| `wb-text-xl` | 1.25rem |
| `wb-font-normal` | 400 |
| `wb-font-medium` | 500 |
| `wb-font-semibold` | 600 |
| `wb-font-bold` | 700 |
| `wb-text-left/center/right` | text-align |
| `wb-uppercase/lowercase/capitalize` | text-transform |
| `wb-tracking-tight/normal/wide/wider/widest` | letter-spacing |
| `wb-leading-tight/normal/loose` | line-height |
| `wb-truncate` | ellipsis overflow |
| `wb-nowrap` | white-space: nowrap |
| `wb-mono` | monospace font |

### Colors
| Class | Token |
|---|---|
| `wb-text-primary` | `--wb-accent` |
| `wb-text-muted` | `--wb-muted` |
| `wb-text-success/warning/danger` | semantic colors |
| `wb-text-default` | `--wb-text` |
| `wb-bg-surface` | `--wb-surface` |
| `wb-bg-surface-2` | `--wb-surface-2` |

### Spacing (margin)
`wb-mt-{1-8}`, `wb-mb-{1-8}`, `wb-m-0`, `wb-mx-auto`, `wb-ms-auto`, `wb-me-auto`

### Spacing (padding)
`wb-p-{2,3,4,6}`, `wb-px-{4,6}`, `wb-py-{2,4,6}`, `wb-p-0`

### Flex
`wb-flex`, `wb-flex-col`, `wb-flex-row`, `wb-flex-wrap`, `wb-flex-1`, `wb-flex-shrink-0`
`wb-items-start/center/end`, `wb-justify-start/center/end/between`
`wb-gap-{1,2,3,4,6,8}`

### Display
`wb-hidden`, `wb-block`, `wb-inline`, `wb-inline-block`, `wb-inline-flex`

### Border
`wb-border`, `wb-border-top`, `wb-border-bottom`, `wb-border-0`
`wb-rounded`, `wb-rounded-sm`, `wb-rounded-lg`, `wb-rounded-xl`, `wb-rounded-full`

### Shadow
`wb-shadow-sm`, `wb-shadow`, `wb-shadow-lg`, `wb-shadow-0`

### Position
`wb-relative`, `wb-absolute`, `wb-fixed`, `wb-sticky`, `wb-inset-0`

### Other
`wb-w-full`, `wb-w-auto`, `wb-h-full`, `wb-overflow-hidden`, `wb-overflow-auto`
`wb-opacity-50`, `wb-opacity-75`, `wb-cursor-pointer`, `wb-sr-only`

---

## JS API

All modules are available on `window.*` after the script loads.

```js
// Modal
WBModal.open('my-modal');
WBModal.close('my-modal');

// Drawer
WBDrawer.open('my-drawer');
WBDrawer.close('my-drawer');

// Toast
WBToast.show('Message', { type: 'success', duration: 3000 });
// types: success | danger | warning | info

// Dropdown
WBDropdown.open(buttonEl);
WBDropdown.close(buttonEl);

// Tabs
WBTabs.activate(tabButtonEl);

// Accordion
WBAccordion.open(itemEl);
WBAccordion.close(itemEl);

// Sidebar (mobile)
WBSidebar.open();
WBSidebar.close();

// Collapse
WBCollapse.open('panel-id');
WBCollapse.close('panel-id');
WBCollapse.toggle('panel-id');

// Popover
WBPopover.open(wrapperEl);
WBPopover.close(wrapperEl);
WBPopover.closeAll();

// Tooltip
WBTooltip.show(el);
WBTooltip.hide(el);

// Theme
WBTheme.setMode('dark');       // light | dark | auto
WBTheme.setAccent('ocean');    // ocean | forest | sunset | royal | mint | amber | rose | slate-fire
WBTheme.setPreset('modern');   // modern | minimal | rounded | bold | editorial
WBTheme.setDensity('compact'); // compact | comfortable
WBTheme.setRadius('soft');     // sharp | soft

// Command Palette
WBCommandPalette.open('cmd-id');
WBCommandPalette.close('cmd-id');

// Dismiss (alerts/banners)
WBDismiss.dismiss(el);

// Nav Group
WBNavGroup.open(groupEl);
WBNavGroup.close(groupEl);
```

### Data Attribute Triggers (no JS required)

```html
<!-- Open modal -->
<button data-wb-toggle="modal" data-wb-target="#my-modal">Open</button>

<!-- Close modal from inside -->
<button data-wb-dismiss="modal">Close</button>

<!-- Open drawer -->
<button data-wb-toggle="drawer" data-wb-target="#my-drawer">Open</button>

<!-- Open dropdown -->
<button data-wb-toggle="dropdown">Menu</button>

<!-- Toggle collapse -->
<button data-wb-toggle="collapse" data-wb-target="#panel">Toggle</button>

<!-- AJAX checkbox toggle (with CSRF) -->
<input type="checkbox" data-wb-ajax-toggle data-url="/api/toggle" data-csrf="token">
```

---

## Common Gotchas

1. **`data-mode` not `data-theme`** — dark mode attribute is `data-mode="dark"`, not `data-theme`
2. **Navbar is sticky by default** — add `wb-navbar--static` to disable
3. **`wb-sidebar-footer`** — already has padding + border-top, no need to add manually
4. **`wb-stat` is inside `wb-card`** — stats card uses `wb-card` wrapper with `wb-stat` inside
5. **`wb-confirm`** — confirmation dialog is a modal variant, use `wb-confirm` class on `wb-modal-dialog`
6. **Toast positions** — default is top-right; add `wb-toast-top-center`, `wb-toast-bottom-right` etc. to `wb-toast-container`
7. **`--wb-primary` is an alias** — maps to `--wb-accent`; use `--wb-accent` in new code
8. **Grid is opt-in** — `wb-row`/`wb-col-*` classes are available, no additional file needed
