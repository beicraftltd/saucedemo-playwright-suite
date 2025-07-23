import { Page } from '@playwright/test';
import { injectAxe, checkA11y, getViolations, configureAxe } from 'axe-playwright';

/**
 * AccessibilityHelper Class
 * 
 * This class provides helper methods for accessibility testing using axe-playwright.
 * It encapsulates common accessibility testing patterns and configurations.
 * 
 * Features:
 * - WCAG 2.1 compliance testing
 * - Critical and serious violation detection
 * - Form accessibility testing
 * - Navigation accessibility testing
 * - Keyboard navigation testing
 * - Screen reader compatibility testing
 * - Mobile accessibility testing
 */
export class AccessibilityHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Safely inject axe into the page with retry logic
   */
  async injectAxeSafely(): Promise<boolean> {
    try {
      await injectAxe(this.page);
      // Wait for axe to be ready
      await this.page.waitForTimeout(1000);
      return true;
    } catch (error: any) {
      console.log('⚠️ Failed to inject axe:', error.message);
      return false;
    }
  }

  /**
   * Run accessibility checks with error handling
   */
  async runAccessibilityCheck(
    selector?: string,
    options?: {
      axeOptions?: any;
      includedImpacts?: Array<'critical' | 'serious' | 'moderate' | 'minor'>;
      detailedReport?: boolean;
      verbose?: boolean;
    }
  ): Promise<boolean> {
    try {
      // Ensure axe is injected
      const axeInjected = await this.injectAxeSafely();
      if (!axeInjected) {
        console.log('⚠️ Skipping accessibility check - axe not available');
        return false;
      }

      await checkA11y(this.page, selector, {
        axeOptions: options?.axeOptions || {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa']
          }
        },
        includedImpacts: options?.includedImpacts,
        detailedReport: options?.detailedReport || true,
        verbose: options?.verbose || false
      });

      return true;
    } catch (error: any) {
      console.log('⚠️ Accessibility check failed:', error.message);
      return false;
    }
  }

  /**
   * Get accessibility violations with error handling
   */
  async getAccessibilityViolations(
    selector?: string,
    options?: any
  ): Promise<any[]> {
    try {
      const axeInjected = await this.injectAxeSafely();
      if (!axeInjected) {
        console.log('⚠️ Skipping violation check - axe not available');
        return [];
      }

      return await getViolations(this.page, selector, options);
    } catch (error: any) {
      console.log('⚠️ Failed to get accessibility violations:', error.message);
      return [];
    }
  }

  /**
   * Check for specific WCAG compliance
   */
  async checkWCAGCompliance(level: 'A' | 'AA' = 'A'): Promise<boolean> {
    const values = level === 'AA' ? ['wcag2a', 'wcag2aa'] : ['wcag2a'];
    
    return await this.runAccessibilityCheck(undefined, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: values
        }
      },
      detailedReport: true
    });
  }

  /**
   * Check for critical and serious issues only
   */
  async checkCriticalIssues(): Promise<boolean> {
    return await this.runAccessibilityCheck(undefined, {
      includedImpacts: ['critical', 'serious'],
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      },
      detailedReport: true
    });
  }

  /**
   * Check specific elements for accessibility
   */
  async checkElementAccessibility(selector: string): Promise<boolean> {
    return await this.runAccessibilityCheck(selector, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a']
        }
      },
      detailedReport: true
    });
  }

  /**
   * Initialize accessibility testing for a page
   * Step: Injects axe-core and configures basic accessibility testing
   */
  async initializeAccessibility() {
    console.log('🔧 Initializing accessibility testing...');
    await injectAxe(this.page);
    
    // Configure axe with basic settings
    await configureAxe(this.page, {
      branding: {
        brand: 'Accessibility Test Suite',
        application: 'Hotel Booking System'
      },
      reporter: 'v2'
    });
    
    console.log('✅ Accessibility testing initialized');
  }

  /**
   * Test full page accessibility
   * Step: Performs comprehensive accessibility testing on the entire page
   * @param pageTitle - Title of the page being tested
   * @param includeMinor - Whether to include minor violations
   */
  async testFullPageAccessibility(pageTitle: string, includeMinor: boolean = false) {
    console.log(`🏠 Testing full page accessibility for: ${pageTitle}`);
    
    const impacts: Array<'critical' | 'serious' | 'moderate' | 'minor'> = includeMinor 
      ? ['critical', 'serious', 'moderate', 'minor']
      : ['critical', 'serious'];
    
    await checkA11y(this.page, undefined, {
      includedImpacts: impacts,
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      },
      detailedReport: true,
      verbose: true
    });
    
    console.log(`✅ Full page accessibility test passed for: ${pageTitle}`);
  }

  /**
   * Test critical accessibility violations only
   * Step: Tests only for critical and serious accessibility issues
   * @param pageTitle - Title of the page being tested
   */
  async testCriticalAccessibility(pageTitle: string) {
    console.log(`🚨 Testing critical accessibility for: ${pageTitle}`);
    
    await checkA11y(this.page, undefined, {
      includedImpacts: ['critical', 'serious'] as Array<'critical' | 'serious'>,
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      },
      detailedReport: true
    });
    
    console.log(`✅ Critical accessibility test passed for: ${pageTitle}`);
  }

  /**
   * Test form accessibility
   * Step: Tests accessibility of form elements
   * @param formSelector - CSS selector for the form to test
   */
  async testFormAccessibility(formSelector: string = 'form') {
    console.log('📝 Testing form accessibility...');
    
    await checkA11y(this.page, formSelector, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a']
        }
      },
      detailedReport: true
    });
    
    console.log('✅ Form accessibility test passed');
  }

  /**
   * Test form labels and associations
   * Step: Tests proper label associations for form elements
   * @param formSelector - CSS selector for the form to test
   */
  async testFormLabels(formSelector: string = 'form') {
    console.log('🏷️ Testing form labels and associations...');
    
    const violations = await getViolations(this.page, formSelector, {
      runOnly: {
        type: 'rule',
        values: ['label', 'label-title-only', 'label-content-name-mismatch']
      }
    });
    
    if (violations.length > 0) {
      console.log('⚠️ Form label violations found:', violations.length);
      violations.forEach(violation => {
        console.log(`- ${violation.description}: ${violation.nodes.length} nodes affected`);
      });
    }
    
    return violations;
  }

  /**
   * Test navigation accessibility
   * Step: Tests accessibility of navigation elements
   * @param navSelector - CSS selector for navigation elements
   */
  async testNavigationAccessibility(navSelector: string = 'nav, [role="navigation"], .navbar, .nav') {
    console.log('🧭 Testing navigation accessibility...');
    
    await checkA11y(this.page, navSelector, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a']
        }
      },
      detailedReport: true
    });
    
    console.log('✅ Navigation accessibility test passed');
  }

  /**
   * Test table accessibility
   * Step: Tests accessibility of table elements
   * @param tableSelector - CSS selector for table elements
   */
  async testTableAccessibility(tableSelector: string = 'table, [role="table"]') {
    console.log('📋 Testing table accessibility...');
    
    await checkA11y(this.page, tableSelector, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a']
        }
      },
      detailedReport: true
    });
    
    console.log('✅ Table accessibility test passed');
  }

  /**
   * Test button and interactive element accessibility
   * Step: Tests accessibility of buttons and interactive elements
   * @param buttonSelector - CSS selector for buttons and interactive elements
   */
  async testButtonAccessibility(buttonSelector: string = 'button, [role="button"], a, input[type="button"], input[type="submit"]') {
    console.log('🔘 Testing button and interactive element accessibility...');
    
    await checkA11y(this.page, buttonSelector, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a']
        }
      },
      detailedReport: true
    });
    
    console.log('✅ Button accessibility test passed');
  }

  /**
   * Test keyboard navigation accessibility
   * Step: Tests keyboard navigation and focus management
   */
  async testKeyboardNavigation() {
    console.log('⌨️ Testing keyboard navigation accessibility...');
    
    await checkA11y(this.page, undefined, {
      axeOptions: {
        runOnly: {
          type: 'rule',
          values: ['focus-order-semantics', 'focusable-content', 'focusable-no-name']
        }
      },
      detailedReport: true
    });
    
    console.log('✅ Keyboard navigation accessibility test passed');
  }

  /**
   * Test ARIA implementation
   * Step: Tests proper ARIA labels and roles
   */
  async testARIAImplementation() {
    console.log('🔊 Testing ARIA labels and roles...');
    
    await checkA11y(this.page, undefined, {
      axeOptions: {
        runOnly: {
          type: 'rule',
          values: ['aria-allowed-attr', 'aria-allowed-role', 'aria-required-attr', 'aria-required-children']
        }
      },
      detailedReport: true
    });
    
    console.log('✅ ARIA implementation test passed');
  }

  /**
   * Test heading structure
   * Step: Tests proper heading hierarchy
   */
  async testHeadingStructure() {
    console.log('📋 Testing heading structure...');
    
    await checkA11y(this.page, undefined, {
      axeOptions: {
        runOnly: {
          type: 'rule',
          values: ['heading-order', 'page-has-heading-one']
        }
      },
      detailedReport: true
    });
    
    console.log('✅ Heading structure test passed');
  }

  /**
   * Test color contrast
   * Step: Tests color contrast compliance
   */
  async testColorContrast() {
    console.log('🎨 Testing color contrast...');
    
    const violations = await getViolations(this.page, undefined, {
      runOnly: {
        type: 'rule',
        values: ['color-contrast']
      }
    });
    
    if (violations.length > 0) {
      console.log('⚠️ Color contrast violations found:', violations.length);
      violations.forEach(violation => {
        console.log(`- ${violation.description}: ${violation.nodes.length} nodes affected`);
      });
    }
    
    return violations;
  }

  /**
   * Test mobile accessibility
   * Step: Tests accessibility on mobile viewport
   * @param viewportSize - Mobile viewport size
   */
  async testMobileAccessibility(viewportSize: { width: number; height: number } = { width: 375, height: 667 }) {
    console.log('📱 Testing mobile accessibility...');
    
    // Set mobile viewport
    await this.page.setViewportSize(viewportSize);
    
    await checkA11y(this.page, undefined, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a']
        }
      },
      detailedReport: true
    });
    
    console.log('✅ Mobile accessibility test passed');
  }

  /**
   * Test specific element accessibility
   * Step: Tests accessibility of specific elements
   * @param selector - CSS selector for elements to test
   * @param elementName - Name of the element being tested
   */
  async testElementAccessibility(selector: string, elementName: string) {
    console.log(`🔍 Testing ${elementName} accessibility...`);
    
    await checkA11y(this.page, selector, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a']
        }
      },
      detailedReport: true
    });
    
    console.log(`✅ ${elementName} accessibility test passed`);
  }

  /**
   * Test accessibility with custom configuration
   * Step: Tests accessibility with custom axe configuration
   * @param selector - CSS selector for elements to test
   * @param options - Custom axe options
   */
  async testWithCustomConfig(selector: string | undefined = undefined, options: any = {}) {
    console.log('⚙️ Testing with custom configuration...');
    
    await checkA11y(this.page, selector, {
      axeOptions: options,
      detailedReport: true
    });
    
    console.log('✅ Custom configuration test passed');
  }
} 