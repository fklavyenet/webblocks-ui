# Downstream UI Review Checklist

Use this checklist after downstream UI changes that use WebBlocks UI.

## Shell

- [ ] Admin and dashboard screens use `wb-dashboard-shell`.
- [ ] Auth screens use `wb-auth-shell`.
- [ ] Settings screens use `wb-settings-shell`.
- [ ] No project-local shell wrapper duplicates a shipped shell pattern.

## Surfaces

- [ ] Generic framed content uses `wb-card`.
- [ ] No new generic `wb-panel`, `wb-box`, or project-local framed surface appears.
- [ ] Card header, body, and footer roles are clear and not over-wrapped.

## Tables

- [ ] Admin lists start with a page-level `wb-page-header`.
- [ ] Filters appear before the list card.
- [ ] Submitted filters use localized Filter and Reset labels. Reset restores defaults within the current scope and appears when it changes filter or controlled sort state. Live search uses the input’s built-in clear control.
- [ ] Tables live in `section.wb-card > .wb-card-body > .wb-table-wrap`.
- [ ] Action columns have an explicit `Actions` header.
- [ ] Row actions use `td.wb-table-actions` and `.wb-action-group`.
- [ ] Pagination lives in `.wb-card-footer`.
- [ ] Compact key columns use `th.wb-table-key` without replacing semantic table markup.
- [ ] Sorting uses `WBTableSort` with explicit client/server mode; paginated data is sorted by the server before pagination, and AJAX sort state is committed only after successful data rendering.

## Detail Lists

- [ ] New and rewritten `wb-detail-list` roots are `dl` elements; each direct `wb-detail-row` groups a native `dt.wb-detail-label` followed by `dd.wb-detail-value`. No new div/span substitutes, fake ARIA semantics or JavaScript repair exists.
- [ ] The root uses the default ruled horizontal, `wb-detail-list--borderless` horizontal, or `wb-detail-list--stacked` indented presentation; all preserve native semantics without JavaScript.
- [ ] Field/value table summaries and comparable records retain native table markup with row headers and an accessible table name. Read-only summaries have no invented `Actions` column. The page name or visual columns did not decide the element.
- [ ] Long terms, multi-paragraph descriptions, machine strings, nested lists, light/dark themes, 640 px stacking, narrow layouts and logical RTL indentation remain readable. Unrelated `dl` elements are unaffected.
- [ ] Old div/span-only consumers retain their original v2 layout and typography as deprecated compatibility support. Migrate them when rewriting templates; do not require an immediate migration or remove support in a compatible release.

## Forms

- [ ] Settings-row controls have native labels matching their visible setting headings; help text is connected with `aria-describedby`.
- [ ] Forms use shipped field and input primitives.
- [ ] Native file, color, and range inputs use `wb-file`, `wb-color`, and `wb-range` with the matching HTML input type.
- [ ] Submit actions stay in the owning form or card footer.
- [ ] Validation feedback appears near the field, form, card, or section it belongs to.
- [ ] Password generation uses `data-wb-password-generate`, copying uses the general `data-wb-copy` hook, feedback is localized, and no page-local random or Clipboard handler exists.

## Overlays

- [ ] Confirmations use `wb-modal`, not browser `confirm()`.
- [ ] The page uses one shared `#wb-overlay-root`.
- [ ] No custom overlay stack or duplicated modal root was introduced.

## Feedback

- [ ] Operation results that need to stay visible, validation, blocking and user-correctable errors, and persistent warnings use inline `wb-alert`.
- [ ] Acknowledgements that can expire may use `wb-toast`.
- [ ] Toasts do not block page interaction or behave like modals.

## Branding

- [ ] Admin, auth, and sidebar brand marks follow `docs/admin-product-brand.md`.
- [ ] Brand marks are project-owned inline SVG using `currentColor`.
- [ ] Brand mark markup avoids default `img`, `picture`, CSS-mask shells, and width/height attributes.

## Browser page titles — approved 2026-11-26

