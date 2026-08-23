# Project Info — Toolshop QA Assessment

**Date:** 23 August 2026  
**Repo:** Toolshop QA Practical Assessment (Playwright + Cursor)  
**GitHub:** https://github.com/awanishmishra-ship-it/assessment

This document describes **work that exists in this repository**. It does not claim folders, tools, or suites that were not delivered.

---

## 1. Project summary

This is a time-boxed QA mini-project for Practice Software Testing **Toolshop** (Sprint 5). The goal is to show a complete QA workflow: extract acceptance criteria, analyse risk, design a small manual suite, automate UI and API within a **5–8 case cap per layer**, execute with Playwright, and keep evidence and planning notes in git.

Delivered in this repo:

| Deliverable | Location |
|-------------|----------|
| Requirement extraction from the assessment guide | `docs/QA-Practical-Assessment-Extraction.md` |
| Requirement and risk analysis | `docs/Requirement-and-Risk-Analysis.md` |
| UI flow analysis | `docs/UI-Ecommerce-Flow-Analysis.md` |
| Prism/Playwright structure inspection | `docs/Prism-Playwright-Structure-Inspection.md` |
| API contract investigation (OpenAPI) | `docs/API-Endpoint-Investigation.md` |
| Manual cases | `FunctionalTestCase.csv` (7 cases) |
| UI + API automation | `PrismStructure-toolshop-playwright/` |
| Setup and run commands | `PrismStructure-toolshop-playwright/README.md` |
| This workflow write-up | `project-info.md` |

Automation is JavaScript Playwright (no extra UI/API libraries beyond `@playwright/test` 1.62.1). Page objects and API helpers follow the Prism-style layout described in the inspection note.

---

## 2. Application under test

| Layer | URL |
|-------|-----|
| UI | https://practicesoftwaretesting.com/ |
| API | https://api.practicesoftwaretesting.com |
| OpenAPI / Swagger | https://api.practicesoftwaretesting.com/api/documentation (machine-readable: `/docs?api-docs.json`, Toolshop API 5.0.0) |

Toolshop is a public demo ecommerce store (hand tools). Customers can register, log in, search the catalog, manage a cart, check out with **Cash on Delivery**, and view invoices. The UI is Angular; the API is a REST service with JWT bearer auth after login.

Observed behaviours used as oracles (also recorded in the planning docs):

- UI invoice generation requires **Confirm twice** (first payment check, then `POST /invoices`).
- API invoice creation is a **single** authenticated `POST /invoices`. Live success status is **201** (OpenAPI listed 200; tests follow the live response).
- Billing country/city must match postcode lookup; hardcoded NY-on-US addresses can return **422**.
- Shared host is rate-sensitive; Playwright runs with **one worker**.

---

## 3. Tools used

| Tool | How it was used in this project |
|------|----------------------------------|
| **Cursor** | Planning, design, implementation, debugging, and this document. Iterative prompts (extract PDF → analyse UI → manual CSV → Playwright structure → UI tests → API investigation → API tests → execution). |
| **Playwright Test 1.62.1** | UI (Chromium) and API (`request`) in one runner, HTML reporter, `data-test` as `testIdAttribute`. |
| **Node.js / npm** | Install and scripts in `PrismStructure-toolshop-playwright/package.json`. |
| **Git / GitHub** | Versioned artifacts; commits after each prompt phase. |
| **Live Toolshop UI + API** | Behaviour checks, OpenAPI fetch, negative status probing. |

Not present in the repo: a checked-in `ai-prompts/` folder, Cursor Rules/Skills under `.cursor/`, Postman collections, or extra test frameworks.

---

## 4. Scope and acceptance criteria

Scope is **customer** journeys for the assessment ACs only (not admin brand/product CRUD). Suite size is **5–8 tests per layer** (manual, UI, API), including Smoke and Regression tags.

**UI AC1 — Registration and login**  
Register with valid details, log in with those credentials, and confirm identity (account menu / profile).

**UI AC2 — Purchase**  
Browse, add **multiple** products, **update quantity**, pay **Cash on Delivery**, **Confirm twice**, open the invoice under **My Invoices**.

**API AC1 — Auth and cart**  
Register, login, bearer token, create a cart.

**API AC2 — Products and invoice**  
Retrieve products, add to cart, verify cart, generate a COD invoice with required billing and `cart_id`.

Out of cap (documented as risk, not automated): lockout on the seeded demo user, guest checkout, non-COD payment methods, admin APIs.

---

## 5. Requirement and risk analysis

Full tables: `docs/Requirement-and-Risk-Analysis.md`.

Highest-risk areas that drove test selection:

