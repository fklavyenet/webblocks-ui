#!/usr/bin/env node
// WebBlocks UI — Icon Build Script
//
// Reads src/css/icons/webblocks-icons.svg (source icon source),
// and generates src/dist webblocks-icons.css.
//
// Run via:  node scripts/build-icons.js
//
// To update the icon list from Lucide CDN, run:
//   node scripts/update-icons.js

const fs   = require('fs');
const path = require('path');

const { ICON_REGISTRY, toLabel } = require('./icon-registry');

const ROOT     = path.join(__dirname, '..');
const SRC_SVG  = path.join(ROOT, 'src', 'css', 'icons', 'webblocks-icons.svg');
const SRC_CSS  = path.join(ROOT, 'src', 'css', 'icons', 'webblocks-icons.css');
const DIST_DIR = path.join(ROOT, 'dist');
const DIST_CSS = path.join(DIST_DIR, 'webblocks-icons.css');
const DIST_JSON = path.join(DIST_DIR, 'webblocks-icons.json');

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

const aliases = {
  'wb-icon-rotate-cw': [
    'wb-icon-refresh-cw',
    'wb-icon-refresh'
  ],
  'wb-icon-repeat': [
    'wb-icon-sync'
  ]
};

const registryByCssClass = new Map(ICON_REGISTRY.map((icon) => [icon.cssClass, icon]));

function buildManifestEntry(id) {
  const fallbackSlug = id.replace(/^wb-icon-/, '');
  const fallbackLabel = toLabel(fallbackSlug.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase()));
  const meta = registryByCssClass.get(id) || {
    slug: fallbackSlug,
    label: fallbackLabel,
    cssClass: id,
    source: 'webblocks-ui',
    categories: ['uncategorized'],
    contexts: [],
    keywords: fallbackSlug.split('-')
  };

  return {
    slug: meta.slug,
    label: meta.label,
    css_class: meta.cssClass,
    source: meta.source,
    categories: meta.categories,
    contexts: meta.contexts,
    keywords: meta.keywords
  };
}

function buildAliasSymbols() {
  const aliasSymbols = [];
  for (const { id, inner } of icons) {
    const names = aliases[id] || [];
    for (const alias of names) {
      if (alias === id) {
        continue;
      }
      const normalizedInner = inner
        .split('\n')
        .map((line) => line.trim())
        .join('\n    ');
      aliasSymbols.push(
        `  <symbol id="${alias}" viewBox="0 0 24 24" fill="none"\n` +
        `    stroke="currentColor" stroke-width="2"\n` +
        `    stroke-linecap="round" stroke-linejoin="round">\n` +
        `    ${normalizedInner}\n` +
        '  </symbol>'
      );
    }
  }
  return aliasSymbols;
}

const aliasSymbols = buildAliasSymbols();

// ── Prepare icon data for CSS generation ─────────────────────
fs.mkdirSync(DIST_DIR, { recursive: true });

// ── Generate CSS mask-image files ────────────────────────────
// Allows Bootstrap-style usage: <i class="wb-icon wb-icon-settings"></i>

function toDataUri(inner) {
  // Collapse newlines and extra whitespace so multi-line symbols produce valid single-line CSS URLs
  const flat = inner.replace(/\s*\n\s*/g, ' ').trim();
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${flat}</svg>`;
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

   Canonical usage:
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
  const names = [id].concat(aliases[id] || []);
  const selector = names.map((name) => `.${name}`).join(',\n');
  cssRules += `${selector} {\n  -webkit-mask-image: ${uri};\n  mask-image: ${uri};\n}\n`;
}

for (const symbol of aliasSymbols) {
  const match = symbol.match(/<symbol id="(wb-icon-[^"]+)"[\s\S]*?>([\s\S]*?)<\/symbol>/);
  if (!match) continue;
  const uri = toDataUri(match[2].trim());
  cssRules += `.${match[1]} {\n  -webkit-mask-image: ${uri};\n  mask-image: ${uri};\n}\n`;
}

fs.writeFileSync(SRC_CSS, cssRules, 'utf8');
console.log(`Generated src/css/icons/webblocks-icons.css — ${icons.length} glyphs, ${aliasSymbols.length} aliases`);

fs.writeFileSync(DIST_CSS, cssRules, 'utf8');
console.log(`Generated dist/webblocks-icons.css — ${icons.length} glyphs, ${aliasSymbols.length} aliases`);

const manifest = icons
  .map(({ id }) => buildManifestEntry(id))
  .sort((left, right) => left.slug.localeCompare(right.slug));

fs.writeFileSync(DIST_JSON, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`Generated dist/webblocks-icons.json — ${manifest.length} canonical icons`);
