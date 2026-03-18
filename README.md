# Playwright Node.js Tests

Playwright automation tests for the Mobifone eContract login flow, built with Node.js and organized with the Page Object Model pattern.

## Project Structure

```text
.
|-- fixtures/
|   `-- auth.fixture.js
|-- pages/
|   |-- BasePage.js
|   |-- DashboardPage.js
|   |-- ForgotPasswordPage.js
|   `-- LoginPage.js
|-- tests/
|   |-- forgot-password.spec.js
|   |-- homepage.spec.js
|   |-- login.spec.js
|   `-- navigation.spec.js
|-- utils/
|   `-- test-data.js
|-- .env.example
|-- .gitignore
|-- package.json
|-- playwright.config.js
`-- README.md
```

## Requirements

- Node.js 18+ recommended
- npm

## Setup

```bash
npm install
npx playwright install
```

## Environment Variables

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Supported variables:

- `BASE_URL`: target environment, defaults to `https://econtractdev.mobifone.ai`
- `TEST_USERNAME`: valid test username for login scenarios
- `TEST_PASSWORD`: valid test password for login scenarios

## Run Tests

```bash
npm test
npm run test:headed
npm run test:ui
npm run test:debug
npm run test:homepage
npm run test:login
npm run test:forgot-password
```

## Reports

```bash
npm run report
```

HTML reports are generated in `playwright-report/` and temporary artifacts are written to `test-results/`.

## Notes

- Successful login scenarios depend on valid credentials in `.env`.
- Some tests are intentionally skipped until stable authenticated selectors and flows are confirmed.
- The repository ignores local secrets, reports, and dependency folders by default.
