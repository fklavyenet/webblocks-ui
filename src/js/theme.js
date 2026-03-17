/* ============================================================
   WebBlocks UI — Theme Engine (theme.js)

   Axes:
     data-mode     light | dark | auto         (on <html>, CSS-native)
     data-preset   modern | minimal | ...      (on <html>, JS bundle)
      data-accent   ocean | forest | sunset | royal | mint | amber | rose | slate-fire
     data-radius   sharp | default | soft      (on <html>, CSS override)
     data-density  compact | default | ...     (on <html>, CSS override)
     data-shadow   flat | default | soft       (on <html>, CSS override)
     data-font     system | modern | editorial (on <html>, CSS override)

   Storage keys:  wb-mode, wb-preset, wb-accent, wb-radius,
                  wb-density, wb-shadow, wb-font

   Button hooks:  data-wb-mode-set="light|dark|auto"
                  data-wb-preset-set="modern|minimal|..."
                  data-wb-accent-set="ocean|..."
                  data-wb-radius-set="sharp|default|soft"
                  data-wb-density-set="compact|default|comfortable"
                  data-wb-shadow-set="flat|default|soft"
                  data-wb-font-set="system|modern|editorial"

   Public API:    WBTheme.setMode(v)   WBTheme.getMode()
                  WBTheme.setPreset(v) WBTheme.getPreset()
                  WBTheme.setAccent(v) WBTheme.getAccent()
                  WBTheme.setRadius(v) WBTheme.getRadius()
                  WBTheme.setDensity(v) WBTheme.getDensity()
                  WBTheme.setShadow(v) WBTheme.getShadow()
                  WBTheme.setFont(v)   WBTheme.getFont()
   ============================================================ */

