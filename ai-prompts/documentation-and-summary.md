# AI prompts — documentation and summary

Source: Cursor chat on 23 August 2026.

---

## Entry

### Prompt

Create `project-info.md` for the Toolshop QA assessment (summary, SUT, tools, ACs, risk, UI/API, Smoke/Regression, +/–/edge, data, how AI was used, responsible AI, reuse). Describe only work actually present in the repository.

### AI Response Summary

AI wrote root `project-info.md` from existing docs, CSV, and Playwright tree. Stated there is **no** checked-in `ai-prompts/` folder, `.cursor` Rules/Skills, or Postman (true at that time). Mapped 7/6/8 cases and Cursor usage with real debug examples.

### Validation Notes

File committed as `d570d0f`. Content was later outdated on `ai-prompts/` until this documentation prompt added the folder.

### Changes I Made

QA engineer required “only work in the repo,” so unused Stretch items were omitted.

### Reason for Changes

Assessment Part A must not invent tools or suites.

---

## Entry

### Prompt

**Prompt 18.** Create README.md from the actual repository: overview, prereqs, install, config without secrets, testdata location, commands for all/UI/API/Smoke/Regression, reports, structure, known behaviour including invoice double confirmation, troubleshooting. Verify every command against `package.json` and Playwright config.

### AI Response Summary

AI added root `README.md` and shortened `PrismStructure-toolshop-playwright/README.md` to point at it. Commands copied from `package.json`: `test`, `test:ui`, `test:api`, `test:smoke`, `test:regression`, `test:list`, `report`. Documented `workers: 1`, HTML `playwright-report/`, Confirm twice vs API single POST, live invoice **201**, PowerShell `@smoke` quoting.

### Validation Notes

Scripts in README match `package.json`. Config notes match `playwright.config.js`.

### Changes I Made

QA engineer asked for a repo README verified against real scripts, not a generic Playwright template.

### Reason for Changes

Assessment deliverable 10 (README with setup and execution).

---

## Entry

### Prompt

Summarize this conversation for the appropriate ai-prompts markdown file. For each meaningful interaction use Entry / Prompt / AI Response Summary / Validation Notes / Changes I Made / Reason for Changes. Do not invent prompts, responses, validation, or results. Distinguish AI suggestions from QA-engineer decisions.

### AI Response Summary

AI split the chat across the five files required by the extraction note:

- `ai-prompts/requirements-and-planning.md`
- `ai-prompts/test-design.md`
- `ai-prompts/test-data.md`
- `ai-prompts/automation-and-debugging.md`
- `ai-prompts/documentation-and-summary.md` (this file)

Prompts are paraphrased from the user messages in the Cursor transcript (23 Aug 2026). Pass/fail numbers are from assistant-reported Playwright output in that chat. Code edits attributed to **AI** unless **Changes I Made** records a QA-engineer instruction (caps, no guessed fields, commit/push, reject weakening asserts).

### Validation Notes

This entry cannot include a Playwright run; it only records the conversation.

### Changes I Made

QA engineer asked for this prompt history in the assessment `ai-prompts/` shape, including `test-data.md` (listed in the later template).

### Reason for Changes

Deliverable: prompt history for test design, automation, and debugging, without inventing results.
