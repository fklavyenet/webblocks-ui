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
  var CLOSE_REQUEST_REASONS = {
    escape: true,
    outside: true,
    'close-control': true,
    'dismiss-control': true
  };
  var uid = 0;
  var root = null;
  var layers = {};
  var visibilityStates = new WeakMap();

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

  function getNativeHost(except) {
    var top = getTopmost(function (instance) {
      return instance !== except && ((instance.nativeDialog && instance.element.open) ||
        (instance.nativePopover && instance.element.matches(':popover-open') && except &&
          ((except.trigger && instance.element.contains(except.trigger)) || instance.element.contains(except.element))));
    });
    return top ? top.element : null;
  }

  function ensureLayer(name, nativeHost) {
    // Native child surfaces share their host's browser top-layer subtree.
    // For dialogs this also preserves native inertness outside the subtree.
    if (arguments.length < 2) nativeHost = getNativeHost();
    if (nativeHost) {
      var nativeLayer = Array.from(nativeHost.children).find(function (child) {
        return child.getAttribute('data-wb-native-layer') === name;
      });
      if (!nativeLayer) {
        nativeLayer = document.createElement('div');
        nativeLayer.className = 'wb-overlay-layer wb-overlay-layer--' + name;
        nativeLayer.setAttribute('data-wb-native-layer', name);
        nativeHost.appendChild(nativeLayer);
      }
      return nativeLayer;
    }
    if (layers[name] && layers[name].parentElement === ensureRoot()) return layers[name];

    var layer = Array.from(ensureRoot().children).find(function (child) {
      return child.classList.contains('wb-overlay-layer--' + name);
    });
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'wb-overlay-layer wb-overlay-layer--' + name;
      ensureRoot().appendChild(layer);
    }

    layers[name] = layer;
    return layer;
  }

  function isVisibilityAncestor(node) {
    return !!(node && node.nodeType === 1 && (
      node.id === ROOT_ID ||
      (node.classList && node.classList.contains('wb-overlay-layer'))
    ));
  }

  function getVisibilityAncestors(element) {
    var ancestors = [];
    var node = element ? element.parentElement : null;

    while (node) {
      if (isVisibilityAncestor(node)) {
        ancestors.push(node);
      }

      if (node.id === ROOT_ID) break;
      node = node.parentElement;
    }

    return ancestors;
  }

  function hasActiveDescendant(ancestor) {
    return activeStack.some(function (instance) {
      return !!(instance.active && instance.element && ancestor.contains(instance.element));
    });
  }

  function trackVisibility(instance) {
    var ancestors;

    if (!instance || !instance.element) return;

    instance.restoreElementHidden = instance.element.hasAttribute('hidden');
    if (instance.restoreElementHidden) {
      instance.element.hidden = false;
    }

    ancestors = getVisibilityAncestors(instance.element);
    instance.visibilityAncestors = ancestors;

    ancestors.forEach(function (ancestor) {
      var state = visibilityStates.get(ancestor);

      if (!state) {
        state = {
          count: 0,
          originalHidden: ancestor.hasAttribute('hidden')
        };
        visibilityStates.set(ancestor, state);
      }

      state.count += 1;

      if (state.originalHidden) {
        ancestor.hidden = false;
      }
    });
  }

  function untrackVisibility(instance) {
    var ancestors = instance && instance.visibilityAncestors ? instance.visibilityAncestors : [];

    if (instance && instance.restoreElementHidden) {
      instance.element.hidden = true;
      instance.restoreElementHidden = false;
    }

    ancestors.forEach(function (ancestor) {
      var state = visibilityStates.get(ancestor);

      if (!state) return;

      state.count = Math.max(0, state.count - 1);

      if (state.count === 0) {
        if (state.originalHidden && !hasActiveDescendant(ancestor)) {
          ancestor.hidden = true;
        }
        visibilityStates.delete(ancestor);
        return;
      }

      if (state.originalHidden) {
        ancestor.hidden = false;
      }
    });

    if (instance) {
      instance.visibilityAncestors = [];
    }
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

  function isDialogInstance(instance) {
    return !!(instance && instance.layer === 'dialog');
  }

  function canReceiveFocus(element) {
    return !!(
      element &&
      typeof element.focus === 'function' &&
      document.contains(element) &&
      !element.hasAttribute('disabled') &&
      element.getAttribute('aria-hidden') !== 'true'
    );
  }

  function getParentOverlay(instance) {
    var i;

    if (!instance || !instance.trigger) return null;

    for (i = activeStack.length - 1; i >= 0; i -= 1) {
      var candidate = activeStack[i];
      if (!candidate.active || candidate === instance) continue;
      if (candidate.element && candidate.element.contains(instance.trigger)) return candidate;
      if (candidate.panel && candidate.panel.contains(instance.trigger)) return candidate;
    }

    return null;
  }

  function shouldElevateAnchored(instance) {
    return !!(instance && instance.layer === 'anchored' && getParentOverlay(instance));
  }

  function getBackdropElement(instance) {
    var el;

    if (!instance || !instance.backdrop) return null;
    var layer = ensureLayer('dialog', instance.nativeHost);
    if (instance.backdropElement && layer.contains(instance.backdropElement)) {
      return instance.backdropElement;
    }

    el = instance.backdropElement || document.createElement('div');
    el.className = 'wb-overlay-backdrop';
    el.hidden = true;
    el.setAttribute('data-wb-overlay-backdrop', 'true');
    el.setAttribute('data-wb-overlay-owner', instance.id);
    layer.appendChild(el);
    instance.backdropElement = el;
    return el;
  }

  function syncBackdropElement(instance) {
    var el = getBackdropElement(instance);

    if (!el) return;

    el.className = 'wb-overlay-backdrop' + (instance.backdropClass ? ' ' + instance.backdropClass : '');
    el.hidden = !instance.active;
    el.setAttribute('data-wb-overlay-owner', instance.id);
  }

  function updateLayering() {
    var dialogOffset = 0;
    var anchoredOffset = 0;

    activeStack.forEach(function (instance) {
      var element;
      var backdropElement;
      var zIndex;

      if (!instance.active || !instance.element) return;

      element = instance.element;
      backdropElement = instance.backdrop ? getBackdropElement(instance) : null;

      if (isDialogInstance(instance) || shouldElevateAnchored(instance)) {
        zIndex = 'calc(var(--wb-z-modal) + ' + (dialogOffset + 1) + ')';
        if (backdropElement) {
          backdropElement.style.zIndex = 'calc(var(--wb-z-modal) + ' + dialogOffset + ')';
          syncBackdropElement(instance);
        }
        dialogOffset += 2;
      } else if (instance.layer === 'anchored') {
        zIndex = 'calc(var(--wb-z-dropdown) + ' + anchoredOffset + ')';
        anchoredOffset += 1;
      } else {
        zIndex = '';
      }

      element.style.zIndex = zIndex;
    });

    activeStack.forEach(function (instance) {
      if (!instance.active || !instance.backdropElement) return;
      if (!instance.backdrop) return;
      syncBackdropElement(instance);
    });
  }

  function syncInteractions() {
    var topDialog = getTopmost(function (instance) {
      return instance.active && isDialogInstance(instance);
    });
    var topInteractive = getTopmost(function (instance) {
      return instance.active && instance.interactive !== false;
    });

    activeStack.forEach(function (instance) {
      if (!instance.element) return;

      if (!instance.active) {
        instance.element.removeAttribute('data-wb-overlay-interactive');
        return;
      }

      if (isDialogInstance(instance)) {
        instance.element.setAttribute('data-wb-overlay-interactive', instance === topInteractive && instance === topDialog ? 'true' : 'false');
        return;
      }

      instance.element.setAttribute('data-wb-overlay-interactive', instance === topInteractive ? 'true' : 'false');
    });
  }

  function syncStackState() {
    syncBodyLock();
    updateLayering();
    syncInteractions();
  }

  function normalizeCloseReason(reason) {
    if (reason === 'backdrop-click' || reason === 'outside-click') return 'outside';
    return reason || '';
  }

  function dispatchCloseRequest(instance, reason, originalEvent) {
    var event;

    if (!instance || !instance.element || !CLOSE_REQUEST_REASONS[reason]) return true;

    event = new CustomEvent('wb:overlay:close-request', {
      bubbles: true,
      cancelable: true,
      detail: {
        overlay: instance.element,
        type: instance.kind || 'overlay',
        reason: reason,
        opener: instance.trigger || null,
        trigger: instance.trigger || null,
        originalEvent: originalEvent || null
      }
    });

    return instance.element.dispatchEvent(event);
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
    if (instance.nativePopover && instance.element.matches(':popover-open')) return;

    if (!instance.placeholder && instance.element.parentNode) {
      instance.originalParent = instance.element.parentNode;
      instance.originalNextSibling = instance.element.nextSibling;
      instance.placeholder = document.createComment('wb-overlay:' + instance.id);
      instance.originalParent.insertBefore(instance.placeholder, instance.element);
    }

    instance.nativeHost = instance.nativeBorrowHost || instance.dialogNativeHost || getNativeHost(instance);
    ensureLayer(instance.layer, instance.nativeHost).appendChild(instance.element);
    instance.element.setAttribute('data-wb-overlay-portaled', 'true');
    instance.element.setAttribute('data-wb-overlay-runtime', 'true');
    instance.element.setAttribute('data-wb-overlay-kind', instance.kind || 'overlay');
  }

  function mount(instance) {
    if (!instance || !instance.element) return;
    portalToLayer(instance);
    instance.element.setAttribute('data-wb-overlay-runtime', 'true');
    instance.element.setAttribute('data-wb-overlay-kind', instance.kind || 'overlay');
    instance.element.setAttribute('data-wb-overlay-layer', instance.layer || 'anchored');
    if (instance.backdrop) getBackdropElement(instance);
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
    instance.element.removeAttribute('data-wb-overlay-layer');
  }

  function restorePopoverSource(instance) {
    if (!instance.nativeBorrowHost) return;
    restoreFromLayer(instance);
    instance.nativeBorrowHost = null;
    instance.nativeHost = null;
    instance.portal = false;
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
    var fallback;

    if (!instance.returnFocus) return;

    fallback = getTopmost(function (activeInstance) {
      return activeInstance.active && activeInstance.trapFocus;
    });

    if (canReceiveFocus(instance.previouslyFocused) && (!(instance.nativeDialog || instance.nativePopover) || !fallback ||
        fallback.element.contains(instance.previouslyFocused))) {
      instance.previouslyFocused.focus();
      instance.previouslyFocused = null;
      return;
    }

    if (fallback) {
      WBDom.focusFirst(fallback.panel || fallback.element);
    }

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
      // A nested anchored overlay must not close the native surface hosting it.
      if ((instance.nativePopover || except.nativePopover) &&
          instance.element && except.trigger && instance.element.contains(except.trigger)) return;
      if (instance.group === group) requestClose(instance, 'group-switch');
    });
  }

  function requestClose(instance, reason, options) {
    var normalizedReason;

    if (!instance || !instance.active) return;

    options = options || {};
    normalizedReason = normalizeCloseReason(reason);

    if (options.userInitiated !== false && CLOSE_REQUEST_REASONS[normalizedReason]) {
      if (!dispatchCloseRequest(instance, normalizedReason, options.originalEvent)) return;
    }

    if (typeof instance.onRequestClose === 'function') {
      instance.onRequestClose(normalizedReason, instance, options.originalEvent || null);
      return;
    }

    close(instance, normalizedReason);
  }

  function open(instance) {
    if (!instance || !instance.element) return;
    if (instance.nativeDialog && instance.active && instance.element.open) return;
    var popoverOpen = instance.nativePopover && instance.element.matches(':popover-open');
    if (popoverOpen && instance.active) return;

    if (instance.layer === 'dialog' && instance.trigger) {
      instance.dialogNativeHost = null;
      // Selecting a dropdown action may open a dialog. Close native dropdown
      // ancestors first so their delayed item-close cannot tear down that dialog.
      var menu = getTopmost(function (candidate) {
        return candidate.nativePopover && candidate.kind === 'dropdown' && candidate.element.contains(instance.trigger);
      });
      while (menu) {
        instance.dialogNativeHost = menu.trigger && menu.trigger.closest('dialog:modal, [popover]:popover-open');
        close(menu, 'dialog-open');
        menu = getTopmost(function (candidate) {
          return candidate.nativePopover && candidate.kind === 'dropdown' && candidate.element.contains(instance.trigger);
        });
      }
    }

    if (instance.group && instance.exclusive !== false) {
      closeByGroup(instance.group, instance);
    }

    instance.previouslyFocused = instance.nativePopover ? (instance.trigger || document.activeElement) : document.activeElement;
    instance.active = true;

    if (instance.nativePopover) {
      var host = getNativeHost(instance);
      var parent = getParentOverlay(instance);
      if (isDialogInstance(parent)) host = parent.nativeDialog ? parent.element : (parent.panel || parent.element);
      // Out-of-tree targets must join their invoker's modal/focus scope. Most
      // native panels already belong there and never leave their source DOM.
      if (host && !host.contains(instance.element)) {
        if (popoverOpen) { instance.element.hidePopover(); popoverOpen = false; }
        instance.nativeBorrowHost = host;
        instance.portal = true;
      }
    }

    portalToLayer(instance);
    trackVisibility(instance);

    instance.element.classList.add('is-open');
    if (instance.nativeDialog) {
      // Upgrade a declaratively open/non-modal dialog to the supported modal
      // lifecycle. Never emulate showModal with the open attribute alone.
      if (instance.element.open && !instance.element.matches(':modal')) instance.element.close();
      if (!instance.element.open) instance.element.showModal();
    }
    if (instance.nativePopover && !popoverOpen) {
      try {
        instance.element.showPopover({ source: instance.trigger });
      } catch (error) {
        instance.active = false;
        instance.element.classList.remove('is-open');
        untrackVisibility(instance);
        syncTriggerAria(instance, false);
        restorePopoverSource(instance);
        throw error;
      }
      // beforetoggle can cancel opening. Leave no stale runtime/ARIA state.
      if (!instance.element.matches(':popover-open')) {
        instance.active = false;
        instance.element.classList.remove('is-open');
        untrackVisibility(instance);
        syncTriggerAria(instance, false);
        restorePopoverSource(instance);
        return;
      }
    }
    if (typeof instance.onToggle === 'function') instance.onToggle(true, instance);
    syncTriggerAria(instance, true);
    registerActive(instance);
    syncStackState();
    update(instance);

    if (instance.autoFocus === true && !instance.nativeDialog) {
      WBDom.focusFirst(instance.panel || instance.element);
    }

    if (typeof instance.onAfterOpen === 'function') instance.onAfterOpen(instance);
  }

  function close(instance, reason) {
    if (!instance || !instance.element) return;
    if (!instance.active) {
      // A direct native show may precede its queued toggle notification.
      if (instance.nativePopover && instance.element.matches(':popover-open')) open(instance);
      else return;
    }

    if (instance.nativeDialog || instance.nativePopover || instance.layer === 'dialog') {
      // Close owned menus and nested overlays before removing their native
      // modal subtree; otherwise they would retain body locks and active state.
      activeStack.slice().reverse().forEach(function (child) {
        if (child !== instance && instance.element.contains(child.element) &&
            (instance.nativeDialog || instance.nativePopover || child.nativePopover)) close(child, 'parent-close');
      });
    }

    instance.active = false;
    instance.element.classList.remove('is-open');
    if (instance.nativeDialog && instance.element.open) instance.element.close();
    if (instance.nativePopover && instance.element.matches(':popover-open')) instance.element.hidePopover();
    if (typeof instance.onToggle === 'function') instance.onToggle(false, instance);
    syncTriggerAria(instance, false);
    unregisterActive(instance);
    untrackVisibility(instance);
    if (instance.backdropElement) {
      instance.backdropElement.hidden = true;
    }
    if (instance.nativeBorrowHost) restorePopoverSource(instance);
    else if (instance.restoreOnClose !== false) {
      restoreFromLayer(instance);
    }
    syncStackState();

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

    var nativeDialog = !!(options.element && options.element.tagName === 'DIALOG' &&
      (options.kind === 'modal' || options.kind === 'drawer' || options.kind === 'command-palette') &&
      typeof options.element.showModal === 'function');
    var nativePopover = !!(options.element && options.element.hasAttribute('popover') &&
      (options.kind === 'dropdown' || options.kind === 'popover') && typeof options.element.showPopover === 'function');
    var instance = {
      id: options.id || nextId(options.kind || 'overlay'),
      kind: options.kind || 'overlay',
      group: options.group || null,
      layer: options.layer || 'anchored',
      element: options.element || null,
      panel: options.panel || options.element || null,
      trigger: options.trigger || null,
      portal: options.portal !== false && !nativePopover,
      exclusive: options.exclusive !== false,
      position: options.position || null,
      placement: options.placement || 'bottom-start',
      offset: options.offset,
      viewportPadding: options.viewportPadding,
      matchWidth: !!options.matchWidth,
      backdrop: !!options.backdrop && !nativeDialog,
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
      interactive: options.interactive !== false,
      onToggle: options.onToggle,
      onUpdate: options.onUpdate,
      onRequestClose: options.onRequestClose,
      onAfterOpen: options.onAfterOpen,
      onAfterClose: options.onAfterClose,
      backdropElement: null,
      placeholder: null,
      originalParent: null,
      originalNextSibling: null,
      previouslyFocused: null,
      active: false,
      visibilityAncestors: [],
      restoreElementHidden: false
    };
    instance.nativeDialog = nativeDialog;
    instance.nativePopover = nativePopover;
    instance.nativeHost = null;
    if (nativePopover) {
      // Native panels stay in their source DOM. The top layer handles clipping;
      // toggle also reconciles direct native API and browser auto-dismiss changes.
      instance.element.addEventListener('toggle', function () {
        if (instance.element.matches(':popover-open')) {
          if (!instance.active) open(instance);
        } else if (instance.active) close(instance, 'native');
      });
    }
    if (nativeDialog) {
      instance.element.addEventListener('cancel', function (event) {
        if (!instance.active || event.defaultPrevented) return;
        // Let the browser finish an allowed requestClose (and preserve its
        // returnValue); a rejected request must leave the dialog modal/open.
        if (instance.escapeClose === false || !dispatchCloseRequest(instance, 'escape', event)) event.preventDefault();
      });
      instance.element.addEventListener('close', function () {
        // close is queued; a dialog reopened before delivery must stay open.
        if (instance.active && !instance.element.open) close(instance, 'native');
      });
      instance.element.addEventListener('submit', function (event) {
        var form = event.target;
        if (!instance.active || event.defaultPrevented || form.closest('dialog') !== instance.element) return;
        var method = event.submitter && event.submitter.hasAttribute('formmethod') ? event.submitter.formMethod : form.method;
        if (method !== 'dialog') return;
        if (!dispatchCloseRequest(instance, 'dismiss-control', event)) event.preventDefault();
      });
    }
    return instance;
  }

  document.addEventListener('click', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('wb-overlay-backdrop')) {
      var ownerId = e.target.dataset.wbOverlayOwner;
      var owner = getTopmost(function (instance) {
        return instance.active && instance.backdrop && (!ownerId || instance.id === ownerId);
      });
      if (owner) requestClose(owner, 'outside', { originalEvent: e });
      return;
    }

    var top = getTopmost(function (instance) {
      return instance.active && instance.outsideClose !== false;
    });

    if (!top) return;
    if (top.nativeDialog && e.target === top.element) {
      var bounds = top.element.getBoundingClientRect();
      if (top.kind === 'modal' || top.kind === 'command-palette' ||
          e.clientX < bounds.left || e.clientX > bounds.right ||
          e.clientY < bounds.top || e.clientY > bounds.bottom) {
        requestClose(top, 'outside', { originalEvent: e });
      }
      return;
    }
    if (top.element && top.element.contains(e.target)) return;
    if (top.trigger && top.trigger.contains(e.target)) return;
    requestClose(top, 'outside', { originalEvent: e });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var esc = getTopmost(function (instance) {
        return instance.active && instance.escapeClose !== false;
      });
      if (esc) {
        e.preventDefault();
        requestClose(esc, 'escape', { originalEvent: e });
        return;
      }
    }

    if (e.key === 'Tab') {
      var trap = getTopmost(function (instance) {
        return instance.active && instance.trapFocus;
      });
      if (trap) WBDom.trapFocus(e, trap.nativeDialog ? trap.element : (trap.panel || trap.element));
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
