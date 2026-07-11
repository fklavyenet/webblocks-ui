# WebBlocks UI

WebBlocks UI - UI building blocks for humans and AI.

## Identity

- vanilla UI system
- foundation + layout primitives + surfaces + UI primitives + patterns
- HTML-first and source-visible
- no npm, no framework runtime, no hidden wrappers

## What It Is

- a foundation layer for tokens and theme axes
- layout primitives for structure and flow
- primitives for controls and local UI contracts
- surfaces for framed content regions
- patterns for real screens such as auth, dashboards, forms, marketing pages, and reusable public-site consent flows

## What It Is Not

- not a framework
- not a custom HTML language
- not a rendering engine
- not a utility-first workflow

## How To Start

Start from patterns, not primitives.

1. Open [`PATTERNS.md`](PATTERNS.md) and choose a canonical starting point: auth, dashboard, form, or marketing hero.
2. Copy the pattern structure and replace the content.
3. Use [`PRIMITIVES.md`](PRIMITIVES.md) to understand which parts are layout primitives, surfaces, UI primitives, and utilities.
4. Use [`INTEGRATION.md`](INTEGRATION.md) to keep HTML explicit and composition rules consistent.
5. Use [`packages/webblocks/README.md`](packages/webblocks/README.md) for shipped asset details inside the package.

## Repository Structure

- `packages/webblocks/` - shipped CSS, JS, icons, build script, and package docs
- `docs/` - documentation and integrated pattern examples built around the package
- `ai/` - source AI usage contract for coding agents working in downstream projects

## Entry Points

- repository entry: `index.html`
- docs: `docs/index.html`
- pattern examples: `docs/patterns.html`
- admin standards: `docs/pattern-admin-standards.html`
- admin product brand standard: `docs/admin-product-brand.md`
- gallery pattern: `docs/pattern-gallery.html`
- slider pattern: `docs/pattern-slider.html`
- cookie consent pattern: `docs/pattern-cookie-consent.html`
- topbar language and user menu examples: `docs/patterns.html#topbar-menus`
- playground: `playground/`

## Audience Guides

- human developers: start with `docs/`, `PATTERNS.md`, `PRIMITIVES.md`, and root `INTEGRATION.md`
- package consumers: use `packages/webblocks/` and `packages/webblocks/INTEGRATION.md`
- AI coding agents: use the versioned contract shipped at `packages/webblocks/dist/ai/contract.md` for downstream work; use `ai/` as the source layer for that contract

## Notes

