(function () {
  'use strict';

  var assets = {
    css: 'https://cdn.jsdelivr.net/gh/fklavyenet/webblocks-ui@v2.3.9/packages/webblocks/dist/webblocks-ui.css',
    icons: 'https://cdn.jsdelivr.net/gh/fklavyenet/webblocks-ui@v2.3.9/packages/webblocks/dist/webblocks-icons.css',
    js: 'https://cdn.jsdelivr.net/gh/fklavyenet/webblocks-ui@v2.3.9/packages/webblocks/dist/webblocks-ui.js'
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
  document.documentElement.setAttribute('data-wb-assets', 'cdn-master');
})();
