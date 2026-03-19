/* ============================================================
   WebBlocks UI — DOM Utilities (utils/dom.js)

   Shared helpers used across all WB modules.
   Exposed on window.WBDom — not intended for direct use by
   page authors; internal API for WB modules only.
   ============================================================ */

(function () {
  'use strict';

  // ── Focusable elements selector ───────────────────────────
  // Used by modal.js, drawer.js (focus trap)

  var FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  // ── Focus trap ────────────────────────────────────────────
  // Keeps Tab focus cycling within a container element.
  // Call inside a keydown handler.

  function trapFocus(e, container) {
    if (e.key !== 'Tab') return;
    var focusable = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
    if (!focusable.length) return;

    var first = focusable[0];
    var last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // ── Focus first focusable element in container ────────────

  function focusFirst(container) {
    requestAnimationFrame(function () {
      var first = container.querySelector(FOCUSABLE_SELECTOR);
      if (first) first.focus();
    });
  }

  // ── Emit a custom event ───────────────────────────────────

  function emit(element, eventName, detail) {
    element.dispatchEvent(new CustomEvent(eventName, {
      bubbles: true,
      detail: detail || {}
    }));
  }

  // ── Debounce ──────────────────────────────────────────────
  // Returns a debounced version of fn.

  function debounce(fn, delay) {
    var timer;
    return function () {
      var args = arguments;
      var ctx  = this;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
    };
  }

  // ── Resolve a target element from a selector string ───────

  function resolveTarget(selector) {
    if (!selector) return null;
    if (selector === 'body') return document.body;
    return document.querySelector(selector);
  }

  // ── Public API ────────────────────────────────────────────

  window.WBDom = {
    FOCUSABLE:     FOCUSABLE_SELECTOR,
    trapFocus:     trapFocus,
    focusFirst:    focusFirst,
    emit:          emit,
    debounce:      debounce,
    resolveTarget: resolveTarget
  };

})();
