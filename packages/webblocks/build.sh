#!/usr/bin/env bash
# ============================================================
# WebBlocks UI — Build Script
# Concatenates src files into dist/webblocks-ui.css and .js,
# then emits conservative minified production artifacts.
# No npm required — plain shell cat
# Usage: ./build.sh
# ============================================================

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$ROOT/../.." && pwd)"
DIST="$ROOT/dist"
CSS_OUT="$DIST/webblocks-ui.css"
JS_OUT="$DIST/webblocks-ui.js"
ICONS_OUT="$DIST/webblocks-icons.css"
ICONS_JSON_OUT="$DIST/webblocks-icons.json"
CSS_MIN_OUT="$DIST/webblocks-ui.min.css"
JS_MIN_OUT="$DIST/webblocks-ui.min.js"
ICONS_MIN_OUT="$DIST/webblocks-icons.min.css"
VERSION_FILE="$ROOT/VERSION"
DOCS_VERSION_OUT="$REPO_ROOT/docs/version.js"

if [ ! -f "$VERSION_FILE" ]; then
  echo "Error: missing version file at $VERSION_FILE" >&2
  exit 1
fi

VERSION="$(tr -d '[:space:]' < "$VERSION_FILE")"

if [ -z "$VERSION" ]; then
  echo "Error: $VERSION_FILE is empty" >&2
  exit 1
fi

VERSION_TAG="v$VERSION"

mkdir -p "$DIST"

strip_generated_banner() {
  local input_file="$1"
  local output_file="$2"

  awk '
    BEGIN {
      stripping = 1
      in_banner = 0
    }
    stripping && $0 == "@charset \"UTF-8\";" {
      next
    }
    stripping && $0 ~ /^\/\*!$/ {
      in_banner = 1
      next
    }
    in_banner {
      if ($0 ~ /^[[:space:]]*\*\/$/) {
        in_banner = 0
        next
      }
      next
    }
    {
      stripping = 0
      print
    }
  ' "$input_file" > "$output_file"
}

write_css_banner() {
  cat <<EOF
@charset "UTF-8";
/*!
 * WebBlocks UI $VERSION_TAG (https://webblocksui.com/)
 * Copyright 2026 WebBlocks UI
 * Licensed under MIT
 */

EOF
}

write_js_banner() {
  cat <<EOF
/*!
 * WebBlocks UI $VERSION_TAG (https://webblocksui.com/)
 * Copyright 2026 WebBlocks UI
 * Licensed under MIT
 */

EOF
}

add_css_banner() {
  local file="$1"
  local stripped_file="$file.stripped"
  local output_file="$file.banner"

  strip_generated_banner "$file" "$stripped_file"
  {
    write_css_banner
    cat "$stripped_file"
  } > "$output_file"

  mv "$output_file" "$file"
  rm -f "$stripped_file"
}

add_js_banner() {
  local file="$1"
  local stripped_file="$file.stripped"
  local output_file="$file.banner"

  strip_generated_banner "$file" "$stripped_file"
  {
    write_js_banner
    cat "$stripped_file"
  } > "$output_file"

  mv "$output_file" "$file"
  rm -f "$stripped_file"
}

