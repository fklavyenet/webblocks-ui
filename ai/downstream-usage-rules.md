# Downstream Usage Rules

These rules apply to CMS, QuizTem, Herne Panel, Publisher, Plugins, Workbench, and other downstream projects that consume WebBlocks UI.

## Shells

Use the shipped shell that matches the screen:

* Admin and dashboard screens: `wb-dashboard-shell`
* Auth screens: `wb-auth-shell`
* Settings screens: `wb-settings-shell`

Do not create project-local shell wrappers when a shipped shell pattern fits.

## Surfaces

Use `wb-card` as the only generic framed surface.

Do not use `wb-panel`, `wb-box`, or project-local framed wrappers as generic content containers in new work.

## Admin Index Lists

Use the canonical admin list structure:

```html
<div class="wb-page-header">...</div>

<!-- Filters come before the list card. -->
<form class="wb-filter-bar">...</form>

<section class="wb-card">
  <div class="wb-card-body">
    <div class="wb-table-wrap">
      <table class="wb-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Example</td>
            <td><span class="wb-badge">Active</span></td>
            <td class="wb-table-actions">
              <div class="wb-action-group">...</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="wb-card-footer">...</div>
</section>
```

Required pieces:

* page-level `wb-page-header`
* filters before the list card
* `section.wb-card`
* `.wb-card-body`
* `.wb-table-wrap`
* explicit `Actions` table header
* `td.wb-table-actions`
* `.wb-action-group`
* pagination inside `.wb-card-footer`

For a compact key column in a semantic table, add `wb-table-key` to each key
`th`. It is content-sized rather than percentage-sized. Keep genuine tabular
data in `table` markup; do not switch to `dl` only for visual column sizing.

For sorting, opt in with `data-wb-table-sort="client|server"` on `wb-table` and
use `th[data-wb-sort="key"] > .wb-table-sort`. Use `WBTableSort` instead of local
header handlers. Server mode is required for paginated/remote datasets; hosts
allowlist query keys, sort before pagination, and commit AJAX state with `update`
only after successful rendering. Keep action/selection columns unsortable. See
the package integration guide for raw values, localization and lifecycle rules.

Admin filter bar actions:

* use canonical English labels `Filter` and `Clear`
* render `Clear` only when filters are active
* use normal `wb-btn` sizing for filter action buttons; do not use `wb-btn-sm`
* for labelled filters, use `wb-filter-bar wb-filter-bar--fields` and a single `wb-filter-bar-fields` flow; put each control in `wb-field`, search in `wb-field wb-filter-bar-search`, and an action group in `wb-filter-bar-actions`
* do not mix `wb-stack` or gap utilities into labelled filter fields; the component owns label spacing, row separation, wrapping, and intrinsic-width, end-aligned actions that stay inline when space permits
* do not use `Apply`, `Apply Filters`, `Reset`, or `Clear filters` on new WebBlocks admin filter surfaces
* do not add project-specific filter alignment CSS
* keep row actions and compact toolbar icon buttons under their separate action standards

## Semantic Detail Lists And Tables

Use `dl.wb-detail-list` for term/description or independent name/value
associations. Each direct `div.wb-detail-row` contains one `dt.wb-detail-label`
followed by one `dd.wb-detail-value`. A grouping div is allowed; new or rewritten
markup must not substitute div/span roots, terms or descriptions. Keep multi-paragraph or multiple-value content
inside the same `dd`. Do not add ARIA roles to imitate native semantics.

The default is ruled horizontal. Add `wb-detail-list--borderless` to that `dl`
for horizontal without separators, or `wb-detail-list--stacked` for a term above
an indented description without separators. Choose one presentation. Horizontal
forms stack at 640 px; indentation follows the writing direction. No local
CSS or JavaScript is needed. Use `wb-detail-value-mono` only on an appropriate `dd`.

Use `table.wb-table` inside `wb-table-wrap` for field/value table summaries,
including installation and assignment summaries, and for comparable records or
column-based datasets. Key cells use `th scope="row" class="wb-table-key"`;
values use `td`. Give the table an accessible name; omit an `Actions` column
when there are no row actions. Metadata can also be expressed as a description
list when its relationships suit one: page type, two-column layout and borders
alone never determine semantics.

