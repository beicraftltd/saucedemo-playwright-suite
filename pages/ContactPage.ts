import { Page, Locator, expect } from '@playwright/test';

/**
 * ContactPage Class
 * 
 * This class encapsulates all contact form functionality for the automation testing website.
 * It provides methods to interact with the contact form and verify its behavior.
 * 
 * Contact Form Flow:
 * 1. Navigate to contact section
 * 2. Fill contact form
 * 3. Submit form
 * 4. Handle validation errors
 * 5. Verify success message
 */
export class ContactPage {
  readonly page: Page;
  readonly contactLink: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly subjectInput: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;
  readonly successHeading: Locator;
  readonly successMessage: Locator;
  readonly subjectConfirmation: Locator;
  readonly closingMessage: Locator;
  readonly emailValidationError: Locator;
  readonly validationErrorContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize contact page locators
    this.contactLink = page.locator('#navbarNav').getByRole('link', { name: 'Contact' });
    
    // Form input locators using test IDs
    this.nameInput = page.getByTestId('ContactName');
    this.emailInput = page.getByTestId('ContactEmail');
    this.phoneInput = page.getByTestId('ContactPhone');
    this.subjectInput = page.getByTestId('ContactSubject');
    this.descriptionInput = page.getByTestId('ContactDescription');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    
    // Success message locators - made more flexible
    this.successHeading = page.getByRole('heading', { name: /Thanks for getting in touch/ });
    this.successMessage = page.getByText(/We'll get back to you about/);
    this.subjectConfirmation = page.getByText(/John Tester/);
    this.closingMessage = page.getByText(/as soon as possible/);
    
    // Validation error locators
    this.emailValidationError = page.getByText('must be a well-formed email');
    this.validationErrorContainer = page.locator('.alert.alert-danger');
  }

  /**
   * Navigate to the contact section
   * Step: Clicks on the Contact link in the navigation menu
   */
  async navigateToContact() {
    console.log('📞 Navigating to contact section...');
    await this.contactLink.click();
  }

  /**
   * Fill the contact form with provided details
   * Step: Fills in all required form fields
   * @param name - Contact person's name
   * @param email - Contact person's email
   * @param phone - Contact person's phone number
   * @param subject - Subject of the message
   * @param description - Message description
   */
  async fillContactForm(
    name: string,
    email: string,
    phone: string,
    subject: string,
    description: string
  ) {
    console.log('📝 Filling contact form...');
    
    await this.nameInput.click();
    await this.nameInput.fill(name);
    
    await this.emailInput.click();
    await this.emailInput.fill(email);
    
    await this.phoneInput.click();
    await this.phoneInput.fill(phone);
    
    await this.subjectInput.click();
    await this.subjectInput.fill(subject);
    
    await this.descriptionInput.click();
    await this.descriptionInput.fill(description);
  }

  /**
   * Submit the contact form
   * Step: Clicks the Submit button
   */
  async submitContactForm() {
    console.log('📤 Submitting contact form...');
    await this.submitButton.click();
  }

  /**
   * Update email and resubmit form
   * Step: Updates email field and submits form again
   * @param newEmail - Updated email address
   */
  async updateEmailAndResubmit(newEmail: string) {
    console.log('📧 Updating email and resubmitting...');
    await this.emailInput.click();
    await this.emailInput.fill(newEmail);
    await this.submitButton.click();
  }

  /**
   * Update name and resubmit form
   * Step: Updates name field and submits form again
   * @param newName - Updated name
   */
  async updateNameAndResubmit(newName: string) {
    console.log('👤 Updating name and resubmitting...');
    await this.nameInput.click();
    await this.nameInput.fill(newName);
    await this.submitButton.click();
  }

  /**
   * Verify contact form success message
   * Step: Checks all elements of the success confirmation
   */
  async verifyContactSuccess() {
    console.log('✅ Verifying contact form success...');
    
    // Verify success heading
    await expect(this.successHeading).toBeVisible();
    
    // Verify success message
    await expect(this.successMessage).toBeVisible();
    
    // Verify closing message
    await expect(this.closingMessage).toBeVisible();
    
    console.log('🎉 Contact form success verified!');
  }

  /**
   * Verify contact form success message with specific subject
   * Step: Checks success confirmation including the specific subject
   * @param subject - The subject to verify in the success message
   */
  async verifyContactSuccessWithSubject(subject: string) {
    console.log(`✅ Verifying contact form success with subject: ${subject}...`);
    
    // Verify success heading
    await expect(this.successHeading).toBeVisible();
    
    // Verify success message
    await expect(this.successMessage).toBeVisible();
    
    // Verify subject confirmation with the specific subject
    await expect(this.page.getByText(subject)).toBeVisible();
    
    // Verify closing message
    await expect(this.closingMessage).toBeVisible();
    
    console.log('🎉 Contact form success with subject verified!');
  }

  /**
   * Verify email validation error
   * Step: Checks if email validation error is displayed
   */
  async verifyEmailValidationError() {
    console.log('⚠️ Verifying email validation error...');
    await expect(this.emailValidationError).toBeVisible();
    console.log('✅ Email validation error verified');
  }

