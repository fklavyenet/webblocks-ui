/* ============================================================
   WebBlocks UI — AJAX Toggle (ajax-toggle.js)

   Sends a POST request when a checkbox is toggled.
   On failure, reverts the checkbox to its previous state.

   Usage:
     <input type="checkbox"
            class="wb-switch-input"
            data-wb-ajax-toggle
            data-wb-url="/admin/posts/toggle"
            data-wb-field="publish"
            data-wb-id="42"
            checked>

   POST body (JSON):
     { "id": "42", "name": "publish", "checked": "true" }

   Headers sent:
     Content-Type: application/json
     X-CSRF-TOKEN: <meta name="csrf-token"> value (if present)
     X-Requested-With: XMLHttpRequest

   Success detection (either condition triggers success):
     - HTTP status 200–299
     - Response body contains { "success": true } (optional extra check)

   Feedback (data-wb-feedback):
     "toast"   — WBToast.show() on success and error (default)
     "none"    — silent; listen to custom events instead

   Custom events (all bubble, dispatched on the checkbox element):
     wb:ajax-toggle:success  — detail: { id, field, checked, response }
     wb:ajax-toggle:error    — detail: { id, field, checked, status, error }

   Options (data attributes):
     data-wb-ajax-toggle         — marker attribute (required)
     data-wb-url                 — POST endpoint (required)
     data-wb-field               — field/column name sent as "name" (required)
     data-wb-id                  — record identifier sent as "id" (required)
     data-wb-feedback            — "toast" | "none" (default: "toast")
     data-wb-success-msg         — custom success toast message
     data-wb-error-msg           — custom error toast message
   ============================================================ */

(function () {
  'use strict';

  // ── Read CSRF token from meta tag ─────────────────────────

  function getCsrfToken() {
    var meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : null;
  }

  // ── Handle a toggle ───────────────────────────────────────

  function handleToggle(checkbox) {
    var url      = checkbox.getAttribute('data-wb-url');
    var field    = checkbox.getAttribute('data-wb-field');
    var id       = checkbox.getAttribute('data-wb-id');
    var feedback = checkbox.getAttribute('data-wb-feedback') || 'toast';
    var successMsg = checkbox.getAttribute('data-wb-success-msg') || null;
    var errorMsg   = checkbox.getAttribute('data-wb-error-msg')   || null;

    if (!url || !field || !id) {
      console.warn('[WBAjaxToggle] Missing required attribute(s): data-wb-url, data-wb-field, data-wb-id');
      return;
    }

    var newChecked  = checkbox.checked;
    var prevChecked = !newChecked; // before this click it was the opposite

    // Disable during request to prevent double-clicks
    checkbox.disabled = true;

    var headers = {
      'Content-Type':     'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };

    var csrf = getCsrfToken();
    if (csrf) headers['X-CSRF-TOKEN'] = csrf;

    var body = JSON.stringify({
      id:      id,
      name:    field,
      checked: String(newChecked)
    });

    fetch(url, {
      method:      'POST',
      headers:     headers,
      body:        body,
      credentials: 'same-origin'
    })
    .then(function (response) {
      var ok = response.ok; // status 200-299

      // Try to parse JSON body for optional { success: true } check
      return response.text().then(function (text) {
        var json = null;
        try { json = JSON.parse(text); } catch (e) { /* not JSON */ }

        // If HTTP is OK but body explicitly says success: false, treat as error
        if (ok && json && json.success === false) {
          ok = false;
        }

        return { ok: ok, status: response.status, json: json };
      });
    })
    .then(function (result) {
      checkbox.disabled = false;

      if (result.ok) {
        // ── Success ──────────────────────────────────────────
        if (feedback === 'toast' && window.WBToast) {
          WBToast.show(
            successMsg || (newChecked ? 'Enabled' : 'Disabled'),
            { type: 'success', duration: 2500 }
          );
        }

        WBDom.emit(checkbox, 'wb:ajax-toggle:success', {
          id:       id,
          field:    field,
          checked:  newChecked,
          response: result.json
        });

      } else {
        // ── Error — revert checkbox ───────────────────────────
        checkbox.checked = prevChecked;

        if (feedback === 'toast' && window.WBToast) {
          WBToast.show(
            errorMsg || 'An error occurred. Please try again.',
            { type: 'danger', duration: 4000 }
          );
        }

        WBDom.emit(checkbox, 'wb:ajax-toggle:error', {
          id:      id,
          field:   field,
          checked: newChecked,
          status:  result.status,
          error:   result.json
        });
      }
    })
    .catch(function (err) {
      // Network error / fetch failed
      checkbox.disabled = false;
      checkbox.checked  = prevChecked;

      if (feedback === 'toast' && window.WBToast) {
        WBToast.show(
          errorMsg || 'Network error. Please check your connection.',
          { type: 'danger', duration: 4000 }
        );
      }

      WBDom.emit(checkbox, 'wb:ajax-toggle:error', {
        id:      id,
        field:   field,
        checked: newChecked,
        status:  0,
        error:   err
      });
    });
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('change', function (e) {
    var checkbox = e.target;
    if (
      checkbox.tagName === 'INPUT' &&
      checkbox.type    === 'checkbox' &&
      checkbox.hasAttribute('data-wb-ajax-toggle')
    ) {
      handleToggle(checkbox);
    }
  });

  // ── Public API ────────────────────────────────────────────

  window.WBAjaxToggle = {
    handle: handleToggle
  };

})();
