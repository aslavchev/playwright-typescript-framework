import { Page, Locator } from '@playwright/test';

/** Page object for the SauceDemo checkout complete (confirmation) page. */
export class CheckoutCompletePage {
    private readonly completeHeader: Locator;
    private readonly completeText: Locator;
    private readonly backHomeButton: Locator;

    constructor(page: Page) {
        this.completeHeader = page.getByTestId('complete-header');
        this.completeText = page.getByTestId('complete-text');
        this.backHomeButton = page.getByTestId('back-to-products');
    }

    /** Returns the confirmation header locator. */
    getHeader(): Locator {
        return this.completeHeader;
    }

    /** Returns the dispatch confirmation text locator. */
    getCompleteText(): Locator {
        return this.completeText;
    }

    /** Clicks Back Home to return to the products page. */
    async backToHome(): Promise<void> {
        await this.backHomeButton.click();
    }
}
