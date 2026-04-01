# WebBlocks UI — Primitive Boundary Map

## Purpose

This file defines what counts as a primitive, what does not, and where the current shipped families belong.

Source of truth:

- `packages/webblocks/src/css/`
- `packages/webblocks/src/js/`
- `packages/webblocks/build.sh`

## Classification Model

WebBlocks uses these buckets:

1. Foundation
2. Layout helpers
3. UI primitives
4. Surfaces
5. Patterns
6. Interactive hooks

## Foundation

Foundation is not a primitive layer.

Foundation includes:

- tokens
- dark mode overrides
- accent, preset, radius, density, shadow, font, border axes
- reset
- global element styling

Foundation sets system rules. It does not provide page building blocks by itself.

## Layout Helpers

Layout helpers are not UI primitives.

They solve structure and flow only.

Canonical layout helpers:

- `wb-container*`
- `wb-section*`
- `wb-stack*`
- `wb-cluster*`
- `wb-split`
- `wb-grid*`
- `wb-grid-auto*`
- `wb-row`
- `wb-col-*`

## UI Primitives

A primitive is a reusable UI building block with a clear local contract.

Canonical primitive families include:

- button
- badge
- form controls and field system
- table
- modal
- dropdown
- tabs
- accordion
- collapse
- breadcrumb
- pagination
- avatar
- toast
- divider
- popover
- drawer
- radio-card
- action controls
- icons

Examples:

- `wb-btn`
- `wb-input`
- `wb-table`
- `wb-modal`
- `wb-dropdown`
- `wb-tabs`

Primitives are controls and local UI contracts.

They are not framed content regions.

## Surfaces

Surfaces are visible structured regions that are larger than a single primitive but smaller than a full page pattern.

Canonical surfaces include:

- `wb-card`
- `wb-stat`
- `wb-toolbar`
- `wb-filter-bar`
- `wb-callout`
- `wb-empty`
- `wb-list`
- `wb-link-list`
- `wb-promo`
- `wb-page-header`
- `wb-settings-section`

Boundary rules:

- `wb-card` is a surface, not a primitive
- `wb-card` is the canonical global container surface and the only generic framed surface noun
- dashboard work areas still use `wb-card`
- `wb-page-header` is a page-context surface, not a generic layout helper
- `wb-settings-section` belongs to settings-shell vocabulary
- page-header titles and page-intro titles are family-specific contracts, not one shared generic title primitive

## What Is Not A Primitive

These are not primitives even if they are reusable:

- `wb-card`
- `wb-callout`
- `wb-stat`
- `wb-toolbar`
- `wb-filter-bar`
- `wb-empty`
- `wb-list`
- `wb-link-list`

They are surfaces because they group content as visible framed regions.

## Patterns

Patterns are screen-level or page-level compositions.

Canonical pattern families:

- `wb-auth-shell`
- `wb-dashboard-shell`
- `wb-settings-shell`
- `wb-content-shell`
- `wb-page-intro`
- marketing families such as `wb-hero` and footer structures

Patterns are what users should usually start from for real pages.

## Interactive Hooks

Some shipped behavior contracts are not class-first.

Examples:

- `data-wb-toggle`
- `data-wb-target`
- `data-wb-dismiss`
- `data-wb-tooltip`
- `data-wb-collapse`
- `data-wb-nav-group`
- `data-wb-ajax-toggle`

These are not UI primitives.
They are interaction hooks owned by shipped JS and attribute-driven CSS behavior.

## What Is Not Canonical Primitive Vocabulary

Do not treat these as current canonical primitive contracts:

- `wb-page`
- `wb-page-center`
- `wb-btn-block`
- `wb-stack-sm`
- `wb-stack-md`
- `wb-align-center`
- `wb-checkbox`
- a second framed-surface noun beside `wb-card`
- a generic page-title class shared across page-header and page-intro contexts

## Alias Rules

Aliases may ship, but they are not equal canonical vocabulary.

Examples:

- `wb-shell*` is legacy compatibility for dashboard shell
- `wb-sidebar-header` is an older alias beside `wb-sidebar-brand`
- old tab names remain compatible but should not be the first documented path

## Practical Rule

When choosing between two valid nouns:

- prefer the more global, clearer, more reusable canonical family
- prefer `wb-card` over any second framed-surface synonym
- prefer shell vocabulary only inside its shell boundary

## Final Model

WebBlocks is not primitive-first in usage.

It is:

- pattern-first for real pages
- primitive-based for composition
- utility-supported for small adjustments
- enforced by shipped source, not by invented examples
