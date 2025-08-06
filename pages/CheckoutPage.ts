import { Page, Locator, expect } from '@playwright/test';
import { ERROR_MESSAGES, URLS } from '../utils/testData';

export class CheckoutPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly finishButton: Locator;
  readonly backHomeButton: Locator;
  readonly completeHeader: Locator;
  readonly orderSummary: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.cancelButton = page.locator('#cancel');
    this.errorMessage = page.locator('[data-test="error"]');
    this.finishButton = page.locator('#finish');
    this.backHomeButton = page.locator('#back-to-products');
    this.completeHeader = page.locator('.complete-header');
    this.orderSummary = page.locator('.summary_info');
    this.paymentInfo = page.locator('.summary_value_label').first();
    this.shippingInfo = page.locator('.summary_value_label').last();
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
  }

  async expectInformationPageLoaded() {
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
    await expect(this.page).toHaveURL(URLS.BASE_URL + URLS.CHECKOUT_STEP_ONE);
  }

  async expectOverviewPageLoaded() {
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
    await expect(this.page).toHaveURL(URLS.BASE_URL + URLS.CHECKOUT_STEP_TWO);
  }

  async expectCompletePageLoaded() {
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
    await expect(this.page).toHaveURL(URLS.BASE_URL + URLS.CHECKOUT_COMPLETE);
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async backToProducts() {
    await this.backHomeButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }

  async expectErrorMessage(expectedMessage: string) {
    await expect(this.errorMessage).toHaveText(expectedMessage);
  }

  async expectOrderSummaryDisplayed() {
    await expect(this.orderSummary).toBeVisible();
  }

  async expectOrderSummaryContains(productName: string) {
    const summaryItem = this.page.locator('.cart_item').filter({ hasText: productName });
    await expect(summaryItem).toBeVisible();
  }

  async expectPaymentInfoDisplayed() {
    await expect(this.paymentInfo).toContainText('SauceCard');
  }

  async expectShippingInfoDisplayed() {
    await expect(this.shippingInfo).toContainText('Free Pony Express Delivery');
  }

  async expectSubtotalDisplayed() {
    await expect(this.subtotalLabel).toContainText('Item total');
  }

  async expectTaxDisplayed() {
    await expect(this.taxLabel).toContainText('Tax');
  }

  async expectTotalDisplayed() {
    await expect(this.totalLabel).toContainText('Total');
  }

  async expectCompleteMessage() {
    await expect(this.page.locator('.complete-text')).toContainText('Your order has been dispatched');
  }

  async expectPonyExpressImage() {
    await expect(this.page.locator('.pony_express')).toBeVisible();
  }

  async clearInformationFields() {
    await this.firstNameInput.clear();
    await this.lastNameInput.clear();
    await this.postalCodeInput.clear();
  }

  async expectFormFieldsEmpty() {
    await expect(this.firstNameInput).toHaveValue('');
    await expect(this.lastNameInput).toHaveValue('');
    await expect(this.postalCodeInput).toHaveValue('');
  }
} 