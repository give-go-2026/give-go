import { test as base, type Page } from '@playwright/test';

export const TEST_USER = {
  orgName: 'Teszt Szervezet Alapítvány',
  email: `e2e-test-${Date.now()}@givego-test.com`,
  password: 'TestPassword123!',
  registrationNumber: '01-09-1234567',
  website: 'https://www.teszt-szervezet.hu',
  contactName: 'Teszt Elek',
  contactPhone: '06301234567',
  description: 'Ez egy teszt szervezet az E2E teszteléshez.',
};

export const TEST_EVENT = {
  eventName: 'Teszt Önkéntes Esemény',
  eventAddress: '1011, Budapest, Fő utca, 1',
  eventTheme: 'Idősek',
  eventType: 'szociális',
  helpFrequency: 'Egyszeri',
  helpMode: 'Személyes',
  description: 'Ez egy teszt esemény leírása az E2E teszteléshez. Legalább 10 karakter hosszú kell legyen.',
  tags: ['Idősek'],
};

type TestFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Register and authenticate before test
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');

    const uniqueEmail = `e2e-test-${Date.now()}-${Math.random().toString(36).slice(2)}@givego-test.com`;

    await page.fill('input[name="orgName"]', TEST_USER.orgName);
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.fill('input[name="orgNum"]', TEST_USER.registrationNumber);
    await page.fill('input[name="orgWeb"]', TEST_USER.website);
    await page.fill('input[name="userName"]', TEST_USER.contactName);
    await page.fill('input[name="userPhone"]', TEST_USER.contactPhone);
    await page.fill('textarea[name="orgDescription"]', TEST_USER.description);

    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(create|dashboard)/, { timeout: 15_000 });

    await use(page);
  },
});

export { expect } from '@playwright/test';
