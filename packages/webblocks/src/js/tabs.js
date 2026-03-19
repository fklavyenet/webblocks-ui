/* ============================================================
   WebBlocks UI — Tabs (tabs.js)

   Usage (two equivalent patterns):

   Pattern A — attribute-based:
     <div class="wb-tabs" data-wb-tabs>
       <div class="wb-tabs-nav" role="tablist">
         <button class="wb-tabs-btn is-active" data-wb-tab="panel1">Tab 1</button>
         <button class="wb-tabs-btn" data-wb-tab="panel2">Tab 2</button>
       </div>
       <div class="wb-tabs-panels">
         <div class="wb-tabs-panel is-active" id="panel1">Content 1</div>
         <div class="wb-tabs-panel" id="panel2">Content 2</div>
       </div>
     </div>

   Pattern B — class-based (simpler):
     <div class="wb-tabs">
       <div class="wb-tab-list">
         <button class="wb-tab-item is-active" data-wb-tab="panel1">Tab 1</button>
         <button class="wb-tab-item" data-wb-tab="panel2">Tab 2</button>
       </div>
       <div class="wb-tab-panels">
         <div class="wb-tab-panel is-active" id="panel1">Content 1</div>
         <div class="wb-tab-panel" id="panel2">Content 2</div>
       </div>
     </div>
   ============================================================ */

(function () {
  'use strict';

  // Accept both wb-tabs-btn and wb-tab-item; both wb-tabs-panel and wb-tab-panel
  var BTN_SEL   = '.wb-tabs-btn[data-wb-tab], .wb-tab-item[data-wb-tab]';
  var PANEL_SEL = '.wb-tabs-panel, .wb-tab-panel';

  function activate(container, targetId) {
    // Deactivate all tabs + panels in this container
    container.querySelectorAll(BTN_SEL).forEach(function (btn) {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('tabindex', '-1');
    });
    container.querySelectorAll(PANEL_SEL).forEach(function (panel) {
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
    WBDom.emit(container, 'wb:tabs:change', { tabId: targetId });
  }

  // ── Keyboard navigation ────────────────────────────────────

  function handleKeydown(e, container) {
    var btns = Array.from(container.querySelectorAll(BTN_SEL));
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
    var btn = e.target.closest('.wb-tabs-btn[data-wb-tab], .wb-tab-item[data-wb-tab]');
    if (!btn) return;
    var container = btn.closest('.wb-tabs');
    if (!container) return;
    e.preventDefault();
    activate(container, btn.getAttribute('data-wb-tab'));
  });

  document.addEventListener('keydown', function (e) {
    var btn = e.target.closest('.wb-tabs-btn, .wb-tab-item');
    if (!btn) return;
    var container = btn.closest('.wb-tabs');
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
