# WebBlocks UI AI Contract

Version: v2.7.12

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

- Start from the shipped pattern that matches the screen before composing primitives.
- Use `wb-dashboard-shell` for admin and dashboard screens.
- Use `wb-auth-shell` for authentication screens.
- Use `wb-settings-shell` for settings and account screens.
- Use `wb-content-shell` for editorial, documentation, or content-heavy public pages when it fits.
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

## Overlays And Feedback

- Use one shared `#wb-overlay-root.wb-overlay-root`.
- Use `wb-modal` for dialog and destructive confirmation flows.
- Do not use browser `confirm()` or `alert()` as product UI.
- Use `wb-toast` for transient success/info feedback.
- Use inline `wb-alert` for validation, blocking, persistent, and user-correctable errors.
- Do not create duplicate overlay roots, custom overlay stacks, or project-local modal systems when WebBlocks UI primitives fit.

## Branding

Admin, auth, and sidebar product brand marks should follow `docs/admin-product-brand.md`: project-owned inline SVG components using `currentColor`, standard WebBlocks UI sizing classes, no default `img`/`picture`/CSS-mask shell marks, and separate favicon/app icon files.

## Forbidden Patterns

Do not introduce these in new downstream work:

- `wb-panel` or `wb-box` as generic framed surfaces
- project-local replacements for `wb-dashboard-shell`, `wb-auth-shell`, or `wb-settings-shell`
- project-specific admin table wrappers that replace `section.wb-card > .wb-card-body > .wb-table-wrap`
- duplicated modal roots
- browser `confirm()` or `alert()` for product UI
- Tailwind, Vite, React, Vue, Inertia, Livewire, or another UI layer to replace WebBlocks UI surfaces
- custom CSS or JavaScript before shipped WebBlocks UI composition is proven insufficient

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
