# WebBlocks UI — Pattern Catalog

## Purpose

Patterns are the primary public entry point for real WebBlocks pages.

This file defines the canonical page-level shells and the rules for using them.

Source of truth:

- shipped pattern CSS under `packages/webblocks/src/css/patterns/`
- supporting primitives and layout helpers under `packages/webblocks/src/css/`

## Pattern Rule

When the page has a page-level job, start from a shipped shell or pattern.

Do not start from an invented wrapper.

## Canonical Shells

### Auth

Use `wb-auth-shell` for:

- sign in
- register
- password reset
- lightweight onboarding entry flows

Canonical structure:

```html
<div class="wb-auth-shell">
  <div class="wb-auth-card">
    <div class="wb-auth-header">
      <h1 class="wb-auth-header-title">
        <svg class="wb-auth-brand-mark wb-auth-brand-mark-sm product-brand-mark" viewBox="0 0 64 64" aria-hidden="true">
          <path fill="currentColor" d="M32 6 56 18v28L32 58 8 46V18l24-12Zm0 10L18 23v17l14 7 14-7V23l-14-7Z" />
        </svg>
        <span>Sign in</span>
      </h1>
      <p class="wb-auth-header-subtitle">Access your workspace</p>
    </div>
    <div class="wb-auth-body">
      <form class="wb-stack-4">
        <div class="wb-field">
          <label class="wb-label" for="login-email">Email</label>
          <input class="wb-input" id="login-email" type="email">
        </div>
        <div class="wb-field">
          <label class="wb-label" for="login-password">Password</label>
          <div class="wb-input-group">
            <input class="wb-input" id="login-password" type="password" autocomplete="current-password">
            <button class="wb-btn wb-btn-secondary wb-input-addon-btn wb-btn-icon"
                    type="button"
                    data-wb-password-toggle
                    data-wb-target="#login-password"
                    aria-label="Show password"
                    aria-pressed="false">
              <i class="wb-icon wb-icon-eye" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <button class="wb-btn wb-btn-primary wb-w-full" type="submit">Continue</button>
      </form>
    </div>
    <div class="wb-auth-footer">Need an account?</div>
  </div>
</div>
```

Keep the explicit header/body/footer anatomy intact: all three regions should read as one auth card, with the body as the center of gravity rather than a form stranded between two mini-panels.

Auth brand marks are a product responsibility. Ecosystem products should use a project-owned inline SVG component or partial whose visible mark uses `currentColor`; WebBlocks UI owns the auth sizing slot through `wb-auth-brand-mark`. See `docs/admin-product-brand.md` for the admin/auth/sidebar brand standard.

Password visibility is a field-level enhancement, not an auth-only abstraction: keep the toggle inside the standard `wb-input-group` trailing button slot.

### Dashboard

Use `wb-dashboard-shell` for:

- admin products
- SaaS dashboards
- control panels
- data-dense operational UIs

Canonical structure:

```html
<div class="wb-dashboard-shell">
  <aside class="wb-sidebar" id="appSidebar">...</aside>

  <div class="wb-dashboard-body">
    <header class="wb-navbar">
      <a href="#" class="wb-navbar-brand">Atlas</a>
      <span class="wb-navbar-spacer"></span>
      <div class="wb-navbar-end">...</div>
    </header>

    <main class="wb-dashboard-main">
      <div class="wb-page-header">
        <div class="wb-page-header-main">
          <nav class="wb-page-breadcrumb wb-breadcrumb" aria-label="Breadcrumb">
            <ol class="wb-breadcrumb-list">
              <li class="wb-breadcrumb-item"><a class="wb-breadcrumb-link" href="#">Workspace</a></li>
              <li class="wb-breadcrumb-item"><span class="wb-breadcrumb-current" aria-current="page">Members</span></li>
            </ol>
          </nav>
          <div>
            <h1 class="wb-page-header-title">Members</h1>
            <p class="wb-page-subtitle">Manage people, roles, and invitations.</p>
          </div>
        </div>
        <div class="wb-page-actions">
          <button class="wb-btn wb-btn-primary wb-btn-sm">Invite</button>
        </div>
      </div>

      <section class="wb-card wb-card-flat">
        <div class="wb-card-header">
          <h2 class="wb-card-title">Recent activity</h2>
        </div>
        <div class="wb-card-body">...</div>
      </section>
    </main>
  </div>
</div>
```


