import { Page, Locator, expect } from '@playwright/test';
import { URLS } from '../utils/testData';

export class CartPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly removeButton: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly cartItemQuantities: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('#checkout');
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.removeButton = page.locator('[data-test*="remove"]');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemPrices = page.locator('.inventory_item_price');
    this.cartItemQuantities = page.locator('.cart_quantity');
  }

  async expectPageLoaded() {
    await expect(this.pageTitle).toHaveText('Your Cart');
    await expect(this.page).toHaveURL(URLS.BASE_URL + URLS.CART);
  }

  async expectItemInCart(productName: string) {
    const cartItem = this.page.locator('.cart_item').filter({ hasText: productName });
    await expect(cartItem).toBeVisible();
  }

  async expectCartEmpty() {
    await expect(this.cartItems).toHaveCount(0);
  }

  async expectCartItemCount(expectedCount: number) {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async removeItem(productName: string) {
    const removeBtn = this.page.locator(`[data-test="remove-${productName.toLowerCase().replace(/\s+/g, '-')}"]`);
    await removeBtn.click();
  }

  async expectItemRemoved(productName: string) {
    const cartItem = this.page.locator('.cart_item').filter({ hasText: productName });
    await expect(cartItem).not.toBeVisible();
  }

  async expectItemPrice(productName: string, expectedPrice: string) {
    const cartItem = this.page.locator('.cart_item').filter({ hasText: productName });
    await expect(cartItem.locator('.inventory_item_price')).toHaveText(expectedPrice);
  }

  async expectItemQuantity(productName: string, expectedQuantity: string) {
    const cartItem = this.page.locator('.cart_item').filter({ hasText: productName });
    await expect(cartItem.locator('.cart_quantity')).toHaveText(expectedQuantity);
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async getCartItemNames() {
    return await this.cartItemNames.allTextContents();
  }

  async getCartItemPrices() {
    return await this.cartItemPrices.allTextContents();
  }

  async expectCheckoutButtonEnabled() {
    await expect(this.checkoutButton).toBeEnabled();
  }

  async expectContinueShoppingButtonEnabled() {
    await expect(this.continueShoppingButton).toBeEnabled();
  }
} 