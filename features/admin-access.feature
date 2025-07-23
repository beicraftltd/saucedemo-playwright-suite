# admin-access.feature

@admin @security
Feature: Admin Access Verification
  As a system administrator
  I want to verify admin access security controls
  So that unauthorized users cannot access admin functions

  Background:
    Given I am on the hotel booking website

  @navigation-login-form
  Scenario: Navigate to admin section and show login form
    When I navigate to admin section
    Then I should see the login form elements
    And all form fields should be visible and accessible

  @empty-login-validation
  Scenario: Show validation error for empty login form
    And I navigate to admin section
    When I submit the login form with empty fields
    Then I should see an error message for empty credentials
    And I should remain on the login page

  @invalid-credentials-validation
  Scenario: Show validation error for invalid credentials
    And I navigate to admin section
    When I attempt login with invalid credentials "invaliduser" and "invalidpass"
    Then I should see an error message for invalid credentials
    And I should remain on the login page

  @empty-username-validation
  Scenario: Show validation error for empty username
    And I navigate to admin section
    When I attempt login with empty username and password "somepassword"
    Then I should see an error message for missing username
    And I should remain on the login page

  @empty-password-validation
  Scenario: Show validation error for empty password
    And I navigate to admin section
    When I attempt login with username "someuser" and empty password
    Then I should see an error message for missing password
    And I should remain on the login page

  @direct-access-prevention
  Scenario: Prevent direct access to admin dashboard without login
    When I navigate directly to admin dashboard URL
    Then I should be redirected to login page or access denied
    And I should see the login form
    And I should not see dashboard elements

  @special-characters-handling
  Scenario: Handle special characters in login form
    And I navigate to admin section
    When I attempt login with special characters "user@test.com" and "pass!@#$%^&*()"
    Then I should see an error message for invalid credentials
    And the form should handle special characters properly

  @login-form-accessibility
  Scenario: Verify login form accessibility
    And I navigate to admin section
    When I check the login form accessibility
    Then all form elements should have proper IDs and attributes
    And password field should have proper type
    And submit button should be accessible

  @admin-link-accessibility
  Scenario: Verify admin section link is properly labeled
    Given I am on the home page
    When I check the admin panel link accessibility
    Then the admin link should be visible and clickable
    And the admin link should have proper href attribute

  @error-message-accessibility
  Scenario: Verify error message accessibility
    And I navigate to admin section
    When I submit the login form with empty fields
    Then the error message should be accessible
    And the error message should have proper styling and content

  @logout-button-security
  Scenario: Do not display logout button when user is not logged in
    Given I am on the home page
    Then the logout button should not be visible
    When I navigate to admin login page
    Then the logout button should still not be visible

  @sql-injection-protection
  Scenario Outline: Verify login form is protected against SQL injection
    And I navigate to admin section
    When I attempt login with SQL injection payload "<payload>" and "<payload>"
    Then I should see a generic error message
    And I should not see SQL error messages or stack traces

    Examples:
      | payload                |
      | ' OR '1'='1           |
      | admin' --             |
      | admin' #              |
      | admin' OR 1=1--       |
      | admin' OR '1'='1' --  |
      | admin' OR 1=1#        |
      | admin' OR 1=1/*       |