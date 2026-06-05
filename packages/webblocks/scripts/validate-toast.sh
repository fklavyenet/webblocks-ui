#!/usr/bin/env bash
# WebBlocks UI — shell-only toast contract validation.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CSS="$ROOT/src/css/primitives/toast.css"
JS="$ROOT/src/js/toast.js"
INTEGRATION="$ROOT/INTEGRATION.md"

fail() {
  echo "Toast validation failed: $1" >&2
  exit 1
}

assert_contains() {
  local file="$1"
  local needle="$2"
  local message="$3"

  grep -Fq "$needle" "$file" || fail "$message"
}

[ -s "$CSS" ] || fail "missing toast CSS at $CSS"
[ -s "$JS" ] || fail "missing toast JS at $JS"
[ -s "$INTEGRATION" ] || fail "missing integration guide at $INTEGRATION"

assert_contains "$CSS" ".wb-toast-container {" "Toast container styles are missing"
assert_contains "$CSS" "top: var(--wb-s6);" "Default toast container must stay top-aligned"
assert_contains "$CSS" "right: var(--wb-s6);" "Default toast container must stay right-aligned"
assert_contains "$CSS" ".wb-toast-container-bottom-right" "Bottom-right compatibility class is missing"
assert_contains "$CSS" "@media (prefers-reduced-motion: reduce)" "Reduced-motion toast handling is missing"

assert_contains "$JS" "DEFAULT_TRANSIENT_DURATION = 6000" "Transient toast timeout default must stay 6 seconds"
assert_contains "$JS" "TRANSIENT_TYPES = { success: true, info: true }" "Success/info toasts must be transient by default"
assert_contains "$JS" "PERSISTENT_TYPES = { warning: true, danger: true, error: true }" "Warning/error toasts must stay persistent by default"
assert_contains "$JS" "position || 'top-right'" "Programmatic toast container default must stay top-right"
assert_contains "$JS" "'data-wb-toast-timeout'" "Declarative timeout attribute support is missing"
assert_contains "$JS" "'data-wb-auto-dismiss'" "Declarative auto-dismiss opt-out support is missing"
assert_contains "$JS" "document.addEventListener('DOMContentLoaded'" "Server-rendered toasts must initialize on DOM ready"
assert_contains "$JS" "new MutationObserver" "Dynamically inserted toasts must initialize"
assert_contains "$JS" "[data-wb-dismiss=\"toast\"], .wb-toast-close" "Toast close button delegation must be preserved"
assert_contains "$JS" "window.WBToast = {" "Public toast API is missing"
assert_contains "$JS" "initAll: initAll" "Public toast initialization API is missing"

assert_contains "$INTEGRATION" "data-wb-toast-timeout" "Integration docs must document toast timeout control"
assert_contains "$INTEGRATION" "data-wb-auto-dismiss=\"false\"" "Integration docs must document persistent toast opt-out"
assert_contains "$INTEGRATION" "success and info toasts auto-dismiss" "Integration docs must state transient success/info behavior"

echo "Toast validation passed."