minify_dist_assets() {
  python3 - "$CSS_OUT" "$CSS_MIN_OUT" "$ICONS_OUT" "$ICONS_MIN_OUT" "$JS_OUT" "$JS_MIN_OUT" <<'PY'
import re
import sys
from pathlib import Path

css_in, css_out, icons_in, icons_out, js_in, js_out = [Path(arg) for arg in sys.argv[1:]]


def split_css_banner(text):
    charset = ''
    rest = text
    if rest.startswith('@charset "UTF-8";'):
        charset = '@charset "UTF-8";'
        rest = rest[len(charset):].lstrip()
    match = re.match(r'/\*!.*?\*/', rest, flags=re.S)
    if not match:
        raise SystemExit('Error: CSS banner not found')
    return charset, match.group(0), rest[match.end():]


def split_js_banner(text):
    match = re.match(r'\s*(/\*!.*?\*/)', text, flags=re.S)
    if not match:
        raise SystemExit('Error: JS banner not found')
    return match.group(1), text[match.end():]


def remove_css_comments(text):
    return re.sub(r'/\*[^!].*?\*/', '', text, flags=re.S)


def minify_css(input_path, output_path):
    text = input_path.read_text(encoding='utf-8')
    charset, banner, body = split_css_banner(text)
    body = remove_css_comments(body)
    body = re.sub(r'\s+', ' ', body)
    body = re.sub(r'\s*([{}:;,>+~])\s*', r'\1', body)
    body = re.sub(r';}', '}', body)
    body = body.strip()
    prefix = f'{charset}\n{banner}\n' if charset else f'{banner}\n'
    output_path.write_text(prefix + body + '\n', encoding='utf-8')


def strip_js_comments(text):
    out = []
    i = 0
    length = len(text)
    state = 'code'
    escaped = False
    line_has_code = False

    while i < length:
        ch = text[i]
        nxt = text[i + 1] if i + 1 < length else ''

        if state == 'code':
            if ch == '/' and nxt == '*':
                i += 2
                while i + 1 < length and not (text[i] == '*' and text[i + 1] == '/'):
                    i += 1
                i += 2
                continue
            if ch == '/' and nxt == '/' and not line_has_code:
                i += 2
                while i < length and text[i] not in '\r\n':
                    i += 1
                continue
            out.append(ch)
            if ch in ("'", '"', '`'):
                state = ch
                escaped = False
            if ch == '\n':
                line_has_code = False
            elif not ch.isspace():
                line_has_code = True
            i += 1
            continue

        out.append(ch)
        if escaped:
            escaped = False
        elif ch == '\\':
            escaped = True
        elif ch == state:
            state = 'code'
        if ch == '\n':
            line_has_code = False
        i += 1

    return ''.join(out)


def minify_js(input_path, output_path):
    text = input_path.read_text(encoding='utf-8')
    banner, body = split_js_banner(text)
    body = strip_js_comments(body)
    lines = []
    for line in body.splitlines():
        compact = re.sub(r'[ \t]+', ' ', line).strip()
        if compact:
            lines.append(compact)
    output_path.write_text(banner + '\n' + '\n'.join(lines) + '\n', encoding='utf-8')


minify_css(css_in, css_out)
minify_css(icons_in, icons_out)
minify_js(js_in, js_out)
PY
}

assert_file_contains() {
  local file="$1"
  local needle="$2"

  if ! grep -Fq "$needle" "$file"; then
    echo "Error: expected $file to contain $needle" >&2
    exit 1
  fi
}

validate_minified_assets() {
  for file in "$CSS_MIN_OUT" "$ICONS_MIN_OUT" "$JS_MIN_OUT"; do
    if [ ! -s "$file" ]; then
      echo "Error: missing minified output at $file" >&2
      exit 1
    fi
  done

  assert_file_contains "$CSS_MIN_OUT" "WebBlocks UI $VERSION_TAG"
  assert_file_contains "$ICONS_MIN_OUT" "WebBlocks UI $VERSION_TAG"
  assert_file_contains "$ICONS_MIN_OUT" ".wb-icon-settings"
  assert_file_contains "$ICONS_MIN_OUT" ".wb-icon-arrow-down"
  assert_file_contains "$ICONS_MIN_OUT" ".wb-icon-grip-vertical"
  assert_file_contains "$JS_MIN_OUT" "WebBlocks UI $VERSION_TAG"
  assert_file_contains "$JS_MIN_OUT" "window.WBModal"
  assert_file_contains "$JS_MIN_OUT" "window.WBDropdown"
  assert_file_contains "$JS_MIN_OUT" "window.WBToast"
  assert_file_contains "$JS_MIN_OUT" "window.WBTheme"

  if command -v node &> /dev/null; then
    node --check "$JS_MIN_OUT"
  else
    echo "  -> Skipped JS syntax check (node not found)"
  fi
}

