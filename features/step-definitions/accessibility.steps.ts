import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { AccessibilityHelper } from '../../pages/AccessibilityHelper';

// Given Steps
Given('I am on the home page', async function (this: CustomWorld) {
  await this.navigateToPage('/');
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.injectAxeSafely();
  console.log('✅ On home page with axe injected');
});

Given('I am on the login page', async function (this: CustomWorld) {
  await this.navigateToPage('/admin/');
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.injectAxeSafely();
  console.log('✅ On login page with axe injected');
});

Given('I am logged in as an admin user', async function (this: CustomWorld) {
  await this.navigateToPage('/admin/');
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.injectAxeSafely();

  // Login with admin credentials
  await this.page!.getByRole('textbox', { name: 'Username' }).fill('admin');
  await this.page!.getByRole('textbox', { name: 'Password' }).fill('password');
  await this.page!.getByRole('button', { name: 'Login' }).click();

  // Wait for login to complete
  await this.page!.waitForLoadState('networkidle');
  console.log('✅ Logged in as admin user');
});

Given('I am on a room edit page', async function (this: CustomWorld) {
  // Login to admin panel and navigate to a room for editing
  await this.navigateToPage('/admin/');
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.injectAxeSafely();

  // Login with admin credentials
  await this.page!.getByRole('textbox', { name: 'Username' }).fill('admin');
  await this.page!.getByRole('textbox', { name: 'Password' }).fill('password');
  await this.page!.getByRole('button', { name: 'Login' }).click();

  // Wait for login to complete
  await this.page!.waitForLoadState('networkidle');

  // Create a room to edit
  await this.page!.getByTestId('roomName').fill('999');
  await this.page!.locator('#type').selectOption('Single');
  await this.page!.locator('#accessible').selectOption('true');
  await this.page!.locator('#roomPrice').fill('100');
  await this.page!.getByRole('checkbox', { name: 'WiFi' }).check();
  await this.page!.getByRole('button', { name: 'Create' }).click();

  // Click on the created room to edit it
  await this.page!.locator('div').filter({ hasText: /^999$/ }).click();
  console.log('✅ On room edit page');
});

// When Steps - Home Page
When('I run accessibility checks for WCAG 2.1 standards', async function (this: CustomWorld) {
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.checkWCAGCompliance('AA');
  console.log('✅ WCAG 2.1 accessibility checks completed');
});

When('I check for critical accessibility issues', async function (this: CustomWorld) {
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.checkCriticalIssues();
  console.log('✅ Critical accessibility issues checked');
});

When('I test navigation accessibility', async function (this: CustomWorld) {
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.checkElementAccessibility('nav, [role="navigation"], .navbar, .nav');
  console.log('✅ Navigation accessibility tested');
});

When('I test form accessibility on home page', async function (this: CustomWorld) {
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.checkElementAccessibility('form, input, button, select, textarea');
  console.log('✅ Form accessibility tested');
});

// When Steps - Login Page
When('I run accessibility checks on the login form', async function (this: CustomWorld) {
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.checkElementAccessibility('form');
  console.log('✅ Login form accessibility checked');
});

When('I test form labels and associations', async function (this: CustomWorld) {
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  const violations = await accessibilityHelper.getAccessibilityViolations('form', {
    runOnly: {
      type: 'rule',
      values: ['label', 'label-title-only', 'label-content-name-mismatch']
    }
  });
  if (violations.length > 0) {
    let details = '\nAccessibility Violations:';
    for (const v of violations) {
      details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
      for (const node of v.nodes) {
        details += `\n  Selector: ${node.target.join(', ')}`;
        details += `\n  HTML: ${node.html}`;
        details += `\n  Failure: ${node.failureSummary}`;
      }
    }
    console.log(details);
    if (this.attach) await this.attach(details, 'text/plain');
  }
  expect(violations.length).toBe(0);
  console.log('✅ Form labels and associations tested');
});

// When Steps - Admin Room Management
When('I test the room management interface', async function (this: CustomWorld) {
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.checkWCAGCompliance('AA');
  console.log('✅ Room management interface tested');
});

