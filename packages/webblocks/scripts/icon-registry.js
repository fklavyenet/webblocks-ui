const GROUPS = [
  {
    category: 'controls',
    contexts: ['controls'],
    keywords: ['ui', 'control'],
    names: ['Menu', 'PanelLeft', 'PanelRight', 'Sidebar', 'ChevronLeft', 'ChevronRight', 'ChevronUp', 'ChevronDown', 'ArrowLeft', 'ArrowRight', 'ArrowUpCircle', 'LogOut']
  },
  {
    category: 'actions',
    contexts: ['actions'],
    keywords: ['action', 'command'],
    names: ['Plus', 'Minus', 'X', 'Check', 'Pencil', 'Trash', 'Trash2', 'Copy', 'Save', 'Download', 'Upload', 'RotateCw', 'RotateCcw', 'Repeat', 'ExternalLink']
  },
  {
    category: 'visibility',
    contexts: ['state'],
    keywords: ['view', 'state'],
    names: ['Search', 'Eye', 'EyeOff']
  },
  {
    category: 'editorial',
    contexts: ['editorial'],
    keywords: ['content', 'editorial'],
    names: ['Star', 'Bookmark', 'Heart', 'Share2', 'Book', 'BookOpen', 'Box']
  },
  {
    category: 'content',
    contexts: ['content'],
    keywords: ['content', 'document'],
    names: ['FileText', 'Files', 'StickyNote', 'Heading', 'Type', 'List', 'ListOrdered', 'Quote', 'Code', 'PenTool', 'Newspaper']
  },
  {
    category: 'media',
    contexts: ['media'],
    keywords: ['media', 'asset'],
    names: ['Image', 'Images', 'Camera', 'Video', 'Play', 'Pause', 'Volume2', 'Mic', 'Music', 'Film', 'Clapperboard']
  },
  {
    category: 'files',
    contexts: ['files'],
    keywords: ['file', 'folder'],
    names: ['Folder', 'FolderOpen', 'FolderTree', 'File', 'FilePlus', 'FileCode', 'FileImage', 'FileArchive', 'FileSearch', 'Receipt', 'FolderPlus', 'FileX', 'FileLock']
  },
  {
    category: 'commerce',
    contexts: ['commerce'],
    keywords: ['commerce', 'billing'],
    names: ['ShoppingCart', 'ShoppingBag', 'Store', 'Package', 'CreditCard', 'Wallet', 'BadgePercent', 'Banknote', 'HandCoins', 'ReceiptText', 'Calculator']
  },
  {
    category: 'communication',
    contexts: ['communication'],
    keywords: ['message', 'communication'],
    names: ['Mail', 'Send', 'Inbox', 'MessageSquare', 'MessagesSquare', 'Phone', 'Bell', 'BellRing', 'AtSign', 'Globe', 'MapPin', 'Languages', 'Megaphone']
  },
  {
    category: 'brands',
    contexts: ['branding'],
    keywords: ['brand', 'social'],
    names: ['Briefcase', 'Building2', 'Github', 'Linkedin', 'Twitter', 'Instagram', 'Youtube']
  },
  {
    category: 'users',
    contexts: ['identity'],
    keywords: ['user', 'identity'],
    names: ['User', 'UserRound', 'Users', 'Contact', 'BadgeCheck', 'Shield', 'ShieldCheck', 'Lock', 'KeyRound', 'Fingerprint', 'UserPlus', 'LockOpen', 'Ban']
  },
  {
    category: 'system',
    contexts: ['system'],
    keywords: ['system', 'settings'],
    names: ['Settings', 'SlidersHorizontal', 'ToggleLeft', 'ToggleRight', 'Wrench', 'Hammer', 'Bug', 'Database', 'Server', 'Plug', 'Cpu', 'Terminal', 'SquareTerminal', 'Layers', 'MemoryStick']
  },
  {
    category: 'analytics',
    contexts: ['analytics'],
    keywords: ['analytics', 'reporting'],
    names: ['LayoutDashboard', 'BarChart', 'BarChart2', 'BarChart3', 'LineChart', 'PieChart', 'AreaChart', 'Activity', 'Gauge', 'Target', 'TrendingUp', 'Calendar', 'History']
  },
  {
    category: 'layout',
    contexts: ['layout'],
    keywords: ['layout', 'structure'],
    names: ['Home', 'Layout', 'LayoutGrid', 'Columns2', 'Rows2', 'Square', 'RectangleHorizontal', 'Maximize2', 'Minimize2', 'MousePointer2', 'Palette', 'Sparkles']
  },
  {
    category: 'theme',
    contexts: ['theme'],
    keywords: ['theme', 'appearance'],
    names: ['Sun', 'Moon', 'SunMoon']
  },
  {
    category: 'devices',
    contexts: ['devices'],
    keywords: ['device', 'platform'],
    names: ['Monitor', 'Laptop', 'TabletSmartphone', 'Smartphone', 'Tablet', 'Watch', 'Printer', 'Router', 'Wifi', 'Cloud', 'Route']
  },
  {
    category: 'status',
    contexts: ['status'],
    keywords: ['status', 'feedback'],
    names: ['Info', 'HelpCircle', 'CircleHelp', 'OctagonAlert', 'TriangleAlert', 'Circle', 'CircleDot', 'Rocket', 'Cookie']
  }
];

