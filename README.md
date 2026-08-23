# Toolshop QA Assessment

Playwright UI and API tests plus planning artifacts for [Practice Software Testing — Toolshop](https://practicesoftwaretesting.com/) (Sprint 5).

| | |
|--|--|
| UI | https://practicesoftwaretesting.com/ |
| API | https://api.practicesoftwaretesting.com |
| OpenAPI | https://api.practicesoftwaretesting.com/api/documentation |
| Workflow notes | [project-info.md](./project-info.md) |

Suites stay inside **5–8 cases per layer**: 7 manual, 6 UI, 8 API.

---

## Prerequisites

- **Node.js** (LTS) and **npm**
- **Git**
- Network access to the public Toolshop UI and API
- Playwright **Chromium** (installed after `npm install`)

Run automation commands from `PrismStructure-toolshop-playwright/` — that is where `package.json` and `playwright.config.js` live.

---

## Installation

```powershell
cd PrismStructure-toolshop-playwright
npm install
npx playwright install chromium
```

Dev dependency: `@playwright/test` **1.62.1** (pinned in `package.json`).

---

## Configuration (no secrets in git)

Defaults in `utils/env.js` if you set nothing:

- `UI_BASE_URL` → `https://practicesoftwaretesting.com`
- `API_BASE_URL` → `https://api.practicesoftwaretesting.com`

Optional overrides (PowerShell session). **Do not** put real passwords in files you commit. `.env` is gitignored. This project does **not** load dotenv; Playwright reads the **process environment**.

```powershell
$env:UI_BASE_URL = "https://practicesoftwaretesting.com"
$env:API_BASE_URL = "https://api.practicesoftwaretesting.com"
```

`TOOLSHOP_USER_EMAIL` and `TOOLSHOP_USER_PASSWORD` are listed in `.env.example` for optional env-based login. Current specs **do not** require them: they register a unique user via `utils/dataFactory.js`. Leave those variables empty. Never commit filled `.env` files or paste tokens into README.

---

## Test data

| What | Where |
|------|--------|
| Product names and COD method | `PrismStructure-toolshop-playwright/testdata/toolshopData.js` |
| Unique users, emails, passwords | `PrismStructure-toolshop-playwright/utils/dataFactory.js` (generated at runtime) |
| Product / cart / invoice IDs and bearer tokens | From live API responses only — not hardcoded |
| Manual case data | `FunctionalTestCase.csv` |

Catalog names used in automation: Combination Pliers, Slip Joint Pliers, Long Nose Pliers (out of stock). Payment: `cash-on-delivery`.

---

## Commands

Verified against `PrismStructure-toolshop-playwright/package.json` and `playwright.config.js`.

From `PrismStructure-toolshop-playwright/`:

| npm script | What it runs | Config |
|------------|--------------|--------|
| `npm test` | All tests (`playwright test`) | Both projects |
| `npm run test:ui` | `playwright test --project=chromium` | `tests/ui/*.spec.js` |
| `npm run test:api` | `playwright test --project=api` | `tests/api/*.spec.js` |
| `npm run test:smoke` | `playwright test --grep @smoke` | UI + API tests whose titles include `@smoke` |
| `npm run test:regression` | `playwright test --grep @regression` | titles include `@regression` |
| `npm run test:list` | `playwright test --list` | print tests, do not run |
| `npm run report` | `playwright show-report` | opens last HTML report |

```powershell
cd PrismStructure-toolshop-playwright
npm test
npm run test:ui
npm run test:api
npm run test:smoke
npm run test:regression
```

PowerShell: if you call Playwright **without** npm (`npx playwright test --grep @smoke`), quote the tag (`--grep "@smoke"`) so `@smoke` is not treated as a splat. The **npm scripts already pass `@smoke` / `@regression` correctly**.

Tags in spec titles are lowercase `@smoke` and `@regression`. Some tests have both; `test:regression` can list more executions than unique case IDs.

`playwright.config.js`: `workers: 1`, Chromium `baseURL` = `UI_BASE_URL`, API `baseURL` = `API_BASE_URL`, `testIdAttribute: 'data-test'`, retries `2` on CI and `0` locally.

---

## Reports

| Artifact | Location | Git |
|----------|----------|-----|
| HTML report | `PrismStructure-toolshop-playwright/playwright-report/` (`index.html`) | ignored |
| List reporter | terminal | — |
| Failure screenshots | `PrismStructure-toolshop-playwright/test-results/` | ignored |
| Traces | `test-results/` on **first retry** (`trace: 'on-first-retry'`) | ignored |

HTML reporter: `open: 'never'` (does not auto-open a browser). After a run:

```powershell
npm run report
```

Or open `playwright-report/index.html` yourself.

---

## Repository structure

```text
.
├── FunctionalTestCase.csv          # 7 manual cases
├── project-info.md                 # QA workflow write-up
├── docs/
│   ├── QA-Practical-Assessment-Extraction.md
│   ├── Requirement-and-Risk-Analysis.md
│   ├── UI-Ecommerce-Flow-Analysis.md
│   ├── Prism-Playwright-Structure-Inspection.md
│   └── API-Endpoint-Investigation.md
└── PrismStructure-toolshop-playwright/
    ├── package.json
    ├── playwright.config.js
    ├── .env.example
    ├── api/                        # REST helpers
    ├── pages/                      # UI page objects
    ├── fixtures/testFixtures.js
    ├── testdata/toolshopData.js
    ├── utils/env.js, dataFactory.js
    └── tests/
        ├── ui/                     # 6 tests
        └── api/                    # 8 tests
```

---

## Known application behaviour

- **UI invoice:** click **Confirm twice**. First click posts payment check (“Payment was successful”). Second click creates the invoice (`POST /invoices`) and shows `INV-…`. One Confirm is not enough (manual TC-MAN-07).
- **API invoice:** one authenticated `POST /invoices`. Live success status observed as **201** (OpenAPI listed 200). Tests assert **201**.
- **Billing:** country / postcode / house number drive lookup. City must match country or the API returns **422**. Tests wait for non-empty street, city, and state rather than typing a hardcoded city.
- **Passwords:** the app rejects known leaked values (e.g. `Test@1234`). Automation uses generated `Qa#…` passwords.
- **Cart badge:** `data-test="cart-quantity"` appears after a successful add (`POST /carts/{id}`). Adding before the PDP product id is ready can show “The selected product id is invalid.”
- **Shared demo host:** registration can return **500** under load; UI `goto` can time out. Suite uses **one worker** to reduce collisions. Do not lock the public seeded customer with invalid-login retries.

---

## Troubleshooting

| Symptom | What to check |
|---------|----------------|
| `The variable '$smoke' cannot be retrieved` | PowerShell splat. Use `npm run test:smoke` or `--grep "@smoke"`. |
| Register **201** expected, got **500** | Shared API overload. Re-run; do not disable the 201 assert. |
| Invoice **422** country/city | Address did not match postcode lookup. Do not overwrite city with a fixed US city after lookup. |
| Invoice UI expected **201**, got **200** or the reverse | UI and API both use live status **201** in this suite. |
| `cart-quantity` not found | Add-to-cart did not succeed. Check the invalid product-id alert; wait for PDP name and cart POST. |
| Add to cart expected enabled, got disabled | Out-of-stock PDP (`TC-UI-05`). `openProduct` must not require the button enabled. |
| Empty search still shows products | Search may not have finished; `TC-UI-04` asserts zero `product-*` cards. |
| HTML report missing | Run a suite first, then `npm run report` from the Playwright folder. |
| Credentials error from `getUserCredentials()` | Current specs do not call this for the happy path. If you add tests that do, set env vars locally — never commit them. |

Manual cases: open `FunctionalTestCase.csv`. Planning and API contracts: `docs/`.
