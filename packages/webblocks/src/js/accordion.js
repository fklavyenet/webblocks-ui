/* ============================================================
   WebBlocks UI — Accordion (accordion.js)

   Usage (three supported patterns):

   Pattern A — attribute-based (full):
     <div class="wb-accordion" data-wb-accordion>
       <div class="wb-accordion-item">
         <button class="wb-accordion-trigger" data-wb-accordion-trigger
                 aria-expanded="false" aria-controls="acc1">
           Section Title

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

   Pattern C — native (works without JavaScript):
     <div class="wb-accordion">
       <details class="wb-accordion-item" name="billing">
         <summary class="wb-accordion-trigger">Section Title</summary>
         <div class="wb-accordion-body">Content here</div>
       </details>
     </div>
     Use open for initial state and a shared, group-unique name for exclusivity.
     Native toggle events drive wb:accordion:toggle asynchronously.

   Options (on the .wb-accordion container):
     data-wb-accordion-single="true"  — only one panel open at a time
   ============================================================ */

(function () {
  'use strict';

  // Trigger selector: data attribute (Pattern A) OR class-only (Pattern B)
  var TRIGGER_SEL = '[data-wb-accordion-trigger], .wb-accordion-trigger:not([data-wb-accordion-trigger])';

  function getItem(trigger) {
    return trigger.closest('.wb-accordion-item');
  }

  function getNativeItem(trigger) {
    var item = trigger.parentElement;
    return trigger.tagName === 'SUMMARY' && item && item.matches('details.wb-accordion-item') &&
      item.querySelector('summary') === trigger ? item : null;
  }

  function getAccordion(trigger) {
    return trigger.closest('[data-wb-accordion], .wb-accordion');
  }

  function closeSiblings(trigger) {
    var accordion = getAccordion(trigger);
    if (!accordion || accordion.getAttribute('data-wb-accordion-single') !== 'true') return;
    accordion.querySelectorAll(TRIGGER_SEL).forEach(function (other) {
      // Nested accordions keep their own state.
      if (other !== trigger && getAccordion(other) === accordion && isOpen(other)) close(other);
    });
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
    var nativeItem = getNativeItem(trigger);
    if (nativeItem) return nativeItem.open;
    // Pattern A uses aria-expanded; Pattern B uses is-open on the item
    if (trigger.hasAttribute('aria-expanded')) {
      return trigger.getAttribute('aria-expanded') === 'true';
    }
    var item = getItem(trigger);
    return item ? item.classList.contains('is-open') : false;
  }

  // ── Open a single trigger ─────────────────────────────────

  function updateHeight(content) {
    // A direct body can still carry max-height: 0 from close(). Measuring that
    // constrained box omits its bottom padding from scrollHeight.
    content.style.maxHeight = 'none';
    content.style.maxHeight = content.scrollHeight + 'px';
  }

  function open(trigger) {
    var nativeItem = getNativeItem(trigger);
    if (nativeItem) {
      nativeItem.open = true;
      return;
    }
    var item = getItem(trigger);
    var content = getContent(trigger);
    if (trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'true');
    trigger.classList.add('is-open');
    if (item) item.classList.add('is-open');
    if (content) {
      content.classList.add('is-open');
      // Animate height (only meaningful for wb-accordion-content with max-height transition)
      updateHeight(content);
    }
  }

  // ── Close a single trigger ────────────────────────────────

  function close(trigger) {
    var nativeItem = getNativeItem(trigger);
    if (nativeItem) {
      nativeItem.open = false;
      return;
    }
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
    if (isOpen(trigger)) {
      close(trigger);
    } else {
      // In single mode, close all siblings first
      closeSiblings(trigger);
      open(trigger);
    }

    // Emit event
    // Native changes are reported once by the browser's toggle event below.
    if (!getNativeItem(trigger)) WBDom.emit(trigger, 'wb:accordion:toggle', { open: isOpen(trigger) });
  }

  // ── Recalculate open heights (e.g. after resize) ──────────

  function recalc() {
    document.querySelectorAll(TRIGGER_SEL).forEach(function (trigger) {
      if (getNativeItem(trigger) || !isOpen(trigger)) return;
      var content = getContent(trigger);
      if (content) updateHeight(content);
    });
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest(TRIGGER_SEL);
    if (trigger && !getNativeItem(trigger)) {
      e.preventDefault();
      toggle(trigger);
    }
  });

  // toggle does not bubble; capture also covers dynamically inserted details
  // and changes made through the native open property or named groups.
  document.addEventListener('toggle', function (e) {
    var item = e.target;
    if (!item.matches('details.wb-accordion-item')) return;
    var trigger = item.querySelector('summary');
    if (!trigger || !trigger.matches(TRIGGER_SEL) || getNativeItem(trigger) !== item) return;
    if (item.open) closeSiblings(trigger);
    WBDom.emit(trigger, 'wb:accordion:toggle', { open: item.open });
  }, true);

  window.addEventListener('resize', WBDom.debounce(recalc, 150));

  // ── Public API ─────────────────────────────────────────────

  window.WBAccordion = {
    open:   open,
    close:  close,
    toggle: toggle,
    recalc: recalc
  };

})();
