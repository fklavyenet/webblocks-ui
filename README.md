# WebBlocks UI Repository

This repository is organized into two clear areas:

- `packages/webblocks/` - the actual WebBlocks UI package
- `content/` - the content surfaces built around the package

## Repository Structure

- `packages/webblocks/src/` - source CSS, JS, and icons
- `packages/webblocks/dist/` - built distributable assets
- `packages/webblocks/build.sh` - package build script
- `packages/webblocks/README.md` - package documentation
- `packages/webblocks/INTEGRATION.md` - integration reference
- `packages/webblocks/CHANGELOG.md` - package changelog

- `content/website/` - public/editorial product site
- `content/docs/` - canonical documentation surface
- `content/examples/` - inspectable demo pages
- `content/site.css` - shared surface styling for website, docs, and examples indexes

## Entry Points

- repository entry: `index.html`
- website: `content/website/index.html`
- docs: `content/docs/index.html`
- examples: `content/examples/index.html`

## Notes

- `content/examples/public-pages/` contains public-facing page demos
- the package itself remains framework-agnostic and lives entirely under `packages/webblocks/`
- content pages consume built assets from `packages/webblocks/dist/`
