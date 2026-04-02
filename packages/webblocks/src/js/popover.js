/* ============================================================
   WebBlocks UI — Popover (popover.js)

   Usage (HTML):
     <div class="wb-popover" data-wb-popover>
       <button class="wb-btn wb-btn-secondary" data-wb-toggle="popover">
         Info
       </button>
       <div class="wb-popover-panel">
         <div class="wb-popover-body">Content here</div>
       </div>
     </div>

   Placement modifiers (on .wb-popover wrapper):
     wb-popover-top | wb-popover-right | wb-popover-left | wb-popover-end

   Dismiss:
     <button data-wb-dismiss="popover">Close</button>

   JS API:
     WBPopover.open(wrapperEl)
     WBPopover.close(wrapperEl)
     WBPopover.closeAll()
   ============================================================ */

(function () {
  'use strict';

  var instances = new WeakMap();
  var wrapperPanels = new WeakMap();

  function getWrapperFromTrigger(trigger) {
    return trigger.closest('[data-wb-popover]') || trigger.closest('.wb-popover');
  }

  function getPanel(wrapper, trigger) {
    if (!wrapper) return null;

    var targetId = trigger && (trigger.getAttribute('data-wb-target') || trigger.getAttribute('aria-controls'));
    var panel = targetId ? document.querySelector(targetId.charAt(0) === '#' ? targetId : ('#' + targetId)) : null;
    if (!panel) panel = wrapperPanels.get(wrapper) || null;
    if (!panel) panel = wrapper.querySelector('.wb-popover-panel');
    if (!panel) return null;

    WBDom.overlay.ensureId(panel, 'popover-panel');
    if (trigger) {
      trigger.setAttribute('aria-controls', panel.id);
      if (!trigger.getAttribute('data-wb-target')) trigger.setAttribute('data-wb-target', '#' + panel.id);
    }
    wrapperPanels.set(wrapper, panel);
    return panel;
  }

  function getWrapper(target) {
    if (!target) return null;
    if (target.classList && target.classList.contains('wb-popover')) return target;
    if (target.classList && target.classList.contains('wb-popover-panel')) {
      var instance = instances.get(target);
      return instance ? instance.wrapper : null;
    }
    return target.closest('[data-wb-popover]') || target.closest('.wb-popover');
  }

  function getTrigger(panel) {
    var id = WBDom.overlay.ensureId(panel, 'popover-panel');
    return document.querySelector('[data-wb-toggle="popover"][data-wb-target="#' + id + '"]') ||
      document.querySelector('[data-wb-toggle="popover"][aria-controls="' + id + '"]');
  }

  function getPlacement(wrapper, trigger, panel) {
    if (panel.hasAttribute('data-wb-placement')) return panel.getAttribute('data-wb-placement');
    if (trigger && trigger.hasAttribute('data-wb-placement')) return trigger.getAttribute('data-wb-placement');
    if (wrapper && wrapper.hasAttribute('data-wb-placement')) return wrapper.getAttribute('data-wb-placement');

    var align = wrapper && wrapper.classList.contains('wb-popover-end') ? 'end' : 'start';
    if (wrapper && wrapper.classList.contains('wb-popover-top')) return 'top-' + align;
    if (wrapper && wrapper.classList.contains('wb-popover-right')) return 'right-start';
    if (wrapper && wrapper.classList.contains('wb-popover-left')) return 'left-start';
    return 'bottom-' + align;
  }

  function syncWrapperState(wrapper, panel, isOpen) {
    if (wrapper) wrapper.classList.toggle('is-open', isOpen);
    panel.classList.toggle('wb-popover-panel-end', !!(wrapper && wrapper.classList.contains('wb-popover-end')));
  }

  function ensureInstance(wrapper, trigger, panel) {
    var instance = instances.get(panel);
    if (instance) {
      instance.trigger = trigger || instance.trigger;
      instance.placement = getPlacement(wrapper, instance.trigger, panel);
      syncWrapperState(wrapper, panel, instance.active);
      WBDom.overlay.mount(instance);
      return instance;
    }

    instance = WBDom.overlay.create({
      kind: 'popover',
      group: 'anchored-toggle',
      layer: 'anchored',
      element: panel,
      panel: panel,
      trigger: trigger,
      position: 'anchored',
      placement: getPlacement(wrapper, trigger, panel),
      offset: 8,
      viewportPadding: 8,
      autoFocus: false,
      returnFocus: true,
      restoreOnClose: false,
      onToggle: function (isOpen) {
        syncWrapperState(wrapper, panel, isOpen);
      },
      onAfterOpen: function () {
        if (wrapper) WBDom.emit(wrapper, 'wb:popover:open');
      },
      onAfterClose: function () {
        if (wrapper) WBDom.emit(wrapper, 'wb:popover:close');
      }
    });

    instance.wrapper = wrapper;
    wrapperPanels.set(wrapper, panel);
    instances.set(panel, instance);
    WBDom.overlay.mount(instance);
    return instance;
  }

  function init() {
    document.querySelectorAll('[data-wb-popover], .wb-popover').forEach(function (wrapper) {
      var trigger = wrapper.querySelector('[data-wb-toggle="popover"]');
      if (!trigger) return;
      var panel = getPanel(wrapper, trigger);
      if (!panel) return;
      ensureInstance(wrapper, trigger, panel);
    });
  }

  // ── Open ──────────────────────────────────────────────────

  function open(wrapper) {
    if (!wrapper) return;
    var trigger = wrapper.querySelector('[data-wb-toggle="popover"]');
    var panel = getPanel(wrapper, trigger);
    if (!panel || !trigger) return;

    var instance = ensureInstance(wrapper, trigger, panel);
    instance.wrapper = wrapper;
    instance.trigger = trigger;
    instance.placement = getPlacement(wrapper, trigger, panel);
    WBDom.overlay.open(instance);
  }

  // ── Close ─────────────────────────────────────────────────

  function close(wrapper) {
    wrapper = getWrapper(wrapper);
    if (!wrapper) return;

    var panel = getPanel(wrapper);
    var trigger = wrapper.querySelector('[data-wb-toggle="popover"]') || (panel ? getTrigger(panel) : null);
    panel = getPanel(wrapper, trigger);
    if (!panel) return;

    var instance = ensureInstance(wrapper, trigger, panel);
    WBDom.overlay.close(instance, 'api');
  }

  function closeAll() {
    WBDom.overlay.closeAll(function (instance) {
      return instance.kind === 'popover';
    });
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    // Toggle trigger
    var trigger = e.target.closest('[data-wb-toggle="popover"]');
    if (trigger) {
      var wrapper = getWrapperFromTrigger(trigger);
      if (!wrapper) return;
      var panel = getPanel(wrapper, trigger);
      var instance = panel && ensureInstance(wrapper, trigger, panel);
      if (instance && instance.active) {
        close(wrapper);
      } else {
        open(wrapper);
      }
      return;
    }

    // Dismiss button inside popover
    var dismiss = e.target.closest('[data-wb-dismiss="popover"]');
    if (dismiss) {
      var wrapper = getWrapper(dismiss.closest('.wb-popover-panel') || dismiss);
      if (wrapper) close(wrapper);
      return;
    }
  });

  // ── Public API ────────────────────────────────────────────

  window.WBPopover = {
    open:     open,
    close:    close,
    closeAll: closeAll
  };

  init();

})();
