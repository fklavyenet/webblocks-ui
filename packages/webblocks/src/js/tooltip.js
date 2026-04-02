/* ============================================================
   WebBlocks UI — Tooltip (tooltip.js)

   Tooltips are anchored and positioned by the shared overlay
   runtime using the [data-wb-tooltip] attribute. This module adds:

   1. Programmatic show/hide API.
   2. Support for tooltips on disabled elements (which don't
      receive :hover). Wrap the disabled element in a
      <span data-wb-tooltip="..."> to work around this.
   3. data-wb-tooltip-delay — show delay in ms (default: 0).

   Usage (HTML):
     <button data-wb-tooltip="Save changes">Save</button>

   Usage (programmatic):
     WBTooltip.show(el);     // force show
     WBTooltip.hide(el);     // force hide
     WBTooltip.hideAll();    // hide all forced tooltips

   Hover, focus, and programmatic calls all feed the same
   runtime-managed tooltip layer.
   ============================================================ */

(function () {
  'use strict';

  var timers = new WeakMap ? new WeakMap() : null;
  var activeTarget = null;
  var tooltip = document.createElement('div');
  var tooltipBody = document.createElement('div');
  var tooltipArrow = document.createElement('div');
  var instance;

  tooltip.className = 'wb-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;

  tooltipBody.className = 'wb-tooltip-body';
  tooltipArrow.className = 'wb-tooltip-arrow';

  tooltip.appendChild(tooltipBody);
  tooltip.appendChild(tooltipArrow);

  instance = WBDom.overlay.create({
    kind: 'tooltip',
    group: 'tooltip',
    layer: 'anchored',
    element: tooltip,
    panel: tooltip,
    portal: false,
    position: 'anchored',
    placement: 'top-center',
    offset: 8,
    viewportPadding: 8,
    autoFocus: false,
    returnFocus: false,
    manageExpanded: false,
    manageControls: false,
    outsideClose: false,
    escapeClose: false,
    onToggle: function (isOpen) {
      tooltip.hidden = !isOpen;
    }
  });

  WBDom.overlay.ensureLayer('anchored').appendChild(tooltip);

  function getDelay(el) {
    var d = parseInt(el.getAttribute('data-wb-tooltip-delay'), 10);
    return isNaN(d) ? 0 : d;
  }

  function getPlacement(el) {
    var placement = el.getAttribute('data-wb-tooltip-placement') || 'top';
    if (placement === 'top' || placement === 'bottom') return placement + '-center';
    if (placement === 'left' || placement === 'right') return placement + '-center';
    return placement;
  }

  function clearTimer(el) {
    if (!el || !timers) return;
    clearTimeout(timers.get(el));
    timers.delete(el);
  }

  function updateTooltipContent(el) {
    tooltipBody.textContent = el.getAttribute('data-wb-tooltip') || '';
    tooltip.classList.toggle('wb-tooltip-wrap', el.hasAttribute('data-wb-tooltip-wrap'));
  }

  // ── Programmatic show/hide ────────────────────────────────

  function show(el) {
    if (!el) return;
    clearTimer(el);
    activeTarget = el;
    updateTooltipContent(el);
    instance.trigger = el;
    instance.placement = getPlacement(el);
    WBDom.overlay.open(instance);
    WBDom.emit(el, 'wb:tooltip:show');
  }

  function hide(el) {
    if (el) clearTimer(el);
    if (el && activeTarget && el !== activeTarget) return;
    if (!activeTarget) return;
    var target = activeTarget;
    activeTarget = null;
    WBDom.overlay.close(instance, 'tooltip-hide');
    WBDom.emit(target, 'wb:tooltip:hide');
  }

  function hideAll() {
    hide(activeTarget);
  }

  function scheduleShow(el) {
    if (!el) return;

    var delay = getDelay(el);
    clearTimer(el);

    if (delay <= 0) {
      show(el);
      return;
    }

    if (!timers) return;
    timers.set(el, setTimeout(function () {
      show(el);
    }, delay));
  }

  // ── Delayed hover (optional enhancement) ─────────────────
  // Only activates on elements with data-wb-tooltip-delay set.

  document.addEventListener('mouseover', function (e) {
    var el = e.target.closest('[data-wb-tooltip]');
    if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return;
    scheduleShow(el);
  });

  document.addEventListener('mouseout', function (e) {
    var el = e.target.closest('[data-wb-tooltip]');
    if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return;
    hide(el);
  });

  document.addEventListener('focusin', function (e) {
    var el = e.target.closest('[data-wb-tooltip]');
    if (!el) return;
    scheduleShow(el);
  });

  document.addEventListener('focusout', function (e) {
    var el = e.target.closest('[data-wb-tooltip]');
    if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return;
    hide(el);
  });

  // ── Public API ────────────────────────────────────────────

  window.WBTooltip = {
    show:    show,
    hide:    hide,
    hideAll: hideAll
  };

})();
