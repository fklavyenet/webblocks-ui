# Changelog

All notable changes to WebBlocks UI are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

---

## [2.7.10] — 2026-05-26

### Changed
- Defer the minified CSS/JS production recommendation after a CSS grammar regression was found in the minification pipeline around meaningful whitespace in `calc()` and nested CMS sidebar navigation indentation.
- Restore downstream production/CDN guidance to the standard non-minified dist files: `dist/webblocks-ui.css`, `dist/webblocks-icons.css`, and `dist/webblocks-ui.js`.
- Keep committed `.min.css` / `.min.js` artifacts in the repository as experimental/deferred outputs so already-visible versioned CDN paths do not break, but mark them as not recommended for downstream production yet.
- Document that downstream integrations should use the standard non-minified dist files until minification hardening and regression coverage are completed.

---

## [2.7.9] — 2026-05-26

### Fixed
- Restore the shared toast lifecycle for server-rendered and dynamically inserted markup so success/info toasts auto-dismiss by default without consumer-project JavaScript.
- Keep warning, danger, and error toasts persistent by default while preserving manual close buttons and explicit timeout overrides.

### Changed
- Make top-right the default toast stack for programmatic and static usage, with bottom-right retained through `wb-toast-container-bottom-right` / `position: 'bottom-right'`.
- Document declarative toast lifecycle controls: `data-wb-toast-timeout` and `data-wb-auto-dismiss="false"`.

---

## [2.7.8] — 2026-05-26

### Added
- Add dependency-free minified production artifacts for CDN consumers: `dist/webblocks-ui.min.css`, `dist/webblocks-icons.min.css`, and `dist/webblocks-ui.min.js`.
- Add build guards that verify the minified CSS/JS banners, key icon selectors, public `window.WB*` APIs, and minified JS syntax when Node is available.

### Changed
- Clarify the official toast and contextual feedback standard in docs: transient success/info feedback uses `wb-toast` outside normal layout flow, while validation errors, user-correctable failures, persistent warnings, and blocking failures stay inline with contextual feedback such as `wb-alert`.
- Keep the existing non-minified dist files unchanged as backward-compatible debug/development assets.

---

## [2.7.7] — 2026-05-23

### Changed
- Direct `wb-card` children of `wb-grid`, `wb-grid-2`, `wb-grid-3`, `wb-grid-4`, `wb-grid-auto`, `wb-grid-auto-sm`, and `wb-grid-auto-lg` now stretch to the row height and keep `wb-card-footer` aligned to the bottom without requiring extra utility classes.

---

## [2.7.6] — 2026-05-16

### Changed
- Add HTML docs for overlay stack and `wb:overlay:close-request` behavior in the primitives reference, including default dismissible modal, nested modal stack, guarded unsaved-change flow, and confirmed programmatic close examples
- Keep `wb-modal` as the public top-layer primitive in the docs while treating `wb-overlay-root` as shared runtime infrastructure rather than a separate public component

---

## [2.7.5] — 2026-05-16

### Added
- Add a cancelable `wb:overlay:close-request` event for user-initiated overlay close attempts so host apps can guard unsaved state without introducing modal-only close rules

### Changed
- Document `wb:overlay:close-request` as the canonical overlay-level hook for unsaved-change guards while keeping dirty-state policy and confirmation UI in host apps

### Fixed
- Normalize user close reasons to `escape`, `outside`, `close-control`, and `dismiss-control` across the shared overlay runtime and shipped dialog-style overlay modules
- Keep trusted programmatic close APIs such as `WBModal.close(...)` and `WBDrawer.close(...)` outside the close-request flow so confirmed save/discard paths can close cleanly after guard logic

---

## [2.7.4] — 2026-05-15

### Changed
- Document the shared overlay stack contract across the repo and package docs while keeping `wb-modal` as the canonical public top-layer primitive and `wb-overlay-root` as internal runtime infrastructure

### Fixed
- Harden the shared overlay runtime so nested modals, drawers, command palettes, and elevated anchored overlays stack deterministically with per-instance backdrops instead of relying on incidental DOM order
- Keep Escape, outside click, pointer ownership, focus return, and body scroll locking scoped to the topmost active overlay in stacked flows
- Preserve anchored overlay clipping avoidance under `#wb-overlay-root` while allowing nested picker/popover style overlays to elevate above parent dialog surfaces when enhanced runtime is active

---

## [2.7.3] — 2026-05-15

