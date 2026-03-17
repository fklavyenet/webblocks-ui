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
   ============================================================ */

(function () {
  'use strict';

  var activeModal       = null;
  var previouslyFocused = null;

  // ── Open ──────────────────────────────────────────────────

  function open(modal) {
    if (!modal) return;
    if (activeModal) close(activeModal);

    previouslyFocused = document.activeElement;
    activeModal = modal;

    modal.classList.add('is-open');
    document.body.classList.add('wb-modal-open');

    WBDom.focusFirst(modal);
    WBDom.emit(modal, 'wb:modal:open');
  }

  // ── Close ─────────────────────────────────────────────────

  function close(modal) {
    if (!modal) modal = activeModal;
    if (!modal) return;

    modal.classList.remove('is-open');
    document.body.classList.remove('wb-modal-open');

    if (activeModal === modal) activeModal = null;

    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus();
      previouslyFocused = null;
    }

    WBDom.emit(modal, 'wb:modal:close');
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    // Trigger
    var trigger = e.target.closest('[data-wb-toggle="modal"]');
    if (trigger) {
      e.preventDefault();
      var target = trigger.getAttribute('data-wb-target');
      var modal  = target ? document.querySelector(target) : null;
      if (modal) open(modal);
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

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && activeModal) close(activeModal);
    if (activeModal) WBDom.trapFocus(e, activeModal);
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBModal = {
    open:      open,
    close:     close,
    getActive: function () { return activeModal; }
  };

})();
