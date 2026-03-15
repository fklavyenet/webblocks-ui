# WebBlocks UI Kit Roadmap

This document defines the development roadmap for **WebBlocks UI Kit**.

The goal of WebBlocks is to provide a **modern, clean, HTML/CSS-friendly UI kit** for building admin panels and websites without introducing custom HTML elements or heavy build complexity.

Principles:

* HTML remains standard HTML
* CSS remains CSS
* JavaScript is optional and separated
* Class-based architecture
* Component-first design
* Token-based theming
* Minimal utilities
* Clean and predictable naming (`wb-` prefix)

---

# Version 1 (V1) — Core UI Kit

## Goal

Deliver a **stable, usable foundation** that can build real interfaces such as:

* Admin panels
* CRUD pages
* Settings screens
* Login/Register pages
* Simple marketing pages

The focus of V1 is **foundations + core components**.

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

Themes modify token values rather than rewriting component styles.

---

# V1 Layout Components

These provide structural layout helpers.

### Components

* `container`
* `grid`
* `stack`
* `section`
* `page wrapper`

These should focus on **layout structure**, not visual styling.

---

# V1 Core Components

The following components must be implemented.

## Form Components

* button
* input
* textarea
* select
* checkbox
* radio
* switch
* form group

### Required Features

Each component should support:

* size variants (`sm`, `md`, `lg`)
* state handling (`hover`, `focus`, `disabled`)
* validation styles (where applicable)

---

## Content Components

* card
* alert
* badge

---

## Data Components

* table
* pagination

---

## Navigation Components

* dropdown
* tabs
* breadcrumb

---

## Overlay Components

* modal
* tooltip

---

## Feedback Components

* progress
* spinner

---

# V1 Documentation Requirements

Each component must include:

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

# Version 2 (V2) — Advanced UI System

## Goal

Transform WebBlocks from a basic UI kit into a **complete interface system** suitable for modern SaaS applications.

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

This allows UI appearance to change without modifying components.

---

# V2 Navigation Components

Navigation patterns used in modern admin panels.

Components:

* navbar
* sidebar
* navigation group
* menu
* submenu
* topbar actions

These components should work well for **dashboard layouts**.

---

# V2 Data UI Components

Components focused on managing and displaying structured data.

### Components

* stats card
* data table
* filter bar
* search bar
* empty results state
* inline action menus
* status badge / pill

These are essential for admin interfaces.

---

# V2 Feedback Components

User feedback patterns beyond basic alerts.

### Components

* toast notifications
* notification stack
* loading overlay
* inline validation messages

---

# V2 Overlay Components

Advanced overlay patterns.

### Components

* dropdown menu improvements
* popover
* drawer / offcanvas panel
* command palette style menu

These improve interaction density in complex interfaces.

---

# V2 Usability Improvements

Additional UI elements improving everyday usage.

### Components

* avatar
* divider
* list group
* empty state
* skeleton loaders
* confirmation dialog

---

# V2 Outcome

After Version 2, WebBlocks should be capable of powering:

* SaaS admin dashboards
* CMS control panels
* user management interfaces
* reporting dashboards
* settings and configuration panels

At this stage WebBlocks becomes a **complete UI system**, not just a CSS component library.

---

# Development Philosophy

WebBlocks should prioritize:

* clean HTML structure
* minimal CSS complexity
* predictable class naming
* minimal overrides in real projects
* modern visual defaults
* strong theme flexibility

The framework should feel **simple to use but powerful to extend**.
