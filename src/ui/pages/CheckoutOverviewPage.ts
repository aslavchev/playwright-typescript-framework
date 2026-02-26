import { Page, Locator } from '@playwright/test';

/** Page object for the SauceDemo checkout step two (overview) page. */
export class CheckoutOverviewPage {
    private readonly finishButton: Locator;

    constructor(page: Page) {
        this.finishButton = page.getByTestId('finish');
    }

    /** Clicks Finish to complete the order. */
    async finishCheckout(): Promise<void> {
        await this.finishButton.click();
    }

    /** Returns the finish button locator. */
    getFinishButton(): Locator {
        return this.finishButton;
    }
}
