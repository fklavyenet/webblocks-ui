/* ============================================================
   WebBlocks UI — Cookie Consent (cookie-consent.js)

   Reusable HTML-first cookie consent behavior for banner, card,
   and preference-center modal compositions.
   ============================================================ */

(function () {
  'use strict';

  var CONSENT_KEY = 'wb-cookie-consent';
  var PREFERENCES_KEY = 'wb-cookie-consent-preferences';
  var OPTIONAL_CATEGORIES = ['preferences', 'analytics', 'marketing'];

  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  function trim(value) {
    return value == null ? '' : String(value).trim();
  }

  function parseJson(value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }

  function normalizePreferences(preferences) {
    var source = preferences && typeof preferences === 'object' ? preferences : {};

    return {
      necessary: true,
      preferences: !!source.preferences,
      analytics: !!source.analytics,
      marketing: !!source.marketing
    };
  }

  function getStoredStatus() {
    var status = trim(WBStorage.get(CONSENT_KEY));
    return status === 'accepted' || status === 'rejected' || status === 'custom' ? status : '';
  }

  function readStoredPreferences() {
    var parsed = parseJson(WBStorage.get(PREFERENCES_KEY));
    return normalizePreferences(parsed);
  }

  function getStatusForPreferences(preferences) {
    var allEnabled = OPTIONAL_CATEGORIES.every(function (category) {
      return preferences[category] === true;
    });
    var allDisabled = OPTIONAL_CATEGORIES.every(function (category) {
      return preferences[category] === false;
    });

    if (allEnabled) return 'accepted';
    if (allDisabled) return 'rejected';
    return 'custom';
  }

  function getState() {
    return {
      status: getStoredStatus(),
      preferences: readStoredPreferences()
    };
  }

  function hasConsent() {
    return !!getStoredStatus();
  }

  function getRoots() {
    return toArray(document.querySelectorAll('[data-wb-cookie-consent]'));
  }

  function isModalRoot(root) {
    return !!(root && (root.classList.contains('wb-modal') || root.classList.contains('wb-cookie-consent-modal')));
  }

  function resolveRoot(target) {
    if (!target) return null;
    if (typeof target === 'string') return document.querySelector(target);
    return target.nodeType === 1 ? target : null;
  }

  function getFirstRoot() {
    var roots = getRoots();
    return roots.length ? roots[0] : null;
  }

  function getFirstModalRoot() {
    var roots = getRoots();
    var i;

    for (i = 0; i < roots.length; i += 1) {
      if (isModalRoot(roots[i])) return roots[i];
    }

    return null;
  }

  function getOpenRoot() {
    var activeModal = window.WBModal && WBModal.getActive ? WBModal.getActive() : null;
    if (activeModal && activeModal.hasAttribute('data-wb-cookie-consent')) return activeModal;

    return getRoots().find(function (root) {
      return !isModalRoot(root) && root.hidden === false;
    }) || null;
  }

  function canDismiss(root) {
    if (!root) return hasConsent();
    return hasConsent() || root.getAttribute('data-wb-cookie-consent-allow-dismiss') === 'true';
  }

  function hideRoot(root) {
    if (!root) return false;

    if (isModalRoot(root)) {
      if (window.WBModal) WBModal.close(root);
      return true;
    }

    root.hidden = true;
    root.setAttribute('aria-hidden', 'true');
    return true;
  }

  function hideNonModalRootsExcept(exceptRoot) {
    getRoots().forEach(function (root) {
      if (root === exceptRoot || isModalRoot(root)) return;
      root.hidden = true;
      root.setAttribute('aria-hidden', 'true');
    });
  }

  function showRoot(root, trigger) {
    if (!root) return false;

    syncRoot(root, getState().preferences);
    hideNonModalRootsExcept(root);

    if (isModalRoot(root)) {
      if (window.WBModal) WBModal.open(root, trigger || null);
      return true;
    }

    root.hidden = false;
    root.removeAttribute('aria-hidden');
    return true;
  }

  function closeAll() {
    getRoots().forEach(function (root) {
      hideRoot(root);
    });
  }

  function syncRoot(root, preferences) {
    toArray(root.querySelectorAll('[data-wb-cookie-category]')).forEach(function (control) {
      var category = trim(control.getAttribute('data-wb-cookie-category')).toLowerCase();
      var required = control.getAttribute('data-wb-cookie-required') === 'true' || category === 'necessary';

      if (!category || typeof control.checked !== 'boolean') return;

      control.checked = required ? true : !!preferences[category];
      control.disabled = required;

      if (required) control.setAttribute('aria-disabled', 'true');
      else control.removeAttribute('aria-disabled');
    });
  }

  function syncAllRoots() {
    var preferences = getState().preferences;
    getRoots().forEach(function (root) {
      syncRoot(root, preferences);
    });
  }

  function readPreferencesFromScope(scope) {
    var preferences = readStoredPreferences();

    toArray((scope || document).querySelectorAll('[data-wb-cookie-category]')).forEach(function (control) {
      var category = trim(control.getAttribute('data-wb-cookie-category')).toLowerCase();
      var required = control.getAttribute('data-wb-cookie-required') === 'true' || category === 'necessary';

      if (!category || typeof control.checked !== 'boolean') return;
      preferences[category] = required ? true : !!control.checked;
    });

    return normalizePreferences(preferences);
  }

  function emitChange(status, preferences) {
    WBDom.emit(document.documentElement, 'wb:cookie-consent:change', {
      status: status,
      preferences: normalizePreferences(preferences),
      hasConsent: true,
      storageKeys: {
        consent: CONSENT_KEY,
        preferences: PREFERENCES_KEY
      }
    });
  }

  function save(preferences, status) {
    var normalized = normalizePreferences(preferences);
    var nextStatus = status || getStatusForPreferences(normalized);

    WBStorage.set(CONSENT_KEY, nextStatus);
    WBStorage.set(PREFERENCES_KEY, JSON.stringify(normalized));
    syncAllRoots();
    closeAll();
    emitChange(nextStatus, normalized);

    return {
      status: nextStatus,
      preferences: normalized
    };
  }

  function acceptAll() {
    return save({
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true
    }, 'accepted');
  }

  function rejectAll() {
    return save({
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false
    }, 'rejected');
  }

  function savePreferences(scope) {
    return save(readPreferencesFromScope(scope));
  }

  function getPreferredOpenRoot(trigger) {
    var explicitTarget = trigger ? resolveRoot(trigger.getAttribute('data-wb-target')) : null;
    if (explicitTarget) return explicitTarget;
    return getFirstModalRoot() || getFirstRoot();
  }

  function showInitialRoot() {
    if (hasConsent()) {
      closeAll();
      syncAllRoots();
      return false;
    }

    return showRoot(getFirstRoot());
  }

  function open(target) {
    syncAllRoots();
    return showRoot(resolveRoot(target) || getFirstModalRoot() || getFirstRoot());
  }

  function close(target) {
    var root = resolveRoot(target) || getOpenRoot();
    if (!root || !canDismiss(root)) return false;
    return hideRoot(root);
  }

  function clear() {
    WBStorage.remove(CONSENT_KEY);
    WBStorage.remove(PREFERENCES_KEY);
    syncAllRoots();
    closeAll();
    showInitialRoot();
    return get();
  }

  function get() {
    return getState();
  }

  document.addEventListener('click', function (e) {
    var accept = e.target.closest('[data-wb-cookie-consent-accept]');
    var reject = e.target.closest('[data-wb-cookie-consent-reject]');
    var saveButton = e.target.closest('[data-wb-cookie-consent-save]');
    var openButton = e.target.closest('[data-wb-cookie-consent-open]');
    var closeButton = e.target.closest('[data-wb-cookie-consent-close]');
    var root;

    if (accept) {
      e.preventDefault();
      e.stopPropagation();
      acceptAll();
      return;
    }

    if (reject) {
      e.preventDefault();
      e.stopPropagation();
      rejectAll();
      return;
    }

    if (saveButton) {
      e.preventDefault();
      e.stopPropagation();
      root = saveButton.closest('[data-wb-cookie-consent]') || getFirstModalRoot() || getFirstRoot();
      savePreferences(root || document);
      return;
    }

    if (openButton) {
      e.preventDefault();
      e.stopPropagation();
      open(getPreferredOpenRoot(openButton));
      return;
    }

    if (closeButton) {
      root = closeButton.closest('[data-wb-cookie-consent]');

      if (!root || !canDismiss(root)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      hideRoot(root);
    }
  }, true);

  document.addEventListener('wb:modal:close', function (e) {
    var modal = e.target;

    if (!modal || !modal.hasAttribute('data-wb-cookie-consent')) return;
    if (canDismiss(modal) || hasConsent()) return;

    requestAnimationFrame(function () {
      if (!hasConsent()) showInitialRoot();
    });
  });

  syncAllRoots();
  showInitialRoot();

  window.WBCookieConsent = {
    open: open,
    close: close,
    get: get,
    set: save,
    clear: clear,
    hasConsent: hasConsent
  };

})();
