#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "$ROOT/../.." && pwd)"
SOURCE="$ROOT/src/js/clipboard.js"
DIST="$ROOT/dist/webblocks-ui.js"

fail() {
  echo "Clipboard validation failed: $1" >&2
  exit 1
}

require_text() {
  grep -Fq -- "$2" "$1" || fail "$1 is missing: $2"
}

test -s "$SOURCE" || fail "missing source runtime"
test -s "$DIST" || fail "missing dist runtime"

require_text "$SOURCE" "var BUTTON_SELECTOR = '[data-wb-copy]'"
require_text "$SOURCE" "navigator.clipboard.writeText(text)"
require_text "$SOURCE" "data-wb-copy-empty"
require_text "$SOURCE" "data-wb-copy-success"
require_text "$SOURCE" "data-wb-copy-error"
require_text "$SOURCE" "target.tagName === 'INPUT'"
require_text "$SOURCE" "target.textContent"
require_text "$SOURCE" "document.addEventListener('input'"
require_text "$SOURCE" "document.addEventListener('change'"
require_text "$DIST" "WebBlocks UI — Clipboard (WBClipboard)"
require_text "$DIST" "data-wb-copy-status"
require_text "$ROOT/INTEGRATION.md" "Clipboard rule"
require_text "$REPO_ROOT/docs/primitives.html" "data-wb-copy"
require_text "$REPO_ROOT/docs/de/primitives.html" "data-wb-copy-success=\"Passwort kopiert.\""
require_text "$REPO_ROOT/docs/tr/primitives.html" "data-wb-copy-success=\"Parola kopyalandı.\""
require_text "$ROOT/CHANGELOG.md" 'rename the hooks to `data-wb-password-generate` / `data-wb-copy`'

if grep -Fq "execCommand" "$SOURCE"; then
  fail "source must not use legacy clipboard fallback"
fi

echo "Clipboard validation passed."