Existing div/span-only detail lists remain styled with their original v2
geometry, typography, separators and mobile stacking as deprecated compatibility
support. No immediate migration is required for a v2 upgrade. Migrate to
`dl`/`dt`/`dd`, or native table markup for tabular summaries, when rewriting the
template. The three new presentations target native markup; legacy markup
retains its historical presentation. Do not patch a vendored stylesheet or add
an ARIA/JavaScript repair. Removal would require a future breaking release.

## Native Lists

Use `ul.wb-list` or `ul.wb-link-list` for unordered collections, and `ol` when
order conveys meaning. Keep direct children as `li`. Static entries may carry
the row class on the `li`; interactive entries wrap a native link/button in
`li` and retain the row classes on the control. Keep list headings outside the
list. Preserve link-list media, stacked, cards and wide-thumbnail modifiers.
Legacy div/direct-link layouts remain supported for compatibility; do not
introduce that anatomy in new or rewritten markup.

## Forms

Settings-row headings label their native controls through `label[for]` and
matching IDs. Connect descriptions with `aria-describedby`; generic enabled
state text must not replace the setting's accessible name.

Use shipped field, input, select, textarea, checkbox/radio, button, card, and layout primitives. Put page-level submit actions in the owning form or card footer, not in the page header.

Use `wb-file`, `wb-color`, and `wb-range` for native file, color, and range inputs. Preserve the corresponding HTML `type`; do not replace these controls with project-local wrappers or JavaScript merely to restyle them.

Password generation stays in the standard `wb-input-group` contract. Use `data-wb-password-generate` with `data-wb-target`, and use `data-wb-password-confirm` when generation should fill a confirmation field. For passwords and every other copyable value, use the general `data-wb-copy` hook with `data-wb-target`. Localize the shipped live feedback attributes instead of adding page-local Clipboard or random-password handlers.

## Overlays

Use `wb-modal` for modal confirmation flows. Do not use browser `confirm()`.

Use one shared overlay root:

```html
<div id="wb-overlay-root" class="wb-overlay-root"></div>
```

Do not duplicate modal roots or create project-local overlay stacks.
For persistent non-modal support panels, use `wb-popover` with
`data-wb-popover-persistent`; use `WBPopover.update` after content resizing.
Do not call the internal `WBDom.overlay` API from downstream applications.

## Feedback

Use `wb-toast` for transient success and info feedback. Toasts should live outside normal layout flow, preferably under `#wb-overlay-root`.

Use inline `wb-alert` for validation errors, blocking failures, persistent warnings, and user-correctable errors.

## Branding

Admin, auth, and sidebar brand marks should follow the shipped admin product brand standard. Prefer project-owned inline SVG components using `currentColor`, WebBlocks sizing classes, and separate favicon/app icon files.

## Browser page titles — approved 2026-11-26

Product panels, workspaces, sign-in, password recovery and product-owned error
screens use `{localized page title} - {product name}` with the literal ` - `
separator. Reuse the localized heading/current breadcrumb's page, record,
edit-action and named-parent meaning. Append the canonical product name once;
with no page title, use only that name. Do not add the suffix to visible headings
or breadcrumbs or strip product-name text from authored record titles. Profile
editing uses `Edit profile: {name}` with the authenticated account's current name.
A standalone single-purpose tool may keep its descriptive product title when
there is no separate screen.

Use one product-owned server-side helper/layout boundary with escaped text and
one `title` element. Preserve existing framework title updates for dynamic
screens; do not introduce a runtime or global JavaScript repair handler.

## Product favicons and app icons — approved 2026-11-26

Keep standalone files using the product's existing approved recognizable mark:
SVG, 16 x 16 and 32 x 32 PNG, a multi-size ICO with 16/32/48 px images, and a
180 x 180 Apple touch icon. These are separate from inline `currentColor` shell
marks; the SVG file must work without page CSS. Use one explicit shared product
head partial/helper on panel, auth and product-owned error screens, with media
types, size metadata and content-versioned URLs (prefer a content hash).

