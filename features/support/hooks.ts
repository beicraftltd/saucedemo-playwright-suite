import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { Browser, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Global browser instance for better performance
let browser: Browser;

BeforeAll(async function () {
  console.log('🚀 Starting BDD Test Suite...');
  
  // Create screenshots directory if it doesn't exist
  const screenshotDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  // Launch browser once for all scenarios
  browser = await chromium.launch({ 
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0
  });
});

AfterAll(async function () {
  console.log('🏁 Finishing BDD Test Suite...');
  if (browser) {
    await browser.close();
  }
});

Before(async function (scenario) {
  console.log(`🔄 Setting up test scenario...`);
  
  // Create new context for each scenario (for isolation)
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  
  // Store scenario info for later use
  this.scenarioName = scenario.pickle.name;
});

After(async function (scenario) {
  // Take screenshot on failure
  if (scenario.result?.status === 'FAILED') {
    const screenshot = await this.page.screenshot({ 
      path: `screenshots/failed-${this.scenarioName.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`,
      fullPage: true 
    });
    
    console.log(`📸 Screenshot captured: screenshots/failed-${this.scenarioName.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`);
    
    // Attach screenshot to Cucumber report
    this.attach(screenshot, 'image/png');
  }
  
  // Clean up context
  if (this.context) {
    await this.context.close();
  }
});