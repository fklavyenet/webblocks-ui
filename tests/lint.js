#!/usr/bin/env node
/**
 * WebBlocks UI — Static Lint Checks
 *
 * Checks:
 *   1. All CSS files referenced in build.sh exist on disk
 *   2. All JS files referenced in build.sh exist on disk
 *   3. No hardcoded colors (#xxx / rgb()) in component CSS (tokens only)
 *   4. No missing spacing tokens (var(--wb-sN) where N not defined)
 *   5. dist/ files are up-to-date with src/ (mtime check)
 */

const fs   = require('fs');
const path = require('path');

const ROOT   = path.resolve(__dirname, '..');
const SRC    = path.join(ROOT, 'src');
const DIST   = path.join(ROOT, 'dist');
const BUILD  = path.join(ROOT, 'build.sh');

let errors = 0;
let warnings = 0;

function fail(msg)  { console.error('  FAIL  ' + msg); errors++; }
function warn(msg)  { console.warn ('  WARN  ' + msg); warnings++; }
function ok(msg)    { console.log  ('  OK    ' + msg); }

// ── 1. Files referenced in build.sh exist ─────────────────
console.log('\n[1] Files referenced in build.sh');
const buildSh = fs.readFileSync(BUILD, 'utf8');
const refFiles = [];

// Extract src/** paths — build.sh uses $ROOT/src/... absolute paths
const catMatches = buildSh.matchAll(/\$ROOT\/(src\/\S+\.(?:css|js))/g);
for (const m of catMatches) {
  refFiles.push(m[1]);
}

for (const rel of refFiles) {
  const abs = path.join(ROOT, rel);
  if (fs.existsSync(abs)) {
    ok(rel);
  } else {
    fail(rel + ' — referenced in build.sh but does not exist');
  }
}

// ── 2. No hardcoded colors in component CSS ────────────────
console.log('\n[2] No hardcoded colors in component CSS');
const componentDir = path.join(SRC, 'css/components');
const componentFiles = fs.readdirSync(componentDir).filter(f => f.endsWith('.css'));

const hardcodedColor = /#[0-9a-fA-F]{3,6}\b|rgba?\(\s*\d/g;
const allowList = ['tokens.css', 'dark.css', 'accents.css'];

for (const file of componentFiles) {
  if (allowList.includes(file)) continue;
  const abs = path.join(componentDir, file);
  const content = fs.readFileSync(abs, 'utf8');
  const lines = content.split('\n');
  let clean = true;
  lines.forEach((line, i) => {
    // Skip comment lines
    if (line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().startsWith('//')) return;
    const m = line.match(hardcodedColor);
    if (m) {
      warn(`components/${file}:${i + 1} — hardcoded color: ${m[0]}`);
      clean = false;
    }
  });
  if (clean) ok('components/' + file);
}

// ── 3. All var(--wb-sN) tokens are defined ────────────────
console.log('\n[3] Spacing token references are defined');
const tokensFile = path.join(SRC, 'css/foundation/tokens.css');
const tokensContent = fs.readFileSync(tokensFile, 'utf8');

// Extract defined tokens
const definedTokens = new Set();
for (const m of tokensContent.matchAll(/--wb-s(\d+)\s*:/g)) {
  definedTokens.add('--wb-s' + m[1]);
}

// Scan all CSS source files for var(--wb-sN)
const allCssFiles = [];
function walkCss(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) walkCss(path.join(dir, entry.name));
    else if (entry.name.endsWith('.css')) allCssFiles.push(path.join(dir, entry.name));
  }
}
walkCss(path.join(SRC, 'css'));

const missingTokens = new Set();
for (const file of allCssFiles) {
  const content = fs.readFileSync(file, 'utf8');
  for (const m of content.matchAll(/var\((--wb-s\d+)\)/g)) {
    const token = m[1];
    if (!definedTokens.has(token)) {
      missingTokens.add(token);
      const rel = path.relative(ROOT, file);
      warn(`${rel} uses undefined token ${token}`);
    }
  }
}
if (missingTokens.size === 0) ok('All spacing tokens are defined');

// ── 4. dist/ files are newer than src/ ───────────────────
console.log('\n[4] dist/ files are up-to-date');
const distCss  = path.join(DIST, 'webblocks-ui.css');
const distJs   = path.join(DIST, 'webblocks-ui.js');

function latestMtime(dir) {
  let latest = 0;
  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else {
        const mt = fs.statSync(full).mtimeMs;
        if (mt > latest) latest = mt;
      }
    }
  }
  walk(dir);
  return latest;
}

const srcMtime  = latestMtime(path.join(SRC, 'css'));
const jsMtime   = latestMtime(path.join(SRC, 'js'));
const srcLatest = Math.max(srcMtime, jsMtime);

const cssDist = fs.existsSync(distCss) ? fs.statSync(distCss).mtimeMs : 0;
const jsDist  = fs.existsSync(distJs)  ? fs.statSync(distJs).mtimeMs  : 0;

if (cssDist >= srcLatest) ok('dist/webblocks-ui.css is up-to-date');
else warn('dist/webblocks-ui.css may be stale — run ./build.sh');

if (jsDist >= srcLatest) ok('dist/webblocks-ui.js is up-to-date');
else warn('dist/webblocks-ui.js may be stale — run ./build.sh');

// ── Summary ───────────────────────────────────────────────
console.log('\n─────────────────────────────────');
if (errors === 0 && warnings === 0) {
  console.log('All lint checks passed.');
} else {
  if (errors > 0)   console.error(`${errors} error(s) found.`);
  if (warnings > 0) console.warn(`${warnings} warning(s) found.`);
}
console.log('─────────────────────────────────\n');

process.exit(errors > 0 ? 1 : 0);
