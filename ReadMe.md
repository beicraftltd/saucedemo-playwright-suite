# Company House Automation Testing Project

## Quick Start

### Prerequisites
- Node.js (Version 18 or higher)
- npm (Package manager)
- Git

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/anajembu/CompanyHouse.git
   ```

2. Navigate to the project directory:
   ```bash
   cd CompanyHouse-ChrisAnajemba
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Install Playwright browsers:
   ```bash
   npm run install-browsers
   ```

5. Run tests:
   ```bash
   npm test
   ```

## Documentation

For detailed instructions, test plans, and troubleshooting information, please refer to the files in the `docs/` folder:

- **Instructions.docx** - Complete setup and usage guide
- **Test Plan.docx** - Detailed test strategy and coverage
- **Bug Reports.docx** - Known issues and bug reports

## Project Overview

This automation project tests the website https://automationintesting.online using Playwright, TypeScript, and Cucumber BDD. It includes both functional and non-functional testing covering booking, admin panel, navigation, contact forms, accessibility (WCAG 2.1), performance, and API testing.

## Framework Architecture

The framework enables complete test coverage with modular architecture, parallel execution, rich reporting, and scalable test practices using Playwright, Cucumber BDD, and TypeScript.

## Important Notes

- Main reports are contained within the `reports/` folder
- The `playwright-report/` folder only works when not running tests on BDD
- The framework supports both BDD (for non-technical stakeholders) and TDD (for pipeline execution)

## Ignored Files

The following files are ignored before committing to GitHub:

```gitignore
# Playwright
node_modules/
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```



