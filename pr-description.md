# PR Description

## Summary

Implements Core Support Ticket Management System — a full-stack app for creating, managing, and tracking support tickets with an enforced status state machine.

## Features Implemented

- Ticket CRUD (create, list, view, update)
- Status state machine with backend enforcement
- Comment threads on tickets
- Keyword search and status filter
- Seeded users for creator/assignee selection
- Error handling with meaningful UI feedback

## Technical Changes

- **Frontend:** React 19 + Vite + Tailwind CSS with 3 pages and 7 components
- **Backend:** Express REST API with Zod validation and repository pattern
- **Database:** SQLite with SQL migration and seed scripts
- **Tests:** 12 integration tests (Vitest + Supertest)

## Database Changes

- New tables: User, Ticket, Comment
- Migration: `database/schema-or-migrations/001_init.sql`
- Seed: 3 users, 5 tickets, 3 comments

## Testing Done

- 12/12 integration tests passing
- Manual smoke tests for all UI flows
- State machine: 5 valid + 5 invalid transitions verified

## AI Usage Summary

Cursor used across all lifecycle phases. Key AI contributions: project scaffold, test matrix, artifact drafting. Manual intervention needed for Prisma → better-sqlite3 fallback.

## Screenshots / Demo Notes

Run `npm run dev` and visit http://localhost:5173. Seeded tickets appear on the list page. Click any ticket to view detail, change status, or add comments.

## Known Limitations

- No authentication (Core scope — Stretch feature)
- No pagination or sorting (Stretch)
- Frontend/backend status transition maps maintained separately
- SQLite only (no PostgreSQL variant)

## Future Improvements

- JWT authentication with role-based access
- Pagination and advanced filters
- E2E browser tests
- Docker Compose setup
- OpenAPI/Swagger documentation
