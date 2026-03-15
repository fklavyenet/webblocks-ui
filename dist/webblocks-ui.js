/* ============================================================
   WebBlocks UI — Theme Engine (theme.js)
   Handles: light / dark / auto modes + accent color schemes
   Storage key: wb-theme, wb-accent
   ============================================================ */

(function () {
  'use strict';

  const THEME_KEY  = 'wb-theme';
  const ACCENT_KEY = 'wb-accent';
  const VALID_THEMES  = ['light', 'dark', 'auto'];
  const VALID_ACCENTS = ['ocean', 'forest', 'royal', 'warm', 'slate', 'rose', 'sand'];
  const DEFAULT_THEME  = 'auto';
  const DEFAULT_ACCENT = 'ocean';

  // ── Internal helpers ──────────────────────────────────────

  function prefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function resolveMode(theme) {
    if (theme === 'dark')  return 'dark';
    if (theme === 'light') return 'light';
    return prefersDark() ? 'dark' : 'light';
  }

  // ── Apply theme + accent to <html> ────────────────────────

  function applyTheme(theme) {
    if (!VALID_THEMES.includes(theme)) theme = DEFAULT_THEME;
    const mode = resolveMode(theme);
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    html.setAttribute('data-mode', mode);
    // Sync toggle buttons
    syncThemeButtons(theme);
  }

  function applyAccent(accent) {
    if (!VALID_ACCENTS.includes(accent)) accent = DEFAULT_ACCENT;
    document.documentElement.setAttribute('data-accent', accent);
    // Sync swatch buttons
    syncAccentButtons(accent);
  }

  // ── Persist and apply ─────────────────────────────────────

  function setTheme(theme) {
    if (!VALID_THEMES.includes(theme)) theme = DEFAULT_THEME;
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    applyTheme(theme);
  }

  function setAccent(accent) {
    if (!VALID_ACCENTS.includes(accent)) accent = DEFAULT_ACCENT;
    try { localStorage.setItem(ACCENT_KEY, accent); } catch (e) {}
    applyAccent(accent);
  }

  // ── Sync UI controls ──────────────────────────────────────

  function syncThemeButtons(theme) {
    document.querySelectorAll('[data-wb-theme-set]').forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-wb-theme-set') === theme);
    });
  }

  function syncAccentButtons(accent) {
    document.querySelectorAll('[data-wb-accent-set]').forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-wb-accent-set') === accent);
    });
  }

  // ── Event delegation ──────────────────────────────────────

  function attachListeners() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-wb-theme-set]');
      if (el) {
        e.preventDefault();
        setTheme(el.getAttribute('data-wb-theme-set'));
        return;
      }
      el = e.target.closest('[data-wb-accent-set]');
      if (el) {
        e.preventDefault();
        setAccent(el.getAttribute('data-wb-accent-set'));
      }
    });
  }

  // ── System preference listener ────────────────────────────

  function watchSystem() {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', function () {
      var stored;
      try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}
      if (!stored || stored === 'auto') applyTheme('auto');
    });
  }

  // ── Init ──────────────────────────────────────────────────

  function init() {
    var storedTheme, storedAccent;
    try {
      storedTheme  = localStorage.getItem(THEME_KEY);
      storedAccent = localStorage.getItem(ACCENT_KEY);
    } catch (e) {}

    applyTheme(storedTheme  || DEFAULT_THEME);
    applyAccent(storedAccent || DEFAULT_ACCENT);
    attachListeners();
    watchSystem();
  }

  // Run immediately so there's no flash
  init();

  // Expose API for programmatic use
  window.WBTheme = {
    set:       setTheme,
    setAccent: setAccent,
    get: function () {
      try { return localStorage.getItem(THEME_KEY) || DEFAULT_THEME; } catch (e) { return DEFAULT_THEME; }
    },
    getAccent: function () {
      try { return localStorage.getItem(ACCENT_KEY) || DEFAULT_ACCENT; } catch (e) { return DEFAULT_ACCENT; }
    }
  };

})();
/* ============================================================
   WebBlocks UI — Dropdown (dropdown.js)

   Usage:
     <div class="wb-dropdown">
       <button data-wb-toggle="dropdown" data-wb-target="#myMenu">
         Open
       </button>
       <ul class="wb-dropdown-menu" id="myMenu">
         <li><a class="wb-dropdown-item" href="#">Item</a></li>
       </ul>
     </div>

   Or self-contained (toggle + menu share the same .wb-dropdown parent):
     <div class="wb-dropdown">
       <button data-wb-toggle="dropdown">Open</button>
       <ul class="wb-dropdown-menu"> ... </ul>
     </div>
   ============================================================ */

