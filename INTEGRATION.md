# WebBlocks UI — Integration & Layout Rules (Canonical)

## Purpose

This document is the **single source of truth** for:

* integration rules
* layout system
* decision tree
* AI enforcement behavior

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

# 11. New Class Rule

Add ONLY if:

1. primitives fail
2. reusable
3. clear role
4. not duplicate
5. correct layer

---

# 12. Violations

❌ inline styles
❌ layout via text-align
❌ margin hacks
❌ spacer divs
❌ custom wrappers

---

# 13. Final Checklist

* Is this layout or styling?
* Is there a primitive?
* Am I breaking shell?

---

# 14. 🔒 AI ENFORCEMENT PROMPT (CRITICAL)

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

# 15. Key Insight

WebBlocks is:

✔ composition system
❌ utility system
❌ CSS playground

---

# END
