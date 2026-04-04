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
- patterns for real screens such as auth, dashboards, forms, and marketing pages

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
- playground: `playground/sandbox/index.html`

## Notes

- docs pages consume built assets from `packages/webblocks/dist/`
- the playground is a thin sandbox layer built on top of shipped WebBlocks primitives, surfaces, and layout utilities
- `wb-table-wrap` is the single table surface; toolbars inside it stay control rows and table headers stay header bands
- text casing is content-defined; shipped UI should not automatically uppercase or capitalize content

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
