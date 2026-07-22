# Debugging Notes

## Issue 1: Prisma Engine Binary Download Failure

### Problem

Running `npx prisma migrate dev` failed with:
```
Failed to fetch the engine file at https://binaries.prisma.sh/.../libquery_engine.dylib.node.gz - 403 Forbidden
```

### How I Investigated

1. Tried `NODE_TLS_REJECT_UNAUTHORIZED=0` — still 403
2. Tried `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` — still 403
3. Checked if engines were cached locally — not found
4. Verified `better-sqlite3` installs successfully from npm registry

### How AI Helped

AI diagnosed this as a network/proxy restriction on binaries.prisma.sh and suggested switching to better-sqlite3 with raw SQL migrations as a drop-in alternative for SQLite.

### What I Validated

- better-sqlite3 installs and connects to SQLite
- Same schema (User, Ticket, Comment) works with raw SQL
- All 12 integration tests pass with new data layer
- Seed script populates same sample data

### Final Fix

Replaced Prisma with better-sqlite3:
- `database/schema-or-migrations/001_init.sql` for schema
- `src/server/src/lib/db.ts` for connection and migration
- `repositories/` for data access
- Updated tests and seed script imports

---

## Issue 2: migrate.ts Module Not Found

### Problem

`npm run db:migrate` failed with `ERR_MODULE_NOT_FOUND` for `scripts/lib/db.js`.

### How I Investigated

Read migrate.ts — import was `./lib/db.js` but file is at `../lib/db.js` relative to scripts/.

### How AI Helped

Confirmed the relative path was wrong for the file location.

### What I Validated

Ran `npx tsx src/scripts/migrate.ts` directly — succeeded after fix.

### Final Fix

Changed import from `./lib/db.js` to `../lib/db.js`.
