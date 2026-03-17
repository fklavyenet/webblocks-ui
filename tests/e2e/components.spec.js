// @ts-check
/**
 * WebBlocks UI — E2E Tests (Playwright)
 *
 * Runs against local docs/components.html with CDN refs rewritten to local dist.
 * No server needed — uses file:// protocol via a static server shim.
 */
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// ── Helper: build a data: URL from a local HTML file with CDN refs replaced ──
function localPage(relPath) {
  const abs = path.resolve(__dirname, '../../docs', relPath);
  let html = fs.readFileSync(abs, 'utf8');
  const distBase = path.resolve(__dirname, '../../dist');

  // Replace CDN CSS
  html = html.replace(
    /https:\/\/cdn\.jsdelivr\.net\/gh\/[^"]+\/dist\/webblocks-ui\.css/g,
    'file://' + distBase + '/webblocks-ui.css'
  );
  // Replace CDN JS
  html = html.replace(
    /https:\/\/cdn\.jsdelivr\.net\/gh\/[^"]+\/dist\/webblocks-ui\.js/g,
    'file://' + distBase + '/webblocks-ui.js'
  );
  // Replace CDN SVG sprite fetch URL
  html = html.replace(
    /https:\/\/cdn\.jsdelivr\.net\/gh\/[^"]+\/dist\/webblocks-icons\.svg/g,
    'file://' + distBase + '/webblocks-icons.svg'
  );

  // Write to a temp file (data URLs can't load file:// subresources in Chromium)
  const tmpDir = path.resolve(__dirname, '../../.tmp-test');
  fs.mkdirSync(tmpDir, { recursive: true });
  const tmpFile = path.join(tmpDir, relPath.replace(/\//g, '_'));
  fs.writeFileSync(tmpFile, html);
  return 'file://' + tmpFile;
}

// ── Dropdown ───────────────────────────────────────────────────────────────
test.describe('Dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(localPage('components.html'));
  });

  test('opens on trigger click', async ({ page }) => {
    const trigger = page.locator('[data-wb-toggle="dropdown"]').first();
    const menu = page.locator('.wb-dropdown-menu').first();
    await expect(menu).not.toHaveClass(/is-open/);
    await trigger.click();
    await expect(menu).toHaveClass(/is-open/);
  });

  test('closes on second click', async ({ page }) => {
    const trigger = page.locator('[data-wb-toggle="dropdown"]').first();
    const menu = page.locator('.wb-dropdown-menu').first();
    await trigger.click();
    await expect(menu).toHaveClass(/is-open/);
    await trigger.click();
    await expect(menu).not.toHaveClass(/is-open/);
  });

  test('closes on outside click', async ({ page }) => {
    const trigger = page.locator('[data-wb-toggle="dropdown"]').first();
    const menu = page.locator('.wb-dropdown-menu').first();
    await trigger.click();
    await expect(menu).toHaveClass(/is-open/);
    await page.locator('body').click({ position: { x: 10, y: 10 } });
    await expect(menu).not.toHaveClass(/is-open/);
  });

  test('closes on Escape key', async ({ page }) => {
    const trigger = page.locator('[data-wb-toggle="dropdown"]').first();
    const menu = page.locator('.wb-dropdown-menu').first();
    await trigger.click();
    await expect(menu).toHaveClass(/is-open/);
    await page.keyboard.press('Escape');
    await expect(menu).not.toHaveClass(/is-open/);
  });
});

// ── Tabs ───────────────────────────────────────────────────────────────────
test.describe('Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(localPage('components.html'));
  });

  test('first tab is active by default', async ({ page }) => {
    const firstTab = page.locator('.wb-tabs').first().locator('[data-wb-tab]').first();
    await expect(firstTab).toHaveClass(/is-active/);
  });

  test('clicking a tab activates it', async ({ page }) => {
    const tabContainer = page.locator('.wb-tabs').first();
    const tabs = tabContainer.locator('[data-wb-tab]');
    const secondTab = tabs.nth(1);
    await secondTab.click();
    await expect(secondTab).toHaveClass(/is-active/);
  });

  test('only one tab is active at a time', async ({ page }) => {
    const tabContainer = page.locator('.wb-tabs').first();
    const tabs = tabContainer.locator('[data-wb-tab]');
    await tabs.nth(1).click();
    await expect(tabs.nth(0)).not.toHaveClass(/is-active/);
    await expect(tabs.nth(1)).toHaveClass(/is-active/);
  });
});

// ── Accordion ─────────────────────────────────────────────────────────────
test.describe('Accordion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(localPage('components.html'));
  });

  test('item opens on trigger click', async ({ page }) => {
    // Second item starts closed
    const item = page.locator('.wb-accordion-item').nth(1);
    await expect(item).not.toHaveClass(/is-open/);
    await item.locator('.wb-accordion-trigger').click();
    await expect(item).toHaveClass(/is-open/);
  });

  test('item closes on second click', async ({ page }) => {
    // Second item starts closed — open then close
    const item = page.locator('.wb-accordion-item').nth(1);
    await item.locator('.wb-accordion-trigger').click();
    await expect(item).toHaveClass(/is-open/);
    await item.locator('.wb-accordion-trigger').click();
    await expect(item).not.toHaveClass(/is-open/);
  });

  test('first item starts open by default', async ({ page }) => {
    const item = page.locator('.wb-accordion-item').first();
    await expect(item).toHaveClass(/is-open/);
  });
});

