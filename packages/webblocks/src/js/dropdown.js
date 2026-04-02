/* ============================================================
   WebBlocks UI — Dropdown (dropdown.js)

   Usage:
     <div class="wb-dropdown">
       <button data-wb-toggle="dropdown" data-wb-target="#myMenu">
         Open
       </button>
       <ul class="wb-dropdown-menu" id="myMenu">
         <li><a class="wb-dropdown-item" href="#">Item</a></li>
       </ul>
     </div>

   Or self-contained (toggle + menu share the same .wb-dropdown parent):
     <div class="wb-dropdown">
       <button data-wb-toggle="dropdown">Open</button>
       <ul class="wb-dropdown-menu"> ... </ul>
     </div>
   ============================================================ */

(function () {
  'use strict';

  var instances = new WeakMap();

  function getMenu(trigger) {
    var targetId = trigger.getAttribute('data-wb-target') || trigger.getAttribute('aria-controls');
    var menu = targetId ? document.querySelector(targetId.charAt(0) === '#' ? targetId : ('#' + targetId)) : null;

    if (!menu) {
      // Fallback: first .wb-dropdown-menu in the same .wb-dropdown parent
      var parent = trigger.closest('.wb-dropdown');
      menu = parent ? parent.querySelector('.wb-dropdown-menu') : null;
    }

    if (!menu) return null;

    WBDom.overlay.ensureId(menu, 'dropdown-menu');
    trigger.setAttribute('aria-controls', menu.id);
    if (!trigger.getAttribute('data-wb-target')) {
      trigger.setAttribute('data-wb-target', '#' + menu.id);
    }

    return menu;
  }

  function getTrigger(menu) {
    var id = WBDom.overlay.ensureId(menu, 'dropdown-menu');
    return document.querySelector('[data-wb-toggle="dropdown"][data-wb-target="#' + id + '"]') ||
      document.querySelector('[data-wb-toggle="dropdown"][aria-controls="' + id + '"]') ||
      (menu.closest('.wb-dropdown') && menu.closest('.wb-dropdown').querySelector('[data-wb-toggle="dropdown"]'));
  }

  function getPlacement(trigger, menu) {
    var parent = trigger ? trigger.closest('.wb-dropdown') : menu.closest('.wb-dropdown');
    if (menu.hasAttribute('data-wb-placement')) return menu.getAttribute('data-wb-placement');
    if (trigger && trigger.hasAttribute('data-wb-placement')) return trigger.getAttribute('data-wb-placement');
    if (parent && parent.hasAttribute('data-wb-placement')) return parent.getAttribute('data-wb-placement');
    return (parent && parent.classList.contains('wb-dropdown-end')) || menu.classList.contains('wb-dropdown-menu-end')
      ? 'bottom-end'
      : 'bottom-start';
  }

  function ensureInstance(menu, trigger) {
    var instance = instances.get(menu);
    if (instance) {
      instance.trigger = trigger || instance.trigger;
      instance.placement = getPlacement(instance.trigger, menu);
      WBDom.overlay.mount(instance);
      return instance;
    }

    instance = WBDom.overlay.create({
      kind: 'dropdown',
      group: 'anchored-toggle',
      layer: 'anchored',
      element: menu,
      panel: menu,
      trigger: trigger,
      position: 'anchored',
      placement: getPlacement(trigger, menu),
      offset: 4,
      viewportPadding: 8,
      autoFocus: false,
      returnFocus: true,
      restoreOnClose: false,
      matchWidth: menu.hasAttribute('data-wb-match-width'),
      onAfterClose: function () {
        menu.classList.remove('is-leaving');
      }
    });

    instances.set(menu, instance);
    WBDom.overlay.mount(instance);
    return instance;
  }

  function init() {
    document.querySelectorAll('[data-wb-toggle="dropdown"]').forEach(function (trigger) {
      var menu = getMenu(trigger);
      if (!menu) return;
      ensureInstance(menu, trigger);
    });
  }

  function open(trigger, menu) {
    if (!menu || !trigger) return;
    var instance = ensureInstance(menu, trigger);
    instance.trigger = trigger;
    instance.placement = getPlacement(trigger, menu);
    WBDom.overlay.open(instance);
  }

  function close(menu) {
    if (!menu) return;
    var instance = ensureInstance(menu, getTrigger(menu));
    WBDom.overlay.close(instance, 'api');
  }

  function toggle(trigger) {
    var menu = getMenu(trigger);
    if (!menu) return;
    var instance = ensureInstance(menu, trigger);
    if (instance.active) {
      close(menu);
    } else {
      open(trigger, menu);
    }
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-wb-toggle="dropdown"]');
    if (trigger) {
      toggle(trigger);
      return;
    }

    // Dismiss on data-wb-dismiss
    var dismiss = e.target.closest('[data-wb-dismiss="dropdown"]');
    if (dismiss) {
      var menu = dismiss.closest('.wb-dropdown-menu');
      if (menu) close(menu);
      return;
    }

    // Close dropdown when a menu item is clicked (but allow other handlers to run first)
    var menuItem = e.target.closest('.wb-dropdown-item');
    if (menuItem) {
      var menu = menuItem.closest('.wb-dropdown-menu');
      var instance = menu && instances.get(menu);
      if (instance && instance.active) {
        // Delay close slightly to allow other click handlers (like theme toggle) to run
        setTimeout(function () {
          var active = instances.get(menu);
          if (active && active.active) close(menu);
        }, 10);
        return;
      }
    }
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBDropdown = {
    open: function (menuEl) {
      var trigger = getTrigger(menuEl);
      open(trigger, menuEl);
    },
    close: close,
    closeAll: function () {
      WBDom.overlay.closeAll(function (instance) {
        return instance.kind === 'dropdown';
      });
    }
  };

  init();

})();
