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
- [ ] Tables live in `section.wb-card > .wb-card-body > .wb-table-wrap`.
- [ ] Action columns have an explicit `Actions` header.
- [ ] Row actions use `td.wb-table-actions` and `.wb-action-group`.
- [ ] Pagination lives in `.wb-card-footer`.

## Forms

- [ ] Forms use shipped field and input primitives.
- [ ] Submit actions stay in the owning form or card footer.
- [ ] Validation feedback appears near the field, form, card, or section it belongs to.

## Overlays

- [ ] Confirmations use `wb-modal`, not browser `confirm()`.
- [ ] The page uses one shared `#wb-overlay-root`.
- [ ] No custom overlay stack or duplicated modal root was introduced.

## Feedback

- [ ] Transient success/info feedback uses `wb-toast`.
- [ ] Validation, blocking, and user-correctable errors use inline `wb-alert`.
- [ ] Toasts do not block page interaction or behave like modals.

## Branding

- [ ] Admin, auth, and sidebar brand marks follow `docs/admin-product-brand.md`.
- [ ] Brand marks are project-owned inline SVG using `currentColor`.
- [ ] Brand mark markup avoids default `img`, `picture`, CSS-mask shells, and width/height attributes.

## Custom CSS/JS

- [ ] Custom CSS/JS was added only after shipped composition proved insufficient.
- [ ] Any custom CSS/JS has a narrow role and does not create a parallel UI layer.
- [ ] No Tailwind, Vite, React, Vue, Inertia, or Livewire UI layer was introduced for WebBlocks UI surfaces.

## Tests

- [ ] Existing downstream tests or smoke checks still pass.
- [ ] UI changes were reviewed for shell, table, overlay, feedback, and responsive behavior.
- [ ] If no tests exist, the remaining risk is stated clearly in the final response.
