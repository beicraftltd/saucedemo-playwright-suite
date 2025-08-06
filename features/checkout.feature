@checkout
Feature: Checkout Process
  As a customer with items in my cart
  I want to complete the checkout process
  So that I can purchase my selected items

  Background:
    Given I am logged in as "standard_user"
    And I have added "Sauce Labs Backpack" to my cart
    And I am on the cart page

  @smoke @end-to-end
  Scenario: Complete checkout process successfully
    When I click the "Checkout" button
    Then I should be on the checkout information page
    And I should see form fields for First Name, Last Name, and Postal Code
    When I enter "John" in the First Name field
    And I enter "Doe" in the Last Name field
    And I enter "SW1A 1AA" in the Postal Code field
    And I click the "Continue" button
    Then I should be on the checkout overview page
    And I should see my order summary
    When I click the "Finish" button
    Then I should see "Thank you for your order!"
    And my cart should be empty

  @validation
  Scenario: Checkout validation - missing first name
    When I click the "Checkout" button
    And I am on the checkout information page
    When I leave the First Name field empty
    And I enter "Doe" in the Last Name field
    And I enter "SW1A 1AA" in the Postal Code field
    And I click the "Continue" button
    Then I should see an error message "Error: First Name is required"
    And I should remain on the checkout information page

  @validation
  Scenario: Checkout validation - missing last name
    When I click the "Checkout" button
    And I am on the checkout information page
    When I enter "John" in the First Name field
    And I leave the Last Name field empty
    And I enter "SW1A 1AA" in the Postal Code field
    And I click the "Continue" button
    Then I should see an error message "Error: Last Name is required"
    And I should remain on the checkout information page

  @validation
  Scenario: Checkout validation - missing postal code
    When I click the "Checkout" button
    And I am on the checkout information page
    When I enter "John" in the First Name field
    And I enter "Doe" in the Last Name field
    And I leave the Postal Code field empty
    And I click the "Continue" button
    Then I should see an error message "Error: Postal Code is required"
    And I should remain on the checkout information page

  @workflow
  Scenario: Cancel checkout and preserve cart
    When I click the "Checkout" button
    Then I should be on the checkout information page
    When I click the "Cancel" button
    Then I should be redirected to the cart page
    And I should see "Sauce Labs Backpack" in the cart
    And the shopping cart badge should show "1"

  @summary
  Scenario: Display correct order summary
    When I click the "Checkout" button
    And I enter "John" in the First Name field
    And I enter "Doe" in the Last Name field
    And I enter "SW1A 1AA" in the Postal Code field
    And I click the "Continue" button
    Then I should be on the checkout overview page
    And I should see "Sauce Labs Backpack" in the order summary
    And I should see the item price "$29.99"
    And I should see secure payment information
    And I should see delivery information
    And all financial calculations should be accurate 