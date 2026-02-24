import {Page, Locator} from '@playwright/test';

/** Page object for the SauceDemo login page. */
export class LoginPage {
	private readonly usernameInput: Locator;
	private readonly passwordInput: Locator;
	private readonly loginButton: Locator;
	private readonly errorMessage: Locator;

	constructor(private readonly page: Page) {
		this.usernameInput = page.getByPlaceholder('Username');
		this.passwordInput = page.getByPlaceholder('Password');
		this.loginButton   = page.getByRole('button', { name: 'Login' });
		this.errorMessage  = page.getByTestId('error');
	}

	/** Navigates to the SauceDemo login page. */
	async goto() {
		await this.page.goto('/');
	}

	/**
	 * Fills in credentials and submits the login form.
	 * @param username - The account username
	 * @param password - The account password
	 */
	async login(username: string, password: string) {
		await this.usernameInput.fill(username);
		await this.passwordInput.fill(password);
		await this.loginButton.click();
	}

	/** Returns the error message text, or empty string if not present. */
	async getErrorMessage(): Promise<string> {
		return (await this.errorMessage.textContent()) ?? '';
	}
}
