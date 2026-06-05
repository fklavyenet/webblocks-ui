#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST_JSON = path.join(ROOT, 'dist', 'webblocks-icons.json');
const DIST_CSS = path.join(ROOT, 'dist', 'webblocks-icons.css');
const DOCS_ICONS = path.join(ROOT, '..', '..', 'docs', 'icons.html');

const ICON_CLASS_PATTERN = /wb-icon-(?:[a-z0-9]+(?:-[a-z0-9]+)*)/g;
const DOCS_HELPER_CLASSES = new Set(['wb-icon-sm', 'wb-icon-lg', 'wb-icon-xl', 'wb-icon-wrap']);
const REQUIRED_ICON_CLASSES = [
  'wb-icon-pencil',
  'wb-icon-trash',
  'wb-icon-user',
  'wb-icon-settings',
  'wb-icon-search',
  'wb-icon-plus',
  'wb-icon-x',
  'wb-icon-eye'
];

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasSelector(css, className) {
  return new RegExp(`\\.${escapeRegex(className)}(?=\\s*[, {])`).test(css);
}

function hasMaskRule(css, className) {
  return new RegExp(`\\.${escapeRegex(className)}(?=[\\s,{])[^{}]*\\{[^{}]*(?:-webkit-)?mask-image\\s*:`, 's').test(css);
}

function listDocsIconClasses(docsHtml) {
  return Array.from(new Set((docsHtml.match(ICON_CLASS_PATTERN) || []).filter((className) => !DOCS_HELPER_CLASSES.has(className)))).sort();
}

function main() {
  const errors = [];

  for (const filePath of [DIST_JSON, DIST_CSS, DOCS_ICONS]) {
    if (!fs.existsSync(filePath)) {
      errors.push(`Required file is missing: ${filePath}`);
    }
  }

  if (errors.length) {
    console.error('Icon validation failed.');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  const manifest = JSON.parse(readText(DIST_JSON));
  const css = readText(DIST_CSS);
  const docsHtml = readText(DOCS_ICONS);

  if (!Array.isArray(manifest) || manifest.length === 0) {
    errors.push('Icon manifest must be a non-empty array.');
  }

  const maskRuleCount = (css.match(/-webkit-mask-image\s*:/g) || []).length;
  if (maskRuleCount < 50) {
    errors.push(`Standalone icon CSS appears helper-only; expected generated mask selectors, found ${maskRuleCount} -webkit mask rules.`);
  }

  const manifestMissingSelectors = manifest
    .filter((entry) => !hasSelector(css, entry.css_class))
    .map((entry) => entry.css_class);

  const docsIconClasses = listDocsIconClasses(docsHtml);
  const docsMissingSelectors = docsIconClasses.filter((className) => !hasSelector(css, className));
  const requiredMissingMaskRules = REQUIRED_ICON_CLASSES.filter((className) => !hasMaskRule(css, className));

  if (manifestMissingSelectors.length) {
    errors.push(`Manifest classes missing generated selectors: ${manifestMissingSelectors.join(', ')}`);
  }

  if (docsMissingSelectors.length) {
    errors.push(`Docs icon classes missing generated selectors: ${docsMissingSelectors.join(', ')}`);
  }

  if (requiredMissingMaskRules.length) {
    errors.push(`Required icon classes missing mask-image rules: ${requiredMissingMaskRules.join(', ')}`);
  }

  if (errors.length) {
    console.error('Icon validation failed.');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Icon validation passed: ${manifest.length} manifest classes, ${docsIconClasses.length} docs icon classes, and ${REQUIRED_ICON_CLASSES.length} required icons have generated mask selectors.`);
}

main();
