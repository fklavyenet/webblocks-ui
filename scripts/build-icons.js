#!/usr/bin/env node
// Generates dist/webblocks-icons.svg from the 120 selected Lucide icons
// Run from the webblocks-ui project root: node scripts/build-icons.js

const fs   = require('fs');
const path = require('path');

// ── Icon list (from project_rules/webblocks-lucide-120/selected-icons.json) ──
const ICONS = [
  // navigation
  'Menu','PanelLeft','PanelRight','Sidebar',
  'ChevronLeft','ChevronRight','ChevronUp','ChevronDown',
  'ArrowLeft','ArrowRight',
  // actions
  'Plus','Minus','X','Check',
  'Pencil','Trash2','Copy','Save','Download','Upload',
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
  'LayoutDashboard','BarChart3','LineChart','PieChart',
  'AreaChart','Activity','Gauge','Target','TrendingUp','Calendar',
  // layout_design
  'LayoutGrid','Columns2','Rows2','Square',
  'RectangleHorizontal','Maximize2','Minimize2','MousePointer2','Palette','Sparkles',
  // devices_integration
  'Monitor','Laptop','TabletSmartphone','Smartphone',
  'Tablet','Watch','Printer','Router','Wifi','Cloud',
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

const lucide = require('/tmp/wb-lucide-build/node_modules/lucide');

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
  symbols += `  <symbol id="${id}" viewBox="0 0 24 24" fill="none"
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
  WebBlocks Icon Sprite — Lucide ${require('/tmp/wb-lucide-build/node_modules/lucide/package.json').version}
  120 icons in 12 categories.

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
