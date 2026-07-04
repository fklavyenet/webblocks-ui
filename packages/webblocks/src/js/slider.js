/* ============================================================
   WebBlocks UI — Slider Pattern (slider.js)

   Track-based slider runtime for wb-slider markup.
   ============================================================ */

(function () {
  'use strict';

  var states = new WeakMap();

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
    return {
      viewport: root.querySelector('.wb-slider-viewport'),
      track: root.querySelector('.wb-slider-track'),
      prev: root.querySelector('[data-wb-slider-prev], .wb-slider-prev'),
      next: root.querySelector('[data-wb-slider-next], .wb-slider-next'),
      dots: root.querySelector('[data-wb-slider-dots], .wb-slider-dots')
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
    });

    state.dots = toArray(state.parts.dots.querySelectorAll('.wb-slider-dot, [data-wb-slider-dot]'));
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
      var active = index === state.index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });

    setDisabled(state.parts.prev, !state.options.loop && state.index <= 0);
    setDisabled(state.parts.next, !state.options.loop && state.index >= count - 1);

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
    if (!state || !state.options.autoplay || state.slides.length < 2) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stopAutoplay(state);
    state.timer = window.setInterval(function () {
      step(state.root, 1);
    }, state.options.interval);
  }

  function restartAutoplay(state) {
    if (!state || !state.options.autoplay) return;
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

    state.parts.viewport.addEventListener('pointerdown', function (e) {
      if (e.button != null && e.button !== 0) return;
      active = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    state.parts.viewport.addEventListener('pointerup', function (e) {
      if (!active) return;
      active = false;

      var dx = e.clientX - startX;
      var dy = e.clientY - startY;

      if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy)) return;
      step(state.root, dx < 0 ? 1 : -1);
    });

    state.parts.viewport.addEventListener('pointercancel', function () {
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
      timer: null
    };

    states.set(root, state);
    ensureDots(state);
    render(state);
    bindSwipe(state);

    if (state.options.pauseOnHover) {
      root.addEventListener('mouseenter', function () {
        stopAutoplay(state);
      });
      root.addEventListener('mouseleave', function () {
        startAutoplay(state);
      });
    }

    startAutoplay(state);
    return state;
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
