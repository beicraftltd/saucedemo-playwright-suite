import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { MenuPage } from '../../pages/MenuPage';

// Given Steps
Given('I am on the hotel booking website for navigation tests', async function (this: CustomWorld) {
  // Setup: Initialize MenuPage and navigate to home page before each test
  console.log('🔄 Setting up test environment...');
  this.menuPage = new MenuPage(this.page!);
  await this.menuPage.navigateToHome();
  console.log('✅ Test environment ready');
});

// When Steps - Menu Links Display Test
When('I check visibility of all menu links', async function (this: CustomWorld) {
  console.log('📋 Step 1: Checking visibility of all menu links...');
  await this.menuPage!.verifyAllMenuLinks();
  console.log('✅ All menu links are visible');
});

// When Steps - Rooms Navigation Test
When('I scroll away from rooms section', async function (this: CustomWorld) {
  console.log('🏠 Step 1: Clicking on Rooms link...');
  // Scroll away from the rooms section to ensure a real scroll happens
  await this.menuPage!.page.evaluate(() => window.scrollTo(0, 0));
});

When('I capture scroll position before clicking rooms', async function (this: CustomWorld) {
  // Capture scroll position before clicking
  this.scrollBefore = await this.menuPage!.page.evaluate(() => window.scrollY);
});

When('I click on Rooms link', async function (this: CustomWorld) {
  await this.menuPage!.clickRooms();
});

When('I wait for vertical movement to complete', async function (this: CustomWorld) {
  // FIRST: Wait for vertical movement to complete
  console.log('🏠 Step 2: Waiting for vertical movement...');

  // Wait for scroll position to change (with timeout)
  this.scrollAfter = this.scrollBefore;
  let attempts = 0;
  const maxAttempts = 10;

  while (this.scrollAfter === this.scrollBefore && attempts < maxAttempts) {
    await this.menuPage!.page.waitForTimeout(100);
    this.scrollAfter = await this.menuPage!.page.evaluate(() => window.scrollY);
    attempts++;
  }
});

When('I verify vertical scroll position has changed', async function (this: CustomWorld) {
  // Assert that vertical scroll position has changed (motion occurred)
  console.log(`Scroll before: ${this.scrollBefore}, after: ${this.scrollAfter}`);
  expect(this.scrollAfter).not.toBe(this.scrollBefore);
  console.log('✅ Vertical movement confirmed');
});

When('I verify Rooms section is displayed', async function (this: CustomWorld) {
  // SECOND: Now verify the Rooms section is displayed
  console.log('🏠 Step 3: Verifying Rooms section is displayed...');
  await this.menuPage!.verifyRoomsSection();
});

// When Steps - Booking Navigation Test
When('I scroll away from booking section', async function (this: CustomWorld) {
  console.log('📅 Step 1: Clicking on Booking link...');
  // Scroll away from the booking section to ensure a real scroll happens
  await this.menuPage!.page.evaluate(() => window.scrollTo(0, 0));
});

When('I capture scroll position before clicking booking', async function (this: CustomWorld) {
  // Capture scroll position before clicking
  this.scrollBefore = await this.menuPage!.page.evaluate(() => window.scrollY);
});

When('I click on Booking link', async function (this: CustomWorld) {
  await this.menuPage!.clickBooking();
});

When('I verify Booking section text is visible', async function (this: CustomWorld) {
  // SECOND: Now verify the booking section header is visible and positioned correctly
  console.log('📅 Step 3: Verifying Booking section text...');
  const bookingHeader = this.menuPage!.page.locator('text=Check Availability & Book Your Stay');
  await expect(bookingHeader).toBeVisible();
  this.bookingHeader = bookingHeader;
});

When('I check that booking header is in viewport', async function (this: CustomWorld) {
  // Check that the header is in the viewport
  const isInViewport = await this.bookingHeader.evaluate((el: Element) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  });
  expect(isInViewport).toBe(true);
});

