(function () {
  'use strict';

  var version = '2.4.3';
  var versionTag = 'v2.4.3';

  function applyVersion() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-webblocks-version]'), function (node) {
      node.textContent = version;
    });
  }

  window.WebBlocksVersion = version;
  window.WebBlocksVersionTag = versionTag;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyVersion);
  } else {
    applyVersion();
  }
})();
