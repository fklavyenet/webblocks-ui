(function () {
  'use strict';

  var base = '../packages/webblocks/dist/';
  var brandingBase = '../assets/branding/';

  var assets = {
    css: base + 'webblocks-ui.css',
    icons: base + 'webblocks-icons.css',
    js: base + 'webblocks-ui.js'
  };

  var head = document.head;

  [
    { rel: 'stylesheet', href: assets.css },
    { rel: 'stylesheet', href: assets.icons },
    { rel: 'icon', href: brandingBase + 'favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { rel: 'icon', href: brandingBase + 'favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { rel: 'apple-touch-icon', href: brandingBase + 'apple-touch-icon.png', sizes: '180x180' },
    { rel: 'manifest', href: brandingBase + 'site.webmanifest' }
  ].forEach(function (asset) {
    var link = document.createElement('link');
    link.rel = asset.rel;
    link.href = asset.href;
    if (asset.sizes) {
      link.sizes = asset.sizes;
    }
    if (asset.type) {
      link.type = asset.type;
    }
    head.appendChild(link);
  });

  var themeColor = document.createElement('meta');
  themeColor.name = 'theme-color';
  themeColor.content = '#0b1020';
  head.appendChild(themeColor);

  var script = document.createElement('script');
  script.src = assets.js;
  script.defer = true;
  head.appendChild(script);

  window.WebBlocksAssets = assets;
  document.documentElement.setAttribute('data-wb-assets', 'local');
})();
