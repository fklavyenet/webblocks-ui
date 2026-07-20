/* ============================================================
   WebBlocks UI — Update Indicator (WBUpdateIndicator)
   A navbar "update available" badge that reveals itself from a
   JSON status endpoint. The element starts `hidden`; the badge
   is shown only when the endpoint reports an available update.

   Markup:
     <a class="wb-navbar-icon-trigger wb-navbar-update-indicator"
        data-wb-update-indicator
        data-wb-update-indicator-url="/path/to/indicator.json"
        data-wb-update-indicator-state="unknown"
        hidden>
       <i class="wb-icon wb-icon-download" aria-hidden="true"></i>
       <span class="wb-navbar-update-dot" aria-hidden="true"></span>
       <span class="wb-sr-only" data-wb-update-indicator-label>Update available</span>
     </a>

   Endpoint JSON (fetched once on load, same-origin, credentialed):
     { "visible": true, "state": "update_available",
       "label": "Update 1.2.3 available", "url": "/admin/updates" }
   - visible : boolean — badge is revealed only when strictly === true
   - state   : string  — mirrored onto data-wb-update-indicator-state
   - label   : string  — sets aria-label, title, and the
                         [data-wb-update-indicator-label] text
   - url     : string  — optional; sets the element href

   Fails silently: a network/parse error leaves the badge hidden.

   Public API:
     WBUpdateIndicator.refresh()          — re-fetch every indicator
     WBUpdateIndicator.refresh(element)    — re-fetch one indicator
   ============================================================ */
(function () {
  'use strict';

  var SELECTOR = '[data-wb-update-indicator]';

  function apply(el, data) {
    if (!data || data.visible !== true) {
      el.hidden = true;

      return;
    }

    el.hidden = false;

    if (typeof data.state === 'string') {
      el.setAttribute('data-wb-update-indicator-state', data.state);
    }

    if (typeof data.label === 'string') {
      el.setAttribute('aria-label', data.label);
      el.setAttribute('title', data.label);

      var label = el.querySelector('[data-wb-update-indicator-label]');
      if (label) {
        label.textContent = data.label;
      }
    }

    if (typeof data.url === 'string' && data.url) {
      el.setAttribute('href', data.url);
    }
  }

  function refreshOne(el) {
    var url = el.getAttribute('data-wb-update-indicator-url');
    if (!url) {
      return;
    }

    window.fetch(url, {
      headers: { Accept: 'application/json' },
      credentials: 'same-origin'
    }).then(function (response) {
      return response.ok ? response.json() : null;
    }).then(function (data) {
      apply(el, data);
    }).catch(function () {});
  }

  function refresh(target) {
    if (target && target.nodeType === 1) {
      refreshOne(target);

      return;
    }

    var nodes = document.querySelectorAll(SELECTOR);
    for (var i = 0; i < nodes.length; i++) {
      refreshOne(nodes[i]);
    }
  }

  function init() {
    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Public API ─────────────────────────────────────────── */
  window.WBUpdateIndicator = {
    refresh: refresh
  };
})();
