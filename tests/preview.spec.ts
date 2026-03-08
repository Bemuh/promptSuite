import { test, expect } from '@playwright/test';
import { loadPageWithData, defaultTab } from './helpers';

test.describe('Preview Panel', () => {
  test('click Preview opens modal with resolved output', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [defaultTab({ id: 't1', name: 'Test', template: 'Hello {{NAME}}', vars: { NAME: 'World' } })],
    });
    await page.locator('#lang-preview').click();
    await expect(page.locator('#modal-overlay')).toBeVisible();
    await expect(page.locator('.preview-output')).toBeVisible();
    const text = await page.locator('.preview-output').textContent();
    expect(text).toContain('Hello World');
  });

  test('unresolved variables are highlighted', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [defaultTab({ id: 't1', name: 'Test', template: '{{MISSING}}' })],
    });
    await page.locator('#lang-preview').click();
    await expect(page.locator('.preview-output .unresolved')).toBeVisible();
    await expect(page.locator('.preview-warning')).toBeVisible();
  });

  test('circular dependency errors are highlighted', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [
        defaultTab({ id: 't1', name: 'A', template: '{{TAB:B}}' }),
        defaultTab({ id: 't2', name: 'B', template: '{{TAB:A}}' }),
      ],
    });
    await page.locator('#lang-preview').click();
    await expect(page.locator('.preview-output .error-tag')).toBeVisible();
  });

  test('copy button inside preview copies to clipboard', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [defaultTab({ id: 't1', name: 'Test', template: 'copy this' })],
    });
    await page.locator('#lang-preview').click();
    // Click the copy button inside preview
    await page.locator('#preview-panel .primary-btn').click();
    await expect(page.locator('.toast')).toBeVisible();
  });

  test('close preview with OK button', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [defaultTab({ id: 't1', name: 'Test', template: 'test' })],
    });
    await page.locator('#lang-preview').click();
    await expect(page.locator('#modal-overlay')).toBeVisible();
    await page.locator('#modal-confirm-btn').click();
    await expect(page.locator('#modal-overlay')).not.toBeVisible();
  });

  test('close preview with Escape key', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [defaultTab({ id: 't1', name: 'Test', template: 'test' })],
    });
    await page.locator('#lang-preview').click();
    await expect(page.locator('#modal-overlay')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal-overlay')).not.toBeVisible();
  });
});
