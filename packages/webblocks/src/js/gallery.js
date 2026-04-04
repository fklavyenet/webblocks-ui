/* ============================================================
   WebBlocks UI — Gallery Pattern (gallery.js)

   Inline gallery pattern that populates a shared wb-modal viewer.
   The viewer remains a content-first wb-modal usage mode.
   ============================================================ */

(function () {
  'use strict';

  var activeViewer = null;

  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  function trim(value) {
    return value == null ? '' : String(value).trim();
  }

  function getModalSelector(trigger) {
    return trigger ? (trigger.getAttribute('data-wb-gallery-target') || trigger.getAttribute('data-wb-target')) : '';
  }

  function getViewerParts(modal) {
    return {
      image: modal.querySelector('.wb-gallery-viewer-image'),
      caption: modal.querySelector('.wb-gallery-viewer-caption'),
      meta: modal.querySelector('.wb-gallery-viewer-meta'),
      counter: modal.querySelector('.wb-gallery-viewer-counter'),
      prev: modal.querySelector('.wb-gallery-viewer-prev'),
      next: modal.querySelector('.wb-gallery-viewer-next')
    };
  }

  function getGallery(trigger) {
    return trigger ? trigger.closest('.wb-gallery') : null;
  }

  function getItems(gallery, modalSelector) {
    if (!gallery || !modalSelector) return [];

    return toArray(gallery.querySelectorAll('.wb-gallery-trigger')).filter(function (item) {
      return getModalSelector(item) === modalSelector;
    });
  }

  function readItem(trigger) {
    var item = trigger.closest('.wb-gallery-item') || trigger.parentElement;
    var image = trigger.querySelector('.wb-gallery-media') || trigger.querySelector('img');
    var caption = item ? item.querySelector('.wb-gallery-caption') : null;
    var meta = item ? item.querySelector('.wb-gallery-meta') : null;

    return {
      full: trim(trigger.getAttribute('data-wb-gallery-full')) || trim(trigger.getAttribute('href')) || (image ? trim(image.getAttribute('src')) : ''),
      alt: trim(trigger.getAttribute('data-wb-gallery-alt')) || (image ? trim(image.getAttribute('alt')) : ''),
      caption: trim(trigger.getAttribute('data-wb-gallery-caption')) || (caption ? trim(caption.textContent) : ''),
      meta: trim(trigger.getAttribute('data-wb-gallery-meta')) || (meta ? trim(meta.textContent) : ''),
      width: trim(trigger.getAttribute('data-wb-gallery-width')) || (image ? trim(image.getAttribute('width')) : ''),
      height: trim(trigger.getAttribute('data-wb-gallery-height')) || (image ? trim(image.getAttribute('height')) : '')
    };
  }

  function setText(element, value) {
    if (!element) return;
    var hasValue = !!trim(value);
    element.textContent = hasValue ? value : '';
    element.hidden = !hasValue;
  }

  function setDisabled(button, disabled) {
    if (!button) return;
    button.disabled = disabled;
    button.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  }

  function syncModalLabel(state, item) {
    if (!state || !state.modal) return;

    var captionId = state.parts.caption && state.parts.caption.id ? state.parts.caption.id : '';
    var label = trim(item.caption) || trim(item.alt) || 'Gallery viewer';

    if (captionId && trim(item.caption)) {
      state.modal.setAttribute('aria-labelledby', captionId);
      state.modal.removeAttribute('aria-label');
      return;
    }

    state.modal.removeAttribute('aria-labelledby');
    state.modal.setAttribute('aria-label', label);
  }

  function emitChange(state, item) {
    if (!state || !state.modal) return;

    WBDom.emit(state.modal, 'wb:gallery:change', {
      index: state.index,
      count: state.items.length,
      item: item,
      trigger: state.items[state.index]
    });
  }

  function render(state) {
    if (!state || !state.items.length || state.index < 0 || state.index >= state.items.length) return;

    var item = readItem(state.items[state.index]);
    var parts = state.parts;

    if (parts.image) {
      parts.image.src = item.full;
      parts.image.alt = item.alt;

      if (item.width) parts.image.setAttribute('width', item.width);
      else parts.image.removeAttribute('width');

      if (item.height) parts.image.setAttribute('height', item.height);
      else parts.image.removeAttribute('height');
    }

    setText(parts.caption, item.caption);
    setText(parts.meta, item.meta);
    syncModalLabel(state, item);

    if (parts.counter) {
      parts.counter.textContent = (state.index + 1) + ' / ' + state.items.length;
    }

    setDisabled(parts.prev, state.index <= 0);
    setDisabled(parts.next, state.index >= state.items.length - 1);
    emitChange(state, item);
  }

  function buildState(trigger) {
    var modalSelector = getModalSelector(trigger);
    var modal = modalSelector ? document.querySelector(modalSelector) : null;
    var gallery = getGallery(trigger);
    var items = getItems(gallery, modalSelector);
    var index = items.indexOf(trigger);

    if (!modal || !gallery || index === -1) return null;

    return {
      modal: modal,
      gallery: gallery,
      items: items,
      index: index,
      parts: getViewerParts(modal)
    };
  }

  function openTrigger(trigger) {
    if (!trigger) return false;

    var state = buildState(trigger);
    if (!state) return false;

    activeViewer = state;
    render(state);
    WBModal.open(state.modal, trigger);
    return true;
  }

  function step(direction) {
    if (!activeViewer || WBModal.getActive() !== activeViewer.modal) return false;

    var nextIndex = activeViewer.index + direction;
    if (nextIndex < 0 || nextIndex >= activeViewer.items.length) return false;

    activeViewer.index = nextIndex;
    render(activeViewer);
    return true;
  }

  function onTriggerClick(e) {
    var trigger = e.target.closest('.wb-gallery .wb-gallery-trigger');
    if (!trigger || !getModalSelector(trigger)) return;

    e.preventDefault();
    openTrigger(trigger);
  }

  function onViewerControlClick(e) {
    var prev = e.target.closest('.wb-gallery-viewer-prev');
    var next = e.target.closest('.wb-gallery-viewer-next');

    if (prev && activeViewer && activeViewer.modal.contains(prev)) {
      e.preventDefault();
      step(-1);
      return;
    }

    if (next && activeViewer && activeViewer.modal.contains(next)) {
      e.preventDefault();
      step(1);
    }
  }

  function onKeydown(e) {
    if (!activeViewer || WBModal.getActive() !== activeViewer.modal) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    var active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
      return;
    }

    if (e.key === 'ArrowLeft') {
      if (step(-1)) e.preventDefault();
      return;
    }

    if (e.key === 'ArrowRight') {
      if (step(1)) e.preventDefault();
    }
  }

  document.addEventListener('click', onTriggerClick);
  document.addEventListener('click', onViewerControlClick);
  document.addEventListener('keydown', onKeydown);

  document.addEventListener('wb:modal:close', function (e) {
    if (activeViewer && e.target === activeViewer.modal) {
      activeViewer = null;
    }
  });

  window.WBGallery = {
    open: function (trigger) {
      if (typeof trigger === 'string') trigger = document.querySelector(trigger);
      return openTrigger(trigger);
    },
    prev: function () {
      return step(-1);
    },
    next: function () {
      return step(1);
    },
    getActive: function () {
      return activeViewer;
    }
  };

})();
