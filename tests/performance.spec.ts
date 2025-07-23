import { test, expect } from '@playwright/test';

/**
 * Performance Testing Suite
 * 
 * This test suite performs comprehensive performance testing using Playwright's
 * built-in performance monitoring capabilities, including Core Web Vitals,
 * page load metrics, and resource optimization analysis.
 */

test.describe.skip('Performance Testing', () => {
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

  test.describe('Home Page Performance', () => {
    test('should load home page within performance thresholds', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      const totalLoadTime = Date.now() - startTime;
      
      // Get detailed performance metrics
      const metrics = await page.evaluate(() => {
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
      
             console.log('Home Page Performance Metrics:', {
         measuredLoadTime: totalLoadTime,
         ...metrics
       });
      
      // Assert performance thresholds
      expect(totalLoadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.totalLoadTime);
      expect(metrics.domContentLoaded).toBeLessThan(PERFORMANCE_THRESHOLDS.domContentLoaded);
      expect(metrics.firstContentfulPaint).toBeLessThan(PERFORMANCE_THRESHOLDS.firstContentfulPaint);
      expect(metrics.resourceCount).toBeLessThan(PERFORMANCE_THRESHOLDS.maxResourceCount);
      expect(metrics.imageCount).toBeLessThan(PERFORMANCE_THRESHOLDS.maxImageCount);
    });

    test('should meet Core Web Vitals thresholds on home page', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      // Get Core Web Vitals metrics
      const webVitals = await page.evaluate(() => {
        return new Promise<{
          fcp: number;
          lcp: number;
          fid: number;
          cls: number;
        }>((resolve) => {
          const metrics: any = {
            fcp: 0,
            lcp: 0,
            fid: 0,
            cls: 0,
          };
          
          // Use Performance Observer for Core Web Vitals
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            
            entries.forEach((entry) => {
              if (entry.entryType === 'largest-contentful-paint') {
                metrics.lcp = entry.startTime;
              } else if (entry.entryType === 'first-input') {
                const firstInput = entry as any;
                metrics.fid = firstInput.processingStart - firstInput.startTime;
              } else if (entry.entryType === 'layout-shift') {
                const layoutShift = entry as any;
                metrics.cls += layoutShift.value;
              }
            });
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
          
          // Fallback: get basic metrics after timeout
          setTimeout(() => {
            const paint = performance.getEntriesByType('paint');
            metrics.fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
            resolve(metrics);
          }, 5000);
        });
      });
      
      console.log('Core Web Vitals:', webVitals);
      
      // Assert Core Web Vitals thresholds
      if (webVitals.fcp > 0) {
        expect(webVitals.fcp).toBeLessThan(PERFORMANCE_THRESHOLDS.firstContentfulPaint);
      }
      if (webVitals.lcp > 0) {
        expect(webVitals.lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.largestContentfulPaint);
      }
      if (webVitals.fid > 0) {
        expect(webVitals.fid).toBeLessThan(PERFORMANCE_THRESHOLDS.firstInputDelay);
      }
      if (webVitals.cls > 0) {
        expect(webVitals.cls).toBeLessThan(PERFORMANCE_THRESHOLDS.cumulativeLayoutShift);
      }
    });
  });

  test.describe('Admin Pages Performance', () => {
    test('should load admin login page efficiently', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(`${BASE_URL}/admin`);
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        };
      });
      
      console.log('Admin Login Performance:', {
        loadTime,
        ...metrics
      });
      
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.totalLoadTime);
      expect(metrics.firstContentfulPaint).toBeLessThan(PERFORMANCE_THRESHOLDS.firstContentfulPaint);
      
      // Verify login form is available
      await expect(page.locator('#username')).toBeVisible();
      await expect(page.locator('#password')).toBeVisible();
    });

    test('should load room management page with optimal performance', async ({ page }) => {
      // Login first
      await page.goto(`${BASE_URL}/admin`);
      await page.fill('#username', 'admin');
      await page.fill('#password', 'password');
      await page.click('#doLogin');
      await page.waitForURL('**/admin');
      
      const startTime = Date.now();
      
      // Navigate to room management
      await page.click('text=Rooms');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        };
      });
      
      console.log('Room Management Performance:', {
        loadTime,
        ...metrics
      });
      
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.totalLoadTime);
      expect(page.locator('#createRoom')).toBeVisible();
    });
  });

  test.describe('Resource Loading Performance', () => {
    test('should load resources efficiently', async ({ page }) => {
      const resourceMetrics: any[] = [];
      
      // Listen for resource loading
      page.on('response', response => {
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
      
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      // Analyze resource loading
      const imageResources = resourceMetrics.filter(r => r.contentType.startsWith('image/'));
      const scriptResources = resourceMetrics.filter(r => r.resourceType === 'script');
      const stylesheetResources = resourceMetrics.filter(r => r.resourceType === 'stylesheet');
      const slowResources = resourceMetrics.filter(r => {
        // Estimate load time based on size (rough approximation)
        const size = parseInt(r.size) || 0;
        return size > 100000; // Resources larger than 100KB
      });
      
      console.log('Resource Loading Analysis:', {
        totalResources: resourceMetrics.length,
        images: imageResources.length,
        scripts: scriptResources.length,
        stylesheets: stylesheetResources.length,
        slowResources: slowResources.length,
      });
      
      // Assert resource optimization
      expect(resourceMetrics.length).toBeLessThan(PERFORMANCE_THRESHOLDS.maxResourceCount);
      expect(imageResources.length).toBeLessThan(PERFORMANCE_THRESHOLDS.maxImageCount);
      expect(slowResources.length).toBeLessThan(PERFORMANCE_THRESHOLDS.maxSlowResources);
    });
  });

  test.describe('Interaction Performance', () => {
    test('should respond quickly to user interactions', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Test navigation interaction performance
      const navigationStart = Date.now();
      await page.click('text=Let me hack!');
      await page.waitForLoadState('networkidle');
      const navigationTime = Date.now() - navigationStart;
      
      console.log('Navigation Performance:', {
        navigationTime: `${navigationTime}ms`
      });
      
      expect(navigationTime).toBeLessThan(3000); // 3 seconds max
    });

    test('should handle form interactions efficiently', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin`);
      
      // Test form interaction performance
      const formStart = Date.now();
      await page.fill('#username', 'admin');
      await page.fill('#password', 'password');
      await page.click('#doLogin');
      await page.waitForURL('**/admin');
      const formTime = Date.now() - formStart;
      
      console.log('Form Interaction Performance:', {
        formTime: `${formTime}ms`
      });
      
      expect(formTime).toBeLessThan(3000); // 3 seconds max
    });

    test('should perform room creation operations quickly', async ({ page }) => {
      // Login first
      await page.goto(`${BASE_URL}/admin`);
      await page.fill('#username', 'admin');
      await page.fill('#password', 'password');
      await page.click('#doLogin');
      await page.waitForURL('**/admin');
      
      // Navigate to room management
      await page.click('text=Rooms');
      
      // Test room creation performance
      const creationStart = Date.now();
      await page.click('#createRoom');
      await page.fill('#roomName', '800');
      await page.fill('#roomPrice', '100');
      await page.fill('#roomDescription', 'Room for performance testing');
      await page.click('#createRoom');
      await page.waitForSelector('text=Performance Test Room');
      const creationTime = Date.now() - creationStart;
      
      console.log('Room Creation Performance:', {
        creationTime: `${creationTime}ms`
      });
      
      expect(creationTime).toBeLessThan(5000); // 5 seconds max
    });
  });

  test.describe('Memory Usage Monitoring', () => {
    test('should maintain reasonable memory usage', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        return (performance as any).memory?.usedJSHeapSize || 0;
      });
      
      // Perform some interactions
      await page.click('text=Let me hack!');
      await page.waitForLoadState('networkidle');
      
      await page.goBack();
      await page.waitForLoadState('networkidle');
      
      // Get final memory usage
      const finalMemory = await page.evaluate(() => {
        return (performance as any).memory?.usedJSHeapSize || 0;
      });
      
      const memoryIncrease = finalMemory - initialMemory;
      
      console.log('Memory Usage:', {
        initial: `${(initialMemory / 1024 / 1024).toFixed(2)}MB`,
        final: `${(finalMemory / 1024 / 1024).toFixed(2)}MB`,
        increase: `${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`
      });
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  test.describe('Cross-Browser Performance', () => {
    test('should perform consistently across browsers', async ({ page, browserName }) => {
      const startTime = Date.now();
      
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        };
      });
      
      console.log(`${browserName} Performance:`, {
        loadTime: `${loadTime}ms`,
        ...metrics
      });
      
      // Performance should be consistent across browsers
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.totalLoadTime);
      expect(metrics.firstContentfulPaint).toBeLessThan(PERFORMANCE_THRESHOLDS.firstContentfulPaint);
    });
  });

  test.describe('Mobile Performance', () => {
    test('should perform well on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      const startTime = Date.now();
      
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        };
      });
      
      console.log('Mobile Performance:', {
        loadTime: `${loadTime}ms`,
        ...metrics
      });
      
      // Mobile performance should be acceptable (allow 1 second extra)
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.totalLoadTime + 1000);
      expect(metrics.firstContentfulPaint).toBeLessThan(PERFORMANCE_THRESHOLDS.firstContentfulPaint + 500);
      
      // Test mobile navigation
      await page.click('text=Let me hack!');
      await page.waitForLoadState('networkidle');
      
      // Verify mobile layout
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Performance Regression Testing', () => {
    test('should detect performance regressions', async ({ page }) => {
      // Baseline metrics (these would typically come from a database or config)
      const baselineMetrics = {
        fcp: 1500,
        lcp: 2500,
        totalLoadTime: 3000,
        resourceCount: 30,
      };
      
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      const currentMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        const resources = performance.getEntriesByType('resource');
        
        return {
          fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
          resourceCount: resources.length,
        };
      });
      
      console.log('Performance Regression Check:', {
        baseline: baselineMetrics,
        current: currentMetrics,
        fcpRegression: currentMetrics.fcp > baselineMetrics.fcp * 1.2,
        loadTimeRegression: currentMetrics.totalLoadTime > baselineMetrics.totalLoadTime * 1.2,
        resourceRegression: currentMetrics.resourceCount > baselineMetrics.resourceCount * 1.5,
      });
      
      // Check for significant performance regression (20% threshold)
      expect(currentMetrics.fcp).toBeLessThan(baselineMetrics.fcp * 1.2);
      expect(currentMetrics.totalLoadTime).toBeLessThan(baselineMetrics.totalLoadTime * 1.2);
      expect(currentMetrics.resourceCount).toBeLessThan(baselineMetrics.resourceCount * 1.5);
    });
  });
}); 