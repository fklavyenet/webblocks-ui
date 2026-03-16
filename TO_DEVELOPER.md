# TO_DEVELOPER — WebBlocks UI Kit

Everything a developer needs to understand, run, and extend this project.

---

## Goal & Vision

WebBlocks UI Kit is a **framework-agnostic, zero-dependency UI component library** for building admin panels, SaaS dashboards, and CMS control panels.

The guiding principle: **plain HTML stays plain HTML.** No custom elements, no shadow DOM, no npm install, no build pipeline. Drop in two files and go.

---

## Status

| Phase | Status   | Description                             |
|-------|----------|-----------------------------------------|
| V1    | Complete | Core components, foundation, layouts    |
| V2    | Complete | Advanced components, multi-axis theming |

---

## Current Task

No active task. Project is complete.

---

## Important Notes

- **No npm.** No `package.json`, no `node_modules`, no Vite, no webpack.
- **Build is `./build.sh`** — a plain shell `cat` concatenation. Run it after any source change.
- **`wb-` prefix is mandatory** on every class — no exceptions.
- **All colors / sizes come from tokens** — never hardcode `#hex` or `px` values in component CSS.
- **`--wb-primary*` are backward-compat aliases** — use `--wb-accent*` in all new code.

---

## Setup

No installation required.

```bash
# 1. Clone / copy the repo
git clone <repo-url> webblocks-ui

# 2. Build dist files from source
chmod +x build.sh
./build.sh

# 3. Include in any HTML project
#    <link rel="stylesheet" href="dist/webblocks-ui.css">
#    <script src="dist/webblocks-ui.js"></script>
```

Works in any template engine — Laravel Blade, Twig, Django, plain HTML. No wrappers needed:

```html
<button class="wb-btn wb-btn-primary">Save</button>
<input class="wb-input" type="email" name="email">
<div class="wb-alert wb-alert-success">Saved!</div>
```

---

## Key Commands

```bash
./build.sh          # Rebuild dist/webblocks-ui.css and dist/webblocks-ui.js
```

That's the only command. No tests, no linting, no dev server.

---

## Workflow Checklist

After modifying **any source files** (CSS, JS, or icons), follow this sequence:

```bash
# 1. Run build
./build.sh

# 2. Verify dist files were regenerated
git status              # should show dist/ files as modified

# 3. Commit changes
git add dist/
git commit -m "Build: regenerate dist files after [description of change]"

# 4. Push to GitHub
git push origin master
```

**Critical:** Never push source-only changes without running `build.sh` first. Test sites depend on up-to-date `dist/` files.

---

## Architecture

```
webblocks-ui/
├── build.sh                    ← concat script; edit when adding new source files
├── dist/
│   ├── webblocks-ui.css        ← single compiled CSS (DO NOT edit directly)
│   ├── webblocks-ui.js         ← single compiled JS  (DO NOT edit directly)
│   └── webblocks-icons.svg     ← SVG sprite (133 Lucide icons)
├── src/
│   ├── css/
│   │   ├── foundation/         ← tokens, dark mode, theme axes (edit here for design system changes)
│   │   │   ├── tokens.css      ← source of truth for ALL design tokens
│   │   │   ├── dark.css        ← dark mode token overrides
│   │   │   ├── presets.css     ← named preset bundles (data-preset)
│   │   │   ├── accents.css     ← accent color axis (data-accent)
│   │   │   ├── radius.css      ← border radius axis (data-radius)
│   │   │   ├── density.css     ← spacing density axis (data-density)
│   │   │   ├── shadow.css      ← shadow depth axis (data-shadow)
│   │   │   ├── font.css        ← font family axis (data-font)
│   │   │   └── border.css      ← border style axis (data-border)
│   │   ├── base/               ← reset + base element styles
│   │   ├── components/         ← one file per component
│   │   ├── layouts/            ← shell layouts (dashboard, auth, settings, content)
│   │   └── utilities/          ← helper classes
│   └── js/
│       ├── theme.js            ← WBTheme — mode/accent/preset switching + localStorage
│       ├── modal.js            ← WBModal — focus trap, backdrop, data-attribute triggers
│       ├── dropdown.js         ← WBDropdown
│       ├── tabs.js             ← WBTabs — keyboard nav
│       ├── accordion.js        ← WBAccordion — animated max-height transitions
│       ├── sidebar.js          ← WBSidebar — mobile toggle + backdrop
│       ├── nav-group.js        ← WBNavGroup — collapsible sidebar groups
│       ├── drawer.js           ← WBDrawer — focus trap + Escape + is-leaving animation
│       └── command-palette.js  ← WBCommandPalette — Cmd/Ctrl+K, ↑↓↵Esc
├── scripts/
│   └── build-icons.js          ← Node script — regenerates dist/webblocks-icons.svg
├── examples/
│   ├── core/index.html         ← V1 component reference
│   ├── v2/
│   │   ├── index.html          ← V2 component reference
│   │   ├── dashboard.html      ← V2 admin dashboard demo
│   │   └── icons.html          ← Icon gallery (searchable, click-to-copy)
│   ├── admin/
│   │   ├── dashboard.html      ← Admin dashboard example
│   │   └── settings.html       ← Settings page (wb-settings-shell)
│   └── website/
│       ├── home.html           ← Marketing homepage
│       ├── pricing.html        ← Pricing page with billing toggle
│       ├── faq.html            ← FAQ with accordion + search filter
│       └── contact.html        ← Contact form + info sidebar
└── build.sh
```

