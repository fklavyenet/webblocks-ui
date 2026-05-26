# WebBlocks UI Package

Shipped CSS, JS, icons, and package-level integration docs for WebBlocks UI.

No npm. No framework runtime. No dependency install step.

## What This Package Ships

- `dist/webblocks-ui.css` - main stylesheet
- `dist/webblocks-ui.js` - opt-in interaction runtime
- `dist/webblocks-icons.css` - class-based icon file for `<i class="wb-icon wb-icon-*">`
- `dist/webblocks-icons.json` - structured icon manifest for pickers and catalog sync

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
- `wb-card-media` is the canonical non-cropping media frame for card bodies when mixed image sizes need consistent text rhythm
- `wb-table-wrap` is the single table surface
- `wb-section-nav` is the canonical local section navigation pattern
- `wb-gallery` is the canonical inline media pattern; viewer behavior stays inside one shared `wb-modal`
- `wb-rich-text` is the canonical primitive for sanitized editorial body copy; keep headings, media, tables, buttons, and page layout outside it
- `wb-cookie-consent` is the reusable public-site consent pattern; entry UI can be a bottom banner or floating card, and preferences stay inside one shared `wb-modal`
- `wb-overlay-root` is shared runtime infrastructure for enhanced overlays; `wb-modal` remains the canonical public top-layer primitive
- nested overlays should follow the overlay stack contract and must not stay clipped inside parent containers or overlay bodies
- `wb:overlay:close-request` is the canonical overlay-level hook for unsaved-change guards; host apps own dirty-state policy and should use programmatic close after save or confirmed discard
- transient success/info feedback should use `wb-toast` outside normal layout flow, preferably under `#wb-overlay-root`; validation errors, user-correctable failures, persistent warnings, and blocking failures should stay inline with contextual feedback such as `wb-alert`
- toasts are not modals: no backdrop, focus trap, body scroll lock, or page interaction blocking
- avoid teaching `panel` as a generic surface or overlay noun; keep it only for scoped internal structures such as `wb-popover-panel`
- in-page `wb-section-nav` active state is runtime-owned; `WBSectionNav` applies `.is-active` and `aria-current="location"` from real hash/scroll state
- text casing is content-defined; shipped UI should not force uppercase or capitalize

## Rich Text

Use `wb-rich-text` when a host project has already rendered sanitized editorial HTML for body copy.

- supported content: paragraphs, emphasis, inline code, links, simple unordered/ordered lists, and blockquotes
- optional modifiers: `wb-rich-text-readable`, `wb-rich-text-compact`, `wb-rich-text-loose`
- keep headings, buttons, media, tables, layout composition, and raw HTML handling outside this primitive
- let the parent layout or container own width; `wb-rich-text-readable` does not clamp measure

```html
<div class="wb-rich-text wb-rich-text-readable">
  <p>Editorial body copy with <strong>strong emphasis</strong>, <em>tone</em>, <code>inline code</code>, and <a href="#">links</a>.</p>
  <ul>
    <li>Safe unordered list item</li>
    <li>Another list item</li>
  </ul>
  <blockquote>
    <p>Use this primitive for readable body copy rhythm, not for page layout or width management.</p>
  </blockquote>
</div>
```

## JavaScript Modules

Shipped interactive modules expose `window.*` APIs:

- `WBTheme`
- `WBModal`
- `WBDropdown`
- `WBTabs`
- `WBAccordion`
- `WBSidebar`
- `WBGallery`
- `WBCookieConsent`
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

`WBGallery` upgrades `.wb-gallery-trigger` elements that target one shared modal viewer, updates caption/meta/image state from the active item, and keeps stepping scoped to the current `.wb-gallery` set.

`WBCookieConsent` handles reusable consent storage, accept/reject/custom preference flows, reopen hooks, and the public API around the `wb-cookie-consent` pattern.

Use `INTEGRATION.md` for canonical data attributes, method names, and behavioral rules.

## Icons

WebBlocks ships 183 curated Lucide icons through `dist/webblocks-icons.css`, including docs/admin navigation controls such as `layout-dashboard`, `layout-grid`, `box`, `circle-dot`, `route`, `images`, `cookie`, and `megaphone` alongside builder controls such as `grip-vertical`, `plus`, `minus`, `arrow-up`, `arrow-down`, and `arrow-up-down`.

For structured picker data, WebBlocks also ships `dist/webblocks-icons.json`. Each manifest entry includes a canonical `slug`, human label, `css_class`, generic `source`, plus `categories`, `contexts`, and `keywords` so consuming projects can build icon pickers without hardcoding icon lists.

Use `contexts` such as `navigation` to scope menus, sidebars, tabs, and page-group icon choices without exposing the entire catalog by default.

Canonical usage:

```html
<i class="wb-icon wb-icon-settings" aria-hidden="true"></i>
<i class="wb-icon wb-icon-settings wb-icon-lg wb-icon-accent" aria-hidden="true"></i>
```

If you do not use icons, omit `dist/webblocks-icons.css`.

## Gallery

WebBlocks ships `wb-gallery` as the canonical equal-tile inline media pattern.

Use it when the page needs:

- screenshot sets
- editorial image groups
- inline image collections that may open a focused viewer

Keep the contract small:

- one `.wb-gallery` wrapper
- one `.wb-gallery-grid`
- many `.wb-gallery-item` entries
- one real trigger per item as `.wb-gallery-trigger`
- one shared `.wb-modal` viewer for the gallery context

Do not treat immersive viewing as a second public primitive such as `wb-lightbox` or per-item gallery modals.

## Cookie Consent

WebBlocks ships `wb-cookie-consent` as the reusable public-site consent pattern.

Use it when the project needs:

- a shared bottom banner or floating card consent entry point
- one reusable preference-center modal
- a stable footer or settings reopen hook
- localStorage-backed consent state without project-local helper code

Core hooks:

- `data-wb-cookie-consent`
- `data-wb-cookie-consent-accept`
- `data-wb-cookie-consent-reject`
- `data-wb-cookie-consent-save`
- `data-wb-cookie-consent-open`
- `data-wb-cookie-consent-close`
- `data-wb-cookie-category`

Host projects must still adapt legal copy and conditionally load optional third-party scripts from the stored preferences.

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
- `dist/webblocks-icons.json`

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
- `scripts/validate-icons.js` verifies shipped manifest and docs icon classes resolve to generated selectors in `dist/webblocks-icons.css`
- if you change source CSS, JS, or icons, rebuild `dist/` before committing
