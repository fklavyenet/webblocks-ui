/* ============================================================
   WebBlocks UI — Action Feedback (WBActionFeedback)
   Shared request feedback. Hosts own authorization, confirmation,
   transport, durable job state and the meaning of completion.
   See docs/action-feedback.md for the public contract.
   ============================================================ */
(function () {
  'use strict';
  if (window.WBActionFeedback) return;

  var requests = new Set();
  var defaults = { label: '' };
  var submitSelector = 'button[type="submit"], button:not([type]), input[type="submit"], input[type="image"]';
  var dismissSelector = '[data-wb-dismiss="modal"], [data-wb-dismiss="drawer"], .wb-modal-close, .wb-drawer-close, [data-wb-action-dismiss]';
  var overlaySelector = '.wb-modal, .wb-drawer';

  function overlayFor(element) {
    return element && element.closest(overlaySelector);
  }

  function requestFor(element) {
    if (!element) return null;
    var found = null;
    requests.forEach(function (request) {
      if (request.surface === element || request.surface.contains(element)
          || (request.overlay && request.overlay.contains(element))
          || request.controls.has(element)
          || (element.form && element.form === request.form)) found = request;
    });
    return found;
  }

  function isPending(element) {
    return Boolean(requestFor(element));
  }

  function restore(element, name, value) {
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  }

  function setting(surface, button, name) {
    var selector = '[' + name + ']';
    var owner = button && (surface.contains(button) ? button.closest(selector)
      : (button.hasAttribute(name) ? button : null));
    owner = owner || surface.closest(selector) || (button && button.closest(selector));
    return owner ? owner.getAttribute(name) : null;
  }

  function enabled(surface, button) {
    var own = setting(surface, button, 'data-wb-action-feedback');
    return own !== 'off' && (own !== null || (button && button.hasAttribute('data-wb-busy')));
  }

  function begin(surface, button, options) {
    options = options || {};
    if (!(surface instanceof Element) || !surface.isConnected) return null;
    if (options.feedbackTarget && (!(options.feedbackTarget instanceof Element) || !options.feedbackTarget.isConnected)) return null;
    if (button && (!(button instanceof Element) || !button.isConnected
        || button.disabled || button.getAttribute('aria-disabled') === 'true')) return null;
    if (isPending(surface) || isPending(button)) return null;
    var overlay = overlayFor(button) || overlayFor(surface);
    if (overlay && options.feedbackTarget && !overlay.contains(options.feedbackTarget)) return null;
    var overlap = false;
    requests.forEach(function (request) {
      if (surface.contains(request.surface) || (overlay && overlay.contains(request.surface))) overlap = true;
    });
    if (overlap) return null;

    var form = surface instanceof HTMLFormElement ? surface : (button && button.form);
    var label = options.label || setting(surface, button, 'data-wb-action-label')
      || (button && button.getAttribute('data-wb-busy-label')) || defaults.label
      || (button && (button.getAttribute('aria-label') || button.textContent.trim() || button.value)) || '';
    var controls = new Set(form ? Array.from(form.elements).filter(function (control) {
      return control.matches(submitSelector);
    }) : []);
    if (button) controls.add(button);
    var lockClose = options.lockClose !== false;
    if (overlay && lockClose) overlay.querySelectorAll(dismissSelector).forEach(function (control) {
      controls.add(control);
    });
    var states = Array.from(controls, function (control) {
      var value = control.getAttribute('aria-disabled');
      control.setAttribute('aria-disabled', 'true');
      return [control, value];
    });
    var surfaceBusy = surface.getAttribute('aria-busy');
    // Keep the modal's existing live progress outside the busy subtree.
    var markSurface = !surface.matches(overlaySelector);
    if (markSurface) surface.setAttribute('aria-busy', 'true');
    var original = document.createDocumentFragment();
    var ariaLabel = button && button.getAttribute('aria-label');
    var ariaBusy = button && (button === surface ? surfaceBusy : button.getAttribute('aria-busy'));
    var wasBusy = button && button.classList.contains('is-busy');
    var hadIconState = button && button.classList.contains('wb-action-feedback-icon');
    var contentChanged = false;
    if (button) {
      button.setAttribute('aria-busy', 'true');
      if (label) button.setAttribute('aria-label', label);
      button.classList.add('is-busy');
      // Never mutate an input submitter's value: it belongs to the payload.
      if (button.tagName !== 'INPUT') {
        var icon = button.matches('.wb-btn-icon, .wb-action-icon, .wb-action-btn, [data-wb-action-icon]');
        var glyph = icon && button.querySelector('.wb-icon');
        while (button.firstChild) original.appendChild(button.firstChild);
        contentChanged = true;
        if (icon || !button.classList.contains('wb-btn')) {
          var spinner = document.createElement('span');
          spinner.className = 'wb-spinner wb-spinner-sm';
          if (glyph) glyph.classList.forEach(function (name) {
            if (/^wb-icon-(xs|sm|lg|xl|2xl)$/.test(name)) spinner.classList.add(name);
          });
          spinner.setAttribute('aria-hidden', 'true');
          button.appendChild(spinner);
        }
        if (icon) button.classList.add('wb-action-feedback-icon');
        else button.appendChild(document.createTextNode(label));
      }
    }

    var feedback = null, status = null, announce = null;
    if (options.feedback !== false) {
      feedback = document.createElement('div');
      feedback.className = 'wb-stack wb-stack-2 wb-mt-3';
      feedback.setAttribute('data-wb-action-status', '');
      var inputButton = button && button.tagName === 'INPUT';
      if (inputButton) {
        var inputSpinner = document.createElement('span');
        inputSpinner.className = 'wb-spinner wb-spinner-sm';
        inputSpinner.setAttribute('aria-hidden', 'true');
        feedback.appendChild(inputSpinner);
      }
      status = document.createElement('p');
      status.className = 'wb-text-sm wb-text-muted wb-m-0';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.setAttribute('aria-atomic', 'true');
      feedback.appendChild(status);
      var progress = options.progress;
      if (progress === undefined) progress = Boolean(overlay) || setting(surface, button, 'data-wb-action-progress') === 'true';
      if (progress) {
        var bar = document.createElement('progress');
        bar.className = 'wb-progress-bar';
        bar.setAttribute('aria-label', label);
        feedback.appendChild(bar);
      }
      var compact = button && button.closest('.wb-table-actions, .wb-dropdown-menu');
      if (!progress && options.inline !== true && !inputButton) feedback.className = 'wb-sr-only';
      if (compact && !overlay && options.inline !== true) feedback.className = 'wb-sr-only';
      var mount = options.feedbackTarget || (overlay && overlay.querySelector('.wb-modal-body, .wb-drawer-body')) || surface.parentElement;
      // Announcements must be connected, in the active dialog and outside our
      // aria-busy subtree. Do not relocate existing host progress or results.
      if (markSurface && surface.contains(mount)) mount = surface.parentElement;
      mount.appendChild(feedback);
      announce = window.setTimeout(function () { status.textContent = label; }, 0);
    }

    var request;
    function finish() {
      if (!requests.has(request)) return;
      window.clearTimeout(announce);
      if (feedback) feedback.remove();
      states.forEach(function (state) { restore(state[0], 'aria-disabled', state[1]); });
      if (markSurface) restore(surface, 'aria-busy', surfaceBusy);
      if (button) {
        if (contentChanged) button.replaceChildren(original);
        button.classList.toggle('is-busy', Boolean(wasBusy));
        button.classList.toggle('wb-action-feedback-icon', Boolean(hadIconState));
        restore(button, 'aria-label', ariaLabel);
        restore(button, 'aria-busy', ariaBusy);
      }
      requests.delete(request);
    }
    request = { surface: surface, button: button, form: form, overlay: overlay,
      controls: controls, lockClose: lockClose, native: options.native === true, finish: finish };
    requests.add(request);
    return finish;
  }

  function sameWindow(target) {
    return !target || target.toLowerCase() === '_self';
  }

  function navigationTarget(element) {
    return element.getAttribute('target') || document.querySelector('base[target]')?.getAttribute('target');
  }

  function afterDispatch(event, finish) {
    // A later window listener may still reject a native submission/navigation.
    queueMicrotask(function () { if (event.defaultPrevented && finish) finish(); });
  }

  document.addEventListener('submit', function (event) {
    if (isPending(event.target) || isPending(event.submitter)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  document.addEventListener('click', function (event) {
    var control = event.target instanceof Element && event.target.closest(submitSelector + ', ' + dismissSelector + ', [data-wb-action-link]');
    if (!control) return;
    if (control.matches('a[data-wb-action-link]') && (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    var request = requestFor(control);
    if (!request || (control.matches(dismissSelector) && !request.lockClose)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
  document.addEventListener('wb:overlay:close-request', function (event) {
    var request = requestFor(event.target);
    if (request && request.lockClose) event.preventDefault();
  }, true);

  // Opt-in per form or shell. Validation and feature/confirmation handlers run
  // first. Intercepted AJAX owns its own lifetime through begin()/finish().
  window.addEventListener('submit', function (event) {
    var form = event.target;
    if (event.defaultPrevented || !(form instanceof HTMLFormElement)) return;
    var button = event.submitter || Array.from(form.elements).find(function (control) {
      return control.matches(submitSelector) && !control.disabled;
    });
    if (!enabled(form, button)) return;
    var method = (button && button.getAttribute('formmethod')) || form.getAttribute('method') || 'get';
    var target = (button && button.getAttribute('formtarget')) || navigationTarget(form);
    if (method.toLowerCase() !== 'post' || !sameWindow(target)) return;
    afterDispatch(event, begin(form, button, { native: true }));
  });

  // Explicit same-window links only (e.g. a GET Check for updates action).
  // Ordinary navigation, GET filters, downloads and modifier clicks are untouched.
  window.addEventListener('click', function (event) {
    var link = event.target instanceof Element && event.target.closest('a[data-wb-action-link]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
        || link.hasAttribute('download') || !sameWindow(navigationTarget(link)) || !link.hasAttribute('href')
        || setting(link, link, 'data-wb-action-feedback') === 'off') return;
    var url;
    try { url = new URL(link.href, location.href); } catch (_) { return; }
    if (!/^https?:$/.test(url.protocol) || url.origin !== location.origin || link.getAttribute('href').charAt(0) === '#') return;
    afterDispatch(event, begin(link, link, { native: true }));
  });

  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) return;
    Array.from(requests).forEach(function (request) { if (request.native) request.finish(); });
  });

  function bind(root) {
    // Delegation also covers injected forms. Keep the old bind marker/API for
    // consumers that still call WBBusySubmit.bind() after DOM injection.
    (root || document).querySelectorAll('[data-wb-busy]').forEach(function (button) {
      button.setAttribute('data-wb-busy-bound', 'true');
    });
  }

  window.WBActionFeedback = {
    begin: begin,
    isPending: isPending,
    bind: bind,
    configure: function (options) { if (options && typeof options.label === 'string') defaults.label = options.label; }
  };
}());
