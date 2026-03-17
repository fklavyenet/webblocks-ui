#!/usr/bin/env bash
# ============================================================
# WebBlocks UI — Build Script
# Concatenates src files into dist/webblocks-ui.css and .js
# No npm required — plain shell cat
# Usage: ./build.sh
# ============================================================

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
DIST="$ROOT/dist"
CSS_OUT="$DIST/webblocks-ui.css"
JS_OUT="$DIST/webblocks-ui.js"

mkdir -p "$DIST"

echo "Building CSS..."

cat \
  "$ROOT/src/css/foundation/tokens.css" \
  "$ROOT/src/css/foundation/dark.css" \
  "$ROOT/src/css/foundation/presets.css" \
  "$ROOT/src/css/foundation/accents.css" \
  "$ROOT/src/css/foundation/radius.css" \
  "$ROOT/src/css/foundation/density.css" \
  "$ROOT/src/css/foundation/shadow.css" \
  "$ROOT/src/css/foundation/font.css" \
  "$ROOT/src/css/foundation/border.css" \
  "$ROOT/src/css/base/reset.css" \
  "$ROOT/src/css/base/elements.css" \
  "$ROOT/src/css/components/button.css" \
  "$ROOT/src/css/components/badge.css" \
  "$ROOT/src/css/components/card.css" \
  "$ROOT/src/css/components/alert.css" \
  "$ROOT/src/css/components/form.css" \
  "$ROOT/src/css/components/table.css" \
  "$ROOT/src/css/components/modal.css" \
  "$ROOT/src/css/components/dropdown.css" \
  "$ROOT/src/css/components/tabs.css" \
  "$ROOT/src/css/components/accordion.css" \
  "$ROOT/src/css/components/pagination.css" \
  "$ROOT/src/css/components/breadcrumb.css" \
  "$ROOT/src/css/components/avatar.css" \
  "$ROOT/src/css/components/toast.css" \
  "$ROOT/src/css/components/skeleton.css" \
  "$ROOT/src/css/components/empty.css" \
  "$ROOT/src/css/components/nav-group.css" \
  "$ROOT/src/css/components/filter-bar.css" \
  "$ROOT/src/css/components/action-menu.css" \
  "$ROOT/src/css/components/loading.css" \
  "$ROOT/src/css/components/popover.css" \
  "$ROOT/src/css/components/drawer.css" \
  "$ROOT/src/css/components/command-palette.css" \
  "$ROOT/src/css/components/divider.css" \
  "$ROOT/src/css/components/list-group.css" \
  "$ROOT/src/css/components/tooltip.css" \
  "$ROOT/src/css/components/toolbar.css" \
  "$ROOT/src/css/components/icons.css" \
  "$ROOT/src/css/layouts/container.css" \
  "$ROOT/src/css/layouts/navbar.css" \
  "$ROOT/src/css/layouts/sidebar.css" \
  "$ROOT/src/css/layouts/dashboard-shell.css" \
  "$ROOT/src/css/layouts/auth-shell.css" \
  "$ROOT/src/css/layouts/settings-shell.css" \
  "$ROOT/src/css/layouts/content-shell.css" \
  "$ROOT/src/css/utilities/helpers.css" \
  > "$CSS_OUT"

CSS_LINES=$(wc -l < "$CSS_OUT")
echo "  -> dist/webblocks-ui.css  ($CSS_LINES lines)"

echo "Building JS..."

cat \
  "$ROOT/src/js/utils/storage.js" \
  "$ROOT/src/js/utils/dom.js" \
  "$ROOT/src/js/theme.js" \
  "$ROOT/src/js/dropdown.js" \
  "$ROOT/src/js/modal.js" \
  "$ROOT/src/js/tabs.js" \
  "$ROOT/src/js/accordion.js" \
  "$ROOT/src/js/sidebar.js" \
  "$ROOT/src/js/nav-group.js" \
  "$ROOT/src/js/drawer.js" \
  "$ROOT/src/js/command-palette.js" \
  > "$JS_OUT"

JS_LINES=$(wc -l < "$JS_OUT")
echo "  -> dist/webblocks-ui.js   ($JS_LINES lines)"

echo "Building icon CSS..."

if command -v node &> /dev/null; then
  node "$ROOT/scripts/build-icons.js"
else
  echo "  -> Skipped (node not found — run: node scripts/build-icons.js)"
fi

echo ""
echo "Checking icons in examples/..."

SPRITE="$DIST/webblocks-icons.svg"
EXAMPLES=$(find "$ROOT/examples" -name "*.html" ! -path "*/v1/*" ! -path "*/core/*" ! -path "*/auth/*" ! -path "*/website/*")

# Utility modifiers — not icon names
SKIP="sm|lg|xl|xs|2xl|btn|wrap|wrap-sm|wrap-lg|wrap-circle|wrap-success|wrap-warning|wrap-danger|wrap-info|wrap-muted|accent|success|warning|danger|info|muted|thin|bold|medium|card|solo|on"

MISSING=0
while IFS= read -r icon; do
  if ! grep -q "id=\"$icon\"" "$SPRITE"; then
    if [ $MISSING -eq 0 ]; then
      echo "  MISSING icons (not in sprite):"
    fi
    # find which files use it
    FILES=$(grep -rl "wb-icon-$icon" "$ROOT/examples" | sed "s|$ROOT/||" | tr '\n' ' ')
    echo "    wb-icon-$icon  ($FILES)"
    MISSING=$((MISSING + 1))
  fi
done < <(grep -oh 'wb-icon-[a-z0-9-]*' $EXAMPLES 2>/dev/null \
  | sed 's/wb-icon-//' \
  | grep -Ewv "$SKIP" \
  | sort -u)

if [ $MISSING -eq 0 ]; then
  echo "  All icons OK ($(grep -oh 'wb-icon-[a-z0-9-]*' $EXAMPLES 2>/dev/null | sed 's/wb-icon-//' | grep -Ewv "$SKIP" | sort -u | wc -l | tr -d ' ') unique icons verified)"
else
  echo "  $MISSING missing icon(s) — replace with available sprite IDs"
fi

echo ""
echo "Build complete."
