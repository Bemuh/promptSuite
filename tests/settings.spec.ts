import { test, expect } from '@playwright/test';
import { loadPage, loadPageWithData } from './helpers';

test.describe('Theme & Language', () => {
  test('toggle theme changes body class and button label', async ({ page }) => {
    await loadPage(page);
    // Default is dark
    await expect(page.locator('body')).not.toHaveClass(/light-theme/);

    await page.locator('#nav-header-action').click();
    await page.locator('#btn-theme-toggle').click();

    await expect(page.locator('body')).toHaveClass(/light-theme/);
    await expect(page.locator('#btn-theme-toggle')).toHaveText(/Light/);
  });

  test('toggle language switches all UI strings to Spanish', async ({ page }) => {
    await loadPage(page);
    await page.locator('#nav-header-action').click();
    await page.locator('#btn-lang-toggle').click();

    await expect(page.locator('#lang-generate')).toHaveText('Generar y Copiar Prompt');
    await expect(page.locator('#add-tab-action')).toHaveText('+ Nuevo Flujo');
    await expect(page.locator('#btn-lang-toggle')).toHaveText('Idioma: ES');
  });

  test('toggle language back to English', async ({ page }) => {
    await loadPageWithData(page, { lang: 'es' });
    await page.locator('#nav-header-action').click();
    await page.locator('#btn-lang-toggle').click();

    await expect(page.locator('#lang-generate')).toHaveText('Generate & Copy Prompt');
    await expect(page.locator('#add-tab-action')).toHaveText('+ New Flow');
  });

  test('all main EN i18n keys have visible UI representation', async ({ page }) => {
    await loadPage(page);
    // Check key UI elements are not empty
    await expect(page.locator('#lang-generate')).not.toBeEmpty();
    await expect(page.locator('#add-tab-action')).not.toBeEmpty();
    await expect(page.locator('#lang-toggle-sys')).not.toBeEmpty();
    await expect(page.locator('#lang-toggle-tpl')).not.toBeEmpty();
    await expect(page.locator('#lang-enable-sys')).not.toBeEmpty();
    await expect(page.locator('#lang-preview')).not.toBeEmpty();
  });

  test('all main ES i18n keys have visible UI representation', async ({ page }) => {
    await loadPageWithData(page, { lang: 'es' });
    await expect(page.locator('#lang-generate')).not.toBeEmpty();
    await expect(page.locator('#add-tab-action')).not.toBeEmpty();
    await expect(page.locator('#lang-toggle-sys')).not.toBeEmpty();
    await expect(page.locator('#lang-toggle-tpl')).not.toBeEmpty();
    await expect(page.locator('#lang-enable-sys')).not.toBeEmpty();
    await expect(page.locator('#lang-preview')).not.toBeEmpty();
  });
});
