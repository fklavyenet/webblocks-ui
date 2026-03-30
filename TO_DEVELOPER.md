# TO_DEVELOPER — WebBlocks UI

Everything a developer needs to understand, run, and extend this project.

---

## Goal & Vision

WebBlocks UI is a **framework-agnostic, zero-dependency, primitive-driven UI system** for building admin panels, SaaS dashboards, and CMS control panels.

The guiding principle: **plain HTML stays plain HTML.** No custom elements, no shadow DOM, no npm install, no framework build pipeline. Drop in the shipped dist files and go.

---

## Status

| Phase | Status   | Description                             |
|-------|----------|-----------------------------------------|
| V1    | Complete | Core primitives, foundation, layouts    |
| V2    | Complete | Advanced primitives and patterns, multi-axis theming |

---

## Current Task

Repository docs cleanup after the `gpt/` -> `docs/` move and `content/` removal.

- [x] Move the English docs surface to `docs/`
- [x] Remove obsolete `content/`
- [x] Keep docs/examples aligned with class-based mask-image icons only
- [ ] Re-run final reference cleanup and verify doc paths

---

## Important Notes

- **No npm for the main library.** The package itself does not use npm, Vite, or webpack.
- **Build is `./build.sh`** — a plain shell `cat` concatenation. Run it after any source change.
- **`wb-` prefix is mandatory** on every class — no exceptions.
- **All colors / sizes come from tokens** — never hardcode `#hex` or `px` values in source CSS.
- **`--wb-primary*` are backward-compat aliases** — use `--wb-accent*` in all new code.
- **`scripts/` uses Node** — `build-icons.js` and `update-icons.js` are dev tools only. They are NOT part of the library's zero-dependency guarantee.

---

## Setup

No installation required for the library itself.

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
# Rebuild dist/ from all source files (CSS + JS + icon CSS)
./build.sh

# Regenerate icon CSS from the internal source SVG set
node scripts/build-icons.js

# Refresh the internal source SVG set from Lucide CDN, then rebuild dist/
node scripts/update-icons.js
./build.sh
```

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
├── packages/
│   └── webblocks/
│       ├── build.sh                ← concat script; edit when adding new source files
│       ├── dist/
│       │   ├── webblocks-ui.css    ← compiled CSS (DO NOT edit directly)
│       │   ├── webblocks-ui.js     ← compiled JS (DO NOT edit directly)
│       │   └── webblocks-icons.css ← class-based icon CSS for `<i>` usage
│       ├── src/
│       │   ├── css/
│       │   │   ├── foundation/     ← tokens, theme axes, reset, base rules
│       │   │   ├── layout/         ← structural primitives and flow helpers
│       │   │   ├── primitives/     ← reusable UI primitives
│       │   │   ├── patterns/       ← composed page and shell patterns
│       │   │   ├── utilities/      ← helper classes
│       │   │   └── icons/
│       │   │       ├── webblocks-icons.svg ← internal source icon set
│       │   │       └── webblocks-icons.css ← generated icon CSS source
│       │   └── js/
│       │       ├── theme.js
│       │       ├── dropdown.js
│       │       ├── modal.js
│       │       ├── tabs.js
│       │       ├── accordion.js
│       │       ├── sidebar.js
│       │       ├── nav-group.js
│       │       ├── drawer.js
│       │       ├── command-palette.js
│       │       ├── toast.js
│       │       ├── popover.js
│       │       ├── tooltip.js
│       │       ├── dismiss.js
│       │       ├── ajax-toggle.js
│       │       └── collapse.js
│       └── scripts/
│           ├── build-icons.js      ← reads source SVG, writes generated icon CSS
│           └── update-icons.js     ← fetches Lucide CDN → updates source SVG
├── docs/                           ← repo docs and integrated pattern examples
├── README.md
├── TO_DEVELOPER.md
└── AGENTS.md
```

### Adding a new primitive