(function () {
  'use strict';

  // ── Storage keys ──────────────────────────────────────────
  var MODE_KEY    = 'wb-mode';
  var PRESET_KEY  = 'wb-preset';
  var ACCENT_KEY  = 'wb-accent';
  var RADIUS_KEY  = 'wb-radius';
  var DENSITY_KEY = 'wb-density';
  var SHADOW_KEY  = 'wb-shadow';
  var FONT_KEY    = 'wb-font';

  // ── Valid values ──────────────────────────────────────────
  var VALID_MODES     = ['light', 'dark', 'auto'];
  var VALID_PRESETS   = ['modern', 'minimal', 'editorial', 'playful', 'corporate'];
  var VALID_ACCENTS   = ['ocean', 'forest', 'sunset', 'royal', 'mint', 'amber', 'rose', 'slate-fire'];
  var VALID_RADII     = ['sharp', 'default', 'soft'];
  var VALID_DENSITIES = ['compact', 'default', 'comfortable'];
  var VALID_SHADOWS   = ['flat', 'default', 'soft'];
  var VALID_FONTS     = ['system', 'modern', 'editorial'];

  // ── Defaults ──────────────────────────────────────────────
  var DEFAULT_MODE    = 'auto';
  var DEFAULT_PRESET  = null;   // no preset by default
  var DEFAULT_ACCENT  = 'ocean';
  var DEFAULT_RADIUS  = 'default';
  var DEFAULT_DENSITY = 'default';
  var DEFAULT_SHADOW  = 'default';
  var DEFAULT_FONT    = 'modern';

  // ── Named presets ─────────────────────────────────────────
  // Each preset is a full bundle of axis values. When applied,
  // all axes are set simultaneously. Individual axes can still
  // be overridden after applying a preset.
  var PRESETS = {
    modern: {
      accent: 'ocean', radius: 'default', density: 'default',
      shadow: 'default', font: 'modern'
    },
    minimal: {
      accent: 'ocean', radius: 'sharp', density: 'compact',
      shadow: 'flat', font: 'system'
    },
    editorial: {
      accent: 'sunset', radius: 'soft', density: 'comfortable',
      shadow: 'soft', font: 'editorial'
    },
    playful: {
      accent: 'rose', radius: 'soft', density: 'comfortable',
      shadow: 'soft', font: 'modern'
    },
    corporate: {
      accent: 'royal', radius: 'sharp', density: 'default',
      shadow: 'flat', font: 'system'
    }
  };

  // ── localStorage helper ───────────────────────────────────
  // Delegates to WBStorage (utils/storage.js)

  function ls(key, val) {
    if (val === undefined) return WBStorage.get(key);
    if (val === null) { WBStorage.remove(key); return; }
    WBStorage.set(key, val);
  }

  // ── OS dark preference ────────────────────────────────────
  function prefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // ── Apply individual axes ─────────────────────────────────

  function applyMode(mode) {
    if (!VALID_MODES.includes(mode)) mode = DEFAULT_MODE;
    document.documentElement.setAttribute('data-mode', mode);
    syncButtons('[data-wb-mode-set]', mode);
  }

  function applyAccent(accent) {
    if (!VALID_ACCENTS.includes(accent)) accent = DEFAULT_ACCENT;
    document.documentElement.setAttribute('data-accent', accent);
    syncButtons('[data-wb-accent-set]', accent);
  }

  function applyRadius(radius) {
    if (!VALID_RADII.includes(radius)) radius = DEFAULT_RADIUS;
    var html = document.documentElement;
    if (radius === 'default') { html.removeAttribute('data-radius'); }
    else { html.setAttribute('data-radius', radius); }
    syncButtons('[data-wb-radius-set]', radius);
  }

  function applyDensity(density) {
    if (!VALID_DENSITIES.includes(density)) density = DEFAULT_DENSITY;
    var html = document.documentElement;
    if (density === 'default') { html.removeAttribute('data-density'); }
    else { html.setAttribute('data-density', density); }
    syncButtons('[data-wb-density-set]', density);
  }

  function applyShadow(shadow) {
    if (!VALID_SHADOWS.includes(shadow)) shadow = DEFAULT_SHADOW;
    var html = document.documentElement;
    if (shadow === 'default') { html.removeAttribute('data-shadow'); }
    else { html.setAttribute('data-shadow', shadow); }
    syncButtons('[data-wb-shadow-set]', shadow);
  }

  function applyFont(font) {
    if (!VALID_FONTS.includes(font)) font = DEFAULT_FONT;
    document.documentElement.setAttribute('data-font', font);
    syncButtons('[data-wb-font-set]', font);
  }

  // ── Preset apply (bundles all axes) ───────────────────────

  function applyPreset(preset) {
    if (!VALID_PRESETS.includes(preset)) return;
    var def = PRESETS[preset];
    document.documentElement.setAttribute('data-preset', preset);
    // Apply each axis (also saves to localStorage via setters)
    setAccent(def.accent);
    setRadius(def.radius);
    setDensity(def.density);
    setShadow(def.shadow);
    setFont(def.font);
    syncButtons('[data-wb-preset-set]', preset);
  }

  // ── Persist + apply (public setters) ─────────────────────

  function setMode(mode) {
    if (!VALID_MODES.includes(mode)) mode = DEFAULT_MODE;
    ls(MODE_KEY, mode);
    applyMode(mode);
  }

  function cycleMode() {
    var current = ls(MODE_KEY) || DEFAULT_MODE;
    var next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
    setMode(next);
    syncCycleButtons();
  }

  // Update icon on data-wb-mode-cycle buttons to reflect current mode
  function syncCycleButtons() {
    var mode = ls(MODE_KEY) || DEFAULT_MODE;
    var iconMap = { light: 'sun', dark: 'moon', auto: 'sun-moon' };
    var icon = iconMap[mode] || 'sun-moon';
    document.querySelectorAll('[data-wb-mode-cycle]').forEach(function (btn) {
      // Update SVG <use> href if present
      var use = btn.querySelector('use');
      if (use) use.setAttribute('href', '#' + icon);
      // Update <i> class if present
      var i = btn.querySelector('i.wb-icon');
      if (i) {
        i.className = i.className.replace(/wb-icon-sun(-moon)?|wb-icon-moon/g, '').trim();
        i.classList.add('wb-icon-' + icon);
      }
      // Update title/aria-label
      var labels = { light: 'Light mode', dark: 'Dark mode', auto: 'Auto mode' };
      btn.setAttribute('title', labels[mode]);
      btn.setAttribute('aria-label', labels[mode]);
    });
  }

  function setPreset(preset) {
    if (!VALID_PRESETS.includes(preset)) return;
    ls(PRESET_KEY, preset);
    applyPreset(preset);
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

  // ── Sync UI buttons ───────────────────────────────────────

  function syncButtons(selector, value) {
    document.querySelectorAll(selector).forEach(function (el) {
      var attrName = selector.replace('[', '').replace(']', '');
      el.classList.toggle('is-active', el.getAttribute(attrName) === value);
    });
  }

  function syncAllButtons() {
    syncButtons('[data-wb-mode-set]',    ls(MODE_KEY)    || DEFAULT_MODE);
    syncButtons('[data-wb-preset-set]',  ls(PRESET_KEY)  || '');
    syncButtons('[data-wb-accent-set]',  ls(ACCENT_KEY)  || DEFAULT_ACCENT);
    syncButtons('[data-wb-radius-set]',  ls(RADIUS_KEY)  || DEFAULT_RADIUS);
    syncButtons('[data-wb-density-set]', ls(DENSITY_KEY) || DEFAULT_DENSITY);
    syncButtons('[data-wb-shadow-set]',  ls(SHADOW_KEY)  || DEFAULT_SHADOW);
    syncButtons('[data-wb-font-set]',    ls(FONT_KEY)    || DEFAULT_FONT);
  }

  // ── Event delegation ──────────────────────────────────────

  function attachListeners() {
    document.addEventListener('click', function (e) {
      var el;

      el = e.target.closest('[data-wb-mode-cycle]');
      if (el) { e.preventDefault(); cycleMode(); return; }

      el = e.target.closest('[data-wb-mode-set]');
      if (el) { e.preventDefault(); setMode(el.getAttribute('data-wb-mode-set')); return; }

      el = e.target.closest('[data-wb-preset-set]');
      if (el) { e.preventDefault(); setPreset(el.getAttribute('data-wb-preset-set')); return; }

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

    // Re-sync buttons after any Livewire/SPA navigation
    document.addEventListener('DOMContentLoaded', syncAllButtons);
  }

  // ── OS preference watcher ─────────────────────────────────

  function watchSystem() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      // If user is in "auto" mode, re-apply so syncButtons reflects current visual state
      var stored = ls(MODE_KEY);
      if (!stored || stored === 'auto') syncButtons('[data-wb-mode-set]', 'auto');
    });
  }

  // ── Init ──────────────────────────────────────────────────

  function init() {
    // Mode (must run first — affects surface colors)
    applyMode(ls(MODE_KEY) || DEFAULT_MODE);

    // Preset (if stored, mark data-preset attribute for reference)
    var storedPreset = ls(PRESET_KEY);
    if (storedPreset && VALID_PRESETS.includes(storedPreset)) {
      document.documentElement.setAttribute('data-preset', storedPreset);
    }

    // Individual axes — restored from localStorage independently.
    // These may have been set by a previous preset OR by manual overrides.
    applyAccent( ls(ACCENT_KEY)  || DEFAULT_ACCENT);
    applyRadius( ls(RADIUS_KEY)  || DEFAULT_RADIUS);
    applyDensity(ls(DENSITY_KEY) || DEFAULT_DENSITY);
    applyShadow( ls(SHADOW_KEY)  || DEFAULT_SHADOW);
    applyFont(   ls(FONT_KEY)    || DEFAULT_FONT);

    attachListeners();
    watchSystem();
    // Sync cycle buttons after DOM is ready (icons need to reflect stored mode)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', syncCycleButtons);
    } else {
      syncCycleButtons();
    }
  }

  // Run immediately — before paint — to prevent flash
  init();

  // ── Public API ────────────────────────────────────────────

  window.WBTheme = {
    setMode:     setMode,
    getMode:     function () { return ls(MODE_KEY)    || DEFAULT_MODE;    },

    setPreset:   setPreset,
    getPreset:   function () { return ls(PRESET_KEY)  || null;            },

    setAccent:   setAccent,
    getAccent:   function () { return ls(ACCENT_KEY)  || DEFAULT_ACCENT;  },

    setRadius:   setRadius,
    getRadius:   function () { return ls(RADIUS_KEY)  || DEFAULT_RADIUS;  },

    setDensity:  setDensity,
    getDensity:  function () { return ls(DENSITY_KEY) || DEFAULT_DENSITY; },

    setShadow:   setShadow,
    getShadow:   function () { return ls(SHADOW_KEY)  || DEFAULT_SHADOW;  },

    setFont:     setFont,
    getFont:     function () { return ls(FONT_KEY)    || DEFAULT_FONT;    },

    // Convenience: get all current axis values
    getAll: function () {
      return {
        mode:    window.WBTheme.getMode(),
        preset:  window.WBTheme.getPreset(),
        accent:  window.WBTheme.getAccent(),
        radius:  window.WBTheme.getRadius(),
        density: window.WBTheme.getDensity(),
        shadow:  window.WBTheme.getShadow(),
        font:    window.WBTheme.getFont(),
      };
    },

    // Expose preset definitions for tooling / UI builders
    presets: PRESETS,
  };

})();
