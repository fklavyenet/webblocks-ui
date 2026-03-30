# Webblocks UI — Pattern Catalog

## Purpose

This document defines the **pattern layer** of Webblocks UI.

Patterns show how to build **real screens** using:

* standard HTML
* `wb-*` classes
* zero abstraction

---

## Core Principle

> Patterns are the **public API** of Webblocks.

Users should NOT start from primitives.

Users should start from patterns.

---

## What Is a Pattern?

A pattern is:

* a **real UI scenario**
* built using **primitives only**
* written in **plain HTML**
* **copy-paste usable**

Examples:

* login page
* dashboard
* settings form
* pricing section

---

## What Patterns Are NOT

Patterns are NOT:

* primitives
* templates with hidden logic
* framework constructs
* config-driven systems

---

## Rules

### 1. No Custom Elements

❌ `<wb-card>`
✅ `<div class="wb-card">`

---

### 2. No Abstraction

* no Blade wrappers required
* no JS rendering layer
* no config-based UI

---

### 3. HTML First

* semantic HTML preferred
* structure must be explicit

---

### 4. Primitives Only

Patterns must use:

* layout primitives
* UI primitives
* utilities (when necessary)

---

### 5. Icons Are Functional Assets

Icons are optional inside patterns.

Use them only when they clarify:

* actions such as add, edit, delete, refresh
* state such as success, warning, or error
* navigation or context such as search, settings, or support

Do NOT add icons to:

* login and registration forms
* simple hero sections
* headings that are already clear without them

Pattern HTML must still read correctly if the icons are removed.

Examples may carry a denser icon layer than this catalog, but icons must still stay functional rather than decorative.

---

## Pattern Categories

* Auth
* Dashboard
* Forms
* Marketing
* Data Display
* Empty States

---

# Auth Patterns

## Login (Canonical)

```html
<main class="wb-page wb-page-center">
  <div class="wb-container wb-container-sm">

    <header class="wb-stack wb-stack-sm wb-align-center">
      <h1 class="wb-text-xl">Sign in</h1>
      <p class="wb-text-muted">Access your account</p>
    </header>

    <form class="wb-card wb-stack wb-stack-md">

      <div class="wb-field">
        <label class="wb-label">Email</label>
        <input type="email" class="wb-input" />
      </div>

      <div class="wb-field">
        <label class="wb-label">Password</label>
        <input type="password" class="wb-input" />
      </div>

      <button class="wb-btn wb-btn-primary wb-btn-block">
        Sign in
      </button>

    </form>

  </div>
</main>
```

---

## Register

```html
<main class="wb-page wb-page-center">
  <div class="wb-container wb-container-sm">

    <header class="wb-stack wb-stack-sm wb-align-center">
      <h1 class="wb-text-xl">Create account</h1>
      <p class="wb-text-muted">Start using the system</p>
    </header>

    <form class="wb-card wb-stack wb-stack-md">

      <div class="wb-field">
        <label class="wb-label">Name</label>
        <input type="text" class="wb-input" />
      </div>

      <div class="wb-field">
        <label class="wb-label">Email</label>
        <input type="email" class="wb-input" />
      </div>

      <div class="wb-field">
        <label class="wb-label">Password</label>
        <input type="password" class="wb-input" />
      </div>

      <button class="wb-btn wb-btn-primary wb-btn-block">
        Register
      </button>

    </form>

  </div>
</main>
```

---

# Dashboard Patterns

## Basic Dashboard

```html
<main class="wb-page">
  <div class="wb-container">

    <header class="wb-page-header">
      <h1>Dashboard</h1>
    </header>

    <section class="wb-grid wb-grid-3">

      <div class="wb-card">
        <h3>Total Users</h3>
        <p class="wb-text-xl">1,240</p>
      </div>

      <div class="wb-card">
        <h3>Revenue</h3>
        <p class="wb-text-xl">$8,320</p>
      </div>

      <div class="wb-card">
        <h3>Active Sessions</h3>
        <p class="wb-text-xl">312</p>
      </div>

    </section>

  </div>
</main>
```

---

## Dashboard with Table

