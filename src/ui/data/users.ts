/**
 * SauceDemo test user credentials.
 * STANDARD reads from environment variables with fallbacks for local development.
 * LOCKED and INVALID use hardcoded values as they are fixed test scenarios.
 */
export const Users = {
	STANDARD: {
		username: process.env.SAUCE_USERNAME ?? 'standard_user',
		password: process.env.SAUCE_PASSWORD ?? 'secret_sauce',
	},
	LOCKED: {
		username: 'locked_out_user',
		password: 'secret_sauce',
	},
	INVALID: {
		username: 'invalid_user',
		password: 'wrong_password',
	},
} as const;