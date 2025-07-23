import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/world';

const BASE_URL = 'https://automationintesting.online';

// Performance thresholds based on industry standards
const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals
  firstContentfulPaint: 1800,    // 1.8 seconds (Good)
  largestContentfulPaint: 2500,  // 2.5 seconds (Good)
  firstInputDelay: 100,          // 100ms (Good)
  cumulativeLayoutShift: 0.1,    // 0.1 (Good)

  // Page Load Metrics
  totalLoadTime: 3000,           // 3 seconds
  domContentLoaded: 2000,        // 2 seconds
  timeToInteractive: 3500,       // 3.5 seconds

  // Resource Metrics
  maxResourceCount: 50,          // Maximum resources
  maxImageCount: 20,             // Maximum images
  maxSlowResources: 3,           // Maximum slow resources (>1s)
};

// Given Steps
Given('I am testing website performance with monitoring tools', async function (this: ICustomWorld) {
  console.log('🔄 Setting up performance testing environment...');
  await this.navigateToPage('/');
  console.log('✅ Performance testing environment ready');
});

// When Steps - Home Page Performance Test
When('I load home page and measure performance', async function (this: ICustomWorld) {
  const startTime = Date.now();

  await this.navigateToPage('/');
  await this.page!.waitForLoadState('networkidle');

  const totalLoadTime = Date.now() - startTime;

  // Get detailed performance metrics
  const metrics = await this.page!.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const resources = performance.getEntriesByType('resource');

    return {
      // Navigation timing
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,

      // Paint timing
      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,

      // Resource metrics
      resourceCount: resources.length,
      imageCount: resources.filter(r => (r as any).initiatorType === 'img').length,
      scriptCount: resources.filter(r => (r as any).initiatorType === 'script').length,
      stylesheetCount: resources.filter(r => (r as any).initiatorType === 'link').length,

      // Memory usage (if available)
      memory: (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      } : null,
    };
  });

  this.performanceMetrics = {
    measuredLoadTime: totalLoadTime,
    ...metrics
  };

  console.log('Home Page Performance Metrics:', this.performanceMetrics);
});

// When Steps - Core Web Vitals Test
When('I measure Core Web Vitals on home page', async function (this: ICustomWorld) {
  await this.navigateToPage('/');
  
  const { PerformanceHelper } = await import('../../pages/PerformanceHelper');
  const performanceHelper = new PerformanceHelper(this.page!);
  
  await performanceHelper.waitForPageStability();
  const webVitals = await performanceHelper.measureCoreWebVitals();
  
  this.webVitals = webVitals;
  console.log('Core Web Vitals:', webVitals);
  
  // Check if metrics meet performance thresholds
  const thresholdCheck = performanceHelper.checkCoreWebVitalsThresholds(webVitals);
  if (!thresholdCheck.passed) {
    console.log('⚠️ Performance issues detected:', thresholdCheck.issues);
  } else {
    console.log('✅ All Core Web Vitals meet performance thresholds');
  }
});

// When Steps - Admin Login Performance Test
When('I load admin login page and measure performance', async function (this: ICustomWorld) {
  const startTime = Date.now();

  await this.navigateToPage('/admin');
  
  const { PerformanceHelper } = await import('../../pages/PerformanceHelper');
  const performanceHelper = new PerformanceHelper(this.page!);
  
  await performanceHelper.waitForPageStability();
  const loadTime = Date.now() - startTime;

  // Get performance metrics
  const metrics = await performanceHelper.measurePagePerformance();
  metrics.loadTime = loadTime;

  this.adminPerformanceMetrics = metrics;

  console.log('Admin Login Performance:', this.adminPerformanceMetrics);
});