const OVERRIDES = {
  home: {
    contexts: ['navigation', 'dashboard'],
    keywords: ['home', 'start', 'dashboard']
  },
  rocket: {
    contexts: ['navigation', 'onboarding'],
    keywords: ['rocket', 'launch', 'start', 'getting-started']
  },
  layers: {
    contexts: ['navigation', 'architecture'],
    keywords: ['layers', 'architecture', 'structure']
  },
  palette: {
    contexts: ['navigation', 'theme'],
    keywords: ['palette', 'foundation', 'design', 'tokens']
  },
  layout: {
    contexts: ['navigation', 'layout'],
    keywords: ['layout', 'page', 'structure']
  },
  box: {
    categories: ['layout'],
    contexts: ['navigation', 'components'],
    keywords: ['box', 'primitives', 'components', 'ui']
  },
  star: {
    contexts: ['navigation', 'reference'],
    keywords: ['star', 'icons', 'reference', 'catalog']
  },
  'layout-grid': {
    contexts: ['navigation', 'patterns'],
    keywords: ['patterns', 'grid', 'overview', 'sections']
  },
  'circle-dot': {
    contexts: ['navigation', 'overview'],
    keywords: ['overview', 'current', 'section', 'dot']
  },
  'layout-dashboard': {
    categories: ['layout'],
    contexts: ['navigation', 'dashboard'],
    keywords: ['dashboard', 'admin', 'workspace', 'shell']
  },
  settings: {
    contexts: ['navigation', 'settings'],
    keywords: ['settings', 'preferences', 'configuration']
  },
  'shield-check': {
    contexts: ['navigation', 'auth', 'security'],
    keywords: ['auth', 'security', 'login', 'access']
  },
  'file-text': {
    contexts: ['navigation', 'content'],
    keywords: ['content', 'document', 'text', 'page']
  },
  route: {
    contexts: ['navigation', 'structure'],
    keywords: ['route', 'breadcrumb', 'path', 'hierarchy']
  },
  images: {
    contexts: ['navigation', 'media'],
    keywords: ['images', 'gallery', 'photos', 'media']
  },
  cookie: {
    contexts: ['navigation', 'privacy'],
    keywords: ['cookie', 'privacy', 'consent', 'preferences']
  },
  megaphone: {
    categories: ['marketing'],
    contexts: ['navigation', 'marketing'],
    keywords: ['marketing', 'campaign', 'announce', 'promotion']
  },
  wrench: {
    contexts: ['navigation', 'tools'],
    keywords: ['tools', 'utilities', 'wrench', 'setup']
  },
  terminal: {
    contexts: ['navigation', 'developer'],
    keywords: ['terminal', 'developer', 'javascript', 'runtime']
  },
  code: {
    contexts: ['navigation', 'developer'],
    keywords: ['code', 'developer', 'playground', 'integration']
  },
  'square-terminal': {
    contexts: ['developer'],
    keywords: ['terminal', 'console', 'developer']
  },
  router: {
    contexts: ['network'],
    keywords: ['router', 'network', 'wifi']
  },
  search: {
    contexts: ['navigation', 'discovery'],
    keywords: ['search', 'find', 'lookup']
  },
  menu: {
    contexts: ['navigation'],
    keywords: ['menu', 'navigation', 'sidebar']
  },
  'chevron-left': {
    contexts: ['navigation'],
    keywords: ['back', 'previous', 'left']
  },
  'chevron-right': {
    contexts: ['navigation'],
    keywords: ['next', 'forward', 'right']
  },
  'arrow-left': {
    contexts: ['navigation'],
    keywords: ['back', 'previous', 'left']
  },
  'arrow-right': {
    contexts: ['navigation'],
    keywords: ['next', 'forward', 'right']
  }
};

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function toKebab(str) {
  return str
    .replace(/([A-Z])/g, (m, c, i) => (i > 0 ? '-' : '') + c.toLowerCase())
    .replace(/--+/g, '-');
}

function toLabel(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Za-z])(\d+)/g, '$1 $2')
    .replace(/(\d+)([A-Za-z])/g, '$1 $2')
    .trim();
}

function tokenize(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function buildIconRegistry() {
  const registry = [];

  for (const group of GROUPS) {
    for (const name of group.names) {
      const slug = toKebab(name);
      const label = toLabel(name);
      const override = OVERRIDES[slug] || {};
      const categories = unique([group.category].concat(override.categories || []));
      const contexts = unique([].concat(group.contexts || [], override.contexts || []));
      const keywords = unique(
        tokenize(slug)
          .concat(tokenize(label))
          .concat(group.keywords || [])
          .concat(override.keywords || [])
      );

      registry.push({
        name,
        slug,
        label,
        cssClass: `wb-icon-${slug}`,
        source: 'webblocks-ui',
        categories,
        contexts,
        keywords
      });
    }
  }

  return registry;
}

module.exports = {
  GROUPS,
  ICON_REGISTRY: buildIconRegistry(),
  toKebab,
  toLabel
};
