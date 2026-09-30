/* ============================================================
   WebBlocks UI — Clipboard (WBClipboard)

   Declarative hook:
     data-wb-copy
     data-wb-target="#source-id"

   Optional localized announcements:
     data-wb-copy-status="#copy-status"
     data-wb-copy-success="Copied."
     data-wb-copy-error="Could not copy."

   Public API:
     WBClipboard.copy(buttonEl)
     WBClipboard.sync(rootOrButton)
     WBClipboard.init(root)
   ============================================================ */

(function () {
  'use strict';

  var BUTTON_SELECTOR = '[data-wb-copy]';
  var EMPTY_MARKER = 'data-wb-copy-empty';
  var STATUS_MARKER = 'data-wb-copy-status-runtime';
  var SUCCESS_MESSAGE = 'Copied.';
  var ERROR_MESSAGE = 'Could not copy.';

  function resolveSelector(button, attribute) {
    var selector = button.getAttribute(attribute);
    var target = null;
    if (!selector) return null;

    try {
      target = document.querySelector(selector);
    } catch (err) {
      target = null;
    }

    if (!target && selector.charAt(0) !== '#') target = document.getElementById(selector);
    return target;
  }

  function resolveTarget(button) {
    var target = resolveSelector(button, 'data-wb-target');
    if (!target) {
      var controls = button.getAttribute('aria-controls');
      if (controls) target = document.getElementById(controls);
    }
    return target;
  }

  function targetText(target) {
    if (!target) return '';
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      return target.value || '';
    }
    return target.textContent || '';
  }

  function statusRegion(button) {
    var explicit = resolveSelector(button, 'data-wb-copy-status');
    if (explicit) {
      if (!explicit.hasAttribute('role')) explicit.setAttribute('role', 'status');
      if (!explicit.hasAttribute('aria-live')) explicit.setAttribute('aria-live', 'polite');
      if (!explicit.hasAttribute('aria-atomic')) explicit.setAttribute('aria-atomic', 'true');
      return explicit;
    }

    var owner = button.closest('.wb-field') || button.closest('.wb-input-group') || button.parentNode;
    if (!owner) return null;

    var region = owner.querySelector('[' + STATUS_MARKER + ']');
    if (region) return region;

    region = document.createElement('span');
    region.className = 'wb-sr-only';
    region.setAttribute(STATUS_MARKER, '');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    owner.appendChild(region);
    return region;
  }

  function announce(button, attribute, fallback) {
    var region = statusRegion(button);
    if (!region) return;

    region.textContent = '';
    window.setTimeout(function () {
      region.textContent = button.getAttribute(attribute) || fallback;
    }, 0);
  }

  function syncButton(button) {
    var target = resolveTarget(button);
    if (!target) return;

    if (button.tagName === 'BUTTON' && !button.getAttribute('type')) button.setAttribute('type', 'button');
    if (target.id) button.setAttribute('aria-controls', target.id);

    if (!targetText(target)) {
      if (!button.disabled) {
        button.disabled = true;
        button.setAttribute(EMPTY_MARKER, '');
      }
    } else if (button.hasAttribute(EMPTY_MARKER)) {
      button.disabled = false;
      button.removeAttribute(EMPTY_MARKER);
    }
  }

  function sync(rootOrButton) {
    var root = rootOrButton || document;
    if (root.matches && root.matches(BUTTON_SELECTOR)) {
      syncButton(root);
      return;
    }
    root.querySelectorAll(BUTTON_SELECTOR).forEach(syncButton);
  }

  function syncForTarget(target) {
    document.querySelectorAll(BUTTON_SELECTOR).forEach(function (button) {
      if (resolveTarget(button) === target) syncButton(button);
    });
  }

  function copy(button) {
    var target = resolveTarget(button);
    var text = targetText(target);
    if (!target || button.disabled || !text) return Promise.resolve(false);

    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
      announce(button, 'data-wb-copy-error', ERROR_MESSAGE);
      return Promise.resolve(false);
    }

    return navigator.clipboard.writeText(text).then(function () {
      announce(button, 'data-wb-copy-success', SUCCESS_MESSAGE);
      return true;
    }).catch(function () {
      announce(button, 'data-wb-copy-error', ERROR_MESSAGE);
      return false;
    });
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest(BUTTON_SELECTOR);
    if (!button) return;
    event.preventDefault();
    copy(button);
  });

  document.addEventListener('input', function (event) {
    syncForTarget(event.target);
  });

  document.addEventListener('change', function (event) {
    syncForTarget(event.target);
  });

  function init(root) {
    sync(root || document);
  }

  window.WBClipboard = {
    copy: function (buttonOrSelector) {
      var button = typeof buttonOrSelector === 'string' ? document.querySelector(buttonOrSelector) : buttonOrSelector;
      return button ? copy(button) : Promise.resolve(false);
    },
    sync: sync,
    init: init
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); }, { once: true });
  } else {
    init(document);
  }

})();
