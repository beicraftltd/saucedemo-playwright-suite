@api @regression
Feature: API Testing Suite
  As a system integrator
  I want to verify API endpoints functionality
  So that I can ensure proper data exchange and system integration

  Background:
    Given I have access to the hotel booking API

  @room-management
  Scenario: Fetch available rooms successfully
    When I request all available rooms
    Then the response status should be 200
    And the response should contain rooms data
    And each room should have required properties

  @room-details
  Scenario: Get specific room details
    When I request details for room "1"
    Then the response status should be 200
    And the room details should be returned
    And the room should have valid pricing information

  @booking-creation
  Scenario: Create a new booking successfully
    When I create a booking with valid data
    Then the response status should be 200
    And a booking object should be returned
    And the booking should have a unique ID

  @booking-validation
  Scenario: Reject booking with invalid room ID
    When I attempt to book a non-existent room
    Then the response status should be 400 or 404
    And an appropriate error message should be returned

  @date-validation
  Scenario: Validate booking date requirements
    When I attempt to book with invalid dates
    Then the response status should be 400
    And date validation errors should be returned

  @message-api
  Scenario: Submit contact message via API
    When I submit a contact message
    Then the response status should be 200
    And a success response should be returned

  @authentication
  Scenario: Verify admin authentication
    When I attempt to authenticate with valid credentials
    Then the response status should be 200
    And an authentication token should be returned

  @security
  Scenario: Verify API security measures
    When I attempt unauthorized access to admin endpoints
    Then the response status should be 401 or 403
    And access should be denied

  @performance
  Scenario: Verify API response times
    When I make multiple API requests
    Then all responses should be received within acceptable time limits
    And the API should handle concurrent requests properly 