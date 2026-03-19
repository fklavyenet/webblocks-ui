/* ============================================================
   WebBlocks UI — Popover (popover.js)

   Usage (HTML):
     <div class="wb-popover" data-wb-popover>
       <button class="wb-btn wb-btn-secondary" data-wb-toggle="popover">
         Info
       </button>
       <div class="wb-popover-panel">
         <div class="wb-popover-body">Content here</div>
       </div>
     </div>

   Placement modifiers (on .wb-popover wrapper):
     wb-popover-top | wb-popover-right | wb-popover-left | wb-popover-end

   Dismiss:
     <button data-wb-dismiss="popover">Close</button>

   JS API:
     WBPopover.open(wrapperEl)
     WBPopover.close(wrapperEl)
     WBPopover.closeAll()
   ============================================================ */

(function () {
  'use strict';

  var active = null;

  // ── Open ──────────────────────────────────────────────────

  function open(wrapper) {
    if (!wrapper) return;
    if (active && active !== wrapper) close(active);

    wrapper.classList.add('is-open');
    active = wrapper;
    WBDom.emit(wrapper, 'wb:popover:open');
  }

  // ── Close ─────────────────────────────────────────────────

  function close(wrapper) {
    if (!wrapper) wrapper = active;
    if (!wrapper) return;

    wrapper.classList.remove('is-open');
    if (active === wrapper) active = null;
    WBDom.emit(wrapper, 'wb:popover:close');
  }

  function closeAll() {
    document.querySelectorAll('.wb-popover.is-open').forEach(function (el) {
      close(el);
    });
    active = null;
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    // Toggle trigger
    var trigger = e.target.closest('[data-wb-toggle="popover"]');
    if (trigger) {
      e.stopPropagation();
      var wrapper = trigger.closest('[data-wb-popover]') || trigger.closest('.wb-popover');
      if (!wrapper) return;
      if (wrapper.classList.contains('is-open')) {
        close(wrapper);
      } else {
        open(wrapper);
      }
      return;
    }

    // Dismiss button inside popover
    var dismiss = e.target.closest('[data-wb-dismiss="popover"]');
    if (dismiss) {
      var wrapper = dismiss.closest('.wb-popover');
      if (wrapper) close(wrapper);
      return;
    }

    // Click outside — close active popover
    if (active && !active.contains(e.target)) {
      close(active);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && active) close(active);
  });

  // ── Public API ────────────────────────────────────────────

  window.WBPopover = {
    open:     open,
    close:    close,
    closeAll: closeAll
  };

})();
