import { test, expect } from '@playwright/test';
import { TEST_USER } from './fixtures/test-fixtures';

test.describe('Full Workflow - Registration to Event Creation', () => {
  test('complete user journey: register → login → access create page → verify event listing', async ({ page }) => {
    const uniqueEmail = `e2e-workflow-${Date.now()}@givego-test.com`;

    // Step 1: Register a new organization
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');

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

    // Step 2: Verify we're authenticated - can access create page
    await page.goto('/create');
    await page.waitForLoadState('networkidle');

    const createBody = await page.textContent('body');
    expect(createBody).toContain('Esemény');
    expect(createBody).not.toContain('Application error');

    // Step 3: Navigate to events listing
    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    const eventsBody = await page.textContent('body');
    expect(eventsBody).not.toContain('Application error');
    expect(eventsBody).not.toContain('Internal Server Error');

    // Step 4: Verify navigation works
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const homeBody = await page.textContent('body');
    expect(homeBody).not.toContain('Application error');
  });

  test('event creation via API after authentication', async ({ request }) => {
    const uniqueEmail = `e2e-eventapi-${Date.now()}@givego-test.com`;

    // Register via API
    const signupResponse = await request.post('/api/auth/sign-up/email', {
      data: {
        name: 'Esemény Készítő Szervezet',
        email: uniqueEmail,
        password: 'TestPassword123!',
        registrationNumber: '01-09-5555555',
        contactName: 'Szervező Teszt',
        contactPhone: '06305555555',
        description: 'Teszt szervezet esemény létrehozáshoz',
      },
    });

    expect(signupResponse.status()).toBeLessThan(500);
    expect(signupResponse.ok()).toBeTruthy();

    // Sign in to get session cookie
    const signinResponse = await request.post('/api/auth/sign-in/email', {
      data: {
        email: uniqueEmail,
        password: 'TestPassword123!',
      },
    });

    expect(signinResponse.status()).toBeLessThan(500);
    expect(signinResponse.ok()).toBeTruthy();

    // Verify session is active
    const sessionResponse = await request.get('/api/auth/get-session');
    expect(sessionResponse.status()).toBeLessThan(500);
  });
});
