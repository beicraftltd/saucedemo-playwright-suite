# Step 1: Java Selenium BDD Project Structure (Exact Match)

This document outlines a Java Selenium BDD project structure that mirrors the current TypeScript/Node.js Playwright framework as closely as possible. Where direct mapping is not possible, Java conventions or equivalents are noted. All automation is now based on **Selenium WebDriver** instead of Playwright.

---

## 1. Root Structure

```
EnterpriseFramework-Java/
  ├── docs/
  ├── features/
  │     ├── accessibility.feature
  │     ├── admin-access.feature
  │     ├── api-testing.feature
  │     ├── booking.feature
  │     ├── contact-form.feature
  │     ├── navigation.feature
  │     ├── performance.feature
  │     └── step-definitions/
  │           ├── AccessibilitySteps.java
  │           ├── ApiTestingSteps.java
  │           ├── BookingSteps.java
  │           ├── CommonSteps.java
  │           ├── ContactFormSteps.java
  │           ├── NavigationSteps.java
  │           ├── PerformanceSteps.java
  │           └── support/
  │                 ├── Hooks.java
  │                 └── World.java
  ├── pages/
  │     ├── AccessibilityHelper.java
  │     ├── AccessibilityReporter.java
  │     ├── AdminLoginPage.java
  │     ├── BookingPage.java
  │     ├── ContactPage.java
  │     ├── MenuPage.java
  │     └── PerformanceHelper.java
  ├── reports/
  │     ├── cucumber-report.html
  │     ├── cucumber-report.json
  ├── screenshots/
  │     └── (failure screenshots)
  ├── test-results/
  ├── src/
  │     └── test/
  │           └── java/
  │                 └── (all test code, step definitions, hooks, pages)
  ├── pom.xml (for Maven) or build.gradle (for Gradle)
  ├── cucumber.properties
  ├── junit-platform.properties (if using JUnit 5)
  └── README.md
```

---

## 2. Directory & File Mapping

| TypeScript/Node.js                | Java Equivalent                                      |
|-----------------------------------|------------------------------------------------------|
| `features/*.feature`              | `features/*.feature` (identical)
| `features/step-definitions/*.ts`  | `features/step-definitions/*.java` (step defs)
| `features/support/*.ts`           | `features/step-definitions/support/*.java` (hooks/world)
| `pages/*.ts`                      | `pages/*.java` (Page Objects)
| `tests/*.spec.ts`                 | `src/test/java/.../*.java` (JUnit/TestNG specs)
| `playwright.config.ts`            | `src/test/resources/selenium.properties` or config in code
| `scripts/*.js`                    | Java CLI, Maven/Gradle plugins, or Groovy scripts
| `reports/`                        | `reports/` (identical, Cucumber JVM HTML/JSON, Allure)
| `screenshots/`                    | `screenshots/` (identical)
| `test-results/`                   | `test-results/` (identical)
| `package.json`                    | `pom.xml` or `build.gradle`

---

## 3. Java-Specific Notes (Selenium)
- **Step Definitions:** Java step definitions are classes with Cucumber annotations (`@Given`, `@When`, `@Then`).
- **Hooks/World:** Use `@Before`, `@After` hooks in Java. World/context can be managed via dependency injection or static/context classes.
- **Page Objects:** Java classes, similar to TS classes, using Selenium WebDriver API.
- **Test Runner:** Use JUnit or TestNG with Cucumber JVM runner class.
- **Config:** Selenium config is set in code or via properties files (e.g., browser type, grid URL).
- **Scripts:** Node.js scripts are replaced by Java CLI, Maven/Gradle plugins, or Groovy scripts.
- **WebDriver Management:** Use [WebDriverManager](https://github.com/bonigarcia/webdrivermanager) or manage drivers manually.

---

## 4. Example File Locations

- `features/accessibility.feature` → `features/accessibility.feature`
- `features/step-definitions/accessibility.steps.ts` → `features/step-definitions/AccessibilitySteps.java`
- `features/support/hooks.ts` → `features/step-definitions/support/Hooks.java`
- `pages/BookingPage.ts` → `pages/BookingPage.java`
- `tests/booking-flow.spec.ts` → `src/test/java/tests/BookingFlowTest.java`

---

## 5. Reporting
- Cucumber JVM supports HTML/JSON reports out of the box.
- For advanced reporting, use [Allure](https://docs.qameta.io/allure/) or custom Java reporting tools.

---

## 6. Build & Dependency Management
- Use **Maven** (`pom.xml`) or **Gradle** (`build.gradle`) for dependencies:
  - `io.cucumber:cucumber-java`
  - `io.cucumber:cucumber-junit` or `cucumber-testng`
  - `org.seleniumhq.selenium:selenium-java`
  - `io.github.bonigarcia:webdrivermanager` (optional, for driver management)
  - Reporting plugins as needed

---

## 7. Summary
- **Exact structure is possible with Selenium.**
- **Some scripts/configs will use Java/Maven/Gradle conventions.**
- **BDD, Page Objects, Hooks, Reporting, and test organization can be matched.**
- **Replace Playwright-specific logic with Selenium WebDriver equivalents in code.** 