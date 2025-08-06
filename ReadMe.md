# Sauce Demo Test Automation Framework

A comprehensive test automation framework for the Sauce Demo website (https://www.saucedemo.com) using both Test-Driven Development (TDD) and Behavior-Driven Development (BDD) approaches.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Running Tests](#running-tests)
- [Viewing Results](#viewing-results)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Test Coverage](#test-coverage)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- For detailed analysis of how this framework meets assignment requirements, see [REQUIREMENTS-ANALYSIS.md](REQUIREMENTS-ANALYSIS.md).
- For reporting, see [REPORTING-GUIDE.md](REPORTING-GUIDE.md)

## Features

- **Dual Testing Approach**: Both TDD (Playwright) and BDD (Cucumber) implementations
- **Cross-Browser Testing**: Support for Chrome, Firefox, Safari, Edge, and mobile browsers
- **Accessibility Testing**: WCAG compliance and accessibility standards
- **Performance Testing**: Load time, response time, and performance metrics
- **Comprehensive Coverage**: Authentication, shopping cart, checkout
- **Page Object Model**: Clean, maintainable test structure
- **Parallel Execution**: Sharded test execution for faster results
- **Detailed Reporting**: HTML reports for both TDD and BDD tests

## Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git** (for cloning the repository)

### Step 1: Download/Clone the Repository

```bash
# Clone the repository
git clone https://github.com/beicraftltd/saucedemo-playwright-suite.git
cd saucedemo-playwright-suite

# Or download and extract the ZIP file
# Then navigate to the extracted folder
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install

# Install Playwright browsers
npm run install-browsers
```

### Step 3: Verify Installation

```bash
# Check if everything is installed correctly
npm run test:smoke
```

## Quick Start

### Run All Tests 

```bash
# Run all BDD tests
npm test

# Run all TDD tests
npm run test:tdd

# Run both BDD and TDD tests
npm test; npm run test:tdd

# Run and generate report
npm run generate-reports
```

### Run Specific Test Types

```bash
# BDD Tests (Cucumber)
npm run test:bdd

# TDD Tests (Playwright)
npm run test:tdd
```

## Running Tests

### BDD Tests (Cucumber)

#### Run All BDD Tests
```bash
npm test
```

#### Run Specific BDD Features
```bash
# Authentication tests only
npm test -- --grep "login"

# Shopping cart tests only
npm test -- --grep "cart"

# Checkout tests only
npm test -- --grep "checkout"
```

#### Run BDD Tests by Tags
```bash
# Smoke tests (critical path)
npm run test:smoke

# Debug mode (headed browser)
npm run test:debug

# Specific tags
npm test -- --tags @authentication
npm test -- --tags @shopping-cart
npm test -- --tags @checkout
```

#### Run BDD Tests in Different Modes
```bash
# Headed mode (see browser)
npm run test:headed

# Debug mode (slower, more verbose)
npm run test:debug

# BDD specific headed mode
npm run test:bdd:headed
```

### TDD Tests (Playwright)

#### Run All TDD Tests
```bash
npm run test:tdd
```

#### Run Specific TDD Test Suites
```bash
# Authentication tests
npm run test:login

# Shopping cart tests
npm run test:cart

# Checkout tests
npm run test:checkout
```

#### Run TDD Tests in Different Modes
```bash
# Headed mode (see browser)
npm run test:tdd:headed

# UI mode (interactive)
npm run test:tdd:ui

# Debug mode
npm run test:tdd:debug
```

### Sharded Testing (Parallel Execution)

#### BDD Sharded Tests
```bash
# Run all BDD shards
npm run test:bdd:shard:all

# Run specific BDD shard
npm run test:bdd:shard:1
npm run test:bdd:shard:2
npm run test:bdd:shard:3
npm run test:bdd:shard:4

# Run BDD shards in parallel
npm run test:bdd:shard:parallel
```

#### TDD Sharded Tests
```bash
# Run all TDD shards
npm run test:tdd:shard:all

# Run specific TDD shard
npm run test:tdd:shard:1
npm run test:tdd:shard:2
npm run test:tdd:shard:3

# Run TDD shards in parallel
npm run test:tdd:shard:parallel
```

## Viewing Results

### BDD Test Results

#### HTML Report (Recommended)
```bash
# Generate and open HTML report
npm run generate-reports
npm run view-reports

# Or open manually
start reports/cucumber-report.html
```

#### JSON Report
```bash
# Generate JSON report
npm run generate-reports:json

# View JSON data
cat reports/cucumber-report.json
```

#### Screenshots (on failures)
```bash
# Open screenshots folder
npm run view-screenshots

# Or manually
start screenshots
```

### TDD Test Results

#### Playwright HTML Report
```bash
# Open Playwright report
npm run report

# Or manually
start playwright-report/index.html
```

#### Test Results Folder
```bash
# View test results
start test-results

# View screenshots
start test-results/screenshots
```

### All Test Results

#### Generate All Reports
```bash
# Generate all report formats
npm run generate-reports:all

# View all reports
npm run view-reports
npm run report
```

## Project Structure

```
defra-saucedemo-test-automation/
├── features/                    # BDD Tests (Cucumber)
│   ├── login.feature           # Authentication scenarios
│   ├── shopping-cart.feature   # Cart management scenarios
│   ├── checkout.feature        # Checkout process scenarios
│   ├── step-definitions/
│   │   └── common.steps.ts     # All step definitions (can be improved on using reusable step definitions, reducong the framework size, easy scalability and maintainance)
│   └── support/
│       ├── hooks.ts            # Browser management
│       └── world.ts            # Custom world setup
├── tests/                      # TDD Tests (Playwright)
│   ├── login.spec.ts           # Authentication tests
│   ├── cart.spec.ts            # Shopping cart tests
│   └── checkout.spec.ts        # Checkout tests
├── pages/                      # Page Object Model (all page objects could also be stored in json file and integrated with reusable steps)
│   ├── LoginPage.ts            # Login page object
│   ├── ProductsPage.ts         # Products page object
│   ├── CartPage.ts             # Cart page object
│   └── CheckoutPage.ts         # Checkout page object
├── utils/
│   └── testData.ts             # Test data and constants
├── reports/                    # Test reports
│   ├── cucumber-report.html    # BDD HTML report
│   └── cucumber-report.json    # BDD JSON report
├── screenshots/                # Failure screenshots
├── playwright-report/          # TDD HTML report
├── test-results/              # TDD test results
├── package.json               # Dependencies and scripts
├── cucumber.js                # BDD configuration
├── playwright.config.ts       # TDD configuration
└── README.md                  # This file
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Browser settings
HEADLESS=false          # Set to true for headless mode
BROWSER=chromium       # chromium, firefox, webkit
SLOW_MO=1000          # Slow down execution (ms)

# Test settings
PARALLEL_WORKERS=2     # Number of parallel workers
TIMEOUT=60000          # Test timeout (ms)
RETRY=2                # Number of retries on failure

# CI/CD settings
CI=false               # Set to true in CI environment
GENERATE_REPORTS=true  # Generate reports after tests
```

### Browser Configuration

```bash
# Install specific browsers
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit

# Install all browsers
npx playwright install
```

## Test Coverage

### BDD Test Scenarios (15 total)

#### Authentication (5 scenarios)
- Successful login with valid credentials
- Failed login with invalid credentials
- Failed login with empty username
- Failed login with empty password
- Locked out user cannot login

#### Shopping Cart (4 scenarios)
- Add item to cart successfully
- View cart contents correctly
- Continue shopping from cart
- Add multiple items to cart

#### Checkout (6 scenarios)
- Complete checkout process successfully
- Checkout validation - missing first name
- Checkout validation - missing last name
- Checkout validation - missing postal code
- Cancel checkout process
- Complete checkout with multiple items

### TDD Test Suites (3 test files)

#### Authentication Tests (login.spec.ts)
- Valid login credentials
- Invalid login credentials
- Locked out user
- Empty username/password validation
- Problem user login
- Form field clearing
- Login state persistence

#### Shopping Cart Tests (cart.spec.ts)
- Add items to cart
- Remove items from cart
- View cart contents
- Continue shopping functionality
- Multiple items in cart
- Cart badge count updates
- Item details verification

#### Checkout Process Tests (checkout.spec.ts)
- Complete checkout flow
- Form validation
- Cancel checkout
- Order summary verification
- Multiple items checkout
- Order confirmation
- Form field clearing

## Troubleshooting

### Common Issues

#### 1. Browser Installation Issues
```bash
# Reinstall browsers
npx playwright install

# Install specific browser
npx playwright install chromium
```

#### 2. Test Failures
```bash
# Run in headed mode to see what's happening
npm run test:tdd:headed
npm run test:debug

# Check network connectivity
ping saucedemo.com
```

#### 3. Timeout Issues
```bash
# Increase timeout
TIMEOUT=120000 npm test

# Run with slower execution
SLOW_MO=2000 npm test
```

#### 4. Report Generation Issues
```bash
# Clear reports and regenerate
rm -rf reports/
npm run generate-reports

# Check file permissions
ls -la reports/
```

### Debug Mode

```bash
# BDD debug mode
npm run test:debug

# TDD debug mode
npm run test:tdd:debug

# UI mode (interactive)
npm run test:tdd:ui
```

### Verbose Output

```bash
# Verbose BDD output
npm test -- --verbose

# Verbose TDD output
npx playwright test --debug
```

## Contributing

### Adding New Tests

#### BDD Tests
1. Add scenarios to feature files in `features/`
2. Implement step definitions in `features/step-definitions/common.steps.ts`
3. Run tests to verify: `npm test`

#### TDD Tests
1. Add test files in `tests/`
2. Use Page Object Model from `pages/`
3. Run tests to verify: `npm run test:tdd`

### Code Style

- Follow existing naming conventions
- Use TypeScript for type safety
- Add comments for complex logic
- Update documentation when adding features

### Running Tests Before Committing

```bash
# Run all tests
npm test; npm run test:tdd

# Run smoke tests only
npm run test:smoke
```

## Quick Reference

### Essential Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all BDD tests |
| `npm run test:tdd` | Run all TDD tests |
| `npm run test:smoke` | Run critical path tests |
| `npm run test:debug` | Run in debug mode |
| `npm run generate-reports` | Generate HTML reports |
| `npm run view-reports` | Open HTML reports |
| `npm run report` | Open Playwright report |

### Test Tags

| Tag | Description |
|-----|-------------|
| `@smoke` | Critical path tests |
| `@authentication` | Login functionality |
| `@shopping-cart` | Cart management |
| `@checkout` | Checkout process |
| `@security` | Security testing |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HEADLESS` | `true` | Run in headless mode |
| `BROWSER` | `chromium` | Browser to use |
| `SLOW_MO` | `0` | Slow down execution |
| `TIMEOUT` | `60000` | Test timeout (ms) |
| `PARALLEL_WORKERS` | `2` | Parallel workers |

## Support

For issues and questions:

1. **Check the troubleshooting section** above
2. **Review test logs and reports** for error details
3. **Run in debug mode** to see what's happening
4. **Check network connectivity** to saucedemo.com
5. **Verify browser installations** are correct
6. **Contact me by commenting on my GitHub or email if you have any issues accessing, settingup or executing this assignment**





