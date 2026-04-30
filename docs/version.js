(function () {
  'use strict';

  var version = '2.4.0';
  var versionTag = 'v2.4.0';

  function applyVersion() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-webblocks-version]'), function (node) {
      node.textContent = version;
    });
  }

  window.WebBlocksVersion = version;
  window.WebBlocksVersionTag = versionTag;
  document.documentElement.setAttribute('data-webblocks-version', version);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyVersion);
  } else {
    applyVersion();
  }
})();
