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
/* ============================================================
   WebBlocks UI — DOM Utilities (utils/dom.js)

   Shared helpers used across all WB modules.
   Exposed on window.WBDom — not intended for direct use by
   page authors; internal API for WB modules only.
   ============================================================ */

(function () {
  'use strict';

  // ── Focusable elements selector ───────────────────────────
  // Used by modal.js, drawer.js (focus trap)

  var FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  // ── Focus trap ────────────────────────────────────────────
  // Keeps Tab focus cycling within a container element.
  // Call inside a keydown handler.

  function trapFocus(e, container) {
    if (e.key !== 'Tab') return;
    var focusable = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
    if (!focusable.length) return;

    var first = focusable[0];
    var last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // ── Focus first focusable element in container ────────────

  function focusFirst(container) {
    requestAnimationFrame(function () {
      var first = container.querySelector(FOCUSABLE_SELECTOR);
      if (first) first.focus();
    });
  }

  // ── Emit a custom event ───────────────────────────────────

  function emit(element, eventName, detail) {
    element.dispatchEvent(new CustomEvent(eventName, {
      bubbles: true,
      detail: detail || {}
    }));
  }

  // ── Debounce ──────────────────────────────────────────────
  // Returns a debounced version of fn.

  function debounce(fn, delay) {
    var timer;
    return function () {
      var args = arguments;
      var ctx  = this;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
    };
  }

  // ── Resolve a target element from a selector string ───────

  function resolveTarget(selector) {
    if (!selector) return null;
    if (selector === 'body') return document.body;
    return document.querySelector(selector);
  }

  // ── Public API ────────────────────────────────────────────

  window.WBDom = {
    FOCUSABLE:     FOCUSABLE_SELECTOR,
    trapFocus:     trapFocus,
    focusFirst:    focusFirst,
    emit:          emit,
    debounce:      debounce,
    resolveTarget: resolveTarget
  };

})();
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
      if (use) use.setAttribute('href', '#wb-icon-' + icon);
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

    // Re-sync cycle button icons — call after injecting SVG sprite into DOM
    sync: syncCycleButtons,
  };

})();
/* ============================================================
   WebBlocks UI — Dropdown (dropdown.js)

   Usage:
     <div class="wb-dropdown">
       <button data-wb-toggle="dropdown" data-wb-target="#myMenu">
         Open
       </button>
       <ul class="wb-dropdown-menu" id="myMenu">
         <li><a class="wb-dropdown-item" href="#">Item</a></li>
       </ul>
     </div>

   Or self-contained (toggle + menu share the same .wb-dropdown parent):
     <div class="wb-dropdown">
       <button data-wb-toggle="dropdown">Open</button>
       <ul class="wb-dropdown-menu"> ... </ul>
     </div>
   ============================================================ */

