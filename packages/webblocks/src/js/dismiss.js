/* ============================================================
   WebBlocks UI — Dismiss (dismiss.js)

   Centralised handler for dismissible primitives that use
   data-wb-dismiss. Currently handles:

     alert     — removes .wb-alert from DOM (with animation)
     toast     — handled by toast.js; included here for completeness
     banner    — generic dismissible banner (.wb-banner)

   Usage:
     <div class="wb-alert wb-alert-info wb-alert-dismiss" id="myAlert">
       <span class="wb-alert-title">Heads up!</span>
       This is a dismissible alert.
       <button class="wb-alert-close" data-wb-dismiss="alert" aria-label="Close">&times;</button>
     </div>

   JS API:
     WBDismiss.dismiss(element)   // dismiss a .wb-alert / .wb-banner by element or selector
   ============================================================ */

(function () {
  'use strict';

  // ── Dismiss a single element ──────────────────────────────

  function dismiss(el) {
    if (!el || el.classList.contains('is-leaving')) return;

    el.classList.add('is-leaving');
    WBDom.emit(el, 'wb:dismiss');

    var done = false;
    function remove() {
      if (done) return;
      done = true;
      if (el.parentNode) el.parentNode.removeChild(el);
      WBDom.emit(document, 'wb:dismissed', { element: el });
    }

    el.addEventListener('transitionend', remove, { once: true });
    setTimeout(remove, 400); // fallback
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-wb-dismiss="alert"]');
    if (btn) {
      var alert = btn.closest('.wb-alert');
      if (alert) dismiss(alert);
      return;
    }

    var bannerBtn = e.target.closest('[data-wb-dismiss="banner"]');
    if (bannerBtn) {
      var banner = bannerBtn.closest('.wb-banner');
      if (banner) dismiss(banner);
    }
  });

  // ── Public API ────────────────────────────────────────────

  window.WBDismiss = {
    dismiss: dismiss
  };

})();
