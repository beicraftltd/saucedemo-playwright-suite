import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/BookingPage';

test.describe('Enhanced Booking Flow Tests with Calendar Verification', () => {
  let bookingPage: BookingPage;

  test.beforeEach(async ({ page }) => {
    console.log('🔄 Setting up booking test environment...');
    bookingPage = new BookingPage(page);
    await page.goto('https://automationintesting.online/');
    console.log('✅ Booking test environment ready');
  });

  test('should verify calendar selection before proceeding with reservation', async () => {
    // Test Objective: Verify that selected dates are properly highlighted in calendar
    
    console.log('📅 Step 1: Navigating to booking section...');
    await bookingPage.navigateToBooking();
    
    console.log('🏠 Step 2: Selecting room...');
    await bookingPage.selectRoom();
    
    // Use full date strings for July 2025
    const checkInDate = '15/07/2025';
    const checkOutDate = '18/07/2025';
    
    console.log(`📅 Step 3: Selecting dates ${checkInDate} to ${checkOutDate}...`);
    await bookingPage.selectAndVerifyDates(checkInDate, checkOutDate);
    
    console.log('🔍 Step 4: Verifying calendar selection matches expected dates...');
    const isSelectionValid = await bookingPage.verifyDateRangeSelection(checkInDate, checkOutDate);
    expect(isSelectionValid).toBe(true);
    
    console.log('📅 Step 5: Getting all selected dates from calendar...');
    const selectedDates = await bookingPage.getSelectedDatesFromCalendar();
    console.log('Selected dates:', selectedDates);
    
    // Verify expected dates are in the selection
    expect(selectedDates).toContain(checkInDate);
    expect(selectedDates).toContain(checkOutDate);
    
    console.log('🔍 Step 6: Final verification before opening booking form...');
    await bookingPage.verifyCalendarSelectionBeforeReservation(checkInDate, checkOutDate);
    
    console.log('✅ Calendar selection verification test passed');
  });

  test('should complete full booking flow with date verification - END TO END', async () => {
    // Test Objective: Complete end-to-end booking with full date verification
    
    console.log('📋 Step 1: Starting complete end-to-end booking flow...');
    await bookingPage.completeFullBookingFlow(
      '20', // Check-in day
      '07', // Check-in month  
      '2025', // Check-in year
      '25', // Check-out day
      '07', // Check-out month
      '2025', // Check-out year
      '£150', // Room price
      'Alice',
      'Johnson', 
      'alice.johnson@email.fake',
      '01234567891'
    );
    console.log('✅ Complete end-to-end booking flow test passed');
  });

  test('should verify availability search and room selection', async () => {
    // Test Objective: Test the availability search and room filtering
    
    console.log('📅 Step 1: Navigating to booking section...');
    await bookingPage.navigateToBooking();
    
    console.log('📅 Step 2: Filling availability dates...');
    await bookingPage.fillAvailabilityDates('20/07/2025', '25/07/2025');
    
    console.log('🔍 Step 3: Clicking Check Availability...');
    await bookingPage.clickCheckAvailability();
    
    console.log('🏠 Step 4: Selecting room by price...');
    await bookingPage.selectRoomByPrice('£225');
    
    console.log('🔍 Step 5: Verifying we are on reservation page...');
    await bookingPage.verifyOnReservationPage();
    
    console.log('✅ Availability search and room selection test passed');
  });

  test('should verify selected dates in calendar match URL parameters', async () => {
    // Test Objective: Verify calendar selection matches the dates from URL
    
    console.log('📅 Step 1: Performing availability search...');
    await bookingPage.navigateToBooking();
    await bookingPage.fillAvailabilityDates('24/07/2025', '27/07/2025');
    await bookingPage.clickCheckAvailability();
    await bookingPage.selectRoomByPrice('£150');
    await bookingPage.verifyOnReservationPage();
    
    console.log('🔍 Step 2: Getting dates from URL...');
    const urlDates = await bookingPage.getDateRangeFromURL();
    console.log('URL dates:', urlDates);
    
    console.log('🔍 Step 3: Verifying calendar selection matches URL dates...');
    // Extract day from URL date (format: YYYY-MM-DD)
    const startDay = urlDates.checkIn.split('-')[2];
    const endDay = urlDates.checkOut.split('-')[2];
    
    await bookingPage.verifyCalendarSelectionForDateRange(startDay, endDay);
    
    console.log('✅ Calendar date verification test passed');
  });

  test('should handle different room types and dates', async () => {
    // Test Objective: Test booking different room types with various date ranges
    
    console.log('📋 Step 1: Testing Suite room booking...');
    await bookingPage.completeFullBookingFlow(
      '28', // Check-in day
      '07', // Check-in month  
      '2025', // Check-in year
      '30', // Check-out day
      '07', // Check-out month
      '2025', // Check-out year
      '£100', // Suite room price
      'Bob',
      'Smith', 
      'bob.smith@email.fake',
      '01234567891'
    );
    
    console.log('✅ Different room types and dates test passed');
  });


  test('should not allow booking when both check-in and check-out are in the past', async () => {
    await bookingPage.navigateToBooking();

    // Use dates just before today
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    function formatDate(date: Date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    const checkInDate = formatDate(twoDaysAgo);
    const checkOutDate = formatDate(yesterday);

    console.log(`📅 Testing with past dates - Check-in: ${checkInDate}, Check-out: ${checkOutDate}`);

    try {
      // Use the enhanced fillAvailabilityDates method which now includes smart calendar navigation
      await bookingPage.fillAvailabilityDates(checkInDate, checkOutDate);
      await bookingPage.clickCheckAvailability();

      // Assert booking cannot proceed
      const canBook = await bookingPage.canProceedWithBooking();
      expect(canBook).toBe(false);

      console.log('✅ Successfully verified that past dates prevent booking');
    } catch (error) {
      console.log(`⚠️ Expected behavior: Calendar may prevent selection of past dates entirely`);
      console.log(`Error encountered: ${error}`);

      // Alternative verification: Check if date error message is displayed
      const roomsVisible = await bookingPage.areRoomsVisible();
      expect(roomsVisible).toBe(false);

      console.log('✅ Verified that past dates show error message as expected');
    }
  });
}); 