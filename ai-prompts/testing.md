# Testing Prompts

## Prompt 1: State Machine Integration Tests

**Prompt:** Generate Vitest + Supertest integration tests for all valid and invalid status transitions.

**AI Response Summary:** 12 tests covering full transition matrix plus validation edge cases.

**Accepted:** All 12 tests as generated.
**Changed:** Updated imports after Prisma → better-sqlite3 switch; fixed test DB setup.
**Rejected:** None.

**Result:** 12/12 tests passing.
