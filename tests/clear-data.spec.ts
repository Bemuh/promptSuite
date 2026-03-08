import { test, expect } from '@playwright/test';
import { loadPage, loadPageWithData, defaultTab, setTemplate } from './helpers';
import path from 'path';

const fileUrl = `file:///${path.resolve(__dirname, '..', 'index.html').replace(/\\/g, '/')}`;

test.describe('Clear & Reset', () => {
  test('clear inputs resets variable values but keeps template', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [defaultTab({ id: 't1', name: 'Test', template: '{{A}} {{B}}', vars: { A: 'val1', B: 'val2' } })],
    });
    // Verify vars are populated
    await expect(page.locator('.dynamic-input').first()).toHaveValue('val1');

    // Open cog menu and click clear
    await page.locator('#cog-action').click();
    await page.locator('#lang-clear').click();
    // Confirm in modal
    await page.locator('#modal-confirm-btn').click();

    // Template should remain
    await expect(page.locator('#template')).toHaveValue('{{A}} {{B}}');
    // Vars should be empty
    await expect(page.locator('.dynamic-input').first()).toHaveValue('');
  });

  test('clear inputs undo restores values', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [defaultTab({ id: 't1', name: 'Test', template: '{{A}}', vars: { A: 'original' } })],
    });

    await page.locator('#cog-action').click();
    await page.locator('#lang-clear').click();
    await page.locator('#modal-confirm-btn').click();

    // Click undo on the toast
    await page.locator('.toast-undo').click();

    // Value should be restored
    await expect(page.locator('.dynamic-input').first()).toHaveValue('original');
  });

  test('clear studio data removes only app-specific keys', async ({ page }) => {
    await loadPage(page);

    // Set a non-app key in localStorage
    await page.evaluate(() => {
      localStorage.setItem('some_other_app_key', 'should survive');
    });

    // Open sidebar menu and click clear storage
    await page.locator('#nav-header-action').click();
    await page.locator('#lang-clear-storage').click();
    await page.locator('#modal-confirm-btn').click();

    // Page reloads - wait for it
    await page.waitForLoadState('domcontentloaded');

    // Non-app key should still exist
    const otherKey = await page.evaluate(() => localStorage.getItem('some_other_app_key'));
    expect(otherKey).toBe('should survive');
  });

  test('clear studio data resets to default single flow', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [
        defaultTab({ id: 't1', name: 'Flow A' }),
        defaultTab({ id: 't2', name: 'Flow B' }),
      ],
    });

    await page.locator('#nav-header-action').click();
    await page.locator('#lang-clear-storage').click();
    await page.locator('#modal-confirm-btn').click();

    await page.waitForLoadState('domcontentloaded');

    // Should have exactly one default flow
    const tabCount = await page.locator('#tabs-list .tab').count();
    expect(tabCount).toBe(1);
  });
});