### Added
- `wb-card-media` as the canonical non-cropping media frame for card bodies so mixed image heights can keep text aligned and card grids visually even
- alignment modifiers for card media frames: `wb-card-media--start`, `wb-card-media--center`, `wb-card-media--end`, and `wb-card-media--stretch`
- aspect modifiers for card media frames: `wb-card-media--aspect-auto`, `wb-card-media--aspect-square`, `wb-card-media--aspect-wide`, and `wb-card-media--aspect-portrait`

### Changed
- card media guidance now defaults to `object-fit: contain` so logos, screenshots, and service images keep their full content visible instead of cropping by default

---

## [2.7.2] — 2026-05-14

### Fixed
- Unhide authored `#wb-overlay-root` infrastructure wrappers such as `.wb-overlay-layer` when a modal or gallery viewer target opens inside them, then restore `hidden` only after the last active overlay in that wrapper closes
- Add a docs regression fixture for hidden overlay-layer modal and gallery flows so the shared runtime behavior can be verified against CMS-style authored overlay markup

---

## [2.7.1] — 2026-05-13

### Fixed
- Restore the curated `arrow-down`, `arrow-up`, `arrow-up-down`, and `grip-vertical` glyphs to the shipped icon registry so the icon manifest, generated CSS, and `/icons` docs catalog no longer advertise classes without generated masks
- Add a maintainer icon validation step to the package build so manifest entries and docs-listed icon classes fail the build when they drift from generated `webblocks-icons.css`

---

## [2.7.0] — 2026-05-08

### Added
- Add a focused set of docs/admin navigation icons to the curated mask-image catalog: `box`, `circle-dot`, `cookie`, `images`, `megaphone`, and `route`
- Add generated `dist/webblocks-icons.json` so consumers can build icon pickers from the shipped WebBlocks UI catalog with generic categories, contexts, and keywords

### Changed
- Add a shared icon registry so the curated Lucide set, generated SVG/CSS output, and structured icon manifest all stay aligned through the existing build flow
- Update icon docs/catalog output and generic package docs so consumers can use the shipped icon manifest for picker UIs and filtered navigation icon sets

---

## [2.6.3] — 2026-05-08

### Changed
- table action groups now stay left-aligned and no-wrap inside `wb-table-actions` so compact icon actions remain on one line.

---

## [2.6.2] — 2026-05-08

### Changed
- Removed the remaining `wb-text-end` table action docs guidance; action headers, single action links/buttons, and grouped action buttons now use `wb-table-actions` and left alignment by default.

---

## [2.6.1] — 2026-05-07

### Changed
- Audit and tighten the v2.6.0 admin standards class surface so preferred docs/examples now reuse existing primitives and helpers such as `wb-card`, `wb-card-footer`, `wb-field`, `wb-field-hint`, `wb-field-error`, `wb-action-group`, `wb-grid-2`, `wb-stack-*`, and `wb-page-breadcrumb` where they already cover the same job
- Keep the redundant v2.6.0 names such as `wb-page-breadcrumbs`, `wb-form-field`, `wb-form-help`, `wb-form-error`, `wb-form-footer`, `wb-form-actions`, `wb-form-card`, `wb-form-grid`, `wb-form-grid-2`, `wb-breadcrumb-separator`, and `wb-action-icon` available as compatibility aliases instead of preferred API guidance
- Make no breaking removals while clarifying the smaller recommended admin-facing class surface for new downstream usage

---

## [2.6.0] — 2026-05-07

### Added
- Add canonical admin standards docs covering page headers, breadcrumbs, form cards, form footers, detail lists, action columns, danger zones, and health-notice presentation guidance

### Changed
- Remove the fixed `70ch` readable-width clamp from `wb-rich-text-readable` so parent layouts and containers own width decisions
- Existing page, card, form, table, and action primitives now document and support clearer admin-oriented aliases and helper classes such as `wb-page-title`, `wb-page-description`, `wb-form-grid-2`, `wb-form-footer`, `wb-detail-list`, `wb-table-actions`, and `wb-danger-zone`

---

## [2.5.0] — 2026-05-04

### Added
- Add `wb-rich-text` as a CSS-only primitive for sanitized editorial body copy, including opt-in readable measure and compact/loose rhythm modifiers

### Changed
- Add canonical docs, primitive-boundary guidance, and package integration coverage for the new scoped editorial body-copy contract

---

## [2.4.4] — 2026-04-30

### Added
- Add Lucide-sourced admin/builder icons to the WebBlocks UI mask-image icon set: `grip-vertical`, `arrow-up`, `arrow-down`, and `arrow-up-down`

### Changed
- Keep the existing WebBlocks UI icon architecture unchanged: class-based `wb-icon-*` names backed by CSS mask-image data URLs and generated icon CSS

