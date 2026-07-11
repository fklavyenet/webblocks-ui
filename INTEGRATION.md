# WebBlocks UI — Integration & Layout Rules (Canonical)

## Purpose

This document is the **single source of truth** for:

* integration rules
* layout system
* decision tree
* AI enforcement behavior

For downstream AI usage rules and review checklists, also see `ai/contract.md`.

If this file conflicts with shipped source, shipped source wins.

---

# 1. Core Principle

**Do not reach for custom CSS first.**

All layout must be expressed using WebBlocks primitives.

---

# 2. Core Model

WebBlocks is a controlled system:

1. Foundation
2. Layout helpers
3. UI primitives
4. Surfaces
5. Patterns
6. Interactive hooks

---

# 3. Start From Patterns

Always start from:

* `wb-dashboard-shell`
* `wb-content-shell`
* `wb-auth-shell`
* `wb-settings-shell`
* `wb-slider` for media/content carousel sections
* `wb-cookie-consent` for reusable public-site consent UI
* `wb-language-switcher`, `wb-auth-entry`, and `wb-user-menu` for canonical dashboard topbar controls

---

# 4. Layout Decision Tree (MANDATORY)

## 4.1 Horizontal

→ `wb-cluster`

## 4.2 Vertical

→ `wb-stack`

## 4.3 Left / Right

→ `wb-cluster wb-cluster-between`

⚠️ Container MUST be full-width

---

## 4.4 Centering

* Layout → primitives
* Text → `text-align` ONLY for typography

---

## 4.5 Multi-column

→ `wb-grid`, `wb-grid-auto`, `wb-split`

---

## 4.6 Spacing

→ `wb-stack-*`, `wb-cluster-*`

---

## 4.7 🚨 Red Flag

If using:

* `text-align`
* `margin-left: auto`
* inline styles
* spacer div
* custom flex

→ STOP → return to primitives

---

# 5. Canonical Header Pattern

```html
<div class="wb-card-header wb-cluster wb-cluster-between wb-cluster-2">
  <strong>Title</strong>
  <a href="#" class="wb-btn wb-btn-primary">Action</a>
</div>
```

Rules:

* no inner wrapper
* must be full width
* layout on same element

---

# 6. Layout Helpers

Allowed:

* `wb-container`
* `wb-section`
* `wb-stack`
* `wb-cluster`
* `wb-split`
* `wb-grid`

Cookie consent rule:

* use `wb-cookie-consent` plus shipped primitives when a project needs consent UI
* do not write project-local cookie banners when WebBlocks UI already ships the pattern
* preference centers must use the existing `wb-modal` primitive
* always include a reopen trigger such as `data-wb-cookie-consent-open`

Slider rule:

* use `wb-slider` for hero sliders, split-section sliders, and contained media/content carousels
* keep the canonical anatomy: `wb-slider` -> `wb-slider-viewport` -> `wb-slider-track` -> `wb-slide`
* keep media and content separate with `wb-slide-media` and `wb-slide-content`
* use real `img` or `picture` media with `object-fit: cover` before falling back to CSS background images
* do not write project-local slider JavaScript when `WBSlider` fits the behavior

Topbar menu rule:

* use `wb-language-switcher` with one explicit `--icon`, `--code`, or `--icon-code` variant
* use `wb-auth-entry` with one explicit `--icon`, `--label`, or `--icon-label` variant for guests
* use `wb-user-menu` with one explicit `--full`, `--compact`, or `--avatar` variant for authenticated users; add `--responsive` when narrow screens should collapse it
* reuse `wb-dropdown`; do not create a second language/user dropdown runtime
* hosts own locale URLs and labels, guest/authenticated state, login URLs, user identity and authorization, CSRF, and POST logout behavior
* language codes are content-defined and must not depend on CSS casing transforms

❌ Do NOT invent wrappers

---

# 7. Surfaces

Only generic surface:

```html
wb-card
```

❌ Forbidden:

* `wb-panel`
* `wb-box`

---

# 8. Sidebar Anatomy

```
wb-sidebar
  ├── wb-sidebar-brand
  ├── wb-sidebar-nav
  └── wb-sidebar-footer
```

---

# 9. Dashboard Shell Rules

Required structure:

* `wb-dashboard-shell`
* `wb-sidebar`
* `wb-dashboard-body`
* `wb-navbar`
* `wb-dashboard-main`

❌ No custom shell CSS

---

# 10. Responsibilities

* HTML → structure
* CSS → visuals
* JS → behavior

---

# 11. Feedback Standard

Use the shipped feedback primitives without inventing wrappers or classes.

* transient success/info feedback → `wb-toast` outside normal layout flow, preferably inside `#wb-overlay-root.wb-overlay-root`
* validation errors and user-correctable failures → inline contextual feedback near the related form, card, or section, usually `wb-alert`
* persistent warnings or blocking failures → inline in the related card or section
* page-global alerts → only truly global/system-level states
* no-JS fallback → contextual inline alert

Canonical toast container:

```html
<div id="wb-overlay-root" class="wb-overlay-root">
  <div class="wb-toast-container wb-toast-container-top-right" aria-live="polite" aria-atomic="true">
    <div class="wb-toast wb-toast-success" role="status">
      <div class="wb-toast-body">
        <strong class="wb-toast-title">Message sent</strong>
        <span>Thanks for your message.</span>
      </div>
      <button type="button" class="wb-toast-close" aria-label="Dismiss">×</button>
    </div>
  </div>
</div>
```

Toasts are not modals: no backdrop, focus trap, body scroll lock, or page interaction blocking.

---

# 12. New Class Rule

Add ONLY if:

1. primitives fail
2. reusable
3. clear role
4. not duplicate
5. correct layer

---

# 13. Violations

❌ inline styles
❌ layout via text-align
❌ margin hacks
❌ spacer divs
❌ custom wrappers

---

# 14. Final Checklist

* Is this layout or styling?
* Is there a primitive?
* Am I breaking shell?

---

# 15. 🔒 AI ENFORCEMENT PROMPT (CRITICAL)

Use this prompt in ALL AI integrations:

---

## SYSTEM PROMPT

You are working inside WebBlocks UI.

STRICT RULES:

1. NEVER use custom CSS for layout unless explicitly approved
2. ALWAYS solve layout using:

   * wb-stack
   * wb-cluster
   * wb-grid
   * wb-split
3. NEVER use:

   * inline styles
   * text-align for layout
   * margin hacks
   * spacer divs
4. ALWAYS apply layout classes to the correct container:

   * not inner wrappers
   * must respect full-width requirement
5. FOLLOW the Layout Decision Tree EXACTLY
6. If unsure:

   * DO NOT invent solution
   * fallback to primitives
7. If primitives cannot solve it:

   * explain WHY before proposing custom CSS

---

## OUTPUT RULES

* produce clean WebBlocks UI markup only
* no extra wrappers
* no custom classes unless necessary
* no inline styles

---

## FAILURE CONDITIONS (MUST AVOID)

* adding `<div style="...">`
* using `text-align: right` for layout
* wrapping layout inside inner div
* ignoring `wb-cluster-between` full-width rule

---

## SUCCESS CRITERIA

* layout expressed purely with primitives
* matches WebBlocks vocabulary
* no hacks
* no overrides

---

# 16. Key Insight

WebBlocks is:

✔ composition system
❌ utility system
❌ CSS playground

---

# END
