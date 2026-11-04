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
    'details > summary:first-of-type',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  function isTabbable(element) {
    if (element.tabIndex < 0 || element.matches(':disabled') ||
        element.closest('[inert], [hidden]')) return false;

    // Closed details can still expose descendant boxes in some engines. Only
    // its first direct summary (and that summary's contents) remain interactive.
    for (var parent = element.parentElement; parent; parent = parent.parentElement) {
      if (parent.tagName !== 'DETAILS' || parent.open) continue;
      var summary = Array.from(parent.children).find(function (child) {
        return child.tagName === 'SUMMARY';
      });
      if (!summary || !summary.contains(element)) return false;
    }

    var style = window.getComputedStyle(element);
    return style.visibility !== 'hidden' && style.visibility !== 'collapse' &&
      element.getClientRects().length > 0;
  }

  function getTabbableElements(container) {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
      .filter(isTabbable)
      .map(function (element, index) { return { element: element, index: index }; })
      .sort(function (a, b) {
        var aOrder = a.element.tabIndex > 0 ? a.element.tabIndex : Infinity;
        var bOrder = b.element.tabIndex > 0 ? b.element.tabIndex : Infinity;
        return aOrder === bOrder ? a.index - b.index : aOrder - bOrder;
      })
      .map(function (entry) { return entry.element; });
  }

  function focusContainer(container) {
    if (!container.hasAttribute('tabindex')) {
      container.setAttribute('tabindex', '-1');
      container.addEventListener('blur', function () {
        if (container.getAttribute('tabindex') === '-1') container.removeAttribute('tabindex');
      }, { once: true });
    }
    container.focus({ preventScroll: true });
  }

  // ── Focus trap ────────────────────────────────────────────
  // Keeps Tab focus cycling within a container element.
  // Call inside a keydown handler.

  function trapFocus(e, container) {
    if (e.key !== 'Tab') return;
    var focusable = getTabbableElements(container);
    if (!focusable.length) {
      e.preventDefault();
      focusContainer(container);
      return;
    }

    var first = focusable[0];
    var last  = focusable[focusable.length - 1];

    if (focusable.indexOf(document.activeElement) === -1) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    } else if (e.shiftKey) {
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
      if (!container.isConnected || !container.getClientRects().length) return;
      var first = getTabbableElements(container)[0];
      if (first) first.focus({ preventScroll: true });
      else focusContainer(container);
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
