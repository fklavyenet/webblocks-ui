# Downstream Usage Rules

These rules apply to CMS, QuizTem, Herne Panel, Publisher, Plugins, Workbench, and other downstream projects that consume WebBlocks UI.

## Shells

Use the shipped shell that matches the screen:

* Admin and dashboard screens: `wb-dashboard-shell`
* Auth screens: `wb-auth-shell`
* Settings screens: `wb-settings-shell`

Do not create project-local shell wrappers when a shipped shell pattern fits.

## Surfaces

Use `wb-card` as the only generic framed surface.

Do not use `wb-panel`, `wb-box`, or project-local framed wrappers as generic content containers in new work.

## Admin Index Lists

Use the canonical admin list structure:

```html
<div class="wb-page-header">...</div>

<!-- Filters come before the list card. -->
<form class="wb-filter-bar">...</form>

<section class="wb-card">
  <div class="wb-card-body">
    <div class="wb-table-wrap">
      <table class="wb-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Example</td>
            <td><span class="wb-badge">Active</span></td>
            <td class="wb-table-actions">
              <div class="wb-action-group">...</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="wb-card-footer">...</div>
</section>
```

Required pieces:

* page-level `wb-page-header`
* filters before the list card
* `section.wb-card`
* `.wb-card-body`
* `.wb-table-wrap`
* explicit `Actions` table header
* `td.wb-table-actions`
* `.wb-action-group`
* pagination inside `.wb-card-footer`

Admin filter bar actions:

* use canonical English labels `Filter` and `Clear`
* render `Clear` only when filters are active
* use normal `wb-btn` sizing for filter action buttons; do not use `wb-btn-sm`
* align fields and actions with existing composition such as `wb-filter-bar`, `wb-filter-bar-start`, `wb-filter-bar-end`, `wb-field`, `wb-items-end`, `wb-flex-1`, and `wb-min-w-0`
* do not use `Apply`, `Apply Filters`, `Reset`, or `Clear filters` on new WebBlocks admin filter surfaces
* do not add project-specific filter alignment CSS
* keep row actions and compact toolbar icon buttons under their separate action standards

## Forms

Use shipped field, input, select, textarea, checkbox/radio, button, card, and layout primitives. Put page-level submit actions in the owning form or card footer, not in the page header.

## Overlays

Use `wb-modal` for modal confirmation flows. Do not use browser `confirm()`.

Use one shared overlay root:

```html
<div id="wb-overlay-root" class="wb-overlay-root"></div>
```

Do not duplicate modal roots or create project-local overlay stacks.

## Feedback

Use `wb-toast` for transient success and info feedback. Toasts should live outside normal layout flow, preferably under `#wb-overlay-root`.

Use inline `wb-alert` for validation errors, blocking failures, persistent warnings, and user-correctable errors.

## Branding

Admin, auth, and sidebar brand marks should follow the shipped admin product brand standard. Prefer project-owned inline SVG components using `currentColor`, WebBlocks sizing classes, and separate favicon/app icon files.

## Custom CSS and JS

Custom CSS or JS is allowed only when shipped WebBlocks UI composition cannot cover the need. Before adding it, explain which shipped pattern, primitive, surface, utility, or hook was insufficient.