---

## [2.4.3] — 2026-04-30

### Changed
- `packages/webblocks/VERSION` is now the single source of truth for the shipped package version, build banners, and generated docs version metadata
- `packages/webblocks/build.sh` now prepends official version banners to `webblocks-ui.css`, `webblocks-icons.css`, and `webblocks-ui.js`
- docs and playground version labels now read from generated `docs/version.js` instead of hardcoded page strings

---

## [2.4.0] — 2026-04-05

### Added
- Icon System v1: curated expansion for editorial, marketing, business, and social brand usage
- New high-value icons: `external-link`, `eye`, `eye-off`, `star`, `bookmark`, `heart`, `share2`, `book-open`, `newspaper`, `map-pin`, `briefcase`, `building2`, `linkedin`, `twitter`, `instagram`, `youtube`
- Action icon aliases for panel workflows: `refresh` and `sync`, mapped to the existing `rotate-cw` and `repeat` glyphs with stable public names
- Breadcrumb preset system: `minimal`, `surface`, `bordered`, `inline`, and `context`, with controlled separator modifiers and single-item context support
- `WBPasswordToggle` and `data-wb-password-toggle` for canonical password visibility behavior inside the standard field/input-group contract
- `wb-section-nav` as the canonical reusable section-level navigation pattern for settings rails, docs side navigation, and in-page section indexes
- `WBSectionNav` runtime behavior for in-page anchor navigation, including hash-aware active state, scroll-container-aware docs scroll spy, and `aria-current="location"` updates
- `wb-media`, `wb-media-img`, and `wb-media-caption` as the canonical media contract used by content-first modal viewers

### Changed
- Icon set refreshed to 173 curated Lucide icons for CSS mask-image delivery
- Icon reference docs updated to use the `wb-icon-*` symbol/class convention consistently
- Icon reference docs now explain the semantic split between refresh, sync, retry, and rotate actions
- Page/header guidance now treats breadcrumb as secondary context, keeps page title primary, and formalizes product-first topbar identity hierarchy
- Page title naming is now context-specific: use `wb-page-header-title` for dashboard page headers and `wb-page-intro-title` for intro/masthead headings
- `wb-card` is now the single canonical framed surface noun across the system, including dashboard work areas
- `wb-field-meta` is now the only valid assistive-content path for field hints and errors; docs/examples were normalized and row-aligned forms keep reserved meta space only where alignment is needed
- auth and form examples now use the shipped password toggle contract instead of implying app-level show/hide behavior
- pagination now uses a semantic `nav` plus ordered-list contract with explicit current, disabled, ellipsis, and compact states
- tables now follow a single-surface model: `wb-table-wrap` owns radius/border/clipping, inner toolbars stay control rows, and header cells no longer create competing surface corners or bands
- automatic uppercase casing was removed from shipped UI primitives and patterns so emphasis stays locale-safe and content-defined
- long-form docs pages now use canonical `wb-section-nav` rails for local section navigation instead of ad hoc page-specific indexes
- docs and playground local asset loaders now read the built package files from local published `packages/webblocks/dist/` paths
- overlay guidance now keeps `wb-overlay-root` and the shared overlay runtime as internal infrastructure while `wb-modal` remains the single public top-layer pattern
- modal guidance now treats lightbox, gallery, and content-first viewer experiences as `wb-modal` usage modes rather than a separate public overlay primitive

### Removed
- Breaking simplification: removed the old dashboard-only framed-surface family and converged all framed dashboard surfaces on `wb-card`, `wb-card-header`, `wb-card-title`, `wb-card-body`, and `wb-card-footer`
- removed the `wb-uppercase` and `wb-capitalize` text-transform utilities from shipped CSS
- removed the public `wb-overlay` pattern and `WBOverlay` API; content-first viewer usage now stays on `wb-modal`

### Fixed
- CSS icon mappings are now generated from the source icon set so `<i class="wb-icon wb-icon-*"></i>` stays stable across rebuilds
- Added refresh icon CSS aliases for `wb-icon-refresh-cw`, `wb-icon-refresh`, and `wb-icon-rotate-cw`, mapped to the existing `wb-icon-rotate-cw` glyph for downstream compatibility
- Added a default `help-circle` mask fallback for `<i class="wb-icon ..."></i>` so unknown or missing `wb-icon-*` classes do not render as empty squares
- playground asset loading now resolves the correct local `dist/` path for the docs surface and the root `playground/` entry point
- docs `wb-section-nav` active state now follows the real docs scroll container instead of assuming `window` scroll
- docs `wb-section-nav` no longer lets the current hash permanently override scroll spy after anchor clicks

