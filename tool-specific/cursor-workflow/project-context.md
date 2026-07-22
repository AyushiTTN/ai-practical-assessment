# Project Context

## Stack

- Frontend: React 19 + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: SQLite via better-sqlite3
- Validation: Zod
- Testing: Vitest + Supertest
- AI Tool: Cursor

## Project

Support Ticket Management System — Core only. No authentication. Users are seeded.

## State Machine Rules (CRITICAL)

```
OPEN        → IN_PROGRESS, CANCELLED
IN_PROGRESS → RESOLVED, CANCELLED
RESOLVED    → CLOSED
CLOSED      → (terminal)
CANCELLED   → (terminal)
```

- Backend MUST reject invalid transitions with 409
- Integration tests MUST cover all valid and invalid transitions
- Frontend mirrors allowed transitions for UX only

## Constraints

- Core scope only — no auth, Docker, Swagger, pagination
- SQLite for local dev (no external DB required)
- No secrets in repo
- All lifecycle artifacts required in repository

## Repository Structure

Monorepo with `src/server`, `src/client`, `tests/`, `database/`, `ai-prompts/`, `tool-specific/cursor-workflow/`