#### Dashboard implementation guardrails

- Do not create project-local shell wrappers around the dashboard shell.
- Do not restate dashboard shell layout behavior in page-local CSS.
- Do not replace `wb-card` with `wb-panel`, `wb-box`, or another generic framed surface.
- Do not use `wb-page-header` as a generic page content wrapper.
- Keep the navbar hierarchy product first, context second.
- Prefer shipped layout helpers such as `wb-stack`, `wb-cluster`, `wb-grid`, `wb-grid-auto`, `wb-row`, and `wb-col-*` before adding custom classes.
- If a dashboard example needs local CSS, keep it limited to page-specific internal arrangement, not shell redefinition.

#### Topbar language and user menus

Use the additive `wb-language-switcher`, `wb-auth-entry`, and `wb-user-menu` compositions inside the utilities `wb-cluster`. Their triggers rebase onto the universal button primitive (`wb-btn wb-btn-ghost`); they reuse the existing dropdown, avatar, icon, and danger-item contracts and do not introduce a second dropdown runtime. (`wb-topbar-actions`/`wb-topbar-action` remain shipped only as deprecated aliases for pre-2.13 markup.)

Canonical utility order when every control is present:

1. search
2. notifications
3. update indicator
4. mode or theme
5. language
6. auth entry or user menu

#### Navbar utilities (icon actions)

Navbar utilities are the small cluster of controls that sit at the trailing edge of a bar. The same set appears in a public site navbar and in an application topbar, so the vocabulary is context-neutral: the terms `topbar` and `navbar` do not belong in utility class names.

- Container: `wb-cluster` (a layout helper), not a bar-specific wrapper.
- Icon action: the universal button primitive `wb-btn wb-btn-ghost wb-btn-icon`. It is the canonical icon-action for utilities in both bars. `wb-topbar-action` remains a shipped alias for existing application-topbar markup, but new work should prefer the button primitive.
- Status dot: `wb-btn-dot` (add `wb-btn-dot--accent` for the accent tone). It marks unread/available state on any icon action. The dot is decorative — the button's `aria-label` conveys the state, so mark the dot `aria-hidden`.

Per-utility composition:

- search: an icon action that opens the command palette — `<button class="wb-btn wb-btn-ghost wb-btn-icon" data-wb-toggle="cmd" data-wb-target="#palette">`. The palette owns its own markup and strings; the host supplies results through `WBCommandPalette.onSearch`.
- notifications: an icon action carrying `wb-btn-dot`, opening a `wb-dropdown` whose `wb-dropdown-menu wb-dropdown-menu--panel` hosts a `wb-list` of rows (`wb-list-item`, plus `wb-list-item--unread` for unread rows). No new runtime — the dropdown handles open/close; the host owns the notification data and unread state.
- update indicator: an icon action with `data-wb-update-indicator` and a `wb-btn-dot`. `WBUpdateIndicator` reveals it from a JSON status endpoint; see `update-indicator.js`.
- mode or theme: an icon action with `data-wb-mode-cycle`. Localize its label with `data-wb-mode-label-light|dark|auto`.
- language: `wb-language-switcher`; user or guest auth: `wb-user-menu` / `wb-auth-entry`. These compound utilities keep their own trigger contracts.

All utility text (labels, notification copy, "see all", palette strings) is host-authored markup, so localization stays with the host.

Language switcher variants:

- `wb-language-switcher--icon` shows the language icon
- `wb-language-switcher--code` shows the host-provided current-language code such as `EN`, `TR`, or `DE`
- `wb-language-switcher--icon-code` shows both

