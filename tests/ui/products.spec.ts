import { test, expect } from '../../src/ui/fixtures';
import { Products } from '../../src/ui/data/products';
import { SortOptions } from '../../src/ui/data/sortOptions';

test.describe('Products', () => {

    test.beforeEach(async ({ productsPage }) => {
        await productsPage.goto();
    });

    test('products page loads with 6 items @smoke @ui', async ({ productsPage }) => {
        // Act
        const names = await productsPage.getProductNames();

        // Assert
        expect(names).toHaveLength(6);
    });

    test('products are sorted A to Z by default @smoke @ui', async ({ productsPage }) => {
        // Act
        const names = await productsPage.getProductNames();

        // Assert
        expect(names[0]).toBe(Products.BACKPACK);
        expect(names[names.length - 1]).toBe(Products.TSHIRT_RED);
    });

    test('sort by price low to high reorders products @regression @ui', async ({ productsPage }) => {
        // Act
        await productsPage.sortBy(SortOptions.PRICE_ASC);

        // Assert
        await expect(productsPage.getFirstProductNameLocator()).toHaveText(Products.ONESIE);
    });

    test('add product to cart increments badge to 1 @regression @ui', async ({ productsPage }) => {
        // Act
        await productsPage.addToCart(Products.BACKPACK);

        // Assert
        expect(await productsPage.getCartBadgeCount()).toBe(1);
    });

    test('remove product from cart clears badge @regression @ui', async ({ productsPage }) => {
        // Arrange
        await productsPage.addToCart(Products.BACKPACK);
        await expect(productsPage.getCartBadge()).toBeVisible(); // precondition

        // Act
        await productsPage.removeFromCart(Products.BACKPACK);

        // Assert
        await expect(productsPage.getCartBadge()).not.toBeVisible();
    });
});
