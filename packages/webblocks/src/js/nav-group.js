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

   Native groups use details.wb-nav-group with a first-child
   summary.wb-nav-group-toggle. The open attribute owns state.
   ============================================================ */

(function () {
  'use strict';

  function isOpen(group) {
    return group.tagName === 'DETAILS' ? group.open : group.classList.contains('is-open');
  }

  function closeSiblings(group, openOnly) {
    if (group.dataset.wbNavGroupAccordion === undefined && !group.closest('[data-wb-accordion]')) return;
    var parent = group.parentElement;
    if (!parent) return;

    parent.querySelectorAll(':scope > [data-wb-nav-group]').forEach(function (sibling) {
      if (sibling !== group && (!openOnly || isOpen(sibling))) closeGroup(sibling);
    });
  }

  function toggle(group) {
    var wasOpen = isOpen(group);
    if (group.tagName !== 'DETAILS') closeSiblings(group, false);

    if (wasOpen) {
      closeGroup(group);
    } else {
      openGroup(group);
    }
  }

  function normalizeToggle(group, isOpen) {
    var toggle = group.querySelector('.wb-nav-group-toggle');
    if (!toggle) return;

    if (!toggle.hasAttribute('type') && toggle.tagName === 'BUTTON') toggle.setAttribute('type', 'button');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  function openGroup(group) {
    if (group.tagName === 'DETAILS') {
      if (group.open) return;
      group.open = true;
      closeSiblings(group, true);
      return;
    }

    group.classList.add('is-open');
    normalizeToggle(group, true);
    WBDom.emit(group, 'wb:navgroup:open');
  }

  function closeGroup(group) {
    if (group.tagName === 'DETAILS') {
      group.open = false;
      return;
    }

    group.classList.remove('is-open');
    normalizeToggle(group, false);
    WBDom.emit(group, 'wb:navgroup:close');
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
        return;
      }

      // Keep the accessibility state in sync for initially closed groups too.
      if (group.tagName !== 'DETAILS') normalizeToggle(group, false);
    });
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    var toggleBtn = e.target.closest('.wb-nav-group-toggle');
    if (!toggleBtn) return;

    var group = toggleBtn.closest('[data-wb-nav-group]');
    if (!group) return;
    if (group.tagName === 'DETAILS' && toggleBtn.tagName === 'SUMMARY') return;

    e.preventDefault();
    toggle(group);
  });

  // Native toggle does not bubble. Capture also covers groups added later.
  document.addEventListener('toggle', function (event) {
    var group = event.target;
    if (!group.matches('details[data-wb-nav-group]')) return;
    if (event.oldState && event.oldState === event.newState) return;

    if (group.open) closeSiblings(group, true);
    WBDom.emit(group, group.open ? 'wb:navgroup:open' : 'wb:navgroup:close');
  }, true);

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