User menu variants:

- `wb-user-menu--full` shows avatar, name, context, and chevron
- `wb-user-menu--compact` hides context and keeps avatar plus name
- `wb-user-menu--avatar` shows only the avatar trigger
- `wb-user-menu--responsive` collapses to the avatar trigger below 640px

Guest auth entry variants:

- `wb-auth-entry--icon` shows only the login icon
- `wb-auth-entry--label` shows only the host-provided login label
- `wb-auth-entry--icon-label` shows both
- render `wb-auth-entry` only for guests; authenticated users receive `wb-user-menu` instead

Host responsibility rules:

- language codes and names are content; do not derive or uppercase them with CSS
- language URLs should point to the equivalent localized route when the host can resolve it
- current language uses `is-active` and `aria-current="page"`
- user identity, avatar, role/context, authorization, and conditional items come from the host
- login URLs, guest/authenticated state, and login labels come from the host
- logout remains a host-owned, CSRF-protected `POST` form; never turn it into a GET link

#### Sidebar anatomy

Canonical dashboard sidebar anatomy is:

- `wb-sidebar-brand` for product identity
- `wb-sidebar-nav` for navigation groups
- `wb-sidebar-footer` for bottom content such as user panel, version info, profile links, admin links, docs links, and other secondary/meta content

Use `wb-sidebar-footer` when the sidebar has bottom content. Do not simulate sidebar footer content by stacking a second `wb-sidebar-nav` block below the primary navigation when the content is semantically footer/meta content rather than navigation.

Do:

- keep primary navigation inside `wb-sidebar-nav`
- place bottom user/meta/version areas inside `wb-sidebar-footer`
- keep footer content secondary to the main navigation

Do not:

- use a second `wb-sidebar-nav` as a footer substitute
- mix primary navigation semantics with footer/meta content
- invent a project-local sidebar footer wrapper when `wb-sidebar-footer` is the correct contract

### Settings

Use `wb-settings-shell` for:

- account settings
- organization settings
- grouped control pages with local navigation

Use `wb-section-nav` inside it for the local section-switching rail.

Canonical structure:

```html
<div class="wb-settings-shell">
  <nav class="wb-section-nav wb-settings-nav" aria-label="Settings sections">
    <div class="wb-section-nav-title">Account</div>
    <ul class="wb-section-nav-list">
      <li class="wb-section-nav-item">
        <a href="#profile" class="wb-section-nav-link is-active" aria-current="page">Profile</a>
      </li>
      <li class="wb-section-nav-item">
        <a href="#security" class="wb-section-nav-link">Security</a>
      </li>
    </ul>
  </nav>

  <div class="wb-settings-body">
    <header class="wb-settings-header">
      <h1 class="wb-settings-title">Profile</h1>
      <p class="wb-settings-desc">Manage personal account details.</p>
    </header>

    <section class="wb-settings-section">
      <div class="wb-settings-section-header">
        <h2 class="wb-settings-section-title">Public profile</h2>
        <p class="wb-settings-section-desc">Shown to collaborators.</p>
      </div>
      <div class="wb-settings-section-body">...</div>
      <div class="wb-settings-section-footer">...</div>
    </section>
  </div>
</div>
```

### Section Nav

Use `wb-section-nav` for:

- section-level navigation inside a page or shell
- settings side navigation
- docs subsection navigation
- getting started step / section navigation

Do not use it for:

- global site navigation
- primary app sidebar replacement
- breadcrumbs
- top-level tabs unless the page intentionally uses the same section-switching contract

Canonical structure:

```html
<nav class="wb-section-nav" aria-label="Settings sections">
  <div class="wb-section-nav-title">Settings</div>
  <ul class="wb-section-nav-list">
    <li class="wb-section-nav-item">
      <a class="wb-section-nav-link is-active" href="#profile" aria-current="page">Profile</a>
    </li>
    <li class="wb-section-nav-item">
      <a class="wb-section-nav-link" href="#security">Security</a>
    </li>
    <li class="wb-section-nav-item">
      <a class="wb-section-nav-link" href="#billing">Billing</a>
    </li>
  </ul>
</nav>
```

