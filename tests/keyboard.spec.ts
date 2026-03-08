import { test, expect } from '@playwright/test';
import { loadPage, loadPageWithData, defaultTab } from './helpers';

test.describe('Keyboard Shortcuts & Accessibility', () => {
  test('Ctrl+Enter triggers generate', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [defaultTab({ id: 't1', name: 'Test', template: 'keyboard test' })],
    });
    await page.keyboard.press('Control+Enter');
    await expect(page.locator('.toast')).toBeVisible();
  });

  test('Ctrl+Shift+N creates new flow', async ({ page }) => {
    await loadPage(page);
    const initialCount = await page.locator('#tabs-list .tab').count();
    await page.keyboard.press('Control+Shift+N');
    const newCount = await page.locator('#tabs-list .tab').count();
    expect(newCount).toBe(initialCount + 1);
  });

  test('Escape closes open modal', async ({ page }) => {
    await loadPage(page);
    // Open tutorial
    await page.locator('#nav-header-action').click();
    await page.locator('#btn-tutorial-trigger').click();
    await expect(page.locator('#modal-overlay')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal-overlay')).not.toBeVisible();
  });

  test('Escape closes dropdown menus', async ({ page }) => {
    await loadPage(page);
    await page.locator('#cog-action').click();
    await expect(page.locator('#cog-dropdown')).toHaveClass(/show/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#cog-dropdown')).not.toHaveClass(/show/);
  });

  test('Tab key inside editor inserts tab character', async ({ page }) => {
    await loadPage(page);
    await page.locator('#template').click();
    await page.locator('#template').fill('line1');
    await page.keyboard.press('Tab');
    const value = await page.locator('#template').inputValue();
    expect(value).toContain('\t');
  });

  test('ARIA attributes are present on modal', async ({ page }) => {
    await loadPage(page);
    const modal = page.locator('#modal-overlay');
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
  });

  test('ARIA attributes on tabs', async ({ page }) => {
    await loadPage(page);
    await expect(page.locator('#tabs-list')).toHaveAttribute('role', 'tablist');
    const tab = page.locator('#tabs-list .tab').first();
    await expect(tab).toHaveAttribute('role', 'tab');
    await expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  test('section toggle buttons have aria-expanded', async ({ page }) => {
    await loadPage(page);
    const sysBtn = page.locator('#lang-toggle-sys');
    await expect(sysBtn).toHaveAttribute('aria-expanded', 'true');
    await sysBtn.click();
    await expect(sysBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('modal focus goes to confirm button on open', async ({ page }) => {
    await loadPage(page);
    await page.locator('#nav-header-action').click();
    await page.locator('#btn-tutorial-trigger').click();
    // Confirm button should be focused
    const focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('modal-confirm-btn');
  });
});
