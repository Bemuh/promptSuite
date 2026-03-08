import { test, expect } from '@playwright/test';
import { loadPage, loadPageWithData, setTemplate, defaultTab } from './helpers';

test.describe('Template & Dynamic Variables', () => {
  test('typing {{VAR}} creates an input field', async ({ page }) => {
    await loadPage(page);
    await setTemplate(page, '{{MY_VAR}}');
    await expect(page.locator('.dynamic-var-block')).toHaveCount(1);
    await expect(page.locator('.dynamic-var-block label span').first()).toHaveText('MY_VAR');
  });

  test('typing {{SHARED:ctx}} creates a shared variable input with badge', async ({ page }) => {
    await loadPage(page);
    await setTemplate(page, '{{SHARED:ctx}}');
    await expect(page.locator('.shared-var-block')).toHaveCount(1);
    await expect(page.locator('.shared-var-badge')).toBeVisible();
  });

  test('{{TAB:FlowName}} does NOT create an input field', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [
        defaultTab({ id: 't1', name: 'Main', template: '{{TAB:Other}}' }),
        defaultTab({ id: 't2', name: 'Other', template: 'hello' }),
      ],
    });
    await expect(page.locator('.dynamic-var-block')).toHaveCount(0);
    await expect(page.locator('.shared-var-block')).toHaveCount(0);
  });

  test('removing {{VAR}} from template removes input field', async ({ page }) => {
    await loadPage(page);
    await setTemplate(page, '{{A}}');
    await expect(page.locator('.dynamic-var-block')).toHaveCount(1);
    await setTemplate(page, 'no vars here');
    await expect(page.locator('.dynamic-var-block')).toHaveCount(0);
  });

  test('variable values persist when switching tabs', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [
        defaultTab({ id: 't1', name: 'Flow A', template: '{{X}}', vars: { X: 'hello' } }),
        defaultTab({ id: 't2', name: 'Flow B', template: '{{Y}}' }),
      ],
      activeTabId: 't1',
    });
    // Verify value in Flow A
    await expect(page.locator('.dynamic-input').first()).toHaveValue('hello');
    // Switch to Flow B
    await page.locator('#tabs-list .tab', { hasText: 'Flow B' }).click();
    // Switch back
    await page.locator('#tabs-list .tab', { hasText: 'Flow A' }).click();
    await expect(page.locator('.dynamic-input').first()).toHaveValue('hello');
  });

  test('multiple variables create multiple fields', async ({ page }) => {
    await loadPage(page);
    await setTemplate(page, '{{A}} {{B}} {{C}}');
    await expect(page.locator('.dynamic-var-block')).toHaveCount(3);
  });

  test('duplicate variable names create only one field', async ({ page }) => {
    await loadPage(page);
    await setTemplate(page, '{{A}} {{A}} {{A}}');
    await expect(page.locator('.dynamic-var-block')).toHaveCount(1);
  });
});