### Adding a new component

1. Create `src/css/components/my-component.css` — use tokens only, `wb-` prefix on all classes.
2. If JS is needed, create `src/js/my-component.js` — IIFE pattern, expose `window.WBMyComponent`.
3. Add both files to `build.sh` in the correct order (components section for CSS, bottom for JS).
4. Run `./build.sh` to rebuild `dist/`.

### Adding a new layout

1. Create `src/css/layouts/my-layout.css`.
2. Add to `build.sh` in the layouts section (after components, before utilities).
3. Run `./build.sh`.

### Theme system at a glance

All theme axes are `data-*` attributes on `<html>`:

```html
<html data-mode="dark" data-accent="ocean" data-preset="modern" data-density="compact">
```

| Attribute      | Options                                                      |
|----------------|--------------------------------------------------------------|
| `data-mode`    | `light` \| `dark` \| `auto`                                |
| `data-accent`  | `ocean` `forest` `sunset` `royal` `mint` `amber` `rose` `slate-fire` |
| `data-preset`  | `modern` `minimal` `rounded` `bold` `editorial`             |
| `data-radius`  | `sharp` \| `soft`                                          |
| `data-density` | `compact` \| `comfortable`                                  |
| `data-shadow`  | `flat` \| `soft`                                           |
| `data-border`  | `none` \| `subtle` \| `medium` \| `bold` \| `dashed`      |

Managed at runtime by `WBTheme` — preferences are saved to `localStorage` automatically.

---

## Icon System

WebBlocks UI ships **133 Lucide icons** as an SVG sprite (`dist/webblocks-icons.svg`).

### Including the sprite

Add the sprite once per page, hidden, immediately after `<body>`:

```html
<div hidden aria-hidden="true">
  <!-- inline the SVG file here, or load async: -->
</div>
```

Async load (recommended):

```html
<script>
  fetch('/dist/webblocks-icons.svg')
    .then(r => r.text())
    .then(html => {
      var d = document.createElement('div');
      d.hidden = true; d.innerHTML = html;
      document.body.prepend(d);
    });
</script>
```

### Using icons

```html
<svg class="wb-icon" aria-hidden="true"><use href="#wb-icon-home"></use></svg>
<svg class="wb-icon wb-icon-lg wb-icon-accent" aria-hidden="true"><use href="#wb-icon-users"></use></svg>
```

### Icon classes

| Class             | Effect                             |
|-------------------|------------------------------------|
| `wb-icon`         | Base — `1em × 1em`, `currentColor` |
| `wb-icon-sm`      | `0.875rem`                         |
| `wb-icon-lg`      | `1.5rem`                           |
| `wb-icon-xl`      | `2rem`                             |
| `wb-icon-accent`  | `color: var(--wb-accent)`         |
| `wb-icon-muted`   | `color: var(--wb-muted)`          |
| `wb-icon-success` | `color: var(--wb-success)`        |
| `wb-icon-warning` | `color: var(--wb-warning)`        |
| `wb-icon-danger`  | `color: var(--wb-danger)`         |
| `wb-icon-info`    | `color: var(--wb-info)`           |

### Regenerating the sprite

```bash
# Requires Node (one-time, not part of normal dev workflow)
node scripts/build-icons.js
# Outputs: dist/webblocks-icons.svg
```

Edit `selected-icons.json` to add or remove icons before rebuilding.

**IMPORTANT: After regenerating the sprite, rebuild and push `dist/` files:**

```bash
# 1. Rebuild all dist files from source
./build.sh

# 2. Commit and push the regenerated dist/ files to GitHub
git add dist/
git commit -m "Build: regenerate dist files with updated icons"
git push origin master
```

**GitHub caching:** After push, GitHub Pages and CDN caches may lag 1-2 minutes. Test sites should:
1. Hard refresh browser cache: `Ctrl+Shift+R` (or `Cmd+Shift+R` on macOS)
2. If still stale, purge JSDelivr cache: `curl https://purge.jsdelivr.net/gh/fklavyenet/webblocks-ui@master/dist/webblocks-icons.svg`

**Without rebuilding and pushing `dist/`, changes are invisible to external consumers.**

### Reference page

Open `examples/v2/icons.html` in a browser for a searchable icon gallery with click-to-copy.

---

## Version History

| Version | Description                                                  |
|---------|--------------------------------------------------------------|
| V1      | Core components, foundation tokens, dashboard + auth layouts |
| V2      | Advanced components (drawer, command palette, nav-group, etc.), multi-axis theme system, new layouts (settings-shell, content-shell), toolbar, icon system, website example pages |
