# Tabs runtime contract

WebBlocks UI tabs are HTML-first and pair a control with a panel by id:

```html
<div class="wb-tabs" data-wb-tabs>
  <div class="wb-tabs-nav" role="tablist">
    <button class="wb-tabs-btn is-active" data-wb-tab="overview" aria-selected="true">Overview</button>
    <button class="wb-tabs-btn" data-wb-tab="diagnostics" aria-selected="false" tabindex="-1">Diagnostics</button>
  </div>
  <div class="wb-tabs-panel is-active" id="overview" aria-hidden="false">...</div>
  <div class="wb-tabs-panel" id="diagnostics" hidden aria-hidden="true">...</div>
</div>
```

The host chooses the initial active tab. From the first tab change onward, WebBlocks UI owns:

- `is-active` on controls and panels;
- `hidden` and `aria-hidden` on panels;
- `aria-selected` and `tabindex` on controls;
- arrow, Home, and End keyboard navigation;
- the `wb:tabs:change` lifecycle event.

Do not add a project-local click listener to show or hide panels. When a form must submit the active panel id, use `data-wb-tabs-field` instead of listening for the event only to update a hidden input.

Rendering inactive panels without `hidden` remains supported because the shipped CSS hides panels that do not carry `is-active`. Rendering `hidden aria-hidden="true"` is recommended when the server already knows the initial state, because it avoids exposing inactive content before CSS loads.
