(function () {
  'use strict';

  var assetMode = 'local';
  var base = '../packages/webblocks/dist/';
  var brandingBase = '../assets/branding/';

  var head = document.head;
  var assets = [
    { rel: 'stylesheet', href: base + 'webblocks-ui.css' },
    { rel: 'stylesheet', href: base + 'webblocks-icons.css' },
    { rel: 'icon', href: brandingBase + 'favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { rel: 'icon', href: brandingBase + 'favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { rel: 'apple-touch-icon', href: brandingBase + 'apple-touch-icon.png', sizes: '180x180' },
    { rel: 'manifest', href: brandingBase + 'site.webmanifest' }
  ];

  assets.forEach(function (asset) {
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

  var docsStyle = document.createElement('style');
  docsStyle.textContent = '.wb-dashboard-shell > .wb-sidebar{--wb-sidebar-w:320px;}';
  head.appendChild(docsStyle);

  var script = document.createElement('script');
  script.src = base + 'webblocks-ui.js';
  script.defer = true;
  head.appendChild(script);

  document.documentElement.setAttribute('data-wb-assets', assetMode);
})();
