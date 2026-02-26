import { test, expect } from '../../src/ui/fixtures';
import { Users } from '../../src/ui/data/users';
import { Products } from '../../src/ui/data/products';

test.describe('Cart', () => {

    test.describe('empty cart', () => {
        test.beforeEach(async ({ loginPage, cartPage }) => {
            await loginPage.goto();
            await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);
            await cartPage.goto();
        });

        test('cart is empty by default @smoke @ui', async ({ cartPage }) => {
            // Act
            const cartItemCount = await cartPage.getCartItemCount();

            // Assert
            expect(cartItemCount).toBe(0);
        });
    });

    test.describe('cart with items', () => {
        test.beforeEach(async ({ loginPage, productsPage, cartPage }) => {
            await loginPage.goto();
            await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);
            await productsPage.addToCart(Products.BACKPACK);
            await cartPage.goto();
        });

        test('added product appears in cart @smoke @ui', async ({ cartPage }) => {
            // Act
            const cartItemCount = await cartPage.getCartItemCount();

            // Assert
            expect(cartItemCount).toBe(1);
        });

        test('remove item from cart decrements count @regression @ui', async ({ cartPage }) => {
            // Arrange
            expect(await cartPage.getCartItemCount()).toBe(1); // precondition

            // Act
            await cartPage.removeItem(Products.BACKPACK);

            // Assert
            const updatedItemCount = await cartPage.getCartItemCount();
            expect(updatedItemCount).toBe(0);
        });

        test('navigate to checkout page @smoke @ui', async ({ cartPage, page }) => {
            // Act
            await cartPage.proceedToCheckout();

            // Assert
            await expect(page).toHaveURL(/checkout-step-one/);
        });
    });
});
