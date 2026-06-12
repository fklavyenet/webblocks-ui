#!/usr/bin/env sh
set -eu

OUT_DIR="build/ai-knowledge"
MANIFEST="$OUT_DIR/manifest.json"
KNOWLEDGE="$OUT_DIR/webblocks-ui-knowledge.md"
RULES="$OUT_DIR/webblocks-ui-rules.md"
EXAMPLES="$OUT_DIR/webblocks-ui-examples.md"
CHUNKS_DIR="$OUT_DIR/chunks"
FAILED=0

pass() {
  echo "PASS: $1"
}

fail() {
  echo "FAIL: $1" >&2
  FAILED=1
}

warn() {
  echo "WARN: $1"
}

check_file() {
  if [ -f "$1" ]; then
    pass "$1 exists"
  else
    fail "$1 is missing"
  fi
}

check_file "$MANIFEST"
check_file "$KNOWLEDGE"
check_file "$RULES"
check_file "$EXAMPLES"

if [ -d "$CHUNKS_DIR" ] && find "$CHUNKS_DIR" -type f -name '*.md' | grep -q .; then
  pass "$CHUNKS_DIR contains chunk markdown files"
else
  fail "$CHUNKS_DIR is missing or empty"
fi

if [ -d "$OUT_DIR" ]; then
  if grep -R -n -E '/Users/|/Users/osm/' "$OUT_DIR" >/tmp/webblocks-ai-knowledge-local-paths.$$ 2>/dev/null; then
    cat /tmp/webblocks-ai-knowledge-local-paths.$$
    fail "export contains local absolute paths"
  else
    pass "no local absolute paths found"
  fi
  rm -f /tmp/webblocks-ai-knowledge-local-paths.$$

  if grep -R -n -E 'OPENAI_API_KEY|(^|[^A-Za-z0-9_-])sk-[A-Za-z0-9_-]{16,}|vector_store|assistant_id' "$OUT_DIR" >/tmp/webblocks-ai-knowledge-private.$$ 2>/dev/null; then
    cat /tmp/webblocks-ai-knowledge-private.$$
    fail "export contains private/API leakage risk patterns"
  else
    pass "no private/API leakage risk patterns found"
  fi
else
  fail "$OUT_DIR is missing"
fi

for term in \
  wb-dashboard-shell \
  wb-auth-shell \
  wb-settings-shell \
  wb-card \
  wb-modal \
  wb-table-actions \
  wb-action-group \
  wb-toast \
  wb-alert
do
  if [ -f "$KNOWLEDGE" ] && grep -R -q "$term" "$KNOWLEDGE" "$RULES" "$EXAMPLES"; then
    pass "canonical vocabulary present: $term"
  else
    fail "canonical vocabulary missing: $term"
  fi
done

for term in \
  "wb-panel" \
  "wb-box" \
  "browser confirm" \
  "duplicated modal roots" \
  "Tailwind" \
  "Vite" \
  "React" \
  "Vue" \
  "Livewire" \
  "Inertia"
do
  if [ -f "$RULES" ] && grep -q "$term" "$RULES"; then
    pass "forbidden context carried in rules: $term"
  else
    fail "forbidden context missing from rules: $term"
  fi
done

if [ -f "$EXAMPLES" ]; then
  PRIMARY_EXAMPLES="$(sed -n '/^## Primary Use\/Do Examples$/,/^## End Primary Use\/Do Examples$/p' "$EXAMPLES")"
  PRIMARY_FORBIDDEN="$(printf '%s\n' "$PRIMARY_EXAMPLES" | grep -E 'wb-panel|wb-box|browser confirm|duplicated modal roots|Tailwind|Vite|React|Vue|Livewire|Inertia' || true)"
  if [ -z "$PRIMARY_FORBIDDEN" ]; then
    pass "primary use/do examples do not teach forbidden vocabulary"
  else
    printf '%s\n' "$PRIMARY_FORBIDDEN"
    fail "primary use/do examples contain forbidden vocabulary"
  fi
else
  fail "$EXAMPLES is missing"
fi

if [ "$FAILED" -eq 0 ]; then
  echo "PASS: AI knowledge export validation completed"
  exit 0
fi

echo "FAIL: AI knowledge export validation failed" >&2
exit 1