(function () {
  'use strict';

  var openDropdown = null; // currently open menu element

  function getMenu(trigger) {
    var targetId = trigger.getAttribute('data-wb-target');
    if (targetId) return document.querySelector(targetId);
    // Fallback: first .wb-dropdown-menu in the same .wb-dropdown parent
    var parent = trigger.closest('.wb-dropdown');
    return parent ? parent.querySelector('.wb-dropdown-menu') : null;
  }

  function open(trigger, menu) {
    // Close any currently open dropdown first
    if (openDropdown && openDropdown !== menu) close(openDropdown);

    menu.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    openDropdown = menu;

    // Position: flip upward if overflows viewport bottom
    requestAnimationFrame(function () {
      var rect = menu.getBoundingClientRect();
      if (rect.bottom > window.innerHeight && rect.top > rect.height) {
        menu.classList.add('wb-dropdown-menu--up');
      } else {
        menu.classList.remove('wb-dropdown-menu--up');
      }
    });
  }

  function close(menu) {
    if (!menu) return;
    menu.classList.remove('is-open');
    // Reset aria-expanded on the associated trigger
    var parent = menu.closest('.wb-dropdown');
    if (parent) {
      var trigger = parent.querySelector('[data-wb-toggle="dropdown"]');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
    if (openDropdown === menu) openDropdown = null;
  }

  function toggle(trigger) {
    var menu = getMenu(trigger);
    if (!menu) return;
    if (menu.classList.contains('is-open')) {
      close(menu);
    } else {
      open(trigger, menu);
    }
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-wb-toggle="dropdown"]');
    if (trigger) {
      e.stopPropagation();
      toggle(trigger);
      return;
    }

    // Dismiss on data-wb-dismiss
    var dismiss = e.target.closest('[data-wb-dismiss="dropdown"]');
    if (dismiss) {
      var menu = dismiss.closest('.wb-dropdown-menu');
      if (menu) close(menu);
      return;
    }

    // Close on outside click
    if (openDropdown && !openDropdown.contains(e.target)) {
      close(openDropdown);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openDropdown) {
      // Return focus to trigger
      var parent = openDropdown.closest('.wb-dropdown');
      var trigger = parent && parent.querySelector('[data-wb-toggle="dropdown"]');
      close(openDropdown);
      if (trigger) trigger.focus();
    }
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBDropdown = {
    open: function (menuEl) {
      var parent = menuEl.closest('.wb-dropdown');
      var trigger = parent && parent.querySelector('[data-wb-toggle="dropdown"]');
      open(trigger, menuEl);
    },
    close: close,
    closeAll: function () { if (openDropdown) close(openDropdown); }
  };

})();
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
/* ============================================================
   WebBlocks UI — Tabs (tabs.js)

   Usage:
     <div class="wb-tabs" data-wb-tabs>
       <div class="wb-tabs-nav" role="tablist">
         <button class="wb-tabs-btn is-active" data-wb-tab="panel1" role="tab"
                 aria-selected="true" aria-controls="panel1">Tab 1</button>
         <button class="wb-tabs-btn" data-wb-tab="panel2" role="tab"
                 aria-selected="false" aria-controls="panel2">Tab 2</button>
       </div>
       <div class="wb-tabs-panels">
         <div class="wb-tabs-panel is-active" id="panel1" role="tabpanel">Content 1</div>
         <div class="wb-tabs-panel" id="panel2" role="tabpanel">Content 2</div>
       </div>
     </div>
   ============================================================ */

(function () {
  'use strict';

  function activate(container, targetId) {
    // Deactivate all tabs + panels in this container
    container.querySelectorAll('.wb-tabs-btn').forEach(function (btn) {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('tabindex', '-1');
    });
    container.querySelectorAll('.wb-tabs-panel').forEach(function (panel) {
      panel.classList.remove('is-active');
    });

    // Activate target
    var targetBtn = container.querySelector('[data-wb-tab="' + targetId + '"]');
    var targetPanel = container.querySelector('#' + targetId);

    if (targetBtn) {
      targetBtn.classList.add('is-active');
      targetBtn.setAttribute('aria-selected', 'true');
      targetBtn.removeAttribute('tabindex');
    }
    if (targetPanel) {
      targetPanel.classList.add('is-active');
    }

    // Emit event
    container.dispatchEvent(new CustomEvent('wb:tabs:change', {
      bubbles: true,
      detail: { tabId: targetId }
    }));
  }

  // ── Keyboard navigation ────────────────────────────────────

  function handleKeydown(e, container) {
    var btns = Array.from(container.querySelectorAll('.wb-tabs-btn'));
    var idx  = btns.indexOf(document.activeElement);
    if (idx === -1) return;

    var next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next = btns[(idx + 1) % btns.length];
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      next = btns[(idx - 1 + btns.length) % btns.length];
    } else if (e.key === 'Home') {
      next = btns[0];
    } else if (e.key === 'End') {
      next = btns[btns.length - 1];
    }

    if (next) {
      e.preventDefault();
      next.focus();
      activate(container, next.getAttribute('data-wb-tab'));
    }
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.wb-tabs-btn[data-wb-tab]');
    if (!btn) return;
    var container = btn.closest('[data-wb-tabs]');
    if (!container) return;
    e.preventDefault();
    activate(container, btn.getAttribute('data-wb-tab'));
  });

  document.addEventListener('keydown', function (e) {
    var btn = e.target.closest('.wb-tabs-btn');
    if (!btn) return;
    var container = btn.closest('[data-wb-tabs]');
    if (!container) return;
    handleKeydown(e, container);
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBTabs = {
    activate: function (containerEl, tabId) {
      activate(containerEl, tabId);
    },
    activateById: function (tabId) {
      var btn = document.querySelector('[data-wb-tab="' + tabId + '"]');
      if (!btn) return;
      var container = btn.closest('[data-wb-tabs]');
      if (container) activate(container, tabId);
    }
  };

})();
/* ============================================================
   WebBlocks UI — Accordion (accordion.js)

   Usage:
     <div class="wb-accordion" data-wb-accordion>

       <div class="wb-accordion-item">
         <button class="wb-accordion-trigger" data-wb-accordion-trigger
                 aria-expanded="false" aria-controls="acc1">
           Section Title
           <span class="wb-accordion-icon"></span>
         </button>
         <div class="wb-accordion-content" id="acc1">
           <div class="wb-accordion-body">Content here</div>
         </div>
       </div>

     </div>

   Options (on [data-wb-accordion]):
     data-wb-accordion-single="true"  — only one panel open at a time
   ============================================================ */

(function () {
  'use strict';

  function getItem(trigger) {
    return trigger.closest('.wb-accordion-item');
  }

  function getContent(trigger) {
    var id = trigger.getAttribute('aria-controls');
    return id ? document.getElementById(id) : getItem(trigger).querySelector('.wb-accordion-content');
  }

  function isOpen(trigger) {
    return trigger.getAttribute('aria-expanded') === 'true';
  }

  // ── Open a single trigger ─────────────────────────────────

  function open(trigger) {
    var content = getContent(trigger);
    trigger.setAttribute('aria-expanded', 'true');
    trigger.classList.add('is-open');
    if (content) {
      content.classList.add('is-open');
      // Animate height
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  }

  // ── Close a single trigger ────────────────────────────────

  function close(trigger) {
    var content = getContent(trigger);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.classList.remove('is-open');
    if (content) {
      content.classList.remove('is-open');
      content.style.maxHeight = '0';
    }
  }

  // ── Toggle ────────────────────────────────────────────────

  function toggle(trigger) {
    var accordion = trigger.closest('[data-wb-accordion]');
    var single = accordion && accordion.getAttribute('data-wb-accordion-single') === 'true';

    if (isOpen(trigger)) {
      close(trigger);
    } else {
      // In single mode, close all siblings first
      if (single && accordion) {
        accordion.querySelectorAll('[data-wb-accordion-trigger]').forEach(function (t) {
          if (t !== trigger && isOpen(t)) close(t);
        });
      }
      open(trigger);
    }

    // Emit event
    trigger.dispatchEvent(new CustomEvent('wb:accordion:toggle', {
      bubbles: true,
      detail: { open: isOpen(trigger) }
    }));
  }

  // ── Recalculate open heights (e.g. after resize) ──────────

  function recalc() {
    document.querySelectorAll('[data-wb-accordion-trigger][aria-expanded="true"]').forEach(function (trigger) {
      var content = getContent(trigger);
      if (content) content.style.maxHeight = content.scrollHeight + 'px';
    });
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-wb-accordion-trigger]');
    if (trigger) {
      e.preventDefault();
      toggle(trigger);
    }
  });

  window.addEventListener('resize', function () {
    // Debounce
    clearTimeout(window._wbAccordionResizeTimer);
    window._wbAccordionResizeTimer = setTimeout(recalc, 150);
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBAccordion = {
    open:   open,
    close:  close,
    toggle: toggle,
    recalc: recalc
  };

})();
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
    sidebar.dispatchEvent(new CustomEvent('wb:sidebar:open', { bubbles: true }));
  }

  function close(sidebar) {
    sidebar.classList.remove('is-open');
    var backdrop = getBackdrop(sidebar);
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.style.overflow = '';

    syncTriggers(sidebar, false);
    sidebar.dispatchEvent(new CustomEvent('wb:sidebar:close', { bubbles: true }));
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

  window.addEventListener('resize', function () {
    clearTimeout(window._wbSidebarResizeTimer);
    window._wbSidebarResizeTimer = setTimeout(function () {
      if (window.innerWidth > 768) {
        document.querySelectorAll('.wb-sidebar.is-open').forEach(function (sidebar) {
          // Remove open state but don't trigger close animations —
          // CSS will show sidebar on desktop anyway
          sidebar.classList.remove('is-open');
          var backdrop = getBackdrop(sidebar);
          if (backdrop) backdrop.classList.remove('is-open');
          document.body.style.overflow = '';
          syncTriggers(sidebar, false);
        });
      }
    }, 100);
  });

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