// When Steps - Resource Loading Performance Test
When('I analyze resource loading performance', async function (this: ICustomWorld) {
  const resourceMetrics: any[] = [];

  // Listen for resource loading
  this.page!.on('response', response => {
    const url = response.url();
    const status = response.status();
    const contentType = response.headers()['content-type'] || '';
    const resourceType = response.request().resourceType();

    if (status === 200) {
      resourceMetrics.push({
        url: url,
        contentType: contentType,
        resourceType: resourceType,
        size: response.headers()['content-length'] || 'unknown',
      });
    }
  });

  await this.navigateToPage('/');
  await this.page!.waitForLoadState('networkidle');

  // Analyze resource loading
  const imageResources = resourceMetrics.filter(r => r.contentType.startsWith('image/'));
  const scriptResources = resourceMetrics.filter(r => r.resourceType === 'script');
  const stylesheetResources = resourceMetrics.filter(r => r.resourceType === 'stylesheet');
  const slowResources = resourceMetrics.filter(r => {
    // Estimate load time based on size (rough approximation)
    const size = parseInt(r.size) || 0;
    return size > 100000; // Resources larger than 100KB
  });

  this.resourceAnalysis = {
    totalResources: resourceMetrics.length,
    images: imageResources.length,
    scripts: scriptResources.length,
    stylesheets: stylesheetResources.length,
    slowResources: slowResources.length,
  };

  console.log('Resource Loading Analysis:', this.resourceAnalysis);
});

// When Steps - Navigation Interaction Performance Test
When('I test navigation interaction performance', async function (this: ICustomWorld) {
  await this.navigateToPage('/');

  // Test navigation interaction performance
  const navigationStart = Date.now();
  await this.page!.click('text=Let me hack!');
  await this.page!.waitForLoadState('networkidle');
  const navigationTime = Date.now() - navigationStart;

  this.navigationTime = navigationTime;
  console.log('Navigation Performance:', {
    navigationTime: `${navigationTime}ms`
  });
});

// When Steps - Form Interaction Performance Test
When('I test form interaction performance', async function (this: ICustomWorld) {
  await this.navigateToPage('/admin');

  // Test form interaction performance
  const formStart = Date.now();
  await this.page!.fill('#username', 'admin');
  await this.page!.fill('#password', 'password');
  await this.page!.click('#doLogin');
  await this.page!.waitForURL('**/admin');
  const formTime = Date.now() - formStart;

  this.formTime = formTime;
  console.log('Form Interaction Performance:', {
    formTime: `${formTime}ms`
  });
});

// When Steps - Room Creation Performance Test
When('I test room creation performance', async function (this: ICustomWorld) {
  // Login first
  await this.navigateToPage('/admin');
  await this.page!.fill('#username', 'admin');
  await this.page!.fill('#password', 'password');
  await this.page!.click('#doLogin');
  await this.page!.waitForURL('**/admin');

  // Navigate to room management
  await this.page!.click('text=Rooms');

  // Test room creation performance
  const creationStart = Date.now();
  await this.page!.click('#createRoom');
  await this.page!.fill('#roomName', '800');
  await this.page!.fill('#roomPrice', '100');
  await this.page!.fill('#roomDescription', 'Room for performance testing');
  await this.page!.click('#createRoom');
  await this.page!.waitForSelector('text=Performance Test Room');
  const creationTime = Date.now() - creationStart;

  this.creationTime = creationTime;
  console.log('Room Creation Performance:', {
    creationTime: `${creationTime}ms`
  });
});

// When Steps - Memory Usage Monitoring Test
When('I monitor memory usage', async function (this: ICustomWorld) {
  await this.navigateToPage('/');

  // Get initial memory usage
  const initialMemory = await this.page!.evaluate(() => {
    return (performance as any).memory?.usedJSHeapSize || 0;
  });

  // Perform some interactions
  await this.page!.click('text=Let me hack!');
  await this.page!.waitForLoadState('networkidle');

  await this.page!.goBack();
  await this.page!.waitForLoadState('networkidle');

  // Get final memory usage
  const finalMemory = await this.page!.evaluate(() => {
    return (performance as any).memory?.usedJSHeapSize || 0;
  });

  const memoryIncrease = finalMemory - initialMemory;

  this.memoryUsage = {
    initial: initialMemory,
    final: finalMemory,
    increase: memoryIncrease
  };

  console.log('Memory Usage:', {
    initial: `${(initialMemory / 1024 / 1024).toFixed(2)}MB`,
    final: `${(finalMemory / 1024 / 1024).toFixed(2)}MB`,
    increase: `${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`
  });
});

