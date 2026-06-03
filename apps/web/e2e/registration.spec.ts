import { test, expect } from '@playwright/test';
import { TEST_USER } from './fixtures/test-fixtures';

test.describe('User Registration', () => {
  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors - wait for error messages to appear
    await expect(page.locator('text=kötelező').first()).toBeVisible({ timeout: 5000 });
    // Check that we're still on the register page (not redirected)
    expect(page.url()).toContain('/auth/register');
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="orgName"]', TEST_USER.orgName);
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.fill('input[name="orgNum"]', TEST_USER.registrationNumber);
    await page.fill('input[name="userName"]', TEST_USER.contactName);
    await page.fill('input[name="userPhone"]', TEST_USER.contactPhone);

    await page.click('button[type="submit"]');

    // Should stay on registration page due to invalid email
    await expect(page.locator('text=e-mail').first()).toBeVisible({ timeout: 5000 });
    expect(page.url()).toContain('/auth/register');
  });

  test('should show error for short password', async ({ page }) => {
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="orgName"]', TEST_USER.orgName);
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', 'short');
    await page.fill('input[name="orgNum"]', TEST_USER.registrationNumber);
    await page.fill('input[name="userName"]', TEST_USER.contactName);
    await page.fill('input[name="userPhone"]', TEST_USER.contactPhone);

    await page.click('button[type="submit"]');

    // Should stay on registration page with password error
    await expect(page.locator('text=8 karakter')).toBeVisible({ timeout: 5000 });
    expect(page.url()).toContain('/auth/register');
  });

  test('should successfully register a new organization', async ({ page }) => {
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');

    const uniqueEmail = `e2e-register-${Date.now()}@givego-test.com`;

    await page.fill('input[name="orgName"]', TEST_USER.orgName);
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.fill('input[name="orgNum"]', TEST_USER.registrationNumber);
    await page.fill('input[name="orgWeb"]', TEST_USER.website);
    await page.fill('input[name="userName"]', TEST_USER.contactName);
    await page.fill('input[name="userPhone"]', TEST_USER.contactPhone);
    await page.fill('textarea[name="orgDescription"]', TEST_USER.description);

    await page.click('button[type="submit"]');

    // Should redirect to /create after successful registration
    await page.waitForURL(/\/(create|dashboard)/, { timeout: 15_000 });
    expect(page.url()).toMatch(/\/(create|dashboard)/);
  });
});
