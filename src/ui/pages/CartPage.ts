import { Page, Locator } from '@playwright/test';

/** Page object for the SauceDemo cart page. */
export class CartPage {
    private readonly cartItem: Locator;
    private readonly checkoutButton: Locator;

    constructor(private readonly page: Page) {
        this.cartItem = page.getByTestId('inventory-item');
        this.checkoutButton = page.getByTestId('checkout');
    }

    /** Navigates to the SauceDemo cart page. */
    async goto() {
        await this.page.goto('/cart.html');
    }

    /** Return the item count in the inventory list.  */
    async getCartItemCount(): Promise<number> {
        return this.cartItem.count();
    }

    /** Removes an item from the cart by product name. */
    async removeItem(productName: string): Promise<void> {
        await this.cartItem
            .filter({ hasText: productName })
            .getByRole('button', { name: 'Remove' })
            .click();
    }

    /** Click on the Checkout button */
    async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }
}