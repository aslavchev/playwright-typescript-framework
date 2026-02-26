import { test, expect } from '../../src/ui/fixtures';
import { Users } from '../../src/ui/data/users';

test.describe('Login', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goto();
    });

    test('standard user logs in successfully @smoke @ui', async ({ loginPage, page }) => {
        // Act
        await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);

        // Assert
        await expect(page).toHaveURL(/inventory/);
    });

    test('locked out user sees error message @regression @ui', async ({ loginPage }) => {
        // Act
        await loginPage.login(Users.LOCKED.username, Users.LOCKED.password);

        // Assert
        const error = await loginPage.getErrorMessage();
        expect(error).toContain('locked out');
    });

    test('invalid credentials show error message @regression @ui', async ({ loginPage }) => {
        // Act
        await loginPage.login(Users.INVALID.username, Users.INVALID.password);

        // Assert
        const error = await loginPage.getErrorMessage();
        expect(error).toContain('Username and password do not match');
    });
});
