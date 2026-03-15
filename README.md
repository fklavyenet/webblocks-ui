# WebBlocks UI

A framework-agnostic UI kit built with plain HTML, separate CSS files, and vanilla JavaScript.

**No build step. No npm. No dependencies.**

Works with Laravel Blade, Craft Twig, Django templates, or plain HTML files.

---

## Quick start

```html
<link rel="stylesheet" href="dist/webblocks-ui.css">
<script src="dist/webblocks-ui.js"></script>
```

Add the dist files to your project and start using components.

---

## Theme engine

Set on the `<html>` element:

```html
<!-- Theme mode: light | dark | auto -->
<html data-theme="auto"

      <!-- Accent scheme: ocean | forest | royal | warm | slate | rose | sand -->
      data-accent="ocean">
```

`auto` respects the OS `prefers-color-scheme` setting.

### Switch via buttons

```html
<button data-wb-theme-set="dark">Dark</button>
<button data-wb-theme-set="light">Light</button>
<button data-wb-theme-set="auto">Auto</button>

<button data-wb-accent-set="forest">Forest</button>
```

Preferences are saved to `localStorage` automatically.

---

## Components

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

<!-- Stat / KPI card -->
<div class="wb-card wb-card-stat">
  <div class="wb-card-stat-label">Total Users</div>
  <div class="wb-card-stat-value">1,284</div>
  <div class="wb-card-stat-change wb-card-stat-up">+12%</div>
</div>
```

### Alert

```html
<div class="wb-alert wb-alert-info">Informational message.</div>
<div class="wb-alert wb-alert-success">Success!</div>
<div class="wb-alert wb-alert-warning">Warning message.</div>
<div class="wb-alert wb-alert-danger wb-alert-dismissible">
  Error message.
  <button class="wb-alert-close">&times;</button>
</div>
```

### Form

```html
<div class="wb-field">
  <label class="wb-label">Email</label>
  <input class="wb-input" type="email" placeholder="you@example.com">
</div>

<select class="wb-select"> ... </select>
<textarea class="wb-textarea"></textarea>

<label class="wb-checkbox"><input type="checkbox"> Remember me</label>
<label class="wb-radio"><input type="radio"> Option</label>
<label class="wb-switch">
  <input type="checkbox">
  <span class="wb-switch-track"></span>
  Enabled
</label>
```

### Table

```html
<table class="wb-table wb-table-hover">
  <thead><tr><th>Name</th><th>Status</th></tr></thead>
  <tbody><tr><td>Alice</td><td>Active</td></tr></tbody>
</table>
```

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

Sizes: `wb-modal-sm`, `wb-modal-lg`, `wb-modal-xl`, `wb-modal-full`

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
  <div class="wb-tabs-panels">
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

### Avatar

```html
<div class="wb-avatar">JD</div>
<div class="wb-avatar wb-avatar-lg wb-avatar-green">AB</div>

<!-- Group -->
<div class="wb-avatar-group">
  <div class="wb-avatar wb-avatar-sm">A1</div>
  <div class="wb-avatar wb-avatar-sm">A2</div>
  <div class="wb-avatar wb-avatar-sm wb-avatar-count">+3</div>
</div>
```

Sizes: `wb-avatar-xs`, `wb-avatar-sm`, _(default)_, `wb-avatar-lg`, `wb-avatar-xl`
Colors: `wb-avatar-green`, `wb-avatar-red`, `wb-avatar-orange`, `wb-avatar-violet`, `wb-avatar-cyan`

---

## Layouts

### Dashboard shell

```html
<div class="wb-dashboard-shell">
  <aside class="wb-sidebar" id="mySidebar">
    <!-- sidebar content -->
  </aside>
  <div class="wb-dashboard-body">
    <nav class="wb-navbar">
      <button data-wb-toggle="sidebar" data-wb-target="#mySidebar">☰</button>
    </nav>
    <main class="wb-dashboard-main">
      <div class="wb-container">
        <!-- page content -->
      </div>
    </main>
  </div>
</div>
```

### Auth shell (centered)

```html
<div class="wb-auth-shell">
  <div class="wb-auth-card">
    <div class="wb-auth-logo"> ... </div>
    <div class="wb-auth-body"> ... </div>
    <div class="wb-auth-footer"> ... </div>
  </div>
</div>
```

### Auth shell (split)

```html
<div class="wb-auth-shell wb-auth-split">
  <div class="wb-auth-panel"> <!-- brand / illustration --> </div>
  <div class="wb-auth-form-area">
    <div class="wb-auth-card"> ... </div>
  </div>
</div>
```

### Layout primitives

```html
<div class="wb-container">...</div>        <!-- max-width centered -->
<div class="wb-section">...</div>          <!-- vertical padding -->
<div class="wb-stack">...</div>            <!-- vertical flex -->
<div class="wb-cluster">...</div>          <!-- horizontal wrapping flex -->
<div class="wb-split">...</div>            <!-- two-sided: left grows, right stays -->
<div class="wb-grid-3">...</div>           <!-- 3-column grid -->
<div class="wb-grid-auto">...</div>        <!-- auto-fill grid (min 280px) -->
```

---

## JavaScript API

Each module exposes a global object:

```js
WBTheme.set('dark')         // set theme
WBTheme.setAccent('forest') // set accent

WBModal.open(el)            // open a modal element
WBModal.close()             // close active modal

WBDropdown.closeAll()       // close any open dropdown

WBTabs.activateById('tab2') // switch tab by panel id

WBAccordion.open(triggerEl)  // open accordion item
WBAccordion.close(triggerEl) // close accordion item

WBSidebar.open(sidebarEl)   // open sidebar (mobile)
WBSidebar.close(sidebarEl)  // close sidebar
```

---

## Build

Regenerate dist files from src:

```bash
chmod +x build.sh
./build.sh
```

No npm. No node_modules. Pure shell `cat`.

---

## Folder structure

```
webblocks-ui/
├── dist/
│   ├── webblocks-ui.css     ← use this in your projects
│   └── webblocks-ui.js      ← use this in your projects
├── src/
│   ├── css/
│   │   ├── foundation/      tokens.css, dark.css, accents.css
│   │   ├── base/            reset.css, elements.css
│   │   ├── components/      button, badge, card, alert, form, table,
│   │   │                    modal, dropdown, tabs, accordion, pagination,
│   │   │                    breadcrumb, avatar, toast, skeleton, empty
│   │   ├── layouts/         container, navbar, sidebar, dashboard-shell, auth-shell
│   │   └── utilities/       helpers.css
│   └── js/
│       ├── theme.js         theme engine (light/dark/auto + accents)
│       ├── dropdown.js      dropdown toggle
│       ├── modal.js         modal with focus trap
│       ├── tabs.js          tab panels with keyboard nav
│       ├── accordion.js     animated accordion
│       └── sidebar.js       mobile sidebar + backdrop
├── examples/
│   ├── core/index.html      full component reference
│   ├── admin/dashboard.html admin panel demo
│   ├── website/home.html    marketing homepage
│   └── auth/
│       ├── login.html
│       └── register.html
└── build.sh
```

---

## Accent colors

| Key      | Description              |
|----------|--------------------------|
| `ocean`  | Blue-teal (default)      |
| `forest` | Green                    |
| `royal`  | Purple / indigo          |
| `warm`   | Amber / orange           |
| `slate`  | Cool grey                |
| `rose`   | Pink / rose              |
| `sand`   | Warm beige               |

---

## License

MIT