// When Steps - Cross-Browser Performance Test
When('I test performance across browsers', async function (this: ICustomWorld) {
  const startTime = Date.now();

  await this.navigateToPage('/');
  await this.page!.waitForLoadState('networkidle');

  const loadTime = Date.now() - startTime;

  const metrics = await this.page!.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
    };
  });

  this.crossBrowserMetrics = {
    loadTime,
    ...metrics
  };

  console.log(`Cross-Browser Performance:`, {
    loadTime: `${loadTime}ms`,
    ...metrics
  });
});

// When Steps - Mobile Performance Test
When('I test mobile performance', async function (this: ICustomWorld) {
  // Set mobile viewport
  await this.page!.setViewportSize({ width: 375, height: 667 });

  const startTime = Date.now();

  await this.navigateToPage('/');
  await this.page!.waitForLoadState('networkidle');

  const loadTime = Date.now() - startTime;

  const metrics = await this.page!.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
    };
  });

  this.mobileMetrics = {
    loadTime,
    ...metrics
  };

  console.log('Mobile Performance:', {
    loadTime: `${loadTime}ms`,
    ...metrics
  });

  // Test mobile navigation
  await this.page!.click('text=Let me hack!');
  await this.page!.waitForLoadState('networkidle');
});

// When Steps - Performance Regression Testing
When('I check for performance regressions', async function (this: ICustomWorld) {
  // Baseline metrics (these would typically come from a database or config)
  const baselineMetrics = {
    fcp: 1500,
    lcp: 2500,
    totalLoadTime: 3000,
    resourceCount: 30,
  };

  await this.navigateToPage('/');
  await this.page!.waitForLoadState('networkidle');

  const currentMetrics = await this.page!.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const resources = performance.getEntriesByType('resource');

    return {
      fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      resourceCount: resources.length,
    };
  });

  this.regressionCheck = {
    baseline: baselineMetrics,
    current: currentMetrics,
    fcpRegression: currentMetrics.fcp > baselineMetrics.fcp * 1.2,
    loadTimeRegression: currentMetrics.totalLoadTime > baselineMetrics.totalLoadTime * 1.2,
    resourceRegression: currentMetrics.resourceCount > baselineMetrics.resourceCount * 1.5,
  };

  console.log('Performance Regression Check:', this.regressionCheck);
});

// Then Steps - Home Page Performance Test
Then('home page should load within performance thresholds', async function (this: ICustomWorld) {
  // Assert performance thresholds
  expect(this.performanceMetrics.measuredLoadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.totalLoadTime);
  expect(this.performanceMetrics.domContentLoaded).toBeLessThan(PERFORMANCE_THRESHOLDS.domContentLoaded);
  expect(this.performanceMetrics.firstContentfulPaint).toBeLessThan(PERFORMANCE_THRESHOLDS.firstContentfulPaint);
  expect(this.performanceMetrics.resourceCount).toBeLessThan(PERFORMANCE_THRESHOLDS.maxResourceCount);
  expect(this.performanceMetrics.imageCount).toBeLessThan(PERFORMANCE_THRESHOLDS.maxImageCount);
  console.log('✅ Home page performance test passed');
});

// Then Steps - Core Web Vitals Test
Then('Core Web Vitals should meet thresholds', async function (this: ICustomWorld) {
  // Assert Core Web Vitals thresholds
  if (this.webVitals.fcp > 0) {
    expect(this.webVitals.fcp).toBeLessThan(PERFORMANCE_THRESHOLDS.firstContentfulPaint);
  }
  if (this.webVitals.lcp > 0) {
    expect(this.webVitals.lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.largestContentfulPaint);
  }
  if (this.webVitals.fid > 0) {
    expect(this.webVitals.fid).toBeLessThan(PERFORMANCE_THRESHOLDS.firstInputDelay);
  }
  if (this.webVitals.cls > 0) {
    expect(this.webVitals.cls).toBeLessThan(PERFORMANCE_THRESHOLDS.cumulativeLayoutShift);
  }
  console.log('✅ Core Web Vitals test passed');
});

