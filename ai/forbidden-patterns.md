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
