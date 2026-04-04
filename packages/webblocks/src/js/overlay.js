/* ============================================================
   WebBlocks UI — Overlay (overlay.js)

   Canonical trigger:
     <button data-wb-overlay-open="example-overlay">Open overlay</button>

   Canonical close hooks:
     <button data-wb-overlay-close>Close</button>
     <div class="wb-overlay-backdrop" data-wb-overlay-close></div>
   ============================================================ */

(function () {
  'use strict';

  var instances = new WeakMap();
  var activeOverlay = null;

  function normalizeTarget(value) {
    if (!value) return null;
    return value.charAt(0) === '#' ? value : ('#' + value);
  }

  function resolveOverlay(target) {
    if (!target) return null;
    if (target.nodeType === 1) return target;
    return document.querySelector(normalizeTarget(String(target)));
  }

  function ensureCloseButtonLabel(button) {
    if (!button || button.getAttribute('aria-label')) return;
    button.setAttribute('aria-label', 'Close');
  }

  function syncAria(trigger, overlay) {
    if (!trigger || !overlay) return;
    if (overlay.id) trigger.setAttribute('aria-controls', overlay.id);
    if (!trigger.getAttribute('aria-haspopup')) trigger.setAttribute('aria-haspopup', 'dialog');
  }

  function syncExpanded(trigger, isOpen) {
    if (!trigger) return;
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  function focusOverlayTarget(instance) {
    requestAnimationFrame(function () {
      var dialog = instance.panel || instance.element;
      if (!dialog) return;

      var first = dialog.querySelector(WBDom.FOCUSABLE);
      if (first) {
        first.focus();
        return;
      }

      if (!dialog.hasAttribute('tabindex')) {
        dialog.setAttribute('tabindex', '-1');
        dialog.setAttribute('data-wb-overlay-auto-tabindex', 'true');
      }

      dialog.focus();
    });
  }

  function cleanupDialogFocus(dialog) {
    if (!dialog || dialog.getAttribute('data-wb-overlay-auto-tabindex') !== 'true') return;
    dialog.removeAttribute('tabindex');
    dialog.removeAttribute('data-wb-overlay-auto-tabindex');
  }

  function setOverlayState(overlay, isOpen) {
    overlay.hidden = !isOpen;
    overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  }

  function ensureInstance(overlay, trigger) {
    var instance = instances.get(overlay);
    var dialog = overlay.querySelector('.wb-overlay-dialog') || overlay;

    overlay.querySelectorAll('.wb-overlay-close').forEach(ensureCloseButtonLabel);

    if (instance) {
      instance.trigger = trigger || instance.trigger;
      instance.panel = dialog;
      if (trigger) syncAria(trigger, overlay);
      return instance;
    }

    setOverlayState(overlay, !overlay.hidden);

    instance = WBDom.overlay.create({
      kind: 'overlay',
      group: 'dialog',
      layer: 'dialog',
      element: overlay,
      panel: dialog,
      trigger: trigger,
      lockScroll: true,
      trapFocus: true,
      autoFocus: false,
      returnFocus: true,
      manageExpanded: false,
      onToggle: function (isOpen) {
        setOverlayState(overlay, isOpen);
        syncExpanded(instance.trigger, isOpen);
      },
      onAfterOpen: function () {
        activeOverlay = overlay;
        focusOverlayTarget(instance);
        WBDom.emit(overlay, 'wb:overlay:open');
      },
      onAfterClose: function () {
        cleanupDialogFocus(dialog);
        if (activeOverlay === overlay) activeOverlay = null;
        WBDom.emit(overlay, 'wb:overlay:close');
      }
    });

    instances.set(overlay, instance);

    if (trigger) syncAria(trigger, overlay);

    return instance;
  }

  function open(target, trigger) {
    var overlay = resolveOverlay(target);
    if (!overlay) return;

    var instance = ensureInstance(overlay, trigger);
    instance.trigger = trigger || instance.trigger;
    if (instance.trigger) syncAria(instance.trigger, overlay);
    WBDom.overlay.open(instance);
  }

  function close(target) {
    var overlay = resolveOverlay(target) || activeOverlay;
    if (!overlay) return;
    WBDom.overlay.close(ensureInstance(overlay), 'api');
  }

  document.addEventListener('click', function (e) {
    var openTrigger = e.target.closest('[data-wb-overlay-open]');
    if (openTrigger) {
      e.preventDefault();
      open(openTrigger.getAttribute('data-wb-overlay-open'), openTrigger);
      return;
    }

    var closeTrigger = e.target.closest('[data-wb-overlay-close]');
    if (!closeTrigger) return;

    var explicitTarget = closeTrigger.getAttribute('data-wb-overlay-close');
    var overlay = explicitTarget ? resolveOverlay(explicitTarget) : closeTrigger.closest('.wb-overlay');
    if (overlay) close(overlay);
  });

  window.WBOverlay = {
    open: open,
    close: close,
    getActive: function () {
      return activeOverlay;
    }
  };

})();
