# AI prompts — test design

Source: Cursor chat on 23 August 2026. Manual design only in this file.

---

## Entry

### Prompt

Create 8 manual functional test cases for Toolshop covering registration/login, invalid login, product search, multiple products in cart, quantity update, COD checkout, invoice verification, and one edge or negative checkout. CSV columns specified. Use Smoke or Regression; positive, negative, and edge. Leave ActualResult and Status blank. Commit and push.

### AI Response Summary

AI created `FunctionalTestCase.csv` with eight IDs (`TC-MAN-01`–`08`) using the given header.

### Validation Notes

Count was 8, at the top of the 5–8 cap. Execution columns left blank as requested.

### Changes I Made

QA engineer asked for **8** cases in this prompt (the cap allows 5–8).

### Reason for Changes

Cover the listed AC2 purchase path plus invalid login and a checkout negative/edge.

---

## Entry

### Prompt

Review `FunctionalTestCase.csv` against assessment requirements: traceability, +/–/edge, Smoke/Regression, preconditions/expected, duplicates, max 5–8. List problems first, then only necessary corrections. Commit and push.

### AI Response Summary

AI reported overlap (cart + COD steps duplicated across cases) and reduced the suite to **7** cases: merged overlapping AC2 steps; added a Confirm-once edge (`TC-MAN-07`). Invalid login instructed not to use `customer@practicesoftwaretesting.com` (lockout).

### Validation Notes

Final manual count in repo: **7** (`TC-MAN-01`–`07`), inside 5–8.

### Changes I Made

QA engineer accepted the merge rather than keeping 8 overlapping cases. That is a **QA decision**; AI proposed it after the review prompt.

### Reason for Changes

Stay inside the cap and keep one Confirm-twice vs Confirm-once distinction instead of two near-duplicate purchase scripts.