When('I test room creation form accessibility', async function (this: CustomWorld) {
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.checkElementAccessibility('form');
  console.log('✅ Room creation form accessibility tested');
});

When('I test room listing table accessibility', async function (this: CustomWorld) {
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.checkElementAccessibility('table, [role="table"], [data-testid="roomlisting"]');
  console.log('✅ Room listing table accessibility tested');
});

When('I test buttons and interactive elements', async function (this: CustomWorld) {
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.checkElementAccessibility('button, [role="button"], a, input[type="button"], input[type="submit"]');
  console.log('✅ Buttons and interactive elements tested');
});

// When Steps - Room Edit Page
When('I test room edit page accessibility', async function (this: CustomWorld) {
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.checkWCAGCompliance('AA');
  console.log('✅ Room edit page accessibility tested');
});

When('I test room edit form accessibility', async function (this: CustomWorld) {
  // Click edit button to open edit form
  await this.page!.getByRole('button', { name: 'Edit' }).click();

  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.checkElementAccessibility('form');
  console.log('✅ Room edit form accessibility tested');
});

When('I test form controls in edit mode', async function (this: CustomWorld) {
  // Click edit button to open edit form
  await this.page!.getByRole('button', { name: 'Edit' }).click();

  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.checkElementAccessibility('input, select, textarea, button, [role="checkbox"], [role="radio"]');
  console.log('✅ Form controls in edit mode tested');
});

// When Steps - Cross-Page Tests
When('I test accessibility consistency across pages', async function (this: CustomWorld) {
  const pages = [
    { name: 'Home', url: this.baseUrl },
    { name: 'Login', url: `${this.baseUrl}/admin/` }
  ];

  for (const pageInfo of pages) {
    console.log(`Testing ${pageInfo.name} page...`);

    await this.navigateToPage(pageInfo.url.replace(this.baseUrl, ''));
    const accessibilityHelper = new AccessibilityHelper(this.page!);
    await accessibilityHelper.injectAxeSafely();

    // Check for critical accessibility violations only
    await accessibilityHelper.runAccessibilityCheck(undefined, {
      includedImpacts: ['critical', 'serious'],
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a']
        }
      },
      detailedReport: true
    });
  }
  console.log('✅ Accessibility consistency across pages tested');
});

When('I test color contrast consistency', async function (this: CustomWorld) {
  const pages = [
    { name: 'Home', url: this.baseUrl },
    { name: 'Login', url: `${this.baseUrl}/admin/` }
  ];

  for (const pageInfo of pages) {
    console.log(`Testing color contrast on ${pageInfo.name} page...`);

    await this.navigateToPage(pageInfo.url.replace(this.baseUrl, ''));
    const accessibilityHelper = new AccessibilityHelper(this.page!);
    await accessibilityHelper.injectAxeSafely();

    // Check specifically for color contrast issues
    const violations = await accessibilityHelper.getAccessibilityViolations(undefined, {
      runOnly: {
        type: 'rule',
        values: ['color-contrast']
      }
    });

    if (violations.length > 0) {
      let details = '\nAccessibility Violations:';
      for (const v of violations) {
        details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
        for (const node of v.nodes) {
          details += `\n  Selector: ${node.target.join(', ')}`;
          details += `\n  HTML: ${node.html}`;
          details += `\n  Failure: ${node.failureSummary}`;
        }
      }
      console.log(details);
      if (this.attach) await this.attach(details, 'text/plain');
    }
    expect(violations.length).toBe(0);
  }
  console.log('✅ Color contrast consistency tested');
});

// When Steps - Keyboard Navigation
When('I test keyboard navigation on home page', async function (this: CustomWorld) {
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.runAccessibilityCheck(undefined, {
    axeOptions: {
      runOnly: {
        type: 'rule',
        values: ['focus-order-semantics', 'focusable-content', 'focusable-no-name']
      }
    },
    detailedReport: true
  });
  console.log('✅ Keyboard navigation on home page tested');
});

