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
      <h1 class="wb-auth-header-title">Sign in</h1>
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
          <nav class="wb-page-breadcrumb" aria-label="Breadcrumb">
            <ol class="wb-breadcrumb wb-breadcrumb-minimal">
              <li class="wb-breadcrumb-item"><a href="#">Workspace</a></li>
              <li class="wb-breadcrumb-item is-active"><span aria-current="page">Members</span></li>
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

### Settings

Use `wb-settings-shell` for:

- account settings
- organization settings
- grouped control pages with local navigation

Canonical structure:

```html
<div class="wb-settings-shell">
  <aside class="wb-settings-nav">
    <div class="wb-settings-nav-header">Account</div>
    <a href="#" class="wb-settings-nav-link is-active">Profile</a>
    <a href="#" class="wb-settings-nav-link">Security</a>
  </aside>

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
    <nav class="wb-content-breadcrumb" aria-label="Breadcrumb">
      <ol class="wb-breadcrumb wb-breadcrumb-inline">
        <li class="wb-breadcrumb-item"><a href="#">Docs</a></li>
        <li class="wb-breadcrumb-item is-active"><span aria-current="page">Getting started</span></li>
      </ol>
    </nav>
    <h1 class="wb-content-title">Getting started</h1>
    <p class="wb-content-subtitle">Use the content shell when reading hierarchy matters more than app chrome.</p>
  </header>

  <div class="wb-content-body">...</div>

  <footer class="wb-content-footer">...</footer>
</article>
```

## Supporting Patterns

These are also shipped pattern families, but not primary app shells:

- `wb-page-intro`
- `wb-hero`
- `wb-content-columns`
- `wb-footer-grid`
- scoped `wb-game-screen*`

## Boundary Rules

1. Patterns define page jobs, not just boxes.
2. Patterns may own local surfaces such as `wb-settings-section`, but framed dashboard work areas still use `wb-card`.
3. Pattern-local surfaces are not automatically global primitives.
4. Do not flatten a shell into a generic wrapper abstraction.
5. Do not treat dashboard header classes as universal layout helpers.
6. `wb-page-header` and `wb-settings-section` are pattern-local surfaces, not global layout building blocks.

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