(function () {
  'use strict';

  var openDropdown = null; // currently open menu element

  function getMenu(trigger) {
    var targetId = trigger.getAttribute('data-wb-target');
    if (targetId) return document.querySelector(targetId);
    // Fallback: first .wb-dropdown-menu in the same .wb-dropdown parent
    var parent = trigger.closest('.wb-dropdown');
    return parent ? parent.querySelector('.wb-dropdown-menu') : null;
  }

  function open(trigger, menu) {
    // Close any currently open dropdown first
    if (openDropdown && openDropdown !== menu) close(openDropdown);

    menu.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    openDropdown = menu;

    // Position: flip upward if overflows viewport bottom
    requestAnimationFrame(function () {
      var rect = menu.getBoundingClientRect();
      if (rect.bottom > window.innerHeight && rect.top > rect.height) {
        menu.classList.add('wb-dropdown-menu--up');
      } else {
        menu.classList.remove('wb-dropdown-menu--up');
      }
    });
  }

  function close(menu) {
    if (!menu) return;
    menu.classList.remove('is-open');
    // Reset aria-expanded on the associated trigger
    var parent = menu.closest('.wb-dropdown');
    if (parent) {
      var trigger = parent.querySelector('[data-wb-toggle="dropdown"]');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
    if (openDropdown === menu) openDropdown = null;
  }

  function toggle(trigger) {
    var menu = getMenu(trigger);
    if (!menu) return;
    if (menu.classList.contains('is-open')) {
      close(menu);
    } else {
      open(trigger, menu);
    }
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-wb-toggle="dropdown"]');
    if (trigger) {
      e.stopPropagation();
      toggle(trigger);
      return;
    }

    // Dismiss on data-wb-dismiss
    var dismiss = e.target.closest('[data-wb-dismiss="dropdown"]');
    if (dismiss) {
      var menu = dismiss.closest('.wb-dropdown-menu');
      if (menu) close(menu);
      return;
    }

    // Close dropdown when a menu item is clicked (but allow other handlers to run first)
    var menuItem = e.target.closest('.wb-dropdown-item');
    if (menuItem && openDropdown) {
      var menu = menuItem.closest('.wb-dropdown-menu');
      if (menu && menu === openDropdown) {
        // Delay close slightly to allow other click handlers (like theme toggle) to run
        setTimeout(function () { if (openDropdown === menu) close(menu); }, 10);
        return;
      }
    }

    // Close on outside click
    if (openDropdown && !openDropdown.contains(e.target)) {
      close(openDropdown);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openDropdown) {
      // Return focus to trigger
      var parent = openDropdown.closest('.wb-dropdown');
      var trigger = parent && parent.querySelector('[data-wb-toggle="dropdown"]');
      close(openDropdown);
      if (trigger) trigger.focus();
    }
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBDropdown = {
    open: function (menuEl) {
      var parent = menuEl.closest('.wb-dropdown');
      var trigger = parent && parent.querySelector('[data-wb-toggle="dropdown"]');
      open(trigger, menuEl);
    },
    close: close,
    closeAll: function () { if (openDropdown) close(openDropdown); }
  };

})();
/* ============================================================
   WebBlocks UI — Modal (modal.js)

   Usage:
     <!-- Trigger -->
     <button data-wb-toggle="modal" data-wb-target="#myModal">Open</button>

     <!-- Modal -->
     <div class="wb-modal" id="myModal" role="dialog" aria-modal="true" aria-labelledby="myModalTitle">
       <div class="wb-modal-dialog">
         <div class="wb-modal-header">
           <h5 class="wb-modal-title" id="myModalTitle">Title</h5>
           <button class="wb-modal-close" data-wb-dismiss="modal" aria-label="Close">&times;</button>
         </div>
         <div class="wb-modal-body">Content</div>
         <div class="wb-modal-footer">
           <button class="wb-btn wb-btn-secondary" data-wb-dismiss="modal">Cancel</button>
           <button class="wb-btn wb-btn-primary">Save</button>
         </div>
       </div>
     </div>
   ============================================================ */

(function () {
  'use strict';

  var activeModal       = null;
  var previouslyFocused = null;

  // ── Open ──────────────────────────────────────────────────

  function open(modal) {
    if (!modal) return;
    if (activeModal) close(activeModal);

    previouslyFocused = document.activeElement;
    activeModal = modal;

    modal.classList.add('is-open');
    document.body.classList.add('wb-modal-open');

    WBDom.focusFirst(modal);
    WBDom.emit(modal, 'wb:modal:open');
  }

  // ── Close ─────────────────────────────────────────────────

  function close(modal) {
    if (!modal) modal = activeModal;
    if (!modal) return;

    modal.classList.remove('is-open');
    document.body.classList.remove('wb-modal-open');

    if (activeModal === modal) activeModal = null;

    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus();
      previouslyFocused = null;
    }

    WBDom.emit(modal, 'wb:modal:close');
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    // Trigger
    var trigger = e.target.closest('[data-wb-toggle="modal"]');
    if (trigger) {
      e.preventDefault();
      var target = trigger.getAttribute('data-wb-target');
      var modal  = target ? document.querySelector(target) : null;
      if (modal) open(modal);
      return;
    }

    // Dismiss button
    var dismiss = e.target.closest('[data-wb-dismiss="modal"]');
    if (dismiss) {
      close(activeModal);
      return;
    }

    // Backdrop click — close if click is directly on .wb-modal (backdrop layer)
    if (activeModal && e.target === activeModal) {
      close(activeModal);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && activeModal) close(activeModal);
    if (activeModal) WBDom.trapFocus(e, activeModal);
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBModal = {
    open:      open,
    close:     close,
    getActive: function () { return activeModal; }
  };

})();
/* ============================================================
   WebBlocks UI — Tabs (tabs.js)

   Usage:
     <div class="wb-tabs" data-wb-tabs>
       <div class="wb-tabs-nav" role="tablist">
         <button class="wb-tabs-btn is-active" data-wb-tab="panel1" role="tab"
                 aria-selected="true" aria-controls="panel1">Tab 1</button>
         <button class="wb-tabs-btn" data-wb-tab="panel2" role="tab"
                 aria-selected="false" aria-controls="panel2">Tab 2</button>
       </div>
       <div class="wb-tabs-panels">
         <div class="wb-tabs-panel is-active" id="panel1" role="tabpanel">Content 1</div>
         <div class="wb-tabs-panel" id="panel2" role="tabpanel">Content 2</div>
       </div>
     </div>
   ============================================================ */

(function () {
  'use strict';

  function activate(container, targetId) {
    // Deactivate all tabs + panels in this container
    container.querySelectorAll('.wb-tabs-btn').forEach(function (btn) {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('tabindex', '-1');
    });
    container.querySelectorAll('.wb-tabs-panel').forEach(function (panel) {
      panel.classList.remove('is-active');
    });

    // Activate target
    var targetBtn = container.querySelector('[data-wb-tab="' + targetId + '"]');
    var targetPanel = container.querySelector('#' + targetId);

    if (targetBtn) {
      targetBtn.classList.add('is-active');
      targetBtn.setAttribute('aria-selected', 'true');
      targetBtn.removeAttribute('tabindex');
    }
    if (targetPanel) {
      targetPanel.classList.add('is-active');
    }

    // Emit event
    WBDom.emit(container, 'wb:tabs:change', { tabId: targetId });
  }

  // ── Keyboard navigation ────────────────────────────────────

  function handleKeydown(e, container) {
    var btns = Array.from(container.querySelectorAll('.wb-tabs-btn'));
    var idx  = btns.indexOf(document.activeElement);
    if (idx === -1) return;

    var next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next = btns[(idx + 1) % btns.length];
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      next = btns[(idx - 1 + btns.length) % btns.length];
    } else if (e.key === 'Home') {
      next = btns[0];
    } else if (e.key === 'End') {
      next = btns[btns.length - 1];
    }

    if (next) {
      e.preventDefault();
      next.focus();
      activate(container, next.getAttribute('data-wb-tab'));
    }
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.wb-tabs-btn[data-wb-tab]');
    if (!btn) return;
    var container = btn.closest('[data-wb-tabs]');
    if (!container) return;
    e.preventDefault();
    activate(container, btn.getAttribute('data-wb-tab'));
  });

  document.addEventListener('keydown', function (e) {
    var btn = e.target.closest('.wb-tabs-btn');
    if (!btn) return;
    var container = btn.closest('[data-wb-tabs]');
    if (!container) return;
    handleKeydown(e, container);
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBTabs = {
    activate: function (containerEl, tabId) {
      activate(containerEl, tabId);
    },
    activateById: function (tabId) {
      var btn = document.querySelector('[data-wb-tab="' + tabId + '"]');
      if (!btn) return;
      var container = btn.closest('[data-wb-tabs]');
      if (container) activate(container, tabId);
    }
  };

})();
/* ============================================================
   WebBlocks UI — Accordion (accordion.js)

   Usage:
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

   Options (on [data-wb-accordion]):
     data-wb-accordion-single="true"  — only one panel open at a time
   ============================================================ */

(function () {
  'use strict';

  function getItem(trigger) {
    return trigger.closest('.wb-accordion-item');
  }

  function getContent(trigger) {
    var id = trigger.getAttribute('aria-controls');
    return id ? document.getElementById(id) : getItem(trigger).querySelector('.wb-accordion-content');
  }

  function isOpen(trigger) {
    return trigger.getAttribute('aria-expanded') === 'true';
  }

  // ── Open a single trigger ─────────────────────────────────

  function open(trigger) {
    var content = getContent(trigger);
    trigger.setAttribute('aria-expanded', 'true');
    trigger.classList.add('is-open');
    if (content) {
      content.classList.add('is-open');
      // Animate height
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  }

  // ── Close a single trigger ────────────────────────────────

  function close(trigger) {
    var content = getContent(trigger);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.classList.remove('is-open');
    if (content) {
      content.classList.remove('is-open');
      content.style.maxHeight = '0';
    }
  }

  // ── Toggle ────────────────────────────────────────────────

  function toggle(trigger) {
    var accordion = trigger.closest('[data-wb-accordion]');
    var single = accordion && accordion.getAttribute('data-wb-accordion-single') === 'true';

    if (isOpen(trigger)) {
      close(trigger);
    } else {
      // In single mode, close all siblings first
      if (single && accordion) {
        accordion.querySelectorAll('[data-wb-accordion-trigger]').forEach(function (t) {
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
    document.querySelectorAll('[data-wb-accordion-trigger][aria-expanded="true"]').forEach(function (trigger) {
      var content = getContent(trigger);
      if (content) content.style.maxHeight = content.scrollHeight + 'px';
    });
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-wb-accordion-trigger]');
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
/* ============================================================
   WebBlocks UI — Sidebar (sidebar.js)

   Usage (toggle button — typically in .wb-navbar):
     <button data-wb-toggle="sidebar" data-wb-target="#appSidebar"
             aria-expanded="false" aria-controls="appSidebar">
       ☰
     </button>

     <div class="wb-sidebar-backdrop" id="appBackdrop" data-wb-sidebar-backdrop></div>
     <aside class="wb-sidebar" id="appSidebar"> ... </aside>

   The sidebar is controlled purely via the "is-open" class.
   On desktop (>768px) the sidebar is always visible via CSS —
   JS open/close only affects mobile.
   ============================================================ */

(function () {
  'use strict';

  function getSidebar(trigger) {
    var id = trigger.getAttribute('data-wb-target');
    return id ? document.querySelector(id) : document.querySelector('.wb-sidebar');
  }

  function getBackdrop(sidebar) {
    // Look for a sibling/nearby backdrop element
    var parent = sidebar.parentElement;
    return parent ? parent.querySelector('[data-wb-sidebar-backdrop]') : null;
  }

  function isOpen(sidebar) {
    return sidebar.classList.contains('is-open');
  }

  function open(sidebar) {
    sidebar.classList.add('is-open');
    var backdrop = getBackdrop(sidebar);
    if (backdrop) backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // prevent scroll behind overlay

    // Sync trigger button aria
    syncTriggers(sidebar, true);
    WBDom.emit(sidebar, 'wb:sidebar:open');
  }

  function close(sidebar) {
    sidebar.classList.remove('is-open');
    var backdrop = getBackdrop(sidebar);
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.style.overflow = '';

    syncTriggers(sidebar, false);
    WBDom.emit(sidebar, 'wb:sidebar:close');
  }

  function toggle(sidebar) {
    if (isOpen(sidebar)) {
      close(sidebar);
    } else {
      open(sidebar);
    }
  }

  function syncTriggers(sidebar, expanded) {
    var id = sidebar.id;
    if (!id) return;
    document.querySelectorAll('[data-wb-target="#' + id + '"]').forEach(function (btn) {
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      btn.classList.toggle('is-open', expanded);
    });
  }

  // ── Close sidebar on desktop resize ───────────────────────

  window.addEventListener('resize', WBDom.debounce(function () {
    if (window.innerWidth > 768) {
      document.querySelectorAll('.wb-sidebar.is-open').forEach(function (sidebar) {
        sidebar.classList.remove('is-open');
        var backdrop = getBackdrop(sidebar);
        if (backdrop) backdrop.classList.remove('is-open');
        document.body.style.overflow = '';
        syncTriggers(sidebar, false);
      });
    }
  }, 100));

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    // Toggle button
    var trigger = e.target.closest('[data-wb-toggle="sidebar"]');
    if (trigger) {
      var sidebar = getSidebar(trigger);
      if (sidebar) toggle(sidebar);
      return;
    }

    // Backdrop click — close
    var backdrop = e.target.closest('[data-wb-sidebar-backdrop]');
    if (backdrop) {
      var openSidebar = document.querySelector('.wb-sidebar.is-open');
      if (openSidebar) close(openSidebar);
      return;
    }

    // Nav link click on mobile — close sidebar
    if (window.innerWidth <= 768) {
      var link = e.target.closest('.wb-sidebar-link[href]');
      if (link) {
        var openSb = document.querySelector('.wb-sidebar.is-open');
        if (openSb) close(openSb);
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var openSidebar = document.querySelector('.wb-sidebar.is-open');
      if (openSidebar && window.innerWidth <= 768) close(openSidebar);
    }
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBSidebar = {
    open:   open,
    close:  close,
    toggle: toggle,
    isOpen: isOpen
  };

})();
/* ============================================================
   WebBlocks UI — Nav Group (nav-group.js)
   Collapsible navigation groups for sidebars and menus.

   Usage:
     <div class="wb-nav-group" data-wb-nav-group>
       <button class="wb-nav-group-toggle">
         <span class="wb-nav-group-icon">...</span>
         <span class="wb-nav-group-label">Settings</span>
         <span class="wb-nav-group-arrow"></span>
       </button>
       <div class="wb-nav-group-items">
         <a class="wb-nav-group-item" href="#">Profile</a>
         <a class="wb-nav-group-item" href="#">Security</a>
       </div>
     </div>

   Options (data attributes on .wb-nav-group):
     data-wb-nav-group-open  — open by default
     data-wb-nav-group-accordion — close siblings when opening
   ============================================================ */

(function () {
  'use strict';

  // ── Toggle a single group ─────────────────────────────────

  function toggle(group) {
    var isOpen = group.classList.contains('is-open');

    // Accordion: close siblings in the same parent
    if (group.dataset.wbNavGroupAccordion !== undefined || group.closest('[data-wb-accordion]')) {
      var parent = group.parentElement;
      if (parent) {
        var siblings = Array.from(parent.querySelectorAll(':scope > [data-wb-nav-group]'));
        siblings.forEach(function (sibling) {
          if (sibling !== group) closeGroup(sibling);
        });
      }
    }

    if (isOpen) {
      closeGroup(group);
    } else {
      openGroup(group);
    }
  }

  function openGroup(group) {
    group.classList.add('is-open');
    var toggle = group.querySelector('.wb-nav-group-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    WBDom.emit(group, 'wb:navgroup:open');
  }

  function closeGroup(group) {
    group.classList.remove('is-open');
    var toggle = group.querySelector('.wb-nav-group-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    WBDom.emit(group, 'wb:navgroup:close');
  }

  // ── Auto-open groups with active children ─────────────────

  function autoOpenActive() {
    var groups = document.querySelectorAll('[data-wb-nav-group]');
    groups.forEach(function (group) {
      // Open if explicitly set
      if (group.dataset.wbNavGroupOpen !== undefined) {
        openGroup(group);
        return;
      }
      // Open if a child is active
      var items = group.querySelector('.wb-nav-group-items');
      if (items && items.querySelector('.is-active')) {
        openGroup(group);
      }
    });
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    var toggleBtn = e.target.closest('.wb-nav-group-toggle');
    if (!toggleBtn) return;

    var group = toggleBtn.closest('[data-wb-nav-group]');
    if (!group) return;

    e.preventDefault();
    toggle(group);
  });

  // ── Init on DOM ready ─────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoOpenActive);
  } else {
    autoOpenActive();
  }

  // ── Public API ─────────────────────────────────────────────

  window.WBNavGroup = {
    open:   openGroup,
    close:  closeGroup,
    toggle: toggle,
    init:   autoOpenActive
  };

})();
/* ============================================================
   WebBlocks UI — Drawer (drawer.js)

   Usage:
     <!-- Trigger -->
     <button data-wb-toggle="drawer" data-wb-target="#myDrawer">Open</button>

     <!-- Drawer -->
     <div class="wb-drawer" id="myDrawer" role="dialog" aria-modal="true" aria-labelledby="myDrawerTitle">
       <div class="wb-drawer-header">
         <h5 class="wb-drawer-title" id="myDrawerTitle">Title</h5>
         <button class="wb-drawer-close" data-wb-dismiss="drawer" aria-label="Close">&times;</button>
       </div>
       <div class="wb-drawer-body">Content</div>
       <div class="wb-drawer-footer">
         <button class="wb-btn wb-btn-secondary" data-wb-dismiss="drawer">Cancel</button>
         <button class="wb-btn wb-btn-primary">Save</button>
       </div>
     </div>

     <!-- Backdrop (optional, add before </body>) -->
     <div class="wb-drawer-backdrop" data-wb-dismiss="drawer"></div>
   ============================================================ */

(function () {
  'use strict';

  var activeDrawer      = null;
  var previouslyFocused = null;

  // ── Backdrop helper ───────────────────────────────────────

  function getBackdrop() {
    return document.querySelector('.wb-drawer-backdrop');
  }

  // ── Open ──────────────────────────────────────────────────

  function open(drawer) {
    if (!drawer) return;
    if (activeDrawer) close(activeDrawer);

    previouslyFocused = document.activeElement;
    activeDrawer = drawer;

    drawer.classList.add('is-open');
    document.body.classList.add('wb-drawer-open');

    var backdrop = getBackdrop();
    if (backdrop) backdrop.classList.add('is-open');

    WBDom.focusFirst(drawer);
    WBDom.emit(drawer, 'wb:drawer:open');
  }

  // ── Close ─────────────────────────────────────────────────

  function close(drawer) {
    if (!drawer) drawer = activeDrawer;
    if (!drawer) return;

    drawer.classList.remove('is-open');
    document.body.classList.remove('wb-drawer-open');

    var backdrop = getBackdrop();
    if (backdrop) backdrop.classList.remove('is-open');

    if (activeDrawer === drawer) activeDrawer = null;

    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus();
      previouslyFocused = null;
    }

    WBDom.emit(drawer, 'wb:drawer:close');
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    // Trigger
    var trigger = e.target.closest('[data-wb-toggle="drawer"]');
    if (trigger) {
      e.preventDefault();
      var target = trigger.getAttribute('data-wb-target');
      var drawer = target ? document.querySelector(target) : null;
      if (drawer) open(drawer);
      return;
    }

    // Dismiss
    var dismiss = e.target.closest('[data-wb-dismiss="drawer"]');
    if (dismiss) {
      close(activeDrawer);
      return;
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && activeDrawer) close(activeDrawer);
    if (activeDrawer) WBDom.trapFocus(e, activeDrawer);
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBDrawer = {
    open:      open,
    close:     close,
    getActive: function () { return activeDrawer; }
  };

})();
/* ============================================================
   WebBlocks UI — Command Palette (command-palette.js)

   Usage:
     <!-- Trigger (keyboard shortcut handled automatically) -->
     <button data-wb-toggle="cmd" data-wb-target="#myCmdPalette">
       Search
     </button>

     <!-- Palette markup -->
     <div class="wb-cmd-backdrop" id="myCmdPalette" role="dialog"
          aria-modal="true" aria-label="Command palette">
       <div class="wb-cmd-dialog">
         <div class="wb-cmd-search">
           <span class="wb-cmd-search-icon">⌕</span>
           <input class="wb-cmd-input" type="text"
                  placeholder="Search commands..." autocomplete="off" />
         </div>
         <div class="wb-cmd-results">
           <!-- Groups populated by search or static HTML -->
         </div>
         <div class="wb-cmd-footer">
           <span class="wb-cmd-footer-hint">
             <kbd class="wb-cmd-kbd">↑↓</kbd> navigate
           </span>
           <span class="wb-cmd-footer-hint">
             <kbd class="wb-cmd-kbd">↵</kbd> select
           </span>
           <span class="wb-cmd-footer-hint">
             <kbd class="wb-cmd-kbd">Esc</kbd> close
           </span>
         </div>
       </div>
     </div>

   Default keyboard shortcut: Cmd/Ctrl + K
   Override: add data-wb-cmd-shortcut="k" (letter only) to the backdrop element.

   Items can be static HTML .wb-cmd-item elements, or provided via a
   custom search function assigned to WBCommandPalette.onSearch(query, callback).
   ============================================================ */

(function () {
  'use strict';

  var activePalette     = null;
  var previouslyFocused = null;
  var selectedIndex     = -1;
  var items             = [];

  // ── External search handler ────────────────────────────── 
  // Assign: WBCommandPalette.onSearch = function(query, callback) { ... }
  var searchHandler = null;

  // ── Helpers ───────────────────────────────────────────────

  function getItems(palette) {
    return Array.from(palette.querySelectorAll('.wb-cmd-item'));
  }

  function clearSelection() {
    items.forEach(function (item) { item.classList.remove('is-selected'); });
    selectedIndex = -1;
  }

  function selectItem(index) {
    if (!items.length) return;
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;

    clearSelection();
    selectedIndex = index;
    items[selectedIndex].classList.add('is-selected');
    items[selectedIndex].scrollIntoView({ block: 'nearest' });
  }

  function activateSelected() {
    if (selectedIndex < 0 || !items[selectedIndex]) return;
    items[selectedIndex].click();
  }

  // ── Open ──────────────────────────────────────────────────

  function open(palette) {
    if (!palette) return;
    if (activePalette) close(activePalette);

    previouslyFocused = document.activeElement;
    activePalette = palette;

    palette.classList.add('is-open');
    document.body.classList.add('wb-cmd-open');

    // Focus the input
    requestAnimationFrame(function () {
      var input = palette.querySelector('.wb-cmd-input');
      if (input) {
        input.value = '';
        input.focus();
        handleInput(input);
      }
      items = getItems(palette);
      selectedIndex = -1;
    });

    palette.dispatchEvent(new CustomEvent('wb:cmd:open', { bubbles: true }));
  }

  // ── Close ─────────────────────────────────────────────────

  function close(palette) {
    if (!palette) palette = activePalette;
    if (!palette) return;

    palette.classList.remove('is-open');
    document.body.classList.remove('wb-cmd-open');

    if (activePalette === palette) activePalette = null;

    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus();
      previouslyFocused = null;
    }

    palette.dispatchEvent(new CustomEvent('wb:cmd:close', { bubbles: true }));
  }

  // ── Input / search ─────────────────────────────────────── 

  function handleInput(input) {
    var palette = input.closest('.wb-cmd-backdrop');
    if (!palette) return;

    var query = input.value.trim().toLowerCase();

    // If custom search handler is set, delegate
    if (typeof searchHandler === 'function') {
      searchHandler(query, function (html) {
        var results = palette.querySelector('.wb-cmd-results');
        if (results) {
          results.innerHTML = html;
          items = getItems(palette);
          selectedIndex = -1;
        }
      });
      return;
    }

    // Built-in: filter visible items by text match
    items = getItems(palette);
    var anyVisible = false;

    items.forEach(function (item) {
      var text = (item.textContent || '').toLowerCase();
      var match = !query || text.includes(query);
      item.style.display = match ? '' : 'none';
      if (match) anyVisible = true;
    });

    // Show/hide empty state
    var emptyEl = palette.querySelector('.wb-cmd-empty');
    if (emptyEl) emptyEl.style.display = anyVisible ? 'none' : '';

    // Hide groups with no visible items
    var groups = palette.querySelectorAll('.wb-cmd-group');
    groups.forEach(function (group) {
      var visibleItems = Array.from(group.querySelectorAll('.wb-cmd-item'))
        .filter(function (i) { return i.style.display !== 'none'; });
      group.style.display = visibleItems.length ? '' : 'none';
    });

    // Reset selection
    items = items.filter(function (i) { return i.style.display !== 'none'; });
    selectedIndex = -1;

    palette.dispatchEvent(new CustomEvent('wb:cmd:search', {
      bubbles: true,
      detail: { query: query }
    }));
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    // Toggle trigger
    var trigger = e.target.closest('[data-wb-toggle="cmd"]');
    if (trigger) {
      e.preventDefault();
      var target = trigger.getAttribute('data-wb-target');
      var palette = target ? document.querySelector(target) : null;
      if (palette) open(palette);
      return;
    }

    // Backdrop click to close
    var backdrop = e.target.closest('.wb-cmd-backdrop');
    if (backdrop && e.target === backdrop) {
      close(backdrop);
      return;
    }

    // Item click — close after selection
    var item = e.target.closest('.wb-cmd-item');
    if (item && activePalette) {
      // Allow item click to propagate first, then close
      setTimeout(function () { close(activePalette); }, 80);
    }
  });

  document.addEventListener('keydown', function (e) {
    // Global shortcut: Cmd/Ctrl + K (or custom)
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (activePalette) {
        close(activePalette);
      } else {
        // Find first palette with data-wb-cmd-default
        var palette = document.querySelector('[data-wb-cmd-default]') ||
                      document.querySelector('.wb-cmd-backdrop');
        if (palette) open(palette);
      }
      return;
    }

    if (!activePalette) return;

    switch (e.key) {
      case 'Escape':
        close(activePalette);
        break;
      case 'ArrowDown':
        e.preventDefault();
        selectItem(selectedIndex + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        selectItem(selectedIndex - 1);
        break;
      case 'Enter':
        e.preventDefault();
        activateSelected();
        break;
    }
  });

  document.addEventListener('input', function (e) {
    var input = e.target;
    if (!input.classList.contains('wb-cmd-input')) return;
    handleInput(input);
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBCommandPalette = {
    open:      open,
    close:     close,
    getActive: function () { return activePalette; },
    onSearch:  function (fn) { searchHandler = fn; }
  };

})();
/* ============================================================
   WebBlocks UI — Toast (toast.js)

   Usage (programmatic):
     WBToast.show('Saved successfully', { type: 'success' });
     WBToast.show('Something went wrong', { type: 'danger', duration: 6000 });
     WBToast.show('Upload complete', {
       type: 'success',
       title: 'Done',
       position: 'top-right',
       duration: 4000
     });
     WBToast.show('Manual', { duration: 0 }); // no auto-dismiss

   Usage (HTML declarative — dismiss button):
     <div class="wb-toast wb-toast-success" id="myToast">
       <div class="wb-toast-body">Message</div>
       <button class="wb-toast-close" data-wb-dismiss="toast">&times;</button>
     </div>

   Options:
     message   {string}  Toast text (required)
     title     {string}  Optional bold title above message
     type      {string}  success | warning | danger | info (default: none)
     position  {string}  top-right | top-center | top-left |
                         bottom-right (default) | bottom-center | bottom-left
     duration  {number}  ms before auto-dismiss (default: 4000, 0 = no auto-dismiss)
     closable  {boolean} show close button (default: true)
   ============================================================ */

(function () {
  'use strict';

  // ── Container cache ───────────────────────────────────────
  var containers = {};

  var POSITIONS = [
    'top-right', 'top-center', 'top-left',
    'bottom-right', 'bottom-center', 'bottom-left'
  ];

  function getContainer(position) {
    position = position || 'bottom-right';
    if (containers[position]) return containers[position];

    var el = document.createElement('div');
    el.className = 'wb-toast-container';
    if (position !== 'bottom-right') {
      el.classList.add('wb-toast-container-' + position);
    }
    document.body.appendChild(el);
    containers[position] = el;
    return el;
  }

  // ── Dismiss a toast element ───────────────────────────────

  function dismiss(toast) {
    if (!toast || toast.classList.contains('is-leaving')) return;
    toast.classList.add('is-leaving');

    var done = false;
    function remove() {
      if (done) return;
      done = true;
      if (toast.parentNode) toast.parentNode.removeChild(toast);
      WBDom.emit(toast, 'wb:toast:close');
    }

    toast.addEventListener('animationend', remove, { once: true });
    setTimeout(remove, 300); // fallback
  }

  // ── Icon SVG per type ─────────────────────────────────────

  var ICONS = {
    success: '<svg class="wb-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--wb-success)"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    warning: '<svg class="wb-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--wb-warning)"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    danger:  '<svg class="wb-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--wb-danger)"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info:    '<svg class="wb-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--wb-info)"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  // ── Show ──────────────────────────────────────────────────

  function show(message, opts) {
    opts = opts || {};

    var type      = opts.type     || null;
    var title     = opts.title    || null;
    var position  = POSITIONS.indexOf(opts.position) !== -1 ? opts.position : 'bottom-right';
    var duration  = opts.duration !== undefined ? opts.duration : 4000;
    var closable  = opts.closable !== false;

    var toast = document.createElement('div');
    toast.className = 'wb-toast' + (type ? ' wb-toast-' + type : '');

    var html = '';

    // Icon
    if (type && ICONS[type]) {
      html += ICONS[type];
    }

    // Body
    html += '<div class="wb-toast-body">';
    if (title) {
      html += '<span class="wb-toast-title">' + _escape(title) + '</span>';
    }
    html += _escape(message);
    html += '</div>';

    // Close button
    if (closable) {
      html += '<button class="wb-toast-close" data-wb-dismiss="toast" aria-label="Close">&times;</button>';
    }

    toast.innerHTML = html;

    var container = getContainer(position);
    container.appendChild(toast);

    WBDom.emit(toast, 'wb:toast:open');

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(function () { dismiss(toast); }, duration);
    }

    return toast;
  }

  // ── HTML escape helper ────────────────────────────────────

  function _escape(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Event delegation — dismiss button ────────────────────

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-wb-dismiss="toast"]');
    if (!btn) return;
    var toast = btn.closest('.wb-toast');
    if (toast) dismiss(toast);
  });

  // ── Public API ────────────────────────────────────────────

  window.WBToast = {
    show:    show,
    dismiss: dismiss
  };

})();
/* ============================================================
   WebBlocks UI — Popover (popover.js)

   Usage (HTML):
     <div class="wb-popover" data-wb-popover>
       <button class="wb-btn wb-btn-secondary" data-wb-toggle="popover">
         Info
       </button>
       <div class="wb-popover-panel">
         <div class="wb-popover-body">Content here</div>
       </div>
     </div>

   Placement modifiers (on .wb-popover wrapper):
     wb-popover-top | wb-popover-right | wb-popover-left | wb-popover-end

   Dismiss:
     <button data-wb-dismiss="popover">Close</button>

   JS API:
     WBPopover.open(wrapperEl)
     WBPopover.close(wrapperEl)
     WBPopover.closeAll()
   ============================================================ */

(function () {
  'use strict';

  var active = null;

  // ── Open ──────────────────────────────────────────────────

  function open(wrapper) {
    if (!wrapper) return;
    if (active && active !== wrapper) close(active);

    wrapper.classList.add('is-open');
    active = wrapper;
    WBDom.emit(wrapper, 'wb:popover:open');
  }

  // ── Close ─────────────────────────────────────────────────

  function close(wrapper) {
    if (!wrapper) wrapper = active;
    if (!wrapper) return;

    wrapper.classList.remove('is-open');
    if (active === wrapper) active = null;
    WBDom.emit(wrapper, 'wb:popover:close');
  }

  function closeAll() {
    document.querySelectorAll('.wb-popover.is-open').forEach(function (el) {
      close(el);
    });
    active = null;
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    // Toggle trigger
    var trigger = e.target.closest('[data-wb-toggle="popover"]');
    if (trigger) {
      e.stopPropagation();
      var wrapper = trigger.closest('[data-wb-popover]') || trigger.closest('.wb-popover');
      if (!wrapper) return;
      if (wrapper.classList.contains('is-open')) {
        close(wrapper);
      } else {
        open(wrapper);
      }
      return;
    }

    // Dismiss button inside popover
    var dismiss = e.target.closest('[data-wb-dismiss="popover"]');
    if (dismiss) {
      var wrapper = dismiss.closest('.wb-popover');
      if (wrapper) close(wrapper);
      return;
    }

    // Click outside — close active popover
    if (active && !active.contains(e.target)) {
      close(active);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && active) close(active);
  });

  // ── Public API ────────────────────────────────────────────

  window.WBPopover = {
    open:     open,
    close:    close,
    closeAll: closeAll
  };

})();
/* ============================================================
   WebBlocks UI — Tooltip (tooltip.js)

   The tooltip appearance is handled entirely by CSS via the
   [data-wb-tooltip] attribute. This JS module adds:

   1. Programmatic show/hide API.
   2. Support for tooltips on disabled elements (which don't
      receive :hover). Wrap the disabled element in a
      <span data-wb-tooltip="..."> to work around this.
   3. data-wb-tooltip-delay — show delay in ms (default: 0).

   Usage (HTML — pure CSS, no JS needed):
     <button data-wb-tooltip="Save changes">Save</button>

   Usage (programmatic):
     WBTooltip.show(el);     // force show
     WBTooltip.hide(el);     // force hide
     WBTooltip.hideAll();    // hide all forced tooltips

   Forced show/hide works by toggling .wb-tooltip-force-show
   and .wb-tooltip-force-hide classes. Pair these with CSS
   rules if custom programmatic behavior is needed.
   ============================================================ */

(function () {
  'use strict';

  // ── Delay support ─────────────────────────────────────────
  // Reads data-wb-tooltip-delay from element.
  // Default: 0ms. Hover intent: add a small delay like 300.

  var timers = new WeakMap ? new WeakMap() : null;

  function getDelay(el) {
    var d = parseInt(el.getAttribute('data-wb-tooltip-delay'), 10);
    return isNaN(d) ? 0 : d;
  }

  // ── Programmatic show/hide ────────────────────────────────

  function show(el) {
    if (!el) return;
    el.classList.remove('wb-tooltip-force-hide');
    el.classList.add('wb-tooltip-force-show');
    WBDom.emit(el, 'wb:tooltip:show');
  }

  function hide(el) {
    if (!el) return;
    el.classList.remove('wb-tooltip-force-show');
    el.classList.add('wb-tooltip-force-hide');
    WBDom.emit(el, 'wb:tooltip:hide');
  }

  function hideAll() {
    document.querySelectorAll('.wb-tooltip-force-show').forEach(function (el) {
      hide(el);
    });
  }

  // ── Delayed hover (optional enhancement) ─────────────────
  // Only activates on elements with data-wb-tooltip-delay set.

  document.addEventListener('mouseover', function (e) {
    var el = e.target.closest('[data-wb-tooltip][data-wb-tooltip-delay]');
    if (!el || !timers) return;

    var delay = getDelay(el);
    if (delay <= 0) return;

    // Clear any pending hide timer
    clearTimeout(timers.get(el));

    // Schedule show
    timers.set(el, setTimeout(function () {
      show(el);
    }, delay));
  });

  document.addEventListener('mouseout', function (e) {
    var el = e.target.closest('[data-wb-tooltip][data-wb-tooltip-delay]');
    if (!el || !timers) return;

    clearTimeout(timers.get(el));

    // Reset forced state when mouse leaves — let CSS take over
    el.classList.remove('wb-tooltip-force-show', 'wb-tooltip-force-hide');
  });

  // ── Public API ────────────────────────────────────────────

  window.WBTooltip = {
    show:    show,
    hide:    hide,
    hideAll: hideAll
  };

})();
/* ============================================================
   WebBlocks UI — Dismiss (dismiss.js)

   Centralised handler for dismissible components that use
   data-wb-dismiss. Currently handles:

     alert     — removes .wb-alert from DOM (with animation)
     toast     — handled by toast.js; included here for completeness
     banner    — generic dismissible banner (.wb-banner)

   Usage:
     <div class="wb-alert wb-alert-info wb-alert-dismiss" id="myAlert">
       <span class="wb-alert-title">Heads up!</span>
       This is a dismissible alert.
       <button class="wb-alert-close" data-wb-dismiss="alert" aria-label="Close">&times;</button>
     </div>

   JS API:
     WBDismiss.dismiss(element)   // dismiss a .wb-alert / .wb-banner by element or selector
   ============================================================ */

(function () {
  'use strict';

  // ── Dismiss a single element ──────────────────────────────

  function dismiss(el) {
    if (!el || el.classList.contains('is-leaving')) return;

    el.classList.add('is-leaving');
    WBDom.emit(el, 'wb:dismiss');

    var done = false;
    function remove() {
      if (done) return;
      done = true;
      if (el.parentNode) el.parentNode.removeChild(el);
      WBDom.emit(document, 'wb:dismissed', { element: el });
    }

    el.addEventListener('transitionend', remove, { once: true });
    setTimeout(remove, 400); // fallback
  }

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-wb-dismiss="alert"]');
    if (btn) {
      var alert = btn.closest('.wb-alert');
      if (alert) dismiss(alert);
      return;
    }

    var bannerBtn = e.target.closest('[data-wb-dismiss="banner"]');
    if (bannerBtn) {
      var banner = bannerBtn.closest('.wb-banner');
      if (banner) dismiss(banner);
    }
  });

  // ── Public API ────────────────────────────────────────────

  window.WBDismiss = {
    dismiss: dismiss
  };

})();
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
/* ============================================================
   WebBlocks UI — Collapse (WBCollapse)
   Toggles .is-open on .wb-collapse elements.

   Triggers:
     data-wb-collapse="target-id"   — toggles a standalone collapse
     .wb-collapse-panel > .wb-collapse-trigger — toggles panel

   Public API:
     WBCollapse.open(id)
     WBCollapse.close(id)
     WBCollapse.toggle(id)
   ============================================================ */
(function () {
  'use strict';

  /* ── Panel trigger (button inside .wb-collapse-panel) ──── */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.wb-collapse-trigger');
    if (trigger) {
      var panel = trigger.closest('.wb-collapse-panel');
      if (panel) {
        panel.classList.toggle('is-open');
        var expanded = panel.classList.contains('is-open');
        trigger.setAttribute('aria-expanded', expanded);
      }
      return;
    }

    /* ── Standalone toggle: data-wb-collapse="id" ───────── */
    var btn = e.target.closest('[data-wb-collapse]');
    if (btn) {
      var targetId = btn.getAttribute('data-wb-collapse');
      var el = document.getElementById(targetId);
      if (el) {
        el.classList.toggle('is-open');
        var isOpen = el.classList.contains('is-open');
        btn.setAttribute('aria-expanded', isOpen);
      }
    }
  });

  /* ── Public API ─────────────────────────────────────────── */
  window.WBCollapse = {
    open: function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.classList.add('is-open');
        var btn = document.querySelector('[data-wb-collapse="' + id + '"]');
        if (btn) btn.setAttribute('aria-expanded', 'true');
      }
    },
    close: function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.classList.remove('is-open');
        var btn = document.querySelector('[data-wb-collapse="' + id + '"]');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    },
    toggle: function (id) {
      var el = document.getElementById(id);
      if (el) {
        if (el.classList.contains('is-open')) {
          window.WBCollapse.close(id);
        } else {
          window.WBCollapse.open(id);
        }
      }
    }
  };
})();
