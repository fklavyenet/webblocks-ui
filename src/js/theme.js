/* ============================================================
   WebBlocks UI — Theme Engine (theme.js)
   Handles: light / dark / auto modes + accent color schemes
   Storage key: wb-theme, wb-accent
   ============================================================ */

(function () {
  'use strict';

  const THEME_KEY  = 'wb-theme';
  const ACCENT_KEY = 'wb-accent';
  const VALID_THEMES  = ['light', 'dark', 'auto'];
  const VALID_ACCENTS = ['ocean', 'forest', 'royal', 'warm', 'slate', 'rose', 'sand'];
  const DEFAULT_THEME  = 'auto';
  const DEFAULT_ACCENT = 'ocean';

  // ── Internal helpers ──────────────────────────────────────

  function prefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function resolveMode(theme) {
    if (theme === 'dark')  return 'dark';
    if (theme === 'light') return 'light';
    return prefersDark() ? 'dark' : 'light';
  }

  // ── Apply theme + accent to <html> ────────────────────────

  function applyTheme(theme) {
    if (!VALID_THEMES.includes(theme)) theme = DEFAULT_THEME;
    const mode = resolveMode(theme);
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    html.setAttribute('data-mode', mode);
    // Sync toggle buttons
    syncThemeButtons(theme);
  }

  function applyAccent(accent) {
    if (!VALID_ACCENTS.includes(accent)) accent = DEFAULT_ACCENT;
    document.documentElement.setAttribute('data-accent', accent);
    // Sync swatch buttons
    syncAccentButtons(accent);
  }

  // ── Persist and apply ─────────────────────────────────────

  function setTheme(theme) {
    if (!VALID_THEMES.includes(theme)) theme = DEFAULT_THEME;
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    applyTheme(theme);
  }

  function setAccent(accent) {
    if (!VALID_ACCENTS.includes(accent)) accent = DEFAULT_ACCENT;
    try { localStorage.setItem(ACCENT_KEY, accent); } catch (e) {}
    applyAccent(accent);
  }

  // ── Sync UI controls ──────────────────────────────────────

  function syncThemeButtons(theme) {
    document.querySelectorAll('[data-wb-theme-set]').forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-wb-theme-set') === theme);
    });
  }

  function syncAccentButtons(accent) {
    document.querySelectorAll('[data-wb-accent-set]').forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-wb-accent-set') === accent);
    });
  }

  // ── Event delegation ──────────────────────────────────────

  function attachListeners() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-wb-theme-set]');
      if (el) {
        e.preventDefault();
        setTheme(el.getAttribute('data-wb-theme-set'));
        return;
      }
      el = e.target.closest('[data-wb-accent-set]');
      if (el) {
        e.preventDefault();
        setAccent(el.getAttribute('data-wb-accent-set'));
      }
    });
  }

  // ── System preference listener ────────────────────────────

  function watchSystem() {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', function () {
      var stored;
      try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}
      if (!stored || stored === 'auto') applyTheme('auto');
    });
  }

  // ── Init ──────────────────────────────────────────────────

  function init() {
    var storedTheme, storedAccent;
    try {
      storedTheme  = localStorage.getItem(THEME_KEY);
      storedAccent = localStorage.getItem(ACCENT_KEY);
    } catch (e) {}

    applyTheme(storedTheme  || DEFAULT_THEME);
    applyAccent(storedAccent || DEFAULT_ACCENT);
    attachListeners();
    watchSystem();
  }

  // Run immediately so there's no flash
  init();

  // Expose API for programmatic use
  window.WBTheme = {
    set:       setTheme,
    setAccent: setAccent,
    get: function () {
      try { return localStorage.getItem(THEME_KEY) || DEFAULT_THEME; } catch (e) { return DEFAULT_THEME; }
    },
    getAccent: function () {
      try { return localStorage.getItem(ACCENT_KEY) || DEFAULT_ACCENT; } catch (e) { return DEFAULT_ACCENT; }
    }
  };

})();
