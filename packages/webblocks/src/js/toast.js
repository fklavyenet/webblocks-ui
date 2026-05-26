/* ============================================================
   WebBlocks UI — Toast (toast.js)

   Usage (programmatic):
     WBToast.show('Saved successfully', { type: 'success' });
     WBToast.show('Something went wrong', { type: 'danger', duration: 6000 });
     WBToast.show('Upload complete', {
       type: 'success',
       title: 'Done',
       position: 'top-right',
       duration: 4000
     });
     WBToast.show('Manual', { duration: 0 }); // no auto-dismiss

   Usage (HTML declarative — dismiss button):
      <div class="wb-toast wb-toast-success" id="myToast" data-wb-toast-timeout="6000">
        <div class="wb-toast-body">Message</div>
        <button class="wb-toast-close" data-wb-dismiss="toast">&times;</button>
      </div>

   Options:
     message   {string}  Toast text (required)
     title     {string}  Optional bold title above message
     type      {string}  success | warning | danger | info (default: none)
      position  {string}  top-right (default) | top-center | top-left |
                          bottom-right | bottom-center | bottom-left
      duration  {number}  ms before auto-dismiss (default: 6000 for success/info,
                          0 for warning/danger, 0 = no auto-dismiss)
      closable  {boolean} show close button (default: true)
    ============================================================ */

(function () {
  'use strict';

  // ── Container cache ───────────────────────────────────────
  var containers = {};

  var POSITIONS = [
    'top-right', 'top-center', 'top-left',
    'bottom-right', 'bottom-center', 'bottom-left'
  ];

  var TRANSIENT_TYPES = { success: true, info: true };
  var PERSISTENT_TYPES = { warning: true, danger: true, error: true };
  var DEFAULT_TRANSIENT_DURATION = 6000;

  function getContainer(position) {
    position = position || 'top-right';
    if (containers[position]) return containers[position];

    var el = document.createElement('div');
    el.className = 'wb-toast-container';
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    if (position !== 'top-right') {
      el.classList.add('wb-toast-container-' + position);
    }
    WBDom.overlay.ensureLayer('toast').appendChild(el);
    containers[position] = el;
    return el;
  }

  // ── Dismiss a toast element ───────────────────────────────

  function dismiss(toast) {
    if (!toast || toast.classList.contains('is-leaving')) return;
    if (toast.__wbToastTimer) {
      clearTimeout(toast.__wbToastTimer);
      toast.__wbToastTimer = null;
    }
    toast.classList.add('is-leaving');

    var done = false;
    function remove() {
      if (done) return;
      done = true;
      if (toast.parentNode) toast.parentNode.removeChild(toast);
      WBDom.emit(toast, 'wb:toast:close');
    }

    toast.addEventListener('animationend', remove, { once: true });
    setTimeout(remove, 300); // fallback
  }

  // ── Icon SVG per type ─────────────────────────────────────

  var ICONS = {
    success: '<svg class="wb-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--wb-success)"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    warning: '<svg class="wb-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--wb-warning)"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    danger:  '<svg class="wb-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--wb-danger)"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info:    '<svg class="wb-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--wb-info)"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  // ── Show ──────────────────────────────────────────────────

  function show(message, opts) {
    opts = opts || {};

    var type      = opts.type     || null;
    var title     = opts.title    || null;
    var position  = POSITIONS.indexOf(opts.position) !== -1 ? opts.position : 'top-right';
    var duration  = opts.duration !== undefined ? opts.duration : defaultDuration(type);
    var closable  = opts.closable !== false;

    var toast = document.createElement('div');
    toast.className = 'wb-toast' + (type ? ' wb-toast-' + type : '');
    toast.setAttribute('role', type === 'warning' || type === 'danger' || type === 'error' ? 'alert' : 'status');

    var html = '';

    // Icon
    if (type && ICONS[type]) {
      html += ICONS[type];
    }

    // Body
    html += '<div class="wb-toast-body">';
    if (title) {
      html += '<span class="wb-toast-title">' + _escape(title) + '</span>';
    }
    html += _escape(message);
    html += '</div>';

    // Close button
    if (closable) {
      html += '<button type="button" class="wb-toast-close" data-wb-dismiss="toast" aria-label="Close">&times;</button>';
    }

    toast.innerHTML = html;
    if (duration !== undefined) {
      toast.setAttribute('data-wb-toast-timeout', String(duration));
    }

    var container = getContainer(position);
    container.appendChild(toast);
    initToast(toast);

    return toast;
  }

  function inferType(toast) {
    if (toast.classList.contains('wb-toast-success')) return 'success';
    if (toast.classList.contains('wb-toast-info')) return 'info';
    if (toast.classList.contains('wb-toast-warning')) return 'warning';
    if (toast.classList.contains('wb-toast-danger')) return 'danger';
    if (toast.classList.contains('wb-toast-error')) return 'error';
    return null;
  }

  function defaultDuration(type) {
    if (TRANSIENT_TYPES[type]) return DEFAULT_TRANSIENT_DURATION;
    if (PERSISTENT_TYPES[type]) return 0;
    return DEFAULT_TRANSIENT_DURATION;
  }

  function parseDuration(value) {
    if (value === null || value === undefined || value === '') return null;
    var duration = parseInt(value, 10);
    return isNaN(duration) ? null : Math.max(0, duration);
  }

  function resolveDuration(toast) {
    var autoDismiss = toast.getAttribute('data-wb-auto-dismiss');
    if (autoDismiss === 'false' || autoDismiss === '0') return 0;
    var explicit = parseDuration(toast.getAttribute('data-wb-toast-timeout'));
    if (explicit !== null) return explicit;
    return defaultDuration(inferType(toast));
  }

  function initToast(toast) {
    if (!toast || toast.__wbToastInitialized) return toast;
    toast.__wbToastInitialized = true;

    var duration = resolveDuration(toast);
    WBDom.emit(toast, 'wb:toast:open', { duration: duration });

    if (duration > 0) {
      toast.__wbToastTimer = setTimeout(function () { dismiss(toast); }, duration);
    }

    return toast;
  }

  function initAll(root) {
    root = root || document;
    if (root.matches && root.matches('.wb-toast')) initToast(root);
    Array.prototype.forEach.call(root.querySelectorAll ? root.querySelectorAll('.wb-toast') : [], initToast);
  }

  function observeToasts() {
    if (!window.MutationObserver || !document.body) return;

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        Array.prototype.forEach.call(mutation.addedNodes, function (node) {
          if (node.nodeType === 1) initAll(node);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ── HTML escape helper ────────────────────────────────────

  function _escape(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Event delegation — dismiss button ────────────────────

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-wb-dismiss="toast"], .wb-toast-close');
    if (!btn) return;
    var toast = btn.closest('.wb-toast');
    if (toast) dismiss(toast);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAll(document);
      observeToasts();
    });
  } else {
    initAll(document);
    observeToasts();
  }

  // ── Public API ────────────────────────────────────────────

  window.WBToast = {
    show:    show,
    init:    initToast,
    initAll: initAll,
    dismiss: dismiss
  };

})();
