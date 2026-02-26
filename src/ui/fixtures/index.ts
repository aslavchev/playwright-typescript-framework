import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

/** Defines the custom fixture types available to UI tests. */
type UIFixtures = {
	loginPage: LoginPage;
	productsPage: ProductsPage;
	cartPage: CartPage;
	checkoutInfoPage: CheckoutInfoPage;
	checkoutOverviewPage: CheckoutOverviewPage;
	checkoutCompletePage: CheckoutCompletePage;
};

/**
 * Extended Playwright test with UI page object fixtures.
 * Each test receives only the page objects it declares as parameters.
 */
export const test = base.extend<UIFixtures>({
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	},
	productsPage: async ({ page }, use) => {
		await use(new ProductsPage(page));
	},
	cartPage: async ({ page }, use) => {
		await use(new CartPage(page));
	},
	checkoutInfoPage: async ({ page }, use) => {
		await use(new CheckoutInfoPage(page));
	},
	checkoutOverviewPage: async ({ page }, use) => {
		await use(new CheckoutOverviewPage(page));
	},
	checkoutCompletePage: async ({ page }, use) => {
		await use(new CheckoutCompletePage(page));
	}
});

export { expect } from '@playwright/test';