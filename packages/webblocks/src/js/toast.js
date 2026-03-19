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
     <div class="wb-toast wb-toast-success" id="myToast">
       <div class="wb-toast-body">Message</div>
       <button class="wb-toast-close" data-wb-dismiss="toast">&times;</button>
     </div>

   Options:
     message   {string}  Toast text (required)
     title     {string}  Optional bold title above message
     type      {string}  success | warning | danger | info (default: none)
     position  {string}  top-right | top-center | top-left |
                         bottom-right (default) | bottom-center | bottom-left
     duration  {number}  ms before auto-dismiss (default: 4000, 0 = no auto-dismiss)
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

  function getContainer(position) {
    position = position || 'bottom-right';
    if (containers[position]) return containers[position];

    var el = document.createElement('div');
    el.className = 'wb-toast-container';
    if (position !== 'bottom-right') {
      el.classList.add('wb-toast-container-' + position);
    }
    document.body.appendChild(el);
    containers[position] = el;
    return el;
  }

  // ── Dismiss a toast element ───────────────────────────────

  function dismiss(toast) {
    if (!toast || toast.classList.contains('is-leaving')) return;
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
    var position  = POSITIONS.indexOf(opts.position) !== -1 ? opts.position : 'bottom-right';
    var duration  = opts.duration !== undefined ? opts.duration : 4000;
    var closable  = opts.closable !== false;

    var toast = document.createElement('div');
    toast.className = 'wb-toast' + (type ? ' wb-toast-' + type : '');

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
      html += '<button class="wb-toast-close" data-wb-dismiss="toast" aria-label="Close">&times;</button>';
    }

    toast.innerHTML = html;

    var container = getContainer(position);
    container.appendChild(toast);

    WBDom.emit(toast, 'wb:toast:open');

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(function () { dismiss(toast); }, duration);
    }

    return toast;
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
    var btn = e.target.closest('[data-wb-dismiss="toast"]');
    if (!btn) return;
    var toast = btn.closest('.wb-toast');
    if (toast) dismiss(toast);
  });

  // ── Public API ────────────────────────────────────────────

  window.WBToast = {
    show:    show,
    dismiss: dismiss
  };

})();
