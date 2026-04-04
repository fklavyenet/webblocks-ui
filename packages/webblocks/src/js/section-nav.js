/* ============================================================
   WebBlocks UI — Section Nav (WBSectionNav)
   Runtime active-state sync for in-page wb-section-nav anchors.

   Usage:
     <nav class="wb-section-nav" aria-label="On this page">
       <ul class="wb-section-nav-list">
         <li class="wb-section-nav-item">
           <a class="wb-section-nav-link" href="#overview">Overview</a>
         </li>
       </ul>
     </nav>

   Behavior:
     - activates the matching link when the page hash targets a valid section
     - keeps the active link in sync while scrolling long-form content
     - ignores section-nav blocks that do not point at real in-page targets

   Public API:
     WBSectionNav.sync()
   ============================================================ */

(function () {
  'use strict';

  var instances = [];
  var isBound = false;
  var isScheduled = false;
  var scrollContainers = [];

  function normalizeHash(hash) {
    if (!hash || hash === '#') return '';

    try {
      return decodeURIComponent(hash.replace(/^#/, ''));
    } catch (error) {
      return hash.replace(/^#/, '');
    }
  }

  function getLinkHash(link) {
    var href = link.getAttribute('href') || '';
    if (href.charAt(0) !== '#') return '';
    return normalizeHash(href);
  }

  function isScrollable(element) {
    if (!element || element === document.body || element === document.documentElement) return false;

    var style = window.getComputedStyle(element);
    var overflowY = style.overflowY;
    return (overflowY === 'auto' || overflowY === 'scroll') && element.scrollHeight > element.clientHeight;
  }

  function getScrollContainer(element) {
    var current = element.parentElement;

    while (current) {
      if (isScrollable(current)) return current;
      current = current.parentElement;
    }

    return window;
  }

  function getScrollTop(container) {
    return container === window ? window.scrollY : container.scrollTop;
  }

  function getViewportHeight(container) {
    return container === window ? window.innerHeight : container.clientHeight;
  }

  function getReadingLine(container) {
    return getScrollTop(container) + Math.min(getViewportHeight(container) * 0.25, 160);
  }

  function getTargetTop(target, container) {
    var rect = target.getBoundingClientRect();

    if (container === window) {
      return rect.top + window.scrollY;
    }

    var containerRect = container.getBoundingClientRect();
    return rect.top - containerRect.top + container.scrollTop;
  }

  function setActive(instance, activeId) {
    if (instance.activeId === activeId) return;

    instance.activeId = activeId || null;

    instance.items.forEach(function (item) {
      var isActive = item.id === activeId;
      item.link.classList.toggle('is-active', isActive);

      if (isActive) {
        item.link.setAttribute('aria-current', 'location');
      } else if (item.link.getAttribute('aria-current') === 'location') {
        item.link.removeAttribute('aria-current');
      }
    });
  }

  function findByHash(instance, hash) {
    if (!hash) return null;

    for (var i = 0; i < instance.items.length; i += 1) {
      if (instance.items[i].id === hash) return instance.items[i];
    }

    return null;
  }

  function findByScroll(instance) {
    var active = instance.items[0] || null;
    var readingLine = getReadingLine(instance.scrollContainer);

    instance.items.forEach(function (item) {
      var top = getTargetTop(item.target, instance.scrollContainer);
      if (top - readingLine <= 0) active = item;
    });

    return active;
  }

  function isHashMatchCurrent(instance, match) {
    if (!match) return false;

    var readingLine = getReadingLine(instance.scrollContainer);
    var currentByScroll = findByScroll(instance);
    var matchTop = getTargetTop(match.target, instance.scrollContainer);
    var nextItem = null;
    var i;

    for (i = 0; i < instance.items.length; i += 1) {
      if (instance.items[i].id === match.id) {
        nextItem = instance.items[i + 1] || null;
        break;
      }
    }

    if (currentByScroll && currentByScroll.id === match.id) return true;
    if (readingLine < matchTop) return false;
    if (!nextItem) return true;

    return readingLine < getTargetTop(nextItem.target, instance.scrollContainer);
  }

  function syncInstance(instance) {
    if (!instance.items.length) return;

    var hashMatch = findByHash(instance, normalizeHash(window.location.hash));
    if (isHashMatchCurrent(instance, hashMatch)) {
      setActive(instance, hashMatch.id);
      return;
    }

    var scrollMatch = findByScroll(instance);
    setActive(instance, scrollMatch ? scrollMatch.id : null);
  }

  function syncAll() {
    instances.forEach(syncInstance);
  }

  function scheduleSync() {
    if (isScheduled) return;

    isScheduled = true;
    window.requestAnimationFrame(function () {
      isScheduled = false;
      syncAll();
    });
  }

  function collectInstance(nav) {
    var links = Array.from(nav.querySelectorAll('.wb-section-nav-link[href^="#"]'));
    var items = [];

    links.forEach(function (link) {
      var id = getLinkHash(link);
      var target = id ? document.getElementById(id) : null;

      if (!target) return;

      items.push({
        id: id,
        link: link,
        target: target
      });
    });

    if (!items.length) return null;

    return {
      nav: nav,
      items: items,
      scrollContainer: getScrollContainer(nav),
      activeId: null
    };
  }

  function bindEvents() {
    if (isBound) return;
    isBound = true;

    document.addEventListener('click', function (event) {
      var link = event.target.closest('.wb-section-nav-link[href^="#"]');
      if (!link) return;

      instances.forEach(function (instance) {
        if (!instance.nav.contains(link)) return;

        var id = getLinkHash(link);
        var match = findByHash(instance, id);
        if (match) setActive(instance, match.id);
      });
    });

    window.addEventListener('hashchange', scheduleSync);
    window.addEventListener('resize', scheduleSync, { passive: true });
    window.addEventListener('load', scheduleSync);

    scrollContainers.forEach(function (container) {
      container.addEventListener('scroll', scheduleSync, { passive: true });
    });
  }

  function init() {
    instances = Array.from(document.querySelectorAll('.wb-section-nav'))
      .map(collectInstance)
      .filter(Boolean);

    if (!instances.length) return;

    scrollContainers = instances
      .map(function (instance) { return instance.scrollContainer; })
      .filter(function (container, index, list) {
        return list.indexOf(container) === index;
      });

    bindEvents();
    syncAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.WBSectionNav = {
    sync: syncAll
  };
})();