When('I test keyboard navigation on admin pages', async function (this: CustomWorld) {
  // Login
  await this.page!.getByRole('textbox', { name: 'Username' }).fill('admin');
  await this.page!.getByRole('textbox', { name: 'Password' }).fill('password');
  await this.page!.getByRole('button', { name: 'Login' }).click();
  await this.page!.waitForLoadState('networkidle');

  // Check for keyboard navigation accessibility
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.runAccessibilityCheck(undefined, {
    axeOptions: {
      runOnly: {
        type: 'rule',
        values: ['focus-order-semantics', 'focusable-content', 'focusable-no-name']
      }
    },
    detailedReport: true
  });
  console.log('✅ Keyboard navigation on admin pages tested');
});

// When Steps - Screen Reader
When('I test ARIA labels and roles', async function (this: CustomWorld) {
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.runAccessibilityCheck(undefined, {
    axeOptions: {
      runOnly: {
        type: 'rule',
        values: ['aria-allowed-attr', 'aria-allowed-role', 'aria-required-attr', 'aria-required-children']
      }
    },
    detailedReport: true
  });
  console.log('✅ ARIA labels and roles tested');
});

When('I test heading structure', async function (this: CustomWorld) {
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.runAccessibilityCheck(undefined, {
    axeOptions: {
      runOnly: {
        type: 'rule',
        values: ['heading-order', 'page-has-heading-one']
      }
    },
    detailedReport: true
  });
  console.log('✅ Heading structure tested');
});

// When Steps - Mobile
When('I test accessibility on mobile viewport', async function (this: CustomWorld) {
  // Set mobile viewport
  await this.page!.setViewportSize({ width: 375, height: 667 });

  const accessibilityHelper = new AccessibilityHelper(this.page!);
  await accessibilityHelper.checkWCAGCompliance('A');
  console.log('✅ Mobile accessibility tested');
});

// Then Steps - Home Page
Then('there should be no accessibility violations on home page', async function (this: CustomWorld) {
  // If we reach this step, it means checkA11y() didn't throw an error
  // But let's add an explicit verification
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  const violations = await accessibilityHelper.getAccessibilityViolations(undefined, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa']
    }
  });
  if (violations.length > 0) {
    let details = '\nAccessibility Violations:';
    for (const v of violations) {
      details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
      for (const node of v.nodes) {
        details += `\n  Selector: ${node.target.join(', ')}`;
        details += `\n  HTML: ${node.html}`;
        details += `\n  Failure: ${node.failureSummary}`;
      }
    }
    console.log(details);
    if (this.attach) await this.attach(details, 'text/plain');
  }
  expect(violations.length).toBe(0);
  console.log('✅ Home page accessibility test passed - no violations found');
});

Then('there should be no critical accessibility violations on home page', async function (this: CustomWorld) {
  // Verify no critical violations exist
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  const violations = await accessibilityHelper.getAccessibilityViolations(undefined, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa']
    }
  });
  // Filter for critical and serious violations
  const criticalViolations = violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
  if (criticalViolations.length > 0) {
    let details = '\nCritical Accessibility Violations:';
    for (const v of criticalViolations) {
      details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
      for (const node of v.nodes) {
        details += `\n  Selector: ${node.target.join(', ')}`;
        details += `\n  HTML: ${node.html}`;
        details += `\n  Failure: ${node.failureSummary}`;
      }
    }
    console.log(details);
    if (this.attach) await this.attach(details, 'text/plain');
  }
  expect(criticalViolations.length).toBe(0);
  console.log('✅ Home page critical accessibility test passed - no critical violations found');
});

Then('navigation elements should be accessible', async function (this: CustomWorld) {
  // Verify navigation elements have no violations
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  const violations = await accessibilityHelper.getAccessibilityViolations('nav, [role="navigation"], .navbar, .nav', {
    runOnly: {
      type: 'tag',
      values: ['wcag2a']
    }
  });
  if (violations.length > 0) {
    let details = '\nAccessibility Violations:';
    for (const v of violations) {
      details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
      for (const node of v.nodes) {
        details += `\n  Selector: ${node.target.join(', ')}`;
        details += `\n  HTML: ${node.html}`;
        details += `\n  Failure: ${node.failureSummary}`;
      }
    }
    console.log(details);
    if (this.attach) await this.attach(details, 'text/plain');
  }
  expect(violations.length).toBe(0);
  console.log('✅ Navigation accessibility test passed - no violations found');
});

