/* ============================================================
   WebBlocks UI — Password Generator (WBPasswordGenerator)

   Declarative hook:
     data-wb-password-generate
     data-wb-target="#password-id"

   Optional controls:
     data-wb-password-confirm="#password-confirmation-id"
     data-wb-password-length="20"
     data-wb-password-alphabet="..."
     data-wb-password-status="#password-status"
     data-wb-password-generated="Password generated."
     data-wb-password-generate-error="Password could not be generated."

   Public API:
     WBPasswordGenerator.generate(buttonEl)
     WBPasswordGenerator.init(root)
   ============================================================ */

(function () {
  'use strict';

  var BUTTON_SELECTOR = '[data-wb-password-generate]';
  var DEFAULT_LENGTH = 20;
  var MIN_LENGTH = 12;
  var MAX_LENGTH = 128;
  var DEFAULT_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()-_=+';
  var GENERATED_MESSAGE = 'Password generated.';
  var ERROR_MESSAGE = 'Password could not be generated.';
  var STATUS_MARKER = 'data-wb-password-status-runtime';

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

    if (!target) {
      var group = button.closest('.wb-input-group');
      if (group) target = group.querySelector('input[data-wb-password-input], input[type="password"], input[type="text"]');
    }

    return target && target.tagName === 'INPUT' ? target : null;
  }

  function statusRegion(button) {
    var explicit = resolveSelector(button, 'data-wb-password-status');
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

  function lengthFor(button) {
    var value = parseInt(button.getAttribute('data-wb-password-length'), 10);
    if (!Number.isFinite(value)) return DEFAULT_LENGTH;
    return Math.max(MIN_LENGTH, Math.min(MAX_LENGTH, value));
  }

  function alphabetFor(button) {
    var alphabet = button.getAttribute('data-wb-password-alphabet') || DEFAULT_ALPHABET;
    var unique = '';

    alphabet.split('').forEach(function (character) {
      if (unique.indexOf(character) === -1) unique += character;
    });

    return unique.length >= 2 && unique.length <= 256 ? unique : DEFAULT_ALPHABET;
  }

  function randomPassword(length, alphabet) {
    if (!window.crypto || typeof window.crypto.getRandomValues !== 'function') {
      throw new Error('Secure random generation is unavailable.');
    }

    var result = '';
    var limit = Math.floor(256 / alphabet.length) * alphabet.length;
    var bytes = new Uint8Array(Math.max(length * 2, 32));

    while (result.length < length) {
      window.crypto.getRandomValues(bytes);
      for (var i = 0; i < bytes.length && result.length < length; i += 1) {
        if (bytes[i] < limit) result += alphabet.charAt(bytes[i] % alphabet.length);
      }
    }

    return result;
  }

  function dispatchValueEvents(input) {
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function syncPasswordToggle(input) {
    if (!window.WBPasswordToggle) return;
    window.WBPasswordToggle.sync(input.closest('.wb-field') || input.closest('.wb-input-group') || document);
  }

  function generate(button) {
    var input = resolveTarget(button);
    if (!input || button.disabled || input.disabled || input.readOnly) return null;

    try {
      var password = randomPassword(lengthFor(button), alphabetFor(button));
      var confirmation = resolveSelector(button, 'data-wb-password-confirm');

      input.value = password;
      dispatchValueEvents(input);

      if (confirmation && confirmation.tagName === 'INPUT' && !confirmation.disabled && !confirmation.readOnly) {
        confirmation.value = password;
        dispatchValueEvents(confirmation);
        syncPasswordToggle(confirmation);
      }

      syncPasswordToggle(input);
      announce(button, 'data-wb-password-generated', GENERATED_MESSAGE);
      return password;
    } catch (err) {
      announce(button, 'data-wb-password-generate-error', ERROR_MESSAGE);
      return null;
    }
  }

  function init(root) {
    (root || document).querySelectorAll(BUTTON_SELECTOR).forEach(function (button) {
      if (button.tagName === 'BUTTON' && !button.getAttribute('type')) button.setAttribute('type', 'button');
      var input = resolveTarget(button);
      if (input && input.id) button.setAttribute('aria-controls', input.id);
    });
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest(BUTTON_SELECTOR);
    if (!button) return;
    event.preventDefault();
    generate(button);
  });

  window.WBPasswordGenerator = {
    generate: function (buttonOrSelector) {
      var button = typeof buttonOrSelector === 'string' ? document.querySelector(buttonOrSelector) : buttonOrSelector;
      return button ? generate(button) : null;
    },
    init: init
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); }, { once: true });
  } else {
    init(document);
  }

})();
