# WebBlocks UI Roadmap

This document defines the development roadmap for **WebBlocks UI**.

The goal of WebBlocks is to provide a **modern, clean, HTML/CSS-friendly UI system** for building admin panels and websites without introducing custom HTML elements or heavy build complexity.

Principles:

* HTML remains standard HTML
* CSS remains CSS
* JavaScript is optional and separated
* Class-based architecture
* Pattern-first composition
* Token-based theming
* Minimal utilities
* Clean and predictable naming (`wb-` prefix)

---

# Version 1 (V1) — Core UI System ✅ Complete

## Goal

Deliver a **stable, usable foundation** that can build real interfaces such as:

* Admin panels
* CRUD pages
* Settings screens
* Login/Register pages
* Simple marketing pages

The focus of V1 is **foundations + core primitives + patterns**.

---

# V1 Foundations

## Design Tokens

Global tokens must be defined in `tokens.css`.

### Colors

* primary
* secondary
* success
* warning
* danger
* surface
* background
* border
* muted text

### Spacing Scale

Example scale:

* 4px
* 8px
* 12px
* 16px
* 20px
* 24px
* 32px

### Radius Scale

* small
* medium
* large

### Typography

* font families
* font sizes
* line heights
* font weights

### Shadows

* small
* medium
* large

---

# V1 Theme System

WebBlocks supports theme customization via CSS variables.

Supported features:

* Color themes
* Light mode
* Dark mode

### Mode

```
light
dark
auto
```

### Theme Presets (initial)

Examples:

```
ocean
forest
warm
cool
neutral
```

Themes modify token values rather than rewriting primitive styles.

---

# V1 Layout Primitives

These provide structural layout helpers.

### Primitives

* `container`
* `grid`
* `stack`
* `section`
* `page wrapper`

These should focus on **layout structure**, not visual styling.

---

# V1 Core UI Primitives

The following UI primitives must be implemented.

## Form Primitives

* button
* input
* textarea
* select
* checkbox
* radio
* switch
* form group

### Required Features

Each primitive should support:

* size variants (`sm`, `md`, `lg`)
* state handling (`hover`, `focus`, `disabled`)
* validation styles (where applicable)

---

## Content Primitives

* card
* alert
* badge

---

## Data Primitives

* table
* pagination

---

## Navigation Primitives

* dropdown
* tabs
* breadcrumb

---

## Overlay Primitives

* modal
* tooltip

---

## Feedback Primitives

* progress
* spinner

---

# V1 Documentation Requirements

Each primitive or pattern entry must include:

* example HTML
* variant examples
* usage guidelines
* class reference

Documentation should allow developers to **copy and paste working HTML**.

---

# V1 Naming Conventions

All classes use a prefix:

```
wb-
```

Examples:

```
wb-btn
wb-btn-primary
wb-card
wb-card-header
wb-input
wb-table
```

### Structure Pattern

```
block
block-element
block-modifier
```

Examples:

```
wb-card
wb-card-header
wb-card-body
wb-card-footer
wb-card-bordered

wb-btn
wb-btn-primary
wb-btn-outline
wb-btn-lg
```

---

# Version 2 (V2) — Advanced UI System ✅ Complete

## Goal

Extend WebBlocks from a basic primitive system into a **complete interface system** suitable for modern SaaS applications.

Focus areas:

* advanced theming
* navigation systems
* data interfaces
* richer feedback patterns

---

# V2 Advanced Theming

Extend the token system to support deeper customization.

### Theme Features

* color themes
* radius themes
* density modes
* font presets
* shadow presets
* border presets

Example modes:

```
soft
sharp
compact
comfortable
```

This allows UI appearance to change without modifying primitives.

---

# V2 Navigation Primitives

Navigation patterns used in modern admin panels.

Primitives and patterns:

* navbar
* sidebar
* navigation group
* menu
* submenu
* topbar actions

These primitives should work well for **dashboard layouts**.

---

# V2 Data UI Primitives

Primitives focused on managing and displaying structured data.

### Primitives

* stats card
* data table
* filter bar
* search bar
* empty results state
* inline action menus
* status badge / pill

These are essential for admin interfaces.

---

# V2 Feedback Primitives

User feedback patterns beyond basic alerts.

### Primitives

* toast notifications
* notification stack
* loading overlay
* inline validation messages

---

# V2 Overlay Primitives

Advanced overlay patterns.

### Primitives

* dropdown menu improvements
* popover
* drawer / offcanvas panel
* command palette style menu

These improve interaction density in complex interfaces.

---

# V2 Usability Improvements

Additional UI elements improving everyday usage.

### Primitives

* avatar
* divider
* list group
* empty state
* skeleton loaders
* confirmation dialog

---

# V2 Outcome ✅

After Version 2, WebBlocks should be capable of powering:

* SaaS admin dashboards
* CMS control panels
* user management interfaces
* reporting dashboards
* settings and configuration panels

At this stage WebBlocks becomes a **complete UI system**, not a CSS primitive library.

**Delivered in V2:**
* Multi-axis theme system (`data-accent`, `data-preset`, `data-radius`, `data-density`, `data-shadow`, `data-border`, `data-font`)
* 8 accent color palettes × 12 tokens each
* 5 named presets (modern, minimal, rounded, bold, editorial)
* Advanced primitives and patterns: drawer, command palette, nav-group, filter-bar, action-menu, loading/spinner, popover, divider, list-group, tooltip, confirmation dialog
* New layouts: `wb-settings-shell`, `wb-content-shell`
* `wb-toolbar` primitive
* Example pages: admin/settings, website/pricing, website/faq, website/contact

---

# Phase 3 — Pattern Expansion 🔄 In Progress

## Goal

Expand the pattern catalog so developers can start from stronger canonical HTML structures without introducing wrapper systems.

---

## Phase 3.1 — Canonical Patterns (In Progress)

Expand and harden canonical HTML-first patterns.

### Focus areas

* auth flows
* dashboard shells
* settings flows
* CRUD forms
* marketing hero and pricing sections
* data-heavy table, filter, and toolbar patterns

### Rule

No wrapper systems, template adapters, or framework-specific abstraction layers.

---

# Development Philosophy

WebBlocks should prioritize:

* clean HTML structure
* minimal CSS complexity
* predictable class naming
* minimal overrides in real projects
* modern visual defaults
* strong theme flexibility

The system should feel **simple to use but powerful to extend**.
