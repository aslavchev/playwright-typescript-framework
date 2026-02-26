import { Page, Locator } from '@playwright/test';

/** Page object for the SauceDemo Products page. */
export class ProductsPage {
    private readonly cartBadge: Locator;
    private readonly sortDropdown: Locator;
    private readonly productItemName: Locator;

    constructor(private readonly page: Page) {
        this.cartBadge = page.getByTestId('shopping-cart-badge');
        this.sortDropdown = page.getByTestId('product-sort-container');
        this.productItemName = page.getByTestId('inventory-item-name');
    }

    /** Navigates directly to the products (inventory) page. */
    async goto(): Promise<void> {
        await this.page.goto('/inventory.html');
    }

    /**
     * Add a specific product to the cart by its visible name
     * @param productName The exact product name as displayed on the page.
     */
    async addToCart(productName: string): Promise<void> {
        await this.page
            .getByTestId('inventory-item')
            .filter({ hasText: productName })
            .getByRole('button', { name: 'Add to cart' })
            .click();
    }

    /** Returns the cart badge locator for explicit visibility assertions. */
    getCartBadge(): Locator {
        return this.cartBadge;
    }

    /** Return the visible names of all products on the page. */
    async getProductNames(): Promise<string[]> {
        return this.productItemName.allTextContents();
    }

    /**
     * Select sort option by visible label.
     * @param option The sort label as shown in the dropdown(e.g. 'Price(low to high)').
     */
    async sortBy(option: string): Promise<void> {
        await this.sortDropdown.selectOption({ label: option });
    }

    /**
     * Remove a specific product from the cart by its visible name.
     * @param productName The exact product name as displayed on the page.
     */
    async removeFromCart(productName: string): Promise<void> {
        await this.page
            .getByTestId('inventory-item')
            .filter({ hasText: productName })
            .getByRole('button', { name: 'Remove' })
            .click();
    }

    /**
     * Return a locator for the first product name.
     * Use with {@link expect().toHaveText} for auto-retry after sort actions,
     * instead of {@link getProductNames} which reads the DOM immediately with no retry.
     */
    getFirstProductNameLocator(): Locator {
        return this.productItemName.first();
    }
}
