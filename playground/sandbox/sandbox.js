(function () {
  'use strict';

  var STORAGE_KEYS = {
    html: 'wbSandboxHtml',
    example: 'wbSandboxExample',
    width: 'wbSandboxWidth'
  };

  var WIDTH_LABELS = {
    desktop: 'Desktop preview',
    tablet: 'Tablet preview',
    mobile: 'Mobile preview'
  };

  var ROOT_ATTRIBUTE_NAMES = [
    'data-mode',
    'data-accent',
    'data-preset',
    'data-radius',
    'data-density',
    'data-shadow',
    'data-font',
    'data-border'
  ];

  var ALLOWED_LINK_PATTERN = /^(https?:|mailto:|tel:|#|\/|\.\/|\.\.\/|\?)/i;
  var UNKNOWN_CLASS_LIMIT = 10;
  var PREVIEW_DEBOUNCE_MS = 220;

  var EXAMPLES = [
    {
      id: 'simple-card',
      label: 'Simple card',
      html: [
        '<div class="wb-card">',
        '  <div class="wb-card-body wb-stack-4">',
        '    <div class="wb-stack-2">',
        '      <span class="wb-badge wb-badge-success">Shipped primitive</span>',
        '      <h2 class="wb-m-0">Quarterly revenue snapshot</h2>',
        '      <p class="wb-m-0 wb-text-muted">Review the latest pipeline updates before the Monday planning call.</p>',
        '    </div>',
        '    <div class="wb-cluster wb-cluster-2">',
        '      <button class="wb-btn wb-btn-primary">Open report</button>',
        '      <button class="wb-btn wb-btn-outline">Share</button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n')
    },
    {
      id: 'form-fields',
      label: 'Form fields',
      html: [
        '<div class="wb-card">',
        '  <div class="wb-card-body wb-stack-4">',
        '    <div class="wb-stack-2">',
        '      <h2 class="wb-m-0">Invite teammate</h2>',
        '      <p class="wb-m-0 wb-text-muted">Send a secure workspace invite with a role and review step.</p>',
        '    </div>',
        '    <div class="wb-stack-3">',
        '      <label class="wb-stack-2">',
        '        <span class="wb-label">Email address</span>',
        '        <input class="wb-input" type="email" placeholder="name@company.com">',
        '      </label>',
        '      <label class="wb-stack-2">',
        '        <span class="wb-label">Role</span>',
        '        <select class="wb-select">',
        '          <option>Editor</option>',
        '          <option>Admin</option>',
        '          <option>Billing</option>',
        '        </select>',
        '      </label>',
        '      <label class="wb-stack-2">',
        '        <span class="wb-label">Team slug</span>',
        '        <div class="wb-input-group">',
        '          <span class="wb-input-addon">acme.app/</span>',
        '          <input class="wb-input" type="text" value="ops-team">',
        '        </div>',
        '      </label>',
        '      <p class="wb-field-error wb-m-0">Review access scope before sending the invitation.</p>',
        '      <div class="wb-cluster wb-cluster-2">',
        '        <button class="wb-btn wb-btn-primary">Send invite</button>',
        '        <button class="wb-btn wb-btn-ghost">Save draft</button>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n')
    },
    {
      id: 'auth-card',
      label: 'Auth card',
      html: [
        '<div class="wb-auth-shell">',
        '  <div class="wb-auth-card">',
        '    <div class="wb-auth-header">',
        '      <span class="wb-icon-wrap wb-icon-wrap-info wb-icon-wrap-circle"><i class="wb-icon wb-icon-lock"></i></span>',
        '      <div>',
        '        <h2 class="wb-auth-header-title">Sign in to WebBlocks UI</h2>',
        '        <p class="wb-auth-header-subtitle">Use your workspace email to continue.</p>',
        '      </div>',
        '    </div>',
        '    <div class="wb-auth-body wb-stack-3">',
        '      <label class="wb-stack-2">',
        '        <span class="wb-label">Email</span>',
        '        <input class="wb-input" type="email" placeholder="hello@company.com">',
        '      </label>',
        '      <label class="wb-stack-2">',
        '        <span class="wb-label">Password</span>',
        '        <input class="wb-input" type="password" placeholder="••••••••">',
        '      </label>',
        '      <div class="wb-split">',
        '        <label class="wb-switch">',
        '          <input type="checkbox" checked>',
        '          <span class="wb-switch-track"></span>',
        '          <span>Remember me</span>',
        '        </label>',
        '        <a href="#">Forgot password?</a>',
        '      </div>',
        '      <button class="wb-btn wb-btn-primary wb-block">Sign in</button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n')
    },
    {
      id: 'toolbar-header',
      label: 'Toolbar / header',
      html: [
        '<div class="wb-stack-4">',
        '  <div class="wb-page-header">',
        '    <div class="wb-page-header-main">',
        '      <nav class="wb-page-breadcrumb" aria-label="Breadcrumb">',
        '        <ol class="wb-breadcrumb wb-breadcrumb-minimal">',
        '          <li class="wb-breadcrumb-item"><a href="#">Workspace</a></li>',
        '          <li class="wb-breadcrumb-item is-active"><span aria-current="page">Deployments</span></li>',
        '        </ol>',
        '      </nav>',
        '      <div>',
        '        <h1 class="wb-page-header-title">Deployments</h1>',
        '        <p class="wb-page-subtitle">Track release health, approvals, and rollback status in one view.</p>',
        '      </div>',
        '    </div>',
        '    <div class="wb-page-actions wb-cluster wb-cluster-2">',
        '      <button class="wb-btn wb-btn-outline">Export</button>',
        '      <button class="wb-btn wb-btn-primary">Create deployment</button>',
        '    </div>',
        '  </div>',
        '  <div class="wb-toolbar">',
        '    <div class="wb-toolbar-start">',
        '      <div>',
        '        <div class="wb-toolbar-title">Production timeline</div>',
        '        <div class="wb-toolbar-subtitle">Live deployment queue for the current release window.</div>',
        '      </div>',
        '    </div>',
        '    <div class="wb-toolbar-end wb-cluster wb-cluster-2">',
        '      <button class="wb-btn wb-btn-ghost wb-btn-sm">Filter</button>',
        '      <button class="wb-btn wb-btn-outline wb-btn-sm">Compare</button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n')
    },
    {
      id: 'dashboard-stats',
      label: 'Dashboard stats row',
      html: [
        '<div class="wb-stack-4">',
        '  <div class="wb-page-header">',
        '    <div class="wb-page-header-main">',
        '      <div>',
        '        <h1 class="wb-page-header-title">Operations overview</h1>',
        '        <p class="wb-page-subtitle">A quick view of the signals most teams check at the start of the day.</p>',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <div class="wb-grid-3">',
        '    <div class="wb-stat">',
        '      <div class="wb-stat-label">Net revenue</div>',
        '      <div class="wb-stat-value">$84.2k</div>',
        '      <div class="wb-stat-delta">+12.4% vs last month</div>',
        '    </div>',
        '    <div class="wb-stat">',
        '      <div class="wb-stat-label">Failed jobs</div>',
        '      <div class="wb-stat-value">7</div>',
        '      <div class="wb-stat-delta">2 need immediate attention</div>',
        '    </div>',
        '    <div class="wb-stat">',
        '      <div class="wb-stat-label">Median response</div>',
        '      <div class="wb-stat-value">182ms</div>',
        '      <div class="wb-stat-delta">Healthy against the 250ms target</div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n')
    },
    {
      id: 'table',
      label: 'Table',
      html: [
        '<div class="wb-table-wrap">',
        '  <div class="wb-toolbar wb-toolbar-sm">',
        '    <div class="wb-toolbar-start">',
        '      <div>',
        '        <div class="wb-toolbar-title">Recent invoices</div>',
        '        <div class="wb-toolbar-subtitle">Simple table surface with a control row above it.</div>',
        '      </div>',
        '    </div>',
        '    <div class="wb-toolbar-end wb-cluster wb-cluster-2">',
        '      <button class="wb-btn wb-btn-ghost wb-btn-sm">Filter</button>',
        '      <button class="wb-btn wb-btn-outline wb-btn-sm">Export CSV</button>',
        '    </div>',
        '  </div>',
        '  <table class="wb-table wb-table-striped">',
        '    <thead>',
        '      <tr>',
        '        <th>Customer</th>',
        '        <th>Status</th>',
        '        <th>Amount</th>',
        '        <th>Due date</th>',
        '      </tr>',
        '    </thead>',
        '    <tbody>',
        '      <tr><td>Northwind</td><td><span class="wb-badge wb-badge-success">Paid</span></td><td>$4,800</td><td>Apr 03</td></tr>',
        '      <tr><td>Orchid Labs</td><td><span class="wb-badge">Pending</span></td><td>$1,240</td><td>Apr 08</td></tr>',
        '      <tr><td>Bridge Studio</td><td><span class="wb-badge">Draft</span></td><td>$920</td><td>Apr 12</td></tr>',
        '    </tbody>',
        '  </table>',
        '</div>'
      ].join('\n')
    },
    {
      id: 'empty-state',
      label: 'Empty state',
      html: [
        '<div class="wb-card">',
        '  <div class="wb-card-body">',
        '    <div class="wb-empty">',
        '      <div class="wb-empty-icon"><i class="wb-icon wb-icon-folder-open"></i></div>',
        '      <h2 class="wb-empty-title">No saved snippets yet</h2>',
        '      <p class="wb-empty-text">Start from a shipped example, tweak the HTML, and keep the version you want to reuse in your app.</p>',
        '      <div class="wb-empty-action">',
        '        <button class="wb-btn wb-btn-primary">Create first snippet</button>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n')
    },
    {
      id: 'layout-demo',
      label: 'Stack / cluster / split demo',
      html: [
        '<div class="wb-stack-6">',
        '  <div class="wb-card">',
        '    <div class="wb-card-body wb-stack-4">',
        '      <div class="wb-stack-2">',
        '        <h2 class="wb-m-0">Layout primitives in one snippet</h2>',
        '        <p class="wb-m-0 wb-text-muted">Use this example to see how stack rhythm, cluster wrapping, and split alignment behave together.</p>',
        '      </div>',
        '      <div class="wb-cluster wb-cluster-2">',
        '        <span class="wb-badge">Cluster item</span>',
        '        <span class="wb-badge">Another item</span>',
        '        <span class="wb-badge">Wraps when narrow</span>',
        '      </div>',
        '      <div class="wb-split">',
        '        <div class="wb-stack-2">',
        '          <strong>Split start</strong>',
        '          <p class="wb-m-0 wb-text-muted">The first child grows to fill the available width.</p>',
        '        </div>',
        '        <button class="wb-btn wb-btn-outline wb-btn-sm">Split action</button>',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <div class="wb-grid-auto">',
        '    <div class="wb-card"><div class="wb-card-body">Auto grid card A</div></div>',
        '    <div class="wb-card"><div class="wb-card-body">Auto grid card B</div></div>',
        '    <div class="wb-card"><div class="wb-card-body">Auto grid card C</div></div>',
        '  </div>',
        '</div>'
      ].join('\n')
    }
  ];

  var state = {
    currentExample: EXAMPLES[0].id,
    width: 'desktop',
    knownClasses: null,
    previewHeight: 640
  };

  var previewTimer = null;

  var elements = {
    example: document.querySelector('[data-sandbox-example]'),
    editor: document.querySelector('[data-sandbox-editor]'),
    preview: document.querySelector('[data-sandbox-preview]'),
    stage: document.querySelector('[data-sandbox-stage]'),
    warnings: document.querySelector('[data-sandbox-warnings]'),
    status: document.querySelector('[data-sandbox-status]'),
    widthLabel: document.querySelector('[data-sandbox-width-label]'),
    widthButtons: Array.prototype.slice.call(document.querySelectorAll('[data-sandbox-width]')),
    reset: document.querySelector('[data-sandbox-reset]'),
    copy: document.querySelector('[data-sandbox-copy]')
  };

  if (!elements.example || !elements.editor || !elements.preview) {
    return;
  }

  populateExampleSelect();
  restoreState();
  bindEvents();
  applyWidth(state.width);
  renderPreview();
  loadKnownClasses();

  function populateExampleSelect() {
    EXAMPLES.forEach(function (example) {
      var option = document.createElement('option');
      option.value = example.id;
      option.textContent = example.label;
      elements.example.appendChild(option);
    });
  }

  function restoreState() {
    var savedExample = safeReadStorage(STORAGE_KEYS.example);
    var savedWidth = safeReadStorage(STORAGE_KEYS.width);
    var savedHtml = safeReadStorage(STORAGE_KEYS.html);
    var example = getExampleById(savedExample) || EXAMPLES[0];

    state.currentExample = example.id;
    state.width = isValidWidth(savedWidth) ? savedWidth : 'desktop';

    elements.example.value = state.currentExample;
    elements.editor.value = savedHtml || example.html;
  }

  function bindEvents() {
    elements.example.addEventListener('change', function (event) {
      var example = getExampleById(event.target.value) || EXAMPLES[0];
      state.currentExample = example.id;
      elements.editor.value = example.html;
      persistState();
      renderPreview();
    });

    elements.editor.addEventListener('input', function () {
      persistState();
      schedulePreview();
    });

    elements.reset.addEventListener('click', function () {
      var example = getExampleById(state.currentExample) || EXAMPLES[0];
      elements.editor.value = example.html;
      persistState();
      renderPreview();
      setStatus('Reset to starter', 'info');
    });

    elements.copy.addEventListener('click', function () {
      copyCurrentHtml();
    });

    elements.widthButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var width = button.getAttribute('data-sandbox-width');
        if (!isValidWidth(width)) {
          return;
        }

        state.width = width;
        applyWidth(width);
        persistState();
      });
    });

    window.addEventListener('message', function (event) {
      if (!event.data || event.data.type !== 'wb-sandbox-height') {
        return;
      }

      if (typeof event.data.height === 'number' && event.data.height > 0) {
        state.previewHeight = Math.max(420, Math.min(2200, event.data.height));
        elements.preview.style.height = state.previewHeight + 'px';
      }
    });
  }

  function schedulePreview() {
    window.clearTimeout(previewTimer);
    previewTimer = window.setTimeout(function () {
      renderPreview();
    }, PREVIEW_DEBOUNCE_MS);
  }

  function renderPreview() {
    var sourceHtml = elements.editor.value;
    var sanitized = sanitizeHtml(sourceHtml);

    elements.preview.srcdoc = buildPreviewDocument(sanitized.html, sanitized.rootAttributes);
    renderWarnings(sanitized.warnings);
    setStatus(sanitized.didSanitize ? 'Sanitized preview' : 'Preview up to date', sanitized.didSanitize ? 'warning' : 'success');
    elements.preview.style.height = Math.max(420, state.previewHeight) + 'px';
    persistState();
  }

  function sanitizeHtml(input) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(input, 'text/html');
    var warnings = [];
    var unknownClasses = [];
    var rootAttributes = collectRootAttributes(doc.documentElement);
    var counters = {
      scripts: 0,
      handlers: 0,
      externalAssets: 0,
      unsafeEmbeds: 0,
      styles: 0,
      dataAttrs: 0,
      urls: 0
    };

    Array.prototype.slice.call(doc.querySelectorAll('script')).forEach(function (node) {
      counters.scripts += 1;
      node.remove();
    });

    Array.prototype.slice.call(doc.querySelectorAll('link, iframe, object, embed')).forEach(function (node) {
      if (node.tagName.toLowerCase() === 'link') {
        counters.externalAssets += 1;
      } else {
        counters.unsafeEmbeds += 1;
      }
      node.remove();
    });

    Array.prototype.slice.call(doc.querySelectorAll('style')).forEach(function (node) {
      counters.styles += 1;
      node.remove();
    });

    Array.prototype.slice.call(doc.querySelectorAll('*')).forEach(function (node) {
      sanitizeElementAttributes(node, counters);
    });

    if (state.knownClasses && state.knownClasses.size) {
      unknownClasses = detectUnknownWebBlocksClasses(doc.body, state.knownClasses);
    }

    var didSanitize = counters.scripts + counters.handlers + counters.externalAssets + counters.unsafeEmbeds + counters.styles + counters.dataAttrs + counters.urls > 0;

    if (counters.scripts) {
      warnings.push('Removed ' + counters.scripts + ' <script> tag' + pluralize(counters.scripts) + '.');
    }

    if (counters.handlers) {
      warnings.push('Removed ' + counters.handlers + ' inline event handler attribute' + pluralize(counters.handlers) + '.');
    }

    if (counters.externalAssets) {
      warnings.push('Removed ' + counters.externalAssets + ' external asset tag' + pluralize(counters.externalAssets) + ' such as stylesheet links.');
    }

    if (counters.unsafeEmbeds) {
      warnings.push('Removed ' + counters.unsafeEmbeds + ' unsafe embed element' + pluralize(counters.unsafeEmbeds) + '.');
    }

    if (counters.styles) {
      warnings.push('Removed ' + counters.styles + ' <style> tag' + pluralize(counters.styles) + ' to keep the sandbox HTML-only.');
    }

    if (counters.dataAttrs) {
      warnings.push('Removed ' + counters.dataAttrs + ' non-WebBlocks data attribute' + pluralize(counters.dataAttrs) + '.');
    }

    if (counters.urls) {
      warnings.push('Removed ' + counters.urls + ' unsafe URL attribute' + pluralize(counters.urls) + '.');
    }

    if (unknownClasses.length) {
      warnings.push('Unknown wb-* classes detected: ' + unknownClasses.join(', ') + '.');
    }

    if (didSanitize) {
      warnings.unshift('Preview content was sanitized before rendering in the iframe.');
    } else if (warnings.length) {
      warnings.unshift('Potential issues were detected, but no markup had to be removed.');
    } else {
      warnings.push('No blocking issues detected. The preview is using your current HTML as-is.');
    }

    return {
      html: doc.body.innerHTML.trim(),
      warnings: warnings,
      didSanitize: didSanitize,
      rootAttributes: rootAttributes
    };
  }

  function sanitizeElementAttributes(node, counters) {
    Array.prototype.slice.call(node.attributes).forEach(function (attribute) {
      var name = attribute.name.toLowerCase();
      var value = attribute.value;

      if (name.indexOf('on') === 0) {
        node.removeAttribute(attribute.name);
        counters.handlers += 1;
        return;
      }

      if (name === 'style' || name === 'srcdoc') {
        node.removeAttribute(attribute.name);
        counters.styles += 1;
        return;
      }

      if (name.indexOf('data-') === 0 && name.indexOf('data-wb-') !== 0) {
        node.removeAttribute(attribute.name);
        counters.dataAttrs += 1;
        return;
      }

      if ((name === 'href' || name === 'action' || name === 'formaction') && value) {
        if (!ALLOWED_LINK_PATTERN.test(value) && !isSafeRelativeUrl(value)) {
          node.removeAttribute(attribute.name);
          counters.urls += 1;
        }
      }

      if (name === 'src' && value) {
        if (!isSafeRelativeUrl(value)) {
          node.removeAttribute(attribute.name);
          counters.urls += 1;
        }
      }
    });
  }

  function collectRootAttributes(root) {
    var attributes = {};

    ROOT_ATTRIBUTE_NAMES.forEach(function (name) {
      var value = root.getAttribute(name);
      if (value) {
        attributes[name] = value;
      }
    });

    return attributes;
  }

  function buildPreviewDocument(html, rootAttributes) {
    var assets = window.WebBlocksAssets || {};
    var htmlAttributes = buildHtmlAttributes(rootAttributes);
    var safeHtml = html || '<div class="wb-card"><div class="wb-card-body"><p class="wb-m-0 wb-text-muted">The preview is empty. Add some HTML to render WebBlocks UI components here.</p></div></div>';

    return [
      '<!DOCTYPE html>',
      '<html lang="en"' + htmlAttributes + '>',
      '<head>',
      '  <meta charset="UTF-8">',
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '  <link rel="stylesheet" href="' + assets.css + '">',
      '  <link rel="stylesheet" href="' + assets.icons + '">',
      '  <style>',
      '    html { color-scheme: light dark; }',
      '    body { margin: 0; min-height: 100vh; padding: 24px; background: var(--wb-bg, #f4f6fb); color: var(--wb-text, #101828); }',
      '    body > * { box-sizing: border-box; }',
      '    img { max-width: 100%; height: auto; }',
      '  </style>',
      '</head>',
      '<body>',
      safeHtml,
      '  <script src="' + assets.js + '" defer></script>',
      '  <script>',
      '    (function () {',
      '      function postHeight() {',
      '        var height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);',
      '        parent.postMessage({ type: "wb-sandbox-height", height: height }, "*");',
      '      }',
      '      window.addEventListener("load", function () {',
      '        postHeight();',
      '        window.setTimeout(postHeight, 120);',
      '      });',
      '      window.addEventListener("resize", postHeight);',
      '      var observer = new MutationObserver(function () {',
      '        postHeight();',
      '      });',
      '      observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });',
      '    })();',
      '  </script>',
      '</body>',
      '</html>'
    ].join('\n');
  }

  function buildHtmlAttributes(rootAttributes) {
    var attributes = '';

    Object.keys(rootAttributes).forEach(function (name) {
      attributes += ' ' + name + '="' + escapeAttribute(rootAttributes[name]) + '"';
    });

    return attributes;
  }

  function renderWarnings(warnings) {
    elements.warnings.innerHTML = '';

    warnings.forEach(function (warning, index) {
      var item = document.createElement('div');
      var text = document.createElement('div');
      var title = document.createElement('span');
      var subtitle = document.createElement('span');

      item.className = 'wb-list-item';
      text.className = 'wb-list-item-text';
      title.className = 'wb-list-item-title';
      subtitle.className = 'wb-list-item-sub';

      title.textContent = index === 0 ? 'Preview status' : 'Note';
      subtitle.textContent = warning;

      text.appendChild(title);
      text.appendChild(subtitle);
      item.appendChild(text);
      elements.warnings.appendChild(item);
    });
  }

  function setStatus(label, tone) {
    elements.status.textContent = label;
    elements.status.className = 'wb-badge';

    if (tone === 'success') {
      elements.status.classList.add('wb-badge-success');
    }
  }

  function applyWidth(width) {
    elements.stage.classList.remove('is-preview-desktop', 'is-preview-tablet', 'is-preview-mobile');
    elements.stage.classList.add('is-preview-' + width);
    elements.widthLabel.textContent = WIDTH_LABELS[width] || WIDTH_LABELS.desktop;

    elements.widthButtons.forEach(function (button) {
      var buttonWidth = button.getAttribute('data-sandbox-width');
      var isActive = buttonWidth === width;

      button.classList.toggle('wb-btn-primary', isActive);
      button.classList.toggle('wb-btn-ghost', !isActive);
    });
  }

  function copyCurrentHtml() {
    var html = elements.editor.value;

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      setStatus('Clipboard unavailable', 'warning');
      return;
    }

    navigator.clipboard.writeText(html).then(function () {
      var originalLabel = elements.copy.textContent;
      elements.copy.textContent = 'Copied';
      setStatus('HTML copied', 'success');

      window.setTimeout(function () {
        elements.copy.textContent = originalLabel;
      }, 1400);
    }).catch(function () {
      setStatus('Copy failed', 'warning');
    });
  }

  function persistState() {
    safeWriteStorage(STORAGE_KEYS.html, elements.editor.value);
    safeWriteStorage(STORAGE_KEYS.example, state.currentExample);
    safeWriteStorage(STORAGE_KEYS.width, state.width);
  }

  function loadKnownClasses() {
    var assets = window.WebBlocksAssets || {};

    if (!assets.css || !window.fetch) {
      return;
    }

    fetch(assets.css, { cache: 'force-cache' }).then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to load CSS');
      }

      return response.text();
    }).then(function (css) {
      var matches = css.match(/\.wb-[a-z0-9-]+/g) || [];
      state.knownClasses = new Set(matches.map(function (value) {
        return value.slice(1);
      }));
      renderPreview();
    }).catch(function () {
      state.knownClasses = null;
    });
  }

  function detectUnknownWebBlocksClasses(root, knownClasses) {
    var unknown = new Set();

    Array.prototype.slice.call(root.querySelectorAll('[class]')).forEach(function (node) {
      node.className.split(/\s+/).forEach(function (className) {
        if (!className || className.indexOf('wb-') !== 0) {
          return;
        }

        if (!knownClasses.has(className) && unknown.size < UNKNOWN_CLASS_LIMIT) {
          unknown.add(className);
        }
      });
    });

    return Array.prototype.slice.call(unknown);
  }

  function getExampleById(id) {
    return EXAMPLES.find(function (example) {
      return example.id === id;
    }) || null;
  }

  function pluralize(count) {
    return count === 1 ? '' : 's';
  }

  function isValidWidth(width) {
    return width === 'desktop' || width === 'tablet' || width === 'mobile';
  }

  function isSafeRelativeUrl(value) {
    return value.indexOf('?') === 0 || value.indexOf('./') === 0 || value.indexOf('../') === 0 || value.indexOf('/') === 0 || value.indexOf('#') === 0;
  }

  function escapeAttribute(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function safeReadStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeWriteStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      return null;
    }
  }
})();
