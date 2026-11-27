# WebBlocks UI AI Contract

Version: v2.40.1

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
- CSS output formatting must preserve complete function/declaration values (including whitespace), strings, URLs, selectors, rule order and license notices. Do not apply blanket whitespace removal or compact JavaScript through the CSS formatter.

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

Use `search.wb-filter-bar` for standalone search and filtering regions. Use
`form.wb-filter-bar` for filters that submit to a URL.

## Semantic Detail Lists And Tables

- Use native HTML first. `wb-detail-list` belongs on `dl`, `wb-detail-label` on `dt`, and `wb-detail-value` on `dd`. Each direct `div.wb-detail-row` groups one `dt` followed by one `dd`; the div does not replace either semantic element. Multiple paragraphs or values may live inside that `dd`.
- Three CSS-only presentations share that markup: default ruled horizontal; `wb-detail-list--borderless` horizontal without separators; `wb-detail-list--stacked` term above an inline-start-indented description without separators. Put the modifier on the same `dl` as `wb-detail-list`; select one presentation. Horizontal forms stack at 640 px. No JavaScript is required.
- Use description lists for term/description or independent name/value associations, including suitable metadata. Keep field/value table summaries (such as installation or assignment summaries), comparable records and column-based datasets in `table.wb-table`, using `th[scope="row"].wb-table-key` and `td` for key/value rows. Provide an accessible table name. Do not invent an `Actions` column for a read-only summary.
- A detail page does not automatically need a description list. Choose by information relationships, not two-column appearance, borders or page name. Do not turn a real table into a description list for sizing or styling.
- Legacy div/span-only detail lists retain their original v2 styling as deprecated compatibility support. Do not introduce or reproduce that anatomy in new or rewritten markup; migrate to semantic description lists or native tables when touching the host template. The three new presentations target native markup. CSS, ARIA roles and JavaScript do not repair semantics. Removing legacy support would require a future breaking release.

## Table Sorting

- Opt in with `table.wb-table[data-wb-table-sort="client|server"]`; sortable headers use `th[data-wb-sort="key"] > .wb-table-sort` with a native button, or a server-rendered link in server mode.
- Use `WBTableSort` for controls, icons, localized announcements, `aria-sort`, and client comparisons. Load the shipped `webblocks-icons.css` for the existing arrow masks; no icon runtime is needed. Do not copy sorting CSS/JS into downstream apps.
- Client mode requires a complete local dataset with one header row, one body, and no spanning cells. Use explicit `data-wb-sort-type` and raw cell `data-wb-sort-value` for formatted numbers/dates.
- Paginated/remote lists use server mode. Hosts own allowlisted queries, filters, full-dataset ordering before pagination, and the actual rendered sort state. A request does not change the current rows or `aria-sort`.
- AJAX hosts cancel `wb:table-sort:request` and call `WBTableSort.update` only after rendering a successful response; hosts own loading, race handling and inline errors. Destroy/reinitialize when replacing headers.
- Keep `Actions` and selection columns unsortable and retain the standard table/card/footer contract.

## Overlays And Feedback

- Use one shared `#wb-overlay-root.wb-overlay-root`.
- Use `wb-modal` for dialog and destructive confirmation flows.
- Do not use browser `confirm()` or `alert()` as product UI.
- Use `wb-toast` for transient success/info feedback.
- Use inline `wb-alert` for validation, blocking, persistent, and user-correctable errors.
- Do not create duplicate overlay roots, custom overlay stacks, or project-local modal systems when WebBlocks UI primitives fit.
- Modal/drawer focus excludes closed disclosure bodies, hidden/inert nodes, disabled controls and negative tabindex. Keep focus containment in the shared runtime; do not add a competing host trap.

## Native anchored overlays

- Existing dropdown/popover markup stays supported. Add `popover="manual"` to
  `wb-dropdown-menu` or `wb-popover-panel` to opt into native top-layer rendering.
  Keep the existing wrapper, hooks, classes, modifiers and public APIs.
- Native panels normally remain in source DOM, non-modal, with browser visibility mirrored
  by the shared manager. UI still owns positioning, ARIA, grouping, persistence,
  close guards and nested overlay cleanup. Do not add a parallel click handler.
- Prefer manual native state to retain all WebBlocks policies. `popover="auto"`
  browser hides are reconciled but cannot be canceled by WebBlocks guards; native
  closing beforetoggle is not cancelable. Persistent panels require manual state.
- Externally targeted native panels may temporarily join their invoker’s active
  native/focus scope; the manager restores their source parent after close.
