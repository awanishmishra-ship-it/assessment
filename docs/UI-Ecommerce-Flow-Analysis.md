# UI E-Commerce Flow Analysis — Toolshop

**Application:** [https://practicesoftwaretesting.com/](https://practicesoftwaretesting.com/) (Sprint 5)  
**API (supporting observation):** [https://api.practicesoftwaretesting.com](https://api.practicesoftwaretesting.com)  
**Analysis date:** 23 August 2026  
**Scope:** Customer UI flows for QA Practical Assessment AC1 / AC2  
**Automation budget:** **7 UI tests** (inside the 5–8 cap)

The public HTML home page timed out from this environment (likely Cloudflare). Catalog, stock, and product names below were confirmed against the live products API (`GET /products`, 50 products, paginated). Route and form behaviour follow the official Toolshop docs and the assessment invoice rule (Confirm twice).

---

## 1. Application snapshot

Toolshop is an Angular + Bootstrap 5 storefront for hand tools. Guests can browse and search; customers register/login, manage a cart, check out, and view invoices.

| Area | Typical route |
|------|----------------|
| Catalog | `/` |
| Login | `/auth/login` |
| Register | `/auth/register` |
| Product detail | `/product/{id}` |
| Cart / checkout | cart icon → checkout steps |
| Profile | `/account/profile` |
| My Invoices | `/account/invoices` |

**Assessment constraints used as test oracles:**

- Payment: **Cash on Delivery** only for the required purchase path  
- Invoice: click **Confirm twice**  
- Smoke login: public seeded customer (avoids shared-env registration races; password not stored in this repo)

**Live catalog notes used for data:**

- Searchable in-stock example: **Claw Hammer** (Hammer category)  
- Second line item: **Combination Pliers** or **Bolt Cutters**  
- **Long Nose Pliers** currently `in_stock: false` — useful as an edge, not as Smoke data  
- List is paginated (`per_page` 9, 6 pages)

**Classification rules**

| Tag | Meaning |
|-----|---------|
| **Smoke** | Minimum confidence the store can sell: login, find a product, complete COD + invoice |
| **Regression** | Validation, negatives, registration, isolated cart math |

---

## 2. Main testable flows

### F-01 Registration (AC1)

| Scenario | Type | Class | Expected |
|----------|------|-------|----------|
| Register with unique valid data (name, DOB age 18–75, unique email, phone, address, password ≥8 with upper/lower/digit/symbol, matching confirm) | Positive | **Regression** | Account created; can log in |
| Login immediately with the new credentials | Positive | **Regression** | Authenticated session |
| Duplicate email (seeded or just-created user) | Negative | **Regression** | Error; no second account |
| Weak password / confirm mismatch | Negative | **Regression** | Form blocked with field errors |
| Age 17 or 76 | Edge | Regression | Rejected |
| Age 18 or 75 | Edge | Regression | Accepted |
| Invalid email format | Edge | Regression | Rejected |

Registration is **not** Smoke: the shared host often already has an email. Keep it Regression with a timestamped address.

### F-02 Login and profile (AC1)

| Scenario | Type | Class | Expected |
|----------|------|-------|----------|
| Login with seeded customer | Positive | **Smoke** | Header shows logged-in state |
| Open profile after login | Positive | **Smoke** (with login) or Regression | Name/email/address visible |
| Wrong password | Negative | **Regression** | Error; still logged out |
| Unknown email | Negative | Regression | Error; no session |
| My Invoices without login | Negative | Regression | Redirect to login |
| Three failed logins (lockout) | Edge | Regression | Account locked — **do not run against the seeded Smoke user** |
| Logout then hit a protected page | Edge | Regression | Login required again |

### F-03 Product browsing and search (AC2)

| Scenario | Type | Class | Expected |
|----------|------|-------|----------|
| Home lists product cards (name, price) | Positive | **Smoke** | Catalog visible |
| Search `Claw Hammer` | Positive | **Smoke** | Matching result(s) |
| Open PDP from a result | Positive | **Smoke** | Name, price, Add to cart |
| Search with no matches (`zzznomatch123`) | Negative | Regression | Empty state, no crash |
| Filter by category (e.g. Hammer) or brand | Positive | Regression | Narrowed list |
| Sort by name/price | Edge | Regression | Order changes |
| Pagination to next page | Edge | Regression | New products; page indicator updates |
| Open out-of-stock PDP (Long Nose Pliers) | Edge | Regression | Stock messaging; add-to-cart limited or blocked |

### F-04 Cart and quantity updates (AC2)

| Scenario | Type | Class | Expected |
|----------|------|-------|----------|
| Add one in-stock product from PDP | Positive | **Smoke** (inside E2E) | Badge/line item updates |
| Add a **second different** product | Positive | **Smoke** (AC2: multiple items) | Two lines |
| Increase quantity 1 → 2 | Positive | **Smoke** (AC2) or dedicated Regression | Line and subtotal recalc |
| Decrease 2 → 1 | Positive | Regression | Totals restore |
| Remove a line | Positive | Regression | Item gone; totals drop |
| Refresh with items in cart | Edge | Regression | Cart persists in session |
| Checkout with empty cart | Negative | Regression | Blocked / empty message |

### F-05 Checkout — Cash on Delivery (AC2)

| Scenario | Type | Class | Expected |
|----------|------|-------|----------|
| Logged-in checkout with COD and required billing fields | Positive | **Smoke** | Order success state |
| Order summary matches cart before submit | Positive | **Smoke** (E2E) | Names, qty, totals |
| Missing mandatory billing field | Negative | Regression | Validation; no order |
| Guest COD checkout (if enabled) | Positive | Regression | Out of 7-test budget unless swapped in |
| Place Order double-click | Edge | Regression | Single order |

### F-06 Invoice generation and verification (AC2)

| Scenario | Type | Class | Expected |
|----------|------|-------|----------|
| Click **Confirm twice** after checkout | Positive | **Smoke** | Invoice created (assessment rule) |
| New row under **My Invoices** | Positive | **Smoke** | Invoice visible |
| Invoice shows COD and line items | Positive | Regression | Matches cart |
| Confirm only once | Negative | Regression | Invoice missing or incomplete |
| Open My Invoices before second Confirm | Edge | Regression | Invoice not listed yet |

---

## 3. Smoke vs Regression map

| Flow | Smoke | Regression (documented; not all automated) |
|------|-------|--------------------------------------------|
| Registration | — | Valid register, duplicate email, password/age |
| Login & profile | Seeded login + profile visible | Invalid login, lockout, unauthenticated invoices |
| Browse & search | Catalog + search + PDP | No results, filter/sort/pagination, OOS |
| Cart & qty | Two products + qty change in E2E | Remove, empty cart, persistence |
| Checkout COD | Happy path in E2E | Missing billing, double-submit |
| Invoice | Confirm ×2 + list in E2E | Detail match, single Confirm |

---

## 4. UI automation scope — 7 tests

Fits **5–8 UI tests**. **3 Smoke**, **4 Regression**. Every required flow area is touched.

| ID | Tag | Type | Flow | What it asserts |
|----|-----|------|------|-----------------|
| **TC-UI-01** | @Smoke | Positive | F-02 | Seeded login; profile (or account menu) shows customer identity |
| **TC-UI-02** | @Smoke | Positive | F-03 | Search `Claw Hammer` → result → PDP with Add to cart |
| **TC-UI-03** | @Smoke | Positive | F-03–F-06 | Login → add **two** products → qty **2** on one line → COD checkout → **Confirm ×2** → invoice listed in My Invoices |
| **TC-UI-04** | @Regression | Positive | F-01, F-02 | Register unique email → login succeeds |
| **TC-UI-05** | @Regression | Negative | F-01 | Duplicate email rejected |
| **TC-UI-06** | @Regression | Positive | F-04 | Add product → increase qty → totals update → decrease qty |
| **TC-UI-07** | @Regression | Negative | F-02 | Wrong password → error → still logged out |

**If an 8th slot is used:** TC-UI-08 @Regression — Confirm once → invoice not in My Invoices.

### Coverage vs assessment ACs

| AC | Automated by |
|----|----------------|
| AC1 register, login, profile | TC-UI-01 (login/profile), TC-UI-04 (register), TC-UI-05 / TC-UI-07 (negatives) |
| AC2 browse, multi-item cart, qty, COD, invoices | TC-UI-02, TC-UI-03, TC-UI-06 |

### Test data

| Use | Value |
|-----|--------|
| Smoke user | public seeded customer (credentials from Toolshop docs, not this repo) |
| Register email | `qa.ui+<timestamp>@example.com` |
| Password | `Test@1234` |
| Product A | Claw Hammer (in stock) |
| Product B | Combination Pliers (in stock) |
| Payment | Cash on Delivery |
| Invoice | Confirm button **twice** |

Do **not** run invalid-login or lockout against the Smoke seeded account in the same suite run as TC-UI-01/03.

---

## 5. Risks for UI automation

| Risk | Effect | Mitigation |
|------|--------|------------|
| Cloudflare / bot check | Login or home timeout | Stable browser context; retries; avoid heavy parallel |
| Shared cart/user data | Flaky E2E | Search by name; unique register emails |
| Confirm ×2 easy to miss | False fail/pass on invoices | Explicit two clicks + wait; assert list |
| Out-of-stock SKU | Add-to-cart fail | Prefer in-stock names from API |
| Seeded lockout | Smoke red | Isolate negatives to TC-UI-07 only |

---

## 6. Out of scope for this 7-test UI slice

Admin PIM, reports, MFA, favorites, contact attachments, non-COD payments, localization, mobile app, `with-bugs` host. Those can stay in requirement/risk docs, not in the UI automation cap.
