#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
for file in "${ROOT}/src/css/primitives/meter.css" "${ROOT}/dist/webblocks-ui.css"; do
  for selector in 'meter.wb-meter {' 'meter.wb-meter::-webkit-meter-bar {' 'meter.wb-meter::-webkit-meter-optimum-value,' 'meter.wb-meter::-webkit-meter-suboptimum-value,' 'meter.wb-meter::-webkit-meter-even-less-good-value {' 'meter.wb-meter::-moz-meter-bar {'; do
    grep -Fq "$selector" "$file" || { echo "Meter native-engine styling missing: $selector" >&2; exit 1; }
  done
done
for locale in '' de/ tr/; do
  file="${ROOT}/../../docs/${locale}meter.html"
  for attribute in 'min="0" max="100" value="0"' 'min="0" max="100" value="100"' 'aria-labelledby=' 'aria-valuetext='; do
    grep -Fq "$attribute" "$file" || { echo "Meter example contract missing: $attribute" >&2; exit 1; }
  done
  if grep -Eq '<script|style=|role="progressbar"|data-wb-meter' "$file"; then
    echo 'Meter examples must preserve native, script-free measurement semantics.' >&2; exit 1
  fi
done
printf 'Meter validation passed: native engine rules, built distribution, accessible names, zero/full examples and no-script boundary.\n'
