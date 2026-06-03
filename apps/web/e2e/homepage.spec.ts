import { test, expect } from '@playwright/test';

test.describe('Homepage & Navigation', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('localhost:3000');
    // Page should not show error
    const body = await page.textContent('body');
    expect(body).not.toContain('Application error');
    expect(body).not.toContain('Internal Server Error');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    // Check login form is present
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');

    // Check registration form fields are present
    await expect(page.locator('input[name="orgName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="orgNum"]')).toBeVisible();
  });

  test('should navigate to events page', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/events');
    const body = await page.textContent('body');
    expect(body).not.toContain('Application error');
  });
});
