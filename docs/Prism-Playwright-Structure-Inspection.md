# Repository and Prism Playwright structure — inspection

**Inspected:** 23 August 2026  
**Remote:** https://github.com/awanishmishra-ship-it/assessment  
**HEAD:** `51f1b50`  
**Playwright / Prism code:** **not in this repository yet**  
**This commit:** documentation only — no automation files added or changed

---

## 1. What exists in *this* repository today

Observed tree:

```text
assessment/
├── FunctionalTestCase.csv
└── docs/
    ├── QA-Practical-Assessment-Extraction.md
    ├── UI-Ecommerce-Flow-Analysis.md
    └── Requirement-and-Risk-Analysis.md
```

| Convention | Observed |
|------------|----------|
| Planning docs | Markdown under `docs/` |
| Manual tests | Root `FunctionalTestCase.csv` (assessment name) |
| Tags in CSV | `@Smoke` / `@Regression` |
| Case IDs | `TC-MAN-0n` |
| Automation | No `package.json`, no `playwright.config.*`, no `pages/`, no reports |
| Cursor | No `.cursor/rules` or skills yet |

**Implication:** there is no local Prism Playwright pattern to copy. Later UI/API work must follow the **assessment-prescribed Prism layout** below, plus Playwright defaults, without inventing a second framework style.

---

## 2. Required Prism folder conventions (from the participant guide)

The guide names the automation root:

`PrismStructure(Playwright/Selenium For API+UI+ Execution Report)`

Phase tip also uses: `PrismStructure-toolshop-playwright`.

**Decision for later implementation (not done in this commit):** add a **JavaScript Playwright** project under a folder named close to the template, for example `PrismStructure-toolshop-playwright/`. Do **not** add Selenium. Keep execution reports inside that tree.

Expected shape when automation is added (do not create these files yet):

```text
PrismStructure-toolshop-playwright/
├── package.json
├── playwright.config.js
├── pages/                 # UI page objects (*Page.js)
├── api/                   # API helpers (*ApiPage.js / clients)
├── fixtures/              # test.extend wiring
├── testdata/              # users, products, invoice payloads
├── tests/
│   ├── ui/                # *.spec.js  (@Smoke / @Regression)
│   └── api/               # *.spec.js
├── utils/                 # waits, env, unique email
└── playwright-report/     # HTML (generated; gitignore except evidence copies)
```

Assessment also expects `readme.md` at repo root with Smoke vs Regression commands, and optional `.cursor` Rules/Skills.

---

## 3. Page object pattern (to follow)

Guide example: `authApiPage.js` following Prism pattern.

Rules when code is written later:

- One class per screen or API resource (`loginPage.js`, `catalogPage.js`, `cartPage.js`, `checkoutPage.js`, `invoicesPage.js`, `authApiPage.js`, `cartApiPage.js`, `invoiceApiPage.js`).
- Constructor takes Playwright `page` (UI) or `request` (API).
- Locators live in the class, not in specs.
- Methods are user actions (`login`, `searchProduct`, `addToCart`, `selectCashOnDelivery`, `confirmTwice`).
- Specs assert outcomes; page objects do not hide all `expect` if Prism samples keep assertions in tests — **prefer assertions in specs** unless the template already asserts in pages.
- UI classes: `*Page.js`. API classes: `*ApiPage.js` as in the guide.

---

## 4. Fixtures and utilities (to follow)

- Extend Playwright `test` in `fixtures/` so specs import `{ test, expect }` from the fixture, not from `@playwright/test` directly.
- Inject page objects: `loginPage`, `catalogPage`, `cartPage`, `checkoutPage`, `invoicesPage`, plus `apiRequest` or API page objects.
- Do **not** `new LoginPage(page)` in every spec if fixtures exist.
- Utilities: unique email (`qa.ui+<timestamp>@example.com`), env base URLs (`https://practicesoftwaretesting.com`, `https://api.practicesoftwaretesting.com`), clear-cart helper for the shared customer.
- Auth: Smoke UI may log in via UI page object; API tests obtain a bearer token in an API helper/fixture. Do not lock `customer@practicesoftwaretesting.com` with invalid-login tests.

---

## 5. Test-data handling (to follow)

| Kind | Pattern |
|------|---------|
| Seeded Smoke user | `customer@practicesoftwaretesting.com` / `welcome01` in testdata JSON or env — not hardcoded in every spec |
| Invalid login | `customer2@…` only |
| Registration | Unique email per run |
| Products | Search by name (`Claw Hammer`, `Combination Pliers`) — not brittle IDs |
| Invoice POST | `payment_method: cash-on-delivery`, `payment_details: {}`, runtime `cart_id` — never reuse the sample cart id from the PDF |
| Secrets | None; demo credentials only |

Manual data in `FunctionalTestCase.csv` should stay aligned with automated testdata names.

---

## 6. Tagging conventions (already used in CSV; reuse in specs)

| Tag | Use |
|-----|-----|
| `@Smoke` | Login/profile, search, E2E COD + Confirm ×2 + invoice; API login/cart/invoice happy path |
| `@Regression` | Register, duplicate/invalid login, qty isolation, billing validation, Confirm once, API ownership |

Place tags in the **test title** so `npx playwright test --grep @Smoke` works (Playwright grep on title). Cap **5–8 UI** and **5–8 API** tests including both tags.

IDs: `TC-UI-0n`, `TC-API-0n`, matching the risk analysis.

---

## 7. UI and API test execution (required for README later)

Participant guide: `npm test` smoke, then full suite. README must expose **separate Smoke and Regression commands**.

Planned scripts (not added yet):

```bash
npm test                 # full UI+API
npx playwright test --grep @Smoke
npx playwright test --grep @Regression
npx playwright test tests/ui
npx playwright test tests/api
```

Projects in `playwright.config.js`: `chromium` for UI; `api` project with `testMatch: tests/api/**` so API tests do not need a full browser where `request` is enough.

---

## 8. Report configuration (required)

- Playwright **HTML reporter** (`playwright-report/`) — open via `npx playwright show-report`.
- Optional JUnit/list for CI logs.
- Assessment: **execution reports in the repo** and **all cases Passed**. Copy a dated evidence folder (screenshots + HTML) after a green run; do not commit huge `test-results` traces by default (gitignore), but keep a small `execution-evidence/` snapshot for evaluators.
- Screenshots on failure (`screenshot: 'only-on-failure'`), trace on retry.

---

## 9. Constraints for the next automation commit

- Do not exceed 5–8 tests per layer.
- Follow this inspection; do not introduce Cucumber, Selenium, or a second POM style.
- Keep iterative git commits (this file is the structure baseline).

---

## 10. References

- [QA-Practical-Assessment-Extraction.md](./QA-Practical-Assessment-Extraction.md)  
- [UI-Ecommerce-Flow-Analysis.md](./UI-Ecommerce-Flow-Analysis.md)  
- [Requirement-and-Risk-Analysis.md](./Requirement-and-Risk-Analysis.md)  
- Playwright config/reporters: https://playwright.dev/docs/test-configuration  
- Playwright POM: https://playwright.dev/docs/pom
