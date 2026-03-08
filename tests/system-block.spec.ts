import { test, expect } from '@playwright/test';
import { loadPage, loadPageWithData, defaultTab } from './helpers';

test.describe('System Prompt Block', () => {
  test('system block editor is hidden by default', async ({ page }) => {
    await loadPage(page);
    await expect(page.locator('#systemPrompt-wrapper')).toHaveClass(/hidden/);
  });

  test('enable checkbox shows editor', async ({ page }) => {
    await loadPage(page);
    await page.locator('#system-check').check();
    await expect(page.locator('#systemPrompt-wrapper')).not.toHaveClass(/hidden/);
  });

  test('disable checkbox hides editor', async ({ page }) => {
    await loadPage(page);
    await page.locator('#system-check').check();
    await expect(page.locator('#systemPrompt-wrapper')).not.toHaveClass(/hidden/);
    await page.locator('#system-check').uncheck();
    await expect(page.locator('#systemPrompt-wrapper')).toHaveClass(/hidden/);
  });

  test('collapse/expand section toggle', async ({ page }) => {
    await loadPage(page);
    const wrapper = page.locator('#system-wrapper');
    await expect(wrapper).not.toHaveClass(/collapsed/);
    await page.locator('#lang-toggle-sys').click();
    await expect(wrapper).toHaveClass(/collapsed/);
    await page.locator('#lang-toggle-sys').click();
    await expect(wrapper).not.toHaveClass(/collapsed/);
  });

  test('system prompt included in generated output when enabled', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [defaultTab({ id: 't1', name: 'Test', template: 'user content', system: 'be helpful', useSystem: true })],
    });
    // Click preview to see output
    await page.locator('#lang-preview').click();
    const previewText = await page.locator('.preview-output').textContent();
    expect(previewText).toContain('SYSTEM:');
    expect(previewText).toContain('be helpful');
    expect(previewText).toContain('USER:');
    expect(previewText).toContain('user content');
  });
});
