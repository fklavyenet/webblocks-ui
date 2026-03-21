# WebBlocks UI - Integration Reference

Concise integration notes for developers and AI agents using WebBlocks UI in a project.

---

## Installation

### Local build files

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

Set theme state on the root element:

```html
<html data-mode="light" data-accent="forest">
```

---

## Core Rules

- every class uses the `wb-` prefix
- prefer semantic HTML plus explicit classes
- use tokens, not hardcoded colors or sizes
- JS behavior is opt-in through `data-wb-*` attributes or `window.*` APIs
- build order matters: foundation -> base -> components -> layouts -> utilities

---

## Theme System

Theme axes are set on `<html>` via `data-*` attributes.

| Attribute | Values |
|---|---|
| `data-mode` | `light` \\| `dark` \\| `auto` |
| `data-accent` | `ocean` \\| `forest` \\| `sunset` \\| `royal` \\| `mint` \\| `amber` \\| `rose` \\| `slate-fire` |
| `data-preset` | `modern` \\| `minimal` \\| `editorial` \\| `playful` \\| `corporate` |
| `data-radius` | `sharp` \\| `soft` |
| `data-density` | `compact` \\| `comfortable` |
| `data-shadow` | `flat` \\| `soft` |
| `data-font` | `system` \\| `modern` \\| `editorial` |
| `data-border` | `none` \\| `subtle` \\| `medium` \\| `bold` \\| `dashed` |

Example:

```html
<html
  data-mode="dark"
  data-accent="forest"
  data-density="compact"
  data-radius="soft">
```

---

## Design Tokens

Never hardcode colors or sizes in component CSS.

| Group | Examples |
|---|---|
| surfaces | `--wb-bg`, `--wb-surface`, `--wb-surface-2`, `--wb-surface-3` |
| text | `--wb-text`, `--wb-muted` |
| border | `--wb-border` |
| accent | `--wb-accent`, `--wb-accent-hover`, `--wb-accent-soft`, `--wb-accent-softer`, `--wb-accent-border`, `--wb-accent-text`, `--wb-accent-on` |
| semantic | `--wb-success`, `--wb-warning`, `--wb-danger`, `--wb-info` |
| spacing | `--wb-s1` to `--wb-s20` |
| radius | `--wb-r-sm`, `--wb-r-md`, `--wb-r-lg`, `--wb-r-xl`, `--wb-r-full` |
| shadows | `--wb-shadow-sm`, `--wb-shadow-md`, `--wb-shadow-lg`, `--wb-shadow-xl` |
| typography | `--wb-font`, `--wb-font-heading`, `--wb-font-mono`, `--wb-font-size-*` |

---

## Common Components

### Button

```html
<button class="wb-btn wb-btn-primary">Save</button>
<button class="wb-btn wb-btn-outline">Cancel</button>
<button class="wb-btn wb-btn-danger">Delete</button>
<button class="wb-btn wb-btn-primary wb-btn-sm">Small</button>
<button class="wb-btn wb-btn-primary wb-btn-lg">Large</button>
```

### Badge

```html
<span class="wb-badge">Default</span>
<span class="wb-badge wb-badge-success wb-badge-dot">Active</span>
<span class="wb-badge wb-badge-warning">Pending</span>
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
<div class="wb-alert wb-alert-info">Info message</div>
<div class="wb-alert wb-alert-success">Success message</div>
<div class="wb-alert wb-alert-warning">Warning message</div>
<div class="wb-alert wb-alert-danger">Error message</div>
```

### Callout

```html
<div class="wb-callout wb-callout-accent">
  <strong class="wb-callout-title">Note</strong>
  Use callouts for documentation notes and editorial guidance.
</div>
```

### Form

```html
<div class="wb-field">
  <label class="wb-label">Email</label>
  <input class="wb-input" type="email" placeholder="you@example.com">
  <span class="wb-field-error">Required</span>
</div>

<div class="wb-input-group">
  <span class="wb-input-addon">https://</span>
  <input class="wb-input" type="text" value="example.com">
</div>
```

### Table

