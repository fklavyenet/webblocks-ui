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
           <label class="wb-sr-only" for="myCmdSearch">Search commands</label>
           <input class="wb-cmd-input" id="myCmdSearch" type="text"
                  placeholder="Search commands..." autocomplete="off" />
         </div>
         <div class="wb-cmd-results">
           <ul class="wb-cmd-group">
             <li><a class="wb-cmd-item" href="/docs">Documentation</a></li>
           </ul>
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
   Note: custom shortcut override is not wired in the shipped implementation.

   Native opt-in: use dialog.wb-cmd-backdrop with the same inner markup.
   Open it through the existing trigger or API.

   Items can be static HTML .wb-cmd-item elements, or provided via a
   custom search function assigned to WBCommandPalette.onSearch(query, callback).
   ============================================================ */

(function () {
  'use strict';

  var instances = new WeakMap();

  // ── External search handler ────────────────────────────── 
  // Assign: WBCommandPalette.onSearch = function(query, callback) { ... }
  var searchHandler = null;

  // ── Helpers ───────────────────────────────────────────────

  function getItems(palette) {
    return Array.from(palette.querySelectorAll('.wb-cmd-item')).filter(function (item) {
      return item.closest('.wb-cmd-backdrop') === palette;
    });
  }

  function getVisibleItems(palette) {
    return getItems(palette).filter(function (item) {
      return !item.matches(':disabled, [aria-disabled="true"]') &&
        !item.closest('[hidden], [inert]') && item.getClientRects().length &&
        getComputedStyle(item).visibility !== 'hidden';
    });
  }

  function clearSelection(palette) {
    getItems(palette).forEach(function (item) { item.classList.remove('is-selected'); });
  }

  function selectItem(palette, index) {
    var items = getVisibleItems(palette);
    if (!items.length) return;
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;

    var item = items[index];
    // Preserve keyboard activation for legacy custom items; new markup uses links/buttons.
    if (!item.matches('a[href], button, input, [tabindex]')) item.setAttribute('tabindex', '-1');
    item.focus({ preventScroll: true });
    item.scrollIntoView({ block: 'nearest' });
  }

  function getActivePalette() {
    var top = WBDom.overlay.getTopmost(function (instance) {
      return instance.active && instance.kind === 'command-palette';
    });

    return top ? top.element : null;
  }

  function ensureInstance(palette, trigger) {
    var instance = instances.get(palette);
    if (instance) {
      instance.trigger = trigger || instance.trigger;
      return instance;
    }

    instance = WBDom.overlay.create({
      kind: 'command-palette',
      group: 'dialog',
      layer: 'dialog',
      element: palette,
      panel: palette.querySelector('.wb-cmd-dialog') || palette,
      trigger: trigger,
      exclusive: false,
      backdrop: true,
      backdropClass: 'wb-overlay-backdrop-dark',
      lockScroll: true,
      trapFocus: true,
      autoFocus: false,
      returnFocus: true,
      onAfterOpen: function () {
        palette.dispatchEvent(new CustomEvent('wb:cmd:open', { bubbles: true }));
      },
      onAfterClose: function () {
        clearSelection(palette);
        palette.dispatchEvent(new CustomEvent('wb:cmd:close', { bubbles: true }));
      }
    });

    instances.set(palette, instance);
    return instance;
  }

  // ── Open ──────────────────────────────────────────────────

  function open(palette, trigger) {
    if (!palette) return;
    var instance = ensureInstance(palette, trigger);
    instance.trigger = trigger || instance.trigger;
    WBDom.overlay.open(instance);

    // Focus the input
    requestAnimationFrame(function () {
      if (!instance.active || (instance.nativeDialog && !palette.open)) return;
      var input = palette.querySelector('.wb-cmd-input');
      if (input) {
        input.value = '';
        input.focus();
        handleInput(input);
      }
      clearSelection(palette);
    });
  }

  // ── Close ─────────────────────────────────────────────────

  function close(palette) {
    if (!palette) palette = getActivePalette();
    if (!palette) return;
    WBDom.overlay.close(ensureInstance(palette), 'api');
  }

  function requestUserClose(palette, reason, originalEvent) {
    if (!palette) palette = getActivePalette();
    if (!palette) return;
    WBDom.overlay.requestClose(ensureInstance(palette), reason, {
      originalEvent: originalEvent || null
    });
  }

  // ── Input / search ─────────────────────────────────────── 

  function handleInput(input) {
    var palette = input.closest('.wb-cmd-backdrop');
    if (!palette) return;

    clearSelection(palette);
    var query = input.value.trim().toLowerCase();

    // If custom search handler is set, delegate
    if (typeof searchHandler === 'function') {
      searchHandler(query, function (html) {
        var results = palette.querySelector('.wb-cmd-results');
        if (results) {
          // Return focus before replacing a focused command with new results.
          if (results.contains(document.activeElement)) input.focus();
          results.innerHTML = html;
          clearSelection(palette);
        }
      });
      return;
    }

    // Built-in: filter visible items by text match
    var items = getItems(palette);
    var anyVisible = false;

    items.forEach(function (item) {
      var text = (item.textContent || '').toLowerCase();
      var match = !query || text.includes(query);
      item.style.display = match ? '' : 'none';
      // Semantic list rows must disappear with their filtered controls.
      var row = item.parentElement;
      if (row && row.tagName === 'LI') row.style.display = match ? '' : 'none';
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
      if (palette) open(palette, trigger);
      return;
    }

    // Backdrop click to close
    var backdrop = e.target.closest('.wb-cmd-backdrop');
    if (backdrop && e.target === backdrop) {
      var instance = instances.get(backdrop);
      // The shared manager handles native backdrops, including close guards.
      if (instance && !instance.nativeDialog) requestUserClose(backdrop, 'outside', e);
      return;
    }

    // Item click — close after selection
    var item = e.target.closest('.wb-cmd-item');
    var itemPalette = item && item.closest('.wb-cmd-backdrop');
    if (itemPalette && itemPalette === getActivePalette()) {
      // Allow item click to propagate first, then close
      setTimeout(function () {
        if (itemPalette !== getActivePalette()) return;
        // A newly opened child dialog still needs its native parent.
        if (instances.get(itemPalette).nativeDialog && !isTopInteractive(itemPalette)) return;
        close(itemPalette);
      }, 80);
    }
  });

  function isTopInteractive(palette) {
    var top = WBDom.overlay.getTopmost(function (instance) {
      return instance.interactive !== false;
    });
    return top && top.element === palette;
  }

  document.addEventListener('keydown', function (e) {
    // Global shortcut: Cmd/Ctrl + K (or custom)
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      var activePalette = getActivePalette();
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

    var activePalette = getActivePalette();
    if (!activePalette || !isTopInteractive(activePalette)) return;

    if (e.defaultPrevented || e.isComposing || e.metaKey || e.ctrlKey || e.altKey) return;
    var input = activePalette.querySelector('.wb-cmd-input');
    var item = e.target.closest('.wb-cmd-item');
    if (e.target !== input && (!item || item.closest('.wb-cmd-backdrop') !== activePalette)) return;
    // Leave embedded controls and unrelated dialog actions to their native behavior.
    if (item && e.target !== item) return;

    var items = getVisibleItems(activePalette);
    var index = items.indexOf(item);
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectItem(activePalette, index + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        selectItem(activePalette, index < 0 ? -1 : index - 1);
        break;
      case 'Enter':
        // Real links/buttons keep browser activation, including modified link clicks.
        if (e.target === input) {
          // Retain the legacy guard against submitting an enclosing host form.
          e.preventDefault();
        } else if (item && !item.matches('a[href], button, input')) {
          e.preventDefault();
          item.click();
        }
        break;
      default:
        // Typing after arrow navigation resumes the existing search field. Space
        // remains the native button activation key. Do not intercept IME/modifiers.
        if (item && input && ((e.key.length === 1 && e.key !== ' ') || e.key === 'Backspace')) {
          input.focus();
        }
    }
  });

  document.addEventListener('focusin', function (e) {
    var palette = e.target.closest('.wb-cmd-backdrop');
    if (!palette || palette !== getActivePalette() || !isTopInteractive(palette)) return;
    clearSelection(palette);
    var item = e.target.closest('.wb-cmd-item');
    if (item && item.closest('.wb-cmd-backdrop') === palette) item.classList.add('is-selected');
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
    getActive: getActivePalette,
    onSearch:  function (fn) { searchHandler = fn; }
  };

})();