- [ ] Panel, workspace, sign-in, password recovery and product-owned error titles use `{localized page title} - {product name}` with literal ` - `, one final product suffix, or just the product name when the page title is empty.
- [ ] The localized heading and current breadcrumb share the page/record/edit-action/named-parent meaning; profile editing uses the authenticated account's current name. Visible headings/breadcrumbs omit the product suffix; authored record titles retain their text.
- [ ] One product-owned server-side helper/layout emits escaped text and one `title`; existing dynamic framework updates remain intact without a global JavaScript repair handler.

## Product favicons and app icons — approved 2026-11-26

- [ ] Standalone files reuse the approved product mark, separate from inline `currentColor` shell SVGs; favicon SVGs work without page CSS. No rebrand, forced container/squircle or user-accent binding was introduced.
- [ ] The retained set includes SVG, PNG 16/32, ICO frames 16/32/48, and Apple 180. Only an actual PWA/installable manifest adds 192/512 and an appropriate maskable icon, preserving its identity, scope and behavior.
- [ ] A shared product head explicitly declares assets with correct media types/size metadata on panel, auth and product-owned error screens; URLs change with content, preferably by hash.
- [ ] Files are nonempty, actual dimensions/ICO frames and successful responses/media types were checked, and 16/32 px marks were inspected in light/dark browser chrome with product contrast preserved.
- [ ] Retained files and manifest references are inventoried. Obsolete assets are removed only after reference and installation/package-flow checks; package assets stay namespaced and host root/public CMS site favicons remain intact.

## Semantic interface icons — approved 2026-11-26

- [ ] Shared concepts/actions match the AI contract's dictionary across navigation, page links and controls; domain concepts and justified exceptions are documented in the product's focused UI contract.
- [ ] Literal and dynamic icon names were checked against the actual pinned release's AI contract, icon registry and shipped icon CSS, resolving CSS aliases to registered base glyphs; fallback glyphs were not accepted as evidence. No blanket pin upgrade, new icon library/runtime/plugin or vendored patch was introduced.
- [ ] Sidebar groups use direct `i.wb-icon.wb-nav-group-icon` elements and each child link has one meaningful decorative icon then a label span. Group, child and top-level icons are 18 x 18 px; the direct items container applies exactly 18 px inline-start padding once without extra wrappers/margins/indent. Older-pin adjustments are sidebar-scoped; routes, current state, active-child expansion and shared runtime state ownership remain intact.
- [ ] Other controls retain shipped sizes, including mobile shell controls. Headings need no icon; an optional heading icon matches its navigation concept.
- [ ] Decorative icons use `aria-hidden="true"`; icon-only native controls have localized accessible action names. Keyboard behavior/tooltips, required text and accessible states remain intact.

## Rollout boundaries for these three rules

- [ ] The local 2026-11-26 approval supplements older pinned contracts without requiring unshipped icons/APIs. Public SEO/editorial titles, custom-site branding, CMS package/host ownership, Craft native control-panel shell, native-app identity and the separate game interface system are preserved. Standalone single-purpose tools may retain descriptive product titles where no separate screen exists.
- [ ] Each exception records its owning surface, reason and retained behavior. Product logos, favicons and authored illustrations remain separate from functional icons; unrelated host screens are untouched.
- [ ] No framework migration, unrelated redesign or new general CSS/JS was introduced. The change report lists files, retained exceptions, validation and missing browser checks.
- [ ] Commit, merge/main integration, push, version bump, tag/release, publication, deployment, installation and consumer updates wait for fresh operator approval after this rollout's change report.

## Custom CSS/JS

- [ ] Preset/accent dropdowns use the shipped `wb-theme-switcher` palette-icon + chevron trigger.
- [ ] Custom CSS/JS was added only after shipped composition proved insufficient.
- [ ] Any custom CSS/JS has a narrow role and does not create a parallel UI layer.
- [ ] Navigation groups use `data-wb-nav-group` on the container and do not duplicate the shipped toggle behavior.
- [ ] Tabs pair controls and panels by id, and no project JavaScript duplicates panel visibility or accessibility state.
- [ ] No Tailwind, Vite, React, Vue, Inertia, or Livewire UI layer was introduced for WebBlocks UI surfaces.

## Tests

