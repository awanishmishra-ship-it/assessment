# AI prompts — automation and debugging

Source: Cursor chat on 23 August 2026. Playwright setup, UI/API tests, runs, and fixes.

---

## Entry

### Prompt

Set up the minimum Playwright JavaScript structure for UI and API testing. Follow Prism conventions; page objects and API helpers; testdata separate; `@smoke` / `@regression`; HTML reports; env URLs; no hardcoded credentials/tokens; no extra dependencies. Explain each modified file.

### AI Response Summary

AI added `PrismStructure-toolshop-playwright/` with `playwright.config.js` (Chromium + `api` projects, HTML reporter, `testIdAttribute: 'data-test'`), fixtures, `pages/`, `api/authApiPage.js` + `productsApiPage.js`, `utils/env.js`, `.env.example`, package scripts. Later `workers: 1` was set because the public host was flaky in parallel.

### Validation Notes

Structure only at first; tests added in later prompts.

### Changes I Made

QA engineer required Prism-style JS and `@playwright/test` only.

### Reason for Changes

Assessment specifies Playwright + Prism.

---

## Entry

### Prompt

**Prompt 8.** Implement UI tests for successful registration/login and invalid login. Unique valid user data, stable locators, explicit asserts. Tag success `@smoke`, invalid `@regression`. No fixed waits. Commit and push after each step.

### AI Response Summary

AI implemented `tests/ui/login.spec.js` (TC-UI-01, TC-UI-02) and register/login pages. First register failed: leaked password. AI switched to generated `Qa#…` password, waited on postcode lookup (not `waitForTimeout`), blurred password before submit.

### Validation Notes

After the password/postcode fix: **2 passed** (TC-UI-01, TC-UI-02) in that phase.

### Changes I Made

QA engineer required unique data and no fixed waits. Did not ask to keep `Test@1234`.

### Reason for Changes

App password policy; Angular `updateOn: 'blur'`; postcode lookup.

---

## Entry

### Prompt

**Prompt 9.** E2E UI: registered user, search, multiple products, update qty, verify cart, COD, double Confirm, My Invoices, verify invoice. Prism conventions. Tag `@smoke` and `@regression`. Commit and push.

### AI Response Summary

AI added `tests/ui/purchase.spec.js` (TC-UI-03) and cart/checkout/invoices pages. Confirm twice: first `POST /payment/check`, second `POST /invoices`. Invoice number parsed from confirmation text (`INV-\d+`). Did not overwrite postcode-lookup street/city with hardcoded NY (API 422).

### Validation Notes

Purchase journey was committed (`4f7c641` in history). Later full-suite runs passed TC-UI-03 when the host was healthy (e.g. UI project **6 passed** on the final validation pass).

### Changes I Made

QA engineer required Confirm twice as an assertion of the assessment rule, not a skipped click.

### Reason for Changes

UI AC2 invoice special rule.

---

## Entry

### Prompt

**Prompt 10.** Review UI suite; add only highest-value missing scenarios; keep 5–8 tests. Negative/edge for search, cart, or checkout. Do not duplicate E2E. Tag `@smoke` or `@regression`.

### AI Response Summary

AI added TC-UI-04 empty search, TC-UI-05 OOS add-to-cart disabled, TC-UI-06 checkout blocked if postal empty. UI total **6**.

### Validation Notes

Those three passed in isolation; full UI later **6 passed** (`npm run test:ui`).

### Changes I Made

QA engineer accepted three negatives rather than expanding past 8.

### Reason for Changes

Cap plus coverage gaps vs the happy-path purchase.

---

## Entry

### Prompt

**Prompt 11.** Review https://api.practicesoftwaretesting.com/api/documentation. Exact endpoints, bodies, auth, status codes for register, login, products, cart create/add/verify, invoice. Do not guess undocumented fields. Report uncertainty before tests. Commit and push after each prompt.

### AI Response Summary

Swagger HTML timed out; AI used OpenAPI `https://api.practicesoftwaretesting.com/docs?api-docs.json` (Toolshop API 5.0.0). Wrote `docs/API-Endpoint-Investigation.md`. Uncertainties included: login errors not documented; `CartResponse` only `id`; invoice success **200** in spec.

### Validation Notes

No API tests in this prompt. Prompt 10 UI files that were still uncommitted were committed first, then the investigation doc; both pushed.

### Changes I Made

QA engineer forbade guessing fields and required the investigation before Prompt 12.

### Reason for Changes

API tests must follow published contracts plus listed gaps.

---

## Entry

### Prompt

**Prompt 12.** Implement Playwright API lifecycle: register, login/token, products, create cart, add products, verify cart, COD invoice, validate invoice. Reusable helpers, dynamic IDs, isolated data, explicit asserts. No hardcoded IDs/tokens. `@smoke` and `@regression`.