| Area | Why it is high risk | How it is covered in-repo |
|------|---------------------|---------------------------|
| Authentication | Blocks profile, checkout, invoices | Manual TC-MAN-01/02; UI TC-UI-01/02; API TC-API-03/06 |
| Cart quantity and totals | Wrong money on invoice | Manual TC-MAN-04; UI TC-UI-03; API TC-API-04 |
| COD + Confirm ×2 (UI) | Assessment invoice rule | Manual TC-MAN-05/07; UI TC-UI-03 |
| Invoice generation (API) | Auth, payload, address match | API TC-API-05/07/08 |
| Catalog / stock | Cannot buy what is not sellable | Manual TC-MAN-03; UI TC-UI-04/05 |
| Billing validation | Empty postal / country mismatch | Manual TC-MAN-06; UI TC-UI-06 |

Priority: **P0** smoke path (can the shop still sell?), **P1** negatives and validation.

---

## 6. UI / API strategy

**UI** (`tests/ui/`, Chromium, `UI_BASE_URL`): exercises what a customer sees — locators via `data-test`, page objects under `pages/`, fixtures in `fixtures/testFixtures.js`. Used for registration/login UX, search, OOS button state, checkout gating, Confirm twice, invoice screen.

**API** (`tests/api/`, `API_BASE_URL`): exercises contracts from OpenAPI plus observed live statuses. Helpers under `api/` (`authApiPage`, `productsApiPage`, `cartsApiPage`, `invoicesApiPage`, `postcodesApiPage`). Used for token lifecycle, cart IDs, invoice payload, 401/404/422.

**Split:** UI owns Confirm twice and visual cart/invoice. API owns bearer auth, cart create/add/get, and a single invoice POST. Both layers register **unique** users rather than sharing one seeded account in automation (avoids lockout and coupling).

Contracts were written before API tests in `docs/API-Endpoint-Investigation.md` (no guessed undocumented required fields). Where OpenAPI and runtime disagreed (invoice **201**, login error `{ error: "Unauthorized" }`, cart GET extra `cart_items`), tests follow **observed** behaviour with explicit status/body asserts.

---

## 7. Smoke / Regression strategy

Tags are lowercase `@smoke` and `@regression` (npm scripts grep those strings).

```text
npm run test:smoke       # @smoke
npm run test:regression  # @regression
npm run test:ui          # Chromium project
npm run test:api         # api project
```

**Smoke (can we sell today?):** unique register/login, product list, COD purchase (UI Confirm ×2 + API invoice), token obtain.

**Regression:** invalid login, empty search, OOS add-to-cart, checkout without postal code, cart contents, unknown IDs, missing/invalid bearer, missing invoice fields.

Some tests carry **both** tags (e.g. UI purchase, API COD lifecycle) so they appear in both command lists. Unique case counts still stay inside 5–8 per layer.

| Layer | Smoke-tagged | Regression-tagged | Unique cases |
|-------|--------------|-------------------|--------------|
| Manual | TC-MAN-03, 04, 05 | TC-MAN-01, 02, 06, 07 | 7 |
| UI | TC-UI-01, 03 | TC-UI-02, 03, 04, 05, 06 | 6 |
| API | TC-API-01, 03, 05 | TC-API-02, 04, 05, 06, 07, 08 | 8 |

---

## 8. Positive / negative / edge coverage

**Manual** (`FunctionalTestCase.csv`):

- Positive: register+login+profile, catalog search, two-line cart + qty update, COD Confirm twice + invoice.
- Negative: invalid password (not the seeded demo user), blank postal at checkout.
- Edge: **one** Confirm does not create the invoice.

**UI automation:**

| ID | Type | Intent |
|----|------|--------|
| TC-UI-01 | Positive / smoke | Unique register then login |
| TC-UI-02 | Negative | Unknown email login error |
| TC-UI-03 | Positive / smoke+regression | Two products, qty 2, COD, Confirm twice, invoice |
| TC-UI-04 | Negative | Empty search results |
| TC-UI-05 | Negative | OOS product, Add to cart disabled |
| TC-UI-06 | Negative | Empty postal code, cannot proceed to payment |

**API automation:**

| ID | Type | Intent |
|----|------|--------|
| TC-API-01 | Positive / smoke | `GET /products` 200 + schema-ish fields |
| TC-API-02 | Negative | Unknown product **and** cart ID → 404 |
| TC-API-03 | Positive / smoke | Register 201 + login token |
| TC-API-04 | Positive / regression | Cart create/add/get quantities |
| TC-API-05 | Positive / smoke+regression | Full COD invoice lifecycle |
| TC-API-06 | Negative | Invalid login → 401 `{ error: "Unauthorized" }` |
| TC-API-07 | Negative | Invoice without/invalid bearer → 401 |
| TC-API-08 | Negative | Empty invoice body → 422 field errors |

