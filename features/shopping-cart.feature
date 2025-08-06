@shopping-cart
Feature: Shopping Cart Management
  As a logged-in customer
  I want to manage items in my shopping cart
  So that I can control what I purchase

  Background:
    Given I am logged in as "standard_user"
    And I am on the products page

  @smoke @critical
  Scenario: Add item to cart successfully
    When I click "Add to cart" for "Sauce Labs Backpack"
    Then the button text should change to "Remove"
    And the shopping cart badge should show "1"

  @user-experience
  Scenario: View cart contents correctly
    Given I have added "Sauce Labs Backpack" to my cart
    When I click on the shopping cart icon
    Then I should be on the cart page
    And I should see "Sauce Labs Backpack" in the cart
    And I should see the price "$29.99"
    And I should see a "Remove" button for the item
    And I should see a "Continue Shopping" button
    And I should see a "Checkout" button

  @workflow
  Scenario: Continue shopping from cart
    Given I have added "Sauce Labs Backpack" to my cart
    When I click on the shopping cart icon
    And I click "Continue Shopping"
    Then I should be redirected to the products page
    And my cart contents should be preserved

  @data-integrity
  Scenario: Add multiple items to cart
    When I add "Sauce Labs Backpack" to my cart
    And I add "Sauce Labs Bike Light" to my cart
    Then the shopping cart badge should show "2"
    When I navigate to the cart page
    Then both items should be listed correctly 