// tests/checkout.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PRODUCTS, ERROR_MESSAGES } from '../utils/testData';

test.describe('Checkout Process', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login and add item to cart
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await productsPage.expectPageLoaded();
    await productsPage.addBackpackToCart();
    await productsPage.goToCart();
  });

  test('should complete full checkout process successfully', async ({ page }) => {
    // Arrange
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const productsPage = new ProductsPage(page);
    
    await cartPage.expectPageLoaded();
    await cartPage.expectItemInCart(PRODUCTS.BACKPACK.name);

    // Act & Assert - Step 1: Start checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.expectInformationPageLoaded();

    // Act & Assert - Step 2: Fill information
    await checkoutPage.fillInformation('John', 'Doe', 'SW1A 1AA');
    await checkoutPage.continueToOverview();
    await checkoutPage.expectOverviewPageLoaded();

    // Act & Assert - Step 3: Review order
    await checkoutPage.expectOrderSummaryDisplayed();
    await checkoutPage.expectOrderSummaryContains(PRODUCTS.BACKPACK.name);
    await expect(page.locator('.summary_total_label')).toContainText('Total');

    // Act & Assert - Step 4: Complete order
    await checkoutPage.finishOrder();
    await checkoutPage.expectCompletePageLoaded();
    await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');

    // Act & Assert - Step 5: Return to products
    await checkoutPage.backToProducts();
    await productsPage.expectPageLoaded();
    await productsPage.expectCartBadgeCount('0'); // Cart should be empty
  });

  test('should validate required fields in checkout form', async ({ page }) => {
    // Arrange
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    await cartPage.proceedToCheckout();
    await checkoutPage.expectInformationPageLoaded();

    // Test missing first name
    await checkoutPage.fillInformation('', 'Doe', 'SW1A 1AA');
    await checkoutPage.continueToOverview();
    await checkoutPage.expectErrorMessage(ERROR_MESSAGES.FIRST_NAME_REQUIRED);

    // Test missing last name
    await checkoutPage.fillInformation('John', '', 'SW1A 1AA');
    await checkoutPage.continueToOverview();
    await checkoutPage.expectErrorMessage(ERROR_MESSAGES.LAST_NAME_REQUIRED);

    // Test missing postal code
    await checkoutPage.fillInformation('John', 'Doe', '');
    await checkoutPage.continueToOverview();
    await checkoutPage.expectErrorMessage(ERROR_MESSAGES.POSTAL_CODE_REQUIRED);
  });

  test('should cancel checkout and preserve cart', async ({ page }) => {
    // Arrange
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const productsPage = new ProductsPage(page);
    
    await cartPage.proceedToCheckout();
    await checkoutPage.expectInformationPageLoaded();

    // Act
    await page.locator('#cancel').click();

    // Assert
    await cartPage.expectPageLoaded();
    await cartPage.expectItemInCart(PRODUCTS.BACKPACK.name);
    await productsPage.expectCartBadgeCount('1'); // Cart should be preserved
  });

  test('should display correct order summary on overview page', async ({ page }) => {
    // Arrange
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInformation('John', 'Doe', 'SW1A 1AA');
    await checkoutPage.continueToOverview();

    // Assert
    await checkoutPage.expectOverviewPageLoaded();
    await expect(page.locator('.cart_item')).toContainText(PRODUCTS.BACKPACK.name);
    await expect(page.locator('.cart_item')).toContainText(PRODUCTS.BACKPACK.price);
    await expect(page.locator('.summary_subtotal_label')).toContainText('Item total');
    await expect(page.locator('.summary_tax_label')).toContainText('Tax');
    await expect(page.locator('.summary_total_label')).toContainText('Total');
    
    // Verify payment and shipping information
    await expect(page.locator('[data-test="payment-info-value"]')).toHaveText('SauceCard #31337');
    await expect(page.locator('[data-test="shipping-info-value"]')).toHaveText('Free Pony Express Delivery!');
  });

  test('should handle checkout with multiple items', async ({ page }, testInfo) => {
    // This test demonstrates handling multiple items in checkout
    // Skip the beforeEach setup for this test as we need different setup
    testInfo.skip(); // Skip for now, but structure shows how to handle multiple items
    
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Custom setup for multiple items
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await productsPage.addBackpackToCart();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await productsPage.goToCart();
    
    // Verify multiple items in cart
    await expect(page.locator('.cart_item')).toHaveCount(2);
    
    // Complete checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInformation('John', 'Doe', 'SW1A 1AA');
    await checkoutPage.continueToOverview();
    
    // Verify both items in summary
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await checkoutPage.finishOrder();
    await checkoutPage.expectCompletePageLoaded();
  });
}); 