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
  function ls(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      if (val === null) { localStorage.removeItem(key); return; }
      localStorage.setItem(key, val);
    } catch (e) {}
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

  var activeModal = null;
  var previouslyFocused = null;

  // Focusable elements for focus trap
  var FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  // ── Open ──────────────────────────────────────────────────

  function open(modal) {
    if (!modal) return;
    if (activeModal) close(activeModal);

    previouslyFocused = document.activeElement;
    activeModal = modal;

    modal.classList.add('is-open');
    document.body.classList.add('wb-modal-open');

    // Focus first focusable element inside modal
    requestAnimationFrame(function () {
      var first = modal.querySelector(FOCUSABLE);
      if (first) first.focus();
    });

    // Emit custom event
    modal.dispatchEvent(new CustomEvent('wb:modal:open', { bubbles: true }));
  }

  // ── Close ─────────────────────────────────────────────────

  function close(modal) {
    if (!modal) modal = activeModal;
    if (!modal) return;

    modal.classList.remove('is-open');
    document.body.classList.remove('wb-modal-open');

    if (activeModal === modal) activeModal = null;

    // Restore focus
    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus();
      previouslyFocused = null;
    }

    modal.dispatchEvent(new CustomEvent('wb:modal:close', { bubbles: true }));
  }

  // ── Focus trap ────────────────────────────────────────────

  function trapFocus(e) {
    if (!activeModal) return;
    if (e.key !== 'Tab') return;

    var focusable = Array.from(activeModal.querySelectorAll(FOCUSABLE));
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

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', function (e) {
    // Trigger
    var trigger = e.target.closest('[data-wb-toggle="modal"]');
    if (trigger) {
      e.preventDefault();
      var target = trigger.getAttribute('data-wb-target');
      var modal = target ? document.querySelector(target) : null;
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
    trapFocus(e);
  });

  // ── Public API ─────────────────────────────────────────────

  window.WBModal = {
    open:  open,
    close: close,
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
    container.dispatchEvent(new CustomEvent('wb:tabs:change', {
      bubbles: true,
      detail: { tabId: targetId }
    }));
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
    trigger.dispatchEvent(new CustomEvent('wb:accordion:toggle', {
      bubbles: true,
      detail: { open: isOpen(trigger) }
    }));
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

  window.addEventListener('resize', function () {
    // Debounce
    clearTimeout(window._wbAccordionResizeTimer);
    window._wbAccordionResizeTimer = setTimeout(recalc, 150);
  });

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
    sidebar.dispatchEvent(new CustomEvent('wb:sidebar:open', { bubbles: true }));
  }

  function close(sidebar) {
    sidebar.classList.remove('is-open');
    var backdrop = getBackdrop(sidebar);
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.style.overflow = '';

    syncTriggers(sidebar, false);
    sidebar.dispatchEvent(new CustomEvent('wb:sidebar:close', { bubbles: true }));
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

  window.addEventListener('resize', function () {
    clearTimeout(window._wbSidebarResizeTimer);
    window._wbSidebarResizeTimer = setTimeout(function () {
      if (window.innerWidth > 768) {
        document.querySelectorAll('.wb-sidebar.is-open').forEach(function (sidebar) {
          // Remove open state but don't trigger close animations —
          // CSS will show sidebar on desktop anyway
          sidebar.classList.remove('is-open');
          var backdrop = getBackdrop(sidebar);
          if (backdrop) backdrop.classList.remove('is-open');
          document.body.style.overflow = '';
          syncTriggers(sidebar, false);
        });
      }
    }, 100);
  });

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
    group.dispatchEvent(new CustomEvent('wb:navgroup:open', { bubbles: true }));
  }

  function closeGroup(group) {
    group.classList.remove('is-open');
    var toggle = group.querySelector('.wb-nav-group-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    group.dispatchEvent(new CustomEvent('wb:navgroup:close', { bubbles: true }));
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

  var activeDrawer    = null;
  var previouslyFocused = null;

  var FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

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

    // Focus first focusable element
    requestAnimationFrame(function () {
      var first = drawer.querySelector(FOCUSABLE);
      if (first) first.focus();
    });

    drawer.dispatchEvent(new CustomEvent('wb:drawer:open', { bubbles: true }));
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

    drawer.dispatchEvent(new CustomEvent('wb:drawer:close', { bubbles: true }));
  }

  // ── Focus trap ────────────────────────────────────────────

  function trapFocus(e) {
    if (!activeDrawer) return;
    if (e.key !== 'Tab') return;

    var focusable = Array.from(activeDrawer.querySelectorAll(FOCUSABLE));
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
    trapFocus(e);
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
