/* ============================================================
   WebBlocks UI — Drawer (drawer.js)

   Usage:
     <!-- Trigger -->
     <button data-wb-toggle="drawer" data-wb-target="#myDrawer">Open</button>

     <!-- Drawer -->
     <div class="wb-drawer" id="myDrawer" role="dialog" aria-modal="true" aria-labelledby="myDrawerTitle">
       <div class="wb-drawer-header">
         <h5 class="wb-drawer-title" id="myDrawerTitle">Title</h5>
         <button class="wb-drawer-close" data-wb-dismiss="drawer" aria-label="Close">&times;</button>
       </div>
       <div class="wb-drawer-body">Content</div>
       <div class="wb-drawer-footer">
         <button class="wb-btn wb-btn-secondary" data-wb-dismiss="drawer">Cancel</button>
         <button class="wb-btn wb-btn-primary">Save</button>
       </div>
     </div>

     <!-- Backdrop (optional, add before </body>) -->
     <div class="wb-drawer-backdrop" data-wb-dismiss="drawer"></div>
   ============================================================ */

(function () {
  'use strict';

  var activeDrawer    = null;
  var previouslyFocused = null;

  var FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  // ── Backdrop helper ───────────────────────────────────────

  function getBackdrop() {
    return document.querySelector('.wb-drawer-backdrop');
  }

  // ── Open ──────────────────────────────────────────────────

  function open(drawer) {
    if (!drawer) return;
    if (activeDrawer) close(activeDrawer);

    previouslyFocused = document.activeElement;
    activeDrawer = drawer;

    drawer.classList.add('is-open');
    document.body.classList.add('wb-drawer-open');

    var backdrop = getBackdrop();
    if (backdrop) backdrop.classList.add('is-open');

    // Focus first focusable element
    requestAnimationFrame(function () {
      var first = drawer.querySelector(FOCUSABLE);
      if (first) first.focus();
    });

    drawer.dispatchEvent(new CustomEvent('wb:drawer:open', { bubbles: true }));
  }

  // ── Close ─────────────────────────────────────────────────

  function close(drawer) {
    if (!drawer) drawer = activeDrawer;
    if (!drawer) return;

    drawer.classList.remove('is-open');
    document.body.classList.remove('wb-drawer-open');

    var backdrop = getBackdrop();
    if (backdrop) backdrop.classList.remove('is-open');

    if (activeDrawer === drawer) activeDrawer = null;

    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus();
      previouslyFocused = null;
    }

    drawer.dispatchEvent(new CustomEvent('wb:drawer:close', { bubbles: true }));
  }

  // ── Focus trap ────────────────────────────────────────────

  function trapFocus(e) {
    if (!activeDrawer) return;
    if (e.key !== 'Tab') return;

    var focusable = Array.from(activeDrawer.querySelectorAll(FOCUSABLE));
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
    var trigger = e.target.closest('[data-wb-toggle="drawer"]');
    if (trigger) {
      e.preventDefault();
      var target = trigger.getAttribute('data-wb-target');
      var drawer = target ? document.querySelector(target) : null;
      if (drawer) open(drawer);
      return;
    }

    // Dismiss
    var dismiss = e.target.closest('[data-wb-dismiss="drawer"]');
    if (dismiss) {
      close(activeDrawer);
      return;
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && activeDrawer) close(activeDrawer);
    trapFocus(e);
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBDrawer = {
    open:      open,
    close:     close,
    getActive: function () { return activeDrawer; }
  };

})();
