# WebBlocks UI AI Contract

Version: v2.26.4

This is the canonical downstream AI usage contract for WebBlocks UI. Downstream projects should reference the copy shipped with the pinned WebBlocks UI release.

## Source Priority

When a question requires deeper source inspection, use this priority order:

1. `packages/webblocks/src/`
2. `packages/webblocks/dist/`
3. `packages/webblocks/INTEGRATION.md`
4. `INTEGRATION.md`
5. `PATTERNS.md`
6. `PRIMITIVES.md`
7. `docs/`
8. `ai/`

`INTEGRATION.md` is the implementation-accurate integration reference. This contract is the downstream AI summary of the rules; it does not replace shipped source or integration docs.

## Required Pattern-First Behavior

- Keep canonical build and validation tooling dependency-free. Do not introduce Node, npm, Playwright, or another package runtime without explicit project-owner approval.

- Start from the shipped pattern that matches the screen before composing primitives.
- Use `wb-dashboard-shell` for admin and dashboard screens.
- Use `wb-auth-shell` for authentication screens.
- Use `wb-settings-shell` for settings and account screens.
- Use `wb-content-shell` for editorial, documentation, or content-heavy public pages when it fits.
- Use `wb-slider` for media/content carousel sections such as hero sliders, split sections, and contained sliders.
- Use `wb-card` as the only generic framed content surface.
- Compose layout with shipped helpers such as `wb-stack`, `wb-cluster`, `wb-split`, `wb-grid`, and `wb-grid-auto` before adding project-specific CSS.

## Admin List Contract

Admin index and list screens must use the canonical table/action structure:

- page-level `wb-page-header`
- filters before the list card when filters exist
- `section.wb-card`
- `.wb-card-body`
- `.wb-table-wrap`
- `table.wb-table`
- explicit `Actions` header
- `td.wb-table-actions`
- `.wb-action-group` for grouped row actions
- pagination or result summaries in `.wb-card-footer`

Row actions should be compact, icon-first where appropriate, and accessible through `aria-label` and preferably `title`.

For tabular key/value or key/value/context rows, apply `wb-table-key` to the key
`th`. It sizes that column from its intrinsic label width, keeps the key intact,
and lets `wb-table-wrap` handle overflow. Do not replace semantic table markup
with a description list merely to reproduce this column layout.

Labelled filter forms use `wb-filter-bar--fields` with one `wb-filter-bar-fields` flow. Use direct `wb-field` children, optional `wb-filter-bar-search`, and `wb-filter-bar-actions > .wb-action-group`. Do not combine these fields with `wb-stack` or gap utilities; UI owns field alignment, row separation, and intrinsic-width actions that wrap together only when needed.

## Overlays And Feedback

- Use one shared `#wb-overlay-root.wb-overlay-root`.
- Use `wb-modal` for dialog and destructive confirmation flows.
- Do not use browser `confirm()` or `alert()` as product UI.
- Use `wb-toast` for transient success/info feedback.
- Use inline `wb-alert` for validation, blocking, persistent, and user-correctable errors.
- Do not create duplicate overlay roots, custom overlay stacks, or project-local modal systems when WebBlocks UI primitives fit.

## Branding

Admin, auth, and sidebar product brand marks should follow `docs/admin-product-brand.md`: project-owned inline SVG components using `currentColor`, standard WebBlocks UI sizing classes, no default `img`/`picture`/CSS-mask shell marks, and separate favicon/app icon files.

## Topbar Menus

- Use `wb-theme-switcher` for preset/accent selection. Its trigger uses `wb-theme-switcher-trigger` with the complete palette-icon + chevron anatomy; hosts provide menu labels and choices, not project-local trigger styling.
- Use `wb-language-switcher` for locale selection and choose one explicit trigger variant: `--code` (recommended default: code + chevron), `--icon` (icon only, the one variant without a chevron), or `--icon-code`.
- Give every language menu item the same anatomy in every variant: a `wb-language-switcher-item-code` code span followed by the language's own name. Code-only and name-only items are non-conforming.
- Use `wb-auth-entry` for guest login entry and choose `--icon`, `--label`, or `--icon-label`.
- Use `wb-user-menu` for authenticated account actions and choose `--full`, `--compact`, or `--avatar`; add `--responsive` when it should collapse on narrow screens.
- Render `wb-auth-entry` and `wb-user-menu` as mutually exclusive auth states; the host decides which state applies.
- Reuse the shipped `wb-dropdown` runtime. Do not add project-local language/user dropdown JavaScript when the canonical composition fits.
- Hosts own locale URLs and labels, current-language state, guest/authenticated state, login URLs, user identity, authorization, conditional items, CSRF, and POST logout behavior.
- Language code casing is content-defined; do not generate it with CSS text transformation.

## Lists

