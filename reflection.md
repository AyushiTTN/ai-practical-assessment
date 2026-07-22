# Reflection

## What I Built

A Support Ticket Management System with React frontend, Express API, and SQLite persistence. Core features include ticket CRUD, comment threads, keyword search, status filtering, and a backend-enforced status state machine with 12 passing integration tests.

## How I Used AI (across the lifecycle)

| Phase | AI Contribution |
|-------|----------------|
| Planning | Tech stack selection, 9-phase plan |
| Design | API contract, data model, UI flows |
| Implementation | Full codebase scaffold, routes, repositories, React pages |
| Testing | Integration test matrix generation |
| Debugging | Prisma fallback diagnosis, import path fix |
| Review | Self-review checklist, security check |
| Documentation | README, artifacts, reflection |

## What AI Helped With Most

- Generating the complete state machine test matrix (10 transitions + edge cases) in one pass
- Scaffolding the monorepo structure with correct separation of concerns
- Drafting lifecycle artifacts (requirements, API contract, design notes) from the PDF spec

## What AI Got Wrong

- Initial Prisma setup assumed engine binaries would download — they didn't in this environment (403 Forbidden). Required manual pivot to better-sqlite3.
- migrate.ts had wrong relative import path (`./lib` instead of `../lib`).

## How I Validated AI Output

- Ran `npm test` — 12/12 passing before proceeding to frontend
- Manually verified state machine rules against PDF spec
- Tested UI flows: create, search, filter, status transition, error display
- Confirmed data persists after server restart

## What I Would Improve Next

1. Add E2E tests with Playwright for UI flows
2. Extract shared status transition map to a package used by both frontend and backend
3. Add pagination for ticket list (Stretch)
4. Implement authentication with role-based access (Stretch)
5. Add Docker Compose for reproducible environment

## Reusable Workflow

1. **Persistent context file** (`project-context.md`) — stack, constraints, critical rules
2. **Backend-first for business logic** — state machine tested before UI
3. **Prompt logging by phase** — `ai-prompts/planning.md` through `documentation.md`
4. **Cursor rules** — enforce architecture patterns (repository, validation, error handling)
5. **Artifact parallel tracking** — update docs as code evolves, not at the end
