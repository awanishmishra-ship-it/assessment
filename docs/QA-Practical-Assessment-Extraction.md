# QA Practical Assessment — Requirement Extraction

**Source:** QA AI Capability Exercise — Participant Guide (`QA Practical Assessment.pdf`)  
**Extracted:** 23 August 2026  
**SUT:** [practicesoftwaretesting.com](https://practicesoftwaretesting.com/) (UI) · [API documentation](https://api.practicesoftwaretesting.com/api/documentation)  
**Status:** Extraction only — no automation code in this commit

---

## 1. Mandatory deliverables

### Part A — AI Workflow Foundation (30%)

Submit **`project-info.md`** covering:

1. What the project is about  
2. Primary AI tool(s) used (e.g. ChatGPT, Cursor)  
3. How you provide project / SUT context to the tool  
4. How you use AI for requirement analysis  
5. How you use AI for test planning and strategy (UI vs API, smoke vs regression)  
6. How you use AI for manual test case design (functional, edge, negative, non-functional)  
7. How you use AI for automation design (framework, structure, data, reusable utilities)  
8. How you validate and refine AI-generated test cases and scripts  
9. How you use AI for test data generation, environment assumptions, and API payloads  
10. How you use AI for debugging failing tests and interpreting logs  
11. What information you avoid sharing with AI tools  
12. How you would reuse this QA workflow on a real project  

The same topics are restated later as a **`project-info.md` template** (Project Summary, Tools Used, Setup Summary).

### Part B — QA Mini Project (70%)

Submission **must include** (numbering as in the PDF):

| # in PDF | Deliverable |
|----------|-------------|
| 1 | Requirement and risk analysis specific to the application under test |
| 2 | `project-info` document (Project Info, UI, API, positive/negative/edge, Smoke/Regression) |
| 3 | Manual test suite for key flows (`FunctionalTestCase.csv`) |
| 4 | UI automation tier (e.g. Playwright) covering smoke **and** E2E/regression |
| 6 | Basic API automation tier (e.g. Playwright) covering core lifecycle APIs |
| 7 | Test data strategy (including AI-generated data) |
| 8 | Evidence of test execution: logs, reports, screenshots, or API collections |
| 10 | README with test setup and execution instructions |
| 11 | Full prompt history related to test design, automation, and debugging |
| 12 | All planning, design, testing, debugging, review, and reflection artifacts in a clear repo/folder structure |

**Also required as “complete”:**

- Execution reports; **status of all test cases should be `Passed`**
- Public Git URL
- Cursor artifacts: `.cursor` / Rules / Skills / agent or MCP (optional)
- `ai-prompts/` history files (see §5)

**Weighting:** Part A 30% · Part B 70%. A clean, well-documented Core is described as a strong result; Stretch is extra depth of evidence, not a different grading bar.

---

## 2. UI and API acceptance criteria

### UI (ecommerce Toolshop)

**AC1 — User Registration & Login**  
The user should be able to register with valid details, log in using the registered credentials, and verify their profile information successfully.

**AC2 — End-to-End Purchase Flow**  
The user should be able to browse products, add **multiple items** to the cart (including **updating quantity**), complete checkout using **Cash on Delivery**, and successfully view the generated invoice under **My Invoices**.

**Invoice special rule (stated twice):** press **Confirm twice** on the application to generate the invoice / for invoice id.

**SUT note:** “include all the possible flows that can be tested, categorize them as sanity or regression.”

### API

**AC1 — User Authentication & Cart Creation**  
A new user should be able to register via API, log in with the registered credentials, obtain a valid bearer token, and create a new cart successfully.

**AC2 — Product Selection & Invoice Generation**  
Using the bearer token, the user should be able to retrieve products, add selected products to the cart, verify cart contents, and successfully generate an invoice with the required customer and order details.

**Example invoice POST body (from the guide):**

```json
{
  "billing_street": "Zoey Shore",
  "billing_city": "Hesselbury",
  "billing_state": "Florida",
  "billing_country": "TG",
  "billing_postal_code": "1234AA",
  "payment_method": "cash-on-delivery",
  "cart_id": "01kx0dctdxxg6sm4wtt1t0nf9r",
  "payment_details": {}
}
```

### Generic “Core Acceptance Criteria (QA Perspective)”

These sit in the same document and describe a **different product shape** (tickets / comments / priorities):

1. Clear test objectives and scope from the application or tickets  
2. Traceable mapping from requirements / state machine to scenarios and cases  
3. Valid and invalid **status transitions** (manual + API for the state machine)  
4. UI tests: create, list, view, update, **comment**, search, error handling  
5. API tests: create, list, view, update, **comment**, search, error handling  
6. Test data planned (different priorities, statuses, edge titles/descriptions)  
7. At least one automation suite runnable from the README (beyond env setup)  
8. Prompt history shows thoughtful AI use, not unreviewed copy-paste  

---

## 3. Test-count restrictions

**Hard cap:** there should **not be more than 5–8 test cases of each type** (`manual` + `UI` + `API`), **which includes `@Smoke` and `@regression`**.

Interpretation used until clarified: **5–8 automated/manual cases per layer** (manual, UI, API), and those cases together must cover Smoke and Regression tags — not 5–8 Smoke plus 5–8 Regression per layer.

**Effort cap:** Core QA project is scoped for roughly **5–10 focused hours**. Do **not** expand automation surface area at the expense of lifecycle artifacts.

**Conflict with “all possible flows”:** see ambiguities section.

---

## 4. Required tools and framework

| Item | Requirement |
|------|-------------|
| Automation | **Playwright** using **Prism Framework** |
| AI | **Cursor AI**; stay within **monthly token limit** |
| Stack note | Exercise is common across Selenium, Playwright, Cypress, REST Assured, Postman, Karate — **this assignment is Playwright + Cursor** |
| Folder name in structure | `PrismStructure(Playwright/Selenium For API+UI+ Execution Report)` — Selenium is named in the tree even though the assignment text says Playwright |
| Reports | Execution reports required; all test cases **Passed** |
| README | How to run; where test data lives; **separate Smoke and Regression commands**; where reports are generated |
| Model strategy (tips) | Auto / Composer for planning & docs (~70%); Sonnet (or coding model) for page objects, specs, `playwright.config`, API helpers, hard debugging |
| Prompt style | “Caveman” — short, one task per chat; summarize chats into `ai-prompts/` |

Suggested phase flow (optional): (1) QA doc + requirements + risk, (2) manual CSV + prompt logs, (3) UI/API automation in Prism Playwright, (4) `npm test` smoke then full suite + evidence, (5) git push.

---

## 5. Submission structure

Required public Git repository (names as in the guide):

```text
qa-ai-practical-assessment/
├── FunctionalTestCase (.csv)
├── PrismStructure(Playwright/Selenium For API+UI+ Execution Report)
├── project-info.md
├── readme.md
├── ai-prompts/
│   ├── requirements-and-planning.md
│   ├── test-design.md
│   ├── automation-and-debugging.md
│   └── documentation-and-summary.md
└── .Cursor/Tool
    ├── Rules
    ├── Skills
    └── agent/mcp (Optional)
```

**Later template also lists** `ai-prompts/test-data.md` (not in the first tree).

**`ai-prompts/` entry format:** Prompt → AI Response (short summary) → Validation Notes / Debugging Outcome / Edits You Made as applicable per file.

**Git / process:**

- Submit over **public git** and share the URL  
- **Git push should not be a single commit** — iterative development and push  
- Always follow **iterative development methodology while prompting**

**Time:** self-paced within **one week**; share by the agreed submission date.

---

## 6. Important special instructions

1. This is a **capability exercise**, not a pass/fail exam. What matters is **how AI was used** (requirements, strategy, prompts, coverage decisions, debugging, reflection), not only whether scripts run.  
2. **Invoice generation:** click **Confirm twice** (UI); repeated for invoice id.  
3. Payment method for the required purchase path: **Cash on Delivery** (`cash-on-delivery` in the sample API body).  
4. Stay inside Cursor **monthly limit**; default to Auto; use premium models only for automation/debug.  
5. One focused chat per task; summarize into `ai-prompts/` after each phase.  
6. A **smaller, well-tested Core** with strong artifacts beats a large, thin suite.  
7. All reported tests should be **Passed**.  
8. At least one suite must run from the README with no extra manual steps beyond environment setup.  
9. Do not share unnecessary information with AI tools (document what you withhold).  
10. Iterative git commits/pushes — not one dump at the end.

---

## Ambiguous or conflicting requirements

| ID | Topic | What conflicts or is unclear | Suggested handling until confirmed |
|----|--------|------------------------------|-------------------------------------|
| C1 | **All flows vs 5–8 tests** | SUT section says include **all possible flows** and categorize sanity/regression. Hard cap is **5–8 cases per type**. | Analyse all flows in requirement/risk docs; **automate/manual-case only 5–8 high-value cases** per layer, tagged Smoke/Regression. |
| C2 | **Sanity vs Smoke** | Flows should be **sanity or regression**; tags/templates use **`@Smoke` / `@regression`**. | Treat Sanity ≈ Smoke unless the evaluator uses both as distinct suites. |
| C3 | **5–8 “of each type which includes @Smoke, @regression”** | Unclear if 5–8 **total per layer**, or 5–8 Smoke **plus** 5–8 Regression, or 5–8 **per tag**. | Implement **5–8 total per layer** mixing Smoke and Regression (safest reading of “includes”). |
| C4 | **Generic Core AC vs Toolshop ACs** | Core AC talks about **tickets, comments, priorities, status transitions**. Toolshop ACs are **register/login/profile** and **cart/COD/invoice**. | Treat Toolshop AC1/AC2 as the product ACs. Map generic Core items to Toolshop equivalents (e.g. invoice/cart state instead of ticket comments). |
| C5 | **UI AC2 “multiple items” vs sample API cart** | UI AC2 requires **multiple items** and qty update. API AC2 says “selected products” (plural) but the sample body is a **single `cart_id`**. | UI: at least two products and a qty change. API: add more than one product to the cart before invoice POST. |
| C6 | **Invoice Confirm ×2 vs API POST** | UI requires **two Confirm clicks**. API sample is a **single invoice POST** with no confirm step. | UI: two Confirms. API: one successful invoice create; document that Confirm×2 is UI-only. |
| C7 | **Playwright vs Selenium** | Body: **Playwright (Prism) + Cursor**. Folder template: `Playwright/Selenium`. | Use **Playwright Prism only**; keep folder name close to the template if required. |
| C8 | **Skipped deliverable numbers** | Common requirements skip **5** and **9**. | No extra mystery deliverable assumed; follow named artifacts. |
| C9 | **`project-info.md` listed twice** | Part A *is* `project-info.md`; Part B item 2 asks for `project-info` again with UI/API/Smoke fields. | One file that covers **both** the Part A workflow questions **and** Project Info / UI / API / positive-negative-edge / Smoke-Regression. |
| C10 | **`ai-prompts` file set** | First tree omits `test-data.md`; later section **requires** `test-data.md`. | Include **all five** prompt files, including `test-data.md`. |
| C11 | **`.Cursor/Tool` vs `.cursor`** | Unusual path `.Cursor/Tool` with Rules/Skills. | Follow Cursor’s real `.cursor/rules` (and skills) and note the mapping in the README. |
| C12 | **“All test cases Passed”** | Shared public SUT is flaky (Cloudflare, data mutation). Absolute Pass may be impossible for every designed negative. | Automate only stable cases; keep negatives that can pass deterministically; record environment limitations in README. |
| C13 | **Part numbering** | “It has **three parts**” then the table shows **two** (A 30%, B 70%). | Treat as two scored parts; templates/tips are not a third scored part. |
| C14 | **Part A numbering** | Two items numbered **2** (tools vs context). | Cover both; ignore duplicate numbering. |
| C15 | **Single commit forbidden vs this extraction** | Guide: do not git-push in a **single** commit. This commit is the **first** of an iterative series. | Subsequent work must be additional commits/pushes. |
| C16 | **High-level “low” example** | PDF heading: “A High Level **low** example” for API. | Typo for **flow**. |
| C17 | **Sample `cart_id` / address** | Example `cart_id` and billing fields are **illustrative**, not reusable fixtures. | Generate unique user, cart, and valid payloads at runtime. |
| C18 | **Create/list/view/update/comment** | Does not map 1:1 to Toolshop modules. | Map to catalog, cart, profile, invoices (create/list/view/update) and skip “comment” or map to contact/messages only if in the 5–8 budget. |

---

## Out of scope for this commit

No Playwright project, no test code, no CSV suite, and no `project-info.md` body beyond this extraction. Those follow in later iterative commits.