1. Create `src/css/primitives/my-primitive.css` — use tokens only, `wb-` prefix on all classes.
2. If JS is needed, create `src/js/my-primitive.js` — IIFE pattern, expose `window.WBMyPrimitive`.
3. Add both files to `build.sh` in the correct order (primitives section for CSS, bottom for JS).
4. Run `./build.sh` to rebuild `dist/`.

### Adding a new structural or pattern file

1. Create `src/css/layout/my-layout.css` for structural primitives, or `src/css/patterns/my-pattern.css` for composed shells.
2. Add it to `build.sh` in the matching section.
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
| `data-preset`  | `modern` `minimal` `editorial` `playful` `corporate`        |
| `data-radius`  | `sharp` \| `soft`                                          |
| `data-density` | `compact` \| `comfortable`                                  |
| `data-shadow`  | `flat` \| `soft`                                           |
| `data-border`  | `none` \| `subtle` \| `medium` \| `bold` \| `dashed`      |

Managed at runtime by `WBTheme` — preferences are saved to `localStorage` automatically.

---

## Icon System

WebBlocks UI ships **173 Lucide icons** as class-based mask-image CSS in `dist/webblocks-icons.css`.

### Canonical usage

Include `dist/webblocks-icons.css` in addition to `webblocks-ui.css`, then:

```html
<i class="wb-icon wb-icon-home" aria-hidden="true"></i>
<i class="wb-icon wb-icon-users wb-icon-lg wb-icon-accent" aria-hidden="true"></i>
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

### Icon source files

The internal source icon set is versioned in `packages/webblocks/src/css/icons/`. It is used to generate the shipped CSS classes.

```
src/css/icons/
├── webblocks-icons.svg   ← internal source icon set
└── webblocks-icons.css   ← generated CSS source
```

`./build.sh` regenerates `dist/webblocks-icons.css`. The SVG file remains an internal source asset, not a public delivery surface.

### Regenerating icon assets (when changing icon list)

```bash
# Step 1: Update the internal source SVG set from Lucide CDN
#         Edit the icon list inside update-icons.js first, then:
node scripts/update-icons.js

# Step 2: Regenerate icon CSS from the source SVG set
node scripts/build-icons.js

# Step 3: Rebuild all dist files
./build.sh
```

**IMPORTANT: After regenerating the sprite, commit and push `dist/` files:**

```bash
git add dist/
git commit -m "Build: regenerate dist files with updated icons"
git push origin master
```

**GitHub caching:** After push, CDN caches may lag 1-2 minutes. Test sites should:
1. Hard refresh browser cache: `Ctrl+Shift+R` (or `Cmd+Shift+R` on macOS)
2. If still stale, purge JSDelivr cache for the changed dist asset

**Without rebuilding and pushing `dist/`, changes are invisible to external consumers.**

### Reference page

Open `docs/icons.html` in a browser for a searchable icon gallery with click-to-copy.

---

## Version History

| Version | Tag    | Description                                                  |
|---------|--------|--------------------------------------------------------------|
| V1      | —      | Core primitives, foundation tokens, dashboard + auth layouts |
| V2      | —      | Advanced primitives (drawer, command palette, nav-group, etc.), multi-axis theme system, new layouts (settings-shell, content-shell), toolbar, icon system, and integrated docs patterns |
| v2.1.0  | v2.1.0 | Complete V2 release — new primitives, accent system, theme engine |
| v2.2.0  | v2.2.0 | Add theme mode icons (sun/moon/sun-moon); `webblocks-icons.css` for `<i>` tag support |
| v2.2.4  | v2.2.4 | Add WBToast, WBPopover, WBTooltip, WBDismiss JS modules      |
| v2.2.5  | v2.2.5 | Add WBAjaxToggle — AJAX checkbox toggle with CSRF and toast  |
| v2.3.0  | v2.3.0 | Add Grid, Input Group, Radio Card, Collapse, wb-mono utility |
| v2.3.4  | —      | Fix dropdown not opening (dual CSS selector)                 |
| v2.3.5  | —      | Fix sidebar nav indent token |
