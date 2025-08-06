// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { USERS, ERROR_MESSAGES } from '../utils/testData';

test.describe('User Authentication', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    // Act
    await loginPage.loginAsStandardUser();

    // Assert
    await productsPage.expectPageLoaded();
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
    await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.login('invalid_user', 'secret_sauce');

    // Assert
    await loginPage.expectErrorMessage(ERROR_MESSAGES.INVALID_CREDENTIALS);
    await loginPage.expectLoginFailure();
  });

  test('should show error message for locked out user', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.loginAsLockedOutUser();

    // Assert
    await loginPage.expectErrorMessage(ERROR_MESSAGES.LOCKED_OUT);
    await loginPage.expectLoginFailure();
  });

  test('should require username field', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.login('', 'secret_sauce');

    // Assert
    await loginPage.expectErrorMessage(ERROR_MESSAGES.USERNAME_REQUIRED);
    await loginPage.expectLoginFailure();
  });

  test('should require password field', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.login('standard_user', '');

    // Assert
    await loginPage.expectErrorMessage(ERROR_MESSAGES.PASSWORD_REQUIRED);
    await loginPage.expectLoginFailure();
  });
}); 