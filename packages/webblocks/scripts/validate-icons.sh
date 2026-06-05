#!/usr/bin/env bash
# WebBlocks UI — shell-only icon dist validation.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "$ROOT/../.." && pwd)"
DIST_JSON="$ROOT/dist/webblocks-icons.json"
DIST_CSS="$ROOT/dist/webblocks-icons.css"
DOCS_ICONS="$REPO_ROOT/docs/icons.html"

REQUIRED_ICON_CLASSES="
wb-icon-pencil
wb-icon-trash
wb-icon-user
wb-icon-settings
wb-icon-search
wb-icon-plus
wb-icon-x
wb-icon-eye
"

fail() {
  echo "Icon validation failed: $1" >&2
  exit 1
}

has_selector() {
  local class_name="$1"
  grep -Eq "(^|[[:space:]])\\.${class_name}([,[:space:]\\{]|$)" "$DIST_CSS"
}

extract_manifest_classes() {
  sed -nE 's/^[[:space:]]*"css_class"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/p' "$DIST_JSON" | sort -u
}

extract_docs_classes() {
  grep -Eo 'wb-icon-[a-z0-9]+(-[a-z0-9]+)*' "$DOCS_ICONS" \
    | grep -Ev '^(wb-icon-sm|wb-icon-lg|wb-icon-xl|wb-icon-wrap)$' \
    | sort -u
}

[ -s "$DIST_CSS" ] || fail "missing or empty dist icon CSS at $DIST_CSS"
[ -s "$DIST_JSON" ] || fail "missing or empty icon manifest at $DIST_JSON"
[ -s "$DOCS_ICONS" ] || fail "missing or empty docs icon catalog at $DOCS_ICONS"

manifest_count=$(extract_manifest_classes | wc -l | tr -d '[:space:]')
[ "$manifest_count" -gt 0 ] || fail "icon manifest contains no css_class entries"

mask_rule_count=$(grep -c -- "-webkit-mask-image:" "$DIST_CSS" || true)
[ "$mask_rule_count" -ge 50 ] || fail "dist icon CSS appears helper-only; expected generated mask selectors, found $mask_rule_count mask rules"

for class_name in $REQUIRED_ICON_CLASSES; do
  has_selector "$class_name" || fail "required selector .$class_name is missing from dist icon CSS"
done

missing_manifest_classes=""
while IFS= read -r class_name; do
  if ! has_selector "$class_name"; then
    missing_manifest_classes="${missing_manifest_classes}${class_name} "
  fi
done <<EOF
$(extract_manifest_classes)
EOF

[ -z "$missing_manifest_classes" ] || fail "manifest classes missing generated selectors: $missing_manifest_classes"

missing_docs_classes=""
while IFS= read -r class_name; do
  if ! has_selector "$class_name"; then
    missing_docs_classes="${missing_docs_classes}${class_name} "
  fi
done <<EOF
$(extract_docs_classes)
EOF

[ -z "$missing_docs_classes" ] || fail "docs icon classes missing generated selectors: $missing_docs_classes"

docs_count=$(extract_docs_classes | wc -l | tr -d '[:space:]')

echo "Icon validation passed: $manifest_count manifest classes, $docs_count docs icon classes, and 8 required selectors are present."
