/* ============================================================
   WebBlocks UI — Modal (modal.js)

   Usage:
     <!-- Trigger -->
     <button data-wb-toggle="modal" data-wb-target="#myModal">Open</button>

     <!-- Modal -->
     <div class="wb-modal" id="myModal" role="dialog" aria-modal="true" aria-labelledby="myModalTitle">
       <div class="wb-modal-dialog">
         <div class="wb-modal-header">
           <h5 class="wb-modal-title" id="myModalTitle">Title</h5>
           <button class="wb-modal-close" data-wb-dismiss="modal" aria-label="Close">&times;</button>
         </div>
         <div class="wb-modal-body">Content</div>
         <div class="wb-modal-footer">
           <button class="wb-btn wb-btn-secondary" data-wb-dismiss="modal">Cancel</button>
           <button class="wb-btn wb-btn-primary">Save</button>
         </div>
       </div>
     </div>
   Content-first viewer usage stays on the same public modal API.
   ============================================================ */

(function () {
  'use strict';

  var instances = new WeakMap();
  var activeModal = null;

  function ensureInstance(modal, trigger) {
    var instance = instances.get(modal);
    if (instance) {
      instance.trigger = trigger || instance.trigger;
      return instance;
    }

    instance = WBDom.overlay.create({
      kind: 'modal',
      group: 'dialog',
      layer: 'dialog',
      element: modal,
      panel: modal.querySelector('.wb-modal-dialog') || modal,
      trigger: trigger,
      backdrop: true,
      lockScroll: true,
      trapFocus: true,
      autoFocus: true,
      returnFocus: true,
      onAfterOpen: function () {
        activeModal = modal;
        WBDom.emit(modal, 'wb:modal:open');
      },
      onAfterClose: function () {
        if (activeModal === modal) activeModal = null;
        WBDom.emit(modal, 'wb:modal:close');
      }
    });

    instances.set(modal, instance);
    return instance;
  }

  // ── Open ──────────────────────────────────────────────────

  function open(modal, trigger) {
    if (!modal) return;
    var instance = ensureInstance(modal, trigger);
    instance.trigger = trigger || instance.trigger;
    WBDom.overlay.open(instance);
  }

  // ── Close ─────────────────────────────────────────────────

  function close(modal) {
    if (!modal) modal = activeModal;
    if (!modal) return;
    WBDom.overlay.close(ensureInstance(modal), 'api');
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    // Trigger
    var trigger = e.target.closest('[data-wb-toggle="modal"]');
    if (trigger) {
      e.preventDefault();
      var target = trigger.getAttribute('data-wb-target');
      var modal  = target ? document.querySelector(target) : null;
      if (modal) open(modal, trigger);
      return;
    }

    // Dismiss button
    var dismiss = e.target.closest('[data-wb-dismiss="modal"]');
    if (dismiss) {
      close(activeModal);
      return;
    }

    // Backdrop click — close if click is directly on .wb-modal (backdrop layer)
    if (activeModal && e.target === activeModal) {
      close(activeModal);
    }
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBModal = {
    open:      open,
    close:     close,
    getActive: function () { return activeModal; }
  };

})();
