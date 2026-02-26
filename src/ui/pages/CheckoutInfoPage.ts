import { Page, Locator } from '@playwright/test';

/** Page object for the SauceDemo checkout step one page. */
export class CheckoutInfoPage {
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly postalCode: Locator;
    private readonly continueButton: Locator;

    constructor(private readonly page: Page) {
        this.firstName = page.getByTestId('firstName');
        this.lastName = page.getByTestId('lastName');
        this.postalCode = page.getByTestId('postalCode');
        this.continueButton = page.getByTestId('continue');
    }

    /** Navigates to the SauceDemo checkout step one page. */
    async goto() {
        await this.page.goto('/checkout-step-one.html');
    }

    /** Fills the customer information form. */
    async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
    }

    /** Clicks Continue to navigate to the checkout overview page. */
    async continueToOverview(): Promise<void> {
        await this.continueButton.click();
    }

    /** Returns the error message locator. */
    getErrorMessage(): Locator {
        return this.page.getByTestId('error');
    }
}