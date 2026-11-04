# Conservative CSS output formatting; this is not a token/value minifier.
# Only standalone non-license comments, blank lines and unprotected leading
# indentation are removed. Strings, functions, URLs, attribute selectors,
# declaration values and inline comments are copied verbatim.

function fail(message) {
  print "CSS compaction failed: " message > "/dev/stderr"
  exit 1
}

function emit(text, tail) {
  output = output text
  tail = text
  if (index(tail, "\n")) sub(/^.*\n/, "", tail)
  if (index(text, "\n")) line_start = (tail ~ /^[ \t\r]*$/)
  else if (tail !~ /^[ \t\r]*$/) line_start = 0
}

function comment_end(start, offset) {
  offset = index(substr(css, start + 2), "*/")
  if (!offset) fail("unterminated comment")
  return start + offset + 3
}

function string_end(start, quote, j, c) {
  quote = substr(css, start, 1)
  for (j = start + 1; j <= length(css); j++) {
    c = substr(css, j, 1)
    if (c == "\\") {
      if (substr(css, j + 1, 2) == "\r\n") j++
      j++; continue
    }
    if (c == quote) return j + 1
    if (c == "\n" || c == "\r") fail("unescaped newline in string")
  }
  fail("unterminated string")
}

function url_end(start, j, c) {
  # start points to the opening parenthesis of url(). Unquoted URLs may
  # contain literal comment-looking text; never treat it as a CSS comment.
  j = start + 1
  while (substr(css, j, 1) ~ /[ \t\r\n]/ && j <= length(css)) j++
  c = substr(css, j, 1)
  if (c == "\"" || c == "\047") {
    j = string_end(j)
    while (substr(css, j, 1) ~ /[ \t\r\n]/ && j <= length(css)) j++
    if (substr(css, j, 1) != ")") fail("unterminated quoted URL")
    return j + 1
  }
  for (; j <= length(css); j++) {
    c = substr(css, j, 1)
    if (c == "\\") { j++; continue }
    if (c == ")") return j + 1
  }
  fail("unterminated URL")
}

function sensitive_end(start, value, j, c, top, closing, previous, stack) {
  # Copy a balanced component or an entire declaration value. A pseudo-class
  # inside a nested rule can conservatively protect more text than necessary.
  top = 0
  for (j = start; j <= length(css);) {
    c = substr(css, j, 1)
    if (value && !top && (c == ";" || c == "}")) return j
    if (c == "\\") { j += 2; continue }
    if (c == "\"" || c == "\047") { j = string_end(j); continue }
    if (substr(css, j, 2) == "/*") { j = comment_end(j); continue }
    previous = j > 1 ? substr(css, j - 1, 1) : ""
    if (tolower(substr(css, j, 4)) == "url(" && previous !~ /[a-zA-Z0-9_-]/) {
      j = url_end(j + 3); continue
    }
    if (c == "(" || c == "[" || c == "{") {
      stack[++top] = c == "(" ? ")" : (c == "[" ? "]" : "}")
    } else if (c == ")" || c == "]" || c == "}") {
      if (!top || stack[top] != c) fail("unbalanced protected component")
      delete stack[top--]
      if (!value && !top) return j + 1
    }
    j++
  }
  if (top || !value) fail("unterminated protected component")
  return j
}

{ css = css $0 "\n" }

END {
  line_start = 1
  braces = 0
  for (i = 1; i <= length(css);) {
    c = substr(css, i, 1)
    if (c == "\\") {
      emit(substr(css, i, 2)); i += 2; continue
    }
    if (c == "\"" || c == "\047") {
      end = string_end(i); emit(substr(css, i, end - i)); i = end; continue
    }
    if (substr(css, i, 2) == "/*") {
      end = comment_end(i)
      comment = substr(css, i, end - i)
      suffix = substr(css, end)
      newline = index(substr(css, end), "\n")
      if (newline) suffix = substr(css, end, newline - 1)
      legal = (comment ~ /^\/\*[!#@]/ || tolower(comment) ~ /license|copyright|spdx|@preserve/)
      if (!line_start || suffix !~ /^[ \t\r]*$/ || legal) emit(comment)
      i = end; continue
    }
    if (c == "(" || c == "[") {
      if (c == "(" && i > 3 && tolower(substr(css, i - 3, 3)) == "url" && (i == 4 || substr(css, i - 4, 1) !~ /[a-zA-Z0-9_-]/)) end = url_end(i)
      else end = sensitive_end(i, 0)
      emit(substr(css, i, end - i)); i = end; continue
    }
    if (c == ":" && braces) {
      emit(c)
      end = sensitive_end(i + 1, 1)
      emit(substr(css, i + 1, end - i - 1)); i = end; continue
    }
    if (c == "{") braces++
    if (c == "}" && --braces < 0) fail("unmatched closing brace")
    if (c == ")" || c == "]") fail("unmatched closing delimiter")
    if (c == "\n") {
      if (!line_start) emit(c)
    } else if (!(line_start && c ~ /[ \t\r]/)) emit(c)
    i++
  }
  if (braces) fail("unterminated rule block")
  printf "%s", output
}
