import { test, expect } from '@playwright/test';
import { loadPageWithData, defaultTab } from './helpers';

test.describe('Generate & Copy', () => {
  test('generate with simple template resolves variables', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [defaultTab({ id: 't1', name: 'Test', template: 'Hello {{NAME}}', vars: { NAME: 'World' } })],
    });
    await page.locator('#lang-preview').click();
    const preview = await page.locator('.preview-output').textContent();
    expect(preview).toContain('Hello World');
  });

  test('generate with system block wraps output', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [defaultTab({ id: 't1', name: 'Test', template: 'do stuff', system: 'be nice', useSystem: true })],
    });
    await page.locator('#lang-preview').click();
    const preview = await page.locator('.preview-output').textContent();
    expect(preview).toContain('SYSTEM:');
    expect(preview).toContain('be nice');
    expect(preview).toContain('USER:');
    expect(preview).toContain('do stuff');
  });

  test('generate with shared vars injects shared values', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [defaultTab({ id: 't1', name: 'Test', template: '{{SHARED:ctx}}' })],
      sharedStore: { vars: { ctx: 'shared context here' }, ts: {} },
    });
    await page.locator('#lang-preview').click();
    const preview = await page.locator('.preview-output').textContent();
    expect(preview).toContain('shared context here');
  });

  test('generate with {{TAB:X}} embeds referenced flow output', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [
        defaultTab({ id: 't1', name: 'Main', template: 'Before {{TAB:Sub}} After' }),
        defaultTab({ id: 't2', name: 'Sub', template: 'sub content' }),
      ],
    });
    await page.locator('#lang-preview').click();
    const preview = await page.locator('.preview-output').textContent();
    expect(preview).toContain('Before sub content After');
  });

  test('circular dependency shows error', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [
        defaultTab({ id: 't1', name: 'A', template: '{{TAB:B}}' }),
        defaultTab({ id: 't2', name: 'B', template: '{{TAB:A}}' }),
      ],
    });
    await page.locator('#lang-preview').click();
    const preview = await page.locator('.preview-output').textContent();
    expect(preview).toContain('Error');
    expect(preview).toContain('Circular');
  });

  test('unresolved variables remain as-is', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [defaultTab({ id: 't1', name: 'Test', template: '{{UNFILLED}}' })],
    });
    await page.locator('#lang-preview').click();
    const preview = await page.locator('.preview-output').textContent();
    expect(preview).toContain('{{UNFILLED}}');
  });

  test('generate copies to clipboard and shows toast', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [defaultTab({ id: 't1', name: 'Test', template: 'clipboard test' })],
    });
    await page.locator('#lang-generate').click();
    await expect(page.locator('.toast')).toBeVisible();
  });
});
