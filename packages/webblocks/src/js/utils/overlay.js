/* ============================================================
   WebBlocks UI — Overlay Utilities (utils/overlay.js)

   Internal shared overlay runtime used by anchored overlays,
   viewport overlays, and root-managed programmatic layers.
   Exposed on window.WBDom.overlay for WB modules only.
   ============================================================ */

(function () {
  'use strict';

  var html = document.documentElement;
  var ROOT_ID = 'wb-overlay-root';
  var activeStack = [];
  var uid = 0;
  var root = null;
  var layers = {};
  var backdrop = null;

  if (html) html.classList.add('wb-js');

  function nextId(prefix) {
    uid += 1;
    return 'wb-' + prefix + '-' + uid;
  }

  function ensureId(el, prefix) {
    if (!el.id) el.id = nextId(prefix || 'overlay');
    return el.id;
  }

  function ensureRoot() {
    if (root && document.body && document.body.contains(root)) return root;
    root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement('div');
      root.id = ROOT_ID;
      root.className = 'wb-overlay-root';
      document.body.appendChild(root);
    }
    return root;
  }

  function ensureLayer(name) {
    if (layers[name] && ensureRoot().contains(layers[name])) return layers[name];

    var layer = ensureRoot().querySelector('.wb-overlay-layer--' + name);
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'wb-overlay-layer wb-overlay-layer--' + name;
      ensureRoot().appendChild(layer);
    }

    layers[name] = layer;
    return layer;
  }

  function getBackdrop() {
    if (backdrop && ensureLayer('dialog').contains(backdrop)) return backdrop;

    backdrop = ensureLayer('dialog').querySelector('.wb-overlay-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'wb-overlay-backdrop';
      backdrop.hidden = true;
      ensureLayer('dialog').appendChild(backdrop);
    }

    return backdrop;
  }

  function getPlacement(value) {
    return typeof value === 'function' ? value() : (value || 'bottom-start');
  }

  function getSide(placement) {
    return String(placement || 'bottom-start').split('-')[0] || 'bottom';
  }

  function getAlign(placement) {
    return String(placement || 'bottom-start').split('-')[1] || 'start';
  }

  function computeCoords(rect, width, height, placement, offset) {
    var side = getSide(placement);
    var align = getAlign(placement);
    var top = rect.bottom + offset;
    var left = rect.left;

    if (side === 'top') top = rect.top - height - offset;
    if (side === 'right') left = rect.right + offset;
    if (side === 'left') left = rect.left - width - offset;

    if (side === 'bottom' || side === 'top') {
      if (align === 'end') left = rect.right - width;
      if (align === 'center') left = rect.left + ((rect.width - width) / 2);
    }

    if (side === 'right' || side === 'left') {
      top = rect.top;
      if (align === 'end') top = rect.bottom - height;
      if (align === 'center') top = rect.top + ((rect.height - height) / 2);
    }

    return { top: top, left: left };
  }

  function fitsWithinViewport(coords, width, height, padding) {
    return coords.top >= padding &&
      coords.left >= padding &&
      coords.top + height <= window.innerHeight - padding &&
      coords.left + width <= window.innerWidth - padding;
  }

  function pickPlacement(rect, width, height, preferred, offset, padding) {
    var side = getSide(preferred);
    var align = getAlign(preferred);
    var opposite = {
      bottom: 'top',
      top: 'bottom',
      left: 'right',
      right: 'left'
    }[side] || 'top';
    var placements = [preferred, opposite + '-' + align];

    for (var i = 0; i < placements.length; i += 1) {
      var coords = computeCoords(rect, width, height, placements[i], offset);
      if (fitsWithinViewport(coords, width, height, padding)) {
        return { placement: placements[i], coords: coords };
      }
    }

    return {
      placement: placements[0],
      coords: computeCoords(rect, width, height, placements[0], offset)
    };
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function syncBodyLock() {
    var lock = activeStack.some(function (instance) {
      return instance.active && instance.lockScroll;
    });

    document.body.classList.toggle('wb-overlay-lock', lock);
  }

  function syncBackdrop() {
    var topmost = null;
    var i;

    for (i = activeStack.length - 1; i >= 0; i -= 1) {
      if (activeStack[i].active && activeStack[i].backdrop) {
        topmost = activeStack[i];
        break;
      }
    }

    var el = getBackdrop();
    if (!topmost) {
      el.hidden = true;
      el.className = 'wb-overlay-backdrop';
      delete el.dataset.wbOverlayOwner;
      return;
    }

    el.className = 'wb-overlay-backdrop' + (topmost.backdropClass ? ' ' + topmost.backdropClass : '');
    el.hidden = false;
    el.dataset.wbOverlayOwner = topmost.id;
    ensureLayer('dialog').insertBefore(el, ensureLayer('dialog').firstChild);
  }

  function registerActive(instance) {
    unregisterActive(instance);
    activeStack.push(instance);
  }

  function unregisterActive(instance) {
    activeStack = activeStack.filter(function (item) { return item !== instance; });
  }

  function portalToLayer(instance) {
    if (!instance.portal || !instance.element) return;

    if (!instance.placeholder && instance.element.parentNode) {
      instance.originalParent = instance.element.parentNode;
      instance.originalNextSibling = instance.element.nextSibling;
      instance.placeholder = document.createComment('wb-overlay:' + instance.id);
      instance.originalParent.insertBefore(instance.placeholder, instance.element);
    }

    ensureLayer(instance.layer).appendChild(instance.element);
    instance.element.setAttribute('data-wb-overlay-portaled', 'true');
    instance.element.setAttribute('data-wb-overlay-runtime', 'true');
    instance.element.setAttribute('data-wb-overlay-kind', instance.kind || 'overlay');
  }

  function mount(instance) {
    if (!instance || !instance.element) return;
    portalToLayer(instance);
  }

  function restoreFromLayer(instance) {
    if (!instance.portal || !instance.element || !instance.placeholder || !instance.originalParent) return;

    instance.originalParent.insertBefore(instance.element, instance.placeholder);
    instance.originalParent.removeChild(instance.placeholder);
    instance.placeholder = null;
    instance.originalParent = null;
    instance.originalNextSibling = null;
    instance.element.removeAttribute('data-wb-overlay-portaled');
    instance.element.removeAttribute('data-wb-overlay-runtime');
    instance.element.removeAttribute('data-wb-overlay-kind');
  }

  function syncTriggerAria(instance, expanded) {
    if (!instance.trigger) return;

    if (instance.manageExpanded !== false) {
      instance.trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }

    if (instance.panel && instance.manageControls !== false && instance.kind !== 'tooltip') {
      instance.trigger.setAttribute('aria-controls', ensureId(instance.panel, instance.kind + '-panel'));
    }
  }

  function restoreFocus(instance) {
    if (!instance.returnFocus || !instance.previouslyFocused || typeof instance.previouslyFocused.focus !== 'function') return;
    instance.previouslyFocused.focus();
    instance.previouslyFocused = null;
  }

  function measureAnchored(instance) {
    var panel = instance.panel || instance.element;
    if (!panel || !instance.trigger) return;

    panel.style.visibility = 'hidden';
    panel.style.pointerEvents = 'none';
    panel.style.top = '0px';
    panel.style.left = '0px';

    var panelRect = panel.getBoundingClientRect();
    var triggerRect = instance.trigger.getBoundingClientRect();
    var preferred = getPlacement(instance.placement);
    var offset = instance.offset == null ? 8 : instance.offset;
    var padding = instance.viewportPadding == null ? 8 : instance.viewportPadding;
    var picked = pickPlacement(triggerRect, panelRect.width, panelRect.height, preferred, offset, padding);
    var coords = picked.coords;

    coords.left = clamp(coords.left, padding, Math.max(padding, window.innerWidth - panelRect.width - padding));
    coords.top = clamp(coords.top, padding, Math.max(padding, window.innerHeight - panelRect.height - padding));

    panel.style.top = Math.round(coords.top) + 'px';
    panel.style.left = Math.round(coords.left) + 'px';
    panel.style.visibility = '';
    panel.style.pointerEvents = '';
    panel.dataset.wbOverlayPlacement = picked.placement;
    panel.dataset.wbOverlaySide = getSide(picked.placement);

    if (instance.matchWidth) {
      panel.style.minWidth = Math.round(triggerRect.width) + 'px';
    }
  }

  function update(instance) {
    if (!instance || !instance.active) return;
    if (instance.position === 'anchored') measureAnchored(instance);
    if (typeof instance.onUpdate === 'function') instance.onUpdate(instance);
  }

  function updateAnchored() {
    activeStack.forEach(function (instance) {
      if (instance.active && instance.position === 'anchored') update(instance);
    });
  }

  function closeByGroup(group, except) {
    activeStack.slice().forEach(function (instance) {
      if (!instance.active || instance === except) return;
      if (instance.group === group) requestClose(instance, 'group-switch');
    });
  }

  function requestClose(instance, reason) {
    if (!instance || !instance.active) return;

    if (typeof instance.onRequestClose === 'function') {
      instance.onRequestClose(reason, instance);
      return;
    }

    close(instance, reason);
  }

  function open(instance) {
    if (!instance || !instance.element) return;

    if (instance.group && instance.exclusive !== false) {
      closeByGroup(instance.group, instance);
    }

    instance.previouslyFocused = document.activeElement;
    instance.active = true;

    portalToLayer(instance);

    instance.element.classList.add('is-open');
    if (typeof instance.onToggle === 'function') instance.onToggle(true, instance);
    syncTriggerAria(instance, true);
    registerActive(instance);
    syncBodyLock();
    syncBackdrop();
    update(instance);

    if (instance.autoFocus === true) {
      WBDom.focusFirst(instance.panel || instance.element);
    }

    if (typeof instance.onAfterOpen === 'function') instance.onAfterOpen(instance);
  }

  function close(instance, reason) {
    if (!instance || !instance.element || !instance.active) return;

    instance.active = false;
    instance.element.classList.remove('is-open');
    if (typeof instance.onToggle === 'function') instance.onToggle(false, instance);
    syncTriggerAria(instance, false);
    if (instance.restoreOnClose !== false) {
      restoreFromLayer(instance);
    }
    unregisterActive(instance);
    syncBodyLock();
    syncBackdrop();

    if (typeof instance.onAfterClose === 'function') instance.onAfterClose(instance, reason);
    restoreFocus(instance);
  }

  function closeAll(filter) {
    activeStack.slice().forEach(function (instance) {
      if (!instance.active) return;
      if (typeof filter === 'function' && !filter(instance)) return;
      requestClose(instance, 'close-all');
    });
  }

  function getTopmost(predicate) {
    for (var i = activeStack.length - 1; i >= 0; i -= 1) {
      var instance = activeStack[i];
      if (!instance.active) continue;
      if (!predicate || predicate(instance)) return instance;
    }
    return null;
  }

  function create(options) {
    options = options || {};

    return {
      id: options.id || nextId(options.kind || 'overlay'),
      kind: options.kind || 'overlay',
      group: options.group || null,
      layer: options.layer || 'anchored',
      element: options.element || null,
      panel: options.panel || options.element || null,
      trigger: options.trigger || null,
      portal: options.portal !== false,
      exclusive: options.exclusive !== false,
      position: options.position || null,
      placement: options.placement || 'bottom-start',
      offset: options.offset,
      viewportPadding: options.viewportPadding,
      matchWidth: !!options.matchWidth,
      backdrop: !!options.backdrop,
      backdropClass: options.backdropClass || '',
      lockScroll: !!options.lockScroll,
      trapFocus: !!options.trapFocus,
      autoFocus: options.autoFocus !== false,
      returnFocus: options.returnFocus !== false,
      restoreOnClose: options.restoreOnClose !== false,
      manageExpanded: options.manageExpanded !== false,
      manageControls: options.manageControls !== false,
      outsideClose: options.outsideClose !== false,
      escapeClose: options.escapeClose !== false,
      onToggle: options.onToggle,
      onUpdate: options.onUpdate,
      onRequestClose: options.onRequestClose,
      onAfterOpen: options.onAfterOpen,
      onAfterClose: options.onAfterClose,
      placeholder: null,
      originalParent: null,
      originalNextSibling: null,
      previouslyFocused: null,
      active: false
    };
  }

  document.addEventListener('click', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('wb-overlay-backdrop')) {
      var ownerId = e.target.dataset.wbOverlayOwner;
      var owner = getTopmost(function (instance) {
        return instance.active && instance.backdrop && (!ownerId || instance.id === ownerId);
      });
      if (owner) requestClose(owner, 'backdrop-click');
      return;
    }

    var top = getTopmost(function (instance) {
      return instance.active && instance.outsideClose !== false;
    });

    if (!top) return;
    if (top.element && top.element.contains(e.target)) return;
    if (top.trigger && top.trigger.contains(e.target)) return;
    requestClose(top, 'outside-click');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var esc = getTopmost(function (instance) {
        return instance.active && instance.escapeClose !== false;
      });
      if (esc) {
        e.preventDefault();
        requestClose(esc, 'escape');
        return;
      }
    }

    if (e.key === 'Tab') {
      var trap = getTopmost(function (instance) {
        return instance.active && instance.trapFocus;
      });
      if (trap) WBDom.trapFocus(e, trap.panel || trap.element);
    }
  });

  window.addEventListener('resize', updateAnchored);
  window.addEventListener('scroll', updateAnchored, true);

  WBDom.overlay = {
    ensureRoot: ensureRoot,
    ensureLayer: ensureLayer,
    ensureId: ensureId,
    create: create,
    mount: mount,
    open: open,
    close: close,
    requestClose: requestClose,
    closeAll: closeAll,
    update: update,
    updateAnchored: updateAnchored,
    getTopmost: getTopmost
  };

})();
