# contact.feature

@contact @smoke
Feature: Contact Form Tests
  As a customer
  I want to use the contact form functionality
  So that I can communicate with the hotel

  Background:
    Given I am on the hotel booking website for contact tests

  @navigation
  Scenario: Navigate to contact section successfully
    When I navigate to contact section
    Then I should be on the contact page

  @form-filling
  Scenario: Fill contact form with valid data
    When I navigate to contact section
    And I fill contact form with valid data
    And I get form values
    Then form should contain the entered data

  @email-validation
  Scenario: Handle email validation errors
    When I navigate to contact section
    And I fill form with invalid email
    And I submit contact form
    And I verify email validation error
    Then email validation error should be shown

  @blank-field-validation
  Scenario: Handle blank field validation errors
    When I navigate to contact section
    And I submit empty form
    And I verify blank field errors
    Then blank field validation errors should be shown

  @field-length-validation
  Scenario: Handle field length validation errors
    When I navigate to contact section
    And I fill form with invalid lengths
    And I submit contact form
    And I verify field length errors
    Then field length validation errors should be shown

  @success-elements
  Scenario: Verify contact form success elements
    When I complete contact flow
    And I verify contact success
    Then all success elements should be verified

  @email-update
  Scenario: Handle email update and resubmission
    When I navigate to contact section
    And I fill form with invalid email for update test
    And I submit contact form
    And I update email and resubmit
    And I verify contact success
    Then email update and resubmission should work

  @different-scenarios
  Scenario: Handle different contact scenarios
    When I complete contact flow with different data
    Then different contact scenarios should work

  @validation-messages
  Scenario: Verify all validation error messages
    When I navigate to contact section
    And I submit empty form
    And I get validation errors
    And I check for validation debug information
    And I verify specific validation error messages
    Then all validation error messages should be verified