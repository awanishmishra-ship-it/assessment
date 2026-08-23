# AI prompts — test data

Source: Cursor chat on 23 August 2026. Only data-related prompts and outcomes.

---

## Entry

### Prompt

(Embedded in UI Prompt 8 and later API/UI work.) Generate unique, valid user data at runtime. Do not hardcode credentials or tokens.

### AI Response Summary

AI added `utils/dataFactory.js`: unique email `qa.ui.{timestamp}.{id}@example.com`, unique last name, password `Qa#{stamp}Aa1`. Invalid login uses `invalidLoginUser()` with a generated unknown email, not the seeded demo user. Product names live in `testdata/toolshopData.js`; IDs come from `GET /products`.

### Validation Notes

First UI register attempt failed because password `Test@1234` was treated as leaked. After the generated password, registration succeeded (TC-UI-01 passed in later runs).

### Changes I Made

QA engineer required unique runtime data and no hardcoded tokens. Did not instruct storing the public demo password in automation.

### Reason for Changes

Shared Toolshop host; leaked-password rule; avoid locking the seeded customer.

---

## Entry

### Prompt

(Prompt 11 / 12.) Do not guess undocumented API fields. Do not hardcode bearer tokens, user credentials, cart IDs, product IDs, or invoice IDs.

### AI Response Summary

AI documented OpenAPI `UserRequest` / `InvoiceRequest` in `docs/API-Endpoint-Investigation.md`. Lifecycle tests extract `access_token`, `cart.id`, product `id`, invoice `id` from responses. Invoice billing uses `GET /postcode-lookup` so city matches country. COD `payment_details` sent as `{}` as in the OpenAPI COD placeholder.

### Validation Notes

Invoice with hardcoded NY city/country returned **422** (`billing_country` / city mismatch). After lookup, invoice create returned **201**. OpenAPI listed invoice success as **200**; live API returned **201**. Tests assert **201**.

### Changes I Made

QA engineer required OpenAPI-first investigation before tests. Accepting live **201** and postcode lookup was following observed API behaviour, not loosening the invoice-success assert to “any 2xx”.

### Reason for Changes

Assessment: no guessed fields; isolated data; address validation on the real API.

---

## Entry

### Prompt

(Prompt 16.) Confirm no credentials or tokens appear in code, logs, reports, or committed files.

### AI Response Summary

AI grepped the repo. Automation had no hardcoded JWTs. Public demo password `welcome01` appeared in `FunctionalTestCase.csv` and several `docs/` files. AI removed those strings. `.env` already gitignored; HTML reports gitignored. `.env.example` keeps empty `TOOLSHOP_USER_*` placeholders.

### Validation Notes

After redaction, repo grep for `welcome01` was empty. `playwright-report/` and `test-results/` remain untracked.

### Changes I Made

QA engineer required the secrets check. Accepting doc/CSV redaction was a **QA decision** so committed artifacts would not store the demo password.

### Reason for Changes

Prompt 16 gate and responsible-AI notes in `project-info.md`.
