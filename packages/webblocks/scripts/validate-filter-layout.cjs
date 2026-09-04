#!/usr/bin/env node
// Run with Playwright available on NODE_PATH. CHROME_EXECUTABLE is optional.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
  try {
    const page = await browser.newPage();
    const css = fs.readFileSync(path.join(__dirname, '../dist/webblocks-ui.css'), 'utf8');
    const field = (label, control, search = false) => `<div class="wb-field ${search ? 'wb-filter-bar-search' : ''}"><label class="wb-label">${label}</label>${control}</div>`;
    let count = 0;
    for (const width of [320, 480, 736, 1024, 1120, 1152, 1200, 1280, 1440]) {
      for (const variant of ['standard', 'apply-only', 'localized-actions', 'no-search', 'date', 'no-actions']) {
        await page.setViewportSize({ width, height: 1000 });
        const search = variant === 'no-search' ? '' : field('Search', '<input class="wb-input">', true);
        const fields = ['Site', 'Status', 'Sort by', 'Reihenfolge der Ergebnisse'].map(label => field(label, '<select class="wb-filter-select"><option>A very long site title that must not widen the column</option></select>')).join('');
        const date = variant === 'date' ? field('Created after', '<input class="wb-input" type="date">') : '';
        const clear = variant === 'apply-only' ? '' : `<a class="wb-btn wb-btn-secondary">${variant === 'localized-actions' ? 'Filter zurücksetzen' : 'Clear Filters'}</a>`;
        const actions = variant === 'no-actions' ? '' : `<div class="wb-filter-bar-actions"><div class="wb-action-group"><button class="wb-btn wb-btn-primary">${variant === 'localized-actions' ? 'Anwenden' : 'Apply'}</button>${clear}</div></div>`;
        await page.setContent(`<style>${css}</style><form class="wb-filter-bar wb-filter-bar--fields"><div class="wb-filter-bar-fields">${search}${fields}${date}${actions}</div></form>`);
        const data = await page.evaluate(() => {
          const rect = element => { const r = element.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, center: r.top + r.height / 2, right: r.right }; };
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            fields: [...document.querySelectorAll('.wb-field')].map(e => ({ field: rect(e), label: rect(e.children[0]), control: rect(e.children[1]) })),
            actions: document.querySelector('.wb-filter-bar-actions') ? { field: rect(document.querySelector('.wb-filter-bar-actions')), control: rect(document.querySelector('.wb-action-group')), buttons: [...document.querySelectorAll('.wb-action-group > *')].map(rect) } : null,
            right: rect(document.querySelector('.wb-filter-bar-fields')).right,
          };
        });
        assert.equal(data.overflow, false, `${width}/${variant}: horizontal overflow`);
        for (const a of data.fields) {
          assert.ok(a.control.top - a.label.bottom >= 3.9, 'label gap must stay visible');
          assert.ok(a.control.top - a.label.bottom < 8, `${width}/${variant}: label gap ${a.control.top-a.label.bottom}`);
          for (const b of data.fields) {
            if (Math.abs(a.field.top - b.field.top) < 1) assert.ok(Math.abs(a.control.center - b.control.center) < 1, 'shared control centers');
            if (b.field.top > a.field.bottom) assert.ok(b.field.top - a.field.bottom >= 19.9, 'wrapped row separation');
          }
          if (data.actions && Math.abs(a.field.top - data.actions.field.top) < 1) assert.ok(Math.abs(a.control.center - data.actions.control.center) < 1, 'actions center on controls');
        }
        if (data.actions && data.actions.buttons.length === 2) assert.ok(Math.abs(data.actions.buttons[0].center - data.actions.buttons[1].center) < 1, `${width}/${variant}: Apply and Clear Filters must share a row`);
        if (data.actions) assert.ok(Math.abs(data.right - data.actions.control.right) < 1, 'actions stay at inline end');
        if (((width >= 1280 && ['standard', 'apply-only'].includes(variant)) || (width >= 1440 && variant === 'localized-actions'))) {
          for (const f of data.fields) assert.ok(Math.abs(f.control.center - data.actions.control.center) < 1, `${width}/${variant}: actions must use the available field row`);
        }
        for (const f of data.fields) {
          if (data.actions && Math.abs(f.field.bottom - data.actions.field.bottom) < 1) assert.ok(Math.abs(f.control.center - data.actions.control.center) < 1, 'inline actions center on controls');
        }
        count++;
      }
    }
    console.log(`PASS: ${count} labelled filter layouts; spacing, overflow, control alignment, action alignment.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