- Optional matching popovertarget must not double-toggle. Direct native methods
  reconcile asynchronously after initialization; use existing WB hooks/APIs to
  initialize and position the panel. Native opening can be canceled cleanly.

## Native modal, drawer, and command palette roots

- Existing div roots remain supported. Native roots are `dialog.wb-modal` with
  the existing `wb-modal-dialog`, `dialog.wb-drawer` with direct header/body/footer,
  or `dialog.wb-cmd-backdrop` with the existing `wb-cmd-dialog`.
- Open through existing WBModal/WBDrawer/WBCommandPalette APIs or data hooks
  with WebBlocks loaded. The command palette also retains its keyboard shortcut.
  The shared manager owns `showModal`/`close`, native child layers and runtime
  state. Do not initialize with open/is-open, popover or a second controller.
- Give dialogs accessible names; do not add a duplicate dialog role/modality or
  root tabindex. Native backdrops, inertness and autofocus remain browser-owned.
- Retain close-request guards for Escape, outside, close/dismiss, native cancel
  and dialog-form submission. Direct native close is a programmatic bypass;
  its asynchronous close event reconciles shared state and lifecycle events.
- Compose menus, popovers, tooltips and feedback with the shipped APIs so they
  remain in the active native subtree. Do not access internal native layers.
- Native drawer roots omit the root slide transform to preserve unclipped child
  layers; legacy div drawers retain their original transitions.

## Interface copy

Use sentence case for headings, navigation, breadcrumb labels, controls and
table labels. Follow the locale's spelling rules and preserve product names,
acronyms and authored record titles. Short labels and brand taglines omit the
terminal period. Write the intended casing in the source text or translation.
Do not use CSS to uppercase or capitalize interface copy. Use the shared
breadcrumb component for the decorative slash and its spacing.

## Branding

Admin, auth, and sidebar product brand marks should follow `docs/admin-product-brand.md`: project-owned inline SVG components using `currentColor`, standard WebBlocks UI sizing classes, no default `img`/`picture`/CSS-mask shell marks, and separate favicon/app icon files.

## Browser page titles — approved 2026-11-26

- Product panels, workspaces, sign-in, password recovery and product-owned error screens use `{localized page title} - {product name}` with the literal ` - ` separator. Put distinguishing page information first and the canonical product name last, exactly once. With no page title, render the product name once. A standalone single-purpose tool may keep its descriptive product title when it has no separate screen.
- Reuse the localized visible page title and current breadcrumb, including record, edit-action and named-parent meaning: `Record type: Record name`, `Action + record type: Record name`, and `Edit profile: {name}` using the authenticated account's current name. Put a named parent before the record name when applicable. Keep the product suffix out of the heading and breadcrumb; preserve product-name text inside authored record titles.
- Use one product-owned server-side helper/layout boundary, escaped text and one `title` element. Do not add a global JavaScript title repair handler. Preserve normal framework title updates on existing dynamic screens without introducing a runtime.

## Product favicons and app icons — approved 2026-11-26

- Reuse each product's own approved recognizable mark as standalone files, separate from the inline `currentColor` shell component. Standalone SVG artwork must not depend on page CSS. Do not invent a new brand, force a squircle/container or bind icons to the user's accent.
- Keep an SVG favicon, 16 x 16 and 32 x 32 PNG fallbacks, a multi-size ICO with 16/32/48 px images, and a 180 x 180 Apple touch icon. Declare used assets explicitly in one shared product head partial/helper with appropriate media types and size metadata on panel, auth and product-owned error screens.
- Only an actual PWA/installable manifest needs 192 x 192, 512 x 512 and an appropriate maskable icon. Preserve existing PWA identity, scope and behavior; do not create a PWA for this rule.
- Version asset URLs when content changes, preferably with a content hash. Verify nonempty files, actual dimensions (including ICO frames), successful responses and media types; inspect the mark at 16 and 32 px in light and dark browser chrome. Keep product-specific contrast decisions.
- Keep package assets namespaced without overwriting the host's root favicon. Preserve configured public CMS site favicons, branding and SEO. Inventory retained files and manifest references; remove obsolete assets only after reference and installation/package-flow checks.

## Semantic interface icons — approved 2026-11-26

Shared concepts/actions use the same icon across products, sidebars, page links
and controls. Names below are the suffix after `wb-icon-`:

| Concept | Icon |
|---|---|
| Dashboard | `layout-dashboard` |
| Profile / users | `user-round` / `users` |
| Settings / security | `settings` / `shield-check` |
| Languages | `languages` |
| Pages / documents | `file-text` |
| Extensions | `plug` |
| History | `history` |
| View / edit / delete | `eye` / `pencil` / `trash` |
| Add / save | `plus` / `save` |
| Search / copy | `search` / `copy` |
| Refresh / check for updates | `refresh-cw` |
| Download / install an update | `download` |
| Open an external destination | `external-link` |

