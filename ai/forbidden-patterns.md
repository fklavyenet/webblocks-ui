# Forbidden Patterns

These patterns must not be introduced in new downstream work.

## Generic Surfaces

Do not use these as generic framed content surfaces:

* `wb-panel`
* `wb-box`

Use `wb-card` instead.

## Legacy or Non-Canonical Layout Vocabulary

Do not teach or introduce these in primary docs, examples, or new downstream work:

* `wb-page`
* `wb-page-center`
* `wb-btn-block`
* `wb-stack-sm`
* `wb-stack-md`
* `wb-align-center`
* `wb-checkbox`

Some aliases may exist for shipping compatibility. Compatibility does not make them canonical. AI agents should avoid teaching aliases as primary vocabulary and should prefer the current shipped pattern, primitive, or utility names.

## Project-Local Wrappers

Do not introduce project-local admin table wrappers such as:

* `wb-admin-table-card`
* `wb-admin-table-card-body`
* `wb-admin-pages-table-wrap`
* any product-specific replacement for `section.wb-card > .wb-card-body > .wb-table-wrap`

Use the canonical admin table structure instead.

## Non-Semantic Detail Lists

Do not use `wb-detail-list` on a div/span root or replace `dt.wb-detail-label`
and `dd.wb-detail-value` with div/span elements. `div.wb-detail-row` is allowed
only as a grouping wrapper inside `dl.wb-detail-list`. CSS and ARIA roles cannot
replace the native anatomy. Existing div-only consumers must migrate.

Do not choose a description list just because a page is called a detail page,
or use one to imitate a table's column sizing. Field/value table summaries and
comparable records use native `table`/`th`/`td`; description lists retain their
term/description or independent name/value associations in all three looks.

## Overlay and Confirmation Anti-Patterns

Do not introduce:

* duplicated modal roots
* custom overlay stacks
* browser `confirm()`
* local confirmation dialogs that bypass `wb-modal`

Use one shared `#wb-overlay-root` and shipped overlay primitives.

## Framework UI Layers

Do not replace WebBlocks UI with project-local UI layers built around:

* Tailwind
* Vite
* React
* Vue
* Inertia
* Livewire

Downstream projects may use their own server or app framework, but WebBlocks UI markup should remain explicit and should not be hidden behind a parallel UI component vocabulary unless that adapter is explicitly scoped and approved.
