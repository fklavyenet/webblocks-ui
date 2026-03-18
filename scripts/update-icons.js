#!/usr/bin/env node
// WebBlocks UI — Icon Update Script
// ⚠️  DEVELOPMENT TOOL ONLY
//
// Fetches selected Lucide icons from CDN and regenerates:
//   src/css/icons/webblocks-icons.svg
//
// Run this only when adding/removing icons from the list below.
// After running, execute ./build.sh to update dist/ files.
//
// Usage:
//   node scripts/update-icons.js

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const ROOT    = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'src', 'css', 'icons');
const OUT_SVG = path.join(OUT_DIR, 'webblocks-icons.svg');

// ── Icon list (curated from Lucide) ─────────────────────────
const ICONS = [
  // navigation
  'Menu','PanelLeft','PanelRight','Sidebar',
  'ChevronLeft','ChevronRight','ChevronUp','ChevronDown',
  'ArrowLeft','ArrowRight','ArrowUpCircle','LogOut',
  // actions
  'Plus','Minus','X','Check',
  'Pencil','Trash','Trash2','Copy','Save','Download','Upload',
  'RotateCw','RotateCcw','Repeat',
  // content_editor
  'FileText','Files','StickyNote','Heading',
  'Type','List','ListOrdered','Quote','Code','PenTool',
  // media
  'Image','Camera','Video','Play',
  'Pause','Volume2','Mic','Music','Film','Clapperboard',
  // files_folders
  'Folder','FolderOpen','FolderTree','File',
  'FilePlus','FileCode','FileImage','FileArchive','FileSearch','Receipt',
  'FolderPlus','FileX','FileLock',
  // commerce
  'ShoppingCart','ShoppingBag','Store','Package',
  'CreditCard','Wallet','BadgePercent','Banknote','HandCoins','ReceiptText',
  'Calculator',
  // communication
  'Mail','Send','Inbox','MessageSquare',
  'MessagesSquare','Phone','Bell','BellRing','AtSign','Globe',
  'Languages',
  // users_security
  'User','UserRound','Users','Contact',
  'BadgeCheck','Shield','ShieldCheck','Lock','KeyRound','Fingerprint',
  'UserPlus','LockOpen','Ban',
  // settings_system
  'Settings','SlidersHorizontal','ToggleLeft','ToggleRight',
  'Wrench','Hammer','Bug','Database','Server','Plug',
  'Cpu','Terminal','MemoryStick',
  // charts_dashboard
  'LayoutDashboard','BarChart','BarChart2','BarChart3','LineChart','PieChart',
  'AreaChart','Activity','Gauge','Target','TrendingUp','Calendar',
  'History',
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
  'OctagonAlert','TriangleAlert','Circle','Rocket',
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
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// ── Parse UMD bundle to extract icon definitions ────────────
function parseIconsFromBundle(bundleCode) {
  const lucideIcons = {};

  const exports = new Map();
  const exportPattern = /exports\.([A-Z][a-zA-Z0-9]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9]*);/g;
  let match;

  while ((match = exportPattern.exec(bundleCode)) !== null) {
    exports.set(match[1], match[2]);
  }

  for (const [iconName, varName] of exports) {
    const constStart = bundleCode.indexOf(`const ${varName} = [`);
    if (constStart === -1) continue;

    let braceCount = 0;
    let bracketCount = 0;
    let idx = constStart + `const ${varName} = `.length;
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
      const iconDef = bundleCode.substring(constStart + `const ${varName} = `.length, idx);
      try {
        lucideIcons[iconName] = eval(iconDef);
      } catch (e) {
        // skip malformed
      }
    }
  }

  return lucideIcons;
}

// ── Main ─────────────────────────────────────────────────────
(async function main() {
  try {
    console.log('Fetching Lucide bundle from CDN...');
    const bundleCode = await fetchLucideBundle();
    console.log(`Bundle fetched (${bundleCode.length} bytes)`);

    const lucide = parseIconsFromBundle(bundleCode);
    console.log(`Parsed ${Object.keys(lucide).length} icons from bundle`);

    let symbols = '';
    const missing = [];

    for (const name of ICONS) {
      const icon = lucide[name];
      if (!icon) { missing.push(name); continue; }
      const id = toKebab(name);
      const inner = icon.map(renderNode).join('\n    ');
      symbols += `  <symbol id="wb-icon-${id}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
    ${inner}
  </symbol>\n`;
    }

    if (missing.length) {
      console.warn('Warning — icons not found in bundle:', missing.join(', '));
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  WebBlocks Icon Sprite — Lucide 0.577.0
  ${ICONS.length} icons in 14 categories.

  Usage (SVG sprite):
    <svg class="wb-icon" aria-hidden="true">
      <use href="/dist/webblocks-icons.svg#wb-icon-settings"></use>
    </svg>

  Usage (inline <i> tag — requires dist/webblocks-icons.css):
    <i class="wb-icon wb-icon-settings"></i>
-->
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
${symbols}</svg>
`;

    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(OUT_SVG, svg, 'utf8');
    const count = (svg.match(/<symbol /g) || []).length;
    console.log(`\nGenerated src/css/icons/webblocks-icons.svg — ${count} icons`);
    console.log('Next step: run ./build.sh to update dist/ files.');

  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
