# Database Setup Notes

## Choice

SQLite via better-sqlite3 — zero external dependencies, file-based persistence, valid per assessment PDF.

## Files

- **Schema:** `database/schema-or-migrations/001_init.sql`
- **Seed:** `database/seed-data/seed.ts`
- **DB file:** `src/server/dev.db` (created on first run, gitignored)

## Setup Commands

```bash
# From project root
cp .env.example .env
npm run db:migrate    # Creates tables
npm run db:seed       # Inserts sample users, tickets, comments
```

## Environment Variable

```
DATABASE_URL="file:./dev.db"
```

Relative to `src/server/` directory.

## Seed Data

- **Users:** Alice Agent, Bob Agent, Carol Admin
- **Tickets:** 5 tickets across all status values
- **Comments:** 3 comments on active tickets

## Reset Database

```bash
npm run db:reset
```

Deletes dev.db, re-runs migration and seed.

## Note on Prisma

Initial plan used Prisma ORM, but Prisma engine binaries could not be downloaded in this environment (403 Forbidden). Switched to better-sqlite3 with raw SQL migrations. Schema and relationships remain identical.
