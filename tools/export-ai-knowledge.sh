#!/usr/bin/env sh
set -eu

OUT_DIR="build/ai-knowledge"
CHUNKS_DIR="$OUT_DIR/chunks"
MANIFEST="$OUT_DIR/manifest.json"
SYNC_PLAN="$OUT_DIR/vector-store-sync-plan.json"
ADVISOR_PROMPT="$OUT_DIR/advisor-system-prompt.md"
KNOWLEDGE="$OUT_DIR/webblocks-ui-knowledge.md"
RULES="$OUT_DIR/webblocks-ui-rules.md"
EXAMPLES="$OUT_DIR/webblocks-ui-examples.md"

if [ ! -f "ai/knowledge-map.json" ] || [ ! -d "packages/webblocks/src" ]; then
  echo "FAIL: run this script from the WebBlocks UI repository root." >&2
  exit 1
fi

for cmd in awk sed find sort wc shasum; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "FAIL: $cmd is required." >&2
    exit 1
  fi
done

TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

rm -rf "$OUT_DIR"
mkdir -p "$CHUNKS_DIR"

SOURCE_INDEX="$OUT_DIR/.source-index.tsv"
: > "$SOURCE_INDEX"

slugify() {
  printf '%s' "$1" | sed 's#[^A-Za-z0-9._-]#-#g; s#--*#-#g; s#^-##; s#-$##'
}

json_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

sha256_file() {
  shasum -a 256 "$1" | awk '{ print $1 }'
}