- The reset drops markers on every `ul`/`ol` so structural lists — nav, breadcrumb, pagination, tabs, `wb-inline-list` — do not each have to opt out. Marker-bearing lists opt back in explicitly.
- Use `wb-rich-text` for rendered editor output; its lists already carry markers and need no extra class.
- Use `wb-marker-list` on the `ul` or `ol` itself for hand-authored bullet or numbered prose lists outside a rich-text wrapper. Nested lists inherit it; do not repeat it on a child list.
- `wb-list` is the framed list-group surface built from `wb-list-item` rows. It is not a marker list and never restores bullets.
- Do not write project-local `list-style` rules to bring markers back. That is exactly what `wb-marker-list` exists for.

## Navigation Groups

- Put `data-wb-nav-group` on the `.wb-nav-group` container. The toggle is a `.wb-nav-group-toggle` button and the children live in `.wb-nav-group-items`.
- Use `data-wb-nav-group-open` for an explicit initial open state; a group containing an `.is-active` item also opens automatically.
- WebBlocks UI owns toggling, `is-open`, `aria-expanded`, accordion behavior, lifecycle events, and the `WBNavGroup` API.
- Do not invent a project-local toggle attribute or copy nav-group click handlers into downstream JavaScript.

## Tabs

- Pair each `.wb-tabs-btn[data-wb-tab="panel-id"]` with a `.wb-tabs-panel#panel-id` inside the same `.wb-tabs` container.
- The host owns only the initial active tab. It may render inactive panels with `hidden` and `aria-hidden="true"` for first paint; WebBlocks UI removes and reapplies those states as tabs change.
- WebBlocks UI owns `is-active`, `hidden`, `aria-hidden`, `aria-selected`, `tabindex`, keyboard navigation, and `wb:tabs:change` after initialization.
- Do not add project-local panel visibility synchronization. Listen to `wb:tabs:change` only for domain state such as mirroring the active tab into a server field; prefer `data-wb-tabs-field` for that common case.

## Forbidden Patterns

Do not introduce these in new downstream work:

- `wb-panel` or `wb-box` as generic framed surfaces
- `ul.wb-list` or `ol.wb-list` used to restore list markers; `wb-list` is the framed list-group surface and `wb-marker-list` is the marker list
- project-local replacements for `wb-dashboard-shell`, `wb-auth-shell`, or `wb-settings-shell`
- project-specific admin table wrappers that replace `section.wb-card > .wb-card-body > .wb-table-wrap`
- duplicated modal roots
- browser `confirm()` or `alert()` for product UI
- Tailwind, Vite, React, Vue, Inertia, Livewire, or another UI layer to replace WebBlocks UI surfaces
- custom CSS or JavaScript before shipped WebBlocks UI composition is proven insufficient

## Public Media Patterns

- Use the opt-in `wb-background-media` primitive when an existing semantic root needs host-owned background media. Supply the safe image URL and position through `--wb-background-media-image` and `--wb-background-media-position`, then choose no modifier for the soft default overlay or add `wb-background-media--overlay-none`, `wb-background-media--overlay-medium`, or `wb-background-media--overlay-strong`. The host owns media selection, URL safety, and accessible content; the background image remains decorative.
- Use `wb-gallery` for equal-tile inline image collections and shared modal viewing.
- Use `wb-slider` for track-based media/content carousel sections.
- Keep slider anatomy explicit: `.wb-slider > .wb-slider-viewport > .wb-slider-track > .wb-slide`, with optional `.wb-slide-media`, `.wb-slide-content`, `.wb-slider-controls`, and `.wb-slider-dots`.
- Prefer real `img` or `picture` elements with `wb-slide-media`; coverage is handled by shipped `object-fit: cover` CSS.
- Do not replace `WBSlider` with project-local carousel JavaScript unless the shipped behavior is proven insufficient.

## Review Checklist

Before finishing downstream UI work, verify:

- the screen starts from the correct shell
- generic framed surfaces use `wb-card`
- forms use shipped field/input/button primitives
- admin tables follow the table/action contract
- destructive actions use WebBlocks modal confirmation
- feedback uses `wb-toast` or `wb-alert` according to persistence and severity
- custom CSS/JS is narrow and justified
- no forbidden vocabulary or framework UI layer was introduced

## Charts

- Use `.wb-chart[data-wb-chart="line"]` or `data-wb-chart="bar"` with a semantic source table.
- UI owns SVG rendering, scales, readouts, keyboard behavior and container resizing.
- Hosts own data, localized labels, authorization, aggregation and any `wb-modal` containing the value table.
- An empty `data-wb-chart-value` means missing; zero means measured zero. Never infer or fill missing records in UI.
- Keep tables accessible, use `WBChart.update` after host changes, and `WBChart.destroy` before unmounting.
- Do not copy the renderer into a downstream app or introduce a second chart library.
