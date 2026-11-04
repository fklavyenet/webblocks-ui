/* ============================================================
   WebBlocks UI — Slider Pattern (slider.js)

   Track-based slider runtime for wb-slider markup.
   ============================================================ */

(function () {
  'use strict';

  var states = new WeakMap();
  var rootSelector = '[data-wb-slider], .wb-slider';
  var supportsInert = 'inert' in HTMLElement.prototype;
  var focusSelector = 'a[href], area[href], button, input, select, textarea, iframe, object, embed, audio[controls], video[controls], summary, [contenteditable], [tabindex]';
  // Fallback locks are shared so an inner slider cannot unlock its hidden parent.
  var focusLocks = new WeakMap();

  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  function boolAttr(element, name, fallback) {
    if (!element || !element.hasAttribute(name)) return fallback;
    var value = String(element.getAttribute(name) || '').toLowerCase();
    return value === 'true' || value === '1' || value === 'yes' || value === '';
  }

  function intAttr(element, name, fallback) {
    var value = parseInt(element ? element.getAttribute(name) : '', 10);
    return Number.isFinite(value) ? value : fallback;
  }

  function getParts(root) {
    function own(selector) {
      return toArray(root.querySelectorAll(selector)).find(function (element) {
        return element.closest(rootSelector) === root;
      }) || null;
    }
    return {
      viewport: own('.wb-slider-viewport'),
      track: own('.wb-slider-track'),
      prev: own('[data-wb-slider-prev], .wb-slider-prev'),
      next: own('[data-wb-slider-next], .wb-slider-next'),
      dots: own('[data-wb-slider-dots], .wb-slider-dots')
    };
  }

  function getSlides(parts) {
    return parts.track ? toArray(parts.track.querySelectorAll(':scope > .wb-slide')) : [];
  }

  function readOptions(root) {
    return {
      autoplay: boolAttr(root, 'data-wb-slider-autoplay', false),
      interval: Math.max(1000, intAttr(root, 'data-wb-slider-interval', 6000)),
      loop: boolAttr(root, 'data-wb-slider-loop', true),
      pauseOnHover: boolAttr(root, 'data-wb-slider-pause-on-hover', true),
      keyboard: boolAttr(root, 'data-wb-slider-keyboard', true),
      swipe: boolAttr(root, 'data-wb-slider-swipe', true)
    };
  }

  function ensureDots(state) {
    if (!state.parts.dots || state.dots.length || state.slides.length < 2) return;

    state.slides.forEach(function (_, index) {
      var dot = document.createElement('button');
      dot.className = 'wb-slider-dot';
      dot.type = 'button';
      dot.setAttribute('data-wb-slider-dot', String(index));
      dot.setAttribute('aria-label', 'Show slide ' + (index + 1));
      state.parts.dots.appendChild(dot);
      state.generatedDots.push(dot);
    });

    state.dots = toArray(state.parts.dots.querySelectorAll('.wb-slider-dot, [data-wb-slider-dot]'));
  }

  function restoreAttribute(element, name, value) {
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  }

  function remember(state, element, names, activeClass) {
    if (!element) return;
    var saved = state.saved.get(element);
    if (!saved) {
      saved = { attributes: {}, active: null };
      state.saved.set(element, saved);
    }
    names.forEach(function (name) {
      if (!(name in saved.attributes)) saved.attributes[name] = element.getAttribute(name);
    });
    if (activeClass && saved.active === null) saved.active = element.classList.contains('is-active');
  }

  function restoreElement(state, element) {
    var saved = state.saved.get(element);
    if (!saved) return;
    Object.keys(saved.attributes).forEach(function (name) {
      restoreAttribute(element, name, saved.attributes[name]);
    });
    if (saved.active !== null) element.classList.toggle('is-active', saved.active);
    state.saved.delete(element);
  }

  function inactiveContains(state, element) {
    return state.slides.some(function (slide, index) {
      return index !== state.index && slide.contains(element);
    });
  }

  function moveFocus(state, element) {
    // Focus the stable slider boundary only when focus would otherwise be hidden.
    var tabindex = state.root.getAttribute('tabindex');
    if (tabindex === null) {
      state.root.setAttribute('tabindex', '-1');
      state.restoreFocusTarget = function () {
        state.root.removeEventListener('blur', state.restoreFocusTarget);
        if (state.root.getAttribute('tabindex') === '-1') state.root.removeAttribute('tabindex');
        state.restoreFocusTarget = null;
      };
      state.root.addEventListener('blur', state.restoreFocusTarget);
    }
    state.root.focus({ preventScroll: true });
    if (document.activeElement !== state.root && state.restoreFocusTarget) state.restoreFocusTarget();
    // An authored inert ancestor may make the boundary unavailable as well.
    if (document.activeElement === element && typeof element.blur === 'function') element.blur();
  }

  function releaseFocus(state, element) {
    var lock = focusLocks.get(element);
    if (!lock) return;
    lock.owners.delete(state);
    if (!lock.owners.size) {
      if (element.getAttribute('tabindex') === '-1') restoreAttribute(element, 'tabindex', lock.tabindex);
      focusLocks.delete(element);
    }
    state.locked.delete(element);
  }

  function syncFallback(state) {
    var desired = new Set();
    state.slides.forEach(function (slide, index) {
      if (index === state.index) return;
      if (slide.matches(focusSelector)) desired.add(slide);
      toArray(slide.querySelectorAll(focusSelector)).forEach(function (element) { desired.add(element); });
    });
    state.locked.forEach(function (element) {
      if (!desired.has(element)) releaseFocus(state, element);
    });
    desired.forEach(function (element) {
      var lock = focusLocks.get(element);
      if (!lock) {
        lock = { tabindex: element.getAttribute('tabindex'), owners: new Set() };
        focusLocks.set(element, lock);
      } else if (element.getAttribute('tabindex') !== '-1') {
        // Retain host edits made while the fallback owns the tab stop.
        lock.tabindex = element.getAttribute('tabindex');
      }
      lock.owners.add(state);
      state.locked.add(element);
      if (element.getAttribute('tabindex') !== '-1') element.setAttribute('tabindex', '-1');
    });
  }

  function syncAccess(state) {
    var focused = document.activeElement;
    if (focused && inactiveContains(state, focused)) moveFocus(state, focused);
    state.slides.forEach(function (slide, index) {
      remember(state, slide, ['aria-hidden'], true);
      if (index === state.index) {
        releaseInert(state, slide);
      } else if (!slide.hasAttribute('inert')) {
        slide.setAttribute('inert', '');
        state.inertSlides.add(slide);
      }
    });
    if (!supportsInert) syncFallback(state);
  }

  function releaseInert(state, slide) {
    if (!state.inertSlides.has(slide)) return;
    if (slide.getAttribute('inert') === '') slide.removeAttribute('inert');
    state.inertSlides.delete(slide);
  }

  function listen(state, element, name, handler) {
    if (!element) return;
    element.addEventListener(name, handler);
    state.cleanup.push(function () { element.removeEventListener(name, handler); });
  }

  function unbind(state) {
    stopAutoplay(state);
    state.cleanup.forEach(function (cleanup) { cleanup(); });
    state.cleanup = [];
    if (state.observer) state.observer.disconnect();
    state.observer = null;
    state.motionQuery = null;
  }

  function bind(state) {
    bindSwipe(state);
    state.hovered = state.root.matches(':hover');
    state.focusPaused = state.focusPaused || state.root.contains(document.activeElement);
    if (state.options.autoplay) {
      listen(state, state.root, 'focusin', function () {
        // Leaving focus must not silently restart rotation. Hosts can explicitly
        // re-enable autoplay through the existing option/update lifecycle.
        state.focusPaused = true;
        stopAutoplay(state);
      });
      if (typeof window.matchMedia === 'function') {
        var query = window.matchMedia('(prefers-reduced-motion: reduce)');
        state.motionQuery = query;
        var onMotionChange = function () { startAutoplay(state); };
        if (typeof query.addEventListener === 'function') {
          listen(state, query, 'change', onMotionChange);
        } else if (typeof query.addListener === 'function') {
          query.addListener(onMotionChange);
          state.cleanup.push(function () { query.removeListener(onMotionChange); });
        }
      }
    }
    if (state.options.pauseOnHover) {
      listen(state, state.root, 'mouseenter', function () {
        state.hovered = true;
        stopAutoplay(state);
      });
      listen(state, state.root, 'mouseleave', function () {
        state.hovered = false;
        startAutoplay(state);
      });
    }
    if (!supportsInert) {
      listen(state, state.root, 'focusin', function (event) {
        if (inactiveContains(state, event.target)) moveFocus(state, event.target);
      });
      state.observer = new MutationObserver(function () { syncFallback(state); });
      state.observer.observe(state.root, {
        childList: true, subtree: true, attributes: true,
        attributeFilter: ['tabindex', 'href', 'contenteditable', 'controls', 'type', 'disabled']
      });
    }
    startAutoplay(state);
  }

  function setDisabled(button, disabled) {
    if (!button) return;
    button.disabled = disabled;
    button.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  }

  function normalizeIndex(state, index) {
    if (!state.slides.length) return 0;
    if (state.options.loop) return (index + state.slides.length) % state.slides.length;
    return Math.max(0, Math.min(index, state.slides.length - 1));
  }

  function emit(root, name, detail) {
    if (window.WBDom && typeof window.WBDom.emit === 'function') {
      window.WBDom.emit(root, name, detail);
      return;
    }

    root.dispatchEvent(new CustomEvent(name, { bubbles: true, detail: detail }));
  }

  function render(state) {
    var root = state.root;
    var count = state.slides.length;

    remember(state, root, ['data-wb-slider-single']);
    syncAccess(state);
    root.setAttribute('data-wb-slider-single', count <= 1 ? 'true' : 'false');

    if (state.parts.track) {
      state.parts.track.style.transform = 'translateX(' + (-state.index * 100) + '%)';
    }

    state.slides.forEach(function (slide, index) {
      var active = index === state.index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    state.dots.forEach(function (dot, index) {
      remember(state, dot, ['aria-current'], true);
      var active = index === state.index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });

    remember(state, state.parts.prev, ['disabled', 'aria-disabled']);
    remember(state, state.parts.next, ['disabled', 'aria-disabled']);
    setDisabled(state.parts.prev, count < 2 || (!state.options.loop && state.index <= 0));
    setDisabled(state.parts.next, count < 2 || (!state.options.loop && state.index >= count - 1));

    emit(root, 'wb:slider:change', {
      index: state.index,
      count: count,
      slide: state.slides[state.index] || null
    });
  }

  function goTo(root, index) {
    var state = states.get(root);
    if (!state || !state.slides.length) return false;

    var nextIndex = normalizeIndex(state, index);
    if (nextIndex === state.index) return false;

    state.index = nextIndex;
    render(state);
    restartAutoplay(state);
    return true;
  }

  function step(root, direction) {
    var state = states.get(root);
    return state ? goTo(root, state.index + direction) : false;
  }

  function stopAutoplay(state) {
    if (!state || !state.timer) return;
    window.clearInterval(state.timer);
    state.timer = null;
  }

  function startAutoplay(state) {
    // Cancel first: a new pause reason must also stop an existing interval.
    stopAutoplay(state);
    if (!state || states.get(state.root) !== state) return;
    if (!state.options.autoplay || state.slides.length < 2) return;
    if (state.focusPaused || (state.options.pauseOnHover && state.hovered)) return;
    if (state.motionQuery && state.motionQuery.matches) return;
    state.timer = window.setInterval(function () {
      step(state.root, 1);
    }, state.options.interval);
  }

  function restartAutoplay(state) {
    startAutoplay(state);
  }

  function onClick(e) {
    var prev = e.target.closest('[data-wb-slider-prev], .wb-slider-prev');
    var next = e.target.closest('[data-wb-slider-next], .wb-slider-next');
    var dot = e.target.closest('[data-wb-slider-dot], .wb-slider-dot');
    var control = prev || next || dot;
    var root = control ? control.closest('[data-wb-slider], .wb-slider') : null;
    var state = root ? states.get(root) : null;

    if (!state || !control) return;

    e.preventDefault();

    if (prev) {
      step(root, -1);
      return;
    }

    if (next) {
      step(root, 1);
      return;
    }

    var index = state.dots.indexOf(dot);
    if (index >= 0) goTo(root, index);
  }

  function onKeydown(e) {
    var root = e.target.closest ? e.target.closest('[data-wb-slider], .wb-slider') : null;
    var state = root ? states.get(root) : null;

    if (!state || !state.options.keyboard) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    if (e.key === 'ArrowLeft') {
      if (step(root, -1)) e.preventDefault();
      return;
    }

    if (e.key === 'ArrowRight') {
      if (step(root, 1)) e.preventDefault();
    }
  }

  function bindSwipe(state) {
    if (!state.options.swipe || !state.parts.viewport || state.slides.length < 2) return;

    var startX = 0;
    var startY = 0;
    var active = false;

    listen(state, state.parts.viewport, 'pointerdown', function (e) {
      if (e.target.closest(rootSelector) !== state.root) return;
      if (e.button != null && e.button !== 0) return;
      active = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    listen(state, state.parts.viewport, 'pointerup', function (e) {
      if (!active) return;
      active = false;

      var dx = e.clientX - startX;
      var dy = e.clientY - startY;

      if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy)) return;
      step(state.root, dx < 0 ? 1 : -1);
    });

    listen(state, state.parts.viewport, 'pointercancel', function () {
      active = false;
    });
  }

  function init(root) {
    if (typeof root === 'string') root = document.querySelector(root);
    if (!root || states.has(root)) return states.get(root) || null;

    var parts = getParts(root);
    var slides = getSlides(parts);

    if (!parts.track || !slides.length) return null;

    var activeIndex = Math.max(0, slides.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    }));

    var state = {
      root: root,
      parts: parts,
      slides: slides,
      dots: parts.dots ? toArray(parts.dots.querySelectorAll('.wb-slider-dot, [data-wb-slider-dot]')) : [],
      options: readOptions(root),
      index: activeIndex,
      timer: null,
      hovered: false,
      focusPaused: false,
      motionQuery: null,
      saved: new Map(),
      locked: new Set(),
      inertSlides: new Set(),
      generatedDots: [],
      cleanup: [],
      observer: null,
      restoreFocusTarget: null,
      trackStyle: { value: parts.track.style.getPropertyValue('transform'), priority: parts.track.style.getPropertyPriority('transform') }
    };

    states.set(root, state);
    ensureDots(state);
    render(state);
    bind(state);
    return state;
  }

  function restoreTrack(state) {
    if (!state.parts.track) return;
    if (state.trackStyle.value) state.parts.track.style.setProperty('transform', state.trackStyle.value, state.trackStyle.priority);
    else state.parts.track.style.removeProperty('transform');
  }

  function update(root) {
    if (typeof root === 'string') root = document.querySelector(root);
    var state = root ? states.get(root) : null;
    if (!state) return init(root);
    var active = state.slides[state.index];
    var previousIndex = state.index;
    unbind(state);
    restoreTrack(state);
    state.generatedDots.forEach(function (dot) { restoreElement(state, dot); dot.remove(); });
    state.generatedDots = [];
    state.parts = getParts(root);
    var slides = getSlides(state.parts);
    // Removed slides and controls must not retain runtime-owned state.
    state.saved.forEach(function (_, element) {
      if (element !== root && slides.indexOf(element) < 0) restoreElement(state, element);
    });
    state.slides = slides;
    state.inertSlides.forEach(function (slide) {
      if (slides.indexOf(slide) < 0) releaseInert(state, slide);
    });
    state.index = slides.indexOf(active);
    if (state.index < 0) state.index = Math.max(0, Math.min(previousIndex, slides.length - 1));
    var wasAutoplay = state.options.autoplay;
    state.options = readOptions(root);
    // An explicit false -> true option update is the existing API's opt-in to
    // rotate again. Ordinary update/init/navigation must retain a focus pause.
    if (!wasAutoplay && state.options.autoplay) state.focusPaused = false;
    state.dots = state.parts.dots ? toArray(state.parts.dots.querySelectorAll('.wb-slider-dot, [data-wb-slider-dot]')) : [];
    state.trackStyle = state.parts.track ? { value: state.parts.track.style.getPropertyValue('transform'), priority: state.parts.track.style.getPropertyPriority('transform') } : { value: '', priority: '' };
    ensureDots(state);
    render(state);
    bind(state);
    return state;
  }

  function destroy(root) {
    if (typeof root === 'string') root = document.querySelector(root);
    var state = root ? states.get(root) : null;
    if (!state) return false;
    unbind(state);
    if (state.restoreFocusTarget) state.restoreFocusTarget();
    state.locked.forEach(function (element) { releaseFocus(state, element); });
    state.inertSlides.forEach(function (slide) { releaseInert(state, slide); });
    state.saved.forEach(function (_, element) { restoreElement(state, element); });
    restoreTrack(state);
    state.generatedDots.forEach(function (dot) { dot.remove(); });
    states.delete(root);
    return true;
  }

  function initAll() {
    toArray(document.querySelectorAll('[data-wb-slider], .wb-slider[data-wb-slider-auto]')).forEach(init);
  }

  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeydown);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  window.WBSlider = {
    init: init,
    initAll: initAll,
    update: update,
    destroy: destroy,
    goTo: goTo,
    next: function (root) {
      if (typeof root === 'string') root = document.querySelector(root);
      return step(root, 1);
    },
    prev: function (root) {
      if (typeof root === 'string') root = document.querySelector(root);
      return step(root, -1);
    },
    get: function (root) {
      if (typeof root === 'string') root = document.querySelector(root);
      return root ? states.get(root) || null : null;
    }
  };

})();
