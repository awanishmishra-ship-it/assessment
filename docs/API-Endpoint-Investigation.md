# API Endpoint Investigation — Toolshop (Sprint 5)

**Swagger UI:** [https://api.practicesoftwaretesting.com/api/documentation](https://api.practicesoftwaretesting.com/api/documentation)  
**OpenAPI source used:** [https://api.practicesoftwaretesting.com/docs?api-docs.json](https://api.practicesoftwaretesting.com/docs?api-docs.json) (OpenAPI **3.2.0**, **Toolshop API** **5.0.0**)  
**Documented server:** `https://api.practicesoftwaretesting.com`  
**Date:** 23 August 2026  
**Scope:** Contracts needed before writing API tests for registration, login, product retrieval, cart create/add/verify, and invoice generation.

This note records only fields, status codes, and auth that appear in that OpenAPI document. Undocumented behaviour is listed under **Uncertainty**, not treated as a contract.

---

## Shared authentication

`components.securitySchemes.apiAuth`:

| Item | Documented value |
|------|------------------|
| Type | HTTP |
| Scheme | `bearer` |
| Format | JWT |
| Description | Login with email and password to get the authentication token |

Operations that require auth include `"security": [{ "apiAuth": [] }]`. Operations **without** that block are documented as unauthenticated.

Header shape is implied by HTTP Bearer: `Authorization: Bearer <access_token>`. The spec does not document a cookie session for these REST calls.

---

## 1. User registration

| Item | Documented |
|------|------------|
| Method / path | `POST /users/register` |
| Auth | **Not** listed (`apiAuth` absent) |
| Request body | Required. `application/json` → `UserRequest` |
| Success | **201** → `UserResponse` |

**`UserRequest` required:** `first_name`, `last_name`, `email`, `password`.

**`UserRequest` properties (including optional):**

| Field | Type / constraints in spec |
|-------|----------------------------|
| `first_name` | string, example `John`, maxLength 40 |
| `last_name` | string, example `Doe`, maxLength 20 |
| `email` | string, format email, example `john@doe.example`, maxLength 256 |
| `password` | string, format password, minLength 8; description: “Must include uppercase, lowercase, number, and symbol”; example `SuperSecure@123` |
| `phone` | string, example `0987654321`, maxLength 24 |
| `dob` | string, format date; description: “Must be a valid date between 18 and 75 years ago”; example `1970-01-01` |
| `address` | object (not in `required`) |
| `address.street` | string, example `Street 1`, maxLength 70 |
| `address.house_number` | string, example `12`, maxLength 10 |
| `address.city` | string, example `City`, maxLength 40 |
| `address.state` | string, example `State`, maxLength 40 |
| `address.country` | string, example `Country`, maxLength 40 |
| `address.postal_code` | string, example `1234AA`, maxLength 10 |

**Documented error statuses:** **400** (description only: Bad Request), **401** (`UnauthorizedResponse`), **409** (`DuplicateConflictResponse`), **403** (description only: Forbidden).

**`UserResponse` documented properties:** `first_name`, `last_name`, `address` (street, house_number, city, state, country, postal_code), `phone`, `dob`, `email`, `id`, `provider`, `totp_enabled`, `enabled`, `failed_login_attempts`, `created_at`. Nested address fields may be string or null as listed in the schema.

---

## 2. Login

| Item | Documented |
|------|------------|
| Method / path | `POST /users/login` |
| Auth | **Not** listed |
| Request body | `application/json` → inline `AccountRequest` |
| Success | **200** → `TokenResponse` |

**`AccountRequest` required:** `email`, `password`.

| Field | Type | Example in spec |
|-------|------|-----------------|
| `email` | string | `customer@practicesoftwaretesting.com` |
| `password` | string | `welcome01` |

The login `requestBody` object does **not** set `"required": true` at the body level (unlike register). Required keys are only on the JSON schema.

**`TokenResponse` properties:** `access_token` (string), `token_type` (string, example `Bearer`), `expires_in` (number, example `120`). None are marked `required` on the schema.

**Documented error statuses:** **none** on this operation.

---

## 3. Product retrieval

### List

| Item | Documented |
|------|------------|
| Method / path | `GET /products` |
| Auth | **Not** listed |
| Body | None |
| Success | **200** → paginated object |

**Optional query parameters:** `by_brand`, `by_category`, `is_rental`, `between` (description: e.g. `price,10,30`), `sort` (description: e.g. `name,asc` / `name,desc` / `price,asc` / `price,desc`), `page` (integer).

**Paginated envelope properties:** `current_page`, `data` (array of `ProductResponse`), `from`, `last_page`, `per_page`, `to`, `total`.

**Other documented statuses:** **404**, **405**.

There is also `QUERY /products` (HTTP QUERY) with the same filter keys in a JSON body. That is not required for a GET-based retrieval test.

### Single product

| Item | Documented |
|------|------------|
| Method / path | `GET /products/{productId}` |
| Path param | `productId` (string, required) |
| Auth | **Not** listed |
| Success | **200** → `ProductResponse` |
| Other | **404**, **405** |

**`ProductResponse` properties:** `id`, `name`, `description`, `price` (number), `is_location_offer`, `is_rental`, `in_stock`, `co2_rating`, `is_eco_friendly`, `brand`, `category`, `product_image`. None are marked `required`.

---

## 4. Cart creation

| Item | Documented |
|------|------------|
| Method / path | `POST /carts` |
| Auth | **Not** listed |
| Request body | **None** in the spec |
| Success | **201** → object titled `CartCreatedResponse` |

**Success body properties:** `id` (string, example `1234`). `id` is not marked `required`.

**Other documented statuses:** **404**, **405**, **422**.

---

## 5. Adding products to cart

| Item | Documented |
|------|------------|
| Method / path | `POST /carts/{id}` |
| Path param | `id` — description “Cart ID”, string, required |
| Auth | **Not** listed |
| Request body | Required. `application/json` |
| Success | **200** → object titled `CartItemAddedResponse` |

**Body required:** `product_id`, `quantity`.

| Field | Type | Example |
|-------|------|---------|
| `product_id` | string | `01HHJC7RERZ0M3VDGS6X9HM33A` |
| `quantity` | integer | `1` |

**Success body:** `result` (string, example `item added or updated`). Not marked `required`.

**Other documented statuses:** **404**, **405**, **422**.

Related (not requested for the purchase happy path, but in the same tag): `PUT /carts/{cartId}/product/quantity` uses the same body keys; `DELETE /carts/{cartId}/product/{productId}` returns **204** (and lists **401**).

---

## 6. Cart verification

| Item | Documented |
|------|------------|
| Method / path | `GET /carts/{cartId}` |
| Path param | `cartId` (string, required; example `1`) |
| Auth | **Not** listed |
| Success | **200** → `CartResponse` |
| Other | **404**, **405** |

**`CartResponse` documented properties:** `id` (string) only. The schema has no `required` array and no cart line items, quantities, or totals.

`components.schemas.CartItemResponse` is a separate object that also only documents `id` (its title in the spec is incorrectly `"CartResponse"`).

---

## 7. Invoice generation

| Item | Documented |
|------|------------|
| Method / path | `POST /invoices` |
| Auth | **`apiAuth` required** |
| Request body | Required. `application/json` → `InvoiceRequest` |
| Success | **200** → `InvoiceResponse` |

**Other documented statuses:** **401**, **404**, **405**, **422**.

**`InvoiceRequest` required:** `billing_street`, `billing_city`, `billing_state`, `billing_country`, `billing_postal_code`, `payment_method`, `payment_details`, `cart_id`.

| Field | Documented type |
|-------|-----------------|
| `billing_street` | string |
| `billing_city` | string |
| `billing_state` | string |
| `billing_country` | string |
| `billing_postal_code` | string |
| `cart_id` | string |
| `payment_method` | string enum: `bank-transfer`, `cash-on-delivery`, `credit-card`, `buy-now-pay-later`, `gift-card` |
| `payment_details` | object, `oneOf` the payment-detail schemas |

**`payment_details` oneOf:**

- `BankTransferDetails`: `bank_name`, `account_name`, `account_number` (none required)
- `CreditCardDetails`: `credit_card_number`, `expiration_date`, `cvv`, `card_holder_name` (none required)
- `GiftCardDetails`: `gift_card_number`, `validation_code` (none required)
- `BuyNowPayLaterDetails`: `monthly_installments` (string; not required)
- `CashOnDeliveryDetails`: empty object (`type: object`, no properties); description “Placeholder for Cash on Delivery payment method”

The assessment COD path therefore has a documented body shape: enum `cash-on-delivery` plus `payment_details` as an object. The spec does **not** document example billing strings or whether an empty `{}` is accepted for COD.

**`InvoiceResponse` documented properties:** `id`, `user_id`, `invoice_date`, `invoice_number` (example `INV-2022000002`), `billing_street`, `billing_city`, `billing_country`, `billing_state`, `billing_postal_code`, `additional_discount_percentage`, `additional_discount_amount`, `subtotal`, `total`, `status` (example `COMPLETED`), `status_message`, `invoicelines` (array of `InvoiceLineResponse`), `created_at`. None marked `required`. **`payment_method` is not a documented `InvoiceResponse` property.**

**`InvoiceLineResponse` properties:** `id`, `invoice_id`, `product_id`, `unit_price`, `discount_percentage`, `discounted_price`, `quantity`, `product`.

**List (optional follow-up, not “generation”):** `GET /invoices` requires `apiAuth`, optional `page`, success **200** paginated `InvoiceResponse`.

**Guest checkout (not the authenticated assessment path):** `POST /invoices/guest` uses `InvoiceRequest` plus `guest_email`, `guest_first_name`, `guest_last_name`. Success is documented as **200**. No `apiAuth` on that operation in the snippet reviewed.

---

## Uncertainty (do not treat as contract until confirmed)

These gaps are in the published OpenAPI. Tests must not invent extra required fields or status codes from UI observation unless a later prompt explicitly allows live probing.

1. **Swagger UI vs JSON.** The HTML documentation page timed out from this environment. Contracts above come from `docs?api-docs.json`, which Swagger UI is expected to load. If the UI ever diverges, the JSON is the source used here.

2. **Login failures.** `POST /users/login` documents only **200**. Invalid credentials, lockout, and missing body are unspecified. Do not assert **401** / **422** for login from this spec.

3. **Register validation vs listed statuses.** Password/date rules are described on `UserRequest`, but **422** is **not** listed on `POST /users/register`. **400** and **403** have no response schema.

4. **Login body required flag.** The OpenAPI `requestBody` for login is not marked required at the HTTP level.

5. **Token fields.** `access_token` / `token_type` / `expires_in` are not `required` on `TokenResponse`. Tests should not fail solely because an extra undocumented field appears.

6. **`POST /invoices` success code.** Spec says **200**. The UI purchase flow previously observed **201** on invoice create. **Do not hard-code 201 from UI logs.** Confirm against this spec (**200**) or record a spec-vs-runtime mismatch after a dedicated probe.

7. **Cart GET payload.** `CartResponse` only documents `id`. Line items, product names, quantities, and totals are **not** in the schema. Cart “verification” against the spec can only assert **200** and a present `id` unless a later probe documents more fields.

8. **Cart path parameter names.** Add-item uses `{id}`; get/delete use `{cartId}`. Same resource, different OpenAPI path keys.

9. **`POST /carts` error codes.** **404** and **422** are listed with no request body. When those fire is unspecified.

10. **`CartItemAddedResponse.result`.** Only an example string is given (`item added or updated`). Exact wording is not a required enum.

11. **Invoice `payment_details` for COD.** Required field, but COD schema is an empty object. Whether `{}` is sufficient is not stated in examples.

12. **Billing values.** No examples or country/postcode format rules on `InvoiceRequest`. UI postcode-lookup constraints are **not** API documentation.

13. **Product list `in_stock`.** Typed boolean; examples use `0` / `1`. Do not assume integer vs boolean without seeing a live payload (out of scope for this note).

14. **Auth on cart mutate.** Create/add/get cart do not list `apiAuth`. Delete cart **does** list **401**. Whether a logged-in cart is bound to a user is undocumented.

15. **`expires_in` example is `120`.** Unit (seconds vs minutes) is not stated.

---

## Intended API test mapping (no tests in this prompt)

Use only documented success codes and required body keys:

| Flow | Call | Expect (documented) |
|------|------|---------------------|
| Register | `POST /users/register` + `UserRequest` required four fields (plus optional address if we send only documented keys) | 201, `UserResponse` |
| Login | `POST /users/login` + email/password | 200, `access_token` present if returned |
| Products | `GET /products` and/or `GET /products/{productId}` | 200 |
| Cart create | `POST /carts` | 201, `id` |
| Add item | `POST /carts/{id}` + `product_id`, `quantity` | 200 |
| Verify cart | `GET /carts/{cartId}` | 200, `id` (only documented field) |
| Invoice | `POST /invoices` with Bearer token + required `InvoiceRequest` including `payment_method: cash-on-delivery` | 200 per spec |

Do not add undocumented invoice fields (for example `payment_method` on the response) as assertions until they appear in OpenAPI or a later investigation records a live schema.
