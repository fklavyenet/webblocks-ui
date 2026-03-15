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
