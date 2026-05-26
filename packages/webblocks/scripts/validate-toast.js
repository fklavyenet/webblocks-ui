#!/usr/bin/env node
/* eslint-env node */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'src/css/primitives/toast.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'src/js/toast.js'), 'utf8');
const integration = fs.readFileSync(path.join(root, 'INTEGRATION.md'), 'utf8');

function assertContains(source, needle, message) {
  if (!source.includes(needle)) {
    throw new Error(message || `Missing expected content: ${needle}`);
  }
}

assertContains(css, '.wb-toast-container {', 'Toast container styles are missing');
assertContains(css, 'top: var(--wb-s6);', 'Default toast container must stay top-aligned');
assertContains(css, 'right: var(--wb-s6);', 'Default toast container must stay right-aligned');
assertContains(css, '.wb-toast-container-bottom-right', 'Bottom-right compatibility class is missing');
assertContains(css, '@media (prefers-reduced-motion: reduce)', 'Reduced-motion toast handling is missing');

assertContains(js, 'DEFAULT_TRANSIENT_DURATION = 6000', 'Transient toast timeout default must stay 6 seconds');
assertContains(js, 'TRANSIENT_TYPES = { success: true, info: true }', 'Success/info toasts must be transient by default');
assertContains(js, 'PERSISTENT_TYPES = { warning: true, danger: true, error: true }', 'Warning/error toasts must stay persistent by default');
assertContains(js, "position || 'top-right'", 'Programmatic toast container default must stay top-right');
assertContains(js, "'data-wb-toast-timeout'", 'Declarative timeout attribute support is missing');
assertContains(js, "'data-wb-auto-dismiss'", 'Declarative auto-dismiss opt-out support is missing');
assertContains(js, 'document.addEventListener(\'DOMContentLoaded\'', 'Server-rendered toasts must initialize on DOM ready');
assertContains(js, 'new MutationObserver', 'Dynamically inserted toasts must initialize');
assertContains(js, "[data-wb-dismiss=\"toast\"], .wb-toast-close", 'Toast close button delegation must be preserved');
assertContains(js, 'window.WBToast = {', 'Public toast API is missing');
assertContains(js, 'initAll: initAll', 'Public toast initialization API is missing');

assertContains(integration, 'data-wb-toast-timeout', 'Integration docs must document toast timeout control');
assertContains(integration, 'data-wb-auto-dismiss="false"', 'Integration docs must document persistent toast opt-out');
assertContains(integration, 'success and info toasts auto-dismiss', 'Integration docs must state transient success/info behavior');

console.log('Toast validation passed.');
