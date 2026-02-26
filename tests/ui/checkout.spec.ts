import { test, expect } from '../../src/ui/fixtures';
import { Users } from '../../src/ui/data/users';

test.describe('Checkout', () => {
    test.describe('Step 1 - Customer Checkout Info', () => {
        test.beforeEach(async ({ loginPage, cartPage, productsPage }) => {
            await loginPage.goto();
            await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);
            await productsPage.addToCart('Sauce Labs Backpack');
            await cartPage.goto();
            await cartPage.proceedToCheckout();
        });

        test('valid customer info navigates to checkout overview @smoke @ui', async ({ checkoutInfoPage, page }) => {
            // Act
            await checkoutInfoPage.fillCustomerInfo('ale', 'sl', '1000');
            await checkoutInfoPage.continueToOverview();

            // Assert
            await expect(page).toHaveURL(/checkout-step-two/);
        });

        test('missing first name shows error @regression @ui', async ({ checkoutInfoPage }) => {
            // Act
            await checkoutInfoPage.fillCustomerInfo('', 'sl', '1000');
            await checkoutInfoPage.continueToOverview();

            // Assert
            await expect(checkoutInfoPage.getErrorMessage()).toContainText('First Name is required');
        });

        test('missing last name shows error @regression @ui', async ({ checkoutInfoPage }) => {
            // Act
            await checkoutInfoPage.fillCustomerInfo('al', '', '1000');
            await checkoutInfoPage.continueToOverview();

            // Assert
            await expect(checkoutInfoPage.getErrorMessage()).toContainText('Last Name is required');
        });

        test('missing postal code shows error @regression @ui', async ({ checkoutInfoPage }) => {
            // Act
            await checkoutInfoPage.fillCustomerInfo('al', 'sl', '');
            await checkoutInfoPage.continueToOverview();

            // Assert
            await expect(checkoutInfoPage.getErrorMessage()).toContainText('Postal Code is required');
        });
    });
});
