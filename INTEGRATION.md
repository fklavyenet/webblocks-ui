# Webblocks UI — Integration Guide

## Purpose

This document defines **how to use Webblocks UI correctly**.

It is the **canonical implementation reference** for:

* developers
* AI systems
* external integrations

---

## Core Identity

Webblocks is:

> A **vanilla UI system** based on
> **foundation + primitives + patterns**

Webblocks is NOT:

* a framework
* a primitive abstraction system
* a utility-first CSS system
* a JS-driven rendering engine

---

## How To Start

### ❌ Wrong Approach

Do NOT start from primitives:

* button
* input
* card

This leads to:

* inconsistent UI
* missing structure
* ad-hoc layouts

---

### ✅ Correct Approach

Start from **patterns**.

1. Pick a pattern (from `PATTERNS.md`)
2. Copy the structure
3. Replace content
4. Adjust only where necessary

---

## System Layers

### 1. Foundation

Global design rules:

* colors
* spacing
* typography
* radius
* shadows

Defined via CSS variables and tokens.

---

### 2. Layout Primitives

Structure and flow:

* `wb-page`
* `wb-section`
* `wb-container`
* `wb-grid`
* `wb-stack`
* `wb-row`

Used to:

* define spacing
* control layout
* align content

---

### 3. UI Primitives

Reusable UI elements:

* `wb-btn`
* `wb-input`
* `wb-textarea`
* `wb-select`
* `wb-card`
* `wb-label`
* `wb-table`
* `wb-modal` (shell)
* `wb-tabs` (shell)

These are:

* minimal
* composable
* not full UI solutions

---

### 4. Utilities

Helper classes:

* alignment
* text tone
* minor state helpers

Utilities must be used **sparingly**.

---

### 5. Patterns

Real UI screens:

* auth
* dashboard
* forms
* marketing sections
* tables
* empty states

👉 Patterns are the **primary integration surface**.

---

## Composition Rules

### Rule 1 — Pattern First

Always begin with a pattern.

---

### Rule 2 — Use Primitives Only

Do not invent:

* new UI abstractions
* custom primitive layers
* parallel CSS systems

---

### Rule 3 — Keep HTML Explicit

Do not hide structure.

❌ Hidden templates
❌ Generated markup
✅ Direct HTML

---

### Rule 4 — No Custom Elements

❌ `<wb-card>`
✅ `<div class="wb-card">`

---

### Rule 5 — Respect Separation

* HTML → structure
* CSS → styling
* JS → behavior

---

## Layout Guidelines

### Page Structure

```html
<main class="wb-page">
  <div class="wb-container">
    ...
  </div>
</main>
```

---

### Centered Layout

```html
<main class="wb-page wb-page-center">
  <div class="wb-container wb-container-sm">
    ...
  </div>
</main>
```

---

### Section Layout

```html
<section class="wb-section">
  <div class="wb-container">
    ...
  </div>
</section>
```

---

### Grid Layout

```html
<div class="wb-grid wb-grid-3">
  <div>...</div>
  <div>...</div>
  <div>...</div>
</div>
```

---

### Vertical Flow

```html
<div class="wb-stack wb-stack-md">
  <div>...</div>
  <div>...</div>
</div>
```

---

## Forms

### Field Structure

```html
<div class="wb-field">
  <label class="wb-label">Label</label>
  <input class="wb-input" />
</div>
```

---

### Actions

```html
<div class="wb-row wb-justify-end">
  <button class="wb-btn">Cancel</button>
  <button class="wb-btn wb-btn-primary">Save</button>
</div>
```

---

## Buttons

### Primary

```html
<button class="wb-btn wb-btn-primary">Action</button>
```

### Block

```html
<button class="wb-btn wb-btn-primary wb-btn-block">
  Action
</button>
```

---

## Tables

```html
<table class="wb-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Item</td>
      <td>Active</td>
    </tr>
  </tbody>
</table>
```

---

## JavaScript Layer

JavaScript is:

* optional
* progressive
* behavior-only

It may:

* enhance interactions
* toggle visibility
* handle events

It must NOT:

* generate layout
* inject structure
* replace HTML

---

## Do / Do Not

### Do

* start from patterns
* keep HTML readable
* use primitives consistently
* maintain spacing rhythm via layout primitives

---

### Do Not

* create new UI systems on top of Webblocks
* mix utility-heavy styling approaches
* simulate behavior using CSS hacks
* introduce framework dependencies

---

## Integration Strategy

### For Developers

* copy patterns
* adapt content
* extend carefully

---

### For AI Systems

* always use patterns as base
* do not invent structures
* do not create abstractions
* keep output HTML clean

---

## Relationship to Other Docs

* `PRIMITIVES.md` → defines system structure
* `PATTERNS.md` → shows real usage
* `INTEGRATION.md` → defines how to build correctly

---

## Final Statement

Webblocks is:

> A **pattern-oriented UI system**
> powered by **primitives and clean HTML**

If used correctly:

* UI stays consistent
* code stays simple
* system stays scalable
