#!/usr/bin/env node
// ⚠️  DEVELOPMENT TOOL ONLY — Do not run in production/user projects
//
// Regenerates dist/webblocks-icons.svg from 130 selected Lucide icons.
// Fetches icons directly from Lucide CDN (UMD bundle) — requires internet.
//
// FOR DEVELOPERS ONLY:
//   When updating icon list, run: node scripts/build-icons.js
//   Then commit the updated dist/webblocks-icons.* files to git.
//
// FOR USERS:
//   Do NOT run this script. Use pre-built icons from dist/ directory.
//   dist/webblocks-icons.svg and dist/webblocks-icons.css are ready to use.

const fs   = require('fs');
const path = require('path');
const https = require('https');

// ── Icon list (130 curated icons from Lucide) ──
const ICONS = [
  // navigation
  'Menu','PanelLeft','PanelRight','Sidebar',
  'ChevronLeft','ChevronRight','ChevronUp','ChevronDown',
  'ArrowLeft','ArrowRight','ArrowUpCircle','LogOut',
  // actions
  'Plus','Minus','X','Check',
  'Pencil','Trash','Trash2','Copy','Save','Download','Upload',
  // content_editor
  'FileText','Files','StickyNote','Heading',
  'Type','List','ListOrdered','Quote','Code','PenTool',
  // media
  'Image','Camera','Video','Play',
  'Pause','Volume2','Mic','Music','Film','Clapperboard',
  // files_folders
  'Folder','FolderOpen','FolderTree','File',
  'FilePlus','FileCode','FileImage','FileArchive','FileSearch','Receipt',
  // commerce
  'ShoppingCart','ShoppingBag','Store','Package',
  'CreditCard','Wallet','BadgePercent','Banknote','HandCoins','ReceiptText',
  // communication
  'Mail','Send','Inbox','MessageSquare',
  'MessagesSquare','Phone','Bell','BellRing','AtSign','Globe',
  // users_security
  'User','UserRound','Users','Contact',
  'BadgeCheck','Shield','ShieldCheck','Lock','KeyRound','Fingerprint',
  // settings_system
  'Settings','SlidersHorizontal','ToggleLeft','ToggleRight',
  'Wrench','Hammer','Bug','Database','Server','Plug',
  // charts_dashboard
  'LayoutDashboard','BarChart','BarChart2','BarChart3','LineChart','PieChart',
  'AreaChart','Activity','Gauge','Target','TrendingUp','Calendar',
  // layout_design
  'Home','Layout','LayoutGrid','Columns2','Rows2','Square',
  'RectangleHorizontal','Maximize2','Minimize2','MousePointer2','Palette','Sparkles',
  // theme_mode
  'Sun','Moon','SunMoon',
  // devices_integration
  'Monitor','Laptop','TabletSmartphone','Smartphone',
  'Tablet','Watch','Printer','Router','Wifi','Cloud',
  // feedback_status
  'Info','HelpCircle','CircleHelp',
];

// kebab-case helper (PascalCase → kebab-case)
function toKebab(str) {
  return str
    .replace(/([A-Z])/g, (m, c, i) => (i > 0 ? '-' : '') + c.toLowerCase())
    .replace(/--+/g, '-');
}

// Render a single Lucide node to SVG string
function renderNode(node) {
  const [tag, attrs, ...children] = node;
  const attrStr = Object.entries(attrs || {})
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');
  const inner = (children || []).map(renderNode).join('');
  if (inner || tag === 'g') {
    return `<${tag}${attrStr ? ' ' + attrStr : ''}>${inner}</${tag}>`;
  }
  return `<${tag}${attrStr ? ' ' + attrStr : ''}/>`;
}

