/* ============================================================
   WebBlocks UI — Password Toggle (WBPasswordToggle)

   Canonical usage:
     <div class="wb-input-group">
       <input class="wb-input" id="login-password" type="password">
       <button class="wb-btn wb-btn-secondary wb-input-addon-btn wb-btn-icon"
               type="button"
               data-wb-password-toggle
               data-wb-target="#login-password"
               aria-label="Show password"
               aria-pressed="false">
         <i class="wb-icon wb-icon-eye" aria-hidden="true"></i>
       </button>
     </div>

   State contract:
     hidden  -> input[type=password], aria-pressed=false, wb-icon-eye
     visible -> input[type=text],     aria-pressed=true,  wb-icon-eye-off

   Optional label overrides:
     data-wb-password-label-show="Show password"
     data-wb-password-label-hide="Hide password"

   Public API:
     WBPasswordToggle.toggle(buttonEl)
     WBPasswordToggle.sync(rootOrButton)
   ============================================================ */

(function () {
  'use strict';

  var BUTTON_SELECTOR = '[data-wb-password-toggle]';
  var INPUT_MARKER = 'data-wb-password-input';
  var LABEL_SHOW = 'Show password';
  var LABEL_HIDE = 'Hide password';

  function resolveExplicitTarget(button) {
    var selector = button.getAttribute('data-wb-target');
    var target = null;

    if (selector) {
      target = WBDom.resolveTarget(selector);
      if (!target && selector.charAt(0) !== '#') {
        target = document.getElementById(selector);
      }
    }

    if (!target) {
      var controls = button.getAttribute('aria-controls');
      if (controls) target = document.getElementById(controls);
    }

    return target;
  }

  function resolveImplicitTarget(button) {
    var group = button.closest('.wb-input-group');
    if (group) {
      return group.querySelector('input[' + INPUT_MARKER + '], input[type="password"]');
    }

    var prev = button.previousElementSibling;
    if (prev && prev.tagName === 'INPUT' && prev.type === 'password') return prev;

    return null;
  }

  function resolveTarget(button) {
    var target = resolveExplicitTarget(button) || resolveImplicitTarget(button);

    if (!target || target.tagName !== 'INPUT') return null;
    if (target.type !== 'password' && target.type !== 'text' && !target.hasAttribute(INPUT_MARKER)) return null;

    target.setAttribute(INPUT_MARKER, '');
    return target;
  }

  function isVisible(input) {
    return input.type === 'text';
  }

  function setIcon(button, visible) {
    var icon = button.querySelector('.wb-icon');
    if (!icon) return;

    icon.classList.remove('wb-icon-eye', 'wb-icon-eye-off');
    icon.classList.add(visible ? 'wb-icon-eye-off' : 'wb-icon-eye');
  }

  function setLabel(button, visible) {
    var showLabel = button.getAttribute('data-wb-password-label-show') || LABEL_SHOW;
    var hideLabel = button.getAttribute('data-wb-password-label-hide') || LABEL_HIDE;
    var label = visible ? hideLabel : showLabel;

    button.setAttribute('aria-label', label);

    if (button.hasAttribute('title')) {
      button.setAttribute('title', label);
    }
  }

  function syncButton(button) {
    var input = resolveTarget(button);
    if (!input) return;

    if (button.tagName === 'BUTTON' && !button.getAttribute('type')) {
      button.setAttribute('type', 'button');
    }

    if (input.id) {
      button.setAttribute('aria-controls', input.id);
    }

    var visible = isVisible(input);
    button.setAttribute('aria-pressed', visible ? 'true' : 'false');
    setLabel(button, visible);
    setIcon(button, visible);
  }

  function sync(rootOrButton) {
    var root = rootOrButton || document;

    if (root.matches && root.matches(BUTTON_SELECTOR)) {
      syncButton(root);
      return;
    }

    root.querySelectorAll(BUTTON_SELECTOR).forEach(function (button) {
      syncButton(button);
    });
  }

  function toggle(button) {
    var input = resolveTarget(button);
    if (!input || button.disabled || input.disabled) return;

    var focused = document.activeElement === input;
    var selectionStart = null;
    var selectionEnd = null;

    if (focused) {
      try {
        selectionStart = input.selectionStart;
        selectionEnd = input.selectionEnd;
      } catch (err) {
        selectionStart = null;
        selectionEnd = null;
      }
    }

    input.type = isVisible(input) ? 'password' : 'text';
    syncButton(button);

    if (focused) {
      try {
        input.focus({ preventScroll: true });
      } catch (err) {
        input.focus();
      }

      if (selectionStart !== null && selectionEnd !== null) {
        try {
          input.setSelectionRange(selectionStart, selectionEnd);
        } catch (err) {
          /* Ignore unsupported selection restoration. */
        }
      }
    }
  }

  document.addEventListener('mousedown', function (e) {
    var button = e.target.closest(BUTTON_SELECTOR);
    if (!button) return;

    e.preventDefault();
  });

  document.addEventListener('click', function (e) {
    var button = e.target.closest(BUTTON_SELECTOR);
    if (!button) return;

    e.preventDefault();
    toggle(button);
  });

  function init() {
    sync(document);
  }

  window.WBPasswordToggle = {
    toggle: function (buttonOrSelector) {
      var button = typeof buttonOrSelector === 'string'
        ? document.querySelector(buttonOrSelector)
        : buttonOrSelector;

      if (button) toggle(button);
    },
    sync: sync
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

})();
