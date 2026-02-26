import { test as setup } from '@playwright/test';
import { Users } from '../src/ui/data/users';

const authFile = 'playwright/.auth/user.json';

/** Logs in once and saves the browser storage state for reuse across all tests. */
setup('authenticate', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill(Users.STANDARD.username);
    await page.getByPlaceholder('Password').fill(Users.STANDARD.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/inventory/);
    await page.context().storageState({ path: authFile });
});
