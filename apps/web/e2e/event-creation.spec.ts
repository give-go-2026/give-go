import { test, expect } from '@playwright/test';
import { TEST_USER, TEST_EVENT } from './fixtures/test-fixtures';

test.describe('Event Creation', () => {
  test('should require authentication to create events', async ({ page }) => {
    await page.goto('/create');
    await page.waitForLoadState('networkidle');

    // Should show auth gate or redirect to login
    const url = page.url();
    const body = await page.textContent('body');

    // Either redirected to login or shows auth gate
    const isProtected =
      url.includes('/auth') ||
      body?.includes('Bejelentkezés') ||
      body?.includes('regisztrálj');
    expect(isProtected).toBeTruthy();
  });

  test('should access create page after registration and fill event form', async ({ page }) => {
    // Register first
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');

    const uniqueEmail = `e2e-event-${Date.now()}@givego-test.com`;

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

    // Navigate to create page if not already there
    if (!page.url().includes('/create')) {
      await page.goto('/create');
      await page.waitForLoadState('networkidle');
    }

    // Verify create page loaded
    const body = await page.textContent('body');
    expect(body).toContain('Esemény');
    expect(body).not.toContain('Application error');
  });

  test('full event creation workflow - fill all steps', async ({ page }) => {
    // Register
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');

    const uniqueEmail = `e2e-fullevent-${Date.now()}@givego-test.com`;

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

    // Navigate to create page
    await page.goto('/create');
    await page.waitForLoadState('networkidle');

    // The create page uses sessionStorage for form data
    // Since this is a multi-step form, we set sessionStorage values to simulate filling the form
    await page.evaluate((testEvent) => {
      sessionStorage.setItem('eventName', testEvent.eventName);
      sessionStorage.setItem('eventAddress', testEvent.eventAddress);
      sessionStorage.setItem('eventTheme', testEvent.eventTheme);
      sessionStorage.setItem('eventType', testEvent.eventType);
      sessionStorage.setItem('helpFrequency', testEvent.helpFrequency);
      sessionStorage.setItem('helpMode', testEvent.helpMode);
      sessionStorage.setItem('eventTags', JSON.stringify(testEvent.tags));
      sessionStorage.setItem('eventStartDate', '2026-12-01');
      sessionStorage.setItem('eventStartTime', '09:00');
      sessionStorage.setItem('eventEndDate', '2026-12-01');
      sessionStorage.setItem('eventEndTime', '17:00');
      sessionStorage.setItem('eventCloseTime', '17:00');
      sessionStorage.setItem('desc', testEvent.description);
      sessionStorage.setItem('eventImages', JSON.stringify(['https://placeholder.com/test.jpg']));
    }, TEST_EVENT);

    // Reload to ensure sessionStorage is available
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify the form page is accessible (multi-step form)
    const body = await page.textContent('body');
    expect(body).toContain('Esemény');
  });
});
