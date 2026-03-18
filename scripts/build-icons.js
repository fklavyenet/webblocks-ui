#!/usr/bin/env node
// WebBlocks UI — Icon Build Script
//
// Reads src/css/icons/webblocks-icons.svg (source of truth),
// copies it to dist/, and generates dist/webblocks-icons.css.
//
// Run via:  node scripts/build-icons.js  (or ./build.sh)
//
// To update the icon list from Lucide CDN, run:
//   node scripts/update-icons.js

const fs   = require('fs');
const path = require('path');

const ROOT     = path.join(__dirname, '..');
const SRC_SVG  = path.join(ROOT, 'src', 'css', 'icons', 'webblocks-icons.svg');
const DIST_DIR = path.join(ROOT, 'dist');
const DIST_SVG = path.join(DIST_DIR, 'webblocks-icons.svg');
const DIST_CSS = path.join(DIST_DIR, 'webblocks-icons.css');

// ── Read source SVG ──────────────────────────────────────────
if (!fs.existsSync(SRC_SVG)) {
  console.error(`Error: source file not found: ${SRC_SVG}`);
  console.error('Run: node scripts/update-icons.js  to generate it.');
  process.exit(1);
}

const svg = fs.readFileSync(SRC_SVG, 'utf8');

// ── Extract symbol IDs and their path data ───────────────────
// Match each <symbol id="wb-icon-*">...</symbol>
const symbolRe = /<symbol\s+id="(wb-icon-[^"]+)"[^>]*>([\s\S]*?)<\/symbol>/g;
const icons = [];
let m;
while ((m = symbolRe.exec(svg)) !== null) {
  icons.push({ id: m[1], inner: m[2].trim() });
}

if (icons.length === 0) {
  console.error('Error: no <symbol> elements found in source SVG.');
  process.exit(1);
}

// ── Copy SVG to dist/ ────────────────────────────────────────
fs.mkdirSync(DIST_DIR, { recursive: true });
fs.copyFileSync(SRC_SVG, DIST_SVG);
console.log(`Generated dist/webblocks-icons.svg — ${icons.length} icons`);

// ── Generate CSS mask-image file ─────────────────────────────
// Allows Bootstrap-style usage: <i class="wb-icon wb-icon-settings"></i>

function toDataUri(inner) {
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const encoded = svgStr
    .replace(/"/g, "'")
    .replace(/#/g, '%23')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E');
  return `url("data:image/svg+xml,${encoded}")`;
}

let cssRules = `/* ============================================================
   WebBlocks UI — Icon Font-Style CSS
   Auto-generated from src/css/icons/webblocks-icons.svg

   Bootstrap-style usage:
     <i class="wb-icon wb-icon-settings"></i>
     <i class="wb-icon wb-icon-settings wb-icon-lg wb-icon-accent"></i>

   All size and color helpers from icons.css apply:
     wb-icon-xs / sm / lg / xl / 2xl
     wb-icon-accent / success / warning / danger / info / muted
     wb-icon-btn (icon + text inline)
     wb-icon-wrap (colored badge background)
   ============================================================ */

`;

for (const { id, inner } of icons) {
  const uri = toDataUri(inner);
  cssRules += `.${id} {\n  -webkit-mask-image: ${uri};\n  mask-image: ${uri};\n}\n`;
}

fs.writeFileSync(DIST_CSS, cssRules, 'utf8');
const cssCount = icons.length;
console.log(`Generated dist/webblocks-icons.css — ${cssCount} icon classes`);
