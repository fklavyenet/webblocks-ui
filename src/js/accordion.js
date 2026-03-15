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
