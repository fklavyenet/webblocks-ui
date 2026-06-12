#!/usr/bin/env sh
set -eu

OUT_DIR="build/ai-knowledge"
CHUNKS_DIR="$OUT_DIR/chunks"
MANIFEST="$OUT_DIR/manifest.json"
KNOWLEDGE="$OUT_DIR/webblocks-ui-knowledge.md"
RULES="$OUT_DIR/webblocks-ui-rules.md"
EXAMPLES="$OUT_DIR/webblocks-ui-examples.md"

if [ ! -f "ai/knowledge-map.json" ] || [ ! -d "packages/webblocks/src" ]; then
  echo "FAIL: run this script from the WebBlocks UI repository root." >&2
  exit 1
fi

if ! command -v awk >/dev/null 2>&1 || ! command -v sed >/dev/null 2>&1; then
  echo "FAIL: awk and sed are required." >&2
  exit 1
fi

TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

rm -rf "$OUT_DIR"
mkdir -p "$CHUNKS_DIR"

SOURCE_INDEX="$OUT_DIR/.source-index.tsv"
: > "$SOURCE_INDEX"
CHUNK_COUNT=0

slugify() {
  printf '%s' "$1" | sed 's#[^A-Za-z0-9._-]#-#g; s#--*#-#g; s#^-##; s#-$##'
}

source_group_for() {
  case "$1" in
    packages/webblocks/src/*) printf '%s\n' "package_source" ;;
    packages/webblocks/dist/*) printf '%s\n' "package_dist" ;;
    packages/webblocks/INTEGRATION.md|packages/webblocks/README.md) printf '%s\n' "package_docs" ;;
    docs/*.html|docs/admin-product-brand.md) printf '%s\n' "html_docs" ;;
    ai/*) printf '%s\n' "ai_contract" ;;
    *) printf '%s\n' "root_docs" ;;
  esac
}

normalize_html() {
  awk '
    BEGIN { skip = 0 }
    /<[[:space:]]*script([[:space:]>]|$)/ { skip = 1 }
    /<[[:space:]]*style([[:space:]>]|$)/ { skip = 1 }
    skip == 0 { print }
    /<\/[[:space:]]*script[[:space:]]*>/ { skip = 0; next }
    /<\/[[:space:]]*style[[:space:]]*>/ { skip = 0; next }
  ' "$1" \
    | sed \
      -e 's/<[^>][^>]*>/ /g' \
      -e 's/&nbsp;/ /g' \
      -e 's/&amp;/\&/g' \
      -e 's/&lt;/</g' \
      -e 's/&gt;/>/g' \
      -e 's/&#39;/'"'"'/g' \
      -e 's/&quot;/"/g' \
      -e 's/[[:space:]][[:space:]]*/ /g' \
      -e '/^[[:space:]]*$/d'
}

write_chunk() {
  src="$1"
  group="$2"
  title="$3"
  body_file="$4"
  slug="$(slugify "$src")"
  chunk="$CHUNKS_DIR/$slug.md"

  CHUNK_COUNT=$((CHUNK_COUNT + 1))
  {
    printf '%s\n' "---"
    printf 'source_path: %s\n' "$src"
    printf 'source_group: %s\n' "$group"
    printf 'generated_at: %s\n' "$TS"
    printf '%s\n' "---"
    printf '\n# %s\n\n' "$title"
    cat "$body_file"
    printf '\n'
  } > "$chunk"

  printf '%s\t%s\t%s\n' "$src" "$group" "$chunk" >> "$SOURCE_INDEX"
}

add_file() {
  src="$1"
  [ -f "$src" ] || return 0
  group="$(source_group_for "$src")"
  tmp="$OUT_DIR/.chunk-body"

  case "$src" in
    *.html)
      {
        printf 'Normalized HTML documentation source. Script and style blocks were removed before export.\n\n'
        normalize_html "$src"
      } > "$tmp"
      ;;
    *)
      cp "$src" "$tmp"
      ;;
  esac

  write_chunk "$src" "$group" "$src" "$tmp"
}

