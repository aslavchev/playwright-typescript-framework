import { test, expect } from '../../src/ui/fixtures';
import { Users } from '../../src/ui/data/users';

test.describe('Products', () => {
    test('products page loads with 6 items', async ({ loginPage, productsPage }) => {
        await loginPage.goto();
        await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);

        const names = await productsPage.getProductNames();
        expect(names).toHaveLength(6);
    });

    test('products are sorted A to Z by default', async ({ loginPage, productsPage }) => {
        await loginPage.goto();
        await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);

        const names = await productsPage.getProductNames();
        expect(names[0]).toBe('Sauce Labs Backpack');
        expect(names[names.length - 1]).toBe('Test.allTheThings() T-Shirt (Red)');
    });

    test('sort by price low to high reorders products', async ({ loginPage, productsPage }) => {
        await loginPage.goto();
        await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);

        await productsPage.sortBy('Price (low to high)');
        await expect(productsPage.getFirstProductNameLocator()).toHaveText('Sauce Labs Onesie');
    });

    test('add product to cart increments badge to 1', async ({ loginPage, productsPage }) => {
        await loginPage.goto();
        await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);

        await productsPage.addToCart('Sauce Labs Backpack');
        expect(await productsPage.getCartBadgeCount()).toBe(1);
    });

    test('remove product from cart clears badge', async ({ loginPage, productsPage }) => {
        await loginPage.goto();
        await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);

        await productsPage.addToCart('Sauce Labs Backpack');
        expect(await productsPage.getCartBadgeCount()).toBe(1);

        await productsPage.removeFromCart('Sauce Labs Backpack');
        expect(await productsPage.getCartBadgeCount()).toBe(0);
    });
});