// Then Steps - Admin Login Performance Test
Then('admin login page should load efficiently', async function (this: ICustomWorld) {
  expect(this.adminPerformanceMetrics.loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.totalLoadTime);
  expect(this.adminPerformanceMetrics.firstContentfulPaint).toBeLessThan(PERFORMANCE_THRESHOLDS.firstContentfulPaint);

  // Verify login form is available
  await expect(this.page!.locator('#username')).toBeVisible();
  await expect(this.page!.locator('#password')).toBeVisible();
  console.log('✅ Admin login page performance test passed');
});

// Then Steps - Resource Loading Performance Test
Then('resources should load efficiently', async function (this: ICustomWorld) {
  // Assert resource optimization
  expect(this.resourceAnalysis.totalResources).toBeLessThan(PERFORMANCE_THRESHOLDS.maxResourceCount);
  expect(this.resourceAnalysis.images).toBeLessThan(PERFORMANCE_THRESHOLDS.maxImageCount);
  expect(this.resourceAnalysis.slowResources).toBeLessThan(PERFORMANCE_THRESHOLDS.maxSlowResources);
  console.log('✅ Resource loading performance test passed');
});

// Then Steps - Navigation Interaction Performance Test
Then('navigation should respond quickly', async function (this: ICustomWorld) {
  expect(this.navigationTime).toBeLessThan(3000); // 3 seconds max
  console.log('✅ Navigation performance test passed');
});

// Then Steps - Form Interaction Performance Test
Then('form interactions should be efficient', async function (this: ICustomWorld) {
  expect(this.formTime).toBeLessThan(3000); // 3 seconds max
  console.log('✅ Form interaction performance test passed');
});

// Then Steps - Room Creation Performance Test
Then('room creation should be quick', async function (this: ICustomWorld) {
  expect(this.creationTime).toBeLessThan(5000); // 5 seconds max
  console.log('✅ Room creation performance test passed');
});

// Then Steps - Memory Usage Monitoring Test
Then('memory usage should be reasonable', async function (this: ICustomWorld) {
  // Memory increase should be reasonable (less than 50MB)
  expect(this.memoryUsage.increase).toBeLessThan(50 * 1024 * 1024);
  console.log('✅ Memory usage test passed');
});

// Then Steps - Cross-Browser Performance Test
Then('performance should be consistent across browsers', async function (this: ICustomWorld) {
  // Performance should be consistent across browsers
  expect(this.crossBrowserMetrics.loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.totalLoadTime);
  expect(this.crossBrowserMetrics.firstContentfulPaint).toBeLessThan(PERFORMANCE_THRESHOLDS.firstContentfulPaint);
  console.log('✅ Cross-browser performance test passed');
});

// Then Steps - Mobile Performance Test
Then('mobile performance should be acceptable', async function (this: ICustomWorld) {
  // Mobile performance should be acceptable (allow 1 second extra)
  expect(this.mobileMetrics.loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.totalLoadTime + 1000);
  expect(this.mobileMetrics.firstContentfulPaint).toBeLessThan(PERFORMANCE_THRESHOLDS.firstContentfulPaint + 500);

  // Verify mobile layout
  await expect(this.page!.locator('body')).toBeVisible();
  console.log('✅ Mobile performance test passed');
});

// Then Steps - Performance Regression Testing
Then('no significant performance regression should be detected', async function (this: ICustomWorld) {
  // Check for significant performance regression (20% threshold)
  expect(this.regressionCheck.current.fcp).toBeLessThan(this.regressionCheck.baseline.fcp * 1.2);
  expect(this.regressionCheck.current.totalLoadTime).toBeLessThan(this.regressionCheck.baseline.totalLoadTime * 1.2);
  expect(this.regressionCheck.current.resourceCount).toBeLessThan(this.regressionCheck.baseline.resourceCount * 1.5);
  console.log('✅ Performance regression test passed');
});