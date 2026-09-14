#!/usr/bin/env bash

set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE="${ROOT}/src/css/primitives/background-media.css"
DIST="${ROOT}/dist/webblocks-ui.css"
PROMO="${ROOT}/src/css/primitives/promo.css"

for css in "${SOURCE}" "${DIST}"; do
  for fragment in \
    '.wb-background-media.wb-background-media {' \
    'background-image: var(--wb-background-media-overlay), var(--wb-background-media-image);' \
    'background-position: center, var(--wb-background-media-position, center);' \
    'background-repeat: no-repeat;' \
    'background-size: cover;' \
    '.wb-background-media--overlay-none {' \
    '.wb-background-media--overlay-medium {' \
    '.wb-background-media--overlay-strong {'
  do
    if ! grep -Fq "${fragment}" "${css}"; then
      printf 'Background media validation failed: %s is missing %s\n' "${css}" "${fragment}" >&2
      exit 1
    fi
  done
done

if ! grep -Fq 'background:' "${PROMO}"; then
  printf 'Background media validation failed: the ordinary promo gradient contract is missing.\n' >&2
  exit 1
fi

printf 'Background media validation passed: source and dist preserve media layers, overlays, position, repeat, size, and the ordinary promo gradient.\n'
