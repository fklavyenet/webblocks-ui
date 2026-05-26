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

## Entry Points

- repository entry: `index.html`
- docs: `docs/index.html`
- pattern examples: `docs/patterns.html`
- admin standards: `docs/pattern-admin-standards.html`
- gallery pattern: `docs/pattern-gallery.html`
- cookie consent pattern: `docs/pattern-cookie-consent.html`
- playground: `playground/`

## Notes

- docs pages consume built assets from `packages/webblocks/dist/`
- docs and playground local asset loaders resolve the built files from `packages/webblocks/dist/`; the playground loader also handles the deeper `playground/` path correctly
- the single source of truth for the shipped package version is `packages/webblocks/VERSION`
- update `packages/webblocks/VERSION` before a release or tag so the package banner metadata and docs version label stay in sync
- `./packages/webblocks/build.sh` reads `packages/webblocks/VERSION`, prepends the official banner to dist files, emits deferred experimental minified artifacts, and regenerates `docs/version.js`
- production and CDN integrations should currently use `dist/webblocks-ui.css`, `dist/webblocks-icons.css`, and `dist/webblocks-ui.js`; `.min.css` / `.min.js` artifacts are not the recommended downstream path until minification hardening is complete
- the playground is a thin sandbox layer built on top of shipped WebBlocks primitives, surfaces, and layout utilities
- `wb-card-media` is the canonical card-body media frame when mixed image dimensions need consistent card-grid rhythm without default cropping
- `wb-gallery` is the canonical inline media pattern; immersive viewing stays inside one shared `wb-modal` instead of a separate lightbox primitive
- `wb-cookie-consent` is the reusable public-site consent pattern; it supports bottom-banner and floating-card entry variants plus one shared `wb-modal` preference center and a required reopen hook
- transient success/info feedback should use `wb-toast` outside normal layout flow, preferably under `#wb-overlay-root`; success/info toasts auto-dismiss by default, while validation errors, user-correctable failures, persistent warnings, and blocking failures should stay inline with contextual feedback such as `wb-alert`
- toasts are not modals: no backdrop, focus trap, body scroll lock, or page interaction blocking
- the admin standards page documents the canonical admin page header, detail-list, action-column, and danger-zone rules while preferring existing `wb-card`, `wb-field`, `wb-action-group`, and breadcrumb primitives wherever they already cover the job
- long-form docs pages now use `wb-section-nav` for local section indexes, with runtime-driven active state tied to the real current section instead of static markup
- `wb-table-wrap` is the single table surface; toolbars inside it stay control rows and table headers stay header bands
- admin index tables should keep an explicit left-aligned `Actions` header and use `wb-table-actions` for both single and grouped actions; reserve `wb-text-end` for intentionally right-aligned data such as totals, prices, or metrics
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