```html
<section class="wb-section">
  <div class="wb-container">

    <header class="wb-page-header wb-split">
      <h2>Recent Activity</h2>
      <button class="wb-btn wb-btn-primary wb-icon-btn">
        <i class="wb-icon wb-icon-plus wb-icon-sm" aria-hidden="true"></i>
        Add user
      </button>
    </header>

    <div class="wb-card">

      <table class="wb-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>Active</td>
            <td>Today</td>
            <td>
              <div class="wb-action-group">
                <a class="wb-action-link" href="#">
                  <i class="wb-icon wb-icon-eye wb-icon-sm" aria-hidden="true"></i>
                  View
                </a>
                <a class="wb-action-link" href="#">
                  <i class="wb-icon wb-icon-pencil wb-icon-sm" aria-hidden="true"></i>
                  Edit
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>Pending</td>
            <td>Yesterday</td>
            <td>
              <div class="wb-action-group">
                <a class="wb-action-link" href="#">
                  <i class="wb-icon wb-icon-eye wb-icon-sm" aria-hidden="true"></i>
                  View
                </a>
                <a class="wb-action-link" href="#">
                  <i class="wb-icon wb-icon-pencil wb-icon-sm" aria-hidden="true"></i>
                  Edit
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

    </div>

  </div>
</section>
```

---

# Form Patterns

## Create / Edit Form

```html
<main class="wb-page">
  <div class="wb-container wb-container-sm">

    <header class="wb-page-header">
      <h1>Create Item</h1>
    </header>

    <form class="wb-stack wb-stack-md">

      <div class="wb-field">
        <label class="wb-label">Title</label>
        <input type="text" class="wb-input" />
      </div>

      <div class="wb-field">
        <label class="wb-label">Description</label>
        <textarea class="wb-textarea"></textarea>
      </div>

      <div class="wb-row wb-justify-end">
        <button class="wb-btn">Cancel</button>
        <button class="wb-btn wb-btn-primary">Save</button>
      </div>

    </form>

  </div>
</main>
```

---

# Marketing Patterns

## Hero Section

```html
<section class="wb-section wb-section-lg">
  <div class="wb-container wb-container-lg wb-align-center">

    <h1 class="wb-text-2xl">
      Build faster with Webblocks
    </h1>

    <p class="wb-text-muted">
      A clean, framework-free UI system
    </p>

    <div class="wb-row wb-justify-center">
      <a class="wb-btn wb-btn-primary">Get Started</a>
      <a class="wb-btn">Documentation</a>
    </div>

  </div>
</section>
```

---

## Pricing Section

```html
<section class="wb-section">
  <div class="wb-container wb-container-lg">

    <header class="wb-align-center wb-stack wb-stack-sm">
      <h2 class="wb-text-xl">Pricing</h2>
      <p class="wb-text-muted">Simple and transparent</p>
    </header>

    <div class="wb-grid wb-grid-3">

      <div class="wb-card">
        <h3>Free</h3>
        <p>$0</p>
        <button class="wb-btn wb-btn-block">Start</button>
      </div>

      <div class="wb-card">
        <h3>Pro</h3>
        <p>$12</p>
        <button class="wb-btn wb-btn-primary wb-btn-block">Upgrade</button>
      </div>

      <div class="wb-card">
        <h3>Enterprise</h3>
        <p>Custom</p>
        <button class="wb-btn wb-btn-block">Contact</button>
      </div>

    </div>

  </div>
</section>
```

---

# Empty State Patterns

## Empty List

```html
<div class="wb-card wb-align-center wb-stack wb-stack-sm">

  <i class="wb-icon wb-icon-inbox wb-icon-xl wb-icon-muted" aria-hidden="true"></i>

  <h3>No items found</h3>
  <p class="wb-text-muted">
    Start by creating your first item.
  </p>

  <button class="wb-btn wb-btn-primary wb-icon-btn">
    <i class="wb-icon wb-icon-plus wb-icon-sm" aria-hidden="true"></i>
    Create Item
  </button>

</div>
```

---

# Final Notes

Patterns are:

* stable
* minimal
* framework-free
* copy-paste friendly

---

## Relationship to PRIMITIVES.md

* PRIMITIVES.md defines **what exists**
* PATTERNS.md shows **how to use it**

---

## Status

This file represents the **first stable Pattern Catalog**.

It will expand over time, but its principles must remain unchanged.
