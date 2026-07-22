# AI Workflow

## 1. Primary AI Tool Used

Cursor — used across requirement analysis, planning, implementation, testing, debugging, code review, and documentation.

## 2. How I Provide Project Context

- Shared the assessment PDF and phase-wise plan as initial context
- Maintained `tool-specific/cursor-workflow/project-context.md` with stack, constraints, and state machine rules
- Referenced existing files with `@` mentions when iterating on specific modules
- Used Cursor rules implicitly via workspace conventions (TypeScript strict, existing patterns)

## 3. How I Use AI for Requirement Analysis

- Asked AI to review the PDF and suggest tech stack aligned with competency norms
- Used AI to break down functional vs non-functional requirements and identify edge cases
- Documented assumptions (no auth, seeded users, terminal states) before coding

## 4. How I Use AI for Planning and Design

- Generated phase-wise implementation plan with milestones and risk mitigation
- AI helped draft API contract, data model ERD, and UI flow diagrams
- Planned backend-before-frontend order to reduce state machine rework

## 5. How I Use AI for Code Generation

- Scaffolded monorepo structure, Express routes, React pages, and repository layer
- Generated Zod schemas, state machine service, and integration test matrix
- Accepted most structural code; manually adjusted import paths and DB layer after Prisma fallback

## 6. How I Validate AI-Generated Code

- Ran `npm test` after backend implementation (12/12 passing)
- Verified migration and seed scripts execute successfully
- Cross-checked state machine rules against PDF spec manually
- Reviewed generated SQL schema for FK constraints and indexes

## 7. How I Use AI for Testing

- AI generated the full state machine test matrix (10 transition tests + 2 validation tests)
- Ran tests locally and fixed failures (import paths, DB setup)
- Pasted test output into test-results.md

## 8. How I Use AI for Debugging

- When Prisma engine download failed (403/certificate errors), AI diagnosed and switched to better-sqlite3
- Fixed migrate.ts import path error (`./lib` → `../lib`)
- Fixed db path resolution for monorepo structure

## 9. How I Use AI for Code Review

- Self-review pass: checked for hardcoded IDs, secrets in repo, state machine duplication
- AI suggested centralizing error handling and keeping frontend transition map in sync with backend
- Documented findings in code-review-notes.md

## 10. What Information I Avoid Sharing Unnecessarily

- No API keys, tokens, or credentials
- No internal company URLs or proprietary data
- No `.env` file contents — only `.env.example` with placeholders
- No personal data beyond name in candidate-info.md

## 11. How I Would Reuse This Workflow in a Real Project

1. Start with requirements doc + acceptance criteria before any code
2. Maintain persistent project context file for the AI tool
3. Build and test critical business logic (state machine) before UI
4. Log prompts by lifecycle phase in `ai-prompts/`
5. Run integration tests in CI on every PR
6. Keep artifacts (API contract, data model) updated as code evolves
