#!/usr/bin/env bash

set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE="${ROOT}/src/css/primitives/table.css"
DIST="${ROOT}/dist/webblocks-ui.css"

for fragment in '.wb-table th.wb-table-key {' 'width: 1%;' 'white-space: nowrap;'; do
  if ! grep -Fq "${fragment}" "${SOURCE}"; then
    printf 'Table validation failed: source is missing %s\n' "${fragment}" >&2
    exit 1
  fi

  if ! grep -Fq "${fragment}" "${DIST}"; then
    printf 'Table validation failed: dist is missing %s\n' "${fragment}" >&2
    exit 1
  fi
done

for fragment in '.wb-table-sort {' '.wb-table-sort:focus-visible {' '.wb-table-sort-icon {' '.wb-table th[aria-sort] > .wb-table-sort {'; do
  for file in "${SOURCE}" "${DIST}"; do
    if ! grep -Fq "${fragment}" "${file}"; then
      printf 'Table validation failed: %s is missing %s\n' "${file}" "${fragment}" >&2
      exit 1
    fi
  done
done

RUNTIME="${ROOT}/src/js/table-sort.js"
for fragment in 'window.WBTableSort = { init: init, sort: sort, update: update, destroy: destroy }' 'wb:table-sort:' 'Intl.Collator' 'data-wb-sort-value' 'invalid-structure' 'aria-sort' 'wb-icon-arrow-up-down' 'wb-icon-arrow-up' 'wb-icon-arrow-down'; do
  for file in "${RUNTIME}" "${ROOT}/dist/webblocks-ui.js"; do
    if ! grep -Fq "${fragment}" "${file}"; then
      printf 'Table validation failed: %s is missing %s\n' "${file}" "${fragment}" >&2
      exit 1
    fi
  done
done

if grep -Eq '(^|[^[:alnum:]_])(require\(|import[[:space:]].*from|fetch\(|XMLHttpRequest)' "${RUNTIME}"; then
  printf 'Table validation failed: runtime contains an external module or network dependency.\n' >&2
  exit 1
fi

for file in "${ROOT}/INTEGRATION.md" "${ROOT}/../../docs/table-sort.html" "${ROOT}/../../docs/tr/table-sort.html" "${ROOT}/../../docs/de/table-sort.html"; do
  for fragment in 'data-wb-table-sort="client"' 'data-wb-table-sort="server"' 'wb:table-sort:request' 'WBTableSort.update'; do
    if ! grep -Fq "${fragment}" "${file}"; then
      printf 'Table validation failed: %s is missing %s\n' "${file}" "${fragment}" >&2
      exit 1
    fi
  done
done

if [ ! -s "${ROOT}/tests/table-sort.html" ]; then
  printf 'Table validation failed: browser behavior fixture is missing.\n' >&2
  exit 1
fi

printf 'Table validation passed: key columns, sort CSS/runtime, built assets, examples and browser fixture match.\n'