```html
<table class="wb-table wb-table-hover wb-table-sm">
  <thead><tr><th>Name</th><th>Status</th></tr></thead>
  <tbody><tr><td>Atlas</td><td><span class="wb-badge wb-badge-success">Active</span></td></tr></tbody>
</table>
```

Modifiers: `wb-table-hover`, `wb-table-striped`, `wb-table-sm`

### Modal

```html
<button data-wb-toggle="modal" data-wb-target="#my-modal">Open</button>

<div class="wb-modal" id="my-modal" role="dialog" aria-modal="true">
  <div class="wb-modal-dialog">
    <div class="wb-modal-header">
      <h2 class="wb-modal-title">Title</h2>
      <button class="wb-modal-close" data-wb-dismiss="modal" aria-label="Close">&times;</button>
    </div>
    <div class="wb-modal-body">Content</div>
    <div class="wb-modal-footer">
      <button class="wb-btn wb-btn-outline" data-wb-dismiss="modal">Cancel</button>
      <button class="wb-btn wb-btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

Sizes: `wb-modal-sm`, `wb-modal-lg`, `wb-modal-xl`

### Confirmation Dialog

```html
<div class="wb-modal wb-confirm" id="confirm-delete" role="alertdialog" aria-modal="true">
  <div class="wb-modal-dialog wb-modal-sm">
    <div class="wb-modal-body">
      <div class="wb-confirm-icon wb-confirm-icon-danger">!</div>
      <div class="wb-confirm-title">Delete item?</div>
      <p class="wb-confirm-message">This action cannot be undone.</p>
    </div>
    <div class="wb-modal-footer">
      <button class="wb-btn wb-btn-outline" data-wb-dismiss="modal">Cancel</button>
      <button class="wb-btn wb-btn-danger">Delete</button>
    </div>
  </div>
</div>
```

### Dropdown

```html
<div class="wb-dropdown">
  <button class="wb-btn wb-btn-outline" data-wb-toggle="dropdown">Actions</button>
  <div class="wb-dropdown-menu">
    <a href="#" class="wb-dropdown-item">Edit</a>
    <a href="#" class="wb-dropdown-item wb-dropdown-item-danger">Delete</a>
  </div>
</div>
```

### Tabs

```html
<div class="wb-tabs">
  <div class="wb-tabs-nav" role="tablist">
    <button class="wb-tabs-btn is-active" data-wb-tab="panel-overview">Overview</button>
    <button class="wb-tabs-btn" data-wb-tab="panel-settings">Settings</button>
  </div>
  <div class="wb-tabs-panel is-active" id="panel-overview">Overview content</div>
  <div class="wb-tabs-panel" id="panel-settings">Settings content</div>
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

### Collapse

```html
<button class="wb-collapse-trigger" data-wb-toggle="collapse" data-wb-target="#panel-a">Toggle</button>
<div class="wb-collapse" id="panel-a">
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
```

### Link List

```html
<div class="wb-link-list">
  <a href="#" class="wb-link-list-item">
    <div class="wb-link-list-main">
      <span class="wb-link-list-title">Components</span>
      <span class="wb-link-list-meta">Buttons, forms, tables</span>
    </div>
    <div class="wb-link-list-desc">Use this pattern for docs indexes and example maps.</div>
  </a>
</div>
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
<nav class="wb-breadcrumb" aria-label="Breadcrumb">
  <a href="#" class="wb-breadcrumb-item">Home</a>
  <span class="wb-breadcrumb-item is-current">Current</span>
</nav>
```

### Avatar

```html
<div class="wb-avatar">AB</div>
<img src="photo.jpg" class="wb-avatar" alt="Profile photo">
```

### Skeleton

```html
<div class="wb-skeleton" style="height:1rem;width:60%"></div>
<div class="wb-skeleton wb-skeleton-circle" style="width:40px;height:40px"></div>
```

### Empty State

```html
<div class="wb-empty">
  <div class="wb-empty-icon"></div>
  <h3 class="wb-empty-title">No results</h3>
  <p class="wb-empty-text">Try adjusting your search.</p>
</div>
```

