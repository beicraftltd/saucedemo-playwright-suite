@booking @smoke
Feature: Enhanced Booking Flow Tests with Calendar Verification
As a customer
I want to book a hotel room with calendar verification
So that I can ensure my dates are correctly selected

  Background:
    Given I am on the hotel booking website for booking tests

  @calendar-verification
  Scenario: Verify calendar selection before proceeding with reservation
    When I navigate to booking section
    And I fill availability dates "15/07/2025" to "18/07/2025"
    And I select a room
    And I get all selected dates from calendar expecting "15/07/2025" and "18/07/2025"
    Then the calendar selection verification should pass

@end-to-end @full-flow
  Scenario: Complete full booking flow with date verification - END TO END
    When I complete full booking flow with date verification
    Then the complete end-to-end booking flow should pass

  @availability-search
  Scenario: Verify availability search and room selection
    When I navigate to booking section
    And I fill availability dates "20/07/2025" to "25/07/2025"
    And I click Check Availability
    And I select room by price "£225"
    And I verify I am on reservation page
    Then the availability search and room selection should pass

  @url-calendar-verification
  Scenario: Verify selected dates in calendar match URL parameters
    When I perform availability search with dates "24/07/2025" to "27/07/2025"
    And I get dates from URL
    And I verify calendar selection matches URL dates
    Then the calendar date verification should pass

  @different-room-types
  Scenario: Handle different room types and dates
    When I test different room types and dates
    Then the different room types and dates test should pass

  @negative
  Scenario: Do not allow booking when both check-in and check-out are in the past
    When I am on the hotel booking website for booking tests
    And I navigate to booking section
    And I select past dates for check-in and check-out
    And I click Check Availability
    Then booking should not be allowed