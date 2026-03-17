/* ============================================================
   WebBlocks UI — Tooltip (tooltip.js)

   The tooltip appearance is handled entirely by CSS via the
   [data-wb-tooltip] attribute. This JS module adds:

   1. Programmatic show/hide API.
   2. Support for tooltips on disabled elements (which don't
      receive :hover). Wrap the disabled element in a
      <span data-wb-tooltip="..."> to work around this.
   3. data-wb-tooltip-delay — show delay in ms (default: 0).

   Usage (HTML — pure CSS, no JS needed):
     <button data-wb-tooltip="Save changes">Save</button>

   Usage (programmatic):
     WBTooltip.show(el);     // force show
     WBTooltip.hide(el);     // force hide
     WBTooltip.hideAll();    // hide all forced tooltips

   Forced show/hide works by toggling .wb-tooltip-force-show
   and .wb-tooltip-force-hide classes. Pair these with CSS
   rules if custom programmatic behavior is needed.
   ============================================================ */

(function () {
  'use strict';

  // ── Delay support ─────────────────────────────────────────
  // Reads data-wb-tooltip-delay from element.
  // Default: 0ms. Hover intent: add a small delay like 300.

  var timers = new WeakMap ? new WeakMap() : null;

  function getDelay(el) {
    var d = parseInt(el.getAttribute('data-wb-tooltip-delay'), 10);
    return isNaN(d) ? 0 : d;
  }

  // ── Programmatic show/hide ────────────────────────────────

  function show(el) {
    if (!el) return;
    el.classList.remove('wb-tooltip-force-hide');
    el.classList.add('wb-tooltip-force-show');
    WBDom.emit(el, 'wb:tooltip:show');
  }

  function hide(el) {
    if (!el) return;
    el.classList.remove('wb-tooltip-force-show');
    el.classList.add('wb-tooltip-force-hide');
    WBDom.emit(el, 'wb:tooltip:hide');
  }

  function hideAll() {
    document.querySelectorAll('.wb-tooltip-force-show').forEach(function (el) {
      hide(el);
    });
  }

  // ── Delayed hover (optional enhancement) ─────────────────
  // Only activates on elements with data-wb-tooltip-delay set.

  document.addEventListener('mouseover', function (e) {
    var el = e.target.closest('[data-wb-tooltip][data-wb-tooltip-delay]');
    if (!el || !timers) return;

    var delay = getDelay(el);
    if (delay <= 0) return;

    // Clear any pending hide timer
    clearTimeout(timers.get(el));

    // Schedule show
    timers.set(el, setTimeout(function () {
      show(el);
    }, delay));
  });

  document.addEventListener('mouseout', function (e) {
    var el = e.target.closest('[data-wb-tooltip][data-wb-tooltip-delay]');
    if (!el || !timers) return;

    clearTimeout(timers.get(el));

    // Reset forced state when mouse leaves — let CSS take over
    el.classList.remove('wb-tooltip-force-show', 'wb-tooltip-force-hide');
  });

  // ── Public API ────────────────────────────────────────────

  window.WBTooltip = {
    show:    show,
    hide:    hide,
    hideAll: hideAll
  };

})();
