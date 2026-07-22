# Implementation Plan

## Overview

9-phase delivery plan for Core Support Ticket Management System. Backend state machine and tests built before frontend to reduce rework.

## Task Breakdown

| Phase | Task | Status |
|-------|------|--------|
| 0 | Repo scaffold, monorepo, Cursor workflow files | Done |
| 1 | Requirements and design artifacts | Done |
| 2 | SQLite schema, migration, seed data | Done |
| 3 | Express API, Zod validation, state machine | Done |
| 4 | Integration tests for state machine | Done |
| 5 | React UI (list, detail, create, comments) | Done |
| 6 | Search/filter polish, error states | Done |
| 7 | Debugging and code review artifacts | Done |
| 8 | README, reflection, submission readiness | Done |

## Milestones

1. **M1 — Backend ready:** API + tests passing
2. **M2 — Frontend ready:** All user flows working
3. **M3 — Submission ready:** Artifacts complete, README verified

## AI Usage Plan

| Phase | AI Role |
|-------|---------|
| Planning | Requirement breakdown, tech stack selection, phase plan |
| Design | API contract, data model, state machine rules |
| Implementation | Scaffold generation, route/repository code, React components |
| Testing | Integration test matrix generation |
| Debugging | Path resolution fixes, import errors |
| Review | Self-review checklist, security check (no secrets) |
| Documentation | README, reflection, artifact templates |

## Risks

| Risk | Mitigation |
|------|------------|
| State machine only in frontend | Enforce on backend; test with Supertest |
| Prisma binary download blocked | Switched to better-sqlite3 with raw SQL |
| Over-scoping Stretch features | Strict Core-only scope |
| Weak prompt history | Log prompts during each phase |

## Mitigation

Built backend state machine and integration tests before frontend. Used SQLite with SQL migration files for simple local setup. Kept artifact files updated in parallel with code.
