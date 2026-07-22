/* ============================================================
   WebBlocks UI — Busy Submit (WBBusySubmit)
   Locks a submit button and shows the wb-btn busy state while its
   form is in flight.

   Markup:
     <button class="wb-btn wb-btn-primary" type="submit"
             data-wb-busy
             data-wb-busy-label="Saving…">
       <span data-wb-busy-text>Save</span>
     </button>

   Behavior on the owning form's submit event:
   - adds `.is-busy` and `aria-busy="true"` to the button
   - disables the button (submission has already fired, so this
     only blocks a second click)
   - when `data-wb-busy-label` is set, swaps the `[data-wb-busy-text]`
     node's text (or the aria-label as a fallback) to that label

   Public API:
     WBBusySubmit.bind()          — bind any unbound [data-wb-busy]
                                    buttons (call after injecting DOM)
   ============================================================ */
(function () {
  'use strict';

  function bindOne(button) {
    var form = button.closest('form');

    if (!form || button.getAttribute('data-wb-busy-bound') === 'true') {
      return;
    }

    button.setAttribute('data-wb-busy-bound', 'true');

    form.addEventListener('submit', function () {
      var busyLabel = button.getAttribute('data-wb-busy-label');
      var textNode = button.querySelector('[data-wb-busy-text]');

      button.classList.add('is-busy');
      button.setAttribute('aria-busy', 'true');
      button.disabled = true;

      if (busyLabel) {
        if (textNode) {
          textNode.textContent = busyLabel;
        }

        button.setAttribute('aria-label', busyLabel);
      }
    });
  }

  function bind() {
    document.querySelectorAll('[data-wb-busy]').forEach(bindOne);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  window.WBBusySubmit = { bind: bind };
}());