Only an actual PWA/installable manifest needs 192 x 192, 512 x 512 and an
appropriate maskable icon. Preserve its identity, scope and behavior. Do not
create a PWA, invent a brand, force a squircle/container or follow user accents.
Check nonempty files, dimensions including ICO frames, asset responses/media
types, and 16/32 px legibility in light/dark browser chrome. Preserve product
contrast choices. Inventory retained files and manifest references; remove
obsolete assets only after reference and installation/package-flow checks.
Keep package assets namespaced and preserve host root and configured public
CMS site favicons, branding and SEO. See the
[brand asset contract](../docs/admin-product-brand.md#favicon-and-app-icons).

## Semantic interface icons — approved 2026-11-26

Use the [shared concept/action dictionary](contract.md#semantic-interface-icons--approved-2026-11-26)
for navigation, page links and controls across products. Document domain
concepts and justified exceptions in the product's focused UI contract. Check
literal and dynamic icon names against the actual pinned release's AI contract,
`packages/webblocks/dist/webblocks-icons.json` and shipped `webblocks-icons.css`,
resolving shipped CSS aliases to registered base glyphs; a rendered fallback
does not prove support. Do not guess
names from another library or update every UI pin for this rollout.

Sidebar group icons are direct `i.wb-icon.wb-nav-group-icon` children of
`wb-nav-group-toggle`. Every `a.wb-nav-group-item` has one meaningful decorative
`i.wb-icon[aria-hidden="true"]` followed by a label span, using its own icon or
the group icon as fallback. Group, child and top-level icons are 18 x 18 px.
The direct `wb-nav-group-items` container has exactly 18 px inline-start padding
once; no nested icon wrapper, child margin or second indent. If an older pin
differs, apply only a sidebar-scoped product CSS adjustment, never a vendored
patch. Preserve routes, current state, active-child expansion and shared runtime
ownership of open/closed state. Other controls retain shipped sizes, including
mobile shell controls. A heading needs no icon; if present, use its navigation
concept's icon.

Decorative icons beside text have `aria-hidden="true"`. Icon-only native
buttons/links need a localized accessible action name, with keyboard behavior
and the existing tooltip contract preserved. Icons/color do not replace text
or accessible state. Logos, favicons, authored illustrations and game artwork
are separate. No new icon library, runtime or plugin is authorized.

## Rollout boundaries for these three rules

The local 2026-11-26 approval supplements older pinned contracts that lack these
rules without authorizing unshipped icons/APIs. Apply only to product-owned web
surfaces. Preserve public SEO, editorial titles, custom-site branding, CMS
package/host ownership, Craft's native control-panel shell, native-app identity
and the separate game interface system. Packages must not replace unrelated
host titles or favicons. Record each exception's owning surface, reason and
retained behavior. Do not migrate frameworks, redesign unrelated UI, add general
CSS/JS or patch vendored runtimes.

Report changed files, retained exceptions, validation and missing browser checks.
Commit, merge/main integration, push, version bump, tag/release, publication,
deployment, installation and consumer updates are separate operations requiring
fresh operator approval after this rollout's change report.

## Interface copy

Use sentence case for headings, breadcrumb labels, navigation, tabs,
form and table labels, and buttons. Follow the locale's spelling rules and
preserve product names, acronyms, and authored record titles. Omit terminal
periods on short labels and brand taglines. Use normal punctuation in messages
and help written as sentences.

Store the intended casing in the source text or translation. Do not apply
CSS `text-transform: uppercase`, `text-transform: capitalize`, or equivalent
utilities. Breadcrumb labels stay separate from the shared decorative
separator and its CSS spacing.

## Custom CSS and JS

Custom CSS or JS is allowed only when shipped WebBlocks UI composition cannot cover the need. Before adding it, explain which shipped pattern, primitive, surface, utility, or hook was insufficient.

Preset/accent dropdowns use `.wb-theme-switcher` and the complete `.wb-theme-switcher-trigger` palette-icon + chevron anatomy. Do not create a project-local icon-only variant or add product CSS for its affordance.

Navigation groups use `.wb-nav-group[data-wb-nav-group]`, a `.wb-nav-group-toggle` button or native summary, and `.wb-nav-group-items`. Use `open` on a native details root and use `WBNavGroup` for programmatic changes to either form. Do not add a second toggle handler or state manager.

Tabs pair `[data-wb-tab]` controls with panels by id. Hosts may render the initial inactive panels with `hidden` and `aria-hidden="true"`, but the shipped runtime owns all panel visibility and accessibility state after a tab change. Do not copy tab visibility listeners into project JavaScript; use `data-wb-tabs-field` when the server needs the active tab value.

## Bounded measurements

- Use native `meter.wb-meter` for a measurement within a known range, such as a poll share.
- Supply native `min`, `max` and `value`, an accessible name and visible localized value text.
- Preserve meter semantics; do not label measurements as task progress or add a progressbar role.
- UI owns the themed track and fill without JavaScript or inline CSS. Hosts own values, validation, formatting, aggregation and visibility.
- Keep the same scale for compared values. Multiple-choice poll options remain independent percentages.