Then('form elements should be accessible on home page', async function (this: CustomWorld) {
  // Verify form elements have no violations
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  const violations = await accessibilityHelper.getAccessibilityViolations('form, input, button, select, textarea', {
    runOnly: {
      type: 'tag',
      values: ['wcag2a']
    }
  });
  if (violations.length > 0) {
    let details = '\nAccessibility Violations:';
    for (const v of violations) {
      details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
      for (const node of v.nodes) {
        details += `\n  Selector: ${node.target.join(', ')}`;
        details += `\n  HTML: ${node.html}`;
        details += `\n  Failure: ${node.failureSummary}`;
      }
    }
    console.log(details);
    if (this.attach) await this.attach(details, 'text/plain');
  }
  expect(violations.length).toBe(0);
  console.log('✅ Form accessibility test passed - no violations found');
});

// Then Steps - Login Page
Then('there should be no accessibility violations on login page', async function (this: CustomWorld) {
  // Verify login page has no violations
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  const violations = await accessibilityHelper.getAccessibilityViolations(undefined, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa']
    }
  });
  if (violations.length > 0) {
    let details = '\nAccessibility Violations:';
    for (const v of violations) {
      details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
      for (const node of v.nodes) {
        details += `\n  Selector: ${node.target.join(', ')}`;
        details += `\n  HTML: ${node.html}`;
        details += `\n  Failure: ${node.failureSummary}`;
      }
    }
    console.log(details);
    if (this.attach) await this.attach(details, 'text/plain');
  }
  expect(violations.length).toBe(0);
  console.log('✅ Login page accessibility test passed - no violations found');
});

Then('the login form should be accessible', async function (this: CustomWorld) {
  // Verify login form has no violations
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  const violations = await accessibilityHelper.getAccessibilityViolations('form', {
    runOnly: {
      type: 'tag',
      values: ['wcag2a']
    }
  });
  if (violations.length > 0) {
    let details = '\nAccessibility Violations:';
    for (const v of violations) {
      details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
      for (const node of v.nodes) {
        details += `\n  Selector: ${node.target.join(', ')}`;
        details += `\n  HTML: ${node.html}`;
        details += `\n  Failure: ${node.failureSummary}`;
      }
    }
    console.log(details);
    if (this.attach) await this.attach(details, 'text/plain');
  }
  expect(violations.length).toBe(0);
  console.log('✅ Login form accessibility test passed - no violations found');
});

Then('form labels should be properly associated', async function (this: CustomWorld) {
  // Verify form labels and associations have no violations
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  const violations = await accessibilityHelper.getAccessibilityViolations('form', {
    runOnly: {
      type: 'rule',
      values: ['label', 'label-title-only', 'label-content-name-mismatch']
    }
  });
  if (violations.length > 0) {
    let details = '\nAccessibility Violations:';
    for (const v of violations) {
      details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
      for (const node of v.nodes) {
        details += `\n  Selector: ${node.target.join(', ')}`;
        details += `\n  HTML: ${node.html}`;
        details += `\n  Failure: ${node.failureSummary}`;
      }
    }
    console.log(details);
    if (this.attach) await this.attach(details, 'text/plain');
  }
  expect(violations.length).toBe(0);
  console.log('✅ Form labels and associations test passed - no violations found');
});

