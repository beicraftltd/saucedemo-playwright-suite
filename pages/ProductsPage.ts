import { Page, Locator, expect } from '@playwright/test';
import { PRODUCTS, URLS } from '../utils/testData';

export class ProductsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly hamburgerMenu: Locator;
  readonly sortDropdown: Locator;
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.hamburgerMenu = page.locator('#react-burger-menu-btn');
    this.sortDropdown = page.locator('.product_sort_container');
    this.productItems = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
  }

  async expectPageLoaded() {
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.page).toHaveURL(URLS.BASE_URL + URLS.INVENTORY);
  }

  async addProductToCart(productName: string) {
    const addToCartButton = this.page.locator(`[data-test="add-to-cart-${productName.toLowerCase().replace(/\s+/g, '-')}"]`);
    await addToCartButton.click();
  }

  async addBackpackToCart() {
    await this.page.locator(`[data-test="${PRODUCTS.BACKPACK.addToCartId}"]`).click();
  }

  async addBikeLightToCart() {
    await this.page.locator(`[data-test="${PRODUCTS.BIKE_LIGHT.addToCartId}"]`).click();
  }

  async addBoltTShirtToCart() {
    await this.page.locator(`[data-test="${PRODUCTS.BOLT_TSHIRT.addToCartId}"]`).click();
  }

  async addFleeceJacketToCart() {
    await this.page.locator(`[data-test="${PRODUCTS.FLEECE_JACKET.addToCartId}"]`).click();
  }

  async addOnesieToCart() {
    await this.page.locator(`[data-test="${PRODUCTS.ONESIE.addToCartId}"]`).click();
  }

  async addTestAllThingsToCart() {
    await this.page.locator(`[data-test="${PRODUCTS.TEST_ALL_THINGS.addToCartId}"]`).click();
  }

  async removeProductFromCart(productName: string) {
    const removeButton = this.page.locator(`[data-test="remove-${productName.toLowerCase().replace(/\s+/g, '-')}"]`);
    await removeButton.click();
  }

  async expectCartBadgeCount(count: string) {
    if (count === '0') {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      await expect(this.cartBadge).toHaveText(count);
    }
  }

  async expectProductButtonText(productName: string, buttonText: string) {
    const button = this.page.locator(`[data-test*="${productName.toLowerCase().replace(/\s+/g, '-')}"]`);
    await expect(button).toHaveText(buttonText);
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async expectProductsDisplayed(expectedCount: number = 6) {
    await expect(this.productItems).toHaveCount(expectedCount);
  }

  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async expectProductsSortedByName(ascending: boolean = true) {
    const names = await this.productNames.allTextContents();
    const sortedNames = [...names].sort();
    
    if (ascending) {
      expect(names).toEqual(sortedNames);
    } else {
      expect(names).toEqual(sortedNames.reverse());
    }
  }

  async expectProductsSortedByPrice(ascending: boolean = true) {
    const prices = await this.productPrices.allTextContents();
    const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
    const sortedPrices = [...numericPrices].sort((a, b) => a - b);
    
    if (ascending) {
      expect(numericPrices).toEqual(sortedPrices);
    } else {
      expect(numericPrices).toEqual(sortedPrices.reverse());
    }
  }

  async openHamburgerMenu() {
    await this.hamburgerMenu.click();
  }

  async expectHamburgerMenuOpen() {
    await expect(this.page.locator('.bm-menu-wrap')).toBeVisible();
  }

  async closeHamburgerMenu() {
    await this.page.locator('#react-burger-cross-btn').click();
  }

  async logout() {
    await this.openHamburgerMenu();
    await this.page.locator('#logout_sidebar_link').click();
  }
} 