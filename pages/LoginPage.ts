import { Page, Locator, expect } from '@playwright/test';
import { USERS, ERROR_MESSAGES, URLS } from '../utils/testData';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly logoImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
    this.logoImage = page.locator('.login_logo');
  }

  async goto() {
    await this.page.goto(URLS.BASE_URL + URLS.LOGIN);
    await expect(this.logoImage).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAsStandardUser() {
    await this.login(USERS.STANDARD.username, USERS.STANDARD.password);
  }

  async loginAsLockedOutUser() {
    await this.login(USERS.LOCKED_OUT.username, USERS.LOCKED_OUT.password);
  }

  async loginAsProblemUser() {
    await this.login(USERS.PROBLEM.username, USERS.PROBLEM.password);
  }

  async loginAsAdminUser() {
    await this.login(USERS.STANDARD.username, USERS.STANDARD.password);
  }

  async expectErrorMessage(expectedMessage: string) {
    await expect(this.errorMessage).toHaveText(expectedMessage);
  }

  async expectLoginFailure() {
    await expect(this.page).toHaveURL(URLS.BASE_URL + URLS.LOGIN);
    await expect(this.errorMessage).toBeVisible();
  }

  async expectLoginSuccess() {
    await expect(this.page).toHaveURL(URLS.BASE_URL + URLS.INVENTORY);
  }

  async clearFields() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
} 