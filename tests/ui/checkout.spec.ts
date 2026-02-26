import { test, expect } from '../../src/ui/fixtures';
import { Customers } from '../../src/ui/data/customers';
import { Products } from '../../src/ui/data/products';

test.describe('Checkout', () => {
    test.beforeEach(async ({ productsPage, cartPage }) => {
        await productsPage.goto();
        await productsPage.addToCart(Products.BACKPACK);
        await cartPage.goto();
        await cartPage.proceedToCheckout();
    });

    test.describe('Step 1 - Customer Checkout Info', () => {

        test('[TC-CHECKOUT-001] valid customer info navigates to checkout overview @smoke @ui', async ({ checkoutInfoPage, page }) => {
            // Act
            await checkoutInfoPage.fillCustomerInfo(Customers.STANDARD.firstName, Customers.STANDARD.lastName, Customers.STANDARD.postalCode);
            await checkoutInfoPage.continueToOverview();

            // Assert
            await expect(page).toHaveURL(/checkout-step-two/);
        });

        test('[TC-CHECKOUT-002] missing first name shows error @regression @ui', async ({ checkoutInfoPage, page }) => {
            // Act
            await checkoutInfoPage.fillCustomerInfo('', Customers.STANDARD.lastName, Customers.STANDARD.postalCode);
            await checkoutInfoPage.continueToOverview();

            // Assert
            await expect(page).toHaveURL(/checkout-step-one/);
            await expect(checkoutInfoPage.getErrorMessage()).toContainText('First Name is required');
        });

        test('[TC-CHECKOUT-003] missing last name shows error @regression @ui', async ({ checkoutInfoPage, page }) => {
            // Act
            await checkoutInfoPage.fillCustomerInfo(Customers.STANDARD.firstName, '', Customers.STANDARD.postalCode);
            await checkoutInfoPage.continueToOverview();

            // Assert
            await expect(page).toHaveURL(/checkout-step-one/);
            await expect(checkoutInfoPage.getErrorMessage()).toContainText('Last Name is required');
        });

        test('[TC-CHECKOUT-004] missing postal code shows error @regression @ui', async ({ checkoutInfoPage, page }) => {
            // Act
            await checkoutInfoPage.fillCustomerInfo(Customers.STANDARD.firstName, Customers.STANDARD.lastName, '');
            await checkoutInfoPage.continueToOverview();

            // Assert
            await expect(page).toHaveURL(/checkout-step-one/);
            await expect(checkoutInfoPage.getErrorMessage()).toContainText('Postal Code is required');
        });
    });

    test.describe('Step 2 - Checkout Overview', () => {
        test.beforeEach(async ({ checkoutInfoPage, checkoutOverviewPage }) => {
            await checkoutInfoPage.fillCustomerInfo(Customers.STANDARD.firstName, Customers.STANDARD.lastName, Customers.STANDARD.postalCode);
            await checkoutInfoPage.continueToOverview();
            await expect(checkoutOverviewPage.getFinishButton()).toBeVisible();
        });

        test('[TC-CHECKOUT-005] finish checkout navigates to confirmation @smoke @ui', async ({ checkoutOverviewPage, checkoutCompletePage }) => {
            // Act
            await checkoutOverviewPage.finishCheckout();

            // Assert
            await expect(checkoutCompletePage.getHeader()).toContainText('Thank you for your order!');
        });
    });

    test.describe('Step 3 - Checkout Complete', () => {
        test.beforeEach(async ({ page, checkoutInfoPage, checkoutOverviewPage }) => {
            await checkoutInfoPage.fillCustomerInfo(Customers.STANDARD.firstName, Customers.STANDARD.lastName, Customers.STANDARD.postalCode);
            await checkoutInfoPage.continueToOverview();
            await checkoutOverviewPage.finishCheckout();
            await expect(page).toHaveURL(/checkout-complete/);
        });

        test('[TC-CHECKOUT-006] back home returns to products with empty cart @smoke @e2e @ui', async ({ checkoutCompletePage, productsPage, page }) => {
            // Arrange
            await expect(checkoutCompletePage.getCompleteText()).toContainText('Your order has been dispatched');

            // Act
            await checkoutCompletePage.backToHome();

            // Assert
            await expect(page).toHaveURL(/inventory/);
            await expect(productsPage.getCartBadge()).toBeHidden();
        });
    });
});
