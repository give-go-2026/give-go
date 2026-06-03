import { test, expect } from '@playwright/test';

test.describe('API Health & Auth Endpoints', () => {
  test('auth API endpoint should respond', async ({ request }) => {
    // Better Auth exposes API at /api/auth
    const response = await request.get('/api/auth/ok');
    // Should not return 500
    expect(response.status()).not.toBe(500);
  });

  test('should reject unauthenticated session requests', async ({ request }) => {
    const response = await request.get('/api/auth/get-session');
    const data = await response.json();
    // Should return null session or appropriate response
    expect(response.status()).toBeLessThan(500);
  });

  test('should handle sign-up with email and password', async ({ request }) => {
    const uniqueEmail = `e2e-api-${Date.now()}@givego-test.com`;

    const response = await request.post('/api/auth/sign-up/email', {
      data: {
        name: 'API Teszt Szervezet',
        email: uniqueEmail,
        password: 'TestPassword123!',
        registrationNumber: '01-09-9999999',
        contactName: 'API Teszt',
        contactPhone: '06301111111',
      },
    });

    // Should succeed (200/201) or return a handled error
    expect(response.status()).toBeLessThan(500);
  });

  test('should reject duplicate email registration', async ({ request }) => {
    const uniqueEmail = `e2e-dup-${Date.now()}@givego-test.com`;

    // First registration
    await request.post('/api/auth/sign-up/email', {
      data: {
        name: 'Első Szervezet',
        email: uniqueEmail,
        password: 'TestPassword123!',
        registrationNumber: '01-09-8888888',
        contactName: 'Teszt',
        contactPhone: '06302222222',
      },
    });

    // Second registration with same email
    const response = await request.post('/api/auth/sign-up/email', {
      data: {
        name: 'Második Szervezet',
        email: uniqueEmail,
        password: 'TestPassword123!',
        registrationNumber: '01-09-7777777',
        contactName: 'Teszt 2',
        contactPhone: '06303333333',
      },
    });

    // Should return error status (422 or similar), not 500
    expect(response.status()).not.toBe(500);
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('should handle sign-in with valid credentials', async ({ request }) => {
    const uniqueEmail = `e2e-signin-${Date.now()}@givego-test.com`;

    // Register first
    await request.post('/api/auth/sign-up/email', {
      data: {
        name: 'Bejelentkezés Teszt',
        email: uniqueEmail,
        password: 'TestPassword123!',
        registrationNumber: '01-09-6666666',
        contactName: 'Login Teszt',
        contactPhone: '06304444444',
      },
    });

    // Try to sign in
    const response = await request.post('/api/auth/sign-in/email', {
      data: {
        email: uniqueEmail,
        password: 'TestPassword123!',
      },
    });

    expect(response.status()).toBeLessThan(500);
    expect(response.ok()).toBeTruthy();
  });

  test('should reject sign-in with wrong password', async ({ request }) => {
    const response = await request.post('/api/auth/sign-in/email', {
      data: {
        email: 'nonexistent@test.com',
        password: 'WrongPassword!',
      },
    });

    expect(response.status()).not.toBe(500);
    expect(response.ok()).toBeFalsy();
  });
});
