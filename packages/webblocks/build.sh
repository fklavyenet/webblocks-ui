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
  "$ROOT/src/css/foundation/reset.css" \
  "$ROOT/src/css/foundation/elements.css" \
  "$ROOT/src/css/foundation/webgames-tokens.css" \
  "$ROOT/src/css/utilities/helpers.css" \
  "$ROOT/src/css/layout/container.css" \
  "$ROOT/src/css/layout/grid.css" \
  "$ROOT/src/css/layout/navbar.css" \
  "$ROOT/src/css/layout/sidebar.css" \
  "$ROOT/src/css/primitives/button.css" \
  "$ROOT/src/css/primitives/badge.css" \
  "$ROOT/src/css/primitives/card.css" \
  "$ROOT/src/css/primitives/alert.css" \
  "$ROOT/src/css/primitives/callout.css" \
  "$ROOT/src/css/primitives/section-heading.css" \
  "$ROOT/src/css/primitives/form.css" \
  "$ROOT/src/css/primitives/table.css" \
  "$ROOT/src/css/primitives/media.css" \
  "$ROOT/src/css/primitives/overlay.css" \
  "$ROOT/src/css/primitives/modal.css" \
  "$ROOT/src/css/primitives/dropdown.css" \
  "$ROOT/src/css/primitives/tabs.css" \
  "$ROOT/src/css/primitives/accordion.css" \
  "$ROOT/src/css/primitives/pagination.css" \
  "$ROOT/src/css/primitives/breadcrumb.css" \
  "$ROOT/src/css/primitives/avatar.css" \
  "$ROOT/src/css/primitives/toast.css" \
  "$ROOT/src/css/primitives/skeleton.css" \
  "$ROOT/src/css/primitives/empty.css" \
  "$ROOT/src/css/primitives/nav-group.css" \
  "$ROOT/src/css/primitives/filter-bar.css" \
  "$ROOT/src/css/primitives/action-menu.css" \
  "$ROOT/src/css/primitives/loading.css" \
  "$ROOT/src/css/primitives/popover.css" \
  "$ROOT/src/css/primitives/drawer.css" \
  "$ROOT/src/css/primitives/command-palette.css" \
  "$ROOT/src/css/primitives/divider.css" \
  "$ROOT/src/css/primitives/list-group.css" \
  "$ROOT/src/css/primitives/link-list.css" \
  "$ROOT/src/css/primitives/inline-list.css" \
  "$ROOT/src/css/primitives/promo.css" \
  "$ROOT/src/css/primitives/tooltip.css" \
  "$ROOT/src/css/primitives/toolbar.css" \
  "$ROOT/src/css/primitives/radio-card.css" \
  "$ROOT/src/css/primitives/collapse.css" \
  "$ROOT/src/css/primitives/webgames-button.css" \
  "$ROOT/src/css/primitives/webgames-panel.css" \
  "$ROOT/src/css/primitives/webgames-status.css" \
  "$ROOT/src/css/patterns/page-intro.css" \
  "$ROOT/src/css/patterns/auth-shell.css" \
  "$ROOT/src/css/patterns/dashboard-shell.css" \
  "$ROOT/src/css/patterns/settings-shell.css" \
  "$ROOT/src/css/patterns/section-nav.css" \
  "$ROOT/src/css/patterns/gallery.css" \
  "$ROOT/src/css/patterns/content-shell.css" \
  "$ROOT/src/css/patterns/marketing.css" \
  "$ROOT/src/css/patterns/webgames-screen.css" \
  "$ROOT/src/css/icons/icons.css" \
  > "$CSS_OUT"

CSS_LINES=$(wc -l < "$CSS_OUT")
echo "  -> dist/webblocks-ui.css  ($CSS_LINES lines)"

echo "Building JS..."

cat \
  "$ROOT/src/js/utils/storage.js" \
  "$ROOT/src/js/utils/dom.js" \
  "$ROOT/src/js/utils/overlay.js" \
  "$ROOT/src/js/theme.js" \
  "$ROOT/src/js/dropdown.js" \
  "$ROOT/src/js/modal.js" \
  "$ROOT/src/js/gallery.js" \
  "$ROOT/src/js/tabs.js" \
  "$ROOT/src/js/accordion.js" \
  "$ROOT/src/js/sidebar.js" \
  "$ROOT/src/js/section-nav.js" \
  "$ROOT/src/js/nav-group.js" \
  "$ROOT/src/js/drawer.js" \
  "$ROOT/src/js/command-palette.js" \
  "$ROOT/src/js/toast.js" \
  "$ROOT/src/js/popover.js" \
  "$ROOT/src/js/tooltip.js" \
  "$ROOT/src/js/dismiss.js" \
  "$ROOT/src/js/ajax-toggle.js" \
  "$ROOT/src/js/password-toggle.js" \
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