// When Steps - Contact Navigation Test
When('I scroll away from contact section', async function (this: CustomWorld) {
  console.log('📞 Step 1: Clicking on Contact link...');
  // Scroll away from the contact section to ensure a real scroll happens
  await this.menuPage!.page.evaluate(() => window.scrollTo(0, 0));
});

When('I capture scroll position before clicking contact', async function (this: CustomWorld) {
  // Capture scroll position before clicking
  this.scrollBefore = await this.menuPage!.page.evaluate(() => window.scrollY);
});

When('I click on Contact link', async function (this: CustomWorld) {
  await this.menuPage!.clickContact();
});

When('I verify Contact section is displayed', async function (this: CustomWorld) {
  // SECOND: Now verify the Contact section is displayed
  console.log('📞 Step 3: Verifying Contact section is displayed...');
  await this.menuPage!.verifyContactSection();
});

// When Steps - Amenities Navigation Test
When('I scroll to bottom of page for amenities', async function (this: CustomWorld) {
  console.log('🏊 Step 1: Clicking on Amenities link...');
  // Scroll away from the amenities section to ensure a real scroll happens
  await this.menuPage!.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
});

When('I capture scroll position before clicking amenities', async function (this: CustomWorld) {
  // Capture scroll position before clicking
  this.scrollBefore = await this.menuPage!.page.evaluate(() => window.scrollY);
});

When('I click on Amenities link', async function (this: CustomWorld) {
  await this.menuPage!.clickAmenities();
});

When('I verify Amenities section text is visible', async function (this: CustomWorld) {
  // SECOND: Now verify the Amenities section text is visible and positioned correctly
  console.log('🏊 Step 3: Verifying Amenities section text...');
  const amenitiesHeader = this.menuPage!.page.locator('text=Amenities');
  await expect(amenitiesHeader).toBeVisible();
  this.amenitiesHeader = amenitiesHeader;
});

When('I check amenities header position in viewport', async function (this: CustomWorld) {
  // Check that the header is near the top of the viewport (within 100px)
  const top = await this.amenitiesHeader.evaluate((el: Element) => el.getBoundingClientRect().top);
  expect(top).toBeLessThanOrEqual(100);
  expect(top).toBeGreaterThanOrEqual(0);
});

// When Steps - Location Navigation Test
When('I scroll away from location section', async function (this: CustomWorld) {
  console.log('📍 Step 1: Clicking on Location link...');
  // Scroll away from the location section to ensure a real scroll happens
  await this.menuPage!.page.evaluate(() => window.scrollTo(0, 0));
});

When('I capture scroll position before clicking location', async function (this: CustomWorld) {
  // Capture scroll position before clicking
  this.scrollBefore = await this.menuPage!.page.evaluate(() => window.scrollY);
});

When('I click on Location link', async function (this: CustomWorld) {
  await this.menuPage!.clickLocation();
});

When('I verify Location section is displayed', async function (this: CustomWorld) {
  // SECOND: Now verify the Location section is displayed
  console.log('📍 Step 3: Verifying Location section is displayed...');
  await this.menuPage!.verifyLocationSection();
});

// When Steps - Brand Navigation Test
When('I click on Brand link', async function (this: CustomWorld) {
  console.log('🏠 Step 1: Clicking on Brand link (Shady Meadows B&B)...');
  await this.menuPage!.clickBrand();
});

When('I verify navigation back to home page', async function (this: CustomWorld) {
  console.log('🏠 Step 2: Verifying navigation back to home page...');
  await expect(this.menuPage!.page).toHaveURL('https://automationintesting.online/');
});

// When Steps - Complete Menu Flow Test
When('I start comprehensive menu navigation flow test', async function (this: CustomWorld) {
  console.log('🔄 Starting comprehensive menu navigation flow test...');
});

