# Requirement and Risk Analysis — Practice Software Testing Toolshop

**Application:** Practice Software Testing — Toolshop (Sprint 5)  
**UI:** [https://practicesoftwaretesting.com/](https://practicesoftwaretesting.com/)  
**API:** [https://api.practicesoftwaretesting.com](https://api.practicesoftwaretesting.com)  
**Date:** 23 August 2026  
**Scope:** Customer journeys for QA Practical Assessment AC1 (register / login / profile) and AC2 (browse → cart → COD → invoice)  
**Suite size:** 5–8 cases per layer (manual, UI, API)

Companion: [UI-Ecommerce-Flow-Analysis.md](./UI-Ecommerce-Flow-Analysis.md)

---

## 1. Purpose

Map each major flow to a requirement (or AC), business risk, failure impact, testing priority, UI vs API coverage, and Smoke vs Regression. Extra depth is given to **authentication**, **cart state**, **checkout**, **duplicate confirmation**, and **invoice generation** — those steps decide whether a purchase is real.

---

## 2. Priority and classification

| Priority | Meaning |
|----------|---------|
| **P0** | Blocks revenue, trust, or assessment ACs — Smoke (or API Smoke) |
| **P1** | High impact — Regression |
| **P2** | Secondary — Regression or document-only inside the 5–8 cap |

| Class | Meaning |
|-------|---------|
| **Smoke** | Shop can still sell: login, find product, pay COD, see invoice |
| **Regression** | Validation, negatives, qty math, single Confirm, ownership |

---

## 3. Flow analysis

### F-01 User registration (AC1)

| Field | Detail |
|-------|--------|
| **Requirement / AC** | A visitor registers with a unique valid email, age 18–75 inclusive, and a password ≥8 characters with upper, lower, digit, and symbol. Confirm password must match. After success the same credentials log in. |
| **Business risk** | Weak rules create duplicate or invalid accounts; over-strict rules block onboarding. |
| **Failure impact** | New customers cannot start; invoice ownership and profile checks fail. |
| **Testing priority** | **P1** |
| **Recommended UI or API coverage** | **UI:** unique register + duplicate email. **API:** `POST /users/register` valid and invalid bodies. |
| **Smoke or Regression** | **Regression** (Smoke uses a seeded customer to avoid email collisions on the shared host) |

---

### F-02 Authentication — login, session, logout (special focus)

| Field | Detail |
|-------|--------|
| **Requirement / AC** | A registered user logs in with valid credentials and reaches profile and My Invoices. Invalid credentials show an error and do not create a session. After logout, protected pages require login again. |
| **Business risk** | Auth failure blocks **every** post-login step (profile, checkout as user, invoices). Weak auth can leak invoices. |
| **Failure impact** | **Critical** — AC1 and AC2 both fail. |
| **Testing priority** | **P0** |
| **Recommended UI or API coverage** | **UI:** seeded login (Smoke); wrong password (Regression). **API:** `POST /users/login`, bearer token, `GET /users/me` with and without token. |
| **Smoke or Regression** | **Smoke** valid login; **Regression** invalid login and session expiry |

| Sub-scenario | Requirement / AC | Business risk | Failure impact | Priority | UI / API | Class |
|--------------|------------------|---------------|----------------|----------|----------|-------|
| Valid login | Session or token issued | Auth outage | No purchase path | P0 | UI + API Smoke | Smoke |
| Invalid password | Error, no session | Poor security UX | Confused users; lockout if retried | P1 | UI + API Regression | Regression |
| Lockout after 3 failures | Account locked until admin unlock | Brute-force vs support load | Seeded Smoke user unusable | P1 | Manual / API only — **never** on Smoke user | Regression |
| My Invoices without login | Redirect or 401 | IDOR / data leak | Privacy incident | P0 | UI Regression + API Regression | Regression |
| Logout | Protected routes blocked | Stale session | Data left on shared PC | P1 | UI Regression | Regression |

---

### F-03 Profile view (AC1)

| Field | Detail |
|-------|--------|
| **Requirement / AC** | After login the user can see profile fields (name, email, address). Updates persist after save (optional in this cap). |
| **Business risk** | Wrong profile data is copied into billing and invoices. |
| **Failure impact** | Incorrect invoices; checkout validation failures. |
| **Testing priority** | **P2** for update; **P1** for view (AC1) |
| **Recommended UI or API coverage** | **UI:** assert profile (or account identity) after Smoke login. **API:** `GET /users/me`. |
| **Smoke or Regression** | **Smoke** view with login; **Regression** update |

---

### F-04 Product browsing and search (AC2)

| Field | Detail |
|-------|--------|
| **Requirement / AC** | Guest or customer can open the catalog, search by name (e.g. Claw Hammer), open PDP, and see name, price, Add to cart. No-match search shows empty state without crash. |
| **Business risk** | If search/catalog is down, nothing enters the cart. |
| **Failure impact** | Funnel stops at the first step; E2E never reaches checkout. |
| **Testing priority** | **P0** list/search; **P1** filter/sort |
| **Recommended UI or API coverage** | **UI:** catalog + search + PDP (Smoke). **API:** `GET /products`. |
| **Smoke or Regression** | **Smoke** list/search/PDP; **Regression** empty search, filters |

---

### F-05 Cart state (special focus)

| Field | Detail |
|-------|--------|
| **Requirement / AC** | User adds products from PDP; cart shows correct lines, quantities, and totals. Quantity can change; lines can be removed. Assessment AC2 requires **multiple items** and a **quantity update**. Empty cart must not complete checkout. Cart should persist across refresh in the same session. |
| **Business risk** | **Wrong cart state means wrong charges, lost items, or an invoice that does not match what the customer thought they bought.** |
| **Failure impact** | Under/over-charging; abandoned checkout; invoice disputes. |
| **Testing priority** | **P0** |
| **Recommended UI or API coverage** | **UI:** two products + qty in E2E Smoke; dedicated qty test in Regression. **API:** create cart, add/update items, `GET` cart by id. |
| **Smoke or Regression** | **Smoke** add + multi-item + qty in E2E; **Regression** isolated qty, remove, empty cart |

| Sub-scenario | Requirement / AC | Business risk | Failure impact | Priority | UI / API | Class |
|--------------|------------------|---------------|----------------|----------|----------|-------|
| Add one in-stock SKU | Line and badge match PDP | Wrong order content | Bad invoice lines | P0 | UI E2E + API Smoke | Smoke |
| Add second product | Two distinct lines | Partial order | Customer missing a tool | P0 | UI Smoke (AC2) + API | Smoke |
| Qty 1 → 2 | Line and subtotal recalc | **Wrong charge** | Revenue or customer loss | P0 | UI Smoke E2E + UI Regression | Smoke + Regression |
| Remove line | Item gone; totals drop | Ghost charges | Support tickets | P1 | UI Regression + API | Regression |
| Refresh | Cart still present | Lost cart | Abandoned purchase | P1 | UI Regression | Regression |
| Empty checkout | Blocked | Invalid orders | Dirty invoice data | P1 | UI Regression | Regression |
| Out-of-stock add (e.g. Long Nose Pliers) | Blocked or message | Oversell | Fulfilment failure | P1 | Document / optional | Regression |

---

### F-06 Checkout — Cash on Delivery (special focus)

| Field | Detail |
|-------|--------|
| **Requirement / AC** | From a non-empty cart the user completes checkout with **Cash on Delivery**. Mandatory billing fields are validated. Authenticated users may reuse profile billing. Success moves the UI to the confirm / invoice step. |
| **Business risk** | Checkout failure is a **full revenue-path failure**. Weak validation creates junk orders. |
| **Failure impact** | No order and no invoice; or invalid orders in the system. |
| **Testing priority** | **P0** |
| **Recommended UI or API coverage** | **UI:** logged-in COD E2E (Smoke); missing billing field (Regression, if slot remains). **API:** invoice POST with `payment_method: cash-on-delivery` and `payment_details: {}`. |
| **Smoke or Regression** | **Smoke** COD happy path; **Regression** billing validation |

| Sub-scenario | Requirement / AC | Business risk | Failure impact | Priority | UI / API | Class |
|--------------|------------------|---------------|----------------|----------|----------|-------|
| COD as logged-in user | Order accepted | Core AC2 | No sale | P0 | UI + API Smoke | Smoke |
| Summary matches cart | Names, qty, totals | Silent wrong charge | Dispute | P0 | UI Smoke E2E | Smoke |
| Missing billing field | No order | Bad data | Ops cleanup | P1 | UI / API Regression | Regression |
| Double-click Place Order | One order | Duplicate COD jobs | Two invoices | P1 | UI Regression | Regression |
| Card/BNPL instead of COD | Out of Core AC | Scope creep | Wasted suite slots | P2 | Not in 5–8 UI set | — |

---

### F-07 Duplicate confirmation (special focus)

| Field | Detail |
|-------|--------|
| **Requirement / AC** | **Assessment rule:** after checkout the user must click **Confirm twice** to generate the invoice. One click must not complete invoice generation (or must leave an incomplete state). Confirm ×2 is a **UI** step; the API uses a single invoice POST. |
| **Business risk** | Testers and customers can believe checkout succeeded while **no invoice exists**. Automation that clicks Confirm once will fail AC2 or give a false pass if it does not assert My Invoices. |
| **Failure impact** | **High** — missing proof of purchase; false-green E2E. |
| **Testing priority** | **P0** |
| **Recommended UI or API coverage** | **UI:** Confirm ×2 in Smoke E2E; single Confirm as optional 8th Regression. **API:** do not model two clicks; document UI-only. |
| **Smoke or Regression** | **Smoke** double Confirm success; **Regression** single Confirm |

| Sub-scenario | Requirement / AC | Business risk | Failure impact | Priority | UI / API | Class |
|--------------|------------------|---------------|----------------|----------|----------|-------|
| Confirm twice | Invoice created and listed | AC2 unmet | No invoice | P0 | UI Smoke only | Smoke |
| Confirm once | No (or incomplete) invoice | Silent failure | Support “where is my order?” | P0 | UI Regression (8th slot) | Regression |
| Rapid double-click | One invoice | Duplicate invoices | Reconciliation mess | P1 | UI Regression | Regression |
| Leave after first Confirm | Consistent state | Orphan checkout | Stuck orders | P1 | Manual | Regression |

---

### F-08 Invoice generation and verification (special focus)

| Field | Detail |
|-------|--------|
| **Requirement / AC** | After COD + Confirm ×2, **My Invoices** shows the new invoice. Detail should match cart lines, totals, and Cash on Delivery. A user must see **only their own** invoices. |
| **Business risk** | Missing or wrong invoices break **post-purchase trust** and assessment AC2. Cross-user invoice access is an IDOR. |
| **Failure impact** | Customer cannot prove purchase; privacy incident if IDOR. |
| **Testing priority** | **P0** |
| **Recommended UI or API coverage** | **UI:** invoice listed after E2E (Smoke). **API:** create invoice, list invoices, ownership with a second customer token. |
| **Smoke or Regression** | **Smoke** list visibility; **Regression** detail match and ownership |

| Sub-scenario | Requirement / AC | Business risk | Failure impact | Priority | UI / API | Class |
|--------------|------------------|---------------|----------------|----------|----------|-------|
| New row in My Invoices | Visible after Confirm ×2 | No proof of purchase | AC2 fail | P0 | UI Smoke | Smoke |
| Lines match cart | Qty, names, amounts | Billing dispute | Chargeback-like trust loss | P0 | API Regression (UI if slot) | Regression |
| Method = COD | Correct payment record | Wrong fulfilment | Cash vs card confusion | P1 | API / UI Regression | Regression |
| Other user’s invoice | 403/404 | **IDOR** | Data leak | P0 | **API** Regression | Regression |
| PDF download | Correct PDF | Document mismatch | P2 | Out of 7-test UI set | — |

---

### F-09 End-to-end purchase (AC2 stitch)

| Field | Detail |
|-------|--------|
| **Requirement / AC** | Browse → add **multiple** items → **update quantity** → checkout **COD** → **Confirm twice** → invoice under My Invoices. |
| **Business risk** | Modules can pass in isolation and still fail the journey. |
| **Failure impact** | **Critical** — Core UI AC2 and real revenue path. |
| **Testing priority** | **P0** |
| **Recommended UI or API coverage** | **UI:** one Smoke E2E (TC-UI-03). **API:** register/login → cart → products → add → invoice POST. |
| **Smoke or Regression** | **Smoke** |

---

## 4. Consolidated risk register

| ID | Flow | Business risk | Failure impact | Priority | Smoke | Regression |
|----|------|---------------|----------------|----------|-------|------------|
| R-01 | Authentication | Session broken or too weak | Blocks profile, checkout, invoices | P0 | Login | Invalid login |
| R-02 | Cart state | Wrong totals / lost lines | Wrong charges | P0 | Multi-add + qty in E2E | Dedicated qty test |
| R-03 | Checkout COD | Cannot place order | No revenue | P0 | COD path | Billing validation |
| R-04 | Duplicate Confirm | Invoice never created | False success | P0 | Confirm ×2 | Confirm ×1 (optional) |
| R-05 | Invoice | Missing/wrong/leaked invoice | Trust and privacy | P0 | List after E2E | API ownership |
| R-06 | Registration | Bad or duplicate accounts | Onboarding fail | P1 | — | Valid + duplicate |
| R-07 | Search | Cannot find products | Funnel blocked | P0 | Search + PDP | Empty search (docs) |
| R-08 | Shared env | Seeded lockout, Cloudflare | Flaky suite | P1 | Unique data; no lockout on Smoke user | — |

---

## 5. Traceability to assessment ACs

| AC | Flows | Smoke | Regression |
|----|-------|-------|------------|
| **UI AC1** Register, login, profile | F-01, F-02, F-03 | Login + profile | Register, duplicate email, bad password |
| **UI AC2** Browse, cart, qty, COD, invoices | F-04–F-09 | Search + E2E Confirm ×2 | Qty isolation |
| **API AC1** Register, login, token, cart | F-01, F-02, F-05 | Login + cart create | Invalid login |
| **API AC2** Products, cart, invoice COD | F-04, F-05, F-06, F-08 | Products + cart + invoice POST | Invoice ownership |

---

## 6. Coverage inside the 5–8 cap

Aligned with the UI analysis (7 UI tests). API suggestion also 7.

| ID | Layer | Class | Risk focus |
|----|-------|-------|------------|
| TC-UI-01 | UI | Smoke | Authentication |
| TC-UI-02 | UI | Smoke | Search / funnel |
| TC-UI-03 | UI | Smoke | Cart + COD + Confirm ×2 + invoice |
| TC-UI-04 | UI | Regression | Registration |
| TC-UI-05 | UI | Regression | Duplicate identity |
| TC-UI-06 | UI | Regression | Cart qty state |
| TC-UI-07 | UI | Regression | Authentication negative |
| TC-API-01 | API | Smoke | Login + `GET /users/me` |
| TC-API-02 | API | Smoke | Register + login |
| TC-API-03 | API | Smoke | Create cart + add item |
| TC-API-04 | API | Smoke | Products + cart contents |
| TC-API-05 | API | Smoke | Invoice POST COD |
| TC-API-06 | API | Regression | Invalid login |
| TC-API-07 | API | Regression | Invoice ownership |

---

## 7. References

- UI: https://practicesoftwaretesting.com/  
- API docs: https://api.practicesoftwaretesting.com/api/documentation  
- Project docs: https://testsmith-io.github.io/practice-software-testing/  
- Assessment extraction: [QA-Practical-Assessment-Extraction.md](./QA-Practical-Assessment-Extraction.md)
