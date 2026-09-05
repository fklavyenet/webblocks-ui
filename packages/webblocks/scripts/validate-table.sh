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

printf 'Table validation passed: intrinsic key-column contract matches source and dist.\n'
