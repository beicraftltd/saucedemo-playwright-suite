# Sauce Demo Test Automation

A test automation framework for the Sauce Demo e-commerce website using BDD (Cucumber) and TDD (Playwright) approaches.

## Quick Start

### Prerequisites
- Node.js  (v16 or higher)
- npm

### Installation
```bash
npm install
npm run install-browsers
```

### Running Tests

**BDD Tests (Cucumber):**
```bash
npm test
```

**TDD Tests (Playwright):**
```bash
npm run test:tdd
```

**Both BDD and TDD:**
```bash
npm run test:all
```

**Headed Mode (see browser):**
```bash
npm run test:headed
npm run test:tdd:headed
```

## Test Structure

### BDD Tests (Cucumber)
- `features/login.feature` - Authentication tests
- `features/shopping-cart.feature` - Shopping cart functionality
- `features/checkout.feature` - Checkout process

### TDD Tests (Playwright)
- `tests/login.spec.ts` - Login functionality
- `tests/cart.spec.ts` - Shopping cart tests
- `tests/checkout.spec.ts` - Checkout process

## Available Commands

### Test Execution
```bash
npm test                    # Run BDD tests with report generation
npm run test:tdd           # Run TDD tests with report display
npm run test:all           # Run both BDD and TDD tests
npm run test:headed        # Run BDD tests in headed mode
npm run test:tdd:headed    # Run TDD tests in headed mode
```

### Individual Test Suites
```bash
npm run test:login         # Run login tests only
npm run test:cart          # Run cart tests only
npm run test:checkout      # Run checkout tests only
```

### Reporting
```bash
npm run view-reports       # Open BDD HTML report
npm run report             # Open Playwright HTML report
npm run view-all-reports   # Open both reports
```

### Debug Mode
```bash
npm run test:tdd:debug     # Run TDD tests in debug mode
npm run test:ui            # Run Playwright UI mode
```

## Test Coverage

### BDD Scenarios (15 total)
- **Authentication**: 5 scenarios (login, validation, locked user)
- **Shopping Cart**: 4 scenarios (add, remove, view, continue shopping)
- **Checkout**: 6 scenarios (complete flow, validation, cancel)

### TDD Tests (20+ total)
- Login functionality
- Shopping cart management
- Checkout process
- Form validation
- Error handling

## Framework Features

- **Dual Approach**: BDD for business requirements, TDD for technical validation
- **Page Object Model**: Maintainable and reusable test code
- **Cross-Browser Support**: Chrome, Firefox, Safari, Edge
- **Parallel Execution**: Fast test execution
- **Comprehensive Reporting**: HTML reports with screenshots
- **Error Handling**: Detailed failure information

## Project Structure

```
├── features/              # BDD feature files
│   ├── login.feature
│   ├── shopping-cart.feature
│   └── checkout.feature
├── tests/                 # TDD test files
│   ├── login.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
├── pages/                 # Page Object Model
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── reports/               # Test reports
└── screenshots/           # Failure screenshots
```

## Configuration

### Environment Variables
Create a `.env` file for custom configuration:
```
HEADED=false
BROWSER=chromium
WORKERS=2
```

### Browser Configuration
The framework supports multiple browsers:
- `chromium` (default)
- `firefox`
- `webkit`





