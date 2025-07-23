import { Page, Locator, expect } from '@playwright/test';

/**
 * Admin Login Page Object
 * 
 * This class encapsulates all interactions with the admin login page,
 * providing a clean interface for admin access verification tests.
 */
export class AdminLoginPage {
  readonly page: Page;
  
  // Form elements
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  
  // Error messages
  readonly errorMessage: Locator;
  
  // Navigation
  readonly adminPanelLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize form elements
    this.usernameInput = page.locator('input[id="username"]');
    this.passwordInput = page.locator('input[id="password"]');
    this.loginButton = page.locator('button[id="doLogin"]');
    
    // Initialize error message
    this.errorMessage = page.locator('.alert-danger');
    
    // Initialize navigation
    this.adminPanelLink = page.locator('text=Admin panel');
    this.logoutButton = page.locator('button:has-text("Logout")');
  }

  /**
   * Navigate to the admin login page
   */
  async navigateToAdmin(): Promise<void> {
    console.log('🔐 Navigating to admin section...');
    await this.adminPanelLink.click();
    await this.page.waitForLoadState('networkidle');
    
    // Verify we're on the admin login page
    await expect(this.page).toHaveURL(/.*\/admin/);
    console.log('✅ Successfully navigated to admin login page');
  }

  /**
   * Navigate directly to admin URL
   */
  async navigateDirectlyToAdmin(): Promise<void> {
    console.log('🔐 Navigating directly to admin URL...');
    await this.page.goto('https://automationintesting.online/admin/');
    await this.page.waitForLoadState('networkidle');
    console.log('✅ Successfully navigated directly to admin page');
  }

  /**
   * Fill the login form with provided credentials
   */
  async fillLoginForm(username: string, password: string): Promise<void> {
    console.log(`📝 Filling login form with username: ${username}`);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  /**
   * Fill only the username field
   */
  async fillUsernameOnly(username: string): Promise<void> {
    console.log(`📝 Filling username field: ${username}`);
    await this.usernameInput.fill(username);
  }

  /**
   * Fill only the password field
   */
  async fillPasswordOnly(password: string): Promise<void> {
    console.log(`📝 Filling password field: ${password}`);
    await this.passwordInput.fill(password);
  }

  /**
   * Submit the login form
   */
  async submitLogin(): Promise<void> {
    console.log('📤 Submitting login form...');
    await this.loginButton.click();
  }

  /**
   * Submit empty login form
   */
  async submitEmptyForm(): Promise<void> {
    console.log('📤 Submitting empty login form...');
    await this.loginButton.click();
  }

  /**
   * Verify login form elements are visible
   */
  async verifyLoginFormElements(): Promise<void> {
    console.log('🔍 Verifying login form elements...');
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    console.log('✅ Login form elements are visible');
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessage(): Promise<void> {
    console.log('⚠️ Verifying error message...');
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText('Invalid credentials');
    console.log('✅ Error message is displayed correctly');
  }
  /**
   * Verify we're on login page (not dashboard)
   */
  async verifyOnLoginPage(): Promise<void> {
    console.log('🔍 Verifying we are on login page...');
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    
    // Verify no dashboard elements are visible
    await expect(this.page.locator('text=Room Management')).not.toBeVisible();
    await expect(this.page.locator('text=Create Room')).not.toBeVisible();
    console.log('✅ Confirmed we are on login page, not dashboard');
  }

  /**
   * Verify logout button is not visible when not logged in
   */
  async verifyLogoutButtonNotVisible(): Promise<void> {
    console.log('🔒 Verifying logout button is not visible...');
    await expect(this.logoutButton).not.toBeVisible();
    console.log('✅ Logout button is correctly hidden when not logged in');
  }

  /**
   * Verify form accessibility features
   */
  async verifyFormAccessibility(): Promise<void> {
    console.log('♿ Verifying form accessibility...');
    
    // Verify form has proper IDs
    await expect(this.usernameInput).toHaveAttribute('id', 'username');
    await expect(this.passwordInput).toHaveAttribute('id', 'password');
    
    // Verify password field has proper type
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
    
    // Verify submit button is accessible
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();
    
    console.log('✅ Form accessibility features verified');
  }

  /**
   * Verify admin panel link accessibility
   */
  async verifyAdminLinkAccessibility(): Promise<void> {
    console.log('🔗 Verifying admin link accessibility...');
    
    // Verify link is visible and clickable
    await expect(this.adminPanelLink).toBeVisible();
    await expect(this.adminPanelLink).toBeEnabled();
    
    // Verify link has proper href
    await expect(this.adminPanelLink).toHaveAttribute('href', '/admin');
    
    console.log('✅ Admin link accessibility verified');
  }

  /**
   * Verify error message accessibility
   */
  async verifyErrorMessageAccessibility(): Promise<void> {
    console.log('♿ Verifying error message accessibility...');
    
    // Verify error message is visible and has proper styling
    await expect(this.errorMessage).toBeVisible();
    
    // Verify error message has proper text content
    await expect(this.errorMessage).toContainText('Invalid credentials');
    
    // Verify error message has proper ARIA role or is semantically correct
    await expect(this.errorMessage).toHaveClass(/alert/);
    
    console.log('✅ Error message accessibility verified');
  }

  /**
   * Complete login attempt with provided credentials
   */
  async attemptLogin(username: string, password: string): Promise<void> {
    console.log(`🔐 Attempting login with username: ${username}`);
    await this.fillLoginForm(username, password);
    await this.submitLogin();
  }

  /**
   * Complete login attempt with empty form
   */
  async attemptEmptyLogin(): Promise<void> {
    console.log('🔐 Attempting login with empty form');
    await this.submitEmptyForm();
  }

  /**
   * Complete login attempt with only username
   */
  async attemptUsernameOnlyLogin(username: string): Promise<void> {
    console.log(`🔐 Attempting login with username only: ${username}`);
    await this.fillUsernameOnly(username);
    await this.submitLogin();
  }

  /**
   * Complete login attempt with only password
   */
  async attemptPasswordOnlyLogin(password: string): Promise<void> {
    console.log(`🔐 Attempting login with password only: ${password}`);
    await this.fillPasswordOnly(password);
    await this.submitLogin();
  }

  /**
   * Get current form values
   */
  async getFormValues(): Promise<{ username: string; password: string }> {
    const username = await this.usernameInput.inputValue();
    const password = await this.passwordInput.inputValue();
    return { username, password };
  }

  /**
   * Check if error message is visible
   */
  async hasErrorMessage(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Get error message text
   */
  async getErrorMessageText(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Navigate to admin page (alias for navigateToAdmin)
   */
  async navigateToAdminPage(): Promise<void> {
    return this.navigateToAdmin();
  }

  /**
   * Check if logout button is visible
   */
  async isLogoutButtonVisible(): Promise<boolean> {
    return await this.logoutButton.isVisible();
  }

  /**
   * Check if admin menu is visible
   */
  async isAdminMenuVisible(): Promise<boolean> {
    const adminMenuItems = this.page.locator('text=Room Management, text=Create Room, text=Logout');
    return await adminMenuItems.count() > 0;
  }

  /**
   * Login with credentials
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillLoginForm(username, password);
    await this.submitLogin();
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    const dashboardElements = this.page.locator('text=Room Management, text=Create Room');
    return await dashboardElements.count() > 0;
  }

  /**
   * Logout from admin panel
   */
  async logout(): Promise<void> {
    if (await this.logoutButton.isVisible()) {
      await this.logoutButton.click();
    }
  }

  /**
   * Check if validation error is present
   */
  async hasValidationError(): Promise<boolean> {
    return await this.hasErrorMessage();
  }
} 