### Loading

```html
<div class="wb-progress-bar"><div style="width:60%"></div></div>
<span class="wb-spinner"></span>
<span class="wb-spinner wb-spinner-sm"></span>
```

---

## Layouts

### Container and Section

```html
<section class="wb-section">
  <div class="wb-container">...</div>
</section>
```

### Navbar

```html
<header class="wb-navbar">
  <a href="#" class="wb-navbar-brand">Logo</a>
  <div class="wb-navbar-spacer"></div>
  <div class="wb-navbar-end">
    <a href="#" class="wb-navbar-link is-active">Dashboard</a>
    <a href="#" class="wb-navbar-link">Settings</a>
  </div>
</header>
```

Modifiers: `wb-navbar-glass`, `wb-navbar-filled`, `wb-navbar--static`, `wb-navbar-stacked`

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
  </div>
</div>
```

### Settings Shell

```html
<div class="wb-settings-shell">
  <aside class="wb-settings-nav">...</aside>
  <div class="wb-settings-body">
    <div class="wb-settings-section">...</div>
  </div>
</div>
```

### Content Shell

```html
<div class="wb-content-shell wb-content-shell-narrow">
  <header class="wb-content-header">
    <h1 class="wb-content-title">Title</h1>
  </header>
  <div class="wb-content-body">...</div>
</div>
```

### Page Intro

```html
<section class="wb-page-intro">
  <div class="wb-container wb-page-intro-grid">
    <div class="wb-page-intro-copy">
      <div class="wb-page-eyebrow">Overview</div>
      <h1 class="wb-page-title">Visible structure, quiet defaults.</h1>
      <p class="wb-page-lead">Use this for docs, product pages, changelog intros, and editorial surfaces.</p>
    </div>
    <aside class="wb-page-intro-aside">...</aside>
  </div>
</section>
```

---

## Grid

```html
<div class="wb-row">
  <div class="wb-col-md-6">Half</div>
  <div class="wb-col-md-6">Half</div>
</div>

<div class="wb-grid-3">
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
</div>
```

---

## Icons

```html
<!-- SVG sprite -->
<svg class="wb-icon" aria-hidden="true">
  <use href="dist/webblocks-icons.svg#wb-icon-home"></use>
</svg>

<!-- <i> tag classes -->
<i class="wb-icon wb-icon-home" aria-hidden="true"></i>
<i class="wb-icon wb-icon-settings wb-icon-lg" aria-hidden="true"></i>
```

Standard:
- Sprite symbols use `#wb-icon-*`
- CSS classes use `wb-icon-*`
- Add new icons by editing `packages/webblocks/scripts/update-icons.js`, then run `node scripts/update-icons.js` and `./build.sh`

Current icon count: 173

---

## Utility Classes

### Typography

`wb-text-xs`, `wb-text-sm`, `wb-text-base`, `wb-text-lg`, `wb-text-xl`, `wb-text-2xl`, `wb-text-3xl`, `wb-text-4xl`

`wb-font-normal`, `wb-font-medium`, `wb-font-semibold`, `wb-font-bold`, `wb-mono`

`wb-text-left`, `wb-text-center`, `wb-text-right`, `wb-uppercase`, `wb-lowercase`, `wb-capitalize`, `wb-nowrap`, `wb-truncate`

### Color

`wb-text-primary`, `wb-text-success`, `wb-text-warning`, `wb-text-danger`, `wb-text-muted`, `wb-text-default`

`wb-bg-surface`, `wb-bg-surface-2`, `wb-bg-primary`, `wb-bg-success`, `wb-bg-danger`, `wb-bg-warning`

### Spacing

Margin: `wb-m-0`, `wb-mt-{0,1,2,3,4,5,6,8}`, `wb-mb-{0,1,2,3,4,5,6,8}`, `wb-mx-auto`, `wb-ms-auto`, `wb-me-auto`

Padding: `wb-p-{0,2,3,4,6}`, `wb-px-{4,6}`, `wb-py-{2,4,6}`

### Flex and Display

