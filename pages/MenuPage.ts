import { Page, Locator, expect } from '@playwright/test';

/**
 * MenuPage Class
 * 
 * This class encapsulates all menu navigation functionality for the automation testing website.
 * It provides methods to interact with all menu links and verify their behavior.
 * 
 * Menu Items:
 * - Rooms: Navigate to rooms section
 * - Booking: Navigate to booking section  
 * - Contact: Navigate to contact section
 * - Amenities: Navigate to amenities section
 * - Location: Navigate to location section
 * - Brand: Navigate back to home page
 */
export class MenuPage {
  readonly page: Page;
  readonly navbar: Locator;
  readonly roomsLink: Locator;
  readonly bookingLink: Locator;
  readonly contactLink: Locator;
  readonly amenitiesLink: Locator;
  readonly locationLink: Locator;
  readonly brandLink: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize all menu locators
    this.navbar = page.locator('#navbarNav');
    this.roomsLink = this.navbar.getByRole('link', { name: 'Rooms' });
    this.bookingLink = this.navbar.getByRole('link', { name: 'Booking' });
    this.contactLink = this.navbar.getByRole('link', { name: 'Contact' });
    this.amenitiesLink = page.getByRole('link', { name: 'Amenities' });
    this.locationLink = page.getByRole('link', { name: 'Location' });
    this.brandLink = page.getByRole('link', { name: 'Shady Meadows B&B' });
  }

  /**
   * Navigate to the home page
   * Step: Loads the main website URL
   */
  async navigateToHome() {
    await this.page.goto('https://automationintesting.online/');
  }

  /**
   * Click on Rooms link and verify navigation
   * Step: Clicks Rooms link and validates URL change
   */
  async clickRooms() {
    await this.roomsLink.click();
    await expect(this.page).toHaveURL('https://automationintesting.online/#rooms');
  }

  /**
   * Click on Booking link and verify navigation
   * Step: Clicks Booking link and validates URL change
   */
  async clickBooking() {
    await this.bookingLink.click();
    await expect(this.page).toHaveURL('https://automationintesting.online/#booking');
  }

  /**
   * Click on Contact link and verify navigation
   * Step: Clicks Contact link and validates URL change
   */
  async clickContact() {
    await this.contactLink.click();
    await expect(this.page).toHaveURL('https://automationintesting.online/#contact');
  }

  /**
   * Click on Amenities link and verify navigation
   * Step: Clicks Amenities link and validates URL change
   */
  async clickAmenities() {
    await this.amenitiesLink.click();
    await expect(this.page).toHaveURL('https://automationintesting.online/#amenities');
  }

  /**
   * Click on Location link and verify navigation
   * Step: Clicks Location link and validates URL change
   */
  async clickLocation() {
    await this.locationLink.click();
    await expect(this.page).toHaveURL('https://automationintesting.online/#location');
  }

  /**
   * Click on Brand link (Shady Meadows B&B)
   * Step: Clicks brand link to return to home page
   */
  async clickBrand() {
    await this.brandLink.click();
  }

  /**
   * Verify Rooms section is displayed
   * Step: Checks that the "Our Rooms" heading is visible
   */
  async verifyRoomsSection() {
    await expect(this.page.getByRole('heading', { name: 'Our Rooms' })).toBeVisible();
  }

  /**
   * Verify Location section is displayed
   * Step: Checks that the "Our Location" heading is visible
   */
  async verifyLocationSection() {
    await expect(this.page.getByRole('heading', { name: 'Our Location' })).toBeVisible();
  }

  /**
   * Verify Contact section is displayed
   * Step: Checks that the "Send Us a Message" heading is visible
   */
  async verifyContactSection() {
    await expect(this.page.getByRole('heading', { name: 'Send Us a Message' })).toBeVisible();
  }

  /**
   * Verify all menu links are visible on the page
   * Step: Validates that all navigation menu items are present and visible
   */
  async verifyAllMenuLinks() {
    // Verify all menu links are visible
    await expect(this.roomsLink).toBeVisible();
    await expect(this.bookingLink).toBeVisible();
    await expect(this.contactLink).toBeVisible();
    await expect(this.amenitiesLink).toBeVisible();
    await expect(this.locationLink).toBeVisible();
    await expect(this.brandLink).toBeVisible();
  }
} 