Subparts:

- `wb-section-nav` = the pattern wrapper
- `wb-section-nav-title` = quiet internal nav label
- `wb-section-nav-list` = vertical list container
- `wb-section-nav-item` = stable item hook and semantic list item
- `wb-section-nav-link` = row-level interactive target

Active state:

- use `is-active` on the current link
- include `aria-current="page"` when the current route is genuinely known in static markup
- for in-page anchor menus, let runtime apply `is-active` and `aria-current="location"` from the real current section instead of hardcoding a fake active item

Navbar active indicators:

- put `wb-navbar-nav--active-underline`, `wb-navbar-nav--active-pill`, `wb-navbar-nav--active-dot`, `wb-navbar-nav--active-background`, or `wb-navbar-nav--active-none` on the `wb-navbar-nav` list
- keep current-page state on the link with `is-active` and `aria-current="page"`
- prefer these shipped indicator classes over project-local navbar active CSS

Semantic guidance:

- wrap the pattern in `nav`
- provide an appropriate `aria-label`
- prefer `ul` and `li` when the content is a list of links

Contract rule:

- `wb-section-nav` uses explicit subpart classes so its spacing, layout, and interaction do not depend on a specific heading level or list tag shape
- do not treat descendant element selectors as the public API for this pattern

Do:

- reuse `wb-section-nav` across settings rails, docs side navigation, and in-page section menus
- keep the pattern compact and calm
- place it in an `aside`, shell rail, card body, or adjacent nav area when that matches the page job

Do not:

- create a second settings-only inner nav pattern for the same job
- rely on `.wb-section-nav h2`, `.wb-section-nav ul`, or `.wb-section-nav a` as the primary contract
- stretch it into a global sidebar or primary application nav

### Breadcrumb

Use `wb-breadcrumb` for:

- page hierarchy inside dashboard headers
- CMS edit and nested content flows
- settings and detail pages that need parent context
- docs or public pages where the hierarchy genuinely helps orientation

Do not use it for:

- decorative subtitle text
- fake hierarchy that does not map to real navigation
- dumping every deep internal path segment when the result harms clarity

Canonical structure:

```html
<nav class="wb-breadcrumb" aria-label="Breadcrumb">
  <ol class="wb-breadcrumb-list">
    <li class="wb-breadcrumb-item">
      <a class="wb-breadcrumb-link" href="#">Dashboard</a>
    </li>
    <li class="wb-breadcrumb-item">
      <a class="wb-breadcrumb-link" href="#">Pages</a>
    </li>
    <li class="wb-breadcrumb-item">
      <span class="wb-breadcrumb-current" aria-current="page">Home</span>
    </li>
  </ol>
</nav>
```

Subparts:

- `wb-breadcrumb` = the pattern wrapper; apply it to `nav`
- `wb-breadcrumb-list` = ordered path container
- `wb-breadcrumb-item` = semantic list item and separator anchor
- `wb-breadcrumb-link` = ancestor link
- `wb-breadcrumb-current` = current location text
- `wb-breadcrumb-compact` = denser variant for topbars, drawers, and tighter headers

Contract rules:

- separators are generated by CSS; do not type `/` or `>` into the markup
- current page should use `aria-current="page"`
- current page should normally be non-link text
- wrapping is allowed; do not require JS truncation for long paths

### Content

Use `wb-content-shell` for:

- docs
- onboarding guides
- editorial pages
- changelogs
- policies

Canonical structure:

```html
<article class="wb-content-shell wb-content-shell-narrow">
  <header class="wb-content-header">
    <nav class="wb-content-breadcrumb wb-breadcrumb wb-breadcrumb-compact" aria-label="Breadcrumb">
      <ol class="wb-breadcrumb-list">
        <li class="wb-breadcrumb-item"><a class="wb-breadcrumb-link" href="#">Docs</a></li>
        <li class="wb-breadcrumb-item"><span class="wb-breadcrumb-current" aria-current="page">Getting started</span></li>
      </ol>
    </nav>
    <h1 class="wb-content-title">Getting started</h1>
    <p class="wb-content-subtitle">Use the content shell when reading hierarchy matters more than app chrome.</p>
  </header>

  <div class="wb-content-body">...</div>

  <footer class="wb-content-footer">...</footer>
</article>
```

### Gallery

Use `wb-gallery` for:

- inline image or media collections
- editorial asset grids
- screenshot galleries that may expand into a focused viewer

Architecture rule:

- `wb-gallery` = inline media presentation pattern
- immersive viewing uses one shared `wb-modal`
- the viewer is content-first modal composition, not a second top-layer primitive
- author one shared viewer per gallery context instead of one modal per gallery item
- if a gallery viewer opens another picker or dialog from inside overlay UI, that nested overlay must follow the overlay stack standard instead of staying inside a clipping parent

Canonical structure:

```html
<section class="wb-gallery" aria-label="Product screenshots">
  <div class="wb-gallery-grid">
    <figure class="wb-gallery-item">
      <button class="wb-gallery-trigger"
              type="button"
              data-wb-gallery-target="#product-gallery-viewer"
              data-wb-gallery-full="/images/product-overview-full.jpg">
        <img class="wb-gallery-media"
             src="/images/product-overview-thumb.jpg"
             alt="Analytics dashboard with KPI cards and a weekly revenue chart">
      </button>
      <figcaption class="wb-gallery-caption">Overview dashboard</figcaption>
      <div class="wb-gallery-meta">Week 14 snapshot</div>
    </figure>

    <figure class="wb-gallery-item">
      <button class="wb-gallery-trigger"
              type="button"
              data-wb-gallery-target="#product-gallery-viewer"
              data-wb-gallery-full="/images/product-members-full.jpg">
        <img class="wb-gallery-media"
             src="/images/product-members-thumb.jpg"
             alt="Team members table with roles and invitation status">
      </button>
      <figcaption class="wb-gallery-caption">Members</figcaption>
      <div class="wb-gallery-meta">Roles and invitations</div>
    </figure>
  </div>
</section>

<div id="wb-overlay-root" class="wb-overlay-root">
  <div class="wb-modal wb-modal-xl" id="product-gallery-viewer" role="dialog" aria-modal="true" aria-labelledby="product-gallery-viewer-title">
  <div class="wb-modal-dialog">
    <div class="wb-modal-body">
      <div class="wb-gallery-viewer">
        <div class="wb-gallery-viewer-toolbar">
          <button class="wb-btn wb-btn-secondary wb-btn-icon wb-gallery-viewer-prev" type="button" aria-label="Previous image">&larr;</button>
          <div class="wb-gallery-viewer-counter" aria-live="polite">1 / 2</div>
          <div class="wb-cluster wb-cluster-2">
            <button class="wb-btn wb-btn-secondary wb-btn-icon wb-gallery-viewer-next" type="button" aria-label="Next image">&rarr;</button>
            <button class="wb-btn wb-btn-secondary wb-btn-icon wb-gallery-viewer-close" type="button" data-wb-dismiss="modal" aria-label="Close viewer">&times;</button>
          </div>
        </div>

        <figure class="wb-gallery-viewer-media">
          <img class="wb-gallery-viewer-image"
               src="/images/product-overview-full.jpg"
               alt="Analytics dashboard with KPI cards and a weekly revenue chart">
          <figcaption class="wb-gallery-viewer-caption" id="product-gallery-viewer-title">Overview dashboard</figcaption>
        </figure>

        <p class="wb-gallery-viewer-meta wb-text-sm wb-text-muted wb-m-0">Week 14 snapshot</p>
      </div>
    </div>
  </div>
  </div>
</div>
```