write_docs_version_asset() {
  mkdir -p "$(dirname "$DOCS_VERSION_OUT")"

  cat > "$DOCS_VERSION_OUT" <<EOF
(function () {
  'use strict';

  var version = '$VERSION';
  var versionTag = '$VERSION_TAG';

  function applyVersion() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-webblocks-version]'), function (node) {
      node.textContent = version;
    });
  }

  window.WebBlocksVersion = version;
  window.WebBlocksVersionTag = versionTag;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyVersion);
  } else {
    applyVersion();
  }
})();
EOF
}

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
  "$ROOT/src/css/primitives/rich-text.css" \
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
  "$ROOT/src/css/patterns/breadcrumb.css" \
  "$ROOT/src/css/patterns/auth-shell.css" \
  "$ROOT/src/css/patterns/dashboard-shell.css" \
  "$ROOT/src/css/patterns/settings-shell.css" \
  "$ROOT/src/css/patterns/section-nav.css" \
  "$ROOT/src/css/patterns/gallery.css" \
  "$ROOT/src/css/patterns/cookie-consent.css" \
  "$ROOT/src/css/patterns/content-shell.css" \
  "$ROOT/src/css/patterns/marketing.css" \
  "$ROOT/src/css/patterns/webgames-screen.css" \
  "$ROOT/src/css/icons/icons.css" \
  > "$CSS_OUT"

add_css_banner "$CSS_OUT"

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
  "$ROOT/src/js/cookie-consent.js" \
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

add_js_banner "$JS_OUT"

JS_LINES=$(wc -l < "$JS_OUT")
echo "  -> dist/webblocks-ui.js   ($JS_LINES lines)"

echo "Building icons..."

if command -v node &> /dev/null; then
  node "$ROOT/scripts/build-icons.js"
else
  echo "  -> Skipped (node not found — run: node scripts/build-icons.js)"
fi

if [ ! -f "$ICONS_OUT" ]; then
  echo "Error: missing icon output at $ICONS_OUT" >&2
  exit 1
fi

if [ ! -f "$ICONS_JSON_OUT" ]; then
  echo "Error: missing icon manifest output at $ICONS_JSON_OUT" >&2
  exit 1
fi

add_css_banner "$ICONS_OUT"

ICONS_LINES=$(wc -l < "$ICONS_OUT")
echo "  -> dist/webblocks-icons.css  ($ICONS_LINES lines)"

ICON_JSON_COUNT=$(node -e "const fs=require('fs');const data=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));console.log(data.length);" "$ICONS_JSON_OUT")
echo "  -> dist/webblocks-icons.json  ($ICON_JSON_COUNT entries)"

echo "Validating icons..."
node "$ROOT/scripts/validate-icons.js"

echo "Validating toast lifecycle..."
node "$ROOT/scripts/validate-toast.js"

echo "Building minified artifacts..."
minify_dist_assets
validate_minified_assets
CSS_MIN_BYTES=$(wc -c < "$CSS_MIN_OUT")
ICONS_MIN_BYTES=$(wc -c < "$ICONS_MIN_OUT")
JS_MIN_BYTES=$(wc -c < "$JS_MIN_OUT")
echo "  -> dist/webblocks-ui.min.css     ($CSS_MIN_BYTES bytes)"
echo "  -> dist/webblocks-icons.min.css  ($ICONS_MIN_BYTES bytes)"
echo "  -> dist/webblocks-ui.min.js      ($JS_MIN_BYTES bytes)"

echo "Generating docs version asset..."
write_docs_version_asset
echo "  -> docs/version.js"

echo ""
echo "Build complete."
