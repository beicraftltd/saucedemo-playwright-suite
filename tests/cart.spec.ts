// tests/cart.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { PRODUCTS } from '../utils/testData';

test.describe('Shopping Cart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
  });

  test('should add item to cart successfully', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);
    await productsPage.expectPageLoaded();

    // Act
    await productsPage.addBackpackToCart();

    // Assert
    await productsPage.expectCartBadgeCount('1');
    await expect(page.locator(`[data-test="remove-sauce-labs-backpack"]`)).toBeVisible();
    await expect(page.locator(`[data-test="remove-sauce-labs-backpack"]`)).toHaveText('Remove');
  });

  test('should view cart contents correctly', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    
    await productsPage.expectPageLoaded();
    await productsPage.addBackpackToCart();

    // Act
    await productsPage.goToCart();

    // Assert
    await cartPage.expectPageLoaded();
    await cartPage.expectItemInCart(PRODUCTS.BACKPACK.name);
    await expect(page.locator('.cart_item')).toContainText(PRODUCTS.BACKPACK.price);
    await expect(page.locator('#checkout')).toBeVisible();
    await expect(page.locator('#continue-shopping')).toBeVisible();
  });

  test('should remove item from cart', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    
    await productsPage.expectPageLoaded();
    await productsPage.addBackpackToCart();
    await productsPage.goToCart();
    
    // Act
    await cartPage.removeItem('sauce-labs-backpack');

    // Assert
    await cartPage.expectCartEmpty();
    await productsPage.expectCartBadgeCount('0');
  });

  test('should continue shopping from cart', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    
    await productsPage.expectPageLoaded();
    await productsPage.addBackpackToCart();
    await productsPage.goToCart();

    // Act
    await cartPage.continueShopping();

    // Assert
    await productsPage.expectPageLoaded();
    await productsPage.expectCartBadgeCount('1'); // Cart should be preserved
  });

  test('should add multiple items to cart', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);
    await productsPage.expectPageLoaded();

    // Act
    await productsPage.addBackpackToCart();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    // Assert
    await productsPage.expectCartBadgeCount('2');
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
  });
}); 