/* Browser tooling is development-only. No npm install/build is needed by users. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
let browser, server, base;
const root = path.resolve(__dirname, '..');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
function chart(values = [[1, 2], [null, 3], [4, -1]], type = 'line', extra = '') {
  return `<div class="wb-chart" id="chart" data-wb-chart="${type}" aria-label="Example" data-wb-chart-help="Use arrows" data-wb-chart-empty="No data" data-wb-chart-error="Read the table" ${extra}><div class="wb-table-wrap"><table class="wb-table" id="values"><caption>Example</caption><thead><tr><th>Category</th><th>First</th><th>Second</th></tr></thead><tbody>${values.map((row, index) => `<tr><th scope="row">Category ${index}</th>${row.map(value => `<td data-wb-chart-value="${value === null ? '' : escape(value)}">${value === null ? 'Missing' : escape(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
}
function html(content) {
  return `<!doctype html><html lang="en" data-mode="auto"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/ui.css"><script src="/ui.js" defer></script></head><body><main class="wb-container">${content}</main></body></html>`;
}
let fixture = '';
before(async () => {
  server = http.createServer((req, res) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'");
    if (req.url === '/ui.css' || req.url === '/ui.js') {
      res.setHeader('Content-Type', req.url.endsWith('css') ? 'text/css' : 'application/javascript');
      res.end(fs.readFileSync(path.join(root, 'dist', req.url.endsWith('css') ? 'webblocks-ui.css' : 'webblocks-ui.js')));
    } else { res.setHeader('Content-Type', 'text/html'); res.end(html(fixture)); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true, ...(process.env.WB_CHART_BROWSER_CHANNEL ? { channel: process.env.WB_CHART_BROWSER_CHANNEL } : {}) });
});
after(async () => { if (browser) await browser.close(); if (server) await new Promise(resolve => server.close(resolve)); });
async function pageFor(t, content, options = {}) {
  fixture = content;
  const page = await browser.newPage(options);
  t.after(() => page.close());
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  t.after(() => assert.deepEqual(errors, []));
  await page.goto(base);
  await page.waitForLoadState('networkidle');
  return page;
}
test('line charts preserve missing gaps and support negative/zero values under strict CSP', async t => {
  const page = await pageFor(t, chart());
  assert.equal(await page.locator('.wb-chart.is-ready').count(), 1);
  assert.equal(await page.locator('.wb-chart-mark').count(), 5);
  const d = await page.locator('.wb-chart-svg .wb-chart-series-1 .wb-chart-line').getAttribute('d');
  assert.equal((d.match(/M/g) || []).length, 2);
  assert.equal(await page.locator('.wb-chart-legend li').count(), 2);
  assert.equal(await page.locator('style, [style]').count(), 0);
  assert.match(await page.locator('.wb-chart-svg').innerHTML(), /-1/);
});
test('grouped bars have finite nonnegative dimensions above and below zero', async t => {
  const page = await pageFor(t, chart([[12, -6], [0, 4], [-3, null]], 'bar'));
  const bars = await page.locator('rect.wb-chart-mark').evaluateAll(nodes => nodes.map(n => ['x','y','width','height'].map(key => Number(n.getAttribute(key)))));
  assert.equal(bars.length, 5);
  bars.forEach(([x,y,w,h]) => { assert.ok([x,y,w,h].every(Number.isFinite)); assert.ok(w > 0 && h >= 0); });
  const zeroY = Number(await page.locator('.wb-chart-axis').getAttribute('y1'));
  assert.ok(bars.some(bar => bar[1] < zeroY));
  assert.ok(bars.some(bar => bar[1] === zeroY && bar[3] > 0));
});
test('keyboard skips gaps, switches series, and selects endpoints without trapping Tab', async t => {
  const page = await pageFor(t, chart());
  const plot = page.locator('.wb-chart-viewport');
  await plot.focus();
  await page.keyboard.press('ArrowRight');
  assert.match(await page.locator('.wb-chart-readout').textContent(), /First — Category 0: 1/);
  await page.keyboard.press('ArrowRight');
  assert.match(await page.locator('.wb-chart-readout').textContent(), /Category 2: 4/);
  await page.keyboard.press('ArrowDown');
  assert.match(await page.locator('.wb-chart-readout').textContent(), /Second — Category 2: -1/);
  await page.keyboard.press('Home');
  assert.match(await page.locator('.wb-chart-readout').textContent(), /Second — Category 0: 2/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.wb-chart-mark.is-active').count(), 0);
  await page.keyboard.press('Tab');
  assert.equal(await plot.evaluate(el => el === document.activeElement), false);
});
test('mouse and touch use the exact marked series', async t => {
  const page = await pageFor(t, chart([[12, -6]], 'bar'), { hasTouch: true });
  await page.locator('rect[data-series="1"]').tap();
  assert.match(await page.locator('.wb-chart-readout').textContent(), /Second — Category 0: -6/);
  await page.locator('rect[data-series="0"]').hover();
  assert.match(await page.locator('.wb-chart-readout').textContent(), /First — Category 0: 12/);
});
test('empty, zero and single-point data remain distinct; a missing first series is keyboard accessible', async t => {
  const page = await pageFor(t, chart([[null, null]]));
  assert.equal(await page.locator('.is-empty').count(), 1);
  assert.equal(await page.locator('.wb-chart-readout').textContent(), 'No data');
  await page.locator('td').nth(1).evaluate(el => { el.dataset.wbChartValue = '0'; el.textContent = '0'; window.WBChart.update(document.getElementById('chart')); });
  assert.equal(await page.locator('.is-empty').count(), 0);
  assert.equal(await page.locator('.wb-chart-mark').count(), 1);
  await page.locator('.wb-chart-viewport').focus();
  await page.keyboard.press('ArrowRight');
  assert.match(await page.locator('.wb-chart-readout').textContent(), /Second — Category 0: 0/);
});
test('invalid data fails visibly without changing table and recovers after update', async t => {
  const page = await pageFor(t, chart([['NaN', 1]]));
  assert.equal(await page.locator('.is-invalid').count(), 1);
  assert.equal(await page.locator('#values tbody').textContent(), 'Category 0NaN1');
  assert.equal(await page.locator('.wb-chart-readout').textContent(), 'Read the table');
  await page.locator('td').first().evaluate(el => { el.dataset.wbChartValue = '5'; el.textContent = '5'; window.WBChart.update(document.getElementById('chart')); });
  assert.equal(await page.locator('.is-ready').count(), 1);
});
test('localization and hostile labels are rendered as text, not markup', async t => {
  const page = await pageFor(t, chart([[1200.5, 1]], 'line', 'lang="de"'));
  await page.evaluate(() => {
    const table = document.getElementById('values');
    table.tHead.rows[0].cells[1].textContent = '<img src=x onerror=alert(1)>';
    table.tBodies[0].rows[0].cells[1].textContent = '1.200,50 €';
    WBChart.update(document.getElementById('chart'));
  });
  await page.locator('.wb-chart-viewport').focus();
  await page.keyboard.press('Home');
  assert.match(await page.locator('.wb-chart-readout').textContent(), /<img.*1\.200,50 €/);
  assert.equal(await page.locator('.wb-chart-content img').count(), 0);
});
test('resize, hidden containers, dark/auto mode and repeat init do not duplicate or overflow charts', async t => {
  const page = await pageFor(t, `<section hidden id="container">${chart()}</section>`, { viewport: { width: 320, height: 700 } });
  await page.locator('#container').evaluate(el => { el.hidden = false; });
  await page.waitForTimeout(100);
  const narrow = await page.locator('.wb-chart-svg').getAttribute('viewBox');
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.waitForTimeout(100);
  const wide = await page.locator('.wb-chart-svg').getAttribute('viewBox');
  assert.notEqual(wide, narrow);
  await page.evaluate(() => { WBChart.init(); WBChart.init(); });
  assert.equal(await page.locator('.wb-chart-content').count(), 1);
  const light = await page.locator('.wb-chart-series-2').first().evaluate(el => getComputedStyle(el).color);
  await page.evaluate(() => { document.documentElement.dataset.mode = 'dark'; });
  const dark = await page.locator('.wb-chart-series-2').first().evaluate(el => getComputedStyle(el).color);
  assert.notEqual(light, dark);
  await page.evaluate(() => { document.documentElement.dataset.mode = 'auto'; });
  await page.emulateMedia({ colorScheme: 'dark' });
  assert.equal(await page.locator('.wb-chart-series-2').first().evaluate(el => getComputedStyle(el).color), dark);
  await page.setViewportSize({ width: 320, height: 700 });
  await page.waitForTimeout(100);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  if (process.env.CHART_SCREENSHOT_DIR) {
    fs.mkdirSync(process.env.CHART_SCREENSHOT_DIR, { recursive: true });
    await page.screenshot({ path: path.join(process.env.CHART_SCREENSHOT_DIR, 'chart-mobile-dark.png'), fullPage: true });
  }
});
test('external table survives overlay relocation and destroy/remount', async t => {
  const source = chart().match(/<table[\s\S]*<\/table>/)[0];
  const page = await pageFor(t, `<div id="chart" class="wb-chart" data-wb-chart="line" data-wb-chart-table="values" aria-label="External"></div><button class="wb-btn" data-wb-toggle="modal" data-wb-target="#modal">Values</button><div class="wb-modal" id="modal" role="dialog" aria-modal="true" aria-label="Values"><div class="wb-modal-dialog"><div class="wb-modal-body">${source}</div><button data-wb-dismiss="modal">Close</button></div></div>`);
  const original = await page.locator('#values').innerHTML();
  await page.getByRole('button', { name: 'Values', exact: true }).click();
  await page.waitForTimeout(100);
  await page.evaluate(() => { WBChart.update(document.getElementById('chart')); WBChart.destroy(document.getElementById('chart')); });
  assert.equal(await page.locator('.wb-chart-content').count(), 0);
  assert.equal(await page.locator('#values').innerHTML(), original);
  await page.evaluate(() => WBChart.init(document.getElementById('chart')));
  assert.equal(await page.locator('.wb-chart-content').count(), 1);
});
test('oversized input is rejected, and JavaScript-disabled tables remain readable', async t => {
  const page = await pageFor(t, chart(Array.from({ length: 501 }, () => [1, 2])));
  assert.equal(await page.locator('.is-invalid').count(), 1);
  assert.equal(await page.locator('#values tbody tr').count(), 501);
  const fallback = await pageFor(t, chart(), { javaScriptEnabled: false });
  assert.equal(await fallback.locator('#values').isVisible(), true);
  assert.equal(await fallback.locator('.wb-chart-content').count(), 0);
});
