/* WebBlocks UI — Chart. Dependency-free SVG enhancement of a semantic table.
 * Source values are numbers or missing cells; missing values never become zero.
 * Hosts own data, labels, formatting, aggregation and authorization.
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var instances = new WeakMap();
  var serial = 0;
  var MAX_ROWS = 500;
  var MAX_SERIES = 8;

  function node(tag, attributes, text, svg) {
    var el = svg ? document.createElementNS(NS, tag) : document.createElement(tag);
    Object.keys(attributes || {}).forEach(function (key) { el.setAttribute(key, attributes[key]); });
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function emit(root, name, detail) {
    root.dispatchEvent(new CustomEvent('wb:chart:' + name, { bubbles: true, detail: detail }));
  }

  function read(root) {
    var sourceId = root.getAttribute('data-wb-chart-table');
    var table = sourceId ? document.getElementById(sourceId) : root.querySelector('table');
    if (!table || table.tagName !== 'TABLE' || !table.tHead || !table.tHead.rows.length) throw new Error('missing-table');
    var headers = Array.from(table.tHead.rows[0].cells);
    var count = headers.length - 1;
    var rows = Array.from(table.tBodies).flatMap(function (body) { return Array.from(body.rows); });
    var type = root.getAttribute('data-wb-chart') || 'line';
    var label = root.getAttribute('aria-label') || (table.caption && table.caption.textContent.trim());
    if (!label || count < 1 || count > MAX_SERIES || rows.length > MAX_ROWS || !['line', 'bar'].includes(type)) throw new Error('invalid-config');
    var series = headers.slice(1).map(function (header) {
      var name = header.textContent.trim();
      if (!name) throw new Error('invalid-config');
      return { label: name, values: [], display: [] };
    });
    var labels = rows.map(function (row) {
      if (row.cells.length !== headers.length) throw new Error('invalid-row');
      series.forEach(function (item, index) {
        var cell = row.cells[index + 1];
        var raw = cell.hasAttribute('data-wb-chart-value') ? cell.getAttribute('data-wb-chart-value') : cell.textContent;
        raw = raw.trim();
        var value = raw === '' ? null : Number(raw);
        // Bound exponents to keep scale arithmetic and SVG coordinates finite.
        if (value !== null && (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(raw) || !Number.isFinite(value) || Math.abs(value) > 1e100 || (value !== 0 && Math.abs(value) < 1e-100))) throw new Error('invalid-value');
        item.values.push(value);
        item.display.push(cell.textContent.trim() || (value === null ? '' : String(value)));
      });
      return row.cells[0].textContent.trim();
    });
    return { table: table, label: label, type: type, labels: labels, series: series };
  }

  function scale(series) {
    var values = series.flatMap(function (item) { return item.values.filter(function (value) { return value !== null; }); });
    if (!values.length) return null;
    var min = Math.min(0, ...values);
    var max = Math.max(0, ...values);
    if (min === max) max = 1;
    var rough = (max - min) / 4;
    var magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
    var fraction = rough / magnitude;
    var step = (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10) * magnitude;
    min = Math.floor(min / step) * step;
    max = Math.ceil(max / step) * step;
    var ticks = [];
    var steps = Math.round((max - min) / step);
    for (var i = 0; i <= steps; i++) ticks.push(Number((min + step * i).toPrecision(12)) || 0);
    return { min: min, max: max, ticks: ticks };
  }

  function formatter(root) {
    var lang = root.getAttribute('lang') || (root.closest('[lang]') || document.documentElement).getAttribute('lang') || 'en';
    try { new Intl.NumberFormat(lang); } catch (_) { lang = 'en'; }
    return function (value) {
      return new Intl.NumberFormat(lang, {
        maximumSignificantDigits: 3,
        notation: value !== 0 && (Math.abs(value) >= 1e9 || Math.abs(value) < .001) ? 'scientific' : 'standard'
      }).format(value);
    };
  }

  function announce(state, selection, notify) {
    state.selection = selection;
    var activeMark = selection ? state.svg.querySelector('.wb-chart-mark[data-index="' + selection.index + '"][data-series="' + selection.series + '"]') : null;
    if (state.activeMark !== activeMark) {
      if (state.activeMark) state.activeMark.classList.remove('is-active');
      if (activeMark) activeMark.classList.add('is-active');
      state.activeMark = activeMark;
    }
    var text = state.root.getAttribute('data-wb-chart-help') || '';
    if (selection) {
      var item = state.data.series[selection.series];
      text = item.label + ' — ' + state.data.labels[selection.index] + ': ' + item.display[selection.index];
    }
    if (state.readout.textContent !== text) state.readout.textContent = text;
    if (notify && selection) emit(state.root, 'select', {
      index: selection.index, series: selection.series,
      label: state.data.labels[selection.index], value: state.data.series[selection.series].values[selection.index]
    });
  }

  function selectFromPointer(state, event) {
    if (!state.geometry || !state.data.labels.length) return;
    var rect = state.svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var mark = event.target.closest && event.target.closest('.wb-chart-mark');
    if (mark && state.svg.contains(mark)) {
      announce(state, { index: Number(mark.getAttribute('data-index')), series: Number(mark.getAttribute('data-series')) }, false);
      return;
    }
    var g = state.geometry;
    var x = (event.clientX - rect.left) * g.width / rect.width;
    var y = (event.clientY - rect.top) * g.height / rect.height;
    if (x < g.left || x > g.right || y < g.top || y > g.bottom) return;
    var index = Math.max(0, Math.min(state.data.labels.length - 1, Math.round((x - g.left) / g.slot - .5)));
    var candidates = state.data.series.map(function (item, s) { return { series: s, value: item.values[index] }; })
      .filter(function (item) { return item.value !== null; });
    if (!candidates.length) { announce(state, null, false); return; }
    candidates.sort(function (a, b) { return Math.abs(g.y(a.value) - y) - Math.abs(g.y(b.value) - y); });
    announce(state, { index: index, series: candidates[0].series }, false);
  }

  function keyboard(state, event) {
    if (!state.geometry || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Escape'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Escape') { announce(state, null, false); return; }
    var current = state.selection;
    var series = current ? current.series : state.data.series.findIndex(function (item) { return item.values.some(function (value) { return value !== null; }); });
    var index = current ? current.index : -1;
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      var direction = event.key === 'ArrowUp' ? -1 : 1;
      for (var s = 1; s <= state.data.series.length; s++) {
        var next = (series + direction * s + state.data.series.length) % state.data.series.length;
        var at = Math.max(0, index);
        if (state.data.series[next].values[at] !== null) { announce(state, { series: next, index: at }, true); return; }
      }
      return;
    }
    var reverse = event.key === 'ArrowLeft' || event.key === 'End';
    var step = reverse ? -1 : 1;
    var start = event.key === 'Home' ? 0 : event.key === 'End' ? state.data.labels.length - 1 : index < 0 ? (reverse ? state.data.labels.length - 1 : 0) : index + step;
    for (var i = start; i >= 0 && i < state.data.labels.length; i += step) {
      if (state.data.series[series].values[i] !== null) { announce(state, { series: series, index: i }, true); return; }
    }
  }

  function render(state) {
    var root = state.root;
    state.svg.replaceChildren();
    state.legend.replaceChildren();
    state.marks = [];
    state.activeMark = null;
    state.geometry = null;
    var domain = scale(state.data.series);
    state.viewport.hidden = !domain;
    state.legend.hidden = !domain;
    root.classList.toggle('is-empty', !domain);
    if (!domain) {
      state.readout.textContent = root.getAttribute('data-wb-chart-empty') || '';
      state.selection = null;
      return;
    }
    var width = Math.max(320, state.viewport.clientWidth || 640);
    var height = Math.max(200, state.viewport.clientHeight || 288);
    var format = formatter(root);
    var left = Math.min(140, Math.max(48, ...domain.ticks.map(function (tick) { return format(tick).length * 7 + 16; })));
    var right = width - 16;
    var top = 16;
    var bottom = height - 44;
    var slot = (right - left) / Math.max(1, state.data.labels.length);
    var x = function (i) { return left + (i + .5) * slot; };
    var y = function (v) { return bottom - (v - domain.min) / (domain.max - domain.min) * (bottom - top); };
    state.geometry = { width: width, height: height, left: left, right: right, top: top, bottom: bottom, slot: slot, y: y };
    state.svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    domain.ticks.forEach(function (tick) {
      state.svg.append(node('line', { x1: left, y1: y(tick), x2: right, y2: y(tick), class: tick === 0 ? 'wb-chart-axis' : 'wb-chart-grid' }, undefined, true));
      state.svg.append(node('text', { x: left - 8, y: y(tick) + 4, 'text-anchor': 'end', class: 'wb-chart-label' }, format(tick), true));
    });
    var longest = Math.max(1, ...state.data.labels.map(function (label) { return Math.min(18, label.length); }));
    var interval = Math.max(1, Math.ceil(longest * 7 / slot));
    state.data.labels.forEach(function (label, i) {
      if (i % interval !== 0) return;
      var halfLabel = Math.min(18, label.length) * 3.5;
      var labelX = Math.max(halfLabel + 4, Math.min(width - halfLabel - 4, x(i)));
      var text = node('text', { x: labelX, y: bottom + 24, 'text-anchor': 'middle', class: 'wb-chart-label' }, label.length > 18 ? label.slice(0, 17) + '…' : label, true);
      text.append(node('title', {}, label, true));
      state.svg.append(text);
    });
    state.data.series.forEach(function (item, s) {
      var group = node('g', { class: 'wb-chart-series wb-chart-series-' + (s + 1) }, undefined, true);
      var path = '';
      var connected = false;
      item.values.forEach(function (value, i) {
        if (value === null) { connected = false; return; }
        if (state.data.type === 'line') {
          path += (connected ? ' L ' : ' M ') + x(i) + ' ' + y(value);
          connected = true;
        }
      });
      if (state.data.type === 'line') group.append(node('path', { d: path, class: 'wb-chart-line' }, undefined, true));
      item.values.forEach(function (value, i) {
        if (value === null) return;
        var attributes = { class: 'wb-chart-mark', 'data-index': i, 'data-series': s };
        var mark;
        if (state.data.type === 'bar') {
          var barWidth = slot * .72 / state.data.series.length;
          mark = node('rect', Object.assign(attributes, {
            x: x(i) - slot * .36 + s * barWidth, y: Math.min(y(0), y(value)),
            width: Math.max(.1, barWidth - Math.min(2, barWidth * .1)), height: Math.abs(y(value) - y(0))
          }), undefined, true);
        } else {
          mark = node('circle', Object.assign(attributes, { cx: x(i), cy: y(value), r: 3 }), undefined, true);
        }
        mark.append(node('title', {}, item.label + ' — ' + state.data.labels[i] + ': ' + item.display[i], true));
        group.append(mark);
        state.marks.push(mark);
      });
      state.svg.append(group);
      var legendItem = node('li', { class: 'wb-chart-series wb-chart-series-' + (s + 1) });
      var swatch = node('svg', { class: 'wb-chart-swatch', viewBox: '0 0 24 8', 'aria-hidden': 'true', focusable: 'false' }, undefined, true);
      swatch.append(state.data.type === 'line'
        ? node('path', { d: 'M 0 4 L 24 4', class: 'wb-chart-line' }, undefined, true)
        : node('rect', { x: 0, y: 1, width: 24, height: 6, fill: 'currentColor' }, undefined, true));
      legendItem.append(swatch);
      legendItem.append(document.createTextNode(item.label));
      state.legend.append(legendItem);
    });
    announce(state, state.selection, false);
  }

  function update(root) {
    var state = instances.get(root);
    if (!state) return initOne(root);
    try {
      state.data = read(root);
      state.selection = null;
      state.viewport.setAttribute('aria-label', state.data.label);
      root.classList.remove('is-invalid');
      render(state);
      root.classList.add('is-ready');
      emit(root, 'ready', { type: state.data.type, rows: state.data.labels.length });
      return true;
    } catch (error) {
      root.classList.remove('is-ready', 'is-empty');
      root.classList.add('is-invalid');
      state.viewport.hidden = true;
      state.legend.hidden = true;
      state.geometry = null;
      state.readout.textContent = root.getAttribute('data-wb-chart-error') || '';
      emit(root, 'error', { code: error.message });
      return false;
    }
  }

  function initOne(root) {
    if (instances.has(root)) return update(root);
    var id = 'wb-chart-' + (++serial);
    var content = node('div', { class: 'wb-chart-content' });
    var viewport = node('div', { class: 'wb-chart-viewport', tabindex: '0', role: 'group', 'aria-describedby': id + '-help ' + id + '-value' });
    var svg = node('svg', { class: 'wb-chart-svg', 'aria-hidden': 'true', focusable: 'false' }, undefined, true);
    var help = node('p', { id: id + '-help', class: 'wb-sr-only' }, root.getAttribute('data-wb-chart-help') || '');
    var readout = node('p', { id: id + '-value', class: 'wb-chart-readout', role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' });
    var legend = node('ul', { class: 'wb-chart-legend' });
    viewport.append(svg);
    content.append(viewport, help, legend, readout);
    root.prepend(content);
    var state = { root: root, content: content, viewport: viewport, svg: svg, legend: legend, readout: readout, marks: [], selection: null };
    instances.set(root, state);
    viewport.addEventListener('keydown', function (event) { keyboard(state, event); });
    viewport.addEventListener('pointermove', function (event) { if (event.pointerType !== 'touch') selectFromPointer(state, event); });
    viewport.addEventListener('pointerdown', function (event) { selectFromPointer(state, event); });
    var ready = update(root);
    if (window.ResizeObserver) {
      var lastWidth = 0;
      var lastHeight = 0;
      state.observer = new ResizeObserver(function () {
        var width = viewport.clientWidth;
        var height = viewport.clientHeight;
        if (width > 0 && height > 0 && (width !== lastWidth || height !== lastHeight)) {
          lastWidth = width;
          lastHeight = height;
          if (root.classList.contains('is-ready')) render(state);
        }
      });
      state.observer.observe(viewport);
    }
    return ready;
  }

  function init(scope) {
    scope = scope || document;
    if (scope.matches && scope.matches('[data-wb-chart]')) initOne(scope);
    scope.querySelectorAll('[data-wb-chart]').forEach(initOne);
  }

  function destroy(root) {
    var state = instances.get(root);
    if (!state) return;
    if (state.observer) state.observer.disconnect();
    state.content.remove();
    root.classList.remove('is-ready', 'is-empty', 'is-invalid');
    instances.delete(root);
    emit(root, 'destroy', {});
  }

  window.WBChart = { init: init, update: update, destroy: destroy };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
})();
