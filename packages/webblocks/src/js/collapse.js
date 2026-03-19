/* ============================================================
   WebBlocks UI — Collapse (WBCollapse)
   Toggles .is-open on .wb-collapse elements.

   Triggers:
     data-wb-collapse="target-id"   — toggles a standalone collapse
     .wb-collapse-panel > .wb-collapse-trigger — toggles panel

   Public API:
     WBCollapse.open(id)
     WBCollapse.close(id)
     WBCollapse.toggle(id)
   ============================================================ */
(function () {
  'use strict';

  /* ── Panel trigger (button inside .wb-collapse-panel) ──── */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.wb-collapse-trigger');
    if (trigger) {
      var panel = trigger.closest('.wb-collapse-panel');
      if (panel) {
        panel.classList.toggle('is-open');
        var expanded = panel.classList.contains('is-open');
        trigger.setAttribute('aria-expanded', expanded);
      }
      return;
    }

    /* ── Standalone toggle: data-wb-collapse="id" ───────── */
    var btn = e.target.closest('[data-wb-collapse]');
    if (btn) {
      var targetId = btn.getAttribute('data-wb-collapse');
      var el = document.getElementById(targetId);
      if (el) {
        el.classList.toggle('is-open');
        var isOpen = el.classList.contains('is-open');
        btn.setAttribute('aria-expanded', isOpen);
      }
    }
  });

  /* ── Public API ─────────────────────────────────────────── */
  window.WBCollapse = {
    open: function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.classList.add('is-open');
        var btn = document.querySelector('[data-wb-collapse="' + id + '"]');
        if (btn) btn.setAttribute('aria-expanded', 'true');
      }
    },
    close: function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.classList.remove('is-open');
        var btn = document.querySelector('[data-wb-collapse="' + id + '"]');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    },
    toggle: function (id) {
      var el = document.getElementById(id);
      if (el) {
        if (el.classList.contains('is-open')) {
          window.WBCollapse.close(id);
        } else {
          window.WBCollapse.open(id);
        }
      }
    }
  };
})();
