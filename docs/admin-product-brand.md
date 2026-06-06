# Admin Product Brand Standard

This standard binds how WebBlocks ecosystem products render product identity in admin shells, auth screens, sidebars, favicons, and app icons. It applies to CMS, QuizTem, Herne Panel, Publisher/Plugins, and future WebBlocks-based products.

WebBlocks UI owns the layout slots, class contracts, token behavior, and sizing hooks. Each product owns its product mark artwork, accessible name, final retained asset list, and product-specific contrast choices.

## Product Shell Brand Marks

Admin, auth, and sidebar product marks should be rendered with a project-owned inline SVG component or partial.

- The visible mark color must use `currentColor`.
- Product shell marks should not render with `img`, `picture`/`source` switching, or CSS masks by default.
- Do not add `width` or `height` attributes to product brand SVG or image markup. Sizing comes from WebBlocks UI classes and local scoped classes.
- Keep the product brand component small, local to the product, and reusable across auth panels, auth cards, and sidebar brand slots.

Preferred shape:

```html
<svg class="wb-sidebar-brand-logo product-brand-mark" viewBox="0 0 64 64" role="img" aria-label="Product">
  <path fill="currentColor" d="..." />
</svg>
```

Do not use this for product shell marks:

```html
<img class="wb-sidebar-brand-logo" src="/brand/logo-dark.svg" alt="Product">
<picture>...</picture>
<span class="wb-sidebar-brand-logo product-brand-mask"></span>
```

## Color Behavior

Product marks must be mode-aware and accent-aware through WebBlocks UI tokens.

- Accent surfaces use `color: var(--wb-accent-on)`.
- Normal and admin surfaces use `color: var(--wb-accent)` or a product-approved `var(--wb-text)` when contrast requires it.
- Avoid duplicated light and dark image assets when inline SVG plus `currentColor` can solve the color problem.
- Keep color decisions in the consuming shell/card/surface class rather than hardcoding colors inside the SVG.

## Sidebar Contract

Products must keep the WebBlocks UI sidebar brand DOM contract:

- `wb-sidebar-brand`
- `wb-sidebar-brand-logo`
- `wb-sidebar-brand-copy`
- `wb-sidebar-brand-note`

Products may render inline SVG as the brand mark, but the rendered mark must keep `wb-sidebar-brand-logo` so WebBlocks UI sizing remains standard.

```html
<a href="/admin" class="wb-sidebar-brand">
  <svg class="wb-sidebar-brand-logo product-brand-mark" viewBox="0 0 64 64" aria-hidden="true">
    <path fill="currentColor" d="..." />
  </svg>
  <span class="wb-sidebar-brand-copy">
    <span>Product</span>
    <span class="wb-sidebar-brand-note">Admin</span>
  </span>
</a>
```

## Auth Contract

Auth panels and auth cards should use the same product brand component as the sidebar.

- Accent panel marks use `var(--wb-accent-on)`.
- Auth card marks use `var(--wb-accent)` or `var(--wb-text)`, depending on product contrast.
- Do not use duplicated light/dark `img` assets for auth marks when inline SVG with `currentColor` can solve the problem.
- Keep auth mark sizing on WebBlocks UI classes such as `wb-auth-brand-mark`; do not add `width` or `height` attributes to the SVG.
- Auth panel brand titles and auth form/card brand titles must use the same inline row pattern by default: the brand mark sits beside the heading text, not stacked above it.
- CMS is the reference implementation for auth brand title alignment.

Default auth panel pattern:

```html
<h1 class="wb-auth-panel-title wb-auth-brand">
  <svg class="wb-auth-brand-mark product-brand-mark" viewBox="0 0 64 64" aria-hidden="true">
    <path fill="currentColor" d="..." />
  </svg>
  <span>Product Name</span>
</h1>
```

Default auth form/card pattern:

```html
<h1 class="wb-auth-header-title wb-auth-brand">
  <svg class="wb-auth-brand-mark product-brand-mark" viewBox="0 0 64 64" aria-hidden="true">
    <path fill="currentColor" d="..." />
  </svg>
  <span>Welcome back</span>
</h1>
```

```css
.wb-auth-brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--wb-s3);
}

.product-brand-on-accent {
  color: var(--wb-accent-on);
}

.product-brand-on-card {
  color: var(--wb-accent);
}
```

Required auth alignment behavior:

- `wb-auth-brand` uses `inline-flex` or `flex`.
- `align-items: center` keeps the mark and heading text on the same vertical axis.
- `justify-content: center` is used where the auth title should be centered in its panel or card.
- `gap: var(--wb-s3)` is the default spacing, unless the product has an approved equivalent.
- The mark and heading text render on the same row.

Default auth mark sizes:

- Auth panel mark: `3rem` by `3rem`.
- Auth form/card mark: `2rem` by `2rem`.
- Sizing must come from CSS classes only.
- Do not add SVG `width` or `height` attributes.

Stacked or large hero-logo auth layouts are not the WebBlocks product shell default. A stacked auth brand layout requires an explicit product decision and must not be introduced accidentally while implementing product marks.

## Favicon And App Icons

Favicons and app icons are separate file assets, not the inline SVG product brand component.

- Do not make a squircle favicon or app icon the default WebBlocks ecosystem standard.
- Do not dynamically bind favicons to user-selected accent by default.
- Products should keep only the favicon and icon files they actually use.
- Product docs and tests should list the final retained favicon and app icon files.

## Asset Cleanup

Products should not keep historical brand files only because they might be useful later.

- Audit every brand asset before and after implementation.
- Remove obsolete pilot assets after reference checks.
- Keep only files referenced by templates, manifests, docs, tests, package metadata, or install/deploy flows.
- Product docs/tests should list the final kept brand files.

## Required Product Implementation Guards

Each product should add tests or assertions that verify:

- Auth and sidebar brand marks render inline `svg`.
- The inline SVG visible mark uses `currentColor`.
- The brand mark SVG has no `width` or `height` attributes.
- The sidebar rendered mark keeps `wb-sidebar-brand-logo`.
- Auth and sidebar product marks do not use `img`, `picture`, or CSS mask rendering.
- The auth panel mark is inside `h1.wb-auth-panel-title.wb-auth-brand` before the product text.
- The auth form/card mark is inside `h1.wb-auth-header-title.wb-auth-brand` before the title text.
- Auth and sidebar product mark tests reject `img`, `picture`/`source`, CSS mask rendering, and SVG `width` or `height` attributes.
- Obsolete brand assets are absent.
- Favicon files remain present.

## Downstream Implementation Checklist

Use this checklist when updating CMS, QuizTem, Herne Panel, Publisher/Plugins, or another downstream product:

- Audit current brand assets and references.
- Add a product brand-mark component or partial.
- Update the auth shell.
- Update the sidebar.
- Remove obsolete files.
- Update docs, tests, and changelog.
- Bump version and publish if the project has live installs.
