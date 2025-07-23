# navigation.feature

@navigation @smoke
Feature: Menu Navigation Tests
  As a user
  I want to navigate through the website menu
  So that I can access different sections with proper scrolling

  Background:
    Given I am on the hotel booking website for navigation tests

  @menu-links-display
  Scenario: Display all menu links on the page
    When I check visibility of all menu links
    Then all menu links should be visible

  @rooms-navigation
  Scenario: Navigate to Rooms section when Rooms link is clicked
    When I scroll away from rooms section
    And I capture scroll position before clicking rooms
    And I click on Rooms link
    And I wait for vertical movement to complete
    And I verify vertical scroll position has changed
    And I verify Rooms section is displayed
    Then the Rooms navigation test should be completed

  @booking-navigation
  Scenario: Navigate to Booking section when Booking link is clicked
    When I scroll away from booking section
    And I capture scroll position before clicking booking
    And I click on Booking link
    And I wait for vertical movement to complete
    And I verify vertical scroll position has changed
    And I verify Booking section text is visible
    And I check that booking header is in viewport
    Then the Booking navigation and scroll test should be completed

  @contact-navigation
  Scenario: Navigate to Contact section when Contact link is clicked
    When I scroll away from contact section
    And I capture scroll position before clicking contact
    And I click on Contact link
    And I wait for vertical movement to complete
    And I verify vertical scroll position has changed
    And I verify Contact section is displayed
    Then the Contact navigation test should be completed

  @amenities-navigation
  Scenario: Navigate to Amenities section when Amenities link is clicked
    When I scroll to bottom of page for amenities
    And I capture scroll position before clicking amenities
    And I click on Amenities link
    And I wait for vertical movement to complete
    And I verify vertical scroll position has changed
    And I verify Amenities section text is visible
    And I check amenities header position in viewport
    Then the Amenities navigation scroll and motion test should be completed

  @location-navigation
  Scenario: Navigate to Location section when Location link is clicked
    When I scroll away from location section
    And I capture scroll position before clicking location
    And I click on Location link
    And I wait for vertical movement to complete
    And I verify vertical scroll position has changed
    And I verify Location section is displayed
    Then the Location navigation test should be completed

  @brand-navigation
  Scenario: Navigate to home when brand link is clicked
    When I click on Brand link
    And I verify navigation back to home page
    Then the Brand navigation test should be completed

  @complete-menu-flow
  Scenario: Verify complete menu navigation flow
    When I start comprehensive menu navigation flow test
    And I test Rooms link navigation in flow
    And I test Booking link navigation in flow
    And I test Amenities link navigation in flow
    And I test Location link navigation in flow
    And I test Contact link navigation in flow
    And I test Brand link navigation in flow
    Then the complete menu navigation flow test should pass successfully