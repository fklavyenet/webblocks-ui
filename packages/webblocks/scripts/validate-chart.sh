#!/usr/bin/env bash

set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE="${ROOT}/src/js/chart.js"
DIST="${ROOT}/dist/webblocks-ui.js"
DOCS="${ROOT}/../../docs/chart.html"

for file in "${SOURCE}" "${DIST}" "${DOCS}"; do
  if [ ! -s "${file}" ]; then
    printf 'Chart validation failed: missing or empty %s\n' "${file}" >&2
    exit 1
  fi
done

for fragment in 'window.WBChart = { init: init, update: update, destroy: destroy }' 'data-wb-chart' 'ResizeObserver' 'createElementNS'; do
  if ! grep -Fq "${fragment}" "${SOURCE}"; then
    printf 'Chart validation failed: source is missing %s\n' "${fragment}" >&2
    exit 1
  fi

  if ! grep -Fq "${fragment}" "${DIST}"; then
    printf 'Chart validation failed: dist is missing %s\n' "${fragment}" >&2
    exit 1
  fi
done

if grep -Eq '(^|[^[:alnum:]_])(require\(|import[[:space:]].*from|fetch\(|XMLHttpRequest)' "${SOURCE}"; then
  printf 'Chart validation failed: runtime source contains an external module or network dependency.\n' >&2
  exit 1
fi

printf 'Chart validation passed: source, dist, docs, public API, and dependency boundary match.\n'