- Match the actual concept/action, not a similar label. Document product-specific domain concepts and justified exceptions in the product's focused UI contract. Headings need no icon; when present, match the corresponding navigation concept.
- Check literal and dynamically selected names against the exact pinned UI release's `packages/webblocks/dist/webblocks-icons.json` registry and `webblocks-icons.css`, together with that release's `dist/ai/contract.md`. Resolve shipped CSS aliases to their registered base glyphs; a fallback glyph is not proof of support. Do not guess names from another library or upgrade all UI pins for this rollout.
- Sidebar group icons are direct `i.wb-icon.wb-nav-group-icon` children of `wb-nav-group-toggle`. Every `a.wb-nav-group-item` has one meaningful decorative `i.wb-icon[aria-hidden="true"]` followed by a label span; use the item's icon or the group icon as fallback. Group, child and top-level sidebar icons are 18 x 18 px. Apply exactly 18 px inline-start padding once to the direct `wb-nav-group-items` container; no extra wrapper, child margin or second indent. For an older pin with different defaults, use only a sidebar-scoped product CSS adjustment, never a vendored-runtime patch. Preserve routes, current state, active-child expansion and UI ownership of open/closed state. Other controls retain shipped component/icon sizes, including mobile shell controls.
- Decorative icons beside text use `aria-hidden="true"`. Icon-only native buttons/links have a meaningful localized accessible action name. Preserve keyboard behavior and the existing tooltip contract; icons/color never replace required text or accessible state.
- Product logos, favicons, authored content illustrations and game artwork are separate from functional interface icons. No new icon library, runtime or plugin is authorized.

## Rollout boundaries for these three rules

These locally approved 2026-11-26 rules supplement an older pinned contract
that does not yet contain them; they do not authorize using unshipped APIs or
icons. Apply them only to product-owned web surfaces. Preserve public-site SEO,
editorial content titles, custom-site branding, CMS package/host ownership,
Craft's native control-panel shell, native-app identity and the separate game
interface system. Packages must not replace unrelated host titles or favicons.
Document each exception's owning surface, reason and retained behavior. Do not
migrate legacy frameworks, redesign unrelated UI, add general CSS/JS or patch
vendored runtimes. Report changed files, retained exceptions, validation and
missing browser checks. Commit, merge/main integration, push, version bump,
tag/release, publication, deployment, installation and consumer updates remain
separate operations requiring fresh operator approval after the change report
for this rollout.

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
- New or rewritten `wb-list` and `wb-link-list` collections use native `ul` or `ol` roots with direct `li` children. Use `ol` when order conveys meaning. Static rows may be `li.wb-list-item` or `li.wb-link-list-item`; interactive rows put a native link/button inside the `li`, retaining the row classes on that control. Legacy div/direct-link layouts remain compatible; do not reproduce them in new markup. Keep list headings outside the list, not as non-li children.
- Do not write project-local `list-style` rules to bring markers back. That is exactly what `wb-marker-list` exists for.

## Native Form Controls

- Bind visible settings-row headings to their controls with native `label[for]` and matching control IDs. Connect descriptions with `aria-describedby`; a nearby div/strong or generic enabled-state label does not name the setting.
- Group controls that share a question in `fieldset.wb-fieldset` with a first-child `legend` and `.wb-fieldset-body` around the individually labelled controls. Keep native choice names, states and disabled behavior. `wb-form-group` remains a general layout helper.
- Use `wb-file` on `input[type="file"]`, `wb-color` on `input[type="color"]`, and `wb-range` on `input[type="range"]`.
- These are native controls, not composite widgets. Preserve the matching HTML input type and browser behavior.
- Use their `-sm`, `-lg`, and `-error` variants where needed; keep labels, hints, and errors in the canonical `wb-field` contract.
- Hosts own accepted file types, size limits, values, validation, upload handling, and any live range-value output. Do not add project-local replacement styling when these primitives fit.

## Password Generation And Clipboard

- Use `data-wb-password-generate` with `data-wb-target` inside the standard `wb-input-group` contract. Use `data-wb-password-confirm` when one generated value should fill both password fields.
- Use the general `data-wb-copy` hook with `data-wb-target` for passwords, API keys, URLs, code, identifiers, and other copyable values. Do not create password-specific or product-specific Clipboard handlers.
- WebBlocks UI owns cryptographic generation, copy empty-state, Clipboard API feedback, localized live announcements, `WBPasswordToggle` synchronization, and repeat-safe initialization. Hosts still own password policy, validation, authorization, and submitted values.

