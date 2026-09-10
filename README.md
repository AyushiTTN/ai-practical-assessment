# Support Ticket Management System

AI-assisted full-stack assessment project — Core implementation.

## Prerequisites

- Node.js 20+ (tested on v24)
- npm 9+

## Quick Start

```bash
git clone <repo-url>
cd ai-practical-assessment
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001/api

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend + frontend concurrently |
| `npm test` | Run integration tests (12 tests) |
| `npm run db:migrate` | Create/update database tables |
| `npm run db:seed` | Insert sample users, tickets, comments |
| `npm run db:reset` | Delete DB, re-migrate, re-seed |
| `npm run build` | Build server and client |

## Project Structure

```
ai-practical-assessment/
├── src/
│   ├── server/          # Express API + SQLite
│   └── client/          # React + Vite + Tailwind
├── tests/
│   └── integration/     # State machine tests
├── database/
│   ├── schema-or-migrations/
│   └── seed-data/
├── ai-prompts/          # AI prompt history by phase
├── tool-specific/cursor-workflow/
└── [lifecycle artifacts]  # requirements, design, reflection, etc.
```

## Features (Core)

- Create, list, view, and update support tickets
- Status state machine (Open → In Progress → Resolved → Closed, with Cancelled branch)
- Add comments to tickets
- Keyword search and status filter
- Backend validation and error handling
- 12 integration tests for state machine rules
- In-app help chatbot (rule-based guidance for tickets, search, status flow, and errors)

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, TypeScript, Zod
- **Database:** SQLite via better-sqlite3
- **Testing:** Vitest, Supertest
- **AI Tool:** Cursor

## Seeded Users

| Name | Role |
|------|------|
| Alice Agent | AGENT |
| Bob Agent | AGENT |
| Carol Admin | ADMIN |

No login required — select user from dropdown when creating tickets or comments.

## API

See [api-contract.md](api-contract.md) for full endpoint documentation.

## Testing

```bash
npm test
```

Integration tests cover valid/invalid status transitions, validation errors, and help chat responses.

## Documentation

- [Requirements Analysis](requirements-analysis.md)
- [Design Notes](design-notes.md)
- [Test Strategy](test-strategy.md)
- [Tool Workflow](tool-workflow.md)
- [Reflection](reflection.md)