---

## [2.2.5] — 2026-03-17

### Added
- `src/js/ajax-toggle.js` — `WBAjaxToggle` module: AJAX POST on checkbox change
  - Attribute convention: `data-wb-ajax-toggle`, `data-wb-url`, `data-wb-field`, `data-wb-id`
  - POST body: `{ "id": "42", "name": "publish", "checked": "true" }`
  - `X-CSRF-TOKEN` header auto-read from `<meta name="csrf-token">` (Laravel compatible)
  - Failure reverts checkbox to previous state
  - `data-wb-feedback="toast|none"` — default `toast`; uses `WBToast` for success/error
  - Accepts HTTP 200–299 and/or `{ "success": true }` JSON body as success signal
  - Custom events: `wb:ajax-toggle:success` / `wb:ajax-toggle:error` (bubble on checkbox)
  - `data-wb-success-msg` / `data-wb-error-msg` for custom toast messages

### Changed
- `build.sh` — added `ajax-toggle.js` to JS concat order (after `dismiss.js`)
- `dist/webblocks-ui.js` rebuilt: 2015 → 2208 lines

### Notes
- Zero breaking changes
- Designed for Laravel admin panels; works with any backend returning 2xx on success

---

## [2.2.4] — 2026-03-17

### Added
- `src/js/toast.js` — `WBToast` module: programmatic `WBToast.show(msg, opts)` with type, title, position, duration, and optional close button
- `src/js/popover.js` — `WBPopover` module: `data-wb-toggle="popover"` toggle, Escape key and outside-click to close, `WBPopover.open/close/closeAll()` API
- `src/js/tooltip.js` — `WBTooltip` module: programmatic `show/hide/hideAll()` + `data-wb-tooltip-delay` support for shipped tooltip behavior
- `src/js/dismiss.js` — `WBDismiss` module: centralised `data-wb-dismiss="alert|banner"` handler with `is-leaving` animation
- `alert.css` — `is-leaving` fade + slide-up transition for dismissed alerts

### Changed
- `build.sh` — added 4 new JS modules to concat order (after `command-palette.js`)
- `dist/webblocks-ui.js` rebuilt: 1499 → 2015 lines
- `dist/webblocks-ui.css` rebuilt: 6520 → 6540 lines

### Notes
- Zero breaking changes — existing projects unaffected
- Toast containers are created automatically in `<body>` on first call; no HTML required
- Popover CSS was already complete; this release adds the JS toggle behaviour
- Tooltip CSS handles all hover/focus states; JS module is opt-in for programmatic control

---

## [2.2.0] — 2026-03-16

### Added
- Theme mode icons for light/dark/auto mode selection:
  - `wb-icon-sun` — Light mode (Lucide `Sun`)
  - `wb-icon-moon` — Dark mode (Lucide `Moon`)
  - `wb-icon-sun-moon` — Auto/system mode (Lucide `SunMoon`)
- Icon count: 130 → 133 (both `webblocks-icons.svg` and `webblocks-icons.css`)
- Icon gallery reference updated with all 133 icons

### Changed
- **Build system refactor**: `scripts/build-icons.js` now fetches Lucide icon bundle directly from unpkg.com CDN
- Removed hardcoded `/tmp/wb-lucide-build/node_modules/lucide` dependency
- Dynamic UMD bundle parsing for icon extraction (all 133 icons still generated identically)

### Improved
- Better documentation: separated **user** vs **developer** build workflows in README
- Marked `build-icons.js` as **development-only tool** with ⚠️ warning header
- Users warned not to run icon build script (requires internet, not needed for existing projects)
- Icon validation in `build.sh` continues working seamlessly

### Notes
- Zero breaking changes — existing projects unaffected
- Pre-built icon files (`dist/webblocks-icons.svg` and `.css`) ship ready-to-use
- Developers can update icon list by editing `scripts/build-icons.js` and running `node scripts/build-icons.js`

---

## [2.1.0] — 2026-03-16