add_dir_files() {
  dir="$1"
  [ -d "$dir" ] || return 0
  find "$dir" -type f \( -name '*.css' -o -name '*.js' -o -name '*.svg' \) ! -name '.DS_Store' | sort | while IFS= read -r file; do
    add_file "$file"
  done
}

cat > "$KNOWLEDGE" <<EOF
# WebBlocks UI Knowledge Export

Generated: $TS

This package is a static, public-safe knowledge export generated before any vector store phase. It does not create a vector store, call an API, upload files, or include private endpoints.

## Source Priority

1. \`packages/webblocks/src/\`
2. \`packages/webblocks/dist/\`
3. \`packages/webblocks/INTEGRATION.md\`
4. \`INTEGRATION.md\`
5. \`PATTERNS.md\`
6. \`PRIMITIVES.md\`
7. \`docs/*.html\`
8. \`ai/*.md\`

## Canonical Vocabulary

- \`wb-dashboard-shell\`
- \`wb-auth-shell\`
- \`wb-settings-shell\`
- \`wb-card\`
- \`wb-modal\`
- \`wb-table-actions\`
- \`wb-action-group\`
- \`wb-toast\`
- \`wb-alert\`

## Primary Use/Do Examples

Use \`wb-dashboard-shell\` for admin and dashboard screens.
Use \`wb-auth-shell\` for authentication screens.
Use \`wb-settings-shell\` for settings screens.
Use \`wb-card\` as the canonical framed surface.
Use \`wb-modal\` for confirmation and dialog flows.
Use \`td.wb-table-actions\` with \`wb-action-group\` for row actions.
Use \`wb-toast\` for transient success and info feedback.
Use \`wb-alert\` for validation, blocking, and user-correctable feedback.

## Source Manifest

The chunk source list is generated from the same source groups represented in \`ai/knowledge-map.json\`.
EOF

cat > "$RULES" <<EOF
# WebBlocks UI Rules Export

Generated: $TS

## Source Priority

1. \`packages/webblocks/src/\`
2. \`packages/webblocks/dist/\`
3. \`packages/webblocks/INTEGRATION.md\`
4. \`INTEGRATION.md\`
5. \`PATTERNS.md\`
6. \`PRIMITIVES.md\`
7. \`docs/*.html\`
8. \`ai/*.md\`

## Required Canonical Vocabulary

- \`wb-dashboard-shell\`
- \`wb-auth-shell\`
- \`wb-settings-shell\`
- \`wb-card\`
- \`wb-modal\`
- \`wb-table-actions\`
- \`wb-action-group\`
- \`wb-toast\`
- \`wb-alert\`

## Forbidden Context

The export must carry these as forbidden or anti-pattern vocabulary, not as primary use/do recommendations:

- \`wb-panel\`
- \`wb-box\`
- browser confirm
- duplicated modal roots
- Tailwind
- Vite
- React
- Vue
- Livewire
- Inertia

EOF

cat ai/FORBIDDEN_PATTERNS.md >> "$RULES"

cat > "$EXAMPLES" <<EOF
# WebBlocks UI Examples Export

Generated: $TS

## Primary Use/Do Examples

\`\`\`html
<main class="wb-dashboard-shell">
  <section class="wb-card">
    <div class="wb-card-body">
      <div class="wb-table-wrap">
        <table class="wb-table">
          <thead>
            <tr><th>Name</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Example</td>
              <td class="wb-table-actions"><div class="wb-action-group">...</div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</main>
\`\`\`

\`\`\`html
<main class="wb-auth-shell">
  <section class="wb-card">...</section>
</main>
\`\`\`

\`\`\`html
<main class="wb-settings-shell">
  <section class="wb-card">...</section>
</main>
\`\`\`

\`\`\`html
<div class="wb-modal" role="dialog" aria-modal="true">...</div>
<div class="wb-toast" role="status">Saved.</div>
<div class="wb-alert wb-alert-danger" role="alert">Please fix the highlighted fields.</div>
\`\`\`

## End Primary Use/Do Examples

## Source Examples With Wrong/Right Contrast

EOF

cat ai/EXAMPLES.md >> "$EXAMPLES"

# Priority 1: package source.
add_dir_files "packages/webblocks/src/css/foundation"
add_dir_files "packages/webblocks/src/css/layout"
add_dir_files "packages/webblocks/src/css/primitives"
add_dir_files "packages/webblocks/src/css/patterns"
add_dir_files "packages/webblocks/src/css/utilities"
add_file "packages/webblocks/src/css/icons/webblocks-icons.svg"
add_file "packages/webblocks/src/css/icons/webblocks-icons.css"
add_dir_files "packages/webblocks/src/js"

# Priority 2: package dist. Icon JSON is intentionally before icon CSS.
add_file "packages/webblocks/dist/webblocks-icons.json"
add_file "packages/webblocks/dist/webblocks-ui.css"
add_file "packages/webblocks/dist/webblocks-ui.js"
add_file "packages/webblocks/dist/webblocks-icons.css"

# Priority 3-8: docs and AI contract.
add_file "packages/webblocks/INTEGRATION.md"
add_file "INTEGRATION.md"
add_file "PATTERNS.md"
add_file "PRIMITIVES.md"
find docs -maxdepth 1 -type f -name '*.html' | sort | while IFS= read -r file; do
  add_file "$file"
done
for file in ai/README.md ai/WEBBLOCKS_UI_EXPERT.md ai/DOWNSTREAM_USAGE_RULES.md ai/REVIEW_CHECKLIST.md ai/FORBIDDEN_PATTERNS.md ai/RESPONSE_FORMATS.md ai/EXAMPLES.md ai/DOWNSTREAM_AGENT_BLOCK.md; do
  add_file "$file"
done
add_file "ai/knowledge-map.json"

{
  printf '\n## Chunks\n\n'
  awk -F '\t' '{ printf "- `%s` (%s) -> `%s`\n", $1, $2, $3 }' "$SOURCE_INDEX"
} >> "$KNOWLEDGE"

CHUNK_COUNT="$(wc -l < "$SOURCE_INDEX" | sed 's/[[:space:]]//g')"

{
  printf '{\n'
  printf '  "generated_at": "%s",\n' "$TS"
  printf '  "schema": "webblocks-ui-ai-knowledge-export-v1",\n'
  printf '  "purpose": "Static public-safe AI knowledge export. No OpenAI API calls and no vector store creation.",\n'
  printf '  "output_dir": "%s",\n' "$OUT_DIR"
  printf '  "source_priority": [\n'
  printf '    "packages/webblocks/src/",\n'
  printf '    "packages/webblocks/dist/",\n'
  printf '    "packages/webblocks/INTEGRATION.md",\n'
  printf '    "INTEGRATION.md",\n'
  printf '    "PATTERNS.md",\n'
  printf '    "PRIMITIVES.md",\n'
  printf '    "docs/*.html",\n'
  printf '    "ai/*.md"\n'
  printf '  ],\n'
  printf '  "source_map": "ai/knowledge-map.json",\n'
  printf '  "files": {\n'
  printf '    "knowledge": "%s",\n' "$KNOWLEDGE"
  printf '    "rules": "%s",\n' "$RULES"
  printf '    "examples": "%s"\n' "$EXAMPLES"
  printf '  },\n'
  printf '  "chunks": [\n'
  awk -F '\t' '
    {
      if (NR > 1) printf ",\n";
      printf "    {\"source_path\":\"%s\",\"source_group\":\"%s\",\"chunk_path\":\"%s\"}", $1, $2, $3
    }
  ' "$SOURCE_INDEX"
  printf '\n  ],\n'
  printf '  "chunk_count": %s\n' "$CHUNK_COUNT"
  printf '}\n'
} > "$MANIFEST"

rm -f "$SOURCE_INDEX" "$OUT_DIR/.chunk-body"

echo "PASS: exported AI knowledge to $OUT_DIR"
echo "PASS: wrote $CHUNK_COUNT chunks"
