#!/usr/bin/env bash

set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE="${ROOT}/src/css/primitives/form.css"
DIST="${ROOT}/dist/webblocks-ui.css"
INTEGRATION="${ROOT}/INTEGRATION.md"

for fragment in \
  '.wb-file {' \
  '.wb-file::file-selector-button {' \
  '.wb-color {' \
  '.wb-range {' \
  '.wb-range::-webkit-slider-runnable-track {' \
  '.wb-range::-moz-range-track {' \
  '.wb-file-error {' \
  '.wb-color-error {' \
  '.wb-range-error::-webkit-slider-runnable-track {'
do
  if ! grep -Fq "${fragment}" "${SOURCE}"; then
    printf 'Native input validation failed: source is missing %s\n' "${fragment}" >&2
    exit 1
  fi

  if ! grep -Fq "${fragment}" "${DIST}"; then
    printf 'Native input validation failed: dist is missing %s\n' "${fragment}" >&2
    exit 1
  fi
done

for primitive in wb-file wb-color wb-range; do
  if ! grep -Fq "${primitive}" "${INTEGRATION}"; then
    printf 'Native input validation failed: integration guide is missing %s\n' "${primitive}" >&2
    exit 1
  fi
done

printf 'Native input validation passed: file, color, and range contracts match source, dist, and integration docs.\n'
