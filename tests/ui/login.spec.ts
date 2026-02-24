import { test, expect } from '../../src/ui/fixtures';
import { Users } from '../../src/ui/data/users';

test.describe('Login', () => {
  test('standard user logs in successfully', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test('locked out user sees error message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(Users.LOCKED.username, Users.LOCKED.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('locked out');
  });

  test('invalid credentials show error message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(Users.INVALID.username, Users.INVALID.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });
});