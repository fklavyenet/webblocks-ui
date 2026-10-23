/* ============================================================
   WebBlocks UI — Table Sort (table-sort.js)

   Opt in with table.wb-table[data-wb-table-sort="client|server"].
   Each sortable th[data-wb-sort="key"] contains a .wb-table-sort
   button, or a server-rendered link in server mode. See INTEGRATION.md.
   Server requests never reorder the currently rendered rows or claim
   a new aria-sort state before the host has supplied the sorted data.
   ============================================================ */

(function () {
  'use strict';

  var SELECTOR = 'table.wb-table[data-wb-table-sort]';
  var states = new WeakMap();

  function emit(table, name, detail, cancelable) {
    return table.dispatchEvent(new CustomEvent('wb:table-sort:' + name, {
      bubbles: true, cancelable: !!cancelable, detail: detail
    }));
  }

  function error(table, code) {
    emit(table, 'error', { code: code });
    return false;
  }

  function column(state, key) {
    return state.columns.find(function (item) { return item.key === key; });
  }

  function message(state, kind, item, direction) {
    var defaults = kind === 'label'
      ? { asc: 'Sort {label} ascending', desc: 'Sort {label} descending' }
      : { asc: '{label} sorted ascending.', desc: '{label} sorted descending.' };
    return (state.table.getAttribute('data-wb-sort-' + kind + '-' + direction) || defaults[direction])
      .replace(/\{label\}/g, function () { return item.label; });
  }

  function sync(state, key, direction, announce) {
    state.key = key;
    state.direction = direction;
    Array.from(state.table.tHead.querySelectorAll('th')).forEach(function (header) {
      if (header.closest('table') === state.table) header.removeAttribute('aria-sort');
    });
    state.columns.forEach(function (item) {
      var active = item.key === key;
      if (active) item.header.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : 'descending');
      item.icon.classList.remove('wb-icon-arrow-up-down', 'wb-icon-arrow-up', 'wb-icon-arrow-down');
      item.icon.classList.add(active ? (direction === 'asc' ? 'wb-icon-arrow-up' : 'wb-icon-arrow-down') : 'wb-icon-arrow-up-down');
      var next = active && direction === 'asc' ? 'desc' : 'asc';
      item.control.setAttribute('aria-label', message(state, 'label', item, next));
      if (state.mode === 'server' && item.control.tagName === 'A') {
        var url = serverURL(state, item, next);
        if (url) item.control.setAttribute('href', url);
      }
    });
    if (announce && key) state.status.textContent = message(state, 'message', column(state, key), direction);
  }

  function validRows(state) {
    var table = state.table;
    if (table.tHead.rows.length !== 1 || table.tBodies.length !== 1) return false;
    var width = table.tHead.rows[0].cells.length;
    return Array.from(table.tHead.rows[0].cells).every(function (cell) {
      return cell.colSpan === 1 && cell.rowSpan === 1;
    }) && Array.from(table.tBodies[0].rows).every(function (row) {
      return row.cells.length === width && Array.from(row.cells).every(function (cell) {
        return cell.colSpan === 1 && cell.rowSpan === 1;
      });
    });
  }

  function value(cell, type) {
    var raw = (cell.hasAttribute('data-wb-sort-value') ? cell.getAttribute('data-wb-sort-value') : cell.textContent).trim();
    if (!raw) return null;
    if (type === 'number') {
      if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(raw)) return null;
      var number = Number(raw);
      return Number.isFinite(number) ? number : null;
    }
    if (type === 'date') {
      // Require an ISO date or timestamp with an explicit timezone. Never guess
      // localized date formats, or accept normalized dates such as February 30.
      if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(raw)) return null;
      var day = new Date(raw.slice(0, 10) + 'T00:00:00Z');
      var time = Date.parse(raw);
      return Number.isFinite(time) && Number.isFinite(day.getTime()) && day.toISOString().slice(0, 10) === raw.slice(0, 10) ? time : null;
    }
    return raw;
  }

  function sortRows(state, item, direction) {
    if (!validRows(state)) return error(state.table, 'invalid-structure');
    var rows = Array.from(state.table.tBodies[0].rows).map(function (row, index) {
      return { row: row, index: index, value: value(row.cells[item.header.cellIndex], item.type) };
    });
    rows.sort(function (a, b) {
      // Missing/invalid values stay last in both directions. Equal keys keep
      // their existing order independently of the browser's sort stability.
      if (a.value === null) return b.value === null ? a.index - b.index : 1;
      if (b.value === null) return -1;
      var order = item.type === 'text' ? state.collator.compare(a.value, b.value) : a.value - b.value;
      return order === 0 ? a.index - b.index : (direction === 'asc' ? order : -order);
    });
    var focused = document.activeElement;
    rows.forEach(function (entry) { state.table.tBodies[0].appendChild(entry.row); });
    if (focused && state.table.contains(focused) && document.activeElement !== focused) focused.focus();
    return true;
  }

  function serverURL(state, item, direction) {
    var control = item.control;
    var raw = control.tagName === 'A' ? control.getAttribute('href') : state.table.getAttribute('data-wb-sort-url') || window.location.href;
    var url;
    try { url = new URL(raw, window.location.href); } catch (_) { return null; }
    if (!/^https?:$/.test(url.protocol) || url.origin !== window.location.origin) return null;
    var names = [
      state.table.getAttribute('data-wb-sort-param') || 'sort',
      state.table.getAttribute('data-wb-sort-direction-param') || 'direction',
      state.table.getAttribute('data-wb-sort-page-param') || 'page'
    ];
    if (new Set(names).size !== names.length) return null;
    url.searchParams.set(names[0], item.key);
    url.searchParams.set(names[1], direction);
    url.searchParams.set(names[2], '1');
    return url.href;
  }

  function sort(table, key, direction) {
    var state = states.get(table);
    if (!state) { init(table); state = states.get(table); }
    if (!state) return false;
    var item = column(state, key);
    if (!item || (direction !== 'asc' && direction !== 'desc')) return error(table, 'invalid-sort');
    if (item.control.disabled || item.control.getAttribute('aria-disabled') === 'true') return false;
    var detail = { key: key, direction: direction, mode: state.mode, url: null };
    if (state.mode === 'server') {
      detail.url = serverURL(state, item, direction);
      if (!detail.url) return error(table, 'invalid-url');
    }
    if (!emit(table, 'request', detail, true)) return false;
    if (state.mode === 'server') {
      window.location.assign(detail.url);
      return true;
    }
    if (!sortRows(state, item, direction)) return false;
    sync(state, key, direction, true);
    emit(table, 'change', { key: key, direction: direction, mode: state.mode });
    return true;
  }

  function setup(table) {
    if (states.has(table)) return;
    var mode = table.getAttribute('data-wb-table-sort');
    if ((mode !== 'client' && mode !== 'server') || !table.tHead) return error(table, 'invalid-config');
    var headers = Array.from(table.tHead.querySelectorAll('th[data-wb-sort]')).filter(function (header) {
      return header.closest('table') === table;
    });
    var columns = headers.map(function (header) {
      var control = Array.from(header.children).find(function (child) { return child.classList.contains('wb-table-sort'); });
      return {
        header: header, control: control, key: header.getAttribute('data-wb-sort'),
        type: header.getAttribute('data-wb-sort-type') || 'text',
        label: control ? (header.getAttribute('data-wb-sort-label') || control.textContent.trim()) : ''
      };
    });
    if (!columns.length || new Set(columns.map(function (item) { return item.key; })).size !== columns.length || columns.some(function (item) {
      return !item.key || !item.label || !item.control || !['text', 'number', 'date'].includes(item.type) ||
        !(item.control.tagName === 'BUTTON' || (mode === 'server' && item.control.tagName === 'A' && item.control.hasAttribute('href')));
    })) return error(table, 'invalid-config');

    var active = columns.filter(function (item) { return /^(ascending|descending)$/.test(item.header.getAttribute('aria-sort')); });
    if (active.length > 1) return error(table, 'invalid-config');
    var locale = (table.closest('[lang]') || document.documentElement).getAttribute('lang') || 'en';
    var collator;
    try { collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' }); }
    catch (_) { collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' }); }
    var state = { table: table, columns: columns, mode: mode, collator: collator, key: null, direction: null };
    if (mode === 'client' && !validRows(state)) return error(table, 'invalid-structure');
    state.status = document.createElement('div');
    state.status.className = 'wb-sr-only';
    state.status.setAttribute('role', 'status');
    state.status.setAttribute('aria-live', 'polite');
    state.status.setAttribute('aria-atomic', 'true');
    table.insertAdjacentElement('afterend', state.status);
    columns.forEach(function (item) {
      item.originalLabel = item.control.getAttribute('aria-label');
      item.originalType = item.control.getAttribute('type');
      if (item.control.tagName === 'BUTTON') item.control.setAttribute('type', 'button');
      item.icon = document.createElement('i');
      item.icon.className = 'wb-icon wb-icon-sm wb-table-sort-icon';
      item.icon.setAttribute('aria-hidden', 'true');
      item.control.appendChild(item.icon);
    });
    state.click = function (event) {
      var item = columns.find(function (candidate) { return candidate.control.contains(event.target); });
      if (!item || item.control.closest('table') !== table) return;
      if (item.control.tagName === 'A' && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0)) return;
      event.preventDefault();
      sort(table, item.key, state.key === item.key && state.direction === 'asc' ? 'desc' : 'asc');
    };
    table.addEventListener('click', state.click);
    states.set(table, state);
    var key = active.length ? active[0].key : null;
    var direction = active.length ? (active[0].header.getAttribute('aria-sort') === 'ascending' ? 'asc' : 'desc') : null;
    if (key && mode === 'client') sortRows(state, active[0], direction);
    sync(state, key, direction, false);
  }

  function init(root) {
    root = root || document;
    if (root.matches && root.matches(SELECTOR)) setup(root);
    root.querySelectorAll(SELECTOR).forEach(setup);
  }

  // Call only after a server/AJAX host has replaced the data with a successful
  // response. This commits the rendered state without another request.
  function update(table, key, direction) {
    var state = states.get(table);
    if (!state) { init(table); state = states.get(table); }
    if (!state || !column(state, key) || !['asc', 'desc'].includes(direction)) return error(table, 'invalid-sort');
    if (state.mode === 'client' && !sortRows(state, column(state, key), direction)) return false;
    sync(state, key, direction, true);
    emit(table, 'change', { key: key, direction: direction, mode: state.mode });
    return true;
  }

  function destroy(table) {
    var state = states.get(table);
    if (!state) return;
    table.removeEventListener('click', state.click);
    state.columns.forEach(function (item) {
      item.icon.remove();
      if (item.originalLabel === null) item.control.removeAttribute('aria-label');
      else item.control.setAttribute('aria-label', item.originalLabel);
      if (item.originalType === null) item.control.removeAttribute('type');
      else item.control.setAttribute('type', item.originalType);
    });
    state.status.remove();
    states.delete(table);
  }

  window.WBTableSort = { init: init, sort: sort, update: update, destroy: destroy };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
})();
