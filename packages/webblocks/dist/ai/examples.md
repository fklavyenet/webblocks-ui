# WebBlocks UI AI Examples

These examples are intentionally short. They show the expected direction without replacing the canonical docs.

## Admin Index Table

Wrong:

```html
<div class="wb-admin-table-card">
  <table>...</table>
</div>
```

Right:

```html
<div class="wb-page-header">...</div>
<form class="wb-filter-bar">...</form>
<section class="wb-card">
  <div class="wb-card-body">
    <div class="wb-table-wrap">
      <table class="wb-table">
        <thead>
          <tr><th>Name</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Example</td>
            <td class="wb-table-actions"><div class="wb-action-group">...</div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="wb-card-footer">...</div>
</section>
```

## Destructive Delete Modal

Wrong:

```html
<button onclick="return confirm('Delete this item?')">Delete</button>
```

Right:

```html
<button type="button" class="wb-btn wb-btn-danger" data-wb-modal-open="delete-item">
  Delete
</button>

<div id="delete-item" class="wb-modal" role="dialog" aria-modal="true">
  ...
</div>
```

## Auth Brand Mark

Wrong:

```html
<img class="wb-auth-brand-mark" src="/logo.svg" width="48" height="48" alt="">
```

Right:

```html
<span class="wb-auth-brand-mark" aria-hidden="true">
  <svg viewBox="0 0 48 48" fill="none">...</svg>
</span>
```

## Sidebar Brand Mark

Wrong:

```html
<span class="wb-sidebar-brand-logo" style="background-image:url('/logo.svg')"></span>
```

Right:

```html
<span class="wb-sidebar-brand-mark" aria-hidden="true">
  <svg viewBox="0 0 48 48" fill="none">...</svg>
</span>
```

## Settings Page

Wrong:

```html
<main class="settings-page custom-settings-layout">...</main>
```

Right:

```html
<main class="wb-settings-shell">
  <section class="wb-card">...</section>
</main>
```

## Form Card

Wrong:

```html
<div class="wb-panel">
  <form>...</form>
</div>
```

Right:

```html
<section class="wb-card">
  <form>
    <div class="wb-card-body">...</div>
    <div class="wb-card-footer">
      <button class="wb-btn wb-btn-primary" type="submit">Save</button>
    </div>
  </form>
</section>
```

## Toast vs Alert

Use toast for transient success/info:

```html
<div class="wb-toast wb-toast-success" role="status">...</div>
```

Use alert for user-correctable validation errors:

```html
<div class="wb-alert wb-alert-danger" role="alert">Please fix the highlighted fields.</div>
```

## Rating

Read-only average (partial fill via `--wb-rating-value` percentage). The host owns the number; the primitive only draws it:

```html
<span class="wb-rating-stars" style="--wb-rating-value: 86%"
      role="img" aria-label="Average 4.3 out of 5"></span>
```

Interactive input degrades without JavaScript: each star is a real submit button, hover fills up to the pointed star. The host owns the form action, hidden fields, and storage:

```html
<form class="wb-rating-input" method="post" action="/ratings">
  <button type="submit" name="rating_value" value="1" aria-label="1 star">★</button>
  <button type="submit" name="rating_value" value="2" aria-label="2 stars">★</button>
  <button type="submit" name="rating_value" value="3" aria-label="3 stars">★</button>
  <button type="submit" name="rating_value" value="4" aria-label="4 stars">★</button>
  <button type="submit" name="rating_value" value="5" aria-label="5 stars">★</button>
</form>
```

Override colors and size with `--wb-rating-color`, `--wb-rating-empty`, and `--wb-rating-size`. `wb-rating` carries no endpoints, storage, or CSRF and does not own a visible heading.
