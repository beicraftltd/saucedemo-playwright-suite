# accessibility.feature

@accessibility @regression
Feature: Website Accessibility Compliance
  As a user with accessibility needs
  I want the website to be accessible
  So that I can use all features regardless of my abilities

  @home-page-accessibility
  Scenario: Verify home page WCAG 2.1 compliance
    Given I am on the home page
    When I run accessibility checks for WCAG 2.1 standards
    Then there should be no accessibility violations on home page

  @home-page-critical
  Scenario: Check for critical accessibility violations on home page
    Given I am on the home page
    When I check for critical accessibility issues
    Then there should be no critical accessibility violations on home page

  @navigation-accessibility
  Scenario: Verify navigation accessibility
    Given I am on the home page
    When I test navigation accessibility
    Then navigation elements should be accessible

  @form-accessibility-home
  Scenario: Verify form accessibility on home page
    Given I am on the home page
    When I test form accessibility on home page
    Then form elements should be accessible on home page

  @login-page-accessibility
  Scenario: Verify login page accessibility
    Given I am on the login page
    When I run accessibility checks for WCAG 2.1 standards
    Then there should be no accessibility violations on login page

  @login-form-accessibility
  Scenario: Verify login form accessibility
    Given I am on the login page
    When I run accessibility checks on the login form
    Then the login form should be accessible

  @form-labels-associations
  Scenario: Verify form labels and associations
    Given I am on the login page
    When I test form labels and associations
    Then form labels should be properly associated


  @interactive-elements
  Scenario: Verify buttons and interactive elements accessibility
    Given I am logged in as an admin user
    When I test buttons and interactive elements
    Then buttons and interactive elements should be accessible






  @cross-page-consistency
  Scenario: Verify accessibility consistency across pages
    Given I am on the home page
    When I test accessibility consistency across pages
    Then accessibility should be consistent across all pages

  @color-contrast-consistency
  Scenario: Verify color contrast consistency
    Given I am on the home page
    When I test color contrast consistency
    Then color contrast should be consistent across pages

  @keyboard-navigation-home
  Scenario: Verify keyboard navigation on home page
    Given I am on the home page
    When I test keyboard navigation on home page
    Then keyboard navigation should work on home page

  @keyboard-navigation-admin
  Scenario: Verify keyboard navigation on admin pages
    Given I am on the login page
    When I test keyboard navigation on admin pages
    Then keyboard navigation should work on admin pages

  @aria-labels-roles
  Scenario: Verify ARIA labels and roles
    Given I am on the home page
    When I test ARIA labels and roles
    Then ARIA labels and roles should be proper

  @heading-structure
  Scenario: Verify heading structure
    Given I am on the home page
    When I test heading structure
    Then heading structure should be proper

  @mobile-accessibility
  Scenario: Verify accessibility on mobile viewport
    Given I am on the home page
    When I test accessibility on mobile viewport
    Then the interface should be accessible on mobile viewport