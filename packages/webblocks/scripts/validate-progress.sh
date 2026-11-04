#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
for file in "$ROOT/src/css/primitives/loading.css" "$ROOT/dist/webblocks-ui.css"; do
  for selector in 'progress.wb-progress-bar {' 'progress.wb-progress-bar::-webkit-progress-bar {' 'progress.wb-progress-bar::-webkit-progress-value {' 'progress.wb-progress-bar::-moz-progress-bar {' 'progress.wb-progress-bar:indeterminate {' 'progress.wb-progress-bar-success ' 'progress.wb-progress-bar-warning ' 'progress.wb-progress-bar-danger ' '.wb-progress-bar-fill {' '.wb-progress-bar-indeterminate .wb-progress-bar-fill {'; do
    grep -Fq "$selector" "$file" || { echo "Progress rule missing: $selector" >&2; exit 1; }
  done
done
for locale in '' de/ tr/; do
  file="$ROOT/../../docs/${locale}progress.html"
  for markup in 'max="100" value="0"' 'max="100" value="100"' 'max="100" value="60"' '<progress id="upload-pending" class="wb-progress-bar"></progress>' 'wb-progress-bar-thin' 'wb-progress-bar-thick' '<label for='; do
    grep -Fq "$markup" "$file" || { echo "Progress example missing: $markup" >&2; exit 1; }
  done
  if grep -Eq '<script|style=|role="progressbar"|aria-valuenow=| min=' "$file"; then
    echo 'Native progress examples must preserve script-free native values and semantics.' >&2; exit 1
  fi
done
printf 'Progress validation passed: native engine rules, legacy selectors, built assets and script-free localized examples.\n'
