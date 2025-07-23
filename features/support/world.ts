import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import { AdminLoginPage } from '../../pages/AdminLoginPage';
import { BookingPage } from '../../pages/BookingPage';
import { ContactPage } from '../../pages/ContactPage';
import { MenuPage } from '../../pages/MenuPage';

export interface ICustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  baseUrl: string;
  urlDates?: { checkIn: string; checkOut: string };
  selectedCheckInDate?: string;
  selectedCheckOutDate?: string;
  response?: any;
  bookingResponse?: any;
  messageResponse?: any;
  responses?: any[];
  responseTime?: number;
  formValues?: { name: string; email: string; phone: string; subject: string; description: string };
  validationErrors?: string[];
  performanceMetrics?: any;
  webVitals?: any;
  adminPerformanceMetrics?: any;
  roomManagementMetrics?: any;
  resourceAnalysis?: any;
  navigationTime?: number;
  formTime?: number;
  creationTime?: number;
  memoryUsage?: any;
  crossBrowserMetrics?: any;
  mobileMetrics?: any;
  regressionCheck?: any;
  adminLoginPage?: AdminLoginPage;
  bookingPage?: BookingPage;
  contactPage?: ContactPage;
  menuPage?: MenuPage;
  scrollBefore?: number;
  scrollAfter?: number;
  bookingHeader?: any;
  amenitiesHeader?: any;
  apiResponse?: any;
  apiResponses?: any[];
  navigateToPage: (path?: string) => Promise<void>;
}

export class CustomWorld extends World implements ICustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  baseUrl: string = 'https://automationintesting.online';
  urlDates?: { checkIn: string; checkOut: string };
  selectedCheckInDate?: string;
  selectedCheckOutDate?: string;
  adminLoginPage?: AdminLoginPage;
  bookingPage?: BookingPage;
  contactPage?: ContactPage;
  menuPage?: MenuPage;
  scrollBefore?: number;
  scrollAfter?: number;
  bookingHeader?: any;
  amenitiesHeader?: any;
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
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}

setWorldConstructor(CustomWorld); 