import { test, expect } from '@playwright/test';
import { loadPage, loadPageWithData, defaultTab } from './helpers';
import path from 'path';
import fs from 'fs';
import os from 'os';

test.describe('Import / Export', () => {
  test('import valid JSON loads flows correctly', async ({ page }) => {
    await loadPage(page);
    const importData = {
      tabs: [
        defaultTab({ id: 'imp1', name: 'Imported Flow', template: 'imported template' }),
      ],
      sharedStore: { vars: { key: 'value' }, ts: {} },
    };

    const tmpFile = path.join(os.tmpdir(), 'test-import.json');
    fs.writeFileSync(tmpFile, JSON.stringify(importData));

    const fileInput = page.locator('#importFile');
    await fileInput.setInputFiles(tmpFile);

    // Should show import summary modal
    await expect(page.locator('#import-summary')).toBeVisible();
    await expect(page.locator('#import-summary')).toContainText('1 flow');

    // Confirm import
    await page.locator('#modal-confirm-btn').click();

    // Verify flow loaded
    await expect(page.locator('#template')).toHaveValue('imported template');

    fs.unlinkSync(tmpFile);
  });

  test('import legacy array format works', async ({ page }) => {
    await loadPage(page);
    const importData = [
      defaultTab({ id: 'leg1', name: 'Legacy Flow', template: 'legacy template' }),
    ];

    const tmpFile = path.join(os.tmpdir(), 'test-legacy.json');
    fs.writeFileSync(tmpFile, JSON.stringify(importData));

    await page.locator('#importFile').setInputFiles(tmpFile);
    await expect(page.locator('#import-summary')).toBeVisible();
    await page.locator('#modal-confirm-btn').click();
    await expect(page.locator('#template')).toHaveValue('legacy template');

    fs.unlinkSync(tmpFile);
  });

  test('import invalid JSON shows error toast', async ({ page }) => {
    await loadPage(page);
    const tmpFile = path.join(os.tmpdir(), 'test-invalid.json');
    fs.writeFileSync(tmpFile, 'not json at all');

    await page.locator('#importFile').setInputFiles(tmpFile);
    await expect(page.locator('.toast')).toBeVisible();

    fs.unlinkSync(tmpFile);
  });

  test('import with missing fields applies defaults', async ({ page }) => {
    await loadPage(page);
    const importData = {
      tabs: [{ id: 'min1', name: 'Minimal', template: 'minimal' }], // Missing vars, system, etc.
    };

    const tmpFile = path.join(os.tmpdir(), 'test-minimal.json');
    fs.writeFileSync(tmpFile, JSON.stringify(importData));

    await page.locator('#importFile').setInputFiles(tmpFile);
    await expect(page.locator('#import-summary')).toBeVisible();
    await page.locator('#modal-confirm-btn').click();
    await expect(page.locator('#template')).toHaveValue('minimal');

    fs.unlinkSync(tmpFile);
  });

  test('import with empty tabs array shows error', async ({ page }) => {
    await loadPage(page);
    const importData = { tabs: [] };

    const tmpFile = path.join(os.tmpdir(), 'test-empty.json');
    fs.writeFileSync(tmpFile, JSON.stringify(importData));

    await page.locator('#importFile').setInputFiles(tmpFile);
    await expect(page.locator('.toast')).toBeVisible();

    fs.unlinkSync(tmpFile);
  });
});
