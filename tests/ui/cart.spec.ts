import { test, expect } from '../../src/ui/fixtures';
import { Users } from '../../src/ui/data/users';


test.describe('Cart', () => {
    test('cart is empty by default', async ({ loginPage, cartPage }) => {
        // Arrange
        await loginPage.goto();
        await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);
        await cartPage.goto();

        // Act 
        const cartItemCount = await cartPage.getCartItemCount();

        // Assert
        expect(cartItemCount).toBe(0);
    });

    test('added product appears in cart', async ({ loginPage, productsPage, cartPage }) => {
        // Arrange
        await loginPage.goto();
        await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);
        await productsPage.addToCart('Sauce Labs Backpack');
        await cartPage.goto();

        // Act 
        const cartItemCount = await cartPage.getCartItemCount();

        // Assert
        expect(cartItemCount).toBe(1);
    });

    test('remove item from cart decrements count', async ({ loginPage, productsPage, cartPage }) => {
        // Arrange
        await loginPage.goto();
        await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);
        await productsPage.addToCart('Sauce Labs Backpack');
        await cartPage.goto();
        const cartItemCount = await cartPage.getCartItemCount();
        expect(cartItemCount).toBe(1); //precondition

        // Act         
        await cartPage.removeItem('Sauce Labs Backpack');
        const updateItemCount = await cartPage.getCartItemCount();

        // Assert
        expect(updateItemCount).toBe(0);
    });

    test('navigate to checkout page', async ({ loginPage, productsPage, cartPage, page }) => {
        // Arrange
        await loginPage.goto();
        await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);
        await productsPage.addToCart('Sauce Labs Backpack');
        await cartPage.goto();

        // Act         
        await cartPage.proceedToCheckout();

        // Assert
        await expect(page).toHaveURL(/checkout-step-one/);
    });

});