- docs pages consume built assets from `packages/webblocks/dist/`
- docs and playground local asset loaders resolve the built files from `packages/webblocks/dist/`; the playground loader also handles the deeper `playground/` path correctly
- the single source of truth for the shipped package version is `packages/webblocks/VERSION`
- update `packages/webblocks/VERSION` before a release or tag so the package banner metadata and docs version label stay in sync
- `./packages/webblocks/build.sh` reads `packages/webblocks/VERSION`, prepends the official banner to non-minified dist files, regenerates `docs/version.js`, and publishes `packages/webblocks/dist/ai/` contract artifacts using only shell and standard command-line utilities
- production and CDN integrations use `dist/webblocks-ui.css`, `dist/webblocks-icons.css`, and `dist/webblocks-ui.js`; `.min.css` / `.min.js` artifacts are no longer published by the canonical build
- downstream AI integrations should reference the pinned release contract at `packages/webblocks/dist/ai/contract.md`; `INTEGRATION.md` remains the implementation-accurate reference that feeds the contract
- `dist/webblocks-icons.json` is preserved as a maintained dist artifact for icon pickers and catalog sync, but the shell build does not regenerate it
- the playground is a thin sandbox layer built on top of shipped WebBlocks primitives, surfaces, and layout utilities
- `wb-card-media` is the canonical card-body media frame when mixed image dimensions need consistent card-grid rhythm without default cropping
- `wb-gallery` is the canonical inline media pattern; immersive viewing stays inside one shared `wb-modal` instead of a separate lightbox primitive
- `wb-slider` is the canonical track-based media/content carousel pattern for hero sliders, split sections, and contained sliders
- `wb-cookie-consent` is the reusable public-site consent pattern; it supports bottom-banner and floating-card entry variants plus one shared `wb-modal` preference center and a required reopen hook
- `wb-language-switcher`, `wb-auth-entry`, and `wb-user-menu` are additive topbar compositions over existing dropdown, action, avatar, and user primitives; hosts keep ownership of routes, auth state, identity, authorization, CSRF, and logout behavior
- transient success/info feedback should use `wb-toast` outside normal layout flow, preferably under `#wb-overlay-root`; success/info toasts auto-dismiss by default, while validation errors, user-correctable failures, persistent warnings, and blocking failures should stay inline with contextual feedback such as `wb-alert`
- toasts are not modals: no backdrop, focus trap, body scroll lock, or page interaction blocking
- the admin standards page documents the canonical admin page header, admin index/list, detail-list, action-column, and danger-zone rules while preferring existing `wb-card`, `wb-field`, `wb-filter-bar`, `wb-action-group`, and breadcrumb primitives wherever they already cover the job
- long-form docs pages now use `wb-section-nav` for local section indexes, with runtime-driven active state tied to the real current section instead of static markup
- `wb-table-wrap` is the single table surface; toolbars inside it stay control rows and table headers stay header bands
- admin index/list screens should use the canonical DOM contract: page-level `wb-page-header`, filters before the list card, the table inside `section.wb-card > .wb-card-body > .wb-table-wrap`, explicit `Actions` header, `td.wb-table-actions`, icon-first quiet/neutral row actions inside `wb-action-group`, accessible with `aria-label` and recommended `title`, and pagination in `wb-card-footer`
- admin filter bar actions should use canonical `Filter` and conditionally rendered `Clear` labels, normal `wb-btn` sizing rather than `wb-btn-sm`, and existing `wb-filter-bar` / `wb-field` / utility composition for alignment instead of project-specific CSS
- do not introduce project-specific admin list wrappers such as `wb-admin-table-card`, `wb-admin-table-card-body`, or `wb-admin-pages-table-wrap` in new work; keep compatibility aliases only where older projects need them
- admin/auth/sidebar product brand marks across CMS, QuizTem, Herne Panel, Publisher/Plugins, and future products should follow `docs/admin-product-brand.md`: project-owned inline SVG components using `currentColor`, no default `img`/`picture`/CSS-mask shell marks, no width/height attributes on brand mark markup, standard WebBlocks UI sidebar/auth sizing classes, and separate favicon/app icon files
- page-level submit actions should stay in the owning form or card footer; page headers are for navigation and context actions only
- text casing is content-defined; shipped UI should not automatically uppercase or capitalize content

## Cookie Consent

Use the shipped Cookie Consent pattern when a project needs reusable consent UI instead of project-local banner code.

- entry variants: `wb-cookie-consent-banner` or `wb-cookie-consent-card`
- preference center: one shared `wb-modal wb-cookie-consent-modal`
- reopen hook: any trigger with `data-wb-cookie-consent-open`
- public API: `window.WBCookieConsent`

Host projects still own the legal copy and conditional loading of analytics or marketing scripts.

## Framed Surface Naming Rule

- `wb-card` is the ONLY generic framed surface.
- `wb-panel` is forbidden as a generic class.
- `wb-box` is forbidden as a generic class.
- `*-panel` naming is allowed ONLY for component-internal parts such as `wb-popover-panel`, `wb-collapse-panel`, `wb-auth-panel`, or other scoped pattern/component structures.

DO:

```html
<div class="wb-card">...</div>
```

DO NOT:

```html
<div class="wb-panel">...</div>
<div class="wb-box">...</div>
```
