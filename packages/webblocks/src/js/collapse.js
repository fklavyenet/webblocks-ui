/* ============================================================
   WebBlocks UI — Collapse (WBCollapse)
   Toggles .is-open on .wb-collapse elements.

   Triggers:
     data-wb-collapse="target-id"   — toggles a standalone collapse
     .wb-collapse-panel > .wb-collapse-trigger — toggles panel

   Native panel (works without JavaScript):
     <details class="wb-collapse-panel" id="advanced" open>
       <summary class="wb-collapse-trigger">Advanced options</summary>
       <div class="wb-collapse"><div class="wb-collapse-body">Content</div></div>
     </details>
   Native state uses open, not is-open. API/external triggers target the details id.

   Public API:
     WBCollapse.open(id)
     WBCollapse.close(id)
     WBCollapse.toggle(id)
   ============================================================ */
(function () {
  'use strict';

  function isNativePanel(el) {
    return el.matches('details.wb-collapse-panel');
  }

  function syncNativeTriggers(panel) {
    if (!panel.id) return;
    document.querySelectorAll('[data-wb-collapse]').forEach(function (trigger) {
      if (trigger.getAttribute('data-wb-collapse') === panel.id) {
        trigger.setAttribute('aria-expanded', panel.open ? 'true' : 'false');
      }
    });
  }

  /* ── Panel trigger (button inside .wb-collapse-panel) ──── */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.wb-collapse-trigger');
    if (trigger) {
      var panel = trigger.closest('.wb-collapse-panel');
      if (panel && !isNativePanel(panel)) {
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
        if (isNativePanel(el)) {
          el.open = !el.open;
          syncNativeTriggers(el);
          return;
        }
        el.classList.toggle('is-open');
        var isOpen = el.classList.contains('is-open');
        btn.setAttribute('aria-expanded', isOpen);
      }
    }
  });

  // Native clicks, property changes and named-group closures all use open.
  // toggle does not bubble, so capture keeps optional external controls in sync.
  document.addEventListener('toggle', function (e) {
    if (isNativePanel(e.target)) syncNativeTriggers(e.target);
  }, true);

  /* ── Public API ─────────────────────────────────────────── */
  window.WBCollapse = {
    open: function (id) {
      var el = document.getElementById(id);
      if (el) {
        if (isNativePanel(el)) {
          el.open = true;
          syncNativeTriggers(el);
          return;
        }
        el.classList.add('is-open');
        var btn = document.querySelector('[data-wb-collapse="' + id + '"]');
        if (btn) btn.setAttribute('aria-expanded', 'true');
      }
    },
    close: function (id) {
      var el = document.getElementById(id);
      if (el) {
        if (isNativePanel(el)) {
          el.open = false;
          syncNativeTriggers(el);
          return;
        }
        el.classList.remove('is-open');
        var btn = document.querySelector('[data-wb-collapse="' + id + '"]');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    },
    toggle: function (id) {
      var el = document.getElementById(id);
      if (el) {
        if (isNativePanel(el) ? el.open : el.classList.contains('is-open')) {
          window.WBCollapse.close(id);
        } else {
          window.WBCollapse.open(id);
        }
      }
    }
  };
})();
