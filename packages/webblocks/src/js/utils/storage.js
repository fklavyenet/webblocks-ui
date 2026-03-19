/* ============================================================
   WebBlocks UI — Storage Utilities (utils/storage.js)

   Safe localStorage wrapper used by theme.js and any other
   module that needs to persist state across page loads.
   Exposed on window.WBStorage — internal API for WB modules.
   ============================================================ */

(function () {
  'use strict';

  // ── Safe localStorage access ──────────────────────────────
  // Falls back silently in private browsing or when storage
  // is blocked by browser policy.

  function get(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function set(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  function remove(key) {
    try { localStorage.removeItem(key); } catch (e) {}
  }

  // ── Public API ────────────────────────────────────────────

  window.WBStorage = {
    get:    get,
    set:    set,
    remove: remove
  };

})();
