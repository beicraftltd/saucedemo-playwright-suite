import { setDefaultTimeout, Before, After, BeforeAll, AfterAll, ITestCaseHookParameter } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { chromium, Browser } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

setDefaultTimeout(30000); // 30 seconds for all steps

let browser: Browser;

const screenshotsDir = path.join(__dirname, '../../screenshots');

// Clear screenshots before each test run
BeforeAll(async function () {
  if (fs.existsSync(screenshotsDir)) {
    fs.readdirSync(screenshotsDir).forEach(file => {
      const filePath = path.join(screenshotsDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }
  console.log('🚀 Starting BDD Test Suite...');
  const headed = process.env.HEADED === 'true';
  browser = await chromium.launch({ headless: !headed });
});

Before(async function (this: CustomWorld) {
  console.log('🔄 Setting up test scenario...');
  if (!browser) {
    const headed = process.env.HEADED === 'true';
    browser = await chromium.launch({ headless: !headed });
  }
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  await this.page.setViewportSize({ width: 1280, height: 720 });
});

// Only capture screenshots for non-API scenarios
After(async function (this: any, scenario: ITestCaseHookParameter) {
  const isApiScenario = scenario.pickle.tags.some((tag: any) => tag.name === '@api');
  if (!isApiScenario && this.page && scenario.result?.status === 'FAILED') {
    const screenshotPath = `screenshots/failed-${scenario.pickle.name.replace(/\s+/g, '-')}-${Date.now()}.png`;
    await this.page.screenshot({ path: screenshotPath });
    await this.attach(fs.readFileSync(screenshotPath), 'image/png');
    console.log(`📸 Screenshot captured: ${screenshotPath}`);
  }
});

AfterAll(async function () {
  console.log('🏁 Finishing BDD Test Suite...');
  if (browser) await browser.close();
});