# Implementation Prompts

## Prompt 1: Full Project Scaffold

**Prompt:** Implement the phase-wise plan — create monorepo, Express API, React frontend, SQLite database.

**AI Response Summary:** Generated full project structure with routes, repositories, components, pages.

**Accepted:** Monorepo layout, route structure, React pages, repository pattern.
**Changed:** Replaced Prisma with better-sqlite3; fixed import paths in migrate.ts and seed.ts.
**Rejected:** Prisma ORM (binary download blocked in environment).

## Prompt 2: Repository Layer

**Prompt:** Create SQLite repositories for users, tickets, and comments.

**AI Response Summary:** userRepository.ts and ticketRepository.ts with prepared statements.

**Accepted:** Full repository implementation.
**Changed:** Adjusted db path resolution for monorepo.
**Rejected:** None.