### AI Response Summary

AI added `cartsApiPage`, `invoicesApiPage`, `postcodesApiPage`, `tests/api/lifecycle.spec.js` (TC-API-03/04/05) and tightened TC-API-01/02. Failures during implementation: login `token_type` is `bearer` not `Bearer`; products not all on page 1; invoice **422** address; then **201** not **200**. AI paginated products, case-insensitive bearer, postcode lookup, asserted **201**.

### Validation Notes

After those fixes: `npm run test:api` → **5 passed** (then still only lifecycle + products; negatives came next).

### Changes I Made

QA engineer required live status/schema asserts, not OpenAPI-only when they conflicted (201 vs 200).

### Reason for Changes

Do not invent 201 from UI logs during Prompt 11; after a real 201 body, assert 201.

---

## Entry

### Prompt

**Prompt 13.** Add high-value negative API tests; keep API suite 5–8. Consider invalid login, missing/invalid bearer, invalid product/cart ID, invalid invoice payload, missing required fields. Assert status and error body. Do not assume codes without checking API or docs.

### AI Response Summary

AI probed live errors, then added `tests/api/negative.spec.js` (TC-API-06/07/08) and expanded TC-API-02 to product **and** cart 404. Observed: invalid login **401** `{ error: "Unauthorized" }`; invoice no/invalid auth **401** `{ message: "Unauthorized" }`; empty invoice **422** field errors; unknown product/cart **404** `{ message: "Requested item not found" }`.

### Validation Notes

`npx playwright test --project=api` → **8 passed**.

### Changes I Made

QA engineer required probing before asserting login 401 (not in OpenAPI). Accepted 8 as the cap, not more.

### Reason for Changes

Prompt: do not assume status codes.

---

## Entry

### Prompt

**Prompt 14.** Run `@smoke` first. For every failure, classify (product / test / data / locator / environment), show evidence, smallest correction. Do not weaken asserts or hide failures.

### AI Response Summary

AI ran `npm run test:smoke`. **5 passed in 48.3s** (TC-UI-01, TC-UI-03, TC-API-01, TC-API-03, TC-API-05). No failures to classify. No code change.

### Validation Notes

`test-results/.last-run.json`: passed, `failedTests: []`.

### Changes I Made

None (no failure).

### Reason for Changes

N/A.

---

## Entry

### Prompt

**Prompt 15.** Analyse this Playwright failure using error, trace, screenshot, and source. Root cause, smallest reliable fix. No arbitrary timeouts, fixed waits, force clicks, or broad catch. Explain how the fix preserves the assertion.

### AI Response Summary

Last smoke run had no failure artifacts. AI ran the full suite: **14 passed in 1.1m**. Reported there was **no current failure to fix** and did not invent a patch.

### Validation Notes

`failedTests: []` before that full run; full run all green.

### Changes I Made

QA engineer’s Prompt 15 assumed a failure. None existed at that moment; no force-click or timeout was added.

### Reason for Changes

Avoid hiding non-existent failures.

---

## Entry

### Prompt

**Prompt 16.** Run complete UI and API regression. Confirm all pass; UI, API, Smoke, Regression commands work; HTML reports; no secrets in committed files; counts 5–8. Concise summary.

### AI Response Summary

AI listed tests (6 UI, 8 API, 5 smoke, 11 regression executions). First `test:ui` and `test:api` passed; then `test:smoke`/`test:regression` failed:

- TC-UI-03 / TC-UI-06: `cart-quantity` missing. Snapshot: alert **“The selected product id is invalid.”**
- TC-API-03/05: register **500** (environment under load).
- Later: `openProduct` requiring Add to cart **enabled** broke OOS TC-UI-05.
- Checkout `waitForResponse` for postcode started too late or hung (screenshot already had street/city filled).

AI then: wait for `POST /carts/{id}` before quantity assert; do not require enabled add-to-cart in `openProduct`; assert non-empty billing fields instead of a hanging lookup wait; redact `welcome01` from docs/CSV.

### Validation Notes

**Final Prompt 16 run (after those fixes):**

| Command | Result |
|---------|--------|
| `npm run test:ui` | 6 passed (30.1s) |
| `npm run test:api` | 8 passed (21.6s) |
| `npm run test:smoke` | 5 passed (39.1s) |
| `npm run test:regression` | 11 passed (51.9s) |

HTML report path: `playwright-report/index.html` (gitignored). Counts: manual 7, UI 6, API 8.

### Changes I Made

QA engineer required all four npm commands and the secrets gate. **Did not** accept weakening invoice **201**, cart quantity, or OOS disabled-button asserts. Accepted sync waits (cart POST, non-empty address) as test-defect fixes. Register **500** left as environment (assert still 201).

### Reason for Changes

Preserve oracles; fix races; meet Prompt 16 confirmation list.
