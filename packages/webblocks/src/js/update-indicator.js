/* ============================================================
   WebBlocks UI — Update Indicator (WBUpdateIndicator)
   A navbar "update available" badge that reveals itself from a
   JSON status endpoint. The element starts `hidden`; the badge
   is shown only when the endpoint reports an available update.

   Markup (a shipped icon action; the dot uses the wb-btn-dot primitive):
     <a class="wb-btn wb-btn-ghost wb-btn-icon"
        data-wb-update-indicator
        data-wb-update-indicator-url="/path/to/indicator.json"
        data-wb-update-indicator-state="unknown"
        hidden>
       <i class="wb-icon wb-icon-download" aria-hidden="true"></i>
       <span class="wb-btn-dot" aria-hidden="true"></span>
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

   Fails safe, not silent: a bad status, an unparseable body or a network
   error leaves the badge hidden — the page never breaks over an update
   check — but the element is marked `data-wb-update-indicator-state="error"`
   and the reason is reported with console.warn. Silence here is expensive:
   a badge that never appears looks identical whether the endpoint 404s,
   redirects to a login page, or correctly reports "no update".

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

  function fail(el, url, reason) {
    el.hidden = true;
    el.setAttribute('data-wb-update-indicator-state', 'error');

    if (window.console && typeof window.console.warn === 'function') {
      window.console.warn('[wb-update-indicator] ' + reason + ' — ' + url + '. The update badge stays hidden.');
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
      if (!response.ok) {
        fail(el, url, 'the status endpoint answered HTTP ' + response.status);

        return null;
      }

      // An auth redirect lands here as 200 HTML and throws on parse — worth
      // saying out loud, since it looks exactly like "no update available".
      return response.json().then(null, function () {
        fail(el, url, 'the status endpoint did not return JSON');

        return null;
      });
    }).then(function (data) {
      if (data !== null) {
        apply(el, data);
      }
    }).catch(function (error) {
      fail(el, url, 'the status request failed (' + (error && error.message ? error.message : 'network error') + ')');
    });
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
