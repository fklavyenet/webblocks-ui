# Changelog

All notable changes to WebBlocks UI are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- Icon System v1: curated expansion for editorial, marketing, business, and social brand usage
- New high-value icons: `external-link`, `eye`, `eye-off`, `star`, `bookmark`, `heart`, `share2`, `book-open`, `newspaper`, `map-pin`, `briefcase`, `building2`, `linkedin`, `twitter`, `instagram`, `youtube`
- Action icon aliases for panel workflows: `refresh` and `sync`, mapped to the existing `rotate-cw` and `repeat` glyphs with stable public names
- Breadcrumb preset system: `minimal`, `surface`, `bordered`, `inline`, and `context`, with controlled separator modifiers and single-item context support

### Changed
- Icon set refreshed to 173 curated Lucide icons for CSS mask-image delivery
- Icon reference docs updated to use the `wb-icon-*` symbol/class convention consistently
- Icon reference docs now explain the semantic split between refresh, sync, retry, and rotate actions
- Page/header guidance now treats breadcrumb as secondary context, keeps page title primary, and formalizes product-first topbar identity hierarchy
- Page title naming is now context-specific: use `wb-page-header-title` for dashboard page headers and `wb-page-intro-title` for intro/masthead headings
- `wb-card` is now the single canonical framed surface noun across the system, including dashboard work areas
- `wb-field-meta` is now the only valid assistive-content path for field hints and errors; docs/examples were normalized and row-aligned forms keep reserved meta space only where alignment is needed
- tables now follow a single-surface model: `wb-table-wrap` owns radius/border/clipping, inner toolbars stay control rows, and header cells no longer create competing surface corners or bands
- automatic uppercase casing was removed from shipped UI primitives and patterns so emphasis stays locale-safe and content-defined

### Removed
- Breaking simplification: removed the old dashboard-only framed-surface family and converged all framed dashboard surfaces on `wb-card`, `wb-card-header`, `wb-card-title`, `wb-card-body`, and `wb-card-footer`
- removed the `wb-uppercase` and `wb-capitalize` text-transform utilities from shipped CSS

### Fixed
- CSS icon mappings are now generated from the source icon set so `<i class="wb-icon wb-icon-*"></i>` stays stable across rebuilds
- Added refresh icon CSS aliases for `wb-icon-refresh-cw`, `wb-icon-refresh`, and `wb-icon-rotate-cw`, mapped to the existing `wb-icon-rotate-cw` glyph for downstream compatibility
- Added a default `help-circle` mask fallback for `<i class="wb-icon ..."></i>` so unknown or missing `wb-icon-*` classes do not render as empty squares

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
