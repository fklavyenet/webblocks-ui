# WebBlocks UI

WebBlocks is a primitive-driven, pattern-oriented UI system built with pure HTML, CSS, and JavaScript.

## Identity

- vanilla UI system
- foundation + layout primitives + UI primitives + patterns
- HTML-first and source-visible
- no npm, no framework runtime, no hidden wrappers

## What It Is

- a foundation layer for tokens and theme axes
- layout primitives for structure and flow
- UI primitives for visible building blocks
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
3. Use [`PRIMITIVES.md`](PRIMITIVES.md) to understand which parts are layout primitives, UI primitives, and utilities.
4. Use [`INTEGRATION.md`](INTEGRATION.md) to keep HTML explicit and composition rules consistent.
5. Use [`packages/webblocks/README.md`](packages/webblocks/README.md) for shipped asset details inside the package.

## Repository Structure

- `packages/webblocks/` - shipped CSS, JS, icons, build script, and package docs
- `docs/` - documentation and integrated pattern examples built around the package

## Entry Points

- repository entry: `index.html`
- docs: `docs/index.html`
- pattern examples: `docs/patterns.html`

## Notes

- docs pages consume built assets from `packages/webblocks/dist/`
