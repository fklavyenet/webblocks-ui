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

  var activeModal = null;
  var previouslyFocused = null;

  // Focusable elements for focus trap
  var FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  // ── Open ──────────────────────────────────────────────────

  function open(modal) {
    if (!modal) return;
    if (activeModal) close(activeModal);

    previouslyFocused = document.activeElement;
    activeModal = modal;

    modal.classList.add('is-open');
    document.body.classList.add('wb-modal-open');

    // Focus first focusable element inside modal
    requestAnimationFrame(function () {
      var first = modal.querySelector(FOCUSABLE);
      if (first) first.focus();
    });

    // Emit custom event
    modal.dispatchEvent(new CustomEvent('wb:modal:open', { bubbles: true }));
  }

  // ── Close ─────────────────────────────────────────────────

  function close(modal) {
    if (!modal) modal = activeModal;
    if (!modal) return;

    modal.classList.remove('is-open');
    document.body.classList.remove('wb-modal-open');

    if (activeModal === modal) activeModal = null;

    // Restore focus
    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus();
      previouslyFocused = null;
    }

    modal.dispatchEvent(new CustomEvent('wb:modal:close', { bubbles: true }));
  }

  // ── Focus trap ────────────────────────────────────────────

  function trapFocus(e) {
    if (!activeModal) return;
    if (e.key !== 'Tab') return;

    var focusable = Array.from(activeModal.querySelectorAll(FOCUSABLE));
    if (!focusable.length) return;

    var first = focusable[0];
    var last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    // Trigger
    var trigger = e.target.closest('[data-wb-toggle="modal"]');
    if (trigger) {
      e.preventDefault();
      var target = trigger.getAttribute('data-wb-target');
      var modal = target ? document.querySelector(target) : null;
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
    trapFocus(e);
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBModal = {
    open:  open,
    close: close,
    getActive: function () { return activeModal; }
  };

})();
