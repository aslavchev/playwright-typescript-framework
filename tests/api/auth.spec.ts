import { test, expect } from '../../src/api/fixtures';
import { ApiUsers } from '../../src/api/data/test-data';
import { Endpoints } from '../../src/api/data/endpoints';
import { AuthMeResponse, LoginResponse, RefreshResponse } from '../../src/api/types/auth.types';

test.describe('Auth API', () => {
    test('[TC-AUTH-001] Valid login returns tokens and user data @smoke @api', async ({ request }) => {
        // Arrange 
        const credentials = ApiUsers.VALID;

        // Act 
        const response = await request.post(Endpoints.LOGIN, { data: credentials });
        const body: LoginResponse = await response.json();

        // Assert
        expect(response.status()).toBe(200);
        expect(body.accessToken).toBeTruthy();
        expect(body.refreshToken).toBeTruthy();
        expect(body.username).toBe('emilys');
        expect(body.firstName).toBe('Emily');
    });

    test('[TC-AUTH-002] Invalid login returns Invalid credentials error @regression @api', async ({ request }) => {
        // Arrange 
        const credentials = ApiUsers.INVALID;

        // Act 
        const response = await request.post(Endpoints.LOGIN, { data: credentials });
        const body = await response.json();

        // Assert
        expect(response.status()).toBe(400);
        expect(body.message).toBe('Invalid credentials');
    });

    test('[TC-AUTH-003] Valid token returns current user on /auth/me @regression @api', async ({ request, authToken }) => {
        // Act 
        const response = await request.get(Endpoints.AUTH_ME, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const body: AuthMeResponse = await response.json();

        // Assert
        expect(response.status()).toBe(200);
        expect(body.username).toBe('emilys');
        expect(body.firstName).toBe('Emily');
    });

    test('[TC-AUTH-004] Valid refresh token returns new token pair @regression @api', async ({ request }) => {
        // Arrange
        const loginResponse = await request.post(Endpoints.LOGIN, { data: ApiUsers.VALID });
        expect(loginResponse.status()).toBe(200);
        const loginBody: LoginResponse = await loginResponse.json();

        // Act
        const response = await request.post(Endpoints.REFRESH, {
            data: { refreshToken: loginBody.refreshToken },
        });
        const body: RefreshResponse = await response.json();

        // Assert
        expect(response.status()).toBe(200);
        expect(body.accessToken).toBeTruthy();
        expect(body.refreshToken).toBeTruthy();
    });
});
