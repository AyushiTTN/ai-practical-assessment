# Review Fixes

## Fix 1: Data Layer Migration (Prisma → better-sqlite3)

**Finding:** Prisma engine binaries unavailable in environment.
**Action:** Replaced entire data access layer with better-sqlite3 + SQL migrations.
**Files changed:** `lib/db.ts`, `repositories/`, `database/schema-or-migrations/001_init.sql`, `database/seed-data/seed.ts`, `package.json`, tests.

## Fix 2: Import Path in migrate.ts

**Finding:** Wrong relative import caused module not found.
**Action:** Changed `./lib/db.js` to `../lib/db.js`.
**Files changed:** `src/server/src/scripts/migrate.ts`.

## Fix 3: .gitignore Completeness

**Finding:** Ensure database files and env not committed.
**Action:** Verified `.gitignore` includes `*.db`, `*.db-journal`, `.env`.
**Files changed:** `.gitignore` (no change needed — already correct).
