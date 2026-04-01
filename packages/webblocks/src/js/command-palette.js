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
   Note: custom shortcut override is not wired in the shipped implementation.

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
