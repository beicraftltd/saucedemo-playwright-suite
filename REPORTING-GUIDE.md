# BDD Framework Reporting Guide

## Overview

The BDD framework generates comprehensive reports to help you understand test results, identify issues, and track progress over time.

## **Available Reports**

### **1. HTML Report** (Primary)
- **File**: `reports/cucumber-report.html`
- **Features**: Interactive charts, step details, screenshots, execution timeline
- **Best for**: Human-readable analysis and sharing with stakeholders

### **2. JSON Report** (Data)
- **File**: `reports/cucumber-report.json`
- **Features**: Machine-readable data for CI/CD integration
- **Best for**: Automated analysis and custom reporting

### **3. Screenshots** (Visual Evidence)
- **Location**: `screenshots/failed-*.png`
- **Features**: Automatic capture on test failures
- **Best for**: Debugging failed scenarios

## **How to Generate Reports**

### **Basic Report Generation**
```bash
# Generate HTML report
npm run generate-reports

# Generate JSON report
npm run generate-reports:json

# Generate all report formats
npm run generate-reports:all
```

### **Report with Test Execution**
```bash
# Run tests and generate reports
npm test

# Run smoke tests with reports
npm run test:smoke && npm run generate-reports
```

## 👀 **How to View Reports**

### **Open HTML Report**
```bash
# Open in default browser
npm run view-reports

# Or manually
start reports/cucumber-report.html
```

### **View Screenshots**
```bash
# Open screenshots folder
npm run view-screenshots

# Or manually
start screenshots
```

## **Report Features**

### **HTML Report Includes:**
- ✅ **Test Summary**: Pass/fail statistics
- ✅ **Feature Breakdown**: Results by feature
- ✅ **Scenario Details**: Step-by-step execution
- ✅ **Execution Timeline**: Duration and timing
- ✅ **Screenshot Attachments**: Visual evidence of failures
- ✅ **Error Details**: Stack traces and error messages
- ✅ **Tag Analysis**: Results by test tags (@smoke, @critical, etc.)

### **JSON Report Includes:**
- ✅ **Raw Data**: Machine-readable test results
- ✅ **Metadata**: Environment, timing, configuration
- ✅ **Step Details**: Individual step results
- ✅ **Error Information**: Structured error data
- ✅ **CI/CD Ready**: Compatible with Jenkins, GitHub Actions, etc.

## **Customizing Reports**

### **Generate Reports for Specific Tests**
```bash
# Report for smoke tests only
cucumber-js --tags @smoke --format html:reports/smoke-report.html

# Report for specific feature
cucumber-js --grep "login" --format html:reports/login-report.html
```

### **Environment-Specific Reports**
```bash
# Headed mode reports
npm run generate-reports:headed

# Debug mode reports
DEBUG=true npm run generate-reports
```

## **Understanding Report Data**

### **Key Metrics:**
- **Scenarios**: Total number of test scenarios
- **Steps**: Total number of test steps
- **Pass Rate**: Percentage of passed tests
- **Duration**: Total execution time
- **Screenshots**: Number of failure screenshots

### **Report Sections:**
1. **Summary**: High-level statistics
2. **Features**: Results organized by feature file
3. **Scenarios**: Individual scenario results
4. **Steps**: Detailed step execution
5. **Attachments**: Screenshots and logs

## **Report Customization**

### **Add Custom Report Formats**
```javascript
// In cucumber.js
format: [
  'progress-bar',
  'html:reports/cucumber-report.html',
  'json:reports/cucumber-report.json',
  'junit:reports/cucumber-junit.xml'  // For CI systems
]
```

### **Custom Report Scripts**
```bash
# Generate report with custom name
cucumber-js --format html:reports/custom-report-$(date +%Y%m%d).html

# Generate report with tags
cucumber-js --tags @smoke --format html:reports/smoke-report.html
```

## **Troubleshooting Reports**

### **Common Issues:**

1. **Reports not generated**
   ```bash
   # Check if reports directory exists
   mkdir -p reports
   npm run generate-reports
   ```

2. **HTML report not opening**
   ```bash
   # Check file permissions
   # Try opening manually in browser
   start reports/cucumber-report.html
   ```

3. **Screenshots missing**
   ```bash
   # Check screenshots directory
   ls screenshots/
   # Ensure tests are running with proper browser setup
   ```

### **Debug Report Generation**
```bash
# Verbose output
cucumber-js --format progress-bar --format html:reports/debug-report.html --verbose
```

## **Best Practices**

### **Regular Report Generation**
```bash
# Daily reports
npm test && npm run generate-reports

# Weekly summary
cucumber-js --format html:reports/weekly-summary.html
```

### **Report Organization**
```bash
# Create dated reports
mkdir -p reports/$(date +%Y-%m-%d)
cucumber-js --format html:reports/$(date +%Y-%m-%d)/daily-report.html
```

### **CI/CD Integration**
```bash
# Generate reports for CI
cucumber-js --format json:reports/ci-report.json --format junit:reports/junit.xml
```

## **Quick Commands Reference**

| Command | Description |
|---------|-------------|
| `npm run view-reports` | Open HTML report |
| `npm run generate-reports` | Generate HTML report |
| `npm run generate-reports:json` | Generate JSON report |
| `npm run view-screenshots` | Open screenshots folder |
| `npm test && npm run generate-reports` | Run tests + generate reports |

