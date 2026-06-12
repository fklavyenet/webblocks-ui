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

## Overlay Stack Hardening

Near-term follow-up work around the existing overlay architecture:

* documented overlay stack standard
* future runtime hardening for stack-aware modal, drawer, picker, and confirmation behavior
* future docs/examples for nested modal, modal-launched picker, drawer-launched modal, and stacked confirmation flows
* no new public `wb-overlay` primitive; harden shared runtime infrastructure around existing public primitives instead

---

## AI Knowledge / Advisor Layer

WebBlocks UI should be a source of truth for AI coding agents as well as human developers. Downstream projects such as CMS, QuizTem, Herne Panel, Publisher, Plugins, Workbench, and future products should be able to ask an AI agent for WebBlocks UI guidance and receive answers that match the shipped package, canonical patterns, and documented primitive contracts.

### Short term: static knowledge contract

Create an `ai/` directory in the repository with a static usage contract for AI agents:

* expert role definition and source priority
* downstream usage rules for shells, surfaces, tables, overlays, feedback, and branding
* forbidden downstream patterns and compatibility-alias caveats
* review checklist for UI changes in downstream projects
* response format for WebBlocks UI advisor answers
* compact correct/incorrect examples
* a manually readable knowledge map for future export work

This phase is documentation-only. It does not create a vector store, API service, runtime advisor, Workbench integration, package source change, dist change, or docs HTML behavior change.

### Medium term: export and validation tools

Add tooling that can export the static knowledge contract and validate that AI-facing docs stay aligned with shipped package surfaces. Useful follow-up checks include:

* missing or stale source references
* forbidden vocabulary appearing in primary examples
* downstream table/shell/overlay contract validation
* package-source and dist-reference drift reports

### Long term: private WebBlocks UI Advisor

Build a private WebBlocks UI Advisor backed by curated repo knowledge, vector search, and optional Workbench integration. This later phase should use the static `ai/` contract as seed material, but the vector store itself is explicitly out of scope for the current documentation preparation phase.

---

## Minification Hardening (Deferred)

Minified dist artifacts exist in the repository, but downstream production/CDN usage should stay on the standard non-minified dist files until the minification pipeline is hardened.

Required coverage before recommending `.min.css` / `.min.js` consumption:

* CSS math functions: `calc()`, `min()`, `max()`, and `clamp()`
* custom properties and `var()` fallback safety
* selector whitespace safety, including nested navigation and descendant selectors
* `data-url` / SVG data URI safety
* visual and computed-style smoke checks comparing minified and unminified assets

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