// ── Modal ─────────────────────────────────────────────────────────────────
test.describe('Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(localPage('components.html'));
  });

  test('opens on trigger click', async ({ page }) => {
    const trigger = page.locator('[data-wb-toggle="modal"]').first();
    await trigger.click();
    const modal = page.locator('.wb-modal.is-open').first();
    await expect(modal).toBeVisible();
  });

  test('closes on dismiss click', async ({ page }) => {
    const trigger = page.locator('[data-wb-toggle="modal"]').first();
    await trigger.click();
    const modal = page.locator('.wb-modal.is-open').first();
    await expect(modal).toBeVisible();
    // Use the close button (not the backdrop)
    await modal.locator('.wb-modal-close').first().click();
    await expect(page.locator('.wb-modal.is-open')).toHaveCount(0);
  });

  test('closes on Escape key', async ({ page }) => {
    const trigger = page.locator('[data-wb-toggle="modal"]').first();
    await trigger.click();
    await expect(page.locator('.wb-modal.is-open')).toHaveCount(1);
    await page.keyboard.press('Escape');
    await expect(page.locator('.wb-modal.is-open')).toHaveCount(0);
  });
});

// ── Popover ───────────────────────────────────────────────────────────────
test.describe('Popover', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(localPage('components.html'));
  });

  test('opens on trigger click', async ({ page }) => {
    const wrapper = page.locator('.wb-popover').first();
    await expect(wrapper).not.toHaveClass(/is-open/);
    await wrapper.locator('[data-wb-toggle="popover"]').click();
    await expect(wrapper).toHaveClass(/is-open/);
  });

  test('closes on second click', async ({ page }) => {
    const wrapper = page.locator('.wb-popover').first();
    await wrapper.locator('[data-wb-toggle="popover"]').click();
    await expect(wrapper).toHaveClass(/is-open/);
    await wrapper.locator('[data-wb-toggle="popover"]').click();
    await expect(wrapper).not.toHaveClass(/is-open/);
  });

  test('closes on Escape key', async ({ page }) => {
    const wrapper = page.locator('.wb-popover').first();
    await wrapper.locator('[data-wb-toggle="popover"]').click();
    await expect(wrapper).toHaveClass(/is-open/);
    await page.keyboard.press('Escape');
    await expect(wrapper).not.toHaveClass(/is-open/);
  });
});

// ── Collapse ──────────────────────────────────────────────────────────────
// Collapse has no interactive demo in docs pages — tested via JS API smoke test only.
test.describe('Collapse', () => {
  test('WBCollapse API is available on window', async ({ page }) => {
    await page.goto(localPage('components.html'));
    const api = await page.evaluate(() => typeof window.WBCollapse);
    expect(api).toBe('object');
  });
});

// ── Drawer ────────────────────────────────────────────────────────────────
test.describe('Drawer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(localPage('components.html'));
  });

  test('opens on trigger click', async ({ page }) => {
    const trigger = page.locator('[data-wb-toggle="drawer"]').first();
    const targetId = (await trigger.getAttribute('data-wb-target')).replace('#', '');
    const drawer = page.locator('#' + targetId);
    await expect(drawer).not.toHaveClass(/is-open/);
    await trigger.click();
    await expect(drawer).toHaveClass(/is-open/);
  });

  test('closes on Escape key', async ({ page }) => {
    const trigger = page.locator('[data-wb-toggle="drawer"]').first();
    const targetId = (await trigger.getAttribute('data-wb-target')).replace('#', '');
    const drawer = page.locator('#' + targetId);
    await trigger.click();
    await expect(drawer).toHaveClass(/is-open/);
    await page.keyboard.press('Escape');
    await expect(drawer).not.toHaveClass(/is-open/);
  });

  test('closes via close button', async ({ page }) => {
    const trigger = page.locator('[data-wb-toggle="drawer"]').first();
    const targetId = (await trigger.getAttribute('data-wb-target')).replace('#', '');
    const drawer = page.locator('#' + targetId);
    await trigger.click();
    await expect(drawer).toHaveClass(/is-open/);
    // Click via JS to avoid backdrop intercept in headless mode
    await page.evaluate((id) => {
      const el = document.querySelector('#' + id + ' .wb-drawer-close');
      if (el) el.click();
    }, targetId);
    await expect(drawer).not.toHaveClass(/is-open/);
  });
});

// ── Theme toggle ──────────────────────────────────────────────────────────
test.describe('Theme mode toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(localPage('index.html'));
  });

  test('data-mode attribute changes on cycle click', async ({ page }) => {
    const html = page.locator('html');
    const btn = page.locator('[data-wb-mode-cycle]').first();
    const before = await html.getAttribute('data-mode');
    await btn.click();
    const after = await html.getAttribute('data-mode');
    expect(after).not.toBe(before);
  });
});