// Then Steps - Keyboard Navigation
Then('keyboard navigation should work on home page', async function (this: CustomWorld) {
  // Verify keyboard navigation has no violations
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  const violations = await accessibilityHelper.getAccessibilityViolations(undefined, {
    runOnly: {
      type: 'rule',
      values: ['focus-order-semantics', 'focusable-content', 'focusable-no-name']
    }
  });
  if (violations.length > 0) {
    let details = '\nAccessibility Violations:';
    for (const v of violations) {
      details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
      for (const node of v.nodes) {
        details += `\n  Selector: ${node.target.join(', ')}`;
        details += `\n  HTML: ${node.html}`;
        details += `\n  Failure: ${node.failureSummary}`;
      }
    }
    console.log(details);
    if (this.attach) await this.attach(details, 'text/plain');
  }
  expect(violations.length).toBe(0);
  console.log('✅ Keyboard navigation accessibility test passed - no violations found');
});

Then('keyboard navigation should work on admin pages', async function (this: CustomWorld) {
  // Verify keyboard navigation on admin pages has no violations
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  const violations = await accessibilityHelper.getAccessibilityViolations(undefined, {
    runOnly: {
      type: 'rule',
      values: ['focus-order-semantics', 'focusable-content', 'focusable-no-name']
    }
  });
  if (violations.length > 0) {
    let details = '\nAccessibility Violations:';
    for (const v of violations) {
      details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
      for (const node of v.nodes) {
        details += `\n  Selector: ${node.target.join(', ')}`;
        details += `\n  HTML: ${node.html}`;
        details += `\n  Failure: ${node.failureSummary}`;
      }
    }
    console.log(details);
    if (this.attach) await this.attach(details, 'text/plain');
  }
  expect(violations.length).toBe(0);
  console.log('✅ Admin keyboard navigation accessibility test passed - no violations found');
});

// Then Steps - Screen Reader
Then('ARIA labels and roles should be proper', async function (this: CustomWorld) {
  // Verify ARIA labels and roles have no violations
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  const violations = await accessibilityHelper.getAccessibilityViolations(undefined, {
    runOnly: {
      type: 'rule',
      values: ['aria-allowed-attr', 'aria-allowed-role', 'aria-required-attr', 'aria-required-children']
    }
  });
  if (violations.length > 0) {
    let details = '\nAccessibility Violations:';
    for (const v of violations) {
      details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
      for (const node of v.nodes) {
        details += `\n  Selector: ${node.target.join(', ')}`;
        details += `\n  HTML: ${node.html}`;
        details += `\n  Failure: ${node.failureSummary}`;
      }
    }
    console.log(details);
    if (this.attach) await this.attach(details, 'text/plain');
  }
  expect(violations.length).toBe(0);
  console.log('✅ ARIA labels and roles test passed - no violations found');
});

Then('heading structure should be proper', async function (this: CustomWorld) {
  // Verify heading structure has no violations
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  const violations = await accessibilityHelper.getAccessibilityViolations(undefined, {
    runOnly: {
      type: 'rule',
      values: ['heading-order', 'page-has-heading-one']
    }
  });
  if (violations.length > 0) {
    let details = '\nAccessibility Violations:';
    for (const v of violations) {
      details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
      for (const node of v.nodes) {
        details += `\n  Selector: ${node.target.join(', ')}`;
        details += `\n  HTML: ${node.html}`;
        details += `\n  Failure: ${node.failureSummary}`;
      }
    }
    console.log(details);
    if (this.attach) await this.attach(details, 'text/plain');
  }
  expect(violations.length).toBe(0);
  console.log('✅ Heading structure test passed - no violations found');
});

// Then Steps - Mobile
Then('the interface should be accessible on mobile viewport', async function (this: CustomWorld) {
  // Verify mobile accessibility has no violations
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  const violations = await accessibilityHelper.getAccessibilityViolations(undefined, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a']
    }
  });
  if (violations.length > 0) {
    let details = '\nAccessibility Violations:';
    for (const v of violations) {
      details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
      for (const node of v.nodes) {
        details += `\n  Selector: ${node.target.join(', ')}`;
        details += `\n  HTML: ${node.html}`;
        details += `\n  Failure: ${node.failureSummary}`;
      }
    }
    console.log(details);
    if (this.attach) await this.attach(details, 'text/plain');
  }
  expect(violations.length).toBe(0);
  console.log('✅ Mobile accessibility test passed - no violations found');
});

