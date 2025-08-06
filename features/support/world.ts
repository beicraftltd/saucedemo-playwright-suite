import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';

export interface ICustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  baseUrl: string;
  response?: any;
  responses?: any[];
  responseTime?: number;
  performanceMetrics?: any;
  webVitals?: any;
  navigationTime?: number;
  formTime?: number;
  creationTime?: number;
  memoryUsage?: any;
  crossBrowserMetrics?: any;
  mobileMetrics?: any;
  regressionCheck?: any;
  apiResponse?: any;
  apiResponses?: any[];
  navigateToPage: (path?: string) => Promise<void>;
}

export class CustomWorld extends World implements ICustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  baseUrl: string = 'https://www.saucedemo.com';
  apiResponse?: any;
  apiResponses?: any[];

  constructor(options: IWorldOptions) {
    super(options);
  }

  async initBrowser(browserType: 'chromium' | 'firefox' | 'webkit' = 'chromium') {
    const headed = process.env.HEADED === 'true';
    switch (browserType) {
      case 'chromium':
        this.browser = await chromium.launch({ headless: !headed });
        break;
      case 'firefox':
        this.browser = await firefox.launch({ headless: !headed });
        break;
      case 'webkit':
        this.browser = await webkit.launch({ headless: !headed });
        break;
    }
    
    this.context = await this.browser!.newContext();
    this.page = await this.context.newPage();
  }

  async closeBrowser() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  async navigateToPage(path: string = '/') {
    if (!this.page) {
      throw new Error('Browser not initialized. Call initBrowser() first.');
    }
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  async waitForPageLoad() {
    if (!this.page) {
      throw new Error('Browser not initialized. Call initBrowser() first.');
    }
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string) {
    if (!this.page) {
      throw new Error('Browser not initialized. Call initBrowser() first.');
    }
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }
}

setWorldConstructor(CustomWorld); 