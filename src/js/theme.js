/* ============================================================
   WebBlocks UI — Theme Engine (theme.js)
   Handles: light / dark / auto modes + accent color schemes
            + radius / density / shadow / font axes
   Storage keys: wb-theme, wb-accent, wb-radius,
                 wb-density, wb-shadow, wb-font
   ============================================================ */

(function () {
  'use strict';

  var THEME_KEY   = 'wb-theme';
  var ACCENT_KEY  = 'wb-accent';
  var RADIUS_KEY  = 'wb-radius';
  var DENSITY_KEY = 'wb-density';
  var SHADOW_KEY  = 'wb-shadow';
  var FONT_KEY    = 'wb-font';

  var VALID_THEMES   = ['light', 'dark', 'auto'];
  var VALID_ACCENTS  = ['ocean', 'forest', 'royal', 'warm', 'slate', 'rose', 'sand'];
  var VALID_RADII    = ['sharp', 'default', 'soft'];
  var VALID_DENSITIES = ['compact', 'default', 'comfortable'];
  var VALID_SHADOWS  = ['flat', 'default', 'soft'];
  var VALID_FONTS    = ['system', 'modern', 'editorial'];

  var DEFAULT_THEME   = 'auto';
  var DEFAULT_ACCENT  = 'ocean';
  var DEFAULT_RADIUS  = 'default';
  var DEFAULT_DENSITY = 'default';
  var DEFAULT_SHADOW  = 'default';
  var DEFAULT_FONT    = 'modern';

  // ── Internal helpers ──────────────────────────────────────

  function prefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function resolveMode(theme) {
    if (theme === 'dark')  return 'dark';
    if (theme === 'light') return 'light';
    return prefersDark() ? 'dark' : 'light';
  }

  function ls(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) {}
  }

  // ── Apply individual axes to <html> ───────────────────────

  function applyTheme(theme) {
    if (!VALID_THEMES.includes(theme)) theme = DEFAULT_THEME;
    var mode = resolveMode(theme);
    var html = document.documentElement;
    html.setAttribute('data-theme', theme);
    html.setAttribute('data-mode', mode);
    syncButtons('[data-wb-theme-set]', theme);
  }

  function applyAccent(accent) {
    if (!VALID_ACCENTS.includes(accent)) accent = DEFAULT_ACCENT;
    document.documentElement.setAttribute('data-accent', accent);
    syncButtons('[data-wb-accent-set]', accent);
  }

  function applyRadius(radius) {
    if (!VALID_RADII.includes(radius)) radius = DEFAULT_RADIUS;
    var html = document.documentElement;
    if (radius === 'default') {
      html.removeAttribute('data-radius');
    } else {
      html.setAttribute('data-radius', radius);
    }
    syncButtons('[data-wb-radius-set]', radius);
  }

  function applyDensity(density) {
    if (!VALID_DENSITIES.includes(density)) density = DEFAULT_DENSITY;
    var html = document.documentElement;
    if (density === 'default') {
      html.removeAttribute('data-density');
    } else {
      html.setAttribute('data-density', density);
    }
    syncButtons('[data-wb-density-set]', density);
  }

  function applyShadow(shadow) {
    if (!VALID_SHADOWS.includes(shadow)) shadow = DEFAULT_SHADOW;
    var html = document.documentElement;
    if (shadow === 'default') {
      html.removeAttribute('data-shadow');
    } else {
      html.setAttribute('data-shadow', shadow);
    }
    syncButtons('[data-wb-shadow-set]', shadow);
  }

  function applyFont(font) {
    if (!VALID_FONTS.includes(font)) font = DEFAULT_FONT;
    document.documentElement.setAttribute('data-font', font);
    syncButtons('[data-wb-font-set]', font);
  }

  // ── Sync UI controls ──────────────────────────────────────

  function syncButtons(selector, value) {
    document.querySelectorAll(selector).forEach(function (el) {
      var attr = el.getAttributeNames().find(function (a) { return a.startsWith('data-wb-') && a.endsWith('-set'); });
      el.classList.toggle('is-active', attr ? el.getAttribute(attr) === value : false);
    });
  }

  // ── Persist + apply ───────────────────────────────────────

  function setTheme(theme) {
    if (!VALID_THEMES.includes(theme)) theme = DEFAULT_THEME;
    ls(THEME_KEY, theme);
    applyTheme(theme);
  }

  function setAccent(accent) {
    if (!VALID_ACCENTS.includes(accent)) accent = DEFAULT_ACCENT;
    ls(ACCENT_KEY, accent);
    applyAccent(accent);
  }

  function setRadius(radius) {
    if (!VALID_RADII.includes(radius)) radius = DEFAULT_RADIUS;
    ls(RADIUS_KEY, radius);
    applyRadius(radius);
  }

  function setDensity(density) {
    if (!VALID_DENSITIES.includes(density)) density = DEFAULT_DENSITY;
    ls(DENSITY_KEY, density);
    applyDensity(density);
  }

  function setShadow(shadow) {
    if (!VALID_SHADOWS.includes(shadow)) shadow = DEFAULT_SHADOW;
    ls(SHADOW_KEY, shadow);
    applyShadow(shadow);
  }

  function setFont(font) {
    if (!VALID_FONTS.includes(font)) font = DEFAULT_FONT;
    ls(FONT_KEY, font);
    applyFont(font);
  }

  // ── Event delegation ──────────────────────────────────────

  function attachListeners() {
    document.addEventListener('click', function (e) {
      var el;

      el = e.target.closest('[data-wb-theme-set]');
      if (el) { e.preventDefault(); setTheme(el.getAttribute('data-wb-theme-set')); return; }

      el = e.target.closest('[data-wb-accent-set]');
      if (el) { e.preventDefault(); setAccent(el.getAttribute('data-wb-accent-set')); return; }

      el = e.target.closest('[data-wb-radius-set]');
      if (el) { e.preventDefault(); setRadius(el.getAttribute('data-wb-radius-set')); return; }

      el = e.target.closest('[data-wb-density-set]');
      if (el) { e.preventDefault(); setDensity(el.getAttribute('data-wb-density-set')); return; }

      el = e.target.closest('[data-wb-shadow-set]');
      if (el) { e.preventDefault(); setShadow(el.getAttribute('data-wb-shadow-set')); return; }

      el = e.target.closest('[data-wb-font-set]');
      if (el) { e.preventDefault(); setFont(el.getAttribute('data-wb-font-set')); return; }
    });
  }

  // ── System preference listener ────────────────────────────

  function watchSystem() {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', function () {
      var stored = ls(THEME_KEY);
      if (!stored || stored === 'auto') applyTheme('auto');
    });
  }

  // ── Init ──────────────────────────────────────────────────

  function init() {
    applyTheme(  ls(THEME_KEY)   || DEFAULT_THEME);
    applyAccent( ls(ACCENT_KEY)  || DEFAULT_ACCENT);
    applyRadius( ls(RADIUS_KEY)  || DEFAULT_RADIUS);
    applyDensity(ls(DENSITY_KEY) || DEFAULT_DENSITY);
    applyShadow( ls(SHADOW_KEY)  || DEFAULT_SHADOW);
    applyFont(   ls(FONT_KEY)    || DEFAULT_FONT);
    attachListeners();
    watchSystem();
  }

  // Run immediately so there's no flash
  init();

  // ── Public API ────────────────────────────────────────────

  window.WBTheme = {
    // Light / dark / auto
    set:    setTheme,
    get:    function () { return ls(THEME_KEY)   || DEFAULT_THEME;   },
    // Accent color scheme
    setAccent:  setAccent,
    getAccent:  function () { return ls(ACCENT_KEY)  || DEFAULT_ACCENT;  },
    // Radius
    setRadius:  setRadius,
    getRadius:  function () { return ls(RADIUS_KEY)  || DEFAULT_RADIUS;  },
    // Density
    setDensity: setDensity,
    getDensity: function () { return ls(DENSITY_KEY) || DEFAULT_DENSITY; },
    // Shadow
    setShadow:  setShadow,
    getShadow:  function () { return ls(SHADOW_KEY)  || DEFAULT_SHADOW;  },
    // Font
    setFont:    setFont,
    getFont:    function () { return ls(FONT_KEY)    || DEFAULT_FONT;    },
  };

})();
