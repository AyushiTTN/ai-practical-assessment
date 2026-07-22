# Design Notes

## Architecture Overview

Three-tier architecture:
- **Frontend:** React SPA (Vite) on port 5173, proxies `/api` to backend
- **Backend:** Express REST API on port 3001
- **Database:** SQLite file (`dev.db`) via better-sqlite3

## Frontend Design

- **Pages:** TicketListPage, TicketCreatePage, TicketDetailPage
- **Components:** TicketForm, SearchFilterBar, StatusTransitionButtons, CommentList, CommentForm, ErrorAlert, Badges
- **Routing:** React Router with `/`, `/tickets/new`, `/tickets/:id`
- **API layer:** `api/tickets.ts` with typed fetch wrappers and error handling
- **Status UX:** Frontend mirrors allowed transitions for button visibility; backend is source of truth

## Backend Design

- **Pattern:** Routes → Zod validation → Repository → SQLite
- **State machine:** Pure function `canTransition(from, to)` in `services/stateMachine.ts`
- **Error handling:** Central middleware; AppError for known errors, ZodError for validation
- **Repositories:** `userRepository.ts`, `ticketRepository.ts` encapsulate SQL queries

## Database Design

- **User:** id (UUID), name, email (unique), role (AGENT|ADMIN)
- **Ticket:** id, title, description, priority, status, assignedToId (nullable FK), createdById (FK), timestamps
- **Comment:** id, ticketId (FK, cascade delete), message, createdById (FK), createdAt
- **Indexes:** status, title, ticketId on comments

## Validation Strategy

- Zod schemas for request body and query params
- Repository-level FK existence checks for user IDs
- State machine check before status update (409 on invalid)

## Error Handling Strategy

| Scenario | HTTP | Response |
|----------|------|----------|
| Validation failure | 400 | `{ error, details[] }` |
| Not found | 404 | `{ error }` |
| Invalid transition | 409 | `{ error: "Invalid status transition..." }` |
| Server error | 500 | `{ error: "Internal server error" }` |

## Testing Strategy Link

See [test-strategy.md](test-strategy.md). Focus: integration tests for all state machine transitions before frontend work.
