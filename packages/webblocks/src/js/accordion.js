/* ============================================================
   WebBlocks UI — Accordion (accordion.js)

   Usage (two equivalent patterns):

   Pattern A — attribute-based (full):
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

   Pattern B — class-based (simpler):
     <div class="wb-accordion">
       <div class="wb-accordion-item is-open">
         <button class="wb-accordion-trigger">Section Title</button>
         <div class="wb-accordion-body">Content here</div>
       </div>
     </div>

   Options (on [data-wb-accordion]):
     data-wb-accordion-single="true"  — only one panel open at a time
   ============================================================ */

(function () {
  'use strict';

  // Trigger selector: data attribute (Pattern A) OR class-only (Pattern B)
  var TRIGGER_SEL = '[data-wb-accordion-trigger], .wb-accordion-trigger:not([data-wb-accordion-trigger])';

  function getItem(trigger) {
    return trigger.closest('.wb-accordion-item');
  }

  function getContent(trigger) {
    // Pattern A: aria-controls points to a wrapper element
    var id = trigger.getAttribute('aria-controls');
    if (id) return document.getElementById(id);
    var item = getItem(trigger);
    if (!item) return null;
    // Pattern A: .wb-accordion-content wrapper
    var content = item.querySelector('.wb-accordion-content');
    if (content) return content;
    // Pattern B: .wb-accordion-body used directly
    return item.querySelector('.wb-accordion-body');
  }

  function isOpen(trigger) {
    // Pattern A uses aria-expanded; Pattern B uses is-open on the item
    if (trigger.hasAttribute('aria-expanded')) {
      return trigger.getAttribute('aria-expanded') === 'true';
    }
    var item = getItem(trigger);
    return item ? item.classList.contains('is-open') : false;
  }

  // ── Open a single trigger ─────────────────────────────────

  function open(trigger) {
    var item = getItem(trigger);
    var content = getContent(trigger);
    if (trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'true');
    trigger.classList.add('is-open');
    if (item) item.classList.add('is-open');
    if (content) {
      content.classList.add('is-open');
      // Animate height (only meaningful for wb-accordion-content with max-height transition)
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  }

  // ── Close a single trigger ────────────────────────────────

  function close(trigger) {
    var item = getItem(trigger);
    var content = getContent(trigger);
    if (trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'false');
    trigger.classList.remove('is-open');
    if (item) item.classList.remove('is-open');
    if (content) {
      content.classList.remove('is-open');
      content.style.maxHeight = '0';
    }
  }

  // ── Toggle ────────────────────────────────────────────────

  function toggle(trigger) {
    var accordion = trigger.closest('[data-wb-accordion]') || trigger.closest('.wb-accordion');
    var single = accordion && accordion.getAttribute('data-wb-accordion-single') === 'true';

    if (isOpen(trigger)) {
      close(trigger);
    } else {
      // In single mode, close all siblings first
      if (single && accordion) {
        accordion.querySelectorAll(TRIGGER_SEL).forEach(function (t) {
          if (t !== trigger && isOpen(t)) close(t);
        });
      }
      open(trigger);
    }

    // Emit event
    WBDom.emit(trigger, 'wb:accordion:toggle', { open: isOpen(trigger) });
  }

  // ── Recalculate open heights (e.g. after resize) ──────────

  function recalc() {
    document.querySelectorAll(TRIGGER_SEL).forEach(function (trigger) {
      if (!isOpen(trigger)) return;
      var content = getContent(trigger);
      if (content) content.style.maxHeight = content.scrollHeight + 'px';
    });
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest(TRIGGER_SEL);
    if (trigger) {
      e.preventDefault();
      toggle(trigger);
    }
  });

  window.addEventListener('resize', WBDom.debounce(recalc, 150));

  // ── Public API ─────────────────────────────────────────────

  window.WBAccordion = {
    open:   open,
    close:  close,
    toggle: toggle,
    recalc: recalc
  };

})();
