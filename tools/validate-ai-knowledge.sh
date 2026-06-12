#!/usr/bin/env sh
set -eu

OUT_DIR="build/ai-knowledge"
MANIFEST="$OUT_DIR/manifest.json"
KNOWLEDGE="$OUT_DIR/webblocks-ui-knowledge.md"
RULES="$OUT_DIR/webblocks-ui-rules.md"
EXAMPLES="$OUT_DIR/webblocks-ui-examples.md"
ADVISOR_PROMPT="$OUT_DIR/advisor-system-prompt.md"
SYNC_PLAN="$OUT_DIR/vector-store-sync-plan.json"
SYNC_REPORT="$OUT_DIR/vector-store-sync-report.json"
CHUNKS_DIR="$OUT_DIR/chunks"
SYNC_CLIENT="tools/sync-ai-knowledge-vector-store.php"
SYNC_EXAMPLE_ENV="tools/vector-store-sync.example.env"
FAILED=0

pass() {
  echo "PASS: $1"
}

fail() {
  echo "FAIL: $1" >&2
  FAILED=1
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
check_file "$ADVISOR_PROMPT"
check_file "$SYNC_PLAN"
check_file "$SYNC_CLIENT"
check_file "$SYNC_EXAMPLE_ENV"

if [ -d "$CHUNKS_DIR" ] && find "$CHUNKS_DIR" -type f -name '*.md' | grep -q .; then
  pass "$CHUNKS_DIR contains chunk markdown files"
else
  fail "$CHUNKS_DIR is missing or empty"
fi

if [ -d "$CHUNKS_DIR" ]; then
  FRONT_MATTER_FAILED=0
  for file in "$CHUNKS_DIR"/*.md; do
    [ -f "$file" ] || continue
    if ! sed -n '1,7p' "$file" | grep -Eq '^---$'; then
      echo "$file"
      FRONT_MATTER_FAILED=1
      continue
    fi
    for key in source_path source_group content_type priority generated_at; do
      if ! sed -n '1,7p' "$file" | grep -Eq "^$key: .+"; then
        echo "$file missing $key"
        FRONT_MATTER_FAILED=1
      fi
    done
  done
  if [ "$FRONT_MATTER_FAILED" -eq 0 ]; then
    pass "all chunks start with required front matter"
  else
    fail "one or more chunks have invalid front matter"
  fi
fi

if [ -f "$MANIFEST" ] && [ -d "$CHUNKS_DIR" ]; then
  manifest_count="$(grep -o '"path":"build/ai-knowledge/chunks/[^"]*"' "$MANIFEST" | wc -l | sed 's/[[:space:]]//g')"
  file_count="$(find "$CHUNKS_DIR" -type f -name '*.md' | wc -l | sed 's/[[:space:]]//g')"
  if [ "$manifest_count" = "$file_count" ]; then
    pass "manifest chunk count matches chunk file count ($file_count)"
  else
    fail "manifest chunk count ($manifest_count) does not match chunk file count ($file_count)"
  fi

  if grep -q '"sha256":"' "$MANIFEST" && grep -q '"bytes":' "$MANIFEST"; then
    pass "manifest contains sha256 and bytes metadata"
  else
    fail "manifest is missing sha256 or bytes metadata"
  fi
fi

if [ -d "$OUT_DIR" ]; then
  if grep -R -n -E '/Users/|/Users/osm/' "$OUT_DIR" >/tmp/webblocks-ai-knowledge-local-paths.$$ 2>/dev/null; then
    cat /tmp/webblocks-ai-knowledge-local-paths.$$
    fail "export contains local absolute paths"
  else
    pass "no local absolute paths found"
  fi
  rm -f /tmp/webblocks-ai-knowledge-local-paths.$$

  if grep -R -n -E 'OPENAI_API_KEY|(^|[^A-Za-z0-9_-])sk-[A-Za-z0-9_-]{16,}|assistant_id|vector_store_id' "$OUT_DIR" >/tmp/webblocks-ai-knowledge-private.$$ 2>/dev/null; then
    cat /tmp/webblocks-ai-knowledge-private.$$
    fail "export contains private/API leakage risk patterns"
  else
    pass "no private/API leakage risk patterns found"
  fi
else
  fail "$OUT_DIR is missing"
fi

if [ -f "$SYNC_CLIENT" ]; then
  if grep -n -E 'sk-[A-Za-z0-9_-]{16,}|OPENAI_API_KEY=[^[:space:]]+|Bearer[[:space:]]+[A-Za-z0-9._-]{16,}' "$SYNC_CLIENT" >/tmp/webblocks-ai-knowledge-sync-private.$$ 2>/dev/null; then
    cat /tmp/webblocks-ai-knowledge-sync-private.$$
    fail "sync client contains hardcoded API key/token risk patterns"
  else
    pass "sync client contains no hardcoded API key/token risk patterns"
  fi
  rm -f /tmp/webblocks-ai-knowledge-sync-private.$$

  if grep -q "build/ai-knowledge/vector-store-sync-report.json" "$SYNC_CLIENT" \
    && grep -q "build/ai-knowledge/vector-store-sync-state.json" "$SYNC_CLIENT"; then
    pass "sync client writes report/state under build/ai-knowledge"
  else
    fail "sync client report/state paths are not under build/ai-knowledge"
  fi

  if grep -n -E '/Users/|/Users/osm/' "$SYNC_CLIENT" >/tmp/webblocks-ai-knowledge-sync-paths.$$ 2>/dev/null; then
    cat /tmp/webblocks-ai-knowledge-sync-paths.$$
    fail "sync client contains local absolute paths"
  else
    pass "sync client contains no local absolute paths"
  fi
  rm -f /tmp/webblocks-ai-knowledge-sync-paths.$$

  env_line="$(grep -n "env_required('OPENAI_API_KEY')" "$SYNC_CLIENT" | sed 's/:.*//' | head -n 1)"
  dry_run_exit_line="$(grep -n "exit(\$errorCount === 0 ? 0 : 1);" "$SYNC_CLIENT" | sed 's/:.*//' | head -n 1)"
  if [ -n "$env_line" ] && [ -n "$dry_run_exit_line" ] && [ "$env_line" -gt "$dry_run_exit_line" ]; then
    pass "sync client does not require OPENAI_API_KEY before dry-run exits"
  else
    fail "sync client may require OPENAI_API_KEY before dry-run exits"
  fi

  if grep -q "'upload_candidates' =>" "$SYNC_CLIENT" \
    && grep -q "'skipped' =>" "$SYNC_CLIENT" \
    && grep -q "'errors' =>" "$SYNC_CLIENT"; then
    pass "sync client report includes upload_candidates, skipped, and errors"
  else
    fail "sync client report is missing upload_candidates, skipped, or errors"
  fi

  if command -v php >/dev/null 2>&1; then
    if php "$SYNC_CLIENT" --dry-run >/tmp/webblocks-ai-knowledge-sync-dry-run.$$ 2>&1; then
      if grep -n -E 'OPENAI_API_KEY|WEBBLOCKS_UI_VECTOR_STORE_ID|(^|[^A-Za-z0-9_-])sk-[A-Za-z0-9_-]{16,}|vector_store_id' /tmp/webblocks-ai-knowledge-sync-dry-run.$$ >/tmp/webblocks-ai-knowledge-sync-dry-run-private.$$ 2>/dev/null; then
        cat /tmp/webblocks-ai-knowledge-sync-dry-run-private.$$
        fail "sync client dry-run output contains private/API leakage risk patterns"
      else
        pass "sync client dry-run output contains no private/API leakage risk patterns"
      fi
      rm -f /tmp/webblocks-ai-knowledge-sync-dry-run-private.$$
    else
      cat /tmp/webblocks-ai-knowledge-sync-dry-run.$$
      fail "sync client dry-run failed during validation"
    fi
    rm -f /tmp/webblocks-ai-knowledge-sync-dry-run.$$
  else
    fail "php is required to validate sync client dry-run output"
  fi
fi

if [ -f "$SYNC_REPORT" ]; then
  for key in mode checked_at total_files total_bytes upload_candidates skipped errors files; do
    if grep -q "\"$key\"" "$SYNC_REPORT"; then
      pass "sync report contains $key"
    else
      fail "sync report is missing $key"
    fi
  done

  if grep -n -E 'OPENAI_API_KEY|WEBBLOCKS_UI_VECTOR_STORE_ID|(^|[^A-Za-z0-9_-])sk-[A-Za-z0-9_-]{16,}|vector_store_id' "$SYNC_REPORT" >/tmp/webblocks-ai-knowledge-report-private.$$ 2>/dev/null; then
    cat /tmp/webblocks-ai-knowledge-report-private.$$
    fail "sync report contains private/API leakage risk patterns"
  else
    pass "sync report contains no private/API leakage risk patterns"
  fi
  rm -f /tmp/webblocks-ai-knowledge-report-private.$$
else
  pass "$SYNC_REPORT not present yet; run sync dry-run to generate it"
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
  if [ -f "$KNOWLEDGE" ] && grep -R -q "$term" "$KNOWLEDGE" "$RULES" "$EXAMPLES" "$ADVISOR_PROMPT"; then
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
  if grep -q "$term" "$RULES" "$ADVISOR_PROMPT"; then
    pass "forbidden vocabulary carried in rules/advisor context: $term"
  else
    fail "forbidden vocabulary missing from rules/advisor context: $term"
  fi
done

if [ -d "$OUT_DIR" ]; then
  if grep -R -n -i -E '(^|[^a-z])(use|prefer|recommended|canonical)[^.\n]*(wb-panel|wb-box)' "$OUT_DIR" \
    | grep -vi -E 'do not|don.t|must not|forbidden|anti-pattern|not as|instead of' >/tmp/webblocks-ai-knowledge-forbidden-use.$$ 2>/dev/null; then
    cat /tmp/webblocks-ai-knowledge-forbidden-use.$$
    fail "export teaches wb-panel or wb-box as canonical/recommended use"
  else
    pass "no canonical use recommendation found for wb-panel or wb-box"
  fi
  rm -f /tmp/webblocks-ai-knowledge-forbidden-use.$$
fi

if [ "$FAILED" -eq 0 ]; then
  echo "PASS: AI knowledge export validation completed"
  exit 0
fi

echo "FAIL: AI knowledge export validation failed" >&2
exit 1
