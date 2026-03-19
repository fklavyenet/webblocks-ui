/* ============================================================
   WebBlocks UI — Sidebar (sidebar.js)

   Usage (toggle button — typically in .wb-navbar):
     <button data-wb-toggle="sidebar" data-wb-target="#appSidebar"
             aria-expanded="false" aria-controls="appSidebar">
       ☰
     </button>

     <div class="wb-sidebar-backdrop" id="appBackdrop" data-wb-sidebar-backdrop></div>
     <aside class="wb-sidebar" id="appSidebar"> ... </aside>

   The sidebar is controlled purely via the "is-open" class.
   On desktop (>768px) the sidebar is always visible via CSS —
   JS open/close only affects mobile.
   ============================================================ */

(function () {
  'use strict';

  function getSidebar(trigger) {
    var id = trigger.getAttribute('data-wb-target');
    return id ? document.querySelector(id) : document.querySelector('.wb-sidebar');
  }

  function getBackdrop(sidebar) {
    // Look for a sibling/nearby backdrop element
    var parent = sidebar.parentElement;
    return parent ? parent.querySelector('[data-wb-sidebar-backdrop]') : null;
  }

  function isOpen(sidebar) {
    return sidebar.classList.contains('is-open');
  }

  function open(sidebar) {
    sidebar.classList.add('is-open');
    var backdrop = getBackdrop(sidebar);
    if (backdrop) backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // prevent scroll behind overlay

    // Sync trigger button aria
    syncTriggers(sidebar, true);
    WBDom.emit(sidebar, 'wb:sidebar:open');
  }

  function close(sidebar) {
    sidebar.classList.remove('is-open');
    var backdrop = getBackdrop(sidebar);
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.style.overflow = '';

    syncTriggers(sidebar, false);
    WBDom.emit(sidebar, 'wb:sidebar:close');
  }

  function toggle(sidebar) {
    if (isOpen(sidebar)) {
      close(sidebar);
    } else {
      open(sidebar);
    }
  }

  function syncTriggers(sidebar, expanded) {
    var id = sidebar.id;
    if (!id) return;
    document.querySelectorAll('[data-wb-target="#' + id + '"]').forEach(function (btn) {
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      btn.classList.toggle('is-open', expanded);
    });
  }

  // ── Close sidebar on desktop resize ───────────────────────

  window.addEventListener('resize', WBDom.debounce(function () {
    if (window.innerWidth > 768) {
      document.querySelectorAll('.wb-sidebar.is-open').forEach(function (sidebar) {
        sidebar.classList.remove('is-open');
        var backdrop = getBackdrop(sidebar);
        if (backdrop) backdrop.classList.remove('is-open');
        document.body.style.overflow = '';
        syncTriggers(sidebar, false);
      });
    }
  }, 100));

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    // Toggle button
    var trigger = e.target.closest('[data-wb-toggle="sidebar"]');
    if (trigger) {
      var sidebar = getSidebar(trigger);
      if (sidebar) toggle(sidebar);
      return;
    }

    // Backdrop click — close
    var backdrop = e.target.closest('[data-wb-sidebar-backdrop]');
    if (backdrop) {
      var openSidebar = document.querySelector('.wb-sidebar.is-open');
      if (openSidebar) close(openSidebar);
      return;
    }

    // Nav link click on mobile — close sidebar
    if (window.innerWidth <= 768) {
      var link = e.target.closest('.wb-sidebar-link[href]');
      if (link) {
        var openSb = document.querySelector('.wb-sidebar.is-open');
        if (openSb) close(openSb);
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var openSidebar = document.querySelector('.wb-sidebar.is-open');
      if (openSidebar && window.innerWidth <= 768) close(openSidebar);
    }
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBSidebar = {
    open:   open,
    close:  close,
    toggle: toggle,
    isOpen: isOpen
  };

})();
