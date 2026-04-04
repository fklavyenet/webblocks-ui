# WebBlocks UI Package

Shipped CSS, JS, icons, and package-level integration docs for WebBlocks UI.

No npm. No framework runtime. No dependency install step.

## What This Package Ships

- `dist/webblocks-ui.css` - main stylesheet
- `dist/webblocks-ui.js` - opt-in interaction runtime
- `dist/webblocks-icons.css` - class-based icon file for `<i class="wb-icon wb-icon-*">`

WebBlocks stays HTML-first: use standard markup, shipped classes, and opt-in JS behavior.

## Install

```html
<link rel="stylesheet" href="dist/webblocks-ui.css">
<link rel="stylesheet" href="dist/webblocks-icons.css">
<script src="dist/webblocks-ui.js" defer></script>
```

Notes:

- `webblocks-icons.css` is optional unless you use class-based icons
- `webblocks-ui.js` is optional unless you use shipped interactive behavior

## Start Correctly

Start from patterns, not primitives.

- `../../PATTERNS.md` - canonical shells and page-level patterns
- `../../PRIMITIVES.md` - primitive vs surface vs pattern boundaries
- `INTEGRATION.md` - package-level source-accurate implementation reference

## Theme Axes

Set theme state on `<html>`:

```html
<html data-mode="auto"
      data-accent="royal"
      data-preset="corporate"
      data-radius="soft"
      data-density="compact"
      data-shadow="soft"
      data-border="subtle">
```

Supported attributes:

- `data-mode` = `light | dark | auto`
- `data-accent` = `ocean | forest | sunset | royal | mint | amber | rose | slate-fire`
- `data-preset` = `modern | minimal | editorial | playful | corporate`
- `data-radius` = `sharp | soft`
- `data-density` = `compact | comfortable`
- `data-shadow` = `flat | soft`
- `data-font` = `system | modern | editorial`
- `data-border` = `none | subtle | medium | bold | dashed`

Theme buttons use shipped data attributes such as `data-wb-mode-set`, `data-wb-accent-set`, and `data-wb-preset-set`.

## Canonical Notes

- `wb-card` is the single canonical framed surface noun
- `wb-table-wrap` is the single table surface
- `wb-section-nav` is the canonical local section navigation pattern
- in-page `wb-section-nav` active state is runtime-owned; `WBSectionNav` applies `.is-active` and `aria-current="location"` from real hash/scroll state
- text casing is content-defined; shipped UI should not force uppercase or capitalize

## JavaScript Modules

Shipped interactive modules expose `window.*` APIs:

- `WBTheme`
- `WBModal`
- `WBDropdown`
- `WBTabs`
- `WBAccordion`
- `WBSidebar`
- `WBSectionNav`
- `WBNavGroup`
- `WBDrawer`
- `WBCommandPalette`
- `WBToast`
- `WBPopover`
- `WBTooltip`
- `WBDismiss`
- `WBAjaxToggle`
- `WBPasswordToggle`
- `WBCollapse`

`WBSectionNav` handles in-page `wb-section-nav` anchors, including hash-aware active state and scroll-container-aware docs behavior.

Use `INTEGRATION.md` for canonical data attributes, method names, and behavioral rules.

## Icons

WebBlocks ships 173 curated Lucide icons through `dist/webblocks-icons.css`.

Canonical usage:

```html
<i class="wb-icon wb-icon-settings" aria-hidden="true"></i>
<i class="wb-icon wb-icon-settings wb-icon-lg wb-icon-accent" aria-hidden="true"></i>
```

If you do not use icons, omit `dist/webblocks-icons.css`.

## Build

The dist files are committed. End users do not need to build anything.

To rebuild package output from source:

```bash
./packages/webblocks/build.sh
```

This regenerates:

- `dist/webblocks-ui.css`
- `dist/webblocks-ui.js`
- `dist/webblocks-icons.css`

## Package Structure

```text
packages/webblocks/
├── build.sh
├── CHANGELOG.md
├── INTEGRATION.md
├── README.md
├── dist/
│   ├── webblocks-ui.css
│   ├── webblocks-ui.js
│   └── webblocks-icons.css
├── scripts/
│   ├── build-icons.js
│   └── update-icons.js
└── src/
    ├── css/
    └── js/
```

## Development Notes

- icon source lives in `src/css/icons/webblocks-icons.svg`
- `scripts/build-icons.js` regenerates icon CSS from the source icon set
- `scripts/update-icons.js` refreshes the curated icon source from Lucide and is maintainer-only
- if you change source CSS, JS, or icons, rebuild `dist/` before committing
