# AI prompts — requirements and planning

Source: Cursor chat on 23 August 2026 for the Toolshop QA assessment. Entries are from that conversation only. **AI** implemented repo files unless **Changes I Made** says the QA engineer directed a different choice.

---

## Entry

### Prompt

Delete everything previously pushed to GitHub (`https://github.com/awanishmishra-ship-it/assessment`).

### AI Response Summary

AI emptied remote `main` (force-push of an empty tree) and kept local work. Later work was pushed again as new commits.

### Validation Notes

Remote `main` was reset; subsequent assessment files were committed iteratively, not as a single dump.

### Changes I Made

QA engineer asked for a clean remote so the assessment repo would not contain the earlier unrelated push.

### Reason for Changes

Start the Toolshop submission on an empty `main` while keeping local copies.

---

## Entry

### Prompt

Read the QA Practical Assessment document. Extract mandatory deliverables, UI/API ACs, test-count restrictions, tools, submission structure, and special instructions. Do not create code yet. Highlight ambiguous or conflicting requirements. Commit and push.

### AI Response Summary

AI wrote `docs/QA-Practical-Assessment-Extraction.md` covering Part A/B, AC1/AC2, Confirm twice, COD, 5–8 cases per layer, Playwright + Prism + Cursor, `ai-prompts/` tree, and conflicts (e.g. “all flows” vs 5–8 cap; `test-data.md` listed later but not in the first tree).

### Validation Notes

Extraction only; no automation in that commit.

### Changes I Made

QA engineer supplied the PDF and required commit/push. Did not ask AI to generate tests in this step.

### Reason for Changes

Need a written AC source of truth before design or code.

---

## Entry

### Prompt

Analyse https://practicesoftwaretesting.com/ as a QA engineer. Identify testable ecommerce flows (register, login/profile, browse/search, cart/qty, COD checkout, invoice). Categorize Smoke vs Regression; include positive, negative, and edge. Keep scope suitable for 5–8 UI automated tests. Commit and push.

### AI Response Summary

AI wrote `docs/UI-Ecommerce-Flow-Analysis.md`. Public HTML timed out from the environment; catalog names were checked via `GET /products`. Documented Confirm twice, COD, and a 7-UI-test budget.

### Validation Notes

Flow list is analysis, not executed UI tests.

### Changes I Made

QA engineer accepted a planning doc rather than immediate UI scripts.

### Reason for Changes

Assessment requires flow analysis before automation.

---

## Entry

### Prompt

Create requirement and risk analysis for Toolshop. For each major flow: AC, business risk, failure impact, priority, UI or API coverage, Smoke/Regression. Emphasise auth, cart, checkout, duplicate confirmation, and invoice. Commit and push.

### AI Response Summary

AI wrote `docs/Requirement-and-Risk-Analysis.md` with flow tables (F-01 onward), P0/P1, and UI vs API recommendations. Companion link to the UI flow note.

### Validation Notes

Planning artifact only.

### Changes I Made

QA engineer kept risk analysis as a separate committed file (assessment deliverable 1).

### Reason for Changes

Traceability from ACs to later 5–8 cases per layer.

---

## Entry

### Prompt

Inspect the existing repository and Prism Playwright structure. Explain folders, page objects, fixtures, testdata, tags, UI/API execution, reports. Follow existing patterns. Do not modify files yet. Commit and push.

### AI Response Summary

AI wrote `docs/Prism-Playwright-Structure-Inspection.md`. At that time Playwright tests did not exist yet; the note recorded Prism conventions to copy (JS, page objects, fixtures, HTML report, tags).

### Validation Notes

Inspection was read-only as requested.

### Changes I Made

QA engineer forbade code changes in this step.

### Reason for Changes

Match Prism instead of inventing a second framework.
