(function () {
  'use strict';

  var isSandboxPath = window.location.pathname.indexOf('/playground/sandbox/') !== -1;
  var base = isSandboxPath ? '../../packages/webblocks/dist/' : '../packages/webblocks/dist/';

  var assets = {
    css: base + 'webblocks-ui.css',
    icons: base + 'webblocks-icons.css',
    js: base + 'webblocks-ui.js'
  };

  var head = document.head;

  [
    { rel: 'stylesheet', href: assets.css },
    { rel: 'stylesheet', href: assets.icons }
  ].forEach(function (asset) {
    var link = document.createElement('link');
    link.rel = asset.rel;
    link.href = asset.href;
    head.appendChild(link);
  });

  var script = document.createElement('script');
  script.src = assets.js;
  script.defer = true;
  head.appendChild(script);

  window.WebBlocksAssets = assets;
  document.documentElement.setAttribute('data-wb-assets', 'local');
})();