### Added
- `wb-icon-trash` — Lucide `Trash` icon (simple, no inner lines); complements existing `wb-icon-trash2`
- `wb-icon-home` — Lucide `Home`
- `wb-icon-layout` — Lucide `Layout`
- `wb-icon-bar-chart` — Lucide `BarChart`
- `wb-icon-bar-chart2` — Lucide `BarChart2`
- `wb-icon-log-out` — Lucide `LogOut`
- `wb-icon-arrow-up-circle` — Lucide `ArrowUpCircle`
- `wb-icon-info` — Lucide `Info`
- `wb-icon-help-circle` — Lucide `HelpCircle`
- `wb-icon-circle-help` — Lucide `CircleHelp`
- Icon count: 120 → 130 (both `webblocks-icons.svg` and `webblocks-icons.css`)
- `wb-sidebar-brand` — alias for `wb-sidebar-header`; same styles, more intuitive name for logo/brand areas

### Fixed
- `.wb-sidebar` width fallback corrected: `var(--wb-sidebar-w, 240px)` → `var(--wb-sidebar-w, 260px)` to match the `--wb-sidebar-w: 260px` token definition

---

## [2.0.1] — 2026-03-15

### Fixed
- Replace all emoji and HTML entity icons in example pages with proper `<i class="wb-icon">` tags
- Add missing `webblocks-icons.css` link to `content/examples/public-pages/contact.html`
- Fix dead `forgot-password.html` link in `content/examples/auth/login.html` (changed to `#`)
- Fix typo `wb-icon-bar-chart3` → `wb-icon-bar-chart-3` in `content/examples/admin/dashboard.html`

### Added
- CSS aliases `wb-stat-meta`, `wb-stat-up`, `wb-stat-down`, `wb-stat-bar` in `card.css`
- CSS aliases `wb-shell`, `wb-shell-main`, `wb-shell-body` in `dashboard-shell.css`
- CSS alias `wb-dropdown-menu-end` in `dropdown.css`
- Utility classes `wb-mb-5` and `wb-mt-5` in `helpers.css`

### Fixed (CSS)
- `wb-grid-2`, `wb-grid-3`, `wb-grid-4` were missing `display: grid` — corrected in `container.css`

---

## [2.0.0] — 2026-03-15

### Added
- Full V2 primitive set: Drawer, Command Palette, Popover, Tooltip, Divider, List Group, Nav Group, Filter Bar, Action Menu, Loading/Spinner, Confirmation Dialog
- V2 layouts: Settings Shell, Content Shell
- Multi-axis theme engine: `data-mode`, `data-accent`, `data-preset`, `data-radius`, `data-density`, `data-shadow`, `data-font`, `data-border`
- 8 accent color themes: `ocean`, `forest`, `sunset`, `royal`, `mint`, `amber`, `rose`, `slate-fire`
- 5 named presets: `modern`, `minimal`, `editorial`, `playful`, `corporate`
- Bootstrap-style `<i>` tag icon support via `dist/webblocks-icons.css` (120 Lucide icons, mask-image technique)
- SVG sprite `dist/webblocks-icons.svg` with 120 Lucide icons
- `WBDrawer` JS module — focus trap, keyboard (Escape), `is-leaving` animation pattern
- `WBCommandPalette` JS module — Cmd/Ctrl+K, arrow navigation, search callback API
- `WBNavGroup` JS module — accordion-aware collapsible sidebar groups
- `WBTheme` JS module — `setMode()`, `setAccent()`, `setPreset()`, `setRadius()`, `setDensity()`
- Toast container position modifier classes: `wb-toast-container-top-right`, `wb-toast-container-top-center`, `wb-toast-container-top-left`, `wb-toast-container-bottom-center`, `wb-toast-container-bottom-left`
- `wb-confirm` confirmation dialog variant (inside `modal.css`)
- `wb-stat` stats card primitive (inside `card.css`)
- Proprietary LICENSE — Copyright (c) 2026 fklavye.net

### Changed
- Theme toggle attribute renamed from `data-wb-theme-set` to `data-wb-mode-set` (bug fix)
- Removed Blade stub files — "HTML stays HTML" philosophy, no framework coupling
- `--wb-primary*` tokens kept as backward-compatible aliases for `--wb-accent*`

### Removed
- All Blade/PHP stub files from the repository

---

## [0.1.0] — 2026-01-01

### Added
- Initial release — V1 core primitive set
- Primitives: Button, Badge, Card, Alert, Form, Table, Modal, Dropdown, Tabs, Accordion, Pagination, Breadcrumb, Avatar, Toast, Skeleton, Empty State
- Layouts: Dashboard Shell, Auth Shell, Navbar, Sidebar, Container
- JS modules: WBModal, WBDropdown, WBTabs, WBAccordion, WBSidebar
- Design token system (`tokens.css`) — surfaces, text, accent, semantic, spacing, radius, shadow, typography, z-index
- Dark mode support via `data-mode="dark|light|auto"`
- Zero dependencies — no npm, no build step required
