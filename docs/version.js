(function () {
  'use strict';

  var version = '2.16.2';
  var versionTag = 'v2.16.2';

  function applyVersion() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-webblocks-version]'), function (element) {
      element.textContent = version;
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