## Navigation Groups

- Define a cascading dropdown with `button.wb-dropdown-item[data-wb-toggle="submenu"]` immediately followed by its `.wb-dropdown-menu` inside the parent panel. `WBDropdown` owns arrow indicators, hover and touch handling, positioning, keyboard navigation and focus return.
- Put `data-wb-nav-group` on the `.wb-nav-group` container. The existing
  div/button structure and native `details > summary` use the same
  `.wb-nav-group-toggle` and `.wb-nav-group-items` classes.
- Native state follows `open`. Keep the summary as the first child and let
  the browser expose its expanded state. Legacy groups use `is-open` and
  `aria-expanded` through the runtime.
- The runtime honors `data-wb-nav-group-open` and active items on initialization,
  handles mixed sibling accordion groups, and keeps the `WBNavGroup` API.
  Native lifecycle events follow the asynchronous, coalesced browser `toggle`.
- Do not invent a project-local toggle attribute or copy nav-group click handlers into downstream JavaScript.

## Accordion

- UI renders a CSS-only inline-end chevron on every heading, independent of host
  artwork. Remove manually supplied disclosure icons when upgrading. The
  indicator follows native/legacy state, RTL and reduced motion.
- Existing button/div accordion patterns remain supported. For native disclosure,
  use `details.wb-accordion-item > summary.wb-accordion-trigger` followed by one
  `wb-accordion-body`, optionally inside `wb-accordion-content`.
- Native `open` owns state; do not recreate it with `is-open`, `aria-expanded`,
  a button role, or a tabindex. Use a group-unique shared `name` for single-open
  behavior without JavaScript; omit it for independent disclosure.
- `WBAccordion` accepts native summary triggers. Native `wb:accordion:toggle`
  follows the browser's asynchronous, coalesced `toggle` event. The runtime's
  `data-wb-accordion-single="true"` also supports mixed groups and preserves
  nested accordion state. Hosts must not add a competing summary click handler.

## Collapse panels

- UI owns the inline-end chevron on every panel heading, as for accordion.
  Remove host-provided disclosure icons when upgrading; external buttons are unchanged.
- Existing div/button panels and standalone collapse remain supported. Native
  panels use `details.wb-collapse-panel > summary.wb-collapse-trigger` followed
  by one `wb-collapse-body`, optionally inside `wb-collapse`.
- Use native `open` for state; do not duplicate summary semantics with `is-open`,
  `aria-expanded`, a button role or tabindex. Native interaction and natural
  content height work without JavaScript.
- `WBCollapse.open/close/toggle(id)` and optional external `data-wb-collapse`
  controls target the details root id. External controls require the runtime;
  hosts render their initial ARIA state and UI synchronizes subsequent changes.
  Hosts must not install a competing summary click handler.

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
- `WBSlider` owns inactive-slide `inert`/focus suppression and moves focus to the root only when a transition would hide it. Preserve authored focus attributes; do not add a competing host focus manager. Call `WBSlider.update` after slide/control structure changes and `WBSlider.destroy` before unmounting.
- Autoplay pauses on focus entry until explicitly re-enabled through the existing autoplay option/update lifecycle. Hover and live reduced-motion pauses also apply to manual navigation and update; keep their timer/listener management in `WBSlider`.
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

## Bounded measurements

- Use native `meter.wb-meter` for a measurement within a known range, such as a poll share.
- Supply native `min`, `max` and `value`, an accessible name and visible localized value text.
- Preserve meter semantics; do not label measurements as task progress or add a progressbar role.
- UI owns the themed track and fill without JavaScript or inline CSS. Hosts own values, validation, formatting, aggregation and visibility.
- Keep the same scale for compared values. Multiple-choice poll options remain independent percentages.


## Task progress

- Prefer native `progress.wb-progress-bar` for new task-completion indicators.
  Use valid `max` and `value`; zero is measured zero, while an omitted `value`
  means indeterminate. Do not add `min` or a competing ARIA value state.
- Supply an accessible label and visible localized status text. Native progress
  needs no WebBlocks JavaScript or child `wb-progress-bar-fill`.
- Existing div/fill markup and width-based updates remain supported. The same
  color and thin/thick modifiers work with both structures. Native state follows
  `value`, not `wb-progress-bar-indeterminate`; hosts update the native value.
- Use `meter.wb-meter` for bounded measurements, and progress for work in flight.
