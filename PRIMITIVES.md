# Webblocks UI — Primitives Definition

## Purpose

This document defines the **primitive layer** of Webblocks UI.

It answers:

* What is a primitive?
* What is NOT a primitive?
* How Webblocks is structured internally
* How to correctly reason about UI building in Webblocks

---

## Core Principle

Webblocks is **not a primitive abstraction library**.

Webblocks is:

> A **vanilla UI system** built on
> **foundation + primitives + patterns**

---

## Terminology

### Primitive

A primitive is a **low-level, reusable UI building block**.

* It does **one job**
* It is **composable**
* It is **not a full UI screen**
* It does **not imply structure beyond itself**

Examples:

* `wb-btn`
* `wb-input`
* `wb-card`

---

### Layout Primitive

A layout primitive controls **structure and flow**, not visual identity.

Examples:

* `wb-container`
* `wb-grid`
* `wb-stack`
* `wb-row`
* `wb-page`
* `wb-section`

These are **not UI primitives**.

They are **layout tools**.

---

### UI Primitive

A UI primitive is a **visual building block**.

Examples:

* buttons
* inputs
* cards
* labels
* badges
* alerts

They are:

* reusable
* style-defined
* behavior-agnostic (or lightly enhanced with JS)

---

### Utility

A utility is a **single-purpose helper class**.

* alignment
* text tone
* visibility
* small state hints

Utilities are:

* optional
* non-structural
* never a UI by themselves

---

### Pattern

A pattern is a **real UI composition**.

Examples:

* login page
* dashboard
* settings page
* pricing section
* CRUD form

A pattern is:

> A composition of primitives using plain HTML.

---

## What Webblocks Is NOT

Webblocks is NOT:

* a framework
* a primitive abstraction system
* a custom HTML language
* a utility-first CSS system
* a JS-driven UI engine

---

## Architectural Layers

### 1. Foundation

Design tokens and global rules.

Includes:

* colors
* spacing
* typography
* radius
* shadows
* theme variables

This layer **does not produce UI directly**.

---

### 2. Layout Primitives

Responsible for:

* page structure
* spacing flow
* alignment

Examples:

* container
* grid
* stack
* row
* section
* page wrappers

---

### 3. UI Primitives

Reusable UI pieces.

Examples:

* button
* input
* textarea
* select
* card
* modal shell
* table shell

These are:

* simple
* composable
* not opinionated about full layouts

---

### 4. Utilities

Small helpers.

Examples:

* text-muted
* align-center
* justify-between
* hidden/visible states

Utilities **support primitives**, but do not replace them.

---

### 5. Patterns

Real UI implementations.

Examples:

* auth screens
* dashboards
* forms
* marketing sections

Patterns are:

* **the public face of Webblocks**
* **what users actually copy and use**

---

## Critical Rules

### 1. No Custom HTML Elements

HTML must remain standard.

❌ `<wb-card>`
✅ `<div class="wb-card">`

---

### 2. No Abstraction Layer

No:

* config-driven UI
* schema-based rendering
* virtual primitive systems

---

### 3. No CSS Overreach

CSS must not:

* simulate behavior
* replace JS logic
* create hidden state machines

---

### 4. No JS Structure Pollution

JavaScript must not:

* inject structural HTML
* redefine layout
* act as a rendering engine

---

### 5. Primitives Are Not Products

A button is not a product.

A dashboard is.

---

## Mental Model

> Foundation provides rules
> Layout primitives provide structure
> UI primitives provide building blocks
> Patterns provide real UI

---

## Naming Philosophy

Webblocks uses a consistent prefix:

* `wb-*`

This ensures:

* isolation
* predictability
* no collision with native HTML or third-party CSS

---

## Final Definition

Webblocks is:

> A **primitive-driven, pattern-oriented UI system**
> built with **pure HTML, CSS, and JavaScript**

---

## Status

This file is the **source of truth** for:

* primitive classification
* system architecture
* terminology

All other documentation must align with this model.
