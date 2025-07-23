import { Page } from '@playwright/test';

export interface CoreWebVitals {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
}

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  totalLoadTime: number;
}

export class PerformanceHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Measure Core Web Vitals with improved reliability
   */
  async measureCoreWebVitals(): Promise<CoreWebVitals> {
    try {
      const webVitals = await this.page.evaluate(() => {
        return new Promise<CoreWebVitals>((resolve) => {
          const metrics: CoreWebVitals = {
            fcp: 0,
            lcp: 0,
            fid: 0,
            cls: 0,
          };

          let metricsCollected = 0;
          const totalMetrics = 4;
          let observer: PerformanceObserver | null = null;

          const checkAndResolve = () => {
            metricsCollected++;
            if (metricsCollected >= totalMetrics) {
              if (observer) {
                observer.disconnect();
              }
              resolve(metrics);
            }
          };

          // Try to use Performance Observer for Core Web Vitals
          try {
            observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();

              entries.forEach((entry) => {
                if (entry.entryType === 'largest-contentful-paint') {
                  metrics.lcp = entry.startTime;
                  checkAndResolve();
                } else if (entry.entryType === 'first-input') {
                  const firstInput = entry as any;
                  metrics.fid = firstInput.processingStart - firstInput.startTime;
                  checkAndResolve();
                } else if (entry.entryType === 'layout-shift') {
                  const layoutShift = entry as any;
                  metrics.cls += layoutShift.value;
                  checkAndResolve();
                }
              });
            });

            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
          } catch (error) {
            console.log('Performance Observer not supported, using fallback methods');
            // If Performance Observer fails, we'll rely on fallbacks
          }

          // Get FCP from paint timing API
          const paint = performance.getEntriesByType('paint');
          const fcpEntry = paint.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            metrics.fcp = fcpEntry.startTime;
            checkAndResolve();
          } else {
            // Fallback for FCP
            setTimeout(() => {
              const paintFallback = performance.getEntriesByType('paint');
              metrics.fcp = paintFallback.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
              checkAndResolve();
            }, 1000);
          }

          // Safety timeout to ensure we always resolve
          setTimeout(() => {
            if (observer) {
              observer.disconnect();
            }
            resolve(metrics);
          }, 3000);
        });
      });

      return webVitals;
    } catch (error: any) {
      console.log('⚠️ Core Web Vitals measurement failed:', error.message);
      // Return default values if measurement fails
      return {
        fcp: 0,
        lcp: 0,
        fid: 0,
        cls: 0,
      };
    }
  }

  /**
   * Measure basic page performance metrics
   */
  async measurePagePerformance(): Promise<PerformanceMetrics> {
    try {
      const metrics = await this.page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');

        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        };
      });

      return {
        loadTime: 0, // Will be set by caller
        ...metrics
      };
    } catch (error: any) {
      console.log('⚠️ Page performance measurement failed:', error.message);
      return {
        loadTime: 0,
        domContentLoaded: 0,
        firstContentfulPaint: 0,
        totalLoadTime: 0,
      };
    }
  }

  /**
   * Analyze resource loading performance
   */
  async analyzeResourceLoading(): Promise<any> {
    const resourceMetrics: any[] = [];

    // Listen for resource loading
    this.page.on('response', response => {
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

    // Analyze resource loading
    const imageResources = resourceMetrics.filter(r => r.contentType.startsWith('image/'));
    const scriptResources = resourceMetrics.filter(r => r.resourceType === 'script');
    const stylesheetResources = resourceMetrics.filter(r => r.resourceType === 'stylesheet');
    const slowResources = resourceMetrics.filter(r => {
      const size = parseInt(r.size) || 0;
      return size > 100000; // Resources larger than 100KB
    });

    return {
      totalResources: resourceMetrics.length,
      images: imageResources.length,
      scripts: scriptResources.length,
      stylesheets: stylesheetResources.length,
      slowResources: slowResources.length,
    };
  }

  /**
   * Check if Core Web Vitals meet performance thresholds
   */
  checkCoreWebVitalsThresholds(webVitals: CoreWebVitals): {
    passed: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Core Web Vitals thresholds (Google's recommended values)
    if (webVitals.fcp > 1800) {
      issues.push(`FCP (${webVitals.fcp}ms) exceeds 1.8s threshold`);
    }
    if (webVitals.lcp > 2500) {
      issues.push(`LCP (${webVitals.lcp}ms) exceeds 2.5s threshold`);
    }
    if (webVitals.fid > 100) {
      issues.push(`FID (${webVitals.fid}ms) exceeds 100ms threshold`);
    }
    if (webVitals.cls > 0.1) {
      issues.push(`CLS (${webVitals.cls}) exceeds 0.1 threshold`);
    }

    return {
      passed: issues.length === 0,
      issues
    };
  }

  /**
   * Wait for page to be fully loaded and stable
   */
  async waitForPageStability(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    // Additional wait for any dynamic content
    await this.page.waitForTimeout(1000);
  }
} 