#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST_JSON = path.join(ROOT, 'dist', 'webblocks-icons.json');
const DIST_CSS = path.join(ROOT, 'dist', 'webblocks-icons.css');
const DOCS_ICONS = path.join(ROOT, '..', '..', 'docs', 'icons.html');

const ICON_CLASS_PATTERN = /wb-icon-(?:[a-z0-9]+(?:-[a-z0-9]+)*)/g;
const DOCS_HELPER_CLASSES = new Set(['wb-icon-sm', 'wb-icon-lg', 'wb-icon-xl', 'wb-icon-wrap']);

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasSelector(css, className) {
  return new RegExp(`\\.${escapeRegex(className)}(?=\\s*[, {])`).test(css);
}

function listDocsIconClasses(docsHtml) {
  return Array.from(new Set((docsHtml.match(ICON_CLASS_PATTERN) || []).filter((className) => !DOCS_HELPER_CLASSES.has(className)))).sort();
}

function main() {
  const manifest = JSON.parse(readText(DIST_JSON));
  const css = readText(DIST_CSS);
  const docsHtml = readText(DOCS_ICONS);

  const manifestMissingSelectors = manifest
    .filter((entry) => !hasSelector(css, entry.css_class))
    .map((entry) => entry.css_class);

  const docsIconClasses = listDocsIconClasses(docsHtml);
  const docsMissingSelectors = docsIconClasses.filter((className) => !hasSelector(css, className));

  const errors = [];

  if (manifestMissingSelectors.length) {
    errors.push(`Manifest classes missing generated selectors: ${manifestMissingSelectors.join(', ')}`);
  }

  if (docsMissingSelectors.length) {
    errors.push(`Docs icon classes missing generated selectors: ${docsMissingSelectors.join(', ')}`);
  }

  if (errors.length) {
    console.error('Icon validation failed.');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Icon validation passed: ${manifest.length} manifest classes and ${docsIconClasses.length} docs icon classes have generated selectors.`);
}

main();
