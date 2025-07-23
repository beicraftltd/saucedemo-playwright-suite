# performance.feature

@performance @regression
Feature: Performance Testing
  As a user
  I want the website to perform efficiently
  So that I can have optimal user experience with fast load times

  Background:
    Given I am testing website performance with monitoring tools

  @home-page-performance
  Scenario: Load home page within performance thresholds
    When I load home page and measure performance
    Then home page should load within performance thresholds

  @core-web-vitals
  Scenario: Meet Core Web Vitals thresholds on home page
    When I measure Core Web Vitals on home page
    Then Core Web Vitals should meet thresholds

  @admin-login-performance
  Scenario: Load admin login page efficiently
    When I load admin login page and measure performance
    Then admin login page should load efficiently

  @resource-loading-performance
  Scenario: Load resources efficiently
    When I analyze resource loading performance
    Then resources should load efficiently

  @navigation-interaction-performance
  Scenario: Respond quickly to user interactions
    When I test navigation interaction performance
    Then navigation should respond quickly

  @form-interaction-performance
  Scenario: Handle form interactions efficiently
    When I test form interaction performance
    Then form interactions should be efficient

  @room-creation-performance
  Scenario: Perform room creation operations quickly
    When I test room creation performance
    Then room creation should be quick

  @memory-usage-monitoring
  Scenario: Maintain reasonable memory usage
    When I monitor memory usage
    Then memory usage should be reasonable

  @cross-browser-performance
  Scenario: Perform consistently across browsers
    When I test performance across browsers
    Then performance should be consistent across browsers

  @mobile-performance
  Scenario: Perform well on mobile devices
    When I test mobile performance
    Then mobile performance should be acceptable

  @performance-regression-testing
  Scenario: Detect performance regressions
    When I check for performance regressions
    Then no significant performance regression should be detected