import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/** Defines the custom fixture types available to UI tests. */
type UIFixtures = {
	loginPage: LoginPage;
};

/**
 * Extended Playwright test with UI page object fixtures.
 * Each test receives only the page objects it declares as parameters.
 */
export const test = base.extend<UIFixtures>({
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	},
});

export { expect } from '@playwright/test';