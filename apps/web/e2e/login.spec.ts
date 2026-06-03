import { test, expect } from '@playwright/test';
import { TEST_USER } from './fixtures/test-fixtures';

test.describe('User Login', () => {
  let registeredEmail: string;

  test.beforeAll(async ({ browser }) => {
    // First register a user to test login with
    const page = await browser.newPage();
    registeredEmail = `e2e-login-${Date.now()}@givego-test.com`;

    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="orgName"]', TEST_USER.orgName);
    await page.fill('input[name="email"]', registeredEmail);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.fill('input[name="orgNum"]', TEST_USER.registrationNumber);
    await page.fill('input[name="orgWeb"]', TEST_USER.website);
    await page.fill('input[name="userName"]', TEST_USER.contactName);
    await page.fill('input[name="userPhone"]', TEST_USER.contactPhone);

    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(create|dashboard)/, { timeout: 15_000 });
    await page.close();
  });

  test('should show validation errors for empty login', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    await page.click('button[type="submit"]');

    // Should stay on login page with validation errors
    await expect(page.locator('text=kötelező').first()).toBeVisible({ timeout: 5000 });
    expect(page.url()).toContain('/auth/login');
  });

  test('should show error for wrong credentials', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', 'nonexistent@test.com');
    await page.fill('input[name="password"]', 'WrongPassword123!');

    await page.click('button[type="submit"]');

    // Should stay on login page and show error
    await expect(page.locator('text=Hibás')).toBeVisible({ timeout: 5000 });
    expect(page.url()).toContain('/auth/login');
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', registeredEmail);
    await page.fill('input[name="password"]', TEST_USER.password);

    await page.click('button[type="submit"]');

    // Should redirect after successful login
    await page.waitForURL(/\/(create|dashboard|events)/, { timeout: 15_000 });
    expect(page.url()).not.toContain('/auth/login');
  });
});
