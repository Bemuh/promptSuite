import { Page } from '@playwright/test';
import path from 'path';

/**
 * Navigate to the index.html page using file:// protocol.
 * Clears localStorage before each test for isolation.
 */
export async function loadPage(page: Page) {
  const filePath = path.resolve(__dirname, '..', 'index.html');
  const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;
  await page.goto(fileUrl);
  await page.evaluate(() => localStorage.clear());
  await page.goto(fileUrl);
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Seed localStorage with specific data before loading the page.
 */
export async function loadPageWithData(page: Page, data: {
  tabs?: any[];
  sharedStore?: any;
  theme?: string;
  lang?: string;
  activeTabId?: string;
}) {
  const filePath = path.resolve(__dirname, '..', 'index.html');
  const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;
  await page.goto(fileUrl);
  await page.evaluate((d) => {
    localStorage.clear();
    if (d.tabs) localStorage.setItem('modular_flows_v12', JSON.stringify(d.tabs));
    if (d.sharedStore) localStorage.setItem('modular_shared_v12', JSON.stringify(d.sharedStore));
    if (d.theme) localStorage.setItem('theme_mode_v12', d.theme);
    if (d.lang) localStorage.setItem('app_lang_v12', d.lang);
    if (d.activeTabId) localStorage.setItem('active_tab_id_v12', d.activeTabId);
  }, data);
  await page.goto(fileUrl);
  await page.waitForLoadState('domcontentloaded');
}

/** Get the template textarea value */
export async function getTemplateValue(page: Page): Promise<string> {
  return page.locator('#template').inputValue();
}

/** Set the template textarea value and trigger input */
export async function setTemplate(page: Page, value: string) {
  await page.locator('#template').fill(value);
  // Wait for debounced extractVariables
  await page.waitForTimeout(400);
}

/** Get all visible tab names */
export async function getTabNames(page: Page): Promise<string[]> {
  return page.locator('#tabs-list .tab span:first-child:not(.hidden):not(.tab-actions)').allTextContents();
}

/** Click the active flow's generate button */
export async function clickGenerate(page: Page) {
  await page.locator('#lang-generate').click();
}

/** Click the preview button */
export async function clickPreview(page: Page) {
  await page.locator('#lang-preview').click();
}

/** Get the modal overlay */
export function getModalOverlay(page: Page) {
  return page.locator('#modal-overlay');
}

/** Close the modal */
export async function closeModal(page: Page) {
  await page.locator('#modal-confirm-btn').click();
}

/** Default tab for seeding */
export function defaultTab(overrides: Partial<any> = {}) {
  return {
    id: 't1',
    name: 'Test Flow',
    system: '',
    template: '',
    vars: {},
    useSystem: false,
    collapsedStates: {},
    ts: {},
    ...overrides,
  };
}
