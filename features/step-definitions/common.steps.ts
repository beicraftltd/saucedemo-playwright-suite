import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { AdminLoginPage } from '../../pages/AdminLoginPage';

// Given Steps
Given('I am on the hotel booking website', async function (this: CustomWorld) {
  await this.navigateToPage('/');
  this.adminLoginPage = new AdminLoginPage(this.page!);
  console.log('✅ On hotel booking website');
});

Given('I am on the admin login page', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.navigateToAdmin();
  console.log('✅ On admin login page');
});

// Given('I am on the home page', async function (this: CustomWorld) {
//   await this.navigateToPage('/');
//   if (!this.adminLoginPage) {
//     this.adminLoginPage = new AdminLoginPage(this.page!);
//   }
//   console.log('✅ On home page');
// });

// When Steps - Navigation and Form Display
When('I navigate to admin section', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.navigateToAdmin();
  console.log('✅ Navigated to admin section');
});

// When Steps - Form Submission and Validation
When('I submit the login form with empty fields', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.attemptEmptyLogin();
  console.log('✅ Submitted empty login form');
});

When('I attempt login with invalid credentials {string} and {string}', async function (this: CustomWorld, username: string, password: string) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.attemptLogin(username, password);
  console.log(`✅ Attempted login with invalid credentials: ${username}`);
});

When('I attempt login with empty username and password {string}', async function (this: CustomWorld, password: string) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.attemptPasswordOnlyLogin(password);
  console.log('✅ Attempted login with empty username');
});

When('I attempt login with username {string} and empty password', async function (this: CustomWorld, username: string) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.attemptUsernameOnlyLogin(username);
  console.log('✅ Attempted login with empty password');
});

When('I navigate directly to admin dashboard URL', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.navigateDirectlyToAdmin();
  console.log('✅ Navigated directly to admin dashboard URL');
});

When('I attempt login with special characters {string} and {string}', async function (this: CustomWorld, username: string, password: string) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.attemptLogin(username, password);
  console.log('✅ Attempted login with special characters');
});

// When Steps - Accessibility Checks
When('I check the login form accessibility', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.verifyFormAccessibility();
  console.log('✅ Checked login form accessibility');
});

When('I check the admin panel link accessibility', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.verifyAdminLinkAccessibility();
  console.log('✅ Checked admin panel link accessibility');
});

When('I navigate to admin login page', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.navigateToAdmin();
  console.log('✅ Navigated to admin login page');
});

// When Steps - SQL Injection Testing
When('I attempt login with SQL injection payload {string} and {string}', async function (this: CustomWorld, payload1: string, payload2: string) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.attemptLogin(payload1, payload2);
  console.log(`✅ Attempted login with SQL injection payload: ${payload1}`);
});

// Then Steps - Form Display Verification
Then('I should see the login form elements', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.verifyLoginFormElements();
  console.log('✅ Login form elements are visible');
});

Then('all form fields should be visible and accessible', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.verifyLoginFormElements();
  console.log('✅ All form fields are visible and accessible');
});

// Then Steps - Error Message Verification
Then('I should see an error message for empty credentials', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.verifyErrorMessage();
  console.log('✅ Error message for empty credentials displayed');
});

Then('I should see an error message for invalid credentials', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.verifyErrorMessage();
  console.log('✅ Error message for invalid credentials displayed');
});

Then('I should see an error message for missing username', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.verifyErrorMessage();
  console.log('✅ Error message for missing username displayed');
});

Then('I should see an error message for missing password', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.verifyErrorMessage();
  console.log('✅ Error message for missing password displayed');
});

Then('I should remain on the login page', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.verifyOnLoginPage();
  console.log('✅ Remained on login page');
});

// Then Steps - Security Verification
Then('I should be redirected to login page or access denied', async function (this: CustomWorld) {
  // Verify we're redirected to login page or access is denied
  const currentUrl = this.page!.url();
  expect(currentUrl).toMatch(/\/admin/);
  console.log('✅ Redirected to login page or access denied');
});

Then('I should see the login form', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.verifyOnLoginPage();
  console.log('✅ Login form is visible');
});

Then('I should not see dashboard elements', async function (this: CustomWorld) {
  // Verify no dashboard elements are visible
  await expect(this.page!.locator('text=Room Management')).not.toBeVisible();
  await expect(this.page!.locator('text=Create Room')).not.toBeVisible();
  console.log('✅ Dashboard elements are not visible');
});

Then('the form should handle special characters properly', async function (this: CustomWorld) {
  // Verify form handled special characters without errors
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.verifyErrorMessage();
  console.log('✅ Form handled special characters properly');
});

// Then Steps - Accessibility Verification
Then('all form elements should have proper IDs and attributes', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  // Verify form has proper IDs
  await expect(this.adminLoginPage.usernameInput).toHaveAttribute('id', 'username');
  await expect(this.adminLoginPage.passwordInput).toHaveAttribute('id', 'password');
  console.log('✅ Form elements have proper IDs and attributes');
});

Then('password field should have proper type', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  // Verify password field has proper type
  await expect(this.adminLoginPage.passwordInput).toHaveAttribute('type', 'password');
  console.log('✅ Password field has proper type');
});

Then('submit button should be accessible', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  // Verify submit button is accessible
  await expect(this.adminLoginPage.loginButton).toBeVisible();
  await expect(this.adminLoginPage.loginButton).toBeEnabled();
  console.log('✅ Submit button is accessible');
});

Then('the admin link should be visible and clickable', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  // Verify link is visible and clickable
  await expect(this.adminLoginPage.adminPanelLink).toBeVisible();
  await expect(this.adminLoginPage.adminPanelLink).toBeEnabled();
  console.log('✅ Admin link is visible and clickable');
});

Then('the admin link should have proper href attribute', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  // Verify link has proper href
  await expect(this.adminLoginPage.adminPanelLink).toHaveAttribute('href', '/admin');
  console.log('✅ Admin link has proper href attribute');
});

Then('the error message should be accessible', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.verifyErrorMessageAccessibility();
  console.log('✅ Error message is accessible');
});

Then('the error message should have proper styling and content', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  // Verify error message has proper styling and content
  await expect(this.adminLoginPage.errorMessage).toBeVisible();
  await expect(this.adminLoginPage.errorMessage).toContainText('Invalid credentials');
  await expect(this.adminLoginPage.errorMessage).toHaveClass(/alert/);
  console.log('✅ Error message has proper styling and content');
});

// Then Steps - Logout Button Security
Then('the logout button should not be visible', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.verifyLogoutButtonNotVisible();
  console.log('✅ Logout button is not visible');
});

Then('the logout button should still not be visible', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  await this.adminLoginPage.verifyLogoutButtonNotVisible();
  console.log('✅ Logout button is still not visible');
});

// Then Steps - SQL Injection Protection
Then('I should see a generic error message', async function (this: CustomWorld) {
  if (!this.adminLoginPage) {
    this.adminLoginPage = new AdminLoginPage(this.page!);
  }
  // Should show a generic error message, not a SQL error or stack trace
  await this.adminLoginPage.verifyErrorMessage();
  console.log('✅ Generic error message displayed');
});

Then('I should not see SQL error messages or stack traces', async function (this: CustomWorld) {
  // Check for absence of SQL error patterns in the page
  const pageContent = await this.page!.content();
  expect(pageContent).not.toMatch(/sql|syntax|database|exception|stack/i);
  console.log('✅ No SQL error messages or stack traces visible');
});