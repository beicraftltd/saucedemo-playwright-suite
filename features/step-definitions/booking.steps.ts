import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { BookingPage } from '../../pages/BookingPage';
import { ICustomWorld } from '../support/world';

// Given Steps
Given('I am on the hotel booking website for booking tests', async function (this: CustomWorld) {
  console.log('🔄 Setting up booking test environment...');
  this.bookingPage = new BookingPage(this.page!);
  await this.page!.goto('https://automationintesting.online/');
  console.log('✅ Booking test environment ready');
});

// When Steps - Calendar Verification Test
When('I navigate to booking section', async function (this: CustomWorld) {
  console.log('📅 Step 1: Navigating to booking section...');
  await this.bookingPage!.navigateToBooking();
  console.log('✅ Navigated to booking section');
});

When('I select a room', async function (this: CustomWorld) {
  console.log('🏠 Step 2: Selecting room...');
  await this.bookingPage!.selectRoom();
  console.log('✅ Selected a room');
});

When('I select dates {string} to {string}', async function (this: CustomWorld, checkInDate: string, checkOutDate: string) {
  // take a screenshot of the calendar
  await this.page!.screenshot({ path: 'screenshots/calendar.png' });
  console.log(`📅 Step 3: Selecting dates ${checkInDate} to ${checkOutDate}...`);
  await this.bookingPage!.selectAndVerifyDates(checkInDate, checkOutDate);
  console.log(`✅ Selected dates ${checkInDate} to ${checkOutDate}`);
  // Store dates for later verification
  this.selectedCheckInDate = checkInDate;
  this.selectedCheckOutDate = checkOutDate;
});

When('I get all selected dates from calendar expecting {string} and {string}', async function (this: CustomWorld, checkInDate: string, checkOutDate: string) {
  console.log('📅 Step 5: Getting all selected dates from calendar...');
  const selectedDates = await this.bookingPage!.getSelectedDatesFromCalendar();
  console.log('Selected dates:', selectedDates);

  // Compare only the day part
  const checkInDay = checkInDate.split('/')[0];
  const checkOutDay = checkOutDate.split('/')[0];
  expect(selectedDates).toContain(checkInDay);
  expect(selectedDates).toContain(checkOutDay);
  console.log('✅ Selected dates retrieved from calendar');
});

When('I verify calendar selection before reservation for dates {string} to {string}', async function (this: CustomWorld, checkInDate: string, checkOutDate: string) {
  console.log('🔍 Step 6: Final verification before opening booking form...');
  await this.bookingPage!.verifyCalendarSelectionBeforeReservation(checkInDate, checkOutDate);
  console.log('✅ Calendar selection verified before reservation');
});

// When Steps - End-to-End Flow
When('I complete full booking flow with date verification', async function (this: CustomWorld) {
  console.log('📋 Step 1: Starting complete end-to-end booking flow...');
  await this.bookingPage!.completeFullBookingFlow(
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

// When Steps - Availability Search
When('I fill availability dates {string} to {string}', async function (this: CustomWorld, checkIn: string, checkOut: string) {
  console.log('📅 Step 2: Filling availability dates...');
  await this.bookingPage!.fillAvailabilityDates(checkIn, checkOut);
  console.log(`✅ Filled availability dates ${checkIn} to ${checkOut}`);
});

When('I click Check Availability', async function (this: CustomWorld) {
  console.log('🔍 Step 3: Clicking Check Availability...');
  await this.bookingPage!.clickCheckAvailability();
  console.log('✅ Clicked Check Availability');
});

When('I select room by price {string}', async function (this: CustomWorld, price: string) {
  console.log(`🏠 Step 4: Selecting room by price ${price}...`);
  await this.bookingPage!.selectRoomByPrice(price);
  console.log(`✅ Selected room by price ${price}`);
});

When('I verify I am on reservation page', async function (this: CustomWorld) {
  console.log('🔍 Step 5: Verifying we are on reservation page...');
  await this.bookingPage!.verifyOnReservationPage();
  console.log('✅ Verified on reservation page');
});

// When Steps - URL Calendar Verification
When('I perform availability search with dates {string} to {string}', async function (this: CustomWorld, checkIn: string, checkOut: string) {
  console.log('📅 Step 1: Performing availability search...');
  await this.bookingPage!.navigateToBooking();
  await this.bookingPage!.fillAvailabilityDates(checkIn, checkOut);
  await this.bookingPage!.clickCheckAvailability();
  await this.bookingPage!.selectRoomByPrice('£150');
  await this.bookingPage!.verifyOnReservationPage();
  console.log('✅ Performed availability search');
});

When('I perform availability search', async function (this: CustomWorld) {
  console.log('📅 Step 1: Performing availability search...');
  await this.bookingPage!.navigateToBooking();
  await this.bookingPage!.fillAvailabilityDates('24/07/2025', '27/07/2025');
  await this.bookingPage!.clickCheckAvailability();
  await this.bookingPage!.selectRoomByPrice('£150');
  await this.bookingPage!.verifyOnReservationPage();
  console.log('✅ Performed availability search');
});

When('I get dates from URL', async function (this: CustomWorld) {
  console.log('🔍 Step 2: Getting dates from URL...');
  const urlDates = await this.bookingPage!.getDateRangeFromURL();
  console.log('URL dates:', urlDates);
  this.urlDates = urlDates;
  console.log('✅ Retrieved dates from URL');
});

When('I verify calendar selection matches URL dates', async function (this: CustomWorld) {
  console.log('🔍 Step 3: Verifying calendar selection matches URL dates...');
  // Extract day from URL date (format: YYYY-MM-DD)
  const startDay = this.urlDates?.checkIn?.split('-')[2];
  const endDay = this.urlDates?.checkOut?.split('-')[2];

  if (!startDay || !endDay) {
    throw new Error('Start day or end day is undefined');
  }

  await this.bookingPage!.verifyCalendarSelectionForDateRange(startDay, endDay);
  console.log('✅ Calendar selection matches URL dates');
});

// When Steps - Different Room Types
When('I test different room types and dates', async function (this: CustomWorld) {
  console.log('📋 Step 1: Testing Suite room booking...');
  await this.bookingPage!.completeFullBookingFlow(
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

When('I select past dates for check-in and check-out', async function (this: ICustomWorld) {
  // Generate two past dates
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

  // Use your bookingPage or page object to select these dates
  await this.bookingPage!.fillAvailabilityDates(checkInDate, checkOutDate);
});

// Then Steps - Verification Results
Then('the calendar selection verification should pass', async function (this: CustomWorld) {
  console.log('✅ Calendar selection verification test passed');
});

Then('the complete end-to-end booking flow should pass', async function (this: CustomWorld) {
  console.log('✅ Complete end-to-end booking flow test passed');
});

Then('the availability search and room selection should pass', async function (this: CustomWorld) {
  console.log('✅ Availability search and room selection test passed');
});

Then('the calendar date verification should pass', async function (this: CustomWorld) {
  console.log('✅ Calendar date verification test passed');
});

Then('the different room types and dates test should pass', async function (this: CustomWorld) {
  console.log('✅ Different room types and dates test passed');
});

Then('booking should not be allowed', async function (this: ICustomWorld) {
  // Assert booking cannot proceed
  const canBook = await this.bookingPage!.canProceedWithBooking();
  expect(canBook).toBe(false);
});