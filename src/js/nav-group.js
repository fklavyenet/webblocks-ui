/* ============================================================
   WebBlocks UI — Nav Group (nav-group.js)
   Collapsible navigation groups for sidebars and menus.

   Usage:
     <div class="wb-nav-group" data-wb-nav-group>
       <button class="wb-nav-group-toggle">
         <span class="wb-nav-group-icon">...</span>
         <span class="wb-nav-group-label">Settings</span>
         <span class="wb-nav-group-arrow"></span>
       </button>
       <div class="wb-nav-group-items">
         <a class="wb-nav-group-item" href="#">Profile</a>
         <a class="wb-nav-group-item" href="#">Security</a>
       </div>
     </div>

   Options (data attributes on .wb-nav-group):
     data-wb-nav-group-open  — open by default
     data-wb-nav-group-accordion — close siblings when opening
   ============================================================ */

(function () {
  'use strict';

  // ── Toggle a single group ─────────────────────────────────

  function toggle(group) {
    var isOpen = group.classList.contains('is-open');

    // Accordion: close siblings in the same parent
    if (group.dataset.wbNavGroupAccordion !== undefined || group.closest('[data-wb-accordion]')) {
      var parent = group.parentElement;
      if (parent) {
        var siblings = Array.from(parent.querySelectorAll(':scope > [data-wb-nav-group]'));
        siblings.forEach(function (sibling) {
          if (sibling !== group) closeGroup(sibling);
        });
      }
    }

    if (isOpen) {
      closeGroup(group);
    } else {
      openGroup(group);
    }
  }

  function openGroup(group) {
    group.classList.add('is-open');
    var toggle = group.querySelector('.wb-nav-group-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    group.dispatchEvent(new CustomEvent('wb:navgroup:open', { bubbles: true }));
  }

  function closeGroup(group) {
    group.classList.remove('is-open');
    var toggle = group.querySelector('.wb-nav-group-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    group.dispatchEvent(new CustomEvent('wb:navgroup:close', { bubbles: true }));
  }

  // ── Auto-open groups with active children ─────────────────

  function autoOpenActive() {
    var groups = document.querySelectorAll('[data-wb-nav-group]');
    groups.forEach(function (group) {
      // Open if explicitly set
      if (group.dataset.wbNavGroupOpen !== undefined) {
        openGroup(group);
        return;
      }
      // Open if a child is active
      var items = group.querySelector('.wb-nav-group-items');
      if (items && items.querySelector('.is-active')) {
        openGroup(group);
      }
    });
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    var toggleBtn = e.target.closest('.wb-nav-group-toggle');
    if (!toggleBtn) return;

    var group = toggleBtn.closest('[data-wb-nav-group]');
    if (!group) return;

    e.preventDefault();
    toggle(group);
  });

  // ── Init on DOM ready ─────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoOpenActive);
  } else {
    autoOpenActive();
  }

  // ── Public API ─────────────────────────────────────────────

  window.WBNavGroup = {
    open:   openGroup,
    close:  closeGroup,
    toggle: toggle,
    init:   autoOpenActive
  };

})();
