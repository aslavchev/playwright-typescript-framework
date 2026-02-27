import { test as base, expect } from '@playwright/test';
import { ApiUsers } from '../data/test-data';
import { Endpoints } from '../data/endpoints';
import { LoginResponse } from '../types/auth.types';

type ApiFixtures = {
    authToken: string;
};

export const test = base.extend<ApiFixtures>({
    authToken: async ({ request }, use) => {
        const response = await request.post(Endpoints.LOGIN, {
            data: ApiUsers.VALID,
        });
        expect(response.ok()).toBeTruthy();
        const body: LoginResponse = await response.json();
        await use(body.accessToken);
    },
});

export { expect } from '@playwright/test';
