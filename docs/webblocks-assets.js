(function () {
  'use strict';

  var search = new URLSearchParams(window.location.search);
  var useLocalAssets = search.get('assets') === 'local';
  var assetMode = useLocalAssets ? 'local' : 'cdn';
  var base = useLocalAssets
    ? '../packages/webblocks/dist/'
    : 'https://cdn.jsdelivr.net/gh/fklavyenet/webblocks-ui@master/packages/webblocks/dist/';

  var head = document.head;
  var assets = [
    { rel: 'stylesheet', href: base + 'webblocks-ui.css' },
    { rel: 'stylesheet', href: base + 'webblocks-icons.css' }
  ];

  assets.forEach(function (asset) {
    var link = document.createElement('link');
    link.rel = asset.rel;
    link.href = asset.href;
    head.appendChild(link);
  });

  var script = document.createElement('script');
  script.src = base + 'webblocks-ui.js';
  script.defer = true;
  head.appendChild(script);

  document.documentElement.setAttribute('data-wb-assets', assetMode);
})();