`wb-flex`, `wb-inline-flex`, `wb-flex-col`, `wb-flex-row`, `wb-flex-wrap`, `wb-flex-nowrap`, `wb-flex-1`, `wb-flex-shrink-0`

`wb-items-start`, `wb-items-center`, `wb-items-end`, `wb-justify-start`, `wb-justify-center`, `wb-justify-end`, `wb-justify-between`

`wb-gap-{1,2,3,4,6,8}`

`wb-hidden`, `wb-block`, `wb-inline`, `wb-inline-block`

### Border and Radius

`wb-border`, `wb-border-top`, `wb-border-bottom`, `wb-border-0`

`wb-rounded`, `wb-rounded-sm`, `wb-rounded-lg`, `wb-rounded-xl`, `wb-rounded-full`

### Shadow and Position

`wb-shadow-sm`, `wb-shadow`, `wb-shadow-lg`, `wb-shadow-0`

`wb-relative`, `wb-absolute`, `wb-fixed`, `wb-sticky`, `wb-inset-0`

### Other

`wb-w-full`, `wb-w-auto`, `wb-h-full`, `wb-min-w-0`

`wb-overflow-hidden`, `wb-overflow-auto`, `wb-overflow-scroll`, `wb-overflow-x-auto`, `wb-overflow-y-auto`

`wb-opacity-50`, `wb-opacity-75`, `wb-opacity-100`, `wb-cursor-pointer`, `wb-sr-only`

---

## JS API

All modules are available on `window.*` after the script loads.

```js
WBModal.open('my-modal')
WBModal.close('my-modal')

WBDrawer.open('my-drawer')
WBDrawer.close('my-drawer')

WBToast.show('Saved', { type: 'success', duration: 3000 })
WBDropdown.open(buttonEl)
WBDropdown.close(buttonEl)

WBTabs.activate(tabButtonEl)
WBAccordion.open(itemEl)
WBAccordion.close(itemEl)

WBSidebar.open()
WBSidebar.close()

WBCollapse.open('panel-id')
WBCollapse.close('panel-id')
WBCollapse.toggle('panel-id')

WBPopover.open(wrapperEl)
WBPopover.close(wrapperEl)
WBPopover.closeAll()

WBTooltip.show(el)
WBTooltip.hide(el)

WBTheme.setMode('dark')
WBTheme.setAccent('ocean')
WBTheme.setPreset('modern')
WBTheme.setDensity('compact')
WBTheme.setRadius('soft')

WBCommandPalette.open('cmd-id')
WBCommandPalette.close('cmd-id')

WBDismiss.dismiss(el)
WBNavGroup.open(groupEl)
WBNavGroup.close(groupEl)
```

### Data Attribute Triggers

```html
<button data-wb-toggle="modal" data-wb-target="#my-modal">Open modal</button>
<button data-wb-dismiss="modal">Close modal</button>

<button data-wb-toggle="drawer" data-wb-target="#my-drawer">Open drawer</button>
<button data-wb-toggle="dropdown">Menu</button>

<button data-wb-toggle="collapse" data-wb-target="#panel">Toggle collapse</button>

<button data-wb-mode-set="dark">Dark</button>
<button data-wb-accent-set="forest">Forest</button>

<input type="checkbox" data-wb-ajax-toggle data-url="/api/toggle" data-csrf="token">
```

---

## Common Gotchas

1. Use `data-mode`, not `data-theme`
2. `wb-navbar` is sticky by default; add `wb-navbar--static` to disable
3. `wb-confirm` is a modal variant on the `.wb-modal` wrapper
4. `wb-stat` lives inside `card.css`, not a separate `stat.css`
5. `wb-field-error` lives inside `form.css`
6. `webblocks-icons.css` is optional, but required for `<i class="wb-icon wb-icon-..."></i>` usage
7. default toast position is top-right; optional modifiers include `wb-toast-top-center`, `wb-toast-top-left`, `wb-toast-bottom-center`, `wb-toast-bottom-left`
8. `--wb-primary*` tokens are backward-compat aliases; prefer `--wb-accent*` in new code
