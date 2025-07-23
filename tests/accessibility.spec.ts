import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y, getViolations, configureAxe } from 'axe-playwright';

/**
 * Accessibility Test Suite
 * 
 * This test suite uses axe-playwright to test accessibility compliance across:
 * - Home page
 * - Login page
 * - Admin room management page
 * - Room edit page
 * 
 * The tests check for WCAG 2.1 compliance and other accessibility standards.
 */

test.describe.skip('Accessibility Tests', () => {
  const baseUrl = 'https://automationintesting.online';

  test.beforeEach(async ({ page }) => {
    // Inject axe-core into the page for accessibility testing
    await page.goto(baseUrl);
    await injectAxe(page);
  });

  test.describe('Home Page Accessibility', () => {
    test('should have no accessibility violations on home page', async ({ page }) => {
      // Test Objective: Verify home page meets accessibility standards
      
      console.log('🏠 Testing home page accessibility...');
      
      // Navigate to home page
      await page.goto(baseUrl);
      await injectAxe(page);
      
      // Check accessibility for the entire page
      await checkA11y(page, undefined, {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa']
          }
        },
        detailedReport: true,
        verbose: true
      });
      
      console.log('✅ Home page accessibility test passed');
    });

    test('should have no critical accessibility violations on home page', async ({ page }) => {
      // Test Objective: Verify no critical accessibility issues on home page
      
      console.log('🚨 Testing home page for critical accessibility violations...');
      
      await page.goto(baseUrl);
      await injectAxe(page);
      
      // Check only for critical and serious violations
      await checkA11y(page, undefined, {
        includedImpacts: ['critical', 'serious'] as Array<'critical' | 'serious'>,
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa']
          }
        },
        detailedReport: true
      });
      
      console.log('✅ Home page critical accessibility test passed');
    });

    test('should have accessible navigation elements', async ({ page }) => {
      // Test Objective: Verify navigation elements are accessible
      
      console.log('🧭 Testing navigation accessibility...');
      
      await page.goto(baseUrl);
      await injectAxe(page);
      
      // Check accessibility for navigation elements specifically
      await checkA11y(page, 'nav, [role="navigation"], .navbar, .nav', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a']
          }
        },
        detailedReport: true
      });
      
      console.log('✅ Navigation accessibility test passed');
    });

    test('should have accessible form elements on home page', async ({ page }) => {
      // Test Objective: Verify form elements are accessible
      
      console.log('📝 Testing form accessibility on home page...');
      
      await page.goto(baseUrl);
      await injectAxe(page);
      
      // Check accessibility for form elements
      await checkA11y(page, 'form, input, button, select, textarea', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a']
          }
        },
        detailedReport: true
      });
      
      console.log('✅ Form accessibility test passed');
    });
  });

  test.describe('Login Page Accessibility', () => {
    test('should have no accessibility violations on login page', async ({ page }) => {
      // Test Objective: Verify login page meets accessibility standards
      
      console.log('🔐 Testing login page accessibility...');
      
      // Navigate to login page
      await page.goto(`${baseUrl}/admin/`);
      await injectAxe(page);
      
      // Check accessibility for the entire login page
      await checkA11y(page, undefined, {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa']
          }
        },
        detailedReport: true,
        verbose: true
      });
      
      console.log('✅ Login page accessibility test passed');
    });

    test('should have accessible login form', async ({ page }) => {
      // Test Objective: Verify login form is accessible
      
      console.log('📝 Testing login form accessibility...');
      
      await page.goto(`${baseUrl}/admin/`);
      await injectAxe(page);
      
      // Check accessibility for the login form specifically
      await checkA11y(page, 'form', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a']
          }
        },
        detailedReport: true
      });
      
      console.log('✅ Login form accessibility test passed');
    });

    test('should have proper form labels and associations', async ({ page }) => {
      // Test Objective: Verify form labels are properly associated
      
      console.log('🏷️ Testing form labels and associations...');
      
      await page.goto(`${baseUrl}/admin/`);
      await injectAxe(page);
      
      // Check for proper label associations
      const violations = await getViolations(page, 'form', {
        runOnly: {
          type: 'rule',
          values: ['label', 'label-title-only', 'label-content-name-mismatch']
        }
      });
      
      expect(violations.length).toBe(0);
      console.log('✅ Form labels and associations test passed');
    });
  });

  test.describe('Admin Room Management Page Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      // Login to admin panel before testing room management
      await page.goto(`${baseUrl}/admin/`);
      await injectAxe(page);
      
      // Login with admin credentials
      await page.getByRole('textbox', { name: 'Username' }).fill('admin');
      await page.getByRole('textbox', { name: 'Password' }).fill('password');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Wait for login to complete
      await page.waitForLoadState('networkidle');
    });

    test('should have no accessibility violations on admin room page', async ({ page }) => {
      // Test Objective: Verify admin room management page meets accessibility standards
      
      console.log('🏠 Testing admin room page accessibility...');
      // Check accessibility for the entire admin room page
      await checkA11y(page, undefined, {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa']
          }
        },
        detailedReport: true,
        verbose: true
      });
      
      console.log('✅ Admin room page accessibility test passed');
    });

    test('should have accessible room creation form', async ({ page }) => {
      // Test Objective: Verify room creation form is accessible
      
      console.log('📝 Testing room creation form accessibility...');
      
      // Check accessibility for the room creation form
      await checkA11y(page, 'form', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a']
          }
        },
        detailedReport: true
      });
      
      console.log('✅ Room creation form accessibility test passed');
    });

    test('should have accessible room listing table', async ({ page }) => {
      // Test Objective: Verify room listing table is accessible
      
      console.log('📋 Testing room listing table accessibility...');
      
      // Check accessibility for table elements
      await checkA11y(page, 'table, [role="table"], [data-testid="roomlisting"]', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a']
          }
        },
        detailedReport: true
      });
      
      console.log('✅ Room listing table accessibility test passed');
    });

    test('should have accessible buttons and interactive elements', async ({ page }) => {
      // Test Objective: Verify buttons and interactive elements are accessible
      
      console.log('🔘 Testing buttons and interactive elements...');
      
      // Check accessibility for buttons and interactive elements
      await checkA11y(page, 'button, [role="button"], a, input[type="button"], input[type="submit"]', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a']
          }
        },
        detailedReport: true
      });
      
      console.log('✅ Buttons and interactive elements accessibility test passed');
    });
  });

  test.describe('Room Edit Page Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      // Login to admin panel and navigate to a room for editing
      await page.goto(`${baseUrl}/admin/`);
      await injectAxe(page);
      
      // Login with admin credentials
      await page.getByRole('textbox', { name: 'Username' }).fill('admin');
      await page.getByRole('textbox', { name: 'Password' }).fill('password');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Wait for login to complete
      await page.waitForLoadState('networkidle');
      
      // Create a room to edit
      await page.getByTestId('roomName').fill('999');
      await page.locator('#type').selectOption('Single');
      await page.locator('#accessible').selectOption('true');
      await page.locator('#roomPrice').fill('100');
      await page.getByRole('checkbox', { name: 'WiFi' }).check();
      await page.getByRole('button', { name: 'Create' }).click();
      
      // Click on the created room to edit it
      await page.locator('div').filter({ hasText: /^999$/ }).click();
    });

    test('should have no accessibility violations on room edit page', async ({ page }) => {
      // Test Objective: Verify room edit page meets accessibility standards
      
      console.log('✏️ Testing room edit page accessibility...');
      
      // Check accessibility for the entire room edit page
      await checkA11y(page, undefined, {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa']
          }
        },
        detailedReport: true,
        verbose: true
      });
      
      console.log('✅ Room edit page accessibility test passed');
    });

    test('should have accessible room edit form', async ({ page }) => {
      // Test Objective: Verify room edit form is accessible
      
      console.log('📝 Testing room edit form accessibility...');
      
      // Click edit button to open edit form
      await page.getByRole('button', { name: 'Edit' }).click();
      
      // Check accessibility for the room edit form
      await checkA11y(page, 'form', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a']
          }
        },
        detailedReport: true
      });
      
      console.log('✅ Room edit form accessibility test passed');
    });

    test('should have accessible form controls in edit mode', async ({ page }) => {
      // Test Objective: Verify form controls are accessible in edit mode
      
      console.log('🎛️ Testing form controls accessibility in edit mode...');
      
      // Click edit button to open edit form
      await page.getByRole('button', { name: 'Edit' }).click();
      
      // Check accessibility for form controls
      await checkA11y(page, 'input, select, textarea, button, [role="checkbox"], [role="radio"]', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a']
          }
        },
        detailedReport: true
      });
      
      console.log('✅ Form controls accessibility test passed');
    });
  });

  test.describe('Cross-Page Accessibility Consistency', () => {
    test('should maintain consistent accessibility across all pages', async ({ page }) => {
      // Test Objective: Verify consistent accessibility patterns across pages
      
      console.log('🔄 Testing accessibility consistency across pages...');
      
      const pages = [
        { name: 'Home', url: baseUrl },
        { name: 'Login', url: `${baseUrl}/admin/` }
      ];
      
      for (const pageInfo of pages) {
        console.log(`Testing ${pageInfo.name} page...`);
        
        await page.goto(pageInfo.url);
        await injectAxe(page);
        
        // Check for critical accessibility violations only
        await checkA11y(page, undefined, {
          includedImpacts: ['critical', 'serious'] as Array<'critical' | 'serious'>,
          axeOptions: {
            runOnly: {
              type: 'tag',
              values: ['wcag2a']
            }
          },
          detailedReport: true
        });
      }
      
      console.log('✅ Cross-page accessibility consistency test passed');
    });

    test('should have consistent color contrast across pages', async ({ page }) => {
      // Test Objective: Verify consistent color contrast across pages
      
      console.log('🎨 Testing color contrast consistency...');
      
      const pages = [
        { name: 'Home', url: baseUrl },
        { name: 'Login', url: `${baseUrl}/admin/` }
      ];
      
      for (const pageInfo of pages) {
        console.log(`Testing color contrast on ${pageInfo.name} page...`);
        
        await page.goto(pageInfo.url);
        await injectAxe(page);
        
        // Check specifically for color contrast issues
        const violations = await getViolations(page, undefined, {
          runOnly: {
            type: 'rule',
            values: ['color-contrast']
          }
        });
        
        expect(violations.length).toBe(0);
      }
      
      console.log('✅ Color contrast consistency test passed');
    });
  });

  test.describe('Keyboard Navigation Accessibility', () => {
    test('should support keyboard navigation on home page', async ({ page }) => {
      // Test Objective: Verify keyboard navigation works on home page
      
      console.log('⌨️ Testing keyboard navigation on home page...');
      
      await page.goto(baseUrl);
      await injectAxe(page);
      
      // Check for keyboard navigation accessibility
      await checkA11y(page, undefined, {
        axeOptions: {
          runOnly: {
            type: 'rule',
            values: ['focus-order-semantics', 'focusable-content', 'focusable-no-name']
          }
        },
        detailedReport: true
      });
      
      console.log('✅ Keyboard navigation accessibility test passed');
    });

    test('should support keyboard navigation on admin pages', async ({ page }) => {
      // Test Objective: Verify keyboard navigation works on admin pages
      
      console.log('⌨️ Testing keyboard navigation on admin pages...');
      
      await page.goto(`${baseUrl}/admin/`);
      await injectAxe(page);
      
      // Login
      await page.getByRole('textbox', { name: 'Username' }).fill('admin');
      await page.getByRole('textbox', { name: 'Password' }).fill('password');
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForLoadState('networkidle');
      
      // Check for keyboard navigation accessibility
      await checkA11y(page, undefined, {
        axeOptions: {
          runOnly: {
            type: 'rule',
            values: ['focus-order-semantics', 'focusable-content', 'focusable-no-name']
          }
        },
        detailedReport: true
      });
      
      console.log('✅ Admin keyboard navigation accessibility test passed');
    });
  });

  test.describe('Screen Reader Accessibility', () => {
    test('should have proper ARIA labels and roles', async ({ page }) => {
      // Test Objective: Verify proper ARIA implementation
      
      console.log('🔊 Testing ARIA labels and roles...');
      
      await page.goto(baseUrl);
      await injectAxe(page);
      
      // Check for proper ARIA implementation
      await checkA11y(page, undefined, {
        axeOptions: {
          runOnly: {
            type: 'rule',
            values: ['aria-allowed-attr', 'aria-allowed-role', 'aria-required-attr', 'aria-required-children']
          }
        },
        detailedReport: true
      });
      
      console.log('✅ ARIA labels and roles test passed');
    });

    test('should have proper heading structure', async ({ page }) => {
      // Test Objective: Verify proper heading hierarchy
      
      console.log('📋 Testing heading structure...');
      
      await page.goto(baseUrl);
      await injectAxe(page);
      
      // Check for proper heading structure
      await checkA11y(page, undefined, {
        axeOptions: {
          runOnly: {
            type: 'rule',
            values: ['heading-order', 'page-has-heading-one']
          }
        },
        detailedReport: true
      });
      
      console.log('✅ Heading structure test passed');
    });
  });

  test.describe('Mobile Accessibility', () => {
    test('should be accessible on mobile viewport', async ({ page }) => {
      // Test Objective: Verify accessibility on mobile devices
      
      console.log('📱 Testing mobile accessibility...');
      
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto(baseUrl);
      await injectAxe(page);
      
      // Check accessibility for mobile viewport
      await checkA11y(page, undefined, {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a']
          }
        },
        detailedReport: true
      });
      
      console.log('✅ Mobile accessibility test passed');
    });
  });
}); 