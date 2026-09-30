#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "$ROOT/../.." && pwd)"
SOURCE="$ROOT/src/js/password-generator.js"
DIST="$ROOT/dist/webblocks-ui.js"

fail() {
  echo "Password generator validation failed: $1" >&2
  exit 1
}

require_text() {
  grep -Fq -- "$2" "$1" || fail "$1 is missing: $2"
}

test -s "$SOURCE" || fail "missing source runtime"
test -s "$DIST" || fail "missing dist runtime"

require_text "$SOURCE" "window.crypto.getRandomValues(bytes)"
require_text "$SOURCE" "Math.floor(256 / alphabet.length) * alphabet.length"
require_text "$SOURCE" "var DEFAULT_LENGTH = 20"
require_text "$SOURCE" "var MIN_LENGTH = 12"
require_text "$SOURCE" "var MAX_LENGTH = 128"
require_text "$SOURCE" "data-wb-password-confirm"
require_text "$SOURCE" "WBPasswordToggle.sync"
require_text "$SOURCE" "aria-live"
require_text "$DIST" "WebBlocks UI — Password Generator (WBPasswordGenerator)"
require_text "$DIST" "data-wb-password-generate"
require_text "$ROOT/INTEGRATION.md" "Password generation rule"
require_text "$REPO_ROOT/docs/primitives.html" "data-wb-password-generate"
require_text "$REPO_ROOT/ai/contract.md" "## Password Generation And Clipboard"

if grep -Fq "Math.random" "$SOURCE"; then
  fail "source must not use Math.random"
fi

echo "Password generator validation passed."