bytes_file() {
  wc -c < "$1" | sed 's/[[:space:]]//g'
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

content_type_for() {
  case "$1" in
    ai/DOWNSTREAM_USAGE_RULES.md|ai/FORBIDDEN_PATTERNS.md|ai/REVIEW_CHECKLIST.md|ai/RESPONSE_FORMATS.md|ai/WEBBLOCKS_UI_EXPERT.md)
      printf '%s\n' "rules" ;;
    ai/EXAMPLES.md)
      printf '%s\n' "example" ;;
    PATTERNS.md|docs/pattern-*.html)
      printf '%s\n' "pattern" ;;
    PRIMITIVES.md)
      printf '%s\n' "primitive" ;;
    INTEGRATION.md|packages/webblocks/INTEGRATION.md)
      printf '%s\n' "integration" ;;
    docs/admin-product-brand.md)
      printf '%s\n' "brand_standard" ;;
    packages/webblocks/src/css/*)
      printf '%s\n' "source_css" ;;
    packages/webblocks/src/js/*)
      printf '%s\n' "source_js" ;;
    packages/webblocks/dist/webblocks-icons.json)
      printf '%s\n' "icon_registry" ;;
    packages/webblocks/dist/*)
      printf '%s\n' "dist" ;;
    docs/*.html)
      printf '%s\n' "docs" ;;
    *)
      printf '%s\n' "other" ;;
  esac
}

priority_for() {
  case "$1" in
    packages/webblocks/src/*) printf '%s\n' "1" ;;
    packages/webblocks/dist/*) printf '%s\n' "2" ;;
    packages/webblocks/INTEGRATION.md) printf '%s\n' "3" ;;
    INTEGRATION.md) printf '%s\n' "4" ;;
    PATTERNS.md) printf '%s\n' "5" ;;
    PRIMITIVES.md) printf '%s\n' "6" ;;
    docs/*.html|docs/admin-product-brand.md) printf '%s\n' "7" ;;
    ai/*.md|ai/knowledge-map.json) printf '%s\n' "8" ;;
    *) printf '%s\n' "9" ;;
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
  content_type="$4"
  priority="$5"
  body_file="$6"
  slug="$(slugify "$src")"
  chunk="$CHUNKS_DIR/$slug.md"

  {
    printf '%s\n' "---"
    printf 'source_path: %s\n' "$src"
    printf 'source_group: %s\n' "$group"
    printf 'content_type: %s\n' "$content_type"
    printf 'priority: %s\n' "$priority"
    printf 'generated_at: %s\n' "$TS"
    printf '%s\n' "---"
    printf '\n# %s\n\n' "$title"
    cat "$body_file"
    printf '\n'
  } > "$chunk"

  sha="$(sha256_file "$chunk")"
  bytes="$(bytes_file "$chunk")"
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$chunk" "$src" "$group" "$title" "$content_type" "$priority" "$sha" "$bytes" >> "$SOURCE_INDEX"
}

add_file() {
  src="$1"
  [ -f "$src" ] || return 0
  group="$(source_group_for "$src")"
  content_type="$(content_type_for "$src")"
  priority="$(priority_for "$src")"
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

  write_chunk "$src" "$group" "$src" "$content_type" "$priority" "$tmp"
}

add_dir_files() {
  dir="$1"
  [ -d "$dir" ] || return 0
  find "$dir" -type f \( -name '*.css' -o -name '*.js' -o -name '*.svg' \) ! -name '.DS_Store' | sort | while IFS= read -r file; do
    add_file "$file"
  done
}

write_advisor_prompt() {
  cat > "$ADVISOR_PROMPT" <<EOF
# WebBlocks UI Advisor System Prompt

You are a WebBlocks UI advisor. Use shipped WebBlocks UI patterns, surfaces, primitives, utilities, and JavaScript hooks. Do not invent a parallel UI system or replace WebBlocks UI with project-local abstractions.

Source priority:
1. \`packages/webblocks/src/\`
2. \`packages/webblocks/dist/\`
3. \`packages/webblocks/INTEGRATION.md\`
4. \`INTEGRATION.md\`
5. \`PATTERNS.md\`
6. \`PRIMITIVES.md\`
7. \`docs/*.html\`
8. \`ai/*.md\`

Canonical standards:
- Use \`wb-dashboard-shell\` for admin and dashboard screens.
- Use \`wb-auth-shell\` for auth screens.
- Use \`wb-settings-shell\` for settings screens.
- Use \`wb-card\` as the canonical framed surface.
- Use \`wb-modal\` for dialogs and confirmation flows.
- Use \`wb-toast\` for transient success and info feedback.
- Use \`wb-alert\` for validation, blocking, persistent, or user-correctable feedback.
- Use \`td.wb-table-actions\` with \`wb-action-group\` for row actions.

Forbidden patterns:
- Do not use browser \`confirm()\`.
- Do not use \`wb-panel\` or \`wb-box\` as canonical surfaces.
- Do not create duplicated modal roots or custom overlay stacks.
- Do not introduce Tailwind, Vite, React, Vue, Inertia, or Livewire UI layers to replace WebBlocks UI vocabulary.

Answer format:
- Start with the recommended WebBlocks UI structure or decision.
- Include concise HTML/CSS/JS only when it helps implementation.
- Call out forbidden replacements only as corrections or review findings.
- Prefer direct, source-grounded guidance over broad UI theory.
EOF
}

write_base_exports() {
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
}

write_manifest() {
  chunk_count="$(wc -l < "$SOURCE_INDEX" | sed 's/[[:space:]]//g')"
  advisor_sha="$(sha256_file "$ADVISOR_PROMPT")"
  advisor_bytes="$(bytes_file "$ADVISOR_PROMPT")"

  {
    printf '{\n'
    printf '  "generated_at": "%s",\n' "$TS"
    printf '  "schema": "webblocks-ui-ai-knowledge-export-v2",\n'
    printf '  "purpose": "Static public-safe AI knowledge export for RAG/vector-store preparation. No API calls and no vector store creation.",\n'
    printf '  "output_dir": "%s",\n' "$OUT_DIR"
    printf '  "source_map": "ai/knowledge-map.json",\n'
    printf '  "source_priority": [\n'
    printf '    {"path": "packages/webblocks/src/", "priority": 1},\n'
    printf '    {"path": "packages/webblocks/dist/", "priority": 2},\n'
    printf '    {"path": "packages/webblocks/INTEGRATION.md", "priority": 3},\n'
    printf '    {"path": "INTEGRATION.md", "priority": 4},\n'
    printf '    {"path": "PATTERNS.md", "priority": 5},\n'
    printf '    {"path": "PRIMITIVES.md", "priority": 6},\n'
    printf '    {"path": "docs/*.html", "priority": 7},\n'
    printf '    {"path": "ai/*.md", "priority": 8}\n'
    printf '  ],\n'
    printf '  "files": {\n'
    printf '    "knowledge": "%s",\n' "$KNOWLEDGE"
    printf '    "rules": "%s",\n' "$RULES"
    printf '    "examples": "%s",\n' "$EXAMPLES"
    printf '    "advisor_system_prompt": "%s",\n' "$ADVISOR_PROMPT"
    printf '    "vector_store_sync_plan": "%s"\n' "$SYNC_PLAN"
    printf '  },\n'
    printf '  "chunks": [\n'
    awk -F '\t' '
      {
        if (NR > 1) printf ",\n";
        printf "    {\"path\":\"%s\",\"source_path\":\"%s\",\"source_group\":\"%s\",\"title\":\"%s\",\"content_type\":\"%s\",\"priority\":%s,\"sha256\":\"%s\",\"bytes\":%s}", $1, $2, $3, $4, $5, $6, $7, $8
      }
    ' "$SOURCE_INDEX"
    printf '\n  ],\n'
    printf '  "chunk_count": %s,\n' "$chunk_count"
    printf '  "advisor_system_prompt": {\n'
    printf '    "path": "%s",\n' "$ADVISOR_PROMPT"
    printf '    "source_path": "ai/RESPONSE_FORMATS.md",\n'
    printf '    "source_group": "ai_contract",\n'
    printf '    "title": "WebBlocks UI Advisor System Prompt",\n'
    printf '    "content_type": "rules",\n'
    printf '    "priority": 8,\n'
    printf '    "sha256": "%s",\n' "$advisor_sha"
    printf '    "bytes": %s\n' "$advisor_bytes"
    printf '  }\n'
    printf '}\n'
  } > "$MANIFEST"
}

write_sync_plan() {
  advisor_sha="$(sha256_file "$ADVISOR_PROMPT")"
  advisor_bytes="$(bytes_file "$ADVISOR_PROMPT")"

  {
    printf '{\n'
    printf '  "generated_at": "%s",\n' "$TS"
    printf '  "mode": "dry_run",\n'
    printf '  "purpose": "List files and metadata prepared for a future vector store upload. This file performs no API calls.",\n'
    printf '  "files": [\n'
    awk -F '\t' '
      {
        if (NR > 1) printf ",\n";
        printf "    {\"file_path\":\"%s\",\"source_path\":\"%s\",\"source_group\":\"%s\",\"content_type\":\"%s\",\"priority\":%s,\"sha256\":\"%s\",\"bytes\":%s}", $1, $2, $3, $5, $6, $7, $8
      }
    ' "$SOURCE_INDEX"
    if [ -s "$SOURCE_INDEX" ]; then
      printf ',\n'
    fi
    printf '    {"file_path":"%s","source_path":"ai/RESPONSE_FORMATS.md","source_group":"ai_contract","content_type":"rules","priority":8,"sha256":"%s","bytes":%s}\n' "$ADVISOR_PROMPT" "$advisor_sha" "$advisor_bytes"
    printf '  ]\n'
    printf '}\n'
  } > "$SYNC_PLAN"
}

write_base_exports
write_advisor_prompt

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
add_file "docs/admin-product-brand.md"
for file in ai/README.md ai/WEBBLOCKS_UI_EXPERT.md ai/DOWNSTREAM_USAGE_RULES.md ai/REVIEW_CHECKLIST.md ai/FORBIDDEN_PATTERNS.md ai/RESPONSE_FORMATS.md ai/EXAMPLES.md ai/DOWNSTREAM_AGENT_BLOCK.md; do
  add_file "$file"
done
add_file "ai/knowledge-map.json"

{
  printf '\n## Chunks\n\n'
  awk -F '\t' '{ printf "- `%s` (%s, %s, priority %s) -> `%s`\n", $2, $3, $5, $6, $1 }' "$SOURCE_INDEX"
} >> "$KNOWLEDGE"

write_sync_plan
write_manifest

chunk_count="$(wc -l < "$SOURCE_INDEX" | sed 's/[[:space:]]//g')"
rm -f "$SOURCE_INDEX" "$OUT_DIR/.chunk-body"

echo "PASS: exported AI knowledge to $OUT_DIR"
echo "PASS: wrote $chunk_count chunks"
echo "PASS: wrote advisor system prompt"
echo "PASS: wrote vector-store sync plan dry run"