// Then Steps - Interactive Elements
Then('buttons and interactive elements should be accessible', async function (this: CustomWorld) {
  // Verify buttons and interactive elements have no violations
  const accessibilityHelper = new AccessibilityHelper(this.page!);
  const violations = await accessibilityHelper.getAccessibilityViolations('button, [role="button"], a, input[type="button"], input[type="submit"]', {
    runOnly: {
      type: 'tag',
      values: ['wcag2a']
    }
  });
  if (violations.length > 0) {
    let details = '\nAccessibility Violations:';
    for (const v of violations) {
      details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
      for (const node of v.nodes) {
        details += `\n  Selector: ${node.target.join(', ')}`;
        details += `\n  HTML: ${node.html}`;
        details += `\n  Failure: ${node.failureSummary}`;
      }
    }
    console.log(details);
    if (this.attach) await this.attach(details, 'text/plain');
  }
  expect(violations.length).toBe(0);
  console.log('✅ Buttons and interactive elements accessibility test passed - no violations found');
});

// Then Steps - Cross-Page Consistency
Then('accessibility should be consistent across all pages', async function (this: CustomWorld) {
  // Verify accessibility consistency across pages
  const pages = [
    { name: 'Home', url: this.baseUrl },
    { name: 'Login', url: `${this.baseUrl}/admin/` }
  ];

  for (const pageInfo of pages) {
    console.log(`Verifying ${pageInfo.name} page accessibility consistency...`);
    
    await this.navigateToPage(pageInfo.url.replace(this.baseUrl, ''));
    const accessibilityHelper = new AccessibilityHelper(this.page!);
    await accessibilityHelper.injectAxeSafely();

    // Check for critical accessibility violations only
    const violations = await accessibilityHelper.getAccessibilityViolations(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a']
      }
    });
    
    // Filter for critical and serious violations
    const criticalViolations = violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    if (criticalViolations.length > 0) {
      let details = '\nAccessibility Violations:';
      for (const v of criticalViolations) {
        details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
        for (const node of v.nodes) {
          details += `\n  Selector: ${node.target.join(', ')}`;
          details += `\n  HTML: ${node.html}`;
          details += `\n  Failure: ${node.failureSummary}`;
        }
      }
      console.log(details);
      if (this.attach) await this.attach(details, 'text/plain');
    }
    expect(criticalViolations.length).toBe(0);
  }
  console.log('✅ Accessibility consistency across all pages verified - no critical violations found');
});

// Then Steps - Color Contrast
Then('color contrast should be consistent across pages', async function (this: CustomWorld) {
  // Verify color contrast consistency across pages
  const pages = [
    { name: 'Home', url: this.baseUrl },
    { name: 'Login', url: `${this.baseUrl}/admin/` }
  ];

  for (const pageInfo of pages) {
    console.log(`Verifying color contrast on ${pageInfo.name} page...`);
    
    await this.navigateToPage(pageInfo.url.replace(this.baseUrl, ''));
    const accessibilityHelper = new AccessibilityHelper(this.page!);
    await accessibilityHelper.injectAxeSafely();

    // Check specifically for color contrast issues
    const violations = await accessibilityHelper.getAccessibilityViolations(undefined, {
      runOnly: {
        type: 'rule',
        values: ['color-contrast']
      }
    });

    if (violations.length > 0) {
      let details = '\nAccessibility Violations:';
      for (const v of violations) {
        details += `\nRule: ${v.id} - ${v.description}\nHelp: ${v.helpUrl}`;
        for (const node of v.nodes) {
          details += `\n  Selector: ${node.target.join(', ')}`;
          details += `\n  HTML: ${node.html}`;
          details += `\n  Failure: ${node.failureSummary}`;
        }
      }
      console.log(details);
      if (this.attach) await this.attach(details, 'text/plain');
    }
    expect(violations.length).toBe(0);
  }
  console.log('✅ Color contrast consistency across pages verified - no violations found');
});