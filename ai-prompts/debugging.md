# Debugging Prompts

## Prompt 1: Prisma Engine Download Failure

**Prompt:** Prisma migrate fails with 403 Forbidden on binaries.prisma.sh — how to fix?

**AI Response Summary:** Network/corporate proxy blocking Prisma binaries. Suggested better-sqlite3 or node:sqlite as alternatives.

**Accepted:** Switched to better-sqlite3 with raw SQL migrations.
**Changed:** Rewrote data layer (db.ts, repositories) while keeping same schema.
**Rejected:** NODE_TLS_REJECT_UNAUTHORIZED workaround (didn't resolve 403).

## Prompt 2: migrate.ts Import Error

**Prompt:** ERR_MODULE_NOT_FOUND for scripts/lib/db.js

**AI Response Summary:** Wrong relative import path in migrate.ts.

**Accepted:** Changed `./lib/db.js` to `../lib/db.js`.
**Changed:** One line fix.
**Rejected:** None.
