# Changelog

All notable changes to WebBlocks UI are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

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
- Add missing `webblocks-icons.css` link to `examples/website/contact.html`
- Fix dead `forgot-password.html` link in `examples/auth/login.html` (changed to `#`)
- Fix typo `wb-icon-bar-chart3` → `wb-icon-bar-chart-3` in `examples/admin/dashboard.html`

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
- Full V2 component set: Drawer, Command Palette, Popover, Tooltip, Divider, List Group, Nav Group, Filter Bar, Action Menu, Loading/Spinner, Confirmation Dialog
- V2 layouts: Settings Shell, Content Shell
- Multi-axis theme engine: `data-mode`, `data-accent`, `data-preset`, `data-radius`, `data-density`, `data-shadow`, `data-font`, `data-border`
- 8 accent color themes: `ocean`, `forest`, `sunset`, `royal`, `mint`, `amber`, `rose`, `slate-fire`
- 5 named presets: `modern`, `minimal`, `rounded`, `bold`, `editorial`
- Bootstrap-style `<i>` tag icon support via `dist/webblocks-icons.css` (120 Lucide icons, mask-image technique)
- SVG sprite `dist/webblocks-icons.svg` with 120 Lucide icons
- `WBDrawer` JS module — focus trap, keyboard (Escape), `is-leaving` animation pattern
- `WBCommandPalette` JS module — Cmd/Ctrl+K, arrow navigation, search callback API
- `WBNavGroup` JS module — accordion-aware collapsible sidebar groups
- `WBTheme` JS module — `setMode()`, `setAccent()`, `setPreset()`, `setRadius()`, `setDensity()`
- Toast position modifier classes: `wb-toast-top-right`, `wb-toast-top-center`, `wb-toast-top-left`, `wb-toast-bottom-center`, `wb-toast-bottom-left`
- `wb-confirm` confirmation dialog variant (inside `modal.css`)
- `wb-stat` stats card component (inside `card.css`)
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
- Initial release — V1 core component set
- Components: Button, Badge, Card, Alert, Form, Table, Modal, Dropdown, Tabs, Accordion, Pagination, Breadcrumb, Avatar, Toast, Skeleton, Empty State
- Layouts: Dashboard Shell, Auth Shell, Navbar, Sidebar, Container
- JS modules: WBModal, WBDropdown, WBTabs, WBAccordion, WBSidebar
- Design token system (`tokens.css`) — surfaces, text, accent, semantic, spacing, radius, shadow, typography, z-index
- Dark mode support via `data-mode="dark|light|auto"`
- Zero dependencies — no npm, no build step required