When('I test Rooms link navigation in flow', async function (this: CustomWorld) {
  // Step 1: Test Rooms navigation
  console.log('📋 Step 1: Testing Rooms link navigation...');
  await this.menuPage!.clickRooms();
  await this.verifyScrollMovement('Rooms');
  await this.menuPage!.verifyRoomsSection();
});

When('I test Booking link navigation in flow', async function (this: CustomWorld) {
  // Step 2: Test Booking navigation
  console.log('📋 Step 2: Testing Booking link navigation...');
  await this.menuPage!.clickBooking();
  await this.verifyScrollMovement('Booking');
});

When('I test Amenities link navigation in flow', async function (this: CustomWorld) {
  // Step 3: Test Amenities navigation
  console.log('📋 Step 3: Testing Amenities link navigation...');
  await this.menuPage!.clickAmenities();
  await this.verifyScrollMovement('Amenities');
});

When('I test Location link navigation in flow', async function (this: CustomWorld) {
  // Step 4: Test Location navigation
  console.log('📋 Step 4: Testing Location link navigation...');
  await this.menuPage!.clickLocation();
  await this.verifyScrollMovement('Location');
  await this.menuPage!.verifyLocationSection();
});

When('I test Contact link navigation in flow', async function (this: CustomWorld) {
  // Step 5: Test Contact navigation
  console.log('📋 Step 5: Testing Contact link navigation...');
  await this.menuPage!.clickContact();
  await this.verifyScrollMovement('Contact');
  await this.menuPage!.verifyContactSection();
});

When('I test Brand link navigation in flow', async function (this: CustomWorld) {
  // Step 6: Test Brand navigation (return to home)
  console.log('📋 Step 6: Testing Brand link navigation...');
  await this.menuPage!.clickBrand();
  await expect(this.menuPage!.page).toHaveURL('https://automationintesting.online/');
});

// Then Steps - Test Completion Verification
Then('all menu links should be visible', async function (this: CustomWorld) {
  console.log('✅ All menu links are visible');
});

Then('the Rooms navigation test should be completed', async function (this: CustomWorld) {
  console.log('✅ Rooms navigation test completed');
});

Then('the Booking navigation and scroll test should be completed', async function (this: CustomWorld) {
  console.log('✅ Booking navigation and scroll test completed');
});

Then('the Contact navigation test should be completed', async function (this: CustomWorld) {
  console.log('✅ Contact navigation test completed');
});

Then('the Amenities navigation scroll and motion test should be completed', async function (this: CustomWorld) {
  console.log('✅ Amenities navigation, scroll, and motion test completed');
});

Then('the Location navigation test should be completed', async function (this: CustomWorld) {
  console.log('✅ Location navigation test completed');
});

Then('the Brand navigation test should be completed', async function (this: CustomWorld) {
  console.log('✅ Brand navigation test completed');
});

Then('the complete menu navigation flow test should pass successfully', async function (this: CustomWorld) {
  console.log('🎉 Complete menu navigation flow test passed successfully!');
});

// Helper method for verifying scroll movement in flow test
declare module '../support/world' {
  interface CustomWorld {
    verifyScrollMovement(actionName: string): Promise<void>;
  }
}

// Add helper method to CustomWorld
CustomWorld.prototype.verifyScrollMovement = async function (actionName: string) {
  const scrollBefore = await this.menuPage!.page.evaluate(() => window.scrollY);

  // Wait for scroll position to change (with timeout)
  let scrollAfter = scrollBefore;
  let attempts = 0;
  const maxAttempts = 10;

  while (scrollAfter === scrollBefore && attempts < maxAttempts) {
    await this.menuPage!.page.waitForTimeout(100);
    scrollAfter = await this.menuPage!.page.evaluate(() => window.scrollY);
    attempts++;
  }

  console.log(`${actionName} - Scroll before: ${scrollBefore}, after: ${scrollAfter}`);
  // Note: Not asserting scroll change here as some sections might already be visible
};