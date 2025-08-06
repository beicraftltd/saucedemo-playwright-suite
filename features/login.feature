@authentication
Feature: User Authentication
  As a customer
  I want to log into the application
  So that I can access the shopping functionality

  Background:
    Given I am on the SauceDemo login page

  @smoke @critical
  Scenario: Successful login with valid credentials
    When I enter username "standard_user"
    And I enter password "secret_sauce"
    And I click the login button
    Then I should be redirected to the products page
    And I should see the shopping cart icon
    And I should see the hamburger menu

  @error-handling
  Scenario: Failed login with invalid credentials
    When I enter username "invalid_user"
    And I enter password "secret_sauce"
    And I click the login button
    Then I should see an error message "Epic sadface: Username and password do not match any user in this service"
    And I should remain on the login page

  @validation
  Scenario: Failed login with empty username
    When I leave username field empty
    And I enter password "secret_sauce"
    And I click the login button
    Then I should see an error message "Epic sadface: Username is required"
    And I should remain on the login page

  @validation
  Scenario: Failed login with empty password
    When I enter username "standard_user"
    And I leave password field empty
    And I click the login button
    Then I should see an error message "Epic sadface: Password is required"
    And I should remain on the login page

  @security
  Scenario: Locked out user cannot login
    When I enter username "locked_out_user"
    And I enter password "secret_sauce"
    And I click the login button
    Then I should see an error message "Epic sadface: Sorry, this user has been locked out."
    And I should remain on the login page 