# Toolshop Playwright tests

Minimal JavaScript structure for UI and API testing with Playwright's test runner,
Prism-style page objects, API helper classes, and fixture injection.

## Setup

```powershell
npm install
npx playwright install chromium
```

Set URLs when overriding the public defaults and provide credentials only through
the process environment:

```powershell
$env:UI_BASE_URL = "https://practicesoftwaretesting.com"
$env:API_BASE_URL = "https://api.practicesoftwaretesting.com"
$env:TOOLSHOP_USER_EMAIL = "<test-user-email>"
$env:TOOLSHOP_USER_PASSWORD = "<test-user-password>"
```

`.env.example` documents supported names. This project intentionally does not add a
dotenv dependency; Playwright reads variables from the process environment.

## Run

```powershell
npm test
npm run test:ui
npm run test:api
npm run test:smoke
npm run test:regression
npm run report
```

HTML output is generated under `playwright-report/`. Failure screenshots and retry
traces are generated under `test-results/`. Both are ignored by Git.
