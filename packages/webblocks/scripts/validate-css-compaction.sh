#!/usr/bin/env bash
# Validate conservative CSS formatting without a package runtime.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FORMATTER="$ROOT/scripts/compact-css.awk"
FIXTURES="$ROOT/tests/css-compaction"
TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/wb-css-compaction.XXXXXX")"
trap 'rm -rf "$TMP_DIR"' EXIT

LC_ALL=C awk -f "$FORMATTER" "$FIXTURES/input.css" > "$TMP_DIR/actual.css"
diff -u "$FIXTURES/expected.css" "$TMP_DIR/actual.css"
LC_ALL=C awk -f "$FORMATTER" "$TMP_DIR/actual.css" > "$TMP_DIR/repeated.css"
cmp "$TMP_DIR/actual.css" "$TMP_DIR/repeated.css"

for malformed in '.test { width: calc(100% - 1px;' '.test { content: "unterminated; }' '/* unterminated' '.test { width: 1px;'; do
  printf '%s\n' "$malformed" > "$TMP_DIR/malformed.css"
  if LC_ALL=C awk -f "$FORMATTER" "$TMP_DIR/malformed.css" > "$TMP_DIR/output.css" 2> "$TMP_DIR/error"; then
    printf 'CSS compaction validation failed: malformed input was accepted.\n' >&2
    exit 1
  fi
  [ ! -s "$TMP_DIR/output.css" ] || { printf 'CSS compaction emitted partial output on failure.\n' >&2; exit 1; }
done

# Exercise the real build failure path in a disposable package copy. A broken
# function must not replace the previously built main stylesheet or leak stages.
PACKAGE_COPY="$TMP_DIR/repo/packages/webblocks"
mkdir -p "$PACKAGE_COPY/src" "$PACKAGE_COPY/scripts" "$PACKAGE_COPY/dist"
cp -R "$ROOT/src/css" "$PACKAGE_COPY/src/"
cp "$ROOT/build.sh" "$ROOT/VERSION" "$PACKAGE_COPY/"
cp "$FORMATTER" "$PACKAGE_COPY/scripts/"
cp "$ROOT/dist/webblocks-ui.css" "$PACKAGE_COPY/dist/"
printf '\n.wb-broken-fixture { width: calc(100%% - 1px;\n' >> "$PACKAGE_COPY/src/css/foundation/tokens.css"
if bash "$PACKAGE_COPY/build.sh" > "$TMP_DIR/build.log" 2> "$TMP_DIR/build.error"; then
  printf 'CSS compaction validation failed: build accepted a broken function.\n' >&2
  exit 1
fi
grep -Fq 'CSS compaction failed:' "$TMP_DIR/build.error"
cmp "$ROOT/dist/webblocks-ui.css" "$PACKAGE_COPY/dist/webblocks-ui.css"
for stage in "$PACKAGE_COPY/dist"/.css-*; do
  [ ! -e "$stage" ] || { printf 'CSS build left a temporary stage after failure.\n' >&2; exit 1; }
done

for css_file in "$ROOT/dist/webblocks-ui.css" "$ROOT/dist/webblocks-icons.css"; do
  LC_ALL=C awk -f "$FORMATTER" "$css_file" > "$TMP_DIR/dist.css"
  cmp "$css_file" "$TMP_DIR/dist.css"
  grep -Fq 'Licensed under MIT' "$css_file"
done
# The complete upstream notice must survive byte for byte, including line breaks.
awk 'FNR == NR { notice = notice $0 "\n"; next } { css = css $0 "\n" } END { exit index(css, notice) ? 0 : 1 }' \
  "$ROOT/../../THIRD_PARTY_LICENSES.txt" "$ROOT/dist/webblocks-icons.css"

printf 'CSS compaction validation passed: protected whitespace, comments, licenses, idempotence and build failure handling.\n'
