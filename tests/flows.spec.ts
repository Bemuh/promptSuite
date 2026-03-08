import { test, expect } from '@playwright/test';
import { loadPage, loadPageWithData, getTabNames, defaultTab } from './helpers';

test.describe('Flow (Tab) Management', () => {
  test('default state has one flow on first load', async ({ page }) => {
    await loadPage(page);
    const tabs = await getTabNames(page);
    expect(tabs.length).toBe(1);
    expect(tabs[0]).toBe('New Prompt Template');
  });

  test('create new flow', async ({ page }) => {
    await loadPage(page);
    await page.locator('#add-tab-action').click();
    const tabs = await getTabNames(page);
    expect(tabs.length).toBe(2);
    // New flow should be active
    const activeTab = page.locator('#tabs-list .tab.active span:first-child');
    await expect(activeTab).toHaveText('New Flow');
  });

  test('switch flows changes content', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [
        defaultTab({ id: 't1', name: 'Flow A', template: 'Template A' }),
        defaultTab({ id: 't2', name: 'Flow B', template: 'Template B' }),
      ],
      activeTabId: 't1',
    });
    // Verify Flow A is loaded
    await expect(page.locator('#template')).toHaveValue('Template A');
    // Switch to Flow B
    await page.locator('#tabs-list .tab', { hasText: 'Flow B' }).click();
    await expect(page.locator('#template')).toHaveValue('Template B');
  });

  test('rename flow via double-click', async ({ page }) => {
    await loadPage(page);
    const tab = page.locator('#tabs-list .tab').first();
    await tab.dblclick();
    const input = page.locator('#tabs-list .tab-rename-input').first();
    await input.fill('Renamed Flow');
    await input.press('Enter');
    const tabs = await getTabNames(page);
    expect(tabs[0]).toBe('Renamed Flow');
  });

  test('delete flow with confirmation', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [
        defaultTab({ id: 't1', name: 'Flow A' }),
        defaultTab({ id: 't2', name: 'Flow B' }),
      ],
    });
    // Delete Flow B
    const flowBTab = page.locator('#tabs-list .tab', { hasText: 'Flow B' });
    await flowBTab.hover();
    await flowBTab.locator('.close').click();
    // Confirm in modal
    await page.locator('#modal-confirm-btn').click();
    const tabs = await getTabNames(page);
    expect(tabs.length).toBe(1);
    expect(tabs[0]).toBe('Flow A');
  });

  test('cannot delete last remaining flow', async ({ page }) => {
    await loadPage(page);
    const onlyTab = page.locator('#tabs-list .tab').first();
    await onlyTab.hover();
    await onlyTab.locator('.close').click();
    // Should show toast, not a delete modal
    await expect(page.locator('.toast')).toBeVisible();
  });

  test('duplicate flow creates deep copy', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [
        defaultTab({ id: 't1', name: 'Original', template: '{{A}} {{B}}', vars: { A: 'val1', B: 'val2' }, system: 'sys prompt' }),
      ],
    });
    await page.locator('#tabs-list .tab .duplicate').first().click();
    const tabs = await getTabNames(page);
    expect(tabs.length).toBe(2);
    expect(tabs[1]).toBe('Copy of Original');
    // Verify the copy has the same template
    await expect(page.locator('#template')).toHaveValue('{{A}} {{B}}');
  });

  test('drag and drop reorders tabs', async ({ page }) => {
    await loadPageWithData(page, {
      tabs: [
        defaultTab({ id: 't1', name: 'First' }),
        defaultTab({ id: 't2', name: 'Second' }),
        defaultTab({ id: 't3', name: 'Third' }),
      ],
    });
    const first = page.locator('#tabs-list .tab', { hasText: 'First' });
    const third = page.locator('#tabs-list .tab', { hasText: 'Third' });
    await first.dragTo(third);
    const tabs = await getTabNames(page);
    // After drag, order should change
    expect(tabs[0]).not.toBe('First');
  });
});
