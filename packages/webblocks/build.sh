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
  "$ROOT/src/css/components/callout.css" \
  "$ROOT/src/css/components/section-heading.css" \
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
  "$ROOT/src/css/components/link-list.css" \
  "$ROOT/src/css/components/inline-list.css" \
  "$ROOT/src/css/components/promo.css" \
  "$ROOT/src/css/components/tooltip.css" \
  "$ROOT/src/css/components/toolbar.css" \
  "$ROOT/src/css/components/icons.css" \
  "$ROOT/src/css/components/radio-card.css" \
  "$ROOT/src/css/components/collapse.css" \
  "$ROOT/src/css/layouts/container.css" \
  "$ROOT/src/css/layouts/navbar.css" \
  "$ROOT/src/css/layouts/sidebar.css" \
  "$ROOT/src/css/layouts/dashboard-shell.css" \
  "$ROOT/src/css/layouts/auth-shell.css" \
  "$ROOT/src/css/layouts/settings-shell.css" \
  "$ROOT/src/css/layouts/content-shell.css" \
  "$ROOT/src/css/layouts/page-intro.css" \
  "$ROOT/src/css/layouts/marketing.css" \
  "$ROOT/src/css/webgames/tokens.css" \
  "$ROOT/src/css/webgames/screen.css" \
  "$ROOT/src/css/webgames/panel.css" \
  "$ROOT/src/css/webgames/button.css" \
  "$ROOT/src/css/webgames/status.css" \
  "$ROOT/src/css/utilities/helpers.css" \
  "$ROOT/src/css/utilities/grid.css" \
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
  "$ROOT/src/js/toast.js" \
  "$ROOT/src/js/popover.js" \
  "$ROOT/src/js/tooltip.js" \
  "$ROOT/src/js/dismiss.js" \
  "$ROOT/src/js/ajax-toggle.js" \
  "$ROOT/src/js/collapse.js" \
  > "$JS_OUT"

JS_LINES=$(wc -l < "$JS_OUT")
echo "  -> dist/webblocks-ui.js   ($JS_LINES lines)"

echo "Building icons..."

if command -v node &> /dev/null; then
  node "$ROOT/scripts/build-icons.js"
else
  echo "  -> Skipped (node not found — run: node scripts/build-icons.js)"
fi

echo ""
echo "Build complete."
