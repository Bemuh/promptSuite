import { test, expect } from '@playwright/test';
import { loadPage, loadPageWithData, setTemplate, defaultTab } from './helpers';
import path from 'path';

const fileUrl = `file:///${path.resolve(__dirname, '..', 'index.html').replace(/\\/g, '/')}`;

test.describe('Data Persistence', () => {
  test('template survives page reload', async ({ page }) => {
    await loadPage(page);
    await setTemplate(page, 'persisted template');
    // Wait for debounced save
    await page.waitForTimeout(600);
    await page.goto(fileUrl);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('#template')).toHaveValue('persisted template');
  });

  test('active tab survives page reload', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [
        defaultTab({ id: 't1', name: 'Flow A' }),
        defaultTab({ id: 't2', name: 'Flow B' }),
      ],
      activeTabId: 't2',
    });
    await expect(page.locator('#tabs-list .tab.active')).toContainText('Flow B');
  });

  test('theme preference survives page reload', async ({ page }) => {
    await loadPage(page);
    // Toggle to light
    await page.locator('#nav-header-action').click();
    await page.locator('#btn-theme-toggle').click();
    await page.waitForTimeout(100);
    await page.goto(fileUrl);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toHaveClass(/light-theme/);
  });

  test('language preference survives page reload', async ({ page }) => {
    await loadPageWithData(page, { lang: 'es' });
    await expect(page.locator('#lang-generate')).toHaveText('Generar y Copiar Prompt');
  });

  test('collapsed section states survive page reload', async ({ page }) => {
    await loadPage(page);
    await page.locator('#lang-toggle-sys').click();
    await page.waitForTimeout(600);
    await page.goto(fileUrl);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('#system-wrapper')).toHaveClass(/collapsed/);
  });
});