  /**
   * Verify specific validation error messages
   * Step: Checks for specific validation error messages
   * @param expectedErrors - Array of expected error messages
   */
  async verifyValidationErrors(expectedErrors: string[]) {
    console.log('⚠️ Verifying validation errors...');
    
    // Wait for validation error container to be visible
    await expect(this.validationErrorContainer).toBeVisible();
    
    // Check each expected error message
    for (const errorMessage of expectedErrors) {
      await expect(this.page.getByText(errorMessage)).toBeVisible();
      console.log(`✅ Validation error verified: ${errorMessage}`);
    }
  }

  /**
   * Verify all blank field validation errors
   * Step: Checks for all "may not be blank" validation errors
   */
  async verifyBlankFieldErrors() {
    const blankFieldErrors = [
      'Message may not be blank',
      'Phone may not be blank',
      'Subject may not be blank',
      'Name may not be blank',
      'Email may not be blank'
    ];
    
    await this.verifyValidationErrors(blankFieldErrors);
  }

  /**
   * Verify field length validation errors
   * Step: Checks for field length validation errors
   */
  async verifyFieldLengthErrors() {
    const lengthErrors = [
      'Subject must be between 5 and 100 characters.',
      'Phone must be between 11 and 21 characters.',
      'Message must be between 20 and 2000 characters.'
    ];
    
    await this.verifyValidationErrors(lengthErrors);
  }

  /**
   * Get form field values
   * Step: Returns current values of all form fields
   */
  async getFormValues() {
    const values = {
      name: await this.nameInput.inputValue(),
      email: await this.emailInput.inputValue(),
      phone: await this.phoneInput.inputValue(),
      subject: await this.subjectInput.inputValue(),
      description: await this.descriptionInput.inputValue()
    };
    return values;
  }

  /**
   * Clear all form fields
   * Step: Clears all input fields in the contact form
   */
  async clearForm() {
    console.log('🧹 Clearing contact form...');
    await this.nameInput.clear();
    await this.emailInput.clear();
    await this.phoneInput.clear();
    await this.subjectInput.clear();
    await this.descriptionInput.clear();
  }

  /**
   * Complete contact form flow with validation handling
   * Step: Performs the entire contact form process from start to finish
   * @param name - Contact person's name
   * @param email - Contact person's email
   * @param phone - Contact person's phone number
   * @param subject - Subject of the message
   * @param description - Message description
   */
  async completeContactFlow(
    name: string = 'John',
    email: string = 'john.doe@email.fake',
    phone: string = '01254879653',
    subject: string = 'John Tester',
    description: string = 'This is a message from John Doe.'
  ) {
    console.log('🔄 Starting complete contact form flow...');
    
    // Navigate to contact section
    await this.navigateToContact();
    
    // Fill contact form
    await this.fillContactForm(name, email, phone, subject, description);
    
    // Submit form
    await this.submitContactForm();
    
    // Verify success with specific subject
    await this.verifyContactSuccessWithSubject(subject);
    
    console.log('✅ Complete contact form flow finished successfully!');
  }



  /**
   * Check if form has validation errors
   * Step: Verifies if there are any validation errors present
   */
  async hasValidationErrors() {
    const errorElements = await this.validationErrorContainer.count();
    return errorElements > 0;
  }

  /**
   * Get all validation error messages
   * Step: Returns all validation error messages on the form
   */
  async getValidationErrors() {
    console.log('🔍 Looking for validation errors...');
    
    // Wait a moment for validation errors to appear
    await this.page.waitForTimeout(1000);
    
    // Try multiple selectors to find validation errors
    let errors: string[] = [];
    
    // First try the alert container
    const alertErrors = await this.page.locator('.alert.alert-danger p').allTextContents();
    if (alertErrors.length > 0) {
      errors = alertErrors;
      console.log('Found errors in alert container:', errors);
    }
    
    // If no errors found, try other common selectors
    if (errors.length === 0) {
      const textDangerErrors = await this.page.locator('.text-danger').allTextContents();
      if (textDangerErrors.length > 0) {
        errors = textDangerErrors;
        console.log('Found errors in text-danger elements:', errors);
      }
    }
    
    // If still no errors, try any element with error-related text
    if (errors.length === 0) {
      const allErrors = await this.page.locator('*:has-text("may not be blank"), *:has-text("must be"), *:has-text("well-formed")').allTextContents();
      if (allErrors.length > 0) {
        errors = allErrors;
        console.log('Found errors with generic selector:', errors);
      }
    }
    
    // Log the page content for debugging if no errors found
    if (errors.length === 0) {
      console.log('No validation errors found. Checking page content...');
      const pageContent = await this.page.content();
      console.log('Page contains validation-related text:', pageContent.includes('blank') || pageContent.includes('must be'));
    }
    
    return errors;
  }

  /**
   * Submit empty form to trigger all validation errors
   * Step: Submits form without filling any fields to test validation
   */
  async submitEmptyForm() {
    console.log('📤 Submitting empty form to trigger validation errors...');
    await this.submitContactForm();
    
    // Wait for validation errors to appear
    await this.page.waitForTimeout(2000);
  }

  /**
   * Fill form with invalid data to trigger length validation errors
   * Step: Fills form with data that doesn't meet length requirements
   */
  async fillFormWithInvalidLengths() {
    console.log('📝 Filling form with invalid length data...');
    await this.fillContactForm(
      'A', // Too short name
      'test@email.fake',
      '123', // Too short phone
      'Hi', // Too short subject
      'Short' // Too short message
    );
  }
} 