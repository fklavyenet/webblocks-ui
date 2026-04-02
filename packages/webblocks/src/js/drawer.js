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

     Shared overlay backdrop is managed by the runtime.
     Clicking outside the drawer panel closes it automatically.
   ============================================================ */

(function () {
  'use strict';

  var instances = new WeakMap();
  var activeDrawer = null;

  function ensureInstance(drawer, trigger) {
    var instance = instances.get(drawer);
    if (instance) {
      instance.trigger = trigger || instance.trigger;
      return instance;
    }

    instance = WBDom.overlay.create({
      kind: 'drawer',
      group: 'dialog',
      layer: 'dialog',
      element: drawer,
      panel: drawer,
      trigger: trigger,
      backdrop: true,
      lockScroll: true,
      trapFocus: true,
      autoFocus: true,
      returnFocus: true,
      onAfterOpen: function () {
        activeDrawer = drawer;
        WBDom.emit(drawer, 'wb:drawer:open');
      },
      onAfterClose: function () {
        if (activeDrawer === drawer) activeDrawer = null;
        WBDom.emit(drawer, 'wb:drawer:close');
      }
    });

    instances.set(drawer, instance);
    return instance;
  }

  // ── Open ──────────────────────────────────────────────────

  function open(drawer, trigger) {
    if (!drawer) return;
    var instance = ensureInstance(drawer, trigger);
    instance.trigger = trigger || instance.trigger;
    WBDom.overlay.open(instance);
  }

  // ── Close ─────────────────────────────────────────────────

  function close(drawer) {
    if (!drawer) drawer = activeDrawer;
    if (!drawer) return;
    WBDom.overlay.close(ensureInstance(drawer), 'api');
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    // Trigger
    var trigger = e.target.closest('[data-wb-toggle="drawer"]');
    if (trigger) {
      e.preventDefault();
      var target = trigger.getAttribute('data-wb-target');
      var drawer = target ? document.querySelector(target) : null;
      if (drawer) open(drawer, trigger);
      return;
    }

    // Dismiss button (data-wb-dismiss="drawer")
    var dismiss = e.target.closest('[data-wb-dismiss="drawer"]');
    if (dismiss) {
      close(activeDrawer);
      return;
    }
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBDrawer = {
    open:      open,
    close:     close,
    getActive: function () { return activeDrawer; }
  };

})();