Subparts:

- `wb-gallery` = pattern wrapper
- `wb-gallery-grid` = inline gallery layout
- `wb-gallery-item` = semantic media item
- `wb-gallery-trigger` = real interactive opener; use `button` or `a`
- `wb-gallery-media` = thumbnail or preview media
- `wb-gallery-caption` = visible item title/caption
- `wb-gallery-meta` = quiet supporting metadata
- `wb-gallery-viewer*` = viewer subparts rendered inside a shared `wb-modal`
- `wb-gallery-viewer-title` = optional heading above the shared viewer

Layout modifiers (all optional; the bare `wb-gallery` is a fluid auto-fit grid with 4/3 media and captions below):

- columns: `wb-gallery--cols-2` … `wb-gallery--cols-5` fix the track count (drops to 2 below 992px, 1 below 641px). Omit for the fluid auto-fit default.
- gap: `wb-gallery--gap-none` | `--gap-sm` | `--gap-md` | `--gap-lg`.
- media ratio: `wb-gallery--aspect-square` | `--aspect-4-3` | `--aspect-16-9` | `--aspect-portrait`, or `--aspect-auto` to let the intrinsic image ratio drive height.
- variant: `wb-gallery--masonry` (CSS-columns flow; pair with `--aspect-auto`) or `wb-gallery--collage` (dense grid, every 5th item spans two tracks; needs a `--cols-*`).

Caption placement modifiers — captions sit **below** the media by default (a `figcaption.wb-gallery-caption` as a sibling of the trigger). To overlay them on the media instead, move the `wb-gallery-caption` (and any `wb-gallery-meta`) *inside* the `wb-gallery-trigger` and add one of:

- `wb-gallery--captions-overlay` — caption always visible as a bottom scrim.
- `wb-gallery--captions-hover` — caption revealed on hover/focus only.
- overlay tone (with either of the above): default is a gradient scrim; `wb-gallery--overlay-solid` for a solid panel, `wb-gallery--overlay-none` for text-shadow only.

Behavior rule:

- one gallery can have many triggers but should use one shared modal viewer
- clicking a trigger updates the active item inside the shared viewer modal
- previous / next and keyboard left / right move through the same gallery set
- focus returns to the originating trigger when the modal closes through the normal modal runtime
- runtime stepping is scoped to the current `.wb-gallery` set rather than every trigger on the page

### Slider

Use `wb-slider` for:

- hero sliders
- split slider/text sections
- contained sliders inside cards or editorial pages
- carousels that need arrows, dots, keyboard navigation, swipe, loop, or optional autoplay

Canonical structure:

```html
<div class="wb-slider wb-slider-height-lg" data-wb-slider>
  <div class="wb-slider-viewport">
    <div class="wb-slider-track">
      <article class="wb-slide">
        <img class="wb-slide-media" src="..." alt="">
        <div class="wb-slide-content">...</div>
      </article>
    </div>
  </div>
  <div class="wb-slider-controls">
    <button class="wb-btn wb-btn-icon wb-slider-arrow wb-slider-prev" type="button" data-wb-slider-prev aria-label="Previous slide">...</button>
    <div class="wb-slider-dots" data-wb-slider-dots></div>
    <button class="wb-btn wb-btn-icon wb-slider-arrow wb-slider-next" type="button" data-wb-slider-next aria-label="Next slide">...</button>
  </div>
</div>
```

Rules:

- `wb-slider` owns the public pattern root.
- `wb-slider-viewport` clips the visible slide area.
- `wb-slider-track` is the movement layer.
- `wb-slide-media` should be a real `img`, `picture`, or `video` element when possible.
- `wb-slide-content` is a normal content slot for headings, text, buttons, cards, and product-owned child blocks.
- The slider fills the box it is placed in; use explicit height or ratio modifiers for full-viewport or fixed-format designs.

### Cookie Consent

Use `wb-cookie-consent` for:

- reusable public-site cookie banners
- floating consent cards on public pages
- one shared preference-center modal that can be reopened later

Architecture rule:

- `wb-cookie-consent` = public-site consent pattern
- use `wb-cookie-consent-banner` for the recommended bottom banner entry
- use `wb-cookie-consent-card` for the compact floating card entry
- preference management lives inside one shared `wb-modal wb-cookie-consent-modal`
- the pattern must include a reopen hook such as a footer `data-wb-cookie-consent-open` trigger
- if the preference center opens another picker, viewer, or dialog, that nested overlay must follow the overlay stack standard instead of rendering inside the parent overlay body

Behavior rule:

- if no saved consent exists, runtime shows the first `data-wb-cookie-consent` root
- accept all enables all optional categories and stores `accepted`
- reject disables all optional categories and stores `rejected`
- save preferences stores category values and marks the state `custom` when needed
- close without changing consent is allowed only after consent already exists, unless markup explicitly opts into dismissal
- runtime emits `wb:cookie-consent:change` after each persisted change
- runtime stores consent only; host projects still decide whether to load analytics or marketing scripts

## Supporting Patterns

These are also shipped pattern families, but not primary app shells:

- `wb-page-intro`
- `wb-hero`
- `wb-content-columns`
- `wb-footer-grid`

## Boundary Rules

1. Patterns define page jobs, not just boxes.
2. Patterns may own local surfaces such as `wb-settings-section`, but framed dashboard work areas still use `wb-card`.
3. Pattern-local surfaces are not automatically global primitives.
4. Do not flatten a shell into a generic wrapper abstraction.
5. Do not treat dashboard header classes as universal layout helpers.
6. `wb-page-header` and `wb-settings-section` are pattern-local surfaces, not global layout building blocks.
7. Focus-above-page interactions belong to the modal primitive layer, not to page-pattern markup: use `wb-modal` for dialog, confirm, form, and content-first viewer UI.
8. `wb-gallery` is an inline pattern; when it needs immersive viewing, expand into a shared content-first `wb-modal` instead of inventing a gallery-specific top-layer primitive.
9. `wb-cookie-consent` is a reusable public-site pattern; keep it composed from shipped primitives and one shared `wb-modal`, not project-local banner code.
10. If a pattern opens a picker, viewer, preference center, or confirmation flow from inside another overlay, the nested overlay must follow the overlay stack standard instead of rendering inside a clipping parent.

Do:

- use `wb-page-header` inside dashboard/app page-header context
- use `wb-settings-section` inside settings flows and settings-shell structures

Do not:

- do not use `wb-page-header` as a general-purpose page wrapper
- do not use `wb-settings-section` as a generic replacement for `wb-card`

## Composition Rules

Inside patterns:

- use layout helpers first
- use shipped primitives second
- use utilities only for small adjustments
- keep `wb-field-meta` inside fields that carry assistive content; reserve empty meta rows only when aligned multi-column forms need them
- keep table wrappers singular: `wb-table-wrap` owns radius/border, inner toolbars stay control rows, and table headers stay header bands
- keep text casing content-defined; use typography for emphasis instead of automatic uppercase or capitalize transforms

Do not create custom pattern wrappers before checking whether the shipped shell already fits the page.

## Header Rules

Canonical page-header stack:

- breadcrumb optional
- `wb-page-header-title` required
- subtitle optional
- actions optional

`wb-page-intro` owns a separate display-heading contract:

- `wb-page-eyebrow`
- `wb-page-intro-title`
- `wb-page-lead`

Topbar identity rule:

- product first
- context second

## Alias Rules

Compatibility aliases may still ship, but they are not the default teaching path.

Examples:

- prefer `wb-dashboard-shell` over `wb-shell`
- prefer `wb-sidebar-brand` over `wb-sidebar-header`

## Final Rule

Patterns are the copy-paste-safe public face of WebBlocks.

If a page type matches a shipped shell, use that shell instead of composing a new page architecture from scratch.
