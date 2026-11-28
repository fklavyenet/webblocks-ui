/* WebBlocks UI — compatibility entry point. WBActionFeedback owns the single
   request registry and delegated data-wb-busy / data-wb-busy-label hooks. */
(function () {
  'use strict';
  function bind(root) { window.WBActionFeedback.bind(root); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { bind(); });
  else bind();
  window.WBBusySubmit = { bind: bind };
}());
