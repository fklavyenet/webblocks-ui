/* ============================================================
   WebBlocks UI — Dropdown (dropdown.js)

   Native opt-in: add popover="manual" to the existing wb-dropdown-menu.
   The shared manager owns native show/hide, placement and policy.

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
  var MENU = '.wb-dropdown-menu';
  var ITEM = '.wb-dropdown-item';
  var SUBMENU_TRIGGER = 'button[data-wb-toggle="submenu"]';
  var HOVER_OPEN_DELAY = 120;
  var HOVER_GRACE_DELAY = 300;

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
    var instance = instances.get(menu);
    if (instance && instance.parentOverlay) return instance.trigger;
    if (menu.previousElementSibling && menu.previousElementSibling.matches(SUBMENU_TRIGGER)) {
      return menu.previousElementSibling;
    }
    var id = WBDom.overlay.ensureId(menu, 'dropdown-menu');
    return document.querySelector('[data-wb-toggle="dropdown"][data-wb-target="#' + id + '"]') ||
      document.querySelector('[data-wb-toggle="dropdown"][aria-controls="' + id + '"]') ||
      (menu.closest('.wb-dropdown') && menu.closest('.wb-dropdown').querySelector('[data-wb-toggle="dropdown"]'));
  }

  function getSubmenu(trigger) {
    var sibling = trigger.nextElementSibling;
    if (sibling && sibling.matches(MENU)) return sibling;
    var panel = document.getElementById(trigger.getAttribute('aria-controls'));
    var instance = panel && instances.get(panel);
    return instance && instance.active && instance.trigger === trigger ? panel : null;
  }

  function getPlacement(trigger, menu, parentOverlay) {
    if (parentOverlay) return getComputedStyle(trigger).direction === 'rtl' ? 'left-start' : 'right-start';
    var parent = trigger ? trigger.closest('.wb-dropdown') : menu.closest('.wb-dropdown');
    if (menu.hasAttribute('data-wb-placement')) return menu.getAttribute('data-wb-placement');
    if (trigger && trigger.hasAttribute('data-wb-placement')) return trigger.getAttribute('data-wb-placement');
    if (parent && parent.hasAttribute('data-wb-placement')) return parent.getAttribute('data-wb-placement');
    return (parent && parent.classList.contains('wb-dropdown-end')) || menu.classList.contains('wb-dropdown-menu-end')
      ? 'bottom-end'
      : 'bottom-start';
  }

  function getSubmenuAnchor(triggerRect, instance) {
    var parentRect = instance.parentOverlay.element.getBoundingClientRect();
    return {
      left: parentRect.left,
      right: parentRect.right,
      width: parentRect.width,
      top: triggerRect.top,
      bottom: triggerRect.bottom,
      height: triggerRect.height
    };
  }

  function getItems(menu) {
    return Array.from(menu.querySelectorAll('button' + ITEM + ', a' + ITEM + '[href]')).filter(function (item) {
      return item.closest(MENU) === menu;
    });
  }

  function isDisabled(item) {
    return item.matches(':disabled, [aria-disabled="true"]');
  }

  function prepareCascade(instance) {
    var menu = instance.element;
    var items = getItems(menu);
    var triggers = items.filter(function (item) {
      return item.matches(SUBMENU_TRIGGER) && getSubmenu(item);
    });
    if (!instance.parentOverlay && !triggers.length && !instance.cascade) return;

    if (!instance.cascade) {
      instance.cascade = true;
      instance.returnFocus = false;
      menu.classList.add('wb-dropdown-menu--cascade');
      menu.setAttribute('role', 'menu');
      menu.tabIndex = -1;
      menu.addEventListener('keydown', function (event) { navigateMenu(event, instance); });
    }
    if (instance.trigger) {
      instance.trigger.setAttribute('aria-haspopup', 'menu');
      instance.trigger.setAttribute('aria-expanded', instance.active ? 'true' : 'false');
      if (!menu.hasAttribute('aria-label') && !menu.hasAttribute('aria-labelledby')) {
        menu.setAttribute('aria-labelledby', WBDom.overlay.ensureId(instance.trigger, 'dropdown-trigger'));
      }
    }
    items.forEach(function (item) {
      if (!item.hasAttribute('role')) item.setAttribute('role', 'menuitem');
      if (item.parentElement.tagName === 'LI' && !item.parentElement.hasAttribute('role')) {
        item.parentElement.setAttribute('role', 'none');
      }
      item.tabIndex = -1;
    });
    triggers.forEach(function (item) {
      var panel = getSubmenu(item);
      item.setAttribute('aria-controls', WBDom.overlay.ensureId(panel, 'dropdown-menu'));
      item.setAttribute('aria-haspopup', 'menu');
      item.setAttribute('aria-expanded', panel.classList.contains('is-open') ? 'true' : 'false');
    });
  }

  function ensureInstance(menu, trigger, parentOverlay) {
    var instance = instances.get(menu);
    if (instance) {
      instance.trigger = trigger || instance.trigger;
      instance.parentOverlay = parentOverlay || instance.parentOverlay;
      instance.placement = getPlacement(instance.trigger, menu, instance.parentOverlay);
      prepareCascade(instance);
      if (!instance.parentOverlay) WBDom.overlay.mount(instance);
      return instance;
    }

    instance = WBDom.overlay.create({
      kind: 'dropdown',
      group: 'anchored-toggle',
      layer: 'anchored',
      element: menu,
      panel: menu,
      trigger: trigger,
      parentOverlay: parentOverlay,
      position: 'anchored',
      placement: getPlacement(trigger, menu, parentOverlay),
      anchorRect: parentOverlay ? getSubmenuAnchor : null,
      fallbackPlacements: parentOverlay ? ['bottom-start', 'top-start'] : null,
      offset: parentOverlay ? 0 : 4,
      viewportPadding: 8,
      autoFocus: false,
      returnFocus: !parentOverlay,
      restoreOnClose: !!parentOverlay,
      matchWidth: menu.hasAttribute('data-wb-match-width'),
      onAfterClose: function (closed, reason) {
        menu.classList.remove('is-leaving');
        clearTimeout(closed.selectionTimer);
        clearHoverIntent(closed);
        closed.hoverOpened = false;
        if (!closed.cascade || !closed.trigger) return;
        if (['escape', 'submenu-back', 'dismiss-control'].includes(reason)) closed.trigger.focus();
      }
    });

    instances.set(menu, instance);
    prepareCascade(instance);
    if (!parentOverlay) WBDom.overlay.mount(instance);
    return instance;
  }

  function init() {
    document.querySelectorAll('[data-wb-toggle="dropdown"]').forEach(function (trigger) {
      var menu = getMenu(trigger);
      if (!menu) return;
      ensureInstance(menu, trigger);
    });
  }

  function open(trigger, menu, activation) {
    if (!menu || !trigger) return;
    var parentOverlay = null;
    if (trigger.matches(SUBMENU_TRIGGER)) {
      parentOverlay = instances.get(trigger.closest(MENU));
      if (!parentOverlay || !parentOverlay.active || isDisabled(trigger)) return;
      clearHoverIntent(parentOverlay);
    }
    var instance = ensureInstance(menu, trigger, parentOverlay);
    if (!instance.active || !instance.cascade) WBDom.overlay.open(instance);
    if (instance.active && instance.cascade) {
      instance.hoverOpened = activation === 'hover';
      if (instance.hoverOpened) return;
      var items = focusableItems(menu);
      (items[activation === 'last' ? items.length - 1 : 0] || menu).focus();
    }
  }

  function close(menu) {
    if (!menu) return;
    var instance = instances.get(menu);
    if (!instance) {
      var trigger = getTrigger(menu);
      if (trigger && trigger.matches(SUBMENU_TRIGGER)) return;
      instance = ensureInstance(menu, trigger);
    }
    WBDom.overlay.close(instance, 'api');
  }

  function requestUserClose(menu, reason, originalEvent) {
    if (!menu) return;
    WBDom.overlay.requestClose(instances.get(menu) || ensureInstance(menu, getTrigger(menu)), reason, {
      originalEvent: originalEvent || null
    });
  }

  function toggle(trigger, pointerType) {
    var menu = trigger.matches(SUBMENU_TRIGGER) ? getSubmenu(trigger) : getMenu(trigger);
    if (!menu) return;
    var instance = instances.get(menu);
    if ((instance && instance.active) || (menu.hasAttribute('popover') &&
        typeof menu.showPopover === 'function' && menu.matches(':popover-open'))) {
      if (instance && instance.parentOverlay) {
        if (instance.hoverOpened && pointerType === 'mouse') open(trigger, menu);
        else WBDom.overlay.close(instance, 'submenu-back');
      } else close(menu);
    } else {
      open(trigger, menu);
    }
  }

  function getCascadeRoot(instance) {
    while (instance.parentOverlay) instance = instance.parentOverlay;
    return instance;
  }

  function getCascadeMenu(target) {
    var menu = target instanceof Element && instances.get(target.closest(MENU));
    return menu && menu.active && menu.cascade ? menu : null;
  }

  function isInCascade(menu, owner) {
    for (; menu; menu = menu.parentOverlay) {
      if (menu === owner) return true;
    }
    return false;
  }

  function clearHoverIntent(menu) {
    clearTimeout(menu.hoverTimer);
    menu.hoverTrigger = null;
  }

  function getActiveChild(menu) {
    return WBDom.overlay.getTopmost(function (child) { return child.parentOverlay === menu; });
  }

  function enterHover(event) {
    if (event.pointerType !== 'mouse' || event.buttons) return;
    var menu = getCascadeMenu(event.target);
    if (!menu) return;

    // Portaled submenus are still part of the same hover region.
    for (var owner = menu.parentOverlay; owner; owner = owner.parentOverlay) clearHoverIntent(owner);
    if (getCascadeMenu(event.relatedTarget) !== menu) clearHoverIntent(menu);

    var trigger = event.target.closest(SUBMENU_TRIGGER);
    if (!trigger || trigger.contains(event.relatedTarget) || isDisabled(trigger)) return;
    var panel = getSubmenu(trigger);
    if (!panel) return;
    var child = getActiveChild(menu);
    if (child && child.trigger === trigger) return;

    // Give the pointer time to cross a sibling row diagonally on its way to
    // an open side panel. Entering that panel cancels the pending switch.
    clearHoverIntent(menu);
    menu.hoverTrigger = trigger;
    menu.hoverTimer = setTimeout(function () {
      clearHoverIntent(menu);
      if (!menu.active || !trigger.isConnected || getSubmenu(trigger) !== panel) return;
      var activeChild = getActiveChild(menu);
      if (activeChild && isInCascade(getCascadeMenu(document.activeElement), activeChild)) {
        trigger.focus({ preventScroll: true });
      }
      open(trigger, panel, 'hover');
    }, child ? HOVER_GRACE_DELAY : HOVER_OPEN_DELAY);
  }

  function leaveHover(event) {
    if (event.pointerType !== 'mouse' || event.buttons) return;
    var next = getCascadeMenu(event.relatedTarget);
    for (var menu = getCascadeMenu(event.target); menu; menu = menu.parentOverlay) {
      if (menu.hoverTrigger && !menu.hoverTrigger.contains(event.relatedTarget)) clearHoverIntent(menu);
      if (isInCascade(next, menu)) break;

      clearHoverIntent(menu);
      var child = getActiveChild(menu);
      if (child && child.hoverOpened) scheduleHoverClose(menu, child);
    }
  }

  function scheduleHoverClose(menu, child) {
    menu.hoverTimer = setTimeout(function () {
      if (child.active && child.hoverOpened && !isInCascade(getCascadeMenu(document.activeElement), child)) {
        WBDom.overlay.close(child, 'hover-leave');
      }
    }, HOVER_GRACE_DELAY);
  }

  function focusableItems(menu) {
    return getItems(menu).filter(function (item) {
      return !isDisabled(item) && !item.closest('[inert], [aria-hidden="true"]') && item.getClientRects().length;
    });
  }

  function navigateMenu(event, instance) {
    var menu = instance.element;
    if (!instance.active || event.defaultPrevented || event.target.closest(MENU) !== menu) return;
    clearHoverIntent(instance);
    if (event.key === 'Tab') {
      // Anchor the browser's next Tab stop to the opener, even for portaled panels.
      var root = getCascadeRoot(instance);
      close(root.element);
      root.trigger.focus();
      return;
    }

    var item = event.target.closest(ITEM);
    var rtl = getComputedStyle(menu).direction === 'rtl';
    var forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    var backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === forward && item && item.matches(SUBMENU_TRIGGER)) {
      var submenu = getSubmenu(item);
      if (!submenu || isDisabled(item)) return;
      event.preventDefault();
      open(item, submenu);
    } else if (event.key === backward && instance.parentOverlay) {
      event.preventDefault();
      WBDom.overlay.close(instance, 'submenu-back');
    } else if (event.key === ' ' && item && item.matches('a[href]') && !isDisabled(item)) {
      event.preventDefault();
      item.click();
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      var items = focusableItems(menu);
      if (!items.length) return;
      var index = items.indexOf(item);
      if (event.key === 'Home') index = 0;
      else if (event.key === 'End') index = items.length - 1;
      else if (event.key === 'ArrowDown') index = (index + 1) % items.length;
      else index = index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length;
      items[index].focus();
    }
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('pointerover', enterHover);
  document.addEventListener('pointerout', leaveHover);

  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
    var trigger = e.target.closest('[data-wb-toggle="dropdown"]');
    if (!trigger || isDisabled(trigger)) return;
    var menu = getMenu(trigger);
    if (!menu || !ensureInstance(menu, trigger).cascade) return;
    e.preventDefault();
    open(trigger, menu, e.key === 'ArrowUp' ? 'last' : 'first');
  });

  document.addEventListener('click', function (e) {
    var submenuTrigger = e.target.closest(SUBMENU_TRIGGER);
    if (submenuTrigger) {
      toggle(submenuTrigger, e.pointerType);
      return;
    }

    var trigger = e.target.closest('[data-wb-toggle="dropdown"]');
    if (trigger) {
      // popovertarget may coexist for native invoker semantics; do not run its
      // default action after the shared runtime has already toggled the panel.
      var menu = getMenu(trigger);
      if (menu && menu.hasAttribute('popover') && typeof menu.showPopover === 'function') e.preventDefault();
      toggle(trigger);
      return;
    }

    // Dismiss on data-wb-dismiss
    var dismiss = e.target.closest('[data-wb-dismiss="dropdown"]');
    if (dismiss) {
      var menu = dismiss.closest('.wb-dropdown-menu');
      if (menu) requestUserClose(menu, 'dismiss-control', e);
      return;
    }

    // Close dropdown when a menu item is clicked (but allow other handlers to run first)
    var menuItem = e.target.closest('.wb-dropdown-item');
    if (menuItem) {
      var menu = menuItem.closest('.wb-dropdown-menu');
      var instance = menu && instances.get(menu);
      if (instance && instance.active) {
        if (instance.cascade && isDisabled(menuItem)) {
          e.preventDefault();
          return;
        }
        // Let other click handlers, such as theme toggles, finish first.
        var root = getCascadeRoot(instance);
        clearTimeout(root.selectionTimer);
        root.selectionTimer = setTimeout(function () {
          if (root.active) close(root.element);
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