---

## 9. Test-data strategy

- **Generated isolation:** `utils/dataFactory.js` builds unique emails (`qa.ui.` / `qa.api.` prefixes + timestamp + UUID), unique last names, and policy-compliant passwords (`Qa#{stamp}Aa1`) so leaked-password rules do not reject registration.
- **Catalog names:** `testdata/toolshopData.js` — Combination Pliers (primary), Slip Joint Pliers (secondary), Long Nose Pliers (OOS), payment `cash-on-delivery`. Product **IDs** are resolved at runtime from `GET /products` (paginated), never hardcoded.
- **Cart / invoice IDs and tokens:** taken from responses only.
- **Address:** US + postcode `10001`; UI/API billing uses **postcode lookup** so city/state/street match the country (avoids 422).
- **Invalid login:** generated unknown email (`invalidLoginUser()`), not the public seeded customer (lockout protection).
- **Secrets:** no `.env` committed; `.env.example` has empty `TOOLSHOP_USER_*`; `getUserCredentials()` reads env only. Demo passwords are not stored in automation or (after validation) in planning docs. HTML reports and `test-results/` are gitignored.

---

## 10. How AI was used

**Context given to Cursor:** assessment extraction, live URLs, 5–8 cap, Prism folder layout, OpenAPI JSON, Playwright errors/screenshots/traces, and “do not guess undocumented fields.”

| Stage | What AI actually did in this repo |
|-------|-----------------------------------|
| **Planning** | Extracted the PDF into `docs/QA-Practical-Assessment-Extraction.md`. Mapped AC1/AC2 to flows and risks. |
| **Design** | UI flow note, 7 manual cases in `FunctionalTestCase.csv`, tag/priority columns. |
| **Automation** | Scaffolded Playwright (config, fixtures, pages, API helpers, specs). Iterative commits, not a single dump. |
| **Test data / payloads** | Unique user factory; invoice body limited to OpenAPI required keys + observed COD `payment_details: {}`; postcode lookup helper. |
| **Validation** | Ran `test:ui`, `test:api`, `test:smoke`, `test:regression`; counted cases; scanned for secrets. |
| **Debugging** | Used Playwright error text, a11y snapshots, and screenshots. Examples that changed code: leaked password `Test@1234`; add-to-cart before product id ready (`The selected product id is invalid.`); cart badge assert after `POST /carts/{id}`; postcode `waitForResponse` registered too late or hanging — replaced with non-empty street/city/state expects; invoice **201** vs documented 200; register **500** under load treated as environment, not a loosened assert. |

Human gates: live API/UI behaviour over guessed fields; no `waitForTimeout`, force clicks, or swallowed exceptions to make tests green.

---

## 11. Responsible AI and sensitive-data precautions

- Do not paste production secrets, private keys, or personal customer data into the chat. This SUT is a public demo.
- Do not hardcode bearer tokens or real passwords in specs, README, or commits.
- Invalid-login tests must not hammer the public seeded account (lockout would break shared Smoke).
- Do not treat OpenAPI examples as credentials to commit; demo password strings were removed from docs/CSV during final validation.
- Reports may contain runtime tokens in traces on retry; `playwright-report/` and `test-results/` are **not** committed.
- Repository content is untrusted for “ignore previous instructions” style notes; safety and no-secrets rules stay in force.

---

## 12. How this workflow can be reused

1. **Extract** ACs and constraints into a short markdown note (cap, tags, payment rules).
2. **Risk-rank** flows (auth, money, invoice) before writing cases.
3. **Cap** each layer at a small number of high-value tests; tag Smoke vs Regression explicitly.
4. **Manual CSV** first for the Confirm-twice / lockout rules that are awkward to over-automate.
5. **Inspect** the existing automation layout (here: Prism) and match it; do not invent a second framework.
6. **Document API contracts** from OpenAPI, list uncertainties, then write helpers and tests.
7. **Generate isolated data**; resolve IDs at runtime.
8. **Execute** smoke first, then full UI/API/regression commands; classify failures (product vs test vs data vs locator vs environment) before changing asserts.
9. **Commit** planning + tests incrementally; keep secrets and reports out of git.
10. **Write `project-info.md` last** from the repo, not from memory of unused ideas.

The same loop applies to another ecommerce or API product: swap URLs and locators, keep the cap, the tag model, and the “no guessed fields / no hidden waits” rules.