// ── Fetch Lucide UMD bundle from CDN ────────────────────────
function fetchLucideBundle() {
  return new Promise((resolve, reject) => {
    https.get('https://unpkg.com/lucide@0.577.0/dist/umd/lucide.js', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// ── Parse UMD bundle to extract icon definitions ────────────
function parseIconsFromBundle(bundleCode) {
  const lucideIcons = {};
  
  // Extract all export statements to find icon names
  const exports = new Map();
  const exportPattern = /exports\.([A-Z][a-zA-Z0-9]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9]*);/g;
  let match;
  
  while ((match = exportPattern.exec(bundleCode)) !== null) {
    exports.set(match[1], match[2]); // iconName -> variableName
  }
  
  // Now find each icon's const declaration
  for (const [iconName, varName] of exports) {
    // Look for: const Menu = [...];
    // We need to match nested brackets, so use a helper
    const constStart = bundleCode.indexOf(`const ${varName} = [`);
    if (constStart === -1) continue;
    
    let braceCount = 0;
    let bracketCount = 0;
    let idx = constStart + `const ${varName} = `.length;
    let startIdx = idx;
    let foundEnd = false;
    
    while (idx < bundleCode.length && !foundEnd) {
      const char = bundleCode[idx];
      if (char === '{') braceCount++;
      else if (char === '}') braceCount--;
      else if (char === '[') bracketCount++;
      else if (char === ']') {
        bracketCount--;
        if (bracketCount === 0 && braceCount === 0) {
          foundEnd = true;
          idx++;
          break;
        }
      }
      idx++;
    }
    
    if (foundEnd) {
      const iconDef = bundleCode.substring(startIdx, idx);
      try {
        lucideIcons[iconName] = eval(iconDef);
      } catch (e) {
        // Skip malformed definitions
      }
    }
  }
  
  return lucideIcons;
}

// ── Main: Fetch, parse, and generate ────────────────────────
(async function main() {
  try {
    console.log('Fetching Lucide bundle from CDN...');
    const bundleCode = await fetchLucideBundle();
    console.log(`Bundle fetched (${bundleCode.length} bytes)`);
    
    const lucide = parseIconsFromBundle(bundleCode);
    console.log(`Parsed ${Object.keys(lucide).length} icons from bundle`);
    
    let symbols = '';
    let missing = [];
    
    for (const name of ICONS) {
      const icon = lucide[name];
      if (!icon) {
        missing.push(name);
        continue;
      }
      const id = toKebab(name);
      // icon is array of [tag, attrs, ...children] tuples
      const inner = icon.map(renderNode).join('\n    ');
      symbols += `  <symbol id="wb-icon-${id}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
    ${inner}
  </symbol>\n`;
    }
    
    if (missing.length) {
      console.warn('Missing icons:', missing.join(', '));
    }
    
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  WebBlocks Icon Sprite — Lucide 0.577.0
  130 icons in 12 categories.

  Usage:
    <svg class="wb-icon" aria-hidden="true">
      <use href="/dist/webblocks-icons.svg#settings"></use>
    </svg>

  Or inline (for same-origin restriction workaround):
    Define a hidden <svg> with all <symbol> tags at top of <body>,
    then reference with <use href="#icon-name">.
-->
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
${symbols}</svg>
`;
    
    const outPath = path.join(__dirname, '..', 'dist', 'webblocks-icons.svg');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, svg, 'utf8');
    
    const count = (svg.match(/<symbol /g) || []).length;
    console.log(`Generated dist/webblocks-icons.svg — ${count} icons`);
    
    // ── Generate CSS mask-image file ─────────────────────────────
    // Allows Bootstrap-style usage: <i class="wb-icon wb-icon-settings"></i>
    
    function renderSvgDataUri(name) {
      const icon = lucide[name];
      if (!icon) return null;
      const inner = icon.map(renderNode).join('');
      const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
      // Encode for use in CSS url()
      const encoded = svgStr
        .replace(/"/g, "'")
        .replace(/#/g, '%23')
        .replace(/</g, '%3C')
        .replace(/>/g, '%3E');
      return `url("data:image/svg+xml,${encoded}")`;
    }
    
    let cssRules = `/* ============================================================
   WebBlocks UI — Icon Font-Style CSS
   Generated from Lucide 0.577.0

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
    
    for (const name of ICONS) {
      const id = toKebab(name);
      const uri = renderSvgDataUri(name);
      if (!uri) continue;
      cssRules += `.wb-icon-${id} {\n  -webkit-mask-image: ${uri};\n  mask-image: ${uri};\n}\n`;
    }
    
    const cssOutPath = path.join(__dirname, '..', 'dist', 'webblocks-icons.css');
    fs.writeFileSync(cssOutPath, cssRules, 'utf8');
    
    const cssCount = (cssRules.match(/\.wb-icon-[a-z]/g) || []).length;
    console.log(`Generated dist/webblocks-icons.css — ${cssCount} icon classes`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
