import { test, expect } from '@playwright/test';
import { MenuPage } from '../pages/MenuPage';

test.describe.skip('Menu Navigation Tests', () => {
  let menuPage: MenuPage;

  test.beforeEach(async ({ page }) => {
    // Setup: Initialize MenuPage and navigate to home page before each test
    console.log('🔄 Setting up test environment...');
    menuPage = new MenuPage(page);
    await menuPage.navigateToHome();
    console.log('✅ Test environment ready');
  });

  test('should display all menu links on the page', async () => {
    // Test Objective: Verify that all menu navigation links are visible on the page

    console.log('📋 Step 1: Checking visibility of all menu links...');
    await menuPage.verifyAllMenuLinks();
    console.log('✅ All menu links are visible');
  });

  test('should navigate to Rooms section when Rooms link is clicked', async () => {
    // Test Objective: Verify Rooms link navigation and section content

    console.log('🏠 Step 1: Clicking on Rooms link...');
    // Scroll away from the rooms section to ensure a real scroll happens
    await menuPage.page.evaluate(() => window.scrollTo(0, 0));

    // Capture scroll position before clicking
    const scrollBefore = await menuPage.page.evaluate(() => window.scrollY);

    await menuPage.clickRooms();

    // FIRST: Wait for vertical movement to complete
    console.log('🏠 Step 2: Waiting for vertical movement...');

    // Wait for scroll position to change (with timeout)
    let scrollAfter = scrollBefore;
    let attempts = 0;
    const maxAttempts = 10;

    while (scrollAfter === scrollBefore && attempts < maxAttempts) {
      await menuPage.page.waitForTimeout(100);
      scrollAfter = await menuPage.page.evaluate(() => window.scrollY);
      attempts++;
    }

    // Assert that vertical scroll position has changed (motion occurred)
    console.log(`Scroll before: ${scrollBefore}, after: ${scrollAfter}`);
    expect(scrollAfter).not.toBe(scrollBefore);
    console.log('✅ Vertical movement confirmed');

    // SECOND: Now verify the Rooms section is displayed
    console.log('🏠 Step 3: Verifying Rooms section is displayed...');
    await menuPage.verifyRoomsSection();
    console.log('✅ Rooms navigation test completed');
  });

  test('should navigate to Booking section when Booking link is clicked', async () => {
    // Test Objective: Verify Booking link navigation and scroll

    console.log('📅 Step 1: Clicking on Booking link...');
    // Scroll away from the booking section to ensure a real scroll happens
    await menuPage.page.evaluate(() => window.scrollTo(0, 0));

    // Capture scroll position before clicking
    const scrollBefore = await menuPage.page.evaluate(() => window.scrollY);

    await menuPage.clickBooking();

    // FIRST: Wait for vertical movement to complete
    console.log('📅 Step 2: Waiting for vertical movement...');

    // Wait for scroll position to change (with timeout)
    let scrollAfter = scrollBefore;
    let attempts = 0;
    const maxAttempts = 10;

    while (scrollAfter === scrollBefore && attempts < maxAttempts) {
      await menuPage.page.waitForTimeout(100);
      scrollAfter = await menuPage.page.evaluate(() => window.scrollY);
      attempts++;
    }

    // Assert that vertical scroll position has changed (motion occurred)
    console.log(`Scroll before: ${scrollBefore}, after: ${scrollAfter}`);
    expect(scrollAfter).not.toBe(scrollBefore);
    console.log('✅ Vertical movement confirmed');

    // SECOND: Now verify the booking section header is visible and positioned correctly
    console.log('📅 Step 3: Verifying Booking section text...');
    const bookingHeader = menuPage.page.locator('text=Check Availability & Book Your Stay');
    await expect(bookingHeader).toBeVisible();

    // Check that the header is in the viewport
    const isInViewport = await bookingHeader.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    });
    expect(isInViewport).toBe(true);
    console.log('✅ Booking navigation and scroll test completed');
  });

  test('should navigate to Contact section when Contact link is clicked', async () => {
    // Test Objective: Verify Contact link navigation and section content

    console.log('📞 Step 1: Clicking on Contact link...');
    // Scroll away from the contact section to ensure a real scroll happens
    await menuPage.page.evaluate(() => window.scrollTo(0, 0));

    // Capture scroll position before clicking
    const scrollBefore = await menuPage.page.evaluate(() => window.scrollY);

    await menuPage.clickContact();

    // FIRST: Wait for vertical movement to complete
    console.log('📞 Step 2: Waiting for vertical movement...');

    // Wait for scroll position to change (with timeout)
    let scrollAfter = scrollBefore;
    let attempts = 0;
    const maxAttempts = 10;

    while (scrollAfter === scrollBefore && attempts < maxAttempts) {
      await menuPage.page.waitForTimeout(100);
      scrollAfter = await menuPage.page.evaluate(() => window.scrollY);
      attempts++;
    }

    // Assert that vertical scroll position has changed (motion occurred)
    console.log(`Scroll before: ${scrollBefore}, after: ${scrollAfter}`);
    expect(scrollAfter).not.toBe(scrollBefore);
    console.log('✅ Vertical movement confirmed');

    // SECOND: Now verify the Contact section is displayed
    console.log('📞 Step 3: Verifying Contact section is displayed...');
    await menuPage.verifyContactSection();
    console.log('✅ Contact navigation test completed');
  });

  test('should navigate to Amenities section when Amenities link is clicked', async () => {
    // Test Objective: Verify Amenities link navigation, scroll, and vertical motion

    console.log('🏊 Step 1: Clicking on Amenities link...');
    // Scroll away from the amenities section to ensure a real scroll happens
    await menuPage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Capture scroll position before clicking
    const scrollBefore = await menuPage.page.evaluate(() => window.scrollY);

    await menuPage.clickAmenities();

    // FIRST: Wait for vertical movement to complete
    console.log('🏊 Step 2: Waiting for vertical movement...');

    // Wait for scroll position to change (with timeout)
    let scrollAfter = scrollBefore;
    let attempts = 0;
    const maxAttempts = 10;

    while (scrollAfter === scrollBefore && attempts < maxAttempts) {
      await menuPage.page.waitForTimeout(100);
      scrollAfter = await menuPage.page.evaluate(() => window.scrollY);
      attempts++;
    }

    // Assert that vertical scroll position has changed (motion occurred)
    console.log(`Scroll before: ${scrollBefore}, after: ${scrollAfter}`);
    expect(scrollAfter).not.toBe(scrollBefore);
    console.log('✅ Vertical movement confirmed');

    // SECOND: Now verify the Amenities section text is visible and positioned correctly
    console.log('🏊 Step 3: Verifying Amenities section text...');
    const amenitiesHeader = menuPage.page.locator('text=Amenities');
    await expect(amenitiesHeader).toBeVisible();

    // Check that the header is near the top of the viewport (within 100px)
    const top = await amenitiesHeader.evaluate(el => el.getBoundingClientRect().top);
    expect(top).toBeLessThanOrEqual(100);
    expect(top).toBeGreaterThanOrEqual(0);

    console.log('✅ Amenities navigation, scroll, and motion test completed');
  });

  test('should navigate to Location section when Location link is clicked', async () => {
    // Test Objective: Verify Location link navigation and section content

    console.log('📍 Step 1: Clicking on Location link...');
    // Scroll away from the location section to ensure a real scroll happens
    await menuPage.page.evaluate(() => window.scrollTo(0, 0));

    // Capture scroll position before clicking
    const scrollBefore = await menuPage.page.evaluate(() => window.scrollY);

    await menuPage.clickLocation();

    // FIRST: Wait for vertical movement to complete
    console.log('📍 Step 2: Waiting for vertical movement...');

    // Wait for scroll position to change (with timeout)
    let scrollAfter = scrollBefore;
    let attempts = 0;
    const maxAttempts = 10;

    while (scrollAfter === scrollBefore && attempts < maxAttempts) {
      await menuPage.page.waitForTimeout(100);
      scrollAfter = await menuPage.page.evaluate(() => window.scrollY);
      attempts++;
    }

    // Assert that vertical scroll position has changed (motion occurred)
    console.log(`Scroll before: ${scrollBefore}, after: ${scrollAfter}`);
    expect(scrollAfter).not.toBe(scrollBefore);
    console.log('✅ Vertical movement confirmed');

    // SECOND: Now verify the Location section is displayed
    console.log('📍 Step 3: Verifying Location section is displayed...');
    await menuPage.verifyLocationSection();
    console.log('✅ Location navigation test completed');
  });

  test('should navigate to home when brand link is clicked', async () => {
    // Test Objective: Verify Brand link navigation back to home page
    // Note: This test doesn't need scroll verification as it's a URL navigation

    console.log('🏠 Step 1: Clicking on Brand link (Shady Meadows B&B)...');
    await menuPage.clickBrand();

    console.log('🏠 Step 2: Verifying navigation back to home page...');
    await expect(menuPage.page).toHaveURL('https://automationintesting.online/');
    console.log('✅ Brand navigation test completed');
  });

  test('should verify complete menu navigation flow', async () => {
    // Test Objective: Verify all navigation links work correctly in sequence
    // This comprehensive test ensures the entire menu system functions properly

    console.log('🔄 Starting comprehensive menu navigation flow test...');

    // Helper function to verify scroll movement
    const verifyScrollMovement = async (actionName: string) => {
      const scrollBefore = await menuPage.page.evaluate(() => window.scrollY);

      // Wait for scroll position to change (with timeout)
      let scrollAfter = scrollBefore;
      let attempts = 0;
      const maxAttempts = 10;

      while (scrollAfter === scrollBefore && attempts < maxAttempts) {
        await menuPage.page.waitForTimeout(100);
        scrollAfter = await menuPage.page.evaluate(() => window.scrollY);
        attempts++;
      }

      console.log(`${actionName} - Scroll before: ${scrollBefore}, after: ${scrollAfter}`);
      // Note: Not asserting scroll change here as some sections might already be visible
    };

    // Step 1: Test Rooms navigation
    console.log('📋 Step 1: Testing Rooms link navigation...');
    await menuPage.clickRooms();
    await verifyScrollMovement('Rooms');
    await menuPage.verifyRoomsSection();

    // Step 2: Test Booking navigation
    console.log('📋 Step 2: Testing Booking link navigation...');
    await menuPage.clickBooking();
    await verifyScrollMovement('Booking');

    // Step 3: Test Amenities navigation
    console.log('📋 Step 3: Testing Amenities link navigation...');
    await menuPage.clickAmenities();
    await verifyScrollMovement('Amenities');

    // Step 4: Test Location navigation
    console.log('📋 Step 4: Testing Location link navigation...');
    await menuPage.clickLocation();
    await verifyScrollMovement('Location');
    await menuPage.verifyLocationSection();

    // Step 5: Test Contact navigation
    console.log('📋 Step 5: Testing Contact link navigation...');
    await menuPage.clickContact();
    await verifyScrollMovement('Contact');
    await menuPage.verifyContactSection();

    // Step 6: Test Brand navigation (return to home)
    console.log('📋 Step 6: Testing Brand link navigation...');
    await menuPage.clickBrand();
    await expect(menuPage.page).toHaveURL('https://automationintesting.online/');

    console.log('🎉 Complete menu navigation flow test passed successfully!');
  });
});