- [ ] New or rewritten `wb-list` and `wb-link-list` collections use `ul`/`ol` with direct `li` children; interactive rows retain native buttons/links, separators and full-height card layout. Existing div/direct-link consumers remain compatible.
- [ ] Canonical build and validation commands do not require Node, npm, Playwright, or another downloaded runtime.
- [ ] Existing downstream tests or smoke checks still pass.
- [ ] UI changes were reviewed for shell, table, overlay, feedback, and responsive behavior.
- [ ] If no tests exist, the remaining risk is stated clearly in the final response.

## Bounded measurements

- [ ] Bounded measurements use native `meter.wb-meter` with valid values, accessible names and visible localized value text.
- [ ] Zero/full values, long labels, light/dark modes and narrow layouts remain legible without JavaScript.

## Native disclosure and progress

- [ ] Native accordion/collapse use browser-owned open state and UI-owned chevrons; host markup does not add a second disclosure indicator.
- [ ] Modal/drawer keyboard tests include closed disclosure bodies and dynamic focus candidates in both Tab directions.
- [ ] Task progress uses labelled native progress with value/max, or the supported legacy div/fill pattern; unknown work omits the native value.


## Native dialog roots

- [ ] Native modal, drawer, and command palette roots open through the shared manager, use showModal, have accessible names and no authored open/is-open/root tabindex.
- [ ] Native cancel and dialog-form guards, direct close cleanup, returnValue, reopen races and body-lock/focus restoration work with source and dist.
- [ ] Native/legacy nesting and anchored menus, tooltips and feedback stay visible and interactive in the native modal subtree.


## Native anchored overlays

- [ ] Legacy/native dropdown and popover use the same public APIs, placement and accessible controls.
- [ ] Manual native panels retain guards, persistence and group policy; auto-state limitations are documented.
- [ ] Native toggles, canceled opening, invoker default prevention, fast reopen and lifecycle/ARIA reconciliation work in source and dist.
- [ ] Native/legacy nesting, modal/drawer hosts, viewport bounds and wide dropdown scrolling remain interactive and visible.


## Semantic statistics and command palette focus

- [ ] New statistic cards use native `dl/dt/dd`; a delta stays with its value in
  the same `dd`, and legacy cards retain their layout.
- [ ] Related radio controls use `fieldset.wb-fieldset` and `legend`. Controls
  have their own labels, and input-group labels do not contain div wrappers.
- [ ] Command results retain native links/buttons inside semantic lists. Arrow,
  Tab and click focus agree with the visual selection; disabled/hidden commands
  are skipped and Enter/Space retain native activation.
- [ ] Search clears selection and filters whole list rows; async replacement
  restores focus to search before removing a focused result. Native/legacy
  roots, custom HTML and nested dialogs are covered with source and dist.

## Opt-in card media

- [ ] Legacy card/media markup retains its original computed styles and aspect-auto limits.
- [ ] New frames support direct images, image links and picture sources; captions remain outside the cropped viewport. Overlay content sits inside the viewport, outside any image link.
- [ ] Horizontal and overlay cards work as direct children of shipped grids, keep captions visible, and do not overflow with long content. Horizontal start/end stack media first at 640 px and follow RTL direction.
- [ ] Whole-card links contain no nested media links or viewer controls. Missing/hidden media preserves the card content.

## WebBlocks Action Feedback

- [ ] Product-owned actions use the released `WBActionFeedback` registry with localized labels, explicit scopes/exclusions and no copied generic JS/Blade feedback mechanism.
- [ ] Validation/cancellation, double click/Enter, successful-control and file/submitter payloads, external controls, original disabled/ARIA states, icon dimensions and source/dist are verified.
- [ ] Native/legacy overlay close guards, connected live status outside busy subtrees, appropriate async cleanup, independent surfaces and BFCache behavior are verified.
- [ ] Update checks stay in scope with persistent inline results; detailed update modals retain stages, elapsed time, logs/results and recovery without a second generic progress UI.
- [ ] GET filters, alternate targets and downloads retain native behavior; acceptance or disconnection never means queued-job completion. No timer unlock, automatic mutation retry or bypass of server guards.
